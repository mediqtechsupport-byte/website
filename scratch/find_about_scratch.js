const fs = require('fs');

// Check git log or diff or scratch files
const scratchFiles = fs.readdirSync('scratch');
console.log('Scratch files with about:', scratchFiles.filter(f => f.includes('about')));

scratchFiles.filter(f => f.includes('about')).forEach(f => {
  const c = fs.readFileSync('scratch/' + f, 'utf8');
  if (c.includes('Our Vision') || c.includes('Our Mission') || c.includes('Who We Are')) {
    console.log('Found mission/vision in scratch/' + f);
  }
});

