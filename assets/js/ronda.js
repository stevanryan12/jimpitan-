// ==========================================
// PIKET, JADWAL & SETORAN VERIFICATION LOGIC
// ==========================================

function getTodayDayName() {
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  return days[new Date().getDay()];
}

function getPetugasByDay(dayName) {
  const found = jadwalList.find(j => j.hari === dayName);
  return found ? found.petugas : [];
}

function populatePetugasDropdownByDay(selectId, dayName) {
  const select = document.getElementById(selectId);
  if (!select) return;
  
  select.innerHTML = '';
  const list = getPetugasByDay(dayName);
  
  list.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p;
    opt.textContent = p;
    select.appendChild(opt);
  });
  
  if (select.options.length > 0) {
    select.selectedIndex = 0;
  }
}

function updateRecordingPetugasSelect() {
  const daySelect = document.getElementById('recHariSelect');
  if (!daySelect) return;
  populatePetugasDropdownByDay('recPetugasSelect', daySelect.value);
}

function updateWargaSetoranPetugasSelect() {
  const daySelect = document.getElementById('wargaSetoranHariSelect');
  if (!daySelect) return;
  populatePetugasDropdownByDay('wargaSetoranPetugasSelect', daySelect.value);
}

function renderJadwal() {
  const q = (document.getElementById('searchJadwal')?.value || '').toLowerCase();
  
  const filtered = jadwalList.filter(j => {
    return j.hari.toLowerCase().includes(q) || j.petugas.some(p => p.toLowerCase().includes(q));
  });

  const container = document.getElementById('jadwalGrid');
  if (!container) return;

  if (filtered.length === 0) {
    container.innerHTML = '<div style="grid-column: 1/-1" class="empty-state"><i class="ti ti-calendar-off"></i><h3>Jadwal tidak ditemukan</h3><p>Coba kata kunci pencarian lain</p></div>';
    return;
  }

  container.innerHTML = filtered.map(j => `
    <div class="house-card" style="padding:1.25rem;">
      <div class="card-header" style="margin-bottom: 8px;">
        <div class="card-no" style="width:auto;padding:0 16px;background:var(--primary-light);color:var(--primary);font-size:15px;"><i class="ti ti-calendar" style="margin-right:8px"></i> ${j.hari}</div>
      </div>
      <div style="display:flex;flex-direction:column;gap:10px;margin-top:10px;">
        ${j.petugas.map(p => `
          <div class="list-item" style="margin:0;padding:12px;background:var(--bg);border-color:var(--border);">
            <div class="li-left">
              <div class="li-avatar" style="background:#fff;color:var(--secondary);box-shadow:var(--shadow-sm);"><i class="ti ti-user-circle"></i></div>
              <div class="li-name" style="font-size:14px;">${p}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
}

function renderPiketHariIni() {
  const hari = getTodayDayName();
  const dayLabel = document.getElementById('hariIniLabel');
  const listEl = document.getElementById('petugasHariIniList');
  if (!dayLabel || !listEl) return;
  
  dayLabel.textContent = hari;
  
  const j = jadwalList.find(x => x.hari.toLowerCase() === hari.toLowerCase());
  if (j && j.petugas && j.petugas.length > 0) {
    listEl.innerHTML = j.petugas.map(p => `
      <span style="display:inline-block; padding:6px 12px; background:#fff; border:1px solid var(--border); border-radius:10px; color:var(--text2); font-size:14px; font-weight:800; box-shadow:var(--shadow-xs);">
        <i class="ti ti-user-circle" style="vertical-align:-2px; margin-right:4px; color:var(--primary);"></i>${p}
      </span>
    `).join('');
  } else {
    listEl.innerHTML = '<span style="font-size:14px;color:var(--text3);font-weight:700;">Tidak ada jadwal piket keliling hari ini.</span>';
  }
}

function renderSetoran() {
  const container = document.getElementById('setoranContainer');
  if (!container) return;
  
  if (setoranList.length === 0) {
    container.innerHTML = '<div class="empty-state" style="padding:4rem 2rem"><i class="ti ti-receipt-off"></i><h3>Belum ada setoran masuk</h3><p>Laporan dari petugas keliling akan muncul di sini.</p></div>';
    return;
  }
  
  container.innerHTML = setoranList.map(s => {
    const rumahList = s.rumahIds.map(id => {
      const h = houses.find(x => x.id === id) || {r: 'Unknown'};
      return `<span style="display:inline-block;padding:4px 8px;background:var(--bg);border:1px solid var(--border);border-radius:6px;font-size:12px;margin:2px;">${h.r}</span>`;
    }).join('');
    
    const displayPetugas = s.petugasPiket 
      ? `<span style="color:var(--primary);font-weight:800;">${s.petugasPiket}</span> <span style="font-size:12px;color:var(--text3);font-weight:500;">(Piket Keliling)</span>` 
      : `<span style="font-weight:800;">${s.petugas}</span>`;
      
    const displayPencatat = s.pencatat 
      ? `<div style="font-size:13px;color:var(--text3);margin-top:4px;"><i class="ti ti-device-laptop"></i> Pengirim: Akun <b>${s.pencatat}</b></div>` 
      : '';
      
    return `
      <div class="list-panel" style="margin-bottom:1rem;border-left:4px solid ${s.status === 'pending' ? 'var(--warning)' : 'var(--success)'};border-radius:16px;">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px;">
          <div>
            <div style="font-size:16px;font-weight:800;"><i class="ti ti-user-check"></i> Petugas Piket: ${displayPetugas}</div>
            ${displayPencatat}
            <div style="font-size:13px;color:var(--text2);margin-top:4px;"><i class="ti ti-clock"></i> ${s.waktu}</div>
            <div style="margin-top:10px;">${rumahList}</div>
            <div style="margin-top:10px;font-weight:800;color:var(--primary);font-size:15px;">Total Setoran: Rp ${(s.rumahIds.length * nominal).toLocaleString('id-ID')}</div>
          </div>
          <div>
            ${s.status === 'pending' 
              ? `<button class="btn btn-primary" onclick="terimaSetoran(${s.id})"><i class="ti ti-check"></i> Terima & Verifikasi</button>`
              : `<span class="badge badge-paid"><i class="ti ti-circle-check"></i> DITERIMA</span>`
            }
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function terimaSetoran(setId) {
  const auth = getAuthStatus();
  if (auth?.username !== 'bendahara' && auth?.username !== 'ketua') {
    toast('Akses Ditolak: Hanya Bendahara atau Ketua RT yang dapat memverifikasi setoran', '<i class="ti ti-alert-circle"></i>');
    return;
  }
  
  const s = setoranList.find(x => x.id === setId);
  if(!s || s.status !== 'pending') return;
  
  showModal({
    title: 'Verifikasi Setoran',
    desc: 'Pastikan Anda telah menerima uang fisik sejumlah <b>Rp ' + (s.rumahIds.length * nominal).toLocaleString('id-ID') + '</b> dari petugas.',
    icon: 'ti ti-cash',
    iconClass: 'success',
    btnConfirmText: 'Ya, Terima',
    onConfirm: () => {
      s.status = 'approved';
      s.rumahIds.forEach(id => {
        const h = houses.find(x => x.id === id);
        if (h && !h.s) {
          h.s = true; h.w = new Date().toLocaleString('id-ID');
          riwayat.unshift({ 
            r: h.r, 
            p: h.p, 
            w: h.w, 
            ts: Date.now(),
            petugas: s.petugasPiket || 'Budi Santoso',
            pencatat: s.pencatat || 'warga',
            metode: 'Tunai'
          });
        }
      });
      save(); renderSetoran(); renderAll();
      toast('Setoran berhasil diverifikasi!', '<i class="ti ti-check"></i>');
    }
  });
}

function openWargaSetoranModal() {
  const markedHouses = houses.filter(h => h.marked);
  if (markedHouses.length === 0) return;
  
  document.getElementById('wargaSetoranCount').textContent = `${markedHouses.length} Rumah Ditandai`;
  document.getElementById('wargaSetoranAmount').textContent = 'Total Setoran: Rp ' + (markedHouses.length * nominal).toLocaleString('id-ID');
  
  const todayDay = getTodayDayName();
  const daySelect = document.getElementById('wargaSetoranHariSelect');
  if (daySelect) {
    daySelect.value = todayDay;
  }
  
  updateWargaSetoranPetugasSelect();
  document.getElementById('wargaSetoranModal').classList.add('show');
}

function closeWargaSetoranModal() {
  const modal = document.getElementById('wargaSetoranModal');
  if (modal) modal.classList.remove('show');
}

function confirmWargaSetoran() {
  const markedHouses = houses.filter(h => h.marked);
  if (markedHouses.length === 0) return;
  
  const ids = markedHouses.map(h => h.id);
  const petugasPiket = document.getElementById('wargaSetoranPetugasSelect').value;
  const auth = getAuthStatus();
  const pencatat = auth ? auth.username : 'warga';
  
  setoranList.unshift({
    id: Date.now(),
    petugasPiket: petugasPiket,
    petugas: pencatat,
    pencatat: pencatat,
    waktu: new Date().toLocaleString('id-ID'),
    ts: Date.now(),
    rumahIds: ids,
    status: 'pending'
  });
  
  houses.forEach(h => h.marked = false);
  save(); 
  renderAll();
  closeWargaSetoranModal();
  document.getElementById('keranjangSetoran').classList.add('hidden');
  toast('Laporan setoran berhasil dikirim!', '<i class="ti ti-send"></i>');
}
