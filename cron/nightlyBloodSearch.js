const express = require('express');
const axios = require('axios');
const cron = require('node-cron');

const app = express();
const port = 5001;

app.use(express.json());

// Define the blood search function
const searchForBlood = async () => {
    try {
        // Make a request to the /requestBlood endpoint on your server
        const response = await axios.post('http://localhost:5000/requestBlood', {
            // Include the necessary request parameters
            branch_id: 1,
            blood_type: 2,
            units: 3,
            city_id: 4,
            district_id: 5,
            expire_day: 7,
            reason: 'Nightly blood search',
        });

        console.log('Nightly blood search response:', response.data);
    } catch (error) {
        console.error('Error during nightly blood search:', error.message);
    }
};

// Schedule nightly blood search every day at 1:00
cron.schedule('0 1 * * *', () => {
    console.log('Running nightly blood search...');
    searchForBlood();
});

// Start the Express server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
