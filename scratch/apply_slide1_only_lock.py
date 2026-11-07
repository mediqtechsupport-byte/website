import re

# 1. Update assets/js/main.js
with open('assets/js/main.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Update goToSlide lock logic
old_lock_block = """    // STRICT LOCK: Lock outer page scrolling whenever viewing products deck slides
    if (currentIndex > 0) {
      lockPage();
    } else {
      const rect = prodSec.getBoundingClientRect();
      const inView = (rect.top <= window.innerHeight * 0.5 && rect.bottom >= window.innerHeight * 0.5);
      if (inView) {
        lockPage();
      } else {
        unlockPage();
      }
    }"""

new_lock_block = """    // ONLY lock the page when inside Slide 1 (Intraocular Lenses 3D Showcase)
    // On Slide 0 (Product Overview) and all other slides, page scrolling is 100% UNLOCKED
    if (currentIndex === 1) {
      lockPage();
    } else {
      unlockPage();
    }"""

if old_lock_block in js:
    js = js.replace(old_lock_block, new_lock_block)
else:
    print("WARNING: old_lock_block not matched directly in main.js")

# Update wheel listener to ONLY lock when currentIndex === 1
old_wheel_block = """  // PREVENT WHEEL SCROLL FROM SNAPPING TO OTHER PAGES WHEN INSIDE #PRODUCTS
  // And smoothly forward wheel scrolling strictly to the product content!
  window.addEventListener('wheel', (e) => {
    const inProducts = prodSec && (prodSec === e.target || prodSec.contains(e.target));
    if (!inProducts) return;

    // Check if section is currently active in viewport
    const rect = prodSec.getBoundingClientRect();
    const inView = (rect.top <= window.innerHeight * 0.75 && rect.bottom >= window.innerHeight * 0.25);
    if (!inView) return;

    // 100% PREVENT outer page scroll / snap to #about or other sections
    e.preventDefault();

    // If on Slide 1 (Intraocular Lenses 3D showcase), forward wheel to iol-scroll-container
    if (currentIndex === 1) {
      const scrollContainer = document.getElementById('iol-scroll-container');
      if (scrollContainer) {
        scrollContainer.scrollTop += e.deltaY;
      }
    } else {
      // For Slide 0, 2, 3, 4: forward to the active slide's inner scroll container
      const activeSlide = slides[currentIndex];
      if (activeSlide) {
        activeSlide.scrollTop += e.deltaY;
      }
    }
  }, { passive: false });"""

new_wheel_block = """  // PREVENT WHEEL SCROLL FROM SNAPPING TO OTHER PAGES ONLY WHEN INSIDE SLIDE 1 (IOLS)
  // On Slide 0 (Overview) and all other sections, scrolling is 100% natural and unlocked
  window.addEventListener('wheel', (e) => {
    // If NOT on Slide 1 (Intraocular Lenses), allow completely normal page scrolling!
    if (currentIndex !== 1) return;

    const iolSlide = document.getElementById('product-slide-iols');
    if (!iolSlide) return;

    const inIol = iolSlide === e.target || iolSlide.contains(e.target);
    if (!inIol) return;

    const rect = prodSec.getBoundingClientRect();
    const inView = (rect.top <= window.innerHeight * 0.75 && rect.bottom >= window.innerHeight * 0.25);
    if (!inView) return;

    // Prevent outer window from scrolling away while viewing the 6 IOL 3D models
    e.preventDefault();

    const scrollContainer = document.getElementById('iol-scroll-container');
    if (scrollContainer) {
      scrollContainer.scrollTop += e.deltaY;
    }
  }, { passive: false });"""

if old_wheel_block in js:
    js = js.replace(old_wheel_block, new_wheel_block)
else:
    print("WARNING: old_wheel_block not matched directly in main.js")

# In nav click handlers, make sure we only lock if targetSlide === 1
old_nav_lock = "setTimeout(lockPage, 600);"
new_nav_lock = "if (targetSlide === 1) setTimeout(lockPage, 600); else unlockPage();"
js = js.replace(old_nav_lock, new_nav_lock)

with open('assets/js/main.js', 'w', encoding='utf-8') as f:
    f.write(js)

print("Updated main.js so lock ONLY applies to Slide 1 (Intraocular Lenses)!")

# 2. Update index.html: remove overscroll containment from #products, keep only on #iol-scroll-container
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

old_contain_css = """#products,
    #products .product-slide,
    #iol-scroll-container {
      overscroll-behavior: contain !important;
      overscroll-behavior-y: contain !important;
    }"""

new_contain_css = """#iol-scroll-container {
      overscroll-behavior: contain !important;
      overscroll-behavior-y: contain !important;
    }"""

if old_contain_css in html:
    html = html.replace(old_contain_css, new_contain_css)

# Bump script version to v=356.00
html = re.sub(r'src="assets/js/main\.js\?v=[\d\.]+"', 'src="assets/js/main.js?v=356.00"', html)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("Updated index.html CSS and bumped version to v=356.00!")

