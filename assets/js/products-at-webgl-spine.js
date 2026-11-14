/**
 * MEDIQ PRODUCTS SPIRAL — WEBGL SPINE + GLITTER CLOUD RENDERER
 * ============================================================================
 * Real-time Three.js layer for the "What are you looking for?" product spiral.
 *   - Dark liquid-chrome vertebral spine with oil-slick thin-film iridescence,
 *     studio reflections and surface glitter (procedural, instanced)
 *   - Billowing clouds of round glitter particles (pink / teal / violet / gold)
 *     orbiting the spine and bursting with scroll velocity
 * The canvas sits on the CSS 3D spine plane (Z = 0), so the DOM product cards
 * still pass in front of / behind the spine exactly as before.
 * Returns null (2D fallback is used) when WebGL / THREE is unavailable.
 */
(function initMediqATSpineGL() {
  'use strict';

  const PERSPECTIVE_PX = 1400; // Must match .at-work-viewport { perspective }
  const VERT_SPACING = 42;
  const MAX_LEVELS = 60;
  const CLUSTER_COUNT = 26;
  const PARTICLES_PER_CLUSTER = 280;

  const GLITTER_COLORS = [
    [1.00, 0.36, 0.72], // pink
    [0.93, 0.22, 0.55], // magenta
    [0.20, 0.86, 0.80], // teal
    [0.36, 0.95, 0.55], // mint green
    [0.62, 0.42, 1.00], // violet
    [0.42, 0.58, 1.00], // periwinkle
    [1.00, 0.78, 0.32], // gold
    [0.95, 0.95, 1.00]  // white sparkle
  ];

  function hash(n) {
    const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
    return s - Math.floor(s);
  }

  function supportsWebGL() {
    try {
      const c = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
    } catch (_) {
      return false;
    }
  }

  // Organic vertebra: body + curved transverse wings + rear spinous spike + lumps
  function buildVertebraGeometry(THREE) {
    const lite = (window.innerWidth || 1200) < 900;
    const g = new THREE.SphereGeometry(1, lite ? 64 : 112, lite ? 32 : 56);
    g.rotateY(-Math.PI / 2); // hide UV seam at the back (behind the spike)
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);
      const ax = Math.abs(x);

      let px = x * 1.0;
      let py = y * 0.74;
      let pz = z * 0.95;

      // Transverse processes: long curved horns sweeping out, back and curling up at the tip
      const wing = Math.pow(Math.max(0, ax * 0.97 - Math.abs(y) * 0.42 - Math.max(0, z) * 0.12), 4.0);
      px += Math.sign(x) * wing * 1.75;
      pz -= wing * 0.85;
      py += wing * wing * 0.55;
      const wSquash = Math.min(1, wing * 1.5);
      py *= 1 - 0.45 * wSquash;
      pz *= 1 - 0.25 * wSquash;

      // Spinous process: long thin spike back and down
      const sp = Math.pow(Math.max(0, -z * 0.94 - y * 0.18), 6.0);
      pz -= sp * 2.3;
      py -= sp * 0.55;
      const spSquash = Math.min(1, sp * 1.6);
      py *= 1 - 0.5 * spSquash;
      px *= 1 - 0.6 * spSquash;

      // Superior articular lobes (bumps up and back at both sides)
      const lobe = Math.pow(Math.max(0, y * 0.85 + ax * 0.45 - z * 0.25 - 0.62), 2.0) * 2.6;
      py += lobe * 0.4;

      // Front vertebral body bulge
      const front = Math.pow(Math.max(0, z), 3.0);
      pz += front * 0.18;

      // Organic surface lumps
      const n = Math.sin(x * 7.3 + y * 3.1) * Math.sin(y * 6.4 + z * 5.3) * Math.sin(z * 6.9 + x * 2.7);
      const n2 = Math.sin(x * 15.0 + z * 11.0) * Math.sin(y * 13.0 - x * 9.0) * 0.4;
      const k = 1 + n * 0.075 + n2 * 0.03;
      pos.setXYZ(i, px * k, py * k, pz * k);
    }
    g.computeVertexNormals();
    return g;
  }

  const CHROME_VERTEX = `
    attribute float aSeed;
    varying vec3 vN;
    varying vec3 vW;
    varying vec3 vObj;
    varying float vSeed;
    void main() {
      vObj = position;
      vSeed = aSeed;
      vec4 wp = modelMatrix * instanceMatrix * vec4(position, 1.0);
      vW = wp.xyz;
      vN = normalize(mat3(modelMatrix) * mat3(instanceMatrix) * normal);
      gl_Position = projectionMatrix * viewMatrix * wp;
    }
  `;

  const CHROME_FRAGMENT = `
    uniform float uTime;
    uniform vec3 uFogColor;
    uniform vec3 uAccent;
    varying vec3 vN;
    varying vec3 vW;
    varying vec3 vObj;
    varying float vSeed;

    float hash3(vec3 p) {
      p = fract(p * 0.3183099 + vec3(0.11, 0.17, 0.13));
      p *= 17.0;
      return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
    }

    vec3 studioEnv(vec3 r) {
      float top = smoothstep(0.15, 0.95, r.y);
      float key = smoothstep(0.86, 0.99, 1.0 - abs(r.x - 0.5)) * smoothstep(-0.3, 0.55, r.y);
      float fill = smoothstep(0.9, 1.0, 1.0 - abs(r.x + 0.68)) * smoothstep(-0.6, 0.25, r.y);
      float floorB = smoothstep(-0.2, -0.9, r.y) * 0.18;
      float horizon = exp(-abs(r.y + 0.05) * 7.0) * 0.32;
      return vec3(0.015, 0.016, 0.03)
        + vec3(0.5, 0.56, 0.72) * top * 0.42
        + vec3(1.0, 0.98, 1.0) * key * 1.15
        + vec3(0.78, 0.48, 1.0) * fill * 0.85
        + uAccent * horizon
        + vec3(0.25, 0.12, 0.35) * floorB;
    }

    void main() {
      vec3 N = normalize(vN);
      if (!gl_FrontFacing) N = -N;
      vec3 V = normalize(cameraPosition - vW);
      float ndv = clamp(dot(N, V), 0.0, 1.0);
      float fres = pow(1.0 - ndv, 3.0);
      vec3 R = reflect(-V, N);
      vec3 env = studioEnv(R);

      // Oil-slick thin-film iridescence
      float film = ndv * 1.7
        + sin(vObj.x * 4.6 + vObj.y * 6.8 + vObj.z * 3.9 + uTime * 0.25) * 0.32
        + sin(vObj.y * 11.0 - vObj.z * 7.0) * 0.12
        + vSeed * 2.0;
      vec3 irid = 0.5 + 0.5 * cos(6.28318 * (vec3(0.0, 0.33, 0.67) + film));

      vec3 base = vec3(0.018, 0.02, 0.035);
      vec3 col = base + env * mix(vec3(0.46, 0.47, 0.55), irid, 0.5);
      col += irid * fres * 0.42;

      // Cavity darkening for depth
      float cavity = smoothstep(-0.6, 0.4, dot(N, normalize(vec3(0.2, 0.6, 0.75))));
      col *= 0.55 + 0.45 * cavity;

      // Surface glitter sparkles
      vec3 cell = floor(vObj * 34.0);
      float h = hash3(cell + vSeed * 13.0);
      float tw = 0.5 + 0.5 * sin(uTime * 3.0 + h * 40.0);
      float sparkle = step(0.962, h) * (0.35 + 0.65 * tw) * (0.4 + 0.6 * pow(max(dot(R, normalize(vec3(0.45, 0.75, 0.55))), 0.0), 1.5));
      vec3 sc = 0.5 + 0.5 * cos(6.28318 * (vec3(0.0, 0.33, 0.67) + h * 7.0));
      col += sc * sparkle * 1.25;

      // Glowing horn / spike tips (cyan-ice like the reference)
      float tip = smoothstep(1.3, 2.25, length(vObj));
      vec3 tipCol = mix(vec3(0.35, 0.85, 1.0), uAccent, 0.25);
      col = mix(col, col + tipCol * (0.55 + 0.6 * fres), tip * 0.85);

      float d = length(cameraPosition - vW);
      col = mix(col, uFogColor, smoothstep(1500.0, 2300.0, d) * 0.85);
      gl_FragColor = vec4(col, 1.0);
    }
  `;

  const GLITTER_VERTEX = `
    attribute vec3 aColor;
    attribute vec4 aData; // x: radiusFactor, y: phase, z: size, w: speed
    uniform float uTime;
    uniform float uScroll;
    uniform float uBoost;
    uniform float uSpin;
    uniform float uHeight;
    uniform float uPixelRatio;
    varying vec3 vColor;
    varying float vAlpha;
    void main() {
      vec3 p = position;
      // Vertical wrap linked to scroll (moves with the spine)
      float H = uHeight;
      p.y = mod(p.y + uScroll * 95.0 * aData.w + H * 0.5, H) - H * 0.5;
      // Orbit around the spine axis
      float ang = uSpin * (0.55 + aData.w * 0.45) / (0.6 + aData.x * 0.6);
      float c = cos(ang), s = sin(ang);
      p.xz = mat2(c, -s, s, c) * p.xz;
      // Scroll-velocity burst + idle turbulence
      p.xz *= 1.0 + uBoost * 0.22;
      p += vec3(
        sin(uTime * 0.6 * aData.w + aData.y * 6.28) * 9.0,
        cos(uTime * 0.45 * aData.w + aData.y * 4.0) * 7.0,
        sin(uTime * 0.5 + aData.y * 9.0) * 9.0
      );
      vec4 mv = modelViewMatrix * vec4(p, 1.0);
      gl_Position = projectionMatrix * mv;
      float persp = ${PERSPECTIVE_PX.toFixed(1)} / max(1.0, -mv.z);
      gl_PointSize = aData.z * persp * uPixelRatio;
      vColor = aColor;
      float edgeFade = 1.0 - smoothstep(H * 0.36, H * 0.5, abs(p.y));
      float twinkle = 0.75 + 0.25 * sin(uTime * 2.2 + aData.y * 50.0);
      vAlpha = edgeFade * twinkle * smoothstep(0.0, 0.35, persp);
    }
  `;

  const GLITTER_FRAGMENT = `
    varying vec3 vColor;
    varying float vAlpha;
    void main() {
      vec2 uv = gl_PointCoord - 0.5;
      float r = length(uv);
      if (r > 0.5) discard;
      float disc = 1.0 - smoothstep(0.34, 0.5, r);
      float core = 1.0 - smoothstep(0.0, 0.22, r);
      vec3 col = vColor * (0.85 + core * 0.45);
      gl_FragColor = vec4(col, disc * vAlpha * 0.92);
    }
  `;

  function create(planeEl) {
    const THREE = window.THREE;
    if (!THREE || !planeEl || !supportsWebGL()) return null;

    const canvas = document.createElement('canvas');
    canvas.className = 'at-work-gl-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none;transition:opacity .45s ease;';

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch (_) {
      return null;
    }
    renderer.setClearColor(0x000000, 0);
    planeEl.appendChild(canvas);

    let failed = false;
    canvas.addEventListener('webglcontextlost', (e) => {
      e.preventDefault();
      failed = true;
      canvas.style.display = 'none';
    }, false);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 1, 10, 6000);
    camera.position.set(0, 0, PERSPECTIVE_PX);
    camera.lookAt(0, 0, 0);

    const fogColor = new THREE.Color(0x07070f);
    const accentColor = new THREE.Color(0x00e5ff);
    const chromeUniforms = {
      uTime: { value: 0 },
      uFogColor: { value: new THREE.Vector3(fogColor.r, fogColor.g, fogColor.b) },
      uAccent: { value: new THREE.Vector3(0.0, 0.9, 1.0) }
    };

    // ---- Chrome vertebrae --------------------------------------------------
    const vertGeo = buildVertebraGeometry(THREE);
    const vSeeds = new Float32Array(MAX_LEVELS);
    vertGeo.setAttribute('aSeed', new THREE.InstancedBufferAttribute(vSeeds, 1));
    const chromeMat = new THREE.ShaderMaterial({
      uniforms: chromeUniforms,
      vertexShader: CHROME_VERTEX,
      fragmentShader: CHROME_FRAGMENT
    });
    const vertebrae = new THREE.InstancedMesh(vertGeo, chromeMat, MAX_LEVELS);
    vertebrae.frustumCulled = false;
    vertebrae.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    scene.add(vertebrae);

    // ---- Intervertebral discs ---------------------------------------------
    const discGeo = new THREE.SphereGeometry(1, 40, 16);
    const dSeeds = new Float32Array(MAX_LEVELS);
    discGeo.setAttribute('aSeed', new THREE.InstancedBufferAttribute(dSeeds, 1));
    const discs = new THREE.InstancedMesh(discGeo, chromeMat, MAX_LEVELS);
    discs.frustumCulled = false;
    discs.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    scene.add(discs);

    // ---- Glitter particle clouds ------------------------------------------
    const total = CLUSTER_COUNT * PARTICLES_PER_CLUSTER;
    const gPos = new Float32Array(total * 3);
    const gCol = new Float32Array(total * 3);
    const gData = new Float32Array(total * 4);
    let gi = 0;
    for (let c = 0; c < CLUSTER_COUNT; c++) {
      const side = hash(c * 3.1) < 0.5 ? -1 : 1;
      const cr = 90 + Math.pow(hash(c * 5.7), 0.9) * 520;       // distance from spine
      const ca = hash(c * 9.3) * Math.PI * 2;
      const cy = (hash(c * 2.3) - 0.5) * 2.0;                   // normalised height
      const sigma = 24 + hash(c * 4.9) * 46;
      const palA = Math.floor(hash(c * 6.1) * GLITTER_COLORS.length);
      const palB = (palA + 1 + Math.floor(hash(c * 7.7) * 3)) % GLITTER_COLORS.length;
      for (let k = 0; k < PARTICLES_PER_CLUSTER; k++) {
        const seed = c * 1000 + k;
        // Gaussian-ish billow via sum of randoms
        const gx = (hash(seed * 1.1) + hash(seed * 1.3) + hash(seed * 1.7) - 1.5) * 1.6;
        const gy = (hash(seed * 2.1) + hash(seed * 2.3) + hash(seed * 2.9) - 1.5) * 1.9;
        const gz = (hash(seed * 3.1) + hash(seed * 3.7) + hash(seed * 3.9) - 1.5) * 1.6;
        const bx = Math.cos(ca) * cr * side;
        const bz = Math.sin(ca) * cr * 0.55;
        gPos[gi * 3] = bx + gx * sigma;
        gPos[gi * 3 + 1] = cy * 600 + gy * sigma;
        gPos[gi * 3 + 2] = bz + gz * sigma;
        const pal = GLITTER_COLORS[hash(seed * 4.4) < 0.62 ? palA : palB];
        const tint = 0.78 + hash(seed * 5.5) * 0.3;
        gCol[gi * 3] = Math.min(1, pal[0] * tint);
        gCol[gi * 3 + 1] = Math.min(1, pal[1] * tint);
        gCol[gi * 3 + 2] = Math.min(1, pal[2] * tint);
        gData[gi * 4] = cr / 700;
        gData[gi * 4 + 1] = hash(seed * 6.6);
        gData[gi * 4 + 2] = 3.0 + Math.pow(hash(seed * 7.3), 2.0) * 6.0;
        gData[gi * 4 + 3] = 0.65 + hash(seed * 8.1) * 0.7;
        gi++;
      }
    }
    // Fine dust stars spread across the whole stage
    const glitterGeo = new THREE.BufferGeometry();
    glitterGeo.setAttribute('position', new THREE.BufferAttribute(gPos, 3));
    glitterGeo.setAttribute('aColor', new THREE.BufferAttribute(gCol, 3));
    glitterGeo.setAttribute('aData', new THREE.BufferAttribute(gData, 4));
    const glitterUniforms = {
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uBoost: { value: 0 },
      uSpin: { value: 0 },
      uHeight: { value: 1600 },
      uPixelRatio: { value: 1 }
    };
    const glitterMat = new THREE.ShaderMaterial({
      uniforms: glitterUniforms,
      vertexShader: GLITTER_VERTEX,
      fragmentShader: GLITTER_FRAGMENT,
      transparent: true,
      depthWrite: false
    });
    const glitter = new THREE.Points(glitterGeo, glitterMat);
    glitter.frustumCulled = false;
    glitter.renderOrder = 2;
    scene.add(glitter);

    // ---- Per-frame helpers -------------------------------------------------
    const m4 = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const vPos = new THREE.Vector3();
    const vScale = new THREE.Vector3();
    const eul = new THREE.Euler(0, 0, 0, 'YXZ');

    let curW = 0;
    let curH = 0;
    let lastAccent = '';
    const t0 = performance.now();

    function resize(w, h) {
      if (w === curW && h === curH) return;
      curW = w;
      curH = h;
      const pr = Math.min(window.devicePixelRatio || 1, 1.6);
      renderer.setPixelRatio(pr);
      renderer.setSize(w, h, false);
      camera.aspect = w / Math.max(1, h);
      camera.fov = (2 * Math.atan((h / 2) / PERSPECTIVE_PX) * 180) / Math.PI;
      camera.updateProjectionMatrix();
      glitterUniforms.uPixelRatio.value = pr;
      glitterUniforms.uHeight.value = h * 1.9;
    }

    function render(state) {
      if (failed) return;
      const w = Math.max(1, Math.round(state.vw || 1));
      const h = Math.max(1, Math.round(state.vh || 1));
      resize(w, h);

      if (state.hidden) {
        canvas.style.opacity = '0';
        return;
      }
      canvas.style.opacity = '1';

      const scroll = state.scrollCurrent || 0;
      const vAngle = state.vortexAngle || 0;
      const boost = state.vortexBoost || 0;
      const time = (performance.now() - t0) / 1000;
      chromeUniforms.uTime.value = time;

      if (state.accent && state.accent !== lastAccent) {
        lastAccent = state.accent;
        try { accentColor.set(state.accent); } catch (_) {}
        chromeUniforms.uAccent.value.set(accentColor.r, accentColor.g, accentColor.b);
      }

      // Spine stack (DOM y grows downward; three y grows upward)
      const H = h + 360;
      const scrollPx = scroll * 145;
      const base = scrollPx / VERT_SPACING;
      const baseFloor = Math.floor(base);
      const baseFrac = base - baseFloor;
      const levels = Math.min(MAX_LEVELS, Math.ceil(H / VERT_SPACING) + 2);
      const isMob = w < 900;
      const unit = isMob ? 34 : 46;

      for (let s = 0; s < levels; s++) {
        const world = s + baseFloor;
        const domY = (s - baseFrac) * VERT_SPACING - H / 2 + 30;
        const yN = domY / (h / 2); // -1 top .. +1 bottom
        const taper = 1.08 - Math.max(-1.2, Math.min(1.2, yN)) * 0.1;
        const sd = hash(world * 1.37);
        const twist = vAngle * 0.55 - scroll * 0.9 + world * 0.16 + Math.sin(world * 0.45) * 0.22 + (sd - 0.5) * 0.55;

        eul.set(0.22 + yN * -0.18 + (sd - 0.5) * 0.12, twist, (sd - 0.5) * 0.16, 'YXZ');
        q.setFromEuler(eul);
        vPos.set(Math.sin(world * 0.37) * 4, -domY, 0);
        const sc = unit * taper * (0.86 + sd * 0.28);
        vScale.set(sc, sc * (0.95 + sd * 0.1), sc);
        m4.compose(vPos, q, vScale);
        vertebrae.setMatrixAt(s, m4);
        vSeeds[s] = sd;

        // Disc sits between this vertebra and the next one
        eul.set(0.1, twist + 0.4, 0, 'YXZ');
        q.setFromEuler(eul);
        vPos.set(Math.sin(world * 0.37 + 0.2) * 4, -(domY + VERT_SPACING * 0.5), 0);
        vScale.set(sc * 0.78, sc * 0.2, sc * 0.72);
        m4.compose(vPos, q, vScale);
        discs.setMatrixAt(s, m4);
        dSeeds[s] = hash(world * 2.71);
      }
      vertebrae.count = levels;
      discs.count = levels;
      vertebrae.instanceMatrix.needsUpdate = true;
      discs.instanceMatrix.needsUpdate = true;
      vertGeo.attributes.aSeed.needsUpdate = true;
      discGeo.attributes.aSeed.needsUpdate = true;

      // Glitter clouds
      glitterUniforms.uTime.value = time;
      glitterUniforms.uScroll.value = scroll;
      glitterUniforms.uBoost.value = Math.min(1.6, boost);
      glitterUniforms.uSpin.value = vAngle * 0.35 - scroll * 0.55;

      renderer.render(scene, camera);
    }

    return {
      render,
      isFailed: () => failed,
      canvas
    };
  }

  window.MediqATSpineGL = { create };
})();
