import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { Transaction } from '../model/transaction.model';
import { AccountsService } from '../services/accounts.service';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';


@Component({
  selector: 'app-transactions-history',
  templateUrl: './transactions-history.component.html',
  styleUrls: ['./transactions-history.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class TransactionsHistoryComponent implements OnInit {
  transactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];
  searchTerm: string = '';
  selectedType: string = '';
  fromDate: string | null = null; // ISO string format (yyyy-MM-dd)
  toDate: string | null = null;
  currentPage: number = 1;
  pageSize: number = 10;
  totalTransactions: number = 0;

  constructor(private accountsService: AccountsService) { }

  ngOnInit() {
    console.log('TransactionsHistoryComponent initialized');
    this.loadTransactions();
  }

  loadTransactions() {
    this.accountsService.getAllAccountsHistory(this.currentPage, this.pageSize).subscribe(data => {
      this.transactions = data;
      this.totalTransactions = data.length;
      this.filterTransactions();
    });
  }
  filterTransactions() {
    this.filteredTransactions = this.transactions.filter(transaction => {
      const matchesSearch = !this.searchTerm ||
        transaction.bank_account_id.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesType = !this.selectedType || transaction.type === this.selectedType;

      const transactionDate = new Date(transaction.operationDate).toISOString().split('T')[0]; // Extract date in yyyy-MM-dd format
      const matchesDate =
        (!this.fromDate || transactionDate >= this.fromDate) &&
        (!this.toDate || transactionDate <= this.toDate);

      return matchesSearch && matchesType && matchesDate;
    });
  }

  exportToExcel(): void {
    const worksheet = XLSX.utils.json_to_sheet(this.DataToexport());
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions');
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const date = new Date().toISOString().split('T')[0];
    this.saveFile(excelBuffer, `transactions-${date}`, 'xlsx');
  }

  exportToCsv(): void {
    const csv = XLSX.utils.json_to_sheet(this.DataToexport());
    const csvBuffer: any = XLSX.write({ Sheets: { Transactions: csv }, SheetNames: ['Transactions'] }, { bookType: 'csv', type: 'array' });
    const date = new Date().toISOString().split('T')[0];
    this.saveFile(csvBuffer, `transactions-${date}`, 'csv');
  }

  DataToexport (){
    return this.filteredTransactions.map(transaction => ({
      OperationID: transaction.id,
      AccountID: transaction.bank_account_id,
      CustomerName : transaction.customer.name,
      CustomerEmail : transaction.customer.email,
      Amount: `$${transaction.amount}`,
      Description: transaction.description || 'No description',
      OperationDate: new Date(transaction.operationDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }),
      Type: transaction.type
    }));
  }

 exportToPdf(): void {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.setTextColor(44, 62, 80);
    doc.text('Transactions History', 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);

    const totalAmount = this.filteredTransactions.reduce((sum, t) => sum + t.amount, 0);
    const totalTransactions = this.filteredTransactions.length;

    doc.setFontSize(11);
    doc.setTextColor(44, 62, 80);
    doc.text([
      `Total Transactions: ${totalTransactions}`,
      `Total Amount: $${totalAmount.toFixed(2)}`,
    ], 14, 40);

    doc.autoTable({
      head: [[
        'Operation ID',
        'Customer Name',
        'Customer Email',
        'Amount',
        'Operation Date',
        'Type'
      ]],
      body: this.filteredTransactions.map(transaction => [
        transaction.id,
        transaction.customer.name,
        transaction.customer.email,
        `$${transaction.amount.toFixed(2)}`,
        new Date(transaction.operationDate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }),
        transaction.type,
      ]),
      startY: 50,
      styles: {
        fontSize: 9,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontSize: 10,
        fontStyle: 'bold',
        halign: 'center'
      },
      columnStyles: {
        0: { cellWidth: 25 },  // Operation ID
        1: { cellWidth: 35 },  // Customer Name
        2: { cellWidth: 45 },  // Email
        3: { cellWidth: 25, halign: 'right' },  // Amount
        4: { cellWidth: 35 },  // Date
        5: { cellWidth: 25 },  // Type
      },
      didDrawPage: (data) => {
        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        doc.text(
          `Page ${data.pageNumber}`,
          data.settings.margin.left,
          doc.internal.pageSize.height - 10
        );
      }
    });

    const date = new Date().toISOString().split('T')[0];
    doc.save(`transactions-${date}.pdf`);
  }

  private saveFile(buffer: any, fileName: string, fileExtension: string): void {
    const blob = new Blob([buffer], { type: `application/${fileExtension}` });
    FileSaver.saveAs(blob, `${fileName}.${fileExtension}`);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.filterTransactions();
  }

  onPageSizeChange(size: number) {
    this.pageSize = size;
    this.filterTransactions();
  }

}
