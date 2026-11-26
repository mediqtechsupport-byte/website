/**
 * MEDIQ Pharma — Bespoke Optical Spiral IOL Splash Screen (v4.2 — Exact Obsidian-Cobalt Site Gradient + Zero-Overlap Reveal)
 *  - Renders over the exact site Obsidian Perimeter (#0b0c0f) + Midnight Cobalt Radial Halo gradient
 *  - Transparent premultiplied-alpha WebGL canvas renders ONLY the luminous crystal Spiral IOL, twin C-loop haptics,
 *    corneal ripple, and subtle slit-lamp dust motes (zero visual chrome, zero SKIP button, zero bottom HUD)
 *  - Step 4A: All optical graphics + MEDIQ wordmark dissolve completely to 0% into pure Obsidian-Cobalt gradient first
 *  - Step 4B: Only once 100% clear does the clean empty Obsidian-Cobalt curtain melt smoothly into the live Home Page
 */
(function () {
  'use strict';

  var TOTAL_LOAD_MS = 1200;   // Phase 1 & 2: Optical convergence & smooth focus lock
  var HOLD_MS = 260;          // Phase 3: Serene 20/20 hold with specular sheen & corneal ripple
  var CLEAR_OPTICS_MS = 400;  // Step 4A: Clear ring + haptics + dust + MEDIQ completely to pure gradient
  var FAST_CLEAR_MS = 190;    // Fast clear duration on Escape
  var VEIL_FADE_MS = 500;     // Step 4B: Matches CSS 0.48s easeInOutSine fade of clean empty veil
  var FAST_VEIL_MS = 280;     // Fast veil fade duration on Escape
  var SAFETY_EXIT_MS = 5000;  // Safety trigger always initiates clean sequential exit

  function clamp01(v) {
    return v < 0 ? 0 : v > 1 ? 1 : v;
  }

  function easeOutCubic(t) {
    t = clamp01(t);
    return 1 - Math.pow(1 - t, 3);
  }

  function easeInOutSine(t) {
    t = clamp01(t);
    return -(Math.cos(Math.PI * t) - 1) * 0.5;
  }

  function easeOutExpo(t) {
    t = clamp01(t);
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }

  var VERT_SRC = [
    'attribute vec2 aPos;',
    'void main() {',
    '  gl_Position = vec4(aPos, 0.0, 1.0);',
    '}'
  ].join('\n');

  // Transparent premultiplied-alpha GLSL Spiral IOL optic shader overlaid on our exact CSS Obsidian-Cobalt Halo
  var FRAG_SRC = [
    '#ifdef GL_FRAGMENT_PRECISION_HIGH',
    'precision highp float;',
    '#else',
    'precision mediump float;',
    '#endif',
    '',
    'uniform vec2 uRes;',
    'uniform float uTime;',
    'uniform float uProgress;',   // 0..1 overall convergence
    'uniform float uFocus;',      // 0..1 optical clarity lock
    'uniform float uPulse;',      // 0..1 focus-lock corneal ripple
    'uniform float uOpticFade;',  // 1 -> 0 clears ALL rings/haptics/dust completely BEFORE veil lifts
    'uniform float uLensR;',      // inner crystal lens radius in pixels
    'uniform vec2 uTilt;',        // subtle 3D gyroscopic & pointer tilt
    '',
    'const float PI = 3.14159265359;',
    'const float TAU = 6.28318530718;',
    '',
    'float hash21(vec2 p) {',
    '  p = fract(p * vec2(127.1, 311.7));',
    '  p += dot(p, p + 34.23);',
    '  return fract(p.x * p.y);',
    '}',
    '',
    '// Sparse biophotonic micro-dust specks in slit-lamp illumination',
    'float microDustLayer(vec2 uv, float scale, float speed, float seed) {',
    '  vec2 p = uv * scale;',
    '  p.y -= uTime * speed;',
    '  p.x += sin(uTime * 0.35 + seed) * 0.18;',
    '  vec2 cell = floor(p);',
    '  vec2 f = fract(p) - 0.5;',
    '  float rnd = hash21(cell + seed);',
    '  if (rnd < 0.88) return 0.0;',
    '  vec2 jitter = vec2(hash21(cell + seed + 13.7), hash21(cell + seed + 29.1)) - 0.5;',
    '  float d = length(f - jitter * 0.58);',
    '  float twinkle = 0.55 + 0.45 * sin(uTime * (2.2 + rnd * 3.0) + rnd * TAU);',
    '  float rad = mix(0.072, 0.030, uFocus);',
    '  float k = d / rad;',
    '  return exp(-k * k) * twinkle * 0.40;',
    '}',
    '',
    'void main() {',
    '  if (uOpticFade <= 0.002) {',
    '    gl_FragColor = vec4(0.0);',
    '    return;',
    '  }',
    '',
    '  vec2 center = uRes * 0.5;',
    '  vec2 fragPx = gl_FragCoord.xy - center;',
    '  float minDim = max(1.0, min(uRes.x, uRes.y));',
    '  vec2 nUv = fragPx / minDim;',
    '',
    '  // 1. 3D-Tilted Optical Plane (gently exhales outward as it clears)',
    '  float exitExpand = 1.0 + (1.0 - uOpticFade) * 0.06;',
    '  vec2 lp = fragPx / max(1.0, uLensR * exitExpand);',
    '  float persp = 1.0 + lp.x * uTilt.x * 0.16 + lp.y * uTilt.y * 0.16;',
    '  lp /= max(0.74, persp);',
    '  float r = length(lp);',
    '  float a = atan(lp.y, lp.x + 1e-5);',
    '',
    '  // Subtle dark optical glass absorption right behind MEDIQ wordmark for crisp legibility',
    '  float interiorA = (1.0 - smoothstep(0.76, 1.00, r)) * 0.32 * smoothstep(0.0, 0.30, uProgress) * uOpticFade;',
    '  vec3 interiorCol = vec3(0.025, 0.045, 0.105);',
    '',
    '  // 2. Single-Pass Spiral IOL Optic + Analytical Chromatic Bevel Convergence',
    '  float outerZone = smoothstep(0.60, 0.88, r) * (1.0 - smoothstep(0.985, 1.03, r));',
    '  float spiral = 0.5 + 0.5 * cos(a * 2.0 - log(max(r, 0.08)) * 9.5 - uTime * 1.85 + (1.0 - uFocus) * 1.4);',
    '  spiral = pow(max(0.0, spiral), mix(2.2, 6.0, uFocus));',
    '  float fresnel = 0.5 + 0.5 * cos(r * 34.0 - uTime * 1.25);',
    '  fresnel = pow(max(0.0, fresnel), mix(2.0, 5.5, uFocus));',
    '',
    '  float bevelWidth = mix(0.066, 0.014, uFocus);',
    '  float invBw = 1.0 / bevelWidth;',
    '  float ca = (1.0 - uFocus) * 0.042;',
    '  float bR = (r + ca - 0.992) * invBw;',
    '  float bG = (r      - 0.992) * invBw;',
    '  float bB = (r - ca - 0.992) * invBw;',
    '  float bevelAniso = 0.55 + 0.45 * pow(max(0.0, cos(a * 2.0 - 2.35 - uTime * 0.32)), 2.0);',
    '',
    '  float commonInner = outerZone * (spiral * 0.36 + fresnel * 0.15);',
    '  float stepD = (r - 0.82) * (invBw * 0.74);',
    '  commonInner += exp(-stepD * stepD) * 0.28;',
    '',
    '  float cR = commonInner + exp(-bR * bR) * 0.68 * bevelAniso;',
    '  float cG = commonInner + exp(-bG * bG) * 0.68 * bevelAniso;',
    '  float cB = commonInner + exp(-bB * bB) * 0.68 * bevelAniso;',
    '',
    '  vec3 lightCol = vec3(',
    '    cR * 0.36 + cG * 0.22,',
    '    cG * 0.70 + cB * 0.15,',
    '    cB * 1.00 + cG * 0.22',
    '  );',
    '  float minC = min(cR, min(cG, cB));',
    '  lightCol += vec3(0.84, 0.96, 1.0) * pow(max(0.0, minC), 2.6) * (0.26 + 0.56 * uFocus) * 0.42;',
    '',
    '  // Graceful diagonal anti-reflective glass sweep',
    '  float diagPos = lp.x * 0.741 + lp.y * 0.671;',
    '  float sweepD = (diagPos - (mix(-1.55, 1.65, uProgress) + uPulse * 0.42)) * 4.55;',
    '  float glassSheen = exp(-sweepD * sweepD) * smoothstep(1.01, 0.92, r) * smoothstep(0.45, 0.72, r);',
    '  lightCol += vec3(0.64, 0.89, 1.0) * glassSheen * (0.22 + 0.28 * uFocus);',
    '',
    '  float opticReveal = smoothstep(0.0, 0.24, uProgress);',
    '  lightCol *= opticReveal;',
    '',
    '  // 3. Floating Biophotonic Micro-Dust Specks',
    '  float dustNear = microDustLayer(nUv + uTilt * 0.04, 6.5, 0.065, 1.7);',
    '  float dustFar  = microDustLayer(nUv + uTilt * 0.018, 11.0, 0.035, 9.3) * 0.65;',
    '  float dustMask = smoothstep(0.95, 1.45, r) * (1.0 - smoothstep(2.4, 3.8, r));',
    '  lightCol += vec3(0.54, 0.84, 1.0) * (dustNear + dustFar) * dustMask;',
    '',
    '  // 5. Focus-Lock Corneal Shockwave Ripple (Phase 3)',
    '  if (uPulse > 0.001) {',
    '    float pulseR = mix(0.98, 2.85, uPulse);',
    '    float pulseW = mix(0.018, 0.085, uPulse);',
    '    float pd = (r - pulseR) / pulseW;',
    '    lightCol += vec3(0.58, 0.88, 1.0) * exp(-pd * pd) * pow(max(0.0, 1.0 - uPulse), 1.45) * 0.56;',
    '  }',
    '',
    '  // Soft ACES-inspired filmic shoulder on optical highlights',
    '  lightCol = (lightCol * (1.0 + lightCol * 0.16)) / (1.0 + lightCol * 0.52);',
    '  lightCol *= uOpticFade;',
    '',
    '  // Valid premultiplied-alpha compositing over our exact CSS Obsidian-Cobalt Halo gradient',
    '  vec3 outRGB = interiorCol * interiorA + lightCol;',
    '  float lightA = max(lightCol.r, max(lightCol.g, lightCol.b));',
    '  float outA = clamp(max(interiorA, lightA), 0.0, 1.0);',
    '  outA = max(outA, max(outRGB.r, max(outRGB.g, outRGB.b)));',
    '  outA = clamp(outA, 0.0, 1.0);',
    '  gl_FragColor = vec4(clamp(outRGB, 0.0, outA), outA);',
    '}'
  ].join('\n');

  function compileShader(gl, type, src) {
    var sh = gl.createShader(type);
    if (!sh) return null;
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      try { console.warn('[MEDIQ Splash GLSL]', gl.getShaderInfoLog(sh)); } catch (_) {}
      gl.deleteShader(sh);
      return null;
    }
    return sh;
  }

  function createWebGLRenderer(canvas, preserveBuffer) {
    var opts = { alpha: true, antialias: false, depth: false, stencil: false, premultipliedAlpha: true, preserveDrawingBuffer: !!preserveBuffer, powerPreference: 'high-performance' };
    var gl = canvas.getContext('webgl', opts) || canvas.getContext('experimental-webgl', opts);
    if (!gl) return null;

    var vs = compileShader(gl, gl.VERTEX_SHADER, VERT_SRC);
    var fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAG_SRC);
    if (!vs || !fs) return null;

    var prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      try { console.warn('[MEDIQ Splash Link]', gl.getProgramInfoLog(prog)); } catch (_) {}
      return null;
    }

    gl.useProgram(prog);

    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1,  1, -1, -1,  1,
      -1,  1,  1, -1,  1,  1
    ]), gl.STATIC_DRAW);

    var aPos = gl.getAttribLocation(prog, 'aPos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    var loc = {
      uRes: gl.getUniformLocation(prog, 'uRes'),
      uTime: gl.getUniformLocation(prog, 'uTime'),
      uProgress: gl.getUniformLocation(prog, 'uProgress'),
      uFocus: gl.getUniformLocation(prog, 'uFocus'),
      uPulse: gl.getUniformLocation(prog, 'uPulse'),
      uOpticFade: gl.getUniformLocation(prog, 'uOpticFade'),
      uLensR: gl.getUniformLocation(prog, 'uLensR'),
      uTilt: gl.getUniformLocation(prog, 'uTilt')
    };

    gl.clearColor(0, 0, 0, 0);

    return {
      isWebGL: true,
      render: function (w, h, timeSec, progress, focus, pulse, opticFade, lensR, tiltX, tiltY) {
        gl.viewport(0, 0, w, h);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.uniform2f(loc.uRes, w, h);
        gl.uniform1f(loc.uTime, timeSec);
        gl.uniform1f(loc.uProgress, progress);
        gl.uniform1f(loc.uFocus, focus);
        gl.uniform1f(loc.uPulse, pulse);
        gl.uniform1f(loc.uOpticFade, opticFade);
        gl.uniform1f(loc.uLensR, lensR);
        gl.uniform2f(loc.uTilt, tiltX, tiltY);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      },
      dispose: function () {
        try {
          gl.deleteBuffer(buf);
          gl.deleteProgram(prog);
          gl.deleteShader(vs);
          gl.deleteShader(fs);
          var ext = gl.getExtension('WEBGL_lose_context');
          if (ext) ext.loseContext();
        } catch (_) {}
      }
    };
  }

  function createFallback2DRenderer(canvas) {
    var ctx = canvas.getContext('2d');
    if (!ctx) return null;
    return {
      isWebGL: false,
      render: function (w, h, timeSec, progress, focus, pulse, opticFade, lensR) {
        var cx = w * 0.5;
        var cy = h * 0.5;
        ctx.clearRect(0, 0, w, h);
        if (opticFade > 0.01) {
          ctx.save();
          ctx.strokeStyle = 'rgba(147, 217, 255, ' + ((0.30 + focus * 0.36) * opticFade).toFixed(3) + ')';
          ctx.lineWidth = Math.max(1.5, 2.2 * (w / 1440));
          ctx.beginPath();
          ctx.arc(cx, cy, lensR, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }
      },
      dispose: function () {}
    };
  }

  function runSplash(splashEl) {
    if (!splashEl || splashEl.__mediqSplashRunning) return;
    splashEl.__mediqSplashRunning = true;
    window.__mediqSplashActive = true;

    var canvas = splashEl.querySelector('#pl-glow-canvas');
    var reticleWrap = splashEl.querySelector('#pl-reticle-wrap');
    var logoWrap = splashEl.querySelector('#pl-logo-wrap');
    var logoSheen = splashEl.querySelector('#pl-logo-sheen');
    var tagEl = splashEl.querySelector('#pl-tag');

    var done = false;
    var clearingOptics = false;
    var veilLifting = false;
    var clearStartSimMs = 0;
    var clearDurationMs = CLEAR_OPTICS_MS;
    var veilDurationMs = VEIL_FADE_MS;
    var rafId = 0;
    var cleanupTimer = 0;
    var safetyTimer = 0;
    var pointerX = 0;
    var pointerY = 0;
    var smoothTiltX = 0;
    var smoothTiltY = 0;
    var domReady = document.readyState !== 'loading';
    var postDomFrames = domReady ? 2 : 0;

    if (!domReady) {
      document.addEventListener('DOMContentLoaded', function () { domReady = true; }, { once: true });
    }

    var debugFrac = null;
    try {
      var qp = new URLSearchParams(window.location.search);
      if (qp.has('splash_debug')) {
        var parsed = parseFloat(qp.get('splash_debug'));
        if (!isNaN(parsed)) debugFrac = clamp01(parsed);
      }
    } catch (_) {}

    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    var renderer = canvas ? (createWebGLRenderer(canvas, debugFrac !== null) || createFallback2DRenderer(canvas)) : null;
    if (renderer) {
      splashEl.classList.add('pl-gl-ready');
    }

    var dpr = 1;
    var pixelScale = 1;
    var cw = 1;
    var ch = 1;
    var lensRPx = 180;

    function resize() {
      if (!canvas) return;
      var maxDpr = window.innerWidth >= 1440 ? 0.85 : 1.0;
      dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
      var rawW = Math.max(1, Math.round(window.innerWidth * dpr));
      var rawH = Math.max(1, Math.round(window.innerHeight * dpr));
      pixelScale = Math.min(1, Math.sqrt(580000 / Math.max(1, rawW * rawH)));
      cw = Math.max(1, Math.round(rawW * pixelScale));
      ch = Math.max(1, Math.round(rawH * pixelScale));
      if (canvas.width !== cw || canvas.height !== ch) {
        canvas.width = cw;
        canvas.height = ch;
      }
      if (reticleWrap) {
        var rect = reticleWrap.getBoundingClientRect();
        if (rect.width > 40) {
          lensRPx = rect.width * 0.42 * dpr * pixelScale;
        } else {
          lensRPx = Math.min(cw, ch) * 0.25;
        }
      } else {
        lensRPx = Math.min(cw, ch) * 0.25;
      }
    }

    function onPointerMove(e) {
      pointerX = (e.clientX / Math.max(1, window.innerWidth)) * 2 - 1;
      pointerY = -((e.clientY / Math.max(1, window.innerHeight)) * 2 - 1);
    }

    function onKeyDown(e) {
      if (e.key === 'Escape') beginClearOptics(true);
    }

    function cleanupSplash() {
      if (done) return;
      done = true;
      clearTimeout(safetyTimer);
      clearTimeout(cleanupTimer);
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('keydown', onKeyDown);
      if (renderer) {
        renderer.dispose();
        renderer = null;
      }
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      window.__mediqSplashActive = false;
      if (splashEl.parentNode) {
        splashEl.parentNode.removeChild(splashEl);
      }
      try {
        window.dispatchEvent(new CustomEvent('mediq:splash-complete'));
      } catch (_) {}
    }

    var simMs = 0;
    var exitStartMs = TOTAL_LOAD_MS + HOLD_MS;

    /**
     * Step 4A: Fade MEDIQ wordmark + WebGL Spiral IOL ring, haptics, dust completely to 0%
     * over the solid Obsidian-Cobalt gradient BEFORE revealing the Home Page (ZERO overlap!).
     */
    function beginClearOptics(fast) {
      if (done || clearingOptics) return;
      clearingOptics = true;
      clearStartSimMs = simMs;
      clearDurationMs = fast ? FAST_CLEAR_MS : CLEAR_OPTICS_MS;
      veilDurationMs = fast ? FAST_VEIL_MS : VEIL_FADE_MS;
      clearTimeout(safetyTimer);
      try {
        window.dispatchEvent(new CustomEvent('mediq:splash-clearing'));
      } catch (_) {}

      if (fast) {
        splashEl.classList.add('pl-exit-fast');
      }
      if (reticleWrap) {
        reticleWrap.style.transition = fast
          ? 'opacity 0.18s cubic-bezier(0.37, 0, 0.63, 1), transform 0.22s cubic-bezier(0.37, 0, 0.63, 1)'
          : 'opacity 0.48s cubic-bezier(0.37, 0, 0.63, 1), transform 0.52s cubic-bezier(0.37, 0, 0.63, 1)';
      }

      requestAnimationFrame(function () {
        if (done) return;
        splashEl.classList.add('pl-exit-fg');
      });
    }

    /**
     * Step 4B: Triggered ONLY once uOpticFade === 0.0 (all splash graphics 100% gone!).
     * Smoothly lifts the clean empty Obsidian-Cobalt gradient veil off the Home Page on GPU compositor.
     */
    function beginLiftCleanVeil() {
      if (done || veilLifting) return;
      veilLifting = true;
      splashEl.classList.add('pl-exit-veil');
      cleanupTimer = setTimeout(cleanupSplash, veilDurationMs + 80);
    }

    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('keydown', onKeyDown);
    resize();

    var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion && debugFrac === null) {
      if (reticleWrap) reticleWrap.style.opacity = '1';
      if (logoWrap) {
        logoWrap.style.opacity = '1';
        logoWrap.style.transform = 'translate3d(0,0,0) scale(1)';
      }
      if (tagEl) tagEl.style.opacity = '1';
      if (renderer) renderer.render(cw, ch, 1.5, 1.0, 1.0, 0.0, 1.0, lensRPx, 0, 0);
      safetyTimer = setTimeout(function () {
        beginClearOptics(true);
        setTimeout(beginLiftCleanVeil, FAST_CLEAR_MS + 30);
      }, 300);
      return;
    }

    if (debugFrac === null) {
      safetyTimer = setTimeout(function () { beginClearOptics(false); }, SAFETY_EXIT_MS);
    }

    var lastNow = performance.now();

    function renderFrame(elapsedMs, dtSec, opticFade) {
      var timeSec = elapsedMs * 0.001;
      var loadFrac = clamp01(elapsedMs / TOTAL_LOAD_MS);
      var loadEase = easeOutCubic(loadFrac);
      var focusEase = easeOutCubic(clamp01((loadFrac - 0.03) / 0.72));
      var pulseRaw = clamp01((elapsedMs - (TOTAL_LOAD_MS - 140)) / (HOLD_MS + 620));
      var pulseEase = easeOutExpo(pulseRaw);

      var damp = 1 - Math.exp(-7.0 * dtSec);
      var autoTiltX = Math.sin(timeSec * 1.15) * 0.24 * (1 - focusEase * 0.72);
      var autoTiltY = Math.cos(timeSec * 0.92) * 0.19 * (1 - focusEase * 0.72);
      smoothTiltX += ((autoTiltX + pointerX * 0.28) - smoothTiltX) * damp;
      smoothTiltY += ((autoTiltY + pointerY * 0.28) - smoothTiltY) * damp;

      if (renderer) {
        renderer.render(
          cw, ch, timeSec,
          loadEase, focusEase, pulseEase, opticFade,
          lensRPx, smoothTiltX, smoothTiltY
        );
      }

      if (clearingOptics) return;

      var introIn = easeInOutSine(clamp01(elapsedMs / 420));
      var reticleScale = 1.045 - 0.045 * focusEase;

      if (reticleWrap) {
        reticleWrap.style.opacity = introIn.toFixed(3);
        reticleWrap.style.transform = 'translate3d(0,0,0) scale(' + reticleScale.toFixed(4) + ')';
      }

      if (logoWrap) {
        var logoIn = easeInOutSine(clamp01((loadFrac - 0.06) / 0.54));
        var logoScale = 1.045 - 0.045 * logoIn;
        logoWrap.style.opacity = logoIn.toFixed(3);
        logoWrap.style.transform = 'translate3d(0,0,0) scale(' + logoScale.toFixed(4) + ')';
      }

      if (logoSheen) {
        var sheenP = clamp01((elapsedMs - (TOTAL_LOAD_MS - 420)) / 620);
        if (sheenP > 0 && sheenP < 1) {
          logoSheen.style.opacity = (Math.sin(sheenP * Math.PI) * 0.56).toFixed(3);
          logoSheen.style.transform = 'translate3d(' + (-125 + sheenP * 250).toFixed(1) + '%,0,0) skewX(-22deg)';
        } else {
          logoSheen.style.opacity = '0';
        }
      }

      if (tagEl) {
        var tagIn = easeInOutSine(clamp01((loadFrac - 0.22) / 0.42));
        tagEl.style.opacity = tagIn.toFixed(3);
        tagEl.style.transform = 'translate3d(0,' + ((1 - tagIn) * 6).toFixed(2) + 'px,0)';
      }
    }

    if (debugFrac !== null) {
      var dbgOpticFade = debugFrac <= 0.68 ? 1.0 : (1.0 - easeInOutSine(clamp01((debugFrac - 0.68) / 0.16)));
      renderFrame(Math.min(1, debugFrac / 0.68) * exitStartMs, 0.016, dbgOpticFade);
      if (debugFrac > 0.68 && reticleWrap) {
        reticleWrap.style.opacity = dbgOpticFade.toFixed(3);
      }
      if (debugFrac > 0.84) {
        var veilP = easeInOutSine(clamp01((debugFrac - 0.84) / 0.16));
        splashEl.style.opacity = (1 - veilP).toFixed(3);
      }
      return;
    }

    function tick(now) {
      if (done) return;
      var rawDt = now - lastNow;
      lastNow = now;
      var clampedDt = rawDt > 0 ? Math.min(rawDt, 32) : 16.67;

      if (domReady && postDomFrames < 2) {
        postDomFrames += 1;
      }

      var nextSim = simMs + clampedDt;
      if (!clearingOptics && (!domReady || postDomFrames < 2) && nextSim > exitStartMs - 80) {
        nextSim = exitStartMs - 80;
      }
      simMs = nextSim;

      var opticFade = 1.0;
      if (clearingOptics) {
        var clearP = clamp01((simMs - clearStartSimMs) / clearDurationMs);
        opticFade = 1.0 - easeInOutSine(clearP);
        if (clearP >= 1.0 && !veilLifting) {
          // Clear WebGL canvas completely to transparent (0,0,0,0) BEFORE lifting the Obsidian-Cobalt veil!
          renderFrame(simMs, clampedDt * 0.001, 0.0);
          beginLiftCleanVeil();
          return;
        }
      }

      renderFrame(simMs, clampedDt * 0.001, opticFade);

      if (!clearingOptics && simMs >= exitStartMs) {
        beginClearOptics(false);
      }

      rafId = requestAnimationFrame(tick);
    }

    renderFrame(0, 0.016, 1.0);
    rafId = requestAnimationFrame(tick);
  }

  var initialSplash = document.getElementById('splash');
  var splashTemplateHtml = initialSplash ? initialSplash.outerHTML : '';

  if (initialSplash) {
    runSplash(initialSplash);
  }

  window.replayMediqSplash = function () {
    if (!splashTemplateHtml) return;
    var existing = document.getElementById('splash');
    if (existing && existing.parentNode) existing.parentNode.removeChild(existing);
    var holder = document.createElement('div');
    holder.innerHTML = splashTemplateHtml;
    var fresh = holder.firstElementChild;
    if (fresh && document.body) {
      document.body.insertBefore(fresh, document.body.firstChild);
      runSplash(fresh);
    }
  };
})();
