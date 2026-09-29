package com.weatherguard.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.weatherguard.backend.model.UserPreference;

public interface UserPreferenceRepository extends JpaRepository<UserPreference, Long> {
    List<UserPreference> findByUserId(Long userId);
}