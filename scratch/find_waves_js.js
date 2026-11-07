const fs = require('fs');
const js = fs.readFileSync('assets/js/main.js', 'utf8');

const pos = js.indexOf('hero-waves-shader-canvas');
console.log('Found waves shader at:', pos);
if (pos !== -1) {
  console.log(js.slice(pos - 100, pos + 1200));
}

