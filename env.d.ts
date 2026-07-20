/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_API_URL: string;
  readonly PUBLIC_SITE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Módulo virtual provisto por el runtime de Cloudflare Workers
// (reemplazó a Astro.locals.runtime.env en Astro 6). Verificado en runtime
// contra `wrangler dev` y deploys de producción.
declare module 'cloudflare:workers' {
  export const env: { DB?: D1Database };
}

interface D1PreparedStatement {
  bind(...args: unknown[]): D1PreparedStatement;
  first<T = unknown>(): Promise<T | null>;
  all<T = unknown>(): Promise<{ results?: T[] }>;
  run(): Promise<{ success: boolean; meta?: unknown }>;
}
interface D1Database {
  prepare(query: string): D1PreparedStatement;
}

declare namespace App {
  interface Locals {
    token?: string;
    user?: { email: string; role: 'admin' };
  }
}
