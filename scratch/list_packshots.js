const fs = require('fs');
const files = fs.readdirSync('assets/img/packshots');
files.forEach((f, i) => console.log(`${i+1}. ${f}`));

