import re

PILL = 'inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-cream/90 hover:text-white transition-all cursor-pointer backdrop-blur-md'
CL = '<svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m15 18-6-6 6-6"/></svg>'
CR = '<svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m9 18 6-6-6-6"/></svg>'
BAR = ('\n          <!-- Pill navigation (replaces round arrows) -->\n'
       '          <div class="absolute top-[76px] left-0 right-0 z-30 px-6 sm:px-10 lg:px-16 flex items-center justify-between gap-3 pointer-events-none">\n'
       f'            <button type="button" onclick="if(window.goToAboutSlide){{window.goToAboutSlide(0);}}" class="pointer-events-auto {PILL}">{CL}<span>Our Purpose</span></button>\n'
       f'            <button type="button" onclick="if(window.goToAboutSlide){{window.goToAboutSlide(2);}}" class="pointer-events-auto {PILL}"><span>What We Do</span>{CR}</button>\n'
       '          </div>\n')

for path in ['index.html', 'components/about-locked-backup.html']:
    with open(path, 'r', encoding='utf-8', newline='') as f:
        h = f.read()
    crlf = '\r\n' in h
    h = h.replace('\r\n', '\n')
    m = re.search(r'<div class="about-slide[^"]*" data-index="1">', h)
    tag = m.group(0)
    assert 'bg-[#0a1d40]' in tag, tag
    nt = tag.replace('bg-[#0a1d40]', 'bg-transparent', 1)
    nt = nt.replace('pt-16 sm:pt-20', 'pt-28 sm:pt-28')
    h = h[:m.start()] + nt + BAR + h[m.end():]
    if crlf:
        h = h.replace('\n', '\r\n')
    with open(path, 'w', encoding='utf-8', newline='') as f:
        f.write(h)
    print('updated', path, 'padding changed' if 'pt-28 sm:pt-28' in nt else 'padding unchanged')

jp = 'assets/js/main.js'
js = open(jp, encoding='utf-8', newline='').read()
o = 'if (currentIndex === 0 || currentIndex >= 2) {'
assert o in js
js = js.replace(o, 'if (currentIndex >= 0) {')
open(jp, 'w', encoding='utf-8', newline='').write(js)
print('main.js: round arrows hidden on every slide')

