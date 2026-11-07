const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

for (let i = 2; i <= 4; i++) {
  const marker = `data-product-index="${i}"`;
  const start = content.indexOf(marker);
  const end = content.indexOf(`data-product-index="${i+1}"`, start);
  const chunk = end !== -1 ? content.slice(start, end) : content.slice(start, start + 2000);
  console.log(`\n=================== SLIDE ${i} (${chunk.length} chars) ===================`);
  console.log(chunk.slice(0, 1000));
}

