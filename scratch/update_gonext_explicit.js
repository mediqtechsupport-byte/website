const fs = require('fs');
let js = fs.readFileSync('assets/js/main.js', 'utf8');

const target = "goNextBtns.forEach((btn) => btn.addEventListener('click', () => goToSlide(currentIndex + 1)));";
const replacement = "goNextBtns.forEach((btn) => btn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); goToSlide(1); }));";

if (js.includes(target)) {
  js = js.replace(target, replacement);
  fs.writeFileSync('assets/js/main.js', js, 'utf8');
  console.log('Updated goNextBtns in main.js to explicitly call goToSlide(1)!');
} else {
  console.log('Target string not found in main.js');
}

