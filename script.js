/**
 * KisanSlot - Official Mandi Procurement & Gate Pass System
 * Interactive Logic & Micro-Interactions
 */

// ==========================================================================
// 1. HERO CAROUSEL CONTROLLER
// ==========================================================================
let currentHeroSlide = 0;
const totalSlides = 3;
let heroInterval = null;

function switchHeroSlide(index) {
  for (let i = 0; i < totalSlides; i++) {
    const slide = document.getElementById('hero-slide-' + i);
    const dot = document.getElementById('hero-dot-' + i);
    if (!slide || !dot) continue;

    if (i === index) {
      slide.classList.remove('hidden');
      slide.classList.add('flex');
      dot.classList.remove('w-3', 'bg-surface-container-lowest/40');
      dot.classList.add('w-8', 'bg-surface-container-lowest');
    } else {
      slide.classList.add('hidden');
      slide.classList.remove('flex');
      dot.classList.remove('w-8', 'bg-surface-container-lowest');
      dot.classList.add('w-3', 'bg-surface-container-lowest/40');
    }
  }
  currentHeroSlide = index;
}

function nextHeroSlide() {
  const next = (currentHeroSlide + 1) % totalSlides;
  switchHeroSlide(next);
}

function prevHeroSlide() {
  const prev = (currentHeroSlide - 1 + totalSlides) % totalSlides;
  switchHeroSlide(prev);
}

function startHeroAutoPlay() {
  stopHeroAutoPlay();
  heroInterval = setInterval(() => {
    nextHeroSlide();
  }, 7000);
}

function stopHeroAutoPlay() {
  if (heroInterval) {
    clearInterval(heroInterval);
    heroInterval = null;
  }
}

// ==========================================================================
// 2. QUANTITY & MSP CALCULATOR
// ==========================================================================
const CROP_MSP_RATES = {
  wheat: { name: 'Wheat (Kanak)', rate: 2425, unit: 'Qtl' },
  paddy: { name: 'Paddy (Dhan) Grade A', rate: 2320, unit: 'Qtl' },
  mustard: { name: 'Mustard (Sarson)', rate: 5650, unit: 'Qtl' },
  chana: { name: 'Chana (Gram)', rate: 5440, unit: 'Qtl' },
  maize: { name: 'Maize (Makka)', rate: 2090, unit: 'Qtl' }
};

function getSelectedCropRate() {
  const cropSelect = document.getElementById('crop-type');
  const cropKey = cropSelect ? cropSelect.value : 'wheat';
  return CROP_MSP_RATES[cropKey] || CROP_MSP_RATES['wheat'];
}

function syncRange(val) {
  const range = document.getElementById('quantity-range');
  if (range) range.value = val;
  updateEstimates(Number(val));
}

function syncNumber(val) {
  const num = document.getElementById('quantity-number');
  if (num) num.value = val;
  updateEstimates(Number(val));
}

function updateEstimates(qty) {
  const indicator = document.getElementById('trolley-indicator');
  const crop = getSelectedCropRate();
  const totalAmount = qty * crop.rate;

  if (indicator) {
    const trolleys = (qty / 30).toFixed(1);
    indicator.innerText = `~${trolleys} Tractor Trolley Load${trolleys > 1 ? 's' : ''} (Est. ₹${totalAmount.toLocaleString('en-IN')})`;
  }

  // Update Slot Intelligence metrics
  const estWeigh = document.getElementById('est-weigh-time');
  if (estWeigh) {
    const weighMinutes = Math.max(12, Math.min(30, Math.round(10 + qty * 0.15)));
    estWeigh.innerText = `${weighMinutes} Mins`;
  }

  const assignedBay = document.getElementById('assigned-bay');
  if (assignedBay) {
    if (qty > 100) {
      assignedBay.innerText = 'Bay #01 (Heavy Trailor)';
    } else if (qty > 50) {
      assignedBay.innerText = 'Bay #04 (Heavy Unloader)';
    } else {
      assignedBay.innerText = 'Bay #02 (Standard Bay)';
    }
  }
}

