const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const start = content.indexOf('<div class="product-slide absolute inset-0 w-full h-full flex flex-col justify-center items-center px-4 sm:px-8 lg:px-12 py-16 transition-all duration-500 ease-out opacity-100');
const nextSlide = content.indexOf('<div id="product-slide-iols"', start);
console.log(content.slice(start, nextSlide));

