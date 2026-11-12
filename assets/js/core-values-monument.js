/**
 * MEDIQ Core Values — Editorial Split & 6 Navy-Glass Cards Controller
 * - Triggers the staged entrance sequence when #about-sec-values enters view:
 *   1) "OUR CORE VALUES" line draws in & label fades in
 *   2) Headline & intro fade up
 *   3) Six Core Value cards (01..06) rise in one by one
 * - Respects prefers-reduced-motion (disables all entrance & ambient motion if enabled)
 */
(function initCoreValuesSection() {
  'use strict';

  function setup() {
    const valuesSec = document.getElementById('about-sec-values');
    if (!valuesSec) return;

    const subScroll = document.getElementById('about-subpage-scroll');
    const parentSlide = valuesSec.closest('.about-slide');
    const motionQuery = window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)')
      : null;

    let hasTriggered = false;

    function isReducedMotion() {
      return Boolean(motionQuery && motionQuery.matches);
    }

    function revealImmediately() {
      hasTriggered = true;
      valuesSec.classList.remove('cv-js-ready');
      valuesSec.classList.add('cv-is-loaded');
    }

    function isSectionVisible() {
      if (valuesSec.classList.contains('is-hidden-subpage')) return false;
      if (!parentSlide) return true;
      if (parentSlide.classList.contains('opacity-0')) return false;
      if (parentSlide.classList.contains('pointer-events-none')) return false;
      return true;
    }

    function checkVisibilityAndTrigger() {
      if (isReducedMotion()) {
        revealImmediately();
        return;
      }

      if (!isSectionVisible()) {
        // Reset when leaving Core Values so re-entering Values replays cleanly
        if (hasTriggered) {
          hasTriggered = false;
          valuesSec.classList.remove('cv-is-loaded');
        }
        return;
      }

      if (hasTriggered) return;

      const rect = valuesSec.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight || 800;
      if (rect.width > 0 && rect.top <= vh * 0.88 && rect.bottom >= 80) {
        hasTriggered = true;
        requestAnimationFrame(() => {
          void valuesSec.offsetWidth;
          requestAnimationFrame(() => {
            if (isSectionVisible()) {
              valuesSec.classList.add('cv-is-loaded');
            }
          });
        });
      }
    }

    // Apply initial state based on reduced-motion setting
    if (isReducedMotion()) {
      revealImmediately();
    } else {
      valuesSec.classList.add('cv-js-ready');
      checkVisibilityAndTrigger();
    }

    // React dynamically if the user toggles reduced motion in system settings
    if (motionQuery) {
      const onMotionChange = () => {
        if (isReducedMotion()) {
          revealImmediately();
        } else {
          valuesSec.classList.add('cv-js-ready');
          valuesSec.classList.add('cv-is-loaded');
          hasTriggered = true;
        }
      };
      if (typeof motionQuery.addEventListener === 'function') {
        motionQuery.addEventListener('change', onMotionChange);
      } else if (typeof motionQuery.addListener === 'function') {
        motionQuery.addListener(onMotionChange);
      }
    }

    // Observe scroll & slide transitions so entrance fires right as Values enters view
    if (subScroll) {
      subScroll.addEventListener('scroll', checkVisibilityAndTrigger, { passive: true });
    }
    window.addEventListener('scroll', checkVisibilityAndTrigger, { passive: true });
    window.addEventListener('resize', checkVisibilityAndTrigger, { passive: true });

    if (typeof IntersectionObserver !== 'undefined') {
      const io = new IntersectionObserver(
        () => {
          checkVisibilityAndTrigger();
        },
        { root: subScroll || null, threshold: [0.05, 0.15, 0.3] }
      );
      io.observe(valuesSec);
    }

    if (typeof MutationObserver !== 'undefined') {
      const mo = new MutationObserver(() => {
        requestAnimationFrame(checkVisibilityAndTrigger);
      });
      mo.observe(valuesSec, { attributes: true, attributeFilter: ['class', 'style'] });
      if (parentSlide) {
        mo.observe(parentSlide, { attributes: true, attributeFilter: ['class', 'style'] });
      }
    }

    // Safe compatibility helper for external step navigation calls
    window.jumpCoreValuesStep = function () {
      if (subScroll && valuesSec) {
        subScroll.scrollTo({
          top: Math.max(0, valuesSec.offsetTop),
          behavior: isReducedMotion() ? 'auto' : 'smooth'
        });
      }
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup);
  } else {
    setup();
  }
})();
