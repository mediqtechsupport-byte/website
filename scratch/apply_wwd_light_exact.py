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
                  class="wwd-selector-tab{' is-active' if first else ''} relative shrink-0 w-[260px] lg:w-full lg:flex-1 lg:min-h-0 flex flex-col justify-center text-left rounded-xl pl-6 pr-4 py-3 lg:py-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#72c5f8]/70">
                  <span class="wwd-tab-bar absolute left-0 top-[18%] bottom-[18%] w-[3px] rounded-full" aria-hidden="true"></span>
                  <span class="block text-[12px] xl:text-[13px] text-[#72c5f8]/85 leading-tight">{p['cat']}</span>
                  <span class="wwd-tab-title block text-[15px] sm:text-[16px] xl:text-[18px] font-bold leading-snug mt-1">{p['title']}</span>
                </button>''')

p0 = pillars[0]

slide_html = f'''        <!-- ========================================================================= -->
        <!-- SLIDE 3: WHAT WE DO (Clean light layout: selector list + stat stage card) -->
        <!-- ========================================================================= -->
        <div id="about-slide-what-we-do" class="about-slide absolute top-0 left-0 right-0 w-full h-[calc(100svh-4.5rem)] flex flex-col text-white px-4 sm:px-6 lg:px-10 pt-6 pb-4 overflow-y-auto lg:overflow-hidden transition-all duration-500 ease-out opacity-0 pointer-events-none translate-x-12 z-0" data-index="2">

          <style id="wwd-stage-scoped-styles">
            /* Transparent slide: the #about smoke canvas + silk waves show through */
            #about-slide-what-we-do {{ background: transparent; }}
            #about-slide-what-we-do .wwd-selector-tab {{
              background: transparent;
              border: 1px solid transparent;
              transition: background-color .2s ease, border-color .2s ease, box-shadow .2s ease;
            }}
            #about-slide-what-we-do .wwd-selector-tab .wwd-tab-bar {{ background: rgba(255, 255, 255, 0.14); }}
            #about-slide-what-we-do .wwd-selector-tab .wwd-tab-title {{ color: rgba(246, 242, 234, 0.68); }}
            #about-slide-what-we-do .wwd-selector-tab:hover:not(.is-active) .wwd-tab-title {{ color: #ffffff; }}
            #about-slide-what-we-do .wwd-selector-tab.is-active {{
              background: rgba(10, 29, 64, 0.62);
              backdrop-filter: blur(16px);
              -webkit-backdrop-filter: blur(16px);
              border-color: rgba(114, 197, 248, 0.32);
              box-shadow: 0 12px 30px rgba(2, 8, 24, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.06);
            }}
            #about-slide-what-we-do .wwd-selector-tab.is-active .wwd-tab-bar {{ background: #3aa0db; box-shadow: 0 0 10px rgba(58, 160, 219, 0.8); }}
            #about-slide-what-we-do .wwd-selector-tab.is-active .wwd-tab-title {{ color: #ffffff; }}
            #about-slide-what-we-do .wwd-stage-card {{
              background:
                radial-gradient(circle at 92% 6%, rgba(58, 160, 219, 0.22) 0%, transparent 32%),
                rgba(10, 27, 60, 0.58);
              backdrop-filter: blur(20px);
              -webkit-backdrop-filter: blur(20px);
              border: 1px solid rgba(114, 197, 248, 0.24);
              box-shadow: 0 24px 60px rgba(2, 8, 24, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.07);
            }}
            #about-slide-what-we-do .wwd-pill {{
              border: 1px solid rgba(255, 255, 255, 0.16);
              background: rgba(255, 255, 255, 0.05);
              color: rgba(246, 242, 234, 0.9);
              backdrop-filter: blur(10px);
              -webkit-backdrop-filter: blur(10px);
              transition: border-color .2s ease, color .2s ease, background-color .2s ease;
            }}
            #about-slide-what-we-do .wwd-pill:hover {{ border-color: #3aa0db; color: #ffffff; background: rgba(58, 160, 219, 0.16); }}
            @keyframes wwdSwap {{ from {{ opacity: .35; transform: translateY(3px); }} to {{ opacity: 1; transform: none; }} }}
            #about-slide-what-we-do .wwd-stage-swap {{ animation: wwdSwap 240ms cubic-bezier(.22,1,.36,1) both; }}
            @media (prefers-reduced-motion: reduce) {{
              #about-slide-what-we-do .wwd-stage-swap {{ animation: none !important; }}
            }}
          </style>

          <div class="relative z-20 w-full max-w-[1680px] mx-auto h-full flex flex-col">

            <!-- Slide navigation (Who We Are / Our Foundation) -->
            <div class="flex items-center justify-between gap-3 mb-3 shrink-0">
              <button type="button" onclick="if(window.goToAboutSlide){{window.goToAboutSlide(1);}}" class="wwd-pill inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-semibold cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#72c5f8]/70">
                <svg class="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m15 18-6-6 6-6"/></svg>
                <span>Who We Are</span>
              </button>
              <button type="button" onclick="if(window.goToAboutSlide){{window.goToAboutSlide(3);}}" class="wwd-pill inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-semibold cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#72c5f8]/70">
                <span>Our Foundation</span>
                <svg class="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m9 18 6-6-6-6"/></svg>
              </button>
            </div>

            <!-- Header -->
            <div class="shrink-0 mb-4 lg:mb-5">
              <h2 id="wwd-headline" class="text-[28px] sm:text-[34px] lg:text-[38px] 2xl:text-[44px] font-extrabold tracking-tight leading-[1.08] text-white">
                What we do: <span class="text-sky">core capabilities</span> and clinical network
              </h2>
              <p id="wwd-subtext" class="mt-1.5 text-[13px] sm:text-[14px] text-cream/70 leading-relaxed max-w-[760px]">
                Clinical distribution, product marketing, regulatory compliance, and surgical partnerships across the Philippines.
              </p>
            </div>

            <!-- Two columns -->
            <div id="wwd-interactive-root" class="grid grid-cols-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-4 lg:gap-6 flex-1 min-h-0">

              <!-- Selector list -->
              <div id="wwd-tablist" role="tablist" aria-label="Core capabilities" class="flex lg:flex-col gap-1.5 lg:gap-2 overflow-x-auto lg:overflow-visible pb-1 lg:pb-0 min-h-0 lg:h-full">
{chr(10).join(tabs)}
              </div>

              <!-- Stage card -->
              <div id="wwd-stage-panel" role="tabpanel" aria-labelledby="wwd-tab-0" aria-live="polite" class="min-h-0 flex flex-col">
                <div id="wwd-stage-card" class="wwd-stage-card relative flex-1 min-h-[420px] lg:min-h-0 h-full rounded-2xl p-5 sm:p-7 xl:p-8 flex flex-col overflow-hidden">

                  <div class="shrink-0">
                    <div class="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span id="wwd-stage-stat-num" class="text-[52px] sm:text-[68px] xl:text-[84px] font-extrabold text-sky tracking-[-0.03em] tabular-nums leading-[0.95]">{p0['num']}</span>
                      <span id="wwd-stage-stat-meta" class="text-[13px] sm:text-[14px] text-cream/70">{p0['meta']}</span>
                    </div>
                    <p id="wwd-stage-desc" class="mt-3 text-[14px] sm:text-[15px] xl:text-[16px] text-cream/85 leading-relaxed max-w-[560px]">{p0['short']}</p>
                  </div>

                  <div id="wwd-stage-visual-wrap" class="relative flex-1 min-h-[180px] my-3">
                    <canvas id="wwd-stage-canvas" class="absolute inset-0 w-full h-full block" aria-hidden="true"></canvas>
                  </div>

                  <div class="shrink-0 flex items-center justify-between gap-4">
                    <button type="button" id="wwd-stage-modal-btn"
                      data-n="{p0['n']}" data-cat="{p0['cat']}" data-title="{p0['title']}" data-img="{p0['img']}" data-sl="{p0['sl']}" data-sv="{p0['sv']}" data-desc="{p0['desc']}" data-pts="{p0['pts']}"
                      class="wwd-card wwd-pill inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-medium cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#72c5f8]/70">
                      <span>Learn more</span>
                      <svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                    </button>
                    <button type="button" id="wwd-pause-btn" aria-pressed="false" class="wwd-pill inline-flex items-center px-3.5 py-1.5 rounded-full text-[12px] font-medium cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#72c5f8]/70">Pause</button>
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
              </div>
              <div class="p-6 sm:p-8 flex flex-col gap-3">
                <span id="wwd-modal-tag" class="self-start text-[12px] text-[#72c5f8]/85"></span>
                <h3 id="wwd-modal-title" class="text-2xl sm:text-3xl font-extrabold text-white leading-tight"></h3>
                <p id="wwd-modal-desc" class="text-sm sm:text-base text-cream/80 leading-relaxed"></p>
                <ul id="wwd-modal-pts" class="grid gap-2 text-sm text-cream/85"></ul>
                <div class="mt-auto pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                  <div><div id="wwd-modal-sl" class="text-[12px] text-[#72c5f8]/85"></div><div id="wwd-modal-sv" class="text-xl font-extrabold text-sky"></div></div>
                  <a href="#contact" id="wwd-modal-cta" class="wwd-pill inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-medium cursor-pointer"><span>Contact us</span><svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
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

