package com.dev.ebankbackend.services;

import com.dev.ebankbackend.dtos.CustomerLoginDTO;

import java.util.List;

public interface CustomerService {
    Long getTotalNumberOfCustomers();
    CustomerLoginDTO checkCustomer(String email, String password);
    List<CustomerLoginDTO> getAllCustomer();

}
