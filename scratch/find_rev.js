const fs = require('fs');
const code = fs.readFileSync('assets/js/three.min.js', 'utf8');
const idx = code.indexOf('REVISION');
if (idx !== -1) {
  console.log('REVISION snippet:', code.slice(idx - 20, idx + 40));
}

