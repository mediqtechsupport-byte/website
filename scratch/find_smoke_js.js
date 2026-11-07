const fs = require('fs');
const js = fs.readFileSync('assets/js/main.js', 'utf8');

const pos = js.indexOf('hero-smoke-canvas');
console.log('Found hero-smoke-canvas at:', pos);
if (pos !== -1) {
  console.log(js.slice(pos - 100, pos + 1500));
}

