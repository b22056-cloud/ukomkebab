const BASE_URL = 'api/';

function escapeHTML(str) {
    if (!str) return '';
    return str.toString()
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

async function fetchAPI(url, options) {
    const response = await fetch(url, options);
    if (!response.ok) {
        if (response.status === 401) {
            Swal.fire('Sesi Habis / Ditolak', 'Silakan login kembali.', 'warning').then(() => {
                logout();
            });
            throw new Error('Unauthorized');
        }
        throw new Error(`HTTP Error Status: ${response.status}`);
    }
    return response.json();
}

function cekSesiLogin() {
    const user = localStorage.getItem('user');
    if (!user && window.location.pathname.includes('dashboard.html')) {
        window.location.href = 'index.html';
    }
    if (user && window.location.pathname.includes('index.html')) {
        window.location.href = 'dashboard.html';
    }
}

function toggleAuth() {
    const loginBox = document.getElementById('loginBox');
    const regBox = document.getElementById('registerBox');
    if (loginBox.style.display === 'none') {
        loginBox.style.display = 'block';
        regBox.style.display = 'none';
    } else {
        loginBox.style.display = 'none';
        regBox.style.display = 'block';
    }
}

function handleRegister(event) {
    event.preventDefault();
    const formData = new FormData(document.getElementById('formRegister'));

    fetchAPI(BASE_URL + 'auth.php?action=register', { method: 'POST', body: formData })
    .then(result => {
        if (result.status === 'success') {
            Swal.fire('Berhasil!', result.message, 'success').then(() => {
                document.getElementById('formRegister').reset();
                toggleAuth();
            });
        } else {
            Swal.fire('Gagal!', result.message, 'error');
        }
    }).catch(error => console.error('Error:', error));
}

function handleLogin(event) {
    event.preventDefault();
    const formData = new FormData(document.getElementById('formLogin'));

    fetchAPI(BASE_URL + 'auth.php?action=login', { method: 'POST', body: formData })
    .then(result => {
        if (result.status === 'success') {
            localStorage.setItem('user', JSON.stringify(result.data));
            Swal.fire('Sukses!', 'Login berhasil, mengalihkan...', 'success').then(() => {
                window.location.href = 'dashboard.html';
            });
        } else {
            Swal.fire('Login Gagal', result.message, 'error');
        }
    }).catch(error => console.error('Error:', error));
}

function logout() {
    fetchAPI(BASE_URL + 'auth.php?action=logout', { method: 'GET' })
    .finally(() => {
        localStorage.removeItem('user');
        window.location.href = 'index.html';
    });
}

let globalProdukData = []; 

function muatDataProduk() {
    fetchAPI(BASE_URL + 'produk.php?action=read')
    .then(result => {
        if (result.status === 'success') {
            globalProdukData = result.data;
            renderTabelProduk(globalProdukData);
        }
    })
    .catch(error => console.error('Gagal memuat produk:', error));
}

function renderTabelProduk(dataArray) {
    const tbody = document.getElementById('tabelProdukBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (dataArray.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted">Tidak ada data produk.</td></tr>`;
        return;
    }

    dataArray.forEach((item, index) => {
        let tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${escapeHTML(item.nama_produk)}</td>
            <td>Rp ${Number(item.harga).toLocaleString()}</td>
            <td>${item.harga_diskon ? 'Rp ' + Number(item.harga_diskon).toLocaleString() : '-'}</td>
            <td>${escapeHTML(item.jumlah_stok)} pcs</td>
            <td>
                <button class="btn btn-sm btn-warning" onclick="siapkanEdit(${item.id})">Edit</button>
                <button class="btn btn-sm btn-danger" onclick="hapusProduk(${item.id})">Hapus</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function simpanProduk(event) {
    event.preventDefault();
    
    const id = document.getElementById('productId').value;
    const nama_produk = document.getElementById('nama_produk').value;
    const harga = document.getElementById('harga').value;
    const harga_diskon = document.getElementById('harga_diskon').value;
    const jumlah_stok = document.getElementById('jumlah_stok').value;

    if (harga < 0 || jumlah_stok < 0) {
        Swal.fire('Validasi Gagal', 'Harga dan stok tidak boleh bernilai negatif!', 'warning');
        return;
    }

    if (harga_diskon && Number(harga_diskon) >= Number(harga)) {
        Swal.fire('Validasi Gagal', 'Harga diskon tidak boleh lebih besar atau sama dengan harga normal!', 'warning');
        return; 
    }

    const formData = new FormData();
    formData.append('nama_produk', nama_produk);
    formData.append('harga', harga);
    if (harga_diskon) formData.append('harga_diskon', harga_diskon);
    formData.append('jumlah_stok', jumlah_stok);

    let endpoint = 'create';
    if (id) {
        endpoint = 'update';
        formData.append('id', id);
    }

    fetchAPI(BASE_URL + `produk.php?action=${endpoint}`, {
        method: 'POST',
        body: formData
    })
    .then(result => {
        if (result.status === 'success') {
            Swal.fire('Sukses!', result.message, 'success');
            document.getElementById('formProduk').reset();
            document.getElementById('productId').value = '';
            muatDataProduk();
        } else {
            Swal.fire('Gagal', result.message, 'error');
        }
    })
    .catch(error => console.error('Error:', error));
}

function hapusProduk(id) {
    Swal.fire({
        title: 'Apakah Anda yakin?',
        text: "Data produk yang dihapus tidak dapat dikembalikan!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Ya, Hapus!'
    }).then((result) => {
        if (result.isConfirmed) {
            const formData = new FormData();
            formData.append('id', id);

            fetchAPI(BASE_URL + 'produk.php?action=delete', {
                method: 'POST',
                body: formData
            })
            .then(res => {
                if (res.status === 'success') {
                    Swal.fire('Terhapus!', res.message, 'success');
                    muatDataProduk();
                } else {
                    Swal.fire('Gagal', res.message, 'error');
                }
            });
        }
    });
}

function jalankanFilter() {
    const kriteria = document.getElementById('kriteriaFilter').value;
    const nilai = document.getElementById('inputCari').value.toLowerCase();

    const hasilFilter = globalProdukData.filter(item => {
        if (!nilai || nilai.trim() === '') return true;

        if (kriteria === 'nama') {
            return item.nama_produk.toLowerCase().includes(nilai);
        } else if (kriteria === 'harga') {
            const hargaInput = Number(nilai);
            if (isNaN(hargaInput)) return false; 
            return Number(item.harga) <= hargaInput;
        } else if (kriteria === 'stok') {
            const stokInput = Number(nilai);
            if (isNaN(stokInput)) return false;
            return Number(item.jumlah_stok) >= stokInput;
        }
        return true;
    });

    renderTabelProduk(hasilFilter);
}

function siapkanEdit(id) {
    const produk = globalProdukData.find(item => item.id == id);
    if (produk) {
        document.getElementById('productId').value = produk.id;
        document.getElementById('nama_produk').value = produk.nama_produk;
        document.getElementById('harga').value = produk.harga;
        document.getElementById('harga_diskon').value = produk.harga_diskon || '';
        document.getElementById('jumlah_stok').value = produk.jumlah_stok;
    }
}

document.addEventListener('DOMContentLoaded', cekSesiLogin);