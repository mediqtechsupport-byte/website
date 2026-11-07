const fs = require('fs');
const content = fs.readFileSync('assets/js/main.js', 'utf8');

const marker = '/* INTRAOCULAR LENSES 3D SCROLL-DRIVEN STAGE CHOREOGRAPHY (ZANDRELLEZ)';
const idx = content.indexOf(marker);
console.log('Marker pos:', idx);
const divider = content.lastIndexOf('/* ===', idx);
console.log('Divider pos:', divider);

