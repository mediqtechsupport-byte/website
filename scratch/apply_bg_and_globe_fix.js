const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Remove the lens shape from about background
const oldBgBlock = `          <!-- Luminous Photon Light Waves Background -->
          <div class="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <img src="assets/img/hero-photon-lines-transparent.png" 
                 alt="" 
                 aria-hidden="true" 
                 class="absolute inset-0 size-full object-cover object-center opacity-85 mix-blend-screen" />
            <div class="absolute -left-20 top-1/4 h-[38rem] w-[38rem] rounded-full bg-sky/20 blur-[160px]"></div>
            <div class="absolute right-0 top-1/3 h-[42rem] w-[42rem] rounded-full bg-[#18458a]/30 blur-[180px]"></div>
          </div>`;

const newBgBlock = `          <!-- Ambient Medical Navy Background (Blends seamlessly with Hero page) -->
          <div class="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-[#0a1d40]">
            <div class="absolute -left-20 top-1/4 h-[38rem] w-[38rem] rounded-full bg-sky/12 blur-[160px]"></div>
            <div class="absolute right-0 top-1/3 h-[42rem] w-[42rem] rounded-full bg-[#11326c]/35 blur-[180px]"></div>
          </div>`;

if (html.includes(oldBgBlock)) {
  html = html.replace(oldBgBlock, newBgBlock);
  console.log('Removed lens shape image from about background and replaced with seamless navy glow!');
} else {
  console.log('Old bg block not found directly, checking partial');
  html = html.replace(/<img[^>]*hero-photon-lines-transparent\.png[^>]*>/g, '');
  console.log('Stripped any remaining hero-photon-lines-transparent.png');
}

// 2. Also ensure #about section class has bg-[#0a1d40]
html = html.replace(
  '<section id="about" aria-labelledby="about-title" class="page-snap-section page-transition-section relative isolate w-full h-[100svh] min-h-[100svh] max-h-[100svh] overflow-hidden bg-[#061329] scroll-mt-0">',
  '<section id="about" aria-labelledby="about-title" class="page-snap-section page-transition-section relative isolate w-full h-[100svh] min-h-[100svh] max-h-[100svh] overflow-hidden bg-[#0a1d40] scroll-mt-0">'
);

// 3. Update right column globe container with bottom cloud bank blend
const targetGlobeCol = `              <!-- Right Column: Interactive 3D Globe with Philippines Map & Running Human -->
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
              </div>`;

const newGlobeCol = `              <!-- Right Column: Orbit Delivery 3D World & Running Courier -->
              <div class="relative flex justify-center items-center w-full">
                <div id="about-globe-container" class="relative w-full max-w-xl h-[520px] sm:h-[580px] lg:h-[640px] flex items-center justify-center select-none cursor-grab active:cursor-grabbing">
                  <!-- Ambient Soft Medical Halo -->
                  <div class="absolute inset-0 bg-radial from-sky/20 via-sky/5 to-transparent rounded-full blur-3xl transform scale-125 pointer-events-none -z-10"></div>

                  <!-- Interactive 3D World Canvas -->
                  <div id="about-globe-canvas-wrapper" class="relative w-full h-full flex items-center justify-center"></div>

                  <!-- Soft Bottom Cloud Bank / Ambient Base Fog -->
                  <div class="pointer-events-none absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-[#0a1d40] via-[#0a1d40]/75 to-transparent z-10"></div>
                </div>
              </div>`;

if (html.includes(targetGlobeCol)) {
  html = html.replace(targetGlobeCol, newGlobeCol);
  console.log('Updated globe container with seamless bottom fog blend!');
}

// 4. Update script version tags
html = html.replace(/about-globe-runner\.js\?v=[0-9\.]+/g, 'about-globe-runner.js?v=2.00');
html = html.replace(/main\.js\?v=[0-9\.]+/g, 'main.js?v=332.00');

fs.writeFileSync('index.html', html, 'utf8');
console.log('index.html successfully updated!');

