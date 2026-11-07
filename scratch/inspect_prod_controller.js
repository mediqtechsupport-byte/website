const fs = require('fs');
const content = fs.readFileSync('assets/js/main.js', 'utf8');

const pos = content.indexOf('function initProductsDeckController()');
console.log(content.slice(pos, pos + 1200));

