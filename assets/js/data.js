// DATA SYSTEM & LOCALSTORAGE STATE MANAGEMENT
let houses = JSON.parse(localStorage.getItem('jimp_houses')) || [
  { id: 1, r: 'Blok A1', p: 'Budi Santoso', s: false, w: null },
  { id: 2, r: 'Blok A2', p: 'Slamet Riyadi', s: false, w: null },
  { id: 3, r: 'Blok A3', p: 'Joko Widodo', s: false, w: null },
  { id: 4, r: 'Blok A4', p: 'Rina Nose', s: false, w: null },
  { id: 5, r: 'Blok A5', p: 'Agus Harimurti', s: false, w: null },
  { id: 6, r: 'Blok B1', p: 'Dewi Persik', s: false, w: null },
  { id: 7, r: 'Blok B2', p: 'Rudi Hartono', s: false, w: null },
  { id: 8, r: 'Blok B3', p: 'Andi Mallarangeng', s: false, w: null },
  { id: 9, r: 'Blok B4', p: 'Yanto Basna', s: false, w: null },
  { id: 10, r: 'Blok B5', p: 'Siti Nurhaliza', s: false, w: null },
  { id: 11, r: 'Blok C1', p: 'Bayu Skak', s: false, w: null },
  { id: 12, r: 'Blok C2', p: 'Dian Sastro', s: false, w: null },
  { id: 13, r: 'Blok C3', p: 'Tono Wiyono', s: false, w: null },
  { id: 14, r: 'Blok C4', p: 'Asep Sunandar', s: false, w: null },
  { id: 15, r: 'Blok C5', p: 'Nina Zatulini', s: false, w: null },
  { id: 16, r: 'Blok D1', p: 'Lukman Sardi', s: false, w: null },
  { id: 17, r: 'Blok D2', p: 'Wawan Hendrawan', s: false, w: null },
  { id: 18, r: 'Blok D3', p: 'Fajar Alfian', s: false, w: null },
  { id: 19, r: 'Blok D4', p: 'Rizki Billar', s: false, w: null },
  { id: 20, r: 'Blok D5', p: 'Hendra Setiawan', s: false, w: null },
  { id: 21, r: 'Blok E1', p: 'Yoga Pratama', s: false, w: null },
  { id: 22, r: 'Blok E2', p: 'Farah Quinn', s: false, w: null },
  { id: 23, r: 'Blok E3', p: 'Maya Septha', s: false, w: null },
  { id: 24, r: 'Blok E4', p: 'Indra Bekti', s: false, w: null },
  { id: 25, r: 'Blok E5', p: 'Reza Rahadian', s: false, w: null },
  { id: 26, r: 'Blok F1', p: 'Tari Utama', s: false, w: null },
  { id: 27, r: 'Blok F2', p: 'Udin Sedunia', s: false, w: null },
  { id: 28, r: 'Blok F3', p: 'Nando Kusuma', s: false, w: null },
  { id: 29, r: 'Blok F4', p: 'Putri Titian', s: false, w: null },
  { id: 30, r: 'Blok F5', p: 'Ilham Jaya', s: false, w: null }
];
let riwayat = JSON.parse(localStorage.getItem('jimp_riwayat')) || [];
let nominal = parseInt(localStorage.getItem('jimp_nominal')) || 5000;
let jadwalList = JSON.parse(localStorage.getItem('jimp_jadwal')) || [
  { hari: 'Senin', petugas: ['Budi Santoso', 'Slamet Riyadi'] },
  { hari: 'Selasa', petugas: ['Joko Widodo', 'Rina Nose'] },
  { hari: 'Rabu', petugas: ['Agus Harimurti', 'Dewi Persik'] },
  { hari: 'Kamis', petugas: ['Rudi Hartono', 'Andi Mallarangeng'] },
  { hari: 'Jumat', petugas: ['Yanto Basna', 'Siti Nurhaliza'] },
  { hari: 'Sabtu', petugas: ['Bayu Skak', 'Dian Sastro'] },
  { hari: 'Minggu', petugas: ['Tono Wiyono', 'Asep Sunandar'] }
];
let setoranList = JSON.parse(localStorage.getItem('jimp_setoran')) || [];
let pengeluaranList = JSON.parse(localStorage.getItem('jimp_pengeluaran')) || [];

function save() {
  localStorage.setItem('jimp_houses', JSON.stringify(houses));
  localStorage.setItem('jimp_riwayat', JSON.stringify(riwayat));
  localStorage.setItem('jimp_setoran', JSON.stringify(setoranList));
  localStorage.setItem('jimp_pengeluaran', JSON.stringify(pengeluaranList));
}

function toast(msg, icon) {
  const el = document.getElementById('toastEl');
  if (!el) return;
  el.innerHTML = (icon || '<i class="ti ti-check"></i>') + ' ' + msg;
  el.classList.add('show');
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove('show'), 3000);
}

function updateStats() {
  const s = houses.filter(h => h.s).length;
  const b = houses.length - s;
  const pct = Math.round((s / houses.length) * 100) || 0;
  
  const elTotal = document.getElementById('sTotal');
  const elSudah = document.getElementById('sSudah');
  const elBelum = document.getElementById('sBelum');
  const elTerkumpul = document.getElementById('sTerkumpul');
  const elProg = document.getElementById('toolbarProg');
  const elPct = document.getElementById('toolbarPct');
  
  if (elTotal) elTotal.textContent = houses.length;
  if (elSudah) elSudah.textContent = s;
  if (elBelum) elBelum.textContent = b;
  if (elTerkumpul) elTerkumpul.textContent = 'Rp ' + (s * nominal).toLocaleString('id-ID');
  if (elProg) elProg.style.width = pct + '%';
  if (elPct) elPct.textContent = pct + '%';
}

function terbilang(angka) {
  const bil = ["", "Satu", "Dua", "Tiga", "Empat", "Lima", "Enam", "Tujuh", "Delapan", "Sembilan", "Sepuluh", "Sebelas"];
  let temp = "";
  if (angka < 12) {
    temp = " " + bil[angka];
  } else if (angka < 20) {
    temp = terbilang(angka - 10) + " Belas";
  } else if (angka < 100) {
    temp = terbilang(Math.floor(angka / 10)) + " Puluh" + terbilang(angka % 10);
  } else if (angka < 200) {
    temp = " Seratus" + terbilang(angka - 100);
  } else if (angka < 1000) {
    temp = terbilang(Math.floor(angka / 100)) + " Ratus" + terbilang(angka % 100);
  } else if (angka < 2000) {
    temp = " Seribu" + terbilang(angka - 1000);
  } else if (angka < 1000000) {
    temp = terbilang(Math.floor(angka / 1000)) + " Ribu" + terbilang(angka % 1000);
  }
  return temp.trim();
}
