// ════════════════════════════════════════════════════════════════
// GuardMan — Auth helpers. JWT access token (2h) + refresh token (30d).
// Access token stored in localStorage, refresh token too. Helper API for
// the client to call when the access token is about to expire.
// ════════════════════════════════════════════════════════════════

const ACCESS_TOKEN_KEY = 'gm_token';
const ACCESS_EXPIRY_KEY = 'gm_token_expires_at';
const REFRESH_TOKEN_KEY = 'gm_refresh_token';
const REFRESH_EXPIRY_KEY = 'gm_refresh_expires_at';

const ACCESS_TTL_MS = 2 * 60 * 60 * 1000; // 2h access
const REFRESH_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30d refresh
const REFRESH_BUFFER_MS = 5 * 60 * 1000; // refresh 5min before expiry

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  if (!token || token === 'undefined' || token === 'null') {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    return null;
  }
  const expiresAt = Number(localStorage.getItem(ACCESS_EXPIRY_KEY) ?? 0);
  if (expiresAt && Date.now() > expiresAt) {
    clearToken();
    return null;
  }
  return token;
}

export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem(REFRESH_TOKEN_KEY);
  if (!token || token === 'undefined' || token === 'null') return null;
  const expiresAt = Number(localStorage.getItem(REFRESH_EXPIRY_KEY) ?? 0);
  if (expiresAt && Date.now() > expiresAt) {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(REFRESH_EXPIRY_KEY);
    return null;
  }
  return token;
}

export function setToken(accessToken: string, refreshToken?: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(ACCESS_EXPIRY_KEY, String(Date.now() + ACCESS_TTL_MS));
  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    localStorage.setItem(REFRESH_EXPIRY_KEY, String(Date.now() + REFRESH_TTL_MS));
  }
}

export function clearToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(ACCESS_EXPIRY_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(REFRESH_EXPIRY_KEY);
}

/** True if the access token expires within REFRESH_BUFFER_MS. */
export function needsRefresh(): boolean {
  if (typeof window === 'undefined') return false;
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  if (!token) return false;
  const expiresAt = Number(localStorage.getItem(ACCESS_EXPIRY_KEY) ?? 0);
  if (!expiresAt) return false;
  return expiresAt - Date.now() < REFRESH_BUFFER_MS;
}

export function isLoggedIn(): boolean {
  return getToken() !== null;
}

export function requireAuth(): string {
  const token = getToken();
  if (!token) {
    if (typeof window !== 'undefined') {
      const redirect = encodeURIComponent(window.location.pathname);
      window.location.href = `/admin/login?redirect=${redirect}`;
    }
    throw new Error('Auth required');
  }
  return token;
}

export function isDemoMode(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('gm_demo_mode') === 'crm';
}

export function setDemoMode(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  if (enabled) localStorage.setItem('gm_demo_mode', 'crm');
  else localStorage.removeItem('gm_demo_mode');
}
