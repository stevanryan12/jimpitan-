// AUTHENTICATION SYSTEM
const VALID_CREDENTIALS = {
  'admin': 'password123',
  'ketua': '123456',
  'bendahara': 'iuran2026',
  'warga': 'warga123'
};

function getAuthStatus() {
  try {
    const auth = localStorage.getItem('jimp_auth');
    return auth ? JSON.parse(auth) : null;
  } catch (e) {
    console.error("Failed to parse auth status:", e);
    return null;
  }
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
  const isAdmin = username === 'admin';
  const isBendahara = username === 'bendahara';
  const isKetua = username === 'ketua';
  const isWarga = username === 'warga';
  
  const adminEls = document.querySelectorAll('.admin-only');
  const wargaEls = document.querySelectorAll('.warga-only');
  const bendaharaOnlyEls = document.querySelectorAll('.bendahara-only');
  const adminRoleOnlyEls = document.querySelectorAll('.admin-role-only');
  const editorOnlyEls = document.querySelectorAll('.editor-only');
  const adminKetuaOnlyEls = document.querySelectorAll('.admin-ketua-only');
  
  adminEls.forEach(el => {
    el.style.display = isWarga ? 'none' : '';
  });

  wargaEls.forEach(el => {
    el.style.display = isWarga ? 'flex' : 'none';
  });

  bendaharaOnlyEls.forEach(el => {
    el.style.display = isBendahara ? '' : 'none';
  });

  adminRoleOnlyEls.forEach(el => {
    el.style.display = isAdmin ? '' : 'none';
  });

  editorOnlyEls.forEach(el => {
    el.style.display = (isBendahara || isKetua) ? '' : 'none';
  });

  adminKetuaOnlyEls.forEach(el => {
    el.style.display = (isAdmin || isKetua) ? '' : 'none';
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

function autoFillLogin(username, password) {
  const uEl = document.getElementById('loginUsername');
  const pEl = document.getElementById('loginPassword');
  if (uEl) uEl.value = username;
  if (pEl) pEl.value = password;
  
  toast(`Mengisi kredensial: ${username}`, '<i class="ti ti-user-check"></i>');
  
  const form = document.querySelector('.login-form');
  if (form) {
    setTimeout(() => {
      form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }, 500);
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
