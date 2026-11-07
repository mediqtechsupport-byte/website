import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Build Slide 3: Devices & Equipment Coming Soon
slide3_new = '''        <!-- ================= SLIDE 3: Devices & Equipment (Coming Soon 1 Integration) ================= -->
        <div class="product-slide absolute inset-0 w-full h-full flex flex-col justify-between items-center px-4 sm:px-8 lg:px-12 py-10 sm:py-14 transition-all duration-500 ease-out opacity-0 pointer-events-none translate-x-12 z-0 overflow-y-auto" data-product-index="3">
          
          <!-- Top Category Navigation Bar -->
          <div class="relative z-20 w-full max-w-5xl mx-auto flex items-center justify-between gap-3 mb-4">
            <div class="flex flex-wrap items-center gap-2">
              <button type="button" onclick="if(window.goToProductSlide){window.goToProductSlide(0);}" class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-cream/90 hover:text-white transition-all cursor-pointer backdrop-blur-md">
                <svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m15 18-6-6 6-6"/></svg>
                <span>Product Overview</span>
              </button>
              <button type="button" onclick="if(window.goToProductSlide){window.goToProductSlide(2);}" class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-cream/90 hover:text-white transition-all cursor-pointer backdrop-blur-md">
                <svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m15 18-6-6 6-6"/></svg>
                <span>Medical Supplies</span>
              </button>
            </div>

            <button type="button" onclick="if(window.goToProductSlide){window.goToProductSlide(4);}" class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-cream/90 hover:text-white transition-all cursor-pointer backdrop-blur-md group">
              <span>Product Catalogs</span>
              <svg class="size-3.5 group-hover:translate-x-0.5 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>

          <!-- Centered Coming Soon Block (Adapted from coming-soon-1.tsx with MediQ Smoky Palette) -->
          <div class="relative z-10 w-full max-w-2xl mx-auto my-auto flex flex-col items-center justify-center gap-6 text-center py-6">
            
            <!-- Rocket Icon Badge with Ambient Sky Glow -->
            <div class="relative group">
              <div class="absolute -inset-2 rounded-2xl bg-sky/20 blur-xl opacity-75 group-hover:opacity-100 transition-opacity"></div>
              <div class="relative flex size-14 items-center justify-center rounded-2xl border border-sky/35 bg-[#0a1d40]/80 text-sky shadow-[0_0_30px_rgba(58,160,219,0.35)] backdrop-blur-xl">
                <svg class="size-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
                  <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
                  <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/>
                  <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
                </svg>
              </div>
            </div>

            <!-- Header Titles -->
            <div class="flex flex-col items-center gap-3">
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky/10 border border-sky/30 text-[11px] font-mono font-bold text-sky uppercase tracking-widest">
                <span class="size-2 rounded-full bg-sky animate-ping"></span>
                <span>Devices &amp; Equipment Platform</span>
              </div>
              <h1 class="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl text-white">
                Something great is coming
              </h1>
              <p class="max-w-md text-sm text-cream/70 leading-relaxed">
                We are putting the finishing touches on our advanced ophthalmic surgical devices and micro-incision equipment suite. Leave your email and be the first to know when we launch.
              </p>
            </div>

            <!-- Waitlist Form -->
            <form onsubmit="event.preventDefault(); const btn=this.querySelector('button'); btn.textContent='Added to Waitlist!'; btn.classList.add('bg-emerald-500'); setTimeout(()=>{btn.textContent='Notify me'; btn.classList.remove('bg-emerald-500');}, 3000);" class="flex w-full max-w-md flex-col gap-2.5 sm:flex-row">
              <input
                type="email"
                required
                placeholder="doctor@hospital.com"
                aria-label="Email address"
                class="flex h-11 w-full rounded-full border border-white/15 bg-white/5 px-4 text-sm text-white placeholder:text-cream/40 backdrop-blur-md transition-all focus:border-sky focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-sky/30"
              />
              <button
                type="submit"
                class="inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-sky px-6 text-sm font-bold text-[#0a1d40] shadow-[0_0_25px_rgba(58,160,219,0.35)] transition-all hover:bg-[#72c5f8] hover:scale-105 active:scale-95 cursor-pointer"
              >
                Notify me
              </button>
            </form>

            <!-- Waitlist Avatars & Counter -->
            <div class="flex items-center gap-3 mt-1">
              <div class="flex -space-x-2">
                <img src="https://cdn.21st.dev/assets/mirror/3b/3b0a3ee40a55d8217002ce43ee42ad7f55fff9d0f8d571cd699a260387638025.jpg" alt="" class="size-8 rounded-full border-2 border-[#0a1d40] object-cover grayscale opacity-85 hover:grayscale-0 hover:opacity-100 transition-all">
                <img src="https://cdn.21st.dev/assets/mirror/c8/c839283fbbc8b5174e41d8d779a0c700a8647e7b8fa42d933a544acde2ea58ef.jpg" alt="" class="size-8 rounded-full border-2 border-[#0a1d40] object-cover grayscale opacity-85 hover:grayscale-0 hover:opacity-100 transition-all">
                <img src="https://cdn.21st.dev/assets/mirror/51/513243ddb336cac94373daed86b5708fbe8204f747df84d619f1c93807e564fe.jpg" alt="" class="size-8 rounded-full border-2 border-[#0a1d40] object-cover grayscale opacity-85 hover:grayscale-0 hover:opacity-100 transition-all">
                <img src="https://cdn.21st.dev/assets/mirror/b3/b36ca9959c3ac97d0eb9be717a26d714fb6133f1c9fa07b1cef6118ecc97e40e.jpg" alt="" class="size-8 rounded-full border-2 border-[#0a1d40] object-cover grayscale opacity-85 hover:grayscale-0 hover:opacity-100 transition-all">
              </div>
              <span class="text-xs text-cream/70 font-medium">
                Join <strong class="text-white font-bold">2,000+</strong> ophthalmic surgeons on the waitlist
              </span>
            </div>

            <!-- Social / Verification Links -->
            <div class="flex items-center gap-5 text-cream/60 mt-1">
              <a href="#contact" aria-label="Inquire Directly" class="hover:text-sky transition-colors flex items-center gap-1.5 text-xs">
                <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                <span>Direct Hospital Inquiries</span>
              </a>
              <span class="text-white/20">&bull;</span>
              <a href="https://rayner.com" target="_blank" rel="noopener noreferrer" aria-label="Rayner Surgical" class="hover:text-sky transition-colors flex items-center gap-1.5 text-xs">
                <span>Rayner Global Portal &nearr;</span>
              </a>
            </div>

          </div>

          <!-- Bottom Micro Footer -->
          <div class="relative z-20 w-full max-w-5xl mx-auto flex items-center justify-between text-[11px] text-cream/50 pt-2 border-t border-white/5">
            <span>Lock &amp; Roll&trade; 1.65mm Injector Suite</span>
            <span>Philippine Exclusive Distribution &bull; MediQ Pharma</span>
          </div>

        </div>'''

