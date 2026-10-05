"""
Rate Limiter & Respectful Request Handler (Section 12)
Implements per-domain rate limiting, exponential backoff, and 429/503 retry strategies.
"""
import time
import logging
from urllib.parse import urlparse
from config.settings import DEFAULT_RATE_LIMIT_DELAY, MAX_RETRIES, BACKOFF_FACTOR

logger = logging.getLogger("RateLimiter")

_DOMAIN_LAST_REQUEST_TIME = {}

def wait_for_domain_rate_limit(url: str, min_interval_seconds: float = DEFAULT_RATE_LIMIT_DELAY):
    """
    Enforces a polite delay between successive requests to the same target domain.
    """
    domain = urlparse(url).netloc
    now = time.time()
    last_time = _DOMAIN_LAST_REQUEST_TIME.get(domain, 0)
    elapsed = now - last_time

    if elapsed < min_interval_seconds:
        sleep_duration = min_interval_seconds - elapsed
        logger.debug(f"Rate limiting domain '{domain}': sleeping for {sleep_duration:.2f}s")
        time.sleep(sleep_duration)

    _DOMAIN_LAST_REQUEST_TIME[domain] = time.time()

def calculate_backoff(attempt: int, retry_after_header: str = None) -> float:
    """
    Calculates delay for exponential backoff or uses Retry-After header if provided.
    """
    if retry_after_header:
        try:
            return float(retry_after_header)
        except ValueError:
            pass
    return BACKOFF_FACTOR ** attempt
