const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

html = html.replace(/main\.js\?v=[0-9\.]+/g, 'main.js?v=331.00');
fs.writeFileSync('index.html', html, 'utf8');
console.log('Bumped main.js to v=331.00 in index.html');

