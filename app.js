const axios = require('axios');
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));
const rawData = fs.readFileSync('response/uspto_response.json', 'utf8');

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

// Function to fetch with application number
app.get('/fetchUSPTOData', async (req, res) => {
    const applicationNumber = req.query.applicationNumber;
    const apiUrl = `https://ped.uspto.gov/api/queries/cms/public/${applicationNumber}`;

    try {
        const response = await axios.get(apiUrl);
        const responseData = response.data;
        console.log(responseData);


        const filePath = path.join(__dirname, 'response', 'uspto_response.json');
        fs.writeFileSync(filePath, JSON.stringify(responseData, null, 2));

        res.json(responseData);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data from USPTO API' });
    }
});

// Function to fetch with Patent number
app.get('/fetchPatentData', async (req, res) => {
    const patentNumber = req.query.patentNumber;
    const apiUrl = `https://patentcenter.uspto.gov/retrieval/public/v2/application/data?patentNumber=${patentNumber}`;

    try {
        const response = await axios.get(apiUrl);
        const responseData = response.data;

   
        savePatentResponseToFile(patentNumber, responseData);


        const applicationNumber = responseData.applicationMetaData.applicationIdentification.applicationNumberText;

    
        fetchApplicationDataAndRespond(applicationNumber, res);
    } catch (error) {
        console.error("Error fetching data from Patent API:", error);
        res.status(500).json({ error: 'Failed to fetch data from Patent API' });
    }
});

async function fetchApplicationDataAndRespond(applicationNumber, res) {
    const apiUrl = `https://ped.uspto.gov/api/queries/cms/public/${applicationNumber}`;

    try {
        const response = await axios.get(apiUrl);
        const responseData = response.data;


        const filePath = path.join(__dirname, 'response', 'uspto_response.json');
        fs.writeFileSync(filePath, JSON.stringify(responseData, null, 2));

        res.json(responseData);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data from USPTO API' });
    }
}

// Function to fetch with Publication number
app.get('/fetchPublicationData', async (req, res) => {
    const publicationNumber = req.query.publicationNumber;
    const apiUrl = `https://patentcenter.uspto.gov/retrieval/public/v2/application/data?publicationNumber=${publicationNumber}`;

    try {
        const response = await axios.get(apiUrl);
        const responseData = response.data;

        savePublicationResponseToFile(publicationNumber, responseData);

        const applicationNumber = responseData.applicationMetaData.applicationIdentification?.applicationNumberText || 'N/A';

        const usptoApiResponse = await axios.get(`https://ped.uspto.gov/api/queries/cms/public/${applicationNumber}`);

        const filePath = path.join(__dirname, 'response', 'uspto_response.json');
        fs.writeFileSync(filePath, JSON.stringify(usptoApiResponse.data, null, 2));

        res.json(usptoApiResponse.data);
    } catch (error) {
        console.error("Error fetching data from Publication API:", error);
        res.status(500).json({ error: 'Failed to fetch data from Publication API', details: error.message });
    }
});


function savePublicationResponseToFile(publicationNumber, responseData) {
    const directoryPath = path.join(__dirname, 'Publication');
    if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath);
    }

    const filePath = path.join(directoryPath, `${publicationNumber}.json`);

    fs.writeFileSync(filePath, JSON.stringify(responseData, null, 2));
}


// function savePublicationResponseToFile(publicationNumber, responseData) {
//     const directoryPath = path.join(__dirname, 'Publication');
//     if (!fs.existsSync(directoryPath)) {
//         fs.mkdirSync(directoryPath);
//     }

//     const filePath = path.join(directoryPath, `${publicationNumber}.json`);

//     fs.writeFileSync(filePath, JSON.stringify(responseData, null, 2));
// }

function savePatentResponseToFile(patentNumber, responseData) {
    const filePath = path.join(__dirname, 'public', 'uspto_response.json');

    fs.writeFileSync(filePath, JSON.stringify(responseData, null, 2));
}

// const responseData = JSON.parse(rawData);