import re

with open("index.html", "r", encoding="utf-8") as f:
    content = f.read()

# Pattern for Slide 2
pattern = re.compile(
    r'(<!--\s*===+\s*-->\s*<!--\s*SLIDE 3: WHAT WE DO.*?-->\s*<!--\s*===+\s*-->\s*)'
    r'(<div id="about-slide-what-we-do" [^>]*?>)(.*?)'
    r'(</div>\s*(?=<!--\s*===+\s*-->\s*<!--\s*SLIDE 4: OUR ESTABLISHED FOUNDATION))',
    re.DOTALL
)

match = pattern.search(content)
if not match:
    print("Error: Could not find Slide 2 match in index.html")
    exit(1)

slide_header = match.group(1)

new_slide2 = '''<!-- ========================================================================= -->
        <!-- SLIDE 3: WHAT WE DO (Fixed Header + Dedicated Stacking Viewport)             -->
        <!-- ========================================================================= -->
        <div id="about-slide-what-we-do" class="about-slide absolute inset-0 w-full h-full flex flex-col bg-transparent text-cream px-4 sm:px-8 lg:px-16 pt-16 sm:pt-20 pb-4 overflow-hidden transition-all duration-500 ease-out opacity-0 pointer-events-none translate-x-12 z-0" data-index="2">
          
          <!-- Ambient Luminous Glows -->
          <div class="pointer-events-none absolute -left-20 top-1/4 h-[32rem] w-[32rem] rounded-full bg-sky/15 blur-[160px]"></div>
          <div class="pointer-events-none absolute right-0 top-1/3 h-[36rem] w-[36rem] rounded-full bg-[#11326c]/45 blur-[180px]"></div>
          <!-- Blueprint / Dot Matrix Grid matching Deck Style -->
          <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(#3aa0db_1px,transparent_1px)] [background-size:24px_24px] opacity-15"></div>

          <!-- Fixed Header (Permanently pinned at top, zero box background, zero card overlay) -->
          <div class="relative z-30 shrink-0 text-center max-w-3xl mx-auto pb-4">
            <h2 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-2">
              What <span class="text-transparent bg-clip-text bg-gradient-to-r from-sky via-[#72c5f8] to-white">We Do</span>
            </h2>
            <p class="text-xs sm:text-sm text-cream/75 leading-relaxed max-w-2xl mx-auto">
              Comprehensive commercial operations, clinical distribution, and surgical healthcare partnerships across the Philippine archipelago.
            </p>

            <!-- Interactive Stacking Card Scroll Hint -->
            <div class="mt-3 inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#071530]/80 border border-sky/20 text-[11px] font-semibold text-sky uppercase tracking-wider backdrop-blur-md">
              <span>Scroll down to stack all 6 capabilities</span>
              <svg class="size-3.5 animate-bounce text-[#72c5f8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>

          <!-- Dedicated Scrollable Viewport (Cards scroll & stack cleanly below the header) -->
          <div id="about-stacking-scroll-viewport" class="relative z-20 flex-1 w-full overflow-y-auto overflow-x-hidden scroll-smooth pt-2 pb-16">
            
            <div id="stacking-cards-container" class="relative w-full max-w-6xl mx-auto pb-24">

              <!-- CARD 1: Strategic Importation & Distribution -->
              <div class="stacking-card-item sticky mb-[65vh] sm:mb-[75vh] transition-transform duration-300 ease-out" style="top: 10px; z-index: 10;">
                <div class="stacking-card-inner relative overflow-hidden rounded-3xl border border-sky/30 bg-[#071530]/95 backdrop-blur-2xl p-6 sm:p-8 lg:p-10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] ring-1 ring-white/10 hover:border-sky/50 transition-all flex flex-col lg:flex-row gap-6 lg:gap-10 items-center min-h-[380px] sm:min-h-[420px]">
                  <div class="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-sky/15 blur-2xl"></div>

                  <!-- Text Column -->
                  <div class="flex-1 flex flex-col justify-center">
                    <div class="flex items-center gap-2.5 mb-2.5">
                      <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-sky/15 border border-sky/30 text-sky text-[10.5px] font-mono font-bold tracking-wider uppercase">
                        PILLAR 01
                      </span>
                      <span class="text-[11px] uppercase tracking-widest text-[#72c5f8]/80 font-medium">Supply Chain</span>
                    </div>

                    <h3 class="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight mb-3">
                      Strategic Importation &amp; Distribution
                    </h3>

                    <p class="text-xs sm:text-sm text-cream/85 leading-relaxed mb-5">
                      Product sourcing, importation coordination, inventory availability, and supply-chain support.
                    </p>

                    <!-- Feature Badges -->
                    <div class="grid grid-cols-2 gap-2 text-xs text-cream/90">
                      <div class="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-1.5">
                        <span class="size-1.5 rounded-full bg-sky shrink-0"></span>
                        <span>Product Sourcing</span>
                      </div>
                      <div class="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-1.5">
                        <span class="size-1.5 rounded-full bg-sky shrink-0"></span>
                        <span>Importation Coordination</span>
                      </div>
                      <div class="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-1.5">
                        <span class="size-1.5 rounded-full bg-sky shrink-0"></span>
                        <span>Inventory Availability</span>
                      </div>
                      <div class="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-1.5">
                        <span class="size-1.5 rounded-full bg-sky shrink-0"></span>
                        <span>Supply-Chain Support</span>
                      </div>
                    </div>
                  </div>

                  <!-- Image Column -->
                  <div class="w-full lg:w-1/2 aspect-video rounded-2xl relative overflow-hidden border border-sky/30 shadow-2xl bg-black/60 group">
                    <img src="assets/img/pillars/p1_cleanroom_inspect.jpg" alt="Strategic Importation &amp; Distribution - Cleanroom Cold-Chain Packaging" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 select-none" loading="lazy">
                  </div>
                </div>
              </div>

              <!-- CARD 2: Product Marketing & Brand Development -->
              <div class="stacking-card-item sticky mb-[65vh] sm:mb-[75vh] transition-transform duration-300 ease-out" style="top: 25px; z-index: 20;">
                <div class="stacking-card-inner relative overflow-hidden rounded-3xl border border-sky/30 bg-[#081a3d]/95 backdrop-blur-2xl p-6 sm:p-8 lg:p-10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] ring-1 ring-white/10 hover:border-sky/50 transition-all flex flex-col lg:flex-row gap-6 lg:gap-10 items-center min-h-[380px] sm:min-h-[420px]">
                  <div class="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-[#72c5f8]/15 blur-2xl"></div>

                  <!-- Text Column -->
                  <div class="flex-1 flex flex-col justify-center">
                    <div class="flex items-center gap-2.5 mb-2.5">
                      <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-sky/15 border border-sky/30 text-sky text-[10.5px] font-mono font-bold tracking-wider uppercase">
                        PILLAR 02
                      </span>
                      <span class="text-[11px] uppercase tracking-widest text-[#72c5f8]/80 font-medium">Marketing &amp; Branding</span>
                    </div>

                    <h3 class="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight mb-3">
                      Product Marketing &amp; Brand Development
                    </h3>

                    <p class="text-xs sm:text-sm text-cream/85 leading-relaxed mb-5">
                      Brand positioning, launch campaigns, professional communication, and product awareness.
                    </p>

                    <!-- Feature Badges -->
                    <div class="grid grid-cols-2 gap-2 text-xs text-cream/90">
                      <div class="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-1.5">
                        <span class="size-1.5 rounded-full bg-sky shrink-0"></span>
                        <span>Brand Positioning</span>
                      </div>
                      <div class="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-1.5">
                        <span class="size-1.5 rounded-full bg-sky shrink-0"></span>
                        <span>Launch Campaigns</span>
                      </div>
                      <div class="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-1.5">
                        <span class="size-1.5 rounded-full bg-sky shrink-0"></span>
                        <span>Professional Communication</span>
                      </div>
                      <div class="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-1.5">
                        <span class="size-1.5 rounded-full bg-sky shrink-0"></span>
                        <span>Product Awareness</span>
                      </div>
                    </div>
                  </div>

                  <!-- Image Column -->
                  <div class="w-full lg:w-1/2 aspect-video rounded-2xl relative overflow-hidden border border-sky/30 shadow-2xl bg-black/60 group">
                    <img src="assets/img/pillars/p2_headquarters_brand.jpg" alt="Product Marketing &amp; Brand Development - Rayner Global Headquarters" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 select-none" loading="lazy">
                  </div>
                </div>
              </div>

              <!-- CARD 3: Sales, Promotion & Commercialization -->
              <div class="stacking-card-item sticky mb-[65vh] sm:mb-[75vh] transition-transform duration-300 ease-out" style="top: 40px; z-index: 30;">
                <div class="stacking-card-inner relative overflow-hidden rounded-3xl border border-sky/30 bg-[#091f47]/95 backdrop-blur-2xl p-6 sm:p-8 lg:p-10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] ring-1 ring-white/10 hover:border-sky/50 transition-all flex flex-col lg:flex-row gap-6 lg:gap-10 items-center min-h-[380px] sm:min-h-[420px]">
                  <div class="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-sky/20 blur-2xl"></div>

                  <!-- Text Column -->
                  <div class="flex-1 flex flex-col justify-center">
                    <div class="flex items-center gap-2.5 mb-2.5">
                      <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-sky/15 border border-sky/30 text-sky text-[10.5px] font-mono font-bold tracking-wider uppercase">
                        PILLAR 03
                      </span>
                      <span class="text-[11px] uppercase tracking-widest text-[#72c5f8]/80 font-medium">Commercialization</span>
                    </div>

                    <h3 class="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight mb-3">
                      Sales, Promotion &amp; Commercialization
                    </h3>

                    <p class="text-xs sm:text-sm text-cream/85 leading-relaxed mb-5">
                      Field sales, medical product presentations, institutional account development, and promotional programs.
                    </p>

                    <!-- Feature Badges -->
                    <div class="grid grid-cols-2 gap-2 text-xs text-cream/90">
                      <div class="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-1.5">
                        <span class="size-1.5 rounded-full bg-sky shrink-0"></span>
                        <span>Field Sales</span>
                      </div>
                      <div class="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-1.5">
                        <span class="size-1.5 rounded-full bg-sky shrink-0"></span>
                        <span>Medical Presentations</span>
                      </div>
                      <div class="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-1.5">
                        <span class="size-1.5 rounded-full bg-sky shrink-0"></span>
                        <span>Institutional Accounts</span>
                      </div>
                      <div class="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-1.5">
                        <span class="size-1.5 rounded-full bg-sky shrink-0"></span>
                        <span>Promotional Programs</span>
                      </div>
                    </div>
                  </div>

                  <!-- Image Column -->
                  <div class="w-full lg:w-1/2 aspect-video rounded-2xl relative overflow-hidden border border-sky/30 shadow-2xl bg-black/60 group">
                    <img src="assets/img/pillars/p3_commercial_meeting.jpg" alt="Sales, Promotion &amp; Commercialization - Hospital &amp; Commercial Presentations" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 select-none" loading="lazy">
                  </div>
                </div>
              </div>

              <!-- CARD 4: Market Development -->
              <div class="stacking-card-item sticky mb-[65vh] sm:mb-[75vh] transition-transform duration-300 ease-out" style="top: 55px; z-index: 40;">
                <div class="stacking-card-inner relative overflow-hidden rounded-3xl border border-sky/30 bg-[#082250]/95 backdrop-blur-2xl p-6 sm:p-8 lg:p-10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] ring-1 ring-white/10 hover:border-sky/50 transition-all flex flex-col lg:flex-row gap-6 lg:gap-10 items-center min-h-[380px] sm:min-h-[420px]">
                  <div class="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-[#3aa0db]/15 blur-2xl"></div>

                  <!-- Text Column -->
                  <div class="flex-1 flex flex-col justify-center">
                    <div class="flex items-center gap-2.5 mb-2.5">
                      <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-sky/15 border border-sky/30 text-sky text-[10.5px] font-mono font-bold tracking-wider uppercase">
                        PILLAR 04
                      </span>
                      <span class="text-[11px] uppercase tracking-widest text-[#72c5f8]/80 font-medium">Growth &amp; Expansion</span>
                    </div>

                    <h3 class="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight mb-3">
                      Market Development
                    </h3>

                    <p class="text-xs sm:text-sm text-cream/85 leading-relaxed mb-5">
                      Customer insight, segment planning, channel expansion, new account growth, and principal collaboration.
                    </p>

                    <!-- Feature Badges -->
                    <div class="grid grid-cols-2 gap-2 text-xs text-cream/90">
                      <div class="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-1.5">
                        <span class="size-1.5 rounded-full bg-sky shrink-0"></span>
                        <span>Customer Insight</span>
                      </div>
                      <div class="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-1.5">
                        <span class="size-1.5 rounded-full bg-sky shrink-0"></span>
                        <span>Segment Planning</span>
                      </div>
                      <div class="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-1.5">
                        <span class="size-1.5 rounded-full bg-sky shrink-0"></span>
                        <span>Channel Expansion</span>
                      </div>
                      <div class="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-1.5">
                        <span class="size-1.5 rounded-full bg-sky shrink-0"></span>
                        <span>Principal Collaboration</span>
                      </div>
                    </div>
                  </div>

                  <!-- Image Column -->
                  <div class="w-full lg:w-1/2 aspect-video rounded-2xl relative overflow-hidden border border-sky/30 shadow-2xl bg-black/60 group">
                    <img src="assets/img/pillars/p4_customer_growth.jpg" alt="Market Development - Global Healthcare Network &amp; Expansion" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 select-none" loading="lazy">
                  </div>
                </div>
              </div>

              <!-- CARD 5: Professional Education -->
              <div class="stacking-card-item sticky mb-[65vh] sm:mb-[75vh] transition-transform duration-300 ease-out" style="top: 70px; z-index: 50;">
                <div class="stacking-card-inner relative overflow-hidden rounded-3xl border border-sky/30 bg-[#0a2354]/95 backdrop-blur-2xl p-6 sm:p-8 lg:p-10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] ring-1 ring-white/10 hover:border-sky/50 transition-all flex flex-col lg:flex-row gap-6 lg:gap-10 items-center min-h-[380px] sm:min-h-[420px]">
                  <div class="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-sky/20 blur-2xl"></div>

                  <!-- Text Column -->
                  <div class="flex-1 flex flex-col justify-center">
                    <div class="flex items-center gap-2.5 mb-2.5">
                      <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-sky/15 border border-sky/30 text-sky text-[10.5px] font-mono font-bold tracking-wider uppercase">
                        PILLAR 05
                      </span>
                      <span class="text-[11px] uppercase tracking-widest text-[#72c5f8]/80 font-medium">Education &amp; Training</span>
                    </div>

                    <h3 class="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight mb-3">
                      Professional Education
                    </h3>

                    <p class="text-xs sm:text-sm text-cream/85 leading-relaxed mb-5">
                      Product knowledge training, educational events, demonstrations where appropriate, and technical engagement.
                    </p>

                    <!-- Feature Badges -->
                    <div class="grid grid-cols-2 gap-2 text-xs text-cream/90">
                      <div class="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-1.5">
                        <span class="size-1.5 rounded-full bg-sky shrink-0"></span>
                        <span>Product Knowledge Training</span>
                      </div>
                      <div class="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-1.5">
                        <span class="size-1.5 rounded-full bg-sky shrink-0"></span>
                        <span>Educational Events</span>
                      </div>
                      <div class="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-1.5">
                        <span class="size-1.5 rounded-full bg-sky shrink-0"></span>
                        <span>Demonstrations</span>
                      </div>
                      <div class="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-1.5">
                        <span class="size-1.5 rounded-full bg-sky shrink-0"></span>
                        <span>Technical Engagement</span>
                      </div>
                    </div>
                  </div>

                  <!-- Image Column -->
                  <div class="w-full lg:w-1/2 aspect-video rounded-2xl relative overflow-hidden border border-sky/30 shadow-2xl bg-black/60 group">
                    <img src="assets/img/pillars/p5_microscope_education.jpg" alt="Professional Education - Surgeon Microscope Demonstrations &amp; Training" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 select-none" loading="lazy">
                  </div>
                </div>
              </div>

              <!-- CARD 6: Quality & Customer Support -->
              <div class="stacking-card-item sticky mb-16 transition-transform duration-300 ease-out" style="top: 85px; z-index: 60;">
                <div class="stacking-card-inner relative overflow-hidden rounded-3xl border border-sky/30 bg-[#071738]/95 backdrop-blur-2xl p-6 sm:p-8 lg:p-10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] ring-1 ring-white/10 hover:border-sky/50 transition-all flex flex-col lg:flex-row gap-6 lg:gap-10 items-center min-h-[380px] sm:min-h-[420px]">
                  <div class="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-emerald-400/10 blur-2xl"></div>

                  <!-- Text Column -->
                  <div class="flex-1 flex flex-col justify-center">
                    <div class="flex items-center gap-2.5 mb-2.5">
                      <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-sky/15 border border-sky/30 text-sky text-[10.5px] font-mono font-bold tracking-wider uppercase">
                        PILLAR 06
                      </span>
                      <span class="text-[11px] uppercase tracking-widest text-[#72c5f8]/80 font-medium">Compliance &amp; Support</span>
                    </div>

                    <h3 class="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight mb-3">
                      Quality &amp; Customer Support
                    </h3>

                    <p class="text-xs sm:text-sm text-cream/85 leading-relaxed mb-5">
                      Regulatory coordination, traceability, responsible product handling, and responsive after-sales support.
                    </p>

                    <!-- Feature Badges -->
                    <div class="grid grid-cols-2 gap-2 text-xs text-cream/90">
                      <div class="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-1.5">
                        <span class="size-1.5 rounded-full bg-sky shrink-0"></span>
                        <span>Regulatory Coordination</span>
                      </div>
                      <div class="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-1.5">
                        <span class="size-1.5 rounded-full bg-sky shrink-0"></span>
                        <span>Traceability</span>
                      </div>
                      <div class="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-1.5">
                        <span class="size-1.5 rounded-full bg-sky shrink-0"></span>
                        <span>Responsible Product Handling</span>
                      </div>
                      <div class="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-1.5">
                        <span class="size-1.5 rounded-full bg-sky shrink-0"></span>
                        <span>After-Sales Support</span>
                      </div>
                    </div>
                  </div>

                  <!-- Image Column -->
                  <div class="w-full lg:w-1/2 aspect-video rounded-2xl relative overflow-hidden border border-sky/30 shadow-2xl bg-black/60 group">
                    <img src="assets/img/pillars/p6_quality_metrology.jpg" alt="Quality &amp; Customer Support - Precision Optical Metrology &amp; ISO Standards" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 select-none" loading="lazy">
                  </div>
                </div>
              </div>

            </div>

            <!-- Bottom Technical Stamp -->
            <div class="w-full max-w-6xl mx-auto py-6 border-t border-sky/20 flex flex-col sm:flex-row items-center justify-between text-xs text-cream/60 gap-4 mt-6">
              <span class="tracking-widest uppercase font-mono text-[10.5px] text-sky/80">MEDIQ PHARMA AND MEDICAL SUPPLIES DISTRIBUTION</span>
              <span class="font-sans text-[11.5px] text-cream/70">Partnering with Rayner &bull; Worthing, United Kingdom</span>
            </div>

          </div>
        </div>
'''

new_content = pattern.sub(new_slide2, content)

with open("index.html", "w", encoding="utf-8") as f:
    f.write(new_content)

print("Applied separated viewport architecture to index.html successfully.")

