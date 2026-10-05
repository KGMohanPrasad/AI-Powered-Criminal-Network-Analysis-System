package com.intelligence.criminalnetwork.controller;

import com.intelligence.criminalnetwork.dto.ApiResponse;
import com.intelligence.criminalnetwork.dto.CaseDto;
import com.intelligence.criminalnetwork.service.CaseService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cases")
@CrossOrigin(origins = "*")
public class CaseController {

    @Autowired
    private CaseService caseService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<CaseDto>>> getAllCases(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String priority,
            @RequestParam(required = false) String keyword) {
        List<CaseDto> cases = caseService.getAllCases(status, priority, keyword);
        return ResponseEntity.ok(ApiResponse.ok(cases));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CaseDto>> getCaseById(@PathVariable Long id) {
        CaseDto c = caseService.getCaseById(id);
        return ResponseEntity.ok(ApiResponse.ok(c));
    }

    @GetMapping("/number/{caseNumber}")
    public ResponseEntity<ApiResponse<CaseDto>> getCaseByNumber(@PathVariable String caseNumber) {
        CaseDto c = caseService.getCaseByNumber(caseNumber);
        return ResponseEntity.ok(ApiResponse.ok(c));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CaseDto>> createCase(@Valid @RequestBody CaseDto caseDto) {
        CaseDto created = caseService.createCase(caseDto);
        return ResponseEntity.ok(ApiResponse.ok("Case created successfully", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CaseDto>> updateCase(@PathVariable Long id, @Valid @RequestBody CaseDto caseDto) {
        CaseDto updated = caseService.updateCase(id, caseDto);
        return ResponseEntity.ok(ApiResponse.ok("Case updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCase(@PathVariable Long id) {
        caseService.deleteCase(id);
        return ResponseEntity.ok(ApiResponse.ok("Case deleted successfully", null));
    }
}
