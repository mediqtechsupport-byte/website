const fs = require('fs');
const content = fs.readFileSync('assets/js/main.js', 'utf8');

const pos = content.indexOf('Unlock page scrolling when user clicks any navbar anchor');
console.log(content.slice(pos, pos + 600));

