"""
Duplicate Detector & Fingerprint Generator (Section 15)
Generates SHA-256 fingerprint from immutable source attributes to guarantee deduplication.
"""
import hashlib
from typing import Optional, Set

class Deduplicator:
    def __init__(self):
        # In-memory fingerprint cache for current run
        self.seen_fingerprints: Set[str] = set()

    @staticmethod
    def generate_fingerprint(
        source_name: str,
        external_id: Optional[str],
        title: str,
        event_date: Optional[str],
        location: Optional[str],
        source_url: str
    ) -> str:
        """
        Creates a deterministic SHA-256 fingerprint from core attributes.
        """
        raw_components = [
            (source_name or "").strip().lower(),
            (external_id or "").strip().lower(),
            (title or "").strip().lower(),
            (event_date or "").strip(),
            (location or "").strip().lower(),
            (source_url or "").strip().lower()
        ]
        composite_key = "|".join(raw_components)
        return hashlib.sha256(composite_key.encode("utf-8")).hexdigest()

    def is_duplicate(self, fingerprint: str) -> bool:
        """
        Checks if fingerprint has already been processed in the current session.
        """
        if fingerprint in self.seen_fingerprints:
            return True
        self.seen_fingerprints.add(fingerprint)
        return False

    def reset(self):
        self.seen_fingerprints.clear()
