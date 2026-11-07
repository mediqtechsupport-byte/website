const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

// Search for about-go-next in html
console.log('Matches for about-go-next in index.html:');
const matches = html.match(/<button[^>]*about-go-next[^>]*>[\s\S]*?<\/button>/gi) || [];
matches.forEach(m => console.log(m));

// Search for mission or vision sections
const sections = html.match(/<section[^>]*id=["']([^"']+)["'][^>]*>/gi) || [];
console.log('All sections:', sections);

