const fs = require('fs');
let indexHtml = fs.readFileSync('index.html', 'utf8');
const assembledAbout = fs.readFileSync('scratch/assembled_about.html', 'utf8').trim();

const aboutIdx = indexHtml.indexOf('id="about"');
const aboutStart = indexHtml.lastIndexOf('<section', aboutIdx);
const aboutEnd = indexHtml.indexOf('</section>', aboutIdx) + '</section>'.length;

console.log('About section to replace from index:', aboutStart, 'to', aboutEnd);

const newIndexHtml = indexHtml.slice(0, aboutStart) + assembledAbout + indexHtml.slice(aboutEnd);

fs.writeFileSync('index.html', newIndexHtml, 'utf8');
console.log('index.html updated successfully with complete 5-page About Deck!');

