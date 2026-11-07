import re

with open("assets/js/main.js", "r", encoding="utf-8") as f:
    main_js = f.read()

# 1. Replace drawColdChain and drawBars (lines before PH_DOTS)
new_cold_and_bars = """  // 1. Cold chain: delivery journey across top + live 2–8 °C wave between dashed lines (no box)
  const JOURNEY_STOPS = ['Order received', 'Cold-packed', 'In transit', 'Delivered'];
  function drawColdChain(t, intro) {
    const elapsedSec = Math.max(0, (performance.now() - switchT) / 1000);
    const padX = Math.max(16, cw * 0.04);
    const w = cw - padX * 2;

    // ── Top: Delivery Journey ───────────────────────────────────────────────
    const jy = Math.max(30, ch * 0.20);
    const pkgCycle = reduced() ? 1 : ((elapsedSec * 0.24) % 1.22);
    const pkgU = Math.max(0, Math.min(1, pkgCycle));

    // Base route line
    ctx.strokeStyle = 'rgba(79, 195, 247, 0.20)';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(padX, jy);
    ctx.lineTo(padX + w, jy);
    ctx.stroke();

    // Active route line up to package dot
    ctx.strokeStyle = BLUE;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(padX, jy);
    ctx.lineTo(padX + w * pkgU, jy);
    ctx.stroke();

    // 4 Stops + arrival ripples + labels
    for (let i = 0; i < JOURNEY_STOPS.length; i++) {
      const su = i / (JOURNEY_STOPS.length - 1);
      const sx = padX + su * w;
      const reached = pkgU >= su - 0.005;
      const sinceReach = pkgU - su;

      if (reached && !reduced() && sinceReach >= 0 && sinceReach < 0.28) {
        const rp = sinceReach / 0.28;
        ctx.strokeStyle = 'rgba(79, 195, 247, ' + ((1 - rp) * 0.55).toFixed(3) + ')';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(sx, jy, 6 + rp * 14, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.save();
      if (reached) {
        ctx.shadowColor = 'rgba(79, 195, 247, 0.75)';
        ctx.shadowBlur = 10;
        ctx.fillStyle = BLUE;
      } else {
        ctx.fillStyle = 'rgba(79, 195, 247, 0.25)';
      }
      ctx.beginPath();
      ctx.arc(sx, jy, reached ? 5.2 : 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      ctx.font = (reached ? '600 ' : '500 ') + '12.5px Manrope, ui-sans-serif, system-ui, sans-serif';
      ctx.fillStyle = reached ? '#ffffff' : 'rgba(184, 198, 220, 0.50)';
      ctx.textAlign = i === 0 ? 'left' : i === JOURNEY_STOPS.length - 1 ? 'right' : 'center';
      ctx.fillText(JOURNEY_STOPS[i], sx, jy + 24);
    }

    // Traveling package dot
    endDot(padX + w * pkgU, jy);

    // ── Bottom: Live Temperature Wave between 2–8 °C Dashed Lines (No Box) ──
    const wy = Math.max(jy + 58, ch * 0.54);
    const wh = Math.max(64, Math.min(ch * 0.34, 115));

    label('2–8 °C safe range', padX, wy - 10);
    ctx.save();
    ctx.font = '500 11.5px Manrope, ui-sans-serif, system-ui, sans-serif';
    ctx.fillStyle = 'rgba(184, 198, 220, 0.58)';
    ctx.textAlign = 'right';
    ctx.fillText('8 °C', padX + w, wy - 6);
    ctx.fillText('2 °C', padX + w, wy + wh + 14);

    ctx.setLineDash([5, 6]);
    ctx.strokeStyle = 'rgba(79, 195, 247, 0.28)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(padX, wy);
    ctx.lineTo(padX + w, wy);
    ctx.moveTo(padX, wy + wh);
    ctx.lineTo(padX + w, wy + wh);
    ctx.stroke();
    ctx.restore();

    const n = 96;
    const shown = Math.max(2, Math.round(n * intro));
    const phase = reduced() ? 0 : t * 1.15;
    ctx.beginPath();
    let lx = padX, ly = wy + wh * 0.5;
    for (let i = 0; i < shown; i++) {
      const u = i / (n - 1);
      const x = padX + u * w;
      const waveVal = Math.sin(u * Math.PI * 4.2 - phase) * 0.24 + Math.sin(u * Math.PI * 1.7 + phase * 0.65) * 0.08;
      const y = wy + wh * (0.5 + waveVal);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
      lx = x;
      ly = y;
    }
    ctx.strokeStyle = BLUE;
    ctx.lineWidth = 3;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.stroke();
    endDot(lx, ly);

    // Live temperature reading (e.g. 4.6 °C)
    const normTemp = 1 - (ly - wy) / wh;
    const tempC = (2 + normTemp * 6).toFixed(1) + ' °C';
    ctx.save();
    ctx.font = '700 13px Manrope, ui-sans-serif, system-ui, sans-serif';
    ctx.fillStyle = DOT;
    ctx.textAlign = lx > padX + w * 0.85 ? 'right' : 'left';
    ctx.fillText(tempC, lx + (lx > padX + w * 0.85 ? -10 : 10), ly - 10);
    ctx.restore();
  }

  // 2. Commercial: 25 bars rising (open stage, no box)
  function drawBars(t, intro) {
    const n = 25;
    const gw = cw * 0.92;
    const gh = Math.min(ch * 0.68, 230);
    const gx = (cw - gw) / 2;
    const gy = (ch - gh) / 2 + 12;
    label('One bar per symposium this year', gx, gy - 14);
    const slot = gw / n;
    const bw = slot * 0.56;
    for (let i = 0; i < n; i++) {
      const u = i / (n - 1);
      const local = Math.max(0, Math.min(1, intro * 1.6 - u * 0.6));
      const e = 1 - Math.pow(1 - local, 3);
      const base = 0.35 + 0.5 * ((Math.sin(i * 1.7) + 1) / 2) + u * 0.12;
      const shimmer = reduced() ? 1 : 0.94 + 0.06 * Math.sin(t * 2.2 + i * 0.4);
      const h = gh * Math.min(1, base) * e * shimmer;
      ctx.fillStyle = i === n - 1 ? DOT : BLUE;
      roundRect(gx + i * slot + (slot - bw) / 2, gy + gh - h, bw, Math.max(2, h), 2);
      ctx.fill();
    }
  }"""