# Build Slide 4: Product Catalogs Coming Soon
slide4_new = '''        <!-- ================= SLIDE 4: Product Catalogs (Coming Soon 1 Integration) ================= -->
        <div class="product-slide absolute inset-0 w-full h-full flex flex-col justify-between items-center px-4 sm:px-8 lg:px-12 py-10 sm:py-14 transition-all duration-500 ease-out opacity-0 pointer-events-none translate-x-12 z-0 overflow-y-auto" data-product-index="4">
          
          <!-- Top Category Navigation Bar -->
          <div class="relative z-20 w-full max-w-5xl mx-auto flex items-center justify-between gap-3 mb-4">
            <div class="flex flex-wrap items-center gap-2">
              <button type="button" onclick="if(window.goToProductSlide){window.goToProductSlide(0);}" class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-cream/90 hover:text-white transition-all cursor-pointer backdrop-blur-md">
                <svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m15 18-6-6 6-6"/></svg>
                <span>Product Overview</span>
              </button>
              <button type="button" onclick="if(window.goToProductSlide){window.goToProductSlide(3);}" class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-cream/90 hover:text-white transition-all cursor-pointer backdrop-blur-md">
                <svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m15 18-6-6 6-6"/></svg>
                <span>Devices &amp; Equipment</span>
              </button>
            </div>

            <button type="button" onclick="if(window.goToProductSlide){window.goToProductSlide(0);}" class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-cream/90 hover:text-white transition-all cursor-pointer backdrop-blur-md group">
              <span>Back to Overview</span>
              <svg class="size-3.5 group-hover:translate-x-0.5 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>

          <!-- Centered Coming Soon Block (Adapted from coming-soon-1.tsx with MediQ Smoky Palette) -->
          <div class="relative z-10 w-full max-w-2xl mx-auto my-auto flex flex-col items-center justify-center gap-6 text-center py-6">
            
            <!-- Rocket Icon Badge with Ambient Sky Glow -->
            <div class="relative group">
              <div class="absolute -inset-2 rounded-2xl bg-sky/20 blur-xl opacity-75 group-hover:opacity-100 transition-opacity"></div>
              <div class="relative flex size-14 items-center justify-center rounded-2xl border border-sky/35 bg-[#0a1d40]/80 text-sky shadow-[0_0_30px_rgba(58,160,219,0.35)] backdrop-blur-xl">
                <svg class="size-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10 9 9 9 8 9"/>
                </svg>
              </div>
            </div>

            <!-- Header Titles -->
            <div class="flex flex-col items-center gap-3">
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky/10 border border-sky/30 text-[11px] font-mono font-bold text-sky uppercase tracking-widest">
                <span class="size-2 rounded-full bg-sky animate-ping"></span>
                <span>Clinical Monographs &amp; Catalogs</span>
              </div>
              <h1 class="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl text-white">
                Something great is coming
              </h1>
              <p class="max-w-md text-sm text-cream/70 leading-relaxed">
                We are compiling our interactive digital product catalogs, clinical reference monographs, and hospital procurement specifications. Leave your email and be the first to know when we launch.
              </p>
            </div>

            <!-- Waitlist Form -->
            <form onsubmit="event.preventDefault(); const btn=this.querySelector('button'); btn.textContent='Added to Waitlist!'; btn.classList.add('bg-emerald-500'); setTimeout(()=>{btn.textContent='Notify me'; btn.classList.remove('bg-emerald-500');}, 3000);" class="flex w-full max-w-md flex-col gap-2.5 sm:flex-row">
              <input
                type="email"
                required
                placeholder="you@example.com"
                aria-label="Email address"
                class="flex h-11 w-full rounded-full border border-white/15 bg-white/5 px-4 text-sm text-white placeholder:text-cream/40 backdrop-blur-md transition-all focus:border-sky focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-sky/30"
              />
              <button
                type="submit"
                class="inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-sky px-6 text-sm font-bold text-[#0a1d40] shadow-[0_0_25px_rgba(58,160,219,0.35)] transition-all hover:bg-[#72c5f8] hover:scale-105 active:scale-95 cursor-pointer"
              >
                Notify me
              </button>
            </form>

            <!-- Waitlist Avatars & Counter -->
            <div class="flex items-center gap-3 mt-1">
              <div class="flex -space-x-2">
                <img src="https://cdn.21st.dev/assets/mirror/3b/3b0a3ee40a55d8217002ce43ee42ad7f55fff9d0f8d571cd699a260387638025.jpg" alt="" class="size-8 rounded-full border-2 border-[#0a1d40] object-cover grayscale opacity-85 hover:grayscale-0 hover:opacity-100 transition-all">
                <img src="https://cdn.21st.dev/assets/mirror/c8/c839283fbbc8b5174e41d8d779a0c700a8647e7b8fa42d933a544acde2ea58ef.jpg" alt="" class="size-8 rounded-full border-2 border-[#0a1d40] object-cover grayscale opacity-85 hover:grayscale-0 hover:opacity-100 transition-all">
                <img src="https://cdn.21st.dev/assets/mirror/51/513243ddb336cac94373daed86b5708fbe8204f747df84d619f1c93807e564fe.jpg" alt="" class="size-8 rounded-full border-2 border-[#0a1d40] object-cover grayscale opacity-85 hover:grayscale-0 hover:opacity-100 transition-all">
                <img src="https://cdn.21st.dev/assets/mirror/b3/b36ca9959c3ac97d0eb9be717a26d714fb6133f1c9fa07b1cef6118ecc97e40e.jpg" alt="" class="size-8 rounded-full border-2 border-[#0a1d40] object-cover grayscale opacity-85 hover:grayscale-0 hover:opacity-100 transition-all">
              </div>
              <span class="text-xs text-cream/70 font-medium">
                Join <strong class="text-white font-bold">2,000+</strong> on the waitlist
              </span>
            </div>

            <!-- Social / Verification Links -->
            <div class="flex items-center gap-5 text-cream/60 mt-1">
              <a href="#contact" aria-label="Inquire Directly" class="hover:text-sky transition-colors flex items-center gap-1.5 text-xs">
                <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                <span>Request Sample Pack</span>
              </a>
              <span class="text-white/20">&bull;</span>
              <a href="https://mediqvision.com/mobile/index.html" target="_blank" rel="noopener noreferrer" class="hover:text-sky transition-colors flex items-center gap-1.5 text-xs">
                <span>View Interactive Flipbook &nearr;</span>
              </a>
            </div>

          </div>

          <!-- Bottom Micro Footer -->
          <div class="relative z-20 w-full max-w-5xl mx-auto flex items-center justify-between text-[11px] text-cream/50 pt-2 border-t border-white/5">
            <span>Clinical Monographs &bull; Whitepapers &bull; FDA Certifications</span>
            <span>Philippine Exclusive Distribution &bull; MediQ Pharma</span>
          </div>

        </div>'''

