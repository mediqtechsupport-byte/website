const https = require('https');
const fs = require('fs');

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const get = (targetUrl) => {
      https.get(targetUrl, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return get(res.headers.location);
        }
        if (res.statusCode !== 200) {
          return reject(new Error(`Status ${res.statusCode} for ${targetUrl}`));
        }
        res.pipe(file);
        file.on('finish', () => {
          file.close(() => resolve(dest));
        });
      }).on('error', (err) => {
        fs.unlink(dest, () => {});
        reject(err);
      });
    };
    get(url);
  });
}

async function main() {
  // Let's test downloading GLTFLoader
  // In r128-r160, cdnjs has: https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js or unpkg
  const url = "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/GLTFLoader.js";
  console.log('Downloading GLTFLoader.js (module)...');
  await download(url, 'scratch/GLTFLoader.js');
  console.log('Downloaded GLTFLoader.js, size:', fs.statSync('scratch/GLTFLoader.js').size);
}

main().catch(err => {
  console.error('Download failed:', err);
  process.exit(1);
});

