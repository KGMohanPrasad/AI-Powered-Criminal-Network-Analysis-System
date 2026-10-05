package com.intelligence.criminalnetwork.controller;

import com.intelligence.criminalnetwork.dto.ApiResponse;
import com.intelligence.criminalnetwork.entity.IntelligenceAlert;
import com.intelligence.criminalnetwork.service.AlertService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/alerts")
@CrossOrigin(origins = "*")
public class AlertController {

    @Autowired private AlertService alertService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<IntelligenceAlert>>> getAllAlerts(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String level) {
        return ResponseEntity.ok(ApiResponse.ok(alertService.getAllAlerts(status, level)));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<IntelligenceAlert>> updateAlertStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload) {
        String status = payload.getOrDefault("status", "REVIEWED");
        IntelligenceAlert updated = alertService.updateAlertStatus(id, status);
        return ResponseEntity.ok(ApiResponse.ok("Alert status updated successfully", updated));
    }

    @PostMapping("/evaluate")
    public ResponseEntity<ApiResponse<Map<String, Object>>> evaluateDatabaseRules() {
        Map<String, Object> result = alertService.evaluateDatabaseRules();
        return ResponseEntity.ok(ApiResponse.ok("Database rules evaluated successfully", result));
    }
}
