package com.spendwise.backend.service;

import com.spendwise.backend.dto.TransactionRequest;
import com.spendwise.backend.entity.Transaction;
import com.spendwise.backend.repository.TransactionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;

    public TransactionService(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    public Transaction create(Long userId, TransactionRequest request) {
        Transaction t = new Transaction();
        t.setUserId(userId);
        t.setType(request.getType());
        t.setCategory(request.getCategory());
        t.setAmount(request.getAmount());
        t.setDescription(request.getDescription());
        t.setTransactionDate(request.getTransactionDate());

        return transactionRepository.save(t);
    }

    public List<Transaction> getAllForUser(Long userId) {
        return transactionRepository.findByUserIdOrderByTransactionDateDesc(userId);
    }

    public Transaction update(Long userId, Long transactionId,
                              TransactionRequest request) {

        Transaction t = transactionRepository
                .findByIdAndUserId(transactionId, userId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Transaction not found"));

        t.setType(request.getType());
        t.setCategory(request.getCategory());
        t.setAmount(request.getAmount());
        t.setDescription(request.getDescription());
        t.setTransactionDate(request.getTransactionDate());

        return transactionRepository.save(t);
    }

    public void delete(Long userId, Long transactionId) {
        Transaction t = transactionRepository
                .findByIdAndUserId(transactionId, userId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Transaction not found"));

        transactionRepository.delete(t);
    }
}