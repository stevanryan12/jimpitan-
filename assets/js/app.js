// AUTHENTICATION SYSTEM
const VALID_CREDENTIALS = {
  'admin': 'password123',
  'ketua': '123456',
  'bendahara': 'iuran2026',
  'warga': 'warga123'
};

function getAuthStatus() {
  const auth = localStorage.getItem('jimp_auth');
  return auth ? JSON.parse(auth) : null;
}

function setAuthStatus(username) {
  localStorage.setItem('jimp_auth', JSON.stringify({
    username: username,
    loginTime: new Date().toLocaleString('id-ID')
  }));
  updateUserDisplay();
}

function updateUserDisplay() {
  const auth = getAuthStatus();
  if (auth) {
    const elName = document.getElementById('userName');
    const elAvatar = document.getElementById('userAvatar');
    const elRole = document.getElementById('userRole');
    
    if (elName) elName.textContent = auth.username;
    if (elAvatar) elAvatar.textContent = auth.username.charAt(0).toUpperCase();
    
    let role = 'Administrator';
    if (auth.username === 'ketua') role = 'Ketua RT';
    if (auth.username === 'bendahara') role = 'Bendahara';
    if (auth.username === 'warga') role = 'Warga';
    if (elRole) elRole.textContent = role;
    
    applyRoleRestrictions(auth.username);
  }
}

function applyRoleRestrictions(username) {
  const isWarga = username === 'warga';
  const adminEls = document.querySelectorAll('.admin-only');
  
  adminEls.forEach(el => {
    if (isWarga) {
      el.style.display = 'none';
    } else {
      // restore display style, assuming flex or inline-flex elements will be handled by CSS if we empty the style
      el.style.display = '';
    }
  });

  // If warga tries to access restricted page, redirect to dashboard
  if (isWarga) {
    const activePage = ['laporan', 'pengaturan'].find(p => {
      const pageEl = document.getElementById('page-' + p);
      return pageEl && !pageEl.classList.contains('hidden');
    });
    if (activePage) showPage('daftar');
  }
}

function handleLogin(event) {
  event.preventDefault();
  const username = document.getElementById('loginUsername').value.trim();
  const password = document.getElementById('loginPassword').value;

  if (VALID_CREDENTIALS[username] === password) {
    setAuthStatus(username);
    window.location.href = 'index.html';
  } else {
    document.getElementById('loginPassword').value = '';
    toast('Username atau password salah', '<i class="ti ti-alert-circle"></i>');
  }
}

function handleLogout() {
  showModal({
    title: 'Keluar Sistem',
    desc: 'Apakah Anda yakin ingin keluar dari sistem Jimpitan?',
    icon: 'ti ti-logout',
    iconClass: 'danger',
    btnConfirmText: 'Ya, Keluar',
    btnConfirmClass: 'btn-danger',
    onConfirm: () => {
      localStorage.removeItem('jimp_auth');
      window.location.href = 'login.html';
    }
  });
}

function showMainApp() {
  // Deprecated since using separate files
}

function checkAuth() {
  const auth = getAuthStatus();
  const isLoginPage = window.location.pathname.endsWith('login.html');
  
  if (auth && isLoginPage) {
    window.location.href = 'index.html';
  } else if (!auth && !isLoginPage) {
    window.location.href = 'login.html';
  } else if (auth && !isLoginPage) {
    updateUserDisplay();
  }
}

