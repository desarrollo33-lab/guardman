# Plan de Implementación Gradual - Guardman Chile

## TL;DR

> **Objetivo**: Implementar mejoras graduales donde cada fase muestre resultados visibles en el servidor local (`npm run dev`)
>
> **Entregables**:
>
> - Arquitectura SSR funcional
> - Infraestructura de calidad (ESLint, Prettier, TypeScript limpio)
> - Webhook Google Sheets para leads
> - Blog con 5 artículos
> - 15 páginas SEO de ciudades
> - Panel admin básico con password simple
>
> **Esfuerzo Estimado**: 6 fases × 2-3 días = ~3 semanas
> **Ejecución Paralela**: SÍ - múltiples tareas por fase
> **Ruta Crítica**: Fase 0 → Fase 1 → Fase 2 → Fase 5

---

## Contexto

### Solicitud Original

Crear un plan de implementación gradual para que pueda ir viendo el avance montado en el servidor local.

### Resumen de Entrevista

**Decisiones del Usuario**:

- Prioridad: Equilibrada (infraestructura + features + backend)
- Convex: Ya configurado y funcionando
- Duración de fases: Cortas (2-3 días)
- Notificaciones: Google Sheets primero
- Arquitectura: SSR (mejor SEO y más fácil de mantener)
- Panel admin: Password simple

**Hallazgos de Investigación**:

- Frontend completo (~50 archivos, 15 páginas, 25 componentes)
- Backend Convex con 5 queries + 3 mutations (más completo de lo esperado)
- SEO bien implementado con Schema.org
- **PROBLEMA CRÍTICO**: `output: 'static'` incompatible con Convex React
- **ERRORES TypeScript**: FAQ missing `category`, Industry missing `relatedServices`
- Cero tests, cero CI/CD, ESLint no configurado

### Revisión Metis

**Problemas Bloqueantes Identificados**:

1. Arquitectura static vs Convex React - RESUELTO: usar SSR
2. Falta ConvexProvider wrapper
3. FAQ objects missing `category` property
4. Industry interface missing `relatedServices` property

**Guardrails Aplicados**:

- No agregar features más allá del scope de cada fase
- No refactorizar código que funciona
- Criterios de aceptación como comandos ejecutables

---

## Objetivos de Trabajo

### Objetivo Principal

Implementar mejoras incrementales donde cada fase produzca cambios visibles y verificables en el servidor local de desarrollo.

### Entregables Concretos

1. ✅ Lead form funcional con SSR
2. ✅ Infraestructura de calidad operativa
3. ✅ Notificaciones Google Sheets
4. ✅ Blog con 5 artículos publicados
5. ✅ 15 páginas SEO de ciudades
6. ✅ Panel admin accesible con password

### Definición de Completado

- [ ] `npm run dev` ejecuta sin errores
- [ ] `npx tsc --noEmit` pasa con cero errores
- [ ] Lead form envía y guarda en Convex
- [ ] Nuevos leads aparecen en Google Sheets
- [ ] Blog accesible en `/blog`
- [ ] Panel admin accesible en `/admin`

### Must Have

- SSR habilitado para forms funcionales
- TypeScript limpio (cero errores)
- ESLint + Prettier configurados
- Google Sheets webhook operativo

### Must NOT Have (Guardrails)

- No refactorizar componentes existentes que funcionan
- No agregar features fuera del scope de cada fase
- No implementar autenticación compleja (solo password simple)
- No crear tests unitarios completos (solo smoke tests básicos)
- No agregar integraciones adicionales (solo Google Sheets)

---

## Estrategia de Verificación (MANDATORIA)

### Decisión de Tests

- **Infraestructura existe**: NO
- **Tests automatizados**: NO (se moverá a fase posterior)
- **Framework**: Ninguno por ahora
- **Verificación**: Manual via `npm run dev` + comandos curl

### Política de QA

Cada tarea incluye escenarios de QA ejecutados manualmente.
Evidencia guardada en `.sisyphus/evidence/task-{N}-{scenario-slug}.{ext}`.

| Tipo de Entregable | Herramienta                | Método                             |
| ------------------ | -------------------------- | ---------------------------------- |
| Páginas Astro      | Browser (npm run dev)      | Navegar, verificar render          |
| Forms React        | Browser + Convex Dashboard | Llenar form, verificar en DB       |
| API Endpoints      | curl                       | Enviar request, verificar response |
| Config files       | Bash                       | Ejecutar comando, verificar output |

---

## Estrategia de Ejecución

### Ondas de Ejecución Paralela

```
FASE 0: FIX ARQUITECTURA (1 día) — BLOQUEANTE
├── Task 0.1: Cambiar output a SSR [quick]
├── Task 0.2: Agregar ConvexProvider wrapper [quick]
├── Task 0.3: Fix FAQ category property [quick]
└── Task 0.4: Fix Industry relatedServices [quick]

FASE 1: INFRAESTRUCTURA DE CALIDAD (2 días)
├── Task 1.1: Crear .prettierrc config [quick]
├── Task 1.2: Crear eslint.config.mjs [quick]
├── Task 1.3: Agregar scripts npm (lint, format, typecheck) [quick]
├── Task 1.4: Crear tsconfig paths alias si falta [quick]
└── Task 1.5: Verificar build completo [quick]

FASE 2: GOOGLE SHEETS WEBHOOK (2 días)
├── Task 2.1: Crear Google Apps Script [quick]
├── Task 2.2: Crear endpoint /api/webhooks/sheets [quick]
├── Task 2.3: Modificar createLead para disparar webhook [quick]
└── Task 2.4: Documentar setup en README [quick]

FASE 3: BLOG (3 días)
├── Task 3.1: Crear estructura de contenido blog [quick]
├── Task 3.2: Crear página /blog/index.astro [quick]
├── Task 3.3: Crear plantilla /blog/[slug].astro [quick]
├── Task 3.4: Escribir artículo 1: Seguridad en condominios [writing]
├── Task 3.5: Escribir artículo 2: Guardias OS10 [writing]
├── Task 3.6: Escribir artículo 3: Alarmas Ajax [writing]
├── Task 3.7: Escribir artículo 4: Patrullaje nocturno [writing]
└── Task 3.8: Escribir artículo 5: GuardPod beneficios [writing]

FASE 4: SEO CIUDADES (2 días)
├── Task 4.1: Verificar estructura de locations.ts [quick]
├── Task 4.2: Crear página región dinámica [quick]
├── Task 4.3: Crear página ciudad dinámica [quick]
├── Task 4.4: Agregar LocalBusiness Schema [quick]
└── Task 4.5: Crear índice de cobertura [quick]

FASE 5: PANEL ADMIN (3 días)
├── Task 5.1: Crear layout admin con auth simple [quick]
├── Task 5.2: Crear página /admin/login.astro [quick]
├── Task 5.3: Crear página /admin/leads.astro [unspecified-high]
├── Task 5.4: Agregar filtros por estado/fecha [quick]
├── Task 5.5: Agregar paginación [quick]
└── Task 5.6: Agregar botón exportar CSV [quick]

FASE 6: OPTIMIZACIÓN (2 días)
├── Task 6.1: Verificar performance con Lighthouse [quick]
├── Task 6.2: Optimizar imágenes si es necesario [quick]
├── Task 6.3: Agregar meta tags faltantes [quick]
└── Task 6.4: Verificar sitemap generado [quick]

FASE FINAL: VERIFICACIÓN (después de TODAS las fases)
├── Task F1: Audit de cumplimiento del plan [oracle]
├── Task F2: Revisión de calidad de código [unspecified-high]
├── Task F3: QA manual completo [unspecified-high]
└── Task F4: Verificación de scope [deep]
```

### Matriz de Dependencias

