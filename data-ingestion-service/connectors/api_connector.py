"""
Generic API Connector System (Section 9)
Configurable adapter for RESTful open-data endpoints.
Supports custom headers, auth methods, pagination, rate limiting, and response field mapping.
"""
import time
import httpx
import logging
from typing import Dict, Any, List, Optional
from utils.ssrf_guard import ensure_safe_url
from utils.rate_limiter import wait_for_domain_rate_limit, calculate_backoff
from utils.user_agent import get_research_headers
from processing.cleaner import clean_record
from processing.normalizer import normalize_date, normalize_time, normalize_state, normalize_district, normalize_category
from processing.deduplicator import Deduplicator
from processing.validator import validate_record
from config.settings import DEFAULT_REQUEST_TIMEOUT, MAX_RETRIES

logger = logging.getLogger("ApiConnector")

class ApiConnector:
    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.endpoint = config.get("base_url") or config.get("endpoint", "")
        self.http_method = config.get("http_method", "GET").upper()
        self.headers = config.get("headers", {})
        self.auth_type = config.get("auth_type", "NONE")  # NONE, BEARER, API_KEY_HEADER, API_KEY_QUERY
        self.api_key = config.get("api_key")
        self.query_params = config.get("query_params", {})
        self.pagination_type = config.get("pagination_type", "PAGE_NUMBER")  # NONE, PAGE_NUMBER, OFFSET_LIMIT
        self.records_path = config.get("records_path", "records")
        self.field_mapping = config.get("field_mapping", {
            "external_id": "id",
            "title": "title",
            "description": "description",
            "category": "category",
            "event_date": "date",
            "state": "state",
            "district": "district"
        })
        self.source_id = config.get("id", 0)
        self.source_name = config.get("source_name", "Open Data API")
        self.source_badge = config.get("source_badge", "OFFICIAL")
        self.reliability_level = config.get("reliability_level", "Official Government Source")
        self.deduplicator = Deduplicator()

    def build_headers(self) -> Dict[str, str]:
        headers = get_research_headers(self.headers)
        if self.auth_type == "BEARER" and self.api_key:
            headers["Authorization"] = f"Bearer {self.api_key}"
        elif self.auth_type == "API_KEY_HEADER" and self.api_key:
            headers["X-API-KEY"] = self.api_key
        return headers

    def build_params(self, page: int = 1) -> Dict[str, Any]:
        params = dict(self.query_params)
        if self.auth_type == "API_KEY_QUERY" and self.api_key:
            params["api-key"] = self.api_key
        if self.pagination_type == "PAGE_NUMBER":
            params["page"] = page
            params["limit"] = 50
        elif self.pagination_type == "OFFSET_LIMIT":
            params["offset"] = (page - 1) * 50
            params["limit"] = 50
        return params

    def fetch_page(self, page: int = 1) -> Dict[str, Any]:
        ensure_safe_url(self.endpoint)
        wait_for_domain_rate_limit(self.endpoint)
        headers = self.build_headers()
        params = self.build_params(page)

        with httpx.Client(timeout=DEFAULT_REQUEST_TIMEOUT, verify=False) as client:
            for attempt in range(1, MAX_RETRIES + 1):
                try:
                    if self.http_method == "POST":
                        resp = client.post(self.endpoint, headers=headers, json=params)
                    else:
                        resp = client.get(self.endpoint, headers=headers, params=params)

                    if resp.status_code == 200:
                        return resp.json()
                    elif resp.status_code in (429, 503):
                        delay = calculate_backoff(attempt)
                        logger.warning(f"HTTP {resp.status_code} in API Connector. Backing off for {delay}s")
                        time.sleep(delay)
                    else:
                        resp.raise_for_status()
                except Exception as e:
                    if attempt == MAX_RETRIES:
                        raise RuntimeError(f"API request failed after {MAX_RETRIES} attempts: {e}")
                    time.sleep(calculate_backoff(attempt))

        return {}

    def extract_records(self, json_data: Any) -> List[Dict[str, Any]]:
        if isinstance(json_data, list):
            return json_data
        if isinstance(json_data, dict):
            # Check configured path or common data keys
            if self.records_path in json_data and isinstance(json_data[self.records_path], list):
                return json_data[self.records_path]
            for key in ("records", "data", "items", "results"):
                if key in json_data and isinstance(json_data[key], list):
                    return json_data[key]
        return []

    def execute(self) -> Dict[str, Any]:
        start_time = time.strftime("%Y-%m-%d %H:%M:%S")
        records_found = 0
        records_created = 0
        records_skipped = 0
        errors = 0
        error_message = None
        status = "SUCCESS"
        final_records = []

        try:
            # Fetch first page
            json_response = self.fetch_page(page=1)
            raw_items = self.extract_records(json_response)
            records_found = len(raw_items)

            normalized = []
            for item in raw_items:
                cleaned = clean_record(item)
                # Map fields according to configuration
                ext_id = cleaned.get(self.field_mapping.get("external_id", "id")) or f"API-{len(normalized)+1}"
                title = cleaned.get(self.field_mapping.get("title", "title")) or "Government Public Metric"
                desc = cleaned.get(self.field_mapping.get("description", "description")) or ""
                raw_cat = cleaned.get(self.field_mapping.get("category", "category")) or "Public Safety"
                norm_cat, _ = normalize_category(raw_cat)
                event_date = normalize_date(cleaned.get(self.field_mapping.get("event_date", "date")))
                state = normalize_state(cleaned.get(self.field_mapping.get("state", "state")))
                district = normalize_district(cleaned.get(self.field_mapping.get("district", "district")))

                rec = {
                    "external_id": str(ext_id),
                    "title": str(title),
                    "description": str(desc),
                    "category": norm_cat,
                    "event_date": event_date,
                    "state": state or "National",
                    "district": district,
                    "country": "India",
                    "source_id": self.source_id,
                    "source_name": self.source_name,
                    "source_url": self.endpoint,
                    "source_badge": self.source_badge,
                    "data_origin": "REAL_PUBLIC",
                    "reliability_level": self.reliability_level,
                    "retrieved_at": time.strftime("%Y-%m-%d %H:%M:%S")
                }

                fp = Deduplicator.generate_fingerprint(
                    source_name=self.source_name,
                    external_id=rec["external_id"],
                    title=rec["title"],
                    event_date=rec["event_date"],
                    location=rec["state"] or rec["district"],
                    source_url=rec["source_url"]
                )
                rec["fingerprint"] = fp

                if self.deduplicator.is_duplicate(fp):
                    records_skipped += 1
                else:
                    is_valid, errs, v_status = validate_record(rec)
                    if is_valid:
                        rec["verification_status"] = v_status
                        normalized.append(rec)
                    else:
                        errors += 1

            records_created = len(normalized)
            final_records = normalized

        except Exception as e:
            status = "FAILED"
            error_message = str(e)
            errors += 1
            logger.exception(f"ApiConnector error: {e}")

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
