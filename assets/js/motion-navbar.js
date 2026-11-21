/**
 * MotionNavigationMenu vanilla physics & interaction controller for #site-header.
 * Implements the Framer-Motion-style spring sliding list highlight, shared morphing
 * dropdown viewport with boundary clamping, directional horizontal content slide,
 * rotating chevron triggers, and inner card highlight tracking.
 */
(function initMotionNavbar() {
  'use strict';

  function boot() {
    var root = document.getElementById('motion-nav-root');
    if (!root) return;

    var listWrap = document.getElementById('motion-nav-list-wrap');
    var listHighlight = document.getElementById('motion-nav-list-highlight');
    var viewportPos = document.getElementById('motion-nav-viewport-pos');
    var viewportEl = document.getElementById('motion-nav-viewport');
    if (!listWrap || !viewportPos || !viewportEl) return;

    var triggers = Array.prototype.slice.call(
      root.querySelectorAll('[data-slot="navigation-menu-trigger"][data-panel-target]')
    );
    var topTargets = Array.prototype.slice.call(
      root.querySelectorAll('[data-slot="navigation-menu-trigger"], [data-motion-nav-direct]')
    );
    var panels = Array.prototype.slice.call(
      viewportEl.querySelectorAll('[data-slot="navigation-menu-content"][data-panel]')
    );

    var panelByValue = {};
    panels.forEach(function (panel) {
      panelByValue[panel.getAttribute('data-panel')] = panel;
    });

    var itemValues = triggers.map(function (tr) {
      return tr.getAttribute('data-panel-target');
    }).filter(Boolean);

    var activeValue = '';
    var closeTimer = null;
    var exitTimers = {};

    function cancelCloseTimer() {
      if (closeTimer) {
        clearTimeout(closeTimer);
        closeTimer = null;
      }
    }

    function moveListHighlight(targetEl) {
      if (!listHighlight) return;
      if (!targetEl) {
        listHighlight.style.opacity = '0';
        return;
      }
      var wrapRect = listWrap.getBoundingClientRect();
      var elRect = targetEl.getBoundingClientRect();
      var x = elRect.left - wrapRect.left;
      var y = elRect.top - wrapRect.top;
      listHighlight.style.width = elRect.width + 'px';
      listHighlight.style.height = elRect.height + 'px';
      listHighlight.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0)';
      listHighlight.style.opacity = '1';
    }

    function updateViewportPosition(val) {
      var targetVal = val || activeValue;
      var rootRect = root.getBoundingClientRect();
      if (!targetVal) {
        viewportPos.style.left = (rootRect.width / 2) + 'px';
        return;
      }

      var activeTrigger = null;
      for (var i = 0; i < triggers.length; i++) {
        if (triggers[i].getAttribute('data-panel-target') === targetVal) {
          activeTrigger = triggers[i];
          break;
        }
      }
      if (!activeTrigger) return;

      var panel = panelByValue[targetVal];
      var panelWidth = panel ? panel.offsetWidth : 0;
      var panelHeight = panel ? panel.offsetHeight : 0;
      if (panelWidth > 0 && panelHeight > 0) {
        viewportEl.style.width = panelWidth + 'px';
        viewportEl.style.height = panelHeight + 'px';
      }

      var trigRect = activeTrigger.getBoundingClientRect();
      var idealX = trigRect.left - rootRect.left + trigRect.width / 2;

      if (panelWidth > 0) {
        var half = panelWidth / 2;
        var margin = 12;
        var dropLeft = rootRect.left + idealX - half;
        var dropRight = rootRect.left + idealX + half;
        var maxRight = (document.documentElement.clientWidth || window.innerWidth) - margin;
        var adj = 0;
        if (dropLeft < margin) {
          adj = margin - dropLeft;
        } else if (dropRight > maxRight) {
          adj = maxRight - dropRight;
        }
        idealX += adj;
      }

      viewportPos.style.left = idealX.toFixed(1) + 'px';
    }

    function hidePanelImmediate(panel) {
      panel.classList.remove('is-panel-active', 'is-panel-exiting', 'is-panel-motion');
      panel.style.opacity = '0';
      panel.style.pointerEvents = 'none';
      panel.style.transform = 'translate3d(0,0,0)';
      var hl = panel.querySelector('.motion-nav-inner-highlight');
      if (hl) hl.style.opacity = '0';
    }

    function openValue(nextValue) {
      cancelCloseTimer();
      if (!nextValue || !panelByValue[nextValue]) return;
      if (nextValue === activeValue) {
        updateViewportPosition(nextValue);
        return;
      }

      var prevValue = activeValue;
      var prevIndex = prevValue ? itemValues.indexOf(prevValue) : -1;
      var nextIndex = itemValues.indexOf(nextValue);
      var dir = (prevIndex !== -1 && nextIndex !== -1 && nextIndex < prevIndex) ? -1 : 1;

      activeValue = nextValue;
      root.setAttribute('data-active-menu', nextValue);
      viewportPos.classList.add('is-open');
      viewportEl.classList.add('is-open');

      triggers.forEach(function (tr) {
        var isThis = tr.getAttribute('data-panel-target') === nextValue;
        tr.setAttribute('data-state', isThis ? 'open' : 'closed');
        tr.setAttribute('aria-expanded', isThis ? 'true' : 'false');
      });

      panels.forEach(function (p) {
        var pVal = p.getAttribute('data-panel');
        if (exitTimers[pVal]) {
          clearTimeout(exitTimers[pVal]);
          delete exitTimers[pVal];
        }
        if (pVal !== nextValue && pVal !== prevValue) {
          hidePanelImmediate(p);
        }
      });

      if (prevValue && panelByValue[prevValue]) {
        var prevPanel = panelByValue[prevValue];
        prevPanel.classList.remove('is-panel-active');
        prevPanel.classList.add('is-panel-motion', 'is-panel-exiting');
        prevPanel.style.pointerEvents = 'none';
        prevPanel.style.transform = 'translate3d(' + (-48 * dir) + 'px,0,0)';
        prevPanel.style.opacity = '0';
        exitTimers[prevValue] = setTimeout(function () {
          if (activeValue !== prevValue) {
            hidePanelImmediate(prevPanel);
          }
        }, 320);
      }

      var nextPanel = panelByValue[nextValue];
      nextPanel.classList.remove('is-panel-exiting', 'is-panel-motion');
      nextPanel.classList.add('is-panel-active');
      nextPanel.style.pointerEvents = 'auto';

      if (prevValue) {
        nextPanel.style.transform = 'translate3d(' + (48 * dir) + 'px,0,0)';
        nextPanel.style.opacity = '0';
        void nextPanel.offsetWidth;
        nextPanel.classList.add('is-panel-motion');
        requestAnimationFrame(function () {
          if (activeValue === nextValue) {
            nextPanel.style.transform = 'translate3d(0,0,0)';
            nextPanel.style.opacity = '1';
          }
        });
      } else {
        nextPanel.style.transform = 'translate3d(0,0,0)';
        nextPanel.style.opacity = '1';
      }

      updateViewportPosition(nextValue);
    }

    function closeMenu(immediate) {
      cancelCloseTimer();
      if (!activeValue) {
        if (immediate) moveListHighlight(null);
        return;
      }
      var closingVal = activeValue;
      activeValue = '';
      root.removeAttribute('data-active-menu');
      viewportPos.classList.remove('is-open');
      viewportEl.classList.remove('is-open');
      viewportEl.style.width = '0px';
      viewportEl.style.height = '0px';

      triggers.forEach(function (tr) {
        tr.setAttribute('data-state', 'closed');
        tr.setAttribute('aria-expanded', 'false');
      });

      if (closingVal && panelByValue[closingVal]) {
        var p = panelByValue[closingVal];
        if (immediate) {
          hidePanelImmediate(p);
        } else {
          p.style.opacity = '0';
          p.style.pointerEvents = 'none';
          exitTimers[closingVal] = setTimeout(function () {
            if (!activeValue) hidePanelImmediate(p);
          }, 260);
        }
      }
    }

    function scheduleClose() {
      cancelCloseTimer();
      closeTimer = setTimeout(function () {
        closeMenu(false);
        moveListHighlight(null);
      }, 130);
    }

    // Bind top-level triggers and direct links
    topTargets.forEach(function (el) {
      var panelVal = el.getAttribute('data-panel-target');
      el.addEventListener('pointerenter', function () {
        moveListHighlight(el);
        if (panelVal) {
          openValue(panelVal);
        } else {
          closeMenu(false);
        }
      });
      el.addEventListener('focus', function () {
        moveListHighlight(el);
        if (panelVal) {
          openValue(panelVal);
        } else {
          closeMenu(false);
        }
      });
      el.addEventListener('click', function () {
        closeMenu(true);
        moveListHighlight(null);
        if (typeof el.blur === 'function') el.blur();
      });
    });

    listWrap.addEventListener('pointerleave', function () {
      moveListHighlight(null);
    });

    root.addEventListener('pointerenter', cancelCloseTimer);
    root.addEventListener('pointerleave', scheduleClose);
    viewportPos.addEventListener('pointerenter', cancelCloseTimer);
    viewportPos.addEventListener('pointerleave', scheduleClose);

    // Bind inner highlight tracking & click-to-close across all dropdown links
    panels.forEach(function (panel) {
      var inner = panel.querySelector('.motion-nav-panel-inner');
      var innerHL = panel.querySelector('.motion-nav-inner-highlight');
      var links = Array.prototype.slice.call(
        panel.querySelectorAll('[data-slot="navigation-menu-link"]')
      );

      function moveInnerHL(linkEl) {
        if (!inner || !innerHL) return;
        if (!linkEl) {
          innerHL.style.opacity = '0';
          return;
        }
        var ir = inner.getBoundingClientRect();
        var lr = linkEl.getBoundingClientRect();
        innerHL.style.width = lr.width + 'px';
        innerHL.style.height = lr.height + 'px';
        innerHL.style.transform =
          'translate3d(' + (lr.left - ir.left).toFixed(1) + 'px,' + (lr.top - ir.top).toFixed(1) + 'px,0)';
        innerHL.style.opacity = '1';
      }

      links.forEach(function (link) {
        link.addEventListener('pointerenter', function () {
          moveInnerHL(link);
        });
        link.addEventListener('focus', function () {
          moveInnerHL(link);
        });
        link.addEventListener('click', function () {
          closeMenu(true);
          moveListHighlight(null);
          if (document.activeElement && typeof document.activeElement.blur === 'function') {
            document.activeElement.blur();
          }
        });
      });

      if (inner) {
        inner.addEventListener('pointerleave', function () {
          moveInnerHL(null);
        });
      }
    });

    document.addEventListener('pointerdown', function (event) {
      if (event.target instanceof Node && !root.contains(event.target)) {
        closeMenu(false);
        moveListHighlight(null);
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && activeValue) {
        var openTrig = root.querySelector('[data-slot="navigation-menu-trigger"][data-state="open"]');
        closeMenu(true);
        moveListHighlight(null);
        if (openTrig && typeof openTrig.focus === 'function') {
          openTrig.focus();
        }
      }
    });

    window.addEventListener('resize', function () {
      if (activeValue) updateViewportPosition(activeValue);
    }, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
