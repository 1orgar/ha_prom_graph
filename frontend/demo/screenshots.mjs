// Render demo/index.html in a headless browser and save one PNG per card to images/.
// Usage: node demo/screenshots.mjs   (needs `playwright-core` and a Chrome/Chromium)
import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const { chromium } = await import(process.env.PLAYWRIGHT_CORE || 'playwright-core');
const { DEMO_CARDS } = await import('./cards.js');

const types = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.css': 'text/css' };
const server = createServer(async (req, res) => {
  try {
    const path = normalize(join(root, decodeURIComponent(new URL(req.url, 'http://x').pathname)));
    if (!path.startsWith(root)) throw new Error('forbidden');
    const body = await readFile(path);
    res.writeHead(200, { 'content-type': types[extname(path)] || 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404).end();
  }
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const port = server.address().port;

const browser = await chromium.launch({
  channel: process.env.CHROME_CHANNEL || 'chrome',
  executablePath: process.env.CHROME_PATH || undefined
});
const page = await browser.newPage({ viewport: { width: 1000, height: 900 }, deviceScaleFactor: 2, locale: 'en-US' });
page.on('pageerror', (e) => console.error('page error:', e.message));
await mkdir(join(root, 'images'), { recursive: true });

for (const demo of DEMO_CARDS) {
  await page.goto(`http://127.0.0.1:${port}/demo/index.html?card=${demo.id}`);
  await page.waitForFunction(() => window.__demoReady === true);
  await page.waitForTimeout(700); // data fetch + chart layout
  const el = await page.$(`#${demo.id}`);
  await el.screenshot({ path: join(root, 'images', `${demo.id}.png`) });
  console.log('saved', `images/${demo.id}.png`);
}

// Card picker ("Add card" dialog) with stub configs - verifies auto-detected demo mode
await page.setViewportSize({ width: 1020, height: 900 });
await page.goto(`http://127.0.0.1:${port}/demo/picker.html`);
await page.waitForFunction(() => window.__demoReady === true);
await page.waitForTimeout(900);
await page.screenshot({ path: join(root, 'images', 'card-picker.png'), fullPage: true });
console.log('saved images/card-picker.png');

// Editors (structure check, not committed): EDITORS=1 node demo/screenshots.mjs
if (process.env.EDITORS) {
  await page.setViewportSize({ width: 1000, height: 900 });
  await page.goto(`http://127.0.0.1:${port}/demo/editor.html?lang=${process.env.EDITORS_LANG || 'en'}`);
  await page.waitForFunction(() => window.__demoReady === true);
  await page.screenshot({ path: '/tmp/editors.png', fullPage: true });
  console.log('saved /tmp/editors.png');
}

await browser.close();
server.close();
