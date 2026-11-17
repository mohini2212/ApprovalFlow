```php
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

// Get subscription details
$plan = $_POST['plan'] ?? '';
$amount = $_POST['amount'] ?? 0;

// Available plans
$plans = [
    "Basic" => 499,
    "Pro" => 999,
    "Premium" => 1499
];

// Validate plan
if (!array_key_exists($plan, $plans)) {
    echo json_encode([
        "success" => false,
        "message" => "Invalid subscription plan."
    ]);
    exit;
}

// Generate demo subscription ID
$subscriptionId = "SUB" . strtoupper(
    substr(md5(uniqid(mt_rand(), true)), 0, 8)
);

// Store subscription details
$_SESSION['subscription_id'] = $subscriptionId;
$_SESSION['subscription_plan'] = $plan;
$_SESSION['subscription_amount'] = $plans[$plan];
$_SESSION['subscription_status'] = "active";
$_SESSION['subscription_type'] = "demo";

// Response
echo json_encode([
    "success" => true,
    "demo" => true,
    "message" => "Demo subscription created successfully!",
    "subscription_id" => $subscriptionId,
    "plan" => $plan,
    "amount" => $plans[$plan],
    "status" => "active"
]);

exit;
?>
```