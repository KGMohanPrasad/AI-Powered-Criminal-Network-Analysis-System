package com.intelligence.criminalnetwork.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "case_activity")
public class CaseActivity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "case_id", nullable = false)
    private Long caseId;

    @Column(name = "case_number", length = 50)
    private String caseNumber;

    @Column(name = "action_type", nullable = false, length = 50)
    private String actionType; // CASE_CREATED, INVESTIGATOR_ASSIGNED, PERSON_LINKED, EVIDENCE_ADDED, EVIDENCE_TRANSFERRED, RELATIONSHIP_CREATED, INCIDENT_RECORDED, STATUS_CHANGED, PRIORITY_CHANGED, NOTE_ADDED, REPORT_GENERATED

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "performed_by", length = 150)
    private String performedBy;

    @Column(nullable = false)
    private LocalDateTime timestamp = LocalDateTime.now();

    public CaseActivity() {}

    public CaseActivity(Long caseId, String caseNumber, String actionType, String title, String description, String performedBy) {
        this.caseId = caseId;
        this.caseNumber = caseNumber;
        this.actionType = actionType;
        this.title = title;
        this.description = description;
        this.performedBy = performedBy != null ? performedBy : "System";
        this.timestamp = LocalDateTime.now();
    }

    public CaseActivity(Long caseId, String caseNumber, String actionType, String title, String description, String performedBy, LocalDateTime timestamp) {
        this.caseId = caseId;
        this.caseNumber = caseNumber;
        this.actionType = actionType;
        this.title = title;
        this.description = description;
        this.performedBy = performedBy != null ? performedBy : "System";
        this.timestamp = timestamp != null ? timestamp : LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getCaseId() { return caseId; }
    public void setCaseId(Long caseId) { this.caseId = caseId; }

    public String getCaseNumber() { return caseNumber; }
    public void setCaseNumber(String caseNumber) { this.caseNumber = caseNumber; }

    public String getActionType() { return actionType; }
    public void setActionType(String actionType) { this.actionType = actionType; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getPerformedBy() { return performedBy; }
    public void setPerformedBy(String performedBy) { this.performedBy = performedBy; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
