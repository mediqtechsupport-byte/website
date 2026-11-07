with open('assets/js/main.js', 'r', encoding='utf-8') as f:
    content = f.read()

target_marker = '/* PRODUCTS SECTION 3-CARD OVERLAYS CONTROLLER'
idx = content.find(target_marker)
divider_idx = content.rfind('/* ===', 0, idx)
if divider_idx != -1:
    idx = divider_idx

new_prod_controller = '''/* ========================================================================= */
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
  document.addEventListener('DOMContentLoaded', initProductsDeckController);
} else {
  initProductsDeckController();
}
'''

new_content = content[:idx] + new_prod_controller

with open('assets/js/main.js', 'w', encoding='utf-8') as f:
    f.write(new_content)

print(f"Updated main.js with initProductsDeckController! New length: {len(new_content)}")

