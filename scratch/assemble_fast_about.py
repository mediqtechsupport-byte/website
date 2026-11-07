import re

# 1. Slide 0: Purpose (Exact match to user video frame_0000.jpg)
slide0_html = '''        <!-- ========================================================================= -->
        <!-- SLIDE 1: PURPOSE (Global Healthcare Innovation & Philippines Map)         -->
        <!-- ========================================================================= -->
        <div class="about-slide absolute inset-0 w-full h-full flex items-center overflow-y-auto lg:overflow-hidden transition-all duration-500 ease-out opacity-100 pointer-events-auto translate-x-0 z-10" data-index="0">
          
          <!-- Full-Bleed Panoramic World Route Blueprint Map across Background -->
          <div id="about-interactive-stage" class="absolute inset-0 w-full h-full pointer-events-auto z-[2] overflow-hidden">
            <!-- Atmospheric Volumetric Glow -->
            <div class="absolute inset-0 bg-radial from-sky/15 via-[#11326c]/20 to-transparent rounded-full blur-3xl transform scale-125 pointer-events-none -z-10"></div>
          </div>

          <div class="ih-shell relative z-10 w-full pointer-events-none">
            <div class="ih-hero">
              
              <!-- Left Copy Column (Positioned and styled exactly as shown in user video) -->
              <div class="ih-hero-copy pointer-events-auto max-w-2xl relative z-20">
                
                <!-- Eyebrow Tag -->
                <p class="ih-eyebrow">
                  <span>ABOUT MEDIQ &nbsp;&bull;&nbsp; OUR PURPOSE</span>
                  <span class="inline-block h-0.5 bg-sky/50 w-12 ml-1"></span>
                </p>

                <!-- Main Headline -->
                <h2 id="about-title" class="ih-h1">
                  <span class="ih-h1-line">Connecting Global</span>
                  <span class="ih-h1-line">Healthcare Innovation</span>
                  <span class="ih-h1-line">with the Philippines</span>
                </h2>

                <!-- Lede Description -->
                <p class="ih-lede">
                  Medical solutions, product marketing, commercialization, and dependable distribution for a stronger healthcare system.
                </p>

                <!-- Action Button: Path to Mission & Vision (Slide 1) -->
                <div class="mt-8">
                  <button type="button" onclick="if(window.goToAboutSlide){window.goToAboutSlide(1);}" class="about-go-next inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-sky text-[#0a1d40] text-sm font-bold tracking-wide shadow-[0_0_25px_rgba(58,160,219,0.35)] hover:bg-[#72c5f8] hover:scale-105 active:scale-95 transition-all cursor-pointer">
                    <span>Explore Profile &amp; Mission</span>
                    <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m9 18 6-6-6-6"/></svg>
                  </button>
                </div>

              </div>

              <!-- Right Column: Expansive Open Space for the Panoramic Global Map -->
              <div class="hidden lg:block pointer-events-none"></div>

            </div>
          </div>

        </div>'''

# 2. Slide 1: Who We Are & Vision/Mission
with open('scratch/new_slide1_bigger.html', 'r', encoding='utf-8') as f:
    slide1_html = f.read().strip()

# 3. Slide 2: What We Do (Stacking Cards)
with open('scratch/restore_scroll_stacking.py', 'r', encoding='utf-8') as f:
    s2_code = f.read()
    s2_start = s2_code.find("new_slide_2 = '''") + len("new_slide_2 = '''")
    s2_end = s2_code.find("'''", s2_start)
    slide2_html = s2_code[s2_start:s2_end].strip()

# 4. Slides 3 & 4: Foundation and Values
with open('scratch/new_deck_slides.html', 'r', encoding='utf-8') as f:
    deck = f.read()
    s4_start = deck.find('<!-- SLIDE 4: OUR ESTABLISHED FOUNDATION')
    divider_s4 = deck.rfind('<!-- ===', 0, s4_start)
    if divider_s4 != -1:
        s4_start = divider_s4
    slides_3_and_4 = deck[s4_start:].strip()

# Assemble full #about section
about_header = '''    <!-- ============== ABOUT MEDIQ / HERITAGE & COMPLETE CORPORATE SHOWCASE (5-PAGE DECK) ============== -->
    <section id="about" aria-labelledby="about-title" class="page-snap-section page-transition-section relative isolate w-full h-[100svh] min-h-[100svh] max-h-[100svh] overflow-hidden bg-[#0a1d40] scroll-mt-0">

      <!-- Persistent Ambient Medical Navy Background with Organic Fluid Smoke & Silk Waves Shader across ALL Deck Slides -->
      <div class="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-[#0a1d40]">
        <!-- 1. Active Moving Silk Waves Shader Background in Calm MediQ Navy Palette -->
        <canvas id="about-waves-shader-canvas" class="pointer-events-none absolute inset-0 z-0 block size-full opacity-70" aria-hidden="true"></canvas>

        <!-- 2. Active Drifting Organic Fluid Smoke Canvas (Uniform with Hero Page) -->
        <canvas id="about-smoke-canvas" class="pointer-events-none absolute inset-0 z-[1] block size-full opacity-75" aria-hidden="true"></canvas>

        <div class="absolute -left-20 top-1/4 h-[38rem] w-[38rem] rounded-full bg-sky/15 blur-[160px]"></div>
        <div class="absolute right-0 top-1/3 h-[42rem] w-[42rem] rounded-full bg-[#11326c]/45 blur-[180px]"></div>
        <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(#3aa0db_1px,transparent_1px)] [background-size:24px_24px] opacity-15"></div>
      </div>
      
      <!-- Sleek Floating Arrow Navigation for Rest of Pages (Hidden on Purpose Slide 0) -->
      <div id="about-deck-nav" class="absolute top-20 right-6 sm:top-24 sm:right-10 z-40 flex items-center gap-2 opacity-0 pointer-events-none scale-90 transition-all duration-300">
        <button type="button" id="about-deck-prev" class="size-9 rounded-full bg-[#0a1d40]/80 hover:bg-sky text-white hover:text-[#0a1d40] border border-sky/30 hover:border-sky backdrop-blur-md flex items-center justify-center transition-all shadow-[0_4px_16px_rgba(0,0,0,0.4)] active:scale-95 disabled:opacity-20 disabled:pointer-events-none cursor-pointer" aria-label="Previous Slide">
          <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m15 18-6-6 6-6"/></svg>
        </button>

        <button type="button" id="about-deck-next" class="size-9 rounded-full bg-[#0a1d40]/80 hover:bg-sky text-white hover:text-[#0a1d40] border border-sky/30 hover:border-sky backdrop-blur-md flex items-center justify-center transition-all shadow-[0_4px_16px_rgba(0,0,0,0.4)] active:scale-95 disabled:opacity-20 disabled:pointer-events-none cursor-pointer" aria-label="Next Slide">
          <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m9 18 6-6-6-6"/></svg>
        </button>
      </div>

      <!-- Main Slides Container (100% Viewport, Seamless with Fixed Navbar) -->
      <div class="relative w-full h-full overflow-hidden">
'''

about_footer = '''
      </div>

    </section>
'''

full_about = about_header + slide0_html + "\n\n" + slide1_html + "\n\n" + slide2_html + "\n\n" + slides_3_and_4 + about_footer

with open('scratch/built_orig_about.html', 'w', encoding='utf-8') as f:
    f.write(full_about)

print(f"Successfully generated scratch/built_orig_about.html ({len(full_about)} bytes, {len(full_about.splitlines())} lines)!")

