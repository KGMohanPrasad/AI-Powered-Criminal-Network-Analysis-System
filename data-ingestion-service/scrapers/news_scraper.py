"""
Live News Scraper (Section 7, 47)
Ingests permitted public crime trend and public safety news references.
Strictly respects copyright by storing ONLY:
- Headline
- Short summary (maximum 250 characters)
- Publication name
- Published date
- Category
- Location
- Original source URL (for full reading)
"""
from bs4 import BeautifulSoup
import re
from urllib.parse import urljoin
from typing import List, Dict, Any
from .base_scraper import BaseScraper

class NewsScraper(BaseScraper):
    def __init__(self, source_config: Dict[str, Any]):
        super().__init__(source_config)
        self.source_badge = "PUBLIC NEWS"
        self.reliability_level = "Public News Source"
        self.publication = source_config.get("publication", "National Press Service")

    def parse(self, raw_content: str) -> List[Dict[str, Any]]:
        """
        Parses headlines and short summaries from allowed news sources.
        """
        soup = BeautifulSoup(raw_content, "html.parser")
        records = []

        articles = soup.find_all(["article", "div"], class_=re.compile(r'(story|article|news-card|headline-card)', re.I))
        if not articles:
            articles = soup.find_all("div", class_=re.compile(r'(item|post)', re.I))

        for idx, art in enumerate(articles[:30]):
            title_elem = art.find(["h1", "h2", "h3", "h4", "a"])
            if not title_elem:
                continue

            headline = title_elem.get_text(strip=True)
            if len(headline) < 12:
                continue

            # Link
            link_elem = art.find("a", href=True)
            article_url = urljoin(self.base_url, link_elem["href"]) if link_elem else self.base_url

            # Short summary (capped at 250 chars per Section 47)
            desc_elem = art.find(["p", "div", "span"], class_=re.compile(r'(snippet|summary|teaser|intro)', re.I))
            raw_summary = desc_elem.get_text(strip=True) if desc_elem else f"News report published by {self.publication}."
            short_summary = (raw_summary[:247] + "...") if len(raw_summary) > 250 else raw_summary

            # Date
            date_elem = art.find(["time", "span"], class_=re.compile(r'(date|time|published)', re.I))
            date_str = date_elem.get_text(strip=True) if date_elem else None

            records.append({
                "external_id": f"NEWS-{idx+1}",
                "title": headline,
                "description": f"[{self.publication}] {short_summary}",
                "category": self.category,
                "event_date": date_str,
                "state": self.source_config.get("state", "National"),
                "district": self.source_config.get("district"),
                "source_url": article_url
            })

        return records
