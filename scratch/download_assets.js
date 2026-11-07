const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

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
  const dir = path.join('assets', 'models');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const courierUrl = "https://cdn.jsdelivr.net/gh/fadeichev2121/planet@b3f70fbf4b577845b1d9d5947c9410fb4d925dae/models/courier.glb";
  console.log('Downloading courier.glb...');
  await download(courierUrl, path.join(dir, 'courier.glb'));
  console.log('courier.glb downloaded successfully, size:', fs.statSync(path.join(dir, 'courier.glb')).size);
}

main().catch(err => {
  console.error('Download failed:', err);
  process.exit(1);
});

