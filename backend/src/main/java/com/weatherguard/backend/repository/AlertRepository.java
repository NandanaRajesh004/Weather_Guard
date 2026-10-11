package com.weatherguard.backend.repository;

import com.weatherguard.backend.model.Alert;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface AlertRepository extends JpaRepository<Alert, Long> {
    List<Alert> findAllByOrderByCreatedAtDesc();

    Optional<Alert> findFirstByLocationNameAndDisasterTypeAndRiskLevelAndCreatedAtAfterOrderByCreatedAtDesc(
            String locationName, String disasterType, String riskLevel, LocalDateTime since);
}