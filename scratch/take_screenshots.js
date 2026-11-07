const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Create a copy of index.html with Slide 1 active initially for testing
let html = fs.readFileSync('index.html', 'utf8');

// Make a version for Slide 0
fs.writeFileSync('scratch/preview_slide0.html', html, 'utf8');

// Make a version for Slide 1 by triggering goToProductSlide(1) on load
let htmlSlide1 = html.replace("goToSlide(0);", "goToSlide(1);");
fs.writeFileSync('scratch/preview_slide1.html', htmlSlide1, 'utf8');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const s0Path = path.resolve('scratch/preview_slide0.html');
const s1Path = path.resolve('scratch/preview_slide1.html');

try {
  execSync(`"${edgePath}" --headless --disable-gpu --window-size=1600,1000 --screenshot="scratch/slide0_render.png" "file:///${s0Path.replace(/\\/g, '/')}"`);
  console.log('Slide 0 screenshot captured!');
} catch (e) {
  console.log('Slide 0 screenshot error:', e.message);
}

try {
  execSync(`"${edgePath}" --headless --disable-gpu --window-size=1600,1000 --screenshot="scratch/slide1_render.png" "file:///${s1Path.replace(/\\/g, '/')}"`);
  console.log('Slide 1 screenshot captured!');
} catch (e) {
  console.log('Slide 1 screenshot error:', e.message);
}

