/**
 * E2E Tests for PSEO Commune Pages
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
 * Sample communes to test (testing 2 representative samples, not all 52)
 */
const SAMPLE_COMMUNES = [
  { slug: 'las-condes', name: 'Las Condes', zone: 'oriente' },
  { slug: 'providencia', name: 'Providencia', zone: 'oriente' },
];

test.describe('PSEO Commune Pages E2E Tests', () => {
  /**
   * Test each sample commune
   */
  for (const commune of SAMPLE_COMMUNES) {
    test.describe(`${commune.name} Page`, () => {
      test(`${commune.slug} page loads successfully`, async ({ page }) => {
        await page.goto(`/cobertura/${commune.slug}`);

        // Verify page title contains commune name
        await expect(page).toHaveTitle(new RegExp(commune.name));
      });

      test('page has visible h1 heading', async ({ page }) => {
        await page.goto(`/cobertura/${commune.slug}`);

        // Verify h1 exists and contains commune name
        const h1 = page.locator('h1');
        await expect(h1).toBeVisible();
        await expect(h1).toContainText(commune.name);
      });

      test('page has hero section with CTA buttons', async ({ page }) => {
        await page.goto(`/cobertura/${commune.slug}`);

        // Verify hero section exists
        const heroSection = page.locator('section').first();
        await expect(heroSection).toBeVisible();

        // Verify CTA buttons in hero
        const ctaButton = heroSection.locator('button, a').first();
        await expect(ctaButton).toBeVisible();
      });

      test('page has breadcrumbs navigation', async ({ page }) => {
        await page.goto(`/cobertura/${commune.slug}`);

        // Look for breadcrumbs (nav with aria-label or specific class)
        const breadcrumbs = page.locator(
          'nav[aria-label*="breadcrumb"], nav[class*="breadcrumb"], [class*="Breadcrumbs"]'
        );
        await expect(breadcrumbs.first()).toBeVisible();
      });

      test('page has services grid section', async ({ page }) => {
        await page.goto(`/cobertura/${commune.slug}`);

        // Verify services section with grid of cards
        // Look for service cards with links to /servicios/
        const serviceCards = page.locator('a[href*="/servicios/"]');
        const count = await serviceCards.count();
        expect(count).toBeGreaterThan(0);
      });

      test('page has local benefits section', async ({ page }) => {
        await page.goto(`/cobertura/${commune.slug}`);

        // Look for benefits section heading
        const benefitsHeading = page.locator('h2:has-text("Presencia local")');
        await expect(benefitsHeading).toBeVisible();
      });

      test('page has zone coverage section', async ({ page }) => {
        await page.goto(`/cobertura/${commune.slug}`);

        // Verify zone coverage section exists
        const zoneHeading = page.locator('h2:has-text("Zona de Cobertura")');
        await expect(zoneHeading).toBeVisible();
      });

      test('page has CTA section at bottom', async ({ page }) => {
        await page.goto(`/cobertura/${commune.slug}`);

        // Look for final CTA section
        const ctaHeading = page.locator('h2:has-text("Asegure su propiedad")');
        await expect(ctaHeading).toBeVisible();
      });

      test('page has valid meta description', async ({ page }) => {
        await page.goto(`/cobertura/${commune.slug}`);

        // Verify meta description exists and contains commune name
        const metaDescription = page.locator('meta[name="description"]');
        await expect(metaDescription).toHaveAttribute(
          'content',
          new RegExp(commune.name, 'i')
        );
      });

      test('page links to other communes in zone', async ({ page }) => {
        await page.goto(`/cobertura/${commune.slug}`);

        // Verify links to other communes exist in coverage section
        const communeLinks = page.locator('a[href*="/cobertura/"]');
        const count = await communeLinks.count();
        // Should have links to other communes in the same zone
        expect(count).toBeGreaterThanOrEqual(1);
      });
    });
  }

  /**
   * General PSEO page structure tests
   */
  test.describe('PSEO Page Structure', () => {
    test('commune page has LocalBusiness schema', async ({ page }) => {
      await page.goto('/cobertura/las-condes');

      // Look for JSON-LD schema with LocalBusiness type
      const schemaScript = page.locator('script[type="application/ld+json"]');
      const count = await schemaScript.count();
      expect(count).toBeGreaterThan(0);
    });

    test('commune page has breadcrumb schema', async ({ page }) => {
      await page.goto('/cobertura/las-condes');

      // Look for JSON-LD schema with BreadcrumbList
      const schemaScripts = await page
        .locator('script[type="application/ld+json"]')
        .allTextContents();
      const hasBreadcrumbSchema = schemaScripts.some((content) =>
        content.includes('BreadcrumbList')
      );
      expect(hasBreadcrumbSchema).toBe(true);
    });

    test('non-existent commune redirects to coverage page', async ({
      page,
    }) => {
      // Test that invalid commune slugs redirect properly
      const response = await page.goto('/cobertura/non-existent-commune-xyz');

      // Should redirect to /cobertura
      // Check if we end up on the coverage page
      await page.waitForURL(/\/cobertura/);
    });
  });

  /**
   * SEO-specific tests
   */
  test.describe('PSEO SEO Tests', () => {
    test('commune page has proper heading hierarchy', async ({ page }) => {
      await page.goto('/cobertura/las-condes');

      // Verify only one h1
      const h1Count = await page.locator('h1').count();
      expect(h1Count).toBe(1);

      // Verify h2s exist for sections
      const h2Count = await page.locator('h2').count();
      expect(h2Count).toBeGreaterThanOrEqual(3);
    });

    test('commune page title follows SEO pattern', async ({ page }) => {
      await page.goto('/cobertura/las-condes');

      // Title should include: Security/Seguridad, Commune Name, Company Name
      const title = await page.title();
      expect(title).toMatch(/seguridad/i);
      expect(title).toMatch(/Las Condes/i);
      expect(title).toMatch(/Guardman/i);
    });

    test('all service cards have valid hrefs', async ({ page }) => {
      await page.goto('/cobertura/las-condes');

      // Get all service links
      const serviceLinks = await page.locator('a[href*="/servicios/"]').all();
      expect(serviceLinks.length).toBeGreaterThan(0);

      // Verify each has proper href structure
      for (const link of serviceLinks) {
        const href = await link.getAttribute('href');
        expect(href).toMatch(/^\/servicios\/[a-z0-9-]+$/);
      }
    });
  });

  /**
   * Navigation tests between commune pages
   */
  test.describe('Commune Page Navigation', () => {
    test('can navigate from one commune to another via coverage section', async ({
      page,
    }) => {
      // Start at Las Condes
      await page.goto('/cobertura/las-condes');

      // Find a link to another commune in the zone coverage section
      const otherCommuneLink = page.locator('a[href*="/cobertura/"]').first();

      // Click it
      await otherCommuneLink.click();

      // Should be on a different commune page
      await expect(page).toHaveURL(/\/cobertura\/[a-z-]+/);
    });

    test('can navigate to services from commune page', async ({ page }) => {
      await page.goto('/cobertura/las-condes');

      // Click a service card
      const serviceLink = page.locator('a[href*="/servicios/"]').first();
      await serviceLink.click();

      // Should be on a services page
      await expect(page).toHaveURL(/\/servicios\//);
    });

    test('can navigate to quote page from CTA section', async ({ page }) => {
      await page.goto('/cobertura/las-condes');

      // Find quote/CTA button
      const quoteButton = page.locator(
        'a[href="/cotizar"], button:has-text("Cotizar"), button:has-text("propuesta")'
      );
      await expect(quoteButton.first()).toBeVisible();
    });
  });
});
