import re

with open('index.html', 'r', encoding='utf-8') as f:
    h = f.read()

# Target the top navigation bar of Slide 1
old_nav_group = '''            <div class="pointer-events-auto flex items-center gap-2">
              <button type="button" onclick="if(window.goToProductSlide){window.goToProductSlide(2);}" class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-cream/90 hover:text-white transition-all cursor-pointer backdrop-blur-md group">
                <span>Medical Supplies</span>
                <svg class="size-3.5 group-hover:translate-x-0.5 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m9 18 6-6-6-6"/></svg>
              </button>
              <button type="button" onclick="if(window.goToProductSlide){window.goToProductSlide(3);}" class="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-cream/90 hover:text-white transition-all cursor-pointer backdrop-blur-md group">
                <span>Devices &amp; Equipment</span>
                <svg class="size-3.5 group-hover:translate-x-0.5 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m9 18 6-6-6-6"/></svg>
              </button>
              <button type="button" onclick="if(window.goToProductSlide){window.goToProductSlide(4);}" class="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-cream/90 hover:text-white transition-all cursor-pointer backdrop-blur-md group">
                <span>Product Catalogs</span>
                <svg class="size-3.5 group-hover:translate-x-0.5 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m9 18 6-6-6-6"/></svg>
              </button>
            </div>'''

new_nav_group = '''            <div class="pointer-events-auto flex items-center gap-2">
              <button type="button" onclick="if(window.goToProductSlide){window.goToProductSlide(2);}" class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-cream/90 hover:text-white transition-all cursor-pointer backdrop-blur-md group">
                <span>Medical Supplies</span>
                <svg class="size-3.5 group-hover:translate-x-0.5 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m9 18 6-6-6-6"/></svg>
              </button>
              <button type="button" onclick="if(window.goToProductSlide){window.goToProductSlide(3);}" class="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-cream/90 hover:text-white transition-all cursor-pointer backdrop-blur-md group">
                <span>Devices &amp; Equipment</span>
                <svg class="size-3.5 group-hover:translate-x-0.5 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m9 18 6-6-6-6"/></svg>
              </button>
              <button type="button" onclick="if(window.goToProductSlide){window.goToProductSlide(4);}" class="hidden md:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-cream/90 hover:text-white transition-all cursor-pointer backdrop-blur-md group">
                <span>Product Catalogs</span>
                <svg class="size-3.5 group-hover:translate-x-0.5 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m9 18 6-6-6-6"/></svg>
              </button>
              <button type="button" onclick="if(window.navigateToSection){window.navigateToSection('#distribution');}" class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-sky/15 hover:bg-sky text-sky hover:text-[#0a1d40] border border-sky/30 text-xs font-bold transition-all cursor-pointer backdrop-blur-md group">
                <span>Brands &amp; Partners</span>
                <svg class="size-3.5 group-hover:translate-x-0.5 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m9 18 6-6-6-6"/></svg>
              </button>
            </div>'''

h_norm = h.replace('\r\n', '\n')
old_nav_norm = old_nav_group.replace('\r\n', '\n')
new_nav_norm = new_nav_group.replace('\r\n', '\n')

if old_nav_norm in h_norm:
    h_norm = h_norm.replace(old_nav_norm, new_nav_norm)
    print("Replaced Slide 1 navigation group!")
else:
    print("WARNING: exact match not found, checking regex")

# Bump script tag version
h_norm = re.sub(r'src="assets/js/main\.js\?v=[\d\.]+"', 'src="assets/js/main.js?v=367.00"', h_norm)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(h_norm)
print("Updated index.html successfully!")

