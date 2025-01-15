import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AccountOperation {
  id: number;
  operationDate: Date;
  amount: number;
  type: string;
  description: string;
}

export interface AccountHistoryDTO {
  accountId: string;
  balance: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  accountOperationDTOS: AccountOperation[];
}

export interface CustomerDTO {
  id: number;
  name: string;
  email: string;
}

export interface AccountDetails {
  id: string;
  balance: number;
  type: string;
  status: string;
  customerDTO: CustomerDTO;
  createdAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private apiUrl = environment.backendHost;

  constructor(private http: HttpClient) { }

  getAccountOperations(accountId: string): Observable<Array<AccountOperation>> {
    return this.http.get<Array<AccountOperation>>(`${this.apiUrl}/accounts/${accountId}/operations`);
  }

  getCustomerAccounts(customerId: string): Observable<Array<AccountDetails>> {
    return this.http.get<Array<AccountDetails>>(`${this.apiUrl}/accounts`)
      .pipe(
        map((accounts: Array<AccountDetails>) =>
          accounts.filter((acc: AccountDetails) => acc.customerDTO?.id === Number(customerId))
        )
      );
  }

  getBankAccount(accountId: string): Observable<AccountDetails> {
    return this.http.get<AccountDetails>(`${this.apiUrl}/accounts/${accountId}`);
  }

  createAccount(customerId: string, type: 'CURRENT' | 'SAVING'): Observable<AccountDetails> {
    const endpoint = type === 'CURRENT' ? 'current' : 'saving';
    const params = new HttpParams()
      .set('customerId', customerId)
      .set('initialBalance', '0')
      .set(type === 'CURRENT' ? 'overDraft' : 'interestRate', '0')
      .set('status', 'Created');

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post<AccountDetails>(`${this.apiUrl}/accounts/${endpoint}`, null, { 
      params,
      headers
    });
  }

  getAccountHistory(accountId: string, page: number = 0, size: number = 5): Observable<AccountHistoryDTO> {
    const url = `${this.apiUrl}/accounts/${accountId}/pageOperations?page=${page}&size=${size}`;
    console.log('Fetching account history from:', url);
    return this.http.get<AccountHistoryDTO>(url).pipe(
      tap(response => {
        console.log('Raw response from server:', response);
      })
    );
  }

  getCustomer(customerId: string): Observable<CustomerDTO> {
    return this.http.get<CustomerDTO>(`${this.apiUrl}/customers/${customerId}`);
  }

  deleteAccount(accountId: string): Observable<void> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<void>(`${this.apiUrl}/accounts/${accountId}`, { headers });
  }
}
