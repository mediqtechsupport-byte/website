import re
from pathlib import Path

pillars = [
    dict(idx=0, n="01", cat="Supply chain", title="Strategic importation and distribution",
         img="assets/img/pillars/p1_cleanroom_inspect.jpg", sl="Cold-chain dispatch", sv="24–48 hours",
         num="24–48", meta="hours · cold-chain dispatch", p1="24", p2="48", sep="–", suffix="",
         visual="cold-chain",
         short="Temperature-controlled products leave our warehouse within two days of an order.",
         desc="We source Rayner and partner products directly from the manufacturer, coordinate customs clearance, and keep cleanroom-grade inventory ready so surgeons never wait on a lens.",
         pts="Product sourcing &amp; importation coordination|Cleanroom inventory reserves|GDP-compliant cold-chain logistics|Port-of-entry to operating-room tracking"),
    dict(idx=1, n="02", cat="Commercial", title="Product marketing and brand development",
         img="assets/img/pillars/p2_headquarters_brand.jpg", sl="Academic symposia", sv="25+ per year",
         num="25+", meta="per year · academic symposia", p1="25", p2="", sep="", suffix="+",
         visual="symposia-bars",
         short="Medical meetings and campaigns that put each brand in front of the right surgeons.",
         desc="We build clinical-first brand programs that connect international innovators with Philippine ophthalmologists through congresses, symposia and peer-to-peer education.",
         pts="Brand strategy &amp; clinical positioning|Surgeon symposia and advisory boards|PAO and congress exhibitions|Launch campaigns for new technologies"),
    dict(idx=2, n="03", cat="Field network", title="Nationwide clinical and sales coverage",
         img="assets/img/pillars/p3_specialist_discussion.jpg", sl="Archipelago reach", sv="17 regions",
         num="17", meta="regions · archipelago reach", p1="17", p2="", sep="", suffix="",
         visual="archipelago-routes",
         short="Clinical specialists and sales teams in every region, from Luzon to Mindanao.",
         desc="Our clinical specialists work alongside surgical teams in Luzon, Visayas and Mindanao, handling detailing, consignment and hospital relationships.",
         pts="Direct surgical-suite detailing|Operating-room consignment management|Hospital and ASC relations|Coverage across NCR, Luzon, Visayas, Mindanao"),
    dict(idx=3, n="04", cat="Governance", title="Regulatory compliance and QA",
         img="assets/img/pillars/p6_quality_metrology.jpg", sl="Regulatory audits", sv="100% pass",
         num="100%", meta="pass · regulatory audits", p1="100", p2="", sep="", suffix="%",
         visual="governance-ring",
         short="Every shipment, label and registration is checked before it reaches a hospital.",
         desc="Every product we distribute is registered, traceable and stored under audited conditions, with continuous temperature monitoring and post-market surveillance.",
         pts="Philippine FDA product registration|GDP / CDRR certification|Thermal mapping &amp; temperature monitoring|Pharmacovigilance &amp; recall readiness"),
    dict(idx=4, n="05", cat="Professional development", title="Clinical and surgical education",
         img="assets/img/pillars/p5_theatre_wetlab.jpg", sl="Surgeons trained", sv="500+ fellows",
         num="500+", meta="fellows · surgeons trained", p1="500", p2="", sep="", suffix="+",
         visual="education-matrix",
         short="Hands-on courses and fellowships that build surgical skill close to home.",
         desc="Hands-on dry and wet labs, phacoemulsification masterclasses and accredited workshops that raise surgical outcomes for residents and fellows alike.",
         pts="Dry &amp; wet lab courses|Phacoemulsification masterclasses|CME-accredited modules|Live and recorded video surgery"),
    dict(idx=5, n="06", cat="Continuity", title="Comprehensive post-market support",
         img="assets/img/pillars/p6_lot_traceability.jpg", sl="Service SLA", sv="24/7 priority",
         num="24/7", meta="priority · service response", p1="24", p2="7", sep="/", suffix="",
         visual="continuity-dial",
         short="Surgeons reach a support specialist at any hour, with priority for urgent cases.",
         desc="After the sale we stay close: equipment calibration, biometry assistance, surgical feedback loops and a technical hotline for ophthalmic teams.",
         pts="Equipment calibration &amp; in-service|IOL biometry assistance|Surgical feedback loops|24/7 technical hotline"),
]

