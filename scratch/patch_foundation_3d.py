p = 'scratch/redesign_foundation.py'
s = open(p, encoding='utf-8').read()

# 1. glass cards: bright top edge highlight
edge = '<span class="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent"></span>'
s = s.replace('<div class="{CARD}">', '<div class="{CARD}">' + edge)

# 2. quote box: glowing left accent
s = s.replace('class="max-w-xl rounded-xl border border-white/20 bg-white/[0.04]',
              'class="relative max-w-xl rounded-xl border border-white/20 border-l-[3px] border-l-[#5ee6f2] shadow-[0_0_18px_rgba(94,230,242,0.15),inset_0_1px_0_rgba(255,255,255,0.1)] bg-white/[0.04]')

# 3. heading glow
s = s.replace('text-transparent bg-clip-text bg-gradient-to-r from-[#3aa0db] via-[#4cc3ea] to-[#5ee6f2]">Foundation',
              'text-transparent bg-clip-text bg-gradient-to-r from-[#3aa0db] via-[#4cc3ea] to-[#5ee6f2] drop-shadow-[0_0_22px_rgba(94,230,242,0.45)]">Foundation')

# 4. 3D shining lens
a = s.index('<!-- Right: glowing lens rings -->')
b = s.index('<div class="px-[1.4em]')
RING = 'mask-image:radial-gradient(farthest-side,transparent calc(100% - 3px),#000 calc(100% - 2px));-webkit-mask-image:radial-gradient(farthest-side,transparent calc(100% - 3px),#000 calc(100% - 2px))'
RING_THICK = 'mask-image:radial-gradient(farthest-side,transparent calc(100% - 5px),#000 calc(100% - 4px));-webkit-mask-image:radial-gradient(farthest-side,transparent calc(100% - 5px),#000 calc(100% - 4px))'
lens = f'''<!-- Right: 3D shining lens rings -->
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
                  <div class="absolute inset-0 rounded-full animate-spin [animation-duration:11s]" style="background:conic-gradient(from 0deg,transparent 0deg,rgba(255,255,255,0.95) 18deg,#5ee6f2 40deg,transparent 95deg,transparent 200deg,rgba(94,230,242,0.8) 235deg,transparent 280deg);{RING_THICK};filter:drop-shadow(0 0 8px rgba(94,230,242,0.9))"></div>
                  <div class="absolute inset-[4.5%] rounded-full animate-spin [animation-duration:17s] [animation-direction:reverse]" style="background:conic-gradient(from 90deg,transparent 0deg,rgba(255,255,255,0.8) 14deg,#3aa0db 38deg,transparent 80deg,transparent 220deg,rgba(58,160,219,0.9) 260deg,transparent 300deg);{RING};filter:drop-shadow(0 0 6px rgba(58,160,219,0.9))"></div>
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
                '''
s = s[:a] + lens.replace('{', '{{').replace('}', '}}') + s[b:]

# 5. pill badge: neon double border
s = s.replace('shadow-[0_0_22px_rgba(94,230,242,0.3),inset_0_0_0_3px_rgba(94,230,242,0.06)]',
              'shadow-[0_0_26px_rgba(94,230,242,0.45),inset_0_0_0_3px_rgba(94,230,242,0.08),inset_0_1px_0_rgba(255,255,255,0.25)]')
open(p, 'w', encoding='utf-8').write(s)
print('patched')
