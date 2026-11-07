with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

start_marker = '<!-- SLIDE 3: WHAT WE DO'
end_marker = '<!-- SLIDE 4: OUR ESTABLISHED FOUNDATION'

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx == -1 or end_idx == -1:
    print(f"Error finding markers: start={start_idx}, end={end_idx}")
    import sys
    sys.exit(1)

divider_start = content.rfind('<!-- ===', 0, start_idx)
if divider_start != -1:
    start_idx = divider_start

divider_end = content.rfind('<!-- ===', 0, end_idx)
if divider_end != -1:
    end_idx = divider_end

new_slide_2_and_overlays = '''<!-- ========================================================================= -->
        <!-- SLIDE 3: PILLARS & CAPABILITIES (21st.dev 3-Card Grid + Stacking Overlay)  -->
        <!-- ========================================================================= -->
        <div id="about-slide-what-we-do" class="about-slide absolute inset-0 w-full h-full flex flex-col justify-center bg-transparent text-cream px-4 sm:px-8 lg:px-14 pt-16 sm:pt-20 pb-8 overflow-y-auto transition-all duration-500 ease-out opacity-0 pointer-events-none translate-x-12 z-0" data-index="2">
          
          <!-- Ambient Luminous Glows -->
          <div class="pointer-events-none absolute -left-20 top-1/4 h-[32rem] w-[32rem] rounded-full bg-sky/15 blur-[160px]"></div>
          <div class="pointer-events-none absolute right-0 top-1/3 h-[36rem] w-[36rem] rounded-full bg-[#11326c]/45 blur-[180px]"></div>
          <!-- Blueprint / Dot Matrix Grid matching Deck Style -->
          <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(#3aa0db_1px,transparent_1px)] [background-size:24px_24px] opacity-15"></div>

          <div class="relative z-10 w-full max-w-7xl mx-auto my-auto py-4">

            <!-- Section Header -->
            <div class="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
              <p class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky/10 border border-sky/30 text-sky text-[11px] font-bold tracking-widest uppercase mb-3">
                <span>EXPLORE MEDIQ &bull; CORE PILLARS</span>
                <span class="inline-block size-1.5 rounded-full bg-sky animate-pulse"></span>
              </p>
              <h2 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-2.5">
                Capabilities, <span class="text-transparent bg-clip-text bg-gradient-to-r from-sky via-[#72c5f8] to-white">Foundation &amp; Values</span>
              </h2>
              <p class="text-xs sm:text-sm lg:text-base text-cream/75 leading-relaxed max-w-2xl mx-auto">
                Comprehensive commercial operations, clinical distribution, and surgical healthcare partnerships across the Philippine archipelago.
              </p>
            </div>

            <!-- 3 Featured Cards (Matching 21st.dev Card Design from Reference) -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 w-full">

              <!-- CARD 1: WHAT WE DO -->
              <div class="group relative rounded-[28px] sm:rounded-[32px] bg-[#071530]/90 border border-sky/25 p-3.5 pb-7 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-sky/50 hover:-translate-y-2 flex flex-col justify-between cursor-pointer ring-1 ring-white/5" onclick="openAboutOverlay('what-we-do')">
                <div>
                  <!-- Top Image Container with Inverted Cutout -->
                  <div class="relative w-full aspect-[4/3] rounded-[22px] sm:rounded-[24px] overflow-hidden bg-black/40">
                    <img src="assets/img/pillars/p1_cleanroom_inspect.jpg" alt="What We Do - Core Capabilities" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 select-none">
                    
                    <div class="absolute top-3.5 right-3.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[11px] font-mono font-bold text-white tracking-wider">
                      6 CAPABILITIES
                    </div>

                    <!-- Cutout Notch -->
                    <div class="card-cutout-notch"></div>

                    <!-- Action Arrow Button -->
                    <button type="button" aria-label="Open What We Do Capabilities Stack" class="absolute bottom-1.5 right-1.5 size-13 rounded-full bg-[#0d2247] border border-sky/35 text-sky group-hover:bg-sky group-hover:text-[#071530] flex items-center justify-center transition-all duration-300 shadow-xl cursor-pointer z-10">
                      <svg class="size-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.3" d="M7 17L17 7M17 7H9M17 7V15" />
                      </svg>
                    </button>
                  </div>

                  <!-- Content -->
                  <div class="px-3 pt-5">
                    <h3 class="text-2xl font-extrabold text-white tracking-tight mb-2 group-hover:text-sky transition-colors">
                      What We Do
                    </h3>
                    <p class="text-sm text-cream/75 leading-relaxed line-clamp-3">
                      End-to-end commercial operations, cold-chain distribution, institutional sales, surgeon training, and responsive support.
                    </p>
                  </div>
                </div>

                <!-- Bottom Tags -->
                <div class="px-3 pt-5 flex flex-wrap gap-2">
                  <span class="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono font-bold tracking-wider uppercase text-sky/90">SUPPLY CHAIN</span>
                  <span class="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono font-bold tracking-wider uppercase text-sky/90">COMMERCIAL</span>
                  <span class="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono font-bold tracking-wider uppercase text-sky/90">EDUCATION</span>
                </div>
              </div>

              <!-- CARD 2: OUR FOUNDATION -->
              <div class="group relative rounded-[28px] sm:rounded-[32px] bg-[#071530]/90 border border-sky/25 p-3.5 pb-7 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-sky/50 hover:-translate-y-2 flex flex-col justify-between cursor-pointer ring-1 ring-white/5" onclick="openAboutOverlay('foundation')">
                <div>
                  <!-- Top Image Container with Inverted Cutout -->
                  <div class="relative w-full aspect-[4/3] rounded-[22px] sm:rounded-[24px] overflow-hidden bg-black/40">
                    <img src="assets/img/pillars/p2_headquarters_brand.jpg" alt="Our Foundation - Rayner UK Partnership" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 select-none">
                    
                    <div class="absolute top-3.5 right-3.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[11px] font-mono font-bold text-white tracking-wider">
                      UK PARTNERSHIP
                    </div>

                    <!-- Cutout Notch -->
                    <div class="card-cutout-notch"></div>

                    <!-- Action Arrow Button -->
                    <button type="button" aria-label="Open Foundation Details" class="absolute bottom-1.5 right-1.5 size-13 rounded-full bg-[#0d2247] border border-sky/35 text-sky group-hover:bg-sky group-hover:text-[#071530] flex items-center justify-center transition-all duration-300 shadow-xl cursor-pointer z-10">
                      <svg class="size-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.3" d="M7 17L17 7M17 7H9M17 7V15" />
                      </svg>
                    </button>
                  </div>

                  <!-- Content -->
                  <div class="px-3 pt-5">
                    <h3 class="text-2xl font-extrabold text-white tracking-tight mb-2 group-hover:text-sky transition-colors">
                      Our Foundation
                    </h3>
                    <p class="text-sm text-cream/75 leading-relaxed line-clamp-3">
                      Established expertise in ophthalmology, serving as the exclusive Philippine distributor for Rayner intraocular lenses from the UK.
                    </p>
                  </div>
                </div>

                <!-- Bottom Tags -->
                <div class="px-3 pt-5 flex flex-wrap gap-2">
                  <span class="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono font-bold tracking-wider uppercase text-sky/90">RAYNER UK</span>
                  <span class="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono font-bold tracking-wider uppercase text-sky/90">100% PRECISION</span>
                  <span class="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono font-bold tracking-wider uppercase text-sky/90">COLD-CHAIN</span>
                </div>
              </div>

              <!-- CARD 3: CORE VALUES -->
              <div class="group relative rounded-[28px] sm:rounded-[32px] bg-[#071530]/90 border border-sky/25 p-3.5 pb-7 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-sky/50 hover:-translate-y-2 flex flex-col justify-between cursor-pointer ring-1 ring-white/5" onclick="openAboutOverlay('values')">
                <div>
                  <!-- Top Image Container with Inverted Cutout -->
                  <div class="relative w-full aspect-[4/3] rounded-[22px] sm:rounded-[24px] overflow-hidden bg-black/40">
                    <img src="assets/img/pillars/p3_commercial_meeting.jpg" alt="Core Values - Clinical Ethics & Leadership" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 select-none">
                    
                    <div class="absolute top-3.5 right-3.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[11px] font-mono font-bold text-white tracking-wider">
                      ETHOS
                    </div>

                    <!-- Cutout Notch -->
                    <div class="card-cutout-notch"></div>

                    <!-- Action Arrow Button -->
                    <button type="button" aria-label="Open Values Details" class="absolute bottom-1.5 right-1.5 size-13 rounded-full bg-[#0d2247] border border-sky/35 text-sky group-hover:bg-sky group-hover:text-[#071530] flex items-center justify-center transition-all duration-300 shadow-xl cursor-pointer z-10">
                      <svg class="size-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.3" d="M7 17L17 7M17 7H9M17 7V15" />
                      </svg>
                    </button>
                  </div>

                  <!-- Content -->
                  <div class="px-3 pt-5">
                    <h3 class="text-2xl font-extrabold text-white tracking-tight mb-2 group-hover:text-sky transition-colors">
                      Core Values
                    </h3>
                    <p class="text-sm text-cream/75 leading-relaxed line-clamp-3">
                      Uncompromising commitment to surgical patient outcomes, regulatory compliance, clinical transparency, and doctor partnerships.
                    </p>
                  </div>
                </div>

                <!-- Bottom Tags -->
                <div class="px-3 pt-5 flex flex-wrap gap-2">
                  <span class="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono font-bold tracking-wider uppercase text-sky/90">INTEGRITY</span>
                  <span class="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono font-bold tracking-wider uppercase text-sky/90">PATIENT-FIRST</span>
                  <span class="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono font-bold tracking-wider uppercase text-sky/90">EXCELLENCE</span>
                </div>
              </div>

            </div>

          </div>

        </div>

        <!-- ========================================================================= -->
        <!-- MODAL OVERLAY 1: WHAT WE DO STACKING CARDS (6 Capabilities Stack)        -->
        <!-- ========================================================================= -->
        <div id="about-overlay-what-we-do" class="fixed inset-0 z-[100] bg-[#050e1f]/95 backdrop-blur-2xl flex flex-col justify-between p-4 sm:p-6 lg:p-8 opacity-0 pointer-events-none transition-all duration-400 ease-out" role="dialog" aria-modal="true" aria-label="What We Do Capabilities">
          
          <!-- Top Header Bar -->
          <div class="relative z-30 shrink-0 w-full max-w-5xl mx-auto flex items-center justify-between pb-3 border-b border-sky/20">
            <div>
              <p class="text-sky font-mono text-[11px] font-bold uppercase tracking-widest">ABOUT MEDIQ &bull; CORE CAPABILITIES</p>
              <h3 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">What We Do</h3>
            </div>
            
            <button type="button" onclick="closeAboutOverlay()" class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-sky text-cream hover:text-[#071530] text-xs font-bold tracking-wider uppercase transition-all duration-300 border border-white/15 hover:border-sky cursor-pointer shadow-lg">
              <span>Back to Overview</span>
              <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <!-- Dedicated Stacking Deck Stage -->
          <div class="relative z-20 w-full max-w-5xl mx-auto flex-1 min-h-[400px] sm:min-h-[440px] max-h-[500px] my-auto flex items-center justify-center">
            <div id="modal-stacking-stage" class="relative w-full h-full">

              <!-- CARD 1 -->
              <div class="modal-stack-card absolute inset-0 w-full h-full rounded-3xl border border-sky/30 bg-[#071530]/95 backdrop-blur-2xl p-6 sm:p-8 lg:p-9 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] ring-1 ring-white/10 flex flex-col lg:flex-row gap-6 lg:gap-8 items-center justify-between transition-all duration-500 ease-out select-none" data-card-idx="0" data-pillar="01" data-title="Strategic Importation &amp; Distribution">
                <div class="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-sky/15 blur-2xl"></div>
                <div class="flex-1 flex flex-col justify-center">
                  <div class="flex items-center gap-2.5 mb-2.5">
                    <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-sky/15 border border-sky/30 text-sky text-[10.5px] font-mono font-bold tracking-wider uppercase">PILLAR 01</span>
                    <span class="text-[11px] uppercase tracking-widest text-[#72c5f8]/80 font-medium">Supply Chain</span>
                  </div>
                  <h4 class="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight mb-2.5">Strategic Importation &amp; Distribution</h4>
                  <p class="text-xs sm:text-sm text-cream/85 leading-relaxed mb-4">Product sourcing, importation coordination, inventory availability, and supply-chain support.</p>
                  <div class="grid grid-cols-2 gap-2 text-xs text-cream/90">
                    <div class="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-1.5"><span class="size-1.5 rounded-full bg-sky"></span><span>Product Sourcing</span></div>
                    <div class="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-1.5"><span class="size-1.5 rounded-full bg-sky"></span><span>Importation Coordination</span></div>
                    <div class="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-1.5"><span class="size-1.5 rounded-full bg-sky"></span><span>Inventory Availability</span></div>
                    <div class="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-1.5"><span class="size-1.5 rounded-full bg-sky"></span><span>Supply-Chain Support</span></div>
                  </div>
                </div>
                <div class="w-full lg:w-1/2 aspect-video rounded-2xl relative overflow-hidden border border-sky/30 shadow-2xl bg-black/60 shrink-0">
                  <img src="assets/img/pillars/p1_cleanroom_inspect.jpg" alt="Strategic Importation" class="w-full h-full object-cover">
                </div>
              </div>

              <!-- CARD 2 -->
              <div class="modal-stack-card absolute inset-0 w-full h-full rounded-3xl border border-sky/30 bg-[#081a3d]/95 backdrop-blur-2xl p-6 sm:p-8 lg:p-9 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] ring-1 ring-white/10 flex flex-col lg:flex-row gap-6 lg:gap-8 items-center justify-between transition-all duration-500 ease-out select-none" data-card-idx="1" data-pillar="02" data-title="Product Marketing &amp; Brand Development">
                <div class="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-[#72c5f8]/15 blur-2xl"></div>
                <div class="flex-1 flex flex-col justify-center">
                  <div class="flex items-center gap-2.5 mb-2.5">
                    <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-sky/15 border border-sky/30 text-sky text-[10.5px] font-mono font-bold tracking-wider uppercase">PILLAR 02</span>
                    <span class="text-[11px] uppercase tracking-widest text-[#72c5f8]/80 font-medium">Marketing &amp; Branding</span>
                  </div>
                  <h4 class="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight mb-2.5">Product Marketing &amp; Brand Development</h4>
                  <p class="text-xs sm:text-sm text-cream/85 leading-relaxed mb-4">Brand positioning, launch campaigns, professional communication, and product awareness.</p>
                  <div class="grid grid-cols-2 gap-2 text-xs text-cream/90">
                    <div class="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-1.5"><span class="size-1.5 rounded-full bg-sky"></span><span>Brand Positioning</span></div>
                    <div class="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-1.5"><span class="size-1.5 rounded-full bg-sky"></span><span>Launch Campaigns</span></div>
                    <div class="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-1.5"><span class="size-1.5 rounded-full bg-sky"></span><span>Professional Communication</span></div>
                    <div class="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-1.5"><span class="size-1.5 rounded-full bg-sky"></span><span>Product Awareness</span></div>
                  </div>
                </div>
                <div class="w-full lg:w-1/2 aspect-video rounded-2xl relative overflow-hidden border border-sky/30 shadow-2xl bg-black/60 shrink-0">
                  <img src="assets/img/pillars/p2_headquarters_brand.jpg" alt="Brand Development" class="w-full h-full object-cover">
                </div>
              </div>

              <!-- CARD 3 -->
              <div class="modal-stack-card absolute inset-0 w-full h-full rounded-3xl border border-sky/30 bg-[#091f47]/95 backdrop-blur-2xl p-6 sm:p-8 lg:p-9 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] ring-1 ring-white/10 flex flex-col lg:flex-row gap-6 lg:gap-8 items-center justify-between transition-all duration-500 ease-out select-none" data-card-idx="2" data-pillar="03" data-title="Sales, Promotion &amp; Commercialization">
                <div class="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-sky/20 blur-2xl"></div>
                <div class="flex-1 flex flex-col justify-center">
                  <div class="flex items-center gap-2.5 mb-2.5">
                    <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-sky/15 border border-sky/30 text-sky text-[10.5px] font-mono font-bold tracking-wider uppercase">PILLAR 03</span>
                    <span class="text-[11px] uppercase tracking-widest text-[#72c5f8]/80 font-medium">Commercialization</span>
                  </div>
                  <h4 class="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight mb-2.5">Sales, Promotion &amp; Commercialization</h4>
                  <p class="text-xs sm:text-sm text-cream/85 leading-relaxed mb-4">Field sales, medical product presentations, institutional account development, and promotional programs.</p>
                  <div class="grid grid-cols-2 gap-2 text-xs text-cream/90">
                    <div class="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-1.5"><span class="size-1.5 rounded-full bg-sky"></span><span>Field Sales</span></div>
                    <div class="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-1.5"><span class="size-1.5 rounded-full bg-sky"></span><span>Medical Presentations</span></div>
                    <div class="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-1.5"><span class="size-1.5 rounded-full bg-sky"></span><span>Institutional Accounts</span></div>
                    <div class="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-1.5"><span class="size-1.5 rounded-full bg-sky"></span><span>Promotional Programs</span></div>
                  </div>
                </div>
                <div class="w-full lg:w-1/2 aspect-video rounded-2xl relative overflow-hidden border border-sky/30 shadow-2xl bg-black/60 shrink-0">
                  <img src="assets/img/pillars/p3_commercial_meeting.jpg" alt="Commercialization" class="w-full h-full object-cover">
                </div>
              </div>

              <!-- CARD 4 -->
              <div class="modal-stack-card absolute inset-0 w-full h-full rounded-3xl border border-sky/30 bg-[#082250]/95 backdrop-blur-2xl p-6 sm:p-8 lg:p-9 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] ring-1 ring-white/10 flex flex-col lg:flex-row gap-6 lg:gap-8 items-center justify-between transition-all duration-500 ease-out select-none" data-card-idx="3" data-pillar="04" data-title="Market Development">
                <div class="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-[#3aa0db]/15 blur-2xl"></div>
                <div class="flex-1 flex flex-col justify-center">
                  <div class="flex items-center gap-2.5 mb-2.5">
                    <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-sky/15 border border-sky/30 text-sky text-[10.5px] font-mono font-bold tracking-wider uppercase">PILLAR 04</span>
                    <span class="text-[11px] uppercase tracking-widest text-[#72c5f8]/80 font-medium">Growth &amp; Expansion</span>
                  </div>
                  <h4 class="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight mb-2.5">Market Development</h4>
                  <p class="text-xs sm:text-sm text-cream/85 leading-relaxed mb-4">Customer insight, segment planning, channel expansion, new account growth, and principal collaboration.</p>
                  <div class="grid grid-cols-2 gap-2 text-xs text-cream/90">
                    <div class="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-1.5"><span class="size-1.5 rounded-full bg-sky"></span><span>Customer Insight</span></div>
                    <div class="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-1.5"><span class="size-1.5 rounded-full bg-sky"></span><span>Segment Planning</span></div>
                    <div class="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-1.5"><span class="size-1.5 rounded-full bg-sky"></span><span>Channel Expansion</span></div>
                    <div class="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-1.5"><span class="size-1.5 rounded-full bg-sky"></span><span>Principal Collaboration</span></div>
                  </div>
                </div>
                <div class="w-full lg:w-1/2 aspect-video rounded-2xl relative overflow-hidden border border-sky/30 shadow-2xl bg-black/60 shrink-0">
                  <img src="assets/img/pillars/p4_customer_growth.jpg" alt="Market Development" class="w-full h-full object-cover">
                </div>
              </div>

              <!-- CARD 5 -->
              <div class="modal-stack-card absolute inset-0 w-full h-full rounded-3xl border border-sky/30 bg-[#0a2354]/95 backdrop-blur-2xl p-6 sm:p-8 lg:p-9 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] ring-1 ring-white/10 flex flex-col lg:flex-row gap-6 lg:gap-8 items-center justify-between transition-all duration-500 ease-out select-none" data-card-idx="4" data-pillar="05" data-title="Professional Education">
                <div class="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-sky/20 blur-2xl"></div>
                <div class="flex-1 flex flex-col justify-center">
                  <div class="flex items-center gap-2.5 mb-2.5">
                    <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-sky/15 border border-sky/30 text-sky text-[10.5px] font-mono font-bold tracking-wider uppercase">PILLAR 05</span>
                    <span class="text-[11px] uppercase tracking-widest text-[#72c5f8]/80 font-medium">Education &amp; Training</span>
                  </div>
                  <h4 class="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight mb-2.5">Professional Education</h4>
                  <p class="text-xs sm:text-sm text-cream/85 leading-relaxed mb-4">Product knowledge training, educational events, demonstrations where appropriate, and technical engagement.</p>
                  <div class="grid grid-cols-2 gap-2 text-xs text-cream/90">
                    <div class="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-1.5"><span class="size-1.5 rounded-full bg-sky"></span><span>Product Knowledge Training</span></div>
                    <div class="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-1.5"><span class="size-1.5 rounded-full bg-sky"></span><span>Educational Events</span></div>
                    <div class="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-1.5"><span class="size-1.5 rounded-full bg-sky"></span><span>Demonstrations</span></div>
                    <div class="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-1.5"><span class="size-1.5 rounded-full bg-sky"></span><span>Technical Engagement</span></div>
                  </div>
                </div>
                <div class="w-full lg:w-1/2 aspect-video rounded-2xl relative overflow-hidden border border-sky/30 shadow-2xl bg-black/60 shrink-0">
                  <img src="assets/img/pillars/p5_microscope_education.jpg" alt="Professional Education" class="w-full h-full object-cover">
                </div>
              </div>

              <!-- CARD 6 -->
              <div class="modal-stack-card absolute inset-0 w-full h-full rounded-3xl border border-sky/30 bg-[#071738]/95 backdrop-blur-2xl p-6 sm:p-8 lg:p-9 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] ring-1 ring-white/10 flex flex-col lg:flex-row gap-6 lg:gap-8 items-center justify-between transition-all duration-500 ease-out select-none" data-card-idx="5" data-pillar="06" data-title="Quality &amp; Customer Support">
                <div class="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-emerald-400/10 blur-2xl"></div>
                <div class="flex-1 flex flex-col justify-center">
                  <div class="flex items-center gap-2.5 mb-2.5">
                    <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-sky/15 border border-sky/30 text-sky text-[10.5px] font-mono font-bold tracking-wider uppercase">PILLAR 06</span>
                    <span class="text-[11px] uppercase tracking-widest text-[#72c5f8]/80 font-medium">Compliance &amp; Support</span>
                  </div>
                  <h4 class="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight mb-2.5">Quality &amp; Customer Support</h4>
                  <p class="text-xs sm:text-sm text-cream/85 leading-relaxed mb-4">Regulatory coordination, traceability, responsible product handling, and responsive after-sales support.</p>
                  <div class="grid grid-cols-2 gap-2 text-xs text-cream/90">
                    <div class="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-1.5"><span class="size-1.5 rounded-full bg-sky"></span><span>Regulatory Coordination</span></div>
                    <div class="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-1.5"><span class="size-1.5 rounded-full bg-sky"></span><span>Traceability</span></div>
                    <div class="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-1.5"><span class="size-1.5 rounded-full bg-sky"></span><span>Responsible Product Handling</span></div>
                    <div class="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-1.5"><span class="size-1.5 rounded-full bg-sky"></span><span>After-Sales Support</span></div>
                  </div>
                </div>
                <div class="w-full lg:w-1/2 aspect-video rounded-2xl relative overflow-hidden border border-sky/30 shadow-2xl bg-black/60 shrink-0">
                  <img src="assets/img/pillars/p6_quality_metrology.jpg" alt="Quality &amp; Support" class="w-full h-full object-cover">
                </div>
              </div>

            </div>
          </div>

          <!-- Bottom Control Bar -->
          <div class="relative z-30 shrink-0 w-full max-w-5xl mx-auto flex items-center justify-between pt-3 text-xs text-cream/70">
            <button id="modal-stack-prev" type="button" aria-label="Previous Card" class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-sky/20 border border-white/10 hover:border-sky/40 text-cream hover:text-white transition-all text-xs font-medium cursor-pointer disabled:opacity-25 disabled:cursor-not-allowed">
              <svg class="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" /></svg>
              <span>Previous</span>
            </button>

            <!-- 6 Dots -->
            <div id="modal-stack-dots" class="flex items-center gap-2">
              <button type="button" data-dot="0" class="modal-dot h-2 w-7 rounded-full bg-sky shadow-[0_0_10px_#3aa0db] transition-all cursor-pointer"></button>
              <button type="button" data-dot="1" class="modal-dot h-2 w-2 rounded-full bg-white/20 hover:bg-white/40 transition-all cursor-pointer"></button>
              <button type="button" data-dot="2" class="modal-dot h-2 w-2 rounded-full bg-white/20 hover:bg-white/40 transition-all cursor-pointer"></button>
              <button type="button" data-dot="3" class="modal-dot h-2 w-2 rounded-full bg-white/20 hover:bg-white/40 transition-all cursor-pointer"></button>
              <button type="button" data-dot="4" class="modal-dot h-2 w-2 rounded-full bg-white/20 hover:bg-white/40 transition-all cursor-pointer"></button>
              <button type="button" data-dot="5" class="modal-dot h-2 w-2 rounded-full bg-white/20 hover:bg-white/40 transition-all cursor-pointer"></button>
            </div>

            <button id="modal-stack-next" type="button" aria-label="Next Card" class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-sky/20 border border-white/10 hover:border-sky/40 text-cream hover:text-white transition-all text-xs font-medium cursor-pointer disabled:opacity-25 disabled:cursor-not-allowed">
              <span>Next</span>
              <svg class="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>

        </div>

        <!-- ========================================================================= -->
        <!-- MODAL OVERLAY 2: OUR FOUNDATION SHOWCASE                                  -->
        <!-- ========================================================================= -->
        <div id="about-overlay-foundation" class="fixed inset-0 z-[100] bg-[#050e1f]/95 backdrop-blur-2xl flex flex-col justify-between p-4 sm:p-6 lg:p-8 opacity-0 pointer-events-none transition-all duration-400 ease-out overflow-y-auto" role="dialog" aria-modal="true" aria-label="Our Foundation Details">
          
          <div class="relative z-30 shrink-0 w-full max-w-5xl mx-auto flex items-center justify-between pb-3 border-b border-sky/20">
            <div>
              <p class="text-sky font-mono text-[11px] font-bold uppercase tracking-widest">ABOUT MEDIQ &bull; HERITAGE &amp; PARTNERSHIP</p>
              <h3 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Our Established Foundation</h3>
            </div>
            
            <button type="button" onclick="closeAboutOverlay()" class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-sky text-cream hover:text-[#071530] text-xs font-bold tracking-wider uppercase transition-all duration-300 border border-white/15 hover:border-sky cursor-pointer shadow-lg">
              <span>Back to Overview</span>
              <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div class="relative z-20 w-full max-w-5xl mx-auto my-auto py-6">
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div class="lg:col-span-7">
                <p class="text-sm sm:text-base lg:text-lg text-cream/90 leading-relaxed mb-6">
                  MEDIQ brings established expertise in ophthalmology and serves as the exclusive Philippine distributor for Rayner intraocular lenses from the United Kingdom.
                </p>

                <div class="grid grid-cols-2 gap-3.5 sm:gap-4 mb-6">
                  <div class="p-4 rounded-2xl bg-[#071530]/80 border border-sky/25 backdrop-blur-xl shadow-lg ring-1 ring-white/5">
                    <div class="text-sky font-bold text-sm sm:text-base font-mono mb-1">100% UK Precision</div>
                    <div class="text-xs text-cream/70 leading-relaxed">Worthing, West Sussex Engineered Intraocular Lenses</div>
                  </div>
                  <div class="p-4 rounded-2xl bg-[#071530]/80 border border-sky/25 backdrop-blur-xl shadow-lg ring-1 ring-white/5">
                    <div class="text-sky font-bold text-sm sm:text-base font-mono mb-1">Nationwide Cold-Chain</div>
                    <div class="text-xs text-cream/70 leading-relaxed">Verified Hospital Logistics &amp; Operating Room Delivery</div>
                  </div>
                </div>

                <div class="rounded-xl border border-sky/30 bg-[#071530]/60 backdrop-blur-md p-3.5 border-l-4 border-l-sky text-xs sm:text-sm text-sky/90 italic">
                  Complementary portfolio expansion is a strategic opportunity and is subject to licensing, ethical regulatory compliance, and partner authorization.
                </div>
              </div>

              <div class="lg:col-span-5 flex justify-center lg:justify-end">
                <div class="relative size-64 sm:size-72 lg:size-80 rounded-full border border-sky/30 bg-[#071530]/85 backdrop-blur-2xl p-6 flex items-center justify-center shadow-[0_0_65px_rgba(58,160,219,0.35)] ring-1 ring-white/10 group">
                  <div class="pointer-events-none absolute inset-0 rounded-full bg-radial from-sky/30 via-transparent to-transparent"></div>
                  <img src="assets/img/about-crystal-lens.png" alt="Rayner UK Partnership" class="max-w-[240px] sm:max-w-[280px] w-full object-contain drop-shadow-[0_20px_40px_rgba(58,160,219,0.50)] group-hover:scale-105 transition-transform duration-500" />
                  <div class="absolute -bottom-3 px-4 py-1.5 rounded-full bg-[#0a1d40]/95 border border-sky/40 text-[11px] font-mono font-bold text-sky uppercase tracking-wider backdrop-blur-md shadow-xl">
                    Rayner UK &bull; Official Partner
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="text-center text-xs text-cream/50 py-2">
            Click &quot;Back to Overview&quot; or press ESC to return
          </div>
        </div>

        <!-- ========================================================================= -->
        <!-- MODAL OVERLAY 3: CORE VALUES SHOWCASE                                     -->
        <!-- ========================================================================= -->
        <div id="about-overlay-values" class="fixed inset-0 z-[100] bg-[#050e1f]/95 backdrop-blur-2xl flex flex-col justify-between p-4 sm:p-6 lg:p-8 opacity-0 pointer-events-none transition-all duration-400 ease-out overflow-y-auto" role="dialog" aria-modal="true" aria-label="Core Values Details">
          
          <div class="relative z-30 shrink-0 w-full max-w-5xl mx-auto flex items-center justify-between pb-3 border-b border-sky/20">
            <div>
              <p class="text-sky font-mono text-[11px] font-bold uppercase tracking-widest">ABOUT MEDIQ &bull; CORPORATE ETHOS</p>
              <h3 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Our Core Values</h3>
            </div>
            
            <button type="button" onclick="closeAboutOverlay()" class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-sky text-cream hover:text-[#071530] text-xs font-bold tracking-wider uppercase transition-all duration-300 border border-white/15 hover:border-sky cursor-pointer shadow-lg">
              <span>Back to Overview</span>
              <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div class="relative z-20 w-full max-w-5xl mx-auto my-auto py-6">
            <div class="grid grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-4">
              
              <div class="rounded-2xl border border-sky/20 bg-[#071530]/80 p-5 text-center flex flex-col items-center shadow-lg ring-1 ring-white/5">
                <div class="size-11 rounded-full bg-sky/15 border border-sky/30 flex items-center justify-center text-sky font-bold text-sm mb-3">01</div>
                <h4 class="font-bold text-white text-base mb-1">Clinical Outcomes</h4>
                <p class="text-xs text-cream/70 leading-relaxed">Prioritizing surgical safety, optical precision, and patient vision.</p>
              </div>

              <div class="rounded-2xl border border-sky/20 bg-[#071530]/80 p-5 text-center flex flex-col items-center shadow-lg ring-1 ring-white/5">
                <div class="size-11 rounded-full bg-sky/15 border border-sky/30 flex items-center justify-center text-sky font-bold text-sm mb-3">02</div>
                <h4 class="font-bold text-white text-base mb-1">Integrity</h4>
                <p class="text-xs text-cream/70 leading-relaxed">Uncompromising regulatory standards, ethical sourcing, and transparency.</p>
              </div>

              <div class="rounded-2xl border border-sky/20 bg-[#071530]/80 p-5 text-center flex flex-col items-center shadow-lg ring-1 ring-white/5">
                <div class="size-11 rounded-full bg-sky/15 border border-sky/30 flex items-center justify-center text-sky font-bold text-sm mb-3">03</div>
                <h4 class="font-bold text-white text-base mb-1">Reliability</h4>
                <p class="text-xs text-cream/70 leading-relaxed">Guaranteed hospital logistics, cold-chain consistency, and on-time fulfillment.</p>
              </div>

              <div class="rounded-2xl border border-sky/20 bg-[#071530]/80 p-5 text-center flex flex-col items-center shadow-lg ring-1 ring-white/5">
                <div class="size-11 rounded-full bg-sky/15 border border-sky/30 flex items-center justify-center text-sky font-bold text-sm mb-3">04</div>
                <h4 class="font-bold text-white text-base mb-1">Partnership</h4>
                <p class="text-xs text-cream/70 leading-relaxed">Collaborative alliances with clinical practitioners, surgical societies, and Rayner.</p>
              </div>

              <div class="rounded-2xl border border-sky/20 bg-[#071530]/80 p-5 text-center flex flex-col items-center shadow-lg ring-1 ring-white/5">
                <div class="size-11 rounded-full bg-sky/15 border border-sky/30 flex items-center justify-center text-sky font-bold text-sm mb-3">05</div>
                <h4 class="font-bold text-white text-base mb-1">Precision</h4>
                <p class="text-xs text-cream/70 leading-relaxed">Continuous technical education, wet labs, and micro-incision alignment.</p>
              </div>

              <div class="rounded-2xl border border-sky/20 bg-[#071530]/80 p-5 text-center flex flex-col items-center shadow-lg ring-1 ring-white/5">
                <div class="size-11 rounded-full bg-sky/15 border border-sky/30 flex items-center justify-center text-sky font-bold text-sm mb-3">06</div>
                <h4 class="font-bold text-white text-base mb-1">Responsiveness</h4>
                <p class="text-xs text-cream/70 leading-relaxed">Rapid surgeon assistance, operating room consignment, and after-sales support.</p>
              </div>

            </div>
          </div>

          <div class="text-center text-xs text-cream/50 py-2">
            Click &quot;Back to Overview&quot; or press ESC to return
          </div>
        </div>
'''

new_content = content[:start_idx] + new_slide_2_and_overlays + content[end_idx:]

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Replaced Slide 2 with 21st.dev 3-card layout & overlays successfully!")

