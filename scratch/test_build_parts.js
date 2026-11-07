const fs = require('fs');

const runCycleCode = fs.readFileSync('scratch/extracted_runCycle.js', 'utf8')
  .replace(/Quaternion3/g, 'THREE.Quaternion')
  .replace(/AnimationClip/g, 'THREE.AnimationClip')
  .replace(/NumberKeyframeTrack/g, 'THREE.NumberKeyframeTrack')
  .replace(/QuaternionKeyframeTrack/g, 'THREE.QuaternionKeyframeTrack')
  .replace(/VectorKeyframeTrack/g, 'THREE.VectorKeyframeTrack');

const idleCode = fs.readFileSync('scratch/extracted_idle.js', 'utf8')
  .replace(/Mesh3/g, 'THREE.Mesh')
  .replace(/Bone3/g, 'THREE.Bone')
  .replace(/Quaternion/g, 'THREE.Quaternion')
  .replace(/Euler/g, 'THREE.Euler')
  .replace(/AnimationClip2/g, 'THREE.AnimationClip')
  .replace(/NumberKeyframeTrack/g, 'THREE.NumberKeyframeTrack')
  .replace(/QuaternionKeyframeTrack/g, 'THREE.QuaternionKeyframeTrack')
  .replace(/VectorKeyframeTrack/g, 'THREE.VectorKeyframeTrack');

const greetingCode = fs.readFileSync('scratch/extracted_greeting.js', 'utf8')
  .replace(/Quaternion5/g, 'THREE.Quaternion')
  .replace(/Vector34/g, 'THREE.Vector3')
  .replace(/Bone2/g, 'THREE.Bone')
  .replace(/MathUtils4/g, 'THREE.MathUtils');

console.log('RunCycle ok, Idle ok, Greeting ok');

