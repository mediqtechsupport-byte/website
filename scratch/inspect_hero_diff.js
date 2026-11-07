const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const backup = fs.readFileSync('components/hero-locked-backup.html', 'utf8');

const heroStart = html.indexOf('<section id="hero"');
const heroEnd = html.indexOf('</section>', heroStart) + '</section>'.length;
const currentHero = html.substring(heroStart, heroEnd).trim();

const backupClean = backup.replace(/<!--[\s\S]*?-->\s*/, '').trim();

const hLines = currentHero.split('\n').map(s => s.trim());
const bLines = backupClean.split('\n').map(s => s.trim());

for (let i = 0; i < Math.max(hLines.length, bLines.length); i++) {
  if (hLines[i] !== bLines[i]) {
    console.log(`Diff at line ${i+1}:`);
    console.log('  Hero:  ', hLines[i]);
    console.log('  Backup:', bLines[i]);
    break;
  }
}