| Tarea   | Depende De       | Bloquea       | Fase |
| ------- | ---------------- | ------------- | ---- |
| 0.1-0.4 | —                | Todo lo demás | 0    |
| 1.1-1.5 | 0.1-0.4          | 2.3           | 1    |
| 2.1-2.4 | 1.x              | —             | 2    |
| 3.1-3.8 | 0.1-0.4          | —             | 3    |
| 4.1-4.5 | 0.1-0.4          | —             | 4    |
| 5.1-5.6 | 0.1-0.4, 2.x     | —             | 5    |
| 6.1-6.4 | Todas anteriores | —             | 6    |

### Resumen de Agentes por Fase

| Fase  | # Paralelas | Tareas → Categoría                                   |
| ----- | ----------- | ---------------------------------------------------- |
| 0     | **4**       | 0.1-0.4 → `quick`                                    |
| 1     | **5**       | 1.1-1.5 → `quick`                                    |
| 2     | **4**       | 2.1-2.4 → `quick`                                    |
| 3     | **8**       | 3.1-3.3 → `quick`, 3.4-3.8 → `writing`               |
| 4     | **5**       | 4.1-4.5 → `quick`                                    |
| 5     | **6**       | 5.1-5.2, 5.4-5.6 → `quick`, 5.3 → `unspecified-high` |
| 6     | **4**       | 6.1-6.4 → `quick`                                    |
| FINAL | **4**       | F1 → `oracle`, F2-F4 → `unspecified-high`/`deep`     |

---

## TODOs

> Cada tarea = una unidad de trabajo con verificación concreta.
> TODAS las tareas incluyen escenarios de QA.

---

## FASE 0: FIX ARQUITECTURA (1 día) ⚠️ BLOQUEANTE

> Esta fase DEBE completarse antes que cualquier otra.
> Sin esto, el formulario de leads NO funciona.

### - [x] 0.1. Cambiar output a SSR

**Qué hacer**:

- Editar `astro.config.mjs`
- Cambiar `output: 'static'` a `output: 'server'`
- Verificar que Vercel adapter soporte SSR (ya está configurado)

**Qué NO hacer**:

- No modificar otras configuraciones
- No agregar adapters adicionales

**Perfil de Agente Recomendado**:

- **Categoría**: `quick`
- **Skills**: [] (ninguna requerida)

**Parallelización**:

- **Can Run In Parallel**: SÍ (con 0.2, 0.3, 0.4)
- **Parallel Group**: Fase 0
- **Blocks**: Fases 1-6
- **Blocked By**: None

**Referencias**:

- `astro.config.mjs:14` - Línea donde está `output: 'static'`
- https://docs.astro.build/en/guides/server-side-rendering/ - Docs oficiales SSR

**Criterios de Aceptación**:

- [ ] `astro.config.mjs` tiene `output: 'server'`
- [ ] `npm run dev` ejecuta sin errores
- [ ] `npm run build` completa sin errores

**QA Scenarios**:

```
Scenario: Dev server inicia con SSR
  Tool: Bash
  Preconditions: Ninguna
  Steps:
    1. npm run dev
    2. Esperar a "Local: http://localhost:4321"
  Expected Result: Servidor inicia sin errores
  Failure Indicators: Error about output mode, adapter incompatibility
  Evidence: .sisyphus/evidence/task-0.1-ssr-start.txt
```

**Commit**: YES

- Message: `fix(config): enable SSR for Convex React compatibility`
- Files: `astro.config.mjs`

---

### - [x] 0.2. Agregar ConvexProvider Wrapper

**Qué hacer**:

- Crear o modificar un componente que envuelva la app
- Importar `ConvexProvider` de `convex/react`
- Envolver los componentes que usan Convex hooks
- Ubicación sugerida: modificar BaseLayout o crear ConvexWrapper.astro

**Qué NO hacer**:

- No mover archivos existentes
- No crear estructuras complejas

**Perfil de Agente Recomendado**:

- **Categoría**: `quick`
- **Skills**: [] (ninguna requerida)

**Parallelización**:

- **Can Run In Parallel**: SÍ (con 0.1, 0.3, 0.4)
- **Parallel Group**: Fase 0
- **Blocks**: Verificación de forms
- **Blocked By**: None

**Referencias**:

- `src/lib/convex.ts` - Cliente Convex existente
- `src/components/forms/LeadForm.tsx:75` - Usa `useMutation`
- https://docs.convex.dev/client/react#provider - Docs ConvexProvider

**Criterios de Aceptación**:

- [ ] ConvexProvider envuelve la app
- [ ] `npm run dev` no muestra error de Convex context
- [ ] LeadForm renderiza sin crash

**QA Scenarios**:

```
Scenario: LeadForm renderiza sin error de contexto
  Tool: Browser (playwright skill)
  Preconditions: npm run dev corriendo
  Steps:
    1. Navegar a http://localhost:4321/cotizar
    2. Verificar que el formulario aparece
    3. Verificar que no hay errores en consola del browser
  Expected Result: Formulario visible, sin errores en consola
  Failure Indicators: "Convex context not found", blank page
  Evidence: .sisyphus/evidence/task-0.2-convex-provider.png
```

**Commit**: YES

- Message: `feat: add ConvexProvider wrapper for React hooks`
- Files: archivo nuevo o modificado

---

### - [x] 0.3. Fix FAQ Category Property

**Qué hacer**:

- En `src/data/faqs.ts`, agregar propiedad `category` a todos los objetos FAQ
- La interfaz `FAQ` requiere `category: string`
- Valores sugeridos: "general", "servicios", "contratos", "pagos"

**Qué NO hacer**:

- No cambiar la interfaz FAQ
- No agregar categorías complejas

**Perfil de Agente Recomendado**:

- **Categoría**: `quick`
- **Skills**: [] (ninguna requerida)

**Parallelización**:

- **Can Run In Parallel**: SÍ (con 0.1, 0.2, 0.4)
- **Parallel Group**: Fase 0
- **Blocks**: TypeScript clean build
- **Blocked By**: None

**Referencias**:

- `src/data/faqs.ts:1-13` - Interfaz FAQ con category requerido
- `src/data/faqs.ts:14-75` - Objetos FAQ sin category

**Criterios de Aceptación**:

- [ ] Todos los FAQs tienen propiedad `category`
- [ ] `npx tsc --noEmit` no muestra error en faqs.ts

**QA Scenarios**:

```
Scenario: TypeScript compila sin errores de FAQ
  Tool: Bash
  Preconditions: Ninguna
  Steps:
    1. npx tsc --noEmit
    2. Grep for "faqs.ts" in output
  Expected Result: No errors mentioning faqs.ts
  Failure Indicators: "Property 'category' is missing"
  Evidence: .sisyphus/evidence/task-0.3-faq-types.txt
```

**Commit**: YES

- Message: `fix(data): add category property to FAQ objects`
- Files: `src/data/faqs.ts`

---

### - [x] 0.4. Fix Industry relatedServices Property

**Qué hacer**:

- En `src/data/industries.ts`, agregar `relatedServices?: string[]` a la interfaz `Industry`
- O agregar `relatedServices` a cada objeto industry
- Verificar que `src/pages/industrias/[slug].astro:23` funciona

**Qué NO hacer**:

- No refactorizar la lógica de related services
- No agregar features nuevas

**Perfil de Agente Recomendado**:

- **Categoría**: `quick`
- **Skills**: [] (ninguna requerida)

**Parallelización**:

- **Can Run In Parallel**: SÍ (con 0.1, 0.2, 0.3)
- **Parallel Group**: Fase 0
- **Blocks**: TypeScript clean build
- **Blocked By**: None

**Referencias**:

- `src/data/industries.ts` - Interfaz Industry
- `src/pages/industrias/[slug].astro:23` - Usa `industry.relatedServices`

**Criterios de Aceptación**:

- [ ] Interfaz Industry incluye `relatedServices`
- [ ] `npx tsc --noEmit` no muestra error en industries

