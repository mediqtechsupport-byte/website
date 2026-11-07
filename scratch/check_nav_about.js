const fs = require('fs');
const js = fs.readFileSync('assets/js/main.js', 'utf8');

const navIdx = js.indexOf('About MEDIQ');
console.log('Nav about mediq context:', navIdx !== -1 ? js.slice(navIdx - 100, navIdx + 200) : 'none');

// Search for href="#about"
const html = fs.readFileSync('index.html', 'utf8');
const aboutNavMatches = html.match(/<a[^>]*href=["']#about["'][^>]*>[\s\S]*?<\/a>/gi) || [];
console.log('about nav links:', aboutNavMatches);

