'use strict';

/* ===== CONFIG ===== */
let CONFIG = {
  whatsappNumber: '919999999999',
  upiId: 'YOUR-UPI-ID@upi',
  qrImageSrc: '',
  price: '2,999',
  classDates: '',
  totalSeats: 30,
  seatsTaken: 23,
  countdownHours: 47,
};
try { const s = localStorage.getItem('wp_class_config'); if (s) CONFIG = {...CONFIG, ...JSON.parse(s)}; } catch(e){}

let registrations = [];
try { const s = localStorage.getItem('wp_class_registrations'); if (s) registrations = JSON.parse(s); } catch(e){}

function saveReg() { localStorage.setItem('wp_class_registrations', JSON.stringify(registrations)); }
function saveCfg() { localStorage.setItem('wp_class_config', JSON.stringify(CONFIG)); }

/* ===== TYPEWRITER HERO ===== */
const phrases = [
  'Build It Yourself in 10 Days!',
  'Own Your Website Forever.',
  'Learn WordPress LIVE.',
  'Start Today for ₹2,999 Only.',
];
let pIdx = 0, cIdx = 0, deleting = false;
const tw = document.getElementById('typewriterText');
function typeLoop() {
  if (!tw) return;
  const phrase = phrases[pIdx];
  if (!deleting) {
    tw.textContent = phrase.slice(0, ++cIdx);
    if (cIdx === phrase.length) { deleting = true; setTimeout(typeLoop, 2000); return; }
  } else {
    tw.textContent = phrase.slice(0, --cIdx);
    if (cIdx === 0) { deleting = false; pIdx = (pIdx + 1) % phrases.length; }
  }
  setTimeout(typeLoop, deleting ? 45 : 80);
}
typeLoop();

/* ===== PARTICLES ===== */
function spawnParticles(containerId, count) {
  const c = document.getElementById(containerId);
  if (!c) return;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 5 + 2;
    p.style.cssText = `
      width:${size}px;height:${size}px;
      left:${Math.random()*100}%;
      animation-duration:${Math.random()*12+8}s;
      animation-delay:${Math.random()*8}s;
      opacity:${Math.random()*.4+.1};
      background:hsl(${Math.random()*60+220},80%,70%);
    `;
    c.appendChild(p);
  }
}
spawnParticles('heroParticles', 22);
spawnParticles('finalParticles', 16);

/* ===== COUNTER ANIMATION ===== */
function animateCounter(el) {
  const target = +el.dataset.target;
  const duration = 1800;
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = Math.floor(current).toLocaleString('en-IN');
    if (current >= target) clearInterval(timer);
  }, 16);
}

/* ===== SCROLL REVEAL + COUNTERS ===== */
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      // Animate numbers
      e.target.querySelectorAll('.social-num').forEach(n => {
        if (!n.dataset.animated) { n.dataset.animated = 1; animateCounter(n); }
      });
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal,.reveal-stagger').forEach(el => io.observe(el));

// Also run counter on social-strip if already visible
setTimeout(() => {
  document.querySelectorAll('.social-num').forEach(n => {
    if (!n.dataset.animated && n.getBoundingClientRect().top < window.innerHeight) {
      n.dataset.animated = 1; animateCounter(n);
    }
  });
}, 600);

/* ===== PROGRESS BAR ANIMATE ===== */
const pFill = document.getElementById('progressFill');
const taken = CONFIG.seatsTaken;
const total = CONFIG.totalSeats;
const pct = Math.min((taken / total) * 100, 100);
if (pFill) setTimeout(() => { pFill.style.width = pct + '%'; }, 400);
document.querySelectorAll('#seatsTaken').forEach(el => el.textContent = taken);

/* ===== SEATS DISPLAY ===== */
const seats = total - taken;
function updateSeats() {
  const els = ['seatsLeft','navSeats','seatsRemaining','finalSeats'];
  els.forEach(id => { const el = document.getElementById(id); if(el) el.textContent = seats; });
}
updateSeats();

