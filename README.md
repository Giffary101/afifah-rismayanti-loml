# Website Ucapan Spesial - Afifah Rismayanti 🌸

Website interaktif ucapan selamat ulang tahun / anniversary bernuansa romantis dan elegan, dengan tema utama **Love Pink** (`#ff8cc6`) dipadukan dengan palet **Pink Blossom** serta **Roll Film Retro 35mm**.

## 🎨 Paduan Palet Warna yang Digunakan:
1. **Primary Love Pink**: `#ff8cc6` — Warna merah muda ceria dan manis sesuai permintaan.
2. **Deep Rose / Berry**: `#e85d9e` & `#c93b7e` — Memberi kedalaman kontras pada tombol dan judul.
3. **Soft Blossom & Blush**: `#ffeaf3` & `#fff6fa` — Nuansa kelopak bunga lembut untuk kartu pesan dan latar belakang.
4. **Warm Gold & Amber Vintage**: `#ffd166` & `#ff9d3b` — Sentuhan kemilau elegan pada stempel tanggal kamera analog dan partikel bintang.
5. **Plum Velvet & Vintage Film Black**: `#4a2839` & `#0c0a0c` — Warna casing roll film 35mm dan teks kontras tinggi yang hangat.

---

## ✨ Fitur-Fitur Lengkap:

### 1. Tampilan Awal Amplop Romantis 💌
- Desain amplop lipat 3D yang estetik dengan bayangan realistis.
- **Segel Hati Merah Muda (`#ff8cc6`)**: Memiliki efek denyut (*heart pulse*) dan tombol interaktif bertuliskan *"Klik Aku 💖"*.
- **Animasi Buka Amplop**:
  - Tutup atas amplop melipat ke atas secara realistis (`3D transform: rotateX(180deg)`).
  - Letupan partikel hati & kelopak bunga sakura (*burst effect*).
  - Efek suara lonceng harpa lembut (*Web Audio chime & pop*).
- **Isi Surat Spesial**:
  - *"Selamat Datang,"*
  - **"Afifah Rismayanti"**
  - *“Wanita pejuang peraih mimpi”*
- **Tombol Menuju Halaman Utama**:
  - Tombol romantis berkilau bertuliskan *"Buka Halaman Utama ✨"*.

### 2. Hitung Mundur (Countdown Timer) ⏳
- Menghitung mundur (Hari, Jam, Menit, Detik) menuju hari perayaan spesial.
- Desain bergaya retro vintage dengan angka berukuran besar dan efek bayangan lembut.
- Tanggal target dapat disesuaikan dengan mudah di dalam file `script.js`.

### 3. Timeline Perjalanan Roll Film Retro Masa Lalu 🎞️
- **Desain Roll Film 35mm Autentik**:
  - Terletak di bagian tengah memanjang secara horizontal dari kiri ke kanan.
  - Memiliki pinggiran roll hitam klasik lengkap dengan lubang sprocket film (*perforations*) serta cap teks analog (*KODAK GOLD 200, 35mm, Frame Code*).
- **Aturan Filter Foto Sesuai Permintaan**:
  - **Foto yang tidak dipilih**: Diberi **filter coklat vintage nostalgik** (*sepia brown vintage*), sedikit redup.
  - **Foto yang dipilih (Aktif)**: Menampilkan **foto aslinya tanpa filter**, cerah, jernih, dan membesar secara anggun.
- **Tanggal di Kanan Atas Foto**:
  - Menggunakan gaya stempel tanggal kamera analog LED oranye/emas (`'23 05 12`, `'24 11 02`, dst).
- **Deskripsi Cerita Perjalanan**:
  - Setiap roll film dilengkapi judul momen dan narasi perjalanan cinta serta perjuangan meraih mimpi.
- **Cara Pemilihan Interaktif**:
  - Dapat di-scroll dari kiri ke kanan (atau klik foto manapun, atau gunakan tombol panah *Sebelumnya / Selanjutnya*).
  - Dilengkapi efek animasi perpindahan mulus serta suara mekanik putaran film kamera analog (*camera shutter & film advance*).
- **Latar Belakang Dinamis**:
  - Latar belakang halaman secara otomatis mengikuti foto yang sedang dipilih dan diproses dengan **filter coklat vintage nostalgik** buram yang sangat sinematik.

---

## 📷 Cara Mengganti Foto Pribadi:
1. Masukkan file foto Anda dan Afifah ke dalam folder `images/` (misalnya: `images/foto1.jpg`, `foto2.jpg`, dst).
2. Buka `script.js` dan sesuaikan daftar `timelineMoments` pada bagian `image`, `dateStamp`, `title`, dan `desc`.
3. Simpan dan buka `index.html`!
