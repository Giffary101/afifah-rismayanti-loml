/**
 * Logika Gerbang Form Verifikasi Akses & Integrasi Database Supabase
 * Menampung input 'Your Email' (type: email) dan 'Kunci' (type: string)
 */

document.addEventListener('DOMContentLoaded', () => {
  const gateSection = document.getElementById('gate-section');
  const envelopeSection = document.getElementById('envelope-section');
  const gateForm = document.getElementById('gate-form');
  const gateEmailInput = document.getElementById('gate-email');
  const gateKunciInput = document.getElementById('gate-kunci');
  const gateSubmitBtn = document.getElementById('gate-submit-btn');
  const gateBtnText = document.getElementById('gate-btn-text');
  const gateStatus = document.getElementById('gate-status');

  // Cek apakah halaman ini memiliki elemen gate
  if (!gateSection || !gateForm) return;

  // Inisialisasi Supabase Client jika SDK dan konfigurasi tersedia
  let supabaseClient = null;
  const config = window.SUPABASE_CONFIG || {};

  const isConfigValid = config.url && 
                        config.anonKey && 
                        !config.url.includes('YOUR_PROJECT_ID') &&
                        !config.anonKey.includes('YOUR_ANON');

  if (window.supabase && isConfigValid) {
    try {
      supabaseClient = window.supabase.createClient(config.url, config.anonKey);
      console.log('✅ Supabase Client berhasil terhubung.');
    } catch (err) {
      console.warn('⚠️ Gagal menginisialisasi Supabase Client:', err);
    }
  } else {
    console.info('ℹ️ Supabase menggunakan konfigurasi default / demo. Data akan dicatat ke localStorage lokal hingga Project URL & Anon Key diatur.');
  }

  // Tampilkan pesan status
  function setStatus(message, type = 'info') {
    if (!gateStatus) return;
    gateStatus.textContent = message;
    gateStatus.className = `gate-status-msg ${type}`;
  }

  // Fungsi Transisi: Tutup Form Gerbang & Tampilkan Amplop
  function revealEnvelope() {
    setStatus('Kunci diterima! Membuka amplop... 💖', 'success');

    // Mainkan efek suara
    if (window.AudioApp) {
      window.AudioApp.init();
      window.AudioApp.playPop();
      setTimeout(window.AudioApp.playChime, 180);
    }

    // Efek partikel konfeti jika fungsi partikel tersedia
    if (window.createBurstParticles && gateSubmitBtn) {
      const rect = gateSubmitBtn.getBoundingClientRect();
      window.createBurstParticles(rect.left + rect.width / 2, rect.top + rect.height / 2, 45);
    }

    // Animasi keluar kartu gerbang
    gateSection.classList.add('exit');

    setTimeout(() => {
      gateSection.style.display = 'none';
      if (envelopeSection) {
        envelopeSection.classList.remove('gate-hidden');
        envelopeSection.classList.add('gate-revealed');
      }
    }, 450);
  }

  // Submit Handler Form Gerbang
  gateForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const emailValue = (gateEmailInput?.value || '').trim();
    const kunciValue = (gateKunciInput?.value || '').trim();

    // Validasi dasar
    if (!emailValue) {
      setStatus('Silakan masukkan email Anda.', 'error');
      gateEmailInput?.focus();
      return;
    }

    if (!kunciValue) {
      setStatus('Silakan tuliskan kunci rahasia.', 'error');
      gateKunciInput?.focus();
      return;
    }

    // Set UI Loading
    if (gateSubmitBtn) gateSubmitBtn.disabled = true;
    if (gateBtnText) gateBtnText.textContent = 'Menyimpan...';
    setStatus('Menyimpan ke database... ⏳', 'loading');

    const payload = {
      email: emailValue,
      kunci: String(kunciValue),
      user_agent: navigator.userAgent,
      created_at: new Date().toISOString()
    };

    let savedSuccessfully = false;

    // 1. Simpan ke Supabase jika sudah terhubung
    if (supabaseClient) {
      try {
        const tableName = config.tableName || 'access_logs';
        const { data, error } = await supabaseClient
          .from(tableName)
          .insert([
            {
              email: payload.email,
              kunci: payload.kunci,
              user_agent: payload.user_agent
            }
          ]);

        if (error) {
          console.error('❌ Error simpan ke Supabase:', error);
          setStatus(`Tersimpan lokal (${error.message || 'Supabase error'})`, 'info');
        } else {
          console.log('🎉 Data berhasil tersimpan di tabel Supabase:', payload);
          savedSuccessfully = true;
        }
      } catch (err) {
        console.error('❌ Terjadi pengecualian saat request Supabase:', err);
      }
    }

    // 2. Selalu simpan juga ke LocalStorage sebagai backup lokal
    try {
      const existingLogs = JSON.parse(localStorage.getItem('access_logs') || '[]');
      existingLogs.push(payload);
      localStorage.setItem('access_logs', JSON.stringify(existingLogs));
      localStorage.setItem('last_user_email', emailValue);
      localStorage.setItem('last_user_kunci', kunciValue);
      sessionStorage.setItem('gate_passed', 'true');
      console.log('💾 Backup data tersimpan di LocalStorage.');
    } catch (err) {
      console.warn('Gagal menyimpan ke LocalStorage:', err);
    }

    // Reset Tombol
    if (gateSubmitBtn) gateSubmitBtn.disabled = false;
    if (gateBtnText) gateBtnText.textContent = 'Buka Amplop';

    // Beri jeda manis 400ms agar pengunjung melihat konfirmasi, lalu buka amplop!
    setTimeout(() => {
      revealEnvelope();
    }, 400);
  });
});

