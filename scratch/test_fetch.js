const https = require('https');
const fs = require('fs');

const url = "https://cdn.jsdelivr.net/gh/fadeichev2121/planet@b3f70fbf4b577845b1d9d5947c9410fb4d925dae/models/courier.glb";
console.log('Testing fetch of courier.glb...');

https.get(url, (res) => {
  console.log('Status:', res.statusCode);
  console.log('Headers:', res.headers['content-length'], res.headers['content-type']);
  if (res.statusCode === 200 || res.statusCode === 302) {
    console.log('Successfully reached CDN!');
  }
}).on('error', (err) => {
  console.error('Fetch error:', err.message);
});

