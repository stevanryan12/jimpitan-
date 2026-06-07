(function() {
  const pageEl = document.getElementById('page-data');
  if (pageEl) {
    pageEl.innerHTML = `
      <div class="toolbar" style="margin-bottom: 1.5rem">
        <div class="search-wrap">
          <i class="ti ti-search"></i>
          <input type="text" id="searchInput" placeholder="Cari rumah atau nama pemilik..." oninput="renderAll()" />
        </div>
        <select class="filter-select" id="filterSel" onchange="renderAll()">
          <option value="all">Semua Status</option>
          <option value="paid">Sudah Bayar Lunas</option>
          <option value="unpaid">Belum Bayar</option>
        </select>
        <button class="btn btn-ghost bendahara-only"
          onclick="toast('Mencetak QR untuk semua rumah...', '<i class=\\'ti ti-printer\\'></i>')">
          <i class="ti ti-printer"></i> Cetak QR Massal
        </button>
        <div class="progress-pill">
          <div class="prog-bar">
            <div class="prog-fill" id="toolbarProg" style="width:0%"></div>
          </div>
          <span id="toolbarPct">0%</span>
        </div>
      </div>

      <div class="cards-grid-wrapper">
        <div id="cardsGrid" class="cards-grid"></div>
      </div>

      <!-- KERANJANG SETORAN (Hanya untuk Warga) -->
      <div id="keranjangSetoran" class="warga-only hidden"
        style="position:fixed;bottom:2rem;left:50%;transform:translateX(-50%);background:var(--surface);padding:1rem 1.5rem;border-radius:100px;box-shadow:var(--shadow-premium);border:1px solid var(--border);display:flex;align-items:center;gap:1rem;z-index:100;">
        <div style="font-size:14px;font-weight:800;color:var(--text)"><span id="countSetoran"
            style="color:var(--primary);font-size:16px;">0</span> Rumah Ditandai</div>
        <button class="btn btn-primary" onclick="kirimSetoran()"
          style="padding:10px 20px;border-radius:100px;font-size:14px;">
          <i class="ti ti-send"></i> Kirim Laporan
        </button>
      </div>
    `;
  }
})();
