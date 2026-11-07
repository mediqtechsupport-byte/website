reps = [
 ('px-3 sm:px-4 lg:px-5 pt-14 sm:pt-[60px] pb-14 overflow-y-auto', 'pl-3 pr-12 sm:pl-5 sm:pr-16 pt-12 sm:pt-14 pb-4 overflow-y-auto'),
 ('flex flex-col gap-3 flex-1 min-h-[680px]">\n            <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-1">',
  'flex flex-col gap-2 flex-1 min-h-[460px]">\n            <div class="flex flex-wrap items-baseline gap-x-4 gap-y-0.5">'),
 ('text-xs sm:text-sm text-cream/75 max-w-xl sm:text-right">', 'text-xs sm:text-sm text-cream/75 max-w-2xl">'),
 ('lg:grid-rows-2 gap-3 lg:gap-4 flex-1">', 'lg:grid-rows-[minmax(0,1fr)_minmax(0,1fr)] gap-3 lg:gap-4 flex-1 min-h-0">'),
 ('flex-1 min-h-[130px] overflow-hidden">', 'flex-1 min-h-[90px] overflow-hidden">'),
 ('<div class="p-4 lg:p-5 flex flex-col gap-1.5">', '<div class="p-3 lg:p-4 flex flex-col gap-1 shrink-0">'),
 ('text-lg lg:text-xl font-extrabold text-white group-hover:text-sky transition-colors leading-snug">', 'text-base lg:text-lg font-extrabold text-white group-hover:text-sky transition-colors leading-snug">'),
 ('<span class="mt-1.5 inline-flex items-center text-sm font-semibold text-sky">Find out more', '<span class="mt-1 inline-flex items-center text-sm font-semibold text-sky">Find out more'),
]
for path in ['index.html', 'components/about-locked-backup.html']:
    with open(path, 'r', encoding='utf-8', newline='') as f:
        h = f.read()
    crlf = '\r\n' in h
    h = h.replace('\r\n', '\n')
    s = h.find('id="about-slide-what-we-do"')
    e = h.find('SLIDE 4: OUR ESTABLISHED FOUNDATION')
    seg = h[s:e]
    for a, b in reps:
        assert a in seg, (path, a[:40])
        seg = seg.replace(a, b)
    h = h[:s] + seg + h[e:]
    if crlf:
        h = h.replace('\n', '\r\n')
    with open(path, 'w', encoding='utf-8', newline='') as f:
        f.write(h)
    print('updated', path)

