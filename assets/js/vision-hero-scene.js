/**
 * MEDIQ Vision Hero Canvas Engine (`vision-hero.html`)
 * -----------------------------------------------------------------------------
 * Renders the animated medical-ophthalmic backdrop behind the headline:
 *   1. Glowing rotating & gently breathing anatomical iris + dark central pupil
 *   2. Traveling bottom ECG heartbeat pulse line with phosphor trail & tip spark
 *   3. Upward-drifting glowing particles and thin medical crosses (+)
 *   4. Subtle mouse parallax across depth layers inside the hero viewport
 */
(function initMediqVisionHeroScene() {
  'use strict';

  const hero = document.getElementById('vision-hero');
  const canvas = document.getElementById('vision-hero-canvas');
  if (!hero || !canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const rmq =
    typeof window.matchMedia === 'function'
      ? window.matchMedia('(prefers-reduced-motion: reduce)')
      : { matches: false };

  let width = window.innerWidth;
  let height = window.innerHeight;
  let dpr = 1;

  // Build crisp 1024x1024 procedural Iris sprite once on startup (zero per-frame ray regeneration cost)
  const IRIS_SIZE = 1024;
  const irisSprite = document.createElement('canvas');
  irisSprite.width = IRIS_SIZE;
  irisSprite.height = IRIS_SIZE;
  (function paintIrisSprite() {
    const ic = irisSprite.getContext('2d');
    if (!ic) return;
    const cx = IRIS_SIZE * 0.5;
    const cy = IRIS_SIZE * 0.5;
    const outerR = IRIS_SIZE * 0.455;
    const innerR = IRIS_SIZE * 0.168;

    // 1. Soft cobalt-cyan radial corona behind iris
    const corona = ic.createRadialGradient(cx, cy, innerR * 0.8, cx, cy, outerR * 1.12);
    corona.addColorStop(0.0, 'rgba(3, 12, 32, 0)');
    corona.addColorStop(0.28, 'rgba(26, 98, 212, 0.24)');
    corona.addColorStop(0.55, 'rgba(58, 160, 219, 0.36)');
    corona.addColorStop(0.80, 'rgba(26, 86, 196, 0.14)');
    corona.addColorStop(1.0, 'rgba(4, 12, 30, 0)');
    ic.fillStyle = corona;
    ic.fillRect(0, 0, IRIS_SIZE, IRIS_SIZE);

    // 2. Concentric subtle optical rings & micro degree ticks
    [outerR * 0.88, outerR * 0.72, outerR * 1.03].forEach((r, idx) => {
      ic.beginPath();
      ic.arc(cx, cy, r, 0, Math.PI * 2);
      ic.strokeStyle =
        idx === 0
          ? 'rgba(114, 197, 248, 0.22)'
          : idx === 1
          ? 'rgba(92, 168, 232, 0.16)'
          : 'rgba(114, 197, 248, 0.11)';
      ic.lineWidth = idx === 0 ? 1.4 : 1.0;
      ic.stroke();
    });

    // Cardinal calibration ticks on outer ring
    for (let deg = 0; deg < 360; deg += 5) {
      const a = (deg * Math.PI) / 180;
      const major = deg % 45 === 0;
      const r0 = outerR * 0.88;
      const r1 = r0 + (major ? 12 : deg % 15 === 0 ? 7 : 3);
      ic.beginPath();
      ic.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0);
      ic.lineTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1);
      ic.strokeStyle = major ? 'rgba(148, 216, 255, 0.36)' : 'rgba(114, 197, 248, 0.14)';
      ic.lineWidth = major ? 1.4 : 0.8;
      ic.stroke();
    }

    // 3. Radial anatomical iris fibers (360 layered cyan/royal-blue striations)
    const RAY_COUNT = 380;
    for (let i = 0; i < RAY_COUNT; i++) {
      const a = (i / RAY_COUNT) * Math.PI * 2;
      const n1 = Math.sin(i * 1.37) * 0.5 + 0.5;
      const n2 = Math.cos(i * 4.13) * 0.5 + 0.5;
      const rayStart = innerR * (0.94 + n1 * 0.12);
      const rayEnd = outerR * (0.76 + n2 * 0.25);

      const g = ic.createLinearGradient(
        cx + Math.cos(a) * rayStart,
        cy + Math.sin(a) * rayStart,
        cx + Math.cos(a) * rayEnd,
        cy + Math.sin(a) * rayEnd
      );
      const bright = 0.08 + n1 * 0.16 + (i % 7 === 0 ? 0.10 : 0);
      g.addColorStop(0.0, 'rgba(30, 108, 214, 0)');
      g.addColorStop(0.22, `rgba(94, 188, 255, ${(bright * 1.15).toFixed(3)})`);
      g.addColorStop(0.55, `rgba(58, 160, 219, ${(bright * 0.85).toFixed(3)})`);
      g.addColorStop(1.0, 'rgba(12, 42, 104, 0)');

      ic.beginPath();
      ic.moveTo(cx + Math.cos(a) * rayStart, cy + Math.sin(a) * rayStart);
      ic.lineTo(cx + Math.cos(a) * rayEnd, cy + Math.sin(a) * rayEnd);
      ic.strokeStyle = g;
      ic.lineWidth = 1.0 + n2 * 1.4;
      ic.stroke();
    }

    // 4. Sculpted dark iris crypts / petals around the collarette for realistic depth
    for (let k = 0; k < 28; k++) {
      const a = (k / 28) * Math.PI * 2 + (k % 2) * 0.04;
      const dist = innerR * (1.28 + ((k * 37) % 10) * 0.032);
      const rx = 18 + ((k * 13) % 18);
      const ry = 8 + ((k * 7) % 9);
      ic.save();
      ic.translate(cx + Math.cos(a) * dist, cy + Math.sin(a) * dist);
      ic.rotate(a);
      ic.beginPath();
      ic.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
      ic.fillStyle = 'rgba(2, 10, 28, 0.42)';
      ic.fill();
      ic.restore();
    }

    // 5. Crisp bright collarette ring around pupillary border
    ic.beginPath();
    ic.arc(cx, cy, innerR * 1.03, 0, Math.PI * 2);
    ic.strokeStyle = 'rgba(154, 218, 255, 0.42)';
    ic.lineWidth = 1.6;
    ic.stroke();

    // 6. Deep obsidian pupil sitting behind headline text so typography stays high-contrast
    const pupilGrad = ic.createRadialGradient(cx, cy, 0, cx, cy, innerR * 1.06);
    pupilGrad.addColorStop(0.0, 'rgba(2, 6, 17, 0.98)');
    pupilGrad.addColorStop(0.78, 'rgba(3, 8, 22, 0.94)');
    pupilGrad.addColorStop(0.95, 'rgba(6, 16, 40, 0.85)');
    pupilGrad.addColorStop(1.0, 'rgba(10, 26, 62, 0)');
    ic.fillStyle = pupilGrad;
    ic.beginPath();
    ic.arc(cx, cy, innerR * 1.06, 0, Math.PI * 2);
    ic.fill();

    // Subtle soft cornea catchlight arc on upper-left quadrant
    ic.beginPath();
    ic.arc(cx, cy, innerR * 0.78, Math.PI * 1.08, Math.PI * 1.44);
    ic.strokeStyle = 'rgba(210, 238, 255, 0.14)';
    ic.lineWidth = 5;
    ic.lineCap = 'round';
    ic.stroke();
  })();

  // Floating particles: soft luminous dots & fine medical crosses (+)
  const PARTICLE_COUNT = 54;
  const particles = Array.from({ length: PARTICLE_COUNT }, (_, idx) => ({
    x: Math.random(),
    y: Math.random(),
    depth: 0.35 + Math.random() * 0.85,
    vy: 0.012 + Math.random() * 0.022,
    driftPhase: Math.random() * Math.PI * 2,
    isCross: idx % 3 === 0,
    size: idx % 3 === 0 ? 4.0 + Math.random() * 4.5 : 1.1 + Math.random() * 1.7,
    alpha: idx % 3 === 0 ? 0.18 + Math.random() * 0.24 : 0.22 + Math.random() * 0.38,
  }));

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    width = Math.max(320, Math.round(rect.width || hero.clientWidth || window.innerWidth));
    height = Math.max(420, Math.round(rect.height || hero.clientHeight || window.innerHeight));
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  // Pointer parallax state
  let targetMx = 0;
  let targetMy = 0;
  let smoothMx = 0;
  let smoothMy = 0;

  hero.addEventListener(
    'pointermove',
    (e) => {
      const r = hero.getBoundingClientRect();
      if (!r.width || !r.height) return;
      targetMx = ((e.clientX - r.left) / r.width) * 2 - 1;
      targetMy = ((e.clientY - r.top) / r.height) * 2 - 1;
    },
    { passive: true }
  );
  hero.addEventListener(
    'pointerleave',
    () => {
      targetMx = 0;
      targetMy = 0;
    },
    { passive: true }
  );

  // Clean biomedical P-Q-R-S-T ECG heartbeat waveform centered at xNorm
  function ecgOffsetAt(u) {
    // u in [-0.075, +0.075] relative to pulse wave packet center
    let v = 0;
    // P wave
    v -= Math.exp(-Math.pow((u + 0.042) / 0.010, 2)) * 0.16;
    // Q dip
    v += Math.exp(-Math.pow((u + 0.016) / 0.0045, 2)) * 0.18;
    // Tall sharp systolic R spike
    v -= Math.exp(-Math.pow(u / 0.0042, 2)) * 1.0;
    // S dip
    v += Math.exp(-Math.pow((u - 0.013) / 0.005, 2)) * 0.28;
    // T wave
    v -= Math.exp(-Math.pow((u - 0.044) / 0.014, 2)) * 0.25;
    return v;
  }

  function drawHeartbeatLine(time, mx, my) {
    const baseY = height - Math.max(52, Math.min(76, height * 0.078)) + my * 2.5;
    const waveAmp = Math.max(18, Math.min(30, height * 0.036));
    const speedPeriod = 5.4; // seconds to traverse viewport left -> right
    const headX = ((time / speedPeriod) % 1.16 - 0.08) * width;
    const trailPx = Math.max(180, width * 0.24);
    const pulseSpacing = Math.max(240, width * 0.28);

    // Subtle baseline across full width
    ctx.beginPath();
    ctx.moveTo(0, baseY);
    ctx.lineTo(width, baseY);
    ctx.strokeStyle = 'rgba(114, 197, 248, 0.13)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Active glowing ECG pulse trail leading into moving head dot
    const startX = Math.max(0, headX - trailPx);
    const endX = Math.min(width, headX);
    if (endX <= startX + 2) return;

    const steps = 96;
    const grad = ctx.createLinearGradient(startX, baseY, endX, baseY);
    grad.addColorStop(0.0, 'rgba(58, 160, 219, 0.0)');
    grad.addColorStop(0.55, 'rgba(94, 188, 255, 0.42)');
    grad.addColorStop(0.92, 'rgba(176, 232, 255, 0.85)');
    grad.addColorStop(1.0, 'rgba(255, 255, 255, 0.96)');

    ctx.save();
    ctx.beginPath();
    for (let i = 0; i <= steps; i++) {
      const px = startX + ((endX - startX) * i) / steps;
      // Evaluate repeated heartbeat complexes spaced smoothly across screen
      const shifted = px + mx * 8;
      const cyc = ((shifted % pulseSpacing) + pulseSpacing) % pulseSpacing;
      const u = (cyc - pulseSpacing * 0.5) / pulseSpacing;
      const py = baseY + ecgOffsetAt(u * 1.4) * waveAmp;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.strokeStyle = grad;
    ctx.lineWidth = 1.65;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    // Glowing phosphor head spark
    const cycH = ((endX + mx * 8) % pulseSpacing + pulseSpacing) % pulseSpacing;
    const uH = (cycH - pulseSpacing * 0.5) / pulseSpacing;
    const headY = baseY + ecgOffsetAt(uH * 1.4) * waveAmp;
    const spark = ctx.createRadialGradient(endX, headY, 0, endX, headY, 10);
    spark.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
    spark.addColorStop(0.4, 'rgba(114, 197, 248, 0.55)');
    spark.addColorStop(1, 'rgba(114, 197, 248, 0)');
    ctx.fillStyle = spark;
    ctx.beginPath();
    ctx.arc(endX, headY, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  let inView = true;
  let rafId = 0;
  let lastNow = 0;
  let simTime = 1.2;

  function renderFrame(now) {
    rafId = 0;
    if (!inView || document.hidden) return;

    const dt = lastNow ? Math.min(0.05, Math.max(0.001, (now - lastNow) / 1000)) : 0.016;
    lastNow = now;
    if (!rmq.matches) {
      simTime += dt;
    }

    const follow = 1 - Math.exp(-6.5 * dt);
    smoothMx += (targetMx - smoothMx) * follow;
    smoothMy += (targetMy - smoothMy) * follow;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    // 1. Center ambient sapphire radial lift behind Iris
    const irisCx = width * 0.5 + smoothMx * 16;
    const irisCy = height * 0.475 + smoothMy * 12;
    const minDim = Math.min(width, height);
    const irisDrawSize = Math.max(460, Math.min(1100, minDim * 0.94));
    const breath = rmq.matches ? 1 : 1 + 0.025 * Math.sin(simTime * 0.72);
    const rotAngle = rmq.matches ? 0 : simTime * 0.024;

    // 2. Large Glowing Slowly-Rotating & Breathing Eye Iris behind the headline
    ctx.save();
    ctx.translate(irisCx, irisCy);
    ctx.rotate(rotAngle);
    const drawS = irisDrawSize * breath;
    ctx.globalAlpha = 0.92;
    ctx.drawImage(irisSprite, -drawS * 0.5, -drawS * 0.5, drawS, drawS);
    ctx.restore();

    // Subtle secondary outer optical ring rotating cleanly in slow counter-phase
    const outerRingR = Math.max(300, Math.min(width, height) * 0.47) * (1 + 0.012 * Math.sin(simTime * 0.5));
    ctx.save();
    ctx.translate(width * 0.5 + smoothMx * 22, height * 0.475 + smoothMy * 16);
    ctx.rotate(-rotAngle * 0.65);
    ctx.beginPath();
    ctx.arc(0, 0, outerRingR, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(114, 197, 248, 0.12)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();

    // 3. Upward-drifting glowing dots & medical crosses (+) with depth parallax
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = particles[i];
      if (!rmq.matches) {
        p.y -= p.vy * dt;
        if (p.y < -0.04) {
          p.y = 1.04;
          p.x = Math.random();
        }
      }
      const px = p.x * width + Math.sin(simTime * 0.6 + p.driftPhase) * 8 + smoothMx * (28 * p.depth);
      const py = p.y * height + smoothMy * (22 * p.depth);
      const edgeFade = Math.min(1, Math.min(p.y * 5, (1 - p.y) * 5));
      const a = Math.max(0, p.alpha * edgeFade);
      if (a <= 0.01) continue;

      if (p.isCross) {
        const s = p.size;
        ctx.strokeStyle = `rgba(176, 224, 255, ${a.toFixed(3)})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(px - s, py);
        ctx.lineTo(px + s, py);
        ctx.moveTo(px, py - s);
        ctx.lineTo(px, py + s);
        ctx.stroke();
      } else {
        ctx.fillStyle = `rgba(164, 220, 255, ${a.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 4. Traveling ECG heartbeat line along bottom
    drawHeartbeatLine(simTime, smoothMx, smoothMy);

    if (!rmq.matches) {
      rafId = requestAnimationFrame(renderFrame);
    }
  }

  function syncLoop() {
    if (!inView || document.hidden) {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
      lastNow = 0;
      return;
    }
    if (!rafId) {
      lastNow = 0;
      rafId = requestAnimationFrame(renderFrame);
    }
  }

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        inView = entries.some((e) => e.isIntersecting);
        syncLoop();
      },
      { threshold: 0.01 }
    );
    io.observe(hero);
  }
  document.addEventListener('visibilitychange', syncLoop);

  renderFrame(performance.now());
  if (!rmq.matches) syncLoop();
})();
