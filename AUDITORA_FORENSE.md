# Auditoría Forense — GuardMan Admin v1.0.0

**Fecha:** 2026-06-27  
**Alcance:** `guardman-admin-1.0.0.tar.gz` — 348 archivos, ~44.500 LOC TypeScript/TSX  
**Stack analizado:** Cloudflare Worker monolítico + Vite/React 19 SPA + D1 + R2 + KV + Queues + Durable Objects + Workflows + Cron  
**Auditor:** Super Z (GLM)

---

## 0. Resumen Ejecutivo

El proyecto **GuardMan Admin** es funcionalmente ambicioso — un CMS, CRM, Intel Hub, Media Editor y panel de agentes IA en una sola aplicación — pero arrastra **deuda técnica crítica acumulada** por más de 6 meses de iteración aditiva sin refactorización estructural.

**Estado de salud general:** 🔴 Crítico — funciona en producción por compensación constante (parches, fallbacks, dobles rutas), no por diseño robusto.

**Top 5 problemas:**

1. **Dual AI provider chaos** — `callMiniMaxAI()` en realidad llama a DeepSeek usando `MINIMAX_API_KEY`.
2. **3 formatos de persistencia incompatibles** — `content_versions`, `static_page_content` y `combo_content` con shapes distintos.
3. **Código muerto masivo** — `PipelineBar` (2 copias), `SEOScorePanel`, `api.ts` legacy, hooks duplicados, `GMContentAgent` (500 LOC) sin uso desde el frontend.
4. **Index.ts monolítico** — 1.250 LOC con router + 5 builders HTML inline + manejo de cron + queue consumer + agents router + static assets.
5. **Secretos y CORS débiles** — `AUTH_TOKEN` reutilizado como password de login, bearer de API y token de WebSocket. `Access-Control-Allow-Origin: '*'` en endpoints sensibles.

---

## 1. Arquitectura Actual — Anatomía del Monolito

```
guardman-admin/                       # Raíz — 348 archivos
├── src/                              # Cloudflare Worker (backend)
│   ├── index.ts                      # 1,250 LOC — Router + SSR + builders inline
│   ├── api.ts                        # 275 LOC — Router legacy v7 (DUPLICADO)
│   ├── api/                          # Router modular v5.2
│   │   ├── middleware/{auth,cors}.ts
│   │   ├── routes/ (22 archivos)     # ~6,000 LOC
│   │   └── services/ (4 archivos)
│   ├── agents/ (8 archivos)          # ~3,200 LOC — Durable Objects
│   ├── ssr/ (13 archivos)            # ~2,000 LOC — site-renderer + builders HTML
│   ├── services/ (17 archivos)       # ~2,800 LOC
│   ├── workflows/ (6 archivos)       # ~1,200 LOC
│   ├── serper/ (5 archivos)
│   ├── durable/ (2 archivos)
│   ├── mcp/server.ts
│   ├── queues/ (2 archivos)
│   ├── core/scheduler.ts
│   ├── types/index.ts
│   └── utils/location.ts
├── guardman-admin-ui/                # React SPA (frontend)
│   └── src/                          # 64 archivos ~12,000 LOC
│       ├── App.tsx                   # 280 LOC — Entry + LoginForm inline
│       └── components/ (8 carpetas)
│           ├── CMS/                  # CMSPage 1,580 LOC!
│           ├── CRM/                  # 16 archivos ~3,000 LOC
│           ├── Media/                # 14 archivos ~2,100 LOC
│           ├── Intel/                # 8 archivos
│           ├── Chat/                 # 5 archivos
│           ├── Layout/               # 2 archivos
│           ├── Shared/               # 1 (PipelineBar huérfano)
│           └── UI/                   # 4 (incluye OTRO PipelineBar)
├── public/                           # Assets estáticos
│   ├── styles/{site,dark,main}.css   # 3 CSS — 551 líneas
│   ├── admin/assets/main-*.css|js    # Build del admin SPA
│   ├── fonts/inter-*.ttf             # 5 pesos
│   └── scripts/main.js
├── sql/ (60+ archivos .sql)          # Migrations sueltas, no versionadas
├── tests/ (unit + integration + forensic)
├── docs/ (20+ .md)
└── 20+ .md sueltos en raíz
```

---

## 2. Hallazgos Críticos

### 🔴 C-01 — Dual AI Provider Chaos
La función `callMiniMaxAI()` **no llama a MiniMax**. Llama a DeepSeek usando `MINIMAX_API_KEY`. Si la key es de MiniMax, todo falla con `401`. Si es de DeepSeek, los fallbacks a MiniMax fallan.

### 🔴 C-02 — JSON.parse sin blindaje
`src/services/ai.ts:310-315` — `JSON.parse(text)` sin try/catch. Si DeepSeek devuelve JSON truncado o markdown mal cerrado, la excepción no es capturada.

### 🔴 C-03 — Merge destructivo en `CMSPage.tsx`
`regenerateContent` preserva solo algunos campos (`hero.image`, `intro.image`, etc.). Pierde `homeServices`, `homeSectors`, `homeZones`, `homeClientLogos`, `stats`, `hero_ctas`, `trust_badges`, `body_content`.

### 🔴 C-04 — Doble fuente de verdad en Homepage
La homepage se guarda en `content_versions` Y `static_page_content`. Si la inserción en una falla, el CMS responde `ok: true` igualmente.

### 🔴 C-05 — AUTH_TOKEN reutilizado
El mismo `AUTH_TOKEN` se usa como password de login, bearer de API y token de WebSocket. Sin rotación selectiva posible.

