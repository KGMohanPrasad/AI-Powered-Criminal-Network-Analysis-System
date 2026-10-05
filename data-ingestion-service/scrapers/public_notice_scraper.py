"""
Public Notice & Police Advisory Scraper (Section 6, 7)
Retrieves official public safety advisories, police circulars, and judicial public notices.
Focuses strictly on advisories, fraud prevention bulletins, and public safety warnings.
"""
from bs4 import BeautifulSoup
import re
from urllib.parse import urljoin
from typing import List, Dict, Any
from .base_scraper import BaseScraper

class PublicNoticeScraper(BaseScraper):
    def __init__(self, source_config: Dict[str, Any]):
        super().__init__(source_config)
        self.source_badge = "OFFICIAL"
        self.reliability_level = "Official Government Source"

    def parse(self, raw_content: str) -> List[Dict[str, Any]]:
        """
        Parses HTML public safety bulletins, circular lists, and press releases.
        """
        soup = BeautifulSoup(raw_content, "html.parser")
        records = []

        # Find bulletin cards / list items / press items
        items = soup.find_all(["div", "li", "article"], class_=re.compile(r'(advisory|notice|circular|press-release|bulletin|news-item)', re.I))

        if not items:
            # Fallback to general list of links / table rows
            items = soup.find_all("tr")

        for idx, item in enumerate(items[:40]):
            title_tag = item.find(["h2", "h3", "h4", "h5", "a", "strong"])
            if not title_tag:
                continue

            title = title_tag.get_text(strip=True)
            if len(title) < 10:
                continue

            link_tag = item.find("a", href=True)
            link = urljoin(self.base_url, link_tag["href"]) if link_tag else self.base_url

            date_tag = item.find(["span", "time", "small", "em"], class_=re.compile(r'(date|time|published)', re.I))
            date_str = date_tag.get_text(strip=True) if date_tag else None

            desc_tag = item.find(["p", "div"], class_=re.compile(r'(desc|summary|text|content)', re.I))
            desc = desc_tag.get_text(strip=True) if desc_tag else f"Official public advisory regarding {title}."

            records.append({
                "external_id": f"PUB-NOT-{idx+1}",
                "title": title,
                "description": desc,
                "category": self.category,
                "event_date": date_str,
                "state": self.source_config.get("state", "Tamil Nadu"),
                "district": self.source_config.get("district", "Chennai"),
                "source_url": link
            })

        return records
