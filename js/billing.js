// ======================================
// APPROVAL FLOW - BILLING JAVASCRIPT
// ======================================


// 1. GET TRANSACTION HISTORY

let transactions = JSON.parse(
    localStorage.getItem("transactions")
) || [];


// 2. DISPLAY TRANSACTION HISTORY

document.addEventListener("DOMContentLoaded", function () {

    displayTransactions();

});


// 3. FUNCTION TO DISPLAY TRANSACTIONS

function displayTransactions() {

    const tableBody = document.getElementById("transactionTable");

    if (!tableBody) {
        console.error("Transaction table not found!");
        return;
    }

    tableBody.innerHTML = "";

    if (transactions.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center;">
                    No transaction history available.
                </td>
            </tr>
        `;

        return;
    }


    // Display latest transactions first

    transactions.slice().reverse().forEach(function (transaction) {

        const row = document.createElement("tr");

        const date = transaction.date || "N/A";

        const status = transaction.status || "Pending";

        row.innerHTML = `
            <td>${transaction.transactionID || "N/A"}</td>

            <td>${date}</td>

            <td>${transaction.plan || "N/A"}</td>

            <td>₹${Number(transaction.amount || 0).toFixed(2)}</td>

            <td>
                <span class="status pending">
                    ${status}
                </span>
            </td>

            <td>
                <button class="download" onclick="downloadInvoice('${transaction.transactionID}')">
                    Download
                </button>
            </td>
        `;

        tableBody.appendChild(row);

    });

}


// 4. DOWNLOAD INVOICE

function downloadInvoice(transactionID) {

    const transaction = transactions.find(
        item => item.transactionID === transactionID
    );

    if (!transaction) {

        alert("Transaction not found!");

        return;

    }


    const invoiceContent = `
APPROVAL FLOW
PAYMENT INVOICE

Transaction ID: ${transaction.transactionID}

Customer: ${transaction.customerName}

Email: ${transaction.email}

Plan: ${transaction.plan}

Amount: ₹${Number(transaction.amount).toFixed(2)}

Payment Method: ${transaction.paymentMethod}

Date: ${transaction.date}

Status: ${transaction.status}

--------------------------------
Thank you for choosing Approval Flow!
    `;


    const blob = new Blob(
        [invoiceContent],
        { type: "text/plain" }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = "Invoice_" + transactionID + ".txt";

    link.click();

    URL.revokeObjectURL(url);

}


// 5. DISPLAY TOTAL TRANSACTIONS

function getTotalTransactions() {

    return transactions.length;

}


// 6. DISPLAY TOTAL AMOUNT

function getTotalAmount() {

    return transactions.reduce(function (total, transaction) {

        return total + Number(transaction.amount || 0);

    }, 0);

}