with open('assets/js/main.js', 'r', encoding='utf-8') as f:
    content = f.read()

target_marker = '/* PRODUCTS IN-PAGE 5-SLIDE DECK CONTROLLER'
idx = content.find(target_marker)
divider_idx = content.rfind('/* ===', 0, idx)
if divider_idx != -1:
    idx = divider_idx

new_main_js_tail = '''/* ========================================================================= */
/* INTRAOCULAR LENSES 3D SCROLL-DRIVEN STAGE CHOREOGRAPHY (ZANDRELLEZ)       */
/* ========================================================================= */
function initIOLScrollStageController() {
  const scrollContainer = document.getElementById('iol-scroll-container');
  if (!scrollContainer) return;

  const stage0 = document.getElementById('iol-stage-0');
  const stage1 = document.getElementById('iol-stage-1');
  const stage2 = document.getElementById('iol-stage-2');
  const fill0 = document.getElementById('iol-fill-0');
  const fill1 = document.getElementById('iol-fill-1');
  const fill2 = document.getElementById('iol-fill-2');
  const railTabs = document.querySelectorAll('.iol-rail-tab');

  const stages = [stage0, stage1, stage2].filter(Boolean);
  const fills = [fill0, fill1, fill2].filter(Boolean);

  const ZONES = [
    { hold: [0, 0.28], exit: [0.28, 0.42], enter: null },
    { hold: [0.42, 0.58], exit: [0.58, 0.72], enter: [0.28, 0.42] },
    { hold: [0.72, 1.0], exit: null, enter: [0.58, 0.72] }
  ];

  function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
  }

  function getTransform(p, isLeftCol, incoming) {
    const dist = 60; // pixel distance
    let y = 0;
    if (!incoming) {
      y = isLeftCol ? -p * dist : p * dist;
    } else {
      y = isLeftCol ? (1 - p) * dist : (p - 1) * dist;
    }
    const opacity = incoming ? clamp(p * 2, 0, 1) : clamp(1 - p * 2, 0, 1);
    const scale = incoming ? 0.94 + opacity * 0.06 : 1 - p * 0.06;
    return {
      transform: `translate3d(0, ${y.toFixed(1)}px, 0) scale(${scale.toFixed(3)})`,
      opacity: opacity
    };
  }

  function updateScroll() {
    const maxScroll = scrollContainer.scrollHeight - scrollContainer.clientHeight;
    if (maxScroll <= 0) return;
    const progress = clamp(scrollContainer.scrollTop / maxScroll, 0, 1);

    stages.forEach((stage, idx) => {
      const zone = ZONES[idx];
      let opacity = 0;
      let leftTransform = 'translate3d(0, 0, 0) scale(1)';
      let rightTransform = 'translate3d(0, 0, 0) scale(1)';

      if (progress >= zone.hold[0] && progress <= zone.hold[1]) {
        opacity = 1;
      } else if (zone.enter && progress >= zone.enter[0] && progress <= zone.enter[1]) {
        const t = (progress - zone.enter[0]) / (zone.enter[1] - zone.enter[0]);
        const leftData = getTransform(t, true, true);
        const rightData = getTransform(t, false, true);
        opacity = leftData.opacity;
        leftTransform = leftData.transform;
        rightTransform = rightData.transform;
      } else if (zone.exit && progress >= zone.exit[0] && progress <= zone.exit[1]) {
        const t = (progress - zone.exit[0]) / (zone.exit[1] - zone.exit[0]);
        const leftData = getTransform(t, true, false);
        const rightData = getTransform(t, false, false);
        opacity = leftData.opacity;
        leftTransform = leftData.transform;
        rightTransform = rightData.transform;
      } else {
        opacity = 0;
        const isBefore = progress < (zone.enter ? zone.enter[0] : zone.hold[0]);
        const y = isBefore ? 60 : -60;
        leftTransform = `translate3d(0, ${y}px, 0) scale(0.94)`;
        rightTransform = `translate3d(0, ${-y}px, 0) scale(0.94)`;
      }

      stage.style.opacity = opacity.toFixed(3);
      if (opacity > 0.02) {
        stage.classList.add('pointer-events-auto');
        stage.classList.remove('pointer-events-none');
      } else {
        stage.classList.remove('pointer-events-auto');
        stage.classList.add('pointer-events-none');
      }

      const leftCol = stage.children[0];
      const rightCol = stage.children[1];
      if (leftCol) leftCol.style.transform = leftTransform;
      if (rightCol) rightCol.style.transform = rightTransform;
    });

    // Update rail fill progress
    if (fills[0]) {
      const p0 = progress < 0.35 ? 1 : clamp(1 - (progress - 0.28) / 0.14, 0, 1);
      fills[0].style.transform = 'scaleX(' + p0.toFixed(2) + ')';
    }
    if (fills[1]) {
      const p1 = progress < 0.28 ? 0 : (progress > 0.65 ? 1 : (progress - 0.28) / (0.58 - 0.28));
      fills[1].style.transform = 'scaleX(' + clamp(p1, 0, 1).toFixed(2) + ')';
    }
    if (fills[2]) {
      const p2 = progress < 0.58 ? 0 : (progress - 0.58) / (1.0 - 0.58);
      fills[2].style.transform = 'scaleX(' + clamp(p2, 0, 1).toFixed(2) + ')';
    }

    const activeStage = progress < 0.35 ? 0 : (progress < 0.68 ? 1 : 2);
    railTabs.forEach((tab, i) => {
      tab.classList.toggle('is-active', i === activeStage);
    });
  }

  scrollContainer.addEventListener('scroll', updateScroll, { passive: true });
  window.__updateIOLScroll = updateScroll;
  setTimeout(updateScroll, 100);

  window.jumpIolStage = function (stageIdx) {
    const maxScroll = scrollContainer.scrollHeight - scrollContainer.clientHeight;
    let target = 0;
    if (stageIdx === 1) target = maxScroll * 0.5;
    if (stageIdx === 2) target = maxScroll;
    scrollContainer.scrollTo({ top: target, behavior: 'smooth' });
  };
}

window.handleIolTilt = function (e, scene) {
  const rect = scene.getBoundingClientRect();
  const x = (e.clientX - rect.left) / rect.width - 0.5;
  const y = (e.clientY - rect.top) / rect.height - 0.5;
  const rig = scene.querySelector('.iol-tilt-rig');
  if (rig) {
    rig.style.transform = 'rotateX(' + (-y * 22).toFixed(1) + 'deg) rotateY(' + (x * 28).toFixed(1) + 'deg)';
  }
};

window.resetIolTilt = function (scene) {
  const rig = scene.querySelector('.iol-tilt-rig');
  if (rig) {
    rig.style.transform = 'rotateX(0deg) rotateY(0deg)';
  }
};

window.toggleIolAcc = function (btn) {
  const row = btn.closest('.iol-accordion-row');
  if (!row) return;
  const isOpen = row.getAttribute('data-open') === 'true';
  const siblings = row.parentElement.querySelectorAll('.iol-accordion-row');
  siblings.forEach((s) => s.setAttribute('data-open', 'false'));
  if (!isOpen) {
    row.setAttribute('data-open', 'true');
  }
};

/* ========================================================================= */
/* PRODUCTS IN-PAGE 5-SLIDE DECK CONTROLLER (Matches About Deck Motion)      */
/* ========================================================================= */
function initProductsDeckController() {
  const prodSec = document.getElementById('products');
  if (!prodSec) return;

  const slides = prodSec.querySelectorAll('.product-slide');
  const prevBtn = document.getElementById('products-deck-prev');
  const nextBtn = document.getElementById('products-deck-next');
  const counter = document.getElementById('products-deck-counter');

  if (!slides.length) return;

  let currentIndex = 0;
  const total = slides.length;

  function goToSlide(idx) {
    if (idx < 0) idx = 0;
    if (idx >= total) idx = total - 1;
    currentIndex = idx;
    window.__productsDeckCurrentIndex = idx;

    slides.forEach((slide, i) => {
      slide.classList.remove('opacity-100', 'pointer-events-auto', 'translate-x-0', 'z-10', 'opacity-0', 'pointer-events-none', '-translate-x-12', 'translate-x-12', 'z-0');
      if (i === currentIndex) {
        slide.classList.add('opacity-100', 'pointer-events-auto', 'translate-x-0', 'z-10');
      } else if (i < currentIndex) {
        slide.classList.add('opacity-0', 'pointer-events-none', '-translate-x-12', 'z-0');
      } else {
        slide.classList.add('opacity-0', 'pointer-events-none', 'translate-x-12', 'z-0');
      }
    });

    if (counter) {
      counter.textContent = String(currentIndex + 1).padStart(2, '0') + ' / ' + String(total).padStart(2, '0');
    }

    if (prevBtn) prevBtn.disabled = (currentIndex === 0);
    if (nextBtn) nextBtn.disabled = (currentIndex === total - 1);

    // Subtle fade of floating nav controls on Slide 0, highlight on Slides 1-4
    const navCtrl = document.getElementById('products-deck-nav');
    if (navCtrl) {
      if (currentIndex === 0) {
        navCtrl.classList.add('opacity-85');
        navCtrl.classList.remove('opacity-100');
      } else {
        navCtrl.classList.remove('opacity-85');
        navCtrl.classList.add('opacity-100');
      }
    }

    // If entering Slide 1 (IOLs 3D Section), initialize scroll state
    if (currentIndex === 1 && typeof window.__updateIOLScroll === 'function') {
      setTimeout(window.__updateIOLScroll, 100);
    }
  }

  if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));

  // Connect navbar dropdown items & in-page quick nav buttons
  document.querySelectorAll('[data-product-slide]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetSlide = parseInt(link.getAttribute('data-product-slide') || '0', 10);
      goToSlide(targetSlide);
      if (prodSec) {
        prodSec.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  const navProducts = document.getElementById('nav-products');
  if (navProducts) {
    navProducts.addEventListener('click', () => {
      goToSlide(0);
      if (prodSec) {
        prodSec.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Keyboard navigation when scrolled into products section
  window.addEventListener('keydown', (e) => {
    const rect = prodSec.getBoundingClientRect();
    const inView = (rect.top <= window.innerHeight * 0.5 && rect.bottom >= window.innerHeight * 0.5);
    if (inView) {
      if (e.key === 'ArrowRight') goToSlide(currentIndex + 1);
      if (e.key === 'ArrowLeft') goToSlide(currentIndex - 1);
    }
  });

  // Touch swipe support inside products deck
  let touchStartX = 0;
  prodSec.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  prodSec.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].screenX;
    const diffX = touchStartX - touchEndX;
    if (Math.abs(diffX) > 50) {
      if (diffX > 0) {
        goToSlide(currentIndex + 1);
      } else {
        goToSlide(currentIndex - 1);
      }
    }
  }, { passive: true });

  window.goToProductSlide = goToSlide;

  // Initialize first slide
  goToSlide(0);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initProductsDeckController();
    initIOLScrollStageController();
  });
} else {
  initProductsDeckController();
  initIOLScrollStageController();
}
'''

new_content = content[:idx] + new_main_js_tail

with open('assets/js/main.js', 'w', encoding='utf-8') as f:
    f.write(new_content)

print(f"Updated main.js with IOL 3D controller successfully! Length: {len(new_content)}")

