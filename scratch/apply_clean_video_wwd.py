import re
from pathlib import Path

pillars = [
    {
        "idx": 0,
        "n": "01",
        "cat": "Supply chain",
        "title": "Strategic importation and distribution",
        "img": "assets/img/pillars/p1_cleanroom_inspect.jpg",
        "sl": "cold-chain dispatch",
        "sv": "24–48 hours",
        "stat_num": "24–48",
        "stat_meta": "hours · cold-chain dispatch",
        "p1": "24",
        "p2": "48",
        "sep": "–",
        "suffix": "",
        "visual": "cold-chain",
        "short_desc": "Temperature-controlled products leave our warehouse within two days of an order.",
        "desc": "We source Rayner and partner products directly from the manufacturer, coordinate customs clearance, and keep cleanroom-grade inventory ready so surgeons never wait on a lens.",
        "pts": "Product sourcing &amp; importation coordination|Cleanroom inventory reserves|GDP-compliant cold-chain logistics|Port-of-entry to operating-room tracking",
    },
    {
        "idx": 1,
        "n": "02",
        "cat": "Commercial",
        "title": "Product marketing and brand development",
        "img": "assets/img/pillars/p2_headquarters_brand.jpg",
        "sl": "academic symposia",
        "sv": "25+ per year",
        "stat_num": "25+",
        "stat_meta": "per year · academic symposia",
        "p1": "25",
        "p2": "",
        "sep": "",
        "suffix": "+",
        "visual": "symposia-bars",
        "short_desc": "Medical meetings and campaigns that put each brand in front of the right surgeons.",
        "desc": "We build clinical-first brand programs that connect international innovators with Philippine ophthalmologists through congresses, symposia and peer-to-peer education.",
        "pts": "Brand strategy &amp; clinical positioning|Surgeon symposia and advisory boards|PAO and congress exhibitions|Launch campaigns for new technologies",
    },
    {
        "idx": 2,
        "n": "03",
        "cat": "Field network",
        "title": "Nationwide clinical and sales coverage",
        "img": "assets/img/pillars/p3_specialist_discussion.jpg",
        "sl": "archipelago reach",
        "sv": "17 regions",
        "stat_num": "17",
        "stat_meta": "regions · archipelago reach",
        "p1": "17",
        "p2": "",
        "sep": "",
        "suffix": "",
        "visual": "archipelago-routes",
        "short_desc": "Clinical specialists and sales teams in every region, from Luzon to Mindanao.",
        "desc": "Our clinical specialists work alongside surgical teams in Luzon, Visayas and Mindanao, handling detailing, consignment and hospital relationships.",
        "pts": "Direct surgical-suite detailing|Operating-room consignment management|Hospital and ASC relations|Coverage across NCR, Luzon, Visayas, Mindanao",
    },
    {
        "idx": 3,
        "n": "04",
        "cat": "Governance",
        "title": "Regulatory compliance and QA",
        "img": "assets/img/pillars/p6_quality_metrology.jpg",
        "sl": "regulatory audits",
        "sv": "100% pass",
        "stat_num": "100",
        "stat_meta": "% · regulatory audits passed",
        "p1": "100",
        "p2": "",
        "sep": "",
        "suffix": "",
        "visual": "governance-ring",
        "short_desc": "Every shipment, label and registration is checked before it reaches a hospital.",
        "desc": "Every product we distribute is registered, traceable and stored under audited conditions, with continuous temperature monitoring and post-market surveillance.",
        "pts": "Philippine FDA product registration|GDP / CDRR certification|Thermal mapping &amp; temperature monitoring|Pharmacovigilance &amp; recall readiness",
    },
    {
        "idx": 4,
        "n": "05",
        "cat": "Professional development",
        "title": "Clinical and surgical education",
        "img": "assets/img/pillars/p5_theatre_wetlab.jpg",
        "sl": "surgeons trained",
        "sv": "500+ fellows",
        "stat_num": "500+",
        "stat_meta": "fellows · surgeons trained",
        "p1": "500",
        "p2": "",
        "sep": "",
        "suffix": "+",
        "visual": "education-matrix",
        "short_desc": "Hands-on courses and fellowships that build surgical skill close to home.",
        "desc": "Hands-on dry and wet labs, phacoemulsification masterclasses and accredited workshops that raise surgical outcomes for residents and fellows alike.",
        "pts": "Dry &amp; wet lab courses|Phacoemulsification masterclasses|CME-accredited modules|Live and recorded video surgery",
    },
    {
        "idx": 5,
        "n": "06",
        "cat": "Continuity",
        "title": "Comprehensive post-market support",
        "img": "assets/img/pillars/p6_lot_traceability.jpg",
        "sl": "service response",
        "sv": "24/7 priority",
        "stat_num": "24/7",
        "stat_meta": "priority · service response",
        "p1": "24",
        "p2": "7",
        "sep": "/",
        "suffix": "",
        "visual": "continuity-dial",
        "short_desc": "Surgeons reach a support specialist at any hour, with priority for urgent cases.",
        "desc": "After the sale we stay close: equipment calibration, biometry assistance, surgical feedback loops and a technical hotline for ophthalmic teams.",
        "pts": "Equipment calibration &amp; in-service|IOL biometry assistance|Surgical feedback loops|24/7 technical hotline",
    },
]

