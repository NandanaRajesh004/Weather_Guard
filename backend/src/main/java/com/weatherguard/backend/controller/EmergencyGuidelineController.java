package com.weatherguard.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.weatherguard.backend.model.EmergencyGuideline;
import com.weatherguard.backend.repository.EmergencyGuidelineRepository;

@RestController
@RequestMapping("/api/guidelines")
public class EmergencyGuidelineController {

    @Autowired
    private EmergencyGuidelineRepository repository;

    @PostMapping
    public ResponseEntity<?> create(@RequestBody EmergencyGuideline guideline) {
        return ResponseEntity.ok(repository.save(guideline));
    }

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

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        repository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}