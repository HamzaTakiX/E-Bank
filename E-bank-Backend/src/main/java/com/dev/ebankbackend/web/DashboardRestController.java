package com.dev.ebankbackend.web;

import com.dev.ebankbackend.dtos.BankAccountDTO;
import com.dev.ebankbackend.exceptions.BankAccountNotFoundException;
import com.dev.ebankbackend.services.BankAccountService;
import com.dev.ebankbackend.services.BankAccountServiceImpl;
import com.dev.ebankbackend.services.CustomerService;
import com.dev.ebankbackend.services.CustomerServiceImpl;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin("*")
public class DashboardRestController {

    @Autowired
    private BankAccountService bankAccountService;

    @Autowired
    private CustomerService customerService;

    @GetMapping("/dashboard/dataV1")
    public Map<String, Object> getDashboardDataV1() throws BankAccountNotFoundException {
        Map<String, Object> dashboardData = new HashMap<>();

        List<BankAccountDTO> latestBankAccounts = bankAccountService.getLatestBankAccounts();
        dashboardData.put("latestBankAccounts", latestBankAccounts);

        Double monthlyTransactionSum = bankAccountService.getMonthlyTransactionSum();
        dashboardData.put("monthlyTransactionSum", monthlyTransactionSum);

        Double totalBalanceSum = bankAccountService.getTotalBalanceSum();
        dashboardData.put("totalBalanceSum", totalBalanceSum);

        Long totalNumberOfBankAccounts = bankAccountService.getTotalNumberOfBankAccounts();
        dashboardData.put("totalNumberOfBankAccounts", totalNumberOfBankAccounts);

        Long totalNumberOfCustomers = customerService.getTotalNumberOfCustomers();
        dashboardData.put("totalNumberOfCustomers", totalNumberOfCustomers);

        return dashboardData;
    }

    @GetMapping("/dashboard/dataV2")
    public Map<String, Object> getDashboardDataV2() throws BankAccountNotFoundException {
        Map<String, Object> dashboardData = new HashMap<>();

        List<Map<String, Object>> dailyTransactionVolume = bankAccountService.getMonthlyTransactionVolume();
        List<Map<String, Object>> BankAccountsByType = bankAccountService.BankAccountsByType();
        dashboardData.put("dailyTransactionVolume", dailyTransactionVolume);
        dashboardData.put("bankAccountsByType", BankAccountsByType);


        return dashboardData;
    }
}

