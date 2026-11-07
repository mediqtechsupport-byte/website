const fs = require('fs');

const indexHtml = fs.readFileSync('index.html', 'utf8').replace(/\r\n/g, '\n');

// 1. Verify Hero Lock
const heroBackup = fs.readFileSync('components/hero-locked-backup.html', 'utf8').replace(/\r\n/g, '\n');
const getHero = (str) => {
  const start = str.indexOf('<section id="hero"');
  const end = str.indexOf('</section>', start) + '</section>'.length;
  return str.slice(start, end).trim();
};
const heroCurrent = getHero(indexHtml);
const heroBaseline = getHero(heroBackup);
const heroMatches = (heroCurrent === heroBaseline);

// 2. Verify About Lock
const aboutBackup = fs.readFileSync('components/about-locked-backup.html', 'utf8').replace(/\r\n/g, '\n');
const getAbout = (str) => {
  const start = str.indexOf('<section id="about"');
  const end = str.indexOf('</section>', start) + '</section>'.length;
  return str.slice(start, end).trim();
};
const aboutCurrent = getAbout(indexHtml);
const aboutBaseline = getAbout(aboutBackup);
const aboutMatches = (aboutCurrent === aboutBaseline);

console.log('--- LOCKED SECTIONS INTEGRITY REPORT ---');
console.log(`[LOCKED] Hero section match:  ${heroMatches ? '100% PASS' : 'FAIL (Diff detected!)'}`);
console.log(`[LOCKED] About section match: ${aboutMatches ? '100% PASS' : 'FAIL (Diff detected!)'}`);

if (!heroMatches || !aboutMatches) {
  process.exit(1);
} else {
  console.log('All locked sections are 100% pure and protected.');
  process.exit(0);
}
