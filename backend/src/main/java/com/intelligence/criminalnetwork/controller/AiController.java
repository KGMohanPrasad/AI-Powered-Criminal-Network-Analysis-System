package com.intelligence.criminalnetwork.controller;

import com.intelligence.criminalnetwork.dto.ApiResponse;
import com.intelligence.criminalnetwork.entity.MlAnalysisResult;
import com.intelligence.criminalnetwork.service.AiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ml")
@CrossOrigin(origins = "*")
public class AiController {

    private final AiService aiService;

    @Autowired
    public AiController(AiService aiService) {
        this.aiService = aiService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboard() {
        return ResponseEntity.ok(ApiResponse.ok(aiService.getAiDashboardSummary()));
    }

    @PostMapping("/network-analysis")
    public ResponseEntity<ApiResponse<Map<String, Object>>> runNetworkAnalysis(@RequestBody(required = false) Map<String, Object> req) {
        return ResponseEntity.ok(ApiResponse.ok("Network centrality analysis completed successfully", aiService.runNetworkAnalysis(req)));
    }

    @PostMapping("/community-detection")
    public ResponseEntity<ApiResponse<Map<String, Object>>> runCommunityDetection(@RequestBody(required = false) Map<String, Object> req) {
        return ResponseEntity.ok(ApiResponse.ok("Community detection completed successfully", aiService.runCommunityDetection(req)));
    }

    @PostMapping("/anomaly-detection")
    public ResponseEntity<ApiResponse<Map<String, Object>>> runAnomalyDetection(@RequestBody(required = false) Map<String, Object> req) {
        return ResponseEntity.ok(ApiResponse.ok("Isolation Forest anomaly detection completed", aiService.runAnomalyDetection(req)));
    }

    @PostMapping("/link-prediction")
    public ResponseEntity<ApiResponse<Map<String, Object>>> runLinkPrediction(@RequestBody(required = false) Map<String, Object> req) {
        return ResponseEntity.ok(ApiResponse.ok("Graph link prediction generated successfully", aiService.runLinkPrediction(req)));
    }

    @PostMapping("/case-similarity")
    public ResponseEntity<ApiResponse<Map<String, Object>>> runCaseSimilarity(@RequestBody(required = false) Map<String, Object> req) {
        return ResponseEntity.ok(ApiResponse.ok("Case vector similarity computed successfully", aiService.runCaseSimilarity(req)));
    }

    @PostMapping("/clustering")
    public ResponseEntity<ApiResponse<Map<String, Object>>> runClustering(@RequestBody(required = false) Map<String, Object> req) {
        return ResponseEntity.ok(ApiResponse.ok("K-Means clustering completed successfully", aiService.runClustering(req)));
    }

    @GetMapping("/models")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getModels() {
        return ResponseEntity.ok(ApiResponse.ok(aiService.getModelInfo()));
    }

    @GetMapping("/model-metrics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getModelMetrics() {
        return ResponseEntity.ok(ApiResponse.ok(aiService.getModelMetrics()));
    }

    @PostMapping("/train")
    public ResponseEntity<ApiResponse<Map<String, Object>>> trainModels(@RequestBody(required = false) Map<String, Object> req) {
        return ResponseEntity.ok(ApiResponse.ok("Model training pipeline executed", aiService.trainModels(req)));
    }

    @GetMapping("/dataset")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDataset() {
        return ResponseEntity.ok(ApiResponse.ok(aiService.getDatasetPreview()));
    }

    @GetMapping("/model-comparison")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getModelComparison() {
        return ResponseEntity.ok(ApiResponse.ok("Model comparison benchmarks executed successfully", aiService.getModelComparison()));
    }

    @GetMapping("/network-change")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getNetworkChange(@RequestParam(defaultValue = "30d") String period) {
        return ResponseEntity.ok(ApiResponse.ok("Network change detection computed successfully", aiService.getNetworkChange(period)));
    }

    @GetMapping("/preprocessing-details")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getPreprocessingDetails() {
        return ResponseEntity.ok(ApiResponse.ok("Data preprocessing and feature pipeline details", aiService.getPreprocessingDetails()));
    }

    @GetMapping("/results")
    public ResponseEntity<ApiResponse<List<MlAnalysisResult>>> getResults(@RequestParam(required = false) String reviewStatus) {
        return ResponseEntity.ok(ApiResponse.ok(aiService.getHistoricalResults(reviewStatus)));
    }

    @PutMapping("/results/{id}/review")
    public ResponseEntity<ApiResponse<MlAnalysisResult>> reviewResult(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            Principal principal) {
        String status = body.getOrDefault("status", "ACCEPTED_AS_LEAD");
        String username = principal != null ? principal.getName() : body.getOrDefault("user", "Investigator");
        MlAnalysisResult updated = aiService.reviewResult(id, status, username);
        return ResponseEntity.ok(ApiResponse.ok("Lead status updated to " + status, updated));
    }

    @GetMapping("/person/{personId}/insights")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getPersonInsights(@PathVariable String personId) {
        return ResponseEntity.ok(ApiResponse.ok(aiService.getPersonInsights(personId)));
    }

    @GetMapping("/case/{caseId}/insights")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getCaseInsights(@PathVariable Long caseId) {
        return ResponseEntity.ok(ApiResponse.ok(aiService.getCaseInsights(caseId)));
    }
}
