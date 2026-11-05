/**
 * Logika Gerbang Form Verifikasi Akses & Integrasi Database Supabase
 * KETAT: Halaman HANYA BISA TERBUKA jika admin telah mengklik tombol 'Verifikasi' di verify.html
 */

document.addEventListener('DOMContentLoaded', () => {
  const gateSection = document.getElementById('gate-section');
  const envelopeSection = document.getElementById('envelope-section');
  const gateCard = document.querySelector('.gate-card');
  const gateForm = document.getElementById('gate-form');

  if (!gateSection || !gateForm) return;

  // Cek apakah pengunjung sudah pernah diverifikasi secara sah oleh admin
  if (sessionStorage.getItem('access_verified') === 'true') {
    gateSection.style.display = 'none';
    if (envelopeSection) {
      envelopeSection.classList.remove('gate-hidden');
    }
    return;
  }

  // Inisialisasi Supabase Client
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
      console.log('✅ Supabase Client siap di gate.js');
    } catch (err) {
      console.error('❌ Gagal inisialisasi Supabase:', err);
    }
  }

  function setStatus(message, type = 'info') {
    const gateStatus = document.getElementById('gate-status');
    if (!gateStatus) return;
    gateStatus.textContent = message;
    gateStatus.className = `gate-status-msg ${type}`;
  }

  // Fungsi Membuka Amplop: HANYA DIPANGGIL JIKA STATUS === 'approved'
  function revealEnvelope() {
    sessionStorage.setItem('access_verified', 'true');

    if (window.AudioApp) {
      window.AudioApp.init();
      window.AudioApp.playChime();
    }

    if (window.createBurstParticles && gateCard) {
      const rect = gateCard.getBoundingClientRect();
      window.createBurstParticles(rect.left + rect.width / 2, rect.top + rect.height / 2, 50);
    }

    gateSection.classList.add('exit');

    setTimeout(() => {
      gateSection.style.display = 'none';
      if (envelopeSection) {
        envelopeSection.classList.remove('gate-hidden');
        envelopeSection.classList.add('gate-revealed');
      }
    }, 450);
  }

  // Tampilkan Layar Menunggu Verifikasi Manual oleh Admin
  function showWaitingScreen(payload, recordId) {
    if (!gateCard) return;

    const originalContent = gateCard.innerHTML;

    gateCard.innerHTML = `
      <div class="gate-waiting-box">
        <div class="waiting-spinner-pulse">⏳</div>
        <span class="gate-badge-tag">Menunggu Verifikasi Admin</span>
        <h2 class="waiting-title">Menunggu Verifikasi Kunci</h2>
        <p class="waiting-desc">
          Permintaanmu telah terkirim! Admin sedang memverifikasi kuncimu secara manual di panel verifikasi.<br>
          Halaman ini <strong>terkunci</strong> dan akan <strong>otomatis terbuka sendiri</strong> setelah disetujui admin 💖
        </p>

        <div class="waiting-data-badge">
          <div>Email: <strong>${escapeHtml(payload.email)}</strong></div>
          <div>Kunci: <strong>${escapeHtml(payload.kunci)}</strong></div>
        </div>

        <div class="waiting-live-pulse" id="waiting-pulse-status">
          <span class="live-dot"></span> Menunggu admin menekan tombol verifikasi...
        </div>

        <button type="button" id="btn-cancel-wait" class="btn-subtle btn-cancel-wait">
          ← Input Ulang Email / Kunci
        </button>
      </div>
    `;

    const cancelBtn = document.getElementById('btn-cancel-wait');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        cleanupListener();
        gateCard.innerHTML = originalContent;
        attachSubmitHandler();
      });
    }

    let pollInterval = null;
    let realtimeChannel = null;

    function cleanupListener() {
      if (pollInterval) clearInterval(pollInterval);
      if (realtimeChannel && supabaseClient) {
        try {
          supabaseClient.removeChannel(realtimeChannel);
        } catch {}
      }
    }

    function handleStatusUpdate(newStatus) {
      if (newStatus === 'approved') {
        cleanupListener();
        const pulse = document.getElementById('waiting-pulse-status');
        if (pulse) {
          pulse.innerHTML = '🎉 <strong>Kunci Disetujui Admin! Membuka halaman...</strong>';
          pulse.style.color = '#1b8a5a';
        }
        setTimeout(revealEnvelope, 600);
      } else if (newStatus === 'rejected') {
        cleanupListener();
        alert('❌ Maaf, kunci Anda belum disetujui atau dinyatakan salah oleh admin. Silakan coba kembali.');
        gateCard.innerHTML = originalContent;
        attachSubmitHandler();
      }
    }

    // 1. Supabase Realtime Listener (Mendengarkan UPDATE pada tabel access_logs)
    if (supabaseClient) {
      try {
        realtimeChannel = supabaseClient
          .channel(`gate_check_${recordId || payload.email}`)
          .on(
            'postgres_changes',
            {
              event: 'UPDATE',
              schema: 'public',
              table: 'access_logs'
            },
            (changePayload) => {
              const updated = changePayload.new;
              if (updated) {
                // Cocokkan berdasarkan ID atau Email
                if ((recordId && updated.id === recordId) || updated.email === payload.email) {
                  console.log('⚡ Realtime update status:', updated.status);
                  handleStatusUpdate(updated.status);
                }
              }
            }
          )
          .subscribe();
      } catch (err) {
        console.warn('Realtime error:', err);
      }

      // 2. Polling Rutin Setiap 2 Detik (Memastikan tidak ada update yang terlewat)
      pollInterval = setInterval(async () => {
        try {
          let query = supabaseClient.from('access_logs').select('id, status');
          if (recordId) {
            query = query.eq('id', recordId);
          } else {
            query = query.eq('email', payload.email).order('id', { ascending: false }).limit(1);
          }

          const { data, error } = await query;
          if (data && data.length > 0) {
            const currentStatus = data[0].status;
            console.log('🔍 Status polling terkini:', currentStatus);
            if (currentStatus === 'approved' || currentStatus === 'rejected') {
              handleStatusUpdate(currentStatus);
            }
          }
        } catch (err) {
          console.warn('Polling error:', err);
        }
      }, 2000);
    }
  }

  // Pasang Handler Submit Form
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

      // Set Loading
      if (submitBtn) submitBtn.disabled = true;
      if (btnText) btnText.textContent = 'Mengirim...';
      setStatus('Mengirim permintaan ke admin... ⏳', 'loading');

      const payload = {
        email: emailValue,
        kunci: String(kunciValue),
        user_agent: navigator.userAgent,
        status: 'pending',
        created_at: new Date().toISOString()
      };

      let recordId = null;

      if (supabaseClient) {
        try {
          const tableName = config.tableName || 'access_logs';
          
          // Kirim data ke Supabase
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
            console.error('❌ Error Supabase insert:', error);
            // Jika kolom status belum ada di database, coba insert tanpa status
            if (error.message && error.message.includes('status')) {
              await supabaseClient.from(tableName).insert([{
                email: payload.email,
                kunci: payload.kunci,
                user_agent: payload.user_agent
              }]);
            }
          } else if (data && data.length > 0) {
            recordId = data[0].id;
            console.log('✅ Permintaan tercatat dengan ID:', recordId);
          }
        } catch (err) {
          console.error('Pengecualian saat kirim data:', err);
        }
      }

      // Bunyikan pop
      if (window.AudioApp) {
        window.AudioApp.init();
        window.AudioApp.playPop();
      }

      // Masuk ke Layar Menunggu Verifikasi (TIDAK AKAN PERNAH TERBUKA SAMPAI ADMIN VERIFIKASI!)
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
