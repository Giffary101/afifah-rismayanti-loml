/**
 * Web Audio API - Efek Suara Romantis & Kamera Analog
 * Tersedia di seluruh halaman tanpa memerlukan file MP3 eksternal
 */

(function () {
  let audioCtx = null;
  let isSoundEnabled = localStorage.getItem('sound_pref') !== 'off';

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

  // Nada lembut petikan harpa / chime
  function playChimeSound() {
    if (!isSoundEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;

      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
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

  // Nada lembut pop
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

  // Suara mekanik shutter & putaran klise roll film analog
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

      // Click 2 (film ratchet advance)
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

  // Setup tombol kontrol suara jika elemen ada di halaman
  document.addEventListener('DOMContentLoaded', () => {
    const soundBtn = document.getElementById('sound-btn');
    if (soundBtn) {
      soundBtn.querySelector('.icon').textContent = isSoundEnabled ? '🔔' : '🔕';
      soundBtn.querySelector('.btn-text').textContent = isSoundEnabled ? 'Sound: On' : 'Sound: Off';

      soundBtn.addEventListener('click', () => {
        isSoundEnabled = !isSoundEnabled;
        localStorage.setItem('sound_pref', isSoundEnabled ? 'on' : 'off');
        soundBtn.querySelector('.icon').textContent = isSoundEnabled ? '🔔' : '🔕';
        soundBtn.querySelector('.btn-text').textContent = isSoundEnabled ? 'Sound: On' : 'Sound: Off';
        if (isSoundEnabled) {
          initAudio();
          playPopSound();
        }
      });
    }
  });

  // Ekspor fungsi ke global window agar bisa diakses oleh skrip lain
  window.AudioApp = {
    init: initAudio,
    playChime: playChimeSound,
    playPop: playPopSound,
    playShutter: playCameraShutterSound,
    isEnabled: () => isSoundEnabled
  };
})();
