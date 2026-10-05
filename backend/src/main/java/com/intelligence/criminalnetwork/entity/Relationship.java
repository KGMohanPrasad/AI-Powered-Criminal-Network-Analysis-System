package com.intelligence.criminalnetwork.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "relationships")
public class Relationship {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "source_entity_type", nullable = false, length = 50)
    private String sourceEntityType; // Person, Organization, Vehicle, Phone, Location, Case, Incident

    @Column(name = "source_entity_id", nullable = false, length = 100)
    private String sourceEntityId;

    @Column(name = "target_entity_type", nullable = false, length = 50)
    private String targetEntityType;

    @Column(name = "target_entity_id", nullable = false, length = 100)
    private String targetEntityId;

    @Column(name = "relationship_type", nullable = false, length = 100)
    private String relationshipType; // ASSOCIATED_WITH, CONTACTED, TRAVELLED_WITH, OWNS, EMPLOYED_BY, LOCATED_AT, INVOLVED_IN_CASE, WITNESS_TO, RELATED_TO, COMMUNICATED_WITH

    @Column(nullable = false)
    private Integer strength = 50; // 0-100 percentage

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "first_observed")
    private LocalDate firstObserved;

    @Column(name = "last_observed")
    private LocalDate lastObserved;

    @Column(name = "case_id")
    private Long caseId;

    @Column(name = "source_reference", length = 200)
    private String sourceReference;

    @Column(name = "verification_status", length = 50)
    private String verificationStatus = "UNDER_REVIEW"; // UNVERIFIED, UNDER_REVIEW, VERIFIED, REJECTED

    @Column(name = "created_by", length = 150)
    private String createdBy = "SYSTEM";

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public Relationship() {}

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
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

    public String getStrengthLevel() {
        if (strength == null) return "MEDIUM";
        if (strength >= 85) return "VERIFIED";
        if (strength >= 65) return "STRONG";
        if (strength >= 40) return "MEDIUM";
        return "WEAK";
    }

    public void setStrengthLevel(String level) {
        if (level == null) return;
        switch (level.toUpperCase()) {
            case "VERIFIED": this.strength = 95; break;
            case "STRONG": this.strength = 75; break;
            case "MEDIUM": this.strength = 50; break;
            case "WEAK": this.strength = 25; break;
            default:
                try {
                    this.strength = Integer.parseInt(level);
                } catch (Exception ignored) {}
        }
    }

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

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