// DATA SYSTEM
let houses = JSON.parse(localStorage.getItem('jimp_houses')) || [
  { id: 1, r: 'Blok A1', p: 'Budi Santoso', s: false, w: null },
  { id: 2, r: 'Blok A2', p: 'Slamet Riyadi', s: false, w: null },
  { id: 3, r: 'Blok A3', p: 'Joko Widodo', s: false, w: null },
  { id: 4, r: 'Blok A4', p: 'Rina Nose', s: false, w: null },
  { id: 5, r: 'Blok A5', p: 'Agus Harimurti', s: false, w: null },
  { id: 6, r: 'Blok B1', p: 'Dewi Persik', s: false, w: null },
  { id: 7, r: 'Blok B2', p: 'Rudi Hartono', s: false, w: null },
  { id: 8, r: 'Blok B3', p: 'Andi Mallarangeng', s: false, w: null },
  { id: 9, r: 'Blok B4', p: 'Yanto Basna', s: false, w: null },
  { id: 10, r: 'Blok B5', p: 'Siti Nurhaliza', s: false, w: null },
  { id: 11, r: 'Blok C1', p: 'Bayu Skak', s: false, w: null },
  { id: 12, r: 'Blok C2', p: 'Dian Sastro', s: false, w: null },
  { id: 13, r: 'Blok C3', p: 'Tono Wiyono', s: false, w: null },
  { id: 14, r: 'Blok C4', p: 'Asep Sunandar', s: false, w: null },
  { id: 15, r: 'Blok C5', p: 'Nina Zatulini', s: false, w: null },
  { id: 16, r: 'Blok D1', p: 'Lukman Sardi', s: false, w: null },
  { id: 17, r: 'Blok D2', p: 'Wawan Hendrawan', s: false, w: null },
  { id: 18, r: 'Blok D3', p: 'Fajar Alfian', s: false, w: null },
  { id: 19, r: 'Blok D4', p: 'Rizki Billar', s: false, w: null },
  { id: 20, r: 'Blok D5', p: 'Hendra Setiawan', s: false, w: null },
  { id: 21, r: 'Blok E1', p: 'Yoga Pratama', s: false, w: null },
  { id: 22, r: 'Blok E2', p: 'Farah Quinn', s: false, w: null },
  { id: 23, r: 'Blok E3', p: 'Maya Septha', s: false, w: null },
  { id: 24, r: 'Blok E4', p: 'Indra Bekti', s: false, w: null },
  { id: 25, r: 'Blok E5', p: 'Reza Rahadian', s: false, w: null },
  { id: 26, r: 'Blok F1', p: 'Tari Utama', s: false, w: null },
  { id: 27, r: 'Blok F2', p: 'Udin Sedunia', s: false, w: null },
  { id: 28, r: 'Blok F3', p: 'Nando Kusuma', s: false, w: null },
  { id: 29, r: 'Blok F4', p: 'Putri Titian', s: false, w: null },
  { id: 30, r: 'Blok F5', p: 'Ilham Jaya', s: false, w: null }
];
let riwayat = JSON.parse(localStorage.getItem('jimp_riwayat')) || [];
let nominal = parseInt(localStorage.getItem('jimp_nominal')) || 5000;

function save() {
  localStorage.setItem('jimp_houses', JSON.stringify(houses));
  localStorage.setItem('jimp_riwayat', JSON.stringify(riwayat));
}

function toast(msg, icon) {
  const el = document.getElementById('toastEl');
  el.innerHTML = (icon || '<i class="ti ti-check"></i>') + ' ' + msg;
  el.classList.add('show');
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove('show'), 3000);
}

