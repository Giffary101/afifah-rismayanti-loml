# Website Ucapan Spesial - Afifah Rismayanti 🌸

Website interaktif ucapan selamat ulang tahun / anniversary bernuansa romantis dan elegan, dengan tema utama **Love Pink** (`#ff8cc6`), dipadukan dengan palet **Pink Blossom** serta **Klise Roll Film 35mm Retro**.

---

## 📁 Struktur Folder Proyek yang Rapi & Modular:

```text
Proyek Ucapan/
│
├── index.html            # Layar 1: Gerbang Verifikasi (Your Email & Kunci) & Amplop Interaktif
├── main.html             # Layar 2: Halaman "Selamat Datang Cintaku" & Menu Kejutan
├── letter.html           # Layar 3: Buku Catatan Kecil (Surat & Doa Mendalam)
├── timeline.html         # Layar 4: Klise Roll Film 35mm Kenangan
├── verify.html           # Layar 5: Panel Verifikasi Kunci Manual oleh Pemilik (Admin)
│
├── css/                  # Direktori Stylesheet Terpisah
│   ├── global.css        # Variabel warna, reset dasar, tombol audio, & palet umum
│   ├── gate.css          # Styling formulir gerbang verifikasi (login-like card)
│   ├── envelope.css      # Styling animasi 3D amplop, segel hati, dan surat
│   ├── main.css          # Styling halaman utama "Selamat Datang Cintaku" & kartu menu
│   ├── letter.css        # Styling buku catatan kecil realistis, cover kulit & garis kertas
│   ├── timeline.css      # Styling klise film 35mm amber/oranye, sprocket, & roll kenangan
│   └── verify.css        # Styling panel verifikasi manual admin
│
├── js/                   # Direktori Script Logika Terpisah
│   ├── config.js         # Konfigurasi Supabase Database & EmailJS
│   ├── gate.js           # Logika gerbang akses & pendengar status verifikasi real-time
│   ├── letter.js         # Logika buka buku catatan, efek balik halaman & nomor navigasi
│   ├── verify.js         # Logika panel verifikasi manual (tombol setujui/tolak kunci)
│   ├── audio.js          # Web Audio API (efek harpa, pop, shutter kamera, & page flip)
│   ├── ambient.js        # Animasi kelopak bunga sakura & hati di kanvas latar
│   ├── envelope.js       # Logika pembuka amplop & navigasi ke main.html
│   └── timeline.js       # Logika roll film 35mm & dynamic background
│
├── database/             # Direktori Database SQL
│   └── schema.sql        # Skrip pembuatan tabel PostgreSQL / Supabase
│
├── images/               # Direktori Foto & Aset
│   └── CARA_GANTI_FOTO.txt # Panduan mengganti foto pribadi
│
└── README.md             # Dokumentasi proyek
```

---

## 🗺️ Alur Halaman Website:

1. **`index.html` (Layar 1: Amplop Romantis 💌)**
   - Desain amplop 3D estetik dengan segel hati merah muda berdenyut (*"Klik Aku 💖"*).
   - Saat diklik: Animasi amplop membuka, letupan partikel bunga sakura, suara harpa lembut.
   - Pesan surat:
     - *"Selamat Datang,"*
     - **"Afifah Rismayanti"**
     - *“Wanita pejuang peraih mimpi”*
   - Tombol: *"Buka Halaman Utama ✨"* (mengarah ke `main.html`).

2. **`main.html` (Layar 2: "Selamat Datang Cintaku" 💖)**
   - Menampilkan kartu ucapan utama yang hangat:
     - *"Selamat Datang Cintaku"*
     - *"Selamat datang di halaman utama ucapan spesialmu, My Love."*
   - Kotak Pengumuman Kejutan dengan daftar menu:
     - ✨ Surat & Doa Mendalam untuk sang pejuang mimpi
     - 📸 Galeri Foto Kenangan Indah berbingkai manis
     - ⏳ **Hitung Mundur / Timeline Perjalanan cinta & cita-cita** *(Interaktif, klik untuk membuka `timeline.html`!)*
     - 🎵 Pemutar Musik Favorit bernuansa romantis
   - Palet warna lengkap di bagian bawah.
   - Tombol *"← Lihat Amplop Kembali"* untuk kembali ke `index.html`.

3. **`timeline.html` (Layar 3: Klise Roll Film 35mm & Hitung Mundur 🎞️)**
   - **Bentuk Klise Film 35mm Persis Seperti Gambar**:
     - Berwarna oranye/amber transparan khas pita klise negatif analog 35mm.
     - Lubang sprocket gerigi persegi panjang di atas dan bawah yang tembus cahaya putih (*backlight effect*).
     - Cap teks analog dan nomor frame khas klise film (*KODAK COLOR 200, ▶ 19, ▶ 19A, SAFETY FILM*).
   - **Aturan Filter Foto**:
     - **Foto yang tidak dipilih**: Diberi **filter coklat vintage nostalgik** layaknya klise film lama.
     - **Foto yang dipilih**: Menampilkan **foto aslinya tanpa filter**, jernih, cerah, dan membesar secara anggun.
   - **Tanggal di Kanan Atas Foto**:
     - Stempel tanggal kamera analog LED oranye/emas (`'23 05 12`, `'24 11 02`).
   - **Deskripsi Cerita**: Judul dan cerita narasi di setiap frame foto.
   - **Latar Belakang Sinematik**: Latar belakang halaman secara dinamis berganti mengikuti foto yang dipilih dengan filter coklat vintage.
   - **Hitung Mundur (Countdown Timer)**: Hari, Jam, Menit, Detik menuju momen bahagia.
   - **Tombol Kembali**: *"← Kembali ke Menu Utama"* untuk kembali ke `main.html`.

---

## 📷 Cara Mengganti Foto Pribadi:
1. Masukkan file foto Anda ke dalam folder `images/` (misal: `images/foto1.jpg`, `foto2.jpg`, dst).
2. Buka file `js/timeline.js`, sesuaikan daftar `timelineMoments` pada bagian `image`, `dateStamp`, `title`, dan `desc`.
3. Buka `index.html` di browser Anda!
