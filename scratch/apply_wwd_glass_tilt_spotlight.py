import re

new_wwd_html = """        <!-- ========================================================================= -->
        <!-- SLIDE 3: WHAT WE DO (Frosted glass cards, cursor spotlight & 3° tilt)    -->
        <!-- ========================================================================= -->
        <div id="about-slide-what-we-do" class="about-slide absolute top-0 left-0 right-0 w-full h-[calc(100svh-4.5rem)] flex flex-col text-cream px-4 sm:px-8 lg:px-14 pt-[112px] pb-4 lg:pb-6 overflow-y-auto lg:overflow-hidden transition-all duration-500 ease-out opacity-0 pointer-events-none translate-x-12 z-0" data-index="2">

          <style id="wwd-stage-scoped-styles">
            #about-slide-what-we-do {
              background-color: transparent;
              background-image: radial-gradient(rgba(114, 197, 248, 0.13) 1px, transparent 1.2px);
              background-size: 22px 22px;
            }

            /* Word-by-word blur-fade headline reveal + cyan sweep on "core capabilities" */
            #about-slide-what-we-do .wwd-word {
              display: inline-block;
              opacity: 0;
              filter: blur(8px);
              transform: translateY(9px);
              transition: opacity .52s cubic-bezier(.22,1,.36,1), filter .52s cubic-bezier(.22,1,.36,1), transform .52s cubic-bezier(.22,1,.36,1);
              transition-delay: var(--w-delay, 0ms);
            }
            #about-slide-what-we-do.wwd-entered .wwd-word {
              opacity: 1;
              filter: blur(0);
              transform: translateY(0);
            }
            @keyframes wwdCyanSweep {
              0%, 15% { background-position: 130% 50%; }
              55%, 100% { background-position: -30% 50%; }
            }
            #about-slide-what-we-do .wwd-core-sweep {
              background-image: linear-gradient(110deg, #4fc3f7 0%, #4fc3f7 38%, #e0f7ff 50%, #4fc3f7 62%, #4fc3f7 100%);
              background-size: 240% 100%;
              -webkit-background-clip: text;
              background-clip: text;
              color: transparent;
              animation: wwdCyanSweep 5.5s ease-in-out infinite;
            }

            /* Sequential cyan underline under the 4 key subtitle phrases */
            @keyframes wwdPhrasePulse {
              0%, 5% { transform: scaleX(0); transform-origin: left; opacity: 0.3; }
              14%, 26% { transform: scaleX(1); transform-origin: left; opacity: 1; }
              34%, 100% { transform: scaleX(0); transform-origin: right; opacity: 0; }
            }
            #about-slide-what-we-do .wwd-phrase {
              position: relative;
              display: inline-block;
              color: rgba(255, 255, 255, 0.96);
              font-weight: 500;
            }
            #about-slide-what-we-do .wwd-phrase::after {
              content: "";
              position: absolute;
              left: 0;
              right: 0;
              bottom: -2px;
              height: 1.5px;
              border-radius: 999px;
              background: linear-gradient(90deg, #4fc3f7, rgba(79, 195, 247, 0.35));
              transform: scaleX(0);
              transform-origin: left;
              animation: wwdPhrasePulse 6.4s cubic-bezier(.22,1,.36,1) infinite;
              animation-delay: var(--p-delay, 0s);
            }

            /* Header divider drawing across from cyan to transparent */
            #about-slide-what-we-do .wwd-header-divider {
              height: 1px;
              background: linear-gradient(90deg, rgba(79, 195, 247, 0.62) 0%, rgba(79, 195, 247, 0.18) 55%, rgba(244, 166, 75, 0.15) 82%, transparent 100%);
              transform: scaleX(0);
              transform-origin: left;
              transition: transform .85s cubic-bezier(.22,1,.36,1) .18s;
            }
            #about-slide-what-we-do.wwd-entered .wwd-header-divider {
              transform: scaleX(1);
            }

            /* Left lighter frosted-glass list card */
            #about-slide-what-we-do .wwd-glass-list-card {
              --mx: 50%;
              --my: 50%;
              --spot-o: 0;
              position: relative;
              border-radius: 20px;
              background: linear-gradient(160deg, rgba(10, 28, 62, 0.42) 0%, rgba(5, 16, 38, 0.32) 100%);
              backdrop-filter: blur(14px);
              -webkit-backdrop-filter: blur(14px);
              border: 1px solid rgba(114, 197, 248, 0.16);
              box-shadow: 0 18px 44px rgba(2, 8, 22, 0.42), inset 0 1px 0 rgba(255, 255, 255, 0.08);
            }
            #about-slide-what-we-do .wwd-glass-list-card::before {
              content: "";
              position: absolute;
              inset: 0;
              border-radius: inherit;
              pointer-events: none;
              opacity: var(--spot-o, 0);
              transition: opacity .25s ease;
              background: radial-gradient(320px circle at var(--mx) var(--my), rgba(79, 195, 247, 0.10), transparent 70%);
            }

            /* Main frosted-glass stage card: cyan-to-amber edge + cursor spotlight + cursor border glow + slow float + 3° tilt */
            @keyframes wwdFloatBob {
              0%, 100% { translate: 0 0; }
              50% { translate: 0 -5px; }
            }
            #about-slide-what-we-do .wwd-glass-main-card {
              --mx: 50%;
              --my: 50%;
              --spot-o: 0;
              --rx: 0deg;
              --ry: 0deg;
              position: relative;
              border-radius: 24px;
              background: linear-gradient(155deg, rgba(9, 26, 58, 0.56) 0%, rgba(5, 15, 36, 0.46) 100%);
              backdrop-filter: blur(18px);
              -webkit-backdrop-filter: blur(18px);
              box-shadow: 0 26px 68px rgba(2, 8, 22, 0.62), inset 0 1px 0 rgba(255, 255, 255, 0.10);
              transform: perspective(1400px) rotateX(var(--rx)) rotateY(var(--ry));
              transition: transform .18s cubic-bezier(.22,1,.36,1), box-shadow .3s ease;
              will-change: transform;
            }
            @media (min-width: 1024px) {
              #about-slide-what-we-do .wwd-glass-main-card {
                animation: wwdFloatBob 7.2s ease-in-out infinite;
              }
            }
            /* Base thin cyan-to-amber glowing edge */
            #about-slide-what-we-do .wwd-glass-main-card::before {
              content: "";
              position: absolute;
              inset: 0;
              border-radius: inherit;
              padding: 1px;
              pointer-events: none;
              background: linear-gradient(135deg, rgba(79, 195, 247, 0.52) 0%, rgba(79, 195, 247, 0.14) 52%, rgba(244, 166, 75, 0.44) 100%);
              -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
              -webkit-mask-composite: xor;
              mask-composite: exclude;
            }
            /* Cursor-tracking border highlight layered on top of the cyan-to-amber edge */
            #about-slide-what-we-do .wwd-card-border-glow {
              position: absolute;
              inset: 0;
              border-radius: inherit;
              padding: 1.25px;
              pointer-events: none;
              opacity: var(--spot-o, 0);
              transition: opacity .25s ease;
              background: radial-gradient(300px circle at var(--mx) var(--my), rgba(79, 195, 247, 0.95), rgba(244, 166, 75, 0.55) 45%, transparent 72%);
              -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
              -webkit-mask-composite: xor;
              mask-composite: exclude;
            }
            /* Cursor-tracking interior cyan spotlight + subtle glare */
            #about-slide-what-we-do .wwd-card-spotlight {
              position: absolute;
              inset: 0;
              border-radius: inherit;
              pointer-events: none;
              opacity: var(--spot-o, 0);
              transition: opacity .25s ease;
              background: radial-gradient(520px circle at var(--mx) var(--my), rgba(79, 195, 247, 0.13), rgba(58, 160, 219, 0.04) 42%, transparent 68%);
            }

            /* Selector list rail + sliding marker */
            #about-slide-what-we-do .wwd-list-rail { background: rgba(255, 255, 255, 0.10); }
            #about-slide-what-we-do #wwd-sliding-marker {
              background: #4fc3f7;
              box-shadow: 0 0 14px rgba(79, 195, 247, 0.85);
              transition: top .32s cubic-bezier(.22,1,.36,1), height .32s cubic-bezier(.22,1,.36,1);
            }
            #about-slide-what-we-do .wwd-selector-tab {
              padding-left: 1.35rem;
              transition: padding-left .28s cubic-bezier(.22,1,.36,1);
            }
            #about-slide-what-we-do .wwd-selector-tab .wwd-tab-cat {
              color: rgba(114, 197, 248, 0.62);
              letter-spacing: 0.08em;
              text-transform: uppercase;
              transition: color .2s ease;
            }
            #about-slide-what-we-do .wwd-selector-tab .wwd-tab-title {
              color: rgba(196, 208, 226, 0.58);
              transition: color .2s ease;
            }
            #about-slide-what-we-do .wwd-selector-tab:hover:not(.is-active) .wwd-tab-title {
              color: rgba(235, 242, 252, 0.88);
            }
            #about-slide-what-we-do .wwd-selector-tab.is-active {
              padding-left: 1.75rem;
            }
            #about-slide-what-we-do .wwd-selector-tab.is-active .wwd-tab-cat {
              color: #4fc3f7;
            }
            #about-slide-what-we-do .wwd-selector-tab.is-active .wwd-tab-title {
              color: #ffffff;
            }

            #about-slide-what-we-do .wwd-link-underline { transition: width .25s cubic-bezier(.22,1,.36,1); }
            #about-slide-what-we-do .wwd-link:hover .wwd-link-underline { width: 100%; }
            @keyframes wwdSwap { from { opacity: .35; transform: translateY(4px); } to { opacity: 1; transform: none; } }
            #about-slide-what-we-do .wwd-stage-swap { animation: wwdSwap 260ms cubic-bezier(.22,1,.36,1) both; }

            @media (prefers-reduced-motion: reduce) {
              #about-slide-what-we-do .wwd-word { opacity: 1 !important; filter: none !important; transform: none !important; transition: none !important; }
              #about-slide-what-we-do .wwd-core-sweep { animation: none !important; color: #4fc3f7 !important; background: none !important; }
              #about-slide-what-we-do .wwd-phrase::after { animation: none !important; transform: scaleX(1) !important; opacity: 0.55 !important; }
              #about-slide-what-we-do .wwd-header-divider { transform: scaleX(1) !important; transition: none !important; }
              #about-slide-what-we-do .wwd-glass-main-card { animation: none !important; transform: none !important; transition: none !important; }
              #about-slide-what-we-do .wwd-card-spotlight,
              #about-slide-what-we-do .wwd-card-border-glow,
              #about-slide-what-we-do .wwd-glass-list-card::before { display: none !important; }
              #about-slide-what-we-do .wwd-stage-swap { animation: none !important; }
              #about-slide-what-we-do .wwd-selector-tab,
              #about-slide-what-we-do #wwd-sliding-marker { transition: none !important; }
            }
          </style>

          <!-- Pill navigation: identical position & style to the other About slides -->
          <div class="absolute top-[76px] left-0 right-0 z-30 px-6 sm:px-10 lg:px-16 flex items-center justify-between gap-3 pointer-events-none">
            <button type="button" onclick="if(window.goToAboutSlide){window.goToAboutSlide(1);}" class="pointer-events-auto inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-cream/90 hover:text-white transition-all cursor-pointer backdrop-blur-md"><svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m15 18-6-6 6-6"/></svg><span>Who We Are</span></button>
            <button type="button" onclick="if(window.goToAboutSlide){window.goToAboutSlide(3);}" class="pointer-events-auto inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-cream/90 hover:text-white transition-all cursor-pointer backdrop-blur-md"><span>Our Foundation</span><svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m9 18 6-6-6-6"/></svg></button>
          </div>

          <div class="relative z-20 w-full h-full flex flex-col">

            <!-- Header: word-by-word title + highlighted subtitle phrases + right count-up badges + cyan divider -->
            <div class="shrink-0 mb-3 lg:mb-4">
              <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-3 lg:gap-8">
                <div class="min-w-0">
                  <h2 id="wwd-headline" class="text-[26px] sm:text-[36px] lg:text-[42px] 2xl:text-[50px] font-semibold tracking-[-0.025em] leading-[1.06] text-white">
                    <span class="wwd-word" style="--w-delay:0ms">What</span>
                    <span class="wwd-word" style="--w-delay:55ms">we</span>
                    <span class="wwd-word" style="--w-delay:110ms">do:</span>
                    <span class="wwd-word wwd-core-sweep" style="--w-delay:175ms">core</span>
                    <span class="wwd-word wwd-core-sweep" style="--w-delay:240ms">capabilities</span>
                    <span class="wwd-word" style="--w-delay:305ms">and</span>
                    <span class="wwd-word" style="--w-delay:370ms">clinical</span>
                    <span class="wwd-word" style="--w-delay:435ms">network</span>
                  </h2>
                  <p id="wwd-subtext" class="mt-1.5 text-[12.5px] sm:text-[14px] text-[#9eb2ce] leading-relaxed max-w-[820px]">
                    <span class="wwd-phrase" style="--p-delay:0s">Clinical distribution</span>,
                    <span class="wwd-phrase" style="--p-delay:1.6s">product marketing</span>,
                    <span class="wwd-phrase" style="--p-delay:3.2s">regulatory compliance</span>, and
                    <span class="wwd-phrase" style="--p-delay:4.8s">surgical partnerships</span> across the Philippines.
                  </p>
                </div>

                <!-- Right-side count-up badges: "6 core pillars" and "17 regions" -->
                <div id="wwd-header-badges" class="shrink-0 flex items-center gap-3 self-start lg:self-end">
                  <div class="inline-flex items-baseline gap-2 rounded-full border border-[#4fc3f7]/25 bg-[#081d42]/55 px-3.5 py-1.5 backdrop-blur-md">
                    <span id="wwd-badge-pillars" class="text-[16px] sm:text-[18px] font-extrabold text-[#4fc3f7] tabular-nums">6</span>
                    <span class="text-[11.5px] sm:text-[12px] font-medium text-[#c5d5eb]">core pillars</span>
                  </div>
                  <div class="inline-flex items-baseline gap-2 rounded-full border border-[#4fc3f7]/25 bg-[#081d42]/55 px-3.5 py-1.5 backdrop-blur-md">
                    <span id="wwd-badge-regions" class="text-[16px] sm:text-[18px] font-extrabold text-[#4fc3f7] tabular-nums">17</span>
                    <span class="text-[11.5px] sm:text-[12px] font-medium text-[#c5d5eb]">regions</span>
                  </div>
                </div>
              </div>

              <!-- Thin cyan-to-transparent divider line -->
              <div class="wwd-header-divider mt-3 lg:mt-3.5 w-full" aria-hidden="true"></div>
            </div>

            <!-- Two columns: Left List Card + Right Main Frosted-Glass Tilt Card -->
            <div id="wwd-interactive-root" class="grid grid-cols-1 lg:grid-cols-[minmax(0,3.8fr)_minmax(0,8.2fr)] gap-4 lg:gap-7 flex-1 min-h-0">

              <!-- Left List Card: lighter frosted-glass card housing the 6 capabilities + sliding rail marker -->
              <div id="wwd-list-card" class="wwd-glass-list-card p-3 sm:p-4 lg:py-4 lg:px-5 flex flex-col min-h-0">
                <div id="wwd-tablist" role="tablist" aria-label="Core capabilities" class="relative flex lg:flex-col gap-2 lg:gap-0.5 overflow-x-auto lg:overflow-visible pb-1 lg:pb-0 min-h-0 lg:h-full">
                  <span class="wwd-list-rail hidden lg:block absolute left-0 top-1 bottom-1 w-px" aria-hidden="true"></span>
                  <span id="wwd-sliding-marker" class="hidden lg:block absolute left-0 top-1 w-[3px] h-10 rounded-full" aria-hidden="true"></span>

                  <button type="button" id="wwd-tab-0" role="tab" aria-selected="true" aria-controls="wwd-stage-panel" tabindex="0"
                    data-n="01" data-cat="Supply chain" data-title="Strategic importation and distribution" data-img="assets/img/pillars/p1_cleanroom_inspect.jpg" data-sl="Cold-chain dispatch" data-sv="24–48 hours"
                    data-stat-num="24–48" data-stat-meta="hours · cold-chain dispatch" data-stat-p1="24" data-stat-p2="48" data-stat-sep="–" data-stat-suffix=""
                    data-visual="cold-chain" data-short-desc="Temperature-controlled products leave our warehouse within two days of an order." data-desc="We source Rayner and partner products directly from the manufacturer, coordinate customs clearance, and keep cleanroom-grade inventory ready so surgeons never wait on a lens." data-pts="Product sourcing &amp; importation coordination|Cleanroom inventory reserves|GDP-compliant cold-chain logistics|Port-of-entry to operating-room tracking"
                    class="wwd-selector-tab is-active relative shrink-0 w-[230px] lg:w-full lg:flex-1 lg:min-h-0 flex flex-col justify-center text-left py-1.5 cursor-pointer rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#72c5f8]/70">
                    <span class="wwd-tab-cat block text-[10.5px] xl:text-[11px] font-semibold leading-tight">Supply chain</span>
                    <span class="wwd-tab-title block text-[14.5px] sm:text-[15.5px] xl:text-[17px] font-bold leading-snug mt-0.5">Strategic importation and distribution</span>
                  </button>

                  <button type="button" id="wwd-tab-1" role="tab" aria-selected="false" aria-controls="wwd-stage-panel" tabindex="-1"
                    data-n="02" data-cat="Commercial" data-title="Product marketing and brand development" data-img="assets/img/pillars/p2_headquarters_brand.jpg" data-sl="Academic symposia" data-sv="25+ per year"
                    data-stat-num="25+" data-stat-meta="per year · academic symposia" data-stat-p1="25" data-stat-p2="" data-stat-sep="" data-stat-suffix="+"
                    data-visual="symposia-bars" data-short-desc="Medical meetings and campaigns that put each brand in front of the right surgeons." data-desc="We build clinical-first brand programs that connect international innovators with Philippine ophthalmologists through congresses, symposia and peer-to-peer education." data-pts="Brand strategy &amp; clinical positioning|Surgeon symposia and advisory boards|PAO and congress exhibitions|Launch campaigns for new technologies"
                    class="wwd-selector-tab relative shrink-0 w-[230px] lg:w-full lg:flex-1 lg:min-h-0 flex flex-col justify-center text-left py-1.5 cursor-pointer rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#72c5f8]/70">
                    <span class="wwd-tab-cat block text-[10.5px] xl:text-[11px] font-semibold leading-tight">Commercial</span>
                    <span class="wwd-tab-title block text-[14.5px] sm:text-[15.5px] xl:text-[17px] font-bold leading-snug mt-0.5">Product marketing and brand development</span>
                  </button>

                  <button type="button" id="wwd-tab-2" role="tab" aria-selected="false" aria-controls="wwd-stage-panel" tabindex="-1"
                    data-n="03" data-cat="Field network" data-title="Nationwide clinical and sales coverage" data-img="assets/img/pillars/p3_specialist_discussion.jpg" data-sl="Archipelago reach" data-sv="17 regions"
                    data-stat-num="17" data-stat-meta="regions · archipelago reach" data-stat-p1="17" data-stat-p2="" data-stat-sep="" data-stat-suffix=""
                    data-visual="archipelago-routes" data-short-desc="Clinical specialists and sales teams in every region, from Luzon to Mindanao." data-desc="Our clinical specialists work alongside surgical teams in Luzon, Visayas and Mindanao, handling detailing, consignment and hospital relationships." data-pts="Direct surgical-suite detailing|Operating-room consignment management|Hospital and ASC relations|Coverage across NCR, Luzon, Visayas, Mindanao"
                    class="wwd-selector-tab relative shrink-0 w-[230px] lg:w-full lg:flex-1 lg:min-h-0 flex flex-col justify-center text-left py-1.5 cursor-pointer rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#72c5f8]/70">
                    <span class="wwd-tab-cat block text-[10.5px] xl:text-[11px] font-semibold leading-tight">Field network</span>
                    <span class="wwd-tab-title block text-[14.5px] sm:text-[15.5px] xl:text-[17px] font-bold leading-snug mt-0.5">Nationwide clinical and sales coverage</span>
                  </button>

                  <button type="button" id="wwd-tab-3" role="tab" aria-selected="false" aria-controls="wwd-stage-panel" tabindex="-1"
                    data-n="04" data-cat="Governance" data-title="Regulatory compliance and QA" data-img="assets/img/pillars/p6_quality_metrology.jpg" data-sl="Regulatory audits" data-sv="100% pass"
                    data-stat-num="100" data-stat-meta="% · regulatory audits passed" data-stat-p1="100" data-stat-p2="" data-stat-sep="" data-stat-suffix=""
                    data-visual="governance-ring" data-short-desc="Every shipment, label and registration is checked before it reaches a hospital." data-desc="Every product we distribute is registered, traceable and stored under audited conditions, with continuous temperature monitoring and post-market surveillance." data-pts="Philippine FDA product registration|GDP / CDRR certification|Thermal mapping &amp; temperature monitoring|Pharmacovigilance &amp; recall readiness"
                    class="wwd-selector-tab relative shrink-0 w-[230px] lg:w-full lg:flex-1 lg:min-h-0 flex flex-col justify-center text-left py-1.5 cursor-pointer rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#72c5f8]/70">
                    <span class="wwd-tab-cat block text-[10.5px] xl:text-[11px] font-semibold leading-tight">Governance</span>
                    <span class="wwd-tab-title block text-[14.5px] sm:text-[15.5px] xl:text-[17px] font-bold leading-snug mt-0.5">Regulatory compliance and QA</span>
                  </button>

                  <button type="button" id="wwd-tab-4" role="tab" aria-selected="false" aria-controls="wwd-stage-panel" tabindex="-1"
                    data-n="05" data-cat="Professional development" data-title="Clinical and surgical education" data-img="assets/img/pillars/p5_theatre_wetlab.jpg" data-sl="Surgeons trained" data-sv="500+ fellows"
                    data-stat-num="500+" data-stat-meta="fellows · surgeons trained" data-stat-p1="500" data-stat-p2="" data-stat-sep="" data-stat-suffix="+"
                    data-visual="education-matrix" data-short-desc="Hands-on courses and fellowships that build surgical skill close to home." data-desc="Hands-on dry and wet labs, phacoemulsification masterclasses and accredited workshops that raise surgical outcomes for residents and fellows alike." data-pts="Dry &amp; wet lab courses|Phacoemulsification masterclasses|CME-accredited modules|Live and recorded video surgery"
                    class="wwd-selector-tab relative shrink-0 w-[230px] lg:w-full lg:flex-1 lg:min-h-0 flex flex-col justify-center text-left py-1.5 cursor-pointer rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#72c5f8]/70">
                    <span class="wwd-tab-cat block text-[10.5px] xl:text-[11px] font-semibold leading-tight">Professional development</span>
                    <span class="wwd-tab-title block text-[14.5px] sm:text-[15.5px] xl:text-[17px] font-bold leading-snug mt-0.5">Clinical and surgical education</span>
                  </button>

                  <button type="button" id="wwd-tab-5" role="tab" aria-selected="false" aria-controls="wwd-stage-panel" tabindex="-1"
                    data-n="06" data-cat="Continuity" data-title="Comprehensive post-market support" data-img="assets/img/pillars/p6_lot_traceability.jpg" data-sl="Service SLA" data-sv="24/7 priority"
                    data-stat-num="24/7" data-stat-meta="priority · service response" data-stat-p1="24" data-stat-p2="7" data-stat-sep="/" data-stat-suffix=""
                    data-visual="continuity-dial" data-short-desc="Surgeons reach a support specialist at any hour, with priority for urgent cases." data-desc="After the sale we stay close: equipment calibration, biometry assistance, surgical feedback loops and a technical hotline for ophthalmic teams." data-pts="Equipment calibration &amp; in-service|IOL biometry assistance|Surgical feedback loops|24/7 technical hotline"
                    class="wwd-selector-tab relative shrink-0 w-[230px] lg:w-full lg:flex-1 lg:min-h-0 flex flex-col justify-center text-left py-1.5 cursor-pointer rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#72c5f8]/70">
                    <span class="wwd-tab-cat block text-[10.5px] xl:text-[11px] font-semibold leading-tight">Continuity</span>
                    <span class="wwd-tab-title block text-[14.5px] sm:text-[15.5px] xl:text-[17px] font-bold leading-snug mt-0.5">Comprehensive post-market support</span>
                  </button>
                </div>
              </div>

              <!-- Right Main Frosted-Glass Card (spotlight, cursor border glow, 3° tilt, floating bob) -->
              <div id="wwd-stage-panel" role="tabpanel" aria-labelledby="wwd-tab-0" aria-live="polite" class="min-h-0 flex flex-col">
                <div id="wwd-stage-card" class="wwd-glass-main-card flex-1 min-h-[420px] lg:min-h-0 h-full p-4 sm:p-6 lg:px-8 lg:py-6 flex flex-col">
                  <span class="wwd-card-spotlight" aria-hidden="true"></span>
                  <span class="wwd-card-border-glow" aria-hidden="true"></span>

                  <div class="relative z-10 shrink-0">
                    <div class="flex flex-wrap items-end gap-x-4 gap-y-1">
                      <span id="wwd-stage-stat-num" class="text-[52px] sm:text-[76px] xl:text-[96px] font-extrabold text-[#4fc3f7] tracking-[-0.045em] tabular-nums leading-[0.88]">24–48</span>
                      <span id="wwd-stage-stat-meta" class="pb-1 text-[13px] sm:text-[14.5px] text-[#b8c6dc]">hours · cold-chain dispatch</span>
                    </div>
                    <p id="wwd-stage-desc" class="mt-2.5 text-[13.5px] sm:text-[14.5px] xl:text-[15.5px] text-white/90 leading-relaxed max-w-[540px]">Temperature-controlled products leave our warehouse within two days of an order.</p>
                  </div>

                  <div id="wwd-stage-visual-wrap" class="relative z-10 flex-1 min-h-[200px] my-2">
                    <canvas id="wwd-stage-canvas" class="absolute inset-0 w-full h-full block" aria-hidden="true"></canvas>
                  </div>

                  <div class="relative z-10 shrink-0 pt-2.5 border-t border-white/[0.08] flex items-center gap-7">
                    <button type="button" id="wwd-stage-modal-btn"
                      data-n="01" data-cat="Supply chain" data-title="Strategic importation and distribution" data-img="assets/img/pillars/p1_cleanroom_inspect.jpg" data-sl="Cold-chain dispatch" data-sv="24–48 hours" data-desc="We source Rayner and partner products directly from the manufacturer, coordinate customs clearance, and keep cleanroom-grade inventory ready so surgeons never wait on a lens." data-pts="Product sourcing &amp; importation coordination|Cleanroom inventory reserves|GDP-compliant cold-chain logistics|Port-of-entry to operating-room tracking"
                      class="wwd-card wwd-link group inline-flex items-center gap-2 text-[13.5px] sm:text-[14px] font-semibold text-white cursor-pointer rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#72c5f8]/70">
                      <span class="relative pb-1">Learn more<span class="wwd-link-underline absolute left-0 bottom-0 h-[2px] w-5 rounded-full bg-white/85"></span></span>
                      <svg class="size-3.5 -mt-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                    </button>
                    <button type="button" id="wwd-pause-btn" aria-pressed="false"
                      class="wwd-link group inline-flex items-center text-[13px] sm:text-[13.5px] font-medium text-[#9eb2ce] hover:text-white cursor-pointer rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#72c5f8]/70">
                      <span class="relative pb-1"><span class="wwd-pause-label">Pause</span><span class="wwd-link-underline absolute left-0 bottom-0 h-[1.5px] w-3 rounded-full bg-[#9eb2ce]/70 group-hover:bg-white"></span></span>
                    </button>
                  </div>

                </div>
              </div>

            </div>
          </div>"""

for path in ["index.html", "components/about-locked-backup.html"]:
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    pattern = re.compile(
        r"        <!-- ========================================================================= -->\s*<!-- SLIDE 3: WHAT WE DO[\s\S]*?          <!-- Learn-more detail card \(modal\) -->",
        re.MULTILINE
    )
    if not pattern.search(content):
        raise RuntimeError(f"Could not find SLIDE 3 block in {path}")
    updated = pattern.sub(new_wwd_html + "\n\n          <!-- Learn-more detail card (modal) -->", content, count=1)
    with open(path, "w", encoding="utf-8", newline="\n") as f:
        f.write(updated)
    print("Updated", path)

