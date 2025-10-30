import prerender from 'prerender';
import puppeteer from 'puppeteer';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Ensure Puppeteer cache exists
const cacheDir = '/opt/render/.cache/puppeteer';
if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir, { recursive: true });
}

let chromePath;

try {
  // Try to install chrome manually in Render environment (in case postinstall skipped)
  console.log('Installing Chrome if not present...');
  execSync('npx puppeteer browsers install chrome', { stdio: 'inherit' });

  // Look for Chrome binary inside cache
  const basePath = path.join(cacheDir, 'chrome');
  const versionDirs = fs.readdirSync(basePath);
  const firstDir = versionDirs[0];
  chromePath = path.join(basePath, firstDir, 'chrome-linux64', 'chrome');

  console.log('✅ Chrome path detected:', chromePath);
} catch (err) {
  console.error('❌ Error while detecting Chrome, fallback to Puppeteer default:', err);
  chromePath = puppeteer.executablePath();
}

// Set environment variable for Puppeteer
process.env.PUPPETEER_EXECUTABLE_PATH = chromePath;
process.env.CHROME_PATH = chromePath;

const server = prerender({
  port: process.env.PORT || 10000,
  chromeLocation: chromePath,
  chromeFlags: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-gpu',
    '--no-zygote',
    '--headless=new',
  ],
});

server.use(prerender.removeScriptTags());
server.use(prerender.blacklist());
server.start();

console.log('🚀 Prerender server running on port', process.env.PORT || 10000);
