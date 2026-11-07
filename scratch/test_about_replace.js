const fs = require('fs');

const indexHtml = fs.readFileSync('index.html', 'utf8');

// Verify Hero is untouched
if (!indexHtml.includes('id="hero"')) {
  console.error('ERROR: hero not found in index.html!');
  process.exit(1);
}

// Find `#about`
const aboutStartTag = '<section id="about"';
const aboutEndTag = '</section>';
const startIdx = indexHtml.indexOf(aboutStartTag);
if (startIdx === -1) {
  console.error('ERROR: <section id="about" not found!');
  process.exit(1);
}

const endIdx = indexHtml.indexOf(aboutEndTag, startIdx);
if (endIdx === -1) {
  console.error('ERROR: </section> for #about not found!');
  process.exit(1);
}

const currentAboutBlock = indexHtml.substring(startIdx, endIdx + aboutEndTag.length);
console.log('Current about block:\n', currentAboutBlock);

// Read new section HTML from scratch/build_about_html.js
const { aboutSectionHtml } = require('./build_about_html.js');
console.log('Got new about section HTML');

