const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const prodStart = html.indexOf('<section id="products"');
const deckNavPos = html.indexOf('id="products-deck-nav"', prodStart);
console.log('--- products-deck-nav ---');
console.log(html.slice(deckNavPos, deckNavPos + 700));

const slide1NavPos = html.indexOf('id="product-slide-iols"');
console.log('--- Slide 1 top nav ---');
console.log(html.slice(slide1NavPos, slide1NavPos + 1400));

