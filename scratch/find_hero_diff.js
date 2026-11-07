const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const backup = fs.readFileSync('components/hero-locked-backup.html', 'utf8').trim();

const heroIdx = html.indexOf('id="hero"');
const heroStart = html.lastIndexOf('<section', heroIdx);
const heroEnd = html.indexOf('</section>', heroIdx) + '</section>'.length;
const currentHero = html.slice(heroStart, heroEnd).trim();

// Find where they diverge
let i = 0;
while (i < currentHero.length && i < backup.length && currentHero[i] === backup[i]) {
  i++;
}
console.log('Diverges at char:', i);
console.log('currentHero around divergence:\n', currentHero.slice(Math.max(0, i - 50), i + 100));
console.log('---');
console.log('backup around divergence:\n', backup.slice(Math.max(0, i - 50), i + 100));

