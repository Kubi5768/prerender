import prerender from 'prerender';
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

// Dynamically detect Chrome path in Render’s Puppeteer cache
const basePath = '/opt/render/.cache/puppeteer/chrome';
let chromePath = null;

try {
  const versionFolder = fs.readdirSync(basePath)[0]; // e.g. 'linux-127.0.6533.88'
  chromePath = path.join(basePath, versionFolder, 'chrome-linux64', 'chrome');
  process.env.CHROME_PATH = chromePath;
  process.env.PUPPETEER_EXECUTABLE_PATH = chromePath;
  console.log('✅ Using Chrome path:', chromePath);
} catch (err) {
  console.error('❌ Failed to locate Chrome path, falling back to Puppeteer default:', err);
  chromePath = puppeteer.executablePath();
}

const server = prerender({
  port: process.env.PORT || 10000,
  chromeLocation: chromePath,
  chromeFlags: [
    '--no-sandbox',
    '--headless',
    '--disable-gpu',
    '--disable-dev-shm-usage',
    '--disable-setuid-sandbox',
    '--disable-software-rasterizer',
    '--no-zygote',
  ],
});

server.use(prerender.removeScriptTags());
server.use(prerender.blacklist());
server.start();
