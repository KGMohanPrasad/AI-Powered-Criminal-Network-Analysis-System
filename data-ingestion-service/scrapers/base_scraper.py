"""
BaseScraper Abstract Class (Section 10, 11, 12, 13, 15, 16, 17, 45, 49)
Defines standard lifecycle for all permitted public scrapers.
"""
from abc import ABC, abstractmethod
import time
import logging
from typing import List, Dict, Any, Optional
import httpx

from utils.ssrf_guard import ensure_safe_url, SSRFSecurityException
from utils.robots_checker import check_robots_permission, RobotsBlockException
from utils.rate_limiter import wait_for_domain_rate_limit, calculate_backoff
from utils.user_agent import get_research_headers
from processing.cleaner import clean_record
from processing.normalizer import normalize_date, normalize_time, normalize_state, normalize_district, normalize_category
from processing.deduplicator import Deduplicator
from processing.validator import validate_record
from config.settings import DEFAULT_REQUEST_TIMEOUT, MAX_RETRIES

logger = logging.getLogger("BaseScraper")

class BaseScraper(ABC):
    def __init__(self, source_config: Dict[str, Any]):
        self.source_config = source_config
        self.source_id = source_config.get("id", 0)
        self.source_name = source_config.get("source_name", "Unknown Source")
        self.base_url = source_config.get("base_url", "")
        self.category = source_config.get("category", "PUBLIC_SAFETY")
        self.source_badge = source_config.get("source_badge", "OFFICIAL")
        self.reliability_level = source_config.get("reliability_level", "Official Government Source")
        self.deduplicator = Deduplicator()
        self.client = httpx.Client(
            timeout=DEFAULT_REQUEST_TIMEOUT,
            headers=get_research_headers(),
            follow_redirects=True,
            verify=False  # To handle government portals with domestic root certificates
        )

    def validate_source(self) -> None:
        """
        Validates URL with SSRF guard and robots.txt check.
        """
        # 1. SSRF check
        ensure_safe_url(self.base_url)

        # 2. Robots.txt check (Section 13)
        allowed, msg = check_robots_permission(self.base_url)
        if not allowed:
            logger.error(f"Crawling blocked for {self.base_url}: {msg}")
            raise RobotsBlockException(msg)

    def fetch(self, url: Optional[str] = None) -> str:
        """
        Fetches web page content with polite rate limiting, retry strategy, and 429/503 handling.
        """
        target_url = url or self.base_url
        ensure_safe_url(target_url)

        # Respectful delay (Section 12)
        wait_for_domain_rate_limit(target_url)

        for attempt in range(1, MAX_RETRIES + 1):
            try:
                response = self.client.get(target_url)
                if response.status_code == 200:
                    return response.text
                elif response.status_code in (429, 503):
                    retry_after = response.headers.get("Retry-After")
                    delay = calculate_backoff(attempt, retry_after)
                    logger.warning(f"HTTP {response.status_code} for {target_url}. Retrying in {delay:.1f}s (Attempt {attempt}/{MAX_RETRIES})")
                    time.sleep(delay)
                elif response.status_code == 403:
                    logger.error(f"HTTP 403 Forbidden for {target_url}. Halting crawling.")
                    raise PermissionError(f"Access forbidden by source: HTTP 403 ({target_url})")
                else:
                    logger.error(f"HTTP {response.status_code} received from {target_url}")
                    response.raise_for_status()
            except httpx.TimeoutException as e:
                if attempt == MAX_RETRIES:
                    raise TimeoutError(f"Request timed out after {MAX_RETRIES} attempts for {target_url}: {e}")
                time.sleep(calculate_backoff(attempt))
            except httpx.RequestError as e:
                if attempt == MAX_RETRIES:
                    raise RuntimeError(f"Network error fetching {target_url}: {e}")
                time.sleep(calculate_backoff(attempt))

        raise RuntimeError(f"Failed to fetch content from {target_url} after {MAX_RETRIES} attempts.")

    @abstractmethod
    def parse(self, raw_content: str) -> List[Dict[str, Any]]:
        """
        Parses raw text/HTML/JSON into dictionary items.
        Must be implemented by subclasses.
        """
        pass

    def normalize(self, raw_items: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Normalizes parsed items into uniform public data record format.
        """
        normalized_records = []
        for item in raw_items:
            # 1. Clean strings & HTML
            cleaned = clean_record(item)

            # 2. Normalize dates and times
            event_date = normalize_date(cleaned.get("event_date") or cleaned.get("date") or cleaned.get("published_date"))
            event_time = normalize_time(cleaned.get("event_time") or cleaned.get("time"))

            # 3. Normalize state and district
            state = normalize_state(cleaned.get("state"))
            district = normalize_district(cleaned.get("district"))
            city = cleaned.get("city") or district

            # 4. Normalize category
            norm_cat, raw_cat = normalize_category(cleaned.get("category") or self.category)

            # 5. Extract coordinates if present
            lat = cleaned.get("latitude")
            lon = cleaned.get("longitude")
            try:
                lat = float(lat) if lat is not None else None
                lon = float(lon) if lon is not None else None
            except (ValueError, TypeError):
                lat, lon = None, None

            # 6. Build unified model dict
            rec = {
                "external_id": cleaned.get("external_id") or f"EXT-{int(time.time()*1000)}",
                "title": cleaned.get("title") or cleaned.get("headline") or "Public Notice",
                "description": cleaned.get("description") or cleaned.get("summary") or "",
                "category": norm_cat,
                "raw_category": raw_cat,
                "event_date": event_date,
                "event_time": event_time,
                "country": cleaned.get("country", "India"),
                "state": state,
                "district": district,
                "city": city,
                "latitude": lat,
                "longitude": lon,
                "source_id": self.source_id,
                "source_name": self.source_name,
                "source_url": cleaned.get("source_url") or cleaned.get("link") or self.base_url,
                "source_badge": self.source_badge,
                "data_origin": "REAL_PUBLIC",
                "reliability_level": self.reliability_level,
                "retrieved_at": time.strftime("%Y-%m-%d %H:%M:%S")
            }

            # 7. Generate deterministic fingerprint for duplicate detection
            rec["fingerprint"] = Deduplicator.generate_fingerprint(
                source_name=self.source_name,
                external_id=rec["external_id"],
                title=rec["title"],
                event_date=rec["event_date"],
                location=rec["state"] or rec["district"],
                source_url=rec["source_url"]
            )

            normalized_records.append(rec)

        return normalized_records

    def validate_records(self, records: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Runs validation and ethical safeguards on all records.
        """
        valid_records = []
        for r in records:
            is_valid, errors, verification_status = validate_record(r)
            if is_valid:
                r["verification_status"] = verification_status
                valid_records.append(r)
            else:
                logger.warning(f"Record validation failed for external_id '{r.get('external_id')}': {errors}")
        return valid_records

    def execute(self) -> Dict[str, Any]:
        """
        Runs complete extraction pipeline with error handling.
        Returns execution summary dict.
        """
        start_time = time.strftime("%Y-%m-%d %H:%M:%S")
        records_found = 0
        records_created = 0
        records_skipped = 0
        errors = 0
        error_message = None
        status = "SUCCESS"
        final_records = []

        try:
            # 1. Validate
            self.validate_source()

            # 2. Fetch
            raw_text = self.fetch()

            # 3. Parse
            raw_items = self.parse(raw_text)
            records_found = len(raw_items)

            # 4. Normalize
            normalized = self.normalize(raw_items)

            # 5. Deduplicate
            deduped = []
            for item in normalized:
                fp = item["fingerprint"]
                if self.deduplicator.is_duplicate(fp):
                    records_skipped += 1
                else:
                    deduped.append(item)

            # 6. Validate & Safeguard
            valid_records = self.validate_records(deduped)
            records_created = len(valid_records)
            final_records = valid_records

            if records_created == 0 and records_found > 0 and records_skipped == 0:
                status = "PARSER_ERROR"
                error_message = "SOURCE_STRUCTURE_CHANGED: Extracted 0 valid records from source."

        except RobotsBlockException as e:
            status = "SOURCE_BLOCKED_BY_ROBOTS"
            error_message = str(e)
            errors += 1
        except SSRFSecurityException as e:
            status = "BLOCKED"
            error_message = str(e)
            errors += 1
        except Exception as e:
            status = "FAILED"
            error_message = str(e)
            errors += 1
            logger.exception(f"Error executing scraper for {self.source_name}: {e}")

        end_time = time.strftime("%Y-%m-%d %H:%M:%S")

        return {
            "source_id": self.source_id,
            "source_name": self.source_name,
            "start_time": start_time,
            "end_time": end_time,
            "status": status,
            "records_found": records_found,
            "records_created": records_created,
            "records_skipped": records_skipped,
            "errors": errors,
            "error_message": error_message,
            "records": final_records
        }
