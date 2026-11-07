const fs = require('fs');
const code = fs.readFileSync('assets/js/three.min.js', 'utf8');
const idx = code.indexOf('t.REVISION=e');
console.log('Context:', code.slice(idx - 100, idx + 20));

