package com.intelligence.criminalnetwork.dto;

import java.util.List;

public class CaseSimilarityDto {
    private String sourceCaseNumber;
    private String sourceCaseTitle;
    private String targetCaseNumber;
    private String targetCaseTitle;
    private int similarityScore; // 0 - 100%
    private int sharedIndicatorsCount;
    private List<String> sharedIndicators;
    private String analyticalObservation;

    public CaseSimilarityDto() {}

    public CaseSimilarityDto(String sourceCaseNumber, String sourceCaseTitle, String targetCaseNumber, String targetCaseTitle, int similarityScore, int sharedIndicatorsCount, List<String> sharedIndicators, String analyticalObservation) {
        this.sourceCaseNumber = sourceCaseNumber;
        this.sourceCaseTitle = sourceCaseTitle;
        this.targetCaseNumber = targetCaseNumber;
        this.targetCaseTitle = targetCaseTitle;
        this.similarityScore = similarityScore;
        this.sharedIndicatorsCount = sharedIndicatorsCount;
        this.sharedIndicators = sharedIndicators;
        this.analyticalObservation = analyticalObservation;
    }

    public String getSourceCaseNumber() { return sourceCaseNumber; }
    public void setSourceCaseNumber(String sourceCaseNumber) { this.sourceCaseNumber = sourceCaseNumber; }

    public String getSourceCaseTitle() { return sourceCaseTitle; }
    public void setSourceCaseTitle(String sourceCaseTitle) { this.sourceCaseTitle = sourceCaseTitle; }

    public String getTargetCaseNumber() { return targetCaseNumber; }
    public void setTargetCaseNumber(String targetCaseNumber) { this.targetCaseNumber = targetCaseNumber; }

    public String getTargetCaseTitle() { return targetCaseTitle; }
    public void setTargetCaseTitle(String targetCaseTitle) { this.targetCaseTitle = targetCaseTitle; }

    public int getSimilarityScore() { return similarityScore; }
    public void setSimilarityScore(int similarityScore) { this.similarityScore = similarityScore; }

    public int getSharedIndicatorsCount() { return sharedIndicatorsCount; }
    public void setSharedIndicatorsCount(int sharedIndicatorsCount) { this.sharedIndicatorsCount = sharedIndicatorsCount; }

    public List<String> getSharedIndicators() { return sharedIndicators; }
    public void setSharedIndicators(List<String> sharedIndicators) { this.sharedIndicators = sharedIndicators; }

    public String getAnalyticalObservation() { return analyticalObservation; }
    public void setAnalyticalObservation(String analyticalObservation) { this.analyticalObservation = analyticalObservation; }
}
