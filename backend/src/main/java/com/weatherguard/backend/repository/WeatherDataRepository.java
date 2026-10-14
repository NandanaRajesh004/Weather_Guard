package com.weatherguard.backend.repository;

import com.weatherguard.backend.model.WeatherData;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface WeatherDataRepository extends JpaRepository<WeatherData, Long> {
    List<WeatherData> findByLocationNameOrderByFetchedAtDesc(String locationName);

    List<WeatherData> findByFetchedAtAfter(LocalDateTime since);
}