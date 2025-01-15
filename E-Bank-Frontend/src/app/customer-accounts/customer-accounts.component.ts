import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { Customer } from "../model/customer.model";
import { BehaviorSubject, catchError, Observable, throwError, finalize, tap } from "rxjs";
import { AccountService, AccountDetails, AccountOperation, AccountHistoryDTO, CustomerDTO } from '../services/account.service';

@Component({
  selector: 'app-customer-accounts',
  templateUrl: './customer-accounts.component.html',
  styleUrls: ['./customer-accounts.component.css']
})
export class CustomerAccountsComponent implements OnInit {
  customerId!: string;
  customer?: CustomerDTO;
  accounts$!: Observable<Array<AccountDetails>>;
  accountsList: Array<AccountDetails> = [];
  errorMessage?: string;
  successMessage?: string;
  showOperationsModal = false;
  selectedAccount: AccountDetails | null = null;
  operations: AccountOperation[] = [];
  currentPage = 0;
  pageSize = 5;
  totalPages = 0;
  accountHistory?: AccountHistoryDTO;
  isLoadingOperations = false;
  operationsError: string | null = null;
  isLoadingCustomer = false;
  showTypeModal = false;
  selectedType: 'CURRENT' | 'SAVING' | null = null;
  showDeleteModal = false;
  accountToDelete: AccountDetails | null = null;
  deleteError: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService
  ) { }

  ngOnInit(): void {
    this.customerId = this.route.snapshot.params['id'];
    this.loadCustomerAccounts();
    this.loadCustomerAndAccounts();
  }

  private loadCustomerAccounts() {
    this.accounts$ = this.accountService.getCustomerAccounts(this.customerId).pipe(
      tap(accounts => {
        this.accountsList = accounts;
      })
    );
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
        },
        error: (err) => {
          console.error('Error in customer subscription:', err);
          this.errorMessage = "Failed to load customer information";
        }
      });
  }

  handleOperationAccount(account: AccountDetails) {
    console.log('Opening modal for account:', account);
    this.selectedAccount = account;
    this.showOperationsModal = true;
    this.currentPage = 0;
    this.loadOperations();
  }

  loadOperations() {
    if (!this.selectedAccount) return;

    this.isLoadingOperations = true;
    this.operationsError = null;
    this.operations = [];

    this.accountService.getAccountHistory(
      this.selectedAccount.id,
      this.currentPage,
      this.pageSize
    ).pipe(
      catchError(err => {
        console.error('Error loading operations:', err);
        this.operationsError = "Error loading operations: " + err.message;
        return throwError(() => err);
      })
    ).subscribe({
      next: (historyData) => {
        console.log('Loaded operations:', historyData);
        if (historyData.accountOperationDTOS) {
          this.accountHistory = historyData;
          this.operations = historyData.accountOperationDTOS;
          this.totalPages = historyData.totalPages;
        } else {
          this.operationsError = "Invalid response from server";
        }
        this.isLoadingOperations = false;
      },
      error: (err) => {
        console.error('Error in operations subscription:', err);
        this.operationsError = err.message || "Error loading operations";
        this.isLoadingOperations = false;
      }
    });
  }

  gotoPage(page: number) {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadOperations();
    }
  }

  closeModal() {
    this.showOperationsModal = false;
    this.selectedAccount = null;
    this.operations = [];
    this.currentPage = 0;
  }

  openAccountTypeModal() {
    this.showTypeModal = true;
  }

  closeAccountTypeModal() {
    this.showTypeModal = false;
    this.selectedType = null;
    this.errorMessage = undefined;
    this.successMessage = undefined;
  }

  selectAccountType(type: 'CURRENT' | 'SAVING') {
    this.selectedType = type;
  }

  createAccount() {
    if (!this.selectedType || !this.customerId) return;

    this.accountService.createAccount(this.customerId, this.selectedType)
      .pipe(
        tap(() => {
          // Refresh the accounts list
          this.loadCustomerAccounts();
        }),
        catchError(error => {
          console.error('Error creating account:', error);
          this.errorMessage = error.error?.message || 'Failed to create account. Please try again.';
          this.successMessage = undefined;
          return throwError(() => error);
        })
      )
      .subscribe({
        next: () => {
          this.closeAccountTypeModal();
          this.successMessage = 'Account created successfully!';
          this.errorMessage = undefined;
          setTimeout(() => {
            this.successMessage = undefined;
          }, 5000); // Hide success message after 5 seconds
        },
        error: () => {
          // Error is already handled in catchError
        }
      });
  }

  showDeleteConfirmation(account: AccountDetails) {
    this.accountToDelete = account;
    this.showDeleteModal = true;
    this.deleteError = null;
  }

  cancelDelete() {
    this.showDeleteModal = false;
    this.accountToDelete = null;
    this.deleteError = null;
  }

  confirmDelete() {
    if (this.accountToDelete) {
      console.log('Deleting account:', this.accountToDelete.id);
      this.accountService.deleteAccount(this.accountToDelete.id).pipe(
        catchError(err => {
          this.deleteError = `Failed to delete account: ${err.message}`;
          return throwError(() => err);
        })
      ).subscribe({
        next: () => {
          // Update accounts list locally
          this.accountsList = this.accountsList.filter(a => a.id !== this.accountToDelete?.id);
          this.loadCustomerAccounts();

          // Show success message
          this.successMessage = `Account has been successfully deleted`;
          this.showDeleteModal = false;
          this.accountToDelete = null;
          this.deleteError = null;

          // Hide success message after a delay
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        },
        error: () => {
          // Error is already handled in catchError
        }
      });
    }
  }

  deleteAccount(event: Event, accountId: string) {
    event.stopPropagation(); // Prevent opening operations modal

    if (confirm('Are you sure you want to delete this account? This action cannot be undone.')) {
      this.accountService.deleteAccount(accountId)
        .pipe(
          tap(() => {
            // Refresh the accounts list
            this.loadCustomerAccounts();
          }),
          catchError(error => {
            console.error('Error deleting account:', error);
            this.errorMessage = error.error?.message || 'Failed to delete account. Please try again.';
            this.successMessage = undefined;
            return throwError(() => error);
          })
        )
        .subscribe({
          next: () => {
            this.successMessage = 'Account deleted successfully!';
            this.errorMessage = undefined;
            setTimeout(() => {
              this.successMessage = undefined;
            }, 5000);
          },
          error: () => {
            // Error is already handled in catchError
          }
        });
    }
  }

  private showSuccessNotification(message: string) {
    const notification = document.createElement('div');
    notification.className = 'success-notification';
    notification.innerHTML = `
      <i class="bi bi-check-circle-fill"></i>
      <span>${message}</span>
    `;
    document.body.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
      notification.classList.add('fade-out');
      setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
  }

  getAccountTypeLabel(type: string | undefined): string {
    if (!type) return '';
    return type === 'SavingAccount' ? 'Saving Account' : 'Current Account';
  }

  getOperationIcon(type: string): string {
    return type === 'CREDIT' ? 'bi-arrow-down-circle-fill' : 'bi-arrow-up-circle-fill';
  }

  getOperationClass(type: string): string {
    return type === 'CREDIT' ? 'credit' : 'debit';
  }
}
