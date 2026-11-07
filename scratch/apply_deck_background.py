import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Target the ambient background inside Slide 0
old_bg_slide0 = '''          <!-- Ambient Medical Navy Background with Organic Fluid Smoke Canvas (Identical to Hero Page) -->
          <div class="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-[#0a1d40]">
            <!-- 1. Active Moving Silk Waves Shader Background (waves-background-2) in Calm MediQ Navy Palette -->
            <canvas id="about-waves-shader-canvas" class="pointer-events-none absolute inset-0 z-0 block size-full opacity-70" aria-hidden="true"></canvas>

            <!-- 2. Active Drifting Organic Fluid Smoke Canvas (Uniform with Hero Page) -->
            <canvas id="about-smoke-canvas" class="pointer-events-none absolute inset-0 z-[1] block size-full opacity-75" aria-hidden="true"></canvas>

            <div class="absolute -left-20 top-1/4 h-[38rem] w-[38rem] rounded-full bg-sky/15 blur-[160px]"></div>
            <div class="absolute right-0 top-1/3 h-[42rem] w-[42rem] rounded-full bg-[#11326c]/45 blur-[180px]"></div>
          </div>'''

# We will place this background right at the top of <section id="about" ...> so it is persistent across ALL deck slides!
persistent_bg = '''      <!-- Persistent Ambient Medical Navy Background with Organic Fluid Smoke & Silk Waves Shader across ALL Deck Slides -->
      <div class="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-[#0a1d40]">
        <!-- 1. Active Moving Silk Waves Shader Background (waves-background-2) in Calm MediQ Navy Palette -->
        <canvas id="about-waves-shader-canvas" class="pointer-events-none absolute inset-0 z-0 block size-full opacity-70" aria-hidden="true"></canvas>

        <!-- 2. Active Drifting Organic Fluid Smoke Canvas (Uniform with Hero Page) -->
        <canvas id="about-smoke-canvas" class="pointer-events-none absolute inset-0 z-[1] block size-full opacity-75" aria-hidden="true"></canvas>

        <div class="absolute -left-20 top-1/4 h-[38rem] w-[38rem] rounded-full bg-sky/15 blur-[160px]"></div>
        <div class="absolute right-0 top-1/3 h-[42rem] w-[42rem] rounded-full bg-[#11326c]/45 blur-[180px]"></div>
      </div>'''

# In section #about:
about_tag = '<section id="about" aria-labelledby="about-title" class="page-snap-section page-transition-section relative isolate w-full h-[100svh] min-h-[100svh] max-h-[100svh] overflow-hidden bg-[#0a1d40] scroll-mt-0">'

if old_bg_slide0 in html:
    # Remove from slide 0
    html = html.replace(old_bg_slide0, '')
    # Insert right after about_tag
    html = html.replace(about_tag, about_tag + '\n\n' + persistent_bg)
    print("Persistent background moved to section #about successfully!")
else:
    print("Warning: old_bg_slide0 not matched exactly, checking regex...")

# 2. Update Slide 1 background and add subtle Blueprint Dot Grid & Optical Curvature Rings
slide1_header_old = '<div class="about-slide absolute inset-0 w-full h-full flex items-center justify-center bg-[#0a1d40] text-cream px-6 sm:px-10 lg:px-14 pt-16 sm:pt-20 pb-8 overflow-y-auto transition-all duration-500 ease-out opacity-0 pointer-events-none translate-x-12 z-0" data-index="1">'
slide1_header_new = '''<div class="about-slide absolute inset-0 w-full h-full flex items-center justify-center bg-transparent text-cream px-6 sm:px-10 lg:px-14 pt-16 sm:pt-20 pb-8 overflow-y-auto transition-all duration-500 ease-out opacity-0 pointer-events-none translate-x-12 z-0" data-index="1">
          
          <!-- Subtle Technical Blueprint Dot Grid (matches card crosshairs & technical blueprint design) -->
          <div class="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(rgba(114,197,248,0.22)_1px,transparent_1px)] [background-size:28px_28px] opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_85%)]"></div>

          <!-- Luminous Concentric Optical Curvature Rings (RayOne Precision Optics Motif) -->
          <div class="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[680px] lg:size-[860px] rounded-full border border-sky/15 opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_80%)]"></div>
          <div class="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[980px] lg:size-[1180px] rounded-full border border-dashed border-sky/10 opacity-25"></div>
          <div class="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[420px] rounded-full bg-sky/10 blur-[130px]"></div>'''

if slide1_header_old in html:
    html = html.replace(slide1_header_old, slide1_header_new)
    print("Slide 1 background and blueprint motifs added successfully!")
else:
    print("Warning: slide1_header_old not matched exactly.")

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

