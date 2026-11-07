with open('assets/js/main.js', 'r', encoding='utf-8') as f:
    content = f.read()

start_marker = '/* ========================================================================= */\n/* ABOUT MEDIQ PAGE-BY-PAGE DECK CONTROLLER'
if start_marker not in content:
    start_marker = '/* ABOUT MEDIQ PAGE-BY-PAGE DECK CONTROLLER'

start_idx = content.find(start_marker)
if start_idx == -1:
    print("Could not find start marker in main.js")
    import sys
    sys.exit(1)

new_deck_and_stacking = '''/* ========================================================================= */
/* ABOUT MEDIQ PAGE-BY-PAGE DECK CONTROLLER (Zero Long Scroll)               */
/* ========================================================================= */
function initAboutDeckController() {
  const aboutSec = document.getElementById('about');
  const slides = document.querySelectorAll('.about-slide');
  const tabs = document.querySelectorAll('.about-deck-tab');
  const prevBtn = document.getElementById('about-deck-prev');
  const nextBtn = document.getElementById('about-deck-next');
  const counter = document.getElementById('about-deck-counter');
  const progressBar = document.getElementById('about-deck-progress');
  const goNextBtns = document.querySelectorAll('.about-go-next');

  if (!slides.length) return;

  let currentIndex = 0;
  const total = slides.length;

  function goToSlide(idx) {
    if (idx < 0) idx = 0;
    if (idx >= total) idx = total - 1;
    currentIndex = idx;
    window.__aboutDeckCurrentIndex = idx;

    // Update slides classes
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

    // Update tabs
    tabs.forEach((tab, i) => {
      const isActive = i === currentIndex;
      tab.classList.toggle('is-active', isActive);
      tab.classList.toggle('text-white', isActive);
      tab.classList.toggle('bg-sky/20', isActive);
      tab.classList.toggle('border-sky/40', isActive);
      tab.classList.toggle('text-cream/70', !isActive);
      tab.classList.toggle('hover:text-white', !isActive);
      tab.classList.toggle('hover:bg-white/5', !isActive);
      tab.classList.toggle('border-transparent', !isActive);
    });

    // Counter
    if (counter) {
      counter.textContent = String(currentIndex + 1).padStart(2, '0') + ' / ' + String(total).padStart(2, '0');
    }

    // Progress bar
    if (progressBar) {
      progressBar.style.width = (((currentIndex + 1) / total) * 100) + '%';
    }

    // Buttons disabled state
    if (prevBtn) prevBtn.disabled = (currentIndex === 0);
    if (nextBtn) nextBtn.disabled = (currentIndex === total - 1);

    // Hide arrows on Slide 0 (Purpose), show on rest of pages (Slides 1-4)
    const navCtrl = document.getElementById('about-deck-nav');
    if (navCtrl) {
      if (currentIndex === 0) {
        navCtrl.classList.add('opacity-0', 'pointer-events-none', 'scale-90');
        navCtrl.classList.remove('opacity-100', 'pointer-events-auto', 'scale-100');
      } else {
        navCtrl.classList.remove('opacity-0', 'pointer-events-none', 'scale-90');
        navCtrl.classList.add('opacity-100', 'pointer-events-auto', 'scale-100');
      }
    }

    // If entering Slide 2 ("What We Do"), ensure scroll container is ready at top
    if (currentIndex === 2) {
      const scrollViewport = document.getElementById('about-stacking-scroll-viewport');
      if (scrollViewport) {
        scrollViewport.scrollTop = 0;
        if (typeof window.__updateStackingCardPhysics === 'function') {
          window.__updateStackingCardPhysics();
        }
      }
    }

    // Lock page scrolling when exploring slides 1-4 to avoid overlapsing with #hero or #products
    updateAboutScrollLock(currentIndex);
  }

  function updateAboutScrollLock(idx) {
    if (idx > 0) {
      if (aboutSec) {
        aboutSec.scrollIntoView({ behavior: 'smooth' });
      }
      setTimeout(() => {
        if (window.__aboutDeckCurrentIndex > 0) {
          document.documentElement.style.overflow = 'hidden';
          document.body.style.overflow = 'hidden';
          document.documentElement.style.scrollSnapType = 'none';
        }
      }, 350);
    } else {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.documentElement.style.scrollSnapType = '';
    }
  }

  // Prevent wheel scroll from snapping to #hero or #products when inside deck slides,
  // but ALLOW seamless inner scroll inside the stacking capabilities viewport
  window.addEventListener('wheel', (e) => {
    if (window.__aboutDeckCurrentIndex > 0) {
      const scrollViewport = document.getElementById('about-stacking-scroll-viewport');
      if (scrollViewport && (scrollViewport === e.target || scrollViewport.contains(e.target))) {
        return; // Allow native inner scroll to animate cards stacking smoothly!
      }
      if (aboutSec && aboutSec.contains(e.target)) {
        e.preventDefault();
      }
    }
  }, { passive: false });

  // Unlock page scrolling when user clicks any navbar anchor to another section
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', () => {
      const href = a.getAttribute('href');
      if (href && href !== '#about') {
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
        document.documentElement.style.scrollSnapType = '';
      }
    });
  });

  // Attach tab listeners
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const idx = parseInt(tab.getAttribute('data-slide') || '0', 10);
      goToSlide(idx);
    });
  });

  if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
  goNextBtns.forEach((btn) => btn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); goToSlide(1); }));

  // Link navbar dropdown items & nav-about
  document.querySelectorAll('[data-open-pel], [data-pillar-idx], [data-slide-target]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const target = link.getAttribute('data-slide-target');
      let targetSlide = 0;
      if (target !== null && target !== undefined) {
        targetSlide = parseInt(target, 10);
      } else {
        const idx = parseInt(link.getAttribute('data-pillar-idx') || link.getAttribute('data-open-pel') || '0', 10);
        targetSlide = (idx === 0 || idx === 1) ? 1 : (idx === 2 ? 2 : 3);
      }
      goToSlide(targetSlide);
      if (aboutSec) {
        aboutSec.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  const navAbout = document.getElementById('nav-about');
  if (navAbout) {
    navAbout.addEventListener('click', () => {
      goToSlide(0);
      if (aboutSec) aboutSec.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Touch swipe support inside the deck
  let touchStartX = 0;
  let touchStartY = 0;
  aboutSec.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  }, { passive: true });

  aboutSec.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].screenX;
    const touchEndY = e.changedTouches[0].screenY;
    const diffX = touchStartX - touchEndX;
    const diffY = touchStartY - touchEndY;

    // If swiping inside the stacking viewport vertically, allow it to scroll cards
    const scrollViewport = document.getElementById('about-stacking-scroll-viewport');
    if (scrollViewport && (scrollViewport === e.target || scrollViewport.contains(e.target))) {
      if (Math.abs(diffY) > Math.abs(diffX)) {
        return;
      }
    }

    if (Math.abs(diffX) > 50) {
      if (diffX > 0) {
        goToSlide(currentIndex + 1);
      } else {
        goToSlide(currentIndex - 1);
      }
    }
  }, { passive: true });

  window.goToAboutSlide = goToSlide;

  // Initialize first slide
  goToSlide(0);
}

/* ========================================================================= */
/* ABOUT MEDIQ SCROLL-DRIVEN STACKING CAPABILITY CARDS WITH SCALE PHYSICS     */
/* ========================================================================= */
function initAboutStackingCards() {
  const slide = document.getElementById('about-slide-what-we-do');
  if (!slide) return;
  const scrollContainer = document.getElementById('about-stacking-scroll-viewport') || slide;
  const cardItems = scrollContainer.querySelectorAll('.stacking-card-item');
  if (!cardItems.length) return;

  function updateCardScales() {
    const containerRect = scrollContainer.getBoundingClientRect();
    const totalCards = cardItems.length;

    cardItems.forEach((item, index) => {
      const inner = item.querySelector('.stacking-card-inner');
      if (!inner) return;

      // Calculate covered progress by observing subsequent cards scrolling over this card
      let coveredProgress = 0;
      for (let nextIdx = index + 1; nextIdx < totalCards; nextIdx++) {
        const nextItem = cardItems[nextIdx];
        const nextRect = nextItem.getBoundingClientRect();
        const nextTop = nextRect.top - containerRect.top;
        const targetNextTop = 10 + nextIdx * 12;

        const dist = nextTop - targetNextTop;
        if (dist < 260) {
          const factor = Math.max(0, Math.min(1, (260 - dist) / 260));
          coveredProgress = Math.max(coveredProgress, factor * (nextIdx - index));
        }
      }

      // Smooth scale and brightness dimming as cards stack underneath
      const targetScale = Math.max(0.88, 1 - coveredProgress * 0.026);
      const targetBrightness = Math.max(0.65, 1 - coveredProgress * 0.09);

      inner.style.transform = "scale(" + targetScale.toFixed(3) + ")";
      inner.style.filter = "brightness(" + targetBrightness.toFixed(2) + ")";
    });
  }

  window.__updateStackingCardPhysics = updateCardScales;

  scrollContainer.addEventListener('scroll', updateCardScales, { passive: true });
  window.addEventListener('resize', updateCardScales, { passive: true });
  setTimeout(updateCardScales, 200);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initAboutDeckController();
    initAboutStackingCards();
  });
} else {
  initAboutDeckController();
  initAboutStackingCards();
}
'''

updated_content = content[:start_idx] + new_deck_and_stacking

with open('assets/js/main.js', 'w', encoding='utf-8') as f:
    f.write(updated_content)

print("Updated main.js with scroll-stacking physics successfully!")

