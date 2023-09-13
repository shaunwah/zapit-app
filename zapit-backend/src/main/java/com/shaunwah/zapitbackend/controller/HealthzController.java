package com.shaunwah.zapitbackend.controller;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.java.Log;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE)
@Log
public class HealthzController {
    @GetMapping("/healthz")
    public ResponseEntity<String> getHealthz(HttpServletRequest request) {
        log.info("Ping from %s via /healthz!".formatted(request.getRemoteAddr()));
        return ResponseEntity.ok("pong!");
    }

    @GetMapping("/api/healthz")
    public ResponseEntity<String> getApiHealthz(HttpServletRequest request) {
        log.info("Ping from %s via /api/healthz!".formatted(request.getRemoteAddr()));
        return ResponseEntity.ok("pong!");
    }
}
