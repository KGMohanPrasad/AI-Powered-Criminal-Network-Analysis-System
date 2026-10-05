package com.intelligence.criminalnetwork.dto;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;

public class EvidenceDto {
    private Long id;
    private String evidenceId; // EV-0001
    private Long caseId;
    private String caseNumber;

    @NotBlank(message = "Evidence type is required")
    private String evidenceType;

    @NotBlank(message = "Description is required")
    private String description;

    private String collectedBy;
    private LocalDate collectedDate;
    private String source;
    private String storageReference;
    private String integrityHash;
    private String notes;
    private String status = "COLLECTED"; // COLLECTED, UNDER_REVIEW, VERIFIED, ARCHIVED

    public EvidenceDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEvidenceId() { return evidenceId; }
    public void setEvidenceId(String evidenceId) { this.evidenceId = evidenceId; }

    public Long getCaseId() { return caseId; }
    public void setCaseId(Long caseId) { this.caseId = caseId; }

    public String getCaseNumber() { return caseNumber; }
    public void setCaseNumber(String caseNumber) { this.caseNumber = caseNumber; }

    public String getEvidenceType() { return evidenceType; }
    public void setEvidenceType(String evidenceType) { this.evidenceType = evidenceType; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCollectedBy() { return collectedBy; }
    public void setCollectedBy(String collectedBy) { this.collectedBy = collectedBy; }

    public LocalDate getCollectedDate() { return collectedDate; }
    public void setCollectedDate(LocalDate collectedDate) { this.collectedDate = collectedDate; }

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }

    public String getStorageReference() { return storageReference; }
    public void setStorageReference(String storageReference) { this.storageReference = storageReference; }

    public String getIntegrityHash() { return integrityHash; }
    public void setIntegrityHash(String integrityHash) { this.integrityHash = integrityHash; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
