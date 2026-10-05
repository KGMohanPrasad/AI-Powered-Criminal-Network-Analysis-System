"""
Data Cleaner (Section 17)
Strips HTML tags, removes excess whitespace, fixes malformed strings,
and guarantees NO invented values (returns None or 'UNKNOWN' instead).
"""
import re
from bs4 import BeautifulSoup
from typing import Optional, Any

HTML_TAG_RE = re.compile(r'<[^>]+>')
MULTIPLE_SPACES_RE = re.compile(r'\s+')

def clean_html(raw_html: Optional[str]) -> Optional[str]:
    """
    Strips all HTML tags safely using BeautifulSoup & regex.
    """
    if not raw_html or not isinstance(raw_html, str):
        return None
    try:
        soup = BeautifulSoup(raw_html, "html.parser")
        text = soup.get_text(separator=" ")
    except Exception:
        text = HTML_TAG_RE.sub(" ", raw_html)
    return clean_text(text)

def clean_text(text: Optional[str]) -> Optional[str]:
    """
    Normalizes whitespace and strips control characters.
    Never invents missing values; returns None if text is empty/whitespace.
    """
    if text is None:
        return None
    if not isinstance(text, str):
        text = str(text)

    # Strip control characters except newline and tab
    cleaned = "".join(ch for ch in text if ch.isprintable() or ch in ('\n', '\t', ' '))
    # Collapse multiple whitespace
    cleaned = MULTIPLE_SPACES_RE.sub(" ", cleaned).strip()

    if not cleaned or cleaned.lower() in ("null", "none", "n/a", "na", "undefined", "unknown", "-"):
        return None
    return cleaned

def clean_url(url: Optional[str]) -> Optional[str]:
    """
    Trims and verifies basic URL structure.
    """
    if not url or not isinstance(url, str):
        return None
    url = url.strip()
    if not (url.startswith("http://") or url.startswith("https://")):
        return None
    return url

def clean_record(raw_dict: dict) -> dict:
    """
    Applies standard cleaning to all string fields in record.
    """
    cleaned = {}
    for k, v in raw_dict.items():
        if isinstance(v, str):
            if "<" in v and ">" in v:
                cleaned[k] = clean_html(v)
            else:
                cleaned[k] = clean_text(v)
        else:
            cleaned[k] = v
    return cleaned
