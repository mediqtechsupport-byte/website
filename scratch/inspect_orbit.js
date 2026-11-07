const fs = require('fs');
const code = fs.readFileSync('components/ui/orbit-delivery-hero.tsx', 'utf8');

// Search for urls, glb, textures, components
const matches = code.match(/https?:\/\/[^\s"'`)]+/g) || [];
console.log('URLs found in code:', [...new Set(matches)]);

const glbMatches = code.match(/[a-zA-Z0-9_\-\.\/]+\.glb/g) || [];
console.log('GLB files mentioned:', [...new Set(glbMatches)]);

// Find exports and main component name
const exportMatches = code.match(/export\s+(?:default\s+)?(?:function|const|var|let|class)\s+([a-zA-Z0-9_]+)/g) || [];
console.log('Exports:', exportMatches);

