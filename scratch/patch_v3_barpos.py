p = 'scratch/redesign_what_we_do_v3.py'
lines = open(p, encoding='utf-8').read().split('\n')

def idx(sub):
    for i, l in enumerate(lines):
        if sub in l:
            return i
    raise SystemExit('missing ' + sub)

i_prev = idx('window.goToAboutSlide(1);')
i_next = idx('window.goToAboutSlide(3);')
prev_btn = lines[i_prev].strip()
next_btn = lines[i_next].strip()
prev_btn = prev_btn.replace('class="inline-flex', 'class="pointer-events-auto inline-flex')
next_btn = next_btn.replace('class="inline-flex', 'class="pointer-events-auto inline-flex')

bar = [
 '          <!-- Pill navigation (same position as Foundation / Core Values) -->',
 '          <div class="absolute top-[76px] left-0 right-0 z-30 px-6 sm:px-10 lg:px-16 flex items-center justify-between gap-3 pointer-events-none">',
 '            ' + prev_btn,
 '            ' + next_btn,
 '          </div>',
 '',
]

# remove header buttons (higher index first)
del lines[i_next]
del lines[i_prev]
s = '\n'.join(lines)

# header row -> centered stack
s = s.replace('flex items-center justify-between gap-3 shrink-0">\n              <div class="flex flex-col items-center text-center gap-1.5">',
              'flex items-center justify-center gap-3 shrink-0">\n              <div class="flex flex-col items-center text-center gap-1.5">')
# slide padding to match the other slides, bar inserted after glows
s = s.replace('pl-3 pr-12 sm:pl-5 sm:pr-16 pt-12 pb-3 overflow-y-auto', 'px-6 sm:px-10 lg:px-16 pt-[76px] pb-3 overflow-y-auto')
marker = '          <div class="relative z-20 w-full max-w-[1180px]'
assert marker in s
s = s.replace(marker, '\n'.join(bar) + '\n' + marker, 1)
open(p, 'w', encoding='utf-8').write(s)
print('patched')

