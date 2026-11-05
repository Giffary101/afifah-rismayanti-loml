/**
 * Konfigurasi Database Supabase
 * 
 * CARA MENDAPATKAN SUPABASE URL & ANON KEY (GRATIS):
 * 1. Buka https://supabase.com dan login / daftar akun gratis.
 * 2. Klik "New Project" (beri nama misal: "proyek-ucapan").
 * 3. Buka menu Project Settings -> API.
 * 4. Salin "Project URL" ke `url` di bawah.
 * 5. Salin "anon public" Key ke `anonKey` di bawah.
 * 6. Jalankan file database/schema.sql di SQL Editor Supabase.
 */

window.SUPABASE_CONFIG = {
  // Project URL Supabase:
  url: 'https://ytjohwuhcbgebfteizwg.supabase.co',

  // Anon Public Key Supabase:
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0am9od3VoY2JnZWJmdGVpendnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM4NDUzOTksImV4cCI6MjEwOTQyMTM5OX0.nhekrw1H--lAXhzDhbLTSNje7VguUISjWZpznclkG0w',

  // Nama tabel yang menampung form (sesuai schema.sql)
  tableName: 'access_logs'
};

/**
 * Konfigurasi Layanan Pengiriman Email (EmailJS)
 * 
 * CARA MENDAPATKAN KUNCI EMAILJS (GRATIS):
 * 1. Daftar / Login di https://www.emailjs.com
 * 2. Menu "Email Services" -> Tambahkan Service Gmail Anda -> Salin "Service ID"
 * 3. Menu "Email Templates" -> Buat template baru -> Salin "Template ID"
 * 4. Menu "Account" (kanan atas) -> Tab "General" -> Salin "Public Key"
 */
window.EMAILJS_CONFIG = {
  // Service ID EmailJS:
  serviceId: 'Giffary101',

  // Template ID EmailJS:
  templateId: 'MyTemplate',

  // Public Key EmailJS:
  publicKey: 'mc6IRCLfYoXhrRl-r',

  // Informasi default pengirim & pesan
  fromName: 'Giffary 💖',
  subject: 'Selamat! Kunci Anda Telah Berhasil Diverifikasi 🌸',
  defaultMessage: 'Selamat telah berhasil masuk! Kunci rahasiamu telah disetujui oleh admin. Silakan kembali ke website untuk membuka amplop kejutan ini ✨'
};

