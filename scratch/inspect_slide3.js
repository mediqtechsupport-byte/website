const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

const s3Start = content.indexOf('data-product-index="3"');
const s4Start = content.indexOf('data-product-index="4"');
console.log(content.slice(s3Start, s4Start));

