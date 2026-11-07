const fs = require('fs');
const content = fs.readFileSync('assets/js/main.js', 'utf8');

const regex = /pageDotItems|page-dot-item/g;
let m;
while ((m = regex.exec(content)) !== null) {
  console.log(content.slice(m.index - 50, m.index + 200));
}

