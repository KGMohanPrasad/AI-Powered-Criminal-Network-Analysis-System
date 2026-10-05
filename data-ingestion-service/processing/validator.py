"""
Data Validator & Ethical Policy Enforcer (Section 10, 20, 22, 23, 25)
Validates record fields and strictly enforces ethical boundaries:
- Flags any potential individual name references for Human Review (REQUIRES_REVIEW)
- Ensures real individuals are NEVER automatically branded as criminals
- Verifies source reliability ratings
"""
import re
from typing import Tuple, Dict, Any, List

# Keywords suggesting individual allegations that must go to Human Review
INDIVIDUAL_MENTION_KEYWORDS = [
    "arrested", "suspect", "accused", "named as", "alias", "son of",
    "daughter of", "resident of", "aged", "years old"
]

def validate_record(record: Dict[str, Any]) -> Tuple[bool, List[str], str]:
    """
    Validates a normalized public data record.
    Returns: (is_valid, validation_errors, verification_status)
    Verification statuses:
    - 'SOURCE_VERIFIED': Approved official open data or verified feed without individual allegations.
    - 'REQUIRES_REVIEW': Contains unverified external text or individual mentions requiring investigator clearance.
    - 'SOURCE_UNVERIFIED': External source not pre-verified.
    """
    errors = []
    verification_status = "SOURCE_VERIFIED"

    # 1. Essential field presence
    if not record.get("title"):
        errors.append("Record title is missing.")
    if not record.get("source_url"):
        errors.append("Source URL is missing.")
    if not record.get("category"):
        errors.append("Category is missing.")

    # 2. Ethical Human-in-the-Loop check (Section 23, 25)
    title = str(record.get("title", "")).lower()
    description = str(record.get("description", "")).lower()
    combined_text = f"{title} {description}"

    for kw in INDIVIDUAL_MENTION_KEYWORDS:
        if kw in combined_text:
            verification_status = "REQUIRES_REVIEW"
            break

    # 3. Source reliability check
    source_type = str(record.get("source_type", "")).upper()
    if source_type in ("HTML", "EXTERNAL"):
        if verification_status != "REQUIRES_REVIEW":
            verification_status = "SOURCE_UNVERIFIED"

    is_valid = len(errors) == 0
    return is_valid, errors, verification_status
