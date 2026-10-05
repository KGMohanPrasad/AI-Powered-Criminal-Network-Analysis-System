package com.intelligence.criminalnetwork.controller;

import com.intelligence.criminalnetwork.dto.ApiResponse;
import com.intelligence.criminalnetwork.dto.EvidenceDto;
import com.intelligence.criminalnetwork.entity.Evidence;
import com.intelligence.criminalnetwork.entity.EvidenceCustody;
import com.intelligence.criminalnetwork.service.EvidenceService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/evidence")
@CrossOrigin(origins = "*")
public class EvidenceController {

    @Autowired
    private EvidenceService evidenceService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Evidence>>> getAllEvidence(
            @RequestParam(required = false) Long caseId,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String status) {
        List<Evidence> list = evidenceService.getAllEvidence(caseId, type, status);
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Evidence>> getEvidenceById(@PathVariable Long id) {
        Evidence e = evidenceService.getEvidenceById(id);
        return ResponseEntity.ok(ApiResponse.ok(e));
    }

    @GetMapping("/{id}/custody")
    public ResponseEntity<ApiResponse<List<EvidenceCustody>>> getCustodyTimeline(@PathVariable Long id) {
        List<EvidenceCustody> timeline = evidenceService.getCustodyTimeline(id);
        return ResponseEntity.ok(ApiResponse.ok(timeline));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Evidence>> createEvidence(@Valid @RequestBody EvidenceDto dto) {
        Evidence created = evidenceService.createEvidence(dto);
        return ResponseEntity.ok(ApiResponse.ok("Evidence registered and vaulted successfully", created));
    }

    @PostMapping("/{id}/custody")
    public ResponseEntity<ApiResponse<EvidenceCustody>> addCustodyTransfer(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload) {
        EvidenceCustody custody = evidenceService.addCustodyTransfer(
                id,
                payload.get("transferredBy"),
                payload.get("receivedBy"),
                payload.get("reason"),
                payload.get("location"),
                payload.get("notes")
        );
        return ResponseEntity.ok(ApiResponse.ok("Chain of custody logged successfully", custody));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Evidence>> updateEvidence(@PathVariable Long id, @Valid @RequestBody EvidenceDto dto) {
        Evidence updated = evidenceService.updateEvidence(id, dto);
        return ResponseEntity.ok(ApiResponse.ok("Evidence updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteEvidence(@PathVariable Long id) {
        evidenceService.deleteEvidence(id);
        return ResponseEntity.ok(ApiResponse.ok("Evidence archived successfully", null));
    }
}
