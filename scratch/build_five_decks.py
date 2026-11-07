from pathlib import Path
import re

# Helper to build a full-viewport multi-slide deck section matching About & Products
def build_deck_section(sec_id, sec_title_id, slides_html):
    return f'''    <!-- ============== {sec_id.upper()} MULTI-SLIDE DECK SECTION ============== -->
    <section id="{sec_id}" aria-labelledby="{sec_title_id}" class="page-snap-section page-transition-section relative isolate w-full h-[100svh] min-h-[100svh] max-h-[100svh] overflow-hidden bg-[#0a1d40] scroll-mt-0">

      <!-- Persistent Ambient MediQ Navy & Smoky Sky Background -->
      <div class="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-[#0a1d40]">
        <canvas id="{sec_id}-smoke-canvas" class="deck-smoke-canvas pointer-events-none absolute inset-0 z-[1] block size-full opacity-70" aria-hidden="true"></canvas>
        <div class="absolute -left-20 top-1/4 h-[36rem] w-[36rem] rounded-full bg-sky/15 blur-[160px]"></div>
        <div class="absolute right-0 top-1/3 h-[40rem] w-[40rem] rounded-full bg-[#11326c]/45 blur-[180px]"></div>
        <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(#3aa0db_1px,transparent_1px)] [background-size:24px_24px] opacity-15"></div>
      </div>

      <!-- Main Slides Container -->
      <div class="relative w-full h-full overflow-hidden">
{chr(10).join(slides_html)}
      </div>
    </section>'''


def build_overview_slide(deck_key, title_id, eyebrow, title_main, title_accent, subtitle, cards):
    """
    Slide 0: Overview page with 3 or 4 Notched / Glass Cards leading to subpages (just like Products Slide 0)
    """
    cols = "lg:grid-cols-3" if len(cards) == 3 else "lg:grid-cols-4"
    card_items = []
    for idx, c in enumerate(cards, start=1):
        num = f"0{idx}"
        card_items.append(f'''              <div onclick="if(window.goToDeckSlide){{window.goToDeckSlide('{deck_key}', {idx});}}" class="notched-card group">
                <div>
                  <div class="notched-img-box">
                    <img src="{c['img']}" alt="{c['title']}" class="{c.get('img_cls', 'object-cover !p-0')} group-hover:scale-105 transition-transform duration-500" loading="lazy">
                    <div class="absolute inset-0 bg-gradient-to-t from-[#071530]/70 via-transparent to-transparent pointer-events-none"></div>
                    <div class="notched-badge">{num}</div>
                    <span class="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-[#071530]/80 border border-sky/35 text-[10px] font-mono font-bold text-sky uppercase backdrop-blur">{c['tag']}</span>
                    <svg class="notched-svg-corner" viewBox="0 0 88 88">
                      <path d="M 88,0 C 88,14 74,24 60,24 C 40,24 24,40 24,60 C 24,74 14,88 0,88 L 88,88 Z" />
                    </svg>
                    <div class="notched-btn" style="background: linear-gradient(135deg, #3aa0db, #72c5f8); color: #071530;">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M7 17L17 7M17 7H7M17 7V17" />
                      </svg>
                    </div>
                  </div>
                  <div class="pt-3.5 px-1 pb-1">
                    <h3 class="text-base sm:text-lg font-bold text-white group-hover:text-sky transition-colors leading-snug">{c['title']}</h3>
                    <p class="text-xs text-cream/70 leading-relaxed mt-1 line-clamp-2">{c['desc']}</p>
                  </div>
                </div>
                <div class="pt-2.5 mt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-sky px-1">
                  <span>{c['meta']}</span>
                  <span class="group-hover:translate-x-1 transition-transform">Explore &rarr;</span>
                </div>
              </div>''')

    return f'''        <!-- SLIDE 0: {deck_key.upper()} OVERVIEW -->
        <div class="deck-slide absolute top-0 left-0 right-0 w-full h-[calc(100svh-4.5rem)] flex flex-col justify-center items-center px-4 sm:px-8 lg:px-12 py-4 transition-all duration-500 ease-out opacity-100 pointer-events-auto translate-x-0 z-10 overflow-y-auto" data-deck="{deck_key}" data-slide-index="0">
          <div class="relative z-10 w-full max-w-[1680px] mx-auto my-auto flex flex-col items-center">
            <div class="text-center max-w-3xl mx-auto mb-5 sm:mb-7">
              <p class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky/10 border border-sky/30 text-sky text-[11px] font-bold tracking-widest uppercase mb-2.5 shadow-[0_0_20px_rgba(58,160,219,0.2)]">
                <span>{eyebrow}</span>
                <span class="inline-block size-1.5 rounded-full bg-sky animate-ping"></span>
              </p>
              <h2 id="{title_id}" class="text-2xl sm:text-4xl lg:text-[42px] font-extrabold text-white tracking-tight leading-tight mb-2">
                {title_main} <span class="text-transparent bg-clip-text bg-gradient-to-r from-sky via-[#72c5f8] to-white">{title_accent}</span>
              </h2>
              <p class="text-xs sm:text-sm text-cream/75 leading-relaxed max-w-2xl mx-auto">
                {subtitle}
              </p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 {cols} gap-4 w-full">
{chr(10).join(card_items)}
            </div>
          </div>
        </div>'''


def build_grid_subslide(deck_key, slide_idx, total_slides, slide_names, header_prefix, header_accent, subtitle, badges, cards, cols_cls="lg:grid-cols-3 lg:grid-rows-[minmax(0,1fr)_minmax(0,1fr)]"):
    """
    Subpage Slide (1..N) using the exact space-maximizing layout of Medical Supplies & What We Do
    """
    prev_idx = slide_idx - 1
    prev_label = slide_names[prev_idx]
    next_idx = (slide_idx + 1) if (slide_idx + 1) < total_slides else 0
    next_label = slide_names[next_idx] if (slide_idx + 1) < total_slides else f"Back to {slide_names[0]}"

    badge_pills = "".join(
        f'<span class="px-2.5 py-0.5 rounded-full bg-sky/10 border border-sky/30 text-[9px] font-mono font-bold text-sky uppercase">{b}</span>'
        for b in badges
    )

    card_els = []
    for i, c in enumerate(cards, start=1):
        num = c.get("n", f"0{i}")
        cta_href = c.get("href", "#contact")
        cta_label = c.get("cta", "Inquire / Details")
        img_fit = c.get("img_fit", "object-cover")
        card_els.append(f'''              <div class="group relative rounded-2xl bg-[#0a1835]/80 border border-sky/25 hover:border-sky/55 p-3 shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 flex flex-col justify-between min-h-[210px] lg:min-h-0 overflow-hidden text-left">
                <span class="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-sky/60 to-transparent"></span>
                <span class="pointer-events-none absolute inset-x-8 bottom-0 h-px bg-gradient-to-r from-transparent via-sky/80 to-transparent shadow-[0_0_10px_rgba(58,160,219,0.7)]"></span>
                <div class="relative flex-1 min-h-[90px] w-full rounded-xl overflow-hidden mb-2 bg-radial from-[#153265] to-[#07132b]">
                  <img src="{c['img']}" alt="{c['title']}" class="absolute inset-0 h-full w-full {img_fit} group-hover:scale-105 transition-transform duration-700" loading="lazy">
                  <div class="absolute inset-0 bg-gradient-to-t from-[#071530]/80 via-transparent to-transparent"></div>
                  <span class="absolute top-2 left-2 text-[10px] font-mono font-bold text-white/90 bg-[#071530]/80 backdrop-blur px-2 py-0.5 rounded-md border border-sky/30">{num}</span>
                  <span class="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/55 backdrop-blur text-[9.5px] font-mono font-bold text-sky border border-sky/30 uppercase">{c['cat']}</span>
                  <span class="absolute bottom-2 left-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#071530]/85 border border-sky/40 backdrop-blur text-[10px] font-semibold"><span class="text-white/85 uppercase">{c['sl']}</span><span class="text-white/50">&bull;</span><span class="text-[#72c5f8]">{c['sv']}</span></span>
                </div>
                <div class="shrink-0">
                  <h3 class="text-sm sm:text-base font-bold text-white group-hover:text-sky transition-colors leading-snug truncate">{c['title']}</h3>
                  <p class="text-[11px] text-cream/70 leading-snug line-clamp-1 mt-0.5">{c['desc']}</p>
                  <div class="mt-2 pt-1.5 border-t border-white/10 flex items-center justify-between gap-2">
                    <span class="text-[10px] font-mono text-sky/90 uppercase tracking-wider truncate">{c['cat']}</span>
                    <a href="{cta_href}" onclick="if('{cta_href}'.startsWith('#')){{window.navigateToSection && window.navigateToSection('{cta_href}');}}" class="shrink-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-sky/15 hover:bg-sky text-sky hover:text-[#0a1d40] border border-sky/30 text-[11px] font-bold transition-all cursor-pointer">
                      <span>{cta_label}</span>
                      <svg class="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m9 18 6-6-6-6"/></svg>
                    </a>
                  </div>
                </div>
              </div>''')

    return f'''        <!-- SLIDE {slide_idx}: {header_prefix} - {header_accent} -->
        <div class="deck-slide absolute top-0 left-0 right-0 w-full h-[calc(100svh-4.5rem)] flex flex-col bg-transparent text-cream px-4 sm:px-8 lg:px-12 pt-3.5 pb-4 overflow-y-auto lg:overflow-hidden transition-all duration-500 ease-out opacity-0 pointer-events-none translate-x-12 z-0" data-deck="{deck_key}" data-slide-index="{slide_idx}">
          <div class="relative z-20 w-full max-w-[1680px] mx-auto h-full flex flex-col">

            <!-- Top Pill Navigation Bar -->
            <div class="flex items-center justify-between gap-3 mb-2 shrink-0">
              <div class="flex flex-wrap items-center gap-2">
                <button type="button" onclick="if(window.goToDeckSlide){{window.goToDeckSlide('{deck_key}', 0);}}" class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-cream/90 hover:text-white transition-all cursor-pointer backdrop-blur-md">
                  <svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m15 18-6-6 6-6"/></svg>
                  <span>{slide_names[0]}</span>
                </button>
                {f"""<button type="button" onclick="if(window.goToDeckSlide){{window.goToDeckSlide('{deck_key}', {prev_idx});}}" class="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-cream/90 hover:text-white transition-all cursor-pointer backdrop-blur-md">
                  <svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m15 18-6-6 6-6"/></svg>
                  <span>{prev_label}</span>
                </button>""" if prev_idx != 0 else ""}
              </div>
              <button type="button" onclick="if(window.goToDeckSlide){{window.goToDeckSlide('{deck_key}', {next_idx});}}" class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-cream/90 hover:text-white transition-all cursor-pointer backdrop-blur-md group">
                <span>{next_label}</span>
                <svg class="size-3.5 group-hover:translate-x-0.5 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m9 18 6-6-6-6"/></svg>
              </button>
            </div>

            <!-- Compact Header Row -->
            <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-2.5 shrink-0">
              <div>
                <h3 class="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight leading-none">
                  {header_prefix} &bull; <span class="text-sky">{header_accent}</span>
                </h3>
                <p class="text-[11px] sm:text-xs text-cream/70 mt-1 max-w-2xl">
                  {subtitle}
                </p>
              </div>
              <div class="hidden sm:flex flex-wrap gap-2">
                {badge_pills}
              </div>
            </div>

            <!-- Maximized Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 {cols_cls} gap-3.5 flex-1 min-h-0">
{chr(10).join(card_els)}
            </div>
          </div>
        </div>'''


