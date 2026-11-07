const fs = require('fs');
const code = fs.readFileSync('components/ui/orbit-delivery-hero.tsx', 'utf8');
const lines = code.split('\n');

for (let i = 695; i <= 720; i++) {
  console.log(`${i}: ${lines[i]}`);
}

