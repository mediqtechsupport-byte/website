const fs = require('fs');
const js = fs.readFileSync('assets/js/main.js', 'utf8');

const matches = [...js.matchAll(/getContext\(['"]webgl/g)];
console.log('WebGL getContext calls in main.js:', matches.length);

const ids = [...js.matchAll(/initSilkWavesShader\(['"]([^'"]+)['"]\)/g)].map(m => m[1]);
console.log('initSilkWavesShader calls for IDs:', ids);

const canvases = [...js.matchAll(/getElementById\(['"]([^'"]*canvas[^'"]*)['"]\)/gi)].map(m => m[1]);
console.log('Canvas IDs found in getElementById:', canvases);

