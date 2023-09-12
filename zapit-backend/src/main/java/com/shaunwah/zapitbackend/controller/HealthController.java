package com.shaunwah.zapitbackend.controller;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE)
public class HealthController {
    @GetMapping("/healthz")
    public ResponseEntity<String> getHealthz() {
        return ResponseEntity.ok("pong!");
    }
}
