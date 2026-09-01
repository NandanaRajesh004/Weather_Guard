package com.weatherguard.backend.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "risk_data")
public class RiskData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String locationName;

    @Column(nullable = false)
    private String disasterType;

    @Column(nullable = false)
    private String riskLevel;

    private Double temperature;
    private Double windSpeed;
    private Double precipitation;

    private LocalDateTime calculatedAt;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getLocationName() { return locationName; }
    public void setLocationName(String locationName) { this.locationName = locationName; }

    public String getDisasterType() { return disasterType; }
    public void setDisasterType(String disasterType) { this.disasterType = disasterType; }

    public String getRiskLevel() { return riskLevel; }
    public void setRiskLevel(String riskLevel) { this.riskLevel = riskLevel; }

    public Double getTemperature() { return temperature; }
    public void setTemperature(Double temperature) { this.temperature = temperature; }

    public Double getWindSpeed() { return windSpeed; }
    public void setWindSpeed(Double windSpeed) { this.windSpeed = windSpeed; }

    public Double getPrecipitation() { return precipitation; }
    public void setPrecipitation(Double precipitation) { this.precipitation = precipitation; }

    public LocalDateTime getCalculatedAt() { return calculatedAt; }
    public void setCalculatedAt(LocalDateTime calculatedAt) { this.calculatedAt = calculatedAt; }
}