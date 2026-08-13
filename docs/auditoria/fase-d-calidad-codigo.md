# Fase D — Calidad de Código

**Proyecto**: GuardMan Chile (Astro 6 SSR en Cloudflare Workers)
**Fecha**: 2026-08-13
**Versión analizada**: v5.2.0

---

## D1. TypeScript y Types

### Configuración

- **Strict mode**: ✅ Habilitado (`extends: "astro/tsconfigs/strict"`)
- `strictNullChecks: true`
- `noUnusedLocals: true`
- `noUnusedParameters: true`
- `noFallthroughCasesInSwitch: true`
- `verbatimModuleSyntax: true`

### Hallazgos

| ID | Severidad | Effort | Hallazgo | Evidencia | Impacto | Recomendación |
|---|---|---|---|---|---|---|
| LEGACY-D1-001 | P2 | S | **Tipos huérfanos en `src/types/index.ts`**: `SeoMeta`, `HeroSection`, `IntroSection`, `FeaturesSection`, `FaqItem`, `FaqsSection`, `StatsItem`, `StatsSection`, `CtaSection`, `GeneratedContent`, `PageData`, `MediaItem` — ninguno se importa en ningún otro archivo del proyecto. | `src/types/index.ts:1-102` — grep `from.*types/index` = 0 resultados en `src/` | Archivo muerto que confunde al mantener el proyecto. | Eliminar `src/types/index.ts` completo o documentar si se planea usar. |
| LEGACY-D1-002 | P2 | S | **Regex duplicadas entre `validation.ts` y `denuncias-validation.ts`**: `EMAIL_RE` y `PHONE_RE` están definidas idénticamente en ambos archivos. | `src/lib/validation.ts:27-29` vs `src/lib/denuncias-validation.ts:29-30` | Duplicación que puede divergir si se actualiza solo uno. | Extraer regex comunes a un archivo compartido (ej. `src/lib/patterns.ts`). |
| LEGACY-D1-003 | P3 | S | **`stripControl` y `trimTo` duplicados**: funciones helper idénticas en `validation.ts` y `denuncias-validation.ts`. | `src/lib/validation.ts:31-33` vs `src/lib/denuncias-validation.ts:36-37` | Mantenimiento duplicado. | Extraer a `src/lib/sanitize.ts`. |
| SEC-D1-001 | P2 | M | **`as unknown as Storage` en tests**: los tests de api y auth usan cast doble para simular localStorage. Aceptable en tests pero indica que el entorno de test no refleja bien el runtime browser. | `tests/api.test.ts:12`, `tests/auth.test.ts:15` | Tests pueden pasar con implementación incompleta de Storage. | Considerar usar `jsdom` environment en vitest o un shim más completo. |

---

## D2. Código Muerto y Legacy

### Exports sin importar (dead code)

| ID | Severidad | Effort | Hallazgo | Evidencia | Impacto | Recomendación |
|---|---|---|---|---|---|---|
| LEGACY-D2-001 | P2 | S | **`ADMIN_NAV`** exportado pero nunca importado. El comentario dice "ya no se usa, mantenido para refs externas". | `src/lib/constants.ts:237-242` — 0 imports | Código muerto que confunde. | Eliminar. |
| LEGACY-D2-002 | P2 | S | **`SOCIAL_PROFILES`** exportado pero nunca importado. | `src/lib/constants.ts:278-281` — 0 imports | Código muerto. | Eliminar. |
| LEGACY-D2-003 | P2 | S | **`LOCATION_NAMES`** exportado pero nunca importado. | `src/lib/constants.ts:131-133` — 0 imports | Código muerto. | Eliminar. |
| LEGACY-D2-004 | P2 | S | **`CLIENTES`** en `content.ts` exportado pero nunca importado. | `src/lib/content.ts:995-1004` — 0 imports | Datos de demo no usados. | Eliminar o integrar en homepage. |
| LEGACY-D2-005 | P2 | S | **`HERO_STATS`** en `content.ts` exportado pero nunca importado. | `src/lib/content.ts:1007-1011` — 0 imports | Datos de demo no usados. | Eliminar o integrar en homepage. |
| LEGACY-D2-006 | P2 | S | **`NOSOTROS_TIMELINE`** en `content.ts` exportado pero nunca importado. | `src/lib/content.ts:1014-1020` — 0 imports | Datos de demo no usados. | Eliminar o integrar en página nosotros. |
| LEGACY-D2-007 | P2 | S | **`icon()`, `serviceIcon()`, `sectorIcon()`** helper functions exportados pero nunca importados. Los componentes acceden a `ICONS`, `SERVICE_ICONS`, `SECTOR_ICONS` directamente. | `src/lib/icons.ts:89-101` — 0 imports de estas funciones | Código muerto. | Eliminar las 3 funciones helper. |
| LEGACY-D2-008 | P3 | S | **`imageUrl`** en `api.ts` exportado pero nunca importado. | `src/lib/api.ts:157` — 0 imports | Código muerto. | Eliminar. |
| LEGACY-D2-009 | P3 | S | **`contentCluster()`** en `seo.ts` exportado pero nunca importado. | `src/lib/seo.ts:416-433` — 0 imports | Código muerto. | Eliminar. |