/* ===== COUNTDOWN TIMER ===== */
function initCountdown() {
  const key = 'wp_class_deadline';
  let deadline = localStorage.getItem(key);
  if (!deadline) {
    deadline = Date.now() + CONFIG.countdownHours * 3600000;
    localStorage.setItem(key, deadline);
  }
  function tick() {
    const diff = +deadline - Date.now();
    if (diff <= 0) {
      ['hours','minutes','seconds'].forEach(id => {
        const el = document.getElementById(id); if(el) el.textContent = '00';
      });
      const td = document.getElementById('timerDisplay');
      if (td) td.textContent = 'EXPIRED';
      return;
    }
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    const fmt = n => String(n).padStart(2, '0');
    const hEl = document.getElementById('hours');
    const mEl = document.getElementById('minutes');
    const sEl = document.getElementById('seconds');
    const tdEl = document.getElementById('timerDisplay');
    if (hEl) hEl.textContent = fmt(h);
    if (mEl) mEl.textContent = fmt(m);
    if (sEl) sEl.textContent = fmt(s);
    if (tdEl) tdEl.textContent = `${fmt(h)}:${fmt(m)}:${fmt(s)}`;
    setTimeout(tick, 1000);
  }
  tick();
}
initCountdown();

/* ===== APPLY CONFIG ===== */
function applyConfig() {
  const upiEl = document.getElementById('displayUpiId');
  if (upiEl) upiEl.textContent = CONFIG.upiId;
  const qrImg = document.getElementById('qrImage');
  const qrFallback = document.getElementById('qrFallback');
  if (CONFIG.qrImageSrc && qrImg) {
    qrImg.src = CONFIG.qrImageSrc;
    qrImg.style.display = 'block';
    if (qrFallback) qrFallback.style.display = 'none';
  }
  document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
    const href = link.getAttribute('href');
    const msg = href.includes('?text=') ? href.slice(href.indexOf('?text=')) : '';
    link.href = `https://wa.me/${CONFIG.whatsappNumber}${msg}`;
  });
}
applyConfig();

/* ===== NAVBAR SCROLL ===== */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
}, {passive: true});

/* ===== ANNOUNCE BAR CLOSE ===== */
const announceClose = document.getElementById('announceClose');
const announceBar = document.getElementById('announceBar');
if (announceClose && announceBar) {
  announceClose.addEventListener('click', () => {
    announceBar.style.display = 'none';
  });
}

/* ===== FAQ ACCORDION ===== */
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    document.querySelectorAll('.faq-q').forEach(b => {
      b.setAttribute('aria-expanded', 'false');
      const a = document.getElementById(b.getAttribute('aria-controls'));
      if (a) a.classList.remove('open');
    });
    if (!expanded) {
      btn.setAttribute('aria-expanded', 'true');
      const ans = document.getElementById(btn.getAttribute('aria-controls'));
      if (ans) ans.classList.add('open');
    }
  });
});

/* ===== FILE UPLOAD ===== */
const fileInput = document.getElementById('screenshot');
const fileLabel = document.getElementById('fileLabel');
const fileArea = document.getElementById('fileUploadArea');
if (fileInput) {
  fileInput.addEventListener('change', () => {
    if (fileInput.files && fileInput.files[0]) {
      fileLabel.textContent = '✅ ' + fileInput.files[0].name;
      if (fileArea) fileArea.style.borderColor = '#22c55e';
    }
  });
}

