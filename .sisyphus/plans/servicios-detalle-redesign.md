# Plan: Rediseño de Páginas de Detalle de Servicios y Soluciones

## TL;DR

> **Quick Summary**: Rediseñar las secciones intermedias (entre hero y footer) de las páginas de detalle de servicios (`/servicios/[slug]`) y soluciones (`/soluciones/[slug]`) usando Google Stitch MCP, manteniendo el estilo monocromático premium del home de Guardman.
>
> **Deliverables**:
>
> - 4 nuevos componentes de sección reutilizables
> - 2 páginas de detalle rediseñadas
> - 6 diseños generados en Stitch
>
> **Estimated Effort**: Medium
> **Parallel Execution**: YES - 3 waves
> **Critical Path**: Diseño Stitch → Componentes UI → Integración páginas

---

## Context

### Original Request

Rediseñar las secciones intermedias de las páginas de detalle de servicios (como `/servicios/guardias-seguridad`) y soluciones, usando el proyecto de Stitch existente y manteniendo consistencia con el estilo del home de Guardman.

### Interview Summary

**Key Discussions**:

- **Páginas**: Ambas páginas de detalle (servicios/[slug] y soluciones/[slug])
- **Enfoque**: Google Stitch MCP para generar diseños nuevos
- **Secciones**: Todas las intermedias (Features/Challenges, Benefits/Solutions, Related Services, CTA)
- **Estilo**: Monocromático premium consistente con el home de Guardman
- **Proyecto Stitch**: Usar existente 5685155227603413257

**Research Findings**:

- Tech stack: Astro 5 + Tailwind CSS + React + Convex
- Componentes existentes: BenefitsSection, CTASection, ProcessSection, IndustryGrid
- Datos Convex: services (features[], benefits[], cta), solutions (challenges[], solutions[], relatedServices[])
- Patrones de Stitch: prompts <5000 chars, un cambio por iteración, usar "minimalist monochrome"

### Metis Review

**Identified Gaps** (addressed):

- **Data format**: Componentes aceptarán `string[]` (no cambiar schema Convex) → RESUELTO
- **Icons**: Usar mismo icono (shield-check) para consistencia → RESUELTO
- **Stitch prompts**: Incluir "minimalist monochrome, black/white, premium feel" en cada prompt → GUARDRAIL
- **Existing Stitch screens**: Analizar pantallas existentes antes de generar nuevas → INCLUIDO EN PLAN

---

## Work Objectives

### Core Objective

Rediseñar las secciones intermedias de las páginas de detalle de servicios y soluciones, creando componentes reutilizables con diseños generados por Stitch, manteniendo el estilo monocromático premium del home.

### Concrete Deliverables

- `src/components/sections/FeaturesSection.astro` - Grid de características/features
- `src/components/sections/ChallengesSection.astro` - Grid de desafíos/pain points
- `src/components/sections/SolutionsListSection.astro` - Grid de soluciones/estrategias
- `src/components/sections/RelatedServicesSection.astro` - Grid de servicios relacionados
- `src/pages/servicios/[slug].astro` - Página rediseñada
- `src/pages/soluciones/[slug].astro` - Página rediseñada

### Definition of Done

- [x] `npm run build` completa sin errores
- [x] `npm run typecheck` pasa sin errores
- [x] Todos los componentes nuevos renderizan correctamente
- [x] Secciones inline reemplazadas por componentes reutilizables
- [x] Estilo visual coherente con el home de Guardman

### Must Have

- Componentes que acepten datos `string[]` de Convex (sin cambiar schema)
- Diseños monocromáticos premium generados por Stitch
- Hero sections sin cambios
- Estilo consistente con el home (negro/blanco/grises)

### Must NOT Have (Guardrails)

- NO modificar Hero sections (servicios: líneas 38-88, soluciones: líneas 48-76)
- NO modificar Footer
- NO modificar schema o queries de Convex
- NO usar prompts Stitch >5000 caracteres
- NO mezclar cambios de layout y UI en un mismo prompt Stitch
- NO agregar nuevos iconos - usar Icon.astro existente (shield-check)
- NO agregar librerías de animación

