package com.weatherguard.backend.controller;

import com.weatherguard.backend.model.EmergencyGuideline;
import com.weatherguard.backend.repository.EmergencyGuidelineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/guidelines")
public class EmergencyGuidelineController {

    @Autowired
    private EmergencyGuidelineRepository repository;

    @GetMapping
    public ResponseEntity<List<EmergencyGuideline>> getAll() {
        return ResponseEntity.ok(repository.findAll());
    }

    @GetMapping("/type/{disasterType}")
    public ResponseEntity<List<EmergencyGuideline>> getByType(@PathVariable String disasterType) {
        return ResponseEntity.ok(repository.findByDisasterType(disasterType));
    }

    @GetMapping("/type/{disasterType}/risk/{riskLevel}")
    public ResponseEntity<List<EmergencyGuideline>> getByTypeAndRisk(
            @PathVariable String disasterType, @PathVariable String riskLevel) {
        return ResponseEntity.ok(repository.findByDisasterTypeAndRiskLevel(disasterType, riskLevel));
    }
}