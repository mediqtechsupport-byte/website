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
  // Let's fetch Philippines geojson
  // There is a repository with geojson for countries: https://raw.githubusercontent.com/janmp/philippines-geojson/master/philippines.json
  // or https://raw.githubusercontent.com/datasets/geo-boundaries-world-110m/master/countries/PHL.geojson
  const urls = [
    "https://raw.githubusercontent.com/datasets/geo-boundaries-world-110m/master/countries/PHL.geojson",
    "https://raw.githubusercontent.com/faeldon/philippines-json-maps/master/geojson/country/hires/country.json"
  ];
  for (const u of urls) {
    try {
      console.log('Trying:', u);
      const jsonStr = await fetchJson(u);
      fs.writeFileSync('scratch/philippines.geojson', jsonStr);
      console.log('Saved philippines.geojson, length:', jsonStr.length);
      return;
    } catch (e) {
      console.log('Failed:', e.message);
    }
  }
}

main();

