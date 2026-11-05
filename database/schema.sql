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
    status TEXT DEFAULT 'pending' NOT NULL, -- 'pending', 'approved', 'rejected'
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Tambah kolom status jika tabel sudah pernah dibuat sebelumnya
ALTER TABLE access_logs ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending' NOT NULL;

-- 2. Aktifkan Row Level Security (RLS) untuk keamanan data
ALTER TABLE access_logs ENABLE ROW LEVEL SECURITY;

-- 3. Kebijakan (Policy) agar form publik bisa memasukkan data (INSERT)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'access_logs' AND policyname = 'Izinkan pengunjung mengisi form access_logs'
    ) THEN
        CREATE POLICY "Izinkan pengunjung mengisi form access_logs"
        ON access_logs FOR INSERT TO anon, authenticated
        WITH CHECK (true);
    END IF;
END $$;

-- 4. Kebijakan (Policy) membaca data untuk verifikasi dan pengecekan status
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'access_logs' AND policyname = 'Izinkan baca data access_logs'
    ) THEN
        CREATE POLICY "Izinkan baca data access_logs"
        ON access_logs FOR SELECT TO anon, authenticated
        USING (true);
    END IF;
END $$;

-- 5. Kebijakan (Policy) untuk tombol manual verifikasi di halaman verify.html (UPDATE)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'access_logs' AND policyname = 'Izinkan update status verifikasi'
    ) THEN
        CREATE POLICY "Izinkan update status verifikasi"
        ON access_logs FOR UPDATE TO anon, authenticated
        USING (true)
        WITH CHECK (true);
    END IF;
END $$;

-- ========================================================
-- TIPS MELIHAT DATA:
-- Buka halaman verify.html di browser Anda untuk memverifikasi secara langsung!
-- Atau di Supabase Dashboard: klik 'Table Editor' -> 'access_logs'
-- ========================================================
