import re

# Read current products deck
with open('scratch/new_products_deck.html', 'r', encoding='utf-8') as f:
    deck_text = f.read()

# Marker for Slide 1
s1_start = deck_text.find('<!-- SLIDE 1: INTRAOCULAR LENSES')
divider_s1 = deck_text.rfind('<!-- ===', 0, s1_start)
if divider_s1 != -1:
    s1_start = divider_s1

s2_start = deck_text.find('<!-- SLIDE 2: MEDICAL SUPPLIES')
divider_s2 = deck_text.rfind('<!-- ===', 0, s2_start)
if divider_s2 != -1:
    s2_start = divider_s2

print(f"Slide 1 is between {s1_start} and {s2_start}")

new_slide_1 = '''        <!-- ========================================================================= -->
        <!-- SLIDE 1: INTRAOCULAR LENSES (3D SCROLL-DRIVEN PACKSHOT SHOWCASE)          -->
        <!-- ========================================================================= -->
        <div id="product-slide-iols" class="product-slide absolute inset-0 w-full h-full flex flex-col bg-transparent text-cream overflow-hidden transition-all duration-500 ease-out opacity-0 pointer-events-none translate-x-12 z-0" data-product-index="1">
          
          <!-- Inner Scrollable Container driving the 3 Stages (Height 320vh) -->
          <div id="iol-scroll-container" class="relative w-full h-full overflow-y-auto scroll-smooth">
            <div class="h-[320vh] w-full relative">
              
              <!-- Pinned 100vh Sticky Viewport -->
              <div class="sticky top-0 h-screen w-full flex flex-col justify-between px-4 sm:px-8 lg:px-14 py-6 sm:py-8 overflow-hidden">
                
                <!-- Top Navigation Bar -->
                <div class="relative z-30 flex items-center justify-between w-full max-w-7xl mx-auto pt-8 sm:pt-12">
                  <button type="button" onclick="if(window.goToProductSlide){window.goToProductSlide(0);}" class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-sky hover:text-white transition-all cursor-pointer">
                    <svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m15 18-6-6 6-6"/></svg>
                    <span>Back to Overview</span>
                  </button>

                  <div class="hidden sm:flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky/10 border border-sky/25 text-[11px] font-mono font-bold tracking-wider text-sky uppercase shadow-[0_0_15px_rgba(58,160,219,0.2)]">
                    <span class="size-1.5 rounded-full bg-sky animate-ping"></span>
                    <span>Scroll down inside to explore 3 IOL Innovations</span>
                  </div>

                  <button type="button" onclick="if(window.goToProductSlide){window.goToProductSlide(2);}" class="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-sky/20 hover:bg-sky text-sky hover:text-[#0a1d40] text-xs font-bold transition-all cursor-pointer">
                    <span>Next: Medical Supplies</span>
                    <svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m9 18 6-6-6-6"/></svg>
                  </button>
                </div>

                <!-- Central 3D Stage Choreography (The 3 Stages) -->
                <div class="relative z-20 w-full max-w-7xl mx-auto flex-1 flex items-center justify-center my-auto min-h-[460px]">
                  
                  <!-- STAGE 0: RayOne EMV (Packshot Left, Content Right) -->
                  <div id="iol-stage-0" class="iol-stage-container w-full grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center opacity-100 pointer-events-auto">
                    <!-- Left: 3D Packshot Rig -->
                    <div class="flex items-center justify-center order-1 lg:order-1">
                      <div class="iol-3d-scene" onpointermove="handleIolTilt(event, this)" onpointerleave="resetIolTilt(this)">
                        <div class="iol-halo"></div>
                        <div class="iol-disc-platform"></div>
                        <div class="iol-tilt-rig">
                          <img src="assets/img/packshots/emv_stage.png" alt="RayOne EMV Packshot" class="iol-float-card" loading="eager">
                        </div>
                      </div>
                    </div>
                    <!-- Right: Content -->
                    <div class="flex flex-col justify-center order-2 lg:order-2 max-w-xl">
                      <p class="inline-flex items-center gap-2 text-sky text-[11px] font-mono font-bold tracking-widest uppercase mb-2">
                        <span>01 &bull; EXTENDED DEPTH OF FOCUS</span>
                        <span class="px-2 py-0.5 rounded-md bg-sky/15 text-[10px] text-white">BARRETT FORMULA</span>
                      </p>
                      <h3 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-2">
                        RayOne&reg; <span class="text-sky">EMV</span>
                      </h3>
                      <h4 class="text-xs sm:text-sm font-semibold text-pearl/90 mb-3">
                        Co-developed with Prof. Graham Barrett &bull; Extended Visual Depth
                      </h4>
                      <p class="text-xs sm:text-sm text-cream/75 leading-relaxed mb-5">
                        The first non-diffractive IOL utilizing controlled positive spherical aberration to provide comfortable intermediate and functional near vision without dysphotopsia.
                      </p>

                      <!-- 3 Accordion Rows -->
                      <div class="space-y-2 w-full">
                        <div class="iol-accordion-row" data-open="true">
                          <button type="button" class="iol-acc-btn" onclick="toggleIolAcc(this)">
                            <span class="iol-acc-led"></span>
                            <span class="iol-acc-title">Natural Intermediate Focus (+1.50 D)</span>
                            <span class="iol-acc-plus"><i></i><i></i></span>
                          </button>
                          <div class="iol-acc-panel">
                            <div class="iol-acc-clip">
                              <p class="iol-acc-desc">Extends depth of focus seamlessly into desktop computer and dashboard distance while preserving photopic contrast and eliminating halos.</p>
                            </div>
                          </div>
                        </div>

                        <div class="iol-accordion-row" data-open="false">
                          <button type="button" class="iol-acc-btn" onclick="toggleIolAcc(this)">
                            <span class="iol-acc-led"></span>
                            <span class="iol-acc-title">Lock &amp; Roll&trade; 1.65mm Delivery</span>
                            <span class="iol-acc-plus"><i></i><i></i></span>
                          </button>
                          <div class="iol-acc-panel">
                            <div class="iol-acc-clip">
                              <p class="iol-acc-desc">True preloaded system pre-assembled under ISO Class 5 cleanroom conditions. Delivers the optic smoothly through sub-2.0mm incisions without manual lens touching.</p>
                            </div>
                          </div>
                        </div>

                        <div class="iol-accordion-row" data-open="false">
                          <button type="button" class="iol-acc-btn" onclick="toggleIolAcc(this)">
                            <span class="iol-acc-led"></span>
                            <span class="iol-acc-title">Glisten-Free Rayacryl&reg; Copolymer</span>
                            <span class="iol-acc-plus"><i></i><i></i></span>
                          </button>
                          <div class="iol-acc-panel">
                            <div class="iol-acc-clip">
                              <p class="iol-acc-desc">Engineered from balanced 26% water-content hydrophilic/hydrophobic material with continuous 360&deg; Amon-Apple square edge to eradicate glistening and prevent PCO.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- STAGE 1: RayOne Trifocal & Toric (Content Left, Packshot Right - Alternating!) -->
                  <div id="iol-stage-1" class="iol-stage-container w-full grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center opacity-0 pointer-events-none">
                    <!-- Left: Content (Alternating!) -->
                    <div class="flex flex-col justify-center order-2 lg:order-1 max-w-xl">
                      <p class="inline-flex items-center gap-2 text-sky text-[11px] font-mono font-bold tracking-widest uppercase mb-2">
                        <span>02 &bull; PREMIUM DIFFRACTIVE</span>
                        <span class="px-2 py-0.5 rounded-md bg-sky/15 text-[10px] text-white">PATENTED OPTICS</span>
                      </p>
                      <h3 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-2">
                        RayOne&reg; <span class="text-sky">Trifocal</span>
                      </h3>
                      <h4 class="text-xs sm:text-sm font-semibold text-pearl/90 mb-3">
                        Halved diffractive rings for maximum light transmission
                      </h4>
                      <p class="text-xs sm:text-sm text-cream/75 leading-relaxed mb-5">
                        Patented 16-ring diffractive architecture halves the ring count of conventional trifocals, directing 89% of light onto the retina with lowest 11% light scatter.
                      </p>

                      <!-- 3 Accordion Rows -->
                      <div class="space-y-2 w-full">
                        <div class="iol-accordion-row" data-open="true">
                          <button type="button" class="iol-acc-btn" onclick="toggleIolAcc(this)">
                            <span class="iol-acc-led"></span>
                            <span class="iol-acc-title">Lowest Light Transmission Loss (11%)</span>
                            <span class="iol-acc-plus"><i></i><i></i></span>
                          </button>
                          <div class="iol-acc-panel">
                            <div class="iol-acc-clip">
                              <p class="iol-acc-desc">Reduces light loss to less than half of older trifocals, providing exceptional pupil-independent brightness for night driving and dim light reading.</p>
                            </div>
                          </div>
                        </div>

                        <div class="iol-accordion-row" data-open="false">
                          <button type="button" class="iol-acc-btn" onclick="toggleIolAcc(this)">
                            <span class="iol-acc-led"></span>
                            <span class="iol-acc-title">Continuous Near &amp; Intermediate Vision</span>
                            <span class="iol-acc-plus"><i></i><i></i></span>
                          </button>
                          <div class="iol-acc-panel">
                            <div class="iol-acc-clip">
                              <p class="iol-acc-desc">+1.75 D intermediate add for computer screens and +3.50 D near add for comfortable reading of smartphones and fine print with total spectacle independence.</p>
                            </div>
                          </div>
                        </div>

                        <div class="iol-accordion-row" data-open="false">
                          <button type="button" class="iol-acc-btn" onclick="toggleIolAcc(this)">
                            <span class="iol-acc-led"></span>
                            <span class="iol-acc-title">Anti-Vaulting Closed-Loop Haptics</span>
                            <span class="iol-acc-plus"><i></i><i></i></span>
                          </button>
                          <div class="iol-acc-panel">
                            <div class="iol-acc-clip">
                              <p class="iol-acc-desc">Closed-loop corner-lock haptics guarantee zero rotational movement and exceptional axial planar stability inside the capsular bag.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <!-- Right: 3D Packshot Rig -->
                    <div class="flex items-center justify-center order-1 lg:order-2">
                      <div class="iol-3d-scene" onpointermove="handleIolTilt(event, this)" onpointerleave="resetIolTilt(this)">
                        <div class="iol-halo"></div>
                        <div class="iol-disc-platform"></div>
                        <div class="iol-tilt-rig">
                          <img src="assets/img/packshots/trifocal_stage.png" alt="RayOne Trifocal Packshot" class="iol-float-card" loading="lazy">
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- STAGE 2: RayOne Aspheric & Sulcoflex (Packshot Left, Content Right) -->
                  <div id="iol-stage-2" class="iol-stage-container w-full grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center opacity-0 pointer-events-none">
                    <!-- Left: 3D Packshot Rig -->
                    <div class="flex items-center justify-center order-1 lg:order-1">
                      <div class="iol-3d-scene" onpointermove="handleIolTilt(event, this)" onpointerleave="resetIolTilt(this)">
                        <div class="iol-halo"></div>
                        <div class="iol-disc-platform"></div>
                        <div class="iol-tilt-rig">
                          <img src="assets/img/packshots/aspheric_stage.png" alt="RayOne Aspheric Packshot" class="iol-float-card" loading="lazy">
                        </div>
                      </div>
                    </div>
                    <!-- Right: Content -->
                    <div class="flex flex-col justify-center order-2 lg:order-2 max-w-xl">
                      <p class="inline-flex items-center gap-2 text-sky text-[11px] font-mono font-bold tracking-widest uppercase mb-2">
                        <span>03 &bull; MONOFOCAL &amp; SULCUS CORRECTION</span>
                        <span class="px-2 py-0.5 rounded-md bg-sky/15 text-[10px] text-white">GOLD STANDARD</span>
                      </p>
                      <h3 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-2">
                        RayOne&reg; <span class="text-sky">Aspheric</span>
                      </h3>
                      <h4 class="text-xs sm:text-sm font-semibold text-pearl/90 mb-3">
                        Aberration-neutral precision &amp; Sulcoflex pseudophakic optics
                      </h4>
                      <p class="text-xs sm:text-sm text-cream/75 leading-relaxed mb-5">
                        Aberration-neutral monofocal IOL designed for pristine contrast sensitivity in diverse corneas, paired with Sulcoflex pseudophakic supplementary lenses for reversible post-operative refractive adjustments.
                      </p>

                      <!-- 3 Accordion Rows -->
                      <div class="space-y-2 w-full">
                        <div class="iol-accordion-row" data-open="true">
                          <button type="button" class="iol-acc-btn" onclick="toggleIolAcc(this)">
                            <span class="iol-acc-led"></span>
                            <span class="iol-acc-title">Aberration-Neutral Aspheric Technology</span>
                            <span class="iol-acc-plus"><i></i><i></i></span>
                          </button>
                          <div class="iol-acc-panel">
                            <div class="iol-acc-clip">
                              <p class="iol-acc-desc">Zero induced spherical aberration ensures sharp, predictable vision and heightened depth of field regardless of individual corneal curvature or previous refractive surgery.</p>
                            </div>
                          </div>
                        </div>

                        <div class="iol-accordion-row" data-open="false">
                          <button type="button" class="iol-acc-btn" onclick="toggleIolAcc(this)">
                            <span class="iol-acc-led"></span>
                            <span class="iol-acc-title">Sulcoflex Supplementary Sulcus Platform</span>
                            <span class="iol-acc-plus"><i></i><i></i></span>
                          </button>
                          <div class="iol-acc-panel">
                            <div class="iol-acc-clip">
                              <p class="iol-acc-desc">Reversible secondary IOL engineered for ciliary sulcus placement to correct residual cylinder, spherical surprise, or presbyopic enhancement in pseudophakic patients.</p>
                            </div>
                          </div>
                        </div>

                        <div class="iol-accordion-row" data-open="false">
                          <button type="button" class="iol-acc-btn" onclick="toggleIolAcc(this)">
                            <span class="iol-acc-led"></span>
                            <span class="iol-acc-title">Micro-Incision Wound Sealing</span>
                            <span class="iol-acc-plus"><i></i><i></i></span>
                          </button>
                          <div class="iol-acc-panel">
                            <div class="iol-acc-clip">
                              <p class="iol-acc-desc">Ultra-smooth 1.65mm delivery eliminates incision stress and supports rapid self-sealing clear corneal wounds for speedy patient recovery.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                <!-- Bottom Progress Rail (Matching Reference) -->
                <div class="relative z-30 w-full max-w-7xl mx-auto pb-2">
                  <div class="iol-progress-rail">
                    <button type="button" class="iol-rail-tab is-active" onclick="jumpIolStage(0)">
                      <div class="iol-rail-track"><div id="iol-fill-0" class="iol-rail-fill" style="transform: scaleX(1);"></div></div>
                      <span class="iol-rail-label">01. RayOne&reg; EMV</span>
                    </button>
                    <button type="button" class="iol-rail-tab" onclick="jumpIolStage(1)">
                      <div class="iol-rail-track"><div id="iol-fill-1" class="iol-rail-fill"></div></div>
                      <span class="iol-rail-label">02. RayOne&reg; Trifocal</span>
                    </button>
                    <button type="button" class="iol-rail-tab" onclick="jumpIolStage(2)">
                      <div class="iol-rail-track"><div id="iol-fill-2" class="iol-rail-fill"></div></div>
                      <span class="iol-rail-label">03. RayOne&reg; Aspheric</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>\n\n'''

updated_deck = deck_text[:s1_start] + new_slide_1 + deck_text[s2_start:]

with open('scratch/updated_products_deck_with_3d.html', 'w', encoding='utf-8') as f:
    f.write(updated_deck)

print("Updated deck with 3D scroll-driven Slide 1 created successfully!")

