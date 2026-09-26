package com.spendwise.backend.repository;

import com.spendwise.backend.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByUserIdOrderByTransactionDateDesc(Long userId);
    Optional<Transaction> findByIdAndUserId(Long id, Long userId);

    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t " +
           "WHERE t.userId = :userId AND t.type = 'EXPENSE' " +
           "AND FUNCTION('TO_CHAR', t.transactionDate, 'YYYY-MM') = :month")
    BigDecimal sumExpensesByUserAndMonth(@Param("userId") Long userId, @Param("month") String month);

    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t " +
           "WHERE t.userId = :userId AND t.type = 'INCOME' " +
           "AND FUNCTION('TO_CHAR', t.transactionDate, 'YYYY-MM') = :month")
    BigDecimal sumIncomeByUserAndMonth(@Param("userId") Long userId, @Param("month") String month);
}
