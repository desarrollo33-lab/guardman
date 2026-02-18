# Plan: Rediseño de Secciones /servicios y /soluciones

## TL;DR

> **Quick Summary**: Rediseñar las secciones intermedias (entre hero y footer) de las páginas /servicios y /soluciones usando Google Stitch MCP. Crear componentes globales reutilizables manteniendo el estilo monocromático premium existente.
>
> **Deliverables**:
>
> - 5 nuevos componentes globales reutilizables
> - 2 páginas rediseñadas (/servicios, /soluciones)
> - Eliminación de componentes obsoletos (ServicesGrid, SolutionsGrid)
>
> **Estimated Effort**: Medium
> **Parallel Execution**: YES - 4 waves
> **Critical Path**: Diseño Stitch → Componentes UI → Secciones → Integración páginas

---

## Context

### Original Request

Planificar la creación e implementación de las secciones y componentes de las páginas /servicios y /soluciones. El hero y footer están ok y no necesitan cambios. Todo el resto de las secciones intermedias debe ser rediseñado utilizando Google Stitch MCP. Crear componentes globales reutilizables en ambas páginas.

### Interview Summary

**Key Discussions**:

- **Estilo visual**: Mantener estilo monocromático, minimalista, premium (Porsche/Ajax-inspired)
- **Estrategia de datos**: Componente único con adaptador de props para normalizar servicios/soluciones
- **Componentes existentes**: Eliminar ServicesGrid.astro y SolutionsGrid.astro no utilizados
- **Sectores hardcodeados**: Extraer como IndustryGrid.astro reutilizable
- **Enfoque dispositivo**: Desktop-first para Stitch, responsive con breakpoints estándar
- **QA**: Sin pruebas automatizadas, verificación manual

**Research Findings**:

- Tech stack: Astro 5.1 + Tailwind CSS 3.4 + React 18 + Convex
- Componentes UI existentes: Button, Container, Section, Icon, Badge, Breadcrumbs
- Datos de Convex: servicios con `title`, soluciones con `name`
- Patrones de diseño: class:list, direct imports, design tokens de Tailwind

### Metis Review

**Identified Gaps** (addressed):

- Data normalization: Usar adaptador de props → DECIDIDO
- Existing grid components: Eliminar y reemplazar → DECIDIDO
- Hardcoded sectors: Extraer como componente → DECIDIDO
- Scope boundaries: Hero/Footer excluidos, bug orphaned no tocar → DOCUMENTADO
- Animation library: No agregar, mantener CSS-only → DOCUMENTADO

---

## Work Objectives

### Core Objective

Rediseñar las secciones intermedias de /servicios y /soluciones creando componentes globales reutilizables que mantengan la coherencia visual del diseño monocromático premium existente.

### Concrete Deliverables

- `src/components/ui/ServiceCard.astro` - Card reutilizable para servicios y soluciones
- `src/components/ui/IndustryCard.astro` - Card para sectores/industrias
- `src/components/sections/BenefitsSection.astro` - Sección de beneficios/ventajas
- `src/components/sections/ProcessSection.astro` - Sección de proceso/metodología
- `src/components/sections/CTASection.astro` - Call-to-action oscuro reutilizable
- `src/components/sections/IndustryGrid.astro` - Grid de industrias/sectores
- `src/pages/servicios/index.astro` - Página rediseñada
- `src/pages/soluciones/index.astro` - Página rediseñada

### Definition of Done

- [ ] `npm run build` completa sin errores
- [ ] `npm run typecheck` pasa sin errores
- [ ] Todos los componentes nuevos renderizan correctamente
- [ ] Links de cards navegan a páginas correctas
- [ ] Estilo visual coherente entre ambas páginas

### Must Have

- Componentes completamente reutilizables entre /servicios y /soluciones
- Mantener estilo monocromático, minimalista, premium
- Usar Google Stitch MCP para generar diseños UI
- Adaptador de props para normalizar datos de servicios y soluciones

