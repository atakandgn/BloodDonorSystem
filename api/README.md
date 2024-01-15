# Hospital Management System Routes

![donorSystemClient](https://github.com/atakandgn/BloodDonorSystem/assets/108396649/35b719c9-f0f9-456d-a7d4-e8fe381edc7a)

## 1. Create Donor (`/createDonor`)

- **Method**: POST
- **Auth**: Token required
- **Desc**: Creates a new blood donor record with details such as name, contact, blood type, and location.

## 2. Update Donor (`/updateDonor/:donor_id`)

- **Method**: PUT
- **Auth**: Token required
- **Desc**: Updates information for an existing blood donor identified by `donor_id`.

## 3. Add Blood to Bank (`/addBloodToBank`)

- **Method**: POST
- **Auth**: Token required
- **Desc**: Records a blood donation to the blood bank, associating it with a branch, donor, and donation date.

## 4. Request Blood (`/requestBlood`)

- **Method**: POST
- **Auth**: Not required
- **Desc**: Initiates a blood request, considering factors like blood type, units needed, location, and expiration days.

## 5. Process Blood Requests (`/processBloodRequests`)

- **Method**: POST
- **Auth**: Not required
- **Desc**: Processes blood requests, checking available blood in the bank and fulfilling requests.

## 6. Get Blood Types (`/getBloodTypes`)

- **Method**: GET
- **Auth**: Not required
- **Desc**: Retrieves a list of available blood types.

## 7. Get All Donors (`/getAllDonors`)

- **Method**: GET
- **Auth**: Not required
- **Desc**: Retrieves a list of all blood donors, optionally filtered by name and surname.

## 8. Login (`/login`)

- **Method**: POST
- **Auth**: Not required
- **Desc**: Validates branch credentials (username and password), generates a JWT token upon successful validation, and returns it in the response.

## 9. Register (`/register`)

- **Method**: POST
- **Auth**: Not required
- **Desc**: Registers a new branch, validating input parameters such as branch name, username, password, and district.

## 10. Get Country (`/getCountry`)

- **Method**: GET
- **Auth**: Not required
- **Desc**: Retrieves a list of countries, including their cities and districts.

## 11. Get All Branches (`/getAllBranches`)

- **Method**: GET
- **Auth**: Not required
- **Desc**: Retrieves a list of all branches, optionally filtered by branch name. Includes details such as branch ID, name, district, and city.


![donorSystemDB](https://github.com/atakandgn/BloodDonorSystem/assets/108396649/7f47d35d-7381-4388-b5da-e06bf787a552)

# CRON Job Explanation

## Overview

This Node.js application implements a CRON job using the `node-cron` library. The purpose of the CRON job is to automate the execution of a specific task at regular intervals. In this scenario, the task involves making an HTTP POST request to a specified endpoint, assumed to be handling blood donation requests in a hospital management system.

## Implementation

### Code Overview

The main components of the implementation are as follows:

1. **Express Server Setup:**
    - A basic Express server is set up on port 5001.

    ```javascript
    const express = require('express');
    const app = express();
    const port = 5001;
    ```

2. **CRON Job Configuration:**
    - The `node-cron` library is utilized to schedule a job that runs every night at 01:00.

    ```javascript
    const cron = require('node-cron');
    cron.schedule('0 1 * * *', async () => {
        // ...
    });
    ```

3. **HTTP POST Request:**
    - Within the CRON job, an asynchronous HTTP POST request is made to the API `/processBloodRequests` endpoint.

    ```javascript
    const axios = require('axios');
    try {
        const response = await axios.post('http://localhost:5000/processBloodRequests');
        console.log(response.data.message);
    } catch (error) {
        console.error(error.message);
    }
    ```

    - The response message is logged if the request is successful; otherwise, any encountered error is logged.

4. **Server Initialization:**
    - The Express server is started, and the CRON job is set in motion.

    ```javascript
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
    ```

## Running the CRON Job

To execute the CRON job, run the `app.js` file using Node.js:

```bash
node app.js
