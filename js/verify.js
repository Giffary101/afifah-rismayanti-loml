/**
 * Logika Panel Verifikasi Kunci Manual (verify.html)
 * Menampilkan daftar permintaan akses, verifikasi manual, dan kirim email notifikasi (EmailJS)
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

  // 1. Inisialisasi Supabase
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

  // 2. Inisialisasi EmailJS
  const emailConfig = window.EMAILJS_CONFIG || {};
  const hasEmailJSKey = window.emailjs && 
                        emailConfig.publicKey && 
                        !emailConfig.publicKey.includes('YOUR_PUBLIC_KEY');

  if (hasEmailJSKey) {
    try {
      emailjs.init({ publicKey: emailConfig.publicKey });
      console.log('✅ EmailJS berhasil diinisialisasi.');
    } catch (e) {
      console.warn('⚠️ Gagal inisialisasi EmailJS:', e);
    }
  }

  // Toast Container
  let toastContainer = document.getElementById('verify-toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'verify-toast-container';
    document.body.appendChild(toastContainer);
  }

  function showToast(message, type = 'info', duration = 6000) {
    const toast = document.createElement('div');
    toast.className = `verify-toast toast-${type}`;
    
    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    if (type === 'error') icon = '❌';

    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(15px)';
      setTimeout(() => toast.remove(), 300);
    }, duration);
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

  // Fungsi Kirim Email Notifikasi Verifikasi Berhasil ke Pengguna
  async function sendVerificationEmail(recipientEmail, recipientKunci) {
    const isConfigured = emailConfig.serviceId && 
                         emailConfig.templateId && 
                         emailConfig.publicKey && 
                         !emailConfig.publicKey.includes('YOUR_PUBLIC_KEY');

    if (!isConfigured) {
      console.info('ℹ️ EmailJS belum diisi Service ID / Template ID di js/config.js.');
      return { success: false, reason: 'not_configured' };
    }

    const websiteUrl = window.location.origin + window.location.pathname.replace('verify.html', 'index.html');

    const templateParams = {
      to_email: recipientEmail,
      recipient_email: recipientEmail,
      user_email: recipientEmail,
      to_name: recipientEmail.split('@')[0],
      kunci: recipientKunci,
      message: emailConfig.defaultMessage || 'Selamat! Kunci Anda telah berhasil diverifikasi oleh admin. Silakan kembali ke website untuk membuka amplop spesial Anda... ✨',
      from_name: emailConfig.fromName || 'Admin Proyek Ucapan 💖',
      subject: emailConfig.subject || 'Selamat! Kunci Anda Telah Berhasil Diverifikasi 🌸',
      website_link: websiteUrl
    };

    try {
      const res = await emailjs.send(emailConfig.serviceId, emailConfig.templateId, templateParams);
      console.log('📧 Email notifikasi berhasil dikirim:', res);
      return { success: true, res };
    } catch (err) {
      console.error('❌ Gagal mengirim email via EmailJS:', err);
      return { success: false, error: err };
    }
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

      // Link Mailto untuk kirim langsung lewat aplikasi Gmail
      const websiteUrl = window.location.origin + window.location.pathname.replace('verify.html', 'index.html');
      const mailtoSubject = encodeURIComponent(emailConfig.subject || 'Selamat! Kunci Anda Telah Berhasil Diverifikasi 🌸');
      const mailtoBody = encodeURIComponent(
        `Halo,\n\nSelamat! Permintaan akses dan kuncimu (${item.kunci}) telah disetujui oleh admin.\nSilakan buka website untuk membuka amplop spesialmu sekarang:\n${websiteUrl}\n\nSalam hangat,\nAdmin Proyek Ucapan 💖`
      );
      const mailtoHref = `mailto:${encodeURIComponent(item.email)}?subject=${mailtoSubject}&body=${mailtoBody}`;

      let actionsHtml = '';
      if (currentStatus === 'pending') {
        actionsHtml = `
          <button class="btn-action btn-approve" data-id="${item.id}" data-action="approve" title="Setujui dan kirim email ke pengguna">
            ✔ Verifikasi & Kirim Email
          </button>
          <button class="btn-action btn-reject" data-id="${item.id}" data-action="reject" title="Tolak akses">
            ✖ Tolak (Kunci Salah)
          </button>
        `;
      } else {
        actionsHtml = `
          <a href="${mailtoHref}" target="_blank" class="btn-action btn-mailto" title="Kirim manual langsung via Gmail">
            ✉ Buka Gmail Manual
          </a>
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

  // Update Status ke Database Supabase & Kirim Email jika Approved
  async function updateSubmissionStatus(id, newStatus) {
    const cardEl = document.getElementById(`submission-card-${id}`);
    if (cardEl) {
      cardEl.style.opacity = '0.6';
      cardEl.style.pointerEvents = 'none';
    }

    // Cari item yang sedang diverifikasi
    const targetItem = submissionsData.find(i => String(i.id) === String(id));

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
          showToast('Gagal update status di database: ' + error.message, 'error');
        } else {
          console.log(`✅ Status ID ${id} diubah menjadi: ${newStatus}`);
        }
      } catch (err) {
        console.error('Terjadi kesalahan:', err);
      }
    }

    // Jika disetujui (Approved), lakukan pengiriman email ke pengguna!
    if (newStatus === 'approved' && targetItem) {
      showToast(`Mengirim email ke ${targetItem.email}... ⏳`, 'info', 3000);
      const emailResult = await sendVerificationEmail(targetItem.email, targetItem.kunci);

      if (emailResult.success) {
        showToast(`✔ Kunci diverifikasi & Email berhasil terkirim ke ${targetItem.email}! 💌`, 'success', 7000);
      } else if (emailResult.reason === 'not_configured') {
        showToast(`✔ Kunci diverifikasi! (Masukkan Service ID EmailJS di config.js untuk mengaktifkan kirim email otomatis)`, 'info', 8000);
      } else {
        showToast(`✔ Kunci diverifikasi, namun email gagal terkirim (${emailResult.error?.text || 'EmailJS error'}). Anda bisa klik 'Buka Gmail Manual'.`, 'error', 8000);
      }
    } else if (newStatus === 'rejected') {
      showToast(`❌ Kunci dinyatakan salah / ditolak.`, 'error', 4000);
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
      const icon = refreshBtn.querySelector('.refresh-icon');
      if (icon) icon.style.animation = 'spin 0.6s linear';
    }

    if (!supabaseClient) {
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
          const icon = refreshBtn.querySelector('.refresh-icon');
          if (icon) icon.style.animation = '';
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

            if (payload.eventType === 'INSERT') {
              if (window.AudioApp) {
                window.AudioApp.init();
                window.AudioApp.playPop();
              }
              showToast(`Permintaan akses baru masuk dari: ${payload.new.email}`, 'info', 5000);
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

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      fetchSubmissions();
    });
  }

  fetchSubmissions();
  setupRealtime();

  setInterval(fetchSubmissions, 5000);
});
