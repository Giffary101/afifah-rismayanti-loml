/**
 * Logika Gerbang Form Verifikasi Akses & Integrasi Database Supabase
 * Mendukung Verifikasi Manual oleh Manusia (verify.html)
 */

document.addEventListener('DOMContentLoaded', () => {
  const gateSection = document.getElementById('gate-section');
  const envelopeSection = document.getElementById('envelope-section');
  const gateCard = document.querySelector('.gate-card');
  const gateForm = document.getElementById('gate-form');
  const gateEmailInput = document.getElementById('gate-email');
  const gateKunciInput = document.getElementById('gate-kunci');
  const gateSubmitBtn = document.getElementById('gate-submit-btn');
  const gateBtnText = document.getElementById('gate-btn-text');
  const gateStatus = document.getElementById('gate-status');

  // Cek apakah halaman ini memiliki elemen gate
  if (!gateSection || !gateForm) return;

  // Cek apakah pengunjung sudah pernah diverifikasi di sesi ini
  if (sessionStorage.getItem('gate_passed') === 'true') {
    gateSection.style.display = 'none';
    if (envelopeSection) {
      envelopeSection.classList.remove('gate-hidden');
    }
    return;
  }

  // Inisialisasi Supabase Client jika SDK dan konfigurasi tersedia
  let supabaseClient = null;
  const config = window.SUPABASE_CONFIG || {};

  const cleanUrl = (config.url || '').replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '').trim();

  const isConfigValid = cleanUrl && 
                        config.anonKey && 
                        !cleanUrl.includes('YOUR_PROJECT_ID') &&
                        !config.anonKey.includes('YOUR_ANON');

  if (window.supabase && isConfigValid) {
    try {
      supabaseClient = window.supabase.createClient(cleanUrl, config.anonKey);
      console.log('✅ Supabase Client berhasil terhubung ke:', cleanUrl);
    } catch (err) {
      console.warn('⚠️ Gagal inisialisasi Supabase Client:', err);
    }
  }

  // Tampilkan pesan status
  function setStatus(message, type = 'info') {
    if (!gateStatus) return;
    gateStatus.textContent = message;
    gateStatus.className = `gate-status-msg ${type}`;
  }

  // Fungsi Transisi: Buka Amplop setelah Disetujui
  function revealEnvelope() {
    // Mainkan efek suara harpa & lonceng
    if (window.AudioApp) {
      window.AudioApp.init();
      window.AudioApp.playChime();
    }

    // Efek partikel konfeti
    if (window.createBurstParticles && gateCard) {
      const rect = gateCard.getBoundingClientRect();
      window.createBurstParticles(rect.left + rect.width / 2, rect.top + rect.height / 2, 50);
    }

    sessionStorage.setItem('gate_passed', 'true');

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

  // Tampilkan Layar Menunggu Verifikasi Manual
  function showWaitingScreen(payload, recordId) {
    if (!gateCard) return;

    // Simpan HTML asli form agar bisa dikembalikan jika batal
    const originalContent = gateCard.innerHTML;

    gateCard.innerHTML = `
      <div class="gate-waiting-box">
        <div class="waiting-spinner-pulse">⏳</div>
        <span class="gate-badge-tag">Menunggu Persetujuan</span>
        <h2 class="waiting-title">Menunggu Verifikasi Kunci</h2>
        <p class="waiting-desc">
          Permintaanmu telah terkirim! Pemilik sedang memverifikasi kuncimu secara manual. Begitu disetujui, halaman akan <strong>otomatis terbuka sendiri</strong> ✨
        </p>

        <div class="waiting-data-badge">
          <div>Email: <strong>${escapeHtml(payload.email)}</strong></div>
          <div>Kunci: <strong>${escapeHtml(payload.kunci)}</strong></div>
        </div>

        <div class="waiting-live-pulse">
          <span class="live-dot"></span> Sedang menunggu tombol verifikasi pemilik...
        </div>

        <button type="button" id="btn-cancel-wait" class="btn-subtle btn-cancel-wait">
          ← Ganti Kunci / Input Ulang
        </button>
      </div>
    `;

    // Tombol batalkan tunggu / input ulang
    const cancelBtn = document.getElementById('btn-cancel-wait');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        cleanupListener();
        gateCard.innerHTML = originalContent;
        // Re-attach listener
        attachSubmitHandler();
      });
    }

    // Dengarkan perubahan status secara Real-Time & Polling
    let pollInterval = null;
    let realtimeChannel = null;

    function cleanupListener() {
      if (pollInterval) clearInterval(pollInterval);
      if (realtimeChannel && supabaseClient) {
        supabaseClient.removeChannel(realtimeChannel);
      }
    }

    function handleStatus(newStatus) {
      if (newStatus === 'approved') {
        cleanupListener();
        const pulse = gateCard.querySelector('.waiting-live-pulse');
        if (pulse) {
          pulse.innerHTML = '🎉 <strong>Kunci Disetujui! Membuka...</strong>';
          pulse.style.color = '#1b8a5a';
        }
        setTimeout(revealEnvelope, 500);
      } else if (newStatus === 'rejected') {
        cleanupListener();
        alert('❌ Maaf, kuncimu belum disetujui atau salah. Silakan coba masukkan kunci lagi.');
        gateCard.innerHTML = originalContent;
        attachSubmitHandler();
      }
    }

    // 1. Supabase Realtime WebSocket
    if (supabaseClient && recordId) {
      try {
        realtimeChannel = supabaseClient
          .channel(`gate_wait_${recordId}`)
          .on(
            'postgres_changes',
            {
              event: 'UPDATE',
              schema: 'public',
              table: 'access_logs',
              filter: `id=eq.${recordId}`
            },
            (changePayload) => {
              console.log('⚡ Realtime update diterima:', changePayload);
              if (changePayload.new && changePayload.new.status) {
                handleStatus(changePayload.new.status);
              }
            }
          )
          .subscribe();
      } catch (err) {
        console.warn('Realtime error:', err);
      }

      // 2. Polling Cadangan (setiap 2.5 detik)
      pollInterval = setInterval(async () => {
        try {
          const { data } = await supabaseClient
            .from('access_logs')
            .select('status')
            .eq('id', recordId)
            .single();

          if (data && data.status) {
            handleStatus(data.status);
          }
        } catch (err) {
          console.warn('Polling error:', err);
        }
      }, 2500);
    } else {
      // Jika Supabase belum aktif (mode simulasi lokal)
      setTimeout(revealEnvelope, 1000);
    }
  }

  // Handler Submit Form
  function attachSubmitHandler() {
    const currentForm = document.getElementById('gate-form');
    if (!currentForm) return;

    currentForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const emailInput = document.getElementById('gate-email');
      const kunciInput = document.getElementById('gate-kunci');
      const submitBtn = document.getElementById('gate-submit-btn');
      const btnText = document.getElementById('gate-btn-text');

      const emailValue = (emailInput?.value || '').trim();
      const kunciValue = (kunciInput?.value || '').trim();

      if (!emailValue) {
        setStatus('Silakan masukkan email Anda.', 'error');
        emailInput?.focus();
        return;
      }

      if (!kunciValue) {
        setStatus('Silakan tuliskan kunci rahasia.', 'error');
        kunciInput?.focus();
        return;
      }

      // UI Loading
      if (submitBtn) submitBtn.disabled = true;
      if (btnText) btnText.textContent = 'Mengirim...';
      setStatus('Mengirim permintaan akses... ⏳', 'loading');

      const payload = {
        email: emailValue,
        kunci: String(kunciValue),
        user_agent: navigator.userAgent,
        status: 'pending',
        created_at: new Date().toISOString()
      };

      let recordId = null;

      // 1. Simpan ke Supabase dengan status 'pending'
      if (supabaseClient) {
        try {
          const tableName = config.tableName || 'access_logs';
          const { data, error } = await supabaseClient
            .from(tableName)
            .insert([
              {
                email: payload.email,
                kunci: payload.kunci,
                user_agent: payload.user_agent,
                status: 'pending'
              }
            ])
            .select();

          if (error) {
            console.error('❌ Error kirim ke Supabase:', error);
          } else if (data && data.length > 0) {
            recordId = data[0].id;
            console.log('🎉 Permintaan tersimpan dengan ID:', recordId);
          }
        } catch (err) {
          console.error('Terjadi pengecualian:', err);
        }
      }

      // 2. Simpan backup ke localStorage
      try {
        const existingLogs = JSON.parse(localStorage.getItem('access_logs') || '[]');
        existingLogs.push({ ...payload, id: recordId || Date.now() });
        localStorage.setItem('access_logs', JSON.stringify(existingLogs));
        localStorage.setItem('last_user_email', emailValue);
      } catch (err) {
        console.warn('Gagal simpan ke LocalStorage:', err);
      }

      // Suara pop halus
      if (window.AudioApp) {
        window.AudioApp.init();
        window.AudioApp.playPop();
      }

      // Tampilkan Layar Menunggu Verifikasi Manual
      showWaitingScreen(payload, recordId);
    });
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  attachSubmitHandler();
});
