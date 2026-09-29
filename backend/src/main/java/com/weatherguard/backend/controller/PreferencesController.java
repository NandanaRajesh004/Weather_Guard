package com.weatherguard.backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.weatherguard.backend.model.Location;
import com.weatherguard.backend.model.User;
import com.weatherguard.backend.model.UserPreference;
import com.weatherguard.backend.repository.LocationRepository;
import com.weatherguard.backend.repository.UserPreferenceRepository;
import com.weatherguard.backend.repository.UserRepository;
import com.weatherguard.backend.security.JwtUtil;

@RestController
@RequestMapping("/api/preferences")
public class PreferencesController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LocationRepository locationRepository;

    @Autowired
    private UserPreferenceRepository preferenceRepository;

    @Autowired
    private JwtUtil jwtUtil;

    private User getUser(String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String email = jwtUtil.extractEmail(token);
        return userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
    }

    @GetMapping
    public ResponseEntity<?> getPreferences(@RequestHeader("Authorization") String authHeader) {
        User user = getUser(authHeader);
        List<UserPreference> prefs = preferenceRepository.findByUserId(user.getId());
        return ResponseEntity.ok(prefs);
    }

    @PostMapping
    public ResponseEntity<?> addPreference(@RequestHeader("Authorization") String authHeader, @RequestBody Map<String, Object> body) {
        User user = getUser(authHeader);
        String district = (String) body.get("district");
        Double lat = Double.valueOf(body.get("latitude").toString());
        Double lon = Double.valueOf(body.get("longitude").toString());
        String hazards = (String) body.get("selectedHazards");
        String threshold = (String) body.get("alertThreshold");

        Location location = locationRepository.findByDistrict(district).orElseGet(() -> {
            Location loc = new Location();
            loc.setDistrict(district);
            loc.setLatitude(lat);
            loc.setLongitude(lon);
            return locationRepository.save(loc);
        });

        UserPreference pref = new UserPreference();
        pref.setUser(user);
        pref.setLocation(location);
        pref.setSelectedHazards(hazards);
        pref.setAlertThreshold(threshold);

        return ResponseEntity.ok(preferenceRepository.save(pref));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePreference(@RequestHeader("Authorization") String authHeader, @PathVariable Long id) {
        preferenceRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Preference deleted"));
    }
}