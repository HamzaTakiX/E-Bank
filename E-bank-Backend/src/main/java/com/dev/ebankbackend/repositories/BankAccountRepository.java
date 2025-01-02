package com.dev.ebankbackend.repositories;


import com.dev.ebankbackend.entities.BankAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface BankAccountRepository extends JpaRepository<BankAccount,String> {
    @Query("SELECT SUM(b.balance) FROM BankAccount b")
    Double getTotalBalanceSum();

    @Query("SELECT COUNT(b) FROM BankAccount b")
    Long getTotalNumberOfBankAccounts();

    @Query("SELECT b FROM BankAccount b ORDER BY b.createdAt DESC LIMIT 5")
    List<BankAccount> findTop5LatestAccounts();

    @Query("SELECT TYPE(b) AS type, COUNT(b) " +
            "FROM BankAccount b " +
            "GROUP BY TYPE(b)")
    List<Object[]> countBankAccountsByType();


}
