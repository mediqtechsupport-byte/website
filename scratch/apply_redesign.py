import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Update CSS in <head>
css_marker = '/* 3D SCROLL-DRIVEN INTRAOCULAR LENSES SHOWCASE (ZANDRELLEZ)  */'
css_start = html.find(css_marker)
if css_start != -1:
    # find comment start before marker
    div_start = html.rfind('/* ===', 0, css_start)
    if div_start != -1:
        css_start = div_start
    # find where this CSS block ends (before </style>)
    style_end = html.find('</style>', css_start)
else:
    raise Exception("CSS marker not found in index.html")

new_css = """/* ========================================================== */
    /* 3D SCROLL-DRIVEN INTRAOCULAR LENSES SHOWCASE (ZANDRELLEZ)  */
    /* ========================================================== */
    .sv-scene {
      position: relative;
      width: min(580px, 45vw);
      height: min(540px, 66vh);
      display: flex;
      align-items: center;
      justify-content: center;
      touch-action: pan-y;
      user-select: none;
    }

    .sv-halo {
      position: absolute;
      inset: 6%;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(58, 160, 219, 0.48) 0%, rgba(17, 50, 108, 0.3) 48%, transparent 72%);
      filter: blur(55px);
      animation: sv-breathe 5.5s ease-in-out infinite;
      pointer-events: none;
    }

    @keyframes sv-breathe {
      0%, 100% { opacity: 0.55; transform: scale(0.96); }
      50% { opacity: 0.95; transform: scale(1.08); }
    }

    .sv-stage {
      position: absolute;
      inset: 0;
      perspective: 1200px;
      perspective-origin: 50% 45%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .sv-tilt {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      transform-style: preserve-3d;
      transition: transform 0.4s cubic-bezier(0.2, 0.7, 0.2, 1);
      will-change: transform;
    }

    .sv-rig {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      transform-style: preserve-3d;
    }

    /* Multi-layered 3D Plinth / Disc Platform */
    .sv-plinth {
      position: absolute;
      bottom: 6%;
      width: 88%;
      height: 38%;
      border-radius: 50%;
      transform-style: preserve-3d;
      transform: rotateX(68deg);
      pointer-events: none;
    }

    .sv-disc {
      position: absolute;
      inset: 0;
      border-radius: 50%;
    }

    .sv-disc--top {
      background:
        radial-gradient(circle, transparent 0 52%, rgba(58, 160, 219, 0.45) 53%, transparent 55%),
        radial-gradient(circle, transparent 0 76%, rgba(114, 197, 248, 0.65) 77%, transparent 79%),
        radial-gradient(circle at 50% 36%, #194488, #071530 75%);
      box-shadow:
        inset 0 0 35px rgba(0, 0, 0, 0.85),
        0 0 50px rgba(58, 160, 219, 0.5);
    }

    .sv-disc--ring1 {
      inset: -8px;
      border: 1.5px solid rgba(58, 160, 219, 0.4);
      box-shadow: 0 0 20px rgba(58, 160, 219, 0.25);
    }

    .sv-disc--ring2 {
      inset: -18px;
      border: 1px solid rgba(58, 160, 219, 0.2);
    }

    /* High-Definition Packshot Floating in 3D Space (Crisp, Tightly Framed) */
    .sv-packshot-img {
      position: relative;
      width: 95%;
      max-height: 85%;
      object-fit: contain;
      filter: drop-shadow(0 32px 50px rgba(0, 0, 0, 0.95)) drop-shadow(0 0 40px rgba(58, 160, 219, 0.38));
      animation: sv-packshot-float 8.5s ease-in-out infinite;
      transform-style: preserve-3d;
      user-select: none;
      z-index: 10;
    }

    @keyframes sv-packshot-float {
      0%, 100% {
        transform: translateY(0px) rotateY(-8deg) rotateX(3deg);
      }
      50% {
        transform: translateY(-20px) rotateY(9deg) rotateX(-2deg);
      }
    }

    /* ================= CONTENT SIDE (Matches Reference Typography Exactly) ================= */
    .sv-content {
      display: flex;
      flex-direction: column;
      width: 100%;
      max-width: 600px;
      padding: 0 24px;
      box-sizing: border-box;
      z-index: 20;
    }

    .sv-title {
      margin: 0;
      font-size: clamp(38px, 4.4vw, 54px);
      line-height: 1.08;
      letter-spacing: -0.03em;
      font-weight: 800;
      color: #ffffff;
      text-wrap: balance;
    }

    .sv-subtitle {
      margin: 14px 0 0;
      font-size: clamp(16px, 1.4vw, 18px);
      line-height: 1.4;
      font-weight: 600;
      letter-spacing: -0.01em;
      color: rgba(255, 255, 255, 0.85);
    }

    .sv-pitch {
      margin: 16px 0 0;
      max-width: 54ch;
      font-size: clamp(14px, 1.1vw, 15.5px);
      line-height: 1.65;
      color: #94a3b8;
    }

    /* Accordion List (Matching Reference Pill Buttons with Hollow Circle) */
    .sv-list {
      list-style: none;
      margin: 32px 0 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 12px;
      width: 100%;
    }

    .sv-row {
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 9999px;
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(12px);
      transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
      overflow: hidden;
    }

    .sv-row:hover {
      border-color: rgba(255, 255, 255, 0.25);
      background: rgba(255, 255, 255, 0.06);
    }

    .sv-row[data-open="true"] {
      border-radius: 20px;
      border-color: rgba(58, 160, 219, 0.65);
      background: linear-gradient(180deg, rgba(58, 160, 219, 0.12), rgba(10, 29, 64, 0.85));
      box-shadow: 0 10px 30px -10px rgba(58, 160, 219, 0.35);
    }

    .sv-row__btn {
      all: unset;
      box-sizing: border-box;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 14px;
      cursor: pointer;
      padding: 15px 24px;
      border-radius: inherit;
    }

    .sv-row__left {
      display: flex;
      align-items: center;
      gap: 14px;
      flex: 1;
    }

    .sv-row__led {
      flex: none;
      width: 9px;
      height: 9px;
      border-radius: 50%;
      border: 1.5px solid rgba(255, 255, 255, 0.45);
      background: transparent;
      transition: all 0.3s ease;
    }

    .sv-row[data-open="true"] .sv-row__led {
      border-color: #3aa0db;
      background: #3aa0db;
      box-shadow: 0 0 12px #3aa0db;
    }

    .sv-row__title {
      font-size: 15.5px;
      font-weight: 600;
      letter-spacing: -0.01em;
      color: #ffffff;
    }

    .sv-row__plus {
      flex: none;
      color: rgba(255, 255, 255, 0.6);
      font-size: 20px;
      font-weight: 300;
      line-height: 1;
      transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), color 0.3s;
    }

    .sv-row[data-open="true"] .sv-row__plus {
      transform: rotate(45deg);
      color: #3aa0db;
    }

    .sv-row__panel {
      display: grid;
      grid-template-rows: 0fr;
      visibility: hidden;
      transition: grid-template-rows 0.4s cubic-bezier(0.16, 1, 0.3, 1), visibility 0s linear 0.4s;
    }

    .sv-row[data-open="true"] .sv-row__panel {
      grid-template-rows: 1fr;
      visibility: visible;
      transition-delay: 0s;
    }

    .sv-row__clip {
      overflow: hidden;
      min-height: 0;
    }

    .sv-row__desc {
      margin: 0;
      padding: 0 24px 20px 47px;
      font-size: 14px;
      line-height: 1.6;
      color: rgba(246, 242, 234, 0.85);
    }

    /* ================= PROGRESS RAIL (Highlighted Floating Pill) ================= */
    .sv-rail {
      position: absolute;
      z-index: 35;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 20px;
      width: min(92vw, 620px);
      background: rgba(7, 19, 43, 0.75);
      padding: 8px 18px;
      border-radius: 9999px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(16px);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
    }

    .sv-rail__item {
      all: unset;
      box-sizing: border-box;
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 6px 0;
      cursor: pointer;
      color: rgba(246, 242, 234, 0.5);
      transition: color 0.3s;
    }

    .sv-rail__item:hover,
    .sv-rail__item[aria-current="true"] {
      color: #ffffff;
    }

    .sv-rail__label {
      font-size: 12.5px;
      font-weight: 700;
      letter-spacing: 0.02em;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      text-align: center;
    }

    .sv-rail__track {
      position: relative;
      height: 3.5px;
      border-radius: 9999px;
      overflow: hidden;
      background: rgba(255, 255, 255, 0.15);
    }

    .sv-rail__fill {
      position: absolute;
      inset: 0;
      background: #3aa0db;
      box-shadow: 0 0 14px rgba(58, 160, 219, 0.85);
      transform-origin: left;
      transform: scaleX(0);
      transition: transform 0.15s ease-out;
    }

    .sv-rail__item[aria-current="true"] .sv-rail__fill {
      box-shadow: 0 0 18px #3aa0db;
    }

    /* ========================================================================= */
    /* NOTCHED PROJECT CARD (21st.dev Style for Slide 0 Categories)              */
    /* ========================================================================= */
    .notched-card {
      position: relative;
      background: rgba(10, 24, 52, 0.75);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 28px;
      padding: 14px;
      backdrop-filter: blur(16px);
      transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.35s, box-shadow 0.35s;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .notched-card:hover {
      transform: translateY(-6px);
      border-color: rgba(58, 160, 219, 0.45);
      box-shadow: 0 20px 40px -15px rgba(5, 15, 36, 0.8), 0 0 25px rgba(58, 160, 219, 0.2);
    }

    .notched-img-box {
      position: relative;
      width: 100%;
      height: 190px;
      border-radius: 20px;
      overflow: hidden;
      background: radial-gradient(circle at 50% 40%, #153265, #081735);
    }

    .notched-img-box img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      padding: 14px;
      transition: transform 0.4s ease;
    }

    .notched-card:hover .notched-img-box img {
      transform: scale(1.06);
    }

    .notched-badge {
      position: absolute;
      top: 12px;
      right: 12px;
      padding: 3px 10px;
      border-radius: 9999px;
      background: rgba(0, 0, 0, 0.45);
      backdrop-filter: blur(8px);
      font-size: 11px;
      font-family: monospace;
      font-weight: 700;
      color: rgba(255, 255, 255, 0.85);
      border: 1px solid rgba(255, 255, 255, 0.12);
      z-index: 5;
    }

    .notched-svg-corner {
      position: absolute;
      bottom: -1px;
      right: -1px;
      width: 88px;
      height: 88px;
      fill: #0a1834;
      pointer-events: none;
      z-index: 10;
    }

    .notched-btn {
      position: absolute;
      bottom: 6px;
      right: 6px;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 18px rgba(0, 0, 0, 0.4);
      transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s;
      z-index: 20;
    }

    .notched-card:hover .notched-btn {
      transform: scale(1.1);
      box-shadow: 0 6px 22px rgba(0, 0, 0, 0.5);
    }

    .notched-btn svg {
      width: 22px;
      height: 22px;
      stroke-width: 2.5;
      transition: transform 0.3s ease;
    }

    .notched-card:hover .notched-btn svg {
      transform: translate(2px, -2px);
    }
    """

