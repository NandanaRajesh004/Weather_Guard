package com.weatherguard.backend.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.weatherguard.backend.model.Alert;
import com.weatherguard.backend.model.EmergencyGuideline;
import com.weatherguard.backend.model.RiskData;
import com.weatherguard.backend.repository.AlertRepository;
import com.weatherguard.backend.repository.EmergencyGuidelineRepository;

@Service
public class AlertService {

    @Autowired
    private AlertRepository alertRepository;

    @Autowired
    private EmergencyGuidelineRepository guidelineRepository;

    public Alert checkAndCreateAlert(RiskData risk) {
        if (risk.getRiskLevel().equalsIgnoreCase("LOW")) {
            return null;
        }

        List<EmergencyGuideline> guidelines = guidelineRepository.findByDisasterTypeAndRiskLevel(
                risk.getDisasterType(), risk.getRiskLevel()
        );

        String message;
        if (!guidelines.isEmpty()) {
            message = guidelines.get(0).getInstructions();
        } else {
            message = risk.getDisasterType() + " risk is " + risk.getRiskLevel() + " in " + risk.getLocationName() + ". Stay alert.";
        }

        Alert alert = new Alert();
        alert.setLocationName(risk.getLocationName());
        alert.setDisasterType(risk.getDisasterType());
        alert.setRiskLevel(risk.getRiskLevel());
        alert.setMessage(message);
        alert.setCreatedAt(LocalDateTime.now());

        return alertRepository.save(alert);
    }
}