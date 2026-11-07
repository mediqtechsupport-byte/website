const fs = require('fs');
const code = fs.readFileSync('assets/js/galaxy-delivery-3d.js', 'utf8');
console.log('galaxy-delivery-3d.js has GLTF:', code.includes('GLTF'));
console.log('galaxy-delivery-3d.js has GLTFLoader:', code.includes('GLTFLoader'));

