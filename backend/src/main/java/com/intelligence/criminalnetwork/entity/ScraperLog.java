package com.intelligence.criminalnetwork.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Scraper Log Entity (Section 32)
 * Maintains audit trail of crawler runs, requests sent, records extracted, and errors.
 */
@Entity
@Table(name = "scraper_logs")
public class ScraperLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "source_id", nullable = false)
    private Long sourceId;

    @Column(name = "source_name", length = 200)
    private String sourceName;

    @Column(name = "start_time")
    private LocalDateTime startTime;

    @Column(name = "end_time")
    private LocalDateTime endTime;

    @Column(nullable = false, length = 50)
    private String status; // SUCCESS, PARTIAL_SUCCESS, FAILED, BLOCKED, PARSER_ERROR, SOURCE_BLOCKED_BY_ROBOTS

    @Column(name = "requests_sent")
    private Integer requestsSent = 1;

    @Column(name = "records_found")
    private Integer recordsFound = 0;

    @Column(name = "records_created")
    private Integer recordsCreated = 0;

    @Column(name = "records_updated")
    private Integer recordsUpdated = 0;

    @Column(name = "records_skipped")
    private Integer recordsSkipped = 0;

    private Integer errors = 0;

    @Column(name = "error_message", columnDefinition = "TEXT")
    private String errorMessage;

    public ScraperLog() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getSourceId() { return sourceId; }
    public void setSourceId(Long sourceId) { this.sourceId = sourceId; }

    public String getSourceName() { return sourceName; }
    public void setSourceName(String sourceName) { this.sourceName = sourceName; }

    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }

    public LocalDateTime getEndTime() { return endTime; }
    public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Integer getRequestsSent() { return requestsSent; }
    public void setRequestsSent(Integer requestsSent) { this.requestsSent = requestsSent; }

    public Integer getRecordsFound() { return recordsFound; }
    public void setRecordsFound(Integer recordsFound) { this.recordsFound = recordsFound; }

    public Integer getRecordsCreated() { return recordsCreated; }
    public void setRecordsCreated(Integer recordsCreated) { this.recordsCreated = recordsCreated; }

    public Integer getRecordsUpdated() { return recordsUpdated; }
    public void setRecordsUpdated(Integer recordsUpdated) { this.recordsUpdated = recordsUpdated; }

    public Integer getRecordsSkipped() { return recordsSkipped; }
    public void setRecordsSkipped(Integer recordsSkipped) { this.recordsSkipped = recordsSkipped; }

    public Integer getErrors() { return errors; }
    public void setErrors(Integer errors) { this.errors = errors; }

    public String getErrorMessage() { return errorMessage; }
    public void setErrorMessage(String errorMessage) { this.errorMessage = errorMessage; }
}
