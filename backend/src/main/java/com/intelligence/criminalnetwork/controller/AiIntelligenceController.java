package com.intelligence.criminalnetwork.controller;

import com.intelligence.criminalnetwork.dto.AiAnalysisResultDto;
import com.intelligence.criminalnetwork.dto.ApiResponse;
import com.intelligence.criminalnetwork.entity.AiSuggestion;
import com.intelligence.criminalnetwork.service.AiAnalysisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class AiIntelligenceController {

    @Autowired private AiAnalysisService aiAnalysisService;

    @PostMapping("/network-analysis/{caseId}")
    public ResponseEntity<ApiResponse<AiAnalysisResultDto>> runNetworkAnalysisForCase(@PathVariable Long caseId) {
        AiAnalysisResultDto result = aiAnalysisService.runNetworkAnalysis(caseId);
        return ResponseEntity.ok(ApiResponse.ok("AI network intelligence analysis completed", result));
    }

    @PostMapping("/network-analysis")
    public ResponseEntity<ApiResponse<AiAnalysisResultDto>> runGlobalNetworkAnalysis() {
        AiAnalysisResultDto result = aiAnalysisService.runNetworkAnalysis(null);
        return ResponseEntity.ok(ApiResponse.ok("Global AI intelligence analysis completed", result));
    }

    @GetMapping("/suggestions")
    public ResponseEntity<ApiResponse<List<AiSuggestion>>> getSuggestions(@RequestParam(required = false) String status) {
        List<AiSuggestion> suggestions = aiAnalysisService.getSuggestions(status);
        return ResponseEntity.ok(ApiResponse.ok(suggestions));
    }

    @PostMapping("/suggestions/{id}/review")
    public ResponseEntity<ApiResponse<AiSuggestion>> reviewSuggestion(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload) {
        String action = payload.getOrDefault("action", "REJECT");
        AiSuggestion reviewed = aiAnalysisService.reviewSuggestion(id, action);
        return ResponseEntity.ok(ApiResponse.ok("Suggestion " + action.toLowerCase() + "ed successfully", reviewed));
    }
}
