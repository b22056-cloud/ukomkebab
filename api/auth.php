<?php
// api/auth.php
session_start(); // Mulai sesi di server
header("Content-Type: application/json"); 
require 'koneksi.php';

$action = $_GET['action'] ?? '';

if ($action == 'register') {
    // Sanitasi spasi berlebih
    $nama_depan = trim($_POST['nama_depan'] ?? '');
    $nama_belakang = trim($_POST['nama_belakang'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';

    // Validasi data kosong
    if(empty($email) || empty($password) || empty($nama_depan)) {
        echo json_encode(["status" => "error", "message" => "Data wajib diisi!"]);
        exit;
    }

    // Validasi format email murni
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(["status" => "error", "message" => "Format email tidak valid!"]);
        exit;
    }

    // Cek email terdaftar
    $stmt = $conn->prepare("SELECT id FROM user WHERE email = ?");
    $stmt->execute([$email]);
    if($stmt->rowCount() > 0) {
        echo json_encode(["status" => "error", "message" => "Email sudah terdaftar!"]);
        exit;
    }

    $hashed_password = password_hash($password, PASSWORD_DEFAULT);
    
    $sql = "INSERT INTO user (nama_depan, nama_belakang, email, password, role_id, aktif) VALUES (?, ?, ?, ?, 2, 'Y')";
    $stmt = $conn->prepare($sql);
    
    if ($stmt->execute([$nama_depan, $nama_belakang, $email, $hashed_password])) {
        echo json_encode(["status" => "success", "message" => "Registrasi berhasil, silakan login!"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Gagal melakukan registrasi."]);
    }
} 
elseif ($action == 'login') {
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';

    $stmt = $conn->prepare("SELECT * FROM user WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && password_verify($password, $user['password'])) {
        if ($user['aktif'] == 'T') {
            echo json_encode(["status" => "error", "message" => "Akun Anda tidak aktif."]);
            exit;
        }
        
        // Simpan data di sesi server
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['role_id'] = $user['role_id'];
        
        echo json_encode([
            "status" => "success", 
            "message" => "Login berhasil!", 
            "data" => [
                "id" => $user['id'],
                "nama_depan" => $user['nama_depan'],
                "role_id" => $user['role_id']
            ]
        ]);
    } else {
        echo json_encode(["status" => "error", "message" => "Email atau password salah!"]);
    }
} 
elseif ($action == 'logout') {
    // Hapus sesi di backend
    session_unset();
    session_destroy();
    echo json_encode(["status" => "success", "message" => "Logout berhasil."]);
} 
else {
    echo json_encode(["status" => "error", "message" => "Aksi tidak ditemukan."]);
}
?>