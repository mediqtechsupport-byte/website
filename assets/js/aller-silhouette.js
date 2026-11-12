/**
 * Aller Studio 3D Humanoid Bust + Particle Dispersion + ASCII Face Matrix
 * Ported directly from https://www.allerstudio.com/ (createSilhouette + parseMesh + ASCII cursor matrix)
 * Integrated into MediQ Brands & Partners Main Landing Page (#brands Slide 0)
 */
(function () {
  'use strict';

  const CFG = {
    frameHalfH: 0.352,
    target: [0.0, 0.635],
    boxAspect: null,
    baseYaw: -0.7,
    headMaxYaw: 0.85,
    lookYaw: 1.0,
    lookPitch: 0.5,
    bodyFollow: 0.22,
    headSpeed: 3.2,
    idleAfter: 2.8,
    particles: 79200,
    cornerAim: [1, 1],
    dustAngle: 0,
    dustFan: 28,
    dustBirthEdge: 0.3,
    dustZones: [0.68, 0.2, 0.12],
    shoulderShare: 0.1,
    shoulderFlakes: 0.06,
    leftDust: 9500,
    leftAngle: 174,
    leftFan: 54,
    leftReach: 0.68,
    leftY: [0.36, 0.64],
    leftFlakes: 0.06,
    faceShare: 0.22,
    faceY: [0.72, 0.93],
    flakes: 1328,
    pecFlakes: 700,
    pecBox: [0.04, 0.26, 0.4, 0.62],
    lime: [0.22, 0.74, 0.98],
    limeShare: 0.045,
    mouseRepel: 1.0,
    particleSize: 1.15,
    dustReach: 0.45,
    dustFade: 0.65,
    keyDir: [0.75, 0.35, -0.55],
    key: 1.05,
    fillDir: [-0.85, 0.25, 0.45],
    fill: 0.52,
    frontDir: [-0.7, 0.62, 0.35],
    front: 0.9,
    frontGrain: 1.18,
    topDir: [0.1, 1.0, 0.15],
    top: 0.85,
    lightAlpha: 0.62,
    rimAlpha: 0.9,
    neckLo: 0.56,
    neckHi: 0.76,
    spec: 0.06,
    grainPx: 3.4,
    ridge: 1.28,
    chestGrain: 0.48,
    tone: 0.035,
    shade: 1.55,
    flakeShare: 0.00455,
    flakeSpeed: 0.585,
    flakeTravel: 1.8,
    flakeGap: 0.016
  };

  function parseMesh(buffer) {
    const view = new DataView(buffer);
    const vertexCount = view.getUint32(4, true);
    const indexCount = view.getUint32(8, true);
    const min = [
      view.getFloat32(12, true),
      view.getFloat32(16, true),
      view.getFloat32(20, true)
    ];
    const max = [
      view.getFloat32(24, true),
      view.getFloat32(28, true),
      view.getFloat32(32, true)
    ];
    let offset = 36;
    const quantPos = new Uint16Array(buffer.slice(offset, offset + 6 * vertexCount));
    offset += 6 * vertexCount;
    const nrm = new Int8Array(buffer.slice(offset, offset + 3 * vertexCount));
    offset += 3 * vertexCount;
    const crv = new Int8Array(buffer.slice(offset, offset + vertexCount));
    offset += vertexCount;
    if (offset % 2) offset++;
    const idx = new Uint16Array(buffer.slice(offset, offset + 2 * indexCount));
    const pos = new Float32Array(3 * vertexCount);
    for (let i = 0; i < 3 * vertexCount; i++) {
      const axis = i % 3;
      pos[i] = min[axis] + (quantPos[i] / 65535) * (max[axis] - min[axis]);
    }
    return appendSculptedHandMesh({ pos, nrm, crv, idx }, CFG.baseYaw);
  }

  // 3D World-Space Anchor (at CFG.baseYaw) for the Globe & the 5 Articulated Fingers Cupping Its Base
  const HAND_GLOBE_WORLD = {
    center: [-0.156, 0.580, 0.168],
    radius: 0.090,
    palmCenter: [-0.158, 0.474, 0.170]
  };

  const HAND_FINGERS_WORLD = [
    // 0: Thumb (Opposable radial side cradling lower-left of the globe)
    {
      name: 'thumb',
      nodes: [
        { p: [-0.188, 0.456, 0.154], rx: 0.0145, ry: 0.013, crv: 20 },
        { p: [-0.212, 0.476, 0.172], rx: 0.0125, ry: 0.011, crv: 26 },
        { p: [-0.224, 0.498, 0.188], rx: 0.0102, ry: 0.009, crv: 32 },
        { p: [-0.218, 0.518, 0.198], rx: 0.0080, ry: 0.007, crv: 36 }
      ]
    },
    // 1: Index Finger (Lower front-left cradle of globe)
    {
      name: 'index',
      nodes: [
        { p: [-0.188, 0.468, 0.178], rx: 0.0115, ry: 0.0105, crv: 22 },
        { p: [-0.198, 0.484, 0.204], rx: 0.0100, ry: 0.0090, crv: 28 },
        { p: [-0.195, 0.502, 0.220], rx: 0.0085, ry: 0.0075, crv: 33 },
        { p: [-0.186, 0.518, 0.226], rx: 0.0070, ry: 0.0062, crv: 37 }
      ]
    },
    // 2: Middle Finger (Lower front-center cradle of globe)
    {
      name: 'middle',
      nodes: [
        { p: [-0.164, 0.466, 0.184], rx: 0.0120, ry: 0.0110, crv: 22 },
        { p: [-0.168, 0.482, 0.212], rx: 0.0105, ry: 0.0094, crv: 28 },
        { p: [-0.164, 0.501, 0.228], rx: 0.0088, ry: 0.0078, crv: 34 },
        { p: [-0.160, 0.519, 0.233], rx: 0.0072, ry: 0.0064, crv: 38 }
      ]
    },
    // 3: Ring Finger (Lower front-right cradle of globe)
    {
      name: 'ring',
      nodes: [
        { p: [-0.141, 0.467, 0.180], rx: 0.0112, ry: 0.0102, crv: 22 },
        { p: [-0.136, 0.483, 0.206], rx: 0.0096, ry: 0.0086, crv: 27 },
        { p: [-0.134, 0.500, 0.222], rx: 0.0082, ry: 0.0074, crv: 32 },
        { p: [-0.136, 0.516, 0.226], rx: 0.0068, ry: 0.0060, crv: 36 }
      ]
    },
    // 4: Little Finger / Pinky (Lower outer-right cradle of globe)
    {
      name: 'pinky',
      nodes: [
        { p: [-0.121, 0.470, 0.168], rx: 0.0096, ry: 0.0088, crv: 20 },
        { p: [-0.111, 0.484, 0.192], rx: 0.0084, ry: 0.0078, crv: 26 },
        { p: [-0.108, 0.500, 0.205], rx: 0.0072, ry: 0.0066, crv: 31 },
        { p: [-0.112, 0.514, 0.210], rx: 0.0060, ry: 0.0054, crv: 35 }
      ]
    }
  ];

  function appendSculptedHandMesh(baseMesh, baseYaw) {
    const cosB = Math.cos(baseYaw);
    const sinB = Math.sin(baseYaw);
    const extraPos = [];
    const extraNrm = [];
    const extraCrv = [];
    const extraIdx = [];
    const handStartVertex = baseMesh.pos.length / 3;
    let nextVert = handStartVertex;

    // Convert baseYaw-aligned world coordinates [wx, wy, wz] into mesh local space [lx, ly, lz]
    function pushWorldVertex(wx, wy, wz, nx, ny, nz, crvVal) {
      const lx = cosB * wx - sinB * wz;
      const ly = wy;
      const lz = sinB * wx + cosB * wz;

      const lnx = cosB * nx - sinB * nz;
      const lny = ny;
      const lnz = sinB * nx + cosB * nz;
      const nLen = Math.hypot(lnx, lny, lnz) || 1;

      extraPos.push(lx, ly, lz);
      extraNrm.push(
        Math.max(-127, Math.min(127, Math.round((lnx / nLen) * 127))),
        Math.max(-127, Math.min(127, Math.round((lny / nLen) * 127))),
        Math.max(-127, Math.min(127, Math.round((lnz / nLen) * 127)))
      );
      extraCrv.push(Math.max(-127, Math.min(127, Math.round(crvVal))));
      return nextVert++;
    }

    function catmullRom(v0, v1, v2, v3, t) {
      const t2 = t * t;
      const t3 = t2 * t;
      return (
        0.5 *
        (2 * v1 +
          (-v0 + v2) * t +
          (2 * v0 - 5 * v1 + 4 * v2 - v3) * t2 +
          (-v0 + 3 * v1 - 3 * v2 + v3) * t3)
      );
    }

    function addLoftedTube(nodes, radialSegs, stepsPerSeg, capEnd) {
      const samples = [];
      const n = nodes.length;
      for (let i = 0; i < n - 1; i++) {
        const n0 = nodes[Math.max(0, i - 1)];
        const n1 = nodes[i];
        const n2 = nodes[i + 1];
        const n3 = nodes[Math.min(n - 1, i + 2)];
        const steps = i === n - 2 ? stepsPerSeg : stepsPerSeg;
        for (let s = 0; s < steps; s++) {
          const t = s / steps;
          samples.push({
            p: [
              catmullRom(n0.p[0], n1.p[0], n2.p[0], n3.p[0], t),
              catmullRom(n0.p[1], n1.p[1], n2.p[1], n3.p[1], t),
              catmullRom(n0.p[2], n1.p[2], n2.p[2], n3.p[2], t)
            ],
            rx: n1.rx + (n2.rx - n1.rx) * t,
            ry: n1.ry + (n2.ry - n1.ry) * t,
            crv: n1.crv + (n2.crv - n1.crv) * t
          });
        }
      }
      const last = nodes[n - 1];
      samples.push({
        p: [last.p[0], last.p[1], last.p[2]],
        rx: last.rx,
        ry: last.ry,
        crv: last.crv
      });

      const rings = [];
      for (let s = 0; s < samples.length; s++) {
        const prev = samples[Math.max(0, s - 1)].p;
        const next = samples[Math.min(samples.length - 1, s + 1)].p;
        let tx = next[0] - prev[0];
        let ty = next[1] - prev[1];
        let tz = next[2] - prev[2];
        const tLen = Math.hypot(tx, ty, tz) || 1;
        tx /= tLen;
        ty /= tLen;
        tz /= tLen;

        // Reference up/side vector to build orthogonal cross-section frame (B1 = medio-lateral, B2 = dorso-palmar)
        let ux = 1,
          uy = 0,
          uz = 0;
        if (Math.abs(tx) > 0.85) {
          ux = 0;
          uy = 1;
          uz = 0;
        }
        // B2 = normalize(cross(T, U))
        let b2x = ty * uz - tz * uy;
        let b2y = tz * ux - tx * uz;
        let b2z = tx * uy - ty * ux;
        const b2Len = Math.hypot(b2x, b2y, b2z) || 1;
        b2x /= b2Len;
        b2y /= b2Len;
        b2z /= b2Len;

        // B1 = cross(B2, T)
        const b1x = b2y * tz - b2z * ty;
        const b1y = b2z * tx - b2x * tz;
        const b1z = b2x * ty - b2y * tx;

        const ring = [];
        const smp = samples[s];
        for (let j = 0; j < radialSegs; j++) {
          const theta = (j / radialSegs) * Math.PI * 2;
          const ct = Math.cos(theta);
          const st = Math.sin(theta);
          // Subtle anatomical palmar flattening on the inner side and knuckle ridge on the dorsal side
          const flat = st > 0 ? 0.86 : 1.04;
          const ox = ct * smp.rx;
          const oy = st * smp.ry * flat;

          const wx = smp.p[0] + b1x * ox + b2x * oy;
          const wy = smp.p[1] + b1y * ox + b2y * oy;
          const wz = smp.p[2] + b1z * ox + b2z * oy;

          const nx = b1x * (ct / smp.rx) + b2x * (st / smp.ry);
          const ny = b1y * (ct / smp.rx) + b2y * (st / smp.ry);
          const nz = b1z * (ct / smp.rx) + b2z * (st / smp.ry);

          ring.push(pushWorldVertex(wx, wy, wz, nx, ny, nz, smp.crv));
        }
        rings.push({ indices: ring, tx, ty, tz, b1x, b1y, b1z, b2x, b2y, b2z, smp });
      }

      // Stitch adjacent rings into triangles
      for (let s = 0; s < rings.length - 1; s++) {
        const rA = rings[s].indices;
        const rB = rings[s + 1].indices;
        for (let j = 0; j < radialSegs; j++) {
          const jNext = (j + 1) % radialSegs;
          extraIdx.push(rA[j], rB[j], rB[jNext]);
          extraIdx.push(rA[j], rB[jNext], rA[jNext]);
        }
      }

      // Rounded hemispherical fingertip / palm dome cap at the end of the tube
      if (capEnd && rings.length > 0) {
        const endR = rings[rings.length - 1];
        const smp = endR.smp;
        const tipCenterIdx = pushWorldVertex(
          smp.p[0] + endR.tx * smp.rx * 0.75,
          smp.p[1] + endR.ty * smp.rx * 0.75,
          smp.p[2] + endR.tz * smp.rx * 0.75,
          endR.tx,
          endR.ty,
          endR.tz,
          smp.crv + 8
        );
        const lastRing = endR.indices;
        for (let j = 0; j < radialSegs; j++) {
          const jNext = (j + 1) % radialSegs;
          extraIdx.push(lastRing[j], lastRing[jNext], tipCenterIdx);
        }
      }
    }

    // 1. Sculpted Upper-Arm -> Elbow -> Forearm -> Wrist -> Cupped Metacarpal Palm
    addLoftedTube(
      [
        { p: [-0.124, 0.492, -0.034], rx: 0.044, ry: 0.040, crv: 14 },
        { p: [-0.142, 0.392, 0.002], rx: 0.040, ry: 0.036, crv: 16 },
        { p: [-0.152, 0.362, 0.046], rx: 0.036, ry: 0.032, crv: 18 },
        { p: [-0.158, 0.392, 0.096], rx: 0.033, ry: 0.027, crv: 20 },
        { p: [-0.159, 0.436, 0.138], rx: 0.027, ry: 0.019, crv: 22 },
        { p: [-0.158, 0.464, 0.162], rx: 0.040, ry: 0.017, crv: 26 },
        { p: [-0.158, 0.474, 0.182], rx: 0.042, ry: 0.014, crv: 30 }
      ],
      24,
      5,
      true
    );

    // 2. Thenar Eminence (Thumb Base Muscle Pad on Outer-Left Palm)
    addLoftedTube(
      [
        { p: [-0.172, 0.438, 0.140], rx: 0.017, ry: 0.014, crv: 20 },
        { p: [-0.186, 0.456, 0.156], rx: 0.020, ry: 0.016, crv: 25 },
        { p: [-0.198, 0.470, 0.170], rx: 0.016, ry: 0.013, crv: 28 }
      ],
      14,
      4,
      true
    );

    // 3. Hypothenar Eminence (Ulnar Muscle Pad on Outer-Right Palm)
    addLoftedTube(
      [
        { p: [-0.144, 0.440, 0.142], rx: 0.015, ry: 0.013, crv: 20 },
        { p: [-0.132, 0.458, 0.160], rx: 0.018, ry: 0.014, crv: 24 },
        { p: [-0.122, 0.470, 0.172], rx: 0.014, ry: 0.011, crv: 28 }
      ],
      14,
      4,
      true
    );

    // 4. Five Articulated Fingers Cupping the Lower Hemisphere of the Globe
    for (let f = 0; f < HAND_FINGERS_WORLD.length; f++) {
      addLoftedTube(HAND_FINGERS_WORLD[f].nodes, 16, 4, true);
    }

    const totalVerts = nextVert;
    const mergedPos = new Float32Array(3 * totalVerts);
    mergedPos.set(baseMesh.pos, 0);
    mergedPos.set(extraPos, baseMesh.pos.length);

    const mergedNrm = new Int8Array(3 * totalVerts);
    mergedNrm.set(baseMesh.nrm, 0);
    mergedNrm.set(extraNrm, baseMesh.nrm.length);

    const mergedCrv = new Int8Array(totalVerts);
    mergedCrv.set(baseMesh.crv, 0);
    mergedCrv.set(extraCrv, baseMesh.crv.length);

    const mergedIdx = new Uint16Array(baseMesh.idx.length + extraIdx.length);
    mergedIdx.set(baseMesh.idx, 0);
    mergedIdx.set(extraIdx, baseMesh.idx.length);

    return {
      pos: mergedPos,
      nrm: mergedNrm,
      crv: mergedCrv,
      idx: mergedIdx,
      handStartVertex: handStartVertex
    };
  }

  function base64ToArrayBuffer(b64) {
    const bin = atob(b64);
    const len = bin.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = bin.charCodeAt(i);
    }
    return bytes.buffer;
  }

  async function loadSilhouetteBuffer() {
    try {
      const res = await fetch('assets/models/silhouette.bin');
      if (res.ok) {
        return await res.arrayBuffer();
      }
    } catch (_) {
      // Fallback for file:// protocol
    }
    if (window.ALLER_SILHOUETTE_B64) {
      return base64ToArrayBuffer(window.ALLER_SILHOUETTE_B64);
    }
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = 'assets/js/silhouette-mesh-data.js';
      s.onload = () => {
        if (window.ALLER_SILHOUETTE_B64) {
          resolve(base64ToArrayBuffer(window.ALLER_SILHOUETTE_B64));
        } else {
          reject(new Error('Aller mesh fallback empty'));
        }
      };
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  function asciiHash(e, t, n) {
    const a = 43758.5453 * Math.sin(127.1 * e + 311.7 * t + 74.7 * n);
    return a - Math.floor(a);
  }

  function createSilhouette(THREE, canvas, asciiCanvas, globeCanvas, meshData, opts) {
    const reduced = Boolean(opts && opts.reduced);
    const light = Boolean(opts && opts.light);
    const frame = (opts && opts.frame) || {
      halfH: CFG.frameHalfH,
      target: [CFG.target[0], CFG.target[1]],
      boxAspect: CFG.boxAspect
    };
    const particleDensity = light ? 0.45 : 1.0;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: !light,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(28, 1, 0.05, 10);
    const camTarget = new THREE.Vector3(frame.target[0], frame.target[1], 0);
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    const headDeformGLSL = `#define CFG_NECK_LO ${CFG.neckLo.toFixed(3)}
#define CFG_NECK_HI ${CFG.neckHi.toFixed(3)}
uniform float uYaw;
uniform float uPitch;
const vec3 PIVOT = vec3(0.0, 0.66, 0.012);
vec3 rotY(vec3 v, float a){ float c=cos(a), s=sin(a); return vec3(c*v.x + s*v.z, v.y, -s*v.x + c*v.z); }
vec3 rotX(vec3 v, float a){ float c=cos(a), s=sin(a); return vec3(v.x, c*v.y - s*v.z, s*v.y + c*v.z); }
float headW(vec3 p){
  float wy = smoothstep(CFG_NECK_LO, CFG_NECK_HI, p.y);
  float wx = mix(1.0 - smoothstep(0.05, 0.11, abs(p.x)), 1.0, smoothstep(0.69, 0.74, p.y));
  return wy * wx;
}
vec3 headDeform(vec3 p, float w){ vec3 q = p - PIVOT; q = rotY(rotX(q, uPitch * w), uYaw * w); return PIVOT + q; }
vec3 headNormal(vec3 n, float w){ return rotY(rotX(n, uPitch * w), uYaw * w); }`;

    const sharedUniforms = {
      uTime: { value: 0 },
      uYaw: { value: 0 },
      uPitch: { value: 0 },
      uScale: { value: 1000 },
      uMouse: { value: new THREE.Vector2(9, 9) },
      uMouseOn: { value: 0 },
      uCellFreq: { value: 800 },
      uCorner: { value: new THREE.Vector2(0.5, 0.25) },
      uFanR: { value: (CFG.dustFan * Math.PI) / 180 }
    };

    const { pos, nrm, crv, idx } = meshData;
    const vertexCount = pos.length / 3;
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geometry.setAttribute('normal', new THREE.BufferAttribute(nrm, 3, true));
    geometry.setAttribute('aCrv', new THREE.BufferAttribute(crv, 1, true));
    geometry.setIndex(new THREE.BufferAttribute(idx, 1));

    const normVec3 = (arr) => new THREE.Vector3(arr[0], arr[1], arr[2]).normalize();

    const bodyMaterial = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      transparent: true,
      uniforms: {
        uTime: sharedUniforms.uTime,
        uYaw: sharedUniforms.uYaw,
        uPitch: sharedUniforms.uPitch,
        uCellFreq: sharedUniforms.uCellFreq,
        uLime: { value: new THREE.Vector3(CFG.lime[0], CFG.lime[1], CFG.lime[2]) },
        uKeyDir: { value: normVec3(CFG.keyDir) },
        uKey: { value: CFG.key },
        uFillDir: { value: normVec3(CFG.fillDir) },
        uFill: { value: CFG.fill },
        uTopDir: { value: normVec3(CFG.topDir) },
        uTop: { value: CFG.top },
        uSpec: { value: CFG.spec },
        uTone: { value: CFG.tone },
        uShade: { value: CFG.shade },
        uFrontDir: { value: normVec3(CFG.frontDir) },
        uFront: { value: CFG.front },
        uRidge: { value: CFG.ridge },
        uFrontGrain: { value: CFG.frontGrain },
        uChest: { value: CFG.chestGrain },
        uLightA: { value: CFG.lightAlpha },
        uRimA: { value: CFG.rimAlpha }
      },
      vertexShader:
        headDeformGLSL +
        `
attribute float aCrv;
varying vec3 vN; varying vec3 vObj; varying vec3 vView; varying float vCrv;
void main(){
  vCrv = aCrv;
  float w = headW(position);
  vec3 p = headDeform(position, w);
  vObj = position;
  vN = normalize(normalMatrix * normalize(headNormal(normal, w)));
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  vView = -mv.xyz;
  gl_Position = projectionMatrix * mv;
}`,
      fragmentShader: `
uniform float uTime; uniform vec3 uLime; uniform float uCellFreq;
uniform vec3 uKeyDir, uFillDir, uTopDir; uniform float uKey, uFill, uTop, uSpec, uTone, uShade;
uniform vec3 uFrontDir; uniform float uFront, uRidge, uChest, uLightA, uFrontGrain, uRimA;
varying vec3 vN; varying vec3 vObj; varying vec3 vView; varying float vCrv;
float hash(vec3 p){ p = fract(p*0.3183099 + vec3(0.1,0.2,0.3)); p *= 17.0; return fract(p.x*p.y*p.z*(p.x+p.y+p.z)); }
float vnoise(vec3 p){
  vec3 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
  float a=hash(i), b=hash(i+vec3(1,0,0)), c=hash(i+vec3(0,1,0)), d=hash(i+vec3(1,1,0));
  float e=hash(i+vec3(0,0,1)), g=hash(i+vec3(1,0,1)), h=hash(i+vec3(0,1,1)), k=hash(i+vec3(1,1,1));
  return mix(mix(mix(a,b,f.x), mix(c,d,f.x), f.y), mix(mix(e,g,f.x), mix(h,k,f.x), f.y), f.z);
}
void main(){
  vec3 N = normalize(vN); if (!gl_FrontFacing) N = -N; vec3 V = normalize(vView);
  float fres = 1.0 - max(dot(N, V), 0.0);
  float y = vObj.y;
  vec3 cp = vObj * uCellFreq;
  cp += 2.2 * (vec3(vnoise(cp * 0.23), vnoise(cp * 0.23 + 17.0), vnoise(cp * 0.23 + 43.0)) - 0.5);
  vec3 cell = floor(cp);
  float h1 = hash(cell);
  float h2 = hash(cell + vec3(17.0, 3.0, 9.0));
  float h3 = hash(cell + vec3(5.0, 31.0, 2.0));
  float dc = length(fract(cp) - (vec3(h1, h3, h2) * 0.5 + 0.25));
  float key  = smoothstep(-0.20, 0.65, dot(N, uKeyDir)) * uKey;
  float fill = smoothstep(0.25, 1.0, dot(N, uFillDir)) * uFill;
  float top  = smoothstep(0.45, 1.0, dot(N, uTopDir)) * uTop;
  float front = pow(smoothstep(0.25, 1.0, dot(N, uFrontDir)), 1.4) * uFront;
  float ridge = smoothstep(0.24, 0.60, vCrv) * clamp(0.05 + front + 0.6 * key + 0.5 * top + 0.4 * fill, 0.0, 1.2) * uRidge;
  float spec = pow(max(dot(reflect(-V, N), uKeyDir), 0.0), 18.0) * uSpec;
  float edge = pow(fres, 2.0);
  float wk = 0.5 + 0.5 * dot(N, uKeyDir), wf = 0.5 + 0.5 * dot(N, uFillDir), wt = 0.5 + 0.5 * dot(N, uTopDir);
  float wr = 0.5 + 0.5 * dot(N, uFrontDir);
  vec3 navyShadow = vec3(0.026, 0.076, 0.172);
  vec3 col = navyShadow + uShade * (0.060 * wk * wk * uKey + 0.040 * wf * wf * uFill + 0.045 * wt * wt * uTop + 0.010 * wr * wr * wr * uFront);
  col += uShade * (0.030 * key + 0.012 * top);
  col += 0.050 * vnoise(cp * 0.25) * (0.15 + key);
  col += vec3(0.76, 0.90, 1.00) * spec;
  float bodyF = mix(uChest, 1.0, smoothstep(0.60, 0.74, y));
  float dens = (1.05 * key + 0.15 * fill + 0.75 * top + uFrontGrain * front) * bodyF + 0.20 * edge * (0.3 + key) + 1.60 * ridge;
  float gl = clamp(key + 0.85 * top + 0.45 * fill + 0.50 * front + ridge, 0.0, 1.0);
  float tw = 0.80 + 0.20 * sin(uTime * 2.2 + h3 * 40.0);
  float g = pow(clamp(dens, 0.0, 1.0), 0.75);
  if (h2 < g * 1.25 && dc < 0.18 + 0.30 * g) {
    float b = (0.50 + 0.50 * h1) * tw * (0.22 + 0.88 * gl);
    bool lime = h3 > 1.0 - 0.85 * pow(key, 1.5);
    vec3 sc = lime ? uLime : vec3(0.56, 0.70, 0.86) + vec3(0.22) * min(ridge, 1.0);
    float la = lime ? uRimA : mix(uLightA, uRimA, 0.5 * key);
    col = mix(col, sc * b, 0.94 * la);
  }
  col += (uLime * pow(fres, 2.4) * key * 0.16 + vec3(0.45, 0.77, 0.97) * pow(fres, 2.6) * 0.18) * uLightA;
  float bottomFade = smoothstep(0.308, 0.458, vObj.y);
  float rightShoulderFade = 1.0 - smoothstep(0.175, 0.258, vObj.x);
  float edgeAlpha = clamp(bottomFade * rightShoulderFade, 0.0, 1.0);
  vec3 bgNavy = vec3(0.039, 0.114, 0.251);
  col = mix(bgNavy, col, smoothstep(0.0, 0.65, edgeAlpha));
  gl_FragColor = vec4(col, edgeAlpha);
}`
    });

    const bodyMesh = new THREE.Mesh(geometry, bodyMaterial);
    bodyMesh.frustumCulled = false;
    rootGroup.add(bodyMesh);

    const particleVertShader =
      headDeformGLSL +
      `
attribute vec3 aDir; attribute vec4 aSeed; attribute float aSize;
uniform float uTime, uScale, uSpeed, uSpread, uMouseOn, uAlphaMul; uniform vec2 uCorner; uniform float uFanR;
uniform vec2 uMouse; uniform vec3 uLime; uniform float uLimeShare; uniform float uRepel; uniform float uFlakes; uniform float uAllFlakes;
uniform float uFlakeShare, uFlakeSpeed, uFlakeTravel, uReach, uFadeEnd;
varying float vAlpha; varying vec3 vCol; varying float vShape;
void main(){
  bool flake = uFlakes > 0.5 && (uAllFlakes > 0.5 || aSeed.w < uFlakeShare);
  float rate = (0.05 + 0.10 * aSeed.y) * (flake ? uFlakeSpeed : 1.0);
  float t = fract(uTime * rate * uSpeed + aSeed.x);
  vec3 p0 = headDeform(position, headW(position));
  float dist = pow(t, 1.6) * (0.12 + 0.50 * aSeed.y) * uSpread * uReach * (flake ? uFlakeTravel : 1.0);
  vec4 mv = modelViewMatrix * vec4(p0, 1.0);
  vec2 toC = uCorner * (-mv.z) - mv.xy;
  float a0 = atan(toC.y, toC.x) + (aSeed.z - 0.5) * uFanR;
  mv.xy += vec2(cos(a0), sin(a0)) * length(aDir) * dist;
  mv.z += aDir.z * dist;
  mv.xyz += vec3(sin(t*7.0 + aSeed.z*40.0), cos(t*6.0 + aSeed.w*40.0), sin(t*5.0 + aSeed.x*30.0)) * 0.008 * t * uSpread * uReach;
  vec2 dm = mv.xy - uMouse; float r = length(dm);
  mv.xy += normalize(dm + vec2(1e-5)) * 0.075 * exp(-r*r/0.012) * uMouseOn * uRepel;
  gl_Position = projectionMatrix * mv;
  gl_PointSize = max(aSize * uScale / (-mv.z), 1.0);
  float fade = smoothstep(0.0, 0.05, t) * (1.0 - smoothstep(uFadeEnd * 0.35, uFadeEnd, t));
  bool isLime = !flake && (aSeed.w > (1.0 - uLimeShare));
  vec3 fcol = aSeed.z < 0.46 ? uLime : (aSeed.z < 0.78 ? vec3(0.45, 0.77, 0.97) : vec3(0.84, 0.94, 1.00));
  vec3 dustCol = mix(vec3(0.30, 0.48, 0.68), vec3(0.82, 0.92, 0.99), aSeed.z * aSeed.z);
  vCol = flake ? fcol : (isLime ? uLime : dustCol);
  vShape = flake ? 1.0 : 0.0;
  vAlpha = fade * uAlphaMul * (isLime ? 0.96 : (flake ? (0.58 + 0.42 * aSeed.y) : (0.55 + 0.42 * aSeed.z)));
}`;

    const speedFactor = reduced ? 0.3 : 1.0;
    const limeVec = new THREE.Vector3(CFG.lime[0], CFG.lime[1], CFG.lime[2]);

    function createParticleLayer(count, generator, layerOpts) {
      const n = Math.round(count * particleDensity);
      const pArr = new Float32Array(3 * n);
      const dArr = new Float32Array(3 * n);
      const sArr = new Float32Array(4 * n);
      const szArr = new Float32Array(n);
      for (let i = 0; i < n; i++) {
        generator(i, pArr, dArr, sArr, szArr);
        szArr[i] *= CFG.particleSize;
      }
      const pGeo = new THREE.BufferGeometry();
      pGeo.setAttribute('position', new THREE.BufferAttribute(pArr, 3));
      pGeo.setAttribute('aDir', new THREE.BufferAttribute(dArr, 3));
      pGeo.setAttribute('aSeed', new THREE.BufferAttribute(sArr, 4));
      pGeo.setAttribute('aSize', new THREE.BufferAttribute(szArr, 1));

      const pMat = new THREE.ShaderMaterial({
        uniforms: {
          uTime: sharedUniforms.uTime,
          uYaw: sharedUniforms.uYaw,
          uPitch: sharedUniforms.uPitch,
          uScale: sharedUniforms.uScale,
          uMouse: sharedUniforms.uMouse,
          uMouseOn: sharedUniforms.uMouseOn,
          uCorner: sharedUniforms.uCorner,
          uFanR: sharedUniforms.uFanR,
          uSpeed: { value: speedFactor },
          uSpread: { value: 1.0 },
          uAlphaMul: { value: 1.0 },
          uRepel: { value: layerOpts.repel },
          uFlakes: { value: layerOpts.flakes ?? 0 },
          uAllFlakes: { value: layerOpts.allFlakes ?? 0 },
          uFlakeShare: { value: CFG.flakeShare },
          uFlakeSpeed: { value: CFG.flakeSpeed },
          uFlakeTravel: { value: CFG.flakeTravel },
          uReach: { value: CFG.dustReach },
          uFadeEnd: { value: CFG.dustFade },
          uLime: { value: limeVec },
          uLimeShare: { value: layerOpts.limeShare }
        },
        vertexShader: particleVertShader,
        fragmentShader: `varying float vAlpha; varying vec3 vCol; varying float vShape;
void main(){
  float r = length(gl_PointCoord - 0.5);
  float a = vShape > 0.5 ? 1.0 : smoothstep(0.5, 0.30, r);
  if (a < 0.01) discard;
  gl_FragColor = vec4(vCol, a * vAlpha);
}`,
        transparent: true,
        depthTest: true,
        depthWrite: false
      });

      const pts = new THREE.Points(pGeo, pMat);
      pts.frustumCulled = false;
      pts.renderOrder = 2;
      rootGroup.add(pts);
      return pts;
    }

    // Surface area cumulative distribution for uniform vertex sampling
    const cdf = new Float32Array(vertexCount);
    {
      const area = new Float32Array(vertexCount);
      for (let i = 0; i < idx.length; i += 3) {
        const i0 = 3 * idx[i],
          i1 = 3 * idx[i + 1],
          i2 = 3 * idx[i + 2];
        const ux = pos[i1] - pos[i0],
          uy = pos[i1 + 1] - pos[i0 + 1],
          uz = pos[i1 + 2] - pos[i0 + 2];
        const vx = pos[i2] - pos[i0],
          vy = pos[i2 + 1] - pos[i0 + 1],
          vz = pos[i2 + 2] - pos[i0 + 2];
        const cx = uy * vz - uz * vy,
          cy = uz * vx - ux * vz,
          cz = ux * vy - uy * vx;
        const triArea = Math.sqrt(cx * cx + cy * cy + cz * cz) / 6;
        area[idx[i]] += triArea;
        area[idx[i + 1]] += triArea;
        area[idx[i + 2]] += triArea;
      }
      let acc = 0;
      for (let i = 0; i < vertexCount; i++) {
        acc += area[i];
        cdf[i] = acc;
      }
    }
    const bodyVertCount = meshData.handStartVertex || vertexCount;
    const totalArea = cdf[bodyVertCount - 1];
    const sampleVertex = () => {
      const target = Math.random() * totalArea;
      let lo = 0,
        hi = bodyVertCount - 1;
      while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (cdf[mid] < target) lo = mid + 1;
        else hi = mid;
      }
      return lo;
    };

    const setDustDir = (arr, i, mag) => {
      const ang = ((CFG.dustAngle + (Math.random() - 0.5) * CFG.dustFan) * Math.PI) / 180;
      arr[3 * i] = Math.cos(ang) * mag;
      arr[3 * i + 1] = Math.sin(ang) * mag;
      arr[3 * i + 2] = (Math.random() - 0.5) * 0.25 * mag;
    };

    const cosBase = Math.cos(CFG.baseYaw),
      sinBase = Math.sin(CFG.baseYaw);
    const checkEdge = (vIdx, minDot) =>
      (cosBase * nrm[3 * vIdx]) / 127 + (sinBase * nrm[3 * vIdx + 2]) / 127 > minDot;
    const calcSize = (w) =>
      w < CFG.flakeShare
        ? 0.0009 + 0.0012 * Math.random()
        : 0.0005 + 0.0011 * Math.pow(Math.random(), 2);
    const setSeed = (arr, i, w) => {
      arr[4 * i] = Math.random();
      arr[4 * i + 1] = Math.random();
      arr[4 * i + 2] = Math.random();
      arr[4 * i + 3] = w;
    };
    const copyPos = (arr, i, vIdx, snap = 0) => {
      for (let k = 0; k < 3; k++) {
        arr[3 * i + k] = snap
          ? Math.round(pos[3 * vIdx + k] / snap) * snap
          : pos[3 * vIdx + k];
      }
    };

    // Layer 1: Main right-streaming dust & shoulder particles (79,200)
    createParticleLayer(
      CFG.particles,
      (i, pArr, dArr, sArr, szArr) => {
        const r = Math.random();
        const zones = CFG.dustZones;
        const isShoulder = Math.random() < CFG.shoulderShare;
        let vIdx = 0,
          tries = 0;
        if (isShoulder) {
          do {
            vIdx = sampleVertex();
            tries++;
          } while (
            (pos[3 * vIdx + 1] < 0.54 ||
              pos[3 * vIdx + 1] > 0.67 ||
              Math.abs(pos[3 * vIdx]) < 0.08 ||
              nrm[3 * vIdx + 1] < 50) &&
            tries < 600
          );
        } else {
          const yMin = r < zones[0] ? 0.3 : r < zones[0] + zones[1] ? 0.6 : 0.76;
          const yMax = r < zones[0] ? 0.66 : r < zones[0] + zones[1] ? 0.78 : 0.97;
          do {
            vIdx = sampleVertex();
            tries++;
          } while (
            (pos[3 * vIdx + 1] < yMin ||
              pos[3 * vIdx + 1] > yMax ||
              !checkEdge(vIdx, CFG.dustBirthEdge)) &&
            tries < 400
          );
        }
        copyPos(pArr, i, vIdx);
        setDustDir(dArr, i, 0.6 + 0.8 * Math.random());
        let w = Math.random();
        if (isShoulder && Math.random() < CFG.shoulderFlakes) {
          w = Math.random() * CFG.flakeShare * 0.99;
        }
        setSeed(sArr, i, w);
        szArr[i] = calcSize(w);
      },
      { repel: CFG.mouseRepel, limeShare: CFG.limeShare }
    );

    // Layer 2: Left-streaming dust around head & upper torso (7,000)
    createParticleLayer(
      CFG.leftDust,
      (i, pArr, dArr, sArr, szArr) => {
        const yRange = Math.random() < CFG.faceShare ? CFG.faceY : CFG.leftY;
        let vIdx = 0,
          tries = 0;
        do {
          vIdx = sampleVertex();
          tries++;
        } while (
          (pos[3 * vIdx + 1] < yRange[0] ||
            pos[3 * vIdx + 1] > yRange[1] ||
            checkEdge(vIdx, -0.35)) &&
          tries < 600
        );
        copyPos(pArr, i, vIdx);
        const ang = ((CFG.leftAngle + (Math.random() - 0.5) * CFG.leftFan) * Math.PI) / 180;
        const mag = (0.6 + 0.8 * Math.random()) * CFG.leftReach;
        dArr[3 * i] = Math.cos(ang) * mag;
        dArr[3 * i + 1] = Math.sin(ang) * mag;
        dArr[3 * i + 2] = (Math.random() - 0.5) * 0.25 * mag;
        let w = Math.random();
        if (Math.random() < CFG.leftFlakes) {
          w = Math.random() * CFG.flakeShare * 0.99;
        }
        setSeed(sArr, i, w);
        szArr[i] = calcSize(w);
      },
      { repel: CFG.mouseRepel, limeShare: 0 }
    );

    // Layer 3: Square digital flakes across shoulder/neck/head (1,328)
    const usedCells = new Set();
    const cellKey = (vIdx, gap) =>
      `${Math.round(pos[3 * vIdx] / gap)},${Math.round(pos[3 * vIdx + 1] / gap)},${Math.round(pos[3 * vIdx + 2] / gap)}`;

    createParticleLayer(
      CFG.flakes,
      (i, pArr, dArr, sArr, szArr) => {
        let vIdx = 0,
          tries = 0,
          prob = 0,
          key = '';
        do {
          vIdx = sampleVertex();
          const x = pos[3 * vIdx],
            y = pos[3 * vIdx + 1];
          const rx = 0.35 + 0.65 * Math.min(Math.max((x + 0.05) / 0.3, 0), 1);
          prob =
            y < 0.8
              ? rx * Math.min(Math.max((0.8 - y) / 0.35, 0), 1)
              : 0.35 * Math.min(Math.max((x - 0.02) / 0.06, 0), 1);
          tries++;
          key = cellKey(vIdx, CFG.flakeGap);
        } while ((Math.random() > prob + 0.04 || usedCells.has(key)) && tries < 400);
        usedCells.add(key);
        copyPos(pArr, i, vIdx, 0.0035);
        setDustDir(dArr, i, 0.6 + 0.6 * Math.random());
        setSeed(sArr, i, Math.random());
        szArr[i] = 0.001 + 0.0015 * Math.random();
      },
      { repel: 0.5 * CFG.mouseRepel, limeShare: 0, flakes: 1, allFlakes: 1 }
    );

    // Layer 4: Pectoral / upper chest square flakes (700)
    const pec = CFG.pecBox;
    createParticleLayer(
      CFG.pecFlakes,
      (i, pArr, dArr, sArr, szArr) => {
        let vIdx = 0,
          tries = 0,
          key = '',
          inside = false,
          prob = 0;
        do {
          vIdx = sampleVertex();
          tries++;
          const x = pos[3 * vIdx],
            y = pos[3 * vIdx + 1];
          inside =
            x > pec[0] && x < pec[1] && y > pec[2] && y < pec[3] && nrm[3 * vIdx + 2] > 20;
          prob = inside
            ? 0.35 +
              0.65 * ((x - pec[0]) / (pec[1] - pec[0])) * ((y - pec[2]) / (pec[3] - pec[2]))
            : 0;
          key = cellKey(vIdx, 0.4 * CFG.flakeGap);
        } while ((!inside || Math.random() > prob || usedCells.has(key)) && tries < 2000);
        usedCells.add(key);
        copyPos(pArr, i, vIdx, 0.0035);
        setDustDir(dArr, i, 0.6 + 0.6 * Math.random());
        setSeed(sArr, i, Math.random());
        szArr[i] = 0.001 + 0.0015 * Math.random();
      },
      { repel: 0.5 * CFG.mouseRepel, limeShare: 0, flakes: 1, allFlakes: 1 }
    );

    // Layer 5: Sculpted 3D Forearm, Wrist, Palm & 5 Fingers Particle & Digital Flake Dispersion (4,200)
    const handStart = meshData.handStartVertex || 0;
    const handCount = Math.max(1, vertexCount - handStart);
    if (handStart > 0 && handCount > 10) {
      createParticleLayer(
        4200,
        (i, pArr, dArr, sArr, szArr) => {
          const vIdx = handStart + Math.floor(Math.random() * handCount);
          copyPos(pArr, i, vIdx, i % 9 === 0 ? 0.003 : 0);
          const ang = ((110 + (Math.random() - 0.5) * 95) * Math.PI) / 180;
          const mag = (0.35 + 0.55 * Math.random()) * 0.52;
          dArr[3 * i] = Math.cos(ang) * mag;
          dArr[3 * i + 1] = Math.abs(Math.sin(ang)) * mag;
          dArr[3 * i + 2] = (Math.random() - 0.35) * 0.25 * mag;
          const isFlake = i % 9 === 0;
          const w = isFlake ? Math.random() * CFG.flakeShare * 0.95 : Math.random();
          setSeed(sArr, i, w);
          szArr[i] = isFlake ? 0.001 + 0.0013 * Math.random() : calcSize(w);
        },
        { repel: 0.75 * CFG.mouseRepel, limeShare: 0.08, flakes: 1, allFlakes: 0 }
      );
    }

    // 2D ASCII Matrix Overlay Context (Aller Studio module 57916 — MEDIQ Blue Palette)
    const asciiCtx = asciiCanvas ? asciiCanvas.getContext('2d') : null;
    const globeCtx = globeCanvas ? globeCanvas.getContext('2d') : null;
    const ASCII_CHARS = '.:-=+*#%@';
    const ASCII_COLORS = [
      { color: '#38bdf8', share: 0.065 },
      { color: '#72c5f8', share: 0.055 },
      { color: '#2563eb', share: 0.035 }
    ];

    // =========================================================================
    // WIREFRAME DOTTED GLOBE (RotatingEarth) + HUMANOID HOLDER ENGINE
    // =========================================================================
    const DEG2RAD = Math.PI / 180;
    const globeState = {
      rotLng: -116, // Centered initially toward Philippines & Asia-Pacific
      rotLat: -14,
      zoomScale: 1.0,
      autoRotate: true,
      rotationSpeed: 0.35,
      dragging: false,
      hovering: false,
      dragStartX: 0,
      dragStartY: 0,
      dragStartLng: -116,
      dragStartLat: -14,
      cx: 150,
      cy: 340,
      baseRadius: 118,
      allDots: [],
      landRings: []
    };

    // Offline continent coastline rings + High-res Philippine archipelago rings
    const OFFLINE_CONTINENT_RINGS = [
      // North America
      [[-165,64],[-140,69],[-110,66],[-82,62],[-65,58],[-55,47],[-75,35],[-81,25],[-90,21],[-84,9],[-78,8],[-88,14],[-105,20],[-112,30],[-124,42],[-135,57],[-165,64]],
      // South America
      [[-78,9],[-62,10],[-50,1],[-35,-6],[-38,-16],[-43,-23],[-54,-34],[-68,-54],[-74,-48],[-71,-30],[-76,-14],[-81,-4],[-78,9]],
      // Europe
      [[-9,37],[-9,43],[-4,48],[3,51],[9,55],[11,64],[25,70],[38,67],[48,55],[40,44],[28,41],[23,37],[15,38],[12,44],[5,43],[-5,36],[-9,37]],
      // United Kingdom
      [[-6,50],[-5,54],[-2,58],[1,53],[1,51],[-6,50]],
      // Africa
      [[-17,15],[-6,35],[10,37],[32,31],[43,12],[51,11],[40,-10],[35,-24],[20,-35],[14,-22],[9,-2],[9,4],[-8,5],[-17,15]],
      // Asia
      [[28,41],[48,55],[75,68],[115,72],[165,66],[142,52],[131,42],[121,39],[122,31],[114,22],[108,16],[104,1],[100,13],[90,22],[80,8],[72,20],[62,25],[50,29],[35,32],[28,41]],
      // Japan
      [[130,31],[136,35],[141,41],[145,44],[140,39],[134,33],[130,31]],
      // Australia
      [[114,-22],[129,-12],[142,-11],[153,-26],[148,-38],[136,-35],[122,-34],[114,-26],[114,-22]],
      // Borneo / Indonesia
      [[109,1],[117,6],[118,1],[114,-4],[109,1]],
      [[95,5],[105,-6],[114,-8],[104,-3],[95,5]]
    ];

    function buildInitialGlobeData() {
      globeState.landRings = OFFLINE_CONTINENT_RINGS.slice();
      if (Array.isArray(window.MEDIQ_PH_ISLANDS)) {
        for (let i = 0; i < window.MEDIQ_PH_ISLANDS.length; i++) {
          globeState.landRings.push(window.MEDIQ_PH_ISLANDS[i]);
        }
      }
      if (Array.isArray(window.MEDIQ_WORLD_DOTS) && window.MEDIQ_WORLD_DOTS.length > 0) {
        const src = window.MEDIQ_WORLD_DOTS;
        const dots = [];
        for (let i = 0; i < src.length; i++) {
          const lng = src[i][0] * 360 - 180;
          const lat = 76 - src[i][1] * 138;
          const isPH = lng >= 116.5 && lng <= 127.0 && lat >= 4.5 && lat <= 21.0;
          const isUK = lng >= -8.5 && lng <= 2.2 && lat >= 49.5 && lat <= 59.5;
          dots.push({ lng: lng, lat: lat, highlight: isPH ? 2 : isUK ? 1 : 0 });
        }
        globeState.allDots = dots;
      }
    }
    buildInitialGlobeData();

    // Point-in-polygon helpers ported directly from wireframe-dotted-globe.tsx
    function pointInPolygon(point, polygon) {
      const x = point[0],
        y = point[1];
      let inside = false;
      for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const xi = polygon[i][0],
          yi = polygon[i][1];
        const xj = polygon[j][0],
          yj = polygon[j][1];
        if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
          inside = !inside;
        }
      }
      return inside;
    }

    function pointInFeature(point, feature) {
      const geometry = feature && feature.geometry;
      if (!geometry) return false;
      if (geometry.type === 'Polygon') {
        const coordinates = geometry.coordinates;
        if (!pointInPolygon(point, coordinates[0])) return false;
        for (let i = 1; i < coordinates.length; i++) {
          if (pointInPolygon(point, coordinates[i])) return false;
        }
        return true;
      } else if (geometry.type === 'MultiPolygon') {
        for (let p = 0; p < geometry.coordinates.length; p++) {
          const polygon = geometry.coordinates[p];
          if (pointInPolygon(point, polygon[0])) {
            let inHole = false;
            for (let i = 1; i < polygon.length; i++) {
              if (pointInPolygon(point, polygon[i])) {
                inHole = true;
                break;
              }
            }
            if (!inHole) return true;
          }
        }
      }
      return false;
    }

    function getRingBounds(ring) {
      let minLng = 180,
        maxLng = -180,
        minLat = 90,
        maxLat = -90;
      for (let i = 0; i < ring.length; i++) {
        const lng = ring[i][0],
          lat = ring[i][1];
        if (lng < minLng) minLng = lng;
        if (lng > maxLng) maxLng = lng;
        if (lat < minLat) minLat = lat;
        if (lat > maxLat) maxLat = lat;
      }
      return [
        [minLng, minLat],
        [maxLng, maxLat]
      ];
    }

    function loadNaturalEarthData() {
      fetch(
        'https://raw.githubusercontent.com/martynafford/natural-earth-geojson/refs/heads/master/110m/physical/ne_110m_land.json'
      )
        .then((res) => {
          if (!res.ok) throw new Error('Network response not ok');
          return res.json();
        })
        .then((landFeatures) => {
          if (!landFeatures || !Array.isArray(landFeatures.features)) return;
          const rings = [];
          const newDots = [];
          const stepSize = 16 * 0.14; // Optimized high-density halftone spacing

          landFeatures.features.forEach((feature) => {
            const geom = feature.geometry;
            if (!geom) return;
            let fMinLng = 180,
              fMaxLng = -180,
              fMinLat = 90,
              fMaxLat = -90;

            const collectRing = (ring) => {
              rings.push(ring);
              const b = getRingBounds(ring);
              if (b[0][0] < fMinLng) fMinLng = b[0][0];
              if (b[0][1] < fMinLat) fMinLat = b[0][1];
              if (b[1][0] > fMaxLng) fMaxLng = b[1][0];
              if (b[1][1] > fMaxLat) fMaxLat = b[1][1];
            };

            if (geom.type === 'Polygon') {
              geom.coordinates.forEach(collectRing);
            } else if (geom.type === 'MultiPolygon') {
              geom.coordinates.forEach((poly) => poly.forEach(collectRing));
            }

            for (let lng = fMinLng; lng <= fMaxLng; lng += stepSize) {
              for (let lat = fMinLat; lat <= fMaxLat; lat += stepSize) {
                if (pointInFeature([lng, lat], feature)) {
                  const isPH = lng >= 116.5 && lng <= 127.0 && lat >= 4.5 && lat <= 21.0;
                  const isUK = lng >= -8.5 && lng <= 2.2 && lat >= 49.5 && lat <= 59.5;
                  newDots.push({ lng: lng, lat: lat, highlight: isPH ? 2 : isUK ? 1 : 0 });
                }
              }
            }
          });

          if (Array.isArray(window.MEDIQ_PH_ISLANDS)) {
            window.MEDIQ_PH_ISLANDS.forEach((r) => rings.push(r));
          }
          if (rings.length > 0) globeState.landRings = rings;
          if (newDots.length > 400) globeState.allDots = newDots;
        })
        .catch(() => {
          // Offline / sandboxed environment uses preloaded MEDIQ_WORLD_DOTS + OFFLINE_CONTINENT_RINGS seamlessly
        });
    }
    loadNaturalEarthData();

    // Orthographic Spherical Projection (Exact mathematical match to d3.geoOrthographic().clipAngle(90))
    function orthoProject(lng, lat, cx, cy, R, rotLng, rotLat) {
      const dLambda = (lng + rotLng) * DEG2RAD;
      const phi = lat * DEG2RAD;
      const phi0 = -rotLat * DEG2RAD;
      const sinPhi = Math.sin(phi),
        cosPhi = Math.cos(phi);
      const sinPhi0 = Math.sin(phi0),
        cosPhi0 = Math.cos(phi0);
      const cosDL = Math.cos(dLambda),
        sinDL = Math.sin(dLambda);

      const cosC = sinPhi0 * sinPhi + cosPhi0 * cosPhi * cosDL;
      if (cosC < 0) return null; // Clipped on back hemisphere (clipAngle 90)

      const x = cx + R * cosPhi * sinDL;
      const y = cy - R * (cosPhi0 * sinPhi - sinPhi0 * cosPhi * cosDL);
      return [x, y, cosC];
    }

    function drawOrthoPolyline(ctx, pts, cx, cy, R, rotLng, rotLat) {
      let penDown = false;
      for (let i = 0; i < pts.length; i++) {
        const p = orthoProject(pts[i][0], pts[i][1], cx, cy, R, rotLng, rotLat);
        if (p) {
          if (!penDown) {
            ctx.moveTo(p[0], p[1]);
            penDown = true;
          } else {
            ctx.lineTo(p[0], p[1]);
          }
        } else {
          penDown = false;
        }
      }
    }

    let viewHalfH = 0.3,
      viewHalfW = 0.3;
    let cssW = 1,
      cssH = 1,
      dpr = 1;

    function handleResize() {
      cssW = canvas.clientWidth || 1;
      cssH = canvas.clientHeight || 1;
      dpr = Math.min(window.devicePixelRatio || 1, light ? 1.5 : 2);
      renderer.setPixelRatio(dpr);
      renderer.setSize(cssW, cssH, false);

      if (asciiCanvas) {
        asciiCanvas.width = Math.round(cssW * dpr);
        asciiCanvas.height = Math.round(cssH * dpr);
      }
      if (globeCanvas) {
        globeCanvas.width = Math.round(cssW * dpr);
        globeCanvas.height = Math.round(cssH * dpr);
      }

      // Position the levitating Wireframe Dotted Globe right in front of the humanoid's chest & left shoulder
      globeState.cx = cssW * 0.275;
      globeState.cy = cssH * 0.565;
      globeState.baseRadius = Math.max(82, Math.min(cssW, cssH) * 0.215);

      const aspect = cssW / cssH;
      camera.aspect = aspect;
      const tanFov = Math.tan(THREE.MathUtils.degToRad(14));
      const camDist = frame.halfH / tanFov;
      viewHalfH = camDist * tanFov;
      viewHalfW = viewHalfH * aspect;

      // Anchor the 3D humanoid bust & spinning globe on the right half of the full-bleed stage (matching #hero)
      const rightScreenFrac = cssW >= 1024 ? 0.745 : 0.56;
      const ndcShiftX = (rightScreenFrac - 0.5) * 2;
      camTarget.x = frame.target[0] - ndcShiftX * viewHalfW;
      camera.position.set(camTarget.x, camTarget.y, camDist);
      camera.lookAt(camTarget);
      camera.updateProjectionMatrix();

      sharedUniforms.uScale.value = (cssH * dpr) / (2 * tanFov);
      sharedUniforms.uCellFreq.value = sharedUniforms.uScale.value / camDist / CFG.grainPx;
      sharedUniforms.uCorner.value.set(
        tanFov * aspect * CFG.cornerAim[0],
        tanFov * CFG.cornerAim[1]
      );
    }

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(canvas);
    handleResize();

    const pointer = { x: 0, y: 0, px: -10000, py: -10000, active: false, last: -999 };
    const isPointNearGlobe = (px, py) => {
      const R = globeState.baseRadius * globeState.zoomScale;
      return Math.hypot(px - globeState.cx, py - globeState.cy) <= R * 1.28;
    };

    const onPointerMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      pointer.px = e.clientX - rect.left;
      pointer.py = e.clientY - rect.top;
      pointer.x = (pointer.px / rect.width) * 2 - 1;
      pointer.y = -((pointer.py / rect.height) * 2 - 1);
      pointer.active = true;
      pointer.last = performance.now() / 1000;

      if (globeState.dragging) {
        const sensitivity = 0.48;
        const dx = pointer.px - globeState.dragStartX;
        const dy = pointer.py - globeState.dragStartY;
        globeState.rotLng = globeState.dragStartLng + dx * sensitivity;
        globeState.rotLat = Math.max(-85, Math.min(85, globeState.dragStartLat - dy * sensitivity));
        if (globeCanvas) globeCanvas.style.cursor = 'grabbing';
      } else if (globeCanvas) {
        globeState.hovering = isPointNearGlobe(pointer.px, pointer.py);
        globeCanvas.style.cursor = globeState.hovering ? 'grab' : 'default';
      }
    };

    const onGlobePointerDown = (e) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      if (isPointNearGlobe(px, py)) {
        globeState.dragging = true;
        globeState.autoRotate = false;
        globeState.dragStartX = px;
        globeState.dragStartY = py;
        globeState.dragStartLng = globeState.rotLng;
        globeState.dragStartLat = globeState.rotLat;
        if (globeCanvas) globeCanvas.style.cursor = 'grabbing';
      }
    };

    const onGlobePointerUp = () => {
      if (globeState.dragging) {
        globeState.dragging = false;
        setTimeout(() => {
          if (!globeState.dragging) globeState.autoRotate = true;
        }, 15);
        if (globeCanvas) {
          globeCanvas.style.cursor = globeState.hovering ? 'grab' : 'default';
        }
      }
    };

    const onGlobeWheel = (e) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      if (isPointNearGlobe(px, py)) {
        e.preventDefault();
        e.stopPropagation();
        const factor = e.deltaY > 0 ? 0.92 : 1.08;
        globeState.zoomScale = Math.max(0.65, Math.min(2.1, globeState.zoomScale * factor));
      }
    };

    const onPointerLeave = () => {
      pointer.active = false;
      onGlobePointerUp();
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerMove, { passive: true });
    window.addEventListener('pointerup', onGlobePointerUp, { passive: true });
    if (globeCanvas) {
      globeCanvas.addEventListener('pointerdown', onGlobePointerDown);
      globeCanvas.addEventListener('wheel', onGlobeWheel, { passive: false });
    }
    document.addEventListener('pointerleave', onPointerLeave);
    window.addEventListener('blur', onPointerLeave);

    let curYaw = CFG.baseYaw;
    let bodyYaw = CFG.baseYaw;
    let curPitch = 0;
    let mouseOnSmooth = 0;
    let elapsed = 0;
    let lastTime = 0;
    let rafId = 0;
    let isRunning = false;
    let asciiPhase = 0;
    let asciiCursorX = -10000;
    let asciiCursorY = -10000;

    const projVec = new THREE.Vector3();
    const headTopVec = new THREE.Vector3();
    const headBotVec = new THREE.Vector3();
    const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

    function renderAsciiMatrix(dt, headYawRel, headPitchVal, bodyYawVal, isPointerFresh) {
      if (!asciiCtx || !asciiCanvas) return;
      asciiCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      asciiCtx.clearRect(0, 0, cssW, cssH);

      // Project 3D head center and bounds into 2D canvas coordinates
      const pivotX = 0.0,
        pivotY = 0.66,
        pivotZ = 0.012;
      // Face center in local object space before head rot: (0, 0.805, 0.03)
      let qx = 0.0 - pivotX,
        qy = 0.805 - pivotY,
        qz = 0.035 - pivotZ;
      // rotX(q, pitch)
      const cp = Math.cos(headPitchVal),
        sp = Math.sin(headPitchVal);
      const rx = qx,
        ry = cp * qy - sp * qz,
        rz = sp * qy + cp * qz;
      // rotY(..., headYawRel)
      const cy = Math.cos(headYawRel),
        sy = Math.sin(headYawRel);
      const hx = pivotX + cy * rx + sy * rz;
      const hy = pivotY + ry;
      const hz = pivotZ - sy * rx + cy * rz;

      // Apply rootGroup Y rotation (bodyYawVal)
      const cb = Math.cos(bodyYawVal),
        sb = Math.sin(bodyYawVal);
      projVec.set(cb * hx + sb * hz, hy, -sb * hx + cb * hz).project(camera);

      headTopVec.set(0, 0.945, 0).project(camera);
      headBotVec.set(0, 0.695, 0).project(camera);

      const faceCenterX = ((projVec.x + 1) * 0.5) * cssW;
      const faceCenterY = ((-projVec.y + 1) * 0.5) * cssH;
      const headTopY = ((-headTopVec.y + 1) * 0.5) * cssH;
      const headBotY = ((-headBotVec.y + 1) * 0.5) * cssH;

      const headHalfH = Math.max(36, Math.abs(headBotY - headTopY) * 0.5);
      const headHalfW = headHalfH * 0.74;

      // Smoothly move ASCII focus toward pointer when pointer is over/near the bust,
      // otherwise anchor it right on the 3D face so the iconic Aller Studio ASCII face is always visible
      const pointerInCanvas =
        isPointerFresh &&
        pointer.px >= -40 &&
        pointer.px <= cssW + 40 &&
        pointer.py >= -40 &&
        pointer.py <= cssH + 40;

      const targetX = pointerInCanvas
        ? faceCenterX + clamp(pointer.px - faceCenterX, -headHalfW * 0.85, headHalfW * 0.85)
        : faceCenterX + Math.sin(elapsed * 0.7) * (headHalfW * 0.12);
      const targetY = pointerInCanvas
        ? faceCenterY + clamp(pointer.py - faceCenterY, -headHalfH * 0.85, headHalfH * 0.85)
        : faceCenterY + Math.cos(elapsed * 0.55) * (headHalfH * 0.08);

      if (asciiCursorX < -5000) {
        asciiCursorX = targetX;
        asciiCursorY = targetY;
      } else {
        const k = 1 - Math.exp(-dt * 10);
        asciiCursorX += (targetX - asciiCursorX) * k;
        asciiCursorY += (targetY - asciiCursorY) * k;
      }

      asciiPhase += dt * (pointerInCanvas ? 9.5 : 4.2);

      const step = 10;
      const radius = Math.max(headHalfH * 1.18, 95);
      const colStart = Math.floor((faceCenterX - headHalfW * 1.2) / step);
      const colEnd = Math.ceil((faceCenterX + headHalfW * 1.2) / step);
      const rowStart = Math.floor((faceCenterY - headHalfH * 1.15) / step);
      const rowEnd = Math.ceil((faceCenterY + headHalfH * 1.15) / step);

      asciiCtx.font = '600 8.5px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
      asciiCtx.textAlign = 'center';
      asciiCtx.textBaseline = 'middle';

      for (let gx = colStart; gx <= colEnd; gx++) {
        for (let gy = rowStart; gy <= rowEnd; gy++) {
          const px = gx * step;
          const py = gy * step;

          // Elliptical cranium/face mask so ASCII characters conform strictly to the 3D head contour
          const nx = (px - faceCenterX) / headHalfW;
          const ny = (py - faceCenterY) / headHalfH;
          // Narrower toward the jaw/chin (ny > 0)
          const jawTapering = ny > 0.15 ? 1.0 + (ny - 0.15) * 0.55 : 1.0;
          const ellipDist = Math.hypot(nx * jawTapering, ny);
          if (ellipDist >= 0.96) continue;

          // Distance from active cursor/focus point
          const distCursor = Math.hypot(px - asciiCursorX, py - asciiCursorY);
          if (distCursor >= radius) continue;

          const headEdgeFade = 1.0 - Math.pow(ellipDist / 0.96, 2.2);
          const u = (1.0 - distCursor / radius) * headEdgeFade;
          if (u <= 0.04) continue;

          const m = u * u * (3 - 2 * u);
          const p = Math.floor(asciiPhase * (0.5 + asciiHash(gx, gy, 7)) + 10 * asciiHash(gx, gy, 8));
          let charIdx = Math.round(m * (ASCII_CHARS.length - 1));
          const rnd = asciiHash(gx, gy, p);
          if (rnd < 0.07) {
            charIdx = Math.floor(asciiHash(gx, gy, p + 0.3) * ASCII_CHARS.length);
          } else if (rnd < 0.35) {
            charIdx += Math.round((asciiHash(gx, gy, p + 0.6) - 0.5) * 4);
          }
          charIdx = clamp(charIdx, 0, ASCII_CHARS.length - 1);

          let color = '#d8eaf8';
          let cRnd = asciiHash(gx, gy, p + 0.9);
          for (let c = 0; c < ASCII_COLORS.length; c++) {
            if (cRnd < ASCII_COLORS[c].share) {
              color = ASCII_COLORS[c].color;
              break;
            }
            cRnd -= ASCII_COLORS[c].share;
          }

          asciiCtx.fillStyle = color;
          asciiCtx.globalAlpha = Math.min(1, 1.35 * m);
          asciiCtx.fillText(ASCII_CHARS[charIdx], px, py);
        }
      }
      asciiCtx.globalAlpha = 1;
    }

    const shoulderVec = new THREE.Vector3();
    const chestVec = new THREE.Vector3();
    const globeAnchorVec = new THREE.Vector3();
    const globeTopVec = new THREE.Vector3();
    const globeBotVec = new THREE.Vector3();
    const fingerProjVec = new THREE.Vector3();

    // Project a point defined in CFG.baseYaw-aligned world space using current bodyYawVal
    function projectHandWorldPoint(wx, wy, wz, deltaYaw) {
      const cd = Math.cos(deltaYaw);
      const sd = Math.sin(deltaYaw);
      const rx = cd * wx + sd * wz;
      const rz = -sd * wx + cd * wz;
      fingerProjVec.set(rx, wy, rz).project(camera);
      return [
        ((fingerProjVec.x + 1) * 0.5) * cssW,
        ((-fingerProjVec.y + 1) * 0.5) * cssH
      ];
    }

    function renderWireframeDottedGlobe(dt, bodyYawVal) {
      if (!globeCtx || !globeCanvas) return;
      globeCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      globeCtx.clearRect(0, 0, cssW, cssH);

      if (globeState.autoRotate && !globeState.dragging && !reduced) {
        globeState.rotLng += globeState.rotationSpeed * (dt * 60);
        if (globeState.rotLng > 180) globeState.rotLng -= 360;
      }

      // Lock the 2D Wireframe Dotted Globe directly into the 3D cupped palm of the sculpted hand
      const deltaYaw = bodyYawVal - CFG.baseYaw;
      const cd = Math.cos(deltaYaw);
      const sd = Math.sin(deltaYaw);
      const gwx = HAND_GLOBE_WORLD.center[0];
      const gwy = HAND_GLOBE_WORLD.center[1];
      const gwz = HAND_GLOBE_WORLD.center[2];
      const grx = cd * gwx + sd * gwz;
      const grz = -sd * gwx + cd * gwz;

      globeAnchorVec.set(grx, gwy, grz).project(camera);
      globeTopVec.set(grx, gwy + HAND_GLOBE_WORLD.radius, grz).project(camera);
      globeBotVec.set(grx, gwy - HAND_GLOBE_WORLD.radius, grz).project(camera);

      globeState.cx = ((globeAnchorVec.x + 1) * 0.5) * cssW;
      globeState.cy = ((-globeAnchorVec.y + 1) * 0.5) * cssH;
      const projTopY = ((-globeTopVec.y + 1) * 0.5) * cssH;
      const projBotY = ((-globeBotVec.y + 1) * 0.5) * cssH;
      globeState.baseRadius = Math.max(68, Math.abs(projBotY - projTopY) * 0.5);

      // Subtle breathing sync with the hand
      const bobY = reduced ? 0 : Math.sin(elapsed * 1.65) * 2.2;
      const cx = globeState.cx;
      const cy = globeState.cy + bobY;
      const scaleFactor = globeState.zoomScale;
      const R = globeState.baseRadius * scaleFactor;
      const rotLng = globeState.rotLng;
      const rotLat = globeState.rotLat;

      // Project 3D palm center to anchor the palm-to-globe energy cradle
      const pwx = HAND_GLOBE_WORLD.palmCenter[0];
      const pwy = HAND_GLOBE_WORLD.palmCenter[1];
      const pwz = HAND_GLOBE_WORLD.palmCenter[2];
      shoulderVec.set(cd * pwx + sd * pwz, pwy, -sd * pwx + cd * pwz).project(camera);
      const palmX = ((shoulderVec.x + 1) * 0.5) * cssW;
      const palmY = ((-shoulderVec.y + 1) * 0.5) * cssH;

      // 1. Palm Cradle Aura & Energy Ring between the 3D Cupped Palm and the Globe Sphere
      globeCtx.save();
      const auraGrad = globeCtx.createRadialGradient(cx, cy, R * 0.35, cx, cy, R * 1.38);
      auraGrad.addColorStop(0, 'rgba(56, 189, 248, 0.16)');
      auraGrad.addColorStop(0.65, 'rgba(37, 99, 235, 0.09)');
      auraGrad.addColorStop(1, 'rgba(10, 29, 64, 0)');
      globeCtx.fillStyle = auraGrad;
      globeCtx.beginPath();
      globeCtx.arc(cx, cy, R * 1.38, 0, Math.PI * 2);
      globeCtx.fill();

      // Luminous blue palm-cupping energy ring right above the knuckles
      const ringRx = R * 0.72;
      const ringRy = ringRx * 0.22;
      const ringY = (cy + R * 0.94 + palmY) * 0.5;
      globeCtx.save();
      globeCtx.translate((cx + palmX) * 0.5, ringY);
      globeCtx.rotate(-0.06);
      globeCtx.beginPath();
      globeCtx.ellipse(0, 0, ringRx, ringRy, 0, 0, Math.PI * 2);
      globeCtx.strokeStyle = 'rgba(114, 197, 248, 0.42)';
      globeCtx.lineWidth = 1.3 * scaleFactor;
      globeCtx.setLineDash([7 * scaleFactor, 5 * scaleFactor]);
      globeCtx.lineDashOffset = -elapsed * 18;
      globeCtx.stroke();
      globeCtx.restore();
      globeCtx.restore();

      // 2. Draw Ocean (Semi-Translucent Holographic MEDIQ Sapphire Sphere — Blended with Humanoid)
      globeCtx.save();
      globeCtx.beginPath();
      globeCtx.arc(cx, cy, R, 0, Math.PI * 2);
      const oceanGrad = globeCtx.createRadialGradient(
        cx - R * 0.24,
        cy - R * 0.24,
        R * 0.06,
        cx,
        cy,
        R
      );
      oceanGrad.addColorStop(0, 'rgba(13, 38, 78, 0.72)');
      oceanGrad.addColorStop(0.64, 'rgba(8, 23, 52, 0.58)');
      oceanGrad.addColorStop(0.90, 'rgba(10, 29, 64, 0.34)');
      oceanGrad.addColorStop(1, 'rgba(14, 42, 86, 0.10)');
      globeCtx.fillStyle = oceanGrad;
      globeCtx.fill();

      // Soft luminous sky-blue atmospheric sphere rim (no harsh white sticker border)
      globeCtx.strokeStyle = 'rgba(114, 197, 248, 0.38)';
      globeCtx.lineWidth = 1.25 * scaleFactor;
      globeCtx.stroke();

      // Clip all graticule lines, land outlines, and halftone dots strictly inside the globe circle
      globeCtx.clip();

      // 3. Draw 15-degree Orthographic Graticule (Meridians & Parallels)
      globeCtx.beginPath();
      // Meridians every 15 degrees
      for (let lng = -180; lng < 180; lng += 15) {
        let pen = false;
        for (let lat = -85; lat <= 85; lat += 5) {
          const p = orthoProject(lng, lat, cx, cy, R, rotLng, rotLat);
          if (p) {
            if (!pen) {
              globeCtx.moveTo(p[0], p[1]);
              pen = true;
            } else {
              globeCtx.lineTo(p[0], p[1]);
            }
          } else {
            pen = false;
          }
        }
      }
      // Parallels every 15 degrees
      for (let lat = -75; lat <= 75; lat += 15) {
        let pen = false;
        for (let lng = -180; lng <= 180; lng += 5) {
          const p = orthoProject(lng, lat, cx, cy, R, rotLng, rotLat);
          if (p) {
            if (!pen) {
              globeCtx.moveTo(p[0], p[1]);
              pen = true;
            } else {
              globeCtx.lineTo(p[0], p[1]);
            }
          } else {
            pen = false;
          }
        }
      }
      globeCtx.strokeStyle = '#72c5f8';
      globeCtx.lineWidth = 0.95 * scaleFactor;
      globeCtx.globalAlpha = 0.16;
      globeCtx.stroke();
      globeCtx.globalAlpha = 1;

      // 4. Draw Continent & Island Land Outlines (Soft Ice-Blue Harmonized with Humanoid Particles)
      if (globeState.landRings.length > 0) {
        globeCtx.beginPath();
        for (let r = 0; r < globeState.landRings.length; r++) {
          drawOrthoPolyline(globeCtx, globeState.landRings[r], cx, cy, R, rotLng, rotLat);
        }
        globeCtx.strokeStyle = '#bae6fd';
        globeCtx.lineWidth = 0.95 * scaleFactor;
        globeCtx.globalAlpha = 0.48;
        globeCtx.stroke();
        globeCtx.globalAlpha = 1;
      }

      // 5. Draw Halftone Dots across all Continents (allDots)
      const dots = globeState.allDots;
      const dotRadius = 1.2 * scaleFactor;
      const twoPi = Math.PI * 2;

      // Batch standard land dots in MEDIQ soft steel-sky blue (#8ebae2) and highlighted partner hub dots (#38bdf8)
      globeCtx.beginPath();
      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        if (d.highlight !== 0) continue;
        const p = orthoProject(d.lng, d.lat, cx, cy, R, rotLng, rotLat);
        if (p && p[2] > 0.02) {
          globeCtx.moveTo(p[0] + dotRadius, p[1]);
          globeCtx.arc(p[0], p[1], dotRadius, 0, twoPi);
        }
      }
      globeCtx.fillStyle = 'rgba(142, 186, 226, 0.66)';
      globeCtx.fill();

      // Highlighted Philippines & UK Partner Dots in MEDIQ Neon Sky-Blue
      globeCtx.beginPath();
      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        if (d.highlight === 0) continue;
        const p = orthoProject(d.lng, d.lat, cx, cy, R, rotLng, rotLat);
        if (p && p[2] > 0.02) {
          const hr = dotRadius * (d.highlight === 2 ? 1.45 : 1.25);
          globeCtx.moveTo(p[0] + hr, p[1]);
          globeCtx.arc(p[0], p[1], hr, 0, twoPi);
        }
      }
      globeCtx.fillStyle = '#38bdf8';
      globeCtx.fill();

      // Pulsing Philippines (Manila 121.0E, 14.6N) & Rayner UK (London -0.13E, 51.5N) beacons when visible
      const beacons = [
        { lng: 121.0, lat: 14.6, label: 'PH' },
        { lng: -0.13, lat: 51.5, label: 'UK' }
      ];
      for (let b = 0; b < beacons.length; b++) {
        const bp = orthoProject(beacons[b].lng, beacons[b].lat, cx, cy, R, rotLng, rotLat);
        if (bp && bp[2] > 0.08) {
          const pulseR = (3.5 + 3.5 * (0.5 + 0.5 * Math.sin(elapsed * 3.2 + b * 2))) * scaleFactor;
          globeCtx.beginPath();
          globeCtx.arc(bp[0], bp[1], pulseR, 0, twoPi);
          globeCtx.strokeStyle = 'rgba(56, 189, 248, 0.75)';
          globeCtx.lineWidth = 1.2 * scaleFactor;
          globeCtx.stroke();

          globeCtx.beginPath();
          globeCtx.arc(bp[0], bp[1], 2.2 * scaleFactor, 0, twoPi);
          globeCtx.fillStyle = '#e0f2fe';
          globeCtx.fill();
        }
      }

      // Soft inner fresnel atmospheric blend along the right & bottom rim where the globe meets the humanoid
      const rimBlend = globeCtx.createRadialGradient(cx, cy, R * 0.68, cx, cy, R);
      rimBlend.addColorStop(0, 'rgba(10, 29, 64, 0)');
      rimBlend.addColorStop(0.75, 'rgba(14, 42, 86, 0.14)');
      rimBlend.addColorStop(1, 'rgba(56, 189, 248, 0.18)');
      globeCtx.fillStyle = rimBlend;
      globeCtx.beginPath();
      globeCtx.arc(cx, cy, R, 0, twoPi);
      globeCtx.fill();

      globeCtx.restore();

      // 6. Outer Orbital Spin Ring & Floating Particle Motes around the Globe
      globeCtx.save();
      globeCtx.translate(cx, cy);
      globeCtx.rotate(-0.22);
      globeCtx.beginPath();
      globeCtx.ellipse(0, 0, R * 1.14, R * 0.26, 0, 0.18, Math.PI - 0.18);
      globeCtx.strokeStyle = 'rgba(114, 197, 248, 0.32)';
      globeCtx.lineWidth = 1.05 * scaleFactor;
      globeCtx.stroke();

      // Orbiting blue square flake motes matching the humanoid's particle dispersion
      for (let m = 0; m < 4; m++) {
        const ang = elapsed * 1.15 + m * (Math.PI * 0.5);
        if (Math.sin(ang) > -0.15) {
          const mx = Math.cos(ang) * R * 1.14;
          const my = Math.sin(ang) * R * 0.26;
          globeCtx.fillStyle = m % 2 === 0 ? '#38bdf8' : '#d8eaf8';
          globeCtx.fillRect(mx - 2 * scaleFactor, my - 2 * scaleFactor, 4 * scaleFactor, 4 * scaleFactor);
        }
      }
      globeCtx.restore();

      // 7. Smooth Continuous Crescent Feather at the Bottom & Right Edge (Zero Bumpy Notches)
      globeCtx.save();
      globeCtx.globalCompositeOperation = 'destination-out';

      // Smoothly feather the lower cradle of the globe into the 3D WebGL hand & fingers
      const bottomEraseGrad = globeCtx.createLinearGradient(cx, cy + R * 0.58, cx, cy + R * 1.02);
      bottomEraseGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
      bottomEraseGrad.addColorStop(0.55, 'rgba(0, 0, 0, 0.28)');
      bottomEraseGrad.addColorStop(0.85, 'rgba(0, 0, 0, 0.68)');
      bottomEraseGrad.addColorStop(1, 'rgba(0, 0, 0, 0.94)');
      globeCtx.fillStyle = bottomEraseGrad;
      globeCtx.beginPath();
      globeCtx.arc(cx, cy, R * 1.05, 0.05 * Math.PI, 0.95 * Math.PI);
      globeCtx.fill();

      // Softly feather the upper-right rim where the globe overlaps the humanoid's neck/chest silhouette
      const rightRimGrad = globeCtx.createRadialGradient(
        cx + R * 0.78,
        cy - R * 0.15,
        R * 0.05,
        cx + R * 0.78,
        cy - R * 0.15,
        R * 0.65
      );
      rightRimGrad.addColorStop(0, 'rgba(0, 0, 0, 0.32)');
      rightRimGrad.addColorStop(0.6, 'rgba(0, 0, 0, 0.12)');
      rightRimGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      globeCtx.fillStyle = rightRimGrad;
      globeCtx.beginPath();
      globeCtx.arc(cx, cy, R * 1.05, 0, Math.PI * 2);
      globeCtx.fill();

      globeCtx.restore();
    }

    function animate(now) {
      const dt = lastTime ? Math.min((now - lastTime) / 1000, 0.05) : 0.016;
      lastTime = now;
      elapsed += dt;
      sharedUniforms.uTime.value = elapsed;

      const isPointerFresh = pointer.active && now / 1000 - pointer.last < CFG.idleAfter;
      let targetYaw, targetPitch;

      if (globeState.dragging && !reduced) {
        // When user drags/spins the globe, the humanoid looks intently toward the spinning globe
        targetYaw = CFG.baseYaw - 0.24 + Math.sin(globeState.rotLng * DEG2RAD) * 0.12;
        targetPitch = -0.16 + (globeState.rotLat / 90) * 0.12;
      } else if (isPointerFresh && !reduced) {
        projVec.set(0, 0.8, 0).project(camera);
        targetYaw = CFG.baseYaw + clamp((pointer.x - projVec.x) * CFG.lookYaw, -0.65, 0.65);
        targetPitch = clamp(-(pointer.y - projVec.y) * CFG.lookPitch, -0.32, 0.32);
      } else {
        const motionOn = reduced ? 0 : 1;
        // Gently gaze toward the levitating globe while breathing/observing
        targetYaw =
          CFG.baseYaw -
          0.08 +
          motionOn * (0.14 * Math.sin(0.45 * elapsed) + 0.05 * Math.sin(0.9 * elapsed + 1));
        targetPitch = -0.05 + 0.04 * motionOn * Math.sin(0.33 * elapsed);
      }

      const headLerp = 1 - Math.exp(-dt * CFG.headSpeed);
      const bodyLerp = 1 - Math.exp(-1.8 * dt);
      curYaw += (targetYaw - curYaw) * headLerp;
      curPitch += (targetPitch - curPitch) * headLerp;
      bodyYaw += (CFG.baseYaw + CFG.bodyFollow * (targetYaw - CFG.baseYaw) - bodyYaw) * bodyLerp;

      rootGroup.rotation.y = bodyYaw;
      const headYawRel = clamp(curYaw - bodyYaw, -CFG.headMaxYaw, CFG.headMaxYaw);
      sharedUniforms.uYaw.value = headYawRel;
      sharedUniforms.uPitch.value = curPitch;

      mouseOnSmooth += ((isPointerFresh ? 1 : 0) - mouseOnSmooth) * (1 - Math.exp(-4 * dt));
      sharedUniforms.uMouseOn.value = mouseOnSmooth;
      sharedUniforms.uMouse.value.set(pointer.x * viewHalfW, pointer.y * viewHalfH);

      renderer.render(scene, camera);
      renderAsciiMatrix(dt, headYawRel, curPitch, bodyYaw, isPointerFresh);
      renderWireframeDottedGlobe(dt, bodyYaw);

      rafId = requestAnimationFrame(animate);
    }

    return {
      setRunning(run) {
        if (run === isRunning) return;
        isRunning = run;
        if (run) {
          lastTime = 0;
          rafId = requestAnimationFrame(animate);
        } else {
          cancelAnimationFrame(rafId);
        }
      },
      dispose() {
        cancelAnimationFrame(rafId);
        isRunning = false;
        resizeObserver.disconnect();
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerdown', onPointerMove);
        window.removeEventListener('pointerup', onGlobePointerUp);
        if (globeCanvas) {
          globeCanvas.removeEventListener('pointerdown', onGlobePointerDown);
          globeCanvas.removeEventListener('wheel', onGlobeWheel);
        }
        document.removeEventListener('pointerleave', onPointerLeave);
        window.removeEventListener('blur', onPointerLeave);
        scene.traverse((obj) => {
          if (obj.geometry) obj.geometry.dispose();
          if (obj.material) obj.material.dispose();
        });
        renderer.dispose();
      }
    };
  }

  async function initBrandsAllerSilhouette() {
    const stage = document.getElementById('brands-aller-silhouette-stage');
    const webglCanvas = document.getElementById('brands-aller-webgl-canvas');
    const asciiCanvas = document.getElementById('brands-aller-ascii-canvas');
    const globeCanvas = document.getElementById('brands-wireframe-globe-canvas');
    if (!stage || !webglCanvas || !window.THREE) return;

    try {
      const buffer = await loadSilhouetteBuffer();
      const meshData = parseMesh(buffer);
      const isCoarse = window.matchMedia('(max-width: 767px), (pointer: coarse)').matches;
      const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      const controller = createSilhouette(
        window.THREE,
        webglCanvas,
        asciiCanvas,
        globeCanvas,
        meshData,
        {
          reduced: isReduced,
          light: isCoarse
        }
      );

      webglCanvas.classList.remove('opacity-0');
      webglCanvas.classList.add('opacity-100');
      if (asciiCanvas) {
        asciiCanvas.classList.remove('opacity-0');
        asciiCanvas.classList.add('opacity-100');
      }
      if (globeCanvas) {
        globeCanvas.classList.remove('opacity-0');
        globeCanvas.classList.add('opacity-100');
      }

      let inView = true;
      const updateRunState = () => {
        controller.setRunning(inView && !document.hidden);
      };

      const io = new IntersectionObserver(
        ([entry]) => {
          inView = entry.isIntersecting;
          updateRunState();
        },
        { threshold: 0.05 }
      );
      io.observe(stage);
      document.addEventListener('visibilitychange', updateRunState);
      updateRunState();
    } catch (err) {
      console.error('Failed to initialize Aller Studio 3D Silhouette:', err);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBrandsAllerSilhouette);
  } else {
    initBrandsAllerSilhouette();
  }
})();

