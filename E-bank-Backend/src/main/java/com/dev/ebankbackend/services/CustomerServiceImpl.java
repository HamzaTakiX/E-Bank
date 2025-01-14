package com.dev.ebankbackend.services;

import com.dev.ebankbackend.dtos.CustomerLoginDTO;
import com.dev.ebankbackend.entities.Customer;
import com.dev.ebankbackend.mappers.BankAccountMapperImpl;
import com.dev.ebankbackend.repositories.CustomerRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@AllArgsConstructor
@Slf4j
public class CustomerServiceImpl implements CustomerService{
    CustomerRepository customerRepository;
    private BankAccountMapperImpl dtoMapper;
    @Override
    public Long getTotalNumberOfCustomers() {
        return customerRepository.getTotalNumberOfCustomers();
    }

    @Override
    public CustomerLoginDTO checkCustomer(String email, String password) {
        Customer customer = customerRepository.checkCustomer(email , password);
        if (customer != null){
            return dtoMapper.fromCustomerV3(customer);
        }
        return null;
    }
    @Override       
    public List<CustomerLoginDTO> getAllCustomer() {
        List<Customer> data = customerRepository.findAll();
        List<CustomerLoginDTO> customers = data.stream()
                .map(elm -> dtoMapper.fromCustomerV3(elm))
                .collect(Collectors.toList());
        return customers;
    }


}