tabs_html = []
for p in pillars:
    is_first = p["idx"] == 0
    sel_str = "true" if is_first else "false"
    tab_idx = "0" if is_first else "-1"
    active_cls = "is-active" if is_first else ""
    tabs_html.append(f'''                <button type="button"
                  id="wwd-tab-{p['idx']}"
                  role="tab"
                  aria-selected="{sel_str}"
                  aria-controls="wwd-stage-panel"
                  tabindex="{tab_idx}"
                  data-pillar-idx="{p['idx']}"
                  data-n="{p['n']}"
                  data-cat="{p['cat']}"
                  data-title="{p['title']}"
                  data-img="{p['img']}"
                  data-sl="{p['sl']}"
                  data-sv="{p['sv']}"
                  data-stat-num="{p['stat_num']}"
                  data-stat-meta="{p['stat_meta']}"
                  data-stat-p1="{p['p1']}"
                  data-stat-p2="{p['p2']}"
                  data-stat-sep="{p['sep']}"
                  data-stat-suffix="{p['suffix']}"
                  data-visual="{p['visual']}"
                  data-short-desc="{p['short_desc']}"
                  data-desc="{p['desc']}"
                  data-pts="{p['pts']}"
                  class="wwd-selector-tab {active_cls} group relative flex flex-col justify-center rounded-xl px-4 py-3 text-left cursor-pointer shrink-0 w-[240px] sm:w-[260px] lg:w-full lg:flex-1 overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#72c5f8]">
                  <span class="text-[11px] sm:text-xs font-medium text-sky/75 group-hover:text-sky transition-colors leading-tight">{p['cat']}</span>
                  <span class="text-sm sm:text-[15px] font-bold text-white leading-snug mt-0.5">{p['title']}</span>
                  <span class="wwd-tab-track pointer-events-none absolute bottom-0 left-3 right-3 h-[2.5px] rounded-full bg-transparent overflow-hidden">
                    <span class="wwd-tab-progress block h-full w-full origin-left scale-x-0 bg-[#3aa0db] rounded-full"></span>
                  </span>
                </button>''')

p0 = pillars[0]

