-- ========================================================
-- SCHEMA DATABASE SUPABASE UNTUK FORM GERBANG AKSES
-- ========================================================
-- Jalankan skrip SQL ini di Supabase SQL Editor:
-- Dashboard Supabase -> SQL Editor -> New Query -> Run
-- ========================================================

-- 1. Buat tabel 'access_logs' untuk menampung input 'Your Email' dan 'Kunci'
CREATE TABLE IF NOT EXISTS access_logs (
    id BIGSERIAL PRIMARY KEY,
    email TEXT NOT NULL,
    kunci TEXT NOT NULL,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 2. Aktifkan Row Level Security (RLS) untuk keamanan data
ALTER TABLE access_logs ENABLE ROW LEVEL SECURITY;

-- 3. Kebijakan (Policy) agar form publik dari website GitHub Pages
--    bisa memasukkan data (INSERT) menggunakan Public Anon Key
CREATE POLICY "Izinkan pengunjung mengisi form access_logs"
ON access_logs
FOR INSERT
TO anon
WITH CHECK (true);

-- 4. Kebijakan (Policy) membaca data:
--    Hanya pengguna terautentikasi (Anda sebagai admin di dashboard Supabase)
--    atau anon jika Anda ingin melihat daftar yang sudah masuk.
CREATE POLICY "Izinkan admin melihat data access_logs"
ON access_logs
FOR SELECT
TO authenticated, anon
USING (true);

-- ========================================================
-- TIPS MELIHAT DATA:
-- Di Supabase Dashboard, klik menu 'Table Editor' -> 'access_logs'
-- Semua email dan kunci yang diisi pengunjung akan langsung muncul di sana!
-- ========================================================

