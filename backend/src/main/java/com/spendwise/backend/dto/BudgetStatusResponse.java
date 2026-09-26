package com.spendwise.backend.dto;

import java.math.BigDecimal;

public class BudgetStatusResponse {
    private String month;
    private BigDecimal limitAmount;
    private BigDecimal totalExpense;
    private BigDecimal remaining;
    private double usagePercent;
    private String status; // OK, WARNING, EXCEEDED

    public BudgetStatusResponse(String month, BigDecimal limitAmount, BigDecimal totalExpense,
                                 BigDecimal remaining, double usagePercent, String status) {
        this.month = month;
        this.limitAmount = limitAmount;
        this.totalExpense = totalExpense;
        this.remaining = remaining;
        this.usagePercent = usagePercent;
        this.status = status;
    }

    public String getMonth() { return month; }
    public BigDecimal getLimitAmount() { return limitAmount; }
    public BigDecimal getTotalExpense() { return totalExpense; }
    public BigDecimal getRemaining() { return remaining; }
    public double getUsagePercent() { return usagePercent; }
    public String getStatus() { return status; }
}
