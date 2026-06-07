// ==========================================
// PREMIUM DIGITAL RECEIPT (KWITANSI) MODULES
// ==========================================

function viewReceipt(idx) {
  const r = riwayat[idx];
  if (!r) return;
  
  const dateObj = new Date(r.ts || Date.now());
  const formattedDate = dateObj.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const formattedTime = dateObj.toLocaleTimeString('id-ID');
  
  const dateStr = dateObj.getFullYear() + String(dateObj.getMonth() + 1).padStart(2, '0') + String(dateObj.getDate()).padStart(2, '0');
  const refId = `#TX-${dateStr}-${String(idx + 1).padStart(3, '0')}`;
  
  document.getElementById('receiptRef').textContent = refId;
  document.getElementById('receiptOwner').textContent = r.p;
  document.getElementById('receiptHouse').textContent = r.r;
  document.getElementById('receiptMethod').textContent = r.metode === 'QR Code' ? '📱 QR Code / Digital' : '💵 Uang Tunai (Cash)';
  document.getElementById('receiptTime').textContent = `${formattedDate}, ${formattedTime}`;
  document.getElementById('receiptAmount').textContent = 'Rp ' + nominal.toLocaleString('id-ID');
  document.getElementById('receiptTerbilang').textContent = `"${terbilang(nominal)} Rupiah"`;
  document.getElementById('receiptSignatureDate').textContent = `Kampung Premium, ${formattedDate}`;
  
  const receiptPetugasEl = document.getElementById('receiptPetugas');
  if (receiptPetugasEl) {
    receiptPetugasEl.textContent = r.petugas || '-';
  }
  
  const pencatatRole = r.pencatat 
    ? (r.pencatat === 'admin' ? 'Admin' : (r.pencatat === 'bendahara' ? 'Bendahara' : (r.pencatat === 'ketua' ? 'Ketua RT' : (r.pencatat === 'warga' ? 'Warga' : r.pencatat))))
    : 'Bendahara RT';
  document.getElementById('receiptPencatat').textContent = pencatatRole;
  
  document.getElementById('receiptModal').classList.add('show');
}

function viewReceiptByRef(ts) {
  const idx = riwayat.findIndex(r => r.ts == ts);
  if (idx !== -1) {
    viewReceipt(idx);
  }
}

function openReceiptForHouse(houseName) {
  const idx = riwayat.findIndex(r => r.r === houseName);
  if (idx !== -1) {
    viewReceipt(idx);
  } else {
    celebratePaid(houseName);
  }
}

function closeReceiptModal() {
  const modal = document.getElementById('receiptModal');
  if (modal) modal.classList.remove('show');
}

function printReceipt() {
  const printContents = document.getElementById('receiptPrintArea').innerHTML;
  const printWindow = window.open('', '', 'height=600,width=800');
  printWindow.document.write('<html><head><title>Cetak Kwitansi Jimpitan</title>');
  printWindow.document.write('<style>');
  printWindow.document.write('body { font-family: "Courier New", Courier, monospace; color: #000; padding: 40px; text-align: left; }');
  printWindow.document.write('table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }');
  printWindow.document.write('td { padding: 4px 0; }');
  printWindow.document.write('</style></head><body>');
  printWindow.document.write(printContents);
  printWindow.document.write('</body></html>');
  printWindow.document.close();
  
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 250);
}
