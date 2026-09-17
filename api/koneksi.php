<?php
// api/koneksi.php

$host = "localhost";
$user = "root";
$pass = ""; // Kosongkan jika default Laragon/XAMPP
$db   = "db_kebab"; // Sesuaikan dengan nama database Anda

try {
    $conn = new PDO("mysql:host=$host;dbname=$db", $user, $pass);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    // Log error secara internal (disimpan di log server, tidak ditampilkan ke user)
    error_log("Koneksi DB Gagal: " . $e->getMessage());
    
    // Kembalikan error aman dalam format JSON
    header("Content-Type: application/json");
    echo json_encode(["status" => "error", "message" => "Terjadi kesalahan pada koneksi server."]);
    exit();
}
?>