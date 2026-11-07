with open('assets/js/main.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Marker for initAboutDeckController and initAboutStackingCards
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

    // When entering Slide 2 ("What We Do"), ensure all stacked cards are rendered in 3D deck view
    if (currentIndex === 2 && typeof window.__resetAboutStackingCards === 'function') {
      window.__resetAboutStackingCards();
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

  // Prevent wheel scroll from snapping outside when inside deck slides, and route Slide 2 wheel to cards
  let lastWheelTime = 0;
  window.addEventListener('wheel', (e) => {
    if (window.__aboutDeckCurrentIndex > 0) {
      if (aboutSec && aboutSec.contains(e.target)) {
        e.preventDefault();

        // If on Slide 2 ("What We Do"), wheel controls the stacking capability cards
        if (window.__aboutDeckCurrentIndex === 2 && typeof window.__stepAboutStackCard === 'function') {
          const now = Date.now();
          if (now - lastWheelTime > 240) {
            lastWheelTime = now;
            if (e.deltaY > 10) {
              window.__stepAboutStackCard(1); // Next card
            } else if (e.deltaY < -10) {
              window.__stepAboutStackCard(-1); // Prev card
            }
          }
        }
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

  // Attach tab click listeners
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

    // If on Slide 2, vertical or horizontal swipe advances stacking cards
    if (window.__aboutDeckCurrentIndex === 2 && typeof window.__stepAboutStackCard === 'function') {
      if (Math.abs(diffY) > 35) {
        if (diffY > 0) {
          window.__stepAboutStackCard(1);
        } else {
          window.__stepAboutStackCard(-1);
        }
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
/* ABOUT MEDIQ STACKING CAPABILITY CARDS CONTROLLER                          */
/* ========================================================================= */
function initAboutStackingCards() {
  const slide = document.getElementById('about-slide-what-we-do');
  if (!slide) return;

  const stage = document.getElementById('stacking-deck-stage');
  const cards = slide.querySelectorAll('.stacking-deck-card');
  const numPill = document.getElementById('stack-card-num');
  const labelPill = document.getElementById('stack-card-label');
  const prevBtn = document.getElementById('stack-card-prev');
  const nextBtn = document.getElementById('stack-card-next');
  const dots = slide.querySelectorAll('.stack-dot');

  if (!cards.length) return;

  let currentStackIndex = 0;
  const total = cards.length;

  function renderStack(targetIndex, animate = true) {
    // Clamp to [0, total - 1]
    const nextIndex = Math.max(0, Math.min(total - 1, targetIndex));
    currentStackIndex = nextIndex;

    cards.forEach((card, i) => {
      card.style.transition = animate 
        ? 'transform 0.48s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.48s cubic-bezier(0.16, 1, 0.3, 1), filter 0.48s ease'
        : 'none';

      if (i < currentStackIndex) {
        // Previously stacked card, sitting neatly at the top rim behind the active card
        const diff = currentStackIndex - i;
        const translateY = -(diff * 9); // -9px, -18px, -27px, -36px, -45px
        const scale = Math.max(0.88, 1 - diff * 0.024);
        const brightness = Math.max(0.60, 1 - diff * 0.08);

        card.style.transform = `translateY(${translateY}px) scale(${scale})`;
        card.style.filter = `brightness(${brightness.toFixed(2)})`;
        card.style.opacity = '1';
        card.style.zIndex = String(10 + i);
        card.style.pointerEvents = 'none';
      } else if (i === currentStackIndex) {
        // Active card front and center
        card.style.transform = 'translateY(0px) scale(1)';
        card.style.filter = 'brightness(1)';
        card.style.opacity = '1';
        card.style.zIndex = '50';
        card.style.pointerEvents = 'auto';
      } else {
        // Waiting cards in stack underneath
        const diff = i - currentStackIndex;
        const translateY = diff * 11; // +11px, +22px, +33px
        const scale = Math.max(0.88, 1 - diff * 0.026);
        const brightness = Math.max(0.55, 1 - diff * 0.12);
        const opacity = Math.max(0, 0.85 - diff * 0.22);

        card.style.transform = `translateY(${translateY}px) scale(${scale})`;
        card.style.filter = `brightness(${brightness.toFixed(2)})`;
        card.style.opacity = String(opacity.toFixed(2));
        card.style.zIndex = String(40 - diff);
        card.style.pointerEvents = 'none';
      }
    });

    // Update status pill
    if (numPill) {
      numPill.textContent = String(currentStackIndex + 1).padStart(2, '0');
    }
    if (labelPill) {
      labelPill.textContent = cards[currentStackIndex].getAttribute('data-pillar-name') || '';
    }

    // Update prev/next buttons
    if (prevBtn) prevBtn.disabled = (currentStackIndex === 0);
    if (nextBtn) nextBtn.disabled = (currentStackIndex === total - 1);

    // Update pagination dots
    dots.forEach((dot, idx) => {
      const isActive = (idx === currentStackIndex);
      if (isActive) {
        dot.className = 'stack-dot h-2 w-7 rounded-full bg-sky shadow-[0_0_12px_#3aa0db] transition-all cursor-pointer';
      } else {
        dot.className = 'stack-dot h-2 w-2 rounded-full bg-white/20 hover:bg-white/40 transition-all cursor-pointer';
      }
    });
  }

  // Step function for wheel / keyboard / swipe
  // When last card is reached (currentStackIndex === 5), it sits there not moving!
  function stepStack(delta) {
    const target = currentStackIndex + delta;
    if (target < 0) {
      renderStack(0, true);
    } else if (target >= total) {
      // Last card sits there stationary!
      renderStack(total - 1, true);
    } else {
      renderStack(target, true);
    }
  }

  // Prev / Next button listeners
  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      stepStack(-1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      stepStack(1);
    });
  }

  // Dots listeners
  dots.forEach((dot) => {
    dot.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const dotIdx = parseInt(dot.getAttribute('data-dot-index') || '0', 10);
      renderStack(dotIdx, true);
    });
  });

  // Expose global methods for deck controller
  window.__stepAboutStackCard = stepStack;
  window.__resetAboutStackingCards = () => renderStack(currentStackIndex, false);

  // Initial render with all cards visible in 3D stack
  renderStack(0, false);
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

print("Updated main.js successfully!")

