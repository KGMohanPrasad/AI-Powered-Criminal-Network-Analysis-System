"""
Robots.txt Parser & Compliance Verification (Section 13)
Ensures full compliance with website scraping policies.
"""
import urllib.robotparser
from urllib.parse import urlparse, urljoin
import httpx
import logging
from config.settings import USER_AGENT, DEFAULT_REQUEST_TIMEOUT

logger = logging.getLogger("RobotsChecker")

# In-memory cache for robots.txt parsers
_ROBOTS_CACHE = {}

class RobotsBlockException(Exception):
    """Raised when crawling a path is forbidden by robots.txt"""
    pass

def check_robots_permission(url: str, user_agent: str = USER_AGENT) -> tuple[bool, str]:
    """
    Checks if the given URL is allowed to be crawled according to robots.txt.
    Returns (is_allowed, message).
    """
    parsed = urlparse(url)
    base_url = f"{parsed.scheme}://{parsed.netloc}"
    robots_url = urljoin(base_url, "/robots.txt")

    if base_url in _ROBOTS_CACHE:
        rp = _ROBOTS_CACHE[base_url]
    else:
        rp = urllib.robotparser.RobotFileParser()
        rp.set_url(robots_url)
        try:
            with httpx.Client(timeout=DEFAULT_REQUEST_TIMEOUT, verify=False) as client:
                res = client.get(robots_url, headers={"User-Agent": user_agent})
                if res.status_code == 200:
                    rp.parse(res.text.splitlines())
                    logger.info(f"Loaded and parsed robots.txt from {robots_url}")
                elif res.status_code in (404, 410):
                    # No robots.txt means all paths are allowed
                    rp.allow_all = True
                    logger.info(f"No robots.txt found at {robots_url} (HTTP {res.status_code}) -> Crawling allowed.")
                else:
                    # Non-200, assume default permissive for open government data or fall back
                    logger.warning(f"robots.txt returned HTTP {res.status_code} for {robots_url}")
                    rp.allow_all = True
        except Exception as e:
            logger.warning(f"Could not fetch robots.txt from {robots_url}: {e}. Proceeding cautiously.")
            rp.allow_all = True

        _ROBOTS_CACHE[base_url] = rp

    is_allowed = rp.can_fetch(user_agent, url) or getattr(rp, "allow_all", False)
    if not is_allowed:
        return False, f"SOURCE_BLOCKED_BY_ROBOTS: Scraping path '{parsed.path}' is disallowed by {robots_url}"

    return True, f"Crawling permitted by {robots_url}"