### Código problemático

| ID | Severidad | Effort | Hallazgo | Evidencia | Impacto | Recomendación |
|---|---|---|---|---|---|---|
| LEGACY-D2-010 | P0 | S | **Test roto**: `constants.test.ts` espera `['GUARDIAS', 'EMPRESAS', 'COMUNAS', 'ANOS']` (4 keys) pero `STATS` solo tiene `['GUARDIAS', 'COMUNAS', 'ANOS']` (3 keys). El test falla. | `tests/constants.test.ts:18` — output de `npm test` muestra `AssertionError` | CI no pasa. Tests pierden credibilidad. | Actualizar el test para reflejar la realidad del código (3 keys), o agregar `EMPRESAS` a `STATS` si es un dato que falta. |
| LEGACY-D2-011 | P3 | S | **`types/index.ts` comentario obsoleto**: dice "Reemplaza a `src/types/index.ts`" en `constants.ts:3` pero `types/index.ts` sigue existiendo. | `src/lib/constants.ts:3` | Confusión sobre la fuente de verdad. | Eliminar `types/index.ts` y el comentario. |

### Console.log / debugger / alert

| ID | Severidad | Effort | Hallazgo | Evidencia | Impacto | Recomendación |
|---|---|---|---|---|---|---|
| — | — | — | ✅ No se encontraron `console.log`, `debugger`, `alert()` en código de producción. | grep en `src/**/*.ts` = 0 resultados | — | — |

### TODO/FIXME

| ID | Severidad | Effort | Hallazgo | Evidencia | Impacto | Recomendación |
|---|---|---|---|---|---|---|
| — | — | — | ✅ No se encontraron TODO/FIXME sin contexto. Los "XXXX" encontrados son formatos de ID legítimos (`D-YYYYMMDD-XXXX`). | grep en `src/**/*.{ts,astro}` = solo formatos | — | — |

---

## D3. Dependencias

### Vulnerabilidades de seguridad

| ID | Severidad | Effort | Hallazgo | Evidencia | Impacto | Recomendación |
|---|---|---|---|---|---|---|
| SEC-D3-001 | P0 | M | **13 vulnerabilidades (11 high)** según `npm audit`. Incluyen XSS en astro, path traversal en vite, y vulnerabilidades en sharp, postcss, undici, nanoid, js-yaml, svgo. | `npm audit --omit=dev` — 13 vulnerabilidades | Riesgo de XSS, path traversal y denial of service en producción. | Ejecutar `npm audit fix` para fixes no-breaking. Para astro/vite (breaking): evaluar upgrade a astro@7. |
| SEC-D3-002 | P0 | M | **Astro XSS**: CVE-2026-54298, CVE-2026-7pw4, CVE-2026-4g3v — XSS via unescaped spread attributes, transition directives, y View Transition animations. | `npm audit` — astro <=7.0.9 | Atacante puede inyectar scripts en páginas renderizadas. | Actualizar astro a >=7.2.1 (requiere evaluar breaking changes). |
| SEC-D3-003 | P1 | S | **Vite path traversal**: múltiples CVEs permiten bypass de `server.fs.deny` en Windows. | `npm audit` — vite 7.0.0-7.3.3 | En desarrollo, archivos sensibles pueden ser expuestos. | Actualizar vite a >=7.3.6. |
| SEC-D3-004 | P1 | S | **esbuild arbitrary file read**: en dev server en Windows. | `npm audit` — esbuild 0.27.3-0.28.0 | Archivos locales expuestos en desarrollo. | Actualizar via `npm audit fix`. |

