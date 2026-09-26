package com.spendwise.backend.dto;

import com.spendwise.backend.entity.Transaction;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.LocalDate;

public class TransactionRequest {

    @NotNull
    private Transaction.TransactionType type;

    @NotNull
    private Transaction.Category category;

    @NotNull
    @Positive
    private BigDecimal amount;

    private String description;

    @NotNull
    private LocalDate transactionDate;

    public Transaction.TransactionType getType() {
        return type;
    }

    public void setType(Transaction.TransactionType type) {
        this.type = type;
    }

    public Transaction.Category getCategory() {
        return category;
    }

    public void setCategory(Transaction.Category category) {
        this.category = category;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getTransactionDate() {
        return transactionDate;
    }

    public void setTransactionDate(LocalDate transactionDate) {
        this.transactionDate = transactionDate;
    }
}