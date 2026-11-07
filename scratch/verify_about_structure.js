const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const aboutIdx = html.indexOf('id="about"');
const aboutEnd = html.indexOf('</section>', aboutIdx);
const aboutSlice = html.slice(aboutIdx, aboutEnd);

console.log('Slides in index.html:');
const slideMatches = aboutSlice.match(/data-index=["'](\d+)["']/g) || [];
console.log('Found slides:', slideMatches);

const buttonMatches = aboutSlice.match(/<button[^>]*about-go-next[^>]*>[\s\S]*?<\/button>/g) || [];
console.log('Found about-go-next buttons:', buttonMatches.length);

const canvasMatches = aboutSlice.match(/id=["']about-globe-container["']/g) || [];
console.log('Found about-globe-container:', canvasMatches.length);

