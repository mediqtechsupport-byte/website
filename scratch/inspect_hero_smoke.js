const fs = require('fs');
const hero = fs.readFileSync('components/hero-locked-backup.html', 'utf8');

console.log('--- Inspecting Hero canvas / smoke / visual layers ---');
const lines = hero.split('\n');
lines.forEach((l, i) => {
  if (l.includes('canvas') || l.includes('smoke') || l.includes('fog') || l.includes('ink') || l.includes('orbit') || l.includes('webgl') || l.includes('cloud')) {
    console.log(`${i+1}: ${l}`);
  }
});

