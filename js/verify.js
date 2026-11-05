/**
 * Logika Panel Verifikasi Kunci Manual (verify.html)
 * Menampilkan daftar permintaan akses dan tombol verifikasi manual oleh manusia
 */

document.addEventListener('DOMContentLoaded', () => {
  const submissionsList = document.getElementById('submissions-list');
  const countPending = document.getElementById('count-pending');
  const countApproved = document.getElementById('count-approved');
  const countTotal = document.getElementById('count-total');
  const refreshBtn = document.getElementById('refresh-btn');
  const liveText = document.getElementById('live-text');

  let submissionsData = [];
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
      console.log('✅ Supabase Client terhubung di panel verifikasi.');
    } catch (err) {
      console.error('❌ Gagal inisialisasi Supabase:', err);
    }
  }

  // Format tanggal ramah pengguna
  function formatDate(isoString) {
    if (!isoString) return '-';
    try {
      const d = new Date(isoString);
      return d.toLocaleString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }) + ' WIB';
    } catch {
      return isoString;
    }
  }

  // Sederhanakan string User Agent
  function formatUserAgent(ua) {
    if (!ua) return 'Perangkat Tidak Dikenal';
    if (ua.includes('iPhone')) return '📱 iPhone / Safari';
    if (ua.includes('Android')) return '📱 Android Smartphone';
    if (ua.includes('Windows')) return '💻 Windows PC';
    if (ua.includes('Macintosh')) return '💻 Mac OS';
    return ua.substring(0, 40) + '...';
  }

  // Render Daftar Permintaan
  function renderSubmissions(items) {
    if (!submissionsList) return;

    if (!items || items.length === 0) {
      submissionsList.innerHTML = `
        <div class="empty-state-card">
          <div class="empty-state-icon">💌</div>
          <h3>Belum Ada Permintaan Akses</h3>
          <p>Saat seseorang mengisi form di halaman utama, email dan kunci mereka akan langsung muncul di sini untuk diverifikasi.</p>
        </div>
      `;
      updateStats([]);
      return;
    }

    submissionsList.innerHTML = '';

    items.forEach((item) => {
      const card = document.createElement('div');
      const currentStatus = item.status || 'pending';
      card.className = `submission-card status-${currentStatus}`;
      card.id = `submission-card-${item.id}`;

      let statusBadgeHtml = '';
      if (currentStatus === 'pending') {
        statusBadgeHtml = `<span class="status-badge pending">⏳ Menunggu Verifikasi</span>`;
      } else if (currentStatus === 'approved') {
        statusBadgeHtml = `<span class="status-badge approved">✅ Kunci Disetujui</span>`;
      } else if (currentStatus === 'rejected') {
        statusBadgeHtml = `<span class="status-badge rejected">❌ Kunci Ditolak</span>`;
      }

      let actionsHtml = '';
      if (currentStatus === 'pending') {
        actionsHtml = `
          <button class="btn-action btn-approve" data-id="${item.id}" data-action="approve" title="Setujui dan buka halaman untuk pengunjung">
            ✔ Verifikasi (Kunci Benar)
          </button>
          <button class="btn-action btn-reject" data-id="${item.id}" data-action="reject" title="Tolak akses">
            ✖ Tolak (Kunci Salah)
          </button>
        `;
      } else {
        actionsHtml = `
          <button class="btn-action btn-reset-pending" data-id="${item.id}" data-action="reset" title="Kembalikan status ke menunggu">
            ↺ Ubah ke Menunggu
          </button>
        `;
      }

      card.innerHTML = `
        <div class="submission-info">
          <div class="submission-meta-row">
            ${statusBadgeHtml}
            <span class="submission-time">🕒 ${formatDate(item.created_at)}</span>
          </div>

          <div class="submission-main-data">
            <div class="submission-email">
              <span class="email-icon">📧</span>
              <span>${escapeHtml(item.email)}</span>
            </div>

            <div class="submission-key-box">
              <span class="key-label">Kunci:</span>
              <span class="key-value">${escapeHtml(item.kunci)}</span>
            </div>
          </div>

          <div class="submission-agent">
            🌐 ${formatUserAgent(item.user_agent)}
          </div>
        </div>

        <div class="submission-actions">
          ${actionsHtml}
        </div>
      `;

      submissionsList.appendChild(card);
    });

    attachActionListeners();
    updateStats(items);
  }

  // Pasang Listener Tombol Aksi Manual (Setujui / Tolak)
  function attachActionListeners() {
    if (!submissionsList) return;

    const actionButtons = submissionsList.querySelectorAll('.btn-action');
    actionButtons.forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        const id = btn.dataset.id;
        const action = btn.dataset.action;

        if (!id || !action) return;

        let newStatus = 'pending';
        if (action === 'approve') newStatus = 'approved';
        if (action === 'reject') newStatus = 'rejected';

        await updateSubmissionStatus(id, newStatus);
      });
    });
  }

  // Update Status ke Database Supabase
  async function updateSubmissionStatus(id, newStatus) {
    const cardEl = document.getElementById(`submission-card-${id}`);
    if (cardEl) {
      cardEl.style.opacity = '0.6';
      cardEl.style.pointerEvents = 'none';
    }

    // Suara feedback
    if (window.AudioApp) {
      window.AudioApp.init();
      if (newStatus === 'approved') {
        window.AudioApp.playChime();
      } else {
        window.AudioApp.playPop();
      }
    }

    if (supabaseClient) {
      try {
        const { error } = await supabaseClient
          .from('access_logs')
          .update({ status: newStatus })
          .eq('id', id);

        if (error) {
          console.error('❌ Gagal update status di Supabase:', error);
          alert('Gagal memperbarui status: ' + error.message);
        } else {
          console.log(`✅ Status ID ${id} diubah menjadi: ${newStatus}`);
        }
      } catch (err) {
        console.error('Terjadi kesalahan:', err);
      }
    }

    // Update lokal pada data array
    submissionsData = submissionsData.map((item) => {
      if (String(item.id) === String(id)) {
        return { ...item, status: newStatus };
      }
      return item;
    });

    renderSubmissions(submissionsData);
  }

  // Update Penghitung Statistik
  function updateStats(items) {
    const pending = items.filter(i => (i.status || 'pending') === 'pending').length;
    const approved = items.filter(i => i.status === 'approved').length;
    const total = items.length;

    if (countPending) countPending.textContent = pending;
    if (countApproved) countApproved.textContent = approved;
    if (countTotal) countTotal.textContent = total;
  }

  // Ambil Data dari Supabase
  async function fetchSubmissions() {
    if (refreshBtn) {
      refreshBtn.querySelector('.refresh-icon').style.animation = 'spin 0.6s linear';
    }

    if (!supabaseClient) {
      // Fallback ke localStorage jika Supabase belum aktif
      const localLogs = JSON.parse(localStorage.getItem('access_logs') || '[]');
      submissionsData = localLogs.reverse();
      renderSubmissions(submissionsData);
      return;
    }

    try {
      const { data, error } = await supabaseClient
        .from('access_logs')
        .select('*')
        .order('id', { ascending: false });

      if (error) {
        console.error('Gagal mengambil data:', error);
        if (liveText) liveText.textContent = 'Koneksi Terganggu';
      } else {
        submissionsData = data || [];
        renderSubmissions(submissionsData);
        if (liveText) liveText.textContent = 'Real-Time Aktif';
      }
    } catch (err) {
      console.error('Error fetch:', err);
    } finally {
      if (refreshBtn) {
        setTimeout(() => {
          refreshBtn.querySelector('.refresh-icon').style.animation = '';
        }, 600);
      }
    }
  }

  // Berlangganan Real-Time Supabase
  function setupRealtime() {
    if (!supabaseClient) return;

    try {
      supabaseClient
        .channel('verify_realtime_access_logs')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'access_logs' },
          (payload) => {
            console.log('⚡ Perubahan Realtime terdeteksi:', payload);

            // Jika ada permintaan baru yang masuk (INSERT), bunyikan nada notifikasi
            if (payload.eventType === 'INSERT') {
              if (window.AudioApp) {
                window.AudioApp.init();
                window.AudioApp.playPop();
              }
            }

            fetchSubmissions();
          }
        )
        .subscribe((status) => {
          console.log('📡 Status Realtime Channel:', status);
        });
    } catch (err) {
      console.warn('Realtime subscription error:', err);
    }
  }

  // Utility Sanitize HTML
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Event Listener Tombol Refresh
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      fetchSubmissions();
    });
  }

  // Inisialisasi awal
  fetchSubmissions();
  setupRealtime();

  // Polling cadangan setiap 6 detik
  setInterval(fetchSubmissions, 6000);
});