### Must NOT Have (Guardrails)

- NO modificar Hero sections (servicios: líneas 35-81, soluciones: líneas 60-112)
- NO modificar Footer component
- NO modificar páginas [slug].astro individuales
- NO modificar schema o queries de Convex
- NO corregir bug de trust indicators huérfanos en soluciones (líneas 277-293)
- NO agregar librerías de animación (Framer Motion, etc.)
- NO agregar nuevos iconos - usar Icon.astro existente

---

## Verification Strategy

> **ZERO HUMAN INTERVENTION** — Verificación mediante comandos y herramientas.

### Test Decision

- **Infrastructure exists**: NO (no hay tests automatizados en el proyecto)
- **Automated tests**: None
- **Framework**: N/A
- **QA Policy**: Verificación manual por desarrollador

### QA Policy

Verificación mediante:

1. Build verification: `npm run build && npm run typecheck`
2. Preview visual: `npm run preview` y revisión manual
3. Navegación: Verificar links y CTAs

| Deliverable Type | Verification Tool | Method                              |
| ---------------- | ----------------- | ----------------------------------- |
| Build            | Bash              | `npm run build` exit code 0         |
| Types            | Bash              | `npm run typecheck` sin errores     |
| Visual           | Bash + Browser    | `npm run preview` + revisión manual |
| Links            | Browser           | Click en cada card/CTA              |

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Diseño Stitch - 5 diseños en paralelo):
├── Task 1: Diseño ServiceCard en Stitch [quick]
├── Task 2: Diseño IndustryCard en Stitch [quick]
├── Task 3: Diseño BenefitsSection en Stitch [quick]
├── Task 4: Diseño ProcessSection en Stitch [quick]
└── Task 5: Diseño CTASection en Stitch [quick]

Wave 2 (Componentes UI - 2 en paralelo):
├── Task 6: Implementar ServiceCard.astro (depends: 1) [quick]
└── Task 7: Implementar IndustryCard.astro (depends: 2) [quick]

Wave 3 (Secciones - 4 en paralelo):
├── Task 8: Implementar BenefitsSection.astro (depends: 3) [quick]
├── Task 9: Implementar ProcessSection.astro (depends: 4) [quick]
├── Task 10: Implementar CTASection.astro (depends: 5) [quick]
└── Task 11: Implementar IndustryGrid.astro (depends: 7) [quick]

Wave 4 (Integración páginas - 2 en paralelo):
├── Task 12: Rediseñar /servicios/index.astro (depends: 6, 8, 9, 10, 11) [unspecified-high]
└── Task 13: Rediseñar /soluciones/index.astro (depends: 6, 8, 9, 10) [unspecified-high]

Wave 5 (Limpieza - 1 tarea):
└── Task 14: Eliminar componentes obsoletos (depends: 12, 13) [quick]

Wave FINAL (Verificación - 4 en paralelo):
├── Task F1: Build verification (oracle)
├── Task F2: Type check verification (quick)
├── Task F3: Visual QA manual (unspecified-high)
└── Task F4: Scope compliance check (quick)

