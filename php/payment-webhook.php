<?php
session_start();

header('Content-Type: application/json');
$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode([
        "success" => false,
        "message" => "Invalid webhook data."
    ]);
    exit;
}

$transactionId = $data['transaction_id'] ?? null;
$status = $data['status'] ?? 'pending';
$amount = $data['amount'] ?? 0;

if (!$transactionId) {
    echo json_encode([
        "success" => false,
        "message" => "Transaction ID missing."
    ]);
    exit;
}

$_SESSION['webhook_status'] = $status;
$_SESSION['webhook_transaction'] = $transactionId;
$_SESSION['webhook_amount'] = $amount;

echo json_encode([
    "success" => true,
    "demo" => true,
    "message" => "Demo webhook received successfully.",
    "transaction_id" => $transactionId,
    "status" => $status
]);

exit;
?>