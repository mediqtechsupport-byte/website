const fs = require('fs');
let code = fs.readFileSync('assets/js/main.js', 'utf8');

const target1 = `const canvas = document.getElementById('about-smoke-canvas');\r\n    if (!canvas) return;`;
const repl1 = `const canvas = document.getElementById('about-smoke-canvas');\r\n    if (!canvas || canvas._smokeActive) return;\r\n    canvas._smokeActive = true;`;

if (code.includes(target1)) {
  code = code.replace(target1, repl1);
  console.log('Target 1 replaced');
} else {
  console.log('Target 1 not found');
}

const target2 = `initAboutSmokeCanvas();\r\n\r\n  // ─── 4C`;
const repl2 = `if (document.readyState === 'loading') {\r\n    document.addEventListener('DOMContentLoaded', initAboutSmokeCanvas);\r\n  } else {\r\n    initAboutSmokeCanvas();\r\n  }\r\n\r\n  // ─── 4C`;

if (code.includes(target2)) {
  code = code.replace(target2, repl2);
  console.log('Target 2 replaced');
} else {
  console.log('Target 2 not found');
}

fs.writeFileSync('assets/js/main.js', code, 'utf8');
console.log('Done');

