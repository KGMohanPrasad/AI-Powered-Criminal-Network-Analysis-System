package com.intelligence.criminalnetwork.controller;

import com.intelligence.criminalnetwork.dto.ApiResponse;
import com.intelligence.criminalnetwork.entity.User;
import com.intelligence.criminalnetwork.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<User>>> getAllUsers() {
        return ResponseEntity.ok(ApiResponse.ok(userService.getAllUsers()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<User>> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(userService.getUserById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<User>> createUser(@RequestBody User user) {
        return ResponseEntity.ok(ApiResponse.ok("User created successfully", userService.createUser(user)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<User>> updateUser(@PathVariable Long id, @RequestBody User user) {
        return ResponseEntity.ok(ApiResponse.ok("User updated successfully", userService.updateUser(id, user)));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<User>> toggleStatus(@PathVariable Long id, @RequestBody Map<String, Boolean> payload) {
        boolean active = payload.getOrDefault("active", true);
        return ResponseEntity.ok(ApiResponse.ok("User status updated", userService.toggleUserStatus(id, active)));
    }

    @PostMapping("/{id}/reset-password")
    public ResponseEntity<ApiResponse<User>> resetPassword(@PathVariable Long id, @RequestBody(required = false) Map<String, String> payload) {
        String pwd = (payload != null) ? payload.get("password") : "Password@123";
        return ResponseEntity.ok(ApiResponse.ok("Password reset successfully", userService.resetPassword(id, pwd)));
    }

    @PutMapping("/{id}/role")
    public ResponseEntity<ApiResponse<User>> changeRole(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        String role = payload.getOrDefault("role", "ROLE_INVESTIGATOR");
        return ResponseEntity.ok(ApiResponse.ok("Role updated successfully", userService.changeRole(id, role)));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<User>> updateProfile(@RequestBody Map<String, String> payload) {
        User updated = userService.updateProfile(
                payload.get("fullName"),
                payload.get("department"),
                payload.get("phone"),
                payload.get("avatarUrl")
        );
        return ResponseEntity.ok(ApiResponse.ok("Profile updated successfully", updated));
    }

    @PostMapping("/change-password")
    public ResponseEntity<ApiResponse<Void>> changePassword(@RequestBody Map<String, String> payload) {
        userService.changePassword(payload.get("currentPassword"), payload.get("newPassword"));
        return ResponseEntity.ok(ApiResponse.ok("Password changed successfully", null));
    }
}
