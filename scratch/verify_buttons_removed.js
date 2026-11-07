const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

console.log('Contains iol-stage-badge?', html.includes('iol-stage-badge'));
console.log('Contains Medical Supplies > button in slide 1?', html.includes('onclick="if(window.goToProductSlide){window.goToProductSlide(2);}" class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky/20'));
console.log('Contains products-deck-counter?', html.includes('products-deck-counter'));
console.log('Contains Product Overview back button in slide 1?', html.includes('Product Overview'));

