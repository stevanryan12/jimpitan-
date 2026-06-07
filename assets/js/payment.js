// ==========================================
// CORE TRANSACTIONS & REPORT LIST RENDERING
// ==========================================

let paymentChartInstance = null;

function renderChart() {
  const sudah = houses.filter(h => h.s).length;
  const belum = houses.filter(h => !h.s).length;

  const ctx = document.getElementById('paymentChart');
  if (!ctx) return;

  if (typeof Chart === 'undefined') {
    console.warn("Chart.js is not loaded. Skipping chart rendering.");
    return;
  }

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

function renderCards() {
  const q = document.getElementById('searchInput').value.toLowerCase().replace(/block/g, 'blok');
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
  
  const auth = getAuthStatus();
  const isWarga = auth?.username === 'warga';
  const isBendahara = auth?.username === 'bendahara';
  
  document.getElementById('cardsGrid').innerHTML = filtered.map(h => {
    let mainClick = '';
    let cursorStyle = 'default';
    
    if (h.s) {
      mainClick = `openReceiptForHouse('${h.r}')`;
      cursorStyle = 'pointer';
    } else if (isWarga) {
      mainClick = `tandaiRumah(${h.id})`;
      cursorStyle = 'pointer';
    } else if (isBendahara) {
      mainClick = `openRecordingModal(${h.id})`;
      cursorStyle = 'pointer';
    }
    
    const qrOnClick = isBendahara 
      ? `event.stopPropagation(); simulateQrScan(${h.id});` 
      : `event.stopPropagation();`;
      
    const qrCursor = isBendahara ? 'zoom-in' : 'default';
    const qrHintHtml = isBendahara 
      ? `<div class="qr-hint"><i class="ti ti-scan"></i> Klik untuk Scan</div>` 
      : '';
      
    const tx = h.s ? riwayat.find(r => r.r === h.r) : null;
    const piketName = tx ? (tx.petugas || '-') : '-';
    const pencatatName = tx ? (tx.pencatat === 'admin' ? 'Admin' : (tx.pencatat === 'bendahara' ? 'Bendahara' : (tx.pencatat === 'ketua' ? 'Ketua RT' : (tx.pencatat === 'warga' ? 'Warga' : tx.pencatat)))) : '-';

    return `
    <div class="house-card ${h.s ? 'paid' : 'unpaid'}" ${mainClick ? `onclick="${mainClick}"` : ''} style="cursor:${cursorStyle};">
      <div class="card-header">
        <div class="card-no">${h.id}</div>
        <div style="display:flex;align-items:center;gap:8px;">
          <span class="card-emoji">${h.s ? '😊' : '😴'}</span>
          <span class="badge ${h.s ? 'badge-paid' : 'badge-unpaid'}">${h.s ? 'LUNAS' : 'BELUM'}</span>
        </div>
      </div>
      <div class="card-info">
        <div class="card-name">${h.r}</div>
        <div class="card-owner"><i class="ti ti-user-circle"></i>${h.p}</div>
      </div>
      <div class="qr-box" onclick="${qrOnClick}" style="cursor:${qrCursor};" ${isBendahara ? 'title="Klik untuk simulasi Scan QR"' : ''}>
        <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=RUMAH-${h.id}" loading="lazy" alt="QR ${h.r}" />
        ${qrHintHtml}
      </div>
      ${!h.s
        ? (isWarga 
           ? `<button class="btn-pay" style="background:${h.marked ? 'var(--warning)' : 'var(--primary)'}" onclick="event.stopPropagation(); tandaiRumah(${h.id});">
                <i class="${h.marked ? 'ti ti-check' : 'ti ti-hand-click'}"></i> ${h.marked ? 'Ditandai' : 'Tandai Diambil'}
              </button>`
           : (isBendahara 
              ? `<button class="btn-pay" onclick="event.stopPropagation(); openRecordingModal(${h.id});"><i class="ti ti-credit-card"></i> Bayar Iuran</button>`
              : `<div style="text-align:center;padding:8px;font-size:13px;color:var(--warning);font-weight:700;"><i class="ti ti-clock"></i> Belum Bayar</div>`))
        : `<div class="paid-stamp"><i class="ti ti-circle-check-filled"></i> ${h.w}</div>
           <div style="font-size:11px;color:var(--text3);text-align:center;margin-top:6px;line-height:1.4;font-weight:600;">
             <div><i class="ti ti-user-check" style="color:var(--primary);"></i> Piket: <b>${piketName}</b></div>
             <div><i class="ti ti-device-laptop" style="color:var(--secondary);"></i> Input: <b>${pencatatName}</b></div>
           </div>`}
    </div>
  `}).join('');
}

function celebratePaid(houseName) {
  toast(`Rumah ${houseName} sudah lunas iuran jimpitan! Terimakasih warga teladan! 🎉`, '<i class="ti ti-confetti" style="color:var(--success)"></i>');
}

function tandaiRumah(id) {
  const h = houses.find(x => x.id === id);
  if (!h || h.s) return;
  h.marked = !h.marked;
  renderAll();
  
  const markedCount = houses.filter(x => x.marked).length;
  const countEl = document.getElementById('countSetoran');
  if (countEl) countEl.textContent = markedCount;
  const keranjang = document.getElementById('keranjangSetoran');
  if (keranjang) {
    if (markedCount > 0) keranjang.classList.remove('hidden');
    else keranjang.classList.add('hidden');
  }
}

function kirimSetoran() {
  openWargaSetoranModal();
}

function openRecordingModal(houseId, defaultMethod = 'Tunai') {
  const auth = getAuthStatus();
  if (auth?.username !== 'bendahara') {
    toast('Akses Ditolak: Hanya Bendahara yang dapat mencatat pembayaran', '<i class="ti ti-alert-circle"></i>');
    return;
  }

  const h = houses.find(x => x.id === houseId);
  if (!h) return;
  
  activeRecordingHouseId = houseId;
  
  document.getElementById('recHouseName').textContent = h.r;
  document.getElementById('recHouseOwner').textContent = h.p;
  document.getElementById('recAmount').textContent = 'Rp ' + nominal.toLocaleString('id-ID');
  
  const todayDay = getTodayDayName();
  const daySelect = document.getElementById('recHariSelect');
  if (daySelect) {
    daySelect.value = todayDay;
  }
  
  updateRecordingPetugasSelect();
  
  const username = auth ? auth.username : 'Guest';
  let roleName = 'Administrator';
  if (username === 'ketua') roleName = 'Ketua RT';
  if (username === 'bendahara') roleName = 'Bendahara';
  if (username === 'warga') roleName = 'Warga';
  
  document.getElementById('recPencatatInput').value = `${roleName} (${username})`;
  
  const metodeSelect = document.getElementById('recMetodeSelect');
  if (metodeSelect) {
    metodeSelect.value = defaultMethod;
  }
  
  document.getElementById('recordingModal').classList.add('show');
}

function closeRecordingModal() {
  const modal = document.getElementById('recordingModal');
  if (modal) modal.classList.remove('show');
  activeRecordingHouseId = null;
}

function confirmRecording() {
  if (!activeRecordingHouseId) return;
  const h = houses.find(x => x.id === activeRecordingHouseId);
  if (!h || h.s) return;
  
  const petugas = document.getElementById('recPetugasSelect').value;
  const metode = document.getElementById('recMetodeSelect')?.value || 'Tunai';
  const auth = getAuthStatus();
  const pencatat = auth ? auth.username : 'Guest';
  
  h.s = true;
  h.w = new Date().toLocaleString('id-ID');
  
  riwayat.unshift({
    r: h.r,
    p: h.p,
    w: h.w,
    ts: Date.now(),
    petugas: petugas,
    pencatat: pencatat,
    metode: metode
  });
  
  save();
  renderAll();
  closeRecordingModal();
  toast(`${h.r} berhasil bayar!`, '<i class="ti ti-circle-check"></i>');
}

function tambahPengeluaran(e) {
  e.preventDefault();
  const auth = getAuthStatus();
  if (auth?.username !== 'bendahara') {
    toast('Akses Ditolak: Hanya Bendahara yang dapat mencatat pengeluaran', '<i class="ti ti-alert-circle"></i>');
    return;
  }
  
  const ket = document.getElementById('pengeluaranKet').value.trim();
  const kat = document.getElementById('pengeluaranKategori').value;
  const nom = parseInt(document.getElementById('pengeluaranNominal').value);
  if (!ket || !nom) return;
  
  pengeluaranList.unshift({
    id: Date.now(),
    waktu: new Date().toLocaleString('id-ID'),
    ts: Date.now(),
    ket: ket,
    kategori: kat || 'Konsumsi Ronda',
    nom: nom
  });
  
  save();
  document.getElementById('pengeluaranKet').value = '';
  document.getElementById('pengeluaranNominal').value = '';
  renderAll();
  toast('Pengeluaran berhasil dicatat!', '<i class="ti ti-device-floppy"></i>');
}

let activeExpenseChart = null;

function renderRiwayatPengeluaran() {
  const tbody = document.getElementById('pengeluaranBody');
  if (!tbody) return;
  
  tbody.innerHTML = pengeluaranList.length
    ? pengeluaranList.map((p, i) => `
      <tr>
        <td style="color:var(--text3);font-weight:700">${i + 1}</td>
        <td style="color:var(--text3)"><i class="ti ti-clock" style="vertical-align:-2px;margin-right:4px"></i>${p.waktu}</td>
        <td><b>${p.ket}</b></td>
        <td><span class="badge" style="background:var(--bg);color:var(--text2);border:1px solid var(--border)">${p.kategori || 'Konsumsi Ronda'}</span></td>
        <td style="color:var(--danger);font-weight:800">- Rp ${p.nom.toLocaleString('id-ID')}</td>
      </tr>`).join('')
    : '<tr><td colspan="5"><div class="empty-state" style="padding:2rem"><i class="ti ti-report-money"></i><h3>Belum ada pengeluaran</h3></div></td></tr>';

  updateExpenseChart();
}

function updateExpenseChart() {
  const canvas = document.getElementById('expenseChart');
  if (!canvas) return;
  
  if (typeof Chart === 'undefined') {
    console.warn("Chart.js is not loaded. Skipping expense chart rendering.");
    return;
  }
  
  const categories = {
    'Konsumsi Ronda': 0,
    'Alat Keamanan': 0,
    'Operasional RT': 0,
    'Sosial & Donasi': 0
  };
  
  pengeluaranList.forEach(p => {
    const kat = p.kategori || 'Konsumsi Ronda';
    if (categories[kat] !== undefined) {
      categories[kat] += p.nom;
    } else {
      categories['Konsumsi Ronda'] += p.nom;
    }
  });
  
  const labels = Object.keys(categories);
  const dataValues = Object.values(categories);
  const hasData = dataValues.some(val => val > 0);
  
  if (activeExpenseChart) {
    activeExpenseChart.destroy();
  }
  
  const ctx = canvas.getContext('2d');
  
  activeExpenseChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: hasData ? dataValues : [1, 1, 1, 1],
        backgroundColor: [
          '#DD6B20',
          '#E53E3E',
          '#2F855A',
          '#3182CE'
        ],
        borderWidth: 2,
        borderColor: '#ffffff'
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
              family: 'Plus Jakarta Sans',
              weight: '700',
              size: 11
            },
            color: '#4A5568',
            boxWidth: 12
          }
        },
        tooltip: {
          enabled: hasData,
          callbacks: {
            label: function(context) {
              const val = dataValues[context.dataIndex];
              return ' ' + context.label + ': Rp ' + val.toLocaleString('id-ID');
            }
          }
        }
      },
      cutout: '65%'
    }
  });
}

