<?php

require_once "db.php";

echo "<h1>ApprovalFlow Database Connection</h1>";

echo "<h2 style='color:green;'>
Database Connected Successfully!
</h2>";

echo "<p>PHP is successfully communicating with MySQL.</p>";

$result = $conn->query("SHOW TABLES");

echo "<h3>Available Database Tables:</h3>";

while ($row = $result->fetch_array()) {
    echo $row[0] . "<br>";
}

$conn->close();

?>