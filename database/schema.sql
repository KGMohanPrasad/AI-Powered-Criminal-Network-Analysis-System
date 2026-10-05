-- ====================================================================
-- Criminal Investigation & Network Analysis Management System
-- Normalized MySQL Schema Definition (NON-AI Enterprise Architecture)
-- Educational / Academic Demo Intelligence Platform
-- ====================================================================

DROP DATABASE IF EXISTS criminal_network_db;
CREATE DATABASE IF NOT EXISTS criminal_network_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE criminal_network_db;

-- 1. Users and Authentication
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    badge_number VARCHAR(50),
    department VARCHAR(100) DEFAULT 'Special Investigations Directorate',
    role VARCHAR(50) NOT NULL DEFAULT 'ROLE_INVESTIGATOR', -- ROLE_ADMIN, ROLE_INVESTIGATOR, ROLE_ANALYST, ROLE_VIEWER
    avatar_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    phone VARCHAR(30) DEFAULT '+1 (555) 019-2831',
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_username (username),
    INDEX idx_user_role (role)
);

-- 2. System Roles Table
CREATE TABLE IF NOT EXISTS roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO roles (role_name, description) VALUES
('ROLE_ADMIN', 'Full system access, user management, immutable audit logs'),
('ROLE_INVESTIGATOR', 'Case creation, evidence management, person profiles, relationship editing'),
('ROLE_ANALYST', 'Graph analytics, path finding, crime statistics, reports'),
('ROLE_VIEWER', 'Read-only access to authorized records')
ON DUPLICATE KEY UPDATE description=VALUES(description);

-- 3. Cases Management
CREATE TABLE IF NOT EXISTS cases (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    case_number VARCHAR(50) NOT NULL UNIQUE,
    title VARCHAR(200) NOT NULL,
    case_type VARCHAR(100) NOT NULL,
    lead_investigator VARCHAR(150) NOT NULL,
    priority VARCHAR(30) NOT NULL DEFAULT 'MEDIUM', -- LOW, MEDIUM, HIGH, CRITICAL
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',    -- NEW, UNDER_INVESTIGATION, ACTIVE, ON_HOLD, REVIEW, CLOSED, ARCHIVED
    incident_date DATE,
    incident_location VARCHAR(200),
    assigned_team VARCHAR(150),
    description TEXT,
    notes TEXT,
    closed_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_case_number (case_number),
    INDEX idx_case_status (status),
    INDEX idx_case_priority (priority)
);

-- 4. Synthetic Persons of Interest
CREATE TABLE IF NOT EXISTS persons (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    person_id VARCHAR(50) NOT NULL UNIQUE, -- e.g. DEMO-P001
    name VARCHAR(150) NOT NULL,
    alias VARCHAR(150),
    age INT,
    gender VARCHAR(20),
    primary_location VARCHAR(200),
    status VARCHAR(50) DEFAULT 'PERSON_OF_INTEREST', -- SUSPECT, PERSON_OF_INTEREST, WITNESS, ASSOCIATE, CLEARED
    occupation VARCHAR(100),
    risk_level VARCHAR(30) DEFAULT 'MEDIUM', -- LOW, MEDIUM, HIGH, CRITICAL
    photo_url VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_person_id (person_id),
    INDEX idx_person_name (name),
    INDEX idx_person_status (status)
);

-- 5. Case-Person Links
CREATE TABLE IF NOT EXISTS case_persons (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    case_id BIGINT NOT NULL,
    person_id BIGINT NOT NULL,
    involvement_role VARCHAR(50) DEFAULT 'PERSON_OF_INTEREST',
    date_linked DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE,
    FOREIGN KEY (person_id) REFERENCES persons(id) ON DELETE CASCADE,
    UNIQUE KEY uk_case_person (case_id, person_id)
);

-- 6. Organizations (Synthetic entities)
CREATE TABLE IF NOT EXISTS organizations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    organization_id VARCHAR(50) NOT NULL UNIQUE, -- ORG-0001
    name VARCHAR(200) NOT NULL,
    org_type VARCHAR(100), -- Commercial, Logistics, Shell Company, Financial, Club, Non-Profit
    location VARCHAR(200),
    status VARCHAR(50) DEFAULT 'ACTIVE',
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_org_id (organization_id)
);

-- 7. Person-Organization Links
CREATE TABLE IF NOT EXISTS person_organizations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    person_id BIGINT NOT NULL,
    organization_id BIGINT NOT NULL,
    role_in_org VARCHAR(100) DEFAULT 'Director / Member',
    date_joined DATE,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    FOREIGN KEY (person_id) REFERENCES persons(id) ON DELETE CASCADE,
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
    UNIQUE KEY uk_person_org (person_id, organization_id)
);

