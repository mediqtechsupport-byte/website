const THREE = { WebGLRenderer: class { setPixelRatio(){} setSize(){} render(){} }, Scene: class { add(){} }, PerspectiveCamera: class { position={set(){}} updateProjectionMatrix(){} }, AmbientLight: class {}, DirectionalLight: class { position={set(){}} }, PointLight: class { position={set(){}} }, MeshPhysicalMaterial: class {}, MeshStandardMaterial: class {}, MeshBasicMaterial: class {}, Group: class { add(){} rotation={x:0, y:0, z:0} }, Vector2: class {}, LatheGeometry: class { rotateX(){} }, CylinderGeometry: class { rotateX(){} rotateZ(){} }, Vector3: class {}, CatmullRomCurve3: class {}, TubeGeometry: class {}, Shape: class { moveTo(){} bezierCurveTo(){} lineTo(){} closePath(){} }, ExtrudeGeometry: class { translate(){} }, RingGeometry: class {}, Mesh: class { position={set(){}} } };
const document = { getElementById: () => ({ getBoundingClientRect: () => ({ width: 800, height: 600, left: 0, top: 0, right: 800, bottom: 600 }), addEventListener: () => {}, width: 800, height: 600 }), querySelectorAll: () => [] };
const window = { devicePixelRatio: 1, addEventListener: () => {} };
const performance = { now: () => Date.now() };
const requestAnimationFrame = () => {};
const setTimeout = () => {};
(function() {
// B. Dedicated Interactive 3D Real AI Eye Lens Engine (RayOne Galaxy C-Shape IOL)
  const heroCanvas = document.getElementById('hero-ink-orbit-canvas');
  if (heroCanvas && typeof THREE !== 'undefined') {
    const headingEl = document.getElementById('hero-hud-heading');
    const seedEl = document.getElementById('hero-hud-seed');
    const labelEl = document.getElementById('hero-hud-label');

    if (labelEl) labelEl.textContent = 'RAYONE® GALAXY 3D';
    if (seedEl) seedEl.textContent = '100% TRANSMITTED LIGHT';
    if (headingEl) headingEl.textContent = 'AXIS 090° · AI SPIRAL OPTIC';

    // 1. WebGL Renderer with Alpha & PBR Tone Mapping
    const renderer = new THREE.WebGLRenderer({
      canvas: heroCanvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
      stencil: false,
      depth: true
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    const scene = new THREE.Scene();

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
    camera.position.set(0, 0, 7.8);

    // 3. Studio Lighting Rig (MediQ Palette: Deep Navy Ambiance, Rayner Sky Cyan Rim & Fill)
    const ambientLight = new THREE.AmbientLight(0x0b1a33, 2.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.6);
    keyLight.position.set(3.5, 4.5, 4.0);
    scene.add(keyLight);

    const cyanFillLight = new THREE.DirectionalLight(0x3aa0db, 2.2);
    cyanFillLight.position.set(-4.0, -2.5, 2.5);
    scene.add(cyanFillLight);

    const softRimLight = new THREE.DirectionalLight(0x93c5fd, 2.4);
    softRimLight.position.set(0, 3.5, -4.5);
    scene.add(softRimLight);

    const catchLight = new THREE.PointLight(0x60a5fa, 2.5, 14);
    catchLight.position.set(0, 1.2, 3.8);
    scene.add(catchLight);

    // 4. Lens Materials (Crystalline Medical-Grade Acrylic)
    const acrylicMat = new THREE.MeshPhysicalMaterial({
      color: 0xecf8ff,
      roughness: 0.06,
      metalness: 0.08,
      transparent: true,
      opacity: 0.88,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
      reflectivity: 0.95,
      side: THREE.DoubleSide,
      depthWrite: true
    });

    const frostedRimMat = new THREE.MeshPhysicalMaterial({
      color: 0x8fcbf0,
      roughness: 0.22,
      metalness: 0.12,
      transparent: true,
      opacity: 0.72,
      clearcoat: 0.85,
      side: THREE.DoubleSide
    });

    const aiSpiralMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.75,
      roughness: 0.14,
      metalness: 0.15,
      transparent: true,
      opacity: 0.92
    });

    const axisMarkerMat = new THREE.MeshBasicMaterial({
      color: 0x3aa0db
    });

    // 5. Construct 3D Real Eye Lens (RayOne Galaxy C-Shape IOL)
    const lensRoot = new THREE.Group();

    // A. Central Biconvex Optic (Radius 1.42, 6.0mm clinical disc)
    const radius = 1.42;
    const steps = 32;
    const opticPts = [];
    for (let i = 0; i <= steps; i++) {
      const r = (i / steps) * radius;
      const yTop = 0.09 + Math.cos((r / radius) * Math.PI * 0.5) * 0.22;
      opticPts.push(new THREE.Vector2(r, yTop));
    }
    opticPts.push(new THREE.Vector2(radius, -0.09));
    for (let i = steps; i >= 0; i--) {
      const r = (i / steps) * radius;
      const yBot = -0.09 - Math.cos((r / radius) * Math.PI * 0.5) * 0.22;
      opticPts.push(new THREE.Vector2(r, yBot));
    }
    const opticGeo = new THREE.LatheGeometry(opticPts, 72);
    opticGeo.rotateX(Math.PI * 0.5);
    const opticMesh = new THREE.Mesh(opticGeo, acrylicMat);
    lensRoot.add(opticMesh);

    // 360° Square-Edge Frosted Rim (PCO Barrier)
    const rimGeo = new THREE.CylinderGeometry(radius, radius, 0.18, 72, 1, true);
    rimGeo.rotateX(Math.PI * 0.5);
    lensRoot.add(new THREE.Mesh(rimGeo, frostedRimMat));

    // B. AI Continuous Spiral Diffraction-Free Micro-Structure
    const spiralPts = [];
    const totalSpiralPts = 220;
    for (let i = 0; i <= totalSpiralPts; i++) {
      const t = i / totalSpiralPts;
      const ang = t * Math.PI * 9.5;
      const r = 0.1 + t * (radius * 0.88);
      const z = 0.095 + Math.cos((r / radius) * Math.PI * 0.5) * 0.225;
      spiralPts.push(new THREE.Vector3(Math.cos(ang) * r, Math.sin(ang) * r, z));
    }
    const spiralCurve = new THREE.CatmullRomCurve3(spiralPts);
    const spiralGeo = new THREE.TubeGeometry(spiralCurve, 180, 0.016, 8, false);
    const spiralMesh = new THREE.Mesh(spiralGeo, aiSpiralMat);
    lensRoot.add(spiralMesh);

    // Back Optic Subtle Counter-Spiral
    const backSpiralPts = [];
    for (let i = 0; i <= 140; i++) {
      const t = i / 140;
      const ang = -t * Math.PI * 6.0;
      const r = 0.12 + t * (radius * 0.78);
      const z = -0.095 - Math.cos((r / radius) * Math.PI * 0.5) * 0.225;
      backSpiralPts.push(new THREE.Vector3(Math.cos(ang) * r, Math.sin(ang) * r, z));
    }
    const backSpiralCurve = new THREE.CatmullRomCurve3(backSpiralPts);
    const backSpiralGeo = new THREE.TubeGeometry(backSpiralCurve, 120, 0.013, 8, false);
    const backSpiralMesh = new THREE.Mesh(backSpiralGeo, spiralMat || aiSpiralMat);
    lensRoot.add(backSpiralMesh);

    // C. Dual Closed-Loop Anti-Vaulting Haptics in the Classic "C" Position (Total Span 5.4 units)
    const buildHapticLoop = (mirrorSign) => {
      const shape = new THREE.Shape();
      shape.moveTo(0.48 * mirrorSign, 1.18 * mirrorSign);
      shape.bezierCurveTo(
        1.22 * mirrorSign, 1.95 * mirrorSign,
        1.05 * mirrorSign, 2.78 * mirrorSign,
        -0.32 * mirrorSign, 2.70 * mirrorSign
      );
      shape.bezierCurveTo(
        -1.32 * mirrorSign, 2.60 * mirrorSign,
        -1.52 * mirrorSign, 1.70 * mirrorSign,
        -0.76 * mirrorSign, 1.08 * mirrorSign
      );
      shape.lineTo(-0.44 * mirrorSign, 1.25 * mirrorSign);
      shape.bezierCurveTo(
        -1.08 * mirrorSign, 1.72 * mirrorSign,
        -0.92 * mirrorSign, 2.32 * mirrorSign,
        -0.24 * mirrorSign, 2.38 * mirrorSign
      );
      shape.bezierCurveTo(
        0.62 * mirrorSign, 2.44 * mirrorSign,
        0.80 * mirrorSign, 1.86 * mirrorSign,
        0.20 * mirrorSign, 1.30 * mirrorSign
      );
      shape.closePath();

      const extrudeGeo = new THREE.ExtrudeGeometry(shape, {
        depth: 0.13,
        bevelEnabled: true,
        bevelThickness: 0.035,
        bevelSize: 0.03,
        bevelSegments: 4,
        curveSegments: 36
      });
      extrudeGeo.translate(0, 0, -0.065);
      return new THREE.Mesh(extrudeGeo, acrylicMat);
    };

    lensRoot.add(buildHapticLoop(1));
    lensRoot.add(buildHapticLoop(-1));

    // D. Laser-Etched Toric Alignment Marks (0° and 180° Axis)
    const markerGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.22, 12);
    markerGeo.rotateZ(Math.PI * 0.5);
    const marker1 = new THREE.Mesh(markerGeo, axisMarkerMat);
    marker1.position.set(-1.28, 0, 0.14);
    const marker2 = new THREE.Mesh(markerGeo, axisMarkerMat);
    marker2.position.set(1.28, 0, 0.14);
    lensRoot.add(marker1);
    lensRoot.add(marker2);

    // E. Wavefront Projection Energy Rings in 3D (Subtle Concentric Light Beams)
    const waveRingsGroup = new THREE.Group();
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x3aa0db,
      transparent: true,
      opacity: 0.22,
      wireframe: true
    });
    for (let k = 1; k <= 3; k++) {
      const ringGeo = new THREE.RingGeometry(radius * (0.4 * k), radius * (0.4 * k) + 0.015, 48);
      const rMesh = new THREE.Mesh(ringGeo, ringMat);
      rMesh.position.z = 0.05 * k;
      waveRingsGroup.add(rMesh);
    }
    lensRoot.add(waveRingsGroup);

    scene.add(lensRoot);

    // 6. Interactive Physics, Rotation & Touch Gestures
    // Default orientation: Classic "C" position facing the front with slight aesthetic elevation
    const DEFAULT_ROT_X = 0.06;
    const DEFAULT_ROT_Y = -0.12;

    let targetRotX = DEFAULT_ROT_X;
    let targetRotY = DEFAULT_ROT_Y;
    let curRotX = DEFAULT_ROT_X;
    let curRotY = DEFAULT_ROT_Y;
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let startRotX = 0;
    let startRotY = 0;
    let idleTime = 0;

    // Viewport Resize & Camera Fit
    const updateSize = () => {
      const rect = heroCanvas.getBoundingClientRect();
      const w = Math.max(1, Math.floor(rect.width));
      const h = Math.max(1, Math.floor(rect.height));

      renderer.setSize(w, h, false);
      camera.aspect = w / h;

      // Adjust camera distance so lens vertically spans top-to-bottom edge nicely
      // Lens total height is ~5.6 units
      const targetSpan = 5.2;
      const vFovRad = (camera.fov * Math.PI) / 180;
      const idealZ = (targetSpan / 2) / Math.tan(vFovRad / 2);
      
      if (camera.aspect < 1.0) {
        camera.position.z = Math.max(idealZ * 1.15, 8.5);
      } else {
        camera.position.z = Math.max(idealZ * 1.02, 7.6);
      }

      camera.updateProjectionMatrix();
    };

    updateSize();
    window.addEventListener('resize', updateSize, { passive: true });

    // Pointer Events for 360° Drag & Hover Tilt
    heroCanvas.addEventListener('pointerdown', (e) => {
      isDragging = true;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      startRotX = targetRotX;
      startRotY = targetRotY;
      heroCanvas.setPointerCapture?.(e.pointerId);
    });

    window.addEventListener('pointermove', (e) => {
      const rect = heroCanvas.getBoundingClientRect();
      const inHero = (
        e.clientX >= rect.left && e.clientX <= rect.right &&
        e.clientY >= rect.top && e.clientY <= rect.bottom
      );

      if (isDragging) {
        const dx = e.clientX - dragStartX;
        const dy = e.clientY - dragStartY;
        targetRotY = startRotY + (dx * 0.009);
        targetRotX = Math.max(-1.45, Math.min(1.45, startRotX + (dy * 0.009)));
        idleTime = 0;
      } else if (inHero) {
        // Subtle Parallax Hover Tilt
        const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
        targetRotY = DEFAULT_ROT_Y + nx * 0.25;
        targetRotX = DEFAULT_ROT_X - ny * 0.20;
      }
    });

    const stopDrag = (e) => {
      if (isDragging) {
        isDragging = false;
        try { heroCanvas.releasePointerCapture?.(e?.pointerId); } catch (_) {}
      }
    };
    window.addEventListener('pointerup', stopDrag);
    window.addEventListener('pointercancel', stopDrag);

    // Click canvas to orient back to textbook "C" position
    heroCanvas.addEventListener('click', (e) => {
      const moved = Math.hypot(e.clientX - dragStartX, e.clientY - dragStartY);
      if (moved < 6) {
        targetRotX = DEFAULT_ROT_X;
        targetRotY = DEFAULT_ROT_Y;
        if (headingEl) headingEl.textContent = 'AXIS 090° · C-POSITION LOCKED';
        setTimeout(() => {
          if (headingEl) headingEl.textContent = 'AXIS 090° · AI SPIRAL OPTIC';
        }, 1800);
      }
    });

    // 7. Animation Loop with Dynamic Sizing Guard
    let lastTime = performance.now();
    const animateHeroLens = (now) => {
      requestAnimationFrame(animateHeroLens);
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      // Guard check for layout size shifts
      const rect = heroCanvas.getBoundingClientRect();
      const rw = Math.max(1, Math.floor(rect.width));
      const rh = Math.max(1, Math.floor(rect.height));
      const curW = heroCanvas.width / (window.devicePixelRatio || 1);
      const curH = heroCanvas.height / (window.devicePixelRatio || 1);
      if (Math.abs(rw - curW) > 3 || Math.abs(rh - curH) > 3) {
        updateSize();
      }

      // Idle subtle breathing oscillation
      if (!isDragging) {
        idleTime += dt;
        const breath = Math.sin(idleTime * 1.4) * 0.04;
        curRotX += (targetRotX + breath - curRotX) * Math.min(1, dt * 5.0);
        curRotY += (targetRotY - curRotY) * Math.min(1, dt * 5.0);
      } else {
        curRotX += (targetRotX - curRotX) * Math.min(1, dt * 10.0);
        curRotY += (targetRotY - curRotY) * Math.min(1, dt * 10.0);
      }

      lensRoot.rotation.x = curRotX;
      lensRoot.rotation.y = curRotY;

      // Update Telemetry HUD with current rotation angle
      if (headingEl && isDragging) {
        const deg = Math.round(((curRotY * 180 / Math.PI) % 360 + 360) % 360);
        headingEl.textContent = `AXIS ${String(deg).padStart(3, '0')}° · INTERACTIVE 3D`;
      }

      // Subtle pulse on wavefront rings
      waveRingsGroup.rotation.z += dt * 0.25;

      renderer.render(scene, camera);
    };

    requestAnimationFrame(animateHeroLens);
  }

  
})();
