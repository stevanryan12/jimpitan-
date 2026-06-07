(function() {
  const pageEl = document.getElementById('page-setoran');
  if (pageEl) {
    pageEl.innerHTML = `
      <!-- Admin-only verification section -->
      <div class="admin-role-only" id="adminSetoranVerificationContainer" style="margin-bottom: 2rem;">
        <div class="panel-head" style="margin-bottom: 1rem;">
          <div class="panel-title" style="font-size:18px;font-weight:800;color:var(--text)"><i
              class="ti ti-receipt"></i> Verifikasi Laporan Setoran</div>
        </div>
        <div id="setoranContainer" class="riwayat-panel"
          style="background:transparent;border:none;box-shadow:none;padding:0;">
          <!-- Konten setoran di-render lewat JS -->
        </div>
      </div>

      <!-- REKAP PER BLOK -->
      <div id="rekapBlokContainer" style="margin-bottom: 2rem; display: flex; flex-direction: column; gap: 1.5rem;">
      </div>

      <!-- Riwayat Uang Masuk table (Public) -->
      <div class="panel-head" style="margin-bottom: 1rem; margin-top: 2rem;">
        <div class="panel-title" style="font-size:18px;font-weight:800;color:var(--success)"><i
            class="ti ti-arrow-down-left"></i> Riwayat Uang Masuk</div>
      </div>
      <div class="riwayat-panel">
        <table class="riwayat-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Nama Rumah</th>
              <th>Pemilik</th>
              <th>Piket (Pengambil)</th>
              <th>Pencatat (Scanner)</th>
              <th>Waktu Pembayaran</th>
              <th>Nominal</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody id="riwayatBody"></tbody>
        </table>
      </div>
    `;
  }
})();
