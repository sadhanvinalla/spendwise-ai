package com.spendwise.backend.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Pattern;
import java.math.BigDecimal;

public class BudgetRequest {

    @NotNull
    @Pattern(regexp = "\\d{4}-\\d{2}", message = "Month must be in YYYY-MM format")
    private String month;

    @NotNull @Positive
    private BigDecimal limitAmount;

    public String getMonth() { return month; }
    public void setMonth(String month) { this.month = month; }
    public BigDecimal getLimitAmount() { return limitAmount; }
    public void setLimitAmount(BigDecimal limitAmount) { this.limitAmount = limitAmount; }
}
