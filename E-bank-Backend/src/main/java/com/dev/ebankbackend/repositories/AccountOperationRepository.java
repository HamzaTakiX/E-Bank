package com.dev.ebankbackend.repositories;


import com.dev.ebankbackend.entities.AccountOperation;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AccountOperationRepository extends JpaRepository<AccountOperation,Long> {

}
