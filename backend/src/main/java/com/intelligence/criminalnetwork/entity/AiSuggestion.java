package com.intelligence.criminalnetwork.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ai_suggestions")
public class AiSuggestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(name = "source_entity_type", nullable = false, length = 50)
    private String sourceEntityType;

    @Column(name = "source_entity_id", nullable = false, length = 100)
    private String sourceEntityId;

    @Column(name = "source_entity_name", nullable = false, length = 150)
    private String sourceEntityName;

    @Column(name = "target_entity_type", nullable = false, length = 50)
    private String targetEntityType;

    @Column(name = "target_entity_id", nullable = false, length = 100)
    private String targetEntityId;

    @Column(name = "target_entity_name", nullable = false, length = 150)
    private String targetEntityName;

    @Column(name = "intermediate_entity", length = 200)
    private String intermediateEntity;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String reason;

    @Column(name = "supporting_signals", columnDefinition = "TEXT")
    private String supportingSignals;

    @Column(name = "analytical_score", nullable = false)
    private Integer analyticalScore = 70; // 0 - 100

    @Column(length = 50)
    private String status = "PENDING"; // PENDING, ACCEPTED, REJECTED

    @Column(name = "reviewed_by", length = 150)
    private String reviewedBy;

    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public AiSuggestion() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getSourceEntityType() { return sourceEntityType; }
    public void setSourceEntityType(String sourceEntityType) { this.sourceEntityType = sourceEntityType; }

    public String getSourceEntityId() { return sourceEntityId; }
    public void setSourceEntityId(String sourceEntityId) { this.sourceEntityId = sourceEntityId; }

    public String getSourceEntityName() { return sourceEntityName; }
    public void setSourceEntityName(String sourceEntityName) { this.sourceEntityName = sourceEntityName; }

    public String getTargetEntityType() { return targetEntityType; }
    public void setTargetEntityType(String targetEntityType) { this.targetEntityType = targetEntityType; }

    public String getTargetEntityId() { return targetEntityId; }
    public void setTargetEntityId(String targetEntityId) { this.targetEntityId = targetEntityId; }

    public String getTargetEntityName() { return targetEntityName; }
    public void setTargetEntityName(String targetEntityName) { this.targetEntityName = targetEntityName; }

    public String getIntermediateEntity() { return intermediateEntity; }
    public void setIntermediateEntity(String intermediateEntity) { this.intermediateEntity = intermediateEntity; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public String getSupportingSignals() { return supportingSignals; }
    public void setSupportingSignals(String supportingSignals) { this.supportingSignals = supportingSignals; }

    public Integer getAnalyticalScore() { return analyticalScore; }
    public void setAnalyticalScore(Integer analyticalScore) { this.analyticalScore = analyticalScore; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getReviewedBy() { return reviewedBy; }
    public void setReviewedBy(String reviewedBy) { this.reviewedBy = reviewedBy; }

    public LocalDateTime getReviewedAt() { return reviewedAt; }
    public void setReviewedAt(LocalDateTime reviewedAt) { this.reviewedAt = reviewedAt; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
