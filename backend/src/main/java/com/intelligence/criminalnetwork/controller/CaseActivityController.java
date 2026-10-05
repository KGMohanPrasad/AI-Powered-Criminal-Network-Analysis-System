package com.intelligence.criminalnetwork.controller;

import com.intelligence.criminalnetwork.dto.ApiResponse;
import com.intelligence.criminalnetwork.entity.CaseActivity;
import com.intelligence.criminalnetwork.service.CaseActivityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/case-activities")
@CrossOrigin(origins = "*")
public class CaseActivityController {

    @Autowired
    private CaseActivityService caseActivityService;

    @GetMapping("/case/{caseId}")
    public ResponseEntity<ApiResponse<List<CaseActivity>>> getActivityByCaseId(@PathVariable Long caseId) {
        return ResponseEntity.ok(ApiResponse.ok(caseActivityService.getActivityByCaseId(caseId)));
    }

    @GetMapping("/case-number/{caseNumber}")
    public ResponseEntity<ApiResponse<List<CaseActivity>>> getActivityByCaseNumber(@PathVariable String caseNumber) {
        return ResponseEntity.ok(ApiResponse.ok(caseActivityService.getActivityByCaseNumber(caseNumber)));
    }

    @GetMapping("/recent")
    public ResponseEntity<ApiResponse<List<CaseActivity>>> getRecentActivities() {
        return ResponseEntity.ok(ApiResponse.ok(caseActivityService.getRecentActivities()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CaseActivity>> logActivity(@RequestBody CaseActivity activity) {
        CaseActivity logged = caseActivityService.logActivity(
                activity.getCaseId(),
                activity.getCaseNumber(),
                activity.getActionType(),
                activity.getTitle(),
                activity.getDescription(),
                activity.getPerformedBy()
        );
        return ResponseEntity.ok(ApiResponse.ok("Activity logged successfully", logged));
    }
}
