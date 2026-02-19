/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly SITE: string;
  readonly PUBLIC_CONVEX_URL: string;
  readonly PUBLIC_ADMIN_PASSWORD: string;
  readonly GOOGLE_SHEETS_WEBHOOK: string;
  readonly EMAIL_WEBHOOK: string;
  readonly SLACK_WEBHOOK: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
