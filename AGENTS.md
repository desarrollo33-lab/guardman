# guardman — Contexto operativo

## Deploy
- Worker: `guardman-astro` (https://guardman-astro.oficinadesarrollo33.workers.dev)
- Cuenta Cloudflare: oficinadesarrollo33@gmail.com (account ID b3a89fc9524552b7ab3202269f1ab6f3)
- Astro 6 SSR + @astrojs/cloudflare
- Build: `npm run build` (debe correrse antes de `wrangler deploy`, ver gotcha en MEMORY.md)
- Deploy: `npx wrangler deploy`

## Custom domain `guardman.cl` — ESTADO
- **NO está apuntando a este worker.**
- Responde con `Server: ESF` (Google Sites) — actualmente es un site de Google Sites que no tiene nada que ver con el proyecto.
- El `wrangler.jsonc` NO tiene `routes` ni `custom_domains` configurado.
- Para conectar: si la zone `guardman.cl` está en la cuenta oficinadesarrollo33@gmail.com → agregar `routes: [{ pattern: "guardman.cl/*", zone_name: "guardman.cl" }]` al wrangler.jsonc. Si NO está, hay que migrar DNS o el dominio desde Google Sites.
- Este fue un bloqueo al cierre de sesión 2026-07-15.

## Logo
- Archivo: `public/images/logo-byn.png` (recortado a 681×250, era 800×600 con 61% de espacio vacío)
- Original: `logo/LOGO BYN.png` (no recortar de nuevo, ya está optimizado en public/)
- Header: 50px desktop / 44px mobile
- Footer: 48px desktop
- Dark contexts: `filter: brightness(0) invert(1)` para invertir negro→blanco

## Tareas pendientes
- Resolver el custom domain `guardman.cl` (ver arriba)