# ==============================================================================
# 1. BRANDS & PARTNERS DECK (#brands)
# Slides: 0=Overview, 1=Principal Brands, 2=Brand Profiles, 3=Downloadable Brochures
# ==============================================================================
brands_names = ["Brands Overview", "Principal Brands", "Brand Profiles", "Downloadable Brochures"]
brands_slides = [
    build_overview_slide(
        deck_key="brands",
        title_id="brands-title",
        eyebrow="BRANDS & PARTNERS • GLOBAL OPHTHALMIC PRINCIPALS",
        title_main="World-Class Medical",
        title_accent="Principals & Alliances",
        subtitle="Exclusive Philippine representation for Rayner Intraocular Lenses Ltd. (UK) and premier ophthalmic surgical innovations.",
        cards=[
            {
                "title": "Principal Brands",
                "tag": "EXCLUSIVE UK PARTNER",
                "img": "assets/img/packshots/authentic_emv.png?v=370.00",
                "img_cls": "object-contain p-4",
                "desc": "Rayner Intraocular Lenses UK, Ophteis® bio-engineered viscoelastics, AEON® ocular surface suite, and surgical equipment.",
                "meta": "4 Core Brand Families"
            },
            {
                "title": "Brand Profiles",
                "tag": "CLINICAL HERITAGE",
                "img": "assets/img/pillars/p2_headquarters_brand.jpg",
                "desc": "Discover Rayner's 1949 Sir Harold Ridley heritage, Worthing UK manufacturing precision, and RayAcryl® material science.",
                "meta": "75+ Years IOL Heritage"
            },
            {
                "title": "Downloadable Brochures",
                "tag": "DIGITAL MONOGRAPHS",
                "img": "assets/brochure/mobile_1.jpg",
                "desc": "Access clinical monographs, dioptre specifications, A-constant charts, and surgical reference guides.",
                "meta": "6 Clinical Catalogs"
            },
        ]
    ),
    build_grid_subslide(
        deck_key="brands", slide_idx=1, total_slides=4, slide_names=brands_names,
        header_prefix="Brands &amp; Partners", header_accent="Principal Brands Portfolio",
        subtitle="Authorized Philippine distribution of globally recognized ophthalmic lenses, viscoelastics, and surgical systems.",
        badges=["RAYNER UK EXCLUSIVE", "100% FDA REGISTERED"],
        cards=[
            {"cat": "INTRAOCULAR LENSES", "title": "RayOne® Spiral & EDOF Optics", "img": "assets/img/packshots/authentic_emv.png?v=370.00", "img_fit": "object-contain p-3", "sl": "Origin", "sv": "Worthing, UK", "desc": "RayOne® Galaxy spiral AI, EMV enhanced monofocal, Trifocal, and Aspheric preloaded IOL platforms.", "href": "#products"},
            {"cat": "SUPPLEMENTARY IOLS", "title": "Sulcoflex® Pseudophakic Suite", "img": "assets/img/packshots/authentic_sulcoflex.png?v=370.00", "img_fit": "object-contain p-3", "sl": "Platform", "sv": "Ciliary Sulcus", "desc": "Reversible supplementary sulcus lenses for post-cataract refractive refinement and duet procedures.", "href": "#products"},
            {"cat": "VISCOSURGICAL OVDS", "title": "Ophteis® Bio-Engineered OVDs", "img": "assets/img/packshots/ophteis_adaptive.png?v=370.00", "img_fit": "object-contain p-3", "sl": "Antioxidant", "sv": "NaHA + Sorbitol", "desc": "Ophteis® FR Pro free-radical scavenging, Cohesive Max, and Dispersive Bio endothelial shields.", "href": "#products"},
            {"cat": "OCULAR SURFACE CARE", "title": "AEON® Peri-Operative Drops", "img": "assets/img/packshots/aeon_protect_plus.png?v=370.00", "img_fit": "object-contain p-3", "sl": "Formulation", "sv": "Preservative-Free", "desc": "Cross-linked sodium hyaluronate eye care built specifically for pre- and post-cataract surgery.", "href": "#products"},
            {"cat": "DIGITAL PROMS", "title": "RayPRO® Patient Outcomes", "img": "assets/img/pillars/p3_specialist_discussion.jpg", "sl": "Analytics", "sv": "3-Year Tracking", "desc": " real-world patient-reported outcome measures platform for partner ophthalmic clinics nationwide.", "href": "#contact"},
            {"cat": "SURGICAL PLANNING", "title": "RayTrace® Toric & EDOF Calculator", "img": "assets/img/pillars/p6_quality_metrology.jpg", "sl": "Precision", "sv": "Barrett Suite", "desc": "Cloud-based spherical, toric, and EMV monovision offset biometry calculation platform.", "href": "#contact"},
        ]
    ),
    build_grid_subslide(
        deck_key="brands", slide_idx=2, total_slides=4, slide_names=brands_names,
        header_prefix="Brands &amp; Partners", header_accent="Brand Profiles &amp; Engineering",
        subtitle="Engineering benchmarks behind our principal manufacturers and their clinical validation worldwide.",
        badges=["WORTHING UK R&D", "ZERO GLISTENINGS"],
        cards=[
            {"cat": "HERITAGE", "title": "Pioneers Since 1949 (Sir Harold Ridley)", "img": "assets/img/pillars/p2_headquarters_brand.jpg", "sl": "Milestone", "sv": "World's 1st IOL", "desc": "Rayner manufactured the world's very first intraocular lens in 1949 and remains the only UK IOL manufacturer."},
            {"cat": "MATERIAL SCIENCE", "title": "RayAcryl® Hydrophilic-Behaving Copolymer", "img": "assets/img/pillars/p1_cleanroom_inspect.jpg", "sl": "Clarity", "sv": "Zero Glistenings", "desc": "Low refractive index (1.46) and <1% glistening-free optical purity with superior Abbe number (56)."},
            {"cat": "HAPTIC STABILITY", "title": "Anti-Vaulting Technology (AVT) Haptics", "img": "assets/img/packshots/authentic_emv_toric.png?v=370.00", "img_fit": "object-contain p-3", "sl": "Rotational", "sv": "< 1.8° Mean Shift", "desc": "Closed-loop C-flex haptics conform smoothly to the capsular bag for exceptional centration and toric stability."},
            {"cat": "DELIVERY SYSTEM", "title": "Lock & Roll™ 1.65mm Preloaded Injector", "img": "assets/img/pillars/p5_theatre_wetlab.jpg", "sl": "Nozzle Tip", "sv": "1.65 mm MICS", "desc": "2-step preloaded system delivers consistent single-handed implantation through sub-2.2mm incisions."},
            {"cat": "UK MANUFACTURING", "title": "Worthing, West Sussex Cleanroom Hub", "img": "assets/img/pillars/p6_quality_metrology.jpg", "sl": "Capacity", "sv": "2M+ IOLs / Year", "desc": "100% British-engineered and inspected in state-of-the-art ISO Class 5 cleanrooms in the United Kingdom."},
            {"cat": "PHILIPPINE ALLIANCE", "title": "MediQ Exclusive National Stewardship", "img": "assets/img/pillars/p6_lot_traceability.jpg", "sl": "Coverage", "sv": "17 PH Regions", "desc": "Dedicated cold-chain logistics, FDA compliance, and OR specialist coverage across the Philippines."},
        ]
    ),
    build_grid_subslide(
        deck_key="brands", slide_idx=3, total_slides=4, slide_names=brands_names,
        header_prefix="Brands &amp; Partners", header_accent="Downloadable Brochures &amp; Catalogs",
        subtitle="Inspect and download official clinical monographs, surgical guides, and product catalogs.",
        badges=["INTERACTIVE READER", "PDF MONOGRAPHS"],
        cards=[
            {"cat": "SPIRAL OPTICS", "title": "RayOne® Galaxy & Galaxy Toric Monograph", "img": "assets/brochure/mobile_1.jpg", "sl": "Format", "sv": "Interactive / PDF", "desc": "Complete optical bench data, defocus curves, and clinical outcomes for the world's first spiral IOL.", "href": "https://mediqvision.com/mobile/index.html", "cta": "Open Brochure"},
            {"cat": "ENHANCED MONOFOCAL", "title": "RayOne® EMV & EMV Toric Clinical Guide", "img": "assets/brochure/mobile_2.jpg", "sl": "Co-Author", "sv": "Prof. G. Barrett", "desc": "Positive spherical aberration profile, emmetropia & enhanced monovision offset nomograms.", "href": "https://mediqvision.com/mobile/index.html", "cta": "Open Brochure"},
            {"cat": "TRIFOCAL SUITE", "title": "RayOne® Trifocal & Toric Compendium", "img": "assets/brochure/mobile_3.jpg", "sl": "Transmission", "sv": "89% Retinal Light", "desc": "16-ring diffractive optic architecture and patient selection criteria for full visual range.", "href": "https://mediqvision.com/mobile/index.html", "cta": "Open Brochure"},
            {"cat": "VISCOELASTICS", "title": "Ophteis® OVD Rheology & Sorbitol Dossier", "img": "assets/img/packshots/ophteis_cohesive.png?v=370.00", "img_fit": "object-contain p-3", "sl": "Protection", "sv": "Endothelial Shield", "desc": "Comparative viscosity curves, free-radical scavenging data, and chamber maintenance specs.", "href": "#contact", "cta": "Request PDF"},
            {"cat": "DRY EYE PROTOCOL", "title": "AEON® Ocular Surface Care Formulary", "img": "assets/img/packshots/aeon_protect.png?v=370.00", "img_fit": "object-contain p-3", "sl": "Protocol", "sv": "Pre & Post-Op", "desc": "Clinical dosing guidelines for AEON Protect, Protect Plus, Repair, and NaCl 5% hypertonic drops.", "href": "#contact", "cta": "Request PDF"},
            {"cat": "FULL PORTFOLIO", "title": "MediQ 2026 Hospital Procurement Catalog", "img": "assets/img/packshots/aeon_repair.png?v=370.00", "img_fit": "object-contain p-3", "sl": "Edition", "sv": "2026 PH Master", "desc": "Complete dioptre ranges, A-constants, SKU codes, and hospital consignment ordering guide.", "href": "#contact", "cta": "Request Copy"},
        ]
    ),
]


