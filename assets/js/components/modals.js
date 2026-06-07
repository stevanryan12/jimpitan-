(function () {
  const modalsEl = document.getElementById('modalsContainer');
  if (modalsEl) {
    modalsEl.innerHTML = `
      <!-- CUSTOM MODAL -->
      <div class="modal-overlay" id="customModal">
        <div class="modal-content">
          <div class="modal-icon primary" id="modalIcon"><i class="ti ti-info-circle"></i></div>
          <h3 class="modal-title" id="modalTitle">Konfirmasi</h3>
          <p class="modal-desc" id="modalDesc">Apakah Anda yakin?</p>
          <div class="modal-actions">
            <button class="btn btn-ghost" onclick="closeModal()">Batal</button>
            <button class="btn btn-primary" id="modalBtnConfirm" onclick="if(currentModalConfirm) currentModalConfirm()">Ya, Lanjutkan</button>
          </div>
        </div>
      </div>

      <!-- QR SCANNER SIMULATOR MODAL -->
      <div class="modal-overlay" id="qrScannerModal">
        <div class="modal-content" style="max-width: 480px; text-align: left; padding: 2rem 1.5rem; border-radius: 28px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
            <h3 style="font-size: 20px; font-weight: 800; color: var(--text); display: flex; align-items: center; gap: 8px;">
              <i class="ti ti-scan" style="color: var(--primary); font-size: 24px;"></i> QR Code Scanner Simulator
            </h3>
            <button onclick="closeQrScanner()" style="background: none; border: none; font-size: 20px; cursor: pointer; color: var(--text3);"><i class="ti ti-x"></i></button>
          </div>

          <!-- Animated Scanner Viewport -->
          <div style="position: relative; width: 100%; height: 200px; background: #000; border-radius: 16px; overflow: hidden; display: flex; align-items: center; justify-content: center; margin-bottom: 1.5rem;">
            <!-- Scanning lines and viewfinder -->
            <div style="position: absolute; border: 2px solid var(--primary); width: 140px; height: 140px; border-radius: 12px; box-shadow: 0 0 15px var(--primary);"></div>
            <div style="position: absolute; width: 100%; height: 2px; background: rgba(56, 161, 105, 0.8); box-shadow: 0 0 10px #38A169; animation: scanLine 2s linear infinite;"></div>
            <div style="color: #fff; font-size: 13px; font-weight: 700; z-index: 10; position: absolute; bottom: 12px; background: rgba(0,0,0,0.6); padding: 4px 12px; border-radius: 100px;">
              <i class="ti ti-loader animate-spin" style="margin-right: 6px;"></i> Menunggu QR di depan kamera...
            </div>
          </div>

          <div style="font-size: 14px; font-weight: 700; color: var(--text); margin-bottom: 8px;">Pilih Rumah untuk Disimulasikan:</div>
          <div id="qrScannerHousesList" style="max-height: 180px; overflow-y: auto; display: flex; flex-direction: column; gap: 8px; padding-right: 4px; margin-bottom: 1.5rem;">
            <!-- Houses list will be rendered dynamically -->
          </div>

          <button class="btn btn-ghost" onclick="closeQrScanner()" style="width: 100%;">Tutup</button>
        </div>
      </div>

      <!-- DEDICATED RECORDING MODAL -->
      <div class="modal-overlay" id="recordingModal">
        <div class="modal-content" style="max-width: 440px; text-align: left; border-radius: 28px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
            <h3 style="font-size: 20px; font-weight: 800; color: var(--text); display: flex; align-items: center; gap: 8px;">
              <i class="ti ti-cash" style="color: var(--primary); font-size: 24px;"></i> Catat Jimpitan
            </h3>
            <button onclick="closeRecordingModal()" style="background: none; border: none; font-size: 20px; cursor: pointer; color: var(--text3);"><i class="ti ti-x"></i></button>
          </div>

          <div style="background: var(--bg); padding: 16px; border-radius: 16px; border: 1px solid var(--border); margin-bottom: 1.5rem;">
            <div style="font-size: 11px; color: var(--text3); font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;">Detail Rumah</div>
            <div id="recHouseName" style="font-size: 18px; font-weight: 800; color: var(--text); margin-top: 4px;">Blok A1</div>
            <div id="recHouseOwner" style="font-size: 14px; color: var(--text2); font-weight: 600; margin-top: 2px;">Budi Santoso</div>
            <div id="recAmount" style="font-size: 16px; color: var(--primary); font-weight: 800; margin-top: 8px;">Rp 5.000</div>
          </div>

          <div class="form-group" style="margin-bottom: 1rem;">
            <label class="form-label"><i class="ti ti-calendar" style="color: var(--primary);"></i> Hari Piket</label>
            <select id="recHariSelect" class="form-input" style="width: 100%; font-weight: 600;" onchange="updateRecordingPetugasSelect()">
              <option value="Senin">Senin</option>
              <option value="Selasa">Selasa</option>
              <option value="Rabu">Rabu</option>
              <option value="Kamis">Kamis</option>
              <option value="Jumat">Jumat</option>
              <option value="Sabtu">Sabtu</option>
              <option value="Minggu">Minggu</option>
            </select>
          </div>

          <div class="form-group" style="margin-bottom: 1.25rem;">
            <label class="form-label"><i class="ti ti-user-check" style="color: var(--primary);"></i> Petugas Piket (Pengambil)</label>
            <select id="recPetugasSelect" class="form-input" style="width: 100%; font-weight: 600;"></select>
          </div>

          <div class="form-group" style="margin-bottom: 1.25rem;">
            <label class="form-label"><i class="ti ti-wallet" style="color: var(--warning);"></i> Metode Pembayaran</label>
            <select id="recMetodeSelect" class="form-input" style="width: 100%; font-weight: 800; cursor: pointer;">
              <option value="Tunai">💵 Uang Tunai (Cash)</option>
              <option value="QR Code">📱 QR Code / Digital</option>
            </select>
          </div>

          <div class="form-group" style="margin-bottom: 1.5rem;">
            <label class="form-label"><i class="ti ti-device-laptop" style="color: var(--secondary);"></i> Pencatat (Akun / Scanner)</label>
            <input type="text" id="recPencatatInput" class="form-input" style="width: 100%; font-weight: 600; background: var(--bg); color: var(--text2); cursor: not-allowed;" readonly />
          </div>

          <div style="display: flex; gap: 12px;">
            <button class="btn btn-ghost" onclick="closeRecordingModal()" style="flex: 1;">Batal</button>
            <button class="btn btn-primary" onclick="confirmRecording()" style="flex: 1;"><i class="ti ti-device-floppy"></i> Simpan</button>
          </div>
        </div>
      </div>

      <!-- WARGA SETORAN SUBMISSION MODAL -->
      <div class="modal-overlay" id="wargaSetoranModal">
        <div class="modal-content" style="max-width: 420px; text-align: left; border-radius: 28px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
            <h3 style="font-size: 20px; font-weight: 800; color: var(--text); display: flex; align-items: center; gap: 8px;">
              <i class="ti ti-send" style="color: var(--primary); font-size: 24px;"></i> Kirim Laporan Setoran
            </h3>
            <button onclick="closeWargaSetoranModal()" style="background: none; border: none; font-size: 20px; cursor: pointer; color: var(--text3);"><i class="ti ti-x"></i></button>
          </div>

          <div style="background: var(--bg); padding: 16px; border-radius: 16px; border: 1px solid var(--border); margin-bottom: 1.5rem;">
            <div style="font-size: 11px; color: var(--text3); font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;">Ringkasan Laporan</div>
            <div id="wargaSetoranCount" style="font-size: 16px; font-weight: 800; color: var(--text); margin-top: 4px;">0 Rumah Ditandai</div>
            <div id="wargaSetoranAmount" style="font-size: 18px; color: var(--primary); font-weight: 800; margin-top: 4px;">Total Setoran: Rp 0</div>
          </div>

          <div class="form-group" style="margin-bottom: 1rem;">
            <label class="form-label"><i class="ti ti-calendar" style="color: var(--primary);"></i> Hari Piket Keliling</label>
            <select id="wargaSetoranHariSelect" class="form-input" style="width: 100%; font-weight: 600;" onchange="updateWargaSetoranPetugasSelect()">
              <option value="Senin">Senin</option>
              <option value="Selasa">Selasa</option>
              <option value="Rabu">Rabu</option>
              <option value="Kamis">Kamis</option>
              <option value="Jumat">Jumat</option>
              <option value="Sabtu">Sabtu</option>
              <option value="Minggu">Minggu</option>
            </select>
          </div>

          <div class="form-group" style="margin-bottom: 1.5rem;">
            <label class="form-label"><i class="ti ti-user-check" style="color: var(--primary);"></i> Petugas Piket (Pengambil)</label>
            <select id="wargaSetoranPetugasSelect" class="form-input" style="width: 100%; font-weight: 600;"></select>
          </div>

          <div style="display: flex; gap: 12px;">
            <button class="btn btn-ghost" onclick="closeWargaSetoranModal()" style="flex: 1;">Batal</button>
            <button class="btn btn-primary" onclick="confirmWargaSetoran()" style="flex: 1;"><i class="ti ti-send"></i> Kirim</button>
          </div>
        </div>
      </div>

      <!-- PREMIUM DIGITAL RECEIPT (KWITANSI) MODAL -->
      <div class="modal-overlay" id="receiptModal" style="z-index: 1000;">
        <div class="modal-content" style="max-width: 500px; padding: 2rem; border-radius: 28px; text-align: left; position: relative;">
          <!-- Close Button -->
          <button onclick="closeReceiptModal()" style="position: absolute; right: 1.5rem; top: 1.5rem; background: none; border: none; font-size: 20px; cursor: pointer; color: var(--text3);"><i class="ti ti-x"></i></button>

          <!-- Printable Area -->
          <div id="receiptPrintArea" style="background: #fff; padding: 1.5rem; border: 2px double #000; border-radius: 16px; font-family: 'Courier New', Courier, monospace; color: #000; box-shadow: var(--shadow-sm);">
            <!-- Receipt Header / Kop Surat -->
            <div style="text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 15px;">
              <div style="font-size: 16px; font-weight: 800; text-transform: uppercase;">Kwitansi Jimpitan RT</div>
              <div style="font-size: 11px; font-weight: 700; color: #4a5568;">RUKUN TETANGGA 03 / RW 04 KAMPUNG PREMIUM</div>
              <div style="font-size: 9px; color: #718096; margin-top: 2px;">Sistem Iuran Terpadu Digital</div>
            </div>

            <!-- Receipt Metadata -->
            <table style="width: 100%; font-size: 12px; border-collapse: collapse; margin-bottom: 15px;">
              <tr>
                <td style="width: 35%; font-weight: 700; padding: 4px 0;">No. Ref</td>
                <td style="width: 5%;">:</td>
                <td id="receiptRef" style="font-weight: 800; color: var(--primary);">#TX-20260526-001</td>
              </tr>
              <tr>
                <td style="font-weight: 700; padding: 4px 0;">Telah Diterima Dari</td>
                <td>:</td>
                <td id="receiptOwner" style="font-weight: 800; text-transform: uppercase;">BUDI SANTOSO</td>
              </tr>
              <tr>
                <td style="font-weight: 700; padding: 4px 0;">No. Rumah / Blok</td>
                <td>:</td>
                <td id="receiptHouse" style="font-weight: 800;">BLOK A1</td>
              </tr>
              <tr>
                <td style="font-weight: 700; padding: 4px 0;">Untuk Pembayaran</td>
                <td>:</td>
                <td style="font-weight: 700;">Iuran Jimpitan Wajib Bulanan</td>
              </tr>
              <tr>
                <td style="font-weight: 700; padding: 4px 0;">Metode Bayar</td>
                <td>:</td>
                <td id="receiptMethod" style="font-weight: 800;">💵 UANG TUNAI</td>
              </tr>
              <tr>
                <td style="font-weight: 700; padding: 4px 0;">Waktu Transaksi</td>
                <td>:</td>
                <td id="receiptTime" style="font-weight: 700;">26/05/2026, 10:24:30</td>
              </tr>
            </table>

            <!-- Nominal Box -->
            <div style="background: #f7fafc; border: 1px dashed #000; padding: 12px; border-radius: 8px; text-align: center; margin-bottom: 15px;">
              <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #4a5568;">Jumlah Pembayaran</div>
              <div id="receiptAmount" style="font-size: 24px; font-weight: 900; color: var(--primary); margin-top: 4px;">Rp 5.000</div>
              <div id="receiptTerbilang" style="font-size: 10px; font-style: italic; color: #718096; margin-top: 2px;">"Lima Ribu Rupiah"</div>
            </div>

            <!-- Footer Stamp / Signatures -->
            <div style="display: flex; justify-content: space-between; align-items: flex-end; font-size: 11px; margin-top: 1.5rem;">
              <div style="text-align: center; width: 40%; font-family: sans-serif;">
                <div style="font-size: 9px; color: #a0aec0;">Status Kwitansi</div>
                <div style="font-weight: 800; color: var(--success); border: 2px solid var(--success); padding: 4px 8px; border-radius: 6px; transform: rotate(-5deg); display: inline-block; margin-top: 4px; text-transform: uppercase;">LUNAS VERIFIED</div>
              </div>
              <div style="text-align: center; width: 45%;">
                <div id="receiptSignatureDate" style="font-size: 9px; margin-bottom: 30px;">Kampung Premium, 26 Mei 2026</div>
                <div style="border-top: 1px solid #000; padding-top: 4px; font-weight: 700;" id="receiptPencatat">Bendahara RT</div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div style="display: flex; gap: 12px; margin-top: 1.5rem;">
            <button class="btn btn-ghost" onclick="closeReceiptModal()" style="flex: 1;">Tutup</button>
            <button class="btn btn-primary" onclick="printReceipt()" style="flex: 1;"><i class="ti ti-printer"></i> Cetak / Simpan</button>
          </div>
        </div>
      </div>

      <!-- SPEECH STATUS PANEL -->
      <div class="speech-status-panel" id="speechStatusPanel">
        <div style="font-size: 11px; text-transform: uppercase; color: var(--secondary); letter-spacing: 0.08em; font-weight: 800;">Asisten Suara Jimpitan</div>
        <div id="speechStatusText" style="font-size: 14px; font-weight: 700; color: #fff;">Klik mic untuk berbicara...</div>
        <div class="speech-wave" id="speechWaveEl" style="display: none;">
          <div class="speech-bar"></div>
          <div class="speech-bar"></div>
          <div class="speech-bar"></div>
          <div class="speech-bar"></div>
          <div class="speech-bar"></div>
        </div>
      </div>

      <style>
        @keyframes scanLine {
          0% { top: 0%; }
          50% { top: 100%; }
          100% { top: 0%; }
        }
        .animate-spin {
          display: inline-block;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      </style>
    `;
  }
})();
