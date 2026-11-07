const fs = require('fs');
const code = fs.readFileSync('components/ui/orbit-delivery-hero.tsx', 'utf8');

const match = code.match(/surface\s*=\s*"(data:application\/json;base64,[^"]+)"/);
if (match) {
  const base64 = match[1].replace('data:application/json;base64,', '');
  const jsonStr = Buffer.from(base64, 'base64').toString('utf8');
  const surfaceObj = JSON.parse(jsonStr);
  console.log('Surface object decoded:');
  console.log('width:', surfaceObj.width, 'height:', surfaceObj.height);
  console.log('radii count:', surfaceObj.radii ? surfaceObj.radii.length : 0);
  fs.writeFileSync('scratch/surface.json', jsonStr);
} else {
  console.log('Surface match not found');
}

