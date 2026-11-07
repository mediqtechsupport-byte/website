const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

for (let i = 0; i < 3; i++) {
  const scIdx = content.indexOf(`id="iol-scene-${i}"`);
  const scEnd = content.indexOf('>', scIdx);
  console.log(`iol-scene-${i}:`, content.slice(scIdx, scEnd + 1));
  
  const ctIdx = content.indexOf(`id="iol-content-${i}"`);
  const ctEnd = content.indexOf('>', ctIdx);
  console.log(`iol-content-${i}:`, content.slice(ctIdx, ctEnd + 1));
}

