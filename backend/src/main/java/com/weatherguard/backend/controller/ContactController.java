package com.weatherguard.backend.controller;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.weatherguard.backend.model.ContactMessage;
import com.weatherguard.backend.repository.ContactMessageRepository;

@RestController
@RequestMapping("/api/contact")
public class ContactController {

    @Autowired
    private ContactMessageRepository contactMessageRepository;

    @PostMapping
    public ResponseEntity<?> submitMessage(@RequestBody ContactMessage message) {
        message.setSubmittedAt(LocalDateTime.now());
        return ResponseEntity.ok(contactMessageRepository.save(message));
    }
}