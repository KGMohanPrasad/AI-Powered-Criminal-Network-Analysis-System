"""
CSV Dataset Connector (Section 2, 5)
Imports official downloadable open CSV datasets (e.g. NCRB aggregate tables, Open Government Data).
"""
import time
import io
import pandas as pd
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

logger = logging.getLogger("CsvConnector")

class CsvConnector:
    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.file_url_or_path = config.get("base_url", "")
        self.source_id = config.get("id", 0)
        self.source_name = config.get("source_name", "Open Data CSV")
        self.source_badge = "OPEN DATA"
        self.reliability_level = "Official Government Source"
        self.deduplicator = Deduplicator()

    def fetch_dataframe(self) -> pd.DataFrame:
        if self.file_url_or_path.startswith("http://") or self.file_url_or_path.startswith("https://"):
            ensure_safe_url(self.file_url_or_path)
            with httpx.Client(timeout=DEFAULT_REQUEST_TIMEOUT, verify=False) as client:
                res = client.get(self.file_url_or_path, headers=get_research_headers())
                res.raise_for_status()
                return pd.read_csv(io.StringIO(res.text))
        else:
            return pd.read_csv(self.file_url_or_path)

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
            df = self.fetch_dataframe()
            records_found = len(df)
            normalized = []

            for idx, row in df.iterrows():
                row_dict = row.to_dict()
                cleaned = clean_record(row_dict)

                # Heuristic column detection
                title_col = next((k for k in cleaned if any(w in k.lower() for w in ["head", "title", "offence", "crime", "type"])), None)
                state_col = next((k for k in cleaned if "state" in k.lower()), None)
                dist_col = next((k for k in cleaned if "dist" in k.lower()), None)
                count_col = next((k for k in cleaned if any(w in k.lower() for w in ["count", "cases", "incident", "reported"])), None)
                year_col = next((k for k in cleaned if "year" in k.lower()), None)

                category_val = str(cleaned.get(title_col, "Aggregate Crime Trend")) if title_col else "AGGREGATE_STATISTICS"
                norm_cat, _ = normalize_category(category_val)
                state_val = normalize_state(str(cleaned.get(state_col, "National"))) if state_col else "National"
                dist_val = normalize_district(str(cleaned.get(dist_col, ""))) if dist_col else None
                year_val = str(cleaned.get(year_col, "2025")) if year_col else "2025"
                count_val = str(cleaned.get(count_col, "N/A")) if count_col else "Recorded"

                rec = {
                    "external_id": f"CSV-NCRB-{idx+1}",
                    "title": f"Aggregate Open Data: {category_val} in {state_val}",
                    "description": f"Annual verified cases recorded: {count_val} (Year {year_val}). Aggregated public statistical record.",
                    "category": norm_cat,
                    "event_date": f"{year_val}-12-31",
                    "state": state_val,
                    "district": dist_val,
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
            logger.exception(f"CsvConnector error: {e}")

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
