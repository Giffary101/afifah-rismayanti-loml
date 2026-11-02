/**
 * Logika Klise Roll Film 35mm (timeline.html)
 * Fokus murni pada tampilan roll film amber/oranye persis seperti gambar
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements - Roll Film & Dynamic Background
  const timelineBgPhoto = document.getElementById('timeline-bg-photo');
  const filmTrack = document.getElementById('film-track');
  const filmTrackViewport = document.getElementById('film-track-viewport');

  let activeFrameIndex = 0;

  // ==========================================
  // DATA TIMELINE ROLL FILM KENANGAN
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

  // Render Frame-frame Klise Roll Film
  function renderFilmFrames() {
    if (!filmTrack) return;
    filmTrack.innerHTML = '';

    timelineMoments.forEach((moment, index) => {
      const frameEl = document.createElement('div');
      frameEl.className = `negative-frame ${index === 0 ? 'active' : ''}`;
      frameEl.dataset.index = index;

      frameEl.innerHTML = `
        <div class="negative-photo-box">
          <img src="${moment.image}" alt="Foto Kenangan ${index + 1}" class="frame-img" loading="lazy">
          <!-- TANGGAL DI ATAS KANAN FOTO (FONT ANALOG MASA LALU) -->
          <div class="frame-date-badge">${moment.dateStamp}</div>
        </div>
      `;

      frameEl.addEventListener('click', () => {
        setActiveFrame(index, true);
      });

      filmTrack.appendChild(frameEl);
    });
  }

  renderFilmFrames();

    // Menghitung posisi scroll presisi sesuai permintaan alur:
  // 1. Foto 1 (index 0): langsung berada di paling kiri (scrollLeft = 0).
  // 2. Foto 2 (index 1): tetap berada di tempat (belum bergeser, scrollLeft = 0).
  // 3. Foto 3 (index 2) s/d Foto sebelum terakhir (N - 2): bergeser menempatkan foto terpilih tepat di tengah layar.
  // 4. Foto terakhir (N - 1): berada di paling kanan tanpa merubah tempat scroll dari foto sebelum terakhir.
  function getScrollForFrame(index) {
    if (!filmTrackViewport || !filmTrack) return 0;
    const frames = filmTrack.querySelectorAll('.negative-frame');
    const totalFrames = frames.length;
    if (totalFrames === 0) return 0;

    const maxScroll = Math.max(0, filmTrackViewport.scrollWidth - filmTrackViewport.clientWidth);

    // 1. Foto pertama (index 0) berada di paling kiri
    if (index === 0) {
      return 0;
    }

    // 2. Foto kedua (index 1) tetap di tempat (belum bergeser dari posisi 0)
    if (index === 1) {
      return 0;
    }

    // 3. Foto terakhir (index N - 1):
    // Berada di paling kanan tanpa merubah posisi scroll dari foto sebelum terakhir (N - 2)
    if (index === totalFrames - 1) {
      if (totalFrames >= 2) {
        const prevFrame = frames[totalFrames - 2];
        const prevCenter = prevFrame.offsetLeft + prevFrame.offsetWidth / 2;
        const target = prevCenter - filmTrackViewport.clientWidth / 2;
        return Math.max(0, Math.min(maxScroll, target));
      }
      return maxScroll;
    }

    // 4. Foto tengah (index 2 s/d N - 2): menempatkan foto terpilih tepat di tengah layar
    const targetFrame = frames[index];
    if (targetFrame) {
      const frameCenter = targetFrame.offsetLeft + targetFrame.offsetWidth / 2;
      const target = frameCenter - filmTrackViewport.clientWidth / 2;
      return Math.max(0, Math.min(maxScroll, target));
    }

    return 0;
  }

  // Mengaktifkan Foto yang Dipilih
  
  // ==========================================
  // LOGIKA KARTU JUDUL & DESKRIPSI MOMEN DI BAWAH ROLL
  // ==========================================
  const filmStoryCard = document.getElementById('film-story-card');
  const storyDateBadge = document.getElementById('story-date-badge');
  const storyTitle = document.getElementById('story-title');
  const storyDesc = document.getElementById('story-desc');
  let storyFadeTimer = null;

  function updateStoryCard(index) {
    if (!filmStoryCard || index < 0 || index >= timelineMoments.length) return;
    const moment = timelineMoments[index];

    if (storyFadeTimer) clearTimeout(storyFadeTimer);

    // Fade-out sekejap, perbarui data cerita, lalu fade-in halus
    filmStoryCard.classList.remove('visible');

    storyFadeTimer = setTimeout(() => {
      if (storyDateBadge) {
        storyDateBadge.textContent = moment.fullDate || moment.dateStamp;
      }
      if (storyTitle) {
        storyTitle.textContent = moment.title;
      }
      if (storyDesc) {
        storyDesc.textContent = moment.desc;
      }
      filmStoryCard.classList.add('visible');
    }, 180);
  }

  function setActiveFrame(index, shouldScroll = false) {
    if (index < 0 || index >= timelineMoments.length || !filmTrack) return;

    const frames = filmTrack.querySelectorAll('.negative-frame');
    frames.forEach((f, idx) => {
      if (idx === index) {
        f.classList.add('active');
      } else {
        f.classList.remove('active');
      }
    });

    activeFrameIndex = index;

    // 1. UPDATE LATAR BELAKANG:
    const selectedMoment = timelineMoments[index];
    if (timelineBgPhoto) {
      timelineBgPhoto.style.backgroundImage = `url('${selectedMoment.image}')`;
    }

    // 2. Navigasi scroll sesuai aturan presisi
    if (shouldScroll && frames[index]) {
      const targetScroll = getScrollForFrame(index);

      // Jika posisi scroll berbeda, geser secara smooth
      if (Math.abs(filmTrackViewport.scrollLeft - targetScroll) > 4) {
        filmTrackViewport.scrollTo({
          left: targetScroll,
          behavior: 'smooth'
        });
      }
      // Jika targetScroll sama (seperti foto 0 & 1, atau N-2 & N-1), viewport tetap diam tanpa bergeser!

      if (window.AudioApp) {
        window.AudioApp.playShutter();
      }
    }

    // 3. Perbarui judul & deskripsi di bawah roll dengan animasi fade
    if (!isRollingCylinder) {
      updateStoryCard(index);
    }
  }

  // Set latar belakang inisial
  if (timelineMoments[0] && timelineBgPhoto) {
    timelineBgPhoto.style.backgroundImage = `url('${timelineMoments[0].image}')`;
  }

  // Navigasi Keyboard (Panah Kiri & Kanan di Desktop)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      if (activeFrameIndex > 0) {
        setActiveFrame(activeFrameIndex - 1, true);
      } else {
        setActiveFrame(timelineMoments.length - 1, true);
      }
    } else if (e.key === 'ArrowRight') {
      if (activeFrameIndex < timelineMoments.length - 1) {
        setActiveFrame(activeFrameIndex + 1, true);
      } else {
        setActiveFrame(0, true);
      }
    }
  });

  // Listener Scroll dari kiri ke kanan: Otomatis mendeteksi frame yang berada di tengah
  let scrollTimeout = null;
  if (filmTrackViewport) {
    filmTrackViewport.addEventListener('scroll', () => {
      if (scrollTimeout) clearTimeout(scrollTimeout);

      scrollTimeout = setTimeout(() => {
        const viewportRect = filmTrackViewport.getBoundingClientRect();
        const viewportCenter = viewportRect.left + viewportRect.width / 2;

        const frames = filmTrack.querySelectorAll('.negative-frame');
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
          if (window.AudioApp) {
            window.AudioApp.playShutter();
          }
        }
      }, 60);
    });
  }

  // ==========================================
  // LOGIKA INTRO COUNTDOWN & ANIMASI LAMPU MENYALA VINTAGE
  // ==========================================
  const introOverlay = document.getElementById('intro-overlay');
  const skipIntroBtn = document.getElementById('skip-intro-btn');
  const vintageLamp = document.getElementById('vintage-lamp');
  const countdownNumber = document.getElementById('countdown-number');
  const countdownTitle = document.getElementById('countdown-title');
  const countdownSubtitle = document.getElementById('countdown-subtitle');
  const countdownPanel = document.getElementById('countdown-panel');
  const introBloomFlash = document.getElementById('intro-bloom-flash');
  const replayLampBtn = document.getElementById('replay-lamp-btn');

  let introTimeouts = [];

  function clearIntroTimeouts() {
    introTimeouts.forEach(t => clearTimeout(t));
    introTimeouts = [];
  }

  
  
  
  
  
  // ==========================================
  // LOGIKA KEPALA ROLL 3D BERPUTAR MENGGELINDING DI LANTAI DARI KANAN KE KIRI
  // (Latar belakang roll di-hide, lalu terbuka mengikuti kepala roll)
  // ==========================================
  const filmStage = document.getElementById('film-stage');
  const filmStripWrapper = document.getElementById('film-strip-wrapper');
  const filmEndSpool = document.getElementById('film-end-spool');
  const rollFilmBtn = document.getElementById('roll-film-btn');
  const triggerRollBtn = document.getElementById('trigger-roll-btn');

  let isRollingCylinder = false;
  let cylinderAnimFrame = null;

  // Inisialisasi awal: Sembunyikan latar belakang roll & siapkan kepala roll di kanan
  function initRollHiddenState() {
    if (filmStripWrapper) {
      filmStripWrapper.style.clipPath = 'inset(0 0 0 100%)';
    }
    if (filmStoryCard) {
      filmStoryCard.classList.remove('visible');
    }
    if (filmEndSpool && filmStage) {
      const maxDist = Math.max(0, filmStage.clientWidth - filmEndSpool.offsetWidth);
      filmEndSpool.style.transform = `translateX(${maxDist}px)`;
      filmEndSpool.classList.remove('rolling-spin');
    }
  }

  function triggerCylinderRollAnimation() {
    if (!filmStage || !filmStripWrapper || !filmEndSpool || isRollingCylinder) return;
    isRollingCylinder = true;

    if (cylinderAnimFrame) {
      cancelAnimationFrame(cylinderAnimFrame);
      cylinderAnimFrame = null;
    }

    // Reset posisi scroll foto ke frame awal
    if (filmTrackViewport) {
      filmTrackViewport.style.scrollBehavior = 'auto';
      filmTrackViewport.scrollLeft = 0;
    }

    const stageWidth = filmStage.clientWidth || window.innerWidth;
    const spoolWidth = filmEndSpool.offsetWidth || 76;
    const maxDist = Math.max(0, stageWidth - spoolWidth);

    // 1. Latar belakang roll di-hide & kartu deskripsi tidak muncul dulu saat roll berjalan
    filmStripWrapper.style.clipPath = `inset(0 0 0 ${stageWidth}px)`;
    if (filmStoryCard) {
      filmStoryCard.classList.remove('visible');
    }

    // 2. Kepala roll mulai di ujung kanan & aktifkan animasi 3D putaran silinder di lantai
    filmEndSpool.style.transform = `translateX(${maxDist}px)`;
    filmEndSpool.classList.add('rolling-spin');

    // 3. Mainkan audio silinder berputar menggelinding di lantai
    if (window.AudioApp && (window.AudioApp.playCylinderRoll || window.AudioApp.playFilmRolling)) {
      const playAudio = window.AudioApp.playCylinderRoll || window.AudioApp.playFilmRolling;
      playAudio(2600);
    }

    // 4. Animasi kepala roll berjalan dari kanan ke kiri (2.6 detik)
    const startTime = performance.now();
    const duration = 2600; // 2.6 detik gerakan mantap & berbobot

    function stepCylinder(now) {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);

      // Easing: Meluncur kencang di awal lalu deselerasi lembut saat mendekati ujung kiri
      const ease = 1 - Math.pow(1 - t, 2.8);

      // Posisi X kepala roll dari kanan (maxDist) menuju kiri (0)
      const currentX = (1 - ease) * maxDist;
      filmEndSpool.style.transform = `translateX(${currentX}px)`;

      // 5. Latar belakang terbuka mengikuti pergerakan kepala roll dari kanan ke kiri
      // Bagian di sebelah kanan kepala roll terbuka, di depan kepala roll tetap di-hide
      const revealCut = Math.max(0, currentX + (spoolWidth * 0.45));
      filmStripWrapper.style.clipPath = `inset(0 0 0 ${revealCut}px)`;

      if (t < 1) {
        cylinderAnimFrame = requestAnimationFrame(stepCylinder);
      } else {
        // Tiba di ujung kiri (0px)
        filmEndSpool.style.transform = 'none';
        filmEndSpool.classList.remove('rolling-spin');

        // Latar belakang roll terbuka 100% sempurna
        filmStripWrapper.style.clipPath = 'none';

        if (filmTrackViewport) {
          filmTrackViewport.style.scrollBehavior = 'smooth';
        }

        // Aktifkan frame foto pertama
        setActiveFrame(0, true);

        // Setelah semua roll selesai berjalan, otomatis judul & deskripsi muncul animasi fade
        isRollingCylinder = false;
        updateStoryCard(0);

        if (window.AudioApp) {
          window.AudioApp.playShutter();
        }
      }
    }

    cylinderAnimFrame = requestAnimationFrame(stepCylinder);
  }

  // Tombol aksi manual
  if (rollFilmBtn) {
    rollFilmBtn.addEventListener('click', () => {
      triggerCylinderRollAnimation();
    });
  }

  if (triggerRollBtn) {
    triggerRollBtn.addEventListener('click', () => {
      triggerCylinderRollAnimation();
    });
  }

  // Siapkan kondisi awal saat DOM dimuat
  initRollHiddenState();

  function startLampIntroSequence() {
    if (!introOverlay) return;

    clearIntroTimeouts();

    // Reset Visual State
    introOverlay.style.visibility = 'visible';
    introOverlay.classList.remove('fade-out');
    if (vintageLamp) {
      vintageLamp.classList.remove('lamp-on', 'igniting');
    }
    if (introBloomFlash) {
      introBloomFlash.classList.remove('active');
    }
    if (countdownPanel) {
      countdownPanel.style.opacity = '1';
      countdownPanel.style.transform = 'translateY(0)';
    }

    // Set Countdown awal ke 3
    let currentCount = 3;
    if (countdownNumber) {
      countdownNumber.textContent = currentCount;
      countdownNumber.classList.remove('beat');
      void countdownNumber.offsetWidth; // trigger reflow
      countdownNumber.classList.add('beat');
    }
    if (countdownTitle) countdownTitle.textContent = "Mempersiapkan Kenangan";
    if (countdownSubtitle) countdownSubtitle.textContent = "Menghitung mundur setiap detik berharga...";

    if (window.AudioApp) {
      window.AudioApp.playTick();
    }

    // Countdown 2
    introTimeouts.push(setTimeout(() => {
      currentCount = 2;
      if (countdownNumber) {
        countdownNumber.textContent = currentCount;
        countdownNumber.classList.remove('beat');
        void countdownNumber.offsetWidth;
        countdownNumber.classList.add('beat');
      }
      if (countdownSubtitle) countdownSubtitle.textContent = "Menghangatkan lentera masa lalu...";
      if (window.AudioApp) window.AudioApp.playTick();
    }, 1000));

    // Countdown 1
    introTimeouts.push(setTimeout(() => {
      currentCount = 1;
      if (countdownNumber) {
        countdownNumber.textContent = currentCount;
        countdownNumber.classList.remove('beat');
        void countdownNumber.offsetWidth;
        countdownNumber.classList.add('beat');
      }
      if (countdownSubtitle) countdownSubtitle.textContent = "Siap membuka roll film 35mm kita...";
      if (window.AudioApp) window.AudioApp.playTick();
    }, 2000));

    // Hitung Selesai -> Lampu Flicker & Menyala Terang
    introTimeouts.push(setTimeout(() => {
      if (countdownNumber) {
        countdownNumber.textContent = "💡";
        countdownNumber.classList.remove('beat');
        void countdownNumber.offsetWidth;
        countdownNumber.classList.add('beat');
      }
      if (countdownTitle) countdownTitle.textContent = "Cahaya Cinta Menyala ✨";
      if (countdownSubtitle) countdownSubtitle.textContent = "Menyinari kisah manis Afifah Rismayanti";

      // 1. Lampu Mulai Igniting (Kedipan Saklar & Filamen)
      if (vintageLamp) {
        vintageLamp.classList.add('igniting');
      }
      if (window.AudioApp) {
        window.AudioApp.playLightSwitch();
      }

      // 2. Lampu Menyala Penuh (Glow Terang & Chime Musik)
      introTimeouts.push(setTimeout(() => {
        if (vintageLamp) {
          vintageLamp.classList.remove('igniting');
          vintageLamp.classList.add('lamp-on');
        }
        if (introBloomFlash) {
          introBloomFlash.classList.add('active');
        }
        if (window.AudioApp) {
          window.AudioApp.playChime();
        }

        // 3. Menghilangkan Kilatan & Mengungkap Timeline Roll Film
        introTimeouts.push(setTimeout(() => {
          if (introBloomFlash) {
            introBloomFlash.classList.remove('active');
          }
          if (introOverlay) {
            introOverlay.classList.add('fade-out');
          }
          // SETELAH LAMPU MENYALA: Gelindingkan roll film dari kanan ke kiri!
          triggerCylinderRollAnimation();

          // 4. Selesai transisi, sembunyikan overlay
          introTimeouts.push(setTimeout(() => {
            if (introOverlay) {
              introOverlay.style.visibility = 'hidden';
            }
          }, 1000));
        }, 650));
      }, 450));
    }, 3000));
  }

  // Tombol Lewati Intro
  if (skipIntroBtn) {
    skipIntroBtn.addEventListener('click', () => {
      clearIntroTimeouts();
      if (vintageLamp) {
        vintageLamp.classList.add('lamp-on');
      }
      if (introOverlay) {
        introOverlay.classList.add('fade-out');
        setTimeout(() => {
          introOverlay.style.visibility = 'hidden';
        }, 800);
      }
      triggerCylinderRollAnimation();
    });
  }

  // Tombol Putar Ulang Animasi Lampu
  if (replayLampBtn) {
    replayLampBtn.addEventListener('click', () => {
      startLampIntroSequence();
    });
  }

  // Jalankan Intro Otomatis saat Halaman Dimuat
  startLampIntroSequence();

});
