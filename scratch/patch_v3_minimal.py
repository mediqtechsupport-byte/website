import re

p = 'scratch/redesign_what_we_do_v3.py'
src = open(p, encoding='utf-8').read()

new_card = '''def card(p):
    return f\'\'\'<button type="button" class="wwd-card group flex flex-col overflow-hidden rounded-xl border border-white/10 hover:border-sky/50 bg-[#0a1428]/90 text-left transition-colors duration-300 cursor-pointer"
              data-title="{esc(p['title'])}" data-cat="{esc(p['cat'])}" data-n="{p['n']}" data-img="assets/img/pillars/{p['img']}" data-desc="{esc(p['desc'])}" data-pts="{esc('|'.join(p['pts']))}" data-sl="{esc(p['sl'])}" data-sv="{esc(p['sv'])}">
              <div class="relative w-full overflow-hidden h-[clamp(84px,19vh,190px)]">
                <img src="assets/img/pillars/{p['img']}" alt="{esc(p['title'])}" class="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy">
              </div>
              <div class="px-5 py-4 flex flex-col gap-2.5">
                <h3 class="text-sm lg:text-base font-medium text-white leading-snug">{p['title'].replace('&','&amp;')}</h3>
                <span class="inline-flex items-center gap-1.5 text-xs text-white/75 group-hover:text-sky transition-colors">Find out more
                  <svg class="size-3.5 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
                </span>
              </div>
            </button>\'\'\'

'''
a = src.index('def card(p):')
b = src.index("cards = ")
src = src[:a] + new_card + src[b:]

# wrapper: narrower, centered, minimalist
src = src.replace('w-full max-w-[1900px] mx-auto flex flex-col gap-2 flex-1 min-h-0">', 'w-full max-w-[1180px] mx-auto flex flex-col justify-center gap-5 flex-1 min-h-0">')
src = src.replace('flex flex-col gap-3 flex-1 min-h-[680px]">', 'flex flex-col justify-center gap-5 flex-1 min-h-0">')
src = src.replace('max-w-[1900px] mx-auto flex flex-col gap-3', 'max-w-[1180px] mx-auto flex flex-col justify-center gap-5')
src = src.replace('lg:grid-rows-[minmax(0,1fr)_minmax(0,1fr)] gap-3 lg:gap-4 flex-1 min-h-0">', 'gap-4 lg:gap-5">')
src = src.replace('lg:grid-rows-2 gap-3 lg:gap-4 flex-1">', 'gap-4 lg:gap-5">')
open(p, 'w', encoding='utf-8').write(src)
print('patched; has clamp:', 'clamp(84px' in src, 'max-w-[1180px]' in src, "gap-4 lg:gap-5" in src)

