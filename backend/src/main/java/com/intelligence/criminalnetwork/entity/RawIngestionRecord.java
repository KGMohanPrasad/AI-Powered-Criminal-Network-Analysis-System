package com.intelligence.criminalnetwork.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Raw Ingestion Record Entity (Section 18, 19)
 * Stores unmodified payload for debugging, auditing, and complete data lineage.
 */
@Entity
@Table(name = "raw_ingestion_records")
public class RawIngestionRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "source_id", nullable = false)
    private Long sourceId;

    @Column(name = "external_id", length = 150)
    private String externalId;

    @Column(name = "raw_content", columnDefinition = "LONGTEXT")
    private String rawContent;

    @Column(name = "source_url", length = 500)
    private String sourceUrl;

    @Column(name = "retrieved_at")
    private LocalDateTime retrievedAt = LocalDateTime.now();

    @Column(name = "processing_status", length = 50)
    private String processingStatus = "PENDING"; // PENDING, PROCESSED, ERROR, DUPLICATE_SKIPPED

    @Column(name = "error_message", columnDefinition = "TEXT")
    private String errorMessage;

    public RawIngestionRecord() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getSourceId() { return sourceId; }
    public void setSourceId(Long sourceId) { this.sourceId = sourceId; }

    public String getExternalId() { return externalId; }
    public void setExternalId(String externalId) { this.externalId = externalId; }

    public String getRawContent() { return rawContent; }
    public void setRawContent(String rawContent) { this.rawContent = rawContent; }

    public String getSourceUrl() { return sourceUrl; }
    public void setSourceUrl(String sourceUrl) { this.sourceUrl = sourceUrl; }

    public LocalDateTime getRetrievedAt() { return retrievedAt; }
    public void setRetrievedAt(LocalDateTime retrievedAt) { this.retrievedAt = retrievedAt; }

    public String getProcessingStatus() { return processingStatus; }
    public void setProcessingStatus(String processingStatus) { this.processingStatus = processingStatus; }

    public String getErrorMessage() { return errorMessage; }
    public void setErrorMessage(String errorMessage) { this.errorMessage = errorMessage; }
}
