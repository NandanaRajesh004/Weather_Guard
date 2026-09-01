package com.weatherguard.backend.service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.weatherguard.backend.model.RiskData;
import com.weatherguard.backend.model.WeatherData;
import com.weatherguard.backend.repository.RiskDataRepository;

@Service
public class RiskAnalysisService {

    @Autowired
    private RiskDataRepository riskDataRepository;

    public RiskData calculateRisk(WeatherData weather, String disasterType) {
        String riskLevel = "LOW";

        if (disasterType.equalsIgnoreCase("FLOOD")) {
            double precip = weather.getPrecipitation() == null ? 0 : weather.getPrecipitation();
            if (precip > 50) riskLevel = "HIGH";
            else if (precip > 15) riskLevel = "MEDIUM";
            else riskLevel = "LOW";

        } else if (disasterType.equalsIgnoreCase("CYCLONE")) {
            double wind = weather.getWindSpeed() == null ? 0 : weather.getWindSpeed();
            if (wind > 90) riskLevel = "HIGH";
            else if (wind > 50) riskLevel = "MEDIUM";
            else riskLevel = "LOW";

        } else if (disasterType.equalsIgnoreCase("HEATWAVE")) {
            double temp = weather.getTemperature() == null ? 0 : weather.getTemperature();
            if (temp > 42) riskLevel = "HIGH";
            else if (temp > 37) riskLevel = "MEDIUM";
            else riskLevel = "LOW";
        }

        RiskData riskData = new RiskData();
        riskData.setLocationName(weather.getLocationName());
        riskData.setDisasterType(disasterType.toUpperCase());
        riskData.setRiskLevel(riskLevel);
        riskData.setTemperature(weather.getTemperature());
        riskData.setWindSpeed(weather.getWindSpeed());
        riskData.setPrecipitation(weather.getPrecipitation());
        riskData.setCalculatedAt(LocalDateTime.now());

        return riskDataRepository.save(riskData);
    }
}