function showPage(name) {
  ['daftar', 'data', 'riwayat', 'laporan', 'pengaturan', 'tentang'].forEach(p => {
    const pageEl = document.getElementById('page-' + p);
    const navEl = document.getElementById('nav-' + p);
    if (pageEl) pageEl.classList.add('hidden');
    if (navEl) navEl.classList.remove('active');
  });
  
  const pageTarget = document.getElementById('page-' + name);
  if (pageTarget) {
    pageTarget.classList.remove('hidden');
    // smooth entrance
    pageTarget.style.animation = 'none';
    void pageTarget.offsetWidth;
    pageTarget.style.animation = 'fadeInScale 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards';
  }
  
  const navTarget = document.getElementById('nav-' + name);
  if (navTarget) navTarget.classList.add('active');

  const titles = {
    'daftar': { t: 'Beranda Utama', s: 'Ringkasan jimpitan warga bulan ini' },
    'data': { t: 'Warga & Tagihan', s: 'Kelola data rumah dan iuran' },
    'riwayat': { t: 'Riwayat Pembayaran', s: 'Data historis semua transaksi masuk' },
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

  if (name === 'riwayat') renderRiwayat();
  if (name === 'laporan') renderLaporan();
  if (name === 'pengaturan') document.getElementById('nominalInput').value = nominal;

  // Auto close sidebar on mobile if open
  closeSidebar();
}

function bayar(id) {
  const h = houses.find(x => x.id === id);
  if (!h || h.s) return;
  
  showModal({
    title: 'Konfirmasi Pembayaran',
    desc: `Apakah Anda yakin ingin mencatat pembayaran LUNAS untuk rumah <b>${h.r}</b> (${h.p})?`,
    icon: 'ti ti-cash',
    iconClass: 'primary',
    btnConfirmText: 'Ya, Bayar Lunas',
    btnConfirmClass: 'btn-primary',
    onConfirm: () => {
      h.s = true; h.w = new Date().toLocaleString('id-ID');
      riwayat.unshift({ r: h.r, p: h.p, w: h.w });
      save(); renderAll();
      toast(h.r + ' berhasil bayar!', '<i class="ti ti-circle-check"></i>');
    }
  });
}

function resetData() {
  showModal({
    title: 'Reset Data Bulan Ini',
    desc: 'Semua data pembayaran bulan ini akan dihapus secara permanen. Apakah Anda yakin?',
    icon: 'ti ti-alert-triangle',
    iconClass: 'warning',
    btnConfirmText: 'Ya, Reset Semua',
    btnConfirmClass: 'btn-danger',
    onConfirm: () => {
      houses = houses.map(h => ({ ...h, s: false, w: null }));
      riwayat = []; save(); renderAll();
      toast('Data berhasil direset', '<i class="ti ti-refresh"></i>');
    }
  });
}

function saveNominal() {
  nominal = parseInt(document.getElementById('nominalInput').value) || 5000;
  localStorage.setItem('jimp_nominal', nominal);
  updateStats(); toast('Nominal disimpan: Rp ' + nominal.toLocaleString('id-ID'));
}

function exportCSV() {
  const rows = [['No', 'Rumah', 'Pemilik', 'Status', 'Waktu', 'Nominal']];
  houses.forEach((h, i) => rows.push([i + 1, h.r, h.p, h.s ? 'Lunas' : 'Belum', h.w || '-', 'Rp ' + nominal.toLocaleString('id-ID')]));
  const blob = new Blob([rows.map(r => r.join(',')).join('\n')], { type: 'text/csv' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
  a.download = 'jimpitan_' + (document.getElementById('bulanSelect').value || 'data') + '.csv';
  a.click(); toast('Export berhasil!');
}

function updateStats() {
  const s = houses.filter(h => h.s).length;
  const b = houses.length - s;
  const pct = Math.round((s / houses.length) * 100) || 0;
  document.getElementById('sTotal').textContent = houses.length;
  document.getElementById('sSudah').textContent = s;
  document.getElementById('sBelum').textContent = b;
  document.getElementById('sTerkumpul').textContent = 'Rp ' + (s * nominal).toLocaleString('id-ID');
  document.getElementById('toolbarProg').style.width = pct + '%';
  document.getElementById('toolbarPct').textContent = pct + '%';
}

function renderCards() {
  const q = document.getElementById('searchInput').value.toLowerCase();
  const f = document.getElementById('filterSel').value;
  const filtered = houses.filter(h => {
    const ms = h.r.toLowerCase().includes(q) || h.p.toLowerCase().includes(q);
    const mf = f === 'all' || (f === 'paid' && h.s) || (f === 'unpaid' && !h.s);
    return ms && mf;
  });
  
  if (filtered.length === 0) {
    document.getElementById('cardsGrid').innerHTML = '<div style="grid-column: 1/-1" class="empty-state"><i class="ti ti-search"></i><h3>Data tidak ditemukan</h3><p>Coba gunakan kata kunci lain</p></div>';
    return;
  }
  
  document.getElementById('cardsGrid').innerHTML = filtered.map(h => `
  <div class="house-card ${h.s ? 'paid' : 'unpaid'}">
    <div class="card-header">
      <div class="card-no">${h.id}</div>
      <span class="badge ${h.s ? 'badge-paid' : 'badge-unpaid'}">${h.s ? 'LUNAS' : 'BELUM'}</span>
    </div>
    <div class="card-info">
      <div class="card-name">${h.r}</div>
      <div class="card-owner"><i class="ti ti-user-circle"></i>${h.p}</div>
    </div>
    <div class="qr-box">
      <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=RUMAH-${h.id}" loading="lazy" alt="QR ${h.r}" />
      <div class="qr-hint">Scan QR untuk detail</div>
    </div>
    ${!h.s
      ? `<button class="btn-pay admin-only" onclick="bayar(${h.id})"><i class="ti ti-credit-card"></i> Bayar Iuran</button>`
      : `<div class="paid-stamp"><i class="ti ti-circle-check-filled"></i> ${h.w}</div>`}
  </div>
`).join('');
}

let paymentChartInstance = null;

function renderChart() {
  const sudah = houses.filter(h => h.s).length;
  const belum = houses.filter(h => !h.s).length;

  const ctx = document.getElementById('paymentChart');
  if (!ctx) return;

  if (paymentChartInstance) {
    paymentChartInstance.data.datasets[0].data = [sudah, belum];
    paymentChartInstance.update();
    return;
  }

  paymentChartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Sudah Bayar Lunas', 'Belum Bayar'],
      datasets: [{
        data: [sudah, belum],
        backgroundColor: [
          '#10B981', // success
          '#F59E0B'  // warning
        ],
        borderWidth: 0,
        hoverOffset: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            font: {
              family: "'Plus Jakarta Sans', sans-serif",
              size: 14,
              weight: '700'
            },
            padding: 24,
            usePointStyle: true,
            pointStyle: 'circle'
          }
        }
      },
      cutout: '75%'
    }
  });
}

