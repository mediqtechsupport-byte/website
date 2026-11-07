with open("assets/js/main.js", "r", encoding="utf-8") as f:
    text = f.read()

target = '''    // Hide arrows on Slide 0 (Purpose), show on rest of pages (Slides 1-4)
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
  }'''

replacement = '''    // Hide arrows on Slide 0 (Purpose), show on rest of pages (Slides 1-4)
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

  // Prevent wheel scroll from snapping to #hero or #products when inside deck slides
  window.addEventListener('wheel', (e) => {
    if (window.__aboutDeckCurrentIndex > 0) {
      const scrollViewport = document.getElementById('about-stacking-scroll-viewport');
      if (scrollViewport && (scrollViewport === e.target || scrollViewport.contains(e.target))) {
        return; // Allow inner scroll inside stacking cards
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
  });'''

if target in text:
    text = text.replace(target, replacement)
    with open("assets/js/main.js", "w", encoding="utf-8") as f:
        f.write(text)
    print("Updated main.js with scroll lock successfully.")
else:
    print("Error: target string not found in main.js")

