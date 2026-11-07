const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const aboutIdx = html.indexOf('id="about"');
console.log('aboutIdx:', aboutIdx);
if (aboutIdx !== -1) {
  const slice = html.slice(aboutIdx - 200, aboutIdx + 2000);
  console.log('About section preview:\n', slice);
}

