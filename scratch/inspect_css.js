const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const styleStart = content.indexOf('/* === ZANDRELLEZ SERVICES 3D SCENE & TYPOGRAPHY SYSTEM === */');
if (styleStart !== -1) {
  const styleEnd = content.indexOf('</style>', styleStart);
  console.log('CSS length:', styleEnd - styleStart);
  console.log(content.slice(styleStart, styleStart + 2000));
} else {
  console.log('CSS style block not found by exact string');
}

