const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const fontMatches = content.match(/fonts\.googleapis\.com[^\"]+/g);
console.log('Google Fonts in index.html:', fontMatches);

