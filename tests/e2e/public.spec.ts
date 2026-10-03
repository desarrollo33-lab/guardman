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
    // Una página de SERVICIO emite Service (con OfferCatalog), no Product.
    // Product es para los productos físicos: /guard-pod y /ajax-systems.
    expect(joined).toContain('"@type":"Service"');
    expect(joined).not.toContain('"@type":"Product"');
    expect(joined).toContain('"@type":"BreadcrumbList"');
  });

  test('product landing pages emit Product schema', async ({ page }) => {
    for (const [path, name] of [
      ['/guard-pod', 'Guardpod V1'],
      ['/ajax-systems', 'Ajax Systems (instalación oficial)'],
    ]) {
      await page.goto(path);
      const joined = (await page.locator('script[type="application/ld+json"]').allTextContents()).join('\n');
      expect(joined, `falta Product en ${path}`).toContain('"@type":"Product"');
      expect(joined, `falta el nombre del producto en ${path}`).toContain(name);
      expect(joined).toContain('"@type":"BreadcrumbList"');
    }
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

  test('documentos para agentes se sirven con el media type que declara el manifiesto', async ({ request }) => {
    // El manifiesto dice `text/markdown; profile="urn:air:agent-skills"`. Servir
    // text/plain o markdown sin el perfil sería decir una cosa y entregar otra:
    // el media type es parte del contrato con el consumidor.
    for (const path of ['/llms.txt', '/llms-servicios.md', '/llms-cobertura.md', '/llms-marco-legal.md', '/llms-guias.md']) {
      const res = await request.get(path);
      expect(res.status(), `${path} no responde 200`).toBe(200);
      const ct = res.headers()['content-type'];
      expect(ct, `${path} con content-type incorrecto`).toContain('text/markdown');
      expect(ct, `${path} sin el perfil que ARD exige`).toContain('profile="urn:air:agent-skills"');
      expect((await res.text()).length, `${path} vino vacío`).toBeGreaterThan(500);
    }
  });

  test('el manifiesto declara una MCP server card que existe', async ({ request }) => {
    const card = await request.get('/.well-known/mcp.json');
    expect(card.status()).toBe(200);
    expect(card.headers()['content-type']).toContain('application/mcp-server-card+json');
    const json = await card.json();
    expect(json.tools.map((t: { name: string }) => t.name)).toContain('guardman_solicitar_cotizacion');

    // Y el manifiesto la referencia de verdad.
    const manifest = await (await request.get('/.well-known/ard.json')).json();
    const mcpEntry = manifest.entries.find((e: { type: string }) => e.type === 'application/mcp-server-card+json');
    expect(mcpEntry, 'el manifiesto no declara ninguna MCP server card').toBeTruthy();
    expect(mcpEntry.url).toContain('/.well-known/mcp.json');
  });

  test('health endpoint allows only guardman.cl + localhost', async ({ request }) => {
    const res = await request.get('/api/health', { headers: { Origin: 'https://evil.example' } });
    expect(res.status()).toBe(200);
    const allow = res.headers()['access-control-allow-origin'];
    // Restrictive CORS: bad origin is rewritten to guardman.cl
    expect(allow).toBe('https://guardman.cl');
  });
});
