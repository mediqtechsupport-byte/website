const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const scripts = html.match(/<script[^>]*>[\s\S]*?<\/script>|<script[^>]*>/gi) || [];
console.log('Script tags in index.html:');
scripts.forEach((s, idx) => {
  if (s.length > 200) {
    console.log(`[${idx}] ${s.slice(0, 100)}... (${s.length} chars)`);
  } else {
    console.log(`[${idx}] ${s}`);
  }
});

