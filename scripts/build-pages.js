'use strict';

const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'dist-cf');
const MAX_CF_FILE_BYTES = 24 * 1024 * 1024; // Safety margin below Cloudflare Pages' 25 MiB cap

const ROOT_HTML_FILES = [
  'index.html',
  'vision-hero.html',
  'mediq-inquiry-email-template.html',
  'mediq-inquiry-email-preview.html',
];

const SKIP_DIRS = new Set([
  'email', // Server-side Google Apps Script mailer & templates are not needed in public web root
]);

function copyDirClean(srcDir, dstDir, stats) {
  fs.mkdirSync(dstDir, { recursive: true });
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const dstPath = path.join(dstDir, entry.name);
    if (entry.isDirectory()) {
      if (srcDir === path.join(ROOT, 'assets') && SKIP_DIRS.has(entry.name)) {
        continue;
      }
      copyDirClean(srcPath, dstPath, stats);
      continue;
    }
    if (!entry.isFile()) continue;
    const size = fs.statSync(srcPath).size;
    if (size >= MAX_CF_FILE_BYTES) {
      stats.skippedLarge.push({ file: path.relative(ROOT, srcPath), mb: +(size / 1048576).toFixed(2) });
      continue;
    }
    fs.copyFileSync(srcPath, dstPath);
    stats.count += 1;
    stats.bytes += size;
    if (size > stats.maxBytes) {
      stats.maxBytes = size;
      stats.maxFile = path.relative(ROOT, srcPath);
    }
  }
}

fs.rmSync(OUT_DIR, { recursive: true, force: true });
fs.mkdirSync(OUT_DIR, { recursive: true });

const stats = { count: 0, bytes: 0, maxBytes: 0, maxFile: '', skippedLarge: [] };

for (const name of ROOT_HTML_FILES) {
  const src = path.join(ROOT, name);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(OUT_DIR, name));
    stats.count += 1;
    stats.bytes += fs.statSync(src).size;
  }
}

copyDirClean(path.join(ROOT, 'assets'), path.join(OUT_DIR, 'assets'), stats);

console.log(`Cloudflare Pages build ready in dist-cf/: ${stats.count} files, ${(stats.bytes / 1048576).toFixed(2)} MB`);
console.log(`Largest output file: ${stats.maxFile} (${(stats.maxBytes / 1048576).toFixed(2)} MB)`);
if (stats.skippedLarge.length) {
  console.log('Skipped >=24MB files:', JSON.stringify(stats.skippedLarge));
}
