import re
h = open('index.html', encoding='utf-8').read()
s = h.find('SLIDE 5: OUR CORE VALUES'); e = h.find('</section>', s)
seg = h[s:e]
print('cards:', seg.count('group relative rounded-2xl border border-white/20'))
print('svg full:', seg.count('class="size-full"'))
print('divs open/close:', len(re.findall(r'<div\b', seg)), len(re.findall(r'</div>', seg)))

