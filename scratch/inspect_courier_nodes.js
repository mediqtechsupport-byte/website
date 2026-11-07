const fs = require('fs');

// We have Three.js and GLTFLoader.js! Let's test loading the GLB with Three.js in node if possible,
// or inspect the JSON chunk we extracted earlier!
const buffer = fs.readFileSync('assets/models/courier.glb');
const chunkLength = buffer.readUInt32LE(12);
const json = JSON.parse(buffer.toString('utf8', 20, 20 + chunkLength));

console.log('Nodes count:', json.nodes ? json.nodes.length : 0);
json.nodes.forEach((n, i) => {
  if (n.name && (n.name.includes('Root') || n.name.includes('courier') || n.name.includes('Bag') || n.name.includes('Hips') || n.name.includes('Head'))) {
    console.log(`Node ${i}: ${n.name}, translation: ${n.translation}, scale: ${n.scale}`);
  }
});

// Check bounding box of accessors for positions
if (json.accessors) {
  json.accessors.forEach((acc, i) => {
    if (acc.min && acc.max && acc.type === 'VEC3') {
      console.log(`Accessor ${i} (${acc.type}): min=[${acc.min.map(v => v.toFixed(2))}], max=[${acc.max.map(v => v.toFixed(2))}]`);
    }
  });
}

