package com.weatherguard.backend.controller;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.weatherguard.backend.dto.UserResponse;
import com.weatherguard.backend.model.Alert;
import com.weatherguard.backend.model.EmergencyGuideline;
import com.weatherguard.backend.model.User;
import com.weatherguard.backend.repository.AlertRepository;
import com.weatherguard.backend.repository.EmergencyGuidelineRepository;
import com.weatherguard.backend.repository.UserRepository;
import com.weatherguard.backend.security.JwtUtil;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @PutMapping("/users/{id}/role")
public ResponseEntity<?> updateUserRole(@RequestHeader("Authorization") String authHeader, @PathVariable Long id, @RequestBody Map<String, String> body) {
    if (!isAdmin(authHeader)) {
        return ResponseEntity.status(403).body(Map.of("error", "Admin access required"));
    }
    String newRole = body.get("role");
    if (!OPERATIONAL_ROLES.contains(newRole.toUpperCase()) && !"USER".equalsIgnoreCase(newRole)) {
        return ResponseEntity.badRequest().body(Map.of("error", "Invalid role"));
    }
    User user = userRepository.findById(id).orElse(null);
    if (user == null) {
        return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
    }
    user.setRole(newRole.toUpperCase());
    userRepository.save(user);
    return ResponseEntity.ok(Map.of("message", "Role updated", "role", user.getRole()));
}

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AlertRepository alertRepository;

    @Autowired
    private EmergencyGuidelineRepository guidelineRepository;

    @Autowired
    private JwtUtil jwtUtil;

    private static final java.util.Set<String> OPERATIONAL_ROLES = java.util.Set.of(
    "ADMIN", "DMA", "RELIEF_SQUAD", "CONTROL_ROOM", "MILITARY"
);

private boolean isAdmin(String authHeader) {
    String token = authHeader.replace("Bearer ", "");
    String email = jwtUtil.extractEmail(token);
    User user = userRepository.findByEmail(email).orElse(null);
    return user != null && OPERATIONAL_ROLES.contains(user.getRole().toUpperCase());
}

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers(@RequestHeader("Authorization") String authHeader) {
        if (!isAdmin(authHeader)) {
            return ResponseEntity.status(403).body(Map.of("error", "Admin access required"));
        }
        List<UserResponse> users = userRepository.findAll().stream().map(u -> {
            UserResponse r = new UserResponse();
            r.setId(u.getId());
            r.setName(u.getName());
            r.setEmail(u.getEmail());
            r.setRole(u.getRole());
            r.setPreferredLocation(u.getPreferredLocation());
            r.setPreferredLat(u.getPreferredLat());
            r.setPreferredLon(u.getPreferredLon());
            return r;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    @GetMapping("/alerts")
    public ResponseEntity<?> getAllAlerts(@RequestHeader("Authorization") String authHeader) {
        if (!isAdmin(authHeader)) {
            return ResponseEntity.status(403).body(Map.of("error", "Admin access required"));
        }
        return ResponseEntity.ok(alertRepository.findAllByOrderByCreatedAtDesc());
    }

    @DeleteMapping("/alerts/{id}")
    public ResponseEntity<?> deleteAlert(@RequestHeader("Authorization") String authHeader, @PathVariable Long id) {
        if (!isAdmin(authHeader)) {
            return ResponseEntity.status(403).body(Map.of("error", "Admin access required"));
        }
        alertRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Alert deleted"));
    }

    @PostMapping("/guidelines")
    public ResponseEntity<?> createGuideline(@RequestHeader("Authorization") String authHeader, @RequestBody EmergencyGuideline guideline) {
        if (!isAdmin(authHeader)) {
            return ResponseEntity.status(403).body(Map.of("error", "Admin access required"));
        }
        return ResponseEntity.ok(guidelineRepository.save(guideline));
    }

    @PutMapping("/guidelines/{id}")
    public ResponseEntity<?> updateGuideline(@RequestHeader("Authorization") String authHeader, @PathVariable Long id, @RequestBody EmergencyGuideline updated) {
        if (!isAdmin(authHeader)) {
            return ResponseEntity.status(403).body(Map.of("error", "Admin access required"));
        }
        EmergencyGuideline guideline = guidelineRepository.findById(id).orElse(null);
        if (guideline == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Guideline not found"));
        }
        guideline.setDisasterType(updated.getDisasterType());
        guideline.setRiskLevel(updated.getRiskLevel());
        guideline.setInstructions(updated.getInstructions());
        return ResponseEntity.ok(guidelineRepository.save(guideline));
    }

    @DeleteMapping("/guidelines/{id}")
    public ResponseEntity<?> deleteGuideline(@RequestHeader("Authorization") String authHeader, @PathVariable Long id) {
        if (!isAdmin(authHeader)) {
            return ResponseEntity.status(403).body(Map.of("error", "Admin access required"));
        }
        guidelineRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Guideline deleted"));
    }
    @GetMapping("/timeline")
public ResponseEntity<List<Alert>> getTimeline() {
    return ResponseEntity.ok(alertRepository.findAllByOrderByCreatedAtDesc());
}
}