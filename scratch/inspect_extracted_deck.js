const fs = require('fs');
const content = fs.readFileSync('scratch/extracted_about_deck.js', 'utf8');

// Print structure
console.log('File structure:');
const lines = content.split('\n');
lines.forEach((l, i) => {
  if (l.includes('id=') || l.includes('class="about-page') || l.includes('data-page') || l.includes('function') || l.includes('addEventListener') || l.includes('about-go-next') || l.includes('Our Mission') || l.includes('Who We Are')) {
    console.log(`${i}: ${l.trim()}`);
  }
});

