const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');
const js = fs.readFileSync('assets/js/main.js', 'utf8');

console.log('index.html has products-smoke-canvas:', html.includes('id="products-smoke-canvas"'));
console.log('index.html has products-waves-shader-canvas:', html.includes('id="products-waves-shader-canvas"'));
console.log('main.js has initProductsSmokeCanvas:', js.includes('function initProductsSmokeCanvas()'));
console.log('main.js calls initProductsSmokeCanvas:', js.includes('initProductsSmokeCanvas();'));
console.log('main.js calls initSilkWavesShader for products:', js.includes("initSilkWavesShader('products-waves-shader-canvas')"));

