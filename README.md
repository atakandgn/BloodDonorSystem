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

# Daily Blood Bank Search - CRON Job

## Overview

This Node.js application implements a CRON job designed for daily blood bank searches. The job runs every night at 01:00, making an API request to check for specific blood types. If the requested blood type is available in the blood bank table (`blood_bank`), the corresponding units are decremented, and an email notification is sent to the blood donor.

Additionally, the application interfaces with a Redis Queue. If the requested units exceed the available quantity in the blood bank, the application checks the Redis Queue. If there are enough units in the queue, it decrements the blood bank accordingly and sends an email notification to the donor.

## Implementation

### Code Overview

1. **CRON Job Setup:**
   - The CRON job is configured using the `node-cron` library to execute the blood bank search task every night at 01:00.

    ```javascript
    const cron = require('node-cron');
    cron.schedule('0 1 * * *', async () => {
        // Blood bank search and processing logic
    });
    ```

2. **Blood Bank Search Logic:**
   - The application makes an API request to check for the availability of a specific blood type.

    ```javascript
    const axios = require('axios');
    try {
        const response = await axios.post('http://api.example.com/bloodBankSearch');
        // Process the response and decrement blood bank units
    } catch (error) {
        console.error(error.message);
    }
    ```

3. **Email Notification to Donor:**
   - Upon successful processing, an email notification is sent to the blood donor.

4. **Redis Queue Integration:**
   - The application checks the Redis Queue for additional blood units if the requested quantity exceeds the blood bank's available units.

    ```javascript
    const { createClient } = require('ioredis');
    const redisClient = createClient({ /* Redis configuration */ });
    // Check and process units from the Redis Queue
    ```

5. **Email Notification to Donor from Queue:**
   - If sufficient units are available in the queue, the blood bank is decremented accordingly, and an email notification is sent to the donor.

## Running the CRON Job

Execute the application to initiate the CRON job:

```bash
node bloodBankSearchCron.js
