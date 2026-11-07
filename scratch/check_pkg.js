const fs = require('fs');
if (fs.existsSync('package.json')) {
  console.log('package.json:', fs.readFileSync('package.json', 'utf8'));
} else {
  console.log('no package.json in root');
}

