const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const start = content.indexOf('<section id="products"');
const end = content.indexOf('</section>', start);
const prodSection = content.slice(start, end);

// Find all elements with class containing product-slide or id starting with product-slide
const regex = /<div[^>]*class="[^"]*product-slide[^"]*"[^>]*>/g;
let match;
while ((match = regex.exec(prodSection)) !== null) {
  console.log('Match:', match[0]);
}

