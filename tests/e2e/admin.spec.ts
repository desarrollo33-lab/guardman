import { test, expect } from '@playwright/test';

test.describe('admin login', () => {
  test('login page renders and rate-limits after repeated submits', async ({ page }) => {
    await page.goto('/admin/login');
    await expect(page.locator('h2', { hasText: 'Bienvenido' })).toBeVisible();
    // 5 failed attempts should lock the form briefly
    for (let i = 0; i < 5; i++) {
      await page.fill('input[name="email"]', 'bad@example.com');
      await page.fill('input[name="password"]', 'wrong');
      // If button is locked, break early
      const disabled = await page.locator('button[type="submit"]').isDisabled();
      if (disabled) break;
      await page.click('button[type="submit"]');
      // Wait a tick for the error to render
      await page.waitForTimeout(150);
    }
    const isDisabled = await page.locator('button[type="submit"]').isDisabled();
    // Either locked, or last attempt was submitted and the API returned 401
    expect(isDisabled).toBeTruthy();
  });
});
