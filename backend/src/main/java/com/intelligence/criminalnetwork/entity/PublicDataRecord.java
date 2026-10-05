package com.intelligence.criminalnetwork.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Public Data Record Entity (Section 20, 21, 22, 28, 29)
 * Stores normalized public open-data records, aggregated statistics, and safety notices.
 * Never stores criminal accusations about private individuals.
 */
@Entity
@Table(name = "public_data_records", indexes = {
    @Index(name = "idx_pub_cat", columnList = "category"),
    @Index(name = "idx_pub_state", columnList = "state"),
    @Index(name = "idx_pub_verif", columnList = "verification_status"),
    @Index(name = "idx_pub_fingerprint", columnList = "fingerprint")
})
public class PublicDataRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "external_id", length = 150)
    private String externalId;

    @Column(nullable = false, length = 300)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, length = 100)
    private String category; // CYBER_FRAUD, FINANCIAL_CRIME, VEHICLE_THEFT, PROPERTY_CRIME, PUBLIC_SAFETY, AGGREGATE_STATISTICS

    @Column(name = "event_date")
    private LocalDate eventDate;

    @Column(name = "event_time", length = 30)
    private String eventTime;

    @Column(length = 100)
    private String country = "India";

    @Column(length = 100)
    private String state;

    @Column(length = 150)
    private String district;

    @Column(length = 150)
    private String city;

    @Column(precision = 10, scale = 6)
    private BigDecimal latitude;

    @Column(precision = 10, scale = 6)
    private BigDecimal longitude;

    @Column(name = "source_id")
    private Long sourceId;

    @Column(name = "source_name", length = 200)
    private String sourceName;

    @Column(name = "source_url", length = 500)
    private String sourceUrl;

    @Column(name = "source_badge", length = 50)
    private String sourceBadge = "OFFICIAL"; // OFFICIAL, OPEN DATA, RSS, PUBLIC NEWS, MANUAL, SYNTHETIC

    @Column(name = "data_origin", length = 50)
    private String dataOrigin = "REAL_PUBLIC"; // REAL_PUBLIC, SYNTHETIC, MANUAL

    @Column(name = "reliability_level", length = 100)
    private String reliabilityLevel = "Official Government Source"; // Official Government Source, Verified Feed, Public News Source, Unverified External Source

    @Column(length = 64, unique = true)
    private String fingerprint; // SHA-256 for deduplication

    @Column(name = "verification_status", length = 50)
    private String verificationStatus = "SOURCE_VERIFIED"; // SOURCE_VERIFIED, SOURCE_UNVERIFIED, REQUIRES_REVIEW, ARCHIVED

    @Column(name = "raw_record_id")
    private Long rawRecordId;

    @Column(name = "retrieved_at")
    private LocalDateTime retrievedAt = LocalDateTime.now();

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public PublicDataRecord() {}

    @PrePersist
    public void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
        if (retrievedAt == null) retrievedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getExternalId() { return externalId; }
    public void setExternalId(String externalId) { this.externalId = externalId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public LocalDate getEventDate() { return eventDate; }
    public void setEventDate(LocalDate eventDate) { this.eventDate = eventDate; }

    public String getEventTime() { return eventTime; }
    public void setEventTime(String eventTime) { this.eventTime = eventTime; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public BigDecimal getLatitude() { return latitude; }
    public void setLatitude(BigDecimal latitude) { this.latitude = latitude; }

    public BigDecimal getLongitude() { return longitude; }
    public void setLongitude(BigDecimal longitude) { this.longitude = longitude; }

    public Long getSourceId() { return sourceId; }
    public void setSourceId(Long sourceId) { this.sourceId = sourceId; }

    public String getSourceName() { return sourceName; }
    public void setSourceName(String sourceName) { this.sourceName = sourceName; }

    public String getSourceUrl() { return sourceUrl; }
    public void setSourceUrl(String sourceUrl) { this.sourceUrl = sourceUrl; }

    public String getSourceBadge() { return sourceBadge; }
    public void setSourceBadge(String sourceBadge) { this.sourceBadge = sourceBadge; }

    public String getDataOrigin() { return dataOrigin; }
    public void setDataOrigin(String dataOrigin) { this.dataOrigin = dataOrigin; }

    public String getReliabilityLevel() { return reliabilityLevel; }
    public void setReliabilityLevel(String reliabilityLevel) { this.reliabilityLevel = reliabilityLevel; }

    public String getFingerprint() { return fingerprint; }
    public void setFingerprint(String fingerprint) { this.fingerprint = fingerprint; }

    public String getVerificationStatus() { return verificationStatus; }
    public void setVerificationStatus(String verificationStatus) { this.verificationStatus = verificationStatus; }

    public Long getRawRecordId() { return rawRecordId; }
    public void setRawRecordId(Long rawRecordId) { this.rawRecordId = rawRecordId; }

    public LocalDateTime getRetrievedAt() { return retrievedAt; }
    public void setRetrievedAt(LocalDateTime retrievedAt) { this.retrievedAt = retrievedAt; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
