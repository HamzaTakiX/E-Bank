import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { Customer } from "../model/customer.model";
import { catchError, Observable, throwError, finalize } from "rxjs";
import { AccountService, AccountDetails, AccountOperation, AccountHistoryDTO, CustomerDTO } from '../services/account.service';

@Component({
  selector: 'app-customer-accounts',
  templateUrl: './customer-accounts.component.html',
  styleUrls: ['./customer-accounts.component.css']
})
export class CustomerAccountsComponent implements OnInit {
  customerId! : string;
  customer?: CustomerDTO;
  accounts$!: Observable<Array<AccountDetails>>;
  errorMessage?: string;
  showOperationsModal = false;
  selectedAccount: AccountDetails | null = null;
  operations: AccountOperation[] = [];
  isLoadingOperations = false;
  operationsError: string | null = null;
  currentPage = 0;
  pageSize = 5;
  totalPages = 0;
  isLoadingCustomer = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.customerId = this.route.snapshot.params['id'];
    this.loadCustomerAndAccounts();
  }

  loadCustomerAndAccounts() {
    this.isLoadingCustomer = true;
    this.accountService.getCustomer(this.customerId)
      .pipe(
        catchError(err => {
          console.error('Error loading customer:', err);
          this.errorMessage = "Error loading customer: " + err.message;
          return throwError(() => err);
        }),
        finalize(() => this.isLoadingCustomer = false)
      )
      .subscribe({
        next: (customer) => {
          console.log('Loaded customer:', customer);
          this.customer = customer;
          this.loadAccounts();
        },
        error: (err) => {
          console.error('Error in customer subscription:', err);
          this.errorMessage = "Failed to load customer information";
        }
      });
  }

  loadAccounts() {
    this.accounts$ = this.accountService.getCustomerAccounts(this.customerId)
      .pipe(
        catchError(err => {
          console.error('Error loading accounts:', err);
          this.errorMessage = "Error loading accounts: " + err.message;
          return throwError(() => err);
        })
      );
  }

  handleOperationAccount(account: AccountDetails) {
    console.log('Opening modal for account:', account);
    this.selectedAccount = account;
    this.showOperationsModal = true;
    this.loadOperations(account.id);
  }

  loadOperations(accountId: string) {
    console.log('Loading operations for account:', accountId);
    this.isLoadingOperations = true;
    this.operationsError = null;
    this.operations = [];
    
    this.accountService.getAccountHistory(accountId, this.currentPage, this.pageSize)
      .pipe(
        catchError(err => {
          console.error('Error loading operations:', err);
          this.operationsError = "Error loading operations: " + err.message;
          return throwError(() => err);
        })
      )
      .subscribe({
        next: (history: AccountHistoryDTO) => {
          console.log('Received history:', history);
          if (history && history.accountOperationDTOS) {
            this.operations = history.accountOperationDTOS;
            this.totalPages = history.totalPages;
            this.currentPage = history.currentPage;
          } else {
            console.error('Invalid history response:', history);
            this.operationsError = "Invalid response from server";
          }
          this.isLoadingOperations = false;
        },
        error: (err) => {
          console.error('Error in subscription:', err);
          this.isLoadingOperations = false;
          this.operationsError = err.message || "Error loading operations";
        }
      });
  }

  closeModal() {
    this.showOperationsModal = false;
    this.selectedAccount = null;
    this.operations = [];
    this.currentPage = 0;
  }

  getAccountTypeLabel(type: string): string {
    switch (type) {
      case 'SavingAccount':
        return 'Savings';
      case 'CurrentAccount':
        return 'Current';
      default:
        return type;
    }
  }

  getOperationIcon(type: string): string {
    return type === 'CREDIT' ? 'bi-arrow-down-circle-fill' : 'bi-arrow-up-circle-fill';
  }

  getOperationClass(type: string): string {
    return type === 'CREDIT' ? 'credit' : 'debit';
  }
}
