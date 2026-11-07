const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const endBodyIdx = html.indexOf('</body>');
console.log('End body area:\n', html.slice(endBodyIdx - 800, endBodyIdx + 10));

