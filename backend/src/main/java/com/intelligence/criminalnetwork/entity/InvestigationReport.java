package com.intelligence.criminalnetwork.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reports")
public class InvestigationReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "report_id", nullable = false, unique = true, length = 50)
    private String reportId; // REP-0001

    @Column(nullable = false, length = 200)
    private String title;

    @Column(name = "report_type", nullable = false, length = 100)
    private String reportType; // CASE_SUMMARY, NETWORK_ANALYSIS, EVIDENCE_REPORT, TIMELINE_REPORT, INCIDENT_STATS, AI_INTELLIGENCE_SUMMARY

    @Column(name = "generated_by", nullable = false, length = 150)
    private String generatedBy;

    @Column(name = "filters_used", columnDefinition = "TEXT")
    private String filtersUsed;

    @Column(name = "summary_text", columnDefinition = "TEXT")
    private String summaryText;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public InvestigationReport() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getReportId() { return reportId; }
    public void setReportId(String reportId) { this.reportId = reportId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getReportType() { return reportType; }
    public void setReportType(String reportType) { this.reportType = reportType; }

    public String getGeneratedBy() { return generatedBy; }
    public void setGeneratedBy(String generatedBy) { this.generatedBy = generatedBy; }

    public String getFiltersUsed() { return filtersUsed; }
    public void setFiltersUsed(String filtersUsed) { this.filtersUsed = filtersUsed; }

    public String getSummaryText() { return summaryText; }
    public void setSummaryText(String summaryText) { this.summaryText = summaryText; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
