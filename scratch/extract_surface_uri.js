const fs = require('fs');

const code = fs.readFileSync('components/ui/orbit-delivery-hero.tsx', 'utf8');

// Extract surface base64
const surfaceMatch = code.match(/surface\s*=\s*"(data:application\/json;base64,[^"]+)"/);
const surfaceDataUri = surfaceMatch ? surfaceMatch[1] : '';

console.log('surfaceDataUri length:', surfaceDataUri.length);

