"""
RSS Feed Scraper (Section 8)
Parses RSS and Atom syndicated feeds using feedparser.
Extracts title, short summary, link, publication, published date, and category.
"""
import feedparser
import logging
from typing import List, Dict, Any
from .base_scraper import BaseScraper

logger = logging.getLogger("RssScraper")

class RssScraper(BaseScraper):
    def __init__(self, source_config: Dict[str, Any]):
        super().__init__(source_config)
        self.source_badge = "RSS"
        self.reliability_level = source_config.get("reliability_level", "Verified Feed")
        self.publication = source_config.get("publication") or self.source_name

    def parse(self, raw_content: str) -> List[Dict[str, Any]]:
        """
        Parses RSS/Atom XML feed into structured records.
        """
        feed = feedparser.parse(raw_content)
        records = []

        if feed.bozo and not feed.entries:
            logger.warning(f"Feed parser reported syntax/bozo error for {self.source_name}: {feed.bozo_exception}")

        feed_title = feed.feed.get("title", self.source_name)

        for idx, entry in enumerate(feed.entries[:50]):
            title = entry.get("title", "Advisory Item")
            link = entry.get("link", self.base_url)
            summary = entry.get("summary") or entry.get("description") or "RSS Feed notification update."

            # Date parsing
            pub_date = entry.get("published") or entry.get("updated")

            # Categories from tags if available
            entry_cat = self.category
            if "tags" in entry and entry.tags:
                entry_cat = entry.tags[0].get("term", self.category)

            # Cap summary at 300 characters to adhere to copyright limitations
            clean_summary = summary[:297] + "..." if len(summary) > 300 else summary

            records.append({
                "external_id": entry.get("id") or f"RSS-{idx+1}",
                "title": title,
                "description": f"[{feed_title}] {clean_summary}",
                "category": entry_cat,
                "event_date": pub_date,
                "state": self.source_config.get("state", "National"),
                "district": self.source_config.get("district"),
                "source_url": link
            })

        return records
