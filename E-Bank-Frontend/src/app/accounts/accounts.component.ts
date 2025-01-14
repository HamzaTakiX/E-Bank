import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {AccountsService} from "../services/accounts.service";
import {BehaviorSubject, catchError, Observable, throwError, EMPTY} from "rxjs";
import {AccountDetails} from "../model/account.model";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {
  accountFormGroup! : FormGroup;
  currentPage: number = 0;
  pageSize: number = 5;
  operationFromGroup! : FormGroup;
  errorMessage! :string ;
  isInitialState: boolean = true;
  isLoading: boolean = false;
  searchTerm: string = '';
  selectedFilter: string = 'all';
  private accountDetailsSubject = new BehaviorSubject<AccountDetails | null>(null);
  accountDetails$ = this.accountDetailsSubject.asObservable();
  accountId: string = '';
  notification: { type: 'success' | 'error', message: string } | null = null;

  constructor(private fb : FormBuilder, private accountService : AccountsService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.accountFormGroup = this.fb.group({
      accountId : this.fb.control(null)
    });
    this.operationFromGroup = this.fb.group({
      operationType : this.fb.control(''),
      amount : this.fb.control(0),
      description : this.fb.control(null)
    });

    // Handle query params for direct account loading
    this.route.queryParams.subscribe(params => {
      if (params['id']) {
        this.accountFormGroup.patchValue({ accountId: params['id'] });
        this.handleSearchAccount();
      }
    });
  }

  private loadAccountData(page: number = 0) {
    if (!this.accountId) return;

    this.isLoading = true;
    this.accountService.getAccount(this.accountId, page, this.pageSize)
      .subscribe({
        next: (data) => {
          this.accountDetailsSubject.next(data);
          this.isInitialState = false;
          this.currentPage = page;
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = err.message;
          this.isInitialState = false;
          this.isLoading = false;
        }
      });
  }

  handleSearchAccount() {
    this.accountId = this.accountFormGroup.value.accountId;
    window.scrollTo(0, 0);
    this.loadAccountData();
  }

  gotoPage(page: number) {
    this.loadAccountData(page);
  }

  handleAccountOperation() {
    let accountId : string = this.accountFormGroup.value.accountId;
    let operationType = this.operationFromGroup.value.operationType;
    let amount : number = this.operationFromGroup.value.amount;
    let description : string = this.operationFromGroup.value.description;

    if(operationType == 'DEBIT') {
      this.accountService.debit(accountId, amount, description).subscribe({
        next : (data)=>{
          this.loadAccountData(this.currentPage);
          this.operationFromGroup.reset();
          this.operationFromGroup.patchValue({ operationType: '' });
          this.showNotification('success', 'Debit operation completed successfully');
        },
        error : (err)=>{
          this.showNotification('error', err.message);
        }
      });
    } else if(operationType == 'CREDIT') {
      this.accountService.credit(accountId, amount, description).subscribe({
        next : (data)=>{
          this.loadAccountData(this.currentPage);
          this.operationFromGroup.reset();
          this.operationFromGroup.patchValue({ operationType: '' });
          this.showNotification('success', 'Credit operation completed successfully');
        },
        error : (err)=>{
          this.showNotification('error', err.message);
        }
      });
    }
  }

  showNotification(type: 'success' | 'error', message: string) {
    this.notification = { type, message };
    setTimeout(() => this.clearNotification(), 5000);
  }

  clearNotification() {
    this.notification = null;
  }

  resetSearch() {
    this.accountFormGroup.reset();
    this.operationFromGroup.reset();
    this.accountDetailsSubject.next(null);
    this.errorMessage = '';
    this.isInitialState = true;
  }

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      // You could add a toast notification here if you want
      console.log('Copied to clipboard');
    });
  }

  filterOperations(filter: string) {
    this.selectedFilter = filter;
    // The actual filtering will be done in the template using a pipe
  }

  clearFilters() {
    this.searchTerm = '';
    this.selectedFilter = 'all';
  }

  get filteredOperations() {
    if (!this.accountDetailsSubject.value?.accountOperationDTOS) return [];

    let operations = this.accountDetailsSubject.value.accountOperationDTOS;

    // Apply search filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      operations = operations.filter(op =>
        op.description?.toLowerCase().includes(term) ||
        op.type?.toLowerCase().includes(term) ||
        op.id?.toString().includes(term) ||
        op.amount?.toString().includes(term)
      );
    }

    // Apply type filter
    if (this.selectedFilter !== 'all') {
      operations = operations.filter(op =>
        op.type?.toLowerCase() === this.selectedFilter
      );
    }

    // Sort by operationDate in descending order
    operations.sort((a, b) => new Date(b.operationDate).getTime() - new Date(a.operationDate).getTime());

    return operations;
  }

  selectOperationType(type: string) {
    this.operationFromGroup.patchValue({ operationType: type });
  }
}
