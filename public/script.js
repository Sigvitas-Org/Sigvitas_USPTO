document.addEventListener('DOMContentLoaded', () => {
    const isNewSession = sessionStorage.getItem('newSession');

    if (isNewSession) {
        console.log('New session started.');
    }
    window.addEventListener('beforeunload', () => {
        sessionStorage.clear();
        localStorage.clear();
        sessionStorage.setItem('newSession', 'true');
    });


document.addEventListener('DOMContentLoaded', () => {
    const dataTypeDropdown = document.getElementById('dataTypeDropdown');
    const dataInput = document.getElementById('dataInput');
    const fetchButton = document.getElementById('fetchButton');
    const dataTable = document.getElementById('dataTable');

    fetchButton.addEventListener('click', async () => {
        const dataType = dataTypeDropdown.value;
        const dataValue = dataInput.value;

        if (dataType === 'application') {
            const apiUrl = `/fetchUSPTOData?applicationNumber=${dataValue}`;
            try {
                const response = await fetch(apiUrl);
                if (response.ok) {
                    const data = await response.json();
                    displayDataInTable(data, dataTable);
                } else {
                    console.error('Error fetching data:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        } else if (dataType === 'patent') {

            const apiUrl = `/fetchPatentData?patentNumber=${dataValue}`;
            try {
                const response = await fetch(apiUrl);
                if (response.ok) {
                    const data = await response.json();
                    displayDataInTable(data, dataTable);
                } else {
                    console.error('Error fetching patent data:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching patent data:', error);
            }
        } else if (dataType === 'publication') {
            const publicationNumber = dataValue;
            const apiUrl = `/fetchPublicationData?publicationNumber=${publicationNumber}`;
            try {
                const response = await fetch(apiUrl);
                if (response.ok) {
                    const data = await response.json();
                    displayDataInTable(data, dataTable);
                } else {
                    console.error('Error fetching publication data:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching publication data:', error);
            }
        }
    });
});

function displayDataInTable(data, dataTable) {

    const tbody = dataTable.querySelector('tbody');


    tbody.innerHTML = '';

    if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5">No data to display.</td></tr>';
    } else {
        data.forEach(record => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${record.mailRoomDate || 'N/A'}</td>
                <td>${record.documentCode || 'N/A'}</td>
                <td>${record.documentDescription || 'N/A'}</td>
                <td>${record.pageCount || 'N/A'}</td>
                <td>${record.pdfUrl ? `<a class="download-pdf" href="https://ped.uspto.gov/api/queries/cms/${record.pdfUrl}" download="${record.pdfUrl}" target="_blank"><i class="fas fa-download"></i>PDF</a>` : 'N/A'}</td>
            `;
            tbody.appendChild(row);
        });


        const resultsSection = document.querySelector('.results-section');
        resultsSection.style.display = 'block';
    }
}
const clearSessionButton = document.getElementById('clearSessionButton');
    clearSessionButton.addEventListener('click', () => {
        sessionStorage.clear();
        localStorage.clear();
        console.log('Session data and local storage cleared.');
    });
});
