import re

CYAN = '#5ee6f2'

def build(seg_old):
    # pull icon + title + desc from the existing cards so content is preserved
    cards = []
    for m in re.finditer(r'<h3 class="text-xs sm:text-sm font-bold text-white mb-1">(.*?)</h3>\s*<p class="[^"]*">(.*?)</p>', seg_old, re.S):
        name, desc = m.group(1), m.group(2).strip()
        before = seg_old[:m.start()]
        svg = re.findall(r'<svg class="size-5"[^>]*>.*?</svg>', before, re.S)[-1]
        svg = svg.replace('class="size-5"', 'class="size-full"', 1)
        cards.append((name, desc, svg))
    assert len(cards) == 6, len(cards)

    def card(name, desc, svg):
        return f'''<div class="group relative rounded-2xl border border-white/20 bg-gradient-to-b from-white/[0.10] to-white/[0.02] backdrop-blur-xl shadow-[0_0_28px_rgba(94,230,242,0.14),0_10px_30px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.18),inset_0_0_30px_rgba(94,230,242,0.05)] hover:border-[{CYAN}]/60 hover:shadow-[0_0_40px_rgba(94,230,242,0.3),0_14px_36px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.25)] hover:-translate-y-1 transition-all duration-300 px-[clamp(0.8rem,2vh,1.6rem)] py-[clamp(0.7rem,2.4vh,1.8rem)] flex flex-col items-center justify-center text-center">
                <span class="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent"></span>
                <span class="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 h-12 w-2/3 rounded-full bg-[{CYAN}]/10 blur-2xl"></span>
                <div class="relative mb-[clamp(0.4rem,1.4vh,1rem)] grid place-items-center size-[clamp(38px,7vh,68px)] rounded-full border border-[{CYAN}]/55 bg-[radial-gradient(circle,rgba(94,230,242,0.22)_0%,rgba(10,29,64,0.6)_70%)] shadow-[0_0_22px_rgba(94,230,242,0.45),inset_0_0_14px_rgba(94,230,242,0.3)] group-hover:scale-110 transition-transform duration-300">
                  <span class="pointer-events-none absolute -inset-[5px] rounded-full border border-[{CYAN}]/25"></span>
                  <span class="block size-[46%] text-[{CYAN}] drop-shadow-[0_0_6px_rgba(94,230,242,0.8)]">{svg}</span>
                </div>
                <h3 class="font-bold text-white text-[clamp(0.95rem,2.8vh,1.6rem)] mb-[clamp(0.2rem,0.8vh,0.5rem)] leading-tight">{name}</h3>
                <p class="text-white/75 leading-snug max-w-[17rem] text-[clamp(0.7rem,1.9vh,1.05rem)]">{desc}</p>
              </div>'''

    cards_html = '\n              '.join(card(*c) for c in cards)
    return f'''<!-- Core Values: glass card grid -->
          <div class="relative z-10 mx-auto w-full max-w-[1680px] px-0 sm:px-[clamp(0px,2vw,40px)]">

            <div class="mb-[clamp(0.6rem,2.4vh,1.6rem)]">
              <h2 class="font-semibold text-white tracking-tight leading-tight text-[clamp(1.7rem,6vh,3.6rem)] mb-1">
                Our <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#3aa0db] via-[#4cc3ea] to-[{CYAN}] font-bold drop-shadow-[0_0_20px_rgba(94,230,242,0.45)]">Core Values</span>
              </h2>
              <p class="text-white/80 text-[clamp(0.75rem,2vh,1.15rem)]">Principles That Drive Philippine Clinical Stewardship &amp; Long-term Partnerships</p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[clamp(0.6rem,2vh,1.4rem)]">
              {cards_html}
            </div>

            <!-- Beyond Distribution closing banner (glass) -->
            <div class="mt-[clamp(0.6rem,2vh,1.4rem)] relative rounded-2xl border border-white/20 bg-gradient-to-b from-white/[0.08] to-white/[0.02] backdrop-blur-xl shadow-[0_0_24px_rgba(94,230,242,0.12),inset_0_1px_0_rgba(255,255,255,0.15)] px-[clamp(0.8rem,2vh,1.6rem)] py-[clamp(0.5rem,1.6vh,1.1rem)] text-center">
              <span class="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent"></span>
              <h3 class="font-bold text-white text-[clamp(0.85rem,2.2vh,1.3rem)]">Beyond Distribution. Advancing Healthcare Together.</h3>
              <p class="text-[{CYAN}] font-medium text-[clamp(0.65rem,1.6vh,0.95rem)] mt-0.5">Sourcing, commercializing, and distributing ophthalmic and healthcare technologies for Filipino clinicians and patients.</p>
              <div class="mt-1.5 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-[clamp(0.6rem,1.5vh,0.85rem)] font-mono text-white/70">
                <span class="flex items-center gap-1.5"><span class="size-1.5 rounded-full bg-[{CYAN}] shadow-[0_0_6px_rgba(94,230,242,0.9)]"></span>Philippine FDA Registered</span>
                <span class="flex items-center gap-1.5"><span class="size-1.5 rounded-full bg-[{CYAN}] shadow-[0_0_6px_rgba(94,230,242,0.9)]"></span>Rayner UK Official Partner</span>
                <span class="flex items-center gap-1.5"><span class="size-1.5 rounded-full bg-[{CYAN}] shadow-[0_0_6px_rgba(94,230,242,0.9)]"></span>Nationwide Hospital Network</span>
              </div>
            </div>

          </div>
'''

for path in ['index.html', 'components/about-locked-backup.html']:
    with open(path, 'r', encoding='utf-8', newline='') as f:
        h = f.read()
    crlf = '\r\n' in h
    h = h.replace('\r\n', '\n')
    s5 = h.index('SLIDE 5: OUR CORE VALUES')
    up = h.index('<!-- Upper: Core Values Grid -->', s5)
    # end of the slide content: the slide-closing div sequence before </section>
    sec_end = h.index('</section>', s5)
    tail = '        </div>\n      </div>\n\n    </section>'
    # find slide-close "        </div>" that precedes the deck-close "      </div>" right before </section>
    close_idx = h.rindex('        </div>\n      </div>', s5, sec_end)
    old = h[up:close_idx]
    new = build(old)
    h = h[:up] + new + h[close_idx:]
    # slide wrapper
    m = re.search(r'<div class="about-slide[^"]*" data-index="4">', h)
    tag = m.group(0)
    nt = tag.replace('justify-between', 'justify-center').replace('bg-[#0a1d40]', 'bg-transparent').replace('pt-28 pb-16', 'pt-24 pb-8')
    assert nt != tag
    h = h[:m.start()] + nt + h[m.end():]
    if crlf:
        h = h.replace('\n', '\r\n')
    with open(path, 'w', encoding='utf-8', newline='') as f:
        f.write(h)
    print('updated', path)

