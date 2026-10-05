package com.intelligence.criminalnetwork.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ml_analysis_results")
public class MlAnalysisResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "analysis_type", nullable = false, length = 50)
    private String analysisType; // NETWORK_ANALYSIS, ANOMALY_DETECTION, COMMUNITY_DETECTION, LINK_PREDICTION, CASE_SIMILARITY, CLUSTERING

    @Column(name = "entity_type", length = 50)
    private String entityType; // PERSON, CASE, NETWORK, ORGANIZATION

    @Column(name = "entity_id", length = 100)
    private String entityId;

    @Column(name = "case_id")
    private Long caseId;

    @Column(length = 100)
    private String algorithm;

    @Column(name = "model_version", length = 50)
    private String modelVersion = "v1.4-academic";

    private Double score;

    @Column(columnDefinition = "TEXT")
    private String result;

    @Column(columnDefinition = "TEXT")
    private String explanation;

    @Column(name = "input_features", columnDefinition = "TEXT")
    private String inputFeatures;

    @Column(name = "review_status", length = 50)
    private String reviewStatus = "PENDING_REVIEW"; // PENDING_REVIEW, ACCEPTED_AS_LEAD, REJECTED, REQUIRES_MORE_DATA

    @Column(name = "reviewed_by", length = 150)
    private String reviewedBy;

    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public MlAnalysisResult() {}

    public MlAnalysisResult(String analysisType, String entityType, String entityId, Long caseId, String algorithm, Double score, String result, String explanation) {
        this.analysisType = analysisType;
        this.entityType = entityType;
        this.entityId = entityId;
        this.caseId = caseId;
        this.algorithm = algorithm;
        this.score = score;
        this.result = result;
        this.explanation = explanation;
        this.reviewStatus = "PENDING_REVIEW";
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getAnalysisType() { return analysisType; }
    public void setAnalysisType(String analysisType) { this.analysisType = analysisType; }

    public String getEntityType() { return entityType; }
    public void setEntityType(String entityType) { this.entityType = entityType; }

    public String getEntityId() { return entityId; }
    public void setEntityId(String entityId) { this.entityId = entityId; }

    public Long getCaseId() { return caseId; }
    public void setCaseId(Long caseId) { this.caseId = caseId; }

    public String getAlgorithm() { return algorithm; }
    public void setAlgorithm(String algorithm) { this.algorithm = algorithm; }

    public String getModelVersion() { return modelVersion; }
    public void setModelVersion(String modelVersion) { this.modelVersion = modelVersion; }

    public Double getScore() { return score; }
    public void setScore(Double score) { this.score = score; }

    public String getResult() { return result; }
    public void setResult(String result) { this.result = result; }

    public String getExplanation() { return explanation; }
    public void setExplanation(String explanation) { this.explanation = explanation; }

    public String getInputFeatures() { return inputFeatures; }
    public void setInputFeatures(String inputFeatures) { this.inputFeatures = inputFeatures; }

    public String getReviewStatus() { return reviewStatus; }
    public void setReviewStatus(String reviewStatus) { this.reviewStatus = reviewStatus; }

    public String getReviewedBy() { return reviewedBy; }
    public void setReviewedBy(String reviewedBy) { this.reviewedBy = reviewedBy; }

    public LocalDateTime getReviewedAt() { return reviewedAt; }
    public void setReviewedAt(LocalDateTime reviewedAt) { this.reviewedAt = reviewedAt; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
