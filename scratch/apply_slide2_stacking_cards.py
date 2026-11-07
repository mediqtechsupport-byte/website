import re

html_slide2 = '''        <!-- ========================================================================= -->
        <!-- SLIDE 3: WHAT WE DO (Stacking Cards with Contextual Videos)                  -->
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
                Connecting world-class ophthalmic manufacturing with surgeons, healthcare institutions, and surgical centers across the Philippine archipelago.
              </p>

              <!-- Interactive Stacking Card Scroll Hint -->
              <div class="mt-5 inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#071530]/80 border border-sky/20 text-[11px] font-semibold text-sky uppercase tracking-wider backdrop-blur-md">
                <span>Scroll down to stack capabilities</span>
                <svg class="size-3.5 animate-bounce text-[#72c5f8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
            </div>

            <!-- Stacking Cards Container -->
            <div id="stacking-cards-container" class="relative w-full space-y-10 pb-20">

              <!-- CARD 1: Strategic Importation & Cold-Chain Logistics -->
              <div class="stacking-card-item sticky transition-transform duration-300 ease-out" style="top: 90px; z-index: 10;">
                <div class="stacking-card-inner relative overflow-hidden rounded-3xl border border-sky/30 bg-[#071530]/95 backdrop-blur-2xl p-6 sm:p-8 lg:p-10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] ring-1 ring-white/10 hover:border-sky/50 transition-all flex flex-col lg:flex-row gap-8 items-center">
                  <div class="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-sky/15 blur-2xl"></div>

                  <!-- Text Column -->
                  <div class="flex-1 flex flex-col justify-center">
                    <div class="flex items-center gap-2.5 mb-3">
                      <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-sky/15 border border-sky/30 text-sky text-[10.5px] font-mono font-bold tracking-wider uppercase">
                        PILLAR 01
                      </span>
                      <span class="text-[11px] uppercase tracking-widest text-[#72c5f8]/80 font-medium">Supply Chain &amp; Logistics</span>
                    </div>

                    <h3 class="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight mb-3">
                      Strategic Importation &amp; Cold-Chain Distribution
                    </h3>

                    <p class="text-xs sm:text-sm text-cream/80 leading-relaxed mb-6">
                      Direct procurement coordination with global ophthalmic manufacturing principals, end-to-end temperature-monitored cold-chain warehousing, and rapid inventory delivery across Luzon, Visayas, and Mindanao.
                    </p>

                    <!-- Feature Badges -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-cream/90">
                      <div class="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-2">
                        <svg class="size-4 text-sky shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
                        <span>European Principal Procurement</span>
                      </div>
                      <div class="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-2">
                        <svg class="size-4 text-sky shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                        <span>Continuous Temperature Monitoring</span>
                      </div>
                      <div class="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-2 sm:col-span-2">
                        <svg class="size-4 text-sky shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="m3 11 18-5v12L3 13v-2z"/></svg>
                        <span>24/7 Rapid Consignment Delivery to Operating Theatres</span>
                      </div>
                    </div>
                  </div>

                  <!-- Video Column -->
                  <div class="w-full lg:w-1/2 aspect-video rounded-2xl relative overflow-hidden border border-sky/30 shadow-2xl bg-black/60 group">
                    <video src="assets/video/about-rayner.mp4" autoplay loop muted playsinline class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"></video>
                    <div class="absolute inset-0 bg-gradient-to-t from-[#071530]/80 via-transparent to-black/20 pointer-events-none"></div>
                    <div class="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-white">
                      <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#071530]/85 border border-sky/30 backdrop-blur-md">
                        <span class="size-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span class="font-medium tracking-wide">Rayner Worthing UK Cleanroom</span>
                      </span>
                      <span class="text-sky font-mono font-semibold">Cold-Chain Certified</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- CARD 2: Product Marketing & Brand Development -->
              <div class="stacking-card-item sticky transition-transform duration-300 ease-out" style="top: 110px; z-index: 20;">
                <div class="stacking-card-inner relative overflow-hidden rounded-3xl border border-sky/30 bg-[#091b3e]/95 backdrop-blur-2xl p-6 sm:p-8 lg:p-10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] ring-1 ring-white/10 hover:border-sky/50 transition-all flex flex-col lg:flex-row gap-8 items-center">
                  <div class="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-[#72c5f8]/15 blur-2xl"></div>

                  <!-- Text Column -->
                  <div class="flex-1 flex flex-col justify-center">
                    <div class="flex items-center gap-2.5 mb-3">
                      <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-sky/15 border border-sky/30 text-sky text-[10.5px] font-mono font-bold tracking-wider uppercase">
                        PILLAR 02
                      </span>
                      <span class="text-[11px] uppercase tracking-widest text-[#72c5f8]/80 font-medium">Brand &amp; Commercialization</span>
                    </div>

                    <h3 class="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight mb-3">
                      Product Marketing &amp; Brand Development
                    </h3>

                    <p class="text-xs sm:text-sm text-cream/80 leading-relaxed mb-6">
                      Targeted ophthalmic brand positioning, clinical symposium launches, scientific communication, and Key Opinion Leader (KOL) engagement driving sustained clinical differentiation and physician trust.
                    </p>

                    <!-- Feature Badges -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-cream/90">
                      <div class="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-2">
                        <svg class="size-4 text-sky shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                        <span>Surgeon Advisory &amp; KOL Roundtables</span>
                      </div>
                      <div class="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-2">
                        <svg class="size-4 text-sky shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/><path d="M14 9h5v5"/></svg>
                        <span>Scientific Product Launches</span>
                      </div>
                      <div class="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-2 sm:col-span-2">
                        <svg class="size-4 text-sky shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
                        <span>Hospital Channel Expansion &amp; Long-Term Brand Equity</span>
                      </div>
                    </div>
                  </div>

                  <!-- Video Column -->
                  <div class="w-full lg:w-1/2 aspect-video rounded-2xl relative overflow-hidden border border-sky/30 shadow-2xl bg-black/60 group">
                    <video src="assets/video/eye-city-reflection.mp4" autoplay loop muted playsinline class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"></video>
                    <div class="absolute inset-0 bg-gradient-to-t from-[#071530]/80 via-transparent to-black/20 pointer-events-none"></div>
                    <div class="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-white">
                      <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#071530]/85 border border-sky/30 backdrop-blur-md">
                        <span class="size-1.5 rounded-full bg-sky animate-pulse"></span>
                        <span class="font-medium tracking-wide">Optical Innovation &amp; Healthcare Connectivity</span>
                      </span>
                      <span class="text-sky font-mono font-semibold">Active Commercialization</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- CARD 3: Surgical Precision & Clinical Wet Labs -->
              <div class="stacking-card-item sticky transition-transform duration-300 ease-out" style="top: 130px; z-index: 30;">
                <div class="stacking-card-inner relative overflow-hidden rounded-3xl border border-sky/30 bg-[#0a2048]/95 backdrop-blur-2xl p-6 sm:p-8 lg:p-10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] ring-1 ring-white/10 hover:border-sky/50 transition-all flex flex-col lg:flex-row gap-8 items-center">
                  <div class="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-sky/20 blur-2xl"></div>

                  <!-- Text Column -->
                  <div class="flex-1 flex flex-col justify-center">
                    <div class="flex items-center gap-2.5 mb-3">
                      <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-sky/15 border border-sky/30 text-sky text-[10.5px] font-mono font-bold tracking-wider uppercase">
                        PILLAR 03
                      </span>
                      <span class="text-[11px] uppercase tracking-widest text-[#72c5f8]/80 font-medium">Clinical Excellence</span>
                    </div>

                    <h3 class="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight mb-3">
                      Surgical Wet Labs &amp; Operating Room Support
                    </h3>

                    <p class="text-xs sm:text-sm text-cream/80 leading-relaxed mb-6">
                      Certified product specialists providing intraocular lens calculation verification, hands-on wet-lab surgical training, and live theatre support ensuring optimal patient visual outcomes.
                    </p>

                    <!-- Feature Badges -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-cream/90">
                      <div class="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-2">
                        <svg class="size-4 text-sky shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M21.42 10.922a1 1 0 0 0-.019-.838L12.83 3.18a2 2 0 0 0-1.66 0L2.6 10.084a1 1 0 0 0 0 1.832l3.4 2.72v4.864a1 1 0 0 0 .616.924l5 2a1 1 0 0 0 .768 0l5-2a1 1 0 0 0 .616-.924v-4.864l3.4-2.72a1 1 0 0 0 .02-1.832z"/><path d="M6 13v5"/></svg>
                        <span>Surgeon Wet Labs &amp; Simulation</span>
                      </div>
                      <div class="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-2">
                        <svg class="size-4 text-sky shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>
                        <span>Biometric Constant Optimization</span>
                      </div>
                      <div class="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-2 sm:col-span-2">
                        <svg class="size-4 text-sky shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
                        <span>Accredited Continuing Medical Education (CME)</span>
                      </div>
                    </div>
                  </div>

                  <!-- Video Column -->
                  <div class="w-full lg:w-1/2 aspect-video rounded-2xl relative overflow-hidden border border-sky/30 shadow-2xl bg-black/60 group">
                    <video src="assets/video/eye-iris-macro.mp4" autoplay loop muted playsinline class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"></video>
                    <div class="absolute inset-0 bg-gradient-to-t from-[#071530]/80 via-transparent to-black/20 pointer-events-none"></div>
                    <div class="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-white">
                      <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#071530]/85 border border-sky/30 backdrop-blur-md">
                        <span class="size-1.5 rounded-full bg-[#72c5f8] animate-pulse"></span>
                        <span class="font-medium tracking-wide">Macro Iris Focus &amp; Precision Optics</span>
                      </span>
                      <span class="text-sky font-mono font-semibold">Surgeon Mentorship</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- CARD 4: Quality Assurance & FDA Regulatory Governance -->
              <div class="stacking-card-item sticky transition-transform duration-300 ease-out" style="top: 150px; z-index: 40;">
                <div class="stacking-card-inner relative overflow-hidden rounded-3xl border border-sky/30 bg-[#071738]/95 backdrop-blur-2xl p-6 sm:p-8 lg:p-10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] ring-1 ring-white/10 hover:border-sky/50 transition-all flex flex-col lg:flex-row gap-8 items-center">
                  <div class="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-emerald-400/10 blur-2xl"></div>

                  <!-- Text Column -->
                  <div class="flex-1 flex flex-col justify-center">
                    <div class="flex items-center gap-2.5 mb-3">
                      <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-sky/15 border border-sky/30 text-sky text-[10.5px] font-mono font-bold tracking-wider uppercase">
                        PILLAR 04
                      </span>
                      <span class="text-[11px] uppercase tracking-widest text-[#72c5f8]/80 font-medium">Compliance &amp; Support</span>
                    </div>

                    <h3 class="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight mb-3">
                      Quality Assurance, FDA Compliance &amp; Support
                    </h3>

                    <p class="text-xs sm:text-sm text-cream/80 leading-relaxed mb-6">
                      Strict compliance with Philippine Food and Drug Administration standards, comprehensive lot traceability from European cleanroom to Philippine hospital, and dependable 24/7 client care.
                    </p>

                    <!-- Feature Badges -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-cream/90">
                      <div class="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-2">
                        <svg class="size-4 text-sky shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
                        <span>Philippine FDA LTO &amp; CPR Portfolio</span>
                      </div>
                      <div class="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-2">
                        <svg class="size-4 text-sky shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/></svg>
                        <span>End-to-End Batch Lot Traceability</span>
                      </div>
                      <div class="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-2 sm:col-span-2">
                        <svg class="size-4 text-sky shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                        <span>24/7 Responsive Institutional Consignment Support</span>
                      </div>
                    </div>
                  </div>

                  <!-- Video Column -->
                  <div class="w-full lg:w-1/2 aspect-video rounded-2xl relative overflow-hidden border border-sky/30 shadow-2xl bg-black/60 group">
                    <video src="assets/video/about-rayner.mp4" autoplay loop muted playsinline class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"></video>
                    <div class="absolute inset-0 bg-gradient-to-t from-[#071530]/80 via-transparent to-black/20 pointer-events-none"></div>
                    <div class="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-white">
                      <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#071530]/85 border border-sky/30 backdrop-blur-md">
                        <span class="size-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span class="font-medium tracking-wide">ISO 13485 Medical Device Standards</span>
                      </span>
                      <span class="text-sky font-mono font-semibold">100% Traceability</span>
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
    r'<div class="about-slide [^"]*?" data-index="2">.*?'
    r'</div>\s*(?=<!--\s*===+\s*-->\s*<!--\s*SLIDE 4: OUR ESTABLISHED FOUNDATION)',
    re.DOTALL
)

if not pattern.search(content):
    print("Error: Could not find target pattern in index.html")
    exit(1)

new_content = pattern.sub(html_slide2, content)

with open("index.html", "w", encoding="utf-8") as f:
    f.write(new_content)

print("Slide 2 replaced with Stacking Cards design successfully!")

