package com.intelligence.criminalnetwork.controller;

import com.intelligence.criminalnetwork.dto.ApiResponse;
import com.intelligence.criminalnetwork.dto.IncidentDto;
import com.intelligence.criminalnetwork.entity.Incident;
import com.intelligence.criminalnetwork.service.IncidentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/incidents")
@CrossOrigin(origins = "*")
public class IncidentController {

    @Autowired private IncidentService incidentService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Incident>>> getAllIncidents(
            @RequestParam(required = false) Long caseId,
            @RequestParam(required = false) String status) {
        List<Incident> list = incidentService.getAllIncidents(caseId, status);
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Incident>> getIncidentById(@PathVariable Long id) {
        Incident inc = incidentService.getIncidentById(id);
        return ResponseEntity.ok(ApiResponse.ok(inc));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Incident>> createIncident(@Valid @RequestBody IncidentDto dto) {
        Incident created = incidentService.createIncident(dto);
        return ResponseEntity.ok(ApiResponse.ok("Incident logged successfully", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Incident>> updateIncident(@PathVariable Long id, @Valid @RequestBody IncidentDto dto) {
        Incident updated = incidentService.updateIncident(id, dto);
        return ResponseEntity.ok(ApiResponse.ok("Incident updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteIncident(@PathVariable Long id) {
        incidentService.deleteIncident(id);
        return ResponseEntity.ok(ApiResponse.ok("Incident deleted successfully", null));
    }
}