**QA Scenarios**:

```
Scenario: TypeScript compila sin errores de Industry
  Tool: Bash
  Preconditions: Ninguna
  Steps:
    1. npx tsc --noEmit
    2. Grep for "industries" in output
  Expected Result: No errors mentioning industries
  Failure Indicators: "Property 'relatedServices' does not exist"
  Evidence: .sisyphus/evidence/task-0.4-industry-types.txt
```

**Commit**: YES

- Message: `fix(data): add relatedServices to Industry interface`
- Files: `src/data/industries.ts`

---

## FASE 1: INFRAESTRUCTURA DE CALIDAD (2 días)

> Después de completar Fase 0, estas tareas pueden ejecutarse en paralelo.

### - [x] 1.1. Crear .prettierrc Config

**Qué hacer**:

- Crear archivo `.prettierrc` en la raíz del proyecto
- Configurar: semi, singleQuote, tabWidth: 2, trailingComma
- Configurar plugin de Astro (ya instalado: prettier-plugin-astro)

**Qué NO hacer**:

- No cambiar configuración de Prettier en package.json si existe
- No sobrescribir preferencias de formato existentes

**Perfil de Agente Recomendado**:

- **Categoría**: `quick`
- **Skills**: [] (ninguna requerida)

**Parallelización**:

- **Can Run In Parallel**: SÍ (con 1.2, 1.3, 1.4, 1.5)
- **Parallel Group**: Fase 1
- **Blocks**: None
- **Blocked By**: Fase 0 completa

**Referencias**:

- `package.json:29-30` - Prettier ya instalado con plugin Astro
- https://prettier.io/docs/en/options.html - Opciones de Prettier

**Criterios de Aceptación**:

- [ ] Archivo `.prettierrc` existe
- [ ] `npx prettier --check "src/**/*.{ts,tsx,astro}"` reporta archivos formateados

**QA Scenarios**:

```
Scenario: Prettier formatea archivos correctamente
  Tool: Bash
  Preconditions: .prettierrc creado
  Steps:
    1. npx prettier --check "src/**/*.{ts,tsx,astro}"
  Expected Result: Todos los archivos pasan el check o reporta los que necesitan formateo
  Failure Indicators: Error parsing config
  Evidence: .sisyphus/evidence/task-1.1-prettier-check.txt

Scenario: Formateo de archivos
  Tool: Bash
  Preconditions: .prettierrc creado
  Steps:
    1. npx prettier --write "src/**/*.{ts,tsx,astro}"
    2. Verificar que no hubo errores
  Expected Result: Archivos formateados sin errores
  Failure Indicators: Syntax errors, plugin not found
  Evidence: .sisyphus/evidence/task-1.1-prettier-write.txt
```

**Commit**: YES

- Message: `chore: add Prettier configuration`
- Files: `.prettierrc`

---

### - [x] 1.2. Crear eslint.config.mjs

**Qué hacer**:

- Crear `eslint.config.mjs` (flat config)
- Configurar para: TypeScript, React, Astro
- Reglas básicas: no-unused-vars, prefer-const, etc.
- No instalar dependencias nuevas si es posible (usar las que vienen con Astro)

**Qué NO hacer**:

- No configurar reglas excesivamente estrictas
- No agregar plugins adicionales innecesarios

**Perfil de Agente Recomendado**:

- **Categoría**: `quick`
- **Skills**: [] (ninguna requerida)

**Parallelización**:

- **Can Run In Parallel**: SÍ (con 1.1, 1.3, 1.4, 1.5)
- **Parallel Group**: Fase 1
- **Blocks**: None
- **Blocked By**: Fase 0 completa

**Referencias**:

- https://eslint.org/docs/latest/use/configure/configuration-files-new - Flat config docs
- `tsconfig.json` - Configuración TypeScript existente

**Criterios de Aceptación**:

- [ ] Archivo `eslint.config.mjs` existe
- [ ] `npx eslint src/` ejecuta sin crash (puede mostrar warnings)

**QA Scenarios**:

```
Scenario: ESLint analiza el código
  Tool: Bash
  Preconditions: eslint.config.mjs creado
  Steps:
    1. npx eslint src/ --max-warnings=100
  Expected Result: ESLint corre y reporta findings (o pasa limpio)
  Failure Indicators: "Cannot find config file", syntax error in config
  Evidence: .sisyphus/evidence/task-1.2-eslint-run.txt
```

**Commit**: YES

- Message: `chore: add ESLint configuration`
- Files: `eslint.config.mjs`

---

### - [x] 1.3. Agregar Scripts npm

**Qué hacer**:

- Agregar a `package.json` scripts:
  - `"lint": "eslint src/ convex/"`
  - `"lint:fix": "eslint src/ convex/ --fix"`
  - `"format": "prettier --write \"src/**/*.{ts,tsx,astro,css}\""`
  - `"format:check": "prettier --check \"src/**/*.{ts,tsx,astro,css}\""`
  - `"typecheck": "tsc --noEmit"`
  - `"check": "npm run typecheck && npm run lint && npm run format:check"`

**Qué NO hacer**:

- No modificar scripts existentes
- No agregar scripts de test (se hará en fase posterior)

**Perfil de Agente Recomendado**:

- **Categoría**: `quick`
- **Skills**: [] (ninguna requerida)

**Parallelización**:

- **Can Run In Parallel**: SÍ (con 1.1, 1.2, 1.4, 1.5)
- **Parallel Group**: Fase 1
- **Blocks**: None
- **Blocked By**: Fase 0 completa

**Referencias**:

- `package.json:6-12` - Scripts actuales

**Criterios de Aceptación**:

- [ ] `npm run lint` ejecuta ESLint
- [ ] `npm run format` formatea archivos
- [ ] `npm run typecheck` corre TypeScript
- [ ] `npm run check` ejecuta todos los checks

**QA Scenarios**:

```
Scenario: Scripts npm funcionan
  Tool: Bash
  Preconditions: Scripts agregados a package.json
  Steps:
    1. npm run typecheck
    2. npm run lint
    3. npm run format:check
  Expected Result: Todos los comandos ejecutan sin crash
  Failure Indicators: "missing script", command not found
  Evidence: .sisyphus/evidence/task-1.3-scripts.txt
```

**Commit**: YES

- Message: `chore: add lint, format, and typecheck scripts`
- Files: `package.json`

---

### - [x] 1.4. Verificar tsconfig.json Paths

**Qué hacer**:

- Verificar que `tsconfig.json` tiene paths alias configurados
- Debe incluir: `@/*` → `./src/*`
- Si falta, agregarlo

**Qué NO hacer**:

- No cambiar otras configuraciones de TypeScript
- No agregar nuevos paths innecesarios

**Perfil de Agente Recomendado**:

- **Categoría**: `quick`
- **Skills**: [] (ninguna requerida)

**Parallelización**:

- **Can Run In Parallel**: SÍ (con 1.1, 1.2, 1.3, 1.5)
- **Parallel Group**: Fase 1
- **Blocks**: None
- **Blocked By**: Fase 0 completa

**Referencias**:

- `tsconfig.json` - Configuración actual
- `src/pages/index.astro:7` - Usa imports con `@/`

**Criterios de Aceptación**:

- [ ] `@/*` alias está configurado
- [ ] Imports con `@/` funcionan

**QA Scenarios**:

```
Scenario: TypeScript resuelve aliases
  Tool: Bash
  Preconditions: tsconfig.json verificado
  Steps:
    1. npx tsc --noEmit
    2. Verificar que no hay errores de "Cannot find module '@/..."
  Expected Result: TypeScript compila sin errores de module resolution
  Failure Indicators: "Cannot find module '@/..."
  Evidence: .sisyphus/evidence/task-1.4-tsconfig.txt
```

**Commit**: YES (solo si se hicieron cambios)