# ==============================================================================
# 2. SERVICES DECK (#distribution)
# Slides: 0=Overview, 1=Distribution, 2=Product Support, 3=Training & Education, 4=Customer Service
# ==============================================================================
services_names = ["Services Overview", "Distribution", "Product Support", "Training & Education", "Customer Service"]
services_slides = [
    build_overview_slide(
        deck_key="services",
        title_id="distribution-title",
        eyebrow="SERVICES • END-TO-END CLINICAL & LOGISTICS SUPPORT",
        title_main="Precision Services for",
        title_accent="Every Operating Room",
        subtitle="From GDP-certified cold-chain distribution and hospital dioptre consignment to in-theatre biometry support and surgeon education.",
        cards=[
            {
                "title": "Distribution",
                "tag": "NATIONWIDE COLD-CHAIN",
                "img": "assets/img/pillars/p1_cleanroom_inspect.jpg",
                "desc": "Validated cold-chain logistics, cleanroom dioptre reserves, and hospital consignment banks across 17 regions.",
                "meta": "< 24–48 Hr Dispatch"
            },
            {
                "title": "Product Support",
                "tag": "IN-THEATRE SPECIALISTS",
                "img": "assets/img/pillars/p3_specialist_discussion.jpg",
                "desc": "Dedicated surgical specialists for RayTrace® toric calculations, A-constant optimization, and injector priming.",
                "meta": "On-Site OR Support"
            },
            {
                "title": "Training & Education",
                "tag": "WET-LABS & SYMPOSIA",
                "img": "assets/img/pillars/p5_theatre_wetlab.jpg",
                "desc": "Hands-on phaco & IOL wet-labs, Peer2Peer roundtables, OR nurse Lock & Roll™ certification, and RayPRO® setup.",
                "meta": "500+ Surgeons Trained"
            },
            {
                "title": "Customer Service",
                "tag": "24/7 SURGICAL SLA",
                "img": "assets/img/pillars/p6_lot_traceability.jpg",
                "desc": "Priority surgical case coordination, automated consignment replenishment, and full FDA batch traceability.",
                "meta": "99.8% On-Time SLA"
            },
        ]
    ),
    build_grid_subslide(
        deck_key="services", slide_idx=1, total_slides=5, slide_names=services_names,
        header_prefix="Services", header_accent="Nationwide Distribution &amp; Cold-Chain",
        subtitle="End-to-end inventory readiness and temperature-controlled delivery across Luzon, Visayas, and Mindanao.",
        badges=["17 REGIONS REACH", "GDP CERTIFIED"],
        cards=[
            {"cat": "CONSIGNMENT BANKS", "title": "Hospital Dioptre & Toric Consignment", "img": "assets/img/pillars/p1_cleanroom_inspect.jpg", "sl": "Dioptre Bank", "sv": "+6.0D to +30.0D", "desc": "Customized in-hospital sphere and toric IOL banks with automated 24-hour post-case replenishment."},
            {"cat": "COLD-CHAIN", "title": "Thermal-Mapped Storage & Transit", "img": "assets/img/pillars/p6_quality_metrology.jpg", "sl": "Monitoring", "sv": "24/7 Digital Log", "desc": "Continuous temperature and humidity telemetry from UK port-of-entry to hospital operating rooms."},
            {"cat": "METRO MANILA", "title": "Same-Day NCR Surgical Courier", "img": "assets/img/pillars/p2_headquarters_brand.jpg", "sl": "NCR Turnaround", "sv": "< 4 Hours Urgent", "desc": "Rapid motorcycle and cold-van fleet serving tertiary hospitals and eye centers across Metro Manila."},
            {"cat": "LUZON NETWORK", "title": "North & South Luzon Regional Hubs", "img": "assets/img/pillars/p3_specialist_discussion.jpg", "sl": "Coverage", "sv": "Regions I–V & CAR", "desc": "Scheduled and emergency air/land dispatch covering Pampanga, Baguio, Batangas, Laguna, and Bicol."},
            {"cat": "VISAYAS & MINDANAO", "title": "Cebu, Iloilo & Davao Air-Freight Corridor", "img": "assets/img/pillars/p6_lot_traceability.jpg", "sl": "Inter-Island", "sv": "24–48 Hr Air Cargo", "desc": "Priority airport-to-OR logistics serving major ophthalmic centers in Cebu, Iloilo, Bacolod, Davao, and CDO."},
            {"cat": "TRACEABILITY", "title": "100% Serial & Lot Batch Verification", "img": "assets/img/pillars/p5_theatre_wetlab.jpg", "sl": "Audit Trail", "sv": "FDA CDRR Compliant", "desc": "Every lens and viscoelastic syringe is barcode-tracked by serial, lot, and sterile expiry date."},
        ]
    ),
    build_grid_subslide(
        deck_key="services", slide_idx=2, total_slides=5, slide_names=services_names,
        header_prefix="Services", header_accent="Clinical &amp; Surgical Product Support",
        subtitle="Trained ophthalmic product specialists working directly alongside surgeons and OR nursing teams.",
        badges=["RAYTRACE BIOMETRY", "OR IN-SERVICING"],
        cards=[
            {"cat": "BIOMETRY", "title": "RayTrace® Online Toric & EMV Calculation", "img": "assets/img/pillars/p3_specialist_discussion.jpg", "sl": "Calculator", "sv": "Barrett Toric", "desc": "Pre-operative calculation assistance for astigmatism axis alignment and Enhanced Monovision offsets."},
            {"cat": "A-CONSTANTS", "title": "Biometer A-Constant Optimization", "img": "assets/img/pillars/p6_quality_metrology.jpg", "sl": "Calibration", "sv": "IOLMaster & Lenstar", "desc": "Custom optical and ultrasound biometry constant verification for RayOne® Galaxy, EMV, and Trifocal."},
            {"cat": "IN-THEATRE", "title": "Lock & Roll™ Injector Priming Support", "img": "assets/img/pillars/p5_theatre_wetlab.jpg", "sl": "Protocol", "sv": "2-Step Priming", "desc": "Chairside guidance for scrub nurses on OVD priming and smooth sub-2.2mm nozzle delivery."},
            {"cat": "REFRACTIVE", "title": "Sulcoflex® Duet & Piggyback Planning", "img": "assets/img/packshots/authentic_sulcoflex.png?v=370.00", "img_fit": "object-contain p-3", "sl": "Sulcus Calc", "sv": "Residual Error Fix", "desc": "Specialized power calculation support for supplementary sulcus implantation and refractive surprises."},
            {"cat": "OCULAR SURFACE", "title": "Peri-Operative AEON® Dry-Eye Integration", "img": "assets/img/packshots/aeon_protect_plus.png?v=370.00", "img_fit": "object-contain p-3", "sl": "Regimen", "sv": "Pre/Post Cataract", "desc": "Standardized tear-film optimization protocols to improve pre-op biometry accuracy and post-op comfort."},
            {"cat": "PROMS PLATFORM", "title": "Complimentary RayPRO® Clinic Onboarding", "img": "assets/img/pillars/p2_headquarters_brand.jpg", "sl": "Subscription", "sv": "100% Free to Partner", "desc": "Full clinic setup on the RayPRO® mobile/web app to collect automated 3-year patient satisfaction data."},
        ]
    ),
    build_grid_subslide(
        deck_key="services", slide_idx=3, total_slides=5, slide_names=services_names,
        header_prefix="Services", header_accent="Clinical Training &amp; Surgical Education",
        subtitle="Empowering Filipino ophthalmologists, fellows, residents, and OR nurses through hands-on education.",
        badges=["WET-LAB COURSES", "PEER2PEER CME"],
        cards=[
            {"cat": "WET-LABS", "title": "Hands-On Phaco & Preloaded IOL Wet-Labs", "img": "assets/img/pillars/p5_theatre_wetlab.jpg", "sl": "Simulation", "sv": "Model Eye & Porcine", "desc": "Supervised micro-incision Lock & Roll™ implantation and OVD rheology workshops for residents and fellows."},
            {"cat": "PEER2PEER", "title": "Rayner Peer2Peer Scientific Roundtables", "img": "assets/img/pillars/p3_specialist_discussion.jpg", "sl": "Faculty", "sv": "UK & PH Key Leaders", "desc": "Case-based clinical discussions on spiral optics, EDOF monovision, and complex toric cataract cases."},
            {"cat": "OR NURSING", "title": "Scrub Nurse Injector & OVD Accreditation", "img": "assets/img/pillars/p1_cleanroom_inspect.jpg", "sl": "Training", "sv": "Hospital In-Service", "desc": "Step-by-step hands-on certification for operating room nurses on sterile cartridge preparation."},
            {"cat": "RESIDENCY CME", "title": "Ophthalmology Residency Training Modules", "img": "assets/img/pillars/p2_headquarters_brand.jpg", "sl": "Institutions", "sv": "30+ Training Depts", "desc": "Didactic lectures on IOL material science, dysphotopsia prevention, and biometry fundamentals."},
            {"cat": "PATIENT COUNSELING", "title": "Clinic Patient Education & Visual Aids", "img": "assets/img/pillars/p6_quality_metrology.jpg", "sl": "Materials", "sv": "Flipcharts & Models", "desc": "3D anatomical eye models, defocus visual simulators, and bilingual patient counseling brochures."},
            {"cat": "LIVE SURGERY", "title": "Surgical Video Library & Case Audits", "img": "assets/img/pillars/p6_lot_traceability.jpg", "sl": "4K Archive", "sv": "RayOne Galaxy & EMV", "desc": "Curated 4K microscope recordings demonstrating pearls for capsule polishing and toric alignment."},
        ]
    ),
    build_grid_subslide(
        deck_key="services", slide_idx=4, total_slides=5, slide_names=services_names,
        header_prefix="Services", header_accent="Customer Service &amp; Institutional Care",
        subtitle="Responsive account management, priority case dispatch, and post-market quality assurance.",
        badges=["24/7 PRIORITY DESK", "DEDICATED ACCOUNT TEAM"],
        cards=[
            {"cat": "CASE DESK", "title": "Priority Surgical Case Booking Desk", "img": "assets/img/pillars/p3_specialist_discussion.jpg", "sl": "Response Time", "sv": "< 15 Minutes", "desc": "Direct Viber, phone, and email booking desk for scheduled cataract lists and add-on toric cases."},
            {"cat": "REPLENISHMENT", "title": "Automated Consignment Par-Level Audits", "img": "assets/img/pillars/p1_cleanroom_inspect.jpg", "sl": "Inventory", "sv": "Zero Stock-Outs", "desc": "Monthly physical and digital reconciliation of hospital consignment banks with proactive expiry rotation."},
            {"cat": "PROCUREMENT", "title": "Hospital Bidding & Accreditation Desk", "img": "assets/img/pillars/p2_headquarters_brand.jpg", "sl": "Documentation", "sv": "Complete Legal & FDA", "desc": "Dedicated institutional team handling PhilGEPS, DOH, and private hospital vendor accreditation."},
            {"cat": "QUALITY ASSURANCE", "title": "Post-Market Surveillance & Vigilance", "img": "assets/img/pillars/p6_quality_metrology.jpg", "sl": "ISO / GDP", "sv": "100% Traceable", "desc": "Direct manufacturer feedback channel with Rayner UK QA engineers and regulatory affairs."},
            {"cat": "DIRECT CHANNELS", "title": "Omnichannel Surgeon Support (Viber/TG)", "img": "assets/img/pillars/p6_lot_traceability.jpg", "sl": "Availability", "sv": "Mon–Sat + Urgent OR", "desc": "Instant messaging support for dioptre availability checks, A-constants, and delivery tracking."},
            {"cat": "PARTNER PORTAL", "title": "Institutional Account & Billing Support", "img": "assets/img/pillars/p5_theatre_wetlab.jpg", "sl": "Terms", "sv": "Flexible Hospital SLA", "desc": "Streamlined invoicing, consignment usage statements, and clinic account reconciliation."},
        ]
    ),
]


