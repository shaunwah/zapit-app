package com.shaunwah.zapitbackend.controller;

import com.shaunwah.zapitbackend.model.*;
import com.shaunwah.zapitbackend.service.CardService;
import com.shaunwah.zapitbackend.utility.Utilities;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping(path = "/api", produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
public class CardController {
    private final CardService cardService;
    private final JwtDecoder jwtDecoder;

    @GetMapping("/cards")
    public ResponseEntity<List<Card>> getCardsByUserId(@RequestParam(defaultValue = "5") Integer limit, @RequestParam(defaultValue = "0") Integer offset, HttpServletRequest request) {
        final Long JWT_USER_ID = Utilities.returnUserIdFromJwt(request, jwtDecoder);
        return ResponseEntity.ok(cardService.getCardsByUserId(JWT_USER_ID, limit, offset));
    }

    @GetMapping("/card/{cardId}")
    public ResponseEntity<Card> getCardById(@PathVariable String cardId, HttpServletRequest request) {
        final Long JWT_USER_ID = Utilities.returnUserIdFromJwt(request, jwtDecoder);
        return ResponseEntity.of(cardService.getCardById(cardId, JWT_USER_ID));
    }

    @PostMapping("/cards")
    public ResponseEntity<String> createCard(@RequestBody Card card, HttpServletRequest request) throws Exception {
        final Long JWT_USER_ID = Utilities.returnUserIdFromJwt(request, jwtDecoder);
        Optional<Card> createdCard = cardService.createCard(card, JWT_USER_ID, null);
        if (createdCard.isPresent()) {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Utilities.returnMessageInJson("successfully generated card").toString());
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Utilities.returnMessageInJson("an issue occured while creating a card").toString());
    }

    @PostMapping("/card/{cardId}/add")
    public ResponseEntity<Transaction> addToCard(@PathVariable String cardId, @RequestParam(name = "amt") Double amount, @RequestBody(required = false) LocationData locationData, HttpServletRequest request) throws Exception {
        final Long JWT_USER_ID = Utilities.returnUserIdFromJwt(request, jwtDecoder);
        Optional<Transaction> transaction = cardService.addToCard(cardId, amount, JWT_USER_ID, locationData);
        if (transaction.isPresent()) {
            return ResponseEntity.ok(transaction.get());
        }
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @PostMapping("/card/{cardId}/deduct")
    public ResponseEntity<Transaction> deductFromCard(@PathVariable String cardId, @RequestParam(name = "amt") Double amount, @RequestBody(required = false) LocationData locationData, HttpServletRequest request) throws Exception {
        final Long JWT_USER_ID = Utilities.returnUserIdFromJwt(request, jwtDecoder);
        Optional<Transaction> transaction = cardService.deductFromCard(cardId, amount, JWT_USER_ID, locationData);
        if (transaction.isPresent()) {
            return ResponseEntity.ok(transaction.get());
        }
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @DeleteMapping("/card/{cardId}")
    public ResponseEntity<String> deleteCard(@PathVariable String cardId, HttpServletRequest request) {
        final Long JWT_USER_ID = Utilities.returnUserIdFromJwt(request, jwtDecoder);
        Boolean result = cardService.deleteCard(cardId, JWT_USER_ID);
        if (result) {
            return ResponseEntity.ok(Utilities.returnMessageInJson("success").toString());
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Utilities.returnMessageInJson("an issue occured while deleting a card").toString());
    }
}
