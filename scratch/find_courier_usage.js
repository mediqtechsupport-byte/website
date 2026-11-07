const fs = require('fs');
const code = fs.readFileSync('components/ui/orbit-delivery-hero.tsx', 'utf8');
const lines = code.split('\n');

lines.forEach((l, i) => {
  if (l.includes('<Courier') || l.includes('Courier') && l.includes('position')) {
    console.log(`${i}: ${l}`);
  }
});

