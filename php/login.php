<?php
header("Content-Type: application/json");
ini_set('display_errors', 0);
require_once __DIR__ . "/db.php";

$data  = json_decode(file_get_contents("php://input"), true);
$email = strtolower(trim($data["email"] ?? ""));
$pass  = $data["password"] ?? "";

$stmt = $conn->prepare("SELECT user_id, name, email, password_hash, role FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$user = $stmt->get_result()->fetch_assoc();

if (!$user || !password_verify($pass, $user["password_hash"])) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Invalid email or password."]);
    exit;
}

echo json_encode([
    "success" => true,
    "user" => [
        "id"    => $user["user_id"],
        "name"  => $user["name"],
        "email" => $user["email"],
        "role"  => $user["role"]
    ]
]);