function getFriendlyDateLabel(ts) {
  if (!ts) return 'Lainnya';
  
  const now = new Date();
  const d = new Date(ts);
  
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const oneDay = 24 * 60 * 60 * 1000;
  const yesterdayMidnight = todayMidnight - oneDay;
  const lusaMidnight = todayMidnight - 2 * oneDay;
  
  const tTime = d.getTime();
  
  if (tTime >= todayMidnight) {
    return 'Hari Ini (Today)';
  } else if (tTime >= yesterdayMidnight) {
    return 'Kemarin (Yesterday)';
  } else if (tTime >= lusaMidnight) {
    return 'Lusa (2 Hari yang Lalu)';
  } else {
    return d.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }
}

function renderRiwayat() {
  const blocks = {};
  houses.forEach(h => {
    const blockName = (h.r.split(' ')[0] || '') + ' ' + (h.r.split(' ')[1] ? h.r.split(' ')[1].charAt(0) : '');
    if (!blocks[blockName]) blocks[blockName] = { paid: [], unpaid: [] };
    if (h.s) {
      blocks[blockName].paid.push(h);
    } else {
      blocks[blockName].unpaid.push(h);
    }
  });

  const rekapContainer = document.getElementById('rekapBlokContainer');
  if (rekapContainer) {
    let rekapHtml = '';
    for (const [blockName, data] of Object.entries(blocks)) {
      rekapHtml += `
        <div class="list-panel" style="padding: 1.5rem;">
          <div class="panel-head" style="margin-bottom: 1rem; border-bottom: 1px dashed var(--border); padding-bottom: 0.5rem;">
            <div class="panel-title" style="color: var(--primary); font-size: 18px;"><i class="ti ti-map-pin"></i> ${blockName}</div>
          </div>
          <div class="lists-row" style="gap: 1.5rem;">
            <div style="background: var(--success-light); padding: 1rem; border-radius: 16px; border: 1px solid rgba(56, 161, 105, 0.2);">
              <div style="font-size: 14px; font-weight: 800; color: var(--success); margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
                <i class="ti ti-circle-check-filled"></i> Sudah Bayar (${data.paid.length})
              </div>
              <div style="display: flex; flex-direction: column; gap: 8px;">
                ${data.paid.length ? data.paid.map(h => `
                  <div style="font-size: 13px; font-weight: 600; color: var(--text); display: flex; justify-content: space-between;">
                    <span>${h.r} - ${h.p}</span>
                  </div>
                `).join('') : '<span style="font-size:12px;color:var(--text3);font-style:italic">Belum ada</span>'}
              </div>
            </div>
            <div style="background: var(--warning-light); padding: 1rem; border-radius: 16px; border: 1px solid rgba(214, 158, 46, 0.2);">
              <div style="font-size: 14px; font-weight: 800; color: var(--warning); margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
                <i class="ti ti-clock-filled"></i> Belum Bayar (${data.unpaid.length})
              </div>
              <div style="display: flex; flex-direction: column; gap: 8px;">
                ${data.unpaid.length ? data.unpaid.map(h => `
                  <div style="font-size: 13px; font-weight: 600; color: var(--text); display: flex; justify-content: space-between;">
                    <span>${h.r} - ${h.p}</span>
                  </div>
                `).join('') : '<span style="font-size:12px;color:var(--text3);font-style:italic">Semua sudah bayar</span>'}
              </div>
            </div>
          </div>
        </div>
      `;
    }
    rekapContainer.innerHTML = rekapHtml;
  }

  if (riwayat.length === 0) {
    const tbody = document.getElementById('riwayatBody');
    if (tbody) tbody.innerHTML = '<tr><td colspan="8"><div class="empty-state"><i class="ti ti-receipt-off"></i><h3>Belum ada riwayat pembayaran</h3></div></td></tr>';
  } else {
    let rowsHtml = '';
    let lastGroupLabel = '';
    
    riwayat.forEach((r, idx) => {
      const groupLabel = getFriendlyDateLabel(r.ts);
      
      if (groupLabel !== lastGroupLabel) {
        lastGroupLabel = groupLabel;
        rowsHtml += `
          <tr style="background: rgba(47, 133, 90, 0.04); border-left: 5px solid var(--primary);">
            <td colspan="8" style="padding: 12px 16px; font-weight: 800; color: var(--primary); font-size: 13px; text-align: left; text-transform: uppercase; letter-spacing: 0.05em; background: rgba(47, 133, 90, 0.02);">
              <i class="ti ti-calendar" style="margin-right: 6px; font-size: 16px; vertical-align: -2px;"></i> ${groupLabel}
            </td>
          </tr>
        `;
      }
      
      const piketName = r.petugas || '-';
      const pencatatRole = r.pencatat 
        ? (r.pencatat === 'admin' ? 'Admin' : (r.pencatat === 'bendahara' ? 'Bendahara' : (r.pencatat === 'ketua' ? 'Ketua RT' : (r.pencatat === 'warga' ? 'Warga' : r.pencatat))))
        : '-';
      
      const metodeBadge = r.metode === 'QR Code' 
        ? `<span class="badge" style="background:rgba(49,130,206,0.1);color:#3182CE;font-weight:800;border:1px solid rgba(49,130,206,0.2);margin-left:4px;"><i class="ti ti-qrcode"></i> QR</span>` 
        : `<span class="badge" style="background:rgba(221,107,32,0.1);color:#DD6B20;font-weight:800;border:1px solid rgba(221,107,32,0.2);margin-left:4px;"><i class="ti ti-cash"></i> TUNAI</span>`;
        
      rowsHtml += `
        <tr onclick="viewReceipt(${idx})" style="cursor:pointer;" title="Klik untuk lihat Kwitansi Digital">
          <td style="color:var(--text3);font-weight:700">${idx + 1}</td>
          <td><b>${r.r}</b></td>
          <td>${r.p}</td>
          <td><span style="font-weight:700;color:var(--primary)"><i class="ti ti-user-check" style="margin-right:4px"></i>${piketName}</span></td>
          <td><span style="font-weight:600;color:var(--text3);font-size:13px;"><i class="ti ti-device-laptop" style="margin-right:4px"></i>${pencatatRole}</span></td>
          <td style="color:var(--text3)"><i class="ti ti-clock" style="vertical-align:-2px;margin-right:4px"></i>${r.w}</td>
          <td style="color:var(--success);font-weight:800">Rp ${nominal.toLocaleString('id-ID')}</td>
          <td><span class="badge badge-paid">LUNAS</span>${metodeBadge}</td>
        </tr>
      `;
    });
    
    const tbody = document.getElementById('riwayatBody');
    if (tbody) tbody.innerHTML = rowsHtml;
  }
}

