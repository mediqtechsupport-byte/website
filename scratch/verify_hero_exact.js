const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
let backup = fs.readFileSync('components/hero-locked-backup.html', 'utf8').trim();
backup = backup.replace(/^<!-- LOCKED HERO BACKUP - DO NOT MODIFY -->\s*/, '').trim();

const heroIdx = html.indexOf('id="hero"');
const heroStart = html.lastIndexOf('<section', heroIdx);
const heroEnd = html.indexOf('</section>', heroIdx) + '</section>'.length;
const currentHero = html.slice(heroStart, heroEnd).trim();

console.log('Hero section exactly matches locked backup section:', currentHero === backup);

