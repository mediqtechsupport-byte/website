OPEN = '<div class="relative z-10 mx-auto w-full max-w-7xl">'
S4 = 'SLIDE 4: OUR ESTABLISHED FOUNDATION'
S5 = 'SLIDE 5: OUR CORE VALUES'

CARD = ('relative rounded-2xl border border-white/15 bg-gradient-to-b from-white/[0.09] to-white/[0.02] backdrop-blur-xl '
        'shadow-[0_8px_30px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.12)] hover:border-[#5ee6f2]/50 transition-all '
        'p-[clamp(0.7rem,2vh,1.4rem)]')

block = f'''{OPEN}
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">

              <!-- Left: copy -->
              <div class="lg:col-span-7 xl:col-span-7">
                <h2 class="font-semibold text-white tracking-tight leading-[1.04] text-[clamp(2rem,8vh,5rem)] mb-[clamp(0.6rem,2.4vh,1.6rem)]">
                  Our Established<br>
                  <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#3aa0db] via-[#4cc3ea] to-[#5ee6f2] drop-shadow-[0_0_22px_rgba(94,230,242,0.45)]">Foundation</span>
                </h2>

                <p class="max-w-xl text-white/90 leading-relaxed text-[clamp(0.8rem,2.4vh,1.3rem)] mb-[clamp(0.8rem,3vh,2rem)]">
                  MEDIQ brings established expertise in ophthalmology and serves as the exclusive Philippine distributor for Rayner intraocular lenses from the United Kingdom.
                </p>

                <div class="grid grid-cols-2 gap-[clamp(0.6rem,1.8vh,1.25rem)] max-w-xl mb-[clamp(0.6rem,2vh,1.25rem)]">
                  <div class="{CARD}"><span class="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent"></span>
                    <div class="text-[#5ee6f2] font-semibold text-[clamp(0.8rem,2.2vh,1.2rem)] mb-1">100% UK Precision</div>
                    <div class="text-white/75 leading-snug text-[clamp(0.65rem,1.7vh,0.95rem)]">Worthing, West Sussex Engineered Intraocular Lenses</div>
                  </div>
                  <div class="{CARD}"><span class="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent"></span>
                    <div class="text-[#5ee6f2] font-semibold text-[clamp(0.8rem,2.2vh,1.2rem)] mb-1">Nationwide Cold-Chain</div>
                    <div class="text-white/75 leading-snug text-[clamp(0.65rem,1.7vh,0.95rem)]">Verified Hospital Logistics &amp; Operating Room Delivery</div>
                  </div>
                </div>

                <div class="relative max-w-xl rounded-xl border border-white/20 border-l-[3px] border-l-[#5ee6f2] shadow-[0_0_18px_rgba(94,230,242,0.15),inset_0_1px_0_rgba(255,255,255,0.1)] bg-white/[0.04] backdrop-blur-md px-[clamp(0.8rem,2vh,1.4rem)] py-[clamp(0.6rem,1.8vh,1.1rem)] font-serif italic text-white/85 leading-relaxed text-[clamp(0.65rem,1.8vh,1rem)]">
                  Complementary portfolio expansion is a strategic opportunity and is subject to licensing, ethical regulatory compliance, and partner authorization.
                </div>
              </div>

              <!-- Right: 3D shining lens rings -->
              <div class="lg:col-span-5 xl:col-span-5 flex flex-col items-center justify-center gap-[clamp(0.6rem,2vh,1.4rem)]">
                <style>
                  @keyframes fdnFloat {{ 0%,100% {{ transform: translateY(0) rotate(-3deg); }} 50% {{ transform: translateY(-3%) rotate(2deg); }} }}
                  @keyframes fdnPulse {{ 0%,100% {{ opacity:.55; transform:scale(1); }} 50% {{ opacity:1; transform:scale(1.04); }} }}
                  .fdn-float {{ animation: fdnFloat 7s ease-in-out infinite; }}
                  .fdn-pulse {{ animation: fdnPulse 4.5s ease-in-out infinite; }}
                </style>
                <div class="relative grid place-items-center size-[clamp(210px,54vh,540px)] group [perspective:900px]">
                  <!-- ambient bloom -->
                  <div class="fdn-pulse pointer-events-none absolute -inset-[14%] rounded-full bg-[radial-gradient(circle,rgba(94,230,242,0.28)_0%,rgba(58,160,219,0.16)_45%,transparent_70%)] blur-2xl"></div>
                  <!-- outer neon ring -->
                  <div class="absolute inset-0 rounded-full border border-[#5ee6f2]/50 shadow-[0_0_46px_rgba(94,230,242,0.5),inset_0_0_46px_rgba(94,230,242,0.28)]"></div>
                  <!-- rotating light arcs (shine) -->
                  <div class="absolute inset-0 rounded-full animate-spin [animation-duration:11s]" style="background:conic-gradient(from 0deg,transparent 0deg,rgba(255,255,255,0.95) 18deg,#5ee6f2 40deg,transparent 95deg,transparent 200deg,rgba(94,230,242,0.8) 235deg,transparent 280deg);mask-image:radial-gradient(farthest-side,transparent calc(100% - 5px),#000 calc(100% - 4px));-webkit-mask-image:radial-gradient(farthest-side,transparent calc(100% - 5px),#000 calc(100% - 4px));filter:drop-shadow(0 0 8px rgba(94,230,242,0.9))"></div>
                  <div class="absolute inset-[4.5%] rounded-full animate-spin [animation-duration:17s] [animation-direction:reverse]" style="background:conic-gradient(from 90deg,transparent 0deg,rgba(255,255,255,0.8) 14deg,#3aa0db 38deg,transparent 80deg,transparent 220deg,rgba(58,160,219,0.9) 260deg,transparent 300deg);mask-image:radial-gradient(farthest-side,transparent calc(100% - 3px),#000 calc(100% - 2px));-webkit-mask-image:radial-gradient(farthest-side,transparent calc(100% - 3px),#000 calc(100% - 2px));filter:drop-shadow(0 0 6px rgba(58,160,219,0.9))"></div>
                  <!-- inner disc -->
                  <div class="absolute inset-[10%] rounded-full bg-[radial-gradient(circle_at_50%_40%,#10346a_0%,#071a3a_62%,#040f26_100%)] border border-[#5ee6f2]/30 shadow-[inset_0_0_70px_rgba(0,0,0,0.65),inset_0_2px_0_rgba(255,255,255,0.12)]"></div>
                  <!-- glass glint on disc -->
                  <div class="pointer-events-none absolute inset-[10%] rounded-full bg-[linear-gradient(145deg,rgba(255,255,255,0.22)_0%,rgba(255,255,255,0.04)_28%,transparent_45%)]"></div>
                  <!-- floating lens -->
                  <div class="fdn-float relative w-[74%] [transform-style:preserve-3d]">
                    <img src="assets/img/about-crystal-lens.png" alt="Rayner UK Intraocular Lens Partnership" class="w-full object-contain drop-shadow-[0_24px_36px_rgba(0,0,0,0.55)] drop-shadow-[0_0_28px_rgba(94,230,242,0.6)] group-hover:scale-105 transition-transform duration-500">
                    <div class="pointer-events-none absolute left-[22%] top-[28%] w-[34%] h-[18%] rounded-full bg-white/35 blur-xl mix-blend-screen"></div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
'''

for path in ['index.html', 'components/about-locked-backup.html']:
    with open(path, 'r', encoding='utf-8', newline='') as f:
        h = f.read()
    crlf = '\r\n' in h
    h = h.replace('\r\n', '\n')
    s4 = h.index(S4)
    s5 = h.index(S5)
    o = h.index(OPEN, s4)
    assert o < s5
    # end = start of the "<!-- ====" comment line that precedes SLIDE 5
    end = h.rindex('        <!-- ====', s4, s5)
    h = h[:o] + block + '\n' + h[end:]
    # slide padding: a bit tighter bottom so the larger visual fits
    seg_s = h.index('data-index="3">')
    tag_s = h.rindex('<div class="about-slide', 0, seg_s)
    tag = h[tag_s:seg_s]
    h = h[:tag_s] + tag.replace('pt-28 pb-16', 'pt-24 pb-6') + h[seg_s:]
    if crlf:
        h = h.replace('\n', '\r\n')
    with open(path, 'w', encoding='utf-8', newline='') as f:
        f.write(h)
    print('updated', path)

