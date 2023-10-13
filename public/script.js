document.getElementById("fetchBtn").addEventListener("click", async () => {
    const numberInput = document.getElementById("numberInput").value;

    if (numberInput) {
        const response = await fetch(`/fetchUSPTOData?applicationNumber=${numberInput}`);
        if (response.ok) {
            const data = await response.json();
            displayResponseInTable(data);
        } else {
            alert("Failed to fetch data from USPTO API.");
        }
    } else {
        alert("Please enter a valid application number.");
    }
});

function displayResponseInTable(responseData) {
    const responseTable = document.getElementById("responseTable");
    responseTable.style.display = "block"; // Show the table
    const tableHTML = `
        <table border="1">
            <thead>
                <tr>
                    <th>Mail Room Date</th>
                    <th>Document Code</th>
                    <th>Document Description</th>
                    <th>Page Count</th>
                    <th>PDF</th>
                </tr>
            </thead>
            <tbody>
                ${responseData.map(record => `
                    <tr>
                        <td>${record.mailRoomDate}</td>
                        <td>${record.documentCode}</td>
                        <td>${record.documentDescription}</td>
                        <td>${record.pageCount}</td>
                        <td><a href="https://ped.uspto.gov/api/queries/cms/${record.pdfUrl}" download="${record.pdfUrl}" target="_blank">Download PDF</a></td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;

    responseTable.innerHTML = tableHTML;
}
