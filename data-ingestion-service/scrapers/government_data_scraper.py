"""
Government Data Scraper (Section 6)
Scrapes official open government portals, NCRB aggregate statistics, and state police datasets.
Extracts macro-level aggregated statistics: State, District, Year, Category, Aggregated Counts.
Never processes private personal allegations.
"""
from bs4 import BeautifulSoup
import re
import json
import logging
from typing import List, Dict, Any
from .base_scraper import BaseScraper

logger = logging.getLogger("GovernmentDataScraper")

class GovernmentDataScraper(BaseScraper):
    def __init__(self, source_config: Dict[str, Any]):
        super().__init__(source_config)
        self.source_badge = "OPEN DATA"
        self.reliability_level = "Official Government Source"

    def parse(self, raw_content: str) -> List[Dict[str, Any]]:
        """
        Parses government portal tables or open data markup.
        Detects tables containing State, District, Crime Head, and Incident Counts.
        """
        records = []
        # If response is JSON (Open Government Data API endpoint format)
        if raw_content.strip().startswith("{") or raw_content.strip().startswith("["):
            try:
                data = json.loads(raw_content)
                if isinstance(data, dict) and "records" in data:
                    rows = data["records"]
                elif isinstance(data, list):
                    rows = data
                else:
                    rows = []

                for r in rows:
                    records.append({
                        "external_id": str(r.get("id") or r.get("record_id") or f"OGD-{len(records)+1}"),
                        "title": f"Official Crime Statistics: {r.get('crime_head', r.get('category', 'All IPC Crimes'))} - {r.get('state', 'National')}",
                        "description": f"Annual aggregate incident count: {r.get('incidents_reported', r.get('count', 'N/A'))} recorded under {r.get('crime_head', 'Aggregate Offenses')}.",
                        "category": r.get("crime_head") or r.get("category") or "AGGREGATE_STATISTICS",
                        "state": r.get("state") or "Tamil Nadu",
                        "district": r.get("district"),
                        "event_date": f"{r.get('year', '2025')}-12-31",
                        "source_url": self.base_url,
                        "latitude": r.get("latitude"),
                        "longitude": r.get("longitude")
                    })
                return records
            except Exception as e:
                logger.warning(f"Failed JSON parsing in GovernmentDataScraper: {e}, falling back to HTML parser.")

        # HTML Table extraction
        soup = BeautifulSoup(raw_content, "html.parser")
        tables = soup.find_all("table")

        if not tables:
            # Fallback for open data article/bulletin structure
            articles = soup.find_all(["article", "div"], class_=re.compile(r'(bulletin|notice|report|stat-item)', re.I))
            for i, art in enumerate(articles[:50]):
                title_elem = art.find(["h2", "h3", "h4", "a"])
                desc_elem = art.find(["p", "div", "span"])
                if title_elem:
                    records.append({
                        "external_id": f"GOV-STAT-{i+1}",
                        "title": title_elem.get_text(strip=True),
                        "description": desc_elem.get_text(strip=True) if desc_elem else "Official public statistics release.",
                        "category": "AGGREGATE_STATISTICS",
                        "state": "National",
                        "source_url": self.base_url
                    })
            return records

        for table in tables:
            headers = [th.get_text(strip=True).lower() for th in table.find_all("th")]
            rows = table.find_all("tr")
            for idx, row in enumerate(rows):
                cols = [td.get_text(strip=True) for td in row.find_all("td")]
                if len(cols) >= 3:
                    state = cols[0] if len(cols) > 0 else "National"
                    category = cols[1] if len(cols) > 1 else "Crime Trend"
                    count = cols[2] if len(cols) > 2 else "0"

                    records.append({
                        "external_id": f"NCRB-STAT-{idx+1}",
                        "title": f"NCRB Aggregate Statistics: {category} in {state}",
                        "description": f"Annual aggregate recorded occurrences: {count} cases documented in official records.",
                        "category": category,
                        "state": state,
                        "district": cols[3] if len(cols) > 3 else None,
                        "event_date": "2025-12-31",
                        "source_url": self.base_url
                    })

        return records
