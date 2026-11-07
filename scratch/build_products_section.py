import sys

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

start_marker = '<section id="optical-studio"'
end_marker = '<section id="galaxy-delivery"'

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx == -1 or end_idx == -1:
    print(f"Error finding markers: start={start_idx}, end={end_idx}")
    sys.exit(1)

products_section = '''<section id="products" aria-labelledby="products-title" class="page-snap-section page-transition-section relative isolate w-full min-h-[100svh] flex flex-col justify-center items-center overflow-hidden bg-[#07132b] py-20 px-4 sm:px-8 lg:px-12 scroll-mt-0">

      <!-- Ambient Background Glows & Blueprint Dot Grid -->
      <div class="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-[#07132b]">
        <div class="absolute -left-20 top-1/4 h-[38rem] w-[38rem] rounded-full bg-sky/15 blur-[160px]"></div>
        <div class="absolute right-0 top-1/3 h-[42rem] w-[42rem] rounded-full bg-[#11326c]/45 blur-[180px]"></div>
        <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(#3aa0db_1px,transparent_1px)] [background-size:24px_24px] opacity-15"></div>
      </div>

      <!-- Main Container: Centered Header & 3-Card Product Grid -->
      <div class="relative z-10 w-full max-w-7xl mx-auto my-auto flex flex-col items-center">

        <!-- Section Header -->
        <div class="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <p class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky/10 border border-sky/30 text-sky text-[11px] font-bold tracking-widest uppercase mb-3">
            <span>OPHTHALMIC INNOVATIONS &bull; PRODUCT PORTFOLIO</span>
            <span class="inline-block size-1.5 rounded-full bg-sky animate-pulse"></span>
          </p>
          <h2 id="products-title" class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-2.5">
            Pioneering Optical &amp; Surgical <span class="text-transparent bg-clip-text bg-gradient-to-r from-sky via-[#72c5f8] to-white">Solutions</span>
          </h2>
          <p class="text-xs sm:text-sm lg:text-base text-cream/75 leading-relaxed max-w-2xl mx-auto">
            Distributing Rayner's world-leading intraocular lenses, ophthalmic viscoelastics, and single-use preloaded injector systems across the Philippines.
          </p>
        </div>

        <!-- 3 Featured Product Cards (21st.dev Style Matching About Page) -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 w-full">

          <!-- PRODUCT CARD 1: INTRAOCULAR LENSES -->
          <div class="group relative rounded-[28px] sm:rounded-[32px] bg-[#071530]/90 border border-sky/25 p-3.5 pb-7 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-sky/50 hover:-translate-y-2 flex flex-col justify-between cursor-pointer ring-1 ring-white/5" onclick="openProductOverlay('iols')">
            <div>
              <!-- Top Image Container with Inverted Cutout -->
              <div class="relative w-full aspect-[4/3] rounded-[22px] sm:rounded-[24px] overflow-hidden bg-black/40">
                <img src="assets/img/hero-products.jpg" alt="RayOne Intraocular Lenses Portfolio" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 select-none">
                
                <div class="absolute top-3.5 right-3.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[11px] font-mono font-bold text-white tracking-wider">
                  FLAGSHIP IOL
                </div>

                <!-- Signature Inverted Cutout Notch -->
                <div class="card-cutout-notch"></div>

                <!-- Circular Action Arrow Button -->
                <button type="button" aria-label="Explore RayOne Intraocular Lenses" class="absolute bottom-1.5 right-1.5 size-13 rounded-full bg-[#0d2247] border border-sky/35 text-sky group-hover:bg-sky group-hover:text-[#071530] flex items-center justify-center transition-all duration-300 shadow-xl cursor-pointer z-10">
                  <svg class="size-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.3" d="M7 17L17 7M17 7H9M17 7V15" />
                  </svg>
                </button>
              </div>

              <!-- Content -->
              <div class="px-3 pt-5">
                <h3 class="text-2xl font-extrabold text-white tracking-tight mb-2 group-hover:text-sky transition-colors">
                  RayOne&reg; Intraocular Lenses
                </h3>
                <p class="text-sm text-cream/75 leading-relaxed line-clamp-3">
                  Non-diffractive spiral AI intraocular lenses providing continuous full-range vision from distance to near with 100% light transmission.
                </p>
              </div>
            </div>

            <!-- Bottom Tags -->
            <div class="px-3 pt-5 flex flex-wrap gap-2">
              <span class="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono font-bold tracking-wider uppercase text-sky/90">SPIRAL OPTICS</span>
              <span class="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono font-bold tracking-wider uppercase text-sky/90">NON-DIFFRACTIVE</span>
              <span class="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono font-bold tracking-wider uppercase text-sky/90">PRELOADED</span>
            </div>
          </div>

          <!-- PRODUCT CARD 2: VISCOSURGICAL DEVICES -->
          <div class="group relative rounded-[28px] sm:rounded-[32px] bg-[#071530]/90 border border-sky/25 p-3.5 pb-7 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-sky/50 hover:-translate-y-2 flex flex-col justify-between cursor-pointer ring-1 ring-white/5" onclick="openProductOverlay('ovds')">
            <div>
              <!-- Top Image Container with Inverted Cutout -->
              <div class="relative w-full aspect-[4/3] rounded-[22px] sm:rounded-[24px] overflow-hidden bg-black/40">
                <img src="assets/img/pillars/p5_microscope_education.jpg" alt="Ophteis Viscosurgical Devices" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 select-none">
                
                <div class="absolute top-3.5 right-3.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[11px] font-mono font-bold text-white tracking-wider">
                  ENDOTHELIAL CARE
                </div>

                <!-- Signature Inverted Cutout Notch -->
                <div class="card-cutout-notch"></div>

                <!-- Circular Action Arrow Button -->
                <button type="button" aria-label="Explore Ophteis Viscosurgical Devices" class="absolute bottom-1.5 right-1.5 size-13 rounded-full bg-[#0d2247] border border-sky/35 text-sky group-hover:bg-sky group-hover:text-[#071530] flex items-center justify-center transition-all duration-300 shadow-xl cursor-pointer z-10">
                  <svg class="size-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.3" d="M7 17L17 7M17 7H9M17 7V15" />
                  </svg>
                </button>
              </div>

              <!-- Content -->
              <div class="px-3 pt-5">
                <h3 class="text-2xl font-extrabold text-white tracking-tight mb-2 group-hover:text-sky transition-colors">
                  Ophteis&reg; Viscosurgical Systems
                </h3>
                <p class="text-sm text-cream/75 leading-relaxed line-clamp-3">
                  Ultra-pure pharmaceutical-grade sodium hyaluronate formulations providing endothelial cell protection and anterior chamber stability.
                </p>
              </div>
            </div>

            <!-- Bottom Tags -->
            <div class="px-3 pt-5 flex flex-wrap gap-2">
              <span class="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono font-bold tracking-wider uppercase text-sky/90">ZERO SHEAR</span>
              <span class="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono font-bold tracking-wider uppercase text-sky/90">CHAMBER STABILITY</span>
              <span class="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono font-bold tracking-wider uppercase text-sky/90">PURIFIED HA</span>
            </div>
          </div>

          <!-- PRODUCT CARD 3: PRELOADED INJECTORS & INSTRUMENTATION -->
          <div class="group relative rounded-[28px] sm:rounded-[32px] bg-[#071530]/90 border border-sky/25 p-3.5 pb-7 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-sky/50 hover:-translate-y-2 flex flex-col justify-between cursor-pointer ring-1 ring-white/5" onclick="openProductOverlay('injectors')">
            <div>
              <!-- Top Image Container with Inverted Cutout -->
              <div class="relative w-full aspect-[4/3] rounded-[22px] sm:rounded-[24px] overflow-hidden bg-black/40">
                <img src="assets/img/pillars/p6_quality_metrology.jpg" alt="RayOne Preloaded Injector Systems" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 select-none">
                
                <div class="absolute top-3.5 right-3.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[11px] font-mono font-bold text-white tracking-wider">
                  2.2MM SURGICAL
                </div>

                <!-- Signature Inverted Cutout Notch -->
                <div class="card-cutout-notch"></div>

                <!-- Circular Action Arrow Button -->
                <button type="button" aria-label="Explore RayOne Preloaded Injectors" class="absolute bottom-1.5 right-1.5 size-13 rounded-full bg-[#0d2247] border border-sky/35 text-sky group-hover:bg-sky group-hover:text-[#071530] flex items-center justify-center transition-all duration-300 shadow-xl cursor-pointer z-10">
                  <svg class="size-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.3" d="M7 17L17 7M17 7H9M17 7V15" />
                  </svg>
                </button>
              </div>

              <!-- Content -->
              <div class="px-3 pt-5">
                <h3 class="text-2xl font-extrabold text-white tracking-tight mb-2 group-hover:text-sky transition-colors">
                  RayOne&reg; Preloaded Injectors
                </h3>
                <p class="text-sm text-cream/75 leading-relaxed line-clamp-3">
                  True single-use preloaded injector systems engineered for 2.2mm sub-incision delivery with patented Lock &amp; Roll&trade; corneal deployment.
                </p>
              </div>
            </div>

            <!-- Bottom Tags -->
            <div class="px-3 pt-5 flex flex-wrap gap-2">
              <span class="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono font-bold tracking-wider uppercase text-sky/90">2.2MM INCISION</span>
              <span class="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono font-bold tracking-wider uppercase text-sky/90">LOCK &amp; ROLL</span>
              <span class="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono font-bold tracking-wider uppercase text-sky/90">STERILE DELIVERY</span>
            </div>
          </div>

        </div>

      </div>

      <!-- ========================================================================= -->
      <!-- PRODUCT OVERLAY 1: RAYONE IOLS DETAIL SHOWCASE                            -->
      <!-- ========================================================================= -->
      <div id="product-overlay-iols" class="fixed inset-0 z-[100] bg-[#050e1f]/95 backdrop-blur-2xl flex flex-col justify-between p-4 sm:p-6 lg:p-8 opacity-0 pointer-events-none transition-all duration-400 ease-out overflow-y-auto" role="dialog" aria-modal="true" aria-label="RayOne Intraocular Lenses">
        
        <div class="relative z-30 shrink-0 w-full max-w-5xl mx-auto flex items-center justify-between pb-3 border-b border-sky/20">
          <div>
            <p class="text-sky font-mono text-[11px] font-bold uppercase tracking-widest">PRODUCT SPOTLIGHT &bull; INTRAOCULAR LENSES</p>
            <h3 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">RayOne&reg; Intraocular Lens Portfolio</h3>
          </div>
          
          <button type="button" onclick="closeProductOverlay()" class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-sky text-cream hover:text-[#071530] text-xs font-bold tracking-wider uppercase transition-all duration-300 border border-white/15 hover:border-sky cursor-pointer shadow-lg">
            <span>Back to Products</span>
            <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div class="relative z-20 w-full max-w-5xl mx-auto my-auto py-6">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div class="lg:col-span-7">
              <span class="inline-block px-3 py-1 rounded-full bg-sky/15 text-sky font-mono text-xs font-bold uppercase mb-3 border border-sky/30">WORLD'S FIRST SPIRAL IOL</span>
              <h4 class="text-2xl sm:text-3xl font-extrabold text-white mb-3">RayOne&reg; Galaxy with Spiral AI Innovation</h4>
              <p class="text-sm sm:text-base text-cream/85 leading-relaxed mb-6">
                Engineered with an AI-optimized non-diffractive optical spiral, RayOne Galaxy delivers continuous visual clarity from reading distances to infinity without the photic disturbances common to diffractive rings.
              </p>

              <div class="grid grid-cols-2 gap-3.5 mb-6">
                <div class="p-4 rounded-2xl bg-[#071530]/85 border border-sky/25 backdrop-blur-xl">
                  <div class="text-sky font-bold text-base font-mono mb-1">100% Light</div>
                  <div class="text-xs text-cream/70">Continuous transmission without lost focal energy</div>
                </div>
                <div class="p-4 rounded-2xl bg-[#071530]/85 border border-sky/25 backdrop-blur-xl">
                  <div class="text-sky font-bold text-base font-mono mb-1">0% Dysphotopsia</div>
                  <div class="text-xs text-cream/70">Diffraction-free optics minimize halos and night glare</div>
                </div>
              </div>

              <div class="flex flex-wrap gap-3">
                <button type="button" onclick="closeProductOverlay(); document.getElementById('galaxy-delivery').scrollIntoView({behavior:'smooth'});" class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-sky text-[#071530] font-bold text-xs uppercase tracking-wider hover:bg-[#72c5f8] transition-all shadow-lg cursor-pointer">
                  <span>Launch 3D Surgical Simulation</span>
                  <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </button>
              </div>
            </div>

            <div class="lg:col-span-5 flex justify-center">
              <div class="relative size-72 sm:size-80 rounded-3xl border border-sky/30 bg-[#071530]/90 backdrop-blur-2xl p-6 flex items-center justify-center shadow-2xl overflow-hidden group">
                <img src="assets/img/hero-products.jpg" alt="RayOne Galaxy Spiral Optics" class="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500">
              </div>
            </div>

          </div>
        </div>

        <div class="text-center text-xs text-cream/50 py-2">
          Click &quot;Back to Products&quot; or press ESC to return
        </div>
      </div>

      <!-- ========================================================================= -->
      <!-- PRODUCT OVERLAY 2: OPHTEIS OVDS DETAIL SHOWCASE                           -->
      <!-- ========================================================================= -->
      <div id="product-overlay-ovds" class="fixed inset-0 z-[100] bg-[#050e1f]/95 backdrop-blur-2xl flex flex-col justify-between p-4 sm:p-6 lg:p-8 opacity-0 pointer-events-none transition-all duration-400 ease-out overflow-y-auto" role="dialog" aria-modal="true" aria-label="Ophteis Viscosurgical Devices">
        
        <div class="relative z-30 shrink-0 w-full max-w-5xl mx-auto flex items-center justify-between pb-3 border-b border-sky/20">
          <div>
            <p class="text-sky font-mono text-[11px] font-bold uppercase tracking-widest">PRODUCT SPOTLIGHT &bull; VISCOELASTICS</p>
            <h3 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Ophteis&reg; Viscosurgical Portfolio</h3>
          </div>
          
          <button type="button" onclick="closeProductOverlay()" class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-sky text-cream hover:text-[#071530] text-xs font-bold tracking-wider uppercase transition-all duration-300 border border-white/15 hover:border-sky cursor-pointer shadow-lg">
            <span>Back to Products</span>
            <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div class="relative z-20 w-full max-w-5xl mx-auto my-auto py-6">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div class="lg:col-span-7">
              <span class="inline-block px-3 py-1 rounded-full bg-emerald-400/15 text-emerald-300 font-mono text-xs font-bold uppercase mb-3 border border-emerald-400/30">ENDOTHELIAL INTEGRITY</span>
              <h4 class="text-2xl sm:text-3xl font-extrabold text-white mb-3">Ophteis&reg; Bio-Engineered Viscosurgical Solutions</h4>
              <p class="text-sm sm:text-base text-cream/85 leading-relaxed mb-6">
                Formulated with ultra-purified bio-fermented sodium hyaluronate, Ophteis provides superior endothelial cell coating, viscoelastic retention during phacoemulsification, and effortless aspiration.
              </p>

              <div class="grid grid-cols-2 gap-3.5 mb-6">
                <div class="p-4 rounded-2xl bg-[#071530]/85 border border-sky/25 backdrop-blur-xl">
                  <div class="text-sky font-bold text-base font-mono mb-1">Chamber Stability</div>
                  <div class="text-xs text-cream/70">Maintains space depth during high-flow irrigation</div>
                </div>
                <div class="p-4 rounded-2xl bg-[#071530]/85 border border-sky/25 backdrop-blur-xl">
                  <div class="text-sky font-bold text-base font-mono mb-1">Rapid Clearance</div>
                  <div class="text-xs text-cream/70">Complete cohesive removal prevents post-op IOP spikes</div>
                </div>
              </div>
            </div>

            <div class="lg:col-span-5 flex justify-center">
              <div class="relative size-72 sm:size-80 rounded-3xl border border-sky/30 bg-[#071530]/90 backdrop-blur-2xl p-6 flex items-center justify-center shadow-2xl overflow-hidden group">
                <img src="assets/img/pillars/p5_microscope_education.jpg" alt="Ophteis Viscoelastic" class="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500">
              </div>
            </div>

          </div>
        </div>

        <div class="text-center text-xs text-cream/50 py-2">
          Click &quot;Back to Products&quot; or press ESC to return
        </div>
      </div>

      <!-- ========================================================================= -->
      <!-- PRODUCT OVERLAY 3: INJECTORS DETAIL SHOWCASE                              -->
      <!-- ========================================================================= -->
      <div id="product-overlay-injectors" class="fixed inset-0 z-[100] bg-[#050e1f]/95 backdrop-blur-2xl flex flex-col justify-between p-4 sm:p-6 lg:p-8 opacity-0 pointer-events-none transition-all duration-400 ease-out overflow-y-auto" role="dialog" aria-modal="true" aria-label="RayOne Injector Systems">
        
        <div class="relative z-30 shrink-0 w-full max-w-5xl mx-auto flex items-center justify-between pb-3 border-b border-sky/20">
          <div>
            <p class="text-sky font-mono text-[11px] font-bold uppercase tracking-widest">PRODUCT SPOTLIGHT &bull; PRELOADED INJECTORS</p>
            <h3 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">RayOne&reg; Preloaded Injector Systems</h3>
          </div>
          
          <button type="button" onclick="closeProductOverlay()" class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-sky text-cream hover:text-[#071530] text-xs font-bold tracking-wider uppercase transition-all duration-300 border border-white/15 hover:border-sky cursor-pointer shadow-lg">
            <span>Back to Products</span>
            <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div class="relative z-20 w-full max-w-5xl mx-auto my-auto py-6">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div class="lg:col-span-7">
              <span class="inline-block px-3 py-1 rounded-full bg-sky/15 text-sky font-mono text-xs font-bold uppercase mb-3 border border-sky/30">SUB-2.2MM CORNEAL INCISION</span>
              <h4 class="text-2xl sm:text-3xl font-extrabold text-white mb-3">Patented Lock &amp; Roll&trade; Preloaded Technology</h4>
              <p class="text-sm sm:text-base text-cream/85 leading-relaxed mb-6">
                RayOne is the only true preloaded IOL system engineered with a single-step plunger. The lens is rolled into a tight, consistent planar cylinder that deploys effortlessly through sub-2.2mm incisions without manual loading risk.
              </p>

              <div class="grid grid-cols-2 gap-3.5 mb-6">
                <div class="p-4 rounded-2xl bg-[#071530]/85 border border-sky/25 backdrop-blur-xl">
                  <div class="text-sky font-bold text-base font-mono mb-1">Zero Touch</div>
                  <div class="text-xs text-cream/70">Eliminates manual lens handling and potential contamination</div>
                </div>
                <div class="p-4 rounded-2xl bg-[#071530]/85 border border-sky/25 backdrop-blur-xl">
                  <div class="text-sky font-bold text-base font-mono mb-1">2.2mm Profile</div>
                  <div class="text-xs text-cream/70">Minimal surgical wound stretch maintains corneal curvature</div>
                </div>
              </div>

              <div class="flex flex-wrap gap-3">
                <button type="button" onclick="closeProductOverlay(); document.getElementById('galaxy-delivery').scrollIntoView({behavior:'smooth'});" class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-sky text-[#071530] font-bold text-xs uppercase tracking-wider hover:bg-[#72c5f8] transition-all shadow-lg cursor-pointer">
                  <span>View 9-Stage Procedure Sequence</span>
                  <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </button>
              </div>
            </div>

            <div class="lg:col-span-5 flex justify-center">
              <div class="relative size-72 sm:size-80 rounded-3xl border border-sky/30 bg-[#071530]/90 backdrop-blur-2xl p-6 flex items-center justify-center shadow-2xl overflow-hidden group">
                <img src="assets/img/pillars/p6_quality_metrology.jpg" alt="RayOne Injector System" class="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500">
              </div>
            </div>

          </div>
        </div>

        <div class="text-center text-xs text-cream/50 py-2">
          Click &quot;Back to Products&quot; or press ESC to return
        </div>
      </div>

    </section>'''

new_content = content[:start_idx] + products_section + content[end_idx:]

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Inserted new <section id='products'> with 3-card layout & overlays successfully!")

