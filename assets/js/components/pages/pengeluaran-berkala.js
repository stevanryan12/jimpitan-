(function() {
  const pageEl = document.getElementById('page-pengeluaran-berkala');
  if (pageEl) {
    pageEl.innerHTML = `
      <div class="riwayat-panel" style="max-width: 800px;">
        <!-- Segmented Control/Tabs for Period Filter -->
        <div style="display: flex; gap: 8px; margin-bottom: 1.5rem; background: var(--bg); padding: 6px; border-radius: 14px; border: 1px solid var(--border);">
          <button class="btn btn-ghost" id="tabExpPeriod-hari" onclick="setPeriodExpenseFilter('hari')" style="flex: 1; border-radius: 10px; font-weight: 700; font-size: 14px; padding: 10px 0; border: none; transition: all 0.2s;">Hari Ini</button>
          <button class="btn btn-ghost" id="tabExpPeriod-bulan" onclick="setPeriodExpenseFilter('bulan')" style="flex: 1; border-radius: 10px; font-weight: 700; font-size: 14px; padding: 10px 0; border: none; transition: all 0.2s;">Bulan Ini</button>
          <button class="btn btn-ghost" id="tabExpPeriod-tahun" onclick="setPeriodExpenseFilter('tahun')" style="flex: 1; border-radius: 10px; font-weight: 700; font-size: 14px; padding: 10px 0; border: none; transition: all 0.2s;">Tahun Ini</button>
        </div>

        <!-- Date Selector (Only shown for 'Hari Ini') -->
        <div id="expensePeriodDateWrap" style="margin-bottom: 1.5rem; display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; background: var(--bg); padding: 12px 16px; border-radius: 16px; border: 1px solid var(--border); transition: all 0.2s;">
          <span style="font-size: 14px; font-weight: 800; color: var(--text2); display: flex; align-items: center; gap: 8px;">
            <i class="ti ti-calendar-event" style="color: var(--danger); font-size: 20px;"></i> Pilih Tanggal Pantau Pengeluaran:
          </span>
          <input type="date" id="expensePeriodDatePicker" onchange="renderPeriodExpenseReport()" style="padding: 10px 16px; border: 1px solid var(--border); border-radius: 12px; font-family: inherit; font-weight: 800; color: var(--text); background: #fff; cursor: pointer; box-shadow: var(--shadow-sm); outline: none; border-color: rgba(229,62,62,0.2);" />
        </div>

        <!-- Total Expense Summary Card for Period -->
        <div style="background: rgba(229, 62, 62, 0.04); border: 1.5px solid rgba(229, 62, 62, 0.15); padding: 1.5rem; border-radius: 20px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 16px;">
          <div>
            <div style="font-size: 12px; font-weight: 800; color: var(--text3); text-transform: uppercase; letter-spacing: 0.05em;">Total Pengeluaran Periode Ini</div>
            <div id="periodExpenseTotalValue" style="font-size: 32px; font-weight: 900; color: var(--danger); margin-top: 4px;">Rp 0</div>
          </div>
          <div id="periodExpenseCount" class="badge" style="background: rgba(229, 62, 62, 0.15); color: var(--danger); font-weight: 800; font-size: 13px; padding: 6px 14px; border-radius: 100px;">0 Transaksi</div>
        </div>

        <!-- Expenditures List -->
        <div id="periodExpenseList" style="display: flex; flex-direction: column; gap: 10px;">
          <!-- Dynamically populated -->
        </div>
      </div>
    `;
  }
})();
