import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Slide 1 (All 6 IOL Stages)
s1_start = html.find('<div id="product-slide-iols"')
s2_marker = '<div class="product-slide absolute inset-0 w-full h-full flex flex-col justify-center items-center px-4 sm:px-8 lg:px-12 py-16 transition-all duration-500 ease-out opacity-0 pointer-events-none translate-x-12 z-0 overflow-y-auto" data-product-index="2">'
s2_start = html.find(s2_marker, s1_start)
s3_marker = '<div class="product-slide absolute inset-0 w-full h-full flex flex-col justify-center items-center px-4 sm:px-8 lg:px-12 py-16 transition-all duration-500 ease-out opacity-0 pointer-events-none translate-x-12 z-0 overflow-y-auto" data-product-index="3">'
s3_start = html.find(s3_marker, s2_start)

if s1_start == -1 or s2_start == -1 or s3_start == -1:
    raise Exception("Slide markers not found")

new_slide_1 = """<div id="product-slide-iols" class="product-slide absolute inset-0 w-full h-full flex flex-col bg-[#07132b] text-cream overflow-hidden transition-all duration-500 ease-out opacity-0 pointer-events-none translate-x-12 z-0" data-product-index="1">
          
          <!-- Persistent Subtle Grid & Ambient Radial Glows -->
          <div class="pointer-events-none absolute inset-0 z-0 overflow-hidden">
            <div class="absolute -left-20 top-1/4 h-[42rem] w-[42rem] rounded-full bg-sky/15 blur-[160px]"></div>
            <div class="absolute right-0 top-1/3 h-[46rem] w-[46rem] rounded-full bg-[#11326c]/40 blur-[180px]"></div>
            <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(#3aa0db_1px,transparent_1px)] [background-size:28px_28px] opacity-15"></div>
          </div>

          <!-- Top Slim Floating Navigation Bar -->
          <div class="absolute top-5 left-6 right-6 sm:top-7 sm:left-12 sm:right-12 z-40 flex items-center justify-between pointer-events-auto">
            <button type="button" onclick="if(window.goToProductSlide){window.goToProductSlide(0);}" class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-cream/90 hover:text-white transition-all cursor-pointer backdrop-blur-md">
              <svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m15 18-6-6 6-6"/></svg>
              <span>Product Overview</span>
            </button>

            <!-- Active Stage Highlight Badge (High-Visibility Glow) -->
            <div id="iol-stage-badge" class="px-5 py-2 rounded-full bg-[#0a1e45]/90 border border-sky/50 text-xs font-mono font-bold tracking-widest text-sky uppercase shadow-[0_0_25px_rgba(58,160,219,0.4)] backdrop-blur-md flex items-center gap-2.5">
              <span class="size-2 rounded-full bg-sky animate-ping"></span>
              <span id="iol-stage-badge-text">STAGE 01 &bull; RAYONE&reg; EMV</span>
            </div>

            <button type="button" onclick="if(window.goToProductSlide){window.goToProductSlide(2);}" class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky/20 hover:bg-sky text-sky hover:text-[#07132b] text-xs font-bold transition-all cursor-pointer backdrop-blur-md">
              <span>Medical Supplies</span>
              <svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>

          <!-- Inner Scroll Track (Height 550vh for fluid scroll choreography across 6 innovations) -->
          <div id="iol-scroll-container" class="relative w-full h-full overflow-y-auto scroll-smooth z-10">
            <div class="h-[550vh] w-full relative">
              
              <!-- Pinned 100vh Sticky Stage -->
              <div class="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">

                <!-- ================= STAGE 0: RayOne EMV (Scene Left, Content Right) ================= -->
                <div id="iol-scene-0" class="iol-anim-scene absolute inset-y-0 hidden lg:flex w-1/2 left-0 items-center justify-center pointer-events-auto transition-transform duration-500 will-change-transform z-10">
                  <div class="sv-scene" onpointermove="handleIolTilt(event, this)" onpointerleave="resetIolTilt(this)">
                    <div class="sv-halo"></div>
                    <div class="sv-stage">
                      <div class="sv-tilt">
                        <div class="sv-rig">
                          <div class="sv-plinth">
                            <i class="sv-disc sv-disc--top"></i>
                            <i class="sv-disc sv-disc--ring1"></i>
                            <i class="sv-disc sv-disc--ring2"></i>
                          </div>
                          <img src="assets/img/packshots/iol_emv.png" alt="RayOne EMV Packshot Box" class="sv-packshot-img" loading="eager">
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div id="iol-content-0" class="iol-anim-content absolute inset-y-0 hidden lg:flex w-1/2 right-0 items-center justify-center pointer-events-auto transition-transform duration-500 will-change-transform z-20">
                  <div class="sv-content">
                    <h2 class="sv-title">RayOne&reg; EMV</h2>
                    <p class="sv-subtitle">Co-developed with Prof. Graham Barrett &bull; Extended Visual Depth</p>
                    <p class="sv-pitch">
                      First and only non-diffractive extended depth of field IOL utilizing controlled positive spherical aberration to provide seamless distance, intermediate, and functional near vision without dysphotopsia.
                    </p>

                    <ul class="sv-list">
                      <li class="sv-row" data-open="true">
                        <button type="button" class="sv-row__btn" onclick="toggleIolAcc(this)">
                          <span class="sv-row__left">
                            <span class="sv-row__led" aria-hidden="true"></span>
                            <span class="sv-row__title">Natural Intermediate Focus (+1.50 D)</span>
                          </span>
                          <span class="sv-row__plus" aria-hidden="true">+</span>
                        </button>
                        <div class="sv-row__panel">
                          <div class="sv-row__clip">
                            <p class="sv-row__desc">Extends visual depth smoothly into computer monitor and dashboard distances while maintaining 100% photopic contrast sensitivity and zero dysphotopsia.</p>
                          </div>
                        </div>
                      </li>

                      <li class="sv-row" data-open="false">
                        <button type="button" class="sv-row__btn" onclick="toggleIolAcc(this)">
                          <span class="sv-row__left">
                            <span class="sv-row__led" aria-hidden="true"></span>
                            <span class="sv-row__title">Lock &amp; Roll&trade; 1.65mm Delivery</span>
                          </span>
                          <span class="sv-row__plus" aria-hidden="true">+</span>
                        </button>
                        <div class="sv-row__panel">
                          <div class="sv-row__clip">
                            <p class="sv-row__desc">World's smallest fully preloaded 1.65mm micro-incision injector ensures a smooth, single-handed, wound-assisted planar delivery into the capsular bag.</p>
                          </div>
                        </div>
                      </li>

                      <li class="sv-row" data-open="false">
                        <button type="button" class="sv-row__btn" onclick="toggleIolAcc(this)">
                          <span class="sv-row__left">
                            <span class="sv-row__led" aria-hidden="true"></span>
                            <span class="sv-row__title">Glisten-Free Rayacryl&reg; Copolymer</span>
                          </span>
                          <span class="sv-row__plus" aria-hidden="true">+</span>
                        </button>
                        <div class="sv-row__panel">
                          <div class="sv-row__clip">
                            <p class="sv-row__desc">Proprietary hydrophilic acrylic with 26% water equilibrium delivers pristine optical clarity with zero micro-vacuole formation over decades of clinical tracking.</p>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>

                <!-- ================= STAGE 1: RayOne EMV Toric (Content Left, Scene Right) ================= -->
                <div id="iol-content-1" class="iol-anim-content absolute inset-y-0 hidden lg:flex w-1/2 left-0 items-center justify-center opacity-0 pointer-events-none transition-transform duration-500 will-change-transform z-20">
                  <div class="sv-content">
                    <h2 class="sv-title">RayOne&reg; EMV Toric</h2>
                    <p class="sv-subtitle">Extended Visual Depth &bull; Precision Corneal Astigmatism Correction</p>
                    <p class="sv-pitch">
                      Combines patented positive spherical aberration EDOF optics with Rayner's clinically proven closed-loop toric haptic platform, delivering uncompromised intermediate visual range and rotational stability.
                    </p>

                    <ul class="sv-list">
                      <li class="sv-row" data-open="true">
                        <button type="button" class="sv-row__btn" onclick="toggleIolAcc(this)">
                          <span class="sv-row__left">
                            <span class="sv-row__led" aria-hidden="true"></span>
                            <span class="sv-row__title">Rotational Stability (&lt; 1.83&deg; Mean)</span>
                          </span>
                          <span class="sv-row__plus" aria-hidden="true">+</span>
                        </button>
                        <div class="sv-row__panel">
                          <div class="sv-row__clip">
                            <p class="sv-row__desc">True closed-loop haptic architecture locks into the capsular bag equator, preventing postoperative rotation and ensuring permanent cylindrical alignment.</p>
                          </div>
                        </div>
                      </li>

                      <li class="sv-row" data-open="false">
                        <button type="button" class="sv-row__btn" onclick="toggleIolAcc(this)">
                          <span class="sv-row__left">
                            <span class="sv-row__led" aria-hidden="true"></span>
                            <span class="sv-row__title">Predictable Cylinder Reduction (+6.00 D)</span>
                          </span>
                          <span class="sv-row__plus" aria-hidden="true">+</span>
                        </button>
                        <div class="sv-row__panel">
                          <div class="sv-row__clip">
                            <p class="sv-row__desc">Available in cylinder powers up to +6.00 D, correcting low to severe corneal astigmatism alongside presbyopic intermediate enhancement.</p>
                          </div>
                        </div>
                      </li>

                      <li class="sv-row" data-open="false">
                        <button type="button" class="sv-row__btn" onclick="toggleIolAcc(this)">
                          <span class="sv-row__left">
                            <span class="sv-row__led" aria-hidden="true"></span>
                            <span class="sv-row__title">Raytrace&reg; Online Toric Calculator</span>
                          </span>
                          <span class="sv-row__plus" aria-hidden="true">+</span>
                        </button>
                        <div class="sv-row__panel">
                          <div class="sv-row__clip">
                            <p class="sv-row__desc">Integrated with the Raytrace® toric calculator utilizing total corneal power measurements for sub-diopter surgical accuracy and easy planning.</p>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>

                <div id="iol-scene-1" class="iol-anim-scene absolute inset-y-0 hidden lg:flex w-1/2 right-0 items-center justify-center opacity-0 pointer-events-none transition-transform duration-500 will-change-transform z-10">
                  <div class="sv-scene" onpointermove="handleIolTilt(event, this)" onpointerleave="resetIolTilt(this)">
                    <div class="sv-halo"></div>
                    <div class="sv-stage">
                      <div class="sv-tilt">
                        <div class="sv-rig">
                          <div class="sv-plinth">
                            <i class="sv-disc sv-disc--top"></i>
                            <i class="sv-disc sv-disc--ring1"></i>
                            <i class="sv-disc sv-disc--ring2"></i>
                          </div>
                          <img src="assets/img/packshots/iol_emv_toric.png" alt="RayOne EMV Toric Packshot Box" class="sv-packshot-img" loading="lazy">
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- ================= STAGE 2: RayOne Trifocal (Scene Left, Content Right) ================= -->
                <div id="iol-scene-2" class="iol-anim-scene absolute inset-y-0 hidden lg:flex w-1/2 left-0 items-center justify-center opacity-0 pointer-events-none transition-transform duration-500 will-change-transform z-10">
                  <div class="sv-scene" onpointermove="handleIolTilt(event, this)" onpointerleave="resetIolTilt(this)">
                    <div class="sv-halo"></div>
                    <div class="sv-stage">
                      <div class="sv-tilt">
                        <div class="sv-rig">
                          <div class="sv-plinth">
                            <i class="sv-disc sv-disc--top"></i>
                            <i class="sv-disc sv-disc--ring1"></i>
                            <i class="sv-disc sv-disc--ring2"></i>
                          </div>
                          <img src="assets/img/packshots/iol_trifocal.png" alt="RayOne Trifocal Packshot Box" class="sv-packshot-img" loading="lazy">
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div id="iol-content-2" class="iol-anim-content absolute inset-y-0 hidden lg:flex w-1/2 right-0 items-center justify-center opacity-0 pointer-events-none transition-transform duration-500 will-change-transform z-20">
                  <div class="sv-content">
                    <h2 class="sv-title">RayOne&reg; Trifocal</h2>
                    <p class="sv-subtitle">Patented 16-Ring Diffractive Profile &bull; Maximum Light Transmission</p>
                    <p class="sv-pitch">
                      Halves the number of diffractive rings compared to conventional trifocals, reducing light scatter to only 11% and transmitting an exceptional 89% of light directly onto the retina for comfortable reading.
                    </p>

                    <ul class="sv-list">
                      <li class="sv-row" data-open="true">
                        <button type="button" class="sv-row__btn" onclick="toggleIolAcc(this)">
                          <span class="sv-row__left">
                            <span class="sv-row__led" aria-hidden="true"></span>
                            <span class="sv-row__title">Minimal Light Loss (Only 11%)</span>
                          </span>
                          <span class="sv-row__plus" aria-hidden="true">+</span>
                        </button>
                        <div class="sv-row__panel">
                          <div class="sv-row__clip">
                            <p class="sv-row__desc">Directs 89% of available light to the retina (52% distance, 22% intermediate, 26% near) for brilliant contrast under dim evening and dining conditions.</p>
                          </div>
                        </div>
                      </li>

                      <li class="sv-row" data-open="false">
                        <button type="button" class="sv-row__btn" onclick="toggleIolAcc(this)">
                          <span class="sv-row__left">
                            <span class="sv-row__led" aria-hidden="true"></span>
                            <span class="sv-row__title">Comfortable Near Addition (+3.50 D)</span>
                          </span>
                          <span class="sv-row__plus" aria-hidden="true">+</span>
                        </button>
                        <div class="sv-row__panel">
                          <div class="sv-row__clip">
                            <p class="sv-row__desc">Optimal near power (+3.50 D spectacle plane +2.70 D) and intermediate (+1.75 D) delivers natural smartphone reading without spectacle dependence.</p>
                          </div>
                        </div>
                      </li>

                      <li class="sv-row" data-open="false">
                        <button type="button" class="sv-row__btn" onclick="toggleIolAcc(this)">
                          <span class="sv-row__left">
                            <span class="sv-row__led" aria-hidden="true"></span>
                            <span class="sv-row__title">True 360&deg; Enhanced Square Edge</span>
                          </span>
                          <span class="sv-row__plus" aria-hidden="true">+</span>
                        </button>
                        <div class="sv-row__panel">
                          <div class="sv-row__clip">
                            <p class="sv-row__desc">Continuous barrier geometry blocks epithelial cell migration across the posterior capsule, driving Nd:YAG capsulotomy rates to near zero.</p>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>

                <!-- ================= STAGE 3: RayOne Trifocal Toric (Content Left, Scene Right) ================= -->
                <div id="iol-content-3" class="iol-anim-content absolute inset-y-0 hidden lg:flex w-1/2 left-0 items-center justify-center opacity-0 pointer-events-none transition-transform duration-500 will-change-transform z-20">
                  <div class="sv-content">
                    <h2 class="sv-title">RayOne&reg; Trifocal Toric</h2>
                    <p class="sv-subtitle">Full Spectacle Independence &bull; Simultaneous Astigmatism Correction</p>
                    <p class="sv-pitch">
                      Offers presbyopic cataract patients with pre-existing astigmatism the ultimate trifocal optical experience, pairing patented diffractive rings with personalized toric cylinder correction.
                    </p>

                    <ul class="sv-list">
                      <li class="sv-row" data-open="true">
                        <button type="button" class="sv-row__btn" onclick="toggleIolAcc(this)">
                          <span class="sv-row__left">
                            <span class="sv-row__led" aria-hidden="true"></span>
                            <span class="sv-row__title">Custom Toric Cylinder Powers</span>
                          </span>
                          <span class="sv-row__plus" aria-hidden="true">+</span>
                        </button>
                        <div class="sv-row__panel">
                          <div class="sv-row__clip">
                            <p class="sv-row__desc">Broad range of cylinder powers tailored to individual corneal measurements, neutralizing astigmatism while restoring full near-to-distance vision.</p>
                          </div>
                        </div>
                      </li>

                      <li class="sv-row" data-open="false">
                        <button type="button" class="sv-row__btn" onclick="toggleIolAcc(this)">
                          <span class="sv-row__left">
                            <span class="sv-row__led" aria-hidden="true"></span>
                            <span class="sv-row__title">Anti-Vaulting Haptic Stability</span>
                          </span>
                          <span class="sv-row__plus" aria-hidden="true">+</span>
                        </button>
                        <div class="sv-row__panel">
                          <div class="sv-row__clip">
                            <p class="sv-row__desc">Resists capsular bag shrinkage and optic decentration, maintaining precise optical axis centering over the patient's visual lifetime.</p>
                          </div>
                        </div>
                      </li>

                      <li class="sv-row" data-open="false">
                        <button type="button" class="sv-row__btn" onclick="toggleIolAcc(this)">
                          <span class="sv-row__left">
                            <span class="sv-row__led" aria-hidden="true"></span>
                            <span class="sv-row__title">Zero Glare Diffraction Optics</span>
                          </span>
                          <span class="sv-row__plus" aria-hidden="true">+</span>
                        </button>
                        <div class="sv-row__panel">
                          <div class="sv-row__clip">
                            <p class="sv-row__desc">Optimized step heights minimize pupil-dependent glares and halos during nighttime driving and low-light environments.</p>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>

                <div id="iol-scene-3" class="iol-anim-scene absolute inset-y-0 hidden lg:flex w-1/2 right-0 items-center justify-center opacity-0 pointer-events-none transition-transform duration-500 will-change-transform z-10">
                  <div class="sv-scene" onpointermove="handleIolTilt(event, this)" onpointerleave="resetIolTilt(this)">
                    <div class="sv-halo"></div>
                    <div class="sv-stage">
                      <div class="sv-tilt">
                        <div class="sv-rig">
                          <div class="sv-plinth">
                            <i class="sv-disc sv-disc--top"></i>
                            <i class="sv-disc sv-disc--ring1"></i>
                            <i class="sv-disc sv-disc--ring2"></i>
                          </div>
                          <img src="assets/img/packshots/iol_trifocal_toric.png" alt="RayOne Trifocal Toric Packshot Box" class="sv-packshot-img" loading="lazy">
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- ================= STAGE 4: RayOne Aspheric (Scene Left, Content Right) ================= -->
                <div id="iol-scene-4" class="iol-anim-scene absolute inset-y-0 hidden lg:flex w-1/2 left-0 items-center justify-center opacity-0 pointer-events-none transition-transform duration-500 will-change-transform z-10">
                  <div class="sv-scene" onpointermove="handleIolTilt(event, this)" onpointerleave="resetIolTilt(this)">
                    <div class="sv-halo"></div>
                    <div class="sv-stage">
                      <div class="sv-tilt">
                        <div class="sv-rig">
                          <div class="sv-plinth">
                            <i class="sv-disc sv-disc--top"></i>
                            <i class="sv-disc sv-disc--ring1"></i>
                            <i class="sv-disc sv-disc--ring2"></i>
                          </div>
                          <img src="assets/img/packshots/iol_aspheric.png" alt="RayOne Aspheric Packshot Box" class="sv-packshot-img" loading="lazy">
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div id="iol-content-4" class="iol-anim-content absolute inset-y-0 hidden lg:flex w-1/2 right-0 items-center justify-center opacity-0 pointer-events-none transition-transform duration-500 will-change-transform z-20">
                  <div class="sv-content">
                    <h2 class="sv-title">RayOne&reg; Aspheric</h2>
                    <p class="sv-subtitle">Aberration-Neutral Precision &bull; Universal Corneal Compatibility</p>
                    <p class="sv-pitch">
                      Aberration-neutral monofocal IOL designed for pristine contrast sensitivity across all corneas, delivering crisp distance vision with unmatched optical clarity.
                    </p>

                    <ul class="sv-list">
                      <li class="sv-row" data-open="true">
                        <button type="button" class="sv-row__btn" onclick="toggleIolAcc(this)">
                          <span class="sv-row__left">
                            <span class="sv-row__led" aria-hidden="true"></span>
                            <span class="sv-row__title">Zero Spherical Aberration Design</span>
                          </span>
                          <span class="sv-row__plus" aria-hidden="true">+</span>
                        </button>
                        <div class="sv-row__panel">
                          <div class="sv-row__clip">
                            <p class="sv-row__desc">Guarantees predictable vision and heightened depth of field regardless of individual corneal curvature or previous refractive surgery.</p>
                          </div>
                        </div>
                      </li>

                      <li class="sv-row" data-open="false">
                        <button type="button" class="sv-row__btn" onclick="toggleIolAcc(this)">
                          <span class="sv-row__left">
                            <span class="sv-row__led" aria-hidden="true"></span>
                            <span class="sv-row__title">True Monofocal Contrast Purity</span>
                          </span>
                          <span class="sv-row__plus" aria-hidden="true">+</span>
                        </button>
                        <div class="sv-row__panel">
                          <div class="sv-row__clip">
                            <p class="sv-row__desc">Delivers 100% of light without diffractive division, maximizing visual acuity in low-contrast and specialized clinical conditions.</p>
                          </div>
                        </div>
                      </li>

                      <li class="sv-row" data-open="false">
                        <button type="button" class="sv-row__btn" onclick="toggleIolAcc(this)">
                          <span class="sv-row__left">
                            <span class="sv-row__led" aria-hidden="true"></span>
                            <span class="sv-row__title">Single-Step Micro-Incision Insertion</span>
                          </span>
                          <span class="sv-row__plus" aria-hidden="true">+</span>
                        </button>
                        <div class="sv-row__panel">
                          <div class="sv-row__clip">
                            <p class="sv-row__desc">Single-handed preloaded delivery through sub-2.0mm clear corneal incisions with minimal endothelial stress and rapid self-sealing.</p>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>

                <!-- ================= STAGE 5: Sulcoflex Aspheric (Content Left, Scene Right) ================= -->
                <div id="iol-content-5" class="iol-anim-content absolute inset-y-0 hidden lg:flex w-1/2 left-0 items-center justify-center opacity-0 pointer-events-none transition-transform duration-500 will-change-transform z-20">
                  <div class="sv-content">
                    <h2 class="sv-title">Sulcoflex&reg; Aspheric</h2>
                    <p class="sv-subtitle">Pseudophakic Supplementary Platform &bull; Reversible Ciliary Sulcus Placement</p>
                    <p class="sv-pitch">
                      Engineered specifically for implantation into the ciliary sulcus in pseudophakic eyes, offering a reversible solution to correct residual spherical refractive errors without explanting the primary IOL.
                    </p>

                    <ul class="sv-list">
                      <li class="sv-row" data-open="true">
                        <button type="button" class="sv-row__btn" onclick="toggleIolAcc(this)">
                          <span class="sv-row__left">
                            <span class="sv-row__led" aria-hidden="true"></span>
                            <span class="sv-row__title">Large 6.5mm Round-Edged Optic</span>
                          </span>
                          <span class="sv-row__plus" aria-hidden="true">+</span>
                        </button>
                        <div class="sv-row__panel">
                          <div class="sv-row__clip">
                            <p class="sv-row__desc">Specially contoured optic prevents pupillary capture, iris chafing, pigment dispersion syndrome, and interlenticular opacification.</p>
                          </div>
                        </div>
                      </li>

                      <li class="sv-row" data-open="false">
                        <button type="button" class="sv-row__btn" onclick="toggleIolAcc(this)">
                          <span class="sv-row__left">
                            <span class="sv-row__led" aria-hidden="true"></span>
                            <span class="sv-row__title">Undulated Posterior Concave Base</span>
                          </span>
                          <span class="sv-row__plus" aria-hidden="true">+</span>
                        </button>
                        <div class="sv-row__panel">
                          <div class="sv-row__clip">
                            <p class="sv-row__desc">Creates anatomical separation between primary IOL and Sulcoflex, eliminating contact and preventing hyperopic shift.</p>
                          </div>
                        </div>
                      </li>

                      <li class="sv-row" data-open="false">
                        <button type="button" class="sv-row__btn" onclick="toggleIolAcc(this)">
                          <span class="sv-row__left">
                            <span class="sv-row__led" aria-hidden="true"></span>
                            <span class="sv-row__title">Zero-Torque Wavelike Haptics</span>
                          </span>
                          <span class="sv-row__plus" aria-hidden="true">+</span>
                        </button>
                        <div class="sv-row__panel">
                          <div class="sv-row__clip">
                            <p class="sv-row__desc">Smooth, wide undulating haptics distribute pressure evenly across the ciliary sulcus for stable, long-term non-inflammatory fixation.</p>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>

                <div id="iol-scene-5" class="iol-anim-scene absolute inset-y-0 hidden lg:flex w-1/2 right-0 items-center justify-center opacity-0 pointer-events-none transition-transform duration-500 will-change-transform z-10">
                  <div class="sv-scene" onpointermove="handleIolTilt(event, this)" onpointerleave="resetIolTilt(this)">
                    <div class="sv-halo"></div>
                    <div class="sv-stage">
                      <div class="sv-tilt">
                        <div class="sv-rig">
                          <div class="sv-plinth">
                            <i class="sv-disc sv-disc--top"></i>
                            <i class="sv-disc sv-disc--ring1"></i>
                            <i class="sv-disc sv-disc--ring2"></i>
                          </div>
                          <img src="assets/img/packshots/iol_sulcoflex.png" alt="Sulcoflex Aspheric Packshot Box" class="sv-packshot-img" loading="lazy">
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- ================= MOBILE VIEW (Stacked: Packshot Top, Content Below) ================= -->
                <div class="lg:hidden flex flex-col items-center justify-center w-full px-4 pt-16 pb-20 overflow-y-auto">
                  <div class="w-full max-w-sm aspect-square flex items-center justify-center mb-4">
                    <img id="iol-mobile-packshot" src="assets/img/packshots/iol_emv.png" alt="RayOne IOL" class="max-h-64 object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)]">
                  </div>
                  <div class="w-full max-w-md text-center">
                    <h2 id="iol-mobile-title" class="text-3xl font-extrabold text-white mb-1">RayOne&reg; EMV</h2>
                    <p id="iol-mobile-sub" class="text-xs text-sky font-semibold mb-3">Co-developed with Prof. Graham Barrett</p>
                    <p id="iol-mobile-desc" class="text-xs text-cream/75 leading-relaxed mb-4">
                      Non-diffractive extended depth of field IOL providing seamless intermediate and functional near vision without dysphotopsia.
                    </p>
                  </div>
                </div>

                <!-- Bottom Progress Rail (All 6 IOL Innovations) -->
                <div class="sv-rail !max-w-4xl !gap-2.5">
                  <button type="button" class="sv-rail__item" aria-current="true" onclick="jumpIolStage(0)">
                    <span class="sv-rail__label">01. EMV</span>
                    <div class="sv-rail__track"><div id="iol-fill-0" class="sv-rail__fill" style="transform: scaleX(1);"></div></div>
                  </button>

                  <button type="button" class="sv-rail__item" aria-current="false" onclick="jumpIolStage(1)">
                    <span class="sv-rail__label">02. EMV Toric</span>
                    <div class="sv-rail__track"><div id="iol-fill-1" class="sv-rail__fill"></div></div>
                  </button>

                  <button type="button" class="sv-rail__item" aria-current="false" onclick="jumpIolStage(2)">
                    <span class="sv-rail__label">03. Trifocal</span>
                    <div class="sv-rail__track"><div id="iol-fill-2" class="sv-rail__fill"></div></div>
                  </button>

                  <button type="button" class="sv-rail__item" aria-current="false" onclick="jumpIolStage(3)">
                    <span class="sv-rail__label">04. Trifocal Toric</span>
                    <div class="sv-rail__track"><div id="iol-fill-3" class="sv-rail__fill"></div></div>
                  </button>

                  <button type="button" class="sv-rail__item" aria-current="false" onclick="jumpIolStage(4)">
                    <span class="sv-rail__label">05. Aspheric</span>
                    <div class="sv-rail__track"><div id="iol-fill-4" class="sv-rail__fill"></div></div>
                  </button>

                  <button type="button" class="sv-rail__item" aria-current="false" onclick="jumpIolStage(5)">
                    <span class="sv-rail__label">06. Sulcoflex</span>
                    <div class="sv-rail__track"><div id="iol-fill-5" class="sv-rail__fill"></div></div>
                  </button>
                </div>

              </div>
            </div>
          </div>

        </div>

        """

