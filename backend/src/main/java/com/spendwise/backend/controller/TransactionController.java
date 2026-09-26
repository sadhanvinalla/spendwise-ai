package com.spendwise.backend.controller;

import com.spendwise.backend.dto.TransactionRequest;
import com.spendwise.backend.dto.TransactionResponse;
import com.spendwise.backend.entity.Transaction;
import com.spendwise.backend.security.UserPrincipal;
import com.spendwise.backend.service.TransactionService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @PostMapping
    public ResponseEntity<?> create(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody TransactionRequest request) {

        Transaction t = transactionService.create(
                principal.getUserId(), request);

        return ResponseEntity.ok(new TransactionResponse(t));
    }

    @GetMapping
    public ResponseEntity<?> getAll(
            @AuthenticationPrincipal UserPrincipal principal) {

        List<TransactionResponse> transactions =
                transactionService
                        .getAllForUser(principal.getUserId())
                        .stream()
                        .map(TransactionResponse::new)
                        .collect(Collectors.toList());

        return ResponseEntity.ok(transactions);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id,
            @Valid @RequestBody TransactionRequest request) {

        try {
            Transaction t = transactionService.update(
                    principal.getUserId(), id, request);

            return ResponseEntity.ok(new TransactionResponse(t));

        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .status(404)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id) {

        try {
            transactionService.delete(
                    principal.getUserId(), id);

            return ResponseEntity.ok(
                    Map.of("message", "Deleted successfully"));

        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .status(404)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}