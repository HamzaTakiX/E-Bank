package com.dev.ebankbackend.repositories;


import com.dev.ebankbackend.entities.AccountOperation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface AccountOperationRepository extends JpaRepository<AccountOperation,Long> {
  List<AccountOperation> findByBankAccountId(String accountId);
  Page<AccountOperation> findByBankAccountIdOrderByOperationDateDesc(String accountId, Pageable pageable);

  @Query("SELECT COUNT(a) " +
          "FROM AccountOperation a " +
          "WHERE MONTH(a.operationDate) = MONTH(CURRENT_DATE) " +
          "AND YEAR(a.operationDate) = YEAR(CURRENT_DATE)")
  Double getTransactionSumForCurrentMonth();

  @Query("SELECT FUNCTION('YEAR', a.operationDate) AS year, FUNCTION('MONTH', a.operationDate) AS month, SUM(a.amount) AS volume " +
          "FROM AccountOperation a " +
          "WHERE FUNCTION('YEAR', a.operationDate) = FUNCTION('YEAR', CURRENT_DATE) " +
          "GROUP BY FUNCTION('YEAR', a.operationDate), FUNCTION('MONTH', a.operationDate) " +
          "ORDER BY month ASC ")
  List<Object[]> getMonthlyTransactionVolume();

}
