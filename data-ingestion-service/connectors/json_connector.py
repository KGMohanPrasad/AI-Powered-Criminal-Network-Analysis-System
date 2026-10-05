"""
JSON Dataset Connector (Section 2, 5)
Imports official downloadable open JSON datasets.
"""
import time
import json
import httpx
import logging
from typing import Dict, Any, List
from utils.ssrf_guard import ensure_safe_url
from utils.user_agent import get_research_headers
from processing.cleaner import clean_record
from processing.normalizer import normalize_date, normalize_state, normalize_district, normalize_category
from processing.deduplicator import Deduplicator
from processing.validator import validate_record
from config.settings import DEFAULT_REQUEST_TIMEOUT

logger = logging.getLogger("JsonConnector")

class JsonConnector:
    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.file_url_or_path = config.get("base_url", "")
        self.source_id = config.get("id", 0)
        self.source_name = config.get("source_name", "Open Data JSON")
        self.source_badge = "OPEN DATA"
        self.reliability_level = "Official Government Source"
        self.deduplicator = Deduplicator()

    def fetch_data(self) -> Any:
        if self.file_url_or_path.startswith("http://") or self.file_url_or_path.startswith("https://"):
            ensure_safe_url(self.file_url_or_path)
            with httpx.Client(timeout=DEFAULT_REQUEST_TIMEOUT, verify=False) as client:
                res = client.get(self.file_url_or_path, headers=get_research_headers())
                res.raise_for_status()
                return res.json()
        else:
            with open(self.file_url_or_path, "r", encoding="utf-8") as f:
                return json.load(f)

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
            data = self.fetch_data()
            items = data if isinstance(data, list) else data.get("records", data.get("data", []))
            records_found = len(items)
            normalized = []

            for idx, item in enumerate(items):
                cleaned = clean_record(item)
                title = cleaned.get("title") or cleaned.get("crime_head") or "Official Statistical Record"
                norm_cat, _ = normalize_category(cleaned.get("category") or title)
                state = normalize_state(cleaned.get("state") or "National")
                district = normalize_district(cleaned.get("district"))

                rec = {
                    "external_id": str(cleaned.get("id") or f"JSON-{idx+1}"),
                    "title": str(title),
                    "description": str(cleaned.get("description") or f"Open government statistical metric for {state}."),
                    "category": norm_cat,
                    "event_date": normalize_date(cleaned.get("date") or cleaned.get("year")),
                    "state": state,
                    "district": district,
                    "country": "India",
                    "source_id": self.source_id,
                    "source_name": self.source_name,
                    "source_url": self.file_url_or_path,
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
            logger.exception(f"JsonConnector error: {e}")

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
