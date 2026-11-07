import re
p = 'scratch/redesign_what_we_do_v3.py'
s = open(p, encoding='utf-8').read()

# 1. compact text row: category + title on the left, button on the right -> photo gets the space
a = s.index('<div class="px-1.5 pt-[clamp(0.4rem,1.3vh,0.9rem)]')
b = s.index('</button>\'\'\'', a)
new_text = '''<div class="px-1.5 pt-[clamp(0.35rem,1vh,0.75rem)] pb-0.5 flex items-center justify-between gap-2 shrink-0">
                <div class="min-w-0">
                  <div class="text-[clamp(0.52rem,1.3vh,0.72rem)] font-semibold uppercase tracking-[0.12em] text-[#72c5f8] truncate">{p['cat']}</div>
                  <h3 class="font-bold text-white leading-tight text-[clamp(0.78rem,2vh,1.15rem)]">{p['title'].replace('&','&amp;')}</h3>
                </div>
                <span class="shrink-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky/10 group-hover:bg-sky/20 border border-sky/30 group-hover:border-sky/60 text-[11px] font-semibold text-white transition-all backdrop-blur-md"><span>Find out more</span><svg class="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m9 18 6-6-6-6"/></svg></span>
              </div>
            '''
s = s[:a] + new_text + s[b:]

# 2. bottom safe space + hide subtitle on short screens
assert 'pt-[72px] pb-3 overflow-y-auto' in s
s = s.replace('pt-[72px] pb-3 overflow-y-auto', 'pt-[72px] pb-12 overflow-y-auto')
s = s.replace('<p class="mt-1.5 text-white/75', '<p class="mt-1 [@media(max-height:560px)]:hidden text-white/75')
s = s.replace('min-h-[340px]">', 'min-h-[300px]">')
open(p, 'w', encoding='utf-8').write(s)
print('patched', 'max-height' in s)

