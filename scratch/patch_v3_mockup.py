p = 'scratch/redesign_what_we_do_v3.py'
s = open(p, encoding='utf-8').read()

BL = '#72c5f8'
new_card = '''def card(p):
    return f\'\'\'<button type="button" class="wwd-card group relative flex flex-col min-h-[300px] lg:min-h-0 overflow-hidden rounded-2xl border border-white/20 hover:border-[#72c5f8]/60 bg-gradient-to-b from-white/[0.10] to-white/[0.03] backdrop-blur-xl text-left p-[clamp(0.45rem,1.2vh,0.8rem)] shadow-[0_0_30px_rgba(58,160,219,0.22),0_10px_30px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.18)] hover:shadow-[0_0_44px_rgba(114,197,248,0.38),0_14px_36px_rgba(0,0,0,0.4)] hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              data-title="{esc(p['title'])}" data-cat="{esc(p['cat'])}" data-n="{p['n']}" data-img="assets/img/pillars/{p['img']}" data-desc="{esc(p['desc'])}" data-pts="{esc('|'.join(p['pts']))}" data-sl="{esc(p['sl'])}" data-sv="{esc(p['sv'])}">
              <span class="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent"></span>
              <span class="pointer-events-none absolute inset-x-8 bottom-0 h-px bg-gradient-to-r from-transparent via-[#72c5f8] to-transparent shadow-[0_0_14px_rgba(114,197,248,0.9)]"></span>
              <div class="relative flex-1 min-h-0 w-full overflow-hidden rounded-xl">
                <img src="assets/img/pillars/{p['img']}" alt="{esc(p['title'])}" class="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy">
                <div class="absolute inset-0 bg-gradient-to-t from-[#071530]/80 via-transparent to-transparent"></div>
                <span class="absolute top-2 left-2 text-[11px] font-mono font-semibold text-white/90 bg-[#0a1d40]/60 backdrop-blur px-2 py-0.5 rounded-md border border-white/25">{p['n']}</span>
                <span class="absolute bottom-2 left-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0a1d40]/70 border border-[#72c5f8]/50 backdrop-blur shadow-[0_0_14px_rgba(114,197,248,0.3)] text-[clamp(0.55rem,1.4vh,0.75rem)] font-semibold"><span class="text-white/85 uppercase">{p['sl']}</span><span class="text-white/50">&bull;</span><span class="text-[#72c5f8]">{p['sv']}</span></span>
              </div>
              <div class="px-1.5 pt-[clamp(0.4rem,1.3vh,0.9rem)] pb-1 flex flex-col gap-[clamp(0.15rem,0.6vh,0.4rem)] shrink-0">
                <div class="text-[clamp(0.55rem,1.4vh,0.75rem)] font-semibold uppercase tracking-[0.12em] text-[#72c5f8]">{p['cat']}</div>
                <h3 class="font-bold text-white leading-tight text-[clamp(0.9rem,2.5vh,1.45rem)]">{p['title'].replace('&','&amp;')}</h3>
                <span class="self-start mt-1 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 group-hover:bg-white/15 border border-white/25 group-hover:border-[#72c5f8]/60 text-xs font-semibold text-white transition-all backdrop-blur-md"><span>Find out more</span><svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m9 18 6-6-6-6"/></svg></span>
              </div>
            </button>\'\'\'

'''
a = s.index('def card(p):')
b = s.index('cards = ')
s = s[:a] + new_card + s[b:]

# header + grid
h0 = s.index('<div class="relative z-20 w-full max-w-[1500px]')
h1 = s.index('<!-- Find-out-more detail card -->')
new_main = '''<div class="relative z-20 w-full max-w-[1700px] mx-auto flex flex-col gap-[clamp(0.5rem,1.6vh,1.1rem)] flex-1 min-h-[440px]">
            <div class="flex flex-col items-center text-center shrink-0">
              <h2 class="font-semibold text-white tracking-tight leading-none text-[clamp(1.8rem,6.2vh,3.8rem)]">
                What <span class="text-transparent bg-clip-text bg-gradient-to-r from-sky via-[#72c5f8] to-white font-bold drop-shadow-[0_0_20px_rgba(114,197,248,0.45)]">We Do</span>
              </h2>
              <p class="mt-1.5 text-white/75 text-[clamp(0.7rem,1.9vh,1.1rem)]">Clinical distribution and surgical partnerships across the Philippines.</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-[minmax(0,1fr)_minmax(0,1fr)] gap-[clamp(0.6rem,1.8vh,1.2rem)] flex-1 min-h-0">
            {cards}
            </div>
          </div>

          '''
s = s[:h0] + new_main + s[h1:]
s = s.replace('px-6 sm:px-10 lg:px-16 pt-[76px] pb-3 overflow-y-auto', 'px-6 sm:px-10 lg:px-14 pt-[76px] pb-4 overflow-y-auto')
open(p, 'w', encoding='utf-8').write(s)
print('patched')