// ==========================================================================
// 3. DATE & TIME SELECTION
// ==========================================================================
function selectDateTab(button, dateStr) {
  const container = button.parentElement;
  if (!container) return;
  const buttons = container.querySelectorAll('button');
  buttons.forEach(btn => {
    btn.className = 'p-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface flex flex-col items-center justify-center text-center transition-colors';
  });
  button.className = 'p-2.5 rounded-lg bg-secondary text-on-secondary flex flex-col items-center justify-center text-center shadow-sm';
  button.dataset.selected = 'true';
}

// ==========================================================================
// 4. BOOKING SIMULATION & DIGITAL E-PASS MODAL
// ==========================================================================
let lastGeneratedPass = null;
let currentTokenCounter = 413;

function simulateBooking() {
  const cropSelect = document.getElementById('crop-type');
  const cropName = cropSelect ? cropSelect.options[cropSelect.selectedIndex].text : 'Wheat (Kanak)';
  const centerSelect = document.getElementById('proc-center');
  const centerName = centerSelect ? centerSelect.options[centerSelect.selectedIndex].text : 'PACS Khanna Central Yard 02';
  const qty = document.getElementById('quantity-number') ? document.getElementById('quantity-number').value : '45';
  const vehicle = document.getElementById('reg-number') ? document.getElementById('reg-number').value : 'PB-10-AZ-3341';
  const farmerId = document.getElementById('farmer-aadhaar') ? document.getElementById('farmer-aadhaar').value : 'PB-88219';

  currentTokenCounter++;
  const token = `TK-${currentTokenCounter}`;

  lastGeneratedPass = {
    token,
    farmerName: 'Rameshwar Singh',
    farmerId: farmerId.replace(' (Verified)', ''),
    cropName,
    qty: `${qty} Quintals`,
    vehicle,
    center: centerName,
    gate: 'Gate No. 02',
    slotTime: 'Today, 08:00 - 11:00 AM',
    bay: qty > 50 ? 'Bay #04' : 'Bay #02',
    date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
  };

  // Populate ePass Modal
  document.getElementById('modal-token-id').innerText = lastGeneratedPass.token;
  document.getElementById('modal-farmer-name').innerText = lastGeneratedPass.farmerName;
  document.getElementById('modal-farmer-id').innerText = lastGeneratedPass.farmerId;
  document.getElementById('modal-vehicle').innerText = lastGeneratedPass.vehicle;
  document.getElementById('modal-crop').innerText = lastGeneratedPass.cropName;
  document.getElementById('modal-qty').innerText = lastGeneratedPass.qty;
  document.getElementById('modal-center').innerText = lastGeneratedPass.center;
  document.getElementById('modal-slot').innerText = lastGeneratedPass.slotTime;
  document.getElementById('modal-bay').innerText = lastGeneratedPass.bay;
  document.getElementById('modal-date').innerText = lastGeneratedPass.date;

  // Add new token row to live queue departure board
  addTokenToLiveQueue(lastGeneratedPass);

  // Open modal
  openModal('epass-modal');

  // Trigger Toast
  showToast(`✅ Gate Pass ${token} Generated! Entry reserved at ${lastGeneratedPass.center}`);
}

function addTokenToLiveQueue(pass) {
  const tbody = document.getElementById('live-queue-tbody');
  if (!tbody) return;

  const tr = document.createElement('tr');
  tr.className = 'hover:bg-white/5 transition-colors bg-secondary/10';
  tr.innerHTML = `
    <td class="py-4 px-4 font-mono font-bold text-[#ffcc00] text-title-md">${pass.token}</td>
    <td class="py-4 px-4 text-surface-container-lowest font-medium">${pass.slotTime.split(',')[1] || 'Upcoming'}</td>
    <td class="py-4 px-4 text-surface-container-lowest">${pass.vehicle}</td>
    <td class="py-4 px-4 text-surface-container-lowest/80">${pass.cropName.split('-')[0]} (${pass.qty})</td>
    <td class="py-4 px-4 text-secondary-fixed-dim font-bold">~40 mins</td>
    <td class="py-4 px-4 text-right">
      <span class="inline-flex items-center px-2.5 py-1 rounded bg-secondary-container text-on-secondary-container font-label-md text-label-md font-semibold">
        SLOT CONFIRMED
      </span>
    </td>
  `;
  tbody.insertBefore(tr, tbody.firstChild);
}

