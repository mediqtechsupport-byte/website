import json

with open('scratch/world_dots_compact.json', 'r', encoding='utf-8') as f:
    world_dots = json.load(f)

with open('scratch/ph_dots.json', 'r', encoding='utf-8') as f:
    ph_dots = json.load(f)

with open('scratch/ph_mesh_edges.json', 'r', encoding='utf-8') as f:
    ph_edges = json.load(f)

with open('scratch/ph_islands_simplified.json', 'r', encoding='utf-8') as f:
    ph_islands = json.load(f)

js_content = """/**
 * About World Route & Prominent Philippines Healthcare Distribution Map
 * 1. True Edge-to-Edge World Map across entire viewport (all 258 countries).
 * 2. Prominent Philippines Archipelago Map centered perfectly in the right-side space
 *    (moved away from the far corner with balanced breathing room).
 * 3. Moving lines in both Northern and Southern hemispheres (active bottom routes from
 *    Sydney, Melbourne, Perth, Johannesburg, Singapore curving up into the Philippines).
 * 4. Translucent flight arcs running cleanly behind foreground text.
 * 5. Regional distribution hubs for LUZON, VISAYAS, and MINDANAO with active signal corridors.
 * Seamlessly blended into active WebGL silk waves shader and drifting smoke.
 */
(function () {
  'use strict';

  // 1. Complete World Geographic Dots (Edge-to-Edge)
  var WORLD_DOTS = """ + json.dumps(world_dots) + """;

  // 2. High-Resolution Philippines Island Polygons
  var PH_ISLANDS = """ + json.dumps(ph_islands) + """;

  // 3. Dense Philippine Island Dots (593 authentic geographic samples)
  var PH_DOTS = """ + json.dumps(ph_dots) + """;

  // 4. Philippine 3D Mesh Polygon Connections
  var PH_EDGES = """ + json.dumps(ph_edges) + """;

  // 5. Global Healthcare Innovation Partners (Northern & Southern Corridors)
  var GLOBAL_HUBS = [
    // Northern / Global Innovation Origins
    { name: "London, UK", lon: -0.13, lat: 51.50, note: "Rayner Global Headquarters", targetHub: "luzon" },
    { name: "Zurich, Switzerland", lon: 8.54, lat: 47.37, note: "Advanced Optical R&D Center", targetHub: "luzon" },
    { name: "Munich, Germany", lon: 11.58, lat: 48.14, note: "European Quality Assurance", targetHub: "luzon" },
    { name: "Tokyo, Japan", lon: 139.69, lat: 35.69, note: "Asia-Pacific Clinical Partners", targetHub: "luzon" },
    { name: "San Francisco, USA", lon: -122.42, lat: 37.77, note: "AI Spiral Technology Collaborations", targetHub: "luzon" },
    
    // Bottom Part Moving Lines Going Up into Philippines (Southern Corridors)
    { name: "Sydney, Australia", lon: 151.21, lat: -33.87, note: "Oceania Clinical Network", targetHub: "visayas" },
    { name: "Melbourne, Australia", lon: 144.96, lat: -37.81, note: "Asia-Pacific Regional Logistics", targetHub: "mindanao" },
    { name: "Perth, Australia", lon: 115.86, lat: -31.95, note: "Southern Hemisphere Distribution Corridor", targetHub: "mindanao" },
    { name: "Singapore", lon: 103.82, lat: 1.35, note: "Southeast Asia Regional Network", targetHub: "visayas" },
    { name: "Johannesburg, South Africa", lon: 28.04, lat: -26.20, note: "Global Distribution Node", targetHub: "mindanao" }
  ];

  // 6. Philippine Regional Distribution Hubs (Luzon, Visayas, Mindanao)
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
    worldDot: "rgba(114, 197, 248, 0.30)",
    dotHighlight: "#ffffff",
    arc: "rgba(114, 197, 248, 0.18)",
    comet: "#72c5f8",
    phIslandFill: "rgba(58, 160, 219, 0.10)",
    phIslandStroke: "rgba(114, 197, 248, 0.40)",
    phMeshEdge: "rgba(58, 160, 219, 0.20)",
    phDot: "rgba(148, 215, 255, 0.85)"
  };

  function initAboutWorldMap() {
    var container = document.getElementById('about-interactive-stage');
    if (!container) return;

    var existingCanvas = container.querySelector('.route-world-canvas');
    if (existingCanvas) existingCanvas.remove();
    var existingTooltip = container.querySelector('.route-world-tooltip');
    if (existingTooltip) existingTooltip.remove();

    var canvas = document.createElement('canvas');
    canvas.className = 'route-world-canvas absolute inset-0 w-full h-full block z-10 pointer-events-auto';
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

    // Full-Bleed Edge-to-Edge World Coordinate Projection
    function projectWorld(lon, lat) {
      var nx = (lon + 180) / 360;
      var ny = (76 - lat) / 138;
      return {
        x: nx * W,
        y: ny * H
      };
    }

    // Centered Philippines Bounding Box (Shifted away from the far right edge to the center of the right half)
    function getPHBox() {
      var isMobile = W < 768;
      if (isMobile) {
        return {
          x: W * 0.35,
          y: H * 0.22,
          w: W * 0.58,
          h: H * 0.68
        };
      }
      var h = Math.min(H * 0.82, 750);
      var w = Math.min(W * 0.27, 450);
      // Center in the right-side zone between text (x ~ 0.46W) and right border (x ~ 0.96W)
      var rightZoneCenter = (W * 0.46 + W * 0.96) / 2;
      var x = rightZoneCenter - w / 2;
      var y = (H - h) / 2 + 10;
      return { x: x, y: y, w: w, h: h };
    }

    // High-Detail Philippines Coordinate Projection
    function projectPH(lon, lat, box) {
      var nx = (lon - 117.0) / 9.6;
      var ny = (19.5 - lat) / 14.3;
      return {
        x: box.x + nx * box.w,
        y: box.y + ny * box.h
      };
    }

    function draw(now) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      var t = (now - t0) / 1000;
      activePins = [];
      var phBox = getPHBox();

      // Regional hub positions
      var phHubCoords = {
        luzon: projectPH(120.98, 14.60, phBox),
        visayas: projectPH(123.89, 10.31, phBox),
        mindanao: projectPH(125.61, 7.07, phBox)
      };

      // =======================================================================
      // 1. EDGE-TO-EDGE WORLD MAP (All 258 Countries, Zero Margins/Crop)
      // =======================================================================
      var dotSize = Math.max(1.15, Math.min(1.85, W / 950));

      ctx.fillStyle = THEME.worldDot;
      ctx.beginPath();
      for (var i = 0; i < WORLD_DOTS.length; i++) {
        var dot = WORLD_DOTS[i];
        var px = dot[0] * W;
        var py = dot[1] * H;

        // Skip dots inside hover spotlight for tactile reaction
        if (mouse.active && Math.hypot(px - mouse.x, py - mouse.y) < 65) continue;

        ctx.moveTo(px + dotSize, py);
        ctx.arc(px, py, dotSize, 0, Math.PI * 2);
      }
      ctx.fill();

      // Interactive Cursor Proximity Highlight
      if (mouse.active) {
        ctx.fillStyle = THEME.dotHighlight;
        ctx.beginPath();
        for (var i = 0; i < WORLD_DOTS.length; i++) {
          var dot = WORLD_DOTS[i];
          var px = dot[0] * W;
          var py = dot[1] * H;
          var dist = Math.hypot(px - mouse.x, py - mouse.y);
          if (dist < 65) {
            var sz = dotSize * (1 + (1 - dist / 65) * 0.8);
            ctx.moveTo(px + sz, py);
            ctx.arc(px, py, sz, 0, Math.PI * 2);
          }
        }
        ctx.fill();
      }

      // =======================================================================
      // 2. GLOBAL FLIGHT ARCS & TRANSLUCENT COMETS (Northern & Southern Routes)
      // =======================================================================
      ctx.lineCap = "round";
      for (var j = 0; j < GLOBAL_HUBS.length; j++) {
        var hub = GLOBAL_HUBS[j];
        var hp = projectWorld(hub.lon, hub.lat);
        var targetCoord = phHubCoords[hub.targetHub || 'luzon'] || phHubCoords.luzon;
        activePins.push({ p: hub, x: hp.x, y: hp.y });

        // World Hub Node
        ctx.fillStyle = "rgba(114, 197, 248, 0.65)";
        ctx.beginPath();
        ctx.arc(hp.x, hp.y, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Parabolic trajectory swooping from World Origin to Philippines target
        var distH = Math.hypot(targetCoord.x - hp.x, targetCoord.y - hp.y);
        var liftH = Math.min(105, Math.max(30, distH * 0.18));
        var stepsH = 40;
        var arcPts = [];

        // For southern routes (coming from bottom), curve naturally upward
        for (var k = 0; k <= stepsH; k++) {
          var u = k / stepsH;
          var arch = 4 * u * (1 - u);
          var ax = hp.x + (targetCoord.x - hp.x) * u;
          var ay = hp.y + (targetCoord.y - hp.y) * u - arch * liftH;
          arcPts.push({ x: ax, y: ay });
        }

        // Draw Translucent Arc Path (subtle, non-distracting)
        ctx.strokeStyle = THEME.arc;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(arcPts[0].x, arcPts[0].y);
        for (var k = 1; k <= stepsH; k++) ctx.lineTo(arcPts[k].x, arcPts[k].y);
        ctx.stroke();

        // Translucent Traveling Innovation Comet (max alpha 0.32, soft & subtle)
        var cycle = 2.8;
        var offset = j / GLOBAL_HUBS.length;
        var ph = (t / cycle + offset) % 1;
        var run = Math.min(1, ph / 0.72);
        var head = Math.floor(run * stepsH);

        for (var k = Math.max(0, head - 7); k < head; k++) {
          var a = arcPts[k], b = arcPts[k + 1];
          ctx.globalAlpha = (1 - (head - k) / 7) * 0.32;
          ctx.strokeStyle = THEME.comet;
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
      }

      // =======================================================================
      // 3. SOFT BACKDROP VIGNETTE UNDER TYPOGRAPHY
      // Softens any flight lines passing behind the text to ensure 100% legibility
      // =======================================================================
      var textVignette = ctx.createRadialGradient(W * 0.22, H * 0.50, 40, W * 0.22, H * 0.50, Math.max(W * 0.44, 480));
      textVignette.addColorStop(0, "rgba(10, 29, 64, 0.82)");
      textVignette.addColorStop(0.55, "rgba(10, 29, 64, 0.55)");
      textVignette.addColorStop(0.85, "rgba(10, 29, 64, 0.18)");
      textVignette.addColorStop(1, "transparent");
      ctx.fillStyle = textVignette;
      ctx.beginPath();
      ctx.arc(W * 0.22, H * 0.50, Math.max(W * 0.44, 480), 0, Math.PI * 2);
      ctx.fill();

      // =======================================================================
      // 4. PROMINENT PHILIPPINES ARCHIPELAGO MAP (Centered in Right Zone)
      // =======================================================================
      // 4A. Luminous Nebula Aura behind the Philippines
      var phCenterX = phBox.x + phBox.w * 0.52;
      var phCenterY = phBox.y + phBox.h * 0.52;
      var phAura = ctx.createRadialGradient(phCenterX, phCenterY, 30, phCenterX, phCenterY, Math.max(phBox.w, phBox.h) * 0.68);
      phAura.addColorStop(0, "rgba(58, 160, 219, 0.22)");
      phAura.addColorStop(0.55, "rgba(20, 53, 112, 0.14)");
      phAura.addColorStop(1, "transparent");
      ctx.fillStyle = phAura;
      ctx.beginPath();
      ctx.arc(phCenterX, phCenterY, Math.max(phBox.w, phBox.h) * 0.68, 0, Math.PI * 2);
      ctx.fill();

      // 4B. Authentic Island Boundaries (Luzon, Visayas, Mindanao, Palawan)
      ctx.fillStyle = THEME.phIslandFill;
      ctx.strokeStyle = THEME.phIslandStroke;
      ctx.lineWidth = 1.0;
      for (var r = 0; r < PH_ISLANDS.length; r++) {
        var island = PH_ISLANDS[r];
        if (island.length < 3) continue;
        ctx.beginPath();
        var p0 = projectPH(island[0][0], island[0][1], phBox);
        ctx.moveTo(p0.x, p0.y);
        for (var k = 1; k < island.length; k++) {
          var pk = projectPH(island[k][0], island[k][1], phBox);
          ctx.lineTo(pk.x, pk.y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }

      // 4C. 3D Mesh Polygon Connections (Vecteezy #46019119 style)
      ctx.strokeStyle = THEME.phMeshEdge;
      ctx.lineWidth = 0.75;
      ctx.beginPath();
      for (var e = 0; e < PH_EDGES.length; e++) {
        var edge = PH_EDGES[e];
        var d1 = PH_DOTS[edge[0]];
        var d2 = PH_DOTS[edge[1]];
        var pt1 = projectPH(d1[0], d1[1], phBox);
        var pt2 = projectPH(d2[0], d2[1], phBox);
        ctx.moveTo(pt1.x, pt1.y);
        ctx.lineTo(pt2.x, pt2.y);
      }
      ctx.stroke();

      // 4D. Glowing Blue Dots across Philippine Archipelago
      var phDotRadius = Math.max(1.2, Math.min(1.8, phBox.w / 220));
      ctx.fillStyle = THEME.phDot;
      ctx.beginPath();
      for (var n = 0; n < PH_DOTS.length; n++) {
        var pd = PH_DOTS[n];
        var pp = projectPH(pd[0], pd[1], phBox);
        ctx.moveTo(pp.x + phDotRadius, pp.y);
        ctx.arc(pp.x, pp.y, phDotRadius, 0, Math.PI * 2);
      }
      ctx.fill();

      // =======================================================================
      // 5. REGIONAL HUBS: LUZON, VISAYAS, MINDANAO & DISTRIBUTION CORRIDORS
      // =======================================================================
      for (var p = 0; p < PH_HUBS.length; p++) {
        var hub = PH_HUBS[p];
        activePins.push({ p: { name: hub.name, note: hub.sub }, x: phHubCoords[hub.id].x, y: phHubCoords[hub.id].y });
      }

      // Domestic Distribution Corridors
      for (var c = 0; c < PH_CORRIDORS.length; c++) {
        var corr = PH_CORRIDORS[c];
        var p1 = phHubCoords[corr[0]];
        var p2 = phHubCoords[corr[1]];
        if (!p1 || !p2) continue;

        ctx.strokeStyle = "rgba(114, 197, 248, 0.45)";
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();

        // Animated Courier Distribution Pulse
        var pPh = (t * 1.5 + c * 0.33) % 1;
        var pulseX = p1.x + (p2.x - p1.x) * pPh;
        var pulseY = p1.y + (p2.y - p1.y) * pPh;

        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(pulseX, pulseY, 2.4, 0, Math.PI * 2);
        ctx.fill();
      }

      // Render Prominent Hub Pins with Radar Shockwave Rings & Labels
      for (var p = 0; p < PH_HUBS.length; p++) {
        var hub = PH_HUBS[p];
        var pt = phHubCoords[hub.id];

        // Animated Sonar Arrival Wave
        var ring = (t * 2.0 + p * 0.33) % 1;
        ctx.globalAlpha = (1 - ring) * 0.75;
        ctx.strokeStyle = hub.color;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 4 + ring * 16, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;

        // Glowing Pin Beacon
        ctx.fillStyle = hub.color;
        ctx.shadowColor = "#72c5f8";
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Pin Label Flag (LUZON, VISAYAS, MINDANAO)
        ctx.font = "bold 11px system-ui, -apple-system, sans-serif";
        ctx.fillStyle = "#ffffff";
        ctx.fillText(hub.name, pt.x + 9, pt.y + 4);
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

    var slideEl = container.closest('.about-slide');
    if (slideEl) {
      var obs = new MutationObserver(function () {
        var isVis = !slideEl.classList.contains('opacity-0') && slideEl.classList.contains('opacity-100');
        if (isVis !== visible) {
          visible = isVis;
          if (visible) start();
          else if (raf) { cancelAnimationFrame(raf); raf = 0; }
        }
      });
      obs.observe(slideEl, { attributes: true, attributeFilter: ['class'] });
    }

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        if (raf) { cancelAnimationFrame(raf); raf = 0; }
      } else if (visible) {
        start();
      }
    });

    resize();
    start();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAboutWorldMap);
  } else {
    initAboutWorldMap();
  }
})();
"""

with open('assets/js/about-route-globe.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

print(f"Successfully generated assets/js/about-route-globe.js ({len(js_content)} bytes)")
