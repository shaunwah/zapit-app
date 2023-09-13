package com.shaunwah.zapitbackend.service;

import com.shaunwah.zapitbackend.config.ZapitException;
import com.shaunwah.zapitbackend.model.LocationData;
import com.shaunwah.zapitbackend.model.Transaction;
import com.shaunwah.zapitbackend.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Log
public class TransactionService {
    private final TransactionRepository transactionRepository;
    private final LocationDataService locationDataService;

    public List<Transaction> getTransactionsByUserId(Long userId, Integer limit, Integer offset) {
        return transactionRepository.getTransactionsByUserId(userId, limit, offset);
    }

    public List<Transaction> getTransactionsByCardId(String cardId, Long userId, Integer limit, Integer offset) {
        System.out.println("test");
        return transactionRepository.getTransactionsByCardId(cardId, userId, limit, offset);
    }

    public Optional<Transaction> getTransactionById(Long transactionId, Long userId) {
        return Optional.ofNullable(transactionRepository.getTransactionById(transactionId, userId));
    }

    public Double getTransactionsTotalByUserId(Long userId) {
        Double total = transactionRepository.getTransactionsTotalByUserId(userId);
        if (total == null) {
            return 0.0;
        }
        return total;
    }

    @Transactional(rollbackFor = ZapitException.class)
    public Optional<Transaction> createTransaction(Transaction transaction) throws Exception {
        try {
            Optional<LocationData> locationData = locationDataService.createLocationData(transaction.getLocation());
            LocationData newLocationData = new LocationData();
            if (locationData.isPresent()) {
                newLocationData = locationData.get();
            }
            transaction.setLocation(newLocationData);
            Long transactionId = transactionRepository.createTransaction(transaction);
            if (transactionId == null) {
                throw new ZapitException();
            }
            transaction.setId(transactionId);
            return Optional.of(transaction);
        } catch (Exception e) {
            log.severe(e.getMessage());
            throw new ZapitException();
        }
    }
}
