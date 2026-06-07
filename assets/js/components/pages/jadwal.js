(function() {
  const pageEl = document.getElementById('page-jadwal');
  if (pageEl) {
    pageEl.innerHTML = `
      <div class="toolbar" style="margin-bottom: 1.5rem">
        <div class="search-wrap">
          <i class="ti ti-search"></i>
          <input type="text" id="searchJadwal" placeholder="Cari hari atau nama petugas..."
            oninput="renderJadwal()" />
        </div>
        <button class="btn btn-primary admin-only"
          onclick="toast('Fitur atur jadwal akan segera hadir', '<i class=\\'ti ti-calendar-plus\\'></i>')">
          <i class="ti ti-calendar-plus"></i> Atur Jadwal
        </button>
      </div>
      <div class="cards-grid" id="jadwalGrid"></div>
    `;
  }
})();
