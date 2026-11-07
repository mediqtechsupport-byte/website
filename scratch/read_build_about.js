const fs = require('fs');
const code = fs.readFileSync('scratch/build_about_html.js', 'utf8');
console.log('build_about_html.js head:\n', code.slice(0, 1000));
console.log('--- length:', code.length);

