const fs = require('fs');
const buffer = fs.readFileSync('assets/models/courier.glb');
const chunkLength = buffer.readUInt32LE(12);
const json = JSON.parse(buffer.toString('utf8', 20, 20 + chunkLength));

// Let's inspect the animations
console.log('Animations:', json.animations.map(a => a.name));
json.animations.forEach(a => {
  console.log(`Animation ${a.name} has ${a.channels.length} channels, duration: ${a.samplers ? a.samplers.length : 'none'}`);
});

