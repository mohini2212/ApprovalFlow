<?php
header("Content-Type: application/json");
ini_set('display_errors', 0);
require_once __DIR__ . "/db.php";

function respond($ok, $msg, $code = 200) {
    http_response_code($code);
    echo json_encode(["success" => $ok, "message" => $msg]);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") respond(false, "Invalid request.", 405);

$data = json_decode(file_get_contents("php://input"), true);
$name  = trim($data["name"] ?? "");
$email = strtolower(trim($data["email"] ?? ""));
$pass  = $data["password"] ?? "";
$role  = $data["role"] ?? "";

if ($name === "" || !filter_var($email, FILTER_VALIDATE_EMAIL)) respond(false, "Enter a valid name and email.", 400);
if (strlen($pass) < 8) respond(false, "Password must be at least 8 characters.", 400);
if (!in_array($role, ["agency", "client"], true)) respond(false, "Invalid account type.", 400);

$stmt = $conn->prepare("SELECT user_id FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows > 0) respond(false, "This email is already registered.", 409);
$stmt->close();

$hash = password_hash($pass, PASSWORD_DEFAULT);
$stmt = $conn->prepare("INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)");
$stmt->bind_param("ssss", $name, $email, $hash, $role);
if (!$stmt->execute()) respond(false, "Could not create account.", 500);

respond(true, "Registration successful. Please log in.");