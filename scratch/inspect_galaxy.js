const fs = require('fs');
if (fs.existsSync('assets/js/galaxy-delivery-3d.js')) {
  const content = fs.readFileSync('assets/js/galaxy-delivery-3d.js', 'utf8');
  console.log('galaxy-delivery-3d.js exists, length:', content.length);
  console.log('head:\n', content.slice(0, 500));
} else {
  console.log('galaxy-delivery-3d.js does not exist');
}