-- 8. Incidents
CREATE TABLE IF NOT EXISTS incidents (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    incident_id VARCHAR(50) NOT NULL UNIQUE, -- INC-2026-0001
    incident_type VARCHAR(100) NOT NULL,
    incident_date DATE NOT NULL,
    incident_time TIME,
    location VARCHAR(200) NOT NULL,
    latitude DECIMAL(10, 6),
    longitude DECIMAL(10, 6),
    description TEXT,
    case_id BIGINT,
    case_number VARCHAR(50),
    status VARCHAR(50) DEFAULT 'INVESTIGATING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_incident_id (incident_id),
    INDEX idx_incident_case (case_id)
);

-- 9. Evidence
CREATE TABLE IF NOT EXISTS evidence (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    evidence_id VARCHAR(50) NOT NULL UNIQUE, -- EV-0001
    case_id BIGINT,
    case_number VARCHAR(50),
    evidence_type VARCHAR(100) NOT NULL, -- Document, Digital File, Physical Item, Communication Record, Vehicle Record, Location Record, etc.
    description TEXT NOT NULL,
    collected_by VARCHAR(150),
    collected_date DATE,
    source VARCHAR(200),
    storage_reference VARCHAR(150),
    integrity_hash VARCHAR(100),
    notes TEXT,
    status VARCHAR(50) DEFAULT 'COLLECTED', -- COLLECTED, UNDER_REVIEW, VERIFIED, ARCHIVED
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_evidence_id (evidence_id),
    INDEX idx_evidence_case (case_id)
);

-- 10. Evidence Chain of Custody
CREATE TABLE IF NOT EXISTS evidence_custody (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    evidence_id BIGINT NOT NULL,
    transferred_by VARCHAR(150) NOT NULL,
    received_by VARCHAR(150) NOT NULL,
    transfer_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reason VARCHAR(255) NOT NULL,
    location VARCHAR(200) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (evidence_id) REFERENCES evidence(id) ON DELETE CASCADE
);

-- 11. Vehicles
CREATE TABLE IF NOT EXISTS vehicles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    vehicle_id VARCHAR(50) NOT NULL UNIQUE, -- VEH-0001
    registration_number VARCHAR(50) NOT NULL, -- Fictional format e.g. TN-00-DEMO-001
    vehicle_type VARCHAR(50),
    brand VARCHAR(100),
    model VARCHAR(100),
    color VARCHAR(50),
    owner_name VARCHAR(150),
    owner_person_id BIGINT,
    case_id BIGINT,
    last_known_location VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_vehicle_reg (registration_number)
);

-- 12. Person-Vehicle Links
CREATE TABLE IF NOT EXISTS person_vehicles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    person_id BIGINT NOT NULL,
    vehicle_id BIGINT NOT NULL,
    relationship_role VARCHAR(50) DEFAULT 'OPERATOR', -- OWNER, DRIVER, PASSENGER, SUSPECTED_USER
    date_linked DATE,
    FOREIGN KEY (person_id) REFERENCES persons(id) ON DELETE CASCADE,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE,
    UNIQUE KEY uk_person_vehicle (person_id, vehicle_id)
);

-- 13. Locations Module
CREATE TABLE IF NOT EXISTS locations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    location_id VARCHAR(50) NOT NULL UNIQUE, -- LOC-2026-0001
    name VARCHAR(200) NOT NULL,
    address VARCHAR(255),
    city VARCHAR(100),
    district VARCHAR(100),
    state VARCHAR(100),
    latitude DECIMAL(10, 6),
    longitude DECIMAL(10, 6),
    related_cases VARCHAR(255),
    related_incidents VARCHAR(255),
    related_persons VARCHAR(255),
    status VARCHAR(50) DEFAULT 'ACTIVE', -- ACTIVE, MONITORED, INACTIVE
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_location_id (location_id),
    INDEX idx_location_city (city)
);

-- 14. Communication Records (Synthetic only)
CREATE TABLE IF NOT EXISTS communications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    source_entity VARCHAR(150) NOT NULL,
    target_entity VARCHAR(150) NOT NULL,
    communication_type VARCHAR(50) NOT NULL, -- Call, Message, Email, Meeting
    comm_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    duration_minutes INT DEFAULT 0,
    case_id BIGINT,
    context_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_comm_source (source_entity),
    INDEX idx_comm_target (target_entity)
);

