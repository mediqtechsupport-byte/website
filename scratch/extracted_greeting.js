CourierGreeting = class {
      constructor(scene) {
        this.scene = scene;
        scene.updateWorldMatrix(true, true);
        const inverseScene = scene.getWorldQuaternion(new Quaternion5()).invert();
        this.joints = ["RightArm", "RightForeArm", "RightHand"].map((name) => {
          const bone = scene.getObjectByName(name);
          if (!(bone instanceof Bone2)) throw new Error(`Greeting joint ${name} is missing.`);
          const rest = bone.getWorldQuaternion(new Quaternion5()).premultiply(inverseScene);
          const direction = up.clone().applyQuaternion(rest).normalize();
          const palm = new Vector34(1, 0, 0).addScaledVector(direction, -direction.x).normalize();
          return { bone, rest, direction, palm, animated: bone.quaternion.clone() };
        });
        this.restBendNormal.crossVectors(this.joints[0].direction, this.joints[1].direction).normalize();
      }
      joints;
      sceneRotation = new Quaternion5();
      inverseParent = new Quaternion5();
      aim = new Quaternion5();
      twist = new Quaternion5();
      target = new Quaternion5();
      direction = new Vector34();
      palm = new Vector34();
      wantedPalm = new Vector34();
      cross = new Vector34();
      restBendNormal = new Vector34();
      bendNormal = new Vector34();
      upperDirection = new Vector34(-0.55, -0.65, 0.52).normalize();
      forearmDirection = new Vector34();
      phase = 0;
      applied = false;
      weight = 0;
      restore() {
        if (!this.applied) return;
        for (const joint of this.joints) joint.bone.quaternion.copy(joint.animated);
        this.applied = false;
      }
      step(dt, ready, reduced) {
        this.weight = MathUtils4.damp(this.weight, ready ? 1 : 0, ready ? 4 : 9, dt);
        if (this.weight < 1e-4) {
          this.weight = 0;
          this.phase = 0;
        }
        if (ready && this.weight > 0.85 && !reduced) this.phase += dt * Math.PI * 2 * 0.9;
      }
      apply(reduced) {
        if (this.weight === 0) return;
        this.scene.getWorldQuaternion(this.sceneRotation);
        const wave = Math.sin(this.phase) * (reduced ? 0 : 0.12) * MathUtils4.smoothstep(this.weight, 0.85, 0.99);
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
  }
});

// src/sceneOptimization.ts
import { Matrix4 as Matrix42, Mesh as Mesh2, SkinnedMesh as SkinnedMesh2 } from "three";
function optimizeRigidBag(scene) {
  scene.updateWorldMatrix(true, true);
  const candidates = [];
  scene.traverse((node) => {
    if (node instanceof SkinnedMesh2 && node.name.startsWith("Delivery_Bag")) candidates.push(node);
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
    const bind = new Matrix42().multiplyMatrices(mesh.skeleton.boneInverses[joint], mesh.bindMatrix);
    const geometry = mesh.geometry.clone().applyMatrix4(bind);
    geometry.deleteAttribute("skinIndex");
    geometry.deleteAttribute("skinWeight");
    geometry.computeBoundingBox();
    geometry.computeBoundingSphere();
    const bag = new Mesh2(geometry, mesh.material);
    bag.name = mesh.name;
    bag.castShadow = mesh.castShadow;
    bag.receiveShadow = mesh.receiveShadow;
    bag.renderOrder = mesh.renderOrder;
    bag.matrixAutoUpdate = false;
    mesh.removeFromParent();
    bone.add(bag);
    let shared = false;
    scene.traverse((node) => {
      if (node instanceof Mesh2 && node.geometry === mesh.geometry) shared = true;
    });
    if (!shared) mesh.geometry.dispose();
  }
}
var init_sceneOptimization = __esm({
  "src/sceneOptimization.ts"() {
    "use strict";
  }
});

