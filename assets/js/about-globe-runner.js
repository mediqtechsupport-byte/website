/* ==========================================================================
   ORBIT DELIVERY 3D HERO RUNNER FOR MEDIQ ABOUT PAGE
   - Seamlessly Uniform with Hero Page Background (Fluid Organic Smoke Canvas)
   - Clean 3D Globe with Courier Navigation following Cursor Drag / Touch
   - Real-Time Surface Terrain Tracking (Zero Floating)
   - Synchronized Courier Stride & Ground Linear Speed (Zero Foot-Sliding)
   - Dual Animation Blending (Idle Breathing & Running) + Bag Suspension + Greeting Wave
   - Deep MedTech Navy Atmospheric Integration
   ========================================================================== */

(function () {
  'use strict';

  // 1. Math & Physics Constants
  const clamp = (val, min, max) => Math.max(min, Math.min(max, val));
  const damp = (val, target, lambda, dt) => val + (target - val) * (1 - Math.exp(-lambda * dt));
  const smoothstep = (val, min, max) => {
    const t = clamp((val - min) / (max - min), 0, 1);
    return t * t * (3 - 2 * t);
  };
  const GAIT_DISTANCE = 0.44;
  const GLOBE_RADIUS = 2.25;
  const upVec = new THREE.Vector3(0, 1, 0);
  const up = new THREE.Vector3(0, 1, 0);

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
      heading: 0,
      cameraHeading: 0
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
      globe.delta.setFromAxisAngle(globe.angular.clone().multiplyScalar(1 / speed), speed * dt);
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
    const stiffness = reduced ? 110 : 48;
    const damping = reduced ? 21 : 11;
    s.velocity.addScaledVector(s.error, stiffness * dt).multiplyScalar(Math.exp(-damping * dt));
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
    m.phase += (speed * 2.25 / GAIT_DISTANCE) * Math.PI * 2 * dt;
  }

  // 2. Bilinear Surface Heightmap Interpolator
  function surfaceRadius(surf, x, y, z) {
    if (!surf || !surf.radii) return 0.9355;
    const u = ((Math.atan2(x, z) / (2 * Math.PI)) % 1 + 1) % 1 * surf.width;
    const v = (Math.acos(Math.max(-1, Math.min(1, y))) / Math.PI) * (surf.height - 1);
    const x0 = Math.floor(u);
    const x1 = (x0 + 1) % surf.width;
    const y0 = Math.floor(v);
    const y1 = Math.min(y0 + 1, surf.height - 1);
    const tx = u - x0;
    const ty = v - y0;
    const a = surf.radii[y0 * surf.width + x0] * (1 - tx) + surf.radii[y0 * surf.width + x1] * tx;
    const b = surf.radii[y1 * surf.width + x0] * (1 - tx) + surf.radii[y1 * surf.width + x1] * tx;
    return a * (1 - ty) + b * ty;
  }

  // 3. Animation Generators
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
  const breath = new THREE.THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), 9e-3);
  scene.traverse((node) => {
    if (node instanceof THREE.Mesh && node.morphTargetInfluences?.length) {
      const zeros = new Array(node.morphTargetInfluences.length).fill(0);
      tracks.push(new THREE.NumberKeyframeTrack(`${node.name}.morphTargetInfluences`, [0, 3], [...zeros, ...zeros]));
    }
    if (!(node instanceof THREE.Bone)) return;
    const q = node.quaternion.clone(), middle = q.clone();
    if (node.name === "Spine02" || node.name === "neck") middle.multiply(breath);
    tracks.push(new THREE.THREE.QuaternionKeyframeTrack(`${node.name}.quaternion`, [0, 1.5, 3], [...q.toArray(), ...middle.toArray(), ...q.toArray()]));
    const p = node.position.clone(), inhale = p.clone();
    if (node.name === "Hips") inhale.y += 4e-3;
    tracks.push(new THREE.VectorKeyframeTrack(`${node.name}.position`, [0, 1.5, 3], [...p.toArray(), ...inhale.toArray(), ...p.toArray()]));
    tracks.push(new THREE.VectorKeyframeTrack(`${node.name}.scale`, [0, 3], [...node.scale.toArray(), ...node.scale.toArray()]));
  });
  return new THREE.AnimationClip("Courier_Idle", 3, tracks);
}


  // 4. Rigid Bag Optimization
  function optimizeRigidBag(scene) {
  scene.updateWorldMatrix(true, true);
  const candidates = [];
  scene.traverse((node) => {
    if (node instanceof SkinnedTHREE.Mesh && node.name.startsWith("Delivery_Bag")) candidates.push(node);
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
      if (node instanceof THREE.Mesh && node.geometry === mesh.geometry) shared = true;
    });
    if (!shared) mesh.geometry.dispose();
  }
}


  // 5. Bag Suspension Class
  class BagSuspension {
    constructor(scene) {
      this.scene = scene;
      const bone = scene.getObjectByName('CourierBag');
      this.bone = bone instanceof THREE.Bone ? bone : null;
      if (this.bone) {
        this.restPosition.copy(this.bone.position);
        this.restOrientation.copy(this.bone.quaternion);
        this.animatedPosition.copy(this.bone.position);
        this.animatedOrientation.copy(this.bone.quaternion);
      }
    }
    bone = null;
    restPosition = new THREE.Vector3();
    restOrientation = new THREE.Quaternion();
    animatedOrientation = new THREE.Quaternion();
    animatedPosition = new THREE.Vector3();
    localAnchor = new THREE.Vector3();
    gravityTilt = new THREE.Quaternion();
    previousVelocity = new THREE.Vector3();
    acceleration = new THREE.Vector3();
    applied = false;
    previousAnchor = new THREE.Vector3();
    currentAnchor = new THREE.Vector3();
    anchor = new THREE.Vector3();
    velocity = new THREE.Vector3();
    position = new THREE.Vector3();
    offset = new THREE.Vector3();
    spring = new THREE.Vector3();
    forward = new THREE.Vector3();
    inverseScene = new THREE.Matrix4();
    initialized = false;
    lead = 0;
    leadVelocity = 0;

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
        this.currentAnchor.copy(this.anchor);
        this.initialized = true;
      }
      this.velocity.copy(this.anchor).sub(this.currentAnchor).multiplyScalar(1 / dt);
      this.currentAnchor.copy(this.anchor);
      this.acceleration.copy(this.velocity).sub(this.previousVelocity).multiplyScalar(1 / dt);
      this.previousVelocity.copy(this.velocity);
      this.leadVelocity += ((-turnRate * 0.08 - this.lead) * 16 - 7 * this.leadVelocity) * dt;
      this.lead += this.leadVelocity * dt;
      this.lead = THREE.MathUtils.clamp(this.lead, -0.3, 0.3);
      const sideInertia = reduced ? 0 : THREE.MathUtils.clamp(-this.acceleration.x * 0.003 + this.lead, -0.22, 0.22);
      const runSag = -activity * 0.045;
      const verticalInertia = reduced ? 0 : THREE.MathUtils.clamp(-this.acceleration.y * 0.0035, -0.05, 0.05);
      this.offset.set(sideInertia, runSag + verticalInertia, 0);
      this.spring.copy(this.offset).sub(this.position);
      this.position.addScaledVector(this.spring, Math.min(1, 18 * dt));
      this.localAnchor.copy(this.restPosition).add(this.position);
      this.gravityTilt.setFromAxisAngle(this.forward.set(0, 0, 1), -sideInertia * 0.9 + bodyLean * 0.4);
      this.bone.quaternion.copy(this.restOrientation).multiply(this.gravityTilt);
      this.localAnchor.applyMatrix4(this.scene.matrixWorld);
      this.bone.parent.worldToLocal(this.localAnchor);
      this.bone.position.copy(this.localAnchor);
      this.bone.updateWorldMatrix(false, true);
      this.applied = true;
    }
  }

  // 6. Courier Greeting Controller
  class CourierGreeting {
      constructor(scene) {
        this.scene = scene;
        scene.updateWorldMatrix(true, true);
        const inverseScene = scene.getWorldQuaternion(new THREE.Quaternion()).invert();
        this.joints = ["RightArm", "RightForeArm", "RightHand"].map((name) => {
          const bone = scene.getObjectByName(name);
          if (!(bone instanceof THREE.Bone)) throw new Error(`Greeting joint ${name} is missing.`);
          const rest = bone.getWorldQuaternion(new THREE.Quaternion()).premultiply(inverseScene);
          const direction = up.clone().applyQuaternion(rest).normalize();
          const palm = new THREE.Vector3(1, 0, 0).addScaledVector(direction, -direction.x).normalize();
          return { bone, rest, direction, palm, animated: bone.quaternion.clone() };
        });
        this.restBendNormal.crossVectors(this.joints[0].direction, this.joints[1].direction).normalize();
      }
      joints;
      sceneRotation = new THREE.Quaternion();
      inverseParent = new THREE.Quaternion();
      aim = new THREE.Quaternion();
      twist = new THREE.Quaternion();
      target = new THREE.Quaternion();
      direction = new THREE.Vector3();
      palm = new THREE.Vector3();
      wantedPalm = new THREE.Vector3();
      cross = new THREE.Vector3();
      restBendNormal = new THREE.Vector3();
      bendNormal = new THREE.Vector3();
      upperDirection = new THREE.Vector3(-0.55, -0.65, 0.52).normalize();
      forearmDirection = new THREE.Vector3();
      phase = 0;
      applied = false;
      weight = 0;
      restore() {
        if (!this.applied) return;
        for (const joint of this.joints) joint.bone.quaternion.copy(joint.animated);
        this.applied = false;
      }
      step(dt, ready, reduced) {
        this.weight = THREE.MathUtils.damp(this.weight, ready ? 1 : 0, ready ? 4 : 9, dt);
        if (this.weight < 1e-4) {
          this.weight = 0;
          this.phase = 0;
        }
        if (ready && this.weight > 0.85 && !reduced) this.phase += dt * Math.PI * 2 * 0.9;
      }
      apply(reduced) {
        if (this.weight === 0) return;
        this.scene.getWorldQuaternion(this.sceneRotation);
        const wave = Math.sin(this.phase) * (reduced ? 0 : 0.12) * THREE.MathUtils.smoothstep(this.weight, 0.85, 0.99);
        this.forearmDirection.set(-0.08 + wave * 0.35, 0.94, 0.33).normalize();
        this.bendNormal.crossVectors(this.upperDirection, this.forearmDirection).normalize();
        this.joints.forEach((joint, index) => {
          joint.animated.copy(joint.bone.quaternion);
          if (index === 0) this.direction.copy(this.upperDirection);
          else if (index === 1) this.direction.copy(this.forearmDirection);
          else this.direction.set(-0.06 + wave, 0.97, 0.22);
          this.direction.normalize();
          this.aim.setFromUnitVectors(joint.direction, this.direction);
          this.target.copy(this.aim).multiply(joint.rest);
          this.palm.copy(this.restBendNormal).addScaledVector(joint.direction, -this.restBendNormal.dot(joint.direction)).normalize().applyQuaternion(this.aim);
          this.wantedPalm.copy(this.bendNormal).addScaledVector(this.direction, -this.bendNormal.dot(this.direction)).normalize();
          const angle = Math.atan2(this.direction.dot(this.cross.crossVectors(this.palm, this.wantedPalm)), this.palm.dot(this.wantedPalm));
          this.twist.setFromAxisAngle(this.direction, angle);
          this.target.premultiply(this.twist);
          joint.bone.parent.getWorldQuaternion(this.inverseParent).invert();
          this.target.premultiply(this.sceneRotation).premultiply(this.inverseParent);
          joint.bone.quaternion.slerp(this.target, this.weight);
          joint.bone.updateWorldMatrix(false, true);
        });
        this.applied = true;
      }
    };


  // 7. Initialization
  function initAboutGlobeRunner() {
    const container = document.getElementById('about-globe-container');
    const canvasWrapper = document.getElementById('about-globe-canvas-wrapper');
    if (!container || !canvasWrapper) return;
    if (canvasWrapper.querySelector('canvas')) return;

    // Renderer
    const width = container.clientWidth || 560;
    const height = container.clientHeight || 560;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    canvasWrapper.appendChild(renderer.domElement);

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 50);
    camera.position.set(0, 0, 10);
    camera.lookAt(0, 0, 0);

    // Ambient and Key Lighting (Whimsical World + MedTech Hero Integration)
    scene.add(new THREE.AmbientLight(0xd4e7fe, 1.25));
    scene.add(new THREE.HemisphereLight(0xffffff, 0x0a1d40, 1.35));

    const keyLight = new THREE.DirectionalLight(0xfff5ea, 2.8);
    keyLight.position.set(-3, 6, 6);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x72c5f8, 1.9);
    fillLight.position.set(4, 2, -3);
    scene.add(fillLight);

    const frontLight = new THREE.DirectionalLight(0xffffff, 1.4);
    frontLight.position.set(0, 2, 7);
    scene.add(frontLight);

    // Root Group
    const rootGroup = new THREE.Group();
    rootGroup.position.set(0, -0.65, 0);
    scene.add(rootGroup);

    // Globe Group
    const globeGroup = new THREE.Group();
    globeGroup.scale.set(GLOBE_RADIUS, GLOBE_RADIUS, GLOBE_RADIUS);
    rootGroup.add(globeGroup);

    // Load Planet
    let planetReady = false;
    if (THREE.GLTFLoader) {
      const loader = new THREE.GLTFLoader();
      loader.load('assets/models/whimsical-world.glb', (gltf) => {
        gltf.scene.traverse((node) => {
          if (node.isMesh) {
            node.castShadow = false;
            node.receiveShadow = false;
            if (node.material) {
              node.material.roughness = 0.86;
              node.material.metalness = 0.02;
            }
          }
        });
        globeGroup.add(gltf.scene);
        planetReady = true;
      });
    }

    // Load Surface Radii for Ground Collision
    let surfaceData = null;
    fetch('assets/models/surface.json')
      .then(res => res.json())
      .then(data => { surfaceData = data; })
      .catch(() => {});

    // 8. Runner Hierarchy (Visible immediately with fallback runner)
    const runnerContainer = new THREE.Group();
    runnerContainer.visible = true;
    rootGroup.add(runnerContainer);

    const runnerFacing = new THREE.Group();
    runnerFacing.rotation.y = Math.PI / 2;
    runnerContainer.add(runnerFacing);

    const runnerLean = new THREE.Group();
    runnerFacing.add(runnerLean);

    const runnerGroup = new THREE.Group();
    const MODEL_SCALE = 0.76 / 1.7;
    runnerGroup.scale.set(MODEL_SCALE, MODEL_SCALE, MODEL_SCALE);
    runnerLean.add(runnerGroup);

    // Whimsical Placeholder Runner (Active from frame 0)
    const placeholderRunner = new THREE.Group();
    const capMat = new THREE.MeshStandardMaterial({ color: 0x3aa0db, roughness: 0.4 });
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xf5cfb3, roughness: 0.6 });
    const shirtMat = new THREE.MeshStandardMaterial({ color: 0x16305c, roughness: 0.5 });
    const shortsMat = new THREE.MeshStandardMaterial({ color: 0xdddddd, roughness: 0.8 });
    const bagMat = new THREE.MeshStandardMaterial({ color: 0x10264d, roughness: 0.4 });

    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.45, 0.22), shirtMat);
    torso.position.y = 0.9;
    placeholderRunner.add(torso);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.14, 16, 16), skinMat);
    head.position.y = 1.25;
    placeholderRunner.add(head);

    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.08, 16), capMat);
    cap.position.set(0.04, 1.34, 0);
    placeholderRunner.add(cap);

    const courierBag = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.22, 0.12), bagMat);
    courierBag.position.set(-0.16, 0.82, 0.08);
    courierBag.rotation.z = 0.2;
    placeholderRunner.add(courierBag);

    const legLeft = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.45, 0.11), shortsMat);
    legLeft.position.set(0.09, 0.45, 0);
    placeholderRunner.add(legLeft);

    const legRight = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.45, 0.11), shortsMat);
    legRight.position.set(-0.09, 0.45, 0);
    placeholderRunner.add(legRight);

    runnerGroup.add(placeholderRunner);

    // 9. Load 3D Courier Model with Robust Try/Catch Fallbacks
    let courierMixer = null;
    let runAction = null;
    let idleAction = null;
    let bagSuspension = null;
    let greeting = null;
    let courierDuration = 0.6667;
    let courierReady = false;

    if (THREE.GLTFLoader) {
      const courierLoader = new THREE.GLTFLoader();
      courierLoader.load('assets/models/courier.glb', (gltf) => {
        try {
          optimizeRigidBag(gltf.scene);
        } catch(e) {}

        gltf.scene.traverse((node) => {
          if (!node.isMesh) return;
          if (node.morphTargetInfluences) node.morphTargetInfluences.fill(0);
          if (node.isSkinnedMesh) node.frustumCulled = false;
          const materials = Array.isArray(node.material) ? node.material : [node.material];
          for (const mat of materials) {
            if (mat.isMeshStandardMaterial) {
              mat.metalness = 0;
              mat.roughness = 0.88;
              if (mat.map) mat.map.anisotropy = 8;
            }
          }
        });

        const clips = gltf.animations.filter((a) => a.duration > 0.3);
        if (clips.length > 0) {
          courierMixer = new THREE.AnimationMixer(gltf.scene);

          try {
            const seamless = makeSeamlessRun(clips[0]);
            courierDuration = seamless.duration;
            runAction = courierMixer.clipAction(seamless);
          } catch (e) {
            console.warn('Using standard run clip:', e);
            runAction = courierMixer.clipAction(clips[0]);
            courierDuration = clips[0].duration;
          }

          runAction.setLoop(THREE.LoopRepeat, Infinity);
          runAction.play();
          runAction.setEffectiveWeight(0);
          runAction.setEffectiveTimeScale(0);

          try {
            idleAction = courierMixer.clipAction(makeIdle(gltf.scene));
            idleAction.setLoop(THREE.LoopRepeat, Infinity);
            idleAction.play();
            idleAction.setEffectiveWeight(1);
          } catch(e) {
            console.warn('Idle action fallback:', e);
          }
        }

        try {
          bagSuspension = new BagSuspension(gltf.scene);
        } catch(e) {}

        try {
          greeting = new CourierGreeting(gltf.scene);
        } catch(e) {}

        runnerGroup.remove(placeholderRunner);
        runnerGroup.add(gltf.scene);
        courierReady = true;
        runnerContainer.visible = true;
      }, undefined, (err) => {
        console.warn('Courier load warning:', err);
      });
    }

    // 10. Motion States
    const motion = createMotion();
    const globe = createGlobeMotion();
    const surfaceMotion = createSurfaceMotion();
    const frame = {
      screenUp: new THREE.Vector3(),
      localVelocity: new THREE.Vector3(),
      cameraFront: new THREE.Vector3(),
      inverseRunner: new THREE.Quaternion()
    };
    let radiusRef = 2.105;
    let turnVelocity = 0;
    let isAutoRotating = true;
    let greetingTurn = false;

    // Pointer Drag Listeners (Multi-Directional Drag)
    let dragId = null;
    let prevDrag = { x: 0, y: 0 };

    container.addEventListener('pointerdown', (e) => {
      if (!e.isPrimary || e.button !== 0) return;
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
      if (dragId !== e.pointerId) return;
      const dx = e.clientX - prevDrag.x;
      const dy = e.clientY - prevDrag.y;
      const sensitivity = 5 / Math.max(360, container.clientWidth);
      motion.dragTarget = clamp(motion.planetAngle - 0.5, motion.dragTarget + dx * sensitivity, motion.planetAngle + 0.5);
      motion.pitchTarget = clamp(motion.pitchAngle - 0.4, motion.pitchTarget + dy * sensitivity * 0.7, motion.pitchAngle + 0.4);
      prevDrag = { x: e.clientX, y: e.clientY };
      motion.lastInteraction = motion.time;
    });

    const releaseDrag = (e) => {
      if (dragId === e.pointerId) {
        dragId = null;
        motion.dragging = false;
        motion.lastInteraction = motion.time;
        container.style.cursor = 'grab';
      }
    };
    container.addEventListener('pointerup', releaseDrag);
    container.addEventListener('pointercancel', releaseDrag);

    // Animation Loop (Visibility + About-Slide Gated — 0% CPU/GPU offscreen or hidden)
    const clock = new THREE.Clock();
    let rafId = 0;
    let inView = true;
    let slideActive = true;
    let docVisible = !document.hidden;

    const slideEl = container.closest('.about-slide');
    const syncSlideState = () => {
      if (!slideEl) {
        slideActive = true;
        return;
      }
      slideActive = !slideEl.classList.contains('opacity-0') && !slideEl.classList.contains('pointer-events-none');
    };
    syncSlideState();

    const shouldRun = () => inView && slideActive && docVisible;
    const syncRunState = () => {
      if (shouldRun()) {
        if (!rafId) {
          clock.getDelta();
          rafId = requestAnimationFrame(animate);
        }
      } else if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
    };

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        inView = entries.some((en) => en.isIntersecting);
        syncRunState();
      }, { rootMargin: '80px 0px', threshold: 0.01 });
      io.observe(container);
    }

    if (slideEl && typeof MutationObserver !== 'undefined') {
      const mo = new MutationObserver(() => {
        syncSlideState();
        syncRunState();
      });
      mo.observe(slideEl, { attributes: true, attributeFilter: ['class'] });
    }

    document.addEventListener('visibilitychange', () => {
      docVisible = !document.hidden;
      syncRunState();
    });

    function animate() {
      rafId = 0;
      if (!shouldRun()) return;

      const delta = Math.min(clock.getDelta(), 0.05);
      const time = clock.getElapsedTime();
      const count = Math.ceil(delta / (1 / 120));

      frame.screenUp.copy(upVec).applyQuaternion(camera.quaternion);

      // Sub-stepped physics
      for (let i = 0; i < count; i++) {
        const dt = delta / count;
        stepGlobeMotion(globe, motion, dt, isAutoRotating, false);
        stepSurface(surfaceMotion, motion, globe.orientation, frame.screenUp, dt, false, !isAutoRotating);
      }

      // 1. Globe orientation
      globeGroup.quaternion.copy(globe.orientation);

      // 2. Exact Ground Surface Tracking (Zero Floating)
      const s = surfaceMotion;
      const r = (surfaceData ? surfaceRadius(surfaceData, s.current.x, s.current.y, s.current.z) : 0.9355) * GLOBE_RADIUS;
      radiusRef = THREE.MathUtils.damp(radiusRef, r + 0.008, 25, delta);

      // 3. Position runner at exact ground normal
      runnerContainer.position.copy(s.worldNormal).multiplyScalar(radiusRef);
      runnerContainer.quaternion.setFromUnitVectors(upVec, s.worldNormal);

      // 4. Multi-directional Heading & Steering based on Motion Vector
      frame.inverseRunner.copy(runnerContainer.quaternion).invert();
      frame.cameraFront.set(0, 0, 1).applyQuaternion(camera.quaternion).applyQuaternion(frame.inverseRunner);
      motion.cameraHeading = Math.atan2(frame.cameraFront.x, frame.cameraFront.z);

      if (s.velocity.lengthSq() > 1e-4) {
        frame.localVelocity.copy(s.worldVelocity).applyQuaternion(frame.inverseRunner);
        motion.heading = Math.atan2(-frame.localVelocity.z, frame.localVelocity.x);
      }

      const paused = !isAutoRotating;
      if (!paused) greetingTurn = false;
      else if (motion.activity < 0.06) greetingTurn = true;

      const desired = paused
        ? (greetingTurn ? (motion.cameraHeading ?? 0) : runnerFacing.rotation.y)
        : (motion.heading ?? 0) + Math.PI / 2;

      const turn = Math.atan2(Math.sin(desired - runnerFacing.rotation.y), Math.cos(desired - runnerFacing.rotation.y));

      if (paused) {
        const acceleration = THREE.MathUtils.clamp(18 * turn - 8.5 * turnVelocity, -5.5, 5.5);
        turnVelocity = THREE.MathUtils.clamp(turnVelocity + acceleration * delta, -2.2, 2.2);
        if (Math.abs(turn) < 3e-3 && Math.abs(turnVelocity) < 0.025) turnVelocity = 0;
        runnerFacing.rotation.y += turnVelocity * delta;
      } else {
        const rotationStep = turn * (1 - Math.exp(-12 * delta));
        runnerFacing.rotation.y += rotationStep;
        turnVelocity = rotationStep / Math.max(delta, 1e-4);
      }

      // Lean into turns
      runnerLean.rotation.x = THREE.MathUtils.damp(
        runnerLean.rotation.x,
        Math.min(Math.abs(motion.characterVelocity) * 0.065, 0.09),
        9,
        delta
      );

      // 5. Dual Animation Playback & Stride Synchronization
      const speed = Math.abs(motion.characterVelocity);
      const turning = paused && greetingTurn ? THREE.MathUtils.smoothstep(Math.abs(turnVelocity), 0.08, 1.2) : 0;

      if (greeting) {
        greeting.step(delta, paused && greetingTurn && Math.abs(turn) < 0.055 && Math.abs(turnVelocity) < 0.13, false);
      }

      const greetWeight = greeting ? greeting.weight : 0;
      const activity = Math.max(motion.activity, turning * 0.3) * (1 - greetWeight);

      if (runAction && idleAction) {
        runAction.setEffectiveWeight(activity);
        idleAction.setEffectiveWeight(1 - activity);

        const playback = Math.max((speed * 2.25 / GAIT_DISTANCE) * courierDuration, turning * 0.72);
        runAction.setEffectiveTimeScale(THREE.MathUtils.damp(runAction.timeScale, playback, 10, delta));

        if (greeting) greeting.restore();
        if (bagSuspension) bagSuspension.restore();

        courierMixer.update(delta);

        if (bagSuspension) {
          bagSuspension.scene.updateWorldMatrix(true, true);
          bagSuspension.update(delta, activity, motion.phase, turnVelocity, false, runnerLean.rotation.x);
        }
        if (greeting) {
          greeting.apply(false);
        }
      } else if (!courierReady) {
        // Animate placeholder runner legs & bounce
        legLeft.rotation.x = Math.sin(motion.phase) * 0.55 * Math.max(activity, 0.4);
        legRight.rotation.x = -Math.sin(motion.phase) * 0.55 * Math.max(activity, 0.4);
        torso.position.y = 0.9 + Math.abs(Math.sin(motion.phase * 2)) * 0.03;
        head.position.y = 1.25 + Math.abs(Math.sin(motion.phase * 2)) * 0.03;
        cap.position.y = 1.34 + Math.abs(Math.sin(motion.phase * 2)) * 0.03;
        courierBag.rotation.z = 0.2 + Math.sin(motion.phase) * 0.08;
      }

      renderer.render(scene, camera);
      if (shouldRun()) {
        rafId = requestAnimationFrame(animate);
      }
    }

    syncRunState();

    // Window resize
    window.addEventListener('resize', () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (!w || !h) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAboutGlobeRunner);
  } else {
    initAboutGlobeRunner();
  }
})();
