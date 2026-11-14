(function () {
  "use strict";

  var MAX_TRAIL = 10;
  var INF = 1e20;
  var FROZEN_PULL = 0.32;
  var FROZEN_AT = 0.3;

  var UNIFORM_NAMES = [
    "uSdf",
    "uColorTex",
    "uSize",
    "uDpr",
    "uCanvasH",
    "uBlob",
    "uWarp",
    "uCount",
    "uSigma",
    "uBevel",
    "uHi",
    "uAccent",
    "uSpec",
    "uShade",
  ];

  var VERT_SRC = [
    "#version 300 es",
    "in vec2 aPos;",
    "void main() { gl_Position = vec4(aPos, 0.0, 1.0); }",
  ].join("\n");

  var FRAG_SRC = [
    "#version 300 es",
    "precision highp float;",
    "uniform sampler2D uSdf;",
    "uniform sampler2D uColorTex;",
    "uniform vec2 uSize;",
    "uniform float uDpr;",
    "uniform float uCanvasH;",
    "uniform vec4 uBlob[" + MAX_TRAIL + "];",
    "uniform vec2 uWarp[" + MAX_TRAIL + "];",
    "uniform int uCount;",
    "uniform float uSigma;",
    "uniform float uBevel;",
    "uniform vec3 uHi;",
    "uniform vec4 uAccent;",
    "uniform float uSpec;",
    "uniform float uShade;",
    "out vec4 outColor;",
    "",
    "float smin(float a, float b, float k) {",
    "  float h = max(k - abs(a - b), 0.0) / k;",
    "  return min(a, b) - h * h * k * 0.25;",
    "}",
    "",
    "float glyph(vec2 p, float soft) {",
    "  vec2 t = texture(uSdf, clamp(p / uSize, 0.0, 1.0)).rg;",
    "  return mix(t.r, t.g, soft);",
    "}",
    "",
    "float field(vec2 p, float soft, out float g0, out vec2 warpOut) {",
    "  vec2 warp = vec2(0.0);",
    "  float wsum = 0.0;",
    "  for (int i = 0; i < " + MAX_TRAIL + "; i++) {",
    "    if (i >= uCount) break;",
    "    vec2 d = p - uBlob[i].xy;",
    "    float g = exp(-dot(d, d) / max(1.0, uSigma * uSigma));",
    "    warp += uWarp[i] * g;",
    "    wsum += g;",
    "  }",
    "  warp /= max(1.0, wsum);",
    "  warpOut = warp;",
    "  float f = glyph(p - warp, soft);",
    "  g0 = f;",
    "  for (int i = 0; i < " + MAX_TRAIL + "; i++) {",
    "    if (i >= uCount) break;",
    "    float r = uBlob[i].z;",
    "    if (r < 0.05) continue;",
    "    float b = length(p - uBlob[i].xy) - r;",
    "    f = smin(f, b, r * 1.45);",
    "  }",
    "  return f;",
    "}",
    "",
    "void main() {",
    "  vec2 p = vec2(gl_FragCoord.x, uCanvasH - gl_FragCoord.y) / uDpr;",
    "  float g0;",
    "  vec2 warp;",
    "  float f = field(p, 0.0, g0, warp);",
    "  if (isnan(f) || isinf(f)) { outColor = vec4(0.0); return; }",
    "  float fw = max(fwidth(f), 1e-4);",
    "  float alpha = clamp(0.5 - f / fw, 0.0, 1.0);",
    "  if (alpha <= 0.0) { outColor = vec4(0.0); return; }",
    "",
    "  float e = 1.0;",
    "  float tmp;",
    "  vec2 tmpW;",
    "  vec2 grad = vec2(",
    "    field(p + vec2(e, 0.0), 1.0, tmp, tmpW) - field(p - vec2(e, 0.0), 1.0, tmp, tmpW),",
    "    field(p + vec2(0.0, e), 1.0, tmp, tmpW) - field(p - vec2(0.0, e), 1.0, tmp, tmpW)",
    "  ) / (2.0 * e);",
    "  float fs = field(p, 1.0, tmp, tmpW);",
    "  float gl = length(grad);",
    "  vec2 n2 = gl > 1e-4 ? grad / gl : vec2(0.0);",
    "",
    "  float s = 1.0 - clamp(-min(fs, f + 0.5) / uBevel, 0.0, 1.0);",
    "  s = pow(s, 1.6);",
    "  vec3 N = normalize(vec3(n2 * s, sqrt(max(0.0, 1.0 - s * s))));",
    "  vec3 L = normalize(vec3(-0.45, -0.7, 0.62));",
    "  float diff = clamp(dot(N, L), 0.0, 1.0);",
    "  vec3 H = normalize(L + vec3(0.0, 0.0, 1.0));",
    "  float spec = pow(max(dot(N, H), 0.0), 48.0);",
    "",
    "  vec3 inkCol = texture(uColorTex, clamp((p - warp) / uSize, 0.0, 1.0)).rgb;",
    "  float outsideGlyph = clamp(g0 / max(1.0, uBevel * 0.35), 0.0, 1.0);",
    "  vec3 col = mix(inkCol, vec3(0.45, 0.78, 0.98), outsideGlyph * 0.62);",
    "  col *= mix(1.0 - uShade, 1.0, diff);",
    "  float pulled = clamp((g0 - f) / (uBevel * 1.35), 0.0, 1.0);",
    "  col = mix(col, uAccent.rgb, pulled * uAccent.a);",
    "  col += uHi * spec * uSpec * (1.0 - outsideGlyph * 0.35);",
    "  outColor = vec4(col * alpha, alpha * mix(1.0, 0.84, outsideGlyph));",
    "}",
  ].join("\n");

  function checkWebGL2Support() {
    try {
      var probe = document.createElement("canvas");
      var ctx = probe.getContext("webgl2");
      var ok = !!ctx;
      if (ctx) {
        var ext = ctx.getExtension("WEBGL_lose_context");
        if (ext) ext.loseContext();
      }
      return ok;
    } catch (_err) {
      return false;
    }
  }

  function edt1d(grid, offset, stride, length, f, v, z) {
    v[0] = 0;
    z[0] = -INF;
    z[1] = INF;
    f[0] = grid[offset];
    var q, k, s, r, q2, qr;
    for (q = 1, k = 0, s = 0; q < length; q++) {
      f[q] = grid[offset + q * stride];
      q2 = q * q;
      do {
        r = v[k];
        s = (f[q] - f[r] + q2 - r * r) / (q - r) / 2;
      } while (s <= z[k] && --k > -1);
      k++;
      v[k] = q;
      z[k] = s;
      z[k + 1] = INF;
    }
    for (q = 0, k = 0; q < length; q++) {
      while (z[k + 1] < q) k++;
      r = v[k];
      qr = q - r;
      grid[offset + q * stride] = f[r] + qr * qr;
    }
  }

  function edt(grid, w, h, f, v, z) {
    for (var x = 0; x < w; x++) edt1d(grid, x, w, h, f, v, z);
    for (var y = 0; y < h; y++) edt1d(grid, y * w, 1, w, f, v, z);
  }

  function boxBlur(src, dst, len, lines, r, step, stride) {
    var span = 2 * r + 1;
    for (var line = 0; line < lines; line++) {
      var base = line * stride;
      var acc = 0;
      for (var k = -r; k <= r; k++) {
        var idx = Math.min(len - 1, Math.max(0, k));
        acc += src[base + idx * step];
      }
      for (var i = 0; i < len; i++) {
        dst[base + i * step] = acc / span;
        var outI = Math.max(0, i - r);
        var inI = Math.min(len - 1, i + r + 1);
        acc += src[base + inI * step] - src[base + outI * step];
      }
    }
  }

  function captureOriginalColors(h3) {
    if (!h3.dataset.srvColor) {
      h3.dataset.srvColor = getComputedStyle(h3).color || "#f4f7fb";
    }
    var spans = h3.querySelectorAll("span");
    for (var i = 0; i < spans.length; i++) {
      if (!spans[i].dataset.srvColor) {
        spans[i].dataset.srvColor =
          getComputedStyle(spans[i]).color || h3.dataset.srvColor;
      }
    }
  }

  function measureGlyphLayout(h3) {
    captureOriginalColors(h3);
    var h3Rect = h3.getBoundingClientRect();
    if (h3Rect.width < 16 || h3Rect.height < 16) return null;

    var layW = h3.offsetWidth || Math.ceil(h3Rect.width);
    var layH = h3.offsetHeight || Math.ceil(h3Rect.height);
    var sx = layW > 0 && h3Rect.width > 0 ? layW / h3Rect.width : 1;
    var sy = layH > 0 && h3Rect.height > 0 ? layH / h3Rect.height : 1;
    if (sx < 0.5 || sx > 2.0) sx = 1;
    if (sy < 0.5 || sy > 2.0) sy = 1;

    var h3Style = getComputedStyle(h3);
    var baseFontSize = parseFloat(h3Style.fontSize) || 40;
    var padX = Math.round(Math.max(24, baseFontSize * 0.45));
    var padY = Math.round(Math.max(26, baseFontSize * 0.6));
    var width = Math.ceil(h3Rect.width * sx) + padX * 2;
    var height = Math.ceil(h3Rect.height * sy) + padY * 2;
    var baseColor = h3.dataset.srvColor || "#f4f7fb";

    var glyphs = [];
    var inkLeft = INF;
    var inkRight = -INF;
    var inkTop = INF;
    var inkBottom = -INF;

    var walker = document.createTreeWalker(h3, NodeFilter.SHOW_TEXT, null);
    var range = document.createRange();
    var node;
    while ((node = walker.nextNode())) {
      var parent = node.parentElement || h3;
      if (parent.closest && parent.closest("canvas")) continue;
      var style = getComputedStyle(parent);
      var fontSize = parseFloat(style.fontSize) || baseFontSize;
      var fontSpec = style.fontWeight + " " + fontSize + "px " + style.fontFamily;
      var color = parent.dataset.srvColor || baseColor;
      var text = node.nodeValue || "";
      for (var i = 0; i < text.length; i++) {
        var ch = text.charAt(i);
        if (!ch || /\s/.test(ch)) continue;
        range.setStart(node, i);
        range.setEnd(node, i + 1);
        var r = range.getBoundingClientRect();
        if (r.width <= 0 || r.height <= 0) continue;
        var gw = r.width * sx;
        var gh = r.height * sy;
        var x = (r.left - h3Rect.left) * sx + padX;
        var y = (r.top - h3Rect.top) * sy + padY;
        glyphs.push({
          ch: ch,
          x: x,
          y: y,
          w: gw,
          h: gh,
          font: fontSpec,
          fontSize: fontSize,
          color: color,
        });
        if (x < inkLeft) inkLeft = x;
        if (x + gw > inkRight) inkRight = x + gw;
        if (y < inkTop) inkTop = y;
        if (y + gh > inkBottom) inkBottom = y + gh;
      }
    }

    if (!glyphs.length) return null;
    return {
      width: width,
      height: height,
      padX: padX,
      padY: padY,
      fontSize: baseFontSize,
      baseColor: baseColor,
      inkLeft: inkLeft,
      inkRight: inkRight,
      inkTop: inkTop,
      inkBottom: inkBottom,
      glyphs: glyphs,
    };
  }

  function buildField(layout) {
    var scale = Math.min(1.25, 1600 / Math.max(1, layout.width));
    var w = Math.max(2, Math.round(layout.width * scale));
    var h = Math.max(2, Math.round(layout.height * scale));

    var seed = document.createElement("canvas");
    seed.width = w;
    seed.height = h;
    var ctx = seed.getContext("2d", { willReadFrequently: true });
    if (!ctx) return null;

    ctx.scale(scale, scale);
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = "#ffffff";

    var colCanvas = document.createElement("canvas");
    colCanvas.width = w;
    colCanvas.height = h;
    var colCtx = colCanvas.getContext("2d");
    if (colCtx) {
      colCtx.fillStyle = layout.baseColor;
      colCtx.fillRect(0, 0, w, h);
      colCtx.scale(scale, scale);
      colCtx.textAlign = "left";
      colCtx.textBaseline = "alphabetic";
    }

    var metricsCache = {};
    for (var i = 0; i < layout.glyphs.length; i++) {
      var g = layout.glyphs[i];
      if (ctx.font !== g.font) ctx.font = g.font;
      var metrics = metricsCache[g.font];
      if (!metrics) {
        var m = ctx.measureText("Mgy");
        var asc = m.fontBoundingBoxAscent || g.fontSize * 0.84;
        var desc = m.fontBoundingBoxDescent || g.fontSize * 0.22;
        metrics = { asc: asc, desc: desc, span: asc + desc };
        metricsCache[g.font] = metrics;
      }
      var baseline = g.y + (g.h - metrics.span) / 2 + metrics.asc;
      ctx.fillText(g.ch, g.x, baseline);

      if (colCtx && g.color !== layout.baseColor) {
        if (colCtx.font !== g.font) colCtx.font = g.font;
        colCtx.save();
        colCtx.strokeStyle = g.color;
        colCtx.fillStyle = g.color;
        colCtx.lineWidth = g.fontSize * 0.34;
        colCtx.lineCap = "round";
        colCtx.lineJoin = "round";
        if ("filter" in colCtx) {
          colCtx.filter = "blur(6px)";
          colCtx.strokeText(g.ch, g.x, baseline);
          colCtx.filter = "none";
        } else {
          colCtx.strokeText(g.ch, g.x, baseline);
        }
        colCtx.fillText(g.ch, g.x, baseline);
        colCtx.restore();
      }
    }

    var img = ctx.getImageData(0, 0, w, h).data;
    var n = w * h;
    var outer = new Float64Array(n);
    var inner = new Float64Array(n);
    var hasSeed = false;
    for (var p = 0; p < n; p++) {
      var a = img[p * 4 + 3] / 255;
      if (a > 0.05) hasSeed = true;
      if (a >= 1) {
        outer[p] = 0;
        inner[p] = INF;
      } else if (a <= 0) {
        outer[p] = INF;
        inner[p] = 0;
      } else {
        var d = 0.5 - a;
        outer[p] = d > 0 ? d * d : 0;
        inner[p] = d < 0 ? d * d : 0;
      }
    }
    if (!hasSeed) return null;

    var len = Math.max(w, h);
    var fBuf = new Float64Array(len);
    var vBuf = new Uint32Array(len);
    var zBuf = new Float64Array(len + 1);
    edt(outer, w, h, fBuf, vBuf, zBuf);
    edt(inner, w, h, fBuf, vBuf, zBuf);

    var maxDist = Math.max(64, Math.hypot(w, h) / scale + 64);
    var data = new Float32Array(n);
    for (var j = 0; j < n; j++) {
      var sd = (Math.sqrt(outer[j]) - Math.sqrt(inner[j])) / scale;
      if (!Number.isFinite(sd)) sd = maxDist;
      else if (sd > 4096) sd = 4096;
      else if (sd < -4096) sd = -4096;
      data[j] = sd;
    }

    var soft = Float32Array.from(data);
    var tmp = new Float32Array(n);
    var radius = Math.max(1, Math.round(layout.fontSize * 0.035 * scale));
    for (var pass = 0; pass < 3; pass++) {
      boxBlur(soft, tmp, w, h, radius, 1, w);
      boxBlur(tmp, soft, h, w, radius, w, 1);
    }

    var packed = new Float32Array(n * 2);
    for (var q = 0; q < n; q++) {
      var sv = soft[q];
      if (!Number.isFinite(sv)) sv = data[q];
      else if (sv > 4096) sv = 4096;
      else if (sv < -4096) sv = -4096;
      packed[q * 2] = data[q];
      packed[q * 2 + 1] = sv;
    }

    return {
      data: data,
      packed: packed,
      colorCanvas: colCanvas,
      w: w,
      h: h,
      scale: scale,
    };
  }

  function sampleField(field, x, y) {
    var fx = Math.min(field.w - 1, Math.max(0, Math.round(x * field.scale)));
    var fy = Math.min(field.h - 1, Math.max(0, Math.round(y * field.scale)));
    return field.data[fy * field.w + fx];
  }

  function nearestInside(field, x, y, inset) {
    var px = x;
    var py = y;
    var e = 1.5;
    for (var i = 0; i < 10; i++) {
      var d = sampleField(field, px, py) + inset;
      if (Math.abs(d) < 0.5) break;
      var gx =
        (sampleField(field, px + e, py) - sampleField(field, px - e, py)) /
        (2 * e);
      var gy =
        (sampleField(field, px, py + e) - sampleField(field, px, py - e)) /
        (2 * e);
      var gl = Math.hypot(gx, gy) || 1;
      px -= (gx / gl) * d;
      py -= (gy / gl) * d;
    }
    return [px, py];
  }

  function createSim(phase) {
    return {
      n: 8,
      x: new Float32Array(MAX_TRAIL),
      y: new Float32Array(MAX_TRAIL),
      vx: new Float32Array(MAX_TRAIL),
      vy: new Float32Array(MAX_TRAIL),
      mass: 0.72,
      massV: 0,
      load: 0.75,
      mode: "idle",
      tx: 0,
      ty: 0,
      homeX: 0,
      homeY: 0,
      releaseT: 0,
      idleBlend: 1,
      clock: phase || 0,
      seeded: false,
      anchorX: 0,
      anchorY: 0,
      tether: 0,
    };
  }

  function idlePoint(layout, t) {
    var cx = (layout.inkLeft + layout.inkRight) / 2;
    var cy = (layout.inkTop + layout.inkBottom) / 2;
    var ax = (layout.inkRight - layout.inkLeft) * 0.44;
    var ay = Math.max(layout.fontSize * 0.34, (layout.inkBottom - layout.inkTop) * 0.36);
    var x = cx + ax * Math.sin(t * 0.68);
    var y = cy - ay * 0.25 + ay * (0.52 * Math.sin(t * 1.25 + 0.9) + 0.24 * Math.cos(t * 2.05));
    return [x, y];
  }

  function stepSim(sim, dt, layout, field, visc, autoplay) {
    var n = 8;
    sim.n = n;
    if (!sim.seeded) {
      var initPt = idlePoint(layout, sim.clock);
      for (var i = 0; i < MAX_TRAIL; i++) {
        sim.x[i] = initPt[0];
        sim.y[i] = initPt[1];
      }
      sim.seeded = true;
    }

    var massTarget = 0;
    var gx = sim.tx;
    var gy = sim.ty;
    if (sim.mode === "pointer") {
      massTarget = 1;
    } else if (sim.mode === "release") {
      sim.releaseT += dt;
      gx = sim.homeX;
      gy = sim.homeY;
      if (sim.releaseT > 1.8 && autoplay) {
        sim.mode = "idle";
        sim.idleBlend = 0;
      }
    }
    if (sim.mode === "idle") {
      if (!autoplay) {
        gx = sim.homeX;
        gy = sim.homeY;
      } else {
        sim.clock += dt;
        sim.idleBlend = Math.min(1, sim.idleBlend + dt / 1.2);
        var b = sim.idleBlend * sim.idleBlend * (3 - 2 * sim.idleBlend);
        var ip = idlePoint(layout, sim.clock);
        gx = sim.homeX + (ip[0] - sim.homeX) * b;
        gy = sim.homeY + (ip[1] - sim.homeY) * b;
        massTarget = 0.92 * b;
      }
    }

    var k = 330 - 270 * visc;
    var c = 2 * 0.62 * Math.sqrt(k);
    var kf = k * 1.25;
    var cf = 2 * 0.48 * Math.sqrt(kf);
    var km = 70;
    var cm = 2 * 0.3 * Math.sqrt(km);

    var headD = sampleField(field, sim.x[0], sim.y[0]);
    if (sim.mode === "pointer" || (sim.mode === "idle" && autoplay)) {
      if (headD < 0) {
        sim.tether = Math.min(1, sim.tether + dt * 8);
        var aPt = nearestInside(field, sim.x[0], sim.y[0], layout.fontSize * 0.04);
        sim.anchorX = aPt[0];
        sim.anchorY = aPt[1];
      } else if (sim.tether > 0) {
        var stretch = Math.hypot(sim.x[0] - sim.anchorX, sim.y[0] - sim.anchorY);
        var breakLen = layout.fontSize * (0.42 + 0.4 * visc);
        if (stretch > breakLen) sim.tether = 0;
      }
    } else {
      sim.tether = Math.max(0, sim.tether - dt * 3);
    }

    var steps = Math.max(1, Math.ceil(dt / (1 / 120)));
    var h = dt / steps;
    for (var s = 0; s < steps; s++) {
      for (var p = 0; p < n; p++) {
        var tx = p === 0 ? gx : sim.x[p - 1];
        var ty = p === 0 ? gy : sim.y[p - 1];
        var kk = p === 0 ? k : kf;
        var cc = p === 0 ? c : cf;
        var fx = (tx - sim.x[p]) * kk;
        var fy = (ty - sim.y[p]) * kk;
        if (p > 0 && sim.tether > 0) {
          var w = sim.tether * Math.pow(p / (n - 1), 1.3) * 1.6;
          fx += (sim.anchorX - sim.x[p]) * kk * w;
          fy += (sim.anchorY - sim.y[p]) * kk * w;
        }
        sim.vx[p] += (fx - sim.vx[p] * cc) * h;
        sim.vy[p] += (fy - sim.vy[p] * cc) * h;
        sim.x[p] += sim.vx[p] * h;
        sim.y[p] += sim.vy[p] * h;
      }
      sim.massV += ((massTarget - sim.mass) * km - sim.massV * cm) * h;
      sim.mass += sim.massV * h;
    }

    for (var tail = n; tail < MAX_TRAIL; tail++) {
      sim.x[tail] = sim.x[n - 1];
      sim.y[tail] = sim.y[n - 1];
      sim.vx[tail] = 0;
      sim.vy[tail] = 0;
    }

    var inside = sampleField(field, sim.x[0], sim.y[0]) < layout.fontSize * 0.02;
    sim.load = inside
      ? Math.min(1, sim.load + dt * 5)
      : Math.max(0.42, sim.load - dt * 0.35);
  }

  function compileShader(gl, type, src) {
    var sh = gl.createShader(type);
    if (!sh) return null;
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS) && !gl.isContextLost()) {
      console.warn("ServicesLiquidText shader:", gl.getShaderInfoLog(sh));
      gl.deleteShader(sh);
      return null;
    }
    return sh;
  }

  function initHeadingController(h3, phase) {
    function mountCanvas() {
      var cv = document.createElement("canvas");
      cv.className = "srv-liquid-canvas";
      cv.setAttribute("aria-hidden", "true");
      h3.appendChild(cv);
      return cv;
    }
    var canvas = mountCanvas();

    var blobBuf = new Float32Array(MAX_TRAIL * 4);
    var warpBuf = new Float32Array(MAX_TRAIL * 2);

    var state = {
      h3: h3,
      canvas: canvas,
      glState: null,
      layout: null,
      field: null,
      dpr: 1,
      sim: createSim(phase),
      rafId: 0,
      lastTs: 0,
      active: false,
      lastKey: "",
    };

    function createGL() {
      if (state.glState) {
        if (!state.glState.gl.isContextLost()) return state.glState;
        destroyGL();
      }
      if (!canvas || !canvas.parentNode) {
        canvas = mountCanvas();
        state.canvas = canvas;
      }
      var gl = canvas.getContext("webgl2", {
        premultipliedAlpha: true,
        antialias: false,
        alpha: true,
      });
      if (!gl || gl.isContextLost()) return null;
      canvas.addEventListener(
        "webglcontextlost",
        function (ev) {
          ev.preventDefault();
          stop();
        },
        { once: true }
      );
      var vs = compileShader(gl, gl.VERTEX_SHADER, VERT_SRC);
      var fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAG_SRC);
      var prog = gl.createProgram();
      var buf = gl.createBuffer();
      var sdfTex = gl.createTexture();
      var colTex = gl.createTexture();
      if (!vs || !fs || !prog || !buf || !sdfTex || !colTex) return null;
      gl.attachShader(prog, vs);
      gl.attachShader(prog, fs);
      gl.bindAttribLocation(prog, 0, "aPos");
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS) && !gl.isContextLost()) {
        console.warn("ServicesLiquidText link:", gl.getProgramInfoLog(prog));
        return null;
      }
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 3, -1, -1, 3]),
        gl.STATIC_DRAW
      );
      gl.enableVertexAttribArray(0);
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, sdfTex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, colTex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

      var u = {};
      for (var i = 0; i < UNIFORM_NAMES.length; i++) {
        u[UNIFORM_NAMES[i]] = gl.getUniformLocation(prog, UNIFORM_NAMES[i]);
      }
      state.glState = {
        gl: gl,
        vs: vs,
        fs: fs,
        prog: prog,
        buf: buf,
        sdfTex: sdfTex,
        colTex: colTex,
        u: u,
      };
      return state.glState;
    }

    function destroyGL() {
      h3.classList.remove("srv-liquid-active");
      if (state.glState) {
        var g = state.glState;
        state.glState = null;
        var gl = g.gl;
        if (!gl.isContextLost()) {
          gl.deleteTexture(g.sdfTex);
          gl.deleteTexture(g.colTex);
          gl.deleteBuffer(g.buf);
          gl.deleteProgram(g.prog);
          gl.deleteShader(g.vs);
          gl.deleteShader(g.fs);
          var ext = gl.getExtension("WEBGL_lose_context");
          if (ext) ext.loseContext();
        }
      }
      // Replace lost/torn-down canvas cleanly so next start() never reuses a permanently lost WebGL2 context
      if (canvas && canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
      canvas = null;
      state.canvas = null;
    }

    function rebuildLayoutAndTextures() {
      var hadActive = h3.classList.contains("srv-liquid-active");
      if (hadActive) h3.classList.remove("srv-liquid-active");
      var lay = measureGlyphLayout(h3);
      if (!lay) {
        h3.dataset.srvLiquidStatus = "err-layout";
        return false;
      }

      var rectKey =
        lay.width + "x" + lay.height + ":" + Math.round(lay.fontSize) + ":" + h3.dataset.srvFontKey;
      if (!state.field || state.lastKey !== rectKey) {
        var field = buildField(lay);
        if (!field) {
          h3.dataset.srvLiquidStatus = "err-field";
          return false;
        }
        state.layout = lay;
        state.field = field;
        state.lastKey = rectKey;
        var home = nearestInside(
          field,
          (lay.inkLeft + lay.inkRight) / 2,
          (lay.inkTop + lay.inkBottom) / 2,
          lay.fontSize * 0.03
        );
        state.sim.homeX = home[0];
        state.sim.homeY = home[1];
      } else {
        state.layout = lay;
      }

      if (!canvas || !canvas.parentNode) {
        canvas = mountCanvas();
        state.canvas = canvas;
      }

      var maxDpr = Math.min(2, window.devicePixelRatio || 1);
      state.dpr = maxDpr;
      canvas.style.left = -lay.padX + "px";
      canvas.style.top = -lay.padY + "px";
      canvas.style.width = lay.width + "px";
      canvas.style.height = lay.height + "px";
      canvas.width = Math.max(1, Math.round(lay.width * maxDpr));
      canvas.height = Math.max(1, Math.round(lay.height * maxDpr));

      var g = createGL();
      if (!g || g.gl.isContextLost()) {
        h3.dataset.srvLiquidStatus = "err-gl";
        return false;
      }
      var gl = g.gl;
      while (gl.getError() !== gl.NO_ERROR) {}
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, g.sdfTex);
      gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RG16F,
        state.field.w,
        state.field.h,
        0,
        gl.RG,
        gl.FLOAT,
        state.field.packed
      );
      if (gl.getError() !== gl.NO_ERROR) {
        h3.dataset.srvLiquidStatus = "err-sdf-tex";
        return false;
      }

      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, g.colTex);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        state.field.colorCanvas
      );
      if (gl.getError() !== gl.NO_ERROR) {
        h3.dataset.srvLiquidStatus = "err-col-tex";
        return false;
      }

      h3.dataset.srvLiquidStatus = "active";
      return true;
    }

    function drawFrame() {
      var g = state.glState;
    var lay = state.layout;
    if (!g || !lay || g.gl.isContextLost()) return;
    var gl = g.gl;
    var u = g.u;
    var sim = state.sim;
    var R = lay.fontSize * 0.115;
    var n = sim.n;
    var visc = 0.55;
    var maxWarp = lay.fontSize * 0.064;
    var warpTime = 0.026 - visc * 0.01;
    var mass = Math.max(0, sim.mass);

      for (var i = 0; i < MAX_TRAIL; i++) {
        var taper =
          i === 0
            ? 1
            : 0.62 -
              0.34 * (1 - 0.6 * sim.tether) * ((i - 1) / Math.max(1, n - 2));
        blobBuf[i * 4] = sim.x[i];
        blobBuf[i * 4 + 1] = sim.y[i];
        blobBuf[i * 4 + 2] =
          i < n ? R * mass * (0.45 + 0.55 * sim.load) * taper : 0;
        blobBuf[i * 4 + 3] = 0;
        var wx = sim.vx[i] * warpTime * Math.min(1, mass * 1.4);
        var wy = sim.vy[i] * warpTime * Math.min(1, mass * 1.4);
        var wl = Math.hypot(wx, wy);
        if (wl > maxWarp) {
          wx *= maxWarp / wl;
          wy *= maxWarp / wl;
        }
        warpBuf[i * 2] = wx;
        warpBuf[i * 2 + 1] = wy;
      }

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(g.prog);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, g.sdfTex);
      gl.uniform1i(u.uSdf, 0);

      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, g.colTex);
      gl.uniform1i(u.uColorTex, 1);

      gl.uniform2f(u.uSize, lay.width, lay.height);
      gl.uniform1f(u.uDpr, state.dpr);
      gl.uniform1f(u.uCanvasH, canvas.height);
      gl.uniform4fv(u.uBlob, blobBuf);
      gl.uniform2fv(u.uWarp, warpBuf);
      gl.uniform1i(u.uCount, n);
      gl.uniform1f(u.uSigma, R * 1.8);
      gl.uniform1f(u.uBevel, Math.max(2, lay.fontSize * 0.085));
      gl.uniform3f(u.uHi, 1.0, 1.0, 1.0);
      gl.uniform4f(u.uAccent, 0.447, 0.773, 0.973, 0.46);
      gl.uniform1f(u.uSpec, 0.68);
      gl.uniform1f(u.uShade, 0.24);

      gl.bindBuffer(gl.ARRAY_BUFFER, g.buf);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      h3.classList.add("srv-liquid-active");
    }

    function tick(ts) {
      if (!state.active) {
        state.rafId = 0;
        return;
      }
      if (!state.lastTs) state.lastTs = ts;
      var dt = Math.min(0.05, Math.max(0.001, (ts - state.lastTs) / 1000));
      state.lastTs = ts;
      if (state.layout && state.field && state.glState) {
        stepSim(state.sim, dt, state.layout, state.field, 0.55, true);
        drawFrame();
      }
      state.rafId = window.requestAnimationFrame(tick);
    }

    var settleTimer = 0;
    var retryTimer = 0;
    var retryCount = 0;

    function clearTimers() {
      if (settleTimer) {
        window.clearTimeout(settleTimer);
        settleTimer = 0;
      }
      if (retryTimer) {
        window.clearTimeout(retryTimer);
        retryTimer = 0;
      }
    }

    function start(isVisibleCheck) {
      if (state.active) return true;
      h3.dataset.srvFontKey = getComputedStyle(h3).fontFamily || "";
      var ready = rebuildLayoutAndTextures();
      if (!ready) {
        destroyGL();
        if (retryCount < 4) {
          retryCount++;
          var delay = retryCount * 140;
          retryTimer = window.setTimeout(function () {
            retryTimer = 0;
            if (!state.active && (!isVisibleCheck || isVisibleCheck())) {
              start(isVisibleCheck);
            }
          }, delay);
        }
        return false;
      }
      retryCount = 0;
      state.active = true;
      state.lastTs = 0;
      drawFrame();
      state.rafId = window.requestAnimationFrame(tick);
      if (settleTimer) window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(function () {
        settleTimer = 0;
        if (state.active) refresh();
      }, 480);
      return true;
    }

    function stop() {
      clearTimers();
      retryCount = 0;
      state.active = false;
      if (state.rafId) {
        window.cancelAnimationFrame(state.rafId);
        state.rafId = 0;
      }
      destroyGL();
      h3.dataset.srvLiquidStatus = "stopped";
    }

    function refresh() {
      if (!state.active) return;
      h3.dataset.srvFontKey = getComputedStyle(h3).fontFamily || "";
      state.lastKey = "";
      if (rebuildLayoutAndTextures()) {
        drawFrame();
      } else {
        stop();
      }
    }

    function toLocal(e) {
      if (!state.layout) return null;
      var r = h3.getBoundingClientRect();
      var sx = h3.offsetWidth && r.width ? h3.offsetWidth / r.width : 1;
      var sy = h3.offsetHeight && r.height ? h3.offsetHeight / r.height : 1;
      return [
        (e.clientX - r.left) * sx + state.layout.padX,
        (e.clientY - r.top) * sy + state.layout.padY,
      ];
    }

    h3.addEventListener("pointermove", function (e) {
      if (!state.active || !state.layout) return;
      var pt = toLocal(e);
      if (!pt) return;
      var m = state.layout.fontSize * 0.1;
      state.sim.mode = "pointer";
      state.sim.tx = Math.min(state.layout.width - m, Math.max(m, pt[0]));
      state.sim.ty = Math.min(state.layout.height - m, Math.max(m, pt[1]));
    });

    h3.addEventListener("pointerdown", function (e) {
      if (!state.active || !state.layout) return;
      if (e.button === 0) {
        try {
          h3.setPointerCapture(e.pointerId);
        } catch (_err) {}
      }
      var pt = toLocal(e);
      if (!pt) return;
      var m = state.layout.fontSize * 0.1;
      state.sim.mode = "pointer";
      state.sim.tx = Math.min(state.layout.width - m, Math.max(m, pt[0]));
      state.sim.ty = Math.min(state.layout.height - m, Math.max(m, pt[1]));
    });

    function handleRelease() {
      if (!state.field || !state.layout || state.sim.mode !== "pointer") return;
      var home = nearestInside(
        state.field,
        state.sim.x[0],
        state.sim.y[0],
        state.layout.fontSize * 0.03
      );
      state.sim.homeX = home[0];
      state.sim.homeY = home[1];
      state.sim.mode = "release";
      state.sim.releaseT = 0;
    }

    h3.addEventListener("pointerleave", handleRelease);
    h3.addEventListener("pointercancel", handleRelease);
    h3.addEventListener("pointerup", function (e) {
      try {
        if (h3.hasPointerCapture(e.pointerId)) {
          h3.releasePointerCapture(e.pointerId);
        }
      } catch (_err) {}
      handleRelease();
    });

    return {
      h3: h3,
      start: start,
      stop: stop,
      refresh: refresh,
      isActive: function () {
        return state.active;
      },
    };
  }

  function bootstrap() {
    var reduced =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !checkWebGL2Support()) return;

    var section = document.getElementById("distribution");
    if (!section) return;

    var slides = section.querySelectorAll(
      '.deck-slide[data-deck="services"]:not([data-slide-index="0"])'
    );
    if (!slides.length) return;

    function isSectionVisibleNow() {
      var rect = section.getBoundingClientRect();
      return rect.bottom > 20 && rect.top < (window.innerHeight || 900) - 20;
    }

    var entries = [];
    for (var i = 0; i < slides.length; i++) {
      (function (slide, idx) {
        var h3 = slide.querySelector("h3.srv-serif");
        if (!h3) return;
        captureOriginalColors(h3);
        var ctrl = initHeadingController(h3, idx * 1.37);
        var entry = {
          slide: slide,
          h3: h3,
          ctrl: ctrl,
          isSlideOpen: function () {
            return (
              isSectionVisibleNow() &&
              !slide.classList.contains("opacity-0") &&
              !slide.classList.contains("pointer-events-none")
            );
          },
        };
        entries.push(entry);

        // Re-snap exact glyph metrics once 3D slide transitions finish
        slide.addEventListener("transitionend", function (ev) {
          if (ev.target === slide && entry.isSlideOpen()) {
            if (entry.ctrl.isActive()) entry.ctrl.refresh();
            else entry.ctrl.start(entry.isSlideOpen);
          }
        });
        if (slide.firstElementChild) {
          slide.firstElementChild.addEventListener("animationend", function () {
            if (entry.isSlideOpen()) {
              if (entry.ctrl.isActive()) entry.ctrl.refresh();
              else entry.ctrl.start(entry.isSlideOpen);
            }
          });
        }
        if ("ResizeObserver" in window) {
          var ro = new ResizeObserver(function () {
            if (entry.isSlideOpen() && entry.ctrl.isActive()) {
              entry.ctrl.refresh();
            }
          });
          ro.observe(h3);
        }
      })(slides[i], i);
    }
    if (!entries.length) return;

    function syncActive() {
      // Pass 1: release WebGL contexts of hidden slides BEFORE creating new ones
      for (var j = 0; j < entries.length; j++) {
        if (!entries[j].isSlideOpen()) {
          entries[j].ctrl.stop();
        }
      }
      // Pass 2: activate currently open slide(s)
      for (var k = 0; k < entries.length; k++) {
        var e = entries[k];
        if (e.isSlideOpen()) {
          e.ctrl.start(e.isSlideOpen);
        }
      }
    }

    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(
        function () {
          syncActive();
        },
        { threshold: [0, 0.05] }
      );
      io.observe(section);
    }

    var mo = new MutationObserver(function () {
      syncActive();
    });
    for (var m = 0; m < entries.length; m++) {
      mo.observe(entries[m].slide, {
        attributes: true,
        attributeFilter: ["class"],
      });
    }

    var scrollRaf = 0;
    window.addEventListener(
      "scroll",
      function () {
        if (scrollRaf) return;
        scrollRaf = window.requestAnimationFrame(function () {
          scrollRaf = 0;
          syncActive();
        });
      },
      { passive: true }
    );

    var resizeTimer = 0;
    window.addEventListener("resize", function () {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(function () {
        for (var r = 0; r < entries.length; r++) {
          entries[r].ctrl.refresh();
        }
      }, 150);
    });

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () {
        for (var f = 0; f < entries.length; f++) {
          entries[f].ctrl.refresh();
        }
      });
    }

    syncActive();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootstrap, { once: true });
  } else {
    bootstrap();
  }
})();
