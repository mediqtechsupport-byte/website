const fs = require('fs');
const js = fs.readFileSync('assets/js/main.js', 'utf8');

const pos = js.indexOf('function initHeroSmokeCanvas()');
console.log(js.slice(pos, pos + 1600));

