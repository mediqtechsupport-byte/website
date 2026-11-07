const fs = require('fs');

const coordsJson = fs.readFileSync('assets/js/philippines-coords.json', 'utf8');

const jsContent = `/* ==========================================================================
   MEDIQ 3D GLOBE WITH PHILIPPINES NETWORK & RUNNING COURIER
   - High-fidelity Three.js Interactive 3D Sphere featuring ONLY the Philippines
   - Animated 3D Courier running smoothly on top of the rotating world
   - MediQ MedTech Color Palette (Deep Navy #030d1e, Cyan #3aa0db, Neon #00e5ff)
   - Inertial drag-to-rotate & auto-roam motion
   ========================================================================== */

(function() {
  'use strict';

  // Philippines archipelago coordinates (48 islands)
  const PH_COORDS = ${coordsJson};

  // Healthcare distribution hubs across the Philippines
  const PH_HUBS = [
    { name: 'Metro Manila (HQ & Central Hub)', lon: 120.98, lat: 14.60, primary: true },
    { name: 'Cebu City (Visayas Hub)', lon: 123.89, lat: 10.31, primary: true },
    { name: 'Davao City (Mindanao Hub)', lon: 125.61, lat: 7.07, primary: true },
    { name: 'Iloilo City (Western Visayas)', lon: 122.56, lat: 10.72, primary: false },
    { name: 'Baguio (North Luzon Hub)', lon: 120.59, lat: 16.40, primary: false },
    { name: 'Cagayan de Oro (Northern Mindanao)', lon: 124.63, lat: 8.48, primary: false }
  ];

  function initAboutGlobe() {
    const container = document.getElementById('about-globe-container');
    const wrapper = document.getElementById('about-globe-canvas-wrapper');
    if (!container || !wrapper) return;

    // Check THREE availability
    if (typeof THREE === 'undefined') {
      console.warn('Three.js is not loaded yet for About Globe');
      setTimeout(initAboutGlobe, 100);
      return;
    }

    // Clean up any previous canvas
    wrapper.innerHTML = '';

    const width = wrapper.clientWidth || 540;
    const height = wrapper.clientHeight || 540;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0.2, 5.8);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    wrapper.appendChild(renderer.domElement);

    // 2. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0x0e2a4a, 1.8);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x70d8ff, 2.8);
    dirLight1.position.set(4, 6, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x184a82, 1.4);
    dirLight2.position.set(-5, -2, -3);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0x00e5ff, 2.5, 12);
    pointLight.position.set(0, 3.2, 3);
    scene.add(pointLight);

    // 3. Globe Group & Positioning
    const globeRadius = 1.95;
    const globeCenterY = -0.55;
    const globeGroup = new THREE.Group();
    globeGroup.position.set(0, globeCenterY, 0);
    scene.add(globeGroup);

    // 4. Generate High-Res Canvas Texture for Philippines Map
    function createPhilippinesGlobeTexture() {
      const texWidth = 2048;
      const texHeight = 1024;
      const canvas = document.createElement('canvas');
      canvas.width = texWidth;
      canvas.height = texHeight;
      const ctx = canvas.getContext('2d');

      // Deep Navy Ocean Background
      const oceanGrad = ctx.createLinearGradient(0, 0, 0, texHeight);
      oceanGrad.addColorStop(0, '#020b18');
      oceanGrad.addColorStop(0.5, '#051833');
      oceanGrad.addColorStop(1, '#020b18');
      ctx.fillStyle = oceanGrad;
      ctx.fillRect(0, 0, texWidth, texHeight);

      // Center longitude on Philippines (~122° E) so Philippines faces front at rotation.y = 0
      const centerLon = 122.0;
      function project(lon, lat) {
        let relLon = lon - centerLon;
        if (relLon < -180) relLon += 360;
        if (relLon > 180) relLon -= 360;
        const x = ((relLon + 180) / 360) * texWidth;
        const y = ((90 - lat) / 180) * texHeight;
        return [x, y];
      }

      // Draw subtle latitude / longitude grid
      ctx.strokeStyle = 'rgba(58, 160, 219, 0.12)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 6]);
      // Parallels
      for (let lat = -75; lat <= 75; lat += 15) {
        const [, y] = project(0, lat);
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(texWidth, y);
        ctx.stroke();
      }
      // Meridians
      for (let lon = -180; lon < 180; lon += 15) {
        const [x] = project(lon, 0);
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, texHeight);
        ctx.stroke();
      }
      ctx.setLineDash([]);

      // Equator & Tropic of Cancer accents
      const [, eqY] = project(0, 0);
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.22)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, eqY);
      ctx.lineTo(texWidth, eqY);
      ctx.stroke();

      const [, cancerY] = project(0, 23.436);
      ctx.strokeStyle = 'rgba(58, 160, 219, 0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, cancerY);
      ctx.lineTo(texWidth, cancerY);
      ctx.stroke();

      // Atmospheric Radial Vignette on Oceans
      const [phCenterProjX, phCenterProjY] = project(122, 13);
      const radGrad = ctx.createRadialGradient(
        phCenterProjX, phCenterProjY, 40,
        phCenterProjX, phCenterProjY, 480
      );
      radGrad.addColorStop(0, 'rgba(0, 180, 255, 0.18)');
      radGrad.addColorStop(0.5, 'rgba(10, 50, 110, 0.1)');
      radGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = radGrad;
      ctx.fillRect(0, 0, texWidth, texHeight);

      // Render ONLY the Philippines archipelago!
      // Glow underlay
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 18;
      ctx.fillStyle = '#00c6ff';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.5;

      PH_COORDS.forEach(ring => {
        if (!ring || ring.length < 3) return;
        ctx.beginPath();
        const [x0, y0] = project(ring[0][0], ring[0][1]);
        ctx.moveTo(x0, y0);
        for (let i = 1; i < ring.length; i++) {
          const [xi, yi] = project(ring[i][0], ring[i][1]);
          ctx.lineTo(xi, yi);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      });

      // Crisp top layer with high-intensity cyan gradient
      ctx.shadowBlur = 6;
      ctx.shadowColor = '#ffffff';
      const landGrad = ctx.createLinearGradient(0, phCenterProjY - 120, 0, phCenterProjY + 120);
      landGrad.addColorStop(0, '#56d6ff');
      landGrad.addColorStop(0.5, '#00b4d8');
      landGrad.addColorStop(1, '#0077b6');
      ctx.fillStyle = landGrad;
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#ffffff';

      PH_COORDS.forEach(ring => {
        if (!ring || ring.length < 3) return;
        ctx.beginPath();
        const [x0, y0] = project(ring[0][0], ring[0][1]);
        ctx.moveTo(x0, y0);
        for (let i = 1; i < ring.length; i++) {
          const [xi, yi] = project(ring[i][0], ring[i][1]);
          ctx.lineTo(xi, yi);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      });

      // Reset shadow for data markers
      ctx.shadowBlur = 0;

      // Draw healthcare distribution hub arcs between Manila and other hubs
      const manilaHub = PH_HUBS.find(h => h.name.includes('Manila'));
      const [mX, mY] = project(manilaHub.lon, manilaHub.lat);

      PH_HUBS.forEach(hub => {
        if (hub === manilaHub) return;
        const [hX, hY] = project(hub.lon, hub.lat);
        ctx.strokeStyle = 'rgba(0, 229, 255, 0.45)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([3, 4]);
        ctx.beginPath();
        ctx.moveTo(mX, mY);
        // Quadratic curve arc
        const midX = (mX + hX) / 2 - 15;
        const midY = (mY + hY) / 2;
        ctx.quadraticCurveTo(midX, midY, hX, hY);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // Draw Hub Beacon Markers
      PH_HUBS.forEach(hub => {
        const [hX, hY] = project(hub.lon, hub.lat);
        
        // Outer pulsing ring
        ctx.beginPath();
        ctx.arc(hX, hY, hub.primary ? 9 : 6, 0, Math.PI * 2);
        ctx.strokeStyle = hub.primary ? '#00e5ff' : '#38bdf8';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Inner solid core
        ctx.beginPath();
        ctx.arc(hX, hY, hub.primary ? 4.5 : 3, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        // Glow ring
        ctx.beginPath();
        ctx.arc(hX, hY, hub.primary ? 14 : 9, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(0, 229, 255, 0.25)';
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Philippine Sea typographic label
      ctx.font = 'bold 13px system-ui, -apple-system, sans-serif';
      ctx.fillStyle = 'rgba(180, 230, 255, 0.7)';
      ctx.letterSpacing = '2px';
      ctx.fillText('PHILIPPINES ARCHIPELAGO', phCenterProjX + 35, phCenterProjY - 30);
      ctx.font = '10px monospace';
      ctx.fillStyle = 'rgba(0, 229, 255, 0.6)';
      ctx.fillText('122°00\\'E  13°00\\'N', phCenterProjX + 35, phCenterProjY - 14);

      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = 8;
      return texture;
    }

    // 5. Create Globe Mesh
    const globeTexture = createPhilippinesGlobeTexture();
    const globeGeometry = new THREE.SphereGeometry(globeRadius, 64, 64);
    const globeMaterial = new THREE.MeshStandardMaterial({
      map: globeTexture,
      roughness: 0.6,
      metalness: 0.15,
      emissive: new THREE.Color(0x041838),
      emissiveIntensity: 0.35
    });
    const globeMesh = new THREE.Mesh(globeGeometry, globeMaterial);
    globeGroup.add(globeMesh);

    // 6. Atmospheric Fresnel Rim Glow Sphere
    const atmosphereGeom = new THREE.SphereGeometry(globeRadius * 1.025, 48, 48);
    const atmosphereMat = new THREE.ShaderMaterial({
      vertexShader: \`
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      \`,
      fragmentShader: \`
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.68 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.2);
          gl_FragColor = vec4(0.0, 0.85, 1.0, 1.0) * intensity * 0.95;
        }
      \`,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeom, atmosphereMat);
    globeGroup.add(atmosphereMesh);

    // 7. Tech Orbit Rings Around the Globe
    const ringGroup = new THREE.Group();
    ringGroup.rotation.x = Math.PI * 0.22;
    ringGroup.rotation.z = -Math.PI * 0.12;

    const ringGeom = new THREE.RingGeometry(globeRadius * 1.22, globeRadius * 1.235, 96);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x3aa0db,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending
    });
    const orbitRing1 = new THREE.Mesh(ringGeom, ringMat);
    ringGroup.add(orbitRing1);

    const ringGeom2 = new THREE.RingGeometry(globeRadius * 1.34, globeRadius * 1.348, 96);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x00e5ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending
    });
    const orbitRing2 = new THREE.Mesh(ringGeom2, ringMat2);
    orbitRing2.rotation.y = Math.PI * 0.35;
    ringGroup.add(orbitRing2);

    globeGroup.add(ringGroup);

    // 8. The 3D Running Courier Figure
    // Runner stays mounted on top of the world: y = globeCenterY + globeRadius
    const runnerContainer = new THREE.Group();
    // Position at top peak of globe:
    const runnerY = globeCenterY + globeRadius - 0.02;
    runnerContainer.position.set(0, runnerY, 0);
    // Face slightly 3/4 towards camera while running forward
    runnerContainer.rotation.y = Math.PI * 0.45;
    scene.add(runnerContainer);

    let animationMixer = null;
    let courierModel = null;

    // Load Courier GLB model
    function loadCourier() {
      if (!THREE.GLTFLoader) {
        console.warn('GLTFLoader not ready, using stylized runner fallback');
        createStylizedRunner();
        return;
      }

      const loader = new THREE.GLTFLoader();
      loader.load(
        'assets/models/courier.glb',
        function(gltf) {
          courierModel = gltf.scene;
          
          // Human scale: height 1.70m scaled down to ~0.55 units
          const scale = 0.32;
          courierModel.scale.set(scale, scale, scale);
          courierModel.position.set(0, 0, 0);

          // Tone materials to MediQ palette
          courierModel.traverse(node => {
            if (node.isMesh) {
              node.castShadow = true;
              node.frustumCulled = false;
              if (node.material) {
                const materials = Array.isArray(node.material) ? node.material : [node.material];
                materials.forEach(mat => {
                  mat.roughness = 0.65;
                  mat.metalness = 0.1;
                  // Enhance cap and uniform with vibrant MediQ MedTech blues
                  if (mat.name && (mat.name.toLowerCase().includes('hat') || mat.name.toLowerCase().includes('cloth'))) {
                    mat.color.setHex(0x1368c2);
                  }
                });
              }
            }
          });

          runnerContainer.add(courierModel);

          // Setup running animation
          if (gltf.animations && gltf.animations.length > 0) {
            animationMixer = new THREE.AnimationMixer(courierModel);
            // Play all run/stride animations in seamless loop
            gltf.animations.forEach(clip => {
              const action = animationMixer.clipAction(clip);
              action.setLoop(THREE.LoopRepeat);
              action.play();
            });
          }
        },
        undefined,
        function(err) {
          console.warn('Could not load courier.glb, falling back to procedural courier:', err);
          createStylizedRunner();
        }
      );
    }

    // High-tech stylized runner fallback if model loading is delayed
    function createStylizedRunner() {
      if (courierModel) return;
      const proceduralRunner = new THREE.Group();
      
      // Stylized mannequin head
      const headGeom = new THREE.SphereGeometry(0.06, 16, 16);
      const headMat = new THREE.MeshStandardMaterial({ color: 0x00e5ff, emissive: 0x0077b6, emissiveIntensity: 0.6 });
      const head = new THREE.Mesh(headGeom, headMat);
      head.position.set(0, 0.44, 0);
      proceduralRunner.add(head);

      // Torso
      const bodyGeom = new THREE.CylinderGeometry(0.05, 0.04, 0.18, 12);
      const bodyMat = new THREE.MeshStandardMaterial({ color: 0x1368c2, roughness: 0.4 });
      const body = new THREE.Mesh(bodyGeom, bodyMat);
      body.position.set(0, 0.28, 0);
      proceduralRunner.add(body);

      // Courier delivery pack
      const packGeom = new THREE.BoxGeometry(0.08, 0.12, 0.06);
      const packMat = new THREE.MeshStandardMaterial({ color: 0x00e5ff, emissive: 0x00a8e8, emissiveIntensity: 0.4 });
      const pack = new THREE.Mesh(packGeom, packMat);
      pack.position.set(0, 0.29, -0.06);
      proceduralRunner.add(pack);

      runnerContainer.add(proceduralRunner);
      courierModel = proceduralRunner;
    }

    // Try loading courier
    loadCourier();

    // 9. Interactive Drag & Spin Controls
    let isDragging = false;
    let previousPointerPosition = { x: 0, y: 0 };
    let targetRotationX = 0.12;
    let targetRotationY = 0;
    let currentRotationX = 0.12;
    let currentRotationY = 0;
    let velocityX = 0;
    let velocityY = 0.0035; // gentle auto-spin
    let lastInteractionTime = Date.now();

    function onPointerDown(e) {
      isDragging = true;
      lastInteractionTime = Date.now();
      previousPointerPosition = { x: e.clientX, y: e.clientY };
      velocityX = 0;
      velocityY = 0;
      container.style.cursor = 'grabbing';
    }

    function onPointerMove(e) {
      if (!isDragging) return;
      lastInteractionTime = Date.now();
      const deltaX = e.clientX - previousPointerPosition.x;
      const deltaY = e.clientY - previousPointerPosition.y;

      targetRotationY += deltaX * 0.007;
      targetRotationX += deltaY * 0.005;

      // Clamp X tilt to prevent flipping
      targetRotationX = Math.max(-0.45, Math.min(0.45, targetRotationX));

      velocityX = deltaY * 0.002;
      velocityY = deltaX * 0.003;

      previousPointerPosition = { x: e.clientX, y: e.clientY };
    }

    function onPointerUp() {
      isDragging = false;
      container.style.cursor = 'grab';
    }

    container.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);

    // 10. Animation Loop & Inertia
    const clock = new THREE.Clock();
    let isVisible = true;

    // Visibility observer to save performance when user scrolls away
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isVisible = entry.isIntersecting;
      });
    }, { threshold: 0.1 });
    observer.observe(container);

    function animate() {
      requestAnimationFrame(animate);
      if (!isVisible) return;

      const delta = clock.getDelta();

      // Step Courier run animation
      if (animationMixer) {
        animationMixer.update(delta * 1.15);
      }

      // Handle Globe Rotation & Auto-Roam
      const idleTime = (Date.now() - lastInteractionTime) / 1000;
      if (!isDragging) {
        if (idleTime > 2.5) {
          // Resume smooth continuous rotation
          velocityY = THREE.MathUtils.damp(velocityY, 0.0038, 3, delta);
          targetRotationX = THREE.MathUtils.damp(targetRotationX, 0.12, 1.5, delta);
        } else {
          // Inertia damping
          velocityY *= Math.pow(0.92, delta * 60);
          velocityX *= Math.pow(0.92, delta * 60);
          targetRotationX += velocityX;
          targetRotationX = Math.max(-0.45, Math.min(0.45, targetRotationX));
        }
        targetRotationY += velocityY;
      }

      currentRotationX = THREE.MathUtils.damp(currentRotationX, targetRotationX, 10, delta);
      currentRotationY = THREE.MathUtils.damp(currentRotationY, targetRotationY, 10, delta);

      globeGroup.rotation.y = currentRotationY;
      globeGroup.rotation.x = currentRotationX;

      // Rotate tech orbit rings slightly faster
      ringGroup.rotation.z += delta * 0.12;

      // Slight natural runner bob
      const time = clock.getElapsedTime();
      runnerContainer.position.y = runnerY + Math.sin(time * 9.5) * 0.012;

      renderer.render(scene, camera);
    }
    animate();

    // 11. Responsive Resize
    function handleResize() {
      if (!wrapper || !renderer || !camera) return;
      const newW = wrapper.clientWidth || 540;
      const newH = wrapper.clientHeight || 540;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    }
    window.addEventListener('resize', handleResize);
  }

  // Auto-init when DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAboutGlobe);
  } else {
    initAboutGlobe();
  }
})();
`;

fs.writeFileSync('assets/js/about-globe-runner.js', jsContent, 'utf8');
console.log('Successfully wrote assets/js/about-globe-runner.js! Size:', jsContent.length);