# ==============================================================================
# 3. RESOURCES DECK (#resources)
# Slides: 0=Overview, 1=Downloads, 2=FAQs, 3=Regulatory Information, 4=Media Library
# ==============================================================================
resources_names = ["Resources Overview", "Downloads", "FAQs", "Regulatory Information", "Media Library"]
resources_slides = [
    build_overview_slide(
        deck_key="resources",
        title_id="resources-title",
        eyebrow="RESOURCES • CLINICAL & REGULATORY KNOWLEDGE HUB",
        title_main="Clinical Documentation &",
        title_accent="Surgeon Resources",
        subtitle="Access technical specification sheets, surgeon FAQs, Philippine FDA regulatory certifications, and surgical media.",
        cards=[
            {
                "title": "Downloads",
                "tag": "SPEC SHEETS & GUIDES",
                "img": "assets/brochure/mobile_1.jpg",
                "desc": "Download A-constant tables, dioptre range matrices, Lock & Roll™ priming charts, and clinical monographs.",
                "meta": "12+ Technical Files"
            },
            {
                "title": "FAQs",
                "tag": "CLINICAL & PROCUREMENT",
                "img": "assets/img/pillars/p3_specialist_discussion.jpg",
                "desc": "Answers to common questions on RayOne® Galaxy/EMV selection, consignment setup, and cold-chain delivery.",
                "meta": "6 Key Topic Areas"
            },
            {
                "title": "Regulatory Information",
                "tag": "FDA & ISO COMPLIANCE",
                "img": "assets/img/pillars/p6_quality_metrology.jpg",
                "desc": "Philippine FDA CDRR registration certificates, UK CE/ISO 13485 accreditations, and GDP compliance.",
                "meta": "100% Audit Ready"
            },
            {
                "title": "Media Library",
                "tag": "4K SURGICAL VIDEOS",
                "img": "assets/img/pillars/p5_theatre_wetlab.jpg",
                "desc": "High-definition surgical implantation videos, 3D optical animations, and wet-lab educational reels.",
                "meta": "HD Video & Visuals"
            },
        ]
    ),
    build_grid_subslide(
        deck_key="resources", slide_idx=1, total_slides=5, slide_names=resources_names,
        header_prefix="Resources", header_accent="Downloads &amp; Technical Specifications",
        subtitle="Official surgeon reference charts, biometry constants, and product specification sheets.",
        badges=["BIOMETRY CONSTANTS", "SURGICAL CHARTS"],
        cards=[
            {"cat": "BIOMETRY CHART", "title": "RayOne® Master A-Constant & IOLMaster Table", "img": "assets/brochure/mobile_1.jpg", "sl": "Biometers", "sv": "Optical & US", "desc": "Optimized SRK/T, Haigis, Holladay, and Barrett Universal II constants for all RayOne® platforms.", "href": "https://mediqvision.com/mobile/index.html", "cta": "Download"},
            {"cat": "SPIRAL IOL DATA", "title": "RayOne® Galaxy Clinical & Optical Bench Whitepaper", "img": "assets/brochure/mobile_2.jpg", "sl": "Technology", "sv": "AI Spiral Optic", "desc": "Peer-reviewed MTF bench metrics, halo/glare comparison, and binocular defocus curves.", "href": "https://mediqvision.com/mobile/index.html", "cta": "Download"},
            {"cat": "MONOVISION GUIDE", "title": "RayOne® EMV Enhanced Monovision Nomogram", "img": "assets/brochure/mobile_3.jpg", "sl": "Target Offset", "sv": "-0.75D to -1.25D", "desc": "Step-by-step surgical targeting guide co-developed with Prof. Graham Barrett for spectacle independence.", "href": "https://mediqvision.com/mobile/index.html", "cta": "Download"},
            {"cat": "OR WALL CHART", "title": "Lock & Roll™ 2-Step Priming Wall Poster", "img": "assets/img/pillars/p5_theatre_wetlab.jpg", "sl": "OR Reference", "sv": "Printable A3/A4", "desc": "Visual operating-room priming and nozzle orientation chart for scrub nurses and residents.", "href": "#contact", "cta": "Request File"},
            {"cat": "OVD MATRIX", "title": "Ophteis® Viscoelastic Rheology Selection Guide", "img": "assets/img/packshots/ophteis_adaptive.png?v=370.00", "img_fit": "object-contain p-3", "sl": "Comparison", "sv": "FR Pro / Max / Bio", "desc": "Molecular weight, zero-shear viscosity, and pseudoplasticity chart for complex cataract cases.", "href": "#contact", "cta": "Request File"},
            {"cat": "DRY EYE CHART", "title": "AEON® Peri-Operative Dosing Algorithm", "img": "assets/img/packshots/aeon_protect_plus.png?v=370.00", "img_fit": "object-contain p-3", "sl": "Clinical Chart", "sv": "DEWS II Aligned", "desc": "Chairside selection guide matching AEON formulations to dry-eye severity and post-op recovery.", "href": "#contact", "cta": "Request File"},
        ]
    ),
    build_grid_subslide(
        deck_key="resources", slide_idx=2, total_slides=5, slide_names=resources_names,
        header_prefix="Resources", header_accent="Frequently Asked Questions (FAQs)",
        subtitle="Key clinical, logistical, and procurement answers for ophthalmologists and hospital administrators.",
        badges=["SURGEON FAQS", "CONSIGNMENT FAQS"],
        cards=[
            {"cat": "OPTICAL DESIGN", "title": "How does RayOne® Galaxy eliminate diffractive rings?", "img": "assets/img/packshots/authentic_emv.png?v=370.00", "img_fit": "object-contain p-3", "sl": "Optic", "sv": "Continuous Spiral", "desc": "AI-designed continuous spiral surface elongates focus smoothly with 0% diffractive light loss and monofocal-like halo profile."},
            {"cat": "PATIENT SELECTION", "title": "When should I choose RayOne® EMV vs Galaxy?", "img": "assets/img/packshots/authentic_emv_toric.png?v=370.00", "img_fit": "object-contain p-3", "sl": "Indication", "sv": "EDOF vs Full Range", "desc": "EMV excels for distance + intermediate or enhanced monovision; Galaxy provides full continuous range down to near."},
            {"cat": "CONSIGNMENT", "title": "How do hospitals set up a MediQ IOL consignment bank?", "img": "assets/img/pillars/p1_cleanroom_inspect.jpg", "sl": "Setup Time", "sv": "3–5 Business Days", "desc": "Submit your clinic's monthly case volume; MediQ customizes a dioptre bank with automated post-surgery replenishment."},
            {"cat": "DELIVERY SLA", "title": "How fast can special Toric powers be delivered?", "img": "assets/img/pillars/p6_lot_traceability.jpg", "sl": "Dispatch", "sv": "Same-Day / 24–48h", "desc": "Stock toric cylinders ship same-day in NCR and within 24–48 hours via air cargo to Luzon, Visayas, and Mindanao."},
            {"cat": "INCISION SIZE", "title": "What incision size does the RayOne® injector require?", "img": "assets/img/pillars/p5_theatre_wetlab.jpg", "sl": "Nozzle Outer", "sv": "1.65 mm Tip", "desc": "The parallel-sided 1.65mm nozzle enables effortless, wound-assisted delivery through a 2.2mm micro-incision."},
            {"cat": "RAYPRO APP", "title": "Is there any cost to enroll our clinic in RayPRO®?", "img": "assets/img/pillars/p3_specialist_discussion.jpg", "sl": "Clinic Fee", "sv": "PHP 0 (Complimentary)", "desc": "MediQ provides complimentary RayPRO® onboarding and QR registration cards for all partner Rayner surgeons."},
        ]
    ),
    build_grid_subslide(
        deck_key="resources", slide_idx=3, total_slides=5, slide_names=resources_names,
        header_prefix="Resources", header_accent="Regulatory Information &amp; Quality Compliance",
        subtitle="Full statutory compliance with the Philippine FDA, Department of Health, and international medical device standards.",
        badges=["PH FDA REGISTERED", "ISO 13485 & CE"],
        cards=[
            {"cat": "PHILIPPINE FDA", "title": "FDA License to Operate (LTO) & CDRR Certificates", "img": "assets/img/pillars/p6_quality_metrology.jpg", "sl": "Status", "sv": "Active & Verified", "desc": "Licensed Medical Device Importer & Wholesaler under the Philippine FDA Center for Device Regulation."},
            {"cat": "GOOD DISTRIBUTION", "title": "GDP-Compliant Cold-Chain & Cleanroom Storage", "img": "assets/img/pillars/p1_cleanroom_inspect.jpg", "sl": "Standard", "sv": "WHO / FDA GDP", "desc": "Calibrated temperature sensors, backup power redundancy, and pest/humidity controls across storage hubs."},
            {"cat": "UK & EU STANDARDS", "title": "CE Mark, UKCA & ISO 13485:2016 Accreditation", "img": "assets/img/pillars/p2_headquarters_brand.jpg", "sl": "Manufacturer", "sv": "Rayner UK Certified", "desc": "All Rayner IOLs and OVDs are manufactured under strict EU MDR / UKCA and ISO 13485 quality systems."},
            {"cat": "TRACEABILITY", "title": "UDI Barcode & Lot Recall Readiness Protocol", "img": "assets/img/pillars/p6_lot_traceability.jpg", "sl": "Tracking", "sv": "100% Serialized", "desc": "End-to-end Unique Device Identification (UDI) logging from Worthing UK factory to patient implant card."},
            {"cat": "VIGILANCE", "title": "Post-Market Surveillance & Adverse Event Reporting", "img": "assets/img/pillars/p3_specialist_discussion.jpg", "sl": "Compliance", "sv": "24-Hr QA Escalation", "desc": "Dedicated Regulatory Affairs Officer coordinating statutory pharmacovigilance and device surveillance."},
            {"cat": "HOSPITAL VENDOR", "title": "Complete Institutional Accreditation Dossier", "img": "assets/img/pillars/p5_theatre_wetlab.jpg", "sl": "Procurement", "sv": "Ready on Request", "desc": "Tax clearance, SEC registration, mayor's permits, CPRs, and authorized distributorship certificates."},
        ]
    ),
    build_grid_subslide(
        deck_key="resources", slide_idx=4, total_slides=5, slide_names=resources_names,
        header_prefix="Resources", header_accent="Surgical Media &amp; Video Library",
        subtitle="Explore 4K microscope surgical recordings, optical simulations, and Lock & Roll™ training videos.",
        badges=["4K SURGICAL REELS", "3D SIMULATIONS"],
        cards=[
            {"cat": "SPIRAL IOL VIDEO", "title": "RayOne® Galaxy First-in-Eye Surgical Implantation", "img": "assets/img/pillars/p5_theatre_wetlab.jpg", "sl": "Duration", "sv": "04:15 • 4K UHD", "desc": "Microscope footage demonstrating Lock & Roll™ priming, sub-2.2mm delivery, and spiral optic centration.", "href": "#hero", "cta": "Watch Preview"},
            {"cat": "3D SIMULATOR", "title": "Interactive 9-Stage Injector Delivery Simulation", "img": "assets/img/pillars/p6_quality_metrology.jpg", "sl": "Engine", "sv": "Real-Time WebGL", "desc": "Step through carton unboxing, OVD priming, Lock & Roll™ folding, and nozzle implantation in 360°.", "href": "#products", "cta": "Explore 3D"},
            {"cat": "BARRETT EMV", "title": "Prof. Graham Barrett on Positive Aberration EDOF", "img": "assets/img/pillars/p3_specialist_discussion.jpg", "sl": "Keynote", "sv": "06:40 • Clinical", "desc": "Optical principles behind RayOne® EMV and how enhanced monovision achieves seamless intermediate vision."},
            {"cat": "OVD RHEOLOGY", "title": "Ophteis® FR Pro Free-Radical Scavenging Demo", "img": "assets/img/packshots/ophteis_adaptive.png?v=370.00", "img_fit": "object-contain p-3", "sl": "Lab Film", "sv": "03:20 • Endothelial", "desc": "High-speed camera comparison showing cohesive chamber stability and Sorbitol antioxidant protection."},
            {"cat": "TORIC ALIGNMENT", "title": "RayOne® Toric Rotational Stability & Axis Pearls", "img": "assets/img/packshots/authentic_emv_toric.png?v=370.00", "img_fit": "object-contain p-3", "sl": "Masterclass", "sv": "05:10 • Surgical", "desc": "Surgical pearls for complete OVD removal behind the optic and accurate toric axis alignment."},
            {"cat": "SULCOFLEX DUET", "title": "Sulcoflex® Supplementary Sulcus Implantation", "img": "assets/img/packshots/authentic_sulcoflex.png?v=370.00", "img_fit": "object-contain p-3", "sl": "Procedure", "sv": "04:50 • Refractive", "desc": "Safe ciliary sulcus placement technique for correcting residual pseudophakic refractive error."},
        ]
    ),
]


