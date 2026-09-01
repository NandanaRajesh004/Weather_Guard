package com.weatherguard.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.weatherguard.backend.model.WeatherData;
import com.weatherguard.backend.repository.WeatherDataRepository;
import com.weatherguard.backend.service.WeatherService;

@RestController
@RequestMapping("/api/weather")
public class WeatherController {

    @Autowired
    private WeatherService weatherService;

    @Autowired
    private WeatherDataRepository weatherDataRepository;

    @GetMapping("/fetch")
    public ResponseEntity<?> fetchWeather(
            @RequestParam String location,
            @RequestParam double lat,
            @RequestParam double lon) {
        try {
            WeatherData data = weatherService.fetchAndSaveWeather(location, lat, lon);
            return ResponseEntity.ok(data);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/history")
    public ResponseEntity<?> getHistory(@RequestParam String location) {
        return ResponseEntity.ok(weatherDataRepository.findByLocationNameOrderByFetchedAtDesc(location));
    }
}