const fs = require('fs');
const buffer = fs.readFileSync('assets/models/courier.glb');
console.log('Size:', buffer.length);
// GLB header is 12 bytes: magic (0x46546C67 "glTF"), version (uint32), length (uint32)
const magic = buffer.toString('utf8', 0, 4);
const version = buffer.readUInt32LE(4);
const length = buffer.readUInt32LE(8);
console.log('GLB magic:', magic, 'version:', version, 'length:', length);

// Chunk 0 is JSON: chunkLength (uint32), chunkType (0x4E4F534A "JSON")
const chunkLength = buffer.readUInt32LE(12);
const chunkType = buffer.toString('utf8', 16, 20);
console.log('Chunk 0 type:', chunkType, 'length:', chunkLength);
const jsonText = buffer.toString('utf8', 20, 20 + chunkLength);
const json = JSON.parse(jsonText);
console.log('extensionsUsed:', json.extensionsUsed);
console.log('extensionsRequired:', json.extensionsRequired);
console.log('animations count:', json.animations ? json.animations.length : 0);
if (json.animations) {
  json.animations.forEach((a, i) => console.log(`Animation ${i}: ${a.name}`));
}
console.log('meshes count:', json.meshes ? json.meshes.length : 0);

