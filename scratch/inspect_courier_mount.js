const fs = require('fs');
const code = fs.readFileSync('components/ui/orbit-delivery-hero.tsx', 'utf8');
const lines = code.split('\n');

for (let i = 645; i <= 685; i++) {
  console.log(`${i}: ${lines[i]}`);
}