tabs = []
for p in pillars:
    first = p["idx"] == 0
    tabs.append(f'''                <button type="button" id="wwd-tab-{p['idx']}" role="tab" aria-selected="{'true' if first else 'false'}" aria-controls="wwd-stage-panel" tabindex="{'0' if first else '-1'}"
                  data-n="{p['n']}" data-cat="{p['cat']}" data-title="{p['title']}" data-img="{p['img']}" data-sl="{p['sl']}" data-sv="{p['sv']}"
                  data-stat-num="{p['num']}" data-stat-meta="{p['meta']}" data-stat-p1="{p['p1']}" data-stat-p2="{p['p2']}" data-stat-sep="{p['sep']}" data-stat-suffix="{p['suffix']}"
                  data-visual="{p['visual']}" data-short-desc="{p['short']}" data-desc="{p['desc']}" data-pts="{p['pts']}"
                  class="wwd-selector-tab{' is-active' if first else ''} relative shrink-0 w-[240px] lg:w-full lg:flex-1 lg:min-h-0 flex flex-col justify-center text-left py-2 cursor-pointer rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#72c5f8]/70">
                  <span class="wwd-tab-bar absolute left-0 top-[12%] bottom-[12%] w-[3px] rounded-full" aria-hidden="true"></span>
                  <span class="wwd-tab-cat block text-[12px] xl:text-[13px] leading-tight">{p['cat']}</span>
                  <span class="wwd-tab-title block text-[16px] sm:text-[17px] xl:text-[19px] font-bold leading-snug mt-1">{p['title']}</span>
                </button>''')

p0 = pillars[0]

