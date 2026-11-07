import re

html_slide2 = '''        <!-- ========================================================================= -->
        <!-- SLIDE 3: WHAT WE DO (6 Stacking Cards - 100% Watermark-Free Footage)         -->
        <!-- ========================================================================= -->
        <div id="about-slide-what-we-do" class="about-slide absolute inset-0 w-full h-full block bg-[#0a1d40] text-cream px-4 sm:px-8 lg:px-16 pt-20 pb-28 overflow-y-auto transition-all duration-500 ease-out opacity-0 pointer-events-none translate-x-12 z-0 scroll-smooth" data-index="2">
          
          <!-- Ambient Luminous Glows -->
          <div class="pointer-events-none absolute -left-20 top-1/4 h-[32rem] w-[32rem] rounded-full bg-sky/15 blur-[160px]"></div>
          <div class="pointer-events-none absolute right-0 top-1/3 h-[36rem] w-[36rem] rounded-full bg-[#11326c]/45 blur-[180px]"></div>
          <!-- Blueprint / Dot Matrix Grid matching Deck Style -->
          <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(#3aa0db_1px,transparent_1px)] [background-size:24px_24px] opacity-15"></div>

          <div class="relative z-10 mx-auto w-full max-w-6xl">
            
            <!-- Eyebrow Pill & Header -->
            <div class="text-center max-w-3xl mx-auto mb-10 pt-4">
              <p class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky/10 border border-sky/30 text-sky text-[11px] font-bold tracking-widest uppercase mb-3 shadow-[0_0_20px_rgba(58,160,219,0.2)]">
                <span>ABOUT MEDIQ &bull; CORE CAPABILITIES</span>
                <span class="inline-block h-1.5 w-1.5 rounded-full bg-sky animate-ping"></span>
              </p>
              <h2 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-3">
                What <span class="text-transparent bg-clip-text bg-gradient-to-r from-sky via-[#72c5f8] to-white">We Do</span>
              </h2>
              <p class="text-xs sm:text-sm text-cream/75 leading-relaxed max-w-2xl mx-auto">
                Comprehensive commercial operations, clinical distribution, and surgical healthcare partnerships across the Philippine archipelago.
              </p>

              <!-- Interactive Stacking Card Scroll Hint -->
              <div class="mt-5 inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#071530]/80 border border-sky/20 text-[11px] font-semibold text-sky uppercase tracking-wider backdrop-blur-md">
                <span>Scroll down to stack all 6 capabilities</span>
                <svg class="size-3.5 animate-bounce text-[#72c5f8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
            </div>

            <!-- Stacking Cards Container -->
            <div id="stacking-cards-container" class="relative w-full space-y-10 pb-24">

              <!-- CARD 1: Strategic Importation & Distribution -->
              <div class="stacking-card-item sticky transition-transform duration-300 ease-out" style="top: 75px; z-index: 10;">
                <div class="stacking-card-inner relative overflow-hidden rounded-3xl border border-sky/30 bg-[#071530]/95 backdrop-blur-2xl p-6 sm:p-7 lg:p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] ring-1 ring-white/10 hover:border-sky/50 transition-all flex flex-col lg:flex-row gap-6 lg:gap-8 items-center">
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

                  <!-- Video Column -->
                  <div class="w-full lg:w-1/2 aspect-video rounded-2xl relative overflow-hidden border border-sky/30 shadow-2xl bg-black/60 group">
                    <video src="assets/video/about-rayner.mp4#t=25" autoplay loop muted playsinline class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"></video>
                    <div class="absolute inset-0 bg-gradient-to-t from-[#071530]/80 via-transparent to-black/20 pointer-events-none"></div>
                    <div class="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-white">
                      <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#071530]/85 border border-sky/30 backdrop-blur-md">
                        <span class="size-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span class="font-medium tracking-wide">Rayner Worthing UK Cleanroom &amp; Logistics</span>
                      </span>
                      <span class="text-sky font-mono font-semibold">Supply-Chain Support</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- CARD 2: Product Marketing & Brand Development -->
              <div class="stacking-card-item sticky transition-transform duration-300 ease-out" style="top: 92px; z-index: 20;">
                <div class="stacking-card-inner relative overflow-hidden rounded-3xl border border-sky/30 bg-[#081a3d]/95 backdrop-blur-2xl p-6 sm:p-7 lg:p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] ring-1 ring-white/10 hover:border-sky/50 transition-all flex flex-col lg:flex-row gap-6 lg:gap-8 items-center">
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

                  <!-- Video Column -->
                  <div class="w-full lg:w-1/2 aspect-video rounded-2xl relative overflow-hidden border border-sky/30 shadow-2xl bg-black/60 group">
                    <video src="assets/video/about-rayner.mp4#t=4" autoplay loop muted playsinline class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"></video>
                    <div class="absolute inset-0 bg-gradient-to-t from-[#071530]/80 via-transparent to-black/20 pointer-events-none"></div>
                    <div class="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-white">
                      <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#071530]/85 border border-sky/30 backdrop-blur-md">
                        <span class="size-1.5 rounded-full bg-sky animate-pulse"></span>
                        <span class="font-medium tracking-wide">Rayner Global Headquarters &amp; Brand Innovation</span>
                      </span>
                      <span class="text-sky font-mono font-semibold">Product Awareness</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- CARD 3: Sales, Promotion & Commercialization -->
              <div class="stacking-card-item sticky transition-transform duration-300 ease-out" style="top: 109px; z-index: 30;">
                <div class="stacking-card-inner relative overflow-hidden rounded-3xl border border-sky/30 bg-[#091f47]/95 backdrop-blur-2xl p-6 sm:p-7 lg:p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] ring-1 ring-white/10 hover:border-sky/50 transition-all flex flex-col lg:flex-row gap-6 lg:gap-8 items-center">
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

                  <!-- Video Column -->
                  <div class="w-full lg:w-1/2 aspect-video rounded-2xl relative overflow-hidden border border-sky/30 shadow-2xl bg-black/60 group">
                    <video src="assets/video/about-rayner.mp4#t=112" autoplay loop muted playsinline class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"></video>
                    <div class="absolute inset-0 bg-gradient-to-t from-[#071530]/80 via-transparent to-black/20 pointer-events-none"></div>
                    <div class="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-white">
                      <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#071530]/85 border border-sky/30 backdrop-blur-md">
                        <span class="size-1.5 rounded-full bg-[#72c5f8] animate-pulse"></span>
                        <span class="font-medium tracking-wide">Institutional Account Operations</span>
                      </span>
                      <span class="text-sky font-mono font-semibold">Active Commercialization</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- CARD 4: Market Development -->
              <div class="stacking-card-item sticky transition-transform duration-300 ease-out" style="top: 126px; z-index: 40;">
                <div class="stacking-card-inner relative overflow-hidden rounded-3xl border border-sky/30 bg-[#082250]/95 backdrop-blur-2xl p-6 sm:p-7 lg:p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] ring-1 ring-white/10 hover:border-sky/50 transition-all flex flex-col lg:flex-row gap-6 lg:gap-8 items-center">
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

                  <!-- Video Column -->
                  <div class="w-full lg:w-1/2 aspect-video rounded-2xl relative overflow-hidden border border-sky/30 shadow-2xl bg-black/60 group">
                    <video src="assets/video/about-rayner.mp4#t=145" autoplay loop muted playsinline class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"></video>
                    <div class="absolute inset-0 bg-gradient-to-t from-[#071530]/80 via-transparent to-black/20 pointer-events-none"></div>
                    <div class="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-white">
                      <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#071530]/85 border border-sky/30 backdrop-blur-md">
                        <span class="size-1.5 rounded-full bg-sky animate-pulse"></span>
                        <span class="font-medium tracking-wide">Global Healthcare Network &amp; Expansion</span>
                      </span>
                      <span class="text-sky font-mono font-semibold">New Account Growth</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- CARD 5: Professional Education -->
              <div class="stacking-card-item sticky transition-transform duration-300 ease-out" style="top: 143px; z-index: 50;">
                <div class="stacking-card-inner relative overflow-hidden rounded-3xl border border-sky/30 bg-[#0a2354]/95 backdrop-blur-2xl p-6 sm:p-7 lg:p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] ring-1 ring-white/10 hover:border-sky/50 transition-all flex flex-col lg:flex-row gap-6 lg:gap-8 items-center">
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

                  <!-- Video Column -->
                  <div class="w-full lg:w-1/2 aspect-video rounded-2xl relative overflow-hidden border border-sky/30 shadow-2xl bg-black/60 group">
                    <video src="assets/video/about-rayner.mp4#t=88" autoplay loop muted playsinline class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"></video>
                    <div class="absolute inset-0 bg-gradient-to-t from-[#071530]/80 via-transparent to-black/20 pointer-events-none"></div>
                    <div class="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-white">
                      <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#071530]/85 border border-sky/30 backdrop-blur-md">
                        <span class="size-1.5 rounded-full bg-[#72c5f8] animate-pulse"></span>
                        <span class="font-medium tracking-wide">Surgeon Demonstrations &amp; Clinical Training</span>
                      </span>
                      <span class="text-sky font-mono font-semibold">Technical Engagement</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- CARD 6: Quality & Customer Support -->
              <div class="stacking-card-item sticky transition-transform duration-300 ease-out" style="top: 160px; z-index: 60;">
                <div class="stacking-card-inner relative overflow-hidden rounded-3xl border border-sky/30 bg-[#071738]/95 backdrop-blur-2xl p-6 sm:p-7 lg:p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] ring-1 ring-white/10 hover:border-sky/50 transition-all flex flex-col lg:flex-row gap-6 lg:gap-8 items-center">
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

                  <!-- Video Column -->
                  <div class="w-full lg:w-1/2 aspect-video rounded-2xl relative overflow-hidden border border-sky/30 shadow-2xl bg-black/60 group">
                    <video src="assets/video/about-rayner.mp4#t=58" autoplay loop muted playsinline class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"></video>
                    <div class="absolute inset-0 bg-gradient-to-t from-[#071530]/80 via-transparent to-black/20 pointer-events-none"></div>
                    <div class="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-white">
                      <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#071530]/85 border border-sky/30 backdrop-blur-md">
                        <span class="size-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span class="font-medium tracking-wide">ISO 13485 Standards &amp; Optical Metrology</span>
                      </span>
                      <span class="text-sky font-mono font-semibold">After-Sales Support</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <!-- Bottom Technical Stamp -->
            <div class="w-full py-6 border-t border-sky/20 flex flex-col sm:flex-row items-center justify-between text-xs text-cream/60 gap-4 mt-6">
              <span class="tracking-widest uppercase font-mono text-[10.5px] text-sky/80">MEDIQ PHARMA AND MEDICAL SUPPLIES DISTRIBUTION</span>
              <span class="font-sans text-[11.5px] text-cream/70">Partnering with Rayner &bull; Worthing, United Kingdom</span>
            </div>

          </div>
        </div>
'''

with open("index.html", "r", encoding="utf-8") as f:
    content = f.read()

# Replace Slide 2
pattern = re.compile(
    r'<!--\s*===+\s*-->\s*<!--\s*SLIDE 3: WHAT WE DO.*?-->\s*<!--\s*===+\s*-->\s*'
    r'<div id="about-slide-what-we-do" class="about-slide [^"]*?" data-index="2">.*?'
    r'</div>\s*(?=<!--\s*===+\s*-->\s*<!--\s*SLIDE 4: OUR ESTABLISHED FOUNDATION)',
    re.DOTALL
)

if not pattern.search(content):
    print("Error: Could not find target pattern in index.html")
    exit(1)

new_content = pattern.sub(html_slide2, content)

with open("index.html", "w", encoding="utf-8") as f:
    f.write(new_content)

print("Slide 2 updated with 100% watermark-free Rayner broadcast footage successfully!")

