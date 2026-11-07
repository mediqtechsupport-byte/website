const fs = require('fs');

const deckRaw = fs.readFileSync('scratch/full_about_deck.html', 'utf8');

// We need Slide 0 to have:
// 1. Text aligned with Hero (ih-shell, ih-hero, ih-hero-copy, ih-eyebrow, ih-h1, ih-lede)
// 2. Button: Explore Profile & Mission with .about-go-next
// 3. Right side: 3D Globe with Philippines Map & Running Human (#about-globe-container, #about-globe-canvas-wrapper)

const slide0Html = `        <!-- ========================================================================= -->
        <!-- SLIDE 1: PURPOSE (Deep MedTech Navy + 3D Globe with Philippines Map & Courier) -->
        <!-- ========================================================================= -->
        <div class="about-slide absolute inset-0 w-full h-full flex items-center overflow-y-auto lg:overflow-hidden transition-all duration-500 ease-out opacity-100 translate-x-0 z-10" data-index="0">
          
          <!-- Luminous Photon Light Waves Background -->
          <div class="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <img src="assets/img/hero-photon-lines-transparent.png" 
                 alt="" 
                 aria-hidden="true" 
                 class="absolute inset-0 size-full object-cover object-center opacity-85 mix-blend-screen" />
            <div class="absolute -left-20 top-1/4 h-[38rem] w-[38rem] rounded-full bg-sky/20 blur-[160px]"></div>
            <div class="absolute right-0 top-1/3 h-[42rem] w-[42rem] rounded-full bg-[#18458a]/30 blur-[180px]"></div>
          </div>

          <div class="ih-shell relative z-10 w-full">
            <div class="ih-hero">
              
              <!-- Left Copy Column (Aligned EXACTLY with Hero Page text position) -->
              <div class="ih-hero-copy">
                
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
                  <button type="button" class="about-go-next inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-sky text-[#0a1d40] text-sm font-bold tracking-wide shadow-[0_0_25px_rgba(58,160,219,0.35)] hover:bg-[#72c5f8] hover:scale-105 transition-all cursor-pointer">
                    <span>Explore Profile &amp; Mission</span>
                    <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m9 18 6-6-6-6"/></svg>
                  </button>
                </div>

              </div>

              <!-- Right Column: Interactive 3D Globe with Philippines Map & Running Human -->
              <div class="relative flex justify-center items-center w-full">
                <div id="about-globe-container" class="relative w-full max-w-xl h-[480px] sm:h-[540px] lg:h-[620px] flex items-center justify-center select-none cursor-grab active:cursor-grabbing">
                  <!-- Radial Backing Ambience -->
                  <div class="absolute inset-0 bg-radial from-sky/30 via-sky/10 to-transparent rounded-full blur-3xl transform scale-110 pointer-events-none -z-10"></div>

                  <!-- Interactive Three.js 3D Globe Canvas Mount -->
                  <div id="about-globe-canvas-wrapper" class="relative w-full h-full flex items-center justify-center"></div>

                  <!-- Micro Info Pill: Philippines Distribution Network -->
                  <div class="absolute bottom-3 right-4 pointer-events-none flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#071938]/90 border border-sky/30 backdrop-blur-md text-[11px] text-sky-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
                    <span class="size-2 rounded-full bg-[#00e5ff] animate-pulse"></span>
                    <span class="tracking-wider uppercase font-semibold text-[10px]">Philippines Network &bull; Active Coverage</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>`;

// Now extract Slides 1 to 4 and controller from deckRaw:
const s1Marker = '<!-- ========================================================================= -->\n        <!-- SLIDE 2: WHO WE ARE';
const s1Idx = deckRaw.indexOf(s1Marker);
const restOfDeck = deckRaw.slice(s1Idx);

const completeAboutHtml = `    <!-- ============== ABOUT MEDIQ / HERITAGE & COMPLETE CORPORATE SHOWCASE (5-PAGE DECK) ============== -->
    <section id="about" aria-labelledby="about-title" class="page-snap-section page-transition-section relative isolate w-full h-[100svh] min-h-[100svh] max-h-[100svh] overflow-hidden bg-[#061329] scroll-mt-0">
      
      <!-- Main Slides Container (100% Viewport, Seamless with Fixed Navbar) -->
      <div class="relative w-full h-full overflow-hidden">
${slide0Html}

        ${restOfDeck}`;

fs.writeFileSync('scratch/assembled_about.html', completeAboutHtml);
console.log('Successfully assembled complete About Deck! Size:', completeAboutHtml.length);

