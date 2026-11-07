const fs = require('fs');
const code = fs.readFileSync('assets/js/three.min.js', 'utf8');
const match = code.match(/const\s+e\s*=\s*['"]([0-9]+)['"]|var\s+e\s*=\s*['"]([0-9]+)['"]|e\s*=\s*['"]([0-9]+)['"]/);
console.log('e match:', match ? (match[1] || match[2] || match[3]) : 'not found');

