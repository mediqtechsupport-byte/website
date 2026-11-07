const fs = require('fs');
const content = fs.readFileSync('scratch/GLTFLoader.js', 'utf8');
const lines = content.split('\n');
console.log('First 20 lines:');
console.log(lines.slice(0, 25).join('\n'));
console.log('Last 10 lines:');
console.log(lines.slice(lines.length - 10).join('\n'));

