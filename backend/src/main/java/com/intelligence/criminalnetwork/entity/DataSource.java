package com.intelligence.criminalnetwork.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Data Source Registry Entity (Section 3, 4, 14, 30)
 * Tracks authorized public data sources, approval statuses, robots.txt compliance,
 * update frequencies, and synchronization metrics.
 */
@Entity
@Table(name = "data_sources")
public class DataSource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "source_name", nullable = false, length = 200)
    private String sourceName;

    @Column(name = "source_type", nullable = false, length = 50)
    private String sourceType; // API, RSS, HTML, CSV, JSON, OPEN_DATA

    @Column(name = "base_url", nullable = false, length = 500)
    private String baseUrl;

    @Column(length = 100)
    private String country = "India";

    @Column(nullable = false, length = 100)
    private String category; // CYBER_FRAUD, FINANCIAL_CRIME, VEHICLE_THEFT, PROPERTY_CRIME, PUBLIC_SAFETY, AGGREGATE_STATISTICS

    @Column(name = "api_available")
    private Boolean apiAvailable = false;

    @Column(name = "scraping_allowed")
    private Boolean scrapingAllowed = true;

    @Column(name = "robots_checked")
    private Boolean robotsChecked = true;

    @Column(name = "terms_checked")
    private Boolean termsChecked = true;

    @Column(name = "terms_reviewed_by", length = 150)
    private String termsReviewedBy = "SecOps Lead";

    @Column(name = "terms_reviewed_at")
    private LocalDateTime termsReviewedAt;

    @Column(length = 200)
    private String license = "Open Government Data License (OGD)";

    @Column(name = "scraping_permission_notes", columnDefinition = "TEXT")
    private String scrapingPermissionNotes;

    @Column(name = "update_frequency", nullable = false, length = 50)
    private String updateFrequency = "DAILY"; // HOURLY, DAILY, WEEKLY, MANUAL

    @Column(nullable = false, length = 50)
    private String status = "APPROVED"; // PENDING_REVIEW, APPROVED, DISABLED, BLOCKED

    @Column(name = "health_status", length = 50)
    private String healthStatus = "ONLINE"; // ONLINE, DEGRADED, FAILED, DISABLED, BLOCKED

    @Column(name = "last_sync")
    private LocalDateTime lastSync;

    @Column(name = "last_success")
    private LocalDateTime lastSuccess;

    @Column(name = "next_sync")
    private LocalDateTime nextSync;

    @Column(name = "records_imported")
    private Integer recordsImported = 0;

    @Column(name = "records_skipped")
    private Integer recordsSkipped = 0;

    @Column(name = "error_count")
    private Integer errorCount = 0;

    @Column(name = "source_badge", length = 50)
    private String sourceBadge = "OFFICIAL"; // OFFICIAL, OPEN DATA, RSS, PUBLIC NEWS, MANUAL, SYNTHETIC

    @Column(name = "reliability_level", length = 100)
    private String reliabilityLevel = "Official Government Source"; // Official Government Source, Verified Feed, Public News Source, Unverified External Source

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public DataSource() {}

    @PrePersist
    public void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
        if (updatedAt == null) updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSourceName() { return sourceName; }
    public void setSourceName(String sourceName) { this.sourceName = sourceName; }

    public String getSourceType() { return sourceType; }
    public void setSourceType(String sourceType) { this.sourceType = sourceType; }

    public String getBaseUrl() { return baseUrl; }
    public void setBaseUrl(String baseUrl) { this.baseUrl = baseUrl; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Boolean getApiAvailable() { return apiAvailable; }
    public void setApiAvailable(Boolean apiAvailable) { this.apiAvailable = apiAvailable; }

    public Boolean getScrapingAllowed() { return scrapingAllowed; }
    public void setScrapingAllowed(Boolean scrapingAllowed) { this.scrapingAllowed = scrapingAllowed; }

    public Boolean getRobotsChecked() { return robotsChecked; }
    public void setRobotsChecked(Boolean robotsChecked) { this.robotsChecked = robotsChecked; }

    public Boolean getTermsChecked() { return termsChecked; }
    public void setTermsChecked(Boolean termsChecked) { this.termsChecked = termsChecked; }

    public String getTermsReviewedBy() { return termsReviewedBy; }
    public void setTermsReviewedBy(String termsReviewedBy) { this.termsReviewedBy = termsReviewedBy; }

    public LocalDateTime getTermsReviewedAt() { return termsReviewedAt; }
    public void setTermsReviewedAt(LocalDateTime termsReviewedAt) { this.termsReviewedAt = termsReviewedAt; }

    public String getLicense() { return license; }
    public void setLicense(String license) { this.license = license; }

    public String getScrapingPermissionNotes() { return scrapingPermissionNotes; }
    public void setScrapingPermissionNotes(String scrapingPermissionNotes) { this.scrapingPermissionNotes = scrapingPermissionNotes; }

    public String getUpdateFrequency() { return updateFrequency; }
    public void setUpdateFrequency(String updateFrequency) { this.updateFrequency = updateFrequency; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getHealthStatus() { return healthStatus; }
    public void setHealthStatus(String healthStatus) { this.healthStatus = healthStatus; }

    public LocalDateTime getLastSync() { return lastSync; }
    public void setLastSync(LocalDateTime lastSync) { this.lastSync = lastSync; }

    public LocalDateTime getLastSuccess() { return lastSuccess; }
    public void setLastSuccess(LocalDateTime lastSuccess) { this.lastSuccess = lastSuccess; }

    public LocalDateTime getNextSync() { return nextSync; }
    public void setNextSync(LocalDateTime nextSync) { this.nextSync = nextSync; }

    public Integer getRecordsImported() { return recordsImported; }
    public void setRecordsImported(Integer recordsImported) { this.recordsImported = recordsImported; }

    public Integer getRecordsSkipped() { return recordsSkipped; }
    public void setRecordsSkipped(Integer recordsSkipped) { this.recordsSkipped = recordsSkipped; }

    public Integer getErrorCount() { return errorCount; }
    public void setErrorCount(Integer errorCount) { this.errorCount = errorCount; }

    public String getSourceBadge() { return sourceBadge; }
    public void setSourceBadge(String sourceBadge) { this.sourceBadge = sourceBadge; }

    public String getReliabilityLevel() { return reliabilityLevel; }
    public void setReliabilityLevel(String reliabilityLevel) { this.reliabilityLevel = reliabilityLevel; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
