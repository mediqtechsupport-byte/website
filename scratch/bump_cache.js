const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

html = html.replace(
  '<script src="assets/js/GLTFLoader.js"></script>',
  '<script src="assets/js/GLTFLoader.js" defer></script>'
);
html = html.replace('main.js?v=329.00', 'main.js?v=330.00');

fs.writeFileSync('index.html', html, 'utf8');
console.log('Bumped cache and added defer');