### Dependencias sin uso aparente

| ID | Severidad | Effort | Hallazgo | Evidencia | Impacto | Recomendación |
|---|---|---|---|---|---|---|
| LEGACY-D3-001 | P3 | S | **`jsdom`** está en devDependencies pero vitest está configurado con `environment: 'node'`. | `package.json:35`, `vitest.config.ts:8` | Dependencia innecesaria. | Eliminar jsdom si no se usa en otro lugar. |
| LEGACY-D3-002 | P3 | S | **`clsx`** en dependencies — verificar uso real. | `package.json:21` | Posible dependencia no usada. | Verificar imports en componentes. |

---

## D4. Consistencia

### Linter / Formatter

| ID | Severidad | Effort | Hallazgo | Evidencia | Impacto | Recomendación |
|---|---|---|---|---|---|---|
| LEGACY-D4-001 | P1 | S | **No hay linter ni formatter configurado**: no existe `.eslintrc`, `.prettierrc`, `biome.json`, ni `deno.json` con lint. | glob de `.eslintrc*`, `.prettierrc*`, `biome*` = 0 resultados | Inconsistencia de estilo no detectada automáticamente. El `noUnusedLocals` de tsconfig ayuda parcialmente. | Configurar Biome (rápido, zero-config) o ESLint + Prettier. |
| LEGACY-D4-002 | P3 | S | **No hay script de lint en package.json**: `"check"` ejecuta `astro check` (type-checking) pero no hay `"lint"` script. | `package.json:10` | No hay forma estándar de ejecutar linting. | Agregar `"lint": "biome check src/"` o equivalente. |

### Naming consistency

| ID | Severidad | Effort | Hallazgo | Evidencia | Impacto | Recomendación |
|---|---|---|---|---|---|---|
| LEGACY-D4-003 | P3 | L | **Nombres mixtos español/inglés**: constantes en español (`DENUNCIA_CATEGORIES`, `DENUNCIA_RELACIONES`, `NOSOTROS_TIMELINE`, `CLIENTES`, `ZONAS`), tipos en inglés (`Lead`, `Dashboard`, `PipelineColumn`). Labels de UI en español. | Varios archivos | Menor legibilidad para desarrolladores internacionales, pero consistente internamente. | Documentar convención (UI = español, código = inglés). Prioridad baja. |

### Folder structure

| ID | Severidad | Effort | Hallazgo | Evidencia | Impacto | Recomendación |
|---|---|---|---|---|---|---|
| — | — | — | ✅ Estructura predecible: `components/`, `islands/`, `layouts/`, `lib/`, `pages/`, `styles/`, `types/`. | `src/` directory listing | — | — |

### Error messages

| ID | Severidad | Effort | Hallazgo | Evidencia | Impacto | Recomendación |
|---|---|---|---|---|---|---|
| — | — | — | ✅ Mensajes de error consistentes en español en `validation.ts` y `denuncias-validation.ts`. | `src/lib/validation.ts:39-49`, `src/lib/denuncias-validation.ts:49-104` | — | — |

---

## D5. Testing

### Configuración

- **Vitest**: v4.1.10, environment `node`, coverage con v8 provider
- **Playwright**: v1.61.1, solo Chromium, con wrangler dev como webServer
- **Coverage**: incluye `src/lib/**/*.ts`, excluye `icons.ts`, `mocks.ts`, `content.ts`

### Unit tests (vitest)

| Test file | Tests | Estado | Qué cubre |
|---|---|---|---|
| `tests/validation.test.ts` | 8 | ✅ Todos pasan | Validación de leads: email, teléfono, nombre, sanitización, truncamiento, source tagging |
| `tests/auth.test.ts` | 5 | ✅ Todos pasan | Token storage, TTL expiry, refresh buffer, clearToken, undefined/null cleanup |
| `tests/constants.test.ts` | 10 | ❌ 1 falla | SITE fields, STATS keys, SERVICE_SLUGS, LOCATIONS, ZONE_CONTEXT, SECTOR_TO_SERVICE, API_TIMEOUT, BUNDLE_VERSION |
| `tests/api.test.ts` | 4 | ✅ Todos pasan | Bearer token attachment, ApiError on non-2xx, 401 refresh retry, imageUrl helper |

**Total**: 27 tests, 26 pasan, 1 falla.

### E2E tests (Playwright)

