document.addEventListener('DOMContentLoaded', () => {
    const dataTypeDropdown = document.getElementById('dataTypeDropdown');
    const dataInput = document.getElementById('dataInput');
    const fetchButton = document.getElementById('fetchButton');
    const dataTable = document.getElementById('dataTable');
    const resultsSection = document.querySelector('.results-section');
    const filterButton = document.getElementById('filterButton');
    const refreshButton = document.getElementById('refreshButton');
    const filterDropdown = document.getElementById('filterDropdown');
    const dropdownItems = filterDropdown.querySelectorAll('.dropdown-item');
    const loader = document.getElementById('loader');


    filterDropdown.addEventListener('click', (event) => {
        event.stopPropagation();
    });
    const initiateDownload = (pdfUrl) => {
        if (pdfUrl) {
            window.location.href = `https://ped.uspto.gov/api/queries/cms/${pdfUrl}`;
        } else {
            console.log('No PDF URL found for this filter.');
        }
    };

    fetchButton.addEventListener('click', async () => {
        // Show the loader while fetching data
        loader.style.display = 'block';

        // Clear the table
        dataTable.innerHTML = '';
        resultsSection.style.display = 'none';

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
            // Handle patent data fetching and displaying
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

    function displayDataInTable(data, dataTable) {
        // Clear the loader
        loader.style.display = 'none';

        // Clear the table
        dataTable.innerHTML = '';

        if (data.length === 0) {
            dataTable.innerHTML = '<tr><td colspan="5">No data to display.</td></tr>';
        } else {
            // Display table header
            dataTable.innerHTML = `
            <tr>
                <th>Mail Room Date</th>
                <th>Document Code</th>
                <th>Document Description</th>
                <th>Page Count</th>
                <th>PDF</th>
            </tr>
        `;

            let totalPageCount = 0; // Initialize total page count
            let totalEntryCount = 0; // Initialize total entry count

            data.forEach(record => {
                // Format the date to MM/DD/YYYY
                const mailRoomDate = record.mailRoomDate ? new Date(record.mailRoomDate).toLocaleDateString('en-US') : 'N/A';

                const row = document.createElement('tr');
                row.innerHTML = `
                <td>${mailRoomDate}</td>
                <td>${record.documentCode || 'N/A'}</td>
                <td>${record.documentDescription || 'N/A'}</td>
                <td>${record.pageCount || 'N/A'}</td>
                <td>${record.pdfUrl ? `<a class="download-pdf" href="https://ped.uspto.gov/api/queries/cms/${record.pdfUrl}" download="${record.pdfUrl}" target="_blank"><i class="fas fa-download"></i>PDF</a>` : 'N/A'}</td>
            `;
                dataTable.appendChild(row);

                totalPageCount += parseInt(record.pageCount) || 0;
                // Increment the total entry count
                totalEntryCount++;
            });

            const totalPageCountPlaceholder = document.getElementById('totalPageCountPlaceholder');
            if (totalPageCountPlaceholder) {
                totalPageCountPlaceholder.innerHTML = `Total Pages: <span id="totalPageCount">${totalPageCount}</span>`;
            }
            const totalEntryCountPlaceholder = document.getElementById('totalEntryCountPlaceholder');
            if (totalEntryCountPlaceholder) {
                totalEntryCountPlaceholder.innerHTML = `Total Entries: <span id="totalEntryCount">${totalEntryCount}</span>`;
            }
            resultsSection.style.display = 'block';
        }
    }



    refreshButton.addEventListener('click', () => {
        // Generate a random session identifier
        const sessionIdentifier = Math.random().toString(36).substring(7);
        
        // Append the session identifier to the URL and reload the page
        const newUrl = `${window.location.href}?session=${sessionIdentifier}`;
        window.location.href = newUrl;
    });
    
 




    dropdownItems.forEach((item) => {
        item.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent default link behavior
            const filterType = event.target.getAttribute('data-value');

            if (filterType == 'abstract') {
                // Fetch and handle Abstracts
                fetch('response/uspto_response.json')
                    .then((response) => response.json())
                    .then((data) => {
                        // Filter data for "Abstract" (ABST)
                        const abstracts = data.filter((record) => record.documentCode === 'ABST');

                        if (abstracts.length > 0) {
                            // Find the record with the earliest mailRoomDate
                            let earliestRecord = abstracts[0];
                            for (const record of abstracts) {
                                if (new Date(record.mailRoomDate) < new Date(earliestRecord.mailRoomDate)) {
                                    earliestRecord = record;
                                }
                            }

                            // Initiate the download
                            console.log('Fetching and downloading Abstracts...');
                            initiateDownload(earliestRecord.pdfUrl);
                        } else {
                            console.log('No Abstract documents found.');
                        }
                    })
                    .catch((error) => {
                        console.error('Error fetching Abstract data:', error);
                    });
            } else if (filterType == 'claims') {
                // Fetch and handle Claims
                fetch('response/uspto_response.json')
                    .then((response) => response.json())
                    .then((data) => {
                        // Filter data for "Claims" (CLM)
                        const claims = data.filter((record) => record.documentCode === 'CLM');

                        if (claims.length > 0) {
                            // Find the record with the earliest mailRoomDate
                            let earliestRecord = claims[0];
                            for (const record of claims) {
                                if (new Date(record.mailRoomDate) < new Date(earliestRecord.mailRoomDate)) {
                                    earliestRecord = record;
                                }
                            }

                            // Initiate the download
                            console.log('Fetching and downloading Claims...');
                            initiateDownload(earliestRecord.pdfUrl);
                        } else {
                            console.log('No Claims documents found.');
                        }
                    })
                    .catch((error) => {
                        console.error('Error fetching Claims data:', error);
                    });
            } else if (filterType =='specifications') {
                // Fetch and handle Specifications
                fetch('/response/uspto_response.json')
                    .then((response) => response.json())
                    .then((data) => {
                        // Filter data for "Specifications" (SPEC)
                        const specifications = data.filter((record) => record.documentCode === 'SPEC');

                        if (specifications.length > 0) {
                            // Find the record with the earliest mailRoomDate
                            let earliestRecord = specifications[0];
                            for (const record of specifications) {
                                if (new Date(record.mailRoomDate) < new Date(earliestRecord.mailRoomDate)) {
                                    earliestRecord = record;
                                }
                            }

                            // Initiate the download
                            console.log('Fetching and downloading Specifications...');
                            initiateDownload(earliestRecord.pdfUrl);
                        } else {
                            console.log('No Specifications documents found.');
                        }
                    })
                    .catch((error) => {
                        console.error('Error fetching Specifications data:', error);
                    });
            } else if (filterType === 'all') {
                // Handle All
                // You can implement downloading all documents here
                // Zip the documents and initiate a download
                console.log('Fetching and downloading all documents (Abstracts, Claims, Specifications)...');
            }
        });
    });



    // Refresh button click event
    refreshButton.addEventListener('click', () => {
        clearCacheAndReload();
    });

    // Add a listener for the beforeunload event
    window.addEventListener('beforeunload', () => {
        clearCacheAndReload();
    });

    // Function to clear the session and reload the page
    function clearCacheAndReload() {
        // Clear session data
        sessionStorage.clear();

        // Reload the page
        location.reload();
    }
})
