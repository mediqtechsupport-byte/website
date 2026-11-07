with open('assets/js/main.js', 'r', encoding='utf-8') as f:
    content = f.read()

target_marker = '/* INTRAOCULAR LENSES 3D SCROLL-DRIVEN STAGE CHOREOGRAPHY (ZANDRELLEZ)'
idx = content.find(target_marker)
divider_idx = content.rfind('/* ===', 0, idx)
if divider_idx != -1:
    idx = divider_idx

new_js = '''/* ========================================================================= */
/* INTRAOCULAR LENSES 3D SCROLL-DRIVEN STAGE CHOREOGRAPHY (ZANDRELLEZ)       */
/* ========================================================================= */
function initIOLScrollStageController() {
  const scrollContainer = document.getElementById('iol-scroll-container');
  if (!scrollContainer) return;

  const scenes = [
    document.getElementById('iol-scene-0'),
    document.getElementById('iol-scene-1'),
    document.getElementById('iol-scene-2')
  ];
  const contents = [
    document.getElementById('iol-content-0'),
    document.getElementById('iol-content-1'),
    document.getElementById('iol-content-2')
  ];
  const fills = [
    document.getElementById('iol-fill-0'),
    document.getElementById('iol-fill-1'),
    document.getElementById('iol-fill-2')
  ];
  const railTabs = document.querySelectorAll('.sv-rail__item');
  const badgeText = document.getElementById('iol-stage-badge-text');

  const STAGE_NAMES = [
    'STAGE 01 • RAYONE® EMV',
    'STAGE 02 • RAYONE® TRIFOCAL',
    'STAGE 03 • RAYONE® ASPHERIC'
  ];

  const mobileImg = document.getElementById('iol-mobile-packshot');
  const mobileTitle = document.getElementById('iol-mobile-title');
  const mobileSub = document.getElementById('iol-mobile-sub');
  const mobileDesc = document.getElementById('iol-mobile-desc');

  const MOBILE_DATA = [
    {
      img: 'assets/img/packshots/emv_stage.png',
      title: 'RayOne® EMV',
      sub: 'Co-developed with Prof. Graham Barrett',
      desc: 'Non-diffractive extended depth of field IOL providing seamless intermediate and functional near vision without dysphotopsia.'
    },
    {
      img: 'assets/img/packshots/trifocal_stage.png',
      title: 'RayOne® Trifocal',
      sub: 'Halved diffractive rings for maximum light transmission',
      desc: 'Directs 89% of light onto the retina with lowest 11% light scatter for vibrant contrast and intermediate reading.'
    },
    {
      img: 'assets/img/packshots/aspheric_stage.png',
      title: 'RayOne® Aspheric',
      sub: 'Aberration-neutral precision & Sulcoflex optics',
      desc: 'Aberration-neutral monofocal IOL designed for pristine contrast sensitivity across all corneas.'
    }
  ];

  const ZONES = [
    { hold: [0, 0.28], exit: [0.28, 0.42], enter: null },
    { hold: [0.42, 0.58], exit: [0.58, 0.72], enter: [0.28, 0.42] },
    { hold: [0.72, 1.0], exit: null, enter: [0.58, 0.72] }
  ];

  function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
  }

  // Exact zandrellez getTransform mathematics (80vh distance opposing translation)
  function getTransform(progress, column, incoming) {
    const distance = 80; // vh
    let y = 0;
    if (!incoming) {
      y = column === 'left' ? progress * -distance : progress * distance;
    } else {
      y = column === 'left' ? (1 - progress) * distance : (progress - 1) * distance;
    }
    const opacity = incoming ? clamp(progress * 1.8, 0, 1) : clamp(1 - progress * 1.8, 0, 1);
    const scale = incoming ? 0.94 + opacity * 0.06 : 1 - progress * 0.06;
    return {
      transform: `translate3d(0, ${y.toFixed(2)}vh, 0) scale(${scale.toFixed(3)})`,
      opacity: opacity
    };
  }

  function getStyle(globalProgress, index, column) {
    const zone = ZONES[index];
    const { hold, enter, exit } = zone;
    const distance = 80;

    if (globalProgress >= hold[0] && globalProgress <= hold[1]) {
      return { opacity: 1, transform: "translate3d(0,0,0) scale(1)" };
    }
    if (enter && globalProgress >= enter[0] && globalProgress <= enter[1]) {
      const t = (globalProgress - enter[0]) / (enter[1] - enter[0]);
      return getTransform(t, column, true);
    }
    if (exit && globalProgress >= exit[0] && globalProgress <= exit[1]) {
      const t = (globalProgress - exit[0]) / (exit[1] - exit[0]);
      return getTransform(t, column, false);
    }

    const isBefore = globalProgress < (enter ? enter[0] : hold[0]);
    const y = isBefore ? (column === "left" ? distance : -distance) : (column === "left" ? -distance : distance);
    return {
      opacity: 0,
      transform: `translate3d(0, ${y}vh, 0) scale(0.94)`
    };
  }

  function updateScroll() {
    const maxScroll = scrollContainer.scrollHeight - scrollContainer.clientHeight;
    if (maxScroll <= 0) return;
    const globalProgress = clamp(scrollContainer.scrollTop / maxScroll, 0, 1);

    // Update 3 stages with exact opposing translation
    for (let i = 0; i < 3; i++) {
      const sceneEl = scenes[i];
      const contentEl = contents[i];
      if (!sceneEl || !contentEl) continue;

      // For Stage 0 & 2: scene is Left, content is Right
      // For Stage 1: scene is Right, content is Left (alternating!)
      const sceneCol = (i === 1) ? 'right' : 'left';
      const contentCol = (i === 1) ? 'left' : 'right';

      const sStyle = getStyle(globalProgress, i, sceneCol);
      const cStyle = getStyle(globalProgress, i, contentCol);

      sceneEl.style.transform = sStyle.transform;
      sceneEl.style.opacity = sStyle.opacity.toFixed(3);
      sceneEl.style.pointerEvents = sStyle.opacity > 0.08 ? 'auto' : 'none';

      contentEl.style.transform = cStyle.transform;
      contentEl.style.opacity = cStyle.opacity.toFixed(3);
      contentEl.style.pointerEvents = cStyle.opacity > 0.08 ? 'auto' : 'none';
    }

    // Determine active stage
    const activeStage = globalProgress < 0.35 ? 0 : (globalProgress < 0.68 ? 1 : 2);

    // Highlight active stage badge
    if (badgeText) {
      badgeText.textContent = STAGE_NAMES[activeStage];
    }

    // Update mobile content
    if (mobileImg && MOBILE_DATA[activeStage]) {
      mobileImg.src = MOBILE_DATA[activeStage].img;
      mobileTitle.textContent = MOBILE_DATA[activeStage].title;
      mobileSub.textContent = MOBILE_DATA[activeStage].sub;
      mobileDesc.textContent = MOBILE_DATA[activeStage].desc;
    }

    // Update progress rail fills & current aria attribute
    railTabs.forEach((tab, idx) => {
      tab.setAttribute('aria-current', idx === activeStage ? 'true' : 'false');
    });

    if (fills[0]) {
      const p0 = globalProgress <= 0.28 ? 1 : (globalProgress >= 0.42 ? 0 : 1 - (globalProgress - 0.28) / 0.14);
      fills[0].style.transform = `scaleX(${clamp(p0, 0, 1).toFixed(3)})`;
    }
    if (fills[1]) {
      const p1 = globalProgress <= 0.28 ? 0 : (globalProgress >= 0.58 ? 1 : (globalProgress - 0.28) / 0.30);
      fills[1].style.transform = `scaleX(${clamp(p1, 0, 1).toFixed(3)})`;
    }
    if (fills[2]) {
      const p2 = globalProgress <= 0.58 ? 0 : (globalProgress - 0.58) / 0.42;
      fills[2].style.transform = `scaleX(${clamp(p2, 0, 1).toFixed(3)})`;
    }
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
  const rig = scene.querySelector('.sv-tilt');
  if (rig) {
    rig.style.transform = 'rotateX(' + (-y * 18).toFixed(1) + 'deg) rotateY(' + (x * 24).toFixed(1) + 'deg)';
  }
};

window.resetIolTilt = function (scene) {
  const rig = scene.querySelector('.sv-tilt');
  if (rig) {
    rig.style.transform = 'rotateX(0deg) rotateY(0deg)';
  }
};

window.toggleIolAcc = function (btn) {
  const row = btn.closest('.sv-row');
  if (!row) return;
  const isOpen = row.getAttribute('data-open') === 'true';
  const siblings = row.parentElement.querySelectorAll('.sv-row');
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

new_main_js = content[:idx] + new_js

with open('assets/js/main.js', 'w', encoding='utf-8') as f:
    f.write(new_main_js)

print(f"Applied clean opposing transition controller to main.js! Length: {len(new_main_js)}")

