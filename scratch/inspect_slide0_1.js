const fs = require('fs');
const html = fs.readFileSync('scratch/full_about_deck.html', 'utf8');

// Print slide 0 and slide 1
const s0Idx = html.indexOf('data-index="0"');
const s1Idx = html.indexOf('data-index="1"');
const s2Idx = html.indexOf('data-index="2"');

console.log('=== SLIDE 0 ===');
console.log(html.slice(s0Idx, s1Idx).slice(0, 1000));
console.log('=== SLIDE 1 ===');
console.log(html.slice(s1Idx, s2Idx));