// ==========================================================================
// 5. MODAL MANAGEMENT
// ==========================================================================
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Close modal on escape key or clicking backdrop
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal('epass-modal');
    closeModal('jform-modal');
  }
});

// ==========================================================================
// 6. TOAST NOTIFICATION
// ==========================================================================
function showToast(message) {
  let toast = document.getElementById('global-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'global-toast';
    toast.className = 'fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-xl bg-inverse-surface text-inverse-on-surface shadow-2xl flex items-center gap-3 font-body-md transition-all duration-300 transform translate-y-20 opacity-0 pointer-events-none';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span class="material-symbols-outlined text-secondary-fixed text-[22px]">check_circle</span><span>${message}</span>`;
  toast.classList.remove('translate-y-20', 'opacity-0', 'pointer-events-none');
  setTimeout(() => {
    toast.classList.add('translate-y-20', 'opacity-0', 'pointer-events-none');
  }, 4500);
}

// ==========================================================================
// 7. GIGW ACCESSIBILITY HELPERS
// ==========================================================================
let currentFontSizeLevel = 0; // -1, 0, 1
function adjustFontSize(delta) {
  if (delta === 0) currentFontSizeLevel = 0;
  else currentFontSizeLevel = Math.max(-1, Math.min(2, currentFontSizeLevel + delta));

  const root = document.documentElement;
  if (currentFontSizeLevel === -1) {
    root.style.fontSize = '14px';
  } else if (currentFontSizeLevel === 0) {
    root.style.fontSize = '16px';
  } else if (currentFontSizeLevel === 1) {
    root.style.fontSize = '18px';
  } else if (currentFontSizeLevel === 2) {
    root.style.fontSize = '20px';
  }
  showToast(`Text Size: ${currentFontSizeLevel === 0 ? 'Standard (100%)' : (currentFontSizeLevel > 0 ? '+1' + (currentFontSizeLevel * 10) + '%' : '-10%')}`);
}

function announceScreenReader() {
  const speech = "Welcome to KisanSlot National Agricultural Procurement Portal. Use Tab to navigate through slot booking, live departure queue, and DBT receipts.";
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(speech);
    utterance.lang = 'en-IN';
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  }
  showToast("🎙️ Screen Reader Audio Guidance Triggered");
}

// ==========================================================================
// 8. MULTILINGUAL TRANSLATION HANDLER
// ==========================================================================
const TRANSLATIONS = {
  en: {
    heroTitle: 'Guaranteed MSP Procurement Without The Mandi Chaos',
    heroSub: 'Book your verified arrival time slot at your local PACS or APMC Mandi, bypass 14-hour tractor queues, and receive direct DBT payment into your bank account within 48 hours.',
    bookSlotBtn: 'Book Mandi Slot Now',
    checkQueueBtn: 'Check Live Token Status',
    bookingSectionTitle: 'Reserve Your Mandi Unloading Gate Pass',
    stepTitle: 'From Field Gate to Bank Account in 48 Hours'
  },
  hi: {
    heroTitle: 'मंडी की लंबी कतारों के बिना एमएसपी पर सुगम खरीद',
    heroSub: 'अपनी स्थानीय पैक्स या एपीएमसी मंडी में समय स्लॉट बुक करें, 14 घंटे के ट्रैक्टर जाम से बचें, और 48 घंटे के भीतर सीधे बैंक खाते में डीबीटी भुगतान प्राप्त करें।',
    bookSlotBtn: 'मंडी स्लॉट अभी बुक करें',
    checkQueueBtn: 'लाइव टोकन स्थिति जांचें',
    bookingSectionTitle: 'मंडी अनलोडिंग ई-गेट पास आरक्षित करें',
    stepTitle: 'खेत के गेट से बैंक खाते तक 48 घंटे में भुगतान'
  },
  pa: {
    heroTitle: 'ਮੰਡੀ ਦੀ ਖੱਜਲ-ਖੁਆਰੀ ਤੋਂ ਬਿਨਾਂ ਗਾਰੰਟੀਸ਼ੁਦਾ ਐਮ.ਐਸ.ਪੀ ਖਰੀਦ',
    heroSub: 'ਆਪਣੀ ਨੇੜਲੀ ਪੈਕਸ ਜਾਂ ਏ.ਪੀ.ਐਮ.ਸੀ ਮੰਡੀ ਵਿੱਚ ਸਮਾਂ ਸਲਾਟ ਬੁੱਕ ਕਰੋ, 14 ਘੰਟੇ ਲੰਬੀਆਂ ਟਰੈਕਟਰ ਕਤਾਰਾਂ ਤੋਂ ਬਚੋ ਅਤੇ 48 ਘੰਟਿਆਂ ਵਿੱਚ ਸਿੱਧਾ ਡੀ.ਬੀ.ਟੀ ਭੁਗਤਾਨ ਪ੍ਰਾਪਤ ਕਰੋ।',
    bookSlotBtn: 'ਹੁਣੇ ਮੰਡੀ ਸਲਾਟ ਬੁੱਕ ਕਰੋ',
    checkQueueBtn: 'ਲਾਈਵ ਟੋਕਨ ਸਥਿਤੀ ਦੇਖੋ',
    bookingSectionTitle: 'ਆਪਣਾ ਮੰਡੀ ਈ-ਗੇਟ ਪਾਸ ਰਿਜ਼ਰਵ ਕਰੋ',
    stepTitle: 'ਖੇਤ ਦੇ ਗੇਟ ਤੋਂ ਬੈਂਕ ਖਾਤੇ ਤੱਕ 48 ਘੰਟਿਆਂ ਵਿੱਚ'
  }
};

function changeLanguage(lang) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS['en'];
  const heroH1 = document.querySelector('#hero-slide-0 h1');
  const heroP = document.querySelector('#hero-slide-0 p');
  const bookBtn = document.querySelector('#hero-slide-0 a:first-of-type span:first-child');
  const queueBtn = document.querySelector('#hero-slide-0 a:last-of-type span:last-child');
  const bookHeader = document.querySelector('#booking-form-section h2');
  const stepHeader = document.querySelector('#stepper-section h2');

  if (heroH1) heroH1.innerText = t.heroTitle;
  if (heroP) heroP.innerText = t.heroSub;
  if (bookBtn) bookBtn.innerText = t.bookSlotBtn;
  if (queueBtn) queueBtn.innerText = t.checkQueueBtn;
  if (bookHeader) bookHeader.innerText = t.bookingSectionTitle;
  if (stepHeader) stepHeader.innerText = t.stepTitle;

  showToast(`Language set to ${lang.toUpperCase()}`);
}

// ==========================================================================
// 9. CLOCK & TELEMETRY SYNC
// ==========================================================================
function updateClock() {
  const clockEl = document.getElementById('sync-clock');
  if (clockEl) {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    clockEl.innerText = `Grid Sync: ${hours}:${minutes}:${seconds} IST`;
  }
}

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  startHeroAutoPlay();

  const heroWrapper = document.getElementById('hero-slides-wrapper');
  if (heroWrapper) {
    heroWrapper.addEventListener('mouseenter', stopHeroAutoPlay);
    heroWrapper.addEventListener('mouseleave', startHeroAutoPlay);
  }

  // Initial estimate calculation
  updateEstimates(45);

  // Update clock every second
  updateClock();
  setInterval(updateClock, 1000);

  // Bind crop select change to price updater
  const cropSelect = document.getElementById('crop-type');
  if (cropSelect) {
    cropSelect.addEventListener('change', () => {
      const num = document.getElementById('quantity-number');
      if (num) updateEstimates(Number(num.value));
    });
  }
});
