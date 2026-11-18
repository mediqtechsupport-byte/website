/**
 * MEDIQ — SLIDE 3 VR WEBGL BACKGROUND STORYBOARD
 * ============================================================================
 * Immersive "Inside VR" 3D Indoor Executive Doctor's Office inside #about-sec-foundation:
 *   - Enclosed architectural medical office interior (dark plank floor, woven area rug,
 *     slate-navy acoustic slat wall, frosted Venetian-blind side window overlooking night
 *     lights, recessed ceiling LED troffers, bookshelves, indoor plant, wall certificate)
 *   - Balanced Cinema VR cursor head-look parallax camera
 *   - Realistic Articulated Male Doctor seated thoughtfully at an open architectural desk:
 *       1) Deep pensive "Thinker" contemplation (chin poised gently in right hand, left hand
 *          resting serenely on desk folio)
 *       2) Rising crystalline 3D Thought Orbs & synaptic light trail ascending from his brow
 *       3) Head tilts gently upward in quiet inspiration as his thought stream materializes
 *          MEDIQ across the illuminated projection board via __fndOnStarImpact()
 */
(function initFoundationVrScene() {
  'use strict';

  const SEC_ID = 'about-sec-foundation';
  const CANVAS_ID = 'fnd-vr-bg-canvas';
  const LOOP_DURATION = 9.5;

  // Static gradient mode requested: disable 3D VR scene on #about-sec-foundation
  window.__fndOnStarImpact = window.__fndOnStarImpact || function () {};
  return;

  function clamp(v, lo, hi) {
    return Math.max(lo, Math.min(hi, v));
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function smoothstep(t) {
    const x = clamp(t, 0, 1);
    return x * x * (3 - 2 * x);
  }

  function smootherstep(t) {
    const x = clamp(t, 0, 1);
    return x * x * x * (x * (x * 6 - 15) + 10);
  }

  function makeHumanSkinTexture() {
    const c = document.createElement('canvas');
    c.width = 256;
    c.height = 128;
    const ctx = c.getContext('2d');
    const bg = ctx.createLinearGradient(0, 0, 0, 128);
    bg.addColorStop(0, '#edc0a3');
    bg.addColorStop(0.55, '#e8b391');
    bg.addColorStop(1, '#dc9f7e');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 256, 128);
    // Subtle cheek blush and facial tone variation across equator (UV u ~ 0.16 & 0.34 or 0.72)
    const addWarmth = (cx, cy, r, col) => {
      const g = ctx.createRadialGradient(cx, cy, 1, cx, cy, r);
      g.addColorStop(0, col);
      g.addColorStop(1, 'rgba(232,179,145,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 256, 128);
    };
    addWarmth(128, 70, 32, 'rgba(218, 126, 108, 0.22)');
    addWarmth(166, 70, 32, 'rgba(218, 126, 108, 0.22)');
    addWarmth(147, 56, 26, 'rgba(255, 224, 200, 0.20)');
    addWarmth(147, 88, 22, 'rgba(182, 118, 96, 0.14)');
    const tex = new THREE.CanvasTexture(c);
    tex.needsUpdate = true;
    return tex;
  }

  function makeHairTexture() {
    const c = document.createElement('canvas');
    c.width = 128;
    c.height = 128;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#181c28';
    ctx.fillRect(0, 0, 128, 128);
    for (let i = 0; i < 160; i++) {
      ctx.strokeStyle = i % 3 === 0 ? 'rgba(58,72,102,0.34)' : 'rgba(10,14,22,0.45)';
      ctx.lineWidth = 1.2;
      const x = (i * 19) % 128;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.quadraticCurveTo(x + Math.sin(i) * 6, 64, (x + 8) % 128, 128);
      ctx.stroke();
    }
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.needsUpdate = true;
    return tex;
  }

  function makeGlowTexture(innerRgba, midRgba) {
    const c = document.createElement('canvas');
    c.width = 128;
    c.height = 128;
    const ctx = c.getContext('2d');
    const g = ctx.createRadialGradient(64, 64, 2, 64, 64, 62);
    g.addColorStop(0, innerRgba);
    g.addColorStop(0.32, midRgba);
    g.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
    const tex = new THREE.CanvasTexture(c);
    tex.needsUpdate = true;
    return tex;
  }

  function makeWoodFloorTexture() {
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 512;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#070a11';
    ctx.fillRect(0, 0, 512, 512);

    const rows = 8;
    const plankH = 512 / rows;
    for (let r = 0; r < rows; r++) {
      const y = r * plankH;
      const offset = (r % 2) * 128;
      for (let x = -128; x < 512; x += 256) {
        const px = x + offset;
        const shade = ((r * 7 + x) % 5) * 2;
        ctx.fillStyle = `rgb(${10 + shade}, ${13 + shade}, ${20 + shade})`;
        ctx.fillRect(px + 1, y + 1, 254, plankH - 2);
        // Subtle dark grain lines
        ctx.fillStyle = 'rgba(20, 28, 46, 0.28)';
        ctx.fillRect(px + 8, y + plankH * 0.3, 220, 1.5);
        ctx.fillRect(px + 20, y + plankH * 0.68, 195, 1.2);
      }
      ctx.fillStyle = 'rgba(2, 4, 9, 0.80)';
      ctx.fillRect(0, y, 512, 2);
    }
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(9, 7);
    tex.needsUpdate = true;
    return tex;
  }

  function makePaperTexture() {
    const c = document.createElement('canvas');
    c.width = 128;
    c.height = 160;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, 128, 160);
    ctx.fillStyle = 'rgba(30, 58, 138, 0.28)';
    for (let y = 22; y < 142; y += 13) {
      const w = 52 + ((y * 37) % 44);
      ctx.fillRect(16, y, w, 3);
    }
    ctx.fillStyle = 'rgba(239, 68, 68, 0.55)';
    ctx.fillRect(16, 10, 50, 4);
    const tex = new THREE.CanvasTexture(c);
    tex.needsUpdate = true;
    return tex;
  }

  function makeMonitorTexture() {
    const c = document.createElement('canvas');
    c.width = 256;
    c.height = 160;
    const ctx = c.getContext('2d');
    // Dark clinical EMR background
    ctx.fillStyle = '#071b38';
    ctx.fillRect(0, 0, 256, 160);
    // Top bar
    ctx.fillStyle = '#0f3366';
    ctx.fillRect(0, 0, 256, 22);
    ctx.fillStyle = '#72c5f8';
    ctx.font = 'bold 9px "IBM Plex Sans", "Inter", ui-sans-serif, system-ui, sans-serif';
    ctx.fillText('MEDIQ EMR  |  CLINIC WORKQUEUE', 10, 14);
    ctx.fillStyle = '#f87171';
    ctx.beginPath();
    ctx.arc(236, 11, 4, 0, Math.PI * 2);
    ctx.fill();

    // Left sidebar metrics
    ctx.fillStyle = '#0d2850';
    ctx.fillRect(8, 28, 72, 122);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(14, 36, 56, 5);
    ctx.fillStyle = 'rgba(148, 197, 253, 0.45)';
    for (let i = 0; i < 6; i++) {
      ctx.fillRect(14, 52 + i * 16, 40 + ((i * 11) % 20), 6);
    }

    // Center chart + waveform
    ctx.fillStyle = '#0b2244';
    ctx.fillRect(88, 28, 160, 68);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(94, 68);
    const pts = [68, 68, 50, 82, 40, 74, 66, 66, 60, 72, 46, 78, 66, 66];
    for (let i = 0; i < pts.length; i++) {
      ctx.lineTo(94 + i * 11, pts[i]);
    }
    ctx.stroke();

    // Bottom eye scan ring graphic
    ctx.fillStyle = '#0b2244';
    ctx.fillRect(88, 102, 160, 48);
    ctx.strokeStyle = '#72c5f8';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.arc(122, 126, 16, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(122, 126, 8, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = 'rgba(248, 250, 252, 0.72)';
    ctx.fillRect(150, 112, 86, 5);
    ctx.fillStyle = 'rgba(114, 197, 248, 0.5)';
    ctx.fillRect(150, 124, 68, 4);
    ctx.fillRect(150, 134, 74, 4);

    const tex = new THREE.CanvasTexture(c);
    tex.needsUpdate = true;
    return tex;
  }

  function makeWallPlaqueTexture() {
    const c = document.createElement('canvas');
    c.width = 192;
    c.height = 144;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(0, 0, 192, 144);
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 4;
    ctx.strokeRect(8, 8, 176, 128);
    ctx.fillStyle = '#0f2954';
    ctx.font = 'bold 14px "IBM Plex Sans", "Inter", ui-sans-serif, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('OPHTHALMOLOGY', 96, 36);
    ctx.font = 'bold 20px "IBM Plex Sans", "Inter", ui-sans-serif, system-ui, sans-serif';
    ctx.fillText('E', 96, 62);
    ctx.font = 'bold 13px "IBM Plex Sans", "Inter", ui-sans-serif, system-ui, sans-serif';
    ctx.fillText('F P', 96, 80);
    ctx.font = 'bold 10px "IBM Plex Sans", "Inter", ui-sans-serif, system-ui, sans-serif';
    ctx.fillText('T O Z', 96, 95);
    ctx.fillStyle = '#c59d43';
    ctx.beginPath();
    ctx.arc(154, 108, 12, 0, Math.PI * 2);
    ctx.fill();
    const tex = new THREE.CanvasTexture(c);
    tex.needsUpdate = true;
    return tex;
  }

  function createOrganicLimb(parent, profilePts, mat, segs) {
    const v2 = profilePts.map(([r, y]) => new THREE.Vector2(Math.max(0.002, r), y));
    const geo = new THREE.LatheGeometry(v2, segs || 18);
    const m = new THREE.Mesh(geo, mat);
    parent.add(m);
    return m;
  }

  function buildSculptedHumanHeadGeo() {
    const geo = new THREE.SphereGeometry(0.104, 30, 24);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      let x = pos.getX(i);
      let y = pos.getY(i);
      let z = pos.getZ(i);

      // Elongate adult cranium vertically and slightly narrow front-to-back mask
      y *= 1.13;
      x *= 0.87;
      z *= 0.96;

      // Subtle temple pinch cleanly shaping upper forehead
      if (y > 0.015 && z > 0.0) {
        x *= 1 - 0.08 * smoothstep((y - 0.015) / 0.08);
      }
      // Subtle brow ridge projection
      if (z > 0.025 && y > 0.01 && y < 0.048 && Math.abs(x) < 0.068) {
        const browF = Math.sin(smoothstep((y - 0.01) / 0.038) * Math.PI) * (1 - Math.abs(x) / 0.072);
        z += 0.0075 * browF;
      }
      // Cheekbone fullness & slight eye socket hollow
      if (z > 0.02 && y > -0.02 && y < 0.025) {
        const cheek = smoothstep((Math.abs(x) - 0.022) / 0.045) * (1 - Math.abs(y) / 0.035);
        z += 0.009 * cheek;
      }
      // Organic tapered lower jaw & softly rounded chin (no boxy edges!)
      if (y < -0.015) {
        const jawU = smoothstep((-0.015 - y) / 0.105);
        x *= 1 - 0.40 * jawU;
        if (z > 0) {
          z += 0.018 * jawU * (1 - Math.min(1, Math.abs(x) / 0.055));
        } else {
          z *= 1 - 0.25 * jawU;
        }
        y -= 0.012 * jawU * (1 - Math.min(1, Math.abs(x) / 0.045));
      }

      pos.setXYZ(i, x, y, z);
    }
    geo.computeVertexNormals();
    return geo;
  }

  function createCrumpledPaperGeo(radius) {
    const geo = new THREE.IcosahedronGeometry(radius, 1);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);
      const bump =
        0.82 +
        0.34 * Math.abs(Math.sin(x * 19.3 + y * 13.7) * Math.cos(z * 17.1 + x * 9.2));
      pos.setXYZ(i, x * bump, y * bump, z * bump);
    }
    geo.computeVertexNormals();
    return geo;
  }

  // ---------------------------------------------------------------------------
  // INDOOR EXECUTIVE CLINIC OFFICE ENVIRONMENT
  // ---------------------------------------------------------------------------
  function buildEnvironment(scene) {
    const env = new THREE.Group();
    const FLOOR_Y = -1.42;
    const CEIL_Y = 4.15;
    const BACK_Z = -6.15;
    const WALL_H = CEIL_Y - FLOOR_Y;

    // 1. Minimalist dark charcoal-slate floor pad directly beneath the doctor's workstation (open background shows CSS gradient)
    const rug = new THREE.Mesh(
      new THREE.BoxGeometry(3.7, 0.012, 2.75),
      new THREE.MeshStandardMaterial({ color: 0x0b101b, roughness: 0.92, metalness: 0.04 })
    );
    rug.position.set(0.65, FLOOR_Y + 0.006, -2.05);
    env.add(rug);

    const rugTrim = new THREE.Mesh(
      new THREE.BoxGeometry(3.48, 0.014, 2.52),
      new THREE.MeshStandardMaterial({ color: 0x11192b, roughness: 0.9, metalness: 0.05 })
    );
    rugTrim.position.set(0.65, FLOOR_Y + 0.0065, -2.05);
    env.add(rugTrim);

    const trimDarkMat = new THREE.MeshStandardMaterial({
      color: 0x0c1322,
      emissive: 0x040710,
      emissiveIntensity: 0.35,
      roughness: 0.45,
      metalness: 0.22,
    });

    // Wall/floor/ceiling room enclosure removed so the plain obsidian-cobalt radial gradient background renders cleanly edge-to-edge behind the workstation & projector.

    // 6. Wall-Mounted Clinic Short-Throw Black Projector Screen (upper-right wall — MEDIQ Particles project onto this!)
    const projGroup = new THREE.Group();
    projGroup.position.set(2.96, 0.72, -4.45);
    projGroup.rotation.y = -0.28;
    env.add(projGroup);

    const projFrameMat = new THREE.MeshStandardMaterial({
      color: 0x111827,
      roughness: 0.36,
      metalness: 0.56,
    });
    const projBezel = new THREE.Mesh(new THREE.BoxGeometry(2.54, 1.80, 0.08), projFrameMat);
    projGroup.add(projBezel);

    // Sleek motorized top housing hood with subtle horizontal louver slats
    const projHood = new THREE.Mesh(new THREE.BoxGeometry(2.66, 0.14, 0.14), projFrameMat);
    projHood.position.set(0, 0.95, 0.03);
    projGroup.add(projHood);
    for (let s = 0; s < 3; s++) {
      const hoodSlat = new THREE.Mesh(new THREE.BoxGeometry(2.54, 0.015, 0.02), trimDarkMat);
      hoodSlat.position.set(0, 0.99 - s * 0.036, 0.102);
      projGroup.add(hoodSlat);
    }

    // Inner projection screen canvas: deep obsidian matte BLACK surface
    const projScreenMat = new THREE.MeshStandardMaterial({
      color: 0x010205,
      emissive: 0x02040a,
      emissiveIntensity: 0.08,
      roughness: 0.78,
      metalness: 0.02,
    });
    const projScreen = new THREE.Mesh(new THREE.PlaneGeometry(2.36, 1.64), projScreenMat);
    projScreen.position.z = 0.044;
    projGroup.add(projScreen);

    // Crisp calibration corner ticks inside the black projector canvas
    const tickMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.42 });
    [
      [-1.08, 0.72, 1, -1],
      [1.08, 0.72, -1, -1],
      [-1.08, -0.72, 1, 1],
      [1.08, -0.72, -1, 1],
    ].forEach(([tx, ty, dx, dy]) => {
      const hBar = new THREE.Mesh(new THREE.PlaneGeometry(0.10, 0.013), tickMat);
      hBar.position.set(tx + dx * 0.042, ty, 0.048);
      const vBar = new THREE.Mesh(new THREE.PlaneGeometry(0.013, 0.10), tickMat);
      vBar.position.set(tx, ty + dy * 0.042, 0.048);
      projGroup.add(hBar, vBar);
    });

    // Overhead short-throw projector boom arm + lens pod with soft radial optical halo
    const boomArm = new THREE.Mesh(new THREE.BoxGeometry(0.052, 0.048, 0.66), projFrameMat);
    boomArm.position.set(0, 0.99, 0.35);
    projGroup.add(boomArm);

    const projPod = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.10, 0.20), projFrameMat);
    projPod.position.set(0, 0.96, 0.66);
    projGroup.add(projPod);

    const projLens = new THREE.Mesh(
      new THREE.CylinderGeometry(0.032, 0.032, 0.036, 14),
      new THREE.MeshBasicMaterial({ color: 0xbae6fd })
    );
    projLens.rotation.x = Math.PI * 0.35;
    projLens.position.set(0, 0.92, 0.60);
    projGroup.add(projLens);

    const projBeamMat = new THREE.SpriteMaterial({
      map: makeGlowTexture('rgba(224,242,254,0.34)', 'rgba(56,189,248,0.06)'),
      color: 0xe0f2fe,
      transparent: true,
      opacity: 0.03,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const projLensGlow = new THREE.Sprite(projBeamMat);
    projLensGlow.scale.set(0.55, 0.55, 1);
    projLensGlow.position.set(0, 0.84, 0.52);
    projGroup.add(projLensGlow);

    // Wall cantilever mounting arms anchoring the projector board physically into the office back wall
    [-0.74, 0.74].forEach((mx) => {
      const mountArm = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.075, 1.75), projFrameMat);
      mountArm.position.set(mx, 0, -0.90);
      projGroup.add(mountArm);
    });

    const projCenterAnchor = new THREE.Object3D();
    projCenterAnchor.position.set(0, 0, 0.054);
    const projTopAnchor = new THREE.Object3D();
    projTopAnchor.position.set(0, 0.74, 0.054);
    const projCornerTL = new THREE.Object3D();
    projCornerTL.position.set(-1.04, 0.68, 0.054);
    const projCornerTR = new THREE.Object3D();
    projCornerTR.position.set(1.04, 0.68, 0.054);
    const projCornerBR = new THREE.Object3D();
    projCornerBR.position.set(1.04, -0.68, 0.054);
    const projCornerBL = new THREE.Object3D();
    projCornerBL.position.set(-1.04, -0.68, 0.054);
    const projThoughtDockAnchor = new THREE.Object3D();
    projThoughtDockAnchor.position.set(-1.38, -0.78, 0.14);
    projGroup.add(projCenterAnchor, projTopAnchor, projCornerTL, projCornerTR, projCornerBR, projCornerBL, projThoughtDockAnchor);

    // 7. Low Executive Credenza / Medical Bookcase neatly below the wall projector screen (zero overlap!)
    const shelfGroup = new THREE.Group();
    shelfGroup.position.set(3.25, FLOOR_Y, BACK_Z + 0.36);
    env.add(shelfGroup);

    const shelfMat = new THREE.MeshStandardMaterial({ color: 0x112447, roughness: 0.55, metalness: 0.18 });
    [-0.95, 0.95].forEach((sx) => {
      const side = new THREE.Mesh(new THREE.BoxGeometry(0.05, 1.15, 0.44), shelfMat);
      side.position.set(sx, 0.575, 0);
      shelfGroup.add(side);
    });
    [0.06, 0.60, 1.14].forEach((sy) => {
      const plank = new THREE.Mesh(new THREE.BoxGeometry(1.94, 0.04, 0.44), shelfMat);
      plank.position.set(0, sy, 0);
      shelfGroup.add(plank);
    });
    const bookColors = [0x1e40af, 0x0f766e, 0x334155, 0x1d4ed8, 0x7c2d12, 0x475569];
    [0.08, 0.62].forEach((sy, rowIdx) => {
      for (let b = 0; b < 10; b++) {
        const bh = 0.28 + ((b + rowIdx) % 3) * 0.045;
        const book = new THREE.Mesh(
          new THREE.BoxGeometry(0.068, bh, 0.28),
          new THREE.MeshStandardMaterial({ color: bookColors[(b + rowIdx) % bookColors.length], roughness: 0.7 })
        );
        book.position.set(-0.75 + b * 0.13 + (rowIdx % 2) * 0.06, sy + bh * 0.5 + 0.02, 0.02);
        shelfGroup.add(book);
      }
    });

    const roomWarmFill = new THREE.PointLight(0xfde68a, 0.55, 5.5, 1.6);
    roomWarmFill.position.set(2.4, 0.25, BACK_Z + 1.2);
    env.add(roomWarmFill);

    // 7. Indoor Potted Ceramic Office Plant beside the bookshelf (left of desk back wall)
    const plant = new THREE.Group();
    plant.position.set(-0.55, FLOOR_Y, BACK_Z + 0.62);
    env.add(plant);
    const pot = new THREE.Mesh(
      new THREE.CylinderGeometry(0.21, 0.15, 0.36, 16),
      new THREE.MeshStandardMaterial({ color: 0x1e365c, roughness: 0.45 })
    );
    pot.position.y = 0.18;
    plant.add(pot);
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x0f4c3a, roughness: 0.62 });
    const leafDirs = [
      [0.08, 0.55, 0.06, 0.35, 0.4],
      [-0.1, 0.64, 0.04, -0.45, -0.3],
      [0.02, 0.72, -0.08, 0.2, 0.5],
      [0.14, 0.46, -0.05, 0.55, -0.2],
      [-0.14, 0.48, -0.06, -0.5, 0.25],
    ];
    leafDirs.forEach(([lx, ly, lz, rx, rz]) => {
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.018, ly - 0.15, 6), leafMat);
      stem.position.set(lx * 0.5, (ly + 0.2) * 0.5, lz * 0.5);
      plant.add(stem);
      const blade = new THREE.Mesh(new THREE.SphereGeometry(0.14, 10, 8), leafMat);
      blade.scale.set(0.65, 1.45, 0.18);
      blade.position.set(lx, ly, lz);
      blade.rotation.set(rx, lx * 2.5, rz);
      plant.add(blade);
    });

    // Subtle interior dust motes drifting softly under office lighting
    const dustCount = 85;
    const dustPos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dustPos[i * 3] = -1.2 + Math.random() * 5.2;
      dustPos[i * 3 + 1] = FLOOR_Y + 0.3 + Math.random() * 3.8;
      dustPos[i * 3 + 2] = BACK_Z + 0.5 + Math.random() * 4.5;
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0x72c5f8,
      size: 0.036,
      transparent: true,
      opacity: 0.28,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const dust = new THREE.Points(dustGeo, dustMat);
    env.add(dust);

    scene.add(env);
    return {
      env,
      dust,
      dustGeo,
      projGroup,
      projCenterAnchor,
      projTopAnchor,
      projCornerTL,
      projCornerTR,
      projCornerBR,
      projCornerBL,
      projThoughtDockAnchor,
      projScreenMat,
      projBeamMat,
    };
  }

  // ---------------------------------------------------------------------------
  // SCULPTED MENS OXFORD DRESS SHOE & ANKLE
  // ---------------------------------------------------------------------------
  function buildDressShoe(matShoe, matSole, matSock) {
    const foot = new THREE.Group();

    // Visible sock / ankle rising into trouser cuff
    const ankle = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.033, 0.05, 12), matSock);
    ankle.position.set(0, -0.008, 0);
    foot.add(ankle);

    // Outsole + distinct heel (bottom at local y = -0.049 so floor/rug contact is exact!)
    const heel = new THREE.Mesh(new THREE.BoxGeometry(0.072, 0.018, 0.075), matSole);
    heel.position.set(0, -0.040, -0.015);
    foot.add(heel);

    const frontSole = new THREE.Mesh(new THREE.BoxGeometry(0.078, 0.011, 0.165), matSole);
    frontSole.position.set(0, -0.0435, 0.088);
    foot.add(frontSole);

    // Leather heel counter + upper vamp
    const upperHeel = new THREE.Mesh(new THREE.BoxGeometry(0.070, 0.042, 0.095), matShoe);
    upperHeel.position.set(0, -0.016, 0.0);
    foot.add(upperHeel);

    const toeCap = new THREE.Mesh(new THREE.SphereGeometry(0.044, 14, 10), matShoe);
    toeCap.scale.set(0.88, 0.56, 2.05);
    toeCap.position.set(0, -0.022, 0.092);
    foot.add(toeCap);

    return foot;
  }

  // ---------------------------------------------------------------------------
  // OPEN EXECUTIVE DESK + ERGONOMIC CHAIR + REALISTIC 3D MALE DOCTOR
  // ---------------------------------------------------------------------------
  function buildDoctorWorkstation() {
    const station = new THREE.Group();
    station.position.set(0.58, -1.42, -2.02);
    station.rotation.y = 0.22; // 3/4 view toward front-right (legs & shoes clearly visible!)

    const matDeskTop = new THREE.MeshStandardMaterial({
      color: 0x16294f,
      roughness: 0.38,
      metalness: 0.22,
    });
    const matMetal = new THREE.MeshStandardMaterial({
      color: 0x47658e,
      roughness: 0.34,
      metalness: 0.72,
    });
    const matScreen = new THREE.MeshStandardMaterial({
      map: makeMonitorTexture(),
      emissive: 0x2563eb,
      emissiveMap: makeMonitorTexture(),
      emissiveIntensity: 0.88,
      roughness: 0.22,
    });
    const matAmber = new THREE.MeshStandardMaterial({
      color: 0xfde68a,
      emissive: 0xf59e0b,
      emissiveIntensity: 1.45,
      roughness: 0.25,
    });
    const matPaper = new THREE.MeshStandardMaterial({
      map: makePaperTexture(),
      color: 0xffffff,
      emissive: 0x93c5fd,
      emissiveIntensity: 0.14,
      roughness: 0.75,
    });

    // Open Architectural Executive Desk (zero front apron so seated legs & feet are clearly visible)
    const deskY = 0.76;
    const deskTop = new THREE.Mesh(new THREE.BoxGeometry(1.68, 0.044, 0.82), matDeskTop);
    deskTop.position.set(0, deskY, 0);
    station.add(deskTop);

    const deskTrim = new THREE.Mesh(
      new THREE.BoxGeometry(1.69, 0.01, 0.012),
      new THREE.MeshBasicMaterial({ color: 0x72c5f8, transparent: true, opacity: 0.38 })
    );
    deskTrim.position.set(0, deskY, 0.41);
    station.add(deskTrim);

    // Outer U-frame metal legs on far left/right (feet pads resting flush at y = 0)
    [-0.78, 0.78].forEach((lx) => {
      [-0.33, 0.33].forEach((lz) => {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.02, deskY - 0.02, 10), matMetal);
        leg.position.set(lx, (deskY - 0.02) * 0.5 + 0.01, lz);
        station.add(leg);
      });
      const footRail = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.022, 0.72), matMetal);
      footRail.position.set(lx, 0.011, 0);
      station.add(footRail);
    });

    // Clinical EMR Monitor on left bay of desk
    const monStand = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.026, 0.25, 10), matMetal);
    monStand.position.set(-0.56, deskY + 0.125, -0.22);
    station.add(monStand);

    const monFrame = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.35, 0.024), matDeskTop);
    monFrame.position.set(-0.56, deskY + 0.31, -0.20);
    monFrame.rotation.y = 0.26;
    station.add(monFrame);

    const monDisplay = new THREE.Mesh(new THREE.PlaneGeometry(0.51, 0.30), matScreen);
    monDisplay.position.set(0, 0, 0.014);
    monFrame.add(monDisplay);

    // Warm Architect Desk Lamp on right side (spotlights doctor & crumpled paperwork)
    const lampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.095, 0.024, 16), matMetal);
    lampBase.position.set(0.60, deskY + 0.034, -0.22);
    station.add(lampBase);

    const lampArm1 = new THREE.Mesh(new THREE.CylinderGeometry(0.013, 0.013, 0.42, 8), matMetal);
    lampArm1.position.set(0.64, deskY + 0.23, -0.24);
    lampArm1.rotation.z = -0.26;
    station.add(lampArm1);

    const lampArm2 = new THREE.Mesh(new THREE.CylinderGeometry(0.011, 0.013, 0.36, 8), matMetal);
    lampArm2.position.set(0.53, deskY + 0.46, -0.14);
    lampArm2.rotation.z = 0.62;
    lampArm2.rotation.x = 0.35;
    station.add(lampArm2);

    const lampShade = new THREE.Mesh(new THREE.ConeGeometry(0.105, 0.15, 16, 1, true), matDeskTop);
    lampShade.position.set(0.40, deskY + 0.52, -0.05);
    lampShade.rotation.z = 0.55;
    lampShade.rotation.x = 0.25;
    station.add(lampShade);

    const lampBulb = new THREE.Mesh(new THREE.SphereGeometry(0.042, 12, 10), matAmber);
    lampBulb.position.set(0.38, deskY + 0.49, -0.04);
    station.add(lampBulb);

    const deskWarmLight = new THREE.PointLight(0xfbbf24, 1.05, 3.2, 2.1);
    deskWarmLight.position.set(0.36, deskY + 0.36, 0.22);
    station.add(deskWarmLight);

    // Ceramic Coffee Mug & Desk Stacks
    const mug = new THREE.Mesh(
      new THREE.CylinderGeometry(0.042, 0.038, 0.092, 14),
      new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.35 })
    );
    mug.position.set(-0.27, deskY + 0.068, 0.16);
    station.add(mug);

    [
      [-0.10, 0.026, 0.06, 0.16],
      [-0.06, 0.032, 0.02, -0.20],
      [0.24, 0.026, 0.12, 0.40],
      [0.26, 0.032, 0.10, 0.06],
      [-0.24, 0.026, -0.04, -0.35],
    ].forEach(([px, py, pz, ry]) => {
      const sh = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.006, 0.26), matPaper);
      sh.position.set(px, deskY + py, pz);
      sh.rotation.y = ry;
      station.add(sh);
    });

    // Minimalist clear executive rug space beside desk right leg

    // Ergonomic 5-Star Office Swivel Chair with Casters on Rug (y = 0)
    const chairGroup = new THREE.Group();
    chairGroup.position.set(0.02, 0, -0.52);
    station.add(chairGroup);

    const chairPost = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.032, 0.39, 10), matMetal);
    chairPost.position.y = 0.245;
    chairGroup.add(chairPost);

    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.052, 0.045, 10), matMetal);
    hub.position.y = 0.068;
    chairGroup.add(hub);

    const matCaster = new THREE.MeshStandardMaterial({ color: 0x0a1326, roughness: 0.7 });
    for (let s = 0; s < 5; s++) {
      const ang = (s / 5) * Math.PI * 2 + 0.3;
      const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.026, 0.022, 0.26), matMetal);
      spoke.position.set(Math.sin(ang) * 0.13, 0.052, Math.cos(ang) * 0.13);
      spoke.rotation.y = ang;
      chairGroup.add(spoke);

      const caster = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.02, 10), matCaster);
      caster.rotation.z = Math.PI * 0.5;
      caster.position.set(Math.sin(ang) * 0.24, 0.024, Math.cos(ang) * 0.24);
      chairGroup.add(caster);
    }

    const seatMesh = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.06, 0.44), matDeskTop);
    seatMesh.position.y = 0.45;
    chairGroup.add(seatMesh);

    const backMesh = new THREE.Mesh(new THREE.BoxGeometry(0.40, 0.56, 0.048), matDeskTop);
    backMesh.position.set(0, 0.76, -0.22);
    backMesh.rotation.x = -0.09;
    chairGroup.add(backMesh);

    // -----------------------------------------------------------------------
    // REALISTIC ADULT MALE DOCTOR ANATOMY (Pelvis + Thighs + Knees + Shins + Shoes)
    // -----------------------------------------------------------------------
    const matCoat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      roughness: 0.48,
      emissive: 0x1e3a8a,
      emissiveIntensity: 0.1,
    });
    const matScrubs = new THREE.MeshStandardMaterial({
      color: 0x133b6e,
      roughness: 0.58,
    });
    const matTrousers = new THREE.MeshStandardMaterial({
      color: 0x0f274a,
      roughness: 0.65,
    });
    const matShoe = new THREE.MeshStandardMaterial({
      color: 0x1e1612,
      roughness: 0.34,
      metalness: 0.18,
    });
    const matSole = new THREE.MeshStandardMaterial({
      color: 0x090b10,
      roughness: 0.78,
    });
    const matSock = new THREE.MeshStandardMaterial({
      color: 0x172554,
      roughness: 0.85,
    });
    const skinTex = makeHumanSkinTexture();
    const matSkin = new THREE.MeshStandardMaterial({
      map: skinTex,
      color: 0xffffff,
      roughness: 0.54,
      metalness: 0.02,
    });
    const matHair = new THREE.MeshStandardMaterial({
      map: makeHairTexture(),
      color: 0xffffff,
      roughness: 0.68,
    });
    const matSteth = new THREE.MeshStandardMaterial({
      color: 0x3aa0db,
      emissive: 0x1e5c8c,
      emissiveIntensity: 0.24,
      metalness: 0.42,
      roughness: 0.34,
    });

    // Doctor pelvis root sits at y = 0.48 on seat (0.45); floor = 0
    const doctor = new THREE.Group();
    doctor.position.set(0.02, 0.48, -0.49);
    station.add(doctor);

    // Organic seated hip & pelvis contour
    const pelvis = new THREE.Mesh(new THREE.SphereGeometry(0.145, 22, 16), matTrousers);
    pelvis.scale.set(1.16, 0.52, 0.88);
    pelvis.position.set(0, 0.018, 0.015);
    doctor.add(pelvis);

    // Complete Seamless Organic Legs: Contoured Thigh -> Natural Knee -> Sculpted Calf -> Ankle -> Shoe
    const legSpecs = [
      { hipX: -0.095, splayY: -0.08, shinPitchX: -0.07 },
      { hipX: 0.095, splayY: 0.10, shinPitchX: 0.05 },
    ];
    legSpecs.forEach(({ hipX, splayY, shinPitchX }) => {
      const hip = new THREE.Group();
      hip.position.set(hipX, 0.0, 0.04);
      hip.rotation.y = splayY;
      doctor.add(hip);

      const thighGroup = new THREE.Group();
      thighGroup.rotation.x = 0.14;
      hip.add(thighGroup);

      // Anatomically contoured trouser thigh tapering gently into knee
      const thighMesh = createOrganicLimb(
        thighGroup,
        [
          [0.068, 0.0],
          [0.071, 0.09],
          [0.064, 0.22],
          [0.055, 0.34],
          [0.050, 0.405],
        ],
        matTrousers,
        18
      );
      thighMesh.rotation.x = Math.PI * 0.5;

      const knee = new THREE.Group();
      knee.position.set(0, 0, 0.40);
      knee.rotation.x = -0.14 + shinPitchX;
      thighGroup.add(knee);

      // Smooth rounded knee blend cap inside trouser drape
      const kneeCap = new THREE.Mesh(new THREE.SphereGeometry(0.051, 16, 12), matTrousers);
      kneeCap.scale.set(1.0, 1.05, 1.05);
      knee.add(kneeCap);

      // Sculpted calf + tapered lower trouser leg
      createOrganicLimb(
        knee,
        [
          [0.041, -0.365],
          [0.044, -0.30],
          [0.053, -0.18],
          [0.054, -0.08],
          [0.050, 0.0],
        ],
        matTrousers,
        18
      );

      // Natural tailored trouser break cuff
      const cuff = new THREE.Mesh(new THREE.TorusGeometry(0.043, 0.008, 8, 18), matTrousers);
      cuff.rotation.x = Math.PI * 0.5;
      cuff.position.set(0, -0.352, 0);
      knee.add(cuff);

      const ankle = new THREE.Group();
      ankle.position.set(0, -0.365, 0);
      ankle.rotation.x = -shinPitchX;
      knee.add(ankle);

      const shoe = buildDressShoe(matShoe, matSole, matSock);
      ankle.add(shoe);
    });

    // Organic Contoured Torso & Tailored Clinical Coat (continuous draped cloth silhouettes, zero cardboard boxes)
    const torso = new THREE.Group();
    torso.position.set(0, 0.055, -0.01);
    doctor.add(torso);

    const chestCore = createOrganicLimb(
      torso,
      [
        [0.128, -0.01],
        [0.132, 0.09],
        [0.150, 0.22],
        [0.168, 0.34],
        [0.162, 0.415],
        [0.068, 0.465],
      ],
      matScrubs,
      24
    );
    chestCore.scale.set(1.18, 1.0, 0.72);

    // Seamless draped coat shell wrapping torso naturally (open front revealing V-neck scrub shirt)
    const coatBackGeo = new THREE.LatheGeometry(
      [
        new THREE.Vector2(0.155, -0.06),
        new THREE.Vector2(0.144, 0.04),
        new THREE.Vector2(0.146, 0.16),
        new THREE.Vector2(0.164, 0.30),
        new THREE.Vector2(0.178, 0.40),
        new THREE.Vector2(0.148, 0.44),
      ],
      28,
      Math.PI * 0.58,
      Math.PI * 1.84
    );
    const coatBack = new THREE.Mesh(coatBackGeo, matCoat);
    coatBack.scale.set(1.18, 1.0, 0.75);
    torso.add(coatBack);

    // Rolled curved coat lapels (organic TubeGeometry following curved collarbones — zero rectangular planks!)
    [-1, 1].forEach((side) => {
      const lapelCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(side * 0.052, 0.445, -0.015),
        new THREE.Vector3(side * 0.072, 0.405, 0.092),
        new THREE.Vector3(side * 0.068, 0.305, 0.126),
        new THREE.Vector3(side * 0.056, 0.15, 0.118),
        new THREE.Vector3(side * 0.068, -0.04, 0.105),
      ]);
      const lapelGeo = new THREE.TubeGeometry(lapelCurve, 18, 0.024, 10, false);
      lapelGeo.scale(1.25, 1.0, 0.65);
      torso.add(new THREE.Mesh(lapelGeo, matCoat));
    });

    // Sculpted trapezius / rounded shoulder yoke uniting neck cleanly into sleeves
    const shoulderYoke = new THREE.Mesh(new THREE.SphereGeometry(0.175, 24, 14), matCoat);
    shoulderYoke.scale.set(1.26, 0.36, 0.64);
    shoulderYoke.position.set(0, 0.415, 0.0);
    torso.add(shoulderYoke);

    // Subtle pocket ID badge clipped softly onto left chest
    const badge = new THREE.Mesh(
      new THREE.BoxGeometry(0.044, 0.058, 0.008),
      new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.42 })
    );
    badge.position.set(0.108, 0.295, 0.124);
    badge.rotation.y = -0.22;
    torso.add(badge);
    const badgeBar = new THREE.Mesh(new THREE.BoxGeometry(0.038, 0.012, 0.010), matSteth);
    badgeBar.position.set(0.108, 0.314, 0.125);
    badgeBar.rotation.y = -0.22;
    torso.add(badgeBar);

    // Natural flexible doctor stethoscope curve draped around collar
    const stethCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.088, 0.25, 0.118),
      new THREE.Vector3(-0.082, 0.39, 0.075),
      new THREE.Vector3(-0.055, 0.46, -0.025),
      new THREE.Vector3(0, 0.458, -0.078),
      new THREE.Vector3(0.058, 0.456, -0.025),
      new THREE.Vector3(0.078, 0.38, 0.08),
      new THREE.Vector3(0.068, 0.27, 0.122),
    ]);
    torso.add(new THREE.Mesh(new THREE.TubeGeometry(stethCurve, 28, 0.009, 8, false), matSteth));

    const stethChestpiece = new THREE.Mesh(
      new THREE.CylinderGeometry(0.021, 0.021, 0.012, 16),
      new THREE.MeshStandardMaterial({ color: 0xcbd5e1, metalness: 0.85, roughness: 0.22 })
    );
    stethChestpiece.rotation.x = Math.PI * 0.5;
    stethChestpiece.position.set(-0.088, 0.242, 0.122);
    torso.add(stethChestpiece);

    // -----------------------------------------------------------------------
    // ANATOMICALLY PROPORTIONED HUMAN HEAD, EXPRESSIVE EYES & NATURAL HAIR
    // -----------------------------------------------------------------------
    const headPivot = new THREE.Group();
    headPivot.position.set(0, 0.455, 0.005);
    torso.add(headPivot);

    // Contoured human neck flaring subtly into sternocleidomastoid base
    createOrganicLimb(
      headPivot,
      [
        [0.064, -0.01],
        [0.050, 0.035],
        [0.044, 0.075],
        [0.046, 0.115],
      ],
      matSkin,
      18
    );

    const head = new THREE.Group();
    head.position.set(0, 0.185, 0.008);
    headPivot.add(head);

    // World-tracked neural origin just above-right of temple where glowing Thought Orbs emerge
    const thoughtOriginAnchor = new THREE.Object3D();
    thoughtOriginAnchor.position.set(0.095, 0.15, 0.03);
    head.add(thoughtOriginAnchor);

    // Continuous sculpted human face & cranium (single organic mesh!)
    const cranium = new THREE.Mesh(buildSculptedHumanHeadGeo(), matSkin);
    head.add(cranium);

    // Sculpted smooth human nose bridge + soft tip
    const noseCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.022, 0.086),
      new THREE.Vector3(0, -0.002, 0.104),
      new THREE.Vector3(0, -0.022, 0.109),
      new THREE.Vector3(0, -0.029, 0.095),
    ]);
    const nose = new THREE.Mesh(new THREE.TubeGeometry(noseCurve, 12, 0.010, 10, false), matSkin);
    head.add(nose);

    // Sculpted subtle upper & lower human lips (natural rose-terracotta curve)
    const matLip = new THREE.MeshStandardMaterial({ color: 0xb96c5a, roughness: 0.52 });
    const lipUpper = new THREE.Mesh(
      new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3([
          new THREE.Vector3(-0.020, -0.056, 0.074),
          new THREE.Vector3(-0.007, -0.052, 0.084),
          new THREE.Vector3(0.0, -0.054, 0.085),
          new THREE.Vector3(0.007, -0.052, 0.084),
          new THREE.Vector3(0.020, -0.056, 0.074),
        ]),
        14,
        0.0042,
        8,
        false
      ),
      matLip
    );
    const lipLower = new THREE.Mesh(
      new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3([
          new THREE.Vector3(-0.017, -0.060, 0.075),
          new THREE.Vector3(0, -0.063, 0.084),
          new THREE.Vector3(0.017, -0.060, 0.075),
        ]),
        12,
        0.0048,
        8,
        false
      ),
      matLip
    );
    head.add(lipUpper, lipLower);

    // Organic sculpted ears on left & right
    [-1, 1].forEach((side) => {
      const ear = new THREE.Mesh(new THREE.SphereGeometry(0.021, 12, 10), matSkin);
      ear.scale.set(0.38, 1.15, 0.68);
      ear.position.set(side * 0.087, -0.008, -0.008);
      ear.rotation.y = side * -0.18;
      head.add(ear);
    });

    // Real Human Eyes (warm off-white sclera + dark hazel iris + deep pupil + crisp catchlight + upper eyelid!)
    const matSclera = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.22 });
    const matIris = new THREE.MeshStandardMaterial({ color: 0x3e2718, roughness: 0.25 });
    const matPupil = new THREE.MeshBasicMaterial({ color: 0x0b0f19 });
    const matLid = new THREE.MeshStandardMaterial({ color: 0xd99f80, roughness: 0.58 });
    [-0.032, 0.032].forEach((ex) => {
      const eyeGrp = new THREE.Group();
      eyeGrp.position.set(ex, 0.010, 0.081);
      eyeGrp.rotation.y = ex < 0 ? -0.14 : 0.14;

      const sclera = new THREE.Mesh(new THREE.SphereGeometry(0.0125, 14, 12), matSclera);
      sclera.scale.set(1.18, 0.78, 0.72);
      eyeGrp.add(sclera);

      const iris = new THREE.Mesh(new THREE.SphereGeometry(0.0068, 12, 10), matIris);
      iris.scale.set(1.0, 1.0, 0.45);
      iris.position.set(0, 0, 0.0074);
      eyeGrp.add(iris);

      const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.0034, 10, 8), matPupil);
      pupil.position.set(0, 0, 0.0094);
      eyeGrp.add(pupil);

      const eyelid = new THREE.Mesh(
        new THREE.TorusGeometry(0.0128, 0.0034, 8, 14, Math.PI),
        matLid
      );
      eyelid.scale.set(1.16, 0.74, 0.85);
      eyelid.position.set(0, 0.002, 0.0025);
      eyeGrp.add(eyelid);

      head.add(eyeGrp);
    });

    // Softly Arched Tapered Organic Eyebrows (animated during stress & calm relief!)
    const browGeoL = new THREE.TubeGeometry(
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.016, 0.0, 0.003),
        new THREE.Vector3(0.0, 0.004, 0.005),
        new THREE.Vector3(0.016, -0.002, 0.0),
      ]),
      10,
      0.0032,
      7,
      false
    );
    const browGeoR = new THREE.TubeGeometry(
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.016, -0.002, 0.0),
        new THREE.Vector3(0.0, 0.004, 0.005),
        new THREE.Vector3(0.016, 0.0, 0.003),
      ]),
      10,
      0.0032,
      7,
      false
    );
    const browL = new THREE.Mesh(browGeoL, matHair);
    browL.position.set(-0.032, 0.029, 0.088);
    const browR = new THREE.Mesh(browGeoR, matHair);
    browR.position.set(0.032, 0.029, 0.088);
    head.add(browL, browR);

    // Layered Organic Men's Tailored Hair (swept contoured crown & side tapers — NO cube block!)
    const hairCap = new THREE.Mesh(
      new THREE.SphereGeometry(0.106, 24, 18, 0, Math.PI * 2, 0, Math.PI * 0.54),
      matHair
    );
    hairCap.scale.set(0.91, 1.06, 1.01);
    hairCap.rotation.x = -0.34;
    hairCap.position.set(0, 0.018, -0.014);
    head.add(hairCap);

    // Smooth curved swept front hair wave using deformed spheres + tapered locks
    const waveCore = new THREE.Mesh(new THREE.SphereGeometry(0.056, 18, 14), matHair);
    waveCore.scale.set(1.42, 0.46, 0.88);
    waveCore.position.set(0.008, 0.088, 0.030);
    waveCore.rotation.set(0.32, -0.14, -0.10);
    head.add(waveCore);

    const sideSweep = new THREE.Mesh(new THREE.SphereGeometry(0.044, 14, 12), matHair);
    sideSweep.scale.set(1.15, 0.42, 0.72);
    sideSweep.position.set(-0.035, 0.078, 0.036);
    sideSweep.rotation.set(0.28, 0.25, 0.22);
    head.add(sideSweep);

    [-1, 1].forEach((side) => {
      const sideburn = new THREE.Mesh(new THREE.SphereGeometry(0.028, 12, 10), matHair);
      sideburn.scale.set(0.38, 1.45, 0.95);
      sideburn.position.set(side * 0.081, 0.016, 0.008);
      head.add(sideburn);
    });

    // Sleek Slim Titanium Wire-Rim Glasses (crystal-clear lenses so human eyes stay sharp & expressive!)
    const matGlassesFrame = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.72, roughness: 0.28 });
    [-0.032, 0.032].forEach((gx) => {
      const rimWire = new THREE.Mesh(new THREE.TorusGeometry(0.0185, 0.0019, 8, 28), matGlassesFrame);
      rimWire.scale.set(1.16, 0.84, 1.0);
      rimWire.position.set(gx, 0.011, 0.098);
      rimWire.rotation.y = gx < 0 ? -0.10 : 0.10;
      head.add(rimWire);

      const lensGlass = new THREE.Mesh(
        new THREE.CircleGeometry(0.018, 22),
        new THREE.MeshBasicMaterial({ color: 0xbae6fd, transparent: true, opacity: 0.12, side: THREE.DoubleSide })
      );
      lensGlass.scale.set(1.14, 0.82, 1.0);
      lensGlass.position.set(gx, 0.011, 0.0975);
      lensGlass.rotation.y = gx < 0 ? -0.10 : 0.10;
      head.add(lensGlass);

      const templeWire = new THREE.Mesh(new THREE.CylinderGeometry(0.0015, 0.0015, 0.096, 8), matGlassesFrame);
      templeWire.rotation.x = Math.PI * 0.5;
      templeWire.position.set(gx + (gx < 0 ? -0.022 : 0.022), 0.012, 0.050);
      head.add(templeWire);
    });
    const noseBridge = new THREE.Mesh(
      new THREE.TorusGeometry(0.009, 0.0016, 6, 12, Math.PI),
      matGlassesFrame
    );
    noseBridge.position.set(0, 0.011, 0.099);
    head.add(noseBridge);

    // Articulated Doctor Arms with Seamless Contoured Sleeves, Rounded Wrists & 5-Finger Human Hands
    function createDoctorArm(xSign) {
      const sh = new THREE.Group();
      sh.position.set(xSign * 0.205, 0.402, 0.01);
      torso.add(sh);

      // Smooth deltoid cap blending sleeve organically into torso
      const deltoid = new THREE.Mesh(new THREE.SphereGeometry(0.049, 16, 14), matCoat);
      deltoid.scale.set(0.95, 1.12, 0.92);
      sh.add(deltoid);

      createOrganicLimb(
        sh,
        [
          [0.036, -0.232],
          [0.041, -0.16],
          [0.046, -0.08],
          [0.048, -0.01],
          [0.038, 0.02],
        ],
        matCoat,
        18
      );

      const el = new THREE.Group();
      el.position.set(0, -0.23, 0);
      sh.add(el);

      const elbowCap = new THREE.Mesh(new THREE.SphereGeometry(0.036, 14, 12), matCoat);
      el.add(elbowCap);

      createOrganicLimb(
        el,
        [
          [0.033, -0.195],
          [0.034, -0.12],
          [0.038, -0.05],
          [0.036, 0.0],
        ],
        matCoat,
        16
      );

      // Soft sleeve cuff + natural tapered wrist
      const cuff = new THREE.Mesh(new THREE.TorusGeometry(0.032, 0.006, 8, 18), matCoat);
      cuff.rotation.x = Math.PI * 0.5;
      cuff.position.y = -0.19;
      el.add(cuff);

      createOrganicLimb(
        el,
        [
          [0.020, -0.228],
          [0.022, -0.195],
        ],
        matSkin,
        14
      );

      // Anatomically sculpted 5-finger human hand (rounded palm + 4 tapered fingers + opposable thumb)
      const hand = new THREE.Group();
      hand.position.y = -0.226;
      el.add(hand);

      const palm = new THREE.Mesh(new THREE.SphereGeometry(0.028, 14, 12), matSkin);
      palm.scale.set(0.96, 1.08, 0.44);
      palm.position.set(0, -0.025, 0.002);
      hand.add(palm);

      // 4 natural slightly curved fingers
      [-0.0165, -0.0055, 0.0055, 0.0165].forEach((fx, idx) => {
        const fLen = idx === 1 ? 0.048 : idx === 0 || idx === 2 ? 0.044 : 0.036;
        const finger = createOrganicLimb(
          hand,
          [
            [0.0042, -fLen],
            [0.0056, -fLen * 0.5],
            [0.0062, 0.0],
          ],
          matSkin,
          8
        );
        finger.position.set(fx, -0.046, 0.004);
        finger.rotation.x = 0.34 + idx * 0.03;
      });

      const thumb = createOrganicLimb(
        hand,
        [
          [0.0052, -0.036],
          [0.0068, -0.016],
          [0.0075, 0.0],
        ],
        matSkin,
        8
      );
      thumb.position.set(xSign * -0.024, -0.022, 0.012);
      thumb.rotation.set(0.28, 0, xSign * 0.52);

      return { sh, el, hand };
    }

    const leftArm = createDoctorArm(-1);
    const rightArm = createDoctorArm(1);

    // Tidy resting clinical folio lying flat on desk (no stressful crumpling or throwing!)
    const activeSheet = new THREE.Mesh(new THREE.PlaneGeometry(0.24, 0.30), matPaper);
    activeSheet.rotation.x = -Math.PI * 0.5;
    activeSheet.rotation.z = 0.06;
    activeSheet.position.set(0.02, deskY + 0.026, 0.12);
    station.add(activeSheet);

    return {
      station,
      doctor,
      torso,
      headPivot,
      head,
      thoughtOriginAnchor,
      browL,
      browR,
      leftArm,
      rightArm,
      activeSheet,
      deskY,
      deskWarmLight,
    };
  }

  function buildThinkingVisuals() {
    return null;
  }

  const sec = document.getElementById(SEC_ID);
  if (!sec || typeof THREE === 'undefined') return;

  const canvas = document.createElement('canvas');
  canvas.id = CANVAS_ID;
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.cssText =
    'position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none;z-index:2;';
  sec.appendChild(canvas);

  let renderer = null;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
  } catch (err) {
    canvas.remove();
    return;
  }

  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  const scene = new THREE.Scene();
  scene.fog = null;

  const camera = new THREE.PerspectiveCamera(42, 16 / 9, 0.2, 40);
  const BASE_CAM = new THREE.Vector3(0, 0.14, 3.85);
  camera.position.copy(BASE_CAM);

  // Indoor architectural ceiling + balanced cinema lighting (zero face overexposure)
  const hemi = new THREE.HemisphereLight(0xcbd5e1, 0x111827, 0.72);
  const ceilingFill = new THREE.PointLight(0xe0f2fe, 0.78, 13, 1.35);
  ceilingFill.position.set(0.8, 3.25, -2.2);
  const key = new THREE.DirectionalLight(0xe0f2fe, 0.66);
  key.position.set(-2.2, 3.8, 3.5);
  const rim = new THREE.DirectionalLight(0x38bdf8, 0.62);
  rim.position.set(3.8, 2.0, -2.5);
  scene.add(hemi, ceilingFill, key, rim);

  const envObj = buildEnvironment(scene);
  const work = buildDoctorWorkstation();
  scene.add(work.station);

  let width = 1280;
  let height = 720;
  let restProjX = 1010;
  let restProjY = 235;
  let restProjR = 148;
  let baseRectSynced = false;
  const projCenterW = new THREE.Vector3();
  const projTopW = new THREE.Vector3();
  const projCornerW = new THREE.Vector3();
  const savedCamPos = new THREE.Vector3();
  const savedCamQuat = new THREE.Quaternion();

  function projectAnchorPx(anchor) {
    anchor.getWorldPosition(projCornerW);
    projCornerW.project(camera);
    return {
      x: (projCornerW.x * 0.5 + 0.5) * width,
      y: (-projCornerW.y * 0.5 + 0.5) * height,
    };
  }

  function buildProjectorQuad() {
    envObj.projGroup.updateMatrixWorld(true);
    const tl = projectAnchorPx(envObj.projCornerTL);
    const tr = projectAnchorPx(envObj.projCornerTR);
    const br = projectAnchorPx(envObj.projCornerBR);
    const bl = projectAnchorPx(envObj.projCornerBL);
    const c = projectAnchorPx(envObj.projCenterAnchor);
    return { tl, tr, br, bl, cx: c.x, cy: c.y };
  }

  function syncProjectorBaseRect() {
    if (width < 1024) return;
    savedCamPos.copy(camera.position);
    savedCamQuat.copy(camera.quaternion);
    camera.position.copy(BASE_CAM);
    camera.lookAt(0, -0.10, -3.4);
    camera.updateMatrixWorld(true);
    camera.matrixWorldInverse.copy(camera.matrixWorld).invert();

    const baseQuad = buildProjectorQuad();
    envObj.projTopAnchor.getWorldPosition(projTopW);
    projTopW.project(camera);

    restProjX = baseQuad.cx;
    restProjY = baseQuad.cy;
    const topY = (-projTopW.y * 0.5 + 0.5) * height;
    restProjR = clamp(Math.abs(restProjY - topY) * 0.85, 86, 120);

    camera.position.copy(savedCamPos);
    camera.quaternion.copy(savedCamQuat);
    camera.updateMatrixWorld(true);
    camera.matrixWorldInverse.copy(camera.matrixWorld).invert();

    baseRectSynced = true;
    if (typeof window.__setFndBaseProjectorQuad === 'function') {
      window.__setFndBaseProjectorQuad(baseQuad, restProjR);
    } else if (typeof window.__setFndBaseGlobeRect === 'function') {
      window.__setFndBaseGlobeRect(restProjX, restProjY, restProjR);
    }
  }

  function resize() {
    const r = sec.getBoundingClientRect();
    if (r.width < 120 || r.height < 120) return;
    width = r.width;
    height = r.height;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    // Position desk cleanly on raised office floor so complete legs, trousers & shoes stay comfortably visible above bottom ticker bar
    const isDesktop = width >= 1024;
    if (isDesktop) {
      work.station.position.set(0.58, -1.42, -2.02);
      work.station.rotation.y = 0.22;
      work.station.scale.setScalar(0.88);
      syncProjectorBaseRect();
    } else {
      work.station.position.set(0.0, -1.42, -2.65);
      work.station.rotation.y = 0.14;
      work.station.scale.setScalar(0.75);
    }
  }
  resize();
  if ('ResizeObserver' in window) {
    new ResizeObserver(resize).observe(sec);
  } else {
    window.addEventListener('resize', resize, { passive: true });
  }

  const pointer = { nx: 0, ny: 0, curX: 0, curY: 0 };
  window.addEventListener(
    'mousemove',
    (e) => {
      const r = sec.getBoundingClientRect();
      if (!r.width || !r.height) return;
      pointer.nx = clamp(((e.clientX - r.left) / r.width) * 2 - 1, -1, 1);
      pointer.ny = clamp(((e.clientY - r.top) / r.height) * 2 - 1, -1, 1);
    },
    { passive: true }
  );

  const tmpVec = new THREE.Vector3();
  const tmpStart = new THREE.Vector3();
  const tmpCtrl = new THREE.Vector3();
  const tmpTarget = new THREE.Vector3();
  const handWorld = new THREE.Vector3();

  function getGlobeWorldTarget() {
    if (width >= 1024 && envObj && envObj.projCenterAnchor) {
      envObj.projGroup.updateMatrixWorld(true);
      envObj.projCenterAnchor.getWorldPosition(tmpTarget);
      return tmpTarget;
    }
    const meta = window.__fndGlobeMeta;
    let gx = width * 0.82;
    let gy = height * 0.28;
    if (meta && meta.cw > 100 && meta.ch > 100) {
      gx = meta.mx;
      gy = meta.my;
    }
    const ndcX = (gx / Math.max(1, width)) * 2 - 1;
    const ndcY = -((gy / Math.max(1, height)) * 2 - 1);
    tmpVec.set(ndcX, ndcY, 0.5).unproject(camera);
    const dir = tmpVec.sub(camera.position).normalize();
    const targetZ = -2.25;
    const dist = (targetZ - camera.position.z) / (dir.z || -1);
    return tmpTarget.copy(camera.position).addScaledVector(dir, dist);
  }

  let simClock = 0;
  let impactTriggeredThisLoop = false;
  const thoughtStartPos = new THREE.Vector3();
  const tmpTangent = new THREE.Vector3();
  const tmpViewDir = new THREE.Vector3();
  const tmpSide = new THREE.Vector3();
  let visible = true;

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          visible = en.isIntersecting;
        });
      },
      { threshold: 0.01 }
    ).observe(sec);
  }

  const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let lastTs = performance.now();
  window.__fndVrControlled = true;

  window.__setFndVrSceneTime = function (tSec) {
    simClock = Number(tSec) || 0;
    impactTriggeredThisLoop = false;
  };

  // Sync initial frame cleanly on desktop only (mobile hides VR background animation)
  if (window.innerWidth >= 1024) {
    updateStoryboard(0);
    renderer.render(scene, camera);
  } else {
    canvas.style.display = 'none';
  }

  function updateStoryboard(dt) {
    const prevT = simClock % LOOP_DURATION;
    simClock += dt;
    const t = simClock % LOOP_DURATION;

    if (t < prevT) {
      impactTriggeredThisLoop = false;
    }

    // Balanced Cinema VR Cursor Head-Look Parallax
    const camEase = 1 - Math.exp(-3.8 * dt);
    pointer.curX = lerp(pointer.curX, pointer.nx, camEase);
    pointer.curY = lerp(pointer.curY, pointer.ny, camEase);

    const idleDriftX = Math.sin(simClock * 0.42) * 0.07;
    const idleDriftY = Math.cos(simClock * 0.35) * 0.035;
    camera.position.set(
      BASE_CAM.x + pointer.curX * 0.38 + idleDriftX,
      BASE_CAM.y - pointer.curY * 0.20 + idleDriftY,
      BASE_CAM.z
    );
    camera.lookAt(
      pointer.curX * 0.72,
      -0.10 - pointer.curY * 0.42,
      -3.4
    );

    const dAttr = envObj.dustGeo.attributes.position;
    for (let i = 0; i < dAttr.count; i++) {
      let y = dAttr.getY(i) + dt * 0.045;
      if (y > 2.4) y = -1.15;
      dAttr.setY(i, y);
    }
    dAttr.needsUpdate = true;

    // Reveal dotted MEDIQ projection quickly as his ascending thoughts reach the screen
    let globeReveal = 0;
    if (t >= 2.00 && t < 2.75) {
      globeReveal = smoothstep((t - 2.00) / 0.75);
    } else if (t >= 2.75 && t < 8.35) {
      globeReveal = 1;
    } else if (t >= 8.35 && t < 9.25) {
      globeReveal = 1 - smoothstep((t - 8.35) / 0.90);
    }

    // Illuminate 3D wall projector screen + lock MEDIQ Particles pixel-accurately inside the black screen across VR parallax
    if (width >= 1024 && !baseRectSynced) {
      syncProjectorBaseRect();
    }
    envObj.projScreenMat.emissiveIntensity = lerp(0.05, 0.16, globeReveal);
    envObj.projBeamMat.opacity = lerp(0.02, 0.42, globeReveal);
    let panX = 0;
    let panY = 0;
    if (width >= 1024) {
      camera.updateMatrixWorld(true);
      camera.matrixWorldInverse.copy(camera.matrixWorld).invert();
      const liveQuad = buildProjectorQuad();
      panX = liveQuad.cx - restProjX;
      panY = liveQuad.cy - restProjY;
      if (typeof window.__setFndProjectorQuad === 'function') {
        window.__setFndProjectorQuad(liveQuad, globeReveal);
      } else if (typeof window.__setFndGlobeFrame === 'function') {
        window.__setFndGlobeFrame(panX, panY, globeReveal);
      }
    } else if (typeof window.__setFndGlobeReveal === 'function') {
      window.__setFndGlobeReveal(globeReveal);
    }

    const { torso, headPivot, browL, browR, leftArm, rightArm, activeSheet } = work;

    // Keep clinical desk sheet serenely flat (never crumpled or discarded)
    activeSheet.visible = true;

    // Doctor Choreography: Pensive "Thinker" pose -> upward gaze of insight while thinking of MEDIQ
    let gazeUpMix = 0;
    if (t < 1.55) {
      gazeUpMix = 0;
    } else if (t < 2.65) {
      gazeUpMix = smootherstep((t - 1.55) / 1.10);
    } else if (t < 8.35) {
      gazeUpMix = 1;
    } else {
      gazeUpMix = 1 - smootherstep((t - 8.35) / 1.15);
    }

    const breathe = Math.sin(t * 1.7) * 0.015;
    const microNod = Math.sin(t * 1.15) * 0.025;
    const headSway = Math.sin(t * 0.85) * 0.03;

    torso.rotation.set(
      lerp(0.14, 0.05, gazeUpMix) + breathe,
      lerp(0.06, 0.02, gazeUpMix),
      0
    );
    headPivot.rotation.set(
      lerp(0.12, -0.18, gazeUpMix) + microNod,
      lerp(-0.06, -0.20, gazeUpMix) + headSway * (1 - gazeUpMix * 0.5),
      lerp(0.04, -0.03, gazeUpMix)
    );
    // Calm inquisitive concentration -> gentle lifted realization (zero angry frown)
    browL.rotation.z = lerp(-0.08, 0.06, gazeUpMix);
    browR.rotation.z = lerp(0.08, -0.06, gazeUpMix);

    // Classic "Thinker" right arm (fingertips poised lightly beneath/beside chin as head tilts gently)
    rightArm.sh.rotation.set(
      lerp(-1.15, -1.24, gazeUpMix),
      -0.15,
      lerp(-0.10, -0.08, gazeUpMix)
    );
    rightArm.el.rotation.set(
      lerp(-2.30, -2.18, gazeUpMix),
      0,
      lerp(-0.60, -0.48, gazeUpMix)
    );

    // Left arm resting serenely atop clinical folio on desk
    leftArm.sh.rotation.set(-0.78, 0.16, -0.16);
    leftArm.el.rotation.set(-1.14, 0, 0.16);

    // Trigger clean particle illumination inside the projector screen without any floating streak/ribbon
    if (t >= 1.85 && !impactTriggeredThisLoop) {
      impactTriggeredThisLoop = true;
      if (typeof window.__fndOnStarImpact === 'function') {
        window.__fndOnStarImpact(0.75);
      }
    }
  }

  function loop(ts) {
    requestAnimationFrame(loop);
    if (window.innerWidth < 1024) {
      if (canvas.style.display !== 'none') canvas.style.display = 'none';
      lastTs = ts;
      return;
    }
    if (canvas.style.display === 'none') canvas.style.display = 'block';
    if (document.hidden || !visible) {
      lastTs = ts;
      return;
    }
    if (sec.classList.contains('is-hidden-subpage')) {
      simClock = 0;
      impactTriggeredThisLoop = false;
      if (typeof window.__setFndGlobeReveal === 'function') window.__setFndGlobeReveal(0);
      lastTs = ts;
      return;
    }
    if (typeof window.__aboutDeckCurrentIndex === 'number' && window.__aboutDeckCurrentIndex === 0) {
      lastTs = ts;
      return;
    }
    const sr = sec.getBoundingClientRect();
    if (
      sr.width >= 120 &&
      sr.height >= 120 &&
      (!baseRectSynced || Math.abs(sr.width - width) > 1.5 || Math.abs(sr.height - height) > 1.5)
    ) {
      resize();
    }

    const dt = reduced ? 0 : Math.min(0.05, Math.max(0.002, (ts - lastTs) / 1000));
    lastTs = ts;

    updateStoryboard(dt);
    renderer.render(scene, camera);
  }

  requestAnimationFrame(loop);
})();
