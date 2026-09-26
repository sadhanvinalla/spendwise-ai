package com.spendwise.backend.dto;

import com.spendwise.backend.entity.Transaction;

import java.math.BigDecimal;
import java.time.LocalDate;

public class TransactionResponse {

    private Long id;
    private Transaction.TransactionType type;
    private Transaction.Category category;
    private BigDecimal amount;
    private String description;
    private LocalDate transactionDate;

    public TransactionResponse(Transaction t) {
        this.id = t.getId();
        this.type = t.getType();
        this.category = t.getCategory();
        this.amount = t.getAmount();
        this.description = t.getDescription();
        this.transactionDate = t.getTransactionDate();
    }

    public Long getId() {
        return id;
    }

    public Transaction.TransactionType getType() {
        return type;
    }

    public Transaction.Category getCategory() {
        return category;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public String getDescription() {
        return description;
    }

    public LocalDate getTransactionDate() {
        return transactionDate;
    }
}