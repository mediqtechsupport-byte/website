/**
 * Interactive 3D Route Globe & Orbital Stage Controller (#distribution Slide 1)
 * - High-DPI Canvas 2D 3D orthographic spherical projection (zero extra WebGL contexts)
 * - Reuses preloaded window.MEDIQ_WORLD_DOTS & window.MEDIQ_PH_ISLANDS for instant offline readiness
 * - Drag-to-spin with angular inertia, hub proximity raycasting, coordinate HUD & orbital stage sync
 */
(function () {
  'use strict';

  var DEG = Math.PI / 180;

  var GLOBAL_ORIGINS = [
    {
      id: 'uk',
      name: 'United Kingdom',
      note: 'Authorized IOL Principal Origin',
      lat: 51.5,
      lon: -0.13,
      stage: 0,
      target: 'manila',
      peak: 0.24
    },
    {
      id: 'ch',
      name: 'Switzerland',
      note: 'European Medical Sourcing Corridor',
      lat: 47.37,
      lon: 8.54,
      stage: 0,
      target: 'manila',
      peak: 0.22
    },
    {
      id: 'de',
      name: 'Germany',
      note: 'European Regulatory Supply Origin',
      lat: 48.14,
      lon: 11.58,
      stage: 0,
      target: 'manila',
      peak: 0.21
    },
    {
      id: 'jp',
      name: 'Japan',
      note: 'Asia-Pacific Manufacturing Origin',
      lat: 35.69,
      lon: 139.69,
      stage: 1,
      target: 'manila',
      peak: 0.14
    },
    {
      id: 'sg',
      name: 'Singapore',
      note: 'ASEAN Customs & Transit Corridor',
      lat: 1.35,
      lon: 103.82,
      stage: 1,
      target: 'cebu',
      peak: 0.13
    },
    {
      id: 'au',
      name: 'Sydney, Australia',
      note: 'Oceania Logistics Corridor',
      lat: -33.87,
      lon: 151.21,
      stage: 1,
      target: 'davao',
      peak: 0.2
    },
    {
      id: 'us',
      name: 'United States',
      note: 'Trans-Pacific Sourcing Origin',
      lat: 37.77,
      lon: -122.42,
      stage: 0,
      target: 'manila',
      peak: 0.28
    }
  ];

  var PH_HUBS = [
    {
      id: 'manila',
      name: 'Manila · Luzon Hub',
      note: 'Primary Customs Entry & Central Inventory',
      lat: 14.6,
      lon: 120.98,
      stage: 2,
      isPrimary: true
    },
    {
      id: 'cebu',
      name: 'Cebu · Visayas Hub',
      note: 'Visayas Institutional Dispatch Corridor',
      lat: 10.31,
      lon: 123.89,
      stage: 3,
      isPrimary: false
    },
    {
      id: 'davao',
      name: 'Davao · Mindanao Hub',
      note: 'Mindanao Institutional Supply Corridor',
      lat: 7.07,
      lon: 125.61,
      stage: 3,
      isPrimary: false
    }
  ];

  var DOMESTIC_LINKS = [
    { from: 'manila', to: 'cebu', peak: 0.08, stage: 3 },
    { from: 'cebu', to: 'davao', peak: 0.07, stage: 3 },
    { from: 'manila', to: 'davao', peak: 0.1, stage: 3 }
  ];

  // Camera orientation targets (rotLng brings longitude to center; rotLat tilts pitch)
  var STAGE_PRESETS = [
    { rotLng: -38, rotLat: -28, label: '01 · SOURCING ORIGINS (GLOBAL -> PH)' },
    { rotLng: -102, rotLat: -22, label: '02 · IMPORTATION CORRIDORS (CUSTOMS ENTRY)' },
    { rotLng: -120, rotLat: -16, label: '03 · INVENTORY AVAILABILITY (MANILA HUB)' },
    { rotLng: -122, rotLat: -12, label: '04 · NATIONAL DISPATCH (LUZON - VISAYAS - MINDANAO)' }
  ];

  function toUnitVec(latDeg, lonDeg) {
    var phi = latDeg * DEG;
    var lam = lonDeg * DEG;
    var cosPhi = Math.cos(phi);
    return [cosPhi * Math.sin(lam), Math.sin(phi), cosPhi * Math.cos(lam)];
  }

  function slerpVec(a, b, t) {
    var dot = Math.max(-1, Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]));
    var omega = Math.acos(dot);
    if (omega < 1e-4) {
      return [
        a[0] + (b[0] - a[0]) * t,
        a[1] + (b[1] - a[1]) * t,
        a[2] + (b[2] - a[2]) * t
      ];
    }
    var sinO = Math.sin(omega);
    var s0 = Math.sin((1 - t) * omega) / sinO;
    var s1 = Math.sin(t * omega) / sinO;
    return [a[0] * s0 + b[0] * s1, a[1] * s0 + b[1] * s1, a[2] * s0 + b[2] * s1];
  }

  function rotateVec(v, rotLngDeg, rotLatDeg) {
    var lam0 = rotLngDeg * DEG;
    var phi0 = -rotLatDeg * DEG;
    var cosL = Math.cos(lam0);
    var sinL = Math.sin(lam0);
    // Spin around Y by rotLngDeg
    var x1 = v[0] * cosL + v[2] * sinL;
    var y1 = v[1];
    var z1 = -v[0] * sinL + v[2] * cosL;
    // Tilt around X by phi0
    var cosP = Math.cos(phi0);
    var sinP = Math.sin(phi0);
    return [x1, y1 * cosP - z1 * sinP, y1 * sinP + z1 * cosP];
  }

  function initDistributionGlobe() {
    var stage = document.getElementById('dist-globe-stage');
    var canvas = document.getElementById('dist-globe-canvas');
    var slide = document.querySelector('#distribution .deck-slide[data-deck="services"][data-slide-index="1"]');
    var section = document.getElementById('distribution');
    if (!stage || !canvas || !slide || !section) return;

    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    var tooltip = document.getElementById('dist-globe-tooltip');
    var tipTitle = document.getElementById('dist-tip-title');
    var tipNote = document.getElementById('dist-tip-note');
    var tipCoord = document.getElementById('dist-tip-coord');
    var coordReadout = document.getElementById('dist-globe-coord');
    var resetBtn = document.getElementById('dist-globe-reset');
    var stageBtns = Array.prototype.slice.call(document.querySelectorAll('#distribution [data-dist-stage]'));

    var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Build pre-cached unit vectors for continental dots
    var dotVecs = [];
    if (Array.isArray(window.MEDIQ_WORLD_DOTS) && window.MEDIQ_WORLD_DOTS.length) {
      var src = window.MEDIQ_WORLD_DOTS;
      for (var i = 0; i < src.length; i++) {
        var lon = src[i][0] * 360 - 180;
        var lat = 76 - src[i][1] * 138;
        var inPH = lon >= 116.5 && lon <= 127.0 && lat >= 4.5 && lat <= 21.0;
        dotVecs.push({ v: toUnitVec(lat, lon), isPH: inPH });
      }
    } else {
      // Sparse fallback spherical dots if window.MEDIQ_WORLD_DOTS loads later
      for (var la = -60; la <= 60; la += 15) {
        for (var lo = -165; lo <= 165; lo += 15) {
          dotVecs.push({ v: toUnitVec(la, lo), isPH: false });
        }
      }
    }

    var allHubs = GLOBAL_ORIGINS.concat(PH_HUBS);
    var hubById = {};
    for (var h = 0; h < allHubs.length; h++) {
      allHubs[h].vec = toUnitVec(allHubs[h].lat, allHubs[h].lon);
      hubById[allHubs[h].id] = allHubs[h];
    }

    var routes = [];
    for (var g = 0; g < GLOBAL_ORIGINS.length; g++) {
      var orig = GLOBAL_ORIGINS[g];
      var dest = hubById[orig.target] || hubById.manila;
      routes.push({
        from: orig,
        to: dest,
        peak: orig.peak,
        stage: orig.stage,
        phase: g * 0.145,
        speed: 0.24 + (g % 3) * 0.04,
        isDomestic: false
      });
    }
    for (var dl = 0; dl < DOMESTIC_LINKS.length; dl++) {
      var link = DOMESTIC_LINKS[dl];
      routes.push({
        from: hubById[link.from],
        to: hubById[link.to],
        peak: link.peak,
        stage: link.stage,
        phase: 0.2 + dl * 0.31,
        speed: 0.34,
        isDomestic: true
      });
    }

    var st = {
      W: 380,
      H: 340,
      dpr: 1,
      cx: 190,
      cy: 170,
      R: 132,
      rotLng: -96,
      rotLat: -19,
      velLng: 0,
      velLat: 0,
      targetLng: null,
      targetLat: null,
      dragging: false,
      dragStartX: 0,
      dragStartY: 0,
      dragStartLng: 0,
      dragStartLat: 0,
      pointerX: -9999,
      pointerY: -9999,
      hoverHub: null,
      activeStage: -1,
      active: false,
      inView: false,
      rafId: 0,
      lastTs: 0,
      elapsed: 0
    };

    function formatCoord(lat, lon) {
      var ns = lat >= 0 ? 'N' : 'S';
      var ew = lon >= 0 ? 'E' : 'W';
      return Math.abs(lat).toFixed(1) + '°' + ns + ' · ' + Math.abs(lon).toFixed(1) + '°' + ew;
    }

    function updateStageUI(stageIdx) {
      st.activeStage = stageIdx;
      for (var i = 0; i < stageBtns.length; i++) {
        var btn = stageBtns[i];
        var idx = parseInt(btn.getAttribute('data-dist-stage'), 10);
        btn.classList.toggle('is-stage-active', idx === stageIdx);
      }
      if (coordReadout) {
        coordReadout.textContent =
          stageIdx >= 0 && STAGE_PRESETS[stageIdx]
            ? STAGE_PRESETS[stageIdx].label
            : 'COOR: ' + formatCoord(-st.rotLat, (((-st.rotLng + 540) % 360) - 180));
      }
    }

    function focusStage(stageIdx) {
      var preset = STAGE_PRESETS[stageIdx];
      if (!preset) return;
      st.targetLng = preset.rotLng;
      st.targetLat = preset.rotLat;
      st.velLng = 0;
      st.velLat = 0;
      updateStageUI(stageIdx);
    }

    for (var sb = 0; sb < stageBtns.length; sb++) {
      (function (btn) {
        var idx = parseInt(btn.getAttribute('data-dist-stage'), 10);
        btn.addEventListener('mouseenter', function () {
          focusStage(idx);
        });
        btn.addEventListener('click', function () {
          focusStage(idx);
        });
        btn.addEventListener('focus', function () {
          focusStage(idx);
        });
      })(stageBtns[sb]);
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        st.targetLng = -108;
        st.targetLat = -18;
        st.velLng = 0;
        st.velLat = 0;
        updateStageUI(-1);
      });
    }

    function resize() {
      st.dpr = Math.min(window.devicePixelRatio || 1, 2);
      st.W = stage.clientWidth || 380;
      st.H = stage.clientHeight || 340;
      canvas.width = Math.max(1, Math.round(st.W * st.dpr));
      canvas.height = Math.max(1, Math.round(st.H * st.dpr));
      st.cx = st.W * 0.5;
      st.cy = st.H * 0.5;
      st.R = Math.max(96, Math.min(st.W * 0.41, st.H * 0.43, 168));
    }

    function projectUnit(v, altitude) {
      var r = rotateVec(v, st.rotLng, st.rotLat);
      var rad = st.R * (altitude || 1);
      return {
        x: st.cx + r[0] * rad,
        y: st.cy - r[1] * rad,
        z: r[2]
      };
    }

    function drawGreatCircleRoute(rt, frontPass) {
      var a = rt.from.vec;
      var b = rt.to.vec;
      var steps = 28;
      var stageMatch = st.activeStage < 0 || rt.stage === st.activeStage;
      var isHubMatch = st.hoverHub && (st.hoverHub.id === rt.from.id || st.hoverHub.id === rt.to.id);
      var emphasized = isHubMatch || (st.activeStage >= 0 && rt.stage === st.activeStage);

      var pts = [];
      for (var i = 0; i <= steps; i++) {
        var t = i / steps;
        var sv = slerpVec(a, b, t);
        var alt = 1 + rt.peak * Math.sin(Math.PI * t);
        pts.push(projectUnit(sv, alt));
      }

      ctx.beginPath();
      var pen = false;
      for (var j = 0; j < pts.length; j++) {
        var pt = pts[j];
        var onSide = frontPass ? pt.z >= -0.05 : pt.z < 0.05;
        if (onSide) {
          if (!pen) {
            ctx.moveTo(pt.x, pt.y);
            pen = true;
          } else {
            ctx.lineTo(pt.x, pt.y);
          }
        } else {
          pen = false;
        }
      }

      if (frontPass) {
        ctx.strokeStyle = emphasized
          ? 'rgba(191, 236, 255, 0.92)'
          : stageMatch
          ? 'rgba(114, 197, 248, 0.52)'
          : 'rgba(114, 197, 248, 0.16)';
        ctx.lineWidth = emphasized ? 2.0 : 1.15;
      } else {
        ctx.strokeStyle = emphasized ? 'rgba(114, 197, 248, 0.16)' : 'rgba(58, 160, 219, 0.08)';
        ctx.lineWidth = 0.85;
      }
      ctx.stroke();

      // Animated pulse comet along geodesic arc (front side only for clean clarity)
      if (frontPass && !reducedMotion && stageMatch) {
        var cometT = (st.elapsed * rt.speed + rt.phase) % 1;
        var cv = slerpVec(a, b, cometT);
        var cAlt = 1 + rt.peak * Math.sin(Math.PI * cometT);
        var cp = projectUnit(cv, cAlt);
        if (cp.z >= -0.04) {
          var tailT = Math.max(0, cometT - 0.11);
          var tv = slerpVec(a, b, tailT);
          var tAlt = 1 + rt.peak * Math.sin(Math.PI * tailT);
          var tp = projectUnit(tv, tAlt);
          var grad = ctx.createLinearGradient(tp.x, tp.y, cp.x, cp.y);
          grad.addColorStop(0, 'rgba(114, 197, 248, 0)');
          grad.addColorStop(1, 'rgba(224, 247, 255, 0.95)');
          ctx.beginPath();
          ctx.moveTo(tp.x, tp.y);
          ctx.lineTo(cp.x, cp.y);
          ctx.strokeStyle = grad;
          ctx.lineWidth = emphasized ? 2.8 : 2.1;
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(cp.x, cp.y, emphasized ? 3.2 : 2.3, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = '#72c5f8';
          ctx.shadowBlur = 10;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }
    }

    function drawFrame() {
      ctx.setTransform(st.dpr, 0, 0, st.dpr, 0, 0);
      ctx.clearRect(0, 0, st.W, st.H);

      var cx = st.cx;
      var cy = st.cy;
      var R = st.R;

      // 1. Subtle outer atmosphere aura
      var aura = ctx.createRadialGradient(cx, cy, R * 0.55, cx, cy, R * 1.48);
      aura.addColorStop(0, 'rgba(58, 160, 219, 0.14)');
      aura.addColorStop(0.55, 'rgba(14, 53, 108, 0.08)');
      aura.addColorStop(1, 'rgba(4, 13, 33, 0)');
      ctx.fillStyle = aura;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.48, 0, Math.PI * 2);
      ctx.fill();

      // 2. Back half of outer slanted orbital trajectory rings (behind sphere)
      var ringAngles = [-0.42, 0.34];
      for (var ra = 0; ra < ringAngles.length; ra++) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(ringAngles[ra]);
        ctx.beginPath();
        ctx.ellipse(0, 0, R * 1.24, R * 0.36, 0, Math.PI, Math.PI * 2);
        ctx.strokeStyle = 'rgba(114, 197, 248, 0.18)';
        ctx.lineWidth = 1.05;
        ctx.stroke();
        ctx.restore();
      }

      // 3. Back hemisphere routes + dots (soft translucent depth)
      for (var br = 0; br < routes.length; br++) {
        drawGreatCircleRoute(routes[br], false);
      }

      // 4. Translucent Glass Sphere Base
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      var sphereGrad = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.32, R * 0.08, cx, cy, R);
      sphereGrad.addColorStop(0, 'rgba(22, 62, 118, 0.42)');
      sphereGrad.addColorStop(0.58, 'rgba(7, 24, 56, 0.68)');
      sphereGrad.addColorStop(0.88, 'rgba(4, 14, 34, 0.82)');
      sphereGrad.addColorStop(1, 'rgba(114, 197, 248, 0.16)');
      ctx.fillStyle = sphereGrad;
      ctx.fill();

      // Clip inside globe perimeter for meridian grid & surface dots
      ctx.clip();

      // 5. Coordinate Graticule (20 deg parallels & meridians)
      ctx.beginPath();
      for (var lo = -180; lo < 180; lo += 20) {
        var penLo = false;
        for (var la = -80; la <= 80; la += 8) {
          var vp = projectUnit(toUnitVec(la, lo), 1);
          if (vp.z >= 0) {
            if (!penLo) {
              ctx.moveTo(vp.x, vp.y);
              penLo = true;
            } else {
              ctx.lineTo(vp.x, vp.y);
            }
          } else {
            penLo = false;
          }
        }
      }
      for (var latG = -60; latG <= 60; latG += 20) {
        var penLa = false;
        for (var lonG = -180; lonG <= 180; lonG += 8) {
          var hp = projectUnit(toUnitVec(latG, lonG), 1);
          if (hp.z >= 0) {
            if (!penLa) {
              ctx.moveTo(hp.x, hp.y);
              penLa = true;
            } else {
              ctx.lineTo(hp.x, hp.y);
            }
          } else {
            penLa = false;
          }
        }
      }
      ctx.strokeStyle = 'rgba(114, 197, 248, 0.09)';
      ctx.lineWidth = 0.75;
      ctx.stroke();

      // 6. Continental Halftone Dots (back & front depth pass)
      for (var d = 0; d < dotVecs.length; d++) {
        var dv = dotVecs[d];
        var dp = projectUnit(dv.v, 1);
        if (dp.z < -0.15) {
          ctx.fillStyle = 'rgba(114, 197, 248, 0.09)';
          ctx.fillRect(dp.x - 0.8, dp.y - 0.8, 1.5, 1.5);
        } else if (dp.z >= 0) {
          var depthAlpha = 0.28 + dp.z * 0.52;
          if (dv.isPH) {
            ctx.fillStyle = 'rgba(255, 255, 255, ' + Math.min(1, depthAlpha + 0.3) + ')';
            ctx.beginPath();
            ctx.arc(dp.x, dp.y, 1.85, 0, Math.PI * 2);
            ctx.fill();
          } else {
            ctx.fillStyle = 'rgba(148, 215, 255, ' + depthAlpha.toFixed(2) + ')';
            ctx.beginPath();
            ctx.arc(dp.x, dp.y, 1.2 + dp.z * 0.35, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      ctx.restore();

      // 7. Crisp Glass Horizon Rim
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(114, 197, 248, 0.42)';
      ctx.lineWidth = 1.25;
      ctx.stroke();

      // Specular crescent top-left highlight
      ctx.beginPath();
      ctx.arc(cx, cy, R - 1, Math.PI * 1.06, Math.PI * 1.44);
      ctx.strokeStyle = 'rgba(224, 246, 255, 0.38)';
      ctx.lineWidth = 1.8;
      ctx.stroke();

      // 8. Front hemisphere geodesic arcs & traveling pulses
      for (var fr = 0; fr < routes.length; fr++) {
        drawGreatCircleRoute(routes[fr], true);
      }

      // 9. Front half of slanted orbital trajectory rings + orbiting beacon beads
      for (var fa = 0; fa < ringAngles.length; fa++) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(ringAngles[fa]);
        ctx.beginPath();
        ctx.ellipse(0, 0, R * 1.24, R * 0.36, 0, 0, Math.PI);
        ctx.strokeStyle = 'rgba(114, 197, 248, 0.48)';
        ctx.lineWidth = 1.25;
        ctx.stroke();

        if (!reducedMotion) {
          var theta = st.elapsed * (fa === 0 ? 0.55 : -0.45) + fa * 2.1;
          var bx = Math.cos(theta) * R * 1.24;
          var by = Math.sin(theta) * R * 0.36;
          if (Math.sin(theta) >= -0.08) {
            ctx.beginPath();
            ctx.arc(bx, by, 3.0, 0, Math.PI * 2);
            ctx.fillStyle = '#e0f6ff';
            ctx.shadowColor = '#72c5f8';
            ctx.shadowBlur = 12;
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        }
        ctx.restore();
      }

      // 10. Hit-test & draw interactive Hub Nodes (Origins + Philippine Hubs)
      var nearestHub = null;
      var nearestDist = 18;
      for (var k = 0; k < allHubs.length; k++) {
        var hub = allHubs[k];
        var hpProj = projectUnit(hub.vec, 1.005);
        if (hpProj.z < 0.02) continue;

        var dPtr = Math.hypot(st.pointerX - hpProj.x, st.pointerY - hpProj.y);
        if (dPtr < nearestDist) {
          nearestDist = dPtr;
          nearestHub = { hub: hub, x: hpProj.x, y: hpProj.y };
        }

        var isPrimary = !!hub.isPrimary;
        var isHovered = st.hoverHub && st.hoverHub.id === hub.id;
        var pulseR = isPrimary ? 5.5 + Math.sin(st.elapsed * 3.2) * 2.2 : 4.0;

        if (isPrimary || isHovered) {
          ctx.beginPath();
          ctx.arc(hpProj.x, hpProj.y, pulseR + 3, 0, Math.PI * 2);
          ctx.strokeStyle = isPrimary ? 'rgba(255, 255, 255, 0.55)' : 'rgba(114, 197, 248, 0.72)';
          ctx.lineWidth = 1.1;
          ctx.stroke();
        }

        ctx.beginPath();
        ctx.arc(hpProj.x, hpProj.y, isPrimary ? 3.8 : isHovered ? 4.2 : 2.6, 0, Math.PI * 2);
        ctx.fillStyle = isPrimary || isHovered ? '#ffffff' : '#72c5f8';
        ctx.shadowColor = '#72c5f8';
        ctx.shadowBlur = isPrimary || isHovered ? 12 : 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      if (nearestHub && !st.dragging) {
        st.hoverHub = nearestHub.hub;
        canvas.style.cursor = 'pointer';
        if (tooltip && tipTitle && tipNote && tipCoord) {
          tipTitle.textContent = nearestHub.hub.name;
          tipNote.textContent = nearestHub.hub.note;
          tipCoord.textContent = formatCoord(nearestHub.hub.lat, nearestHub.hub.lon);
          tooltip.style.left = Math.max(76, Math.min(st.W - 76, nearestHub.x)) + 'px';
          tooltip.style.top = Math.max(54, nearestHub.y - 12) + 'px';
          tooltip.style.opacity = '1';
        }
      } else {
        st.hoverHub = null;
        canvas.style.cursor = st.dragging ? 'grabbing' : 'grab';
        if (tooltip) tooltip.style.opacity = '0';
      }
    }

    function tick(ts) {
      if (!st.active) {
        st.rafId = 0;
        return;
      }
      if (!st.lastTs) st.lastTs = ts;
      var dt = Math.min(0.05, Math.max(0.001, (ts - st.lastTs) / 1000));
      st.lastTs = ts;
      st.elapsed += dt;

      if (!st.dragging) {
        if (st.targetLng !== null && st.targetLat !== null) {
          var ease = 1 - Math.exp(-dt * 5.2);
          var diffLng = ((st.targetLng - st.rotLng + 540) % 360) - 180;
          st.rotLng += diffLng * ease;
          st.rotLat += (st.targetLat - st.rotLat) * ease;
          if (Math.abs(diffLng) < 0.25 && Math.abs(st.targetLat - st.rotLat) < 0.25) {
            st.targetLng = null;
            st.targetLat = null;
          }
        } else {
          // Apply gentle rotational inertia + subtle orbital drift
          if (Math.abs(st.velLng) > 0.02 || Math.abs(st.velLat) > 0.02) {
            st.rotLng += st.velLng * dt;
            st.rotLat = Math.max(-72, Math.min(72, st.rotLat + st.velLat * dt));
            var damp = Math.exp(-dt * 4.5);
            st.velLng *= damp;
            st.velLat *= damp;
          } else if (!reducedMotion && !st.hoverHub && st.activeStage < 0) {
            st.rotLng -= dt * 7.5;
          }
        }
      }

      if (coordReadout && st.activeStage < 0) {
        var displayLon = ((-st.rotLng + 540) % 360) - 180;
        coordReadout.textContent = 'COOR: ' + formatCoord(-st.rotLat, displayLon);
      }

      drawFrame();
      st.rafId = window.requestAnimationFrame(tick);
    }

    canvas.addEventListener('pointerdown', function (e) {
      var rect = canvas.getBoundingClientRect();
      st.pointerX = e.clientX - rect.left;
      st.pointerY = e.clientY - rect.top;
      if (Math.hypot(st.pointerX - st.cx, st.pointerY - st.cy) > st.R * 1.32) return;

      st.dragging = true;
      st.targetLng = null;
      st.targetLat = null;
      st.velLng = 0;
      st.velLat = 0;
      st.dragStartX = st.pointerX;
      st.dragStartY = st.pointerY;
      st.dragStartLng = st.rotLng;
      st.dragStartLat = st.rotLat;
      updateStageUI(-1);
      if (canvas.setPointerCapture) {
        try {
          canvas.setPointerCapture(e.pointerId);
        } catch (_err) {}
      }
      canvas.style.cursor = 'grabbing';
    });

    canvas.addEventListener('pointermove', function (e) {
      var rect = canvas.getBoundingClientRect();
      var px = e.clientX - rect.left;
      var py = e.clientY - rect.top;
      if (st.dragging) {
        var dx = px - st.pointerX;
        var dy = py - st.pointerY;
        st.velLng = dx * 18;
        st.velLat = -dy * 18;
        st.rotLng = st.dragStartLng + (px - st.dragStartX) * 0.45;
        st.rotLat = Math.max(-72, Math.min(72, st.dragStartLat - (py - st.dragStartY) * 0.45));
      }
      st.pointerX = px;
      st.pointerY = py;
    });

    function endDrag(e) {
      if (!st.dragging) return;
      var moved = Math.hypot(st.pointerX - st.dragStartX, st.pointerY - st.dragStartY);
      st.dragging = false;
      if (e && e.pointerId !== undefined && canvas.hasPointerCapture && canvas.hasPointerCapture(e.pointerId)) {
        try {
          canvas.releasePointerCapture(e.pointerId);
        } catch (_err) {}
      }
      if (moved < 5 && st.hoverHub && typeof st.hoverHub.stage === 'number') {
        focusStage(st.hoverHub.stage);
      }
      canvas.style.cursor = st.hoverHub ? 'pointer' : 'grab';
    }

    canvas.addEventListener('pointerup', endDrag);
    canvas.addEventListener('pointercancel', endDrag);
    canvas.addEventListener('pointerleave', function () {
      st.pointerX = -9999;
      st.pointerY = -9999;
      if (!st.dragging) st.hoverHub = null;
    });

    function syncVisibility() {
      var rect = section.getBoundingClientRect();
      var secVisible = rect.bottom > 0 && rect.top < (window.innerHeight || 900);
      st.inView = secVisible;
      var isSlideOpen =
        secVisible &&
        !slide.classList.contains('opacity-0') &&
        !slide.classList.contains('pointer-events-none');

      if (isSlideOpen && !st.active) {
        resize();
        st.active = true;
        st.lastTs = 0;
        drawFrame();
        if (!st.rafId) st.rafId = window.requestAnimationFrame(tick);
      } else if (!isSlideOpen && st.active) {
        st.active = false;
        if (st.rafId) {
          window.cancelAnimationFrame(st.rafId);
          st.rafId = 0;
        }
      }
    }

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(syncVisibility, { threshold: 0.05 });
      io.observe(section);
    }
    var mo = new MutationObserver(syncVisibility);
    mo.observe(slide, { attributes: true, attributeFilter: ['class'] });
    if ('ResizeObserver' in window) {
      new ResizeObserver(function () {
        resize();
        if (st.active) drawFrame();
      }).observe(stage);
    } else {
      window.addEventListener('resize', resize);
    }

    resize();
    syncVisibility();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDistributionGlobe, { once: true });
  } else {
    initDistributionGlobe();
  }
})();
