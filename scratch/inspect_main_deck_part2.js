const fs = require('fs');
const js = fs.readFileSync('assets/js/main.js', 'utf8');
const lines = js.split('\n');

for (let i = 6170; i <= 6205; i++) {
  console.log(`${i}: ${lines[i]}`);
}