-- 15. Multi-Entity Relationships
CREATE TABLE IF NOT EXISTS relationships (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    source_entity_type VARCHAR(50) NOT NULL, -- Person, Organization, Vehicle, Phone, Location, Case, Incident
    source_entity_id VARCHAR(100) NOT NULL,
    target_entity_type VARCHAR(50) NOT NULL,
    target_entity_id VARCHAR(100) NOT NULL,
    relationship_type VARCHAR(100) NOT NULL, -- ASSOCIATED_WITH, CONTACTED, TRAVELLED_WITH, OWNS, WORKS_FOR, INVOLVED_IN_CASE, SEEN_AT, RELATED_TO, CONNECTED_TO, WITNESS_TO
    strength INT NOT NULL DEFAULT 50,         -- 0 to 100 percentage (25=WEAK, 50=MEDIUM, 75=STRONG, 95=VERIFIED)
    description TEXT,
    first_observed DATE,
    last_observed DATE,
    case_id BIGINT,
    source_reference VARCHAR(200),
    verification_status VARCHAR(50) DEFAULT 'UNDER_REVIEW', -- UNVERIFIED, UNDER_REVIEW, VERIFIED, REJECTED
    created_by VARCHAR(150) DEFAULT 'SYSTEM',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_rel_src (source_entity_type, source_entity_id),
    INDEX idx_rel_tgt (target_entity_type, target_entity_id),
    INDEX idx_rel_type (relationship_type)
);

-- 16. Investigation Notes
CREATE TABLE IF NOT EXISTS investigation_notes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    created_by VARCHAR(150) NOT NULL,
    related_case_id BIGINT,
    related_person_id BIGINT,
    visibility VARCHAR(50) DEFAULT 'PUBLIC_INTERNAL', -- PUBLIC_INTERNAL, RESTRICTED, CONFIDENTIAL
    priority VARCHAR(30) DEFAULT 'MEDIUM',            -- LOW, MEDIUM, HIGH, CRITICAL
    is_pinned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 17. Rule-Based Intelligence Alerts (NON-AI database rules)
CREATE TABLE IF NOT EXISTS alerts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    alert_id VARCHAR(50) NOT NULL UNIQUE, -- ALT-0001
    alert_level VARCHAR(30) NOT NULL DEFAULT 'MEDIUM', -- INFO, LOW, MEDIUM, HIGH, CRITICAL
    case_id BIGINT,
    case_number VARCHAR(50),
    reason TEXT NOT NULL,
    supporting_records_count INT DEFAULT 1,
    analytical_level VARCHAR(50) DEFAULT 'Database Rule-Based Filter',
    status VARCHAR(50) DEFAULT 'NEW', -- NEW, UNDER_REVIEW, REVIEWED, DISMISSED
    assigned_investigator VARCHAR(150),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_alert_level (alert_level),
    INDEX idx_alert_status (status)
);

-- 18. In-App Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(100) DEFAULT 'ALL',
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL, -- CASE, EVIDENCE, PERSON, RELATIONSHIP, ALERT, REPORT, NOTE
    related_entity_type VARCHAR(50),
    related_entity_id VARCHAR(100),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 19. Case Activity & Chronological Timeline
CREATE TABLE IF NOT EXISTS case_activity (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    case_id BIGINT NOT NULL,
    case_number VARCHAR(50),
    action_type VARCHAR(50) NOT NULL, -- CASE_CREATED, INVESTIGATOR_ASSIGNED, PERSON_LINKED, EVIDENCE_ADDED, EVIDENCE_TRANSFERRED, RELATIONSHIP_CREATED, INCIDENT_RECORDED, STATUS_CHANGED, PRIORITY_CHANGED, NOTE_ADDED, REPORT_GENERATED
    title VARCHAR(200) NOT NULL,
    description TEXT,
    performed_by VARCHAR(150),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_activity_case (case_id),
    INDEX idx_activity_action (action_type)
);

-- 20. Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100),
    entity_id VARCHAR(100),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(100) DEFAULT '127.0.0.1',
    details TEXT,
    INDEX idx_audit_user (username),
    INDEX idx_audit_action (action)
);