# ==============================================================================
# 4. NEWS & EVENTS DECK (#activities)
# Slides: 0=Overview, 1=Congresses & Symposia, 2=Wet-Labs & Workshops, 3=Corporate News
# ==============================================================================
news_names = ["News & Events", "Congresses & Symposia", "Wet-Labs & Workshops", "Corporate News"]
news_slides = [
    build_overview_slide(
        deck_key="news",
        title_id="activities-title",
        eyebrow="NEWS & EVENTS • SCIENTIFIC CONGRESSES & CLINICAL UPDATES",
        title_main="Advancing Philippine",
        title_accent="Ophthalmic Events",
        subtitle="Highlights from international congresses, PAO scientific symposia, hands-on surgical wet-labs, and MediQ milestones.",
        cards=[
            {
                "title": "Congresses & Symposia",
                "tag": "APVRS & PAO MANILA",
                "img": "assets/img/pillars/p2_headquarters_brand.jpg",
                "desc": "Exhibition booths, satellite symposia, and Peer2Peer roundtables at SMX Convention Center and nationwide.",
                "meta": "25+ Annual Events"
            },
            {
                "title": "Wet-Labs & Workshops",
                "tag": "HANDS-ON TRAINING",
                "img": "assets/img/pillars/p5_theatre_wetlab.jpg",
                "desc": "Interactive RayOne® Lock & Roll™ dry/wet labs and biometry masterclasses across Manila, Cebu, and Davao.",
                "meta": "Regional Masterclasses"
            },
            {
                "title": "Corporate News",
                "tag": "PRESS & MILESTONES",
                "img": "assets/img/pillars/p1_cleanroom_inspect.jpg",
                "desc": "Philippine launch of RayOne® Galaxy AI spiral IOL, cold-chain hub expansions, and institutional partnerships.",
                "meta": "2025–2026 Updates"
            },
        ]
    ),
    build_grid_subslide(
        deck_key="news", slide_idx=1, total_slides=4, slide_names=news_names,
        header_prefix="News &amp; Events", header_accent="Scientific Congresses &amp; Symposia",
        subtitle="Connecting Filipino cataract and refractive surgeons with global ophthalmic pioneers.",
        badges=["SMX MANILA", "PAO & APVRS"],
        cards=[
            {"cat": "CONGRESS", "title": "APVRS Congress Manila • SMX Convention Center", "img": "assets/img/pillars/p2_headquarters_brand.jpg", "sl": "Venue", "sv": "Pasay City, Manila", "desc": "Showcasing Rayner UK's complete ophthalmic portfolio and live surgical simulators to Asia-Pacific delegates."},
            {"cat": "ANNUAL MEETING", "title": "Philippine Academy of Ophthalmology (PAO) Annual Congress", "img": "assets/img/pillars/p3_specialist_discussion.jpg", "sl": "Booth", "sv": "MediQ × Rayner Pavilion", "desc": "Flagship exhibition featuring RayOne® Galaxy spiral optics, EMV monovision clinics, and AEON® surface care."},
            {"cat": "SYMPOSIUM", "title": "RayOne® Galaxy Philippine Launch Evening Symposium", "img": "assets/img/pillars/p5_theatre_wetlab.jpg", "sl": "Highlight", "sv": "150+ Surgeons", "desc": "Scientific dinner symposium presenting first-in-eye Philippine clinical outcomes with AI spiral IOL optics."},
            {"cat": "ROUNDTABLE", "title": "Visayas Cataract & Refractive Peer2Peer Summit", "img": "assets/img/pillars/p6_quality_metrology.jpg", "sl": "Location", "sv": "Cebu City", "desc": "Interactive case discussions on astigmatism management with RayOne® Toric and EMV Toric platforms."},
            {"cat": "ROUNDTABLE", "title": "Mindanao Ophthalmic Leaders Forum", "img": "assets/img/pillars/p6_lot_traceability.jpg", "sl": "Location", "sv": "Davao City", "desc": "Regional scientific exchange focusing on biometry accuracy, OVD endothelial protection, and RayPRO® PROMs."},
            {"cat": "UPCOMING", "title": "2026 Mid-Year Refracting & Biometry Masterclass", "img": "assets/img/pillars/p1_cleanroom_inspect.jpg", "sl": "Registration", "sv": "Open for Surgeons", "desc": "Reserve your seat for our upcoming hands-on Barrett toric & EDOF calculation symposium.", "cta": "Register Seat"},
        ]
    ),
    build_grid_subslide(
        deck_key="news", slide_idx=2, total_slides=4, slide_names=news_names,
        header_prefix="News &amp; Events", header_accent="Surgical Wet-Labs &amp; Workshops",
        subtitle="Hands-on micro-incision implantation and biometry workshops for residents, fellows, and OR teams.",
        badges=["RESIDENT WET-LABS", "OR NURSE CLINICS"],
        cards=[
            {"cat": "WET-LAB", "title": "NCR Ophthalmology Residents Preloaded IOL Wet-Lab", "img": "assets/img/pillars/p5_theatre_wetlab.jpg", "sl": "Focus", "sv": "Lock & Roll™ 1.65mm", "desc": "Hands-on practice with model eyes mastering 2-step priming and wound-assisted micro-incision delivery."},
            {"cat": "BIOMETRY LAB", "title": "RayTrace® Toric & Enhanced Monovision Workshop", "img": "assets/img/pillars/p6_quality_metrology.jpg", "sl": "Format", "sv": "Interactive Laptop Lab", "desc": "Practical planning workshop using real patient topography and biometry datasets for EMV and Toric IOLs."},
            {"cat": "OR NURSING", "title": "Operating Room Nursing Excellence Workshop", "img": "assets/img/pillars/p1_cleanroom_inspect.jpg", "sl": "Certification", "sv": "80+ OR Nurses", "desc": "Dedicated training for ophthalmic scrub nurses on sterile cartridge handling and viscoelastic rheology."},
            {"cat": "ANTERIOR SEGMENT", "title": "Ophteis® OVD Capsulorhexis & Endothelial Lab", "img": "assets/img/packshots/ophteis_adaptive.png?v=370.00", "img_fit": "object-contain p-3", "sl": "Technique", "sv": "Soft-Shell & FR Pro", "desc": "Demonstrating cohesive chamber maintenance and dispersive endothelial coating in shallow anterior chambers."},
            {"cat": "REGIONAL LAB", "title": "Northern Luzon Surgical Skills Transfer Course", "img": "assets/img/pillars/p3_specialist_discussion.jpg", "sl": "Hub", "sv": "Pampanga & Baguio", "desc": "Bringing mobile surgical microscopes and wet-lab stations directly to regional training hospitals."},
            {"cat": "BOOK A LAB", "title": "Request an In-Hospital Wet-Lab for Your Department", "img": "assets/img/pillars/p2_headquarters_brand.jpg", "sl": "Custom", "sv": "On-Site Setup", "desc": "MediQ provides complete mobile wet-lab equipment, practice injectors, and model eyes for your institution.", "cta": "Book Workshop"},
        ]
    ),
    build_grid_subslide(
        deck_key="news", slide_idx=3, total_slides=4, slide_names=news_names,
        header_prefix="News &amp; Events", header_accent="Corporate News &amp; Announcements",
        subtitle="Latest institutional milestones, regulatory approvals, and network expansion updates from MediQ Pharma.",
        badges=["OFFICIAL RELEASES", "NETWORK EXPANSION"],
        cards=[
            {"cat": "PRODUCT LAUNCH", "title": "MediQ Introduces RayOne® Galaxy Spiral IOL in the Philippines", "img": "assets/img/packshots/authentic_emv.png?v=370.00", "img_fit": "object-contain p-3", "sl": "Milestone", "sv": "World's 1st AI Spiral", "desc": "Filipino cataract patients gain access to Rayner's groundbreaking non-diffractive full-range spiral optic."},
            {"cat": "LOGISTICS", "title": "Expansion of 24/7 Cold-Chain Dioptre Reserve Hub", "img": "assets/img/pillars/p1_cleanroom_inspect.jpg", "sl": "Capacity", "sv": "+40% Stock Depth", "desc": "Upgraded cleanroom inventory reserves ensure immediate availability of full sphere and toric dioptre banks."},
            {"cat": "OCULAR SURFACE", "title": "Nationwide Rollout of AEON® Preservative-Free Suite", "img": "assets/img/packshots/aeon_protect_plus.png?v=370.00", "img_fit": "object-contain p-3", "sl": "Portfolio", "sv": "4 Formulations", "desc": "Complete peri-operative tear-film care now stocked across major eye centers in Luzon, Visayas, and Mindanao."},
            {"cat": "DIGITAL HEALTH", "title": "50+ Philippine Clinics Onboarded to RayPRO® PROMs", "img": "assets/img/pillars/p3_specialist_discussion.jpg", "sl": "Outcomes", "sv": "Real-World Data", "desc": "Partner surgeons now track 3-year patient spectacle independence and satisfaction automatically."},
            {"cat": "QUALITY AUDIT", "title": "MediQ Achieves 100% Pass on Annual GDP & Regulatory Audit", "img": "assets/img/pillars/p6_quality_metrology.jpg", "sl": "Compliance", "sv": "Zero Non-Conformities", "desc": "Reaffirming our commitment to unbroken cold-chain integrity and full FDA CDRR traceability."},
            {"cat": "PARTNERSHIPS", "title": "New Institutional Consignment Agreements Across 17 Regions", "img": "assets/img/pillars/p6_lot_traceability.jpg", "sl": "Reach", "sv": "120+ Partner Centers", "desc": "Expanding same-day and next-day surgical support to provincial hospitals and ambulatory eye centers."},
        ]
    ),
]


