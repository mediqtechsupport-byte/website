p = 'scratch/redesign_what_we_do_v3.py'
src = open(p, encoding='utf-8').read()
PILL = 'inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-cream/90 hover:text-white transition-all cursor-pointer backdrop-blur-md'
CHEV = '<svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m9 18 6-6-6-6"/></svg>'

new_card = '''def card(p):
    return f\'\'\'<button type="button" class="wwd-card group flex flex-col overflow-hidden rounded-2xl border border-white/10 hover:border-sky/60 bg-[#0a1428]/90 text-left shadow-[0_10px_30px_rgba(0,0,0,0.35)] hover:shadow-[0_18px_44px_rgba(58,160,219,0.22)] hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              data-title="{esc(p['title'])}" data-cat="{esc(p['cat'])}" data-n="{p['n']}" data-img="assets/img/pillars/{p['img']}" data-desc="{esc(p['desc'])}" data-pts="{esc('|'.join(p['pts']))}" data-sl="{esc(p['sl'])}" data-sv="{esc(p['sv'])}">
              <div class="relative w-full overflow-hidden h-[clamp(96px,23vh,250px)]">
                <img src="assets/img/pillars/{p['img']}" alt="{esc(p['title'])}" class="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy">
                <div class="absolute inset-0 bg-gradient-to-t from-[#0a1428] via-[#0a1428]/10 to-transparent"></div>
                <span class="absolute top-3 left-3 text-xs font-mono font-bold text-white/90 bg-black/45 backdrop-blur px-2 py-0.5 rounded-md border border-white/15">{p['n']}</span>
                <span class="absolute bottom-3 left-3 inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#0a1d40]/85 border border-sky/40 backdrop-blur text-[11px] font-mono"><span class="text-cream/70 uppercase">{p['sl']}</span><span class="text-sky font-bold">{p['sv']}</span></span>
              </div>
              <div class="px-5 py-4 flex flex-col gap-1.5">
                <div class="text-[10px] font-mono uppercase tracking-[0.2em] text-sky/80">{p['cat']}</div>
                <h3 class="text-base lg:text-lg font-semibold text-white leading-snug group-hover:text-sky transition-colors">{p['title'].replace('&','&amp;')}</h3>
                <span class="self-start mt-1.5 PILL group-hover:border-sky/40"><span>Find out more</span>CHEV</span>
              </div>
            </button>\'\'\'

'''.replace('PILL', PILL).replace('CHEV', CHEV)
a = src.index('def card(p):')
b = src.index('cards = ')
src = src[:a] + new_card + src[b:]
src = src.replace('max-w-[1180px]', 'max-w-[1500px]')
open(p, 'w', encoding='utf-8').write(src)
print('ok')

