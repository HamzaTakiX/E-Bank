package com.dev.ebankbackend;

import com.dev.ebankbackend.dtos.BankAccountDTO;
import com.dev.ebankbackend.dtos.CurrentBankAccountDTO;
import com.dev.ebankbackend.dtos.CustomerDTO;
import com.dev.ebankbackend.dtos.SavingBankAccountDTO;
import com.dev.ebankbackend.entities.AccountOperation;
import com.dev.ebankbackend.entities.CurrentAccount;
import com.dev.ebankbackend.entities.Customer;
import com.dev.ebankbackend.entities.SavingAccount;
import com.dev.ebankbackend.enums.AccountStatus;
import com.dev.ebankbackend.enums.OperationType;
import com.dev.ebankbackend.exceptions.CustomerNotFoundException;
import com.dev.ebankbackend.repositories.AccountOperationRepository;
import com.dev.ebankbackend.repositories.BankAccountRepository;
import com.dev.ebankbackend.repositories.CustomerRepository;
import com.dev.ebankbackend.services.BankAccountService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.Date;
import java.util.List;
import java.util.Random;
import java.util.UUID;
import java.util.stream.IntStream;
import java.util.stream.Stream;

@SpringBootApplication
public class EBankBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(EBankBackendApplication.class, args);
    }

    private Date generateRandomDate(int startYear, int endYear) {
        Random random = new Random();
        int year = startYear + random.nextInt(endYear - startYear + 1);
        int dayOfYear = 1 + random.nextInt(365); // 1 to 365
        return new Date(year - 1900, 0, 1 + dayOfYear);
    }


   // @Bean
    CommandLineRunner start(CustomerRepository customerRepository,
                            BankAccountRepository bankAccountRepository,
                            AccountOperationRepository accountOperationRepository) {
        return args -> {
            Stream.of("Hamza","Ayman","ismail")
                    .forEach(name -> {
                        Customer customer = new Customer();
                        customer.setName(name);
                        customer.setEmail(name.toLowerCase() + "@example.com");
                        customer.setPassword(name.toLowerCase() + "123");
                        customerRepository.save(customer);
                    });

            customerRepository.findAll().forEach(cust -> {
                CurrentAccount currentAccount = new CurrentAccount();
                currentAccount.setId(UUID.randomUUID().toString());
                currentAccount.setBalance(5000 + Math.random() * 80000);
                currentAccount.setCreatedAt(generateRandomDate(2020, 2025));
                currentAccount.setStatus(AccountStatus.ACTIVATED);
                currentAccount.setCustomer(cust);
                currentAccount.setOverDraft(1000 + Math.random() * 5000);
                bankAccountRepository.save(currentAccount);

                SavingAccount savingAccount = new SavingAccount();
                savingAccount.setId(UUID.randomUUID().toString());
                savingAccount.setBalance(10000 + Math.random() * 100000);
                savingAccount.setCreatedAt(generateRandomDate(2020, 2025));
                savingAccount.setStatus(AccountStatus.ACTIVATED);
                savingAccount.setCustomer(cust);
                savingAccount.setInterestRate(3.0 + Math.random() * 2.0);
                bankAccountRepository.save(savingAccount);
            });

            bankAccountRepository.findAll().forEach(acc -> {
                IntStream.range(0, 10).forEach(i -> {
                    AccountOperation accountOperation = new AccountOperation();
                    accountOperation.setOperationDate(generateRandomDate(2023, 2025));
                    accountOperation.setAmount(100 + Math.random() * 20000);
                    accountOperation.setType(Math.random() > 0.5 ? OperationType.DEBIT : OperationType.CREDIT);
                    accountOperation.setDescription("Description"+i);
                    accountOperation.setBankAccount(acc);
                    accountOperationRepository.save(accountOperation);
                });
            });
        };
    }
}
