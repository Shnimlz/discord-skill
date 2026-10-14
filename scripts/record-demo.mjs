import { chromium } from 'playwright';
import path from 'node:path';
import fs from 'node:fs';

async function main() {
  const assetsDir = path.resolve('assets');
  const recordingsDir = path.resolve('assets/recordings');

  if (!fs.existsSync(recordingsDir)) {
    fs.mkdirSync(recordingsDir, { recursive: true });
  }

  console.log('[RECORD] Launching Chromium headless instance...');

  const browser = await chromium.launch({
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1200, height: 675 },
    deviceScaleFactor: 2,
    recordVideo: {
      dir: recordingsDir,
      size: { width: 1200, height: 675 },
    },
  });

  const page = await context.newPage();
  const fileUrl = 'file:///' + path.resolve('media/hyperframes-demo/index.html').replace(/\\/g, '/');
  console.log(`[RECORD] Navigating to: ${fileUrl}`);

  await page.goto(fileUrl, { waitUntil: 'networkidle' });

  console.log('[RECORD] Recording all 4 terminal animation scenes (18 seconds)...');
  await page.waitForTimeout(18000);

  console.log('[RECORD] Capturing pristine screenshot...');
  await page.screenshot({ path: path.join(assetsDir, 'demo-preview.png') });

  await context.close();
  await browser.close();

  // Find generated video file and copy to assets/demo.webm
  const files = fs.readdirSync(recordingsDir);
  const videoFile = files.find(f => f.endsWith('.webm'));

  if (videoFile) {
    const src = path.join(recordingsDir, videoFile);
    const dest = path.join(assetsDir, 'demo.webm');
    fs.copyFileSync(src, dest);
    console.log(`[RECORD] Successfully saved video demo to ${dest}`);
  }

  console.log('[RECORD] Completed successfully!');
}

main().catch((err) => {
  console.error('[RECORD] Error:', err);
  process.exit(1);
});
