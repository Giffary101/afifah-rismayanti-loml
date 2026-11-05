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
  // Masukkan Project URL Supabase Anda di sini:
  url: 'https://YOUR_PROJECT_ID.supabase.co',

  // Masukkan Anon Public Key Supabase Anda di sini:
  anonKey: 'YOUR_ANON_PUBLIC_KEY',

  // Nama tabel yang menampung form (sesuai schema.sql)
  tableName: 'access_logs'
};

