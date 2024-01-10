# Patient Management System

## Introduction

A simple Patient Management System for managing patient records.

## Features

- Search patients based on various criteria
- Add new patients to the system
- Update patient information
- View all patients with pagination support
- Delete patient records
- Admin authentication with JWT token

## Getting Started

### Prerequisites

Before running the project, make sure you have the following installed:

- Node.js
- npm
- MySQL

### Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/atakandgn/admin_patient_system
    cd patient-management-system
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Set up your MySQL database:**

    Update the configuration in `config/config.js` with your database credentials.

4. **Run the application:**

    ```bash
    npm start
    ```

## Usage

Once the application is set up, you can use the provided endpoints to interact with the Patient Management System.

## Endpoints

### Authentication

- **Admin Login:** `POST /login`
  Authenticate and generate a JWT token for admin login.

- **Admin Registration:** `POST /register`
  Register a new admin.

### Patient Management

- **Add Patient:** `POST /add-patient`
  Add a new patient (Authentication required)

- **Update Patient:** `PUT /update-patient/{patientId}`
  Update patient information (Authentication required)

- **Search Patient:** `GET /search-patient`
  Search for patients based on specified criteria.

- **View All Patients:** `GET /view-all-patients`
  Retrieve all patients with pagination.

- **Delete Patient:** `DELETE /delete-patient/{patientId}`
  Delete a patient based on patient ID (Authentication required).

## Swagger Documentation

The Swagger documentation for the API endpoints is available at [Swagger Documentation](#swagger-documentation).

## Contributing

Contributions are welcome! If you find any issues or want to contribute to the project, please open a pull request or submit an issue.

### For communication
-  Reach out to atakandogan.info@gmail.com or [LinkedIn](https://www.linkedin.com/in/atakandoan/) 
