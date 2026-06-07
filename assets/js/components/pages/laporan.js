(function() {
  const pageEl = document.getElementById('page-laporan');
  if (pageEl) {
    pageEl.innerHTML = `
      <div class="riwayat-panel" style="max-width: 800px">
        <div class="panel-head"
          style="margin-bottom: 1.5rem; border-bottom: 1px dashed var(--border); padding-bottom: 1rem;">
          <div class="panel-title" style="font-size:18px;font-weight:800;"><i class="ti ti-chart-bar"></i>
            Rekapitulasi Pemasukan</div>
        </div>

        <div class="laporan-grid" id="laporanGrid"></div>

        <div class="panel-head"
          style="margin-top: 2.5rem; margin-bottom: 1.5rem; border-bottom: 1px dashed var(--border); padding-bottom: 1rem;">
          <div class="panel-title" style="font-size:18px;font-weight:800;"><i class="ti ti-calendar-stats"></i> Tren
            Keuangan</div>
        </div>

        <div class="laporan-grid" id="laporanBerkalaGrid" style="grid-template-columns: repeat(3, 1fr);">
          <div class="stat-card" style="background:var(--success-light);border-color:rgba(56,161,105,0.2);">
            <div class="stat-icon" style="background:#fff;color:var(--success)"><i class="ti ti-calendar"></i></div>
            <div>
              <div class="stat-label">Minggu Ini</div>
              <div class="stat-value" id="lapMinggu" style="font-size:20px;">Rp 0</div>
            </div>
          </div>
          <div class="stat-card" style="background:var(--primary-light);border-color:rgba(47,133,90,0.2);">
            <div class="stat-icon" style="background:#fff;color:var(--primary)"><i class="ti ti-calendar-event"></i>
            </div>
            <div>
              <div class="stat-label">Bulan Ini</div>
              <div class="stat-value" id="lapBulan" style="font-size:20px;">Rp 0</div>
            </div>
          </div>
          <div class="stat-card" style="background:#FEEBC8;border-color:rgba(221,107,32,0.2);">
            <div class="stat-icon" style="background:#fff;color:var(--secondary)"><i class="ti ti-calendar-time"></i>
            </div>
            <div>
              <div class="stat-label">Tahun Ini</div>
              <div class="stat-value" id="lapTahun" style="font-size:20px;">Rp 0</div>
            </div>
          </div>
        </div>

        <hr style="border:none;border-top:1px dashed var(--border);margin:2rem 0">
        <div class="prog-row">
          <div class="prog-label"><span>Progress Pengumpulan Iuran Bulan Ini</span><span id="laporanPct">0%</span>
          </div>
          <div class="prog-track">
            <div class="prog-thumb" id="laporanBar" style="width:0%"></div>
          </div>
        </div>
      </div>
    `;
  }
})();
