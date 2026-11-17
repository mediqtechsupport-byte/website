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
    pecFlakes: 120,
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
    palmCenter: [-0.156, 0.466, 0.172]
  };

  const HAND_FINGERS_WORLD = [
    // 0: Thumb (Full adult 2-phalanx opposable thumb wrapping gracefully up the left curve of the globe)
    {
      name: 'thumb',
      nodes: [
        { p: [-0.188, 0.456, 0.144], rx: 0.0115, ry: 0.0098, crv: 10 },
        { p: [-0.208, 0.474, 0.158], rx: 0.0102, ry: 0.0088, crv: 12 },
        { p: [-0.226, 0.496, 0.172], rx: 0.0088, ry: 0.0076, crv: 14 },
        { p: [-0.236, 0.520, 0.186], rx: 0.0076, ry: 0.0066, crv: 14 },
        { p: [-0.239, 0.538, 0.194], rx: 0.0065, ry: 0.0056, crv: 16 },
        { p: [-0.237, 0.549, 0.198], rx: 0.0052, ry: 0.0044, crv: 16 }
      ]
    },
    // 1: Index Finger (Full adult 3-phalanx reach cradling front-left equator-lower globe surface)
    {
      name: 'index',
      nodes: [
        { p: [-0.178, 0.464, 0.158], rx: 0.0086, ry: 0.0076, crv: 10 },
        { p: [-0.183, 0.478, 0.184], rx: 0.0082, ry: 0.0072, crv: 12 },
        { p: [-0.187, 0.495, 0.212], rx: 0.0078, ry: 0.0068, crv: 14 },
        { p: [-0.188, 0.514, 0.234], rx: 0.0068, ry: 0.0060, crv: 14 },
        { p: [-0.185, 0.530, 0.245], rx: 0.0060, ry: 0.0052, crv: 16 },
        { p: [-0.181, 0.542, 0.249], rx: 0.0050, ry: 0.0042, crv: 16 }
      ]
    },
    // 2: Middle Finger (Tallest adult finger spanning up the lower-front hemisphere of the sphere)
    {
      name: 'middle',
      nodes: [
        { p: [-0.160, 0.463, 0.160], rx: 0.0090, ry: 0.0080, crv: 10 },
        { p: [-0.162, 0.477, 0.188], rx: 0.0085, ry: 0.0075, crv: 12 },
        { p: [-0.162, 0.496, 0.218], rx: 0.0080, ry: 0.0070, crv: 14 },
        { p: [-0.162, 0.518, 0.241], rx: 0.0070, ry: 0.0062, crv: 14 },
        { p: [-0.160, 0.538, 0.251], rx: 0.0062, ry: 0.0054, crv: 16 },
        { p: [-0.158, 0.551, 0.254], rx: 0.0052, ry: 0.0044, crv: 16 }
      ]
    },
    // 3: Ring Finger (Balanced adult support cradling the lower-front-right curve of the globe)
    {
      name: 'ring',
      nodes: [
        { p: [-0.142, 0.464, 0.158], rx: 0.0084, ry: 0.0074, crv: 10 },
        { p: [-0.140, 0.478, 0.185], rx: 0.0079, ry: 0.0070, crv: 12 },
        { p: [-0.137, 0.496, 0.213], rx: 0.0074, ry: 0.0065, crv: 14 },
        { p: [-0.134, 0.515, 0.233], rx: 0.0065, ry: 0.0057, crv: 14 },
        { p: [-0.132, 0.530, 0.242], rx: 0.0057, ry: 0.0050, crv: 16 },
        { p: [-0.131, 0.541, 0.246], rx: 0.0048, ry: 0.0041, crv: 16 }
      ]
    },
    // 4: Little Finger / Pinky (Natural adult outer support hugging lower-right sphere edge)
    {
      name: 'pinky',
      nodes: [
        { p: [-0.125, 0.466, 0.152], rx: 0.0074, ry: 0.0065, crv: 10 },
        { p: [-0.119, 0.479, 0.176], rx: 0.0069, ry: 0.0061, crv: 12 },
        { p: [-0.113, 0.495, 0.200], rx: 0.0064, ry: 0.0056, crv: 14 },
        { p: [-0.108, 0.511, 0.218], rx: 0.0056, ry: 0.0049, crv: 14 },
        { p: [-0.105, 0.522, 0.226], rx: 0.0049, ry: 0.0043, crv: 16 },
        { p: [-0.104, 0.531, 0.231], rx: 0.0042, ry: 0.0036, crv: 16 }
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

    function addLoftedTube(nodes, radialSegs, stepsPerSeg, capEnd, capRatio) {
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

      // Stitch adjacent rings into outward-facing CCW triangles
      for (let s = 0; s < rings.length - 1; s++) {
        const rA = rings[s].indices;
        const rB = rings[s + 1].indices;
        for (let j = 0; j < radialSegs; j++) {
          const jNext = (j + 1) % radialSegs;
          extraIdx.push(rA[j], rB[jNext], rB[j]);
          extraIdx.push(rA[j], rA[jNext], rB[jNext]);
        }
      }

      // Multi-ring hemispherical dome cap at the end of the tube (smooth rounded fingertips & zero dark holes)
      if (capEnd && rings.length > 0) {
        const endR = rings[rings.length - 1];
        const smp = endR.smp;
        const domeRings = 5;
        let prevRing = endR.indices;
        const capReach = Math.min(smp.rx, smp.ry) * (typeof capRatio === 'number' ? capRatio : 1.05);
        for (let k = 1; k < domeRings; k++) {
          const phi = (k / domeRings) * (Math.PI * 0.5);
          const cosPhi = Math.cos(phi);
          const sinPhi = Math.sin(phi);
          const axialOffset = capReach * sinPhi;
          const dRing = [];
          for (let j = 0; j < radialSegs; j++) {
            const theta = (j / radialSegs) * Math.PI * 2;
            const ct = Math.cos(theta);
            const st = Math.sin(theta);
            const flat = st > 0 ? 0.86 : 1.04;
            const ox = ct * smp.rx * cosPhi;
            const oy = st * smp.ry * flat * cosPhi;
            const wx = smp.p[0] + endR.tx * axialOffset + endR.b1x * ox + endR.b2x * oy;
            const wy = smp.p[1] + endR.ty * axialOffset + endR.b1y * ox + endR.b2y * oy;
            const wz = smp.p[2] + endR.tz * axialOffset + endR.b1z * ox + endR.b2z * oy;

            const rnx = endR.b1x * (ct / smp.rx) + endR.b2x * (st / smp.ry);
            const rny = endR.b1y * (ct / smp.rx) + endR.b2y * (st / smp.ry);
            const rnz = endR.b1z * (ct / smp.rx) + endR.b2z * (st / smp.ry);
            const rLen = Math.hypot(rnx, rny, rnz) || 1;
            const nx = (rnx / rLen) * cosPhi + endR.tx * sinPhi;
            const ny = (rny / rLen) * cosPhi + endR.ty * sinPhi;
            const nz = (rnz / rLen) * cosPhi + endR.tz * sinPhi;
            dRing.push(pushWorldVertex(wx, wy, wz, nx, ny, nz, smp.crv + k * 2));
          }
          for (let j = 0; j < radialSegs; j++) {
            const jNext = (j + 1) % radialSegs;
            extraIdx.push(prevRing[j], dRing[jNext], dRing[j]);
            extraIdx.push(prevRing[j], prevRing[jNext], dRing[jNext]);
          }
          prevRing = dRing;
        }
        const tipCenterIdx = pushWorldVertex(
          smp.p[0] + endR.tx * capReach,
          smp.p[1] + endR.ty * capReach,
          smp.p[2] + endR.tz * capReach,
          endR.tx,
          endR.ty,
          endR.tz,
          smp.crv + 12
        );
        for (let j = 0; j < radialSegs; j++) {
          const jNext = (j + 1) % radialSegs;
          extraIdx.push(prevRing[j], prevRing[jNext], tipCenterIdx);
        }
      }
    }

    // 1. Continuous Adult Upper-Arm -> Elbow -> Forearm -> Wrist -> Broad Tapered Palm
    addLoftedTube(
      [
        { p: [-0.172, 0.500, -0.042], rx: 0.048, ry: 0.042, crv: 10 },
        { p: [-0.194, 0.422, 0.012], rx: 0.040, ry: 0.035, crv: 12 },
        { p: [-0.192, 0.422, 0.068], rx: 0.033, ry: 0.026, crv: 12 },
        { p: [-0.180, 0.436, 0.110], rx: 0.026, ry: 0.018, crv: 12 },
        { p: [-0.168, 0.450, 0.134], rx: 0.024, ry: 0.014, crv: 12 },
        { p: [-0.158, 0.464, 0.162], rx: 0.034, ry: 0.011, crv: 12 },
        { p: [-0.152, 0.474, 0.184], rx: 0.024, ry: 0.007, crv: 10 }
      ],
      28,
      5,
      true,
      0.15
    );

    const handPalmStartVertex = nextVert;

    // 2. Broad Adult Inner Palm-to-Knuckle Plate (Fills Gap Between Finger Roots & Thumb Base)
    addLoftedTube(
      [
        { p: [-0.166, 0.452, 0.138], rx: 0.024, ry: 0.012, crv: 10 },
        { p: [-0.159, 0.463, 0.160], rx: 0.032, ry: 0.010, crv: 11 },
        { p: [-0.154, 0.472, 0.178], rx: 0.028, ry: 0.0075, crv: 10 },
        { p: [-0.152, 0.478, 0.188], rx: 0.014, ry: 0.0045, crv: 8 }
      ],
      24,
      4,
      true,
      0.12
    );

    // 3. Proportional Thenar (Thumb Pad) & Hypothenar Palm Pads
    addLoftedTube(
      [
        { p: [-0.174, 0.448, 0.136], rx: 0.014, ry: 0.0105, crv: 10 },
        { p: [-0.186, 0.458, 0.148], rx: 0.014, ry: 0.0100, crv: 11 },
        { p: [-0.194, 0.468, 0.158], rx: 0.010, ry: 0.0075, crv: 10 }
      ],
      14,
      4,
      true,
      0.20
    );
    addLoftedTube(
      [
        { p: [-0.150, 0.450, 0.138], rx: 0.0125, ry: 0.0095, crv: 10 },
        { p: [-0.138, 0.460, 0.152], rx: 0.0125, ry: 0.0090, crv: 11 },
        { p: [-0.128, 0.470, 0.166], rx: 0.0085, ry: 0.0065, crv: 10 }
      ],
      14,
      4,
      true,
      0.20
    );

    // 4. Smooth Internal Metacarpal Bridges Connecting Wrist Into Scaled Adult Finger Roots
    const metacarpalEnds = [
      { root: [-0.178, 0.464, 0.158], r: 0.0086 },
      { root: [-0.160, 0.463, 0.160], r: 0.0090 },
      { root: [-0.142, 0.464, 0.158], r: 0.0084 },
      { root: [-0.125, 0.466, 0.152], r: 0.0074 }
    ];
    for (let m = 0; m < metacarpalEnds.length; m++) {
      const me = metacarpalEnds[m];
      addLoftedTube(
        [
          { p: [-0.158, 0.452, 0.132], rx: 0.0072, ry: 0.0055, crv: 10 },
          {
            p: [
              (-0.158 + me.root[0]) * 0.5,
              (0.452 + me.root[1]) * 0.5,
              (0.132 + me.root[2]) * 0.5
            ],
            rx: 0.0074,
            ry: 0.0055,
            crv: 11
          },
          { p: me.root, rx: me.r, ry: me.r * 0.88, crv: 10 }
        ],
        12,
        3,
        false
      );
    }

    // 5. Five Articulated 3-Phalanx Fingers Cupping the Lower Hemisphere of the Globe
    for (let f = 0; f < HAND_FINGERS_WORLD.length; f++) {
      addLoftedTube(HAND_FINGERS_WORLD[f].nodes, 18, 4, true, 1.05);
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

    const isHandArr = new Float32Array(totalVerts);
    isHandArr.fill(1.0, handStartVertex);

    const mergedIdx = new Uint16Array(baseMesh.idx.length + extraIdx.length);
    mergedIdx.set(baseMesh.idx, 0);
    mergedIdx.set(extraIdx, baseMesh.idx.length);

    return {
      pos: mergedPos,
      nrm: mergedNrm,
      crv: mergedCrv,
      isHand: isHandArr,
      idx: mergedIdx,
      handStartVertex: handStartVertex,
      handPalmStartVertex: handPalmStartVertex
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

    const cosBaseGlobe = Math.cos(CFG.baseYaw);
    const sinBaseGlobe = Math.sin(CFG.baseYaw);
    const globeLocalPos = new THREE.Vector3(
      cosBaseGlobe * HAND_GLOBE_WORLD.center[0] - sinBaseGlobe * HAND_GLOBE_WORLD.center[2],
      HAND_GLOBE_WORLD.center[1],
      sinBaseGlobe * HAND_GLOBE_WORLD.center[0] + cosBaseGlobe * HAND_GLOBE_WORLD.center[2]
    );

    const { pos, nrm, crv, idx } = meshData;
    const isHandAttr = meshData.isHand || new Float32Array(pos.length / 3);
    const vertexCount = pos.length / 3;
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geometry.setAttribute('normal', new THREE.BufferAttribute(nrm, 3, true));
    geometry.setAttribute('aCrv', new THREE.BufferAttribute(crv, 1, true));
    geometry.setAttribute('aIsHand', new THREE.BufferAttribute(isHandAttr, 1));
    geometry.setIndex(new THREE.BufferAttribute(idx, 1));

    const normVec3 = (arr) => new THREE.Vector3(arr[0], arr[1], arr[2]).normalize();

    const bodyMaterial = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      transparent: true,
      depthWrite: true,
      uniforms: {
        uTime: sharedUniforms.uTime,
        uYaw: sharedUniforms.uYaw,
        uPitch: sharedUniforms.uPitch,
        uCellFreq: sharedUniforms.uCellFreq,
        uLime: { value: new THREE.Vector3(CFG.lime[0], CFG.lime[1], CFG.lime[2]) },
        uGlobeLocal: { value: globeLocalPos.clone() },
        uGlobeR: { value: HAND_GLOBE_WORLD.radius },
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
attribute float aIsHand;
varying vec3 vN; varying vec3 vObj; varying vec3 vObjN; varying vec3 vView; varying float vCrv; varying float vIsHand;
void main(){
  vCrv = aCrv;
  vIsHand = aIsHand;
  float w = headW(position);
  vec3 p = headDeform(position, w);
  vec3 hn = normalize(headNormal(normal, w));
  vObj = p;
  vObjN = hn;
  vN = normalize(normalMatrix * hn);
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  vView = -mv.xyz;
  gl_Position = projectionMatrix * mv;
}`,
      fragmentShader: `
uniform float uTime; uniform vec3 uLime; uniform float uCellFreq;
uniform vec3 uGlobeLocal; uniform float uGlobeR;
uniform vec3 uKeyDir, uFillDir, uTopDir; uniform float uKey, uFill, uTop, uSpec, uTone, uShade;
uniform vec3 uFrontDir; uniform float uFront, uRidge, uChest, uLightA, uFrontGrain, uRimA;
varying vec3 vN; varying vec3 vObj; varying vec3 vObjN; varying vec3 vView; varying float vCrv; varying float vIsHand;
float hash(vec3 p){ p = fract(p*0.3183099 + vec3(0.1,0.2,0.3)); p *= 17.0; return fract(p.x*p.y*p.z*(p.x+p.y+p.z)); }
float vnoise(vec3 p){
  vec3 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
  float a=hash(i), b=hash(i+vec3(1,0,0)), c=hash(i+vec3(0,1,0)), d=hash(i+vec3(1,1,0));
  float e=hash(i+vec3(0,0,1)), g=hash(i+vec3(1,0,1)), h=hash(i+vec3(0,1,1)), k=hash(i+vec3(1,1,1));
  return mix(mix(mix(a,b,f.x), mix(c,d,f.x), f.y), mix(mix(e,g,f.x), mix(h,k,f.x), f.y), f.z);
}
void main(){
  vec3 N = normalize(vN); if (!gl_FrontFacing) N = -N; vec3 V = normalize(vView);
  vec3 objN = normalize(vObjN); if (!gl_FrontFacing) objN = -objN;
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

  // Subtle globe contact bounce (dark midnight shadow preserved so Aller micro-grain defines form)
  vec3 toGlobe = uGlobeLocal - vObj;
  float globeDist = length(toGlobe);
  float globeFacing = clamp(dot(objN, toGlobe / max(globeDist, 1e-4)) * 0.50 + 0.35, 0.0, 1.0);
  float globeProx = exp(-max(globeDist - uGlobeR, 0.0) * 18.0);
  float globeLight = globeProx * globeFacing * (0.35 + 0.65 * vIsHand);

  vec3 navyShadow = vec3(0.026, 0.076, 0.172);
  vec3 col = navyShadow + uShade * (0.060 * wk * wk * uKey + 0.040 * wf * wf * uFill + 0.045 * wt * wt * uTop + 0.010 * wr * wr * wr * uFront);
  col += uShade * (0.030 * key + 0.012 * top);
  col += 0.050 * vnoise(cp * 0.25) * (0.15 + key);
  col += vec3(0.76, 0.90, 1.00) * spec * (1.0 - 0.88 * vIsHand);
  col += vec3(0.022, 0.072, 0.148) * globeLight * 0.24;

  float bodyF = mix(uChest, 1.0, smoothstep(0.60, 0.74, y));
  float handGrainBoost = vIsHand * (0.34 * pow(fres, 1.35) + 0.30 * globeLight);
  float dens = (1.05 * key + 0.15 * fill + 0.75 * top + uFrontGrain * front) * bodyF + 0.20 * edge * (0.3 + key) + 1.60 * ridge + handGrainBoost;
  float gl = clamp(key + 0.85 * top + 0.45 * fill + 0.50 * front + ridge + 0.38 * globeLight, 0.0, 1.0);
  float tw = 0.80 + 0.20 * sin(uTime * 2.2 + h3 * 40.0);
  float g = pow(clamp(dens, 0.0, 1.0), 0.75);
  if (h2 < g * 1.25 && dc < 0.18 + 0.30 * g) {
    float b = (0.50 + 0.50 * h1) * tw * (0.22 + 0.88 * gl);
    bool lime = h3 > 1.0 - 0.85 * pow(max(key, globeLight * 0.55), 1.5);
    vec3 sc = lime ? uLime : vec3(0.56, 0.70, 0.86) + vec3(0.22) * min(ridge, 1.0);
    float la = lime ? uRimA : mix(uLightA, uRimA, 0.5 * key);
    col = mix(col, sc * b, 0.94 * la);
  }
  col += (uLime * pow(fres, 2.5) * (key * 0.16 + globeLight * 0.24) + vec3(0.45, 0.77, 0.97) * pow(fres, 2.7) * 0.18) * uLightA;
  float bottomFade = smoothstep(0.320, 0.435, vObj.y);
  float rightShoulderFade = 1.0 - smoothstep(0.180, 0.275, vObj.x);
  float edgeAlpha = clamp(bottomFade * rightShoulderFade, 0.0, 1.0) * mix(1.0, 0.76, vIsHand);
  if (edgeAlpha < 0.015) discard;
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

    // Layer 5: Sculpted Arm & Anatomical Hand Surface Stardust Blend (5,200 micro-stipples)
    const handStart = meshData.handStartVertex || 0;
    const handPalmStart = meshData.handPalmStartVertex || vertexCount;
    const armSpan = Math.max(1, handPalmStart - handStart);
    const fingerCount = Math.max(1, vertexCount - handPalmStart);
    if (handStart > 0 && armSpan > 10) {
      createParticleLayer(
        9600,
        (i, pArr, dArr, sArr, szArr) => {
          const onArm = i % 3 === 0;
          const vIdx = onArm
            ? handStart + Math.floor(Math.random() * armSpan)
            : handPalmStart + Math.floor(Math.random() * fingerCount);
          copyPos(pArr, i, vIdx, i % 10 === 0 ? 0.0022 : 0.0005);
          const ang = onArm
            ? ((25 + (Math.random() - 0.5) * 85) * Math.PI) / 180
            : ((92 + (Math.random() - 0.5) * 48) * Math.PI) / 180;
          const mag = onArm
            ? (0.20 + 0.40 * Math.random()) * 0.34
            : (0.04 + 0.14 * Math.random()) * 0.14;
          dArr[3 * i] = Math.cos(ang) * mag;
          dArr[3 * i + 1] = Math.abs(Math.sin(ang)) * mag;
          dArr[3 * i + 2] = (Math.random() - 0.5) * 0.18 * mag;
          const isFlake = onArm && i % 15 === 0;
          const w = isFlake ? Math.random() * CFG.flakeShare * 0.92 : 0.25 + 0.75 * Math.random();
          setSeed(sArr, i, w);
          szArr[i] = onArm ? calcSize(w) * 0.88 : (0.00038 + 0.00046 * Math.random());
        },
        { repel: 0.70 * CFG.mouseRepel, limeShare: 0.08, flakes: 1, allFlakes: 0 }
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
          if (typeof rebuildGlobe3DData === 'function') rebuildGlobe3DData();
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
      globeState.cx = cssW >= 1024 ? cssW * 0.275 : cssW * 0.38;
      globeState.cy = cssW >= 1024 ? cssH * 0.565 : cssH * 0.52;
      globeState.baseRadius = Math.max(74, Math.min(cssW, cssH) * (cssW < 768 ? 0.195 : 0.215));

      const aspect = cssW / cssH;
      camera.aspect = aspect;
      const tanFov = Math.tan(THREE.MathUtils.degToRad(14));
      const fitHalfH = cssW < 768 ? Math.max(frame.halfH, 0.285 / Math.max(0.42, aspect)) : frame.halfH;
      const camDist = fitHalfH / tanFov;
      viewHalfH = camDist * tanFov;
      viewHalfW = viewHalfH * aspect;

      // Anchor the 3D humanoid bust & spinning globe cleanly on mobile & desktop without clipping the hand or globe
      const rightScreenFrac = cssW >= 1024 ? 0.775 : 0.52;
      const ndcShiftX = (rightScreenFrac - 0.5) * 2;
      camTarget.x = frame.target[0] - ndcShiftX * viewHalfW;
      camTarget.y = cssW < 768 ? frame.target[1] - 0.045 : frame.target[1];
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

    // =========================================================================
    // TRUE 3D HOLOGRAPHIC WIREFRAME DOTTED GLOBE INSIDE HAND DEPTH BUFFER
    // =========================================================================
    const GLOBE_R = HAND_GLOBE_WORLD.radius;
    const globeGroup = new THREE.Group();
    globeGroup.position.copy(globeLocalPos);
    globeGroup.rotation.y = -CFG.baseYaw;
    rootGroup.add(globeGroup);

    const spinGroup = new THREE.Group();
    spinGroup.rotation.order = 'XYZ';
    globeGroup.add(spinGroup);

    const globeUniforms = {
      uTime: sharedUniforms.uTime,
      uScale: sharedUniforms.uScale,
      uZoom: { value: 1.0 },
      uGlobeR: { value: GLOBE_R }
    };

    function lngLatToSphereVec(lng, lat, r, out) {
      const phi = lat * DEG2RAD;
      const lam = lng * DEG2RAD;
      const cp = Math.cos(phi);
      out[0] = r * cp * Math.sin(lam);
      out[1] = r * Math.sin(phi);
      out[2] = r * cp * Math.cos(lam);
    }

    // 1. Soft Volumetric Sapphire-Cyan Palm Cradle Halo Billboard Behind Globe
    const globeHaloGeo = new THREE.PlaneGeometry(GLOBE_R * 3.1, GLOBE_R * 3.1);
    const globeHaloMat = new THREE.ShaderMaterial({
      uniforms: { uTime: sharedUniforms.uTime },
      vertexShader: `
varying vec2 vUv;
void main() {
  vUv = uv;
  vec4 mvCenter = modelViewMatrix * vec4(0.0, 0.0, 0.0, 1.0);
  mvCenter.xy += position.xy * 1.0;
  mvCenter.z -= 0.015;
  gl_Position = projectionMatrix * mvCenter;
}`,
      fragmentShader: `
uniform float uTime;
varying vec2 vUv;
void main() {
  float d = length(vUv - 0.5) * 2.0;
  if (d > 1.0) discard;
  float glow = exp(-d * d * 4.4) * (0.28 + 0.04 * sin(uTime * 1.8));
  vec3 col = mix(vec3(0.07, 0.25, 0.56), vec3(0.28, 0.75, 0.98), smoothstep(0.9, 0.15, d));
  gl_FragColor = vec4(col, glow);
}`,
      transparent: true,
      depthWrite: false,
      depthTest: true,
      blending: THREE.AdditiveBlending
    });
    const globeHaloMesh = new THREE.Mesh(globeHaloGeo, globeHaloMat);
    globeHaloMesh.renderOrder = 0;
    globeGroup.add(globeHaloMesh);

    // 2. Holographic Ocean Sphere with Smooth Fresnel Atmospheric Falloff (Zero Hard Rim)
    const oceanGeo = new THREE.SphereGeometry(GLOBE_R * 0.992, 64, 48);
    const oceanMat = new THREE.ShaderMaterial({
      uniforms: { uTime: sharedUniforms.uTime, uGlobeR: globeUniforms.uGlobeR },
      vertexShader: `
varying vec3 vViewN;
varying vec3 vViewDir;
varying vec3 vLocalPos;
void main() {
  vLocalPos = position;
  vViewN = normalize(normalMatrix * normal);
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vViewDir = normalize(-mv.xyz);
  gl_Position = projectionMatrix * mv;
}`,
      fragmentShader: `
uniform float uTime;
uniform float uGlobeR;
varying vec3 vViewN;
varying vec3 vViewDir;
varying vec3 vLocalPos;
void main() {
  vec3 N = normalize(vViewN);
  vec3 V = normalize(vViewDir);
  float front = clamp(dot(N, V), 0.0, 1.0);
  float rim = pow(1.0 - front, 2.3);
  float edgeFeather = smoothstep(0.0, 0.14, front);
  float palmFade = 0.72 + 0.28 * smoothstep(-uGlobeR * 0.98, -uGlobeR * 0.55, vLocalPos.y);

  vec3 coreCol = mix(vec3(0.032, 0.098, 0.230), vec3(0.095, 0.295, 0.595), rim);
  vec3 atmoCol = vec3(0.45, 0.77, 0.97);
  vec3 col = coreCol + atmoCol * pow(1.0 - front, 3.0) * 0.52;

  float baseAlpha = mix(0.44, 0.68, rim) * edgeFeather * (0.45 + 0.55 * palmFade);
  gl_FragColor = vec4(col, baseAlpha);
}`,
      transparent: true,
      depthWrite: false,
      depthTest: true
    });
    const oceanMesh = new THREE.Mesh(oceanGeo, oceanMat);
    oceanMesh.renderOrder = 1;
    globeGroup.add(oceanMesh);

    // 3. 3D Graticule Wireframe (15-deg Meridians & Parallels)
    const gratPositions = [];
    const gratNormals = [];
    const tmpA = [0, 0, 0];
    const tmpB = [0, 0, 0];
    const pushSegOnSphere = (arrPos, arrNrm, a, b) => {
      arrPos.push(a[0], a[1], a[2], b[0], b[1], b[2]);
      const la = Math.hypot(a[0], a[1], a[2]) || 1;
      const lb = Math.hypot(b[0], b[1], b[2]) || 1;
      arrNrm.push(a[0] / la, a[1] / la, a[2] / la, b[0] / lb, b[1] / lb, b[2] / lb);
    };
    for (let lng = -180; lng < 180; lng += 15) {
      for (let lat = -85; lat < 85; lat += 5) {
        lngLatToSphereVec(lng, lat, GLOBE_R * 1.000, tmpA);
        lngLatToSphereVec(lng, lat + 5, GLOBE_R * 1.000, tmpB);
        pushSegOnSphere(gratPositions, gratNormals, tmpA, tmpB);
      }
    }
    for (let lat = -75; lat <= 75; lat += 15) {
      for (let lng = -180; lng < 180; lng += 5) {
        lngLatToSphereVec(lng, lat, GLOBE_R * 1.000, tmpA);
        lngLatToSphereVec(lng + 5, lat, GLOBE_R * 1.000, tmpB);
        pushSegOnSphere(gratPositions, gratNormals, tmpA, tmpB);
      }
    }
    const gratGeo = new THREE.BufferGeometry();
    gratGeo.setAttribute('position', new THREE.Float32BufferAttribute(gratPositions, 3));
    gratGeo.setAttribute('normal', new THREE.Float32BufferAttribute(gratNormals, 3));

    const createSphereLineMat = (colorHex, frontAlpha, backAlpha) =>
      new THREE.ShaderMaterial({
        uniforms: { uColor: { value: new THREE.Color(colorHex) } },
        vertexShader: `
varying float vFront;
void main() {
  vec3 vn = normalize(normalMatrix * normal);
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vFront = dot(vn, normalize(-mv.xyz));
  gl_Position = projectionMatrix * mv;
}`,
        fragmentShader: `
uniform vec3 uColor;
varying float vFront;
void main() {
  float a = mix(${backAlpha.toFixed(3)}, ${frontAlpha.toFixed(3)}, smoothstep(-0.18, 0.30, vFront));
  gl_FragColor = vec4(uColor, a);
}`,
        transparent: true,
        depthWrite: false,
        depthTest: true
      });

    const graticuleLines = new THREE.LineSegments(
      gratGeo,
      createSphereLineMat(0x72c5f8, 0.21, 0.03)
    );
    graticuleLines.renderOrder = 2;
    spinGroup.add(graticuleLines);

    // 4. Dynamic 3D Continent Coastlines + Halftone Land Dots (Syncs with Natural Earth / Offline Data)
    let coastLinesMesh = null;
    let landDotsPoints = null;
    const coastMat = createSphereLineMat(0xbae6fd, 0.56, 0.05);
    const dotsMat = new THREE.ShaderMaterial({
      uniforms: {
        uScale: globeUniforms.uScale,
        uZoom: globeUniforms.uZoom
      },
      vertexShader: `
attribute float aHighlight;
uniform float uScale;
uniform float uZoom;
varying float vFront;
varying float vHighlight;
void main() {
  vHighlight = aHighlight;
  vec3 vn = normalize(normalMatrix * normal);
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vFront = dot(vn, normalize(-mv.xyz));
  float basePt = aHighlight > 1.5 ? 0.00245 : (aHighlight > 0.5 ? 0.00215 : 0.00165);
  gl_PointSize = max((basePt * uZoom * uScale) / (-mv.z), 1.4);
  gl_Position = projectionMatrix * mv;
}`,
      fragmentShader: `
varying float vFront;
varying float vHighlight;
void main() {
  float r = length(gl_PointCoord - 0.5);
  float mask = smoothstep(0.50, 0.22, r);
  if (mask < 0.02) discard;
  float hemi = smoothstep(-0.14, 0.24, vFront);
  vec3 col = vHighlight > 0.5 ? vec3(0.220, 0.741, 0.973) : vec3(0.557, 0.729, 0.886);
  float frontA = vHighlight > 0.5 ? 0.96 : 0.76;
  float alpha = mask * mix(0.06, frontA, hemi);
  gl_FragColor = vec4(col, alpha);
}`,
      transparent: true,
      depthWrite: false,
      depthTest: true
    });

    function rebuildGlobe3DData() {
      if (coastLinesMesh) {
        spinGroup.remove(coastLinesMesh);
        coastLinesMesh.geometry.dispose();
        coastLinesMesh = null;
      }
      if (landDotsPoints) {
        spinGroup.remove(landDotsPoints);
        landDotsPoints.geometry.dispose();
        landDotsPoints = null;
      }

      const cPos = [];
      const cNrm = [];
      for (let r = 0; r < globeState.landRings.length; r++) {
        const ring = globeState.landRings[r];
        if (!ring || ring.length < 2) continue;
        // Skip extreme Antarctic southern rings so polar lines don't form a target above the hand
        if (ring[0] && ring[0][1] < -60) continue;
        for (let i = 0; i < ring.length - 1; i++) {
          lngLatToSphereVec(ring[i][0], ring[i][1], GLOBE_R * 1.001, tmpA);
          lngLatToSphereVec(ring[i + 1][0], ring[i + 1][1], GLOBE_R * 1.001, tmpB);
          pushSegOnSphere(cPos, cNrm, tmpA, tmpB);
        }
      }
      if (cPos.length > 0) {
        const cGeo = new THREE.BufferGeometry();
        cGeo.setAttribute('position', new THREE.Float32BufferAttribute(cPos, 3));
        cGeo.setAttribute('normal', new THREE.Float32BufferAttribute(cNrm, 3));
        coastLinesMesh = new THREE.LineSegments(cGeo, coastMat);
        coastLinesMesh.renderOrder = 3;
        spinGroup.add(coastLinesMesh);
      }

      const rawDots = globeState.allDots || [];
      const dots = rawDots.filter((d) => d && d.lat >= -60);
      if (dots && dots.length > 0) {
        const dPos = new Float32Array(dots.length * 3);
        const dNrm = new Float32Array(dots.length * 3);
        const dHi = new Float32Array(dots.length);
        for (let i = 0; i < dots.length; i++) {
          lngLatToSphereVec(dots[i].lng, dots[i].lat, GLOBE_R * 1.003, tmpA);
          dPos[i * 3] = tmpA[0];
          dPos[i * 3 + 1] = tmpA[1];
          dPos[i * 3 + 2] = tmpA[2];
          const l = Math.hypot(tmpA[0], tmpA[1], tmpA[2]) || 1;
          dNrm[i * 3] = tmpA[0] / l;
          dNrm[i * 3 + 1] = tmpA[1] / l;
          dNrm[i * 3 + 2] = tmpA[2] / l;
          dHi[i] = dots[i].highlight || 0;
        }
        const dGeo = new THREE.BufferGeometry();
        dGeo.setAttribute('position', new THREE.BufferAttribute(dPos, 3));
        dGeo.setAttribute('normal', new THREE.BufferAttribute(dNrm, 3));
        dGeo.setAttribute('aHighlight', new THREE.BufferAttribute(dHi, 1));
        landDotsPoints = new THREE.Points(dGeo, dotsMat);
        landDotsPoints.renderOrder = 4;
        spinGroup.add(landDotsPoints);
      }
    }
    rebuildGlobe3DData();

    // 5. Pulsing PH & UK Beacons on the 3D Surface
    const beaconPos = new Float32Array(6);
    const beaconNrm = new Float32Array(6);
    const beaconPhase = new Float32Array([0.0, 2.1]);
    [
      [121.0, 14.6],
      [-0.13, 51.5]
    ].forEach((coord, idx) => {
      lngLatToSphereVec(coord[0], coord[1], GLOBE_R * 1.007, tmpA);
      beaconPos[idx * 3] = tmpA[0];
      beaconPos[idx * 3 + 1] = tmpA[1];
      beaconPos[idx * 3 + 2] = tmpA[2];
      const l = Math.hypot(tmpA[0], tmpA[1], tmpA[2]) || 1;
      beaconNrm[idx * 3] = tmpA[0] / l;
      beaconNrm[idx * 3 + 1] = tmpA[1] / l;
      beaconNrm[idx * 3 + 2] = tmpA[2] / l;
    });
    const beaconGeo = new THREE.BufferGeometry();
    beaconGeo.setAttribute('position', new THREE.BufferAttribute(beaconPos, 3));
    beaconGeo.setAttribute('normal', new THREE.BufferAttribute(beaconNrm, 3));
    beaconGeo.setAttribute('aPhase', new THREE.BufferAttribute(beaconPhase, 1));
    const beaconMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: sharedUniforms.uTime,
        uScale: globeUniforms.uScale,
        uZoom: globeUniforms.uZoom
      },
      vertexShader: `
attribute float aPhase;
uniform float uScale;
uniform float uZoom;
varying float vFront;
varying float vPhase;
void main() {
  vPhase = aPhase;
  vec3 vn = normalize(normalMatrix * normal);
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vFront = dot(vn, normalize(-mv.xyz));
  gl_PointSize = max((0.011 * uZoom * uScale) / (-mv.z), 6.0);
  gl_Position = projectionMatrix * mv;
}`,
      fragmentShader: `
uniform float uTime;
varying float vFront;
varying float vPhase;
void main() {
  if (vFront < 0.04) discard;
  float r = length(gl_PointCoord - 0.5) * 2.0;
  if (r > 1.0) discard;
  float pulse = 0.45 + 0.35 * sin(uTime * 3.2 + vPhase);
  float core = smoothstep(0.32, 0.14, r);
  float ring = smoothstep(0.10, 0.0, abs(r - pulse));
  float alpha = clamp(core * 0.95 + ring * 0.72, 0.0, 1.0) * smoothstep(0.04, 0.25, vFront);
  vec3 col = mix(vec3(0.220, 0.741, 0.973), vec3(0.878, 0.949, 0.996), core);
  gl_FragColor = vec4(col, alpha);
}`,
      transparent: true,
      depthWrite: false,
      depthTest: true
    });
    const beaconPoints = new THREE.Points(beaconGeo, beaconMat);
    beaconPoints.renderOrder = 5;
    spinGroup.add(beaconPoints);

    // 6. Tilted 3D Orbital Halo Ring & Orbiting Energy Motes (Passing In Front & Behind in 3D Depth)
    const orbitGroup = new THREE.Group();
    orbitGroup.rotation.set(0.26, 0.10, -0.22);
    globeGroup.add(orbitGroup);

    const orbitSegs = 96;
    const orbitR = GLOBE_R * 1.15;
    const orbitPos = new Float32Array(orbitSegs * 3);
    const orbitAng = new Float32Array(orbitSegs);
    for (let i = 0; i < orbitSegs; i++) {
      const a = (i / orbitSegs) * Math.PI * 2;
      orbitPos[i * 3] = Math.cos(a) * orbitR;
      orbitPos[i * 3 + 1] = 0;
      orbitPos[i * 3 + 2] = Math.sin(a) * orbitR;
      orbitAng[i] = a;
    }
    const orbitGeo = new THREE.BufferGeometry();
    orbitGeo.setAttribute('position', new THREE.BufferAttribute(orbitPos, 3));
    orbitGeo.setAttribute('aAngle', new THREE.BufferAttribute(orbitAng, 1));
    const orbitMat = new THREE.ShaderMaterial({
      uniforms: { uTime: sharedUniforms.uTime },
      vertexShader: `
attribute float aAngle;
varying float vAngle;
void main() {
  vAngle = aAngle;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`,
      fragmentShader: `
uniform float uTime;
varying float vAngle;
void main() {
  float wave = 0.55 + 0.45 * sin(vAngle * 2.0 - uTime * 1.4);
  gl_FragColor = vec4(vec3(0.447, 0.773, 0.973), 0.30 * wave);
}`,
      transparent: true,
      depthWrite: false,
      depthTest: true
    });
    const orbitLoop = new THREE.LineLoop(orbitGeo, orbitMat);
    orbitLoop.renderOrder = 4;
    orbitGroup.add(orbitLoop);

    const MOTE_COUNT = 10;
    const motePositions = new Float32Array(MOTE_COUNT * 3);
    const moteSizes = new Float32Array(MOTE_COUNT);
    for (let i = 0; i < MOTE_COUNT; i++) {
      moteSizes[i] = i % 2 === 0 ? 0.0022 : 0.0017;
    }
    const moteGeo = new THREE.BufferGeometry();
    const motePosAttr = new THREE.BufferAttribute(motePositions, 3);
    moteGeo.setAttribute('position', motePosAttr);
    moteGeo.setAttribute('aSize', new THREE.BufferAttribute(moteSizes, 1));
    const moteMat = new THREE.ShaderMaterial({
      uniforms: { uScale: globeUniforms.uScale, uZoom: globeUniforms.uZoom },
      vertexShader: `
attribute float aSize;
uniform float uScale;
uniform float uZoom;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = max((aSize * uZoom * uScale) / (-mv.z), 2.0);
  gl_Position = projectionMatrix * mv;
}`,
      fragmentShader: `
void main() {
  gl_FragColor = vec4(vec3(0.447, 0.808, 0.984), 0.85);
}`,
      transparent: true,
      depthWrite: false,
      depthTest: true
    });
    const orbitMotes = new THREE.Points(moteGeo, moteMat);
    orbitMotes.renderOrder = 5;
    orbitGroup.add(orbitMotes);

    function syncGlobe3DAndHitArea(dt, bodyYawVal) {
      if (globeCtx && globeCanvas) {
        globeCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
        globeCtx.clearRect(0, 0, cssW, cssH);
      }

      if (globeState.autoRotate && !globeState.dragging && !reduced) {
        globeState.rotLng += globeState.rotationSpeed * (dt * 60);
        if (globeState.rotLng > 180) globeState.rotLng -= 360;
      }

      const bobLocalY = reduced ? 0 : Math.sin(elapsed * 1.65) * 0.0022;
      globeGroup.position.set(globeLocalPos.x, globeLocalPos.y + bobLocalY, globeLocalPos.z);
      globeGroup.scale.setScalar(globeState.zoomScale);
      globeUniforms.uZoom.value = globeState.zoomScale;

      spinGroup.rotation.x = globeState.rotLat * DEG2RAD;
      spinGroup.rotation.y = globeState.rotLng * DEG2RAD;

      for (let i = 0; i < MOTE_COUNT; i++) {
        const ang = elapsed * (0.95 + (i % 3) * 0.18) + (i / MOTE_COUNT) * Math.PI * 2;
        const rr = orbitR * (0.98 + 0.06 * Math.sin(elapsed + i));
        motePositions[i * 3] = Math.cos(ang) * rr;
        motePositions[i * 3 + 1] = Math.sin(ang * 2.0 + i) * GLOBE_R * 0.035;
        motePositions[i * 3 + 2] = Math.sin(ang) * rr;
      }
      motePosAttr.needsUpdate = true;

      // Update projected 2D hit-test center & radius so pointer drag/zoom stay locked onto the 3D globe
      const deltaYaw = bodyYawVal - CFG.baseYaw;
      const cd = Math.cos(deltaYaw);
      const sd = Math.sin(deltaYaw);
      const gwx = HAND_GLOBE_WORLD.center[0];
      const gwy = HAND_GLOBE_WORLD.center[1] + bobLocalY;
      const gwz = HAND_GLOBE_WORLD.center[2];
      const grx = cd * gwx + sd * gwz;
      const grz = -sd * gwx + cd * gwz;

      globeAnchorVec.set(grx, gwy, grz).project(camera);
      globeTopVec.set(grx, gwy + GLOBE_R, grz).project(camera);
      globeBotVec.set(grx, gwy - GLOBE_R, grz).project(camera);

      globeState.cx = ((globeAnchorVec.x + 1) * 0.5) * cssW;
      globeState.cy = ((-globeAnchorVec.y + 1) * 0.5) * cssH;
      const projTopY = ((-globeTopVec.y + 1) * 0.5) * cssH;
      const projBotY = ((-globeBotVec.y + 1) * 0.5) * cssH;
      globeState.baseRadius = Math.max(68, Math.abs(projBotY - projTopY) * 0.5);
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

      syncGlobe3DAndHitArea(dt, bodyYaw);
      renderer.render(scene, camera);
      renderAsciiMatrix(dt, headYawRel, curPitch, bodyYaw, isPointerFresh);

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

