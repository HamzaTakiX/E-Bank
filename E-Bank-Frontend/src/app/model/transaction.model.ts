import { Customer } from "./customer.model";

export interface Transaction {
  id: number;
  amount: number;
  operationDate: string;
  bank_account_id: string;
  description: string | null;
  type: 'CREDIT' | 'DEBIT';
  customer : Customer;
}

