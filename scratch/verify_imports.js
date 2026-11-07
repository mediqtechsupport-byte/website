const fs = require('fs');
const content = fs.readFileSync('scratch/GLTFLoader.js', 'utf8');

const importRegex = /import\s*\{([\s\S]*?)\}\s*from\s*['"]three['"]\s*;?/;
const match = content.match(importRegex);
if (match) {
  const symbols = match[1].split(',').map(s => s.trim()).filter(Boolean);
  console.log('Imported from three:', symbols.length, 'symbols');
  
  // Check if there are any other imports
  const otherImports = content.replace(importRegex, '').match(/import\s+[^;]+;/g) || [];
  console.log('Other imports:', otherImports);
}

