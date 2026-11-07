const fs = require('fs');
if (fs.existsSync('scratch/test_about_deck_seamless.js')) {
  const code = fs.readFileSync('scratch/test_about_deck_seamless.js', 'utf8');
  console.log('test_about_deck_seamless.js length:', code.length);
  console.log('head:\n', code.slice(0, 1500));
} else {
  console.log('file not found');
}

