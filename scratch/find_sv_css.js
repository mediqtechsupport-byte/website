const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const pos = content.indexOf('.sv-scene');
console.log('pos of .sv-scene:', pos);
if (pos !== -1) {
  console.log(content.slice(Math.max(0, pos - 200), pos + 800));
}

