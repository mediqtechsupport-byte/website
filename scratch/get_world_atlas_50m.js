const https = require('https');
const fs = require('fs');

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchJson(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) return reject(new Error('Status ' + res.statusCode));
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function main() {
  const url = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json";
  console.log('Fetching world atlas 50m...');
  const data = await fetchJson(url);
  fs.writeFileSync('scratch/countries-50m.json', data);
  console.log('Saved countries-50m.json, size:', data.length);
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});

