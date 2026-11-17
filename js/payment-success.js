// ======================================
// APPROVAL FLOW - PAYMENT SUCCESS
// ======================================


// 1. GET CUSTOMER DETAILS

const customerDetails = JSON.parse(
    localStorage.getItem("customerDetails")
);


// 2. GENERATE TRANSACTION ID

function generateTransactionID() {

    return "AF" + Date.now();

}


// 3. DISPLAY PAYMENT DETAILS

document.addEventListener("DOMContentLoaded", function () {

    if (!customerDetails) {

        alert("No payment information found.");

        return;

    }


    const transactionID = generateTransactionID();


    // Display customer information

    const customerName = document.getElementById("customerName");

    const customerEmail = document.getElementById("customerEmail");

    const planName = document.getElementById("planName");

    const amount = document.getElementById("amount");

    const paymentMethod = document.getElementById("paymentMethod");

    const transactionElement = document.getElementById("transactionID");


    if (customerName) {
        customerName.textContent = customerDetails.name;
    }

    if (customerEmail) {
        customerEmail.textContent = customerDetails.email;
    }

    if (planName) {
        planName.textContent = customerDetails.plan + " Plan";
    }

    if (amount) {
        amount.textContent = "₹" + customerDetails.total.toFixed(2);
    }

    if (paymentMethod) {
        paymentMethod.textContent = customerDetails.paymentMethod;
    }

    if (transactionElement) {
        transactionElement.textContent = transactionID;
    }


    // 4. SAVE TRANSACTION DETAILS

    const transaction = {

        transactionID: transactionID,

        customerName: customerDetails.name,

        email: customerDetails.email,

        plan: customerDetails.plan,

        amount: customerDetails.total,

        paymentMethod: customerDetails.paymentMethod,

        date: new Date().toLocaleDateString(),

        status: "Demo - Not Paid"

    };


    let transactions = JSON.parse(
        localStorage.getItem("transactions")
    ) || [];


    transactions.push(transaction);


    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );


});


// 5. RETURN TO DASHBOARD

function goToDashboard() {

    window.location.href = "agency-dashboard.html";

}


// 6. RETURN TO BILLING PAGE

function goToBilling() {

    window.location.href = "billing.html";

}