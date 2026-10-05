"""
Configuration module for Data Ingestion Service
"""
import os
from typing import List

PORT = int(os.getenv("INGESTION_PORT", "8001"))
HOST = os.getenv("INGESTION_HOST", "0.0.0.0")

# Academic Research Bot User Agent (Section 11)
USER_AGENT = os.getenv(
    "SCRAPER_USER_AGENT",
    "CriminalNetworkAcademicResearchBot/1.0 (+https://github.com/academic-research/criminal-network; contact: research-ops@intelligence.edu)"
)

# SSRF Protection Allowlist (Section 48, 49)
# Only approved domains and public URLs are allowed
APPROVED_DOMAINS: List[str] = [
    "data.gov.in",
    "ncrb.gov.in",
    "pib.gov.in",
    "cert-in.org.in",
    "digitalindia.gov.in",
    "eservices.tn.gov.in",
    "delhipolice.gov.in",
    "mha.gov.in",
    "cybercrime.gov.in",
    "api.worldbank.org",
    "news.google.com",
    "timesofindia.indiatimes.com",
    "thehindu.com",
    "indianexpress.com",
    "feeds.feedburner.com",
    "github.com",
    "raw.githubusercontent.com",
    "127.0.0.1",      # For local integration mock endpoints if explicitly configured
    "localhost"
]

BLOCKED_IP_PREFIXES: List[str] = [
    "10.",
    "172.16.",
    "172.17.",
    "172.18.",
    "172.19.",
    "172.20.",
    "172.21.",
    "172.22.",
    "172.23.",
    "172.24.",
    "172.25.",
    "172.26.",
    "172.27.",
    "172.28.",
    "172.29.",
    "172.30.",
    "172.31.",
    "192.168.",
    "169.254.",
    "0.0.0.0"
]

# Spring Boot Backend API for callback / sync persistence
BACKEND_API_URL = os.getenv("BACKEND_API_URL", "http://127.0.0.1:8080/api")

# Rate Limiting & Delays
DEFAULT_REQUEST_TIMEOUT = 12.0  # seconds
DEFAULT_RATE_LIMIT_DELAY = 1.5  # seconds between successive requests to same domain
MAX_RETRIES = 3
BACKOFF_FACTOR = 2.0

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")
os.makedirs(DATA_DIR, exist_ok=True)
RAW_RECORDS_DIR = os.path.join(DATA_DIR, "raw_records")
os.makedirs(RAW_RECORDS_DIR, exist_ok=True)
