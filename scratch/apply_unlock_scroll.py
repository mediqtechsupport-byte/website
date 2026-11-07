import re

with open('assets/js/main.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Replace lockPage and unlockPage in initProductsDeckController
old_controller = """  function lockPage() {
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    document.documentElement.style.scrollSnapType = 'none';
  }

  function unlockPage() {
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    document.documentElement.style.scrollSnapType = '';
  }"""

new_controller = """  // Smooth, non-blocking scroll architecture: keep page overflow natural so users can freely scroll to Brands & Partners
  function lockPage() {
    // Keep page scrolling active and natural
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
  }

  function unlockPage() {
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
  }"""

if old_controller in js:
    js = js.replace(old_controller, new_controller)
    print("Replaced lockPage & unlockPage with non-blocking logic!")
else:
    print("WARNING: old_controller not found directly, checking regex")
    js = re.sub(
        r'function lockPage\(\)\s*\{[\s\S]*?function unlockPage\(\)\s*\{[\s\S]*?\}',
        new_controller.strip(),
        js
    )

# Replace the wheel and touch event listeners in main.js
old_wheel_block = """  // ULTRA-RESPONSIVE SCROLL CONTROLLER FOR SLIDE 1 (IOLS)
  // Intercepts wheel anywhere in the window when Slide 1 is active with fluid 1.6x multiplier
  window.addEventListener('wheel', (e) => {
    // If NOT on Slide 1 (Intraocular Lenses), allow completely normal page scrolling!
    if (currentIndex !== 1) return;

    const scrollContainer = document.getElementById('iol-scroll-container');
    if (!scrollContainer) return;

    // Prevent outer window from scrolling away while viewing the 6 IOL 3D models
    e.preventDefault();

    // Multiply deltaY by 1.6 for responsive, effortless gliding anywhere on the page
    scrollContainer.scrollTop += e.deltaY * 1.6;
  }, { passive: false });

  // TOUCH SCREEN DRAG CONTROLLER FOR SLIDE 1 (Works on Touchscreens, iPads, Tablets & Mobile without buttons)
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
        if (e.cancelable) e.preventDefault();
        // Responsive 2.0x gesture sensitivity for natural finger swipe
        scrollContainer.scrollTop = touchStartScrollTop + diffY * 2.0;
      }
    }
  }, { passive: false });

  window.addEventListener('touchend', () => {
    isTouchingIol = false;
  }, { passive: true });"""

new_wheel_block = """  // FLUID, NON-BLOCKING SCROLL CONTROLLER FOR SLIDE 1 (IOLS)
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
  }, { passive: true });

  // Global helper for direct button navigation to any section
  window.navigateToSection = function(selector) {
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    const target = document.querySelector(selector);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };"""

js_norm = js.replace('\r\n', '\n')
old_wheel_norm = old_wheel_block.replace('\r\n', '\n')
new_wheel_norm = new_wheel_block.replace('\r\n', '\n')

if old_wheel_norm in js_norm:
    js_norm = js_norm.replace(old_wheel_norm, new_wheel_norm)
    print("Replaced wheel and touch block successfully!")
else:
    print("WARNING: old_wheel_block not found directly, replacing via regex")
    js_norm = re.sub(
        r'// ULTRA-RESPONSIVE SCROLL CONTROLLER FOR SLIDE 1[\s\S]*?window\.addEventListener\(\'touchend\'[\s\S]*?\};',
        new_wheel_norm.strip(),
        js_norm
    )

with open('assets/js/main.js', 'w', encoding='utf-8') as f:
    f.write(js_norm)
print("Updated assets/js/main.js successfully!")

