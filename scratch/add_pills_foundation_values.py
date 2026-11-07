import re

PILL = 'inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-cream/90 hover:text-white transition-all cursor-pointer backdrop-blur-md'
CL = '<svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m15 18-6-6 6-6"/></svg>'
CR = '<svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m9 18 6-6-6-6"/></svg>'

def bar(prev_i, prev_t, next_i, next_t):
    return (f'\n          <!-- Pill navigation (replaces round arrows) -->\n'
            f'          <div class="absolute top-[76px] left-0 right-0 z-30 px-6 sm:px-10 lg:px-16 flex items-center justify-between gap-3 pointer-events-none">\n'
            f'            <button type="button" onclick="if(window.goToAboutSlide){{window.goToAboutSlide({prev_i});}}" class="pointer-events-auto {PILL}">{CL}<span>{prev_t}</span></button>\n'
            f'            <button type="button" onclick="if(window.goToAboutSlide){{window.goToAboutSlide({next_i});}}" class="pointer-events-auto {PILL}"><span>{next_t}</span>{CR}</button>\n'
            f'          </div>\n').replace('{{', '{').replace('}}', '}')

BARS = {
  '3': bar(2, 'What We Do', 4, 'Core Values'),
  '4': bar(3, 'Our Foundation', 0, 'Back to Purpose'),
}

for path in ['index.html', 'components/about-locked-backup.html']:
    with open(path, 'r', encoding='utf-8', newline='') as f:
        h = f.read()
    crlf = '\r\n' in h
    h = h.replace('\r\n', '\n')
    for idx, b in BARS.items():
        m = re.search(r'<div class="about-slide[^"]*" data-index="%s">' % idx, h)
        assert m, (path, idx)
        tag = m.group(0)
        assert 'pt-20 pb-16' in tag, tag
        new_tag = tag.replace('pt-20 pb-16', 'pt-28 pb-16')
        h = h[:m.start()] + new_tag + b + h[m.end():]
    if crlf:
        h = h.replace('\n', '\r\n')
    with open(path, 'w', encoding='utf-8', newline='') as f:
        f.write(h)
    print('updated', path)

jp = 'assets/js/main.js'
js = open(jp, encoding='utf-8', newline='').read()
o = 'if (currentIndex === 0 || currentIndex === 2) {'
assert o in js
js = js.replace(o, 'if (currentIndex === 0 || currentIndex >= 2) {')
open(jp, 'w', encoding='utf-8', newline='').write(js)
print('main.js updated')

