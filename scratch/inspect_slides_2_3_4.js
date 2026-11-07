const fs = require('fs');
const html = fs.readFileSync('scratch/full_about_deck.html', 'utf8');

const s2Idx = html.indexOf('data-index="2"');
const s3Idx = html.indexOf('data-index="3"');
const s4Idx = html.indexOf('data-index="4"');
const ctrlIdx = html.indexOf('id="about-deck-prev"');

console.log('=== SLIDE 2 (What We Do) ===');
console.log(html.slice(s2Idx, s3Idx).slice(0, 400));

console.log('=== SLIDE 3 (Foundation) ===');
console.log(html.slice(s3Idx, s4Idx).slice(0, 400));

console.log('=== SLIDE 4 (Values) ===');
console.log(html.slice(s4Idx, ctrlIdx).slice(0, 400));

