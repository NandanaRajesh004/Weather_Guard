package com.weatherguard.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.weatherguard.backend.model.RiskData;
import com.weatherguard.backend.model.WeatherData;
import com.weatherguard.backend.service.RiskAnalysisService;
import com.weatherguard.backend.service.WeatherService;

@RestController
@RequestMapping("/api/risk")
public class RiskAnalysisController {

    @Autowired
    private WeatherService weatherService;

    @Autowired
    private RiskAnalysisService riskAnalysisService;

    @GetMapping("/analyze")
    public ResponseEntity<?> analyze(
            @RequestParam String location,
            @RequestParam double lat,
            @RequestParam double lon,
            @RequestParam String disasterType) {
        try {
            WeatherData weather = weatherService.fetchAndSaveWeather(location, lat, lon);
            RiskData risk = riskAnalysisService.calculateRisk(weather, disasterType);
            return ResponseEntity.ok(risk);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}