function renderLaporan() {
  const s = houses.filter(h => h.s).length;
  const b = houses.length - s;
  const pct = Math.round((s / houses.length) * 100) || 0;
  
  const blnEl = document.getElementById('bulanLaporan');
  if (blnEl) blnEl.textContent = document.getElementById('bulanSelect').value;
  
  const elPct = document.getElementById('laporanPct');
  if (elPct) elPct.textContent = pct + '%';
  setTimeout(() => { 
    const bar = document.getElementById('laporanBar');
    if (bar) bar.style.width = pct + '%'; 
  }, 100);
  
  const totalMasuk = riwayat.length * nominal;
  let totalKeluar = 0;
  pengeluaranList.forEach(p => totalKeluar += p.nom);
  const saldoBersih = totalMasuk - totalKeluar;
  
  const grid = document.getElementById('laporanGrid');
  if (grid) {
    grid.innerHTML = `
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
      <div class="stat-icon"><i class="ti ti-arrow-down-left"></i></div>
      <div>
        <div class="stat-label">Total Pemasukan</div>
        <div class="stat-value">Rp ${totalMasuk.toLocaleString('id-ID')}</div>
      </div>
    </div>
    <div class="stat-card" style="background:var(--danger-light);color:var(--danger);border-color:rgba(229,62,62,0.2);">
      <div class="stat-icon" style="background:#fff;color:var(--danger)"><i class="ti ti-arrow-up-right"></i></div>
      <div>
        <div class="stat-label">Total Pengeluaran</div>
        <div class="stat-value">Rp ${totalKeluar.toLocaleString('id-ID')}</div>
      </div>
    </div>
    <div class="stat-card" style="background:#EBF8FF;border-color:rgba(49,130,206,0.2);grid-column:1/-1;">
      <div class="stat-icon" style="background:#fff;color:#3182CE"><i class="ti ti-wallet"></i></div>
      <div>
        <div class="stat-label">Saldo Kas Bersih</div>
        <div class="stat-value" style="color:#2B6CB0;font-size:36px;">Rp ${saldoBersih.toLocaleString('id-ID')}</div>
      </div>
    </div>
    `;
  }

  const now = Date.now();
  const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;
  const currDate = new Date();
  const currMonth = currDate.getMonth();
  const currYear = currDate.getFullYear();
  
  let totalWeek = 0;
  let totalMonth = 0;
  let totalYear = 0;
  
  riwayat.forEach(r => {
    const ts = r.ts || 0;
    if (ts === 0) return;
    const rDate = new Date(ts);
    if (now - ts <= ONE_WEEK) totalWeek += nominal;
    if (rDate.getMonth() === currMonth && rDate.getFullYear() === currYear) totalMonth += nominal;
    if (rDate.getFullYear() === currYear) totalYear += nominal;
  });
  
  const elMinggu = document.getElementById('lapMinggu');
  const elBulan = document.getElementById('lapBulan');
  const elTahun = document.getElementById('lapTahun');
  
  if(elMinggu) elMinggu.textContent = 'Rp ' + totalWeek.toLocaleString('id-ID');
  if(elBulan) elBulan.textContent = 'Rp ' + totalMonth.toLocaleString('id-ID');
  if(elTahun) elTahun.textContent = 'Rp ' + totalYear.toLocaleString('id-ID');
}

