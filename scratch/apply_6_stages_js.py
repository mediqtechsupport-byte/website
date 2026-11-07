with open('assets/js/main.js', 'r', encoding='utf-8') as f:
    content = f.read()

target_marker = '/* INTRAOCULAR LENSES 3D SCROLL-DRIVEN STAGE CHOREOGRAPHY (ZANDRELLEZ)'
idx = content.find(target_marker)
divider_idx = content.rfind('/* ===', 0, idx)
if divider_idx != -1:
    idx = divider_idx

new_js = '''/* ========================================================================= */
/* INTRAOCULAR LENSES 3D SCROLL-DRIVEN STAGE CHOREOGRAPHY (6 INNOVATIONS)     */
/* ========================================================================= */
function initIOLScrollStageController() {
  const scrollContainer = document.getElementById('iol-scroll-container');
  if (!scrollContainer) return;

  const scenes = [
    document.getElementById('iol-scene-0'),
    document.getElementById('iol-scene-1'),
    document.getElementById('iol-scene-2'),
    document.getElementById('iol-scene-3'),
    document.getElementById('iol-scene-4'),
    document.getElementById('iol-scene-5')
  ];
  const contents = [
    document.getElementById('iol-content-0'),
    document.getElementById('iol-content-1'),
    document.getElementById('iol-content-2'),
    document.getElementById('iol-content-3'),
    document.getElementById('iol-content-4'),
    document.getElementById('iol-content-5')
  ];
  const fills = [
    document.getElementById('iol-fill-0'),
    document.getElementById('iol-fill-1'),
    document.getElementById('iol-fill-2'),
    document.getElementById('iol-fill-3'),
    document.getElementById('iol-fill-4'),
    document.getElementById('iol-fill-5')
  ];
  const railTabs = document.querySelectorAll('.sv-rail__item');
  const badgeText = document.getElementById('iol-stage-badge-text');

  const STAGE_NAMES = [
    'STAGE 01 • RAYONE® EMV',
    'STAGE 02 • RAYONE® EMV TORIC',
    'STAGE 03 • RAYONE® TRIFOCAL',
    'STAGE 04 • RAYONE® TRIFOCAL TORIC',
    'STAGE 05 • RAYONE® ASPHERIC',
    'STAGE 06 • SULCOFLEX® ASPHERIC'
  ];

  const mobileImg = document.getElementById('iol-mobile-packshot');
  const mobileTitle = document.getElementById('iol-mobile-title');
  const mobileSub = document.getElementById('iol-mobile-sub');
  const mobileDesc = document.getElementById('iol-mobile-desc');

  const MOBILE_DATA = [
    {
      img: 'assets/img/packshots/iol_emv.png',
      title: 'RayOne® EMV',
      sub: 'Co-developed with Prof. Graham Barrett',
      desc: 'Non-diffractive extended depth of field IOL providing seamless intermediate and functional near vision without dysphotopsia.'
    },
    {
      img: 'assets/img/packshots/iol_emv_toric.png',
      title: 'RayOne® EMV Toric',
      sub: 'Extended Depth of Focus • Precision Astigmatism Correction',
      desc: 'Combines patented positive spherical aberration EDOF optics with rotatably stable closed-loop toric haptics.'
    },
    {
      img: 'assets/img/packshots/iol_trifocal.png',
      title: 'RayOne® Trifocal',
      sub: 'Halved diffractive rings for maximum light transmission',
      desc: 'Directs 89% of light onto the retina with lowest 11% light scatter for vibrant contrast and intermediate reading.'
    },
    {
      img: 'assets/img/packshots/iol_trifocal_toric.png',
      title: 'RayOne® Trifocal Toric',
      sub: 'Full Spectacle Freedom • Simultaneous Astigmatism Correction',
      desc: 'Neutralizes pre-existing corneal astigmatism while providing seamless far-to-near spectacle independence.'
    },
    {
      img: 'assets/img/packshots/iol_aspheric.png',
      title: 'RayOne® Aspheric',
      sub: 'Aberration-neutral precision & Sulcoflex optics',
      desc: 'Aberration-neutral monofocal IOL designed for pristine contrast sensitivity across all corneas.'
    },
    {
      img: 'assets/img/packshots/iol_sulcoflex.png',
      title: 'Sulcoflex® Aspheric',
      sub: 'Pseudophakic Supplementary Ciliary Sulcus Platform',
      desc: 'Reversible secondary IOL engineered for ciliary sulcus placement to correct residual cylinder or refractive surprise.'
    }
  ];

  // 6 Zones covering 0.0 to 1.0 smoothly
  const ZONES = [
    { hold: [0, 0.12], exit: [0.12, 0.18], enter: null },
    { hold: [0.18, 0.30], exit: [0.30, 0.36], enter: [0.12, 0.18] },
    { hold: [0.36, 0.48], exit: [0.48, 0.54], enter: [0.30, 0.36] },
    { hold: [0.54, 0.66], exit: [0.66, 0.72], enter: [0.48, 0.54] },
    { hold: [0.72, 0.84], exit: [0.84, 0.90], enter: [0.66, 0.72] },
    { hold: [0.90, 1.00], exit: null, enter: [0.84, 0.90] }
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

    // Update all 6 stages with exact opposing translation
    for (let i = 0; i < 6; i++) {
      const sceneEl = scenes[i];
      const contentEl = contents[i];
      if (!sceneEl || !contentEl) continue;

      // Alternating columns:
      // Even index (0, 2, 4): Scene is Left, Content is Right
      // Odd index (1, 3, 5): Scene is Right, Content is Left
      const sceneCol = (i % 2 === 1) ? 'right' : 'left';
      const contentCol = (i % 2 === 1) ? 'left' : 'right';

      const sStyle = getStyle(globalProgress, i, sceneCol);
      const cStyle = getStyle(globalProgress, i, contentCol);

      sceneEl.style.transform = sStyle.transform;
      sceneEl.style.opacity = sStyle.opacity.toFixed(3);
      sceneEl.style.pointerEvents = sStyle.opacity > 0.08 ? 'auto' : 'none';

      contentEl.style.transform = cStyle.transform;
      contentEl.style.opacity = cStyle.opacity.toFixed(3);
      contentEl.style.pointerEvents = cStyle.opacity > 0.08 ? 'auto' : 'none';
    }

    // Determine active stage across 6 stages
    let activeStage = 0;
    if (globalProgress < 0.15) activeStage = 0;
    else if (globalProgress < 0.33) activeStage = 1;
    else if (globalProgress < 0.51) activeStage = 2;
    else if (globalProgress < 0.69) activeStage = 3;
    else if (globalProgress < 0.87) activeStage = 4;
    else activeStage = 5;

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

    // Update each fill bar
    for (let i = 0; i < 6; i++) {
      if (!fills[i]) continue;
      const zone = ZONES[i];
      let p = 0;
      if (globalProgress < (zone.enter ? zone.enter[0] : zone.hold[0])) {
        p = 0;
      } else if (globalProgress <= zone.hold[1]) {
        if (zone.enter && globalProgress <= zone.enter[1]) {
          p = (globalProgress - zone.enter[0]) / (zone.enter[1] - zone.enter[0]);
        } else {
          p = 1;
        }
      } else {
        p = 1;
      }
      fills[i].style.transform = `scaleX(${clamp(p, 0, 1).toFixed(3)})`;
    }
  }

  scrollContainer.addEventListener('scroll', updateScroll, { passive: true });
  window.__updateIOLScroll = updateScroll;
  setTimeout(updateScroll, 100);

  window.jumpIolStage = function (stageIdx) {
    const maxScroll = scrollContainer.scrollHeight - scrollContainer.clientHeight;
    let target = maxScroll * (stageIdx / 5);
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

print(f"Applied 6-stage controller to main.js! Length: {len(new_main_js)}")

