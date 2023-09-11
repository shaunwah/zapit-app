package com.shaunwah.zapitbackend.controller;

import com.shaunwah.zapitbackend.model.Transaction;
import com.shaunwah.zapitbackend.service.StripeService;
import com.shaunwah.zapitbackend.service.TransactionService;
import com.shaunwah.zapitbackend.utility.Utilities;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import jakarta.json.Json;
import jakarta.json.JsonObject;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.BufferedImageHttpMessageConverter;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.web.bind.annotation.*;

import java.awt.image.BufferedImage;
import java.util.List;

@RestController
@RequestMapping(path = "/api", produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
public class TransactionController {
    private final TransactionService transactionService;
    private final JwtDecoder jwtDecoder;

    @GetMapping("/transactions")
    public ResponseEntity<List<Transaction>> getTransactionsByUserId(@RequestParam(defaultValue = "5") Integer limit, @RequestParam(defaultValue = "0") Integer offset, HttpServletRequest request) {
        final Long JWT_USER_ID = Utilities.returnUserIdFromJwt(request, jwtDecoder);
        return ResponseEntity.ok(transactionService.getTransactionsByUserId(JWT_USER_ID, limit, offset));
    }

    @GetMapping("/card/{cardId}/transactions")
    public ResponseEntity<List<Transaction>> getTransactionsByCardId(@PathVariable String cardId, @RequestParam(defaultValue = "5") Integer limit, @RequestParam Integer offset, HttpServletRequest request) {
        final Long JWT_USER_ID = Utilities.returnUserIdFromJwt(request, jwtDecoder);
        return ResponseEntity.ok(transactionService.getTransactionsByCardId(cardId, JWT_USER_ID, limit, offset));
    }

    @GetMapping("/transaction/{transactionId}")
    public ResponseEntity<Transaction> getTransactionById(@PathVariable Long transactionId, HttpServletRequest request) {
        final Long JWT_USER_ID = Utilities.returnUserIdFromJwt(request, jwtDecoder);
        return ResponseEntity.of(transactionService.getTransactionById(transactionId, JWT_USER_ID));
    }

    @GetMapping("/transactions/total")
    public ResponseEntity<Double> getTransactionsTotalByUserId(HttpServletRequest request) {
        final Long JWT_USER_ID = Utilities.returnUserIdFromJwt(request, jwtDecoder);
        return ResponseEntity.ofNullable(transactionService.getTransactionsTotalByUserId(JWT_USER_ID));
    }

    @PostMapping("/transactions")
    public ResponseEntity<Transaction> createTransaction(@RequestBody Transaction transaction, HttpServletRequest request) throws Exception {
        final Long JWT_USER_ID = Utilities.returnUserIdFromJwt(request, jwtDecoder);
        return ResponseEntity.of(transactionService.createTransaction(transaction));
    }
}
