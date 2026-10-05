package com.intelligence.criminalnetwork.controller;

import com.intelligence.criminalnetwork.dto.ApiResponse;
import com.intelligence.criminalnetwork.entity.CommunicationRecord;
import com.intelligence.criminalnetwork.service.CommunicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/communications")
@CrossOrigin(origins = "*")
public class CommunicationController {

    @Autowired private CommunicationService communicationService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<CommunicationRecord>>> getAllCommunications(
            @RequestParam(required = false) Long caseId,
            @RequestParam(required = false) String type) {
        return ResponseEntity.ok(ApiResponse.ok(communicationService.getAllCommunications(caseId, type)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CommunicationRecord>> createCommunication(@RequestBody CommunicationRecord comm) {
        return ResponseEntity.ok(ApiResponse.ok("Communication record saved successfully", communicationService.createCommunication(comm)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CommunicationRecord>> updateCommunication(@PathVariable Long id, @RequestBody CommunicationRecord comm) {
        return ResponseEntity.ok(ApiResponse.ok("Communication record updated successfully", communicationService.updateCommunication(id, comm)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCommunication(@PathVariable Long id) {
        communicationService.deleteCommunication(id);
        return ResponseEntity.ok(ApiResponse.ok("Communication record deleted successfully", null));
    }
}
