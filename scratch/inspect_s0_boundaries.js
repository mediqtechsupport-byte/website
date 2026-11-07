const fs = require('fs');
const deckRaw = fs.readFileSync('scratch/full_about_deck.html', 'utf8');

// Let's see the start and end of Slide 0
const s0Start = deckRaw.indexOf('<div class="about-slide');
const s1Start = deckRaw.indexOf('<!-- ========================================================================= -->\n        <!-- SLIDE 2: WHO WE ARE');

console.log('Slide 0 length:', s1Start - s0Start);

