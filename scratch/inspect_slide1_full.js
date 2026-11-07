const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const slide1Start = content.indexOf('id="product-slide-iols"');
const slide2Start = content.indexOf('data-product-index="2"', slide1Start);
console.log(content.slice(slide1Start, slide2Start));