# ==============================================================================
# 5. CONTACT US DECK (#contact)
# Slides: 0=Overview, 1=Inquiry Form, 2=Office Details, 3=Map, 4=Sales Contacts
# ==============================================================================
contact_names = ["Contact Overview", "Inquiry Form", "Office Details", "Map & Regional Hubs", "Sales Contacts"]

# Custom Slide 1 for Contact Us: Interactive Inquiry Form + Direct Channels (Maximized inside calc(100svh-4.5rem))
contact_slide_1_form = f'''        <!-- SLIDE 1: Contact Us - Inquiry Form -->
        <div class="deck-slide absolute top-0 left-0 right-0 w-full h-[calc(100svh-4.5rem)] flex flex-col bg-transparent text-cream px-4 sm:px-8 lg:px-12 pt-3.5 pb-4 overflow-y-auto lg:overflow-hidden transition-all duration-500 ease-out opacity-0 pointer-events-none translate-x-12 z-0" data-deck="contact" data-slide-index="1">
          <div class="relative z-20 w-full max-w-[1680px] mx-auto h-full flex flex-col">

            <!-- Top Pill Navigation Bar -->
            <div class="flex items-center justify-between gap-3 mb-2 shrink-0">
              <button type="button" onclick="if(window.goToDeckSlide){{window.goToDeckSlide('contact', 0);}}" class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-cream/90 hover:text-white transition-all cursor-pointer backdrop-blur-md">
                <svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m15 18-6-6 6-6"/></svg>
                <span>Contact Overview</span>
              </button>
              <button type="button" onclick="if(window.goToDeckSlide){{window.goToDeckSlide('contact', 2);}}" class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-cream/90 hover:text-white transition-all cursor-pointer backdrop-blur-md group">
                <span>Office Details</span>
                <svg class="size-3.5 group-hover:translate-x-0.5 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m9 18 6-6-6-6"/></svg>
              </button>
            </div>

            <!-- Compact Header Row -->
            <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-2.5 shrink-0">
              <div>
                <h3 class="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight leading-none">
                  Contact Us &bull; <span class="text-sky">Clinical &amp; Institutional Inquiry Form</span>
                </h3>
                <p class="text-[11px] sm:text-xs text-cream/70 mt-1 max-w-2xl">
                  Request a quote, schedule a surgical specialist visit, or coordinate hospital toric consignment.
                </p>
              </div>
              <div class="hidden sm:flex flex-wrap gap-2">
                <span class="px-2.5 py-0.5 rounded-full bg-sky/10 border border-sky/30 text-[9px] font-mono font-bold text-sky uppercase">PRIORITY RESPONSE</span>
                <span class="px-2.5 py-0.5 rounded-full bg-sky/10 border border-sky/30 text-[9px] font-mono font-bold text-sky uppercase">DIRECT SPECIALIST DESK</span>
              </div>
            </div>

            <!-- Maximized 2-Column Inquiry Stage -->
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 min-h-0">
              <!-- Left Info Column (4 cols) -->
              <div class="lg:col-span-4 rounded-2xl bg-[#0a1835]/80 border border-sky/25 p-4 sm:p-5 shadow-xl backdrop-blur-xl flex flex-col justify-between">
                <div>
                  <span class="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-sky/15 border border-sky/30 text-[10px] font-mono font-bold text-sky uppercase">Exclusive PH Partner</span>
                  <h4 class="text-lg sm:text-xl font-bold text-white mt-2">MediQ Pharma and Medical Supplies Distribution Inc.</h4>
                  <p class="text-xs text-cream/70 mt-1.5 leading-relaxed">
                    Authorized Philippine distributor of Rayner Intraocular Lenses Ltd. (UK). Supporting ophthalmologists, hospitals, and ambulatory eye centers nationwide.
                  </p>
                  <div class="mt-4 space-y-2.5 border-t border-white/10 pt-3">
                    <div class="rounded-xl bg-white/[0.03] border border-white/10 p-2.5">
                      <div class="text-[10px] font-mono uppercase text-sky font-bold">Surgical Case Booking &amp; Consignment</div>
                      <div class="text-xs text-white font-semibold mt-0.5">Priority 24/7 Dioptre &amp; Toric Dispatch</div>
                    </div>
                    <div class="rounded-xl bg-white/[0.03] border border-white/10 p-2.5">
                      <div class="text-[10px] font-mono uppercase text-sky font-bold">Biometry &amp; Wet-Lab Support</div>
                      <div class="text-xs text-white font-semibold mt-0.5">RayTrace® Calculations &amp; OR In-Servicing</div>
                    </div>
                  </div>
                </div>
                <div class="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                  <span class="text-cream/60 font-mono text-[10px]">DIGITAL PORTAL</span>
                  <a href="https://mediqvision.com/mobile/index.html" target="_blank" rel="noopener" class="text-sky font-bold hover:underline">mediqvision.com &nearr;</a>
                </div>
              </div>

              <!-- Right Form Column (8 cols) -->
              <div class="lg:col-span-8 rounded-2xl bg-[#0a1835]/80 border border-sky/25 p-4 sm:p-6 shadow-xl backdrop-blur-xl flex flex-col justify-between">
                <form id="quote-form" class="flex flex-col justify-between h-full gap-3" novalidate>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label for="inq-name" class="block text-[10px] font-mono font-bold uppercase tracking-wider text-sky">Full Name &amp; Title *</label>
                      <input id="inq-name" name="name" type="text" required placeholder="Dr. Juan Dela Cruz, MD, DPBO" class="mt-1 w-full rounded-xl border border-white/15 bg-[#07132b]/90 px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder:text-cream/35 focus:border-sky focus:outline-none" />
                    </div>
                    <div>
                      <label for="inq-clinic" class="block text-[10px] font-mono font-bold uppercase tracking-wider text-sky">Hospital / Eye Center *</label>
                      <input id="inq-clinic" name="clinic" type="text" required placeholder="Institution or ASC Name" class="mt-1 w-full rounded-xl border border-white/15 bg-[#07132b]/90 px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder:text-cream/35 focus:border-sky focus:outline-none" />
                    </div>
                    <div>
                      <label for="inq-email" class="block text-[10px] font-mono font-bold uppercase tracking-wider text-sky">Email Address *</label>
                      <input id="inq-email" name="email" type="email" required placeholder="doctor@hospital.ph" class="mt-1 w-full rounded-xl border border-white/15 bg-[#07132b]/90 px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder:text-cream/35 focus:border-sky focus:outline-none" />
                    </div>
                    <div>
                      <label for="inq-phone" class="block text-[10px] font-mono font-bold uppercase tracking-wider text-sky">Mobile / Viber Number *</label>
                      <input id="inq-phone" name="phone" type="tel" required placeholder="+63 9XX XXX XXXX" class="mt-1 w-full rounded-xl border border-white/15 bg-[#07132b]/90 px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder:text-cream/35 focus:border-sky focus:outline-none" />
                    </div>
                    <div class="sm:col-span-2">
                      <label for="inq-product" class="block text-[10px] font-mono font-bold uppercase tracking-wider text-sky">Product / Solution of Interest</label>
                      <select id="inq-product" name="product" class="mt-1 w-full rounded-xl border border-white/15 bg-[#07132b] px-3.5 py-2.5 text-xs sm:text-sm text-white focus:border-sky focus:outline-none">
                        <option value="Full Rayner Portfolio Consultation">Full Rayner Portfolio Consultation</option>
                        <option value="RayOne Galaxy & Galaxy Toric">RayOne® Galaxy &amp; Galaxy Toric (Spiral IOL)</option>
                        <option value="RayOne EMV & EMV Toric">RayOne® EMV &amp; EMV Toric (+1.5 D Enhanced Monofocal)</option>
                        <option value="RayOne Trifocal / Sulcoflex Trifocal">RayOne® Trifocal / Toric &amp; Sulcoflex®</option>
                        <option value="Ophteis OVD & AEON Suite">Ophteis® OVDs &amp; AEON® Preservative-Free Eye Care</option>
                        <option value="Hospital Consignment & Biometry Support">Hospital Consignment &amp; Biometry Support</option>
                      </select>
                    </div>
                    <div class="sm:col-span-2">
                      <label for="inq-message" class="block text-[10px] font-mono font-bold uppercase tracking-wider text-sky">Clinical Notes / Dioptre Requirements</label>
                      <textarea id="inq-message" name="message" rows="2" placeholder="Specify preferred surgery schedule, dioptre range, or request a specialist visit..." class="mt-1 w-full rounded-xl border border-white/15 bg-[#07132b]/90 px-3.5 py-2 text-xs sm:text-sm text-white placeholder:text-cream/35 focus:border-sky focus:outline-none"></textarea>
                    </div>
                  </div>
                  <div class="pt-2 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <p id="form-feedback" class="text-[11px] text-cream/65">For healthcare professionals &amp; authorized medical institutions.</p>
                    <button type="submit" class="inline-flex items-center justify-center gap-2 rounded-xl bg-sky hover:bg-[#72c5f8] text-[#0a1d40] font-bold text-xs px-6 py-2.5 shadow-[0_0_20px_rgba(58,160,219,0.4)] transition-all cursor-pointer">
                      <span>Submit Clinical Inquiry</span>
                      <svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m9 18 6-6-6-6"/></svg>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>'''

