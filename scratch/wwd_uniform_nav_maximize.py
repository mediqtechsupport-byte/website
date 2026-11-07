from pathlib import Path

p = Path("scratch/apply_wwd_editorial.py")
s = p.read_text(encoding="utf-8")

old_nav_start = s.index("            <!-- Slide navigation (Who We Are / Our Foundation) -->")
old_nav_end = s.index("            <!-- Header -->")
new_nav = '''            <!-- Header -->'''
s = s[:old_nav_start] + s[old_nav_end:].replace("            <!-- Header -->", "", 1)
s = s.replace(
    '<div class="relative z-20 w-full max-w-[1680px] mx-auto h-full flex flex-col">',
    '''<!-- Pill navigation: identical position & style to the other About slides -->
          <div class="absolute top-[76px] left-0 right-0 z-30 px-6 sm:px-10 lg:px-16 flex items-center justify-between gap-3 pointer-events-none">
            <button type="button" onclick="if(window.goToAboutSlide){{window.goToAboutSlide(1);}}" class="pointer-events-auto inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-cream/90 hover:text-white transition-all cursor-pointer backdrop-blur-md"><svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m15 18-6-6 6-6"/></svg><span>Who We Are</span></button>
            <button type="button" onclick="if(window.goToAboutSlide){{window.goToAboutSlide(3);}}" class="pointer-events-auto inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-cream/90 hover:text-white transition-all cursor-pointer backdrop-blur-md"><span>Our Foundation</span><svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m9 18 6-6-6-6"/></svg></button>
          </div>

          <div class="relative z-20 w-full h-full flex flex-col">

            <!-- Header -->''', 1)

reps = [
    # same origin/size as other slides (inset-0), content starts below the pill nav, edge padding matches nav
    ('class="about-slide absolute top-0 left-0 right-0 w-full h-[calc(100svh-4.5rem)] flex flex-col text-cream px-4 sm:px-6 lg:px-10 pt-6 pb-5 overflow-y-auto lg:overflow-hidden',
     'class="about-slide absolute top-0 left-0 right-0 w-full h-[calc(100svh-4.5rem)] flex flex-col text-cream px-6 sm:px-10 lg:px-16 pt-[120px] pb-6 overflow-y-auto lg:overflow-hidden'),
    # headline on one line on wide screens
    ('<div class="shrink-0 mb-5 lg:mb-7">', '<div class="shrink-0 mb-4 lg:mb-6">'),
    ('class="text-[32px] sm:text-[44px] lg:text-[52px] 2xl:text-[60px] font-semibold tracking-[-0.025em] leading-[1.04] text-white max-w-[1050px]"',
     'class="text-[30px] sm:text-[40px] lg:text-[44px] 2xl:text-[56px] font-semibold tracking-[-0.025em] leading-[1.05] text-white"'),
    ('<p id="wwd-subtext" class="mt-3 text-[13px] sm:text-[15px] text-[#b8c6dc] leading-relaxed max-w-[560px]">',
     '<p id="wwd-subtext" class="mt-2 text-[13px] sm:text-[15px] text-[#b8c6dc] leading-relaxed max-w-[820px]">'),
    # columns
    ('lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] gap-6 lg:gap-14 flex-1 min-h-0',
     'lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] gap-6 lg:gap-16 flex-1 min-h-0'),
    ('min-h-0 lg:h-full lg:max-w-[360px]">', 'min-h-0 lg:h-full lg:max-w-[440px]">'),
    # bigger stat + visual fills stage
    ('class="text-[64px] sm:text-[88px] xl:text-[112px] font-extrabold', 'class="text-[64px] sm:text-[96px] xl:text-[128px] font-extrabold'),
    ('<p id="wwd-stage-desc" class="mt-5 text-[14px]', '<p id="wwd-stage-desc" class="mt-4 text-[14px]'),
    ('<div id="wwd-stage-visual-wrap" class="relative flex-1 min-h-[200px] my-4 lg:mr-[12%]">',
     '<div id="wwd-stage-visual-wrap" class="relative flex-1 min-h-[220px] my-3">'),
]
for a, b in reps:
    if a not in s:
        raise SystemExit("missing: " + a[:80])
    s = s.replace(a, b)

# remove Pause button
ps = s.index('                    <button type="button" id="wwd-pause-btn"')
pe = s.index("</button>", ps) + len("</button>\n")
s = s[:ps] + s[pe:]

p.write_text(s, encoding="utf-8")
print("generator patched")

