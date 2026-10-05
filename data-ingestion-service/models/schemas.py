"""
Pydantic Schemas for Ingestion Microservice
"""
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

class DataSourceModel(BaseModel):
    id: Optional[int] = None
    source_name: str
    source_type: str  # API, RSS, HTML, CSV, JSON, OPEN_DATA
    base_url: str
    country: str = "India"
    category: str
    api_available: bool = False
    scraping_allowed: bool = True
    robots_checked: bool = True
    terms_checked: bool = True
    terms_reviewed_by: Optional[str] = "SecOps Lead"
    terms_reviewed_at: Optional[str] = None
    license: Optional[str] = "Open Government Data License (OGD)"
    scraping_permission_notes: Optional[str] = "Permitted for academic analysis and public statistical research"
    update_frequency: str = "DAILY"  # HOURLY, DAILY, WEEKLY, MANUAL
    status: str = "APPROVED"         # PENDING_REVIEW, APPROVED, DISABLED, BLOCKED
    health_status: str = "ONLINE"    # ONLINE, DEGRADED, FAILED, DISABLED, BLOCKED
    last_sync: Optional[str] = None
    last_success: Optional[str] = None
    next_sync: Optional[str] = None
    records_imported: int = 0
    records_skipped: int = 0
    error_count: int = 0
    created_at: Optional[str] = None
    updated_at: Optional[str] = None


class PublicDataRecordModel(BaseModel):
    id: Optional[int] = None
    external_id: str
    title: str
    description: Optional[str] = None
    category: str
    event_date: Optional[str] = None
    event_time: Optional[str] = None
    country: str = "India"
    state: Optional[str] = None
    district: Optional[str] = None
    city: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    source_id: Optional[int] = None
    source_name: Optional[str] = None
    source_url: str
    source_badge: str = "OFFICIAL"  # OFFICIAL, OPEN DATA, RSS, PUBLIC NEWS, MANUAL, SYNTHETIC
    data_origin: str = "REAL_PUBLIC"  # REAL_PUBLIC, SYNTHETIC, MANUAL
    reliability_level: str = "Official Government Source"  # Official Government Source, Verified Feed, Public News Source, Unverified External Source
    fingerprint: Optional[str] = None
    retrieved_at: Optional[str] = None
    verification_status: str = "SOURCE_VERIFIED"  # SOURCE_VERIFIED, SOURCE_UNVERIFIED, REQUIRES_REVIEW, ARCHIVED
    raw_record_id: Optional[int] = None
    created_at: Optional[str] = None


class RawIngestionRecordModel(BaseModel):
    id: Optional[int] = None
    source_id: int
    external_id: str
    raw_content: str
    source_url: str
    retrieved_at: Optional[str] = None
    processing_status: str = "PENDING"  # PENDING, PROCESSED, ERROR, DUPLICATE_SKIPPED
    error_message: Optional[str] = None


class ScraperLogModel(BaseModel):
    id: Optional[int] = None
    source_id: int
    source_name: str
    start_time: str
    end_time: Optional[str] = None
    status: str  # SUCCESS, PARTIAL_SUCCESS, FAILED, BLOCKED, PARSER_ERROR, SOURCE_BLOCKED_BY_ROBOTS
    requests_sent: int = 0
    records_found: int = 0
    records_created: int = 0
    records_updated: int = 0
    records_skipped: int = 0
    errors: int = 0
    error_message: Optional[str] = None


class SyncJobModel(BaseModel):
    id: str
    source_id: int
    source_name: str
    status: str = "IDLE"  # IDLE, RUNNING, SUCCESS, PARTIAL_SUCCESS, FAILED, BLOCKED
    progress: int = 0
    step_message: str = "Initialized"
    started_at: str
    completed_at: Optional[str] = None
    records_processed: int = 0
    records_saved: int = 0
    records_skipped: int = 0
    error_message: Optional[str] = None


class TestSourceResult(BaseModel):
    success: bool
    status_code: Optional[int] = None
    robots_status: str
    ssrf_status: str
    message: str
    sample_preview: Optional[List[Dict[str, Any]]] = None
