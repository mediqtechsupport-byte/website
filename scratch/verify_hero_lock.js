const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const backup = fs.readFileSync('components/hero-locked-backup.html', 'utf8').trim();

const heroIdx = html.indexOf('id="hero"');
const heroStart = html.lastIndexOf('<section', heroIdx);
const heroEnd = html.indexOf('</section>', heroIdx) + '</section>'.length;
const currentHero = html.slice(heroStart, heroEnd).trim();

console.log('Hero matched locked backup:', currentHero === backup);
if (currentHero !== backup) {
  console.log('Diff found! Lengths:', currentHero.length, backup.length);
}

