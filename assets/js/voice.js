// ==========================================
// SMART KAMPUNG CELEBRATION & VOICE MODULE
// ==========================================

let recognition = null;
let isSpeechActive = false;

function initVoiceAssistant() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    console.log("Speech recognition not supported in this browser.");
    return;
  }

  recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.lang = 'id-ID';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onstart = () => {
    isSpeechActive = true;
    const btn = document.getElementById('voiceAssistantBtn');
    if (btn) btn.classList.add('listening');
    const panel = document.getElementById('speechStatusPanel');
    if (panel) {
      panel.classList.add('show');
      document.getElementById('speechStatusText').innerHTML = `<span style="color:#10B981;font-weight:800;"><i class="ti ti-microphone"></i> MIK AKTIF! SILAKAN BICARA...</span>`;
      document.getElementById('speechWaveEl').style.display = 'flex';
    }
  };

  recognition.onend = () => {
    isSpeechActive = false;
    const btn = document.getElementById('voiceAssistantBtn');
    if (btn) btn.classList.remove('listening');
    const wave = document.getElementById('speechWaveEl');
    if (wave) wave.style.display = 'none';
    
    setTimeout(() => {
      if (!isSpeechActive) {
        const panel = document.getElementById('speechStatusPanel');
        if (panel) panel.classList.remove('show');
      }
    }, 5000);
  };

  recognition.onresult = (event) => {
    const speechResult = event.results[0][0].transcript.toLowerCase().trim();
    document.getElementById('speechStatusText').innerHTML = `Anda berkata: <span style="color:var(--secondary)">"${speechResult}"</span>`;
    processVoiceCommand(speechResult);
  };

  recognition.onerror = (event) => {
    console.error("Speech error", event.error);
    const statusTextEl = document.getElementById('speechStatusText');
    if (statusTextEl) {
      if (event.error === 'not-allowed') {
        statusTextEl.innerHTML = `<span style="color:#EF4444;font-weight:700;"><i class="ti ti-alert-triangle"></i> Izin Mic Ditolak! Aktifkan izin mic di browser.</span>`;
      } else if (event.error === 'no-speech') {
        statusTextEl.innerHTML = `<span style="color:#F59E0B;font-weight:700;"><i class="ti ti-clock"></i> Tidak terdengar suara. Bicaralah setelah mik aktif.</span>`;
      } else if (event.error === 'audio-capture') {
        statusTextEl.innerHTML = `<span style="color:#EF4444;font-weight:700;"><i class="ti ti-microphone-off"></i> Gagal menangkap suara. Cek koneksi mic Anda.</span>`;
      } else {
        statusTextEl.innerHTML = `<span style="color:#EF4444;font-weight:700;"><i class="ti ti-alert-circle"></i> Suara tidak jelas. Klik mic & coba lagi.</span>`;
      }
    }
    const wave = document.getElementById('speechWaveEl');
    if (wave) wave.style.display = 'none';
  };
}

function toggleVoiceAssistant() {
  if (!recognition) {
    initVoiceAssistant();
  }

  if (!recognition) {
    toast("Browser Anda tidak mendukung asisten suara.", '<i class="ti ti-microphone-off"></i>');
    return;
  }

  if (isSpeechActive) {
    recognition.stop();
  } else {
    window.speechSynthesis.cancel();
    
    // Show speech status panel immediately as loading feedback
    const panel = document.getElementById('speechStatusPanel');
    if (panel) {
      panel.classList.add('show');
      document.getElementById('speechStatusText').innerHTML = `<i class="ti ti-loader animate-spin" style="color:var(--secondary)"></i> Asisten sedang berbicara...`;
      document.getElementById('speechWaveEl').style.display = 'none';
    }
    
    // Play greeting immediately to unlock browser speech synthesis
    speakText("Asisten siap, silakan bicara.");
    
    // Start speech recognition after greeting completes (around 1.8 seconds)
    setTimeout(() => {
      const currentPanel = document.getElementById('speechStatusPanel');
      if (currentPanel && currentPanel.classList.contains('show') && !isSpeechActive) {
        try {
          recognition.start();
        } catch (e) {
          console.error("Failed to start speech recognition:", e);
        }
      }
    }, 1800);
  }
}

