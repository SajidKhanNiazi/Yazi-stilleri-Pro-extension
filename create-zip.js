const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const dir = __dirname;
const tmpDir = path.join(dir, '_zip_tmp');
const outZip = path.join(dir, 'YaziStilleriPro.zip');

// Clean up previous
if (fs.existsSync(tmpDir)) fs.rmSync(tmpDir, { recursive: true });
if (fs.existsSync(outZip)) fs.unlinkSync(outZip);

// Create temp structure with only extension files
fs.mkdirSync(tmpDir);
fs.mkdirSync(path.join(tmpDir, 'icons'));

['manifest.json', 'popup.html', 'popup.js', 'style.css'].forEach(f =>
  fs.copyFileSync(path.join(dir, f), path.join(tmpDir, f))
);
['icon-16.png', 'icon-48.png', 'icon-128.png'].forEach(f =>
  fs.copyFileSync(path.join(dir, 'icons', f), path.join(tmpDir, 'icons', f))
);

// Create zip
execSync(
  `powershell -NoProfile -Command "Compress-Archive -Path '${tmpDir}${path.sep}*' -DestinationPath '${outZip}' -Force"`,
  { timeout: 60000 }
);

// Cleanup temp
fs.rmSync(tmpDir, { recursive: true });

console.log('Done! ZIP created at:', outZip);
console.log('Size:', (fs.statSync(outZip).size / 1024).toFixed(1), 'KB');
