const fs = require('fs');

const aboutSectionHtml = `
    <!-- ============== ABOUT / HERITAGE & CORPORATE ARCHIVE SHOWCASE ============== -->
    <section id="about" aria-labelledby="about-title"
      class="page-snap-section page-transition-section relative isolate flex min-h-[100svh] flex-col justify-center overflow-hidden bg-[#0a1d40] scroll-mt-0 px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      
      <!-- Subtle ambient medical glow -->
      <div aria-hidden="true" class="pointer-events-none absolute -left-20 top-1/4 -z-10 h-96 w-96 rounded-full bg-sky/10 blur-[130px]"></div>
      <div aria-hidden="true" class="pointer-events-none absolute right-0 bottom-10 -z-10 h-[28rem] w-[28rem] rounded-full bg-[#11326c]/30 blur-[140px]"></div>

      <div class="mx-auto w-full max-w-7xl">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          <!-- LEFT COLUMN: Executive Overview & Metrics -->
          <div class="lg:col-span-5 flex flex-col justify-center text-left">
            <div class="inline-flex items-center gap-2 self-start px-3 py-1 rounded-full border border-sky/30 bg-sky/10 text-sky text-xs font-semibold uppercase tracking-wider mb-4">
              <span class="w-1.5 h-1.5 rounded-full bg-sky animate-pulse"></span>
              02 · Philippine Healthcare Excellence
            </div>
            
            <h2 id="about-title" class="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.1] mb-4">
              Connecting Global Innovation <span class="text-sky italic font-serif">with Philippine Care</span>
            </h2>
            
            <p class="text-sm sm:text-base text-cream/80 leading-relaxed mb-6 font-sans">
              MEDIQ, operating as <strong class="text-white font-medium">Mediq Pharma and Medical Supplies Distribution</strong>, connects premier international medical manufacturers with ophthalmologists, surgeons, hospitals, and clinical institutions across the Philippines.
            </p>

            <!-- 4 Value Pillar Badges -->
            <div class="grid grid-cols-2 gap-3 mb-6">
              <div class="p-3.5 rounded-xl bg-white/[0.04] border border-sky/20 backdrop-blur-md shadow-sm transition-all hover:border-sky/40">
                <div class="text-sky font-bold text-lg font-mono">80+</div>
                <div class="text-xs text-cream/70 font-medium">Global Network Reach</div>
              </div>
              <div class="p-3.5 rounded-xl bg-white/[0.04] border border-sky/20 backdrop-blur-md shadow-sm transition-all hover:border-sky/40">
                <div class="text-sky font-bold text-lg font-mono">100%</div>
                <div class="text-xs text-cream/70 font-medium">Cold-Chain & Traceability</div>
              </div>
              <div class="p-3.5 rounded-xl bg-white/[0.04] border border-sky/20 backdrop-blur-md shadow-sm transition-all hover:border-sky/40">
                <div class="text-sky font-bold text-lg font-mono">FDA-PH</div>
                <div class="text-xs text-cream/70 font-medium">Compliant Distribution</div>
              </div>
              <div class="p-3.5 rounded-xl bg-white/[0.04] border border-sky/20 backdrop-blur-md shadow-sm transition-all hover:border-sky/40">
                <div class="text-sky font-bold text-lg font-mono">KOL</div>
                <div class="text-xs text-cream/70 font-medium">Surgeon Wet Labs</div>
              </div>
            </div>

            <!-- Interactive Guide Pill -->
            <div class="inline-flex items-center gap-2 text-xs text-sky/80 bg-sky/5 border border-sky/20 rounded-lg px-3 py-2 font-mono">
              <svg class="w-4 h-4 text-sky shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"/>
              </svg>
              <span>Click or pull an index card to read full corporate details</span>
            </div>
          </div>

          <!-- RIGHT COLUMN: Interactive Prescription Bond Paper Drawer -->
          <div class="lg:col-span-7 w-full flex justify-center">
            <div class="mediq-faq-wrapper w-full max-w-2xl">
              
              <!-- TACTILE PRESCRIPTION DRAWER CONTAINER -->
              <div class="fq" data-block="faq-drawer" data-finish="graphite">
                <div class="fq-cabinet">
                  
                  <!-- The Drawer Tray -->
                  <div class="fq-drawer">
                    <div class="fq-tray">
                      
                      <!-- Card 1: Company Overview -->
                      <details class="fq-card" name="mediq-profile" open style="--k: 0; --depth: 1.000; --tab-at: 0.02;">
                        <summary class="fq-edge">
                          <span class="fq-tab" aria-hidden="true">OVERVIEW</span>
                          <span class="fq-no" aria-hidden="true">Q.01</span>
                          <span class="fq-q">Who We Are &amp; What We Do</span>
                          <span class="fq-mark" aria-hidden="true"></span>
                        </summary>
                        <div class="fq-face">
                          <div class="fq-rx-header" aria-hidden="true">Rx · MEDIQ PHARMA &amp; MEDICAL SUPPLIES DISTRIBUTION · REGG. PH</div>
                          <p class="fq-a">
                            MEDIQ, operating as <strong>Mediq Pharma and Medical Supplies Distribution</strong>, is a Philippine-based healthcare distribution and commercial development company connecting international medical manufacturers with healthcare professionals, hospitals, surgical centers, and institutions across the country. Established in specialized ophthalmic technologies, MEDIQ aims to build a diversified healthcare portfolio while retaining its commitment to product quality, technical understanding, responsive service, and sustainable partnerships.
                          </p>
                          <p class="fq-filed" aria-hidden="true">Filed under OVERVIEW · Q.01 · Corporate Profile</p>
                        </div>
                      </details>

                      <!-- Card 2: Strategic Vision -->
                      <details class="fq-card" name="mediq-profile" style="--k: 1; --depth: 0.750; --tab-at: 0.23;">
                        <summary class="fq-edge">
                          <span class="fq-tab" aria-hidden="true">VISION</span>
                          <span class="fq-no" aria-hidden="true">Q.02</span>
                          <span class="fq-q">Our Strategic Vision for Philippine Healthcare</span>
                          <span class="fq-mark" aria-hidden="true"></span>
                        </summary>
                        <div class="fq-face">
                          <div class="fq-rx-header" aria-hidden="true">Rx · STRATEGIC DIRECTION &amp; HEALTHCARE REACH</div>
                          <p class="fq-a">
                            To become one of the Philippines' most trusted and forward-thinking healthcare solutions partners, advancing the accessibility, quality, and delivery of care through innovative products, responsible commercialization, and enduring partnerships.
                          </p>
                          <p class="fq-filed" aria-hidden="true">Filed under VISION · Q.02 · Healthcare Accessibility</p>
                        </div>
                      </details>

                      <!-- Card 3: Core Mission -->
                      <details class="fq-card" name="mediq-profile" style="--k: 2; --depth: 0.500; --tab-at: 0.43;">
                        <summary class="fq-edge">
                          <span class="fq-tab" aria-hidden="true">MISSION</span>
                          <span class="fq-no" aria-hidden="true">Q.03</span>
                          <span class="fq-q">Our Core Mission &amp; Clinical Commitment</span>
                          <span class="fq-mark" aria-hidden="true"></span>
                        </summary>
                        <div class="fq-face">
                          <div class="fq-rx-header" aria-hidden="true">Rx · CLINICAL VALUE &amp; PROFESSIONAL SERVICE</div>
                          <p class="fq-a">
                            To bridge global healthcare innovation with the evolving needs of the Philippine market by sourcing, marketing, promoting, selling, and distributing quality medical products and technologies, while providing healthcare professionals with reliable support, education, and service.
                          </p>
                          <p class="fq-filed" aria-hidden="true">Filed under MISSION · Q.03 · Clinical Partnership</p>
                        </div>
                      </details>

                      <!-- Card 4: Four Commitments -->
                      <details class="fq-card" name="mediq-profile" style="--k: 3; --depth: 0.250; --tab-at: 0.63;">
                        <summary class="fq-edge">
                          <span class="fq-tab" aria-hidden="true">COMMIT</span>
                          <span class="fq-no" aria-hidden="true">Q.04</span>
                          <span class="fq-q">Our Four Strategic Commitments</span>
                          <span class="fq-mark" aria-hidden="true"></span>
                        </summary>
                        <div class="fq-face">
                          <div class="fq-rx-header" aria-hidden="true">Rx · OPERATIONAL EXCELLENCE &amp; QUALITY ASSURANCE</div>
                          <div class="fq-a fq-commitments-grid">
                            <div class="fq-commit-item">
                              <strong>Innovation &amp; Access:</strong> Identify relevant healthcare technologies and support wider access to quality solutions.
                            </div>
                            <div class="fq-commit-item">
                              <strong>Product Marketing:</strong> Build brand awareness, communicate product value, and develop ethical promotional campaigns.
                            </div>
                            <div class="fq-commit-item">
                              <strong>Commercial Excellence:</strong> Support launches, sales teams, institutional engagement, and market growth.
                            </div>
                            <div class="fq-commit-item">
                              <strong>Trust &amp; Quality:</strong> Maintain responsible compliance, reliable supply, and long-term professional partnerships.
                            </div>
                          </div>
                          <p class="fq-filed" aria-hidden="true">Filed under COMMIT · Q.04 · Core Pillars</p>
                        </div>
                      </details>

                      <!-- Card 5: Marketing & Commercialization -->
                      <details class="fq-card" name="mediq-profile" style="--k: 4; --depth: 0.000; --tab-at: 0.81;">
                        <summary class="fq-edge">
                          <span class="fq-tab" aria-hidden="true">MARKET</span>
                          <span class="fq-no" aria-hidden="true">Q.05</span>
                          <span class="fq-q">Marketing &amp; Commercialization Excellence</span>
                          <span class="fq-mark" aria-hidden="true"></span>
                        </summary>
                        <div class="fq-face">
                          <div class="fq-rx-header" aria-hidden="true">Rx · COMMERCIAL DEVELOPMENT &amp; SURGICAL EDUCATION</div>
                          <p class="fq-a">
                            MEDIQ combines healthcare product knowledge with commercial strategy to build awareness, develop clinical demand, expand institutional adoption, and support sustainable surgical sales through evidence-based marketing, surgeon workshops, wet-lab training, and responsible commercial practice across the Philippines.
                          </p>
                          <p class="fq-filed" aria-hidden="true">Filed under MARKET · Q.05 · Commercial Development</p>
                        </div>
                      </details>

                    </div>

                    <!-- Drawer Face Plate with Metal Label Holder and Cup Pull -->
                    <div class="fq-front" aria-hidden="true">
                      <span class="fq-holder">
                        <span class="fq-holder-card">MEDIQ · PHARMA &amp; CLINICAL INDEX</span>
                      </span>
                      <span class="fq-pull"></span>
                    </div>

                  </div>

                  <!-- Footer Ask / Action Bar -->
                  <div class="fq-ask">
                    <p class="fq-note">Looking for institutional partnerships, surgical supply, or wet-lab schedules?</p>
                    <a class="fq-key" href="#contact">Contact Commercial Team</a>
                  </div>

                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
`;

console.log('Generated about section HTML successfully.');

module.exports = { aboutSectionHtml };
