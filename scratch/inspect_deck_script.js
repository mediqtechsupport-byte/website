const fs = require('fs');
const html = fs.readFileSync('scratch/full_about_deck.html', 'utf8');

console.log('Last 100 lines of full_about_deck.html:');
const lines = html.split('\n');
console.log(lines.slice(lines.length - 80).join('\n'));

