/**
 * Spesial Untuk Afifah Rismayanti
 * Logika Animasi Amplop, Hitung Mundur, Roll Film Vintage 35mm, dan Partikel Ambient
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements - Amplop & Navigasi
  const envelopeContainer = document.getElementById('envelope-container');
  const heartSeal = document.getElementById('heart-seal');
  const openMainBtn = document.getElementById('open-main-btn');
  const backToEnvelopeBtn = document.getElementById('back-to-envelope-btn');
  const envelopeSection = document.getElementById('envelope-section');
  const mainSection = document.getElementById('main-section');
  const soundBtn = document.getElementById('sound-btn');
  const canvas = document.getElementById('ambient-canvas');
  const ctx = canvas.getContext('2d');

  // DOM Elements - Hitung Mundur
  const cdDays = document.getElementById('cd-days');
  const cdHours = document.getElementById('cd-hours');
  const cdMinutes = document.getElementById('cd-minutes');
  const cdSeconds = document.getElementById('cd-seconds');
  const cdMessage = document.getElementById('countdown-message');

  // DOM Elements - Roll Film & Dynamic Background
  const vintageBgLayer = document.getElementById('vintage-bg-layer');
  const filmTrack = document.getElementById('film-track');
  const filmTrackViewport = document.getElementById('film-track-viewport');
  const filmPrevBtn = document.getElementById('film-prev-btn');
  const filmNextBtn = document.getElementById('film-next-btn');
  const currentFrameIdx = document.getElementById('current-frame-idx');
  const totalFramesIdx = document.getElementById('total-frames-idx');

  // State
  let isEnvelopeOpen = false;
  let isSoundEnabled = true;
  let activeFrameIndex = 0;

  // ==========================================
  // WEB AUDIO API (Sintesis Suara Romantis & Kamera Vintage)
  // Tidak perlu download file mp3 eksternal!
  // ==========================================
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Nada lembut petikan harpa / chime saat buka amplop
  function playChimeSound() {
    if (!isSoundEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;

      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
      notes.forEach((freq, index) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + index * 0.1);

        gain.gain.setValueAtTime(0, audioCtx.currentTime + index * 0.1);
        gain.gain.linearRampToValueAtTime(0.2, audioCtx.currentTime + index * 0.1 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + index * 0.1 + 0.9);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(audioCtx.currentTime + index * 0.1);
        osc.stop(audioCtx.currentTime + index * 0.1 + 0.95);
      });
    } catch (e) {
      console.log('Audio error', e);
    }
  }

  // Nada lembut pop saat klik hati
  function playPopSound() {
    if (!isSoundEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(640, audioCtx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.18, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.16);
    } catch (e) {
      console.log('Audio error', e);
    }
  }

  // Suara Shutter / Mekanik Putaran Film Kamera Analog Masa Lalu
  function playCameraShutterSound() {
    if (!isSoundEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;

      const now = audioCtx.currentTime;

      // Click 1 (shutter press)
      const osc1 = audioCtx.createOscillator();
      const gain1 = audioCtx.createGain();
      osc1.type = 'square';
      osc1.frequency.setValueAtTime(800, now);
      osc1.frequency.exponentialRampToValueAtTime(120, now + 0.04);
      gain1.gain.setValueAtTime(0.12, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc1.connect(gain1);
      gain1.connect(audioCtx.destination);
      osc1.start(now);
      osc1.stop(now + 0.05);

      // Click 2 (shutter release / film advance tick)
      const osc2 = audioCtx.createOscillator();
      const gain2 = audioCtx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(1200, now + 0.06);
      osc2.frequency.exponentialRampToValueAtTime(200, now + 0.11);
      gain2.gain.setValueAtTime(0.08, now + 0.06);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc2.connect(gain2);
      gain2.connect(audioCtx.destination);
      osc2.start(now + 0.06);
      osc2.stop(now + 0.12);
    } catch (e) {
      console.log('Audio error', e);
    }
  }

  // Toggle Tombol Suara
  soundBtn.addEventListener('click', () => {
    isSoundEnabled = !isSoundEnabled;
    soundBtn.querySelector('.icon').textContent = isSoundEnabled ? '🔔' : '🔕';
    soundBtn.querySelector('.btn-text').textContent = isSoundEnabled ? 'Sound: On' : 'Sound: Off';
    if (isSoundEnabled) {
      initAudio();
      playPopSound();
    }
  });

  // ==========================================
  // LOGIKA PEMBUKA AMPLOP
  // ==========================================
  function openEnvelope() {
    if (isEnvelopeOpen) return;
    isEnvelopeOpen = true;

    initAudio();
    playPopSound();
    setTimeout(playChimeSound, 150);

    envelopeContainer.classList.add('open');

    // Dapatkan posisi segel hati untuk ledakan partikel
    const rect = heartSeal.getBoundingClientRect();
    const originX = rect.left + rect.width / 2;
    const originY = rect.top + rect.height / 2;

    // Ledakan partikel hati & kelopak
    createBurstParticles(originX, originY, 40);
  }

  heartSeal.addEventListener('click', (e) => {
    e.stopPropagation();
    openEnvelope();
  });

  heartSeal.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      e.stopPropagation();
      openEnvelope();
    }
  });

  // Klik di area amplop juga bisa membuka
  envelopeContainer.addEventListener('click', () => {
    if (!isEnvelopeOpen) {
      openEnvelope();
    }
  });

  function resetEnvelope() {
    isEnvelopeOpen = false;
    envelopeContainer.classList.remove('open');
  }

  // ==========================================
  // TRANSISI KE HALAMAN UTAMA
  // ==========================================
  openMainBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    initAudio();
    playChimeSound();

    // Ledakan confetti perayaan
    const rect = openMainBtn.getBoundingClientRect();
    createBurstParticles(rect.left + rect.width / 2, rect.top + rect.height / 2, 50);

    // Transisi halus
    envelopeSection.classList.remove('active');
    setTimeout(() => {
      mainSection.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // Inisialisasi tampilan film roll frame pertama
      setActiveFrame(0, true);
    }, 350);
  });

  // Kembali ke Tampilan Amplop & Bisa diputar ulang animasinya
  backToEnvelopeBtn.addEventListener('click', () => {
    mainSection.classList.remove('active');
    setTimeout(() => {
      resetEnvelope();
      envelopeSection.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 350);
  });

  // ==========================================
  // 1. LOGIKA HITUNG MUNDUR (COUNTDOWN TIMER)
  // ==========================================
  /**
   * PANDUAN PENGATURAN TANGGAL:
   * Anda bisa mengganti tanggal di bawah ini dengan tanggal ulang tahun
   * atau tanggal anniversary yang sebenarnya, misalnya:
   * const COUNTDOWN_TARGET = new Date('2026-11-20T00:00:00');
   */
  const COUNTDOWN_TARGET = new Date();
  COUNTDOWN_TARGET.setDate(COUNTDOWN_TARGET.getDate() + 18);
  COUNTDOWN_TARGET.setHours(COUNTDOWN_TARGET.getHours() + 4);

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = COUNTDOWN_TARGET.getTime() - now;

    if (distance <= 0) {
      cdDays.textContent = '00';
      cdHours.textContent = '00';
      cdMinutes.textContent = '00';
      cdSeconds.textContent = '00';
      cdMessage.textContent = 'Hari paling membahagiakan telah tiba! Selamat merayakan cinta & cita-cita! 🎉💖';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    cdDays.textContent = String(days).padStart(2, '0');
    cdHours.textContent = String(hours).padStart(2, '0');
    cdMinutes.textContent = String(minutes).padStart(2, '0');
    cdSeconds.textContent = String(seconds).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // ==========================================
  // 2. DATA TIMELINE ROLL FILM KENANGAN
  // ==========================================
  /**
   * Anda dapat mengganti URL foto ini dengan foto pribadi yang ditaruh
   * di folder 'images/foto1.jpg', dst!
   */
  const timelineMoments = [
    {
      id: 1,
      frameCode: "▶ 01A",
      dateStamp: "'23 05 12",
      fullDate: "12 Mei 2023",
      title: "Awal Mula Cerita Kita",
      desc: "Hari di mana senyum manismu pertama kali mencuri perhatian, membuka lembaran kisah penuh rasa hangat dan ketulusan.",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 2,
      frameCode: "▶ 02A",
      dateStamp: "'23 09 20",
      fullDate: "20 September 2023",
      title: "Pejuang Mimpi Berhati Lembut",
      desc: "Melihat tekad dan kerja kerasmu mengejar setiap cita-cita selalu membuatku kagum. Afifah adalah inspirasi terbesarku.",
      image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 3,
      frameCode: "▶ 03A",
      dateStamp: "'24 01 14",
      fullDate: "14 Januari 2024",
      title: "Tawa di Bawah Langit Sore",
      desc: "Momen sederhana berbincang tanpa batas waktu, berbagi secangkir rasa dan impian besar yang selalu menghangatkan hati.",
      image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 4,
      frameCode: "▶ 04A",
      dateStamp: "'24 06 18",
      fullDate: "18 Juni 2024",
      title: "Melangkah Melewati Ujian",
      desc: "Di setiap rintangan yang hadir, kita belajar saling menguatkan. Menemani setiap langkah juangmu adalah hal terindah.",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 5,
      frameCode: "▶ 05A",
      dateStamp: "'24 11 02",
      fullDate: "02 November 2024",
      title: "Hari Spesial & Doa Abadi",
      desc: "Hari istimewa untuk wanita peraih mimpi. Semoga setiap impian dan harapan mekar seindah bunga-bunga musim semi.",
      image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 6,
      frameCode: "▶ 06A",
      dateStamp: "'25 02 14",
      fullDate: "14 Februari 2025",
      title: "Menatap Masa Depan Bersama",
      desc: "Merajut babak baru yang lebih indah. Terima kasih telah hadir dan menjadi bagian paling berharga dalam hidup ini.",
      image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80"
    }
  ];

  totalFramesIdx.textContent = timelineMoments.length;

  // Render Frame Roll Film ke HTML
  function renderFilmFrames() {
    filmTrack.innerHTML = '';

    timelineMoments.forEach((moment, index) => {
      const frameEl = document.createElement('div');
      frameEl.className = `film-frame ${index === 0 ? 'active' : ''}`;
      frameEl.dataset.index = index;

      frameEl.innerHTML = `
        <div class="frame-photo-wrapper">
          <img src="${moment.image}" alt="${moment.title}" class="frame-photo" loading="lazy">
          <!-- TANGGAL DI ATAS KANAN FOTO (FONT ANALOG MASA LALU) -->
          <div class="frame-date-badge">${moment.dateStamp}</div>
        </div>
        <div class="frame-content">
          <div class="frame-badge-row">
            <span class="frame-index-tag">${moment.frameCode}</span>
            <span class="frame-full-date">${moment.fullDate}</span>
          </div>
          <h3 class="frame-title">${moment.title}</h3>
          <p class="frame-desc">${moment.desc}</p>
        </div>
      `;

      // Klik foto untuk langsung memilih & memusatkannya
      frameEl.addEventListener('click', () => {
        setActiveFrame(index, true);
      });

      filmTrack.appendChild(frameEl);
    });
  }

  renderFilmFrames();

  // Fungsi Mengaktifkan Foto yang Dipilih
  function setActiveFrame(index, shouldScroll = false) {
    if (index < 0 || index >= timelineMoments.length) return;

    const frames = filmTrack.querySelectorAll('.film-frame');
    frames.forEach((f, idx) => {
      if (idx === index) {
        f.classList.add('active');
      } else {
        f.classList.remove('active');
      }
    });

    activeFrameIndex = index;
    currentFrameIdx.textContent = index + 1;

    // 1. UPDATE LATAR BELAKANG:
    // Menggunakan foto yang dipilih dengan FILTER COKLAT VINTAGE (diatur lewat CSS vintage-bg-layer)
    const selectedMoment = timelineMoments[index];
    vintageBgLayer.style.backgroundImage = `url('${selectedMoment.image}')`;

    // 2. Animasi Scroll ke tengah viewport jika diminta
    if (shouldScroll && frames[index]) {
      frames[index].scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest'
      });
      playCameraShutterSound();
    }
  }

  // Set initial background image
  if (timelineMoments[0]) {
    vintageBgLayer.style.backgroundImage = `url('${timelineMoments[0].image}')`;
  }

  // Tombol Geser Roll Film Selanjutnya & Sebelumnya
  filmPrevBtn.addEventListener('click', () => {
    if (activeFrameIndex > 0) {
      setActiveFrame(activeFrameIndex - 1, true);
    } else {
      setActiveFrame(timelineMoments.length - 1, true);
    }
  });

  filmNextBtn.addEventListener('click', () => {
    if (activeFrameIndex < timelineMoments.length - 1) {
      setActiveFrame(activeFrameIndex + 1, true);
    } else {
      setActiveFrame(0, true);
    }
  });

  // Listener Scroll: Saat pengguna scroll roll film dari kiri ke kanan,
  // deteksi otomatis frame foto yang berada di tengah dan jadikan aktif!
  let scrollTimeout = null;
  filmTrackViewport.addEventListener('scroll', () => {
    if (scrollTimeout) clearTimeout(scrollTimeout);

    scrollTimeout = setTimeout(() => {
      const viewportRect = filmTrackViewport.getBoundingClientRect();
      const viewportCenter = viewportRect.left + viewportRect.width / 2;

      const frames = filmTrack.querySelectorAll('.film-frame');
      let closestIdx = activeFrameIndex;
      let minDistance = Infinity;

      frames.forEach((frame, idx) => {
        const frameRect = frame.getBoundingClientRect();
        const frameCenter = frameRect.left + frameRect.width / 2;
        const distance = Math.abs(viewportCenter - frameCenter);

        if (distance < minDistance) {
          minDistance = distance;
          closestIdx = idx;
        }
      });

      if (closestIdx !== activeFrameIndex) {
        setActiveFrame(closestIdx, false);
        playCameraShutterSound();
      }
    }, 60);
  });

  // ==========================================
  // SISTEM PARTIKEL AMBIENT (BLOSSOM & HEARTS)
  // ==========================================
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const ambientParticles = [];
  const burstParticles = [];
  const TOTAL_AMBIENT = 35;

  // Warna-warna harmonis palet pink blossom
  const colors = [
    'rgba(255, 140, 198, 0.7)',  // Love Pink #ff8cc6
    'rgba(232, 93, 158, 0.65)', // Deep Rose #e85d9e
    'rgba(255, 194, 223, 0.75)', // Soft Blossom
    'rgba(255, 209, 102, 0.6)',  // Warm Gold
    'rgba(255, 230, 240, 0.85)'  // Pale Blush
  ];

  class AmbientPetal {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = -20;
      this.size = Math.random() * 8 + 6;
      this.speedY = Math.random() * 1.2 + 0.6;
      this.speedX = Math.sin(Math.random() * 50) * 0.8;
      this.rotation = Math.random() * 360;
      this.rotationSpeed = (Math.random() - 0.5) * 2;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.isHeart = Math.random() > 0.65; // Sebagian berbentuk hati kecil
      this.opacity = Math.random() * 0.6 + 0.3;
    }

    update() {
      this.y += this.speedY;
      this.x += Math.sin(this.y * 0.015) * 0.8 + this.speedX * 0.3;
      this.rotation += this.rotationSpeed;

      if (this.y > height + 20 || this.x < -20 || this.x > width + 20) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.opacity;

      if (this.isHeart) {
        drawMiniHeart(ctx, 0, 0, this.size * 0.6);
      } else {
        // Kelopak bunga sakura melayang
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size, this.size * 0.5, Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  // Partikel Ledakan saat Amplop Terbuka
  class BurstParticle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6 + 2;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed - 2.5; // Sedikit dorongan ke atas
      this.size = Math.random() * 9 + 5;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.isHeart = Math.random() > 0.4;
      this.alpha = 1;
      this.decay = Math.random() * 0.018 + 0.012;
      this.rotation = Math.random() * 360;
      this.rotationSpeed = (Math.random() - 0.5) * 8;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += 0.12; // gravitasi halus
      this.vx *= 0.98;
      this.rotation += this.rotationSpeed;
      this.alpha -= this.decay;
    }

    draw() {
      if (this.alpha <= 0) return;
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.alpha;

      if (this.isHeart) {
        drawMiniHeart(ctx, 0, 0, this.size * 0.7);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, this.size * 0.4, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  function drawMiniHeart(context, x, y, size) {
    context.beginPath();
    const topCurveHeight = size * 0.3;
    context.moveTo(x, y + topCurveHeight);
    context.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + topCurveHeight);
    context.bezierCurveTo(x - size / 2, y + (size + topCurveHeight) / 2, x, y + (size + topCurveHeight) / 1.4, x, y + size);
    context.bezierCurveTo(x, y + (size + topCurveHeight) / 1.4, x + size / 2, y + (size + topCurveHeight) / 2, x + size / 2, y + topCurveHeight);
    context.bezierCurveTo(x + size / 2, y, x, y, x, y + topCurveHeight);
    context.closePath();
    context.fill();
  }

  function createBurstParticles(x, y, count = 35) {
    for (let i = 0; i < count; i++) {
      burstParticles.push(new BurstParticle(x, y));
    }
  }

  // Inisialisasi partikel ambient
  for (let i = 0; i < TOTAL_AMBIENT; i++) {
    const petal = new AmbientPetal();
    petal.y = Math.random() * height; // Distribusikan merata di awal
    ambientParticles.push(petal);
  }

  // Animation Loop
  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Update & Render Ambient Petals
    ambientParticles.forEach((petal) => {
      petal.update();
      petal.draw();
    });

    // Update & Render Burst Particles
    for (let i = burstParticles.length - 1; i >= 0; i--) {
      const p = burstParticles[i];
      p.update();
      p.draw();
      if (p.alpha <= 0) {
        burstParticles.splice(i, 1);
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
});
