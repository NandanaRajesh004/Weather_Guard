package com.weatherguard.backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.weatherguard.backend.model.Alert;
import com.weatherguard.backend.model.RiskData;
import com.weatherguard.backend.model.WeatherData;
import com.weatherguard.backend.repository.AlertRepository;
import com.weatherguard.backend.service.AlertService;
import com.weatherguard.backend.service.RiskAnalysisService;
import com.weatherguard.backend.service.WeatherService;

@RestController
@RequestMapping("/api/alerts")
public class AlertController {

    @Autowired
    private WeatherService weatherService;

    @Autowired
    private RiskAnalysisService riskAnalysisService;

    @Autowired
    private AlertService alertService;

    @Autowired
    private AlertRepository alertRepository;

    @GetMapping("/check")
    public ResponseEntity<?> checkAlert(
            @RequestParam String location,
            @RequestParam double lat,
            @RequestParam double lon,
            @RequestParam String disasterType) {
        try {
            WeatherData weather = weatherService.fetchAndSaveWeather(location, lat, lon);
            RiskData risk = riskAnalysisService.calculateRisk(weather, disasterType);
            Alert alert = alertService.checkAndCreateAlert(risk);

            if (alert == null) {
                return ResponseEntity.ok(Map.of("message", "No alert. Risk level is LOW.", "riskLevel", risk.getRiskLevel()));
            }
            return ResponseEntity.ok(alert);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Alert>> getAllAlerts() {
        return ResponseEntity.ok(alertRepository.findAllByOrderByCreatedAtDesc());
    }
    @PostMapping("/simulate")
public ResponseEntity<?> simulateAlert(
        @RequestParam String location,
        @RequestParam String disasterType,
        @RequestParam String riskLevel) {
    try {
        com.weatherguard.backend.model.RiskData fakeRisk = new com.weatherguard.backend.model.RiskData();
        fakeRisk.setLocationName(location);
        fakeRisk.setDisasterType(disasterType.toUpperCase());
        fakeRisk.setRiskLevel(riskLevel.toUpperCase());

        Alert alert = alertService.checkAndCreateAlert(fakeRisk);

        if (alert == null) {
            return ResponseEntity.ok(Map.of("message", "No alert. Risk level is LOW."));
        }
        return ResponseEntity.ok(alert);
    } catch (Exception e) {
        return ResponseEntity.badRequest().body("Error: " + e.getMessage());
    }
}
    
}