import json

with open('scratch/world_dots_compact.json', 'r', encoding='utf-8') as f:
    dots = json.load(f)

print(f"Loaded {len(dots)} world dots.")

# Build the complete assets/js/about-route-globe.js
header = """/**
 * About World Route & Philippines Distribution Network Map
 * Complete geographic world map (all 258 countries across Asia, Europe,
 * Americas, Africa, and Oceania) with graceful global innovation flight arcs,
 * and highlighted Philippines distribution network with Luzon, Visayas,
 * and Mindanao regional hubs (inspired by user reference images).
 * Seamlessly blended into active WebGL silk waves shader and drifting smoke.
 */
(function () {
  'use strict';

  // 1. Complete World Geographic Dots (all 258 countries, Asia, Europe, Americas, Africa, Oceania)
  var WORLD_DOTS = """ + json.dumps(dots) + """;

  // 2. Global Healthcare Innovation Partners
  var GLOBAL_HUBS = [
    { name: "London, UK", lon: -0.13, lat: 51.50, note: "Rayner Global Headquarters" },
    { name: "Zurich, Switzerland", lon: 8.54, lat: 47.37, note: "Advanced Optical R&D Center" },
    { name: "Munich, Germany", lon: 11.58, lat: 48.14, note: "European Quality Assurance" },
    { name: "Tokyo, Japan", lon: 139.69, lat: 35.69, note: "Asia-Pacific Clinical Partners" },
    { name: "Singapore", lon: 103.82, lat: 1.35, note: "Southeast Asia Regional Network" },
    { name: "San Francisco, USA", lon: -122.42, lat: 37.77, note: "AI Spiral Technology Collaborations" }
  ];

  // 3. Philippine Distribution Hubs (Luzon, Visayas, Mindanao matching user reference)
  var PH_HUBS = [
    { id: "luzon", name: "LUZON", sub: "Metro Manila HQ & Central Hub", lon: 120.98, lat: 14.60, color: "#ffffff" },
    { id: "visayas", name: "VISAYAS", sub: "Cebu Operations Hub", lon: 123.89, lat: 10.31, color: "#72c5f8" },
    { id: "mindanao", name: "MINDANAO", sub: "Davao Regional Hub", lon: 125.61, lat: 7.07, color: "#3aa0db" }
  ];

  var PH_CORRIDORS = [
    ["luzon", "visayas"],
    ["visayas", "mindanao"],
    ["luzon", "mindanao"]
  ];

  var THEME = {
    dotBase: "rgba(114, 197, 248, 0.42)",
    dotAsia: "rgba(148, 215, 255, 0.55)",
    dotHighlight: "#ffffff",
    arc: "rgba(114, 197, 248, 0.40)",
    comet: "#ffffff",
    pulseRing: "rgba(114, 197, 248, 0.70)"
  };

  function initAboutWorldMap() {
    var container = document.getElementById('about-interactive-stage');
    if (!container) return;

    var existingCanvas = container.querySelector('.route-world-canvas');
    if (existingCanvas) existingCanvas.remove();
    var existingTooltip = container.querySelector('.route-world-tooltip');
    if (existingTooltip) existingTooltip.remove();

    var canvas = document.createElement('canvas');
    canvas.className = 'route-world-canvas absolute inset-0 w-full h-full block z-10';
    container.appendChild(canvas);

    var tooltip = document.createElement('div');
    tooltip.className = 'route-world-tooltip pointer-events-none absolute z-30 transition-opacity duration-150 opacity-0 -translate-x-1/2 -translate-y-full pb-3';
    tooltip.innerHTML = '<div class="rounded-xl bg-[#0a1d40]/90 backdrop-blur-md px-3.5 py-2 text-xs text-white shadow-2xl border border-sky/30 text-center whitespace-nowrap"><div class="font-bold tracking-wide text-sky-100" id="wm-tip-name"></div><div class="text-[11px] text-sky-300 mt-0.5" id="wm-tip-note"></div></div>';
    container.appendChild(tooltip);

    var tipName = tooltip.querySelector('#wm-tip-name');
    var tipNote = tooltip.querySelector('#wm-tip-note');

    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    var W = 0, H = 0, dpr = 1, raf = 0, alive = true, visible = true;
    var t0 = performance.now();
    var mouse = { x: -999, y: -999, active: false };
    var activePins = [];

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = container.clientWidth || 1200;
      H = container.clientHeight || 700;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
    }

    function project(lon, lat) {
      var mapW = Math.min(W * 0.94, 1850);
      var mapH = Math.min(H * 0.84, 750);
      var startX = (W - mapW) / 2;
      var startY = (H - mapH) / 2 + 15;

      var nx = (lon + 180) / 360;
      var ny = (72 - lat) / 128;

      return {
        x: startX + nx * mapW,
        y: startY + ny * mapH
      };
    }

    function draw(now) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      var t = (now - t0) / 1000;
      var mapW = Math.min(W * 0.94, 1850);
      var mapH = Math.min(H * 0.84, 750);
      var startX = (W - mapW) / 2;
      var startY = (H - mapH) / 2 + 15;
      activePins = [];

      // 0. Soft Dark Vignette under left typography for pristine legibility
      var textVignette = ctx.createRadialGradient(W * 0.22, H * 0.48, 60, W * 0.22, H * 0.48, Math.min(W * 0.42, 600));
      textVignette.addColorStop(0, "rgba(10, 29, 64, 0.75)");
      textVignette.addColorStop(0.60, "rgba(10, 29, 64, 0.45)");
      textVignette.addColorStop(1, "transparent");
      ctx.fillStyle = textVignette;
      ctx.beginPath();
      ctx.arc(W * 0.22, H * 0.48, Math.min(W * 0.42, 600), 0, Math.PI * 2);
      ctx.fill();

      // 1. Soft Ambient Volumetric Light behind Asia & Philippines
      var mnlCoord = project(120.98, 14.60);
      var asiaGlow = ctx.createRadialGradient(mnlCoord.x - 120, mnlCoord.y, 40, mnlCoord.x - 120, mnlCoord.y, Math.min(W * 0.32, 420));
      asiaGlow.addColorStop(0, "rgba(58, 160, 219, 0.25)");
      asiaGlow.addColorStop(0.55, "rgba(20, 53, 112, 0.15)");
      asiaGlow.addColorStop(1, "transparent");
      ctx.fillStyle = asiaGlow;
      ctx.beginPath();
      ctx.arc(mnlCoord.x - 120, mnlCoord.y, Math.min(W * 0.32, 420), 0, Math.PI * 2);
      ctx.fill();

      // 2. Render Full World Matrix (All Countries of Asia, Europe, Americas, Africa, Australia)
      var dotBaseSize = Math.max(1.3, Math.min(2.1, W / 650));

      // Batch Standard World Dots
      ctx.fillStyle = THEME.dotBase;
      ctx.beginPath();
      for (var i = 0; i < WORLD_DOTS.length; i++) {
        var dot = WORLD_DOTS[i];
        var px = startX + dot[0] * mapW;
        var py = startY + dot[1] * mapH;

        if (mouse.active && Math.hypot(px - mouse.x, py - mouse.y) < 70) continue;

        ctx.moveTo(px + dotBaseSize, py);
        ctx.arc(px, py, dotBaseSize, 0, Math.PI * 2);
      }
      ctx.fill();

      // Cursor Proximity Tactile Illumination
      if (mouse.active) {
        ctx.fillStyle = THEME.dotHighlight;
        ctx.beginPath();
        for (var i = 0; i < WORLD_DOTS.length; i++) {
          var dot = WORLD_DOTS[i];
          var px = startX + dot[0] * mapW;
          var py = startY + dot[1] * mapH;
          var dist = Math.hypot(px - mouse.x, py - mouse.y);
          if (dist < 70) {
            var sz = dotBaseSize * (1 + (1 - dist / 70) * 0.85);
            ctx.moveTo(px + sz, py);
            ctx.arc(px, py, sz, 0, Math.PI * 2);
          }
        }
        ctx.fill();
      }

      // 3. Graceful Global Innovation Flight Arcs (UK, Switzerland, Germany, US, Japan, Singapore -> Manila)
      ctx.lineCap = "round";
      for (var j = 0; j < GLOBAL_HUBS.length; j++) {
        var hub = GLOBAL_HUBS[j];
        var hp = project(hub.lon, hub.lat);
        activePins.push({ p: hub, x: hp.x, y: hp.y });

        // Node dot
        ctx.fillStyle = "#72c5f8";
        ctx.beginPath();
        ctx.arc(hp.x, hp.y, 3, 0, Math.PI * 2);
        ctx.fill();

        // High-altitude parabolic arc to Manila
        var distH = Math.hypot(mnlCoord.x - hp.x, mnlCoord.y - hp.y);
        var liftH = Math.min(115, Math.max(35, distH * 0.22));
        var stepsH = 42;
        var arcPts = [];

        for (var k = 0; k <= stepsH; k++) {
          var u = k / stepsH;
          var arch = 4 * u * (1 - u);
          var px = hp.x + (mnlCoord.x - hp.x) * u;
          var py = hp.y + (mnlCoord.y - hp.y) * u - arch * liftH;
          arcPts.push({ x: px, y: py });
        }

        // Draw Arc Path
        ctx.strokeStyle = THEME.arc;
        ctx.lineWidth = 1.35;
        ctx.beginPath();
        ctx.moveTo(arcPts[0].x, arcPts[0].y);
        for (var k = 1; k <= stepsH; k++) ctx.lineTo(arcPts[k].x, arcPts[k].y);
        ctx.stroke();

        // Traveling Innovation Comet
        var cycle = 2.6;
        var offset = j / GLOBAL_HUBS.length;
        var ph = (t / cycle + offset) % 1;
        var run = Math.min(1, ph / 0.72);
        var head = Math.floor(run * stepsH);

        for (var k = Math.max(0, head - 8); k < head; k++) {
          var a = arcPts[k], b = arcPts[k + 1];
          ctx.globalAlpha = (1 - (head - k) / 8) * 0.95;
          ctx.strokeStyle = THEME.comet;
          ctx.lineWidth = 2.4;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
      }

      // 4. Domestic Philippine Distribution Network (Luzon, Visayas, Mindanao with Location Pins)
      var phCoords = {};
      for (var p = 0; p < PH_HUBS.length; p++) {
        var ph = PH_HUBS[p];
        phCoords[ph.id] = project(ph.lon, ph.lat);
        activePins.push({ p: { name: ph.name, note: ph.sub }, x: phCoords[ph.id].x, y: phCoords[ph.id].y });
      }

      // Domestic Point-to-Point Lines between Luzon, Visayas, Mindanao
      for (var c = 0; c < PH_CORRIDORS.length; c++) {
        var corr = PH_CORRIDORS[c];
        var p1 = phCoords[corr[0]];
        var p2 = phCoords[corr[1]];
        if (!p1 || !p2) continue;

        ctx.strokeStyle = "rgba(114, 197, 248, 0.65)";
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();

        // Fast traveling distribution pulse
        var pPh = (t * 1.6 + c * 0.33) % 1;
        var pulseX = p1.x + (p2.x - p1.x) * pPh;
        var pulseY = p1.y + (p2.y - p1.y) * pPh;

        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(pulseX, pulseY, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Render Distinctive Location Pins on Luzon, Visayas, Mindanao (matching user reference photo)
      for (var p = 0; p < PH_HUBS.length; p++) {
        var ph = PH_HUBS[p];
        var pt = phCoords[ph.id];

        // Concentric Radar Arrival Shockwave Ring
        var ring = (t * 2.2 + p * 0.33) % 1;
        ctx.globalAlpha = 1 - ring;
        ctx.strokeStyle = "#72c5f8";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 5 + ring * 18, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;

        // Pin Beacon Dot
        ctx.fillStyle = ph.color;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 4.5, 0, Math.PI * 2);
        ctx.fill();

        // Pin Label Flag (LUZON, VISAYAS, MINDANAO)
        ctx.font = "bold 10px sans-serif";
        ctx.fillStyle = "#ffffff";
        ctx.fillText(ph.name, pt.x + 8, pt.y + 3);
      }

      ctx.globalAlpha = 1;
    }

    function tick(now) {
      raf = 0;
      if (!alive || !visible || document.hidden) return;
      draw(now);
      raf = requestAnimationFrame(tick);
    }

    function start() {
      if (!raf && alive) raf = requestAnimationFrame(tick);
    }

    // Interactive Hover Tooltips
    function onMove(e) {
      var rect = canvas.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;

      mouse.x = x;
      mouse.y = y;
      mouse.active = (x >= 0 && x <= W && y >= 0 && y <= H);

      var match = null;
      var minD = 22;
      for (var i = 0; i < activePins.length; i++) {
        var pin = activePins[i];
        var d = Math.hypot(pin.x - x, pin.y - y);
        if (d < minD) {
          minD = d;
          match = pin;
        }
      }

      if (match) {
        tipName.textContent = match.p.name;
        tipNote.textContent = match.p.note || '';
        tooltip.style.left = match.x + 'px';
        tooltip.style.top = match.y + 'px';
        tooltip.classList.remove('opacity-0');
      } else {
        tooltip.classList.add('opacity-0');
      }
    }

    function onLeave() {
      mouse.active = false;
      tooltip.classList.add('opacity-0');
    }

    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerleave', onLeave);

    var ro = new ResizeObserver(function () {
      resize();
      draw(performance.now());
    });
    ro.observe(container);

    var io = new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      if (visible) start();
    });
    io.observe(container);

    resize();
    start();
  }

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initAboutWorldMap);
    } else {
      initAboutWorldMap();
    }
  }
})();
"""

with open('assets/js/about-route-globe.js', 'w', encoding='utf-8') as f:
    f.write(header)

print("SUCCESS: Updated assets/js/about-route-globe.js with complete world map and Philippine network!")

