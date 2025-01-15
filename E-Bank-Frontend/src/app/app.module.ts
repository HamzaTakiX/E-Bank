import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { CustomersComponent } from './customers/customers.component';
import { AccountsComponent } from './accounts/accounts.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {ReactiveFormsModule} from "@angular/forms";
import { NewCustomerComponent } from './new-customer/new-customer.component';
import { CustomerAccountsComponent } from './customer-accounts/customer-accounts.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TransactionsHistoryComponent } from './transactions-history/transactions-history.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { AccountService } from './services/account.service';
import { LoginComponent } from './login/login.component';
import { AdminTemplateComponent } from './admin-template/admin-template.component';
import {AppHttpInterceptor} from "./interceptors/app-http.interceptor";
import { NotAuthorizedComponent } from './not-authorized/not-authorized.component';
import { NumberFormatPipe } from './pipes/number-format.pipe';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    CustomersComponent,
    AccountsComponent,
    NewCustomerComponent,
    DashboardComponent,
    CustomerAccountsComponent,
    TransactionsHistoryComponent,
    LoginComponent,
    AdminTemplateComponent,
    NotAuthorizedComponent,
    NumberFormatPipe,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxPaginationModule
  ],
  providers: [
    AccountService,
    {provide : HTTP_INTERCEPTORS, useClass : AppHttpInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
