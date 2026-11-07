const fs = require('fs');
const buffer = fs.readFileSync('assets/models/whimsical-world.glb');
const chunkLength = buffer.readUInt32LE(12);
const json = JSON.parse(buffer.toString('utf8', 20, 20 + chunkLength));

console.log('whimsical-world.glb extensionsUsed:', json.extensionsUsed);
console.log('whimsical-world.glb extensionsRequired:', json.extensionsRequired);
console.log('nodes:', json.nodes ? json.nodes.length : 0);
console.log('meshes:', json.meshes ? json.meshes.length : 0);

