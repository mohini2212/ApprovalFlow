<?php
session_start();

header('Content-Type: application/json');


if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        "success" => false,
        "message" => "Invalid request method."
    ]);
    exit;
}

// Check subscription
if (!isset($_SESSION['subscription_id'])) {
    echo json_encode([
        "success" => false,
        "message" => "No active subscription found."
    ]);
    exit;
}

if ($_SESSION['subscription_status'] !== 'active') {
    echo json_encode([
        "success" => false,
        "message" => "Subscription is already cancelled."
    ]);
    exit;
}

// Cancel demo subscription
$_SESSION['subscription_status'] = 'cancelled';

$subscriptionId = $_SESSION['subscription_id'];
$plan = $_SESSION['subscription_plan'] ?? 'Basic';

// Send response
echo json_encode([
    "success" => true,
    "demo" => true,
    "message" => "Subscription cancelled successfully.",
    "subscription_id" => $subscriptionId,
    "plan" => $plan,
    "status" => "cancelled"
]);

exit;
?>

