const fs = require('fs');

let indexHtml = fs.readFileSync('index.html', 'utf8');
const heroBackup = fs.readFileSync('components/hero-locked-backup.html', 'utf8');
const aboutBackup = fs.readFileSync('components/about-locked-backup.html', 'utf8');

const getSection = (str, id) => {
  const start = str.indexOf(`<section id="${id}"`);
  const end = str.indexOf('</section>', start) + '</section>'.length;
  return { start, end, text: str.slice(start, end) };
};

const heroCur = getSection(indexHtml, 'hero');
const heroBase = getSection(heroBackup, 'hero');
indexHtml = indexHtml.slice(0, heroCur.start) + heroBase.text + indexHtml.slice(heroCur.end);

const aboutCur = getSection(indexHtml, 'about');
const aboutBase = getSection(aboutBackup, 'about');
indexHtml = indexHtml.slice(0, aboutCur.start) + aboutBase.text + indexHtml.slice(aboutCur.end);

fs.writeFileSync('index.html', indexHtml, 'utf8');
console.log('Restored #hero and #about from locked backups.');

