// Stub de `cloudflare:workers` para vitest (mismo motivo que
// `astro-middleware.ts`: módulo virtual del runtime, sin archivo en disco).
//
// `src/lib/auth-server.ts` lo importa por `env`. Los tests que ejercitan el
// middleware no llegan a las rutas de auth (el guard de host canónico corta
// antes, y para `/admin` el contexto falso no trae cookie), así que un objeto
// vacío alcanza y evita arrastrar el runtime completo a la suite.
export const env: Record<string, unknown> = {};
