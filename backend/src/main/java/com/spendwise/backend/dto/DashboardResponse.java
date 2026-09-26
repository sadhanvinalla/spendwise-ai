package com.spendwise.backend.dto;

import java.math.BigDecimal;
import java.util.List;

public class DashboardResponse {
    private String month;
    private BigDecimal totalIncome;
    private BigDecimal totalExpense;
    private BigDecimal balance;
    private BigDecimal budgetLimit;       // null if no budget set for this month
    private BigDecimal budgetRemaining;   // null if no budget set for this month
    private String budgetStatus;          // "OK" / "WARNING" / "EXCEEDED" / "NOT_SET"
    private List<TransactionResponse> recentTransactions;

    public DashboardResponse(String month, BigDecimal totalIncome, BigDecimal totalExpense, BigDecimal balance,
                              BigDecimal budgetLimit, BigDecimal budgetRemaining, String budgetStatus,
                              List<TransactionResponse> recentTransactions) {
        this.month = month;
        this.totalIncome = totalIncome;
        this.totalExpense = totalExpense;
        this.balance = balance;
        this.budgetLimit = budgetLimit;
        this.budgetRemaining = budgetRemaining;
        this.budgetStatus = budgetStatus;
        this.recentTransactions = recentTransactions;
    }

    public String getMonth() { return month; }
    public BigDecimal getTotalIncome() { return totalIncome; }
    public BigDecimal getTotalExpense() { return totalExpense; }
    public BigDecimal getBalance() { return balance; }
    public BigDecimal getBudgetLimit() { return budgetLimit; }
    public BigDecimal getBudgetRemaining() { return budgetRemaining; }
    public String getBudgetStatus() { return budgetStatus; }
    public List<TransactionResponse> getRecentTransactions() { return recentTransactions; }
}
