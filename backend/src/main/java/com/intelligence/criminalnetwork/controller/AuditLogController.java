package com.intelligence.criminalnetwork.controller;

import com.intelligence.criminalnetwork.dto.ApiResponse;
import com.intelligence.criminalnetwork.entity.AuditLog;
import com.intelligence.criminalnetwork.service.AuditService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/audit-logs")
@CrossOrigin(origins = "*")
public class AuditLogController {

    @Autowired private AuditService auditService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<AuditLog>>> getAuditLogs(@RequestParam(required = false) String username) {
        return ResponseEntity.ok(ApiResponse.ok(auditService.getAuditLogs(username)));
    }
}
