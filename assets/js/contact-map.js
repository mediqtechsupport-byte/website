/**
 * MEDIQ Edge-to-Edge Footer Interactive Map — mapcn Dark Matter Marker Content
 * -----------------------------------------------------------------------------------------
 * Ports components/ui/mapcn-marker-content.tsx directly onto #footer-map-band:
 *  - Edge-to-edge full-bleed viewport container below <footer>
 *  - Centered on Marikina – Pasig, Metro Manila (14.6184° N, 121.0942° E)
 *  - Dark Matter basemap aesthetics (#09090b / #111318 / charcoal arteries & dark waterways)
 *  - Interactive circular blue markers matching mapcn <MarkerContent> + <MarkerTooltip>
 *  - Progressive live MapLibre GL + CARTO dark-matter-gl-style upgrade when online
 */
(function () {
  'use strict';

  var MAPLIBRE_VERSION = '5.3.0';
  var CARTO_DARK_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';
  var CENTER_LNG_LAT = [121.0942, 14.6184];

  var MARKER_LOCATIONS = [
    {
      id: 1,
      name: 'MediQ Pharma Inc. — Marikina–Pasig Hub',
      subtitle: 'Marcos Hwy · Santolan Corridor',
      lng: 121.0942,
      lat: 14.6184,
      wx: 6,
      wy: -4,
      primary: true
    },
    {
      id: 2,
      name: 'Marikina City Corridor',
      subtitle: 'J.P. Rizal · Marikina Valley',
      lng: 121.1029,
      lat: 14.6507,
      wx: 18,
      wy: -68,
      primary: false
    },
    {
      id: 3,
      name: 'Pasig – Ortigas Corridor',
      subtitle: 'C-5 · Bagong Ilog / Rosario',
      lng: 121.0851,
      lat: 14.5764,
      wx: 14,
      wy: 44,
      primary: false
    },
    {
      id: 4,
      name: 'Ortigas Commercial Center',
      subtitle: 'Ortigas Ave · EDSA',
      lng: 121.0614,
      lat: 14.5869,
      wx: -116,
      wy: 10,
      primary: false
    }
  ];

  function createMapcnMarkerEl(loc, onClick) {
    var wrap = document.createElement('div');
    wrap.className = 'relative group flex items-center justify-center cursor-pointer select-none';
    wrap.style.zIndex = loc.primary ? '18' : '14';
    wrap.setAttribute('data-mapcn-marker', loc.name);
    wrap.setAttribute('role', 'button');
    wrap.setAttribute('tabindex', '0');
    wrap.setAttribute('aria-label', loc.name);

    if (loc.primary) {
      var halo = document.createElement('span');
      halo.style.cssText =
        'position:absolute;width:36px;height:36px;border-radius:9999px;background:rgba(59,130,246,0.28);animation:ping 2.4s cubic-bezier(0,0,0.2,1) infinite;pointer-events:none;';
      wrap.appendChild(halo);
    }

    var dot = document.createElement('div');
    dot.style.cssText =
      'position:relative;width:' +
      (loc.primary ? '20px' : '16px') +
      ';height:' +
      (loc.primary ? '20px' : '16px') +
      ';border-radius:9999px;border:2px solid #ffffff;background:#3b82f6;box-shadow:0 6px 18px rgba(37,99,235,0.55),0 0 0 1px rgba(0,0,0,0.35);transition:transform 160ms ease,background-color 160ms ease;';
    wrap.appendChild(dot);

    var tooltip = document.createElement('div');
    tooltip.style.cssText =
      'position:absolute;bottom:100%;left:50%;transform:translate(-50%,-10px) scale(0.95);opacity:0;pointer-events:none;white-space:nowrap;border-radius:8px;background:rgba(12,13,18,0.96);color:#fafafa;border:1px solid rgba(255,255,255,0.16);padding:5px 10px;font-size:11.5px;line-height:1.35;box-shadow:0 10px 28px rgba(0,0,0,0.65);transition:opacity 150ms ease,transform 150ms ease;z-index:30;';
    var titleEl = document.createElement('div');
    titleEl.style.fontWeight = '600';
    titleEl.textContent = loc.name;
    var subEl = document.createElement('div');
    subEl.style.cssText = 'font-size:10px;color:#93c5fd;margin-top:1px;';
    subEl.textContent = loc.subtitle;
    tooltip.appendChild(titleEl);
    tooltip.appendChild(subEl);
    wrap.appendChild(tooltip);

    var showTip = function () {
      dot.style.transform = 'scale(1.16)';
      dot.style.backgroundColor = '#60a5fa';
      tooltip.style.opacity = '1';
      tooltip.style.transform = 'translate(-50%,-10px) scale(1)';
    };
    var hideTip = function () {
      dot.style.transform = 'scale(1)';
      dot.style.backgroundColor = '#3b82f6';
      if (!loc._pinned) {
        tooltip.style.opacity = '0';
        tooltip.style.transform = 'translate(-50%,-10px) scale(0.95)';
      }
    };

    if (loc.primary) {
      loc._pinned = true;
      showTip();
      dot.style.transform = 'scale(1)';
      dot.style.backgroundColor = '#3b82f6';
    }

    wrap.addEventListener('mouseenter', showTip);
    wrap.addEventListener('mouseleave', hideTip);
    wrap.addEventListener('click', function (e) {
      e.stopPropagation();
      loc._pinned = !loc._pinned;
      if (loc._pinned) showTip();
      else hideTip();
      if (onClick) onClick(loc);
    });
    return { wrap: wrap, showTip: showTip, hideTip: hideTip };
  }

  function initFooterDarkMatterMap() {
    var canvas = document.getElementById('contact-map-canvas');
    var stage = document.getElementById('contact-map-stage');
    var wrap = document.getElementById('contact-map-wrap');
    if (!canvas || !stage) return;

    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    var zoomInBtn = document.getElementById('contact-map-zoom-in');
    var zoomOutBtn = document.getElementById('contact-map-zoom-out');
    var resetBtn = document.getElementById('contact-map-reset');
    var toggleLargerBtn = document.getElementById('contact-map-zoom-toggle');
    var closeExpandBtn = document.getElementById('contact-map-close-expand');

    // DOM overlay container inside #contact-map-stage for interactive mapcn circular markers & tooltips
    var markerOverlay = document.getElementById('contact-mapcn-markers');
    if (!markerOverlay) {
      markerOverlay = document.createElement('div');
      markerOverlay.id = 'contact-mapcn-markers';
      markerOverlay.className = 'pointer-events-none absolute inset-0 z-[12] overflow-hidden';
      stage.appendChild(markerOverlay);
    }

    var state = {
      zoom: 1,
      panX: 0,
      panY: 0,
      isDragging: false,
      dragStartX: 0,
      dragStartY: 0,
      startPanX: 0,
      startPanY: 0,
      expanded: false,
      liveMap: null
    };

    // Dark-Matter palette matching basemaps.cartocdn.com/gl/dark-matter-gl-style
    var DISTRICTS = [
      { x: 48, y: -132, name: 'SAN MATEO', size: 10, weight: '600' },
      { x: -24, y: -64, name: 'MARIKINA', size: 12.5, weight: '700' },
      { x: -56, y: -10, name: 'Santolan · Dela Paz', size: 9.5, weight: '500' },
      { x: 16, y: 42, name: 'PASIG', size: 12.5, weight: '700' },
      { x: -124, y: -56, name: 'Katipunan · QC', size: 10.5, weight: '600' },
      { x: -205, y: -96, name: 'QUEZON CITY', size: 11.5, weight: '600' },
      { x: -138, y: 4, name: 'Ortigas Center', size: 10.5, weight: '600' },
      { x: -210, y: 38, name: 'MANDALUYONG', size: 10.5, weight: '600' },
      { x: -265, y: -12, name: 'San Juan', size: 10, weight: '500' },
      { x: -340, y: 12, name: 'MANILA', size: 11.5, weight: '700' },
      { x: -265, y: 88, name: 'Makati CBD', size: 10.5, weight: '600' },
      { x: -132, y: 92, name: 'BGC · Taguig', size: 10.5, weight: '600' },
      { x: 158, y: 34, name: 'Cainta · Rizal', size: 10.5, weight: '500' },
      { x: 272, y: -22, name: 'ANTIPOLO', size: 11, weight: '600' },
      { x: 165, y: 132, name: 'Laguna de Bay', size: 10.5, weight: '500', water: true },
      { x: -435, y: 24, name: 'MANILA BAY', size: 11, weight: '600', water: true }
    ];

    var HIGHWAYS = [
      // Marcos Highway (R-6)
      { width: 5.5, color: '#2b303c', casing: '#15171e', pts: [[-280, -34], [-115, -30], [-12, -26], [85, -24], [195, -20], [340, -18]] },
      // Sumulong / Amang Rodriguez North-South
      { width: 5.0, color: '#272b36', casing: '#14161c', pts: [[34, -170], [18, -96], [6, -24], [14, 38], [32, 108], [62, 175]] },
      // C-5 Corridor
      { width: 5.2, color: '#272b36', casing: '#14161c', pts: [[-118, -175], [-104, -95], [-92, -16], [-86, 62], [-102, 145], [-122, 195]] },
      // Ortigas Ave / Pasig Blvd
      { width: 4.6, color: '#242832', casing: '#12141a', pts: [[-295, 22], [-175, 16], [-88, 12], [18, 28], [142, 42], [310, 58]] },
      // J.P. Rizal St.
      { width: 4.0, color: '#21252f', casing: '#12141a', pts: [[56, -165], [22, -108], [-16, -62], [-26, -8], [-22, 54], [8, 128]] },
      // Aurora Blvd / Marikina Connector
      { width: 4.0, color: '#21252f', casing: '#12141a', pts: [[-315, -52], [-165, -48], [-82, -52], [-16, -60], [65, -72], [225, -78]] },
      // EDSA
      { width: 5.2, color: '#252a35', casing: '#14161c', pts: [[-260, -165], [-212, -85], [-202, -5], [-218, 65], [-265, 150]] }
    ];

    var SHIELDS = [
      { x: -46, y: -28, label: 'Marcos Hwy' },
      { x: -90, y: -42, label: 'C-5' },
      { x: -62, y: 14, label: 'Ortigas' },
      { x: 10, y: 74, label: 'Amang Rd' },
      { x: -206, y: 12, label: 'EDSA' }
    ];

    var markerEntries = [];
    MARKER_LOCATIONS.forEach(function (loc) {
      var entry = createMapcnMarkerEl(loc, function () {
        if (!state.liveMap) {
          state.panX = 0;
          state.panY = 0;
        }
      });
      entry.wrap.style.position = 'absolute';
      entry.wrap.style.pointerEvents = 'auto';
      entry.loc = loc;
      markerOverlay.appendChild(entry.wrap);
      markerEntries.push(entry);
    });

    function clampPan() {
      var maxX = 280 * state.zoom;
      var maxY = 140 * state.zoom;
      state.panX = Math.max(-maxX, Math.min(maxX, state.panX));
      state.panY = Math.max(-maxY, Math.min(maxY, state.panY));
    }

    function renderFallbackCanvas() {
      if (state.liveMap) return;
      var rect = stage.getBoundingClientRect();
      var w = Math.max(320, Math.round(rect.width));
      var h = Math.max(180, Math.round(rect.height));
      var dpr = Math.min(window.devicePixelRatio || 1, 2);

      if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      // Carto Dark-Matter obsidian charcoal land (#090a0d)
      ctx.fillStyle = '#090a0d';
      ctx.fillRect(0, 0, w, h);

      var baseScale = Math.max(w / 960, h / 320);
      var scale = baseScale * state.zoom;
      var mobileYShift = w < 640 ? -Math.round(h * 0.08) : 0;
      var cx = w * 0.52 + state.panX;
      var cy = h * 0.50 + mobileYShift + state.panY;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(scale, scale);

      // Dark-Matter subtle urban block polygons
      ctx.fillStyle = '#101218';
      var blocks = [
        [-240, -135, 92, 54], [-135, -132, 86, 56], [-32, -135, 88, 58],
        [75, -132, 95, 60], [-142, -55, 84, 52], [-42, -72, 78, 56],
        [45, -72, 92, 56], [-135, 18, 76, 50], [-42, 8, 86, 56],
        [62, 6, 98, 58], [-115, 76, 88, 52], [45, 72, 82, 48]
      ];
      for (var b = 0; b < blocks.length; b++) {
        ctx.fillRect(blocks[b][0], blocks[b][1], blocks[b][2], blocks[b][3]);
      }

      // Subtle park patches
      ctx.fillStyle = '#11161d';
      ctx.beginPath(); ctx.ellipse(2, -58, 18, 12, -0.15, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(52, 44, 20, 14, 0.25, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(-118, -54, 24, 16, 0.1, 0, Math.PI * 2); ctx.fill();

      // Manila Bay (West dark water)
      ctx.fillStyle = '#030406';
      ctx.beginPath();
      ctx.moveTo(-680, -280);
      ctx.lineTo(-375, -280);
      ctx.lineTo(-358, -145);
      ctx.lineTo(-348, -35);
      ctx.lineTo(-352, 55);
      ctx.lineTo(-372, 155);
      ctx.lineTo(-415, 250);
      ctx.lineTo(-680, 250);
      ctx.closePath();
      ctx.fill();
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = '#191d26';
      ctx.stroke();

      // Laguna de Bay (Southeast dark water)
      ctx.fillStyle = '#030406';
      ctx.beginPath();
      ctx.moveTo(-25, 255);
      ctx.quadraticCurveTo(35, 138, 108, 92);
      ctx.quadraticCurveTo(215, 65, 440, 105);
      ctx.lineTo(680, 120);
      ctx.lineTo(680, 280);
      ctx.lineTo(-25, 280);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#191d26';
      ctx.stroke();

      // Marikina -> Pasig River confluence
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(46, -180);
      ctx.bezierCurveTo(28, -125, -4, -92, -14, -46);
      ctx.bezierCurveTo(-24, -8, -32, 16, -24, 52);
      ctx.bezierCurveTo(-14, 92, 12, 128, 44, 175);
      ctx.lineWidth = 10.5;
      ctx.strokeStyle = '#030406';
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(-368, 16);
      ctx.bezierCurveTo(-275, 28, -195, 46, -112, 42);
      ctx.bezierCurveTo(-68, 40, -45, 44, -24, 52);
      ctx.lineWidth = 10;
      ctx.strokeStyle = '#030406';
      ctx.stroke();

      // Fine Carto minor street mesh
      ctx.lineWidth = 0.75;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.042)';
      for (var gx = -320; gx <= 400; gx += 26) {
        ctx.beginPath();
        ctx.moveTo(gx, -195);
        ctx.lineTo(gx + 10, 195);
        ctx.stroke();
      }
      for (var gy = -180; gy <= 180; gy += 22) {
        ctx.beginPath();
        ctx.moveTo(-300, gy);
        ctx.lineTo(400, gy - 8);
        ctx.stroke();
      }

      // Highway casings & Dark-Matter road fills
      for (var r = 0; r < HIGHWAYS.length; r++) {
        var hw = HIGHWAYS[r];
        ctx.beginPath();
        ctx.moveTo(hw.pts[0][0], hw.pts[0][1]);
        for (var p = 1; p < hw.pts.length; p++) {
          ctx.lineTo(hw.pts[p][0], hw.pts[p][1]);
        }
        ctx.lineWidth = hw.width + 2.0;
        ctx.strokeStyle = hw.casing;
        ctx.stroke();

        ctx.lineWidth = hw.width;
        ctx.strokeStyle = hw.color;
        ctx.stroke();
      }

      ctx.restore();

      function toScreenX(wx) { return cx + wx * scale; }
      function toScreenY(wy) { return cy + wy * scale; }

      // Subtle Dark-Matter road shields
      for (var s = 0; s < SHIELDS.length; s++) {
        var sh = SHIELDS[s];
        var sx = toScreenX(sh.x);
        var sy = toScreenY(sh.y);
        if (sx < -40 || sx > w + 40 || sy < -20 || sy > h + 20) continue;
        ctx.font = '600 9px ui-sans-serif, system-ui, -apple-system, sans-serif';
        var tw = ctx.measureText(sh.label).width + 10;
        ctx.fillStyle = '#12141a';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(sx - tw / 2, sy - 7.5, tw, 15, 3);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#a1a1aa';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(sh.label, sx, sy + 0.5);
      }

      // District labels (CARTO Dark Matter subtle zinc tracking)
      for (var d = 0; d < DISTRICTS.length; d++) {
        var dst = DISTRICTS[d];
        var dx = toScreenX(dst.x);
        var dy = toScreenY(dst.y);
        if (dx < -80 || dx > w + 80 || dy < -20 || dy > h + 20) continue;

        ctx.font = dst.weight + ' ' + dst.size + 'px ui-sans-serif, system-ui, -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        if (dst.water) {
          ctx.fillStyle = 'rgba(113, 128, 150, 0.50)';
          ctx.fillText(dst.name, dx, dy);
        } else {
          ctx.lineWidth = 3;
          ctx.strokeStyle = 'rgba(9, 10, 13, 0.92)';
          ctx.strokeText(dst.name, dx, dy);
          ctx.fillStyle = '#9ca3af';
          ctx.fillText(dst.name, dx, dy);
        }
      }

      // Sync mapcn interactive circular blue markers & tooltips to world coordinates
      for (var m = 0; m < markerEntries.length; m++) {
        var entry = markerEntries[m];
        var mx = toScreenX(entry.loc.wx);
        var my = toScreenY(entry.loc.wy);
        entry.wrap.style.left = mx + 'px';
        entry.wrap.style.top = my + 'px';
        entry.wrap.style.transform = 'translate(-50%, -50%)';
      }

      ctx.restore();
    }

    // Pan & Zoom handlers for Canvas Mode
    stage.addEventListener('pointerdown', function (e) {
      if (state.liveMap || e.target.closest('a, button, [data-mapcn-marker]')) return;
      state.isDragging = true;
      state.dragStartX = e.clientX;
      state.dragStartY = e.clientY;
      state.startPanX = state.panX;
      state.startPanY = state.panY;
      stage.setPointerCapture(e.pointerId);
    });

    stage.addEventListener('pointermove', function (e) {
      if (state.liveMap || !state.isDragging) return;
      state.panX = state.startPanX + (e.clientX - state.dragStartX);
      state.panY = state.startPanY + (e.clientY - state.dragStartY);
      clampPan();
      renderFallbackCanvas();
    });

    function endDrag() {
      state.isDragging = false;
    }
    stage.addEventListener('pointerup', endDrag);
    stage.addEventListener('pointercancel', endDrag);

    if (zoomInBtn) {
      zoomInBtn.addEventListener('click', function () {
        if (state.liveMap) {
          state.liveMap.zoomIn({ duration: 250 });
          return;
        }
        state.zoom = Math.min(2.2, Number((state.zoom + 0.25).toFixed(2)));
        clampPan();
        renderFallbackCanvas();
      });
    }

    if (zoomOutBtn) {
      zoomOutBtn.addEventListener('click', function () {
        if (state.liveMap) {
          state.liveMap.zoomOut({ duration: 250 });
          return;
        }
        state.zoom = Math.max(0.85, Number((state.zoom - 0.25).toFixed(2)));
        clampPan();
        renderFallbackCanvas();
      });
    }

    function resetMap() {
      if (state.liveMap) {
        state.liveMap.flyTo({ center: CENTER_LNG_LAT, zoom: 12.6, bearing: 0, pitch: 0, duration: 450 });
        return;
      }
      state.zoom = 1;
      state.panX = 0;
      state.panY = 0;
      renderFallbackCanvas();
    }

    if (resetBtn) resetBtn.addEventListener('click', resetMap);

    function setExpanded(nextExpanded) {
      state.expanded = nextExpanded;
      if (wrap) wrap.classList.toggle('is-map-expanded', state.expanded);
      if (toggleLargerBtn) {
        toggleLargerBtn.textContent = state.expanded ? 'Compact map view' : 'View larger map';
      }
      if (state.liveMap) {
        setTimeout(function () {
          if (state.liveMap) state.liveMap.resize();
        }, 240);
        return;
      }
      if (state.expanded && state.zoom < 1.25) {
        state.zoom = 1.3;
      } else if (!state.expanded) {
        state.zoom = 1;
        state.panX = 0;
        state.panY = 0;
      }
      clampPan();
      requestAnimationFrame(renderFallbackCanvas);
      setTimeout(renderFallbackCanvas, 220);
    }

    if (toggleLargerBtn) {
      toggleLargerBtn.addEventListener('click', function () {
        setExpanded(!state.expanded);
      });
    }

    if (closeExpandBtn) {
      closeExpandBtn.addEventListener('click', function () {
        setExpanded(false);
      });
    }

    function handleMapResize() {
      if (!mapBooted) return;
      if (state.liveMap) {
        state.liveMap.resize();
        return;
      }
      renderFallbackCanvas();
    }
    window.addEventListener('resize', handleMapResize, { passive: true });
    if (typeof ResizeObserver === 'function') {
      new ResizeObserver(handleMapResize).observe(stage);
    }

    // Progressive Live MapLibre GL + CARTO Dark Matter Upgrade for real online browsers
    function upgradeToLiveMapLibre() {
      if (navigator.webdriver || !navigator.onLine) return;
      var cssLink = document.createElement('link');
      cssLink.rel = 'stylesheet';
      cssLink.href = 'https://unpkg.com/maplibre-gl@' + MAPLIBRE_VERSION + '/dist/maplibre-gl.css';
      cssLink.onload = function () {
        if (state.liveMap) {
          state.liveMap.resize();
        }
      };
      document.head.appendChild(cssLink);

      var jsScript = document.createElement('script');
      jsScript.src = 'https://unpkg.com/maplibre-gl@' + MAPLIBRE_VERSION + '/dist/maplibre-gl.js';
      jsScript.async = true;
      jsScript.onload = function () {
        if (!window.maplibregl) return;
        var glHost = document.createElement('div');
        glHost.id = 'contact-maplibre-host';
        glHost.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;max-width:none;padding:0;margin:0;z-index:2;';
        stage.insertBefore(glHost, stage.firstChild);

        var mlMap = new window.maplibregl.Map({
          container: glHost,
          style: CARTO_DARK_STYLE,
          center: CENTER_LNG_LAT,
          zoom: 12.6,
          renderWorldCopies: false,
          attributionControl: false
        });

        mlMap.on('load', function () {
          state.liveMap = mlMap;
          mlMap.resize();
          setTimeout(function () {
            if (state.liveMap) state.liveMap.resize();
          }, 220);
          setTimeout(function () {
            if (state.liveMap) state.liveMap.resize();
          }, 750);
          canvas.style.display = 'none';
          markerOverlay.style.display = 'none';
          MARKER_LOCATIONS.forEach(function (loc) {
            var entry = createMapcnMarkerEl(loc);
            new window.maplibregl.Marker({ element: entry.wrap })
              .setLngLat([loc.lng, loc.lat])
              .addTo(mlMap);
          });
        });

        mlMap.on('error', function () {
          if (!state.liveMap) {
            glHost.remove();
          }
        });
      };
      document.head.appendChild(jsScript);
    }
    // Lazy-boot fallback canvas & MapLibre GL (~800KB + WebGL map + tiles) only when nearing Contact/Footer
    var mapBooted = false;
    function bootMapAssets() {
      if (mapBooted) return;
      mapBooted = true;
      renderFallbackCanvas();
      upgradeToLiveMapLibre();
    }

    var bootTarget = document.getElementById('footer-map-band') || document.getElementById('contact') || stage;
    var r0 = bootTarget ? bootTarget.getBoundingClientRect() : null;
    if (r0 && r0.bottom > -900 && r0.top < (window.innerHeight || 900) + 900) {
      bootMapAssets();
    } else if ('IntersectionObserver' in window && bootTarget) {
      var bootIo = new IntersectionObserver(function (entries) {
        if (entries.some(function (en) { return en.isIntersecting; })) {
          bootIo.disconnect();
          bootMapAssets();
        }
      }, { rootMargin: '900px 0px', threshold: 0.01 });
      bootIo.observe(bootTarget);
    } else {
      bootMapAssets();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFooterDarkMatterMap);
  } else {
    initFooterDarkMatterMap();
  }
})();
