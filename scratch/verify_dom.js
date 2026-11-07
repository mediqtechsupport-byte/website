const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');
const js = fs.readFileSync('assets/js/main.js', 'utf8');

const requiredIds = [
  'products',
  'iol-scroll-container',
  'iol-scene-0',
  'iol-content-0',
  'iol-scene-1',
  'iol-content-1',
  'iol-scene-2',
  'iol-content-2',
  'iol-fill-0',
  'iol-fill-1',
  'iol-fill-2',
  'iol-stage-badge',
  'iol-stage-badge-text',
  'iol-mobile-packshot',
  'iol-mobile-title',
  'iol-mobile-sub',
  'iol-mobile-desc'
];

console.log('--- Checking Required DOM IDs in index.html ---');
let missing = 0;
requiredIds.forEach(id => {
  const exists = html.includes(`id="${id}"`);
  if (!exists) {
    console.error('MISSING ID:', id);
    missing++;
  } else {
    console.log('Found:', id);
  }
});

console.log('--- Checking Global Handlers in assets/js/main.js ---');
const handlers = [
  'initIOLScrollStageController',
  'initProductsDeckController',
  'handleIolTilt',
  'resetIolTilt',
  'toggleIolAcc',
  'jumpIolStage',
  'goToProductSlide'
];

handlers.forEach(h => {
  const exists = js.includes(h);
  console.log(h, 'exists in main.js?', exists);
});

console.log('\nTotal missing IDs:', missing);

