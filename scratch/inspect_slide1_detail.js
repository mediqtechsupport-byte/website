const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const slide1Start = content.indexOf('id="product-slide-iols"');
const slide2Start = content.indexOf('data-product-index="2"', slide1Start);
const slide1 = content.slice(slide1Start, slide2Start);

console.log('--- Checking stage scenes & contents in Slide 1 ---');
['iol-scene-0', 'iol-content-0', 'iol-scene-1', 'iol-content-1', 'iol-scene-2', 'iol-content-2'].forEach(id => {
  const exists = slide1.includes(id);
  console.log(id, 'exists?', exists);
});

// Let's print out the structure around iol-scene-0 and iol-content-0
const sc0 = slide1.indexOf('id="iol-scene-0"');
console.log('--- SCENE 0 SNIPPET ---');
console.log(slide1.slice(sc0, sc0 + 800));

const ct0 = slide1.indexOf('id="iol-content-0"');
console.log('--- CONTENT 0 SNIPPET ---');
console.log(slide1.slice(ct0, ct0 + 800));

