package com.dev.ebankbackend.services;

import com.dev.ebankbackend.repositories.CustomerRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@AllArgsConstructor
@Slf4j
public class CustomerServiceImpl implements CustomerService{
    CustomerRepository customerRepository;
    @Override
    public Long getTotalNumberOfCustomers() {
        return customerRepository.getTotalNumberOfCustomers();
    }
}
