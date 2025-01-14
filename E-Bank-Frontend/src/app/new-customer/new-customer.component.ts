import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Customer} from "../model/customer.model";
import {CustomerService} from "../services/customer.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-new-customer',
  templateUrl: './new-customer.component.html',
  styleUrls: ['./new-customer.component.css']
})
export class NewCustomerComponent implements OnInit {
  newCustomerFormGroup! : FormGroup;
  successMessage: string = '';
  showSuccessMessage: boolean = false;

  constructor(private fb : FormBuilder, private customerService:CustomerService, private router:Router) { }

  ngOnInit(): void {
    this.newCustomerFormGroup=this.fb.group({
      name : this.fb.control(null, [Validators.required]),
      email : this.fb.control(null,[Validators.required, Validators.email]),
      password : this.fb.control(null,[Validators.required, Validators.minLength(8)])
    });
  }

  handleSaveCustomer() {
    let customer:Customer=this.newCustomerFormGroup.value;
    this.customerService.saveCustomer(customer).subscribe({
      next : data => {
        this.showSuccessMessage = true;
        this.successMessage = "Customer has been successfully saved!";
        setTimeout(() => {
          this.router.navigateByUrl("/customers");
        }, 1500);
      },
      error : err => {
        console.log(err);
      }
    });
  }
}
