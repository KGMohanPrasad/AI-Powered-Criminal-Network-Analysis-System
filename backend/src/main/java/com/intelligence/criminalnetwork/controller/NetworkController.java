package com.intelligence.criminalnetwork.controller;

import com.intelligence.criminalnetwork.dto.ApiResponse;
import com.intelligence.criminalnetwork.dto.NetworkGraphDto;
import com.intelligence.criminalnetwork.dto.RelationshipDto;
import com.intelligence.criminalnetwork.entity.Relationship;
import com.intelligence.criminalnetwork.service.NetworkService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/network")
@CrossOrigin(origins = "*")
public class NetworkController {

    @Autowired
    private NetworkService networkService;

    @GetMapping
    public ResponseEntity<ApiResponse<NetworkGraphDto>> getCompleteNetwork() {
        NetworkGraphDto graph = networkService.getCompleteNetwork();
        return ResponseEntity.ok(ApiResponse.ok(graph));
    }

    @GetMapping("/case/{caseId}")
    public ResponseEntity<ApiResponse<NetworkGraphDto>> getNetworkByCase(@PathVariable Long caseId) {
        NetworkGraphDto graph = networkService.getNetworkByCase(caseId);
        return ResponseEntity.ok(ApiResponse.ok(graph));
    }

    @GetMapping("/person/{personId}")
    public ResponseEntity<ApiResponse<NetworkGraphDto>> getNetworkByPerson(@PathVariable String personId) {
        NetworkGraphDto graph = networkService.getNetworkByPerson(personId);
        return ResponseEntity.ok(ApiResponse.ok(graph));
    }

    @GetMapping("/relationships")
    public ResponseEntity<ApiResponse<java.util.List<Relationship>>> getAllRelationships(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String type) {
        return ResponseEntity.ok(ApiResponse.ok(networkService.getAllRelationships(query, status, type)));
    }

    @GetMapping("/path")
    public ResponseEntity<ApiResponse<com.intelligence.criminalnetwork.dto.PathAnalysisResultDto>> findShortestPath(
            @RequestParam String source,
            @RequestParam String target) {
        return ResponseEntity.ok(ApiResponse.ok(networkService.findShortestPath(source, target)));
    }

    @PostMapping("/relationships")
    public ResponseEntity<ApiResponse<Relationship>> createRelationship(@Valid @RequestBody RelationshipDto dto) {
        Relationship saved = networkService.createRelationship(dto);
        return ResponseEntity.ok(ApiResponse.ok("Relationship link established successfully", saved));
    }

    @PutMapping("/relationships/{id}")
    public ResponseEntity<ApiResponse<Relationship>> updateRelationship(@PathVariable Long id, @Valid @RequestBody RelationshipDto dto) {
        Relationship updated = networkService.updateRelationship(id, dto);
        return ResponseEntity.ok(ApiResponse.ok("Relationship link updated successfully", updated));
    }

    @DeleteMapping("/relationships/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteRelationship(@PathVariable Long id) {
        networkService.deleteRelationship(id);
        return ResponseEntity.ok(ApiResponse.ok("Relationship deleted successfully", null));
    }
}
