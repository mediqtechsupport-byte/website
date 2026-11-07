const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Target to replace in #about
const targetLensBlock = `          <!-- Right Column: 3D Glowing Bionic Lens Visual -->
          <div class="relative flex justify-center items-center">
            <div class="relative w-full max-w-md lg:max-w-lg flex items-center justify-center">
              <div class="absolute inset-0 bg-radial from-sky/35 via-sky/10 to-transparent rounded-full blur-2xl transform scale-125 pointer-events-none"></div>
              <img src="assets/img/about-bionic-lens.png" 
                   alt="Rayner Advanced Intraocular Lens Precision" 
                   class="relative w-full max-w-[380px] lg:max-w-[480px] object-contain drop-shadow-[0_25px_60px_rgba(58,160,219,0.5)] animate-float" 
                   loading="eager" />
            </div>
          </div>`;

const replacementGlobeBlock = `          <!-- Right Column: Interactive 3D Globe with Philippines Map & Running Human -->
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

if (!html.includes(targetLensBlock)) {
  console.error('Target lens block not found in index.html!');
  process.exit(1);
}

html = html.replace(targetLensBlock, replacementGlobeBlock);
console.log('Replaced lens with 3D Globe block in #about');

// Add scripts before </body> if not already present
const scriptsToAdd = `  <script src="assets/js/GLTFLoader.js"></script>
  <script src="assets/js/about-globe-runner.js?v=1.00" defer></script>`;

if (!html.includes('about-globe-runner.js')) {
  const targetScript = '<script src="assets/js/main.js';
  html = html.replace(targetScript, `${scriptsToAdd}\n  ${targetScript}`);
  console.log('Added GLTFLoader.js and about-globe-runner.js script tags');
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('index.html successfully updated!');

