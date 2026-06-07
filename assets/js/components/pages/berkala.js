(function() {
  const pageEl = document.getElementById('page-berkala');
  if (pageEl) {
    pageEl.innerHTML = `
      <div class="riwayat-panel" style="max-width: 800px;">
        <!-- Segmented Control/Tabs for Period Filter -->
        <div style="display: flex; gap: 8px; margin-bottom: 1.5rem; background: var(--bg); padding: 6px; border-radius: 14px; border: 1px solid var(--border);">
          <button class="btn btn-ghost" id="tabPeriod-hari" onclick="setPeriodFilter('hari')" style="flex: 1; border-radius: 10px; font-weight: 700; font-size: 14px; padding: 10px 0; border: none; transition: all 0.2s;">Hari Ini</button>
          <button class="btn btn-ghost" id="tabPeriod-bulan" onclick="setPeriodFilter('bulan')" style="flex: 1; border-radius: 10px; font-weight: 700; font-size: 14px; padding: 10px 0; border: none; transition: all 0.2s;">Bulan Ini</button>
          <button class="btn btn-ghost" id="tabPeriod-tahun" onclick="setPeriodFilter('tahun')" style="flex: 1; border-radius: 10px; font-weight: 700; font-size: 14px; padding: 10px 0; border: none; transition: all 0.2s;">Tahun Ini</button>
        </div>

        <!-- Date Selector (Only shown for 'Hari Ini') -->
        <div id="periodDateWrap" style="margin-bottom: 1.5rem; display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; background: var(--bg); padding: 12px 16px; border-radius: 16px; border: 1px solid var(--border); transition: all 0.2s;">
          <span style="font-size: 14px; font-weight: 800; color: var(--text2); display: flex; align-items: center; gap: 8px;">
            <i class="ti ti-calendar-event" style="color: var(--primary); font-size: 20px;"></i> Pilih Tanggal Pantau:
          </span>
          <input type="date" id="periodDatePicker" onchange="renderPeriodReport()" style="padding: 10px 16px; border: 1px solid var(--border); border-radius: 12px; font-family: inherit; font-weight: 800; color: var(--text); background: #fff; cursor: pointer; box-shadow: var(--shadow-sm); outline: none; border-color: rgba(47,133,90,0.2);" />
        </div>

        <!-- Two Column Layout for lists -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem;">
          <!-- Column 1: Sudah Bayar -->
          <div style="background: rgba(16, 185, 129, 0.04); padding: 1.25rem; border-radius: 20px; border: 1.5px solid rgba(16, 185, 129, 0.15);">
            <div style="font-size: 15px; font-weight: 800; color: var(--success); margin-bottom: 1rem; display: flex; align-items: center; justify-content: space-between;">
              <span><i class="ti ti-circle-check-filled"></i> Sudah Bayar</span>
              <span class="badge badge-paid" id="periodPaidCount" style="font-size: 12px; padding: 4px 10px;">0 Rumah</span>
            </div>
            <div id="periodPaidList" style="display: flex; flex-direction: column; gap: 10px; max-height: 350px; overflow-y: auto; padding-right: 4px;">
              <!-- Dynamically populated -->
            </div>
          </div>

          <!-- Column 2: Belum Bayar (Bukti) -->
          <div style="background: rgba(239, 68, 68, 0.04); padding: 1.25rem; border-radius: 20px; border: 1.5px solid rgba(239, 68, 68, 0.15);">
            <div style="font-size: 15px; font-weight: 800; color: #EF4444; margin-bottom: 1rem; display: flex; align-items: center; justify-content: space-between;">
              <span><i class="ti ti-circle-x-filled"></i> Belum Bayar (Bukti)</span>
              <span class="badge" id="periodUnpaidCount" style="font-size: 12px; padding: 4px 10px; background: rgba(239, 68, 68, 0.15); color: #EF4444; font-weight: 800;">0 Rumah</span>
            </div>
            <div id="periodUnpaidList" style="display: flex; flex-direction: column; gap: 10px; max-height: 350px; overflow-y: auto; padding-right: 4px;">
              <!-- Dynamically populated -->
            </div>
          </div>
        </div>
      </div>
    `;
  }
})();
