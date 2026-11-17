<?php
session_start();

header('Content-Type: application/json');

// Demo payment verification only
// No real payment is processed.

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        "success" => false,
        "message" => "Invalid request method."
    ]);
    exit;
}

// Get demo payment details
$plan = $_POST['plan'] ?? 'Basic';
$amount = $_POST['amount'] ?? '0';

// Generate a demo transaction ID
$transactionId = "DEMO" . strtoupper(substr(
    md5(uniqid(mt_rand(), true)), 0, 8
));

// Store demo payment information
$_SESSION['payment_status'] = 'success';
$_SESSION['transaction_id'] = $transactionId;
$_SESSION['selected_plan'] = $plan;
$_SESSION['payment_amount'] = $amount;

echo json_encode([
    "success" => true,
    "demo" => true,
    "message" => "Demo payment successful!",
    "transaction_id" => $transactionId,
    "plan" => $plan,
    "amount" => $amount
]);

exit;
?>