contact_slides = [
    build_overview_slide(
        deck_key="contact",
        title_id="contact-title",
        eyebrow="CONTACT US • PARTNER WITH MEDIQ PHARMA",
        title_main="Connect With Our",
        title_accent="Clinical & Support Teams",
        subtitle="Request a quote, coordinate hospital consignment, locate our distribution offices, or message a regional product specialist.",
        cards=[
            {
                "title": "Inquiry Form",
                "tag": "QUOTE & CONSULTATION",
                "img": "assets/img/pillars/p3_specialist_discussion.jpg",
                "desc": "Submit a clinical inquiry, request dioptre consignment, or book an in-hospital product presentation.",
                "meta": "Priority Specialist Desk"
            },
            {
                "title": "Office Details",
                "tag": "CORPORATE & HUBS",
                "img": "assets/img/pillars/p2_headquarters_brand.jpg",
                "desc": "Corporate headquarters, cleanroom warehouse hub, operating hours, and official institutional channels.",
                "meta": "Metro Manila & Regional"
            },
            {
                "title": "Map & Regional Hubs",
                "tag": "NATIONWIDE LOGISTICS",
                "img": "assets/img/pillars/p1_cleanroom_inspect.jpg",
                "desc": "Coverage map across Metro Manila, North/South Luzon, Cebu/Visayas, and Davao/Mindanao corridors.",
                "meta": "17 Regions Served"
            },
            {
                "title": "Sales Contacts",
                "tag": "SPECIALIST DIRECTORY",
                "img": "assets/img/pillars/p6_lot_traceability.jpg",
                "desc": "Direct Viber, Messenger, Telegram, and territory specialist contacts for surgical bookings.",
                "meta": "24/7 OR Case Support"
            },
        ]
    ),
    contact_slide_1_form,
    build_grid_subslide(
        deck_key="contact", slide_idx=2, total_slides=5, slide_names=contact_names,
        header_prefix="Contact Us", header_accent="Corporate &amp; Distribution Office Details",
        subtitle="Official headquarters, cold-chain logistics center, and institutional communication channels.",
        badges=["METRO MANILA HQ", "MON–SAT + URGENT OR"],
        cards=[
            {"cat": "HEADQUARTERS", "title": "MediQ Corporate & Commercial Office", "img": "assets/img/pillars/p2_headquarters_brand.jpg", "sl": "Location", "sv": "Metro Manila, PH", "desc": "Executive management, regulatory affairs, marketing, and institutional hospital bidding desk.", "href": "#contact", "cta": "Inquire"},
            {"cat": "COLD-CHAIN HUB", "title": "Central Cleanroom & GDP Warehouse", "img": "assets/img/pillars/p1_cleanroom_inspect.jpg", "sl": "Facility", "sv": "24/7 Thermal Logged", "desc": "Primary dioptre bank reserve, viscoelastic cold storage, and nationwide air/land dispatch hub.", "href": "#contact", "cta": "Book Dispatch"},
            {"cat": "OPERATING HOURS", "title": "Standard Business & 24/7 Surgical Hotline", "img": "assets/img/pillars/p6_lot_traceability.jpg", "sl": "Schedule", "sv": "8:00 AM – 6:00 PM", "desc": "Regular office hours Monday to Saturday, plus 24/7 emergency on-call support for scheduled OR cases."},
            {"cat": "DIGITAL PORTAL", "title": "Official Website & Monograph Flipbook", "img": "assets/brochure/mobile_1.jpg", "sl": "Portal", "sv": "mediqvision.com", "desc": "24/7 online access to RayOne® clinical monographs, surgical videos, and technical specifications.", "href": "https://mediqvision.com/mobile/index.html", "cta": "Visit Portal"},
            {"cat": "ACCREDITATION", "title": "Hospital Vendor & Procurement Desk", "img": "assets/img/pillars/p6_quality_metrology.jpg", "sl": "Compliance", "sv": "FDA LTO & CPR Ready", "desc": "Direct coordination for hospital pharmacy/CSR accreditation, consignment contracts, and bidding."},
            {"cat": "MEDICAL AFFAIRS", "title": "Clinical Training & Wet-Lab Coordination", "img": "assets/img/pillars/p5_theatre_wetlab.jpg", "sl": "Education", "sv": "Symposia & Labs", "desc": "Schedule a residency wet-lab, OR nurse in-service, or RayPRO® clinic onboarding session."},
        ]
    ),
    build_grid_subslide(
        deck_key="contact", slide_idx=3, total_slides=5, slide_names=contact_names,
        header_prefix="Contact Us", header_accent="Distribution Map &amp; Regional Hubs",
        subtitle="Strategic logistics corridors connecting our Metro Manila hub to surgical centers across the archipelago.",
        badges=["LUZON • VISAYAS • MINDANAO", "AIR & LAND COLD-CHAIN"],
        cards=[
            {"cat": "NCR HUB", "title": "Metro Manila & Greater Capital Region", "img": "assets/img/pillars/p2_headquarters_brand.jpg", "sl": "Dispatch SLA", "sv": "Same-Day (< 4 Hrs)", "desc": "Direct courier fleet serving Quezon City, Makati, Taguig/BGC, Manila, Pasig, San Juan, and Alabang."},
            {"cat": "NORTH LUZON", "title": "Central & Northern Luzon Corridor", "img": "assets/img/pillars/p3_specialist_discussion.jpg", "sl": "Dispatch SLA", "sv": "Next-Day Land", "desc": "Dedicated specialist coverage across Bulacan, Pampanga, Tarlac, Pangasinan, Baguio (CAR), and Ilocos."},
            {"cat": "SOUTH LUZON", "title": "CALABARZON & Bicol Regional Network", "img": "assets/img/pillars/p1_cleanroom_inspect.jpg", "sl": "Dispatch SLA", "sv": "Same / Next-Day", "desc": "Serving eye centers and tertiary hospitals in Cavite, Laguna, Batangas, Rizal, Quezon, and Naga/Legazpi."},
            {"cat": "VISAYAS HUB", "title": "Cebu, Iloilo & Bacolod Surgical Corridor", "img": "assets/img/pillars/p6_lot_traceability.jpg", "sl": "Dispatch SLA", "sv": "24-Hr Air Cargo", "desc": "Regional specialists and hospital consignment banks across Central and Western Visayas."},
            {"cat": "MINDANAO HUB", "title": "Davao, Cagayan de Oro & General Santos", "img": "assets/img/pillars/p6_quality_metrology.jpg", "sl": "Dispatch SLA", "sv": "24–48 Hr Air Cargo", "desc": "Temperature-validated air freight and on-site OR specialist support across Mindanao."},
            {"cat": "CONSIGNMENT MAP", "title": "120+ Accredited Partner Eye Centers", "img": "assets/img/pillars/p5_theatre_wetlab.jpg", "sl": "Network", "sv": "17 PH Regions", "desc": "Join our growing nationwide network of hospitals with dedicated on-site RayOne® dioptre banks."},
        ]
    ),
    build_grid_subslide(
        deck_key="contact", slide_idx=4, total_slides=5, slide_names=contact_names,
        header_prefix="Contact Us", header_accent="Regional Sales &amp; Clinical Specialists",
        subtitle="Connect directly with our ophthalmic product specialists via Viber, Messenger, Telegram, or inquiry desk.",
        badges=["DIRECT VIBER DESK", "TERRITORY MANAGERS"],
        cards=[
            {"cat": "METRO MANILA", "title": "NCR Key Accounts & Tertiary Hospitals Team", "img": "assets/img/pillars/p3_specialist_discussion.jpg", "sl": "Coverage", "sv": "Metro Manila Districts", "desc": "Dedicated clinical specialists for NCR medical centers, eye institutes, and ambulatory surgical centers.", "href": "viber://chat?number=%2B639000000000", "cta": "Message on Viber"},
            {"cat": "LUZON TERRITORY", "title": "North & South Luzon Clinical Specialists", "img": "assets/img/pillars/p2_headquarters_brand.jpg", "sl": "Coverage", "sv": "Regions I–V & CAR", "desc": "Field product specialists supporting provincial hospitals, toric calculations, and wet-labs across Luzon.", "href": "https://m.me/mediqpharma", "cta": "Messenger Desk"},
            {"cat": "VISAYAS TERRITORY", "title": "Visayas Regional Ophthalmic Team", "img": "assets/img/pillars/p1_cleanroom_inspect.jpg", "sl": "Coverage", "sv": "Regions VI, VII & VIII", "desc": "Direct surgical booking and consignment management for Cebu, Iloilo, Bacolod, and Tacloban.", "href": "https://t.me/mediqpharma", "cta": "Telegram Desk"},
            {"cat": "MINDANAO TERRITORY", "title": "Mindanao Regional Ophthalmic Team", "img": "assets/img/pillars/p6_lot_traceability.jpg", "sl": "Coverage", "sv": "Regions IX–XIII & BARMM", "desc": "Serving ophthalmic surgeons and surgical centers across Davao, CDO, Zamboanga, and Soccsksargen.", "href": "viber://chat?number=%2B639000000000", "cta": "Message on Viber"},
            {"cat": "BIOMETRY DESK", "title": "National RayTrace® & Toric Planning Specialists", "img": "assets/img/pillars/p6_quality_metrology.jpg", "sl": "Support", "sv": "Pre-Op Calculations", "desc": "Send keratometry and biometry printouts for rapid RayOne® Toric, EMV Toric, and Sulcoflex calculations."},
            {"cat": "INSTITUTIONAL", "title": "National Consignment & Procurement Director", "img": "assets/img/pillars/p5_theatre_wetlab.jpg", "sl": "Partnerships", "sv": "Hospital Contracts", "desc": "Coordinate multi-year hospital consignment agreements, bulk tenders, and equipment placements."},
        ]
    ),
]


