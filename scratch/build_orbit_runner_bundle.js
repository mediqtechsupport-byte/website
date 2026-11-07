const fs = require('fs');

const sourceCode = fs.readFileSync('components/ui/orbit-delivery-hero.tsx', 'utf8');

// Extract surface
const surfaceMatch = sourceCode.match(/surface\s*=\s*"(data:application\/json;base64,[^"]+)"/);
const surfaceDataUri = surfaceMatch[1];

const script = `/* ==========================================================================
   ORBIT DELIVERY 3D HERO RUNNER FOR MEDIQ ABOUT PAGE
   Exact 3D Globe & Running Courier from 21st.dev Orbit Delivery
   - Whimsical World GLB + Animated Courier GLB with Bag Suspension
   - Dynamic gait synchronization and inertia roaming
   - Seamless blending into the deep navy MedTech palette (#0a1d40)
   ========================================================================== */

(function() {
  'use strict';

  // 1. Math & Motion Utilities
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const damp = (value, target, lambda, dt) => value + (target - value) * (1 - Math.exp(-lambda * dt));
  const smoothstep = (value, min, max) => {
    const t = clamp((value - min) / (max - min), 0, 1);
    return t * t * (3 - 2 * t);
  };
  const GAIT_DISTANCE = 0.44;

  function createMotion() {
    return {
      planetAngle: 0,
      planetVelocity: 0,
      dragTarget: 0,
      characterTarget: 0,
      characterAngle: 0,
      characterVelocity: 0,
      phase: 0,
      activity: 0,
      direction: 1,
      time: 0,
      dragging: false,
      lastInteraction: 0,
      pitchAngle: 0,
      pitchVelocity: 0,
      pitchTarget: 0,
      cameraHeading: 0,
      heading: 0
    };
  }

  function stepPlanet(m, dt, auto, reduced, autoRoll = -0.032) {
    m.time += dt;
    if (!auto) {
      m.dragging = false;
      m.planetVelocity = m.pitchVelocity = 0;
      m.dragTarget = m.planetAngle;
      m.pitchTarget = m.pitchAngle;
      return;
    }
    if (m.dragging) {
      const acceleration = 90 * (m.dragTarget - m.planetAngle) - 18 * m.planetVelocity;
      m.planetVelocity += acceleration * dt;
    } else {
      const desired = auto && !reduced && m.time - m.lastInteraction > 3.5 ? autoRoll : 0;
      m.planetVelocity = damp(m.planetVelocity, desired, reduced ? 12 : 5, dt);
    }
    m.planetVelocity = clamp(m.planetVelocity, -1.15, 1.15);
    m.planetAngle += m.planetVelocity * dt;
  }

  function stepRunner(m, dt, screenTopLocal, reduced) {
    m.characterTarget += Math.atan2(Math.sin(screenTopLocal - m.characterTarget), Math.cos(screenTopLocal - m.characterTarget));
    const error = m.characterTarget - m.characterAngle;
    const stiffness = reduced ? 110 : 48;
    const dampingVal = reduced ? 21 : 11;
    m.characterVelocity += (stiffness * error - dampingVal * m.characterVelocity) * dt;
    m.characterAngle += m.characterVelocity * dt;
    const speed = Math.abs(m.characterVelocity);
    m.activity = damp(m.activity, smoothstep(speed, 4e-3, 0.022), 9, dt);
    if (speed > 0.025) m.direction = Math.sign(m.characterVelocity);
    m.phase += speed * 2.25 / GAIT_DISTANCE * Math.PI * 2 * dt;
  }

  function createGlobeMotion() {
    return {
      delta: new THREE.Quaternion(),
      orientation: new THREE.Quaternion().setFromEuler(new THREE.Euler(0.1, 0.5, 0)),
      angular: new THREE.Vector3(),
      route: 0
    };
  }

  function stepGlobeMotion(globe, m, dt, auto, reduced) {
    const roaming = auto && !reduced && !m.dragging && m.time - m.lastInteraction > 3.5;
    if (roaming) globe.route += 0.24 * dt;
    stepPlanet(m, dt, auto, reduced, -0.24 * Math.cos(globe.route));
    if (!auto) {
      globe.angular.set(0, 0, 0);
      return;
    }
    if (m.dragging) {
      m.pitchVelocity += (70 * (m.pitchTarget - m.pitchAngle) - 17 * m.pitchVelocity) * dt;
    } else {
      m.pitchVelocity = THREE.MathUtils.damp(m.pitchVelocity, roaming ? 0.24 * Math.sin(globe.route) : 0, 6, dt);
    }
    m.pitchVelocity = THREE.MathUtils.clamp(m.pitchVelocity, -0.55, 0.55);
    m.pitchAngle += m.pitchVelocity * dt;
    globe.angular.set(m.pitchVelocity, m.planetVelocity * 0.45, -m.planetVelocity);
    const speed = globe.angular.length();
    if (speed > 1e-8) {
      globe.delta.setFromAxisAngle(globe.angular.multiplyScalar(1 / speed), speed * dt);
      globe.orientation.premultiply(globe.delta).normalize();
    }
  }

  function createSurfaceMotion() {
    return {
      current: new THREE.Vector3(0, 1, 0),
      target: new THREE.Vector3(0, 1, 0),
      velocity: new THREE.Vector3(),
      error: new THREE.Vector3(),
      worldNormal: new THREE.Vector3(),
      worldVelocity: new THREE.Vector3(),
      inverse: new THREE.Quaternion(),
      initialized: false
    };
  }

  function stepSurface(s, m, rotation, screenUp, dt, reduced, paused = false) {
    s.inverse.copy(rotation).invert();
    s.target.copy(screenUp).applyQuaternion(s.inverse).normalize();
    if (!s.initialized) {
      s.current.copy(s.target);
      s.initialized = true;
    }
    if (paused) {
      s.velocity.set(0, 0, 0);
      s.worldVelocity.set(0, 0, 0);
      s.worldNormal.copy(s.current).applyQuaternion(rotation);
      m.characterVelocity = 0;
      m.activity = THREE.MathUtils.damp(m.activity, 0, 10, dt);
      return;
    }
    const cosine = THREE.MathUtils.clamp(s.current.dot(s.target), -1, 1);
    const angle = Math.acos(cosine);
    s.error.copy(s.target).addScaledVector(s.current, -cosine);
    if (s.error.lengthSq() > 1e-12) s.error.normalize().multiplyScalar(angle);
    const stiffness = reduced ? 110 : 48, dampingVal = reduced ? 21 : 11;
    s.velocity.addScaledVector(s.error, stiffness * dt).multiplyScalar(Math.exp(-dampingVal * dt));
    s.velocity.addScaledVector(s.current, -s.velocity.dot(s.current));
    s.current.addScaledVector(s.velocity, dt).normalize();
    s.velocity.addScaledVector(s.current, -s.velocity.dot(s.current));
    s.worldNormal.copy(s.current).applyQuaternion(rotation);
    s.worldVelocity.copy(s.velocity).applyQuaternion(rotation);
    const speed = s.velocity.length();
    m.characterTarget = Math.atan2(s.target.x, s.target.y);
    m.characterAngle = Math.atan2(s.current.x, s.current.y);
    if (Math.abs(s.worldVelocity.x) > 0.012) m.direction = Math.sign(s.worldVelocity.x);
    m.characterVelocity = speed * m.direction;
    m.activity = THREE.MathUtils.damp(m.activity, THREE.MathUtils.smoothstep(speed, 4e-3, 0.022), 9, dt);
    m.phase += speed * 2.25 / GAIT_DISTANCE * Math.PI * 2 * dt;
  }

  function surfaceRadius(surf, x, y, z) {
    if (!surf || !surf.radii) return 1.0;
    const u = (Math.atan2(x, z) / (2 * Math.PI) % 1 + 1) % 1 * surf.width;
    const v = Math.acos(Math.max(-1, Math.min(1, y))) / Math.PI * (surf.height - 1);
    const x0 = Math.floor(u), x1 = (x0 + 1) % surf.width;
    const y0 = Math.floor(v), y1 = Math.min(y0 + 1, surf.height - 1);
    const tx = u - x0, ty = v - y0;
    const a = surf.radii[y0 * surf.width + x0] * (1 - tx) + surf.radii[y0 * surf.width + x1] * tx;
    const b = surf.radii[y1 * surf.width + x0] * (1 - tx) + surf.radii[y1 * surf.width + x1] * tx;
    return a * (1 - ty) + b * ty;
  }

  // 2. Courier Rig Animation Helpers
  function makeSeamlessRun(source) {
    const reference = source.tracks.reduce((best, track) => track.times.length > best.times.length ? track : best);
    const start = reference.times[0];
    const last = reference.times[reference.times.length - 1];
    const intervals = Array.from(reference.times).slice(1).map((time, i) => time - reference.times[i]).sort((a, b) => a - b);
    const step = intervals.length ? intervals[Math.floor(intervals.length / 2)] : 1 / 24;
    const period = Math.max(step, last - start + step);
    const frames = Math.max(40, Math.ceil(period * 120));
    const quaternion = new THREE.Quaternion();
    const tracks = source.tracks.map((track) => {
      const count = track.times.length, size = track.getValueSize();
      const knots = Array.from(track.times, (time) => time - start);
      const samples = Array.from(track.values);
      const isRotation = track.name.endsWith(".quaternion");
      const isMorph = track.name.endsWith(".morphTargetInfluences");
      if (isRotation) for (let i = 1; i < count; i++) {
        let dot = 0;
        for (let c = 0; c < 4; c++) dot += samples[(i - 1) * 4 + c] * samples[i * 4 + c];
        if (dot < 0) for (let c = 0; c < 4; c++) samples[i * 4 + c] *= -1;
      }
      const times = [], values = [];
      for (let frame = 0; frame <= frames; frame++) {
        const time = frame === frames ? 0 : frame / frames * period;
        times.push(frame / frames * period);
        let index = 0;
        while (index < count - 1 && knots[index + 1] <= time) index++;
        const previous = (index - 1 + count) % count, next = (index + 1) % count, after = (index + 2) % count;
        const t1 = knots[index], t2 = next === 0 ? period + knots[0] : knots[next];
        const t0 = previous > index ? knots[previous] - period : knots[previous];
        const t3 = after <= next ? knots[after] + period : knots[after];
        const afterTime = t3 <= t2 ? t3 + period : t3;
        const length = Math.max(t2 - t1, 1e-6), u = Math.max(0, Math.min(1, (time - t1) / length));
        for (let c = 0; c < size; c++) {
          const p0 = samples[previous * size + c], p1 = samples[index * size + c], p2 = samples[next * size + c], p3 = samples[after * size + c];
          const a = count < 3 ? 0 : (p2 - p0) / Math.max(t2 - t0, 1e-6) * length;
          const b = count < 3 ? 0 : (p3 - p1) / Math.max(afterTime - t1, 1e-6) * length;
          values.push(count === 1 ? p1 : isMorph ? p1 + (p2 - p1) * u : (2 * u ** 3 - 3 * u ** 2 + 1) * p1 + (u ** 3 - 2 * u ** 2 + u) * a + (-2 * u ** 3 + 3 * u ** 2) * p2 + (u ** 3 - u ** 2) * b);
        }
        if (isRotation) {
          quaternion.fromArray(values, values.length - 4).normalize();
          quaternion.toArray(values, values.length - 4);
        }
      }
      const result = track.clone();
      result.times = new Float32Array(times);
      result.values = new Float32Array(values);
      return result;
    });
    return new THREE.AnimationClip("Courier_Run_Seamless", period, tracks);
  }

  function makeIdle(scene) {
    const tracks = [];
    const breath = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), 9e-3);
    scene.traverse((node) => {
      if (node.isMesh && node.morphTargetInfluences && node.morphTargetInfluences.length) {
        const zeros = new Array(node.morphTargetInfluences.length).fill(0);
        tracks.push(new THREE.NumberKeyframeTrack(node.name + ".morphTargetInfluences", [0, 3], [...zeros, ...zeros]));
      }
      if (!node.isBone) return;
      const q = node.quaternion.clone(), middle = q.clone();
      if (node.name === "Spine02" || node.name === "neck") middle.multiply(breath);
      tracks.push(new THREE.QuaternionKeyframeTrack(node.name + ".quaternion", [0, 1.5, 3], [...q.toArray(), ...middle.toArray(), ...q.toArray()]));
      const p = node.position.clone(), inhale = p.clone();
      if (node.name === "Hips") inhale.y += 4e-3;
      tracks.push(new THREE.VectorKeyframeTrack(node.name + ".position", [0, 1.5, 3], [...p.toArray(), ...inhale.toArray(), ...p.toArray()]));
      tracks.push(new THREE.VectorKeyframeTrack(node.name + ".scale", [0, 3], [...node.scale.toArray(), ...node.scale.toArray()]));
    });
    return new THREE.AnimationClip("Courier_Idle", 3, tracks);
  }

  function optimizeRigidBag(scene) {
    scene.updateWorldMatrix(true, true);
    const candidates = [];
    scene.traverse((node) => {
      if (node.isSkinnedMesh && node.name.startsWith("Delivery_Bag")) candidates.push(node);
    });
    for (const mesh of candidates) {
      if (Object.keys(mesh.geometry.morphAttributes).length) continue;
      const weights = mesh.geometry.getAttribute("skinWeight");
      const indices = mesh.geometry.getAttribute("skinIndex");
      if (!weights || !indices) continue;
      let joint = -1, rigid = true;
      for (let vertex = 0; vertex < weights.count && rigid; vertex++) {
        let total = 0;
        for (let channel = 0; channel < 4; channel++) {
          const weight = weights.getComponent(vertex, channel);
          if (weight < 1e-6) continue;
          const index = indices.getComponent(vertex, channel);
          if (joint < 0) joint = index;
          if (index !== joint) {
            rigid = false;
            break;
          }
          total += weight;
        }
        if (Math.abs(total - 1) > 1e-4) rigid = false;
      }
      if (!rigid || joint < 0) continue;
      const bone = mesh.skeleton.bones[joint];
      const bind = new THREE.Matrix4().multiplyMatrices(mesh.skeleton.boneInverses[joint], mesh.bindMatrix);
      const geometry = mesh.geometry.clone().applyMatrix4(bind);
      geometry.deleteAttribute("skinIndex");
      geometry.deleteAttribute("skinWeight");
      geometry.computeBoundingBox();
      geometry.computeBoundingSphere();
      const bag = new THREE.Mesh(geometry, mesh.material);
      bag.name = mesh.name;
      bag.castShadow = mesh.castShadow;
      bag.receiveShadow = mesh.receiveShadow;
      bag.renderOrder = mesh.renderOrder;
      bag.matrixAutoUpdate = false;
      mesh.removeFromParent();
      bone.add(bag);
      let shared = false;
      scene.traverse((node) => {
        if (node.isMesh && node.geometry === mesh.geometry) shared = true;
      });
      if (!shared) mesh.geometry.dispose();
    }
  }

  class BagSuspension {
    constructor(scene) {
      this.scene = scene;
      const bone = scene.getObjectByName("CourierBag");
      if (!bone) return;
      this.bone = bone;
      scene.updateWorldMatrix(true, true);
      scene.getWorldQuaternion(this.sceneOrientation);
      bone.getWorldQuaternion(this.restOrientation);
      this.restOrientation.premultiply(this.sceneOrientation.clone().invert());
      this.inverseRest.copy(this.restOrientation).invert();
    }
    restOrientation = new THREE.Quaternion();
    animatedOrientation = new THREE.Quaternion();
    animatedPosition = new THREE.Vector3();
    localAnchor = new THREE.Vector3();
    gravityTilt = new THREE.Quaternion();
    pelvisYaw = new THREE.Quaternion();
    inverseRest = new THREE.Quaternion();
    xAxis = new THREE.Vector3(1, 0, 0);
    hangingOrientation = new THREE.Quaternion();
    sceneOrientation = new THREE.Quaternion();
    parentOrientation = new THREE.Quaternion();
    swing = new THREE.Quaternion();
    angles = new THREE.Euler();
    inverseScene = new THREE.Matrix4();
    anchor = new THREE.Vector3();
    previousAnchor = new THREE.Vector3();
    velocity = new THREE.Vector3();
    previousVelocity = new THREE.Vector3();
    acceleration = new THREE.Vector3();
    initialized = false;
    applied = false;
    pitch = 0;
    roll = 8e-3;
    pitchVelocity = 0;
    rollVelocity = 0;

    restore() {
      if (!this.applied || !this.bone) return;
      this.bone.position.copy(this.animatedPosition);
      this.bone.quaternion.copy(this.animatedOrientation);
      this.applied = false;
    }

    update(dt, activity, _phase, turnRate, reduced, bodyLean = 0) {
      if (dt <= 0 || !this.bone || !this.bone.parent) return;
      this.animatedPosition.copy(this.bone.position);
      this.animatedOrientation.copy(this.bone.quaternion);
      this.inverseScene.copy(this.scene.matrixWorld).invert();
      this.bone.getWorldPosition(this.anchor).applyMatrix4(this.inverseScene);
      if (!this.initialized) {
        this.previousAnchor.copy(this.anchor);
        this.initialized = true;
      }
      this.velocity.copy(this.anchor).sub(this.previousAnchor).divideScalar(dt);
      this.acceleration.copy(this.velocity).sub(this.previousVelocity).divideScalar(dt);
      this.previousVelocity.lerp(this.velocity, 1 - Math.exp(-14 * dt));
      this.previousAnchor.copy(this.anchor);
      const gravity = Math.max(4, 9.81 + this.acceleration.y);
      const targetPitch = reduced ? 0 : THREE.MathUtils.clamp(Math.atan2(this.acceleration.z, gravity), -0.1, 0.1);
      const targetRoll = reduced ? 0 : THREE.MathUtils.clamp(Math.atan2(-this.acceleration.x, gravity) + Math.abs(turnRate) * 1e-3, -0.012, 0.045);
      const steps = Math.ceil(dt / (1 / 120)), h = dt / steps;
      for (let i = 0; i < steps; i++) {
        this.pitchVelocity += ((targetPitch - this.pitch) * 72 - this.pitchVelocity * 11) * h;
        this.rollVelocity += ((targetRoll - this.roll) * 64 - this.rollVelocity * 10) * h;
        this.pitch = THREE.MathUtils.clamp(this.pitch + this.pitchVelocity * h, -0.12, 0.12);
        this.roll = THREE.MathUtils.clamp(this.roll + this.rollVelocity * h, -0.012, 0.05);
      }
      this.scene.getWorldQuaternion(this.sceneOrientation);
      this.bone.getWorldQuaternion(this.pelvisYaw).premultiply(this.parentOrientation.copy(this.sceneOrientation).invert()).multiply(this.inverseRest);
      this.pelvisYaw.set(0, this.pelvisYaw.y, 0, this.pelvisYaw.w).normalize();
      this.bone.parent.getWorldQuaternion(this.parentOrientation).invert();
      this.swing.setFromEuler(this.angles.set(this.pitch, 0, this.roll));
      this.gravityTilt.setFromAxisAngle(this.xAxis, -bodyLean);
      this.hangingOrientation.copy(this.parentOrientation).multiply(this.sceneOrientation).multiply(this.gravityTilt).multiply(this.pelvisYaw).multiply(this.swing).multiply(this.restOrientation);
      this.bone.quaternion.copy(this.animatedOrientation).slerp(this.hangingOrientation, 1 - activity * 0.3);
      this.localAnchor.copy(this.anchor).addScaledVector(this.xAxis, -9e-3 * (1 - activity * 0.5));
      this.localAnchor.y -= 0.027;
      this.localAnchor.applyMatrix4(this.scene.matrixWorld);
      this.bone.parent.worldToLocal(this.localAnchor);
      this.bone.position.copy(this.localAnchor);
      this.bone.updateWorldMatrix(false, true);
      this.applied = true;
    }
  }

  // 3. Main About Globe Initializer
  function initAboutGlobeRunner() {
    const container = document.getElementById('about-globe-container');
    const wrapper = document.getElementById('about-globe-canvas-wrapper');
    if (!container || !wrapper) return;

    if (typeof THREE === 'undefined' || !THREE.GLTFLoader) {
      setTimeout(initAboutGlobeRunner, 100);
      return;
    }

    wrapper.innerHTML = '';

    const width = wrapper.clientWidth || 540;
    const height = wrapper.clientHeight || 540;

    // Scene & Orthographic Camera
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(
      -width / 2, width / 2, height / 2, -height / 2, 0.1, 30
    );
    camera.position.set(0, 0, 9);
    
    const small = width < 700;
    const zoom = width / (small ? 5.65 : 5.25);
    camera.zoom = zoom;
    camera.updateProjectionMatrix();

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    wrapper.appendChild(renderer.domElement);

    // Exact Lighting from Orbit Delivery
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xf1f5ff, 0x8aabc5, 1.4);
    scene.add(hemiLight);

    const dirLight1 = new THREE.DirectionalLight(0xfff8f1, 2.6);
    dirLight1.position.set(-3, 5, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xc5deff, 1.8);
    dirLight2.position.set(3, 2, -2);
    scene.add(dirLight2);

    // Root Group at centerY
    const centerY = height / zoom * (small ? 0.08 : 0.19) - 2.17;
    const rootGroup = new THREE.Group();
    rootGroup.position.set(0, centerY, 0);
    scene.add(rootGroup);

    const planetGroup = new THREE.Group();
    planetGroup.scale.set(2.25, 2.25, 2.25);
    rootGroup.add(planetGroup);

    const runnerFacing = new THREE.Group();
    runnerFacing.rotation.y = Math.PI / 2;
    const runnerLean = new THREE.Group();
    runnerFacing.add(runnerLean);
    const runnerGroup = new THREE.Group();
    const MODEL_SCALE = 0.76 / 1.7;
    runnerGroup.scale.set(MODEL_SCALE, MODEL_SCALE, MODEL_SCALE);
    runnerLean.add(runnerGroup);
    rootGroup.add(runnerFacing);

    // Decode surface radii data
    let surfaceData = null;
    try {
      const b64 = "${surfaceDataUri}".replace('data:application/json;base64,', '');
      const jsonStr = atob(b64);
      surfaceData = JSON.parse(jsonStr);
    } catch (e) {
      console.warn('Could not parse embedded surface data:', e);
    }

    // Motion states
    const motion = createMotion();
    const globe = createGlobeMotion();
    const surfaceMotion = createSurfaceMotion();
    const upVec = new THREE.Vector3(0, 1, 0);
    const radiusRef = { current: 2.2 };
    const frame = {
      screenUp: new THREE.Vector3(),
      localVelocity: new THREE.Vector3(),
      cameraFront: new THREE.Vector3(),
      inverseRunner: new THREE.Quaternion()
    };

    let planetReady = false;
    let courierReady = false;
    let courierAsset = null;

    const loader = new THREE.GLTFLoader();
    const cdnBase = "https://cdn.jsdelivr.net/gh/fadeichev2121/planet@b3f70fbf4b577845b1d9d5947c9410fb4d925dae/models/";

    function loadPlanetModel() {
      const load = (url) => {
        loader.load(url, (gltf) => {
          const sceneObj = gltf.scene;
          sceneObj.traverse((node) => {
            node.updateMatrix();
            node.matrixAutoUpdate = false;
            if (node.isMesh) {
              const materials = Array.isArray(node.material) ? node.material : [node.material];
              for (const mat of materials) {
                if (mat.isMeshStandardMaterial) {
                  mat.side = THREE.FrontSide;
                  mat.metalness = 0;
                  mat.roughness = 0.86;
                  mat.normalScale.setScalar(0.65);
                  if (mat.map) mat.map.anisotropy = 4;
                }
              }
            }
          });
          planetGroup.add(sceneObj);
          planetReady = true;
        }, undefined, (err) => {
          if (url !== cdnBase + "whimsical-world.glb") {
            load(cdnBase + "whimsical-world.glb");
          }
        });
      };
      load("assets/models/whimsical-world.glb");
    }

    function loadCourierModel() {
      const load = (url) => {
        loader.load(url, (gltf) => {
          optimizeRigidBag(gltf.scene);
          gltf.scene.traverse((node) => {
            if (!node.isMesh) return;
            if (node.morphTargetInfluences) node.morphTargetInfluences.fill(0);
            if (node.isSkinnedMesh) node.frustumCulled = false;
            const materials = Array.isArray(node.material) ? node.material : [node.material];
            for (const mat of materials) {
              if (mat.isMeshStandardMaterial) {
                mat.metalness = 0;
                mat.roughness = 0.9;
                mat.roughnessMap = null;
                mat.normalScale.setScalar(0.25);
                if (mat.map) mat.map.anisotropy = 8;
              }
            }
          });

          const clips = gltf.animations.filter((a) => a.duration > 0.3);
          const fullTrackClip = new THREE.AnimationClip("Courier_Run_Source", -1, clips.flatMap((a) => a.tracks));
          const mixer = new THREE.AnimationMixer(gltf.scene);
          const bag = new BagSuspension(gltf.scene);
          const idle = mixer.clipAction(makeIdle(gltf.scene)).play();
          const seamless = makeSeamlessRun(fullTrackClip);
          const run = mixer.clipAction(seamless).setLoop(THREE.LoopRepeat, Infinity).play();
          run.zeroSlopeAtStart = false;
          run.zeroSlopeAtEnd = false;
          run.setEffectiveTimeScale(1);
          run.setEffectiveWeight(1);
          mixer.update(0);

          courierAsset = {
            scene: gltf.scene,
            mixer,
            idle,
            run,
            duration: seamless.duration,
            bag
          };
          runnerGroup.add(gltf.scene);
          courierReady = true;
        }, undefined, (err) => {
          if (url !== cdnBase + "courier.glb") {
            load(cdnBase + "courier.glb");
          }
        });
      };
      load("assets/models/courier.glb");
    }

    loadPlanetModel();
    loadCourierModel();

    // 4. Pointer Interaction
    let auto = true;
    let dragId = null;
    let prevDrag = { x: 0, y: 0 };

    container.addEventListener('pointerdown', (e) => {
      if (!auto || !e.isPrimary || e.button !== 0) return;
      container.setPointerCapture(e.pointerId);
      dragId = e.pointerId;
      prevDrag = { x: e.clientX, y: e.clientY };
      motion.dragTarget = motion.planetAngle;
      motion.pitchTarget = motion.pitchAngle;
      motion.dragging = true;
      motion.lastInteraction = motion.time;
      container.style.cursor = 'grabbing';
    });

    container.addEventListener('pointermove', (e) => {
      if (!auto || dragId !== e.pointerId) return;
      const dx = e.clientX - prevDrag.x, dy = e.clientY - prevDrag.y;
      const sensitivity = 5 / Math.max(360, container.clientWidth);
      motion.dragTarget = clamp(motion.planetAngle - 0.5, motion.dragTarget + dx * sensitivity, motion.planetAngle + 0.5);
      motion.pitchTarget = clamp(motion.pitchAngle - 0.4, motion.pitchTarget + dy * sensitivity * 0.7, motion.pitchAngle + 0.4);
      prevDrag = { x: e.clientX, y: e.clientY };
      motion.lastInteraction = motion.time;
    });

    const release = (e) => {
      if (dragId === e.pointerId) {
        dragId = null;
        motion.dragging = false;
        motion.lastInteraction = motion.time;
        container.style.cursor = 'grab';
      }
    };

    container.addEventListener('pointerup', release);
    container.addEventListener('pointercancel', release);

    // 5. Animation Loop
    const clock = new THREE.Clock();
    let isVisible = true;
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    }, { threshold: 0.05 });
    observer.observe(container);

    function animate() {
      requestAnimationFrame(animate);
      if (!isVisible) return;

      const delta = clock.getDelta();
      const elapsed = Math.min(delta, 0.05);
      const count = Math.ceil(elapsed / (1 / 120));

      frame.screenUp.copy(upVec).applyQuaternion(camera.quaternion);

      for (let i = 0; i < count; i++) {
        const dt = elapsed / count;
        stepGlobeMotion(globe, motion, dt, auto, false);
        stepSurface(surfaceMotion, motion, globe.orientation, frame.screenUp, dt, false, !auto);
      }

      planetGroup.quaternion.copy(globe.orientation);

      const s = surfaceMotion;
      const r = (surfaceData ? surfaceRadius(surfaceData, s.current.x, s.current.y, s.current.z) : 1.0) * 2.25;
      radiusRef.current = THREE.MathUtils.damp(radiusRef.current, r + 8e-3, 25, elapsed);

      runnerFacing.position.copy(s.worldNormal).multiplyScalar(radiusRef.current);
      runnerFacing.quaternion.setFromUnitVectors(upVec, s.worldNormal);

      frame.inverseRunner.copy(runnerFacing.quaternion).invert();
      frame.cameraFront.set(0, 0, 1).applyQuaternion(camera.quaternion).applyQuaternion(frame.inverseRunner);
      motion.cameraHeading = Math.atan2(frame.cameraFront.x, frame.cameraFront.z);

      if (s.velocity.lengthSq() > 1e-4) {
        frame.localVelocity.copy(s.worldVelocity).applyQuaternion(frame.inverseRunner);
        motion.heading = Math.atan2(-frame.localVelocity.z, frame.localVelocity.x);
      }

      // Turn courier towards movement heading
      const desired = (motion.heading ?? 0) + Math.PI / 2;
      const turn = Math.atan2(Math.sin(desired - runnerFacing.rotation.y), Math.cos(desired - runnerFacing.rotation.y));
      const rotation = turn * (1 - Math.exp(-12 * elapsed));
      runnerFacing.rotation.y += rotation;

      if (courierAsset) {
        const activity = Math.max(motion.activity, 0.4);
        courierAsset.run.setEffectiveWeight(activity);
        courierAsset.idle.setEffectiveWeight(1 - activity);
        const playback = Math.max(Math.abs(motion.characterVelocity) * 2.25 / GAIT_DISTANCE * courierAsset.duration, 0.85);
        courierAsset.run.setEffectiveTimeScale(THREE.MathUtils.damp(courierAsset.run.timeScale, playback, 10, elapsed));
        courierAsset.bag.restore();
        courierAsset.mixer.update(elapsed);
        courierAsset.scene.updateWorldMatrix(true, true);
        courierAsset.bag.update(elapsed, activity, motion.phase, rotation / elapsed, false, runnerLean.rotation.x);
      }

      renderer.render(scene, camera);
    }
    animate();

    function handleResize() {
      if (!wrapper || !renderer) return;
      const newW = wrapper.clientWidth || 540;
      const newH = wrapper.clientHeight || 540;
      const isSm = newW < 700;
      const newZoom = newW / (isSm ? 5.65 : 5.25);
      camera.left = -newW / 2;
      camera.right = newW / 2;
      camera.top = newH / 2;
      camera.bottom = -newH / 2;
      camera.zoom = newZoom;
      camera.updateProjectionMatrix();
      rootGroup.position.y = newH / newZoom * (isSm ? 0.08 : 0.19) - 2.17;
      renderer.setSize(newW, newH);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    }
    window.addEventListener('resize', handleResize);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAboutGlobeRunner);
  } else {
    initAboutGlobeRunner();
  }
})();
`;

fs.writeFileSync('assets/js/about-globe-runner.js', script, 'utf8');
console.log('Successfully generated assets/js/about-globe-runner.js! Size:', script.length);

