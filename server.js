import prerender from 'prerender';
import puppeteer from 'puppeteer';

const server = prerender({
  port: process.env.PORT || 10000,
  chromeLocation: puppeteer.executablePath(),
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