/* ===== FORM VALIDATION ===== */
function showErr(id, msg) { const el = document.getElementById(id+'Error'); if(el) el.textContent = msg; }
function clearErr(id) { const el = document.getElementById(id+'Error'); if(el) el.textContent = ''; }
function validate() {
  let ok = true;
  const n = document.getElementById('fullName');
  const w = document.getElementById('whatsapp');
  const e = document.getElementById('email');
  const t = document.getElementById('txnId');
  const s = document.getElementById('screenshot');
  if (!n?.value.trim()) { showErr('fullName','Please enter your full name.'); ok=false; } else clearErr('fullName');
  if (!w?.value.trim() || !/^\d{10}$/.test(w.value.trim())) { showErr('whatsapp','Enter valid 10-digit number.'); ok=false; } else clearErr('whatsapp');
  if (!e?.value.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e.value.trim())) { showErr('email','Enter a valid email.'); ok=false; } else clearErr('email');
  if (!t?.value.trim()) { showErr('txnId','Please enter your transaction ID.'); ok=false; } else clearErr('txnId');
  if (!s?.files?.length) { showErr('screenshot','Please upload payment screenshot.'); ok=false; } else clearErr('screenshot');
  return ok;
}

/* ===== FORM SUBMIT ===== */
const registerForm = document.getElementById('registerForm');
const successMsg = document.getElementById('successMsg');
if (registerForm) {
  registerForm.addEventListener('submit', e => {
    e.preventDefault();
    if (!validate()) return;
    const reg = {
      id: Date.now(),
      name: document.getElementById('fullName').value.trim(),
      wa: document.getElementById('whatsapp').value.trim(),
      email: document.getElementById('email').value.trim(),
      txn: document.getElementById('txnId').value.trim(),
      timestamp: new Date().toLocaleString('en-IN'),
      status: 'Pending',
    };
    registrations.push(reg);
    saveReg();
    registerForm.style.display = 'none';
    if (successMsg) {
      successMsg.style.display = 'block';
      successMsg.scrollIntoView({behavior:'smooth', block:'center'});
    }
  });
}

/* ===== INLINE VALIDATION ===== */
['fullName','whatsapp','email','txnId'].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('blur', () => {
    if (!el.value.trim()) { showErr(id,'Required field.'); return; }
    clearErr(id);
    if (id === 'whatsapp' && !/^\d{10}$/.test(el.value.trim())) showErr(id,'Enter 10-digit number.');
    if (id === 'email' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(el.value.trim())) showErr(id,'Enter valid email.');
  });
});

/* ===== MAGNETIC BUTTON EFFECT ===== */
document.querySelectorAll('.magnetic').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width/2);
    const dy = e.clientY - (r.top + r.height/2);
    btn.style.transform = `translate(${dx*.15}px,${dy*.15}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

/* ===== ADMIN PANEL — HIDDEN (commented out for public site) ===== */
/*
const adminPanelHTML = `
<div class="admin-panel" id="adminPanel">
  <div class="admin-box" role="dialog" aria-modal="true" aria-label="Admin Panel">
    <button class="admin-close" id="adminClose">✕</button>
    <h2>⚙️ Admin Panel</h2>
    <div class="admin-tabs">
      <button class="admin-tab active" data-tab="settings">⚙️ Settings</button>
      <button class="admin-tab" data-tab="registrations">📋 Registrations</button>
    </div>
    <div class="admin-section active" id="tab-settings">
      <div class="admin-form-group"><label>WhatsApp Number (no +, with country code)</label><input type="text" id="adminWa" placeholder="919999999999"/></div>
      <div class="admin-form-group"><label>UPI ID</label><input type="text" id="adminUpi" placeholder="yourname@upi"/></div>
      <div class="admin-form-group"><label>QR Code Image URL</label><input type="text" id="adminQr" placeholder="https://..."/></div>
      <div class="admin-form-group"><label>— OR — Upload QR from Device</label><input type="file" id="adminQrUpload" accept="image/*" style="border:1px solid #e2e8f0;padding:6px 10px;border-radius:8px;"/></div>
      <div class="admin-form-group"><label>Total Seats</label><input type="number" id="adminTotal" placeholder="30"/></div>
      <div class="admin-form-group"><label>Seats Already Taken</label><input type="number" id="adminTaken" placeholder="23"/></div>
      <div class="admin-form-group"><label>Countdown Duration (hours from now)</label><input type="number" id="adminHours" placeholder="47"/></div>
      <div class="admin-form-group"><label>Class Dates (display)</label><input type="text" id="adminDates" placeholder="Oct 10–20, 2026"/></div>
      <button class="admin-save-btn" id="adminSave">💾 Save All Settings</button>
      <span class="admin-saved" id="adminSavedMsg">✓ Saved!</span>
    </div>
    <div class="admin-section" id="tab-registrations">
      <div id="regTableWrapper"></div>
    </div>
  </div>
