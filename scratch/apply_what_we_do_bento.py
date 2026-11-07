import os

# Read current index.html
with open('index.html', 'r', encoding='utf-8') as f:
    h = f.read()

# Marker for Slide 3 in index.html
start_marker = '<!-- ========================================================================= -->\n        <!-- SLIDE 3: WHAT WE DO'
end_marker = '<!-- ========================================================================= -->\n        <!-- SLIDE 4: OUR ESTABLISHED FOUNDATION'

start_idx = h.find(start_marker)
end_idx = h.find(end_marker)

assert start_idx != -1, "start_marker not found in index.html"
assert end_idx != -1, "end_marker not found in index.html"

bento_slide_html = '''<!-- ========================================================================= -->
        <!-- SLIDE 3: WHAT WE DO (Interactive Bento Grid Architecture)                -->
        <!-- ========================================================================= -->
        <div id="about-slide-what-we-do" class="about-slide absolute inset-0 w-full h-full flex flex-col bg-transparent text-cream px-4 sm:px-8 lg:px-12 pt-16 sm:pt-20 pb-20 overflow-y-auto transition-all duration-500 ease-out opacity-0 pointer-events-none translate-x-12 z-0" data-index="2">
          
          <!-- Ambient Luminous Glows -->
          <div class="pointer-events-none absolute -left-20 top-1/4 h-[32rem] w-[32rem] rounded-full bg-sky/15 blur-[160px]"></div>
          <div class="pointer-events-none absolute right-0 top-1/3 h-[36rem] w-[36rem] rounded-full bg-[#11326c]/45 blur-[180px]"></div>
          <!-- Blueprint / Dot Matrix Grid matching Deck Style -->
          <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(#3aa0db_1px,transparent_1px)] [background-size:24px_24px] opacity-15"></div>

          <!-- Section Header -->
          <div class="relative z-30 shrink-0 text-center max-w-3xl mx-auto mb-6 sm:mb-8">
            <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#071530]/85 border border-sky/30 text-[11px] font-mono font-bold text-sky uppercase tracking-wider backdrop-blur-md shadow-md mb-2.5">
              <span class="size-2 rounded-full bg-sky animate-ping"></span>
              <span>Core Capabilities &bull; Bento Architecture</span>
            </div>
            <h2 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight mb-2">
              What <span class="text-transparent bg-clip-text bg-gradient-to-r from-sky via-[#72c5f8] to-white">We Do</span>
            </h2>
            <p class="text-xs sm:text-sm text-cream/75 leading-relaxed max-w-2xl mx-auto">
              Comprehensive commercial operations, clinical distribution, and surgical healthcare partnerships across the Philippine archipelago.
            </p>
          </div>

          <!-- Bento Grid Container -->
          <div class="relative z-20 w-full max-w-6xl mx-auto flex flex-col gap-5 pb-12">
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              
              <!-- BENTO 01: Strategic Importation & Distribution (Span 2 / Hero) -->
              <div class="bento-pillar-card group relative lg:col-span-2 overflow-hidden rounded-2xl sm:rounded-3xl border border-sky/25 hover:border-sky/55 bg-[#071530]/90 backdrop-blur-2xl p-5 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.7)] transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between min-h-[260px]">
                <!-- Cursor tracking spotlight glow -->
                <div class="bento-spotlight pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style="background: radial-gradient(320px circle at var(--bx, 50%) var(--by, 50%), rgba(58, 160, 219, 0.22), transparent 70%);"></div>
                <div class="pointer-events-none absolute -right-12 -top-12 size-44 rounded-full bg-sky/15 blur-2xl"></div>

                <div>
                  <div class="flex items-center justify-between gap-3 mb-3">
                    <div class="flex items-center gap-2">
                      <span class="px-2.5 py-0.5 rounded-md bg-sky/15 border border-sky/30 text-[10.5px] font-mono font-bold text-sky uppercase">
                        PILLAR 01
                      </span>
                      <span class="text-[11px] font-medium text-[#72c5f8]/80 uppercase tracking-widest">
                        Supply Chain
                      </span>
                    </div>
                    <!-- Animated Orbit Icon -->
                    <div class="size-10 rounded-full border border-sky/30 bg-[#0a1835] flex items-center justify-center text-sky relative overflow-hidden shrink-0">
                      <svg class="size-5 animate-spin" style="animation-duration: 9s;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="9" stroke-dasharray="4 4" stroke-opacity="0.4"/>
                        <circle cx="12" cy="12" r="3" fill="currentColor"/>
                        <circle cx="19" cy="12" r="1.5" fill="currentColor"/>
                      </svg>
                    </div>
                  </div>

                  <div class="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
                    <div class="sm:col-span-7">
                      <h3 class="text-xl sm:text-2xl font-extrabold text-white group-hover:text-sky transition-colors mb-2">
                        Strategic Importation &amp; Distribution
                      </h3>
                      <p class="text-xs sm:text-sm text-cream/80 leading-relaxed mb-4">
                        Product sourcing, importation coordination, cleanroom inventory availability, and validated temperature-controlled cold-chain support across all major Philippine ports of entry.
                      </p>
                      <div class="flex flex-wrap gap-1.5">
                        <span class="text-[10px] sm:text-[11px] font-medium px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-cream/90 flex items-center gap-1.5">
                          <span class="size-1.5 rounded-full bg-sky"></span>Product Sourcing
                        </span>
                        <span class="text-[10px] sm:text-[11px] font-medium px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-cream/90 flex items-center gap-1.5">
                          <span class="size-1.5 rounded-full bg-sky"></span>Import Coordination
                        </span>
                        <span class="text-[10px] sm:text-[11px] font-medium px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-cream/90 flex items-center gap-1.5">
                          <span class="size-1.5 rounded-full bg-sky"></span>Inventory Reserves
                        </span>
                        <span class="text-[10px] sm:text-[11px] font-medium px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-cream/90 flex items-center gap-1.5">
                          <span class="size-1.5 rounded-full bg-sky"></span>GDP Cold-Chain
                        </span>
                      </div>
                    </div>

                    <div class="sm:col-span-5 aspect-video sm:aspect-square lg:aspect-video rounded-xl overflow-hidden border border-sky/30 bg-black/50 relative shadow-inner">
                      <img src="assets/img/pillars/p1_cleanroom_inspect.jpg" alt="Strategic Importation and Distribution" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                      <div class="absolute inset-0 bg-gradient-to-t from-[#071530] via-transparent to-transparent"></div>
                      <span class="absolute bottom-2 left-2.5 text-[9.5px] font-mono text-sky font-bold uppercase bg-black/60 px-2 py-0.5 rounded border border-white/10">Cleanroom Inspection</span>
                    </div>
                  </div>
                </div>

                <div class="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                  <span class="text-cream/60 font-mono">Cold-Chain Dispatch SLA</span>
                  <span class="font-mono font-bold text-sky text-sm">&lt; 24-48 Hours</span>
                </div>
              </div>

              <!-- BENTO 02: Product Marketing & Brand Development -->
              <div class="bento-pillar-card group relative lg:col-span-1 overflow-hidden rounded-2xl sm:rounded-3xl border border-sky/25 hover:border-sky/55 bg-[#081a3d]/90 backdrop-blur-2xl p-5 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.7)] transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between min-h-[260px]">
                <div class="bento-spotlight pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style="background: radial-gradient(280px circle at var(--bx, 50%) var(--by, 50%), rgba(58, 160, 219, 0.22), transparent 70%);"></div>

                <div>
                  <div class="flex items-center justify-between gap-3 mb-3">
                    <div class="flex items-center gap-2">
                      <span class="px-2.5 py-0.5 rounded-md bg-sky/15 border border-sky/30 text-[10.5px] font-mono font-bold text-sky uppercase">
                        PILLAR 02
                      </span>
                      <span class="text-[11px] font-medium text-[#72c5f8]/80 uppercase tracking-widest">
                        Commercial
                      </span>
                    </div>
                    <!-- Animated Relay Icon -->
                    <div class="size-10 rounded-full border border-sky/30 bg-[#0a1835] flex items-center justify-center text-sky relative overflow-hidden shrink-0">
                      <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" class="animate-pulse"/>
                      </svg>
                    </div>
                  </div>

                  <h3 class="text-lg sm:text-xl font-extrabold text-white group-hover:text-sky transition-colors mb-2">
                    Product Marketing &amp; Brand Development
                  </h3>
                  <p class="text-xs text-cream/75 leading-relaxed mb-4">
                    Evidence-based brand positioning, peer-reviewed clinical symposia, and advisory board summits connecting international innovators with Philippine ophthalmic leaders.
                  </p>

                  <div class="flex flex-wrap gap-1.5 mb-3">
                    <span class="text-[10px] font-medium px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-cream/80">Brand Strategy</span>
                    <span class="text-[10px] font-medium px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-cream/80">Surgeon Symposia</span>
                    <span class="text-[10px] font-medium px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-cream/80">PAO Exhibits</span>
                  </div>
                </div>

                <div class="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                  <span class="text-cream/60 font-mono">Academic Symposia</span>
                  <span class="font-mono font-bold text-sky text-sm">25+ / Year</span>
                </div>
              </div>

              <!-- BENTO 03: Nationwide Clinical & Sales Coverage -->
              <div class="bento-pillar-card group relative lg:col-span-1 overflow-hidden rounded-2xl sm:rounded-3xl border border-sky/25 hover:border-sky/55 bg-[#081a3d]/90 backdrop-blur-2xl p-5 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.7)] transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between min-h-[260px]">
                <div class="bento-spotlight pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style="background: radial-gradient(280px circle at var(--bx, 50%) var(--by, 50%), rgba(58, 160, 219, 0.22), transparent 70%);"></div>

                <div>
                  <div class="flex items-center justify-between gap-3 mb-3">
                    <div class="flex items-center gap-2">
                      <span class="px-2.5 py-0.5 rounded-md bg-sky/15 border border-sky/30 text-[10.5px] font-mono font-bold text-sky uppercase">
                        PILLAR 03
                      </span>
                      <span class="text-[11px] font-medium text-[#72c5f8]/80 uppercase tracking-widest">
                        Field Network
                      </span>
                    </div>
                    <!-- Animated Wave Icon -->
                    <div class="size-10 rounded-full border border-sky/30 bg-[#0a1835] flex items-center justify-center text-sky relative overflow-hidden shrink-0">
                      <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M2 12c3-4 6-4 8 0s5 4 8 0 4-4 4-4"/>
                      </svg>
                    </div>
                  </div>

                  <h3 class="text-lg sm:text-xl font-extrabold text-white group-hover:text-sky transition-colors mb-2">
                    Nationwide Clinical &amp; Sales Coverage
                  </h3>
                  <p class="text-xs text-cream/75 leading-relaxed mb-4">
                    Direct surgical suite detailing, hospital relations, and consignment management across NCR, Luzon, Visayas, and Mindanao.
                  </p>

                  <div class="flex flex-wrap gap-1.5 mb-3">
                    <span class="text-[10px] font-medium px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-cream/80">Direct Detailing</span>
                    <span class="text-[10px] font-medium px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-cream/80">OR Consignment</span>
                    <span class="text-[10px] font-medium px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-cream/80">Hospital Relations</span>
                  </div>
                </div>

                <div class="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                  <span class="text-cream/60 font-mono">Archipelago Reach</span>
                  <span class="font-mono font-bold text-sky text-sm">17 Regions</span>
                </div>
              </div>

              <!-- BENTO 04: Regulatory Compliance & Quality Assurance -->
              <div class="bento-pillar-card group relative lg:col-span-1 overflow-hidden rounded-2xl sm:rounded-3xl border border-sky/25 hover:border-sky/55 bg-[#071530]/90 backdrop-blur-2xl p-5 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.7)] transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between min-h-[260px]">
                <div class="bento-spotlight pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style="background: radial-gradient(280px circle at var(--bx, 50%) var(--by, 50%), rgba(58, 160, 219, 0.22), transparent 70%);"></div>

                <div>
                  <div class="flex items-center justify-between gap-3 mb-3">
                    <div class="flex items-center gap-2">
                      <span class="px-2.5 py-0.5 rounded-md bg-sky/15 border border-sky/30 text-[10.5px] font-mono font-bold text-sky uppercase">
                        PILLAR 04
                      </span>
                      <span class="text-[11px] font-medium text-[#72c5f8]/80 uppercase tracking-widest">
                        Governance
                      </span>
                    </div>
                    <!-- Animated Shield / Spark Icon -->
                    <div class="size-10 rounded-full border border-sky/30 bg-[#0a1835] flex items-center justify-center text-sky relative overflow-hidden shrink-0">
                      <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                        <path d="m9 12 2 2 4-4"/>
                      </svg>
                    </div>
                  </div>

                  <h3 class="text-lg sm:text-xl font-extrabold text-white group-hover:text-sky transition-colors mb-2">
                    Regulatory Compliance &amp; QA
                  </h3>
                  <p class="text-xs text-cream/75 leading-relaxed mb-4">
                    Full Philippine FDA product registration, Good Distribution Practice (GDP/CDRR) certifications, cold-chain temperature monitoring, and pharmacovigilance.
                  </p>

                  <div class="flex flex-wrap gap-1.5 mb-3">
                    <span class="text-[10px] font-medium px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-cream/80">FDA Registered</span>
                    <span class="text-[10px] font-medium px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-cream/80">GDP Certified</span>
                    <span class="text-[10px] font-medium px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-cream/80">Thermal Mapping</span>
                  </div>
                </div>

                <div class="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                  <span class="text-cream/60 font-mono">Regulatory Audits</span>
                  <span class="font-mono font-bold text-emerald-400 text-sm">100% Pass Rate</span>
                </div>
              </div>

              <!-- BENTO 05: Clinical & Surgical Education -->
              <div class="bento-pillar-card group relative lg:col-span-1 overflow-hidden rounded-2xl sm:rounded-3xl border border-sky/25 hover:border-sky/55 bg-[#071530]/90 backdrop-blur-2xl p-5 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.7)] transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between min-h-[260px]">
                <div class="bento-spotlight pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style="background: radial-gradient(280px circle at var(--bx, 50%) var(--by, 50%), rgba(58, 160, 219, 0.22), transparent 70%);"></div>

                <div>
                  <div class="flex items-center justify-between gap-3 mb-3">
                    <div class="flex items-center gap-2">
                      <span class="px-2.5 py-0.5 rounded-md bg-sky/15 border border-sky/30 text-[10.5px] font-mono font-bold text-sky uppercase">
                        PILLAR 05
                      </span>
                      <span class="text-[11px] font-medium text-[#72c5f8]/80 uppercase tracking-widest">
                        Professional Dev
                      </span>
                    </div>
                    <!-- Animated Education Icon -->
                    <div class="size-10 rounded-full border border-sky/30 bg-[#0a1835] flex items-center justify-center text-sky relative overflow-hidden shrink-0">
                      <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                        <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                      </svg>
                    </div>
                  </div>

                  <h3 class="text-lg sm:text-xl font-extrabold text-white group-hover:text-sky transition-colors mb-2">
                    Clinical &amp; Surgical Education
                  </h3>
                  <p class="text-xs text-cream/75 leading-relaxed mb-4">
                    Hands-on dry &amp; wet labs, phacoemulsification technique masterclasses, and CME-accredited workshops for ophthalmology residents and fellows.
                  </p>

                  <div class="flex flex-wrap gap-1.5 mb-3">
                    <span class="text-[10px] font-medium px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-cream/80">Wet Lab Courses</span>
                    <span class="text-[10px] font-medium px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-cream/80">CME Accredited</span>
                    <span class="text-[10px] font-medium px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-cream/80">Video Surgery</span>
                  </div>
                </div>

                <div class="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                  <span class="text-cream/60 font-mono">Surgeons Trained</span>
                  <span class="font-mono font-bold text-sky text-sm">500+ Fellows</span>
                </div>
              </div>

              <!-- BENTO 06: Comprehensive Post-Market Support (Span 2 / Wide) -->
              <div class="bento-pillar-card group relative lg:col-span-2 overflow-hidden rounded-2xl sm:rounded-3xl border border-sky/25 hover:border-sky/55 bg-[#081a3d]/90 backdrop-blur-2xl p-5 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.7)] transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between min-h-[260px]">
                <div class="bento-spotlight pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style="background: radial-gradient(320px circle at var(--bx, 50%) var(--by, 50%), rgba(58, 160, 219, 0.22), transparent 70%);"></div>

                <div>
                  <div class="flex items-center justify-between gap-3 mb-3">
                    <div class="flex items-center gap-2">
                      <span class="px-2.5 py-0.5 rounded-md bg-sky/15 border border-sky/30 text-[10.5px] font-mono font-bold text-sky uppercase">
                        PILLAR 06
                      </span>
                      <span class="text-[11px] font-medium text-[#72c5f8]/80 uppercase tracking-widest">
                        Continuity
                      </span>
                    </div>
                    <!-- Animated Support Icon -->
                    <div class="size-10 rounded-full border border-sky/30 bg-[#0a1835] flex items-center justify-center text-sky relative overflow-hidden shrink-0">
                      <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 18v-6a9 9 0 0 1 18 0v6"/>
                        <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
                      </svg>
                    </div>
                  </div>

                  <div class="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
                    <div class="sm:col-span-7">
                      <h3 class="text-xl sm:text-2xl font-extrabold text-white group-hover:text-sky transition-colors mb-2">
                        Comprehensive Post-Market Support
                      </h3>
                      <p class="text-xs sm:text-sm text-cream/80 leading-relaxed mb-4">
                        Equipment calibration, ray-tracing IOL biometry assistance, surgical feedback loops, and 24/7 technical hotline for ophthalmic teams and ASCs nationwide.
                      </p>
                      <div class="flex flex-wrap gap-1.5">
                        <span class="text-[10px] sm:text-[11px] font-medium px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-cream/90 flex items-center gap-1.5">
                          <span class="size-1.5 rounded-full bg-emerald-400"></span>Tech Hotline
                        </span>
                        <span class="text-[10px] sm:text-[11px] font-medium px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-cream/90 flex items-center gap-1.5">
                          <span class="size-1.5 rounded-full bg-emerald-400"></span>Rapid Turnaround
                        </span>
                        <span class="text-[10px] sm:text-[11px] font-medium px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-cream/90 flex items-center gap-1.5">
                          <span class="size-1.5 rounded-full bg-emerald-400"></span>Surgical In-Service
                        </span>
                        <span class="text-[10px] sm:text-[11px] font-medium px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-cream/90 flex items-center gap-1.5">
                          <span class="size-1.5 rounded-full bg-emerald-400"></span>Quality Feedback
                        </span>
                      </div>
                    </div>

                    <div class="sm:col-span-5 aspect-video sm:aspect-square lg:aspect-video rounded-xl overflow-hidden border border-sky/30 bg-black/50 relative shadow-inner">
                      <img src="assets/img/pillars/p6_delivery_fleet.jpg" alt="Comprehensive Post-Market Support" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                      <div class="absolute inset-0 bg-gradient-to-t from-[#071530] via-transparent to-transparent"></div>
                      <span class="absolute bottom-2 left-2.5 text-[9.5px] font-mono text-sky font-bold uppercase bg-black/60 px-2 py-0.5 rounded border border-white/10">Priority Dispatch Fleet</span>
                    </div>
                  </div>
                </div>

                <div class="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                  <span class="text-cream/60 font-mono">Service SLA Response</span>
                  <span class="font-mono font-bold text-sky text-sm">24/7 Priority Standby</span>
                </div>
              </div>

            </div>

            <!-- Ecosystem Summary Metrics Bar -->
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-2 p-4 sm:p-5 rounded-2xl bg-[#071530]/85 border border-sky/25 backdrop-blur-xl shadow-lg">
              <div class="text-center p-3 rounded-xl bg-white/5 border border-white/5">
                <span class="block text-[10px] font-mono text-sky/80 uppercase tracking-widest mb-1">Archipelago Coverage</span>
                <span class="text-base sm:text-xl font-extrabold text-white">17 Regions</span>
              </div>
              <div class="text-center p-3 rounded-xl bg-white/5 border border-white/5">
                <span class="block text-[10px] font-mono text-sky/80 uppercase tracking-widest mb-1">Cold-Chain Reliability</span>
                <span class="text-base sm:text-xl font-extrabold text-emerald-400">99.8%</span>
              </div>
              <div class="text-center p-3 rounded-xl bg-white/5 border border-white/5">
                <span class="block text-[10px] font-mono text-sky/80 uppercase tracking-widest mb-1">Partner Institutes</span>
                <span class="text-base sm:text-xl font-extrabold text-white">120+ Centers</span>
              </div>
              <div class="text-center p-3 rounded-xl bg-white/5 border border-white/5">
                <span class="block text-[10px] font-mono text-sky/80 uppercase tracking-widest mb-1">Exclusive Global Partner</span>
                <span class="text-base sm:text-xl font-extrabold text-sky">Rayner UK</span>
              </div>
            </div>

          </div>

        </div>\n'''

# Replace Slide 3 in index.html
new_h = h[:start_idx] + bento_slide_html + h[end_idx:]

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(new_h)

print("SUCCESS: Replaced Slide 3 in index.html with Bento design!")

# Update components/about-locked-backup.html so baseline reflects the user-approved change
with open('components/about-locked-backup.html', 'r', encoding='utf-8') as f:
    backup_h = f.read()

b_start_idx = backup_h.find(start_marker)
b_end_idx = backup_h.find(end_marker)

assert b_start_idx != -1, "start_marker not found in backup"
assert b_end_idx != -1, "end_marker not found in backup"

new_backup_h = backup_h[:b_start_idx] + bento_slide_html + backup_h[b_end_idx:]

with open('components/about-locked-backup.html', 'w', encoding='utf-8') as f:
    f.write(new_backup_h)

print("SUCCESS: Updated components/about-locked-backup.html baseline with approved Bento design!")

