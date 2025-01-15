package com.dev.ebankbackend.repositories;


import com.dev.ebankbackend.entities.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CustomerRepository extends JpaRepository<Customer,Long> {
    @Query("select c from Customer c where c.name like :kw")
    List<Customer> searchCustomer(@Param("kw") String keyword);

    @Query("SELECT COUNT(c) FROM Customer c")
    Long getTotalNumberOfCustomers();

    @Query("select c from Customer c where c.email = :email and c.password = :password  ")
    Customer checkCustomer(@Param("email") String email, @Param("password") String password);

    Optional<Customer> findByEmail(String email);

}
