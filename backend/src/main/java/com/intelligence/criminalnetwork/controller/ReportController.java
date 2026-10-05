package com.intelligence.criminalnetwork.controller;

import com.intelligence.criminalnetwork.dto.ApiResponse;
import com.intelligence.criminalnetwork.entity.InvestigationReport;
import com.intelligence.criminalnetwork.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*")
public class ReportController {

    @Autowired private ReportService reportService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<InvestigationReport>>> getAllReports() {
        return ResponseEntity.ok(ApiResponse.ok(reportService.getAllReports()));
    }

    @PostMapping("/generate")
    public ResponseEntity<ApiResponse<InvestigationReport>> generateReport(@RequestBody Map<String, String> payload) {
        String title = payload.getOrDefault("title", "Investigation Intelligence Report");
        String type = payload.getOrDefault("type", "CASE_SUMMARY");
        String filters = payload.getOrDefault("filters", "Active Records");
        String summary = payload.getOrDefault("summary", "Automated system report.");

        InvestigationReport rep = reportService.generateReport(title, type, filters, summary);
        return ResponseEntity.ok(ApiResponse.ok("Report generated successfully", rep));
    }
}