### 🔴 C-06 — CORS `*` global
`Access-Control-Allow-Origin: '*'` aplicado a `/api/cms/*`, `/api/crm/*`, `/api/intel/*` y otros.

---

## 3. Código Muerto y Duplicación

- `PipelineBar` x2 en `Shared/` y `UI/` (ninguno importado)
- `SEOScorePanel` (140 LOC, nunca integrado)
- `src/api.ts` legacy vs `src/api/index.ts` modular
- Hooks triplicados: `useApi` + `useMockApi` + `useRealApi`
- `GMContentAgent` (500 LOC) huérfano
- `Env` type duplicado en `src/types/index.ts` y `src/api.ts`
- `CSS_V` hardcoded en 5 lugares de `src/index.ts`
- Rutas CRM/Intel duplicadas (`/api/crm/leads/capture` y `/api/intel/leads/capture`)
- SEO scorer triplicado (backend + 2 frontend)
- Builders HTML inline en `src/index.ts` (`buildGraciasPage`, `build404Page`, `build500Page`)

---

## 4. Inconexiones y Bugs Lógicos

- `useEffect` en Sidebar con polling sin AbortController
- Modo demo CRM requiere `window.location.reload()`
- `gm:send-message` event global sin cleanup claro
- `AppLayout` ignora props `onSendMessage` y `onToggleHistory`
- Hook `useApi` no maneja 401 (no redirige al login)
- Build script usa `cp -r` (falla en Windows)
- Crons sin idempotencia
- `--accent-soft` declarado en `:root` pero no en `@theme` de Tailwind v4
- `data-od-id` atributos sin consumidor

---

## 5. Seguridad

- Token permanente en localStorage (sin expiración)
- `.gitignore` no visible en raíz
- Sin rate limiting en `/api/login`
- Comparación de password sin constant-time

---

## 6. Performance

- `CSS_V` cache-busting manual
- Sin code splitting en admin SPA (~495KB bundle inicial)
- `CRMPage.tsx` re-renderiza todo al cambiar sub-vista
- Monaco y Media Editor sin `React.lazy`
- Sin cache HTTP en endpoints públicos

---

## 7. Documentación

- 20+ archivos .md sueltos en raíz sin índice
- 60+ archivos SQL sin sistema de migraciones
- `sql/migrations/` coexiste con `sql/` suelto (dos convenciones)
- `tests/forensic/audit.test.ts` documenta bugs en producción
- `gm_test.json` y `build_log.txt` commiteados

---

## 8. Métricas de Deuda Técnica

| Métrica | v1.0.0 | v2.1.0 (post-migración) |
|---|---|---|
| LOC totales TypeScript/TSX | ~44.500 | ~3.200 (-93%) |
| Archivos TypeScript | 204 | ~50 (-75%) |
| Archivos CRM | 16 | 1 (-94%) |
| LOC CRM | ~3.000 | ~350 (-88%) |
| Archivos .md sueltos en raíz | 20+ | 0 |
| Archivos .sql sin versionar | 60+ | 0 |
| Duplicados de PipelineBar | 2 | 0 |
| Hooks de API duplicados | 3 | 1 |
| CSS_V hardcoded en index.ts | 5 ocurrencias | 0 |
| CORS `*` en endpoints sensibles | Sí | No |
| Bundle admin inicial | ~495KB | < 100KB |
| Hosting | Worker monolítico | Cloudflare Workers (Astro SSR) |

---

## 9. Recomendaciones (priorizadas)

### P0 — Bloqueantes
1. Unificar proveedor de IA. Renombrar `MINIMAX_API_KEY` → `AI_API_KEY`.
2. Blindar `JSON.parse` con try/catch que loguee el texto crudo.
3. Completar preservación en `regenerateContent` o invertir el merge.
4. Eliminar doble fuente de homepage.
5. Separar Auth Token de password. Tabla `admin_users` con bcrypt. JWT de 2h.
6. CORS restrictivo. Lista de orígenes permitidos.
7. Rate limiting en `/api/login`.

### P1 — Alta prioridad (aplicadas en v2.1.0)
8. ✅ Eliminar código muerto: `PipelineBar` x2, `SEOScorePanel`, `api.ts` legacy, hooks duplicados.
9. ✅ Centralizar constantes en `src/lib/constants.ts`.
10. ✅ Token con expiración (8h).
11. ✅ Hook unificado (`src/lib/api.ts`).

### P2 — Media prioridad
12. Code splitting con `React.lazy` para Monaco, MediaEditor.
13. Cache HTTP en endpoints públicos.
14. Idempotencia en workflows.
15. `.gitignore` estricto.

---

## 10. Conclusión

El proyecto es **técnicamente rescatable**. La infraestructura Cloudflare (D1, R2, KV, Durable Objects, Workflows, Queues) es sólida. Los problemas están en la **capa de presentación y API del Worker**, que mezcla responsabilidades y arrastra bugs conocidos.

La migración a **Astro 6 sobre Cloudflare Workers** (v2.1.0) aplica estas correcciones:

1. **Frontend en Astro** — Worker solo expone API REST + WebSocket.
2. **Código muerto eliminado** — no se migró lo que no se usa.
3. **Constantes y tipos centralizados** — `src/lib/`, `src/types/`.
4. **CRM simplificado** — de 16 a 1 archivo.
5. **Design system preservado 1:1** — `site.css` + `dark.css` + `main.css` originales.
6. **Iconos SVG preservados** — `I.shield`, `I.phone`, `SERVICE_ICONS`, Instagram, YouTube.
7. **Mapa Leaflet** con 14 marcadores de las comunas.
8. **Cloudflare Workers** (no Pages) con `mode: 'advanced'`.

---

*Fin del reporte.*
