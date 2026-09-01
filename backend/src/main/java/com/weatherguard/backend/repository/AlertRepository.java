package com.weatherguard.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.weatherguard.backend.model.Alert;

public interface AlertRepository extends JpaRepository<Alert, Long> {
    List<Alert> findAllByOrderByCreatedAtDesc();
}