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

    public Double getTransactionsTotalByUserId(Long userId) {
        Double total = transactionRepository.getTransactionsTotalByUserId(userId);
        if (total == null) {
            return 0.0;
        }
        return total;
    }


    public List<Transaction> getTransactionsByCardId(String cardId, Long userId, Integer limit, Integer offset) {
        return transactionRepository.getTransactionsByCardId(cardId, userId, limit, offset);
    }

    public Optional<Transaction> getTransactionById(Long transactionId, Long userId) {
        return Optional.ofNullable(transactionRepository.getTransactionById(transactionId, userId));
    }

    @Transactional(rollbackFor = ZapitException.class)
    public Optional<Transaction> createTransaction(Transaction transaction) throws Exception {
        try {

            // gets location data from transaction
            Optional<LocationData> locationData = Optional.ofNullable(transaction.getLocation());

            // if there is no location data, create a transaction only
            if (locationData.isEmpty()) {
                Long transactionId = transactionRepository.createTransaction(transaction);
                if (transactionId == null) {
                    throw new ZapitException("transaction without location data cannot be created");
                }
                transaction.setId(transactionId);
                return Optional.of(transaction);
            }


            System.out.println("kek");
            // if there is location data, create a record in the location data table
            Optional<LocationData> newLocationData = locationDataService.createLocationData(locationData.get());
            if (newLocationData.isEmpty()) {
                throw new ZapitException("location data cannot be created");
            }

            // get back the stored location data and set it in the transaction
            transaction.setLocation(newLocationData.get());
            Long transactionId = transactionRepository.createTransaction(transaction);
            if (transactionId == null) {
                throw new ZapitException("transaction with location data cannot be created");
            }
            transaction.setId(transactionId);
            return Optional.of(transaction);
        } catch (Exception e) {
            log.severe(e.getMessage());
            throw new ZapitException(e.getMessage());
        }
    }
}
