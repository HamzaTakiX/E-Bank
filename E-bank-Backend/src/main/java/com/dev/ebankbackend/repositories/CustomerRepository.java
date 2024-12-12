package com.dev.ebankbackend.repositories;


import com.dev.ebankbackend.entities.Customer;
import org.springframework.data.jpa.repository.JpaRepository;


public interface CustomerRepository extends JpaRepository<Customer,Long> {

}