html = html[:css_start] + new_css + html[style_end:]

# 2. Update Slide 0 inside #products
s0_marker = '<div class="product-slide absolute inset-0 w-full h-full flex flex-col justify-center items-center px-4 sm:px-8 lg:px-12 py-16 transition-all duration-500 ease-out opacity-100 pointer-events-auto translate-x-0 z-10 overflow-y-auto" data-product-index="0">'
s0_start = html.find(s0_marker)
s1_marker = '<div id="product-slide-iols"'
s1_start = html.find(s1_marker, s0_start)

if s0_start == -1 or s1_start == -1:
    raise Exception("Slide 0 or Slide 1 marker not found")

new_slide_0 = """<div class="product-slide absolute inset-0 w-full h-full flex flex-col justify-center items-center px-4 sm:px-8 lg:px-12 py-16 transition-all duration-500 ease-out opacity-100 pointer-events-auto translate-x-0 z-10 overflow-y-auto" data-product-index="0">
          <div class="relative z-10 w-full max-w-7xl mx-auto my-auto flex flex-col items-center">
            
            <!-- Section Header -->
            <div class="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
              <p class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky/10 border border-sky/30 text-sky text-[11px] font-bold tracking-widest uppercase mb-3 shadow-[0_0_20px_rgba(58,160,219,0.2)]">
                <span>OPHTHALMIC INNOVATIONS &bull; PRODUCT PORTFOLIO</span>
                <span class="inline-block size-1.5 rounded-full bg-sky animate-ping"></span>
              </p>
              <h2 id="products-title" class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-3">
                Pioneering Optical &amp; Surgical <span class="text-transparent bg-clip-text bg-gradient-to-r from-sky via-[#72c5f8] to-white">Solutions</span>
              </h2>
              <p class="text-xs sm:text-sm lg:text-base text-cream/75 leading-relaxed max-w-2xl mx-auto">
                Connecting Rayner's world-leading intraocular lenses, bio-engineered ophthalmic viscoelastics, and single-use preloaded injector systems across the Philippine archipelago.
              </p>
            </div>

            <!-- 4 Notched Project Cards (21st.dev Style Matching User Reference) -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full">
              
              <!-- CARD 1: INTRAOCULAR LENSES (Warm Terracotta Accent #DA8956) -->
              <div onclick="if(window.goToProductSlide){window.goToProductSlide(1);}" class="notched-card group">
                <div>
                  <div class="notched-img-box">
                    <img src="assets/img/hero-lens-only-transparent.png" alt="Intraocular Lenses" loading="lazy">
                    <div class="notched-badge">01</div>
                    <svg class="notched-svg-corner" viewBox="0 0 88 88">
                      <path d="M 88,0 C 88,14 74,24 60,24 C 40,24 24,40 24,60 C 24,74 14,88 0,88 L 88,88 Z" />
                    </svg>
                    <div class="notched-btn" style="background: #DA8956; color: #121316;">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M7 17L17 7M17 7H7M17 7V17" />
                      </svg>
                    </div>
                  </div>
                  <div class="pt-4 px-1 pb-1">
                    <h3 class="text-lg font-bold text-white group-hover:text-sky transition-colors">Intraocular Lenses</h3>
                    <p class="text-xs text-cream/70 leading-relaxed mt-1.5">
                      RayOne&reg; Galaxy spiral AI, EMV extended visual range, trifocal, and monofocal precision surgical optics.
                    </p>
                  </div>
                </div>
                <div class="mt-4 px-1 flex flex-wrap gap-1.5">
                  <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-slate-300">SURGICAL OPTICS</span>
                  <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-slate-300">PRELOADED</span>
                </div>
              </div>

              <!-- CARD 2: MEDICAL SUPPLIES (Dark Slate Accent) -->
              <div onclick="if(window.goToProductSlide){window.goToProductSlide(2);}" class="notched-card group">
                <div>
                  <div class="notched-img-box">
                    <img src="assets/img/packshots/Ophteis Adaptive Pro.png" alt="Medical Supplies" loading="lazy">
                    <div class="notched-badge">02</div>
                    <svg class="notched-svg-corner" viewBox="0 0 88 88">
                      <path d="M 88,0 C 88,14 74,24 60,24 C 40,24 24,40 24,60 C 24,74 14,88 0,88 L 88,88 Z" />
                    </svg>
                    <div class="notched-btn" style="background: #23262f; color: #ffffff;">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M7 17L17 7M17 7H7M17 7V17" />
                      </svg>
                    </div>
                  </div>
                  <div class="pt-4 px-1 pb-1">
                    <h3 class="text-lg font-bold text-white group-hover:text-sky transition-colors">Medical Supplies</h3>
                    <p class="text-xs text-cream/70 leading-relaxed mt-1.5">
                      Ophteis&reg; bio-engineered viscoelastics with Sorbitol, single-use surgical knives, and sterile ophthalmic kits.
                    </p>
                  </div>
                </div>
                <div class="mt-4 px-1 flex flex-wrap gap-1.5">
                  <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-slate-300">VISCOSURGICAL</span>
                  <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-slate-300">OVD</span>
                </div>
              </div>

              <!-- CARD 3: DEVICES & EQUIPMENT (Dark Slate Accent) -->
              <div onclick="if(window.goToProductSlide){window.goToProductSlide(3);}" class="notched-card group">
                <div>
                  <div class="notched-img-box">
                    <img src="assets/img/packshots/RayOne EMV Toric (13).png" alt="Devices and Equipment" loading="lazy">
                    <div class="notched-badge">03</div>
                    <svg class="notched-svg-corner" viewBox="0 0 88 88">
                      <path d="M 88,0 C 88,14 74,24 60,24 C 40,24 24,40 24,60 C 24,74 14,88 0,88 L 88,88 Z" />
                    </svg>
                    <div class="notched-btn" style="background: #23262f; color: #ffffff;">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M7 17L17 7M17 7H7M17 7V17" />
                      </svg>
                    </div>
                  </div>
                  <div class="pt-4 px-1 pb-1">
                    <h3 class="text-lg font-bold text-white group-hover:text-sky transition-colors">Devices &amp; Equipment</h3>
                    <p class="text-xs text-cream/70 leading-relaxed mt-1.5">
                      Patented Lock &amp; Roll&trade; 1.65mm micro-incision injector delivery systems and ophthalmic instruments.
                    </p>
                  </div>
                </div>
                <div class="mt-4 px-1 flex flex-wrap gap-1.5">
                  <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-slate-300">INSTRUMENTS</span>
                  <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-slate-300">1.65MM DELIVERY</span>
                </div>
              </div>

              <!-- CARD 4: PRODUCT CATALOGS (Sky Cyan Accent) -->
              <div onclick="if(window.goToProductSlide){window.goToProductSlide(4);}" class="notched-card group">
                <div>
                  <div class="notched-img-box">
                    <img src="assets/img/rayone-emv-brochure.jpg" alt="Product Catalogs" loading="lazy">
                    <div class="notched-badge">04</div>
                    <svg class="notched-svg-corner" viewBox="0 0 88 88">
                      <path d="M 88,0 C 88,14 74,24 60,24 C 40,24 24,40 24,60 C 24,74 14,88 0,88 L 88,88 Z" />
                    </svg>
                    <div class="notched-btn" style="background: #3aa0db; color: #07132b;">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M7 17L17 7M17 7H7M17 7V17" />
                      </svg>
                    </div>
                  </div>
                  <div class="pt-4 px-1 pb-1">
                    <h3 class="text-lg font-bold text-white group-hover:text-sky transition-colors">Product Catalogs</h3>
                    <p class="text-xs text-cream/70 leading-relaxed mt-1.5">
                      Comprehensive clinical datasheets, peer-reviewed optical studies, IOL power calculation charts, and FDA certifications.
                    </p>
                  </div>
                </div>
                <div class="mt-4 px-1 flex flex-wrap gap-1.5">
                  <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-slate-300">DOCUMENTATION</span>
                  <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-slate-300">CLINICAL DATA</span>
                </div>
              </div>

            </div>

            <!-- Bottom Navigation Prompt -->
            <div class="mt-8 text-center">
              <button type="button" onclick="if(window.goToProductSlide){window.goToProductSlide(1);}" class="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-sky text-[#0a1d40] text-sm font-bold tracking-wide shadow-[0_0_25px_rgba(58,160,219,0.35)] hover:bg-[#72c5f8] hover:scale-105 active:scale-95 transition-all cursor-pointer">
                <span>Explore Intraocular Lenses Showcase</span>
                <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m9 18 6-6-6-6"/></svg>
              </button>
            </div>

          </div>
        </div>

        """

