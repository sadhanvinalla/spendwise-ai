package com.spendwise.backend.service;

import com.spendwise.backend.dto.TransactionRequest;
import com.spendwise.backend.entity.Transaction;
import com.spendwise.backend.repository.TransactionRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TransactionServiceTest {

    @Mock
    private TransactionRepository repository;

    @InjectMocks
    private TransactionService service;

    @Test
    void createAssignsUserAndRequestFields() {
        TransactionRequest request = new TransactionRequest();
        request.setType(Transaction.TransactionType.EXPENSE);
        request.setCategory(Transaction.Category.FOOD);
        request.setAmount(new BigDecimal("250.00"));
        request.setDescription("Lunch");
        request.setTransactionDate(LocalDate.of(2026, 9, 26));

        Transaction saved = new Transaction();
        saved.setUserId(7L);
        saved.setType(request.getType());
        saved.setCategory(request.getCategory());
        saved.setAmount(request.getAmount());
        saved.setDescription(request.getDescription());
        saved.setTransactionDate(request.getTransactionDate());

        when(repository.save(any(Transaction.class))).thenReturn(saved);

        Transaction result = service.create(7L, request);

        assertEquals(7L, result.getUserId());
        assertEquals(Transaction.TransactionType.EXPENSE, result.getType());
        assertEquals(Transaction.Category.FOOD, result.getCategory());
        assertEquals(new BigDecimal("250.00"), result.getAmount());
        verify(repository).save(any(Transaction.class));
    }

    @Test
    void updateRejectsTransactionOwnedByAnotherUser() {
        when(repository.findByIdAndUserId(1L, 7L)).thenReturn(Optional.empty());

        TransactionRequest request = new TransactionRequest();

        assertThrows(IllegalArgumentException.class,
                () -> service.update(7L, 1L, request));

        verify(repository, never()).save(any());
    }
}