-- 21. Generated Reports
CREATE TABLE IF NOT EXISTS reports (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    report_id VARCHAR(50) NOT NULL UNIQUE, -- REP-0001
    title VARCHAR(200) NOT NULL,
    report_type VARCHAR(100) NOT NULL,
    generated_by VARCHAR(150) NOT NULL,
    filters_used TEXT,
    summary_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 22. Public Data Sources Registry (Section 3)
CREATE TABLE IF NOT EXISTS data_sources (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    source_name VARCHAR(200) NOT NULL,
    source_type VARCHAR(50) NOT NULL, -- API, RSS, HTML, CSV, JSON, OPEN_DATA
    base_url VARCHAR(500) NOT NULL,
    country VARCHAR(100) DEFAULT 'India',
    category VARCHAR(100) NOT NULL,
    api_available BOOLEAN DEFAULT FALSE,
    scraping_allowed BOOLEAN DEFAULT TRUE,
    robots_checked BOOLEAN DEFAULT TRUE,
    terms_checked BOOLEAN DEFAULT TRUE,
    terms_reviewed_by VARCHAR(150) DEFAULT 'SecOps Lead',
    terms_reviewed_at TIMESTAMP NULL,
    license VARCHAR(200) DEFAULT 'Open Government Data License (OGD)',
    scraping_permission_notes TEXT,
    update_frequency VARCHAR(50) NOT NULL DEFAULT 'DAILY', -- HOURLY, DAILY, WEEKLY, MANUAL
    status VARCHAR(50) NOT NULL DEFAULT 'APPROVED', -- PENDING_REVIEW, APPROVED, DISABLED, BLOCKED
    health_status VARCHAR(50) DEFAULT 'ONLINE',     -- ONLINE, DEGRADED, FAILED, DISABLED, BLOCKED
    last_sync TIMESTAMP NULL,
    last_success TIMESTAMP NULL,
    next_sync TIMESTAMP NULL,
    records_imported INT DEFAULT 0,
    records_skipped INT DEFAULT 0,
    error_count INT DEFAULT 0,
    source_badge VARCHAR(50) DEFAULT 'OFFICIAL',
    reliability_level VARCHAR(100) DEFAULT 'Official Government Source',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_source_status (status),
    INDEX idx_source_type (source_type)
);

-- 23. Raw Ingestion Records for Data Lineage (Section 18, 19)
CREATE TABLE IF NOT EXISTS raw_ingestion_records (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    source_id BIGINT NOT NULL,
    external_id VARCHAR(150),
    raw_content LONGTEXT,
    source_url VARCHAR(500),
    retrieved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processing_status VARCHAR(50) DEFAULT 'PENDING', -- PENDING, PROCESSED, ERROR, DUPLICATE_SKIPPED
    error_message TEXT,
    INDEX idx_raw_source (source_id),
    INDEX idx_raw_status (processing_status)
);

-- 24. Public Data Records (Section 20, 21, 22)
CREATE TABLE IF NOT EXISTS public_data_records (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    external_id VARCHAR(150),
    title VARCHAR(300) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    event_date DATE,
    event_time VARCHAR(30),
    country VARCHAR(100) DEFAULT 'India',
    state VARCHAR(100),
    district VARCHAR(150),
    city VARCHAR(150),
    latitude DECIMAL(10, 6),
    longitude DECIMAL(10, 6),
    source_id BIGINT,
    source_name VARCHAR(200),
    source_url VARCHAR(500),
    source_badge VARCHAR(50) DEFAULT 'OFFICIAL',     -- OFFICIAL, OPEN DATA, RSS, PUBLIC NEWS, MANUAL, SYNTHETIC
    data_origin VARCHAR(50) DEFAULT 'REAL_PUBLIC',    -- REAL_PUBLIC, SYNTHETIC, MANUAL
    reliability_level VARCHAR(100) DEFAULT 'Official Government Source',
    fingerprint VARCHAR(64) UNIQUE,
    verification_status VARCHAR(50) DEFAULT 'SOURCE_VERIFIED', -- SOURCE_VERIFIED, SOURCE_UNVERIFIED, REQUIRES_REVIEW, ARCHIVED
    raw_record_id BIGINT,
    retrieved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_pub_cat (category),
    INDEX idx_pub_state (state),
    INDEX idx_pub_verif (verification_status),
    INDEX idx_pub_fingerprint (fingerprint)
);

-- 25. Scraper Logs (Section 32)
CREATE TABLE IF NOT EXISTS scraper_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    source_id BIGINT NOT NULL,
    source_name VARCHAR(200),
    start_time TIMESTAMP NULL,
    end_time TIMESTAMP NULL,
    status VARCHAR(50) NOT NULL, -- SUCCESS, PARTIAL_SUCCESS, FAILED, BLOCKED, PARSER_ERROR, SOURCE_BLOCKED_BY_ROBOTS
    requests_sent INT DEFAULT 1,
    records_found INT DEFAULT 0,
    records_created INT DEFAULT 0,
    records_updated INT DEFAULT 0,
    records_skipped INT DEFAULT 0,
    errors INT DEFAULT 0,
    error_message TEXT,
    INDEX idx_log_source (source_id),
    INDEX idx_log_status (status)
);

-- 26. Background Sync Jobs (Section 31, 35)
CREATE TABLE IF NOT EXISTS sync_jobs (
    id VARCHAR(64) PRIMARY KEY,
    source_id BIGINT NOT NULL,
    source_name VARCHAR(200),
    status VARCHAR(50) NOT NULL DEFAULT 'IDLE', -- IDLE, RUNNING, SUCCESS, PARTIAL_SUCCESS, FAILED, BLOCKED
    progress INT DEFAULT 0,
    step_message VARCHAR(300) DEFAULT 'Initialized',
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    records_processed INT DEFAULT 0,
    records_saved INT DEFAULT 0,
    records_skipped INT DEFAULT 0,
    error_message TEXT
);