// PERIODIC REPORTS STATE
let currentPeriodFilter = 'hari';

function setPeriodFilter(period) {
  currentPeriodFilter = period;
  
  ['hari', 'bulan', 'tahun'].forEach(p => {
    const btn = document.getElementById('tabPeriod-' + p);
    if (!btn) return;
    if (p === period) {
      btn.style.background = 'var(--primary)';
      btn.style.color = '#fff';
      btn.style.boxShadow = 'var(--shadow-sm)';
    } else {
      btn.style.background = 'transparent';
      btn.style.color = 'var(--text2)';
      btn.style.boxShadow = 'none';
    }
  });

  const dateWrap = document.getElementById('periodDateWrap');
  if (dateWrap) {
    dateWrap.style.display = (period === 'hari') ? 'flex' : 'none';
  }
  
  renderPeriodReport();
}

function renderPeriodReport() {
  const containerPaid = document.getElementById('periodPaidList');
  const containerUnpaid = document.getElementById('periodUnpaidList');
  const countPaid = document.getElementById('periodPaidCount');
  const countUnpaid = document.getElementById('periodUnpaidCount');
  
  if (!containerPaid || !containerUnpaid) return;
  
  const today = new Date();
  const pickerVal = document.getElementById('periodDatePicker')?.value;
  const selectedDate = pickerVal ? new Date(pickerVal) : new Date();
  
  const checkDate = (ts) => {
    if (!ts) return false;
    const d = new Date(ts);
    if (currentPeriodFilter === 'hari') {
      return d.getDate() === selectedDate.getDate() &&
             d.getMonth() === selectedDate.getMonth() &&
             d.getFullYear() === selectedDate.getFullYear();
    } else if (currentPeriodFilter === 'bulan') {
      return d.getMonth() === today.getMonth() &&
             d.getFullYear() === today.getFullYear();
    } else if (currentPeriodFilter === 'tahun') {
      return d.getFullYear() === today.getFullYear();
    }
    return false;
  };
  
  const paidHouses = [];
  const unpaidHouses = [];
  
  houses.forEach(h => {
    const tx = riwayat.find(r => r.r === h.r && checkDate(r.ts));
    if (tx) {
      paidHouses.push({ house: h, tx: tx });
    } else {
      unpaidHouses.push(h);
    }
  });
  
  if (paidHouses.length === 0) {
    containerPaid.innerHTML = `
      <div style="text-align:center;padding:2rem;color:var(--text3);font-size:13px;font-weight:700;">
        <i class="ti ti-receipt-off" style="font-size:24px;display:block;margin-bottom:8px;color:var(--text3)"></i>
        Belum ada warga membayar untuk periode ini.
      </div>
    `;
  } else {
    containerPaid.innerHTML = paidHouses.map(item => {
      const metodeBadge = item.tx.metode === 'QR Code' 
        ? `<span style="font-size:10px;color:#3182CE;background:rgba(49,130,206,0.1);padding:2px 6px;border-radius:4px;font-weight:800;margin-right:4px;display:inline-flex;align-items:center;gap:2px;"><i class="ti ti-qrcode"></i> QR</span>` 
        : `<span style="font-size:10px;color:#DD6B20;background:rgba(221,107,32,0.1);padding:2px 6px;border-radius:4px;font-weight:800;margin-right:4px;display:inline-flex;align-items:center;gap:2px;"><i class="ti ti-cash"></i> Tunai</span>`;
        
      return `
        <div onclick="viewReceiptByRef('${item.tx.ts}')" style="background:#fff;border:1px solid rgba(16,185,129,0.15);padding:10px 14px;border-radius:12px;display:flex;justify-content:space-between;align-items:center;box-shadow:var(--shadow-xs);cursor:pointer;" title="Klik untuk lihat Kwitansi Digital">
          <div>
            <div style="font-size:14px;font-weight:800;color:var(--text);">${item.house.r}</div>
            <div style="font-size:12px;color:var(--text2);font-weight:600;margin-top:2px;"><i class="ti ti-user" style="margin-right:4px"></i>${item.house.p}</div>
          </div>
          <div style="text-align:right;">
            <div style="display:flex;align-items:center;justify-content:flex-end;gap:4px;margin-bottom:4px;">
              ${metodeBadge}
              <span style="font-size:11px;color:var(--success);background:rgba(16,185,129,0.1);padding:4px 8px;border-radius:100px;font-weight:800;display:inline-flex;align-items:center;gap:4px;"><i class="ti ti-circle-check-filled"></i> Lunas</span>
            </div>
            <div style="font-size:10px;color:var(--text3);margin-top:4px;font-weight:600;"><i class="ti ti-clock"></i> ${item.tx.w.split(',')[1]?.trim() || item.tx.w}</div>
          </div>
        </div>
      `;
    }).join('');
  }
  
  if (unpaidHouses.length === 0) {
    containerUnpaid.innerHTML = `
      <div style="text-align:center;padding:2rem;color:var(--text3);font-size:13px;font-weight:700;">
        <i class="ti ti-circle-check-filled" style="font-size:24px;display:block;margin-bottom:8px;color:var(--success)"></i>
        Luar biasa! Semua warga sudah membayar untuk periode ini.
      </div>
    `;
  } else {
    containerUnpaid.innerHTML = unpaidHouses.map(h => `
      <div style="background:#fff;border:1px solid rgba(239, 68, 68, 0.15);padding:10px 14px;border-radius:12px;display:flex;justify-content:space-between;align-items:center;box-shadow:var(--shadow-xs);">
        <div>
          <div style="font-size:14px;font-weight:800;color:var(--text);">${h.r}</div>
          <div style="font-size:12px;color:var(--text2);font-weight:600;margin-top:2px;"><i class="ti ti-user" style="margin-right:4px"></i>${h.p}</div>
        </div>
        <div style="text-align:right;">
          <span style="font-size:11px;color:#EF4444;background:rgba(239,68,68,0.1);padding:4px 8px;border-radius:100px;font-weight:800;display:inline-flex;align-items:center;gap:4px;"><i class="ti ti-circle-x-filled"></i> Belum Bayar</span>
          <div style="font-size:10px;color:#EF4444;margin-top:4px;font-weight:700;letter-spacing:0.02em;"><i class="ti ti-alert-triangle"></i> TIDAK ADA BUKTI</div>
        </div>
      </div>
    `).join('');
  }
  
  if (countPaid) countPaid.textContent = `${paidHouses.length} Rumah`;
  if (countUnpaid) countUnpaid.textContent = `${unpaidHouses.length} Rumah`;
}

