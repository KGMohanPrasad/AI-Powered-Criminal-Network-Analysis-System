package com.intelligence.criminalnetwork.service;

import com.intelligence.criminalnetwork.dto.AuthRequest;
import com.intelligence.criminalnetwork.dto.AuthResponse;
import com.intelligence.criminalnetwork.dto.RegisterRequest;
import com.intelligence.criminalnetwork.entity.AuditLog;
import com.intelligence.criminalnetwork.entity.User;
import com.intelligence.criminalnetwork.exception.BadRequestException;
import com.intelligence.criminalnetwork.repository.AuditLogRepository;
import com.intelligence.criminalnetwork.repository.UserRepository;
import com.intelligence.criminalnetwork.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private AuditLogRepository auditLogRepository;

    public AuthResponse login(AuthRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        User user = userRepository.findByUsername(loginRequest.getUsername())
                .or(() -> userRepository.findByEmail(loginRequest.getUsername()))
                .orElseThrow(() -> new BadRequestException("User not found"));

        auditLogRepository.save(new AuditLog(user.getUsername(), "LOGIN", "USER", user.getUsername(), "User signed in successfully."));

        return new AuthResponse(
                jwt,
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFullName(),
                user.getBadgeNumber(),
                user.getRole(),
                user.getDepartment()
        );
    }

    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByUsername(req.getUsername())) {
            throw new BadRequestException("Username is already taken");
        }
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new BadRequestException("Email is already in use");
        }

        String role = (req.getRole() != null && !req.getRole().isBlank()) ? req.getRole() : "ROLE_INVESTIGATOR";
        if (!role.startsWith("ROLE_")) {
            role = "ROLE_" + role.toUpperCase();
        }

        User user = new User(
                req.getUsername(),
                req.getEmail(),
                passwordEncoder.encode(req.getPassword()),
                req.getFullName(),
                req.getBadgeNumber() != null ? req.getBadgeNumber() : "BADGE-NEW",
                req.getDepartment() != null ? req.getDepartment() : "Intelligence Analysis Bureau",
                role
        );

        userRepository.save(user);

        auditLogRepository.save(new AuditLog(user.getUsername(), "REGISTER", "USER", user.getUsername(), "New investigator registered."));

        // Auto authenticate after register
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getUsername(), req.getPassword())
        );
        String jwt = tokenProvider.generateToken(authentication);

        return new AuthResponse(
                jwt,
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFullName(),
                user.getBadgeNumber(),
                user.getRole(),
                user.getDepartment()
        );
    }
}
