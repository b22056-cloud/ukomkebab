<?php
// api/produk.php
session_start();
header("Content-Type: application/json");
require 'koneksi.php';

// PROTEKSI ENDPOINT (Otorisasi)
// Jika tidak ada sesi user_id, blokir akses.
if (!isset($_SESSION['user_id'])) {
    http_response_code(401); // Set HTTP Status Code ke 401 Unauthorized
    echo json_encode(["status" => "error", "message" => "Akses ditolak. Silakan login terlebih dahulu!"]);
    exit();
}

$action = $_GET['action'] ?? 'read';

if ($action == 'read') {
    $stmt = $conn->query("SELECT * FROM product ORDER BY id DESC");
    $produk = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(["status" => "success", "data" => $produk]);
} 
elseif ($action == 'create' || $action == 'update') {
    // Sanitasi dan validasi tipe data dari input POST
    $nama_produk = trim($_POST['nama_produk'] ?? '');
    $harga = filter_var($_POST['harga'] ?? 0, FILTER_VALIDATE_FLOAT);
    $harga_diskon = !empty($_POST['harga_diskon']) ? filter_var($_POST['harga_diskon'], FILTER_VALIDATE_FLOAT) : NULL;
    $jumlah_stok = filter_var($_POST['jumlah_stok'] ?? 0, FILTER_VALIDATE_INT);
    $aktif = $_POST['aktif'] ?? 'Y';
    $id = $_POST['id'] ?? null;

    // Server-Side Validations
    if(empty($nama_produk) || $harga === false || $jumlah_stok === false || $harga < 0 || $jumlah_stok < 0) {
        echo json_encode(["status" => "error", "message" => "Data tidak valid atau kurang lengkap."]);
        exit;
    }
    if ($harga_diskon !== NULL && $harga_diskon >= $harga) {
        echo json_encode(["status" => "error", "message" => "Harga diskon harus lebih kecil dari harga normal."]);
        exit;
    }

    if ($action == 'create') {
        $sql = "INSERT INTO product (nama_produk, harga, harga_diskon, jumlah_stok, aktif) VALUES (?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        if($stmt->execute([$nama_produk, $harga, $harga_diskon, $jumlah_stok, $aktif])) {
            echo json_encode(["status" => "success", "message" => "Produk berhasil ditambahkan!"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Gagal menambahkan produk."]);
        }
    } 
    else { // Update
        $sql = "UPDATE product SET nama_produk=?, harga=?, harga_diskon=?, jumlah_stok=? WHERE id=?";
        $stmt = $conn->prepare($sql);
        if($stmt->execute([$nama_produk, $harga, $harga_diskon, $jumlah_stok, $id])) {
            echo json_encode(["status" => "success", "message" => "Data produk berhasil diperbarui!"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Gagal memperbarui data."]);
        }
    }
}
elseif ($action == 'delete') {
    $id = $_POST['id'] ?? '';
    $sql = "DELETE FROM product WHERE id = ?";
    $stmt = $conn->prepare($sql);
    
    if($stmt->execute([$id])) {
        echo json_encode(["status" => "success", "message" => "Produk berhasil dihapus!"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Gagal menghapus produk."]);
    }
}
?>