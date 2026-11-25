/**
 * MEDIQ Minimal Inline Search Bar with Suggestions Dropdown (⌘K / /)
 * Clean, understated search experience with:
 *  - Inline search input, search icon, bare clear button & soft focus glow
 *  - Recent searches (localStorage persisted) with individual remove (×) & Clear
 *  - Curated Trending suggestions
 *  - Live filtering & crisp text match emphasis across all MEDIQ destinations
 *  - Distinct monochrome icons per suggestion type
 *  - Click-outside, Escape, Arrow/Enter navigation & mobile top search bar
 */
(function initMediqGlobalSearch() {
  'use strict';

  const RECENTS_KEY = 'mediq_recent_searches_v1';
  const MAX_RECENTS = 6;

  const DEFAULT_RECENTS = [
    { id: 'prod-rayone-galaxy', query: 'RayOne Galaxy', category: 'Products' },
    { id: 'prod-ophteis-30', query: 'Ophteis Bio 3.0', category: 'Products' },
    { id: 'srv-shelf', query: 'Services Book Library', category: 'Services' },
  ];

  const TRENDING_CONFIG = [
    { itemId: 'prod-rayone-galaxy', label: 'RayOne Galaxy' },
    { itemId: 'prod-rayone-emv', label: 'RayOne EMV' },
    { itemId: 'prod-ophteis-30', label: 'Ophteis Bio 3.0' },
    { itemId: 'brd-principals', label: 'Rayner UK' },
    { itemId: 'srv-shelf', label: 'Services Book Library' },
    { itemId: 'cnt-supply', label: 'Hospital Inquiries' },
  ];

  const SINGULAR_CAT = {
    Products: 'Product',
    Services: 'Service',
    Brands: 'Brand',
    Resources: 'Resource',
    News: 'News',
    About: 'About',
    Contact: 'Contact',
    Sections: 'Section',
  };

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function escapeRegExp(str) {
    return String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function highlightMatches(text, tokens) {
    const raw = String(text || '');
    if (!tokens || !tokens.length) return escapeHtml(raw);
    const cleaned = tokens.map((t) => escapeRegExp(t)).filter(Boolean);
    if (!cleaned.length) return escapeHtml(raw);

    const re = new RegExp(`(${cleaned.join('|')})`, 'gi');
    let out = '';
    let last = 0;
    let match;
    while ((match = re.exec(raw)) !== null) {
      if (match.index > last) {
        out += escapeHtml(raw.slice(last, match.index));
      }
      out += `<mark class="mqs-hl">${escapeHtml(match[0])}</mark>`;
      last = match.index + match[0].length;
      if (match[0].length === 0) break;
    }
    if (last < raw.length) {
      out += escapeHtml(raw.slice(last));
    }
    return out;
  }

  function scrollToId(id) {
    if (typeof window.navigateToSection === 'function') {
      window.navigateToSection(id);
    } else {
      document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  }

  function jumpToDeck(deckKey, idx) {
    if (typeof window.goToDeckSlide === 'function') {
      window.goToDeckSlide(deckKey, idx, true);
    } else {
      const map = { products: '#products', brands: '#brands', services: '#distribution', resources: '#resources', news: '#activities', contact: '#contact' };
      scrollToId(map[deckKey] || '#hero');
    }
  }

  function jumpToAbout(idx) {
    if (typeof window.goToAboutSlide === 'function') {
      window.goToAboutSlide(idx);
    } else {
      scrollToId('#about');
    }
  }

  function jumpToProduct(subIdx, itemId) {
    scrollToId('#products');
    if (typeof window.__openProductCatalogItem === 'function') {
      window.__openProductCatalogItem(subIdx, itemId || null);
    } else if (typeof window.goToProductSlide === 'function') {
      window.goToProductSlide(subIdx);
    }
  }

  function jumpToServiceBook(bookIdx) {
    if (typeof window.__openServiceBookVolume === 'function') {
      window.__openServiceBookVolume(bookIdx);
    } else {
      jumpToDeck('services', 7);
    }
  }

  function jumpToNews(newsId) {
    scrollToId('#activities');
    setTimeout(() => {
      if (typeof window.__goToNewsSlide === 'function') {
        window.__goToNewsSlide(newsId);
      }
    }, 120);
  }

  function openBrochureViewer() {
    const trigger = document.querySelector('[data-open-brochure]');
    if (trigger) {
      trigger.click();
    } else {
      jumpToDeck('brands', 1);
    }
  }

  function downloadBrochurePdf() {
    const link = document.createElement('a');
    link.href = 'assets/brochure/RayOne-EMV-Platform-Brochure-2024_2.2.pdf';
    link.download = 'RayOne EMV Platform Brochure 2024_2.2.pdf';
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  function jumpToContact(prefillMsg) {
    jumpToDeck('contact', 0);
    setTimeout(() => {
      const nameInput = document.getElementById('inq-name');
      const msgInput = document.getElementById('inq-message');
      if (prefillMsg && msgInput && !msgInput.value.trim()) {
        msgInput.value = prefillMsg;
      }
      if (nameInput) nameInput.focus();
    }, 320);
  }

  const ITEMS = [
    // --- SECTIONS (01–08) ---
    {
      id: 'sec-home',
      category: 'Sections',
      code: '01',
      title: 'Home — Advanced Intraocular Lens',
      desc: 'Main landing view with flagship eye optics and brochure actions',
      tag: 'Top',
      keywords: ['home', 'hero', 'landing', 'start', 'eye', 'main'],
      run: () => scrollToId('#hero'),
    },
    {
      id: 'sec-vision-hero',
      category: 'Sections',
      code: 'PAGE',
      title: 'Vision Hero — Advancing Healthcare',
      desc: 'Dedicated hero page with glowing breathing eye iris, ECG heartbeat pulse, and floating crosses',
      tag: 'New Page',
      keywords: ['vision', 'advancing healthcare', 'empowering better lives', 'iris', 'heartbeat', 'ecg'],
      run: () => { window.location.href = 'vision-hero.html'; },
    },
    {
      id: 'sec-about',
      category: 'Sections',
      code: '02',
      title: 'About MEDIQ — Company Overview',
      desc: 'Connecting global healthcare innovation across the Philippines',
      tag: 'Section',
      keywords: ['about', 'company', 'overview', 'philippines', 'purpose'],
      run: () => jumpToAbout(0),
    },
    {
      id: 'sec-products',
      category: 'Sections',
      code: '03',
      title: 'Products & Technologies Portfolio',
      desc: 'Rayner IOLs, Ophteis OVDs, AEON eye drops & future portfolio',
      tag: 'Section',
      keywords: ['products', 'portfolio', 'iol', 'ovd', 'devices'],
      run: () => { scrollToId('#products'); if (window.goToProductSlide) window.goToProductSlide(0); },
    },
    {
      id: 'sec-brands',
      category: 'Sections',
      code: '04',
      title: 'Brands & Global Principals Overview',
      desc: 'Exclusive partnerships with Rayner UK & trusted healthcare leaders',
      tag: 'Section',
      keywords: ['brands', 'principals', 'partners', 'rayner'],
      run: () => jumpToDeck('brands', 0),
    },
    {
      id: 'sec-services',
      category: 'Sections',
      code: '05',
      title: 'Distribution & Commercial Services',
      desc: 'Full-cycle healthcare distribution, marketing, sales & quality support',
      tag: 'Section',
      keywords: ['services', 'distribution', 'commercialization', 'support'],
      run: () => jumpToDeck('services', 0),
    },
    {
      id: 'sec-resources',
      category: 'Sections',
      code: '06',
      title: 'Resources & Approved Documentation',
      desc: 'Product literature, clinical education, corporate profile & FDA guidance',
      tag: 'Section',
      keywords: ['resources', 'literature', 'fda', 'documents', 'profile'],
      run: () => jumpToDeck('resources', 0),
    },
    {
      id: 'sec-news',
      category: 'Sections',
      code: '07',
      title: 'News & Events Showcase',
      desc: 'Congress participation, wet-lab briefings, launches & hospital network updates',
      tag: 'Section',
      keywords: ['news', 'events', 'activities', 'congress', 'symposia'],
      run: () => scrollToId('#activities'),
    },
    {
      id: 'sec-contact',
      category: 'Sections',
      code: '08',
      title: 'Contact Us & Stakeholder Inquiry Desk',
      desc: 'Direct institutional, educational, clinical & partnership contact form',
      tag: 'Section',
      keywords: ['contact', 'inquiry', 'form', 'email', 'reach us', 'quote'],
      run: () => jumpToContact(''),
    },

    // --- ABOUT SLIDES (0–4) ---
    {
      id: 'abt-who',
      category: 'About',
      code: '01',
      title: 'About · Who We Are (Vision & Mission)',
      desc: 'Vision, Mission, and Philippine ophthalmology distribution mandate',
      tag: 'Slide 01',
      keywords: ['who we are', 'vision', 'mission', 'healthcare', 'mandate'],
      run: () => jumpToAbout(1),
    },
    {
      id: 'abt-what',
      category: 'About',
      code: '02',
      title: 'About · What We Do (Core Capabilities)',
      desc: 'Regulatory coordination, commercialization, logistics & hospital reach',
      tag: 'Slide 02',
      keywords: ['what we do', 'capabilities', 'bento', 'operations'],
      run: () => jumpToAbout(2),
    },
    {
      id: 'abt-foundation',
      category: 'About',
      code: '03',
      title: 'About · Our Established Foundation',
      desc: 'Rayner UK exclusive partnership, clinical accreditation & national reach',
      tag: 'Slide 03',
      keywords: ['foundation', 'rayner uk', 'accreditation', 'established'],
      run: () => jumpToAbout(3),
    },
    {
      id: 'abt-values',
      category: 'About',
      code: '04',
      title: 'About · Core Values & Integrity',
      desc: 'Ethical compliance, clinical excellence & patient-first philosophy',
      tag: 'Slide 04',
      keywords: ['core values', 'integrity', 'ethics', 'patient first'],
      run: () => jumpToAbout(4),
    },

    // --- PRODUCTS: SUBPAGES + ALL ITEMS ---
    {
      id: 'prod-rayone-galaxy',
      category: 'Products',
      code: 'RAO605G',
      title: 'RayOne Galaxy — Spiral Full-Range IOL',
      desc: 'New non-diffractive spiral optic with continuous full range of vision & 0% light loss',
      tag: 'Spiral IOL',
      keywords: ['galaxy', 'spiral', 'rayone', 'full range', 'non-diffractive', 'rao605g', 'new', '2026', 'latest'],
      run: () => jumpToProduct(1, 'rayone-galaxy'),
    },
    {
      id: 'prod-rayone-galaxy-toric',
      category: 'Products',
      code: 'RAO615X',
      title: 'Galaxy Toric — Spiral Astigmatic IOL',
      desc: 'Galaxy spiral full-range optics with Anti-Vaulting Haptic toric alignment',
      tag: 'Spiral Toric',
      keywords: ['galaxy toric', 'spiral toric', 'astigmatism', 'rao615x', 'cylinder', 'galaxy', 'toric'],
      run: () => jumpToProduct(1, 'rayone-galaxy-toric'),
    },
    {
      id: 'prod-cat-iol',
      category: 'Products',
      code: 'CAT 01',
      title: 'Intraocular Lenses (Rayner IOLs)',
      desc: 'Full 3D RayOne & Sulcoflex intraocular lens showcase',
      tag: 'Category',
      keywords: ['iol', 'intraocular', 'lenses', 'cataract', 'rayner', 'galaxy'],
      run: () => jumpToProduct(1),
    },
    {
      id: 'prod-rayone-emv',
      category: 'Products',
      code: 'RAO200E',
      title: 'RayOne EMV — Enhanced Monovision IOL',
      desc: 'Up to 1.5 D extended depth of focus co-developed with Prof. Graham Barrett',
      tag: '1.5 D EDoF',
      keywords: ['emv', 'rayone', 'barrett', 'monovision', 'rao200e', 'edof'],
      run: () => jumpToProduct(1, 'rayone-emv'),
    },
    {
      id: 'prod-rayone-trifocal',
      category: 'Products',
      code: 'RAO603F',
      title: 'RayOne Trifocal IOL',
      desc: '16-step diffractive trifocal optic delivering 89% retinal light utilization',
      tag: '89% Light',
      keywords: ['trifocal', 'multifocal', '603f', 'near', 'intermediate', 'presbyopia'],
      run: () => jumpToProduct(1, 'rayone-trifocal'),
    },
    {
      id: 'prod-rayone-trifocal-toric',
      category: 'Products',
      code: 'RAO613T',
      title: 'RayOne Trifocal Toric IOL',
      desc: 'Full-range astigmatic correction with Anti-Vaulting Haptic (< 1.8° rotation)',
      tag: 'Toric AVH',
      keywords: ['toric', 'astigmatism', 'trifocal', '613t', 'cylinder'],
      run: () => jumpToProduct(1, 'rayone-trifocal-toric'),
    },
    {
      id: 'prod-rayone-aspheric',
      category: 'Products',
      code: 'RAO600C',
      title: 'RayOne Aspheric Monofocal IOL',
      desc: 'Zero-glistening aberration-neutral optic via 1.65 mm micro-incision injector',
      tag: 'Monofocal',
      keywords: ['aspheric', 'monofocal', '600c', 'zero glistening'],
      run: () => jumpToProduct(1, 'rayone-aspheric'),
    },
    {
      id: 'prod-rayone-hydrophobic',
      category: 'Products',
      code: 'RAO800C',
      title: 'RayOne Hydrophobic IOL',
      desc: 'Cross-linked hydrophobic acrylic with Amon-Apple 360° enhanced square edge',
      tag: 'Anti-PCO',
      keywords: ['hydrophobic', '800c', 'pco', 'square edge'],
      run: () => jumpToProduct(1, 'rayone-hydrophobic'),
    },
    {
      id: 'prod-sulcoflex',
      category: 'Products',
      code: '703F',
      title: 'Sulcoflex Trifocal Supplementary IOL',
      desc: 'Reversible ciliary sulcus duet optic for pseudophakic multifocal upgrades',
      tag: 'Duet 6.5mm',
      keywords: ['sulcoflex', 'sulcus', 'duet', 'supplementary', '703f', 'reversible'],
      run: () => jumpToProduct(1, 'sulcoflex-trifocal'),
    },
    {
      id: 'prod-cat-ovd',
      category: 'Products',
      code: 'CAT 02',
      title: 'Medical Supplies — Ophteis OVDs & AEON',
      desc: 'Bio-fermented sodium hyaluronate OVDs and preservative-free ocular surface care',
      tag: 'Category',
      keywords: ['ovd', 'viscoelastic', 'ophteis', 'aeon', 'drops', 'dry eye', 'supplies'],
      run: () => jumpToProduct(2),
    },
    {
      id: 'prod-ophteis-30',
      category: 'Products',
      code: 'OPH-30',
      title: 'Ophteis Bio 3.0 (3.0% Sodium Hyaluronate)',
      desc: 'High-viscosity cohesive OVD for anterior chamber stability & capsulorhexis control',
      tag: 'Cohesive OVD',
      keywords: ['ophteis', 'bio 3.0', '3.0%', 'ovd', 'viscoelastic', 'cohesive'],
      run: () => jumpToProduct(2, 'ophteis-bio-30'),
    },
    {
      id: 'prod-ophteis-18',
      category: 'Products',
      code: 'OPH-18',
      title: 'Ophteis Bio 1.8 (1.8% Sodium Hyaluronate)',
      desc: 'Balanced cohesive OVD for routine and complex phacoemulsification',
      tag: 'Balanced OVD',
      keywords: ['ophteis', 'bio 1.8', '1.8%', 'ovd', 'phaco'],
      run: () => jumpToProduct(2, 'ophteis-bio-18'),
    },
    {
      id: 'prod-ophteis-max',
      category: 'Products',
      code: 'OPH-MAX',
      title: 'Ophteis Max HPMC (2.0% Dispersive)',
      desc: 'Persistent dispersive corneal endothelial shield during ultrasonic phaco',
      tag: 'Dispersive',
      keywords: ['ophteis', 'max', 'hpmc', 'dispersive', 'endothelial'],
      run: () => jumpToProduct(2, 'ophteis-max'),
    },
    {
      id: 'prod-aeon-pp',
      category: 'Products',
      code: 'AEON-PP',
      title: 'AEON Protect Plus Eye Drops',
      desc: '0.30% cross-linked HA + PEG 400 preservative-free post-surgical tear recovery',
      tag: 'Dry Eye PF',
      keywords: ['aeon', 'protect plus', 'dry eye', 'drops', 'post-op', 'preservative free'],
      run: () => jumpToProduct(2, 'aeon-protect-plus'),
    },
    {
      id: 'prod-aeon-pr',
      category: 'Products',
      code: 'AEON-PR',
      title: 'AEON Protect (Vitamin A & E Formula)',
      desc: 'Pre-surgical tear film stabilization to optimize biometry & topography accuracy',
      tag: 'Vitamin A+E',
      keywords: ['aeon', 'protect', 'vitamin', 'biometry', 'tear film'],
      run: () => jumpToProduct(2, 'aeon-protect'),
    },
    {
      id: 'prod-aeon-rp',
      category: 'Products',
      code: 'AEON-RP',
      title: 'AEON Repair (Vitamin B12 Corneal Matrix)',
      desc: 'Post-refractive and epithelial recovery matrix with 0.20% HA + B12',
      tag: 'Epithelial',
      keywords: ['aeon', 'repair', 'b12', 'corneal', 'epithelial'],
      run: () => jumpToProduct(2, 'aeon-repair'),
    },
    {
      id: 'prod-cat-future',
      category: 'Products',
      code: 'CAT 03',
      title: 'Future Portfolio & Medical Devices Pipeline',
      desc: 'Complementary medical devices, pharmaceuticals, diagnostics & hospital equipment',
      tag: 'Strategic',
      keywords: ['devices', 'equipment', 'diagnostics', 'pharma', 'pipeline', 'future'],
      run: () => jumpToProduct(3),
    },
    {
      id: 'prod-cat-monographs',
      category: 'Products',
      code: 'CAT 04',
      title: 'Product Catalogs & Clinical Monographs',
      desc: 'A-constants, Barrett EMV monographs, Ophteis & AEON clinical dossiers',
      tag: 'Monographs',
      keywords: ['catalog', 'monograph', 'a-constants', 'nomogram', 'dossier'],
      run: () => jumpToProduct(4),
    },

    // --- SERVICES: 3D BOOK LIBRARY VOLUMES (01–06) ---
    {
      id: 'srv-shelf',
      category: 'Services',
      code: 'LIBRARY',
      title: '3D Services Book Library (All 6 Volumes)',
      desc: 'Open interactive 3D bookshelf across every commercial & regulatory pillar',
      tag: '3D Shelf',
      keywords: ['book', 'library', 'shelf', 'services', '3d', 'pillars'],
      run: () => jumpToDeck('services', 7),
    },
    {
      id: 'srv-01',
      category: 'Services',
      code: 'VOL 01',
      title: 'Strategic Importation & Distribution',
      desc: 'Opens Book 01 · Product sourcing, customs clearance & lot-traceable warehousing',
      tag: 'Open Book',
      keywords: ['importation', 'distribution', 'customs', 'sourcing', 'supply chain', 'warehousing'],
      run: () => jumpToServiceBook(0),
    },
    {
      id: 'srv-02',
      category: 'Services',
      code: 'VOL 02',
      title: 'Product Marketing & Brand Development',
      desc: 'Opens Book 02 · Brand positioning, launch campaigns & reviewed literature',
      tag: 'Open Book',
      keywords: ['marketing', 'brand', 'launches', 'congresses', 'positioning'],
      run: () => jumpToServiceBook(1),
    },
    {
      id: 'srv-03',
      category: 'Services',
      code: 'VOL 03',
      title: 'Sales, Promotion & Commercialization',
      desc: 'Opens Book 03 · Field sales presentations, hospital accounts & procurement',
      tag: 'Open Book',
      keywords: ['sales', 'commercialization', 'procurement', 'hospital accounts'],
      run: () => jumpToServiceBook(2),
    },
    {
      id: 'srv-04',
      category: 'Services',
      code: 'VOL 04',
      title: 'Market Development & Regional Expansion',
      desc: 'Opens Book 04 · Luzon, Visayas, Mindanao channel & regulatory pathways',
      tag: 'Open Book',
      keywords: ['market development', 'regional', 'luzon', 'visayas', 'mindanao', 'fda'],
      run: () => jumpToServiceBook(3),
    },
    {
      id: 'srv-05',
      category: 'Services',
      code: 'VOL 05',
      title: 'Professional Education & Symposia',
      desc: 'Opens Book 05 · Specialist forums, wet-lab workshops & technical briefings',
      tag: 'Open Book',
      keywords: ['education', 'training', 'symposia', 'wet-lab', 'briefings', 'workshops'],
      run: () => jumpToServiceBook(4),
    },
    {
      id: 'srv-06',
      category: 'Services',
      code: 'VOL 06',
      title: 'Quality, Traceability & Customer Support',
      desc: 'Opens Book 06 · Lot-level serial tracking, QA escalation & after-sales desk',
      tag: 'Open Book',
      keywords: ['quality', 'customer support', 'traceability', 'after-sales', 'qa', 'lot'],
      run: () => jumpToServiceBook(5),
    },

    // --- BRANDS & BROCHURES ---
    {
      id: 'brd-principals',
      category: 'Brands',
      code: '01',
      title: 'Principal Brands · Rayner UK',
      desc: 'Exclusive Philippine representation of British intraocular innovation since 1949',
      tag: 'Principal',
      keywords: ['rayner', 'uk', 'principal', 'harold ridley', 'exclusive'],
      run: () => jumpToDeck('brands', 1),
    },
    {
      id: 'brd-profiles',
      category: 'Brands',
      code: '02',
      title: 'Brand Architecture & Portfolio Profiles',
      desc: 'Platform overview across RayOne IOLs, Sulcoflex, Ophteis OVDs & AEON',
      tag: 'Profiles',
      keywords: ['profiles', 'brand architecture', 'portfolio', 'sulcoflex'],
      run: () => jumpToDeck('brands', 2),
    },
    {
      id: 'brd-brochure-viewer',
      category: 'Brands',
      code: 'VIEWER',
      title: 'Open Interactive 12-Page RayOne Brochure',
      desc: 'Full digital brochure covering optical design, Lock & Roll & RayPRO outcomes',
      tag: '12 Pages',
      keywords: ['brochure', 'viewer', 'lock and roll', 'raypro', 'pages'],
      run: openBrochureViewer,
    },
    {
      id: 'brd-brochure-pdf',
      category: 'Brands',
      code: 'PDF',
      title: 'Download RayOne EMV Platform Brochure (PDF)',
      desc: 'Official 2024/2026 platform technical brochure PDF download',
      tag: 'Download',
      keywords: ['download', 'pdf', 'brochure', 'rayone emv', 'file'],
      run: downloadBrochurePdf,
    },

    // --- RESOURCES ---
    {
      id: 'res-literature',
      category: 'Resources',
      code: '01',
      title: 'Product-Approved Literature',
      desc: 'Reviewed technical sheets, IFUs & principal-authorized clinical materials',
      tag: 'Resource 01',
      keywords: ['literature', 'approved', 'ifu', 'technical sheets'],
      run: () => jumpToDeck('resources', 1),
    },
    {
      id: 'res-education',
      category: 'Resources',
      code: '02',
      title: 'Professional Educational Materials',
      desc: 'Reference guides and Congress educational packs for ophthalmic practitioners',
      tag: 'Resource 02',
      keywords: ['educational', 'materials', 'practitioners', 'congress'],
      run: () => jumpToDeck('resources', 2),
    },
    {
      id: 'res-profile',
      category: 'Resources',
      code: '03',
      title: '2026 Corporate Profile',
      desc: 'Institutional credentials, national footprint & MEDIQ distributor governance',
      tag: 'Resource 03',
      keywords: ['corporate profile', '2026', 'credentials', 'company profile'],
      run: () => jumpToDeck('resources', 3),
    },
    {
      id: 'res-regulatory',
      category: 'Resources',
      code: '04',
      title: 'Official Regulatory Guidance',
      desc: 'Philippine FDA compliance standards & authorized distributor policies',
      tag: 'Resource 04',
      keywords: ['regulatory', 'fda', 'governance', 'compliance', 'policy'],
      run: () => jumpToDeck('resources', 4),
    },

    // --- NEWS & EVENTS (ALL 6 COVERFLOW CARDS) ---
    {
      id: 'news-rayner-portfolio',
      category: 'News',
      code: '#ProductLaunches',
      title: 'Rayner Portfolio — Philippine Updates',
      desc: 'Authorized RayOne EMV & Galaxy spiral optic IOL communications',
      tag: 'Story 01',
      keywords: ['rayner portfolio', 'galaxy', 'updates', 'launch'],
      run: () => jumpToNews('rayner-portfolio'),
    },
    {
      id: 'news-apvrs',
      category: 'News',
      code: '#ProfEd',
      title: 'APVRS 2025 Manila — Ophthalmic Congress',
      desc: 'Ophthalmic symposia & surgical booth engagement at SMX Convention Center',
      tag: 'Story 02',
      keywords: ['apvrs', '2025', 'manila', 'smx', 'congress', 'symposia'],
      run: () => jumpToNews('apvrs-manila'),
    },
    {
      id: 'news-spiral',
      category: 'News',
      code: '#SpiralOptic',
      title: 'Spiral Optic Tech — Intraocular Systems',
      desc: 'Multichannel introductions of principal-approved intraocular optical systems',
      tag: 'Story 03',
      keywords: ['spiral optic', 'intraocular', 'innovation', 'tech'],
      run: () => jumpToNews('spiral-optic'),
    },
    {
      id: 'news-clinical-or',
      category: 'News',
      code: '#ClinicalOR',
      title: 'Clinical Orientation — Wet-Lab & OR Briefings',
      desc: 'Structured wet-lab workshops & OR technical briefings for surgical teams',
      tag: 'Story 04',
      keywords: ['clinical', 'wet-lab', 'or briefing', 'surgical teams'],
      run: () => jumpToNews('clinical-orientation'),
    },
    {
      id: 'news-network',
      category: 'News',
      code: '#Institutional',
      title: 'National Network — Hospital Collaboration',
      desc: 'Connecting Philippine eye centers and hospital surgical departments nationwide',
      tag: 'Story 05',
      keywords: ['national network', 'hospital collaboration', 'eye centers'],
      run: () => jumpToNews('institutional-collaboration'),
    },
    {
      id: 'news-alignment',
      category: 'News',
      code: '#Partnerships',
      title: 'MEDIQ & Rayner UK — 2026 Alignment',
      desc: '2026 organizational growth and exclusive Rayner UK principal alignment',
      tag: 'Story 06',
      keywords: ['alignment', '2026', 'growth', 'partnership', 'rayner'],
      run: () => jumpToNews('mediq-partnerships'),
    },

    // --- CONTACT SHORTCUTS ---
    {
      id: 'cnt-supply',
      category: 'Contact',
      code: 'DESK',
      title: 'Inquire · Hospital & Institutional Supply',
      desc: 'Jump to the Contact form to request procurement pricing or stock allocation',
      tag: 'Inquire',
      keywords: ['procurement', 'pricing', 'order', 'hospital supply', 'stock'],
      run: () => jumpToContact('Institutional Supply & Procurement Inquiry: '),
    },
    {
      id: 'cnt-education',
      category: 'Contact',
      code: 'OR / LAB',
      title: 'Request · Wet-Lab or Clinical Technical Briefing',
      desc: 'Schedule an orientation or technical briefing with MEDIQ specialists',
      tag: 'Request',
      keywords: ['wet lab', 'briefing', 'specialist', 'training inquiry'],
      run: () => jumpToContact('Clinical Education / Wet-Lab Technical Briefing Request: '),
    },
  ];

  const ITEM_MAP = Object.create(null);
  ITEMS.forEach((it) => {
    ITEM_MAP[it.id] = it;
  });

  // Clean 15px monochrome icons per suggestion / category type
  const TYPE_ICONS = {
    recent: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15.5 14"/></svg>',
    trending: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>',
    Products: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 12s3.5-6.5 9.5-6.5 9.5 6.5 9.5 6.5-3.5 6.5-9.5 6.5-9.5-6.5-9.5-6.5Z"/><circle cx="12" cy="12" r="3"/></svg>',
    Services: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M2 4.5A2.5 2.5 0 0 1 4.5 2H11v19H4.5A2.5 2.5 0 0 0 2 23.5V4.5Z"/><path d="M22 4.5A2.5 2.5 0 0 0 19.5 2H13v19h6.5a2.5 2.5 0 0 1 2.5 2.5V4.5Z"/></svg>',
    Brands: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8.5" r="5.5"/><path d="m8.2 13.4-1.2 8.1 5-2.7 5 2.7-1.2-8.1"/></svg>',
    Resources: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="13" y2="17"/></svg>',
    News: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>',
    About: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><polygon points="15.5 8.5 13.5 13.5 8.5 15.5 10.5 10.5 15.5 8.5"/></svg>',
    Contact: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>',
    Sections: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 12 12 17 22 12"/><polyline points="2 17 12 22 22 17"/></svg>',
  };

  function getTypeIcon(kind) {
    return TYPE_ICONS[kind] || TYPE_ICONS.Sections;
  }

  function loadRecents() {
    try {
      const raw = window.localStorage.getItem(RECENTS_KEY);
      if (raw === null) {
        window.localStorage.setItem(RECENTS_KEY, JSON.stringify(DEFAULT_RECENTS));
        return DEFAULT_RECENTS.slice();
      }
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed
        .filter((r) => r && typeof r.query === 'string' && r.query.trim())
        .slice(0, MAX_RECENTS);
    } catch (_) {
      return DEFAULT_RECENTS.slice();
    }
  }

  function saveRecents(list) {
    try {
      window.localStorage.setItem(RECENTS_KEY, JSON.stringify(list.slice(0, MAX_RECENTS)));
    } catch (_) {}
  }

  function injectStyles() {
    if (document.getElementById('mediq-search-styles')) return;
    const style = document.createElement('style');
    style.id = 'mediq-search-styles';
    style.textContent = `
      @keyframes mqsMenuIn {
        from { opacity: 0; transform: translateY(-4px); }
        to { opacity: 1; transform: translateY(0); }
      }

      #mediq-search-wrap {
        position: relative;
        font-family: "Inter", "Instrument Sans", ui-sans-serif, system-ui, -apple-system, sans-serif;
      }

      #mediq-search-wrap .mqs-bar {
        position: relative;
        display: flex;
        align-items: center;
        gap: 8px;
        width: 220px;
        height: 36px;
        padding: 0 10px 0 11px;
        border-radius: 10px;
        border: 1px solid rgba(255, 255, 255, 0.14);
        background: rgba(10, 19, 38, 0.85);
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.25);
        transition:
          border-color 160ms ease,
          box-shadow 180ms ease,
          background-color 160ms ease;
      }

      @media (min-width: 1536px) {
        #mediq-search-wrap .mqs-bar {
          width: 242px;
        }
      }

      @media (min-width: 640px) and (max-width: 1023px) {
        #mediq-search-wrap .mqs-bar {
          width: 240px;
        }
      }

      #mediq-search-wrap .mqs-bar:hover {
        border-color: rgba(255, 255, 255, 0.24);
        background: rgba(12, 22, 44, 0.92);
      }

      #mediq-search-wrap .mqs-bar:focus-within,
      #mediq-search-wrap.is-open .mqs-bar {
        border-color: rgba(125, 196, 250, 0.58);
        background: rgba(12, 23, 46, 0.97);
        box-shadow:
          0 0 0 3px rgba(114, 197, 248, 0.14),
          0 8px 24px rgba(0, 0, 0, 0.42);
      }

      #mediq-search-wrap .mqs-search-icon {
        width: 14px;
        height: 14px;
        flex-shrink: 0;
        color: rgba(148, 163, 184, 0.78);
        transition: color 160ms ease;
        pointer-events: none;
      }

      #mediq-search-wrap .mqs-bar:focus-within .mqs-search-icon,
      #mediq-search-wrap.is-open .mqs-search-icon {
        color: #93c5fd;
      }

      #mediq-search-wrap .mqs-input {
        flex: 1;
        min-width: 0;
        height: 100%;
        padding: 0;
        border: 0;
        outline: none !important;
        box-shadow: none !important;
        background: transparent;
        color: #f1f5f9;
        font-size: 13px;
        font-weight: 400;
      }

      #mediq-search-wrap .mqs-input::placeholder {
        color: rgba(148, 163, 184, 0.58);
      }

      #mediq-search-wrap .mqs-clear {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 20px;
        height: 20px;
        flex-shrink: 0;
        border: 0;
        border-radius: 6px;
        background: transparent;
        color: rgba(148, 163, 184, 0.72);
        cursor: pointer;
        transition: color 140ms ease, background-color 140ms ease;
      }

      #mediq-search-wrap .mqs-clear:hover {
        background: rgba(255, 255, 255, 0.08);
        color: #ffffff;
      }

      #mediq-search-wrap .mqs-clear svg {
        width: 12px;
        height: 12px;
      }

      #mediq-search-wrap .mqs-clear[hidden],
      #mediq-search-wrap .mqs-dropdown[hidden] {
        display: none !important;
      }

      #mediq-search-wrap .mqs-kbd {
        display: none;
        align-items: center;
        justify-content: center;
        min-width: 19px;
        height: 19px;
        padding: 0 5px;
        flex-shrink: 0;
        border-radius: 5px;
        border: 1px solid rgba(255, 255, 255, 0.12);
        background: rgba(255, 255, 255, 0.04);
        color: rgba(148, 163, 184, 0.7);
        font-family: "IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, monospace;
        font-size: 10px;
        line-height: 1;
        pointer-events: none;
      }

      @media (min-width: 1280px) {
        #mediq-search-wrap:not(.has-value):not(.is-open) .mqs-shortcut-hint {
          display: inline-flex;
        }
      }

      #mediq-search-wrap .mqs-mobile-close {
        display: none;
        flex-shrink: 0;
        border: 0;
        background: transparent;
        padding: 4px 6px;
        color: rgba(148, 163, 184, 0.85);
        font-size: 12.5px;
        font-weight: 500;
        cursor: pointer;
      }

      #mediq-search-wrap .mqs-mobile-close:hover {
        color: #ffffff;
      }

      /* Clean flat minimal dropdown panel */
      #mediq-search-dropdown {
        position: absolute;
        top: calc(100% + 8px);
        right: 0;
        width: min(356px, calc(100vw - 24px));
        z-index: 95;
        border-radius: 12px;
        border: 1px solid rgba(255, 255, 255, 0.11);
        background: rgba(11, 19, 36, 0.97);
        box-shadow: 0 16px 40px rgba(0, 0, 0, 0.55);
        backdrop-filter: blur(18px);
        -webkit-backdrop-filter: blur(18px);
        overflow: hidden;
        animation: mqsMenuIn 140ms ease-out;
      }

      @media (max-width: 639px) {
        #mediq-search-wrap:not(.is-mobile-open) {
          display: none;
        }
        #mediq-search-wrap.is-mobile-open {
          display: block;
          position: fixed;
          top: 18px;
          left: 12px;
          right: 12px;
          z-index: 95;
        }
        #mediq-search-wrap.is-mobile-open .mqs-bar {
          width: 100%;
          height: 44px;
          padding: 0 10px 0 12px;
          border-radius: 12px;
        }
        #mediq-search-wrap.is-mobile-open .mqs-input {
          font-size: 14px;
        }
        #mediq-search-wrap.is-mobile-open .mqs-mobile-close {
          display: inline-flex;
          align-items: center;
        }
        #mediq-search-wrap.is-mobile-open #mediq-search-dropdown {
          top: calc(100% + 8px);
          left: 0;
          right: 0;
          width: 100%;
        }
      }

      #mediq-search-backdrop {
        position: fixed;
        inset: 0;
        z-index: 48;
        background: rgba(2, 7, 18, 0.56);
        backdrop-filter: blur(4px);
        -webkit-backdrop-filter: blur(4px);
      }

      #mediq-search-backdrop[hidden] {
        display: none !important;
      }

      #mediq-search-results {
        max-height: min(390px, calc(100vh - 140px));
        padding: 6px;
        overflow-y: auto;
        overscroll-behavior: contain;
        scrollbar-width: thin;
        scrollbar-color: rgba(148, 163, 184, 0.22) transparent;
      }

      @media (max-width: 639px) {
        #mediq-search-results {
          max-height: min(400px, calc(100dvh - 150px));
        }
      }

      #mediq-search-results::-webkit-scrollbar {
        width: 5px;
      }
      #mediq-search-results::-webkit-scrollbar-track {
        background: transparent;
      }
      #mediq-search-results::-webkit-scrollbar-thumb {
        background: rgba(148, 163, 184, 0.22);
        border-radius: 9999px;
      }

      .mqs-section-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 6px 10px 4px;
        font-size: 11px;
        font-weight: 500;
        color: rgba(148, 163, 184, 0.72);
      }

      .mqs-section-divider {
        margin-top: 6px;
        padding-top: 10px;
        border-top: 1px solid rgba(255, 255, 255, 0.07);
      }

      .mqs-section-title {
        display: inline-flex;
        align-items: center;
        gap: 6px;
      }

      .mqs-clear-all-btn {
        border: 0;
        background: transparent;
        padding: 2px 4px;
        border-radius: 5px;
        font-size: 11px;
        font-weight: 400;
        color: rgba(148, 163, 184, 0.65);
        cursor: pointer;
        transition: color 140ms ease;
      }

      .mqs-clear-all-btn:hover {
        color: #f1f5f9;
      }

      .mqs-group-list {
        display: flex;
        flex-direction: column;
        gap: 1px;
      }

      .mqs-recent-row {
        display: flex;
        align-items: center;
        height: 36px;
        border-radius: 8px;
        transition: background-color 120ms ease;
      }

      .mqs-recent-row:hover,
      .mqs-recent-row.is-selected {
        background: rgba(255, 255, 255, 0.07);
      }

      .mqs-recent-main {
        flex: 1;
        min-width: 0;
        height: 100%;
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 0 6px 0 10px;
        border: 0;
        background: transparent;
        text-align: left;
        color: #e2e8f0;
        cursor: pointer;
      }

      .mqs-recent-remove {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 26px;
        height: 26px;
        margin-right: 4px;
        flex-shrink: 0;
        border: 0;
        border-radius: 6px;
        background: transparent;
        color: rgba(148, 163, 184, 0.55);
        cursor: pointer;
        transition: color 120ms ease, background-color 120ms ease;
      }

      .mqs-recent-remove:hover {
        background: rgba(255, 255, 255, 0.08);
        color: #f8fafc;
      }

      .mqs-recent-remove svg {
        width: 12px;
        height: 12px;
      }

      .mqs-row {
        display: flex;
        width: 100%;
        height: 36px;
        align-items: center;
        gap: 10px;
        padding: 0 10px;
        border: 0;
        border-radius: 8px;
        text-align: left;
        background: transparent;
        color: #e2e8f0;
        cursor: pointer;
        transition: background-color 120ms ease;
      }

      .mqs-row:hover,
      .mqs-row.is-selected {
        background: rgba(255, 255, 255, 0.07);
      }

      .mqs-icon-glyph {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 16px;
        height: 16px;
        flex-shrink: 0;
        color: rgba(148, 163, 184, 0.72);
        transition: color 120ms ease;
      }

      .mqs-row:hover .mqs-icon-glyph,
      .mqs-row.is-selected .mqs-icon-glyph,
      .mqs-recent-row:hover .mqs-icon-glyph,
      .mqs-recent-row.is-selected .mqs-icon-glyph {
        color: #e2e8f0;
      }

      .mqs-row-label {
        flex: 1;
        min-width: 0;
        font-size: 13px;
        font-weight: 400;
        line-height: 1.25;
        color: rgba(226, 232, 240, 0.92);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .mqs-row:hover .mqs-row-label,
      .mqs-row.is-selected .mqs-row-label,
      .mqs-recent-row:hover .mqs-row-label,
      .mqs-recent-row.is-selected .mqs-row-label {
        color: #ffffff;
      }

      .mqs-hl {
        background: transparent;
        color: #ffffff;
        font-weight: 600;
      }

      .mqs-row-type {
        flex-shrink: 0;
        font-size: 11px;
        font-weight: 400;
        color: rgba(148, 163, 184, 0.55);
      }

      .mqs-empty {
        padding: 20px 12px;
        text-align: center;
        font-size: 12.5px;
        color: rgba(148, 163, 184, 0.78);
      }
    `;
    document.head.appendChild(style);
  }

  function buildSearchUi() {
    const wrap = document.getElementById('mediq-search-wrap');
    const inputEl = document.getElementById('mediq-search-input');
    const clearBtn = document.getElementById('mediq-search-clear');
    const mobileCloseBtn = document.getElementById('mediq-search-mobile-close');
    const dropdown = document.getElementById('mediq-search-dropdown');
    const mobileTrigger = document.getElementById('mediq-search-trigger');
    if (!wrap || !inputEl || !clearBtn || !dropdown) return;

    injectStyles();

    let backdrop = document.getElementById('mediq-search-backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.id = 'mediq-search-backdrop';
      backdrop.setAttribute('hidden', '');
      document.body.appendChild(backdrop);
    }

    dropdown.innerHTML = `<div id="mediq-search-results"></div>`;
    const resultsWrap = document.getElementById('mediq-search-results');

    let isOpen = false;
    let query = '';
    let selectedIdx = 0;
    let recents = loadRecents();
    let navActions = [];

    function syncControlsState() {
      const hasVal = query.length > 0;
      wrap.classList.toggle('has-value', hasVal);
      wrap.classList.toggle('is-open', isOpen);
      inputEl.setAttribute('aria-expanded', String(isOpen));
      clearBtn.hidden = !hasVal;
      dropdown.hidden = !isOpen;
      const isMobileOpen = wrap.classList.contains('is-mobile-open');
      backdrop.hidden = !(isOpen && isMobileOpen);
    }

    function addRecent(itemOrQuery, customLabel) {
      let entry;
      if (typeof itemOrQuery === 'string') {
        const cleaned = itemOrQuery.trim();
        if (!cleaned) return;
        entry = { id: null, query: cleaned, category: 'Sections' };
      } else if (itemOrQuery) {
        entry = {
          id: itemOrQuery.id,
          query: customLabel || itemOrQuery.title,
          category: itemOrQuery.category,
        };
      }
      if (!entry) return;
      const qLow = entry.query.toLowerCase();
      recents = recents.filter(
        (r) => r.query.toLowerCase() !== qLow && !(entry.id && r.id === entry.id)
      );
      recents.unshift(entry);
      if (recents.length > MAX_RECENTS) recents = recents.slice(0, MAX_RECENTS);
      saveRecents(recents);
    }

    function removeRecentAt(idx) {
      if (idx < 0 || idx >= recents.length) return;
      recents.splice(idx, 1);
      saveRecents(recents);
      renderResults();
      inputEl.focus({ preventScroll: true });
    }

    function clearAllRecents() {
      recents = [];
      saveRecents(recents);
      renderResults();
      inputEl.focus({ preventScroll: true });
    }

    function scoreItem(item, qTokens) {
      if (!qTokens.length) return 1;
      const titleL = item.title.toLowerCase();
      const codeL = item.code.toLowerCase();
      const descL = item.desc.toLowerCase();
      const catL = item.category.toLowerCase();
      const kwL = (item.keywords || []).join(' ').toLowerCase();
      const full = `${titleL} ${codeL} ${descL} ${catL} ${kwL}`;

      let score = 0;
      for (let i = 0; i < qTokens.length; i++) {
        const tok = qTokens[i];
        if (!full.includes(tok)) return 0;
        if (titleL.startsWith(tok) || codeL === tok) score += 12;
        else if (titleL.includes(tok)) score += 7;
        else if (kwL.includes(tok)) score += 5;
        else if (codeL.includes(tok)) score += 4;
        else score += 2;
      }
      return score;
    }

    function computeFiltered(catFilter) {
      const tokens = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
      const pool = catFilter ? ITEMS.filter((it) => it.category === catFilter) : ITEMS;
      if (!tokens.length) return pool.slice();
      return pool
        .map((it) => ({ item: it, score: scoreItem(it, tokens) }))
        .filter((r) => r.score > 0)
        .sort((a, b) => b.score - a.score)
        .map((r) => r.item);
    }

    function runItem(item, saveToRecent = true, displayLabel) {
      if (!item) return;
      if (saveToRecent) addRecent(item, displayLabel);
      closeSearch({ blur: true });
      try {
        item.run();
      } catch (_) {}
    }

    function runRecent(entry) {
      if (!entry) return;
      if (entry.id && ITEM_MAP[entry.id]) {
        runItem(ITEM_MAP[entry.id], true, entry.query);
        return;
      }
      query = entry.query;
      inputEl.value = entry.query;
      selectedIdx = 0;
      renderResults();
      syncControlsState();
      inputEl.focus({ preventScroll: true });
    }

    function buildRecentRowHtml(entry, realIdx, navIdx, tokens) {
      const isSel = navIdx === selectedIdx;
      const typeLabel = SINGULAR_CAT[entry.category] || '';
      return `
        <div class="mqs-recent-row${isSel ? ' is-selected' : ''}" data-mqs-nav-row="${navIdx}">
          <button type="button" role="option" id="mqs-opt-${navIdx}" aria-selected="${isSel}"
            class="mqs-recent-main" data-mqs-nav-idx="${navIdx}" data-recent-idx="${realIdx}">
            <span class="mqs-icon-glyph" aria-hidden="true">${getTypeIcon('recent')}</span>
            <span class="mqs-row-label">${highlightMatches(entry.query, tokens)}</span>
            ${typeLabel ? `<span class="mqs-row-type">${escapeHtml(typeLabel)}</span>` : ''}
          </button>
          <button type="button" class="mqs-recent-remove" data-mqs-remove-recent="${realIdx}"
            aria-label="Remove ${escapeHtml(entry.query)} from recent searches" title="Remove">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
              <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
            </svg>
          </button>
        </div>
      `;
    }

    function buildItemRowHtml(item, navIdx, tokens, customLabel) {
      const isSel = navIdx === selectedIdx;
      const typeLabel = SINGULAR_CAT[item.category] || item.category;
      const labelText = customLabel || item.title;
      return `
        <button type="button" role="option" id="mqs-opt-${navIdx}" aria-selected="${isSel}"
          class="mqs-row${isSel ? ' is-selected' : ''}" data-mqs-nav-row="${navIdx}" data-mqs-nav-idx="${navIdx}">
          <span class="mqs-icon-glyph" aria-hidden="true">${getTypeIcon(item.category)}</span>
          <span class="mqs-row-label">${highlightMatches(labelText, tokens)}</span>
          <span class="mqs-row-type">${escapeHtml(typeLabel)}</span>
        </button>
      `;
    }

    function renderResults() {
      const trimmed = query.trim();
      const tokens = trimmed.toLowerCase().split(/\s+/).filter(Boolean);

      navActions = [];
      let html = '';

      if (!tokens.length) {
        if (recents.length > 0) {
          html += `
            <div class="mqs-section-head">
              <span>Recent</span>
              <button type="button" class="mqs-clear-all-btn" id="mqs-clear-all-recents">Clear</button>
            </div>
            <div class="mqs-group-list">
          `;
          recents.forEach((entry, rIdx) => {
            const navIdx = navActions.length;
            navActions.push({ type: 'recent', entry });
            html += buildRecentRowHtml(entry, rIdx, navIdx, []);
          });
          html += `</div>`;
        }

        const trendingEntries = TRENDING_CONFIG
          .map((cfg) => ({ item: ITEM_MAP[cfg.itemId], label: cfg.label }))
          .filter((t) => Boolean(t.item));

        if (trendingEntries.length > 0) {
          html += `
            <div class="mqs-section-head${recents.length > 0 ? ' mqs-section-divider' : ''}">
              <span class="mqs-section-title">${getTypeIcon('trending')}<span>Trending</span></span>
            </div>
            <div class="mqs-group-list">
          `;
          trendingEntries.forEach(({ item, label }) => {
            const navIdx = navActions.length;
            navActions.push({ type: 'item', item, label });
            html += buildItemRowHtml(item, navIdx, [], label);
          });
          html += `</div>`;
        }
      } else {
        const filtered = computeFiltered();
        const matchingRecents = recents
          .map((entry, realIdx) => ({ entry, realIdx }))
          .filter(({ entry }) => {
            const hay = `${entry.query} ${entry.category || ''}`.toLowerCase();
            return tokens.every((tok) => hay.includes(tok));
          });

        if (matchingRecents.length > 0) {
          html += `
            <div class="mqs-section-head"><span>Recent</span></div>
            <div class="mqs-group-list">
          `;
          matchingRecents.forEach(({ entry, realIdx }) => {
            const navIdx = navActions.length;
            navActions.push({ type: 'recent', entry });
            html += buildRecentRowHtml(entry, realIdx, navIdx, tokens);
          });
          html += `</div>`;
        }

        if (filtered.length > 0) {
          html += `
            <div class="mqs-section-head${matchingRecents.length > 0 ? ' mqs-section-divider' : ''}">
              <span>Suggestions</span>
            </div>
            <div class="mqs-group-list">
          `;
          filtered.forEach((item) => {
            const navIdx = navActions.length;
            navActions.push({ type: 'item', item });
            html += buildItemRowHtml(item, navIdx, tokens, null);
          });
          html += `</div>`;
        } else {
          html += `<div class="mqs-empty">No results for &ldquo;${escapeHtml(trimmed)}&rdquo;</div>`;
        }
      }

      if (selectedIdx >= navActions.length) {
        selectedIdx = Math.max(0, navActions.length - 1);
      }

      resultsWrap.innerHTML = html;
      syncSelectionDom();

      const clearAllBtn = document.getElementById('mqs-clear-all-recents');
      if (clearAllBtn) {
        clearAllBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          clearAllRecents();
        });
      }

      resultsWrap.querySelectorAll('[data-mqs-remove-recent]').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const idx = Number(btn.getAttribute('data-mqs-remove-recent'));
          if (!Number.isNaN(idx)) removeRecentAt(idx);
        });
      });

      resultsWrap.querySelectorAll('[data-mqs-nav-idx]').forEach((el) => {
        el.addEventListener('mouseenter', () => {
          const next = Number(el.getAttribute('data-mqs-nav-idx'));
          if (!Number.isNaN(next) && next !== selectedIdx) {
            selectedIdx = next;
            syncSelectionDom();
          }
        });
        el.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const idx = Number(el.getAttribute('data-mqs-nav-idx'));
          const act = navActions[idx];
          if (!act) return;
          if (act.type === 'recent') runRecent(act.entry);
          else runItem(act.item, true, act.label);
        });
      });
    }

    function syncSelectionDom() {
      resultsWrap.querySelectorAll('[data-mqs-nav-row]').forEach((row) => {
        const idx = Number(row.getAttribute('data-mqs-nav-row'));
        const active = idx === selectedIdx;
        row.classList.toggle('is-selected', active);
        const opt = row.hasAttribute('role') ? row : row.querySelector('[role="option"]');
        if (opt) opt.setAttribute('aria-selected', String(active));
      });
      if (navActions.length > 0 && isOpen) {
        inputEl.setAttribute('aria-activedescendant', `mqs-opt-${selectedIdx}`);
      } else {
        inputEl.removeAttribute('aria-activedescendant');
      }
    }

    function openSearch(presetQuery) {
      if (typeof window.__closeMediqMobileMenu === 'function') {
        window.__closeMediqMobileMenu();
      }
      if (typeof presetQuery === 'string' && presetQuery.trim()) {
        query = presetQuery.trim();
        inputEl.value = query;
      }
      if (window.matchMedia('(max-width: 639px)').matches) {
        wrap.classList.add('is-mobile-open');
      }
      isOpen = true;
      selectedIdx = 0;
      recents = loadRecents();
      renderResults();
      syncControlsState();
      inputEl.focus({ preventScroll: true });
    }

    function closeSearch(opts = {}) {
      if (!isOpen && !wrap.classList.contains('is-mobile-open')) return;
      isOpen = false;
      wrap.classList.remove('is-mobile-open');
      syncControlsState();
      if (opts.blur && document.activeElement === inputEl) {
        inputEl.blur();
      }
    }

    inputEl.addEventListener('focus', () => {
      if (!isOpen) {
        isOpen = true;
        selectedIdx = 0;
        recents = loadRecents();
        renderResults();
        syncControlsState();
      }
    });

    inputEl.addEventListener('click', () => {
      if (!isOpen) {
        isOpen = true;
        selectedIdx = 0;
        recents = loadRecents();
        renderResults();
        syncControlsState();
      }
    });

    inputEl.addEventListener('input', () => {
      query = inputEl.value;
      selectedIdx = 0;
      if (!isOpen) isOpen = true;
      renderResults();
      syncControlsState();
    });

    clearBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      query = '';
      inputEl.value = '';
      selectedIdx = 0;
      if (!isOpen) isOpen = true;
      renderResults();
      syncControlsState();
      inputEl.focus({ preventScroll: true });
    });

    if (mobileCloseBtn) {
      mobileCloseBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeSearch({ blur: true });
      });
    }

    backdrop.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      closeSearch({ blur: true });
    });

    wrap.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (isOpen || wrap.classList.contains('is-mobile-open')) {
          e.preventDefault();
          e.stopPropagation();
          closeSearch({ blur: true });
        }
        return;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        e.stopPropagation();
        if (!isOpen) {
          openSearch();
          return;
        }
        if (!navActions.length) return;
        selectedIdx = (selectedIdx + 1) % navActions.length;
        syncSelectionDom();
        resultsWrap.querySelector(`[data-mqs-nav-row="${selectedIdx}"]`)?.scrollIntoView({ block: 'nearest' });
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        e.stopPropagation();
        if (!isOpen || !navActions.length) return;
        selectedIdx = (selectedIdx - 1 + navActions.length) % navActions.length;
        syncSelectionDom();
        resultsWrap.querySelector(`[data-mqs-nav-row="${selectedIdx}"]`)?.scrollIntoView({ block: 'nearest' });
        return;
      }
      if (e.key === 'Enter' && isOpen) {
        e.preventDefault();
        e.stopPropagation();
        const act = navActions[selectedIdx];
        if (act) {
          if (act.type === 'recent') runRecent(act.entry);
          else runItem(act.item, true, act.label);
        } else if (query.trim()) {
          addRecent(query.trim());
          renderResults();
        }
      }
    });

    dropdown.addEventListener('wheel', (e) => e.stopPropagation(), { passive: true });

    document.addEventListener('pointerdown', (e) => {
      if (!isOpen && !wrap.classList.contains('is-mobile-open')) return;
      const target = e.target;
      if (target instanceof Node && wrap.contains(target)) return;
      if (mobileTrigger && target instanceof Node && mobileTrigger.contains(target)) return;
      closeSearch({ blur: true });
    });

    document.addEventListener('focusin', (e) => {
      if (!isOpen) return;
      const target = e.target;
      if (target instanceof Node && !wrap.contains(target) && target !== mobileTrigger) {
        closeSearch({ blur: false });
      }
    });

    window.addEventListener('resize', () => {
      if (!window.matchMedia('(max-width: 639px)').matches && wrap.classList.contains('is-mobile-open')) {
        wrap.classList.remove('is-mobile-open');
        syncControlsState();
      }
    }, { passive: true });

    window.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) closeSearch({ blur: true });
        else openSearch();
        return;
      }
      if (e.key === '/' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const tag = (e.target && e.target.tagName) || '';
        if (tag !== 'INPUT' && tag !== 'TEXTAREA' && tag !== 'SELECT' && !e.target?.isContentEditable) {
          e.preventDefault();
          openSearch();
        }
      }
    });

    document.querySelectorAll('[data-mediq-search-open]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (wrap.classList.contains('is-mobile-open')) {
          closeSearch({ blur: true });
        } else {
          openSearch();
        }
      });
    });

    syncControlsState();
    window.__openMediqSearch = openSearch;
    window.__closeMediqSearch = () => closeSearch({ blur: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildSearchUi);
  } else {
    buildSearchUi();
  }
})();
