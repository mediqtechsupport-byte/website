const fs = require('fs');

// We have whimsical-world.glb and courier.glb
// Let's check their file sizes
console.log('courier.glb size:', fs.statSync('assets/models/courier.glb').size);
console.log('whimsical-world.glb size:', fs.statSync('assets/models/whimsical-world.glb').size);
console.log('surface.json size:', fs.statSync('assets/models/surface.json').size);

