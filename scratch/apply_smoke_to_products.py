import re

# 1. Update index.html
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Add canvas elements to #product-slide-iols background
old_bg = """<!-- Persistent Subtle Grid & Ambient Radial Glows -->
          <div class="pointer-events-none absolute inset-0 z-0 overflow-hidden">
            <div class="absolute -left-20 top-1/4 h-[42rem] w-[42rem] rounded-full bg-sky/15 blur-[160px]"></div>
            <div class="absolute right-0 top-1/3 h-[46rem] w-[46rem] rounded-full bg-[#11326c]/40 blur-[180px]"></div>
            <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(#3aa0db_1px,transparent_1px)] [background-size:28px_28px] opacity-15"></div>
          </div>"""

new_bg = """<!-- Persistent Subtle Grid, Silk Waves & Organic Smoke Canvases (Matching Hero) -->
          <div class="pointer-events-none absolute inset-0 z-0 overflow-hidden">
            <canvas id="products-waves-shader-canvas" class="pointer-events-none absolute inset-0 z-0 block size-full opacity-50" aria-hidden="true"></canvas>
            <canvas id="products-smoke-canvas" class="pointer-events-none absolute inset-0 z-[1] block size-full opacity-65" aria-hidden="true"></canvas>
            <div class="absolute -left-20 top-1/4 h-[42rem] w-[42rem] rounded-full bg-sky/15 blur-[160px] z-[2]"></div>
            <div class="absolute right-0 top-1/3 h-[46rem] w-[46rem] rounded-full bg-[#11326c]/40 blur-[180px] z-[2]"></div>
            <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(#3aa0db_1px,transparent_1px)] [background-size:28px_28px] opacity-15 z-[3]"></div>
          </div>"""

if old_bg in html:
    html = html.replace(old_bg, new_bg)
    print("Replaced background in Slide 1 with smoke canvases!")
else:
    print("WARNING: old_bg not found directly in index.html")

# Bump version to v=358.00
html = re.sub(r'src="assets/js/main\.js\?v=[\d\.]+"', 'src="assets/js/main.js?v=358.00"', html)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("Updated index.html!")

# 2. Update assets/js/main.js
with open('assets/js/main.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Add initProductsSmokeCanvas function and initialize it along with silk waves
smoke_function = """/* ========================================================================= */
/* PRODUCTS ORGANIC SMOKE CANVAS & SILK WAVES (Matches Hero Section Design)  */
/* ========================================================================= */
function initProductsSmokeCanvas() {
  const canvas = document.getElementById('products-smoke-canvas');
  if (!canvas || canvas._smokeActive) return;
  canvas._smokeActive = true;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  let w = 1, h = 1, dpr = 1;
  let t = 0;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    w = Math.max(1, Math.floor(rect.width));
    h = Math.max(1, Math.floor(rect.height));
    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr;
      canvas.height = h * dpr;
    }
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  // 18 drifting organic smoke puffs across the products background
  const puffs = Array.from({ length: 18 }, (_, i) => ({
    baseX: (i / 18) * 1.3 - 0.15,
    baseY: 0.12 + (i % 4) * 0.24,
    r: 240 + (i % 6) * 70,
    speed: 0.12 + (i % 5) * 0.06,
    phase: i * 1.42,
    alpha: 0.45 + (i % 4) * 0.12,
    hueShift: (i % 3)
  }));

  function renderSmoke() {
    t += 0.008; // Calm, serene organic fluid smoke drift
    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    for (let i = 0; i < puffs.length; i++) {
      const p = puffs[i];
      const cx = (p.baseX + Math.sin(t * p.speed + p.phase) * 0.15 + Math.sin(t * 0.3 + p.phase * 0.7) * 0.04) * w;
      const cy = (p.baseY + Math.cos(t * p.speed * 0.85 + p.phase) * 0.10 + Math.cos(t * 0.25 + p.phase) * 0.03) * h;
      const rad = p.r * (1 + Math.sin(t * 0.55 + p.phase) * 0.18);

      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
      g.addColorStop(0, `rgba(20, 53, 112, ${(p.alpha * 0.68).toFixed(3)})`);
      g.addColorStop(0.40, `rgba(16, 43, 92, ${(p.alpha * 0.45).toFixed(3)})`);
      g.addColorStop(0.78, `rgba(10, 29, 64, ${(p.alpha * 0.20).toFixed(3)})`);
      g.addColorStop(1, 'transparent');

      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx, cy, rad, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
    requestAnimationFrame(renderSmoke);
  }
  requestAnimationFrame(renderSmoke);
}

"""

# Insert smoke_function right before initProductsDeckController
marker = 'function initProductsDeckController()'
pos = js.find(marker)
if pos != -1:
    js = js[:pos] + smoke_function + js[pos:]
    print("Inserted initProductsSmokeCanvas before initProductsDeckController!")

# Initialize in DOMContentLoaded or ready
init_call = """    initProductsDeckController();
    initIOLScrollStageController();
    initProductsSmokeCanvas();
    if (typeof initSilkWavesShader === 'function') {
      initSilkWavesShader('products-waves-shader-canvas');
    }"""

old_init = """    initProductsDeckController();
    initIOLScrollStageController();"""

js = js.replace(old_init, init_call)

with open('assets/js/main.js', 'w', encoding='utf-8') as f:
    f.write(js)

print("Updated assets/js/main.js with smoke canvas initialization!")

