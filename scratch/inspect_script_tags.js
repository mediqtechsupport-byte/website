const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const sIdx = html.indexOf('assets/js/about-globe-runner.js');
console.log('Script tags context:\n', html.slice(sIdx - 150, sIdx + 300));