slide_html = f'''        <!-- ========================================================================= -->
        <!-- SLIDE 3: WHAT WE DO (Clean Minimalist Stage + Selector matching Video)    -->
        <!-- ========================================================================= -->
        <div id="about-slide-what-we-do" class="about-slide absolute top-0 left-0 right-0 w-full h-[calc(100svh-4.5rem)] flex flex-col bg-transparent text-cream px-4 sm:px-8 lg:px-14 pt-3.5 pb-4 overflow-y-auto lg:overflow-hidden transition-all duration-500 ease-out opacity-0 pointer-events-none translate-x-12 z-0" data-index="2">

          <style id="wwd-stage-scoped-styles">
            #about-slide-what-we-do .wwd-selector-tab {{
              background: transparent;
              border: 1px solid transparent;
              transition: background-color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
            }}
            #about-slide-what-we-do .wwd-selector-tab:hover:not(.is-active) {{
              background: rgba(12, 34, 74, 0.35);
            }}
            #about-slide-what-we-do .wwd-selector-tab.is-active {{
              background: rgba(11, 31, 68, 0.85);
              backdrop-filter: blur(14px);
              -webkit-backdrop-filter: blur(14px);
              border-color: rgba(114, 197, 248, 0.28);
              box-shadow: 0 12px 32px rgba(2, 10, 28, 0.45);
            }}
            #about-slide-what-we-do .wwd-selector-tab.is-active .wwd-tab-track {{
              background: rgba(114, 197, 248, 0.14);
            }}
            #about-slide-what-we-do .wwd-clean-stage {{
              background: rgba(10, 27, 60, 0.78);
              backdrop-filter: blur(20px);
              -webkit-backdrop-filter: blur(20px);
              border: 1px solid rgba(114, 197, 248, 0.22);
              box-shadow: 0 24px 60px rgba(2, 8, 24, 0.55);
            }}
            @keyframes wwdCleanSwap {{
              0% {{ opacity: 0.4; transform: translateY(3px); }}
              100% {{ opacity: 1; transform: translateY(0); }}
            }}
            #about-slide-what-we-do .wwd-stage-Swap {{
              animation: wwdCleanSwap 240ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
            }}
            @media (prefers-reduced-motion: reduce) {{
              #about-slide-what-we-do .wwd-stage-Swap {{
                animation: none !important;
              }}
            }}
          </style>

          <div class="relative z-20 w-full max-w-[1440px] mx-auto h-full flex flex-col">

            <!-- Top Slide Navigation Bar (Who We Are <- -> Our Foundation) -->
            <div id="wwd-nav-row" class="flex items-center justify-between gap-3 mb-2 shrink-0">
              <button type="button" onclick="if(window.goToAboutSlide){{window.goToAboutSlide(1);}}" class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-cream/90 hover:text-white transition-colors cursor-pointer backdrop-blur-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#72c5f8]">
                <svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m15 18-6-6 6-6"/></svg>
                <span>Who We Are</span>
              </button>
              <button type="button" onclick="if(window.goToAboutSlide){{window.goToAboutSlide(3);}}" class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-cream/90 hover:text-white transition-colors cursor-pointer backdrop-blur-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#72c5f8]">
                <span>Our Foundation</span>
                <svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m9 18 6-6-6-6"/></svg>
              </button>
            </div>

            <!-- Clean Left-Aligned Header matching Video -->
            <div id="wwd-header-row" class="mb-4 sm:mb-5 shrink-0 max-w-3xl">
              <h2 id="wwd-headline" class="text-2xl sm:text-3xl lg:text-[40px] font-extrabold text-white tracking-tight leading-[1.12]">
                What we do: <span class="text-[#3aa0db]">core capabilities</span> and clinical network
              </h2>
              <p id="wwd-subtext" class="text-xs sm:text-sm text-cream/70 mt-2 leading-relaxed max-w-xl">
                Clinical distribution, product marketing, regulatory compliance, and surgical partnerships across the Philippines.
              </p>
            </div>

            <!-- Clean Two-Column Layout matching Video: Left Selector (5 cols) + Right Stage Card (7 cols) -->
            <div id="wwd-interactive-root" class="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 flex-1 min-h-0">

              <!-- Left Column: Minimal 6-Item Selector List -->
              <div id="wwd-selector-col" class="lg:col-span-5 flex flex-col justify-between min-h-0">
                <div id="wwd-tablist"
                  role="tablist"
                  aria-label="Core capabilities and clinical network"
                  class="flex lg:flex-col gap-1.5 overflow-x-auto lg:overflow-x-visible pb-1 lg:pb-0 flex-1 min-h-0">
{chr(10).join(tabs_html)}
                </div>
              </div>

              <!-- Right Column: Clean Featured Stage Card -->
              <div id="wwd-stage-panel"
                role="tabpanel"
                aria-labelledby="wwd-tab-0"
                aria-live="polite"
                class="lg:col-span-7 min-h-0 flex flex-col">

                <div id="wwd-stage-card" class="wwd-clean-stage relative flex-1 min-h-0 rounded-2xl p-6 sm:p-8 lg:p-10 flex flex-col justify-between overflow-hidden">

                  <!-- Top of Stage: Large Stat Counter + Inline Unit/Label & Single-Sentence Description -->
                  <div class="shrink-0">
                    <div class="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span id="wwd-stage-stat-num" class="text-4xl sm:text-5xl lg:text-[56px] font-extrabold text-[#3aa0db] tracking-tight tabular-nums leading-none">
                        {p0['stat_num']}
                      </span>
                      <span id="wwd-stage-stat-meta" class="text-xs sm:text-sm text-cream/70 font-medium">
                        {p0['stat_meta']}
                      </span>
                    </div>

                    <p id="wwd-stage-desc" class="text-sm sm:text-[15px] text-cream/85 mt-3 max-w-xl leading-relaxed">
                      {p0['short_desc']}
                    </p>
                  </div>

                  <!-- Center of Stage: Clean Minimalist Visual Canvas -->
                  <div id="wwd-stage-visual-wrap" class="relative flex-1 min-h-[190px] sm:min-h-[220px] my-4 flex items-center justify-center overflow-hidden">
                    <canvas id="wwd-stage-canvas" class="w-full h-full block" aria-label="Capability visual"></canvas>
                  </div>

                  <!-- Bottom of Stage: "Find out more ->" (opens #wwd-modal card) & "Pause" button -->
                  <div class="shrink-0 flex items-center justify-between gap-4 pt-2">
                    <button type="button"
                      id="wwd-stage-modal-btn"
                      data-n="{p0['n']}"
                      data-cat="{p0['cat']}"
                      data-title="{p0['title']}"
                      data-img="{p0['img']}"
                      data-sl="{p0['sl']}"
                      data-sv="{p0['sv']}"
                      data-desc="{p0['desc']}"
                      data-pts="{p0['pts']}"
                      class="wwd-card inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] hover:bg-[#3aa0db] text-white hover:text-[#061229] border border-sky/30 hover:border-[#3aa0db] text-xs sm:text-[13px] font-semibold transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#72c5f8]">
                      <span>Find out more</span>
                      <span aria-hidden="true">&rarr;</span>
                    </button>

                    <button type="button"
                      id="wwd-pause-btn"
                      aria-pressed="false"
                      class="inline-flex items-center justify-center px-4 py-2 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/15 text-xs sm:text-[13px] font-medium text-cream/75 hover:text-white transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#72c5f8]">
                      Pause
                    </button>
                  </div>

                </div>
              </div>

            </div>
          </div>

          <!-- Find-out-more detail card modal (Preserved 100%) -->
          <div id="wwd-modal" class="absolute inset-0 z-50 items-center justify-center p-4 sm:p-8 bg-[#030b1c]/80 backdrop-blur-md opacity-0 transition-opacity duration-300" style="display:none" role="dialog" aria-modal="true" aria-labelledby="wwd-modal-title">
            <div class="relative w-full max-w-5xl max-h-full overflow-y-auto rounded-3xl border border-sky/35 bg-[#071530] shadow-[0_30px_80px_rgba(0,0,0,0.8)] grid grid-cols-1 md:grid-cols-2">
              <button type="button" id="wwd-modal-close" aria-label="Close" class="absolute top-3 right-3 z-10 size-9 rounded-full bg-black/60 border border-white/15 hover:border-sky text-white flex items-center justify-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#72c5f8]">
                <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </button>
              <div class="relative min-h-[220px] md:min-h-[420px]">
                <img id="wwd-modal-img" src="" alt="" class="absolute inset-0 h-full w-full object-cover">
                <div class="absolute inset-0 bg-gradient-to-t from-[#071530] via-transparent to-transparent md:bg-gradient-to-r"></div>
              </div>
              <div class="p-6 sm:p-8 flex flex-col gap-3">
                <span id="wwd-modal-tag" class="self-start px-2.5 py-0.5 rounded-md bg-sky/15 border border-sky/30 text-[11px] font-mono font-bold text-sky uppercase"></span>
                <h3 id="wwd-modal-title" class="text-2xl sm:text-3xl font-extrabold text-white leading-tight"></h3>
                <p id="wwd-modal-desc" class="text-sm sm:text-base text-cream/80 leading-relaxed"></p>
                <ul id="wwd-modal-pts" class="grid gap-2 text-sm text-cream/90"></ul>
                <div class="mt-auto pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                  <div><div id="wwd-modal-sl" class="text-[11px] font-mono uppercase text-cream/60"></div><div id="wwd-modal-sv" class="text-xl font-extrabold text-sky font-mono"></div></div>
                  <a href="#contact" id="wwd-modal-cta" class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-cream/90 hover:text-white transition-colors cursor-pointer backdrop-blur-md"><span>Contact us</span><svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m9 18 6-6-6-6"/></svg></a>
                </div>
              </div>
            </div>
          </div>

        </div>'''

pattern = re.compile(
    r'<!-- ========================================================================= -->\s*<!-- SLIDE 3: WHAT WE DO.*?<!-- ========================================================================= -->\s*<!-- SLIDE 4: OUR ESTABLISHED FOUNDATION',
    re.DOTALL
)

for fp in [Path("index.html"), Path("components/about-locked-backup.html")]:
    raw = fp.read_bytes().replace(b"\r\r\n", b"\n").replace(b"\r\n", b"\n").decode("utf-8")
    m = pattern.search(raw)
    if not m:
        raise RuntimeError(f"Could not find Slide 3 block in {fp}")
    new_txt = (
        raw[:m.start()]
        + slide_html
        + "\n\n        <!-- ========================================================================= -->\n        <!-- SLIDE 4: OUR ESTABLISHED FOUNDATION"
        + raw[m.end():]
    )
    fp.write_bytes(new_txt.encode("utf-8"))
    print(f"Updated {fp} cleanly")
