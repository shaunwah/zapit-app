package com.shaunwah.zapitbackend.service;

import com.shaunwah.zapitbackend.model.*;
import com.shaunwah.zapitbackend.repository.CardRepository;
import com.shaunwah.zapitbackend.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Log
public class CardService {
    private final CardRepository cardRepository;
    private final TransactionService transactionService;

    public List<Card> getCardsByUserId(Long userId, Integer limit) {
        return cardRepository.getCardsByUserId(userId, limit);
    }

    public Optional<Card> getCardById(String cardId, Long userId) {
        return Optional.ofNullable(cardRepository.getCardById(cardId, userId));
    }

    public Optional<Card> getCardByMerchantId(Long merchantId, Long userId) {
        return Optional.ofNullable(cardRepository.getCardByMerchantId(merchantId, userId));
    }

    @Transactional(rollbackFor = Exception.class)
    public Optional<Card> createCard(Card card, Long userId) throws Exception {
        try {
            card.setUser(new User(userId));
            card.setId(UUID.randomUUID().toString());
            if (cardRepository.createCard(card) <= 0) {
                throw new Exception();
            }
            try {
                addToCard(card.getId(), card.getBalance(), card.getUser().getId(), null);
            } catch (Exception e) {
                throw new Exception();
            }
            return Optional.of(card);
        } catch (Exception e) {
            log.severe("a " + e.getMessage());
            throw new Exception();
        }
    }

    @Transactional(rollbackFor = Exception.class)
    public Optional<Transaction> addToCard(String cardId, Double amount, Long userId, LocationData locationData) throws Exception {
        try {
            if (amount == 0) {
                return Optional.empty();
            }
            if (amount < 0) {
                throw new Exception();
            }
            if (cardRepository.addToCard(cardId, amount, userId) <= 0) {
                throw new Exception();
            }
            Transaction transaction = new Transaction();
            transaction.setCard(new Card(cardId));
            transaction.setAmount(amount);
            transaction.setLocation(locationData);
            Optional<Transaction> newTransaction = transactionService.createTransaction(transaction);
            if (newTransaction.isEmpty()) {
                throw new Exception();
            }
            return newTransaction;
        } catch (Exception e) {
            log.severe("b " + e.getMessage());
            throw new Exception();
        }
    }

    @Transactional(rollbackFor = Exception.class)
    public Optional<Transaction> deductFromCard(String cardId, Double amount, Long userId, LocationData locationData) throws Exception {
        try {
            if (amount == 0) {
                return Optional.empty();
            }
            if (amount < 0) {
                throw new Exception();
            }
            if (cardRepository.deductFromCard(cardId, amount, userId) <= 0) {
                throw new Exception();
            }
            Transaction transaction = new Transaction();
            transaction.setCard(new Card(cardId));
            transaction.setAmount(amount * -1);
            transaction.setLocation(locationData);
            Optional<Transaction> newTransaction = transactionService.createTransaction(transaction);
            if (newTransaction.isEmpty()) {
                throw new Exception();
            }
            return newTransaction;
        } catch (Exception e) {
            log.severe("c " + e.getMessage());
            throw new Exception();
        }
    }

    public Boolean deleteCard(String cardId, Long userId) {
        return cardRepository.deleteCard(cardId, userId) > 0;
    }
}
