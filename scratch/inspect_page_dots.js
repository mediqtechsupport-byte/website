const fs = require('fs');
const content = fs.readFileSync('assets/js/main.js', 'utf8');

const pos = content.indexOf('.page-dot-item');
console.log(content.slice(pos - 100, pos + 800));

