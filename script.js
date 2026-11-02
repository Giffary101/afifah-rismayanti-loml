/**
 * Spesial Untuk Afifah Rismayanti
 * Logika Animasi Amplop, Partikel Ambient, dan Efek Interaktif
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const envelopeContainer = document.getElementById('envelope-container');
  const heartSeal = document.getElementById('heart-seal');
  const openMainBtn = document.getElementById('open-main-btn');
  const backToEnvelopeBtn = document.getElementById('back-to-envelope-btn');
  const envelopeSection = document.getElementById('envelope-section');
  const mainSection = document.getElementById('main-section');
  const soundBtn = document.getElementById('sound-btn');
  const canvas = document.getElementById('ambient-canvas');
  const ctx = canvas.getContext('2d');

  // State
  let isEnvelopeOpen = false;
  let isSoundEnabled = true;

  // ==========================================
  // WEB AUDIO API (Sintesis Suara Romantis Ringan)
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
      console.log('Audio disabled or blocked', e);
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
  envelopeContainer.addEventListener('click', (e) => {
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
