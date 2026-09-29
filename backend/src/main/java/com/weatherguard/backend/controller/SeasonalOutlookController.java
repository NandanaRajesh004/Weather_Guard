package com.weatherguard.backend.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.weatherguard.backend.service.SeasonalFloodOutlookService;

@RestController
@RequestMapping("/api/ml")
public class SeasonalOutlookController {

    @Autowired
    private SeasonalFloodOutlookService outlookService;

    @GetMapping("/flood-outlook")
    public ResponseEntity<?> getFloodOutlook(
            @RequestParam double annualRainfall,
            @RequestParam double monsoonRainfall) {
        double probability = outlookService.predictFloodProbability(annualRainfall, monsoonRainfall);
        String level = outlookService.classify(probability);

        return ResponseEntity.ok(Map.of(
                "annualRainfall", annualRainfall,
                "monsoonRainfall", monsoonRainfall,
                "floodProbability", Math.round(probability * 10000.0) / 10000.0,
                "outlookLevel", level,
                "modelInfo", "Logistic regression trained on 118 years (1901-2018) of Kerala rainfall data"
        ));
    }
}