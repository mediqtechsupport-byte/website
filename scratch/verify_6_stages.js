const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');

console.log('--- Verifying 6 Stages in index.html ---');
for (let i = 0; i < 6; i++) {
  const sceneId = `id="iol-scene-${i}"`;
  const contentId = `id="iol-content-${i}"`;
  const fillId = `id="iol-fill-${i}"`;
  console.log(`Stage ${i}: scene=${html.includes(sceneId)}, content=${html.includes(contentId)}, fill=${html.includes(fillId)}`);
}

console.log('\n--- Verifying Ophteis & AEON Packshots in Slide 2 ---');
const imgs = [
  'ophteis_adaptive.png',
  'ophteis_cohesive.png',
  'ophteis_dispersive.png',
  'aeon_protect.png',
  'aeon_protect_plus.png',
  'aeon_repair.png',
  'aeon_nacl.png'
];

imgs.forEach(img => {
  const inHtml = html.includes(img);
  const onDisk = fs.existsSync(`assets/img/packshots/${img}`);
  console.log(`${img}: inHtml=${inHtml}, onDisk=${onDisk}`);
});

