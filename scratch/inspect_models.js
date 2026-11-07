const fs = require('fs');
const code = fs.readFileSync('components/ui/orbit-delivery-hero.tsx', 'utf8');

const lines = code.split('\n');
lines.forEach((line, i) => {
  if (line.includes('courier.glb') || line.includes('whimsical-world') || line.includes('function Planet') || line.includes('function Courier')) {
    console.log(`Line ${i}: ${line.trim()}`);
  }
});