Critical Path: Task 1 → Task 6 → Task 12 → Task 14 → F1-F4
Parallel Speedup: ~60% faster than sequential
Max Concurrent: 5 (Wave 1)
```

### Dependency Matrix

| Task  | Depends On      | Blocks | Wave  |
| ----- | --------------- | ------ | ----- |
| 1-5   | —               | 6-11   | 1     |
| 6     | 1               | 12, 13 | 2     |
| 7     | 2               | 11     | 2     |
| 8     | 3               | 12, 13 | 3     |
| 9     | 4               | 12, 13 | 3     |
| 10    | 5               | 12, 13 | 3     |
| 11    | 7               | 12     | 3     |
| 12    | 6, 8, 9, 10, 11 | 14     | 4     |
| 13    | 6, 8, 9, 10     | 14     | 4     |
| 14    | 12, 13          | F1-F4  | 5     |
| F1-F4 | 14              | —      | FINAL |

### Agent Dispatch Summary

| Wave  | # Parallel | Tasks → Agent Category                                  |
| ----- | ---------- | ------------------------------------------------------- |
| 1     | **5**      | T1-T5 → `quick` (Stitch designs)                        |
| 2     | **2**      | T6-T7 → `quick` (UI components)                         |
| 3     | **4**      | T8-T11 → `quick` (Sections)                             |
| 4     | **2**      | T12-T13 → `unspecified-high` (Page integration)         |
| 5     | **1**      | T14 → `quick` (Cleanup)                                 |
| FINAL | **4**      | F1 → `oracle`, F2+F4 → `quick`, F3 → `unspecified-high` |

---

## TODOs

### Wave 1: Diseño con Google Stitch MCP

- [ ] 1. **Diseñar ServiceCard en Google Stitch**

  **What to do**:
  - Usar `stitch_generate_screen_from_text` para crear diseño de card de servicio/solución
  - Prompt: "Design a premium, monochromatic service card component for a security company. Dark minimalist style inspired by Porsche/Ajax Systems. Features: icon container (48x48), title in uppercase tracking-widest, description text, arrow CTA. Hover: border color change to black, icon background black, text black. Use CSS transitions 300ms. Desktop-first responsive design."
  - Device type: DESKTOP
  - Guardar referencia del diseño para implementación

  **Must NOT do**:
  - No usar colores de acento (mantener monocromático)
  - No agregar sombras pesadas

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Single Stitch API call, straightforward task
  - **Skills**: [] (no additional skills needed)

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 2, 3, 4, 5)
  - **Blocks**: Task 6
  - **Blocked By**: None

  **References**:
  - `src/components/ui/Card.astro` - Patrón de card existente
  - `src/pages/servicios/index.astro:93-123` - Cards inline actuales
  - `tailwind.config.mjs` - Design tokens

  **Acceptance Criteria**:
  - [ ] Stitch genera diseño de card
  - [ ] Diseño es monocromático (negro/blanco/grises)
  - [ ] Diseño incluye icono, título, descripción, CTA

  **QA Scenarios**:

  ```
  Scenario: Stitch design generation succeeds
    Tool: stitch_generate_screen_from_text
    Preconditions: Stitch MCP connected
    Steps:
      1. Call generate_screen_from_text with card prompt
      2. Verify response contains screen ID
      3. Verify output_components has design data
    Expected Result: Screen ID returned, design generated
    Failure Indicators: API error, empty response
    Evidence: .sisyphus/evidence/task-1-stitch-card.txt
  ```

  **Commit**: NO

- [ ] 2. **Diseñar IndustryCard en Google Stitch**

  **What to do**:
  - Usar `stitch_generate_screen_from_text` para crear diseño de card de industria/sector
  - Prompt: "Design a minimal industry/sector card for a security company grid. Small centered icon (32x32), industry name below in uppercase tracking-widest text-xs. Background white, hover light gray. Very simple and clean. Part of a 6-column grid. Monochromatic design."
  - Device type: DESKTOP

  **Recommended Agent Profile**:
  - **Category**: `quick`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1
  - **Blocks**: Task 7
  - **Blocked By**: None

  **References**:
  - `src/pages/servicios/index.astro:139-153` - Grid de industrias actual

  **Acceptance Criteria**:
  - [ ] Stitch genera diseño de card de industria
  - [ ] Diseño es minimalista y monocromático

  **Commit**: NO

- [ ] 3. **Diseñar BenefitsSection en Google Stitch**

  **What to do**:
  - Usar `stitch_generate_screen_from_text` para crear sección de beneficios
  - Prompt: "Design a benefits/advantages section for a security company page. Layout: 2-column grid on desktop. Left: section title (h2) with subtitle paragraph. Right: 3 benefit items stacked vertically, each with circular icon (checkmark), bold title, description text. Monochromatic premium style, icons in black circles with white checkmarks. CSS transitions on hover."
  - Device type: DESKTOP

  **Recommended Agent Profile**:
  - **Category**: `quick`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1
  - **Blocks**: Task 8
  - **Blocked By**: None

  **References**:
  - `src/pages/soluciones/index.astro:163-204` - Sección de experiencia actual

  **Acceptance Criteria**:
  - [ ] Stitch genera diseño de sección de beneficios
  - [ ] Incluye título, subtítulo, 3 items con iconos

  **Commit**: NO

- [ ] 4. **Diseñar ProcessSection en Google Stitch**

  **What to do**:
  - Usar `stitch_generate_screen_from_text` para crear sección de proceso/metodología
  - Prompt: "Design a process/methodology timeline section for a security company. Horizontal timeline with 4 steps: Diagnóstico → Propuesta → Implementación → Monitoreo. Each step: number in circle, step title, brief description. Connected by horizontal line. Monochromatic design, clean and professional. CSS transitions."
  - Device type: DESKTOP

  **Recommended Agent Profile**:
  - **Category**: `quick`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1
  - **Blocks**: Task 9
  - **Blocked By**: None

  **Acceptance Criteria**:
  - [ ] Stitch genera diseño de sección de proceso
  - [ ] Incluye 4 pasos conectados visualmente

  **Commit**: NO

- [ ] 5. **Diseñar CTASection en Google Stitch**

  **What to do**:
  - Usar `stitch_generate_screen_from_text` para crear sección CTA oscura
  - Prompt: "Design a dark CTA section for a security company page. Black background, centered content. Large headline in white with italic accent text. Subtitle in white/50 opacity. Two buttons: primary white button ( Solicitar Auditoría), secondary outline button (phone number). Bottom: trust indicators in row. Monochromatic, premium feel."
  - Device type: DESKTOP

  **Recommended Agent Profile**:
  - **Category**: `quick`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1
  - **Blocks**: Task 10
  - **Blocked By**: None

  **References**:
  - `src/pages/servicios/index.astro:158-190` - CTA actual
  - `src/components/ui/Button.astro` - Componente botón existente

  **Acceptance Criteria**:
  - [ ] Stitch genera diseño de sección CTA
  - [ ] Fondo oscuro, dos botones, trust indicators

  **Commit**: NO

### Wave 2: Componentes UI

- [ ] 6. **Implementar ServiceCard.astro**

  **What to do**:
  - Crear `src/components/ui/ServiceCard.astro`
  - Implementar diseño basado en Stitch output de Task 1
  - Props interface:
    ```typescript
    interface Props {
      title: string; // Servicio title o Solution name
      description: string;
      icon: string;
      href: string;
      class?: string;
    }
    ```
  - Usar patrones de `Card.astro` existente
  - Transiciones: `transition-all duration-300`
  - Hover: `group-hover:border-black`, `group-hover:bg-black` para icono

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
  - **Parallel Group**: Wave 2 (with Task 7)
  - **Blocks**: Tasks 12, 13
  - **Blocked By**: Task 1

  **References**:
  - `src/components/ui/Card.astro` - Patrón de estructura
  - `src/components/ui/Icon.astro` - Sistema de iconos
  - `src/components/ui/Button.astro` - Patrón de clases variantes
  - `tailwind.config.mjs` - Design tokens
  - Stitch output de Task 1

  **Acceptance Criteria**:
  - [ ] Componente creado en `src/components/ui/ServiceCard.astro`
  - [ ] Props TypeScript correctamente tipadas
  - [ ] Renderiza icono, título, descripción, link
  - [ ] Hover effects funcionan (border, icono)
  - [ ] `npm run typecheck` pasa

  **QA Scenarios**:

  ```
  Scenario: ServiceCard renders correctly
    Tool: Bash (astro dev)
    Preconditions: Dev server running
    Steps:
      1. Create test page importing ServiceCard
      2. Pass props: title="Test Service", description="Test desc", icon="shield-check", href="/test"
      3. Verify card renders with all elements
      4. Hover card and verify border/icon color change
    Expected Result: Card renders, hover effects work
    Evidence: .sisyphus/evidence/task-6-servicecard.png (screenshot)
  ```

  **Commit**: NO (groups with Task 7)

- [ ] 7. **Implementar IndustryCard.astro**

  **What to do**:
  - Crear `src/components/ui/IndustryCard.astro`
  - Implementar diseño basado en Stitch output de Task 2
  - Props interface:
    ```typescript
    interface Props {
      name: string;
      icon: string;
      href?: string;
      class?: string;
    }
    ```
  - Card minimalista centrada con icono y nombre

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: [`frontend-ui-ux`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Task 6)
  - **Blocks**: Task 11
  - **Blocked By**: Task 2

  **References**:
  - Stitch output de Task 2
  - `src/components/ui/Icon.astro`

  **Acceptance Criteria**:
  - [ ] Componente creado
  - [ ] Props tipadas correctamente
  - [ ] Icono centrado, nombre debajo
  - [ ] Hover effect funciona

  **Commit**: YES (with Task 6)
  - Message: `feat(ui): add ServiceCard and IndustryCard components`
  - Files: `src/components/ui/ServiceCard.astro, src/components/ui/IndustryCard.astro`
  - Pre-commit: `npm run typecheck`

### Wave 3: Componentes de Secciones

- [ ] 8. **Implementar BenefitsSection.astro**

  **What to do**:
  - Crear `src/components/sections/BenefitsSection.astro`
  - Implementar diseño basado en Stitch output de Task 3
  - Props interface:
    ```typescript
    interface Benefit {
      icon: string;
      title: string;
      description: string;
    }
    interface Props {
      title: string;
      subtitle?: string;
      benefits: Benefit[];
      background?: 'white' | 'gray';
      class?: string;
    }
    ```
  - Layout 2-columnas: título/subtítulo izquierda, beneficios derecha
  - Cada benefit: círculo con icono, título bold, descripción

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: [`frontend-ui-ux`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 9, 10, 11)
  - **Blocks**: Tasks 12, 13
  - **Blocked By**: Task 3

  **References**:
  - `src/components/ui/Section.astro` - Wrapper de sección
  - `src/components/ui/Container.astro` - Contenedor responsive
  - `src/components/ui/Icon.astro` - Sistema de iconos
  - Stitch output de Task 3

  **Acceptance Criteria**:
  - [ ] Componente creado en `src/components/sections/BenefitsSection.astro`
  - [ ] Layout 2-columnas responsive
  - [ ] Renderiza beneficios dinámicamente desde props
  - [ ] Background configurable

  **Commit**: NO (groups with Tasks 9-11)

- [ ] 9. **Implementar ProcessSection.astro**

  **What to do**:
  - Crear `src/components/sections/ProcessSection.astro`
  - Implementar diseño basado en Stitch output de Task 4
  - Props interface:
    ```typescript
    interface ProcessStep {
      number: number | string;
      title: string;
      description: string;
    }
    interface Props {
      title?: string;
      subtitle?: string;
      steps: ProcessStep[];
      background?: 'white' | 'gray';
      class?: string;
    }
    ```
  - Timeline horizontal con 4 pasos conectados por línea

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: [`frontend-ui-ux`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3
  - **Blocks**: Tasks 12, 13
  - **Blocked By**: Task 4

  **References**:
  - Stitch output de Task 4
  - `src/components/ui/Section.astro`
  - `src/components/ui/Container.astro`

  **Acceptance Criteria**:
  - [ ] Componente creado
  - [ ] Timeline horizontal con pasos dinámicos
  - [ ] Pasos conectados visualmente
  - [ ] Responsive (apila en mobile)

  **Commit**: NO

- [ ] 10. **Implementar CTASection.astro**

  **What to do**:
  - Crear `src/components/sections/CTASection.astro`
  - Implementar diseño basado en Stitch output de Task 5
  - Props interface:
    ```typescript
    interface CTAButton {
      text: string;
      href: string;
      variant?: 'primary' | 'secondary' | 'outline';
    }
    interface Props {
      headline: string;
      headlineAccent?: string; // Texto en itálica
      subtitle?: string;
      primaryButton: CTAButton;
      secondaryButton?: CTAButton;
      trustBadges?: string[];
      class?: string;
    }
    ```
  - Fondo oscuro (black), contenido centrado
  - Usar `Button.astro` existente

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: [`frontend-ui-ux`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3
  - **Blocks**: Tasks 12, 13
  - **Blocked By**: Task 5

  **References**:
  - `src/components/ui/Button.astro` - Botones
  - `src/components/ui/Section.astro` - Wrapper
  - `src/components/ui/Container.astro` - Contenedor
  - `src/data/site.ts` - Phone number
  - Stitch output de Task 5

  **Acceptance Criteria**:
  - [ ] Componente creado
  - [ ] Headline con soporte de texto accent
  - [ ] Dos botones configurables
  - [ ] Trust badges opcionales

  **Commit**: NO

- [ ] 11. **Implementar IndustryGrid.astro**

  **What to do**:
  - Crear `src/components/sections/IndustryGrid.astro`
  - Usar `IndustryCard.astro` de Task 7
  - Props interface:
    ```typescript
    interface Industry {
      name: string;
      icon: string;
      href?: string;
    }
    interface Props {
      title?: string;
      subtitle?: string;
      industries: Industry[];
      background?: 'white' | 'gray';
      columns?: 2 | 3 | 4 | 6;
      class?: string;
    }
    ```
  - Grid responsive: 6 columnas desktop, 3 tablet, 2 mobile

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: [`frontend-ui-ux`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3
  - **Blocks**: Task 12
  - **Blocked By**: Task 7

  **References**:
  - `src/components/ui/IndustryCard.astro` - Cards individuales
  - `src/components/ui/Section.astro`
  - `src/components/ui/Container.astro`
  - `src/pages/servicios/index.astro:139-153` - Datos de industrias actuales

  **Acceptance Criteria**:
  - [ ] Componente creado
  - [ ] Grid responsive con columnas configurables
  - [ ] Usa IndustryCard para cada item
  - [ ] Título y subtítulo opcionales

  **Commit**: YES (with Tasks 8-10)
  - Message: `feat(sections): add BenefitsSection, ProcessSection, CTASection, IndustryGrid`
  - Files: `src/components/sections/*.astro`
  - Pre-commit: `npm run typecheck`

### Wave 4: Integración de Páginas

- [ ] 12. **Rediseñar /servicios/index.astro**

  **What to do**:
  - Modificar `src/pages/servicios/index.astro`
  - MANTENER Hero section (líneas 35-81) SIN CAMBIOS
  - MANTENER Footer (via BaseLayout) SIN CAMBIOS
  - Reemplazar secciones intermedias:
    1. Services Grid (líneas 84-125) → Usar `ServiceCard.astro` en grid
    2. Sectores (líneas 128-155) → Usar `IndustryGrid.astro`
    3. CTA (líneas 158-190) → Usar `CTASection.astro`
  - Agregar `ProcessSection.astro` entre Services Grid e IndustryGrid
  - Importar nuevos componentes
  - Mantener datos dinámicos de Convex (`services`)

  **Must NOT do**:
  - NO modificar Hero (líneas 35-81)
  - NO modificar Footer
  - NO cambiar queries de Convex
  - NO agregar nuevos campos al schema

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Integración compleja, múltiples componentes, riesgo de romper página existente
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Para mantener coherencia visual

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with Task 13)
  - **Blocks**: Task 14
  - **Blocked By**: Tasks 6, 8, 9, 10, 11

  **References**:
  - `src/pages/servicios/index.astro` - Página actual (LEER COMPLETA)
  - `src/components/ui/ServiceCard.astro` - Nuevas cards
  - `src/components/sections/IndustryGrid.astro` - Grid de industrias
  - `src/components/sections/CTASection.astro` - CTA section
  - `src/components/sections/ProcessSection.astro` - Proceso
  - `src/lib/convex.ts` - Cliente Convex
  - `@convex/_generated/api` - API queries

  **Acceptance Criteria**:
  - [ ] Hero section SIN CAMBIOS (líneas 35-81 idénticas)
  - [ ] Services grid usa ServiceCard
  - [ ] IndustryGrid muestra 6 industrias
  - [ ] CTASection implementada
  - [ ] ProcessSection agregada
  - [ ] Todos los links funcionan (/servicios/[slug])
  - [ ] `npm run build` pasa

  **QA Scenarios**:

  ```
  Scenario: /servicios page renders correctly
    Tool: Bash (npm run preview + browser)
    Preconditions: Build completed
    Steps:
      1. Run `npm run preview`
      2. Navigate to http://localhost:4321/servicios
      3. Verify Hero section unchanged
      4. Verify service cards render with correct data
      5. Verify industry grid shows 6 items
      6. Verify CTA section renders
      7. Click each service card, verify navigation to /servicios/[slug]
    Expected Result: Page renders, all sections present, links work
    Evidence: .sisyphus/evidence/task-12-servicios-page.png

  Scenario: Hero section unchanged
    Tool: Bash (git diff)
    Steps:
      1. Run `git diff src/pages/servicios/index.astro`
      2. Verify lines 35-81 (Hero) have no changes
    Expected Result: Hero section diff is empty
    Evidence: .sisyphus/evidence/task-12-hero-unchanged.txt
  ```

  **Commit**: NO (groups with Task 13)

- [ ] 13. **Rediseñar /soluciones/index.astro**

  **What to do**:
  - Modificar `src/pages/soluciones/index.astro`
  - MANTENER Hero section (líneas 60-112) SIN CAMBIOS
  - MANTENER Footer SIN CAMBIOS
  - MANTENER trust indicators huérfanos (líneas 277-293) - NO TOCAR
  - Reemplazar secciones intermedias:
    1. Solutions Grid (líneas 115-160) → Usar `ServiceCard.astro` con adaptador
    2. Experience (líneas 163-244) → Usar `BenefitsSection.astro`
    3. CTA (líneas 247-293) → Usar `CTASection.astro`
  - Adaptador para props: `name` → `title`, etc.
  - Importar nuevos componentes
  - Mantener datos dinámicos de Convex (`solutions`)

  **Must NOT do**:
  - NO modificar Hero (líneas 60-112)
  - NO modificar Footer
  - NO corregir bug de trust indicators huérfanos (líneas 277-293)
  - NO cambiar queries de Convex

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: [`frontend-ui-ux`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with Task 12)
  - **Blocks**: Task 14
  - **Blocked By**: Tasks 6, 8, 9, 10

  **References**:
  - `src/pages/soluciones/index.astro` - Página actual
  - `src/components/ui/ServiceCard.astro` - Cards compartidas
  - `src/components/sections/BenefitsSection.astro` - Beneficios
  - `src/components/sections/CTASection.astro` - CTA

  **Acceptance Criteria**:
  - [ ] Hero section SIN CAMBIOS
  - [ ] Solutions grid usa ServiceCard con adaptador
  - [ ] BenefitsSection implementada
  - [ ] CTASection implementada
  - [ ] Todos los links funcionan (/soluciones/[slug])
  - [ ] Bug huérfano NO tocado
  - [ ] `npm run build` pasa

  **Commit**: YES (with Task 12)
  - Message: `feat(pages): redesign servicios and soluciones pages with new components`
  - Files: `src/pages/servicios/index.astro, src/pages/soluciones/index.astro`
  - Pre-commit: `npm run build`

### Wave 5: Limpieza

- [ ] 14. **Eliminar componentes obsoletos**

  **What to do**:
  - Eliminar `src/components/sections/ServicesGrid.astro`
  - Eliminar `src/components/sections/SolutionsGrid.astro`
  - Verificar que no hay imports a estos archivos en ningún lugar
  - Verificar `npm run build` sigue pasando

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: [] (simple file deletion)

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Sequential
  - **Blocks**: F1-F4
  - **Blocked By**: Tasks 12, 13

  **References**:
  - `src/components/sections/ServicesGrid.astro` - A eliminar
  - `src/components/sections/SolutionsGrid.astro` - A eliminar

  **Acceptance Criteria**:
  - [ ] Ambos archivos eliminados
  - [ ] No hay imports rotos
  - [ ] `npm run build` pasa
  - [ ] `npm run typecheck` pasa

  **Commit**: YES
  - Message: `chore: remove obsolete ServicesGrid and SolutionsGrid`
  - Files: `src/components/sections/ServicesGrid.astro, src/components/sections/SolutionsGrid.astro`
  - Pre-commit: `npm run build`

---

## Final Verification Wave (MANDATORY)

- [ ] F1. **Build Verification** — `oracle`
      Run `npm run build` and verify exit code 0. Check for any build warnings. Verify all assets compile correctly.
      Output: `Build [PASS/FAIL] | Warnings [N] | VERDICT: APPROVE/REJECT`

- [ ] F2. **Type Check Verification** — `quick`
      Run `npm run typecheck` and verify no TypeScript errors. Check for any implicit any or missing types.
      Output: `TypeScript [PASS/FAIL] | Errors [N] | VERDICT: APPROVE/REJECT`

- [ ] F3. **Visual QA Manual** — `unspecified-high`
      Run `npm run preview` and manually verify: Hero sections unchanged, Footer unchanged, Cards render correctly, Hover states work, Links navigate properly, Both pages visually consistent.
      Output: `Visual [PASS/FAIL] | Consistency [YES/NO] | VERDICT: APPROVE/REJECT`

- [ ] F4. **Scope Compliance Check** — `quick`
      Verify: No changes to Hero lines (servicios: 35-81, soluciones: 60-112), No changes to Footer, No Convex schema changes, No new dependencies, Components created in correct directories.
      Output: `Scope [COMPLIANT/VIOLATED] | Issues [N] | VERDICT: APPROVE/REJECT`

---

## Commit Strategy

| After Task | Message                                                                         | Files                                                                                     | Verification        |
| ---------- | ------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ------------------- |
| 6-7        | `feat(ui): add ServiceCard and IndustryCard components`                         | `src/components/ui/*.astro`                                                               | `npm run typecheck` |
| 8-11       | `feat(sections): add BenefitsSection, ProcessSection, CTASection, IndustryGrid` | `src/components/sections/*.astro`                                                         | `npm run typecheck` |
| 12-13      | `feat(pages): redesign servicios and soluciones pages with new components`      | `src/pages/servicios/index.astro, src/pages/soluciones/index.astro`                       | `npm run build`     |
| 14         | `chore: remove obsolete ServicesGrid and SolutionsGrid`                         | `src/components/sections/ServicesGrid.astro, src/components/sections/SolutionsGrid.astro` | `npm run build`     |

---

## Success Criteria

### Verification Commands

```bash
npm run build       # Expected: exit code 0, no errors
npm run typecheck   # Expected: no TypeScript errors
npm run preview     # Expected: server starts on port 4321
```

### Final Checklist

- [ ] All 5 new section components created
- [ ] All 2 new UI components created
- [ ] /servicios page redesigned with new components
- [ ] /soluciones page redesigned with new components
- [ ] Obsolete ServicesGrid and SolutionsGrid deleted
- [ ] Build passes without errors
- [ ] Type check passes without errors
- [ ] Visual consistency between both pages
- [ ] All links and CTAs functional
- [ ] Hero and Footer unchanged
