const fs = require('fs');
const code = fs.readFileSync('assets/js/three.min.js', 'utf8');
console.log('three.min.js size:', code.length);
console.log('Has GLTFLoader:', code.includes('GLTFLoader'));
const rev = code.match(/REVISION\s*[:=]\s*["']?([0-9]+)/);
console.log('REVISION:', rev ? rev[1] : 'unknown');

