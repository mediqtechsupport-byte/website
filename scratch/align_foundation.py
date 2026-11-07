import re
OLD_C = '<div class="relative z-10 mx-auto w-full max-w-7xl">'
NEW_C = '<div class="relative z-10 mx-auto w-full max-w-[1680px] px-[clamp(24px,5vw,88px)]">'

for path in ['index.html', 'components/about-locked-backup.html']:
    with open(path, 'r', encoding='utf-8', newline='') as f:
        h = f.read()
    s4 = h.index('SLIDE 4: OUR ESTABLISHED FOUNDATION')
    s5 = h.index('SLIDE 5: OUR CORE VALUES')
    seg = h[s4:s5]
    assert OLD_C in seg, (path, 'container')
    seg = seg.replace(OLD_C, NEW_C, 1)
    m = re.search(r'<div class="about-slide[^"]*" data-index="3">', seg)
    tag = m.group(0)
    assert 'px-6 sm:px-10 lg:px-16 pt-24 pb-6' in tag, tag
    seg = seg.replace(tag, tag.replace('px-6 sm:px-10 lg:px-16 pt-24 pb-6', 'px-0 pt-20 pb-20'), 1)
    h = h[:s4] + seg + h[s5:]
    with open(path, 'w', encoding='utf-8', newline='') as f:
        f.write(h)
    print('updated', path)

