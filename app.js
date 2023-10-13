const axios = require('axios');
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

app.get('/fetchUSPTOData', async (req, res) => {
    const applicationNumber = req.query.applicationNumber;
    const apiUrl = `https://ped.uspto.gov/api/queries/cms/public/${applicationNumber}`;

    try {
        const response = await axios.get(apiUrl);
        const responseData = response.data;

        // Save the response to a JSON file
        saveResponseToFile(responseData);

        res.json(responseData);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data from USPTO API' });
    }
});

function saveResponseToFile(responseData) {
    const filePath = path.join(__dirname, 'public', 'uspto_response.json');

    // Write the response data as a JSON file
    fs.writeFileSync(filePath, JSON.stringify(responseData, null, 2));
}