- Message: `fix(tsconfig): ensure path aliases are configured`
- Files: `tsconfig.json`

---

### - [x] 1.5. Verificar Build Completo

**Qué hacer**:

- Ejecutar `npm run build`
- Verificar que completa sin errores
- Verificar que `dist/` se genera con archivos

**Qué NO hacer**:

- No modificar código para arreglar errores de build (reportarlos)
- No cambiar configuración de build

**Perfil de Agente Recomendado**:

- **Categoría**: `quick`
- **Skills**: [] (ninguna requerida)

**Parallelización**:

- **Can Run In Parallel**: NO (debe ir al final de Fase 1)
- **Parallel Group**: Sequential (al final)
- **Blocks**: Fase 2
- **Blocked By**: 1.1, 1.2, 1.3, 1.4

**Referencias**:

- `astro.config.mjs` - Configuración de build
- `package.json:9` - Script `build`

**Criterios de Aceptación**:

- [ ] `npm run build` completa sin errores
- [ ] Directorio `dist/` existe y tiene archivos

**QA Scenarios**:

```
Scenario: Build de producción funciona
  Tool: Bash
  Preconditions: Fase 0 y 1.1-1.4 completas
  Steps:
    1. npm run build
    2. ls dist/
  Expected Result: Build completa, dist/ contiene archivos HTML/CSS/JS
  Failure Indicators: Build errors, empty dist/
  Evidence: .sisyphus/evidence/task-1.5-build.txt
```

**Commit**: NO (solo verificación)

---

## FASE 2: GOOGLE SHEETS WEBHOOK (2 días)

### - [x] 2.1. Crear Google Apps Script

**Qué hacer**:

- Crear script de Google Apps Script para recibir webhooks
- El script debe:
  - Recibir POST con datos del lead
  - Agregar fila a Google Sheet
  - Retornar success/error
- Documentar cómo configurar en Google Sheets

**Qué NO hacer**:

- No agregar autenticación compleja al script
- No crear múltiples hojas o estructuras complejas

**Perfil de Agente Recomendado**:

- **Categoría**: `quick`
- **Skills**: [] (ninguna requerida)

**Parallelización**:

- **Can Run In Parallel**: SÍ (con 2.2, 2.3, 2.4)
- **Parallel Group**: Fase 2
- **Blocks**: None
- **Blocked By**: Fase 0, Fase 1

**Referencias**:

- Estructura de lead en `convex/schema.ts`
- https://developers.google.com/apps-script/guides/web - Web app docs

**Criterios de Aceptación**:

- [ ] Script de Apps Script creado
- [ ] Instrucciones de setup documentadas
- [ ] Script recibe POST y responde

**QA Scenarios**:

```
Scenario: Apps Script responde a POST
  Tool: Bash (curl)
  Preconditions: Script desplegado en Google Apps Script
  Steps:
    1. curl -X POST [SCRIPT_URL] -H "Content-Type: application/json" -d '{"nombre":"Test","telefono":"+56912345678"}'
  Expected Result: Response 200 con mensaje de éxito
  Failure Indicators: 403, 500, o respuesta de error
  Evidence: .sisyphus/evidence/task-2.1-apps-script.txt
```

**Commit**: NO (archivo externo, documentar en README)

---

### - [x] 2.2. Crear Endpoint /api/webhooks/sheets

**Qué hacer**:

- Crear `src/pages/api/webhooks/sheets.ts`
- Endpoint que:
  - Recibe notificación de nuevo lead
  - Hace POST al Google Apps Script
  - Maneja errores gracefully
- Puede ser llamado desde createLead o como reacción

**Qué NO hacer**:

- No exponer credenciales en el código
- No crear endpoints adicionales innecesarios

**Perfil de Agente Recomendado**:

- **Categoría**: `quick`
- **Skills**: [] (ninguna requerida)

**Parallelización**:

- **Can Run In Parallel**: SÍ (con 2.1, 2.3, 2.4)
- **Parallel Group**: Fase 2
- **Blocks**: 2.3
- **Blocked By**: Fase 0, Fase 1

**Referencias**:

- `convex/leads.ts` - Función createLead
- https://docs.astro.build/en/guides/endpoints/ - Astro API endpoints

**Criterios de Aceptación**:

- [ ] Endpoint `/api/webhooks/sheets` existe
- [ ] Acepta POST requests
- [ ] Retorna JSON con status

**QA Scenarios**:

```
Scenario: Endpoint webhook funciona
  Tool: Bash (curl)
  Preconditions: npm run dev corriendo
  Steps:
    1. curl -X POST http://localhost:4321/api/webhooks/sheets -H "Content-Type: application/json" -d '{"nombre":"Test Lead"}'
  Expected Result: Response 200 con {success: true} o error manejado
  Failure Indicators: 404, 500, crash
  Evidence: .sisyphus/evidence/task-2.2-endpoint.txt

Scenario: Error handling
  Tool: Bash (curl)
  Preconditions: npm run dev corriendo
  Steps:
    1. curl -X POST http://localhost:4321/api/webhooks/sheets (sin body)
  Expected Result: Response con error manejado, no crash
  Failure Indicators: 500 internal server error
  Evidence: .sisyphus/evidence/task-2.2-error.txt
```

**Commit**: YES

- Message: `feat: add Google Sheets webhook endpoint`
- Files: `src/pages/api/webhooks/sheets.ts`

---

### - [x] 2.3. Modificar createLead para Disparar Webhook

**Qué hacer**:

- Modificar `convex/leads.ts` función `createLead`
- Después de guardar el lead, disparar llamada al webhook
- Usar Convex action para HTTP requests (o alternativa)
- Manejar errores sin afectar el guardado del lead

**Qué NO hacer**:

- No bloquear el guardado del lead si el webhook falla
- No agregar lógica compleja de reintentos

**Perfil de Agente Recomendado**:

- **Categoría**: `quick`
- **Skills**: [] (ninguna requerida)

**Parallelización**:

- **Can Run In Parallel**: SÍ (con 2.1, 2.2, 2.4)
- **Parallel Group**: Fase 2
- **Blocks**: None
- **Blocked By**: 2.2

**Referencias**:

- `convex/leads.ts` - Función createLead actual
- https://docs.convex.dev/functions/actions - Convex actions para HTTP

**Criterios de Aceptación**:

- [ ] createLead dispara webhook después de guardar
- [ ] Webhook falla no impide guardar lead
- [ ] Nuevo lead aparece en Google Sheet

**QA Scenarios**:

```
Scenario: Lead se guarda Y aparece en Google Sheets
  Tool: Browser
  Preconditions: npm run dev, Google Sheet configurado
  Steps:
    1. Navegar a http://localhost:4321/cotizar
    2. Llenar formulario con datos de test
    3. Enviar formulario
    4. Verificar en Convex dashboard que lead existe
    5. Verificar en Google Sheet que fila aparece
  Expected Result: Lead guardado en Convex Y en Google Sheet
  Failure Indicators: Lead guardado pero no en Sheet, o error al guardar
  Evidence: .sisyphus/evidence/task-2.3-e2e.png
```

**Commit**: YES

- Message: `feat: trigger Google Sheets webhook on new lead`
- Files: `convex/leads.ts`

---

### - [x] 2.4. Documentar Setup en README

**Qué hacer**:

- Crear o actualizar sección en README.md
- Documentar:
  - Cómo crear Google Sheet
  - Cómo crear Apps Script
  - Variables de entorno necesarias
  - Cómo probar el webhook

**Qué NO hacer**:

- No documentar features no implementadas
- No crear documentación excesivamente detallada

**Perfil de Agente Recomendado**:

- **Categoría**: `writing`
- \*\*Skills`: [] (ninguna requerida)

**Parallelización**:

- **Can Run In Parallel**: SÍ (con 2.1, 2.2, 2.3)
- **Parallel Group**: Fase 2
- **Blocks**: None
- **Blocked By**: Fase 0, Fase 1

**Referencias**:

- `README.md` si existe
- Estructura del proyecto

**Criterios de Aceptación**:

- [ ] README tiene sección de Google Sheets setup
- [ ] Instrucciones son reproducibles

**QA Scenarios**:

```
Scenario: Documentación es legible
  Tool: Read + verificación manual
  Preconditions: README actualizado
  Steps:
    1. Leer README.md
    2. Verificar que sección "Google Sheets Integration" existe
    3. Verificar que pasos son claros
  Expected Result: Documentación existe y es comprensible
  Evidence: .sisyphus/evidence/task-2.4-readme.txt
```

**Commit**: YES

- Message: `docs: add Google Sheets webhook setup instructions`
- Files: `README.md`

---

## FASE 3: BLOG (3 días)

### - [x] 3.1. Crear Estructura de Contenido Blog

**Qué hacer**:

- Crear directorio `src/content/blog/` si no existe
- Crear `src/content/config.ts` con schema para blog posts
- Definir campos: title, description, pubDate, author, image, tags

**Qué NO hacer**:

- No crear sistema de categorías complejo
- No agregar features de comentarios o likes

**Perfil de Agente Recomendado**:

- **Categoría**: `quick`
- **Skills**: [] (ninguna requerida)

**Parallelización**:

- **Can Run In Parallel**: SÍ (con 3.2, 3.3)
- **Parallel Group**: Fase 3
- **Blocks**: 3.4-3.8
- **Blocked By**: Fase 0

**Referencias**:

- https://docs.astro.build/en/guides/content-collections/ - Content Collections
- `src/content/` - Directorio existente

**Criterios de Aceptación**:

- [ ] `src/content/blog/` existe
- [ ] `src/content/config.ts` define schema de blog
- [ ] TypeScript reconoce el schema

**QA Scenarios**:

```
Scenario: Content collection configurada
  Tool: Bash
  Preconditions: Estructura creada
  Steps:
    1. npm run build
    2. Verificar que content collections compilan
  Expected Result: Build pasa sin errores de content
  Failure Indicators: "Content collection not found", schema errors
  Evidence: .sisyphus/evidence/task-3.1-content.txt
```

**Commit**: YES

- Message: `feat: add blog content collection structure`
- Files: `src/content/config.ts`

---

### - [x] 3.2. Crear Página /blog/index.astro

**Qué hacer**:

- Crear `src/pages/blog/index.astro`
- Listar todos los artículos del blog
- Mostrar: título, descripción, fecha, imagen
- Link a cada artículo individual

**Qué NO hacer**:

- No agregar paginación (solo hay 5 artículos)
- No agregar filtros o búsqueda

**Perfil de Agente Recomendado**:

- **Categoría**: `quick`
- **Skills**: [] (ninguna requerida)

**Parallelización**:

- **Can Run In Parallel**: SÍ (con 3.1, 3.3)
- **Parallel Group**: Fase 3
- **Blocks**: None
- **Blocked By**: 3.1

**Referencias**:

- `src/pages/index.astro` - Patrón de página existente
- `src/components/ui/Card.astro` - Componente de tarjeta

**Criterios de Aceptación**:

- [ ] `/blog` renderiza sin errores
- [ ] Lista artículos (aunque estén vacíos inicialmente)

**QA Scenarios**:

```
Scenario: Blog index renderiza
  Tool: Browser
  Preconditions: npm run dev, 3.1 completado
  Steps:
    1. Navegar a http://localhost:4321/blog
    2. Verificar que página carga
  Expected Result: Página de blog visible
  Failure Indicators: 404, blank page, error
  Evidence: .sisyphus/evidence/task-3.2-index.png
```

**Commit**: YES

- Message: `feat: add blog index page`
- Files: `src/pages/blog/index.astro`

---

### - [x] 3.3. Crear Plantilla /blog/[slug].astro

**Qué hacer**:

- Crear `src/pages/blog/[slug].astro`
- Mostrar artículo completo
- Incluir: título, fecha, autor, contenido, tags
- Agregar Schema.org Article

**Qué NO hacer**:

- No agregar comentarios
- No agregar "artículos relacionados"

**Perfil de Agente Recomendado**:

- **Categoría**: `quick`
- **Skills**: [] (ninguna requerida)

**Parallelización**:

- **Can Run In Parallel**: SÍ (con 3.1, 3.2)
- **Parallel Group**: Fase 3
- **Blocks**: 3.4-3.8
- **Blocked By**: 3.1, 3.2

**Referencias**:

- `src/pages/servicios/[slug].astro` - Patrón de página dinámica
- `src/components/seo/` - Componentes Schema.org

**Criterios de Aceptación**:

- [ ] `/blog/[slug]` renderiza artículos
- [ ] Schema.org Article incluido
- [ ] Meta tags SEO configurados

**QA Scenarios**:

```
Scenario: Blog post renderiza
  Tool: Browser
  Preconditions: npm run dev, al menos 1 artículo creado
  Steps:
    1. Navegar a http://localhost:4321/blog/[primer-articulo]
    2. Verificar contenido del artículo
    3. Verificar meta tags en <head>
  Expected Result: Artículo visible con formato correcto
  Failure Indicators: 404, contenido vacío, sin estilo
  Evidence: .sisyphus/evidence/task-3.3-post.png
```

**Commit**: YES

- Message: `feat: add blog post template with SEO`
- Files: `src/pages/blog/[slug].astro`

---

### - [x] 3.4. Escribir Artículo 1: Seguridad en Condominios

**Qué hacer**:

- Crear `src/content/blog/seguridad-condominios.mdx`
- Tema: Importancia de la seguridad en condominios residenciales
- Longitud: 800-1200 palabras
- Incluir: tips, estadísticas, llamada a la acción

**Qué NO hacer**:

- No hacer publicidad excesiva
- No copiar contenido de otros sitios

**Perfil de Agente Recomendado**:

- **Categoría**: `writing`
- **Skills**: [] (ninguna requerida)

**Parallelización**:

- **Can Run In Parallel**: SÍ (con 3.5-3.8)
- **Parallel Group**: Fase 3 (artículos)
- **Blocks**: None
- **Blocked By**: 3.1, 3.3

**Referencias**:

- `src/data/services.ts` - Info de servicios
- Sitio web de Guardman para contexto

**Criterios de Aceptación**:

- [ ] Artículo existe y tiene >800 palabras
- [ ] Renderiza correctamente en `/blog/seguridad-condominios`

**QA Scenarios**:

```
Scenario: Artículo visible y legible
  Tool: Browser
  Preconditions: npm run dev, artículo creado
  Steps:
    1. Navegar a http://localhost:4321/blog/seguridad-condominios
    2. Verificar que texto es legible
    3. Verificar que formato es correcto
  Expected Result: Artículo completo visible
  Evidence: .sisyphus/evidence/task-3.4-articulo1.png
