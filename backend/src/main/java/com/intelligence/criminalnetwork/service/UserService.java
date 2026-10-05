package com.intelligence.criminalnetwork.service;

import com.intelligence.criminalnetwork.entity.AuditLog;
import com.intelligence.criminalnetwork.entity.User;
import com.intelligence.criminalnetwork.exception.ResourceNotFoundException;
import com.intelligence.criminalnetwork.repository.AuditLogRepository;
import com.intelligence.criminalnetwork.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class UserService {

    @Autowired private UserRepository userRepository;
    @Autowired private AuditLogRepository auditLogRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    private String getCurrentUsername() {
        if (SecurityContextHolder.getContext().getAuthentication() != null) {
            return SecurityContextHolder.getContext().getAuthentication().getName();
        }
        return "system";
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));
    }

    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));
    }

    @Transactional
    public User createUser(User user) {
        if (user.getPassword() == null || user.getPassword().isBlank()) {
            user.setPassword("Password@123");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        if (user.getRole() == null || user.getRole().isBlank()) {
            user.setRole("ROLE_INVESTIGATOR");
        } else if (!user.getRole().startsWith("ROLE_")) {
            user.setRole("ROLE_" + user.getRole().toUpperCase());
        }
        User saved = userRepository.save(user);
        auditLogRepository.save(new AuditLog(
                getCurrentUsername(),
                "CREATE_USER",
                "USER",
                saved.getUsername(),
                "Admin created user account for " + saved.getFullName() + " with role " + saved.getRole()
        ));
        return saved;
    }

    @Transactional
    public User updateUser(Long id, User updated) {
        User user = getUserById(id);
        if (updated.getFullName() != null) user.setFullName(updated.getFullName());
        if (updated.getEmail() != null) user.setEmail(updated.getEmail());
        if (updated.getBadgeNumber() != null) user.setBadgeNumber(updated.getBadgeNumber());
        if (updated.getDepartment() != null) user.setDepartment(updated.getDepartment());
        if (updated.getPhone() != null) user.setPhone(updated.getPhone());
        if (updated.getRole() != null) {
            String role = updated.getRole();
            if (!role.startsWith("ROLE_")) role = "ROLE_" + role.toUpperCase();
            user.setRole(role);
        }
        User saved = userRepository.save(user);
        auditLogRepository.save(new AuditLog(
                getCurrentUsername(),
                "EDIT_USER",
                "USER",
                saved.getUsername(),
                "Updated user details for " + saved.getUsername()
        ));
        return saved;
    }

    @Transactional
    public User toggleUserStatus(Long id, boolean active) {
        User user = getUserById(id);
        user.setActive(active);
        User saved = userRepository.save(user);
        auditLogRepository.save(new AuditLog(
                getCurrentUsername(),
                active ? "ACTIVATE_USER" : "DEACTIVATE_USER",
                "USER",
                saved.getUsername(),
                (active ? "Activated" : "Deactivated") + " account for " + saved.getUsername()
        ));
        return saved;
    }

    @Transactional
    public User resetPassword(Long id, String newPassword) {
        User user = getUserById(id);
        String pwd = (newPassword != null && !newPassword.isBlank()) ? newPassword : "Password@123";
        user.setPassword(passwordEncoder.encode(pwd));
        User saved = userRepository.save(user);
        auditLogRepository.save(new AuditLog(
                getCurrentUsername(),
                "RESET_PASSWORD",
                "USER",
                saved.getUsername(),
                "Password reset for user " + saved.getUsername()
        ));
        return saved;
    }

    @Transactional
    public User changeRole(Long id, String role) {
        User user = getUserById(id);
        if (!role.startsWith("ROLE_")) role = "ROLE_" + role.toUpperCase();
        user.setRole(role);
        User saved = userRepository.save(user);
        auditLogRepository.save(new AuditLog(
                getCurrentUsername(),
                "CHANGE_ROLE",
                "USER",
                saved.getUsername(),
                "Changed role of user " + saved.getUsername() + " to " + role
        ));
        return saved;
    }

    @Transactional
    public User updateProfile(String fullName, String department, String phone, String avatarUrl) {
        String username = getCurrentUsername();
        User user = getUserByUsername(username);
        if (fullName != null) user.setFullName(fullName);
        if (department != null) user.setDepartment(department);
        if (phone != null) user.setPhone(phone);
        if (avatarUrl != null) user.setAvatarUrl(avatarUrl);
        return userRepository.save(user);
    }

    @Transactional
    public void changePassword(String currentPassword, String newPassword) {
        String username = getCurrentUsername();
        User user = getUserByUsername(username);
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new IllegalArgumentException("Current password does not match");
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        auditLogRepository.save(new AuditLog(
                username,
                "CHANGE_OWN_PASSWORD",
                "USER",
                username,
                "User changed their password"
        ));
    }
}
