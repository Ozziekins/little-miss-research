// Regenerates public/og-default.png and public/apple-touch-icon.png.
// Usage: npm run build && npm run preview, then: node scripts/generate-images.mjs
import { chromium } from '@playwright/test';
import { readFileSync } from 'node:fs';

const glass = readFileSync(new URL('../public/favicon.svg', import.meta.url), 'utf8').replace(/<style>[\s\S]*?<\/style>/, '')
  .replace(/<path class="lens"/, '<path fill="#f5f0e6" stroke="#121211"').replaceAll('<path d', '<path stroke="#121211" d');
const base = process.env.BASE_URL ?? 'http://localhost:4321';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.goto(base + '/design-system/');
await page.setContent(`<!doctype html><html><head><base href="${base}/">
${await page.locator('head link[rel=stylesheet], head style').evaluateAll((els) => els.map((e) => e.outerHTML).join(''))}
<style>body{margin:0;display:grid;place-items:center;height:630px;background-color:#f5f0e6}
.og-card{width:1060px;height:490px;border:4px double #121211;outline:1px solid #121211;outline-offset:-14px;border-radius:8px;background:#fdfbf7;
display:flex;flex-direction:column;justify-content:center;align-items:center;gap:28px;text-align:center;position:relative}
  .og-name{white-space:nowrap;font-family:Gaegu;font-weight:700;font-size:104px;line-height:1;display:flex;align-items:center;gap:20px}
.og-name svg{width:120px;height:120px}.og-tag{font-family:'Fraunces Variable';font-style:italic;font-size:30px;color:#5c5c58}
  .og-lede{font-family:'Fraunces Variable';font-variation-settings:'SOFT' 100,'WONK' 1;font-style:italic;font-size:42px;max-width:24ch;line-height:1.2}</style></head>
<body><div class="og-card"><div class="og-tag">The funniest real research papers</div>
<div class="og-name">${glass}<span>Little Miss Research</span></div>
<div class="og-lede">Real science, delightfully silly questions.</div></div></body></html>`);
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: 'public/og-default.png' });

await page.setViewportSize({ width: 180, height: 180 });
await page.setContent(`<body style="margin:0;display:grid;place-items:center;width:180px;height:180px;background:#f5f0e6">
<div style="width:130px;height:130px">${glass}</div></body>`);
await page.screenshot({ path: 'public/apple-touch-icon.png' });
await browser.close();
console.log('Images written to public/');
