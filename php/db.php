<?php
mysqli_report(MYSQLI_REPORT_OFF);
ini_set('display_errors', 0);

$conn = new mysqli("localhost", "root", "", "approvalflow");
if ($conn->connect_error) {
    http_response_code(500);
    header("Content-Type: application/json");
    echo json_encode(["success" => false, "message" => "Database connection failed."]);
    exit;
}
$conn->set_charset("utf8mb4");