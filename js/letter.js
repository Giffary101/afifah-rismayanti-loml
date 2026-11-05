/**
 * Logika Interaktif Buku Catatan Kecil: Surat & Doa Mendalam (letter.html)
 * Mendukung animasi balik halaman realistis horisontal 3D, suara gesekan lembaran kertas, dan navigasi nomor
 */

document.addEventListener('DOMContentLoaded', () => {
  // Pengaman Akses: Pastikan pengunjung sudah diverifikasi admin
  if (sessionStorage.getItem('access_verified') !== 'true') {
    window.location.replace('index.html');
    return;
  }

  const sheets = document.querySelectorAll('.notebook-sheet');
  const prevBtn = document.getElementById('book-prev-btn');
  const nextBtn = document.getElementById('book-next-btn');
  const paginationContainer = document.getElementById('book-pagination');
  const btnOpenBook = document.getElementById('btn-open-book');
  const btnRestartBook = document.getElementById('btn-restart-book');

  let currentSheet = 0;
  let isAnimating = false;
  const totalSheets = sheets.length;

  // Nama label untuk setiap lembaran di bilah navigasi bawah
  const sheetLabels = [
    'Cover Depan',
    '1',
    '2',
    '3',
    '4',
    'Cover Belakang'
  ];

  // Inisialisasi Tombol Navigasi Nomor Halaman
  function buildPagination() {
    if (!paginationContainer) return;
    paginationContainer.innerHTML = '';

    sheets.forEach((_, idx) => {
      const btn = document.createElement('button');
      btn.className = `page-num-pill ${idx === 0 ? 'active' : ''}`;
      btn.textContent = sheetLabels[idx] || `Hal ${idx}`;
      btn.dataset.sheet = idx;
      btn.setAttribute('aria-label', `Buka ${sheetLabels[idx] || 'Halaman ' + idx}`);

      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        goToSheet(idx);
      });

      paginationContainer.appendChild(btn);
    });
  }

  // Beralih ke Halaman Tertentu dengan Animasi Balik Halaman Horisontal 3D
  function goToSheet(index) {
    if (index < 0 || index >= totalSheets || index === currentSheet || isAnimating) return;

    const isNext = index > currentSheet;
    const oldSheet = sheets[currentSheet];
    const newSheet = sheets[index];

    isAnimating = true;

    // Mainkan efek suara lembaran kertas bergeser
    if (window.AudioApp) {
      window.AudioApp.init();
      if (typeof window.AudioApp.playPageFlip === 'function') {
        window.AudioApp.playPageFlip();
      }
    }

    // Efek partikel bunga sakura kecil saat membuka lembaran
    if (typeof window.createBurstParticles === 'function' && newSheet) {
      const rect = newSheet.getBoundingClientRect();
      window.createBurstParticles(rect.left + rect.width / 2, rect.top + rect.height / 3, 24);
    }

    // Bersihkan sisa animasi sebelumnya jika ada
    sheets.forEach((s) => {
      s.classList.remove('flip-out-left', 'flip-in-right', 'flip-out-right', 'flip-in-left');
    });

    // Terapkan animasi balik lembaran horisontal (bukan atas-bawah)
    if (isNext) {
      oldSheet.classList.add('flip-out-left');
      newSheet.classList.add('active', 'flip-in-right');
    } else {
      oldSheet.classList.add('flip-out-right');
      newSheet.classList.add('active', 'flip-in-left');
    }

    // Tunggu animasi selesai (~550ms)
    setTimeout(() => {
      oldSheet.classList.remove('active', 'flip-out-left', 'flip-out-right');
      newSheet.classList.remove('flip-in-right', 'flip-in-left');
      isAnimating = false;
    }, 550);

    currentSheet = index;

    // Update tombol Prev & Next
    if (prevBtn) prevBtn.disabled = currentSheet === 0;
    if (nextBtn) nextBtn.disabled = currentSheet === totalSheets - 1;

    // Update highlight tombol nomor halaman
    if (paginationContainer) {
      const pills = paginationContainer.querySelectorAll('.page-num-pill');
      pills.forEach((p, idx) => {
        if (idx === currentSheet) {
          p.classList.add('active');
        } else {
          p.classList.remove('active');
        }
      });
    }
  }

  // Tombol Lembar Sebelumnya & Berikutnya
  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (currentSheet > 0) {
        goToSheet(currentSheet - 1);
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (currentSheet < totalSheets - 1) {
        goToSheet(currentSheet + 1);
      }
    });
  }

  // Tombol khusus Buka Buku & Tutup Buku
  if (btnOpenBook) {
    btnOpenBook.addEventListener('click', (e) => {
      e.stopPropagation();
      goToSheet(1);
    });
  }

  if (btnRestartBook) {
    btnRestartBook.addEventListener('click', (e) => {
      e.stopPropagation();
      goToSheet(0);
    });
  }

  // Klik langsung pada lembaran untuk membalik halaman
  sheets.forEach((sheet, idx) => {
    sheet.addEventListener('click', (e) => {
      if (isAnimating) return;
      // Jika klik cover depan -> buka halaman 1
      if (idx === 0) {
        goToSheet(1);
      } 
      // Jika klik cover belakang -> kembali ke awal
      else if (idx === totalSheets - 1) {
        goToSheet(0);
      } 
      // Jika halaman dalam -> klik sisi kanan maju, klik sisi kiri mundur
      else {
        const rect = sheet.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        if (clickX > rect.width * 0.45) {
          if (currentSheet < totalSheets - 1) goToSheet(currentSheet + 1);
        } else {
          if (currentSheet > 0) goToSheet(currentSheet - 1);
        }
      }
    });
  });

  // Navigasi Keyboard (Panah Kiri & Kanan di Desktop)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
      if (currentSheet < totalSheets - 1) goToSheet(currentSheet + 1);
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
      if (currentSheet > 0) goToSheet(currentSheet - 1);
    }
  });

  // Navigasi Usap Layar (Touch Swipe) untuk HP
  let touchStartX = 0;
  let touchEndX = 0;

  document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {
    if (isAnimating) return;
    const swipeThreshold = 40;
    if (touchEndX < touchStartX - swipeThreshold) {
      // Geser ke kiri -> Halaman berikutnya (maju)
      if (currentSheet < totalSheets - 1) goToSheet(currentSheet + 1);
    }
    if (touchEndX > touchStartX + swipeThreshold) {
      // Geser ke kanan -> Halaman sebelumnya (mundur)
      if (currentSheet > 0) goToSheet(currentSheet - 1);
    }
  }

  // Bangun navigasi awal
  buildPagination();
  if (prevBtn) prevBtn.disabled = true;
});