slide_html = f'''        <!-- ========================================================================= -->
        <!-- SLIDE 3: WHAT WE DO (Open editorial layout over smoke: list + stat stage) -->
        <!-- ========================================================================= -->
        <div id="about-slide-what-we-do" class="about-slide absolute top-0 left-0 right-0 w-full h-[calc(100svh-4.5rem)] flex flex-col text-cream px-6 sm:px-10 lg:px-16 pt-[120px] pb-6 overflow-y-auto lg:overflow-hidden transition-all duration-500 ease-out opacity-0 pointer-events-none translate-x-12 z-0" data-index="2">

          <style id="wwd-stage-scoped-styles">
            /* Transparent slide so the #about smoke canvas shows through; faint dot grid on top */
            #about-slide-what-we-do {{
              background-color: transparent;
              background-image: radial-gradient(rgba(114, 197, 248, 0.14) 1px, transparent 1.2px);
              background-size: 22px 22px;
            }}
            #about-slide-what-we-do .wwd-list-rail {{ background: rgba(255, 255, 255, 0.10); }}
            #about-slide-what-we-do .wwd-selector-tab {{
              padding-left: 1.75rem;
              transition: padding-left .28s cubic-bezier(.22,1,.36,1);
            }}
            #about-slide-what-we-do .wwd-selector-tab .wwd-tab-bar {{ background: transparent; transition: background-color .2s ease; }}
            #about-slide-what-we-do .wwd-selector-tab .wwd-tab-cat {{ color: rgba(58, 160, 219, 0.75); }}
            #about-slide-what-we-do .wwd-selector-tab .wwd-tab-title {{ color: rgba(196, 208, 226, 0.55); transition: color .2s ease; }}
            #about-slide-what-we-do .wwd-selector-tab:hover:not(.is-active) .wwd-tab-title {{ color: rgba(230, 238, 248, 0.85); }}
            #about-slide-what-we-do .wwd-selector-tab.is-active {{ padding-left: 2.35rem; }}
            #about-slide-what-we-do .wwd-selector-tab.is-active .wwd-tab-bar {{ background: #4fc3f7; box-shadow: 0 0 12px rgba(79, 195, 247, 0.7); }}
            #about-slide-what-we-do .wwd-selector-tab.is-active .wwd-tab-cat {{ color: #4fc3f7; }}
            #about-slide-what-we-do .wwd-selector-tab.is-active .wwd-tab-title {{ color: #ffffff; }}
            #about-slide-what-we-do .wwd-text-pill {{
              border: 1px solid rgba(255, 255, 255, 0.14);
              background: rgba(10, 29, 64, 0.35);
              color: rgba(246, 242, 234, 0.85);
              backdrop-filter: blur(8px);
              -webkit-backdrop-filter: blur(8px);
              transition: border-color .2s ease, color .2s ease;
            }}
            #about-slide-what-we-do .wwd-text-pill:hover {{ border-color: #4fc3f7; color: #ffffff; }}
            #about-slide-what-we-do .wwd-link-underline {{ transition: width .25s cubic-bezier(.22,1,.36,1); }}
            #about-slide-what-we-do .wwd-link:hover .wwd-link-underline {{ width: 100%; }}
            @keyframes wwdSwap {{ from {{ opacity: .35; transform: translateY(4px); }} to {{ opacity: 1; transform: none; }} }}
            #about-slide-what-we-do .wwd-stage-swap {{ animation: wwdSwap 260ms cubic-bezier(.22,1,.36,1) both; }}
            @media (prefers-reduced-motion: reduce) {{
              #about-slide-what-we-do .wwd-stage-swap {{ animation: none !important; }}
              #about-slide-what-we-do .wwd-selector-tab {{ transition: none; }}
            }}
          </style>

          <!-- Pill navigation: identical position & style to the other About slides -->
          <div class="absolute top-[76px] left-0 right-0 z-30 px-6 sm:px-10 lg:px-16 flex items-center justify-between gap-3 pointer-events-none">
            <button type="button" onclick="if(window.goToAboutSlide){{window.goToAboutSlide(1);}}" class="pointer-events-auto inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-cream/90 hover:text-white transition-all cursor-pointer backdrop-blur-md"><svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m15 18-6-6 6-6"/></svg><span>Who We Are</span></button>
            <button type="button" onclick="if(window.goToAboutSlide){{window.goToAboutSlide(3);}}" class="pointer-events-auto inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-cream/90 hover:text-white transition-all cursor-pointer backdrop-blur-md"><span>Our Foundation</span><svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m9 18 6-6-6-6"/></svg></button>
          </div>

          <div class="relative z-20 w-full h-full flex flex-col">

            <!-- Header -->


            <div class="shrink-0 mb-4 lg:mb-6">
              <h2 id="wwd-headline" class="text-[30px] sm:text-[40px] lg:text-[44px] 2xl:text-[56px] font-semibold tracking-[-0.025em] leading-[1.05] text-white">
                What we do: <span class="text-[#4fc3f7]">core capabilities</span> and clinical network
              </h2>
              <p id="wwd-subtext" class="mt-2 text-[13px] sm:text-[15px] text-[#b8c6dc] leading-relaxed max-w-[820px]">
                Clinical distribution, product marketing, regulatory compliance, and surgical partnerships across the Philippines.
              </p>
            </div>

            <!-- Two columns: list (left) + open stage (right) -->
            <div id="wwd-interactive-root" class="grid grid-cols-1 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] gap-6 lg:gap-16 flex-1 min-h-0">

              <!-- Selector list with continuous left rail -->
              <div id="wwd-tablist" role="tablist" aria-label="Core capabilities" class="relative flex lg:flex-col gap-2 lg:gap-1 overflow-x-auto lg:overflow-visible pb-1 lg:pb-0 min-h-0 lg:h-full lg:max-w-[440px]">
                <span class="wwd-list-rail hidden lg:block absolute left-0 top-0 bottom-0 w-px" aria-hidden="true"></span>
{chr(10).join(tabs)}
              </div>

              <!-- Open stage (no card) -->
              <div id="wwd-stage-panel" role="tabpanel" aria-labelledby="wwd-tab-0" aria-live="polite" class="min-h-0 flex flex-col">
                <div id="wwd-stage-card" class="relative flex-1 min-h-[440px] lg:min-h-0 h-full flex flex-col">

                  <div class="shrink-0">
                    <div class="flex flex-wrap items-end gap-x-4 gap-y-1">
                      <span id="wwd-stage-stat-num" class="text-[64px] sm:text-[96px] xl:text-[128px] font-extrabold text-[#4fc3f7] tracking-[-0.045em] tabular-nums leading-[0.88]">{p0['num']}</span>
                      <span id="wwd-stage-stat-meta" class="pb-1.5 text-[13px] sm:text-[15px] text-[#b8c6dc]">{p0['meta']}</span>
                    </div>
                    <p id="wwd-stage-desc" class="mt-4 text-[14px] sm:text-[15px] xl:text-[16px] text-white/90 leading-relaxed max-w-[520px]">{p0['short']}</p>
                  </div>

                  <div id="wwd-stage-visual-wrap" class="relative flex-1 min-h-[220px] my-3">
                    <canvas id="wwd-stage-canvas" class="absolute inset-0 w-full h-full block" aria-hidden="true"></canvas>
                  </div>

                  <div class="shrink-0 flex items-center gap-8">
                    <button type="button" id="wwd-stage-modal-btn"
                      data-n="{p0['n']}" data-cat="{p0['cat']}" data-title="{p0['title']}" data-img="{p0['img']}" data-sl="{p0['sl']}" data-sv="{p0['sv']}" data-desc="{p0['desc']}" data-pts="{p0['pts']}"
                      class="wwd-card wwd-link group inline-flex items-center gap-2.5 text-[14px] sm:text-[15px] font-semibold text-white cursor-pointer rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#72c5f8]/70">
                      <span class="relative pb-1.5">Learn more<span class="wwd-link-underline absolute left-0 bottom-0 h-[2px] w-6 rounded-full bg-white/85"></span></span>
                      <svg class="size-4 -mt-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                    </button>
                  </div>

                </div>
              </div>

            </div>
          </div>

          <!-- Learn-more detail card (modal) -->
          <div id="wwd-modal" class="absolute inset-0 z-50 items-center justify-center p-4 sm:p-8 bg-[#030b1c]/80 backdrop-blur-md opacity-0 transition-opacity duration-300" style="display:none" role="dialog" aria-modal="true" aria-labelledby="wwd-modal-title">
            <div class="relative w-full max-w-5xl max-h-full overflow-y-auto rounded-3xl border border-sky/35 bg-[#071530] shadow-[0_30px_80px_rgba(0,0,0,0.8)] grid grid-cols-1 md:grid-cols-2">
              <button type="button" id="wwd-modal-close" aria-label="Close" class="absolute top-3 right-3 z-10 size-9 rounded-full bg-black/60 border border-white/15 hover:border-sky text-white flex items-center justify-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#72c5f8]/70">
                <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </button>
              <div class="relative min-h-[220px] md:min-h-[420px]">
                <img id="wwd-modal-img" src="" alt="" class="absolute inset-0 h-full w-full object-cover">
                <div class="absolute inset-0 bg-gradient-to-t from-[#071530] via-transparent to-transparent md:bg-gradient-to-r"></div>
              </div>
              <div class="p-6 sm:p-8 flex flex-col gap-3">
                <span id="wwd-modal-tag" class="self-start text-[12px] text-[#4fc3f7]"></span>
                <h3 id="wwd-modal-title" class="text-2xl sm:text-3xl font-extrabold text-white leading-tight"></h3>
                <p id="wwd-modal-desc" class="text-sm sm:text-base text-cream/80 leading-relaxed"></p>
                <ul id="wwd-modal-pts" class="grid gap-2 text-sm text-cream/90"></ul>
                <div class="mt-auto pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                  <div><div id="wwd-modal-sl" class="text-[12px] text-[#b8c6dc]"></div><div id="wwd-modal-sv" class="text-xl font-extrabold text-[#4fc3f7]"></div></div>
                  <a href="#contact" id="wwd-modal-cta" class="wwd-text-pill inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-medium cursor-pointer"><span>Contact us</span><svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
                </div>
              </div>
            </div>
          </div>

        </div>'''

pattern = re.compile(
    r'<!-- ========================================================================= -->\s*<!-- SLIDE 3: WHAT WE DO.*?<!-- ========================================================================= -->\s*<!-- SLIDE 4: OUR ESTABLISHED FOUNDATION',
    re.DOTALL)

for fp in [Path("index.html"), Path("components/about-locked-backup.html")]:
    raw = fp.read_bytes().replace(b"\r\r\n", b"\n").replace(b"\r\n", b"\n").decode("utf-8")
    m = pattern.search(raw)
    if not m:
        raise RuntimeError(f"Slide 3 not found in {fp}")
    out = raw[:m.start()] + slide_html + "\n\n        <!-- ========================================================================= -->\n        <!-- SLIDE 4: OUR ESTABLISHED FOUNDATION" + raw[m.end():]
    fp.write_bytes(out.encode("utf-8"))
    print("Updated", fp)

