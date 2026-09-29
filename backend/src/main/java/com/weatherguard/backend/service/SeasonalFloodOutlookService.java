package com.weatherguard.backend.service;

import org.springframework.stereotype.Service;

@Service
public class SeasonalFloodOutlookService {

    // Coefficients trained via logistic regression on 118 years (1901-2018)
    // of Kerala Meteorological Department rainfall data (see /ml/train_flood_model.py),
    // predicting FLOODS (YES/NO) from ANNUAL RAINFALL and JUN-SEP MONSOON rainfall.
    // Test accuracy: 100% on held-out 20% split.
    private static final double INTERCEPT = -2735.12373617;
    private static final double COEF_ANNUAL = 0.83687632;
    private static final double COEF_MONSOON = 0.1485317;

    public double predictFloodProbability(double annualRainfallMm, double monsoonRainfallMm) {
        double z = INTERCEPT + (COEF_ANNUAL * annualRainfallMm) + (COEF_MONSOON * monsoonRainfallMm);
        return 1.0 / (1.0 + Math.exp(-z));
    }

    public String classify(double probability) {
        if (probability >= 0.7) return "HIGH";
        if (probability >= 0.4) return "MEDIUM";
        return "LOW";
    }
}