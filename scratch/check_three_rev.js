const fs = require('fs');
const code = fs.readFileSync('assets/js/three.min.js', 'utf8');
const match = code.match(/THREE\.REVISION\s*=\s*['"]([0-9]+)['"]/);
console.log('Revision match:', match ? match[1] : 'none');
if (!match) {
  const anyRev = code.match(/REVISION:"([0-9]+)"/);
  console.log('anyRev:', anyRev ? anyRev[1] : 'none');
}

