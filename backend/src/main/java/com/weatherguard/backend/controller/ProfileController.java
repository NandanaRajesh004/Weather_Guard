package com.weatherguard.backend.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.weatherguard.backend.dto.ProfileUpdateRequest;
import com.weatherguard.backend.dto.UserResponse;
import com.weatherguard.backend.model.User;
import com.weatherguard.backend.repository.UserRepository;
import com.weatherguard.backend.security.JwtUtil;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    private String getEmailFromToken(String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        return jwtUtil.extractEmail(token);
    }

    private UserResponse toResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole());
        response.setPreferredLocation(user.getPreferredLocation());
        response.setPreferredLat(user.getPreferredLat());
        response.setPreferredLon(user.getPreferredLon());
        return response;
    }

    @GetMapping
    public ResponseEntity<?> getProfile(@RequestHeader("Authorization") String authHeader) {
        try {
            String email = getEmailFromToken(authHeader);
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            return ResponseEntity.ok(toResponse(user));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    @PostMapping("/make-admin")
public ResponseEntity<?> makeAdmin(@RequestHeader("Authorization") String authHeader) {
    try {
        String email = getEmailFromToken(authHeader);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setRole("ADMIN");
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "You are now an admin", "role", user.getRole()));
    } catch (Exception e) {
        return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
    }
}


    @PutMapping
    public ResponseEntity<?> updateProfile(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody ProfileUpdateRequest request) {
        try {
            String email = getEmailFromToken(authHeader);
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            if (request.getName() != null) user.setName(request.getName());
            if (request.getPreferredLocation() != null) user.setPreferredLocation(request.getPreferredLocation());
            if (request.getPreferredLat() != null) user.setPreferredLat(request.getPreferredLat());
            if (request.getPreferredLon() != null) user.setPreferredLon(request.getPreferredLon());

            userRepository.save(user);
            return ResponseEntity.ok(toResponse(user));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}