html = html[:s0_start] + new_slide_0 + html[s1_start:]

# 3. Update Slide 1 (Intraocular Lenses) markup with the clean sv-row__left and plus symbol
# Re-find s1_start
s1_start = html.find('<div id="product-slide-iols"')
s2_marker = '<div class="product-slide absolute inset-0 w-full h-full flex flex-col justify-center items-center px-4 sm:px-8 lg:px-12 py-16 transition-all duration-500 ease-out opacity-0 pointer-events-none translate-x-12 z-0 overflow-y-auto" data-product-index="2">'
s2_start = html.find(s2_marker, s1_start)

new_slide_1 = """<div id="product-slide-iols" class="product-slide absolute inset-0 w-full h-full flex flex-col bg-[#07132b] text-cream overflow-hidden transition-all duration-500 ease-out opacity-0 pointer-events-none translate-x-12 z-0" data-product-index="1">
          
          <!-- Persistent Subtle Grid & Ambient Radial Glows -->
          <div class="pointer-events-none absolute inset-0 z-0 overflow-hidden">
            <div class="absolute -left-20 top-1/4 h-[42rem] w-[42rem] rounded-full bg-sky/15 blur-[160px]"></div>
            <div class="absolute right-0 top-1/3 h-[46rem] w-[46rem] rounded-full bg-[#11326c]/40 blur-[180px]"></div>
            <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(#3aa0db_1px,transparent_1px)] [background-size:28px_28px] opacity-15"></div>
          </div>

          <!-- Top Slim Floating Navigation Bar -->
          <div class="absolute top-5 left-6 right-6 sm:top-7 sm:left-12 sm:right-12 z-40 flex items-center justify-between pointer-events-auto">
            <button type="button" onclick="if(window.goToProductSlide){window.goToProductSlide(0);}" class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-cream/90 hover:text-white transition-all cursor-pointer backdrop-blur-md">
              <svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m15 18-6-6 6-6"/></svg>
              <span>Product Overview</span>
            </button>

            <!-- Active Stage Highlight Badge (High-Visibility Glow) -->
            <div id="iol-stage-badge" class="px-5 py-2 rounded-full bg-[#0a1e45]/90 border border-sky/50 text-xs font-mono font-bold tracking-widest text-sky uppercase shadow-[0_0_25px_rgba(58,160,219,0.4)] backdrop-blur-md flex items-center gap-2.5">
              <span class="size-2 rounded-full bg-sky animate-ping"></span>
              <span id="iol-stage-badge-text">STAGE 01 &bull; RAYONE&reg; EMV</span>
            </div>

            <button type="button" onclick="if(window.goToProductSlide){window.goToProductSlide(2);}" class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky/20 hover:bg-sky text-sky hover:text-[#07132b] text-xs font-bold transition-all cursor-pointer backdrop-blur-md">
              <span>Medical Supplies</span>
              <svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>

          <!-- Inner Scroll Track (Height 320vh for fluid scroll choreography) -->
          <div id="iol-scroll-container" class="relative w-full h-full overflow-y-auto scroll-smooth z-10">
            <div class="h-[320vh] w-full relative">
              
              <!-- Pinned 100vh Sticky Stage -->
              <div class="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">

                <!-- ================= STAGE 0: RayOne EMV ================= -->
                <!-- Desktop Scene (Left-0) -->
                <div id="iol-scene-0" class="iol-anim-scene absolute inset-y-0 hidden lg:flex w-1/2 left-0 items-center justify-center pointer-events-auto transition-transform duration-500 will-change-transform z-10">
                  <div class="sv-scene" onpointermove="handleIolTilt(event, this)" onpointerleave="resetIolTilt(this)">
                    <div class="sv-halo"></div>
                    <div class="sv-stage">
                      <div class="sv-tilt">
                        <div class="sv-rig">
                          <div class="sv-plinth">
                            <i class="sv-disc sv-disc--top"></i>
                            <i class="sv-disc sv-disc--ring1"></i>
                            <i class="sv-disc sv-disc--ring2"></i>
                          </div>
                          <img src="assets/img/packshots/emv_stage.png" alt="RayOne EMV Packshot" class="sv-packshot-img" loading="eager">
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Desktop Content (Right-0) -->
                <div id="iol-content-0" class="iol-anim-content absolute inset-y-0 hidden lg:flex w-1/2 right-0 items-center justify-center pointer-events-auto transition-transform duration-500 will-change-transform z-20">
                  <div class="sv-content">
                    <h2 class="sv-title">RayOne&reg; EMV</h2>
                    <p class="sv-subtitle">Co-developed with Prof. Graham Barrett &bull; Extended Visual Depth</p>
                    <p class="sv-pitch">
                      First and only non-diffractive extended depth of field IOL utilizing controlled positive spherical aberration to provide seamless distance, intermediate, and functional near vision without dysphotopsia.
                    </p>

                    <ul class="sv-list">
                      <li class="sv-row" data-open="true">
                        <button type="button" class="sv-row__btn" onclick="toggleIolAcc(this)">
                          <span class="sv-row__left">
                            <span class="sv-row__led" aria-hidden="true"></span>
                            <span class="sv-row__title">Natural Intermediate Focus (+1.50 D)</span>
                          </span>
                          <span class="sv-row__plus" aria-hidden="true">+</span>
                        </button>
                        <div class="sv-row__panel">
                          <div class="sv-row__clip">
                            <p class="sv-row__desc">Extends visual depth smoothly into computer monitor and dashboard distances while maintaining 100% photopic contrast sensitivity and zero dysphotopsia.</p>
                          </div>
                        </div>
                      </li>

                      <li class="sv-row" data-open="false">
                        <button type="button" class="sv-row__btn" onclick="toggleIolAcc(this)">
                          <span class="sv-row__left">
                            <span class="sv-row__led" aria-hidden="true"></span>
                            <span class="sv-row__title">Lock &amp; Roll&trade; 1.65mm Delivery</span>
                          </span>
                          <span class="sv-row__plus" aria-hidden="true">+</span>
                        </button>
                        <div class="sv-row__panel">
                          <div class="sv-row__clip">
                            <p class="sv-row__desc">World's smallest fully preloaded 1.65mm micro-incision injector ensures a smooth, single-handed, wound-assisted planar delivery into the capsular bag.</p>
                          </div>
                        </div>
                      </li>

                      <li class="sv-row" data-open="false">
                        <button type="button" class="sv-row__btn" onclick="toggleIolAcc(this)">
                          <span class="sv-row__left">
                            <span class="sv-row__led" aria-hidden="true"></span>
                            <span class="sv-row__title">Glisten-Free Rayacryl&reg; Copolymer</span>
                          </span>
                          <span class="sv-row__plus" aria-hidden="true">+</span>
                        </button>
                        <div class="sv-row__panel">
                          <div class="sv-row__clip">
                            <p class="sv-row__desc">Proprietary hydrophilic acrylic with 26% water equilibrium delivers pristine optical clarity with zero micro-vacuole formation over decades of clinical tracking.</p>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>

                <!-- ================= STAGE 1: RayOne Trifocal (Alternating: Content Left, Scene Right) ================= -->
                <!-- Desktop Content (Left-1) -->
                <div id="iol-content-1" class="iol-anim-content absolute inset-y-0 hidden lg:flex w-1/2 left-0 items-center justify-center opacity-0 pointer-events-none transition-transform duration-500 will-change-transform z-20">
                  <div class="sv-content">
                    <h2 class="sv-title">RayOne&reg; Trifocal</h2>
                    <p class="sv-subtitle">Patented 16-Ring Diffractive Profile &bull; Maximum Light Transmission</p>
                    <p class="sv-pitch">
                      Halves the number of diffractive rings compared to conventional trifocals, reducing light scatter to only 11% and transmitting an exceptional 89% of light directly onto the retina for comfortable reading.
                    </p>

                    <ul class="sv-list">
                      <li class="sv-row" data-open="true">
                        <button type="button" class="sv-row__btn" onclick="toggleIolAcc(this)">
                          <span class="sv-row__left">
                            <span class="sv-row__led" aria-hidden="true"></span>
                            <span class="sv-row__title">Minimal Light Loss (Only 11%)</span>
                          </span>
                          <span class="sv-row__plus" aria-hidden="true">+</span>
                        </button>
                        <div class="sv-row__panel">
                          <div class="sv-row__clip">
                            <p class="sv-row__desc">Directs 89% of available light to the retina (52% distance, 22% intermediate, 26% near) for brilliant contrast under dim evening and dining conditions.</p>
                          </div>
                        </div>
                      </li>

                      <li class="sv-row" data-open="false">
                        <button type="button" class="sv-row__btn" onclick="toggleIolAcc(this)">
                          <span class="sv-row__left">
                            <span class="sv-row__led" aria-hidden="true"></span>
                            <span class="sv-row__title">Comfortable Near Addition (+3.50 D)</span>
                          </span>
                          <span class="sv-row__plus" aria-hidden="true">+</span>
                        </button>
                        <div class="sv-row__panel">
                          <div class="sv-row__clip">
                            <p class="sv-row__desc">Optimal near power (+3.50 D spectacle plane +2.70 D) and intermediate (+1.75 D) delivers natural smartphone reading without spectacle dependence.</p>
                          </div>
                        </div>
                      </li>

                      <li class="sv-row" data-open="false">
                        <button type="button" class="sv-row__btn" onclick="toggleIolAcc(this)">
                          <span class="sv-row__left">
                            <span class="sv-row__led" aria-hidden="true"></span>
                            <span class="sv-row__title">True 360&deg; Enhanced Square Edge</span>
                          </span>
                          <span class="sv-row__plus" aria-hidden="true">+</span>
                        </button>
                        <div class="sv-row__panel">
                          <div class="sv-row__clip">
                            <p class="sv-row__desc">Continuous barrier geometry blocks epithelial cell migration across the posterior capsule, driving Nd:YAG capsulotomy rates to near zero.</p>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>

                <!-- Desktop Scene (Right-1) -->
                <div id="iol-scene-1" class="iol-anim-scene absolute inset-y-0 hidden lg:flex w-1/2 right-0 items-center justify-center opacity-0 pointer-events-none transition-transform duration-500 will-change-transform z-10">
                  <div class="sv-scene" onpointermove="handleIolTilt(event, this)" onpointerleave="resetIolTilt(this)">
                    <div class="sv-halo"></div>
                    <div class="sv-stage">
                      <div class="sv-tilt">
                        <div class="sv-rig">
                          <div class="sv-plinth">
                            <i class="sv-disc sv-disc--top"></i>
                            <i class="sv-disc sv-disc--ring1"></i>
                            <i class="sv-disc sv-disc--ring2"></i>
                          </div>
                          <img src="assets/img/packshots/trifocal_stage.png" alt="RayOne Trifocal Packshot" class="sv-packshot-img" loading="lazy">
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- ================= STAGE 2: RayOne Aspheric (Scene Left, Content Right) ================= -->
                <!-- Desktop Scene (Left-2) -->
                <div id="iol-scene-2" class="iol-anim-scene absolute inset-y-0 hidden lg:flex w-1/2 left-0 items-center justify-center opacity-0 pointer-events-none transition-transform duration-500 will-change-transform z-10">
                  <div class="sv-scene" onpointermove="handleIolTilt(event, this)" onpointerleave="resetIolTilt(this)">
                    <div class="sv-halo"></div>
                    <div class="sv-stage">
                      <div class="sv-tilt">
                        <div class="sv-rig">
                          <div class="sv-plinth">
                            <i class="sv-disc sv-disc--top"></i>
                            <i class="sv-disc sv-disc--ring1"></i>
                            <i class="sv-disc sv-disc--ring2"></i>
                          </div>
                          <img src="assets/img/packshots/aspheric_stage.png" alt="RayOne Aspheric Packshot" class="sv-packshot-img" loading="lazy">
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Desktop Content (Right-2) -->
                <div id="iol-content-2" class="iol-anim-content absolute inset-y-0 hidden lg:flex w-1/2 right-0 items-center justify-center opacity-0 pointer-events-none transition-transform duration-500 will-change-transform z-20">
                  <div class="sv-content">
                    <h2 class="sv-title">RayOne&reg; Aspheric</h2>
                    <p class="sv-subtitle">Aberration-Neutral Precision &bull; Universal Corneal Compatibility</p>
                    <p class="sv-pitch">
                      Aberration-neutral monofocal IOL designed for pristine contrast sensitivity and compromised corneas, complemented by the Sulcoflex pseudophakic supplementary platform.
                    </p>

                    <ul class="sv-list">
                      <li class="sv-row" data-open="true">
                        <button type="button" class="sv-row__btn" onclick="toggleIolAcc(this)">
                          <span class="sv-row__left">
                            <span class="sv-row__led" aria-hidden="true"></span>
                            <span class="sv-row__title">Zero Spherical Aberration Design</span>
                          </span>
                          <span class="sv-row__plus" aria-hidden="true">+</span>
                        </button>
                        <div class="sv-row__panel">
                          <div class="sv-row__clip">
                            <p class="sv-row__desc">Guarantees predictable vision and heightened depth of field regardless of individual corneal curvature or previous refractive surgery.</p>
                          </div>
                        </div>
                      </li>

                      <li class="sv-row" data-open="false">
                        <button type="button" class="sv-row__btn" onclick="toggleIolAcc(this)">
                          <span class="sv-row__left">
                            <span class="sv-row__led" aria-hidden="true"></span>
                            <span class="sv-row__title">Sulcoflex Supplementary Sulcus Platform</span>
                          </span>
                          <span class="sv-row__plus" aria-hidden="true">+</span>
                        </button>
                        <div class="sv-row__panel">
                          <div class="sv-row__clip">
                            <p class="sv-row__desc">Reversible secondary IOL engineered for ciliary sulcus placement to correct residual cylinder, spherical surprise, or presbyopic enhancement in pseudophakic patients.</p>
                          </div>
                        </div>
                      </li>

                      <li class="sv-row" data-open="false">
                        <button type="button" class="sv-row__btn" onclick="toggleIolAcc(this)">
                          <span class="sv-row__left">
                            <span class="sv-row__led" aria-hidden="true"></span>
                            <span class="sv-row__title">Micro-Incision Wound Sealing</span>
                          </span>
                          <span class="sv-row__plus" aria-hidden="true">+</span>
                        </button>
                        <div class="sv-row__panel">
                          <div class="sv-row__clip">
                            <p class="sv-row__desc">Ultra-smooth 1.65mm delivery eliminates incision stress and supports rapid self-sealing clear corneal wounds for speedy patient recovery.</p>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>

                <!-- ================= MOBILE VIEW (Stacked: Packshot Top, Content Below) ================= -->
                <div class="lg:hidden flex flex-col items-center justify-center w-full px-4 pt-16 pb-20 overflow-y-auto">
                  <div class="w-full max-w-sm aspect-square flex items-center justify-center mb-4">
                    <img id="iol-mobile-packshot" src="assets/img/packshots/emv_stage.png" alt="RayOne IOL" class="max-h-64 object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)]">
                  </div>
                  <div class="w-full max-w-md text-center">
                    <h2 id="iol-mobile-title" class="text-3xl font-extrabold text-white mb-1">RayOne&reg; EMV</h2>
                    <p id="iol-mobile-sub" class="text-xs text-sky font-semibold mb-3">Co-developed with Prof. Graham Barrett</p>
                    <p id="iol-mobile-desc" class="text-xs text-cream/75 leading-relaxed mb-4">
                      Non-diffractive extended depth of field IOL providing seamless intermediate and functional near vision without dysphotopsia.
                    </p>
                  </div>
                </div>

                <!-- Bottom Progress Rail (Exact Match to Reference Rail) -->
                <div class="sv-rail">
                  <button type="button" class="sv-rail__item" aria-current="true" onclick="jumpIolStage(0)">
                    <span class="sv-rail__label">01. RayOne&reg; EMV</span>
                    <div class="sv-rail__track"><div id="iol-fill-0" class="sv-rail__fill" style="transform: scaleX(1);"></div></div>
                  </button>

                  <button type="button" class="sv-rail__item" aria-current="false" onclick="jumpIolStage(1)">
                    <span class="sv-rail__label">02. RayOne&reg; Trifocal</span>
                    <div class="sv-rail__track"><div id="iol-fill-1" class="sv-rail__fill"></div></div>
                  </button>

                  <button type="button" class="sv-rail__item" aria-current="false" onclick="jumpIolStage(2)">
                    <span class="sv-rail__label">03. RayOne&reg; Aspheric</span>
                    <div class="sv-rail__track"><div id="iol-fill-2" class="sv-rail__fill"></div></div>
                  </button>
                </div>

              </div>
            </div>
          </div>

        </div>

        """

html = html[:s1_start] + new_slide_1 + html[s2_start:]

# 4. Bump script version to v=352.00 to force fresh cache
html = re.sub(r'src="assets/js/main\.js\?v=[\d\.]+"', 'src="assets/js/main.js?v=352.00"', html)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("Applied redesign to index.html successfully!")

