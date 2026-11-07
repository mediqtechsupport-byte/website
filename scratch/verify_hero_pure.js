const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8').replace(/\r\n/g, '\n');
const backup = fs.readFileSync('components/hero-locked-backup.html', 'utf8').replace(/\r\n/g, '\n');

const getHeroSection = (str) => {
  const start = str.indexOf('<section id="hero"');
  const end = str.indexOf('</section>', start) + '</section>'.length;
  return str.slice(start, end).trim();
};

const h1 = getHeroSection(html);
const h2 = getHeroSection(backup);

console.log('Sections match 100%:', h1 === h2);
if (h1 !== h2) {
  console.log('Lengths:', h1.length, h2.length);
}