pattern_1_2 = re.compile(
    r"  // 1\. Cold chain: wave inside 2–8 °C band[\s\S]*?  // 3\. Field network:",
    re.MULTILINE
)
if not pattern_1_2.search(main_js):
    raise RuntimeError("Could not find drawColdChain / drawBars block")

main_js = pattern_1_2.sub(new_cold_and_bars + "\n\n  // 3. Field network:", main_js, count=1)

# 2. Replace drawRing, drawDots, drawDial
new_ring_dots_dial = """  // 4. Governance: 0/4..4/4 progress ring on left + 4-item checklist on right
  const AUDIT_CHECKS = [
    'Every shipment',
    'Every label',
    'Every registration',
    'Audit result: pass'
  ];
  function drawRing(t, intro) {
    const elapsedSec = Math.max(0, (performance.now() - switchT) / 1000);
    const cycleDur = 6.4;
    const cyc = reduced() ? 4.8 : (elapsedSec % cycleDur);

    // Determine how many items are checked (0..4) and smooth ring fill
    const stepTimes = [0.55, 1.65, 2.75, 3.85];
    let count = 0;
    let ringTarget = 0;
    for (let i = 0; i < 4; i++) {
      if (cyc >= stepTimes[i]) {
        count = i + 1;
        const localP = Math.min(1, (cyc - stepTimes[i]) / 0.45);
        const easeP = 1 - Math.pow(1 - localP, 3);
        ringTarget = (i + easeP) / 4;
      }
    }
    if (reduced()) { count = 4; ringTarget = 1; }

    // ── Left: Progress Ring (0/4 .. 4/4) ────────────────────────────────────
    const cx = cw * 0.22;
    const cy = ch * 0.52;
    const r = Math.max(54, Math.min(cw * 0.14, ch * 0.36, 102));

    // Completion ripple when 4/4 reached
    if (count === 4 && !reduced()) {
      const sinceComplete = Math.max(0, cyc - stepTimes[3]);
      if (sinceComplete < 1.6) {
        const rp = sinceComplete / 1.6;
        ctx.strokeStyle = 'rgba(79, 195, 247, ' + ((1 - rp) * 0.45).toFixed(3) + ')';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(cx, cy, r + 4 + rp * 22, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    // Track ring
    ctx.lineWidth = 9.5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'rgba(79, 195, 247, 0.18)';
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();

    // Active progress arc
    if (ringTarget > 0.005) {
      ctx.strokeStyle = BLUE;
      ctx.beginPath();
      ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * ringTarget);
      ctx.stroke();
    }

    // Center X/4 label
    ctx.save();
    const ringFontPx = Math.round(Math.max(24, Math.min(36, r * 0.38)));
    ctx.font = '800 ' + ringFontPx + 'px Manrope, ui-sans-serif, system-ui, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(count + '/4', cx, cy + 1);
    ctx.restore();

    // ── Right: 4-Row Checklist ──────────────────────────────────────────────
    const listX = cw * 0.45;
    const lineEndX = cw * 0.95;
    const totalH = Math.min(ch * 0.76, 210);
    const startY = cy - totalH * 0.5 + 14;
    const rowStep = totalH / (AUDIT_CHECKS.length - 0.35);

    for (let i = 0; i < AUDIT_CHECKS.length; i++) {
      const ry = startY + i * rowStep;
      const checked = cyc >= stepTimes[i] || reduced();
      const checkP = reduced() ? 1 : Math.max(0, Math.min(1, (cyc - stepTimes[i]) / 0.32));
      const checkEase = 1 - Math.pow(1 - checkP, 3);

      const icx = listX + 13;
      const icy = ry - 5;
      const ir = 12;

      // Circle icon
      ctx.strokeStyle = checked ? BLUE : 'rgba(114, 197, 248, 0.24)';
      ctx.lineWidth = checked ? 1.7 : 1.3;
      ctx.beginPath();
      ctx.arc(icx, icy, ir, 0, Math.PI * 2);
      ctx.stroke();

      // Amber checkmark inside circle
      if (checked && checkEase > 0) {
        const a = { x: icx - 5, y: icy + 0.5 };
        const b = { x: icx - 1, y: icy + 4.5 };
        const d = { x: icx + 5.5, y: icy - 3.5 };
        ctx.strokeStyle = DOT;
        ctx.lineWidth = 2.3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        if (checkEase < 0.45) {
          const u = checkEase / 0.45;
          ctx.lineTo(a.x + (b.x - a.x) * u, a.y + (b.y - a.y) * u);
        } else {
          ctx.lineTo(b.x, b.y);
          const u = (checkEase - 0.45) / 0.55;
          ctx.lineTo(b.x + (d.x - b.x) * u, b.y + (d.y - b.y) * u);
        }
        ctx.stroke();
      }

      // Checklist label
      const tx = listX + 38;
      ctx.font = (checked ? '700 ' : '500 ') + '16px Manrope, ui-sans-serif, system-ui, sans-serif';
      ctx.fillStyle = checked ? '#ffffff' : 'rgba(184, 198, 220, 0.52)';
      ctx.textAlign = 'left';
      ctx.fillText(AUDIT_CHECKS[i], tx, ry);

      // Underline rule
      const lineY = ry + 13;
      ctx.strokeStyle = 'rgba(114, 197, 248, 0.16)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(tx, lineY);
      ctx.lineTo(lineEndX, lineY);
      ctx.stroke();

      if (checked && checkEase > 0) {
        ctx.strokeStyle = 'rgba(79, 195, 247, 0.65)';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(tx, lineY);
        ctx.lineTo(tx + (lineEndX - tx) * checkEase, lineY);
        ctx.stroke();
      }
    }
  }

  // 5. Education: 500 small dots (25x20), one per fellow, last 5 amber for "+"
  function drawDots(t, intro) {
    const cols = 25, rows = 20;
    const total = cols * rows;
    const gx = Math.max(12, cw * 0.03);
    const gw = cw - gx * 2;
    const gy = 10;
    const gh = Math.max(130, ch - 38);

    const filled = reduced() ? total : Math.round(total * (1 - Math.pow(1 - Math.min(1, intro * 1.12), 2.4)));
    const dotR = Math.max(2.1, Math.min(3.5, Math.min(gw / (cols * 3.1), gh / (rows * 2.7))));

    for (let rI = 0; rI < rows; rI++) {
      const y = gy + (rI / (rows - 1)) * gh;
      for (let c = 0; c < cols; c++) {
        const i = rI * cols + c;
        if (i >= filled) continue;
        const x = gx + (c / (cols - 1)) * gw;
        const isAmberPlus = i >= total - 5;
        const wave = reduced() ? 0.85 : 0.58 + 0.42 * (0.5 + 0.5 * Math.sin(t * 2.5 - c * 0.24 - rI * 0.18));
        ctx.fillStyle = isAmberPlus
          ? DOT
          : 'rgba(79, 195, 247, ' + wave.toFixed(3) + ')';
        ctx.beginPath();
        ctx.arc(x, y, dotR, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.save();
    ctx.font = '500 12px Manrope, ui-sans-serif, system-ui, sans-serif';
    ctx.fillStyle = 'rgba(184, 198, 220, 0.72)';
    ctx.textAlign = 'left';
    ctx.fillText('Each dot = one fellow trained', gx - 2, gy + gh + 22);
    ctx.restore();
  }

  // 6. Continuity: 24-segment dial on left + "Every hour. Every day." & M..S circles on right
  const WEEK_DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  function drawDial(t, intro) {
    const cx = cw * 0.26;
    const cy = ch * 0.52;
    const r = Math.max(68, Math.min(cw * 0.18, ch * 0.38, 122));

    const cycleU = reduced() ? 0.25 : ((t * 0.075) % 1);
    const curHour = Math.floor(cycleU * 24) % 24;
    const ang = -Math.PI / 2 + cycleU * Math.PI * 2;

    // 24 Hour Arc Segments
    const segThick = Math.max(6.5, r * 0.082);
    const gapRad = 0.032;
    ctx.lineWidth = segThick;
    ctx.lineCap = 'round';
    for (let h = 0; h < 24; h++) {
      const a0 = -Math.PI / 2 + (h / 24) * Math.PI * 2 + gapRad;
      const a1 = -Math.PI / 2 + ((h + 1) / 24) * Math.PI * 2 - gapRad;
      ctx.strokeStyle = h <= curHour ? BLUE : 'rgba(79, 195, 247, 0.22)';
      ctx.beginPath();
      ctx.arc(cx, cy, r, a0, a1);
      ctx.stroke();
    }

    // Cardinal 00 / 06 / 12 / 18 labels
    ctx.save();
    ctx.font = '500 12.5px Manrope, ui-sans-serif, system-ui, sans-serif';
    ctx.fillStyle = 'rgba(184, 198, 220, 0.78)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('00', cx, cy - r - 18);
    ctx.fillText('06', cx + r + 22, cy);
    ctx.fillText('12', cx, cy + r + 19);
    ctx.fillText('18', cx - r - 22, cy);

    // Center digital clock & status
    const hh = (curHour < 10 ? '0' : '') + curHour + ':00';
    const clockFontPx = Math.round(Math.max(22, Math.min(34, r * 0.30)));
    ctx.font = '800 ' + clockFontPx + 'px Manrope, ui-sans-serif, system-ui, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(hh, cx, cy - 5);

    ctx.font = '500 12.5px Manrope, ui-sans-serif, system-ui, sans-serif';
    ctx.fillStyle = 'rgba(184, 198, 220, 0.82)';
    ctx.fillText('support desk · online', cx, cy + 19);
    ctx.restore();

    // Sweeping pointer hand + amber tip
    ctx.strokeStyle = BLUE;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(ang) * r * 0.54, cy + Math.sin(ang) * r * 0.54);
    ctx.lineTo(cx + Math.cos(ang) * r * 0.85, cy + Math.sin(ang) * r * 0.85);
    ctx.stroke();
    endDot(cx + Math.cos(ang) * r * 0.86, cy + Math.sin(ang) * r * 0.86);

    // Urgent case ping markers on the ring (e.g. at 08:00 and 15:00)
    const pings = [8 / 24, 15 / 24];
    for (let p = 0; p < pings.length; p++) {
      const pu = pings[p];
      const pa = -Math.PI / 2 + pu * Math.PI * 2;
      const px = cx + Math.cos(pa) * r;
      const py = cy + Math.sin(pa) * r;
      const activePing = Math.abs(cycleU - pu) < 0.14;
      ctx.strokeStyle = activePing ? 'rgba(244, 166, 75, 0.65)' : 'rgba(184, 198, 220, 0.25)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(pa) * r * 0.64, cy + Math.sin(pa) * r * 0.64);
      ctx.lineTo(px, py);
      ctx.stroke();

      ctx.strokeStyle = activePing ? 'rgba(244, 166, 75, 0.45)' : 'rgba(184, 198, 220, 0.22)';
      ctx.beginPath();
      ctx.arc(px, py, activePing ? 10 : 8, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = activePing ? DOT : 'rgba(244, 166, 75, 0.55)';
      ctx.beginPath();
      ctx.arc(px, py, activePing ? 5 : 4, 0, Math.PI * 2);
      ctx.fill();
    }

    // ── Right: "Every hour. Every day." + M T W T F S S circles ─────────────
    const rx = cw * 0.53;
    const headPx = Math.round(Math.max(22, Math.min(30, cw * 0.038)));
    const topY = cy - 44;

    ctx.save();
    ctx.textAlign = 'left';
    ctx.font = '700 ' + headPx + 'px Manrope, ui-sans-serif, system-ui, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Every hour.', rx, topY);
    ctx.fillStyle = BLUE;
    ctx.fillText('Every day.', rx, topY + headPx * 1.22);

    ctx.font = '500 13.5px Manrope, ui-sans-serif, system-ui, sans-serif';
    ctx.fillStyle = 'rgba(184, 198, 220, 0.88)';
    ctx.fillText('Urgent cases go to the front of the queue.', rx, topY + headPx * 1.22 + 28);

    const activeDay = reduced() ? 2 : Math.floor((t * 0.35) % 7);
    const dr = Math.max(13, Math.min(17.5, (cw * 0.42) / 16));
    const dStep = dr * 2 + Math.max(6, dr * 0.52);
    const dy = topY + headPx * 1.22 + 68;

    for (let d = 0; d < WEEK_DAYS.length; d++) {
      const dx = rx + dr + d * dStep;
      const isToday = d === activeDay;
      if (isToday) {
        ctx.fillStyle = BLUE;
        ctx.beginPath();
        ctx.arc(dx, dy, dr, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.strokeStyle = 'rgba(79, 195, 247, 0.36)';
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.arc(dx, dy, dr, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.font = (isToday ? '700 ' : '600 ') + '12.5px Manrope, ui-sans-serif, system-ui, sans-serif';
      ctx.fillStyle = isToday ? '#041022' : 'rgba(220, 232, 248, 0.85)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(WEEK_DAYS[d], dx, dy + 0.5);
    }
    ctx.restore();
  }"""

pattern_4_5_6 = re.compile(
    r"  // 4\. Governance: ring to 100% \+ check[\s\S]*?  const DRAW = \{",
    re.MULTILINE
)
if not pattern_4_5_6.search(main_js):
    raise RuntimeError("Could not find drawRing / drawDots / drawDial block")

main_js = pattern_4_5_6.sub(new_ring_dots_dial + "\n\n  const DRAW = {", main_js, count=1)

with open("assets/js/main.js", "w", encoding="utf-8", newline="\n") as f:
    f.write(main_js)

print("Successfully updated all What We Do visuals in assets/js/main.js")

