// ════════════════════════════════════════════════════════════════
// E2E regression test for the GuardPod questionnaire save bug.
//   Bug (fixed in v5.5.6): saveOne captured `drafts` from the render
//   closure, which lagged 1 keystroke behind the latest typed value.
//   Fix: draftsRef (useRef) — synchronous source of truth read by
//   saveOne, flushAll, and beforeunload.
//
//   This test types a string char-by-char via Playwright keyboard
//   to trigger N re-renders, waits past the 1.5s debounce, then
//   verifies via the export API that the FULL string is stored.
//   Pre-fix: saved value would be 1 char short (the last keystroke
//   was lost to closure stale).
//
//   Auth: se usa un access token REAL (ADMIN_TOKEN). Hasta 2026-10-02
//   isAdminRequest solo miraba la longitud de la cookie y una cookie falsa
//   de 32 caracteres alcanzaba; desde entonces verifica la firma del JWT, así
//   que una cookie fabricada devuelve 401 y el test moría en el setup sin
//   proteger nada.
//
//   Target: LOCAL por defecto. Este test borra y escribe filas reales de
//   `guardpod_answers`; apuntarlo a producción por defecto corrompía datos.
//   Correr contra producción exige ALLOW_PROD_TESTS=1 a propósito.
import { test, expect, type APIRequestContext, type Page } from '@playwright/test';

const BASE_URL = process.env.BASE_URL ?? 'http://127.0.0.1:8788';

const isLocal = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?(\/|$)/i.test(BASE_URL);
if (!isLocal && process.env.ALLOW_PROD_TESTS !== '1') {
  throw new Error(
    `Refusando correr contra ${BASE_URL}: este test ESCRIBE en guardpod_answers. ` +
      `Para hacerlo a propósito: ALLOW_PROD_TESTS=1 BASE_URL=<host>.`,
  );
}

const ADMIN_TOKEN = process.env.ADMIN_TOKEN;
if (!ADMIN_TOKEN) {
  throw new Error(
    'Falta ADMIN_TOKEN. Exporta un access token de admin válido: ' +
      '  node -e "fetch(process.env.BASE_URL+\'/api/login\',{method:\'POST\',...})"',
  );
}
const SESSION_TOKEN = ADMIN_TOKEN;

// Known existing answer row we'll overwrite then verify
const TARGET_KEY = 'identidad.nombre_oficial';
const TARGET_TYPE = 'text';
// 60-char payload — long enough to span multiple debounce resets,
// short enough to keep the test fast
const TEST_VALUE = 'TRACER-' + 'abcdefghij'.repeat(5) + '-END'; // 60 chars

async function clearAnswer(req: APIRequestContext, sessionId: string) {
  // Empty value triggers DELETE in the API handler
  await req.post(`${BASE_URL}/api/guardpod/answer`, {
    headers: { cookie: `gm_session=${SESSION_TOKEN}` },
    data: {
      session_id: sessionId,
      question_key: TARGET_KEY,
      value: '',
      answer_type: TARGET_TYPE,
    },
  });
}

async function getSessionId(req: APIRequestContext): Promise<string> {
  const r = await req.get(`${BASE_URL}/api/guardpod/session`, {
    headers: { cookie: `gm_session=${SESSION_TOKEN}` },
  });
  const j = await r.json();
  return j.session.id as string;
}

async function getSavedValue(req: APIRequestContext, key: string): Promise<string | null> {
  const r = await req.get(`${BASE_URL}/api/guardpod/export`, {
    headers: { cookie: `gm_session=${SESSION_TOKEN}` },
  });
  const j = await r.json();
  const v = (j.flat_answers ?? {})[key];
  return v === undefined ? null : String(v);
}

test.describe('guardpod wizard — save regression (v5.5.6)', () => {
  test.use({ baseURL: BASE_URL });

  test('typed value is saved in full (no 1-char truncation from React closure stale)', async ({ page, request: req }) => {
    const sessionId = await getSessionId(req);
    await clearAnswer(req, sessionId);

    // Set the fake session cookie and load the wizard
    await page.context().addCookies([{
      name: 'gm_session',
      value: SESSION_TOKEN,
      domain: new URL(BASE_URL).hostname,
      path: '/',
    }]);
    // The client-side admin-auth-guard.js checks localStorage for
    // gm_token + gm_token_expires_at. Seed them BEFORE navigating so
    // the guard doesn't redirect us to /admin/login.
    await page.addInitScript((token) => {
      window.localStorage.setItem('gm_token', token);
      // 24h from now
      window.localStorage.setItem('gm_token_expires_at', String(Date.now() + 86_400_000));
    }, SESSION_TOKEN);
    await page.goto('/admin/guardpod');

    // Welcome modal may appear on first visit; dismiss it
    const welcomeBtn = page.getByRole('button', { name: /entendido, empezar/i });
    if (await welcomeBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await welcomeBtn.click();
    }

    // Find the input for the target question. The wizard shows one
    // question at a time; we click the section then the question.
    // The sidebar has a button for each section; the first section
    // contains our target key.
    // The first question of the first section is `identidad.nombre_oficial`
    // (a text input) — that should already be active on load.
    const input = page.locator('.gp-input').first();
    await expect(input).toBeVisible({ timeout: 10_000 });
    await input.click();

    // Type char-by-char with a small delay so each keystroke triggers
    // a re-render and the debounce keeps resetting.
    // 60 chars at 30ms = 1.8s — debounce (1.5s) never fires mid-type.
    await page.keyboard.type(TEST_VALUE, { delay: 30 });

    // Wait past the 1.5s debounce + a safety margin
    await page.waitForTimeout(3000);

    // Verify the save state indicator shows "Guardado"
    await expect(page.locator('.gp-save-state.saved').first()).toBeVisible({ timeout: 5000 });

    // Fetch the export to read the saved value
    const saved = await getSavedValue(req, TARGET_KEY);

    // The fix: draftsRef should preserve the FULL typed value.
    // Pre-fix: would be 59 chars (1 char short — last keystroke lost
    // to closure stale).
    expect(saved).toBe(TEST_VALUE);
    expect(String(saved ?? '').length).toBe(TEST_VALUE.length);
  });
});
