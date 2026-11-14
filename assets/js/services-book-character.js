(function () {
  'use strict';

  const SLIDE_ID = 'srv-book-carousel-slide';
  const CANVAS_ID = 'srv-book-guide-canvas';
  const FOV_DEG = 32;
  const FOV_TAN = Math.tan((FOV_DEG * Math.PI) / 360);

  function clamp(v, lo, hi) {
    return Math.max(lo, Math.min(hi, v));
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function lerpAngle(a, b, t) {
    let diff = ((b - a + Math.PI) % (Math.PI * 2)) - Math.PI;
    if (diff < -Math.PI) diff += Math.PI * 2;
    return a + diff * t;
  }

  function smoothstep(t) {
    const x = clamp(t, 0, 1);
    return x * x * (3 - 2 * x);
  }

  function makeRadialShadowTexture() {
    const c = document.createElement('canvas');
    c.width = 64;
    c.height = 64;
    const ctx = c.getContext('2d');
    const g = ctx.createRadialGradient(32, 32, 2, 32, 32, 30);
    g.addColorStop(0, 'rgba(3, 10, 26, 0.56)');
    g.addColorStop(0.55, 'rgba(5, 16, 40, 0.24)');
    g.addColorStop(1, 'rgba(5, 16, 40, 0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 64);
    const tex = new THREE.CanvasTexture(c);
    tex.needsUpdate = true;
    return tex;
  }

  function addCylinderLimb(parent, rTop, rBot, length, mat) {
    const geom = new THREE.CylinderGeometry(rTop, rBot, length, 14);
    const mesh = new THREE.Mesh(geom, mat);
    mesh.position.y = -length * 0.5;
    parent.add(mesh);
    const cap = new THREE.Mesh(new THREE.SphereGeometry(rBot * 0.98, 12, 10), mat);
    cap.position.y = -length;
    parent.add(cap);
    return mesh;
  }

  function buildExplorerRig() {
    const root = new THREE.Group();
    const scaleWrap = new THREE.Group();
    root.add(scaleWrap);

    // Clinical Navy / White / Glowing Cyan Palette
    const matSkin = new THREE.MeshStandardMaterial({
      color: 0xffd7ba,
      roughness: 0.62,
      metalness: 0.02,
      emissive: 0x3b1f12,
      emissiveIntensity: 0.08,
    });
    const matHair = new THREE.MeshStandardMaterial({
      color: 0x0b162d,
      roughness: 0.58,
      metalness: 0.1,
    });
    const matJacket = new THREE.MeshStandardMaterial({
      color: 0x102c5c,
      roughness: 0.42,
      metalness: 0.18,
      emissive: 0x0a1c3f,
      emissiveIntensity: 0.25,
    });
    const matPants = new THREE.MeshStandardMaterial({
      color: 0x0b1d40,
      roughness: 0.52,
      metalness: 0.14,
    });
    const matShirt = new THREE.MeshStandardMaterial({
      color: 0xf4f8ff,
      roughness: 0.46,
      metalness: 0.05,
      emissive: 0xdbeafe,
      emissiveIntensity: 0.12,
    });
    const matShoe = new THREE.MeshStandardMaterial({
      color: 0xeef5ff,
      roughness: 0.35,
      metalness: 0.15,
    });
    const matCyan = new THREE.MeshStandardMaterial({
      color: 0x72c5f8,
      emissive: 0x3aa0db,
      emissiveIntensity: 0.85,
      roughness: 0.2,
      metalness: 0.25,
    });
    const matEye = new THREE.MeshBasicMaterial({ color: 0x071329 });
    const matEyeGlint = new THREE.MeshBasicMaterial({ color: 0xffffff });

    // Ground origin: y = 0 at shoe soles; total height ~ 1.0 unit
    const pelvis = new THREE.Group();
    pelvis.position.set(0, 0.43, 0);
    scaleWrap.add(pelvis);

    const hipMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.112, 0.105, 0.1, 16), matPants);
    pelvis.add(hipMesh);

    const beltMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.116, 0.116, 0.028, 16), matHair);
    beltMesh.position.y = 0.045;
    pelvis.add(beltMesh);

    const buckleMesh = new THREE.Mesh(new THREE.BoxGeometry(0.052, 0.03, 0.025), matCyan);
    buckleMesh.position.set(0, 0.045, 0.112);
    pelvis.add(buckleMesh);

    function createLeg(xSign) {
      const hipPivot = new THREE.Group();
      hipPivot.position.set(xSign * 0.062, -0.02, 0);
      pelvis.add(hipPivot);

      const thighJoint = new THREE.Mesh(new THREE.SphereGeometry(0.046, 12, 10), matPants);
      hipPivot.add(thighJoint);
      addCylinderLimb(hipPivot, 0.045, 0.038, 0.19, matPants);

      const kneePivot = new THREE.Group();
      kneePivot.position.set(0, -0.19, 0);
      hipPivot.add(kneePivot);
      addCylinderLimb(kneePivot, 0.038, 0.032, 0.18, matPants);

      const anklePivot = new THREE.Group();
      anklePivot.position.set(0, -0.18, 0);
      kneePivot.add(anklePivot);

      const shoeBase = new THREE.Mesh(new THREE.BoxGeometry(0.072, 0.042, 0.132), matShoe);
      shoeBase.position.set(0, -0.022, 0.026);
      anklePivot.add(shoeBase);

      const shoeToe = new THREE.Mesh(new THREE.SphereGeometry(0.037, 12, 10), matShoe);
      shoeToe.scale.set(1, 0.6, 1.05);
      shoeToe.position.set(0, -0.022, 0.088);
      anklePivot.add(shoeToe);

      const soleTrim = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.012, 0.142), matCyan);
      soleTrim.position.set(0, -0.039, 0.028);
      anklePivot.add(soleTrim);

      return { hipPivot, kneePivot, anklePivot };
    }

    const leftLeg = createLeg(-1);
    const rightLeg = createLeg(1);

    // Torso
    const torsoPivot = new THREE.Group();
    torsoPivot.position.set(0, 0.06, 0);
    pelvis.add(torsoPivot);

    const chest = new THREE.Mesh(new THREE.CylinderGeometry(0.132, 0.108, 0.25, 18), matJacket);
    chest.position.y = 0.125;
    torsoPivot.add(chest);

    const shoulderBar = new THREE.Mesh(new THREE.SphereGeometry(0.132, 16, 12), matJacket);
    shoulderBar.scale.set(1.16, 0.42, 0.68);
    shoulderBar.position.y = 0.235;
    torsoPivot.add(shoulderBar);

    const shirtV = new THREE.Mesh(new THREE.BoxGeometry(0.084, 0.21, 0.045), matShirt);
    shirtV.position.set(0, 0.145, 0.106);
    torsoPivot.add(shirtV);

    const tie = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.02, 0.14, 8), matCyan);
    tie.position.set(0, 0.138, 0.128);
    torsoPivot.add(tie);

    const chestBadge = new THREE.Mesh(new THREE.SphereGeometry(0.022, 10, 8), matCyan);
    chestBadge.scale.set(1, 1, 0.45);
    chestBadge.position.set(-0.074, 0.175, 0.118);
    torsoPivot.add(chestBadge);

    // Head
    const neckPivot = new THREE.Group();
    neckPivot.position.set(0, 0.272, 0);
    torsoPivot.add(neckPivot);

    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.046, 0.06, 12), matSkin);
    neck.position.y = 0.022;
    neckPivot.add(neck);

    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0.128, 0.008);
    neckPivot.add(headGroup);

    const skull = new THREE.Mesh(new THREE.SphereGeometry(0.118, 22, 18), matSkin);
    skull.scale.set(0.96, 1.04, 0.98);
    headGroup.add(skull);

    // Hair cap + stylized front sweep
    const hairTop = new THREE.Mesh(
      new THREE.SphereGeometry(0.123, 20, 14, 0, Math.PI * 2, 0, Math.PI * 0.58),
      matHair
    );
    hairTop.rotation.x = -0.22;
    hairTop.position.set(0, 0.014, -0.01);
    headGroup.add(hairTop);

    const hairSweep = new THREE.Mesh(new THREE.SphereGeometry(0.068, 14, 10), matHair);
    hairSweep.scale.set(1.25, 0.56, 0.85);
    hairSweep.position.set(0.018, 0.095, 0.064);
    hairSweep.rotation.z = -0.18;
    headGroup.add(hairSweep);

    // Expressive eyes
    [-1, 1].forEach((side) => {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.017, 10, 8), matEye);
      eye.scale.set(0.95, 1.18, 0.6);
      eye.position.set(side * 0.044, 0.008, 0.106);
      headGroup.add(eye);

      const glint = new THREE.Mesh(new THREE.SphereGeometry(0.006, 8, 6), matEyeGlint);
      glint.position.set(side * 0.047, 0.014, 0.114);
      headGroup.add(glint);
    });

    // Nose hint
    const nose = new THREE.Mesh(new THREE.SphereGeometry(0.014, 8, 8), matSkin);
    nose.position.set(0, -0.014, 0.118);
    headGroup.add(nose);

    function createArm(xSign, withPointer) {
      const shoulderPivot = new THREE.Group();
      shoulderPivot.position.set(xSign * 0.162, 0.226, 0);
      torsoPivot.add(shoulderPivot);

      const cap = new THREE.Mesh(new THREE.SphereGeometry(0.042, 12, 10), matJacket);
      shoulderPivot.add(cap);
      addCylinderLimb(shoulderPivot, 0.038, 0.033, 0.145, matJacket);

      const elbowPivot = new THREE.Group();
      elbowPivot.position.set(0, -0.145, 0);
      shoulderPivot.add(elbowPivot);
      addCylinderLimb(elbowPivot, 0.032, 0.026, 0.135, matJacket);

      const cuff = new THREE.Mesh(new THREE.CylinderGeometry(0.029, 0.029, 0.02, 12), matShirt);
      cuff.position.y = -0.125;
      elbowPivot.add(cuff);

      const hand = new THREE.Mesh(new THREE.SphereGeometry(0.031, 12, 10), matSkin);
      hand.position.y = -0.152;
      elbowPivot.add(hand);

      let pointerBaton = null;
      if (withPointer) {
        pointerBaton = new THREE.Group();
        pointerBaton.position.set(0, -0.158, 0.022);
        const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.009, 0.14, 8), matShirt);
        shaft.rotation.x = Math.PI * 0.42;
        shaft.position.set(0, -0.01, 0.065);
        const tip = new THREE.Mesh(new THREE.OctahedronGeometry(0.022, 0), matCyan);
        tip.position.set(0, -0.026, 0.136);
        pointerBaton.add(shaft, tip);
        pointerBaton.visible = false;
        elbowPivot.add(pointerBaton);
      }

      return { shoulderPivot, elbowPivot, hand, pointerBaton };
    }

    const leftArm = createArm(-1, false);
    const rightArm = createArm(1, true);

    return {
      root,
      scaleWrap,
      pelvis,
      torsoPivot,
      neckPivot,
      headGroup,
      leftLeg,
      rightLeg,
      leftArm,
      rightArm,
    };
  }

  function createExplorerController() {
    const slide = document.getElementById(SLIDE_ID);
    const canvas = document.getElementById(CANVAS_ID);
    if (!slide || !canvas || typeof THREE === 'undefined') return null;

    let renderer = null;
    let scene = null;
    let camera = null;
    let rig = null;
    let shadowMesh = null;
    let rippleMesh = null;
    let sparks = [];

    let width = 1280;
    let height = 720;
    let active = false;
    let initialized = false;
    let lastTime = 0;

    // Screen-relative pointer state (relative to slide top-left)
    const pointer = {
      x: 640,
      y: 360,
      clientX: 640,
      clientY: 360,
      inside: false,
      lastMoveAt: 0,
      hoveredBookIdx: -1,
    };

    // World/Pixel simulation state (origin at slide center, +Y up, +Z toward viewer)
    const sim = {
      x: 0,
      y: -120,
      z: 10,
      vx: 0,
      vy: 0,
      targetX: 0,
      targetY: -120,
      targetZ: 10,
      facingYaw: 0,
      headYaw: 0,
      headPitch: 0,
      scalePx: 66,
      mode: 'closed', // 'closed' | 'open'
      currentBookIdx: 0,
      lastOpenedIdx: -1,
      inJump: false,
      jumpElapsed: 0,
      jumpDuration: 0.48,
      jumpStartX: 0,
      jumpStartY: -120,
      jumpStartZ: 10,
      jumpArcH: 72,
      squash: 1,
      squashVel: 0,
      walkCycle: 0,
      idleTime: 0,
      autoHopTimer: 2.2,
      waveTimer: 0,
      rippleAlpha: 0,
      rippleScale: 0.4,
      pointing: 0,
      lastSide: 0, // -1 left page, 1 right page
      placedInitially: false,
    };

    function ensureInit() {
      if (initialized) return true;
      try {
        renderer = new THREE.WebGLRenderer({
          canvas,
          alpha: true,
          antialias: true,
          powerPreference: 'high-performance',
        });
      } catch (err) {
        return false;
      }
      renderer.setClearColor(0x000000, 0);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(FOV_DEG, 1, 20, 4500);

      const hemi = new THREE.HemisphereLight(0xeef6ff, 0x091b3a, 1.35);
      const key = new THREE.DirectionalLight(0xffffff, 1.15);
      key.position.set(160, 280, 340);
      const rim = new THREE.DirectionalLight(0x72c5f8, 0.95);
      rim.position.set(-220, 120, -140);
      scene.add(hemi, key, rim);

      rig = buildExplorerRig();
      scene.add(rig.root);

      const shadowTex = makeRadialShadowTexture();
      shadowMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(1, 1),
        new THREE.MeshBasicMaterial({
          map: shadowTex,
          transparent: true,
          opacity: 0.65,
          depthWrite: false,
        })
      );
      shadowMesh.rotation.x = -Math.PI * 0.42;
      scene.add(shadowMesh);

      rippleMesh = new THREE.Mesh(
        new THREE.RingGeometry(0.16, 0.24, 28),
        new THREE.MeshBasicMaterial({
          color: 0x72c5f8,
          transparent: true,
          opacity: 0,
          side: THREE.DoubleSide,
          depthWrite: false,
        })
      );
      rippleMesh.rotation.x = -Math.PI * 0.42;
      scene.add(rippleMesh);

      const sparkGeom = new THREE.SphereGeometry(2.2, 8, 6);
      for (let i = 0; i < 6; i++) {
        const sMat = new THREE.MeshBasicMaterial({
          color: i % 2 === 0 ? 0x72c5f8 : 0xe0f2fe,
          transparent: true,
          opacity: 0,
          depthWrite: false,
        });
        const m = new THREE.Mesh(sparkGeom, sMat);
        scene.add(m);
        sparks.push({ mesh: m, vx: 0, vy: 0, vz: 0, life: 0, maxLife: 0.4 });
      }

      initialized = true;
      resize();
      return true;
    }

    function resize() {
      if (!initialized || !renderer || !camera) return;
      const rect = slide.getBoundingClientRect();
      width = rect.width > 120 ? rect.width : window.innerWidth;
      height = rect.height > 120 ? rect.height : Math.max(420, window.innerHeight - 122);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.position.set(0, 0, (height * 0.5) / FOV_TAN);
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();
    }

    function domToWorld(clientX, clientY, slideRect) {
      const lx = clientX - slideRect.left;
      const ly = clientY - slideRect.top;
      return {
        wx: lx - slideRect.width * 0.5,
        wy: slideRect.height * 0.5 - ly,
        lx,
        ly,
      };
    }

    function triggerLandingFx(wx, wy, wz) {
      sim.squash = 0.78;
      sim.squashVel = 0;
      sim.rippleAlpha = 0.85;
      sim.rippleScale = 0.35;
      if (rippleMesh) {
        rippleMesh.position.set(wx, wy + 1, wz + 2);
      }
      for (let i = 0; i < sparks.length; i++) {
        const sp = sparks[i];
        const a = (i / sparks.length) * Math.PI * 2 + Math.random() * 0.4;
        const speed = 42 + Math.random() * 38;
        sp.mesh.position.set(wx, wy + 2, wz);
        sp.vx = Math.cos(a) * speed;
        sp.vy = 45 + Math.random() * 48;
        sp.vz = Math.sin(a) * 20;
        sp.life = 0.36 + Math.random() * 0.14;
        sp.maxLife = sp.life;
      }
    }

    function startJump(destX, destY, destZ, arcExtra, customDuration) {
      const dx = destX - sim.x;
      const dy = destY - sim.y;
      const dist = Math.hypot(dx, dy);
      sim.inJump = true;
      sim.jumpElapsed = 0;
      sim.jumpStartX = sim.x;
      sim.jumpStartY = sim.y;
      sim.jumpStartZ = sim.z;
      sim.targetX = destX;
      sim.targetY = destY;
      sim.targetZ = destZ;
      sim.jumpArcH = clamp((arcExtra || 52) + dist * 0.19, 38, 155);
      sim.jumpDuration = customDuration || clamp(0.36 + dist * 0.00058, 0.36, 0.62);
      sim.squash = 0.84;
    }

    function collectClosedTargets(slideRect, frameData) {
      const targets = [];
      const partsList = frameData.bookDomParts || [];
      const wrappers = frameData.wrappers || [];
      const openW = frameData.openW || 284;

      for (let i = 0; i < wrappers.length; i++) {
        const p = partsList[i];
        const bookEl = (p && p.book) || wrappers[i];
        if (!bookEl) continue;
        const bRect = bookEl.getBoundingClientRect();
        if (
          bRect.width < 10 ||
          bRect.height < 20 ||
          bRect.right < slideRect.left + 12 ||
          bRect.left > slideRect.right - 12
        ) {
          continue;
        }

        let topCenterX = bRect.left + bRect.width * 0.5;
        let topSurfaceY = bRect.top + 3;
        let spanHalf = Math.max(8, bRect.width * 0.32);

        if (p && p.pagesTop) {
          const tRect = p.pagesTop.getBoundingClientRect();
          if (tRect.width >= 8) {
            topCenterX = tRect.left + tRect.width * 0.5;
            topSurfaceY = bRect.top + Math.min(8, Math.max(2, tRect.height * 0.38));
            spanHalf = Math.max(10, tRect.width * 0.34);
          }
        }

        const wPos = domToWorld(topCenterX, topSurfaceY, slideRect);
        const diff = Math.abs(i - frameData.current);
        const scalePx = clamp(Math.round(openW * (diff < 0.55 ? 0.21 : 0.175)), 48, 76);

        targets.push({
          idx: i,
          wx: wPos.wx,
          wy: wPos.wy,
          wz: diff < 0.5 ? 28 : 8,
          rect: bRect,
          spanHalf,
          scalePx,
        });
      }
      return targets;
    }

    function computeOpenTarget(slideRect, frameData) {
      const openedIdx = frameData.opened;
      const p = (frameData.bookDomParts || [])[openedIdx];
      if (!p || !p.inside || !p.page) return null;

      const leftRect = p.inside.getBoundingClientRect();
      const rightRect = p.page.getBoundingClientRect();
      if (leftRect.width < 40 || rightRect.width < 40) return null;

      const spreadLeft = leftRect.left;
      const spreadRight = rightRect.right;
      const spreadTop = Math.min(leftRect.top, rightRect.top);
      const spreadBottom = Math.max(leftRect.bottom, rightRect.bottom);
      const spineClientX = (leftRect.right + rightRect.left) * 0.5;

      const charH = clamp(Math.round(rightRect.width * 0.145), 42, 60);
      const midY = (spreadTop + spreadBottom) * 0.5;
      let destClientX = spineClientX;
      let destClientY = spreadTop + 4;
      let wantPoint = 0;
      let lookTargetX = spineClientX;

      if (pointer.inside) {
        const cx = pointer.clientX;
        const cy = pointer.clientY;
        const inLeftPage = cx >= leftRect.left - 45 && cx <= spineClientX;
        const inRightPage = cx > spineClientX && cx <= rightRect.right + 45;

        if (cy >= spreadTop - 60 && cy <= spreadBottom + 65 && (inLeftPage || inRightPage)) {
          let matchedCard = null;
          if (inRightPage) {
            const cards = p.page.querySelectorAll('.bc-paper-card');
            for (let k = 0; k < cards.length; k++) {
              const r = cards[k].getBoundingClientRect();
              if (cx >= r.left - 16 && cx <= r.right + 32 && cy >= r.top - 14 && cy <= r.bottom + 14) {
                matchedCard = r;
                break;
              }
            }
          } else {
            const zones = p.inside.querySelectorAll(
              '.bc-spread-thumb, .bc-spread-highlights, .bc-spread-nav'
            );
            for (let k = 0; k < zones.length; k++) {
              const r = zones[k].getBoundingClientRect();
              if (cx >= r.left - 32 && cx <= r.right + 16 && cy >= r.top - 14 && cy <= r.bottom + 14) {
                matchedCard = r;
                break;
              }
            }
          }

          if (matchedCard) {
            // Stand on the outer page border aligned vertically with the hovered deliverable card
            if (inRightPage) {
              destClientX = Math.min(slideRect.right - 28, spreadRight + 22);
              destClientY = clamp(matchedCard.bottom - 6, spreadTop + 26, spreadBottom + 2);
              lookTargetX = matchedCard.left + matchedCard.width * 0.45;
            } else {
              destClientX = Math.max(slideRect.left + 28, spreadLeft - 22);
              destClientY = clamp(matchedCard.bottom - 6, spreadTop + 26, spreadBottom + 2);
              lookTargetX = matchedCard.left + matchedCard.width * 0.55;
            }
            wantPoint = 1;
          } else if (cy < midY) {
            // Walk along the crisp upper edge of the opened book following the cursor horizontally
            destClientX = clamp(cx, spreadLeft + 22, spreadRight - 22);
            destClientY = spreadTop + 3;
            lookTargetX = cx;
            wantPoint = 0.4;
          } else {
            // Patrol the outer side/bottom edge near cursor without overlapping buttons or paragraphs
            const nearLeftEdge = cx < spreadLeft + leftRect.width * 0.3;
            const nearRightEdge = cx > spreadRight - rightRect.width * 0.3;
            if (nearLeftEdge) {
              destClientX = Math.max(slideRect.left + 28, spreadLeft - 22);
              destClientY = clamp(cy + 14, spreadTop + 32, spreadBottom + 2);
            } else if (nearRightEdge) {
              destClientX = Math.min(slideRect.right - 28, spreadRight + 22);
              destClientY = clamp(cy + 14, spreadTop + 32, spreadBottom + 2);
            } else {
              destClientX = clamp(cx, spreadLeft + 24, spreadRight - 24);
              destClientY = spreadBottom + 4;
            }
            lookTargetX = cx;
            wantPoint = 0.45;
          }
        } else {
          destClientX = clamp(cx, spreadLeft + 24, spreadRight - 24);
          destClientY = cy < midY ? spreadTop + 3 : spreadBottom + 4;
          lookTargetX = cx;
        }
      }

      const wPos = domToWorld(destClientX, destClientY, slideRect);
      const lookW = domToWorld(lookTargetX, destClientY, slideRect);
      return {
        wx: wPos.wx,
        wy: wPos.wy,
        wz: 24,
        scalePx: charH,
        wantPoint,
        side: destClientX < spineClientX ? -1 : 1,
        lookDx: lookW.wx - wPos.wx,
      };
    }

    function pickHoveredBook(targets) {
      if (!pointer.inside) return null;
      let best = null;
      let bestDist = 42;
      for (let i = 0; i < targets.length; i++) {
        const r = targets[i].rect;
        const dx =
          pointer.clientX < r.left
            ? r.left - pointer.clientX
            : pointer.clientX > r.right
            ? pointer.clientX - r.right
            : 0;
        const dy =
          pointer.clientY < r.top - 32
            ? r.top - 32 - pointer.clientY
            : pointer.clientY > r.bottom + 12
            ? pointer.clientY - (r.bottom + 12)
            : 0;
        const dist = Math.hypot(dx, dy);
        if (dist < bestDist) {
          bestDist = dist;
          best = targets[i];
        }
      }
      return best;
    }

    function updateClosedMode(dt, slideRect, frameData) {
      const targets = collectClosedTargets(slideRect, frameData);
      if (targets.length === 0) return;

      const focusIdx = Math.round(frameData.current);

      if (!sim.placedInitially) {
        const anchor = targets.find((t) => t.idx === focusIdx) || targets[0];
        sim.placedInitially = true;
        sim.currentBookIdx = anchor.idx;
        sim.scalePx = anchor.scalePx;
        sim.x = anchor.wx;
        sim.y = anchor.wy + 46;
        sim.z = anchor.wz + 8;
        startJump(anchor.wx, anchor.wy, anchor.wz, 28, 0.34);
        return;
      }

      const hovered = pickHoveredBook(targets);
      const pointerRecent = pointer.inside && performance.now() - pointer.lastMoveAt < 3400;

      if (hovered && hovered.idx !== pointer.hoveredBookIdx) {
        pointer.hoveredBookIdx = hovered.idx;
        sim.waveTimer = 0.7;
      } else if (!hovered) {
        pointer.hoveredBookIdx = -1;
      }

      // Transitioning back from open book
      if (sim.mode === 'open') {
        sim.mode = 'closed';
        const anchor = targets.find((t) => t.idx === focusIdx) || targets[0];
        sim.currentBookIdx = anchor.idx;
        sim.scalePx = anchor.scalePx;
        startJump(anchor.wx, anchor.wy, anchor.wz, 84, 0.5);
        return;
      }

      // Pick which book the character should be standing/jumping onto
      let desiredTarget = null;
      if (hovered && pointerRecent) {
        desiredTarget = hovered;
        sim.autoHopTimer = 3.2;
      } else if (pointerRecent) {
        desiredTarget = targets.find((t) => t.idx === focusIdx) || targets[0];
        sim.autoHopTimer = 3.0;
      } else {
        // Playful autonomous hops across visible books so the character plays on each book!
        sim.autoHopTimer -= dt;
        const cur = targets.find((t) => t.idx === sim.currentBookIdx);
        if (sim.autoHopTimer <= 0 && !sim.inJump && targets.length > 1) {
          sim.autoHopTimer = 2.6 + Math.random() * 1.4;
          const currentPos = targets.findIndex((t) => t.idx === sim.currentBookIdx);
          const nextPos = currentPos >= 0 ? (currentPos + 1) % targets.length : 0;
          desiredTarget = targets[nextPos];
        } else {
          desiredTarget = cur || targets.find((t) => t.idx === focusIdx) || targets[0];
        }
      }

      if (!desiredTarget) return;

      sim.scalePx = lerp(sim.scalePx, desiredTarget.scalePx, 1 - Math.exp(-8 * dt));

      // Perch slide along top edge of target book when cursor moves across that cover
      let desiredX = desiredTarget.wx;
      if (hovered && hovered.idx === desiredTarget.idx && pointer.inside) {
        const pw = domToWorld(pointer.clientX, pointer.clientY, slideRect);
        const offset = clamp(pw.wx - desiredTarget.wx, -desiredTarget.spanHalf, desiredTarget.spanHalf);
        desiredX = desiredTarget.wx + offset * 0.72;
      }

      if (desiredTarget.idx !== sim.currentBookIdx) {
        sim.currentBookIdx = desiredTarget.idx;
        startJump(desiredX, desiredTarget.wy, desiredTarget.wz, 74, 0.46);
      } else if (sim.inJump) {
        // Follow live book movement cleanly while mid-flight
        sim.targetX = desiredX;
        sim.targetY = desiredTarget.wy;
        sim.targetZ = desiredTarget.wz;
      } else {
        // Track animated carousel cover height & horizontal ledge smoothly
        sim.targetX = desiredX;
        sim.targetY = desiredTarget.wy;
        sim.targetZ = desiredTarget.wz;
        const followT = 1 - Math.exp(-11 * dt);
        sim.vx = (sim.targetX - sim.x) * 8.5;
        sim.x = lerp(sim.x, sim.targetX, followT);
        sim.y = lerp(sim.y, sim.targetY, 1 - Math.exp(-18 * dt));
        sim.z = lerp(sim.z, sim.targetZ, followT);
      }
      sim.pointing = lerp(sim.pointing, 0, 1 - Math.exp(-8 * dt));
    }

    function updateOpenMode(dt, slideRect, frameData) {
      const openTarget = computeOpenTarget(slideRect, frameData);
      if (!openTarget) return;

      sim.scalePx = lerp(sim.scalePx, openTarget.scalePx, 1 - Math.exp(-9 * dt));

      if (sim.mode === 'closed' || sim.lastOpenedIdx !== frameData.opened) {
        sim.mode = 'open';
        sim.lastOpenedIdx = frameData.opened;
        sim.lastSide = openTarget.side;
        startJump(openTarget.wx, openTarget.wy, openTarget.wz, 88, 0.52);
        return;
      }

      // Leap across center spine if user sweeps cursor rapidly from left page to right page (or far span)
      const dist = Math.hypot(openTarget.wx - sim.x, openTarget.wy - sim.y);
      const crossedSpine = sim.lastSide !== 0 && openTarget.side !== sim.lastSide && dist > 110;
      if (!sim.inJump && (crossedSpine || dist > 235)) {
        sim.lastSide = openTarget.side;
        startJump(openTarget.wx, openTarget.wy, openTarget.wz, 56, 0.42);
      } else if (sim.inJump) {
        sim.targetX = openTarget.wx;
        sim.targetY = openTarget.wy;
        sim.targetZ = openTarget.wz;
      } else {
        sim.targetX = openTarget.wx;
        sim.targetY = openTarget.wy;
        sim.targetZ = openTarget.wz;
        const speedLerp = 1 - Math.exp(-9.2 * dt);
        const nextX = lerp(sim.x, sim.targetX, speedLerp);
        const nextY = lerp(sim.y, sim.targetY, 1 - Math.exp(-12 * dt));
        sim.vx = (nextX - sim.x) / Math.max(dt, 0.008);
        sim.vy = (nextY - sim.y) / Math.max(dt, 0.008);
        sim.x = nextX;
        sim.y = nextY;
        sim.z = lerp(sim.z, sim.targetZ, speedLerp);
        sim.lastSide = openTarget.side;
      }

      const targetPointing = !sim.inJump && Math.abs(sim.vx) < 28 ? openTarget.wantPoint : 0;
      sim.pointing = lerp(sim.pointing, targetPointing, 1 - Math.exp(-10 * dt));

      // Turn face toward cursor/card when stopped inside open spread
      if (!sim.inJump && Math.abs(sim.vx) < 28 && Math.abs(openTarget.lookDx) > 8) {
        const desiredYaw = clamp(openTarget.lookDx * 0.012, -0.78, 0.78);
        sim.facingYaw = lerpAngle(sim.facingYaw, desiredYaw, 1 - Math.exp(-8 * dt));
      }
    }

    function stepPoseAndFx(dt, slideRect) {
      sim.idleTime += dt;
      if (sim.waveTimer > 0) sim.waveTimer = Math.max(0, sim.waveTimer - dt);

      // Parabolic jump solver
      let airLift = 0;
      if (sim.inJump) {
        sim.jumpElapsed += dt;
        const rawT = clamp(sim.jumpElapsed / sim.jumpDuration, 0, 1);
        const moveT = smoothstep(rawT);
        sim.x = lerp(sim.jumpStartX, sim.targetX, moveT);
        const baseY = lerp(sim.jumpStartY, sim.targetY, moveT);
        airLift = Math.sin(rawT * Math.PI) * sim.jumpArcH;
        sim.y = baseY + airLift;
        sim.z = lerp(sim.jumpStartZ, sim.targetZ, moveT) + Math.sin(rawT * Math.PI) * 32;

        const travelDx = sim.targetX - sim.jumpStartX;
        if (Math.abs(travelDx) > 6) {
          const jumpYaw = clamp((travelDx > 0 ? 1 : -1) * Math.min(1.05, Math.abs(travelDx) * 0.0055), -1.05, 1.05);
          sim.facingYaw = lerpAngle(sim.facingYaw, jumpYaw, 1 - Math.exp(-16 * dt));
        }

        if (rawT >= 1) {
          sim.inJump = false;
          sim.x = sim.targetX;
          sim.y = sim.targetY;
          sim.z = sim.targetZ;
          sim.vx = 0;
          triggerLandingFx(sim.x, sim.y, sim.z);
        }
      }

      // Squash spring recovery
      const springForce = (1 - sim.squash) * 140 - sim.squashVel * 16;
      sim.squashVel += springForce * dt;
      sim.squash = clamp(sim.squash + sim.squashVel * dt, 0.72, 1.18);
      const xzStretch = 1 / Math.sqrt(sim.squash);

      // Update Rig transform
      const speedAbs = sim.inJump ? 0 : Math.hypot(sim.vx, sim.vy * 0.35);
      const walkBlend = clamp(speedAbs / 145, 0, 1);

      if (!sim.inJump && walkBlend > 0.12) {
        const moveYaw = clamp((sim.vx > 0 ? 1 : -1) * 0.95, -1.05, 1.05);
        sim.facingYaw = lerpAngle(sim.facingYaw, moveYaw, 1 - Math.exp(-12 * dt));
      } else if (!sim.inJump && sim.mode === 'closed') {
        const pWorld = domToWorld(pointer.clientX, pointer.clientY, slideRect);
        const lookYaw = pointer.inside ? clamp((pWorld.wx - sim.x) * 0.0022, -0.52, 0.52) : 0;
        sim.facingYaw = lerpAngle(sim.facingYaw, lookYaw, 1 - Math.exp(-6 * dt));
      }

      // Gentle joyful hop bounce while playing on closed books
      let idleBounceY = 0;
      if (!sim.inJump && walkBlend < 0.1 && sim.mode === 'closed') {
        const beat = Math.sin(sim.idleTime * 4.4);
        if (beat > 0.25) idleBounceY = Math.pow((beat - 0.25) / 0.75, 1.4) * 5.5;
      }

      rig.root.position.set(sim.x, sim.y + idleBounceY, sim.z);
      rig.root.rotation.y = sim.facingYaw;
      rig.scaleWrap.scale.set(
        sim.scalePx * xzStretch,
        sim.scalePx * sim.squash,
        sim.scalePx * xzStretch
      );

      // Limb Animation
      if (sim.inJump) {
        const rawT = clamp(sim.jumpElapsed / sim.jumpDuration, 0, 1);
        const tuck = Math.sin(rawT * Math.PI);
        rig.pelvis.position.y = 0.43 + tuck * 0.025;
        rig.torsoPivot.rotation.x = 0.24 * tuck;
        rig.leftLeg.hipPivot.rotation.x = -0.75 * tuck;
        rig.leftLeg.kneePivot.rotation.x = 1.15 * tuck;
        rig.rightLeg.hipPivot.rotation.x = -0.45 * tuck;
        rig.rightLeg.kneePivot.rotation.x = 0.95 * tuck;
        rig.leftArm.shoulderPivot.rotation.z = -1.65 * tuck;
        rig.rightArm.shoulderPivot.rotation.z = 1.65 * tuck;
        rig.leftArm.shoulderPivot.rotation.x = -0.35 * tuck;
        rig.rightArm.shoulderPivot.rotation.x = -0.35 * tuck;
        rig.leftArm.elbowPivot.rotation.x = -0.45;
        rig.rightArm.elbowPivot.rotation.x = -0.45;
        if (rig.rightArm.pointerBaton) rig.rightArm.pointerBaton.visible = false;
      } else {
        sim.walkCycle += dt * (4.5 + walkBlend * 9.5);
        const stride = Math.sin(sim.walkCycle) * 0.78 * walkBlend;
        const bob = Math.abs(Math.sin(sim.walkCycle)) * 0.028 * walkBlend;
        const breathe = Math.sin(sim.idleTime * 2.8) * 0.012 * (1 - walkBlend);

        rig.pelvis.position.y = 0.43 + bob + breathe;
        rig.torsoPivot.rotation.x = 0.18 * walkBlend + Math.sin(sim.idleTime * 2.1) * 0.03;
        rig.torsoPivot.rotation.y = Math.sin(sim.walkCycle) * 0.14 * walkBlend;

        rig.leftLeg.hipPivot.rotation.x = stride;
        rig.leftLeg.kneePivot.rotation.x = Math.max(0, -stride * 0.92);
        rig.rightLeg.hipPivot.rotation.x = -stride;
        rig.rightLeg.kneePivot.rotation.x = Math.max(0, stride * 0.92);

        const waveAmt = sim.waveTimer > 0 ? smoothstep(Math.min(1, sim.waveTimer * 2)) : 0;
        const waveSwing = Math.sin(sim.idleTime * 16) * 0.42 * waveAmt;

        rig.leftArm.shoulderPivot.rotation.x = -stride * 0.85;
        rig.leftArm.shoulderPivot.rotation.z = -0.14 - Math.sin(sim.idleTime * 2.5) * 0.04;
        rig.leftArm.elbowPivot.rotation.x = -0.25 - Math.abs(stride) * 0.28;

        // Right arm switches smoothly between walking, waving, and open-book pointer inspection!
        const pAmt = sim.pointing * (1 - walkBlend);
        const walkR_X = stride * 0.85;
        const waveR_X = -2.25;
        const pointR_X = -1.18 + Math.sin(sim.idleTime * 3.8) * 0.08;

        rig.rightArm.shoulderPivot.rotation.x = lerp(
          lerp(walkR_X, waveR_X, waveAmt),
          pointR_X,
          pAmt
        );
        rig.rightArm.shoulderPivot.rotation.z = lerp(
          lerp(0.14, 0.65 + waveSwing, waveAmt),
          -0.18,
          pAmt
        );
        rig.rightArm.elbowPivot.rotation.x = lerp(-0.25 - Math.abs(stride) * 0.25, -0.32, pAmt);
        if (rig.rightArm.pointerBaton) {
          rig.rightArm.pointerBaton.visible = pAmt > 0.22;
        }
      }

      // Expressive Head Cursor Gaze
      if (pointer.inside) {
        const pWorld = domToWorld(pointer.clientX, pointer.clientY, slideRect);
        const dx = pWorld.wx - sim.x;
        const dy = pWorld.wy - (sim.y + sim.scalePx * 0.85);
        const relYaw = clamp(dx * 0.0024 - sim.facingYaw * 0.35, -0.58, 0.58);
        const relPitch = clamp(-dy * 0.0018, -0.35, 0.28);
        sim.headYaw = lerp(sim.headYaw, relYaw, 1 - Math.exp(-10 * dt));
        sim.headPitch = lerp(sim.headPitch, relPitch, 1 - Math.exp(-10 * dt));
      } else {
        sim.headYaw = lerp(sim.headYaw, Math.sin(sim.idleTime * 1.1) * 0.22, 1 - Math.exp(-4 * dt));
        sim.headPitch = lerp(sim.headPitch, 0, 1 - Math.exp(-4 * dt));
      }
      rig.headGroup.rotation.y = sim.headYaw;
      rig.headGroup.rotation.x = sim.headPitch;

      // Ground Contact Shadow (projected directly below jump height!)
      const groundY = sim.inJump
        ? lerp(sim.jumpStartY, sim.targetY, smoothstep(sim.jumpElapsed / sim.jumpDuration))
        : sim.y;
      const heightRatio = clamp(1 - airLift / 160, 0.28, 1);
      const shadowW = sim.scalePx * 0.68 * heightRatio;
      shadowMesh.position.set(sim.x, groundY + 1, sim.z - 2);
      shadowMesh.scale.set(shadowW, shadowW * 0.55, 1);
      shadowMesh.material.opacity = 0.58 * heightRatio;

      // Landing Ripple & Sparks
      if (sim.rippleAlpha > 0.01) {
        sim.rippleAlpha = Math.max(0, sim.rippleAlpha - dt * 2.1);
        sim.rippleScale += dt * 3.8;
        const rs = sim.scalePx * sim.rippleScale * 0.55;
        rippleMesh.scale.set(rs, rs, 1);
        rippleMesh.material.opacity = sim.rippleAlpha;
      } else {
        rippleMesh.material.opacity = 0;
      }

      for (let i = 0; i < sparks.length; i++) {
        const sp = sparks[i];
        if (sp.life > 0) {
          sp.life = Math.max(0, sp.life - dt);
          sp.vy -= 180 * dt;
          sp.mesh.position.x += sp.vx * dt;
          sp.mesh.position.y += sp.vy * dt;
          sp.mesh.position.z += sp.vz * dt;
          sp.mesh.material.opacity = sp.life / sp.maxLife;
          sp.mesh.visible = true;
        } else {
          sp.mesh.visible = false;
        }
      }
    }

    function onPointerMove(e) {
      if (!active) return;
      const rect = slide.getBoundingClientRect();
      pointer.clientX = e.clientX;
      pointer.clientY = e.clientY;
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.inside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;
      if (pointer.inside) {
        pointer.lastMoveAt = performance.now();
      }
    }

    function onPointerLeave() {
      pointer.inside = false;
    }

    window.addEventListener('mousemove', onPointerMove, { passive: true });
    slide.addEventListener('mouseleave', onPointerLeave);
    window.addEventListener('resize', resize);

    return {
      setActive(isActive) {
        active = Boolean(isActive);
        if (active) {
          if (!ensureInit()) return;
          canvas.style.opacity = '1';
          lastTime = performance.now();
          sim.waveTimer = 0.85;
          sim.placedInitially = false;
          sim.inJump = false;
          sim.mode = 'closed';
          resize();
        } else {
          lastTime = 0;
          sim.placedInitially = false;
          if (renderer && scene && camera) {
            renderer.clear();
          }
        }
      },
      update(frameData) {
        if (!active || document.hidden) return;
        if (!ensureInit()) return;

        const now = performance.now();
        const dt = lastTime ? clamp((now - lastTime) / 1000, 0.008, 0.065) : 1 / 60;
        lastTime = now;

        const slideRect = slide.getBoundingClientRect();
        if (slideRect.width < 120 || slideRect.height < 120) return;

        if (frameData && frameData.opened !== -1 && frameData.spreadAlpha > 0.25) {
          updateOpenMode(dt, slideRect, frameData);
        } else {
          updateClosedMode(dt, slideRect, frameData || { current: 0, opened: -1, wrappers: [], bookDomParts: [] });
        }

        stepPoseAndFx(dt, slideRect);
        renderer.render(scene, camera);
      },
    };
  }

  let explorerCtrl = null;
  function getCtrl() {
    if (!explorerCtrl) {
      explorerCtrl = createExplorerController();
    }
    return explorerCtrl;
  }

  window.__setServicesBookExplorerActive = function (isActive) {
    const c = getCtrl();
    if (c) c.setActive(isActive);
  };

  window.__updateServicesBookExplorer = function (frameData) {
    const c = getCtrl();
    if (c) c.update(frameData);
  };
})();
