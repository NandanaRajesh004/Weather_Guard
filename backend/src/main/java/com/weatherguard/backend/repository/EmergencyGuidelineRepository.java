package com.weatherguard.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.weatherguard.backend.model.EmergencyGuideline;

public interface EmergencyGuidelineRepository extends JpaRepository<EmergencyGuideline, Long> {
    List<EmergencyGuideline> findByDisasterTypeAndRiskLevel(String disasterType, String riskLevel);
    List<EmergencyGuideline> findByDisasterType(String disasterType);
}