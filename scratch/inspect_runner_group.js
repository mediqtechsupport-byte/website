const fs = require('fs');
const code = fs.readFileSync('components/ui/orbit-delivery-hero.tsx', 'utf8');
const lines = code.split('\n');

for (let i = 890; i <= 935; i++) {
  console.log(`${i}: ${lines[i]}`);
}

