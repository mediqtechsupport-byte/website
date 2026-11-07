const fs = require('fs');
const hero = fs.readFileSync('components/hero-locked-backup.html', 'utf8');

console.log('Hero background elements:');
const lines = hero.split('\n');
lines.forEach((l, i) => {
  if (l.includes('background') || l.includes('bg-') || l.includes('canvas') || l.includes('img') || l.includes('blur')) {
    console.log(`${i}: ${l.trim()}`);
  }
});

