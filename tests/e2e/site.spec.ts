import { test, expect } from '@playwright/test';

test.describe('core pages', () => {
  test('home asks one catchy question and can ask another', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Little Miss Research/);
    await expect(page.getByRole('banner').getByRole('link', { name: /Little Miss Research, home/ })).toBeVisible();
    const question = page.locator('[data-q]');
    const first = await question.textContent();
    expect(first).toMatch(/\?|…/);
    await page.getByRole('button', { name: /Ask me another/ }).click();
    await expect(question).not.toHaveText(first!);
    await expect(page.locator('[data-q-find]')).toHaveAttribute('href', /^\/papers\//);
  });

  test('Ig Nobel page lists only prize winners', async ({ page }) => {
    await page.goto('/ig-nobel/');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Ig Nobel winners/);
    const entries = page.locator('.entry');
    expect(await entries.count()).toBeGreaterThan(10);
    expect(await page.locator('.entry .entry__ig').count()).toBe(await entries.count());
  });

  test('paper page has SEO essentials', async ({ page }) => {
    await page.goto('/papers/on-the-rheology-of-cats/');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(/rheology of cats/i);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/papers\/on-the-rheology-of-cats\/$/);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /.{50,}/);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /^https?:\/\//);
    const ld = await page.locator('script[type="application/ld+json"]').allTextContents();
    expect(ld.some((s) => JSON.parse(s)['@type'] === 'Article')).toBe(true);
    expect(await page.locator('h1').count()).toBe(1);
    await expect(page.locator('mark.hl').first()).toBeVisible();
    await expect(page.locator('dfn.vocab')).toHaveCount(1);
  });

  test('topic page lists only that topic', async ({ page }) => {
    await page.goto('/topics/pop-culture/');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Pop Culture');
    await expect(page.locator('.entry').first()).toBeVisible();
    await expect(page.getByText(/Harry Potter casts a spell/)).toBeVisible();
  });

  test('404 page', async ({ page }) => {
    const res = await page.goto('/this-does-not-exist/');
    expect(res?.status()).toBe(404);
    await expect(page.getByRole('heading', { name: 'Null result.' })).toBeVisible();
  });

  test('robots and sitemap are served', async ({ request }) => {
    expect(await (await request.get('/robots.txt')).text()).toContain('Sitemap:');
    expect((await request.get('/sitemap-index.xml')).ok()).toBe(true);
    expect((await request.get('/rss.xml')).ok()).toBe(true);
  });
});

test.describe('interactive features', () => {
  test('search finds papers from the URL query', async ({ page }) => {
    await page.goto('/search/?q=harry+potter');
    await expect(page.locator('[data-status]')).toContainText('papers about');
    await expect(page.locator('[data-results] .entry').first()).toContainText(/Harry Potter/);
    await expect(page.locator('[data-results] .entry__title').first()).toContainText('?');
  });

  test('search updates as you type', async ({ page }) => {
    await page.goto('/search/');
    await page.locator('#page-search').fill('wombat');
    await expect(page.locator('[data-results] .entry')).toHaveCount(1);
    await expect(page).toHaveURL(/q=wombat/);
  });

  test('random button lands on a paper', async ({ page }) => {
    await page.goto('/random/');
    await expect(page).toHaveURL(/\/papers\/[a-z0-9-]+\/$/);
  });

  test('personality test produces a shareable certificate', async ({ page }) => {
    await page.goto('/quiz/');
    await page.getByRole('button', { name: /Begin the experiment/ }).click();
    for (let i = 0; i < 7; i++) {
      await expect(page.locator('[data-progress-label]')).toHaveText(`Question ${i + 1} of 7`);
      await page.locator('[data-answer]').nth(i % 4).click();
    }
    await page.getByLabel(/Your name/).fill('Ada <Lovelace>');
    await page.getByRole('button', { name: /Reveal my paper/ }).click();
    await expect(page).toHaveURL(/\/quiz\/result\/\?p=/);
    await expect(page.locator('[data-name]')).toHaveText('Ada Lovelace');
    await expect(page.locator('[data-paper-link]')).toHaveAttribute('href', /^\/papers\//);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  });

  test('broken result links show a friendly message', async ({ page }) => {
    await page.goto('/quiz/result/?p=nope');
    await expect(page.getByText(/went missing from the lab/)).toBeVisible();
  });
});

test.describe('mobile navigation', () => {
  test('menu toggles open', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'mobile only');
    await page.goto('/');
    const toggle = page.getByRole('button', { name: 'Menu' });
    const quizLink = page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Quiz', exact: true });
    await expect(quizLink).toBeHidden();
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(quizLink).toBeVisible();
  });
});

test.describe('background music', () => {
  test('starts on first interaction, mutes, and remembers across pages', async ({ page }) => {
    await page.goto('/');
    const music = page.getByRole('button', { name: 'Background music' });
    await expect(music).toHaveAttribute('aria-pressed', 'true');
    await expect(music).toHaveClass(/is-waiting/);

    await page.getByRole('button', { name: /Ask me another/ }).click();
    await expect(music).not.toHaveClass(/is-waiting/);

    await music.click();
    await expect(music).toHaveAttribute('aria-pressed', 'false');

    await page.getByRole('link', { name: /Browse all/ }).click();
    await expect(page).toHaveURL(/\/papers\/$/);
    await expect(page.getByRole('button', { name: 'Background music' })).toHaveAttribute('aria-pressed', 'false');
  });
});
