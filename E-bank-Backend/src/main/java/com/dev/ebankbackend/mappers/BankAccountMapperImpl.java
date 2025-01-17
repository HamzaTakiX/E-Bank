package com.dev.ebankbackend.mappers;
import com.dev.ebankbackend.dtos.*;
import com.dev.ebankbackend.entities.*;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
@Service
public class BankAccountMapperImpl {
    public CustomerDTO fromCustomer(Customer customer){
        CustomerDTO customerDTO=new CustomerDTO();
        BeanUtils.copyProperties(customer,customerDTO);
        return  customerDTO;
    }
    public NewCustomerDTO fromCustomerV2(Customer customer){
        NewCustomerDTO newCustomerDTO=new NewCustomerDTO();
        BeanUtils.copyProperties(customer,newCustomerDTO);
        return  newCustomerDTO;
    }
    public CustomerLoginDTO fromCustomerV3(Customer customer){
        CustomerLoginDTO CustomerDTO=new CustomerLoginDTO();
        BeanUtils.copyProperties(customer,CustomerDTO);
        return CustomerDTO;
    }
    public Customer fromCustomerDTO(CustomerDTO customerDTO){
        Customer customer=new Customer();
        BeanUtils.copyProperties(customerDTO,customer);
        return  customer;
    }
    public Customer fromNewCustomerDTO(NewCustomerDTO newCustomerDTO){
        Customer customer=new Customer();
        BeanUtils.copyProperties(newCustomerDTO,customer);
        return  customer;
    }

    public SavingBankAccountDTO fromSavingBankAccount(SavingAccount savingAccount){
        SavingBankAccountDTO savingBankAccountDTO=new SavingBankAccountDTO();
        BeanUtils.copyProperties(savingAccount,savingBankAccountDTO);
        savingBankAccountDTO.setCustomerDTO(fromCustomer(savingAccount.getCustomer()));
        savingBankAccountDTO.setType(savingAccount.getClass().getSimpleName());
        return savingBankAccountDTO;
    }

    public SavingAccount fromSavingBankAccountDTO(SavingBankAccountDTO savingBankAccountDTO){
        SavingAccount savingAccount=new SavingAccount();
        BeanUtils.copyProperties(savingBankAccountDTO,savingAccount);
        savingAccount.setCustomer(fromCustomerDTO(savingBankAccountDTO.getCustomerDTO()));
        return savingAccount;
    }

    public CurrentBankAccountDTO fromCurrentBankAccount(CurrentAccount currentAccount){
        CurrentBankAccountDTO currentBankAccountDTO=new CurrentBankAccountDTO();
        BeanUtils.copyProperties(currentAccount,currentBankAccountDTO);
        currentBankAccountDTO.setCustomerDTO(fromCustomer(currentAccount.getCustomer()));
        currentBankAccountDTO.setType(currentAccount.getClass().getSimpleName());
        return currentBankAccountDTO;
    }

    public CurrentAccount fromCurrentBankAccountDTO(CurrentBankAccountDTO currentBankAccountDTO){
        CurrentAccount currentAccount=new CurrentAccount();
        BeanUtils.copyProperties(currentBankAccountDTO,currentAccount);
        currentAccount.setCustomer(fromCustomerDTO(currentBankAccountDTO.getCustomerDTO()));
        return currentAccount;
    }

    public AccountOperationDTO fromAccountOperation(AccountOperation accountOperation){
        AccountOperationDTO accountOperationDTO=new AccountOperationDTO();
        BeanUtils.copyProperties(accountOperation,accountOperationDTO);
        return accountOperationDTO;
    }
    public TransactionDTO fromAccountOperationV2(AccountOperation accountOperation){
        TransactionDTO transactionDTO=new TransactionDTO();
        BeanUtils.copyProperties(accountOperation,transactionDTO);
        transactionDTO.setBank_account_id(accountOperation.getBankAccount().getId());
        transactionDTO.setCustomer(fromCustomer(accountOperation.getBankAccount().getCustomer()));
        return transactionDTO;
    }
}
