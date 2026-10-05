"""
Transparent Academic Research Bot User Agent (Section 11)
"""
from config.settings import USER_AGENT

def get_research_headers(custom_headers: dict = None) -> dict:
    headers = {
        "User-Agent": USER_AGENT,
        "Accept": "application/json, text/html, application/xml, text/csv;q=0.9, */*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "X-Purpose": "Academic Research & Public Safety Statistical Analysis",
    }
    if custom_headers:
        headers.update(custom_headers)
    return headers
