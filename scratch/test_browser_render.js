const http = require('http');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/') reqPath = '/index.html';
  const filePath = path.join(process.cwd(), reqPath.replace(/^\//, ''));
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
      '.html': 'text/html',
      '.js': 'text/javascript',
      '.css': 'text/css',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.svg': 'image/svg+xml'
    };
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

server.listen(8091, () => {
  console.log('Server running on 8091');
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const outPath = path.resolve('scratch/render_test_1.png');
  const cmd = `"${chromePath}" --headless=new --window-size=1920,1080 --virtual-time-budget=2000 --screenshot="${outPath}" http://localhost:8091/index.html`;
  try {
    execSync(cmd, { timeout: 15000 });
    console.log('Screenshot taken successfully at:', outPath);
  } catch (err) {
    console.error('Error running chrome:', err.message);
  } finally {
    server.close();
  }
});

