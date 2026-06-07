(function() {
  const pageEl = document.getElementById('page-pengeluaran');
  if (pageEl) {
    pageEl.innerHTML = `
      <!-- Admin-only input form and Donut Chart side-by-side or stacked -->
      <div style="display: flex; gap: 1.5rem; flex-wrap: wrap; justify-content: center; margin-bottom: 2rem;">
        <div class="bendahara-only" id="adminPengeluaranFormContainer"
          style="flex: 1; min-width: 320px; max-width: 600px;">
          <div class="riwayat-panel" style="height: 100%;">
            <div class="panel-head" style="margin-bottom: 1.5rem;">
              <div class="panel-title" style="font-size:18px;font-weight:800;"><i class="ti ti-plus"></i> Catat
                Pengeluaran Baru</div>
            </div>
            <form onsubmit="tambahPengeluaran(event)">
              <div class="form-group" style="margin-bottom: 1rem;">
                <label class="form-label">Keterangan / Tujuan Pengeluaran</label>
                <input type="text" id="pengeluaranKet" class="form-input"
                  placeholder="Contoh: Beli kopi ronda, Bayar listrik pos" required />
              </div>
              <div class="form-group" style="margin-bottom: 1rem;">
                <label class="form-label">Kategori Pengeluaran</label>
                <select id="pengeluaranKategori" class="form-input" style="font-weight:700;cursor:pointer;">
                  <option value="Konsumsi Ronda">Konsumsi Ronda</option>
                  <option value="Alat Keamanan">Alat Keamanan / Pos Ronda</option>
                  <option value="Operasional RT">Operasional RT & Kebersihan</option>
                  <option value="Sosial & Donasi">Sosial & Donasi Warga</option>
                </select>
              </div>
              <div class="form-group" style="margin-bottom: 1.5rem;">
                <label class="form-label">Nominal (Rp)</label>
                <input type="number" id="pengeluaranNominal" class="form-input" placeholder="Contoh: 50000"
                  required />
              </div>
              <button type="submit" class="btn btn-primary" style="width:100%">
                <i class="ti ti-device-floppy"></i> Simpan Pengeluaran
              </button>
            </form>
          </div>
        </div>

        <div class="riwayat-panel"
          style="flex: 1; min-width: 320px; max-width: 500px; display: flex; flex-direction: column; align-items: center;">
          <div class="panel-head"
            style="width: 100%; border-bottom: 1px dashed var(--border); padding-bottom: 0.5rem; margin-bottom: 1rem;">
            <div class="panel-title" style="font-size:16px;font-weight:800;"><i class="ti ti-chart-donut"></i>
              Distribusi Pengeluaran Kas</div>
          </div>
          <div style="position:relative;height:220px;width:100%;display:flex;justify-content:center;">
            <canvas id="expenseChart"></canvas>
          </div>
        </div>
      </div>

      <!-- Public Outflow History -->
      <div class="panel-head" style="margin-bottom: 1rem; margin-top: 2rem;">
        <div class="panel-title" style="font-size:18px;font-weight:800;color:var(--danger)"><i
            class="ti ti-arrow-up-right"></i> Riwayat Uang Keluar (Pengeluaran)</div>
      </div>
      <div class="riwayat-panel">
        <table class="riwayat-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Tanggal</th>
              <th>Keterangan</th>
              <th>Kategori</th>
              <th>Nominal</th>
            </tr>
          </thead>
          <tbody id="pengeluaranBody"></tbody>
        </table>
      </div>
    `;
  }
})();
