const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const matches = [];
let idx = 0;
while ((idx = html.indexOf('hero-photon-lines-transparent.png', idx)) !== -1) {
  matches.push(idx);
  idx += 30;
}
console.log('Matches for hero-photon-lines-transparent.png in index.html:', matches.length);
matches.forEach((pos, i) => {
  console.log(`[${i}] at char ${pos}:`);
  console.log(html.slice(Math.max(0, pos - 150), pos + 250));
});

