package com.weatherguard.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.weatherguard.backend.model.Location;

public interface LocationRepository extends JpaRepository<Location, Long> {
    Optional<Location> findByDistrict(String district);
}