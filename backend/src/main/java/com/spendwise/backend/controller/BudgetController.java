package com.spendwise.backend.controller;

import com.spendwise.backend.dto.BudgetRequest;
import com.spendwise.backend.entity.Budget;
import com.spendwise.backend.security.UserPrincipal;
import com.spendwise.backend.service.BudgetService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/budgets")
public class BudgetController {

    private final BudgetService budgetService;

    public BudgetController(BudgetService budgetService) {
        this.budgetService = budgetService;
    }

    @PostMapping
    public ResponseEntity<?> setBudget(@AuthenticationPrincipal UserPrincipal principal,
                                        @Valid @RequestBody BudgetRequest request) {
        Budget budget = budgetService.setBudget(principal.getUserId(), request);
        return ResponseEntity.ok(Map.of(
            "message", "Budget saved",
            "month", budget.getMonth(),
            "limitAmount", budget.getLimitAmount()
        ));
    }

    @GetMapping("/status")
    public ResponseEntity<?> getStatus(@AuthenticationPrincipal UserPrincipal principal,
                                        @RequestParam String month) {
        try {
            return ResponseEntity.ok(budgetService.getStatus(principal.getUserId(), month));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        }
    }
}
