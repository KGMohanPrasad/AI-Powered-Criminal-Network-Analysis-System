"""
SSRF Protection Utility (Section 48, 49)
Prevents Server-Side Request Forgery by strictly validating target URLs against
allowlists, IP ranges, and allowed URL schemes.
"""
import ipaddress
import socket
from urllib.parse import urlparse
from config.settings import APPROVED_DOMAINS, BLOCKED_IP_PREFIXES

class SSRFSecurityException(Exception):
    pass

def validate_url(url: str, allow_local: bool = False) -> tuple[bool, str]:
    """
    Validates a URL against strict SSRF criteria.
    Returns (is_valid, error_reason).
    """
    if not url or not isinstance(url, str):
        return False, "URL cannot be empty."

    parsed = urlparse(url.strip())

    # 1. Scheme Check
    if parsed.scheme.lower() not in ("http", "https"):
        return False, f"Unsupported protocol '{parsed.scheme}'. Only HTTP and HTTPS are permitted."

    hostname = parsed.hostname
    if not hostname:
        return False, "Invalid URL: missing hostname."

    hostname_lower = hostname.lower()

    # 2. Localhost & Loopback check
    if not allow_local:
        if hostname_lower in ("localhost", "127.0.0.1", "0.0.0.0", "::1"):
            return False, "Access to localhost/loopback addresses is forbidden (SSRF protection)."

    # 3. Private IP check
    try:
        # Check if hostname is an IP directly
        ip = ipaddress.ip_address(hostname)
        if not allow_local and (ip.is_private or ip.is_loopback or ip.is_link_local or ip.is_reserved):
            return False, f"Target IP {hostname} is a restricted/private network address."
    except ValueError:
        # Hostname is a domain name
        for prefix in BLOCKED_IP_PREFIXES:
            if hostname_lower.startswith(prefix):
                return False, f"Hostname prefix '{prefix}' resolves to private/internal ranges."

    # 4. Check domain allowlist (or subdomain of approved domain)
    matched = False
    for approved in APPROVED_DOMAINS:
        if hostname_lower == approved or hostname_lower.endswith("." + approved):
            matched = True
            break

    if not matched and not allow_local:
        return False, f"Domain '{hostname}' is not on the administrator-approved allowlist."

    return True, "URL approved by SSRF validation."

def ensure_safe_url(url: str, allow_local: bool = False):
    """
    Raises SSRFSecurityException if URL is not safe.
    """
    is_valid, reason = validate_url(url, allow_local=allow_local)
    if not is_valid:
        raise SSRFSecurityException(f"SSRF Security Violation: {reason}")
