/**
 * MEDIQ — SLIDE 3 VR WEBGL BACKGROUND STORYBOARD
 * ============================================================================
 * Immersive "Inside VR" 3D Indoor Executive Doctor's Office inside #about-sec-foundation:
 *   - Enclosed architectural medical office interior (dark plank floor, woven area rug,
 *     slate-navy acoustic slat wall, frosted Venetian-blind side window overlooking night
 *     lights, recessed ceiling LED troffers, bookshelves, indoor plant, wall certificate)
 *   - Balanced Cinema VR cursor head-look parallax camera
 *   - Realistic Articulated Male Doctor seated at an open architectural desk with full
 *     hips, thighs, knees, shins, trousers, socks, and leather dress shoes planted on
 *     the office rug/floor:
 *       1) Stressed over messy paperwork (furrowed brows, hand on temple, tapping desk)
 *       2) Angry grab & crumple of a sheet into a 3D jagged paper ball
 *       3) Energetic throw diagonally up-right that ignites into a Shooting Star
 *       4) Lands dead-center on the live MEDIQ Particle Globe, triggering
 *          __fndOnStarImpact() to energize and reform the globe
 */
(function initFoundationVrScene() {
  'use strict';

  const SEC_ID = 'about-sec-foundation';
  const CANVAS_ID = 'fnd-vr-bg-canvas';
  const LOOP_DURATION = 13.5;

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
    ctx.font = 'bold 9px sans-serif';
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
    ctx.font = 'bold 14px serif';
    ctx.textAlign = 'center';
    ctx.fillText('OPHTHALMOLOGY', 96, 36);
    ctx.font = 'bold 20px monospace';
    ctx.fillText('E', 96, 62);
    ctx.font = 'bold 13px monospace';
    ctx.fillText('F P', 96, 80);
    ctx.font = 'bold 10px monospace';
    ctx.fillText('T O Z', 96, 95);
    ctx.fillStyle = '#c59d43';
    ctx.beginPath();
    ctx.arc(154, 108, 12, 0, Math.PI * 2);
    ctx.fill();
    const tex = new THREE.CanvasTexture(c);
    tex.needsUpdate = true;
    return tex;
  }

  function createLimb(parent, rTop, rBot, len, mat) {
    const g = new THREE.CylinderGeometry(rTop, rBot, len, 14);
    const m = new THREE.Mesh(g, mat);
    m.position.y = -len * 0.5;
    parent.add(m);
    const j = new THREE.Mesh(new THREE.SphereGeometry(rBot * 0.96, 12, 10), mat);
    j.position.y = -len;
    parent.add(j);
    return m;
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

    // 1. Deep obsidian wood plank office floor
    const floorMat = new THREE.MeshStandardMaterial({
      map: makeWoodFloorTexture(),
      emissive: 0x03050a,
      emissiveIntensity: 0.4,
      roughness: 0.58,
      metalness: 0.12,
    });
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(26, 18), floorMat);
    floor.rotation.x = -Math.PI * 0.5;
    floor.position.set(0, FLOOR_Y, -1.5);
    env.add(floor);

    // Woven charcoal-slate area rug directly beneath the doctor's office workstation
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

    // 2. Enclosed interior walls & ceiling in sleek deep obsidian-black cinema tone (zero seam behind copy, zero blue wash)
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0x050912,
      emissive: 0x03050b,
      emissiveIntensity: 0.58,
      roughness: 0.85,
      metalness: 0.06,
    });
    const trimDarkMat = new THREE.MeshStandardMaterial({
      color: 0x0c1322,
      emissive: 0x040710,
      emissiveIntensity: 0.35,
      roughness: 0.45,
      metalness: 0.22,
    });
    const slatMat = new THREE.MeshStandardMaterial({
      color: 0x101829,
      emissive: 0x050914,
      emissiveIntensity: 0.35,
      roughness: 0.62,
      metalness: 0.14,
    });

    const backWall = new THREE.Mesh(new THREE.PlaneGeometry(26, WALL_H), wallMat);
    backWall.position.set(0, FLOOR_Y + WALL_H * 0.5, BACK_Z);
    env.add(backWall);

    const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(18, WALL_H), wallMat);
    leftWall.rotation.y = Math.PI * 0.5;
    leftWall.position.set(-10.8, FLOOR_Y + WALL_H * 0.5, -1.0);
    env.add(leftWall);

    const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(18, WALL_H), wallMat);
    rightWall.rotation.y = -Math.PI * 0.5;
    rightWall.position.set(4.85, FLOOR_Y + WALL_H * 0.5, -1.0);
    env.add(rightWall);

    // Baseboard skirting along back & side walls
    const backBaseboard = new THREE.Mesh(new THREE.BoxGeometry(24, 0.18, 0.06), trimDarkMat);
    backBaseboard.position.set(0, FLOOR_Y + 0.09, BACK_Z + 0.03);
    env.add(backBaseboard);

    const rightBaseboard = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.18, 16), trimDarkMat);
    rightBaseboard.position.set(4.82, FLOOR_Y + 0.09, -1.0);
    env.add(rightBaseboard);

    // 3. Lofty Office Ceiling harmonized with obsidian wall tone (no pitch-black triangle against copy)
    const ceilMat = new THREE.MeshStandardMaterial({
      color: 0x04070e,
      emissive: 0x03050b,
      emissiveIntensity: 0.62,
      roughness: 0.88,
    });
    const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(26, 18), ceilMat);
    ceiling.rotation.x = Math.PI * 0.5;
    ceiling.position.set(0, CEIL_Y, -1.5);
    env.add(ceiling);

    const trofferFrameMat = new THREE.MeshStandardMaterial({ color: 0x17315c, metalness: 0.5, roughness: 0.4 });
    const trofferLightMat = new THREE.MeshBasicMaterial({ color: 0x93c5fd, transparent: true, opacity: 0.36 });
    [-2.4, -4.4].forEach((tz) => {
      const frame = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.05, 0.36), trofferFrameMat);
      frame.position.set(1.25, CEIL_Y - 0.02, tz);
      env.add(frame);
      const panel = new THREE.Mesh(new THREE.PlaneGeometry(1.78, 0.26), trofferLightMat);
      panel.rotation.x = Math.PI * 0.5;
      panel.position.set(1.25, CEIL_Y - 0.048, tz);
      env.add(panel);
    });

    // 4. Vertical Acoustic Slat Paneling behind desk (right-center only so left copy stays quiet)
    for (let sx = -0.15; sx <= 2.35; sx += 0.14) {
      const slat = new THREE.Mesh(new THREE.BoxGeometry(0.055, WALL_H - 0.24, 0.05), slatMat);
      slat.position.set(sx, FLOOR_Y + WALL_H * 0.5 + 0.04, BACK_Z + 0.03);
      env.add(slat);
    }

    // Framed Medical / Ophthalmology Plaque on back acoustic wall
    const plaqueFrame = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.72, 0.04), trimDarkMat);
    plaqueFrame.position.set(0.62, 0.52, BACK_Z + 0.07);
    env.add(plaqueFrame);
    const plaqueFace = new THREE.Mesh(
      new THREE.PlaneGeometry(0.84, 0.64),
      new THREE.MeshStandardMaterial({ map: makeWallPlaqueTexture(), roughness: 0.55 })
    );
    plaqueFace.position.set(0.62, 0.52, BACK_Z + 0.095);
    env.add(plaqueFace);

    // 5. Right Wall Sleek Venetian-Blind Clinic Window (frames foreground-right edge cleanly)
    const winGroup = new THREE.Group();
    winGroup.position.set(4.79, -0.05, -1.65);
    winGroup.rotation.y = -Math.PI * 0.5;
    env.add(winGroup);

    const winSill = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.07, 0.16), trimDarkMat);
    winSill.position.set(0, -1.0, 0.04);
    winGroup.add(winSill);

    const winOuter = new THREE.Mesh(new THREE.BoxGeometry(2.52, 2.0, 0.08), trimDarkMat);
    winGroup.add(winOuter);

    const winGlass = new THREE.Mesh(
      new THREE.PlaneGeometry(2.36, 1.84),
      new THREE.MeshBasicMaterial({ color: 0x04070e, transparent: true, opacity: 0.92 })
    );
    winGlass.position.z = 0.044;
    winGroup.add(winGlass);

    const blindMat = new THREE.MeshStandardMaterial({ color: 0x0d1424, roughness: 0.55, metalness: 0.28 });
    for (let i = 0; i < 10; i++) {
      const slat = new THREE.Mesh(new THREE.BoxGeometry(2.34, 0.024, 0.028), blindMat);
      slat.position.set(0, 0.82 - i * 0.11, 0.065);
      slat.rotation.x = 0.28;
      winGroup.add(slat);
    }

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
    projGroup.add(projCenterAnchor, projTopAnchor, projCornerTL, projCornerTR, projCornerBR, projCornerBL);

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

    const deskWarmLight = new THREE.PointLight(0xfbbf24, 2.35, 4.6, 1.7);
    deskWarmLight.position.set(0.30, deskY + 0.42, 0.05);
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

    // Small Mesh Office Trash Bin on the rug beside desk right leg (with prior discarded balls!)
    const binGroup = new THREE.Group();
    binGroup.position.set(0.58, 0.0, 0.18);
    station.add(binGroup);
    const binMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.135, 0.105, 0.28, 14, 1, true),
      new THREE.MeshStandardMaterial({ color: 0x1e355e, metalness: 0.55, roughness: 0.4, side: THREE.DoubleSide })
    );
    binMesh.position.y = 0.145;
    binGroup.add(binMesh);
    const binRim = new THREE.Mesh(new THREE.TorusGeometry(0.135, 0.009, 8, 18), matMetal);
    binRim.rotation.x = Math.PI * 0.5;
    binRim.position.y = 0.285;
    binGroup.add(binRim);
    [[-0.03, 0.06, 0.02], [0.035, 0.08, -0.02]].forEach(([bx, by, bz]) => {
      const waste = new THREE.Mesh(createCrumpledPaperGeo(0.046), matPaper);
      waste.position.set(bx, by, bz);
      binGroup.add(waste);
    });

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
    const matSkin = new THREE.MeshStandardMaterial({
      color: 0xeac09e,
      roughness: 0.58,
    });
    const matHair = new THREE.MeshStandardMaterial({
      color: 0x111726,
      roughness: 0.62,
    });
    const matSteth = new THREE.MeshStandardMaterial({
      color: 0x72c5f8,
      emissive: 0x3aa0db,
      emissiveIntensity: 0.38,
      metalness: 0.45,
      roughness: 0.28,
    });

    // Doctor pelvis root sits at y = 0.48 on seat (0.45); floor = 0
    const doctor = new THREE.Group();
    doctor.position.set(0.02, 0.48, -0.49);
    station.add(doctor);

    // Pelvis / seated trouser hips
    const pelvis = new THREE.Mesh(new THREE.CylinderGeometry(0.135, 0.14, 0.12, 14), matTrousers);
    pelvis.scale.set(1.18, 0.9, 0.78);
    pelvis.position.set(0, 0.02, 0.0);
    doctor.add(pelvis);

    // Complete Articulated Legs: Hip -> Thigh -> Knee -> Shin/Calf -> Ankle -> Dress Shoe on floor (y = 0.006)
    const legSpecs = [
      { side: -1, hipX: -0.098, splayY: -0.09, shinPitchX: -0.08 },
      { side: 1, hipX: 0.098, splayY: 0.11, shinPitchX: 0.06 },
    ];
    legSpecs.forEach(({ hipX, splayY, shinPitchX }) => {
      const hip = new THREE.Group();
      hip.position.set(hipX, -0.005, 0.04);
      hip.rotation.y = splayY;
      doctor.add(hip);

      // Thigh (extends forward +Z slightly pitched down -0.14 rad so knee is at y_station ≈ 0.42)
      const thighGroup = new THREE.Group();
      thighGroup.rotation.x = 0.14; // tilts +Z slightly downward (-Y)
      hip.add(thighGroup);

      const thighMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.066, 0.052, 0.40, 14), matTrousers);
      thighMesh.rotation.x = Math.PI * 0.5;
      thighMesh.position.set(0, 0, 0.20);
      thighGroup.add(thighMesh);

      const kneeJoint = new THREE.Mesh(new THREE.SphereGeometry(0.053, 12, 10), matTrousers);
      kneeJoint.position.set(0, 0, 0.40);
      thighGroup.add(kneeJoint);

      // Shin / Calf going vertically down from knee (local y = 0) to ankle (local y = -0.365)
      const knee = new THREE.Group();
      knee.position.set(0, 0, 0.40);
      knee.rotation.x = -0.14 + shinPitchX; // counteracts thigh pitch so shin goes cleanly downward!
      thighGroup.add(knee);

      const shinMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.051, 0.039, 0.365, 14), matTrousers);
      shinMesh.position.set(0, -0.1825, 0);
      knee.add(shinMesh);

      // Tailored trouser cuff near ankle
      const cuff = new THREE.Mesh(new THREE.CylinderGeometry(0.044, 0.046, 0.042, 14), matTrousers);
      cuff.position.set(0, -0.34, 0);
      knee.add(cuff);

      // Ankle + Sculpted Leather Dress Shoe planted cleanly onto the office rug/floor!
      const ankle = new THREE.Group();
      ankle.position.set(0, -0.365, 0);
      ankle.rotation.x = -shinPitchX; // keeps shoe sole completely level with floor!
      knee.add(ankle);

      const shoe = buildDressShoe(matShoe, matSole, matSock);
      ankle.add(shoe);
    });

    // Adult Male Upper Torso (anatomical broad-shouldered tapered ribcage, NOT a straight pipe)
    const torso = new THREE.Group();
    torso.position.set(0, 0.06, -0.01);
    doctor.add(torso);

    const chestCore = new THREE.Mesh(new THREE.CylinderGeometry(0.168, 0.132, 0.44, 16), matScrubs);
    chestCore.scale.set(1.16, 1.0, 0.68);
    chestCore.position.y = 0.22;
    torso.add(chestCore);

    // Lab coat back & left/right open front panels (reveals scrubs + necktie silhouette)
    const coatBack = new THREE.Mesh(new THREE.CylinderGeometry(0.175, 0.15, 0.45, 16, 1, false, Math.PI * 0.65, Math.PI * 1.7), matCoat);
    coatBack.scale.set(1.16, 1.0, 0.72);
    coatBack.position.y = 0.225;
    torso.add(coatBack);

    [-1, 1].forEach((side) => {
      const frontPanel = new THREE.Mesh(new THREE.BoxGeometry(0.115, 0.43, 0.05), matCoat);
      frontPanel.position.set(side * 0.102, 0.215, 0.096);
      frontPanel.rotation.y = side * -0.18;
      torso.add(frontPanel);

      const lapel = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.20, 0.018), matCoat);
      lapel.position.set(side * 0.068, 0.34, 0.122);
      lapel.rotation.z = side * -0.22;
      lapel.rotation.y = side * -0.14;
      torso.add(lapel);
    });

    // Lower coat skirt tails draping softly over seated hips
    [-0.145, 0.145].forEach((cx) => {
      const coatFlap = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.17, 0.22), matCoat);
      coatFlap.position.set(cx, -0.01, 0.03);
      coatFlap.rotation.z = cx < 0 ? 0.14 : -0.14;
      torso.add(coatFlap);
    });

    // Chest pocket ID badge
    const badge = new THREE.Mesh(
      new THREE.BoxGeometry(0.048, 0.064, 0.01),
      new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.4 })
    );
    badge.position.set(0.105, 0.30, 0.128);
    torso.add(badge);
    const badgeBar = new THREE.Mesh(new THREE.BoxGeometry(0.042, 0.014, 0.012), matSteth);
    badgeBar.position.set(0.105, 0.32, 0.129);
    torso.add(badgeBar);

    const shoulders = new THREE.Mesh(new THREE.SphereGeometry(0.175, 16, 10), matCoat);
    shoulders.scale.set(1.26, 0.34, 0.62);
    shoulders.position.y = 0.415;
    torso.add(shoulders);

    // Doctor stethoscope around neck + chrome diaphragm resting on right chest
    const stethLoop = new THREE.Mesh(new THREE.TorusGeometry(0.102, 0.011, 8, 22, Math.PI * 1.38), matSteth);
    stethLoop.rotation.x = Math.PI * 0.40;
    stethLoop.rotation.z = -Math.PI * 0.19;
    stethLoop.position.set(0, 0.435, 0.02);
    torso.add(stethLoop);

    const stethChestpiece = new THREE.Mesh(
      new THREE.CylinderGeometry(0.022, 0.022, 0.012, 14),
      new THREE.MeshStandardMaterial({ color: 0xcbd5e1, metalness: 0.85, roughness: 0.2 })
    );
    stethChestpiece.rotation.x = Math.PI * 0.5;
    stethChestpiece.position.set(-0.072, 0.24, 0.128);
    torso.add(stethChestpiece);

    // Realistic Adult Male Head & Face Proportions (not a toy sphere!)
    const headPivot = new THREE.Group();
    headPivot.position.set(0, 0.46, 0.01);
    torso.add(headPivot);

    const neckMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.044, 0.052, 0.095, 12), matSkin);
    neckMesh.position.y = 0.045;
    headPivot.add(neckMesh);

    const head = new THREE.Group();
    head.position.y = 0.165;
    headPivot.add(head);

    // Elongated adult cranium + sculpted jawline + ears + nose
    const cranium = new THREE.Mesh(new THREE.SphereGeometry(0.105, 18, 14), matSkin);
    cranium.scale.set(0.86, 1.04, 0.96);
    head.add(cranium);

    const jaw = new THREE.Mesh(new THREE.BoxGeometry(0.108, 0.075, 0.105), matSkin);
    jaw.position.set(0, -0.052, 0.018);
    head.add(jaw);

    const chin = new THREE.Mesh(new THREE.SphereGeometry(0.044, 12, 10), matSkin);
    chin.scale.set(1.05, 0.72, 0.95);
    chin.position.set(0, -0.082, 0.045);
    head.add(chin);

    const nose = new THREE.Mesh(new THREE.BoxGeometry(0.022, 0.044, 0.036), matSkin);
    nose.position.set(0, -0.012, 0.098);
    nose.rotation.x = -0.22;
    head.add(nose);

    [-0.088, 0.088].forEach((ex) => {
      const ear = new THREE.Mesh(new THREE.SphereGeometry(0.022, 10, 8), matSkin);
      ear.scale.set(0.45, 1.1, 0.72);
      ear.position.set(ex, -0.01, -0.008);
      head.add(ear);
    });

    // Dark eyes + animated eyebrows (furrowed when stressed!)
    const matEyeDark = new THREE.MeshBasicMaterial({ color: 0x0f172a });
    [-0.033, 0.033].forEach((ex) => {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.011, 8, 8), matEyeDark);
      eye.position.set(ex, 0.008, 0.092);
      head.add(eye);
    });

    const browL = new THREE.Mesh(new THREE.BoxGeometry(0.032, 0.008, 0.012), matHair);
    browL.position.set(-0.034, 0.028, 0.096);
    const browR = new THREE.Mesh(new THREE.BoxGeometry(0.032, 0.008, 0.012), matHair);
    browR.position.set(0.034, 0.028, 0.096);
    head.add(browL, browR);

    // Mouth line
    const mouth = new THREE.Mesh(
      new THREE.BoxGeometry(0.042, 0.006, 0.01),
      new THREE.MeshBasicMaterial({ color: 0x8b4d3e })
    );
    mouth.position.set(0, -0.056, 0.076);
    head.add(mouth);

    // Tailored men's short haircut (side taper + swept crown, no bowl mushroom!)
    const hairTop = new THREE.Mesh(
      new THREE.SphereGeometry(0.109, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.50),
      matHair
    );
    hairTop.scale.set(0.88, 0.92, 1.0);
    hairTop.rotation.x = -0.26;
    hairTop.position.set(0, 0.026, -0.012);
    head.add(hairTop);

    const hairBack = new THREE.Mesh(new THREE.CylinderGeometry(0.088, 0.072, 0.11, 12, 1, false, Math.PI * 0.55, Math.PI * 0.9), matHair);
    hairBack.position.set(0, -0.005, -0.022);
    head.add(hairBack);

    const hairFrontQuiff = new THREE.Mesh(new THREE.BoxGeometry(0.115, 0.034, 0.068), matHair);
    hairFrontQuiff.position.set(0.01, 0.088, 0.032);
    hairFrontQuiff.rotation.set(0.28, -0.1, -0.08);
    head.add(hairFrontQuiff);

    // Sleek dark-titanium rectangular eyeglasses (no bright toy rings!)
    const matGlassesFrame = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.78, roughness: 0.25 });
    [-0.035, 0.035].forEach((gx) => {
      const lensRim = new THREE.Mesh(new THREE.BoxGeometry(0.048, 0.028, 0.006), matGlassesFrame);
      lensRim.position.set(gx, 0.008, 0.102);
      // Hollow look via slim blue-tinted glass inset
      const glassPane = new THREE.Mesh(
        new THREE.PlaneGeometry(0.042, 0.022),
        new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.22 })
      );
      glassPane.position.z = 0.004;
      lensRim.add(glassPane);
      head.add(lensRim);

      const templeArm = new THREE.Mesh(new THREE.BoxGeometry(0.004, 0.005, 0.10), matGlassesFrame);
      templeArm.position.set(gx + (gx < 0 ? -0.025 : 0.025), 0.01, 0.052);
      head.add(templeArm);
    });
    const bridge = new THREE.Mesh(new THREE.BoxGeometry(0.022, 0.005, 0.006), matGlassesFrame);
    bridge.position.set(0, 0.011, 0.102);
    head.add(bridge);

    // Articulated Doctor Arms with Slim Tapered Sleeves, Wrists, Palms & Fingers
    function createDoctorArm(xSign) {
      const sh = new THREE.Group();
      sh.position.set(xSign * 0.205, 0.405, 0.01);
      torso.add(sh);

      const shJoint = new THREE.Mesh(new THREE.SphereGeometry(0.045, 12, 10), matCoat);
      sh.add(shJoint);
      createLimb(sh, 0.044, 0.036, 0.23, matCoat);

      const el = new THREE.Group();
      el.position.set(0, -0.23, 0);
      sh.add(el);
      createLimb(el, 0.036, 0.031, 0.20, matCoat);

      // Coat sleeve cuff & flesh wrist
      const cuff = new THREE.Mesh(new THREE.CylinderGeometry(0.034, 0.035, 0.025, 10), matCoat);
      cuff.position.y = -0.19;
      el.add(cuff);

      const wrist = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.021, 0.03, 10), matSkin);
      wrist.position.y = -0.21;
      el.add(wrist);

      // Sculpted human hand (palm + grouped fingers + thumb)
      const hand = new THREE.Group();
      hand.position.y = -0.228;
      el.add(hand);

      const palm = new THREE.Mesh(new THREE.BoxGeometry(0.052, 0.054, 0.022), matSkin);
      palm.position.y = -0.024;
      hand.add(palm);

      const fingers = new THREE.Mesh(new THREE.BoxGeometry(0.048, 0.046, 0.018), matSkin);
      fingers.position.set(0, -0.062, 0.006);
      fingers.rotation.x = 0.35;
      hand.add(fingers);

      const thumb = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.036, 0.018), matSkin);
      thumb.position.set(xSign * -0.032, -0.026, 0.014);
      thumb.rotation.z = xSign * 0.45;
      hand.add(thumb);

      return { sh, el, hand };
    }

    const leftArm = createDoctorArm(-1);
    const rightArm = createDoctorArm(1);

    // Active Paper Prop (starts on desk -> grabs -> crumples -> thrown as Shooting Star)
    const activeSheet = new THREE.Mesh(new THREE.PlaneGeometry(0.24, 0.30), matPaper);
    activeSheet.rotation.x = -Math.PI * 0.5;
    activeSheet.position.set(0.04, deskY + 0.036, 0.14);
    station.add(activeSheet);

    const matCrumple = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      emissive: 0x38bdf8,
      emissiveIntensity: 0.2,
      roughness: 0.45,
      flatShading: true,
    });
    const handCrumple = new THREE.Mesh(createCrumpledPaperGeo(0.088), matCrumple);
    handCrumple.visible = false;
    station.add(handCrumple);

    return {
      station,
      doctor,
      torso,
      headPivot,
      browL,
      browR,
      leftArm,
      rightArm,
      activeSheet,
      handCrumple,
      deskY,
      deskWarmLight,
    };
  }

  function buildShootingStar(scene) {
    const starGroup = new THREE.Group();
    starGroup.visible = false;

    const coreGeo = createCrumpledPaperGeo(0.105);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 1,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    starGroup.add(coreMesh);

    const glowTex = makeGlowTexture('rgba(255,255,255,1)', 'rgba(56,189,248,0.68)');
    const spriteMat = new THREE.SpriteMaterial({
      map: glowTex,
      color: 0xe0f2fe,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const glowSprite = new THREE.Sprite(spriteMat);
    glowSprite.scale.set(0.95, 0.95, 1);
    starGroup.add(glowSprite);

    const TRAIL_COUNT = 78;
    const trailPos = new Float32Array(TRAIL_COUNT * 3);
    const trailCol = new Float32Array(TRAIL_COUNT * 3);
    const trailGeo = new THREE.BufferGeometry();
    trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPos, 3));
    trailGeo.setAttribute('color', new THREE.BufferAttribute(trailCol, 3));

    const trailMat = new THREE.PointsMaterial({
      size: 0.14,
      map: glowTex,
      vertexColors: true,
      transparent: true,
      opacity: 0.92,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const trailPoints = new THREE.Points(trailGeo, trailMat);
    trailPoints.visible = false;

    scene.add(starGroup, trailPoints);

    return {
      starGroup,
      coreMesh,
      glowSprite,
      trailPoints,
      trailGeo,
      trailPos,
      trailCol,
      TRAIL_COUNT,
      history: [],
    };
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

  renderer.setClearColor(0x02040a, 0.94);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x03060c, 0.032);

  const camera = new THREE.PerspectiveCamera(42, 16 / 9, 0.2, 40);
  const BASE_CAM = new THREE.Vector3(0, 0.14, 3.85);
  camera.position.copy(BASE_CAM);

  // Indoor architectural ceiling + key + subtle rim lighting over obsidian cinema background
  const hemi = new THREE.HemisphereLight(0xcbd5e1, 0x111827, 0.92);
  const ceilingFill = new THREE.PointLight(0xe0f2fe, 0.95, 13, 1.35);
  ceilingFill.position.set(0.8, 3.25, -2.2);
  const key = new THREE.DirectionalLight(0xe0f2fe, 0.85);
  key.position.set(-2.2, 3.8, 3.5);
  const rim = new THREE.DirectionalLight(0x38bdf8, 0.72);
  rim.position.set(3.8, 2.0, -2.5);
  scene.add(hemi, ceilingFill, key, rim);

  const envObj = buildEnvironment(scene);
  const work = buildDoctorWorkstation();
  scene.add(work.station);
  const star = buildShootingStar(scene);

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
    star.history.length = 0;
  };

  // Sync initial frame immediately so MEDIQ globe starts hidden (reveal=0) until paper throw!
  updateStoryboard(0);
  renderer.render(scene, camera);

  function updateStoryboard(dt) {
    const prevT = simClock % LOOP_DURATION;
    simClock += dt;
    const t = simClock % LOOP_DURATION;

    if (t < prevT) {
      impactTriggeredThisLoop = false;
      star.history.length = 0;
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

    // Show MEDIQ particle globe + shower particles ONLY after the doctor throws the crumpled paper!
    let globeReveal = 0;
    if (t >= 6.20 && t < 6.80) {
      globeReveal = smoothstep((t - 6.20) / 0.60);
    } else if (t >= 6.80 && t < 12.15) {
      globeReveal = 1;
    } else if (t >= 12.15 && t < 13.18) {
      globeReveal = 1 - smoothstep((t - 12.15) / 1.03);
    }

    // Illuminate 3D wall projector screen + lock MEDIQ Particles pixel-accurately inside the black screen across VR parallax!
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

    const { torso, headPivot, browL, browR, leftArm, rightArm, activeSheet, handCrumple, deskY } = work;

    if (t < 3.4) {
      // ACT 1: Stressed in clinic office (furrowed brows, left hand held cleanly at temple, right tapping paperwork)
      const u = t / 3.4;
      const shake = Math.sin(t * 9.5) * 0.14 * smoothstep(Math.sin(u * Math.PI));
      const slump = smoothstep(u);

      torso.rotation.set(0.20 + slump * 0.12, 0, Math.sin(t * 2.2) * 0.035);
      headPivot.rotation.set(0.28 + Math.sin(t * 3.1) * 0.05, shake, Math.sin(t * 2.7) * 0.06);
      browL.rotation.z = -0.26;
      browR.rotation.z = 0.26;

      // Left arm angles outward cleanly around shoulder so hand touches left temple WITHOUT clipping chest!
      leftArm.sh.rotation.set(-1.18, 0.22, -0.58);
      leftArm.el.rotation.set(-1.42 + Math.sin(t * 4.2) * 0.06, 0, 0.48);

      const tap = Math.max(0, Math.sin(t * 11)) * 0.08;
      rightArm.sh.rotation.set(-0.74, -0.14, 0.24);
      rightArm.el.rotation.set(-0.62 - tap, 0, -0.06);

      activeSheet.visible = true;
      activeSheet.position.set(0.04, deskY + 0.036, 0.14);
      activeSheet.rotation.set(-Math.PI * 0.5, 0, Math.sin(t * 14) * 0.02);
      activeSheet.scale.set(1, 1, 1);
      handCrumple.visible = false;
      star.starGroup.visible = false;
      star.trailPoints.visible = false;
    } else if (t < 5.2) {
      // ACT 2: Angry snatch & crumple!
      const u = (t - 3.4) / 1.8;
      const grab = smoothstep(Math.min(1, u * 2.2));
      const crushJitter = u > 0.3 ? Math.sin(t * 42) * 0.045 : 0;

      torso.rotation.set(lerp(0.30, 0.16, grab), Math.sin(t * 18) * 0.04, 0);
      headPivot.rotation.set(lerp(0.30, 0.14, grab), Math.sin(t * 22) * 0.05, 0);
      browL.rotation.z = -0.34;
      browR.rotation.z = 0.34;

      leftArm.sh.rotation.set(lerp(-1.18, -1.02, grab), 0.36, lerp(-0.58, 0.26 + crushJitter, grab));
      leftArm.el.rotation.set(-0.85 + crushJitter, 0, lerp(0.48, -0.30, grab));
      rightArm.sh.rotation.set(lerp(-0.74, -1.04, grab), -0.36, -0.26 - crushJitter);
      rightArm.el.rotation.set(-0.85 - crushJitter, 0, 0.30);

      if (u < 0.34) {
        const s = 1 - (u / 0.34) * 0.68;
        activeSheet.visible = true;
        activeSheet.position.set(0.04, lerp(deskY + 0.036, deskY + 0.26, u / 0.34), lerp(0.14, 0.0, u / 0.34));
        activeSheet.scale.set(s, s, 1);
        handCrumple.visible = false;
      } else {
        activeSheet.visible = false;
        handCrumple.visible = true;
        const cPulse = 1.0 - (u - 0.34) * 0.28 + Math.sin(t * 36) * 0.06;
        handCrumple.position.set(0.04, deskY + 0.26, 0.0);
        handCrumple.scale.setScalar(cPulse);
        handCrumple.rotation.set(t * 5, t * 7, 0);
        handCrumple.material.emissiveIntensity = lerp(0.2, 1.8, (u - 0.34) / 0.66);
      }
      star.starGroup.visible = false;
      star.trailPoints.visible = false;
    } else if (t < 5.65) {
      // ACT 3A: Arm wind-up & snap throw toward upper-right!
      const u = (t - 5.2) / 0.45;
      browL.rotation.z = -0.28;
      browR.rotation.z = 0.28;
      if (u < 0.55) {
        const w = smoothstep(u / 0.55);
        torso.rotation.set(lerp(0.16, -0.14, w), lerp(0, -0.42, w), 0);
        headPivot.rotation.set(0.04, 0.26 * w, 0);
        leftArm.sh.rotation.set(-0.52, 0.15, -0.24);
        leftArm.el.rotation.set(-0.48, 0, 0);
        rightArm.sh.rotation.set(lerp(-1.04, -2.55, w), -0.35, 0.45 * w);
        rightArm.el.rotation.set(lerp(-0.85, -0.25, w), 0, 0);
      } else {
        const r = smoothstep((u - 0.55) / 0.45);
        torso.rotation.set(lerp(-0.14, 0.18, r), lerp(-0.42, 0.36, r), 0);
        headPivot.rotation.set(lerp(0.04, -0.22, r), lerp(0.26, -0.22, r), 0);
        rightArm.sh.rotation.set(lerp(-2.55, -1.15, r), -0.2, 0.28);
        rightArm.el.rotation.set(lerp(-0.25, -0.08, r), 0, 0);
      }
      work.station.updateMatrixWorld(true);
      rightArm.hand.getWorldPosition(handWorld);
      handCrumple.visible = u < 0.88;
      if (handCrumple.visible) {
        const loc = work.station.worldToLocal(handWorld.clone());
        handCrumple.position.copy(loc);
        handCrumple.material.emissiveIntensity = 2.4;
      }
      star.starGroup.visible = false;
      star.trailPoints.visible = false;
    } else if (t < 7.15) {
      // ACT 3B + 4: Crumpled paper blasts diagonally up-right -> hits MEDIQ globe!
      const flightU = clamp((t - 5.62) / 1.48, 0, 1);
      const easeU = flightU < 0.5 ? 2 * flightU * flightU : 1 - Math.pow(-2 * flightU + 2, 2) / 2;

      handCrumple.visible = false;
      activeSheet.visible = false;

      const watchRelax = smoothstep(Math.min(1, flightU * 2));
      torso.rotation.set(lerp(0.18, -0.06, watchRelax), lerp(0.36, 0.12, watchRelax), 0);
      headPivot.rotation.set(lerp(-0.22, -0.32, watchRelax), lerp(-0.22, -0.14, watchRelax), 0);
      browL.rotation.z = lerp(-0.28, 0.06, watchRelax);
      browR.rotation.z = lerp(0.28, -0.06, watchRelax);
      rightArm.sh.rotation.set(lerp(-1.15, -0.35, watchRelax), -0.1, 0.16);
      rightArm.el.rotation.set(lerp(-0.08, -0.82, watchRelax), 0, 0);
      leftArm.sh.rotation.set(-0.45, 0.1, -0.18);
      leftArm.el.rotation.set(-0.65, 0, 0);

      work.station.updateMatrixWorld(true);
      rightArm.hand.getWorldPosition(tmpStart);
      if (flightU > 0.05) {
        tmpStart.set(work.station.position.x + 0.24, work.station.position.y + 1.32, work.station.position.z + 0.16);
      }
      const targetWorld = getGlobeWorldTarget();
      tmpCtrl.set(
        (tmpStart.x + targetWorld.x) * 0.5 - 0.35,
        Math.max(tmpStart.y, targetWorld.y) + 0.75,
        (tmpStart.z + targetWorld.z) * 0.5 + 0.35
      );

      const inv = 1 - easeU;
      const sx = inv * inv * tmpStart.x + 2 * inv * easeU * tmpCtrl.x + easeU * easeU * targetWorld.x;
      const sy = inv * inv * tmpStart.y + 2 * inv * easeU * tmpCtrl.y + easeU * easeU * targetWorld.y;
      const sz = inv * inv * tmpStart.z + 2 * inv * easeU * tmpCtrl.z + easeU * easeU * targetWorld.z;

      star.starGroup.visible = true;
      star.starGroup.position.set(sx, sy, sz);
      star.coreMesh.rotation.set(simClock * 11, simClock * 14, simClock * 7);
      const flare = 0.85 + Math.sin(simClock * 28) * 0.2 + (1 - flightU) * 0.15;
      star.glowSprite.scale.set(1.05 * flare, 1.05 * flare, 1);

      star.history.unshift({ x: sx, y: sy, z: sz });
      if (star.history.length > star.TRAIL_COUNT) star.history.pop();
      star.trailPoints.visible = true;

      for (let i = 0; i < star.TRAIL_COUNT; i++) {
        const pt = star.history[Math.min(i, star.history.length - 1)] || { x: sx, y: sy, z: sz };
        const age = i / star.TRAIL_COUNT;
        const j = Math.sin(i * 1.9 + simClock * 18) * 0.03 * age;
        star.trailPos[i * 3] = pt.x + j;
        star.trailPos[i * 3 + 1] = pt.y + Math.cos(i * 2.3) * 0.025 * age;
        star.trailPos[i * 3 + 2] = pt.z;

        const fade = Math.pow(1 - age, 1.6);
        star.trailCol[i * 3] = lerp(0.45, 1.0, fade);
        star.trailCol[i * 3 + 1] = lerp(0.75, 0.98, fade);
        star.trailCol[i * 3 + 2] = 1.0;
      }
      star.trailGeo.attributes.position.needsUpdate = true;
      star.trailGeo.attributes.color.needsUpdate = true;

      if (flightU >= 0.56 && !impactTriggeredThisLoop) {
        impactTriggeredThisLoop = true;
        if (typeof window.__fndOnStarImpact === 'function') {
          window.__fndOnStarImpact(1.0);
        }
      }
    } else {
      // ACT 5: Calm relief in office -> graceful reset
      const u = (t - 7.15) / (LOOP_DURATION - 7.15);
      star.starGroup.visible = false;
      star.trailPoints.visible = false;

      if (u < 0.72) {
        const breathe = Math.sin(t * 2.2) * 0.035;
        torso.rotation.set(-0.04 + breathe, 0.05, 0);
        headPivot.rotation.set(lerp(-0.26, 0.08, smoothstep(u / 0.72)), lerp(-0.14, 0, smoothstep(u / 0.72)), 0);
        browL.rotation.z = 0.04;
        browR.rotation.z = -0.04;
        leftArm.sh.rotation.set(-0.42, 0.12, -0.18);
        leftArm.el.rotation.set(-0.72, 0, 0);
        rightArm.sh.rotation.set(-0.42, -0.12, 0.18);
        rightArm.el.rotation.set(-0.72, 0, 0);
        activeSheet.visible = false;
      } else {
        const fadeIn = smoothstep((u - 0.72) / 0.28);
        torso.rotation.set(lerp(-0.02, 0.20, fadeIn), 0, 0);
        headPivot.rotation.set(lerp(0.08, 0.28, fadeIn), 0, 0);
        browL.rotation.z = lerp(0.04, -0.26, fadeIn);
        browR.rotation.z = lerp(-0.04, 0.26, fadeIn);
        leftArm.sh.rotation.set(lerp(-0.42, -1.18, fadeIn), lerp(0.12, 0.22, fadeIn), lerp(-0.18, -0.58, fadeIn));
        leftArm.el.rotation.set(lerp(-0.72, -1.42, fadeIn), 0, lerp(0, 0.48, fadeIn));
        rightArm.sh.rotation.set(lerp(-0.42, -0.74, fadeIn), -0.14, 0.22);
        rightArm.el.rotation.set(-0.62, 0, -0.06);
        activeSheet.visible = true;
        activeSheet.position.set(0.04, deskY + 0.036, 0.14);
        activeSheet.scale.set(fadeIn, fadeIn, 1);
      }
    }
  }

  function loop(ts) {
    requestAnimationFrame(loop);
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
