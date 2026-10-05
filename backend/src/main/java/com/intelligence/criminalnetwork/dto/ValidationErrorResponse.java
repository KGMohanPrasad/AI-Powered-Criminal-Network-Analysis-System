package com.intelligence.criminalnetwork.dto;

import java.time.LocalDateTime;
import java.util.Map;

public class ValidationErrorResponse {
    private boolean success = false;
    private String message = "Validation failed";
    private Map<String, String> errors;
    private LocalDateTime timestamp = LocalDateTime.now();

    public ValidationErrorResponse(Map<String, String> errors) {
        this.errors = errors;
        this.timestamp = LocalDateTime.now();
    }

    public boolean isSuccess() { return success; }
    public String getMessage() { return message; }
    public Map<String, String> getErrors() { return errors; }
    public LocalDateTime getTimestamp() { return timestamp; }
}
