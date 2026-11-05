/**
 * Logika Pemutar Musik Favorit & Sinkronisasi Lirik Real-Time (music.html)
 * Mendukung pemutaran MP3, visualisasi vinyl berputar, dan auto-scroll lirik karaoke
 */

document.addEventListener('DOMContentLoaded', () => {
  // Pengaman Akses: Pastikan pengunjung sudah diverifikasi admin
  if (sessionStorage.getItem('access_verified') !== 'true') {
    window.location.replace('index.html');
    return;
  }

  // Elemen DOM
  const audio = document.getElementById('main-audio');
  const playPauseBtn = document.getElementById('btn-play-pause');
  const playPauseIcon = document.getElementById('play-pause-icon');
  const vinylDisc = document.getElementById('vinyl-disc');
  const turntableArm = document.getElementById('turntable-arm');
  const soundWaveBars = document.getElementById('sound-wave-bars');
  const currentTimeEl = document.getElementById('current-time');
  const totalDurationEl = document.getElementById('total-duration');
  const progressFill = document.getElementById('progress-fill');
  const seekSlider = document.getElementById('seek-slider');
  const rewindBtn = document.getElementById('btn-rewind');
  const forwardBtn = document.getElementById('btn-forward');
  const loopBtn = document.getElementById('btn-loop');
  const volumeBtn = document.getElementById('btn-volume-toggle');
  const volumeIcon = document.getElementById('volume-icon');
  const volumeSlider = document.getElementById('volume-slider');
  const lyricsContainer = document.getElementById('lyrics-container');
  const lyricLines = document.querySelectorAll('.lyric-line');

  let isSeeking = false;
  let activeLyricIndex = -1;
  let isLooping = false;
  let lastVolume = 0.85;

  // Format detik menjadi format menit:detik (MM:SS)
  function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  // Putar / Jeda Lagu
  function togglePlayPause() {
    if (!audio) return;

    if (audio.paused) {
      audio.play().then(() => {
        updatePlayState(true);
        // Efek partikel bunga sakura saat lagu mulai diputar
        if (typeof window.createBurstParticles === 'function' && vinylDisc) {
          const rect = vinylDisc.getBoundingClientRect();
          window.createBurstParticles(rect.left + rect.width / 2, rect.top + rect.height / 2, 30);
        }
      }).catch((err) => {
        console.warn('Autoplay terhalang oleh izin browser:', err);
      });
    } else {
      audio.pause();
      updatePlayState(false);
    }
  }

  // Update Tampilan Status Play / Pause
  function updatePlayState(isPlaying) {
    if (isPlaying) {
      playPauseIcon.textContent = '⏸';
      playPauseBtn.setAttribute('title', 'Jeda Lagu (Spasi)');
      if (vinylDisc) vinylDisc.classList.add('playing');
      if (turntableArm) turntableArm.classList.add('active');
      if (soundWaveBars) soundWaveBars.classList.add('playing');
    } else {
      playPauseIcon.textContent = '▶';
      playPauseBtn.setAttribute('title', 'Putar Lagu (Spasi)');
      if (vinylDisc) vinylDisc.classList.remove('playing');
      if (turntableArm) turntableArm.classList.remove('active');
      if (soundWaveBars) soundWaveBars.classList.remove('playing');
    }
  }

  // Jeda waktu (1.5 detik) agar lirik bertahan lebih lama sebelum berpindah ke baris berikutnya
  const LYRIC_LINGER_DELAY = 1.5;

  // Update Sinkronisasi Lirik Real-Time
  function updateLyrics(currentTime) {
    if (!lyricLines.length || !lyricsContainer) return;

    let currentIndex = -1;

    for (let i = 0; i < lyricLines.length; i++) {
      const lineTime = parseFloat(lyricLines[i].dataset.time || 0);
      // Baris pertama mulai tepat saat vokal masuk, baris berikutnya ditahan 1.5 detik lebih lama
      const triggerTime = i === 0 ? lineTime : lineTime + LYRIC_LINGER_DELAY;
      if (currentTime >= triggerTime) {
        currentIndex = i;
      } else {
        break;
      }
    }

    if (currentIndex !== activeLyricIndex) {
      activeLyricIndex = currentIndex;

      lyricLines.forEach((line, idx) => {
        if (idx === currentIndex) {
          line.classList.add('active');
          line.classList.remove('past');

          // Auto-scroll ke baris aktif agar selalu di tengah pandangan pembaca
          const containerHeight = lyricsContainer.clientHeight;
          const lineOffsetTop = line.offsetTop;
          const lineHeight = line.clientHeight;
          const scrollTarget = lineOffsetTop - (containerHeight / 2) + (lineHeight / 2);

          lyricsContainer.scrollTo({
            top: Math.max(0, scrollTarget),
            behavior: 'smooth'
          });
        } else if (idx < currentIndex) {
          line.classList.remove('active');
          line.classList.add('past');
        } else {
          line.classList.remove('active', 'past');
        }
      });
    }
  }

  // Event Listeners Audio
  if (audio) {
    audio.addEventListener('loadedmetadata', () => {
      totalDurationEl.textContent = formatTime(audio.duration);
    });

    audio.addEventListener('timeupdate', () => {
      if (!isSeeking && audio.duration) {
        const percent = (audio.currentTime / audio.duration) * 100;
        progressFill.style.width = `${percent}%`;
        seekSlider.value = percent;
        currentTimeEl.textContent = formatTime(audio.currentTime);
      }
      updateLyrics(audio.currentTime);
    });

    audio.addEventListener('ended', () => {
      if (isLooping) {
        audio.currentTime = 0;
        audio.play();
      } else {
        updatePlayState(false);
      }
    });

    audio.addEventListener('play', () => updatePlayState(true));
    audio.addEventListener('pause', () => updatePlayState(false));
  }

  // Tombol Play / Pause
  if (playPauseBtn) {
    playPauseBtn.addEventListener('click', togglePlayPause);
  }

  // Klik langsung pada piringan vinyl untuk Play/Pause
  if (vinylDisc) {
    vinylDisc.addEventListener('click', togglePlayPause);
  }

  // Slider Scrubbing / Seek
  if (seekSlider && audio) {
    seekSlider.addEventListener('input', () => {
      isSeeking = true;
      const targetPercent = parseFloat(seekSlider.value);
      progressFill.style.width = `${targetPercent}%`;
      if (audio.duration) {
        const targetTime = (targetPercent / 100) * audio.duration;
        currentTimeEl.textContent = formatTime(targetTime);
      }
    });

    seekSlider.addEventListener('change', () => {
      if (audio.duration) {
        const targetPercent = parseFloat(seekSlider.value);
        audio.currentTime = (targetPercent / 100) * audio.duration;
      }
      isSeeking = false;
    });
  }

  // Lompat Mundur 10 Detik
  if (rewindBtn && audio) {
    rewindBtn.addEventListener('click', () => {
      audio.currentTime = Math.max(0, audio.currentTime - 10);
    });
  }

  // Lompat Maju 10 Detik
  if (forwardBtn && audio) {
    forwardBtn.addEventListener('click', () => {
      if (audio.duration) {
        audio.currentTime = Math.min(audio.duration, audio.currentTime + 10);
      }
    });
  }

  // Toggle Loop
  if (loopBtn) {
    loopBtn.addEventListener('click', () => {
      isLooping = !isLooping;
      loopBtn.classList.toggle('active', isLooping);
      loopBtn.setAttribute('title', isLooping ? 'Ulangi Lagu: Aktif (Looping)' : 'Ulangi Lagu (Loop)');
    });
  }

  // Slider Volume
  if (volumeSlider && audio) {
    volumeSlider.addEventListener('input', () => {
      const vol = parseFloat(volumeSlider.value);
      audio.volume = vol;
      lastVolume = vol > 0 ? vol : lastVolume;
      updateVolumeIcon(vol);
    });
  }

  // Toggle Mute Volume
  if (volumeBtn && audio && volumeSlider) {
    volumeBtn.addEventListener('click', () => {
      if (audio.volume > 0) {
        lastVolume = audio.volume;
        audio.volume = 0;
        volumeSlider.value = 0;
        updateVolumeIcon(0);
      } else {
        const restoreVol = lastVolume > 0 ? lastVolume : 0.85;
        audio.volume = restoreVol;
        volumeSlider.value = restoreVol;
        updateVolumeIcon(restoreVol);
      }
    });
  }

  function updateVolumeIcon(vol) {
    if (!volumeIcon) return;
    if (vol === 0) {
      volumeIcon.textContent = '🔇';
    } else if (vol < 0.5) {
      volumeIcon.textContent = '🔉';
    } else {
      volumeIcon.textContent = '🔊';
    }
  }

  // Klik Pada Lirik untuk Melompat ke Bagian Tersebut (Interactive Karaoke)
  lyricLines.forEach((line) => {
    line.addEventListener('click', () => {
      const targetTime = parseFloat(line.dataset.time || 0);
      if (audio) {
        audio.currentTime = targetTime;
        if (audio.paused) {
          audio.play().then(() => updatePlayState(true));
        }
      }
    });
  });

  // Navigasi Keyboard: Spasi untuk Play/Pause
  document.addEventListener('keydown', (e) => {
    // Jangan picu jika pengguna sedang mengetik di input
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    if (e.code === 'Space') {
      e.preventDefault();
      togglePlayPause();
    } else if (e.code === 'ArrowRight') {
      if (audio && audio.duration) {
        audio.currentTime = Math.min(audio.duration, audio.currentTime + 5);
      }
    } else if (e.code === 'ArrowLeft') {
      if (audio) {
        audio.currentTime = Math.max(0, audio.currentTime - 5);
      }
    }
  });

  // Set initial volume
  if (audio && volumeSlider) {
    audio.volume = parseFloat(volumeSlider.value);
  }
});

