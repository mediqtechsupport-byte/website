with open('index.html', 'r', encoding='utf-8') as f:
    h = f.read()

s2_start = h.find('<!-- SECTION A: OPHTEIS')
s2_end = h.find('<!-- ================= SLIDE 3:')

section_a_b_new = '''<!-- SECTION A: OPHTEIS VISCOSURGICAL OVDS (3 BOX PACKSHOTS) -->
            <div class="mb-3">
              <h4 class="text-xs font-mono font-bold tracking-widest text-sky uppercase mb-2 flex items-center gap-2">
                <span>01 &bull; OPHTEIS&reg; VISCOSURGICAL DEVICES (OVDS)</span>
                <span class="h-px flex-1 bg-sky/20"></span>
              </h4>
              
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                <!-- Ophteis Adaptive Pro -->
                <div class="rounded-2xl bg-[#0a1835]/80 border border-sky/25 hover:border-sky/55 p-3 shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 group flex flex-col justify-between">
                  <div>
                    <div class="relative w-full h-38 sm:h-42 lg:h-46 rounded-xl bg-radial from-[#153265] to-[#07132b] flex items-center justify-center p-2 mb-2 overflow-hidden">
                      <img src="assets/img/packshots/ophteis_adaptive.png?v=370.00" alt="Ophteis Adaptive Pro Box" class="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-[0_16px_25px_rgba(0,0,0,0.85)]">
                      <span class="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/50 text-[10px] font-mono font-bold text-sky border border-sky/30">ADAPTIVE</span>
                    </div>
                    <h5 class="text-base font-bold text-white group-hover:text-sky transition-colors">Ophteis&reg; FR Pro</h5>
                    <p class="text-[11px] font-mono text-sky/90 mb-1">Free Radical Scavenger OVD with Sorbitol</p>
                    <p class="text-[11.5px] text-cream/70 leading-relaxed">
                      Infused with Sorbitol antioxidant to neutralize free radicals generated during phacoemulsification, reducing endothelial cell loss by up to 28%.
                    </p>
                  </div>
                  <div class="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between">
                    <div class="text-[10px] text-cream/60 flex flex-col">
                      <span>NaHA: <strong class="text-white">2.0% + Sorbitol</strong></span>
                      <span>Origin: <strong class="text-white">Rayner UK</strong></span>
                    </div>
                    <a href="#contact" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky/15 hover:bg-sky text-sky hover:text-[#0a1d40] border border-sky/30 text-xs font-bold transition-all cursor-pointer">
                      <span>Inquire / Order</span>
                      <svg class="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m9 18 6-6-6-6"/></svg>
                    </a>
                  </div>
                </div>

                <!-- Ophteis Cohesive -->
                <div class="rounded-2xl bg-[#0a1835]/80 border border-sky/25 hover:border-sky/55 p-3 shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 group flex flex-col justify-between">
                  <div>
                    <div class="relative w-full h-38 sm:h-42 lg:h-46 rounded-xl bg-radial from-[#153265] to-[#07132b] flex items-center justify-center p-2 mb-2 overflow-hidden">
                      <img src="assets/img/packshots/ophteis_cohesive.png?v=370.00" alt="Ophteis Cohesive Box" class="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-[0_16px_25px_rgba(0,0,0,0.85)]">
                      <span class="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/50 text-[10px] font-mono font-bold text-sky border border-sky/30">COHESIVE</span>
                    </div>
                    <h5 class="text-base font-bold text-white group-hover:text-sky transition-colors">Ophteis&reg; Cohesive (Max)</h5>
                    <p class="text-[11px] font-mono text-sky/90 mb-1">Chamber Depth &amp; Space Maintainer</p>
                    <p class="text-[11.5px] text-cream/70 leading-relaxed">
                      High molecular weight sodium hyaluronate with superior cohesive rheology for deep anterior chamber stability and controlled capsulorhexis.
                    </p>
                  </div>
                  <div class="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between">
                    <div class="text-[10px] text-cream/60 flex flex-col">
                      <span>Viscosity: <strong class="text-white">500,000 mPa.s</strong></span>
                      <span>Removal: <strong class="text-white">Rapid Aspirate</strong></span>
                    </div>
                    <a href="#contact" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky/15 hover:bg-sky text-sky hover:text-[#0a1d40] border border-sky/30 text-xs font-bold transition-all cursor-pointer">
                      <span>Inquire / Order</span>
                      <svg class="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m9 18 6-6-6-6"/></svg>
                    </a>
                  </div>
                </div>

                <!-- Ophteis Dispersive -->
                <div class="rounded-2xl bg-[#0a1835]/80 border border-sky/25 hover:border-sky/55 p-3 shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 group flex flex-col justify-between">
                  <div>
                    <div class="relative w-full h-38 sm:h-42 lg:h-46 rounded-xl bg-radial from-[#153265] to-[#07132b] flex items-center justify-center p-2 mb-2 overflow-hidden">
                      <img src="assets/img/packshots/ophteis_dispersive.png?v=370.00" alt="Ophteis Dispersive Box" class="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-[0_16px_25px_rgba(0,0,0,0.85)]">
                      <span class="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/50 text-[10px] font-mono font-bold text-sky border border-sky/30">DISPERSIVE</span>
                    </div>
                    <h5 class="text-base font-bold text-white group-hover:text-sky transition-colors">Ophteis&reg; Dispersive (Bio)</h5>
                    <p class="text-[11px] font-mono text-sky/90 mb-1">Endothelial Tissue Protection Shield</p>
                    <p class="text-[11.5px] text-cream/70 leading-relaxed">
                      Adheres tenaciously to corneal endothelial cells throughout phacoemulsification, shielding delicate tissues from surgical trauma and turbulence.
                    </p>
                  </div>
                  <div class="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between">
                    <div class="text-[10px] text-cream/60 flex flex-col">
                      <span>Adhesion: <strong class="text-white">Continuous</strong></span>
                      <span>Type: <strong class="text-white">Dispersive NaHA</strong></span>
                    </div>
                    <a href="#contact" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky/15 hover:bg-sky text-sky hover:text-[#0a1d40] border border-sky/30 text-xs font-bold transition-all cursor-pointer">
                      <span>Inquire / Order</span>
                      <svg class="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m9 18 6-6-6-6"/></svg>
                    </a>
                  </div>
                </div>

              </div>
            </div>

            <!-- SECTION B: AEON EYE SOLUTIONS & OCULAR SURFACE CARE (4 PRODUCTS) -->
            <div>
              <h4 class="text-xs font-mono font-bold tracking-widest text-sky uppercase mb-2 flex items-center gap-2">
                <span>02 &bull; AEON&reg; EYE SOLUTIONS &amp; OCULAR SURFACE CARE</span>
                <span class="h-px flex-1 bg-sky/20"></span>
              </h4>

              <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                
                <!-- AEON Protect -->
                <div class="rounded-xl bg-[#0a1835]/70 border border-sky/20 hover:border-sky/50 p-2.5 shadow-lg backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 group flex flex-col justify-between">
                  <div>
                    <div class="relative w-full h-30 sm:h-34 lg:h-38 rounded-lg bg-radial from-[#153265] to-[#07132b] flex items-center justify-center p-1.5 mb-1.5 overflow-hidden">
                      <img src="assets/img/packshots/aeon_protect.png?v=370.00" alt="AEON Protect Box and Bottle" class="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-[0_12px_20px_rgba(0,0,0,0.85)]">
                    </div>
                    <h6 class="text-sm font-bold text-white group-hover:text-sky transition-colors">AEON&reg; Protect</h6>
                    <p class="text-[10px] font-mono text-sky mb-0.5">0.3% Cross-Linked NaHA + PEG</p>
                    <p class="text-[10.5px] text-cream/70 leading-relaxed">
                      Long-lasting lubricating artificial tear formulated for dry eye disease with prolonged ocular surface residence.
                    </p>
                  </div>
                  <div class="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between">
                    <span class="text-[10px] font-mono text-emerald-400 font-bold">&check; Preservative-Free</span>
                    <a href="#contact" class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-sky/15 hover:bg-sky text-sky hover:text-[#0a1d40] border border-sky/30 text-[10px] font-bold transition-all cursor-pointer">
                      <span>Order</span>
                      <svg class="size-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m9 18 6-6-6-6"/></svg>
                    </a>
                  </div>
                </div>

                <!-- AEON Protect Plus -->
                <div class="rounded-xl bg-[#0a1835]/70 border border-sky/20 hover:border-sky/50 p-2.5 shadow-lg backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 group flex flex-col justify-between">
                  <div>
                    <div class="relative w-full h-30 sm:h-34 lg:h-38 rounded-lg bg-radial from-[#153265] to-[#07132b] flex items-center justify-center p-1.5 mb-1.5 overflow-hidden">
                      <img src="assets/img/packshots/aeon_protect_plus.png?v=370.00" alt="AEON Protect Plus Box and Bottle" class="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-[0_12px_20px_rgba(0,0,0,0.85)]">
                    </div>
                    <h6 class="text-sm font-bold text-white group-hover:text-sky transition-colors">AEON&reg; Protect Plus</h6>
                    <p class="text-[10px] font-mono text-sky mb-0.5">Enhanced Severe Dry Eye Relief</p>
                    <p class="text-[10.5px] text-cream/70 leading-relaxed">
                      High-viscosity comfort drop specifically formulated for moderate-to-severe evaporative dry eye symptoms.
                    </p>
                  </div>
                  <div class="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between">
                    <span class="text-[10px] font-mono text-emerald-400 font-bold">&check; Extended Hydration</span>
                    <a href="#contact" class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-sky/15 hover:bg-sky text-sky hover:text-[#0a1d40] border border-sky/30 text-[10px] font-bold transition-all cursor-pointer">
                      <span>Order</span>
                      <svg class="size-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m9 18 6-6-6-6"/></svg>
                    </a>
                  </div>
                </div>

                <!-- AEON Repair -->
                <div class="rounded-xl bg-[#0a1835]/70 border border-sky/20 hover:border-sky/50 p-2.5 shadow-lg backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 group flex flex-col justify-between">
                  <div>
                    <div class="relative w-full h-30 sm:h-34 lg:h-38 rounded-lg bg-radial from-[#153265] to-[#07132b] flex items-center justify-center p-1.5 mb-1.5 overflow-hidden">
                      <img src="assets/img/packshots/aeon_repair.png?v=370.00" alt="AEON Repair Box and Bottle" class="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-[0_12px_20px_rgba(0,0,0,0.85)]">
                    </div>
                    <h6 class="text-sm font-bold text-white group-hover:text-sky transition-colors">AEON&reg; Repair</h6>
                    <p class="text-[10px] font-mono text-sky mb-0.5">NaHA + Vitamin A &amp; E Recovery</p>
                    <p class="text-[10.5px] text-cream/70 leading-relaxed">
                      Targets post-surgical corneal healing and ocular surface re-epithelialization following cataract and refractive surgery.
                    </p>
                  </div>
                  <div class="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between">
                    <span class="text-[10px] font-mono text-purple-300 font-bold">&check; Wound Healing</span>
                    <a href="#contact" class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-sky/15 hover:bg-sky text-sky hover:text-[#0a1d40] border border-sky/30 text-[10px] font-bold transition-all cursor-pointer">
                      <span>Order</span>
                      <svg class="size-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m9 18 6-6-6-6"/></svg>
                    </a>
                  </div>
                </div>

                <!-- AEON NaCl -->
                <div class="rounded-xl bg-[#0a1835]/70 border border-sky/20 hover:border-sky/50 p-2.5 shadow-lg backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 group flex flex-col justify-between">
                  <div>
                    <div class="relative w-full h-30 sm:h-34 lg:h-38 rounded-lg bg-radial from-[#153265] to-[#07132b] flex items-center justify-center p-1.5 mb-1.5 overflow-hidden">
                      <img src="assets/img/packshots/aeon_nacl.png?v=370.00" alt="AEON NaCl Box and Bottle" class="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-[0_12px_20px_rgba(0,0,0,0.85)]">
                    </div>
                    <h6 class="text-sm font-bold text-white group-hover:text-sky transition-colors">AEON&reg; NaCl 5%</h6>
                    <p class="text-[10px] font-mono text-sky mb-0.5">Hypertonic Saline Corneal Edema Relief</p>
                    <p class="text-[10.5px] text-cream/70 leading-relaxed">
                      Draws excess fluid out of the cornea through osmotic pressure to restore transparency and visual clarity in corneal edema.
                    </p>
                  </div>
                  <div class="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between">
                    <span class="text-[10px] font-mono text-cyan-300 font-bold">&check; Osmotic Clearance</span>
                    <a href="#contact" class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-sky/15 hover:bg-sky text-sky hover:text-[#0a1d40] border border-sky/30 text-[10px] font-bold transition-all cursor-pointer">
                      <span>Order</span>
                      <svg class="size-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m9 18 6-6-6-6"/></svg>
                    </a>
                  </div>
                </div>

              </div>
            </div>



          </div>
        </div>

        '''

h_updated = h[:s2_start] + section_a_b_new + h[s2_end:]

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(h_updated)
print("SUCCESS: Updated Slide 2 with maximized uncropped packshots and minimal Inquire/Order buttons!")

