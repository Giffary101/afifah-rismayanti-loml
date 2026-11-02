/**
 * Logika Interaktif Pembuka Amplop (index.html)
 */

document.addEventListener('DOMContentLoaded', () => {
  const envelopeContainer = document.getElementById('envelope-container');
  const heartSeal = document.getElementById('heart-seal');
  const openMainBtn = document.getElementById('open-main-btn');

  let isEnvelopeOpen = false;

  function openEnvelope() {
    if (isEnvelopeOpen) return;
    isEnvelopeOpen = true;

    if (window.AudioApp) {
      window.AudioApp.init();
      window.AudioApp.playPop();
      setTimeout(window.AudioApp.playChime, 150);
    }

    envelopeContainer.classList.add('open');

    // Ledakan partikel bunga & hati
    if (window.createBurstParticles && heartSeal) {
      const rect = heartSeal.getBoundingClientRect();
      window.createBurstParticles(rect.left + rect.width / 2, rect.top + rect.height / 2, 40);
    }
  }

  if (heartSeal) {
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
  }

  if (envelopeContainer) {
    envelopeContainer.addEventListener('click', () => {
      if (!isEnvelopeOpen) {
        openEnvelope();
      }
    });
  }

  // Klik tombol "Buka Halaman Utama" -> Pindah ke main.html
  if (openMainBtn) {
    openMainBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (window.AudioApp) {
        window.AudioApp.init();
        window.AudioApp.playChime();
      }

      if (window.createBurstParticles) {
        const rect = openMainBtn.getBoundingClientRect();
        window.createBurstParticles(rect.left + rect.width / 2, rect.top + rect.height / 2, 50);
      }

      // Beri sedikit jeda untuk animasi confetti sebelum berpindah halaman
      setTimeout(() => {
        window.location.href = 'main.html';
      }, 400);
    });
  }
});
