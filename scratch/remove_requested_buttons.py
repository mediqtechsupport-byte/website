import re

# 1. Update index.html
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# A. Remove products-deck-counter (02 / 05 pill)
old_counter = '<span id="products-deck-counter" class="text-xs font-mono font-bold text-sky tracking-wider px-3 py-1 rounded-full bg-sky/10 border border-sky/20 backdrop-blur-md">01 / 05</span>'
html = html.replace(old_counter, '')

# B. Remove STAGE 01 badge and Medical Supplies button in Slide 1
old_slide1_top_nav = """<!-- Top Slim Floating Navigation Bar -->
          <div class="absolute top-5 left-6 right-6 sm:top-7 sm:left-12 sm:right-12 z-40 flex items-center justify-between pointer-events-auto">
            <button type="button" onclick="if(window.goToProductSlide){window.goToProductSlide(0);}" class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-cream/90 hover:text-white transition-all cursor-pointer backdrop-blur-md">
              <svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m15 18-6-6 6-6"/></svg>
              <span>Product Overview</span>
            </button>

            <!-- Active Stage Highlight Badge (High-Visibility Glow) -->
            <div id="iol-stage-badge" class="px-5 py-2 rounded-full bg-[#0a1e45]/90 border border-sky/50 text-xs font-mono font-bold tracking-widest text-sky uppercase shadow-[0_0_25px_rgba(58,160,219,0.4)] backdrop-blur-md flex items-center gap-2.5">
              <span class="size-2 rounded-full bg-sky animate-ping"></span>
              <span id="iol-stage-badge-text">STAGE 01 &bull; RAYONE&reg; EMV</span>
            </div>

            <button type="button" onclick="if(window.goToProductSlide){window.goToProductSlide(2);}" class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky/20 hover:bg-sky text-sky hover:text-[#07132b] text-xs font-bold transition-all cursor-pointer backdrop-blur-md">
              <span>Medical Supplies</span>
              <svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>"""

new_slide1_top_nav = """<!-- Top Floating Navigation (Back to Overview Only) -->
          <div class="absolute top-5 left-6 sm:top-7 sm:left-12 z-40 pointer-events-auto">
            <button type="button" onclick="if(window.goToProductSlide){window.goToProductSlide(0);}" class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-cream/90 hover:text-white transition-all cursor-pointer backdrop-blur-md">
              <svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m15 18-6-6 6-6"/></svg>
              <span>Product Overview</span>
            </button>
          </div>"""

if old_slide1_top_nav in html:
    html = html.replace(old_slide1_top_nav, new_slide1_top_nav)
    print("Replaced Slide 1 top nav successfully!")
else:
    print("WARNING: old_slide1_top_nav did not match directly, trying regex or partial match")
    # Try finding between id="product-slide-iols" and id="iol-scroll-container"
    s1_pos = html.find('id="product-slide-iols"')
    sc_pos = html.find('id="iol-scroll-container"', s1_pos)
    chunk = html[s1_pos:sc_pos]
    # Remove the badge
    chunk_new = re.sub(r'<div id="iol-stage-badge"[\s\S]*?</div>[\s\S]*?</div>', '', chunk)
    # Also adjust wrapper to just top-left
    html = html[:s1_pos] + chunk_new + html[sc_pos:]

# Bump version to v=357.00
html = re.sub(r'src="assets/js/main\.js\?v=[\d\.]+"', 'src="assets/js/main.js?v=357.00"', html)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("Updated index.html!")

# 2. Update assets/js/main.js
with open('assets/js/main.js', 'r', encoding='utf-8') as f:
    js = f.read()

# In goToSlide, hide navCtrl on Slide 1
old_nav_ctrl = """    // Subtle fade of floating nav controls on Slide 0, highlight on Slides 1-4
    const navCtrl = document.getElementById('products-deck-nav');
    if (navCtrl) {
      if (currentIndex === 0) {
        navCtrl.classList.add('opacity-85');
        navCtrl.classList.remove('opacity-100');
      } else {
        navCtrl.classList.remove('opacity-85');
        navCtrl.classList.add('opacity-100');
      }
    }"""

new_nav_ctrl = """    // Hide floating deck nav controls completely on Slide 1 for a completely clean view
    const navCtrl = document.getElementById('products-deck-nav');
    if (navCtrl) {
      if (currentIndex === 1) {
        navCtrl.classList.add('hidden');
      } else {
        navCtrl.classList.remove('hidden');
      }
    }"""

if old_nav_ctrl in js:
    js = js.replace(old_nav_ctrl, new_nav_ctrl)
    print("Updated navCtrl visibility in main.js!")
else:
    print("WARNING: old_nav_ctrl not found in main.js")

with open('assets/js/main.js', 'w', encoding='utf-8') as f:
    f.write(js)

print("Updated assets/js/main.js!")

