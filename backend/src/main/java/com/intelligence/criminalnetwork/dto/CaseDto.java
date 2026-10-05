package com.intelligence.criminalnetwork.dto;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;

public class CaseDto {
    private Long id;
    private String caseNumber; // Auto-generated if blank
    
    @NotBlank(message = "Case title is required")
    private String title;

    @NotBlank(message = "Case type is required")
    private String caseType;

    @NotBlank(message = "Lead investigator is required")
    private String leadInvestigator;

    private String priority = "MEDIUM"; // LOW, MEDIUM, HIGH, CRITICAL
    private String status = "NEW"; // NEW, UNDER_INVESTIGATION, ACTIVE, ON_HOLD, REVIEW, CLOSED, ARCHIVED
    private LocalDate incidentDate;
    private String incidentLocation;
    private String assignedTeam;
    private String description;
    private String notes;
    private int associatedPersonsCount = 0;
    private int evidenceCount = 0;

    public CaseDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCaseNumber() { return caseNumber; }
    public void setCaseNumber(String caseNumber) { this.caseNumber = caseNumber; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCaseType() { return caseType; }
    public void setCaseType(String caseType) { this.caseType = caseType; }

    public String getLeadInvestigator() { return leadInvestigator; }
    public void setLeadInvestigator(String leadInvestigator) { this.leadInvestigator = leadInvestigator; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDate getIncidentDate() { return incidentDate; }
    public void setIncidentDate(LocalDate incidentDate) { this.incidentDate = incidentDate; }

    public String getIncidentLocation() { return incidentLocation; }
    public void setIncidentLocation(String incidentLocation) { this.incidentLocation = incidentLocation; }

    public String getAssignedTeam() { return assignedTeam; }
    public void setAssignedTeam(String assignedTeam) { this.assignedTeam = assignedTeam; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public int getAssociatedPersonsCount() { return associatedPersonsCount; }
    public void setAssociatedPersonsCount(int associatedPersonsCount) { this.associatedPersonsCount = associatedPersonsCount; }

    public int getEvidenceCount() { return evidenceCount; }
    public void setEvidenceCount(int evidenceCount) { this.evidenceCount = evidenceCount; }
}
