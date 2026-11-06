/**
 * Logika Linimasa Perjalanan Cinta (timeline.js)
 * Versi Modern Blossom: Interaktif, Elegan, & Harmonis dengan main.html
 */

document.addEventListener('DOMContentLoaded', () => {
  // =========================================================
  // 1. DATA MOMEN PERJALANAN CINTA & CITA-CITA
  // =========================================================
  /**
   * Anda dapat mengganti URL gambar di bawah dengan foto pribadi di folder 'images/':
   * Contoh: image: 'images/foto1.jpg'
   */
  const timelineMoments = [
    {
      id: 1,
      chapter: 'Babak 01',
      date: '12 Mei 2023',
      emoji: '🌸',
      tag: 'Titik Temu Pertama',
      title: 'Awal Mula Cerita Kita',
      desc: 'Hari di mana takdir mempertemukan kita. Senyum manismu yang tulus seketika menghangatkan pandangan dan membuka lembaran cerita yang tak pernah kubayangkan sebelumnya.',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      loveCount: 142
    },
    {
      id: 2,
      chapter: 'Babak 02',
      date: '20 September 2023',
      emoji: '✨',
      tag: 'Sang Pejuang Tangguh',
      title: 'Kagum pada Cita-Citamu',
      desc: 'Melihat caramu berjuang, belajar, dan merajut mimpi selalu membuatku terpesona. Afifah bukan hanya wanita terindah, tapi juga inspirasi terbesarku dalam pantang menyerah.',
      image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
      loveCount: 198
    },
    {
      id: 3,
      chapter: 'Babak 03',
      date: '14 Januari 2024',
      emoji: '☕',
      tag: 'Ruang Teduh & Tawa',
      title: 'Berbincang Tanpa Batas Waktu',
      desc: 'Momen-momen sederhana duduk bersama, menikmati secangkir kehangatan, bertukar cerita konyol hingga impian masa depan. Bersamamu, waktu selalu berlari terlalu cepat.',
      image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80',
      loveCount: 256
    },
    {
      id: 4,
      chapter: 'Babak 04',
      date: '18 Juni 2024',
      emoji: '🌈',
      tag: 'Saling Menguatkan',
      title: 'Melewati Ombak dan Ujian',
      desc: 'Setiap tantangan dan hari-hari berat yang datang justru merekatkan ikatan kita. Kita membuktikan bahwa selama kita saling genggam tangan, tak ada badai yang tak bisa dilalui.',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80',
      loveCount: 312
    },
    {
      id: 5,
      chapter: 'Babak 05',
      date: '02 November 2024',
      emoji: '🎂',
      tag: 'Perayaan Manis',
      title: 'Hari Spesial Sang Bidadari',
      desc: 'Momen penuh rasa syukur karena semesta melahirkan sosok seindah dirimu ke dunia ini. Doa-doa terbaik selalu kulangitkan agar bahagiamu mekar abadi di setiap hembusan nafas.',
      image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
      loveCount: 420
    },
    {
      id: 6,
      chapter: 'Babak 06',
      date: 'Menuju Masa Depan',
      emoji: '💍',
      tag: 'Harapan Abadi',
      title: 'Merajut Babak Baru Berdua',
      desc: 'Perjalanan indah ini masih sangat panjang, dan tak ada orang lain di dunia ini yang ingin kutemani selain dirimu. Mari melangkah bersama menyongsong hari-hari penuh cinta.',
      image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80',
      loveCount: 520
    }
  ];

  // =========================================================
  // 2. RENDER DAFTAR TIMELINE KE DALAM DOM
  // =========================================================
  const timelineTrack = document.getElementById('timeline-track');
  const statMomentsCount = document.getElementById('stat-moments-count');

  if (statMomentsCount) {
    statMomentsCount.textContent = `${timelineMoments.length} Babak`;
  }

  function renderTimeline() {
    if (!timelineTrack) return;
    timelineTrack.innerHTML = '';

    timelineMoments.forEach((item, index) => {
      const isLeft = index % 2 === 0;
      const itemEl = document.createElement('div');
      itemEl.className = `timeline-item ${isLeft ? 'left' : 'right'}`;
      itemEl.dataset.index = index;

      itemEl.innerHTML = `
        <!-- Pin Bunga Node di Garis Tengah -->
        <div class="timeline-pin" title="${item.chapter}: ${item.tag}">
          ${item.emoji}
        </div>

        <!-- Kartu Kenangan -->
        <article class="timeline-card">
          <div class="card-washi-tape"></div>

          <div class="card-meta-bar">
            <span class="card-chapter-tag">${item.chapter} • ${item.tag}</span>
            <span class="card-date-badge">📅 ${item.date}</span>
          </div>

          <div class="card-photo-wrapper" data-img="${item.image}" data-title="${item.title}" data-desc="${item.desc}">
            <img src="${item.image}" alt="${item.title}" class="card-photo" loading="lazy">
            <span class="photo-overlay-stamp">🔍 Klik Perbesar</span>
          </div>

          <h3 class="card-title">${item.title}</h3>
          <p class="card-story-text">${item.desc}</p>

          <div class="card-footer">
            <button class="love-reaction-btn" data-id="${item.id}" aria-label="Beri Cinta">
              <span class="heart-icon">💖</span>
              <span class="love-num">${item.loveCount}</span>
            </button>
            <span class="memory-tag">🌸 Kenangan #0${index + 1}</span>
          </div>
        </article>
      `;

      timelineTrack.appendChild(itemEl);
    });

    // Inisialisasi Event Listener setelah elemen di-render
    initCardInteractions();
    initScrollReveal();
  }

  // =========================================================
  // 3. EFEK SCROLL REVEAL (INTERSECTION OBSERVER)
  // =========================================================
  function initScrollReveal() {
    const items = document.querySelectorAll('.timeline-item');
    if (!('IntersectionObserver' in window)) {
      items.forEach(it => it.classList.add('revealed'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    items.forEach(it => observer.observe(it));
  }

  // =========================================================
  // 4. INTERAKSI TOMBOL REAKSI CINTA (BURST HEART EFFECT)
  // =========================================================
  function initCardInteractions() {
    const loveBtns = document.querySelectorAll('.love-reaction-btn');
    loveBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const numSpan = btn.querySelector('.love-num');
        let currentCount = parseInt(numSpan.textContent, 10) || 0;
        numSpan.textContent = currentCount + 1;

        // Efek Ledakan Partikel Hati
        createHeartBurst(e.clientX, e.clientY);

        // Efek Suara jika ada fungsi audio
        if (window.playChimeSound) {
          window.playChimeSound();
        }
      });
    });

    // Modal Zoom Foto
    const photoWrappers = document.querySelectorAll('.card-photo-wrapper');
    photoWrappers.forEach(wrap => {
      wrap.addEventListener('click', () => {
        const imgSrc = wrap.dataset.img;
        const imgTitle = wrap.dataset.title;
        const imgDesc = wrap.dataset.desc;
        openPhotoModal(imgSrc, imgTitle, imgDesc);
      });
    });
  }

  function createHeartBurst(x, y) {
    const hearts = ['💖', '💕', '🌸', '✨', '💗', '🥰'];
    for (let i = 0; i < 7; i++) {
      const p = document.createElement('span');
      p.className = 'heart-burst-particle';
      p.textContent = hearts[Math.floor(Math.random() * hearts.length)];
      
      const angle = (Math.PI * 2 * i) / 7 + (Math.random() * 0.4 - 0.2);
      const dist = 50 + Math.random() * 60;
      const tx = Math.cos(angle) * dist + 'px';
      const ty = Math.sin(angle) * dist - 30 + 'px';

      p.style.setProperty('--tx', tx);
      p.style.setProperty('--ty', ty);
      p.style.left = x + 'px';
      p.style.top = y + 'px';

      document.body.appendChild(p);
      setTimeout(() => p.remove(), 1200);
    }
  }

  // =========================================================
  // 5. MODAL ZOOM FOTO ELEGAN
  // =========================================================
  const modalOverlay = document.getElementById('photo-modal');
  const modalImg = document.getElementById('photo-modal-img');
  const modalTitle = document.getElementById('photo-modal-title');
  const modalDesc = document.getElementById('photo-modal-desc');
  const modalClose = document.getElementById('photo-modal-close');

  function openPhotoModal(src, title, desc) {
    if (!modalOverlay || !modalImg) return;
    modalImg.src = src;
    modalTitle.textContent = title;
    modalDesc.textContent = desc;
    modalOverlay.classList.add('active');
  }

  function closePhotoModal() {
    if (modalOverlay) modalOverlay.classList.remove('active');
  }

  if (modalClose) modalClose.addEventListener('click', closePhotoModal);
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closePhotoModal();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closePhotoModal();
  });

  // =========================================================
  // 6. VIEW SWITCHER (JEJAK BERKELOK vs GRID GALLERY)
  // =========================================================
  const btnRoad = document.getElementById('btn-view-road');
  const btnGrid = document.getElementById('btn-view-grid');

  if (btnRoad && btnGrid && timelineTrack) {
    btnRoad.addEventListener('click', () => {
      btnRoad.classList.add('active');
      btnGrid.classList.remove('active');
      timelineTrack.classList.remove('grid-view');
      initScrollReveal();
    });

    btnGrid.addEventListener('click', () => {
      btnGrid.classList.add('active');
      btnRoad.classList.remove('active');
      timelineTrack.classList.add('grid-view');
      const items = document.querySelectorAll('.timeline-item');
      items.forEach(it => it.classList.add('revealed'));
    });
  }

  // =========================================================
  // 7. COUNTDOWN HITUNG MUNDUR MENUJU HARI BAHAGIA
  // =========================================================
  function updateCountdown() {
    const daysEl = document.getElementById('cd-days');
    const hoursEl = document.getElementById('cd-hours');
    const minsEl = document.getElementById('cd-mins');
    const secsEl = document.getElementById('cd-secs');

    if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

    // Target tanggal: 1 tahun dari sekarang atau momen istimewa berikutnya
    const now = new Date();
    let target = new Date(now.getFullYear(), 10, 2); // 2 November (Ulang Tahun)
    if (now > target) {
      target = new Date(now.getFullYear() + 1, 10, 2);
    }

    const diff = target - now;
    if (diff <= 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minsEl.textContent = '00';
      secsEl.textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    const secs = Math.floor((diff / 1000) % 60);

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minsEl.textContent = String(mins).padStart(2, '0');
    secsEl.textContent = String(secs).padStart(2, '0');
  }

  setInterval(updateCountdown, 1000);
  updateCountdown();

  // =========================================================
  // 8. AUDIO BACKGROUND & KONTROL SUARA
  // =========================================================
  const bgMusic = document.getElementById('bg-music');
  const musicBtn = document.getElementById('music-btn');
  const musicIcon = document.getElementById('music-icon');
  const musicBtnText = document.getElementById('music-btn-text');

  let isPlaying = false;

  function toggleAudio() {
    if (!bgMusic) return;
    if (isPlaying) {
      bgMusic.pause();
      isPlaying = false;
      if (musicIcon) musicIcon.textContent = '🔇';
      if (musicBtnText) musicBtnText.textContent = 'Musik: Off';
    } else {
      bgMusic.play().then(() => {
        isPlaying = true;
        if (musicIcon) musicIcon.textContent = '🎵';
        if (musicBtnText) musicBtnText.textContent = 'Musik: On';
      }).catch(() => {});
    }
  }

  if (musicBtn) {
    musicBtn.addEventListener('click', toggleAudio);
  }

  // Auto-play halus saat user pertama kali berinteraksi di halaman
  const startAudioOnFirstClick = () => {
    if (bgMusic && !isPlaying) {
      bgMusic.play().then(() => {
        isPlaying = true;
        if (musicIcon) musicIcon.textContent = '🎵';
        if (musicBtnText) musicBtnText.textContent = 'Musik: On';
      }).catch(() => {});
    }
    document.removeEventListener('click', startAudioOnFirstClick);
  };
  document.addEventListener('click', startAudioOnFirstClick);

  // Jalankan render awal
  renderTimeline();
});
