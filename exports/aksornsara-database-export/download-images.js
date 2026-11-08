/**
 * Optional helper script to download all article images locally
 * Run: node download-images.js
 */
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const images = require('./aksornsara-images.json');
const targetDir = path.join(__dirname, 'downloaded-images');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

console.log(`Starting download of ${images.length} images to ${targetDir}...`);

async function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadFile(res.headers.location, destPath).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      const stream = fs.createWriteStream(destPath);
      res.pipe(stream);
      stream.on('finish', () => {
        stream.close();
        resolve();
      });
      stream.on('error', reject);
    }).on('error', reject);
  });
}

async function run() {
  let success = 0;
  let failed = 0;
  for (let i = 0; i < images.length; i++) {
    const img = images[i];
    const ext = path.extname(new URL(img.url).pathname) || '.jpg';
    const filename = `${img.article_id}_${img.type}${ext}`;
    const dest = path.join(targetDir, filename);

    if (fs.existsSync(dest)) {
      success++;
      continue;
    }

    try {
      await downloadFile(img.url, dest);
      success++;
      if (success % 25 === 0 || i === images.length - 1) {
        console.log(`[${i + 1}/${images.length}] Downloaded ${filename}`);
      }
    } catch (err) {
      failed++;
      console.error(`Failed ${img.url}: ${err.message}`);
    }
  }
  console.log(`Done! Success: ${success}, Failed: ${failed}`);
}

run();
