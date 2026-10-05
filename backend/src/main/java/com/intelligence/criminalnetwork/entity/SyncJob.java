package com.intelligence.criminalnetwork.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Background Sync Job Entity (Section 31, 35)
 * Enables non-blocking UI synchronization tracking.
 */
@Entity
@Table(name = "sync_jobs")
public class SyncJob {

    @Id
    @Column(length = 64)
    private String id; // e.g. job-a1b2c3d4

    @Column(name = "source_id", nullable = false)
    private Long sourceId;

    @Column(name = "source_name", length = 200)
    private String sourceName;

    @Column(nullable = false, length = 50)
    private String status = "IDLE"; // IDLE, RUNNING, SUCCESS, PARTIAL_SUCCESS, FAILED, BLOCKED

    private Integer progress = 0; // 0 to 100 percentage

    @Column(name = "step_message", length = 300)
    private String stepMessage = "Initialized";

    @Column(name = "started_at")
    private LocalDateTime startedAt = LocalDateTime.now();

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "records_processed")
    private Integer recordsProcessed = 0;

    @Column(name = "records_saved")
    private Integer recordsSaved = 0;

    @Column(name = "records_skipped")
    private Integer recordsSkipped = 0;

    @Column(name = "error_message", columnDefinition = "TEXT")
    private String errorMessage;

    public SyncJob() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public Long getSourceId() { return sourceId; }
    public void setSourceId(Long sourceId) { this.sourceId = sourceId; }

    public String getSourceName() { return sourceName; }
    public void setSourceName(String sourceName) { this.sourceName = sourceName; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Integer getProgress() { return progress; }
    public void setProgress(Integer progress) { this.progress = progress; }

    public String getStepMessage() { return stepMessage; }
    public void setStepMessage(String stepMessage) { this.stepMessage = stepMessage; }

    public LocalDateTime getStartedAt() { return startedAt; }
    public void setStartedAt(LocalDateTime startedAt) { this.startedAt = startedAt; }

    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }

    public Integer getRecordsProcessed() { return recordsProcessed; }
    public void setRecordsProcessed(Integer recordsProcessed) { this.recordsProcessed = recordsProcessed; }

    public Integer getRecordsSaved() { return recordsSaved; }
    public void setRecordsSaved(Integer recordsSaved) { this.recordsSaved = recordsSaved; }

    public Integer getRecordsSkipped() { return recordsSkipped; }
    public void setRecordsSkipped(Integer recordsSkipped) { this.recordsSkipped = recordsSkipped; }

    public String getErrorMessage() { return errorMessage; }
    public void setErrorMessage(String errorMessage) { this.errorMessage = errorMessage; }
}
