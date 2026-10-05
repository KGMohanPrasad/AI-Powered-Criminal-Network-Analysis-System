package com.intelligence.criminalnetwork.controller;

import com.intelligence.criminalnetwork.entity.PublicDataRecord;
import com.intelligence.criminalnetwork.service.PublicDataService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/live-data")
@CrossOrigin(origins = "*")
public class LiveDataController {

    private final PublicDataService publicDataService;

    public LiveDataController(PublicDataService publicDataService) {
        this.publicDataService = publicDataService;
    }

    @GetMapping
    public ResponseEntity<Page<PublicDataRecord>> getLiveData(
            @RequestParam(required = false, defaultValue = "ALL") String category,
            @RequestParam(required = false, defaultValue = "ALL") String state,
            @RequestParam(required = false, defaultValue = "ALL") String status,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return ResponseEntity.ok(publicDataService.search(category, state, status, search, page, size));
    }

    @GetMapping("/trends")
    public ResponseEntity<Map<String, Object>> getTrends() {
        return ResponseEntity.ok(publicDataService.getTrends());
    }

    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getStatistics() {
        return ResponseEntity.ok(publicDataService.getStatistics());
    }
}
