/**
 * Logika Interaktif Buku Catatan Kecil: Surat & Doa Mendalam (letter.html)
 * Mendukung animasi balik halaman realistis, efek suara gesekan kertas, dan navigasi nomor
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
  const ribbon = document.querySelector('.notebook-ribbon');
  const btnOpenBook = document.getElementById('btn-open-book');
  const btnRestartBook = document.getElementById('btn-restart-book');

  let currentSheet = 0;
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

  // Beralih ke Halaman Tertentu
  function goToSheet(index) {
    if (index < 0 || index >= totalSheets || index === currentSheet) return;

    // Mainkan efek suara lembaran kertas bergeser
    if (window.AudioApp) {
      window.AudioApp.init();
      if (typeof window.AudioApp.playPageFlip === 'function') {
        window.AudioApp.playPageFlip();
      }
    }

    // Efek partikel bunga sakura kecil saat membuka lembaran
    if (typeof window.createBurstParticles === 'function' && sheets[index]) {
      const rect = sheets[index].getBoundingClientRect();
      window.createBurstParticles(rect.left + rect.width / 2, rect.top + rect.height / 3, 22);
    }

    // Update lembaran aktif
    sheets.forEach((sheet, idx) => {
      if (idx === index) {
        sheet.classList.add('active');
      } else {
        sheet.classList.remove('active');
      }
    });

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

    // Goyangkan lembut pita pembatas buku
    if (ribbon) {
      ribbon.style.transform = `rotate(${Math.sin(index * 1.5) * 4}deg) translateY(${index === 0 ? '0' : '8px'})`;
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
        if (clickX > rect.width * 0.42) {
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
    const swipeThreshold = 40;
    if (touchEndX < touchStartX - swipeThreshold) {
      // Geser ke kiri -> Halaman berikutnya
      if (currentSheet < totalSheets - 1) goToSheet(currentSheet + 1);
    }
    if (touchEndX > touchStartX + swipeThreshold) {
      // Geser ke kanan -> Halaman sebelumnya
      if (currentSheet > 0) goToSheet(currentSheet - 1);
    }
  }

  // Bangun navigasi awal
  buildPagination();
  if (prevBtn) prevBtn.disabled = true;
});
