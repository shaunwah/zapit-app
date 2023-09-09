package com.shaunwah.zapitbackend.service;

import com.shaunwah.zapitbackend.model.Transaction;
import com.shaunwah.zapitbackend.model.User;
import com.shaunwah.zapitbackend.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TransactionService {
    private final TransactionRepository transactionRepository;

    public List<Transaction> getTransactionsByUserId(Long userId) {
        return transactionRepository.getTransactionsByUserId(userId);
    }

    public Optional<Transaction> getTransactionById(Long transactionId, Long userId) {
        return Optional.ofNullable(transactionRepository.getTransactionById(transactionId, userId));
    }

    public Optional<Transaction> createTransaction(Transaction transaction, Long userId) {
        transaction.setCreatedBy(new User(userId));
        Long transactionId = transactionRepository.createTransaction(transaction);
        if (transactionId != null) {
            transaction.setId(transactionId);
            return Optional.of(transaction);
        }
        return Optional.empty();
    }

    public Boolean updateTransaction(Transaction transaction, Long userId) {
        return transactionRepository.updateTransaction(transaction, userId) > 0;
    }
}
