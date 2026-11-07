const { execSync } = require('child_process');
try {
  const out = execSync('npx esbuild --version', { encoding: 'utf8' });
  console.log('esbuild version:', out.trim());
} catch (e) {
  console.log('esbuild not found');
}

