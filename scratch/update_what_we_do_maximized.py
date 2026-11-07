import re
from pathlib import Path

pillars = [
    {
        "n": "01",
        "cat": "Supply Chain",
        "title": "Strategic Importation &amp; Distribution",
        "img": "assets/img/pillars/p1_cleanroom_inspect.jpg",
        "sl": "Cold-chain dispatch",
        "sv": "&lt; 24-48 Hours",
        "desc": "We source Rayner and partner products directly from the manufacturer, coordinate customs clearance, and keep cleanroom-grade inventory ready so surgeons never wait on a lens.",
        "pts": "Product sourcing &amp; importation coordination|Cleanroom inventory reserves|GDP-compliant cold-chain logistics|Port-of-entry to operating-room tracking",
    },
    {
        "n": "02",
        "cat": "Commercial",
        "title": "Product Marketing &amp; Brand Development",
        "img": "assets/img/pillars/p2_headquarters_brand.jpg",
        "sl": "Academic symposia",
        "sv": "25+ / Year",
        "desc": "We build clinical-first brand programs that connect international innovators with Philippine ophthalmologists through congresses, symposia and peer-to-peer education.",
        "pts": "Brand strategy &amp; clinical positioning|Surgeon symposia and advisory boards|PAO and congress exhibitions|Launch campaigns for new technologies",
    },
    {
        "n": "03",
        "cat": "Field Network",
        "title": "Nationwide Clinical &amp; Sales Coverage",
        "img": "assets/img/pillars/p3_specialist_discussion.jpg",
        "sl": "Archipelago reach",
        "sv": "17 Regions",
        "desc": "Our clinical specialists work alongside surgical teams in Luzon, Visayas and Mindanao, handling detailing, consignment and hospital relationships.",
        "pts": "Direct surgical-suite detailing|Operating-room consignment management|Hospital and ASC relations|Coverage across NCR, Luzon, Visayas, Mindanao",
    },
    {
        "n": "04",
        "cat": "Governance",
        "title": "Regulatory Compliance &amp; QA",
        "img": "assets/img/pillars/p6_quality_metrology.jpg",
        "sl": "Regulatory audits",
        "sv": "100% Pass",
        "desc": "Every product we distribute is registered, traceable and stored under audited conditions, with continuous temperature monitoring and post-market surveillance.",
        "pts": "Philippine FDA product registration|GDP / CDRR certification|Thermal mapping &amp; temperature monitoring|Pharmacovigilance &amp; recall readiness",
    },
    {
        "n": "05",
        "cat": "Professional Dev",
        "title": "Clinical &amp; Surgical Education",
        "img": "assets/img/pillars/p5_theatre_wetlab.jpg",
        "sl": "Surgeons trained",
        "sv": "500+ Fellows",
        "desc": "Hands-on dry and wet labs, phacoemulsification masterclasses and accredited workshops that raise surgical outcomes for residents and fellows alike.",
        "pts": "Dry &amp; wet lab courses|Phacoemulsification masterclasses|CME-accredited modules|Live and recorded video surgery",
    },
    {
        "n": "06",
        "cat": "Continuity",
        "title": "Comprehensive Post-Market Support",
        "img": "assets/img/pillars/p6_lot_traceability.jpg",
        "sl": "Service SLA",
        "sv": "24/7 Priority",
        "desc": "After the sale we stay close: equipment calibration, biometry assistance, surgical feedback loops and a technical hotline for ophthalmic teams.",
        "pts": "Equipment calibration &amp; in-service|IOL biometry assistance|Surgical feedback loops|24/7 technical hotline",
    },
]

cards_html = []
for p in pillars:
    cards_html.append(f'''            <button type="button" class="wwd-card group relative rounded-2xl bg-[#0a1835]/80 border border-sky/25 hover:border-sky/55 p-3 shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 flex flex-col justify-between min-h-[240px] lg:min-h-0 overflow-hidden text-left cursor-pointer"
              data-title="{p['title']}" data-cat="{p['cat']}" data-n="{p['n']}" data-img="{p['img']}" data-desc="{p['desc']}" data-pts="{p['pts']}" data-sl="{p['sl']}" data-sv="{p['sv']}">
              <span class="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-sky/60 to-transparent"></span>
              <span class="pointer-events-none absolute inset-x-8 bottom-0 h-px bg-gradient-to-r from-transparent via-sky/80 to-transparent shadow-[0_0_10px_rgba(58,160,219,0.7)]"></span>
              <div class="relative flex-1 min-h-0 w-full rounded-xl overflow-hidden mb-2 bg-[#07132b]">
                <img src="{p['img']}" alt="{p['title']}" class="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy">
                <div class="absolute inset-0 bg-gradient-to-t from-[#071530]/75 via-transparent to-transparent"></div>
                <span class="absolute top-2 left-2 text-[10px] font-mono font-bold text-white/90 bg-[#071530]/80 backdrop-blur px-2 py-0.5 rounded-md border border-sky/30">{p['n']}</span>
                <span class="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/55 backdrop-blur text-[10px] font-mono font-bold text-sky border border-sky/30 uppercase">{p['cat']}</span>
                <span class="absolute bottom-2 left-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#071530]/85 border border-sky/40 backdrop-blur text-[10px] font-semibold"><span class="text-white/85 uppercase">{p['sl']}</span><span class="text-white/50">&bull;</span><span class="text-[#72c5f8]">{p['sv']}</span></span>
              </div>
              <div class="pt-1 border-t border-white/10 flex items-center justify-between gap-2 shrink-0">
                <div class="min-w-0">
                  <div class="text-[10px] font-mono text-sky/90 uppercase tracking-wider truncate">{p['cat']}</div>
                  <h3 class="text-sm sm:text-base font-bold text-white group-hover:text-sky transition-colors leading-snug truncate">{p['title']}</h3>
                </div>
                <span class="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky/15 group-hover:bg-sky text-sky group-hover:text-[#0a1d40] border border-sky/30 text-xs font-bold transition-all"><span>Find out more</span><svg class="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m9 18 6-6-6-6"/></svg></span>
              </div>
            </button>''')