brands_sec = build_deck_section("brands", "brands-title", brands_slides)
services_sec = build_deck_section("distribution", "distribution-title", services_slides)
resources_sec = build_deck_section("resources", "resources-title", resources_slides)
news_sec = build_deck_section("activities", "activities-title", news_slides)
contact_sec = build_deck_section("contact", "contact-title", contact_slides)

html_path = Path("index.html")
html = html_path.read_text(encoding="utf-8")

# 1. Replace from <section id="activities" through </section> of #contact (just before </main>)
pattern_main_tail = re.compile(
    r'<!-- ============== RECENT MEDIQ ACTIVITY.*?</main>',
    re.DOTALL
)
if not pattern_main_tail.search(html):
    raise RuntimeError("Could not locate #activities .. </main> block in index.html")

new_tail = "\n\n".join([brands_sec, services_sec, resources_sec, news_sec, contact_sec]) + "\n  </main>"
html = pattern_main_tail.sub(lambda _: new_tail, html, count=1)

# 2. Hide #galaxy-delivery from snap flow so navbar order is 100% seamless (Hero -> About -> Products -> Brands -> Services -> Resources -> News -> Contact -> Footer) while keeping its DOM intact for galaxy-delivery-3d.js
html = html.replace(
    '<section id="galaxy-delivery" aria-labelledby="galaxy-delivery-title"\n      class="page-snap-section page-transition-section',
    '<section id="galaxy-delivery" aria-labelledby="galaxy-delivery-title"\n      class="hidden'
)

# 3. Update navbar links in #site-header (outside #hero and #about!) so each item & dropdown item targets its exact section and slide
nav_replacements = [
    # 4. Brands & Partners
    ('<a id="nav-brands" href="#about"', '<a id="nav-brands" href="#brands" data-deck-target="brands:0"'),
    ('<!-- Principal Brands -->\n                <a href="#about"', '<!-- Principal Brands -->\n                <a href="#brands" data-deck-target="brands:1"'),
    ('<!-- Brand Profiles -->\n                <a href="#about"', '<!-- Brand Profiles -->\n                <a href="#brands" data-deck-target="brands:2"'),
    ('<!-- Downloadable Brochures -->\n                <a href="https://mediqvision.com/mobile/index.html" target="_blank" rel="noopener noreferrer"', '<!-- Downloadable Brochures -->\n                <a href="#brands" data-deck-target="brands:3"'),
    # 5. Services
    ('<a id="nav-services" href="#distribution"', '<a id="nav-services" href="#distribution" data-deck-target="services:0"'),
    ('<!-- Distribution -->\n                <a href="#distribution"', '<!-- Distribution -->\n                <a href="#distribution" data-deck-target="services:1"'),
    ('<!-- Product Support -->\n                <a href="#contact"', '<!-- Product Support -->\n                <a href="#distribution" data-deck-target="services:2"'),
    ('<!-- Training & Education -->\n                <a href="#activities"', '<!-- Training & Education -->\n                <a href="#distribution" data-deck-target="services:3"'),
    ('<!-- Customer Service -->\n                <a href="#contact"', '<!-- Customer Service -->\n                <a href="#distribution" data-deck-target="services:4"'),
    # 6. Resources
    ('<a id="nav-resources" href="#resources"', '<a id="nav-resources" href="#resources" data-deck-target="resources:0"'),
    ('<!-- Downloads -->\n                <a href="https://mediqvision.com/mobile/index.html" target="_blank" rel="noopener noreferrer"', '<!-- Downloads -->\n                <a href="#resources" data-deck-target="resources:1"'),
    ('<!-- FAQs -->\n                <a href="#contact"', '<!-- FAQs -->\n                <a href="#resources" data-deck-target="resources:2"'),
    ('<!-- Regulatory Information -->\n                <a href="#about" data-pillar-idx="3"', '<!-- Regulatory Information -->\n                <a href="#resources" data-deck-target="resources:3"'),
    ('<!-- Media Library -->\n                <a href="#activities"', '<!-- Media Library -->\n                <a href="#resources" data-deck-target="resources:4"'),
    # 7. News & Events
    ('<a id="nav-news" href="#activities"', '<a id="nav-news" href="#activities" data-deck-target="news:0"'),
    # 8. Contact Us
    ('<a id="nav-contact" href="#contact"', '<a id="nav-contact" href="#contact" data-deck-target="contact:0"'),
    ('<!-- Inquiry Form -->\n                <a href="#contact"', '<!-- Inquiry Form -->\n                <a href="#contact" data-deck-target="contact:1"'),
    ('<!-- Office Details -->\n                <a href="#contact"', '<!-- Office Details -->\n                <a href="#contact" data-deck-target="contact:2"'),
    ('<!-- Map -->\n                <a href="#contact"', '<!-- Map -->\n                <a href="#contact" data-deck-target="contact:3"'),
    ('<!-- Sales Contacts -->\n                <a href="#contact"', '<!-- Sales Contacts -->\n                <a href="#contact" data-deck-target="contact:4"'),
]

for old, new in nav_replacements:
    html_norm = html.replace("\r\n", "\n")
    if old in html_norm:
        html_norm = html_norm.replace(old, new, 1)
        html = html_norm.replace("\n", "\r\n")
    else:
        print(f"Warning: nav replacement not found: {old[:40]}")

# Update page-dots-nav to match the 9 main sections
old_dots_pattern = re.compile(r'<nav id="page-dots-nav".*?</nav>', re.DOTALL)
new_dots = '''<nav id="page-dots-nav" aria-label="Page Sections Navigator" class="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-end gap-2.5">
    <button type="button" class="page-dot-item is-active" data-target="#hero" aria-label="Page 1: Home">
      <span class="page-dot-tooltip">01 &middot; Home</span>
      <span class="page-dot-pill"></span>
    </button>
    <button type="button" class="page-dot-item" data-target="#about" aria-label="Page 2: About MEDIQ">
      <span class="page-dot-tooltip">02 &middot; About MEDIQ</span>
      <span class="page-dot-pill"></span>
    </button>
    <button type="button" class="page-dot-item" data-target="#products" aria-label="Page 3: Products">
      <span class="page-dot-tooltip">03 &middot; Products</span>
      <span class="page-dot-pill"></span>
    </button>
    <button type="button" class="page-dot-item" data-target="#brands" aria-label="Page 4: Brands &amp; Partners">
      <span class="page-dot-tooltip">04 &middot; Brands &amp; Partners</span>
      <span class="page-dot-pill"></span>
    </button>
    <button type="button" class="page-dot-item" data-target="#distribution" aria-label="Page 5: Services">
      <span class="page-dot-tooltip">05 &middot; Services</span>
      <span class="page-dot-pill"></span>
    </button>
    <button type="button" class="page-dot-item" data-target="#resources" aria-label="Page 6: Resources">
      <span class="page-dot-tooltip">06 &middot; Resources</span>
      <span class="page-dot-pill"></span>
    </button>
    <button type="button" class="page-dot-item" data-target="#activities" aria-label="Page 7: News &amp; Events">
      <span class="page-dot-tooltip">07 &middot; News &amp; Events</span>
      <span class="page-dot-pill"></span>
    </button>
    <button type="button" class="page-dot-item" data-target="#contact" aria-label="Page 8: Contact Us">
      <span class="page-dot-tooltip">08 &middot; Contact Us</span>
      <span class="page-dot-pill"></span>
    </button>
    <button type="button" class="page-dot-item" data-target="#site-footer" aria-label="Page 9: Connect">
      <span class="page-dot-tooltip">09 &middot; Connect</span>
      <span class="page-dot-pill"></span>
    </button>
  </nav>'''
html = old_dots_pattern.sub(lambda _: new_dots, html, count=1)

html_path.write_text(html, encoding="utf-8")
print("Successfully updated index.html with 5 multi-slide decks!")

