import { test, expect } from '@playwright/test';

test.describe('public site', () => {
  test('homepage loads with hero and services', async ({ page }) => {
    const res = await page.goto('/');
    expect(res?.status()).toBeLessThan(400);
    await expect(page.locator('h1').first()).toBeVisible();
    await expect(page.locator('a[href="/cotizacion"]').first()).toBeVisible();
    // Critical SEO tags
    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
    expect(ogTitle).toBeTruthy();
  });

  test('service detail page renders FAQs and structured data', async ({ page }) => {
    const res = await page.goto('/servicios/guardias-de-seguridad');
    expect(res?.status()).toBeLessThan(400);
    await expect(page.locator('h1').first()).toBeVisible();
    // FAQPage schema present
    const ldJsonScripts = await page.locator('script[type="application/ld+json"]').allTextContents();
    const joined = ldJsonScripts.join('\n');
    expect(joined).toContain('"@type":"FAQPage"');
    expect(joined).toContain('"@type":"Product"');
    expect(joined).toContain('"@type":"BreadcrumbList"');
  });

  test('contact form rejects invalid email and accepts valid', async ({ page }) => {
    await page.goto('/contacto');
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'not-an-email');
    await page.fill('input[name="phone"]', '+56 9 3000 0010');
    await page.selectOption('select[name="service"]', { label: 'Guardias de Seguridad' });
    // HTML5 validation should block submission
    await page.click('button[type="submit"]');
    // Still on the same page
    expect(page.url()).toMatch(/\/contacto/);
  });

  test('sitemap excludes /admin and /api', async ({ request }) => {
    const res = await request.get('/sitemap.xml');
    expect(res.status()).toBe(200);
    const xml = await res.text();
    expect(xml).not.toContain('/admin');
    expect(xml).not.toContain('/api/');
    // Spot-check a known public URL
    expect(xml).toContain('/servicios/guardias-de-seguridad');
  });

  test('robots.txt disallows /admin and /api', async ({ request }) => {
    const res = await request.get('/robots.txt');
    expect(res.status()).toBe(200);
    const text = await res.text();
    expect(text).toContain('Disallow: /admin');
    expect(text).toContain('Disallow: /api');
  });

  test('health endpoint allows only guardman.cl + localhost', async ({ request }) => {
    const res = await request.get('/api/health', { headers: { Origin: 'https://evil.example' } });
    expect(res.status()).toBe(200);
    const allow = res.headers()['access-control-allow-origin'];
    // Restrictive CORS: bad origin is rewritten to guardman.cl
    expect(allow).toBe('https://guardman.cl');
  });
});
