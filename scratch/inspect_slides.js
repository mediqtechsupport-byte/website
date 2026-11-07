const fs = require('fs');
const html = fs.readFileSync('scratch/full_about_deck.html', 'utf8');

// Find all slides
const slideRegex = /<!-- Slide \d+: ([^>]+) -->([\s\S]*?)(?=<!-- Slide \d+:|<!-- Deck Navigation Bar|$)/g;
let m;
while ((m = slideRegex.exec(html)) !== null) {
  console.log('Slide:', m[1], 'Length:', m[2].length);
}

// Find script
const scriptIdx = html.indexOf('<script>');
if (scriptIdx !== -1) {
  console.log('Script in deck:\n', html.slice(scriptIdx, scriptIdx + 1200));
}

