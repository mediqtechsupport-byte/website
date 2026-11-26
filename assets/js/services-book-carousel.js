/**
 * MEDIQ Services — 3D Book Carousel with Direct Open-Book Spread Mode
 * Integrates strictly inside #srv-book-carousel-slide (#distribution deck slide 7).
 */
(function initServicesBookCarousel() {
  const BASE_OPEN_W = 240;
  const BASE_GAP = 78;
  const SHELF_HOLD_SEC = 1.0;
  const FLOAT_DURATION_SEC = 0.92;
  const FLOAT_STAGGER_SEC = 0.055;
  const smoothstep = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
  const smootherstep = (t) => {
    const u = Math.max(0, Math.min(1, t));
    return u * u * u * (u * (u * 6 - 15) + 10);
  };

  const SERVICE_BOOKS = [
    {
      num: '01',
      roman: 'I',
      versoPage: 2,
      rectoPage: 3,
      shortTitle: 'Importation & Distribution',
      title: 'Strategic Importation & Distribution',
      badge: 'AUTHORIZED CHANNEL • PH SUPPLY',
      subtitle:
        'Product sourcing, importation coordination, inventory availability and supply-chain support conducted in accordance with applicable manufacturer labeling and operational procedures.',
      highlights: [
        'Direct procurement under verified manufacturer agreements',
        'End-to-end customs clearance & regulatory entry coordination',
        'Lot-traceable warehousing and hospital dispatch workflows',
      ],
      inquiry: 'Institutional Supply',
      color: '#0e2d5c',
      accent: '#72c5f8',
      textColor: '#f4f7fb',
      spineW: 48,
      h: 356,
      rotZ: 0,
      isMain: true,
      img: 'assets/img/book-01-importation.jpg?v=1.0',
      poster: 'assets/img/pillars/wwd_01_video_poster.jpg',
      video: 'assets/video/wwd-01-distribution.mp4',
      figureCaption: 'Fig. 1.1 — MediQ Philippines specialists inspecting lot-controlled surgical inventory.',
      slideIndex: 1,
      cards: [
        {
          code: '01 · SOURCING',
          tag: 'AUTHORIZED CHANNEL',
          title: 'Product Sourcing',
          desc: 'Direct procurement from authorized medical manufacturers strictly within verified Philippine distribution agreements.',
        },
        {
          code: '02 · IMPORTATION',
          tag: 'ENTRY COORDINATION',
          title: 'Importation Coordination',
          desc: 'Structured shipment documentation, customs clearance, and regulatory entry coordination prior to institutional release.',
        },
        {
          code: '03 · AVAILABILITY',
          tag: 'INVENTORY PLANNING',
          title: 'Inventory Availability',
          desc: 'Planned inventory monitoring and order scheduling aligned with institutional demand and actual operational capacity.',
        },
        {
          code: '04 · SUPPLY CHAIN',
          tag: 'LABEL-ALIGNED SOPs',
          title: 'Supply-Chain Support',
          desc: 'Product storage, lot-level record-keeping, and institutional dispatch handled according to applicable manufacturer labeling.',
        },
      ],
    },
    {
      num: '02',
      roman: 'II',
      versoPage: 4,
      rectoPage: 5,
      shortTitle: 'Product Marketing',
      title: 'Product Marketing & Brand Development',
      badge: 'PRINCIPAL BRAND STEWARDSHIP',
      subtitle:
        'Brand positioning, authorized launch campaigns, professional communication and technical product engagement where clinical decision-making remains with clinicians.',
      highlights: [
        'Evidence-led positioning aligned with approved indications',
        'Multichannel scientific & congress communications',
        'Approved technical literature for eye-care specialists',
      ],
      inquiry: 'Marketing/Partnership',
      color: '#174382',
      accent: '#72c5f8',
      textColor: '#f4f7fb',
      spineW: 42,
      h: 342,
      rotZ: -1.5,
      isMain: false,
      img: 'assets/img/book-02-product-marketing.jpg?v=1.0',
      poster: 'assets/img/pillars/wwd_02_video_poster.jpg',
      video: 'assets/video/wwd-02-marketing.mp4',
      figureCaption: 'Fig. 2.1 — MediQ brand leadership advancing clinical awareness across Philippine institutions.',
      slideIndex: 2,
      cards: [
        {
          code: '01 · POSITIONING',
          tag: 'BRAND STRATEGY',
          title: 'Brand Positioning & Awareness',
          desc: 'Developing responsible, evidence-based brand positioning that communicates manufacturer-approved product indications to Philippine healthcare professionals.',
        },
        {
          code: '02 · LAUNCHES',
          tag: 'MULTICHANNEL',
          title: 'Authorized Launch Campaigns',
          desc: 'Structured launch execution and multichannel campaigns introducing authorized medical technologies to healthcare institutions.',
        },
        {
          code: '03 · CONGRESSES',
          tag: 'SCIENTIFIC FORUMS',
          title: 'Professional Communication & Congresses',
          desc: 'Representing principal brands at medical conventions, society meetings, and institutional forums using reviewed promotional materials.',
        },
        {
          code: '04 · ENABLEMENT',
          tag: 'APPROVED RESOURCES',
          title: 'Product Training & Approved Technical Resources',
          desc: 'Providing approved product literature and technical product engagement where appropriate — strictly distinct from clinical diagnosis or treatment planning.',
        },
      ],
    },
    {
      num: '03',
      roman: 'III',
      versoPage: 6,
      rectoPage: 7,
      shortTitle: 'Sales & Commercialization',
      title: 'Sales, Promotion & Commercialization',
      badge: 'NATIONAL INSTITUTIONAL COVERAGE',
      subtitle:
        'Field sales presentations, institutional account development, hospital procurement engagement and coordinated market-growth programs.',
      highlights: [
        'Hospital, ASC, and specialty clinic account engagement',
        'Transparent procurement proposals & documentation support',
        'Coordinated national growth with global manufacturing partners',
      ],
      inquiry: 'Institutional Supply',
      color: '#1c4d8f',
      accent: '#9bd8ff',
      textColor: '#ffffff',
      spineW: 52,
      h: 368,
      rotZ: 1.2,
      isMain: false,
      img: 'assets/img/book-03-sales.jpg?v=1.0',
      poster: 'assets/img/pillars/wwd_03_video_poster.jpg',
      video: 'assets/video/wwd-03-sales.mp4',
      figureCaption: 'Fig. 3.1 — Commercial specialists presenting authorized ophthalmic solutions in Metro Manila.',
      slideIndex: 3,
      cards: [
        {
          code: '01 · FIELD SALES',
          tag: 'PRODUCT PRESENTATIONS',
          title: 'Field Sales & Product Presentations',
          desc: 'Field representatives engaging physicians and healthcare teams with accurate, manufacturer-approved product presentations.',
        },
        {
          code: '02 · ACCOUNTS',
          tag: 'INSTITUTIONAL',
          title: 'Institutional Account Development',
          desc: 'Building enduring commercial relationships across private hospitals, ambulatory surgical centers, and specialty clinics.',
        },
        {
          code: '03 · PROCUREMENT',
          tag: 'HOSPITAL PURCHASING',
          title: 'Hospital & Procurement Engagement',
          desc: 'Supporting hospital purchasing teams and administrators with transparent commercial proposals and required product documentation.',
        },
        {
          code: '04 · GROWTH',
          tag: 'PRINCIPAL ALIGNED',
          title: 'Coordinated Market-Growth Programs',
          desc: 'Collaborative commercial planning, customer insight alignment, and channel expansion executed alongside authorized principals.',
        },
      ],
    },
    {
      num: '04',
      roman: 'IV',
      versoPage: 8,
      rectoPage: 9,
      shortTitle: 'Market Development',
      title: 'Market Development',
      badge: 'REGULATORY & CHANNEL EXPANSION',
      subtitle:
        'Market insight, institutional channel development and disciplined evaluation of complementary healthcare solutions subject to applicable authorizations.',
      highlights: [
        'Metro Manila, Luzon, Visayas & Mindanao hospital reach',
        'Pre-commercial local registration & authorization alignment',
        'Curated evaluation of complementary ophthalmic technologies',
      ],
      inquiry: 'Marketing/Partnership',
      color: '#123866',
      accent: '#72c5f8',
      textColor: '#f4f7fb',
      spineW: 36,
      h: 332,
      rotZ: -2,
      isMain: false,
      img: 'assets/img/book-04-market-development.jpg?v=1.0',
      poster: 'assets/img/pillars/wwd_06_video_poster.jpg',
      video: 'assets/video/wwd-06-relationships.mp4',
      figureCaption: 'Fig. 4.1 — Executive partnership alignment expanding ophthalmic access across the Philippines.',
      slideIndex: 4,
      cards: [
        {
          code: '01 · REGIONAL',
          tag: 'PHILIPPINE CENTERS',
          title: 'Regional Channel Development',
          desc: 'Developing institutional awareness and responsible access to authorized medical technologies across Philippine healthcare centers.',
        },
        {
          code: '02 · PRINCIPALS',
          tag: 'MANUFACTURER ALIGNMENT',
          title: 'Principal & Manufacturer Alignment',
          desc: 'Engaging global healthcare innovators seeking responsible commercial representation and market development in the Philippines.',
        },
        {
          code: '03 · REGULATORY',
          tag: 'ENTRY PATHWAYS',
          title: 'Regulatory Pathway Coordination',
          desc: 'Coordinating local registration requirements and applicable regulatory authorizations prior to commercial introduction.',
        },
        {
          code: '04 · PORTFOLIO',
          tag: 'COMPLEMENTARY FIT',
          title: 'Complementary Portfolio Evaluation',
          desc: 'Strategic assessment of complementary medical devices, hospital supplies, pharmaceuticals, and diagnostics subject to applicable authorizations.',
        },
      ],
    },
    {
      num: '05',
      roman: 'V',
      versoPage: 10,
      rectoPage: 11,
      shortTitle: 'Professional Education',
      title: 'Professional Education',
      badge: 'SCIENTIFIC & PRODUCT TRAINING',
      subtitle:
        'Educational events, structured product knowledge sessions, appropriate non-clinical demonstrations and responsive technical engagement.',
      highlights: [
        'Specialist symposia & structured product knowledge forums',
        'Instructional wet-lab & operating-room device briefings',
        'Responsive technical dialogue under manufacturer guidelines',
      ],
      inquiry: 'Education',
      color: '#0d436e',
      accent: '#72c5f8',
      textColor: '#ffffff',
      spineW: 44,
      h: 350,
      rotZ: 1.5,
      isMain: false,
      img: 'assets/img/book-05-education.jpg?v=1.0',
      poster: 'assets/img/pillars/wwd_05_video_poster.jpg',
      video: 'assets/video/wwd-05-education.mp4',
      figureCaption: 'Fig. 5.1 — Filipino ophthalmologists attending a MediQ scientific symposium and forum.',
      slideIndex: 5,
      cards: [
        {
          code: '01 · SYMPOSIA',
          tag: 'EDUCATIONAL EVENTS',
          title: 'Educational Events & Specialist Forums',
          desc: 'Organized symposia, product briefings, and institutional learning events featuring approved materials and speakers.',
        },
        {
          code: '02 · KNOWLEDGE',
          tag: 'PRODUCT TRAINING',
          title: 'Product Knowledge Sessions',
          desc: 'Structured product-focused briefings covering authorized specifications, labeling, and manufacturer instructions for use.',
        },
        {
          code: '03 · DEMOS',
          tag: 'DEMONSTRATIONS',
          title: 'Appropriate Product Demonstrations',
          desc: 'Non-clinical demonstrations of authorized devices and delivery systems where appropriate under manufacturer guidelines.',
        },
        {
          code: '04 · TECHNICAL',
          tag: 'TECHNICAL ENGAGEMENT',
          title: 'Technical Engagement for Healthcare Professionals',
          desc: 'Responsive technical information sharing for physicians and allied staff, distinct from clinical credentialing or medical training.',
        },
      ],
    },
    {
      num: '06',
      roman: 'VI',
      versoPage: 12,
      rectoPage: 13,
      shortTitle: 'Quality & Customer Support',
      title: 'Quality & Customer Support',
      badge: 'TRACEABILITY & AFTER-SALES',
      subtitle:
        'Regulatory coordination, lot-level traceability, responsible product handling and responsive after-sales support alongside manufacturers and authorities.',
      highlights: [
        'Dedicated institutional inquiry & documentation desk',
        'Serial, batch, and expiry traceability across dispatch',
        'Structured feedback escalation with manufacturer QA teams',
      ],
      inquiry: 'Institutional Supply',
      color: '#19264d',
      accent: '#72c5f8',
      textColor: '#f4f7fb',
      spineW: 46,
      h: 362,
      rotZ: -1,
      isMain: true,
      img: 'assets/img/book-06-quality.jpg?v=1.0',
      poster: 'assets/img/pillars/wwd_04_video_poster.jpg',
      video: 'assets/video/wwd-04-quality.mp4',
      figureCaption: 'Fig. 6.1 — Quality assurance inspection and batch traceability verification in Manila.',
      slideIndex: 6,
      cards: [
        {
          code: '01 · SUPPORT',
          tag: 'AFTER-SALES',
          title: 'Product Inquiries & After-Sales Support',
          desc: 'Responsive distributor assistance for institutional product inquiries, approved documentation requests, and order follow-up.',
        },
        {
          code: '02 · TRACKING',
          tag: 'TRACEABILITY',
          title: 'Product & Lot-Level Traceability',
          desc: 'Structured batch, serial, and expiry tracking across storage and institutional delivery in accordance with internal SOPs.',
        },
        {
          code: '03 · GOVERNANCE',
          tag: 'REGULATORY',
          title: 'Regulatory Coordination & Responsible Handling',
          desc: 'Label-aligned product stewardship and distributor-level regulatory coordination alongside authorized principals.',
        },
        {
          code: '04 · QUALITY',
          tag: 'ESCALATION',
          title: 'Feedback Coordination & Issue Escalation',
          desc: 'Documented customer feedback capture and appropriate issue escalation to manufacturer quality and regulatory teams.',
        },
      ],
    },
  ];

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function renderBookDom(book, idx) {
    const sW = book.spineW || 44;
    const bgTint = book.color || '#0e2d5c';
    const prevIdx = (idx - 1 + SERVICE_BOOKS.length) % SERVICE_BOOKS.length;
    const nextIdx = (idx + 1) % SERVICE_BOOKS.length;
    const chapterNum = idx + 1;
    const chapterRoman = book.roman || String(chapterNum);
    const prevRoman = SERVICE_BOOKS[prevIdx].roman || SERVICE_BOOKS[prevIdx].num;
    const nextRoman = SERVICE_BOOKS[nextIdx].roman || SERVICE_BOOKS[nextIdx].num;
    const versoPage = book.versoPage || chapterNum * 2;
    const rectoPage = book.rectoPage || chapterNum * 2 + 1;
    const posterSrc = book.poster || book.img || '';

    const highlightsHtml = (book.highlights || [])
      .map(
        (h) => `
          <li class="bc-spread-highlight-item">
            <span class="bc-spread-dash" aria-hidden="true">&middot;</span>
            <span>${escapeHtml(h)}</span>
          </li>`
      )
      .join('');

    const entriesHtml = book.cards
      .map(
        (c, ci) => `
          <article class="bc-book-entry">
            <div class="bc-book-entry__head">
              <span class="bc-book-entry__sec">&sect; ${chapterNum}.${ci + 1}</span>
              <h4 class="bc-book-entry__title">${escapeHtml(c.title)}</h4>
            </div>
            <p class="bc-book-entry__desc">${escapeHtml(c.desc)}</p>
          </article>`
      )
      .join('');

    return `
      <div class="bc-wrapper" data-book-idx="${idx}" role="button" tabindex="0" aria-label="${escapeHtml(book.num + ' ' + book.title)}">
        <div class="bc-book" style="height:${book.h}px;">
          <div class="bc-hinge" style="transform:translateZ(${sW / 2}px);">
            <div class="bc-face bc-front" style="width:${BASE_OPEN_W}px;background:${bgTint};">
              ${book.img ? `<img src="${escapeHtml(book.img)}" alt="${escapeHtml(book.title)}" class="bc-cover-img" loading="lazy" />` : ''}
              <div class="bc-cover-scrim"></div>
              <div class="bc-overlay"></div>
              <div class="bc-cover-meta">
                <div class="bc-cover-num">${escapeHtml(book.num)}</div>
                <div class="bc-cover-divider"></div>
                <div class="bc-cover-title">${escapeHtml(book.title)}</div>
                <div class="bc-cover-cta">Open Volume &rarr;</div>
              </div>
            </div>
            <div class="bc-face bc-inside" style="width:${BASE_OPEN_W}px;">
              <div class="bc-inside-spread">
                <div class="bc-running-header">
                  <span class="bc-running-label">MediQ Clinical Monograph</span>
                  <span class="bc-running-label">Chapter ${escapeHtml(chapterRoman)}</span>
                </div>
                <header class="bc-chapter-opener">
                  <span class="bc-chapter-kicker">Chapter ${escapeHtml(chapterRoman)}</span>
                  <h3 class="bc-spread-title">${escapeHtml(book.title)}</h3>
                </header>
                <div class="bc-spread-ornament" aria-hidden="true">
                  <span class="bc-spread-rule-line"></span>
                  <span class="bc-spread-fleuret">&loz;</span>
                  <span class="bc-spread-rule-line"></span>
                </div>
                <p class="bc-spread-sub">${escapeHtml(book.subtitle)}</p>
                ${
                  posterSrc
                    ? `<figure class="bc-spread-figure"><div class="bc-spread-plate"><div class="bc-spread-plate-media"><img class="bc-spread-poster" src="${escapeHtml(posterSrc)}" alt="${escapeHtml(book.title)}" loading="lazy" />${book.video ? `<video class="bc-spread-video" data-video-src="${escapeHtml(book.video)}" poster="${escapeHtml(posterSrc)}" muted loop playsinline preload="none" aria-hidden="true"></video>` : ''}</div></div><figcaption class="bc-spread-caption bc-book-italic">${escapeHtml(book.figureCaption || ('Fig. ' + chapterNum + '.1 — ' + (book.shortTitle || book.title)))}</figcaption></figure>`
                    : ''
                }
                <div class="bc-spread-notes">
                  <div class="bc-spread-notes__head">Key Standards</div>
                  <ul class="bc-spread-highlight-list">${highlightsHtml}</ul>
                </div>
                <footer class="bc-folio-bar">
                  <button type="button" class="bc-folio-link bc-folio-link--left" data-book-jump="${prevIdx}">&lsaquo; Ch. ${escapeHtml(prevRoman)}</button>
                  <span class="bc-folio-num">${versoPage}</span>
                  <button type="button" class="bc-folio-link bc-folio-link--right" data-book-inquiry="${escapeHtml(book.inquiry || 'Institutional Supply')}">Inquire</button>
                </footer>
              </div>
            </div>
          </div>

          <div class="bc-face bc-page" style="transform:translateZ(${sW / 2 - 1}px);">
            <div class="bc-page-spread">
              <div class="bc-running-header">
                <span class="bc-running-chapter bc-book-italic">${escapeHtml(book.shortTitle || book.title)}</span>
                <button type="button" class="bc-book-top-close" aria-label="Close service book">
                  <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M2 2l10 10M12 2L2 12"/></svg>
                </button>
              </div>
              <div class="bc-recto-kicker">Scope &amp; Deliverables</div>
              <div class="bc-book-entries">${entriesHtml}</div>
              <div class="bc-book-colophon">
                <span class="bc-book-colophon-note bc-book-italic">Authorized Philippine documentation</span>
                <button type="button" class="bc-book-colophon-cta" data-book-inquiry="${escapeHtml(book.inquiry || 'Institutional Supply')}">Request dossier &rarr;</button>
              </div>
              <footer class="bc-folio-bar">
                <span aria-hidden="true"></span>
                <span class="bc-folio-num">${rectoPage}</span>
                <button type="button" class="bc-folio-link bc-folio-link--right" data-book-jump="${nextIdx}">Ch. ${escapeHtml(nextRoman)} &rsaquo;</button>
              </footer>
            </div>
          </div>

          <div class="bc-face bc-back" style="width:${BASE_OPEN_W}px;background:${bgTint};transform:rotateY(180deg) translateZ(${sW / 2}px);"></div>

          <div class="bc-face bc-spine" style="width:${sW}px;left:${-sW / 2}px;background:${book.isMain ? '#0c1c3d' : bgTint};">
            <div class="bc-spine-text" style="color:${book.textColor};">
              <span style="opacity:0.65;">${escapeHtml(book.num)}</span>
              <span>${escapeHtml(book.shortTitle)}</span>
            </div>
          </div>

          <div class="bc-face bc-pages bc-pages-right" style="width:${sW}px;left:${BASE_OPEN_W - sW / 2}px;"></div>
          <div class="bc-face bc-pages bc-pages-top" style="height:${sW}px;top:${-sW / 2}px;"></div>
          <div class="bc-face bc-pages bc-pages-bottom" style="height:${sW}px;bottom:${-sW / 2}px;"></div>
        </div>
      </div>
    `;
  }

  let controller = null;

  function setupCarousel() {
    const slide = document.getElementById('srv-book-carousel-slide');
    if (!slide || slide.dataset.bookInit === '1') return;
    slide.dataset.bookInit = '1';

    const trackEl = document.getElementById('srv-bc-track');
    const closeBtn = document.getElementById('srv-bc-close');
    const sceneEl = document.getElementById('srv-bc-scene');

    if (!trackEl) return;

    trackEl.innerHTML =
      '<div id="srv-bc-shelf-ledge" class="bc-shelf-ledge" aria-hidden="true"></div>' +
      SERVICE_BOOKS.map(renderBookDom).join('');
    const shelfLedgeEl = document.getElementById('srv-bc-shelf-ledge');
    const wrappers = Array.from(trackEl.querySelectorAll('.bc-wrapper'));

    const state = {
      target: 0,
      current: 0,
      dragging: false,
      moved: false,
      startX: 0,
      scrollStart: 0,
      opened: -1,
      openness: new Array(SERVICE_BOOKS.length).fill(0),
      spreadAlpha: 0,
      zoomTarget: 1,
      zoomCurrent: 1,
      panXTarget: 0,
      panXCurrent: 0,
      panYTarget: 0,
      panYCurrent: 0,
      panDragging: false,
      panMoved: false,
      panStartX: 0,
      panStartY: 0,
      panOriginX: 0,
      panOriginY: 0,
      pinchStartDist: 0,
      pinchStartZoom: 1,
      lastTapMs: 0,
      rafId: null,
      lastTime: 0,
      active: false,
      lastRenderedIdx: -1,
      introActive: false,
      introStartMs: 0,
      introFocusIdx: 0,
    };

    const zoomPctBtn = null;

    let openW = BASE_OPEN_W;
    let gap = BASE_GAP;
    let spineWidths = SERVICE_BOOKS.map((b) => b.spineW || 44);
    let bookHeights = SERVICE_BOOKS.map((b) => b.h);
    let trackBottom = 80;
    let stageHeight = 700;
    let stageWidth = 1280;
    let openZoom = 1.18;
    let topControlReserve = 46;
    const rotZs = SERVICE_BOOKS.map((b) => b.rotZ || 0);
    const clamp = (v) => Math.max(0, Math.min(v, SERVICE_BOOKS.length - 1));

    const bookDomParts = wrappers.map((el) => ({
      book: el.querySelector('.bc-book'),
      hinge: el.querySelector('.bc-hinge'),
      front: el.querySelector('.bc-front'),
      inside: el.querySelector('.bc-inside'),
      page: el.querySelector('.bc-page'),
      back: el.querySelector('.bc-back'),
      spine: el.querySelector('.bc-spine'),
      pagesRight: el.querySelector('.bc-pages-right'),
      pagesTop: el.querySelector('.bc-pages-top'),
      pagesBottom: el.querySelector('.bc-pages-bottom'),
    }));

    function clampBookPan(px, py, z) {
      if (z <= 1.02) return { x: 0, y: 0 };
      const idx = state.opened !== -1 ? state.opened : 0;
      const bH = bookHeights[idx] || 350;
      const totalSpreadW = 2 * openW * openZoom * z;
      const totalSpreadH = bH * openZoom * z;
      const maxX = Math.max(0, (totalSpreadW - stageWidth * 0.88) / 2);
      const maxY = Math.max(0, (totalSpreadH - (stageHeight - topControlReserve - 20)) / 2);
      return {
        x: Math.max(-maxX, Math.min(maxX, px)),
        y: Math.max(-maxY, Math.min(maxY, py)),
      };
    }

    function setBookZoom(nextZoom, focusClientX, focusClientY) {
      const clampedZ = Math.max(1.0, Math.min(2.6, nextZoom));
      if (clampedZ <= 1.03) {
        state.zoomTarget = 1.0;
        state.panXTarget = 0;
        state.panYTarget = 0;
      } else {
        state.zoomTarget = clampedZ;
        let nextPanX = state.panXTarget;
        let nextPanY = state.panYTarget;
        if (typeof focusClientX === 'number' && typeof focusClientY === 'number') {
          const rect = slide.getBoundingClientRect();
          const normX = (focusClientX - (rect.left + rect.width / 2)) / Math.max(1, rect.width / 2);
          const normY = (focusClientY - (rect.top + rect.height / 2)) / Math.max(1, rect.height / 2);
          const maxB = clampBookPan(-normX * openW * openZoom * clampedZ * 0.55, -normY * 180 * clampedZ, clampedZ);
          nextPanX = maxB.x;
          nextPanY = maxB.y;
        } else {
          const bound = clampBookPan(state.panXTarget, state.panYTarget, clampedZ);
          nextPanX = bound.x;
          nextPanY = bound.y;
        }
        state.panXTarget = nextPanX;
        state.panYTarget = nextPanY;
      }
      if (zoomPctBtn) {
        zoomPctBtn.textContent = `${Math.round(state.zoomTarget * 100)}%`;
      }
      slide.classList.toggle('is-zoomed', state.zoomTarget > 1.03);
    }

    function updateLayoutMetrics() {
      const rect = slide.getBoundingClientRect();
      stageWidth = rect.width > 120 ? rect.width : window.innerWidth;
      stageHeight = rect.height > 120 ? rect.height : Math.max(420, window.innerHeight - 122);

      trackBottom = Math.round(Math.max(52, Math.min(96, stageHeight * 0.11)));
      topControlReserve = stageWidth < 768 ? 50 : 44;
      const topHeadroom = Math.round(Math.max(54, Math.min(96, stageHeight * 0.12)));
      const availableH = Math.max(300, stageHeight - trackBottom - topHeadroom);

      const scaleH = availableH / 395;
      const scaleW = stageWidth < 640 ? stageWidth / 400 : stageWidth / 900;
      const scale = Math.max(0.84, Math.min(1.62, Math.min(scaleH, scaleW)));
      const fontScale = 1 + (scale - 1) * 0.6;

      openW = Math.round(BASE_OPEN_W * scale);
      gap = Math.round(BASE_GAP * scale);
      spineWidths = SERVICE_BOOKS.map((b) => Math.round((b.spineW || 44) * scale));
      bookHeights = SERVICE_BOOKS.map((b) => Math.round(b.h * scale));

      const pageScale = openW / 320;
      const targetSpreadW = stageWidth < 640 ? stageWidth * 0.94 : Math.min(930, stageWidth * 0.88);
      const maxZoomW = targetSpreadW / (2 * openW);
      const maxBookH = Math.max(...bookHeights);
      const availReadingH = Math.max(240, stageHeight - topControlReserve - 16);
      const maxZoomH = availReadingH / (maxBookH * 1.02);
      const minZoom = stageWidth < 640 ? 0.72 : 1.02;
      openZoom = Math.max(minZoom, Math.min(1.36, Math.min(maxZoomW, maxZoomH)));

      slide.style.setProperty('--bc-open-w', `${openW}px`);
      slide.style.setProperty('--bc-track-bottom', `${trackBottom}px`);
      slide.style.setProperty('--bc-font-scale', fontScale.toFixed(3));
      slide.style.setProperty('--bc-page-scale', Math.max(0.76, Math.min(1.24, pageScale)).toFixed(3));
      slide.style.setProperty(
        '--bc-cover-pad',
        `${Math.round(24 * fontScale)}px ${Math.round(20 * fontScale)}px`
      );

      for (let i = 0; i < SERVICE_BOOKS.length; i++) {
        const sW = spineWidths[i];
        const h = bookHeights[i];
        const p = bookDomParts[i];
        if (!p) continue;
        if (p.book) p.book.style.height = `${h}px`;
        if (p.front) p.front.style.width = `${openW}px`;
        if (p.inside) p.inside.style.width = `${openW}px`;
        if (p.page) p.page.style.transform = `translateZ(${(sW / 2 - 1).toFixed(2)}px)`;
        if (p.back) {
          p.back.style.width = `${openW}px`;
          p.back.style.transform = `rotateY(180deg) translateZ(${(sW / 2).toFixed(2)}px)`;
        }
        if (p.spine) {
          p.spine.style.width = `${sW}px`;
          p.spine.style.left = `${(-sW / 2).toFixed(2)}px`;
        }
        if (p.pagesRight) {
          p.pagesRight.style.width = `${sW}px`;
          p.pagesRight.style.left = `${(openW - sW / 2).toFixed(2)}px`;
        }
        if (p.pagesTop) {
          p.pagesTop.style.height = `${sW}px`;
          p.pagesTop.style.top = `${(-sW / 2).toFixed(2)}px`;
        }
        if (p.pagesBottom) {
          p.pagesBottom.style.height = `${sW}px`;
          p.pagesBottom.style.bottom = `${(-sW / 2).toFixed(2)}px`;
        }
      }
    }

    updateLayoutMetrics();
    window.addEventListener('resize', updateLayoutMetrics);

    function updateUiState(idx) {
      if (state.lastRenderedIdx === idx) return;
      state.lastRenderedIdx = idx;
      if (state.active) {
        const subnavBar = document.querySelector('[data-deck-bar="services"]');
        if (subnavBar) {
          const libPill = subnavBar.querySelector('[data-deck-pill="services:7"]');
          const keepLibActive = idx === 0 && libPill && libPill.classList.contains('is-active');
          const targetPill = keepLibActive ? 'services:7' : `services:${idx + 1}`;
          subnavBar.querySelectorAll('[data-deck-pill^="services:"]').forEach((pill) => {
            pill.classList.toggle('is-active', pill.getAttribute('data-deck-pill') === targetPill);
          });
        }
      }
    }

    function syncMobileReader(idx) {
      let mobileReader = slide.querySelector('#srv-bc-mobile-reader');
      if (!mobileReader) {
        mobileReader = document.createElement('div');
        mobileReader.id = 'srv-bc-mobile-reader';
        mobileReader.className = 'bc-mobile-reader';
        mobileReader.setAttribute('aria-label', 'Service Book Mobile Reading View');
        slide.appendChild(mobileReader);
      }
      if (idx < 0 || !SERVICE_BOOKS[idx]) {
        mobileReader.innerHTML = '';
        mobileReader.setAttribute('aria-hidden', 'true');
        return;
      }
      const book = SERVICE_BOOKS[idx];
      const total = SERVICE_BOOKS.length;
      const prevIdx = (idx - 1 + total) % total;
      const nextIdx = (idx + 1) % total;
      const cards = book.cards && book.cards.length ? book.cards : [];
      const highlights = book.highlights && book.highlights.length ? book.highlights : [];
      mobileReader.setAttribute('aria-hidden', 'false');
      mobileReader.dataset.mobilePage = 'overview';
      mobileReader.scrollTop = 0;
      mobileReader.innerHTML = `
        <div class="bc-mobile-sheet" data-mob-page="overview">
          <div class="bc-mobile-header">
            <span class="bc-spread-eyebrow">${escapeHtml(book.num)} / 06 &middot; SERVICE PILLAR</span>
            <button type="button" class="bc-book-top-close bc-mobile-close-btn" aria-label="Close service book">
              <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M2 2l10 10M12 2L2 12"/></svg>
            </button>
          </div>
          <div class="bc-mobile-tabs" role="tablist" aria-label="Book pages">
            <button type="button" role="tab" aria-selected="true" data-mob-tab="overview" class="bc-mobile-tab is-active">Overview</button>
            <button type="button" role="tab" aria-selected="false" data-mob-tab="deliverables" class="bc-mobile-tab">Deliverables (0${cards.length})</button>
          </div>
          <div class="bc-mobile-pane bc-mobile-pane--overview">
            ${(book.poster || book.img) ? `<div class="bc-mobile-banner"><img src="${escapeHtml(book.poster || book.img)}" alt="${escapeHtml(book.title)}" loading="lazy" /></div>` : ''}
            <div class="bc-mobile-hero">
              <div class="bc-spread-heading">
                <span class="bc-spread-volnum">${escapeHtml(book.num)}</span>
                <h3 class="bc-mobile-title">${escapeHtml(book.title)}</h3>
              </div>
              <p class="bc-mobile-sub">${escapeHtml(book.subtitle)}</p>
              <div class="bc-mobile-highlights">
                <div class="bc-mobile-highlights__head">
                  <span>Key Scope &amp; Standards</span>
                  <span class="bc-mobile-badge">${escapeHtml(book.badge || 'MEDIQ SOP')}</span>
                </div>
                <ul class="bc-mobile-list">${highlights.map((h, i) => `<li><span class="bc-mobile-idx">0${i + 1}</span><span>${escapeHtml(h)}</span></li>`).join('')}</ul>
              </div>
              <div class="bc-mobile-nav">
                <button type="button" class="bc-spread-navbtn" data-book-jump="${prevIdx}">&larr;&nbsp;${escapeHtml(SERVICE_BOOKS[prevIdx].num)}</button>
                <button type="button" class="bc-spread-inquire" data-mob-tab="deliverables">Deliverables&nbsp;&rarr;</button>
                <button type="button" class="bc-spread-navbtn" data-book-jump="${nextIdx}">${escapeHtml(SERVICE_BOOKS[nextIdx].num)}&nbsp;&rarr;</button>
              </div>
            </div>
          </div>
          <div class="bc-mobile-pane bc-mobile-pane--deliverables" hidden>
            <div class="bc-mobile-paper">
              <div class="bc-mobile-paper__top">
                <span>Core Deliverables</span>
                <span>Pillar ${escapeHtml(book.num)}</span>
              </div>
              <div class="bc-mobile-cards">
                ${cards.map((c) => `
                  <article class="bc-mobile-card">
                    <div class="bc-mobile-card__meta">
                      <span class="bc-mobile-card__code">${escapeHtml(c.code)}</span>
                      <span class="bc-mobile-card__tag">${escapeHtml(c.tag)}</span>
                    </div>
                    <h4 class="bc-mobile-card__title">${escapeHtml(c.title)}</h4>
                    <p class="bc-mobile-card__desc">${escapeHtml(c.desc)}</p>
                  </article>
                `).join('')}
              </div>
              <div class="bc-mobile-nav bc-mobile-nav--paper">
                <button type="button" class="bc-spread-navbtn" data-mob-tab="overview">&larr;&nbsp;Overview</button>
                <button type="button" class="bc-spread-inquire" data-book-inquiry="${escapeHtml(book.inquiry || 'Institutional Supply')}">Inquire&nbsp;&rarr;</button>
                <button type="button" class="bc-spread-navbtn" data-book-jump="${nextIdx}">${escapeHtml(SERVICE_BOOKS[nextIdx].num)}&nbsp;&rarr;</button>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    const desktopVideoMq = window.matchMedia('(min-width: 768px)');
    const isDesktopWebview = () => desktopVideoMq.matches;

    function syncSpreadVideos(openedIdx) {
      const canPlay = isDesktopWebview() && openedIdx >= 0;
      wrappers.forEach((wrapper, k) => {
        const plate = wrapper.querySelector('.bc-spread-plate');
        const video = wrapper.querySelector('.bc-spread-video');
        if (!video) return;

        if (canPlay && k === openedIdx) {
          const targetSrc = video.getAttribute('data-video-src') || '';
          if (!targetSrc) return;
          if (video.dataset.videoBound !== '1') {
            video.dataset.videoBound = '1';
            video.addEventListener('playing', () => {
              if (state.opened === k && isDesktopWebview() && plate) {
                plate.classList.add('is-video-playing');
              }
            });
            video.addEventListener('error', () => {
              if (plate) plate.classList.remove('is-video-playing');
            });
          }
          if (video.getAttribute('src') !== targetSrc) {
            if (plate) plate.classList.remove('is-video-playing');
            video.src = targetSrc;
          }
          video.muted = true;
          video.defaultMuted = true;
          video.loop = true;
          video.playsInline = true;
          const p = video.play();
          if (p && typeof p.catch === 'function') p.catch(() => {});
        } else {
          if (plate) plate.classList.remove('is-video-playing');
          try {
            video.pause();
          } catch (_) {}
          if (video.hasAttribute('src')) {
            video.removeAttribute('src');
            try {
              video.load();
            } catch (_) {}
          }
        }
      });
    }

    desktopVideoMq.addEventListener('change', (e) => {
      if (!e.matches) {
        syncSpreadVideos(-1);
      } else if (state.opened !== -1) {
        syncSpreadVideos(state.opened);
      }
    });

    function openBookSpread(idx) {
      const clamped = clamp(idx);
      if (!SERVICE_BOOKS[clamped]) return;
      state.introActive = false;
      if (sceneEl) {
        sceneEl.scrollLeft = 0;
        sceneEl.scrollTop = 0;
      }
      state.target = clamped;
      state.opened = clamped;
      setBookZoom(1.0);
      syncMobileReader(clamped);
      slide.classList.add('is-reading-open');
      if (closeBtn) closeBtn.classList.add('visible');
      wrappers.forEach((el, k) => {
        el.classList.toggle('is-book-open', k === clamped);
      });
      syncSpreadVideos(clamped);
    }

    function closeBookSpread() {
      state.opened = -1;
      setBookZoom(1.0);
      syncSpreadVideos(-1);
      syncMobileReader(-1);
      slide.classList.remove('is-reading-open');
      if (closeBtn) closeBtn.classList.remove('visible');
      wrappers.forEach((el) => el.classList.remove('is-book-open'));
    }

    function step(now) {
      if (!state.active) {
        state.rafId = null;
        state.lastTime = 0;
        return;
      }

      const ts = typeof now === 'number' ? now : performance.now();
      const dt = state.lastTime ? Math.min(0.12, Math.max(0.008, (ts - state.lastTime) / 1000)) : 1 / 60;
      state.lastTime = ts;
      const trackLerp = 1 - Math.exp(-9.5 * dt);
      const openLerp = 1 - Math.exp(-8.5 * dt);

      state.current += (state.target - state.current) * trackLerp;
      const targetSpread = state.opened !== -1 ? 1 : 0;
      state.spreadAlpha += (targetSpread - state.spreadAlpha) * openLerp;
      const zoomLerp = 1 - Math.exp(-12 * dt);
      state.zoomCurrent += (state.zoomTarget - state.zoomCurrent) * zoomLerp;
      state.panXCurrent += (state.panXTarget - state.panXCurrent) * zoomLerp;
      state.panYCurrent += (state.panYTarget - state.panYCurrent) * zoomLerp;

      const positions = [];
      let left = 0;
      for (let i = 0; i < SERVICE_BOOKS.length; i++) {
        positions[i] = left;
        const diff = i - state.current;
        const openness = Math.max(0, 1 - Math.abs(diff));
        const eo = smoothstep(openness);
        const w = spineWidths[i] + eo * (openW - spineWidths[i]);
        left += w + gap;
      }

      const getCenter = (i, prog) => {
        const idxSafe = Math.max(0, Math.min(SERVICE_BOOKS.length - 1, i));
        const d = idxSafe - prog;
        const openness = Math.max(0, 1 - Math.abs(d));
        const eo = smoothstep(openness);
        const w = spineWidths[idxSafe] + eo * (openW - spineWidths[idxSafe]);
        return positions[idxSafe] + w / 2;
      };

      const prev = Math.max(0, Math.min(SERVICE_BOOKS.length - 1, Math.floor(state.current)));
      const next = Math.min(SERVICE_BOOKS.length - 1, prev + 1);
      const frac = state.current - prev;
      const c1 = getCenter(prev, state.current);
      const c2 = getCenter(next, state.current);
      const cameraX = c1 * (1 - frac) + c2 * frac;

      const activeIdx = Math.max(0, Math.min(SERVICE_BOOKS.length - 1, Math.round(state.current)));
      updateUiState(activeIdx);

      if (typeof window.__updateServices3dBackdrop === 'function') {
        window.__updateServices3dBackdrop(state.current, state.spreadAlpha);
      }

      if (state.introActive && !state.introStartMs) {
        state.introStartMs = ts;
      }
      const introElapsed = state.introActive ? Math.max(0, (ts - state.introStartMs) / 1000) : 99;
      const shelfScale = 0.86;
      const shelfGap = 4;
      const shelfZ = -130;
      const shelfBaseY = 6;
      let totalShelfW = 0;
      for (let i = 0; i < spineWidths.length; i++) {
        totalShelfW += spineWidths[i] * shelfScale + (i > 0 ? shelfGap : 0);
      }
      let shelfCursor = -totalShelfW / 2;

      if (shelfLedgeEl) {
        if (state.introActive) {
          const ledgeFade =
            1 - smootherstep(Math.max(0, Math.min(1, (introElapsed - (SHELF_HOLD_SEC + 0.05)) / 0.65)));
          if (ledgeFade > 0.01) {
            const ledgeW = Math.round(totalShelfW + 128);
            shelfLedgeEl.style.display = 'block';
            shelfLedgeEl.style.width = `${ledgeW}px`;
            shelfLedgeEl.style.opacity = ledgeFade.toFixed(3);
            shelfLedgeEl.style.transform = `translateX(${(-ledgeW / 2).toFixed(2)}px) translateY(${(shelfBaseY + (1 - ledgeFade) * 14).toFixed(2)}px) translateZ(${(shelfZ - (1 - ledgeFade) * 40).toFixed(2)}px)`;
          } else {
            shelfLedgeEl.style.display = 'none';
          }
        } else {
          shelfLedgeEl.style.display = 'none';
        }
      }

      for (let i = 0; i < wrappers.length; i++) {
        const el = wrappers[i];
        const parts = bookDomParts[i];
        const diff = i - state.current;
        const openness = Math.max(0, 1 - Math.abs(diff));
        const eo = smoothstep(openness);

        const targetOpen = state.opened === i ? 1 : 0;
        state.openness[i] += (targetOpen - state.openness[i]) * openLerp;
        const cOpen = state.openness[i];

        const riseP = Math.min(1, cOpen * 1.85);
        const swingP = Math.max(0, Math.min(1, (cOpen - 0.18) / 0.82));
        const easeRise = smoothstep(riseP);
        const easeSwing = smoothstep(swingP);
        const facing = Math.max(eo, easeRise);

        const activeOpenScale = openZoom * (state.opened === i ? state.zoomCurrent : 1);
        const liveBaseScale = 1 + eo * 0.05;
        let scale = liveBaseScale + easeRise * (activeOpenScale - liveBaseScale);

        let x = positions[i] - cameraX + (1 - facing) * (spineWidths[i] / 2);
        let z = facing * 60;
        let y = 0;
        let rotateY = (1 - facing) * 90;
        let rotZ = rotZs[i] * (1 - facing) * (1 - easeRise);

        // Keeps center spine at x_screen = 0 as cover swings -172deg open & reserves top bar clearance
        x += easeSwing * ((scale * openW) / 2) + (state.opened === i ? easeRise * state.panXCurrent : 0);
        z += easeRise * 84;
        const bookH = bookHeights[i];
        const targetCenterY = topControlReserve + Math.max(240, stageHeight - topControlReserve - 16) / 2;
        const openShiftY = trackBottom + bookH / 2 - stageHeight + targetCenterY;
        y += easeRise * openShiftY + (state.opened === i ? easeRise * state.panYCurrent : 0);

        if (state.opened !== i && state.spreadAlpha > 0.005) {
          const openRef = state.opened !== -1 ? state.opened : state.current;
          const awayDir = i < openRef ? -1 : 1;
          x += awayDir * state.spreadAlpha * openW * 0.85;
          z -= state.spreadAlpha * 180;
          el.style.opacity = String(Math.max(0.08, 1 - state.spreadAlpha * 0.88).toFixed(3));
        } else {
          el.style.opacity = '1';
        }

        let floatWeight = 1;
        if (state.introActive) {
          const scaledSpine = spineWidths[i] * shelfScale;
          const shelfSpineCenterX = shelfCursor + scaledSpine / 2;
          shelfCursor += scaledSpine + shelfGap;
          const shelfX = shelfSpineCenterX - (openW / 2) * (1 - shelfScale);
          const shelfY = shelfBaseY + (bookH / 2) * (1 - shelfScale);

          const stagger = Math.abs(i - state.introFocusIdx) * FLOAT_STAGGER_SEC;
          const rawFloat = (introElapsed - (SHELF_HOLD_SEC + stagger)) / FLOAT_DURATION_SEC;
          floatWeight = smootherstep(rawFloat);
          const liftArc = -34 * Math.sin(floatWeight * Math.PI);

          x = shelfX + (x - shelfX) * floatWeight;
          y = shelfY + (y - shelfY) * floatWeight + liftArc;
          z = shelfZ + (z - shelfZ) * floatWeight;
          scale = shelfScale + (scale - shelfScale) * floatWeight;
          rotateY = 90 + (rotateY - 90) * floatWeight;
          rotZ *= floatWeight;
        }

        const zIndex = state.opened === i ? 240 : Math.round(100 - Math.abs(diff) * 10);
        el.style.zIndex = String(zIndex);
        el.style.pointerEvents = state.opened !== -1 && state.opened !== i ? 'none' : 'auto';
        el.style.transform = `translateX(${x.toFixed(2)}px) translateY(${y.toFixed(2)}px) translateZ(${z.toFixed(2)}px) scale(${scale.toFixed(4)}) rotateZ(${rotZ.toFixed(2)}deg)`;

        if (parts.book) parts.book.style.transform = `rotateY(${rotateY.toFixed(2)}deg)`;
        if (parts.hinge) {
          parts.hinge.style.transform = `translateZ(${spineWidths[i] / 2}px) rotateY(${(easeSwing * -172).toFixed(2)}deg)`;
        }
        if (parts.spine) {
          const liveBright = 0.68 + eo * 0.32;
          const shelfBright = 0.94;
          const spineBright = shelfBright + (liveBright - shelfBright) * floatWeight;
          parts.spine.style.filter = `brightness(${spineBright.toFixed(2)})`;
        }
      }

      if (
        state.introActive &&
        introElapsed >= SHELF_HOLD_SEC + Math.max(0, wrappers.length - 1) * FLOAT_STAGGER_SEC + FLOAT_DURATION_SEC
      ) {
        state.introActive = false;
      }

      if (typeof window.__updateServicesBookExplorer === 'function') {
        window.__updateServicesBookExplorer({
          current: state.current,
          opened: state.opened,
          spreadAlpha: state.spreadAlpha,
          openW,
          wrappers,
          bookDomParts,
        });
      }

      state.rafId = requestAnimationFrame(step);
    }

    wrappers.forEach((el, i) => {
      el.addEventListener('click', (e) => {
        const topCloseBtn = e.target.closest('.bc-book-top-close');
        if (topCloseBtn) {
          e.stopPropagation();
          closeBookSpread();
          return;
        }
        if (state.moved) return;

        const inquiryBtn = e.target.closest('[data-book-inquiry]');
        if (inquiryBtn) {
          e.stopPropagation();
          const topic = inquiryBtn.getAttribute('data-book-inquiry');
          closeBookSpread();
          const sel = document.getElementById('inq-product');
          if (sel && topic) {
            sel.value = topic;
            sel.dispatchEvent(new Event('change'));
          }
          if (window.navigateToSection) {
            window.navigateToSection('#contact');
          } else {
            document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
          }
          return;
        }

        const jumpBtn = e.target.closest('[data-book-jump]');
        if (jumpBtn) {
          e.stopPropagation();
          const nextIdx = Number(jumpBtn.getAttribute('data-book-jump'));
          if (!Number.isNaN(nextIdx)) openBookSpread(nextIdx);
          return;
        }

        if (state.opened === i) {
          return;
        }

        openBookSpread(i);
      });

      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (state.opened === i) {
            closeBookSpread();
          } else {
            openBookSpread(i);
          }
        }
      });
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeBookSpread();
      });
    }

    slide.addEventListener('click', (e) => {
      const mobClose = e.target.closest('.bc-mobile-close-btn');
      if (mobClose) {
        e.stopPropagation();
        closeBookSpread();
        return;
      }
      const mobTabBtn = e.target.closest('#srv-bc-mobile-reader [data-mob-tab]');
      if (mobTabBtn) {
        e.stopPropagation();
        const targetTab = mobTabBtn.getAttribute('data-mob-tab');
        const mobileReader = slide.querySelector('#srv-bc-mobile-reader');
        if (mobileReader && (targetTab === 'overview' || targetTab === 'deliverables')) {
          mobileReader.scrollTop = 0;
          mobileReader.dataset.mobilePage = targetTab;
          mobileReader.querySelectorAll('.bc-mobile-tab').forEach((tb) => {
            const active = tb.getAttribute('data-mob-tab') === targetTab;
            tb.classList.toggle('is-active', active);
            tb.setAttribute('aria-selected', String(active));
          });
          const ovPane = mobileReader.querySelector('.bc-mobile-pane--overview');
          const delPane = mobileReader.querySelector('.bc-mobile-pane--deliverables');
          if (ovPane) ovPane.hidden = targetTab !== 'overview';
          if (delPane) delPane.hidden = targetTab !== 'deliverables';
        }
        return;
      }
      const mobJump = e.target.closest('#srv-bc-mobile-reader [data-book-jump]');
      if (mobJump) {
        e.stopPropagation();
        const nextIdx = Number(mobJump.getAttribute('data-book-jump'));
        if (!Number.isNaN(nextIdx)) openBookSpread(nextIdx);
        return;
      }
      const mobInq = e.target.closest('#srv-bc-mobile-reader [data-book-inquiry]');
      if (mobInq) {
        e.stopPropagation();
        const topic = mobInq.getAttribute('data-book-inquiry');
        closeBookSpread();
        const sel = document.getElementById('inq-product');
        if (sel && topic) {
          sel.value = topic;
          sel.dispatchEvent(new Event('change'));
        }
        if (window.navigateToSection) {
          window.navigateToSection('#contact');
        } else {
          document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });

    if (sceneEl) {
      sceneEl.addEventListener('click', (e) => {
        if (e.target.closest('.bc-book-top-close')) {
          e.stopPropagation();
          closeBookSpread();
          return;
        }
        if (state.opened === -1 || state.moved || state.panMoved) return;
        if (!e.target.closest('.bc-wrapper')) {
          closeBookSpread();
        }
      });

      sceneEl.addEventListener('dblclick', (e) => {
        if (!state.active || state.opened === -1) return;
        if (e.target.closest('button, a')) return;
        e.preventDefault();
        if (state.zoomTarget > 1.2) {
          setBookZoom(1.0);
        } else {
          setBookZoom(1.85, e.clientX, e.clientY);
        }
      });

      sceneEl.addEventListener(
        'wheel',
        (e) => {
          if (!state.active) return;
          e.preventDefault();
          if (state.opened !== -1) {
            const delta = Math.sign(e.deltaY) * -0.22;
            if (Math.abs(delta) > 0) {
              setBookZoom(state.zoomTarget + delta, state.zoomTarget <= 1.05 ? e.clientX : undefined, state.zoomTarget <= 1.05 ? e.clientY : undefined);
            }
            return;
          }
          state.introActive = false;
          state.target = clamp(state.target + Math.sign(e.deltaY || e.deltaX) * 0.45);
        },
        { passive: false }
      );

      sceneEl.addEventListener('mousedown', (e) => {
        if (!state.active) return;
        if (e.target.closest('button, a')) return;
        if (state.opened !== -1 && state.zoomTarget > 1.03) {
          state.panDragging = true;
          state.panMoved = false;
          state.panStartX = e.clientX;
          state.panStartY = e.clientY;
          state.panOriginX = state.panXTarget;
          state.panOriginY = state.panYTarget;
          return;
        }
        if (state.opened !== -1) return;
        state.introActive = false;
        state.dragging = true;
        state.moved = false;
        state.startX = e.clientX;
        state.scrollStart = state.target;
      });

      window.addEventListener('mousemove', (e) => {
        if (state.panDragging && state.active && state.opened !== -1) {
          const dx = e.clientX - state.panStartX;
          const dy = e.clientY - state.panStartY;
          if (Math.hypot(dx, dy) > 5) state.panMoved = true;
          const bounded = clampBookPan(state.panOriginX + dx, state.panOriginY + dy, state.zoomTarget);
          state.panXTarget = bounded.x;
          state.panYTarget = bounded.y;
          return;
        }
        if (!state.dragging || !state.active || state.opened !== -1) return;
        const dx = e.clientX - state.startX;
        if (Math.abs(dx) > 6) state.moved = true;
        state.target = clamp(state.scrollStart + dx * -0.0085);
      });

      const endDrag = () => {
        state.dragging = false;
        state.panDragging = false;
        setTimeout(() => {
          state.moved = false;
          state.panMoved = false;
        }, 40);
      };
      window.addEventListener('mouseup', endDrag);

      sceneEl.addEventListener(
        'touchstart',
        (e) => {
          if (!state.active) return;
          if (state.opened !== -1) {
            if (e.touches.length === 2) {
              const dx = e.touches[0].clientX - e.touches[1].clientX;
              const dy = e.touches[0].clientY - e.touches[1].clientY;
              state.pinchStartDist = Math.hypot(dx, dy);
              state.pinchStartZoom = state.zoomTarget;
              state.panDragging = false;
              return;
            }
            if (e.touches.length === 1) {
              if (!e.target.closest('button, a')) {
                const nowMs = Date.now();
                if (nowMs - state.lastTapMs < 290) {
                  state.lastTapMs = 0;
                  if (state.zoomTarget > 1.2) {
                    setBookZoom(1.0);
                  } else {
                    setBookZoom(1.85, e.touches[0].clientX, e.touches[0].clientY);
                  }
                  return;
                }
                state.lastTapMs = nowMs;
              }
              if (state.zoomTarget > 1.03 && !e.target.closest('button, a')) {
                state.panDragging = true;
                state.panMoved = false;
                state.panStartX = e.touches[0].clientX;
                state.panStartY = e.touches[0].clientY;
                state.panOriginX = state.panXTarget;
                state.panOriginY = state.panYTarget;
              }
            }
            return;
          }
          state.introActive = false;
          state.dragging = true;
          state.moved = false;
          state.startX = e.touches[0].clientX;
          state.scrollStart = state.target;
        },
        { passive: true }
      );

      sceneEl.addEventListener(
        'touchmove',
        (e) => {
          if (!state.active) return;
          if (state.opened !== -1) {
            if (e.touches.length === 2 && state.pinchStartDist > 10) {
              if (e.cancelable) e.preventDefault();
              const dx = e.touches[0].clientX - e.touches[1].clientX;
              const dy = e.touches[0].clientY - e.touches[1].clientY;
              const dist = Math.hypot(dx, dy);
              setBookZoom(state.pinchStartZoom * (dist / state.pinchStartDist));
              return;
            }
            if (state.panDragging && e.touches.length === 1 && state.zoomTarget > 1.03) {
              if (e.cancelable) e.preventDefault();
              const dx = e.touches[0].clientX - state.panStartX;
              const dy = e.touches[0].clientY - state.panStartY;
              if (Math.hypot(dx, dy) > 5) state.panMoved = true;
              const bounded = clampBookPan(state.panOriginX + dx, state.panOriginY + dy, state.zoomTarget);
              state.panXTarget = bounded.x;
              state.panYTarget = bounded.y;
            }
            return;
          }
          if (!state.dragging) return;
          const dx = e.touches[0].clientX - state.startX;
          if (Math.abs(dx) > 6) state.moved = true;
          state.target = clamp(state.scrollStart + dx * -0.0085);
        },
        { passive: false }
      );

      sceneEl.addEventListener('touchend', () => {
        state.pinchStartDist = 0;
        endDrag();
      });
    }

    document.addEventListener('keydown', (e) => {
      if (!state.active) return;
      if (e.key === 'Escape' && state.opened !== -1) {
        closeBookSpread();
        return;
      }
      if (state.opened !== -1) {
        if (e.key === 'ArrowLeft') openBookSpread((state.opened - 1 + SERVICE_BOOKS.length) % SERVICE_BOOKS.length);
        if (e.key === 'ArrowRight') openBookSpread((state.opened + 1) % SERVICE_BOOKS.length);
        return;
      }
      if (e.key === 'ArrowLeft') {
        state.introActive = false;
        state.target = clamp(Math.round(state.target) - 1);
      }
      if (e.key === 'ArrowRight') {
        state.introActive = false;
        state.target = clamp(Math.round(state.target) + 1);
      }
    });

    controller = {
      activate(startIdx = 0) {
        updateLayoutMetrics();
        if (sceneEl) {
          sceneEl.scrollLeft = 0;
          sceneEl.scrollTop = 0;
        }
        const wasActive = state.active;
        state.active = true;
        closeBookSpread();
        const clamped = clamp(startIdx);
        state.target = clamped;
        if (!wasActive) {
          state.current = clamped;
          state.introActive = true;
          state.introStartMs = 0;
          state.introFocusIdx = clamped;
        }
        state.lastRenderedIdx = -1;
        updateUiState(clamped);
        if (typeof window.__setServicesBookExplorerActive === 'function') {
          window.__setServicesBookExplorerActive(true);
        }
        if (!state.rafId) state.rafId = requestAnimationFrame(step);
      },
      deactivate() {
        state.active = false;
        state.introActive = false;
        if (shelfLedgeEl) shelfLedgeEl.style.display = 'none';
        closeBookSpread();
        if (typeof window.__setServicesBookExplorerActive === 'function') {
          window.__setServicesBookExplorerActive(false);
        }
        if (state.rafId) {
          cancelAnimationFrame(state.rafId);
          state.rafId = null;
        }
      },
      openBook(idx) {
        updateLayoutMetrics();
        if (sceneEl) {
          sceneEl.scrollLeft = 0;
          sceneEl.scrollTop = 0;
        }
        state.active = true;
        state.introActive = false;
        if (typeof window.__setServicesBookExplorerActive === 'function') {
          window.__setServicesBookExplorerActive(true);
        }
        if (!state.rafId) state.rafId = requestAnimationFrame(step);
        openBookSpread(clamp(idx));
      },
    };
  }

  window.__setServicesBookCarouselActive = function (isActive, startIdx) {
    setupCarousel();
    if (!controller) return;
    if (isActive) {
      controller.activate(typeof startIdx === 'number' ? startIdx : 0);
    } else {
      controller.deactivate();
    }
  };

  window.__openServiceBookVolume = function (idx) {
    setupCarousel();
    if (!controller) return;
    const targetIdx = typeof idx === 'number' ? idx : 0;
    if (typeof window.goToDeckSlide === 'function') {
      window.goToDeckSlide('services', 7, true);
    } else {
      document.getElementById('distribution')?.scrollIntoView({ behavior: 'smooth' });
    }
    setTimeout(() => {
      if (controller) controller.openBook(targetIdx);
    }, 90);
  };

  function lazyBootServicesBookCarousel() {
    const distSec = document.getElementById('distribution');
    if (distSec && 'IntersectionObserver' in window) {
      let booted = false;
      const io = new IntersectionObserver((entries) => {
        if (!booted && entries.some((e) => e.isIntersecting)) {
          booted = true;
          io.disconnect();
          setupCarousel();
        }
      }, { rootMargin: '200px 0px', threshold: 0.01 });
      io.observe(distSec);
    } else {
      setupCarousel();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', lazyBootServicesBookCarousel);
  } else {
    lazyBootServicesBookCarousel();
  }
})();
