package com.intelligence.criminalnetwork.controller;

import com.intelligence.criminalnetwork.entity.PublicDataRecord;
import com.intelligence.criminalnetwork.service.PublicDataService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/external-review")
@CrossOrigin(origins = "*")
public class ExternalReviewController {

    private final PublicDataService publicDataService;

    public ExternalReviewController(PublicDataService publicDataService) {
        this.publicDataService = publicDataService;
    }

    @GetMapping
    public ResponseEntity<List<PublicDataRecord>> getPendingReviews() {
        return ResponseEntity.ok(publicDataService.getRequiresReview());
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<?> approveRecord(@PathVariable Long id) {
        try {
            PublicDataRecord record = publicDataService.approveRecord(id);
            return ResponseEntity.ok(Map.of("message", "Record approved for public dataset", "record", record));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<?> rejectRecord(@PathVariable Long id) {
        try {
            PublicDataRecord record = publicDataService.rejectRecord(id);
            return ResponseEntity.ok(Map.of("message", "Record rejected and archived", "record", record));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
