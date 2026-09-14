package com.weatherguard.backend.dto;

public class UserResponse {
    private Long id;
    private String name;
    private String email;
    private String role;
    private String preferredLocation;
    private Double preferredLat;
    private Double preferredLon;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getPreferredLocation() { return preferredLocation; }
    public void setPreferredLocation(String preferredLocation) { this.preferredLocation = preferredLocation; }

    public Double getPreferredLat() { return preferredLat; }
    public void setPreferredLat(Double preferredLat) { this.preferredLat = preferredLat; }

    public Double getPreferredLon() { return preferredLon; }
    public void setPreferredLon(Double preferredLon) { this.preferredLon = preferredLon; }
}