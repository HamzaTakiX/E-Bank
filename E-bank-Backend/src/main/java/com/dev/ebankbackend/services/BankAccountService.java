package com.dev.ebankbackend.services;



import com.dev.ebankbackend.dtos.*;
import com.dev.ebankbackend.exceptions.BalanceNotSufficientException;
import com.dev.ebankbackend.exceptions.BankAccountNotFoundException;
import com.dev.ebankbackend.exceptions.CustomerNotFoundException;

import java.util.List;
import java.util.Map;

public interface BankAccountService {
    NewCustomerDTO saveCustomer(NewCustomerDTO newCustomerDTO);
    CurrentBankAccountDTO saveCurrentBankAccount(double initialBalance, double overDraft, Long customerId) throws CustomerNotFoundException;
    SavingBankAccountDTO saveSavingBankAccount(double initialBalance, double interestRate, Long customerId) throws CustomerNotFoundException;
    List<CustomerDTO> listCustomers();
    List<BankAccountDTO> getLatestBankAccounts() throws BankAccountNotFoundException;
    Double getMonthlyTransactionSum();
    List<Map<String, Object>> getMonthlyTransactionVolume();
    List<Map<String, Object>> BankAccountsByType();
    Double getTotalBalanceSum();
    Long getTotalNumberOfBankAccounts();
    BankAccountDTO getBankAccount(String accountId) throws BankAccountNotFoundException;
    void debit(String accountId, double amount, String description) throws BankAccountNotFoundException, BalanceNotSufficientException;
    void credit(String accountId, double amount, String description) throws BankAccountNotFoundException;
    void transfer(String accountIdSource, String accountIdDestination, double amount) throws BankAccountNotFoundException, BalanceNotSufficientException;
    List<TransactionDTO> getAllAccountsHistory( int page, int size) throws BankAccountNotFoundException;
    List<BankAccountDTO> bankAccountList();

    CustomerDTO getCustomer(Long customerId) throws CustomerNotFoundException;

    CustomerDTO updateCustomer(CustomerDTO customerDTO);

    void deleteCustomer(Long customerId);
    void deleteBankAccount(String bankAccountId);

    List<AccountOperationDTO> accountHistory(String accountId);

    AccountHistoryDTO getAccountHistory(String accountId, int page, int size) throws BankAccountNotFoundException;

    List<CustomerDTO> searchCustomers(String keyword);
}
