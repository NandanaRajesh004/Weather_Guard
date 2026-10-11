package com.weatherguard.backend.controller;

import com.weatherguard.backend.model.Alert;
import com.weatherguard.backend.model.EmergencyGuideline;
import com.weatherguard.backend.model.RiskData;
import com.weatherguard.backend.model.WeatherData;
import com.weatherguard.backend.repository.EmergencyGuidelineRepository;
import com.weatherguard.backend.service.AlertService;
import com.weatherguard.backend.service.RiskAnalysisService;
import com.weatherguard.backend.service.WeatherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/risk")
public class AssessmentController {

    @Autowired
    private WeatherService weatherService;

    @Autowired
    private RiskAnalysisService riskAnalysisService;

    @Autowired
    private AlertService alertService;

    @Autowired
    private EmergencyGuidelineRepository guidelineRepository;

    @GetMapping("/assess")
    public ResponseEntity<?> assess(
            @RequestParam String location,
            @RequestParam double lat,
            @RequestParam double lon,
            @RequestParam String disasterType) {
        try {
            WeatherData weather = weatherService.fetchAndSaveWeather(location, lat, lon);
            RiskData risk = riskAnalysisService.calculateRisk(weather, disasterType);
            Alert alert = alertService.checkAndCreateAlert(risk);
            List<EmergencyGuideline> guidelines = guidelineRepository
                    .findByDisasterTypeAndRiskLevel(risk.getDisasterType(), risk.getRiskLevel());

            Map<String, Object> result = new LinkedHashMap<>();
            result.put("weather", weather);
            result.put("risk", risk);
            result.put("alert", alert);
            result.put("guidelines", guidelines);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", String.valueOf(e.getMessage())));
        }
    }
}