# Extract Slide 3 & Slide 4 region accurately
s3_start = html.find('<!-- ================= SLIDE 3:')
if s3_start == -1:
    s3_start = html.find('<div class="product-slide absolute inset-0 w-full h-full flex flex-col justify-center items-center px-4 sm:px-8 lg:px-12 py-16 transition-all duration-500 ease-out opacity-0 pointer-events-none translate-x-12 z-0 overflow-y-auto" data-product-index="3">')

s_end = html.find('<!-- Products Deck Overlay Controller & Scripts -->')
if s_end == -1:
    # Find closing of products section
    s_end = html.find('</div>\n\n    </section>\n\n  </main>')
    if s_end == -1:
        s_end = html.find('</section>', html.find('data-product-index="4"'))

print(f"s3_start: {s3_start}, s_end: {s_end}")

# Replace region between s3_start and the end of slide 4
s4_start = html.find('data-product-index="4"')
# Find closing </div> of slide 4
slide4_div_end = html.find('</div>\n\n      </div>\n\n    </section>', s4_start)
if slide4_div_end == -1:
    slide4_div_end = html.find('</div>\n      </div>\n    </section>', s4_start)
if slide4_div_end == -1:
    # Look for </section> after s4_start
    sec_end = html.find('</section>', s4_start)
    # The last </div> before </section>
    slide4_div_end = html.rfind('</div>', s4_start, sec_end)
    # we want up to the closing div of slide 4
    # let's find the closing tag of slide 4
    print("Found sec_end:", sec_end, "slide4_div_end:", slide4_div_end)

# Let's replace precisely by matching data-product-index="3" up to data-product-index="4"
s3_full_pattern = re.compile(r'<!--\s*={5,}\s*SLIDE 3:.*?data-product-index="3".*?</div>\s*(?=<!--\s*={5,}\s*SLIDE 4:|<div[^>]*data-product-index="4")', re.DOTALL)
m3 = s3_full_pattern.search(html)
if m3:
    print("Found SLIDE 3 match!")
else:
    print("SLIDE 3 regex not found directly")

s4_full_pattern = re.compile(r'(<!--\s*={5,}\s*SLIDE 4:|<div[^>]*data-product-index="4").*?</div>\s*(?=\s*</div>\s*</section>)', re.DOTALL)
m4 = s4_full_pattern.search(html)
if m4:
    print("Found SLIDE 4 match!")
else:
    print("SLIDE 4 regex not found directly")