---

## Verification Strategy (MANDATORY)

> **ZERO HUMAN INTERVENTION** — Verificación mediante comandos y herramientas.

### Test Decision

- **Infrastructure exists**: NO (no hay tests automatizados)
- **Automated tests**: None
- **Framework**: N/A
- **QA Policy**: Verificación manual por desarrollador

### QA Policy

Verificación mediante:

1. Build verification: `npm run build && npm run typecheck`
2. Preview visual: `npm run preview` y revisión manual
3. Navegación: Verificar contenido dinámico

| Deliverable Type | Verification Tool | Method                               |
| ---------------- | ----------------- | ------------------------------------ |
| Build            | Bash              | `npm run build` exit code 0          |
| Types            | Bash              | `npm run typecheck` sin errores      |
| Visual           | Bash + Browser    | `npm run preview` + revisión manual  |
| Content          | Browser           | Verificar datos de Convex renderizan |

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Diseño Stitch - 6 diseños en paralelo):
├── Task 1: Analizar pantallas Stitch existentes [quick]
├── Task 2: Diseñar FeaturesSection en Stitch [quick]
├── Task 3: Diseñar ChallengesSection en Stitch [quick]
├── Task 4: Diseñar SolutionsListSection en Stitch [quick]
├── Task 5: Diseñar RelatedServicesSection en Stitch [quick]
└── Task 6: Diseñar CTASection variante en Stitch [quick]

Wave 2 (Componentes UI - 4 en paralelo):
├── Task 7: Implementar FeaturesSection.astro (depends: 2) [quick]
├── Task 8: Implementar ChallengesSection.astro (depends: 3) [quick]
├── Task 9: Implementar SolutionsListSection.astro (depends: 4) [quick]
└── Task 10: Implementar RelatedServicesSection.astro (depends: 5) [quick]

Wave 3 (Integración páginas - 2 en paralelo):
├── Task 11: Rediseñar servicios/[slug].astro (depends: 7) [unspecified-high]
└── Task 12: Rediseñar soluciones/[slug].astro (depends: 8, 9, 10) [unspecified-high]

Wave FINAL (Verificación - 4 en paralelo):
├── Task F1: Build verification (oracle)
├── Task F2: Type check verification (quick)
├── Task F3: Visual QA manual (unspecified-high)
└── Task F4: Scope compliance check (quick)

