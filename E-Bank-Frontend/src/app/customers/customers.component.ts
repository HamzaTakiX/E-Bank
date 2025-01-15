import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, catchError, throwError, BehaviorSubject } from 'rxjs';
import { Customer } from '../model/customer.model';
import { CustomerService } from '../services/customer.service';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {
  customers$ = new BehaviorSubject<Customer[]>([]);
  errorMessage: string | null = null;
  searchFormGroup: FormGroup;
  showDeleteModal: boolean = false;
  customerToDelete: Customer | null = null;
  isLoading = false;
  successMessage: string = '';
  showSuccessMessage: boolean = false;

  constructor(
    private customerService: CustomerService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.searchFormGroup = this.fb.group({
      keyword: ['']
    });
  }

  ngOnInit(): void {
    this.handleSearchCustomers();
  }

  handleSearchCustomers() {
    this.isLoading = true;
    let kw = this.searchFormGroup.value.keyword;
    this.customerService.searchCustomers(kw).pipe(
      catchError(err => {
        this.errorMessage = err.message;
        this.isLoading = false;
        return throwError(() => err);
      })
    ).subscribe({
      next: (data) => {
        this.customers$.next(data);
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  handleDeleteCustomer(customer: Customer) {
    this.customerToDelete = customer;
    this.showDeleteModal = true;
  }

  confirmDelete() {
    if (this.customerToDelete) {
      this.customerService.deleteCustomer(this.customerToDelete.id).pipe(
        catchError(err => {
          this.errorMessage = `Failed to delete customer: ${err.message}`;
          this.showDeleteModal = false;
          return throwError(() => err);
        })
      ).subscribe({
        next: () => {
          // Update customers list locally
          const currentCustomers = this.customers$.value;
          const updatedCustomers = currentCustomers.filter(c => c.id !== this.customerToDelete?.id);
          this.customers$.next(updatedCustomers);

          // Show success message
          this.showSuccessMessage = true;
          this.successMessage = `Customer ${this.customerToDelete?.name} has been successfully deleted`;
          this.showDeleteModal = false;
          this.customerToDelete = null;
          
          // Hide success message after a delay
          setTimeout(() => {
            this.showSuccessMessage = false;
          }, 3000);
        },
        error: () => {
          this.showDeleteModal = false;
        }
      });
    }
  }

  cancelDelete() {
    this.showDeleteModal = false;
    this.customerToDelete = null;
  }

  handleCustomerAccounts(customer: Customer) {
    this.router.navigateByUrl("/admin/customer-accounts/" + customer.id, { state: { customer: customer } });
  }

  clearSearch() {
    this.searchFormGroup.patchValue({ keyword: '' });
    this.handleSearchCustomers();
  }

  exportToExcel(): void {
    const customersData = this.DataToexport();
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(customersData);
    const workbook: XLSX.WorkBook = { Sheets: { 'Customers': worksheet }, SheetNames: ['Customers'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const date = new Date().toISOString().split('T')[0];
    this.saveFile(excelBuffer, `customers-${date}`, 'xlsx');
  }

  exportToCsv(): void {
    const customersData = this.DataToexport();
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(customersData);
    const csvOutput: string = XLSX.utils.sheet_to_csv(worksheet);
    const date = new Date().toISOString().split('T')[0];
    this.saveFile(csvOutput, `customers-${date}`, 'csv');
  }

  private DataToexport() {
    return (this.customers$.value || []).map(customer => ({
      ID: customer.id,
      Name: customer.name,
      Email: customer.email
    }));
  }

  exportToPdf(): void {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;

    // Title
    doc.setFontSize(20);
    doc.setTextColor(44, 62, 80);
    doc.text('Customers List', pageWidth/2, 20, { align: 'center' });

    // Subtitle with date
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth/2, 30, { align: 'center' });

    const totalCustomers = this.customers$.value.length;
    doc.setFontSize(12);
    doc.setTextColor(44, 62, 80);
    doc.text(`Total Customers: ${totalCustomers}`, 14, 40);

    doc.autoTable({
      head: [['ID', 'Name', 'Email']],
      body: this.customers$.value.map(customer => [
        customer.id,
        customer.name,
        customer.email
      ]),
      startY: 50,
      theme: 'striped',
      styles: {
        fontSize: 10,
        cellPadding: 6,
        lineColor: [189, 195, 199],
        lineWidth: 0.1,
        fillColor: [255, 255, 255],
        textColor: [44, 62, 80]
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontSize: 11,
        fontStyle: 'bold',
        halign: 'center',
        cellPadding: 8
      },
      columnStyles: {
        0: {
          cellWidth: 25,
          halign: 'center'
        },
        1: {
          cellWidth: 70,
          halign: 'left'
        },
        2: {
          cellWidth: 85,
          halign: 'left'
        }
      },
      didDrawPage: (data) => {
        // Footer with page number
        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        doc.text(
          `Page ${data.pageNumber}`,
          pageWidth - 20,
          doc.internal.pageSize.height - 10,
          { align: 'right' }
        );
      }
    });

    const date = new Date().toISOString().split('T')[0];
    doc.save(`customers-${date}.pdf`);
  }

  private saveFile(buffer: any, fileName: string, fileExtension: string): void {
    const blob = new Blob([buffer], { type: `application/${fileExtension}` });
    FileSaver.saveAs(blob, `${fileName}.${fileExtension}`);
  }
}
