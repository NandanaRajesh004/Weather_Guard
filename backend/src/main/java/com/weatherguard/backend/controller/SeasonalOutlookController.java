package com.weatherguard.backend.controller;

import com.weatherguard.backend.service.SeasonalFloodOutlookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ml")
public class SeasonalOutlookController {

    @Autowired
    private SeasonalFloodOutlookService outlookService;

    @GetMapping("/flood-outlook")
    public ResponseEntity<?> getFloodOutlook(
            @RequestParam double annualRainfall,
            @RequestParam double monsoonRainfall) {
        double output = outlookService.predictFloodProbability(annualRainfall, monsoonRainfall);

        return ResponseEntity.ok(Map.of(
                "annualRainfall", annualRainfall,
                "monsoonRainfall", monsoonRainfall,
                "modelOutput", Math.round(output * 10000.0) / 10000.0,
                "floodYearOutlook", outlookService.classify(output),
                "modelInfo", "Logistic regression on 118 years (1901-2018) of Kerala annual and monsoon rainfall; 95.8% cross-validated accuracy for classifying a year as flood or no-flood.",
                "note", "The dataset's flood labels follow an annual rainfall cut-off near 2925 mm, so the output switches sharply around that value. It classifies a completed season and is not a forecast."
        ));
    }
}