import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CustomersComponent} from "./customers/customers.component";
import {AccountsComponent} from "./accounts/accounts.component";
import {NewCustomerComponent} from "./new-customer/new-customer.component";
import {CustomerAccountsComponent} from "./customer-accounts/customer-accounts.component";
import {DashboardComponent} from "./dashboard/dashboard.component";
import { TransactionsHistoryComponent } from './transactions-history/transactions-history.component';
import {LoginComponent} from "./login/login.component";
import {AdminTemplateComponent} from "./admin-template/admin-template.component";
import {AuthenticationGuard} from "./guards/authentication.guard";
import {AuthorizationGuard} from "./guards/authorization.guard";
import {NotAuthorizedComponent} from "./not-authorized/not-authorized.component";

const routes: Routes = [
  { path : "login", component : LoginComponent},
  { path : "", redirectTo : "/login", pathMatch :"full"},
  { path : "admin", component: AdminTemplateComponent, canActivate : [AuthenticationGuard],
    children:[
      { path :"home", component : DashboardComponent ,canActivate : [AuthorizationGuard], data : {role : 'ADMIN'}},
      { path :"customers", component : CustomersComponent,canActivate : [AuthorizationGuard], data : {role : 'ADMIN'}},
      { path :"accounts", component : AccountsComponent,canActivate : [AuthorizationGuard], data : {role : 'ADMIN'}},
      { path :"new-customer", component : NewCustomerComponent, canActivate : [AuthorizationGuard], data : {role : 'ADMIN'}},
      { path :"customer-accounts/:id", component : CustomerAccountsComponent,canActivate : [AuthorizationGuard], data : {role : 'ADMIN'}},
      { path : "transactions", component : TransactionsHistoryComponent ,canActivate : [AuthorizationGuard], data : {role : 'ADMIN'}},
      { path : "notAuthorized", component : NotAuthorizedComponent ,canActivate : [AuthorizationGuard], data : {role : 'ADMIN'}},
    ]},
    {path :'home', component : DashboardComponent, canActivate : [AuthenticationGuard]},
    {path :"**", redirectTo : "login"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
