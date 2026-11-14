/**
 * MEDIQ Global Action Search Bar & Command Palette (⌘K)
 * Inspired by 21st.dev Action Search Bar + Command Menu.
 * Connects directly to every section, About slide, Product catalog item,
 * 3D Service Book volume, Brand profile/brochure, Resource page, News card,
 * and Contact inquiry form across the site.
 */
(function initMediqGlobalSearch() {
  'use strict';

  const CATEGORIES = ['All', 'Sections', 'Products', 'Services', 'Brands', 'Resources', 'News', 'About', 'Contact'];

  const CAT_COLORS = {
    Sections: '#72c5f8',
    About: '#34d399',
    Products: '#38bdf8',
    Services: '#9bd8ff',
    Brands: '#fbbf24',
    Resources: '#a78bfa',
    News: '#c5a880',
    Contact: '#fb7185',
  };

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
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
      keywords: ['emv', 'rayone', 'barrett', 'monovision', 'rao200e', 'galaxy', 'spiral'],
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
      desc: 'A-constants, Barret EMV monographs, Ophteis & AEON clinical dossiers',
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

  const ICONS = {
    Sections: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>',
    About: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    Products: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>',
    Services: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>',
    Brands: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>',
    Resources: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',
    News: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/></svg>',
    Contact: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>',
  };

  function injectStyles() {
    if (document.getElementById('mediq-search-styles')) return;
    const style = document.createElement('style');
    style.id = 'mediq-search-styles';
    style.textContent = `
      #mediq-search-modal {
        position: fixed;
        inset: 0;
        z-index: 9999;
        display: flex;
        align-items: flex-start;
        justify-content: center;
        padding: clamp(56px, 9vh, 108px) 16px 24px;
        background: rgba(4, 11, 26, 0.72);
        backdrop-filter: blur(14px);
        -webkit-backdrop-filter: blur(14px);
        opacity: 0;
        pointer-events: none;
        transition: opacity 220ms cubic-bezier(0.16, 1, 0.3, 1);
      }
      #mediq-search-modal.is-open {
        opacity: 1;
        pointer-events: auto;
      }
      #mediq-search-panel {
        width: 100%;
        max-width: 720px;
        border-radius: 20px;
        border: 1px solid rgba(114, 197, 248, 0.28);
        background: linear-gradient(165deg, rgba(10, 29, 64, 0.96) 0%, rgba(5, 16, 38, 0.98) 100%);
        box-shadow: 0 36px 100px rgba(0, 0, 0, 0.85), 0 0 60px rgba(58, 160, 219, 0.14);
        overflow: hidden;
        transform: translateY(-10px) scale(0.98);
        transition: transform 240ms cubic-bezier(0.16, 1, 0.3, 1);
      }
      #mediq-search-modal.is-open #mediq-search-panel {
        transform: translateY(0) scale(1);
      }
      .mqs-input-row {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 14px 18px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      }
      #mediq-search-input {
        flex: 1;
        min-width: 0;
        background: transparent;
        border: 0;
        outline: none;
        color: #f6f2ea;
        font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
        font-size: 15px;
        font-weight: 500;
      }
      #mediq-search-input::placeholder {
        color: rgba(246, 242, 234, 0.42);
      }
      .mqs-cats {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 10px 16px;
        overflow-x: auto;
        border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        background: rgba(6, 17, 40, 0.65);
        scrollbar-width: none;
      }
      .mqs-cats::-webkit-scrollbar { display: none; }
      .mqs-cat-btn {
        flex-shrink: 0;
        border-radius: 9999px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        background: rgba(255, 255, 255, 0.04);
        color: rgba(246, 242, 234, 0.7);
        padding: 4px 11px;
        font-family: 'JetBrains Mono', monospace;
        font-size: 10.5px;
        font-weight: 600;
        letter-spacing: 0.06em;
        cursor: pointer;
        transition: all 150ms ease;
      }
      .mqs-cat-btn:hover {
        border-color: rgba(114, 197, 248, 0.45);
        color: #fff;
      }
      .mqs-cat-btn.is-active {
        border-color: #72c5f8;
        background: rgba(58, 160, 219, 0.22);
        color: #ffffff;
        box-shadow: 0 0 16px rgba(58, 160, 219, 0.22);
      }
      #mediq-search-results {
        max-height: min(410px, 56vh);
        overflow-y: auto;
        padding: 8px;
        overscroll-behavior: contain;
      }
      .mqs-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        width: 100%;
        text-align: left;
        border: 1px solid transparent;
        background: transparent;
        border-radius: 12px;
        padding: 10px 12px;
        cursor: pointer;
        color: #f6f2ea;
        transition: background 140ms ease, border-color 140ms ease, transform 140ms ease;
      }
      .mqs-row.is-selected {
        background: rgba(58, 160, 219, 0.16);
        border-color: rgba(114, 197, 248, 0.35);
      }
      .mqs-row-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 34px;
        height: 34px;
        flex-shrink: 0;
        border-radius: 10px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        background: rgba(255, 255, 255, 0.04);
      }
      .mqs-row-title {
        font-size: 13.5px;
        font-weight: 600;
        line-height: 1.25;
        color: #f6f2ea;
      }
      .mqs-row.is-selected .mqs-row-title {
        color: #ffffff;
      }
      .mqs-row-desc {
        margin-top: 2px;
        font-size: 11.5px;
        line-height: 1.35;
        color: rgba(246, 242, 234, 0.56);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .mqs-row-meta {
        display: flex;
        align-items: center;
        gap: 6px;
        flex-shrink: 0;
        font-family: 'JetBrains Mono', monospace;
        font-size: 10px;
      }
      .mqs-badge {
        border-radius: 6px;
        padding: 2px 7px;
        background: rgba(255, 255, 255, 0.06);
        color: #72c5f8;
        font-weight: 600;
      }
      .mqs-footer {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        padding: 9px 16px;
        border-top: 1px solid rgba(255, 255, 255, 0.08);
        background: rgba(4, 12, 29, 0.88);
        font-family: 'JetBrains Mono', monospace;
        font-size: 10px;
        color: rgba(246, 242, 234, 0.52);
      }
      .mqs-kbd {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 1px 5px;
        border-radius: 5px;
        border: 1px solid rgba(255, 255, 255, 0.16);
        background: rgba(255, 255, 255, 0.06);
        color: rgba(246, 242, 234, 0.8);
        font-size: 9.5px;
      }
    `;
    document.head.appendChild(style);
  }

  function buildSearchUi() {
    if (document.getElementById('mediq-search-modal')) return;
    injectStyles();

    const modal = document.createElement('div');
    modal.id = 'mediq-search-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', 'Search MEDIQ website');

    modal.innerHTML = `
      <div id="mediq-search-panel">
        <div class="mqs-input-row">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#72c5f8" stroke-width="2.2" style="flex-shrink:0">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input id="mediq-search-input" type="text" autocomplete="off" spellcheck="false"
            placeholder="Search products, IOLs, 3D books, news, resources, or sections..." />
          <button id="mediq-search-clear" type="button" aria-label="Clear search"
            style="display:none;background:rgba(255,255,255,0.08);border:0;color:#f6f2ea;border-radius:8px;padding:4px 8px;font-size:11px;cursor:pointer;">Clear</button>
          <button id="mediq-search-close" type="button" aria-label="Close search" class="mqs-kbd" style="cursor:pointer;padding:3px 7px;">ESC</button>
        </div>
        <div class="mqs-cats" id="mediq-search-cats"></div>
        <div id="mediq-search-results" role="listbox"></div>
        <div class="mqs-footer">
          <span><span class="mqs-kbd">↑</span> <span class="mqs-kbd">↓</span> navigate &middot; <span class="mqs-kbd">↵</span> open destination</span>
          <span id="mediq-search-count">0 results</span>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const inputEl = document.getElementById('mediq-search-input');
    const clearBtn = document.getElementById('mediq-search-clear');
    const closeBtn = document.getElementById('mediq-search-close');
    const catsWrap = document.getElementById('mediq-search-cats');
    const resultsWrap = document.getElementById('mediq-search-results');
    const countEl = document.getElementById('mediq-search-count');

    let isOpen = false;
    let query = '';
    let activeCat = 'All';
    let selectedIdx = 0;
    let filtered = [];

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
        if (titleL.startsWith(tok) || codeL === tok) score += 10;
        else if (titleL.includes(tok)) score += 6;
        else if (kwL.includes(tok)) score += 4;
        else score += 2;
      }
      return score;
    }

    function computeFiltered() {
      const tokens = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
      const pool = activeCat === 'All' ? ITEMS : ITEMS.filter((it) => it.category === activeCat);
      if (!tokens.length) return pool.slice();
      return pool
        .map((it) => ({ item: it, score: scoreItem(it, tokens) }))
        .filter((r) => r.score > 0)
        .sort((a, b) => b.score - a.score)
        .map((r) => r.item);
    }

    function executeItem(item) {
      if (!item) return;
      closeSearch();
      try {
        item.run();
      } catch (_) {}
    }

    function renderCats() {
      catsWrap.innerHTML = CATEGORIES.map(
        (cat) =>
          `<button type="button" class="mqs-cat-btn${cat === activeCat ? ' is-active' : ''}" data-mqs-cat="${cat}">${cat}</button>`
      ).join('');
      catsWrap.querySelectorAll('[data-mqs-cat]').forEach((btn) => {
        btn.addEventListener('click', () => {
          activeCat = btn.getAttribute('data-mqs-cat') || 'All';
          selectedIdx = 0;
          renderCats();
          renderResults();
          inputEl.focus();
        });
      });
    }

    function renderResults() {
      filtered = computeFiltered();
      if (selectedIdx >= filtered.length) selectedIdx = Math.max(0, filtered.length - 1);
      countEl.textContent = `${filtered.length} ${filtered.length === 1 ? 'destination' : 'destinations'}`;
      clearBtn.style.display = query.length ? 'inline-block' : 'none';

      if (!filtered.length) {
        resultsWrap.innerHTML = `
          <div style="padding:36px 16px;text-align:center;color:rgba(246,242,234,0.55);font-size:13px;">
            No matches for &ldquo;${escapeHtml(query)}&rdquo;. Try searching <span style="color:#72c5f8">RayOne</span>, <span style="color:#72c5f8">Ophteis</span>, <span style="color:#72c5f8">Book</span>, <span style="color:#72c5f8">APVRS</span>, or <span style="color:#72c5f8">FDA</span>.
          </div>
        `;
        return;
      }

      resultsWrap.innerHTML = filtered
        .map((item, idx) => {
          const col = CAT_COLORS[item.category] || '#72c5f8';
          const isSel = idx === selectedIdx;
          return `
            <button type="button" role="option" aria-selected="${isSel}" data-mqs-idx="${idx}"
              class="mqs-row${isSel ? ' is-selected' : ''}">
              <div style="display:flex;align-items:center;gap:12px;min-width:0;flex:1;">
                <span class="mqs-row-icon" style="color:${col};">${ICONS[item.category] || ICONS.Sections}</span>
                <div style="min-width:0;flex:1;">
                  <div class="mqs-row-title">${escapeHtml(item.title)}</div>
                  <div class="mqs-row-desc">${escapeHtml(item.desc)}</div>
                </div>
              </div>
              <div class="mqs-row-meta">
                <span class="mqs-badge" style="color:${col};">${escapeHtml(item.code)}</span>
                <span style="color:rgba(246,242,234,0.45);min-width:64px;text-align:right;">${escapeHtml(item.tag)}</span>
              </div>
            </button>
          `;
        })
        .join('');

      resultsWrap.querySelectorAll('.mqs-row').forEach((row) => {
        row.addEventListener('mouseenter', () => {
          const next = Number(row.getAttribute('data-mqs-idx'));
          if (!Number.isNaN(next) && next !== selectedIdx) {
            const prevRow = resultsWrap.querySelector(`.mqs-row[data-mqs-idx="${selectedIdx}"]`);
            if (prevRow) {
              prevRow.classList.remove('is-selected');
              prevRow.setAttribute('aria-selected', 'false');
            }
            selectedIdx = next;
            row.classList.add('is-selected');
            row.setAttribute('aria-selected', 'true');
          }
        });
        row.addEventListener('click', () => {
          const idx = Number(row.getAttribute('data-mqs-idx'));
          executeItem(filtered[idx]);
        });
      });
    }

    function openSearch(presetCategory) {
      if (typeof presetCategory === 'string' && CATEGORIES.includes(presetCategory)) {
        activeCat = presetCategory;
      }
      isOpen = true;
      selectedIdx = 0;
      renderCats();
      renderResults();
      modal.classList.add('is-open');
      setTimeout(() => inputEl.focus(), 20);
    }

    function closeSearch() {
      isOpen = false;
      modal.classList.remove('is-open');
    }

    inputEl.addEventListener('input', () => {
      query = inputEl.value;
      selectedIdx = 0;
      renderResults();
    });

    clearBtn.addEventListener('click', () => {
      query = '';
      inputEl.value = '';
      selectedIdx = 0;
      renderResults();
      inputEl.focus();
    });

    closeBtn.addEventListener('click', closeSearch);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeSearch();
    });
    modal.addEventListener('wheel', (e) => e.stopPropagation(), { passive: true });

    modal.addEventListener('keydown', (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        closeSearch();
        return;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        e.stopPropagation();
        if (!filtered.length) return;
        selectedIdx = (selectedIdx + 1) % filtered.length;
        renderResults();
        resultsWrap.querySelector(`.mqs-row[data-mqs-idx="${selectedIdx}"]`)?.scrollIntoView({ block: 'nearest' });
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        e.stopPropagation();
        if (!filtered.length) return;
        selectedIdx = (selectedIdx - 1 + filtered.length) % filtered.length;
        renderResults();
        resultsWrap.querySelector(`.mqs-row[data-mqs-idx="${selectedIdx}"]`)?.scrollIntoView({ block: 'nearest' });
        return;
      }
      if (e.key === 'Enter' && filtered[selectedIdx]) {
        e.preventDefault();
        e.stopPropagation();
        executeItem(filtered[selectedIdx]);
      }
    });

    window.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) closeSearch();
        else openSearch();
        return;
      }
      if (!isOpen && e.key === '/' && !e.metaKey && !e.ctrlKey && !e.altKey) {
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
        openSearch();
      });
    });

    window.__openMediqSearch = openSearch;
    window.__closeMediqSearch = closeSearch;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildSearchUi);
  } else {
    buildSearchUi();
  }
})();
