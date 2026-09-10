package com.weatherguard.backend.dto;

public class ProfileUpdateRequest {
    private String name;
    private String preferredLocation;
    private Double preferredLat;
    private Double preferredLon;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getPreferredLocation() { return preferredLocation; }
    public void setPreferredLocation(String preferredLocation) { this.preferredLocation = preferredLocation; }

    public Double getPreferredLat() { return preferredLat; }
    public void setPreferredLat(Double preferredLat) { this.preferredLat = preferredLat; }

    public Double getPreferredLon() { return preferredLon; }
    public void setPreferredLon(Double preferredLon) { this.preferredLon = preferredLon; }
}