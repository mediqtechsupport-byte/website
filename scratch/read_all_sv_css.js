const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const pos = content.indexOf('.sv-scene');
const styleEnd = content.indexOf('</style>', pos);
console.log(content.slice(pos - 100, styleEnd));

