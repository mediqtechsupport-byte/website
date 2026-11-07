// Test loading whimsical-world.glb and courier.glb with Three.js in Node
const fs = require('fs');

console.log('Testing GLB files existence:');
console.log('courier.glb exists:', fs.existsSync('assets/models/courier.glb'), 'size:', fs.statSync('assets/models/courier.glb').size);
console.log('whimsical-world.glb exists:', fs.existsSync('assets/models/whimsical-world.glb'), 'size:', fs.statSync('assets/models/whimsical-world.glb').size);

