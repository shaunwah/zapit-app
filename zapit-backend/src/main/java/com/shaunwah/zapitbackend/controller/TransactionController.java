package com.shaunwah.zapitbackend.controller;

import com.shaunwah.zapitbackend.model.Transaction;
import com.shaunwah.zapitbackend.service.TransactionService;
import com.shaunwah.zapitbackend.utility.Utilities;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<List<Transaction>> getTransactionsByCardId(@PathVariable String cardId, @RequestParam(defaultValue = "5") Integer limit, @RequestParam(defaultValue = "0") Integer offset, HttpServletRequest request) {
        final Long JWT_USER_ID = Utilities.returnUserIdFromJwt(request, jwtDecoder);
        return ResponseEntity.ok(transactionService.getTransactionsByCardId(cardId, JWT_USER_ID, limit, offset));
    }

    @GetMapping("/transactions/total")
    public ResponseEntity<Double> getTransactionsTotalByUserId(HttpServletRequest request) {
        final Long JWT_USER_ID = Utilities.returnUserIdFromJwt(request, jwtDecoder);
        return ResponseEntity.ofNullable(transactionService.getTransactionsTotalByUserId(JWT_USER_ID));
    }

    @GetMapping("/transaction/{transactionId}")
    public ResponseEntity<Transaction> getTransactionById(@PathVariable Long transactionId, HttpServletRequest request) {
        final Long JWT_USER_ID = Utilities.returnUserIdFromJwt(request, jwtDecoder);
        return ResponseEntity.of(transactionService.getTransactionById(transactionId, JWT_USER_ID));
    }
}