let idVoiceGlobal = null;

function loadVoices() {
  if (!('speechSynthesis' in window)) return;
  const voices = window.speechSynthesis.getVoices();
  
  const idVoices = voices.filter(v => {
    const lang = v.lang.toLowerCase().replace('_', '-');
    const name = v.name.toLowerCase();
    return lang.startsWith('id') || name.includes('indonesia') || name.includes('indonesian');
  });
  
  if (idVoices.length > 0) {
    idVoices.sort((a, b) => {
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();
      const aNatural = aName.includes('natural') || aName.includes('online') || aName.includes('google');
      const bNatural = bName.includes('natural') || bName.includes('online') || bName.includes('google');
      if (aNatural && !bNatural) return -1;
      if (!aNatural && bNatural) return 1;
      return 0;
    });
    idVoiceGlobal = idVoices[0];
  } else {
    idVoiceGlobal = null;
  }
}

function speakText(text) {
  try {
    const encodedText = encodeURIComponent(text);
    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=id&client=tw-ob&q=${encodedText}`;
    
    if (window._currentTtsAudio) {
      window._currentTtsAudio.pause();
    }
    
    const audio = new Audio(ttsUrl);
    window._currentTtsAudio = audio;
    audio.play().catch(err => {
      console.warn("Google TTS failed to play, falling back to Web Speech API:", err);
      fallbackSpeakText(text);
    });
  } catch (e) {
    console.error("Google TTS error:", e);
    fallbackSpeakText(text);
  }
}

function fallbackSpeakText(text) {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'id-ID';
    
    if (!idVoiceGlobal) {
      loadVoices();
    }
    
    if (idVoiceGlobal) {
      utterance.voice = idVoiceGlobal;
    }
    
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  }
}

function processVoiceCommand(cmd) {
  let normalizedCmd = cmd.toLowerCase().trim();
  
  normalizedCmd = normalizedCmd
    .replace(/block/g, 'blok')
    .replace(/\bsatu\b/g, '1')
    .replace(/\bdua\b/g, '2')
    .replace(/\btiga\b/g, '3')
    .replace(/\bempat\b/g, '4')
    .replace(/\blima\b/g, '5');
    
  normalizedCmd = normalizedCmd.replace(/blok\s+([a-f])\s*([1-5])/gi, 'blok $1$2');
  normalizedCmd = normalizedCmd.replace(/\b([a-f])\s*([1-5])\b/gi, '$1$2');

  document.getElementById('speechStatusText').innerHTML = `Asisten mendengar: <span style="color:var(--secondary)">"${cmd}"</span>`;

  const hasBuka = normalizedCmd.includes('buka') || 
                  normalizedCmd.includes('open') || 
                  normalizedCmd.includes('tampil') || 
                  normalizedCmd.includes('lihat') || 
                  normalizedCmd.includes('ke ');

  if (hasBuka) {
    if (normalizedCmd.includes('beranda') || normalizedCmd.includes('dashboard') || normalizedCmd.includes('utama') || normalizedCmd.includes('depan') || normalizedCmd.includes('kembali')) {
      showPage('daftar');
      speakText("Membuka beranda utama");
      return;
    }
    if (normalizedCmd.includes('data') || normalizedCmd.includes('warga') || normalizedCmd.includes('tagihan') || normalizedCmd.includes('list') || normalizedCmd.includes('daftar rumah') || normalizedCmd.includes('rumah')) {
      showPage('data');
      speakText("Membuka kelola data warga");
      return;
    }
    if (normalizedCmd.includes('jadwal') || normalizedCmd.includes('ronda') || normalizedCmd.includes('piket') || normalizedCmd.includes('kalender')) {
      showPage('jadwal');
      speakText("Membuka jadwal pengambilan");
      return;
    }
    if (normalizedCmd.includes('setoran') || normalizedCmd.includes('masuk') || normalizedCmd.includes('pemasukan') || normalizedCmd.includes('terima')) {
      showPage('setoran');
      speakText("Membuka halaman setoran masuk");
      return;
    }
    if (normalizedCmd.includes('pengeluaran') || normalizedCmd.includes('keluar') || normalizedCmd.includes('belanja') || normalizedCmd.includes('biaya')) {
      showPage('pengeluaran');
      speakText("Membuka halaman uang keluar");
      return;
    }
    if (normalizedCmd.includes('berkala') || normalizedCmd.includes('pantau') || normalizedCmd.includes('kehadiran') || normalizedCmd.includes('bukti')) {
      showPage('berkala');
      speakText("Membuka rincian berkala");
      return;
    }
    if (normalizedCmd.includes('laporan') || normalizedCmd.includes('rekap') || normalizedCmd.includes('grafik') || normalizedCmd.includes('chart')) {
      showPage('laporan');
      speakText("Membuka laporan keuangan");
      return;
    }
    if (normalizedCmd.includes('pengaturan') || normalizedCmd.includes('setting') || normalizedCmd.includes('nominal') || normalizedCmd.includes('iuran')) {
      showPage('pengaturan');
      speakText("Membuka pengaturan sistem");
      return;
    }
    if (normalizedCmd.includes('tentang') || normalizedCmd.includes('about') || normalizedCmd.includes('aplikasi') || normalizedCmd.includes('info')) {
      showPage('tentang');
      speakText("Membuka tentang aplikasi");
      return;
    }
  }

  let foundHouse = null;
  for (const h of houses) {
    if (normalizedCmd.includes(h.p.toLowerCase())) {
      foundHouse = h;
      break;
    }
  }

  if (!foundHouse) {
    const matches = normalizedCmd.match(/(blok\s+[a-f]\s*[1-5]|[a-f]\s*[1-5])/i);
    if (matches) {
      let targetName = matches[0].replace(/\s+/g, '').toUpperCase();
      if (!targetName.startsWith('BLOK')) {
        targetName = 'BLOK' + targetName;
      }
      foundHouse = houses.find(x => x.r.replace(/\s+/g, '').toUpperCase() === targetName);
    }
  }

  if (foundHouse) {
    const statusStr = foundHouse.s ? "sudah lunas membayar iuran jimpitan." : "belum membayar iuran jimpitan.";
    const reply = `Rumah ${foundHouse.r} atas nama pemilik ${foundHouse.p} ${statusStr}`;
    speakText(reply);
    document.getElementById('speechStatusText').innerHTML = `Asisten: <span style="color:#fff">${reply}</span>`;
    
    showPage('data');
    document.getElementById('filterSel').value = 'all';
    document.getElementById('searchInput').value = '';
    renderAll();
    
    setTimeout(() => {
      const cards = document.querySelectorAll('.house-card');
      cards.forEach(card => {
        if (card.querySelector('.card-name')?.textContent === foundHouse.r) {
          card.scrollIntoView({ behavior: 'smooth', block: 'center' });
          card.style.transform = 'scale(1.08)';
          card.style.borderColor = 'var(--secondary)';
          card.style.boxShadow = '0 0 20px var(--secondary)';
          setTimeout(() => {
            card.style.transform = '';
            card.style.borderColor = '';
            card.style.boxShadow = '';
          }, 2500);
        }
      });
    }, 300);
    return;
  }

  if (normalizedCmd.includes('piket') || normalizedCmd.includes('ronda') || normalizedCmd.includes('petugas') || normalizedCmd.includes('keliling')) {
    let targetHari = null;
    const hariList = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
    for (const h of hariList) {
      if (normalizedCmd.includes(h.toLowerCase())) {
        targetHari = h;
        break;
      }
    }
    
    if (normalizedCmd.includes('siapa') || normalizedCmd.includes('hari ini') || normalizedCmd.includes('jadwal') || normalizedCmd.includes('sekarang') || normalizedCmd.includes('malam') || targetHari) {
      const hari = targetHari || getTodayDayName();
      const j = jadwalList.find(x => x.hari.toLowerCase() === hari.toLowerCase());
      if (j) {
        const reply = `Petugas piket keliling hari ${hari} adalah ${j.petugas.join(' dan ')}.`;
        speakText(reply);
        document.getElementById('speechStatusText').innerHTML = `Asisten: <span style="color:#fff">${reply}</span>`;
      } else {
        speakText(`Maaf, tidak menemukan jadwal piket keliling hari ${hari}.`);
      }
      return;
    }
  }

  if (normalizedCmd.includes('saldo') || normalizedCmd.includes('kas') || normalizedCmd.includes('duit') || normalizedCmd.includes('uang') || normalizedCmd.includes('pendapatan')) {
    const totalMasuk = riwayat.length * nominal;
    const totalKeluar = pengeluaranList.reduce((sum, p) => sum + p.nom, 0);
    const saldoBersih = totalMasuk - totalKeluar;
    
    const reply = `Saldo kas bersih jimpitan saat ini adalah ${saldoBersih.toLocaleString('id-ID')} rupiah.`;
    speakText(reply);
    document.getElementById('speechStatusText').innerHTML = `Asisten: <span style="color:#fff">${reply}</span>`;
    return;
  }

  if (normalizedCmd.includes('beranda') || normalizedCmd.includes('dashboard') || normalizedCmd.includes('utama') || normalizedCmd.includes('depan') || normalizedCmd.includes('kembali')) {
    showPage('daftar');
    speakText("Membuka beranda utama");
    return;
  }
  if (normalizedCmd.includes('data') || normalizedCmd.includes('warga') || normalizedCmd.includes('tagihan') || normalizedCmd.includes('list') || normalizedCmd.includes('daftar rumah') || normalizedCmd.includes('rumah')) {
    showPage('data');
    speakText("Membuka kelola data warga");
    return;
  }
  if (normalizedCmd.includes('jadwal') || normalizedCmd.includes('ronda') || normalizedCmd.includes('piket') || normalizedCmd.includes('kalender')) {
    showPage('jadwal');
    speakText("Membuka jadwal pengambilan");
    return;
  }
  if (normalizedCmd.includes('setoran') || normalizedCmd.includes('masuk') || normalizedCmd.includes('pemasukan') || normalizedCmd.includes('terima')) {
    showPage('setoran');
    speakText("Membuka halaman setoran masuk");
    return;
  }
  if (normalizedCmd.includes('pengeluaran') || normalizedCmd.includes('keluar') || normalizedCmd.includes('belanja') || normalizedCmd.includes('biaya')) {
    showPage('pengeluaran');
    speakText("Membuka halaman uang keluar");
    return;
  }
  if (normalizedCmd.includes('laporan') || normalizedCmd.includes('rekap') || normalizedCmd.includes('grafik') || normalizedCmd.includes('chart')) {
    showPage('laporan');
    speakText("Membuka laporan keuangan");
    return;
  }
  if (normalizedCmd.includes('pengaturan') || normalizedCmd.includes('setting') || normalizedCmd.includes('nominal') || normalizedCmd.includes('iuran')) {
    showPage('pengaturan');
    speakText("Membuka pengaturan sistem");
    return;
  }
  if (normalizedCmd.includes('tentang') || normalizedCmd.includes('about') || normalizedCmd.includes('aplikasi') || normalizedCmd.includes('info')) {
    showPage('tentang');
    speakText("Membuka tentang aplikasi");
    return;
  }

  const unrecognizedText = "Maaf, perintah tidak dikenal. Sebutkan kata kunci seperti: saldo, piket ronda hari ini, cek blok a1, nama warga Budi Santoso, atau nama halaman.";
  speakText("Maaf, perintah tidak dikenali.");
  document.getElementById('speechStatusText').textContent = unrecognizedText;
}

// Warm up voices
if ('speechSynthesis' in window) {
  loadVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = () => {
      loadVoices();
    };
  }
}
