// app.js
const express = require('express');
const cron = require('node-cron');
const axios = require('axios');

const app = express();
const port = 5001;
// The cron job to run every night at 01:00
cron.schedule('0 1 * * *', async () => {
    try {
        // Make a request to your "/processBloodRequests" endpoint
        const response = await axios.post('http://localhost:5000/processBloodRequests');
        console.log(response.data.message);
    } catch (error) {
        console.error(error.message);
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
