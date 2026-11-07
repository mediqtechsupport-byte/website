const fs = require('fs');
const html = fs.readFileSync('scratch/full_about_deck.html', 'utf8');

const lines = html.split('\n');
lines.forEach((l, i) => {
  if (l.includes('about-slide') || l.includes('about-deck-track') || l.includes('<script')) {
    console.log(`${i}: ${l}`);
  }
});

