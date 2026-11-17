/* MediQ – site interactions */
(() => {
  const root = document.documentElement;

  // 0. Enforce Home (#hero) start on refresh / history restore (never keep old scroll/subpage)
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  const forceResetToHomeOnBoot = () => {
    if (window.location.hash) {
      try {
        history.replaceState(null, '', window.location.pathname + window.location.search);
      } catch (_) {}
    }
    if (typeof window.__resetAllSubpagesExcept === 'function') {
      window.__resetAllSubpagesExcept(null);
    }
    if (typeof window.__unlockOuterPageScroll === 'function') {
      window.__unlockOuterPageScroll();
    }
    if (typeof window.grailSnapTo === 'function') {
      window.grailSnapTo(0);
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  };
  forceResetToHomeOnBoot();
  window.addEventListener('pageshow', (e) => {
    if (e.persisted || window.scrollY > 4) {
      forceResetToHomeOnBoot();
    }
  });
  window.addEventListener('load', () => {
    requestAnimationFrame(() => {
      if (typeof window.__isAnyMediqSubpageOpen !== 'function' || !window.__isAnyMediqSubpageOpen()) {
        forceResetToHomeOnBoot();
      }
    });
  }, { once: true });

  // 1. Trigger entrance animations once fonts/image are ready
  const ready = () => requestAnimationFrame(() => document.body.classList.add('is-ready'));
  if (document.fonts && document.fonts.ready) {
    Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 800))]).then(ready);
  } else {
    window.addEventListener('load', ready);
  }

  // 2. Mobile / tablet menu & desktop dropdown accessibility helpers
  const toggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('mobile-menu');
  const panel = document.getElementById('mobile-panel');
  const searchTriggerBtn = document.getElementById('mediq-search-trigger');
  const lines = toggle ? toggle.querySelectorAll('.burger-line') : [];

  const setMenu = (open) => {
    if (!toggle || !menu || !panel) return;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.classList.toggle('opacity-0', !open);
    menu.classList.toggle('pointer-events-none', !open);
    panel.classList.toggle('-translate-y-3', !open);
    if (searchTriggerBtn) {
      searchTriggerBtn.classList.toggle('max-lg:opacity-0', open);
      searchTriggerBtn.classList.toggle('max-lg:pointer-events-none', open);
    }
    root.classList.toggle('overflow-hidden', open);
    if (lines.length >= 2) {
      lines[0].style.transform = open ? 'translateY(5px) rotate(45deg)' : '';
      lines[1].style.transform = open ? 'translateY(-5px) rotate(-45deg)' : '';
      lines[1].style.width = open ? '1.5rem' : '';
    }
  };

  if (toggle && menu) {
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isCurrentlyOpen = toggle.getAttribute('aria-expanded') === 'true' && !menu.classList.contains('pointer-events-none');
      setMenu(!isCurrentlyOpen);
    });
    menu.addEventListener('click', (e) => {
      if (e.target === menu || e.target.closest('.mobile-link')) {
        setMenu(false);
      }
    });
    window.matchMedia('(min-width: 1024px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setMenu(false);
        toggle.focus();
      }
    });
  }
  if (searchTriggerBtn) {
    searchTriggerBtn.addEventListener('click', () => setMenu(false));
  }

  // Desktop dropdown accessibility: aria-expanded sync, instant close on selection & Escape support
  document.querySelectorAll('#site-header li.group').forEach((groupLi) => {
    const trigger = groupLi.querySelector('a[aria-haspopup="true"]');
    const dropdown = groupLi.querySelector('.nav-dropdown-panel');
    if (!trigger || !dropdown) return;
    const syncExpanded = (open) => trigger.setAttribute('aria-expanded', String(open));
    groupLi.addEventListener('mouseenter', () => { groupLi.classList.remove('is-dropdown-closed'); syncExpanded(true); });
    groupLi.addEventListener('mouseleave', () => { groupLi.classList.remove('is-dropdown-closed'); syncExpanded(false); });
    groupLi.addEventListener('focusin', () => syncExpanded(true));
    groupLi.addEventListener('focusout', (e) => {
      if (!groupLi.contains(e.relatedTarget)) {
        groupLi.classList.remove('is-dropdown-closed');
        syncExpanded(false);
      }
    });
    groupLi.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        groupLi.classList.add('is-dropdown-closed');
        syncExpanded(false);
        if (document.activeElement && groupLi.contains(document.activeElement)) {
          trigger.focus();
        }
      }
    });
    dropdown.querySelectorAll('a').forEach((subLink) => {
      subLink.addEventListener('click', () => {
        groupLi.classList.add('is-dropdown-closed');
        syncExpanded(false);
        if (document.activeElement && groupLi.contains(document.activeElement)) {
          document.activeElement.blur();
        }
      });
    });
  });

  // 3. Header translucent at top of hero, crisp high-contrast frosted navy on scroll
  const bar = document.getElementById('header-bar');
  if (bar) {
    const onScroll = () => {
      const scrolled = window.scrollY > 40;
      bar.classList.toggle('bg-[#0a1d40]/92', scrolled);
      bar.classList.toggle('bg-[#0a1d40]/45', !scrolled);
      bar.classList.toggle('border-sky/20', scrolled);
      bar.classList.toggle('border-white/10', !scrolled);
      bar.classList.toggle('shadow-[0_10px_36px_rgba(3,10,24,0.48)]', scrolled);
      bar.classList.toggle('shadow-[0_4px_24px_rgba(0,0,0,0.3)]', !scrolled);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // 4. Subtle pointer parallax on the hero image (fine pointers only)
  const parallax = document.getElementById('hero-parallax');
  const fine = window.matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)');
  if (parallax && fine.matches) {
    const hero = document.getElementById('hero');
    hero.addEventListener('pointermove', (e) => {
      const r = hero.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      parallax.style.transform = `translate3d(${x * -18}px, ${y * -12}px, 0)`;
    });
    hero.addEventListener('pointerleave', () => { parallax.style.transform = ''; });
  }

  // 5. Page / Section Transitions & Scroll-Triggered Reveals
  const scrollItems = document.querySelectorAll('.scroll-reveal');
  if ('IntersectionObserver' in window && scrollItems.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        } else if (entry.boundingClientRect.top > window.innerHeight * 0.92 || entry.boundingClientRect.bottom < 0) {
          entry.target.classList.remove('is-visible');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    scrollItems.forEach((el) => io.observe(el));
  } else {
    scrollItems.forEach((el) => el.classList.add('is-visible'));
  }

  // 5b. Active Page Section Horizon Transition & Navbar Active State
  const pageSections = document.querySelectorAll('.page-transition-section, .page-snap-section');
  const trackedNavTargets = [
    { id: 'hero', navId: 'nav-home' },
    { id: 'about', navId: 'nav-about' },
    { id: 'products', navId: 'nav-products' },
    { id: 'brands', navId: 'nav-brands' },
    { id: 'distribution', navId: 'nav-services' },
    { id: 'resources', navId: 'nav-resources' },
    { id: 'activities', navId: 'nav-news' },
    { id: 'contact', navId: 'nav-contact' },
  ];
  const navLinks = document.querySelectorAll('.nav-link, .tubelight-pill, .spotlight-pill');
  const pageDotItems = document.querySelectorAll('.page-dot-item');
  const pageTargetIds = [
    'hero',
    'about',
    'products',
    'brands',
    'distribution',
    'resources',
    'activities',
    'contact',
    'site-footer',
  ];

  if ('IntersectionObserver' in window && pageSections.length) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle('is-page-active', entry.isIntersecting);
      });
    }, { threshold: 0.08, rootMargin: '-60px 0px -10% 0px' });
    pageSections.forEach((sec) => sectionObserver.observe(sec));
  }

  // Shared pre-rendered soft puff sprite cache (replaces 1000s of per-frame createRadialGradient allocations)
  const __smokeSpriteCache = new Map();
  window.__getMediqSmokeSprite = function(r, g, b) {
    const key = r + ',' + g + ',' + b;
    let sprite = __smokeSpriteCache.get(key);
    if (sprite) return sprite;
    sprite = document.createElement('canvas');
    sprite.width = 128;
    sprite.height = 128;
    const sctx = sprite.getContext('2d');
    const grad = sctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, 'rgba(' + r + ',' + g + ',' + b + ',1)');
    grad.addColorStop(0.5, 'rgba(' + r + ',' + g + ',' + b + ',0.44)');
    grad.addColorStop(1, 'rgba(' + r + ',' + g + ',' + b + ',0)');
    sctx.fillStyle = grad;
    sctx.fillRect(0, 0, 128, 128);
    __smokeSpriteCache.set(key, sprite);
    return sprite;
  };

  let cachedNavOffsets = [];
  let cachedPageOffsets = [];
  let lastActiveNavId = '';
  let lastActivePageId = '';

  const refreshNavSectionOffsets = () => {
    cachedNavOffsets = trackedNavTargets.map((item) => {
      const el = document.getElementById(item.id);
      if (!el || el.classList.contains('hidden')) return null;
      return { navId: item.navId, top: el.offsetTop };
    }).filter(Boolean);
    cachedPageOffsets = pageTargetIds.map((pid) => {
      const el = document.getElementById(pid);
      if (!el || el.classList.contains('hidden')) return null;
      return { pid, top: el.offsetTop };
    }).filter(Boolean);
  };
  window.__refreshNavSectionOffsets = refreshNavSectionOffsets;
  window.addEventListener('resize', refreshNavSectionOffsets, { passive: true });
  window.addEventListener('load', refreshNavSectionOffsets, { passive: true });
  refreshNavSectionOffsets();

  const updateActiveNavOnScroll = (scrollYOverride) => {
    if (!cachedNavOffsets.length) refreshNavSectionOffsets();
    const sy = typeof scrollYOverride === 'number' ? scrollYOverride : window.scrollY;
    const scrollMid = sy + (window.innerHeight || 900) * 0.42;

    let activeNavId = 'nav-home';
    for (let i = 0; i < cachedNavOffsets.length; i++) {
      if (scrollMid >= cachedNavOffsets[i].top) activeNavId = cachedNavOffsets[i].navId;
    }
    if (activeNavId !== lastActiveNavId) {
      lastActiveNavId = activeNavId;
      navLinks.forEach((link) => {
        link.classList.toggle('is-active', link.id === activeNavId);
      });
    }

    let activePageId = 'hero';
    for (let i = 0; i < cachedPageOffsets.length; i++) {
      if (scrollMid >= cachedPageOffsets[i].top - 90) activePageId = cachedPageOffsets[i].pid;
    }
    if (activePageId !== lastActivePageId) {
      const prevPageId = lastActivePageId;
      lastActivePageId = activePageId;
      pageDotItems.forEach((dot) => {
        dot.classList.toggle('is-active', dot.getAttribute('data-target') === '#' + activePageId);
      });
      const siteHeaderEl = document.getElementById('site-header');
      const pageDotsEl = document.getElementById('page-dots-nav');
      const isLightPage = activePageId !== 'hero';
      if (siteHeaderEl) siteHeaderEl.classList.toggle('is-light-page', isLightPage);
      if (pageDotsEl) pageDotsEl.classList.toggle('is-light-page', isLightPage);

      // Leaving any section resets all departed sections back to their Landing Page (Slide 0)
      if (
        prevPageId &&
        activePageId !== prevPageId &&
        typeof window.__resetAllSubpagesExcept === 'function' &&
        (!window.__isAnyMediqSubpageOpen || !window.__isAnyMediqSubpageOpen())
      ) {
        const pageToKey = {
          about: 'about',
          products: 'products',
          brands: 'brands',
          distribution: 'services',
          resources: 'resources',
        };
        window.__resetAllSubpagesExcept(pageToKey[activePageId] || null);
      }
    }
  };
  window.__updateActiveNavOnScroll = updateActiveNavOnScroll;
  window.addEventListener('scroll', () => updateActiveNavOnScroll(), { passive: true });
  updateActiveNavOnScroll();

    const transitionCurtain = document.getElementById('page-transition-curtain');
  let curtainTimer = null;
  const sweepTransitionCurtain = () => {
    if (!transitionCurtain) return;
    clearTimeout(curtainTimer);
    transitionCurtain.classList.add('is-sweeping');
    curtainTimer = setTimeout(() => {
      transitionCurtain.classList.remove('is-sweeping');
    }, 240);
  };
  window.__sweepPageTransitionCurtain = sweepTransitionCurtain;

  // Floating Page Dots Click Handler (Always resets subpages to Landing Page Slide 0 & unlocks outer scroll)
  pageDotItems.forEach((dot) => {
    dot.addEventListener('click', () => {
      const targetSelector = dot.getAttribute('data-target');
      if (!targetSelector) return;
      const isHome = targetSelector === '#hero' || targetSelector === '#top';
      const targetEl = isHome ? (document.getElementById('hero') || document.body) : document.querySelector(targetSelector);
      if (!targetEl) return;

      if (typeof window.__resetAllSubpagesExcept === 'function') {
        window.__resetAllSubpagesExcept(null);
      }
      if (typeof window.__unlockOuterPageScroll === 'function') {
        window.__unlockOuterPageScroll();
      }

      sweepTransitionCurtain();

      if (typeof window.grailScrollTo === 'function') {
        window.grailScrollTo(isHome ? 0 : targetEl);
      } else if (isHome) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // 5c. Smooth Page Navigation Curtain Sweep & Landing-Page Reset on Anchor Clicks
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;

      const isHomeHref = (href === '#top' || href === '#hero');
      const resolvedHref = href === '#news' ? '#activities' : href;
      const targetEl = isHomeHref
        ? (document.getElementById('hero') || document.getElementById('top') || document.body)
        : document.querySelector(resolvedHref);
      if (!targetEl) return;

      // Detect whether this anchor explicitly targets a subpage (Slide >= 1)
      const slideTargetAttr = anchor.getAttribute('data-slide-target');
      const prodSlideAttr = anchor.getAttribute('data-product-slide');
      const deckTargetAttr = anchor.getAttribute('data-deck-target');
      const hasExplicitSubpageAttr =
        (slideTargetAttr !== null && parseInt(slideTargetAttr, 10) >= 1) ||
        (prodSlideAttr !== null && parseInt(prodSlideAttr, 10) >= 1) ||
        (deckTargetAttr !== null && parseInt((deckTargetAttr.split(':')[1] || '0'), 10) >= 1);
      const justOpenedSubpageInline =
        (performance.now() - (window.__lastExplicitSubpageOpenTime || -9999)) < 90;

      e.preventDefault();

      // Close mobile menu BEFORE scrolling
      if (toggle && toggle.getAttribute('aria-expanded') === 'true') {
        setMenu(false);
      }

      // If this is an explicit subpage trigger (e.g., About -> Foundation, Services -> Product Marketing),
      // the subpage controller already aligned & locked the section; do not reset or run unlocked smooth scroll.
      if (hasExplicitSubpageAttr || (!isHomeHref && justOpenedSubpageInline)) {
        return;
      }

      // Top-level navigation (Home, About MEDIQ, Products, Brands, Services, Resources, Contact, Hero CTAs, Footer):
      // Reset ALL sections back to their specific Landing Page (Slide 0) and unlock main-page scrolling!
      if (typeof window.__resetAllSubpagesExcept === 'function') {
        window.__resetAllSubpagesExcept(null);
      }
      if (typeof window.__unlockOuterPageScroll === 'function') {
        window.__unlockOuterPageScroll();
      }

      sweepTransitionCurtain();

      // Trigger reveal animations inside target page section without delaying navigation
      if (targetEl.querySelectorAll) {
        const hiddenReveals = targetEl.querySelectorAll('.scroll-reveal:not(.is-visible)');
        if (hiddenReveals.length) {
          requestAnimationFrame(() => {
            hiddenReveals.forEach((el) => el.classList.add('is-visible'));
          });
        }
      }

      if (typeof window.grailScrollTo === 'function') {
        window.grailScrollTo(isHomeHref ? 0 : targetEl);
      } else if (isHomeHref) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // 6. Rayner Products Showcase Controller inside #about (Boss's Dropdown & Dynamic Reveal Card)
  const RAYNER_PRODUCTS = {
    galaxy: {
      id: 'galaxy',
      num: '01 / 05',
      title: 'RayOne® Galaxy & Galaxy Toric',
      category: 'Non-Diffractive Full Range',
      badge: "World's First Spiral IOL",
      model: 'RAO605G · RAO615X · UK CA & CE Certified',
      image: 'assets/rayner/galaxy.webp',
      modelType: 'galaxy',
      desc: 'Proprietary AI optical design replaces concentric diffractive rings with a continuous non-diffractive spiral surface. Transmits 100% of incident light directly to the retina with 0% light loss, delivering seamless full-range vision from 33cm to infinity with virtually zero dysphotopsia.',
      specs: [
        { label: 'Optic Design', val: 'Continuous Spiral' },
        { label: 'Light Efficiency', val: '100% Transmitted (0% Loss)' },
        { label: 'Delivery Platform', val: 'Lock & Roll® 1.65 mm' },
        { label: 'Dysphotopsia', val: '0.0% Photic Rings' }
      ],
      actions: {
        simLens: 'galaxy',
        hasDelivery3D: true,
        brochureIndex: 0
      }
    },
    emv: {
      id: 'emv',
      num: '02 / 05',
      title: 'RayOne® EMV & EMV Toric',
      category: 'Enhanced Monovision (EDOF)',
      badge: 'Controlled Spherical Aberration',
      model: 'RAO200E · RAO210T · FDA Registered',
      image: 'assets/rayner/emv.webp',
      modelType: 'emv',
      desc: 'Developed in partnership with Prof. Graham Barrett. Induces +0.20 µm of controlled positive spherical aberration to complement natural corneal profile. Smoothly extends depth of focus up to 1.5 D in the dominant eye and up to 2.25 D in a 1.0 D blended offset, preserving 100% monofocal contrast.',
      specs: [
        { label: 'Optic Design', val: 'Barrett Aberration Profile' },
        { label: 'Focal Depth', val: 'Up to 2.25 D Blended' },
        { label: 'Delivery Platform', val: 'Lock & Roll® Preloaded' },
        { label: 'Toric Stability', val: '1.83° Mean Rotation' }
      ],
      actions: {
        simLens: 'emv',
        hasClinicalLab: true,
        hasDelivery3D: true,
        brochureIndex: 0
      }
    },
    trifocal: {
      id: 'trifocal',
      num: '03 / 05',
      title: 'RayOne® Trifocal & Trifocal Toric',
      category: 'Diffractive Micro-Incision',
      badge: 'Patented 16-Ring Design',
      model: 'RAO600T · RAO610T · Micro-Incision',
      image: 'assets/rayner/trifocal.jpg',
      modelType: 'trifocal',
      desc: 'Reduces traditional 30+ diffractive rings to only 16 concentric steps, reducing light scatter and visual photic phenomena by over 40%. Efficiently splits light (50% distance, 20% intermediate at 66 cm, 30% near at 37 cm) through sub-2.0mm micro-incisions.',
      specs: [
        { label: 'Optic Design', val: '16-Step Diffractive Profile' },
        { label: 'Light Split', val: '50% Dist / 20% Int / 30% Near' },
        { label: 'Delivery Platform', val: 'Sub-2.0 mm Micro-Incision' },
        { label: 'Near Point', val: '37.5 cm Natural Reading' }
      ],
      actions: {
        simLens: 'trifocal',
        hasDelivery3D: true,
        brochureIndex: 0
      }
    },
    monofocal: {
      id: 'monofocal',
      num: '04 / 05',
      title: 'RayOne® Aspheric & Hydrophobic Monofocal',
      category: 'Standard of Care Monofocal',
      badge: 'Zero Glistenings · Pure Rayacryl',
      model: 'RAO100A · RAO100H · Ultra-Pure',
      image: 'assets/rayner/toric-carton-injector.png',
      modelType: 'galaxy',
      desc: 'Manufactured with proprietary Rayacryl copolymer boasting ultra-high biocompatibility and Abbe number of 56. Demonstrates zero glistenings over longitudinal clinical surveillance, delivering pristine contrast sensitivity in low-light and mesopic conditions.',
      specs: [
        { label: 'Material', val: 'Rayacryl Ultra-Pure Copolymer' },
        { label: 'Abbe Number', val: '56 (Lowest Chromatic Blur)' },
        { label: 'Delivery Platform', val: 'Lock & Roll® Preloaded' },
        { label: 'Incision Size', val: '1.65 mm to 1.80 mm' }
      ],
      actions: {
        simLens: 'monofocal',
        hasDelivery3D: true,
        brochureIndex: 0
      }
    },
    aeon: {
      id: 'aeon',
      num: '05 / 05',
      title: 'AEON® Ophthalmic Solutions',
      category: 'Preservative-Free Ocular Surface',
      badge: 'Preservative-Free · Cross-Linked HA',
      model: 'AEON Protect · Protect Plus · Repair',
      image: 'assets/rayner/aeon.jpg',
      modelType: 'aeon',
      desc: 'Premium preservative-free eye drop formulations engineered specifically for cataract and refractive surgery preparation and post-operative recovery. Utilizes advanced high molecular weight Sodium Hyaluronate (HA) with PEG 400 to accelerate epithelial healing and tear film stabilization.',
      specs: [
        { label: 'Formulation', val: '0.30% HA + PEG 400 & Vitamins' },
        { label: 'Preservative', val: '100% Preservative-Free' },
        { label: 'Packaging', val: 'Pure Flow Multi-Dose Bottle' },
        { label: 'Clinical Phase', val: 'Pre- & Post-Operative Corneal' }
      ],
      actions: {
        inquiryTopic: 'AEON Preservative-Free Drops',
        brochureIndex: 0
      }
    }
  };

  // ─── 4. RAYNER 3D PEDESTAL & INTERACTIVE PRODUCT ACCORDION CONTROLLER ─────────────
  const ACC_PRODUCTS = {
    galaxy: {
      image: 'assets/rayner/galaxy.webp',
      badge: "World's First Spiral IOL",
      pill1: "100% Light Transmission",
      pill2: "0.0% Photic Dysphotopsia",
      captionLeft: "RayOne® Galaxy · AI-Designed Spiral Intraocular Lens",
      captionRight: "Worthing, UK Engineered · MediQ Pharma"
    },
    emv: {
      image: 'assets/rayner/emv.webp',
      badge: "Barrett Aberration Profile",
      pill1: "+1.5D Extended Depth of Focus",
      pill2: "Natural Binocular Fusion",
      captionLeft: "RayOne® EMV & EMV Toric · Enhanced Monovision",
      captionRight: "Co-developed with Prof. Graham Barrett"
    },
    toric: {
      image: 'assets/rayner/toric-carton-injector.png',
      badge: "Sub-2.2mm Lock & Roll®",
      pill1: "1.83° Capsular Rotational Stability",
      pill2: "Anti-Vaulting Haptics (AVH™)",
      captionLeft: "RayOne® Toric & Lock & Roll® Preloaded Injector",
      captionRight: "Single-Handed Delivery · Worthing, UK"
    },
    aeon: {
      image: 'assets/rayner/aeon.jpg',
      badge: "Preservative-Free Ocular Care",
      pill1: "Cross-Linked CMC Formula",
      pill2: "Zero Corneal Toxicity · Rapid Healing",
      captionLeft: "AEON® Surgical Tear Protection Drops",
      captionRight: "Optimized Pre & Post Cataract Biometry"
    }
  };

  const pedestalStage = document.getElementById('pedestal-showcase-stage');
  const videoStage = document.getElementById('about-video-stage');
  const pedestalImg = document.getElementById('pedestal-product-img');
  const pedestalBox = document.getElementById('pedestal-product-box');
  const pedestalBadge = document.getElementById('pedestal-badge-text');
  const pedestalPill1 = document.getElementById('pedestal-spec-pill-1');
  const pedestalPill2 = document.getElementById('pedestal-spec-pill-2');
  const captionLeft = document.getElementById('about-caption-left');
  const captionRight = document.getElementById('about-caption-right');
  const spinBtn = document.getElementById('pedestal-spin-btn');
  const backToPedestalBtn = document.getElementById('vp-back-to-pedestal-btn');
  const accCards = document.querySelectorAll('.about-acc-card');

  let activeProductKey = 'galaxy';
  let isSpinning = false;
  let currentRotation = 0;

  const selectAboutProduct = (key) => {
    activeProductKey = key;

    // Update accordion cards visual state
    accCards.forEach((card) => {
      const match = card.getAttribute('data-product-key') === key;
      card.classList.toggle('is-active', match);
      card.classList.toggle('border-sky/50', match);
      card.classList.toggle('bg-[#0a1d40]/90', match);
      card.classList.toggle('shadow-[0_8px_30px_rgba(58,160,219,0.18)]', match);
      card.classList.toggle('border-white/10', !match);
      card.classList.toggle('bg-[#0a1d40]/60', !match);

      const drawer = card.querySelector('.acc-drawer');
      if (drawer) {
        drawer.classList.toggle('hidden', !match);
      }

      const icon = card.querySelector('.acc-toggle-icon');
      if (icon) {
        icon.classList.toggle('rotate-45', match);
        icon.classList.toggle('rotate-0', !match);
        icon.classList.toggle('text-white', match);
        icon.classList.toggle('text-white/70', !match);
      }

      const indicator = card.querySelector('.acc-indicator');
      if (indicator) {
        indicator.classList.toggle('border-sky/50', match);
        indicator.classList.toggle('bg-sky/20', match);
        indicator.classList.toggle('text-sky', match);
        indicator.classList.toggle('border-white/20', !match);
        indicator.classList.toggle('bg-white/[0.05]', !match);
        indicator.classList.toggle('text-cream/50', !match);
      }
    });

    if (key === 'film') {
      // Show Video Stage
      if (pedestalStage) pedestalStage.classList.add('hidden');
      if (videoStage) videoStage.classList.remove('hidden');

      if (captionLeft) captionLeft.textContent = 'The Ridley Innovation Centre · Worthing, United Kingdom';
      if (captionRight) captionRight.textContent = 'Rayner Innovation 4K Documentary';
    } else {
      // Pause video if playing
      const video = document.getElementById('about-video');
      if (video && !video.paused) {
        video.pause();
      }

      // Show Pedestal Stage
      if (videoStage) videoStage.classList.add('hidden');
      if (pedestalStage) pedestalStage.classList.remove('hidden');

      const data = ACC_PRODUCTS[key];
      if (data) {
        if (pedestalImg) {
          pedestalImg.classList.add('opacity-0', 'scale-95');
          setTimeout(() => {
            pedestalImg.src = data.image;
            pedestalImg.alt = data.badge;
            pedestalImg.classList.remove('opacity-0', 'scale-95');
          }, 180);
        }

        if (pedestalBadge) pedestalBadge.textContent = data.badge;
        if (pedestalPill1) pedestalPill1.textContent = data.pill1;
        if (pedestalPill2) pedestalPill2.textContent = data.pill2;
        if (captionLeft) captionLeft.textContent = data.captionLeft;
        if (captionRight) captionRight.textContent = data.captionRight;
      }
    }
  };

  // Click listener for accordion cards
  accCards.forEach((card) => {
    card.addEventListener('click', () => {
      const key = card.getAttribute('data-product-key');
      selectAboutProduct(key);
    });
  });

  // Back to pedestal button from video
  if (backToPedestalBtn) {
    backToPedestalBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      selectAboutProduct('galaxy');
    });
  }

  // 360 Spin button click handler
  if (spinBtn) {
    spinBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!pedestalImg) return;
      currentRotation += 360;
      pedestalImg.style.transition = 'transform 1s cubic-bezier(0.16, 1, 0.3, 1)';
      pedestalImg.style.transform = `rotateY(${currentRotation}deg)`;
      const spanText = document.getElementById('pedestal-spin-text');
      if (spanText) {
        spanText.textContent = 'Spinning...';
        setTimeout(() => { spanText.textContent = '360 Spin'; }, 1000);
      }
    });
  }

  // Interactive mouse/touch drag on pedestal product box
  if (pedestalBox) {
    let isDragging = false;
    let startX = 0;

    pedestalBox.addEventListener('pointerdown', (e) => {
      isDragging = true;
      startX = e.clientX;
      pedestalBox.style.animationPlayState = 'paused';
    });

    window.addEventListener('pointermove', (e) => {
      if (!isDragging || !pedestalImg) return;
      const delta = e.clientX - startX;
      startX = e.clientX;
      currentRotation += delta * 0.9;
      pedestalImg.style.transition = 'none';
      pedestalImg.style.transform = `rotateY(${currentRotation}deg)`;
    });

    window.addEventListener('pointerup', () => {
      if (isDragging) {
        isDragging = false;
        if (pedestalBox) pedestalBox.style.animationPlayState = 'running';
      }
    });
  }

  // Anchor links for #about and #products
  document.querySelectorAll('a[href="#about"], .page-dot-item[data-target="#about"]').forEach((link) => {
    link.addEventListener('click', () => {
      setTimeout(updateActiveNavOnScroll, 60);
    });
  });

  document.querySelectorAll('a[href="#products"], .page-dot-item[data-target="#products"]').forEach((link) => {
    link.addEventListener('click', () => {
      selectAboutProduct('galaxy');
      setTimeout(updateActiveNavOnScroll, 60);
    });
  });

  // ─── 4B. 2ND PAGE (#ABOUT) TWO-LAYER SMOKE CANVAS (Disabled on Plain White) ────
  function initAboutSmokeCanvas() {
    const canvas = document.getElementById('about-smoke-canvas');
    if (canvas) canvas.style.display = 'none';
    return;
  }
  function _disabledAboutSmokeCanvas() {
    const canvas = document.getElementById('about-smoke-canvas');
    if (!canvas || canvas._smokeActive) return;
    canvas._smokeActive = true;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const PALETTE = [
      [218, 229, 240],
      [230, 236, 242],
      [206, 222, 236],
      [238, 236, 230],
      [194, 214, 232]
    ];

    const reducedMotionMq = typeof window.matchMedia === 'function'
      ? window.matchMedia('(prefers-reduced-motion: reduce)')
      : { matches: false };

    let w = 1, h = 1, dpr = 0.5;
    let t = 0;

    function rand(min, max) {
      return min + Math.random() * (max - min);
    }

    function pickColor() {
      return PALETTE[Math.floor(Math.random() * PALETTE.length)];
    }

    function resize() {
      dpr = 0.5;
      const rect = canvas.getBoundingClientRect();
      w = Math.max(1, Math.floor(rect.width || window.innerWidth));
      h = Math.max(1, Math.floor(rect.height || window.innerHeight));
      const tw = Math.max(1, Math.round(w * dpr));
      const th = Math.max(1, Math.round(h * dpr));
      if (canvas.width !== tw || canvas.height !== th) {
        canvas.width = tw;
        canvas.height = th;
      }
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    class Puff {
      constructor(prewarm) { this.reset(prewarm); }
      reset(prewarm) {
        this.radius = rand(180, 420);
        this.x = rand(-this.radius * 0.25, w + this.radius * 0.25);
        this.y = prewarm ? rand(-this.radius * 0.1, h + this.radius * 0.3) : rand(h * 0.25, h + this.radius * 0.45);
        this.vx = rand(-0.22, 0.22);
        this.vy = -rand(0.14, 0.36);
        this.life = rand(600, 1400);
        this.age = prewarm ? Math.floor(rand(0, this.life)) : 0;
        this.maxOpacity = rand(0.06, 0.16);
        const [r, g, b] = pickColor();
        this.sprite = window.__getMediqSmokeSprite(r, g, b);
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.age++;
        if (this.age >= this.life || this.y < -this.radius * 1.2) this.reset(false);
      }
      draw(c) {
        const p = Math.min(1, Math.max(0, this.age / this.life));
        const alpha = this.maxOpacity * Math.sin(p * Math.PI);
        if (alpha <= 0.002) return;
        c.globalAlpha = alpha;
        c.drawImage(this.sprite, this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
      }
    }

    class Tendril {
      constructor(prewarm) { this.reset(prewarm); }
      reset(prewarm) {
        this.nodeCount = Math.floor(rand(16, 26));
        this.spacing = rand(18, 28);
        this.baseX = rand(w * 0.04, w * 0.96);
        const chainHeight = this.nodeCount * this.spacing;
        this.baseY = prewarm ? rand(h * 0.20, h + chainHeight * 0.75) : rand(h * 0.50, h + chainHeight * 0.85);
        this.vy = -rand(0.30, 0.65);
        this.vx = rand(-0.08, 0.08);
        this.swayFreq = rand(0.014, 0.032);
        this.swayOffset = rand(0, Math.PI * 2);
        this.sway = rand(18, 46);
        this.life = rand(320, 700);
        this.age = prewarm ? Math.floor(rand(0, this.life)) : 0;
        this.maxOpacity = rand(0.07, 0.22);
        const [r, g, b] = pickColor();
        this.sprite = window.__getMediqSmokeSprite(r, g, b);
        const baseR = rand(58, 90);
        const tipR = rand(28, 40);
        this.radii = Array.from({ length: this.nodeCount }, (_, i) => baseR + (tipR - baseR) * (this.nodeCount > 1 ? i / (this.nodeCount - 1) : 0));
      }
      update() {
        this.baseX += this.vx;
        this.baseY += this.vy;
        this.age++;
        if (this.age >= this.life || this.baseY - this.nodeCount * this.spacing < -140) this.reset(false);
      }
      draw(c, time) {
        const p = Math.min(1, Math.max(0, this.age / this.life));
        let lifeEnv = p < 0.22 ? p / 0.22 : (p > 0.72 ? (1 - p) / 0.28 : 1);
        if (lifeEnv <= 0.002) return;
        const n = this.nodeCount;
        for (let i = 0; i < n; i++) {
          const frac = n > 1 ? i / (n - 1) : 0;
          const alpha = this.maxOpacity * lifeEnv * Math.sin(frac * Math.PI);
          if (alpha <= 0.002) continue;
          const rad = this.radii[i];
          const nx = this.baseX + Math.sin(time * this.swayFreq + this.swayOffset + i * 0.35) * this.sway * (0.4 + frac * 1.4);
          const ny = this.baseY - i * this.spacing;
          c.globalAlpha = alpha;
          c.drawImage(this.sprite, nx - rad, ny - rad, rad * 2, rad * 2);
        }
      }
    }

    const puffs = Array.from({ length: 12 }, () => new Puff(true));
    const tendrils = Array.from({ length: 14 }, () => new Tendril(true));
    let isVisible = false;
    let rafId = 0;

    function renderFrame() {
      if (!isVisible) { rafId = 0; return; }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < puffs.length; i++) {
        if (!reducedMotionMq.matches) puffs[i].update();
        puffs[i].draw(ctx);
      }
      for (let i = 0; i < tendrils.length; i++) {
        if (!reducedMotionMq.matches) tendrils[i].update();
        tendrils[i].draw(ctx, t);
      }
      ctx.globalAlpha = 1;
      if (!reducedMotionMq.matches) {
        t += 1;
        rafId = requestAnimationFrame(renderFrame);
      } else {
        rafId = 0;
      }
    }

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((en) => { isVisible = en.isIntersecting; });
        if (isVisible && !rafId) rafId = requestAnimationFrame(renderFrame);
      }, { rootMargin: '140px 0px', threshold: 0.01 });
      io.observe(canvas.parentElement || canvas);
    } else {
      isVisible = true;
      rafId = requestAnimationFrame(renderFrame);
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAboutSmokeCanvas);
  } else {
    initAboutSmokeCanvas();
  }

    // ─── 4C. 1ST PAGE (#HERO) ORGANIC MEDTECH BLUE FLUID SMOKE CANVAS ────────────
  function initHeroSmokeCanvas() {
    const canvas = document.getElementById('hero-smoke-canvas');
    if (!canvas || canvas._smokeActive) return;
    canvas._smokeActive = true;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const sprite = window.__getMediqSmokeSprite(24, 62, 145);
    let w = 1, h = 1, dpr = 0.5;
    let t = 0;

    function resize() {
      dpr = 0.5;
      const rect = canvas.getBoundingClientRect();
      w = Math.max(1, Math.floor(rect.width || window.innerWidth));
      h = Math.max(1, Math.floor(rect.height || window.innerHeight));
      const tw = Math.max(1, Math.round(w * dpr));
      const th = Math.max(1, Math.round(h * dpr));
      if (canvas.width !== tw || canvas.height !== th) {
        canvas.width = tw;
        canvas.height = th;
      }
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const puffs = Array.from({ length: 16 }, (_, i) => ({
      baseX: (i / 16) * 1.3 - 0.15,
      baseY: 0.12 + (i % 4) * 0.24,
      r: 220 + (i % 6) * 65,
      speed: 0.12 + (i % 5) * 0.06,
      phase: i * 1.42,
      alpha: 0.18 + (i % 4) * 0.05
    }));

    let isVisible = true;
    let rafId = 0;

    function renderSmoke() {
      if (!isVisible) { rafId = 0; return; }
      t += 0.008;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < puffs.length; i++) {
        const p = puffs[i];
        const cx = (p.baseX + Math.sin(t * p.speed + p.phase) * 0.15 + Math.sin(t * 0.3 + p.phase * 0.7) * 0.04) * w;
        const cy = (p.baseY + Math.cos(t * p.speed * 0.85 + p.phase) * 0.10 + Math.cos(t * 0.25 + p.phase) * 0.03) * h;
        const rad = p.r * (1 + Math.sin(t * 0.55 + p.phase) * 0.18);
        ctx.globalAlpha = p.alpha;
        ctx.drawImage(sprite, cx - rad, cy - rad, rad * 2, rad * 2);
      }
      ctx.globalAlpha = 1;
      rafId = requestAnimationFrame(renderSmoke);
    }

    rafId = requestAnimationFrame(renderSmoke);
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((en) => { isVisible = en.isIntersecting; });
        if (isVisible && !rafId) rafId = requestAnimationFrame(renderSmoke);
      }, { rootMargin: '140px 0px', threshold: 0.01 });
      io.observe(canvas.parentElement || canvas);
    }
  }
  initHeroSmokeCanvas();

    // Global helper for direct simulation jump
  window.selectSimulatorLens = (lensKey) => {
    const select = document.getElementById('vsim-lens-select');
    if (select) {
      let targetVal = lensKey;
      if (lensKey === 'monofocal') targetVal = 'monofocal';
      else if (lensKey === 'emv') targetVal = 'emv';
      else if (lensKey === 'trifocal') targetVal = 'trifocal';
      else targetVal = 'galaxy';

      select.value = targetVal;
      select.dispatchEvent(new Event('change'));
    }
    const studio = document.getElementById('optical-studio');
    if (studio) {
      studio.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Initial state: If URL has #products, show product; otherwise show film

  if (typeof selectAboutProduct === 'function') {
    if (typeof window !== 'undefined' && window.location && window.location.hash === '#products') {
      selectAboutProduct('galaxy');
    } else {
      selectAboutProduct('film');
    }
  }


  // 7. 21st.dev Spotlight Bento Grid Interactions & Interactive Defocus Curve
  const spotlightCards = document.querySelectorAll('.bento-spotlight-card');
  spotlightCards.forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--spot-x', `${x}px`);
      card.style.setProperty('--spot-y', `${y}px`);
    });
  });

  // Interactive Defocus Curve Range Selector
  const defocusBtns = document.querySelectorAll('.defocus-band-btn');
  const svgFocusBand = document.getElementById('svg-focus-band');
  const readoutTitle = document.getElementById('defocus-readout-title');
  const readoutEmv = document.getElementById('defocus-readout-emv');
  const readoutComp = document.getElementById('defocus-readout-comp');

  const defocusData = {
    dist: {
      bandX: '240',
      bandW: '60',
      title: 'Distance Focus (Infinity · 0.00 D):',
      emv: 'EMV: 1.00 Decimal (20/20)',
      comp: 'Eyhance: 1.00 Decimal (20/20)'
    },
    inter: {
      bandX: '340',
      bandW: '75',
      title: 'Intermediate Range (~66 cm · -1.50 D):',
      emv: 'EMV: 0.88 Decimal (20/23)',
      comp: 'Eyhance: 0.62 Decimal (20/32)'
    },
    near: {
      bandX: '430',
      bandW: '65',
      title: 'Functional Near Vision (~40 cm · -2.50 D):',
      emv: 'EMV: 0.65 Decimal (20/30)',
      comp: 'Eyhance: 0.28 Decimal (20/70)'
    }
  };

  defocusBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-defocus-target') || 'inter';
      defocusBtns.forEach((b) => {
        const active = b === btn;
        b.classList.toggle('is-active', active);
        b.classList.toggle('border-magenta', active);
        b.classList.toggle('bg-magenta/20', active);
        b.classList.toggle('text-cream', active);
        b.classList.toggle('border-cream/20', !active);
        b.classList.toggle('bg-white/[0.03]', !active);
        b.classList.toggle('text-cream/80', !active);
      });

      const d = defocusData[target];
      if (d) {
        if (svgFocusBand) {
          svgFocusBand.setAttribute('x', d.bandX);
          svgFocusBand.setAttribute('width', d.bandW);
        }
        if (readoutTitle) readoutTitle.textContent = d.title;
        if (readoutEmv) readoutEmv.textContent = d.emv;
        if (readoutComp) readoutComp.textContent = d.comp;
      }
    });
  });

  // Clinical Evidence Lab Tabs (Spacious, non-crowded studio navigation)
  const labTabs = document.querySelectorAll('.clinical-lab-tab');
  const labPanels = document.querySelectorAll('.clinical-lab-panel');

  const activateLabTab = (tabId) => {
    labTabs.forEach((tab) => {
      const active = tab.getAttribute('data-lab-tab') === tabId;
      tab.classList.toggle('is-active', active);
      tab.classList.toggle('border-sky', active);
      tab.classList.toggle('bg-sky/20', active);
      tab.classList.toggle('text-white', active);
      tab.classList.toggle('border-cream/15', !active);
      tab.classList.toggle('bg-white/[0.03]', !active);
      tab.classList.toggle('text-cream/70', !active);
    });
    labPanels.forEach((panel) => {
      const active = panel.getAttribute('data-lab-panel') === tabId;
      panel.classList.toggle('hidden', !active);
      panel.classList.toggle('grid', active);
    });
    // Trigger render update for 3D canvas when bench tab is selected
    if (tabId === 'tab-bench') {
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 50);
    }
  };

  labTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-lab-tab');
      if (target) activateLabTab(target);
    });
  });

  document.querySelectorAll('[data-switch-tab]').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const tabTarget = link.getAttribute('data-switch-tab');
      if (tabTarget === 'tab-bench' || tabTarget === 'tab-defocus' || tabTarget === 'tab-biometry') {
        activateLabTab(tabTarget);
      }
      const labEl = document.getElementById('clinical-lab');
      if (labEl) {
        labEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // 8. Interactive 12-Page RayOne EMV Brochure Reader Modal
  const brochurePages = [
    { src: 'assets/brochure/mobile_1.jpg', title: 'Page 01 — Cover: RayOne® EMV & EMV Toric' },
    { src: 'assets/brochure/mobile_2.jpg', title: 'Page 02 — Rayner UK Heritage (Since 1949)' },
    { src: 'assets/brochure/mobile_3.jpg', title: 'Page 03 — Introduction: Up to 1.5 D High Quality Vision' },
    { src: 'assets/brochure/mobile_4.jpg', title: 'Page 04 — How RayOne® EMV Positive Spherical Aberration Works' },
    { src: 'assets/brochure/mobile_5.jpg', title: 'Page 05 — Clinical Results & Binocular Defocus Curve' },
    { src: 'assets/brochure/mobile_6.jpg', title: 'Page 06 — Prospective Clinical Acuity & Surgeon Feedback' },
    { src: 'assets/brochure/mobile_7.jpg', title: 'Page 07 — RayOne® EMV & EMV Toric Rotational Stability' },
    { src: 'assets/brochure/mobile_8.jpg', title: 'Page 08 — 360° Square Edge PCO Barrier & Preloaded Comparison' },
    { src: 'assets/brochure/mobile_9.jpg', title: 'Page 09 — Patented Lock & Roll™ 2-Step Preloaded Injector' },
    { src: 'assets/brochure/mobile_10.jpg', title: 'Page 10 — Comparative Study of 6 Preloaded Delivery Systems' },
    { src: 'assets/brochure/mobile_11.jpg', title: 'Page 11 — RayPRO® 3-Year Real-Time Patient Outcomes Platform' },
    { src: 'assets/brochure/mobile_12.jpg', title: 'Page 12 — Technical Information & Optical Biometry Constants' }
  ];

  const modal = document.getElementById('brochure-modal');
  const activeImg = document.getElementById('brochure-active-img');
  const counterEl = document.getElementById('brochure-counter');
  const captionEl = document.getElementById('brochure-caption');
  const dotsWrap = document.getElementById('brochure-dots');
  const prevBtn = document.getElementById('brochure-prev');
  const nextBtn = document.getElementById('brochure-next');
  const closeBtn = document.getElementById('brochure-close');
  let currentPage = 0;
  let isOpen = false;

  const renderBrochurePage = (index) => {
    currentPage = (index + brochurePages.length) % brochurePages.length;
    const item = brochurePages[currentPage];
    if (activeImg) {
      activeImg.src = item.src;
      activeImg.alt = item.title;
    }
    if (counterEl) {
      counterEl.textContent = `${String(currentPage + 1).padStart(2, '0')} / ${brochurePages.length}`;
    }
    if (captionEl) {
      captionEl.textContent = item.title;
    }
    if (dotsWrap) {
      Array.from(dotsWrap.children).forEach((dot, idx) => {
        const active = idx === currentPage;
        dot.classList.toggle('bg-sky', active);
        dot.classList.toggle('text-ink', active);
        dot.classList.toggle('border-sky', active);
        dot.classList.toggle('bg-white/5', !active);
        dot.classList.toggle('text-cream/60', !active);
        dot.classList.toggle('border-cream/15', !active);
      });
    }
  };

  if (dotsWrap) {
    brochurePages.forEach((_, idx) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = String(idx + 1).padStart(2, '0');
      b.setAttribute('aria-label', `Go to page ${idx + 1}`);
      b.className = 'cursor-pointer border px-2 py-1 text-[10px] font-mono font-semibold transition hover:border-sky';
      b.addEventListener('click', () => renderBrochurePage(idx));
      dotsWrap.appendChild(b);
    });
  }

  const setBrochureModal = (open, pageIndex = 0) => {
    if (!modal) return;
    isOpen = open;
    if (open) renderBrochurePage(pageIndex);
    modal.classList.toggle('opacity-0', !open);
    modal.classList.toggle('pointer-events-none', !open);
    root.classList.toggle('overflow-hidden', open);
  };

  document.querySelectorAll('[data-open-brochure]').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const idx = parseInt(trigger.getAttribute('data-open-brochure') || '0', 10);
      setBrochureModal(true, Number.isNaN(idx) ? 0 : idx);
    });
  });

  if (prevBtn) prevBtn.addEventListener('click', () => renderBrochurePage(currentPage - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => renderBrochurePage(currentPage + 1));
  if (closeBtn) closeBtn.addEventListener('click', () => setBrochureModal(false));
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) setBrochureModal(false);
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      setMenu(false);
      if (isOpen) setBrochureModal(false);
    } else if (isOpen && e.key === 'ArrowRight') {
      renderBrochurePage(currentPage + 1);
    } else if (isOpen && e.key === 'ArrowLeft') {
      renderBrochurePage(currentPage - 1);
    }
  });

  // 9. Smart Inquiry Form Pre-Selection, Consent Validation & Submission Feedback
  const productSelect = document.getElementById('inq-product');
  const subjectInput = document.getElementById('inq-subject');
  let selectedInquiryTopic = '';
  document.querySelectorAll('[data-inquire]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const val = btn.getAttribute('data-inquire');
      if (val) selectedInquiryTopic = val;
      if (productSelect && val) {
        productSelect.value = val;
        productSelect.dispatchEvent(new Event('change'));
      }
      if (subjectInput && val) {
        subjectInput.value = val;
      }
    });
  });

  document.querySelectorAll('[data-select-inquiry]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const val = btn.getAttribute('data-select-inquiry');
      if (val) selectedInquiryTopic = val;
      if (productSelect && val) {
        productSelect.value = val;
        productSelect.dispatchEvent(new Event('change'));
      }
      if (subjectInput && val) {
        subjectInput.value = val;
      }
      const nameInput = document.getElementById('inq-name');
      if (nameInput) nameInput.focus();
    });
  });

  const quoteForm = document.getElementById('quote-form');
  const formFeedback = document.getElementById('form-feedback');
  if (quoteForm && formFeedback) {
    const TARGET_EMAIL = 'mediqtechsupport@gmail.com';
    // Option A (100% Free Unlimited, sends FROM "MEDIQ Pharma Inc." with inline PNG logo + auto-reply):
    //   Paste your deployed Google Apps Script Web App URL from assets/email/google-apps-script-mailer.gs.
    const CUSTOM_MAILER_URL = 'https://script.google.com/macros/s/AKfycbxTjRceXQDTpnc_oEbwVSMH6eHfW2N1xtLaeLEwoNBUqV38dcgbZFMqPG2X0Cp5nbYD/exec';
    // Option B (EmailJS - matches {{contact_name}}, {{organization}}, {{email_address}}, {{inquiry_topic}}, {{reference}}, {{submitted_at}}, {{message}}):
    const EMAILJS_CONFIG = {
      serviceId: '',
      publicKey: '',
      adminTemplateId: '',
      confirmationTemplateId: ''
    };
    // Option C (Formspree endpoint, e.g. 'https://formspree.io/f/your_form_id'):
    const FORMSPREE_URL = '';
    const topicButtons = Array.from(quoteForm.querySelectorAll('[data-contact-topic]'));
    const subjectHiddenInput = quoteForm.querySelector('#inq-subject');

    const cfmModal = document.getElementById('contact-confirmation-modal');
    const cfmCloseBtn = document.getElementById('cfm-close-btn');
    const hideConfirmationModal = () => {
      if (!cfmModal) return;
      cfmModal.classList.remove('opacity-100');
      cfmModal.classList.add('opacity-0');
      setTimeout(() => { cfmModal.classList.add('hidden'); }, 220);
    };
    const showConfirmationModal = ({ name, clinic, email, topic, message, referenceId }) => {
      if (!cfmModal) return;
      const setTxt = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
      setTxt('cfm-ref', `Reference ${referenceId}`);
      setTxt('cfm-name', name);
      setTxt('cfm-clinic', clinic);
      setTxt('cfm-email', email);
      setTxt('cfm-topic', topic || 'General Institutional Inquiry');
      setTxt('cfm-message', message || '(No additional message provided)');
      cfmModal.classList.remove('hidden');
      requestAnimationFrame(() => {
        cfmModal.classList.remove('opacity-0');
        cfmModal.classList.add('opacity-100');
      });
    };
    if (cfmCloseBtn) cfmCloseBtn.addEventListener('click', hideConfirmationModal);
    if (cfmModal) {
      cfmModal.addEventListener('click', (ev) => {
        if (ev.target === cfmModal) hideConfirmationModal();
      });
      window.addEventListener('keydown', (ev) => {
        if (ev.key === 'Escape' && !cfmModal.classList.contains('hidden')) hideConfirmationModal();
      });
    }

    const activateTopicPill = (btn) => {
      if (!btn) return;
      const val = btn.getAttribute('data-contact-topic') || '';
      if (subjectHiddenInput) subjectHiddenInput.value = val;
      topicButtons.forEach((b) => {
        const isSel = b === btn;
        b.setAttribute('aria-pressed', isSel ? 'true' : 'false');
        b.className = isSel
          ? 'rounded-full border border-[#72c5f8]/65 bg-[#123568]/80 px-3.5 py-1.5 text-[11.5px] font-medium text-white shadow-[0_0_16px_rgba(58,160,219,0.22)] transition-colors cursor-pointer'
          : 'rounded-full border border-[#72c5f8]/22 bg-[#0a1d40]/60 px-3.5 py-1.5 text-[11.5px] font-medium text-[#9eb4cc] hover:border-[#72c5f8]/50 hover:text-white transition-colors cursor-pointer';
      });
    };

    topicButtons.forEach((btn) => {
      btn.addEventListener('click', () => activateTopicPill(btn));
    });

    const setFeedbackWithMailto = (text, colorClass, mailtoHref, linkLabel) => {
      formFeedback.textContent = text;
      formFeedback.className = `text-[12px] font-semibold ${colorClass}`;
      if (mailtoHref && linkLabel) {
        const sep = document.createTextNode(' ');
        const a = document.createElement('a');
        a.href = mailtoHref;
        a.textContent = linkLabel;
        a.className = 'underline underline-offset-2 text-white hover:text-[#72c5f8]';
        formFeedback.appendChild(sep);
        formFeedback.appendChild(a);
      }
    };

    quoteForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = quoteForm.querySelector('#inq-name')?.value.trim();
      const clinic = quoteForm.querySelector('#inq-clinic')?.value.trim();
      const email = quoteForm.querySelector('#inq-email')?.value.trim();
      const subjectVal = quoteForm.querySelector('#inq-subject')?.value.trim();
      const messageVal = quoteForm.querySelector('#inq-message')?.value.trim() || '';
      const consent = quoteForm.querySelector('#inq-consent');
      const submitBtn = quoteForm.querySelector('button[type="submit"]');

      if (!name || !clinic || !email) {
        setFeedbackWithMailto(
          'Please complete your Full Name, Organization/Institution, and Email.',
          'text-ray'
        );
        return;
      }
      if (consent && !consent.checked) {
        setFeedbackWithMailto(
          'Please confirm the privacy and contact-consent statement before submitting.',
          'text-ray'
        );
        return;
      }

      const selected = subjectVal || (productSelect ? productSelect.value : '') || selectedInquiryTopic;
      const referenceId = 'MQ-' + String(Date.now()).slice(-6);
      const submittedAt = new Date().toLocaleString('en-PH', { timeZone: 'Asia/Manila', dateStyle: 'medium', timeStyle: 'short' });
      const emailSubject = selected
        ? `[MEDIQ Inquiry] ${name} (${clinic}) — ${selected} [${referenceId}]`
        : `[MEDIQ Inquiry] ${name} (${clinic}) [${referenceId}]`;
      const emailBody =
        `Reference: ${referenceId}\n` +
        `Name: ${name}\n` +
        `Organization / Clinic: ${clinic}\n` +
        `Sender Email: ${email}\n` +
        `Subject: ${selected || 'General Institutional Inquiry'}\n\n` +
        `Message:\n${messageVal || '(No additional message provided)'}\n`;
      const mailtoHref =
        `mailto:${TARGET_EMAIL}?subject=${encodeURIComponent(emailSubject)}` +
        `&body=${encodeURIComponent(emailBody)}`;

      const resetFormState = () => {
        quoteForm.reset();
        selectedInquiryTopic = '';
        if (topicButtons.length > 0) activateTopicPill(topicButtons[0]);
        if (productSelect) productSelect.dispatchEvent(new Event('change'));
      };

      // In live user browsers online:
      //   1. Prefer CUSTOM_MAILER_URL (Google Apps Script) OR EMAILJS_CONFIG (passes exact {{contact_name}}, {{organization}}, {{email_address}}, {{inquiry_topic}}, {{reference}}, {{submitted_at}}, {{message}} template variables)
      //   2. Fall back to FormSubmit AJAX (_template: table) and always show the on-page MEDIQ Confirmation Receipt Modal.
      if (!navigator.webdriver && navigator.onLine && typeof fetch === 'function') {
        if (submitBtn) submitBtn.disabled = true;
        setFeedbackWithMailto(`Sending inquiry directly to ${TARGET_EMAIL}...`, 'text-sky');
        const templateParams = {
          contact_name: name,
          organization: clinic,
          email_address: email,
          inquiry_topic: selected || 'General Institutional Inquiry',
          reference: referenceId,
          submitted_at: submittedAt,
          message: messageVal || '(No additional message provided)',
          subject: emailSubject,
          from_name: 'MEDIQ Pharma Inc.',
          to_email: TARGET_EMAIL,
          reply_to: email
        };
        try {
          let ok = false;
          if (CUSTOM_MAILER_URL) {
            const customRes = await fetch(CUSTOM_MAILER_URL, {
              method: 'POST',
              redirect: 'follow',
              headers: { 'Content-Type': 'text/plain;charset=utf-8' },
              body: JSON.stringify(templateParams)
            });
            try {
              const payload = await customRes.json();
              ok = customRes.ok && payload && payload.ok !== false;
            } catch (_) {
              ok = customRes.ok;
            }
          } else if (EMAILJS_CONFIG.serviceId && EMAILJS_CONFIG.publicKey && EMAILJS_CONFIG.adminTemplateId) {
            const sendEjs = (tid, params) => fetch('https://api.emailjs.com/api/v1.0/email/send', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                service_id: EMAILJS_CONFIG.serviceId,
                template_id: tid,
                user_id: EMAILJS_CONFIG.publicKey,
                template_params: params
              })
            });
            const adminRes = await sendEjs(EMAILJS_CONFIG.adminTemplateId, templateParams);
            ok = adminRes.ok;
            if (ok && EMAILJS_CONFIG.confirmationTemplateId) {
              await sendEjs(EMAILJS_CONFIG.confirmationTemplateId, {
                ...templateParams,
                to_email: email,
                reply_to: TARGET_EMAIL
              }).catch(() => {});
            }
          } else if (FORMSPREE_URL) {
            const fsRes = await fetch(FORMSPREE_URL, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
              },
              body: JSON.stringify(templateParams)
            });
            ok = fsRes.ok;
          } else {
            const autoReplyMsg =
              `Thank you, ${name}, for contacting MEDIQ Pharma and Medical Supplies Distribution Inc. ` +
              `We have received your ${selected || 'institutional'} inquiry (${referenceId}) for ${clinic} and our team will respond shortly. ` +
              `Direct assistance: Mobile/Viber +63 945 795 4365 | Telegram t.me/mediqpharma | Email mediqtechsupport@gmail.com`;
            const res = await fetch(`https://formsubmit.co/ajax/${TARGET_EMAIL}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
              },
              body: JSON.stringify({
                Reference: `${referenceId} (${submittedAt})`,
                Contact_Name: name,
                Organization: clinic,
                Email_Address: email,
                Inquiry_Topic: selected || 'General Institutional Inquiry',
                Message: messageVal || '(No additional message provided)',
                email,
                _replyto: email,
                _subject: emailSubject,
                _template: 'table',
                _autoresponse: autoReplyMsg
              })
            });
            ok = res.ok;
          }
          if (ok) {
            setFeedbackWithMailto(
              `Confirmed (${referenceId})! Message received by MEDIQ Support Desk.`,
              'text-emerald-400',
              mailtoHref,
              'Open Mail Copy'
            );
            showConfirmationModal({
              name,
              clinic,
              email,
              topic: selected || 'General Institutional Inquiry',
              message: messageVal,
              referenceId
            });
            resetFormState();
          } else {
            throw new Error('Mail dispatch error');
          }
        } catch (_) {
          setFeedbackWithMailto(
            `Inquiry prepared for ${TARGET_EMAIL} —`,
            'text-sky',
            mailtoHref,
            'Send in Email App ->'
          );
          const mailTrigger = document.createElement('a');
          mailTrigger.href = mailtoHref;
          mailTrigger.style.display = 'none';
          document.body.appendChild(mailTrigger);
          mailTrigger.click();
          mailTrigger.remove();
          resetFormState();
        } finally {
          if (submitBtn) submitBtn.disabled = false;
        }
      } else {
        setFeedbackWithMailto(
          `Thank you, ${name}. Inquiry ready for ${TARGET_EMAIL} —`,
          'text-sky',
          mailtoHref,
          'Send via Email App ->'
        );
        resetFormState();
      }
    });
  }

  // 10. 21st.dev Custom VideoPlayer Logic (#about-player)
  const playerEl = document.getElementById('about-player');
  const videoEl = document.getElementById('about-video');
  const posterEl = document.getElementById('vp-poster');
  const playBtn = document.getElementById('vp-play');
  const iconPlay = document.getElementById('vp-icon-play');
  const iconPause = document.getElementById('vp-icon-pause');
  const playRipple = document.getElementById('vp-play-ripple');
  const rewindBtn = document.getElementById('vp-rewind');
  const forwardBtn = document.getElementById('vp-forward');
  const seekFlashEl = document.getElementById('vp-seek-flash');
  const volumeSlider = document.getElementById('vp-volume');
  const muteBtn = document.getElementById('vp-mute');
  const iconVolLoud = document.getElementById('vp-icon-vol-loud');
  const iconVolMuted = document.getElementById('vp-icon-vol-muted');
  const fullscreenBtn = document.getElementById('vp-fullscreen');
  const fullscreenErrorEl = document.getElementById('vp-fullscreen-error');
  const progressSlider = document.getElementById('vp-progress');
  const hoverTip = document.getElementById('vp-hover-tip');
  const hoverChapterEl = document.getElementById('vp-hover-chapter');
  const hoverTimeEl = document.getElementById('vp-hover-time');
  const chapterTicksWrap = document.getElementById('vp-chapter-ticks');
  const timeCurrentEl = document.getElementById('vp-time-current');
  const timeDurationEl = document.getElementById('vp-time-duration');
  const chapterCurrentEl = document.getElementById('vp-chapter-current');

  if (playerEl && videoEl) {
    const chapters = [
      { start: 0, title: 'Sir Harold Ridley & The First IOL' },
      { start: 18, title: 'The Ridley Innovation Centre (UK)' },
      { start: 42, title: 'RayOne Optical Engineering' },
      { start: 70, title: 'Global Patient Outcomes' }
    ];

    let playing = false;
    let volume = 0.7;
    let duration = 128;
    let idleTimer = 0;
    let flashTimer = 0;

    const formatTime = (sec) => {
      const s = Math.max(0, Math.floor(sec || 0));
      const m = Math.floor(s / 60);
      return `${m}:${String(s % 60).padStart(2, '0')}`;
    };

    const chapterAt = (sec) => {
      let found = chapters[0];
      for (const ch of chapters) {
        if (ch.start <= sec) found = ch;
      }
      return found;
    };

    const renderChapterTicks = () => {
      if (!chapterTicksWrap || duration <= 0) return;
      chapterTicksWrap.innerHTML = '';
      chapters.forEach((ch) => {
        if (ch.start > 0 && ch.start < duration) {
          const tick = document.createElement('span');
          tick.className = 'pointer-events-none absolute top-1/2 h-2 w-0.5 -translate-x-1/2 -translate-y-1/2 bg-black/60';
          tick.style.left = `${(ch.start / duration) * 100}%`;
          chapterTicksWrap.appendChild(tick);
        }
      });
    };

    const wake = () => {
      playerEl.removeAttribute('data-idle');
      window.clearTimeout(idleTimer);
      if (playing) {
        idleTimer = window.setTimeout(() => {
          if (playing) playerEl.setAttribute('data-idle', 'true');
        }, 2200);
      }
    };

    const triggerRipple = () => {
      if (!playRipple) return;
      playRipple.style.transition = 'none';
      playRipple.style.opacity = '0.8';
      playRipple.style.transform = 'scale(1)';
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          playRipple.style.transition = 'transform 500ms ease-out, opacity 500ms ease-out';
          playRipple.style.opacity = '0';
          playRipple.style.transform = 'scale(1.7)';
        });
      });
    };

    const syncPlayUI = () => {
      if (playBtn) playBtn.setAttribute('aria-label', playing ? 'Pause video' : 'Play video');
      if (iconPlay) {
        iconPlay.classList.toggle('scale-75', playing);
        iconPlay.classList.toggle('opacity-0', playing);
      }
      if (iconPause) {
        iconPause.classList.toggle('scale-75', !playing);
        iconPause.classList.toggle('opacity-0', !playing);
      }
      const showVideoFrame = playing || videoEl.currentTime > 0.1;
      videoEl.classList.toggle('opacity-0', !showVideoFrame);
      if (posterEl) {
        posterEl.classList.toggle('opacity-0', showVideoFrame);
        posterEl.classList.toggle('pointer-events-none', showVideoFrame);
      }
      const bottomBar = document.getElementById('vp-bottom-bar');
      if (bottomBar) {
        bottomBar.classList.toggle('opacity-0', !showVideoFrame);
        bottomBar.classList.toggle('pointer-events-none', !showVideoFrame);
      }
      triggerRipple();
      wake();
    };

    const setPlaying = (next) => {
      playing = next;
      if (playing) {
        const p = videoEl.play();
        if (p !== undefined) {
          p.catch((err) => {
            console.warn('Initial video play with audio failed, attempting muted fallback:', err);
            videoEl.muted = true;
            videoEl.play().then(() => {
              playing = true;
              syncPlayUI();
            }).catch((err2) => {
              console.error('Video play error:', err2);
              playing = false;
              syncPlayUI();
            });
          });
        }
      } else {
        videoEl.pause();
      }
      syncPlayUI();
    };

    const syncTimeUI = () => {
      const cur = Math.max(0, Math.min(videoEl.currentTime || 0, duration));
      const pct = duration > 0 ? (cur / duration) * 100 : 0;
      if (progressSlider) {
        progressSlider.max = String(duration);
        progressSlider.value = String(cur);
        progressSlider.style.background = `linear-gradient(to right, white ${pct}%, #ffffff40 ${pct}%)`;
        progressSlider.setAttribute('aria-valuetext', `${formatTime(cur)} of ${formatTime(duration)}`);
      }
      if (timeCurrentEl) timeCurrentEl.textContent = formatTime(cur);
      if (timeDurationEl) timeDurationEl.textContent = formatTime(duration);
      const ch = chapterAt(cur);
      if (chapterCurrentEl && ch) {
        chapterCurrentEl.textContent = `· ${ch.title}`;
      }
    };

    const changeVolume = (val) => {
      volume = Math.max(0, Math.min(1, Number(val)));
      videoEl.volume = volume;
      videoEl.muted = volume === 0;
      if (volumeSlider) {
        volumeSlider.value = String(volume);
        volumeSlider.style.background = `linear-gradient(to right, white ${volume * 100}%, #ffffff40 ${volume * 100}%)`;
      }
      if (muteBtn) muteBtn.setAttribute('aria-label', volume === 0 ? 'Unmute' : 'Mute');
      if (iconVolLoud) {
        iconVolLoud.classList.toggle('scale-75', volume === 0);
        iconVolLoud.classList.toggle('opacity-0', volume === 0);
      }
      if (iconVolMuted) {
        iconVolMuted.classList.toggle('scale-75', volume !== 0);
        iconVolMuted.classList.toggle('opacity-0', volume !== 0);
      }
    };

    const seekBy = (delta) => {
      const next = Math.max(0, Math.min(duration, (videoEl.currentTime || 0) + delta));
      videoEl.currentTime = next;
      syncTimeUI();
      if (seekFlashEl) {
        seekFlashEl.textContent = delta > 0 ? `+${delta}s` : `${delta}s`;
        seekFlashEl.classList.remove('opacity-0', '-translate-y-10');
        seekFlashEl.classList.add('opacity-100', '-translate-y-13');
        window.clearTimeout(flashTimer);
        flashTimer = window.setTimeout(() => {
          seekFlashEl.classList.add('opacity-0', '-translate-y-10');
          seekFlashEl.classList.remove('opacity-100', '-translate-y-13');
        }, 700);
      }
      wake();
    };

    const toggleFullscreen = async () => {
      try {
        if (document.fullscreenElement === playerEl) {
          await document.exitFullscreen();
        } else {
          await playerEl.requestFullscreen();
        }
        if (fullscreenErrorEl) fullscreenErrorEl.classList.add('hidden');
      } catch {
        if (fullscreenErrorEl) {
          fullscreenErrorEl.textContent = 'Fullscreen is unavailable in this browser.';
          fullscreenErrorEl.classList.remove('hidden');
        }
      }
    };

    videoEl.addEventListener('loadedmetadata', () => {
      if (videoEl.duration && Number.isFinite(videoEl.duration)) {
        duration = videoEl.duration;
      }
      renderChapterTicks();
      syncTimeUI();
    });

    videoEl.addEventListener('timeupdate', syncTimeUI);
    videoEl.addEventListener('ended', () => {
      playing = false;
      videoEl.currentTime = 0;
      syncPlayUI();
      syncTimeUI();
    });

    if (playBtn) playBtn.addEventListener('click', () => setPlaying(!playing));
    if (posterEl) posterEl.addEventListener('click', () => setPlaying(true));
    videoEl.addEventListener('click', () => setPlaying(!playing));
    if (rewindBtn) rewindBtn.addEventListener('click', () => seekBy(-10));
    if (forwardBtn) forwardBtn.addEventListener('click', () => seekBy(10));
    if (volumeSlider) volumeSlider.addEventListener('input', (e) => changeVolume(e.target.value));
    if (muteBtn) muteBtn.addEventListener('click', () => changeVolume(volume === 0 ? 0.7 : 0));
    if (fullscreenBtn) fullscreenBtn.addEventListener('click', () => void toggleFullscreen());

    if (progressSlider) {
      progressSlider.addEventListener('input', (e) => {
        videoEl.currentTime = Number(e.target.value);
        syncTimeUI();
        wake();
      });
      progressSlider.addEventListener('pointermove', (e) => {
        if (!hoverTip) return;
        const box = progressSlider.getBoundingClientRect();
        const ratio = Math.max(0, Math.min(1, (e.clientX - box.left) / box.width));
        const hoverSec = ratio * duration;
        hoverTip.style.left = `${ratio * box.width}px`;
        hoverTip.classList.remove('opacity-0');
        if (hoverTimeEl) hoverTimeEl.textContent = formatTime(hoverSec);
        const ch = chapterAt(hoverSec);
        if (hoverChapterEl) hoverChapterEl.textContent = ch ? ch.title : '';
      });
      progressSlider.addEventListener('pointerleave', () => {
        if (hoverTip) hoverTip.classList.add('opacity-0');
      });
    }

    playerEl.addEventListener('pointermove', wake);
    playerEl.addEventListener('focus', wake);
    playerEl.addEventListener('keydown', (e) => {
      if (e.target.closest && e.target.closest('#vp-volume')) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const key = e.key.toLowerCase();
      if (e.target.tagName === 'BUTTON' && (key === ' ' || key === 'enter')) return;
      const actions = {
        ' ': () => setPlaying(!playing),
        k: () => setPlaying(!playing),
        arrowleft: () => seekBy(-10),
        j: () => seekBy(-10),
        arrowright: () => seekBy(10),
        l: () => seekBy(10),
        m: () => changeVolume(volume === 0 ? 0.7 : 0),
        f: () => void toggleFullscreen()
      };
      if (actions[key]) {
        e.preventDefault();
        actions[key]();
        wake();
      }
    });

    changeVolume(0.7);
    renderChapterTicks();
    syncTimeUI();
  }

  // 11. Official RayOne Galaxy 4-Lens Vision Simulator (#optical-studio)
  // Calibrated first and foremost for Monofocal (Night Driving + Cataracts / Astigmatism / Presbyopia)
  // Combines:
  //   1) Authentic optical depth field (Far/Upper view is 100% clear; Closer lower foreground is blurred in Monofocal, matching media_1793699243618_9914cb5c.jpg)
  //   2) Real-time Live Camera Proximity Sensor (YCbCr Skin + Baseline Occlusion + FaceDetector) so moving your face, hand, or phone closer to the camera dynamically blurs the close subject in real time!
  const vsimStage = document.getElementById('vsim-stage');
  const vsimPanelsWrap = document.getElementById('vsim-panels-wrap');
  const vsimCanvasLeft = document.getElementById('vsim-canvas-left');
  const vsimCanvasRight = document.getElementById('vsim-canvas-right');
  const vsimPanelLeftTxt = document.getElementById('vsim-panel-left-txt');
  const vsimPanelRightWrap = document.getElementById('vsim-panel-right-wrap');
  const vsimPanelRightTxt = document.getElementById('vsim-panel-right-txt');

  const vsimDistanceDot = document.getElementById('vsim-distance-dot');
  const vsimDistanceTxt = document.getElementById('vsim-distance-txt');
  const vsimDistBtns = document.querySelectorAll('[data-dist-mode]');

  const vsimInfoBtnLeft = document.getElementById('vsim-info-btn-left');
  const vsimInfoBtnRight = document.getElementById('vsim-info-btn-right');
  const vsimInfoPopLeft = document.getElementById('vsim-info-pop-left');
  const vsimInfoPopRight = document.getElementById('vsim-info-pop-right');
  const vsimInfoPopLeftTitle = document.getElementById('vsim-info-pop-left-title');
  const vsimInfoPopRightTitle = document.getElementById('vsim-info-pop-right-title');
  const vsimInfoPopLeftBody = document.getElementById('vsim-info-pop-left-body');
  const vsimInfoPopRightBody = document.getElementById('vsim-info-pop-right-body');
  const vsimInfoCloseLeft = document.getElementById('vsim-info-close-left');
  const vsimInfoCloseRight = document.getElementById('vsim-info-close-right');

  const vsimZoneFar = document.getElementById('vsim-zone-far');
  const vsimZoneMid = document.getElementById('vsim-zone-mid');
  const vsimZoneNear = document.getElementById('vsim-zone-near');
  const vsimZoneHalos = document.getElementById('vsim-zone-halos');
  const vsimZoneHalosLabel = document.getElementById('vsim-zone-halos-label');

  const vsimWebcam = document.getElementById('vsim-webcam');
  const vsimCamPill = document.getElementById('vsim-cam-pill');
  const vsimCamPillTxt = document.getElementById('vsim-cam-pill-txt');
  const vsimCamPing = document.getElementById('vsim-cam-ping');
  const vsimCamDot = document.getElementById('vsim-cam-dot');
  const vsimFlipBtn = document.getElementById('vsim-flip-btn');
  const vsimStartOverlay = document.getElementById('vsim-start-overlay');
  const vsimCamCenterBtn = document.getElementById('vsim-cam-center-btn');
  const vsimCamHint = document.getElementById('vsim-cam-hint');

  const vsimSceneSelect = document.getElementById('vsim-scene-select');
  const vsimConditionSelect = document.getElementById('vsim-condition-select');
  const vsimLensSelect = document.getElementById('vsim-lens-select');
  const vsimCompareToggle = document.getElementById('vsim-compare-toggle');
  const vsimCompareStatus = document.getElementById('vsim-compare-status');
  const vsimCompareSelect = document.getElementById('vsim-compare-select');
  const vsimQuickPills = document.querySelectorAll('[data-quick-iol]');

  if (vsimStage && vsimCanvasLeft && vsimCanvasRight) {
    const ctxLeft = vsimCanvasLeft.getContext('2d');
    const ctxRight = vsimCanvasRight.getContext('2d');

    // Official Rayner Simulator Scene Assets
    const eveningSceneImg = new Image();
    eveningSceneImg.src = 'assets/img/scene_evening_livingroom.jpg';
    let eveningSceneLoaded = false;
    eveningSceneImg.onload = () => { eveningSceneLoaded = true; };

    const srcCanvas = document.createElement('canvas');
    const srcCtx = srcCanvas.getContext('2d');
    const nearZoneCanvas = document.createElement('canvas');
    const nearZoneCtx = nearZoneCanvas.getContext('2d');
    const subjectCanvas = document.createElement('canvas');
    const subjectCtx = subjectCanvas.getContext('2d');
    const fgMaskCanvas = document.createElement('canvas');
    const fgMaskCtx = fgMaskCanvas.getContext('2d');
    const haloCanvas = document.createElement('canvas');
    const haloCtx = haloCanvas.getContext('2d');
    const tmpCanvas = document.createElement('canvas');
    const tmpCtx = tmpCanvas.getContext('2d');

    // Offscreen 120x68 analyzer for Live Subject Distance & Spatial Foreground Segmentation
    const distCanvas = document.createElement('canvas');
    distCanvas.width = 120;
    distCanvas.height = 68;
    const distCtx = distCanvas.getContext('2d', { willReadFrequently: true });

    const fgSmallCanvas = document.createElement('canvas');
    fgSmallCanvas.width = 120;
    fgSmallCanvas.height = 68;
    const fgSmallCtx = fgSmallCanvas.getContext('2d');
    const fgSmallImgData = fgSmallCtx.createImageData(120, 68);

    // Live Proximity State:
    // 0.00 = Normal/Far Sitting Distance (~90 cm: upper/main camera view is 100% CLEAR in Monofocal; only lower close foreground blurs)
    // 0.50 = Intermediate Approach (~55 cm: closer subject/hand/face blurs in Monofocal, stays CLEAR in EMV/Trifocal/Galaxy)
    // 1.00 = Very Close to Camera (~28-35 cm: close subject/face/hand blurs strongly in Monofocal, softly in EMV, stays CLEAR in Trifocal/Galaxy)
    let distanceMode = 'auto'; // 'auto' | 'far' | 'mid' | 'near'
    let targetProximity = 0.0;
    let liveProximity = 0.0;
    let baselineFrameData = null;
    let baselineSkinRatio = null;
    let warmupFrames = 0;
    let faceDetector = null;
    let faceDetectBusy = false;
    let detectedFaceBox = null;
    let baselineFaceRatio = null;
    let frameCounter = 0;
    let nearObjSmoothX = 0.50;
    let nearObjSmoothY = 0.65;
    let nearObjSmoothRadiusX = 0.32;
    let nearObjSmoothRadiusY = 0.30;
    let nearObjDetected = false;
    let personMem = null;
    let proxHoldVal = 0, proxHoldUntil = 0;
    let prevFrameData = null;

    if ('FaceDetector' in window) {
      try {
        faceDetector = new window.FaceDetector({ fastMode: true, maxDetectedFaces: 1 });
      } catch {
        faceDetector = null;
      }
    }

    // Simulator State
    let cameraActive = false;
    let facingMode = 'environment';
    let mediaStream = null;
    let activeScene = 'night';          // 'night' | 'daytime' | 'reading'
    let activeCondition = 'cataracts';
    let isReadingTextDetected = false;  // 'cataracts' | 'cataracts-astig' | 'presbyopia' | 'presbyopia-astig'
    let activeLens = 'monofocal';       // 'condition' | 'monofocal' | 'emv' | 'trifocal' | 'galaxy'
    let isCompareOn = false;
    let compareTarget = 'trifocal';

    if (vsimLensSelect) vsimLensSelect.value = activeLens;

    const isAstigCondition = () =>
      activeCondition === 'cataracts-astig' ||
      activeCondition === 'presbyopia-astig' ||
      activeCondition === 'astigmatism';

    const resetDistanceCalibration = () => {
      baselineFrameData = null;
      baselineSkinRatio = null;
      baselineFaceRatio = null;
      warmupFrames = 0;
      nearObjSmoothX = 0.50; nearObjSmoothY = 0.65; nearObjDetected = false; personMem = null;
    };

    // Strictly the 4 Lenses from https://www.galaxyiol.com/vision-simulator with Official Simulation Copy
    const LENSES = {
      monofocal: {
        baseName: 'Monofocal',
        toricName: 'Monofocal Toric',
        panelTitle: () => (isAstigCondition() ? 'Monofocal Toric' : 'Monofocal'),
        cardTitle: () => (isAstigCondition() ? 'Monofocal Toric' : 'Monofocal'),
        cardDesc: () =>
          isAstigCondition()
            ? 'A monofocal toric IOL provides high quality distance vision without glasses, as well as astigmatism correction.'
            : 'A monofocal IOL provides high quality distance vision without glasses.',
        // Distance / main upper camera view is 0px (100% CLEAR)
        farBlur: 0,
        // Lower closer foreground zone (dashboard / steering wheel / hands zone, y = 56%..100%) is blurred in Monofocal (matching media_1793699243618_9914cb5c.jpg)
        foregroundZoneBlur: 12.5,
        foregroundStartY: 0.48,
        foregroundFullY: 0.72,
        // Live Camera Distance Blur: when user moves their face, hand, or phone closer to the camera (prox > 0.08), blurs dynamically up to 16px!
        getLiveApproachBlur: (prox) => {
          if (prox <= 0.08) return 0;
          return Math.pow((prox - 0.08) / 0.92, 0.6) * 26.0;
        },
        readingCardBlur: 10.5,
        hasTrifocalHalos: false,
        getZones: () => {
          if (activeCondition === 'cataracts-astig') {
            return {
              far: { text: 'Clear Distance Vision', cls: 'text-emerald-300' },
              mid: { text: 'Blurry at Intermediate (~60 cm)', cls: 'text-amber-300' },
              near: { text: 'Blurry When Closer (<45 cm)', cls: 'text-rose-300' },
              halos: { text: 'Halo Glow Around Lights', cls: 'text-amber-300' }
            };
          }
          if (activeCondition === 'presbyopia-astig') {
            return {
              far: { text: 'Clear Distance Vision', cls: 'text-emerald-300' },
              mid: { text: 'Blurry at Intermediate (~60 cm)', cls: 'text-amber-300' },
              near: { text: 'Blurry When Closer (<45 cm)', cls: 'text-rose-300' },
              halos: { text: 'Subtle Astigmatic Light Halo', cls: 'text-amber-200' }
            };
          }
          return {
            far: { text: 'Clear Distance Vision', cls: 'text-emerald-300' },
            mid: { text: 'Blurry at Intermediate (~60 cm)', cls: 'text-amber-300' },
            near: { text: 'Blurry When Closer (<45 cm)', cls: 'text-rose-300' },
            halos: { text: 'Clean Night Point Lights', cls: 'text-sky' }
          };
        }
      },
      emv: {
        baseName: 'RayOne EMV',
        toricName: 'RayOne EMV Toric',
        panelTitle: () =>
          isAstigCondition()
            ? 'RayOne EMV Toric (Increased Range of Focus)'
            : 'RayOne EMV (Increased Range of Focus)',
        cardTitle: () => (isAstigCondition() ? 'RayOne EMV Toric' : 'RayOne EMV'),
        cardDesc: () =>
          isAstigCondition()
            ? 'An increased range of focus toric IOL that offers high quality distance vision and functional intermediate vision without glasses, as well as astigmatism correction.'
            : 'An increased range of focus IOL that offers high quality distance vision and functional intermediate vision without glasses.',
        // Distance (road & cars ahead) is 100% CLEAR (0px)
        farBlur: 0,
        // In Night Driving: Intermediate (dashboard) is 100% CLEAR (0px); lower steering wheel (35cm) has gentle soft near blur (5.5px)
        intermediateBlur: 0.0,
        foregroundZoneBlur: 5.5,
        foregroundStartY: 0.72,
        foregroundFullY: 0.92,
        hasEmvSculptedMask: true,
        // Live Camera Optical Depth: Far (~100cm) and Intermediate (~60cm desk/laptop distance, prox <= 0.52) are 100% CLEAR (0px)!
        // Only transitions gently into soft near focus (~4.8px) when an object or book is held close (<38cm, prox > 0.52)
        getLiveApproachBlur: (prox) => {
          if (prox <= 0.08) return 0;
          return Math.pow((prox - 0.08) / 0.92, 0.6) * 10.0;
        },
        readingCardBlur: 4.8,
        hasTrifocalHalos: false,
        getZones: () => {
          if (activeCondition === 'cataracts-astig') {
            return {
              far: { text: 'High Quality Distance Vision', cls: 'text-emerald-300' },
              mid: { text: 'Clear Intermediate (~60 cm)', cls: 'text-emerald-300' },
              near: { text: 'Soft Near Focus (Glasses for Fine Print)', cls: 'text-amber-300' },
              halos: { text: 'Halo Glow Around Lights', cls: 'text-amber-300' }
            };
          }
          if (activeCondition === 'presbyopia-astig') {
            return {
              far: { text: 'High Quality Distance Vision', cls: 'text-emerald-300' },
              mid: { text: 'Clear Intermediate (~60 cm)', cls: 'text-emerald-300' },
              near: { text: 'Soft Near Focus (Glasses for Fine Print)', cls: 'text-amber-300' },
              halos: { text: 'Subtle Astigmatic Light Halo', cls: 'text-amber-200' }
            };
          }
          return {
            far: { text: 'High Quality Distance Vision', cls: 'text-emerald-300' },
            mid: { text: 'Clear Intermediate (~60 cm)', cls: 'text-emerald-300' },
            near: { text: 'Soft Near Focus (Glasses for Fine Print)', cls: 'text-amber-300' },
            halos: { text: 'Clean Night Point Lights', cls: 'text-sky' }
          };
        }
      },
      trifocal: {
        baseName: 'Trifocal',
        toricName: 'Trifocal Toric',
        panelTitle: () =>
          isAstigCondition()
            ? 'Trifocal Toric (Full Range of Focus)'
            : 'Trifocal (Full Range of Focus)',
        cardTitle: () => (isAstigCondition() ? 'Trifocal Toric' : 'Trifocal'),
        cardDesc: () =>
          isAstigCondition()
            ? 'A full range of focus toric IOL that offers glasses free vision at all distances, as well as astigmatism correction.'
            : 'A full range of focus IOL that offers glasses free vision at all distances.',
        // Full Range of Focus: Distance, Intermediate, and Close Near are ALL sharp (0px blur)
        farBlur: 0,
        foregroundZoneBlur: 0,
        foregroundStartY: 0.5,
        foregroundFullY: 0.8,
        getLiveApproachBlur: () => 0,
        readingCardBlur: 0,
        hasTrifocalHalos: true,
        getZones: () => ({
          far: { text: 'Clear Distance · Softer Contrast', cls: 'text-amber-200' },
          mid: { text: 'Clear Intermediate (~60 cm)', cls: 'text-emerald-300' },
          near: { text: 'Clear Near & Close-Up (35 cm)', cls: 'text-emerald-300' },
          halos: { text: 'Visible Halo Around Lights', cls: 'text-rose-300' }
        })
      },
      galaxy: {
        baseName: 'RayOne Galaxy',
        toricName: 'RayOne Galaxy Toric',
        panelTitle: () =>
          isAstigCondition()
            ? 'RayOne Galaxy Toric (Full Range of Focus)'
            : 'RayOne Galaxy (Full Range of Focus)',
        cardTitle: () => (isAstigCondition() ? 'RayOne Galaxy Toric' : 'RayOne Galaxy'),
        cardDesc: () =>
          isAstigCondition()
            ? 'A full range of focus toric IOL that offers glasses free vision at all distances, as well as astigmatism correction.'
            : 'A full range of focus IOL that offers glasses free vision at all distances.',
        // Full Range of Focus (Spiral Optic): 0px blur at Distance, Intermediate, and Close Near, with 100% light transmission & monofocal-like halo-free night contrast
        farBlur: 0,
        foregroundZoneBlur: 0,
        foregroundStartY: 0.5,
        foregroundFullY: 0.8,
        getLiveApproachBlur: () => 0,
        readingCardBlur: 0,
        hasTrifocalHalos: false,
        hasGalaxySubtleHalo: true,
        getZones: () => ({
          far: { text: 'Crystal Sharp · Full Contrast', cls: 'text-emerald-300' },
          mid: { text: 'Crystal Sharp Intermediate (~60 cm)', cls: 'text-emerald-300' },
          near: { text: 'Crystal Sharp Close-Up (35 cm)', cls: 'text-emerald-300' },
          halos: { text: 'Subtle, Less Noticeable Halo (Spiral Optic)', cls: 'text-sky' }
        })
      }
    };

    const CONDITIONS = {
      cataracts: {
        name: 'Cataracts',
        panelTitle: () => 'Cataracts',
        cardTitle: () => 'Cataracts',
        cardDesc: () =>
          'Cataracts are when the lens, a small transparent disc inside your eye, develops cloudy patches. Over time these patches usually become bigger causing blurry, misty vision and eventually blindness.',
        // Matches media_1793751254015_4f81cd1e.jpg: misty 2.2px cataract softness (so faces & objects remain recognizable) + warm sandy-amber veil
        farBlur: 2.2,
        foregroundZoneBlur: 2.8,
        foregroundStartY: 0.58,
        foregroundFullY: 0.85,
        getLiveApproachBlur: (prox) => 2.2 + prox * 8.0,
        readingCardBlur: 8.5,
        hasCataractGlare: true,
        hasAstig: false,
        getZones: () => ({
          far: { text: 'Misty Amber Haze & Softness', cls: 'text-rose-300' },
          mid: { text: 'Cloudy & Washed-Out Intermediate', cls: 'text-rose-300' },
          near: { text: 'Blurry & Misty Near Focus', cls: 'text-rose-300' },
          halos: { text: 'Diffuse Cataract Glare & Veil', cls: 'text-rose-300' }
        })
      },
      'cataracts-astig': {
        name: 'Cataracts + Astigmatism',
        panelTitle: () => 'Cataracts + Astigmatism',
        cardTitle: () => 'Cataracts + Astigmatism',
        cardDesc: () =>
          'Cataracts are when the lens inside your eye develops cloudy patches causing blurry, misty vision. Combined with astigmatism, an irregularly shaped cornea or lens creates ghosted, stretched contours across all distances.',
        // Matches media_1793751268300_04cd8025.jpg: misty cataract softness + distinct diagonal astigmatic double-contours + warm sandy-amber veil
        farBlur: 2.6,
        foregroundZoneBlur: 3.5,
        foregroundStartY: 0.58,
        foregroundFullY: 0.85,
        getLiveApproachBlur: (prox) => 2.8 + prox * 8.5,
        readingCardBlur: 10.0,
        hasCataractGlare: true,
        hasAstig: true,
        getZones: () => ({
          far: { text: 'Cloudy Haze + Ghosted Contours', cls: 'text-rose-300' },
          mid: { text: 'Stretched & Cloudy Intermediate', cls: 'text-rose-300' },
          near: { text: 'Heavily Blurred Near Vision', cls: 'text-rose-300' },
          halos: { text: 'Cataract Veil + Stretched Glare', cls: 'text-rose-300' }
        })
      },
      astigmatism: {
        name: 'Astigmatism',
        panelTitle: () => 'Astigmatism',
        cardTitle: () => 'Astigmatism',
        cardDesc: () =>
          'Astigmatism means your eye is shaped more like a rugby ball than a football, so light is focused at more than one place in the eye, causing blurred, ghosted contours and halos around lights.',
        // Crisp double-contour ghosting across the scene without washing out or obliterating the face
        farBlur: 0.4,
        foregroundZoneBlur: 0.8,
        foregroundStartY: 0.65,
        foregroundFullY: 0.88,
        getLiveApproachBlur: (prox) => 0.6 + prox * 7.5,
        readingCardBlur: 6.5,
        hasCataractGlare: false,
        hasAstig: true,
        getZones: () => ({
          far: { text: 'Double-Contour Astigmatic Ghosting', cls: 'text-amber-300' },
          mid: { text: 'Ghosted Intermediate Contours', cls: 'text-amber-300' },
          near: { text: 'Ghosted & Soft Near Focus', cls: 'text-rose-300' },
          halos: { text: 'Stretched Astigmatic Light Halo', cls: 'text-amber-300' }
        })
      },
      presbyopia: {
        name: 'Presbyopia',
        panelTitle: () => 'Presbyopia',
        cardTitle: () => 'Presbyopia',
        cardDesc: () =>
          'Presbyopia is the natural ageing of the eye’s lens, making it harder to focus on close-up objects such as dashboards, smartphones, and reading material while distance vision remains clear.',
        // Matches media_1793751280745_f1bc714e.jpg: 100% crisp upper/distance view (0px), heavily blurred lower near foreground (y = 64%..100%) & close approach
        farBlur: 0,
        foregroundZoneBlur: 12.0,
        foregroundStartY: 0.64,
        foregroundFullY: 0.86,
        getLiveApproachBlur: (prox) => (prox <= 0.08 ? 0 : Math.pow((prox - 0.08) / 0.92, 0.95) * 16.0),
        readingCardBlur: 11.5,
        hasCataractGlare: false,
        hasAstig: false,
        getZones: () => ({
          far: { text: 'Clear Distance Vision (0px)', cls: 'text-emerald-300' },
          mid: { text: 'Blurry Dashboard / Intermediate', cls: 'text-amber-300' },
          near: { text: 'Blurry Hands & Close-Up (<45 cm)', cls: 'text-rose-300' },
          halos: { text: 'Clean Natural Night Lights', cls: 'text-sky' }
        })
      },
      'presbyopia-astig': {
        name: 'Presbyopia + Astigmatism',
        panelTitle: () => 'Presbyopia + Astigmatism',
        cardTitle: () => 'Presbyopia + Astigmatism',
        cardDesc: () =>
          'Presbyopia combined with astigmatism causes loss of near focusing ability for close objects alongside double-contour ghosting and distortion at distance.',
        // Matches media_1793751289278_8098ce78.jpg: sharp upper/distance with distinct double-edge astigmatic ghosting + heavily blurred lower near foreground (y = 64%..100%)
        farBlur: 0.3,
        foregroundZoneBlur: 12.0,
        foregroundStartY: 0.64,
        foregroundFullY: 0.86,
        getLiveApproachBlur: (prox) => (prox <= 0.08 ? 0.3 : 0.3 + Math.pow((prox - 0.08) / 0.92, 0.95) * 15.5),
        readingCardBlur: 12.5,
        hasCataractGlare: false,
        hasAstig: true,
        getZones: () => ({
          far: { text: 'Double-Contour Ghosted Distance', cls: 'text-amber-300' },
          mid: { text: 'Blurry & Ghosted Intermediate', cls: 'text-rose-300' },
          near: { text: 'Heavily Blurred Near (<45 cm)', cls: 'text-rose-300' },
          halos: { text: 'Ghosted Night Light Contours', cls: 'text-amber-300' }
        })
      }
    };

    const getSelectionMeta = (key) => {
      if (key === 'condition' || !LENSES[key]) {
        return CONDITIONS[activeCondition] || CONDITIONS.cataracts;
      }
      return LENSES[key];
    };

    const syncLensDropdownLabels = () => {
      const toricMode = isAstigCondition();
      [vsimLensSelect, vsimCompareSelect].forEach((sel) => {
        if (!sel) return;
        Array.from(sel.options).forEach((opt) => {
          const l = LENSES[opt.value];
          if (l) {
            opt.textContent = toricMode ? l.toricName : l.baseName;
          }
        });
      });
      vsimQuickPills.forEach((btn) => {
        const k = btn.getAttribute('data-quick-iol');
        const l = LENSES[k];
        if (l) {
          if (k === 'monofocal') btn.textContent = toricMode ? 'Monofocal Toric' : 'Monofocal';
          if (k === 'emv') btn.textContent = toricMode ? 'EMV Toric' : 'EMV';
          if (k === 'trifocal') btn.textContent = toricMode ? 'Trifocal Toric' : 'Trifocal';
          if (k === 'galaxy') btn.textContent = toricMode ? 'Galaxy Toric' : 'Galaxy';
        }
      });
    };

    const updateCamUI = () => {
      if (vsimCamPill) vsimCamPill.classList.remove('hidden');

      if (cameraActive) {
        if (vsimCamPillTxt) vsimCamPillTxt.textContent = 'Live Camera Active';
        if (vsimCamDot) vsimCamDot.className = 'relative inline-flex size-2 rounded-full bg-emerald-400';
        if (vsimCamPing) vsimCamPing.classList.remove('hidden');
        if (vsimFlipBtn) {
          vsimFlipBtn.classList.remove('hidden');
          vsimFlipBtn.classList.add('flex');
        }
        if (vsimStartOverlay) vsimStartOverlay.classList.add('hidden');
      } else {
        if (vsimCamPillTxt) vsimCamPillTxt.textContent = 'Start Live Camera';
        if (vsimCamDot) vsimCamDot.className = 'relative inline-flex size-2 rounded-full bg-amber-400';
        if (vsimCamPing) vsimCamPing.classList.add('hidden');
        if (vsimFlipBtn) {
          vsimFlipBtn.classList.add('hidden');
          vsimFlipBtn.classList.remove('flex');
        }
        if (vsimStartOverlay) vsimStartOverlay.classList.remove('hidden');
      }
    };

    const syncUI = () => {
      syncLensDropdownLabels();
      const leftMeta = getSelectionMeta(activeLens);
      const rightMeta = getSelectionMeta(compareTarget);

      const leftTitle = typeof leftMeta.panelTitle === 'function' ? leftMeta.panelTitle() : leftMeta.panelTitle;
      const rightTitle = typeof rightMeta.panelTitle === 'function' ? rightMeta.panelTitle() : rightMeta.panelTitle;

      const leftCardTitle = typeof leftMeta.cardTitle === 'function' ? leftMeta.cardTitle() : leftTitle;
      const rightCardTitle = typeof rightMeta.cardTitle === 'function' ? rightMeta.cardTitle() : rightTitle;
      const leftCardDesc = typeof leftMeta.cardDesc === 'function' ? leftMeta.cardDesc() : leftMeta.desc;
      const rightCardDesc = typeof rightMeta.cardDesc === 'function' ? rightMeta.cardDesc() : rightMeta.desc;

      if (vsimPanelLeftTxt) vsimPanelLeftTxt.textContent = leftTitle;
      if (vsimPanelRightTxt) vsimPanelRightTxt.textContent = rightTitle;
      if (vsimInfoPopLeftTitle) vsimInfoPopLeftTitle.textContent = leftCardTitle;
      if (vsimInfoPopRightTitle) vsimInfoPopRightTitle.textContent = rightCardTitle;
      if (vsimInfoPopLeftBody) vsimInfoPopLeftBody.textContent = leftCardDesc;
      if (vsimInfoPopRightBody) vsimInfoPopRightBody.textContent = rightCardDesc;

      const zones = typeof leftMeta.getZones === 'function' ? leftMeta.getZones() : leftMeta.zones;
      if (zones) {
        if (vsimZoneFar) {
          vsimZoneFar.textContent = zones.far.text;
          vsimZoneFar.className = 'mt-0.5 block font-semibold ' + zones.far.cls;
        }
        if (vsimZoneMid) {
          vsimZoneMid.textContent = zones.mid.text;
          vsimZoneMid.className = 'mt-0.5 block font-semibold ' + zones.mid.cls;
        }
        if (vsimZoneNear) {
          vsimZoneNear.textContent = zones.near.text;
          vsimZoneNear.className = 'mt-0.5 block font-semibold ' + zones.near.cls;
        }
        if (vsimZoneHalos) {
          if (activeScene === 'reading') {
            if (vsimZoneHalosLabel) vsimZoneHalosLabel.textContent = '4. Near Reading Acuity (35 cm)';
            if (activeLens === 'monofocal') {
              vsimZoneHalos.textContent = 'Blurry · Reading Glasses Required (+2.50 D)';
              vsimZoneHalos.className = 'mt-0.5 block font-semibold text-rose-300';
            } else if (activeLens === 'emv') {
              vsimZoneHalos.textContent = 'Functional · Glasses Recommended for Fine Print';
              vsimZoneHalos.className = 'mt-0.5 block font-semibold text-amber-300';
            } else if (activeLens === 'trifocal') {
              vsimZoneHalos.textContent = 'Glasses-Free Sharp Reading (0px)';
              vsimZoneHalos.className = 'mt-0.5 block font-semibold text-emerald-300';
            } else if (activeLens === 'galaxy') {
              vsimZoneHalos.textContent = 'Glasses-Free Sharp Reading · 100% Contrast';
              vsimZoneHalos.className = 'mt-0.5 block font-semibold text-emerald-300';
            } else {
              vsimZoneHalos.textContent = activeCondition.includes('astig') ? 'Blurry + Astigmatic Double Text' : 'Blurry / Hazy Near Reading';
              vsimZoneHalos.className = 'mt-0.5 block font-semibold text-rose-300';
            }
          } else if (activeScene === 'daytime') {
            if (vsimZoneHalosLabel) vsimZoneHalosLabel.textContent = '4. Daytime Glare & Contrast';
            if (activeLens === 'monofocal' || activeLens === 'emv') {
              vsimZoneHalos.textContent = 'Natural Daytime Sunlit Contrast';
              vsimZoneHalos.className = 'mt-0.5 block font-semibold text-emerald-300';
            } else if (activeLens === 'trifocal') {
              vsimZoneHalos.textContent = 'Constricted Pupil (Minimal Daytime Halos)';
              vsimZoneHalos.className = 'mt-0.5 block font-semibold text-sky';
            } else if (activeLens === 'galaxy') {
              vsimZoneHalos.textContent = '100% Crisp Daylight Contrast · Zero Halos';
              vsimZoneHalos.className = 'mt-0.5 block font-semibold text-emerald-300';
            } else {
              vsimZoneHalos.textContent = activeCondition.includes('cataract') ? 'Sunlight Forward Scatter & Glare' : 'Daytime Astigmatic Ghosting';
              vsimZoneHalos.className = 'mt-0.5 block font-semibold text-rose-300';
            }
          } else {
            if (vsimZoneHalosLabel) vsimZoneHalosLabel.textContent = '4. Night Light Halos & Glare';
            vsimZoneHalos.textContent = zones.halos.text;
            vsimZoneHalos.className = 'mt-0.5 block font-semibold ' + zones.halos.cls;
          }
        }
      }

      vsimQuickPills.forEach((btn) => {
        const pillKey = btn.getAttribute('data-quick-iol');
        const isActive = pillKey === activeLens;
        btn.classList.toggle('border-sky', isActive);
        btn.classList.toggle('bg-sky/20', isActive);
        btn.classList.toggle('text-white', isActive);
        btn.classList.toggle('border-white/10', !isActive);
        btn.classList.toggle('bg-white/[0.04]', !isActive);
        btn.classList.toggle('text-cream/75', !isActive);
      });

      vsimDistBtns.forEach((btn) => {
        const mode = btn.getAttribute('data-dist-mode');
        const isActive = mode === distanceMode;
        btn.classList.toggle('bg-sky/25', isActive);
        btn.classList.toggle('border-sky', isActive);
        btn.classList.toggle('text-white', isActive);
        btn.classList.toggle('font-semibold', isActive);
        btn.classList.toggle('bg-white/5', !isActive);
        btn.classList.toggle('border-white/10', !isActive);
        btn.classList.toggle('text-cream/75', !isActive);
      });

      if (vsimCompareStatus) {
        vsimCompareStatus.textContent = isCompareOn ? 'ON' : 'OFF';
      }
      if (vsimCompareSelect) {
        vsimCompareSelect.disabled = !isCompareOn;
      }

      if (vsimPanelRightWrap && vsimPanelsWrap) {
        if (isCompareOn) {
          vsimPanelRightWrap.classList.remove('hidden');
          vsimPanelsWrap.className = 'grid grid-cols-1 lg:grid-cols-2 gap-px bg-white/15';
        } else {
          vsimPanelRightWrap.classList.add('hidden');
          vsimPanelsWrap.className = 'grid grid-cols-1 gap-px bg-white/15';
        }
      }

      updateCamUI();
      requestAnimationFrame(() => resizeCanvases());
    };

    if (vsimInfoBtnLeft && vsimInfoPopLeft) {
      vsimInfoBtnLeft.addEventListener('click', (e) => {
        e.stopPropagation();
        vsimInfoPopLeft.classList.toggle('hidden');
        if (vsimInfoPopRight) vsimInfoPopRight.classList.add('hidden');
      });
    }
    if (vsimInfoBtnRight && vsimInfoPopRight) {
      vsimInfoBtnRight.addEventListener('click', (e) => {
        e.stopPropagation();
        vsimInfoPopRight.classList.toggle('hidden');
        if (vsimInfoPopLeft) vsimInfoPopLeft.classList.add('hidden');
      });
    }
    if (vsimInfoCloseLeft && vsimInfoPopLeft) {
      vsimInfoCloseLeft.addEventListener('click', (e) => {
        e.stopPropagation();
        vsimInfoPopLeft.classList.add('hidden');
      });
    }
    if (vsimInfoCloseRight && vsimInfoPopRight) {
      vsimInfoCloseRight.addEventListener('click', (e) => {
        e.stopPropagation();
        vsimInfoPopRight.classList.add('hidden');
      });
    }
    if (vsimInfoPopLeft) {
      vsimInfoPopLeft.addEventListener('click', (e) => e.stopPropagation());
    }
    if (vsimInfoPopRight) {
      vsimInfoPopRight.addEventListener('click', (e) => e.stopPropagation());
    }
    document.addEventListener('click', () => {
      if (vsimInfoPopLeft) vsimInfoPopLeft.classList.add('hidden');
      if (vsimInfoPopRight) vsimInfoPopRight.classList.add('hidden');
    });

    vsimDistBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const m = btn.getAttribute('data-dist-mode') || 'auto';
        distanceMode = m;
        if (m === 'auto') {
          resetDistanceCalibration();
          targetProximity = 0.0;
        } else if (m === 'far') {
          targetProximity = 0.0;
        } else if (m === 'mid') {
          targetProximity = 0.50;
        } else if (m === 'near') {
          targetProximity = 0.95;
        }
        syncUI();
      });
    });

    const startCamera = async (mode = facingMode) => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        if (vsimCamHint) vsimCamHint.textContent = 'Camera not available in browser.';
        return;
      }
      try {
        if (mediaStream) {
          mediaStream.getTracks().forEach((t) => t.stop());
        }
        let stream;
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: { ideal: mode }, width: { ideal: 1280 }, height: { ideal: 720 } },
            audio: false
          });
        } catch {
          stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        }
        mediaStream = stream;
        vsimWebcam.srcObject = stream;
        await vsimWebcam.play();
        cameraActive = true;
        resetDistanceCalibration();
        updateCamUI();
      } catch {
        cameraActive = false;
        updateCamUI();
        if (vsimCamHint) vsimCamHint.textContent = 'Please allow camera access in your browser to test live vision.';
      }
    };

    const stopCamera = () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach((t) => t.stop());
        mediaStream = null;
      }
      cameraActive = false;
      updateCamUI();
    };

    let hasAttemptedCamera = false;
    const tryAutoCamera = () => {
      if (!hasAttemptedCamera && !cameraActive) {
        hasAttemptedCamera = true;
        void startCamera(facingMode);
      }
    };

    if (vsimCamPill) {
      vsimCamPill.addEventListener('click', () => {
        if (cameraActive) stopCamera();
        else void startCamera(facingMode);
      });
    }
    if (vsimCamCenterBtn) {
      vsimCamCenterBtn.addEventListener('click', () => void startCamera(facingMode));
    }
    if (vsimFlipBtn) {
      vsimFlipBtn.addEventListener('click', () => {
        facingMode = facingMode === 'environment' ? 'user' : 'environment';
        if (cameraActive) void startCamera(facingMode);
      });
    }

    if (vsimSceneSelect) {
      vsimSceneSelect.addEventListener('change', (e) => {
        activeScene = e.target.value;
        if (!cameraActive) {
          void startCamera(facingMode);
        }
        syncUI();
      });
    }
    if (vsimConditionSelect) {
      vsimConditionSelect.addEventListener('change', (e) => {
        activeCondition = e.target.value;
        // Automatically preview the selected Eye Condition ("Select Lens") just like galaxyiol.com/vision-simulator
        activeLens = 'condition';
        if (vsimLensSelect) vsimLensSelect.value = 'condition';
        syncUI();
      });
    }
    if (vsimLensSelect) {
      vsimLensSelect.addEventListener('change', (e) => {
        activeLens = e.target.value;
        syncUI();
      });
    }
    if (vsimCompareToggle) {
      vsimCompareToggle.addEventListener('change', (e) => {
        isCompareOn = e.target.checked;
        syncUI();
      });
    }
    if (vsimCompareSelect) {
      vsimCompareSelect.addEventListener('change', (e) => {
        compareTarget = e.target.value;
        syncUI();
      });
    }
    vsimQuickPills.forEach((btn) => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-quick-iol');
        if (target && LENSES[target]) {
          activeLens = target;
          if (vsimLensSelect) vsimLensSelect.value = target;
          syncUI();
        }
      });
    });

    document.querySelectorAll('[data-try-lens]').forEach((btn) => {
      btn.addEventListener('click', () => {
        let target = btn.getAttribute('data-try-lens') || 'galaxy';
        if (target === 'galaxy-toric') target = 'galaxy';
        if (target === 'emv-toric') target = 'emv';
        if (target === 'monofocal-toric') target = 'monofocal';
        if (LENSES[target]) {
          activeLens = target;
          if (vsimLensSelect) vsimLensSelect.value = target;
          syncUI();
          tryAutoCamera();
        }
      });
    });

    const resizeCanvases = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      [vsimCanvasLeft, vsimCanvasRight].forEach((c) => {
        if (!c) return;
        const rect = c.getBoundingClientRect();
        if (rect.width && rect.height) {
          const w = Math.round(rect.width * dpr);
          const h = Math.round(rect.height * dpr);
          if (c.width !== w || c.height !== h) {
            c.width = w;
            c.height = h;
          }
        }
      });
    };
    resizeCanvases();
    window.addEventListener('resize', resizeCanvases, { passive: true });

    const sizeCanvas = (c, w, h) => {
      if (c.width !== w || c.height !== h) {
        c.width = w;
        c.height = h;
      }
    };

    const drawVideoCover = (ctx, w, h) => {
      const vw = vsimWebcam.videoWidth || w;
      const vh = vsimWebcam.videoHeight || h;
      const k = Math.max(w / vw, h / vh);
      const dw = vw * k;
      const dh = vh * k;
      ctx.save();
      if (facingMode === 'user') {
        ctx.translate(w, 0);
        ctx.scale(-1, 1);
      }
      ctx.drawImage(vsimWebcam, (w - dw) * 0.5, (h - dh) * 0.5, dw, dh);
      ctx.restore();
    };

    // Real-Time Camera Subject Distance Estimator + Spatial Foreground Mask Builder
    // Uses YCbCr human skin area + Baseline Frame Occlusion + optional FaceDetector so moving closer to ANY webcam immediately registers!
    const analyzeLiveCameraDepth = () => {
      if (!cameraActive || vsimWebcam.readyState < 2) {
        if (distanceMode === 'auto') targetProximity = 0.0;
        return;
      }

      const dw = 120, dh = 68;
      distCtx.save();
      if (facingMode === 'user') {
        distCtx.translate(dw, 0);
        distCtx.scale(-1, 1);
      }
      distCtx.drawImage(vsimWebcam, 0, 0, dw, dh);
      distCtx.restore();

      const imgData = distCtx.getImageData(0, 0, dw, dh).data;
      warmupFrames++;

      // 1. Optional Native FaceDetector
      if (faceDetector && !faceDetectBusy && frameCounter % 5 === 0) {
        faceDetectBusy = true;
        faceDetector
          .detect(distCanvas)
          .then((faces) => {
            if (faces && faces.length > 0) {
              detectedFaceBox = faces[0].boundingBox;
            } else {
              detectedFaceBox = null;
            }
            faceDetectBusy = false;
          })
          .catch(() => {
            faceDetectBusy = false;
          });
      }

      // 2. Count YCbCr Skin Pixels (Face + Hands) in the central field (x: 15%..85%, y: 10%..92%)
      let skinPixels = 0;
      let sN = 0, sSX = 0, sSY = 0, sSXX = 0, sSYY = 0;
      let centralTotal = 0;
      for (let y = 7; y < 63; y++) {
        for (let x = 18; x < 102; x++) {
          const idx = (y * dw + x) * 4;
          const r = imgData[idx];
          const g = imgData[idx + 1];
          const b = imgData[idx + 2];

          const Y = 0.299 * r + 0.587 * g + 0.114 * b;
          const Cb = 128 - 0.168736 * r - 0.331264 * g + 0.5 * b;
          const Cr = 128 + 0.5 * r - 0.418688 * g - 0.081312 * b;

          centralTotal++;
          if (Y > 38 && Cb >= 77 && Cb <= 133 && Cr >= 131 && Cr <= 178) {
            skinPixels++;
            if (y < 42) { sN++; sSX += x; sSY += y; sSXX += x * x; sSYY += y * y; }
          }
        }
      }
      const currentSkinRatio = skinPixels / Math.max(1, centralTotal);

      // Person model: face centroid/spread + jacket colour sampled just below the face
      let pCX = -1, pCY = -1, pSX = 0, pSY = 0, jacket = null;
      if (sN > 25) {
        pCX = sSX / sN; pCY = sSY / sN;
        pSX = Math.max(4, Math.sqrt(Math.max(0, sSXX / sN - pCX * pCX)));
        pSY = Math.max(4, Math.sqrt(Math.max(0, sSYY / sN - pCY * pCY)));
        const jy = Math.min(dh - 8, Math.round(pCY + 2.4 * pSY) + 2);
        let jr = 0, jg = 0, jb = 0, jn = 0;
        for (let yy = jy; yy < jy + 6; yy++) {
          for (let xx = Math.max(0, Math.round(pCX) - 6); xx < Math.min(dw, Math.round(pCX) + 6); xx++) {
            const k = (yy * dw + xx) * 4;
            jr += imgData[k]; jg += imgData[k + 1]; jb += imgData[k + 2]; jn++;
          }
        }
        if (jn) jacket = [jr / jn, jg / jn, jb / jn];
      }
      const personReceding = baselineSkinRatio !== null && currentSkinRatio < baselineSkinRatio * 0.92;
      const personLeaningIn =
        (baselineSkinRatio !== null && currentSkinRatio > baselineSkinRatio * 1.15) ||
        (detectedFaceBox && baselineFaceRatio &&
          Math.max(detectedFaceBox.width / dw, detectedFaceBox.height / dh) > baselineFaceRatio * 1.08);

      // Calibrate baseline after 10 warmup frames; keep baselineSkinRatio at normal seated desk level (>= 0.14)
      if (!baselineFrameData && warmupFrames >= 10) {
        baselineFrameData = new Uint8ClampedArray(imgData);
        baselineSkinRatio = Math.max(0.14, currentSkinRatio);
        if (detectedFaceBox) {
          baselineFaceRatio = Math.max(0.28, Math.max(detectedFaceBox.width / dw, detectedFaceBox.height / dh));
        }
      } else if (baselineFrameData && currentSkinRatio <= 0.22) {
        // Slowly adapt baseline frame & skin ratio while user is seated at normal desk distance so shifting in chair never causes stuck close-blur
        baselineSkinRatio = Math.max(0.14, baselineSkinRatio * 0.95 + currentSkinRatio * 0.05);
        /* per-pixel adaptation happens in the mask loop */
      }

      // 3. Measure Change Against Baseline Frame + Track Spatial Location of Held Near Object
      const maskData = fgSmallImgData.data;
      if (!personMem || personMem.length !== dw * dh) personMem = new Float32Array(dw * dh);
      for (let i = 0; i < personMem.length; i++) personMem[i] *= 0.985;
      let motionChanged = 0, motionTotal = 0;
      let innerChangedPixels = 0;
      let innerTotalPixels = 0;
      let sumObjX = 0, sumObjY = 0, objPixels = 0;
      let minObjX = dw, maxObjX = 0, minObjY = dh, maxObjY = 0;

      for (let y = 0; y < dh; y++) {
        const ny = y / dh;
        for (let x = 0; x < dw; x++) {
          const nx = x / dw;
          const idx = (y * dw + x) * 4;
          const r = imgData[idx];
          const g = imgData[idx + 1];
          const b = imgData[idx + 2];

          let diffBase = 0;
          if (baselineFrameData) {
            diffBase =
              Math.abs(r - baselineFrameData[idx]) +
              Math.abs(g - baselineFrameData[idx + 1]) +
              Math.abs(b - baselineFrameData[idx + 2]);
          }

          const pi = y * dw + x;
          if (personReceding && !personLeaningIn && pCX >= 0) {
            const inFace = Math.abs(x - pCX) < pSX * 3.2 && y > pCY - pSY * 3.2 && y < pCY + pSY * 3.4;
            let isJacket = false;
            if (jacket) {
              isJacket = Math.abs(r - jacket[0]) + Math.abs(g - jacket[1]) + Math.abs(b - jacket[2]) < 95;
            }
            if (inFace || isJacket) personMem[pi] = 1;
          }
          if (personMem[pi] > 0.15) diffBase = 0;
          if (prevFrameData && nx >= 0.12 && nx <= 0.88 && ny >= 0.20 && ny <= 0.97) {
            const dm = Math.abs(r - prevFrameData[idx]) + Math.abs(g - prevFrameData[idx + 1]) + Math.abs(b - prevFrameData[idx + 2]);
            motionTotal++;
            if (dm > 50) motionChanged++;
          }
          {
            const m = diffBase > 42 ? Math.min(1, (diffBase - 32) / 55) : 0;
            maskData[idx] = 255; maskData[idx + 1] = 255; maskData[idx + 2] = 255;
            maskData[idx + 3] = Math.round(m * 255);
          }
          if (baselineFrameData) {
            const rate = diffBase <= 55 ? 0.10 : 0.004;
            baselineFrameData[idx] += (r - baselineFrameData[idx]) * rate;
            baselineFrameData[idx + 1] += (g - baselineFrameData[idx + 1]) * rate;
            baselineFrameData[idx + 2] += (b - baselineFrameData[idx + 2]) * rate;
          }
          if (nx >= 0.15 && nx <= 0.85 && ny >= 0.15 && ny <= 0.95) {
            innerTotalPixels++;
            if (diffBase > 42) {
              innerChangedPixels++;
              sumObjX += x;
              sumObjY += y;
              objPixels++;
              if (x < minObjX) minObjX = x;
              if (x > maxObjX) maxObjX = x;
              if (y < minObjY) minObjY = y;
              if (y > maxObjY) maxObjY = y;
            }
          }
        }
      }

      fgSmallCtx.putImageData(fgSmallImgData, 0, 0);
      prevFrameData = new Uint8ClampedArray(imgData);

      // Smooth tracking of the near object position and scale
      if (objPixels >= 35) {
        nearObjDetected = true;
        const targetCenterX = (sumObjX / objPixels) / dw;
        const targetCenterY = (sumObjY / objPixels) / dh;
        const targetRadiusX = Math.max(0.18, Math.min(0.42, ((maxObjX - minObjX) / dw) * 0.65));
        const targetRadiusY = Math.max(0.18, Math.min(0.42, ((maxObjY - minObjY) / dh) * 0.65));

        nearObjSmoothX = nearObjSmoothX * 0.65 + targetCenterX * 0.35;
        nearObjSmoothY = nearObjSmoothY * 0.65 + targetCenterY * 0.35;
        nearObjSmoothRadiusX = nearObjSmoothRadiusX * 0.65 + targetRadiusX * 0.35;
        nearObjSmoothRadiusY = nearObjSmoothRadiusY * 0.65 + targetRadiusY * 0.35;
      } else {
        nearObjDetected = false;
        nearObjSmoothX = nearObjSmoothX * 0.90 + 0.50 * 0.10;
        nearObjSmoothY = nearObjSmoothY * 0.90 + 0.68 * 0.10;
        nearObjSmoothRadiusX = nearObjSmoothRadiusX * 0.90 + 0.30 * 0.10;
        nearObjSmoothRadiusY = nearObjSmoothRadiusY * 0.90 + 0.28 * 0.10;
      }

      const innerChangeRatio = innerChangedPixels / Math.max(1, innerTotalPixels);

      // Robust Optical Reading Material Detection (Book, phone, tablet, document held at ~35 cm reading distance)
      // Only evaluated when an actual object is brought into the near field (innerChangeRatio > 0.16 or occlusion),
      // preventing static window blinds, bookshelves, or walls from ever false-triggering!
      let textDensity = 0;
      isReadingTextDetected = false;
      const hasNearObject = innerChangeRatio > 0.16;

      if (hasNearObject || distanceMode === 'near') {
        let textHCount = 0;
        let textVCount = 0;
        let textSamples = 0;
        // Sample the central-to-lower reading zone where reading items are naturally held
        for (let y = 30; y < 62; y += 2) {
          for (let x = 30; x < 90; x += 2) {
            const idx = (y * dw + x) * 4;
            const idxL = (y * dw + (x - 2)) * 4;
            const idxU = ((y - 2) * dw + x) * 4;
            const yCur = 0.299 * imgData[idx] + 0.587 * imgData[idx + 1] + 0.114 * imgData[idx + 2];
            const yPrevH = 0.299 * imgData[idxL] + 0.587 * imgData[idxL + 1] + 0.114 * imgData[idxL + 2];
            const yPrevV = 0.299 * imgData[idxU] + 0.587 * imgData[idxU + 1] + 0.114 * imgData[idxU + 2];
            textSamples++;
            if (Math.abs(yCur - yPrevH) > 28) textHCount++;
            if (Math.abs(yCur - yPrevV) > 28) textVCount++;
          }
        }
        const hRatio = textHCount / Math.max(1, textSamples);
        const vRatio = textVCount / Math.max(1, textSamples);
        // Real printed text has micro-transitions along BOTH horizontal and vertical axes (characters & words),
        // whereas window blinds only have lines along a single axis!
        textDensity = Math.min(hRatio, vRatio);
        if (textDensity > 0.14 && (hasNearObject || distanceMode === 'near')) {
          isReadingTextDetected = true;
        }
      }

      if (distanceMode === 'auto') {
        // Signal A: People leaning closer (skin expansion relative to calibrated seated posture)
        let skinProx = 0;
        if (baselineSkinRatio !== null && currentSkinRatio > baselineSkinRatio * 1.15) {
          skinProx = Math.min(1.0, (currentSkinRatio - baselineSkinRatio * 1.15) / Math.max(0.08, baselineSkinRatio * 0.65));
        }

        // Signal B: Things/objects/hands held near the lens (occlusion & central foreground presence)
        let occlusionProx = Math.max(0, Math.min(1.0, (innerChangeRatio - 0.03) / 0.16));
        if (innerChangeRatio > 0.025) occlusionProx = Math.max(occlusionProx, 0.8);
        const subjectReceding =
          (baselineSkinRatio !== null && currentSkinRatio < baselineSkinRatio * 0.92) ||
          (detectedFaceBox && baselineFaceRatio &&
            Math.max(detectedFaceBox.width / dw, detectedFaceBox.height / dh) < baselineFaceRatio * 0.97);
        /* receding handled by person-memory mask */

        // Signal C: People/Face approaching (Native FaceDetector growth)
        let faceProx = 0;
        if (detectedFaceBox) {
          const curFaceRatio = Math.max(detectedFaceBox.width / dw, detectedFaceBox.height / dh);
          if (!baselineFaceRatio) baselineFaceRatio = Math.max(0.26, curFaceRatio);
          if (curFaceRatio > baselineFaceRatio * 1.08) {
            faceProx = Math.min(1.0, (curFaceRatio - baselineFaceRatio * 1.08) / (baselineFaceRatio * 0.50));
          }
        }

        // Physical proximity of near people or things
        let rawProx = Math.max(skinProx, occlusionProx, faceProx);
        const motionRatio = motionChanged / Math.max(1, motionTotal);
        if (motionRatio > 0.025 && !personReceding) rawProx = Math.max(rawProx, 0.8);

        // When reading material (sticky note, book, phone, document) is detected,
        // it is physically in the near field at reading distance (~35 cm / prox ~ 0.85)
        if (isReadingTextDetected) {
          rawProx = Math.max(rawProx, 0.85);
        }

        rawProx = Math.max(0, Math.min(1, rawProx));
        const nowMs = performance.now();
        if (rawProx > 0.15) {
          proxHoldVal = Math.max(rawProx, proxHoldVal * 0.9);
          proxHoldUntil = nowMs + 450;
        } else if (nowMs < proxHoldUntil) {
          rawProx = Math.max(rawProx, proxHoldVal);
        } else {
          proxHoldVal = 0;
        }
        targetProximity = rawProx;
      }
    };

    const updateDistanceBadgeUI = () => {
      if (!vsimDistanceTxt || !vsimDistanceDot) return;
      const estCm = Math.round(92 - liveProximity * 62);
      const activeMeta = getSelectionMeta(activeLens);
      const approachBlur = activeMeta.getLiveApproachBlur ? activeMeta.getLiveApproachBlur(liveProximity) : 0;

      const modePrefix = distanceMode === 'auto' ? 'Live Camera' : 'Simulated Distance';

      if (isReadingTextDetected) {
        // Real-time Reading Material / Text Detected on Live Camera!
        if (activeLens === 'galaxy') {
          vsimDistanceDot.className = 'size-2 rounded-full bg-emerald-400';
          vsimDistanceTxt.textContent = `📖 Reading Text (~${estCm} cm) · In Focus · 100% Contrast (Glasses-Free)`;
        } else if (activeLens === 'trifocal') {
          vsimDistanceDot.className = 'size-2 rounded-full bg-emerald-400';
          vsimDistanceTxt.textContent = `📖 Reading Text (~${estCm} cm) · In Focus (Glasses-Free)`;
        } else if (activeLens === 'emv') {
          vsimDistanceDot.className = 'size-2 rounded-full bg-amber-400';
          vsimDistanceTxt.textContent = `📖 Reading Text (~${estCm} cm) · Soft Near Focus (Light Readers for Fine Print)`;
        } else {
          // Monofocal and Untreated Conditions
          vsimDistanceDot.className = 'size-2 rounded-full bg-rose-400';
          vsimDistanceTxt.textContent = `📖 Reading Text (~${estCm} cm) · Blurry (Reading Glasses Required)`;
        }
        return;
      }

      if (activeLens === 'emv') {
        if (approachBlur <= 0.5) {
          vsimDistanceDot.className = 'size-2 rounded-full bg-emerald-400';
          vsimDistanceTxt.textContent = `${modePrefix}: ~${estCm} cm (Intermediate In Focus — RayOne EMV EDoF)`;
        } else {
          vsimDistanceDot.className = 'size-2 rounded-full bg-amber-400';
          vsimDistanceTxt.textContent = `${modePrefix}: ~${estCm} cm (Soft Near Focus · Light Readers for Fine Print)`;
        }
        return;
      }

      if (activeLens === 'monofocal') {
        if (approachBlur <= 0.6) {
          vsimDistanceDot.className = 'size-2 rounded-full bg-emerald-400';
          vsimDistanceTxt.textContent = `${modePrefix}: ~${estCm} cm (Distance Clear · Near Objects Blurry)`;
        } else if (approachBlur <= 6.5) {
          vsimDistanceDot.className = 'size-2 rounded-full bg-amber-400';
          vsimDistanceTxt.textContent = `${modePrefix}: ~${estCm} cm (Intermediate Distance — Blurring)`;
        } else {
          vsimDistanceDot.className = 'size-2 rounded-full bg-rose-400';
          vsimDistanceTxt.textContent = `${modePrefix}: ~${estCm} cm (Near People & Things Blurry · Glasses Required)`;
        }
        return;
      }

      if (approachBlur <= 0.6) {
        vsimDistanceDot.className = 'size-2 rounded-full bg-emerald-400';
        vsimDistanceTxt.textContent = `${modePrefix}: ~${estCm} cm (In Focus — Clear)`;
      } else if (approachBlur <= 6.5) {
        vsimDistanceDot.className = 'size-2 rounded-full bg-amber-400';
        vsimDistanceTxt.textContent = `${modePrefix}: ~${estCm} cm (Moving Closer — Blurring)`;
      } else {
        vsimDistanceDot.className = 'size-2 rounded-full bg-rose-400';
        vsimDistanceTxt.textContent = `${modePrefix}: ~${estCm} cm (Close to Camera — Blurry)`;
      }
    };

    // Offscreen 200x112 buffer for Real-Time Camera Light-Source Detection (isolates ONLY actual bright lights in the camera feed; 0% circles)
    const lightDetectCanvas = document.createElement('canvas');
    lightDetectCanvas.width = 200;
    lightDetectCanvas.height = 112;
    const lightDetectCtx = lightDetectCanvas.getContext('2d', { willReadFrequently: true });
    const lightExtractImgData = lightDetectCtx.createImageData(200, 112);

    // Extracts ONLY compact bright light sources (phone flashlights, bulbs, lamps, headlights) and ignores flat white walls
    const lumaMap = new Float32Array(200 * 112);
    const extractDetectedCameraLights = (videoSrcEl, warmTint = 1.0) => {
      const lw = 200, lh = 112;
      lightDetectCtx.clearRect(0, 0, lw, lh);
      lightDetectCtx.drawImage(videoSrcEl, 0, 0, lw, lh);
      const srcData = lightDetectCtx.getImageData(0, 0, lw, lh).data;
      const outData = lightExtractImgData.data;

      let sumY = 0;
      const totalPx = lw * lh;
      for (let p = 0; p < totalPx; p++) {
        const i = p * 4;
        const Y = 0.2126 * srcData[i] + 0.7152 * srcData[i + 1] + 0.0722 * srcData[i + 2];
        lumaMap[p] = Y;
        sumY += Y;
      }
      const meanY = sumY / totalPx;
      const lumaThreshold = Math.max(198, Math.min(234, meanY * 1.32 + 88));

      for (let y = 0; y < lh; y++) {
        for (let x = 0; x < lw; x++) {
          const p = y * lw + x;
          const i = p * 4;
          const Y = lumaMap[p];
          const r = srcData[i];
          const g = srcData[i + 1];
          const b = srcData[i + 2];
          const lightMetric = Math.max(Y, Math.max(r, g, b) * 0.95);

          if (lightMetric <= lumaThreshold) {
            outData[i] = 0;
            outData[i + 1] = 0;
            outData[i + 2] = 0;
            outData[i + 3] = 0;
            continue;
          }

          // Check wider neighborhood at two radii (14px and 26px on 200x112) so large sunlit windows/curtains are ALWAYS ignored (even when Y === 255!),
          // while compact point lights (phone flashlight, bulb, lamp) pass cleanly!
          const r1 = 14, r2 = 26;
          const ax0 = Math.max(0, x - r1), ax1 = Math.min(lw - 1, x + r1);
          const ay0 = Math.max(0, y - r1), ay1 = Math.min(lh - 1, y + r1);
          const bx0 = Math.max(0, x - r2), bx1 = Math.min(lw - 1, x + r2);
          const by0 = Math.max(0, y - r2), by1 = Math.min(lh - 1, y + r2);

          const surround14 = (
            lumaMap[ay0 * lw + ax0] + lumaMap[ay0 * lw + ax1] + lumaMap[ay1 * lw + ax0] + lumaMap[ay1 * lw + ax1] +
            lumaMap[y * lw + ax0] + lumaMap[y * lw + ax1] + lumaMap[ay0 * lw + x] + lumaMap[ay1 * lw + x]
          ) / 8;

          const surround26 = (
            lumaMap[by0 * lw + bx0] + lumaMap[by0 * lw + bx1] + lumaMap[by1 * lw + bx0] + lumaMap[by1 * lw + bx1] +
            lumaMap[y * lw + bx0] + lumaMap[y * lw + bx1] + lumaMap[by0 * lw + x] + lumaMap[by1 * lw + x]
          ) / 8;

          // A sunlit window or bright wall has high luminance across a wide area (surround14 > 180 or surround26 > 165). Ignore it unconditionally!
          if (surround14 > 182 || surround26 > 165) {
            outData[i] = 0;
            outData[i + 1] = 0;
            outData[i + 2] = 0;
            outData[i + 3] = 0;
            continue;
          }
          const surroundY = surround14;

          const norm = Math.min(1, (lightMetric - lumaThreshold) / Math.max(14, 255 - lumaThreshold));
          const contrastBoost = Math.min(1.2, Math.max(0.25, (lightMetric - surroundY + 25) / 65));
          const intensity = Math.pow(norm, 0.42) * contrastBoost;

          // Warm optical halo glow (never dark/black!)
          outData[i] = 255;
          outData[i + 1] = Math.min(255, Math.round(g * 0.45 + 202 * 0.55));
          outData[i + 2] = Math.min(255, Math.round(b * 0.30 + (135 - 25 * warmTint) * 0.70));
          outData[i + 3] = Math.min(255, Math.round(intensity * 255));
        }
      }
      lightDetectCtx.putImageData(lightExtractImgData, 0, 0);
    };

    // Renders a realistic multi-pass optical halo around detected camera light sources (NO drawn circles, NO black shadows)
    const applyDetectedLightHalo = (ctx, videoSrcEl, w, h, scale, strength = 1.0, warmTint = 1.0, radiusScale = 1.0) => {
      extractDetectedCameraLights(videoSrcEl, warmTint);
      sizeCanvas(haloCanvas, w, h);

      // Pass 1: Wide outer optical halo scatter
      haloCtx.clearRect(0, 0, w, h);
      haloCtx.filter = 'blur(' + Math.max(8, 68 * scale * radiusScale).toFixed(1) + 'px)';
      haloCtx.drawImage(lightDetectCanvas, 0, 0, w, h);
      haloCtx.filter = 'none';
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = Math.min(1, 0.92 * strength);
      ctx.drawImage(haloCanvas, 0, 0, w, h);
      if (strength >= 0.85) {
        ctx.globalAlpha = Math.min(1, 0.65 * (strength - 0.35));
        ctx.drawImage(haloCanvas, 0, 0, w, h);
      }
      ctx.restore();

      // Pass 2: Distinct mid-radius optical halo aura around detected lights
      haloCtx.clearRect(0, 0, w, h);
      haloCtx.filter = 'blur(' + Math.max(5, 32 * scale * radiusScale).toFixed(1) + 'px)';
      haloCtx.drawImage(lightDetectCanvas, 0, 0, w, h);
      haloCtx.filter = 'none';
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = Math.min(1, 0.92 * strength);
      ctx.drawImage(haloCanvas, 0, 0, w, h);
      if (strength >= 0.85) {
        ctx.globalAlpha = Math.min(1, 0.55 * (strength - 0.30));
        ctx.drawImage(haloCanvas, 0, 0, w, h);
      }
      ctx.restore();

      // Pass 3: Tight inner light core bloom
      haloCtx.clearRect(0, 0, w, h);
      haloCtx.filter = 'blur(' + Math.max(2.5, 12 * scale * radiusScale).toFixed(1) + 'px)';
      haloCtx.drawImage(lightDetectCanvas, 0, 0, w, h);
      haloCtx.filter = 'none';
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = Math.min(1, 0.75 * strength);
      ctx.drawImage(haloCanvas, 0, 0, w, h);
      ctx.restore();
    };

    // Main Optical Renderer for a Viewport Panel
    const renderPanelOptics = (targetCtx, w, h, selectionKey) => {
      if (!w || !h) return;
      const scale = w / 480;
      const isNight = activeScene === 'night';
      const isReading = activeScene === 'reading';
      const isCondition = selectionKey === 'condition' || !LENSES[selectionKey];
      const meta = getSelectionMeta(selectionKey);

      // 1. ALWAYS Draw Live Camera Feed across all scenes!
      sizeCanvas(srcCanvas, w, h);
      srcCtx.clearRect(0, 0, w, h);
      if (cameraActive && vsimWebcam.readyState >= 2) {
        drawVideoCover(srcCtx, w, h);
      } else if (isReading && eveningSceneLoaded) {
        const iw = eveningSceneImg.naturalWidth || w;
        const ih = eveningSceneImg.naturalHeight || h;
        const k = Math.max(w / iw, h / ih);
        const dw = iw * k;
        const dh = ih * k;
        srcCtx.drawImage(eveningSceneImg, (w - dw) * 0.5, (h - dh) * 0.5, dw, dh);
      } else {
        const g = srcCtx.createLinearGradient(0, 0, 0, h);
        g.addColorStop(0, '#0c1b30');
        g.addColorStop(1, '#020711');
        srcCtx.fillStyle = g;
        srcCtx.fillRect(0, 0, w, h);
      }

      // 2. Scene-Specific Colour & Contrast Grade (Night Driving | Daytime | Evening Reading)
      const isDaytime = activeScene === 'daytime';
      let colorFilter = '';

      if (isCondition) {
        if (activeCondition === 'cataracts' || activeCondition === 'cataracts-astig') {
          // Cataracts: Warm amber haze & reduced contrast across all scenes
          if (isNight) {
            colorFilter = 'brightness(90%) contrast(68%) sepia(52%) saturate(102%)';
          } else if (isReading) {
            colorFilter = 'brightness(92%) contrast(70%) sepia(56%) saturate(100%)';
          } else {
            // Daytime: Sun glare scatter across clouded natural lens
            colorFilter = 'brightness(102%) contrast(66%) sepia(42%) saturate(96%)';
          }
        } else {
          // Untreated Presbyopia / Astigmatism
          if (isNight) {
            colorFilter = 'brightness(86%) contrast(114%) saturate(106%)';
          } else if (isReading) {
            colorFilter = 'brightness(95%) contrast(108%) sepia(16%) saturate(104%)';
          } else {
            colorFilter = 'brightness(101%) contrast(105%) saturate(103%)';
          }
        }
      } else if (selectionKey === 'trifocal') {
        // Diffractive Trifocal: ~14-18% diffractive light loss causes softer contrast & lifted black levels
        if (isNight) {
          colorFilter = 'brightness(86%) contrast(74%) saturate(76%)';
        } else if (isReading) {
          colorFilter = 'brightness(94%) contrast(84%) sepia(12%) saturate(88%)';
        } else {
          colorFilter = 'brightness(99%) contrast(90%) saturate(92%)';
        }
      } else if (selectionKey === 'galaxy') {
        // RayOne Galaxy: Non-diffractive spiral optic provides full 100% light transmission & razor-sharp contrast
        if (isNight) {
          colorFilter = 'brightness(86%) contrast(114%) saturate(108%)';
        } else if (isReading) {
          colorFilter = 'brightness(96%) contrast(108%) sepia(14%) saturate(105%)';
        } else {
          colorFilter = 'brightness(101%) contrast(106%) saturate(104%)';
        }
      } else {
        // Monofocal and RayOne EMV
        if (isNight) {
          if (activeCondition === 'cataracts') {
            colorFilter = 'brightness(80%) contrast(114%) saturate(104%)';
          } else if (activeCondition === 'cataracts-astig') {
            colorFilter = 'brightness(74%) contrast(120%) saturate(105%)';
          } else if (activeCondition === 'presbyopia') {
            colorFilter = 'brightness(70%) contrast(126%) saturate(106%)';
          } else {
            colorFilter = 'brightness(72%) contrast(122%) saturate(104%)';
          }
        } else if (isReading) {
          colorFilter = 'brightness(95%) contrast(108%) sepia(14%) saturate(104%)';
        } else {
          colorFilter = 'brightness(101%) contrast(105%) saturate(103%)';
        }
      }

      // 3A. Draw Distance Base Layer:
      // The person sitting farther back (>70cm) and the room background are at DISTANCE.
      // In Monofocal, EMV, Galaxy, and Trifocal, distance vision is 100% IN FOCUS (0px blur)!
      // (Untreated Cataracts has misty amber veil / far blur 2.2px).
      const farBlurPx = (meta.farBlur || 0) * scale;
      targetCtx.clearRect(0, 0, w, h);
      targetCtx.save();
      const bgFilters = [];
      if (farBlurPx > 0.2) bgFilters.push('blur(' + farBlurPx.toFixed(1) + 'px)');
      if (colorFilter) bgFilters.push(colorFilter);
      targetCtx.filter = bgFilters.length ? bgFilters.join(' ') : 'none';
      targetCtx.drawImage(srcCanvas, 0, 0, w, h);
      targetCtx.restore();

      // 3A-Astig: If viewing untreated Astigmatism, apply double-contour ghost shear
      if (isCondition && meta.hasAstig) {
        sizeCanvas(tmpCanvas, w, h);
        tmpCtx.clearRect(0, 0, w, h);
        tmpCtx.drawImage(targetCtx.canvas, 0, 0, w, h);
        targetCtx.save();
        targetCtx.globalAlpha = activeCondition === 'cataracts-astig' ? 0.52 : 0.48;
        targetCtx.drawImage(tmpCanvas, 8.5 * scale, -7.5 * scale, w, h);
        targetCtx.globalAlpha = 0.24;
        targetCtx.drawImage(tmpCanvas, -4.5 * scale, 4.5 * scale, w, h);
        targetCtx.restore();
      }

      // 3B. Spatial Near-Object Defocus (Live Camera Depth of Field):
      // When a near object (stapler, sticky note, phone, jar, held item) is placed in the near field (<45 cm),
      // the blur focuses SPECIFICALLY on the near object while the person sitting farther back remains 100% IN FOCUS!
      // - Monofocal: Person & room stay CLEAR (0px); the near object in foreground is BLURRED (~15.5px)!
      // - RayOne EMV: Person & room stay CLEAR (0px); the near object has gentle soft focus (~4.8px).
      // - Trifocal: Person & near object are BOTH in focus (0px with diffractive rings).
      // - RayOne Galaxy: Person & near object are BOTH crystal-sharp (0px with 100% contrast).
      const approachBlurPx = (meta.getLiveApproachBlur ? meta.getLiveApproachBlur(liveProximity) : 0) * scale;
      if (approachBlurPx > farBlurPx + 0.35) {
        sizeCanvas(nearZoneCanvas, w, h);
        nearZoneCtx.clearRect(0, 0, w, h);
        nearZoneCtx.save();
        const nzFilters = ['blur(' + approachBlurPx.toFixed(1) + 'px)'];
        if (colorFilter) nzFilters.push(colorFilter);
        nearZoneCtx.filter = nzFilters.join(' ');
        nearZoneCtx.drawImage(srcCanvas, 0, 0, w, h);
        nearZoneCtx.restore();

        // Build Near-Object Depth Mask:
        sizeCanvas(fgMaskCanvas, w, h);
        fgMaskCtx.clearRect(0, 0, w, h);

        if (distanceMode !== 'auto') {
          // Manual distance mode (e.g. Closer 35cm clicked): applies near reading focus
          const manualGrad = fgMaskCtx.createLinearGradient(0, h * 0.35, 0, h * 0.85);
          manualGrad.addColorStop(0, 'rgba(0,0,0,0)');
          manualGrad.addColorStop(1, 'rgba(0,0,0,1)');
          fgMaskCtx.fillStyle = manualGrad;
          fgMaskCtx.fillRect(0, 0, w, h);
        } else {
          // Auto Live Mode: blur ONLY the pixels belonging to the near object/person.
          // Far parts of the scene (and you, when seated far back) stay sharp.
          fgMaskCtx.save();
          fgMaskCtx.imageSmoothingEnabled = true;
          fgMaskCtx.filter = 'blur(' + Math.max(4, 10 * scale).toFixed(1) + 'px)';
          for (let k = 0; k < 4; k++) fgMaskCtx.drawImage(fgSmallCanvas, 0, 0, w, h);
          fgMaskCtx.restore();
          const zoneStrength = Math.min(1, liveProximity * 1.8) * (selectionKey === 'emv' ? 0.6 : 1);
          const zg = fgMaskCtx.createLinearGradient(0, h * 0.28, 0, h * 0.58);
          zg.addColorStop(0, 'rgba(0,0,0,0)');
          zg.addColorStop(1, 'rgba(0,0,0,' + zoneStrength.toFixed(2) + ')');
          fgMaskCtx.fillStyle = zg;
          fgMaskCtx.fillRect(0, 0, w, h);

          // Far zone (upper part of the view, ~4 ft and beyond): always CLEAR, even if something there changed
          fgMaskCtx.save();
          fgMaskCtx.globalCompositeOperation = 'destination-out';
          const fz = fgMaskCtx.createLinearGradient(0, h * 0.10, 0, h * 0.36);
          fz.addColorStop(0, 'rgba(0,0,0,1)');
          fz.addColorStop(1, 'rgba(0,0,0,0)');
          fgMaskCtx.fillStyle = fz;
          fgMaskCtx.fillRect(0, 0, w, h * 0.36);
          fgMaskCtx.restore();
        }

        // Apply near-object mask to the blurred layer
        nearZoneCtx.save();
        nearZoneCtx.globalCompositeOperation = 'destination-in';
        nearZoneCtx.drawImage(fgMaskCanvas, 0, 0, w, h);
        nearZoneCtx.restore();

        // Draw blurred near object directly over the sharp distance scene!
        targetCtx.drawImage(nearZoneCanvas, 0, 0, w, h);
      }

      // 4. Real-Time Camera Light-Source Halo Bloom & Cataract Glare
      // Photopic Daytime naturally suppresses light halos due to pupil constriction (~2mm); Night dilates pupils (~5mm), maximizing diffractive light scatter
      if (!isCondition && (selectionKey === 'monofocal' || selectionKey === 'emv')) {
        if (isNight) {
          if (activeCondition === 'cataracts-astig') {
            applyDetectedLightHalo(targetCtx, srcCanvas, w, h, scale, 0.90, 1.0, 1.0);
          } else if (activeCondition === 'presbyopia-astig' || activeCondition === 'astigmatism') {
            applyDetectedLightHalo(targetCtx, srcCanvas, w, h, scale, 0.65, 0.8, 0.90);
          }
        }
      } else if (!isCondition && meta.hasTrifocalHalos) {
        // Diffractive Trifocal: prominent halo at night, subtle in daytime due to photopic pupil constriction
        targetCtx.save();
        targetCtx.fillStyle = isNight
          ? 'rgba(205, 198, 186, 0.13)'
          : (isReading ? 'rgba(225, 218, 205, 0.08)' : 'rgba(235, 230, 222, 0.04)');
        targetCtx.fillRect(0, 0, w, h);
        targetCtx.restore();
        const trifocalHaloStrength = isNight ? 1.45 : (isReading ? 0.65 : 0.40);
        applyDetectedLightHalo(targetCtx, srcCanvas, w, h, scale, trifocalHaloStrength, 1.0, isNight ? 1.25 : 0.85);
      } else if (!isCondition && meta.hasGalaxySubtleHalo) {
        // RayOne Galaxy (Spiral Optic): clean halo-free vision with subtle natural point-light bloom at night
        if (isNight) {
          applyDetectedLightHalo(targetCtx, srcCanvas, w, h, scale, 0.26, 0.70, 0.42);
        }
      } else if (isCondition && meta.hasCataractGlare) {
        // Cataracts: Diffuse forward light scatter and milky sandy-amber veil
        const catHaloStrength = isNight ? 1.15 : (isReading ? 0.85 : 0.95);
        applyDetectedLightHalo(targetCtx, srcCanvas, w, h, scale, catHaloStrength, 1.25, 1.05);
        targetCtx.save();
        if (isNight) {
          targetCtx.fillStyle = 'rgba(192, 154, 82, 0.25)';
        } else if (isReading) {
          targetCtx.fillStyle = 'rgba(198, 160, 90, 0.24)';
        } else {
          // Daytime: sunlight scatter veil
          targetCtx.fillStyle = 'rgba(215, 185, 120, 0.20)';
        }
        targetCtx.fillRect(0, 0, w, h);
        targetCtx.restore();
      } else if (isCondition && meta.hasAstig) {
        if (isNight) {
          applyDetectedLightHalo(targetCtx, srcCanvas, w, h, scale, 0.55, 0.85, 0.75);
        }
      }

      // 5. 100% Live Camera Optical Eye:
      // The artificial white cardboard test card is REMOVED completely!
      // The user views their real room and real reading material (real book, phone, or paper with text).
      // When holding text at reading distance (~35 cm):
      // - Monofocal & Presbyopia: Near text is heavily blurred (reading glasses required).
      // - RayOne EMV: Intermediate is functional, near text is soft.
      // - Trifocal: Real text is sharp & readable (glasses-free) with soft diffractive contrast.
      // - RayOne Galaxy: Real text is crystal-sharp & readable with 100% contrast!
    };

    let vsimVisible = true;
    let vsimDocVisible = !document.hidden;
    let vsimRafId = 0;

    const syncVsimLoop = () => {
      if (vsimVisible && vsimDocVisible) {
        if (!vsimRafId) vsimRafId = requestAnimationFrame(renderLoop);
      } else if (vsimRafId) {
        cancelAnimationFrame(vsimRafId);
        vsimRafId = 0;
      }
    };

    const renderLoop = () => {
      vsimRafId = 0;
      if (!vsimVisible || !vsimDocVisible) return;
      frameCounter++;
      if (true) {
        analyzeLiveCameraDepth();
      }
      liveProximity += (targetProximity - liveProximity) * (targetProximity > liveProximity ? 0.65 : 0.28);
      if (frameCounter % 4 === 0) {
        updateDistanceBadgeUI();
      }

      renderPanelOptics(ctxLeft, vsimCanvasLeft.width, vsimCanvasLeft.height, activeLens);
      if (isCompareOn && vsimCanvasRight.width && vsimCanvasRight.height) {
        renderPanelOptics(ctxRight, vsimCanvasRight.width, vsimCanvasRight.height, compareTarget);
      }
      if (vsimVisible && vsimDocVisible) vsimRafId = requestAnimationFrame(renderLoop);
    };

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          vsimVisible = entry.isIntersecting;
          if (entry.isIntersecting) {
            resizeCanvases();
            tryAutoCamera();
          }
        });
        syncVsimLoop();
      },
      { threshold: 0.08 }
    );
    obs.observe(vsimStage);
    document.addEventListener('visibilitychange', () => {
      vsimDocVisible = !document.hidden;
      syncVsimLoop();
    });

    syncUI();
    syncVsimLoop();
  }

  // 12. 21st.dev InfoCard Rotating Conic Border + True 3D Pop-Out & Interactive 360° 3D Spin Mode
  const infoCards = document.querySelectorAll('.info-card-shell');
  infoCards.forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const nx = x / (rect.width / 2);  // -1 to +1
      const ny = y / (rect.height / 2); // -1 to +1
      const angle = Math.atan2(y, x);
      card.style.setProperty('--rotation', `${angle}rad`);
      card.style.setProperty('--rx', `${(-ny * 6.5).toFixed(2)}deg`);
      card.style.setProperty('--ry', `${(nx * 8.5).toFixed(2)}deg`);
      card.style.setProperty('--sx', `${(nx * 14).toFixed(1)}px`);
      card.style.setProperty('--sy', `${(14 + ny * 8).toFixed(1)}px`);
    });
    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--rotation', '0deg');
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
      card.style.setProperty('--sx', '0px');
      card.style.setProperty('--sy', '14px');
    });
  });

  // Interactive WebGL Three.js 3D Product Modelling Engine ("3D Spin" button)
  const active3DControllers = new Map();
  let sharedStudioEnvMap = null;

  const getStudioEnvMap = (THREE) => {
    if (sharedStudioEnvMap) return sharedStudioEnvMap;
    const envCanvas = document.createElement('canvas');
    envCanvas.width = 512;
    envCanvas.height = 256;
    const ectx = envCanvas.getContext('2d');
    const bg = ectx.createLinearGradient(0, 0, 0, 256);
    bg.addColorStop(0, '#ffffff');
    bg.addColorStop(0.45, '#eef5fc');
    bg.addColorStop(0.55, '#cfe2f7');
    bg.addColorStop(1, '#0a1d40');
    ectx.fillStyle = bg;
    ectx.fillRect(0, 0, 512, 256);
    // Softbox studio highlights for crisp acrylic/glass & metallic speculars
    ectx.fillStyle = '#ffffff';
    ectx.fillRect(40, 18, 170, 50);
    ectx.fillRect(290, 24, 180, 44);
    ectx.fillStyle = '#3aa0db';
    ectx.fillRect(90, 110, 120, 24);
    const tex = new THREE.CanvasTexture(envCanvas);
    tex.mapping = THREE.EquirectangularReflectionMapping;
    sharedStudioEnvMap = tex;
    return tex;
  };

  // Helper: Create a realistic 3D RayOne Single-Piece Closed-Loop Acrylic IOL Mesh
  const buildRayOneIOLMesh = (THREE, envMap, variant = 'galaxy', tintHex = 0xdff2ff) => {
    const group = new THREE.Group();

    const acrylicMat = new THREE.MeshPhysicalMaterial({
      color: tintHex,
      roughness: 0.04,
      metalness: 0.02,
      transmission: 0.92,
      ior: 1.46,
      transparent: true,
      opacity: 0.94,
      reflectivity: 0.98,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
      envMap,
      envMapIntensity: 1.85,
      side: THREE.DoubleSide
    });

    const edgeRimMat = new THREE.MeshPhysicalMaterial({
      color: 0x8fcbf0,
      roughness: 0.14,
      metalness: 0.12,
      transparent: true,
      opacity: 0.62,
      clearcoat: 1.0,
      envMap,
      envMapIntensity: 1.4
    });

    // 1. Central Biconvex Optic (LatheGeometry with 360° Square Edge)
    const pts = [];
    const steps = 28;
    const radius = 1.38;
    for (let i = 0; i <= steps; i++) {
      const r = (i / steps) * radius;
      const yTop = 0.09 + Math.cos((r / radius) * Math.PI * 0.5) * 0.22;
      pts.push(new THREE.Vector2(r, yTop));
    }
    pts.push(new THREE.Vector2(radius, -0.09));
    for (let i = steps; i >= 0; i--) {
      const r = (i / steps) * radius;
      const yBot = -0.09 - Math.cos((r / radius) * Math.PI * 0.5) * 0.22;
      pts.push(new THREE.Vector2(r, yBot));
    }
    const opticGeo = new THREE.LatheGeometry(pts, 64);
    opticGeo.rotateX(Math.PI * 0.5);
    const opticMesh = new THREE.Mesh(opticGeo, acrylicMat);
    group.add(opticMesh);

    // 360° Square Edge Frosted Rim
    const rimGeo = new THREE.CylinderGeometry(radius, radius, 0.18, 64, 1, true);
    rimGeo.rotateX(Math.PI * 0.5);
    group.add(new THREE.Mesh(rimGeo, edgeRimMat));

    // 2. Sculpted Closed-Loop Lock & Roll™ Haptics (Top & Bottom Symmetric Loops with Cutout Window)
    const buildClosedHaptic = (mirrorSign) => {
      const shape = new THREE.Shape();
      shape.moveTo(0.45 * mirrorSign, 1.15 * mirrorSign);
      shape.bezierCurveTo(
        1.15 * mirrorSign, 1.85 * mirrorSign,
        0.95 * mirrorSign, 2.75 * mirrorSign,
        -0.35 * mirrorSign, 2.65 * mirrorSign
      );
      shape.bezierCurveTo(
        -1.25 * mirrorSign, 2.55 * mirrorSign,
        -1.45 * mirrorSign, 1.65 * mirrorSign,
        -0.72 * mirrorSign, 1.05 * mirrorSign
      );
      shape.lineTo(-0.42 * mirrorSign, 1.22 * mirrorSign);
      shape.bezierCurveTo(
        -1.02 * mirrorSign, 1.68 * mirrorSign,
        -0.88 * mirrorSign, 2.28 * mirrorSign,
        -0.25 * mirrorSign, 2.34 * mirrorSign
      );
      shape.bezierCurveTo(
        0.58 * mirrorSign, 2.40 * mirrorSign,
        0.74 * mirrorSign, 1.82 * mirrorSign,
        0.18 * mirrorSign, 1.28 * mirrorSign
      );
      shape.closePath();

      const extrudeGeo = new THREE.ExtrudeGeometry(shape, {
        depth: 0.13,
        bevelEnabled: true,
        bevelThickness: 0.035,
        bevelSize: 0.03,
        bevelSegments: 4,
        curveSegments: 32
      });
      extrudeGeo.translate(0, 0, -0.065);
      return new THREE.Mesh(extrudeGeo, acrylicMat);
    };

    group.add(buildClosedHaptic(1));
    group.add(buildClosedHaptic(-1));

    // 3. Optic Surface Micro-Sculpture per Product Family
    if (variant === 'galaxy') {
      // Continuous 3D Spiral Relief on Front Optic Dome
      const spiralPts = [];
      const totalPts = 180;
      for (let i = 0; i <= totalPts; i++) {
        const t = i / totalPts;
        const ang = t * Math.PI * 9;
        const r = 0.12 + t * (radius * 0.88);
        const z = 0.1 + Math.cos((r / radius) * Math.PI * 0.5) * 0.225;
        spiralPts.push(new THREE.Vector3(Math.cos(ang) * r, Math.sin(ang) * r, z));
      }
      const curve = new THREE.CatmullRomCurve3(spiralPts);
      const tubeGeo = new THREE.TubeGeometry(curve, 160, 0.016, 8, false);
      const spiralMat = new THREE.MeshPhysicalMaterial({
        color: 0x3aa0db,
        roughness: 0.15,
        metalness: 0.1,
        transparent: true,
        opacity: 0.78,
        envMap
      });
      group.add(new THREE.Mesh(tubeGeo, spiralMat));
    } else if (variant === 'emv') {
      // Positive Spherical Aberration Hyper-Dome + Toric Axis Marks
      const domeGeo = new THREE.SphereGeometry(0.68, 36, 24, 0, Math.PI * 2, 0, Math.PI * 0.36);
      domeGeo.rotateX(Math.PI * 0.5);
      domeGeo.translate(0, 0, -0.26);
      const domeMat = new THREE.MeshPhysicalMaterial({
        color: 0xffb8dc,
        roughness: 0.06,
        transmission: 0.75,
        transparent: true,
        opacity: 0.65,
        clearcoat: 1,
        envMap
      });
      group.add(new THREE.Mesh(domeGeo, domeMat));

      // Toric Axis Marks (3D engraved ticks at 90°/270°)
      const markMat = new THREE.MeshBasicMaterial({ color: 0xc4006b });
      for (const s of [-1, 1]) {
        const markGeo = new THREE.BoxGeometry(0.06, 0.26, 0.03);
        markGeo.translate(0, s * 1.12, 0.16);
        group.add(new THREE.Mesh(markGeo, markMat));
      }
    } else if (variant === 'trifocal') {
      // 16-Step Concentric 3D Diffractive Rings on Optic Dome
      const ringMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        roughness: 0.12,
        transparent: true,
        opacity: 0.68,
        envMap
      });
      for (let k = 1; k <= 12; k++) {
        const r = (k / 13) * (radius * 0.88);
        const z = 0.095 + Math.cos((r / radius) * Math.PI * 0.5) * 0.22;
        const torusGeo = new THREE.TorusGeometry(r, 0.011, 10, 56);
        const torus = new THREE.Mesh(torusGeo, ringMat);
        torus.position.z = z;
        group.add(torus);
      }
    }

    return group;
  };

  // Helper: Draw a 2x Retina procedural label texture for 3D Packaging / Screens
  const makeLabelTexture = (THREE, drawFn, w = 512, h = 256) => {
    const scale = 2;
    const c = document.createElement('canvas');
    c.width = w * scale;
    c.height = h * scale;
    const ctx = c.getContext('2d');
    ctx.scale(scale, scale);
    drawFn(ctx, w, h);
    const tex = new THREE.CanvasTexture(c);
    tex.anisotropy = 16;
    return tex;
  };

  const init3DProductCanvas = (card, modelType) => {
    const canvas = card.querySelector('.product-3d-canvas');
    const img = card.querySelector('.product-3d-img');
    const btn = card.querySelector('.product-3d-btn span');
    if (!canvas) return;

    if (active3DControllers.has(card)) {
      const ctrl = active3DControllers.get(card);
      ctrl.stop();
      active3DControllers.delete(card);
      canvas.classList.add('hidden');
      if (img) img.classList.remove('opacity-0', 'pointer-events-none');
      if (btn) btn.textContent = '3D Spin';
      return;
    }

    const THREE = window.THREE;
    if (!THREE) return;

    canvas.classList.remove('hidden');
    if (img) img.classList.add('opacity-0', 'pointer-events-none');
    if (btn) btn.textContent = 'Exit 3D';

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    const scene = new THREE.Scene();
    const envMap = getStudioEnvMap(THREE);
    scene.environment = envMap;

    const camera = new THREE.PerspectiveCamera(36, 1.8, 0.1, 100);
    camera.position.set(0, 0.35, 8.2);

    // Studio 3-Point Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.85));
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.45);
    keyLight.position.set(5, 7, 6);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x3aa0db, 1.1);
    rimLight.position.set(-6, 4, -5);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0xf6f2ea, 0.7);
    fillLight.position.set(0, -5, 4);
    scene.add(fillLight);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // Build Authentic 3D Model Scene per Product
    if (modelType === 'galaxy') {
      // 1. 3D Navy Galaxy Carton Box on Left + 3D White Toric Box + 3D Sculpted Galaxy Spiral IOL on Right
      const navyFrontTex = makeLabelTexture(THREE, (ctx, w, h) => {
        ctx.fillStyle = '#0c1c30';
        ctx.fillRect(0, 0, w, h);
        // Cyan spiral arcs
        for (let i = 0; i < 4; i++) {
          ctx.beginPath();
          ctx.arc(w * 0.72, h * 0.25, 42 + i * 22, 0, Math.PI * 1.65);
          ctx.strokeStyle = i % 2 === 0 ? '#3aa0db' : '#1b5d8c';
          ctx.lineWidth = 6;
          ctx.stroke();
        }
        ctx.fillStyle = '#ffffff';
        ctx.font = '700 44px "Futura", "Futura PT", "Futura Medium", "Jost", "Century Gothic", ui-sans-serif, system-ui, sans-serif';
        ctx.fillText('GALAXY', 38, 105);
        ctx.fillStyle = '#9ec5e6';
        ctx.font = '600 16px "Futura", "Futura PT", "Futura Medium", "Jost", "Century Gothic", ui-sans-serif, system-ui, sans-serif';
        ctx.fillText('RAYONE PRELOADED SPIRAL IOL', 38, 185);
        ctx.fillStyle = '#ffffff';
        ctx.font = '700 22px "Futura", "Futura PT", "Futura Medium", "Jost", "Century Gothic", ui-sans-serif, system-ui, sans-serif';
        ctx.fillText('▲ Rayner', 330, 195);
      });
      const navySideMat = new THREE.MeshStandardMaterial({ color: 0x0c1c30, roughness: 0.35, metalness: 0.1 });
      const navyFrontMat = new THREE.MeshStandardMaterial({ map: navyFrontTex, roughness: 0.3, metalness: 0.08 });
      const box1 = new THREE.Mesh(
        new THREE.BoxGeometry(3.1, 1.55, 0.85),
        [navySideMat, navySideMat, navySideMat, navySideMat, navyFrontMat, navySideMat]
      );
      box1.position.set(-1.15, 0.22, -0.35);
      box1.rotation.y = 0.28;
      rootGroup.add(box1);

      // White Galaxy Toric 3D Box in Foreground
      const whiteTopTex = makeLabelTexture(THREE, (ctx, w, h) => {
        ctx.fillStyle = '#eaedf2';
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = '#0c1c30';
        ctx.font = '700 38px "Futura", "Futura PT", "Futura Medium", "Jost", "Century Gothic", ui-sans-serif, system-ui, sans-serif';
        ctx.fillText('GALAXY TORIC', 36, 95);
        ctx.fillStyle = '#5c6675';
        ctx.font = '600 15px "Futura", "Futura PT", "Futura Medium", "Jost", "Century Gothic", ui-sans-serif, system-ui, sans-serif';
        ctx.fillText('PRELOADED SPIRAL TORIC IOL', 36, 145);
        ctx.fillStyle = '#0c1c30';
        ctx.font = '700 22px "Futura", "Futura PT", "Futura Medium", "Jost", "Century Gothic", ui-sans-serif, system-ui, sans-serif';
        ctx.fillText('▲ Rayner', 340, 200);
      });
      const whiteSideMat = new THREE.MeshStandardMaterial({ color: 0xdce1e8, roughness: 0.35 });
      const whiteTopMat = new THREE.MeshStandardMaterial({ map: whiteTopTex, roughness: 0.3 });
      const box2 = new THREE.Mesh(
        new THREE.BoxGeometry(2.85, 0.58, 1.45),
        [whiteSideMat, whiteSideMat, whiteTopMat, whiteSideMat, whiteSideMat, whiteSideMat]
      );
      box2.position.set(-0.3, -0.68, 0.65);
      box2.rotation.y = -0.22;
      rootGroup.add(box2);

      // Floating 3D Sculpted Galaxy Spiral IOL
      const iol = buildRayOneIOLMesh(THREE, envMap, 'galaxy', 0xdaf0ff);
      iol.scale.setScalar(0.66);
      iol.position.set(1.95, 0.15, 0.45);
      iol.rotation.set(-0.15, -0.35, 0.25);
      rootGroup.add(iol);
    } else if (modelType === 'emv') {
      // 1. 3D RayOne EMV Toric Preloaded Carton + 2. 3D Lock & Roll Injector Syringe + 3. 3D EMV IOL
      const emvFrontTex = makeLabelTexture(THREE, (ctx, w, h) => {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = '#e8562a';
        ctx.fillRect(28, 28, 456, 56);
        ctx.fillStyle = '#ffffff';
        ctx.font = '700 34px "Futura", "Futura PT", "Futura Medium", "Jost", "Century Gothic", ui-sans-serif, system-ui, sans-serif';
        ctx.fillText('RayOne  Preloaded IOL', 44, 68);
        ctx.fillStyle = '#c4006b';
        ctx.fillRect(28, 92, 180, 26);
        ctx.fillStyle = '#ffffff';
        ctx.font = '700 16px "Futura", "Futura PT", "Futura Medium", "Jost", "Century Gothic", ui-sans-serif, system-ui, sans-serif';
        ctx.fillText('EMV TORIC', 58, 110);
        // C-Ring graphic
        ctx.beginPath();
        ctx.arc(380, 175, 48, 0.3, Math.PI * 1.85);
        ctx.strokeStyle = '#e8562a';
        ctx.lineWidth = 14;
        ctx.stroke();
        ctx.fillStyle = '#0a1d40';
        ctx.font = '700 22px "Futura", "Futura PT", "Futura Medium", "Jost", "Century Gothic", ui-sans-serif, system-ui, sans-serif';
        ctx.fillText('▲ Rayner', 32, 215);
      });
      const whiteMat = new THREE.MeshStandardMaterial({ color: 0xf4f6f9, roughness: 0.3 });
      const orangeSideMat = new THREE.MeshStandardMaterial({ color: 0xe8562a, roughness: 0.35 });
      const emvFrontMat = new THREE.MeshStandardMaterial({ map: emvFrontTex, roughness: 0.28 });
      const emvBox = new THREE.Mesh(
        new THREE.BoxGeometry(3.0, 1.65, 0.82),
        [orangeSideMat, whiteMat, whiteMat, whiteMat, emvFrontMat, whiteMat]
      );
      emvBox.position.set(0.65, 0.25, -0.35);
      emvBox.rotation.y = -0.28;
      rootGroup.add(emvBox);

      // 3D Lock & Roll™ Translucent Injector Syringe in Foreground
      const syringeGroup = new THREE.Group();
      const clearPlastic = new THREE.MeshPhysicalMaterial({
        color: 0xeef7ff,
        roughness: 0.12,
        transmission: 0.68,
        transparent: true,
        opacity: 0.82,
        clearcoat: 1,
        envMap
      });
      const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 2.2, 28), clearPlastic);
      barrel.rotation.z = Math.PI * 0.5;
      syringeGroup.add(barrel);
      const nozzle = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.15, 0.85, 24), clearPlastic);
      nozzle.rotation.z = Math.PI * 0.5;
      nozzle.position.x = -1.5;
      syringeGroup.add(nozzle);
      const flange = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.06, 28), clearPlastic);
      flange.rotation.z = Math.PI * 0.5;
      flange.position.x = 0.85;
      syringeGroup.add(flange);
      const plunger = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.08, 1.8, 20),
        new THREE.MeshStandardMaterial({ color: 0xdbe4ef, roughness: 0.25 })
      );
      plunger.rotation.z = Math.PI * 0.5;
      plunger.position.x = 1.45;
      syringeGroup.add(plunger);
      const wing = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.58, 0.08), clearPlastic);
      wing.position.set(-0.85, 0.15, 0);
      syringeGroup.add(wing);

      syringeGroup.position.set(-0.85, -0.68, 0.8);
      syringeGroup.rotation.set(0.15, 0.32, 0.08);
      rootGroup.add(syringeGroup);

      // Floating 3D EMV Toric IOL on Left
      const emvIol = buildRayOneIOLMesh(THREE, envMap, 'emv', 0xffeaf4);
      emvIol.scale.setScalar(0.58);
      emvIol.position.set(-1.95, 0.32, 0.25);
      emvIol.rotation.set(0.12, 0.35, -0.2);
      rootGroup.add(emvIol);
    } else if (modelType === 'trifocal') {
      // 3D Sculpted Trio of Trifocal & Sulcoflex IOLs (Matching trifocal.jpg in full 3D!)
      const iol1 = buildRayOneIOLMesh(THREE, envMap, 'trifocal', 0xdff4ff);
      iol1.scale.setScalar(0.68);
      iol1.position.set(-1.45, -0.05, 0.45);
      iol1.rotation.set(0.08, 0.38, -0.18);
      rootGroup.add(iol1);

      const iol2 = buildRayOneIOLMesh(THREE, envMap, 'trifocal', 0xd0eeff);
      iol2.scale.setScalar(0.68);
      iol2.position.set(0.05, 0.02, 0.0);
      iol2.rotation.set(0.08, 0.38, -0.18);
      rootGroup.add(iol2);

      const iol3 = buildRayOneIOLMesh(THREE, envMap, 'trifocal', 0xe8f6ff);
      iol3.scale.setScalar(0.66);
      iol3.position.set(1.5, 0.08, -0.45);
      iol3.rotation.set(0.08, 0.38, -0.18);
      rootGroup.add(iol3);
    } else if (modelType === 'aeon') {
      // 3D Modelled AEON Preservative-Free OSD Dropper Bottles & Cartons Suite
      const configs = [
        { x: -1.9, color: 0x0d8a6a, cap: 0x2299dd, name: 'PROTECT' },
        { x: -0.65, color: 0xeab308, cap: 0x6ea8fe, name: 'PROTECT+' },
        { x: 0.65, color: 0x7e22ce, cap: 0x6ea8fe, name: 'REPAIR' },
        { x: 1.9, color: 0x2563eb, cap: 0x6ea8fe, name: 'NaCl 5%' }
      ];
      configs.forEach((cfg) => {
        const unit = new THREE.Group();
        // 3D Carton Box behind bottle
        const cartonTex = makeLabelTexture(THREE, (ctx, w, h) => {
          ctx.fillStyle = `#${cfg.color.toString(16).padStart(6, '0')}`;
          ctx.fillRect(0, 0, w, h);
          ctx.fillStyle = '#ffffff';
          ctx.font = '700 54px "Futura", "Futura PT", "Futura Medium", "Jost", "Century Gothic", ui-sans-serif, system-ui, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('AEON', w / 2, 75);
          ctx.font = '700 26px "Futura", "Futura PT", "Futura Medium", "Jost", "Century Gothic", ui-sans-serif, system-ui, sans-serif';
          ctx.fillText(cfg.name, w / 2, 112);
          // White teardrop icon
          ctx.beginPath();
          ctx.moveTo(w / 2, 130);
          ctx.quadraticCurveTo(w / 2 + 42, 195, w / 2, 220);
          ctx.quadraticCurveTo(w / 2 - 42, 195, w / 2, 130);
          ctx.fill();
        }, 256, 256);
        const boxMat = new THREE.MeshStandardMaterial({ map: cartonTex, roughness: 0.32 });
        const sideMat = new THREE.MeshStandardMaterial({ color: cfg.color, roughness: 0.4 });
        const carton = new THREE.Mesh(
          new THREE.BoxGeometry(0.92, 2.25, 0.68),
          [sideMat, sideMat, sideMat, sideMat, boxMat, sideMat]
        );
        carton.position.set(0.18, 0.08, -0.35);
        unit.add(carton);

        // 3D Lathe Contoured OSD Dropper Bottle in front
        const bodyMat = new THREE.MeshPhysicalMaterial({
          color: 0xffffff,
          roughness: 0.15,
          clearcoat: 0.9,
          envMap
        });
        const labelMat = new THREE.MeshStandardMaterial({ color: cfg.color, roughness: 0.28 });
        const capMat = new THREE.MeshStandardMaterial({ color: cfg.cap, roughness: 0.25 });

        const baseCyl = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 1.05, 32), bodyMat);
        baseCyl.position.set(-0.22, -0.48, 0.35);
        unit.add(baseCyl);

        const labelCyl = new THREE.Mesh(new THREE.CylinderGeometry(0.326, 0.326, 0.68, 32), labelMat);
        labelCyl.position.set(-0.22, -0.48, 0.35);
        unit.add(labelCyl);

        // Ribbed OSD Preservative-Free Cap
        const capCyl = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.28, 0.65, 32), capMat);
        capCyl.position.set(-0.22, 0.38, 0.35);
        unit.add(capCyl);

        const tipCyl = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.16, 0.25, 24), capMat);
        tipCyl.position.set(-0.22, 0.82, 0.35);
        unit.add(tipCyl);

        unit.position.x = cfg.x;
        rootGroup.add(unit);
      });
      rootGroup.scale.setScalar(0.88);
    } else {
      // 3D Modelled RayPRO Unibody Laptop + Floating 3D Outcome Gauges
      const aluminumMat = new THREE.MeshStandardMaterial({
        color: 0xdde3ec,
        roughness: 0.22,
        metalness: 0.78,
        envMap
      });
      const darkBezelMat = new THREE.MeshStandardMaterial({ color: 0x0b1526, roughness: 0.25 });

      const screenTex = makeLabelTexture(THREE, (ctx, w, h) => {
        ctx.fillStyle = '#081b36';
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, w, 28);
        ctx.fillStyle = '#0a1d40';
        ctx.font = '700 18px "Futura", "Futura PT", "Futura Medium", "Jost", "Century Gothic", ui-sans-serif, system-ui, sans-serif';
        ctx.fillText('RayPRO® Cloud PROMs Dashboard', 20, 20);
        const cards = [
          { x: 24, y: 52, val: '85%', col: '#3aa0db' },
          { x: 144, y: 52, val: '100%', col: '#c4006b' },
          { x: 264, y: 52, val: '94%', col: '#3aa0db' },
          { x: 384, y: 52, val: '0%', col: '#e8562a' }
        ];
        cards.forEach((c) => {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(c.x, c.y, 104, 155);
          ctx.beginPath();
          ctx.arc(c.x + 52, c.y + 72, 34, 0, Math.PI * 2);
          ctx.strokeStyle = c.col;
          ctx.lineWidth = 7;
          ctx.stroke();
          ctx.fillStyle = '#0a1d40';
          ctx.font = '700 22px "Futura", "Futura PT", "Futura Medium", "Jost", "Century Gothic", ui-sans-serif, system-ui, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(c.val, c.x + 52, c.y + 80);
        });
      });

      // Laptop Base & Keyboard Deck
      const baseMesh = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.14, 2.5), aluminumMat);
      baseMesh.position.set(0, -0.95, 0.35);
      rootGroup.add(baseMesh);

      const kbMesh = new THREE.Mesh(
        new THREE.BoxGeometry(3.2, 0.03, 1.35),
        new THREE.MeshStandardMaterial({ color: 0x182232, roughness: 0.5 })
      );
      kbMesh.position.set(0, -0.87, 0.08);
      rootGroup.add(kbMesh);

      // Laptop Display Lid
      const lidGroup = new THREE.Group();
      lidGroup.position.set(0, -0.88, -0.85);
      lidGroup.rotation.x = -0.18;

      const lidBack = new THREE.Mesh(new THREE.BoxGeometry(3.8, 2.35, 0.1), aluminumMat);
      lidBack.position.set(0, 1.18, 0);
      lidGroup.add(lidBack);

      const screenPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(3.55, 2.1),
        new THREE.MeshBasicMaterial({ map: screenTex })
      );
      screenPlane.position.set(0, 1.18, 0.056);
      lidGroup.add(screenPlane);

      // 3D Floating Holographic Ring Pop-Outs in front of screen
      [
        { x: -1.1, col: 0x3aa0db },
        { x: 0, col: 0xc4006b },
        { x: 1.1, col: 0xe8562a }
      ].forEach((r) => {
        const ring = new THREE.Mesh(
          new THREE.TorusGeometry(0.32, 0.045, 16, 48),
          new THREE.MeshStandardMaterial({ color: r.col, roughness: 0.2, metalness: 0.3 })
        );
        ring.position.set(r.x, 1.18, 0.28);
        lidGroup.add(ring);
      });

      rootGroup.add(lidGroup);
    }

    // Drag-to-Rotate + Pinch/Wheel Zoom Interaction
    let rafId = 0;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let targetRotY = 0.35;
    let targetRotX = 0.12;

    const onDown = (e) => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      canvas.setPointerCapture?.(e.pointerId);
    };
    const onMove = (e) => {
      if (!dragging) return;
      targetRotY += (e.clientX - lastX) * 0.014;
      targetRotX = Math.max(-0.95, Math.min(0.95, targetRotX + (e.clientY - lastY) * 0.014));
      lastX = e.clientX;
      lastY = e.clientY;
    };
    const onUp = () => {
      dragging = false;
    };

    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);

    const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    renderer.setPixelRatio(dpr);

    let isVisible = true;
    let docVisible = !document.hidden;
    let stopped = false;

    const shouldRender = () => !stopped && isVisible && docVisible;
    const kickLoop = () => {
      if (shouldRender() && !rafId) {
        rafId = requestAnimationFrame(renderLoop);
      } else if (!shouldRender() && rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
    };

    const renderLoop = () => {
      rafId = 0;
      if (!shouldRender()) return;
      const rect = canvas.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        const targetW = Math.round(rect.width * dpr);
        const targetH = Math.round(rect.height * dpr);
        if (canvas.width !== targetW || canvas.height !== targetH) {
          renderer.setSize(rect.width, rect.height, false);
        }
        camera.aspect = rect.width / rect.height;
        camera.updateProjectionMatrix();
      }

      if (!dragging) {
        targetRotY += 0.008;
      }
      rootGroup.rotation.y += (targetRotY - rootGroup.rotation.y) * 0.14;
      rootGroup.rotation.x += (targetRotX - rootGroup.rotation.x) * 0.14;

      renderer.render(scene, camera);
      if (shouldRender()) rafId = requestAnimationFrame(renderLoop);
    };

    let io = null;
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver((entries) => {
        isVisible = entries.some((en) => en.isIntersecting);
        kickLoop();
      }, { rootMargin: '80px 0px', threshold: 0.01 });
      io.observe(canvas);
    }
    const onVisChange = () => {
      docVisible = !document.hidden;
      kickLoop();
    };
    document.addEventListener('visibilitychange', onVisChange);

    kickLoop();

    active3DControllers.set(card, {
      stop: () => {
        stopped = true;
        cancelAnimationFrame(rafId);
        rafId = 0;
        if (io) io.disconnect();
        document.removeEventListener('visibilitychange', onVisChange);
        renderer.dispose();
        canvas.removeEventListener('pointerdown', onDown);
        canvas.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
      }
    });
  };

  document.querySelectorAll('[data-toggle-3d]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const modelType = btn.getAttribute('data-toggle-3d') || 'galaxy';
      const card = btn.closest('.product-card');
      if (card) init3DProductCanvas(card, modelType);
    });
  });

  // 13. 21st.dev Interactive 3D WebGL Optical Bench Simulator (Card 1 of Bento Grid)
  const initClinical3DBench = () => {
    const canvas = document.getElementById('clinical-bench-canvas');
    if (!canvas) return;
    const THREE = window.THREE;
    if (!THREE) {
      window.addEventListener('load', () => setTimeout(initClinical3DBench, 150));
      return;
    }

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;

    const scene = new THREE.Scene();
    const envMap = getStudioEnvMap(THREE);

    const camera = new THREE.PerspectiveCamera(38, (canvas.clientWidth || 600) / (canvas.clientHeight || 320), 0.1, 100);
    camera.position.set(0, 0.45, 6.2);

    scene.add(new THREE.AmbientLight(0xffffff, 0.95));
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.4);
    keyLight.position.set(4, 5, 4);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x3aa0db, 1.2);
    rimLight.position.set(-4, -2, -3);
    scene.add(rimLight);

    const accentLight = new THREE.DirectionalLight(0xc4006b, 0.85);
    accentLight.position.set(2, -4, 2);
    scene.add(accentLight);

    const stageGroup = new THREE.Group();
    scene.add(stageGroup);

    // Optical Ray Bundle Generator: Collimated Ingoing Rays -> Refracted Rays -> Focal Waist
    const createRayBundle = (accentHex, mode) => {
      const rayGroup = new THREE.Group();
      const numRays = 18;
      const rayMat = new THREE.MeshBasicMaterial({
        color: accentHex,
        transparent: true,
        opacity: 0.55,
        blending: THREE.AdditiveBlending
      });

      for (let i = 0; i < numRays; i++) {
        const angle = (i / numRays) * Math.PI * 2;
        const radius = (i % 2 === 0 ? 0.65 : 1.12);
        const inX = Math.cos(angle) * radius;
        const inY = Math.sin(angle) * radius;

        // Ingoing collimated light ray
        const inPoints = [
          new THREE.Vector3(inX, inY, -3.2),
          new THREE.Vector3(inX * 0.96, inY * 0.96, -0.05)
        ];
        const inCurve = new THREE.CatmullRomCurve3(inPoints);
        const inTube = new THREE.TubeGeometry(inCurve, 12, 0.007, 6, false);
        rayGroup.add(new THREE.Mesh(inTube, rayMat));

        // Refracted exiting light ray
        let focalZ = 2.45;
        let focalSpread = 0.02;
        if (mode === 'emv') {
          focalZ = 2.15 + (i % 4) * 0.32;
          focalSpread = 0.04;
        } else if (mode === 'galaxy') {
          focalZ = 1.95 + (i / numRays) * 1.05;
          focalSpread = 0.025;
        }

        const outPoints = [
          new THREE.Vector3(inX * 0.96, inY * 0.96, 0.05),
          new THREE.Vector3(Math.cos(angle) * focalSpread, Math.sin(angle) * focalSpread, focalZ),
          new THREE.Vector3(Math.cos(angle + Math.PI) * (radius * 0.4), Math.sin(angle + Math.PI) * (radius * 0.4), focalZ + 1.1)
        ];
        const outCurve = new THREE.CatmullRomCurve3(outPoints);
        const outTube = new THREE.TubeGeometry(outCurve, 20, 0.008, 6, false);
        rayGroup.add(new THREE.Mesh(outTube, rayMat));
      }

      // Crisp focal waist marker
      const focalGeo = new THREE.SphereGeometry(0.045, 16, 16);
      const focalMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending
      });
      const focalMesh = new THREE.Mesh(focalGeo, focalMat);
      focalMesh.position.set(0, 0, mode === 'emv' ? 2.3 : 2.2);
      rayGroup.add(focalMesh);

      return rayGroup;
    };

    let currentModelGroup = null;
    let currentRayBundle = null;

    const setMode = (mode) => {
      if (currentModelGroup) stageGroup.remove(currentModelGroup);
      if (currentRayBundle) stageGroup.remove(currentRayBundle);

      const modeLabel = document.getElementById('bench-mode-label');
      const paramLabel = document.getElementById('bench-param-label');

      if (mode === 'galaxy') {
        currentModelGroup = buildRayOneIOLMesh(THREE, envMap, 'galaxy', 0xeaf4ff);
        currentModelGroup.rotation.z = Math.PI * 0.5; // Natural horizontal anatomical orientation
        currentRayBundle = createRayBundle(0x3aa0db, 'galaxy');
        if (modeLabel) modeLabel.textContent = 'RayOne® Galaxy · AI Non-Diffractive Optic';
        if (paramLabel) paramLabel.textContent = 'Zero Light Loss · Continuous Focal Bridge · RI 1.46';
      } else if (mode === 'emv') {
        currentModelGroup = buildRayOneIOLMesh(THREE, envMap, 'emv', 0xffeef7);
        currentModelGroup.rotation.z = Math.PI * 0.5; // Natural horizontal anatomical orientation
        currentRayBundle = createRayBundle(0xff3b9a, 'emv');
        if (modeLabel) modeLabel.textContent = 'RayOne® EMV · Positive Spherical Aberration (+0.20 µm)';
        if (paramLabel) paramLabel.textContent = 'Extended Depth of Focus: +1.5 D · Dysphotopsia: 0.0%';
      } else {
        currentModelGroup = new THREE.Group();
        const iol = buildRayOneIOLMesh(THREE, envMap, 'trifocal', 0xeaf5ff);
        iol.rotation.z = Math.PI * 0.5;
        currentModelGroup.add(iol);

        const nozzleGeo = new THREE.CylinderGeometry(0.12, 0.42, 1.8, 32, 1, true);
        const nozzleMat = new THREE.MeshPhysicalMaterial({
          color: 0xe8562a,
          transparent: true,
          opacity: 0.35,
          roughness: 0.1,
          transmission: 0.8,
          side: THREE.DoubleSide
        });
        const nozzle = new THREE.Mesh(nozzleGeo, nozzleMat);
        nozzle.rotation.x = Math.PI / 2;
        nozzle.position.set(0, 0, -1.2);
        currentModelGroup.add(nozzle);

        currentRayBundle = createRayBundle(0xe8562a, 'avh');
        if (modeLabel) modeLabel.textContent = 'RayOne® Delivery · Patented Lock & Roll™ System';
        if (paramLabel) paramLabel.textContent = 'Nozzle: 1.65 mm · Sub-Incision: 2.2 mm · Toric Rotation: 1.83°';
      }

      stageGroup.add(currentModelGroup);
      stageGroup.add(currentRayBundle);
    };

    setMode('galaxy');

    const modeBtns = document.querySelectorAll('.bench-mode-btn');
    modeBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const mode = btn.getAttribute('data-bench-mode') || 'galaxy';
        modeBtns.forEach((b) => {
          const active = b === btn;
          b.classList.toggle('is-active', active);
          b.classList.toggle('border-sky/40', active && mode === 'galaxy');
          b.classList.toggle('bg-sky/20', active && mode === 'galaxy');
          b.classList.toggle('border-magenta/40', active && mode === 'emv');
          b.classList.toggle('bg-magenta/20', active && mode === 'emv');
          b.classList.toggle('border-ray/40', active && mode === 'avh');
          b.classList.toggle('bg-ray/20', active && mode === 'avh');
          b.classList.toggle('text-white', active);
          b.classList.toggle('text-cream/70', !active);
        });
        setMode(mode);
      });
    });

    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let targetRotY = 0.55;
    let targetRotX = 0.22;

    const onDown = (e) => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      canvas.setPointerCapture?.(e.pointerId);
    };
    const onMove = (e) => {
      if (!dragging) return;
      targetRotY += (e.clientX - lastX) * 0.012;
      targetRotX = Math.max(-0.65, Math.min(0.65, targetRotX + (e.clientY - lastY) * 0.012));
      lastX = e.clientX;
      lastY = e.clientY;
    };
    const onUp = () => {
      dragging = false;
    };

    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);

    let rafId = 0;
    let isVisible = false;
    let docVisible = !document.hidden;
    const shouldRender = () => isVisible && docVisible;
    const syncLoop = () => {
      if (shouldRender()) {
        if (!rafId) rafId = requestAnimationFrame(renderLoop);
      } else if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
    };
    const renderLoop = () => {
      rafId = 0;
      if (!shouldRender()) return;
      const rect = canvas.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const targetW = Math.round(rect.width * dpr);
        const targetH = Math.round(rect.height * dpr);
        if (canvas.width !== targetW || canvas.height !== targetH) {
          renderer.setSize(rect.width, rect.height, false);
          camera.aspect = rect.width / rect.height;
          camera.updateProjectionMatrix();
        }
      }

      if (!dragging) {
        targetRotY += 0.006;
      }
      stageGroup.rotation.y += (targetRotY - stageGroup.rotation.y) * 0.12;
      stageGroup.rotation.x += (targetRotX - stageGroup.rotation.x) * 0.12;

      renderer.render(scene, camera);
      if (shouldRender()) rafId = requestAnimationFrame(renderLoop);
    };

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        isVisible = entries.some((en) => en.isIntersecting);
        syncLoop();
      }, { rootMargin: '100px 0px', threshold: 0.01 });
      io.observe(canvas.parentElement || canvas);
    } else {
      isVisible = true;
      syncLoop();
    }
    document.addEventListener('visibilitychange', () => {
      docVisible = !document.hidden;
      syncLoop();
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initClinical3DBench);
  } else {
    initClinical3DBench();
  }
})();


/* ==========================================================================
   HERO BLUEPRINT INK REVEAL (GRAND LUXURY EDITORIAL TYPOGRAPHY - PURE TEXT)
   Clean, enlarged Instrument Serif outline with organic turbulent ink reveal
   ========================================================================== */
(function () {
  function initHeroInkReveal() {
    const container = document.getElementById('hero-ink-reveal');
    const svg = document.getElementById('hero-ink-svg');
    const maskCircle = document.getElementById('hero-ink-mask-circle');
    const plateFrame = document.getElementById('hero-ink-plate-frame');
    const plateSolid = document.getElementById('hero-ink-plate-solid');

    if (!container || !svg || !maskCircle || !plateFrame || !plateSolid) return;

    const VIEW_W = 1000;
    const VIEW_H = 370;
    const S = 2; // 2x supersampling for high-DPI retina rendering
    const W = VIEW_W * S;
    const H = VIEW_H * S;

    const renderPlate = (solid) => {
      const c = document.createElement('canvas');
      c.width = W;
      c.height = H;
      const ctx = c.getContext('2d');
      if (!ctx) return '';

      const family = '"Futura", "Futura PT", "Futura Medium", "Jost", "Century Gothic", ui-sans-serif, system-ui, sans-serif';
      // Enlarged, majestic scale filling the hero container
      let fontSize = Math.round(180 * S);
      const lineHeight = Math.round(170 * S);
      const line1Y = Math.round(158 * S);
      const line2Y = line1Y + lineHeight;
      const startX = Math.round(8 * S);

      ctx.textBaseline = 'alphabetic';
      ctx.textAlign = 'left';

      // Width safeguard: ensure title fits with elegant proportion
      ctx.font = `normal ${fontSize}px ${family}`;
      const m1 = ctx.measureText('Advanced Vision.');
      const maxW = W * 0.98;
      if (m1.width > maxW) {
        fontSize = Math.floor(fontSize * (maxW / m1.width));
      }

      if (solid) {
        // Line 1: Advanced Vision. (Pure Pearl Cream)
        ctx.font = `normal ${fontSize}px ${family}`;
        ctx.fillStyle = '#f6f4ee';
        ctx.fillText('Advanced Vision.', startX, line1Y);

        // Line 2: Better (Pure Pearl Cream)
        ctx.fillText('Better ', startX, line2Y);

        // Line 2: Lives. (Pure Italic Soft Celestial Blue #cfe2ff)
        const betterWidth = ctx.measureText('Better ').width;
        ctx.font = `italic ${fontSize}px ${family}`;
        ctx.fillStyle = '#cfe2ff';
        ctx.fillText('Lives.', startX + betterWidth, line2Y);

        return c.toDataURL('image/png');
      }

      // --- PURE CRISP HAIRLINE CONTOURS (NO TICKS, NO MARKS) ---
      ctx.lineWidth = 1.45 * S;
      ctx.lineJoin = 'miter';
      ctx.miterLimit = 3;

      // Line 1 Hairline (Pure Text)
      ctx.font = `normal ${fontSize}px ${family}`;
      ctx.strokeStyle = 'rgba(246, 244, 238, 0.48)';
      ctx.strokeText('Advanced Vision.', startX, line1Y);

      // Line 2 Hairline: Better (Pure Text)
      ctx.strokeStyle = 'rgba(246, 244, 238, 0.48)';
      ctx.strokeText('Better ', startX, line2Y);

      // Line 2 Hairline: Lives. (Pure Italic Celestial Blue Text)
      const betterWidth = ctx.measureText('Better ').width;
      ctx.font = `italic ${fontSize}px ${family}`;
      ctx.strokeStyle = 'rgba(207, 226, 255, 0.65)';
      ctx.strokeText('Lives.', startX + betterWidth, line2Y);

      return c.toDataURL('image/png');
    };

    const updatePlates = () => {
      const frameSrc = renderPlate(false);
      const solidSrc = renderPlate(true);
      if (frameSrc && solidSrc) {
        plateFrame.setAttribute('href', frameSrc);
        plateFrame.setAttributeNS('http://www.w3.org/1999/xlink', 'href', frameSrc);
        plateSolid.setAttribute('href', solidSrc);
        plateSolid.setAttributeNS('http://www.w3.org/1999/xlink', 'href', solidSrc);
      }
    };

    // Render when font is fully loaded + immediate initial render
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(updatePlates);
    }
    updatePlates();

    // --- INTERACTIVE INK REVEAL PHYSICS (SCALED FOR LARGER SCALE) ---
    const INK_RADIUS = 220;
    let isHovered = false;
    let targetRadius = 0;
    let currentRadius = 0;
    let viewScale = 1;
    const coords = { x: 500, y: 185 };
    const springCoords = { x: 500, y: 185 };
    let rafId = null;

    const updateViewScale = () => {
      const m = svg.getScreenCTM();
      if (m && m.a > 0) {
        viewScale = m.a;
      } else {
        const r = svg.getBoundingClientRect();
        viewScale = (r.width / VIEW_W) || 1;
      }
    };

    const toViewBox = (clientX, clientY) => {
      const m = svg.getScreenCTM();
      if (m) {
        const pt = svg.createSVGPoint();
        pt.x = clientX;
        pt.y = clientY;
        const p = pt.matrixTransform(m.inverse());
        return { x: p.x, y: p.y };
      }
      const r = svg.getBoundingClientRect();
      const scale = Math.min(r.width / VIEW_W, r.height / VIEW_H) || 1;
      return {
        x: (clientX - r.left - (r.width - VIEW_W * scale) / 2) / scale,
        y: (clientY - r.top - (r.height - VIEW_H * scale) / 2) / scale,
      };
    };

    const isTouch = window.matchMedia && window.matchMedia('(hover: none)').matches;
    if (isTouch) {
      targetRadius = VIEW_W;
      currentRadius = VIEW_W;
      maskCircle.setAttribute('r', (VIEW_W / Math.max(0.0001, viewScale)).toFixed(1));
    } else {
      // Welcome bloom on desktop load
      targetRadius = 180;
      currentRadius = 0;
      setTimeout(() => {
        if (!isHovered) {
          targetRadius = 0;
        }
      }, 1600);
    }

    const updatePhysics = () => {
      let moving = false;
      const dx = coords.x - springCoords.x;
      const dy = coords.y - springCoords.y;

      if (Math.abs(dx) > 0.05 || Math.abs(dy) > 0.05) {
        springCoords.x += dx * 0.18;
        springCoords.y += dy * 0.18;
        moving = true;
      } else if (springCoords.x !== coords.x || springCoords.y !== coords.y) {
        springCoords.x = coords.x;
        springCoords.y = coords.y;
        moving = true;
      }

      const dr = targetRadius - currentRadius;
      if (Math.abs(dr) > 0.2) {
        currentRadius += dr * 0.16;
        moving = true;
      } else if (currentRadius !== targetRadius) {
        currentRadius = targetRadius;
        moving = true;
      }

      if (moving || isHovered) {
        maskCircle.setAttribute('cx', springCoords.x.toFixed(1));
        maskCircle.setAttribute('cy', springCoords.y.toFixed(1));
        maskCircle.setAttribute('r', (currentRadius / Math.max(0.0001, viewScale)).toFixed(1));
        rafId = requestAnimationFrame(updatePhysics);
      } else {
        rafId = null;
      }
    };

    const triggerPhysics = () => {
      if (!rafId) rafId = requestAnimationFrame(updatePhysics);
    };

    container.addEventListener('pointerenter', (e) => {
      updateViewScale();
      const p = toViewBox(e.clientX, e.clientY);
      coords.x = p.x;
      coords.y = p.y;
      springCoords.x = p.x;
      springCoords.y = p.y;
      isHovered = true;
      targetRadius = INK_RADIUS;
      triggerPhysics();
    });

    container.addEventListener('pointermove', (e) => {
      const p = toViewBox(e.clientX, e.clientY);
      coords.x = p.x;
      coords.y = p.y;
      if (!isHovered) {
        isHovered = true;
        targetRadius = INK_RADIUS;
      }
      triggerPhysics();
    });

    container.addEventListener('pointerleave', () => {
      isHovered = false;
      targetRadius = isTouch ? VIEW_W : 0;
      triggerPhysics();
    });

    window.addEventListener('resize', updateViewScale);
    window.addEventListener('scroll', updateViewScale, { passive: true });
    updateViewScale();
    triggerPhysics();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeroInkReveal);
  } else {
    initHeroInkReveal();
  }
})();  // 11. Interactive Optical Acuity Simulator (Official RayOne Galaxy Vision Simulator Architecture)


// 14. MediQ Activities Gallery Interactive Controller (APVRS 2025 Manila)
const activityMainImg = document.getElementById('activity-main-img');
const activityCaption = document.getElementById('activity-img-caption');
const activityCount = document.getElementById('activity-img-count');
const activityThumbs = document.querySelectorAll('.activity-thumb');

if (activityThumbs.length && activityMainImg) {
  activityThumbs.forEach((thumb, idx) => {
    thumb.addEventListener('click', () => {
      const src = thumb.getAttribute('data-img');
      const cap = thumb.getAttribute('data-caption') || 'MediQ APVRS 2025 Manila';

      // Update main image with quick fade
      activityMainImg.classList.add('opacity-40');
      setTimeout(() => {
        activityMainImg.src = src;
        if (activityCaption) activityCaption.textContent = cap;
        if (activityCount) activityCount.textContent = `Photo ${idx + 1} of ${activityThumbs.length}`;
        activityMainImg.classList.remove('opacity-40');
      }, 120);

      // Update active thumb styling
      activityThumbs.forEach((t) => {
        const isCurrent = t === thumb;
        t.classList.toggle('is-active', isCurrent);
        t.classList.toggle('border-2', isCurrent);
        t.classList.toggle('border-sky', isCurrent);
        t.classList.toggle('ring-1', isCurrent);
        t.classList.toggle('ring-sky/50', isCurrent);
        t.classList.toggle('border', !isCurrent);
        t.classList.toggle('border-white/15', !isCurrent);
        t.classList.toggle('opacity-65', !isCurrent);
      });
    });
  });
}


// =========================================================================
// 15. Ink Orbit Hero Engine (Generative 3D Sculpture, Cycling Serif, Workflow Modal)
// =========================================================================

// A. Cycling Serif Headline Line
const cycleAccWord = document.getElementById('hero-cycle-word');
const HERO_ACCENTS = [
  'Continuous Spiral Optics',
  'Pioneering Intraocular Lenses',
  'Precision Ophthalmic Logistics',
  'Advanced Surgical Innovation'
];
let heroAccentIx = 0;

if (cycleAccWord) {
  setInterval(() => {
    if (document.hidden || window.scrollY > (window.innerHeight || 900) * 1.15) return;
    cycleAccWord.classList.add('opacity-0', 'blur-sm', '-translate-y-2');
    setTimeout(() => {
      heroAccentIx = (heroAccentIx + 1) % HERO_ACCENTS.length;
      cycleAccWord.textContent = HERO_ACCENTS[heroAccentIx];
      cycleAccWord.classList.remove('-translate-y-2');
      cycleAccWord.classList.add('translate-y-2');
      requestAnimationFrame(() => {
        cycleAccWord.classList.remove('opacity-0', 'blur-sm', 'translate-y-2');
      });
    }, 420);
  }, 2200);
}

// A2. Silk Waves ShaderBackground Engine (Disabled so Obsidian-Cobalt Radial Halo & Hero Smoke canvas shine cleanly)
function initSilkWavesShader(canvasId) {
  const wavesShaderCanvas = document.getElementById(canvasId);
  if (wavesShaderCanvas) {
    wavesShaderCanvas.style.display = 'none';
  }
  return;
  if (!wavesShaderCanvas || wavesShaderCanvas._wavesActive) return;
  wavesShaderCanvas._wavesActive = true;

  const VERT = `attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;
  const FRAG = `#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec3 u_colors[8];
uniform vec4 u_scene;
uniform vec4 u_shape;
uniform vec4 u_surface;
uniform vec4 u_finish;
uniform vec4 u_transform;
uniform vec4 u_space;
uniform vec4 u_cursor;

#define u_resolution u_scene.xy
#define u_time u_scene.z
#define u_colorCount u_scene.w
#define u_scale u_shape.x
#define u_intensity u_shape.y
#define u_paramA u_shape.z
#define u_warp u_shape.w
#define u_detail u_surface.x
#define u_contrast u_surface.y
#define u_brightness u_surface.z
#define u_saturation u_surface.w
#define u_hue u_finish.x
#define u_vignette u_finish.y
#define u_blur u_finish.z
#define u_grain u_finish.w
#ifdef GL_FRAGMENT_PRECISION_HIGH
#define u_seed u_transform.x
#else
#define u_seed mod(u_transform.x, 31.0)
#endif
#define u_rotate u_transform.y
#define u_drift u_transform.z
#define u_oklab u_transform.w
#define u_offset u_space.xy
#define u_mouse u_space.zw
#define u_cursorPresence u_cursor.x
#define u_cursorEffect u_cursor.y
#define u_cursorStrength u_cursor.z
#define u_cursorRadius u_cursor.w

float hash21(vec2 p) {
#ifndef GL_FRAGMENT_PRECISION_HIGH
  p = mod(p, 31.0);
#endif
  p = fract(p * vec2(234.34, 435.345));
  p += dot(p, p + 34.23);
  return fract(p.x * p.y);
}

float grainHash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash21(i), hash21(i + vec2(1.0, 0.0)), u.x),
    mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), u.x),
    u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = p * 2.03 + vec2(17.0, 9.2);
    a *= 0.5;
  }
  return v;
}

vec3 srgbToLinear(vec3 c) {
  return mix(c / 12.92, pow((c + 0.055) / 1.055, vec3(2.4)), step(0.04045, c));
}
vec3 linearToSrgb(vec3 c) {
  return mix(c * 12.92, 1.055 * pow(max(c, vec3(0.0)), vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c));
}
vec3 linToOklab(vec3 c) {
  float l = 0.4122214708 * c.r + 0.5363325363 * c.g + 0.0514459929 * c.b;
  float m = 0.2119034982 * c.r + 0.6806995451 * c.g + 0.1073969566 * c.b;
  float s = 0.0883024619 * c.r + 0.2817188376 * c.g + 0.6299787005 * c.b;
  l = pow(max(l, 0.0), 1.0 / 3.0);
  m = pow(max(m, 0.0), 1.0 / 3.0);
  s = pow(max(s, 0.0), 1.0 / 3.0);
  return vec3(
    0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s);
}
vec3 oklabToLin(vec3 c) {
  float l = c.x + 0.3963377774 * c.y + 0.2158037573 * c.z;
  float m = c.x - 0.1055613458 * c.y - 0.0638541728 * c.z;
  float s = c.x - 0.0894841775 * c.y - 1.2914855480 * c.z;
  l = l * l * l; m = m * m * m; s = s * s * s;
  return vec3(
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s);
}
vec3 mixColour(vec3 a, vec3 b, float t) {
  if (u_oklab > 0.5) {
    vec3 la = linToOklab(srgbToLinear(a));
    vec3 lb = linToOklab(srgbToLinear(b));
    return clamp(linearToSrgb(oklabToLin(mix(la, lb, t))), 0.0, 1.0);
  }
  return mix(a, b, t);
}

vec3 palette(float x) {
  float n = max(u_colorCount - 1.0, 1.0);
  float f = clamp(x, 0.0, 1.0) * n;
  vec3 col = u_colors[0];
  for (int i = 0; i < 7; i++) {
    if (float(i) < n)
      col = mixColour(col, u_colors[i + 1], smoothstep(0.0, 1.0, clamp(f - float(i), 0.0, 1.0)));
  }
  return col;
}

vec3 hueRotate(vec3 col, float a) {
  const mat3 toYIQ = mat3(0.299, 0.596, 0.211, 0.587, -0.274, -0.523, 0.114, -0.322, 0.312);
  const mat3 toRGB = mat3(1.0, 1.0, 1.0, 0.956, -0.272, -1.106, 0.621, -0.647, 1.703);
  vec3 yiq = toYIQ * col;
  float ca = cos(a), sa = sin(a);
  yiq = vec3(yiq.x, yiq.y * ca - yiq.z * sa, yiq.y * sa + yiq.z * ca);
  return toRGB * yiq;
}

vec3 shade(vec2 uv, vec2 p, float t) {
  vec2 q = p * 1.6;
  float amp = 0.25 + u_intensity * 0.85;
  for (float i = 1.0; i < 5.0; i += 1.0) {
    q.x += amp / i * cos(i * 2.4 * q.y + t * 0.8 + u_seed);
    q.y += amp / i * cos(i * 1.7 * q.x + t * 0.6);
  }
  return palette(0.5 + 0.5 * sin(q.x + q.y));
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 screenUv = uv;
  vec2 p = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
  float cursorMask = 0.0;

  if (u_cursorPresence > 0.001) {
    vec2 cursor = (0.5 * u_mouse * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
    vec2 cursorDelta = p - cursor;
    if (u_cursorEffect < 0.5) {
      p += cursor * u_cursorPresence * u_cursorStrength * 0.55;
    } else {
      float cursorDistance = length(cursorDelta);
      vec2 cursorDirection = cursorDelta / max(cursorDistance, 0.0001);
      cursorMask = u_cursorPresence * (1.0 - smoothstep(0.0, u_cursorRadius, cursorDistance));
      if (u_cursorEffect < 1.5) {
        p -= cursorDirection * cursorMask * u_cursorStrength * 0.24;
      } else if (u_cursorEffect < 2.5) {
        float cursorAngle = cursorMask * u_cursorStrength * 2.2;
        float cc = cos(cursorAngle), cs = sin(cursorAngle);
        p = cursor + mat2(cc, -cs, cs, cc) * cursorDelta;
      } else if (u_cursorEffect < 3.5) {
        float ripple = sin(cursorDistance / max(u_cursorRadius, 0.001) * 18.0 - u_time * 5.0);
        p -= cursorDirection * ripple * cursorMask * u_cursorStrength * 0.07;
      }
    }
  }

  uv = p * min(u_resolution.x, u_resolution.y) / u_resolution.xy + 0.5;
  p *= u_scale;
  if (abs(u_rotate) > 0.0001) {
    float cr = cos(u_rotate), sr = sin(u_rotate);
    p = mat2(cr, -sr, sr, cr) * p;
  }
  p += u_offset;
  if (u_drift > 0.0001)
    p += u_drift * vec2(sin(u_time * 0.31), cos(u_time * 0.23));
  if (u_warp > 0.0) {
    p += u_warp * (vec2(fbm(p * u_detail + u_seed), fbm(p * u_detail + vec2(5.2, 1.3))) - 0.5);
  }
  vec3 col;
  if (u_blur > 0.0) {
    float e = u_blur;
    float pe = e * u_scale;
    vec2 uvE = vec2(e) * min(u_resolution.x, u_resolution.y) / u_resolution.xy;
    col  = shade(uv, p, u_time) * 0.36;
    col += shade(uv + vec2(uvE.x, 0.0), p + vec2(pe, 0.0), u_time) * 0.16;
    col += shade(uv - vec2(uvE.x, 0.0), p - vec2(pe, 0.0), u_time) * 0.16;
    col += shade(uv + vec2(0.0, uvE.y), p + vec2(0.0, pe), u_time) * 0.16;
    col += shade(uv - vec2(0.0, uvE.y), p - vec2(0.0, pe), u_time) * 0.16;
  } else {
    col = shade(uv, p, u_time);
  }
  if (abs(u_contrast - 1.0) > 0.0001)
    col = (col - 0.5) * u_contrast + 0.5;
  if (abs(u_saturation - 1.0) > 0.0001) {
    float luma = dot(col, vec3(0.299, 0.587, 0.114));
    col = mix(vec3(luma), col, u_saturation);
  }
  if (abs(u_hue) > 0.0001)
    col = hueRotate(col, u_hue);
  if (abs(u_brightness) > 0.0001)
    col += u_brightness;
  if (u_vignette > 0.0001) {
    float vd = length(screenUv - 0.5) * 1.41421356;
    col *= 1.0 - u_vignette * smoothstep(0.35, 1.0, vd);
  }
  if (u_cursorPresence > 0.001 && u_cursorEffect > 3.5)
    col += (vec3(0.18) + col * 0.12) * cursorMask * u_cursorStrength;
  if (u_grain > 0.0001)
    col += (grainHash(gl_FragCoord.xy + vec2(u_seed * 17.0, u_seed * 31.0)) - 0.5) * u_grain;
  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}`;

  // Exact UNIFORMS from waves-background-2.tsx mapped to MediQ Pharma Navy Swatch (#0b1b36, #162f56, #102445, #0f2241)
  const UNIFORMS = {
    colors: [
      [0.0392, 0.1137, 0.2510], // Primary MedTech Blue base #0a1d40 (RGB 10, 29, 64)
      [0.0784, 0.2078, 0.4392], // Luminous #0a1d40 wave fold highlight #143570 (RGB 20, 53, 112)
      [0.0588, 0.1569, 0.3373], // Mid-tone #0a1d40 royal navy #0f2856 (RGB 15, 40, 86)
      [0.0392, 0.1137, 0.2510], // Deep MedTech Blue base #0a1d40 (RGB 10, 29, 64)
      [0.0392, 0.1137, 0.2510],
      [0.0392, 0.1137, 0.2510],
      [0.0392, 0.1137, 0.2510],
      [0.0392, 0.1137, 0.2510]
    ],
    colorCount: 4,
    scale: 1.850,
    intensity: 0.480,
    paramA: 0.480,
    warp: 0.055,
    detail: 2.600,
    contrast: 1.050,
    brightness: 0.000,
    saturation: 1.000,
    hue: 0.0000,
    vignette: 0.020,
    blur: 0.0025,
    grain: 0.003,
    seed: 3195.0,
    rotate: 4.3284,
    offsetX: -0.100,
    offsetY: 0.020,
    drift: 0.040,
    cursorEnabled: true,
    cursorEffect: 2.0,
    cursorStrength: 0.700,
    cursorRadius: 0.520,
    oklab: 0.0,
    timeScale: 0.750 // Calm, tranquil fluid undulation
  };

  const gl = wavesShaderCanvas.getContext('webgl', { antialias: false });
  if (gl) {
    const compile = (type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const program = gl.createProgram();
    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    gl.useProgram(program);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uni = {
      colors: gl.getUniformLocation(program, 'u_colors'),
      scene: gl.getUniformLocation(program, 'u_scene'),
      shape: gl.getUniformLocation(program, 'u_shape'),
      surface: gl.getUniformLocation(program, 'u_surface'),
      finish: gl.getUniformLocation(program, 'u_finish'),
      transform: gl.getUniformLocation(program, 'u_transform'),
      space: gl.getUniformLocation(program, 'u_space'),
      cursor: gl.getUniformLocation(program, 'u_cursor')
    };

    gl.uniform3fv(uni.colors, new Float32Array(UNIFORMS.colors.flat()));
    gl.uniform4f(uni.shape, UNIFORMS.scale, UNIFORMS.intensity, UNIFORMS.paramA, UNIFORMS.warp);
    gl.uniform4f(uni.surface, UNIFORMS.detail, UNIFORMS.contrast, UNIFORMS.brightness, UNIFORMS.saturation);
    gl.uniform4f(uni.finish, UNIFORMS.hue, UNIFORMS.vignette, UNIFORMS.blur, UNIFORMS.grain);
    gl.uniform4f(uni.transform, UNIFORMS.seed, UNIFORMS.rotate, UNIFORMS.drift, UNIFORMS.oklab);
    gl.uniform4f(uni.cursor, 0, UNIFORMS.cursorEffect, UNIFORMS.cursorStrength, UNIFORMS.cursorRadius);

    let targetX = 0, targetY = 0, targetPresence = 0;
    let mouseX = 0, mouseY = 0, cursorPresence = 0;
    let bounds = wavesShaderCanvas.getBoundingClientRect();
    let lastNow = null;
    const start = performance.now();
    let isVisible = false;
    let rafId = 0;

    const resizeShaderCanvas = () => {
      bounds = wavesShaderCanvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1);
      const measuredW = bounds.width > 10 ? bounds.width : window.innerWidth;
      const measuredH = bounds.height > 10 ? bounds.height : window.innerHeight;
      const rawW = Math.max(1, Math.round(measuredW * dpr));
      const rawH = Math.max(1, Math.round(measuredH * dpr));
      const pixelScale = Math.min(1, Math.sqrt(520000 / Math.max(1, rawW * rawH)));
      const width = Math.max(1, Math.round(rawW * pixelScale));
      const height = Math.max(1, Math.round(rawH * pixelScale));
      if (wavesShaderCanvas.width !== width || wavesShaderCanvas.height !== height) {
        wavesShaderCanvas.width = width;
        wavesShaderCanvas.height = height;
        gl.viewport(0, 0, width, height);
      }
    };
    resizeShaderCanvas();
    wavesShaderCanvas._resizeWaves = resizeShaderCanvas;
    window.addEventListener('resize', resizeShaderCanvas, { passive: true });

    window.addEventListener('pointermove', (e) => {
      if (!isVisible || bounds.width === 0 || bounds.height === 0) return;
      const inside = e.clientX >= bounds.left && e.clientX <= bounds.right && e.clientY >= bounds.top && e.clientY <= bounds.bottom;
      if (!inside) {
        targetPresence = 0;
        return;
      }
      targetX = ((e.clientX - bounds.left) / bounds.width) * 2 - 1;
      targetY = -(((e.clientY - bounds.top) / bounds.height) * 2 - 1);
      targetPresence = 1;
    }, { passive: true });

    const isProductsWaves = canvasId === 'products-waves-shader-canvas';
    const prodSecEl = isProductsWaves ? document.getElementById('products') : null;
    let isDocVisible = !document.hidden;
    let isCoveredBySpiral = !!(prodSecEl && prodSecEl.classList.contains('at-spiral-active'));

    const shouldRenderSilk = () => isVisible && isDocVisible && !isCoveredBySpiral;
    const syncSilkLoop = () => {
      if (shouldRenderSilk()) {
        bounds = wavesShaderCanvas.getBoundingClientRect();
        if (!rafId) rafId = requestAnimationFrame(renderSilkShader);
      } else {
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = 0;
        }
        lastNow = null;
      }
    };

    const renderSilkShader = (now) => {
      rafId = 0;
      if (!shouldRenderSilk()) { lastNow = null; return; }
      if (window.__mediqFastJumping) {
        rafId = requestAnimationFrame(renderSilkShader);
        return;
      }
      const dt = lastNow === null ? 0.016 : Math.min((now - lastNow) / 1000, 0.1);
      lastNow = now;
      const follow = 1 - Math.exp(-20 * dt);
      mouseX += (targetX - mouseX) * follow;
      mouseY += (targetY - mouseY) * follow;
      cursorPresence += (targetPresence - cursorPresence) * follow;
      gl.uniform4f(uni.scene, wavesShaderCanvas.width, wavesShaderCanvas.height, ((now - start) / 1000) * UNIFORMS.timeScale, UNIFORMS.colorCount);
      gl.uniform4f(uni.space, UNIFORMS.offsetX, UNIFORMS.offsetY, mouseX, mouseY);
      gl.uniform4f(uni.cursor, UNIFORMS.cursorEnabled ? cursorPresence : 0, UNIFORMS.cursorEffect, UNIFORMS.cursorStrength, UNIFORMS.cursorRadius);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (shouldRenderSilk()) rafId = requestAnimationFrame(renderSilkShader);
    };

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((en) => { isVisible = en.isIntersecting; });
        syncSilkLoop();
      }, { rootMargin: '160px 0px', threshold: 0.01 });
      io.observe(wavesShaderCanvas.parentElement || wavesShaderCanvas);
    } else {
      isVisible = true;
      syncSilkLoop();
    }

    document.addEventListener('visibilitychange', () => {
      isDocVisible = !document.hidden;
      syncSilkLoop();
    });

    if (prodSecEl) {
      const syncSpiral = () => {
        isCoveredBySpiral = prodSecEl.classList.contains('at-spiral-active');
        syncSilkLoop();
      };
      window.addEventListener('mediq:products-stage-change', syncSpiral);
      if (typeof MutationObserver !== 'undefined') {
        const mo = new MutationObserver(syncSpiral);
        mo.observe(prodSecEl, { attributes: true, attributeFilter: ['class'] });
      }
    }
  }
}
initSilkWavesShader('hero-waves-shader-canvas');
initSilkWavesShader('about-waves-shader-canvas');
initSilkWavesShader('products-waves-shader-canvas');
initSilkWavesShader('brands-waves-shader-canvas');
initSilkWavesShader('distribution-waves-shader-canvas');
initSilkWavesShader('resources-waves-shader-canvas');
initSilkWavesShader('activities-waves-shader-canvas');
initSilkWavesShader('contact-waves-shader-canvas');

// A3. Live Animated Optical Photon Pulses Locked to the Exact Reference Line Coordinates
const photonCanvas = document.getElementById('hero-photon-lines-canvas');
if (photonCanvas) {
  const pctx = photonCanvas.getContext('2d');
  let pw = 1, ph = 1, pdpr = 1;

  const resizePhotonCanvas = () => {
    pdpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = photonCanvas.getBoundingClientRect();
    pw = Math.max(1, Math.floor(rect.width));
    ph = Math.max(1, Math.floor(rect.height));
    if (photonCanvas.width !== pw * pdpr || photonCanvas.height !== ph * pdpr) {
      photonCanvas.width = pw * pdpr;
      photonCanvas.height = ph * pdpr;
    }
  };
  resizePhotonCanvas();
  window.addEventListener('resize', resizePhotonCanvas, { passive: true });

  const imgToCanvas = (nx, ny, cover) => ({
    x: cover.ox + nx * cover.dw,
    y: cover.oy + ny * cover.dh
  });

  // Exact pixel-ridge coordinates measured directly from the reference artwork (2048x1152)
  const PHOTON_STREAMS = [
    // 1. Exact Left Sweeping C-Loop Photon Line
    {
      pts: [
        [0.620, 0.5425],
        [0.560, 0.5703],
        [0.530, 0.5920],
        [0.500, 0.6189],
        [0.460, 0.6649],
        [0.440, 0.7075],
        [0.435, 0.7225],
        [0.440, 0.7465],
        [0.460, 0.7664],
        [0.490, 0.7828],
        [0.520, 0.7958],
        [0.550, 0.8010],
        [0.580, 0.8063],
        [0.620, 0.8115],
        [0.660, 0.8236]
      ],
      speed: 0.34,
      phase: 0.0,
      width: 2.6,
      baseAlpha: 0.85,
      pulses: [0.0, 0.50]
    },
    // 2. Exact Left Inner Crossing Line (lower branch inside loop)
    {
      pts: [
        [0.650, 0.7352],
        [0.600, 0.7447],
        [0.560, 0.7543],
        [0.520, 0.7621],
        [0.460, 0.7664]
      ],
      speed: 0.38,
      phase: 1.4,
      width: 2.0,
      baseAlpha: 0.65,
      pulses: [0.20, 0.75]
    },
    // 3. Exact Top-Right Refracted Diagonal Ray
    {
      pts: [
        [0.805, 0.2850],
        [0.850, 0.2484],
        [0.880, 0.2215],
        [0.910, 0.1972],
        [0.940, 0.1746],
        [0.970, 0.1538],
        [0.998, 0.1340]
      ],
      speed: 0.44,
      phase: 0.5,
      width: 2.8,
      baseAlpha: 0.90,
      pulses: [0.08, 0.58]
    },
    // 4. Exact Mid-Right Refracted Diagonal Ray
    {
      pts: [
        [0.822, 0.4310],
        [0.850, 0.4172],
        [0.880, 0.4025],
        [0.910, 0.3868],
        [0.940, 0.3712],
        [0.970, 0.3591],
        [0.998, 0.3455]
      ],
      speed: 0.39,
      phase: 1.9,
      width: 2.6,
      baseAlpha: 0.88,
      pulses: [0.28, 0.78]
    },
    // 5. Exact Lower-Right Refracted Diagonal Ray
    {
      pts: [
        [0.820, 0.6620],
        [0.850, 0.6376],
        [0.880, 0.6176],
        [0.910, 0.5916],
        [0.940, 0.5673],
        [0.970, 0.5430],
        [0.998, 0.5200]
      ],
      speed: 0.36,
      phase: 3.2,
      width: 2.5,
      baseAlpha: 0.85,
      pulses: [0.44, 0.94]
    }
  ];

  const sampleStreamPoint = (pts, s, cover) => {
    const n = pts.length - 1;
    const scaled = Math.max(0, Math.min(n - 0.0001, s * n));
    const i = Math.floor(scaled);
    const f = scaled - i;
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[Math.min(n, i + 1)];
    const p3 = pts[Math.min(n, i + 2)];

    const f2 = f * f;
    const f3 = f2 * f;
    const nx = 0.5 * (
      (2 * p1[0]) +
      (-p0[0] + p2[0]) * f +
      (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * f2 +
      (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * f3
    );
    const ny = 0.5 * (
      (2 * p1[1]) +
      (-p0[1] + p2[1]) * f +
      (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * f2 +
      (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * f3
    );
    return imgToCanvas(nx * 0.93 + 0.069824, ny * 0.93 + 0.0703125, cover);
  };

  const startPhotonTime = performance.now();
  let photonVisible = true;
  let photonDocVisible = !document.hidden;
  let photonRafId = 0;

  const syncPhotonLoop = () => {
    if (photonVisible && photonDocVisible) {
      if (!photonRafId) photonRafId = requestAnimationFrame(renderPhotonLines);
    } else if (photonRafId) {
      cancelAnimationFrame(photonRafId);
      photonRafId = 0;
    }
  };

  const renderPhotonLines = (now) => {
    photonRafId = 0;
    if (!photonVisible || !photonDocVisible) return;
    const t = (now - startPhotonTime) / 1000;

    pctx.save();
    pctx.scale(pdpr, pdpr);
    pctx.clearRect(0, 0, pw, ph);

    const imgW = 2048, imgH = 1152;
    const scale = Math.max(pw / imgW, ph / imgH);
    const dw = imgW * scale;
    const dh = imgH * scale;
    const ox = (pw - dw) * 0.5;
    const oy = (ph - dh) * 0.5;
    const cover = { ox, oy, dw, dh };

    pctx.globalCompositeOperation = 'lighter';
    pctx.lineCap = 'round';
    pctx.lineJoin = 'round';
    const steps = 60;

    for (let sIdx = 0; sIdx < PHOTON_STREAMS.length; sIdx++) {
      const stream = PHOTON_STREAMS[sIdx];
      const sampled = [];
      for (let k = 0; k <= steps; k++) {
        sampled.push(sampleStreamPoint(stream.pts, k / steps, cover));
      }

      // Traveling high-energy photon pulses (light comets) locked to the exact line path
      for (let pIdx = 0; pIdx < stream.pulses.length; pIdx++) {
        const headPos = (stream.pulses[pIdx] + t * stream.speed) % 1.32 - 0.16;
        const tailLen = 0.30;

        for (let k = 1; k <= steps; k++) {
          const s = k / steps;
          const distBehind = headPos - s;
          if (distBehind >= -0.04 && distBehind <= tailLen) {
            let intensity = 0;
            if (distBehind < 0) {
              intensity = 1.0 - Math.abs(distBehind) / 0.04;
            } else {
              intensity = Math.pow(1.0 - distBehind / tailLen, 1.6);
            }
            const edgeFade = Math.sin(s * Math.PI);
            const alpha = intensity * edgeFade * stream.baseAlpha;
            if (alpha > 0.015) {
              const pA = sampled[k - 1];
              const pB = sampled[k];

              // Soft cyan optical halo along the line
              pctx.beginPath();
              pctx.moveTo(pA.x, pA.y);
              pctx.lineTo(pB.x, pB.y);
              pctx.strokeStyle = `rgba(56, 189, 248, ${(alpha * 0.45).toFixed(3)})`;
              pctx.lineWidth = stream.width * 3.6;
              pctx.stroke();

              // Bright ice-white traveling core
              pctx.beginPath();
              pctx.moveTo(pA.x, pA.y);
              pctx.lineTo(pB.x, pB.y);
              pctx.strokeStyle = `rgba(240, 252, 255, ${(alpha * 0.95).toFixed(3)})`;
              pctx.lineWidth = stream.width * (0.85 + 0.65 * intensity);
              pctx.stroke();
            }
          }
        }
      }
    }

    pctx.restore();
    if (photonVisible && photonDocVisible) photonRafId = requestAnimationFrame(renderPhotonLines);
  };

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      photonVisible = entries.some((en) => en.isIntersecting);
      syncPhotonLoop();
    }, { rootMargin: '160px 0px', threshold: 0.01 });
    io.observe(photonCanvas.closest('section') || photonCanvas.parentElement || photonCanvas);
  }
  document.addEventListener('visibilitychange', () => {
    photonDocVisible = !document.hidden;
    syncPhotonLoop();
  });
  syncPhotonLoop();
}

// B. Interactive Specular Light Glint & Subtle Parallax on C-Shape Bionic Eye Lens
const heroCanvas = document.getElementById('hero-ink-orbit-canvas');
const heroStage = document.getElementById('hero-lens-overlay-layer');

if (heroCanvas) {
  const ctx = heroCanvas.getContext('2d');
  let w = 1, h = 1, dpr = 1;
  let pointerX = 0.55, pointerY = 0.48;
  let targetX = 0.55, targetY = 0.48;
  let isHovering = false;

  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = heroCanvas.getBoundingClientRect();
    w = Math.max(1, Math.floor(rect.width));
    h = Math.max(1, Math.floor(rect.height));
    heroCanvas.width = w * dpr;
    heroCanvas.height = h * dpr;
  };
  resize();
  window.addEventListener('resize', resize, { passive: true });

  heroCanvas.addEventListener('pointerleave', () => {
    isHovering = false;
    const tZero = 'translate3d(0, 0, 0)';
    if (heroStage) heroStage.style.transform = tZero;
    if (photonCanvas) photonCanvas.style.transform = tZero;
  });

  window.addEventListener('pointermove', (e) => {
    const rect = heroCanvas.getBoundingClientRect();
    const inside = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
    if (inside) {
      isHovering = true;
      targetX = (e.clientX - rect.left) / rect.width;
      targetY = (e.clientY - rect.top) / rect.height;
    } else {
      isHovering = false;
    }
    if (e.clientY <= window.innerHeight) {
      const nx = (e.clientX / window.innerWidth) - 0.5;
      const ny = (e.clientY / window.innerHeight) - 0.5;
      const tStr = `translate3d(${nx * -10}px, ${ny * -6}px, 0)`;
      if (heroStage) heroStage.style.transform = tStr;
      if (photonCanvas) photonCanvas.style.transform = tStr;
    }
  }, { passive: true });

  let opticsVisible = true;
  let opticsDocVisible = !document.hidden;
  let opticsRafId = 0;

  const syncOpticsLoop = () => {
    if (opticsVisible && opticsDocVisible) {
      if (!opticsRafId) opticsRafId = requestAnimationFrame(animateOptics);
    } else if (opticsRafId) {
      cancelAnimationFrame(opticsRafId);
      opticsRafId = 0;
    }
  };

  const animateOptics = () => {
    opticsRafId = 0;
    if (!opticsVisible || !opticsDocVisible) return;
    pointerX += (targetX - pointerX) * 0.12;
    pointerY += (targetY - pointerY) * 0.12;

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'lighter';

    if (isHovering) {
      const gx = pointerX * w;
      const gy = pointerY * h;
      const distToEdge = Math.max(0, Math.min(gx, w - gx, gy, h - gy));
      const r = Math.min(Math.min(w, h) * 0.24, distToEdge * 0.95);
      const edgeFade = Math.min(1, distToEdge / 90);
      if (r > 4 && edgeFade > 0.02) {
        const grad = ctx.createRadialGradient(gx, gy, 0, gx, gy, r);
        grad.addColorStop(0, `rgba(186, 230, 253, ${(0.18 * edgeFade).toFixed(3)})`);
        grad.addColorStop(0.45, `rgba(56, 189, 248, ${(0.06 * edgeFade).toFixed(3)})`);
        grad.addColorStop(1, 'rgba(56, 189, 248, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(gx, gy, r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
    if (opticsVisible && opticsDocVisible) opticsRafId = requestAnimationFrame(animateOptics);
  };

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      opticsVisible = entries.some((en) => en.isIntersecting);
      syncOpticsLoop();
    }, { rootMargin: '160px 0px', threshold: 0.01 });
    io.observe(heroCanvas.closest('section') || heroCanvas.parentElement || heroCanvas);
  }
  document.addEventListener('visibilitychange', () => {
    opticsDocVisible = !document.hidden;
    syncOpticsLoop();
  });
  syncOpticsLoop();
}

// C. Live Surgical Workflow Demo Dialog
const heroDemoModal = document.getElementById('hero-demo-modal');
const heroOpenDemoBtn = document.getElementById('hero-open-demo-btn');
const heroCloseDemoBtn = document.getElementById('hero-close-demo-btn');
const demoStatus = document.getElementById('demo-modal-status');
const demoProgressBar = document.getElementById('demo-modal-progress-bar');
const demoReplayBtn = document.getElementById('demo-modal-replay-btn');
const demoSteps = document.querySelectorAll('.demo-step');

let demoRaf = 0;
let demoStartT = 0;
const STEP_DUR = 1.6;
const TOTAL_DUR = 5 * STEP_DUR; // 8.0s

const runWorkflowDemo = () => {
  demoStartT = performance.now();
  if (demoReplayBtn) demoReplayBtn.disabled = true;

  const tick = (now) => {
    const elapsed = (now - demoStartT) / 1000;
    const progress = Math.min(1, elapsed / TOTAL_DUR);

    if (demoProgressBar) demoProgressBar.style.width = (progress * 100) + '%';
    if (demoStatus) {
      if (progress >= 1) {
        demoStatus.textContent = 'surgical workflow complete · 8.0s';
      } else {
        demoStatus.textContent = `surgical workflow running · ${elapsed.toFixed(1)}s`;
      }
    }

    demoSteps.forEach((st, idx) => {
      const stepStart = idx * STEP_DUR;
      const stepEnd = (idx + 1) * STEP_DUR;
      const numEl = st.querySelector('.step-num');

      if (elapsed >= stepEnd) {
        st.classList.remove('opacity-40');
        st.classList.add('bg-white/[0.04]', 'border-white/10');
        if (numEl) {
          numEl.innerHTML = '✓';
          numEl.classList.add('bg-sky', 'text-ink', 'font-bold', 'border-sky');
        }
      } else if (elapsed >= stepStart) {
        st.classList.remove('opacity-40');
        st.classList.add('bg-sky/10', 'border-sky/30');
        if (numEl) {
          numEl.innerHTML = '<span class="size-2 rounded-full bg-sky animate-ping"></span>';
        }
      } else {
        st.classList.add('opacity-40');
        st.classList.remove('bg-sky/10', 'bg-white/[0.04]', 'border-sky/30', 'border-white/10');
        if (numEl) {
          numEl.textContent = '0' + (idx + 1);
          numEl.classList.remove('bg-sky', 'text-ink', 'font-bold', 'border-sky');
        }
      }
    });

    if (progress < 1) {
      demoRaf = requestAnimationFrame(tick);
    } else {
      if (demoReplayBtn) demoReplayBtn.disabled = false;
    }
  };

  cancelAnimationFrame(demoRaf);
  demoRaf = requestAnimationFrame(tick);
};

const heroDemoVideo = document.getElementById('hero-demo-video-el');

const openDemoModal = () => {
  if (heroDemoModal) {
    heroDemoModal.classList.remove('hidden');
    if (heroDemoVideo) {
      heroDemoVideo.currentTime = 0;
      heroDemoVideo.play().catch(() => { });
    }
    runWorkflowDemo();
  }
};

const closeDemoModal = () => {
  if (heroDemoModal) {
    heroDemoModal.classList.add('hidden');
    if (heroDemoVideo) heroDemoVideo.pause();
    cancelAnimationFrame(demoRaf);
  }
};

if (heroOpenDemoBtn) heroOpenDemoBtn.addEventListener('click', openDemoModal);
if (heroCloseDemoBtn) heroCloseDemoBtn.addEventListener('click', closeDemoModal);
if (demoReplayBtn) demoReplayBtn.addEventListener('click', runWorkflowDemo);

if (heroDemoModal) {
  heroDemoModal.addEventListener('click', (e) => {
    if (e.target === heroDemoModal) closeDemoModal();
  });
}

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && heroDemoModal && !heroDemoModal.classList.contains('hidden')) {
    closeDemoModal();
  }
});

// =========================================================================
// D. Corporate Hero Carousel & Synchronized Lifespan Visual Stage
// =========================================================================
function initHeroEyeLifespan() {
  const slides = document.querySelectorAll('.hero-eye-slide');
  if (!slides.length) return;

  const HERO_CAROUSEL_DATA = [
    {
      eyebrow: 'PHILIPPINE HEALTHCARE DISTRIBUTOR \u00A0\u2022\u00A0 COMMERCIAL DEVELOPMENT',
      lines: [
        'Connecting Global',
        'Healthcare Innovation',
        'with the Philippines.'
      ],
      lede: 'Medical solutions, product marketing, commercialization, and dependable distribution for a stronger healthcare system — with ophthalmology as our established clinical specialty.',
      primaryLabel: 'Explore Medical Solutions',
      primaryHref: '#products',
      secondaryLabel: 'Corporate Overview',
      secondaryHref: '#about',
      secondaryExternal: false
    },
    {
      eyebrow: 'ESTABLISHED CLINICAL SPECIALTY \u00A0\u2022\u00A0 OPHTHALMIC SOLUTIONS',
      lines: [
        'Trusted Ophthalmic',
        'Distribution for',
        'Filipino Surgeons.'
      ],
      lede: 'Anchored by our established specialty in ophthalmology, MediQ partners with global medical manufacturers to supply intraocular lenses, surgical instruments, and diagnostic technologies to eye centers nationwide.',
      primaryLabel: 'View Ophthalmic Portfolio',
      primaryHref: '#products',
      secondaryLabel: 'View Product Brochure',
      secondaryHref: 'https://mediqvision.com/mobile/index.html',
      secondaryExternal: true
    },
    {
      eyebrow: 'PRODUCT MARKETING \u00A0\u2022\u00A0 COMMERCIALIZATION \u00A0\u2022\u00A0 MARKET ACCESS',
      lines: [
        'Strategic Product',
        'Marketing & Market',
        'Development.'
      ],
      lede: 'We bridge international healthcare innovators with Philippine hospitals and clinicians through regulatory stewardship, ethical product marketing, clinical education, and commercial execution.',
      primaryLabel: 'Our Core Capabilities',
      primaryHref: '#about',
      secondaryLabel: 'Partner With MediQ',
      secondaryHref: '#contact',
      secondaryExternal: false
    },
    {
      eyebrow: 'LUZON \u00A0\u2022\u00A0 VISAYAS \u00A0\u2022\u00A0 MINDANAO INSTITUTIONAL NETWORK',
      lines: [
        'Dependable Distribution',
        'for a Stronger',
        'Healthcare System.'
      ],
      lede: 'Delivering medical devices, pharmaceuticals, and clinical equipment with quality-assured logistics and responsive institutional support across Luzon, Visayas, and Mindanao.',
      primaryLabel: 'Browse Product Divisions',
      primaryHref: '#products',
      secondaryLabel: 'Contact Distribution Team',
      secondaryHref: '#contact',
      secondaryExternal: false
    }
  ];

  const eyebrowTextEl = document.getElementById('hero-eyebrow-text');
  const eyebrowWrapEl = document.getElementById('hero-eyebrow');
  const titleEl = document.getElementById('hero-title');
  const ledeEl = document.getElementById('hero-lede');
  const ctasEl = document.getElementById('hero-ctas');
  const primaryBtn = document.getElementById('hero-cta-primary');
  const primaryLabelEl = document.getElementById('hero-cta-primary-label');
  const secondaryBtn = document.getElementById('hero-open-brochure-btn');
  const secondaryLabelEl = document.getElementById('hero-cta-secondary-label');
  const stageEl = document.getElementById('hero-interactive-stage');

  let currentStage = 0;
  let autoTimer = null;
  const INTERVAL = 7200;

  // Anatomical Orbital Blink Canvas Engine (Exact 1376x768 coordinate lock, zero nose/cheek seam, 2-3 slow blinks per slide)
  const BLINK_STAGE_SPECS = [
    {
      url: 'assets/img/hero-eye-kid-blink.jpg?v=99.00',
      leftOrb: { cx: 762, cy: 332, rx: 78, ry: 54 },
      rightOrb: { cx: 1030, cy: 326, rx: 148, ry: 84 },
      lidTop: 245,
      lidBot: 412,
      curveBow: 18
    },
    {
      url: 'assets/img/hero-eye-teen-blink.jpg?v=99.00',
      leftOrb: { cx: 735, cy: 342, rx: 82, ry: 54 },
      rightOrb: { cx: 924, cy: 336, rx: 138, ry: 82 },
      lidTop: 255,
      lidBot: 420,
      curveBow: 18
    },
    {
      url: 'assets/img/hero-eye-adult-blink.jpg?v=99.00',
      leftOrb: { cx: 730, cy: 294, rx: 92, ry: 56 },
      rightOrb: { cx: 1002, cy: 288, rx: 152, ry: 86 },
      lidTop: 205,
      lidBot: 380,
      curveBow: 18
    },
    {
      url: 'assets/img/hero-eye-senior-blink.jpg?v=99.00',
      leftOrb: { cx: 752, cy: 306, rx: 80, ry: 54 },
      rightOrb: { cx: 1008, cy: 298, rx: 152, ry: 86 },
      lidTop: 215,
      lidBot: 392,
      curveBow: 18
    }
  ];

  const IMG_W = 1376;
  const IMG_H = 768;

  const blinkSlots = Array.from(slides).map((sl, i) => {
    const spec = BLINK_STAGE_SPECS[i];
    if (!spec) return null;

    const canvas = document.createElement('canvas');
    canvas.className = 'hero-eye-blink-layer absolute inset-0 size-full block pointer-events-none';
    canvas.style.opacity = '0';
    sl.appendChild(canvas);

    // Pre-build 1376x768 soft-feathered orbital closed-eye patch (only covers eyes + soft orbital rim; cheek/nose stays 100% open photo)
    const patch = document.createElement('canvas');
    patch.width = IMG_W;
    patch.height = IMG_H;
    const pctx = patch.getContext('2d');

    const img = new Image();
    img.src = spec.url;
    const slot = { spec, canvas, patch, img, ready: false, progress: 0, onReadyCallback: null };
    img.onload = () => {
      if (!pctx) return;
      pctx.clearRect(0, 0, IMG_W, IMG_H);
      pctx.drawImage(img, 0, 0, IMG_W, IMG_H);

      // Build soft elliptical double-eye alpha mask so outer face & nose bridge stay 100% original pixels
      const mask = document.createElement('canvas');
      mask.width = IMG_W;
      mask.height = IMG_H;
      const mctx = mask.getContext('2d');
      if (mctx) {
        [spec.leftOrb, spec.rightOrb].forEach((orb) => {
          mctx.save();
          mctx.translate(orb.cx, orb.cy);
          mctx.scale(orb.rx, orb.ry);
          const rg = mctx.createRadialGradient(0, 0, 0.38, 0, 0, 1);
          rg.addColorStop(0, 'rgba(0,0,0,1)');
          rg.addColorStop(0.68, 'rgba(0,0,0,0.92)');
          rg.addColorStop(0.86, 'rgba(0,0,0,0.38)');
          rg.addColorStop(1, 'rgba(0,0,0,0)');
          mctx.fillStyle = rg;
          mctx.beginPath();
          mctx.arc(0, 0, 1, 0, Math.PI * 2);
          mctx.fill();
          mctx.restore();
        });
        pctx.globalCompositeOperation = 'destination-in';
        pctx.drawImage(mask, 0, 0);
        pctx.globalCompositeOperation = 'source-over';
      }
      slot.ready = true;
      if (typeof slot.onReadyCallback === 'function') {
        const cb = slot.onReadyCallback;
        slot.onReadyCallback = null;
        cb();
      }
    };

    return slot;
  });

  // Reusable 1376x768 scratch buffer for downward curved eyelid sweep compositing
  const sweepBuf = document.createElement('canvas');
  sweepBuf.width = IMG_W;
  sweepBuf.height = IMG_H;
  const sctx = sweepBuf.getContext('2d');

  let blinkRaf = 0;
  let blinkTimers = [];
  let heroBlinkVisible = true;
  const reducedMotionBlink = typeof window.matchMedia === 'function'
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : { matches: false };

  function clearBlinkTimers() {
    blinkTimers.forEach((id) => clearTimeout(id));
    blinkTimers = [];
  }

  function resetBlinkLayers() {
    clearBlinkTimers();
    if (blinkRaf) {
      cancelAnimationFrame(blinkRaf);
      blinkRaf = 0;
    }
    blinkSlots.forEach((slot) => {
      if (!slot) return;
      slot.progress = 0;
      slot.canvas.style.opacity = '0';
    });
  }

  function drawOrbitalBlinkFrame(slot, closeProgress) {
    if (!slot || !slot.ready || !sctx) return;
    slot.progress = closeProgress;
    const { canvas, patch, spec } = slot;
    if (closeProgress <= 0.005) {
      canvas.style.opacity = '0';
      return;
    }

    const rect = canvas.getBoundingClientRect();
    const cw = Math.max(1, Math.round(rect.width || window.innerWidth));
    const ch = Math.max(1, Math.round(rect.height || window.innerHeight));
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const tw = Math.max(1, Math.round(cw * dpr));
    const th = Math.max(1, Math.round(ch * dpr));
    if (canvas.width !== tw || canvas.height !== th) {
      canvas.width = tw;
      canvas.height = th;
    }

    // Replicate CSS `bg-cover bg-[position:80%_48%] lg:bg-[position:82%_48%]` transform in image pixels
    const scale = Math.max(cw / IMG_W, ch / IMG_H);
    const drawW = IMG_W * scale;
    const drawH = IMG_H * scale;
    const posX = cw >= 1024 ? 0.82 : 0.80;
    const posY = 0.48;
    const ox = (cw - drawW) * posX;
    const oy = (ch - drawH) * posY;

    // Composite curved upper-eyelid descent wipe onto 1376x768 orbital buffer
    const lidY = spec.lidTop + closeProgress * (spec.lidBot - spec.lidTop);
    sctx.clearRect(0, 0, IMG_W, IMG_H);
    sctx.globalCompositeOperation = 'source-over';
    sctx.drawImage(patch, 0, 0);

    // Feathered curved eyelid clip from top down to lidY so upper lid pulls down smoothly
    const g = sctx.createLinearGradient(0, spec.lidTop - 16, 0, lidY + 18);
    g.addColorStop(0, 'rgba(0,0,0,1)');
    g.addColorStop(0.76, 'rgba(0,0,0,1)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    sctx.globalCompositeOperation = 'destination-in';
    sctx.fillStyle = g;
    sctx.fillRect(0, 0, IMG_W, lidY + 20);
    sctx.globalCompositeOperation = 'source-over';

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(sweepBuf, ox, oy, drawW, drawH);
    canvas.style.opacity = String(Math.min(1, closeProgress * 2.4));
  }

  function triggerEyeBlink(onComplete) {
    const stageAtStart = currentStage;
    const slot = blinkSlots[stageAtStart];
    if (!slot || reducedMotionBlink.matches || document.hidden || !heroBlinkVisible) return;
    if (!slot.ready) {
      slot.onReadyCallback = () => {
        if (currentStage === stageAtStart) triggerEyeBlink(onComplete);
      };
      return;
    }
    if (blinkRaf) cancelAnimationFrame(blinkRaf);

    const start = performance.now();
    const CLOSE_MS = 260;
    const HOLD_MS = 140;
    const OPEN_MS = 350;
    const TOTAL_MS = CLOSE_MS + HOLD_MS + OPEN_MS;

    function tick(now) {
      if (currentStage !== stageAtStart) {
        blinkRaf = 0;
        drawOrbitalBlinkFrame(slot, 0);
        return;
      }
      const elapsed = now - start;
      if (elapsed >= TOTAL_MS) {
        blinkRaf = 0;
        drawOrbitalBlinkFrame(slot, 0);
        if (typeof onComplete === 'function') onComplete();
        return;
      }
      let prog = 0;
      if (elapsed < CLOSE_MS) {
        const u = elapsed / CLOSE_MS;
        prog = u * u * (3 - 2 * u);
      } else if (elapsed < CLOSE_MS + HOLD_MS) {
        prog = 1;
      } else {
        const u = (elapsed - CLOSE_MS - HOLD_MS) / OPEN_MS;
        prog = 1 - u * u * (3 - 2 * u);
      }
      drawOrbitalBlinkFrame(slot, prog);
      blinkRaf = requestAnimationFrame(tick);
    }

    blinkRaf = requestAnimationFrame(tick);
  }

  function scheduleStageBlinkTrain(stageIdx) {
    clearBlinkTimers();
    if (reducedMotionBlink.matches) return;
    // Run 3 chained slow blinks on slides 0/2 and 2 chained slow blinks on slides 1/3 (~600ms relaxed open-eye pause between blinks)
    const targetBlinks = (stageIdx % 2 === 0) ? 3 : 2;
    let remaining = targetBlinks;

    const runStep = () => {
      if (currentStage !== stageIdx || remaining <= 0) return;
      remaining -= 1;
      triggerEyeBlink(() => {
        if (currentStage === stageIdx && remaining > 0) {
          const nextId = setTimeout(runStep, 600);
          blinkTimers.push(nextId);
        }
      });
    };

    const startId = setTimeout(runStep, 550);
    blinkTimers.push(startId);
  }

  const heroSectionEl = document.getElementById('hero');
  if (heroSectionEl && 'IntersectionObserver' in window) {
    const blinkIo = new IntersectionObserver((entries) => {
      heroBlinkVisible = entries.some((en) => en.isIntersecting);
      if (!heroBlinkVisible) resetBlinkLayers();
    }, { rootMargin: '100px 0px', threshold: 0.05 });
    blinkIo.observe(heroSectionEl);
  }

  function applySlideCopy(slideData, animate) {
    if (!slideData || !titleEl) return;

    const updateDOM = () => {
      if (eyebrowTextEl) eyebrowTextEl.textContent = slideData.eyebrow;
      if (ledeEl) ledeEl.textContent = slideData.lede;

      const lineEls = titleEl.querySelectorAll('.ih-h1-line');
      lineEls.forEach((el, idx) => {
        el.textContent = slideData.lines[idx] || '';
      });

      if (primaryBtn && slideData.primaryHref) {
        primaryBtn.setAttribute('href', slideData.primaryHref);
      }
      if (primaryLabelEl && slideData.primaryLabel) {
        primaryLabelEl.textContent = slideData.primaryLabel;
      }
      if (secondaryBtn && slideData.secondaryHref) {
        secondaryBtn.setAttribute('href', slideData.secondaryHref);
        if (slideData.secondaryExternal) {
          secondaryBtn.setAttribute('target', '_blank');
          secondaryBtn.setAttribute('rel', 'noopener noreferrer');
        } else {
          secondaryBtn.removeAttribute('target');
          secondaryBtn.removeAttribute('rel');
        }
      }
      if (secondaryLabelEl && slideData.secondaryLabel) {
        secondaryLabelEl.textContent = slideData.secondaryLabel;
      }

      if (typeof window.rebuildHeroLiquidTitle === 'function') {
        window.rebuildHeroLiquidTitle();
      }
    };

    if (!animate) {
      updateDOM();
      return;
    }

    const fadeTargets = [eyebrowWrapEl, titleEl, ledeEl, ctasEl].filter(Boolean);
    fadeTargets.forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(8px)';
    });

    setTimeout(() => {
      updateDOM();
      fadeTargets.forEach((el) => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
    }, 220);
  }

  function setStage(idx, animate = true) {
    const total = Math.min(slides.length, HERO_CAROUSEL_DATA.length);
    currentStage = (idx + total) % total;
    resetBlinkLayers();

    slides.forEach((sl, i) => {
      const isCurrent = (i === currentStage);
      if (isCurrent) {
        sl.classList.add('is-active');
        sl.style.opacity = '1';
        sl.style.visibility = 'visible';
        sl.style.zIndex = '2';
      } else {
        sl.classList.remove('is-active');
        sl.style.opacity = '0';
        sl.style.visibility = 'hidden';
        sl.style.zIndex = '1';
      }
    });

    applySlideCopy(HERO_CAROUSEL_DATA[currentStage], animate);
    scheduleStageBlinkTrain(currentStage);
  }

  function scheduleNext() {
    clearTimeout(autoTimer);
    autoTimer = setTimeout(() => {
      setStage(currentStage + 1, true);
      scheduleNext();
    }, INTERVAL);
  }

  // Horizontal drag / swipe support across the hero stage (zero visible UI chrome)
  if (stageEl) {
    let dragStartX = null;
    let dragStartY = null;

    stageEl.addEventListener('pointerdown', (e) => {
      if (e.target.closest('a, button, #hero-liquid-title-canvas')) return;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
    }, { passive: true });

    stageEl.addEventListener('pointerup', (e) => {
      if (dragStartX === null) return;
      const dx = e.clientX - dragStartX;
      const dy = e.clientY - dragStartY;
      dragStartX = null;
      dragStartY = null;
      if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.4) {
        setStage(dx < 0 ? currentStage + 1 : currentStage - 1, true);
        scheduleNext();
      }
    }, { passive: true });

    stageEl.addEventListener('pointercancel', () => {
      dragStartX = null;
      dragStartY = null;
    }, { passive: true });
  }

  window.__triggerHeroEyeBlink = () => triggerEyeBlink();
  setStage(0, false);
  scheduleNext();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHeroEyeLifespan);
} else {
  initHeroEyeLifespan();
}

// =========================================================================
// E. Live Interactive Wavefront Optic Engine (Continuous Kinetic Motion + Mouse Refraction)
// =========================================================================
function initIrisInteractiveCanvas() {
  const canvas = document.getElementById('hero-iris-interactive-canvas');
  if (!canvas || canvas.dataset.irisInit === '1') return;
  canvas.dataset.irisInit = '1';

  const ctx = canvas.getContext('2d');
  let w = 1, h = 1, dpr = 1;
  let mouseX = 0, mouseY = 0;
  let targetMouseX = 0, targetMouseY = 0;
  let isHovered = false;
  const ripples = [];
  let animId = 0;
  let irisVisible = true;
  let irisDocVisible = !document.hidden;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    w = Math.max(1, Math.floor(rect.width));
    h = Math.max(1, Math.floor(rect.height));
    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr;
      canvas.height = h * dpr;
    }
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    targetMouseX = e.clientX - rect.left;
    targetMouseY = e.clientY - rect.top;
    isHovered = true;
  });

  canvas.addEventListener('mouseleave', () => {
    isHovered = false;
  });

  canvas.addEventListener('click', () => {
    const baseCX = w > 1024 ? w * 0.69 : w * 0.71;
    const baseCY = h * 0.50;

    // Wavefront expanding pulse ring on click
    ripples.push({
      x: baseCX,
      y: baseCY,
      r: 25,
      maxR: Math.min(w, h) * 0.55,
      alpha: 1.0,
      isParticle: false
    });

    // Shimmering photon burst
    for (let i = 0; i < 24; i++) {
      const angle = (Math.PI * 2 * i) / 24;
      const speed = 1.6 + Math.random() * 2.6;
      ripples.push({
        x: baseCX,
        y: baseCY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2.0 + Math.random() * 2.0,
        alpha: 1.0,
        isParticle: true
      });
    }
  });

  let t = 0;

  function render() {
    t += 0.016;
    mouseX += (targetMouseX - mouseX) * 0.08;
    mouseY += (targetMouseY - mouseY) * 0.08;

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    // Pupil center position
    const baseCX = w > 1024 ? w * 0.69 : w * 0.71;
    const baseCY = h * 0.50;

    // 3D cursor parallax offset
    const parallaxX = isHovered ? (mouseX - baseCX) * 0.035 : Math.sin(t * 0.7) * 2.5;
    const parallaxY = isHovered ? (mouseY - baseCY) * 0.035 : Math.cos(t * 0.7) * 2.5;
    const cx = baseCX + parallaxX;
    const cy = baseCY + parallaxY;

    // Subtle living pupillary breathing
    const breath = Math.sin(t * 1.35) * 3.5;
    const pupilR = Math.max(38, Math.min(w, h) * 0.082 + breath);

    // 1. Central Optical Wavefront Aperture Glow
    const pupilGrad = ctx.createRadialGradient(cx, cy, pupilR * 0.2, cx, cy, pupilR * 1.35);
    pupilGrad.addColorStop(0, 'rgba(58, 160, 219, 0.28)');
    pupilGrad.addColorStop(0.65, 'rgba(58, 160, 219, 0.07)');
    pupilGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = pupilGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, pupilR * 1.35, 0, Math.PI * 2);
    ctx.fill();

    // 2. Interactive Corneal Specular Glint (Tracks mouse position seamlessly)
    const glintDist = pupilR * 0.44;
    const glintAngle = isHovered ? Math.atan2(mouseY - cy, mouseX - cx) : -Math.PI * 0.75 + Math.sin(t * 0.5) * 0.15;
    const gx = cx + Math.cos(glintAngle) * glintDist;
    const gy = cy + Math.sin(glintAngle) * glintDist;

    ctx.save();
    ctx.shadowColor = 'rgba(255, 255, 255, 0.95)';
    ctx.shadowBlur = 18;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.90)';
    ctx.beginPath();
    ctx.ellipse(gx, gy, 8, 4, glintAngle + Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();

    // Secondary specular droplet
    ctx.beginPath();
    ctx.arc(gx + Math.cos(glintAngle) * 9, gy + Math.sin(glintAngle) * 9, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 3. Floating Photon Energy Motes (Moving kinetic energy around optical zone)
    ctx.save();
    const numMotes = isHovered ? 14 : 8;
    for (let i = 0; i < numMotes; i++) {
      const moteAngle = t * 0.35 + (i * Math.PI * 2) / numMotes;
      const moteDist = pupilR * 1.2 + (i % 3) * 35 + Math.sin(t * 0.8 + i) * 8;
      const mx = cx + Math.cos(moteAngle) * moteDist;
      const my = cy + Math.sin(moteAngle) * moteDist;
      const mAlpha = 0.4 + 0.4 * Math.sin(t * 1.5 + i);

      ctx.fillStyle = `rgba(255, 255, 255, ${mAlpha})`;
      ctx.shadowColor = '#3aa0db';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(mx, my, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // 4. Active Wavefront Shockwave Ripples (From click interactions)
    for (let i = ripples.length - 1; i >= 0; i--) {
      const rp = ripples[i];
      if (rp.isParticle) {
        rp.x += rp.vx;
        rp.y += rp.vy;
        rp.alpha -= 0.02;
        if (rp.alpha <= 0) {
          ripples.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.fillStyle = `rgba(58, 160, 219, ${rp.alpha})`;
        ctx.shadowColor = '#3aa0db';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, rp.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      } else {
        rp.r += 4.5;
        rp.alpha -= 0.016;
        if (rp.alpha <= 0 || rp.r >= rp.maxR) {
          ripples.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.strokeStyle = `rgba(58, 160, 219, ${rp.alpha * 0.85})`;
        ctx.lineWidth = 2.5;
        ctx.shadowColor = '#3aa0db';
        ctx.shadowBlur = 14;
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
    }

    ctx.restore();
    if (irisVisible && irisDocVisible) animId = requestAnimationFrame(render);
  }

  const syncIrisLoop = () => {
    if (irisVisible && irisDocVisible) {
      if (!animId) animId = requestAnimationFrame(render);
    } else if (animId) {
      cancelAnimationFrame(animId);
      animId = 0;
    }
  };
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      irisVisible = entries.some((en) => en.isIntersecting);
      syncIrisLoop();
    }, { rootMargin: '160px 0px', threshold: 0.01 });
    io.observe(canvas.closest('section') || canvas.parentElement || canvas);
  }
  document.addEventListener('visibilitychange', () => {
    irisDocVisible = !document.hidden;
    syncIrisLoop();
  });
  syncIrisLoop();
}

initIrisInteractiveCanvas();

// =========================================================================
// CINEMATIC MOTION FOOTER: Magnetic Buttons & Back-to-Top Interaction
// =========================================================================
const footerBackToTop = document.getElementById('footer-back-to-top');
if (footerBackToTop) {
  footerBackToTop.addEventListener('click', (e) => {
    e.preventDefault();
    if (typeof window.__resetAllSubpagesExcept === 'function') {
      window.__resetAllSubpagesExcept(null);
    }
    if (typeof window.__unlockOuterPageScroll === 'function') {
      window.__unlockOuterPageScroll();
    }
    if (typeof window.__sweepPageTransitionCurtain === 'function') {
      window.__sweepPageTransitionCurtain();
    }
    if (typeof window.grailScrollTo === 'function') {
      window.grailScrollTo(0);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
}

// GSAP Cinematic Footer: parallax giant text, staggered reveal, magnetic pills, copy buttons
const footerWrap = document.getElementById('site-footer');
if (window.gsap && window.ScrollTrigger && footerWrap) {
  gsap.registerPlugin(ScrollTrigger);
  const giantText = footerWrap.querySelector('.footer-giant-bg-text');
  if (giantText) {
    gsap.fromTo(giantText, { y: '10vh', scale: 0.8, opacity: 0 }, {
      y: '0vh', scale: 1, opacity: 1, ease: 'power1.out',
      scrollTrigger: { trigger: footerWrap, start: 'top 80%', end: 'bottom bottom', scrub: 1 }
    });
  }
  const headingEl = footerWrap.querySelector('#footer-heading');
  if (headingEl) {
    gsap.fromTo(headingEl, { y: 16, opacity: 0.25 }, {
      y: 0, opacity: 1, ease: 'power3.out',
      scrollTrigger: { trigger: footerWrap, start: 'top 95%', end: 'bottom bottom', scrub: 1 }
    });
  }

  document.querySelectorAll('.magnetic-pill').forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      gsap.to(el, { x: x * 0.4, y: y * 0.4, rotationX: -y * 0.15, rotationY: x * 0.15, scale: 1.05, ease: 'power2.out', duration: 0.4 });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(el, { x: 0, y: 0, rotationX: 0, rotationY: 0, scale: 1, ease: 'elastic.out(1, 0.3)', duration: 1.2 });
    });
  });
}

document.querySelectorAll('[data-copy-text]').forEach((btn) => {
  btn.addEventListener('click', async () => {
    const val = btn.getAttribute('data-copy-text');
    if (!val || btn.disabled) return;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(val);
      }
      const iconCopy = btn.querySelector('[data-copy-icon]');
      const iconCheck = btn.querySelector('[data-check-icon]');
      btn.disabled = true;
      btn.setAttribute('aria-label', 'Copied');
      if (iconCopy) iconCopy.classList.add('opacity-0', 'scale-0');
      if (iconCheck) iconCheck.classList.remove('opacity-0', 'scale-0');
      setTimeout(() => {
        if (iconCopy) iconCopy.classList.remove('opacity-0', 'scale-0');
        if (iconCheck) iconCheck.classList.add('opacity-0', 'scale-0');
        btn.disabled = false;
        btn.setAttribute('aria-label', 'Copy to clipboard');
      }, 1500);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  });
});


// =========================================================================
// HERO LIQUID TEXT: WebGL2 Viscous Signed Distance Field Surface
// =========================================================================
function initHeroLiquidText() {
  const titleEl = document.getElementById('hero-title');
  const canvas = document.getElementById('hero-liquid-title-canvas');
  if (!titleEl || !canvas || canvas.dataset.liquidInit === '1') return;
  canvas.dataset.liquidInit = '1';

  let gl = null;
  try {
    gl = canvas.getContext('webgl2', {
      premultipliedAlpha: true,
      antialias: false,
      alpha: true
    });
  } catch (e) {
    gl = null;
  }
  if (!gl) {
    canvas.remove();
    return;
  }

  const MAX_TRAIL = 10;
  const INF = 1e20;

  const VERT = `#version 300 es
in vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }`;

  const FRAG = `#version 300 es
precision highp float;
uniform sampler2D uSdf;
uniform vec2 uSize;
uniform float uDpr;
uniform float uCanvasH;
uniform vec4 uBlob[${MAX_TRAIL}];
uniform vec2 uWarp[${MAX_TRAIL}];
uniform int uCount;
uniform float uSigma;
uniform float uBevel;
uniform vec3 uInk;
uniform vec3 uHi;
uniform vec4 uAccent;
uniform float uSpec;
uniform float uShade;
out vec4 outColor;

float smin(float a, float b, float k) {
  float h = max(k - abs(a - b), 0.0) / k;
  return min(a, b) - h * h * k * 0.25;
}

float glyph(vec2 p, float soft) {
  vec2 t = texture(uSdf, p / uSize).rg;
  return mix(t.r, t.g, soft);
}

float field(vec2 p, float soft, out float g0) {
  vec2 warp = vec2(0.0);
  float wsum = 0.0;
  for (int i = 0; i < ${MAX_TRAIL}; i++) {
    if (i >= uCount) break;
    vec2 d = p - uBlob[i].xy;
    float g = exp(-dot(d, d) / (uSigma * uSigma));
    warp += uWarp[i] * g;
    wsum += g;
  }
  warp /= max(1.0, wsum);
  float f = glyph(p - warp, soft);
  g0 = f;
  for (int i = 0; i < ${MAX_TRAIL}; i++) {
    if (i >= uCount) break;
    float r = uBlob[i].z;
    if (r < 0.05) continue;
    float b = length(p - uBlob[i].xy) - r;
    f = smin(f, b, r * 1.45);
  }
  return f;
}

void main() {
  vec2 p = vec2(gl_FragCoord.x, uCanvasH - gl_FragCoord.y) / uDpr;
  float g0;
  float f = field(p, 0.0, g0);
  float fw = max(fwidth(f), 1e-4);
  float alpha = clamp(0.5 - f / fw, 0.0, 1.0);
  if (alpha <= 0.0) { outColor = vec4(0.0); return; }

  float e = 1.0;
  float tmp;
  vec2 grad = vec2(
    field(p + vec2(e, 0.0), 1.0, tmp) - field(p - vec2(e, 0.0), 1.0, tmp),
    field(p + vec2(0.0, e), 1.0, tmp) - field(p - vec2(0.0, e), 1.0, tmp)
  ) / (2.0 * e);
  float fs = field(p, 1.0, tmp);
  float gl = length(grad);
  vec2 n2 = gl > 1e-4 ? grad / gl : vec2(0.0);

  float s = 1.0 - clamp(-min(fs, f + 0.5) / uBevel, 0.0, 1.0);
  s = pow(s, 1.6);
  vec3 N = normalize(vec3(n2 * s, sqrt(max(0.0, 1.0 - s * s))));
  vec3 L = normalize(vec3(-0.45, -0.7, 0.62));
  float diff = clamp(dot(N, L), 0.0, 1.0);
  vec3 H = normalize(L + vec3(0.0, 0.0, 1.0));
  float spec = pow(max(dot(N, H), 0.0), 48.0);

  vec3 col = uInk * mix(1.0 - uShade, 1.0, diff);
  float pulled = clamp((g0 - f) / (uBevel * 1.4), 0.0, 1.0);
  col = mix(col, uAccent.rgb, pulled * uAccent.a);
  col += uHi * spec * uSpec;
  outColor = vec4(col * alpha, alpha);
}`;

  function compile(type, src) {
    const sh = gl.createShader(type);
    if (!sh) return null;
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      gl.deleteShader(sh);
      return null;
    }
    return sh;
  }

  const vs = compile(gl.VERTEX_SHADER, VERT);
  const fs = compile(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return;

  const prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.bindAttribLocation(prog, 0, 'aPos');
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  const UNIFORMS = [
    'uSdf', 'uSize', 'uDpr', 'uCanvasH', 'uBlob', 'uWarp', 'uCount',
    'uSigma', 'uBevel', 'uInk', 'uHi', 'uAccent', 'uSpec', 'uShade'
  ];
  const u = {};
  for (const name of UNIFORMS) u[name] = gl.getUniformLocation(prog, name);

  function edt1d(grid, offset, stride, length, f, v, z) {
    v[0] = 0; z[0] = -INF; z[1] = INF; f[0] = grid[offset];
    for (let q = 1, k = 0, s = 0; q < length; q++) {
      f[q] = grid[offset + q * stride];
      const q2 = q * q;
      do {
        const r = v[k];
        s = (f[q] - f[r] + q2 - r * r) / (q - r) / 2;
      } while (s <= z[k] && --k > -1);
      k++; v[k] = q; z[k] = s; z[k + 1] = INF;
    }
    for (let q = 0, k = 0; q < length; q++) {
      while (z[k + 1] < q) k++;
      const r = v[k];
      grid[offset + q * stride] = f[r] + (q - r) * (q - r);
    }
  }

  function edt(grid, w, h, f, v, z) {
    for (let x = 0; x < w; x++) edt1d(grid, x, w, h, f, v, z);
    for (let y = 0; y < h; y++) edt1d(grid, y * w, 1, w, f, v, z);
  }

  function boxBlur(src, dst, len, lines, r, step, stride) {
    const span = 2 * r + 1;
    for (let line = 0; line < lines; line++) {
      const base = line * stride;
      let acc = 0;
      for (let k = -r; k <= r; k++)
        acc += src[base + Math.min(len - 1, Math.max(0, k)) * step];
      for (let i = 0; i < len; i++) {
        dst[base + i * step] = acc / span;
        const out = Math.max(0, i - r);
        const inn = Math.min(len - 1, i + r + 1);
        acc += src[base + inn * step] - src[base + out * step];
      }
    }
  }

  function sampleField(fld, x, y) {
    const fx = Math.min(fld.w - 1, Math.max(0, Math.round(x * fld.scale)));
    const fy = Math.min(fld.h - 1, Math.max(0, Math.round(y * fld.scale)));
    return fld.data[fy * fld.w + fx];
  }

  function nearestInside(fld, x, y, inset) {
    let px = x, py = y;
    for (let i = 0; i < 10; i++) {
      const d = sampleField(fld, px, py) + inset;
      if (Math.abs(d) < 0.5) break;
      const e = 1.5;
      const gx = (sampleField(fld, px + e, py) - sampleField(fld, px - e, py)) / (2 * e);
      const gy = (sampleField(fld, px, py + e) - sampleField(fld, px - e, py)) / (2 * e);
      const gl = Math.hypot(gx, gy) || 1;
      px -= (gx / gl) * d;
      py -= (gy / gl) * d;
    }
    return [px, py];
  }

  let field = null;
  let layout = null;
  let dpr = 1;

  const sim = {
    n: 8,
    x: new Float32Array(MAX_TRAIL),
    y: new Float32Array(MAX_TRAIL),
    vx: new Float32Array(MAX_TRAIL),
    vy: new Float32Array(MAX_TRAIL),
    mass: 0,
    massV: 0,
    load: 0.5,
    mode: 'idle',
    tx: 0,
    ty: 0,
    homeX: 0,
    homeY: 0,
    releaseT: 0,
    idleBlend: 1,
    clock: 0,
    seeded: false,
    anchorX: 0,
    anchorY: 0,
    tether: 0
  };

  const blobBuf = new Float32Array(MAX_TRAIL * 4);
  const warpBuf = new Float32Array(MAX_TRAIL * 2);

  function buildTitleField() {
    const rect = titleEl.getBoundingClientRect();
    const w = Math.max(10, Math.round(rect.width));
    const h = Math.max(10, Math.round(rect.height));
    const comp = window.getComputedStyle(titleEl);
    const fontFam = comp.fontFamily || '"Futura", "Futura PT", "Futura Medium", "Jost", "Century Gothic", ui-sans-serif, system-ui, sans-serif';
    const weight = comp.fontWeight || '600';
    const fontSize = parseFloat(comp.fontSize) || 48;
    const lines = Array.from(titleEl.querySelectorAll('.ih-h1-line'));
    if (!lines.length) return null;

    const lineMetrics = lines.map((lineEl) => {
      const lr = lineEl.getBoundingClientRect();
      return {
        text: lineEl.textContent.trim(),
        x: Math.max(0, lr.left - rect.left),
        y: (lr.top - rect.top) + (lr.height * 0.76),
        width: lr.width
      };
    });

    const scale = Math.min(1.25, 1800 / w);
    const texW = Math.max(2, Math.round(w * scale));
    const texH = Math.max(2, Math.round(h * scale));

    const off = document.createElement('canvas');
    off.width = texW;
    off.height = texH;
    const ctx = off.getContext('2d', { willReadFrequently: true });
    if (!ctx) return null;

    ctx.scale(scale, scale);
    ctx.font = `${weight} ${fontSize}px ${fontFam}`;
    if ('letterSpacing' in ctx) ctx.letterSpacing = '-0.025em';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#ffffff';

    lineMetrics.forEach((lm) => {
      if (lm.text) {
        ctx.fillText(lm.text, lm.x, lm.y, Math.max(40, w - lm.x));
      }
    });

    const img = ctx.getImageData(0, 0, texW, texH).data;
    const n = texW * texH;
    const outer = new Float64Array(n);
    const inner = new Float64Array(n);

    for (let i = 0; i < n; i++) {
      const a = img[i * 4 + 3] / 255;
      if (a >= 1) {
        outer[i] = 0; inner[i] = INF;
      } else if (a <= 0) {
        outer[i] = INF; inner[i] = 0;
      } else {
        const d = 0.5 - a;
        outer[i] = d > 0 ? d * d : 0;
        inner[i] = d < 0 ? d * d : 0;
      }
    }

    const len = Math.max(texW, texH);
    const f = new Float64Array(len);
    const v = new Uint32Array(len);
    const z = new Float64Array(len + 1);
    edt(outer, texW, texH, f, v, z);
    edt(inner, texW, texH, f, v, z);

    const data = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      data[i] = (Math.sqrt(outer[i]) - Math.sqrt(inner[i])) / scale;
    }

    const soft = Float32Array.from(data);
    const tmp = new Float32Array(n);
    const radius = Math.max(1, Math.round(fontSize * 0.035 * scale));
    for (let pass = 0; pass < 3; pass++) {
      boxBlur(soft, tmp, texW, texH, radius, 1, texW);
      boxBlur(tmp, soft, texH, texW, radius, texW, 1);
    }

    const packed = new Float32Array(n * 2);
    for (let i = 0; i < n; i++) {
      packed[i * 2] = data[i];
      packed[i * 2 + 1] = soft[i];
    }

    const maxLineW = lineMetrics.reduce((m, lm) => Math.max(m, lm.width), 0);
    const firstY = lineMetrics[0] ? lineMetrics[0].y : fontSize;
    const lastY = lineMetrics[lineMetrics.length - 1] ? lineMetrics[lineMetrics.length - 1].y : h;

    return {
      data, packed, w: texW, h: texH, scale,
      layout: {
        width: w,
        height: h,
        fontSize,
        textWidth: maxLineW,
        inkTop: Math.min(firstY - fontSize * 0.75, 0),
        inkBottom: lastY + fontSize * 0.25
      }
    };
  }

  function setupGL() {
    canvas.style.width = '';
    canvas.style.height = '';
    if (window.innerWidth < 1024) {
      field = null;
      layout = null;
      canvas.classList.add('opacity-0');
      titleEl.querySelectorAll('.ih-h1-line').forEach(el => el.classList.remove('opacity-0'));
      return;
    }
    const res = buildTitleField();
    if (!res) return;
    field = res;
    layout = res.layout;

    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(layout.width * dpr);
    canvas.height = Math.round(layout.height * dpr);
    canvas.style.width = layout.width + 'px';
    canvas.style.height = layout.height + 'px';

    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RG16F, field.w, field.h, 0, gl.RG, gl.FLOAT, field.packed);

    const [hx, hy] = nearestInside(field, layout.width * 0.4, layout.height * 0.35, layout.fontSize * 0.03);
    sim.homeX = hx;
    sim.homeY = hy;
    if (!sim.seeded) {
      for (let i = 0; i < MAX_TRAIL; i++) {
        sim.x[i] = hx;
        sim.y[i] = hy;
      }
      sim.seeded = true;
    }

    titleEl.querySelectorAll('.ih-h1-line').forEach(el => el.classList.add('opacity-0'));
    canvas.classList.remove('opacity-0');
  }

  window.rebuildHeroLiquidTitle = setupGL;

  function stepSim(dt) {
    if (!field || !layout) return;
    const n = sim.n;
    const visc = 0.55;
    let massTarget = 0;
    let gx = sim.tx, gy = sim.ty;

    if (sim.mode === 'pointer') {
      massTarget = 1.0;
    } else if (sim.mode === 'release') {
      sim.releaseT += dt;
      gx = sim.homeX; gy = sim.homeY;
      if (sim.releaseT > 2.0) {
        sim.mode = 'idle';
        sim.idleBlend = 0;
      }
    }
    if (sim.mode === 'idle') {
      sim.clock += dt;
      sim.idleBlend = Math.min(1, sim.idleBlend + dt / 2.0);
      const b = sim.idleBlend * sim.idleBlend * (3 - 2 * sim.idleBlend);
      const cx = layout.width * 0.45;
      const ax = layout.textWidth * 0.38;
      const ix = cx + ax * Math.sin(sim.clock * 0.45);
      const iy = layout.height * 0.35 + layout.fontSize * 0.15 * Math.sin(sim.clock * 0.9);
      gx = sim.homeX + (ix - sim.homeX) * b;
      gy = sim.homeY + (iy - sim.homeY) * b;
      massTarget = 0;
    }

    const k = 330 - 270 * visc;
    const c = 2 * 0.62 * Math.sqrt(k);
    const kf = k * 1.25;
    const cf = 2 * 0.48 * Math.sqrt(kf);
    const km = 70;
    const cm = 2 * 0.3 * Math.sqrt(km);

    const headD = sampleField(field, sim.x[0], sim.y[0]);
    if (sim.mode === 'pointer' || sim.mode === 'idle') {
      if (headD < 0) {
        sim.tether = Math.min(1, sim.tether + dt * 8);
        const [ax, ay] = nearestInside(field, sim.x[0], sim.y[0], layout.fontSize * 0.04);
        sim.anchorX = ax; sim.anchorY = ay;
      } else if (sim.tether > 0) {
        const stretch = Math.hypot(sim.x[0] - sim.anchorX, sim.y[0] - sim.anchorY);
        if (stretch > layout.fontSize * (0.42 + 0.4 * visc)) sim.tether = 0;
      }
    } else {
      sim.tether = Math.max(0, sim.tether - dt * 3);
    }

    const steps = Math.max(1, Math.ceil(dt / (1 / 120)));
    const h = dt / steps;
    for (let s = 0; s < steps; s++) {
      for (let i = 0; i < n; i++) {
        const tx = i === 0 ? gx : sim.x[i - 1];
        const ty = i === 0 ? gy : sim.y[i - 1];
        const kk = i === 0 ? k : kf;
        const cc = i === 0 ? c : cf;
        let fx = (tx - sim.x[i]) * kk;
        let fy = (ty - sim.y[i]) * kk;
        if (i > 0 && sim.tether > 0) {
          const w = sim.tether * Math.pow(i / (n - 1), 1.3) * 1.6;
          fx += (sim.anchorX - sim.x[i]) * kk * w;
          fy += (sim.anchorY - sim.y[i]) * kk * w;
        }
        sim.vx[i] += (fx - sim.vx[i] * cc) * h;
        sim.vy[i] += (fy - sim.vy[i] * cc) * h;
        sim.x[i] += sim.vx[i] * h;
        sim.y[i] += sim.vy[i] * h;
      }
      sim.massV += ((massTarget - sim.mass) * km - sim.massV * cm) * h;
      sim.mass += sim.massV * h;
    }

    const inside = sampleField(field, sim.x[0], sim.y[0]) < layout.fontSize * 0.02;
    sim.load = inside ? Math.min(1, sim.load + dt * 5) : Math.max(0.4, sim.load - dt * 0.35);
  }

  function draw() {
    if (!layout || !field || gl.isContextLost()) return;
    const R = layout.fontSize * 0.13;
    const n = sim.n;
    const visc = 0.55;
    const maxWarp = layout.fontSize * 0.05;
    const warpTime = 0.028 - visc * 0.01;
    const mass = Math.max(0, sim.mass);

    for (let i = 0; i < MAX_TRAIL; i++) {
      const taper = i === 0 ? 1 : 0.62 - 0.34 * (1 - 0.6 * sim.tether) * ((i - 1) / Math.max(1, n - 2));
      blobBuf[i * 4] = sim.x[i];
      blobBuf[i * 4 + 1] = sim.y[i];
      blobBuf[i * 4 + 2] = i < n ? R * mass * (0.45 + 0.55 * sim.load) * taper : 0;
      blobBuf[i * 4 + 3] = 0;

      let wx = sim.vx[i] * warpTime * Math.min(1, mass * 1.4);
      let wy = sim.vy[i] * warpTime * Math.min(1, mass * 1.4);
      const wl = Math.hypot(wx, wy);
      if (wl > maxWarp) {
        wx *= maxWarp / wl;
        wy *= maxWarp / wl;
      }
      warpBuf[i * 2] = wx;
      warpBuf[i * 2 + 1] = wy;
    }

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(prog);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, tex);

    gl.uniform1i(u.uSdf, 0);
    gl.uniform2f(u.uSize, layout.width, layout.height);
    gl.uniform1f(u.uDpr, dpr);
    gl.uniform1f(u.uCanvasH, canvas.height);
    gl.uniform4fv(u.uBlob, blobBuf);
    gl.uniform2fv(u.uWarp, warpBuf);
    gl.uniform1i(u.uCount, n);
    gl.uniform1f(u.uSigma, R * 1.8);
    gl.uniform1f(u.uBevel, Math.max(2, layout.fontSize * 0.085));

    // Same font color (#ffffff pure white) + Rayner Sky Blue (#3aa0db) liquid tension tint
    gl.uniform3f(u.uInk, 1.0, 1.0, 1.0);
    gl.uniform3f(u.uHi, 1.0, 1.0, 1.0);
    gl.uniform4f(u.uAccent, 0.23, 0.63, 0.86, 0.35); // #3aa0db
    gl.uniform1f(u.uSpec, 0.65);
    gl.uniform1f(u.uShade, 0.15);

    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  function onPointerMove(e) {
    if (!layout) return;
    const rect = canvas.getBoundingClientRect();
    const sx = layout.width / rect.width;
    const sy = layout.height / rect.height;
    sim.mode = 'pointer';
    sim.tx = Math.min(layout.width, Math.max(0, (e.clientX - rect.left) * sx));
    sim.ty = Math.min(layout.height, Math.max(0, (e.clientY - rect.top) * sy));
  }

  function onPointerLeave() {
    if (sim.mode !== 'pointer' || !field || !layout) return;
    const [hx, hy] = nearestInside(field, sim.x[0], sim.y[0], layout.fontSize * 0.03);
    sim.homeX = hx; sim.homeY = hy;
    sim.mode = 'release';
    sim.releaseT = 0;
  }

  canvas.addEventListener('pointermove', onPointerMove);
  canvas.addEventListener('pointerleave', onPointerLeave);
  canvas.addEventListener('pointerup', onPointerLeave);

  setupGL();

  let lastTime = performance.now();
  let heroLiquidVisible = true;
  let heroLiquidDocVisible = !document.hidden;
  let heroLiquidRafId = 0;

  function syncHeroLiquidLoop() {
    if (heroLiquidVisible && heroLiquidDocVisible) {
      if (!heroLiquidRafId) {
        lastTime = performance.now();
        heroLiquidRafId = requestAnimationFrame(loop);
      }
    } else if (heroLiquidRafId) {
      cancelAnimationFrame(heroLiquidRafId);
      heroLiquidRafId = 0;
    }
  }

  function loop(now) {
    heroLiquidRafId = 0;
    if (!heroLiquidVisible || !heroLiquidDocVisible) return;
    const dt = Math.min(0.05, (now - lastTime) / 1000);
    lastTime = now;
    stepSim(dt);
    draw();
    if (heroLiquidVisible && heroLiquidDocVisible) {
      heroLiquidRafId = requestAnimationFrame(loop);
    }
  }

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      heroLiquidVisible = entries.some((en) => en.isIntersecting);
      syncHeroLiquidLoop();
    }, { rootMargin: '160px 0px', threshold: 0.01 });
    io.observe(canvas.closest('section') || canvas.parentElement || canvas);
  }
  document.addEventListener('visibilitychange', () => {
    heroLiquidDocVisible = !document.hidden;
    syncHeroLiquidLoop();
  });
  syncHeroLiquidLoop();

  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(setupGL, 150);
  });
}

if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(initHeroLiquidText);
} else {
  setTimeout(initHeroLiquidText, 80);
}
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  setTimeout(initHeroLiquidText, 50);
} else {
  window.addEventListener('DOMContentLoaded', initHeroLiquidText);
  window.addEventListener('load', initHeroLiquidText);
}


/* ========================================================================= */
/* PIGMENT EXPERIENCE LEDGER (MediQ MedTech Palette Runtime Engine)          */
/* ========================================================================= */
function initPigmentExperienceLedger() {
  const list = document.getElementById('mediq-experience-ledger');
  if (!list) return;

  const rows = Array.from(list.querySelectorAll('.pel-row'));
  if (!rows.length) return;

  // MediQ MedTech Blue ramp: Core -> Body -> Edge
  const MEDIQ_RAMP = [
    [58, 160, 219], // Edge (Sky Blue #3aa0db)
    [27, 58, 107],  // Body (Royal Navy #1b3a6b)
    [10, 29, 64]    // Core (Deep MedTech Blue #0a1d40)
  ];

  function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }
  function smoothstep(a, b, x) {
    const t = clamp((x - a) / (b - a), 0, 1);
    return t * t * (3 - 2 * t);
  }
  function rampAt(edge, body, core, t) {
    const u = clamp(t, 0, 1);
    const a = u < 0.5 ? edge : body;
    const b = u < 0.5 ? body : core;
    const k = u < 0.5 ? u * 2 : (u - 0.5) * 2;
    return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
  }
  function hash2(x, y, seed) {
    let h = (Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263) + Math.imul(seed | 0, 2246822519)) | 0;
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  }
  function valueNoise(x, y, seed) {
    const ix = Math.floor(x);
    const iy = Math.floor(y);
    const fx = x - ix;
    const fy = y - iy;
    const sx = fx * fx * (3 - 2 * fx);
    const sy = fy * fy * (3 - 2 * fy);
    const a = hash2(ix, iy, seed);
    const b = hash2(ix + 1, iy, seed);
    const c = hash2(ix, iy + 1, seed);
    const d = hash2(ix + 1, iy + 1, seed);
    return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy;
  }

  const BLEED = 64;
  const BLEED_X = 40;
  const MAX_BUFFER_W = 600;

  function makeBlobs(seed) {
    const r = (i) => hash2(i, 7, seed);
    const out = [];
    for (let i = 0; i < 7; i++) {
      out.push({
        ox: -1 + (2 * i) / 6 + (r(i) - 0.5) * 0.22,
        oy: (r(i + 20) - 0.5) * 0.9,
        r: 0.72 + r(i + 40) * 0.36 - Math.abs(i - 3) * 0.05,
        w: 0.8 + r(i + 60) * 0.45 + (i === 3 ? 0.25 : 0),
        ph: r(i + 80) * 6.28,
        sp: 0.18 + r(i + 100) * 0.34
      });
    }
    return out;
  }

  const smears = rows.map((row, i) => {
    const canvas = row.querySelector('.pel-ink');
    return {
      row,
      canvas,
      ctx: null,
      img: null,
      noise: new Float32Array(0),
      hue: new Float32Array(0),
      low: new Float32Array(0),
      grain: new Float32Array(0),
      bw: 0,
      bh: 0,
      cssW: 0,
      cssH: 0,
      headH: 0,
      homeX: 0,
      homeY: 0,
      bleedX: BLEED_X,
      nameW: 0,
      reach: 0.55,
      dry: 0.05,
      dim: 1,
      dimTarget: i === 2 ? 1 : 0.4,
      nameTop: 0,
      nameH: 0,
      lastActive: performance.now(),
      level: i === 2 ? 0.9 : 0.2,
      target: i === 2 ? 1 : 0.3,
      cx: 0,
      cy: 0,
      tx: 0,
      ty: 0,
      pointer: false,
      blobs: makeBlobs(i * 7919 + 101),
      seed: i * 7919 + 101,
      painted: false
    };
  });

  function sizeSmear(s, w, h, headH) {
    s.cssW = w + s.bleedX * 2;
    s.cssH = h + BLEED * 2;
    s.headH = headH || h;
    if (!s.canvas) return;

    const scale = clamp(s.cssW / MAX_BUFFER_W, 1.5, 3);
    const bw = Math.max(8, Math.round(s.cssW / scale));
    const bh = Math.max(8, Math.round((s.cssH / s.cssW) * bw));

    s.canvas.style.left = -s.bleedX + 'px';
    s.canvas.style.width = 'calc(100% + ' + (s.bleedX * 2) + 'px)';

    if (bw === s.bw && bh === s.bh && s.img) return;
    s.bw = bw;
    s.bh = bh;
    s.canvas.width = bw;
    s.canvas.height = bh;
    s.ctx = s.canvas.getContext('2d');
    s.img = s.ctx ? s.ctx.createImageData(bw, bh) : null;

    const n = bw * bh;
    s.noise = new Float32Array(n);
    s.hue = new Float32Array(n);
    s.low = new Float32Array(n);
    s.grain = new Float32Array(n);
    const u = scale / 3;

    for (let y = 0; y < bh; y++) {
      for (let x = 0; x < bw; x++) {
        const idx = y * bw + x;
        const X = x * u;
        const Y = y * u;
        s.noise[idx] = 0.55 * valueNoise(X / 11, Y / 8, s.seed) + 0.3 * valueNoise(X / 4, Y / 4, s.seed + 11) + 0.15 * valueNoise(X / 1.6, Y / 1.6, s.seed + 17);
        s.hue[idx] = valueNoise((0.8 * X + 0.6 * Y) / 20, (0.8 * Y - 0.6 * X) / 20, s.seed + 31);
        s.low[idx] = valueNoise(X / 40, Y / 40, s.seed + 41);
        s.grain[idx] = hash2(x, y, s.seed + 23);
      }
    }
    s.painted = false;
  }

  function homeOf(s) {
    return [s.homeX ? s.bleedX + s.homeX : s.cssW * 0.6, BLEED + (s.homeY || s.headH * 0.5)];
  }

  function paintSmear(s, time, ramp, strength) {
    const ctx = s.ctx;
    const img = s.img;
    if (!ctx || !img || !ramp || ramp.length < 3) return;

    const data = img.data;
    data.fill(0);
    const level = s.level;

    if (level > 0.002) {
      const bw = s.bw;
      const bh = s.bh;
      const sc = s.cssW / bw;
      const grow = 1 - Math.pow(1 - clamp(level, 0, 1), 3);
      const narrow = s.cssW < 560;
      const span = clamp((s.nameW || s.cssW * 0.3) * s.reach, 60, 320) * (0.5 + 0.5 * grow);
      const R = clamp(s.headH * (narrow ? 0.95 : 1.12), 70, 200) * (0.55 + 0.45 * grow);
      const dry = s.dry;
      const fade = smoothstep(0, 0.35, level) * strength;
      const tooth = 0.76 + dry * 0.6;
      const [edge, body, core] = ramp;

      const n = s.blobs.length;
      const bx = new Float32Array(n);
      const by = new Float32Array(n);
      const br = new Float32Array(n);
      let x0 = bw, x1 = 0, y0 = bh, y1 = 0;
      const SQ = 1.65;

      for (let k = 0; k < n; k++) {
        const b = s.blobs[k];
        const px = s.cx + b.ox * span + Math.sin(time * b.sp + b.ph) * R * 0.12;
        const py = s.cy + b.oy * R * 0.4 + Math.cos(time * b.sp * 0.8 + b.ph) * R * 0.06;
        const rr = (b.r * R) / sc;
        bx[k] = px / sc;
        by[k] = py / sc;
        br[k] = rr * rr;
        x0 = Math.min(x0, bx[k] - rr);
        x1 = Math.max(x1, bx[k] + rr);
        y0 = Math.min(y0, by[k] - rr / SQ);
        y1 = Math.max(y1, by[k] + rr / SQ);
      }

      const xs = Math.max(0, Math.floor(x0));
      const xe = Math.min(bw - 1, Math.ceil(x1));
      const ys = Math.max(0, Math.floor(y0));
      const ye = Math.min(bh - 1, Math.ceil(y1));

      const bandTop = s.nameH ? s.nameTop - s.nameH * 0.3 : 0;
      const bandBottom = s.nameH ? s.nameTop + s.nameH * 1.02 : s.headH - 6;
      const top = (BLEED + Math.max(0, bandTop)) / sc;
      const bottom = (BLEED + bandBottom) / sc;
      const feather = Math.min(36, (bandBottom - bandTop) * 0.4) / sc;
      const side = Math.max(s.bleedX - 4, 28) / sc;

      for (let y = ys; y <= ye; y++) {
        const env = smoothstep(top, top + feather, y) * (1 - smoothstep(bottom - feather, bottom, y));
        if (env <= 0) continue;
        for (let x = xs; x <= xe; x++) {
          let f = 0;
          for (let k = 0; k < n; k++) {
            const dx = x - bx[k];
            const dy = (y - by[k]) * SQ;
            const d2 = dx * dx + dy * dy;
            if (d2 < br[k]) {
              const q = 1 - d2 / br[k];
              f += q * q * s.blobs[k].w;
            }
          }
          f *= env * smoothstep(0, side, x) * (1 - smoothstep(bw - 1 - side, bw - 1, x));
          if (f < 0.04) continue;

          const idx = y * bw + x;
          const fe = f * (1 - tooth / 2 + tooth * s.noise[idx]) + (s.low[idx] - 0.5) * 0.24;
          const wash = smoothstep(0.2, 0.34, fe);
          const rim = smoothstep(0.2, 0.3, fe) * (1 - smoothstep(0.3, 0.5, fe));
          const depth = clamp(smoothstep(0.3, 1.55, fe) + (s.hue[idx] - 0.5) * 0.6 + rim * (0.55 + dry * 0.4), 0, 1);
          const c = rampAt(edge, body, core, depth);
          const g = s.grain[idx];
          const shade = 1 - rim * (0.07 + dry * 0.2) + (g - 0.5) * 0.05;
          const a = (wash * (0.86 + 0.14 * depth) + rim * 0.1) * (0.9 + 0.1 * g * (1 + dry)) * fade;
          const j = idx * 4;

          data[j] = c[0] * shade;
          data[j + 1] = c[1] * shade;
          data[j + 2] = c[2] * shade;
          data[j + 3] = a > 1 ? 255 : a * 255;
        }
      }
    }
    ctx.putImageData(img, 0, 0);
    s.painted = level > 0.002;
  }

  function resizeAll() {
    smears.forEach((s) => {
      const li = s.row;
      const head = li.querySelector('.pel-trigger');
      const nameEl = li.querySelector('.pel-name');
      s.bleedX = clamp(Math.floor(li.getBoundingClientRect().left - list.getBoundingClientRect().left) - 4, 0, BLEED_X);
      sizeSmear(s, li.clientWidth, li.offsetHeight, head ? head.offsetHeight : li.offsetHeight);

      if (nameEl) {
        const lr = li.getBoundingClientRect();
        const nr = nameEl.getBoundingClientRect();
        s.homeX = nr.left - lr.left + nr.width / 2;
        s.nameTop = nr.top - lr.top;
        s.nameH = nr.height;
        s.homeY = s.nameTop + nr.height * 0.5;
        s.nameW = nr.width;
      }

      if (!s.pointer) {
        const [hx, hy] = homeOf(s);
        s.tx = hx;
        s.ty = hy;
        s.cx = hx;
        s.cy = hy;
      }
    });
  }

  resizeAll();
  window.addEventListener('resize', resizeAll, { passive: true });

  let raf = 0;
  let last = 0;
  let clock = 0;

  function tick(now) {
    raf = 0;
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 0.016;
    last = now;
    let moving = false;
    let breathing = false;

    smears.forEach((s) => {
      if (!s.ctx) return;
      const prevLevel = s.level;
      const prevX = s.cx;
      const prevY = s.cy;

      const tau = s.target > s.level ? 0.3 : 0.2;
      s.level += (s.target - s.level) * (1 - Math.exp(-dt / tau));
      if (Math.abs(s.target - s.level) < 0.002) s.level = s.target;

      s.dim += (s.dimTarget - s.dim) * (1 - Math.exp(-dt / 0.2));
      if (Math.abs(s.dimTarget - s.dim) < 0.002) s.dim = s.dimTarget;

      const k = 1 - Math.exp(-dt / 0.26);
      s.cx += (s.tx - s.cx) * k;
      s.cy += (s.ty - s.cy) * k;

      const changed = Math.abs(s.level - prevLevel) > 1e-4 || Math.abs(s.cx - prevX) > 0.05 || Math.abs(s.cy - prevY) > 0.05;
      if (changed) moving = true;

      const active = s.level > 0.002 || s.target > 0;
      const breathes = active && now - s.lastActive < 3000;
      if (breathes) breathing = true;

      if (active || s.painted) {
        paintSmear(s, clock, MEDIQ_RAMP, 0.9 * s.dim);
      }
    });

    if (breathing) clock += dt;
    if (moving || breathing) {
      raf = requestAnimationFrame(tick);
    } else {
      last = 0;
    }
  }

  function kick() {
    if (!raf) raf = requestAnimationFrame(tick);
  }

  // Interactive Hover & Move
  smears.forEach((s, idx) => {
    const li = s.row;
    const trigger = li.querySelector('.pel-trigger');

    li.addEventListener('pointerenter', (e) => {
      if (e.pointerType === 'touch') return;
      s.target = 1;
      s.dimTarget = 1;
      s.lastActive = performance.now();
      li.setAttribute('data-lit', 'true');
      kick();
    });

    li.addEventListener('pointermove', (e) => {
      if (e.pointerType === 'touch') return;
      const r = li.getBoundingClientRect();
      const hx = homeOf(s)[0];
      const w = s.nameW || s.cssW * 0.3;
      s.tx = clamp(hx + (e.clientX - r.left + s.bleedX - hx) * 0.35, hx - w * 0.18, hx + w * 0.12);
      s.lastActive = performance.now();
      const y0 = s.nameH ? s.nameTop + s.nameH * 0.3 : s.headH * 0.35;
      const y1 = s.nameH ? s.nameTop + s.nameH * 0.7 : s.headH * 0.7;
      s.ty = BLEED + clamp(e.clientY - r.top, y0, y1);
      s.pointer = true;
      kick();
    });

    li.addEventListener('pointerleave', () => {
      s.pointer = false;
      const [hx, hy] = homeOf(s);
      s.tx = hx;
      s.ty = hy;
      const isOpen = li.getAttribute('data-open') === 'true';
      s.target = isOpen ? 1 : 0.25;
      s.dimTarget = isOpen ? 1 : 0.4;
      li.setAttribute('data-lit', isOpen ? 'true' : 'false');
      kick();
    });

    // Click to toggle
    if (trigger) {
      trigger.addEventListener('click', () => {
        togglePelRow(idx);
      });
    }
  });

  function togglePelRow(targetIdx) {
    smears.forEach((s, i) => {
      const li = s.row;
      const trigger = li.querySelector('.pel-trigger');
      const panel = li.querySelector('.pel-panel');
      const isCurrent = i === targetIdx;
      const wasOpen = li.getAttribute('data-open') === 'true';

      let willOpen = false;
      if (isCurrent) {
        willOpen = !wasOpen;
      } else {
        willOpen = false;
      }

      li.setAttribute('data-open', willOpen ? 'true' : 'false');
      li.setAttribute('data-lit', willOpen ? 'true' : 'false');
      if (trigger) trigger.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
      if (panel) panel.setAttribute('aria-hidden', willOpen ? 'false' : 'true');

      s.target = willOpen ? 1 : 0.25;
      s.dimTarget = willOpen ? 1 : 0.35;
      s.lastActive = performance.now();
      const [hx, hy] = homeOf(s);
      s.tx = hx;
      s.ty = hy;
    });

    setTimeout(resizeAll, 350);
    kick();
  }

  // Connect desktop header dropdown items (Company Overview, Mission, Management, Quality & Compliance)
  document.querySelectorAll('[data-open-pel]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const pelIdx = parseInt(link.getAttribute('data-open-pel') || '0', 10);
      togglePelRow(pelIdx);

      // Smooth scroll to #about
      const aboutSec = document.getElementById('about');
      if (aboutSec) {
        aboutSec.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  kick();
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPigmentExperienceLedger);
} else {
  initPigmentExperienceLedger();
}


/* ========================================================================= */
/* ANIMATED DROPDOWN MENUS (MediQ Brand Palette Gliding Pill)               */
/* ========================================================================= */
function initAnimatedDropdownMenus() {
  const menus = document.querySelectorAll('.anim-dropdown-menu');
  menus.forEach((menu) => {
    const pill = menu.querySelector('.anim-menu-pill');
    const items = menu.querySelectorAll('.anim-menu-item');
    if (!pill || !items.length) return;

    items.forEach((item) => {
      item.addEventListener('mouseenter', () => {
        const top = item.offsetTop;
        const h = item.offsetHeight;
        pill.style.top = top + 'px';
        pill.style.height = h + 'px';
        pill.style.opacity = '1';
        pill.style.transform = 'scale(1)';
      });
    });

    menu.addEventListener('mouseleave', () => {
      pill.style.opacity = '0';
      pill.style.transform = 'scale(0.85)';
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAnimatedDropdownMenus);
} else {
  initAnimatedDropdownMenus();
}


/* ========================================================================= */
/* ABOUT MEDIQ LANDING + UNIFIED SCROLLABLE SUBPAGE CONTROLLER               */
/* ========================================================================= */
function initAboutDeckController() {
  const aboutSec = document.getElementById('about');
  const slides = document.querySelectorAll('.about-slide');
  const subScroll = document.getElementById('about-subpage-scroll');
  const wavesCanvas = document.getElementById('about-waves-shader-canvas');
  const subnavPills = document.querySelectorAll('.abt-subnav-pill');
  const prevBtn = document.getElementById('about-deck-prev');
  const nextBtn = document.getElementById('about-deck-next');
  const goNextBtns = document.querySelectorAll('.about-go-next');

  if (!slides.length) return;

  let currentIndex = 0;
  let activeSubpageIdx = 1;
  let lockTimer = null;
  let refreshSubpageShowcases = () => {};

  const SECTION_MAP = {
    1: 'about-sec-who-we-are',
    2: 'about-slide-what-we-do',
    3: 'about-sec-foundation',
    4: 'about-sec-values'
  };

  const subpagePanels = subScroll
    ? Array.from(subScroll.querySelectorAll('.abt-subpage-panel'))
    : [];

  function setActiveSubnavPill(sectionId) {
    subnavPills.forEach((pill) => {
      const isMatch = pill.getAttribute('data-about-jump') === sectionId;
      pill.classList.toggle('is-active', isMatch);
    });
  }

  let lastGoToIdx = null;
  let lastGoToTime = 0;

  function showIsolatedSubpage(targetIdx, dir = 1) {
    const subIdx = Math.min(4, Math.max(1, targetIdx));
    activeSubpageIdx = subIdx;
    window.__aboutActiveSubpageIdx = subIdx;

    const secId = SECTION_MAP[subIdx] || 'about-sec-who-we-are';
    setActiveSubnavPill(secId);

    // Isolate ONLY the active sub-page so scrolling never reveals another sub-page
    let activePanel = null;
    subpagePanels.forEach((panel) => {
      const isTarget = panel.id === secId;
      panel.classList.toggle('is-hidden-subpage', !isTarget);
      if (isTarget) activePanel = panel;
    });

    if (subScroll) {
      subScroll.scrollTo({ top: 0, behavior: 'instant' });
      refreshSubpageShowcases(subIdx);
      requestAnimationFrame(() => {
        subScroll.scrollTo({ top: 0, behavior: 'instant' });
        refreshSubpageShowcases(subIdx);
      });
    }

    if (activePanel && typeof window.__playSubpage3DEntrance === 'function') {
      window.__playSubpage3DEntrance(activePanel, dir);
    }
  }

  function unlockOuterPage() {
    document.querySelectorAll('.mediq-subpage-active-host').forEach((el) => el.classList.remove('mediq-subpage-active-host'));
    document.documentElement.classList.remove('mediq-subpage-locked');
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    document.documentElement.style.scrollSnapType = '';
  }

  function lockOuterPage() {
    if (window.__aboutDeckCurrentIndex > 0) {
      document.querySelectorAll('.mediq-subpage-active-host').forEach((el) => el.classList.remove('mediq-subpage-active-host'));
      if (aboutSec) aboutSec.classList.add('mediq-subpage-active-host');
      document.documentElement.classList.add('mediq-subpage-locked');
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      document.documentElement.style.scrollSnapType = 'none';
    }
  }

  function goToSlide(idx, opts = {}) {
    const requestedIdx = Number.isFinite(idx) ? idx : 0;
    const now = performance.now();
    if (requestedIdx >= 1) {
      window.__lastExplicitSubpageOpenTime = now;
    }
    if (!opts.silentReset && lastGoToIdx === requestedIdx && (now - lastGoToTime) < 50) {
      return;
    }
    lastGoToIdx = requestedIdx;
    lastGoToTime = now;

    const prevSubIdx = currentIndex > 0 ? activeSubpageIdx : 0;
    const activeSlideIdx = requestedIdx <= 0 ? 0 : 1;

    currentIndex = activeSlideIdx;
    window.__aboutDeckCurrentIndex = activeSlideIdx;

    slides.forEach((slide, i) => {
      slide.classList.remove(
        'opacity-100', 'pointer-events-auto', 'translate-x-0', 'z-10',
        'opacity-0', 'pointer-events-none', '-translate-x-12', 'translate-x-12', 'z-0'
      );
      if (i === activeSlideIdx) {
        slide.classList.add('opacity-100', 'pointer-events-auto', 'translate-x-0', 'z-10');
      } else if (i < activeSlideIdx) {
        slide.classList.add('opacity-0', 'pointer-events-none', '-translate-x-12', 'z-0');
      } else {
        slide.classList.add('opacity-0', 'pointer-events-none', 'translate-x-12', 'z-0');
      }
    });

    if (wavesCanvas) {
      wavesCanvas.style.opacity = activeSlideIdx === 0 ? '0.62' : '0.55';
    }

    clearTimeout(lockTimer);
    if (activeSlideIdx === 1) {
      const dir = (prevSubIdx > 0 && requestedIdx < prevSubIdx) ? -1 : 1;
      showIsolatedSubpage(requestedIdx, dir);
      if (aboutSec) {
        aboutSec.querySelectorAll('video[data-forge-img], video[data-wwd-forge-img]').forEach((v) => {
          v.muted = true;
          if (v.paused) v.play().catch(() => {});
        });
      }
      if (false && typeof window !== 'undefined' && false) {
        window.scrollTo({ top: sec.offsetTop, behavior: 'auto' });
      }
      if (typeof window.__engageSubpageLock === 'function') {
        window.__engageSubpageLock('about', aboutSec);
      } else {
        lockOuterPage();
      }
    } else {
      activeSubpageIdx = 1;
      window.__aboutActiveSubpageIdx = 1;
      if (!opts.silentReset) {
        if (typeof window.__unlockOuterPageScroll === 'function') {
          window.__unlockOuterPageScroll();
        } else {
          unlockOuterPage();
        }
      }
    }
  }

  // Drive Forge Automotive (01/03) & What We Do (01/06) pinned scroll showcases inside the isolated active sub-page
  if (subScroll) {
    const forgeBlock = document.getElementById('about-vision-mission-block');
    const forgeNumEl = document.getElementById('forge-abt-num');
    const forgeCatEl = document.getElementById('forge-abt-cat');
    const forgeFrameCatEl = document.getElementById('forge-abt-frame-cat');
    const forgeSlEl = document.getElementById('forge-abt-sl');
    const forgeSvEl = document.getElementById('forge-abt-sv');
    const forgeBgs = aboutSec ? Array.from(aboutSec.querySelectorAll('[data-forge-bg]')) : [];
    const forgeWraps = aboutSec ? Array.from(aboutSec.querySelectorAll('[data-forge-img-wrap]')) : [];
    const forgeImgs = aboutSec ? Array.from(aboutSec.querySelectorAll('[data-forge-img]')) : [];
    const forgePanels = aboutSec ? Array.from(aboutSec.querySelectorAll('[data-forge-panel]')) : [];
    const forgeDots = aboutSec ? Array.from(aboutSec.querySelectorAll('[data-forge-dot]')) : [];

    const FORGE_ABT_META = [
      { cat: 'WHO WE ARE', sl: 'Operating scope', sv: 'Philippine Healthcare' },
      { cat: 'OUR MISSION', sl: 'Core role', sv: 'Distribution & Support' },
      { cat: 'OUR VISION', sl: 'Strategic ambition', sv: 'Trusted Solutions Partner' }
    ];

    function updateForgeAboutShowcase() {
      if (!forgeBlock || !subScroll) return;
      const blockTop = forgeBlock.offsetTop;
      const scrollRange = Math.max(1, forgeBlock.offsetHeight - subScroll.clientHeight);
      const rawP = Math.min(1, Math.max(0, (subScroll.scrollTop - blockTop) / scrollRange));
      const stageP = rawP * 2; // 0.0 -> 1.0 -> 2.0 across the 3 stages

      // Continuous clip-path curtain wipe + kinematic zoom with full-reveal plateau so no top sliver remains
      const t1 = Math.min(1, Math.max(0, stageP / 0.85));
      const t2 = Math.min(1, Math.max(0, (stageP - 1) / 0.85));

      if (forgeImgs[0]) {
        forgeImgs[0].style.transform = `scale(${(1.06 - t1 * 0.06).toFixed(4)})`;
      }
      if (forgeWraps[1] && forgeImgs[1]) {
        forgeWraps[1].style.clipPath = `inset(${((1 - t1) * 100).toFixed(2)}% 0 0 0)`;
        forgeImgs[1].style.transform = `scale(${(1.16 - t1 * 0.16).toFixed(4)})`;
      }
      if (forgeWraps[2] && forgeImgs[2]) {
        forgeWraps[2].style.clipPath = `inset(${((1 - t2) * 100).toFixed(2)}% 0 0 0)`;
        forgeImgs[2].style.transform = `scale(${(1.16 - t2 * 0.16).toFixed(4)})`;
      }

      // Active stage index (0 = Who We Are, 1 = Our Mission, 2 = Our Vision)
      const activeStage = stageP < 0.5 ? 0 : (stageP < 1.5 ? 1 : 2);
      window.__forgeAbtActiveStage = activeStage;
      const activeVid = forgeImgs[activeStage];
      if (activeVid && activeVid.tagName === 'VIDEO' && activeVid.paused) {
        activeVid.muted = true;
        activeVid.play().catch(() => {});
      }
      if (forgeNumEl) {
        forgeNumEl.textContent = `0${activeStage + 1}`;
      }
      const abtMeta = FORGE_ABT_META[activeStage] || FORGE_ABT_META[0];
      if (forgeCatEl) forgeCatEl.textContent = abtMeta.cat;
      if (forgeFrameCatEl) forgeFrameCatEl.textContent = abtMeta.cat;
      if (forgeSlEl) forgeSlEl.textContent = abtMeta.sl;
      if (forgeSvEl) forgeSvEl.textContent = abtMeta.sv;

      forgeBgs.forEach((bg, idx) => {
        bg.style.opacity = idx === activeStage ? '1' : '0';
      });

      forgePanels.forEach((panel, idx) => {
        panel.classList.remove('is-active', 'is-above', 'is-below');
        if (idx === activeStage) {
          panel.classList.add('is-active');
        } else if (idx < activeStage) {
          panel.classList.add('is-above');
        } else {
          panel.classList.add('is-below');
        }
      });

      forgeDots.forEach((dot, idx) => {
        if (idx === activeStage) {
          dot.className = 'h-1.5 w-7 rounded-full bg-[#72c5f8] transition-all duration-300 cursor-pointer';
        } else {
          dot.className = 'h-1.5 w-2.5 rounded-full bg-white/25 hover:bg-white/50 transition-all duration-300 cursor-pointer';
        }
      });
    }

    window.jumpForgeAboutStage = function(stageIdx) {
      if (!forgeBlock || !subScroll) return;
      const blockTop = forgeBlock.offsetTop;
      const scrollRange = Math.max(1, forgeBlock.offsetHeight - subScroll.clientHeight);
      const frac = stageIdx === 0 ? 0 : (stageIdx === 1 ? 0.50 : 1.0);
      subScroll.scrollTo({
        top: Math.max(0, blockTop + scrollRange * frac),
        behavior: 'smooth'
      });
    };

    // Forge Automotive Services (01 / 06) Pinned Scroll-Scrub Showcase inside #about-slide-what-we-do
    const wwdSec = document.getElementById('about-slide-what-we-do');
    const wwdForgeBlock = document.getElementById('wwd-forge-services-block');
    const wwdForgeNumEl = document.getElementById('wwd-forge-num');
    const wwdForgeCatEl = document.getElementById('wwd-forge-cat');
    const wwdForgeFrameCatEl = document.getElementById('wwd-forge-frame-cat');
    const wwdForgeSlEl = document.getElementById('wwd-forge-sl');
    const wwdForgeSvEl = document.getElementById('wwd-forge-sv');
    const wwdForgeBgs = aboutSec ? Array.from(aboutSec.querySelectorAll('[data-wwd-forge-bg]')) : [];
    const wwdForgeWraps = aboutSec ? Array.from(aboutSec.querySelectorAll('[data-wwd-forge-wrap]')) : [];
    const wwdForgeImgs = aboutSec ? Array.from(aboutSec.querySelectorAll('[data-wwd-forge-img]')) : [];
    const wwdForgePanels = aboutSec ? Array.from(aboutSec.querySelectorAll('[data-wwd-forge-panel]')) : [];
    const wwdForgeDots = aboutSec ? Array.from(aboutSec.querySelectorAll('[data-wwd-forge-dot]')) : [];
    const wwdServiceRows = aboutSec ? Array.from(aboutSec.querySelectorAll('[data-wwd-row]')) : [];

    const WWD_FORGE_META = [
      { cat: 'SUPPLY CHAIN', sl: 'Distribution scope', sv: 'Authorized Supply' },
      { cat: 'PRODUCT MARKETING', sl: 'Promotion standard', sv: 'Evidence-based' },
      { cat: 'COMMERCIALIZATION', sl: 'Commercial scope', sv: 'Institutional & Field' },
      { cat: 'QUALITY & SUPPORT', sl: 'Operating standard', sv: 'Verified SOPs' },
      { cat: 'PROFESSIONAL EDUCATION', sl: 'Learning scope', sv: 'Approved Content' },
      { cat: 'RELATIONSHIPS & CONTINUITY', sl: 'Post-delivery care', sv: 'Responsive Support' }
    ];

    function getWwdForgeBlockTop() {
      if (!wwdForgeBlock) return 0;
      return (wwdSec ? wwdSec.offsetTop : 0) + wwdForgeBlock.offsetTop;
    }

    function updateWwdForgeServicesShowcase() {
      if (!wwdForgeBlock || !subScroll) return;
      const blockTop = getWwdForgeBlockTop();
      const scrollRange = Math.max(1, wwdForgeBlock.offsetHeight - subScroll.clientHeight);
      const rawP = Math.min(1, Math.max(0, (subScroll.scrollTop - blockTop) / scrollRange));
      const stageP = rawP * 5; // 0.0 -> 5.0 across the 6 capability stages

      // Layer 0 base scale
      if (wwdForgeImgs[0]) {
        const t0 = Math.min(1, Math.max(0, stageP));
        wwdForgeImgs[0].style.transform = `scale(${(1.06 - t0 * 0.06).toFixed(4)})`;
      }

      // Layers 1..5 continuous bottom-up clip-path curtain wipe + kinematic zoom with full-reveal plateau
      for (let k = 1; k < 6; k++) {
        const tk = Math.min(1, Math.max(0, (stageP - (k - 1)) / 0.85));
        const wrapEl = wwdForgeWraps[k];
        const imgEl = wwdForgeImgs[k];
        if (wrapEl && imgEl) {
          wrapEl.style.clipPath = `inset(${((1 - tk) * 100).toFixed(2)}% 0 0 0)`;
          imgEl.style.transform = `scale(${(1.16 - tk * 0.16).toFixed(4)})`;
        }
      }

      const activeStage = Math.min(5, Math.max(0, Math.round(stageP)));
      window.__wwdForgeActiveStage = activeStage;
      const activeWwdVid = wwdForgeImgs[activeStage];
      if (activeWwdVid && activeWwdVid.tagName === 'VIDEO' && activeWwdVid.paused) {
        activeWwdVid.muted = true;
        activeWwdVid.play().catch(() => {});
      }

      if (wwdForgeNumEl) wwdForgeNumEl.textContent = `0${activeStage + 1}`;
      const meta = WWD_FORGE_META[activeStage] || WWD_FORGE_META[0];
      if (wwdForgeCatEl) wwdForgeCatEl.textContent = meta.cat;
      if (wwdForgeFrameCatEl) wwdForgeFrameCatEl.textContent = meta.cat;
      if (wwdForgeSlEl) wwdForgeSlEl.textContent = meta.sl;
      if (wwdForgeSvEl) wwdForgeSvEl.textContent = meta.sv;

      wwdForgeBgs.forEach((bg, idx) => {
        bg.style.opacity = idx === activeStage ? '1' : '0';
      });

      wwdForgePanels.forEach((panel, idx) => {
        panel.classList.remove('is-active', 'is-above', 'is-below');
        if (idx === activeStage) {
          panel.classList.add('is-active');
        } else if (idx < activeStage) {
          panel.classList.add('is-above');
        } else {
          panel.classList.add('is-below');
        }
      });

      wwdForgeDots.forEach((dot, idx) => {
        if (idx === activeStage) {
          dot.className = 'h-1.5 w-7 rounded-full bg-[#72c5f8] transition-all duration-300 cursor-pointer';
        } else {
          dot.className = 'h-1.5 w-2.5 rounded-full bg-white/25 hover:bg-white/50 transition-all duration-300 cursor-pointer';
        }
      });

      wwdServiceRows.forEach((row, idx) => {
        row.classList.toggle('is-active', idx === activeStage);
      });
    }

    window.jumpWwdForgeStage = function(stageIdx) {
      if (!wwdForgeBlock || !subScroll) return;
      const blockTop = getWwdForgeBlockTop();
      const scrollRange = Math.max(1, wwdForgeBlock.offsetHeight - subScroll.clientHeight);
      const frac = Math.min(1, Math.max(0, stageIdx / 5));
      subScroll.scrollTo({
        top: Math.max(0, blockTop + scrollRange * frac),
        behavior: 'smooth'
      });
    };

    refreshSubpageShowcases = (subIdx) => {
      if (subIdx === 1) updateForgeAboutShowcase();
      else if (subIdx === 2) updateWwdForgeServicesShowcase();
    };

    subScroll.addEventListener('scroll', () => {
      if (activeSubpageIdx === 1) {
        updateForgeAboutShowcase();
      } else if (activeSubpageIdx === 2) {
        updateWwdForgeServicesShowcase();
      }
    }, { passive: true });

    updateForgeAboutShowcase();
    updateWwdForgeServicesShowcase();
  }

  if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentIndex === 0 ? 0 : Math.max(1, activeSubpageIdx - 1)));
  if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentIndex === 0 ? 1 : Math.min(4, activeSubpageIdx + 1)));
  goNextBtns.forEach((btn) => btn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); goToSlide(1); }));

  // Link navbar dropdown items & subpage overview buttons
  document.querySelectorAll('[data-open-pel], [data-pillar-idx], [data-slide-target]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const target = link.getAttribute('data-slide-target');
      let targetSlide = 0;
      if (target !== null && target !== undefined) {
        targetSlide = parseInt(target, 10);
      } else {
        const idx = parseInt(link.getAttribute('data-pillar-idx') || link.getAttribute('data-open-pel') || '0', 10);
        targetSlide = (idx === 0 || idx === 1) ? 1 : (idx === 2 ? 2 : 3);
      }
      e.preventDefault();
      if (targetSlide >= 1) {
        goToSlide(targetSlide);
      } else {
        if (typeof window.__resetAllSubpagesExcept === 'function') {
          window.__resetAllSubpagesExcept(null);
        }
        goToSlide(0);
        if (aboutSec) {
          if (typeof window.grailScrollTo === 'function') {
            window.grailScrollTo(aboutSec);
          } else {
            aboutSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      }
    });
  });

  const navAbout = document.getElementById('nav-about');
  if (navAbout) {
    navAbout.addEventListener('click', (e) => {
      e.preventDefault();
      if (typeof window.__resetAllSubpagesExcept === 'function') {
        window.__resetAllSubpagesExcept(null);
      }
      goToSlide(0);
      if (aboutSec) {
        if (typeof window.grailScrollTo === 'function') {
          window.grailScrollTo(aboutSec);
        } else {
          aboutSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  }

  window.goToAboutSlide = goToSlide;

  // Initialize first slide (Landing Purpose view)
  goToSlide(0, { silentReset: true });
}

/* ========================================================================= */
/* ABOUT MEDIQ SCROLL-DRIVEN STACKING CAPABILITY CARDS WITH SCALE PHYSICS     */
/* ========================================================================= */
function initAboutStackingCards() {
  const slide = document.getElementById('about-slide-what-we-do');
  if (!slide) return;
  const scrollContainer = document.getElementById('about-stacking-scroll-viewport') || slide;
  const cardItems = scrollContainer.querySelectorAll('.stacking-card-item');
  if (!cardItems.length) return;

  function updateCardScales() {
    const containerRect = scrollContainer.getBoundingClientRect();
    const totalCards = cardItems.length;

    cardItems.forEach((item, index) => {
      const inner = item.querySelector('.stacking-card-inner');
      if (!inner) return;

      // Calculate covered progress by observing subsequent cards scrolling over this card
      let coveredProgress = 0;
      for (let nextIdx = index + 1; nextIdx < totalCards; nextIdx++) {
        const nextItem = cardItems[nextIdx];
        const nextRect = nextItem.getBoundingClientRect();
        const nextTop = nextRect.top - containerRect.top;
        const targetNextTop = 10 + nextIdx * 12;

        const dist = nextTop - targetNextTop;
        if (dist < 260) {
          const factor = Math.max(0, Math.min(1, (260 - dist) / 260));
          coveredProgress = Math.max(coveredProgress, factor * (nextIdx - index));
        }
      }

      // Smooth scale and brightness dimming as cards stack underneath
      const targetScale = Math.max(0.88, 1 - coveredProgress * 0.026);
      const targetBrightness = Math.max(0.65, 1 - coveredProgress * 0.09);

      inner.style.transform = "scale(" + targetScale.toFixed(3) + ")";
      inner.style.filter = "brightness(" + targetBrightness.toFixed(2) + ")";
    });
  }

  window.__updateStackingCardPhysics = updateCardScales;

  scrollContainer.addEventListener('scroll', updateCardScales, { passive: true });
  window.addEventListener('resize', updateCardScales, { passive: true });
  setTimeout(updateCardScales, 200);
}

/* ========================================================================= */
/* OUR ESTABLISHED FOUNDATION — MEDIQ × RAYNER PARTNERSHIP CONVERGENCE STAGE */
/* ========================================================================= */
function initFoundationPartnershipStage() {
  const sec = document.getElementById('about-sec-foundation');
  const stage = document.getElementById('fnd-partner-stage');
  const parts = document.getElementById('fnd-parts');
  const hlL = document.getElementById('fnd-hlL');
  const hlR = document.getElementById('fnd-hlR');
  const lens = document.getElementById('fnd-lens');
  const glow = document.getElementById('fnd-glow');
  const iL = document.getElementById('fnd-iL');
  const iR = document.getElementById('fnd-iR');
  const iK = document.getElementById('fnd-iK');

  if (!sec || !stage || !parts || !hlL || !hlR || !lens || !glow || !iL || !iR || !iK) return;
  if (stage.dataset.partnerInitialized === '1') return;
  stage.dataset.partnerInitialized = '1';

  const S = (a, b, x) => {
    x = Math.min(1, Math.max(0, (x - a) / (b - a)));
    return x * x * (3 - 2 * x);
  };
  const LOOP = 13000;
  const CL = Array.from(sec.querySelectorAll('.fnd-cl'));
  const CR = Array.from(sec.querySelectorAll('.fnd-cr'));
  const P = [];

  for (let i = 0; i < 22; i++) {
    const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    c.setAttribute('fill', '#8fd0ff');
    parts.appendChild(c);
    P.push({
      c,
      a: Math.random() * 6.28,
      r: 1 + Math.random() * 0.18,
      s: (Math.random() * 0.0004 + 0.00012) * (Math.random() < 0.5 ? -1 : 1),
      z: Math.random() * 1.6 + 0.7,
      p: Math.random() * 6.28
    });
  }

  function frame(t, still) {
    const p = still ? 0.6 : (t % LOOP) / LOOP;
    let m;
    if (p < 0.18) m = 0;
    else if (p < 0.45) m = S(0.18, 0.45, p);
    else if (p < 0.78) m = 1;
    else m = 1 - S(0.78, 0.97, p);

    const cx = 450;
    const y = 272 + Math.sin(t / 1700) * 5;
    const d = 208 - 180 * m;
    const xL = cx - d;
    const xR = cx + d;

    for (let i = 0; i < CL.length; i++) {
      const c = CL[i];
      c.setAttribute('cx', xL + (+c.dataset.dx || 0));
      c.setAttribute('cy', y);
    }
    for (let i = 0; i < CR.length; i++) {
      const c = CR[i];
      c.setAttribute('cx', xR + (+c.dataset.dx || 0));
      c.setAttribute('cy', y);
    }

    hlL.setAttribute('transform', `rotate(${t / 55} ${xL} ${y})`);
    hlR.setAttribute('transform', `rotate(${-t / 65 + 120} ${xR} ${y})`);
    lens.style.opacity = S(0.05, 0.5, m) * (0.85 + 0.15 * Math.sin(t / 900));

    glow.setAttribute('cx', cx);
    glow.setAttribute('cy', y);
    glow.setAttribute('rx', 375 - 95 * m);
    glow.setAttribute('ry', 235 + 25 * m);
    glow.setAttribute('opacity', 0.08 + 0.10 * m);

    const fo = 1 - S(0.35, 0.75, m);
    const wL = 385;
    const hL = wL * 267 / 900;
    const wR = 340;
    const hR = wR * 134 / 560;
    const wK = 415;
    const hK = wK * 584 / 1000;

    iL.setAttribute('width', wL);
    iL.setAttribute('height', hL);
    iL.setAttribute('x', xL - wL / 2);
    iL.setAttribute('y', y - hL / 2);
    iL.style.opacity = fo;

    iR.setAttribute('width', wR);
    iR.setAttribute('height', hR);
    iR.setAttribute('x', xR - wR / 2);
    iR.setAttribute('y', y - hR / 2);
    iR.style.opacity = fo;

    iK.setAttribute('width', wK);
    iK.setAttribute('height', hK);
    iK.setAttribute('x', cx - wK / 2);
    iK.setAttribute('y', y - hK / 2);
    iK.style.opacity = S(0.6, 1, m);

    for (let i = 0; i < P.length; i++) {
      const q = P[i];
      q.a += q.s * 16;
      const rr = q.r + Math.sin(t / 2000 + q.p) * 0.03;
      q.c.setAttribute('cx', cx + Math.cos(q.a) * rr * 425);
      q.c.setAttribute('cy', 272 + Math.sin(q.a) * rr * 250);
      q.c.setAttribute('r', q.z);
      q.c.setAttribute('opacity', 0.06 + 0.14 * Math.pow(Math.sin(t / 900 + q.p), 2));
    }
  }

  frame(7800, true);
  parts.innerHTML = '';
  stage.style.transform = '';
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initAboutDeckController();
    initAboutStackingCards();
    initFoundationPartnershipStage();
  });
} else {
  initAboutDeckController();
  initAboutStackingCards();
  initFoundationPartnershipStage();
}

/* ========================================================================= */
/* INTRAOCULAR LENSES 3D SCROLL-DRIVEN STAGE CHOREOGRAPHY (6 INNOVATIONS)     */
/* ========================================================================= */
function initIOLScrollStageController() {
  const scrollContainer = document.getElementById('iol-scroll-container');
  if (!scrollContainer) return;

  const scenes = [
    document.getElementById('iol-scene-0'),
    document.getElementById('iol-scene-1'),
    document.getElementById('iol-scene-2'),
    document.getElementById('iol-scene-3'),
    document.getElementById('iol-scene-4'),
    document.getElementById('iol-scene-5')
  ];
  const contents = [
    document.getElementById('iol-content-0'),
    document.getElementById('iol-content-1'),
    document.getElementById('iol-content-2'),
    document.getElementById('iol-content-3'),
    document.getElementById('iol-content-4'),
    document.getElementById('iol-content-5')
  ];
  const fills = [
    document.getElementById('iol-fill-0'),
    document.getElementById('iol-fill-1'),
    document.getElementById('iol-fill-2'),
    document.getElementById('iol-fill-3'),
    document.getElementById('iol-fill-4'),
    document.getElementById('iol-fill-5')
  ];
  const railTabs = document.querySelectorAll('.sv-rail__item');
  const badgeText = document.getElementById('iol-stage-badge-text');

  const STAGE_NAMES = [
    'STAGE 01 • RAYONE® EMV',
    'STAGE 02 • RAYONE® EMV TORIC',
    'STAGE 03 • RAYONE® TRIFOCAL',
    'STAGE 04 • RAYONE® TRIFOCAL TORIC',
    'STAGE 05 • RAYONE® ASPHERIC',
    'STAGE 06 • SULCOFLEX® ASPHERIC'
  ];

  const mobileImg = document.getElementById('iol-mobile-packshot');
  const mobileTitle = document.getElementById('iol-mobile-title');
  const mobileSub = document.getElementById('iol-mobile-sub');
  const mobileDesc = document.getElementById('iol-mobile-desc');

  const MOBILE_DATA = [
    {
      img: 'assets/img/packshots/authentic_emv.png?v=366.00',
      titleHtml: 'RayOne<sup class="sv-title-reg">&reg;</sup> <span style="color:#e11d74">EMV</span>',
      sub: 'Co-developed with Prof. Graham Barrett',
      desc: 'Non-diffractive extended depth of field IOL providing seamless intermediate and functional near vision without dysphotopsia.'
    },
    {
      img: 'assets/img/packshots/authentic_emv_toric.png?v=366.00',
      titleHtml: 'RayOne<sup class="sv-title-reg">&reg;</sup> <span style="color:#eb5a28">EMV Toric</span>',
      sub: 'Extended Depth of Focus • Precision Astigmatism Correction',
      desc: 'Combines patented positive spherical aberration EDOF optics with rotatably stable closed-loop toric haptics.'
    },
    {
      img: 'assets/img/packshots/authentic_trifocal.png?v=366.00',
      titleHtml: 'RayOne<sup class="sv-title-reg">&reg;</sup> <span style="color:#3ca6bf">Trifocal</span>',
      sub: 'Halved diffractive rings for maximum light transmission',
      desc: 'Patented 16-ring design delivers crystal clarity at distance, intermediate, and near with 89% light transmitted to retina.'
    },
    {
      img: 'assets/img/packshots/authentic_trifocal_toric.png?v=366.00',
      titleHtml: 'RayOne<sup class="sv-title-reg">&reg;</sup> <span style="color:#3b82f6">Trifocal Toric</span>',
      sub: 'True spectacle independence across all distances with astigmatism correction',
      desc: 'Seamless trifocal diffractive optics engineered directly onto Rayner rotatably stable anti-vaulting closed-loop toric haptics.'
    },
    {
      img: 'assets/img/packshots/authentic_aspheric.png?v=366.00',
      titleHtml: 'RayOne<sup class="sv-title-reg">&reg;</sup> <span style="color:#7c286c">Aspheric</span>',
      sub: 'Aberration-neutral monofocal precision',
      desc: 'Zero spherical aberration design provides pristine contrast sensitivity regardless of corneal shape or previous refractive surgery.'
    },
    {
      img: 'assets/img/packshots/authentic_sulcoflex.png?v=366.00',
      titleHtml: 'Sulcoflex<sup class="sv-title-reg">&reg;</sup> <span style="color:#7c286c">Aspheric</span>',
      sub: 'Pseudophakic supplementary sulcus platform',
      desc: 'Reversible optical refinement for residual refractive errors with undulating rounded haptics protecting delicate sulcus tissues.'
    }
  ];

  // 6 Zones covering 0.0 to 1.0 smoothly
  const ZONES = [
    { hold: [0, 0.12], exit: [0.12, 0.18], enter: null },
    { hold: [0.18, 0.30], exit: [0.30, 0.36], enter: [0.12, 0.18] },
    { hold: [0.36, 0.48], exit: [0.48, 0.54], enter: [0.30, 0.36] },
    { hold: [0.54, 0.66], exit: [0.66, 0.72], enter: [0.48, 0.54] },
    { hold: [0.72, 0.84], exit: [0.84, 0.90], enter: [0.66, 0.72] },
    { hold: [0.90, 1.00], exit: null, enter: [0.84, 0.90] }
  ];

  function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
  }

  // Exact zandrellez getTransform mathematics (80vh distance opposing translation)
  function getTransform(progress, column, incoming) {
    const distance = 80; // vh
    let y = 0;
    if (!incoming) {
      y = column === 'left' ? progress * -distance : progress * distance;
    } else {
      y = column === 'left' ? (1 - progress) * distance : (progress - 1) * distance;
    }
    const opacity = incoming ? clamp(progress * 1.8, 0, 1) : clamp(1 - progress * 1.8, 0, 1);
    const scale = incoming ? 0.94 + opacity * 0.06 : 1 - progress * 0.06;
    return {
      transform: `translate3d(0, ${y.toFixed(2)}vh, 0) scale(${scale.toFixed(3)})`,
      opacity: opacity
    };
  }

  function getStyle(globalProgress, index, column) {
    const zone = ZONES[index];
    const { hold, enter, exit } = zone;
    const distance = 80;

    if (globalProgress >= hold[0] && globalProgress <= hold[1]) {
      return { opacity: 1, transform: "translate3d(0,0,0) scale(1)" };
    }
    if (enter && globalProgress >= enter[0] && globalProgress <= enter[1]) {
      const t = (globalProgress - enter[0]) / (enter[1] - enter[0]);
      return getTransform(t, column, true);
    }
    if (exit && globalProgress >= exit[0] && globalProgress <= exit[1]) {
      const t = (globalProgress - exit[0]) / (exit[1] - exit[0]);
      return getTransform(t, column, false);
    }

    const isBefore = globalProgress < (enter ? enter[0] : hold[0]);
    const y = isBefore ? (column === "left" ? distance : -distance) : (column === "left" ? -distance : distance);
    return {
      opacity: 0,
      transform: `translate3d(0, ${y}vh, 0) scale(0.94)`
    };
  }

  function updateScroll() {
    const maxScroll = scrollContainer.scrollHeight - scrollContainer.clientHeight;
    if (maxScroll <= 0) return;
    const globalProgress = clamp(scrollContainer.scrollTop / maxScroll, 0, 1);

    // Update all 6 stages with exact opposing translation
    for (let i = 0; i < 6; i++) {
      const sceneEl = scenes[i];
      const contentEl = contents[i];
      if (!sceneEl || !contentEl) continue;

      // Alternating columns:
      // Even index (0, 2, 4): Scene is Left, Content is Right
      // Odd index (1, 3, 5): Scene is Right, Content is Left
      const sceneCol = (i % 2 === 1) ? 'right' : 'left';
      const contentCol = (i % 2 === 1) ? 'left' : 'right';

      const sStyle = getStyle(globalProgress, i, sceneCol);
      const cStyle = getStyle(globalProgress, i, contentCol);

      sceneEl.style.transform = sStyle.transform;
      sceneEl.style.opacity = sStyle.opacity.toFixed(3);
      sceneEl.style.pointerEvents = sStyle.opacity > 0.08 ? 'auto' : 'none';

      contentEl.style.transform = cStyle.transform;
      contentEl.style.opacity = cStyle.opacity.toFixed(3);
      contentEl.style.pointerEvents = cStyle.opacity > 0.08 ? 'auto' : 'none';
    }

    // Determine active stage across 6 stages
    let activeStage = 0;
    if (globalProgress < 0.15) activeStage = 0;
    else if (globalProgress < 0.33) activeStage = 1;
    else if (globalProgress < 0.51) activeStage = 2;
    else if (globalProgress < 0.69) activeStage = 3;
    else if (globalProgress < 0.87) activeStage = 4;
    else activeStage = 5;

    // Highlight active stage badge
    if (badgeText) {
      badgeText.textContent = STAGE_NAMES[activeStage];
    }

    // Update mobile content
    if (mobileImg && MOBILE_DATA[activeStage]) {
      mobileImg.src = MOBILE_DATA[activeStage].img;
      mobileTitle.innerHTML = MOBILE_DATA[activeStage].titleHtml;
      mobileSub.textContent = MOBILE_DATA[activeStage].sub;
      mobileDesc.textContent = MOBILE_DATA[activeStage].desc;
    }

    // Update progress rail fills & current aria attribute
    railTabs.forEach((tab, idx) => {
      tab.setAttribute('aria-current', idx === activeStage ? 'true' : 'false');
    });

    // Update each fill bar
    for (let i = 0; i < 6; i++) {
      if (!fills[i]) continue;
      const zone = ZONES[i];
      let p = 0;
      if (globalProgress < (zone.enter ? zone.enter[0] : zone.hold[0])) {
        p = 0;
      } else if (globalProgress <= zone.hold[1]) {
        if (zone.enter && globalProgress <= zone.enter[1]) {
          p = (globalProgress - zone.enter[0]) / (zone.enter[1] - zone.enter[0]);
        } else {
          p = 1;
        }
      } else {
        p = 1;
      }
      fills[i].style.transform = `scaleX(${clamp(p, 0, 1).toFixed(3)})`;
    }
  }

  scrollContainer.addEventListener('scroll', updateScroll, { passive: true });
  window.__updateIOLScroll = updateScroll;
  setTimeout(updateScroll, 100);

  window.jumpIolStage = function (stageIdx) {
    const maxScroll = scrollContainer.scrollHeight - scrollContainer.clientHeight;
    let target = maxScroll * (stageIdx / 5);
    scrollContainer.scrollTo({ top: target, behavior: 'smooth' });
  };
}

const IOL_BOX_VIEW_ANGLES = {
  front: { rx: 6, ry: -24 },
  side:  { rx: 2, ry: -82 },
  back:  { rx: -3, ry: -158 }
};

function getIolSceneBaseAngles(scene) {
  const view = (scene && scene.getAttribute('data-view')) || 'front';
  if (scene && typeof scene._customRy === 'number' && view === 'custom') {
    return { rx: scene._customRx || 4, ry: scene._customRy };
  }
  return IOL_BOX_VIEW_ANGLES[view] || IOL_BOX_VIEW_ANGLES.front;
}

window.setIolBoxView = function (btn, view) {
  const scene = btn.closest('.sv-scene');
  if (!scene) return;
  const box = scene.querySelector('.sv-box3d');
  if (!box) return;

  scene.setAttribute('data-view', view);
  delete scene._customRx;
  delete scene._customRy;

  const buttons = scene.querySelectorAll('.sv-box-btn');
  buttons.forEach((b) => {
    b.setAttribute('aria-pressed', b.getAttribute('data-view') === view ? 'true' : 'false');
  });

  box.classList.remove('is-interacting');
  if (view === 'spin') {
    box.classList.add('is-spinning');
    box.style.transform = '';
  } else {
    box.classList.remove('is-spinning');
    const base = IOL_BOX_VIEW_ANGLES[view] || IOL_BOX_VIEW_ANGLES.front;
    box.style.transform = `rotateX(${base.rx}deg) rotateY(${base.ry}deg)`;
  }
};

window.startIolBoxDrag = function (e, stage) {
  const scene = stage.closest('.sv-scene');
  if (!scene) return;
  const box = scene.querySelector('.sv-box3d');
  if (!box) return;

  const base = getIolSceneBaseAngles(scene);
  scene._isDragging = true;
  scene._dragStartX = e.clientX;
  scene._dragStartY = e.clientY;
  scene._startRx = base.rx;
  scene._startRy = base.ry;

  box.classList.remove('is-spinning');
  box.classList.add('is-interacting');

  const onMove = (ev) => {
    if (!scene._isDragging) return;
    const dx = ev.clientX - scene._dragStartX;
    const dy = ev.clientY - scene._dragStartY;
    const rx = Math.max(-35, Math.min(35, scene._startRx - dy * 0.25));
    const ry = scene._startRy + dx * 0.55;
    scene._customRx = rx;
    scene._customRy = ry;
    scene.setAttribute('data-view', 'custom');
    box.style.transform = `rotateX(${rx.toFixed(1)}deg) rotateY(${ry.toFixed(1)}deg)`;
  };

  const onUp = () => {
    scene._isDragging = false;
    box.classList.remove('is-interacting');
    window.removeEventListener('pointermove', onMove);
    window.removeEventListener('pointerup', onUp);
  };

  window.addEventListener('pointermove', onMove);
  window.addEventListener('pointerup', onUp);
};

window.handleIolTilt = function (e, scene) {
  if (!scene || scene._isDragging) return;
  const view = scene.getAttribute('data-view') || 'front';
  if (view === 'spin') return;

  const box = scene.querySelector('.sv-box3d');
  if (!box) return;

  const rect = scene.getBoundingClientRect();
  const nx = (e.clientX - rect.left) / rect.width - 0.5;
  const ny = (e.clientY - rect.top) / rect.height - 0.5;
  const base = getIolSceneBaseAngles(scene);

  const rx = base.rx - ny * 10;
  const ry = base.ry + nx * 14;
  box.style.transform = `rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
};

window.resetIolTilt = function (scene) {
  if (!scene || scene._isDragging) return;
  const view = scene.getAttribute('data-view') || 'front';
  if (view === 'spin') return;

  const box = scene.querySelector('.sv-box3d');
  if (!box) return;
  const base = getIolSceneBaseAngles(scene);
  box.style.transform = `rotateX(${base.rx}deg) rotateY(${base.ry}deg)`;
};

window.toggleIolAcc = function (btn) {
  const row = btn.closest('.sv-row');
  if (!row) return;
  const isOpen = row.getAttribute('data-open') === 'true';
  const siblings = row.parentElement.querySelectorAll('.sv-row');
  siblings.forEach((s) => s.setAttribute('data-open', 'false'));
  if (!isOpen) {
    row.setAttribute('data-open', 'true');
  }
};

/* ========================================================================= */
/* PRODUCTS IN-PAGE 5-SLIDE DECK CONTROLLER (With Dedicated Page Scroll Lock)*/
/* ========================================================================= */
/* ========================================================================= */
/* PRODUCTS TWO-LAYER SMOKE CANVAS (Puff + Tendril — Matches Editorial Spec) */
/* ========================================================================= */
function initProductsSmokeCanvas() {
  const canvas = document.getElementById('products-smoke-canvas');
  if (canvas) canvas.style.display = 'none';
  return;
}
function _disabledProductsSmokeCanvas() {
  const canvas = document.getElementById('products-smoke-canvas');
  if (!canvas || canvas._smokeActive) return;
  canvas._smokeActive = true;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let w = window.innerWidth;
  let h = window.innerHeight;
  let dpr = 0.5;
  let t = 0;

  function resize() {
    dpr = 0.5;
    w = canvas.parentElement ? canvas.parentElement.clientWidth || window.innerWidth : window.innerWidth;
    h = canvas.parentElement ? canvas.parentElement.clientHeight || window.innerHeight : window.innerHeight;
    canvas.width = Math.max(1, Math.round(w * dpr));
    canvas.height = Math.max(1, Math.round(h * dpr));
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });
  window.__resizeProductsSmoke = resize;

  const PALETTE = [
    [218, 229, 240],
    [230, 236, 242],
    [206, 222, 236],
    [238, 236, 230],
    [194, 214, 232]
  ];
  const rand = (min, max) => min + Math.random() * (max - min);
  const pickColor = () => PALETTE[Math.floor(Math.random() * PALETTE.length)];

  class Puff {
    constructor(initial = false) { this.reset(initial); }
    reset(initial = false) {
      this.r = rand(180, 420);
      this.x = rand(-this.r * 0.35, w + this.r * 0.35);
      this.y = initial ? rand(-this.r * 0.2, h + this.r * 0.4) : h + this.r * rand(0.2, 0.75);
      this.vx = rand(-0.18, 0.18);
      this.vy = -rand(0.16, 0.42);
      this.life = 0;
      this.maxLife = Math.floor(rand(600, 1400));
      if (initial) this.life = Math.floor(rand(0, this.maxLife));
      this.maxOpacity = rand(0.06, 0.16);
      const [r, g, b] = pickColor();
      this.sprite = window.__getMediqSmokeSprite(r, g, b);
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.life++;
      if (this.life >= this.maxLife || this.y < -this.r * 1.15) this.reset(false);
    }
    draw(c) {
      const p = Math.min(1, this.life / this.maxLife);
      const alpha = this.maxOpacity * Math.sin(p * Math.PI);
      if (alpha <= 0.002) return;
      c.globalAlpha = alpha;
      c.drawImage(this.sprite, this.x - this.r, this.y - this.r, this.r * 2, this.r * 2);
    }
  }

  class Tendril {
    constructor(initial = false) { this.reset(initial); }
    reset(initial = false) {
      this.nodeCount = Math.floor(rand(16, 26));
      this.baseX = rand(w * 0.05, w * 0.95);
      this.spacing = rand(18, 28);
      const chainH = this.nodeCount * this.spacing;
      this.baseY = initial ? rand(h * 0.15, h + chainH * 0.8) : rand(h * 0.45, h + chainH * 0.9);
      this.vx = rand(-0.08, 0.08);
      this.vy = -rand(0.32, 0.70);
      this.swayFreq = rand(0.015, 0.032);
      this.swayOffset = rand(0, Math.PI * 2);
      this.sway = rand(22, 48);
      this.life = 0;
      this.maxLife = Math.floor(rand(320, 700));
      if (initial) this.life = Math.floor(rand(0, this.maxLife));
      this.maxOpacity = rand(0.07, 0.22);
      this.baseRadius = rand(56, 88);
      this.tipRadius = rand(26, 42);
      const [r, g, b] = pickColor();
      this.sprite = window.__getMediqSmokeSprite(r, g, b);
    }
    update() {
      this.baseX += this.vx;
      this.baseY += this.vy;
      this.life++;
      if (this.life >= this.maxLife || this.baseY < -this.nodeCount * this.spacing * 1.1) this.reset(false);
    }
    draw(c, timeCounter) {
      const p = Math.min(1, this.life / this.maxLife);
      let lifeEnv = p < 0.22 ? p / 0.22 : (p > 0.72 ? Math.max(0, (1 - p) / 0.28) : 1);
      if (lifeEnv <= 0.002) return;
      for (let i = 0; i < this.nodeCount; i++) {
        const frac = i / (this.nodeCount - 1);
        const alpha = this.maxOpacity * lifeEnv * Math.sin(frac * Math.PI) * 0.55;
        if (alpha <= 0.002) continue;
        const r = this.baseRadius * (1 - frac) + this.tipRadius * frac;
        const dx = Math.sin(timeCounter * this.swayFreq + this.swayOffset + i * 0.35) * this.sway * (0.4 + frac * 1.4);
        const nx = this.baseX + dx;
        const ny = this.baseY - i * this.spacing;
        c.globalAlpha = alpha;
        c.drawImage(this.sprite, nx - r, ny - r, r * 2, r * 2);
      }
    }
  }

  const puffs = Array.from({ length: 12 }, () => new Puff(true));
  const tendrils = Array.from({ length: 14 }, () => new Tendril(true));
  const prodSecEl = document.getElementById('products');
  let isVisible = false;
  let docVisible = !document.hidden;
  let isCoveredBySpiral = !!(prodSecEl && prodSecEl.classList.contains('at-spiral-active'));
  let rafId = 0;

  const shouldRenderSmoke = () => isVisible && docVisible && !isCoveredBySpiral && !prefersReducedMotion;
  const syncSmokeLoop = () => {
    if (shouldRenderSmoke()) {
      if (!rafId) rafId = requestAnimationFrame(renderFrame);
    } else if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = 0;
    }
  };

  function renderFrame() {
    rafId = 0;
    if (!shouldRenderSmoke()) return;
    t += 1;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < puffs.length; i++) {
      puffs[i].update();
      puffs[i].draw(ctx);
    }
    for (let i = 0; i < tendrils.length; i++) {
      tendrils[i].update();
      tendrils[i].draw(ctx, t);
    }
    ctx.globalAlpha = 1;
    if (shouldRenderSmoke()) {
      rafId = requestAnimationFrame(renderFrame);
    }
  }

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { isVisible = en.isIntersecting; });
      syncSmokeLoop();
    }, { rootMargin: '140px 0px', threshold: 0.01 });
    io.observe(canvas.parentElement || canvas);
  } else {
    isVisible = true;
    syncSmokeLoop();
  }
  document.addEventListener('visibilitychange', () => {
    docVisible = !document.hidden;
    syncSmokeLoop();
  });
  if (prodSecEl) {
    const syncSpiral = () => {
      isCoveredBySpiral = prodSecEl.classList.contains('at-spiral-active');
      syncSmokeLoop();
    };
    window.addEventListener('mediq:products-stage-change', syncSpiral);
    if (typeof MutationObserver !== 'undefined') {
      const mo = new MutationObserver(syncSpiral);
      mo.observe(prodSecEl, { attributes: true, attributeFilter: ['class'] });
    }
  }
}

function initProductsDeckController() {
  const prodSec = document.getElementById('products');
  if (!prodSec) return;

  const slides = prodSec.querySelectorAll('.product-slide');
  const prevBtn = document.getElementById('products-deck-prev');
  const nextBtn = document.getElementById('products-deck-next');
  const counter = document.getElementById('products-deck-counter');
  const subpageBar = document.getElementById('products-subpage-bar');
  const prodPills = prodSec.querySelectorAll('[data-prod-pill]');

  if (!slides.length) return;

  let currentIndex = 0;
  const total = slides.length;

  // STRICT SUBPAGE ISOLATION LOCK: Completely locks outer main page scroll when inside ANY subpage
  function lockPage() {
    document.querySelectorAll('.mediq-subpage-active-host').forEach((el) => el.classList.remove('mediq-subpage-active-host'));
    if (prodSec) prodSec.classList.add('mediq-subpage-active-host');
    document.documentElement.classList.add('mediq-subpage-locked');
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    document.documentElement.style.scrollSnapType = 'none';
  }

  function unlockPage() {
    document.querySelectorAll('.mediq-subpage-active-host').forEach((el) => el.classList.remove('mediq-subpage-active-host'));
    document.documentElement.classList.remove('mediq-subpage-locked');
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    document.documentElement.style.scrollSnapType = '';
  }

  let prodEdgeAccum = 0;
  let prodLastInnerScrollTime = 0;
  let prodLastSwitchTime = 0;

  function goToSlide(idx, opts = {}) {
    if (idx < 0) idx = 0;
    if (idx >= total) idx = total - 1;
    const prevIdx = currentIndex;
    if (idx >= 1) {
      window.__lastExplicitSubpageOpenTime = performance.now();
    }
    currentIndex = idx;
    window.__productsDeckCurrentIndex = idx;
    prodEdgeAccum = 0;

    slides.forEach((slide, i) => {
      slide.classList.remove('opacity-100', 'pointer-events-auto', 'translate-x-0', 'z-10', 'opacity-0', 'pointer-events-none', '-translate-x-12', 'translate-x-12', 'z-0');
      if (i === currentIndex) {
        slide.classList.add('opacity-100', 'pointer-events-auto', 'translate-x-0', 'z-10');
        slide.scrollTop = 0;
        if (typeof window.__triggerLotticiStagger === 'function') {
          window.__triggerLotticiStagger(slide);
        }
        if (currentIndex === 3 && slide.firstElementChild && typeof window.__playSubpage3DEntrance === 'function') {
          const dir = (prevIdx > 0 && currentIndex < prevIdx) ? -1 : 1;
          window.__playSubpage3DEntrance(slide.firstElementChild, dir);
        }
      } else if (i < currentIndex) {
        slide.classList.add('opacity-0', 'pointer-events-none', '-translate-x-12', 'z-0');
      } else {
        slide.classList.add('opacity-0', 'pointer-events-none', 'translate-x-12', 'z-0');
      }
    });

    if (counter) {
      counter.textContent = String(currentIndex + 1).padStart(2, '0') + ' / ' + String(total).padStart(2, '0');
    }

    if (prevBtn) prevBtn.disabled = (currentIndex === 0);
    if (nextBtn) nextBtn.disabled = (currentIndex === total - 1);

    // Toggle attached top sub-navbar (#products-subpage-bar) flush under #site-header
    if (subpageBar) {
      if (currentIndex >= 1) {
        subpageBar.classList.remove('opacity-0', 'pointer-events-none', '-translate-y-2');
        subpageBar.classList.add('opacity-100', 'pointer-events-auto', 'translate-y-0');
      } else {
        subpageBar.classList.remove('opacity-100', 'pointer-events-auto', 'translate-y-0');
        subpageBar.classList.add('opacity-0', 'pointer-events-none', '-translate-y-2');
      }
    }

    // Highlight active category pill in the attached sub-navbar
    prodPills.forEach((pill) => {
      const targetIdx = parseInt(pill.getAttribute('data-prod-pill'), 10);
      pill.classList.toggle('is-active', targetIdx === currentIndex);
    });

    // Hide floating deck nav controls completely on subpages (Slides 1–4)
    const navCtrl = document.getElementById('products-deck-nav');
    if (navCtrl) {
      if (currentIndex >= 1) {
        navCtrl.classList.add('hidden');
      } else {
        navCtrl.classList.remove('hidden');
      }
    }

    // Activate Active Theory ("What are you looking for?") 3D Helical Spiral & Terminal on all subpages (Slides 1–4)
    window.__productsDeckCurrentIndex = currentIndex;
    if (typeof window.__activateProductsActiveTheory === 'function') {
      window.__activateProductsActiveTheory(currentIndex);
    }

    // LOCK main page scrolling on ALL subpages (Slide 1: IOLs, Slide 2: Medical Supplies, Slide 3: Devices, Slide 4: Catalogs)
    // Only Slide 0 (Product Overview) allows main page scrolling!
    if (currentIndex >= 1) {
      if (typeof window.__engageSubpageLock === 'function') {
        window.__engageSubpageLock('products', prodSec);
      } else {
        lockPage();
      }
      if (typeof window.__resizeProductsSmoke === 'function') {
        window.__resizeProductsSmoke();
      }
      if (currentIndex === 1) {
        const iolSc = document.getElementById('iol-scroll-container');
        if (iolSc) iolSc.scrollTop = 0;
        if (typeof window.__updateIOLScroll === 'function') {
          setTimeout(window.__updateIOLScroll, 50);
        }
      }
      if (currentIndex === 2) {
        const medSlide = document.getElementById('product-slide-med-supplies');
        if (medSlide) medSlide.scrollTop = 0;
        if (typeof window.__updateMedSuppliesMosaic === 'function') {
          setTimeout(window.__updateMedSuppliesMosaic, 40);
        }
      }
    } else if (!opts.silentReset) {
      if (typeof window.__unlockOuterPageScroll === 'function') {
        window.__unlockOuterPageScroll();
      } else {
        unlockPage();
      }
    }
  }

  // SUBPAGES SCROLL LOCK CONTROLLER:
  // When inside Intraocular Lenses, Medical Supplies, Devices, or Catalogs, main page scrolling is 100% LOCKED!
  window.addEventListener('wheel', (e) => {
    // On Slide 0 (Product Overview), allow normal main page scrolling!
    if (currentIndex === 0) return;

    // Allow open brochure modal to scroll its own inner content
    const brochureModal = document.getElementById('brochure-modal');
    if (brochureModal && brochureModal.classList.contains('opacity-100') && brochureModal.contains(e.target)) {
      return;
    }

    // On ANY subpage (Slide 1, 2, 3, 4): PREVENT main page from scrolling!
    e.preventDefault();

    // Feed Active Theory 3D Helical Spiral first (unless zoomed into 3D Detail Stage)
    if (typeof window.__onProductsActiveTheoryWheel === 'function') {
      if (window.__onProductsActiveTheoryWheel(e.deltaY)) {
        prodEdgeAccum = 0;
        return;
      }
    }

    const now = performance.now();
    const rawDy = e.deltaMode === 1 ? e.deltaY * 36 : e.deltaY;
    const sc = currentIndex === 1
      ? document.getElementById('iol-scroll-container')
      : slides[currentIndex];
    const maxSc = sc ? Math.max(0, sc.scrollHeight - sc.clientHeight) : 0;
    const atTop = !sc || maxSc <= 2 || sc.scrollTop <= 2;
    const atBottom = !sc || maxSc <= 2 || sc.scrollTop >= maxSc - 3;

    if ((rawDy < 0 && atTop) || (rawDy > 0 && atBottom)) {
      if (now - prodLastInnerScrollTime >= 220 && now - prodLastSwitchTime >= 720) {
        if ((prodEdgeAccum > 0 && rawDy < 0) || (prodEdgeAccum < 0 && rawDy > 0)) {
          prodEdgeAccum = 0;
        }
        prodEdgeAccum += rawDy;
        if (prodEdgeAccum <= -140 && currentIndex > 1) {
          prodEdgeAccum = 0;
          prodLastSwitchTime = now;
          goToSlide(currentIndex - 1);
          return;
        }
        if (prodEdgeAccum >= 140 && currentIndex < total - 1) {
          prodEdgeAccum = 0;
          prodLastSwitchTime = now;
          goToSlide(currentIndex + 1);
          return;
        }
      }
      return;
    }

    prodEdgeAccum = 0;
    prodLastInnerScrollTime = now;

    if (currentIndex === 1) {
      // Intraocular Lenses: scrub the 6 3D packshot stages smoothly
      if (sc) {
        sc.scrollTop += rawDy * 1.5;
      }
    } else if (currentIndex === 2 && typeof window.__onMedSuppliesWheel === 'function') {
      // Medical Supplies: feed wheel delta into the 60fps damped mosaic scroll engine
      window.__onMedSuppliesWheel(rawDy);
    } else if (sc) {
      // Devices & Equipment, Product Catalogs:
      // Scroll the inner subpage container smoothly without moving the main page
      sc.scrollTop += rawDy * 1.3;
    }
  }, { passive: false });

  // TOUCH GESTURE CONTROLLER FOR SUBPAGES
  let touchStartY = 0;
  let touchStartScrollTop = 0;
  let isTouchingSubpage = false;

  window.addEventListener('touchstart', (e) => {
    if (currentIndex === 0) return;
    if (e.touches && e.touches.length === 1) {
      touchStartY = e.touches[0].clientY;
      isTouchingSubpage = true;
      if (currentIndex === 1) {
        const sc = document.getElementById('iol-scroll-container');
        touchStartScrollTop = sc ? sc.scrollTop : 0;
      } else {
        const activeSlide = slides[currentIndex];
        touchStartScrollTop = activeSlide ? activeSlide.scrollTop : 0;
      }
    }
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (currentIndex === 0 || !isTouchingSubpage) return;
    if (e.touches && e.touches.length === 1) {
      // Prevent outer main page from scrolling away while viewing subpages
      if (e.cancelable) e.preventDefault();

      const currentY = e.touches[0].clientY;
      const diffY = touchStartY - currentY;

      if (typeof window.__onProductsActiveTheoryWheel === 'function') {
        if (window.__onProductsActiveTheoryWheel(diffY * 0.45)) {
          touchStartY = currentY;
          return;
        }
      }

      if (currentIndex === 1) {
        const sc = document.getElementById('iol-scroll-container');
        if (sc) sc.scrollTop = touchStartScrollTop + diffY * 1.8;
      } else {
        const activeSlide = slides[currentIndex];
        if (activeSlide) activeSlide.scrollTop = touchStartScrollTop + diffY * 1.5;
      }
    }
  }, { passive: false });

  window.addEventListener('touchend', () => {
    isTouchingSubpage = false;
  }, { passive: true });

  // Global helper for direct button navigation to any section
  window.navigateToSection = function(selector) {
    if (typeof window.__resetAllSubpagesExcept === 'function') {
      window.__resetAllSubpagesExcept(null);
    }
    if (typeof window.__unlockOuterPageScroll === 'function') {
      window.__unlockOuterPageScroll();
    } else {
      unlockPage();
    }
    const target = document.querySelector(selector);
    if (target) {
      if (typeof window.grailScrollTo === 'function') {
        window.grailScrollTo(target);
      } else {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  // Ophteis & AEON Interactive 3D Box & Serif Tab Showcase Controllers
  const OPHTEIS_PRODUCTS = [
    {
      ghost: 'Adaptive Pro',
      accent: '#9b7fc1',
      eyebrow: 'ADAPTIVE OVD \u00b7 NaHA WITH SORBITOL',
      title: 'Ophteis\u00ae Adaptive Pro',
      desc: 'Bio-engineered sodium hyaluronate viscoelastic with Sorbitol antioxidant to neutralize free radicals and adapt seamlessly across every phase of cataract surgery.',
      frontImg: 'assets/img/packshots/box_front_ophteis_adaptive.png?v=380.0',
      topImg: 'assets/img/packshots/box_top_ophteis_adaptive.png?v=380.0',
      rightImg: 'assets/img/packshots/box_right_ophteis_adaptive.png?v=380.0',
      bars: [88, 92, 90]
    },
    {
      ghost: 'Cohesive',
      accent: '#4894b2',
      eyebrow: 'COHESIVE OVD \u00b7 1.1ML SYRINGE',
      title: 'Ophteis\u00ae Cohesive',
      desc: 'High molecular weight sodium hyaluronate viscoelastic solution providing superior anterior chamber depth maintenance, controlled capsulorhexis, and rapid bolus removal.',
      frontImg: 'assets/img/packshots/box_front_ophteis_cohesive.png?v=380.0',
      topImg: 'assets/img/packshots/box_top_ophteis_cohesive.png?v=380.0',
      rightImg: 'assets/img/packshots/box_right_ophteis_cohesive.png?v=380.0',
      bars: [62, 96, 95]
    },
    {
      ghost: 'Dispersive',
      accent: '#efa13a',
      eyebrow: 'DISPERSIVE OVD \u00b7 ENDOTHELIAL SHIELD',
      title: 'Ophteis\u00ae Dispersive',
      desc: 'Adheres tenaciously to corneal endothelial cells throughout phacoemulsification, shielding delicate intraocular tissues from ultrasonic trauma and fluid turbulence.',
      frontImg: 'assets/img/packshots/box_front_ophteis_dispersive.png?v=380.0',
      topImg: 'assets/img/packshots/box_top_ophteis_dispersive.png?v=380.0',
      rightImg: 'assets/img/packshots/box_right_ophteis_dispersive.png?v=380.0',
      bars: [94, 48, 56]
    }
  ];

  const AEON_PRODUCTS = [
    {
      ghost: 'Protect',
      accent: '#00a67e',
      eyebrow: '0.3% SODIUM HYALURONATE & SCO\u2122 \u00b7 LUBRICATING EYE DROPS',
      title: 'AEON\u00ae Protect',
      desc: 'Lubricating artificial tear drops formulated for the relief of mild to moderate dry eye. Phosphate free and preservative free on the eye (10 ml).',
      frontImg: 'assets/img/packshots/box_front_aeon_protect.png?v=380.0',
      sideImg: 'assets/img/packshots/box_side_aeon_protect.png?v=380.0',
      bottleImg: 'assets/img/packshots/bottle_aeon_protect.png?v=380.0',
      bars: [90, 86, 82]
    },
    {
      ghost: 'Protect Plus',
      accent: '#eab308',
      eyebrow: '0.3% CROSS-LINKED NaHA \u00b7 BEFORE & AFTER EYE SURGERY',
      title: 'AEON\u00ae Protect Plus',
      desc: 'Cross-linked 0.3% sodium hyaluronate eye drops designed for use before and after eye surgery for the relief of moderate to severe dry eye (10 ml).',
      frontImg: 'assets/img/packshots/box_front_aeon_protect_plus.png?v=380.0',
      sideImg: 'assets/img/packshots/box_side_aeon_protect_plus.png?v=380.0',
      bottleImg: 'assets/img/packshots/bottle_aeon_protect_plus.png?v=380.0',
      bars: [96, 94, 88]
    },
    {
      ghost: 'Repair',
      accent: '#9366b8',
      eyebrow: '0.15% NaHA + VITAMINS A & E \u00b7 AFTER EYE SURGERY',
      title: 'AEON\u00ae Repair',
      desc: 'Post-surgical ocular surface recovery drops enhanced with Vitamins A and E alongside 0.15% sodium hyaluronate. Phosphate and preservative free (10 ml).',
      frontImg: 'assets/img/packshots/box_front_aeon_repair.png?v=380.0',
      sideImg: 'assets/img/packshots/box_side_aeon_repair.png?v=380.0',
      bottleImg: 'assets/img/packshots/bottle_aeon_repair.png?v=380.0',
      bars: [88, 85, 98]
    },
    {
      ghost: 'NaCl 5%',
      accent: '#2546b8',
      eyebrow: '5% SODIUM CHLORIDE + 0.3% NaHA \u00b7 CORNEAL OEDEMA RELIEF',
      title: 'AEON\u00ae Sodium Chloride 5%',
      desc: 'Hypertonic 5% sodium chloride and 0.3% sodium hyaluronate ophthalmic solution formulated for the osmotic relief of corneal oedema (10 ml).',
      frontImg: 'assets/img/packshots/box_front_aeon_nacl.png?v=380.0',
      sideImg: 'assets/img/packshots/box_side_aeon_nacl.png?v=380.0',
      bottleImg: 'assets/img/packshots/bottle_aeon_nacl.png?v=380.0',
      bars: [84, 88, 96]
    }
  ];

  let activeOphteisIdx = 2;
  let activeAeonIdx = 0;

  window.selectOphteisTab = function(idx) {
    const nextIdx = ((idx % OPHTEIS_PRODUCTS.length) + OPHTEIS_PRODUCTS.length) % OPHTEIS_PRODUCTS.length;
    if (nextIdx === activeOphteisIdx) return;
    activeOphteisIdx = nextIdx;
    const item = OPHTEIS_PRODUCTS[nextIdx];
    const stage = document.getElementById('med-stage-ophteis');
    if (!stage) return;

    stage.style.setProperty('--med-accent', item.accent);
    stage.querySelectorAll('[data-ophteis-tab]').forEach((btn, i) => {
      const on = i === nextIdx;
      btn.classList.toggle('is-active', on);
      btn.setAttribute('aria-selected', on ? 'true' : 'false');
    });

    const ghost = document.getElementById('ophteis-ghost-word');
    if (ghost) ghost.textContent = item.ghost;
    const eyebrow = document.getElementById('ophteis-eyebrow');
    if (eyebrow) eyebrow.textContent = item.eyebrow;
    const title = document.getElementById('ophteis-title');
    if (title) title.textContent = item.title;
    const desc = document.getElementById('ophteis-desc');
    if (desc) desc.textContent = item.desc;

    const frontImg = document.getElementById('ophteis-box-front-img');
    if (frontImg && item.frontImg) {
      frontImg.src = item.frontImg;
      frontImg.alt = `${item.title} Packaging`;
    }
    const topImg = document.getElementById('ophteis-box-top-img');
    if (topImg && item.topImg) topImg.src = item.topImg;
    const rightImg = document.getElementById('ophteis-box-right-img');
    if (rightImg && item.rightImg) rightImg.src = item.rightImg;

    item.bars.forEach((val, bIdx) => {
      const fill = document.getElementById(`ophteis-bar-fill-${bIdx}`);
      const num = document.getElementById(`ophteis-bar-val-${bIdx}`);
      if (fill) fill.style.width = `${val}%`;
      if (num) num.textContent = String(val);
    });

    const prism = document.getElementById('ophteis-3d-prism');
    if (prism) {
      prism.classList.remove('is-spinning');
      void prism.offsetWidth;
      prism.classList.add('is-spinning');
    }
  };

  window.selectAeonTab = function(idx) {
    const nextIdx = ((idx % AEON_PRODUCTS.length) + AEON_PRODUCTS.length) % AEON_PRODUCTS.length;
    if (nextIdx === activeAeonIdx) return;
    activeAeonIdx = nextIdx;
    const item = AEON_PRODUCTS[nextIdx];
    const stage = document.getElementById('med-stage-aeon');
    if (!stage) return;

    stage.style.setProperty('--med-accent', item.accent);
    stage.querySelectorAll('[data-aeon-tab]').forEach((btn, i) => {
      const on = i === nextIdx;
      btn.classList.toggle('is-active', on);
      btn.setAttribute('aria-selected', on ? 'true' : 'false');
    });

    const ghost = document.getElementById('aeon-ghost-word');
    if (ghost) ghost.textContent = item.ghost;
    const eyebrow = document.getElementById('aeon-eyebrow');
    if (eyebrow) eyebrow.textContent = item.eyebrow;
    const title = document.getElementById('aeon-title');
    if (title) title.textContent = item.title;
    const desc = document.getElementById('aeon-desc');
    if (desc) desc.textContent = item.desc;

    const frontImg = document.getElementById('aeon-box-front-img');
    if (frontImg && item.frontImg) {
      frontImg.src = item.frontImg;
      frontImg.alt = `${item.title} Packaging`;
    }
    const sideImg = document.getElementById('aeon-box-side-img');
    if (sideImg && item.sideImg) sideImg.src = item.sideImg;
    const bottleImg = document.getElementById('aeon-bottle-img');
    if (bottleImg && item.bottleImg) {
      bottleImg.src = item.bottleImg;
      bottleImg.alt = `${item.title} 10ml Bottle`;
    }

    item.bars.forEach((val, bIdx) => {
      const fill = document.getElementById(`aeon-bar-fill-${bIdx}`);
      const num = document.getElementById(`aeon-bar-val-${bIdx}`);
      if (fill) fill.style.width = `${val}%`;
      if (num) num.textContent = String(val);
    });

    const prism = document.getElementById('aeon-3d-prism');
    if (prism) {
      prism.classList.remove('is-spinning');
      void prism.offsetWidth;
      prism.classList.add('is-spinning');
    }
  };

  window.handleMed3dTilt = function(event, family) {
    const isAeon = family === 'aeon';
    const prism = document.getElementById(isAeon ? 'aeon-3d-prism' : 'ophteis-3d-prism');
    const stage = document.getElementById(isAeon ? 'med-stage-aeon' : 'med-stage-ophteis');
    if (!prism || !stage) return;
    const rect = stage.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const nx = (event.clientX - rect.left) / rect.width - 0.5;
    const ny = (event.clientY - rect.top) / rect.height - 0.5;
    const baseRx = isAeon ? -8 : -14;
    const baseRy = isAeon ? 24 : -22;
    const rx = baseRx - ny * 16;
    const ry = baseRy + nx * 28;
    prism.style.setProperty('--med-rx', `${rx.toFixed(2)}deg`);
    prism.style.setProperty('--med-ry', `${ry.toFixed(2)}deg`);
  };

  window.resetMed3dTilt = function(family) {
    const isAeon = family === 'aeon';
    const prism = document.getElementById(isAeon ? 'aeon-3d-prism' : 'ophteis-3d-prism');
    if (!prism) return;
    prism.style.setProperty('--med-rx', isAeon ? '-8deg' : '-14deg');
    prism.style.setProperty('--med-ry', isAeon ? '24deg' : '-22deg');
  };

  if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentIndex <= 1 ? 0 : currentIndex - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));

  // Connect navbar dropdown items & in-page quick nav buttons
  document.querySelectorAll('[data-product-slide]').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetSlide = parseInt(link.getAttribute('data-product-slide') || '0', 10);
      if (targetSlide >= 1) {
        goToSlide(targetSlide);
      } else {
        if (typeof window.__resetAllSubpagesExcept === 'function') {
          window.__resetAllSubpagesExcept(null);
        }
        goToSlide(0);
        if (prodSec) {
          if (typeof window.grailScrollTo === 'function') {
            window.grailScrollTo(prodSec);
          } else {
            prodSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      }
    });
  });

  const navProducts = document.getElementById('nav-products');
  if (navProducts) {
    navProducts.addEventListener('click', (e) => {
      e.preventDefault();
      if (typeof window.__resetAllSubpagesExcept === 'function') {
        window.__resetAllSubpagesExcept(null);
      }
      goToSlide(0);
      if (prodSec) {
        if (typeof window.grailScrollTo === 'function') {
          window.grailScrollTo(prodSec);
        } else {
          prodSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  }

  // Keyboard navigation when scrolled into products section
  window.addEventListener('keydown', (e) => {
    const rect = prodSec.getBoundingClientRect();
    const inView = (rect.top <= window.innerHeight * 0.5 && rect.bottom >= window.innerHeight * 0.5);
    if (inView) {
      if (currentIndex === 2) {
        const ophteisStage = document.getElementById('med-stage-ophteis');
        const aeonStage = document.getElementById('med-stage-aeon');
        const isOphteisVisible = ophteisStage && ophteisStage.classList.contains('opacity-100');
        const isAeonVisible = aeonStage && aeonStage.classList.contains('opacity-100');
        if (e.key === 'ArrowRight' && (isOphteisVisible || isAeonVisible)) {
          e.preventDefault();
          if (isOphteisVisible) window.selectOphteisTab(activeOphteisIdx + 1);
          else if (isAeonVisible) window.selectAeonTab(activeAeonIdx + 1);
          return;
        }
        if (e.key === 'ArrowLeft' && (isOphteisVisible || isAeonVisible)) {
          e.preventDefault();
          if (isOphteisVisible) window.selectOphteisTab(activeOphteisIdx - 1);
          else if (isAeonVisible) window.selectAeonTab(activeAeonIdx - 1);
          return;
        }
      }
      if (currentIndex >= 1) {
        if (e.key === 'ArrowRight' && currentIndex !== 1 && currentIndex < total - 1) {
          e.preventDefault();
          goToSlide(currentIndex + 1);
        }
        if (e.key === 'ArrowLeft' && currentIndex !== 1 && currentIndex > 1) {
          e.preventDefault();
          goToSlide(currentIndex - 1);
        }
      }
      if (currentIndex === 1) {
        const sc = document.getElementById('iol-scroll-container');
        if (sc) {
          if (e.key === 'ArrowDown') { e.preventDefault(); sc.scrollTop += 250; }
          if (e.key === 'ArrowUp') { e.preventDefault(); sc.scrollTop -= 250; }
        }
      } else if (currentIndex === 2 && typeof window.__onMedSuppliesWheel === 'function') {
        if (e.key === 'ArrowDown') { e.preventDefault(); window.__onMedSuppliesWheel(220); }
        if (e.key === 'ArrowUp') { e.preventDefault(); window.__onMedSuppliesWheel(-220); }
      }
    }
  });

  // Touch swipe between subpages on non-IOL/non-MedSupplies subpages
  let deckTouchStartX = 0;
  prodSec.addEventListener('touchstart', (e) => {
    if (currentIndex >= 3) {
      deckTouchStartX = e.changedTouches[0].screenX;
    }
  }, { passive: true });

  prodSec.addEventListener('touchend', (e) => {
    if (currentIndex >= 3) {
      const touchEndX = e.changedTouches[0].screenX;
      const diffX = deckTouchStartX - touchEndX;
      if (Math.abs(diffX) > 50) {
        if (diffX > 0 && currentIndex < total - 1) {
          goToSlide(currentIndex + 1);
        } else if (diffX < 0 && currentIndex > 1) {
          goToSlide(currentIndex - 1);
        }
      }
    }
  }, { passive: true });

  window.goToProductSlide = goToSlide;

  // Initialize first slide
  goToSlide(0, { silentReset: true });
}

/* ========================================================================= */
/* MEDICAL SUPPLIES — 3-STAGE SCROLL + LEFT-TO-RIGHT PIXEL/BENTO MOSAIC WIPE */
/* ========================================================================= */
function initMedSuppliesMosaicScroll() {
  const slide = document.getElementById('product-slide-med-supplies');
  const stageIntro = document.getElementById('med-stage-intro');
  const stageOphteis = document.getElementById('med-stage-ophteis');
  const stageAeon = document.getElementById('med-stage-aeon');
  const canvas = document.getElementById('med-mosaic-wipe-canvas');
  if (!slide || !stageIntro || !stageOphteis || !stageAeon || !canvas) return;

  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  const stageBtns = Array.from(slide.querySelectorAll('[data-med-stage-btn]'));

  let cw = 0;
  let ch = 0;
  let dpr = 1;
  let tiles = [];

  // 60/120fps Damped Progress State (0.00 = Stage 0 Intro, 0.50 = Stage 1 Ophteis, 1.00 = Stage 2 AEON)
  let smoothP = 0;
  let targetP = 0;
  let lastScrollDir = 1;
  let lastInputTime = 0;
  let rafId = 0;
  let isSyncingScrollTop = false;

  // Pure Blue & White palette for both the 3x3 micro-pixels and the locked-in Bento mosaic tiles (zero images)
  const PIXEL_COLORS = [
    '#ffffff',
    '#eef7ff',
    '#cfeaff',
    '#8fd4ff',
    '#5bb8f5',
    '#3aa0db',
    '#1f78b8',
    '#0f467a',
    '#082649',
    '#05162e'
  ];

  const TILE_MAIN_COLORS = [
    '#ffffff',
    '#e4f3ff',
    '#a8dcff',
    '#6bc1f7',
    '#3aa0db',
    '#2077b3',
    '#124c82',
    '#0a2d57',
    '#061b38'
  ];

  function hash2D(c, r) {
    const h = Math.sin(c * 127.1 + r * 311.7) * 43758.5453123;
    return h - Math.floor(h);
  }

  function smoothstep(edge0, edge1, x) {
    const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
    return t * t * (3 - 2 * t);
  }

  function buildBentoGrid() {
    const isMobile = cw < 768;
    const COLS = isMobile ? 8 : 12;
    const ROWS = 7;

    const occupied = Array.from({ length: ROWS }, () => Array(COLS).fill(false));
    const newTiles = [];

    // Hero 2x2 Bento Color Tiles (matching the varied large/small mosaic layout)
    const heroPlacements = isMobile
      ? [
          { c: 0, r: 1, w: 2, h: 2 },
          { c: 3, r: 0, w: 2, h: 2 },
          { c: 5, r: 2, w: 2, h: 2 },
          { c: 1, r: 4, w: 2, h: 2 },
          { c: 5, r: 5, w: 2, h: 2 }
        ]
      : [
          { c: 0, r: 1, w: 2, h: 2 },
          { c: 2, r: 0, w: 2, h: 2 },
          { c: 5, r: 1, w: 2, h: 2 },
          { c: 8, r: 0, w: 2, h: 2 },
          { c: 10, r: 2, w: 2, h: 2 },
          { c: 1, r: 4, w: 2, h: 2 },
          { c: 4, r: 4, w: 2, h: 2 },
          { c: 7, r: 3, w: 2, h: 2 },
          { c: 9, r: 5, w: 2, h: 2 }
        ];

    const cellW = cw / COLS;
    const cellH = ch / ROWS;

    function createTileObj(c, r, w, h) {
      const nx = (c + w * 0.5) / COLS;
      const rand = hash2D(c, r);
      const jitter = (rand - 0.5) * 0.09;
      const xPx = Math.floor(c * cellW);
      const yPx = Math.floor(r * cellH);
      const wPx = Math.ceil((c + w) * cellW) - xPx;
      const hPx = Math.ceil((r + h) * cellH) - yPx;

      // Deterministic 3x3 sub-pixel order & blue/white colors for the leading/trailing wavefront
      const subOrder = [0, 1, 2, 3, 4, 5, 6, 7, 8].sort(
        (a, b) => hash2D(c * 3 + (a % 3), r * 3 + Math.floor(a / 3)) - hash2D(c * 3 + (b % 3), r * 3 + Math.floor(b / 3))
      );
      const subColors = subOrder.map((_, idx) => {
        const pick = Math.floor(hash2D(c + idx * 7, r + idx * 13) * PIXEL_COLORS.length);
        return PIXEL_COLORS[pick];
      });

      const mainColor0 = TILE_MAIN_COLORS[Math.floor(hash2D(c * 5 + 3, r * 11 + 7) * TILE_MAIN_COLORS.length)];
      const mainColor1 = TILE_MAIN_COLORS[Math.floor(hash2D(c * 9 + 13, r * 7 + 19) * TILE_MAIN_COLORS.length)];

      return {
        c,
        r,
        w,
        h,
        xPx,
        yPx,
        wPx,
        hPx,
        nx,
        jitter,
        subOrder,
        subColors,
        mainColor0,
        mainColor1
      };
    }

    heroPlacements.forEach((p) => {
      if (p.c + p.w <= COLS && p.r + p.h <= ROWS) {
        let canPlace = true;
        for (let rr = p.r; rr < p.r + p.h; rr++) {
          for (let cc = p.c; cc < p.c + p.w; cc++) {
            if (occupied[rr][cc]) canPlace = false;
          }
        }
        if (canPlace) {
          for (let rr = p.r; rr < p.r + p.h; rr++) {
            for (let cc = p.c; cc < p.c + p.w; cc++) {
              occupied[rr][cc] = true;
            }
          }
          newTiles.push(createTileObj(p.c, p.r, p.w, p.h));
        }
      }
    });

    // Fill remaining 1x1 cells
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (!occupied[r][c]) {
          occupied[r][c] = true;
          newTiles.push(createTileObj(c, r, 1, 1));
        }
      }
    }

    tiles = newTiles;
  }

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    cw = Math.max(320, rect.width || window.innerWidth);
    ch = Math.max(300, rect.height || (window.innerHeight - 128));
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(cw * dpr);
    canvas.height = Math.round(ch * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    buildBentoGrid();
  }

  // Draw the Left-to-Right Staggered Blue & White Pixel/Bento Mosaic Wipe for wipeProgress in [0, 1]
  function drawMosaicWipe(wipeProgress, wipeSlot) {
    ctx.clearRect(0, 0, cw, ch);
    if (wipeProgress <= 0.001 || wipeProgress >= 0.999) return;

    const seedOffset = wipeSlot === 0 ? 0 : 4;

    for (let tIdx = 0; tIdx < tiles.length; tIdx++) {
      const tile = tiles[tIdx];
      const x = tile.xPx;
      const y = tile.yPx;
      const w = tile.wPx;
      const h = tile.hPx;

      // Smooth wave propagation Left -> Right
      const waveOffset = tile.nx * 0.68 + tile.jitter;
      const entry = wipeProgress * 2.08 - waveOffset;
      const exit = (wipeProgress - 0.47) * 2.12 - waveOffset;

      if (entry <= 0 || exit >= 0.42) {
        continue;
      }

      const subW = w / 3;
      const subH = h / 3;
      const solidColor = wipeSlot === 0 ? tile.mainColor0 : tile.mainColor1;

      // 1) LEADING EDGE: 3x3 blue & white micro-pixels smoothly scaling & fading in, then locking into solid blue/white Bento block
      if (exit <= 0) {
        if (entry < 0.42) {
          for (let i = 0; i < 9; i++) {
            const subStart = i * 0.026;
            const subAlpha = smoothstep(subStart, subStart + 0.13, entry);
            if (subAlpha <= 0.01) continue;

            const subIdx = tile.subOrder[i];
            const sc = subIdx % 3;
            const sr = Math.floor(subIdx / 3);
            const scale = 0.84 + 0.16 * subAlpha;
            const pw = (subW + 0.6) * scale;
            const ph = (subH + 0.6) * scale;
            const px = x + sc * subW + (subW - pw) * 0.5;
            const py = y + sr * subH + (subH - ph) * 0.5;

            ctx.globalAlpha = subAlpha;
            ctx.fillStyle = tile.subColors[(i + seedOffset) % tile.subColors.length];
            ctx.fillRect(px, py, pw, ph);
          }
        }

        // Cross-fade the solid Blue/White Bento Tile smoothly over the 3x3 micro-pixels (entry 0.24 -> 0.42)
        const blockAlpha = smoothstep(0.24, 0.42, entry);
        if (blockAlpha > 0.01) {
          ctx.globalAlpha = blockAlpha;
          ctx.fillStyle = solidColor;
          ctx.fillRect(x, y, w, h);
          ctx.strokeStyle = 'rgba(4, 11, 24, 0.55)';
          ctx.lineWidth = 1.2;
          ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
        }
        ctx.globalAlpha = 1;
        continue;
      }

      // 2) TRAILING EDGE: Solid Blue/White Bento Tile subdivides back into 3x3 blue & white micro-pixels which smoothly dissolve out
      const blockOutAlpha = 1 - smoothstep(0.0, 0.17, exit);
      if (exit < 0.42) {
        for (let i = 0; i < 9; i++) {
          const outStart = 0.04 + i * 0.028;
          const subAlpha = 1 - smoothstep(outStart, outStart + 0.14, exit);
          if (subAlpha <= 0.01) continue;

          const subIdx = tile.subOrder[8 - i];
          const sc = subIdx % 3;
          const sr = Math.floor(subIdx / 3);
          const scale = 0.84 + 0.16 * subAlpha;
          const pw = (subW + 0.6) * scale;
          const ph = (subH + 0.6) * scale;
          const px = x + sc * subW + (subW - pw) * 0.5;
          const py = y + sr * subH + (subH - ph) * 0.5;

          ctx.globalAlpha = subAlpha;
          ctx.fillStyle = tile.subColors[(i + seedOffset + 3) % tile.subColors.length];
          ctx.fillRect(px, py, pw, ph);
        }
      }

      if (blockOutAlpha > 0.01) {
        ctx.globalAlpha = blockOutAlpha;
        ctx.fillStyle = solidColor;
        ctx.fillRect(x, y, w, h);
        ctx.strokeStyle = 'rgba(4, 11, 24, 0.55)';
        ctx.lineWidth = 1.2;
        ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
      }
      ctx.globalAlpha = 1;
    }
  }

  let currentActiveStage = -1;
  function setStageVisibility(activeStageIndex) {
    if (currentActiveStage === activeStageIndex) return;
    currentActiveStage = activeStageIndex;

    const configs = [
      { el: stageIntro, active: activeStageIndex === 0 },
      { el: stageOphteis, active: activeStageIndex === 1 },
      { el: stageAeon, active: activeStageIndex === 2 }
    ];
    configs.forEach(({ el, active }) => {
      if (active) {
        el.classList.remove('opacity-0', 'pointer-events-none');
        el.classList.add('opacity-100', 'pointer-events-auto');
        if (typeof window.__triggerLotticiStagger === 'function') {
          window.__triggerLotticiStagger(el);
        }
      } else {
        el.classList.remove('opacity-100', 'pointer-events-auto');
        el.classList.add('opacity-0', 'pointer-events-none');
      }
    });

    stageBtns.forEach((btn) => {
      const idx = parseInt(btn.getAttribute('data-med-stage-btn') || '0', 10);
      if (idx === activeStageIndex) {
        btn.className = 'px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider text-white bg-sky/25 border border-sky/45 transition-all cursor-pointer';
      } else {
        btn.className = 'px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider text-cream/60 hover:text-white border border-transparent transition-all cursor-pointer';
      }
    });
  }

  function renderProgress(p) {
    if (!cw || !ch) resizeCanvas();

    // Timeline across p in [0.00, 1.00]:
    // [0.00 .. 0.06] -> Stage 0 Hold (Medical Supplies • Ophteis OVDs & AEON Care Intro)
    // (0.06 .. 0.44) -> Wipe 1 (Left-to-Right Pixel & Bento Mosaic Wipe from Intro -> 01 Ophteis OVDs)
    // [0.44 .. 0.56] -> Stage 1 Hold (01 • OPHTEIS VISCOSURGICAL DEVICES)
    // (0.56 .. 0.94) -> Wipe 2 (Left-to-Right Pixel & Bento Mosaic Wipe from 01 Ophteis -> 02 AEON Care)
    // [0.94 .. 1.00] -> Stage 2 Hold (02 • AEON EYE SOLUTIONS & OCULAR SURFACE CARE)

    if (p <= 0.06) {
      setStageVisibility(0);
      ctx.clearRect(0, 0, cw, ch);
    } else if (p < 0.44) {
      const w1 = (p - 0.06) / (0.44 - 0.06); // 0 -> 1
      setStageVisibility(w1 < 0.49 ? 0 : 1);
      drawMosaicWipe(w1, 0);
    } else if (p <= 0.56) {
      setStageVisibility(1);
      ctx.clearRect(0, 0, cw, ch);
    } else if (p < 0.94) {
      const w2 = (p - 0.56) / (0.94 - 0.56); // 0 -> 1
      setStageVisibility(w2 < 0.49 ? 1 : 2);
      drawMosaicWipe(w2, 1);
    } else {
      setStageVisibility(2);
      ctx.clearRect(0, 0, cw, ch);
    }
  }

  function tick() {
    const now = performance.now();

    // Auto-complete wipe if user paused scrolling inside a wipe transition zone
    // so the screen never sits half-covered in mosaic tiles
    if (now - lastInputTime > 140) {
      if (targetP > 0.06 && targetP < 0.44) {
        targetP = lastScrollDir >= 0 ? 0.50 : 0.0;
      } else if (targetP > 0.56 && targetP < 0.94) {
        targetP = lastScrollDir >= 0 ? 1.0 : 0.50;
      }
    }

    const diff = targetP - smoothP;
    if (Math.abs(diff) > 0.0004) {
      // Velocity-capped critically damped lerp: guarantees 40-60 silky frames per wipe
      const rawStep = diff * 0.095;
      const cappedStep = Math.max(-0.0095, Math.min(0.0095, rawStep));
      smoothP = Math.max(0, Math.min(1, smoothP + cappedStep));
      renderProgress(smoothP);

      // Keep native scrollTop synchronized for scrollbar/touch consistency
      const maxScroll = Math.max(1, slide.scrollHeight - slide.clientHeight);
      isSyncingScrollTop = true;
      slide.scrollTop = smoothP * maxScroll;
      isSyncingScrollTop = false;

      rafId = requestAnimationFrame(tick);
    } else {
      smoothP = targetP;
      renderProgress(smoothP);
      rafId = 0;
    }
  }

  function requestTick() {
    if (!rafId) {
      rafId = requestAnimationFrame(tick);
    }
  }

  // Feed wheel impulses into the 60/120fps damped progress engine
  window.__onMedSuppliesWheel = function(deltaY) {
    if (!deltaY) return;
    lastInputTime = performance.now();
    lastScrollDir = deltaY >= 0 ? 1 : -1;
    const impulse = Math.max(-0.075, Math.min(0.075, deltaY * 0.00042));
    targetP = Math.max(0, Math.min(1, targetP + impulse));
    requestTick();
  };

  // Smooth programmatic jump to Stage 0, 1, or 2
  window.jumpMedSuppliesStage = function(targetStage) {
    const stageTargets = [0.0, 0.50, 1.0];
    const nextTarget = stageTargets[targetStage] !== undefined ? stageTargets[targetStage] : 0.0;
    lastScrollDir = nextTarget >= smoothP ? 1 : -1;
    lastInputTime = performance.now();
    targetP = nextTarget;
    requestTick();
  };

  // Support native scrollbar drag or touch scrolling on #product-slide-med-supplies
  slide.addEventListener('scroll', () => {
    if (isSyncingScrollTop) return;
    const maxScroll = Math.max(1, slide.scrollHeight - slide.clientHeight);
    const nativeP = Math.max(0, Math.min(1, slide.scrollTop / maxScroll));
    if (Math.abs(nativeP - smoothP) > 0.002) {
      lastInputTime = performance.now();
      lastScrollDir = nativeP >= targetP ? 1 : -1;
      targetP = nativeP;
      requestTick();
    }
  }, { passive: true });

  window.addEventListener('resize', () => {
    resizeCanvas();
    renderProgress(smoothP);
  });

  window.__updateMedSuppliesMosaic = function() {
    smoothP = 0;
    targetP = 0;
    currentActiveStage = -1;
    resizeCanvas();
    renderProgress(0);
  };

  resizeCanvas();
  renderProgress(0);
}

// Ensure products controllers and canvases initialize robustly regardless of document ready state
function launchProductsControllers() {
  initProductsDeckController();
  initIOLScrollStageController();
  initMedSuppliesMosaicScroll();
  initProductsSmokeCanvas();
  if (typeof initSilkWavesShader === 'function') {
    initSilkWavesShader('products-waves-shader-canvas');
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', launchProductsControllers);
} else {
  launchProductsControllers();
}

/* ========================================================================= */
/* WHAT WE DO — CLEAN SELECTOR + STAT STAGE CARD, VISUALS & LEARN-MORE MODAL */
/* ========================================================================= */
(function initWhatWeDoStageAndModal() {
  const $ = (id) => document.getElementById(id);
  const slide = $('about-slide-what-we-do');
  if (!slide) return;

  const AUTO_ADVANCE_MS = 7000;
  const COUNTER_MS = 800;
  const INTRO_MS = 1000;
  const MAX_DPR = 2;
  const BLUE = '#4fc3f7';
  const BAND = 'rgba(79, 195, 247, 0.08)';
  const LABEL = 'rgba(184, 198, 220, 0.9)';
  const DOT = '#f4a64b';
  const TRACK = 'rgba(255, 255, 255, 0.12)';

  const tabs = Array.from(slide.querySelectorAll('.wwd-selector-tab'));
  const tablist = $('wwd-tablist');
  const listCard = $('wwd-list-card');
  const slidingMarker = $('wwd-sliding-marker');
  const badgePillars = $('wwd-badge-pillars');
  const badgeRegions = $('wwd-badge-regions');
  const panel = $('wwd-stage-panel');
  const card = $('wwd-stage-card');
  const statNum = $('wwd-stage-stat-num');
  const statMeta = $('wwd-stage-stat-meta');
  const desc = $('wwd-stage-desc');
  const modalBtn = $('wwd-stage-modal-btn');
  const pauseBtn = $('wwd-pause-btn');
  const root = $('wwd-interactive-root');
  const wrap = $('wwd-stage-visual-wrap');
  const canvas = $('wwd-stage-canvas');
  const ctx = canvas ? canvas.getContext('2d') : null;

  const rmq = typeof window.matchMedia === 'function' ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  const coarseMq = typeof window.matchMedia === 'function' ? window.matchMedia('(pointer: coarse)') : { matches: false };
  const reduced = () => Boolean(rmq.matches);
  const isTouch = () => Boolean(coarseMq.matches);

  let active = 0;
  let slideOn = false;
  let hoverPause = false;
  let userPause = false;
  let modalOpen = false;
  let elapsed = 0;
  let lastT = performance.now();
  let switchT = performance.now();
  let raf = 0;
  let counterRaf = 0;
  let badgeRaf = 0;
  let entryPlayed = false;
  let cw = 600, ch = 220, dpr = 1;

  function syncSlidingMarker() {
    if (!slidingMarker || !tabs[active]) return;
    const t = tabs[active];
    const h = Math.max(24, t.offsetHeight * 0.72);
    const top = t.offsetTop + (t.offsetHeight - h) * 0.5;
    slidingMarker.style.top = top + 'px';
    slidingMarker.style.height = h + 'px';
  }

  function countUpBadges() {
    if (!badgePillars && !badgeRegions) return;
    if (badgeRaf) cancelAnimationFrame(badgeRaf);
    if (reduced()) {
      if (badgePillars) badgePillars.textContent = '6';
      if (badgeRegions) badgeRegions.textContent = '17';
      return;
    }
    const t0 = performance.now();
    const step = (now) => {
      const p = Math.min(1, (now - t0) / 750);
      const e = 1 - Math.pow(1 - p, 3);
      if (badgePillars) badgePillars.textContent = String(Math.round(6 * e));
      if (badgeRegions) badgeRegions.textContent = String(Math.round(17 * e));
      badgeRaf = p < 1 ? requestAnimationFrame(step) : 0;
    };
    badgeRaf = requestAnimationFrame(step);
  }

  // ─── Stat counter ──────────────────────────────────────────────────────────
  function countUp(tab) {
    if (!statNum || !tab) return;
    if (counterRaf) cancelAnimationFrame(counterRaf);
    const d = tab.dataset;
    const a = parseInt(d.statP1 || '0', 10);
    const hasB = Boolean(d.statP2);
    const b = hasB ? parseInt(d.statP2, 10) : 0;
    const fmt = (x, y) => (hasB ? `${x}${d.statSep}${y}` : `${x}`) + (d.statSuffix || '');
    if (reduced()) { statNum.textContent = fmt(a, b); return; }
    const t0 = performance.now();
    const step = (now) => {
      const p = Math.min(1, (now - t0) / COUNTER_MS);
      const e = 1 - Math.pow(1 - p, 3);
      statNum.textContent = fmt(Math.round(a * e), Math.round(b * e));
      counterRaf = p < 1 ? requestAnimationFrame(step) : 0;
    };
    counterRaf = requestAnimationFrame(step);
  }

  // ─── Selection ─────────────────────────────────────────────────────────────
  function select(idx, focus) {
    if (!tabs.length) return;
    active = (idx + tabs.length) % tabs.length;
    elapsed = 0;
    switchT = performance.now();
    tabs.forEach((t, i) => {
      const on = i === active;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.setAttribute('tabindex', on ? '0' : '-1');
    });
    const tab = tabs[active];
    const d = tab.dataset;
    if (focus) tab.focus();
    if (panel) panel.setAttribute('aria-labelledby', tab.id);
    if (statMeta) statMeta.textContent = d.statMeta || '';
    if (desc) desc.textContent = d.shortDesc || '';
    if (modalBtn) {
      ['n', 'cat', 'title', 'img', 'sl', 'sv', 'desc', 'pts'].forEach((k) => { modalBtn.dataset[k] = d[k] || ''; });
    }
    syncSlidingMarker();
    if (card && !reduced()) {
      card.classList.remove('wwd-stage-swap');
      void card.offsetWidth;
      card.classList.add('wwd-stage-swap');
    }
    countUp(tab);
    start();
  }

  // ─── Entry animation (word-by-word title, divider, badges, cards) ──────────
  function entry() {
    slide.classList.add('wwd-entered');
    countUpBadges();
    requestAnimationFrame(syncSlidingMarker);
    if (reduced() || typeof window.gsap === 'undefined') return;
    const g = window.gsap;
    const tl = g.timeline({ defaults: { ease: 'power3.out' } });
    const topTargets = [$('wwd-subtext'), $('wwd-header-badges')].filter(Boolean);
    if (topTargets.length) {
      tl.fromTo(topTargets, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.42, stagger: 0.06, clearProps: 'transform,opacity' }, 0.15);
    }
    const leftTarget = listCard || (tabs.length ? tabs : null);
    if (leftTarget) {
      tl.fromTo(leftTarget, { x: -12, opacity: 0 }, { x: 0, opacity: 1, duration: 0.42, clearProps: 'transform,opacity' }, topTargets.length ? '-=0.25' : 0.15);
    }
    if (card) {
      tl.fromTo(card, { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.46, clearProps: 'transform,opacity' }, (topTargets.length || leftTarget) ? '-=0.32' : 0.15);
    }
  }

  // ─── Canvas helpers ────────────────────────────────────────────────────────
  function resize() {
    if (!wrap || !canvas) return;
    dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    cw = Math.max(240, wrap.clientWidth);
    ch = Math.max(140, wrap.clientHeight);
    canvas.width = Math.round(cw * dpr);
    canvas.height = Math.round(ch * dpr);
  }

  function roundRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function label(text, x, y, align) {
    ctx.font = '500 12px "Futura", "Futura PT", "Futura Medium", "Jost", "Century Gothic", ui-sans-serif, system-ui, sans-serif';
    ctx.fillStyle = LABEL;
    ctx.textAlign = align || 'left';
    ctx.fillText(text, x, y);
  }

  function endDot(x, y) {
    ctx.save();
    ctx.shadowColor = 'rgba(244, 166, 75, 0.7)';
    ctx.shadowBlur = 12;
    ctx.fillStyle = DOT;
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // 1. Cold chain: delivery journey across top + live 2–8 °C wave between dashed lines (no box)
  const JOURNEY_STOPS = ['Order received', 'Cold-packed', 'In transit', 'Delivered'];
  function drawColdChain(t, intro) {
    const elapsedSec = Math.max(0, (performance.now() - switchT) / 1000);
    const padX = Math.max(16, cw * 0.04);
    const w = cw - padX * 2;

    // ── Top: Delivery Journey ───────────────────────────────────────────────
    const jy = Math.max(30, ch * 0.20);
    const pkgCycle = reduced() ? 1 : ((elapsedSec * 0.24) % 1.22);
    const pkgU = Math.max(0, Math.min(1, pkgCycle));

    // Base route line
    ctx.strokeStyle = 'rgba(79, 195, 247, 0.20)';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(padX, jy);
    ctx.lineTo(padX + w, jy);
    ctx.stroke();

    // Active route line up to package dot
    ctx.strokeStyle = BLUE;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(padX, jy);
    ctx.lineTo(padX + w * pkgU, jy);
    ctx.stroke();

    // 4 Stops + arrival ripples + labels
    for (let i = 0; i < JOURNEY_STOPS.length; i++) {
      const su = i / (JOURNEY_STOPS.length - 1);
      const sx = padX + su * w;
      const reached = pkgU >= su - 0.005;
      const sinceReach = pkgU - su;

      if (reached && !reduced() && sinceReach >= 0 && sinceReach < 0.28) {
        const rp = sinceReach / 0.28;
        ctx.strokeStyle = 'rgba(79, 195, 247, ' + ((1 - rp) * 0.55).toFixed(3) + ')';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(sx, jy, 6 + rp * 14, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.save();
      if (reached) {
        ctx.shadowColor = 'rgba(79, 195, 247, 0.75)';
        ctx.shadowBlur = 10;
        ctx.fillStyle = BLUE;
      } else {
        ctx.fillStyle = 'rgba(79, 195, 247, 0.25)';
      }
      ctx.beginPath();
      ctx.arc(sx, jy, reached ? 5.2 : 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      ctx.font = (reached ? '600 ' : '500 ') + '12.5px "Futura", "Futura PT", "Futura Medium", "Jost", "Century Gothic", ui-sans-serif, system-ui, sans-serif';
      ctx.fillStyle = reached ? '#ffffff' : 'rgba(184, 198, 220, 0.50)';
      ctx.textAlign = i === 0 ? 'left' : i === JOURNEY_STOPS.length - 1 ? 'right' : 'center';
      ctx.fillText(JOURNEY_STOPS[i], sx, jy + 24);
    }

    // Traveling package dot
    endDot(padX + w * pkgU, jy);

    // ── Bottom: Live Temperature Wave between 2–8 °C Dashed Lines (No Box) ──
    const wy = Math.max(jy + 58, ch * 0.54);
    const wh = Math.max(64, Math.min(ch * 0.34, 115));

    label('2–8 °C safe range', padX, wy - 10);
    ctx.save();
    ctx.font = '500 11.5px "Futura", "Futura PT", "Futura Medium", "Jost", "Century Gothic", ui-sans-serif, system-ui, sans-serif';
    ctx.fillStyle = 'rgba(184, 198, 220, 0.58)';
    ctx.textAlign = 'right';
    ctx.fillText('8 °C', padX + w, wy - 6);
    ctx.fillText('2 °C', padX + w, wy + wh + 14);

    ctx.setLineDash([5, 6]);
    ctx.strokeStyle = 'rgba(79, 195, 247, 0.28)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(padX, wy);
    ctx.lineTo(padX + w, wy);
    ctx.moveTo(padX, wy + wh);
    ctx.lineTo(padX + w, wy + wh);
    ctx.stroke();
    ctx.restore();

    const n = 96;
    const shown = Math.max(2, Math.round(n * intro));
    const phase = reduced() ? 0 : t * 1.15;
    ctx.beginPath();
    let lx = padX, ly = wy + wh * 0.5;
    for (let i = 0; i < shown; i++) {
      const u = i / (n - 1);
      const x = padX + u * w;
      const waveVal = Math.sin(u * Math.PI * 4.2 - phase) * 0.24 + Math.sin(u * Math.PI * 1.7 + phase * 0.65) * 0.08;
      const y = wy + wh * (0.5 + waveVal);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
      lx = x;
      ly = y;
    }
    ctx.strokeStyle = BLUE;
    ctx.lineWidth = 3;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.stroke();
    endDot(lx, ly);

    // Live temperature reading (e.g. 4.6 °C)
    const normTemp = 1 - (ly - wy) / wh;
    const tempC = (2 + normTemp * 6).toFixed(1) + ' °C';
    ctx.save();
    ctx.font = '700 13px "Futura", "Futura PT", "Futura Medium", "Jost", "Century Gothic", ui-sans-serif, system-ui, sans-serif';
    ctx.fillStyle = DOT;
    ctx.textAlign = lx > padX + w * 0.85 ? 'right' : 'left';
    ctx.fillText(tempC, lx + (lx > padX + w * 0.85 ? -10 : 10), ly - 10);
    ctx.restore();
  }

  // 2. Commercial: 25 bars rising (open stage, no box)
  function drawBars(t, intro) {
    const n = 25;
    const gw = cw * 0.92;
    const gh = Math.min(ch * 0.68, 230);
    const gx = (cw - gw) / 2;
    const gy = (ch - gh) / 2 + 12;
    label('One bar per symposium this year', gx, gy - 14);
    const slot = gw / n;
    const bw = slot * 0.56;
    for (let i = 0; i < n; i++) {
      const u = i / (n - 1);
      const local = Math.max(0, Math.min(1, intro * 1.6 - u * 0.6));
      const e = 1 - Math.pow(1 - local, 3);
      const base = 0.35 + 0.5 * ((Math.sin(i * 1.7) + 1) / 2) + u * 0.12;
      const shimmer = reduced() ? 1 : 0.94 + 0.06 * Math.sin(t * 2.2 + i * 0.4);
      const h = gh * Math.min(1, base) * e * shimmer;
      ctx.fillStyle = i === n - 1 ? DOT : BLUE;
      roundRect(gx + i * slot + (slot - bw) / 2, gy + gh - h, bw, Math.max(2, h), 2);
      ctx.fill();
    }
  }

  // 3. Field network: Dotted Philippine archipelago + 17 regions step-by-step (every 1.8s)
  const PH_DOTS = [[0.388,0.013],[0.406,0.013],[0.425,0.013],[0.443,0.013],[0.462,0.013],[0.388,0.027],[0.406,0.027],[0.425,0.027],[0.443,0.027],[0.462,0.027],[0.48,0.027],[0.498,0.027],[0.535,0.027],[0.554,0.027],[0.369,0.04],[0.388,0.04],[0.406,0.04],[0.425,0.04],[0.443,0.04],[0.462,0.04],[0.48,0.04],[0.498,0.04],[0.517,0.04],[0.535,0.04],[0.369,0.053],[0.388,0.053],[0.406,0.053],[0.425,0.053],[0.443,0.053],[0.462,0.053],[0.48,0.053],[0.498,0.053],[0.517,0.053],[0.535,0.053],[0.369,0.066],[0.388,0.066],[0.406,0.066],[0.425,0.066],[0.443,0.066],[0.462,0.066],[0.48,0.066],[0.498,0.066],[0.517,0.066],[0.535,0.066],[0.369,0.08],[0.388,0.08],[0.406,0.08],[0.425,0.08],[0.443,0.08],[0.462,0.08],[0.48,0.08],[0.498,0.08],[0.517,0.08],[0.535,0.08],[0.369,0.093],[0.388,0.093],[0.406,0.093],[0.425,0.093],[0.443,0.093],[0.462,0.093],[0.48,0.093],[0.498,0.093],[0.517,0.093],[0.535,0.093],[0.369,0.106],[0.388,0.106],[0.406,0.106],[0.425,0.106],[0.443,0.106],[0.462,0.106],[0.48,0.106],[0.498,0.106],[0.517,0.106],[0.535,0.106],[0.554,0.106],[0.369,0.12],[0.388,0.12],[0.406,0.12],[0.425,0.12],[0.443,0.12],[0.462,0.12],[0.48,0.12],[0.498,0.12],[0.517,0.12],[0.535,0.12],[0.554,0.12],[0.572,0.12],[0.369,0.133],[0.388,0.133],[0.406,0.133],[0.425,0.133],[0.443,0.133],[0.462,0.133],[0.48,0.133],[0.498,0.133],[0.517,0.133],[0.535,0.133],[0.554,0.133],[0.351,0.146],[0.369,0.146],[0.388,0.146],[0.406,0.146],[0.425,0.146],[0.443,0.146],[0.462,0.146],[0.48,0.146],[0.498,0.146],[0.517,0.146],[0.535,0.146],[0.554,0.146],[0.351,0.159],[0.369,0.159],[0.388,0.159],[0.406,0.159],[0.425,0.159],[0.443,0.159],[0.462,0.159],[0.48,0.159],[0.498,0.159],[0.517,0.159],[0.535,0.159],[0.369,0.173],[0.388,0.173],[0.406,0.173],[0.425,0.173],[0.443,0.173],[0.462,0.173],[0.48,0.173],[0.498,0.173],[0.517,0.173],[0.535,0.173],[0.295,0.186],[0.314,0.186],[0.369,0.186],[0.388,0.186],[0.406,0.186],[0.425,0.186],[0.443,0.186],[0.462,0.186],[0.48,0.186],[0.498,0.186],[0.314,0.199],[0.332,0.199],[0.351,0.199],[0.369,0.199],[0.388,0.199],[0.406,0.199],[0.425,0.199],[0.443,0.199],[0.462,0.199],[0.48,0.199],[0.314,0.213],[0.332,0.213],[0.351,0.213],[0.369,0.213],[0.388,0.213],[0.406,0.213],[0.425,0.213],[0.443,0.213],[0.462,0.213],[0.48,0.213],[0.314,0.226],[0.332,0.226],[0.351,0.226],[0.369,0.226],[0.388,0.226],[0.406,0.226],[0.425,0.226],[0.443,0.226],[0.462,0.226],[0.314,0.239],[0.332,0.239],[0.351,0.239],[0.369,0.239],[0.388,0.239],[0.406,0.239],[0.425,0.239],[0.443,0.239],[0.462,0.239],[0.332,0.252],[0.351,0.252],[0.369,0.252],[0.388,0.252],[0.406,0.252],[0.425,0.252],[0.443,0.252],[0.462,0.252],[0.332,0.266],[0.351,0.266],[0.369,0.266],[0.388,0.266],[0.406,0.266],[0.425,0.266],[0.443,0.266],[0.462,0.266],[0.332,0.279],[0.351,0.279],[0.369,0.279],[0.388,0.279],[0.406,0.279],[0.425,0.279],[0.443,0.279],[0.462,0.279],[0.48,0.279],[0.517,0.279],[0.351,0.292],[0.369,0.292],[0.425,0.292],[0.443,0.292],[0.462,0.292],[0.48,0.292],[0.517,0.292],[0.369,0.306],[0.425,0.306],[0.443,0.306],[0.462,0.306],[0.48,0.306],[0.406,0.319],[0.425,0.319],[0.443,0.319],[0.462,0.319],[0.48,0.319],[0.388,0.332],[0.406,0.332],[0.425,0.332],[0.443,0.332],[0.462,0.332],[0.48,0.332],[0.498,0.332],[0.554,0.332],[0.572,0.332],[0.591,0.332],[0.609,0.332],[0.388,0.345],[0.406,0.345],[0.425,0.345],[0.443,0.345],[0.462,0.345],[0.48,0.345],[0.498,0.345],[0.517,0.345],[0.554,0.345],[0.572,0.345],[0.591,0.345],[0.609,0.345],[0.628,0.345],[0.665,0.345],[0.757,0.345],[0.332,0.359],[0.425,0.359],[0.443,0.359],[0.462,0.359],[0.535,0.359],[0.554,0.359],[0.572,0.359],[0.609,0.359],[0.628,0.359],[0.665,0.359],[0.683,0.359],[0.702,0.359],[0.757,0.359],[0.554,0.372],[0.572,0.372],[0.628,0.372],[0.646,0.372],[0.665,0.372],[0.683,0.372],[0.738,0.372],[0.757,0.372],[0.369,0.385],[0.388,0.385],[0.406,0.385],[0.517,0.385],[0.572,0.385],[0.646,0.385],[0.665,0.385],[0.683,0.385],[0.388,0.399],[0.406,0.399],[0.425,0.399],[0.443,0.399],[0.517,0.399],[0.591,0.399],[0.665,0.399],[0.683,0.399],[0.702,0.399],[0.406,0.412],[0.425,0.412],[0.443,0.412],[0.462,0.412],[0.628,0.412],[0.665,0.412],[0.683,0.412],[0.702,0.412],[0.72,0.412],[0.406,0.425],[0.425,0.425],[0.443,0.425],[0.462,0.425],[0.646,0.425],[0.738,0.425],[0.406,0.438],[0.425,0.438],[0.443,0.438],[0.462,0.438],[0.72,0.438],[0.738,0.438],[0.425,0.452],[0.443,0.452],[0.462,0.452],[0.535,0.452],[0.554,0.452],[0.702,0.452],[0.775,0.452],[0.812,0.452],[0.831,0.452],[0.849,0.452],[0.443,0.465],[0.517,0.465],[0.591,0.465],[0.665,0.465],[0.683,0.465],[0.775,0.465],[0.794,0.465],[0.812,0.465],[0.831,0.465],[0.849,0.465],[0.314,0.478],[0.665,0.478],[0.683,0.478],[0.702,0.478],[0.775,0.478],[0.794,0.478],[0.812,0.478],[0.831,0.478],[0.849,0.478],[0.868,0.478],[0.646,0.492],[0.702,0.492],[0.72,0.492],[0.812,0.492],[0.831,0.492],[0.849,0.492],[0.868,0.492],[0.314,0.505],[0.517,0.505],[0.535,0.505],[0.831,0.505],[0.849,0.505],[0.868,0.505],[0.535,0.518],[0.554,0.518],[0.775,0.518],[0.812,0.518],[0.831,0.518],[0.849,0.518],[0.868,0.518],[0.295,0.531],[0.535,0.531],[0.554,0.531],[0.572,0.531],[0.591,0.531],[0.609,0.531],[0.628,0.531],[0.831,0.531],[0.849,0.531],[0.868,0.531],[0.886,0.531],[0.535,0.545],[0.554,0.545],[0.572,0.545],[0.591,0.545],[0.609,0.545],[0.628,0.545],[0.702,0.545],[0.775,0.545],[0.794,0.545],[0.812,0.545],[0.849,0.545],[0.868,0.545],[0.886,0.545],[0.258,0.558],[0.535,0.558],[0.554,0.558],[0.572,0.558],[0.591,0.558],[0.609,0.558],[0.775,0.558],[0.794,0.558],[0.812,0.558],[0.831,0.558],[0.905,0.558],[0.258,0.571],[0.535,0.571],[0.554,0.571],[0.572,0.571],[0.591,0.571],[0.646,0.571],[0.665,0.571],[0.72,0.571],[0.812,0.571],[0.831,0.571],[0.258,0.585],[0.277,0.585],[0.535,0.585],[0.554,0.585],[0.572,0.585],[0.591,0.585],[0.628,0.585],[0.646,0.585],[0.665,0.585],[0.72,0.585],[0.812,0.585],[0.831,0.585],[0.258,0.598],[0.277,0.598],[0.295,0.598],[0.314,0.598],[0.591,0.598],[0.628,0.598],[0.646,0.598],[0.665,0.598],[0.702,0.598],[0.72,0.598],[0.812,0.598],[0.831,0.598],[0.849,0.598],[0.222,0.611],[0.24,0.611],[0.258,0.611],[0.628,0.611],[0.646,0.611],[0.702,0.611],[0.72,0.611],[0.812,0.611],[0.831,0.611],[0.849,0.611],[0.222,0.624],[0.24,0.624],[0.628,0.624],[0.646,0.624],[0.683,0.624],[0.702,0.624],[0.812,0.624],[0.831,0.624],[0.886,0.624],[0.203,0.638],[0.609,0.638],[0.628,0.638],[0.646,0.638],[0.683,0.638],[0.738,0.638],[0.757,0.638],[0.775,0.638],[0.942,0.638],[0.185,0.651],[0.572,0.651],[0.591,0.651],[0.609,0.651],[0.628,0.651],[0.683,0.651],[0.72,0.651],[0.738,0.651],[0.757,0.651],[0.775,0.651],[0.942,0.651],[0.166,0.664],[0.185,0.664],[0.572,0.664],[0.591,0.664],[0.609,0.664],[0.628,0.664],[0.665,0.664],[0.72,0.664],[0.738,0.664],[0.757,0.664],[0.886,0.664],[0.148,0.677],[0.166,0.677],[0.591,0.677],[0.609,0.677],[0.628,0.677],[0.646,0.677],[0.665,0.677],[0.886,0.677],[0.905,0.677],[0.923,0.677],[0.129,0.691],[0.148,0.691],[0.628,0.691],[0.646,0.691],[0.886,0.691],[0.905,0.691],[0.923,0.691],[0.092,0.704],[0.111,0.704],[0.628,0.704],[0.646,0.704],[0.886,0.704],[0.905,0.704],[0.923,0.704],[0.942,0.704],[0.074,0.717],[0.092,0.717],[0.111,0.717],[0.812,0.717],[0.849,0.717],[0.868,0.717],[0.886,0.717],[0.905,0.717],[0.923,0.717],[0.942,0.717],[0.96,0.717],[0.055,0.731],[0.074,0.731],[0.092,0.731],[0.812,0.731],[0.831,0.731],[0.849,0.731],[0.868,0.731],[0.886,0.731],[0.905,0.731],[0.923,0.731],[0.942,0.731],[0.96,0.731],[0.055,0.744],[0.665,0.744],[0.683,0.744],[0.702,0.744],[0.775,0.744],[0.812,0.744],[0.831,0.744],[0.849,0.744],[0.868,0.744],[0.886,0.744],[0.905,0.744],[0.923,0.744],[0.942,0.744],[0.628,0.757],[0.646,0.757],[0.665,0.757],[0.683,0.757],[0.702,0.757],[0.775,0.757],[0.794,0.757],[0.812,0.757],[0.831,0.757],[0.849,0.757],[0.868,0.757],[0.886,0.757],[0.905,0.757],[0.923,0.757],[0.942,0.757],[0.96,0.757],[0.628,0.77],[0.646,0.77],[0.665,0.77],[0.683,0.77],[0.702,0.77],[0.757,0.77],[0.775,0.77],[0.794,0.77],[0.812,0.77],[0.831,0.77],[0.849,0.77],[0.868,0.77],[0.886,0.77],[0.905,0.77],[0.923,0.77],[0.942,0.77],[0.96,0.77],[0.978,0.77],[0.572,0.784],[0.591,0.784],[0.609,0.784],[0.628,0.784],[0.646,0.784],[0.665,0.784],[0.683,0.784],[0.702,0.784],[0.72,0.784],[0.738,0.784],[0.757,0.784],[0.775,0.784],[0.794,0.784],[0.812,0.784],[0.831,0.784],[0.849,0.784],[0.868,0.784],[0.886,0.784],[0.905,0.784],[0.923,0.784],[0.942,0.784],[0.96,0.784],[0.554,0.797],[0.572,0.797],[0.591,0.797],[0.609,0.797],[0.628,0.797],[0.646,0.797],[0.665,0.797],[0.683,0.797],[0.702,0.797],[0.72,0.797],[0.738,0.797],[0.757,0.797],[0.775,0.797],[0.794,0.797],[0.812,0.797],[0.831,0.797],[0.849,0.797],[0.868,0.797],[0.886,0.797],[0.905,0.797],[0.923,0.797],[0.942,0.797],[0.96,0.797],[0.535,0.81],[0.554,0.81],[0.572,0.81],[0.609,0.81],[0.628,0.81],[0.646,0.81],[0.665,0.81],[0.738,0.81],[0.757,0.81],[0.775,0.81],[0.794,0.81],[0.812,0.81],[0.831,0.81],[0.849,0.81],[0.868,0.81],[0.886,0.81],[0.905,0.81],[0.923,0.81],[0.942,0.81],[0.96,0.81],[0.978,0.81],[0.535,0.824],[0.554,0.824],[0.665,0.824],[0.757,0.824],[0.775,0.824],[0.794,0.824],[0.812,0.824],[0.831,0.824],[0.849,0.824],[0.868,0.824],[0.886,0.824],[0.905,0.824],[0.923,0.824],[0.942,0.824],[0.96,0.824],[0.978,0.824],[0.535,0.837],[0.554,0.837],[0.757,0.837],[0.775,0.837],[0.794,0.837],[0.812,0.837],[0.831,0.837],[0.849,0.837],[0.868,0.837],[0.886,0.837],[0.905,0.837],[0.923,0.837],[0.942,0.837],[0.96,0.837],[0.978,0.837],[0.517,0.85],[0.535,0.85],[0.738,0.85],[0.757,0.85],[0.775,0.85],[0.794,0.85],[0.812,0.85],[0.831,0.85],[0.849,0.85],[0.868,0.85],[0.886,0.85],[0.905,0.85],[0.923,0.85],[0.942,0.85],[0.96,0.85],[0.978,0.85],[0.535,0.863],[0.738,0.863],[0.757,0.863],[0.775,0.863],[0.794,0.863],[0.812,0.863],[0.831,0.863],[0.849,0.863],[0.868,0.863],[0.942,0.863],[0.96,0.863],[0.738,0.877],[0.757,0.877],[0.775,0.877],[0.794,0.877],[0.812,0.877],[0.831,0.877],[0.849,0.877],[0.868,0.877],[0.942,0.877],[0.517,0.89],[0.535,0.89],[0.738,0.89],[0.757,0.89],[0.775,0.89],[0.794,0.89],[0.812,0.89],[0.831,0.89],[0.849,0.89],[0.868,0.89],[0.738,0.903],[0.757,0.903],[0.775,0.903],[0.794,0.903],[0.812,0.903],[0.831,0.903],[0.849,0.903],[0.868,0.903],[0.886,0.903],[0.757,0.917],[0.775,0.917],[0.794,0.917],[0.812,0.917],[0.831,0.917],[0.849,0.917],[0.868,0.917],[0.886,0.917],[0.425,0.93],[0.794,0.93],[0.812,0.93],[0.831,0.93],[0.868,0.93],[0.886,0.93],[0.831,0.943],[0.868,0.943],[0.886,0.943],[0.868,0.956],[0.314,0.996]];
  const PH_REGIONS = [["NCR","National Capital Region",0.4185,0.2989],["CAR","Cordillera Administrative Region",0.4154,0.1107],["I","Ilocos Region",0.3672,0.1498],["II","Cagayan Valley",0.4974,0.1107],["III","Central Luzon",0.4021,0.2384],["IV-A","CALABARZON",0.4564,0.3343],["IV-B","MIMAROPA",0.439,0.4133],["V","Bicol Region",0.679,0.3838],["VI","Western Visayas",0.5764,0.5557],["VII","Central Visayas",0.7159,0.6177],["VIII","Eastern Visayas",0.8256,0.5387],["IX","Zamboanga Peninsula",0.6205,0.7993],["X","Northern Mindanao",0.7949,0.7624],["XI","Davao Region",0.8974,0.8339],["XII","SOCCSKSARGEN",0.8154,0.9004],["XIII","Caraga",0.9046,0.7232],["BARMM","Bangsamoro Autonomous Region",0.7538,0.8465]];
  const REGION_STEP_SEC = 1.8;

  function drawArchipelago(t, intro) {
    const elapsedSec = Math.max(0, (performance.now() - switchT) / 1000);
    const regIdx = reduced() ? 0 : Math.floor(elapsedSec / REGION_STEP_SEC) % PH_REGIONS.length;
    const stepP = reduced() ? 1 : (elapsedSec % REGION_STEP_SEC) / REGION_STEP_SEC;
    const activeReg = PH_REGIONS[regIdx];

    // ── Left-side Region Readout & 17-Segment Progress Bar ──────────────────
    const leftX = 4;
    const baseCy = Math.max(92, Math.min(ch * 0.54, ch - 78));

    ctx.save();
    ctx.textAlign = 'left';
    ctx.font = '500 13px "Futura", "Futura PT", "Futura Medium", "Jost", "Century Gothic", ui-sans-serif, system-ui, sans-serif';
    ctx.fillStyle = 'rgba(184, 198, 220, 0.82)';
    ctx.fillText('Region ' + (regIdx + 1) + ' of ' + PH_REGIONS.length, leftX, baseCy - 48);

    const codeFontPx = Math.round(Math.max(40, Math.min(60, cw * 0.072)));
    ctx.font = '800 ' + codeFontPx + 'px "Futura", "Futura PT", "Futura Medium", "Jost", "Century Gothic", ui-sans-serif, system-ui, sans-serif';
    ctx.fillStyle = DOT;
    ctx.fillText(activeReg[0], leftX, baseCy + 10);

    const nameFontPx = Math.round(Math.max(15, Math.min(20, cw * 0.024)));
    ctx.font = '700 ' + nameFontPx + 'px "Futura", "Futura PT", "Futura Medium", "Jost", "Century Gothic", ui-sans-serif, system-ui, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(activeReg[1], leftX, baseCy + 40);

    // 17-segment horizontal bar
    const barTotalW = Math.min(cw * 0.44, 336);
    const segGap = 5;
    const segW = Math.max(6, (barTotalW - segGap * (PH_REGIONS.length - 1)) / PH_REGIONS.length);
    const barY = baseCy + 60;
    for (let i = 0; i < PH_REGIONS.length; i++) {
      const sx = leftX + i * (segW + segGap);
      ctx.fillStyle = i <= regIdx ? BLUE : 'rgba(79, 195, 247, 0.22)';
      roundRect(sx, barY, segW, 3.5, 1.75);
      ctx.fill();
    }
    ctx.restore();

    // ── Right-side Dotted Philippine Archipelago Map ────────────────────────
    const mapPadTop = 6;
    const mapPadBot = 8;
    const mapH = Math.max(180, ch - mapPadTop - mapPadBot);
    const mapW = mapH * 0.72;
    const mapX = Math.max(cw * 0.50, cw * 0.74 - mapW * 0.5);
    const mapY = mapPadTop;

    const manilaNx = PH_REGIONS[0][2];
    const manilaNy = PH_REGIONS[0][3];
    const manilaX = mapX + manilaNx * mapW;
    const manilaY = mapY + manilaNy * mapH;

    // 1) Draw archipelago dot grid fading outward from Manila, then shimmering
    for (let i = 0; i < PH_DOTS.length; i++) {
      const d = PH_DOTS[i];
      const dx = d[0] - manilaNx;
      const dy = d[1] - manilaNy;
      const dist = Math.hypot(dx, dy);
      const wave = reduced() ? 1 : Math.max(0, Math.min(1, (intro * 1.45 - dist * 0.75) * 2.4));
      if (wave <= 0.01) continue;
      const shimmer = reduced() ? 0.42 : 0.30 + 0.16 * Math.sin(t * 2.1 - dist * 6.5 + (i % 19) * 0.35);
      ctx.fillStyle = 'rgba(79, 195, 247, ' + (wave * shimmer).toFixed(3) + ')';
      ctx.beginPath();
      ctx.arc(mapX + d[0] * mapW, mapY + d[1] * mapH, 1.35, 0, Math.PI * 2);
      ctx.fill();
    }

    // 2) Curved line from Manila (NCR) to active region marker
    if (regIdx > 0 && intro > 0.25) {
      const tx = mapX + activeReg[2] * mapW;
      const ty = mapY + activeReg[3] * mapH;
      const mx = (manilaX + tx) * 0.5;
      const my = (manilaY + ty) * 0.5;
      const vx = tx - manilaX;
      const vy = ty - manilaY;
      const len = Math.hypot(vx, vy) || 1;
      const bend = Math.min(48, len * 0.26);
      const cpx = mx - (vy / len) * bend;
      const cpy = my + (vx / len) * bend * 0.45;

      const drawP = reduced() ? 1 : Math.min(1, stepP / 0.38);
      const easeP = 1 - Math.pow(1 - drawP, 3);
      const steps = 28;
      const maxStep = Math.max(1, Math.round(steps * easeP));

      const grad = ctx.createLinearGradient(manilaX, manilaY, tx, ty);
      grad.addColorStop(0, 'rgba(79, 195, 247, 0.55)');
      grad.addColorStop(1, 'rgba(244, 166, 75, 0.95)');
      ctx.strokeStyle = grad;
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.beginPath();
      for (let s = 0; s <= maxStep; s++) {
        const u = (s / steps) * easeP;
        const inv = 1 - u;
        const px = inv * inv * manilaX + 2 * inv * u * cpx + u * u * tx;
        const py = inv * inv * manilaY + 2 * inv * u * cpy + u * u * ty;
        if (s === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
    }

    // 3) 17 Region Markers with ripples + active amber highlight & code label
    for (let i = 0; i < PH_REGIONS.length; i++) {
      const r = PH_REGIONS[i];
      const rx = mapX + r[2] * mapW;
      const ry = mapY + r[3] * mapH;
      const dist = Math.hypot(r[2] - manilaNx, r[3] - manilaNy);
      const appear = reduced() ? 1 : Math.max(0, Math.min(1, (intro * 1.4 - dist * 0.7) * 2.5));
      if (appear <= 0.01) continue;

      const isCurrent = i === regIdx;
      if (isCurrent) {
        const growP = reduced() ? 1 : Math.min(1, stepP / 0.28);
        const growEase = 1 - Math.pow(1 - growP, 3);
        const rippleR = 8 + ((t * 14) % 10);
        const rippleA = Math.max(0, (1 - (rippleR - 8) / 10) * 0.45);

        ctx.strokeStyle = 'rgba(244, 166, 75, ' + rippleA.toFixed(3) + ')';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(rx, ry, rippleR, 0, Math.PI * 2);
        ctx.stroke();

        ctx.save();
        ctx.shadowColor = 'rgba(244, 166, 75, 0.85)';
        ctx.shadowBlur = 14;
        ctx.fillStyle = DOT;
        ctx.beginPath();
        ctx.arc(rx, ry, 4.2 + 2.6 * growEase, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Region code beside active marker
        ctx.save();
        ctx.font = '700 12px "Futura", "Futura PT", "Futura Medium", "Jost", "Century Gothic", ui-sans-serif, system-ui, sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'left';
        ctx.shadowColor = 'rgba(4, 13, 30, 0.9)';
        ctx.shadowBlur = 6;
        ctx.fillText(r[0], rx + 10, ry + 4);
        ctx.restore();
      } else {
        const pulse = (t * 0.9 + i * 0.37) % 1;
        ctx.strokeStyle = 'rgba(79, 195, 247, ' + ((1 - pulse) * 0.28 * appear).toFixed(3) + ')';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(rx, ry, 3.5 + pulse * 5.5, 0, Math.PI * 2);
        ctx.stroke();

        ctx.save();
        ctx.shadowColor = 'rgba(79, 195, 247, 0.65)';
        ctx.shadowBlur = 6;
        ctx.fillStyle = 'rgba(79, 195, 247, ' + (0.85 * appear).toFixed(3) + ')';
        ctx.beginPath();
        ctx.arc(rx, ry, 2.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }
  }

  // 4. Governance: 0/4..4/4 progress ring on left + 4-item checklist on right
  const AUDIT_CHECKS = [
    'Every shipment',
    'Every label',
    'Every registration',
    'Audit result: pass'
  ];
  function drawRing(t, intro) {
    const elapsedSec = Math.max(0, (performance.now() - switchT) / 1000);
    const cycleDur = 6.4;
    const cyc = reduced() ? 4.8 : (elapsedSec % cycleDur);

    // Determine how many items are checked (0..4) and smooth ring fill
    const stepTimes = [0.55, 1.65, 2.75, 3.85];
    let count = 0;
    let ringTarget = 0;
    for (let i = 0; i < 4; i++) {
      if (cyc >= stepTimes[i]) {
        count = i + 1;
        const localP = Math.min(1, (cyc - stepTimes[i]) / 0.45);
        const easeP = 1 - Math.pow(1 - localP, 3);
        ringTarget = (i + easeP) / 4;
      }
    }
    if (reduced()) { count = 4; ringTarget = 1; }

    // ── Left: Progress Ring (0/4 .. 4/4) ────────────────────────────────────
    const cx = cw * 0.22;
    const cy = ch * 0.52;
    const r = Math.max(54, Math.min(cw * 0.14, ch * 0.36, 102));

    // Completion ripple when 4/4 reached
    if (count === 4 && !reduced()) {
      const sinceComplete = Math.max(0, cyc - stepTimes[3]);
      if (sinceComplete < 1.6) {
        const rp = sinceComplete / 1.6;
        ctx.strokeStyle = 'rgba(79, 195, 247, ' + ((1 - rp) * 0.45).toFixed(3) + ')';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(cx, cy, r + 4 + rp * 22, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    // Track ring
    ctx.lineWidth = 9.5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'rgba(79, 195, 247, 0.18)';
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();

    // Active progress arc
    if (ringTarget > 0.005) {
      ctx.strokeStyle = BLUE;
      ctx.beginPath();
      ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * ringTarget);
      ctx.stroke();
    }

    // Center X/4 label
    ctx.save();
    const ringFontPx = Math.round(Math.max(24, Math.min(36, r * 0.38)));
    ctx.font = '800 ' + ringFontPx + 'px "Futura", "Futura PT", "Futura Medium", "Jost", "Century Gothic", ui-sans-serif, system-ui, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(count + '/4', cx, cy + 1);
    ctx.restore();

    // ── Right: 4-Row Checklist ──────────────────────────────────────────────
    const listX = cw * 0.45;
    const lineEndX = cw * 0.95;
    const totalH = Math.min(ch * 0.76, 210);
    const startY = cy - totalH * 0.5 + 14;
    const rowStep = totalH / (AUDIT_CHECKS.length - 0.35);

    for (let i = 0; i < AUDIT_CHECKS.length; i++) {
      const ry = startY + i * rowStep;
      const checked = cyc >= stepTimes[i] || reduced();
      const checkP = reduced() ? 1 : Math.max(0, Math.min(1, (cyc - stepTimes[i]) / 0.32));
      const checkEase = 1 - Math.pow(1 - checkP, 3);

      const icx = listX + 13;
      const icy = ry - 5;
      const ir = 12;

      // Circle icon
      ctx.strokeStyle = checked ? BLUE : 'rgba(114, 197, 248, 0.24)';
      ctx.lineWidth = checked ? 1.7 : 1.3;
      ctx.beginPath();
      ctx.arc(icx, icy, ir, 0, Math.PI * 2);
      ctx.stroke();

      // Amber checkmark inside circle
      if (checked && checkEase > 0) {
        const a = { x: icx - 5, y: icy + 0.5 };
        const b = { x: icx - 1, y: icy + 4.5 };
        const d = { x: icx + 5.5, y: icy - 3.5 };
        ctx.strokeStyle = DOT;
        ctx.lineWidth = 2.3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        if (checkEase < 0.45) {
          const u = checkEase / 0.45;
          ctx.lineTo(a.x + (b.x - a.x) * u, a.y + (b.y - a.y) * u);
        } else {
          ctx.lineTo(b.x, b.y);
          const u = (checkEase - 0.45) / 0.55;
          ctx.lineTo(b.x + (d.x - b.x) * u, b.y + (d.y - b.y) * u);
        }
        ctx.stroke();
      }

      // Checklist label
      const tx = listX + 38;
      ctx.font = (checked ? '700 ' : '500 ') + '16px "Futura", "Futura PT", "Futura Medium", "Jost", "Century Gothic", ui-sans-serif, system-ui, sans-serif';
      ctx.fillStyle = checked ? '#ffffff' : 'rgba(184, 198, 220, 0.52)';
      ctx.textAlign = 'left';
      ctx.fillText(AUDIT_CHECKS[i], tx, ry);

      // Underline rule
      const lineY = ry + 13;
      ctx.strokeStyle = 'rgba(114, 197, 248, 0.16)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(tx, lineY);
      ctx.lineTo(lineEndX, lineY);
      ctx.stroke();

      if (checked && checkEase > 0) {
        ctx.strokeStyle = 'rgba(79, 195, 247, 0.65)';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(tx, lineY);
        ctx.lineTo(tx + (lineEndX - tx) * checkEase, lineY);
        ctx.stroke();
      }
    }
  }

  // 5. Education: 500 small dots (25x20), one per fellow, last 5 amber for "+"
  function drawDots(t, intro) {
    const cols = 25, rows = 20;
    const total = cols * rows;
    const gx = Math.max(12, cw * 0.03);
    const gw = cw - gx * 2;
    const gy = 10;
    const gh = Math.max(130, ch - 38);

    const filled = reduced() ? total : Math.round(total * (1 - Math.pow(1 - Math.min(1, intro * 1.12), 2.4)));
    const dotR = Math.max(2.1, Math.min(3.5, Math.min(gw / (cols * 3.1), gh / (rows * 2.7))));

    for (let rI = 0; rI < rows; rI++) {
      const y = gy + (rI / (rows - 1)) * gh;
      for (let c = 0; c < cols; c++) {
        const i = rI * cols + c;
        if (i >= filled) continue;
        const x = gx + (c / (cols - 1)) * gw;
        const isAmberPlus = i >= total - 5;
        const wave = reduced() ? 0.85 : 0.58 + 0.42 * (0.5 + 0.5 * Math.sin(t * 2.5 - c * 0.24 - rI * 0.18));
        ctx.fillStyle = isAmberPlus
          ? DOT
          : 'rgba(79, 195, 247, ' + wave.toFixed(3) + ')';
        ctx.beginPath();
        ctx.arc(x, y, dotR, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.save();
    ctx.font = '500 12px "Futura", "Futura PT", "Futura Medium", "Jost", "Century Gothic", ui-sans-serif, system-ui, sans-serif';
    ctx.fillStyle = 'rgba(184, 198, 220, 0.72)';
    ctx.textAlign = 'left';
    ctx.fillText('Each dot = one fellow trained', gx - 2, gy + gh + 22);
    ctx.restore();
  }

  // 6. Continuity: 24-segment dial on left + "Every hour. Every day." & M..S circles on right
  const WEEK_DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  function drawDial(t, intro) {
    const cx = cw * 0.26;
    const cy = ch * 0.52;
    const r = Math.max(68, Math.min(cw * 0.18, ch * 0.38, 122));

    const cycleU = reduced() ? 0.25 : ((t * 0.075) % 1);
    const curHour = Math.floor(cycleU * 24) % 24;
    const ang = -Math.PI / 2 + cycleU * Math.PI * 2;

    // 24 Hour Arc Segments
    const segThick = Math.max(6.5, r * 0.082);
    const gapRad = 0.032;
    ctx.lineWidth = segThick;
    ctx.lineCap = 'round';
    for (let h = 0; h < 24; h++) {
      const a0 = -Math.PI / 2 + (h / 24) * Math.PI * 2 + gapRad;
      const a1 = -Math.PI / 2 + ((h + 1) / 24) * Math.PI * 2 - gapRad;
      ctx.strokeStyle = h <= curHour ? BLUE : 'rgba(79, 195, 247, 0.22)';
      ctx.beginPath();
      ctx.arc(cx, cy, r, a0, a1);
      ctx.stroke();
    }

    // Cardinal 00 / 06 / 12 / 18 labels
    ctx.save();
    ctx.font = '500 12.5px "Futura", "Futura PT", "Futura Medium", "Jost", "Century Gothic", ui-sans-serif, system-ui, sans-serif';
    ctx.fillStyle = 'rgba(184, 198, 220, 0.78)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('00', cx, cy - r - 18);
    ctx.fillText('06', cx + r + 22, cy);
    ctx.fillText('12', cx, cy + r + 19);
    ctx.fillText('18', cx - r - 22, cy);

    // Center digital clock & status
    const hh = (curHour < 10 ? '0' : '') + curHour + ':00';
    const clockFontPx = Math.round(Math.max(22, Math.min(34, r * 0.30)));
    ctx.font = '800 ' + clockFontPx + 'px "Futura", "Futura PT", "Futura Medium", "Jost", "Century Gothic", ui-sans-serif, system-ui, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(hh, cx, cy - 5);

    ctx.font = '500 12.5px "Futura", "Futura PT", "Futura Medium", "Jost", "Century Gothic", ui-sans-serif, system-ui, sans-serif';
    ctx.fillStyle = 'rgba(184, 198, 220, 0.82)';
    ctx.fillText('support desk · online', cx, cy + 19);
    ctx.restore();

    // Sweeping pointer hand + amber tip
    ctx.strokeStyle = BLUE;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(ang) * r * 0.54, cy + Math.sin(ang) * r * 0.54);
    ctx.lineTo(cx + Math.cos(ang) * r * 0.85, cy + Math.sin(ang) * r * 0.85);
    ctx.stroke();
    endDot(cx + Math.cos(ang) * r * 0.86, cy + Math.sin(ang) * r * 0.86);

    // Urgent case ping markers on the ring (e.g. at 08:00 and 15:00)
    const pings = [8 / 24, 15 / 24];
    for (let p = 0; p < pings.length; p++) {
      const pu = pings[p];
      const pa = -Math.PI / 2 + pu * Math.PI * 2;
      const px = cx + Math.cos(pa) * r;
      const py = cy + Math.sin(pa) * r;
      const activePing = Math.abs(cycleU - pu) < 0.14;
      ctx.strokeStyle = activePing ? 'rgba(244, 166, 75, 0.65)' : 'rgba(184, 198, 220, 0.25)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(pa) * r * 0.64, cy + Math.sin(pa) * r * 0.64);
      ctx.lineTo(px, py);
      ctx.stroke();

      ctx.strokeStyle = activePing ? 'rgba(244, 166, 75, 0.45)' : 'rgba(184, 198, 220, 0.22)';
      ctx.beginPath();
      ctx.arc(px, py, activePing ? 10 : 8, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = activePing ? DOT : 'rgba(244, 166, 75, 0.55)';
      ctx.beginPath();
      ctx.arc(px, py, activePing ? 5 : 4, 0, Math.PI * 2);
      ctx.fill();
    }

    // ── Right: "Every hour. Every day." + M T W T F S S circles ─────────────
    const rx = cw * 0.53;
    const headPx = Math.round(Math.max(22, Math.min(30, cw * 0.038)));
    const topY = cy - 44;

    ctx.save();
    ctx.textAlign = 'left';
    ctx.font = '700 ' + headPx + 'px "Futura", "Futura PT", "Futura Medium", "Jost", "Century Gothic", ui-sans-serif, system-ui, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Every hour.', rx, topY);
    ctx.fillStyle = BLUE;
    ctx.fillText('Every day.', rx, topY + headPx * 1.22);

    ctx.font = '500 13.5px "Futura", "Futura PT", "Futura Medium", "Jost", "Century Gothic", ui-sans-serif, system-ui, sans-serif';
    ctx.fillStyle = 'rgba(184, 198, 220, 0.88)';
    ctx.fillText('Urgent cases go to the front of the queue.', rx, topY + headPx * 1.22 + 28);

    const activeDay = reduced() ? 2 : Math.floor((t * 0.35) % 7);
    const dr = Math.max(13, Math.min(17.5, (cw * 0.42) / 16));
    const dStep = dr * 2 + Math.max(6, dr * 0.52);
    const dy = topY + headPx * 1.22 + 68;

    for (let d = 0; d < WEEK_DAYS.length; d++) {
      const dx = rx + dr + d * dStep;
      const isToday = d === activeDay;
      if (isToday) {
        ctx.fillStyle = BLUE;
        ctx.beginPath();
        ctx.arc(dx, dy, dr, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.strokeStyle = 'rgba(79, 195, 247, 0.36)';
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.arc(dx, dy, dr, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.font = (isToday ? '700 ' : '600 ') + '12.5px "Futura", "Futura PT", "Futura Medium", "Jost", "Century Gothic", ui-sans-serif, system-ui, sans-serif';
      ctx.fillStyle = isToday ? '#041022' : 'rgba(220, 232, 248, 0.85)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(WEEK_DAYS[d], dx, dy + 0.5);
    }
    ctx.restore();
  }

  const DRAW = {
    'cold-chain': drawColdChain,
    'symposia-bars': drawBars,
    'archipelago-routes': drawArchipelago,
    'governance-ring': drawRing,
    'education-matrix': drawDots,
    'continuity-dial': drawDial
  };

  // ─── Loop / auto-advance ───────────────────────────────────────────────────
  function paused() { return hoverPause || userPause || modalOpen || reduced(); }

  function tick(now) {
    raf = 0;
    if (!slideOn || document.hidden) return;
    const dt = Math.min(100, Math.max(0, now - lastT));
    lastT = now;
    if (!paused()) {
      elapsed += dt;
      const pillarDuration = (tabs[active] && tabs[active].dataset.visual === 'archipelago-routes') ? (PH_REGIONS.length * REGION_STEP_SEC * 1000) : AUTO_ADVANCE_MS;
      if (elapsed >= pillarDuration) { select(active + 1, false); return; }
    }
    if (ctx) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cw, ch);
      const intro = reduced() ? 1 : Math.min(1, (now - switchT) / INTRO_MS);
      const fn = DRAW[tabs[active].dataset.visual] || drawColdChain;
      fn(now / 1000, intro);
    }
    if (!reduced()) raf = requestAnimationFrame(tick);
  }

  function start() {
    if (!raf && slideOn && !document.hidden) {
      lastT = performance.now();
      raf = requestAnimationFrame(tick);
    }
  }
  function stop() { if (raf) { cancelAnimationFrame(raf); raf = 0; } }

  // ─── Interaction ───────────────────────────────────────────────────────────
  tabs.forEach((t, i) => t.addEventListener('click', () => select(i, false)));

  if (tablist) {
    tablist.addEventListener('keydown', (e) => {
      const map = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
      if (map[e.key]) { e.preventDefault(); e.stopPropagation(); select(active + map[e.key], true); }
      else if (e.key === 'Home') { e.preventDefault(); select(0, true); }
      else if (e.key === 'End') { e.preventDefault(); select(tabs.length - 1, true); }
    });
  }

  if (root) {
    root.addEventListener('pointerenter', () => { hoverPause = true; });
    root.addEventListener('pointerleave', () => { hoverPause = false; start(); });
    root.addEventListener('focusin', () => { hoverPause = true; });
    root.addEventListener('focusout', (e) => { if (!root.contains(e.relatedTarget)) { hoverPause = false; start(); } });
  }

  // Cursor spotlight + glowing border + up-to-3° interactive tilt on main card
  if (card) {
    card.addEventListener('pointermove', (e) => {
      if (reduced()) return;
      const rect = card.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mx', x.toFixed(1) + 'px');
      card.style.setProperty('--my', y.toFixed(1) + 'px');
      card.style.setProperty('--spot-o', '1');
      if (!isTouch() && window.innerWidth >= 1024) {
        const nx = (x / rect.width) - 0.5;
        const ny = (y / rect.height) - 0.5;
        card.style.setProperty('--rx', (-ny * 6).toFixed(2) + 'deg');
        card.style.setProperty('--ry', (nx * 6).toFixed(2) + 'deg');
      }
    });
    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--spot-o', '0');
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
    });
  }

  // Subtle cursor spotlight on left list card
  if (listCard) {
    listCard.addEventListener('pointermove', (e) => {
      if (reduced()) return;
      const rect = listCard.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      listCard.style.setProperty('--mx', (e.clientX - rect.left).toFixed(1) + 'px');
      listCard.style.setProperty('--my', (e.clientY - rect.top).toFixed(1) + 'px');
      listCard.style.setProperty('--spot-o', '1');
    });
    listCard.addEventListener('pointerleave', () => {
      listCard.style.setProperty('--spot-o', '0');
    });
  }

  if (pauseBtn) {
    if (reduced()) pauseBtn.hidden = true;
    pauseBtn.addEventListener('click', () => {
      userPause = !userPause;
      const pl = pauseBtn.querySelector('.wwd-pause-label');
      if (pl) pl.textContent = userPause ? 'Play' : 'Pause';
      pauseBtn.setAttribute('aria-pressed', userPause ? 'true' : 'false');
      start();
    });
  }

  // ─── Slide visibility (lazy start / stop) ──────────────────────────────────
  const hostSlide = slide.closest('.about-slide') || slide;
  function checkVisible() {
    const on = !hostSlide.classList.contains('opacity-0') && hostSlide.classList.contains('opacity-100');
    if (on === slideOn) return;
    slideOn = on;
    if (on) {
      resize();
      syncSlidingMarker();
      elapsed = 0;
      switchT = performance.now();
      countUp(tabs[active]);
      if (!entryPlayed) { entryPlayed = true; entry(); }
      start();
    } else {
      stop();
      entryPlayed = false;
    }
  }
  new MutationObserver(checkVisible).observe(hostSlide, { attributes: true, attributeFilter: ['class'] });
  if (wrap && typeof ResizeObserver !== 'undefined') {
    new ResizeObserver(() => { if (slideOn) { resize(); syncSlidingMarker(); start(); } }).observe(wrap);
  }
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); else start(); });

  // ─── Learn-more detail card (#wwd-modal) ───────────────────────────────────
  function closeModal() {
    const m = $('wwd-modal');
    if (!m || m.style.display === 'none') return;
    modalOpen = false;
    document.body.classList.remove('mediq-subpage-modal-open');
    m.style.opacity = '0';
    setTimeout(() => { m.style.display = 'none'; }, 300);
    start();
  }

  function openModal(btn) {
    const m = $('wwd-modal');
    if (!m) return;
    modalOpen = true;
    document.body.classList.add('mediq-subpage-modal-open');
    const d = btn.dataset;
    $('wwd-modal-img').src = d.img;
    $('wwd-modal-img').alt = d.title;
    $('wwd-modal-tag').textContent = 'Pillar ' + d.n + ' \u00b7 ' + d.cat;
    $('wwd-modal-title').textContent = d.title;
    $('wwd-modal-desc').textContent = d.desc;
    $('wwd-modal-sl').textContent = d.sl;
    $('wwd-modal-sv').textContent = d.sv;
    const ul = $('wwd-modal-pts');
    ul.innerHTML = '';
    (d.pts || '').split('|').forEach((txt) => {
      const li = document.createElement('li');
      li.className = 'flex items-center gap-3';
      const badge = window.__createWwdBulletBadge ? window.__createWwdBulletBadge(txt) : null;
      if (badge) {
        li.appendChild(badge);
      } else {
        const dot = document.createElement('span');
        dot.className = 'size-1.5 rounded-full bg-sky shrink-0';
        li.appendChild(dot);
      }
      const s = document.createElement('span');
      s.textContent = txt;
      li.appendChild(s);
      ul.appendChild(li);
    });
    m.style.display = 'flex';
    requestAnimationFrame(() => { m.style.opacity = '1'; });
  }

  document.addEventListener('click', (e) => {
    const forgeOpenBtn = e.target.closest && e.target.closest('#wwd-forge-open-modal');
    if (forgeOpenBtn) {
      const idx = window.__wwdForgeActiveStage || 0;
      const activeCard = slide.querySelector(`[data-wwd-row="${idx}"]`) || slide.querySelector('.wwd-card');
      if (activeCard) openModal(activeCard);
      return;
    }
    const btn = e.target.closest && e.target.closest('.wwd-card');
    if (btn) {
      const rowIdx = btn.getAttribute('data-wwd-row');
      if (rowIdx !== null && typeof window.jumpWwdForgeStage === 'function') {
        window.jumpWwdForgeStage(parseInt(rowIdx, 10));
      } else {
        openModal(btn);
      }
      return;
    }
    const m = $('wwd-modal');
    if (!m || m.style.display === 'none') return;
    if (e.target === m || e.target.closest('#wwd-modal-close') || e.target.closest('#wwd-modal-cta')) closeModal();
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  // Contextual Glowing Rounded-Square Icons for "What We Do" subpages (#wwd-forge-services-block & #wwd-modal-pts)
  function getWwdIconSvgPaths(label) {
    const t = String(label || '').toLowerCase();
    if (t.includes('importation') || t.includes('sourcing')) return '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>';
    if (t.includes('cleanroom') || t.includes('inventory')) return '<path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/><path d="M12 22V12"/><path d="m3.3 7 7.703 4.734a2 2 0 0 0 1.994 0L20.7 7"/>';
    if (t.includes('cold-chain') || t.includes('gdp')) return '<path d="M2 12h20"/><path d="M12 2v20"/><path d="m20 16-4-4 4-4"/><path d="m4 8 4 4-4 4"/><path d="m16 4-4 4-4-4"/><path d="m8 20 4-4 4 4"/>';
    if (t.includes('tracking') || t.includes('port-of-entry')) return '<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>';
    if (t.includes('brand positioning') || t.includes('market insight')) return '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>';
    if (t.includes('launch') || t.includes('multichannel')) return '<path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>';
    if (t.includes('field sales')) return '<path d="M12 6v4"/><path d="M14 14h-4"/><path d="M14 18h-4"/><path d="M14 8h-4"/><path d="M18 12h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2h2"/><path d="M18 22V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v18"/>';
    if (t.includes('performance review') || t.includes('partner feedback')) return '<path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/>';
    if (t.includes('commercial planning') || t.includes('customer insight')) return '<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>';
    if (t.includes('channel expansion') || t.includes('account development')) return '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/>';
    if (t.includes('hospital') || t.includes('procurement')) return '<rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>';
    if (t.includes('principal collaboration') || t.includes('principal alignment')) return '<path d="m11 17 2 2a1 1 0 1 0 3-3"/><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4"/><path d="m21 3 1 11h-2"/><path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3"/><path d="M3 4h8"/>';
    if (t.includes('regulatory') || t.includes('authorization')) return '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>';
    if (t.includes('lot-level') || t.includes('traceability')) return '<path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><path d="M8 7v10"/><path d="M12 7v10"/><path d="M16 7v10"/>';
    if (t.includes('sop-guided') || t.includes('handling')) return '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/>';
    if (t.includes('documentation') || t.includes('product-scoped')) return '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>';
    if (t.includes('training')) return '<path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/>';
    if (t.includes('demonstrations')) return '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>';
    if (t.includes('educational events')) return '<rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/><path d="m9 16 2 2 4-4"/>';
    if (t.includes('technical engagement')) return '<path d="M6 18h8"/><path d="M3 22h18"/><path d="M14 22a7 7 0 1 0 0-14h-1"/><path d="M9 14h2"/><path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z"/><path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3"/>';
    if (t.includes('follow-up') || t.includes('customer support')) return '<path d="M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Zm0 0a9 9 0 1 1 18 0m0 0v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3Z"/><path d="M21 16v2a4 4 0 0 1-4 4h-5"/>';
    if (t.includes('feedback coordination')) return '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>';
    if (t.includes('escalation')) return '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><line x1="4.93" y1="4.93" x2="9.17" y2="9.17"/><line x1="14.83" y1="14.83" x2="19.07" y2="19.07"/><line x1="14.83" y1="9.17" x2="19.07" y2="4.93"/><line x1="4.93" y1="19.07" x2="9.17" y2="14.83"/>';
    return '<path d="M20 6 9 17l-5-5"/>';
  }

  function createWwdBulletBadge(label) {
    const span = document.createElement('span');
    span.className = 'grid place-items-center size-7 rounded-lg border border-[#72c5f8]/30 bg-[#72c5f8]/10 text-[#72c5f8] shrink-0 shadow-[0_0_14px_rgba(114,197,248,0.18)]';
    span.innerHTML = `<svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${getWwdIconSvgPaths(label)}</svg>`;
    return span;
  }
  window.__createWwdBulletBadge = createWwdBulletBadge;

  const wwdForgeRoot = document.getElementById('wwd-forge-services-block');
  if (wwdForgeRoot) {
    wwdForgeRoot.querySelectorAll('[data-wwd-forge-panel] .grid > div').forEach((row) => {
      const dot = row.querySelector('span.rounded-full');
      const labelEl = row.querySelector('span:last-child');
      if (!dot || !labelEl) return;
      row.classList.remove('gap-2.5', 'text-white/75');
      row.classList.add('gap-3', 'text-white/80');
      dot.replaceWith(createWwdBulletBadge(labelEl.textContent));
    });
  }

  select(0, false);
  checkVisible();
})();

/* ========================================================================= */
/* MULTI-SECTION DECK CONTROLLER (Brands, Services, Resources, News, Contact)*/
/* ========================================================================= */
(function initMultiSectionDecks() {
  const DECK_MAP = {
    brands: 'brands',
    services: 'distribution',
    resources: 'resources',
    news: 'activities',
    contact: 'contact'
  };

  const SUBPAGE_DECKS = new Set(['brands', 'services', 'resources']);

  const state = {
    brands: 0,
    services: 0,
    resources: 0,
    news: 0,
    contact: 0
  };

  function goToDeckSlide(deckKey, idx, shouldScroll = false, opts = {}) {
    const secId = DECK_MAP[deckKey];
    const sec = secId ? document.getElementById(secId) : null;
    if (!sec) return;

    const slides = sec.querySelectorAll(`.deck-slide[data-deck="${deckKey}"]`);
    if (!slides.length) return;

    const total = slides.length;
    if (idx < 0) idx = 0;
    if (idx >= total) idx = total - 1;

    const prevIdx = state[deckKey] || 0;
    const isSubpage = SUBPAGE_DECKS.has(deckKey) && idx >= 1;
    if (isSubpage) {
      window.__lastExplicitSubpageOpenTime = performance.now();
    }
    state[deckKey] = idx;
    const displayIdx = (deckKey === 'services' && idx >= 1 && idx <= 6) ? 7 : idx;
    if (deckKey === 'services' && typeof window.__setServicesBookCarouselActive === 'function') {
      const wantsBookshelf = idx >= 1 && idx <= 7;
      const bookFocusIdx = (idx >= 1 && idx <= 6) ? (idx - 1) : 0;
      window.__setServicesBookCarouselActive(wantsBookshelf, bookFocusIdx);
    }

    slides.forEach((slide, i) => {
      slide.classList.remove(
        'opacity-100', 'pointer-events-auto', 'translate-x-0', 'z-10',
        'opacity-0', 'pointer-events-none', '-translate-x-12', 'translate-x-12', 'z-0'
      );
      if (i === displayIdx) {
        slide.classList.add('opacity-100', 'pointer-events-auto', 'translate-x-0', 'z-10');
        slide.scrollTop = 0;

        if (deckKey === 'brands' && displayIdx === 0 && typeof window.closeAllPrincipalPel === 'function') {
          window.closeAllPrincipalPel();
        }
        if (deckKey === 'brands' && (displayIdx === 1 || displayIdx === 2)) {
          if (prevIdx === 0 && typeof window.closeAllPrincipalPel === 'function') {
            window.closeAllPrincipalPel();
          }
          if (typeof window.refreshPrincipalPel === 'function') {
            requestAnimationFrame(() => window.refreshPrincipalPel());
            setTimeout(() => window.refreshPrincipalPel(), 240);
          }
        }
        if (typeof window.__triggerLotticiStagger === 'function') {
          window.__triggerLotticiStagger(slide);
        }
        if (isSubpage && slide.id !== 'srv-book-carousel-slide' && slide.firstElementChild && typeof window.__playSubpage3DEntrance === 'function') {
          const dir = (prevIdx > 0 && idx < prevIdx) ? -1 : 1;
          window.__playSubpage3DEntrance(slide.firstElementChild, dir);
        }
      } else if (i < displayIdx) {
        slide.classList.add('opacity-0', 'pointer-events-none', '-translate-x-12', 'z-0');
      } else {
        slide.classList.add('opacity-0', 'pointer-events-none', 'translate-x-12', 'z-0');
      }
    });

    // Toggle attached top sub-navbar ([data-deck-bar]) flush under #site-header
    const subpageBar = sec.querySelector(`[data-deck-bar="${deckKey}"]`);
    if (subpageBar) {
      if (isSubpage) {
        subpageBar.classList.remove('opacity-0', 'pointer-events-none', '-translate-y-2');
        subpageBar.classList.add('opacity-100', 'pointer-events-auto', 'translate-y-0');
      } else {
        subpageBar.classList.remove('opacity-100', 'pointer-events-auto', 'translate-y-0');
        subpageBar.classList.add('opacity-0', 'pointer-events-none', '-translate-y-2');
      }
    }

    // Highlight active tab in the attached sub-navbar
    sec.querySelectorAll(`[data-deck-pill^="${deckKey}:"]`).forEach((pill) => {
      const target = pill.getAttribute('data-deck-pill');
      pill.classList.toggle('is-active', target === `${deckKey}:${idx}`);
    });

    if (isSubpage) {
      if (typeof window.__engageSubpageLock === 'function') {
        window.__engageSubpageLock(deckKey, sec);
      } else {
        document.documentElement.classList.add('mediq-subpage-locked');
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
        document.documentElement.style.scrollSnapType = 'none';
      }
    } else if (!opts.silentReset) {
      if (typeof window.__resetAllSubpagesExcept === 'function') {
        window.__resetAllSubpagesExcept(null);
      }
      if (typeof window.__unlockOuterPageScroll === 'function') {
        window.__unlockOuterPageScroll();
      } else {
        document.documentElement.classList.remove('mediq-subpage-locked');
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
        document.documentElement.style.scrollSnapType = '';
      }
      if (shouldScroll) {
        if (typeof window.grailScrollTo === 'function') {
          window.grailScrollTo(sec);
        } else {
          sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }
  }

  window.goToDeckSlide = goToDeckSlide;
  window.__getDeckSlideIndex = (deckKey) => state[deckKey] || 0;

  // Interactive Category Chips filter for Principal Brands Portfolio (Slide 1 of #brands)
  window.filterBrandsPortfolio = function (cat) {
    const sec = document.getElementById('brands');
    if (!sec) return;
    sec.querySelectorAll('.br-cat-chip[data-br-chip]').forEach((chip) => {
      const isActive = chip.getAttribute('data-br-chip') === cat;
      chip.className = isActive
        ? 'br-cat-chip min-h-[38px] px-4 rounded-full text-xs font-semibold transition-all cursor-pointer bg-[#3aa0db] text-[#0a1d40] border border-[#72c5f8] shadow-[0_0_16px_rgba(58,160,219,0.35)]'
        : 'br-cat-chip min-h-[38px] px-4 rounded-full text-xs font-medium transition-all cursor-pointer bg-[#0a1d40]/75 text-[#dce7f5] border border-[#72c5f8]/25 hover:border-[#72c5f8]/60 hover:text-white';
    });
    sec.querySelectorAll('.br-cat-col[data-br-col]').forEach((col) => {
      const colCat = col.getAttribute('data-br-col');
      const match = cat === 'all' || colCat === cat;
      col.style.opacity = match ? '1' : '0.28';
      col.style.filter = match ? 'none' : 'grayscale(0.6)';
    });
  };

  // feature-24 Interactive Console Pill Selector & Inquiry Navigation (Slide 1 & Slide 2 of #brands)
  window.selectBrandsF24Topic = function (inputId, topicText) {
    const input = document.getElementById(inputId);
    if (!input) return;
    input.value = topicText;
    input.focus();
  };

  window.submitBrandsF24Inquiry = function (inputId, inquiryType) {
    const input = document.getElementById(inputId);
    const contactSec = document.getElementById('contact');
    const inquirySelect = document.querySelector('#contact select[name="inquiry"], #contact #contact-inquiry, #contact #inq-subject');
    if (inquirySelect && inquiryType) {
      if (inquirySelect.tagName === 'SELECT') {
        Array.from(inquirySelect.options).forEach((opt) => {
          if (opt.value === inquiryType || opt.text.includes(inquiryType)) {
            inquirySelect.value = opt.value;
          }
        });
      } else {
        inquirySelect.value = inquiryType;
      }
    }
    const msgField = document.querySelector('#contact textarea[name="message"], #contact textarea');
    if (msgField && input && input.value.trim()) {
      msgField.value = input.value.trim();
    }
    if (typeof window.goToDeckSlide === 'function') {
      window.goToDeckSlide('brands', 0, false, { silentReset: true });
    }
    if (contactSec) {
      if (typeof window.grailSnapTo === 'function') {
        window.grailSnapTo(contactSec);
      } else {
        contactSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  // feature-24 Scroll-Triggered Directional Reveal for #brands Slide 2 + Pigment Experience Ledger for Slide 1
  (function initBrandsFeature24Reveals() {
    const scroller = document.getElementById('brands-profiles-scroller');
    if (scroller) {
      const items = scroller.querySelectorAll('[data-br-f24]');
      if (items.length && 'IntersectionObserver' in window) {
        const io = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add('is-in');
                io.unobserve(entry.target);
              }
            });
          },
          { root: scroller, threshold: 0.05 }
        );
        items.forEach((el) => io.observe(el));
      } else {
        items.forEach((el) => el.classList.add('is-in'));
      }
    }
  })();

  // Pigment Experience Ledger — Shared 2D Canvas Watercolour Wash & Interactive Row Engine (#brands Slide 1 & Slide 2)
  (function initBrandsPigmentLedgers() {
    const roots = Array.from(document.querySelectorAll('#brands .pel-root'));
    if (!roots.length) return;

    const BLEED = 64;
    const BLEED_X = 40;
    const MAX_BUFFER_W = 540;
    const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v);
    const smoothstep = (a, b, x) => {
      const t = clamp((x - a) / (b - a), 0, 1);
      return t * t * (3 - 2 * t);
    };
    const hexToRgb = (hex) => {
      let h = (hex || '#3aa0db').replace('#', '').trim();
      if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
      const v = parseInt(h.slice(0, 6), 16);
      return Number.isNaN(v) ? [58, 160, 219] : [(v >> 16) & 255, (v >> 8) & 255, v & 255];
    };
    const rampAt = (edge, body, core, t) => {
      const u = clamp(t, 0, 1);
      const a = u < 0.5 ? edge : body;
      const b = u < 0.5 ? body : core;
      const k = u < 0.5 ? u * 2 : (u - 0.5) * 2;
      return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
    };
    const hash2 = (x, y, seed) => {
      let h = (Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263) + Math.imul(seed | 0, 2246822519)) | 0;
      h = Math.imul(h ^ (h >>> 13), 1274126177);
      h ^= h >>> 16;
      return (h >>> 0) / 4294967296;
    };
    const valueNoise = (x, y, seed) => {
      const ix = Math.floor(x), iy = Math.floor(y);
      const fx = x - ix, fy = y - iy;
      const sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy);
      const a = hash2(ix, iy, seed), b = hash2(ix + 1, iy, seed);
      const c = hash2(ix, iy + 1, seed), d = hash2(ix + 1, iy + 1, seed);
      return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy;
    };
    const makeBlobs = (seed) => {
      const r = (i) => hash2(i, 7, seed);
      const out = [];
      for (let i = 0; i < 7; i++) {
        out.push({
          ox: -1 + (2 * i) / 6 + (r(i) - 0.5) * 0.22,
          oy: (r(i + 20) - 0.5) * 0.85,
          r: 0.74 + r(i + 40) * 0.34 - Math.abs(i - 3) * 0.05,
          w: 0.82 + r(i + 60) * 0.42 + (i === 3 ? 0.25 : 0),
          ph: r(i + 80) * 6.28,
          sp: 0.2 + r(i + 100) * 0.32
        });
      }
      return out;
    };

    const instances = [];

    function setupLedger(root) {
      const rows = Array.from(root.querySelectorAll('.pel-row[data-pel-row]'));
      if (!rows.length) return null;

      let openIndex = null;
      let hovered = null;
      let focused = null;
      const strength = 0.82;
      const residue = 0.24;
      const reduced = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
      let raf = 0, last = 0, frame = 0, clock = 0;

      const smears = rows.map((li, i) => {
        const seed = i * 7919 + 101;
        const rawColors = (li.getAttribute('data-colors') || '#3aa0db,#0284c7,#72c5f8').split(',').map(hexToRgb);
        const ramp = [rawColors[2].map((v, j) => v * 0.7 + rawColors[1][j] * 0.3), rawColors[1], rawColors[0]];
        return {
          li,
          canvas: li.querySelector('.pel-ink'),
          btn: li.querySelector('.pel-trigger'),
          panel: li.querySelector('.pel-panel'),
          nameEl: li.querySelector('.pel-name'),
          ctx: null, img: null,
          noise: new Float32Array(0), hue: new Float32Array(0), low: new Float32Array(0), grain: new Float32Array(0),
          bw: 0, bh: 0, cssW: 0, cssH: 0, headH: 0,
          homeX: 0, homeY: 0, bleedX: BLEED_X, nameW: 0, reach: i === 0 ? 0.62 : 0.54, dry: i > 2 ? 0.18 : 0.04,
          dim: 1, dimTarget: 1, nameTop: 0, nameH: 0, lastActive: performance.now(),
          ramp, level: 0.2, target: 0.75,
          cx: 0, cy: 0, tx: 0, ty: 0, pointer: false,
          blobs: makeBlobs(seed), seed, painted: false
        };
      });

      const homeOf = (s) => [s.homeX ? s.bleedX + s.homeX : s.cssW * 0.65, BLEED + (s.homeY || s.headH * 0.5)];

      const fitNames = () => {
        smears.forEach((s) => {
          const el = s.nameEl;
          if (!el || !el.parentElement) return;
          el.style.fontSize = '';
          const base = parseFloat(getComputedStyle(el).fontSize) || 56;
          const avail = el.parentElement.clientWidth;
          if (avail > 0 && el.scrollWidth > avail) {
            el.style.fontSize = Math.max(18, Math.floor(((base * avail) / el.scrollWidth) * 100) / 100) + 'px';
          }
        });
      };

      const sizeRow = (s) => {
        const li = s.li;
        if (!li || !s.canvas || !li.clientWidth) return;
        const w = li.clientWidth, h = li.offsetHeight;
        const headH = s.btn ? s.btn.offsetHeight : h;
        s.bleedX = clamp(Math.floor(li.getBoundingClientRect().left - root.getBoundingClientRect().left) - 4, 0, BLEED_X);
        s.cssW = w + s.bleedX * 2;
        s.cssH = h + BLEED * 2;
        s.headH = headH || h;
        const scale = clamp(s.cssW / MAX_BUFFER_W, 1.8, 3.2);
        const bw = Math.max(8, Math.round(s.cssW / scale));
        const bh = Math.max(8, Math.round((s.cssH / s.cssW) * bw));
        s.canvas.style.left = -s.bleedX + 'px';
        s.canvas.style.width = 'calc(100% + ' + s.bleedX * 2 + 'px)';

        if (s.nameEl) {
          const lr = li.getBoundingClientRect();
          const nr = s.nameEl.getBoundingClientRect();
          if (nr.width > 0) {
            s.homeX = nr.left - lr.left + nr.width / 2;
            s.nameTop = nr.top - lr.top;
            s.nameH = nr.height;
            s.homeY = s.nameTop + nr.height * 0.5;
            s.nameW = nr.width;
          }
        }

        if (bw !== s.bw || bh !== s.bh || !s.img) {
          s.bw = bw; s.bh = bh;
          s.canvas.width = bw; s.canvas.height = bh;
          s.ctx = s.canvas.getContext('2d');
          s.img = s.ctx ? s.ctx.createImageData(bw, bh) : null;
          const n = bw * bh;
          s.noise = new Float32Array(n); s.hue = new Float32Array(n); s.low = new Float32Array(n); s.grain = new Float32Array(n);
          const u = scale / 3;
          for (let y = 0; y < bh; y++) {
            for (let x = 0; x < bw; x++) {
              const idx = y * bw + x, X = x * u, Y = y * u;
              s.noise[idx] = 0.55 * valueNoise(X / 11, Y / 8, s.seed) + 0.3 * valueNoise(X / 4, Y / 4, s.seed + 11) + 0.15 * valueNoise(X / 1.6, Y / 1.6, s.seed + 17);
              s.hue[idx] = valueNoise((0.8 * X + 0.6 * Y) / 20, (0.8 * Y - 0.6 * X) / 20, s.seed + 31);
              s.low[idx] = valueNoise(X / 40, Y / 40, s.seed + 41);
              s.grain[idx] = hash2(x, y, s.seed + 23);
            }
          }
          s.painted = false;
        }

        if (!s.pointer) {
          const [hx, hy] = homeOf(s);
          s.tx = hx; s.ty = hy;
          if (!s.cx) { s.cx = hx; s.cy = hy; }
        }
      };

      const paintSmear = (s, time) => {
        if (!s.ctx || !s.img) return;
        const data = s.img.data;
        data.fill(0);
        const level = s.level;
        if (level > 0.002) {
          const bw = s.bw, bh = s.bh, sc = s.cssW / bw;
          const grow = 1 - Math.pow(1 - clamp(level, 0, 1), 3);
          const narrow = s.cssW < 560;
          const span = clamp((s.nameW || s.cssW * 0.3) * s.reach, 60, 320) * (0.5 + 0.5 * grow);
          const R = clamp(s.headH * (narrow ? 0.95 : 1.12), 68, 195) * (0.55 + 0.45 * grow);
          const effStrength = Math.min(1, strength * 1.1) * s.dim;
          const fade = smoothstep(0, 0.35, level) * effStrength * (1 - s.dry * 0.08);
          const tooth = 0.76 + s.dry * 0.6;
          const [edge, body, core] = s.ramp;
          const faint = s.dim < 0.6;
          const n = s.blobs.length;
          const bx = new Float32Array(n), by = new Float32Array(n), br = new Float32Array(n);
          let x0 = bw, x1 = 0, y0 = bh, y1 = 0;
          const SQ = 1.65;
          for (let k = 0; k < n; k++) {
            const b = s.blobs[k];
            const px = s.cx + b.ox * span + Math.sin(time * b.sp + b.ph) * R * 0.12;
            const py = s.cy + b.oy * R * 0.4 + Math.cos(time * b.sp * 0.8 + b.ph) * R * 0.06;
            const rr = (b.r * R) / sc;
            bx[k] = px / sc; by[k] = py / sc; br[k] = rr * rr;
            x0 = Math.min(x0, bx[k] - rr); x1 = Math.max(x1, bx[k] + rr);
            y0 = Math.min(y0, by[k] - rr / SQ); y1 = Math.max(y1, by[k] + rr / SQ);
          }
          const xs = Math.max(0, Math.floor(x0)), xe = Math.min(bw - 1, Math.ceil(x1));
          const ys = Math.max(0, Math.floor(y0)), ye = Math.min(bh - 1, Math.ceil(y1));
          const bandTop = s.nameH ? s.nameTop - s.nameH * 0.3 : 0;
          const bandBottom = s.nameH ? s.nameTop + s.nameH * 1.02 : s.headH - 6;
          const top = (BLEED + Math.max(0, bandTop)) / sc;
          const bottom = (BLEED + bandBottom) / sc;
          const feather = Math.min(36, (bandBottom - bandTop) * 0.4) / sc;
          const side = Math.max(s.bleedX - 4, 28) / sc;

          for (let y = ys; y <= ye; y++) {
            const env = smoothstep(top, top + feather, y) * (1 - smoothstep(bottom - feather, bottom, y));
            if (env <= 0) continue;
            for (let x = xs; x <= xe; x++) {
              let f = 0;
              for (let k = 0; k < n; k++) {
                const dx = x - bx[k], dy = (y - by[k]) * SQ;
                const d2 = dx * dx + dy * dy;
                if (d2 < br[k]) {
                  const q = 1 - d2 / br[k];
                  f += q * q * s.blobs[k].w;
                }
              }
              f *= env * smoothstep(0, side, x) * (1 - smoothstep(bw - 1 - side, bw - 1, x));
              if (f < 0.04) continue;
              const i = y * bw + x;
              const fe = f * (1 - tooth / 2 + tooth * s.noise[i]) + (s.low[i] - 0.5) * 0.24;
              const wash = smoothstep(0.2, 0.34, fe);
              const rim = smoothstep(0.2, 0.3, fe) * (1 - smoothstep(0.3, 0.5, fe));
              const depth = clamp(smoothstep(0.3, 1.55, fe) + (s.hue[i] - 0.5) * 0.6 + rim * (0.55 + s.dry * 0.4), 0, 1);
              const c = rampAt(edge, body, core, faint ? 0.7 + depth * 0.3 : depth);
              const g = s.grain[i];
              const shade = 1 - rim * (0.07 + s.dry * 0.2) + (g - 0.5) * 0.05;
              const a = (wash * (0.86 + 0.14 * depth) + rim * 0.1) * (0.9 + 0.1 * g * (1 + s.dry)) * fade;
              const j = i * 4;
              data[j] = c[0] * shade; data[j + 1] = c[1] * shade; data[j + 2] = c[2] * shade;
              data[j + 3] = a > 1 ? 255 : a * 255;
            }
          }
        }
        s.ctx.putImageData(s.img, 0, 0);
        s.painted = level > 0.002;
      };

      const kick = () => {
        if (raf) return;
        const tick = (now) => {
          raf = 0;
          const dt = last ? Math.min(0.05, (now - last) / 1000) : 0.016;
          last = now; frame++;
          let alive = false, moving = false, breathing = false;
          for (const s of smears) {
            if (!s.ctx) continue;
            const prevLevel = s.level, prevX = s.cx, prevY = s.cy;
            if (reduced) {
              if (s.dim !== s.dimTarget) s.painted = false;
              s.dim = s.dimTarget; s.level = s.target; s.cx = s.tx; s.cy = s.ty;
            } else {
              const tau = s.target > s.level ? 0.28 : 0.18;
              s.level += (s.target - s.level) * (1 - Math.exp(-dt / tau));
              if (Math.abs(s.target - s.level) < 0.002) s.level = s.target;
              const prevDim = s.dim;
              s.dim += (s.dimTarget - s.dim) * (1 - Math.exp(-dt / 0.18));
              if (Math.abs(s.dimTarget - s.dim) < 0.002) s.dim = s.dimTarget;
              if (s.dim !== prevDim) s.painted = false;
              const k = 1 - Math.exp(-dt / 0.24);
              s.cx += (s.tx - s.cx) * k; s.cy += (s.ty - s.cy) * k;
            }
            const changed = Math.abs(s.level - prevLevel) > 1e-4 || Math.abs(s.cx - prevX) > 0.05 || Math.abs(s.cy - prevY) > 0.05;
            if (changed) moving = true;
            const active = s.level > 0.002 || s.target > 0;
            const breathes = active && !reduced && (now - s.lastActive < 3000);
            if (breathes) breathing = true;
            if (active) alive = true;
            if (active || s.painted) {
              if (changed || !s.painted || (breathes && frame % 2 === 0) || !active) paintSmear(s, clock);
            }
          }
          if (breathing) clock += dt;
          if (alive && (moving || breathing)) raf = requestAnimationFrame(tick);
          else last = 0;
        };
        raf = requestAnimationFrame(tick);
      };

      const syncTargets = () => {
        smears.forEach((s, i) => {
          const isOpen = i === openIndex;
          const pointed = i === hovered || i === focused;
          const elsewhere = (hovered !== null && hovered !== i) || (focused !== null && focused !== i);
          const lit = isOpen || pointed;
          s.li.setAttribute('data-open', isOpen ? 'true' : 'false');
          s.li.setAttribute('data-lit', lit ? 'true' : 'false');
          if (s.btn) s.btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
          if (s.panel) s.panel.setAttribute('aria-hidden', isOpen ? 'false' : 'true');

          const rest = Math.min(0.5, residue * (0.55 + s.dry * 0.75));
          const next = pointed || isOpen ? 1 : (residue > 0 ? 0.75 : 0);
          const dim = pointed ? 1 : isOpen ? (elsewhere ? 0.25 : 1) : rest;
          if (next !== s.target || dim !== s.dimTarget) s.lastActive = performance.now();
          s.target = next;
          s.dimTarget = dim;
          if (!s.pointer) {
            const [hx, hy] = homeOf(s);
            s.tx = hx; s.ty = hy;
          }
        });
        kick();
      };

      smears.forEach((s, i) => {
        const li = s.li;
        if (s.btn) {
          s.btn.addEventListener('click', () => {
            s.pointer = false;
            const [hx, hy] = homeOf(s);
            s.tx = hx; s.ty = hy;
            openIndex = openIndex === i ? null : i;
            syncTargets();
            setTimeout(() => smears.forEach(sizeRow), 180);
          });
          s.btn.addEventListener('focus', () => {
            if (s.btn.matches(':focus-visible')) {
              s.lastActive = performance.now();
              focused = i;
              syncTargets();
            }
          });
          s.btn.addEventListener('blur', () => {
            if (focused === i) { focused = null; syncTargets(); }
          });
        }
        const onMove = (e) => {
          if (e.pointerType === 'touch') return;
          const r = li.getBoundingClientRect();
          const hx = homeOf(s)[0];
          const w = s.nameW || s.cssW * 0.3;
          s.tx = clamp(hx + (e.clientX - r.left + s.bleedX - hx) * 0.35, hx - w * 0.18, hx + w * 0.12);
          s.lastActive = performance.now();
          const y0 = s.nameH ? s.nameTop + s.nameH * 0.3 : s.headH * 0.35;
          const y1 = s.nameH ? s.nameTop + s.nameH * 0.7 : s.headH * 0.7;
          s.ty = BLEED + clamp(e.clientY - r.top, y0, y1);
          if (s.level < 0.05) { s.cx = s.tx; s.cy = s.ty; }
          s.pointer = true;
          kick();
        };
        li.addEventListener('pointerenter', (e) => {
          if (e.pointerType !== 'touch') hovered = i;
          onMove(e);
          syncTargets();
        });
        li.addEventListener('pointermove', onMove);
        li.addEventListener('pointerleave', () => {
          s.pointer = false;
          const [hx, hy] = homeOf(s);
          s.tx = hx; s.ty = hy;
          if (hovered === i) hovered = null;
          syncTargets();
        });
      });

      const refresh = () => {
        fitNames();
        smears.forEach((s) => { sizeRow(s); s.painted = false; });
        syncTargets();
      };

      if (typeof ResizeObserver !== 'undefined') {
        const ro = new ResizeObserver(refresh);
        ro.observe(root);
        rows.forEach((li) => ro.observe(li));
      }
      refresh();
      return {
        id: root.id,
        refresh,
        closeAll: () => {
          if (openIndex === null) return;
          openIndex = null;
          syncTargets();
          setTimeout(() => smears.forEach(sizeRow), 180);
        },
        openRow: (i) => { openIndex = i; syncTargets(); setTimeout(() => smears.forEach(sizeRow), 360); }
      };
    }

    roots.forEach((root) => {
      const inst = setupLedger(root);
      if (inst) instances.push(inst);
    });

    window.refreshPrincipalPel = () => {
      instances.forEach((inst) => inst.refresh());
    };
    window.closeAllPrincipalPel = () => {
      instances.forEach((inst) => inst.closeAll());
    };
    window.openPrincipalPelRow = (i) => {
      const p1 = instances.find((inst) => inst.id === 'principal-pigment-ledger');
      if (p1) p1.openRow(i);
    };

    if (document.fonts) document.fonts.ready.then(window.refreshPrincipalPel).catch(() => {});
  })();

  // Bind all navbar and dropdown items with [data-deck-target="deck:index"]
  document.querySelectorAll('[data-deck-target]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const raw = link.getAttribute('data-deck-target') || '';
      const [deckKey, idxStr] = raw.split(':');
      const idx = parseInt(idxStr || '0', 10);
      if (deckKey && DECK_MAP[deckKey]) {
        e.preventDefault();
        goToDeckSlide(deckKey, idx, true);
      }
    });
  });

  // Also ensure any link to #contact opens Contact overview cleanly and resets open subpages
  document.addEventListener('click', (e) => {
    const a = e.target.closest && e.target.closest('a[href="#contact"]');
    if (a && !a.hasAttribute('data-deck-target')) {
      goToDeckSlide('contact', 0, true);
    }
  });

  // Keyboard Left/Right navigation strictly between subpages (1..N) when inside an active subpage
  window.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT')) return;
    for (const [deckKey, secId] of Object.entries(DECK_MAP)) {
      if (!SUBPAGE_DECKS.has(deckKey)) continue;
      if (deckKey === 'services') {
        const bookSlideEl = document.getElementById('srv-book-carousel-slide');
        if (bookSlideEl && bookSlideEl.classList.contains('opacity-100')) continue;
      }
      const cur = state[deckKey] || 0;
      if (cur < 1) continue;
      const sec = document.getElementById(secId);
      if (!sec) continue;
      const rect = sec.getBoundingClientRect();
      if (rect.top <= window.innerHeight * 0.45 && rect.bottom >= window.innerHeight * 0.55) {
        e.preventDefault();
        const nextIdx = e.key === 'ArrowRight' ? cur + 1 : Math.max(1, cur - 1);
        if (nextIdx !== cur) {
          goToDeckSlide(deckKey, nextIdx, false);
        }
        break;
      }
    }
  });

  // Disable deck smoke canvases on Plain White theme
  const canvases = document.querySelectorAll('.deck-smoke-canvas');
  canvases.forEach((canvas) => {
    canvas.style.display = 'none';
    return;
    if (canvas._smokeActive) return;
    canvas._smokeActive = true;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const isBrands = canvas.id === 'brands-smoke-canvas';
    const PALETTE = [
      [218, 229, 240],
      [230, 236, 242],
      [206, 222, 236],
      [238, 236, 230],
      [194, 214, 232]
    ];

    const reducedMotionMq = typeof window.matchMedia === 'function'
      ? window.matchMedia('(prefers-reduced-motion: reduce)')
      : { matches: false };

    let w = 1, h = 1, dpr = 0.5;
    let t = 0;

    function rand(min, max) { return min + Math.random() * (max - min); }
    function pickColor() { return PALETTE[Math.floor(Math.random() * PALETTE.length)]; }

    function resize() {
      dpr = 0.5;
      const rect = canvas.getBoundingClientRect();
      w = Math.max(1, Math.floor(rect.width || window.innerWidth));
      h = Math.max(1, Math.floor(rect.height || window.innerHeight));
      const tw = Math.max(1, Math.round(w * dpr));
      const th = Math.max(1, Math.round(h * dpr));
      if (canvas.width !== tw || canvas.height !== th) {
        canvas.width = tw;
        canvas.height = th;
      }
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    class DeckPuff {
      constructor(prewarm) { this.reset(prewarm); }
      reset(prewarm) {
        this.radius = rand(180, 420);
        this.x = rand(-this.radius * 0.25, w + this.radius * 0.25);
        this.y = prewarm ? rand(-this.radius * 0.1, h + this.radius * 0.3) : rand(h * 0.25, h + this.radius * 0.45);
        this.vx = rand(-0.22, 0.22);
        this.vy = -rand(0.16, 0.38);
        this.life = rand(600, 1400);
        this.age = prewarm ? Math.floor(rand(0, this.life)) : 0;
        this.maxOpacity = isBrands ? rand(0.08, 0.18) : rand(0.06, 0.15);
        const [r, g, b] = pickColor();
        this.sprite = window.__getMediqSmokeSprite(r, g, b);
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.age++;
        if (this.age >= this.life || this.y < -this.radius * 1.2) this.reset(false);
      }
      draw(c) {
        const p = Math.min(1, Math.max(0, this.age / this.life));
        const alpha = this.maxOpacity * Math.sin(p * Math.PI);
        if (alpha <= 0.002) return;
        c.globalAlpha = alpha;
        c.drawImage(this.sprite, this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
      }
    }

    class DeckTendril {
      constructor(prewarm) { this.reset(prewarm); }
      reset(prewarm) {
        this.nodeCount = Math.floor(rand(15, 24));
        this.spacing = rand(18, 28);
        this.baseX = rand(w * 0.04, w * 0.96);
        const chainHeight = this.nodeCount * this.spacing;
        this.baseY = prewarm ? rand(h * 0.20, h + chainHeight * 0.75) : rand(h * 0.50, h + chainHeight * 0.85);
        this.vy = -rand(0.32, 0.68);
        this.vx = rand(-0.09, 0.09);
        this.swayFreq = rand(0.014, 0.032);
        this.swayOffset = rand(0, Math.PI * 2);
        this.sway = rand(20, 48);
        this.life = rand(320, 700);
        this.age = prewarm ? Math.floor(rand(0, this.life)) : 0;
        this.maxOpacity = isBrands ? rand(0.08, 0.22) : rand(0.07, 0.20);
        const [r, g, b] = pickColor();
        this.sprite = window.__getMediqSmokeSprite(r, g, b);
        const baseR = rand(58, 92);
        const tipR = rand(28, 42);
        this.radii = Array.from({ length: this.nodeCount }, (_, i) => baseR + (tipR - baseR) * (this.nodeCount > 1 ? i / (this.nodeCount - 1) : 0));
      }
      update() {
        this.baseX += this.vx;
        this.baseY += this.vy;
        this.age++;
        if (this.age >= this.life || this.baseY - this.nodeCount * this.spacing < -140) this.reset(false);
      }
      draw(c, time) {
        const p = Math.min(1, Math.max(0, this.age / this.life));
        let lifeEnv = p < 0.22 ? p / 0.22 : (p > 0.72 ? (1 - p) / 0.28 : 1);
        if (lifeEnv <= 0.002) return;
        const n = this.nodeCount;
        for (let i = 0; i < n; i++) {
          const frac = n > 1 ? i / (n - 1) : 0;
          const alpha = this.maxOpacity * lifeEnv * Math.sin(frac * Math.PI);
          if (alpha <= 0.002) continue;
          const rad = this.radii[i];
          const nx = this.baseX + Math.sin(time * this.swayFreq + this.swayOffset + i * 0.35) * this.sway * (0.4 + frac * 1.4);
          const ny = this.baseY - i * this.spacing;
          c.globalAlpha = alpha;
          c.drawImage(this.sprite, nx - rad, ny - rad, rad * 2, rad * 2);
        }
      }
    }

    const puffs = Array.from({ length: 12 }, () => new DeckPuff(true));
    const tendrils = Array.from({ length: 14 }, () => new DeckTendril(true));
    let visible = false;
    let docVisible = !document.hidden;
    let rafId = 0;
    let lastDrawTs = 0;

    const shouldDrawDeckSmoke = () => visible && docVisible && !reducedMotionMq.matches;
    const syncDeckSmoke = () => {
      if (shouldDrawDeckSmoke()) {
        if (!rafId) rafId = requestAnimationFrame(draw);
      } else if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
    };

    function draw(now) {
      rafId = 0;
      if (!visible || !docVisible) return;
      if (window.__mediqFastJumping || (lastDrawTs && now && now - lastDrawTs < 24)) {
        if (!reducedMotionMq.matches && visible && docVisible) rafId = requestAnimationFrame(draw);
        return;
      }
      lastDrawTs = now || performance.now();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < puffs.length; i++) {
        if (!reducedMotionMq.matches) puffs[i].update();
        puffs[i].draw(ctx);
      }
      for (let i = 0; i < tendrils.length; i++) {
        if (!reducedMotionMq.matches) tendrils[i].update();
        tendrils[i].draw(ctx, t);
      }
      ctx.globalAlpha = 1;
      if (!reducedMotionMq.matches && visible && docVisible) {
        t += 1;
        rafId = requestAnimationFrame(draw);
      }
    }

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((en) => { visible = en.isIntersecting; });
        syncDeckSmoke();
      }, { rootMargin: '140px 0px', threshold: 0.01 });
      io.observe(canvas.parentElement || canvas);
    } else {
      visible = true;
      syncDeckSmoke();
    }
    document.addEventListener('visibilitychange', () => {
      docVisible = !document.hidden;
      syncDeckSmoke();
    });
  });
})();

/* ========================================================================= */
/* LORENZO LOTTICI INSPIRED SUBPAGE ANIMATIONS ("ORDER IN CHAOS" ENGINE)     */
/* ========================================================================= */
(function initLorenzoLotticiInteractions() {
  const rmq = typeof window.matchMedia === 'function' ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };

  // 1. "Chaos to Order" Staggered Convergence, Line-Mask Headings & Divider Sweeps on Subpages
  window.__triggerLotticiStagger = function(containerEl) {
    if (!containerEl || rmq.matches) return;

    // A) Line-mask clip-path reveal on subpage headings
    const headings = containerEl.querySelectorAll('h2, h3, .prod-serif, .news-serif');
    headings.forEach((h, idx) => {
      h.classList.remove('lottici-heading-reveal');
      h.style.setProperty('--lottici-delay', Math.min(idx * 45, 280) + 'ms');
      void h.offsetWidth;
      h.classList.add('lottici-heading-reveal');
    });

    // B) "Chaos to Order" 3D spatial convergence on subpage cards, rows, tables & panels
    const cards = containerEl.querySelectorAll(
      '.notched-card, .lottici-index-row, .ophteis-elastic-card, .br-cat-col, .lottici-subpage-card, [class*="rounded-2xl"], [class*="rounded-xl"]'
    );
    cards.forEach((el, idx) => {
      // Deterministic scattered offset ("Chaos") that converges to 0 ("Order")
      const cx = ((idx % 3) - 1) * 14;
      const cy = 22 + (idx % 4) * 6;
      const crx = 4 + (idx % 3) * 1.5;
      el.classList.remove('lottici-stagger-in');
      el.style.setProperty('--lottici-cx', cx + 'px');
      el.style.setProperty('--lottici-cy', cy + 'px');
      el.style.setProperty('--lottici-crx', crx + 'deg');
      el.style.setProperty('--lottici-delay', Math.min(60 + idx * 48, 440) + 'ms');
      void el.offsetWidth;
      el.classList.add('lottici-stagger-in');
    });

    // C) Horizontal architectural divider line-sweep
    const dividers = containerEl.querySelectorAll('.border-t, .border-b, hr');
    dividers.forEach((div, idx) => {
      div.classList.remove('lottici-line-sweep');
      div.style.setProperty('--lottici-delay', Math.min(40 + idx * 35, 320) + 'ms');
      void div.offsetWidth;
      div.classList.add('lottici-line-sweep');
    });
  };

  // 3. Interactive Subpage Card 3D Magnetic Micro-Tilt & Cursor-Tracked Sky-Blue Spotlight
  const subpageCardSelectors = [
    '.notched-card',
    '#products .product-slide:not([data-product-index="0"]) [class*="rounded-2xl"]',
    '#brands .deck-slide:not([data-slide-index="0"]) [class*="rounded-2xl"]',
    '#distribution .deck-slide:not([data-slide-index="0"]) [class*="rounded-2xl"]',
    '#resources .deck-slide:not([data-slide-index="0"]) [class*="rounded-2xl"]',
    '#activities .deck-slide [class*="rounded-2xl"]',
    '#contact .deck-slide:not([data-slide-index="0"]) [class*="rounded-2xl"]'
  ].join(', ');

  document.querySelectorAll(subpageCardSelectors).forEach((card) => {
    if (!card.classList.contains('notched-card')) {
      card.classList.add('lottici-subpage-card');
    }

    card.addEventListener('pointermove', (e) => {
      if (rmq.matches) return;
      const rect = card.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const nx = (mx / rect.width) - 0.5;
      const ny = (my / rect.height) - 0.5;

      card.style.setProperty('--lottici-mx', mx.toFixed(1) + 'px');
      card.style.setProperty('--lottici-my', my.toFixed(1) + 'px');
      card.style.setProperty('--lottici-spot', '1');

      if (card.classList.contains('lottici-subpage-card')) {
        card.style.setProperty('--lottici-rx', (-ny * 4.5).toFixed(2) + 'deg');
        card.style.setProperty('--lottici-ry', (nx * 5.5).toFixed(2) + 'deg');
        card.classList.add('is-tilting');
      }
    }, { passive: true });

    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--lottici-spot', '0');
      card.style.setProperty('--lottici-rx', '0deg');
      card.style.setProperty('--lottici-ry', '0deg');
      card.classList.remove('is-tilting');
    }, { passive: true });
  });

  // 4. "Let's Talk" Quick-Select Topic Pills in #contact Inquiry Form
  const pillWrap = document.getElementById('lottici-inquiry-pills');
  const productSelect = document.getElementById('inq-product');
  if (pillWrap && productSelect) {
    const pills = Array.from(pillWrap.querySelectorAll('.lottici-topic-pill'));
    pills.forEach((pill) => {
      pill.addEventListener('click', () => {
        const topic = pill.getAttribute('data-inq-topic');
        pills.forEach((p) => p.classList.toggle('is-active', p === pill));
        if (topic) {
          productSelect.value = topic;
        }
      });
    });
    productSelect.addEventListener('change', () => {
      const val = productSelect.value;
      pills.forEach((p) => {
        p.classList.toggle('is-active', p.getAttribute('data-inq-topic') === val);
      });
    });
  }
})();

/* ========================================================================= */
/* GRAIL-APP.COM INSPIRED 3D STACKED-PAGE SCROLL & DAMPED MOMENTUM ENGINE    */
/* ========================================================================= */
(function initGrailAppPageScrollChoreography() {
  const rmq = typeof window.matchMedia === 'function'
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : { matches: false };
  if (rmq.matches) return;

  const SECTION_IDS = [
    'hero',
    'about',
    'products',
    'brands',
    'distribution',
    'resources',
    'activities',
    'contact',
    'site-footer'
  ];

  const sections = SECTION_IDS
    .map((id) => document.getElementById(id))
    .filter(Boolean);
  if (!sections.length) return;

  // Map each section to its primary foreground content wrapper for secondary depth parallax
  const innerStages = sections.map((sec) => {
    if (sec.id === 'hero') return sec.querySelector('.ih-shell');
    if (sec.id === 'about') return sec.querySelector('.about-slide[data-index="0"] > div, .about-slide[data-slide-index="0"] > div');
    if (sec.id === 'products') return sec.querySelector('.product-slide[data-product-index="0"] .ih-shell');
    if (sec.id === 'site-footer') return null;
    return sec.querySelector('.deck-slide[data-slide-index="0"] > div');
  });

  let sectionOffsets = [];
  let vh = window.innerHeight || 1;
  let maxScroll = 0;

  function measureSections() {
    vh = window.innerHeight || 1;
    // Temporarily clear inline transforms before measuring exact document offsets
    sections.forEach((sec) => {
      sec.style.transform = '';
    });
    sectionOffsets = sections.map((sec) => sec.offsetTop);
    maxScroll = Math.max(0, document.documentElement.scrollHeight - vh);
  }

  measureSections();
  const handleViewportMetricsChange = () => {
    measureSections();
    if (window.__refreshNavSectionOffsets) window.__refreshNavSectionOffsets();
    applyGrailTransforms(window.scrollY);
  };
  window.addEventListener('resize', handleViewportMetricsChange, { passive: true });
  window.addEventListener('orientationchange', () => {
    handleViewportMetricsChange();
    setTimeout(handleViewportMetricsChange, 160);
  }, { passive: true });
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', handleViewportMetricsChange, { passive: true });
  }
  window.addEventListener('load', () => {
    handleViewportMetricsChange();
  });

  // Apply Ultra-Smooth Zero-Lag Scroll Transition (keeps heavy WebGL sections & mobile touch 60/120 FPS)
  function applyGrailTransforms(scrollY) {
    const isMobileOrTablet = window.innerWidth < 1024;
    const contactIdx = sections.findIndex((s) => s && s.id === 'contact');

    for (let i = 0; i < sections.length; i++) {
      const sec = sections[i];
      if (!sec || sec.id === 'site-footer') continue;

      if (sec.style.transform || sec.style.opacity || sec.classList.contains('grail-card-transitioning')) {
        sec.classList.remove('grail-card-transitioning');
        sec.style.transform = '';
        sec.style.opacity = '';
      }

      const inner = innerStages[i];
      if (!inner) continue;

      if (isMobileOrTablet) {
        if (inner.style.transform || inner.style.opacity) {
          inner.style.transform = '';
          inner.style.opacity = '';
        }
        continue;
      }

      const baseTop = sectionOffsets[i] !== undefined ? sectionOffsets[i] : (i * vh);
      const nextTop = sectionOffsets[i + 1] !== undefined ? sectionOffsets[i + 1] : ((i + 1) * vh);
      const spanOut = Math.max(1, nextTop - baseTop);
      const prevTop = sectionOffsets[i - 1] !== undefined ? sectionOffsets[i - 1] : ((i - 1) * vh);
      const spanIn = Math.max(1, baseTop - prevTop);
      const relTop = baseTop - scrollY;

      // Leave #contact -> #site-footer natural so footer & edge-to-edge map scroll directly
      if (sec.id === 'contact' && relTop <= 0.5) {
        if (inner.style.transform || inner.style.opacity) {
          inner.style.transform = '';
          inner.style.opacity = '';
        }
        continue;
      }

      if (relTop > vh * 1.15 || relTop < -spanOut * 1.15) {
        if (inner.style.transform || inner.style.opacity) {
          inner.style.transform = '';
          inner.style.opacity = '';
        }
        continue;
      }

      if (relTop < -0.5 && relTop > -spanOut * 1.02 && (contactIdx === -1 || i < contactIdx)) {
        const p = Math.min(1, Math.max(0, -relTop / spanOut));
        const e = p * (2 - p);
        inner.style.transform = 'translate3d(0, ' + (-e * 22).toFixed(1) + 'px, 0)';
        inner.style.opacity = Math.max(0.32, 1 - e * 0.68).toFixed(3);
      } else if (relTop > 0.5 && relTop < spanIn * 1.02 && i > 0) {
        const enterP = Math.min(1, Math.max(0, relTop / spanIn));
        const e = enterP * enterP;
        inner.style.transform = 'translate3d(0, ' + (e * 22).toFixed(1) + 'px, 0)';
        inner.style.opacity = Math.max(0.32, 1 - e * 0.68).toFixed(3);
      } else if (inner.style.transform || inner.style.opacity) {
        inner.style.transform = '';
        inner.style.opacity = '';
      }
    }
  }

  let currentY = window.scrollY;
  let targetY = window.scrollY;
  let isAnimating = false;
  let lastWheelDir = 0;
  let snapTimer = null;
  let lastTickTs = 0;

  function enableDesktopGrailMode() {
    if (window.innerWidth >= 1024) {
      document.documentElement.classList.add('grail-scroll-ready');
    } else {
      document.documentElement.classList.remove('grail-scroll-ready');
    }
  }
  enableDesktopGrailMode();
  window.addEventListener('resize', enableDesktopGrailMode, { passive: true });

  function shouldYieldToInnerScroll(e) {
    if (e.defaultPrevented) return true;
    if (typeof window.__isAnyMediqSubpageOpen === 'function' && window.__isAnyMediqSubpageOpen()) return true;
    if (document.documentElement.classList.contains('mediq-subpage-locked')) return true;
    if (document.documentElement.style.overflow === 'hidden') return true;

    const scroller = e.target && e.target.closest
      ? e.target.closest('#about-subpage-scroll, #iol-scroll-container, .product-slide, .deck-slide:not([data-slide-index="0"]), #mediq-search-results')
      : null;
    if (scroller && scroller.scrollHeight > scroller.clientHeight + 4) {
      const canScrollDown = e.deltaY > 0 && (scroller.scrollTop + scroller.clientHeight < scroller.scrollHeight - 2);
      const canScrollUp = e.deltaY < 0 && (scroller.scrollTop > 2);
      if (canScrollDown || canScrollUp) return true;
    }
    return false;
  }

  function scheduleMagneticSettle() {
    clearTimeout(snapTimer);
    snapTimer = setTimeout(() => {
      if (!sectionOffsets.length) return;
      if (typeof window.__isAnyMediqSubpageOpen === 'function' && window.__isAnyMediqSubpageOpen()) return;
      if (document.documentElement.classList.contains('mediq-subpage-locked')) return;
      let bestTarget = targetY;
      let minDist = Infinity;

      for (let i = 0; i < sectionOffsets.length - 1; i++) {
        const start = sectionOffsets[i];
        const end = sectionOffsets[i + 1];
        const span = end - start;
        if (span <= 10) continue;

        if (targetY >= start - 4 && targetY <= end + 4) {
          const progress = (targetY - start) / span;
          if (lastWheelDir > 0) {
            bestTarget = progress > 0.15 ? end : start;
          } else if (lastWheelDir < 0) {
            bestTarget = progress < 0.85 ? start : end;
          } else {
            bestTarget = progress >= 0.5 ? end : start;
          }
          minDist = 0;
          break;
        }
      }

      if (minDist === Infinity) {
        for (let i = 0; i < sectionOffsets.length; i++) {
          const d = Math.abs(targetY - sectionOffsets[i]);
          if (d < minDist) {
            minDist = d;
            bestTarget = sectionOffsets[i];
          }
        }
      }

      targetY = Math.max(0, Math.min(maxScroll, bestTarget));
      startLoop();
    }, 360);
  }

  function tick(now) {
    if (document.documentElement.classList.contains('mediq-subpage-locked')) {
      isAnimating = false;
      lastTickTs = 0;
      return;
    }
    const dt = lastTickTs ? Math.min(0.05, Math.max(0.001, (now - lastTickTs) / 1000)) : 0.016;
    lastTickTs = now;
    const diff = targetY - currentY;
    if (Math.abs(diff) > 0.45) {
      currentY += diff * (1 - Math.exp(-13.2 * dt));
      window.scrollTo(0, currentY);
      applyGrailTransforms(currentY);
      if (window.__updateActiveNavOnScroll) window.__updateActiveNavOnScroll(currentY);
      requestAnimationFrame(tick);
    } else {
      currentY = targetY;
      window.scrollTo(0, currentY);
      applyGrailTransforms(currentY);
      if (window.__updateActiveNavOnScroll) window.__updateActiveNavOnScroll(currentY);
      isAnimating = false;
      lastTickTs = 0;
    }
  }

  function startLoop() {
    if (!isAnimating) {
      isAnimating = true;
      lastTickTs = 0;
      requestAnimationFrame(tick);
    }
  }

  window.addEventListener('wheel', (e) => {
    if (window.innerWidth < 1024) return;
    if (shouldYieldToInnerScroll(e)) return;

    e.preventDefault();
    if (!isAnimating) {
      currentY = window.scrollY;
      targetY = window.scrollY;
    }

    const rawDelta = e.deltaMode === 1 ? e.deltaY * 36 : e.deltaY;
    const clampedDelta = Math.max(-360, Math.min(360, rawDelta * 1.15));
    lastWheelDir = clampedDelta > 0 ? 1 : (clampedDelta < 0 ? -1 : lastWheelDir);

    targetY = Math.max(0, Math.min(maxScroll, targetY + clampedDelta));
    startLoop();
    scheduleMagneticSettle();
  }, { passive: false });

    // Sync when user scrolls via scrollbar, keyboard, or touch
  window.addEventListener('scroll', () => {
    if (!isAnimating) {
      currentY = window.scrollY;
      targetY = window.scrollY;
      applyGrailTransforms(window.scrollY);
    }
  }, { passive: true });

  // Programmatic smooth glide API for navbar links, dropdowns, and page indicator dots
  // Multi-page jumps pre-position smoothly right before the target section so intermediate WebGL canvases stay asleep.
  window.grailScrollTo = function(targetElOrY) {
    measureSections();
    let destY = 0;
    if (typeof targetElOrY === 'number') {
      destY = targetElOrY;
    } else if (targetElOrY && typeof targetElOrY.offsetTop === 'number') {
      const idx = sections.indexOf(targetElOrY);
      destY = idx !== -1 ? sectionOffsets[idx] : targetElOrY.offsetTop;
    }
    clearTimeout(snapTimer);
    destY = Math.max(0, Math.min(maxScroll, destY));
    const startY = window.scrollY;
    const dist = destY - startY;
    const jumpThreshold = Math.max(950, (vh || 900) * 1.15);

    if (Math.abs(dist) > jumpThreshold) {
      window.__mediqFastJumping = true;
      const lead = Math.sign(dist) * Math.min(280, Math.round((vh || 900) * 0.32));
      const preY = Math.max(0, Math.min(maxScroll, destY - lead));
      window.scrollTo({ top: preY, left: 0, behavior: 'instant' });
      currentY = preY;
      targetY = destY;
      requestAnimationFrame(() => {
        window.__mediqFastJumping = false;
      });
      startLoop();
      return;
    }

    currentY = startY;
    targetY = destY;
    startLoop();
  };

  // Immediate zero-latency snap API for locking flush onto a subpage host section
  window.grailSnapTo = function(targetElOrY) {
    clearTimeout(snapTimer);
    isAnimating = false;
    measureSections();
    let destY = 0;
    if (typeof targetElOrY === 'number') {
      destY = targetElOrY;
    } else if (targetElOrY && typeof targetElOrY.offsetTop === 'number') {
      const idx = sections.indexOf(targetElOrY);
      destY = idx !== -1 ? sectionOffsets[idx] : targetElOrY.offsetTop;
    }
    destY = Math.max(0, Math.min(maxScroll, destY));
    currentY = destY;
    targetY = destY;
    window.scrollTo({ top: destY, left: 0, behavior: 'instant' });
    applyGrailTransforms(destY);
    if (window.__updateActiveNavOnScroll) window.__updateActiveNavOnScroll();
  };

  applyGrailTransforms(window.scrollY);
})();

/* ========================================================================= */
/* SITE-WIDE SUBPAGE OUTER-SCROLL LOCK, SUBPAGE-ONLY PAGING & LANDING RESET  */
/* ========================================================================= */
(function initMediqSiteWideSubpageLockAndPaging() {
  const rmq = typeof window.matchMedia === 'function'
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : { matches: false };

  let isResettingSubpages = false;
  let edgeAccum = 0;
  let lastInnerScrollTime = 0;
  let lastSwitchTime = 0;

  window.__playSubpage3DEntrance = function(el, dir = 1) {
    if (!el || rmq.matches) return;
    if (el._sub3dTimer) {
      clearTimeout(el._sub3dTimer);
      el._sub3dTimer = null;
    }
    el.classList.remove('mediq-subpage-3d-next', 'mediq-subpage-3d-prev');
    void el.offsetWidth;
    const cls = dir < 0 ? 'mediq-subpage-3d-prev' : 'mediq-subpage-3d-next';
    el.classList.add(cls);
    const cleanup = () => {
      el.classList.remove('mediq-subpage-3d-next', 'mediq-subpage-3d-prev');
      if (el._sub3dTimer) {
        clearTimeout(el._sub3dTimer);
        el._sub3dTimer = null;
      }
    };
    el.addEventListener('animationend', cleanup, { once: true });
    el._sub3dTimer = setTimeout(cleanup, 480);
  };

  let lastLockedHostEl = null;

  const setActiveSubpageHost = (secEl) => {
    document.querySelectorAll('.mediq-subpage-active-host').forEach((el) => {
      if (el !== secEl) el.classList.remove('mediq-subpage-active-host');
    });
    if (secEl) {
      secEl.classList.add('mediq-subpage-active-host');
      lastLockedHostEl = secEl;
    }
  };

  window.__unlockOuterPageScroll = function() {
    edgeAccum = 0;
    const hostToRestore = lastLockedHostEl;
    lastLockedHostEl = null;
    setActiveSubpageHost(null);
    document.body.classList.remove('mediq-subpage-modal-open');
    document.documentElement.classList.remove('mediq-subpage-locked');
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    document.documentElement.style.scrollSnapType = '';
    if (hostToRestore && window.innerWidth < 1024) {
      requestAnimationFrame(() => {
        if (window.__isAnyMediqSubpageOpen && window.__isAnyMediqSubpageOpen()) return;
        if (typeof window.grailSnapTo === 'function') {
          window.grailSnapTo(hostToRestore);
        } else {
          window.scrollTo({ top: hostToRestore.offsetTop, left: 0, behavior: 'instant' });
        }
      });
    }
  };

  const resetInnerScrollTops = (rootEl) => {
    if (!rootEl) return;
    rootEl.querySelectorAll('.about-slide, .product-slide, .deck-slide, #about-subpage-scroll, #iol-scroll-container, #product-slide-med-supplies, #brands-profiles-scroller').forEach((sc) => {
      if (sc && sc.scrollTop > 0) sc.scrollTop = 0;
    });
  };

  window.__resetAllSubpagesExcept = function(keepKey) {
    if (isResettingSubpages) return;
    isResettingSubpages = true;
    try {
      if (keepKey !== 'about') {
        if ((window.__aboutDeckCurrentIndex || 0) > 0 && typeof window.goToAboutSlide === 'function') {
          window.goToAboutSlide(0, { silentReset: true });
        }
        resetInnerScrollTops(document.getElementById('about'));
      }
      if (keepKey !== 'products') {
        if ((window.__productsDeckCurrentIndex || 0) > 0 && typeof window.goToProductSlide === 'function') {
          window.goToProductSlide(0, { silentReset: true });
        }
        if (typeof window.__activateProductsActiveTheory === 'function') {
          window.__activateProductsActiveTheory(0);
        }
        resetInnerScrollTops(document.getElementById('products'));
      }
      const deckPairs = [
        ['brands', 'brands'],
        ['services', 'distribution'],
        ['resources', 'resources'],
      ];
      for (let i = 0; i < deckPairs.length; i++) {
        const dk = deckPairs[i][0];
        const secId = deckPairs[i][1];
        if (keepKey !== dk) {
          if (dk === 'services' && typeof window.__setServicesBookCarouselActive === 'function') {
            window.__setServicesBookCarouselActive(false);
          }
          if (dk === 'brands' && typeof window.closeAllPrincipalPel === 'function') {
            window.closeAllPrincipalPel();
          }
          if (typeof window.__getDeckSlideIndex === 'function' && window.__getDeckSlideIndex(dk) > 0 && typeof window.goToDeckSlide === 'function') {
            window.goToDeckSlide(dk, 0, false, { silentReset: true });
          }
          resetInnerScrollTops(document.getElementById(secId));
        }
      }
      if (keepKey !== 'news') {
        resetInnerScrollTops(document.getElementById('activities'));
      }
      if (keepKey !== 'contact') {
        resetInnerScrollTops(document.getElementById('contact'));
      }
    } finally {
      isResettingSubpages = false;
    }
  };

  function getActiveManagedSubpage() {
    if ((window.__aboutDeckCurrentIndex || 0) > 0) {
      return {
        key: 'about',
        sec: document.getElementById('about'),
        scrollEl: document.getElementById('about-subpage-scroll'),
        subIdx: window.__aboutActiveSubpageIdx || 1,
        maxIdx: 4,
        go: (n) => {
          if (typeof window.goToAboutSlide === 'function') window.goToAboutSlide(n);
        }
      };
    }

    const deckPairs = [
      ['brands', 'brands'],
      ['services', 'distribution'],
      ['resources', 'resources']
    ];
    for (let i = 0; i < deckPairs.length; i++) {
      const dk = deckPairs[i][0];
      const secId = deckPairs[i][1];
      const idx = typeof window.__getDeckSlideIndex === 'function' ? window.__getDeckSlideIndex(dk) : 0;
      if (idx >= 1) {
        const sec = document.getElementById(secId);
        const slides = sec ? sec.querySelectorAll(`.deck-slide[data-deck="${dk}"]`) : [];
        return {
          key: dk,
          sec,
          scrollEl: slides[idx] || null,
          subIdx: idx,
          maxIdx: Math.max(1, slides.length - 1),
          go: (n) => {
            if (typeof window.goToDeckSlide === 'function') window.goToDeckSlide(dk, n, false);
          }
        };
      }
    }

    return null;
  }

  window.__isAnyMediqSubpageOpen = function() {
    return Boolean((window.__productsDeckCurrentIndex || 0) >= 1 || getActiveManagedSubpage());
  };

  window.__engageSubpageLock = function(keepKey, secEl) {
    edgeAccum = 0;
    lastSwitchTime = performance.now();
    window.__resetAllSubpagesExcept(keepKey);

    const isMobileOrTablet = window.innerWidth < 1024;
    setActiveSubpageHost(secEl);

    if (secEl && !isMobileOrTablet) {
      const approxDiff = Math.abs(window.scrollY - secEl.offsetTop);
      if (approxDiff > 24 && typeof window.__sweepPageTransitionCurtain === 'function') {
        window.__sweepPageTransitionCurtain();
      }
      document.documentElement.classList.remove('mediq-subpage-locked');
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      if (typeof window.grailSnapTo === 'function') {
        window.grailSnapTo(secEl);
      } else {
        window.scrollTo({ top: secEl.offsetTop, left: 0, behavior: 'instant' });
      }
    } else if (secEl && typeof window.__sweepPageTransitionCurtain === 'function') {
      const rect = secEl.getBoundingClientRect();
      if (Math.abs(rect.top) > 40) {
        window.__sweepPageTransitionCurtain();
      }
    }

    document.documentElement.classList.add('mediq-subpage-locked');
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    document.documentElement.style.scrollSnapType = 'none';

    requestAnimationFrame(() => {
      if (window.__isAnyMediqSubpageOpen && window.__isAnyMediqSubpageOpen()) {
        setActiveSubpageHost(secEl);
        if (secEl && window.innerWidth >= 1024 && Math.abs(secEl.getBoundingClientRect().top) > 2) {
          document.documentElement.classList.remove('mediq-subpage-locked');
          if (typeof window.grailSnapTo === 'function') {
            window.grailSnapTo(secEl);
          } else {
            window.scrollTo({ top: secEl.offsetTop, left: 0, behavior: 'instant' });
          }
        }
        document.documentElement.classList.add('mediq-subpage-locked');
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
        document.documentElement.style.scrollSnapType = 'none';
      }
    });
  };

  function isEventInsideOpenModal(target) {
    if (!target || !target.nodeType) return false;
    const brochureModal = document.getElementById('brochure-modal');
    if (brochureModal && brochureModal.classList.contains('opacity-100') && brochureModal.contains(target)) {
      return true;
    }
    const wwdModal = document.getElementById('wwd-modal');
    if (wwdModal && !wwdModal.hidden && !wwdModal.classList.contains('hidden') && wwdModal.contains(target)) {
      return true;
    }
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu && !mobileMenu.classList.contains('pointer-events-none') && mobileMenu.contains(target)) {
      return true;
    }
    const bookModal = document.getElementById('srv-book-reading-modal');
    if (bookModal && bookModal.classList.contains('is-open') && bookModal.contains(target)) {
      return true;
    }
    const bookSlide = document.getElementById('srv-book-carousel-slide');
    if (bookSlide && bookSlide.classList.contains('opacity-100') && bookSlide.contains(target)) {
      return true;
    }
    return false;
  }

  // Capture-phase wheel controller: 100% blocks outer main-page scroll & steps cleanly between subpages (1..maxIdx)
  window.addEventListener('wheel', (e) => {
    if (isEventInsideOpenModal(e.target)) return;

    const active = getActiveManagedSubpage();
    if (!active) return;

    const dy = e.deltaMode === 1 ? e.deltaY * 36 : e.deltaY;
    if (Math.abs(dy) < 0.5) return;

    const now = performance.now();
    const sc = active.scrollEl;
    const maxSc = sc ? Math.max(0, sc.scrollHeight - sc.clientHeight) : 0;
    const atTop = !sc || maxSc <= 2 || sc.scrollTop <= 1;
    const atBottom = !sc || maxSc <= 2 || sc.scrollTop >= maxSc - 2;

    if ((dy < 0 && atTop) || (dy > 0 && atBottom)) {
      // STRICT ISOLATION: Never allow wheel at top/bottom boundary to scroll outer window or Home/Overview!
      e.preventDefault();

      if (now - lastInnerScrollTime >= 220 && now - lastSwitchTime >= 720) {
        if ((edgeAccum > 0 && dy < 0) || (edgeAccum < 0 && dy > 0)) {
          edgeAccum = 0;
        }
        edgeAccum += dy;

        if (edgeAccum <= -140) {
          edgeAccum = 0;
          if (active.subIdx > 1) {
            lastSwitchTime = now;
            active.go(active.subIdx - 1);
          }
        } else if (edgeAccum >= 140) {
          edgeAccum = 0;
          if (active.subIdx < active.maxIdx) {
            lastSwitchTime = now;
            active.go(active.subIdx + 1);
          }
        }
      }
      return;
    }

    edgeAccum = 0;
    lastInnerScrollTime = now;

    // If pointer is outside the inner scroll container (e.g. over sticky header or subnavbar), forward scroll to subpage
    if (sc && !sc.contains(e.target)) {
      e.preventDefault();
      sc.scrollTop += dy;
    }
  }, { passive: false, capture: true });

  // Touch controller for mobile/tablet subpage isolation & boundary paging
  let touchActive = false;
  let touchLastY = 0;
  let touchEdgeAccum = 0;

  window.addEventListener('touchstart', (e) => {
    if (isEventInsideOpenModal(e.target)) {
      touchActive = false;
      return;
    }
    const active = getActiveManagedSubpage();
    if (!active || !e.touches || e.touches.length !== 1) {
      touchActive = false;
      return;
    }
    touchActive = true;
    touchLastY = e.touches[0].clientY;
    touchEdgeAccum = 0;
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (!touchActive || !e.touches || e.touches.length !== 1) return;
    const active = getActiveManagedSubpage();
    if (!active) {
      touchActive = false;
      return;
    }

    const curY = e.touches[0].clientY;
    const dy = touchLastY - curY;
    touchLastY = curY;
    if (Math.abs(dy) < 0.5) return;

    const now = performance.now();
    const sc = active.scrollEl;
    const maxSc = sc ? Math.max(0, sc.scrollHeight - sc.clientHeight) : 0;
    const atTop = !sc || maxSc <= 2 || sc.scrollTop <= 1;
    const atBottom = !sc || maxSc <= 2 || sc.scrollTop >= maxSc - 2;

    if ((dy < 0 && atTop) || (dy > 0 && atBottom)) {
      if (e.cancelable) e.preventDefault();
      if (now - lastInnerScrollTime >= 200 && now - lastSwitchTime >= 720) {
        if ((touchEdgeAccum > 0 && dy < 0) || (touchEdgeAccum < 0 && dy > 0)) {
          touchEdgeAccum = 0;
        }
        touchEdgeAccum += dy;
        if (touchEdgeAccum <= -110 && active.subIdx > 1) {
          touchEdgeAccum = 0;
          lastSwitchTime = now;
          active.go(active.subIdx - 1);
        } else if (touchEdgeAccum >= 110 && active.subIdx < active.maxIdx) {
          touchEdgeAccum = 0;
          lastSwitchTime = now;
          active.go(active.subIdx + 1);
        }
      }
      return;
    }

    touchEdgeAccum = 0;
    lastInnerScrollTime = now;
    if (sc && !sc.contains(e.target)) {
      if (e.cancelable) e.preventDefault();
      sc.scrollTop += dy * 1.2;
    }
  }, { passive: false });

  window.addEventListener('touchend', () => {
    touchActive = false;
    touchEdgeAccum = 0;
  }, { passive: true });

  // Keyboard scroll & subpage navigation guard when inside managed subpages
  window.addEventListener('keydown', (e) => {
    if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT' || e.target.isContentEditable)) {
      return;
    }
    if (isEventInsideOpenModal(e.target)) return;

    const active = getActiveManagedSubpage();
    if (!active) return;

    const sc = active.scrollEl;
    const maxSc = sc ? Math.max(0, sc.scrollHeight - sc.clientHeight) : 0;

    if (active.key === 'about') {
      if (e.key === 'ArrowRight' && active.subIdx < active.maxIdx) {
        e.preventDefault();
        active.go(active.subIdx + 1);
        return;
      }
      if (e.key === 'ArrowLeft' && active.subIdx > 1) {
        e.preventDefault();
        active.go(active.subIdx - 1);
        return;
      }
    }

    if (e.key === 'ArrowDown' || e.key === 'PageDown' || (e.key === ' ' && !e.shiftKey)) {
      e.preventDefault();
      const step = e.key === 'ArrowDown' ? 160 : Math.round((sc ? sc.clientHeight : window.innerHeight) * 0.8);
      if (sc && sc.scrollTop < maxSc - 2) {
        sc.scrollBy({ top: step, behavior: 'smooth' });
      } else if (active.subIdx < active.maxIdx) {
        active.go(active.subIdx + 1);
      }
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp' || (e.key === ' ' && e.shiftKey)) {
      e.preventDefault();
      const step = e.key === 'ArrowUp' ? 160 : Math.round((sc ? sc.clientHeight : window.innerHeight) * 0.8);
      if (sc && sc.scrollTop > 1) {
        sc.scrollBy({ top: -step, behavior: 'smooth' });
      } else if (active.subIdx > 1) {
        active.go(active.subIdx - 1);
      }
    } else if (e.key === 'Home') {
      e.preventDefault();
      if (sc) sc.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (e.key === 'End') {
      e.preventDefault();
      if (sc) sc.scrollTo({ top: maxSc, behavior: 'smooth' });
    }
  });
})();
