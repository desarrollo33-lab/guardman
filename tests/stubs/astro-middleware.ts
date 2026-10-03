// Stub del módulo virtual de Astro para poder importar `src/middleware.ts`
// desde vitest.
//
// `astro:middleware` lo provee el pipeline de Astro en build, no existe como
// archivo en disco. `defineMiddleware` es identidad: el middleware se puede
// invocar directo con un contexto falso, que es lo que hace
// `tests/canonical-host.test.ts`.
export const defineMiddleware = <T>(fn: T): T => fn;
