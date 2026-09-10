package com.weatherguard.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String role = "USER";

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    private String preferredLocation;
private Double preferredLat;
private Double preferredLon;

public String getPreferredLocation() { return preferredLocation; }
public void setPreferredLocation(String preferredLocation) { this.preferredLocation = preferredLocation; }

public Double getPreferredLat() { return preferredLat; }
public void setPreferredLat(Double preferredLat) { this.preferredLat = preferredLat; }

public Double getPreferredLon() { return preferredLon; }
public void setPreferredLon(Double preferredLon) { this.preferredLon = preferredLon; }
}