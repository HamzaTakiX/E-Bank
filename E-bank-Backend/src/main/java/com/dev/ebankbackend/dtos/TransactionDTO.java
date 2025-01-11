package com.dev.ebankbackend.dtos;

import com.dev.ebankbackend.entities.BankAccount;
import com.dev.ebankbackend.enums.OperationType;
import lombok.Data;

import java.util.Date;
@Data
public class TransactionDTO {
    private Long id;
    private Date operationDate;
    private double amount;
    private OperationType type;
    private String description;
    private String bank_account_id;
    private CustomerDTO customer;
}


