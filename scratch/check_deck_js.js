const fs = require('fs');
const js = fs.readFileSync('assets/js/main.js', 'utf8');

console.log('main.js includes about-deck:', js.includes('about-deck'));
console.log('main.js includes about-slide:', js.includes('about-slide'));
console.log('main.js includes about-go-next:', js.includes('about-go-next'));

const lines = js.split('\n');
lines.forEach((l, i) => {
  if (l.includes('about-deck') || l.includes('about-slide') || l.includes('about-go-next')) {
    console.log(`${i}: ${l.trim()}`);
  }
});

