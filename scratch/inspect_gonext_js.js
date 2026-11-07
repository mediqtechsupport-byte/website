const fs = require('fs');
const js = fs.readFileSync('assets/js/main.js', 'utf8');

const sIdx = js.indexOf('goNextBtns.forEach');
console.log('goNextBtns code context:\n', js.slice(sIdx - 100, sIdx + 200));

