// ======================================
// APPROVAL FLOW - PAYMENT JAVASCRIPT
// ======================================


// 1. GET SELECTED SUBSCRIPTION PLAN

const plan = localStorage.getItem("selectedPlan") || "Pro";

const amount = Number(
    localStorage.getItem("selectedAmount") || 999
);


// 2. CALCULATE BILLING AMOUNT

const gst = amount * 0.18;

const total = amount + gst;


// 3. DISPLAY SUBSCRIPTION DETAILS

document.addEventListener("DOMContentLoaded", function () {

    const planName = document.getElementById("planName");

    const planPrice = document.getElementById("planPrice");

    const gstElement = document.getElementById("gst");

    const totalElement = document.getElementById("total");


    if (planName) {
        planName.textContent = plan + " Plan";
    }

    if (planPrice) {
        planPrice.textContent = "₹" + amount.toFixed(2);
    }

    if (gstElement) {
        gstElement.textContent = "₹" + gst.toFixed(2);
    }

    if (totalElement) {
        totalElement.textContent = "₹" + total.toFixed(2);
    }


    // 4. HANDLE PAYMENT FORM

    const paymentForm = document.getElementById("paymentForm");


    if (paymentForm) {

        paymentForm.addEventListener("submit", function (event) {

            event.preventDefault();


            // Get customer details

            const name = document.getElementById("name").value.trim();

            const email = document.getElementById("email").value.trim();

            const phone = document.getElementById("phone").value.trim();


            // Get selected payment method

            const selectedMethod = document.querySelector(
                'input[name="payment"]:checked'
            );


            // 5. VALIDATE CUSTOMER DETAILS

            if (!name || !email || !phone) {

                alert("Please fill in all customer details.");

                return;

            }


            if (!/^[0-9]{10}$/.test(phone)) {

                alert("Please enter a valid 10-digit mobile number.");

                return;

            }


            if (!selectedMethod) {

                alert("Please select a payment method.");

                return;

            }


            // 6. SAVE CUSTOMER INFORMATION

            const customerDetails = {

                name: name,

                email: email,

                phone: phone,

                plan: plan,

                amount: amount,

                gst: gst,

                total: total,

                paymentMethod: selectedMethod.value

            };


            localStorage.setItem(
                "customerDetails",
                JSON.stringify(customerDetails)
            );


            // 7. DEMO PAYMENT PROCESSING

            alert(
                "Checkout details saved successfully!\n\n" +

                "Customer: " + name +

                "\nPlan: " + plan +

                "\nTotal Amount: ₹" + total.toFixed(2) +

                "\nPayment Method: " + selectedMethod.value +

                "\n\nDemo mode: No actual payment has been made."
            );

        });

    }

});