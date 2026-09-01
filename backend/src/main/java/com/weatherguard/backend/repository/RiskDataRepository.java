package com.weatherguard.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.weatherguard.backend.model.RiskData;

public interface RiskDataRepository extends JpaRepository<RiskData, Long> {
    List<RiskData> findByLocationNameOrderByCalculatedAtDesc(String locationName);
}