// PERIODIC EXPENDITURES STATE
let currentPeriodExpenseFilter = 'hari';

function setPeriodExpenseFilter(period) {
  currentPeriodExpenseFilter = period;
  
  ['hari', 'bulan', 'tahun'].forEach(p => {
    const btn = document.getElementById('tabExpPeriod-' + p);
    if (!btn) return;
    if (p === period) {
      btn.style.background = 'var(--danger)';
      btn.style.color = '#fff';
      btn.style.boxShadow = 'var(--shadow-sm)';
    } else {
      btn.style.background = 'transparent';
      btn.style.color = 'var(--text2)';
      btn.style.boxShadow = 'none';
    }
  });

  const dateWrap = document.getElementById('expensePeriodDateWrap');
  if (dateWrap) {
    dateWrap.style.display = (period === 'hari') ? 'flex' : 'none';
  }
  
  renderPeriodExpenseReport();
}

function renderPeriodExpenseReport() {
  const container = document.getElementById('periodExpenseList');
  const totalValEl = document.getElementById('periodExpenseTotalValue');
  const countEl = document.getElementById('periodExpenseCount');
  
  if (!container || !totalValEl) return;
  
  const today = new Date();
  const pickerVal = document.getElementById('expensePeriodDatePicker')?.value;
  const selectedDate = pickerVal ? new Date(pickerVal) : new Date();
  
  const checkDate = (ts) => {
    if (!ts) return false;
    const d = new Date(ts);
    if (currentPeriodExpenseFilter === 'hari') {
      return d.getDate() === selectedDate.getDate() &&
             d.getMonth() === selectedDate.getMonth() &&
             d.getFullYear() === selectedDate.getFullYear();
    } else if (currentPeriodExpenseFilter === 'bulan') {
      return d.getMonth() === today.getMonth() &&
             d.getFullYear() === today.getFullYear();
    } else if (currentPeriodExpenseFilter === 'tahun') {
      return d.getFullYear() === today.getFullYear();
    }
    return false;
  };
  
  const filtered = pengeluaranList.filter(p => checkDate(p.ts || p.id));
  const total = filtered.reduce((sum, p) => sum + p.nom, 0);
  
  totalValEl.textContent = 'Rp ' + total.toLocaleString('id-ID');
  if (countEl) countEl.textContent = `${filtered.length} Transaksi`;
  
  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="padding:4rem 2rem; background: #fff; border: 1.5px dashed var(--border); border-radius: 20px; text-align: center;">
        <div style="font-size: 32px; color: var(--success); margin-bottom: 8px;">🛡️</div>
        <h3 style="font-size: 15px; font-weight: 800; color: var(--text);">Tidak ada uang keluar</h3>
        <p style="font-size: 13px; color: var(--text3); margin-top: 4px;">Kas kampung aman untuk periode ini.</p>
      </div>
    `;
  } else {
    container.innerHTML = filtered.map(p => `
      <div style="background:#fff; border:1px solid rgba(229,62,62,0.15); padding:1.25rem; border-radius:16px; display:flex; justify-content:space-between; align-items:center; box-shadow:var(--shadow-xs); margin-bottom: 10px; transition: transform 0.2s;">
        <div>
          <div style="font-size:15px; font-weight:800; color:var(--text);">${p.ket}</div>
          <div style="display:flex; align-items:center; gap:8px; margin-top:6px; flex-wrap:wrap;">
            <span class="badge" style="background:var(--bg); color:var(--text2); border:1px solid var(--border); font-size:11px; font-weight:700; padding:2px 8px;">
              <i class="ti ti-tag" style="margin-right:2px"></i> ${p.kategori || 'Konsumsi Ronda'}
            </span>
            <span style="font-size:11px; color:var(--text3); font-weight:600;">
              <i class="ti ti-clock"></i> ${p.waktu}
            </span>
          </div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:16px; font-weight:900; color:var(--danger);">- Rp ${p.nom.toLocaleString('id-ID')}</div>
          <div style="font-size:10px; color:var(--text3); font-weight:700; margin-top:4px;"><i class="ti ti-user"></i> Akun: Bendahara</div>
        </div>
      </div>
    `).join('');
  }
}

// ==========================================
// QR SCANNER SIMULATOR
// ==========================================
function openQrScanner() {
  const auth = getAuthStatus();
  if (auth?.username !== 'bendahara') {
    toast('Akses Ditolak: Hanya Bendahara yang dapat membuka Scanner QR', '<i class="ti ti-alert-circle"></i>');
    return;
  }
  
  const listEl = document.getElementById('qrScannerHousesList');
  if (listEl) {
    const unpaidHouses = houses.filter(h => !h.s);
    if (unpaidHouses.length === 0) {
      listEl.innerHTML = '<div style="text-align:center;padding:12px;font-size:13px;color:var(--text3);font-weight:700;">Semua rumah sudah lunas!</div>';
    } else {
      listEl.innerHTML = unpaidHouses.map(h => `
        <button class="btn btn-ghost" onclick="simulateQrScan(${h.id})" style="width:100%;text-align:left;justify-content:flex-start;padding:10px 14px;border:1px solid var(--border);border-radius:12px;font-weight:700;">
          <i class="ti ti-qrcode" style="margin-right:8px;color:var(--primary);"></i> ${h.r} - ${h.p}
        </button>
      `).join('');
    }
  }
  
  document.getElementById('qrScannerModal').classList.add('show');
}

function closeQrScanner() {
  const modal = document.getElementById('qrScannerModal');
  if (modal) modal.classList.remove('show');
}

function simulateQrScan(houseId) {
  closeQrScanner();
  const h = houses.find(x => x.id === houseId);
  if (!h) return;
  if (h.s) {
    toast(`Rumah ${h.r} sudah lunas!`, '<i class="ti ti-info-circle"></i>');
    return;
  }
  openRecordingModal(houseId, 'QR Code');
}

// ==========================================
// MANAJEMEN WARGA (ADMIN)
// ==========================================
function openTambahWargaModal() {
  const auth = getAuthStatus();
  if (auth?.username !== 'admin' && auth?.username !== 'ketua') {
    toast('Akses Ditolak: Hanya Admin atau Ketua RT yang dapat menambahkan warga', '<i class="ti ti-alert-circle"></i>');
    return;
  }
  
  const blokInput = document.getElementById('addHouseBlok');
  const ownerInput = document.getElementById('addHouseOwner');
  if (blokInput) blokInput.value = '';
  if (ownerInput) ownerInput.value = '';
  
  const modal = document.getElementById('tambahWargaModal');
  if (modal) modal.classList.add('show');
}

function closeTambahWargaModal() {
  const modal = document.getElementById('tambahWargaModal');
  if (modal) modal.classList.remove('show');
}

function handleTambahWarga(e) {
  e.preventDefault();
  const auth = getAuthStatus();
  if (auth?.username !== 'admin' && auth?.username !== 'ketua') {
    toast('Akses Ditolak: Hanya Admin atau Ketua RT yang dapat menambahkan warga', '<i class="ti ti-alert-circle"></i>');
    return;
  }
  
  const rVal = document.getElementById('addHouseBlok').value.trim();
  const pVal = document.getElementById('addHouseOwner').value.trim();
  
  if (!rVal || !pVal) {
    toast('Harap isi semua bidang!', '<i class="ti ti-alert-circle"></i>');
    return;
  }
  
  // Check duplicate
  const exists = houses.some(h => h.r.toLowerCase() === rVal.toLowerCase());
  if (exists) {
    toast('Nomor rumah/blok tersebut sudah terdaftar!', '<i class="ti ti-alert-triangle"></i>');
    return;
  }
  
  const newId = houses.length > 0 ? Math.max(...houses.map(h => h.id)) + 1 : 1;
  houses.push({
    id: newId,
    r: rVal,
    p: pVal,
    s: false,
    w: null
  });
  
  save();
  renderAll();
  closeTambahWargaModal();
  toast(`Warga ${rVal} (${pVal}) berhasil ditambahkan!`, '<i class="ti ti-user-plus"></i>');
}

// ==========================================
// RESET DATA BULAN INI
// ==========================================
function resetData() {
  const auth = getAuthStatus();
  if (auth?.username !== 'bendahara' && auth?.username !== 'ketua') {
    toast('Akses Ditolak: Hanya Bendahara atau Ketua RT yang dapat mereset data', '<i class="ti ti-alert-circle"></i>');
    return;
  }
  
  showModal({
    title: 'Reset Data Bulan Ini',
    desc: 'Apakah Anda yakin ingin mereset seluruh data pembayaran iuran jimpitan bulan ini? Seluruh status lunas akan dikembalikan ke belum bayar.',
    icon: 'ti ti-refresh',
    iconClass: 'danger',
    btnConfirmText: 'Ya, Reset',
    onConfirm: () => {
      houses.forEach(h => {
        h.s = false;
        h.w = null;
      });
      riwayat = [];
      setoranList = [];
      save();
      renderAll();
      toast('Data bulan ini berhasil direset!', '<i class="ti ti-refresh"></i>');
    }
  });
}
