const namaBarang = document.getElementById("nama-barang");
const hargaBarang = document.getElementById("harga-barang");
const stokBarang = document.getElementById("stok-barang");
const tambahBarangBtn = document.getElementById("tambah-barang");

const barangSelect = document.getElementById("barang");
const jumlahInput = document.getElementById("jumlah");
const tambahBtn = document.getElementById("tambah");

const tabelTransaksi = document.querySelector("#tabel-transaksi tbody");
const tabelBarang = document.querySelector("#tabel-barang tbody");
const totalBayarSpan = document.getElementById("total-bayar");
const resetBtn = document.getElementById("reset");
const cetakBtn = document.getElementById("cetak");

let daftarBarang = JSON.parse(localStorage.getItem("daftarBarang")) || [];
let transaksi = [];
let totalBayar = 0;

// Render daftar barang
function renderBarang() {
  barangSelect.innerHTML = "";
  tabelBarang.innerHTML = "";

  daftarBarang.forEach((b, i) => {
    // dropdown
    const option = document.createElement("option");
    option.value = i;
    option.textContent = `${b.nama} (Stok: ${b.stok}) - Rp${b.harga.toLocaleString()}`;
    option.dataset.harga = b.harga;
    barangSelect.appendChild(option);

    // tabel stok
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${b.nama}</td>
      <td>Rp${b.harga.toLocaleString()}</td>
      <td>${b.stok}</td>
    `;
    tabelBarang.appendChild(tr);
  });

  localStorage.setItem("daftarBarang", JSON.stringify(daftarBarang));
}

// Tambah barang baru
tambahBarangBtn.addEventListener("click", () => {
  const nama = namaBarang.value.trim();
  const harga = parseInt(hargaBarang.value);
  const stok = parseInt(stokBarang.value);

  if (!nama || isNaN(harga) || isNaN(stok) || harga <= 0 || stok <= 0) {
    alert("Isi nama, harga, dan stok dengan benar!");
    return;
  }

  daftarBarang.push({ nama, harga, stok });
  renderBarang();

  namaBarang.value = "";
  hargaBarang.value = "";
  stokBarang.value = "";
});

// Tambah transaksi
tambahBtn.addEventListener("click", () => {
  const index = barangSelect.value;
  const jumlah = parseInt(jumlahInput.value);
  const barang = daftarBarang[index];

  if (!barang) {
    alert("Pilih barang dulu!");
    return;
  }

  if (jumlah <= 0 || isNaN(jumlah)) {
    alert("Jumlah tidak valid!");
    return;
  }

  if (jumlah > barang.stok) {
    alert("Stok tidak mencukupi!");
    return;
  }

  // Kurangi stok
  barang.stok -= jumlah;

  // Tambah ke transaksi
  transaksi.push({
    nama: barang.nama,
    harga: barang.harga,
    jumlah
  });

  renderBarang();
  renderTransaksi();
});

// Render transaksi
function renderTransaksi() {
  tabelTransaksi.innerHTML = "";
  totalBayar = 0;

  transaksi.forEach((t, i) => {
    const subtotal = t.harga * t.jumlah;
    totalBayar += subtotal;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${t.nama}</td>
      <td>Rp${t.harga.toLocaleString()}</td>
      <td>${t.jumlah}</td>
      <td>Rp${subtotal.toLocaleString()}</td>
      <td><button class="hapus" data-index="${i}">Hapus</button></td>
    `;
    tabelTransaksi.appendChild(tr);
  });

  totalBayarSpan.textContent = `Rp${totalBayar.toLocaleString()}`;
  localStorage.setItem("daftarBarang", JSON.stringify(daftarBarang));
}

// Hapus item transaksi
tabelTransaksi.addEventListener("click", (e) => {
  if (e.target.classList.contains("hapus")) {
    const index = e.target.dataset.index;
    const t = transaksi[index];

    // Balikin stok
    const barang = daftarBarang.find(b => b.nama === t.nama);
    if (barang) barang.stok += t.jumlah;

    transaksi.splice(index, 1);
    renderBarang();
    renderTransaksi();
  }
});

// Reset semua transaksi
resetBtn.addEventListener("click", () => {
  if (confirm("Yakin mau hapus semua transaksi?")) {
    transaksi = [];
    renderTransaksi();
  }
});

// Cetak struk
cetakBtn.addEventListener("click", () => {
  if (transaksi.length === 0) {
    alert("Belum ada transaksi!");
    return;
  }

  const waktu = new Date().toLocaleString("id-ID");
  let struk = "=== STRUK PEMBELIAN ===\n" + waktu + "\n\n";

  transaksi.forEach(t => {
    struk += `${t.nama} x${t.jumlah} - Rp${(t.harga * t.jumlah).toLocaleString()}\n`;
  });

  struk += `\nTotal Bayar: Rp${totalBayar.toLocaleString()}\n=======================\nTerima Kasih!`;

  alert(struk);
});

renderBarang();
renderTransaksi();



