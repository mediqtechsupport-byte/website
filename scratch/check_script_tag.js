const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const scriptIdx = content.indexOf('src="assets/js/main.js');
console.log('Script tag:', content.slice(scriptIdx, scriptIdx + 50));

