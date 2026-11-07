const fs = require('fs');
const content = fs.readFileSync('scratch/extracted_about_deck.js', 'utf8');

// The file has: const seamlessAboutDeckHtml = `...`;
const startIdx = content.indexOf('`');
const endIdx = content.lastIndexOf('`');
const deckHtml = content.slice(startIdx + 1, endIdx);

fs.writeFileSync('scratch/full_about_deck.html', deckHtml);
console.log('Saved scratch/full_about_deck.html, length:', deckHtml.length);

