package com.weatherguard.backend.controller;

import com.weatherguard.backend.service.KeralaTrendService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/weather")
public class KeralaTrendController {

    @Autowired
    private KeralaTrendService trendService;

    @GetMapping("/kerala-trend")
    public ResponseEntity<?> keralaTrend(@RequestParam(defaultValue = "7d") String range) {
        return ResponseEntity.ok(trendService.getTrend(range));
    }
}