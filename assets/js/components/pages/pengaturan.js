(function() {
  const pageEl = document.getElementById('page-pengaturan');
  if (pageEl) {
    pageEl.innerHTML = `
      <div class="riwayat-panel" style="max-width:500px">
        <div style="font-size:15px;font-weight:800;margin-bottom:1rem;color:var(--text)">Besaran Iuran Per Rumah</div>
        <div style="display:flex;gap:12px;align-items:center;margin-bottom:0.5rem">
          <div style="position:relative;flex:1">
            <span
              style="position:absolute;left:14px;top:50%;transform:translateY(-50%);color:var(--text2);font-weight:700">Rp</span>
            <input type="number" id="nominalInput" value="5000"
              style="width:100%;padding:14px 16px 14px 44px;border:1px solid var(--border);border-radius:12px;font-size:15px;font-family:inherit;font-weight:600" />
          </div>
          <button class="btn btn-primary bendahara-only" onclick="saveNominal()">Simpan</button>
        </div>
        <p style="font-size:13px;color:var(--text3);line-height:1.5">Nominal ini akan menjadi standar tagihan iuran
          wajib warga per bulan.</p>
      </div>
    `;
  }
})();
