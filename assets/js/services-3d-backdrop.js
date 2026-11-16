/**
 * MEDIQ Services 3D Bookshelf — Liquid Chrome WebGL Backdrop
 * Scoped strictly inside #srv-book-carousel-slide (#distribution deck slide 7),
 * rendered directly beneath #srv-library-transparent-veil (translucent veil kept intact),
 * while Services Slide 0 Landing Page stays on its original smoky-blue grid backdrop.
 */
(function initServicesLiquidChromeBackdrop() {
  'use strict';

  const VERT = 'attribute vec2 a; void main(){ gl_Position = vec4(a, 0.0, 1.0); }';
  const FRAG = `precision highp float;
uniform vec2 uRes; uniform float uTime; uniform float uCols; uniform vec2 uMouse; uniform float uLamp;
uniform vec3 uGlow; uniform vec3 uDeep; uniform vec3 uGround; uniform float uDim;
float h1(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(h1(i), h1(i + vec2(1, 0)), f.x), mix(h1(i + vec2(0, 1)), h1(i + vec2(1, 1)), f.x), f.y); }
float fbm(vec2 p){ float v = 0.0, a = 0.5; for (int i = 0; i < 4; i++){ v += a * vn(p); p = p * 2.02 + 7.3; a *= 0.5; } return v; }
float height(vec2 p, float t){
  vec2 q = vec2(fbm(p + vec2(0.0, t)), fbm(p + vec2(5.2, 1.3) - t));
  return fbm(p + 1.8 * q + vec2(0.3 * t, 0.0));
}
vec3 room(vec3 r){
  float up = r.y;
  vec3 c = mix(uGround * 1.2, uDeep, smoothstep(-0.6, 0.3, up));
  c = mix(c, uGlow, smoothstep(0.1, 0.7, r.x * 0.6 + up * 0.5) * 0.85);
  c += vec3(1.0) * exp(-pow((up - 0.62) / 0.05, 2.0)) * 1.1;
  c += vec3(1.0) * exp(-pow((r.x + 0.55) / 0.04, 2.0)) * smoothstep(-0.2, 0.6, up) * 0.6;
  return c;
}
void main(){
  vec2 p = gl_FragCoord.xy / max(uRes.y, 1.0) * (uCols / 4.0);
  float t = uTime * 0.05;
  vec2 m = uMouse / max(uRes.y, 1.0) * (uCols / 4.0);
  float e = 0.003;
  float d = length(p - m);
  float rip = uLamp * 0.03 * sin(d * 34.0 - uTime * 5.0) * exp(-d * 3.5);
  float h0 = height(p, t) + rip;
  float hx = height(p + vec2(e, 0.0), t) + uLamp * 0.03 * sin(length(p + vec2(e, 0.0) - m) * 34.0 - uTime * 5.0) * exp(-length(p + vec2(e, 0.0) - m) * 3.5);
  float hy = height(p + vec2(0.0, e), t) + uLamp * 0.03 * sin(length(p + vec2(0.0, e) - m) * 34.0 - uTime * 5.0) * exp(-length(p + vec2(0.0, e) - m) * 3.5);
  vec3 n = normalize(vec3((h0 - hx) / e * 0.55, (h0 - hy) / e * 0.55, 1.0));
  vec3 r = reflect(vec3(0.0, 0.0, -1.0), n);
  vec3 col = room(r);
  float fres = pow(1.0 - n.z, 2.0);
  col = mix(col * 0.92, vec3(1.0), fres * 0.15);
  col *= 0.75 + 0.25 * smoothstep(0.2, 0.8, h0);
  col *= (1.0 - uDim * 0.42);
  gl_FragColor = vec4(col, 1.0);
}`;

  function rgb(hex) {
    const v = parseInt(String(hex || '#000000').slice(1), 16) || 0;
    return [((v >> 16) & 255) / 255, ((v >> 8) & 255) / 255, (v & 255) / 255];
  }

  function boot() {
    const section = document.getElementById('distribution');
    const bookSlide = document.getElementById('srv-book-carousel-slide');
    const canvas = document.getElementById('distribution-3d-atrium-canvas');
    if (!section || !bookSlide || !canvas || canvas.dataset.atriumInit === '1') return;
    canvas.dataset.atriumInit = '1';

    const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'high-performance' });
    if (!gl) return;

    const reduced =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarse =
      typeof window.matchMedia === 'function' &&
      !window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    function compileShader(type, src) {
      const sh = gl.createShader(type);
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      return sh;
    }

    const vs = compileShader(gl.VERTEX_SHADER, VERT);
    const fs = compileShader(gl.FRAGMENT_SHADER, FRAG);
    const pr = gl.createProgram();
    gl.attachShader(pr, vs);
    gl.attachShader(pr, fs);
    gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return;

    gl.useProgram(pr);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    const U = (name) => gl.getUniformLocation(pr, name);
    const u = {
      res: U('uRes'),
      time: U('uTime'),
      cols: U('uCols'),
      mouse: U('uMouse'),
      lamp: U('uLamp'),
      glow: U('uGlow'),
      deep: U('uDeep'),
      ground: U('uGround'),
      dim: U('uDim'),
    };

    // MEDIQ Signature Navy & Luminous Sky-Blue Liquid Chrome Palette
    const palette = { glow: '#72c5f8', deep: '#0e2d61', ground: '#040c1d' };
    const columns = 4;
    const speed = 1.0;

    gl.uniform3fv(u.glow, rgb(palette.glow));
    gl.uniform3fv(u.deep, rgb(palette.deep));
    gl.uniform3fv(u.ground, rgb(palette.ground));

    let raf = 0;
    let visible = true;
    let slideActive = bookSlide.classList.contains('opacity-100');
    let last = 0;
    let t = 12;
    let bookProgress = 0;
    let spreadDim = 0;
    let smoothDim = 0;
    const m = { x: 0, y: 0, tx: 0, ty: 0, l: 0, tl: 0 };

    function isRunning() {
      return visible && slideActive && !document.hidden;
    }

    function size() {
      const rect = canvas.getBoundingClientRect();
      const cssW = rect.width || bookSlide.clientWidth || window.innerWidth;
      const cssH = rect.height || bookSlide.clientHeight || window.innerHeight;
      const scale = Math.min(window.devicePixelRatio || 1, 1.5) * (coarse ? 0.6 : 0.85);
      canvas.width = Math.max(1, Math.round(cssW * scale));
      canvas.height = Math.max(1, Math.round(cssH * scale));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(u.res, canvas.width, canvas.height);
      gl.uniform1f(u.cols, cssW < 640 ? Math.max(4, Math.round(columns * 0.55)) : columns);
    }

    function frame() {
      gl.uniform1f(u.time, t + bookProgress * 0.35);
      gl.uniform2f(u.mouse, m.x, m.y);
      gl.uniform1f(u.lamp, m.l);
      gl.uniform1f(u.dim, smoothDim);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    function tick(now) {
      raf = 0;
      if (!isRunning()) return;
      const dt = last ? Math.min(0.06, (now - last) / 1000) : 0.016;
      if (coarse && last && now - last < 33) {
        raf = requestAnimationFrame(tick);
        return;
      }
      last = now;
      t += dt * speed;
      m.x += (m.tx - m.x) * 0.12;
      m.y += (m.ty - m.y) * 0.12;
      m.l += (m.tl - m.l) * 0.06;
      smoothDim += (spreadDim - smoothDim) * 0.08;
      frame();
      raf = requestAnimationFrame(tick);
    }

    function start() {
      if (!isRunning()) {
        if (raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
        return;
      }
      size();
      if (reduced) {
        frame();
        return;
      }
      if (!raf) {
        last = 0;
        raf = requestAnimationFrame(tick);
      }
    }

    if (!coarse) {
      bookSlide.addEventListener(
        'pointermove',
        (e) => {
          const r = bookSlide.getBoundingClientRect();
          if (!r.width || !r.height) return;
          m.tx = ((e.clientX - r.left) / r.width) * canvas.width;
          m.ty = (1 - (e.clientY - r.top) / r.height) * canvas.height;
          if (!m.l) {
            m.x = m.tx;
            m.y = m.ty;
          }
          m.tl = 1;
        },
        { passive: true }
      );
      bookSlide.addEventListener(
        'pointerleave',
        () => {
          m.tl = 0;
        },
        { passive: true }
      );
    }

    window.addEventListener(
      'resize',
      () => {
        size();
        frame();
      },
      { passive: true }
    );

    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(() => {
        size();
        frame();
      });
      ro.observe(bookSlide);
    }

    if (typeof MutationObserver !== 'undefined') {
      const mo = new MutationObserver(() => {
        slideActive = bookSlide.classList.contains('opacity-100');
        start();
      });
      mo.observe(bookSlide, { attributes: true, attributeFilter: ['class'] });
    }

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(
        (entries) => {
          visible = entries.some((e) => e.isIntersecting);
          start();
        },
        { threshold: 0.02 }
      );
      io.observe(section);
    }

    document.addEventListener('visibilitychange', start);

    window.__updateServices3dBackdrop = function (currentBookIdx, openSpreadAlpha) {
      if (typeof currentBookIdx === 'number' && !Number.isNaN(currentBookIdx)) {
        bookProgress = currentBookIdx;
      }
      if (typeof openSpreadAlpha === 'number' && !Number.isNaN(openSpreadAlpha)) {
        spreadDim = Math.max(0, Math.min(1, openSpreadAlpha));
      }
      slideActive = bookSlide.classList.contains('opacity-100');
      start();
    };

    size();
    frame();
    start();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
