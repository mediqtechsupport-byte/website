/**
 * MEDIQ PRODUCTS — WEBGL2 WARP CAROUSEL ENGINE
 * ============================================================================
 * Faithful WebGL2 + Canvas2D implementation of Louis Studios WarpCarousel,
 * rendered with transparent premultiplied alpha over MediQ's dark sapphire
 * #products background (CRT grid + radial glow + atmospheric dust canvas).
 * Clicking the center front card opens the product detail showcase drawer.
 */
(function initMediqWarpCarouselFactory() {
  'use strict';

  const DEFAULT_FONT =
    '"Inter", "SF Pro Display", "SF Pro Text", -apple-system, BlinkMacSystemFont, system-ui, "Helvetica Neue", Arial, sans-serif';

  // Signature 6x7 B-spline mesh generator + box-matched presets
  function hexToRgbTuple(hex) {
    const h = String(hex || '#000000').replace('#', '');
    const v = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
    const n = parseInt(v, 16) || 0;
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }

  function mixHex(aHex, bHex, t) {
    const a = hexToRgbTuple(aHex);
    const b = hexToRgbTuple(bHex);
    const k = Math.max(0, Math.min(1, t));
    const ch = (i) => Math.round(a[i] + (b[i] - a[i]) * k).toString(16).padStart(2, '0');
    return '#' + ch(0) + ch(1) + ch(2);
  }

  function makeBoxPreset(dark, deep, mid, vivid, light, glowHex) {
    const d0 = mixHex(dark, '#000000', 0.35);
    const d1 = dark;
    const d2 = mixHex(dark, deep, 0.55);
    const m0 = deep;
    const m1 = mixHex(deep, mid, 0.55);
    const m2 = mid;
    const v0 = mixHex(mid, vivid, 0.55);
    const v1 = vivid;
    const l0 = mixHex(vivid, light, 0.55);
    const l1 = light;
    return {
      numeral: [l0, l1],
      accent: glowHex || vivid,
      glow: glowHex || vivid,
      mesh: [
        m0, d2, d1, d1, d2, m0,
        d2, d1, d0, d0, d1, m1,
        d1, d0, d0, d2, m2, v0,
        d1, d0, m0, m2, v1, v1,
        d1, d2, m1, v0, l0, l1,
        d2, m0, m1, d2, m2, l1,
        m0, m1, d2, d0, m1, l0
      ]
    };
  }

  const MESH_PRESETS = {
    cyan: {
      numeral: ['#3ad2ff', '#8cf6ff'],
      accent: '#7fe8ff',
      glow: '#12b0e8',
      mesh: ['#022852', '#031e3f', '#031934', '#021831', '#021b36', '#022246', '#022345', '#020e1e', '#01040f', '#000416', '#020b31', '#021c57', '#01172f', '#01010c', '#03001d', '#0a0f4c', '#112383', '#0b36af', '#021142', '#050b47', '#0c2e8f', '#165bd4', '#1675fd', '#167bff', '#03288e', '#0438af', '#0d66e7', '#107eec', '#30afff', '#71dcff', '#0356e8', '#0259ec', '#0945b0', '#001a49', '#3f7c9d', '#d4ffff', '#0365ff', '#0256ea', '#052a87', '#00001f', '#1f4c7b', '#9ee7ff']
    },
    violet: {
      numeral: ['#e2a6ff', '#fff6ff'],
      accent: '#d9a8ff',
      glow: '#62bce8',
      mesh: ['#4c2d5f', '#3b2245', '#3e285b', '#33204f', '#381844', '#572571', '#644096', '#4f3688', '#8358f6', '#8d54f3', '#5e20ac', '#6e24b7', '#482e6d', '#261b48', '#825bf6', '#d48cff', '#d07bff', '#b359ff', '#2d1837', '#140a1b', '#2c1d66', '#3a2383', '#693bca', '#8b42ef', '#411c5b', '#300753', '#3b006e', '#500f79', '#7e31c1', '#9541f3', '#44245a', '#3f0c69', '#6f15b9', '#d17cff', '#e2a3ff', '#a668ff', '#4b2f60', '#4d2172', '#6819aa', '#9b48dc', '#965dc9', '#7745c4']
    },
    amber: {
      numeral: ['#f4eeb6', '#c4c688'],
      accent: '#f6efc0',
      glow: '#dacbe9',
      mesh: ['#ff623e', '#f57337', '#e49435', '#fba03f', '#ef6b36', '#f14c36', '#f29a3e', '#a0a92e', '#a2ba36', '#fffe65', '#ffd852', '#f2863b', '#a5b12e', '#46821d', '#6a6127', '#b88b44', '#b6bd41', '#c4b838', '#7e9f27', '#3b5a19', '#412c10', '#0d1700', '#255b0c', '#98ad28', '#a5b232', '#3e7c1e', '#002800', '#00300f', '#5b9745', '#c1b833', '#f3983b', '#b3b431', '#6fa31f', '#9bc976', '#edd896', '#fd8c3d', '#ff5f3b', '#ff7d47', '#ffa880', '#ffc1d8', '#ff8d99', '#ff5438']
    },
    crimson: {
      numeral: ['#fffdf8', '#e8603f'],
      accent: '#ff6a3d',
      glow: '#6cc0ea',
      mesh: ['#48001c', '#400119', '#41011d', '#4b021e', '#47021a', '#480019', '#7e0036', '#8c0033', '#4b0120', '#10000c', '#1f010b', '#390116', '#e84396', '#ff568c', '#dc433c', '#0e0705', '#090004', '#2f0213', '#ff9fd9', '#ff6f90', '#a53625', '#190d05', '#050002', '#2f0110', '#ff67b5', '#b11348', '#000000', '#11000c', '#3e021b', '#8a0c31', '#e31771', '#5d0027', '#3a0021', '#620030', '#640627', '#dc184a', '#c10b5f', '#920245', '#ab054f', '#910041', '#650226', '#c01240']
    },
    teal: {
      numeral: ['#5efce8', '#c6fff6'],
      accent: '#2dd4bf',
      glow: '#14b8a6',
      mesh: ['#022c2a', '#032021', '#041c20', '#02171b', '#021f22', '#032c2d', '#042726', '#021417', '#010b0e', '#00090e', '#021a20', '#032e35', '#022224', '#01090c', '#020c18', '#06263a', '#0d4a63', '#0a6578', '#021822', '#041b2c', '#0b445e', '#107f8d', '#12b8b6', '#1fd6cb', '#032e3e', '#054f5e', '#0d8892', '#12b6b1', '#38e8d3', '#88fff0', '#036b73', '#027579', '#095965', '#00222b', '#41928e', '#ccfff8', '#05848b', '#04717a', '#053a47', '#001018', '#1e5b63', '#8af8ea']
    },
    indigo: {
      numeral: ['#7dd3fc', '#e0f2fe'],
      accent: '#38bdf8',
      glow: '#0ea5e9',
      mesh: ['#0b1640', '#08102d', '#08112e', '#070f28', '#091433', '#0c1c46', '#0d1b45', '#060c21', '#030612', '#020515', '#08133a', '#0c2368', '#071436', '#03040f', '#070626', '#141e5c', '#20389e', '#1a4fd4', '#09113f', '#0e1759', '#193da8', '#2569e6', '#2889ff', '#38a3ff', '#0c2685', '#103db0', '#1868e8', '#1d86f2', '#49b6ff', '#8be0ff', '#1150e0', '#1256eb', '#1844ab', '#061a4a', '#4a7ea6', '#dcf6ff', '#1664fc', '#1254e6', '#0e2878', '#050821', '#274d80', '#9ee6ff']
    },
    magenta: makeBoxPreset('#18010e', '#4a0629', '#a60d58', '#db1674', '#ff8ec7', '#ec4899'),
    cerulean: makeBoxPreset('#031521', '#08364a', '#167591', '#2eb3cf', '#9eeeff', '#22d3ee'),
    cobalt: makeBoxPreset('#030d24', '#0b2254', '#164594', '#226ad1', '#8cc8ff', '#3b82f6'),
    plum: makeBoxPreset('#140414', '#380e36', '#692162', '#96328a', '#e8a2e1', '#a855f7'),
    aubergine: makeBoxPreset('#180414', '#400b31', '#731a58', '#a3297a', '#eb9bd1', '#c026d3'),
    orange: makeBoxPreset('#1c0700', '#4f1703', '#ba400d', '#f26522', '#ffb885', '#f97316'),
    lavender: makeBoxPreset('#130d29', '#31235c', '#69529e', '#947ac9', '#dfd1ff', '#a78bfa'),
    marigold: makeBoxPreset('#1c0f01', '#4f2c05', '#b86c11', '#eea236', '#ffe3a6', '#f59e0b'),
    gold: makeBoxPreset('#1c1502', '#4f3b06', '#ad8210', '#ecc434', '#fff0a8', '#eab308'),
    emerald: makeBoxPreset('#011c15', '#034030', '#047d5e', '#07ad83', '#85f7d9', '#10b981'),
    amethyst: makeBoxPreset('#150924', '#381959', '#6e3f99', '#9561c7', '#dfc2ff', '#a855f7')
  };

  window.MEDIQ_WARP_MESH_PRESETS = MESH_PRESETS;

  /* ------------------------------------------------------------------ */
  /* Geometry: exact Louis Studios WarpCarousel stage (720w, card 256x320) */
  /* ------------------------------------------------------------------ */
  const CW = 256;
  const CH = 320;
  const CR = 10;
  const FOCAL = 734.103;
  const G = {
    qA: 0.46401,
    XLA: 165.774,
    zA: 35.354,
    psiA: 1.44638,
    a1: 1.31454,
    a2: 1.10948,
    qB: 0.74999,
    XB: 204.525,
    ZB: 355.405,
    bB: 0.69311,
    bE: 0.04614,
    vC: 203.134,
    aC: 229.260,
    kB: 0.01087,
    bP: 0.99129,
    qPR: 1.01828,
    bPL: 1.00920,
    qPL: 1.07139
  };

  function poseAt(q0) {
    let q = q0;
    if (Math.abs(q) < 1) q -= G.kB * Math.pow(Math.sin(Math.PI * q), 2);
    const s = q < 0 ? -1 : 1;
    const a = Math.abs(q);
    const half = CW / 2;
    if (a <= G.qA) {
      const t = a / G.qA;
      const xl = -half + (G.XLA + half) * Math.pow(t, G.a1);
      const zl = G.zA * Math.pow(t, 4);
      const psi = G.psiA * Math.pow(t, G.a2);
      return [s * (xl + half * Math.cos(psi)), zl + half * Math.sin(psi), s * psi];
    }
    const dXL = ((G.XLA + half) * G.a1) / G.qA;
    const dZL = (G.zA * 4) / G.qA;
    const dps = (G.psiA * G.a2) / G.qA;
    let Hx, Hz;
    if (a <= G.qB) {
      const L = G.qB - G.qA;
      const t = (a - G.qA) / L;
      const hx = G.XLA + CW * Math.cos(G.psiA);
      const hz = G.zA + CW * Math.sin(G.psiA);
      const dhx = dXL - CW * Math.sin(G.psiA) * dps;
      const dhz = dZL + CW * Math.cos(G.psiA) * dps;
      const t2 = t * t;
      const t3 = t2 * t;
      const h00 = 2 * t3 - 3 * t2 + 1;
      const h10 = t3 - 2 * t2 + t;
      const h01 = -2 * t3 + 3 * t2;
      const h11 = t3 - t2;
      Hx = h00 * hx + h10 * L * dhx * G.bB + h01 * G.XB + h11 * L * G.vC * G.bE;
      Hz = h00 * hz + h10 * L * dhz * G.bB + h01 * G.ZB;
    } else {
      const d = a - G.qB;
      Hx = G.XB + G.vC * d + G.aC * d * d;
      Hz = G.ZB;
    }
    const qP = s < 0 ? G.qPL : G.qPR;
    const bP = s < 0 ? G.bPL : G.bP;
    const LP = qP - G.qA;
    const tp = Math.min(1, (a - G.qA) / LP);
    const tp2 = tp * tp;
    const tp3 = tp2 * tp;
    const psi =
      (2 * tp3 - 3 * tp2 + 1) * G.psiA +
      (tp3 - 2 * tp2 + tp) * LP * dps * bP +
      (-2 * tp3 + 3 * tp2) * Math.PI;
    return [s * (Hx - half * Math.cos(psi)), Hz - half * Math.sin(psi), s * psi];
  }

  /* Spin curve over 110 reference frames (30 fps) */
  const TK = [0, 3, 6, 8, 10, 11, 12, 13, 14, 16, 18, 21, 25, 30, 36, 45, 55, 70, 88, 110];
  const TB = [0, 0.02175, 0.12069, 0.22549, 0.35493, 0.43254, 0.51436, 0.5952, 0.6751, 0.83199, 0.9709, 1.12669, 1.27958, 1.40975, 1.53561, 1.68385, 1.79183, 1.89191, 1.95233, 2];
  const DRIFT = 0.06511;
  const REST_PHASE = 81.828;
  const STEP_FRAMES = 110;

  const SLOPES = (() => {
    const n = TK.length;
    const h = TK.slice(1).map((x, i) => x - TK[i]);
    const dl = h.map((hi, i) => (TB[i + 1] - TB[i]) / hi);
    const d = new Array(n).fill(0);
    for (let k = 1; k < n - 1; k++) {
      if (dl[k - 1] * dl[k] <= 0) d[k] = 0;
      else {
        const w1 = 2 * h[k] + h[k - 1];
        const w2 = h[k] + 2 * h[k - 1];
        d[k] = (w1 + w2) / (w1 / dl[k - 1] + w2 / dl[k]);
      }
    }
    const v = (dl[0] + dl[n - 2]) / 2;
    d[0] = v;
    d[n - 1] = v;
    return d;
  })();

  function spin(frames) {
    if (frames <= 0) return 0;
    if (frames >= STEP_FRAMES) return 1;
    let i = 0;
    while (i < TK.length - 2 && frames > TK[i + 1]) i++;
    const h = TK[i + 1] - TK[i];
    const t = (frames - TK[i]) / h;
    const t2 = t * t;
    const t3 = t2 * t;
    const h00 = 2 * t3 - 3 * t2 + 1;
    const h10 = t3 - 2 * t2 + t;
    const h01 = -2 * t3 + 3 * t2;
    const h11 = t3 - t2;
    return (h00 * TB[i] + h10 * h * SLOPES[i] + h01 * TB[i + 1] + h11 * h * SLOPES[i + 1]) / 2;
  }

  function spinN(frames, n) {
    if (n <= STEP_FRAMES + 0.5) return spin((frames * STEP_FRAMES) / Math.max(1, n));
    const knee = 80;
    if (frames <= knee) return spin(frames);
    return spin(knee + ((frames - knee) * (STEP_FRAMES - knee)) / (n - knee));
  }

  const LEAD = (STEP_FRAMES - REST_PHASE) / 30;
  const mod = (a, n) => ((a % n) + n) % n;

  /* ------------------------------------------------------------------ */
  /* Colour & Card Painter                                               */
  /* ------------------------------------------------------------------ */
  function parseColor(c, fallback) {
    fallback = fallback || [0, 0, 0];
    const s = (c || '').trim();
    let m = /^#([0-9a-f]{3,8})$/i.exec(s);
    if (m) {
      let h = m[1];
      if (h.length <= 4) h = h.split('').map((x) => x + x).join('');
      const n = parseInt(h.slice(0, 6), 16);
      return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    }
    m = /^rgba?\(([^)]+)\)$/i.exec(s);
    if (m) {
      const p = m[1].split(/[ ,/]+/).filter(Boolean).map((x) => parseFloat(x));
      return [p[0] || 0, p[1] || 0, p[2] || 0];
    }
    return fallback;
  }

  function rgba(c, a) {
    return 'rgba(' + c[0] + ', ' + c[1] + ', ' + c[2] + ', ' + a + ')';
  }

  function bspline(t, out) {
    const it = 1 - t;
    out[0] = (it * it * it) / 6;
    out[1] = (3 * t * t * t - 6 * t * t + 4) / 6;
    out[2] = (-3 * t * t * t + 3 * t * t + 3 * t + 1) / 6;
    out[3] = (t * t * t) / 6;
  }

  function meshGrid(mesh) {
    const src = mesh && mesh.length ? mesh : MESH_PRESETS.cyan.mesh;
    const cols = src.map((c) => parseColor(c));
    const out = [];
    for (let j = 0; j < 7; j++) {
      for (let i = 0; i < 6; i++) {
        if (cols.length === 42) out.push(cols[j * 6 + i]);
        else {
          const k = Math.min(cols.length - 1, Math.round(((j * 6 + i) / 41) * (cols.length - 1)));
          out.push(cols[k]);
        }
      }
    }
    return out;
  }

  function paintMesh(ctx, w, h, mesh) {
    const grid = meshGrid(mesh);
    const img = ctx.createImageData(w, h);
    const d = img.data;
    const wx = new Float32Array(w * 4);
    const ix = new Int32Array(w * 4);
    const tmp = [0, 0, 0, 0];
    for (let x = 0; x < w; x++) {
      const u = ((x + 0.5) / w) * 5;
      const i = Math.floor(u);
      bspline(u - i, tmp);
      for (let k = 0; k < 4; k++) {
        wx[x * 4 + k] = tmp[k];
        ix[x * 4 + k] = Math.min(5, Math.max(0, i - 1 + k));
      }
    }
    const row = new Float32Array(6 * 3);
    let seed = 1234567;
    for (let y = 0; y < h; y++) {
      const v = ((y + 0.5) / h) * 6;
      const j = Math.floor(v);
      bspline(v - j, tmp);
      row.fill(0);
      for (let k = 0; k < 4; k++) {
        const jj = Math.min(6, Math.max(0, j - 1 + k));
        const wy = tmp[k];
        for (let i = 0; i < 6; i++) {
          const c = grid[jj * 6 + i];
          row[i * 3] += c[0] * wy;
          row[i * 3 + 1] += c[1] * wy;
          row[i * 3 + 2] += c[2] * wy;
        }
      }
      for (let x = 0; x < w; x++) {
        let r = 0, g = 0, b = 0;
        for (let k = 0; k < 4; k++) {
          const wgt = wx[x * 4 + k];
          const i3 = ix[x * 4 + k] * 3;
          r += row[i3] * wgt;
          g += row[i3 + 1] * wgt;
          b += row[i3 + 2] * wgt;
        }
        seed = (seed * 1103515245 + 12345) & 0x7fffffff;
        const n = (seed / 0x7fffffff - 0.5) * 1.6;
        const o = (y * w + x) * 4;
        d[o] = r + n;
        d[o + 1] = g + n;
        d[o + 2] = b + n;
        d[o + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
  }

  function fontStr(weight, px, family) {
    return weight + ' ' + px + 'px ' + family;
  }

  function sizeForCap(ctx, weight, family, cap, sample) {
    ctx.font = fontStr(weight, 100, family);
    const m = ctx.measureText(sample || '0');
    const asc = m.actualBoundingBoxAscent || 71;
    return (cap / asc) * 100;
  }

  function paintCard(cv, card, family) {
    const w = cv.width;
    const h = cv.height;
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    const k = w / CW;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, w, h);
    paintMesh(ctx, w, h, card.mesh);
    ctx.setTransform(k, 0, 0, k, 0, 0);
    ctx.textBaseline = 'alphabetic';
    const white = [255, 255, 255];
    const accent = parseColor(card.accent || '#7fe8ff');

    // Subtle crisp glass inner rim
    ctx.strokeStyle = 'rgba(255,255,255,0.16)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(1, 1, CW - 2, CH - 2, CR);
    } else {
      ctx.rect(1, 1, CW - 2, CH - 2);
    }
    ctx.stroke();

    // Top-left 2-line title + footer
    const small = sizeForCap(ctx, 300, family, 7.9, 'H');
    ctx.font = fontStr(300, small, family);
    ctx.fillStyle = rgba(white, 0.92);
    const lines = (card.title || '').split('\n');
    lines.slice(0, 2).forEach((ln, i) => ctx.fillText(ln, 17, 37 + i * 14));

    if (card.codeTag) {
      ctx.save();
      ctx.font = fontStr(500, 7.2, 'monospace, ' + family);
      ctx.fillStyle = rgba(white, 0.56);
      ctx.textAlign = 'right';
      ctx.fillText(card.codeTag, CW - 16, 35);
      ctx.restore();
    }

    if (card.footer) {
      ctx.font = fontStr(300, small, family);
      ctx.fillStyle = rgba(white, 0.88);
      ctx.fillText(card.footer, 17, 295);
    }

    // Center Showcase: Product Box Packshot (front box on card center; replaces numeral + slider graphic)
    const boxImg = card._imgEl;
    if (boxImg && boxImg.complete && boxImg.naturalWidth > 0) {
      const boxCx = CW * 0.5;
      const boxCy = 166;
      const halo = ctx.createRadialGradient(boxCx, boxCy, 8, boxCx, boxCy, 108);
      halo.addColorStop(0, rgba(accent, 0.28));
      halo.addColorStop(0.55, rgba(accent, 0.08));
      halo.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = halo;
      ctx.fillRect(10, 62, CW - 20, 212);

      const maxW = 214;
      const maxH = 174;
      const sc = Math.min(maxW / boxImg.naturalWidth, maxH / boxImg.naturalHeight);
      const dw = boxImg.naturalWidth * sc;
      const dh = boxImg.naturalHeight * sc;
      const dx = boxCx - dw * 0.5;
      const dy = boxCy - dh * 0.5;

      ctx.save();
      ctx.shadowColor = 'rgba(2, 6, 18, 0.58)';
      ctx.shadowBlur = 18 * k;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 9 * k;
      ctx.drawImage(boxImg, dx, dy, dw, dh);
      ctx.restore();
      return;
    }

    // Fallback when no image is provided: numeral + unit + detail graphic
    const big = sizeForCap(ctx, 300, family, 50);
    const unitPx = big * 0.31;
    ctx.font = fontStr(300, big, family);
    const value = card.value || '';
    const vw = ctx.measureText(value).width;
    ctx.font = fontStr(300, unitPx, family);
    const uw = card.unit ? ctx.measureText(card.unit).width + 4 : 0;
    const detail = card.detail || 'none';
    const centre = detail === 'wave' ? 112 : detail === 'cross' ? 106 : 127;
    const x0 = centre - (vw + uw) / 2 + (detail === 'cross' ? uw / 2 : 0);
    const n0 = parseColor((card.numeral && card.numeral[0]) || '#ffffff');
    const n1 = parseColor((card.numeral && card.numeral[1]) || '#ffffff');
    const grad = ctx.createLinearGradient(x0, 0, x0 + vw, 0);
    grad.addColorStop(0, rgba(n0, 1));
    grad.addColorStop(1, rgba(n1, 1));

    // Detail graphic beneath numeral
    if (detail === 'ring') {
      const cx0 = 126, cy0 = 156;
      for (let i = 0; i < 132; i++) {
        const a = (i / 132) * Math.PI * 2 - Math.PI / 2;
        const seedLen = 0.5 + 0.5 * Math.sin(i * 12.9898) * Math.sin(i * 4.1414 + 1.3);
        const top = 0.5 + 0.5 * Math.cos(a + Math.PI / 2);
        const len = 4 + 4.5 * Math.abs(seedLen) + 2 * top;
        const fade = 0.22 + 0.5 * top * top;
        ctx.strokeStyle = rgba(accent, fade);
        ctx.lineWidth = 1.0 + 0.7 * top;
        const r1 = 68;
        ctx.beginPath();
        ctx.moveTo(cx0 + Math.cos(a) * r1, cy0 + Math.sin(a) * r1);
        ctx.lineTo(cx0 + Math.cos(a) * (r1 + len), cy0 + Math.sin(a) * (r1 + len));
        ctx.stroke();
      }
    } else if (detail === 'slider') {
      const pct = Math.max(0, Math.min(100, parseFloat(value) * (parseFloat(value) <= 10 ? 18 : 1) || 35)) / 100;
      const xa = 24, xb = 232, y = 197.5;
      const kx = xa + 4 + (xb - xa - 8) * Math.min(0.95, Math.max(0.15, pct)) * 0.86;
      const lg = ctx.createLinearGradient(xa, 0, xb, 0);
      lg.addColorStop(0, rgba(accent, 0.15));
      lg.addColorStop(Math.max(0.01, (kx - xa) / (xb - xa)), rgba(accent, 0.85));
      lg.addColorStop(1, rgba(accent, 0.35));
      ctx.fillStyle = lg;
      ctx.fillRect(xa, y - 0.6, xb - xa, 1.2);
      ctx.save();
      ctx.shadowColor = rgba(accent, 0.95);
      ctx.shadowBlur = 9 * k;
      ctx.fillStyle = rgba(white, 1);
      ctx.beginPath();
      ctx.arc(kx, y, 4.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      const lab = card.labels || [];
      const lpx = sizeForCap(ctx, 400, family, 5.2, 'H');
      ctx.font = fontStr(400, lpx, family);
      ctx.fillStyle = rgba(white, 0.6);
      if (lab[0]) ctx.fillText(lab[0], 14, 208);
      if (lab[1]) {
        ctx.textAlign = 'right';
        ctx.fillText(lab[1], 230, 208);
        ctx.textAlign = 'left';
      }
    } else if (detail === 'wave') {
      ctx.fillStyle = 'rgba(20, 0, 8, 0.32)';
      ctx.beginPath();
      ctx.arc(27, 157, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = rgba(white, 0.75);
      ctx.lineWidth = 0.9;
      const plus = (px, py, r) => {
        ctx.beginPath();
        ctx.moveTo(px - r, py);
        ctx.lineTo(px + r, py);
        ctx.moveTo(px, py - r);
        ctx.lineTo(px, py + r);
        ctx.stroke();
      };
      plus(27, 157, 3);
      plus(199, 157, 3);
      for (let i = 0; i < 56; i++) {
        const x = 43 + i * 3;
        const r1 = Math.abs(Math.sin(i * 1.7 + 0.4) * Math.cos(i * 0.53));
        const hh = 1.5 + 6.5 * r1;
        const mark = i === 23;
        ctx.fillStyle = mark ? rgba(accent, 0.95) : rgba(white, 0.3);
        ctx.fillRect(x, 204 - (mark ? 8 : hh), mark ? 1.4 : 0.9, mark ? 16 : hh * 2);
      }
    } else if (detail === 'cross') {
      ctx.fillStyle = rgba(white, 0.28);
      ctx.fillRect(105.5, 66, 0.8, 182);
      ctx.fillRect(12, 156.5, 186, 0.8);
      const lab = card.labels || [];
      ctx.font = fontStr(300, big * 0.72, family);
      ctx.fillStyle = rgba(white, 0.07);
      ctx.textAlign = 'center';
      ctx.fillText(value, 106, 122);
      ctx.textAlign = 'left';
      const badge = (x, y, t) => {
        ctx.fillStyle = 'rgba(10, 0, 30, 0.35)';
        ctx.beginPath();
        ctx.arc(x, y, 6.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = rgba(white, 0.7);
        ctx.font = fontStr(500, 4.2, family);
        ctx.textAlign = 'center';
        ctx.fillText(t, x, y + 1.5);
        ctx.textAlign = 'left';
      };
      if (lab[1]) badge(28, 137, lab[1]);
      if (lab[2]) badge(181, 170, lab[2]);
      if (lab[0]) {
        ctx.font = fontStr(400, 5.2, family);
        const tw = ctx.measureText(lab[0]).width;
        const px = 208 - tw - 10;
        ctx.fillStyle = rgba(white, 0.1);
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(px, 25, tw + 10, 11, 3);
        else ctx.rect(px, 25, tw + 10, 11);
        ctx.fill();
        ctx.fillStyle = rgba(white, 0.55);
        ctx.fillText(lab[0], px + 5, 32.5);
      }
    }

    ctx.save();
    ctx.shadowColor = rgba(n1, 0.35);
    ctx.shadowBlur = 10 * k;
    ctx.font = fontStr(300, big, family);
    ctx.fillStyle = grad;
    ctx.fillText(value, x0, 186);
    if (card.unit) {
      ctx.font = fontStr(300, unitPx, family);
      ctx.fillStyle = rgba(n1, 1);
      ctx.fillText(card.unit, x0 + vw + 4, 186 - 50 + unitPx * 0.72);
    }
    ctx.restore();
  }

  function glowShape(pose) {
    const px = pose[0], pz = pose[1], ps = pose[2];
    const c = Math.cos(ps);
    const sn = Math.sin(ps);
    if (c <= 0.02) return [0, 1, 0];
    const A = px;
    const B = FOCAL + pz;
    const tNear = B - 0.5 * CW * Math.abs(sn);
    let m = 0, mx = 0, mxx = 0;
    for (let u = -360; u <= 360; u += 3) {
      const h = Math.exp(-Math.pow(Math.abs(u - 9) / 138, 4));
      if (h < 0.003) continue;
      const k = u / 1.8 / FOCAL;
      const den = sn * k - c;
      if (Math.abs(den) < 1e-4) continue;
      const s = (A - B * k) / den;
      const t = B + s * sn;
      if (t < 4) continue;
      if ((u / 1.8 / FOCAL) * t * sn - t * c >= 0) continue;
      const dsdk = (B * c - A * sn) / (den * den);
      const soft = Math.min(Math.abs(dsdk / FOCAL) * 2.2, 40) + 0.5;
      const cov = Math.max(0, Math.min(1, (CW * 0.5 - Math.abs(s)) / soft + 0.5));
      if (cov <= 0) continue;
      const near = Math.min(1, FOCAL / t);
      const rel = Math.exp(-Math.pow(Math.max(t - tNear, 0) / 36, 1.5));
      const w = cov * near * near * rel * c * h;
      m += w;
      mx += w * u;
      mxx += w * u * u;
    }
    if (m < 0.5) return [0, 1, 0];
    const mu = mx / m;
    const sd = Math.sqrt(Math.max(1, mxx / m - mu * mu));
    const r = Math.max(6, sd / 0.581);
    return [mu, r, (m * 3) / (1.813 * r)];
  }

  /* ------------------------------------------------------------------ */
  /* WebGL2 Renderer (Transparent Premultiplied Alpha over Dark Bg)      */
  /* ------------------------------------------------------------------ */
  const VERT = `#version 300 es
in vec2 aPos;
void main(){ gl_Position = vec4(aPos, 0.0, 1.0); }`;

  const FRAG = `#version 300 es
precision highp float;
precision highp sampler2DArray;
uniform sampler2DArray uTex;
uniform vec2 uRes;
uniform float uUnit;
uniform vec4 uPose[8];
uniform vec3 uGlowCol[8];
uniform vec3 uGlowShape[8];
uniform float uWarp;
uniform float uMix;
out vec4 outColor;

const float F = ${FOCAL.toFixed(2)};
const float CW = ${CW.toFixed(1)};
const float CH = ${CH.toFixed(1)};
const float CR = ${CR.toFixed(1)};

float lensH(float a){
  if (a <= 232.0) return a;
  float k[9] = float[9](232.0, 238.0, 245.0, 253.0, 262.0, 275.0, 295.0, 325.0, 360.0);
  float d[9] = float[9](1.1759, 1.0671, 1.0156, 1.0965, 0.6487, 0.2700, -0.1991, -0.4782, -0.0318);
  float s = 232.0;
  for (int i = 0; i < 8; i++){
    if (a <= k[i]) break;
    float x = min(a, k[i+1]);
    float t = (x - k[i]) / (k[i+1] - k[i]);
    s += (x - k[i]) * mix(1.0, mix(d[i], d[i+1], t * 0.5), uWarp);
  }
  if (a > 360.0) s += (a - 360.0) * mix(1.0, d[8], uWarp);
  return s;
}

float lensS(float a){
  float t = clamp((a - 262.0) / 93.0, 0.0, 2.0);
  return 1.0 + uWarp * (0.42 * pow(t, 1.5) + 0.045 * smoothstep(320.0, 360.0, a));
}

float sdRound(vec2 p, vec2 b, float r){
  vec2 q = abs(p) - b + r;
  return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;
}

vec4 shadeCard(vec4 pose, vec2 ps, float fx, float fy, out float depth){
  depth = 1e9;
  if (pose.w < 0.0) return vec4(0.0);
  float k = ps.x / F;
  float c = cos(pose.z), sn = sin(pose.z);
  float den = sn * k - c;
  if (abs(den) < 1e-5) return vec4(0.0);
  float A = pose.x, B = F + pose.y;
  float s = (A - B * k) / den;
  float t = B + s * sn;
  if (t < 4.0) return vec4(0.0);
  float y = t * ps.y / F;
  float dsdk = (B * c - A * sn) / (den * den);
  float fs = min(abs(dsdk / F) * fx, 48.0);
  float fyc = min(t / F * fy, 48.0);
  vec2 p = vec2(s, y);
  float d = sdRound(p, vec2(CW, CH) * 0.5, CR);
  vec2 q = abs(p) - vec2(CW, CH) * 0.5 + CR;
  vec2 n = q.x > q.y ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  if (q.x > 0.0 && q.y > 0.0) n = normalize(q);
  float fp = length(vec2(fs * n.x, fyc * n.y)) + 1e-4;
  if (d > fp) return vec4(0.0);
  float cov = clamp(0.5 - d / fp, 0.0, 1.0);
  if (cov <= 0.0) return vec4(0.0);
  vec2 uv = vec2(s / CW + 0.5, 0.5 - y / CH);
  vec4 tex = textureGrad(uTex, vec3(uv, pose.w), vec2(fs / CW, 0.0), vec2(0.0, fyc / CH));
  depth = t;
  return vec4(tex.rgb, 1.0) * cov;
}

vec4 scene(vec2 ps, float fx, float fy, int base){
  vec4 col[4];
  float dep[4];
  for (int i = 0; i < 4; i++) col[i] = shadeCard(uPose[base + i], ps, fx, fy, dep[i]);
  for (int i = 0; i < 3; i++)
    for (int j = 0; j < 3; j++)
      if (j < 3 - i && dep[j] > dep[j+1]) {
        float td = dep[j]; dep[j] = dep[j+1]; dep[j+1] = td;
        vec4 tc = col[j]; col[j] = col[j+1]; col[j+1] = tc;
      }
  vec4 acc = vec4(0.0);
  for (int i = 0; i < 4; i++) acc += (1.0 - acc.a) * col[i];
  return acc;
}

vec4 glowAt(vec2 pu, float halfH, int base){
  vec4 sum = vec4(0.0);
  float gH = min(halfH, 288.0);
  float dy = min(abs((gH - 11.0) - pu.y), abs(pu.y + (gH - 12.0)));
  if (dy > 40.0) return sum;
  for (int i = 0; i < 4; i++){
    vec3 sh = uGlowShape[base + i];
    if (sh.z <= 0.0) continue;
    float E = exp(-pow(abs(pu.x - sh.x) / sh.y, 4.0));
    if (E < 0.002) continue;
    float v = exp(-pow(dy / (18.5 * (0.45 + 0.55 * sqrt(E))), 3.0));
    float w = sh.z * E * v;
    sum += vec4(uGlowCol[base + i] * w, w);
  }
  return sum;
}

vec4 bgGlow(vec2 pu, float halfH, int base){
  vec4 g = glowAt(pu, halfH, base);
  if (g.a <= 0.0005) return vec4(0.0);
  float I = clamp(g.a, 0.0, 1.0);
  vec3 gc = g.rgb / g.a;
  float alpha = pow(I, 1.05) * 0.58;
  return vec4(gc * alpha, alpha);
}

vec4 render(vec2 pu, float halfH, int base){
  float au = min(abs(pu.x), 360.0);
  float px = 1.0 / uUnit;
  vec4 bg = bgGlow(pu, halfH, base);
  if (au < 236.0 || uWarp <= 0.0) {
    vec4 c = scene(pu, px, px, base);
    return vec4(c.rgb + (1.0 - c.a) * bg.rgb, c.a + (1.0 - c.a) * bg.a);
  }
  float e = 0.064 * uWarp * smoothstep(275.0, 360.0, au);
  float S0 = lensS(au);
  float sg = pu.x < 0.0 ? -1.0 : 1.0;
  float blur = 1.0 + 30.0 * pow(smoothstep(240.0, 340.0, au), 1.5) * uWarp;
  float fyb = 1.0 + 15.0 * smoothstep(280.0, 352.0, au) * uWarp;
  float gain = 1.0 + 0.17 * smoothstep(285.0, 350.0, au) * uWarp;
  vec3 acc;
  vec3 ca;
  for (int ch = 0; ch < 3; ch++){
    float off = uWarp * (ch == 0 ? -20.92 : (ch == 1 ? 0.0 : 11.91));
    float h = lensH(au) + off * smoothstep(289.8, 344.9, au);
    float h0 = lensH(au - 0.5) + off * smoothstep(289.8, 344.9, au - 0.5);
    float h1 = lensH(au + 0.5) + off * smoothstep(289.8, 344.9, au + 0.5);
    float fx = px * max(abs(h1 - h0), 0.02) * blur;
    float S = S0 * (ch == 0 ? 1.0 + e : (ch == 1 ? 1.0 : 1.0 - e));
    vec4 c = scene(vec2(sg * h, pu.y / S), fx, px / S * fyb, base);
    c.rgb = min(c.rgb * gain, vec3(c.a));
    ca[ch] = c.a;
    acc[ch] = (c.rgb + (1.0 - c.a) * bg.rgb)[ch];
  }
  float maxA = max(max(ca.r, ca.g), ca.b);
  return vec4(acc, clamp(maxA + (1.0 - maxA) * bg.a, 0.0, 1.0));
}

void main(){
  vec2 fc = gl_FragCoord.xy;
  vec2 pu = (fc - 0.5 * uRes) / uUnit;
  float halfH = 0.5 * uRes.y / uUnit;
  vec4 col = render(pu, halfH, 0);
  if (uMix > 0.0) col = mix(col, render(pu, halfH, 4), uMix);
  outColor = col;
}`;

  function createGL(canvas) {
    const gl = canvas.getContext('webgl2', {
      antialias: false,
      alpha: true,
      premultipliedAlpha: true,
      preserveDrawingBuffer: false
    });
    if (!gl) return null;
    const sh = (type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.warn('[WarpCarousel GLSL]', gl.getShaderInfoLog(s));
        return null;
      }
      return s;
    };
    const vs = sh(gl.VERTEX_SHADER, VERT);
    const fs = sh(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return null;
    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.bindAttribLocation(prog, 0, 'aPos');
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.warn('[WarpCarousel Program]', gl.getProgramInfoLog(prog));
      return null;
    }
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    const tex = gl.createTexture();
    const loc = {};
    ['uTex', 'uRes', 'uUnit', 'uPose', 'uGlowCol', 'uGlowShape', 'uWarp', 'uMix'].forEach((n) => {
      loc[n] = gl.getUniformLocation(prog, n);
    });
    const aniso = gl.getExtension('EXT_texture_filter_anisotropic');
    return { gl, prog, tex, loc, aniso, layers: 0, texW: 0 };
  }

  function uploadCards(st, canvases) {
    const gl = st.gl;
    const tex = st.tex;
    const w = canvases[0].width;
    const h = canvases[0].height;
    gl.bindTexture(gl.TEXTURE_2D_ARRAY, tex);
    gl.texImage3D(gl.TEXTURE_2D_ARRAY, 0, gl.RGBA8, w, h, canvases.length, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    canvases.forEach((cv, i) => {
      gl.texSubImage3D(gl.TEXTURE_2D_ARRAY, 0, 0, 0, i, w, h, 1, gl.RGBA, gl.UNSIGNED_BYTE, cv);
    });
    gl.generateMipmap(gl.TEXTURE_2D_ARRAY);
    gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    if (st.aniso) {
      gl.texParameterf(gl.TEXTURE_2D_ARRAY, st.aniso.TEXTURE_MAX_ANISOTROPY_EXT, 8);
    }
    st.layers = canvases.length;
    st.texW = w;
  }

  /* ------------------------------------------------------------------ */
  /* Canvas 2D Fallback (Transparent background)                         */
  /* ------------------------------------------------------------------ */
  function drawFallback(ctx, w, h, unit, poses, canvases, glows) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, w, h);
    const gH = Math.min(h / 2 / unit, 288);
    for (let pi = 0; pi < poses.length; pi++) {
      const p = poses[pi];
      if (p.layer < 0) continue;
      const gs = glowShape(p.pose);
      const a = Math.min(1, gs[2]) * 0.55;
      if (a < 0.01) continue;
      const rx = gs[1] * 1.35 * unit;
      const col = glows[p.layer] || [127, 208, 240];
      const rgb = col[0] + ', ' + col[1] + ', ' + col[2];
      [h / 2 - (gH - 11) * unit, h / 2 + (gH - 12) * unit].forEach((yy) => {
        ctx.save();
        ctx.translate(w / 2 + gs[0] * unit, yy);
        ctx.scale(1, (20 * unit) / rx);
        const rg = ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
        rg.addColorStop(0, 'rgba(' + rgb + ', ' + a + ')');
        rg.addColorStop(0.55, 'rgba(' + rgb + ', ' + (a * 0.55) + ')');
        rg.addColorStop(1, 'rgba(' + rgb + ', 0)');
        ctx.fillStyle = rg;
        ctx.fillRect(-rx, -rx, rx * 2, rx * 2);
        ctx.restore();
      });
    }

    const proj = (X, Zb, Y) => {
      const D = FOCAL + Zb;
      return [w / 2 + ((X * FOCAL) / D) * unit, h / 2 - ((Y * FOCAL) / D) * unit];
    };
    const items = poses
      .filter((p) => p.layer >= 0)
      .map((p) => ({ pose: p.pose, layer: p.layer, depth: p.pose[1] }))
      .sort((a, b) => b.depth - a.depth);
    const strips = 32;
    const eps = 1.5 / Math.max(unit, 0.25);
    const half = CW / 2;
    const edgeY = (sv) => {
      const dx = Math.abs(sv) - (half - CR);
      if (dx <= 0) return CH / 2;
      return CH / 2 - CR + Math.sqrt(Math.max(0, CR * CR - Math.pow(Math.min(dx, CR), 2)));
    };
    for (let kidx = 0; kidx < items.length; kidx++) {
      const it = items[kidx];
      const cx = it.pose[0], zb = it.pose[1], psi = it.pose[2];
      const cv = canvases[it.layer];
      if (!cv) continue;
      const tpu = cv.width / CW;
      const cs = Math.cos(psi);
      const sn = Math.sin(psi);
      const at = (sv, y) => proj(cx + sv * cs, zb + sv * sn, y);
      for (let i = 0; i < strips; i++) {
        const s0 = -half + (CW * i) / strips - (i > 0 ? eps : 0);
        const s1 = -half + (CW * (i + 1)) / strips + (i < strips - 1 ? eps : 0);
        if (FOCAL + zb + s0 * sn < 10 || FOCAL + zb + s1 * sn < 10) continue;
        const n = Math.abs(s0) > half - CR - 1 || Math.abs(s1) > half - CR - 1 ? 6 : 1;
        ctx.save();
        ctx.beginPath();
        for (let k = 0; k <= n; k++) {
          const sv = Math.max(-half, Math.min(half, s0 + ((s1 - s0) * k) / n));
          const pt = at(sv, edgeY(sv));
          if (k === 0) ctx.moveTo(pt[0], pt[1]);
          else ctx.lineTo(pt[0], pt[1]);
        }
        for (let k = n; k >= 0; k--) {
          const sv = Math.max(-half, Math.min(half, s0 + ((s1 - s0) * k) / n));
          const pt = at(sv, -edgeY(sv));
          ctx.lineTo(pt[0], pt[1]);
        }
        ctx.closePath();
        ctx.clip();
        const sm = (s0 + s1) / 2;
        const tl = at(s0, CH / 2);
        const tr = at(s1, CH / 2);
        const mt = at(sm, CH / 2);
        const mb = at(sm, -CH / 2);
        const sx0 = (s0 + half) * tpu;
        const sw = (s1 - s0) * tpu;
        const ov = 1.025;
        const a = (tr[0] - tl[0]) / sw;
        const b = (tr[1] - tl[1]) / sw;
        const c = ((mb[0] - mt[0]) / cv.height) * ov;
        const d = ((mb[1] - mt[1]) / cv.height) * ov;
        const smx = (sm + half) * tpu;
        const ox = (mt[0] + mb[0]) / 2 - a * smx - c * (cv.height / 2);
        const oy = (mt[1] + mb[1]) / 2 - b * smx - d * (cv.height / 2);
        ctx.setTransform(a, b, c, d, ox, oy);
        const x0 = Math.max(0, sx0 - 1);
        const x1 = Math.min(cv.width, sx0 + sw + 1);
        ctx.drawImage(cv, x0, 0, x1 - x0, cv.height, x0, 0, x1 - x0, cv.height);
        ctx.restore();
      }
    }
  }

  /* ------------------------------------------------------------------ */
  /* Public Instance Factory                                             */
  /* ------------------------------------------------------------------ */
  window.createMediqWarpCarousel = function createMediqWarpCarousel(options) {
    const container = options.container;
    if (!container) return null;

    const canvas = document.createElement('canvas');
    canvas.id = 'at-work-warp-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;';
    container.innerHTML = '';
    container.appendChild(canvas);

    let gls = createGL(canvas);
    let ctx2d = gls ? null : canvas.getContext('2d');
    let rawCards = [];
    let list = [];
    let realCount = 1;
    let N = 4;
    let glowCols = [];
    let cardCanvases = [];
    let texW = 0;
    let W = 2;
    let H = 2;
    let unit = 1;
    let raf = 0;
    let autoTimer = 0;
    let paused = true;
    let inView = true;
    let isDocVisible = typeof document === 'undefined' || document.visibilityState === 'visible';
    let restDrawn = false;
    let disposed = false;

    const gap = options.interval || 4.0;
    const stepN = options.step || 1;
    const warp = options.warp !== undefined ? options.warp : 1.0;
    const font = options.font || DEFAULT_FONT;
    const rmq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };

    const L = {
      index: 0,
      P: 0,
      from: 0,
      to: 0,
      t0: 0,
      n: STEP_FRAMES,
      v: 0,
      mode: 'rest',
      nextAuto: Infinity,
      autoPending: false,
      fadeFrom: 0,
      fadeT0: 0,
      dragX: 0,
      dragP: 0,
      downX: 0,
      moved: false,
      lastT: 0,
      hiddenAt: 0
    };

    const poseArr = new Float32Array(32);
    const glowArr = new Float32Array(24);
    const shapeArr = new Float32Array(24);
    const setBufA = Array.from({ length: 4 }, () => ({ pose: [0, 0, 0], layer: -1 }));
    const setBufB = Array.from({ length: 4 }, () => ({ pose: [0, 0, 0], layer: -1 }));
    const topC = new Int32Array(4);
    const topQ = new Float64Array(4);
    const topAbs = new Float64Array(4);

    const imageCache = new Map();
    let pendingImgRedraw = 0;

    function getPackshotImage(src) {
      if (!src) return null;
      let rec = imageCache.get(src);
      if (rec) return rec;
      const img = new Image();
      img.decoding = 'async';
      rec = { img };
      imageCache.set(src, rec);
      img.onload = () => {
        if (disposed || pendingImgRedraw) return;
        pendingImgRedraw = requestAnimationFrame(() => {
          pendingImgRedraw = 0;
          if (disposed || !list.length) return;
          texW = 0;
          resize();
          if (!paused && inView) draw(performance.now() / 1000);
        });
      };
      img.src = src;
      return rec;
    }

    function paintAll(w) {
      if (!list.length) return;
      cardCanvases = list.map((card) => {
        if (card.image) {
          const rec = getPackshotImage(card.image);
          card._imgEl = rec ? rec.img : null;
        }
        const cv = document.createElement('canvas');
        cv.width = w;
        cv.height = Math.round((w * CH) / CW);
        paintCard(cv, card, font);
        return cv;
      });
      texW = w;
      if (gls) {
        uploadCards(gls, cardCanvases);
        // Free temporary 2D card bitmaps immediately once uploaded to WebGL TEXTURE_2D_ARRAY
        for (let i = 0; i < cardCanvases.length; i++) {
          cardCanvases[i].width = 0;
          cardCanvases[i].height = 0;
        }
        cardCanvases = [];
      }
      restDrawn = false;
    }

    function resize() {
      const r = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const nextW = Math.max(2, Math.round((r.width || window.innerWidth) * dpr));
      const nextH = Math.max(2, Math.round((r.height || (window.innerHeight - 128)) * dpr));
      if (nextW !== W || nextH !== H) {
        W = nextW;
        H = nextH;
        canvas.width = W;
        canvas.height = H;
        restDrawn = false;
      }
      unit = Math.min(W / 720, H / 440);
      const want = Math.min(1024, Math.max(256, Math.round(CW * unit * 1.25)));
      if (list.length && want !== texW) paintAll(want);
    }

    function poseSet(P, out) {
      const target = out || setBufA;
      let count = 0;
      for (let c = 0; c < N; c++) {
        const q = mod(c - P + N / 2, N) - N / 2;
        const aq = Math.abs(q);
        let pos = count < 4 ? count : -1;
        if (pos === -1 && aq < topAbs[3]) pos = 3;
        if (pos !== -1) {
          let k = pos;
          while (k > 0 && aq < topAbs[k - 1]) {
            topC[k] = topC[k - 1];
            topQ[k] = topQ[k - 1];
            topAbs[k] = topAbs[k - 1];
            k--;
          }
          topC[k] = c;
          topQ[k] = q;
          topAbs[k] = aq;
          if (count < 4) count++;
        }
      }
      for (let i = 0; i < 4; i++) {
        const slot = target[i];
        if (i >= count || topAbs[i] > 2.05) {
          slot.pose[0] = 0;
          slot.pose[1] = 0;
          slot.pose[2] = 0;
          slot.layer = -1;
        } else {
          const p = poseAt(topQ[i]);
          slot.pose[0] = p[0];
          slot.pose[1] = p[1];
          slot.pose[2] = p[2];
          slot.layer = topC[i];
        }
      }
      return target;
    }

    function fill(set, off) {
      for (let i = 0; i < set.length; i++) {
        const s = set[i];
        const j = off + i;
        poseArr[j * 4] = s.pose[0];
        poseArr[j * 4 + 1] = s.pose[1];
        poseArr[j * 4 + 2] = s.pose[2];
        poseArr[j * 4 + 3] = s.layer;
        const gc = s.layer >= 0 ? glowCols[s.layer] : [255, 255, 255];
        glowArr[j * 3] = gc[0] / 255;
        glowArr[j * 3 + 1] = gc[1] / 255;
        glowArr[j * 3 + 2] = gc[2] / 255;
        const gs = s.layer >= 0 ? glowShape(s.pose) : [0, 1, 0];
        shapeArr[j * 3] = gs[0];
        shapeArr[j * 3 + 1] = gs[1];
        shapeArr[j * 3 + 2] = gs[2];
      }
    }

    function progressAt(now) {
      if (L.mode === 'spin') {
        const f = (now - L.t0) * 30;
        L.P = L.from + (L.to - L.from) * spinN(f, L.n);
        if (f >= L.n) L.mode = 'rest';
      } else if (L.mode === 'spring') {
        const dt = Math.min(0.034, Math.max(0, now - L.lastT));
        L.lastT = now;
        const sub = 4;
        for (let i = 0; i < sub; i++) {
          const acc = -60 * (L.P - L.to) - 13 * L.v;
          L.v += (acc * dt) / sub;
          L.P += (L.v * dt) / sub;
        }
        if (Math.abs(L.P - L.to) < 4e-4 && Math.abs(L.v) < 3e-3) {
          L.P = L.to;
          L.v = 0;
          L.mode = 'rest';
        }
      } else if (L.mode === 'fade') {
        const m = Math.min(1, (now - L.fadeT0) / 0.45);
        if (m >= 1) L.mode = 'rest';
        return { P: L.P, Pb: L.fadeFrom, mix: 1 - m * m * (3 - 2 * m) };
      }
      return { P: L.P, Pb: 0, mix: 0 };
    }

    function draw(now) {
      if (disposed || !list.length) return 0;
      const st = progressAt(now);
      const setA = poseSet(st.P, setBufA);
      if (gls) {
        const gl = gls.gl;
        const loc = gls.loc;
        gl.viewport(0, 0, W, H);
        gl.useProgram(gls.prog);
        fill(setA, 0);
        if (st.mix > 0) fill(poseSet(st.Pb, setBufB), 4);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D_ARRAY, gls.tex);
        gl.uniform1i(loc.uTex, 0);
        gl.uniform2f(loc.uRes, W, H);
        gl.uniform1f(loc.uUnit, unit);
        gl.uniform4fv(loc.uPose, poseArr);
        gl.uniform3fv(loc.uGlowCol, glowArr);
        gl.uniform3fv(loc.uGlowShape, shapeArr);
        gl.uniform1f(loc.uWarp, warp);
        gl.uniform1f(loc.uMix, st.mix);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      } else if (ctx2d) {
        drawFallback(ctx2d, W, H, unit, setA, cardCanvases, glowCols);
      }
      return st.mix;
    }

    function clearAutoTimer() {
      if (autoTimer) {
        clearTimeout(autoTimer);
        autoTimer = 0;
      }
    }

    function scheduleAuto(now) {
      clearAutoTimer();
      if (disposed || paused || !inView || !isDocVisible || rmq.matches || !Number.isFinite(L.nextAuto)) return;
      const delayMs = Math.max(16, (L.nextAuto - now) * 1000);
      autoTimer = setTimeout(() => {
        autoTimer = 0;
        if (!disposed && !paused && inView && isDocVisible) kick();
      }, delayMs);
    }

    let inLoop = false;

    function loop() {
      raf = 0;
      clearAutoTimer();
      if (disposed || paused || !inView || !isDocVisible) return;
      inLoop = true;
      try {
        const now = performance.now() / 1000;
        if (!rmq.matches && L.mode !== 'drag' && L.mode !== 'spring' && now >= L.nextAuto) {
          L.nextAuto = Math.max(L.nextAuto + gap, now + gap * 0.5);
          L.autoPending = true;
          goToIndex(L.index + stepN, true);
        }
        if (L.mode === 'rest') {
          if (!restDrawn) {
            const mix = draw(now);
            restDrawn = mix === 0;
          }
          if (restDrawn) {
            scheduleAuto(now);
            return;
          }
        } else {
          restDrawn = false;
          const mix = draw(now);
          if (L.mode === 'rest' && mix === 0) {
            restDrawn = true;
            scheduleAuto(now);
            return;
          }
        }
        if (!raf && !disposed && !paused && inView && isDocVisible) {
          raf = requestAnimationFrame(loop);
        }
      } finally {
        inLoop = false;
      }
    }

    function kick() {
      if (!inLoop && !raf && !disposed && !paused && inView && isDocVisible) {
        clearAutoTimer();
        raf = requestAnimationFrame(loop);
      }
    }

    function goToIndex(next, isAuto) {
      if (!realCount) return;
      const prev = L.index;
      L.index = next;
      const realIdx = mod(next, realCount);
      if (options.onIndexChange) options.onIndexChange(realIdx, rawCards[realIdx]);
      if (prev === next) return;
      const delta = next - prev;
      const now = performance.now() / 1000;
      L.autoPending = false;
      restDrawn = false;
      if (rmq.matches) {
        L.fadeFrom = L.P;
        L.P = Math.round(L.P) + delta;
        L.mode = 'fade';
        L.fadeT0 = now;
      } else if (L.mode !== 'spring') {
        const base = Math.round(L.P - DRIFT) + delta;
        L.from = L.P;
        L.to = base + DRIFT;
        L.t0 = now;
        L.n = isAuto ? gap * 30 : STEP_FRAMES;
        L.mode = 'spin';
      }
      if (!isAuto) L.nextAuto = now + gap;
      kick();
    }

    // Pointer Interactions (Drag to Spin, Click Wings to Step, Click Center Front Card to Inspect)
    container.addEventListener('pointerdown', (e) => {
      if (paused || e.button > 0) return;
      if (e.target && e.target.closest('button, a, input')) return;
      if (container.setPointerCapture) {
        try { container.setPointerCapture(e.pointerId); } catch (_) {}
      }
      L.mode = 'drag';
      L.dragX = e.clientX;
      L.downX = e.clientX;
      L.dragP = L.P;
      L.v = 0;
      L.moved = false;
      L.lastT = performance.now() / 1000;
      container.style.cursor = 'grabbing';
      kick();
    });

    container.addEventListener('pointermove', (e) => {
      const r = container.getBoundingClientRect();
      const unitCss = Math.min((r.width || 1) / 720, (r.height || 1) / 440);
      if (L.mode !== 'drag') {
        const uHover = (e.clientX - r.left - r.width / 2) / Math.max(0.01, unitCss);
        container.style.cursor = Math.abs(uHover) <= 148 ? 'pointer' : 'grab';
        return;
      }
      const now = performance.now() / 1000;
      const P = L.dragP - (e.clientX - L.dragX) / (Math.max(0.01, unitCss) * 300);
      const dt = Math.max(1 / 240, now - L.lastT);
      L.v = 0.6 * L.v + 0.4 * ((P - L.P) / dt);
      L.P = P;
      L.lastT = now;
      if (Math.abs(e.clientX - L.downX) > 6) L.moved = true;
      restDrawn = false;
      kick();
    });

    const handlePointerEnd = (e) => {
      if (L.mode !== 'drag') return;
      container.style.cursor = 'pointer';
      const now = performance.now() / 1000;
      L.nextAuto = now + gap;
      if (!L.moved) {
        L.mode = 'rest';
        const r = container.getBoundingClientRect();
        const unitCss = Math.min((r.width || 1) / 720, (r.height || 1) / 440);
        const u = (e.clientX - r.left - r.width / 2) / Math.max(0.01, unitCss);
        if (u > 148) {
          goToIndex(L.index + 1, false);
        } else if (u < -148) {
          goToIndex(L.index - 1, false);
        } else {
          // Center card clicked -> open RAYONE EMV detail showcase modal!
          const realIdx = mod(Math.round(L.P), realCount);
          const item = rawCards[realIdx];
          if (item && options.onFrontClick) {
            options.onFrontClick(item, realIdx);
          }
        }
        return;
      }
      if (now - L.lastT > 0.08) L.v = 0;
      const target = Math.round(L.P + L.v * 0.16);
      const from = Math.round(L.dragP - DRIFT);
      L.to = target;
      L.mode = 'spring';
      L.lastT = now;
      const next = L.index + (target - from);
      if (next !== L.index) {
        L.index = next;
        const realIdx = mod(next, realCount);
        if (options.onIndexChange) options.onIndexChange(realIdx, rawCards[realIdx]);
      }
      kick();
    };
    container.addEventListener('pointerup', handlePointerEnd);
    container.addEventListener('pointercancel', handlePointerEnd);

    function syncActiveLoop() {
      if (disposed || paused || !inView || !isDocVisible) {
        clearAutoTimer();
        if (raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
        const now = performance.now() / 1000;
        if (!L.hiddenAt) L.hiddenAt = now;
      } else {
        const now = performance.now() / 1000;
        if (L.hiddenAt) {
          const pausedSec = Math.max(0, now - L.hiddenAt);
          if (L.mode === 'spin') L.t0 += pausedSec;
          if (L.mode === 'fade') L.fadeT0 += pausedSec;
          if (Number.isFinite(L.nextAuto)) L.nextAuto = Math.max(L.nextAuto + pausedSec, now + 0.35);
          L.lastT = now;
          L.hiddenAt = 0;
        }
        restDrawn = false;
        kick();
      }
    }

    // Track visible viewport with IntersectionObserver + page visibility so zero GPU work runs off-screen or hidden
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((ents) => {
        inView = ents.some((e) => e.isIntersecting);
        syncActiveLoop();
      }, { threshold: 0.01 });
      io.observe(container);
    }

    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        isDocVisible = document.visibilityState === 'visible';
        syncActiveLoop();
      });
    }

    const ro = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(() => {
          resize();
          if (!paused && inView && isDocVisible) {
            restDrawn = false;
            draw(performance.now() / 1000);
          }
        })
      : null;
    if (ro) ro.observe(container);

    let wheelAccum = 0;
    let lastWheelStepTs = 0;

    return {
      setCards(cards, startIndex) {
        rawCards = Array.isArray(cards) ? cards : [];
        if (!rawCards.length) return;
        const out = [];
        while (out.length < 4) out.push(...rawCards);
        list = out;
        realCount = rawCards.length;
        N = list.length;
        glowCols = list.map((c) => parseColor(c.glow || '#7fd0f0'));
        texW = 0; // force repaint

        const idx = startIndex || 0;
        const t0 = performance.now() / 1000;
        L.index = idx;
        if (!rmq.matches) {
          L.from = idx - stepN + DRIFT;
          L.to = idx + DRIFT;
          L.t0 = t0 - REST_PHASE / 30;
          L.n = STEP_FRAMES;
          L.mode = 'spin';
          L.P = L.from + (L.to - L.from) * spin(REST_PHASE);
          L.nextAuto = t0 + LEAD;
        } else {
          L.P = idx;
          L.mode = 'rest';
          L.nextAuto = t0 + gap;
        }
        L.hiddenAt = 0;
        restDrawn = false;
        resize();
        draw(t0);
        if (options.onIndexChange) {
          const ri = mod(idx, realCount);
          options.onIndexChange(ri, rawCards[ri]);
        }
        kick();
      },
      step(dir) {
        goToIndex(L.index + dir, false);
      },
      wheel(deltaY) {
        const now = performance.now();
        wheelAccum += deltaY;
        if (Math.abs(wheelAccum) >= 38 && now - lastWheelStepTs > 150) {
          const dir = wheelAccum > 0 ? 1 : -1;
          wheelAccum = 0;
          lastWheelStepTs = now;
          goToIndex(L.index + dir, false);
        }
      },
      openFront() {
        if (!realCount) return;
        const realIdx = mod(Math.round(L.P), realCount);
        const item = rawCards[realIdx];
        if (item && options.onFrontClick) options.onFrontClick(item, realIdx);
      },
      setPaused(isPaused) {
        const nextPaused = !!isPaused;
        if (nextPaused === paused && (paused || raf)) return;
        paused = nextPaused;
        syncActiveLoop();
        if (!paused && inView && isDocVisible) {
          resize();
          draw(performance.now() / 1000);
          kick();
        }
      }
    };
  };
})();
