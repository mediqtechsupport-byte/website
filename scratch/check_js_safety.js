const fs = require('fs');
const js = fs.readFileSync('assets/js/main.js', 'utf8');

console.log('badgeText usage:');
js.split('\n').forEach((l, i) => {
  if (l.includes('badgeText') || l.includes('iol-stage-badge')) {
    console.log(`${i+1}: ${l}`);
  }
});

console.log('\ncounter usage:');
js.split('\n').forEach((l, i) => {
  if (l.includes('products-deck-counter') || l.includes('counter')) {
    console.log(`${i+1}: ${l}`);
  }
});

