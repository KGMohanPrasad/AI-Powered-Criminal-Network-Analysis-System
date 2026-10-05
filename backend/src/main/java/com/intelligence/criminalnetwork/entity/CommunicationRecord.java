package com.intelligence.criminalnetwork.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "communications")
public class CommunicationRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "source_entity", nullable = false, length = 150)
    private String sourceEntity;

    @Column(name = "target_entity", nullable = false, length = 150)
    private String targetEntity;

    @Column(name = "communication_type", nullable = false, length = 50)
    private String communicationType; // Call, Message, Email, Meeting

    @Column(name = "comm_timestamp")
    private LocalDateTime timestamp = LocalDateTime.now();

    @Column(name = "duration_minutes")
    private Integer durationMinutes = 0;

    @Column(name = "case_id")
    private Long caseId;

    @Column(name = "context_notes", columnDefinition = "TEXT")
    private String contextNotes;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public CommunicationRecord() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSourceEntity() { return sourceEntity; }
    public void setSourceEntity(String sourceEntity) { this.sourceEntity = sourceEntity; }

    public String getTargetEntity() { return targetEntity; }
    public void setTargetEntity(String targetEntity) { this.targetEntity = targetEntity; }

    public String getCommunicationType() { return communicationType; }
    public void setCommunicationType(String communicationType) { this.communicationType = communicationType; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    public Integer getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }

    public Long getCaseId() { return caseId; }
    public void setCaseId(Long caseId) { this.caseId = caseId; }

    public String getContextNotes() { return contextNotes; }
    public void setContextNotes(String contextNotes) { this.contextNotes = contextNotes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
