/**
 * Logika Klise Roll Film 35mm (timeline.html)
 * Fokus murni pada tampilan roll film amber/oranye persis seperti gambar
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements - Roll Film & Dynamic Background
  const timelineBgPhoto = document.getElementById('timeline-bg-photo');
  const filmTrack = document.getElementById('film-track');
  const filmTrackViewport = document.getElementById('film-track-viewport');
  const filmPrevBtn = document.getElementById('film-prev-btn');
  const filmNextBtn = document.getElementById('film-next-btn');
  const currentFrameIdx = document.getElementById('current-frame-idx');
  const totalFramesIdx = document.getElementById('total-frames-idx');

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

  if (totalFramesIdx) {
    totalFramesIdx.textContent = timelineMoments.length;
  }

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

  // Mengaktifkan Foto yang Dipilih
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
    if (currentFrameIdx) {
      currentFrameIdx.textContent = index + 1;
    }

    // 1. UPDATE LATAR BELAKANG:
    // Menggunakan foto yang dipilih dengan FILTER COKLAT VINTAGE (diatur lewat CSS timeline-bg-photo)
    const selectedMoment = timelineMoments[index];
    if (timelineBgPhoto) {
      timelineBgPhoto.style.backgroundImage = `url('${selectedMoment.image}')`;
    }

    // 2. Animasi Scroll ke tengah viewport jika diminta
    if (shouldScroll && frames[index]) {
      frames[index].scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest'
      });
      if (window.AudioApp) {
        window.AudioApp.playShutter();
      }
    }
  }

  // Set latar belakang inisial
  if (timelineMoments[0] && timelineBgPhoto) {
    timelineBgPhoto.style.backgroundImage = `url('${timelineMoments[0].image}')`;
  }

  // Tombol Navigasi Geser
  if (filmPrevBtn) {
    filmPrevBtn.addEventListener('click', () => {
      if (activeFrameIndex > 0) {
        setActiveFrame(activeFrameIndex - 1, true);
      } else {
        setActiveFrame(timelineMoments.length - 1, true);
      }
    });
  }

  if (filmNextBtn) {
    filmNextBtn.addEventListener('click', () => {
      if (activeFrameIndex < timelineMoments.length - 1) {
        setActiveFrame(activeFrameIndex + 1, true);
      } else {
        setActiveFrame(0, true);
      }
    });
  }

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
});