slide_html = f'''        <!-- ========================================================================= -->
        <!-- SLIDE 3: WHAT WE DO (Maximized Full-Viewport 3x2 Grid matching Supplies)  -->
        <!-- ========================================================================= -->
        <div id="about-slide-what-we-do" class="about-slide absolute top-0 left-0 right-0 w-full h-[calc(100svh-4.5rem)] flex flex-col bg-transparent text-cream px-4 sm:px-8 lg:px-12 pt-3.5 pb-4 overflow-y-auto lg:overflow-hidden transition-all duration-500 ease-out opacity-0 pointer-events-none translate-x-12 z-0" data-index="2">

          <div class="relative z-20 w-full max-w-[1680px] mx-auto h-full flex flex-col">

            <!-- Category Navigation Bar (Pill Buttons matching Medical Supplies layout) -->
            <div class="flex items-center justify-between gap-3 mb-2 shrink-0">
              <button type="button" onclick="if(window.goToAboutSlide){{window.goToAboutSlide(1);}}" class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-cream/90 hover:text-white transition-all cursor-pointer backdrop-blur-md">
                <svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m15 18-6-6 6-6"/></svg>
                <span>Who We Are</span>
              </button>
              <button type="button" onclick="if(window.goToAboutSlide){{window.goToAboutSlide(3);}}" class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-cream/90 hover:text-white transition-all cursor-pointer backdrop-blur-md group">
                <span>Our Foundation</span>
                <svg class="size-3.5 group-hover:translate-x-0.5 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m9 18 6-6-6-6"/></svg>
              </button>
            </div>

            <!-- Compact Header Row (Maximized Space matching Medical Supplies layout) -->
            <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-2.5 shrink-0">
              <div>
                <h2 class="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight leading-none">
                  What We Do &bull; <span class="text-sky">Core Capabilities &amp; Clinical Network</span>
                </h2>
                <p class="text-[11px] sm:text-xs text-cream/70 mt-1 max-w-2xl">
                  Clinical distribution, product marketing, regulatory compliance, and surgical partnerships across the Philippines.
                </p>
              </div>
              <div class="hidden sm:flex flex-wrap gap-2">
                <span class="px-2.5 py-0.5 rounded-full bg-sky/10 border border-sky/30 text-[9px] font-mono font-bold text-sky uppercase">6 CORE PILLARS</span>
                <span class="px-2.5 py-0.5 rounded-full bg-sky/10 border border-sky/30 text-[9px] font-mono font-bold text-sky uppercase">17 REGIONS COVERAGE</span>
              </div>
            </div>

            <!-- 3x2 Maximized Capability Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-[minmax(0,1fr)_minmax(0,1fr)] gap-3.5 flex-1 min-h-0">
{chr(10).join(cards_html)}
            </div>
          </div>

          <!-- Find-out-more detail card -->
          <div id="wwd-modal" class="absolute inset-0 z-50 items-center justify-center p-4 sm:p-8 bg-[#030b1c]/80 backdrop-blur-md opacity-0 transition-opacity duration-300" style="display:none" role="dialog" aria-modal="true" aria-labelledby="wwd-modal-title">
            <div class="relative w-full max-w-5xl max-h-full overflow-y-auto rounded-3xl border border-sky/35 bg-[#071530] shadow-[0_30px_80px_rgba(0,0,0,0.8)] grid grid-cols-1 md:grid-cols-2">
              <button type="button" id="wwd-modal-close" aria-label="Close" class="absolute top-3 right-3 z-10 size-9 rounded-full bg-black/60 border border-white/15 hover:border-sky text-white flex items-center justify-center cursor-pointer">
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
                  <a href="#contact" id="wwd-modal-cta" class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-cream/90 hover:text-white transition-all cursor-pointer backdrop-blur-md"><span>Contact us</span><svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m9 18 6-6-6-6"/></svg></a>
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
    txt = fp.read_text(encoding="utf-8")
    m = pattern.search(txt)
    if not m:
        raise RuntimeError(f"Could not find Slide 3 block in {fp}")
    new_txt = txt[:m.start()] + slide_html + "\n\n        <!-- ========================================================================= -->\n        <!-- SLIDE 4: OUR ESTABLISHED FOUNDATION" + txt[m.end():]
    fp.write_text(new_txt, encoding="utf-8")
    print(f"Updated {fp}")

