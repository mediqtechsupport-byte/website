import re
from pathlib import Path

pillars = [
    {
        "idx": 0,
        "n": "01",
        "cat": "Supply Chain",
        "title": "Strategic Importation &amp; Distribution",
        "img": "assets/img/pillars/p1_cleanroom_inspect.jpg",
        "sl": "Cold-chain dispatch",
        "sv": "24–48 hours",
        "stat_num": "24–48",
        "stat_unit": " hours",
        "p1": "24",
        "p2": "48",
        "sep": "–",
        "suffix": "",
        "visual": "cold-chain",
        "hud_l": "GDP COLD-CHAIN TELEMETRY • 2.0–8.0 °C BAND",
        "hud_r": "LIVE CORE TEMP: 4.6 °C STABLE",
        "desc": "Direct manufacturer sourcing from Rayner UK and global partners with customs clearance, validated 2–8 °C cold-chain dispatch, and cleanroom buffer reserves.",
        "pts": "Direct manufacturer sourcing &amp; importation|Cleanroom-grade sterile IOL &amp; OVD reserves|GDP-compliant 2–8 °C cold-chain logistics|Port-of-entry to operating-room tracking",
    },
    {
        "idx": 1,
        "n": "02",
        "cat": "Commercial",
        "title": "Product Marketing &amp; Brand Development",
        "img": "assets/img/pillars/p2_headquarters_brand.jpg",
        "sl": "Academic symposia",
        "sv": "25+ per year",
        "stat_num": "25+",
        "stat_unit": " per year",
        "p1": "25",
        "p2": "",
        "sep": "",
        "suffix": "+",
        "visual": "symposia-bars",
        "hud_l": "ANNUAL SCIENTIFIC SYMPOSIA &amp; CONGRESSES",
        "hud_r": "PAO &amp; REGIONAL FORUMS: 25+ / YR",
        "desc": "Clinical-first brand programs connecting global ophthalmic innovators with Philippine surgeons through scientific congresses, roundtables, and peer education.",
        "pts": "Evidence-based clinical positioning &amp; strategy|Surgeon scientific symposia &amp; advisory boards|PAO annual congress &amp; society exhibitions|National launch campaigns for new IOL platforms",
    },
    {
        "idx": 2,
        "n": "03",
        "cat": "Field Network",
        "title": "Nationwide Clinical &amp; Sales Coverage",
        "img": "assets/img/pillars/p3_specialist_discussion.jpg",
        "sl": "Archipelago reach",
        "sv": "17 regions",
        "stat_num": "17",
        "stat_unit": " regions",
        "p1": "17",
        "p2": "",
        "sep": "",
        "suffix": "",
        "visual": "archipelago-routes",
        "hud_l": "PHILIPPINE ARCHIPELAGO CLINICAL NETWORK",
        "hud_r": "LUZON • VISAYAS • MINDANAO (17 REGIONS)",
        "desc": "Embedded clinical specialists working alongside surgical teams across Luzon, Visayas, and Mindanao to manage operating-room consignment and case support.",
        "pts": "Direct operating-room &amp; surgical-suite detailing|Hospital &amp; ASC consignment inventory management|Regional hubs in Metro Manila, Cebu &amp; Davao|Full clinical coverage across all 17 PH regions",
    },
    {
        "idx": 3,
        "n": "04",
        "cat": "Governance",
        "title": "Regulatory Compliance &amp; QA",
        "img": "assets/img/pillars/p6_quality_metrology.jpg",
        "sl": "Regulatory audits",
        "sv": "100% pass",
        "stat_num": "100%",
        "stat_unit": " pass",
        "p1": "100",
        "p2": "",
        "sep": "",
        "suffix": "%",
        "visual": "governance-ring",
        "hud_l": "FDA CDRR &amp; GDP AUDIT VERIFICATION",
        "hud_r": "LOT TRACEABILITY &amp; QA: 100% PASS",
        "desc": "Every distributed device is Philippine FDA-registered, lot-traceable, and stored under audited Good Distribution Practice conditions with continuous surveillance.",
        "pts": "Philippine FDA CDRR product registration|GDP &amp; ISO quality management certification|24/7 automated thermal mapping &amp; monitoring|Post-market surveillance &amp; recall readiness",
    },
    {
        "idx": 4,
        "n": "05",
        "cat": "Professional Dev",
        "title": "Clinical &amp; Surgical Education",
        "img": "assets/img/pillars/p5_theatre_wetlab.jpg",
        "sl": "Surgeons trained",
        "sv": "500+ fellows",
        "stat_num": "500+",
        "stat_unit": " fellows",
        "p1": "500",
        "p2": "",
        "sep": "",
        "suffix": "+",
        "visual": "education-matrix",
        "hud_l": "FELLOWSHIP &amp; WET-LAB COHORT MATRIX (1 DOT = 10 FELLOWS)",
        "hud_r": "ACCREDITED SURGEONS: 500+ FELLOWS",
        "desc": "Hands-on microsurgical dry and wet labs, phacoemulsification masterclasses, and biometry workshops that elevate visual outcomes for residents and fellows.",
        "pts": "Hands-on dry &amp; wet lab microsurgical courses|Phacoemulsification &amp; toric alignment masterclasses|CME-accredited ophthalmic training modules|Live &amp; recorded surgical video mentorship",
    },
    {
        "idx": 5,
        "n": "06",
        "cat": "Continuity",
        "title": "Comprehensive Post-Market Support",
        "img": "assets/img/pillars/p6_lot_traceability.jpg",
        "sl": "Service SLA",
        "sv": "24/7 priority",
        "stat_num": "24/7",
        "stat_unit": " priority",
        "p1": "24",
        "p2": "7",
        "sep": "/",
        "suffix": "",
        "visual": "continuity-dial",
        "hud_l": "CONTINUOUS 24-HOUR CLINICAL SLA CHRONOGRAPH",
        "hud_r": "HOTLINE &amp; BIOMETRY SLA: 24/7 ACTIVE",
        "desc": "Long-term post-implantation partnership featuring equipment calibration, custom optical biometry assistance, surgical feedback loops, and a 24/7 technical hotline.",
        "pts": "Preventive equipment calibration &amp; in-service|Custom A-constant &amp; IOL biometry assistance|RayPRO real-time surgical outcome feedback loops|24/7 priority technical hotline for OR teams",
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
                  data-stat-unit="{p['stat_unit']}"
                  data-stat-p1="{p['p1']}"
                  data-stat-p2="{p['p2']}"
                  data-stat-sep="{p['sep']}"
                  data-stat-suffix="{p['suffix']}"
                  data-visual="{p['visual']}"
                  data-hud-l="{p['hud_l']}"
                  data-hud-r="{p['hud_r']}"
                  data-desc="{p['desc']}"
                  data-pts="{p['pts']}"
                  class="wwd-selector-tab {active_cls} group relative flex flex-col justify-between rounded-xl px-3.5 py-2.5 text-left cursor-pointer shrink-0 w-[255px] sm:w-[275px] lg:w-full lg:flex-1 overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#72c5f8]">
                  <div class="flex items-center justify-between gap-2 w-full">
                    <div class="flex items-center gap-2 min-w-0">
                      <span class="wwd-tab-num font-mono text-[10px] font-bold px-1.5 py-0.5 rounded border border-sky/30 bg-[#06132c]/80 text-[#72c5f8]">{p['n']}</span>
                      <span class="font-mono text-[10px] font-bold uppercase tracking-wider text-sky/90 truncate">{p['cat']}</span>
                    </div>
                    <span class="shrink-0 font-mono text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#051026]/80 border border-sky/25 text-cream/85">
                      <span class="text-cream/60 hidden xl:inline">{p['sl']} &bull; </span><strong class="text-[#72c5f8]">{p['sv']}</strong>
                    </span>
                  </div>
                  <div class="flex items-center justify-between gap-2 mt-1 w-full">
                    <h3 class="text-xs sm:text-[13px] font-bold text-white leading-snug truncate">{p['title']}</h3>
                    <span class="wwd-tab-arrow shrink-0 text-sky/70 text-[11px] font-mono">&rarr;</span>
                  </div>
                  <span class="pointer-events-none absolute bottom-0 left-0 right-0 h-[2px] bg-white/5 overflow-hidden">
                    <span class="wwd-tab-progress block h-full w-full origin-left scale-x-0 bg-gradient-to-r from-[#3aa0db] to-[#72c5f8]"></span>
                  </span>
                </button>''')

p0 = pillars[0]
p0_pts_html = "\n".join(
    f'''                      <li class="flex items-start gap-2 rounded-lg bg-white/[0.025] border border-white/[0.06] px-2.5 py-1.5 text-[11px] sm:text-xs text-cream/90">
                        <span class="mt-1 size-1.5 rounded-full bg-sky shrink-0"></span>
                        <span>{pt}</span>
                      </li>'''
    for pt in p0["pts"].split("|")
)

slide_html = f'''        <!-- ========================================================================= -->
        <!-- SLIDE 3: WHAT WE DO (Featured Stage + 6-Pillar Selector Architecture)      -->
        <!-- ========================================================================= -->
        <div id="about-slide-what-we-do" class="about-slide absolute top-0 left-0 right-0 w-full h-[calc(100svh-4.5rem)] flex flex-col bg-transparent text-cream px-4 sm:px-8 lg:px-12 pt-3 pb-3.5 overflow-y-auto lg:overflow-hidden transition-all duration-500 ease-out opacity-0 pointer-events-none translate-x-12 z-0" data-index="2">

          <style id="wwd-stage-scoped-styles">
            #about-slide-what-we-do .wwd-glass-panel {{
              background: linear-gradient(165deg, rgba(10, 28, 62, 0.82) 0%, rgba(6, 17, 38, 0.90) 100%);
              backdrop-filter: blur(18px);
              -webkit-backdrop-filter: blur(18px);
              border: 1px solid rgba(114, 197, 248, 0.22);
              box-shadow: 0 24px 60px rgba(2, 8, 24, 0.72), inset 0 1px 0 rgba(255, 255, 255, 0.08);
            }}
            #about-slide-what-we-do .wwd-selector-tab {{
              background: rgba(7, 21, 48, 0.62);
              backdrop-filter: blur(12px);
              -webkit-backdrop-filter: blur(12px);
              border: 1px solid rgba(114, 197, 248, 0.14);
              transition: background-color 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease;
            }}
            #about-slide-what-we-do .wwd-selector-tab.is-active {{
              background: linear-gradient(90deg, rgba(16, 45, 96, 0.92) 0%, rgba(10, 29, 64, 0.88) 100%);
              border-color: rgba(114, 197, 248, 0.65);
              box-shadow: 0 10px 28px rgba(3, 12, 32, 0.55), inset 0 1px 0 rgba(114, 197, 248, 0.28);
            }}
            #about-slide-what-we-do .wwd-selector-tab.is-active .wwd-tab-num {{
              background: #3aa0db;
              color: #061229;
              border-color: #72c5f8;
            }}
            #about-slide-what-we-do .wwd-selector-tab.is-active .wwd-tab-arrow {{
              color: #72c5f8;
              transform: translateX(2px);
            }}
            @keyframes wwdStageCrossfade {{
              0% {{ opacity: 0.35; transform: translateY(4px); }}
              100% {{ opacity: 1; transform: translateY(0); }}
            }}
            #about-slide-what-we-do .wwd-stage-Swap {{
              animation: wwdStageCrossfade 260ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
            }}
            @media (prefers-reduced-motion: reduce) {{
              #about-slide-what-we-do .wwd-stage-Swap {{
                animation: none !important;
              }}
            }}
          </style>

          <div class="relative z-20 w-full max-w-[1680px] mx-auto h-full flex flex-col">

            <!-- Top Navigation Controls (Who We Are <- -> Our Foundation) -->
            <div id="wwd-nav-row" class="flex items-center justify-between gap-3 mb-1.5 shrink-0">
              <button type="button" onclick="if(window.goToAboutSlide){{window.goToAboutSlide(1);}}" class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-cream/90 hover:text-white transition-colors cursor-pointer backdrop-blur-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#72c5f8]">
                <svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m15 18-6-6 6-6"/></svg>
                <span>Who We Are</span>
              </button>
              <button type="button" onclick="if(window.goToAboutSlide){{window.goToAboutSlide(3);}}" class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-cream/90 hover:text-white transition-colors cursor-pointer backdrop-blur-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#72c5f8]">
                <span>Our Foundation</span>
                <svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m9 18 6-6-6-6"/></svg>
              </button>
            </div>

            <!-- Header & Badges -->
            <div id="wwd-header-row" class="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-2.5 shrink-0">
              <div>
                <h2 id="wwd-headline" class="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight leading-none">
                  What We Do &bull; <span class="text-sky">Core Capabilities &amp; Clinical Network</span>
                </h2>
                <p id="wwd-subtext" class="text-[11px] sm:text-xs text-cream/75 mt-1 max-w-2xl">
                  Clinical distribution, product marketing, regulatory compliance, and surgical partnerships across the Philippines.
                </p>
              </div>
              <div id="wwd-badges" class="flex flex-wrap items-center gap-2 shrink-0">
                <span class="px-2.5 py-1 rounded-full bg-sky/10 border border-sky/30 text-[10px] font-mono font-bold text-[#72c5f8] uppercase tracking-wider">6 Core Pillars</span>
                <span class="px-2.5 py-1 rounded-full bg-sky/10 border border-sky/30 text-[10px] font-mono font-bold text-[#72c5f8] uppercase tracking-wider">17 Regions Coverage</span>
              </div>
            </div>

            <!-- Interactive Two-Column Layout: 6-Pillar Selector (Left) + Featured Stage (Right) -->
            <div id="wwd-interactive-root" class="grid grid-cols-1 lg:grid-cols-12 gap-3.5 lg:gap-5 flex-1 min-h-0">

              <!-- Left Column: Compact 6-Pillar Selector List + Auto-Advance Bar -->
              <div id="wwd-selector-col" class="lg:col-span-5 flex flex-col justify-between gap-2 min-h-0">
                <div id="wwd-tablist"
                  role="tablist"
                  aria-label="Six Core Capability Pillars"
                  class="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-1 lg:pb-0 flex-1 min-h-0">
{chr(10).join(tabs_html)}
                </div>

                <!-- Auto-Advance Progress & Cycle Status Indicator -->
                <div id="wwd-cycle-bar" class="flex items-center justify-between gap-3 rounded-xl border border-sky/20 bg-[#061229]/80 px-3.5 py-2 backdrop-blur-md shrink-0">
                  <div class="flex items-center gap-2">
                    <span id="wwd-cycle-dot" class="size-2 rounded-full bg-sky shadow-[0_0_8px_#3aa0db]" aria-hidden="true"></span>
                    <span id="wwd-cycle-status" class="font-mono text-[10px] font-bold uppercase tracking-widest text-cream/75">Auto-Advance &bull; 7s</span>
                  </div>
                  <div class="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden max-w-[180px]" aria-hidden="true">
                    <span id="wwd-master-progress" class="block h-full w-full origin-left scale-x-0 bg-gradient-to-r from-[#3aa0db] to-[#72c5f8]"></span>
                  </div>
                  <span id="wwd-cycle-counter" class="font-mono text-[11px] font-bold text-[#72c5f8] tabular-nums">01 / 06</span>
                </div>
              </div>

              <!-- Right Column: Featured Stage Panel -->
              <div id="wwd-stage-panel"
                role="tabpanel"
                aria-labelledby="wwd-tab-0"
                aria-live="polite"
                class="lg:col-span-7 min-h-0 flex flex-col">

                <div id="wwd-stage-card" class="wwd-glass-panel relative flex-1 min-h-0 rounded-2xl p-4 sm:p-5 lg:p-6 flex flex-col justify-between overflow-hidden">
                  <span class="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-[#72c5f8]/60 to-transparent"></span>

                  <!-- Stage Top Header: Active Pillar Tag + Title & Large Animated Stat Counter -->
                  <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-white/10 shrink-0">
                    <div class="min-w-0">
                      <div class="flex items-center gap-2">
                        <span id="wwd-stage-badge" class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky/15 border border-sky/35 font-mono text-[10px] font-bold uppercase tracking-widest text-[#72c5f8]">
                          Pillar 01 &bull; Supply Chain
                        </span>
                      </div>
                      <h3 id="wwd-stage-title" class="text-lg sm:text-xl lg:text-2xl font-extrabold text-white tracking-tight mt-1.5 leading-snug">
                        {p0['title']}
                      </h3>
                    </div>

                    <!-- Large Animated Display Stat Counter -->
                    <div class="sm:text-right shrink-0 flex sm:flex-col items-baseline sm:items-end justify-between gap-2 bg-[#051026]/75 border border-sky/25 rounded-xl px-3.5 py-2">
                      <span id="wwd-stage-stat-label" class="font-mono text-[10px] font-bold uppercase tracking-widest text-sky/90 block">
                        {p0['sl']}
                      </span>
                      <div class="flex items-baseline gap-1 mt-0.5">
                        <span id="wwd-stage-stat-num" class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight tabular-nums leading-none">
                          {p0['stat_num']}
                        </span>
                        <span id="wwd-stage-stat-unit" class="text-xs sm:text-sm font-bold text-[#72c5f8] font-mono">
                          {p0['stat_unit']}
                        </span>
                      </div>
                    </div>
                  </div>

                  <!-- Bespoke 60fps Interactive Stage Visual Canvas -->
                  <div id="wwd-stage-visual-wrap" class="relative flex-1 min-h-[185px] sm:min-h-[210px] lg:min-h-0 my-3 rounded-xl border border-sky/25 bg-[#040d21]/95 overflow-hidden flex flex-col justify-between">
                    <!-- Subtle Three.js / WebGL Ambient Depth Layer -->
                    <canvas id="wwd-stage-webgl" class="absolute inset-0 w-full h-full pointer-events-none opacity-40" aria-hidden="true"></canvas>
                    <!-- Primary 60fps Bespoke Pillar Telemetry Canvas -->
                    <canvas id="wwd-stage-canvas" class="absolute inset-0 w-full h-full block" aria-label="Interactive capability telemetry visualization"></canvas>

                    <!-- Top HUD Overlay -->
                    <div class="relative z-10 flex items-center justify-between gap-2 px-3.5 pt-2.5 pointer-events-none">
                      <span id="wwd-stage-hud-l" class="font-mono text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-[#72c5f8]/90 bg-[#06132c]/80 border border-sky/25 px-2.5 py-0.5 rounded-md backdrop-blur-sm">
                        {p0['hud_l']}
                      </span>
                      <span id="wwd-stage-hud-r" class="font-mono text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-white/90 bg-[#06132c]/80 border border-sky/25 px-2.5 py-0.5 rounded-md backdrop-blur-sm">
                        {p0['hud_r']}
                      </span>
                    </div>

                    <!-- Bottom-right subtle reference thumbnail pill -->
                    <div class="relative z-10 flex items-center justify-end px-3.5 pb-2.5 pointer-events-none">
                      <div class="inline-flex items-center gap-2 rounded-lg bg-[#06132c]/85 border border-sky/25 p-1 pr-2.5 backdrop-blur-md">
                        <img id="wwd-stage-thumb" src="{p0['img']}" alt="" class="size-6 rounded object-cover border border-sky/30" loading="lazy">
                        <span class="font-mono text-[9px] font-semibold uppercase tracking-wider text-cream/80">Clinical Reference Verified</span>
                      </div>
                    </div>
                  </div>

                  <!-- Stage Footer: Tightened Copy, 4 Key Points & "Find out more" Modal Trigger -->
                  <div class="shrink-0 flex flex-col gap-2.5 pt-1">
                    <p id="wwd-stage-desc" class="text-xs sm:text-[13px] text-cream/85 leading-relaxed">
                      {p0['desc']}
                    </p>

                    <ul id="wwd-stage-pts" class="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
{p0_pts_html}
                    </ul>

                    <div class="pt-2 border-t border-white/10 flex items-center justify-between gap-3">
                      <div class="flex items-center gap-2 text-[11px] font-mono text-cream/65">
                        <span class="size-1.5 rounded-full bg-sky"></span>
                        <span>Philippine Nationwide Clinical Partner Standard</span>
                      </div>

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
                        class="wwd-card inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky/20 hover:bg-sky text-white hover:text-[#061229] border border-sky/45 text-xs font-bold transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#72c5f8]">
                        <span>Find out more</span>
                        <svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m9 18 6-6-6-6"/></svg>
                      </button>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>

          <!-- Find-out-more detail card modal -->
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

