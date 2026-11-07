p = 'scratch/redesign_what_we_do_v3.py'
s = open(p, encoding='utf-8').read()

def rep(a, b, count=None):
    global s
    assert a in s, a[:60]
    s = s.replace(a, b) if count is None else s.replace(a, b, count)

# palette: deep navy glass like the rest of the site
rep('border border-white/20 hover:border-[#72c5f8]/60 bg-gradient-to-b from-white/[0.10] to-white/[0.03] backdrop-blur-xl',
    'border border-sky/25 hover:border-sky/60 bg-[#071530]/85 backdrop-blur-xl')
rep('shadow-[0_0_30px_rgba(58,160,219,0.22),0_10px_30px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.18)]',
    'shadow-[0_0_22px_rgba(58,160,219,0.12),0_10px_30px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(58,160,219,0.18)]')
rep('hover:shadow-[0_0_44px_rgba(114,197,248,0.38),0_14px_36px_rgba(0,0,0,0.4)]',
    'hover:shadow-[0_0_34px_rgba(58,160,219,0.3),0_14px_36px_rgba(0,0,0,0.5)]')
rep('inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent',
    'inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-sky/60 to-transparent')
rep('via-[#72c5f8] to-transparent shadow-[0_0_14px_rgba(114,197,248,0.9)]', 'via-sky/80 to-transparent shadow-[0_0_10px_rgba(58,160,219,0.7)]')
rep('bg-[#0a1d40]/60 backdrop-blur px-2 py-0.5 rounded-md border border-white/25', 'bg-[#071530]/75 backdrop-blur px-2 py-0.5 rounded-md border border-sky/30')
rep('bg-[#0a1d40]/70 border border-[#72c5f8]/50 backdrop-blur shadow-[0_0_14px_rgba(114,197,248,0.3)]', 'bg-[#071530]/80 border border-sky/40 backdrop-blur')
rep('bg-white/10 group-hover:bg-white/15 border border-white/25 group-hover:border-[#72c5f8]/60 text-xs', 'bg-sky/10 group-hover:bg-sky/20 border border-sky/30 group-hover:border-sky/60 text-xs')
rep('py-1.5 rounded-full bg-sky/10 group-hover', 'py-1 rounded-full bg-sky/10 group-hover')
rep('from-[#071530]/80 via-transparent to-transparent', 'from-[#071530]/70 via-transparent to-transparent')

# remove the extra light glow blobs on this slide (they washed the navy out)
import re
s = re.sub(r'\s*<div class="pointer-events-none absolute -left-20 top-1/4 h-\[32rem\][^\n]*</div>\n\s*<div class="pointer-events-none absolute right-0 top-1/3 h-\[36rem\][^\n]*</div>\n', '\n', s, count=1)

# resize: smaller type + tighter spacing so everything fits
rep('text-[clamp(1.8rem,6.2vh,3.8rem)]', 'text-[clamp(1.5rem,5vh,3rem)]')
rep('text-[clamp(0.7rem,1.9vh,1.1rem)]">Clinical distribution', 'text-[clamp(0.65rem,1.6vh,0.95rem)]">Clinical distribution')
rep('text-[clamp(0.9rem,2.5vh,1.45rem)]', 'text-[clamp(0.8rem,2.1vh,1.2rem)]')
rep('flex-1 min-h-[440px]">', 'flex-1 min-h-[340px]">')
rep('flex flex-col gap-[clamp(0.5rem,1.6vh,1.1rem)]', 'flex flex-col gap-[clamp(0.4rem,1.2vh,0.9rem)]')
rep('gap-[clamp(0.6rem,1.8vh,1.2rem)] flex-1 min-h-0', 'gap-[clamp(0.5rem,1.4vh,1rem)] flex-1 min-h-0')
rep('px-6 sm:px-10 lg:px-14 pt-[76px] pb-4 overflow-y-auto', 'px-6 sm:px-10 lg:px-20 pt-[72px] pb-3 overflow-y-auto')
rep('w-full max-w-[1700px] mx-auto', 'w-full max-w-[1500px] mx-auto')
open(p, 'w', encoding='utf-8').write(s)
print('patched')