```

**Commit**: YES

- Message: `content: add blog article about condominium security`
- Files: `src/content/blog/seguridad-condominios.mdx`

---

### - [x] 3.5. Escribir Artículo 2: Guardias OS10

**Qué hacer**:

- Crear `src/content/blog/guardias-os10-certificados.mdx`
- Tema: Qué es la certificación OS10 y por qué importa
- Longitud: 800-1200 palabras

**Qué NO hacer**:

- No información sensible sobre procedimientos
- No prometer servicios no ofrecidos

**Perfil de Agente Recomendado**:

- **Categoría**: `writing`
- **Skills**: [] (ninguna requerida)

**Parallelización**:

- **Can Run In Parallel**: SÍ (con 3.4, 3.6-3.8)
- **Parallel Group**: Fase 3 (artículos)
- **Blocks**: None
- **Blocked By**: 3.1, 3.3

**Criterios de Aceptación**:

- [ ] Artículo existe y tiene >800 palabras
- [ ] Explica claramente OS10

**QA Scenarios**:

- Verificar en `/blog/guardias-os10-certificados`

**Commit**: YES

- Message: `content: add blog article about OS10 certification`
- Files: `src/content/blog/guardias-os10-certificados.mdx`

---

### - [x] 3.6. Escribir Artículo 3: Alarmas Ajax

**Qué hacer**:

- Crear `src/content/blog/alarmas-ajax-tecnologia.mdx`
- Tema: Beneficios de las alarmas inalámbricas Ajax
- Longitud: 800-1200 palabras

**Perfil de Agente Recomendado**:

- **Categoría**: `writing`

**Parallelización**:

- **Can Run In Parallel**: SÍ
- **Parallel Group**: Fase 3 (artículos)

**Criterios de Aceptación**:

- [ ] Artículo existe y tiene >800 palabras

**QA Scenarios**:

- Verificar en `/blog/alarmas-ajax-tecnologia`

**Commit**: YES

- Message: `content: add blog article about Ajax alarms`
- Files: `src/content/blog/alarmas-ajax-tecnologia.mdx`

---

### - [x] 3.7. Escribir Artículo 4: Patrullaje Nocturno

**Qué hacer**:

- Crear `src/content/blog/patrullaje-condominios.mdx`
- Tema: Ventajas del servicio de patrullaje
- Longitud: 800-1200 palabras

**Perfil de Agente Recomendado**:

- **Categoría**: `writing`

**Parallelización**:

- **Can Run In Parallel**: SÍ
- **Parallel Group**: Fase 3 (artículos)

**Criterios de Aceptación**:

- [ ] Artículo existe y tiene >800 palabras

**QA Scenarios**:

- Verificar en `/blog/patrullaje-condominios`

**Commit**: YES

- Message: `content: add blog article about night patrol`
- Files: `src/content/blog/patrullaje-condominios.mdx`

---

### - [x] 3.8. Escribir Artículo 5: GuardPod Beneficios

**Qué hacer**:

- Crear `src/content/blog/guardpod-modulos-seguridad.mdx`
- Tema: Solución GuardPod para obras y minería
- Longitud: 800-1200 palabras

**Perfil de Agente Recomendado**:

- **Categoría**: `writing`

**Parallelización**:

- **Can Run In Parallel**: SÍ
- **Parallel Group**: Fase 3 (artículos)

**Criterios de Aceptación**:

- [ ] Artículo existe y tiene >800 palabras

**QA Scenarios**:

- Verificar en `/blog/guardpod-modulos-seguridad`

**Commit**: YES

- Message: `content: add blog article about GuardPod modules`
- Files: `src/content/blog/guardpod-modulos-seguridad.mdx`

---

## FASE 4: SEO CIUDADES (2 días)

### - [x] 4.1. Verificar Estructura de locations.ts

**Qué hacer**:

- Revisar `src/data/locations.ts`
- Verificar que tiene datos de regiones y ciudades
- Si hay errores de TypeScript, corregirlos

**Qué NO hacer**:

- No agregar nuevas ciudades (usar las existentes)
- No cambiar la estructura de datos

**Perfil de Agente Recomendado**:

- **Categoría**: `quick`

**Parallelización**:

- **Can Run In Parallel**: SÍ (con 4.2-4.5)
- **Parallel Group**: Fase 4

**Criterios de Aceptación**:

- [ ] `locations.ts` compila sin errores
- [ ] Exporta datos de regiones y ciudades

**QA Scenarios**:

```
Scenario: Locations data es válida
  Tool: Bash
  Steps:
    1. npx tsc --noEmit
    2. Verificar sin errores en locations.ts
  Expected Result: TypeScript pasa
  Evidence: .sisyphus/evidence/task-4.1-locations.txt
```

**Commit**: YES (solo si hay fixes)

- Message: `fix(data): resolve TypeScript errors in locations`

---

### - [x] 4.2. Crear Página Región Dinámica

**Qué hacer**:

- Crear o verificar `src/pages/cobertura/[region]/index.astro`
- Listar ciudades de la región
- Mostrar información de la región
- SEO meta tags

**Perfil de Agente Recomendado**:

- **Categoría**: `quick`

**Parallelización**:

- **Can Run In Parallel**: SÍ

**Criterios de Aceptación**:

- [ ] `/cobertura/metropolitana` renderiza
- [ ] Lista ciudades de la región

**QA Scenarios**:

```
Scenario: Página de región funciona
  Tool: Browser
  Steps:
    1. Navegar a http://localhost:4321/cobertura/metropolitana
  Expected Result: Página con ciudades de RM
  Evidence: .sisyphus/evidence/task-4.2-region.png
```

**Commit**: YES

- Message: `feat: add dynamic region pages for SEO`
- Files: `src/pages/cobertura/[region]/index.astro`

---

### - [x] 4.3. Crear Página Ciudad Dinámica

**Qué hacer**:

- Crear o verificar `src/pages/cobertura/[region]/[ciudad].astro`
- Contenido específico de la ciudad
- LocalBusiness Schema
- CTAs para cotizar

**Perfil de Agente Recomendado**:

- **Categoría**: `quick`

**Parallelización**:

- **Can Run In Parallel**: SÍ

**Criterios de Aceptación**:

- [ ] `/cobertura/metropolitana/santiago` renderiza
- [ ] Schema LocalBusiness incluido

**QA Scenarios**:

```
Scenario: Página de ciudad funciona
  Tool: Browser
  Steps:
    1. Navegar a http://localhost:4321/cobertura/metropolitana/santiago
    2. Verificar Schema en <script type="application/ld+json">
  Expected Result: Página con Schema LocalBusiness
  Evidence: .sisyphus/evidence/task-4.3-ciudad.png
```

**Commit**: YES

- Message: `feat: add dynamic city pages with LocalBusiness schema`
- Files: `src/pages/cobertura/[region]/[ciudad].astro`

---

### - [x] 4.4. Agregar LocalBusiness Schema

**Qué hacer**:

- Usar o crear componente LocalBusinessSchema
- Incluir en páginas de ciudades
- Datos: nombre, dirección, teléfono, horarios

**Perfil de Agente Recomendado**:

- **Categoría**: `quick`

**Parallelización**:

- **Can Run In Parallel**: SÍ

**Criterios de Aceptación**:

- [ ] Schema válido según Google Rich Results Test

**QA Scenarios**:

```
Scenario: Schema es válido
  Tool: Browser + Rich Results Test
  Steps:
    1. Ver página de ciudad
    2. Copiar Schema JSON
    3. Validar en Google Rich Results Test
  Expected Result: Schema pasa validación
  Evidence: .sisyphus/evidence/task-4.4-schema.txt
```

**Commit**: YES

- Message: `feat: add LocalBusiness schema to city pages`

---

### - [x] 4.5. Crear Índice de Cobertura

**Qué hacer**:

- Crear o verificar `src/pages/cobertura/index.astro`
- Listar todas las regiones
- Mapa visual si es posible (opcional)

**Perfil de Agente Recomendado**:

- **Categoría**: `quick`

**Parallelización**:

- **Can Run In Parallel**: SÍ

**Criterios de Aceptación**:

- [ ] `/cobertura` renderiza todas las regiones

**QA Scenarios**:

```
Scenario: Índice de cobertura funciona
  Tool: Browser
  Steps:
    1. Navegar a http://localhost:4321/cobertura
  Expected Result: Lista de regiones con links
  Evidence: .sisyphus/evidence/task-4.5-coverage.png
