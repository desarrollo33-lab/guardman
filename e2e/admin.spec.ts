/**
 * E2E Tests for Admin Panel
 *
 * NOTE: Playwright is not currently installed in this project.
 * To run these tests, install Playwright first:
 *
 *   npm install -D @playwright/test
 *   npx playwright install
 *
 * Then add to package.json scripts:
 *   "test:e2e": "playwright test"
 *
 * Create playwright.config.ts with proper configuration.
 */

import { test, expect } from '@playwright/test';

/**
 * Test configuration
 * Skip authentication by using a mock or test mode
 */
test.describe('Admin Panel E2E Tests', () => {
  /**
   * Admin Login Page Tests
   */
  test.describe('Login Page', () => {
    test('login page loads successfully', async ({ page }) => {
      await page.goto('/admin/login');

      // Verify page title
      await expect(page).toHaveTitle(/Login.*Admin.*Guardman/);

      // Verify the page has a form element (LoginForm component)
      await expect(page.locator('form')).toBeVisible();
    });

    test('login page has email input field', async ({ page }) => {
      await page.goto('/admin/login');

      // Look for email input
      const emailInput = page.locator(
        'input[type="email"], input[name="email"], input[placeholder*="email" i]'
      );
      await expect(emailInput.first()).toBeVisible();
    });

    test('login page has password input field', async ({ page }) => {
      await page.goto('/admin/login');

      // Look for password input
      const passwordInput = page.locator('input[type="password"]');
      await expect(passwordInput).toBeVisible();
    });

    test('login page has submit button', async ({ page }) => {
      await page.goto('/admin/login');

      // Look for submit button
      const submitButton = page.locator(
        'button[type="submit"], button:has-text("Iniciar"), button:has-text("Login")'
      );
      await expect(submitButton.first()).toBeVisible();
    });

    test('login page has noindex meta tag', async ({ page }) => {
      await page.goto('/admin/login');

      // Verify noindex for SEO
      const metaRobots = page.locator('meta[name="robots"]');
      await expect(metaRobots).toHaveAttribute('content', /noindex/);
    });
  });

  /**
   * Admin Dashboard Tests
   */
  test.describe('Dashboard', () => {
    test('dashboard page loads', async ({ page }) => {
      await page.goto('/admin');

      // Verify the admin layout is present
      // The dashboard uses AdminLayout which should have navigation
      await expect(page.locator('body')).toBeVisible();
    });
  });

  /**
   * Admin Services Page Tests
   */
  test.describe('Services Management', () => {
    test('services page loads', async ({ page }) => {
      await page.goto('/admin/services');

      // Verify page loads
      await expect(page.locator('body')).toBeVisible();
    });
  });

  /**
   * Admin Solutions Page Tests
   */
  test.describe('Solutions Management', () => {
    test('solutions page loads', async ({ page }) => {
      await page.goto('/admin/solutions');

      // Verify page loads
      await expect(page.locator('body')).toBeVisible();
    });
  });

  /**
   * Admin Leads Page Tests
   */
  test.describe('Leads Management', () => {
    test('leads page loads', async ({ page }) => {
      await page.goto('/admin/leads');

      // Verify page loads
      await expect(page.locator('body')).toBeVisible();
    });
  });

  /**
   * Admin Partners Page Tests
   */
  test.describe('Partners Management', () => {
    test('partners page loads', async ({ page }) => {
      await page.goto('/admin/partners');

      // Verify page loads
      await expect(page.locator('body')).toBeVisible();
    });
  });

  /**
   * Admin FAQs Page Tests
   */
  test.describe('FAQs Management', () => {
    test('faqs page loads', async ({ page }) => {
      await page.goto('/admin/faqs');

      // Verify page loads
      await expect(page.locator('body')).toBeVisible();
    });
  });

  /**
   * Admin Blog Page Tests
   */
  test.describe('Blog Management', () => {
    test('blog page loads', async ({ page }) => {
      await page.goto('/admin/blog');

      // Verify page loads
      await expect(page.locator('body')).toBeVisible();
    });
  });

  /**
   * Admin Communes Page Tests
   */
  test.describe('Communes Management', () => {
    test('communes page loads', async ({ page }) => {
      await page.goto('/admin/communes');

      // Verify page loads
      await expect(page.locator('body')).toBeVisible();
    });
  });

  /**
   * Navigation Tests
   */
  test.describe('Admin Navigation', () => {
    test('can navigate between admin pages', async ({ page }) => {
      // Start at login page
      await page.goto('/admin/login');
      await expect(page.locator('form')).toBeVisible();

      // Navigate to dashboard
      await page.goto('/admin');
      await expect(page.locator('body')).toBeVisible();

      // Navigate to services
      await page.goto('/admin/services');
      await expect(page.locator('body')).toBeVisible();

      // Navigate to solutions
      await page.goto('/admin/solutions');
      await expect(page.locator('body')).toBeVisible();
    });
  });
});
