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

  // Suara hitung mundur retro / detik jam
  function playTickSound() {
    if (!isSoundEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.05);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    } catch (e) {
      console.log('Audio error', e);
    }
  }

  // Suara saklar lampu vintage & kehangatan cahaya menyala
  function playLightSwitchSound() {
    if (!isSoundEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;
      const now = audioCtx.currentTime;

      // Click switch snap
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(360, now);
      osc.frequency.exponentialRampToValueAtTime(90, now + 0.05);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.07);

      // Warm glow electrical resonance
      const hum = audioCtx.createOscillator();
      const humGain = audioCtx.createGain();
      hum.type = 'sine';
      hum.frequency.setValueAtTime(140, now + 0.04);
      hum.frequency.linearRampToValueAtTime(280, now + 0.28);
      humGain.gain.setValueAtTime(0.001, now + 0.04);
      humGain.gain.linearRampToValueAtTime(0.1, now + 0.12);
      humGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      hum.connect(humGain);
      humGain.connect(audioCtx.destination);
      hum.start(now + 0.04);
      hum.stop(now + 0.5);
    } catch (e) {
      console.log('Audio error', e);
    }
  }

  
  
  
  
  
  // Suara silinder kepala roll 3D berputar menggelinding di lantai dari kanan ke kiri
  function playCylinderRollSound(duration = 2600) {
    if (!isSoundEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;

      const now = audioCtx.currentTime;
      const durSec = duration / 1000;

      // 1. Gemuruh lembut putaran silinder berbobot di lantai (Floor Rolling Resonance)
      const rumble = audioCtx.createOscillator();
      const rumbleGain = audioCtx.createGain();
      rumble.type = 'sine';
      rumble.frequency.setValueAtTime(110, now);
      rumble.frequency.linearRampToValueAtTime(130, now + durSec * 0.4);
      rumble.frequency.exponentialRampToValueAtTime(75, now + durSec);

      rumbleGain.gain.setValueAtTime(0.001, now);
      rumbleGain.gain.linearRampToValueAtTime(0.12, now + 0.2);
      rumbleGain.gain.exponentialRampToValueAtTime(0.001, now + durSec);

      rumble.connect(rumbleGain);
      rumbleGain.connect(audioCtx.destination);
      rumble.start(now);
      rumble.stop(now + durSec + 0.05);

      // 2. Gesekan permukaan silinder menggelinding (Rolling Texture)
      const bufferSize = audioCtx.sampleRate * durSec;
      const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const noiseSrc = audioCtx.createBufferSource();
      noiseSrc.buffer = noiseBuffer;

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, now);
      filter.frequency.exponentialRampToValueAtTime(300, now + durSec);

      const noiseGain = audioCtx.createGain();
      noiseGain.gain.setValueAtTime(0.001, now);
      noiseGain.gain.linearRampToValueAtTime(0.09, now + 0.15);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + durSec);

      noiseSrc.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(audioCtx.destination);
      noiseSrc.start(now);
      noiseSrc.stop(now + durSec);

      // 3. Detak gerigi film teratur saat pita terbentang keluar dari silinder
      const totalClicks = Math.floor(durSec * 12);
      for (let i = 0; i < totalClicks; i++) {
        const t = now + 0.08 + (i / totalClicks) * (durSec * 0.95);
        const osc = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(680 - i * 15, t);
        osc.frequency.exponentialRampToValueAtTime(140, t + 0.025);
        g.gain.setValueAtTime(0.045, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.03);
        osc.connect(g);
        g.connect(audioCtx.destination);
        osc.start(t);
        osc.stop(t + 0.035);
      }
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
    playTick: playTickSound,
    playLightSwitch: playLightSwitchSound,
    playFilmRolling: playFilmDragSound,
    playFilmDrag: playFilmSlowTurnSound,
    playCylinderRoll: playCylinderRollSound,
    playFilmRolling: playCylinderRollSound,
    playFilmSlowTurn: playFilmUnfoldSound,
    isEnabled: () => isSoundEnabled
  };
})();