# 2. Slide 2: Medical Supplies (Featuring ALL Ophteis OVDs & AEON Eye Drops Packshot Boxes)
new_slide_2 = """<div class="product-slide absolute inset-0 w-full h-full flex flex-col justify-start items-center px-4 sm:px-8 lg:px-12 py-16 transition-all duration-500 ease-out opacity-0 pointer-events-none translate-x-12 z-0 overflow-y-auto" data-product-index="2">
          <div class="relative z-10 w-full max-w-7xl mx-auto my-auto py-6">
            
            <!-- Category Header with Back Link -->
            <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
              <div>
                <button type="button" onclick="if(window.goToProductSlide){window.goToProductSlide(0);}" class="inline-flex items-center gap-1.5 text-xs font-semibold text-sky hover:text-white mb-2 transition-colors cursor-pointer">
                  <svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m15 18-6-6 6-6"/></svg>
                  <span>Back to Product Overview</span>
                </button>
                <h3 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                  Medical Supplies &bull; <span class="text-sky">Ophteis&reg; OVDs &amp; AEON&reg; Care</span>
                </h3>
                <p class="text-xs sm:text-sm text-cream/70 mt-1 max-w-2xl">
                  Bio-engineered sodium hyaluronate viscoelastics with antioxidant Sorbitol, alongside premier AEON ophthalmic solutions for surgical recovery and ocular surface health.
                </p>
              </div>

              <!-- Filter / Category Indicator -->
              <div class="flex flex-wrap gap-2">
                <span class="px-3 py-1 rounded-full bg-sky/10 border border-sky/30 text-[10px] font-mono font-bold text-sky uppercase">3 OPHTEIS OVDS</span>
                <span class="px-3 py-1 rounded-full bg-sky/10 border border-sky/30 text-[10px] font-mono font-bold text-sky uppercase">4 AEON SOLUTIONS</span>
              </div>
            </div>

            <!-- SECTION A: OPHTEIS VISCOSURGICAL OVDS (3 BOX PACKSHOTS) -->
            <div class="mb-8">
              <h4 class="text-sm font-mono font-bold tracking-widest text-sky uppercase mb-3 flex items-center gap-2">
                <span>01 &bull; OPHTEIS&reg; VISCOSURGICAL DEVICES (OVDS)</span>
                <span class="h-px flex-1 bg-sky/20"></span>
              </h4>
              
              <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
                
                <!-- Ophteis Adaptive Pro -->
                <div class="rounded-2xl bg-[#0a1835]/80 border border-sky/25 hover:border-sky/55 p-4 shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 group flex flex-col justify-between">
                  <div>
                    <div class="relative w-full h-44 rounded-xl bg-radial from-[#153265] to-[#07132b] flex items-center justify-center p-3 mb-3 overflow-hidden">
                      <img src="assets/img/packshots/ophteis_adaptive.png" alt="Ophteis Adaptive Pro Box" class="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-[0_15px_25px_rgba(0,0,0,0.8)]">
                      <span class="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/40 text-[10px] font-mono font-bold text-sky">ADAPTIVE</span>
                    </div>
                    <h5 class="text-base font-bold text-white group-hover:text-sky transition-colors">Ophteis&reg; FR Pro</h5>
                    <p class="text-[11px] font-mono text-sky/90 mb-1.5">Free Radical Scavenger OVD with Sorbitol</p>
                    <p class="text-xs text-cream/70 leading-relaxed">
                      Infused with Sorbitol antioxidant to neutralize free radicals generated during phacoemulsification, reducing endothelial cell loss by up to 28%.
                    </p>
                  </div>
                  <div class="mt-4 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] text-cream/60">
                    <span>NaHA: <strong class="text-white">2.0% + Sorbitol</strong></span>
                    <span>Origin: <strong class="text-white">Rayner UK</strong></span>
                  </div>
                </div>

                <!-- Ophteis Cohesive -->
                <div class="rounded-2xl bg-[#0a1835]/80 border border-sky/25 hover:border-sky/55 p-4 shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 group flex flex-col justify-between">
                  <div>
                    <div class="relative w-full h-44 rounded-xl bg-radial from-[#153265] to-[#07132b] flex items-center justify-center p-3 mb-3 overflow-hidden">
                      <img src="assets/img/packshots/ophteis_cohesive.png" alt="Ophteis Cohesive Box" class="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-[0_15px_25px_rgba(0,0,0,0.8)]">
                      <span class="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/40 text-[10px] font-mono font-bold text-sky">COHESIVE</span>
                    </div>
                    <h5 class="text-base font-bold text-white group-hover:text-sky transition-colors">Ophteis&reg; Cohesive (Max)</h5>
                    <p class="text-[11px] font-mono text-sky/90 mb-1.5">Chamber Depth &amp; Space Maintainer</p>
                    <p class="text-xs text-cream/70 leading-relaxed">
                      High molecular weight sodium hyaluronate with superior cohesive rheology for deep anterior chamber stability and controlled capsulorhexis.
                    </p>
                  </div>
                  <div class="mt-4 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] text-cream/60">
                    <span>Viscosity: <strong class="text-white">500,000 mPa.s</strong></span>
                    <span>Removal: <strong class="text-white">Rapid Aspirate</strong></span>
                  </div>
                </div>

                <!-- Ophteis Dispersive -->
                <div class="rounded-2xl bg-[#0a1835]/80 border border-sky/25 hover:border-sky/55 p-4 shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 group flex flex-col justify-between">
                  <div>
                    <div class="relative w-full h-44 rounded-xl bg-radial from-[#153265] to-[#07132b] flex items-center justify-center p-3 mb-3 overflow-hidden">
                      <img src="assets/img/packshots/ophteis_dispersive.png" alt="Ophteis Dispersive Box" class="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-[0_15px_25px_rgba(0,0,0,0.8)]">
                      <span class="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/40 text-[10px] font-mono font-bold text-sky">DISPERSIVE</span>
                    </div>
                    <h5 class="text-base font-bold text-white group-hover:text-sky transition-colors">Ophteis&reg; Dispersive (Bio)</h5>
                    <p class="text-[11px] font-mono text-sky/90 mb-1.5">Endothelial Tissue Protection Shield</p>
                    <p class="text-xs text-cream/70 leading-relaxed">
                      Adheres tenaciously to corneal endothelial cells throughout phacoemulsification, shielding delicate tissues from surgical trauma and turbulence.
                    </p>
                  </div>
                  <div class="mt-4 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] text-cream/60">
                    <span>Adhesion: <strong class="text-white">Continuous</strong></span>
                    <span>Type: <strong class="text-white">Dispersive NaHA</strong></span>
                  </div>
                </div>

              </div>
            </div>

            <!-- SECTION B: AEON OPHTHALMIC EYE SOLUTIONS (4 BOX PACKSHOTS) -->
            <div>
              <h4 class="text-sm font-mono font-bold tracking-widest text-sky uppercase mb-3 flex items-center gap-2">
                <span>02 &bull; AEON&reg; EYE SOLUTIONS &amp; OCULAR SURFACE CARE</span>
                <span class="h-px flex-1 bg-sky/20"></span>
              </h4>

              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                <!-- AEON Protect -->
                <div class="rounded-xl bg-[#0a1835]/70 border border-sky/20 hover:border-sky/50 p-3.5 shadow-lg backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 group flex flex-col justify-between">
                  <div>
                    <div class="relative w-full h-36 rounded-lg bg-radial from-[#153265] to-[#07132b] flex items-center justify-center p-2 mb-2.5 overflow-hidden">
                      <img src="assets/img/packshots/aeon_protect.png" alt="AEON Protect Box and Bottle" class="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-[0_12px_20px_rgba(0,0,0,0.8)]">
                    </div>
                    <h6 class="text-sm font-bold text-white group-hover:text-sky transition-colors">AEON&reg; Protect</h6>
                    <p class="text-[10px] font-mono text-sky mb-1">0.3% Cross-Linked NaHA + PEG</p>
                    <p class="text-[11px] text-cream/70 leading-relaxed">
                      Long-lasting lubricating artificial tear formulated for dry eye disease with prolonged ocular surface residence.
                    </p>
                  </div>
                  <span class="mt-3 text-[10px] font-mono text-emerald-400 font-bold">&check; Preservative-Free</span>
                </div>

                <!-- AEON Protect Plus -->
                <div class="rounded-xl bg-[#0a1835]/70 border border-sky/20 hover:border-sky/50 p-3.5 shadow-lg backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 group flex flex-col justify-between">
                  <div>
                    <div class="relative w-full h-36 rounded-lg bg-radial from-[#153265] to-[#07132b] flex items-center justify-center p-2 mb-2.5 overflow-hidden">
                      <img src="assets/img/packshots/aeon_protect_plus.png" alt="AEON Protect Plus Box and Bottle" class="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-[0_12px_20px_rgba(0,0,0,0.8)]">
                    </div>
                    <h6 class="text-sm font-bold text-white group-hover:text-sky transition-colors">AEON&reg; Protect Plus</h6>
                    <p class="text-[10px] font-mono text-sky mb-1">Enhanced Severe Dry Eye Relief</p>
                    <p class="text-[11px] text-cream/70 leading-relaxed">
                      High-viscosity comfort drop specifically formulated for moderate-to-severe evaporative dry eye symptoms.
                    </p>
                  </div>
                  <span class="mt-3 text-[10px] font-mono text-emerald-400 font-bold">&check; Extended Hydration</span>
                </div>

                <!-- AEON Repair -->
                <div class="rounded-xl bg-[#0a1835]/70 border border-sky/20 hover:border-sky/50 p-3.5 shadow-lg backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 group flex flex-col justify-between">
                  <div>
                    <div class="relative w-full h-36 rounded-lg bg-radial from-[#153265] to-[#07132b] flex items-center justify-center p-2 mb-2.5 overflow-hidden">
                      <img src="assets/img/packshots/aeon_repair.png" alt="AEON Repair Box and Bottle" class="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-[0_12px_20px_rgba(0,0,0,0.8)]">
                    </div>
                    <h6 class="text-sm font-bold text-white group-hover:text-sky transition-colors">AEON&reg; Repair</h6>
                    <p class="text-[10px] font-mono text-sky mb-1">NaHA + Vitamin A &amp; E Epithelial Recovery</p>
                    <p class="text-[11px] text-cream/70 leading-relaxed">
                      Targets post-surgical corneal healing and ocular surface re-epithelialization following cataract and refractive surgery.
                    </p>
                  </div>
                  <span class="mt-3 text-[10px] font-mono text-purple-300 font-bold">&check; Wound Healing</span>
                </div>

                <!-- AEON NaCl -->
                <div class="rounded-xl bg-[#0a1835]/70 border border-sky/20 hover:border-sky/50 p-3.5 shadow-lg backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 group flex flex-col justify-between">
                  <div>
                    <div class="relative w-full h-36 rounded-lg bg-radial from-[#153265] to-[#07132b] flex items-center justify-center p-2 mb-2.5 overflow-hidden">
                      <img src="assets/img/packshots/aeon_nacl.png" alt="AEON NaCl Box and Bottle" class="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-[0_12px_20px_rgba(0,0,0,0.8)]">
                    </div>
                    <h6 class="text-sm font-bold text-white group-hover:text-sky transition-colors">AEON&reg; NaCl 5%</h6>
                    <p class="text-[10px] font-mono text-sky mb-1">Hypertonic Saline Corneal Edema Relief</p>
                    <p class="text-[11px] text-cream/70 leading-relaxed">
                      Draws excess fluid out of the cornea through osmotic pressure to restore transparency and visual clarity in corneal edema.
                    </p>
                  </div>
                  <span class="mt-3 text-[10px] font-mono text-cyan-300 font-bold">&check; Osmotic Clearance</span>
                </div>

              </div>
            </div>

            <!-- Footer Quick Nav -->
            <div class="mt-6 flex items-center justify-between">
              <button type="button" onclick="if(window.goToProductSlide){window.goToProductSlide(1);}" class="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-cream/80 hover:text-white transition-all cursor-pointer">
                &larr; Intraocular Lenses
              </button>
              <button type="button" onclick="if(window.goToProductSlide){window.goToProductSlide(3);}" class="px-5 py-2.5 rounded-xl bg-sky text-[#0a1d40] text-xs font-bold hover:bg-[#72c5f8] transition-all cursor-pointer flex items-center gap-1.5">
                <span>Next: Devices &amp; Equipment</span>
                <svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m9 18 6-6-6-6"/></svg>
              </button>
            </div>

          </div>
        </div>

        """

html = html[:s1_start] + new_slide_1 + new_slide_2 + html[s3_start:]

# Bump script version to v=353.00
html = re.sub(r'src="assets/js/main\.js\?v=[\d\.]+"', 'src="assets/js/main.js?v=353.00"', html)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("Applied 6 IOL stages and all Ophteis/AEON packshots to index.html!")

