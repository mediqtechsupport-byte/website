p = 'scratch/redesign_what_we_do_v3.py'
s = open(p, encoding='utf-8').read()

# 1. remove the dot-matrix background (this slide only)
dots = '          <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(#3aa0db_1px,transparent_1px)] [background-size:24px_24px] opacity-15"></div>\n'
assert dots in s
s = s.replace(dots, '')

# 2. header: stacked + centered
old_head = 'flex flex-wrap items-baseline gap-x-4 gap-y-0.5 shrink-0"'
assert old_head in s
s = s.replace(old_head, 'flex flex-col items-center text-center gap-1.5 shrink-0"')
s = s.replace('text-xs sm:text-sm text-cream/70">Clinical distribution', 'text-xs sm:text-sm text-cream/60 max-w-xl">Clinical distribution')
open(p, 'w', encoding='utf-8').write(s)
print('ok')

