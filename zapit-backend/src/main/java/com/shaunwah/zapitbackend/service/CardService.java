package com.shaunwah.zapitbackend.service;

import com.shaunwah.zapitbackend.config.ZapitException;
import com.shaunwah.zapitbackend.model.*;
import com.shaunwah.zapitbackend.repository.CardRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Log
public class CardService {
    private final CardRepository cardRepository;
    private final TransactionService transactionService;

    public List<Card> getCardsByUserId(Long userId, Integer limit, Integer offset) {
        return cardRepository.getCardsByUserId(userId, limit, offset);
    }

    public Optional<Card> getCardById(String cardId, Long userId) {
        return Optional.ofNullable(cardRepository.getCardById(cardId, userId));
    }

    public Optional<Card> getCardByMerchantId(Long merchantId, Long userId) {
        return Optional.ofNullable(cardRepository.getCardByMerchantId(merchantId, userId));
    }

    @Transactional(rollbackFor = ZapitException.class)
    public Optional<Card> createCard(Card card, Long userId, LocationData locationData) throws Exception {
        try {
            // temporarily sets card balance to zero to avoid multiple additions
            final Double cardBalance = card.getBalance();
            card.setBalance(0.0);

            // creates a new card
            card.setUser(new User(userId));
            card.setId(UUID.randomUUID().toString());
            if (cardRepository.createCard(card) <= 0) {
                throw new ZapitException("card cannot be created");
            }
            try {
                // adds points to card
                addToCard(card.getId(), cardBalance, card.getUser().getId(), locationData);
            } catch (Exception e) {
                throw new ZapitException(e.getMessage());
            }
            return Optional.of(card);
        } catch (Exception e) {
            log.severe(e.getMessage());
            throw new ZapitException(e.getMessage());
        }
    }

    @Transactional(rollbackFor = ZapitException.class)
    public Optional<Transaction> addToCard(String cardId, Double amount, Long userId, LocationData locationData) throws Exception {
        try {
            if (amount == 0) {
                return Optional.empty();
            }
            if (amount < 0) {
                throw new ZapitException("points is less than zero");
            }
            if (cardRepository.addToCard(cardId, amount, userId) <= 0) {
                throw new ZapitException("points cannot be added to card");
            }
            Transaction transaction = new Transaction();
            transaction.setCard(new Card(cardId));
            transaction.setAmount(amount);
            if (locationData != null) {
                transaction.setLocation(locationData);
            }
            Optional<Transaction> newTransaction = transactionService.createTransaction(transaction);
            if (newTransaction.isEmpty()) {
                throw new ZapitException("transaction cannot be created");
            }
            return newTransaction;
        } catch (Exception e) {
            log.severe(e.getMessage());
            throw new ZapitException(e.getMessage());
        }
    }

    @Transactional(rollbackFor = ZapitException.class)
    public Optional<Transaction> deductFromCard(String cardId, Double amount, Long userId, LocationData locationData) throws Exception {
        try {
            if (amount == 0) {
                return Optional.empty();
            }
            if (amount < 0) {
                throw new ZapitException("points is less than zero");
            }
            if (cardRepository.getCardById(cardId, userId).getBalance() < amount) {
                throw new ZapitException("points cannot be verified");
            }
            if (cardRepository.deductFromCard(cardId, amount, userId) <= 0) {
                throw new ZapitException("points cannot be deduced from card");
            }
            Transaction transaction = new Transaction();
            transaction.setCard(new Card(cardId));
            transaction.setAmount(amount * -1);
            if (locationData != null) {
                transaction.setLocation(locationData);
            }
            Optional<Transaction> newTransaction = transactionService.createTransaction(transaction);
            if (newTransaction.isEmpty()) {
                throw new ZapitException("transaction cannot be created");
            }
            return newTransaction;
        } catch (Exception e) {
            log.severe(e.getMessage());
            throw new ZapitException(e.getMessage());
        }
    }

    public Boolean deleteCard(String cardId, Long userId) {
        return cardRepository.deleteCard(cardId, userId) > 0;
    }
}
