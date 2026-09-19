# 🌾 UKOM RAMA - sistem penjualan kebab

[![PHP](https://img.shields.io/badge/PHP-8.2.12-777BB4?style=flat-square&logo=php)](https://www.php.net/)
[![MySQL](https://img.shields.io/badge/MySQL-Database-4479A1?style=flat-square&logo=mysql)](https://www.mysql.com/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-7952B3?style=flat-square&logo=bootstrap)](https://getbootstrap.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=flat-square&logo=javascript)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)

Aplikasi Web Manajen kebab **Native PHP REST API** dan **Frontend JavaScript ES6**. Proyek ini dikembangkan sebagai tugas Soal Praktik **Uji Kompetensi Keahlian (UKOM)** Skema **Junior Web Programmer**.

---

## 📌 Identitas Peserta & Proyek

* **Tanggal Uji:** 19 September 2026
* **Nama Proyek:** `ukomrama`
* **Arsitektur:** Restful API (Backend Native PHP) + Single Page Client (JS ES6 & Bootstrap 5)
* **Repositori GitHub:** [https://github.com/ukomrama](https://github.com/ukomrama)

---

## ✨ Fitur Utama Aplikasi

1. **Autentikasi User**
   * Login pengguna & validasi sesi.
   * Logout dengan pembersihan token/sesi.
2. **Manajemen Data Produk (CRUD)**
   * **Create:** Tambah data produk panen baru (nama, kategori, jumlah, harga, status).
   * **Read:** Tampilkan data secara dinamis dari database via Async Fetch API.
   * **Update:** Ubah informasi data produk.
   * **Delete:** Hapus data produk dengan konfirmasi pop-up interaktif.
3. **Pencarian, Filter & Sorting Data**
   * Pencarian kata kunci real-time.
   * Filter data berdasarkan kategori produk.
   * Pengurutan data (nama, jumlah, tanggal).
4. **Antarmuka Interaktif & Responsif**
   * Desain responsif menggunakan Bootstrap 5.
   * Dialog konfirmasi & notifikasi interaktif menggunakan SweetAlert2.

---

## 🛠️ Teknologi & Library yang Digunakan

### **Backend & Database**
* **PHP 8.2+** (Native REST API dengan format respon JSON)
* **MySQL** (Database Server)

### **Frontend & UI**
* **HTML5 & CSS3** (Custom Styling via `assets/style.css`)
* **JavaScript ES6+** (`Fetch API`, `Promises`, `Async/Await`, `DOM Manipulation`)
* **Bootstrap 5.3** (UI Layout & Components via CDN)
* **SweetAlert2** (Modal & Pop-up Notification via CDN)

### **Tools & Environment**
* **XAMPP Control Panel** (Apache Server & MySQL Engine)
* **Visual Studio Code** (IDE / Code Editor)
* **Google Chrome & DevTools** (Debugging & Console Inspection)
* **Git & GitHub** (Version Control System)

---

## 📁 Struktur Direktori Proyek

```text
ukomrama/
├── api/                   # Endpoint Backend PHP REST API
│   ├── auth.php           # Handler Autentikasi & Sesi
│   ├── koneksi.php        # Driver & Konfigurasi Database MySQL
│   └── produk.php         # Endpoint REST API CRUD Data Produk
├── assets/                # Statis Resource Client-side
│   ├── app.js             # Logic Frontend, Fetch API Client, Event Listeners
│   └── style.css          # Custom CSS Theme & UI Improvements
├── index.html             # Halaman Login & Landing
├── dashboard.html         # Antarmuka Utama Manajemen Data
└── README.md              # Dokumentasi & Petunjuk Penggunaan
```

---

## ⚙️ Petunjuk Instalasi & Jalankan Proyek

### 1. Persyaratan Sistem
Pastikan komputer Anda telah terpasang:
* [XAMPP](https://www.apachefriends.org/) (PHP >= 8.0 & MySQL)
* Browser Web Modern (Google Chrome / Microsoft Edge)
* Git (Opsional)

### 2. Unduh / Clone Repositori
Pindahkan direktori proyek ke dalam folder `htdocs` XAMPP Anda:
```bash
cd C:/xampp/htdocs/
git clone https://github.com/ukomrama/ukomrama.git
```

### 3. Konfigurasi Database
1. Jalankan **XAMPP Control Panel** dan aktifkan Service **Apache** dan **MySQL**.
2. Buka browser dan akses **phpMyAdmin** (`http://localhost/phpmyadmin`).
3. Buat database baru dengan nama `db_ukomrama`.
4. Import struktur tabel berikut atau gunakan fitur SQL Query:

```sql
CREATE DATABASE IF NOT EXISTS `db_ukomrama`;
USE `db_ukomrama`;

-- Tabel Users
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Produk Panen
CREATE TABLE IF NOT EXISTS `produk` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nama_produk` VARCHAR(100) NOT NULL,
  `kategori` VARCHAR(50) NOT NULL,
  `jumlah` INT NOT NULL DEFAULT 0,
  `harga` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `tanggal_panen` DATE NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed Default Admin User (Password: admin123)
INSERT INTO `users` (`username`, `password`) 
VALUES ('admin', '$2y$10$w8T0mBqG.9vA8jZ3f9E4UuJ1K3/N5s6t7u8v9w0x1y2z3a4b5c6d');
```

### 4. Sesuaikan Koneksi Backend
Buka file `api/koneksi.php` dan pastikan konfigurasi kredensial sesuai dengan environment XAMPP Anda:
```php
<?php
$host = "localhost";
$user = "root";
$pass = "";
$dbname = "db_ukomrama";

$koneksi = new mysqli($host, $user, $pass, $dbname);

if ($koneksi->connect_error) {
    die(json_encode([
        "status" => false,
        "message" => "Koneksi database gagal: " . $koneksi->connect_error
    ]));
}
```

### 5. Akses Aplikasi
Buka browser dan jalankan URL berikut:
```text
http://localhost/ukomrama/index.html
```

---

## 📡 Dokumentasi Endpoint REST API (`api/produk.php`)

| Method | Endpoint | Deskripsi | Format Respon (JSON) |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/produk.php` | Mengambil seluruh data produk | `[{"id":1, "nama_produk":"Padi", ...}]` |
| **POST** | `/api/produk.php` | Menambahkan produk baru | `{"status": true, "message": "Data berhasil disimpan"}` |
| **PUT** | `/api/produk.php?id={id}` | Memperbarui data produk | `{"status": true, "message": "Data berhasil diperbarui"}` |
| **DELETE**| `/api/produk.php?id={id}` | Menghapus data produk | `{"status": true, "message": "Data berhasil dihapus"}` |

---

## 🎯 Pemetaan Unit Kompetensi (SKKNI Junior Web Programmer)

| No | Kode Unit | Judul Unit Kompetensi | Lokasi Implementasi dalam Proyek |
| :-: | :--- | :--- | :--- |
| 1 | **J.620100.011.01** | Melakukan instalasi software tools pemrograman | Pengaturan XAMPP (PHP 8.2, MySQL), VS Code Workspace, dan Git. |
| 2 | **J.620100.005.02** | Mengimplementasikan User Interface | Form input & tabel interaktif pada `index.html` dan `dashboard.html`. |
| 3 | **J.620100.017.02** | Mengimplementasikan pemrograman terstruktur | Logika percabangan `if-else` & loop `forEach` pada `assets/app.js`. |
| 4 | **J.620100.004.02** | Menggunakan struktur data | Pengolahan JSON response dan array object `dataPanen` (filter/sort). |
| 5 | **J.620100.019.02** | Menggunakan library / komponen pre-existing | Integrasi CDN Bootstrap 5 (Styling) & SweetAlert2 (Pop-up dialog). |
| 6 | **J.620100.016.01** | Menulis kode sesuai guidelines & best practices | *Separation of Concerns* (`api/` dan `assets/`), penulisan `camelCase`. |
| 7 | **J.620100.025.02** | Melakukan debugging | Penanganan error `try-catch` pada `fetch()` & inspeksi Chrome DevTools. |
| 8 | **J.620100.023.02** | Membuat dokumen kode program | Penulisan JSDoc komentar fungsi & penyusunan `README.md`. |

---

## 📝 Lisensi & Hak Cipta

Proyek ini dibuat untuk keperluan **Uji Kompetensi Keahlian (UKOM) Junior Web Programmer**. Hak cipta dilindungi undang-undang.
