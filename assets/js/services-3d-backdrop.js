/**
 * MEDIQ Services Library — 3D Architectural Medical Bookshelf Environment
 * Scoped strictly inside #srv-book-carousel-slide (Services 3D Bookshelf Slide 7),
 * keeping Services Slide 0 Landing Page on its original smoky-blue grid backdrop.
 */
(function initServices3dBookshelfBackdrop() {
  'use strict';

  function boot() {
    const section = document.getElementById('distribution');
    const bookSlide = document.getElementById('srv-book-carousel-slide');
    const canvas = document.getElementById('distribution-3d-atrium-canvas');
    if (!section || !bookSlide || !canvas || canvas.dataset.atriumInit === '1') return;
    if (typeof window.THREE === 'undefined') return;
    canvas.dataset.atriumInit = '1';

    const THREE = window.THREE;
    const reducedMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch (_) {
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setClearColor(0x040d20, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.96;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x040d20, 0.056);

    const camera = new THREE.PerspectiveCamera(44, 16 / 9, 0.1, 80);
    camera.position.set(0, 0.72, 11.4);
    camera.lookAt(0, 0.25, -10);

    // Architectural Shelf Lighting (Velvety dark navy & restrained cyan cove highlights)
    const ambientLight = new THREE.AmbientLight(0x1f4985, 0.85);
    scene.add(ambientLight);

    const overheadSpot = new THREE.DirectionalLight(0x72c5f8, 0.72);
    overheadSpot.position.set(0, 11, 7);
    scene.add(overheadSpot);

    const shelfKeyLight = new THREE.PointLight(0x3aa0db, 1.35, 28, 1.6);
    shelfKeyLight.position.set(0, 1.4, -3.8);
    scene.add(shelfKeyLight);

    const warmSlateRim = new THREE.PointLight(0x1c4d8f, 1.45, 34, 1.5);
    warmSlateRim.position.set(-4.5, 2.8, -9.5);
    scene.add(warmSlateRim);

    const libraryGroup = new THREE.Group();
    scene.add(libraryGroup);

    // 1. Dark Gallery Floor + Subtle Perspective Grid
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x040d1f,
      roughness: 0.78,
      metalness: 0.22,
    });
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(54, 48), floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, -2.55, -10);
    libraryGroup.add(floor);

    const gridHelper = new THREE.GridHelper(46, 26, 0x265894, 0x0c2147);
    gridHelper.position.set(0, -2.53, -10);
    (Array.isArray(gridHelper.material) ? gridHelper.material : [gridHelper.material]).forEach((m) => {
      if (m) {
        m.transparent = true;
        m.opacity = 0.2;
      }
    });
    libraryGroup.add(gridHelper);

    // 2. Foreground Hero Display Shelf Ledge beneath the interactive 3D Books (01–06)
    const shelfWoodMat = new THREE.MeshStandardMaterial({
      color: 0x081a3c,
      roughness: 0.44,
      metalness: 0.48,
    });
    const shelfLipMat = new THREE.MeshBasicMaterial({
      color: 0x72c5f8,
      transparent: true,
      opacity: 0.32,
    });
    const foregroundShelf = new THREE.Mesh(new THREE.BoxGeometry(22, 0.22, 2.6), shelfWoodMat);
    foregroundShelf.position.set(0, -2.36, -1.6);
    libraryGroup.add(foregroundShelf);

    const foregroundLedStrip = new THREE.Mesh(new THREE.BoxGeometry(21.8, 0.024, 0.04), shelfLipMat);
    foregroundLedStrip.position.set(0, -2.26, -0.31);
    libraryGroup.add(foregroundLedStrip);

    // Soft Floor Wash / Stage Reflection Texture
    const haloCanvas = document.createElement('canvas');
    haloCanvas.width = 256;
    haloCanvas.height = 256;
    const hctx = haloCanvas.getContext('2d');
    if (hctx) {
      const grad = hctx.createRadialGradient(128, 128, 8, 128, 128, 126);
      grad.addColorStop(0, 'rgba(114, 197, 248, 0.26)');
      grad.addColorStop(0.5, 'rgba(58, 160, 219, 0.08)');
      grad.addColorStop(1, 'rgba(4, 13, 32, 0)');
      hctx.fillStyle = grad;
      hctx.fillRect(0, 0, 256, 256);
    }
    const haloTex = new THREE.CanvasTexture(haloCanvas);
    const haloMat = new THREE.MeshBasicMaterial({
      map: haloTex,
      transparent: true,
      opacity: 0.68,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const haloMesh = new THREE.Mesh(new THREE.PlaneGeometry(11, 4.2), haloMat);
    haloMesh.rotation.x = -Math.PI / 2;
    haloMesh.position.set(0, -2.23, -1.55);
    libraryGroup.add(haloMesh);

    // 3. Recessed Architectural Bookcase Bays & Decorative Shelf Books (Background Depth Wall)
    const shelvingGroup = new THREE.Group();
    libraryGroup.add(shelvingGroup);

    const caseFrameMat = new THREE.MeshStandardMaterial({
      color: 0x061530,
      roughness: 0.56,
      metalness: 0.38,
    });
    const backWallMat = new THREE.MeshStandardMaterial({
      color: 0x030c1c,
      roughness: 0.85,
      metalness: 0.12,
    });
    const shelfLedCoveMat = new THREE.MeshBasicMaterial({
      color: 0x56b2e8,
      transparent: true,
      opacity: 0.16,
    });

    // Subtle matte-navy / muted slate-blue / deep cerulean book palette
    const bgBookMats = [
      new THREE.MeshStandardMaterial({ color: 0x0b224a, roughness: 0.52, metalness: 0.25 }),
      new THREE.MeshStandardMaterial({ color: 0x102d5c, roughness: 0.48, metalness: 0.28 }),
      new THREE.MeshStandardMaterial({ color: 0x081a38, roughness: 0.58, metalness: 0.2 }),
      new THREE.MeshStandardMaterial({ color: 0x13386b, roughness: 0.46, metalness: 0.3 }),
      new THREE.MeshStandardMaterial({ color: 0x0c3454, roughness: 0.5, metalness: 0.25 }),
    ];
    const spineBandMat = new THREE.MeshBasicMaterial({
      color: 0x72c5f8,
      transparent: true,
      opacity: 0.16,
    });

    // Build 3 slightly curved alcove bookcase sections (Left Wing, Center Wall, Right Wing)
    const bookcaseConfigs = [
      { cx: -7.8, cz: -7.4, rotY: 0.24, cols: 2, bayW: 3.1 },
      { cx: 0, cz: -9.2, rotY: 0, cols: 4, bayW: 3.2 },
      { cx: 7.8, cz: -7.4, rotY: -0.24, cols: 2, bayW: 3.1 },
    ];
    const shelfLevels = [-2.2, -0.55, 1.1, 2.75, 4.4];
    const unitBookGeo = new THREE.BoxGeometry(1, 1, 1);
    const unitSpineGeo = new THREE.BoxGeometry(0.75, 0.03, 0.02);

    // Deterministic seeded PRNG so shelves always compose cleanly
    let seed = 4219;
    function rand() {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    }

    bookcaseConfigs.forEach((cfg) => {
      const unitGroup = new THREE.Group();
      unitGroup.position.set(cfg.cx, 0, cfg.cz);
      unitGroup.rotation.y = cfg.rotY;
      shelvingGroup.add(unitGroup);

      const totalW = cfg.cols * cfg.bayW;
      const totalH = shelfLevels[shelfLevels.length - 1] - shelfLevels[0] + 0.35;
      const midY = (shelfLevels[shelfLevels.length - 1] + shelfLevels[0]) / 2;

      // Dark backing panel
      const backPanel = new THREE.Mesh(new THREE.BoxGeometry(totalW + 0.3, totalH, 0.14), backWallMat);
      backPanel.position.set(0, midY, -0.45);
      unitGroup.add(backPanel);

      // Vertical Bookcase Stile Dividers
      for (let c = 0; c <= cfg.cols; c++) {
        const vx = -totalW / 2 + c * cfg.bayW;
        const stile = new THREE.Mesh(new THREE.BoxGeometry(0.14, totalH, 0.96), caseFrameMat);
        stile.position.set(vx, midY, 0);
        unitGroup.add(stile);
      }

      // Horizontal Shelf Planks + Subtle Undercabinet LED Cove Strip
      shelfLevels.forEach((sy, sIdx) => {
        const plank = new THREE.Mesh(new THREE.BoxGeometry(totalW + 0.18, 0.11, 0.98), caseFrameMat);
        plank.position.set(0, sy, 0.02);
        unitGroup.add(plank);

        if (sIdx < shelfLevels.length - 1) {
          const cove = new THREE.Mesh(
            new THREE.BoxGeometry(totalW - 0.1, 0.018, 0.024),
            shelfLedCoveMat
          );
          cove.position.set(0, sy - 0.06, 0.44);
          unitGroup.add(cove);
        }

        // Populate shelves (rows 0..3) with recessed background volumes
        if (sIdx < shelfLevels.length - 1) {
          for (let c = 0; c < cfg.cols; c++) {
            const bayLeft = -totalW / 2 + c * cfg.bayW + 0.16;
            const bayRight = bayLeft + cfg.bayW - 0.32;
            let cursorX = bayLeft + 0.08 + rand() * 0.25;

            // Leave subtle breathing voids on some bays so the bookcase looks curated, not cluttered
            const skipEnd = rand() < 0.28 ? 0.45 + rand() * 0.6 : 0.12;
            let leanApplied = false;

            while (cursorX < bayRight - skipEnd) {
              const bw = 0.15 + rand() * 0.14;
              const bh = 0.96 + rand() * 0.36;
              const bd = 0.56 + rand() * 0.18;
              const mat = bgBookMats[Math.floor(rand() * bgBookMats.length)];

              const book = new THREE.Mesh(unitBookGeo, mat);
              book.scale.set(bw, bh, bd);

              // Occasional gentle tilt on the final book of a stack
              const shouldLean = !leanApplied && cursorX > bayRight - skipEnd - 0.45 && rand() < 0.45;
              if (shouldLean) {
                leanApplied = true;
                book.rotation.z = -0.14;
                book.position.set(cursorX + bw * 0.65, sy + 0.055 + bh * 0.48, 0.05);
                cursorX += bw + 0.14;
              } else {
                book.position.set(cursorX + bw * 0.5, sy + 0.055 + bh * 0.5, (rand() - 0.5) * 0.08 + 0.05);
                cursorX += bw + 0.025 + (rand() < 0.12 ? 0.08 : 0);
              }
              unitGroup.add(book);

              if (rand() < 0.55 && !shouldLean) {
                const band = new THREE.Mesh(unitSpineGeo, spineBandMat);
                band.scale.set(bw * 1.1, 1, 1);
                band.position.set(
                  book.position.x,
                  book.position.y + bh * (0.28 - rand() * 0.15),
                  book.position.z + bd * 0.5 + 0.01
                );
                unitGroup.add(band);
              }
            }
          }
        }
      });
    });

    // 4. Sparse Soft Gallery Dust Motes floating across shelves
    const DUST_COUNT = 90;
    const dustPos = new Float32Array(DUST_COUNT * 3);
    const dustSeed = new Float32Array(DUST_COUNT);
    for (let i = 0; i < DUST_COUNT; i++) {
      dustPos[i * 3] = (Math.random() - 0.5) * 18;
      dustPos[i * 3 + 1] = (Math.random() - 0.35) * 6.4;
      dustPos[i * 3 + 2] = -2 - Math.random() * 10;
      dustSeed[i] = Math.random() * Math.PI * 2;
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0x8fd2fa,
      size: 0.05,
      transparent: true,
      opacity: 0.22,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    libraryGroup.add(new THREE.Points(dustGeo, dustMat));

    // Runtime & Coupling State
    let width = 1280;
    let height = 720;
    let pointerX = 0;
    let pointerY = 0;
    let smoothPointerX = 0;
    let smoothPointerY = 0;
    let bookProgress = 0;
    let smoothBook = 0;
    let spreadDim = 0;
    let smoothDim = 0;
    let inViewport = true;
    let slideActive = bookSlide.classList.contains('opacity-100');
    let rafId = null;

    function isRunning() {
      return inViewport && slideActive;
    }

    function ensureRaf() {
      if (isRunning() && !rafId) {
        resize();
        rafId = requestAnimationFrame(renderFrame);
      }
    }

    function resize() {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(240, Math.round(rect.width || bookSlide.clientWidth || window.innerWidth));
      height = Math.max(240, Math.round(rect.height || bookSlide.clientHeight || window.innerHeight));
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    }

    resize();
    window.addEventListener('resize', resize, { passive: true });

    bookSlide.addEventListener(
      'pointermove',
      (e) => {
        const rect = bookSlide.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        pointerX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        pointerY = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      },
      { passive: true }
    );

    if (typeof MutationObserver !== 'undefined') {
      const mo = new MutationObserver(() => {
        slideActive = bookSlide.classList.contains('opacity-100');
        ensureRaf();
      });
      mo.observe(bookSlide, { attributes: true, attributeFilter: ['class'] });
    }

    window.__updateServices3dBackdrop = function (currentBookIdx, openSpreadAlpha) {
      if (typeof currentBookIdx === 'number' && !Number.isNaN(currentBookIdx)) {
        bookProgress = currentBookIdx;
      }
      if (typeof openSpreadAlpha === 'number' && !Number.isNaN(openSpreadAlpha)) {
        spreadDim = Math.max(0, Math.min(1, openSpreadAlpha));
      }
      slideActive = bookSlide.classList.contains('opacity-100');
      ensureRaf();
    };

    function renderFrame(now) {
      if (!isRunning()) {
        rafId = null;
        return;
      }

      const t = (now || performance.now()) * 0.001;
      const motionScale = reducedMotion ? 0 : 1 - smoothDim * 0.72;

      smoothPointerX += (pointerX - smoothPointerX) * 0.05;
      smoothPointerY += (pointerY - smoothPointerY) * 0.05;
      smoothBook += (bookProgress - smoothBook) * 0.065;
      smoothDim += (spreadDim - smoothDim) * 0.08;

      const bookOffset = (smoothBook - 2.5) * 0.38;
      const camX = smoothPointerX * 0.52 * motionScale - bookOffset;
      const camY = 0.72 - smoothPointerY * 0.24 * motionScale + smoothDim * 0.22;
      camera.position.set(camX, camY, 11.4 + smoothDim * 0.85);
      camera.lookAt(-bookOffset * 0.35 + smoothPointerX * 0.2, 0.25, -10);

      haloMesh.position.x = -bookOffset * 0.45;
      shelfKeyLight.position.x = -bookOffset * 0.45;

      const lumFactor = 1 - smoothDim * 0.56;
      ambientLight.intensity = 0.85 * lumFactor;
      overheadSpot.intensity = 0.72 * lumFactor;
      shelfKeyLight.intensity = 1.35 * lumFactor;
      warmSlateRim.intensity = 1.45 * lumFactor;
      haloMat.opacity = 0.68 * lumFactor;
      shelfLipMat.opacity = 0.32 * lumFactor;
      shelfLedCoveMat.opacity = 0.16 * lumFactor;
      spineBandMat.opacity = 0.16 * lumFactor;
      dustMat.opacity = 0.22 * lumFactor;

      if (!reducedMotion) {
        const posAttr = dustGeo.getAttribute('position');
        for (let i = 0; i < DUST_COUNT; i++) {
          let y = posAttr.getY(i) + 0.002 * motionScale;
          const x = posAttr.getX(i) + Math.sin(t * 0.38 + dustSeed[i]) * 0.0016 * motionScale;
          if (y > 4.4) y = -2.1;
          posAttr.setXY(i, x, y);
        }
        posAttr.needsUpdate = true;
      }

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(renderFrame);
    }

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            inViewport = entry.isIntersecting;
            ensureRaf();
          });
        },
        { threshold: 0.04 }
      );
      io.observe(section);
    }

    ensureRaf();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