</div>`;
document.body.insertAdjacentHTML('beforeend', adminPanelHTML);

const triggerBtn = document.createElement('button');
triggerBtn.className = 'admin-trigger-btn';
triggerBtn.textContent = '⚙️ Admin';
triggerBtn.id = 'adminTriggerBtn';
document.body.appendChild(triggerBtn);

function openAdmin() {
  document.getElementById('adminPanel').classList.add('open');
  document.getElementById('adminWa').value = CONFIG.whatsappNumber;
  document.getElementById('adminUpi').value = CONFIG.upiId;
  document.getElementById('adminQr').value = CONFIG.qrImageSrc;
  document.getElementById('adminTotal').value = CONFIG.totalSeats;
  document.getElementById('adminTaken').value = CONFIG.seatsTaken;
  document.getElementById('adminHours').value = CONFIG.countdownHours;
  document.getElementById('adminDates').value = CONFIG.classDates;
  renderRegTable();
}
function closeAdmin() { document.getElementById('adminPanel').classList.remove('open'); }
triggerBtn.addEventListener('click', openAdmin);
document.getElementById('adminClose').addEventListener('click', closeAdmin);
document.getElementById('adminPanel').addEventListener('click', e => { if (e.target === document.getElementById('adminPanel')) closeAdmin(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAdmin(); });

document.querySelectorAll('.admin-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('tab-'+tab.dataset.tab).classList.add('active');
    if (tab.dataset.tab === 'registrations') renderRegTable();
  });
});

document.getElementById('adminQrUpload').addEventListener('change', function() {
  const file = this.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => { document.getElementById('adminQr').value = e.target.result; };
  reader.readAsDataURL(file);
});

document.getElementById('adminSave').addEventListener('click', () => {
  CONFIG.whatsappNumber = document.getElementById('adminWa').value.trim() || CONFIG.whatsappNumber;
  CONFIG.upiId = document.getElementById('adminUpi').value.trim() || CONFIG.upiId;
  CONFIG.qrImageSrc = document.getElementById('adminQr').value.trim();
  CONFIG.totalSeats = +document.getElementById('adminTotal').value || CONFIG.totalSeats;
  CONFIG.seatsTaken = +document.getElementById('adminTaken').value || CONFIG.seatsTaken;
  CONFIG.countdownHours = +document.getElementById('adminHours').value || CONFIG.countdownHours;
  CONFIG.classDates = document.getElementById('adminDates').value.trim();
  localStorage.removeItem('wp_class_deadline');
  saveCfg();
  applyConfig();
  const savedMsg = document.getElementById('adminSavedMsg');
  savedMsg.style.opacity = '1';
  setTimeout(() => { savedMsg.style.opacity = '0'; }, 2200);
  const newSeats = CONFIG.totalSeats - CONFIG.seatsTaken;
  ['seatsLeft','navSeats','seatsRemaining','finalSeats'].forEach(id => {
    const el = document.getElementById(id); if(el) el.textContent = newSeats;
  });
  const pctNew = Math.min((CONFIG.seatsTaken / CONFIG.totalSeats)*100, 100);
  if (pFill) pFill.style.width = pctNew + '%';
  ['seatsTaken'].forEach(id => { const el = document.getElementById(id); if(el) el.textContent = CONFIG.seatsTaken; });
});
*/

function esc(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function renderRegTable() { /* admin hidden */ }
