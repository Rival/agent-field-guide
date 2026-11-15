const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

const sections = [
  'everyday', 'agents', 'independence', 'extensions', 'workflow',
  'herdr', 'hermes', 'learning', 'hosting', 'company', 'start', 'sources',
];

test('Russian article has metadata and all requested topics', async ({ page }) => {
  const response = await page.goto('./');
  expect(response.status()).toBe(200);
  await expect(page.locator('html')).toHaveAttribute('lang', 'ru');
  await expect(page).toHaveTitle(/От чата к своему AI-помощнику/);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /агент/);
  await expect(page.locator('h1')).toHaveCount(1);
  for (const id of sections) {
    await expect(page.locator(`section#${id} h2`)).toHaveCount(1);
  }
  for (const term of ['Claude Code', 'Codex', 'Pi', 'DeepSeek Harness', 'Superpowers',
    'Карпаты', 'Herdr', 'Hermes', 'OpenClaw', 'Telegram', 'MAX', 'VPS', 'ТСПУ']) {
    await expect(page.locator('main')).toContainText(term);
  }
  await expect(page.locator('#everyday')).toContainText('диск');
  await expect(page.locator('#everyday')).toContainText('роутер');
  await expect(page.locator('#everyday')).toContainText('фотограф');
  await expect(page.locator('#independence')).toContainText('API');
  await expect(page.locator('#extensions')).toContainText('устройств');
});

test('every fragment has a target, IDs are unique and assets load', async ({ page }) => {
  const failures = [];
  page.on('response', response => {
    if (response.url().startsWith(new URL(page.url()).origin) && response.status() >= 400) {
      failures.push(`${response.status()} ${response.url()}`);
    }
  });
  await page.goto('./');
  await page.evaluate(() => document.fonts.ready);
  const structure = await page.evaluate(() => {
    const ids = [...document.querySelectorAll('[id]')].map(el => el.id);
    const fragments = [...document.querySelectorAll('a[href^="#"]')]
      .map(el => el.getAttribute('href').slice(1));
    return {
      duplicateIds: ids.filter((id, i) => ids.indexOf(id) !== i),
      missingTargets: fragments.filter(id => !document.getElementById(id)),
      emptyLinks: document.querySelectorAll('a[href=""], a[href="#"]').length,
      fontLoaded: document.fonts.check('400 16px "Golos Text"'),
    };
  });
  expect(structure.duplicateIds).toEqual([]);
  expect(structure.missingTargets).toEqual([]);
  expect(structure.emptyLinks).toBe(0);
  expect(structure.fontLoaded).toBe(true);
  expect(failures).toEqual([]);
});

test('essential source links and privacy boundaries are present', async ({ page }) => {
  await page.goto('./');
  for (const url of [
    'https://pi.dev/',
    'https://herdr.dev/',
    'https://github.com/deepseek-ai/deepseek-harness',
    'https://github.com/NousResearch/hermes-agent',
    'https://github.com/obra/superpowers',
  ]) {
    expect(await page.locator(`a[href="${url}"]`).count()).toBeGreaterThan(0);
  }
  const html = await page.content();
  expect(html).not.toMatch(/\/home\/|\/Users\/|100\.\d+\.\d+\.\d+|192\.168\.|gh[pousr]_[A-Za-z0-9]{20,}|sk-ant-/);
  await expect(page.locator('main')).toContainText('не означает');
  await expect(page.locator('#hosting')).toContainText('облачн');
  await expect(page.locator('#company')).toContainText('доступ');
});

for (const width of [360, 390, 768, 1440]) {
  test(`readable without horizontal overflow at ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('./');
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator('h1')).toBeVisible();
    const overflow = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      content: document.documentElement.scrollWidth,
      main: document.querySelector('main').getBoundingClientRect().width,
    }));
    expect(overflow.content).toBeLessThanOrEqual(overflow.viewport);
    expect(overflow.main).toBeGreaterThan(width < 768 ? width * 0.8 : 380);
    if (width === 390 || width === 1440) {
      await page.screenshot({ path: testInfo.outputPath(`guide-${width}.png`), fullPage: true });
    }
  });
}

test('mobile contents and reading details work with the keyboard', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./');
  const menu = page.locator('details.mobile-contents');
  await expect(menu).not.toHaveAttribute('open', '');
  await menu.locator('summary').focus();
  await page.keyboard.press('Enter');
  await expect(menu).toHaveAttribute('open', '');
  await menu.getByRole('link', { name: 'Зависимость и подписки' }).click();
  await expect(page).toHaveURL(/#independence$/);
  const detail = page.locator('#independence details');
  await detail.locator('summary').focus();
  await page.keyboard.press('Enter');
  await expect(detail).toHaveAttribute('open', '');
});

test('no serious accessibility violations on desktop or mobile', async ({ page }) => {
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('./');
    await page.evaluate(() => {
      document.querySelectorAll('main details').forEach(detail => { detail.open = true; });
    });
    const result = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(result.violations.filter(v => ['critical', 'serious'].includes(v.impact)))
      .toEqual([]);
  }
});

test('page makes no third-party runtime requests or JavaScript errors', async ({ page, baseURL }) => {
  const external = [];
  const errors = [];
  const origin = new URL(baseURL).origin;
  page.on('request', request => {
    if (!request.url().startsWith(`${origin}/`)) external.push(request.url());
  });
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('./');
  await page.evaluate(() => document.fonts.ready);
  await page.waitForLoadState('networkidle');
  expect(external).toEqual([]);
  expect(errors).toEqual([]);
});
