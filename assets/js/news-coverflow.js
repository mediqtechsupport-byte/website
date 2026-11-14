/**
 * Full-Screen 3D CoverFlow Carousel Controller (#activities — News & Events)
 * Mirrors components/ui/3-d-coverflow-carousel.tsx with responsive 3D spacing,
 * dynamic ambient blurred photo backdrop, hover-paused autoplay, swipe & keys.
 */
(function () {
  'use strict';

  var ITEMS = [
    {
      id: 'rayner-portfolio',
      category: 'launches',
      tag: '#ProductLaunches',
      titleLine1: 'RAYNER PORTFOLIO',
      titleLine2: '\u2013 PHILIPPINE UPDATES',
      desc: 'Authorized RayOne EMV & Galaxy spiral optic IOL communications in the Philippines.',
      img: 'assets/img/rayone-emv-brochure.jpg',
      alt: 'Rayner RayOne EMV Portfolio Introduction',
      objPos: 'center center',
      ctaText: 'Read More',
      inquiry: 'Marketing/Partnership',
    },
    {
      id: 'apvrs-manila',
      category: 'education',
      tag: '#ProfEd',
      titleLine1: 'APVRS 2025 MANILA',
      titleLine2: '\u2013 OPHTHALMIC CONGRESS',
      desc: 'Ophthalmic symposia & surgical booth engagement at SMX Convention Center.',
      img: 'assets/activities/3.jpg',
      alt: 'MEDIQ & Rayner team at APVRS 2025 Manila Congress',
      objPos: 'center center',
      ctaText: 'Read More',
      inquiry: 'Education',
    },
    {
      id: 'spiral-optic',
      category: 'launches',
      tag: '#SpiralOptic',
      titleLine1: 'SPIRAL OPTIC TECH',
      titleLine2: '\u2013 INTRAOCULAR SYSTEMS',
      desc: 'Multichannel introductions of principal-approved intraocular optical systems.',
      img: 'assets/img/hero-products.jpg',
      alt: 'Spiral optic intraocular technology showcase',
      objPos: 'center center',
      ctaText: 'Read More',
      inquiry: 'Institutional Supply',
    },
    {
      id: 'clinical-orientation',
      category: 'education',
      tag: '#ClinicalOR',
      titleLine1: 'CLINICAL ORIENTATION',
      titleLine2: '\u2013 WET-LAB & OR BRIEFINGS',
      desc: 'Structured wet-lab workshops and operating-room technical briefings for surgical teams.',
      img: 'assets/activities/5.jpg',
      alt: 'Clinical specialist and OR engagement team',
      objPos: 'center top',
      ctaText: 'Read More',
      inquiry: 'Education',
    },
    {
      id: 'institutional-collaboration',
      category: 'company',
      tag: '#Institutional',
      titleLine1: 'NATIONAL NETWORK',
      titleLine2: '\u2013 HOSPITAL COLLABORATION',
      desc: 'Connecting Philippine eye centers and hospital surgical departments nationwide.',
      img: 'assets/activities/7.jpg',
      alt: 'MEDIQ leadership at institutional partner pavilion',
      objPos: 'center top',
      ctaText: 'Read More',
      inquiry: 'Institutional Supply',
    },
    {
      id: 'mediq-partnerships',
      category: 'company',
      tag: '#Partnerships',
      titleLine1: 'MEDIQ & RAYNER UK',
      titleLine2: '\u2013 2026 ALIGNMENT',
      desc: '2026 organizational growth and exclusive Rayner UK principal alignment.',
      img: 'assets/activities/mediq1.jpg',
      alt: 'MEDIQ Philippines and Rayner UK partnership team',
      objPos: 'center center',
      ctaText: 'Read More',
      inquiry: 'Marketing/Partnership',
    },
  ];

  function initNewsCoverFlow() {
    var section = document.getElementById('activities');
    var stage = document.getElementById('news-cf-stage');
    var dotsWrap = document.getElementById('news-cf-dots');
    var ambImg = document.getElementById('news-cf-ambience-img');
    var prevBtn = document.getElementById('news-cf-prev');
    var nextBtn = document.getElementById('news-cf-next');

    if (!section || !stage || !dotsWrap) return;
    if (section.dataset.cfBound === 'true') return;
    section.dataset.cfBound = 'true';

    var activeItems = ITEMS.slice();
    var currentIndex = 0;
    var cardEls = [];
    var dotEls = [];
    var isHovered = false;
    var isInView = false;
    var autoplayTimer = 0;
    var pointerDownX = null;

    function getStageSpacing() {
      var cardW = (cardEls[0] && cardEls[0].offsetWidth) || 380;
      var inner1 = Math.round(cardW * 0.85);
      var outer2 = Math.round(cardW * 1.48);
      return { inner1: inner1, outer2: outer2 };
    }

    function updateLayout() {
      var total = activeItems.length;
      if (!total || !cardEls.length) return;
      if (currentIndex >= total) currentIndex = 0;

      var spacing = getStageSpacing();
      var current = activeItems[currentIndex];

      if (ambImg && current && ambImg.getAttribute('data-current-src') !== current.img) {
        ambImg.setAttribute('data-current-src', current.img);
        ambImg.style.opacity = '0.35';
        ambImg.src = current.img;
        ambImg.alt = current.alt;
        requestAnimationFrame(function () {
          ambImg.style.opacity = '1';
        });
      }

      for (var idx = 0; idx < cardEls.length; idx++) {
        var el = cardEls[idx];
        var overlay = el.querySelector('.news-cf-overlay');
        var offset = (idx - currentIndex + total) % total;

        var transform = 'translateX(0px) scale(0.4) rotateY(0deg)';
        var opacity = 0;
        var zIndex = 0;
        var filter = 'brightness(0.4) blur(2px)';
        var isCenter = false;
        var pointerEvents = 'none';

        if (offset === 0) {
          isCenter = true;
          transform = 'translateX(0px) scale(1) rotateY(0deg)';
          opacity = 1;
          zIndex = 30;
          filter = 'brightness(1)';
          pointerEvents = 'auto';
        } else if (offset === 1) {
          transform = 'translateX(' + spacing.inner1 + 'px) scale(0.84) rotateY(-24deg)';
          opacity = 0.65;
          zIndex = 20;
          filter = 'brightness(0.75)';
          pointerEvents = 'auto';
        } else if (total >= 3 && offset === total - 1) {
          transform = 'translateX(-' + spacing.inner1 + 'px) scale(0.84) rotateY(24deg)';
          opacity = 0.65;
          zIndex = 20;
          filter = 'brightness(0.75)';
          pointerEvents = 'auto';
        } else if (total >= 5 && offset === 2) {
          transform = 'translateX(' + spacing.outer2 + 'px) scale(0.68) rotateY(-38deg)';
          opacity = 0.38;
          zIndex = 10;
          filter = 'brightness(0.55) blur(1px)';
          pointerEvents = 'auto';
        } else if (total >= 5 && offset === total - 2) {
          transform = 'translateX(-' + spacing.outer2 + 'px) scale(0.68) rotateY(38deg)';
          opacity = 0.38;
          zIndex = 10;
          filter = 'brightness(0.55) blur(1px)';
          pointerEvents = 'auto';
        }

        el.style.transform = transform;
        el.style.opacity = String(opacity);
        el.style.zIndex = String(zIndex);
        el.style.filter = filter;
        el.style.pointerEvents = pointerEvents;
        el.style.cursor = isCenter ? 'default' : 'pointer';
        el.style.boxShadow = isCenter
          ? '0 25px 60px rgba(0, 0, 0, 0.9), 0 0 35px rgba(197, 168, 128, 0.25)'
          : '0 15px 35px rgba(0, 0, 0, 0.5)';
        el.setAttribute('data-center', isCenter ? 'true' : 'false');

        if (overlay) {
          overlay.style.opacity = isCenter ? '1' : '0';
          overlay.style.transform = isCenter ? 'translateY(0px)' : 'translateY(16px)';
          overlay.style.pointerEvents = isCenter ? 'auto' : 'none';
        }
      }

      for (var d = 0; d < dotEls.length; d++) {
        var activeDot = d === currentIndex;
        dotEls[d].style.width = activeDot ? '28px' : '8px';
        dotEls[d].style.backgroundColor = activeDot ? '#c5a880' : 'rgba(255, 255, 255, 0.25)';
        dotEls[d].style.boxShadow = activeDot ? '0 0 10px rgba(197, 168, 128, 0.7)' : 'none';
        dotEls[d].setAttribute('aria-current', activeDot ? 'true' : 'false');
      }
    }

    function createCardElement(item, idx) {
      var card = document.createElement('div');
      card.className = 'news-cf-card';
      card.setAttribute('data-news-id', item.id);
      card.style.cssText = [
        'position:absolute',
        'width:clamp(275px, 26vw, 405px)',
        'height:clamp(410px, 64vh, 600px)',
        'border-radius:18px',
        'overflow:hidden',
        'background-color:#171311',
        'border:1px solid rgba(255,255,255,0.12)',
        'transform-origin:center center',
        'transition:all 800ms cubic-bezier(0.25, 1, 0.5, 1)',
        'will-change:transform,opacity,filter',
      ].join(';');

      card.addEventListener('click', function () {
        if (idx !== currentIndex) {
          goToSlide(idx);
        }
      });

      var img = document.createElement('img');
      img.src = item.img;
      img.alt = item.alt;
      img.draggable = false;
      img.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;pointer-events:none;';
      img.style.objectPosition = item.objPos || 'center center';
      card.appendChild(img);

      var vignette = document.createElement('div');
      vignette.style.cssText = [
        'position:absolute',
        'inset:0',
        'background:linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.1) 25%, rgba(0,0,0,0.68) 60%, rgba(0,0,0,0.96) 100%)',
        'pointer-events:none',
        'z-index:10',
      ].join(';');
      card.appendChild(vignette);

      var overlay = document.createElement('div');
      overlay.className = 'news-cf-overlay';
      overlay.style.cssText = [
        'position:relative',
        'width:100%',
        'height:100%',
        'padding:24px 22px 26px',
        'display:flex',
        'flex-direction:column',
        'justify-content:space-between',
        'text-align:center',
        'z-index:20',
        'transition:opacity 500ms ease, transform 500ms ease',
      ].join(';');

      var tagRow = document.createElement('div');
      tagRow.style.cssText = 'text-align:right;width:100%;padding-right:4px;';
      var tagSpan = document.createElement('span');
      tagSpan.textContent = item.tag;
      tagSpan.style.cssText = [
        'display:inline-block',
        'font-size:0.82rem',
        'font-weight:600',
        'letter-spacing:0.06em',
        'color:rgba(255,255,255,0.9)',
        'text-shadow:0 2px 6px rgba(0,0,0,0.8)',
      ].join(';');
      tagRow.appendChild(tagSpan);
      overlay.appendChild(tagRow);

      var body = document.createElement('div');
      body.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:4px;margin-top:auto;padding-bottom:4px;';

      var h3 = document.createElement('h3');
      h3.textContent = item.titleLine1;
      h3.style.cssText = [
        'font-size:clamp(1.38rem, 1.8vw, 1.88rem)',
        'font-weight:900',
        'text-transform:uppercase',
        'letter-spacing:0.04em',
        'color:#ffffff',
        'margin:0',
        'line-height:1.1',
        'text-shadow:0 3px 12px rgba(0,0,0,0.95)',
      ].join(';');
      body.appendChild(h3);

      var sub = document.createElement('span');
      sub.textContent = item.titleLine2;
      sub.style.cssText = [
        'font-size:clamp(0.92rem, 1.12vw, 1.18rem)',
        'font-weight:700',
        'text-transform:uppercase',
        'letter-spacing:0.06em',
        'color:#f3f0ea',
        'line-height:1.2',
        'text-shadow:0 3px 10px rgba(0,0,0,0.9)',
      ].join(';');
      body.appendChild(sub);

      var bar = document.createElement('div');
      bar.style.cssText = [
        'width:38px',
        'height:2px',
        'background-color:#c5a880',
        'border-radius:2px',
        'margin:6px auto 5px',
        'box-shadow:0 0 8px rgba(197,168,128,0.7)',
      ].join(';');
      body.appendChild(bar);

      var desc = document.createElement('p');
      desc.textContent = item.desc;
      desc.style.cssText = [
        'font-size:0.88rem',
        'font-style:italic',
        'color:rgba(255,255,255,0.9)',
        'max-width:310px',
        'margin:0 0 12px',
        'line-height:1.35',
        'text-shadow:0 2px 8px rgba(0,0,0,0.9)',
      ].join(';');
      body.appendChild(desc);

      var cta = document.createElement('a');
      cta.href = '#contact';
      cta.setAttribute('data-select-inquiry', item.inquiry);
      cta.style.cssText = [
        'display:inline-flex',
        'align-items:center',
        'gap:7px',
        'padding:9px 22px',
        'border-radius:9999px',
        'background:linear-gradient(135deg, #c5a880 0%, #a48256 100%)',
        'color:#110d0c',
        'font-size:0.76rem',
        'font-weight:800',
        'letter-spacing:0.14em',
        'text-transform:uppercase',
        'text-decoration:none',
        'box-shadow:0 4px 14px rgba(0,0,0,0.4), 0 0 15px rgba(197,168,128,0.3)',
        'cursor:pointer',
        'transition:transform 200ms ease, box-shadow 200ms ease',
      ].join(';');
      cta.innerHTML = '<span>' + item.ctaText + '</span><svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>';
      cta.addEventListener('click', function (ev) {
        ev.stopPropagation();
        if (window.navigateToSection) {
          ev.preventDefault();
          window.navigateToSection('#contact');
        }
      });
      body.appendChild(cta);

      overlay.appendChild(body);
      card.appendChild(overlay);
      return card;
    }

    function renderDeck() {
      stage.innerHTML = '';
      dotsWrap.innerHTML = '';
      cardEls = [];
      dotEls = [];

      activeItems.forEach(function (item, idx) {
        var card = createCardElement(item, idx);
        stage.appendChild(card);
        cardEls.push(card);

        var dot = document.createElement('button');
        dot.type = 'button';
        dot.setAttribute('aria-label', 'Go to slide ' + (idx + 1));
        dot.style.cssText = [
          'height:8px',
          'width:8px',
          'border-radius:9999px',
          'border:none',
          'cursor:pointer',
          'transition:all 300ms ease',
        ].join(';');
        dot.addEventListener('click', function () {
          goToSlide(idx);
        });
        dotsWrap.appendChild(dot);
        dotEls.push(dot);
      });

      updateLayout();
    }

    function nextSlide() {
      if (activeItems.length <= 1) return;
      currentIndex = (currentIndex + 1) % activeItems.length;
      updateLayout();
    }

    function prevSlide() {
      if (activeItems.length <= 1) return;
      currentIndex = (currentIndex - 1 + activeItems.length) % activeItems.length;
      updateLayout();
    }

    function goToSlide(idx) {
      if (!activeItems.length) return;
      currentIndex = ((idx % activeItems.length) + activeItems.length) % activeItems.length;
      updateLayout();
    }

    function syncAutoplay() {
      if (autoplayTimer) {
        clearInterval(autoplayTimer);
        autoplayTimer = 0;
      }
      if (isInView && !isHovered && !document.hidden && activeItems.length > 1) {
        autoplayTimer = setInterval(nextSlide, 5000);
      }
    }

    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);

    section.addEventListener('mouseenter', function () {
      isHovered = true;
      syncAutoplay();
    });
    section.addEventListener('mouseleave', function () {
      isHovered = false;
      syncAutoplay();
    });

    stage.addEventListener('pointerdown', function (ev) {
      if (ev.target.closest('a, button')) return;
      pointerDownX = ev.clientX;
    });
    stage.addEventListener('pointerup', function (ev) {
      if (pointerDownX === null) return;
      var diff = ev.clientX - pointerDownX;
      pointerDownX = null;
      if (Math.abs(diff) > 45) {
        if (diff < 0) nextSlide();
        else prevSlide();
      }
    });
    stage.addEventListener('pointercancel', function () {
      pointerDownX = null;
    });

    window.addEventListener('keydown', function (ev) {
      if (!isInView) return;
      if (ev.key === 'ArrowLeft') prevSlide();
      if (ev.key === 'ArrowRight') nextSlide();
    });

    window.addEventListener('resize', updateLayout, { passive: true });
    document.addEventListener('visibilitychange', syncAutoplay);

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          isInView = entry.isIntersecting;
          syncAutoplay();
        });
      }, { threshold: 0.2 });
      io.observe(section);
    } else {
      isInView = true;
    }

    window.__goToNewsSlide = function (idOrIdx) {
      if (!activeItems.length) return;
      var targetIdx = typeof idOrIdx === 'number'
        ? idOrIdx
        : activeItems.findIndex(function (it) { return it.id === idOrIdx; });
      if (targetIdx >= 0) {
        goToSlide(targetIdx);
        syncAutoplay();
      }
    };

    renderDeck();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNewsCoverFlow);
  } else {
    initNewsCoverFlow();
  }
})();
