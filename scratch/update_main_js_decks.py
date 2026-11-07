from pathlib import Path

js_path = Path("assets/js/main.js")
js = js_path.read_text(encoding="utf-8")

marker = "/* ========================================================================= */\n/* MULTI-SECTION DECK CONTROLLER (Brands, Services, Resources, News, Contact)*/"

addon = '''
/* ========================================================================= */
/* MULTI-SECTION DECK CONTROLLER (Brands, Services, Resources, News, Contact)*/
/* ========================================================================= */
(function initMultiSectionDecks() {
  const DECK_MAP = {
    brands: 'brands',
    services: 'distribution',
    resources: 'resources',
    news: 'activities',
    contact: 'contact'
  };

  const state = {
    brands: 0,
    services: 0,
    resources: 0,
    news: 0,
    contact: 0
  };

  function goToDeckSlide(deckKey, idx, shouldScroll = false) {
    const secId = DECK_MAP[deckKey];
    const sec = secId ? document.getElementById(secId) : null;
    if (!sec) return;

    const slides = sec.querySelectorAll(`.deck-slide[data-deck="${deckKey}"]`);
    if (!slides.length) return;

    const total = slides.length;
    if (idx < 0) idx = 0;
    if (idx >= total) idx = total - 1;
    state[deckKey] = idx;

    slides.forEach((slide, i) => {
      slide.classList.remove(
        'opacity-100', 'pointer-events-auto', 'translate-x-0', 'z-10',
        'opacity-0', 'pointer-events-none', '-translate-x-12', 'translate-x-12', 'z-0'
      );
      if (i === idx) {
        slide.classList.add('opacity-100', 'pointer-events-auto', 'translate-x-0', 'z-10');
        slide.scrollTop = 0;
      } else if (i < idx) {
        slide.classList.add('opacity-0', 'pointer-events-none', '-translate-x-12', 'z-0');
      } else {
        slide.classList.add('opacity-0', 'pointer-events-none', 'translate-x-12', 'z-0');
      }
    });

    if (shouldScroll) {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.documentElement.style.scrollSnapType = '';
      sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  window.goToDeckSlide = goToDeckSlide;

  // Bind all navbar and dropdown items with [data-deck-target="deck:index"]
  document.querySelectorAll('[data-deck-target]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const raw = link.getAttribute('data-deck-target') || '';
      const [deckKey, idxStr] = raw.split(':');
      const idx = parseInt(idxStr || '0', 10);
      if (deckKey && DECK_MAP[deckKey]) {
        e.preventDefault();
        goToDeckSlide(deckKey, idx, true);
      }
    });
  });

  // Also ensure any link to #contact with "Inquiry" or "Order" opens Inquiry Form (slide 1) or Overview
  document.addEventListener('click', (e) => {
    const a = e.target.closest && e.target.closest('a[href="#contact"]');
    if (a && !a.hasAttribute('data-deck-target')) {
      goToDeckSlide('contact', 1, true);
    }
  });

  // Keyboard Left/Right navigation for whichever deck section is currently in view
  window.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT')) return;
    for (const [deckKey, secId] of Object.entries(DECK_MAP)) {
      const sec = document.getElementById(secId);
      if (!sec) continue;
      const rect = sec.getBoundingClientRect();
      if (rect.top <= window.innerHeight * 0.45 && rect.bottom >= window.innerHeight * 0.55) {
        const cur = state[deckKey] || 0;
        goToDeckSlide(deckKey, e.key === 'ArrowRight' ? cur + 1 : cur - 1, false);
        break;
      }
    }
  });

  // Initialize calm drifting smoke on all new deck-smoke-canvas elements
  const canvases = document.querySelectorAll('.deck-smoke-canvas');
  canvases.forEach((canvas) => {
    if (canvas._smokeActive) return;
    canvas._smokeActive = true;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = window.innerWidth, h = window.innerHeight;
    function resize() {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * 0.5);
      canvas.height = Math.floor(h * 0.5);
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const puffs = Array.from({ length: 10 }, (_, i) => ({
      baseX: (i / 10) * 1.2 - 0.1,
      baseY: 0.15 + (i % 3) * 0.3,
      r: 120 + (i % 4) * 35,
      speed: 0.1 + (i % 4) * 0.05,
      phase: i * 1.5,
      alpha: 0.32 + (i % 3) * 0.1
    }));

    let t = 0;
    let visible = false;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { visible = en.isIntersecting; });
    }, { threshold: 0.05 });
    io.observe(canvas.parentElement || canvas);

    function draw() {
      if (visible) {
        t += 0.008;
        const cw = canvas.width, ch = canvas.height;
        ctx.clearRect(0, 0, cw, ch);
        for (let i = 0; i < puffs.length; i++) {
          const p = puffs[i];
          const cx = (p.baseX + Math.sin(t * p.speed + p.phase) * 0.12) * cw;
          const cy = (p.baseY + Math.cos(t * p.speed * 0.85 + p.phase) * 0.08) * ch;
          const rad = p.r * (1 + Math.sin(t * 0.5 + p.phase) * 0.14);
          const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
          g.addColorStop(0, `rgba(28, 72, 145, ${(p.alpha * 0.65).toFixed(3)})`);
          g.addColorStop(0.5, `rgba(16, 43, 92, ${(p.alpha * 0.35).toFixed(3)})`);
          g.addColorStop(1, 'transparent');
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(cx, cy, rad, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
  });
})();
'''

if marker not in js.replace("\r\n", "\n"):
    js = js.rstrip() + "\n" + addon
    js_path.write_text(js, encoding="utf-8")
    print("Added initMultiSectionDecks to assets/js/main.js")
else:
    print("Already present in assets/js/main.js")