function renderRiwayat() {
  document.getElementById('riwayatBody').innerHTML = riwayat.length
    ? riwayat.map((r, i) => `
      <tr>
        <td style="color:var(--text3);font-weight:700">${i + 1}</td>
        <td><b>${r.r}</b></td>
        <td>${r.p}</td>
        <td style="color:var(--text3)"><i class="ti ti-clock" style="vertical-align:-2px;margin-right:4px"></i>${r.w}</td>
        <td style="color:var(--success);font-weight:800">Rp ${nominal.toLocaleString('id-ID')}</td>
        <td><span class="badge badge-paid">LUNAS</span></td>
      </tr>`).join('')
    : '<tr><td colspan="6"><div class="empty-state"><i class="ti ti-receipt-off"></i><h3>Belum ada riwayat pembayaran</h3></div></td></tr>';
}

function renderLaporan() {
  const s = houses.filter(h => h.s).length;
  const b = houses.length - s;
  const pct = Math.round((s / houses.length) * 100) || 0;
  document.getElementById('bulanLaporan').textContent = document.getElementById('bulanSelect').value;
  document.getElementById('laporanPct').textContent = pct + '%';
  setTimeout(() => { document.getElementById('laporanBar').style.width = pct + '%'; }, 100);
  document.getElementById('laporanGrid').innerHTML = `
  <div class="stat-card s-green">
    <div class="stat-icon"><i class="ti ti-circle-check"></i></div>
    <div>
      <div class="stat-label">Sudah Bayar</div>
      <div class="stat-value">${s} <span style="font-size:16px;color:var(--text2);font-weight:600">rumah</span></div>
    </div>
  </div>
  <div class="stat-card s-amber">
    <div class="stat-icon"><i class="ti ti-clock"></i></div>
    <div>
      <div class="stat-label">Belum Bayar</div>
      <div class="stat-value">${b} <span style="font-size:16px;color:var(--text2);font-weight:600">rumah</span></div>
    </div>
  </div>
  <div class="stat-card s-purple">
    <div class="stat-icon"><i class="ti ti-currency-dollar"></i></div>
    <div>
      <div class="stat-label">Total Terkumpul</div>
      <div class="stat-value">Rp ${(s * nominal).toLocaleString('id-ID')}</div>
    </div>
  </div>
  <div class="stat-card s-blue">
    <div class="stat-icon"><i class="ti ti-chart-pie"></i></div>
    <div>
      <div class="stat-label">Persentase Lunas</div>
      <div class="stat-value">${pct}%</div>
    </div>
  </div>
`;
}

function renderAll() { 
  updateStats(); 
  renderCards(); 
  renderChart(); 
  
  const auth = getAuthStatus();
  if (auth) {
    applyRoleRestrictions(auth.username);
  }
}

// Mobile Sidebar Toggle Functions
function openSidebar() {
  document.getElementById('sidebar').classList.add('show');
  document.getElementById('sidebarOverlay').classList.add('show');
}

function closeSidebar() {
  document.getElementById('sidebar').classList.remove('show');
  document.getElementById('sidebarOverlay').classList.remove('show');
}

// Initialize on page load
function initApp() {
  checkAuth();
  const isLoginPage = window.location.pathname.endsWith('login.html');
  if (!isLoginPage) {
    renderAll();
  }
}

// Modal UI Control
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

if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
