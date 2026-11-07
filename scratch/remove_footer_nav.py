with open('index.html', 'r', encoding='utf-8') as f:
    h = f.read()

target = '''            <!-- Footer Quick Nav -->
            <div class="mt-6 flex items-center justify-between">
              <button type="button" onclick="if(window.goToProductSlide){window.goToProductSlide(1);}" class="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-cream/80 hover:text-white transition-all cursor-pointer">
                &larr; Intraocular Lenses
              </button>
              <button type="button" onclick="if(window.goToProductSlide){window.goToProductSlide(3);}" class="px-5 py-2.5 rounded-xl bg-sky text-[#0a1d40] text-xs font-bold hover:bg-[#72c5f8] transition-all cursor-pointer flex items-center gap-1.5">
                <span>Next: Devices &amp; Equipment</span>
                <svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m9 18 6-6-6-6"/></svg>
              </button>
            </div>'''

h_norm = h.replace('\r\n', '\n')
target_norm = target.replace('\r\n', '\n')

if target_norm in h_norm:
    h_norm = h_norm.replace(target_norm, '')
    print("SUCCESS: Removed Footer Quick Nav buttons from Slide 2!")
else:
    print("WARNING: target_norm not found directly, checking regex")
    import re
    p = r'\s*<!-- Footer Quick Nav -->\s*<div class="mt-6 flex items-center justify-between">[\s\S]*?<\/div>'
    h_norm = re.sub(p, '', h_norm, count=1)
    print("Removed via regex!")

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(h_norm)
print("Updated index.html successfully!")

