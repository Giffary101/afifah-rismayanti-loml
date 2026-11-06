/**
 * Logika Galeri Foto & Video Kenangan Manis (timeline.js)
 * Versi Galeri Dinding Foto & Video Blossom:
 * 1. Bagian Awal: Seluruh Foto & Video yang memiliki nomor/angka terurut di awal
 * 2. Garis Meliuk-Liuk: Pemisah dekoratif tali berayun
 * 3. Bagian Sisanya: Seluruh Foto & Video non-angka (WhatsApp Media)
 * Tanpa Menu / Filter - Murni Satu Halaman Mengalir Utuh
 */

document.addEventListener('DOMContentLoaded', () => {
  // =========================================================
  // 1. DATA MEDIA BERANGKA (URUTAN PERTAMA DI AWAL)
  // =========================================================
  const numberedMedia = [
    {
      id: 'num-1-img',
      type: 'image',
      title: 'Awal Mula Cerita Kita',
      chapter: 'Babak 01',
      date: '12 Mei 2023',
      emoji: '🌸',
      media: 'images/1.jpeg',
      fallback: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=80',
      loveCount: 142
    },
    {
      id: 'num-1-vid',
      type: 'video',
      title: 'Momen Manis Pertama',
      chapter: 'Video Babak 01',
      date: '12 Mei 2023',
      emoji: '🎬',
      media: 'images/1.mp4',
      loveCount: 185
    },
    {
      id: 'num-2-img',
      type: 'image',
      title: 'Kagum pada Cita-Citamu',
      chapter: 'Babak 02',
      date: '20 September 2023',
      emoji: '✨',
      media: 'images/2.jpeg',
      fallback: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80',
      loveCount: 198
    },
    {
      id: 'num-2-vid',
      type: 'video',
      title: 'Tawa Bersama Penuh Arti',
      chapter: 'Video Babak 02',
      date: '20 September 2023',
      emoji: '🎥',
      media: 'images/2.mp4',
      loveCount: 210
    },
    {
      id: 'num-3-img',
      type: 'image',
      title: 'Berbincang Tanpa Batas Waktu',
      chapter: 'Babak 03',
      date: '14 Januari 2024',
      emoji: '☕',
      media: 'images/3.jpeg',
      fallback: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=900&q=80',
      loveCount: 256
    },
    {
      id: 'num-4-img',
      type: 'image',
      title: 'Senyuman Manis Menenangkan Jiwa',
      chapter: 'Pesona Afifah',
      date: '08 Maret 2024',
      emoji: '🥰',
      media: 'images/4.jpeg',
      fallback: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
      loveCount: 389
    },
    {
      id: 'num-5-img',
      type: 'image',
      title: 'Melewati Ombak dan Ujian',
      chapter: 'Babak 04',
      date: '18 Juni 2024',
      emoji: '🌈',
      media: 'images/5.jpeg',
      fallback: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80',
      loveCount: 312
    },
    {
      id: 'num-6-img',
      type: 'image',
      title: 'Tawa Hangat di Bawah Senja',
      chapter: 'Momen Bahagia',
      date: '15 Agustus 2024',
      emoji: '🌅',
      media: 'images/6.jpeg',
      fallback: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=80',
      loveCount: 345
    },
    {
      id: 'num-7-img',
      type: 'image',
      title: 'Hari Spesial Sang Bidadari',
      chapter: 'Babak 05',
      date: '02 November 2024',
      emoji: '🎂',
      media: 'images/7.jpeg',
      fallback: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=900&q=80',
      loveCount: 420
    },
    {
      id: 'num-8-img',
      type: 'image',
      title: 'Langkah Bersama Menatap Masa Depan',
      chapter: 'Babak 06',
      date: 'Menuju Masa Depan',
      emoji: '💍',
      media: 'images/8.jpeg',
      fallback: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=900&q=80',
      loveCount: 520
    },
    {
      id: 'num-9-img',
      type: 'image',
      title: 'Tatapan Penuh Ketulusan',
      chapter: 'Memori Manis',
      date: 'Abadi Selamanya',
      emoji: '💖',
      media: 'images/9.jpeg',
      fallback: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=900&q=80',
      loveCount: 468
    },
    {
      id: 'num-10-img',
      type: 'image',
      title: 'Kehangatan di Setiap Pertemuan',
      chapter: 'Momen Istimewa',
      date: 'Terukir Indah',
      emoji: '🌷',
      media: 'images/10.jpeg',
      fallback: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=900&q=80',
      loveCount: 395
    },
    {
      id: 'num-11-img',
      type: 'image',
      title: 'Cahaya Senyum Afifah',
      chapter: 'Pesona Anggun',
      date: 'Selalu Menghangatkan',
      emoji: '🌺',
      media: 'images/11.jpeg',
      fallback: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80',
      loveCount: 512
    },
    {
      id: 'num-12-img',
      type: 'image',
      title: 'Bersama Meraih Setiap Mimpi',
      chapter: 'Cita & Cinta',
      date: 'Meniti Harapan',
      emoji: '⭐',
      media: 'images/12.jpeg',
      fallback: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=900&q=80',
      loveCount: 485
    },
    {
      id: 'num-13-img',
      type: 'image',
      title: 'Potret Bahagia Kita Berdua',
      chapter: 'Selamanya',
      date: 'Sampai Akhir Nanti',
      emoji: '💝',
      media: 'images/13.jpeg',
      fallback: 'https://images.unsplash.com/photo-1494774157365-9e04c6720e47?auto=format&fit=crop&w=900&q=80',
      loveCount: 630
    },
    {
      id: 'num-14-img',
      type: 'image',
      title: 'Binar Mata Penuh Ketulusan',
      chapter: 'Babak 07',
      date: 'Detik Bahagia',
      emoji: '✨',
      media: 'images/14.jpeg',
      fallback: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=80',
      loveCount: 340
    },
    {
      id: 'num-15-img',
      type: 'image',
      title: 'Detik-Detik Penuh Candatawa',
      chapter: 'Babak 08',
      date: 'Momen Hangat',
      emoji: '🥰',
      media: 'images/15.jpeg',
      fallback: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80',
      loveCount: 365
    },
    {
      id: 'num-16-img',
      type: 'image',
      title: 'Langkah Kaki Penuh Keyakinan',
      chapter: 'Babak 09',
      date: 'Melangkah Maju',
      emoji: '🌸',
      media: 'images/16.jpeg',
      fallback: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=900&q=80',
      loveCount: 388
    },
    {
      id: 'num-17-img',
      type: 'image',
      title: 'Dekapan Hangat Rasa Syukur',
      chapter: 'Babak 10',
      date: 'Ikatan Kasih',
      emoji: '💖',
      media: 'images/17.jpeg',
      fallback: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
      loveCount: 412
    },
    {
      id: 'num-18-img',
      type: 'image',
      title: 'Harmoni Dua Hati',
      chapter: 'Babak 11',
      date: 'Satu Tujuan',
      emoji: '🎶',
      media: 'images/18.jpeg',
      fallback: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80',
      loveCount: 375
    },
    {
      id: 'num-19-img',
      type: 'image',
      title: 'Keanggunan yang Memikat',
      chapter: 'Babak 12',
      date: 'Pesona Indah',
      emoji: '🌷',
      media: 'images/19.jpeg',
      fallback: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=80',
      loveCount: 450
    },
    {
      id: 'num-20-img',
      type: 'image',
      title: 'Cahaya Senja Bersama Dirimu',
      chapter: 'Babak 13',
      date: 'Senja Manis',
      emoji: '🌅',
      media: 'images/20.jpeg',
      fallback: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=900&q=80',
      loveCount: 430
    },
    {
      id: 'num-21-img',
      type: 'image',
      title: 'Janji Setia dalam Hati',
      chapter: 'Babak 14',
      date: 'Selalu Ada',
      emoji: '💍',
      media: 'images/21.jpeg',
      fallback: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=900&q=80',
      loveCount: 495
    },
    {
      id: 'num-22-img',
      type: 'image',
      title: 'Menyulam Cerita Bahagia',
      chapter: 'Babak 15',
      date: 'Puncak Syukur',
      emoji: '🌟',
      media: 'images/22.jpeg',
      fallback: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=900&q=80',
      loveCount: 540
    }
  ];

  // =========================================================
  // 2. DATA MEDIA SISANYA (NON-ANGKA / WHATSAPP MEDIA)
  // =========================================================
  const otherMedia = [
    {
      id: 'oth-1',
      type: 'image',
      title: 'Tawa Lepas Penuh Bahagia',
      chapter: 'Momen Spontan',
      date: 'Detik Manis',
      emoji: '🌸',
      media: 'images/WhatsApp Image 2026-11-06 at 20.51.10.jpeg',
      fallback: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=80',
      loveCount: 215
    },
    {
      id: 'oth-2',
      type: 'image',
      title: 'Momen Spontan Tak Terlupa',
      chapter: 'Candid Manis',
      date: 'Detik Manis',
      emoji: '✨',
      media: 'images/WhatsApp Image 2026-11-06 at 20.51.12.jpeg',
      fallback: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80',
      loveCount: 240
    },
    {
      id: 'oth-3',
      type: 'image',
      title: 'Kilau Pandangan Hangat',
      chapter: 'Momen Spontan',
      date: 'Detik Manis',
      emoji: '🥰',
      media: 'images/WhatsApp Image 2026-11-06 at 20.51.14.jpeg',
      fallback: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=900&q=80',
      loveCount: 289
    },
    {
      id: 'oth-4',
      type: 'image',
      title: 'Secercah Kebahagiaan Kita',
      chapter: 'Candid Manis',
      date: 'Detik Manis',
      emoji: '💖',
      media: 'images/WhatsApp Image 2026-11-06 at 20.51.16 (1).jpeg',
      fallback: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
      loveCount: 310
    },
    {
      id: 'oth-5',
      type: 'image',
      title: 'Cerita di Balik Lensa',
      chapter: 'Momen Spontan',
      date: 'Detik Manis',
      emoji: '📸',
      media: 'images/WhatsApp Image 2026-11-06 at 20.51.16.jpeg',
      fallback: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80',
      loveCount: 195
    },
    {
      id: 'oth-6',
      type: 'image',
      title: 'Senyuman Menggetarkan Jiwa',
      chapter: 'Pesona Afifah',
      date: 'Detik Manis',
      emoji: '🌷',
      media: 'images/WhatsApp Image 2026-11-06 at 20.51.43.jpeg',
      fallback: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=80',
      loveCount: 340
    },
    {
      id: 'oth-7',
      type: 'image',
      title: 'Potret Hangat Hari-Hari Indah',
      chapter: 'Momen Spontan',
      date: 'Detik Manis',
      emoji: '🌺',
      media: 'images/WhatsApp Image 2026-11-06 at 20.51.45.jpeg',
      fallback: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=900&q=80',
      loveCount: 275
    },
    {
      id: 'oth-8',
      type: 'image',
      title: 'Kejutan Kecil Penuh Makna',
      chapter: 'Candid Manis',
      date: 'Detik Manis',
      emoji: '🌟',
      media: 'images/WhatsApp Image 2026-11-06 at 20.51.47 (1).jpeg',
      fallback: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=900&q=80',
      loveCount: 330
    },
    {
      id: 'oth-9',
      type: 'image',
      title: 'Waktu Teduh Bersamamu',
      chapter: 'Momen Spontan',
      date: 'Detik Manis',
      emoji: '☕',
      media: 'images/WhatsApp Image 2026-11-06 at 20.51.47.jpeg',
      fallback: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=900&q=80',
      loveCount: 290
    },
    {
      id: 'oth-10',
      type: 'image',
      title: 'Genggaman Erat Kasih Sayang',
      chapter: 'Candid Manis',
      date: 'Detik Manis',
      emoji: '🤝',
      media: 'images/WhatsApp Image 2026-11-06 at 20.51.52.jpeg',
      fallback: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=900&q=80',
      loveCount: 380
    },
    {
      id: 'oth-11',
      type: 'image',
      title: 'Binar Mata Penuh Harapan',
      chapter: 'Pesona Afifah',
      date: 'Detik Manis',
      emoji: '✨',
      media: 'images/WhatsApp Image 2026-11-06 at 20.51.53.jpeg',
      fallback: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80',
      loveCount: 315
    },
    {
      id: 'oth-12',
      type: 'image',
      title: 'Sudut Cerita Favoritku',
      chapter: 'Momen Spontan',
      date: 'Detik Manis',
      emoji: '💌',
      media: 'images/WhatsApp Image 2026-11-06 at 20.51.54.jpeg',
      fallback: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=900&q=80',
      loveCount: 360
    },
    {
      id: 'oth-13',
      type: 'image',
      title: 'Melangkah Bersama Beriringan',
      chapter: 'Candid Manis',
      date: 'Detik Manis',
      emoji: '🌈',
      media: 'images/WhatsApp Image 2026-11-06 at 20.51.55.jpeg',
      fallback: 'https://images.unsplash.com/photo-1494774157365-9e04c6720e47?auto=format&fit=crop&w=900&q=80',
      loveCount: 270
    },
    {
      id: 'oth-14',
      type: 'image',
      title: 'Ruang Rindu dan Kasih',
      chapter: 'Momen Spontan',
      date: 'Detik Manis',
      emoji: '💝',
      media: 'images/WhatsApp Image 2026-11-06 at 20.52.00 (1).jpeg',
      fallback: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=80',
      loveCount: 410
    },
    {
      id: 'oth-15',
      type: 'image',
      title: 'Senyuman Manis Penuh Haru',
      chapter: 'Pesona Afifah',
      date: 'Detik Manis',
      emoji: '🥰',
      media: 'images/WhatsApp Image 2026-11-06 at 20.52.01.jpeg',
      fallback: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80',
      loveCount: 345
    },
    {
      id: 'oth-16',
      type: 'image',
      title: 'Tatap Teduh Pembawa Tenang',
      chapter: 'Candid Manis',
      date: 'Detik Manis',
      emoji: '✨',
      media: 'images/WhatsApp Image 2026-11-06 at 20.52.02.jpeg',
      fallback: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=900&q=80',
      loveCount: 360
    },
    {
      id: 'oth-17',
      type: 'image',
      title: 'Harmoni Senyuman Manis',
      chapter: 'Pesona Afifah',
      date: 'Detik Manis',
      emoji: '🥰',
      media: 'images/WhatsApp Image 2026-11-06 at 20.52.15.jpeg',
      fallback: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
      loveCount: 325
    },
    {
      id: 'oth-18',
      type: 'image',
      title: 'Momen Hangat yang Tertangkap',
      chapter: 'Candid Manis',
      date: 'Detik Manis',
      emoji: '🌅',
      media: 'images/WhatsApp Image 2026-11-06 at 20.52.18.jpeg',
      fallback: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80',
      loveCount: 298
    },
    {
      id: 'oth-19',
      type: 'image',
      title: 'Kenangan Abadi Tak Tergantikan',
      chapter: 'Momen Spontan',
      date: 'Detik Manis',
      emoji: '💖',
      media: 'images/WhatsApp Image 2026-11-06 at 21.11.08.jpeg',
      fallback: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=80',
      loveCount: 445
    },
    {
      id: 'oth-20',
      type: 'image',
      title: 'Abadi dalam Setiap Detik Kasih',
      chapter: 'Selamanya',
      date: 'Detik Manis',
      emoji: '💍',
      media: 'images/WhatsApp Image 2026-11-06 at 21.11.13.jpeg',
      fallback: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=900&q=80',
      loveCount: 520
    },
    {
      id: 'oth-21-vid',
      type: 'video',
      title: 'Rekaman Momen Spontan Indah',
      chapter: 'Video Kenangan',
      date: 'Detik Manis',
      emoji: '🎬',
      media: 'images/WhatsApp Video 2026-11-06 at 20.51.30.mp4',
      loveCount: 560
    }
  ];

  // Gabungan seluruh media (45 item) untuk navigasi lightbox modal
  const allMedia = [...numberedMedia, ...otherMedia];

  // Perbarui total foto & video di header hero
  const statMomentsCount = document.getElementById('stat-moments-count');
  if (statMomentsCount) {
    statMomentsCount.textContent = `${allMedia.length} Foto & Video`;
  }

  let currentModalIndex = 0;

  // =========================================================
  // 3. GENERATOR ELEMEN KARTU FOTO / VIDEO DINDING (PUSH PIN)
  // =========================================================
  function createCardElement(item, globalIndex, displayIndex) {
    const cardEl = document.createElement('article');
    cardEl.className = 'gallery-card';
    cardEl.dataset.id = item.id;
    cardEl.dataset.globalIndex = globalIndex;

    const isVideo = item.type === 'video';

    // Wadah Media Foto atau Video
    const mediaHtml = isVideo
      ? `
        <div class="gallery-photo-wrapper video-wrapper" data-index="${globalIndex}">
          <video src="${item.media}" class="gallery-photo gallery-video" preload="metadata" muted playsinline loop></video>
          <div class="video-indicator-badge">
            <span class="video-indicator-icon">▶</span>
            <span class="video-indicator-label">Video</span>
          </div>
          <div class="gallery-photo-overlay">
            <span class="zoom-pill">▶ Putar Video</span>
          </div>
        </div>
      `
      : `
        <div class="gallery-photo-wrapper" data-index="${globalIndex}">
          <img src="${item.media}" alt="${item.title}" class="gallery-photo" loading="lazy" onerror="if(this.dataset.fallback && this.src!==this.dataset.fallback){this.src=this.dataset.fallback;}" data-fallback="${item.fallback || ''}">
          <div class="gallery-photo-overlay">
            <span class="zoom-pill">🔍 Perbesar Foto</span>
          </div>
        </div>
      `;

    cardEl.innerHTML = `
      <!-- Paku Payung (Push Pin 3D) Penempel di Dinding -->
      <div class="card-push-pin" aria-hidden="true">
        <div class="push-pin-head"></div>
        <div class="push-pin-shadow"></div>
      </div>

      ${mediaHtml}

      <!-- Informasi Foto/Video (Hanya Judul & Tag, TANPA Deskripsi) -->
      <div class="gallery-info">
        <div class="gallery-meta-row">
          <span class="gallery-tag">${item.emoji} ${item.chapter}</span>
          <span class="gallery-date">📅 ${item.date}</span>
        </div>
        <h3 class="gallery-title">${item.title}</h3>

        <div class="gallery-footer">
          <button class="love-reaction-btn" data-id="${item.id}" aria-label="Beri Cinta">
            <span class="heart-icon">💖</span>
            <span class="love-num">${item.loveCount}</span>
          </button>
          <span class="memory-number">#${displayIndex < 10 ? '0' + displayIndex : displayIndex}</span>
        </div>
      </div>
    `;

    return cardEl;
  }

  // =========================================================
  // 4. RENDER SEMUA MEDIA DALAM 1 HALAMAN (DIPISAHKAN WAVY ROPE)
  // =========================================================
  function renderAllGalleries() {
    const containerNumbered = document.getElementById('gallery-container-numbered');
    const containerOthers = document.getElementById('gallery-container-others');

    // 1. Render Foto & Video Berangka di Bagian Awal (Urutan Pertama)
    if (containerNumbered) {
      containerNumbered.innerHTML = '';
      numberedMedia.forEach((item, idx) => {
        const globalIndex = idx;
        const cardEl = createCardElement(item, globalIndex, idx + 1);
        containerNumbered.appendChild(cardEl);
      });
    }

    // 2. Render Foto & Video Sisanya (Non-Angka) Setelah Garis Meliuk-Liuk
    if (containerOthers) {
      containerOthers.innerHTML = '';
      otherMedia.forEach((item, idx) => {
        const globalIndex = numberedMedia.length + idx;
        const cardEl = createCardElement(item, globalIndex, idx + 1);
        containerOthers.appendChild(cardEl);
      });
    }

    initGalleryInteractions();
    initScrollReveal();
  }

  // =========================================================
  // 5. EFEK SCROLL REVEAL (FADE & POP KARTU)
  // =========================================================
  function initScrollReveal() {
    const cards = document.querySelectorAll('.gallery-card');
    if (!('IntersectionObserver' in window)) {
      cards.forEach(c => c.classList.add('revealed'));
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
      threshold: 0.1,
      rootMargin: '0px 0px -30px 0px'
    });

    cards.forEach(c => observer.observe(c));
  }

  // =========================================================
  // 6. INTERAKSI REAKSI CINTA, HOVER VIDEO, & MODAL LIGHTBOX
  // =========================================================
  function initGalleryInteractions() {
    // Tombol Love Reaction dengan Partikel Meletup
    const loveBtns = document.querySelectorAll('.love-reaction-btn');
    loveBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const numSpan = btn.querySelector('.love-num');
        let currentCount = parseInt(numSpan.textContent, 10) || 0;
        numSpan.textContent = currentCount + 1;

        createHeartBurst(e.clientX, e.clientY);
      });
    });

    // Preview otomatis video saat hover kursor
    const videoWrappers = document.querySelectorAll('.video-wrapper');
    videoWrappers.forEach(wrap => {
      const vid = wrap.querySelector('video');
      if (!vid) return;
      wrap.addEventListener('mouseenter', () => {
        vid.play().catch(() => {});
      });
      wrap.addEventListener('mouseleave', () => {
        vid.pause();
        vid.currentTime = 0;
      });
    });

    // Buka Modal Zoom / Putar Saat Media Diklik
    const mediaWrappers = document.querySelectorAll('.gallery-photo-wrapper');
    mediaWrappers.forEach(wrap => {
      wrap.addEventListener('click', () => {
        const idx = parseInt(wrap.dataset.index, 10) || 0;
        openMediaModal(idx);
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
  // 7. MODAL LIGHTBOX FOTO & VIDEO (DENGAN PREV & NEXT 45 MEDIA)
  // =========================================================
  const modalOverlay = document.getElementById('photo-modal');
  const modalImg = document.getElementById('photo-modal-img');
  const modalVideo = document.getElementById('photo-modal-video');
  const modalTitle = document.getElementById('photo-modal-title');
  const modalChapter = document.getElementById('photo-modal-chapter');
  const modalDate = document.getElementById('photo-modal-date');
  const modalClose = document.getElementById('photo-modal-close');
  const modalPrevBtn = document.getElementById('modal-prev-btn');
  const modalNextBtn = document.getElementById('modal-next-btn');

  function openMediaModal(index) {
    if (!modalOverlay) return;
    isAutoScrollPausedByModal = true;
    currentModalIndex = index;
    const item = allMedia[index];
    if (!item) return;

    if (item.type === 'video') {
      if (modalImg) modalImg.style.display = 'none';
      if (modalVideo) {
        modalVideo.style.display = 'block';
        modalVideo.src = item.media;
        modalVideo.play().catch(() => {});
      }
    } else {
      if (modalVideo) {
        modalVideo.pause();
        modalVideo.src = '';
        modalVideo.style.display = 'none';
      }
      if (modalImg) {
        modalImg.style.display = 'block';
        modalImg.onerror = function() {
          if (item.fallback && this.src !== item.fallback) {
            this.src = item.fallback;
          }
        };
        modalImg.src = item.media;
      }
    }

    if (modalTitle) modalTitle.textContent = item.title;
    if (modalChapter) modalChapter.textContent = `${item.emoji} ${item.chapter}`;
    if (modalDate) modalDate.textContent = `📅 ${item.date}`;

    modalOverlay.classList.add('active');
  }

  function closeMediaModal() {
    if (modalOverlay) modalOverlay.classList.remove('active');
    if (modalVideo) {
      modalVideo.pause();
      modalVideo.src = '';
    }
    isAutoScrollPausedByModal = false;
    currentScrollY = window.scrollY || 0;
  }

  function showNextMedia() {
    currentModalIndex = (currentModalIndex + 1) % allMedia.length;
    openMediaModal(currentModalIndex);
  }

  function showPrevMedia() {
    currentModalIndex = (currentModalIndex - 1 + allMedia.length) % allMedia.length;
    openMediaModal(currentModalIndex);
  }

  if (modalClose) modalClose.addEventListener('click', closeMediaModal);
  if (modalNextBtn) modalNextBtn.addEventListener('click', (e) => { e.stopPropagation(); showNextMedia(); });
  if (modalPrevBtn) modalPrevBtn.addEventListener('click', (e) => { e.stopPropagation(); showPrevMedia(); });

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeMediaModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (!modalOverlay || !modalOverlay.classList.contains('active')) return;
    if (e.key === 'Escape') closeMediaModal();
    if (e.key === 'ArrowRight') showNextMedia();
    if (e.key === 'ArrowLeft') showPrevMedia();
  });

  // =========================================================
  // 8. SISTEM SCROLL OTOMATIS & PENGUNCIAN SCROLL MANUAL
  // =========================================================
  let isAutoScrollRunning = true;
  let isAutoScrollPausedByModal = false;
  let currentScrollY = window.scrollY || 0;
  const SCROLL_SPEED = 0.85; // Kecepatan halus sinematik (~50px/detik pada 60 FPS)

  // A. Kunci total scroll manual (mouse wheel, touch swipe, tombol panah/keyboard)
  // Pengguna tidak dapat mempercepat atau memperlambat scroll secara manual
  window.addEventListener('wheel', (e) => {
    e.preventDefault();
  }, { passive: false });

  window.addEventListener('touchmove', (e) => {
    const activeModal = document.querySelector('.photo-modal-overlay.active');
    if (activeModal && activeModal.contains(e.target)) return;
    e.preventDefault();
  }, { passive: false });

  window.addEventListener('keydown', (e) => {
    const blockedKeys = ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' ', 'Spacebar'];
    const activeModal = document.querySelector('.photo-modal-overlay.active');
    if (activeModal && (e.key === 'Escape' || e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
      return; // navigasi foto di dalam modal tetap aktif
    }
    if (blockedKeys.includes(e.key)) {
      e.preventDefault();
    }
  });

  // B. Loop Animasi Scroll Otomatis
  function runAutoScroll() {
    if (isAutoScrollRunning && !isAutoScrollPausedByModal) {
      const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      if (currentScrollY < maxScroll) {
        currentScrollY += SCROLL_SPEED;
        window.scrollTo(0, currentScrollY);
      } else {
        updateAutoScrollUI(false, 'Sampai Akhir');
      }
    }
    requestAnimationFrame(runAutoScroll);
  }

  // Mulai scroll otomatis setelah jeda pembuka 1.2 detik
  setTimeout(() => {
    currentScrollY = window.scrollY || 0;
    requestAnimationFrame(runAutoScroll);
  }, 1200);

  // C. Kontrol UI Scroll Otomatis (Floating Pill & Tombol Ulangi)
  const autoscrollPill = document.getElementById('autoscroll-control');
  const autoscrollStatusText = document.getElementById('autoscroll-status-text');
  const autoscrollToggleBtn = document.getElementById('btn-toggle-autoscroll');
  const autoscrollBtnIcon = document.getElementById('autoscroll-btn-icon');
  const autoscrollRestartBtn = document.getElementById('btn-restart-autoscroll');
  const btnScrollTopAction = document.getElementById('btn-scroll-top-action');

  function updateAutoScrollUI(running, label) {
    if (!autoscrollPill) return;
    if (running) {
      autoscrollPill.classList.remove('paused');
      if (autoscrollStatusText) autoscrollStatusText.textContent = label || 'Scroll Otomatis';
      if (autoscrollBtnIcon) autoscrollBtnIcon.textContent = '⏸';
    } else {
      autoscrollPill.classList.add('paused');
      if (autoscrollStatusText) autoscrollStatusText.textContent = label || 'Dijeda';
      if (autoscrollBtnIcon) autoscrollBtnIcon.textContent = '▶';
    }
  }

  function toggleAutoScroll() {
    isAutoScrollRunning = !isAutoScrollRunning;
    currentScrollY = window.scrollY || 0;
    updateAutoScrollUI(isAutoScrollRunning, isAutoScrollRunning ? 'Scroll Otomatis' : 'Dijeda');
  }

  function restartAutoScroll() {
    currentScrollY = 0;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      currentScrollY = 0;
      isAutoScrollRunning = true;
      updateAutoScrollUI(true, 'Scroll Otomatis');
    }, 450);
  }

  if (autoscrollToggleBtn) autoscrollToggleBtn.addEventListener('click', toggleAutoScroll);
  if (autoscrollRestartBtn) autoscrollRestartBtn.addEventListener('click', restartAutoScroll);
  if (btnScrollTopAction) btnScrollTopAction.addEventListener('click', (e) => { e.preventDefault(); restartAutoScroll(); });

  // =========================================================
  // 9. AUDIO BACKGROUND & KONTROL SUARA
  // =========================================================
  const bgMusic = document.getElementById('bg-music');
  const musicBtn = document.getElementById('music-btn');
  const musicIcon = document.getElementById('music-icon');
  const musicBtnText = document.getElementById('music-btn-text');
  const autoplayPrompt = document.getElementById('autoplay-prompt');

  let isPlaying = false;

  function updateMusicUI(active) {
    isPlaying = active;
    if (musicIcon) musicIcon.textContent = active ? '🎵' : '🔇';
    if (musicBtnText) musicBtnText.textContent = active ? 'Musik: On' : 'Musik: Off';
    if (musicBtn) {
      if (active) {
        musicBtn.classList.remove('pulse-attention');
      } else {
        musicBtn.classList.add('pulse-attention');
      }
    }
    if (active && autoplayPrompt) {
      autoplayPrompt.classList.add('fade-out');
      setTimeout(() => {
        if (autoplayPrompt) autoplayPrompt.style.display = 'none';
      }, 400);
    }
  }

  function playMusic() {
    if (!bgMusic) return;
    bgMusic.play().then(() => {
      updateMusicUI(true);
    }).catch((err) => {
      // Browser menahan autoplay dengan suara sebelum ada interaksi pengguna
      console.log('Autoplay ditahan kebijakan browser sampai ada interaksi:', err);
      updateMusicUI(false);
      if (autoplayPrompt) {
        autoplayPrompt.style.display = 'flex';
      }
    });
  }

  function toggleAudio() {
    if (!bgMusic) return;
    if (isPlaying) {
      bgMusic.pause();
      updateMusicUI(false);
    } else {
      bgMusic.play().then(() => {
        updateMusicUI(true);
      }).catch(() => {});
    }
  }

  if (musicBtn) {
    musicBtn.addEventListener('click', toggleAudio);
  }

  if (autoplayPrompt) {
    autoplayPrompt.addEventListener('click', () => {
      playMusic();
    });
  }

  // 1. Coba putar otomatis langsung saat halaman dimuat
  playMusic();

  // 2. Jika browser menahan autoplay di awal, segera putar saat ada interaksi pertama apa pun
  const handleFirstInteraction = () => {
    if (bgMusic && !isPlaying) {
      playMusic();
    }
    ['click', 'touchstart', 'pointerdown', 'keydown'].forEach(evt => {
      document.removeEventListener(evt, handleFirstInteraction);
    });
  };

  ['click', 'touchstart', 'pointerdown', 'keydown'].forEach(evt => {
    document.addEventListener(evt, handleFirstInteraction, { passive: true });
  });

  // Inisialisasi awal render semua galeri media (satu halaman utuh)
  renderAllGalleries();
});
