const fs = require('fs');
const code = fs.readFileSync('components/ui/orbit-delivery-hero.tsx', 'utf8');
const lines = code.split('\n');

function printRange(start, end) {
  console.log(`=== Range ${start} - ${end} ===`);
  for (let i = start; i <= end && i < lines.length; i++) {
    console.log(`${i}: ${lines[i]}`);
  }
}

printRange(215, 250);
printRange(600, 650);

