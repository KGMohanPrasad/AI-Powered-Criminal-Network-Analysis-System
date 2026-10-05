package com.intelligence.criminalnetwork.controller;

import com.intelligence.criminalnetwork.entity.SyncJob;
import com.intelligence.criminalnetwork.service.DataIngestionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/data-sync")
@CrossOrigin(origins = "*")
public class SyncJobController {

    private final DataIngestionService ingestionService;

    public SyncJobController(DataIngestionService ingestionService) {
        this.ingestionService = ingestionService;
    }

    @GetMapping("/jobs/{id}")
    public ResponseEntity<SyncJob> getJobStatus(@PathVariable String id) {
        try {
            SyncJob job = ingestionService.getSyncJob(id);
            return ResponseEntity.ok(job);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
