package com.intelligence.criminalnetwork.controller;

import com.intelligence.criminalnetwork.entity.DataSource;
import com.intelligence.criminalnetwork.entity.ScraperLog;
import com.intelligence.criminalnetwork.entity.SyncJob;
import com.intelligence.criminalnetwork.service.DataIngestionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/data-sources")
@CrossOrigin(origins = "*")
public class DataSourceController {

    private final DataIngestionService ingestionService;

    public DataSourceController(DataIngestionService ingestionService) {
        this.ingestionService = ingestionService;
    }

    @GetMapping
    public ResponseEntity<List<DataSource>> getAllSources() {
        return ResponseEntity.ok(ingestionService.getAllSources());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DataSource> getSourceById(@PathVariable Long id) {
        return ingestionService.getSourceById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createSource(@RequestBody DataSource source) {
        try {
            DataSource saved = ingestionService.saveSource(source);
            return ResponseEntity.ok(saved);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateSource(@PathVariable Long id, @RequestBody DataSource source) {
        try {
            DataSource updated = ingestionService.updateSource(id, source);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{id}/sync")
    public ResponseEntity<?> syncSource(@PathVariable Long id) {
        try {
            SyncJob job = ingestionService.triggerSync(id);
            return ResponseEntity.ok(job);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(403).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{id}/logs")
    public ResponseEntity<List<ScraperLog>> getSourceLogs(@PathVariable Long id) {
        return ResponseEntity.ok(ingestionService.getLogsForSource(id));
    }

    @GetMapping("/logs")
    public ResponseEntity<List<ScraperLog>> getRecentLogs() {
        return ResponseEntity.ok(ingestionService.getRecentLogs());
    }

    @PostMapping("/test-source")
    public ResponseEntity<?> testSource(@RequestBody Map<String, String> payload) {
        String url = payload.get("baseUrl");
        if (url == null || url.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Missing baseUrl in request"));
        }
        Map<String, Object> result = ingestionService.testSourceConnection(url);
        return ResponseEntity.ok(result);
    }
}
