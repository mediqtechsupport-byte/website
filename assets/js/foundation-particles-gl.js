/**
 * MEDIQ — "OUR ESTABLISHED FOUNDATION" 1CENTRE CONVERGENCE & TEXT-CHANNEL STREAM
 * ============================================================================
 * Full-section blended 2D Canvas system matching 1Centre's exact spatial layout:
 *   1) Left half: wide perspective ray cone fanning left from a central prism apex,
 *      with a large airy stippled sphere containing crisp negative-space "MEDIQ",
 *      traveling signal dashes along tracks, and curved Bezier funnel particles.
 *   2) Right half: razor-clean horizontal optical beam + sparkling blue/white
 *      particle river pouring from the prism apex directly between the Foundation
 *      headline and body copy (#fnd-beam-channel), blended cleanly over the navy
 *      blueprint background.
 * Must load BEFORE main.js (sets data-partner-initialized to skip the SVG loop).
 */
(function initFoundationConvergenceMediq() {
  'use strict';

  const sec = document.getElementById('about-sec-foundation');
  const stage = document.getElementById('fnd-partner-stage');
  if (!sec || !stage) return;

  const svg = stage.querySelector('svg');
  if (svg) svg.style.visibility = 'visible';

  // Mirror layout cleanly on desktop (Copy LEFT, Flat Optical Emblem RIGHT) without mutating locked DOM
  if (!document.getElementById('fnd-mirror-layout-style')) {
    const mirrorStyle = document.createElement('style');
    mirrorStyle.id = 'fnd-mirror-layout-style';
    mirrorStyle.textContent = [
      '@media (min-width: 1024px) {',
      '  #about-sec-foundation .fnd-grid { grid-template-columns: minmax(0, 1.04fr) minmax(0, 0.96fr) !important; gap: 2rem !important; }',
      '  #about-sec-foundation .fnd-copy { order: 1 !important; padding-left: 0 !important; padding-right: 1.5rem !important; max-width: 560px !important; margin-left: 0 !important; margin-right: auto !important; }',
      '  #about-sec-foundation .fnd-partner-col { order: 2 !important; }',
      '}',
      '@media (min-width: 1280px) {',
      '  #about-sec-foundation .fnd-copy { padding-right: 2rem !important; }',
      '}',
    ].join('\n');
    document.head.appendChild(mirrorStyle);
  }

  // Static gradient mode requested: keep __fndOnStarImpact bridge reference and omit 3D starfield canvas
  window.__fndOnStarImpact = window.__fndOnStarImpact || function () {};
  return;

  // Mount one crisp retina canvas spanning the full Foundation panel for seamless blending
  const canvas = document.createElement('canvas');
  canvas.className = 'fnd-particles-gl';
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none;z-index:15;';

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    delete stage.dataset.partnerInitialized;
    return;
  }
  sec.appendChild(canvas);

  // Contain canvas cleanly without creating horizontal scrollbars
  const canClip = !!(window.CSS && CSS.supports && CSS.supports('overflow', 'clip'));
  sec.style.overflow = canClip ? 'clip' : 'hidden';
  const scrollParent = document.getElementById('about-subpage-scroll');
  if (scrollParent) {
    scrollParent.style.overflowX = canClip ? 'clip' : 'hidden';
    scrollParent.addEventListener('scroll', () => { if (scrollParent.scrollLeft !== 0) scrollParent.scrollLeft = 0; }, { passive: true });
  }
  const aboutSec = document.getElementById('about');
  if (aboutSec) aboutSec.addEventListener('scroll', () => { if (aboutSec.scrollLeft !== 0) aboutSec.scrollLeft = 0; }, { passive: true });

  // Deterministic PRNG for clean consistent layout across frames/viewports
  let seed = 731905;
  function rand() {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  }

  // ---------------------------------------------------------------------------
  // Layout & Responsive Geometry (locks MEDIQ Particles onto 3D Projector Screen)
  // ---------------------------------------------------------------------------
  let CW = 0;
  let CH = 0;
  let dpr = 1;
  let FOCAL_X = 0;
  let FOCAL_Y = 0;
  let MED_X = 0;
  let MED_Y = 0;
  let MED_R = 0;
  let BEAM_MAX_X = 0;
  let BEAM_MIN_X = 24;
  let isDesktopSplit = true;
  let isGlobeOnRight = true;
  let anchoredBase = null;
  let baseQuad = null;
  let liveQuad = null;
  let vrPanX = 0;
  let vrPanY = 0;

  let dots = [];
  let ambientDust = [];
  let opticalArcDots = [];
  let axisPackets = [];

  function cloneQuad(q) {
    return {
      tl: { x: q.tl.x, y: q.tl.y },
      tr: { x: q.tr.x, y: q.tr.y },
      br: { x: q.br.x, y: q.br.y },
      bl: { x: q.bl.x, y: q.bl.y },
      cx: q.cx,
      cy: q.cy,
    };
  }

  function makeFallbackQuad(cx, cy, r) {
    const hw = r * 1.24;
    const hh = r * 0.80;
    return {
      tl: { x: cx - hw, y: cy - hh },
      tr: { x: cx + hw, y: cy - hh },
      br: { x: cx + hw, y: cy + hh },
      bl: { x: cx - hw, y: cy + hh },
      cx,
      cy,
    };
  }

  function mapQuad(q, u, v) {
    const topX = q.tl.x + (q.tr.x - q.tl.x) * u;
    const topY = q.tl.y + (q.tr.y - q.tl.y) * u;
    const botX = q.bl.x + (q.br.x - q.bl.x) * u;
    const botY = q.bl.y + (q.br.y - q.bl.y) * u;
    return {
      x: topX + (botX - topX) * v,
      y: topY + (botY - topY) * v,
    };
  }

  function traceMediqProjectorMask(mctx, mw, mh) {
    mctx.clearRect(0, 0, mw, mh);

    // Draw positive SOLID MEDIQ letterforms inside normalized projector frame (no globe circle!)
    const leftPad = mw * 0.076;
    const drawW = mw - leftPad * 2;
    const scX = drawW / 903;
    const scY = (mh * 0.37) / 236;
    const topY = mh * 0.185;
    const mx = (x) => leftPad + x * scX;
    const my = (y) => topY + y * scY;

    function fillPoly(pts) {
      mctx.beginPath();
      mctx.moveTo(mx(pts[0][0]), my(pts[0][1]));
      for (let i = 1; i < pts.length; i++) mctx.lineTo(mx(pts[i][0]), my(pts[i][1]));
      mctx.closePath();
      mctx.fill();
    }

    mctx.save();
    mctx.fillStyle = '#ffffff';

    // M
    fillPoly([
      [5, 225], [48, 1], [125.5, 178], [203, 1], [246, 225],
      [222.5, 225], [194, 78], [125.5, 233], [57, 78], [28.5, 225]
    ]);

    // E
    fillPoly([
      [275, 225], [275, 12], [385, 12], [385, 34],
      [298, 34], [298, 98], [382, 98], [382, 119],
      [298, 119], [298, 204], [385, 204], [385, 225]
    ]);

    // D
    {
      const dcx = 477.5, dcy = 118.5, rOut = 106.5, rIn = 83.5;
      mctx.beginPath();
      mctx.moveTo(mx(426), my(225));
      mctx.lineTo(mx(426), my(12));
      mctx.lineTo(mx(dcx), my(12));
      mctx.ellipse(mx(dcx), my(dcy), rOut * scX, rOut * scY, 0, -Math.PI / 2, Math.PI / 2, false);
      mctx.lineTo(mx(426), my(225));
      mctx.closePath();

      mctx.moveTo(mx(449), my(35));
      mctx.lineTo(mx(dcx), my(35));
      mctx.ellipse(mx(dcx), my(dcy), rIn * scX, rIn * scY, 0, -Math.PI / 2, Math.PI / 2, false);
      mctx.lineTo(mx(449), my(202));
      mctx.closePath();
      mctx.fill('evenodd');
    }

    // I
    fillPoly([[619, 225], [619, 12], [642, 12], [642, 225]]);

    // Q
    {
      const qcx = 786, qcy = 118.5;
      mctx.beginPath();
      mctx.ellipse(mx(qcx), my(qcy), 111.0 * scX, 109.5 * scY, 0, 0, Math.PI * 2);
      mctx.ellipse(mx(qcx), my(qcy), 88.0 * scX, 86.5 * scY, 0, 0, Math.PI * 2, true);
      mctx.fill('evenodd');

      fillPoly([[791, 148], [822, 148], [898, 227], [869, 227]]);
    }

    function drawTrackedText(text, cx, cy, tracking) {
      const chars = Array.from(text);
      const widths = chars.map((ch) => mctx.measureText(ch).width);
      const totalW = widths.reduce((sum, w) => sum + w, 0) + Math.max(0, chars.length - 1) * tracking;
      let cursorX = cx - totalW * 0.5;
      for (let i = 0; i < chars.length; i++) {
        mctx.fillText(chars[i], cursorX, cy);
        cursorX += widths[i] + tracking;
      }
    }

    // Crisp horizontal particle rule & sub-branding bar beneath MEDIQ inside projector frame
    const ruleY = mh * 0.615;
    mctx.fillStyle = '#bae6fd';
    mctx.fillRect(mw * 0.076, ruleY, mw * 0.848, 5.0);

    const line1 = 'PHARMA AND MEDICAL SUPPLIES';
    const line2 = 'DISTRIBUTION';
    const maxSubW = mw * 0.848;
    const track1 = 1.6;
    let subSize = 35;
    while (subSize > 24) {
      mctx.font = `700 ${subSize}px "Instrument Sans", "Inter", ui-sans-serif, system-ui, sans-serif`;
      const measured1 = mctx.measureText(line1).width + (line1.length - 1) * track1;
      if (measured1 <= maxSubW) break;
      subSize -= 1;
    }

    mctx.font = `700 ${subSize}px "Instrument Sans", "Inter", "Segoe UI", system-ui, -apple-system, sans-serif`;
    mctx.textAlign = 'left';
    mctx.textBaseline = 'middle';
    mctx.fillStyle = '#ffffff';
    drawTrackedText(line1, mw * 0.5, mh * 0.725, track1);
    drawTrackedText(line2, mw * 0.5, mh * 0.845, 5.2);

    mctx.restore();
  }

  function rebuildSceneData() {
    if (CW < 100 || CH < 100) return;
    seed = 731905;

    // 1. Positive MEDIQ Particle Hologram Mapped Directly Onto Rectangular Projector Surface
    const mw = 840;
    const mh = 560;
    const off = document.createElement('canvas');
    off.width = mw;
    off.height = mh;
    const octx = off.getContext('2d', { willReadFrequently: true });
    traceMediqProjectorMask(octx, mw, mh);

    const img = octx.getImageData(0, 0, mw, mh).data;
    const inside = (x, y, thresh = 96) => {
      if (x < 0 || y < 0 || x >= mw || y >= mh) return false;
      return img[(y * mw + x) * 4 + 3] > thresh;
    };

    const palette = [
      '255, 255, 255',
      '224, 242, 254',
      '125, 211, 252',
      '56, 189, 248',
      '96, 165, 250'
    ];

    const refQuad = baseQuad || makeFallbackQuad(MED_X, MED_Y, MED_R);
    dots = [];

    function sampleRegion(yStart, yEnd, step, thresh, jitter, zone) {
      const dStep = Math.max(1, Math.round(step));
      for (let fy = yStart; fy < yEnd; fy += step) {
        for (let fx = 8; fx < mw - 8; fx += step) {
          const ix = Math.round(fx);
          const iy = Math.round(fy);
          if (!inside(ix, iy, thresh)) continue;

          const isEdge =
            !inside(ix - dStep, iy, thresh) || !inside(ix + dStep, iy, thresh) ||
            !inside(ix, iy - dStep, thresh) || !inside(ix, iy + dStep, thresh);

          const uHome = clamp((fx + (rand() - 0.5) * jitter) / mw, 0.04, 0.96);
          const vHome = clamp((fy + (rand() - 0.5) * jitter) / mh, 0.06, 0.94);
          const pt = mapQuad(refQuad, uHome, vHome);

          let rgb;
          let radius;
          let baseAlpha;
          let amp;
          if (zone === 'rule') {
            rgb = rand() < 0.55 ? palette[1] : palette[3];
            radius = 0.72 + rand() * 0.36;
            baseAlpha = 0.68 + rand() * 0.28;
            amp = 0.0012;
          } else if (zone === 'sub') {
            const rSub = rand();
            rgb = rSub < 0.48 ? palette[0] : rSub < 0.82 ? palette[1] : palette[2];
            radius = 0.50 + rand() * 0.18;
            baseAlpha = 0.84 + rand() * 0.16;
            amp = 0.00042;
          } else {
            if (isEdge) {
              rgb = rand() < 0.78 ? palette[0] : palette[1];
            } else {
              const rCol = rand();
              rgb = rCol < 0.34 ? palette[0] : rCol < 0.62 ? palette[1] : rCol < 0.84 ? palette[2] : palette[3];
            }
            radius = isEdge ? (1.05 + rand() * 0.42) : (0.85 + rand() * 0.48);
            baseAlpha = isEdge ? (0.86 + rand() * 0.14) : (0.64 + rand() * 0.34);
            amp = isEdge ? 0.0014 : 0.0024;
          }

          const canAmbientStream = zone === 'main' && uHome < 0.24 && vHome > 0.16 && vHome < 0.58;
          dots.push({
            uHome,
            vHome,
            u: uHome,
            v: vHome,
            vu: 0,
            vv: 0,
            homeX: pt.x,
            homeY: pt.y,
            x: pt.x,
            y: pt.y,
            vx: 0,
            vy: 0,
            radius,
            rgb,
            baseAlpha,
            phase: rand() * Math.PI * 2,
            freq: 1.0 + rand() * 1.4,
            amp,
            canAmbientStream,
            state: 0,
            t: 0,
            speed: 0.0055 + rand() * 0.006,
            streamSpeed: 0.006,
            sx: pt.x,
            sy: pt.y,
            cpx: pt.x,
            cpy: pt.y,
            sway: (rand() - 0.5) * 18,
            streamCooldown: Math.floor(rand() * 210)
          });
        }
      }
    }

    sampleRegion(8, mh * 0.60, 6.4, 96, 1.7, 'main');
    sampleRegion(mh * 0.60, mh * 0.645, 4.2, 96, 0.9, 'rule');
    sampleRegion(mh * 0.645, mh - 12, 2.8, 68, 0.18, 'sub');

    // 2. Subtle Interior Projector Wave & Floating Hologram Sparkles (100% bounded inside rectangular screen!)
    opticalArcDots = [];
    for (let k = 0; k < 76; k++) {
      const band = k < 38 ? 0 : 1;
      const u = 0.08 + ((k % 38) / 37) * 0.84;
      const arcBend = Math.sin(u * Math.PI) * 0.045;
      const vBase = band === 0 ? (0.17 - arcBend) : (0.89 + arcBend * 0.35);
      opticalArcDots.push({
        u,
        vBase,
        band,
        phase: rand() * Math.PI * 2,
        r: 0.65 + rand() * 0.65,
        alpha: 0.30 + rand() * 0.42,
        rgb: rand() < 0.4 ? '224, 242, 254' : '56, 189, 248'
      });
    }

    ambientDust = [];
    const DUST_COUNT = isDesktopSplit ? 85 : 50;
    for (let i = 0; i < DUST_COUNT; i++) {
      const du = 0.06 + rand() * 0.88;
      const dv = 0.08 + rand() * 0.84;
      ambientDust.push({
        u: du,
        v: dv,
        phase: rand() * Math.PI * 2,
        freq: 0.55 + rand() * 0.95,
        driftU: 0.006 + rand() * 0.012,
        driftV: 0.008 + rand() * 0.014,
        r: 0.55 + rand() * 0.85,
        alpha: 0.18 + rand() * 0.38,
        rgb: rand() < 0.45 ? '255, 255, 255' : '125, 211, 252'
      });
    }

    axisPackets = [];
  }

  function clamp(v, lo, hi) {
    return v < lo ? lo : v > hi ? hi : v;
  }

  function triggerStream() {}

  function updateMetrics(forceRebuild) {
    const secRect = sec.getBoundingClientRect();
    if (secRect.width < 100 || secRect.height < 100) return false;

    const copyEl = sec.querySelector('.fnd-copy');
    const leadEl = document.getElementById('fnd-lead');
    const beamEl = document.getElementById('fnd-beam-channel');
    const stageRect = stage.getBoundingClientRect();

    const copyRect = copyEl ? copyEl.getBoundingClientRect() : null;
    const leadRect = leadEl ? leadEl.getBoundingClientRect() : null;
    const beamRect = beamEl ? beamEl.getBoundingClientRect() : null;

    const newW = secRect.width;
    const newH = secRect.height;
    const newDesktop = !!(copyRect && newW >= 1024);
    const copyCenter = copyRect ? (copyRect.left - secRect.left) + copyRect.width * 0.5 : newW * 0.7;
    const newRightGlobe = newDesktop && copyCenter < newW * 0.52;

    let newFX, newFY, newMX, newMY, newMR, newBeamMax, newBeamMin = 24;
    if (newDesktop && copyRect) {
      if (beamRect && beamRect.height > 0) {
        newFY = Math.round((beamRect.top + beamRect.height * 0.5) - secRect.top);
      } else if (leadRect) {
        newFY = Math.round((leadRect.bottom - secRect.top) + 24);
      } else {
        newFY = Math.round(newH * 0.48);
      }
      const sCX = stageRect.width > 0
        ? (stageRect.left - secRect.left) + stageRect.width * 0.5
        : (newRightGlobe ? newW * 0.74 : newW * 0.26);
      const sCY = stageRect.height > 0
        ? (stageRect.top - secRect.top) + stageRect.height * 0.5
        : newFY;

      if (newRightGlobe) {
        newBeamMin = Math.round(Math.max(24, copyRect.left - secRect.left));
        if (baseQuad && baseQuad.tl.x > copyRect.right - secRect.left + 40) {
          newMR = Math.round(Math.max(70, Math.abs(baseQuad.bl.y - baseQuad.tl.y) * 0.5));
          newMX = Math.round(baseQuad.cx);
          newMY = Math.round(baseQuad.cy);
          const leftEdgeX = Math.min(baseQuad.tl.x, baseQuad.bl.x);
          newFX = Math.round(Math.min(leftEdgeX - 28, Math.max((copyRect.right - secRect.left) + 24, newW * 0.49)));
        } else if (anchoredBase && anchoredBase.mx > newW * 0.49 + 40 && anchoredBase.mr > 60) {
          newMR = Math.round(anchoredBase.mr);
          newMX = Math.round(anchoredBase.mx);
          newMY = Math.round(anchoredBase.my);
          newFX = Math.round(Math.min(newMX - newMR * 1.25 - 24, Math.max((copyRect.right - secRect.left) + 24, newW * 0.49)));
        } else {
          newFX = Math.round(Math.min(newW * 0.54, Math.max((copyRect.right - secRect.left) + 28, newW * 0.495)));
          const rightSpan = Math.max(240, newW - newFX - 40);
          newMR = Math.round(Math.min(newH * 0.20, rightSpan * 0.26, 175));
          newMX = Math.round(newW - newMR * 1.28 - 40);
          newMY = Math.round(Math.max(newMR + 24, Math.min(newH * 0.28, (newFY * 0.34 + sCY * 0.12))));
        }
        newBeamMax = newFX;
      } else {
        newFX = Math.round(Math.min((copyRect.left - secRect.left) - 42, newW * 0.455));
        newMR = Math.round(Math.min(newH * 0.34, newFX * 0.39, 260));
        const idealMX = Math.min(sCX, newFX - newMR - 64);
        newMX = Math.round(Math.max(newMR + 40, idealMX));
        newMY = Math.round(Math.max(newMR + 44, Math.min(newH - newMR - 64, (newFY * 0.45 + sCY * 0.55))));
        newBeamMax = Math.round(newW - 24);
      }
    } else {
      const sCX = stageRect.width > 0 ? (stageRect.left - secRect.left + stageRect.width * 0.5) : newW * 0.5;
      const sCY = stageRect.height > 0 ? (stageRect.top - secRect.top + stageRect.height * 0.5) : newH * 0.72;
      newMR = Math.round(Math.min(newW * 0.34, 210));
      newMX = Math.round(sCX);
      newMY = Math.round(sCY);
      newFX = Math.round(sCX - newMR * 1.15);
      newFY = newMY;
      newBeamMax = newFX;
    }

    const changed = forceRebuild
      || Math.abs(newW - CW) > 4
      || Math.abs(newH - CH) > 4
      || Math.abs(newFX - FOCAL_X) > 4
      || Math.abs(newFY - FOCAL_Y) > 4
      || Math.abs(newMX - MED_X) > 4
      || Math.abs(newMY - MED_Y) > 4
      || Math.abs(newMR - MED_R) > 4
      || newDesktop !== isDesktopSplit
      || newRightGlobe !== isGlobeOnRight;

    CW = newW;
    CH = newH;
    FOCAL_X = newFX;
    FOCAL_Y = newFY;
    MED_X = newMX;
    MED_Y = newMY;
    MED_R = newMR;
    BEAM_MAX_X = newBeamMax;
    BEAM_MIN_X = newBeamMin;
    isDesktopSplit = newDesktop;
    isGlobeOnRight = newRightGlobe;

    window.__fndGlobeMeta = {
      mx: MED_X,
      my: MED_Y,
      mr: MED_R,
      fx: FOCAL_X,
      fy: FOCAL_Y,
      cw: CW,
      ch: CH,
      isGlobeOnRight,
      isProjectorHologram: true,
    };

    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const pw = Math.round(CW * dpr);
    const ph = Math.round(CH * dpr);
    if (canvas.width !== pw || canvas.height !== ph) {
      canvas.width = pw;
      canvas.height = ph;
    }

    if (changed) rebuildSceneData();
    return true;
  }

  updateMetrics(true);

  if ('ResizeObserver' in window) {
    new ResizeObserver(() => updateMetrics(false)).observe(sec);
  } else {
    window.addEventListener('resize', () => updateMetrics(false), { passive: true });
  }
  if ('MutationObserver' in window) {
    new MutationObserver(() => {
      if (!sec.classList.contains('is-hidden-subpage')) {
        requestAnimationFrame(() => updateMetrics(false));
      }
    }).observe(sec, { attributes: true, attributeFilter: ['class'] });
  }

  // ---------------------------------------------------------------------------
  // Pointer Interaction (Proximity Repulsion & Excitation)
  // ---------------------------------------------------------------------------
  const pointer = { x: -9999, y: -9999, active: false };
  window.addEventListener('mousemove', (e) => {
    const r = canvas.getBoundingClientRect();
    if (!r.width || !r.height) return;
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    pointer.x = x;
    pointer.y = y;
    pointer.active = x >= 0 && y >= 0 && x <= CW && y <= CH;
  }, { passive: true });
  window.addEventListener('mouseleave', () => { pointer.active = false; }, { passive: true });

  // ---------------------------------------------------------------------------
  // Draw Frame
  // ---------------------------------------------------------------------------
  let simTime = 0;
  let impactEnergy = 0;
  let impactProg = 0;
  let revealLevel = 0;
  canvas.style.opacity = '0';

  window.__setFndBaseProjectorQuad = function (quad, mr) {
    if (!quad || !quad.tl || !quad.tr || !quad.br || !quad.bl) return;
    baseQuad = cloneQuad(quad);
    liveQuad = cloneQuad(quad);
    anchoredBase = { mx: quad.cx, my: quad.cy, mr: mr || 100 };
    updateMetrics(true);
  };

  window.__setFndBaseGlobeRect = function (mx, my, mr) {
    if (!(mx > 100 && my > 40 && mr > 40)) return;
    anchoredBase = { mx, my, mr };
    baseQuad = makeFallbackQuad(mx, my, mr);
    liveQuad = cloneQuad(baseQuad);
    updateMetrics(false);
  };

  window.__setFndProjectorQuad = function (quad, level) {
    if (quad && quad.tl && quad.tr && quad.br && quad.bl) {
      liveQuad = cloneQuad(quad);
      vrPanX = baseQuad ? (quad.cx - baseQuad.cx) : 0;
      vrPanY = baseQuad ? (quad.cy - baseQuad.cy) : 0;
      if (window.__fndGlobeMeta) {
        window.__fndGlobeMeta.mx = Math.round(quad.cx);
        window.__fndGlobeMeta.my = Math.round(quad.cy);
      }
    }
    revealLevel = Math.max(0, Math.min(1, Number(level) || 0));
    canvas.style.opacity = revealLevel <= 0.004 ? '0' : revealLevel.toFixed(3);
  };

  window.__setFndGlobeFrame = function (panX, panY, level) {
    vrPanX = Number(panX) || 0;
    vrPanY = Number(panY) || 0;
    if (baseQuad) {
      liveQuad = {
        tl: { x: baseQuad.tl.x + vrPanX, y: baseQuad.tl.y + vrPanY },
        tr: { x: baseQuad.tr.x + vrPanX, y: baseQuad.tr.y + vrPanY },
        br: { x: baseQuad.br.x + vrPanX, y: baseQuad.br.y + vrPanY },
        bl: { x: baseQuad.bl.x + vrPanX, y: baseQuad.bl.y + vrPanY },
        cx: baseQuad.cx + vrPanX,
        cy: baseQuad.cy + vrPanY,
      };
    }
    revealLevel = Math.max(0, Math.min(1, Number(level) || 0));
    canvas.style.opacity = revealLevel <= 0.004 ? '0' : revealLevel.toFixed(3);
  };

  window.__setFndGlobeReveal = function (level) {
    revealLevel = Math.max(0, Math.min(1, Number(level) || 0));
    canvas.style.opacity = revealLevel <= 0.004 ? '0' : revealLevel.toFixed(3);
  };

  setTimeout(() => {
    if (!window.__fndVrControlled && revealLevel === 0) {
      window.__setFndGlobeReveal(1);
    }
  }, 800);

  window.__fndOnStarImpact = function (strength) {
    impactEnergy = Math.max(impactEnergy, strength || 1.0);
    impactProg = 0.001;
    for (let i = 0; i < dots.length; i++) {
      const d = dots[i];
      const ang = Math.atan2(d.vHome - 0.5, d.uHome - 0.5);
      const kick = 0.018 + rand() * 0.024;
      d.vu += Math.cos(ang + 0.55) * kick;
      d.vv += Math.sin(ang + 0.55) * kick;
      if (d.canAmbientStream && rand() < 0.36) {
        triggerStream(d, true);
      }
    }
  };

  function stepAndDraw(dtSec, animate) {
    if (CW < 100 || CH < 100) {
      if (!updateMetrics(true)) return;
    }
    simTime += dtSec;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, CW, CH);

    if (!dots.length || revealLevel <= 0.004) return;

    const stepMul = animate ? Math.min(2.5, dtSec * 60) : 0;
    const pX = isDesktopSplit && isGlobeOnRight ? vrPanX : 0;
    const pY = isDesktopSplit && isGlobeOnRight ? vrPanY : 0;
    const q = (isDesktopSplit && isGlobeOnRight && liveQuad)
      ? liveQuad
      : makeFallbackQuad(MED_X + pX, MED_Y + pY, MED_R);
    const qH = Math.max(40, Math.abs(q.bl.y - q.tl.y));
    const qW = Math.max(60, Math.abs(q.tr.x - q.tl.x));

    // 1) Crisp Optical Highlight & Sparkles Contained Inside Black Projector Quad (never blue wash!)
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(q.tl.x, q.tl.y);
    ctx.lineTo(q.tr.x, q.tr.y);
    ctx.lineTo(q.br.x, q.br.y);
    ctx.lineTo(q.bl.x, q.bl.y);
    ctx.closePath();
    ctx.clip();

    const screenAura = ctx.createRadialGradient(q.cx, q.cy, qH * 0.06, q.cx, q.cy, qW * 0.56);
    screenAura.addColorStop(0, 'rgba(224, 242, 254, 0.06)');
    screenAura.addColorStop(0.5, 'rgba(56, 189, 248, 0.025)');
    screenAura.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = screenAura;
    ctx.fillRect(Math.min(q.tl.x, q.bl.x), Math.min(q.tl.y, q.tr.y), qW + 12, qH + 12);

    // Subtle upper/lower IOL optical wave particles inside black screen
    for (let k = 0; k < opticalArcDots.length; k++) {
      const ad = opticalArcDots[k];
      const waveV = ad.vBase + Math.sin(simTime * 1.9 + ad.u * 7.5 + ad.phase) * 0.012;
      const wp = mapQuad(q, ad.u, clamp(waveV, 0.05, 0.95));
      const tw = 0.65 + 0.35 * Math.sin(simTime * 2.4 + ad.phase);
      ctx.fillStyle = `rgba(${ad.rgb}, ${(ad.alpha * tw).toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(wp.x, wp.y, ad.r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Fine floating sparkles strictly clipped inside the rectangular black projector screen
    for (let i = 0; i < ambientDust.length; i++) {
      const p = ambientDust[i];
      const du = clamp(p.u + Math.sin(simTime * p.freq + p.phase) * p.driftU, 0.04, 0.96);
      const dv = clamp(p.v + Math.cos(simTime * p.freq * 0.85 + p.phase) * p.driftV, 0.05, 0.95);
      const sp = mapQuad(q, du, dv);
      const tw = 0.7 + 0.3 * Math.sin(simTime * 2.1 + p.phase);
      ctx.fillStyle = `rgba(${p.rgb}, ${(p.alpha * tw).toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(sp.x, sp.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // 4) Crisp MEDIQ Wordmark Particles Mapped In Perspective Inside the Black Projector Screen
    const REPEL_R = 110;
    for (let i = 0; i < dots.length; i++) {
      const d = dots[i];

      if (animate) {
        const bu = d.uHome + Math.cos(simTime * d.freq * 0.75 + d.phase) * (d.amp * 0.6);
        const bv = d.vHome + Math.sin(simTime * d.freq + d.phase) * d.amp;

        d.vu = (d.vu + (bu - d.u) * 0.16) * 0.74;
        d.vv = (d.vv + (bv - d.v) * 0.16) * 0.74;

        const curPt = mapQuad(q, d.u, d.v);
        if (pointer.active) {
          const dx = curPt.x - pointer.x;
          const dy = curPt.y - pointer.y;
          const dist = Math.hypot(dx, dy);
          if (dist < REPEL_R && dist > 0.001) {
            const push = Math.pow(1 - dist / REPEL_R, 1.55) * 10.0;
            d.vu += ((dx / dist) * push) / qW;
            d.vv += ((dy / dist) * push) / qH;
          }
        }

        d.u = clamp(d.u + d.vu * stepMul, 0.02, 0.98);
        d.v = clamp(d.v + d.vv * stepMul, 0.03, 0.97);
      }

      const pt = mapQuad(q, d.u, d.v);
      d.x = pt.x;
      d.y = pt.y;

      const tw = 0.86 + 0.14 * Math.sin(simTime * 2.2 + d.phase);
      const alpha = Math.min(1, d.baseAlpha * tw * (1 + impactEnergy * 0.42));
      ctx.fillStyle = `rgba(${d.rgb}, ${alpha.toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.radius * (1 + impactEnergy * 0.24), 0, Math.PI * 2);
      ctx.fill();
    }

    // Soft internal impact flash clipped inside the projector screen
    if (impactEnergy > 0.01) {
      if (animate) {
        impactEnergy = Math.max(0, impactEnergy - dtSec * 0.65);
        impactProg = Math.min(1, impactProg + dtSec * 1.2);
      }
      const coreGlow = ctx.createRadialGradient(q.cx, q.cy, 0, q.cx, q.cy, qH * 0.48);
      coreGlow.addColorStop(0, `rgba(224, 242, 254, ${(impactEnergy * 0.22).toFixed(3)})`);
      coreGlow.addColorStop(1, 'rgba(56, 189, 248, 0)');
      ctx.fillStyle = coreGlow;
      ctx.beginPath();
      ctx.arc(q.cx, q.cy, qH * 0.48, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // ---------------------------------------------------------------------------
  // Visibility & Animation Loop
  // ---------------------------------------------------------------------------
  let visible = true;
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entries) => {
      entries.forEach((en) => { visible = en.isIntersecting; });
    }, { threshold: 0.01 }).observe(sec);
  }

  window.__fndLensRenderAt = (phase) => {
    window.__fndLensPaused = true;
    updateMetrics(false);
    const steps = Math.max(1, Math.round((phase * 6000) / 16.667));
    for (let s = 0; s < steps; s++) stepAndDraw(1 / 60, s < steps - 1);
    stepAndDraw(0, false);
  };

  const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) {
    stepAndDraw(0, false);
    return;
  }

  let lastTs = performance.now();
  function loop(ts) {
    requestAnimationFrame(loop);
    if (window.innerWidth < 1024) {
      if (canvas.style.display !== 'none') {
        canvas.style.display = 'none';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, CW, CH);
      }
      lastTs = ts;
      return;
    }
    if (canvas.style.display === 'none') canvas.style.display = 'block';
    if (document.hidden || !visible || window.__fndLensPaused) {
      lastTs = ts;
      return;
    }
    if (typeof window.__aboutDeckCurrentIndex === 'number' && window.__aboutDeckCurrentIndex === 0) {
      lastTs = ts;
      return;
    }
    const dt = Math.min(0.05, Math.max(0.001, (ts - lastTs) / 1000));
    lastTs = ts;
    stepAndDraw(dt, true);
  }
  requestAnimationFrame(loop);
})();
