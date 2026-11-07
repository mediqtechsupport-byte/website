p = 'scratch/redesign_what_we_do_v3.py'
s = open(p, encoding='utf-8').read()

CHEV = '<svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m9 18 6-6-6-6"/></svg>'
CHEV_L = '<svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m15 18-6-6 6-6"/></svg>'
PILL = 'inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-cream/90 hover:text-white transition-all cursor-pointer backdrop-blur-md'

# 1. card link -> pill with small chevron
old = s[s.index('<span class="inline-flex items-center gap-1.5 text-xs text-white/75'):]
old = old[:old.index('</svg>') + len('</svg>')]
new = f'<span class="self-start {PILL} group-hover:bg-white/10 group-hover:border-sky/40"><span>Find out more</span>{CHEV}'
s = s.replace(old, new)
# the closing </span> that followed the svg stays as the pill closer

# 2. modal CTA -> pill (no long arrow)
a = s.index('<a href="#contact" id="wwd-modal-cta"')
b = s.index('</a>', a) + 4
s = s[:a] + f'<a href="#contact" id="wwd-modal-cta" class="{PILL}"><span>Contact us</span>{CHEV}</a>' + s[b:]

# 3. header with pill navigation (replaces the round arrows on this slide)
h_old = 'flex flex-col items-center text-center gap-1.5 shrink-0">'
assert h_old in s
s = s.replace(h_old, 'flex items-center justify-between gap-3 shrink-0">\n'
  f'              <button type="button" onclick="if(window.goToAboutSlide){{window.goToAboutSlide(1);}}" class="{PILL}">{CHEV_L}<span>Who We Are</span></button>\n'
  '              <div class="flex flex-col items-center text-center gap-1.5">')
# close inner div + add right pill after the subtitle paragraph
sub_end = s.index('across the Philippines.</p>') + len('across the Philippines.</p>')
s = s[:sub_end] + '\n              </div>\n' + f'              <button type="button" onclick="if(window.goToAboutSlide){{window.goToAboutSlide(3);}}" class="{PILL}"><span>Our Foundation</span>{CHEV}</button>' + s[sub_end:]
open(p, 'w', encoding='utf-8').write(s)

# 4. main.js: hide round arrow nav on What We Do (slide index 2)
jp = 'assets/js/main.js'
js = open(jp, encoding='utf-8', newline='').read()
o = "      if (currentIndex === 0) {\r\n        navCtrl.classList.add('opacity-0', 'pointer-events-none', 'scale-90');"
n = "      if (currentIndex === 0 || currentIndex === 2) {\r\n        navCtrl.classList.add('opacity-0', 'pointer-events-none', 'scale-90');"
if o not in js:
    o = o.replace('\r\n', '\n'); n = n.replace('\r\n', '\n')
assert o in js, 'nav snippet not found'
js = js.replace(o, n)
open(jp, 'w', encoding='utf-8', newline='').write(js)
print('patched')

