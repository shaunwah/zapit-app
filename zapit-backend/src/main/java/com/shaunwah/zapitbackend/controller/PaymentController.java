package com.shaunwah.zapitbackend.controller;

import com.shaunwah.zapitbackend.service.StripeService;
import com.stripe.exception.StripeException;
import jakarta.json.Json;
import jakarta.json.JsonObject;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping(path = "/api", produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
public class PaymentController {
    private final StripeService stripeService;

    @GetMapping("/payment/secret")
    public ResponseEntity<String> test() throws StripeException {
        JsonObject obj = Json.createObjectBuilder()
                .add("clientSecret", stripeService.createPaymentIntent(1000L).getClientSecret())
                .build();
        return ResponseEntity.ok(obj.toString());
    }
}
