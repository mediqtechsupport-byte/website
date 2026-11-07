with open('assets/js/main.js', 'r', encoding='utf-8') as f:
    content = f.read()

start_marker = '/* ========================================================================= */\n/* ABOUT MEDIQ SCROLL-DRIVEN STACKING CAPABILITY CARDS'
if start_marker not in content:
    start_marker = '/* ABOUT MEDIQ SCROLL-DRIVEN STACKING CAPABILITY CARDS'

start_idx = content.find(start_marker)
if start_idx == -1:
    print("Could not find start marker in main.js")
    import sys
    sys.exit(1)

new_overlay_and_stack_logic = '''/* ========================================================================= */
/* ABOUT MEDIQ 3-CARD OVERLAYS & CAPABILITIES STACKING CONTROLLER            */
/* ========================================================================= */
let activeAboutOverlay = null;

function openAboutOverlay(type) {
  closeAboutOverlay();
  let overlayId = '';
  if (type === 'what-we-do' || type === 'capabilities') {
    overlayId = 'about-overlay-what-we-do';
  } else if (type === 'foundation') {
    overlayId = 'about-overlay-foundation';
  } else if (type === 'values') {
    overlayId = 'about-overlay-values';
  }

  const overlay = document.getElementById(overlayId);
  if (!overlay) return;

  activeAboutOverlay = overlay;
  overlay.classList.remove('opacity-0', 'pointer-events-none');
  overlay.classList.add('opacity-100', 'pointer-events-auto');
  document.body.style.overflow = 'hidden';

  if (overlayId === 'about-overlay-what-we-do' && typeof window.__resetModalStack === 'function') {
    window.__resetModalStack();
  }
}

function closeAboutOverlay() {
  const overlays = document.querySelectorAll('#about-overlay-what-we-do, #about-overlay-foundation, #about-overlay-values');
  overlays.forEach((ov) => {
    ov.classList.remove('opacity-100', 'pointer-events-auto');
    ov.classList.add('opacity-0', 'pointer-events-none');
  });
  activeAboutOverlay = null;
  if (!window.__aboutDeckCurrentIndex || window.__aboutDeckCurrentIndex === 0) {
    document.body.style.overflow = '';
  }
}

window.openAboutOverlay = openAboutOverlay;
window.closeAboutOverlay = closeAboutOverlay;

// Close overlay on ESC key
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && activeAboutOverlay) {
    closeAboutOverlay();
  }
});

/* ========================================================================= */
/* MODAL STACKING CARDS ENGINE (What We Do 6-Card Interactive 3D Stack)      */
/* ========================================================================= */
function initModalStackingCards() {
  const stage = document.getElementById('modal-stacking-stage');
  const cards = document.querySelectorAll('.modal-stack-card');
  const prevBtn = document.getElementById('modal-stack-prev');
  const nextBtn = document.getElementById('modal-stack-next');
  const dots = document.querySelectorAll('.modal-dot');
  const overlay = document.getElementById('about-overlay-what-we-do');

  if (!cards.length) return;

  let currentIdx = 0;
  const total = cards.length;

  function renderModalStack(targetIdx, animate = true) {
    currentIdx = Math.max(0, Math.min(total - 1, targetIdx));

    cards.forEach((card, i) => {
      card.style.transition = animate 
        ? 'transform 0.48s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.48s cubic-bezier(0.16, 1, 0.3, 1), filter 0.48s ease'
        : 'none';

      if (i < currentIdx) {
        // Stacked neatly above at top rim
        const diff = currentIdx - i;
        const translateY = -(diff * 10);
        const scale = Math.max(0.88, 1 - diff * 0.025);
        const brightness = Math.max(0.60, 1 - diff * 0.08);

        card.style.transform = "translateY(" + translateY + "px) scale(" + scale + ")";
        card.style.filter = "brightness(" + brightness.toFixed(2) + ")";
        card.style.opacity = '1';
        card.style.zIndex = String(10 + i);
        card.style.pointerEvents = 'none';
      } else if (i === currentIdx) {
        // Active card front and center
        card.style.transform = 'translateY(0px) scale(1)';
        card.style.filter = 'brightness(1)';
        card.style.opacity = '1';
        card.style.zIndex = '50';
        card.style.pointerEvents = 'auto';
      } else {
        // Waiting cards in stack underneath
        const diff = i - currentIdx;
        const translateY = diff * 12;
        const scale = Math.max(0.88, 1 - diff * 0.028);
        const brightness = Math.max(0.55, 1 - diff * 0.12);
        const opacity = Math.max(0, 0.85 - diff * 0.22);

        card.style.transform = "translateY(" + translateY + "px) scale(" + scale + ")";
        card.style.filter = "brightness(" + brightness.toFixed(2) + ")";
        card.style.opacity = String(opacity.toFixed(2));
        card.style.zIndex = String(40 - diff);
        card.style.pointerEvents = 'none';
      }
    });

    if (prevBtn) prevBtn.disabled = (currentIdx === 0);
    if (nextBtn) nextBtn.disabled = (currentIdx === total - 1);

    dots.forEach((dot, idx) => {
      const isActive = (idx === currentIdx);
      if (isActive) {
        dot.className = 'modal-dot h-2 w-7 rounded-full bg-sky shadow-[0_0_10px_#3aa0db] transition-all cursor-pointer';
      } else {
        dot.className = 'modal-dot h-2 w-2 rounded-full bg-white/20 hover:bg-white/40 transition-all cursor-pointer';
      }
    });
  }

  function step(delta) {
    renderModalStack(currentIdx + delta, true);
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      step(-1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      step(1);
    });
  }

  dots.forEach((dot) => {
    dot.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const dotIdx = parseInt(dot.getAttribute('data-dot') || '0', 10);
      renderModalStack(dotIdx, true);
    });
  });

  // Wheel scroll inside modal to advance cards
  let lastWheel = 0;
  if (overlay) {
    overlay.addEventListener('wheel', (e) => {
      e.stopPropagation();
      const now = Date.now();
      if (now - lastWheel > 240) {
        lastWheel = now;
        if (e.deltaY > 10) step(1);
        else if (e.deltaY < -10) step(-1);
      }
    }, { passive: true });
  }

  window.__resetModalStack = () => renderModalStack(0, false);
  renderModalStack(0, false);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initAboutDeckController();
    initModalStackingCards();
  });
} else {
  initAboutDeckController();
  initModalStackingCards();
}
'''

updated_content = content[:start_idx] + new_overlay_and_stack_logic

with open('assets/js/main.js', 'w', encoding='utf-8') as f:
    f.write(updated_content)

print("Updated main.js with 3-card overlay and modal stack engine successfully!")