```

**Commit**: YES

- Message: `feat: add coverage index page`
- Files: `src/pages/cobertura/index.astro`

---

## FASE 5: PANEL ADMIN (3 días)

### - [x] 5.1. Crear Layout Admin con Auth Simple

**Qué hacer**:

- Crear `src/layouts/AdminLayout.astro`
- Implementar password simple (cookie o sessionStorage)
- Redirigir a login si no autenticado
- Password hardcodeado para MVP (ej: env variable)

**Qué NO hacer**:

- No implementar JWT o sesiones complejas
- No agregar múltiples usuarios

**Perfil de Agente Recomendado**:

- **Categoría**: `quick`

**Parallelización**:

- **Can Run In Parallel**: SÍ (con 5.2)
- **Parallel Group**: Fase 5
- **Blocks**: 5.3-5.6

**Referencias**:

- `src/layouts/BaseLayout.astro` - Layout existente
- Usar Astro middleware para auth check

**Criterios de Aceptación**:

- [ ] Layout protege rutas `/admin/*`
- [ ] Login funciona con password

**QA Scenarios**:

```
Scenario: Auth simple funciona
  Tool: Browser
  Steps:
    1. Navegar a http://localhost:4321/admin/leads
    2. Verificar redirección a login
    3. Ingresar password correcto
    4. Verificar acceso a /admin/leads
  Expected Result: Login redirige a admin
  Failure Indicators: Acceso sin login, login no funciona
  Evidence: .sisyphus/evidence/task-5.1-auth.png
```

**Commit**: YES

- Message: `feat: add admin layout with simple password auth`
- Files: `src/layouts/AdminLayout.astro`, `src/middleware.ts`

---

### - [x] 5.2. Crear Página /admin/login.astro

**Qué hacer**:

- Crear formulario de login simple
- Campo: password
- Al enviar: verificar y setear cookie/sessionStorage
- Redirigir a /admin/leads

**Perfil de Agente Recomendado**:

- **Categoría**: `quick`

**Parallelización**:

- **Can Run In Parallel**: SÍ (con 5.1)

**Criterios de Aceptación**:

- [ ] `/admin/login` renderiza formulario
- [ ] Password correcto da acceso

**QA Scenarios**:

```
Scenario: Login funciona
  Tool: Browser
  Steps:
    1. Navegar a /admin/login
    2. Ingresar password incorrecto
    3. Ver mensaje de error
    4. Ingresar password correcto
    5. Verificar redirección
  Expected Result: Password correcto da acceso
  Evidence: .sisyphus/evidence/task-5.2-login.png
```

**Commit**: YES

- Message: `feat: add admin login page`
- Files: `src/pages/admin/login.astro`

---

### - [x] 5.3. Crear Página /admin/leads.astro

**Qué hacer**:

- Crear página de listado de leads
- Mostrar: nombre, teléfono, email, servicio, ciudad, fecha, estado
- Usar Convex query existente: `getLeads`
- Tabla responsiva con diseño limpio

**Qué NO hacer**:

- No agregar funcionalidad de editar/eliminar (read-only)
- No agregar export (tarea separada)

**Perfil de Agente Recomendado**:

- **Categoría**: `unspecified-high`
- **Skills**: [] (ninguna requerida, pero experiencia UI ayuda)

**Parallelización**:

- **Can Run In Parallel**: NO (depende de 5.1, 5.2)
- **Parallel Group**: Sequential
- **Blocked By**: 5.1, 5.2

**Referencias**:

- `convex/leads.ts` - Query getLeads
- `src/components/forms/LeadForm.tsx` - Estructura de datos

**Criterios de Aceptación**:

- [ ] `/admin/leads` muestra lista de leads
- [ ] Tabla es legible y responsiva

**QA Scenarios**:

```
Scenario: Leads se listan
  Tool: Browser
  Preconditions: Al menos 1 lead en la DB
  Steps:
    1. Login a admin
    2. Navegar a /admin/leads
    3. Verificar que leads aparecen
  Expected Result: Tabla con leads visibles
  Failure Indicators: Tabla vacía, error de carga
  Evidence: .sisyphus/evidence/task-5.3-leads-list.png

Scenario: Sin leads muestra mensaje
  Tool: Browser
  Preconditions: DB vacía de leads
  Steps:
    1. Login a admin
    2. Navegar a /admin/leads
  Expected Result: Mensaje "No hay leads"
  Evidence: .sisyphus/evidence/task-5.3-no-leads.png
```

**Commit**: YES

- Message: `feat: add admin leads list page`
- Files: `src/pages/admin/leads.astro`

---

### - [x] 5.4. Agregar Filtros por Estado/Fecha

**Qué hacer**:

- Agregar dropdown de filtro por estado (nuevo, contactado, cerrado)
- Agregar selector de rango de fechas
- Filtros aplican a la query de Convex

**Perfil de Agente Recomendado**:

- **Categoría**: `quick`

**Parallelización**:

- **Can Run In Parallel**: SÍ (con 5.5, 5.6)
- **Blocked By**: 5.3

**Criterios de Aceptación**:

- [ ] Filtro por estado funciona
- [ ] Filtro por fecha funciona

**QA Scenarios**:

```
Scenario: Filtro por estado funciona
  Tool: Browser
  Steps:
    1. En /admin/leads, seleccionar estado "nuevo"
    2. Verificar que solo leads nuevos aparecen
  Expected Result: Lista filtrada correctamente
  Evidence: .sisyphus/evidence/task-5.4-filter.png
```

**Commit**: YES

- Message: `feat: add filters to admin leads list`
- Files: `src/pages/admin/leads.astro`

---

### - [x] 5.5. Agregar Paginación

**Qué hacer**:

- Implementar paginación (10-25 leads por página)
- Botones anterior/siguiente
- Indicador de página actual

**Perfil de Agente Recomendado**:

- **Categoría**: `quick`

**Parallelización**:

- **Can Run In Parallel**: SÍ (con 5.4, 5.6)
- **Blocked By**: 5.3

**Criterios de Aceptación**:

- [ ] Paginación funciona con muchos leads
- [ ] Navegación entre páginas correcta

**QA Scenarios**:

```
Scenario: Paginación funciona
  Tool: Browser
  Preconditions: >25 leads en DB
  Steps:
    1. Ver primera página de leads
    2. Click "Siguiente"
    3. Verificar segunda página
  Expected Result: Navegación correcta
  Evidence: .sisyphus/evidence/task-5.5-pagination.png
```

**Commit**: YES

- Message: `feat: add pagination to admin leads`
- Files: `src/pages/admin/leads.astro`

---

### - [x] 5.6. Agregar Botón Exportar CSV

**Qué hacer**:

- Agregar botón "Exportar CSV"
- Generar archivo CSV con leads filtrados
- Descarga automática del archivo

**Perfil de Agente Recomendado**:

- **Categoría**: `quick`

**Parallelización**:

- **Can Run In Parallel**: SÍ (con 5.4, 5.5)
- **Blocked By**: 5.3

**Criterios de Aceptación**:

- [ ] Click en exportar descarga archivo CSV
- [ ] CSV tiene columnas correctas

**QA Scenarios**:

```
Scenario: Exportar CSV funciona
  Tool: Browser
  Steps:
    1. Click en "Exportar CSV"
    2. Verificar descarga de archivo
    3. Abrir CSV y verificar contenido
  Expected Result: CSV descargado con datos
  Evidence: .sisyphus/evidence/task-5.6-export.csv
```

**Commit**: YES

- Message: `feat: add CSV export to admin leads`
- Files: `src/pages/admin/leads.astro`

---

## FASE 6: OPTIMIZACIÓN (2 días)

### - [x] 6.1. Verificar Performance con Lighthouse

**Qué hacer**:

- Correr Lighthouse en homepage y páginas principales
- Documentar scores actuales
- Identificar mejoras de bajo esfuerzo

**Perfil de Agente Recomendado**:

- **Categoría**: `quick`

**Parallelización**:

- **Can Run In Parallel**: SÍ (con 6.2-6.4)

**Criterios de Aceptación**:

- [ ] Scores documentados
- [ ] Mejoras identificadas

**QA Scenarios**:

```
Scenario: Lighthouse corre
  Tool: Browser DevTools
  Steps:
    1. Abrir DevTools > Lighthouse
    2. Correr audit en homepage
    3. Documentar scores
  Expected Result: Scores para Performance, SEO, Accessibility, Best Practices
  Evidence: .sisyphus/evidence/task-6.1-lighthouse.txt
```

**Commit**: NO (solo documentación)

---

### - [x] 6.2. Optimizar Imágenes si es Necesario

**Qué hacer**:

- Verificar uso de imágenes optimizadas
- Convertir a WebP si es necesario
- Agregar lazy loading

**Perfil de Agente Recomendado**:

- **Categoría**: `quick`

**Parallelización**:

- **Can Run In Parallel**: SÍ

**Criterios de Aceptación**:

- [ ] Imágenes tienen lazy loading
- [ ] Formatos optimizados

**QA Scenarios**:

```
Scenario: Imágenes son optimizadas
  Tool: Browser DevTools
  Steps:
    1. Inspeccionar imágenes
    2. Verificar loading="lazy"
    3. Verificar formatos
  Expected Result: Imágenes con lazy loading
  Evidence: .sisyphus/evidence/task-6.2-images.txt
```

**Commit**: YES (si hay cambios)

- Message: `perf: optimize images with lazy loading and WebP`

---

### - [x] 6.3. Agregar Meta Tags Faltantes

**Qué hacer**:

- Revisar todas las páginas principales
- Agregar Open Graph tags si faltan
- Agregar Twitter cards
- Verificar canonical URLs

**Perfil de Agente Recomendado**:

- **Categoría**: `quick`

**Parallelización**:

- **Can Run In Parallel**: SÍ

**Criterios de Aceptación**:

- [ ] Open Graph tags presentes
- [ ] Twitter cards configurados
- [ ] Canonical URLs correctos

**QA Scenarios**:

```
Scenario: Meta tags presentes
  Tool: Browser DevTools
  Steps:
    1. Inspeccionar <head>
    2. Verificar og:title, og:description, og:image
  Expected Result: Meta tags completos
  Evidence: .sisyphus/evidence/task-6.3-meta.txt
```

**Commit**: YES

- Message: `seo: add missing meta tags and Open Graph`

---

### - [x] 6.4. Verificar Sitemap Generado

**Qué hacer**:

- Ejecutar build
- Verificar `/sitemap-index.xml` generado
- Verificar que incluye todas las páginas importantes

**Perfil de Agente Recomendado**:

- **Categoría**: `quick`

**Parallelización**:

- **Can Run In Parallel**: SÍ

**Criterios de Aceptación**:

- [ ] Sitemap generado
- [ ] Incluye páginas principales

**QA Scenarios**:

```
Scenario: Sitemap válido
  Tool: Browser
  Steps:
    1. npm run build
    2. Verificar dist/sitemap-index.xml
    3. Verificar URLs incluidas
  Expected Result: Sitemap con todas las páginas
  Evidence: .sisyphus/evidence/task-6.4-sitemap.xml
```

**Commit**: NO (solo verificación)

---

## VERIFICACIÓN FINAL (después de TODAS las fases)

### - [x] F1. Audit de Cumplimiento del Plan — `oracle`

Leer el plan completo. Verificar:

- Todos los "Must Have" implementados
- Todos los "Must NOT Have" respetados
- Archivos de evidencia existen en `.sisyphus/evidence/`

**Output**: `Must Have [N/N] | Must NOT Have [N/N] | VERDICT: APPROVE/REJECT`

---

### - [x] F2. Revisión de Calidad de Código — `unspecified-high`

Ejecutar:

- `npm run typecheck` → debe pasar
- `npm run lint` → debe pasar sin errores críticos
- `npm run build` → debe completar

Revisar archivos cambiados por:

- `as any` o `@ts-ignore`
- Empty catches
- console.log en producción
- Código comentado

**Output**: `Build [PASS/FAIL] | Lint [PASS/FAIL] | Files [N clean/N issues] | VERDICT`

---

### - [x] F3. QA Manual Completo — `unspecified-high`

Desde estado limpio:

1. `npm run dev`
2. Navegar homepage → verificar render
3. Navegar /cotizar → llenar form → verificar envío
4. Navegar /blog → verificar artículos
5. Navegar /cobertura → verificar ciudades
6. Login admin → verificar lista leads
7. Verificar Google Sheet tiene nuevos leads

**Output**: `Scenarios [N/N pass] | Integration [N/N] | VERDICT`

---

### - [x] F4. Verificación de Scope — `deep`

Para cada tarea:

- Leer "Qué hacer"
- Ver diff actual (git)
- Verificar 1:1: todo especificado fue construido, nada extra fue añadido
- Verificar "Qué NO hacer" respetado

**Output**: `Tasks [N/N compliant] | Contamination [CLEAN/N issues] | VERDICT`

---

## Estrategia de Commits

| Después de | Mensaje                                                  | Archivos                         | Verificación         |
| ---------- | -------------------------------------------------------- | -------------------------------- | -------------------- |
| 0.1        | `fix(config): enable SSR for Convex React compatibility` | astro.config.mjs                 | npm run dev          |
| 0.2        | `feat: add ConvexProvider wrapper for React hooks`       | nuevo archivo                    | npm run dev          |
| 0.3        | `fix(data): add category property to FAQ objects`        | src/data/faqs.ts                 | npx tsc --noEmit     |
| 0.4        | `fix(data): add relatedServices to Industry interface`   | src/data/industries.ts           | npx tsc --noEmit     |
| 1.1        | `chore: add Prettier configuration`                      | .prettierrc                      | npm run format:check |
| 1.2        | `chore: add ESLint configuration`                        | eslint.config.mjs                | npm run lint         |
| 1.3        | `chore: add lint, format, and typecheck scripts`         | package.json                     | npm run check        |
| 2.2        | `feat: add Google Sheets webhook endpoint`               | src/pages/api/webhooks/sheets.ts | curl test            |
| 2.3        | `feat: trigger Google Sheets webhook on new lead`        | convex/leads.ts                  | form submission      |
| 2.4        | `docs: add Google Sheets webhook setup instructions`     | README.md                        | read check           |
| 3.1        | `feat: add blog content collection structure`            | src/content/config.ts            | npm run build        |
| 3.2        | `feat: add blog index page`                              | src/pages/blog/index.astro       | browser              |
| 3.3        | `feat: add blog post template with SEO`                  | src/pages/blog/[slug].astro      | browser              |
| 3.4-3.8    | `content: add blog article about [topic]`                | src/content/blog/\*.mdx          | browser              |
| 4.2-4.5    | `feat: add coverage/region/city pages`                   | src/pages/cobertura/\*\*         | browser              |
| 5.1        | `feat: add admin layout with simple password auth`       | src/layouts/AdminLayout.astro    | login test           |
| 5.2        | `feat: add admin login page`                             | src/pages/admin/login.astro      | login test           |
| 5.3        | `feat: add admin leads list page`                        | src/pages/admin/leads.astro      | list test            |
| 5.4-5.6    | `feat: add filters/pagination/export to admin`           | src/pages/admin/leads.astro      | feature test         |

---

## Criterios de Éxito

### Comandos de Verificación

```bash
npm run dev          # Debe iniciar sin errores
npm run build        # Debe completar sin errores
npm run typecheck    # Debe pasar con cero errores
npm run lint         # Debe pasar sin errores críticos
```

### Checklist Final

- [ ] Lead form funciona y guarda en Convex
- [ ] Nuevos leads aparecen en Google Sheet
- [ ] Blog accesible con 5 artículos
- [ ] Páginas de ciudades renderizan con Schema
- [ ] Panel admin accesible con password
- [ ] TypeScript limpio (cero errores)
- [ ] ESLint y Prettier configurados
- [ ] Build de producción funciona
