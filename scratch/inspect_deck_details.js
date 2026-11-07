const fs = require('fs');
const code = fs.readFileSync('scratch/extracted_about_deck.js', 'utf8');

// Find where slides are defined
const matches = code.match(/class="[^"]*about-slide[^"]*"/g) || [];
console.log('about-slide classes:', matches.length);

const ids = code.match(/id="about-[^"]+"/g) || [];
console.log('about- ids:', [...new Set(ids)]);

// Print script at the bottom of the deck
const scriptMatch = code.match(/<script>[\s\S]*?<\/script>/g);
if (scriptMatch) {
  console.log('Inline script in deck:\n', scriptMatch[0]);
}

