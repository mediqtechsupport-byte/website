const fs = require('fs');
const js = fs.readFileSync('assets/js/main.js', 'utf8');

const matches = js.match(/initAboutDeckController\s*\(\)/g) || [];
console.log('Calls to initAboutDeckController():', matches.length);

const lines = js.split('\n');
lines.forEach((l, i) => {
  if (l.includes('initAboutDeckController()')) {
    console.log(`${i}: ${l.trim()}`);
  }
});