Critical Path: Task 1 → Task 2 → Task 7 → Task 11 → F1-F4
Parallel Speedup: ~60% faster than sequential
Max Concurrent: 6 (Wave 1)
```

### Dependency Matrix

| Task  | Depends On | Blocks       | Wave  |
| ----- | ---------- | ------------ | ----- |
| 1     | —          | 2-6          | 1     |
| 2     | 1          | 7            | 1     |
| 3     | 1          | 8            | 1     |
| 4     | 1          | 9            | 1     |
| 5     | 1          | 10           | 1     |
| 6     | 1          | — (optional) | 1     |
| 7     | 2          | 11           | 2     |
| 8     | 3          | 12           | 2     |
| 9     | 4          | 12           | 2     |
| 10    | 5          | 12           | 2     |
| 11    | 7          | F1-F4        | 3     |
| 12    | 8, 9, 10   | F1-F4        | 3     |
| F1-F4 | 11, 12     | —            | FINAL |

### Agent Dispatch Summary

| Wave  | # Parallel | Tasks → Agent Category                                  |
| ----- | ---------- | ------------------------------------------------------- |
| 1     | **6**      | T1-T6 → `quick` (Stitch designs/analysis)               |
| 2     | **4**      | T7-T10 → `quick` (UI components)                        |
| 3     | **2**      | T11-T12 → `unspecified-high` (Page integration)         |
| FINAL | **4**      | F1 → `oracle`, F2+F4 → `quick`, F3 → `unspecified-high` |

---

## TODOs

### Wave 1: Diseño con Google Stitch MCP

- [x] 1. **Analizar pantallas Stitch existentes**

  **What to do**:
  - Usar `stitch_get_screen` para analizar las 4 pantallas existentes en el proyecto 5685155227603413257
  - Pantallas: Service Card Default (187cb2e3...), Service Card Hover (7d76e7e7...), Benefits Section v1 (e45dc073...), Benefits Section v2 (bcba5b3f...)
  - Evaluar si los diseños existentes son reutilizables o necesitan ajustes
  - Documentar hallazgos para informar los nuevos diseños

  **Must NOT do**:
  - No modificar las pantallas existentes sin analizar primero

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Análisis visual simple, lectura de Stitch API
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Para evaluar calidad visual de los diseños

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 2-6)
  - **Blocks**: Tasks 2-6 (información para nuevos diseños)
  - **Blocked By**: None

  **References**:
  - Stitch project: `projects/5685155227603413257`
  - Pantalla 1: `187cb2e3ce1944c8aad42f2b1542c548` (Service Card Default)
  - Pantalla 2: `7d76e7e7e2e644a190f4fd1953d95237` (Service Card Hover)
  - Pantalla 3: `e45dc0738c1441feb16d175d922dabd1` (Benefits Section v1)
  - Pantalla 4: `bcba5b3f96f742baadbb6d56c1ab88c8` (Benefits Section v2)

  **Acceptance Criteria**:
  - [ ] Pantallas existentes analizadas
  - [ ] Documentación de patrones visuales encontrados
  - [ ] Decisión documentada: reutilizar o generar nuevos

  **Commit**: NO

- [x] 2. **Diseñar FeaturesSection en Google Stitch**

  **What to do**:
  - Usar `stitch_generate_screen_from_text` para crear diseño de sección de características
  - Prompt base: "Design a features/specifications section for a security service detail page. Minimalist monochrome app UI, black and white only, sharp edges, clean sans-serif typography, premium feel, high whitespace. Grid layout with 3 columns, each cell has small bullet dot and feature text in uppercase tracking-widest text-xs. Border between cells. Hover: subtle gray background. Desktop-first responsive design."
  - Device type: DESKTOP
  - Proyecto: 5685155227603413257

  **Must NOT do**:
  - No usar colores de acento (mantener monocromático)
  - No agregar sombras pesadas
  - No hacer prompts >5000 caracteres

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Single Stitch API call
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 3-6)
  - **Blocks**: Task 7
  - **Blocked By**: None

  **References**:
  - `src/pages/servicios/[slug].astro:91-109` - Features section actual
  - `src/components/sections/BenefitsSection.astro` - Patrón de sección existente
  - Home style: Monocromático, premium, minimalista

  **Acceptance Criteria**:
  - [ ] Stitch genera diseño de features section
  - [ ] Diseño es monocromático
  - [ ] Grid 3 columnas con items

  **Commit**: NO

- [x] 3. **Diseñar ChallengesSection en Google Stitch**

  **What to do**:
  - Usar `stitch_generate_screen_from_text` para crear diseño de sección de desafíos/pain points
  - Prompt: "Design a challenges/pain points section for a security solution detail page. Minimalist monochrome app UI, black and white only, premium feel. 3-column grid with cards. Each card: icon container (gray-50, 40x40), challenge text in medium weight. Cards have border-gray-100, hover:border-black transition. Clean sans-serif typography. Desktop-first."
  - Device type: DESKTOP
  - Proyecto: 5685155227603413257

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1
  - **Blocks**: Task 8
  - **Blocked By**: None

  **References**:
  - `src/pages/soluciones/[slug].astro:79-101` - Challenges section actual

  **Acceptance Criteria**:
  - [ ] Diseño generado en Stitch
  - [ ] Grid 3 columnas con cards de desafíos

  **Commit**: NO

- [x] 4. **Diseñar SolutionsListSection en Google Stitch**

  **What to do**:
  - Usar `stitch_generate_screen_from_text` para crear diseño de sección de soluciones/estrategias
  - Prompt: "Design a solutions/strategies section for a security solution detail page. Minimalist monochrome app UI, black and white only, premium feel. 3-column grid with cards. Each card: small badge 'Estrategia' (black bg, white text, uppercase text-xs), solution text in semibold. White cards with subtle border, hover:shadow transition. Clean sans-serif. Desktop-first."
  - Device type: DESKTOP
  - Proyecto: 5685155227603413257

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1
  - **Blocks**: Task 9
  - **Blocked By**: None

  **References**:
  - `src/pages/soluciones/[slug].astro:104-126` - Solutions section actual

  **Acceptance Criteria**:
  - [ ] Diseño generado en Stitch
  - [ ] Grid 3 columnas con cards de soluciones
  - [ ] Badge "Estrategia" visible

  **Commit**: NO

- [x] 5. **Diseñar RelatedServicesSection en Google Stitch**

  **What to do**:
  - Usar `stitch_generate_screen_from_text` para crear diseño de sección de servicios relacionados
  - Prompt: "Design a related services section for a security solution detail page. Minimalist monochrome app UI, black and white only, premium feel. Section title centered. 3-column grid of service cards. Each card: icon (shield-check), service title in uppercase tracking-widest text-xs, description text, arrow CTA link. Border-gray-100, hover:border-black. Clean sans-serif. Desktop-first."
  - Device type: DESKTOP
  - Proyecto: 5685155227603413257

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1
  - **Blocks**: Task 10
  - **Blocked By**: None

  **References**:
  - `src/pages/soluciones/[slug].astro:129-148` - Related Services actual
  - `src/components/ui/Card.astro` - Card existente
  - `src/components/ui/ServiceCard.astro` - ServiceCard existente (posible reuso)

  **Acceptance Criteria**:
  - [ ] Diseño generado en Stitch
  - [ ] Grid 3 columnas con cards de servicios

  **Commit**: NO

- [x] 6. **Diseñar CTASection variante en Google Stitch** (Opcional)

  **What to do**:
  - Analizar si CTASection.astro existente es suficiente o necesita variante
  - Si es necesario, usar `stitch_generate_screen_from_text` para crear variante de CTA
  - Prompt: "Design a dark CTA section for a security service detail page. Black background, centered content. Large headline in white with italic accent word. Subtitle in white/50 opacity. Primary white button, secondary outline button. Pattern grid overlay at 5% opacity. Monochromatic premium feel. Desktop-first."
  - Device type: DESKTOP
  - Proyecto: 5685155227603413257

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1
  - **Blocks**: None (optional enhancement)
  - **Blocked By**: None

  **References**:
  - `src/components/sections/CTASection.astro` - CTA existente
  - `src/pages/servicios/[slug].astro:137-152` - CTA inline actual
  - `src/pages/soluciones/[slug].astro:151-175` - CTA inline actual

  **Acceptance Criteria**:
  - [ ] Decisión documentada: usar existente o crear variante
  - [ ] Si variante: diseño generado en Stitch

  **Commit**: NO

### Wave 2: Componentes UI

- [x] 7. **Implementar FeaturesSection.astro**

  **What to do**:
  - Crear `src/components/sections/FeaturesSection.astro`
  - Implementar diseño basado en Stitch output de Task 2
  - Props interface:
    ```typescript
    interface Props {
      title?: string;
      subtitle?: string;
      features: string[]; // Acepta string[] de Convex
      columns?: 2 | 3;
      background?: 'white' | 'gray';
      class?: string;
    }
    ```
  - Grid con borders entre celdas
  - Cada feature: bullet dot + texto uppercase
  - Hover: gray background sutil

  **Must NOT do**:
  - No usar `as any` o `@ts-ignore`
  - No agregar colores fuera de la paleta monocromática
  - No modificar otros componentes

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Single component, clear spec from Stitch
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Para implementar diseño visual correctamente

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 8-10)
  - **Blocks**: Task 11
  - **Blocked By**: Task 2

  **References**:
  - `src/components/sections/BenefitsSection.astro` - Patrón de sección
  - `src/components/ui/Section.astro` - Wrapper de sección
  - `src/components/ui/Container.astro` - Contenedor responsive
  - `src/pages/servicios/[slug].astro:91-109` - Features inline actual
  - Stitch output de Task 2

  **Acceptance Criteria**:
  - [ ] Componente creado en `src/components/sections/FeaturesSection.astro`
  - [ ] Props TypeScript correctamente tipadas (string[])
  - [ ] Renderiza features dinámicamente
  - [ ] Grid responsive con columnas configurables
  - [ ] `npm run typecheck` pasa

  **QA Scenarios**:

  ```
  Scenario: FeaturesSection renders with data
    Tool: Bash (astro dev)
    Preconditions: Dev server running, Convex has services data
    Steps:
      1. Navigate to /servicios/guardias-seguridad
      2. Verify features section renders
      3. Verify features from Convex display correctly
      4. Verify hover effects work
    Expected Result: Section renders with all features from data
    Evidence: .sisyphus/evidence/task-7-features.png
  ```

  **Commit**: NO (groups with Tasks 8-10)

- [x] 8. **Implementar ChallengesSection.astro**

  **What to do**:
  - Crear `src/components/sections/ChallengesSection.astro`
  - Implementar diseño basado en Stitch output de Task 3
  - Props interface:
    ```typescript
    interface Props {
      title?: string;
      subtitle?: string;
      challenges: string[]; // Acepta string[] de Convex
      columns?: 2 | 3;
      background?: 'white' | 'gray';
      class?: string;
    }
    ```
  - Grid de cards con icono y texto
  - Hover: border-black transition

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: [`frontend-ui-ux`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2
  - **Blocks**: Task 12
  - **Blocked By**: Task 3

  **References**:
  - `src/components/ui/Icon.astro` - Sistema de iconos
  - `src/components/ui/Section.astro` - Wrapper
  - Stitch output de Task 3

  **Acceptance Criteria**:
  - [ ] Componente creado
  - [ ] Props tipadas correctamente (string[])
  - [ ] Cards con icono y texto
  - [ ] Hover effects funcionan

  **Commit**: NO

- [x] 9. **Implementar SolutionsListSection.astro**

  **What to do**:
  - Crear `src/components/sections/SolutionsListSection.astro`
  - Implementar diseño basado en Stitch output de Task 4
  - Props interface:
    ```typescript
    interface Props {
      title?: string;
      subtitle?: string;
      solutions: string[]; // Acepta string[] de Convex
      columns?: 2 | 3;
      background?: 'white' | 'gray';
      class?: string;
    }
    ```
  - Grid de cards con badge "Estrategia" y texto
  - Hover: shadow transition

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: [`frontend-ui-ux`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2
  - **Blocks**: Task 12
  - **Blocked By**: Task 4

  **References**:
  - Stitch output de Task 4
  - `src/components/ui/Section.astro`

  **Acceptance Criteria**:
  - [ ] Componente creado
  - [ ] Badge "Estrategia" en cada card
  - [ ] Props tipadas correctamente

  **Commit**: NO

- [x] 10. **Implementar RelatedServicesSection.astro**

  **What to do**:
  - Crear `src/components/sections/RelatedServicesSection.astro`
  - Implementar diseño basado en Stitch output de Task 5
  - Props interface:
    ```typescript
    interface RelatedService {
      title: string;
      description?: string;
      slug: string;
    }
    interface Props {
      title?: string;
      services: RelatedService[];
      columns?: 2 | 3;
      background?: 'white' | 'gray';
      class?: string;
    }
    ```
  - Grid de cards con link a /servicios/[slug]
  - Hover: border-black transition

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: [`frontend-ui-ux`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2
  - **Blocks**: Task 12
  - **Blocked By**: Task 5

  **References**:
  - `src/components/ui/ServiceCard.astro` - Posible reuso/adaptación
  - `src/components/ui/Card.astro` - Card base
  - Stitch output de Task 5

  **Acceptance Criteria**:
  - [ ] Componente creado
  - [ ] Cards con links a páginas de servicios
  - [ ] Props tipadas correctamente

  **Commit**: YES (with Tasks 7-9)
  - Message: `feat(sections): add detail page section components`
  - Files: `src/components/sections/FeaturesSection.astro, src/components/sections/ChallengesSection.astro, src/components/sections/SolutionsListSection.astro, src/components/sections/RelatedServicesSection.astro`
  - Pre-commit: `npm run typecheck`

### Wave 3: Integración de Páginas

- [x] 11. **Rediseñar servicios/[slug].astro**

  **What to do**:
  - Modificar `src/pages/servicios/[slug].astro`
  - MANTENER Hero section (líneas 38-88) SIN CAMBIOS
  - MANTENER Footer (via BaseLayout) SIN CAMBIOS
  - Reemplazar secciones intermedias:
    1. Features (líneas 91-109) → Usar `FeaturesSection.astro`
    2. Benefits (líneas 112-134) → Usar `BenefitsSection.astro` existente con adaptador
    3. CTA (líneas 137-152) → Usar `CTASection.astro` existente
  - Importar nuevos componentes
  - Mantener datos dinámicos de Convex

  **Must NOT do**:
  - NO modificar Hero (líneas 38-88)
  - NO modificar Footer
  - NO cambiar queries de Convex
  - NO agregar nuevos campos al schema

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Integración compleja, riesgo de romper página existente
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Para mantener coherencia visual

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Task 12)
  - **Blocks**: F1-F4
  - **Blocked By**: Task 7

  **References**:
  - `src/pages/servicios/[slug].astro` - Página actual
  - `src/components/sections/FeaturesSection.astro` - Nuevo componente
  - `src/components/sections/BenefitsSection.astro` - Existente
  - `src/components/sections/CTASection.astro` - Existente
  - `src/lib/convex.ts` - Cliente Convex
  - `@convex/_generated/api` - API queries

  **Acceptance Criteria**:
  - [ ] Hero section SIN CAMBIOS (líneas 38-88 idénticas)
  - [ ] FeaturesSection implementada
  - [ ] BenefitsSection implementada (adaptando string[] a {icon, title, description}[])
  - [ ] CTASection implementada
  - [ ] Todos los links funcionan
  - [ ] `npm run build` pasa

  **QA Scenarios**:

  ```
  Scenario: /servicios/[slug] page renders correctly
    Tool: Bash (npm run preview + browser)
    Preconditions: Build completed
    Steps:
      1. Run `npm run preview`
      2. Navigate to http://localhost:4321/servicios/guardias-seguridad
      3. Verify Hero section unchanged
      4. Verify FeaturesSection renders with data
      5. Verify BenefitsSection renders
      6. Verify CTASection renders
    Expected Result: Page renders with all new sections
    Evidence: .sisyphus/evidence/task-11-servicios-slug.png

  Scenario: Hero section unchanged
    Tool: Bash (git diff)
    Steps:
      1. Run `git diff src/pages/servicios/[slug].astro`
      2. Verify lines 38-88 (Hero) have no changes
    Expected Result: Hero section diff is empty
    Evidence: .sisyphus/evidence/task-11-hero-unchanged.txt
  ```

  **Commit**: NO (groups with Task 12)

- [x] 12. **Rediseñar soluciones/[slug].astro**

  **What to do**:
  - Modificar `src/pages/soluciones/[slug].astro`
  - MANTENER Hero section (líneas 48-76) SIN CAMBIOS
  - MANTENER Footer SIN CAMBIOS
  - Reemplazar secciones intermedias:
    1. Challenges (líneas 79-101) → Usar `ChallengesSection.astro`
    2. Solutions (líneas 104-126) → Usar `SolutionsListSection.astro`
    3. Related Services (líneas 129-148) → Usar `RelatedServicesSection.astro`
    4. CTA (líneas 151-175) → Usar `CTASection.astro` existente
  - Importar nuevos componentes
  - Mantener datos dinámicos de Convex

  **Must NOT do**:
  - NO modificar Hero (líneas 48-76)
  - NO modificar Footer
  - NO cambiar queries de Convex

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: [`frontend-ui-ux`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Task 11)
  - **Blocks**: F1-F4
  - **Blocked By**: Tasks 8, 9, 10

  **References**:
  - `src/pages/soluciones/[slug].astro` - Página actual
  - `src/components/sections/ChallengesSection.astro` - Nuevo
  - `src/components/sections/SolutionsListSection.astro` - Nuevo
  - `src/components/sections/RelatedServicesSection.astro` - Nuevo
  - `src/components/sections/CTASection.astro` - Existente

  **Acceptance Criteria**:
  - [ ] Hero section SIN CAMBIOS
  - [ ] ChallengesSection implementada
  - [ ] SolutionsListSection implementada
  - [ ] RelatedServicesSection implementada
  - [ ] CTASection implementada
  - [ ] Todos los links funcionan
  - [ ] `npm run build` pasa

  **Commit**: YES (with Task 11)
  - Message: `feat(pages): redesign service and solution detail pages`
  - Files: `src/pages/servicios/[slug].astro, src/pages/soluciones/[slug].astro`
  - Pre-commit: `npm run build`

---

## Final Verification Wave (MANDATORY)

- [x] F1. **Build Verification** — `oracle`
      Run `npm run build` and verify exit code 0. Check for any build warnings.
      Output: `Build [PASS/FAIL] | Warnings [N] | VERDICT: APPROVE/REJECT`

- [x] F2. **Type Check Verification** — `quick`
      Run `npm run typecheck` and verify no TypeScript errors.
      Output: `TypeScript [PASS/FAIL] | Errors [N] | VERDICT: APPROVE/REJECT`

- [x] F3. **Visual QA Manual** — `unspecified-high`
      Run `npm run preview` and manually verify: Hero sections unchanged, new sections render correctly, data from Convex displays, style consistent with home.
      Output: `Visual [PASS/FAIL] | Consistency [YES/NO] | VERDICT: APPROVE/REJECT`

- [x] F4. **Scope Compliance Check** — `quick`
      Verify: No changes to Hero lines, No Convex schema changes, Components accept string[] data, No new dependencies.
      Output: `Scope [COMPLIANT/VIOLATED] | Issues [N] | VERDICT: APPROVE/REJECT`

---

## Commit Strategy

| After Task | Message                                                   | Files                                                                 | Verification        |
| ---------- | --------------------------------------------------------- | --------------------------------------------------------------------- | ------------------- |
| 7-10       | `feat(sections): add detail page section components`      | `src/components/sections/*.astro`                                     | `npm run typecheck` |
| 11-12      | `feat(pages): redesign service and solution detail pages` | `src/pages/servicios/[slug].astro, src/pages/soluciones/[slug].astro` | `npm run build`     |

---

## Success Criteria

### Verification Commands

```bash
npm run build       # Expected: exit code 0, no errors
npm run typecheck   # Expected: no TypeScript errors
npm run preview     # Expected: server starts on port 4321
```

### Final Checklist

- [x] All 4 new section components created
- [x] /servicios/[slug] page redesigned with FeaturesSection
- [x] /soluciones/[slug] page redesigned with ChallengesSection, SolutionsListSection, RelatedServicesSection
- [x] Components accept string[] data from Convex
- [x] Build passes without errors
- [x] Type check passes without errors
- [x] Visual consistency with home page
- [x] Hero sections unchanged
