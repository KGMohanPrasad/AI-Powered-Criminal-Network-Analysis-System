package com.intelligence.criminalnetwork.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "alerts")
public class IntelligenceAlert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "alert_id", nullable = false, unique = true, length = 50)
    private String alertId; // ALT-0001

    @Column(name = "alert_level", nullable = false, length = 30)
    private String alertLevel = "MEDIUM"; // INFO, LOW, MEDIUM, HIGH, CRITICAL

    @Column(name = "case_id")
    private Long caseId;

    @Column(name = "case_number", length = 50)
    private String caseNumber;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String reason;

    @Column(name = "supporting_records_count")
    private Integer supportingRecordsCount = 1;

    @Column(name = "analytical_level", length = 50)
    private String analyticalLevel = "Automated Graph Analysis";

    @Column(length = 50)
    private String status = "NEW"; // NEW, UNDER_REVIEW, REVIEWED, DISMISSED

    @Column(name = "assigned_investigator", length = 150)
    private String assignedInvestigator;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public IntelligenceAlert() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getAlertId() { return alertId; }
    public void setAlertId(String alertId) { this.alertId = alertId; }

    public String getAlertLevel() { return alertLevel; }
    public void setAlertLevel(String alertLevel) { this.alertLevel = alertLevel; }

    public Long getCaseId() { return caseId; }
    public void setCaseId(Long caseId) { this.caseId = caseId; }

    public String getCaseNumber() { return caseNumber; }
    public void setCaseNumber(String caseNumber) { this.caseNumber = caseNumber; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public Integer getSupportingRecordsCount() { return supportingRecordsCount; }
    public void setSupportingRecordsCount(Integer supportingRecordsCount) { this.supportingRecordsCount = supportingRecordsCount; }

    public String getAnalyticalLevel() { return analyticalLevel; }
    public void setAnalyticalLevel(String analyticalLevel) { this.analyticalLevel = analyticalLevel; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getAssignedInvestigator() { return assignedInvestigator; }
    public void setAssignedInvestigator(String assignedInvestigator) { this.assignedInvestigator = assignedInvestigator; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
