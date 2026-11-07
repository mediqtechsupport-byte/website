const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

const s2Start = content.indexOf('data-product-index="2"');
const s3Start = content.indexOf('data-product-index="3"');
console.log(content.slice(s2Start, s3Start));

