/* ========================================================================= */
/* WHAT WE DO — CLEAN SELECTOR + STAT STAGE CARD, VISUALS & LEARN-MORE MODAL */
/* ========================================================================= */
(function initWhatWeDoStageAndModal() {
  const $ = (id) => document.getElementById(id);
  const slide = $('about-slide-what-we-do');
  if (!slide) return;

  const AUTO_ADVANCE_MS = 7000;
  const COUNTER_MS = 800;
  const INTRO_MS = 1000;
  const MAX_DPR = 2;
  const BLUE = '#1a6fd1';
  const BAND = '#edf2f9';
  const LABEL = '#4a5a72';
  const DOT = '#d39a52';
  const TRACK = '#dbe4f0';

  const tabs = Array.from(slide.querySelectorAll('.wwd-selector-tab'));
  const tablist = $('wwd-tablist');
  const panel = $('wwd-stage-panel');
  const card = $('wwd-stage-card');
  const statNum = $('wwd-stage-stat-num');
  const statMeta = $('wwd-stage-stat-meta');
  const desc = $('wwd-stage-desc');
  const modalBtn = $('wwd-stage-modal-btn');
  const pauseBtn = $('wwd-pause-btn');
  const root = $('wwd-interactive-root');
  const wrap = $('wwd-stage-visual-wrap');
  const canvas = $('wwd-stage-canvas');
  const ctx = canvas ? canvas.getContext('2d') : null;

  const rmq = typeof window.matchMedia === 'function' ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  const reduced = () => Boolean(rmq.matches);

  let active = 0;
  let slideOn = false;
  let hoverPause = false;
  let userPause = false;
  let modalOpen = false;
  let elapsed = 0;
  let lastT = performance.now();
  let switchT = performance.now();
  let raf = 0;
  let counterRaf = 0;
  let entryPlayed = false;
  let cw = 600, ch = 220, dpr = 1;

  // ─── Stat counter ──────────────────────────────────────────────────────────
  function countUp(tab) {
    if (!statNum || !tab) return;
    if (counterRaf) cancelAnimationFrame(counterRaf);
    const d = tab.dataset;
    const a = parseInt(d.statP1 || '0', 10);
    const hasB = Boolean(d.statP2);
    const b = hasB ? parseInt(d.statP2, 10) : 0;
    const fmt = (x, y) => (hasB ? `${x}${d.statSep}${y}` : `${x}`) + (d.statSuffix || '');
    if (reduced()) { statNum.textContent = fmt(a, b); return; }
    const t0 = performance.now();
    const step = (now) => {
      const p = Math.min(1, (now - t0) / COUNTER_MS);
      const e = 1 - Math.pow(1 - p, 3);
      statNum.textContent = fmt(Math.round(a * e), Math.round(b * e));
      counterRaf = p < 1 ? requestAnimationFrame(step) : 0;
    };
    counterRaf = requestAnimationFrame(step);
  }

  // ─── Selection ─────────────────────────────────────────────────────────────
  function select(idx, focus) {
    if (!tabs.length) return;
    active = (idx + tabs.length) % tabs.length;
    elapsed = 0;
    switchT = performance.now();
    tabs.forEach((t, i) => {
      const on = i === active;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.setAttribute('tabindex', on ? '0' : '-1');
    });
    const tab = tabs[active];
    const d = tab.dataset;
    if (focus) tab.focus();
    if (panel) panel.setAttribute('aria-labelledby', tab.id);
    if (statMeta) statMeta.textContent = d.statMeta || '';
    if (desc) desc.textContent = d.shortDesc || '';
    if (modalBtn) {
      ['n', 'cat', 'title', 'img', 'sl', 'sv', 'desc', 'pts'].forEach((k) => { modalBtn.dataset[k] = d[k] || ''; });
    }
    if (card && !reduced()) {
      card.classList.remove('wwd-stage-swap');
      void card.offsetWidth;
      card.classList.add('wwd-stage-swap');
    }
    countUp(tab);
    start();
  }

  // ─── GSAP entry ────────────────────────────────────────────────────────────
  function entry() {
    if (reduced() || typeof window.gsap === 'undefined') return;
    const g = window.gsap;
    g.timeline({ defaults: { ease: 'power3.out' } })
      .fromTo([$('wwd-headline'), $('wwd-subtext')], { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, stagger: 0.07, clearProps: 'transform,opacity' })
      .fromTo(tabs, { x: -12, opacity: 0 }, { x: 0, opacity: 1, duration: 0.35, stagger: 0.04, clearProps: 'transform,opacity' }, '-=0.25')
      .fromTo(card, { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, clearProps: 'transform,opacity' }, '-=0.3');
  }

  // ─── Canvas helpers ────────────────────────────────────────────────────────
  function resize() {
    if (!wrap || !canvas) return;
    dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    cw = Math.max(240, wrap.clientWidth);
    ch = Math.max(140, wrap.clientHeight);
    canvas.width = Math.round(cw * dpr);
    canvas.height = Math.round(ch * dpr);
  }

  function roundRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function label(text, x, y, align) {
    ctx.font = '500 12px Manrope, ui-sans-serif, system-ui, sans-serif';
    ctx.fillStyle = LABEL;
    ctx.textAlign = align || 'left';
    ctx.fillText(text, x, y);
  }

  function endDot(x, y) {
    ctx.fillStyle = DOT;
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
  }

  // 1. Cold chain: wave inside 2–8 °C band
  function drawColdChain(t, intro) {
    const bw = Math.min(cw * 0.86, 420);
    const bh = Math.min(ch * 0.42, 80);
    const bx = (cw - bw) / 2;
    const by = (ch - bh) / 2 + 6;
    label('2–8 °C safe range', bx + 8, by - 10);
    ctx.fillStyle = BAND;
    roundRect(bx, by, bw, bh, 8);
    ctx.fill();
    const n = 90;
    const shown = Math.max(2, Math.round(n * intro));
    const phase = reduced() ? 0 : t * 0.9;
    ctx.beginPath();
    let lx = bx, ly = by + bh / 2;
    for (let i = 0; i < shown; i++) {
      const u = i / (n - 1);
      const x = bx + u * bw;
      const y = by + bh / 2 + Math.sin(u * Math.PI * 4.2 - phase) * bh * 0.2 + Math.sin(u * Math.PI * 1.6 + phase * 0.6) * bh * 0.06;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      lx = x; ly = y;
    }
    ctx.strokeStyle = BLUE;
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.stroke();
    endDot(lx, ly);
  }

  // 2. Commercial: 25 bars rising
  function drawBars(t, intro) {
    const n = 25;
    const gw = Math.min(cw * 0.86, 440);
    const gh = Math.min(ch * 0.55, 110);
    const gx = (cw - gw) / 2;
    const gy = (ch - gh) / 2 + 10;
    label('One bar per symposium this year', gx, gy - 12);
    ctx.fillStyle = BAND;
    roundRect(gx - 8, gy - 2, gw + 16, gh + 10, 8);
    ctx.fill();
    const slot = gw / n;
    const bw = slot * 0.55;
    for (let i = 0; i < n; i++) {
      const u = i / (n - 1);
      const local = Math.max(0, Math.min(1, intro * 1.6 - u * 0.6));
      const e = 1 - Math.pow(1 - local, 3);
      const base = 0.35 + 0.5 * ((Math.sin(i * 1.7) + 1) / 2) + u * 0.12;
      const h = gh * Math.min(1, base) * e;
      ctx.fillStyle = i === n - 1 ? DOT : BLUE;
      roundRect(gx + i * slot + (slot - bw) / 2, gy + gh - h + 4, bw, Math.max(2, h), 2);
      ctx.fill();
    }
  }

  // 3. Field network: simplified archipelago with 17 nodes
  const REGIONS = [
    [0.47, 0.10], [0.42, 0.17], [0.51, 0.17], [0.45, 0.24], [0.47, 0.30], [0.51, 0.34], [0.57, 0.39],
    [0.36, 0.52], [0.50, 0.53], [0.55, 0.55], [0.60, 0.53], [0.65, 0.48],
    [0.49, 0.76], [0.58, 0.70], [0.67, 0.68], [0.66, 0.79], [0.59, 0.84]
  ];
  const HUBS = [4, 10, 15];
  function drawArchipelago(t, intro) {
    const mh = ch * 0.92;
    const mw = mh * 0.9;
    const ox = (cw - mw) / 2;
    const oy = (ch - mh) / 2;
    const P = (p) => ({ x: ox + p[0] * mw, y: oy + p[1] * mh });
    ctx.strokeStyle = TRACK;
    ctx.lineWidth = 1;
    REGIONS.forEach((r, i) => {
      const hub = i < 7 ? HUBS[0] : i < 12 ? HUBS[1] : HUBS[2];
      if (hub === i) return;
      const a = P(REGIONS[hub]); const b = P(r);
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
    });
    ctx.strokeStyle = 'rgba(26,111,209,0.35)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    const h0 = P(REGIONS[HUBS[0]]), h1 = P(REGIONS[HUBS[1]]), h2 = P(REGIONS[HUBS[2]]);
    ctx.moveTo(h0.x, h0.y); ctx.lineTo(h1.x, h1.y); ctx.lineTo(h2.x, h2.y);
    ctx.stroke();
    const visible = Math.ceil(REGIONS.length * intro);
    REGIONS.forEach((r, i) => {
      if (i >= visible) return;
      const p = P(r);
      const isHub = HUBS.includes(i);
      if (!reduced()) {
        const ring = (t * 0.6 + i * 0.13) % 1;
        ctx.strokeStyle = `rgba(26,111,209,${(1 - ring) * 0.35})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, 4 + ring * 10, 0, Math.PI * 2); ctx.stroke();
      }
      ctx.fillStyle = isHub ? DOT : BLUE;
      ctx.beginPath(); ctx.arc(p.x, p.y, isHub ? 5 : 3.5, 0, Math.PI * 2); ctx.fill();
    });
    label('Manila', h0.x + 10, h0.y + 4);
    label('Cebu', h1.x + 10, h1.y + 4);
    label('Davao', h2.x + 10, h2.y + 4);
  }

  // 4. Governance: ring to 100% + check
  function drawRing(t, intro) {
    const cx = cw / 2, cy = ch / 2 + 4;
    const r = Math.min(cw, ch) * 0.32;
    const e = 1 - Math.pow(1 - intro, 3);
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.strokeStyle = BAND;
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = BLUE;
    ctx.beginPath(); ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * e); ctx.stroke();
    const end = -Math.PI / 2 + Math.PI * 2 * e;
    endDot(cx + Math.cos(end) * r, cy + Math.sin(end) * r);
    const c = Math.max(0, Math.min(1, (e - 0.5) / 0.5));
    if (c > 0) {
      const a = { x: cx - r * 0.3, y: cy + r * 0.02 };
      const b = { x: cx - r * 0.06, y: cy + r * 0.26 };
      const d = { x: cx + r * 0.34, y: cy - r * 0.22 };
      ctx.strokeStyle = BLUE;
      ctx.lineWidth = 4;
      ctx.lineJoin = 'round';
      ctx.beginPath(); ctx.moveTo(a.x, a.y);
      if (c < 0.4) { const u = c / 0.4; ctx.lineTo(a.x + (b.x - a.x) * u, a.y + (b.y - a.y) * u); }
      else { ctx.lineTo(b.x, b.y); const u = (c - 0.4) / 0.6; ctx.lineTo(b.x + (d.x - b.x) * u, b.y + (d.y - b.y) * u); }
      ctx.stroke();
    }
  }

  // 5. Education: 50 dots, one per 10 fellows
  function drawDots(t, intro) {
    const cols = 10, rows = 5;
    const gw = Math.min(cw * 0.7, 320);
    const gh = Math.min(ch * 0.5, 120);
    const gx = (cw - gw) / 2, gy = (ch - gh) / 2 + 8;
    label('Each dot = 10 fellows', gx - 6, gy - 16);
    const filled = Math.round(cols * rows * (1 - Math.pow(1 - intro, 2)));
    for (let rI = 0; rI < rows; rI++) {
      for (let c = 0; c < cols; c++) {
        const i = rI * cols + c;
        const x = gx + (c / (cols - 1)) * gw;
        const y = gy + (rI / (rows - 1)) * gh;
        ctx.fillStyle = i < filled ? (i === filled - 1 ? DOT : BLUE) : TRACK;
        ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI * 2); ctx.fill();
      }
    }
  }

  // 6. Continuity: 24-hour dial with sweeping hand
  function drawDial(t, intro) {
    const cx = cw / 2, cy = ch / 2 + 4;
    const r = Math.min(cw, ch) * 0.34;
    ctx.fillStyle = BAND;
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
    for (let h = 0; h < 24; h++) {
      const a = (h / 24) * Math.PI * 2 - Math.PI / 2;
      const major = h % 6 === 0;
      ctx.strokeStyle = major ? BLUE : '#b9c8dc';
      ctx.lineWidth = major ? 2 : 1;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * r * (major ? 0.78 : 0.86), cy + Math.sin(a) * r * (major ? 0.78 : 0.86));
      ctx.lineTo(cx + Math.cos(a) * r * 0.95, cy + Math.sin(a) * r * 0.95);
      ctx.stroke();
    }
    const ang = reduced() ? -Math.PI / 4 : -Math.PI / 2 + ((t * 0.7) % (Math.PI * 2)) * Math.min(1, intro * 2);
    ctx.strokeStyle = BLUE;
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(ang) * r * 0.72, cy + Math.sin(ang) * r * 0.72); ctx.stroke();
    endDot(cx + Math.cos(ang) * r * 0.72, cy + Math.sin(ang) * r * 0.72);
    ctx.fillStyle = BLUE;
    ctx.beginPath(); ctx.arc(cx, cy, 4, 0, Math.PI * 2); ctx.fill();
    label('00', cx, cy - r - 8, 'center');
    label('12', cx, cy + r + 18, 'center');
  }

  const DRAW = {
    'cold-chain': drawColdChain,
    'symposia-bars': drawBars,
    'archipelago-routes': drawArchipelago,
    'governance-ring': drawRing,
    'education-matrix': drawDots,
    'continuity-dial': drawDial
  };

  // ─── Loop / auto-advance ───────────────────────────────────────────────────
  function paused() { return hoverPause || userPause || modalOpen || reduced(); }

  function tick(now) {
    raf = 0;
    if (!slideOn || document.hidden) return;
    const dt = Math.min(100, Math.max(0, now - lastT));
    lastT = now;
    if (!paused()) {
      elapsed += dt;
      if (elapsed >= AUTO_ADVANCE_MS) { select(active + 1, false); return; }
    }
    if (ctx) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cw, ch);
      const intro = reduced() ? 1 : Math.min(1, (now - switchT) / INTRO_MS);
      const fn = DRAW[tabs[active].dataset.visual] || drawColdChain;
      fn(now / 1000, intro);
    }
    if (!reduced()) raf = requestAnimationFrame(tick);
  }

  function start() {
    if (!raf && slideOn && !document.hidden) {
      lastT = performance.now();
      raf = requestAnimationFrame(tick);
    }
  }
  function stop() { if (raf) { cancelAnimationFrame(raf); raf = 0; } }

  // ─── Interaction ───────────────────────────────────────────────────────────
  tabs.forEach((t, i) => t.addEventListener('click', () => select(i, false)));

  if (tablist) {
    tablist.addEventListener('keydown', (e) => {
      const map = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
      if (map[e.key]) { e.preventDefault(); e.stopPropagation(); select(active + map[e.key], true); }
      else if (e.key === 'Home') { e.preventDefault(); select(0, true); }
      else if (e.key === 'End') { e.preventDefault(); select(tabs.length - 1, true); }
    });
  }

  if (root) {
    root.addEventListener('pointerenter', () => { hoverPause = true; });
    root.addEventListener('pointerleave', () => { hoverPause = false; start(); });
    root.addEventListener('focusin', () => { hoverPause = true; });
    root.addEventListener('focusout', (e) => { if (!root.contains(e.relatedTarget)) { hoverPause = false; start(); } });
  }

  if (pauseBtn) {
    if (reduced()) pauseBtn.hidden = true;
    pauseBtn.addEventListener('click', () => {
      userPause = !userPause;
      pauseBtn.textContent = userPause ? 'Play' : 'Pause';
      pauseBtn.setAttribute('aria-pressed', userPause ? 'true' : 'false');
      start();
    });
  }

  // ─── Slide visibility (lazy start / stop) ──────────────────────────────────
  function checkVisible() {
    const on = !slide.classList.contains('opacity-0') && slide.classList.contains('opacity-100');
    if (on === slideOn) return;
    slideOn = on;
    if (on) {
      resize();
      elapsed = 0;
      switchT = performance.now();
      countUp(tabs[active]);
      if (!entryPlayed) { entryPlayed = true; entry(); }
      start();
    } else {
      stop();
      entryPlayed = false;
    }
  }
  new MutationObserver(checkVisible).observe(slide, { attributes: true, attributeFilter: ['class'] });
  if (wrap && typeof ResizeObserver !== 'undefined') {
    new ResizeObserver(() => { if (slideOn) { resize(); start(); } }).observe(wrap);
  }
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); else start(); });

  // ─── Learn-more detail card (#wwd-modal) ───────────────────────────────────
  function closeModal() {
    const m = $('wwd-modal');
    if (!m || m.style.display === 'none') return;
    modalOpen = false;
    m.style.opacity = '0';
    setTimeout(() => { m.style.display = 'none'; }, 300);
    start();
  }

  function openModal(btn) {
    const m = $('wwd-modal');
    if (!m) return;
    modalOpen = true;
    const d = btn.dataset;
    $('wwd-modal-img').src = d.img;
    $('wwd-modal-img').alt = d.title;
    $('wwd-modal-tag').textContent = 'Pillar ' + d.n + ' \u00b7 ' + d.cat;
    $('wwd-modal-title').textContent = d.title;
    $('wwd-modal-desc').textContent = d.desc;
    $('wwd-modal-sl').textContent = d.sl;
    $('wwd-modal-sv').textContent = d.sv;
    const ul = $('wwd-modal-pts');
    ul.innerHTML = '';
    (d.pts || '').split('|').forEach((txt) => {
      const li = document.createElement('li');
      li.className = 'flex items-start gap-2';
      const dot = document.createElement('span');
      dot.className = 'mt-1.5 size-1.5 rounded-full bg-[#1a6fd1] shrink-0';
      const s = document.createElement('span');
      s.textContent = txt;
      li.appendChild(dot);
      li.appendChild(s);
      ul.appendChild(li);
    });
    m.style.top = slide.scrollTop + 'px';
    m.style.height = slide.clientHeight + 'px';
    m.style.display = 'flex';
    requestAnimationFrame(() => { m.style.opacity = '1'; });
  }

  document.addEventListener('click', (e) => {
    const btn = e.target.closest && e.target.closest('.wwd-card');
    if (btn) { openModal(btn); return; }
    const m = $('wwd-modal');
    if (!m || m.style.display === 'none') return;
    if (e.target === m || e.target.closest('#wwd-modal-close') || e.target.closest('#wwd-modal-cta')) closeModal();
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  select(0, false);
  checkVisible();
})();


