package com.spendwise.backend.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.YearMonth;

@Entity
@Table(name = "budgets", uniqueConstraints = @UniqueConstraint(columnNames = {"userId", "month"}))
public class Budget {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private String month; // stored as "2026-09" (YearMonth.toString())

    @Column(nullable = false)
    private BigDecimal limitAmount;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Budget() {}

    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getMonth() { return month; }
    public void setMonth(String month) { this.month = month; }
    public void setMonth(YearMonth month) { this.month = month.toString(); }
    public BigDecimal getLimitAmount() { return limitAmount; }
    public void setLimitAmount(BigDecimal limitAmount) { this.limitAmount = limitAmount; }
}
