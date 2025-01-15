# E-Bank Project

## Overview
E-Bank is a comprehensive banking management application designed to handle customers, accounts, and operations. It consists of two main parts:
1. *Backend*: Built using Spring Boot.
2. *Frontend*: Developed using Angular.

## Features
### Backend:
- Manage customers and bank accounts.
- Perform debit, credit, and transfer operations.
- Support for saving and current accounts.
- Integration with PostgreSQL database.
- Secure API endpoints with Spring Security and JWT.

### Frontend:
- User authentication and authorization.
- Customer and account management interface.
- Interactive dashboard with charts for key banking metrics (using Chart.js).
- Responsive design for multiple devices.

## Project Structure
### Backend:
plaintext
E-bank-Backend/
├── mvnw
├── mvnw.cmd
├── pom.xml
└── src
    ├── main
    │   ├── java
    │   │   └── com
    │   │       └── dev
    │   │           └── ebankbackend
    │   │               ├── dtos
    │   │               ├── entities
    │   │               ├── enums
    │   │               ├── exceptions
    │   │               ├── mappers
    │   │               ├── repositories
    │   │               ├── security
    │   │               ├── services
    │   │               └── web
    │   └── resources
    └── test


### Frontend:
plaintext
E-Bank-Frontend/
├── src
│   ├── app
│   │   ├── accounts
│   │   ├── admin-template
│   │   ├── customer-accounts
│   │   ├── customers
│   │   ├── dashboard
│   │   ├── guards
│   │   ├── interceptors
│   │   ├── login
│   │   ├── model
│   │   ├── navbar
│   │   ├── new-customer
│   │   ├── not-authorized
│   │   ├── pipes
│   │   ├── services
│   │   └── transactions-history
│   ├── environments
│   └── assets


## Technologies Used
### E-Bank:
- *Backend:* Spring Boot, Hibernate.
- *Frontend:* Angular, Chart.js.
- *Security:* Spring Security, JWT.
---

