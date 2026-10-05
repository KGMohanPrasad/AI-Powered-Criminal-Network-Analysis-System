package com.intelligence.criminalnetwork.controller;

import com.intelligence.criminalnetwork.dto.ApiResponse;
import com.intelligence.criminalnetwork.entity.InvestigationNote;
import com.intelligence.criminalnetwork.service.NoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notes")
@CrossOrigin(origins = "*")
public class NoteController {

    @Autowired
    private NoteService noteService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<InvestigationNote>>> getNotes(
            @RequestParam(required = false) Long caseId,
            @RequestParam(required = false) Long personId,
            @RequestParam(required = false) String query) {
        return ResponseEntity.ok(ApiResponse.ok(noteService.getNotes(caseId, personId, query)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<InvestigationNote>> getNoteById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(noteService.getNoteById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<InvestigationNote>> createNote(@RequestBody InvestigationNote note) {
        return ResponseEntity.ok(ApiResponse.ok("Note created successfully", noteService.createNote(note)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<InvestigationNote>> updateNote(
            @PathVariable Long id,
            @RequestBody InvestigationNote note) {
        return ResponseEntity.ok(ApiResponse.ok("Note updated successfully", noteService.updateNote(id, note)));
    }

    @PutMapping("/{id}/pin")
    public ResponseEntity<ApiResponse<InvestigationNote>> togglePin(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("Note pin status updated", noteService.togglePin(id)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteNote(@PathVariable Long id) {
        noteService.deleteNote(id);
        return ResponseEntity.ok(ApiResponse.ok("Note deleted successfully", null));
    }
}
