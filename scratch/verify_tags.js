const fs = require('fs');
const html = fs.readFileSync('scratch/assembled_about.html', 'utf8');

// Check opening and closing section tags
const openSec = (html.match(/<section/g) || []).length;
const closeSec = (html.match(/<\/section>/g) || []).length;
console.log('Sections: open =', openSec, 'close =', closeSec);

// Check div tags
const openDiv = (html.match(/<div/g) || []).length;
const closeDiv = (html.match(/<\/div>/g) || []).length;
console.log('Divs: open =', openDiv, 'close =', closeDiv);

