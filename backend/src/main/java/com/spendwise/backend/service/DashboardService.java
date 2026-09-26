package com.spendwise.backend.service;

import com.spendwise.backend.dto.BudgetStatusResponse;
import com.spendwise.backend.dto.DashboardResponse;
import com.spendwise.backend.dto.TransactionResponse;
import com.spendwise.backend.repository.TransactionRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private static final int RECENT_TRANSACTIONS_LIMIT = 5;

    private final TransactionRepository transactionRepository;
    private final BudgetService budgetService;

    public DashboardService(TransactionRepository transactionRepository, BudgetService budgetService) {
        this.transactionRepository = transactionRepository;
        this.budgetService = budgetService;
    }

    public DashboardResponse getDashboard(Long userId, String month) {
        BigDecimal totalIncome = transactionRepository.sumIncomeByUserAndMonth(userId, month);
        BigDecimal totalExpense = transactionRepository.sumExpensesByUserAndMonth(userId, month);
        BigDecimal balance = totalIncome.subtract(totalExpense);

        BigDecimal budgetLimit = null;
        BigDecimal budgetRemaining = null;
        String budgetStatus = "NOT_SET";

        try {
            BudgetStatusResponse budget = budgetService.getStatus(userId, month);
            budgetLimit = budget.getLimitAmount();
            budgetRemaining = budget.getRemaining();
            budgetStatus = budget.getStatus();
        } catch (IllegalArgumentException e) {
            // No budget set for this month — leave defaults (null / "NOT_SET")
        }

        List<TransactionResponse> recent = transactionRepository.findByUserIdOrderByTransactionDateDesc(userId)
                .stream()
                .limit(RECENT_TRANSACTIONS_LIMIT)
                .map(TransactionResponse::new)
                .collect(Collectors.toList());

        return new DashboardResponse(month, totalIncome, totalExpense, balance,
                budgetLimit, budgetRemaining, budgetStatus, recent);
    }
}
