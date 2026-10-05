package com.weatherguard.backend.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.weatherguard.backend.model.RiskData;
import com.weatherguard.backend.model.WeatherData;
import com.weatherguard.backend.repository.RiskDataRepository;

@Service
public class RiskAnalysisService {

    @Autowired
    private RiskDataRepository riskDataRepository;

    public String getTrend(String locationName, String disasterType, int currentScore) {
    List<RiskData> recent = riskDataRepository.findTop2ByLocationNameAndDisasterTypeOrderByCalculatedAtDesc(locationName, disasterType);
    if (recent.size() < 2) return "STABLE";
    int previousScore = recent.get(1).getRiskScore() == null ? 0 : recent.get(1).getRiskScore();
    if (currentScore > previousScore + 5) return "INCREASING";
    if (currentScore < previousScore - 5) return "DECREASING";
    return "STABLE";
}

    public RiskData calculateRisk(WeatherData weather, String disasterType) {
        int score = 0;
        List<String> reasons = new ArrayList<>();

        double precip = weather.getPrecipitation() == null ? 0 : weather.getPrecipitation();
        double dailyPrecip = weather.getDailyPrecipitation() == null ? 0 : weather.getDailyPrecipitation();
        double wind = weather.getWindSpeed() == null ? 0 : weather.getWindSpeed();
        double temp = weather.getTemperature() == null ? 0 : weather.getTemperature();
        double humidity = weather.getHumidity() == null ? 0 : weather.getHumidity();

        if (disasterType.equalsIgnoreCase("FLOOD")) {
            if (dailyPrecip > 50) { score += 50; reasons.add("Very heavy forecast rainfall (" + dailyPrecip + "mm today)"); }
            else if (dailyPrecip > 20) { score += 30; reasons.add("Heavy forecast rainfall (" + dailyPrecip + "mm today)"); }
            else if (dailyPrecip > 5) { score += 15; reasons.add("Moderate forecast rainfall (" + dailyPrecip + "mm today)"); }

            if (precip > 5) { score += 30; reasons.add("Active heavy rain right now (" + precip + "mm/hr)"); }

            if (humidity > 90) { score += 10; reasons.add("Very high humidity (" + humidity + "%)"); }

        } else if (disasterType.equalsIgnoreCase("CYCLONE")) {
            if (wind > 90) { score += 60; reasons.add("Destructive wind speed (" + wind + " km/h)"); }
            else if (wind > 60) { score += 40; reasons.add("Very strong winds (" + wind + " km/h)"); }
            else if (wind > 40) { score += 20; reasons.add("Strong winds (" + wind + " km/h)"); }

            if (dailyPrecip > 30) { score += 25; reasons.add("Heavy rain accompanying wind (" + dailyPrecip + "mm today)"); }
            if (precip > 2) { score += 15; reasons.add("Active rain with wind"); }

        } else if (disasterType.equalsIgnoreCase("HEATWAVE")) {
            if (temp > 42) { score += 55; reasons.add("Extreme temperature (" + temp + "C)"); }
            else if (temp > 38) { score += 35; reasons.add("Very high temperature (" + temp + "C)"); }
            else if (temp > 34) { score += 15; reasons.add("Elevated temperature (" + temp + "C)"); }

            if (humidity < 30 && temp > 34) { score += 20; reasons.add("Low humidity intensifying heat stress"); }
            else if (humidity > 70 && temp > 34) { score += 15; reasons.add("High humidity increasing heat index"); }
        }

        if (score > 100) score = 100;

        String riskLevel;
        if (score >= 61) riskLevel = "SEVERE";
        else if (score >= 41) riskLevel = "HIGH";
        else if (score >= 21) riskLevel = "MODERATE";
        else riskLevel = "LOW";

        String explanation = reasons.isEmpty() ? "No significant risk factors detected." : String.join("; ", reasons);

        RiskData riskData = new RiskData();
        riskData.setLocationName(weather.getLocationName());
        riskData.setDisasterType(disasterType.toUpperCase());
        riskData.setRiskLevel(riskLevel);
        riskData.setRiskScore(score);
        riskData.setExplanation(explanation);
        riskData.setTemperature(weather.getTemperature());
        riskData.setWindSpeed(weather.getWindSpeed());
        riskData.setPrecipitation(weather.getPrecipitation());
        riskData.setCalculatedAt(LocalDateTime.now());

        String trend = getTrend(weather.getLocationName(), disasterType, score);
riskData.setExplanation(explanation + " (Trend: " + trend + ")");

        return riskDataRepository.save(riskData);
    }
}