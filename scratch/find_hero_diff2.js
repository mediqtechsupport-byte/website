const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
let backup = fs.readFileSync('components/hero-locked-backup.html', 'utf8').trim();
backup = backup.replace(/^<!-- LOCKED HERO BACKUP - DO NOT MODIFY -->\s*/, '').trim();

const heroIdx = html.indexOf('id="hero"');
const heroStart = html.lastIndexOf('<section', heroIdx);
const heroEnd = html.indexOf('</section>', heroIdx) + '</section>'.length;
const currentHero = html.slice(heroStart, heroEnd).trim();

let i = 0;
while (i < currentHero.length && i < backup.length && currentHero[i] === backup[i]) {
  i++;
}
console.log('Diverges at char:', i);
console.log('currentHero around divergence:\n', JSON.stringify(currentHero.slice(Math.max(0, i - 20), i + 40)));
console.log('backup around divergence:\n', JSON.stringify(backup.slice(Math.max(0, i - 20), i + 40)));

