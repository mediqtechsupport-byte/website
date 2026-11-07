const fs = require('fs');
console.log('node_modules/three exists:', fs.existsSync('node_modules/three'));
if (fs.existsSync('node_modules/three/package.json')) {
  console.log(fs.readFileSync('node_modules/three/package.json', 'utf8').slice(0, 300));
}

