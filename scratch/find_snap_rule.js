const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const pos = html.indexOf('scroll-snap-type: y mandatory');
console.log(html.slice(pos - 150, pos + 300));

