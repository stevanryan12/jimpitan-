// ==========================================
// UI CONTROLS, ROUTING, MODALS & BOOTSTRAP
// ==========================================

function showPage(name) {
  ['daftar', 'data', 'jadwal', 'setoran', 'pengeluaran', 'laporan', 'pengaturan', 'tentang', 'riwayat', 'berkala', 'pengeluaran-berkala'].forEach(p => {
    const pageEl = document.getElementById('page-' + p);
    const navEl = document.getElementById('nav-' + p);
    if (pageEl) pageEl.classList.add('hidden');
    if (navEl) navEl.classList.remove('active');
  });
  
  const pageTarget = document.getElementById('page-' + name);
  if (pageTarget) {
    pageTarget.classList.remove('hidden');
    pageTarget.style.animation = 'none';
    void pageTarget.offsetWidth;
    pageTarget.style.animation = 'fadeInScale 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards';
  }
  
  const navTarget = document.getElementById('nav-' + name);
  if (navTarget) navTarget.classList.add('active');

  const titles = {
    'daftar': { t: 'Beranda Utama', s: 'Ringkasan jimpitan warga bulan ini' },
    'data': { t: 'Warga & Tagihan', s: 'Kelola data rumah dan iuran' },
    'jadwal': { t: 'Jadwal Pengambilan', s: 'Jadwal petugas keliling jimpitan' },
    'setoran': { t: 'Setoran Masuk (Uang Masuk)', s: 'Tinjau dan kelola riwayat setoran masuk jimpitan warga' },
    'pengeluaran': { t: 'Uang Keluar (Pengeluaran)', s: 'Catat dan tinjau riwayat pengeluaran kas kampung' },
    'berkala': { t: 'Rincian Pembayaran Berkala', s: 'Pantau laporan kehadiran iuran harian, bulanan & tahunan' },
    'pengeluaran-berkala': { t: 'Rincian Pengeluaran Kas', s: 'Pantau laporan uang keluar harian, bulanan & tahunan' },
    'laporan': { t: 'Laporan Keuangan', s: 'Rekapitulasi keuangan bulanan' },
    'pengaturan': { t: 'Pengaturan Sistem', s: 'Konfigurasi aplikasi' },
    'tentang': { t: 'Tentang Aplikasi', s: 'Informasi sistem Jimpitan Kampung' }
  };
  
  if (titles[name]) {
    const elTitle = document.getElementById('mainTitle');
    const elSub = document.getElementById('mainSubtitle');
    if (elTitle) elTitle.textContent = titles[name].t;
    if (elSub) elSub.textContent = titles[name].s;
  }

  if (name === 'jadwal') renderJadwal();
  if (name === 'setoran') { renderSetoran(); renderRiwayat(); }
  if (name === 'pengeluaran') renderRiwayatPengeluaran();
  if (name === 'laporan') renderLaporan();
  if (name === 'pengaturan') {
    const nominalInput = document.getElementById('nominalInput');
    if (nominalInput) {
      const auth = getAuthStatus();
      nominalInput.value = nominal;
      nominalInput.readOnly = (auth?.username !== 'bendahara');
    }
  }
  if (name === 'berkala') {
    const datePicker = document.getElementById('periodDatePicker');
    if (datePicker && !datePicker.value) {
      const tzOffset = new Date().getTimezoneOffset() * 60000;
      const localISOTime = (new Date(Date.now() - tzOffset)).toISOString().slice(0, 10);
      datePicker.value = localISOTime;
    }
    setPeriodFilter(currentPeriodFilter);
  }
  if (name === 'pengeluaran-berkala') {
    const datePicker = document.getElementById('expensePeriodDatePicker');
    if (datePicker && !datePicker.value) {
      const tzOffset = new Date().getTimezoneOffset() * 60000;
      const localISOTime = (new Date(Date.now() - tzOffset)).toISOString().slice(0, 10);
      datePicker.value = localISOTime;
    }
    setPeriodExpenseFilter(currentPeriodExpenseFilter);
  }

  closeSidebar();
}

function openSidebar() {
  document.getElementById('sidebar').classList.add('show');
  document.getElementById('sidebarOverlay').classList.add('show');
}

function closeSidebar() {
  document.getElementById('sidebar').classList.remove('show');
  document.getElementById('sidebarOverlay').classList.remove('show');
}

let currentModalConfirm = null;

function showModal({ title, desc, icon, iconClass, btnConfirmText, btnConfirmClass, onConfirm }) {
  const modal = document.getElementById('customModal');
  if (!modal) return;
  
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalDesc').innerHTML = desc;
  
  const iconEl = document.getElementById('modalIcon');
  iconEl.className = 'modal-icon ' + (iconClass || 'primary');
  iconEl.innerHTML = `<i class="${icon || 'ti ti-info-circle'}"></i>`;
  
  const btnConfirm = document.getElementById('modalBtnConfirm');
  btnConfirm.textContent = btnConfirmText || 'Ya, Lanjutkan';
  btnConfirm.className = 'btn ' + (btnConfirmClass || 'btn-primary');
  
  currentModalConfirm = () => {
    closeModal();
    if(onConfirm) onConfirm();
  };
  
  modal.classList.add('show');
}

function closeModal() {
  const modal = document.getElementById('customModal');
  if (modal) modal.classList.remove('show');
  currentModalConfirm = null;
}

function renderAll() { 
  updateStats(); 
  renderCards(); 
  renderChart(); 
  renderRiwayat();
  renderRiwayatPengeluaran();
  renderSetoran();
  renderPiketHariIni();
  
  const auth = getAuthStatus();
  if (auth) {
    applyRoleRestrictions(auth.username);
  }
}

function initApp() {
  checkAuth();
  const isLoginPage = window.location.pathname.endsWith('login.html');
  if (!isLoginPage) {
    renderAll();
  }
}

if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
