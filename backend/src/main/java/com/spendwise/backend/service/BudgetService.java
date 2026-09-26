package com.spendwise.backend.service;

import com.spendwise.backend.dto.BudgetRequest;
import com.spendwise.backend.dto.BudgetStatusResponse;
import com.spendwise.backend.entity.Budget;
import com.spendwise.backend.repository.BudgetRepository;
import com.spendwise.backend.repository.TransactionRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class BudgetService {

    private final BudgetRepository budgetRepository;
    private final TransactionRepository transactionRepository;

    public BudgetService(BudgetRepository budgetRepository, TransactionRepository transactionRepository) {
        this.budgetRepository = budgetRepository;
        this.transactionRepository = transactionRepository;
    }

    public Budget setBudget(Long userId, BudgetRequest request) {
        Budget budget = budgetRepository.findByUserIdAndMonth(userId, request.getMonth())
                .orElse(new Budget());
        budget.setUserId(userId);
        budget.setMonth(request.getMonth());
        budget.setLimitAmount(request.getLimitAmount());
        return budgetRepository.save(budget);
    }

    public BudgetStatusResponse getStatus(Long userId, String month) {
        Budget budget = budgetRepository.findByUserIdAndMonth(userId, month)
                .orElseThrow(() -> new IllegalArgumentException("No budget set for " + month));

        BigDecimal totalExpense = transactionRepository.sumExpensesByUserAndMonth(userId, month);
        BigDecimal remaining = budget.getLimitAmount().subtract(totalExpense);

        double usagePercent = budget.getLimitAmount().compareTo(BigDecimal.ZERO) == 0
                ? 0.0
                : totalExpense.divide(budget.getLimitAmount(), 4, RoundingMode.HALF_UP)
                        .multiply(BigDecimal.valueOf(100)).doubleValue();

        String status;
        if (usagePercent >= 100) {
            status = "EXCEEDED";
        } else if (usagePercent >= 80) {
            status = "WARNING";
        } else {
            status = "OK";
        }

        return new BudgetStatusResponse(month, budget.getLimitAmount(), totalExpense, remaining, usagePercent, status);
    }
}
