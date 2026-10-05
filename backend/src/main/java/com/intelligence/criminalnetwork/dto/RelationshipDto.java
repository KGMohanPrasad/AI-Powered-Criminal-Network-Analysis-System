package com.intelligence.criminalnetwork.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;

public class RelationshipDto {
    private Long id;

    @NotBlank(message = "Source entity type is required")
    private String sourceEntityType;

    @NotBlank(message = "Source entity ID is required")
    private String sourceEntityId;

    @NotBlank(message = "Target entity type is required")
    private String targetEntityType;

    @NotBlank(message = "Target entity ID is required")
    private String targetEntityId;

    @NotBlank(message = "Relationship type is required")
    private String relationshipType;

    @Min(value = 0, message = "Strength must be between 0 and 100")
    @Max(value = 100, message = "Strength must be between 0 and 100")
    private Integer strength = 50;

    private String description;
    private LocalDate firstObserved;
    private LocalDate lastObserved;
    private Long caseId;
    private String sourceReference;
    private String verificationStatus = "UNDER_REVIEW"; // UNVERIFIED, UNDER_REVIEW, VERIFIED, REJECTED
    private String createdBy;

    public RelationshipDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSourceEntityType() { return sourceEntityType; }
    public void setSourceEntityType(String sourceEntityType) { this.sourceEntityType = sourceEntityType; }

    public String getSourceEntityId() { return sourceEntityId; }
    public void setSourceEntityId(String sourceEntityId) { this.sourceEntityId = sourceEntityId; }

    public String getTargetEntityType() { return targetEntityType; }
    public void setTargetEntityType(String targetEntityType) { this.targetEntityType = targetEntityType; }

    public String getTargetEntityId() { return targetEntityId; }
    public void setTargetEntityId(String targetEntityId) { this.targetEntityId = targetEntityId; }

    public String getRelationshipType() { return relationshipType; }
    public void setRelationshipType(String relationshipType) { this.relationshipType = relationshipType; }

    public Integer getStrength() { return strength; }
    public void setStrength(Integer strength) { this.strength = strength; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDate getFirstObserved() { return firstObserved; }
    public void setFirstObserved(LocalDate firstObserved) { this.firstObserved = firstObserved; }

    public LocalDate getLastObserved() { return lastObserved; }
    public void setLastObserved(LocalDate lastObserved) { this.lastObserved = lastObserved; }

    public Long getCaseId() { return caseId; }
    public void setCaseId(Long caseId) { this.caseId = caseId; }

    public String getSourceReference() { return sourceReference; }
    public void setSourceReference(String sourceReference) { this.sourceReference = sourceReference; }

    public String getVerificationStatus() { return verificationStatus; }
    public void setVerificationStatus(String verificationStatus) { this.verificationStatus = verificationStatus; }

    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }
}
