package com.weatherguard.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.weatherguard.backend.model.WeatherData;

public interface WeatherDataRepository extends JpaRepository<WeatherData, Long> {
    List<WeatherData> findByLocationNameOrderByFetchedAtDesc(String locationName);
}