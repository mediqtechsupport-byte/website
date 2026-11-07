const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

const heroStart = content.indexOf('<section id="hero"');
const heroEnd = content.indexOf('</section>', heroStart) + 10;

const aboutStart = content.indexOf('<section id="about"');
const aboutEnd = content.indexOf('</section>', aboutStart) + 10;

const prodStart = content.indexOf('<section id="products"');
const prodEnd = content.indexOf('</section>', prodStart) + 10;

console.log('Hero:', heroStart, 'to', heroEnd, 'length:', heroEnd - heroStart);
console.log('About:', aboutStart, 'to', aboutEnd, 'length:', aboutEnd - aboutStart);
console.log('Products:', prodStart, 'to', prodEnd, 'length:', prodEnd - prodStart);
console.log('Products starts after About?', prodStart > aboutEnd);

