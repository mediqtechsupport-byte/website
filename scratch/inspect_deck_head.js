const fs = require('fs');
const html = fs.readFileSync('scratch/full_about_deck.html', 'utf8');
const lines = html.split('\n');
console.log('Lines 1 to 75:\n', lines.slice(0, 75).join('\n'));

