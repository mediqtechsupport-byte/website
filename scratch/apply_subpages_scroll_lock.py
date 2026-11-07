import re

with open('assets/js/main.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Replace lockPage and unlockPage
old_locks = """  // Smooth, non-blocking scroll architecture: keep page overflow natural so users can freely scroll to Brands & Partners
  function lockPage() {
    // Keep page scrolling active and natural
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
  }

  function unlockPage() {
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
  }"""

new_locks = """  // STRICT SUBPAGE ISOLATION LOCK: Completely locks outer main page scroll when inside ANY subpage
  function lockPage() {
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    document.documentElement.style.scrollSnapType = 'none';
  }

  function unlockPage() {
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    document.documentElement.style.scrollSnapType = '';
  }"""

js_clean = js.replace('\r\n', '\n')
old_locks_clean = old_locks.replace('\r\n', '\n')

if old_locks_clean in js_clean:
    js_clean = js_clean.replace(old_locks_clean, new_locks)
    print("Replaced lockPage & unlockPage with strict lock!")
else:
    print("WARNING: old_locks not found directly, replacing via regex")
    js_clean = re.sub(
        r'// Smooth, non-blocking scroll architecture[\s\S]*?function unlockPage\(\)\s*\{[\s\S]*?\}',
        new_locks,
        js_clean
    )

# Replace lockPage trigger in goToSlide
old_slide_trigger = """    // ONLY lock the page when inside Slide 1 (Intraocular Lenses 3D Showcase)
    // On Slide 0 (Product Overview) and all other slides, page scrolling is 100% UNLOCKED
    if (currentIndex === 1) {
      lockPage();
      if (typeof window.__resizeProductsSmoke === 'function') {
        window.__resizeProductsSmoke();
      }
      const wavesCanvas = document.getElementById('products-waves-shader-canvas');
      if (wavesCanvas && typeof wavesCanvas._resizeWaves === 'function') {
        wavesCanvas._resizeWaves();
      }
      if (typeof window.__updateIOLScroll === 'function') {
        setTimeout(window.__updateIOLScroll, 50);
      }
    } else {
      unlockPage();
    }"""

new_slide_trigger = """    // LOCK main page scrolling on ALL subpages (Slide 1: IOLs, Slide 2: Medical Supplies, Slide 3: Devices, Slide 4: Catalogs)
    // Only Slide 0 (Product Overview) allows main page scrolling!
    if (currentIndex >= 1) {
      lockPage();
      if (typeof window.__resizeProductsSmoke === 'function') {
        window.__resizeProductsSmoke();
      }
      const wavesCanvas = document.getElementById('products-waves-shader-canvas');
      if (wavesCanvas && typeof wavesCanvas._resizeWaves === 'function') {
        wavesCanvas._resizeWaves();
      }
      if (currentIndex === 1 && typeof window.__updateIOLScroll === 'function') {
        setTimeout(window.__updateIOLScroll, 50);
      }
    } else {
      unlockPage();
    }"""

old_slide_trigger_clean = old_slide_trigger.replace('\r\n', '\n')
if old_slide_trigger_clean in js_clean:
    js_clean = js_clean.replace(old_slide_trigger_clean, new_slide_trigger)
    print("Replaced goToSlide lock trigger for all subpages!")
else:
    print("WARNING: old_slide_trigger not found directly, replacing via regex")
    js_clean = re.sub(
        r'// ONLY lock the page when inside Slide 1[\s\S]*?unlockPage\(\);\s*\}',
        new_slide_trigger,
        js_clean
    )

# Replace wheel and touch controllers to prevent main page scroll on ALL subpages
old_wheel_touch = """  // FLUID, NON-BLOCKING SCROLL CONTROLLER FOR SLIDE 1 (IOLS)
  // Allows natural scrubbing between products, and smoothly navigates to Brands & Partners / Galaxy Delivery at the end
  let isNavigatingNext = false;

  window.addEventListener('wheel', (e) => {
    // If NOT on Slide 1 (Intraocular Lenses), allow 100% normal page scrolling!
    if (currentIndex !== 1) return;

    const scrollContainer = document.getElementById('iol-scroll-container');
    if (!scrollContainer) return;

    const maxScroll = scrollContainer.scrollHeight - scrollContainer.clientHeight;
    const isAtBottom = scrollContainer.scrollTop >= (maxScroll - 20);
    const isAtTop = scrollContainer.scrollTop <= 20;

    // When scrolling DOWN at the end of the 6 stages, smoothly navigate to the next page (Brands & Partners / Galaxy Delivery)
    if (e.deltaY > 0 && isAtBottom) {
      if (!isNavigatingNext) {
        isNavigatingNext = true;
        const nextSec = document.getElementById('galaxy-delivery') || document.getElementById('distribution') || document.getElementById('activities');
        if (nextSec) {
          nextSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        setTimeout(() => { isNavigatingNext = false; }, 900);
      }
      return; // Do NOT preventDefault, let window navigate smoothly!
    }

    // When scrolling UP at the top, return to Product Overview slide
    if (e.deltaY < 0 && isAtTop) {
      if (!isNavigatingNext) {
        isNavigatingNext = true;
        goToSlide(0);
        setTimeout(() => { isNavigatingNext = false; }, 600);
      }
      return; // Do NOT preventDefault!
    }

    // While actively scrubbing between stages 1 to 6 inside the container:
    if (e.cancelable) e.preventDefault();
    scrollContainer.scrollTop += e.deltaY * 1.5;
  }, { passive: false });

  // TOUCH SCREEN DRAG CONTROLLER (Works on touchscreens, iPads, Tablets & Mobile)
  let touchStartY = 0;
  let touchStartScrollTop = 0;
  let isTouchingIol = false;

  window.addEventListener('touchstart', (e) => {
    if (currentIndex !== 1) return;
    if (e.touches && e.touches.length === 1) {
      const scrollContainer = document.getElementById('iol-scroll-container');
      if (scrollContainer) {
        touchStartY = e.touches[0].clientY;
        touchStartScrollTop = scrollContainer.scrollTop;
        isTouchingIol = true;
      }
    }
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (currentIndex !== 1 || !isTouchingIol) return;
    if (e.touches && e.touches.length === 1) {
      const scrollContainer = document.getElementById('iol-scroll-container');
      if (scrollContainer) {
        const currentY = e.touches[0].clientY;
        const diffY = touchStartY - currentY;
        const maxScroll = scrollContainer.scrollHeight - scrollContainer.clientHeight;
        const isAtBottom = scrollContainer.scrollTop >= (maxScroll - 25);
        const isAtTop = scrollContainer.scrollTop <= 25;

        // Release at edges so touch drag smoothly navigates to next/previous section
        if (diffY > 0 && isAtBottom) {
          isTouchingIol = false;
          const nextSec = document.getElementById('galaxy-delivery') || document.getElementById('distribution');
          if (nextSec) nextSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
          return;
        }

        if (diffY < 0 && isAtTop) {
          isTouchingIol = false;
          goToSlide(0);
          return;
        }

        if (e.cancelable) e.preventDefault();
        scrollContainer.scrollTop = touchStartScrollTop + diffY * 1.8;
      }
    }
  }, { passive: false });

  window.addEventListener('touchend', () => {
    isTouchingIol = false;
  }, { passive: true });"""

new_wheel_touch = """  // SUBPAGES SCROLL LOCK CONTROLLER:
  // When inside Intraocular Lenses, Medical Supplies, Devices, or Catalogs, main page scrolling is 100% LOCKED!
  window.addEventListener('wheel', (e) => {
    // On Slide 0 (Product Overview), allow normal main page scrolling!
    if (currentIndex === 0) return;

    // On ANY subpage (Slide 1, 2, 3, 4): PREVENT main page from scrolling!
    e.preventDefault();

    if (currentIndex === 1) {
      // Intraocular Lenses: scrub the 6 3D packshot stages smoothly
      const scrollContainer = document.getElementById('iol-scroll-container');
      if (scrollContainer) {
        scrollContainer.scrollTop += e.deltaY * 1.5;
      }
    } else {
      // Medical Supplies, Devices & Equipment, Product Catalogs:
      // Scroll the inner subpage container smoothly without moving the main page
      const activeSlide = slides[currentIndex];
      if (activeSlide) {
        activeSlide.scrollTop += e.deltaY * 1.3;
      }
    }
  }, { passive: false });

  // TOUCH GESTURE CONTROLLER FOR SUBPAGES
  let touchStartY = 0;
  let touchStartScrollTop = 0;
  let isTouchingSubpage = false;

  window.addEventListener('touchstart', (e) => {
    if (currentIndex === 0) return;
    if (e.touches && e.touches.length === 1) {
      touchStartY = e.touches[0].clientY;
      isTouchingSubpage = true;
      if (currentIndex === 1) {
        const sc = document.getElementById('iol-scroll-container');
        touchStartScrollTop = sc ? sc.scrollTop : 0;
      } else {
        const activeSlide = slides[currentIndex];
        touchStartScrollTop = activeSlide ? activeSlide.scrollTop : 0;
      }
    }
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (currentIndex === 0 || !isTouchingSubpage) return;
    if (e.touches && e.touches.length === 1) {
      // Prevent outer main page from scrolling away while viewing subpages
      if (e.cancelable) e.preventDefault();

      const currentY = e.touches[0].clientY;
      const diffY = touchStartY - currentY;

      if (currentIndex === 1) {
        const sc = document.getElementById('iol-scroll-container');
        if (sc) sc.scrollTop = touchStartScrollTop + diffY * 1.8;
      } else {
        const activeSlide = slides[currentIndex];
        if (activeSlide) activeSlide.scrollTop = touchStartScrollTop + diffY * 1.5;
      }
    }
  }, { passive: false });

  window.addEventListener('touchend', () => {
    isTouchingSubpage = false;
  }, { passive: true });"""

old_wheel_touch_clean = old_wheel_touch.replace('\r\n', '\n')
if old_wheel_touch_clean in js_clean:
    js_clean = js_clean.replace(old_wheel_touch_clean, new_wheel_touch)
    print("Replaced wheel and touch controller for all subpages!")
else:
    print("WARNING: old_wheel_touch not found directly, replacing via regex")
    js_clean = re.sub(
        r'// FLUID, NON-BLOCKING SCROLL CONTROLLER[\s\S]*?window\.addEventListener\(\'touchend\'[\s\S]*?\};',
        new_wheel_touch,
        js_clean
    )

with open('assets/js/main.js', 'w', encoding='utf-8') as f:
    f.write(js_clean)
print("Updated assets/js/main.js successfully!")

