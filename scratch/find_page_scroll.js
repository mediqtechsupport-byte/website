const fs = require('fs');
const content = fs.readFileSync('assets/js/main.js', 'utf8');

const lines = content.split('\n');
console.log('--- Searching for wheel / scroll snap / section navigation in main.js ---');
lines.forEach((l, i) => {
  if (l.includes('page-snap') || l.includes('wheel') || l.includes('scrollIntoView') || l.includes('page-transition-section')) {
    console.log(`${i+1}: ${l.slice(0, 120)}`);
  }
});

