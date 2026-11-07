const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const slideMatches = html.match(/class="[^"]*about-slide[^"]*"/g) || [];
console.log('Found slides:', slideMatches.length);

const goNextMatches = html.match(/about-go-next/g) || [];
console.log('Found goNext:', goNextMatches.length);

const deckTabs = html.match(/about-deck-tab/g) || [];
console.log('Found deckTabs:', deckTabs.length);

const prevBtn = html.match(/id="about-deck-prev"/g) || [];
console.log('Found prevBtn:', prevBtn.length);

const nextBtn = html.match(/id="about-deck-next"/g) || [];
console.log('Found nextBtn:', nextBtn.length);

