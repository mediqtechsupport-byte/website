const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const start = content.indexOf('<section id="products"');
const end = content.indexOf('</section>', start);
console.log('Products section length:', end - start);
console.log(content.slice(start, start + 1200));

// Also let's inspect the slides in #products
let pos = start;
while (true) {
  const slideIdx = content.indexOf('id="product-slide-', pos);
  if (slideIdx === -1 || slideIdx > end) break;
  const tagEnd = content.indexOf('>', slideIdx);
  console.log('Found slide:', content.slice(slideIdx, tagEnd));
  pos = tagEnd;
}

