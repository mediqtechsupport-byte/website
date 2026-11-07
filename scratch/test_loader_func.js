const fs = require('fs');

console.log('Testing model loading logic...');
// We can write a smart loader helper:
const loadModel = `
function loadGlbWithFallback(localPath, cdnPath, loader) {
  return new Promise((resolve, reject) => {
    loader.load(localPath, resolve, undefined, (err1) => {
      console.warn('Local load failed, trying CDN:', cdnPath);
      loader.load(cdnPath, resolve, undefined, (err2) => {
        reject(err2);
      });
    });
  });
}
`;
console.log('Loader logic ready');

