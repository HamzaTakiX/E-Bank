# E-Bank Project

## Overview
E-Bank is a comprehensive digital banking management system that provides a secure and efficient platform for managing banking operations. The application follows a microservices architecture with a Spring Boot backend and Angular frontend.

## Features

### Backend Features:
- **Customer Management**
  - CRUD operations for customer profiles
  - Customer search functionality
  - Role-based access control (ADMIN/USER)
  - Secure password hashing with BCrypt

- **Account Management**
  - Support for Current and Savings accounts
  - Real-time balance tracking
  - Account status management (CREATED, ACTIVATED, SUSPENDED)
  - Overdraft facility for Current accounts

- **Transaction Management**
  - Debit operations
  - Credit operations
  - Inter-account transfers
  - Transaction history tracking
  - Operation types: DEBIT, CREDIT, TRANSFER

- **Security**
  - JWT-based authentication
  - Role-based authorization
  - Secure password handling
  - Protected API endpoints
  - CORS configuration

### Frontend Features:
- **User Interface**
  - Responsive dashboard
  - Real-time account balance display
  - Interactive transaction history
  - Customer management interface
  - Account management screens

- **Authentication & Authorization**
  - Secure login system
  - JWT token management
  - Protected routes with Guards
  - Role-based access control
  - Session management

- **Data Visualization**
  - Transaction analytics
  - Account balance trends
  - Interactive charts using Chart.js
  - Customizable date ranges

## Technical Stack

### Backend Technologies:
- Java 8+
- Spring Boot 2.x
- Spring Security
- Spring Data JPA
- Hibernate
- MySQL Database
- JWT Authentication
- Maven
- Lombok
- BCrypt Password Encoder

### Frontend Technologies:
- Angular 13
- TypeScript 4.x
- Bootstrap 5.1.3
- Chart.js
- Angular Material
- RxJS
- Bootstrap Icons
- HTTP Interceptors
- Angular Guards

## API Endpoints

### Customer APIs
- GET `/customers` - List all customers
- GET `/customers/search` - Search customers
- GET `/customers/{id}` - Get customer details
- POST `/customers` - Create new customer
- PUT `/customers/{id}` - Update customer
- DELETE `/customers/{id}` - Delete customer

### Account APIs
- GET `/accounts` - List all accounts
- GET `/accounts/{id}` - Get account details
- POST `/accounts` - Create new account
- DELETE `/accounts/{id}` - Delete account
- POST `/accounts/debit` - Debit operation
- POST `/accounts/credit` - Credit operation
- POST `/accounts/transfer` - Transfer operation

## Setup Instructions

### Backend Setup:
1. Clone the repository
2. Navigate to `E-bank-Backend` directory
3. Configure MySQL database in `application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/e-bank
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```
4. Run `mvn clean install` to build
5. Run `mvn spring-boot:run` to start (default port: 8085)

### Frontend Setup:
1. Navigate to `E-Bank-Frontend` directory
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure backend API URL in `environment.ts`:
   ```typescript
   export const environment = {
     production: false,
     backendHost: "http://localhost:8085"
   };
   ```
4. Run development server:
   ```bash
   ng serve
   ```
5. Access application at `http://localhost:4200`

## Data Models

### Customer
- id: Long
- name: String
- email: String
- password: String (hashed)
- role: UserRole (ADMIN/USER)

### BankAccount
- id: String (UUID)
- balance: double
- createdAt: Date
- status: AccountStatus
- customer: Customer
- type: AccountType (CURRENT/SAVINGS)

### AccountOperation
- id: Long
- operationDate: Date
- amount: double
- type: OperationType
- description: String
- bankAccount: BankAccount

## Security Configuration
- JWT token-based authentication
- Password encryption using BCrypt
- Role-based access control (ADMIN/USER)
- Protected API endpoints with Spring Security
- Secure session management
- CORS configuration for frontend access

## Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Support
For support and queries, please create an issue in the repository.
