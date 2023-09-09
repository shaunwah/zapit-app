package com.shaunwah.zapitbackend.controller;

import com.shaunwah.zapitbackend.model.Merchant;
import com.shaunwah.zapitbackend.service.MerchantService;
import com.shaunwah.zapitbackend.utility.Utilities;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path = "/api", produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
public class MerchantController {
    private final MerchantService merchantService;
    private final JwtDecoder jwtDecoder;

    @GetMapping("/merchant/{merchantId}")
    public ResponseEntity<Merchant> getMerchantById(@PathVariable Long merchantId) {
        return ResponseEntity.of(merchantService.getMerchantById(merchantId));
    }

    @GetMapping("/merchant")
    public ResponseEntity<Merchant> getMerchantByUserId(HttpServletRequest request) {
        final Long JWT_USER_ID = Utilities.returnUserIdFromJwt(request, jwtDecoder);
        return ResponseEntity.of(merchantService.getMerchantByUserId(JWT_USER_ID));
    }

    @PostMapping("/merchants")
    public ResponseEntity<Merchant> createMerchant(@RequestBody Merchant merchant, HttpServletRequest request) {
        final Long JWT_USER_ID = Utilities.returnUserIdFromJwt(request, jwtDecoder);
        return ResponseEntity.of(merchantService.createMerchant(merchant, JWT_USER_ID));
    }
}
