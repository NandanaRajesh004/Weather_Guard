package com.weatherguard.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "user_preferences")
public class UserPreference {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "location_id", nullable = false)
    private Location location;

    @Column(nullable = false)
    private String selectedHazards; // comma-separated: FLOOD,CYCLONE,HEATWAVE

    @Column(nullable = false)
    private String alertThreshold; // LOW, MODERATE, HIGH, SEVERE

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Location getLocation() { return location; }
    public void setLocation(Location location) { this.location = location; }

    public String getSelectedHazards() { return selectedHazards; }
    public void setSelectedHazards(String selectedHazards) { this.selectedHazards = selectedHazards; }

    public String getAlertThreshold() { return alertThreshold; }
    public void setAlertThreshold(String alertThreshold) { this.alertThreshold = alertThreshold; }
}