package com.weatherguard.backend.service;

import org.springframework.stereotype.Service;

@Service
public class SeasonalFloodOutlookService {

    // Output of ml/train_flood_model.py: logistic regression fitted on all 118 years of a
    // public Kerala yearly rainfall dataset (1901-2018) labelled flood / no-flood.
    // Features: annual rainfall (mm) and June-September monsoon rainfall (mm).
    // 5-fold cross-validated accuracy: 95.8% (always guessing the majority class: 50.8%).
    // The dataset's labels follow an annual-rainfall cut-off near 2925 mm, so the output
    // switches sharply from about 0 to about 1 around that value. It classifies a
    // completed season; it is not a forecast.
    private static final double INTERCEPT = -2735.1217397279065;
    private static final double COEF_ANNUAL = 0.8368757282484346;
    private static final double COEF_MONSOON = 0.14853156918738258;

    public double predictFloodProbability(double annualRainfallMm, double monsoonRainfallMm) {
        double z = INTERCEPT + (COEF_ANNUAL * annualRainfallMm) + (COEF_MONSOON * monsoonRainfallMm);
        return 1.0 / (1.0 + Math.exp(-z));
    }

    public String classify(double probability) {
        return probability >= 0.5 ? "LIKELY" : "UNLIKELY";
    }
}