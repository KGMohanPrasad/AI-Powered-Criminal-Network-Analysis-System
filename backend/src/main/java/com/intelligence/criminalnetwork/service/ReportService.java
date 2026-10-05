package com.intelligence.criminalnetwork.service;

import com.intelligence.criminalnetwork.entity.AuditLog;
import com.intelligence.criminalnetwork.entity.InvestigationReport;
import com.intelligence.criminalnetwork.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ReportService {

    @Autowired private InvestigationReportRepository reportRepository;
    @Autowired private AuditLogRepository auditLogRepository;
    @Autowired private CaseRepository caseRepository;
    @Autowired private PersonRepository personRepository;
    @Autowired private RelationshipRepository relationshipRepository;
    @Autowired private EvidenceRepository evidenceRepository;

    private String getCurrentUsername() {
        if (SecurityContextHolder.getContext().getAuthentication() != null) {
            return SecurityContextHolder.getContext().getAuthentication().getName();
        }
        return "system";
    }

    public List<InvestigationReport> getAllReports() {
        return reportRepository.findAllByOrderByCreatedAtDesc();
    }

    @Transactional
    public InvestigationReport generateReport(String title, String type, String filters, String summary) {
        InvestigationReport r = new InvestigationReport();
        long count = reportRepository.count() + 1;
        r.setReportId(String.format("REP-2026-%04d", count));
        r.setTitle(title);
        r.setReportType(type);
        r.setGeneratedBy(getCurrentUsername());
        r.setFiltersUsed(filters != null ? filters : "Default All Records");
        r.setSummaryText(summary != null ? summary : "Comprehensive intelligence report compiling relational structures, evidentiary items, and timeline metrics.");

        InvestigationReport saved = reportRepository.save(r);

        auditLogRepository.save(new AuditLog(
                getCurrentUsername(),
                "EXPORT_REPORT",
                "REPORT",
                saved.getReportId(),
                "Generated intelligence report: " + saved.getTitle() + " (" + saved.getReportType() + ")"
        ));

        return saved;
    }
}
