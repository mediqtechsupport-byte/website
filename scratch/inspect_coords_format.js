const fs = require('fs');
const rings = JSON.parse(fs.readFileSync('assets/js/philippines-coords.json', 'utf8'));
console.log('Total rings:', rings.length);
console.log('First ring points:', rings[0].length, rings[0].slice(0, 3));

