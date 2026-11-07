const https = require('https');
const fs = require('fs');

function download(url) {
  return new Promise((resolve, reject) => {
    let data = '';
    const get = (targetUrl) => {
      https.get(targetUrl, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return get(res.headers.location);
        }
        if (res.statusCode !== 200) return reject(new Error(`Status ${res.statusCode}`));
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(data));
      }).on('error', reject);
    };
    get(url);
  });
}

async function main() {
  const bguCode = await download("https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/utils/BufferGeometryUtils.js");
  fs.writeFileSync('scratch/BufferGeometryUtils.js', bguCode, 'utf8');
  console.log('BufferGeometryUtils.js downloaded, size:', bguCode.length);
}

main().catch(err => {
  console.error('Download failed:', err);
  process.exit(1);
});

