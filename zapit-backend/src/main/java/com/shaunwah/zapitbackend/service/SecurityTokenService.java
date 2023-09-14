package com.shaunwah.zapitbackend.service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.shaunwah.zapitbackend.model.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SecurityTokenService {
    @Value("${jwt.key.secret}")
    private String secretKey;
    public String generateToken(Authentication auth) {
        UserPrincipal userPrincipal = (UserPrincipal) auth.getPrincipal();
        Instant now = Instant.now();
        String scope = auth.getAuthorities()
                .stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(","));
        return JWT.create()
                .withIssuer("Zapit")
                .withIssuedAt(now)
                .withSubject(String.valueOf(userPrincipal.getUser().getId()))
                .withExpiresAt(now.plus(24, ChronoUnit.HOURS))
                .withClaim("name", auth.getName())
                .withClaim("scope", scope)
                .sign(Algorithm.HMAC256(secretKey));
    }
}
