const fs = require('fs');
global.Image = class Image {
  constructor() {
    setTimeout(() => { if (this.onload) this.onload(); }, 10);
  }
};
const THREE = require('../assets/js/three.min.js');
global.THREE = THREE;
require('../assets/js/GLTFLoader.js');

const runnerCode = fs.readFileSync('assets/js/about-globe-runner.js', 'utf8');

const gltfData = fs.readFileSync('assets/models/courier.glb');
const arrayBuffer = gltfData.buffer.slice(gltfData.byteOffset, gltfData.byteOffset + gltfData.byteLength);

const loader = new THREE.GLTFLoader();
loader.parse(arrayBuffer, '', (gltf) => {
  console.log('GLTF loaded! Animations count:', gltf.animations.length);
  
  eval(runnerCode.slice(runnerCode.indexOf('function makeSeamlessRun'), runnerCode.indexOf('// 4. Rigid Bag Optimization')));
  
  try {
    const clips = gltf.animations.filter((a) => a.duration > 0.3);
    console.log('Filtered clips:', clips.length);
    const seamless = makeSeamlessRun(clips[0]);
    console.log('makeSeamlessRun success! duration:', seamless.duration);
    
    const idle = makeIdle(gltf.scene);
    console.log('makeIdle success! duration:', idle.duration);
  } catch (err) {
    console.error('CRASH IN ANIMATION GENERATION:', err);
  }
}, (err) => {
  console.error('Loader error:', err);
});