| Test file | Tests | Qué cubre |
|---|---|---|
| `tests/e2e/public.spec.ts` | 6 | Homepage load, service detail + structured data, contact form validation, sitemap, robots.txt, CORS health |
| `tests/e2e/admin.spec.ts` | 1 | Login page render + rate limiting |

### Hallazgos de testing

| ID | Severidad | Effort | Hallazgo | Evidencia | Impacto | Recomendación |
|---|---|---|---|---|---|---|
| LEGACY-D5-001 | P0 | S | **Test roto en `constants.test.ts`**: el test `STATS has 4 numeric stats` falla porque espera 4 keys pero el código solo tiene 3. | `npm test` output — `AssertionError` | CI no pasa. Pérdida de confianza en tests. | Fix: actualizar test a 3 keys o agregar `EMPRESAS` a STATS. |
| LEGACY-D5-002 | P1 | M | **Sin tests para `denuncias-validation.ts`**: el formulario de denuncias es un flujo de compliance crítico pero no tiene tests unitarios. | No existe `tests/denuncias-validation.test.ts` | Bugs en validación de denuncias pueden pasar a producción sin detección. | Crear tests para `validateDenuncia()` y `generateTrackingId()`. |
| LEGACY-D5-003 | P1 | M | **Sin tests para `seo.ts`**: funciones de Schema.org no tienen tests que verifiquen la estructura del JSON-LD output. | No existe `tests/seo.test.ts` | SEO structured data puede romper sin detección. | Crear tests para las funciones de schema. |
| LEGACY-D5-004 | P2 | M | **Sin tests para `crm-data.ts`**: funciones `buildPipeline`, `buildDashboard`, `leadTimeline`, etc. no tienen tests. | No existe `tests/crm-data.test.ts` | Lógica de CRM puede romper sin detección. | Crear tests para funciones de CRM data. |
| LEGACY-D5-005 | P2 | S | **E2E admin mínimo**: solo 1 test (login rate-limit). No hay tests para dashboard, pipeline, leads CRUD, denuncias. | `tests/e2e/admin.spec.ts:1-22` | Flujos de admin críticos no verificados end-to-end. | Agregar E2E para: login exitoso, dashboard carga, lead creation, denuncia submission. |
| LEGACY-D5-006 | P2 | S | **Coverage excluye archivos importantes**: `content.ts` e `icons.ts` están excluidos del coverage. | `vitest.config.ts:13` | Coverage report no refleja cobertura real del proyecto. | Revisar exclusiones — `content.ts` es data pura (ok excluir), pero `icons.ts` tiene funciones helper. |
| LEGACY-D5-007 | P3 | S | **Tests solo Chromium**: Playwright está configurado solo para Desktop Chrome. | `playwright.config.ts:19` | No se verifica compatibilidad con Firefox/Safari. | Agregar project para firefox si el soporte cross-browser es relevante. |

---

## Resumen Ejecutivo

### Métricas

| Métrica | Valor |
|---|---|
| TypeScript strict | ✅ Habilitado |
| `any` types en src/ | 0 |
| Console.log/debugger/alert | 0 |
| Tests unitarios | 27 (26 ✅, 1 ❌) |
| Tests E2E | 7 (6 public + 1 admin) |
| Vulnerabilidades npm | 13 (11 high) |
| Exports muertos | 9+ |
| Archivos huérfanos | 1 (`types/index.ts`) |
| Linter/Formatter | ❌ No configurado |

### Top 5 prioridades

1. **P0 — Fix test roto** (`constants.test.ts`): 5 minutos, bloquea CI.
2. **P0 — `npm audit fix`**: actualizar dependencias con vulnerabilidades high.
3. **P1 — Tests para denuncias-validation**: flujo de compliance sin cobertura.
4. **P1 — Configurar linter**: Biome o ESLint para detectar issues automáticamente.
5. **P2 — Limpiar código muerto**: eliminar 9+ exports no usados y `types/index.ts`.

### Estado general

El proyecto tiene buena base de calidad: TypeScript strict, sin `any` types, sin console.log en producción, y una estructura de archivos limpia. Los principales problemas son:
- **Seguridad**: 13 vulnerabilidades npm (mayormente en astro/vite) requieren atención urgente.
- **Testing**: 1 test roto y gaps significativos en denuncias y CRM.
- **Código muerto**: ~9 exports sin usar y un archivo de tipos completo sin referenciar.
- **Herramientas**: falta linter/formatter configurado.
