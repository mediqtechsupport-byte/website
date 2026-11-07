with open('assets/js/main.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Update navbar link bindings for the 3-card layout
old_link_code = '''  // Link navbar dropdown items & nav-about
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
  }'''

new_link_code = '''  // Link navbar dropdown items & nav-about to the 3-card About section & overlays
  document.querySelectorAll('[data-open-pel], [data-pillar-idx], [data-slide-target]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const aboutSec = document.getElementById('about');
      if (aboutSec) {
        aboutSec.scrollIntoView({ behavior: 'smooth' });
      }
      const target = link.getAttribute('data-slide-target');
      const idx = link.getAttribute('data-pillar-idx') || link.getAttribute('data-open-pel');
      if (target === '2' || idx === '2' || target === 'what-we-do') {
        setTimeout(() => openAboutOverlay('what-we-do'), 350);
      } else if (target === '3' || idx === '3' || target === 'foundation') {
        setTimeout(() => openAboutOverlay('foundation'), 350);
      } else if (target === '4' || idx === '4' || target === 'values') {
        setTimeout(() => openAboutOverlay('values'), 350);
      }
    });
  });

  const navAbout = document.getElementById('nav-about');
  if (navAbout) {
    navAbout.addEventListener('click', () => {
      const aboutSec = document.getElementById('about');
      if (aboutSec) aboutSec.scrollIntoView({ behavior: 'smooth' });
    });
  }'''

if old_link_code in text:
    text = text.replace(old_link_code, new_link_code)
    with open('assets/js/main.js', 'w', encoding='utf-8') as f:
        f.write(text)
    print("Updated navbar bindings in main.js successfully!")
else:
    print("Could not find exact old_link_code, checking fallback...")
    # fallback find
    marker = "// Link navbar dropdown items & nav-about"
    m_idx = text.find(marker)
    if m_idx != -1:
        end_m = text.find("// Touch swipe support inside the deck", m_idx)
        if end_m != -1:
            text = text[:m_idx] + new_link_code + '\n\n  ' + text[end_m:]
            with open('assets/js/main.js', 'w', encoding='utf-8') as f:
                f.write(text)
            print("Updated navbar bindings via fallback replacement successfully!")

