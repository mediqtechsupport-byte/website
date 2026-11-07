const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const aboutIdx = html.indexOf('id="about"');
const nextSectionIdx = html.indexOf('</section>', aboutIdx);
console.log('About section full content:\n', html.slice(aboutIdx, nextSectionIdx + 10));

