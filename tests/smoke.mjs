import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const baseURL = 'http://127.0.0.1:8769/';
const browser = await chromium.launch({ channel: 'chrome' });

try {
  for (const width of [320, 390, 1440]) {
    const reducedMotion = width === 390;
    const page = await browser.newPage({
      viewport: { width, height: 860 },
      reducedMotion: reducedMotion ? 'reduce' : 'no-preference',
    });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => {
      if (message.type() === 'error') errors.push(message.text());
    });
    page.on('response', response => {
      if (response.url().startsWith(baseURL) && !response.ok()) {
        errors.push(`${response.status()} ${response.url()}`);
      }
    });

    const response = await page.goto(baseURL);
    assert.ok(response.ok());
    assert.ok(await page.locator('meta[http-equiv="Content-Security-Policy"]').count());
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    assert.ok(await page.evaluate(() => [...document.images].every(image => image.complete && image.naturalWidth)));

    await page.getByRole('button', { name: 'English', exact: true }).press('Enter');
    assert.equal(await page.locator('html').getAttribute('lang'), 'en');
    await page.locator('summary').filter({ hasText: 'MensaKrabbler' }).press('Enter');
    const project = page.getByRole('link', { name: 'Open MensaKrabbler' });
    assert.ok(await project.isVisible());
    assert.equal(await project.getAttribute('href'), 'https://mensakrabbler.tomebert.de/');

    const theme = page.locator('.theme-toggle');
    const previousTheme = await theme.getAttribute('aria-pressed');
    await theme.press('Space');
    assert.notEqual(await theme.getAttribute('aria-pressed'), previousTheme);
    const monitor = page.locator('.terminal-power');
    await monitor.press('Space');
    assert.equal(await monitor.getAttribute('aria-pressed'), 'false');
    await monitor.press('Space');
    assert.equal(await monitor.getAttribute('aria-pressed'), 'true');

    const portrait = page.locator('.portrait-trigger');
    await portrait.press('Enter');
    assert.equal(await page.locator('.portrait-burst i').count(), reducedMotion ? 0 : 72);
    const motion = page.locator('.motion-toggle');
    await motion.press('Space');
    assert.equal(await motion.getAttribute('aria-pressed'), 'true');
    await portrait.press('Enter');
    assert.equal(await page.locator('.portrait-burst i').count(), 0);
    assert.deepEqual(errors, []);
    await page.close();
  }

  const noScript = await browser.newPage({ javaScriptEnabled: false });
  await noScript.goto(baseURL);
  assert.ok(await noScript.getByRole('link', { name: 'LinkedIn', exact: true }).isVisible());
  assert.ok(!(await noScript.locator('.email-link').isVisible()));
} finally {
  await browser.close();
}
