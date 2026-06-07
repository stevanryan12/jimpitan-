(function() {
  const pageEl = document.getElementById('page-tentang');
  if (pageEl) {
    pageEl.innerHTML = `
      <div class="riwayat-panel" style="max-width:500px">
        <div style="display:flex;align-items:center;gap:16px;margin-bottom:1.5rem">
          <div
            style="width:64px;height:64px;border-radius:16px;background:linear-gradient(135deg, var(--primary), #4F46E5);display:flex;align-items:center;justify-content:center;box-shadow:0 8px 16px rgba(37,99,235,0.25)">
            <i class="ti ti-building-community" style="font-size:32px;color:#fff"></i>
          </div>
          <div>
            <div style="font-size:20px;font-weight:800;color:var(--text)">Jimpitan Kampung</div>
            <div style="font-size:14px;color:var(--text3);font-weight:600">Premium Version 3.0</div>
          </div>
        </div>
        <p style="font-size:14px;color:var(--text2);line-height:1.8">
          Sistem pencatatan iuran warga kampung berbasis teknologi web modern. Memudahkan RT/RW dalam mengelola kas
          warga, dilengkapi dengan fitur scan QR Code. Data tersimpan di perangkat secara lokal dan aman.
        </p>
      </div>
    `;
  }
})();
