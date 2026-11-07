with open('assets/js/main.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Replace slide 2 entry handling
old_s2 = '''    // If entering Slide 2 ("What We Do"), ensure scroll container is ready at top
    if (currentIndex === 2) {
      const scrollViewport = document.getElementById('about-stacking-scroll-viewport');
      if (scrollViewport) {
        scrollViewport.scrollTop = 0;
        if (typeof window.__updateStackingCardPhysics === 'function') {
          window.__updateStackingCardPhysics();
        }
      }
    }'''

new_s2 = '''    // If entering Slide 2 ("What We Do"), ensure bento scroll container is ready at top
    if (currentIndex === 2) {
      const bentoSlide = document.getElementById('about-slide-what-we-do');
      if (bentoSlide) {
        bentoSlide.scrollTop = 0;
      }
    }'''

assert old_s2 in js, "old_s2 not found in main.js"
js = js.replace(old_s2, new_s2)

# Replace wheel listener
old_wheel = '''  // Prevent wheel scroll from snapping to #hero or #products when inside deck slides,
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
  }, { passive: false });'''

new_wheel = '''  // Prevent wheel scroll from snapping to #hero or #products when inside deck slides,
  // but ALLOW seamless inner scroll inside the Bento capabilities viewport
  window.addEventListener('wheel', (e) => {
    if (window.__aboutDeckCurrentIndex > 0) {
      const bentoSlide = document.getElementById('about-slide-what-we-do');
      if (bentoSlide && (bentoSlide === e.target || bentoSlide.contains(e.target))) {
        return; // Allow native inner scroll through the Bento grid smoothly!
      }
      if (aboutSec && aboutSec.contains(e.target)) {
        e.preventDefault();
      }
    }
  }, { passive: false });

  // Bento card interactive cursor spotlight glow
  document.addEventListener('mousemove', (e) => {
    const card = e.target.closest('.bento-pillar-card');
    if (card) {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--bx', `${e.clientX - rect.left}px`);
      card.style.setProperty('--by', `${e.clientY - rect.top}px`);
    }
  });'''

assert old_wheel in js, "old_wheel not found in main.js"
js = js.replace(old_wheel, new_wheel)

with open('assets/js/main.js', 'w', encoding='utf-8') as f:
    f.write(js)

print("SUCCESS: Updated assets/js/main.js for Bento grid scrolling and spotlight interaction!")

