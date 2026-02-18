# Design Normalization: Monochromatic System

## TL;DR

> **Quick Summary**: Normalizar toda la aplicación Guardman al sistema de diseño monocromático del home page, reemplazando los tokens de color `primary/secondary/accent` por la escala de grises (`gray-900` a `gray-50` + `black` + `white`).
>
> **Deliverables**:
>
> - 15 archivos actualizados con colores monocromáticos
> - Configuración Tailwind alineada
> - Eliminación de referencias a colores legacy
> - Verificación de build y tipado sin errores
>
> **Estimated Effort**: Medium
> **Parallel Execution**: YES - 6 waves
> **Critical Path**: Discovery → Config → HIGH priority → MEDIUM priority → LOW priority → Verification

---

## Context

### Original Request

"Normalizar todas las pantallas, secciones y componentes para que mantengan las mismas características de diseño monocromático que hay en el home, así como todas las características de colores y tipografía utilizada. Toda la app debe estar normalizada."

### Interview Summary

**Key Discussions**:

- **WhatsApp buttons**: Mantener verde (#25D366) - reconocimiento de marca
- **Semantic colors**: Mantener success/error/warning - mejor UX
- **Admin section**: Normalizar a monocromático - consistencia total
- **Verification**: Build check + revisión visual

**Design Decisions**:

- `primary` → `gray-900` (backgrounds, text, buttons)
- `secondary` → `gray-900` (mismo para consistencia)
- `accent` → `white` (en dark bg) o `gray-900` (en light bg)
- Interactive states: `hover:bg-gray-800`, `focus:ring-gray-500`
- Disabled states: `opacity-50` + `cursor-not-allowed`
- Loading states: `gray-400` con animación

### Metis Review

**Identified Gaps** (addressed):

- Estados interactivos (hover/focus/disabled): Mapeados según Button.astro existente
- Gradientes: Normalizados a gray-900→gray-800 o black→gray-900
- Inline styles: Se verificará con grep antes de cambios
- SVG colors: Se verificará con grep antes de cambios

**Guardrails Applied**:

- NO cambiar colores semánticos (success, error, warning)
- NO cambiar color de WhatsApp
- NO agregar nuevas abstracciones o utilidades
- NO refactorizar estructura de componentes
- Solo cambios visuales de color

---

## Work Objectives

### Core Objective

Unificar todo el sistema visual de Guardman bajo un diseño monocromático consistente, eliminando las inconsistencias de color entre el home (ya monocromático) y las demás páginas de la aplicación.

### Concrete Deliverables

- `src/pages/contacto.astro` - Colores normalizados
- `src/pages/cotizar.astro` - Colores normalizados
- `src/pages/cobertura/index.astro` - Colores normalizados
- `src/pages/cobertura/[region]/index.astro` - Colores normalizados
- `src/pages/cobertura/[region]/[ciudad].astro` - Colores normalizados
- `src/pages/servicios/[slug].astro` - Colores normalizados
- `src/pages/industrias/[slug].astro` - Colores normalizados
- `src/pages/blog/[slug].astro` - Colores normalizados
- `src/components/forms/LeadForm.tsx` - Colores normalizados
- `src/components/forms/ContactForm.tsx` - Colores normalizados
- `src/components/layout/Footer.astro` - Colores normalizados
- `src/components/layout/MobileMenu.tsx` - Colores normalizados
- `src/components/ui/Card.astro` - Colores normalizados
- `src/components/ui/Section.astro` - Colores normalizados
- `src/styles/global.css` - Referencias de color actualizadas
- Admin pages (login.astro, leads.astro, index.astro) - Blue → Gray

### Definition of Done

- [ ] `npm run build` ejecuta sin errores
- [ ] `grep -r "bg-primary\|text-primary\|border-primary" src/` retorna vacío
- [ ] `grep -r "bg-secondary\|text-secondary" src/` retorna vacío (excepto gray-secondary)
- [ ] `grep -r "bg-accent\|text-accent\|border-accent" src/` retorna vacío
- [ ] `grep -r "blue-600\|blue-500\|blue-700" src/pages/admin/` retorna vacío
- [ ] Colores semánticos (#22C55E, #EF4444, #F59E0B) sin cambios
- [ ] Color WhatsApp (#25D366) sin cambios

### Must Have

- Consistencia visual total con el home page
- Todos los textos legibles (contraste adecuado)
- Estados hover/focus visibles
- Build sin errores

### Must NOT Have (Guardrails)

- NO agregar nuevos colores fuera de la escala gray
- NO modificar lógica de formularios
- NO cambiar estructura de componentes
- NO "mejorar" otros aspectos de styling descubiertos
- NO eliminar comentarios existentes
- NO modificar colores semánticos (success, error, warning)
- NO modificar color de WhatsApp

---

## Verification Strategy (MANDATORY)

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed.

### Test Decision

- **Infrastructure exists**: NO (frontend visual changes)
- **Automated tests**: None (visual changes don't need unit tests)
- **Verification method**: Build check + grep assertions + visual review

### QA Policy

Evidence saved to `.sisyphus/evidence/task-{N}-{scenario-slug}.{ext}`.

| Deliverable Type | Verification Tool | Method                          |
| ---------------- | ----------------- | ------------------------------- |
| All files        | Bash (grep)       | Search for old color references |
| Build            | Bash (npm)        | Run build, assert exit code 0   |
| TypeScript       | Bash (npx tsc)    | Type check, assert no errors    |

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately — Discovery):
├── Task 1: Grep all primary/secondary/accent usages [quick]
├── Task 2: Grep admin blue-600/500/700 usages [quick]
├── Task 3: Search inline styles with colors [quick]
└── Task 4: Search SVG fill/stroke colors [quick]

Wave 2 (After Wave 1 — Config Update):
└── Task 5: Update global.css color references [quick]

Wave 3 (After Wave 2 — HIGH Priority):
├── Task 6: Normalize contacto.astro [visual-engineering]
├── Task 7: Normalize cotizar.astro [visual-engineering]
├── Task 8: Normalize LeadForm.tsx [visual-engineering]
└── Task 9: Normalize ContactForm.tsx [visual-engineering]

Wave 4 (After Wave 3 — MEDIUM Priority):
├── Task 10: Normalize cobertura/index.astro [visual-engineering]
├── Task 11: Normalize cobertura/[region]/index.astro [visual-engineering]
├── Task 12: Normalize cobertura/[region]/[ciudad].astro [visual-engineering]
├── Task 13: Normalize servicios/[slug].astro [visual-engineering]
├── Task 14: Normalize industrias/[slug].astro [visual-engineering]
└── Task 15: Normalize blog/[slug].astro [visual-engineering]

Wave 5 (After Wave 4 — LOW Priority + Admin):
├── Task 16: Normalize Card.astro [quick]
├── Task 17: Normalize Section.astro [quick]
├── Task 18: Normalize Footer.astro [quick]
├── Task 19: Normalize MobileMenu.tsx [quick]
└── Task 20: Normalize admin pages (blue → gray) [quick]

Wave 6 (After ALL tasks — Verification):
├── Task 21: Build verification [quick]
├── Task 22: Grep verification (no old colors) [quick]
└── Task 23: TypeScript check [quick]

Critical Path: Task 1-4 → Task 5 → Task 6-9 → Task 10-15 → Task 16-20 → Task 21-23
Parallel Speedup: ~60% faster than sequential
Max Concurrent: 6 (Wave 4)
```

### Dependency Matrix

| Task  | Depends On | Blocks | Wave |
| ----- | ---------- | ------ | ---- |
| 1-4   | —          | 5      | 1    |
| 5     | 1-4        | 6-9    | 2    |
| 6-9   | 5          | 10-15  | 3    |
| 10-15 | 6-9        | 16-20  | 4    |
| 16-20 | 10-15      | 21-23  | 5    |
| 21-23 | 16-20      | —      | 6    |

### Agent Dispatch Summary

| Wave | # Parallel | Tasks → Agent Category         |
| ---- | ---------- | ------------------------------ |
| 1    | **4**      | T1-T4 → `quick`                |
| 2    | **1**      | T5 → `quick`                   |
| 3    | **4**      | T6-T9 → `visual-engineering`   |
| 4    | **6**      | T10-T15 → `visual-engineering` |
| 5    | **5**      | T16-T20 → `quick`              |
| 6    | **3**      | T21-T23 → `quick`              |

---

## Color Mapping Reference

### Standard Mappings

| Old Class            | New Class                                            | Notes               |
| -------------------- | ---------------------------------------------------- | ------------------- |
| `bg-primary`         | `bg-gray-900`                                        | Dark backgrounds    |
| `bg-primary-dark`    | `bg-black`                                           | Darkest backgrounds |
| `bg-primary/10`      | `bg-gray-900/10`                                     | Light overlays      |
| `text-primary`       | `text-gray-900`                                      | Dark text           |
| `border-primary`     | `border-gray-900`                                    | Dark borders        |
| `ring-primary`       | `ring-gray-900`                                      | Focus rings         |
| `hover:bg-primary`   | `hover:bg-gray-900`                                  | Hover states        |
| `bg-secondary`       | `bg-gray-900`                                        | Same as primary     |
| `text-secondary`     | `text-gray-900`                                      | Same as primary     |
| `bg-secondary-light` | `bg-gray-700`                                        | Lighter dark        |
| `bg-accent`          | `bg-white` (dark bg) or `bg-gray-900` (light bg)     | Context dependent   |
| `text-accent`        | `text-white` (dark bg) or `text-gray-900` (light bg) | Context dependent   |
| `hover:text-accent`  | `hover:text-white` or `hover:text-gray-900`          | Context dependent   |

### Gradient Mappings

| Old Gradient                                     | New Gradient                             |
| ------------------------------------------------ | ---------------------------------------- |
| `from-primary to-primary-dark`                   | `from-gray-900 to-black`                 |
| `from-secondary via-secondary-light to-gray-900` | `from-gray-900 via-gray-800 to-gray-900` |
| `from-primary via-primary-dark to-secondary`     | `from-gray-900 via-black to-gray-900`    |

### Preserved Colors (NO CHANGES)

| Color    | Value     | Usage                      |
| -------- | --------- | -------------------------- |
| success  | `#22C55E` | Success states, checkmarks |
| error    | `#EF4444` | Validation errors          |
| warning  | `#F59E0B` | Warning states             |
| WhatsApp | `#25D366` | WhatsApp button branding   |

### Admin Blue → Gray

| Old Class             | New Class             |
| --------------------- | --------------------- |
| `bg-blue-600`         | `bg-gray-900`         |
| `hover:bg-blue-700`   | `hover:bg-gray-800`   |
| `focus:ring-blue-500` | `focus:ring-gray-500` |
| `text-blue-600`       | `text-gray-900`       |
| `border-blue-500`     | `border-gray-700`     |

---

## TODOs

### Wave 1 — Discovery (4 parallel)

- [ ] 1. **Grep primary/secondary/accent usages**

  **What to do**:
  - Search all files in `src/` for class patterns: `bg-primary`, `text-primary`, `border-primary`, `ring-primary`, `bg-secondary`, `text-secondary`, `bg-accent`, `text-accent`, `border-accent`, `hover:bg-primary`, etc.
  - Create a report of all matches with file paths and line numbers

  **Must NOT do**:
  - Modify any files
  - Search outside src/ directory

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 2, 3, 4)
  - **Blocks**: Task 5
  - **Blocked By**: None

  **Acceptance Criteria**:
  - [ ] Report file created: `.sisyphus/evidence/task-01-color-usages.txt`
  - [ ] Report includes all files with matches
  - [ ] Report includes line numbers

  **QA Scenarios**:

  ```
  Scenario: Color usage discovery
    Tool: Bash (grep)
    Steps:
      1. grep -rn "bg-primary\|text-primary\|border-primary\|ring-primary\|bg-secondary\|text-secondary\|bg-accent\|text-accent\|border-accent" src/ --include="*.astro" --include="*.tsx" --include="*.css" > .sisyphus/evidence/task-01-color-usages.txt
    Expected Result: File created with all matches
    Evidence: .sisyphus/evidence/task-01-color-usages.txt
  ```

- [ ] 2. **Grep admin blue color usages**

  **What to do**:
  - Search admin files for: `blue-600`, `blue-500`, `blue-700`, `blue-400`
  - Create report of matches

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1
  - **Blocks**: Task 20
  - **Blocked By**: None

  **Acceptance Criteria**:
  - [ ] Report created: `.sisyphus/evidence/task-02-admin-blue.txt`
  - [ ] All admin files with blue colors identified

  **QA Scenarios**:

  ```
  Scenario: Admin blue discovery
    Tool: Bash (grep)
    Steps:
      1. grep -rn "blue-600\|blue-500\|blue-700\|blue-400" src/pages/admin/ src/components/admin/ --include="*.astro" --include="*.tsx" > .sisyphus/evidence/task-02-admin-blue.txt
    Expected Result: File created with all admin blue usages
    Evidence: .sisyphus/evidence/task-02-admin-blue.txt
  ```

- [ ] 3. **Search inline styles with colors**

  **What to do**:
  - Search for `style=` attributes that might contain hardcoded colors
  - Search for `styles.` object properties with colors
  - Report any findings

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1
  - **Blocks**: Task 5
  - **Blocked By**: None

  **Acceptance Criteria**:
  - [ ] Report created: `.sisyphus/evidence/task-03-inline-styles.txt`
  - [ ] All inline color usages identified (or confirmed none)

  **QA Scenarios**:

  ```
  Scenario: Inline style discovery
    Tool: Bash (grep)
    Steps:
      1. grep -rn "style=.*#" src/ --include="*.astro" --include="*.tsx" > .sisyphus/evidence/task-03-inline-styles.txt
      2. grep -rn "backgroundColor\|color:" src/ --include="*.tsx" >> .sisyphus/evidence/task-03-inline-styles.txt
    Expected Result: Report of any inline color usages
    Evidence: .sisyphus/evidence/task-03-inline-styles.txt
  ```

- [ ] 4. **Search SVG fill/stroke colors**

  **What to do**:
  - Search for SVG elements with `fill` or `stroke` attributes referencing primary/secondary/accent
  - Report findings

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1
  - **Blocks**: Task 5
  - **Blocked By**: None

  **Acceptance Criteria**:
  - [ ] Report created: `.sisyphus/evidence/task-04-svg-colors.txt`

  **QA Scenarios**:

  ```
  Scenario: SVG color discovery
    Tool: Bash (grep)
    Steps:
      1. grep -rn "fill=.*primary\|fill=.*secondary\|fill=.*accent\|stroke=.*primary\|stroke=.*secondary\|stroke=.*accent" src/ > .sisyphus/evidence/task-04-svg-colors.txt
    Expected Result: Report of SVG color references
    Evidence: .sisyphus/evidence/task-04-svg-colors.txt
  ```

### Wave 2 — Config Update (1 task)

- [ ] 5. **Update global.css color references**

  **What to do**:
  - Replace `ring-primary` with `ring-gray-900` in focus states
  - Replace `bg-primary/20` with `bg-gray-900/20` in selection
  - Update `.gradient-text` to use gray-900 and white
  - Verify no other primary/secondary/accent references remain

  **Must NOT do**:
  - Change any semantic colors
  - Add new CSS classes
  - Restructure the file

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 2 (sequential)
  - **Blocks**: Tasks 6-9
  - **Blocked By**: Tasks 1, 3, 4

  **References**:
  - `src/styles/global.css:17-18` — Focus ring uses ring-primary
  - `src/styles/global.css:21-23` — Selection uses bg-primary/20
  - `src/styles/global.css:54-56` — Gradient text uses primary and accent

  **Acceptance Criteria**:
  - [ ] `grep "primary\|secondary\|accent" src/styles/global.css` returns empty (except comments)
  - [ ] Build succeeds after changes

  **QA Scenarios**:

  ```
  Scenario: global.css update
    Tool: Bash
    Steps:
      1. Apply color replacements to src/styles/global.css
      2. Run grep to verify no old color references
      3. Run npm run build
    Expected Result: No old colors, build succeeds
    Evidence: .sisyphus/evidence/task-05-global-css.txt
  ```

### Wave 3 — HIGH Priority (4 parallel)

- [ ] 6. **Normalize contacto.astro**

  **What to do**:
  - Replace gradient `from-primary via-primary-dark to-secondary` → `from-gray-900 via-black to-gray-900`
  - Replace `bg-accent` → `bg-white` (in dark sections)
  - Replace `text-accent` → `text-white` (in dark sections) or `text-gray-900` (in light sections)
  - Replace `bg-primary/10` → `bg-gray-900/10`
  - Replace `text-primary` → `text-gray-900`
  - Replace `hover:text-accent` → `hover:text-white` (dark) or `hover:text-gray-900` (light)

  **Must NOT do**:
  - Change form validation logic
  - Modify component structure
  - Change semantic colors

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Design consistency, visual changes

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 7, 8, 9)
  - **Blocks**: Tasks 10-15
  - **Blocked By**: Task 5

  **References**:
  - `src/pages/contacto.astro:34-35` — Hero gradient
  - `src/pages/contacto.astro:77-78` — `text-secondary`
  - `src/pages/contacto.astro:87-88` — `bg-primary/10`, `text-primary`
  - `src/pages/contacto.astro:114-115` — Same pattern for email card

  **Acceptance Criteria**:
  - [ ] `grep "primary\|secondary\|accent" src/pages/contacto.astro` returns empty
  - [ ] Page renders correctly (visual check)

  **QA Scenarios**:

  ```
  Scenario: contacto.astro normalization
    Tool: Bash
    Steps:
      1. Apply all color replacements
      2. Verify no old colors with grep
      3. Run npm run build
    Expected Result: No old colors, build succeeds
    Evidence: .sisyphus/evidence/task-06-contacto.txt
  ```

- [ ] 7. **Normalize cotizar.astro**

  **What to do**:
  - Replace gradient `from-secondary via-secondary-light to-gray-900` → `from-gray-900 via-gray-800 to-gray-900`
  - Replace `bg-primary` → `bg-gray-900`
  - Replace `text-accent` → `text-white` (in hero section)
  - Replace `bg-accent` → `bg-white` (in dark context)
  - Replace `border-accent` → `border-white`

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`frontend-ui-ux`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3
  - **Blocks**: Tasks 10-15
  - **Blocked By**: Task 5

  **References**:
  - `src/pages/cotizar.astro:29` — Hero gradient
  - `src/pages/cotizar.astro:42-43` — `bg-primary`, `bg-accent`
  - `src/pages/cotizar.astro:55` — `bg-accent animate-pulse`
  - `src/pages/cotizar.astro:65` — `text-accent`

  **Acceptance Criteria**:
  - [ ] `grep "primary\|secondary\|accent" src/pages/cotizar.astro` returns empty
  - [ ] WhatsApp button green preserved (#25D366)

  **QA Scenarios**:

  ```
  Scenario: cotizar.astro normalization
    Tool: Bash
    Steps:
      1. Apply all color replacements (except WhatsApp)
      2. Verify WhatsApp color unchanged: grep "#25D366" returns match
      3. Verify no old colors: grep "primary\|secondary\|accent" returns empty
      4. Run npm run build
    Expected Result: No old colors, WhatsApp preserved, build succeeds
    Evidence: .sisyphus/evidence/task-07-cotizar.txt
  ```

- [ ] 8. **Normalize LeadForm.tsx**

  **What to do**:
  - Replace `text-secondary` → `text-gray-900`
  - Replace `border-primary` → `border-gray-900`
  - Replace `focus:border-primary` → `focus:border-gray-900`
  - Replace `focus:ring-primary/20` → `focus:ring-gray-900/20`
  - Replace `hover:underline text-primary` → `hover:underline text-gray-900`
  - **PRESERVE**: `bg-success/10`, `text-success`, `bg-error/5`, `border-error`, `text-error`, `bg-error/10`
  - Replace submit button `bg-accent hover:bg-accent-dark` → `bg-gray-900 hover:bg-gray-800`
  - Replace `focus:ring-accent/40` → `focus:ring-gray-500`

  **Must NOT do**:
  - Change form validation logic
  - Change error handling
  - Modify success/error colors

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`frontend-ui-ux`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3
  - **Blocks**: Tasks 10-15
  - **Blocked By**: Task 5

  **References**:
  - `src/components/forms/LeadForm.tsx:230-231` — `text-secondary`
  - `src/components/forms/LeadForm.tsx:254-255` — `text-error` (PRESERVE)
  - `src/components/forms/LeadForm.tsx:264-270` — `border-gray-200`, `focus:border-primary`, `focus:ring-primary/20`
  - `src/components/forms/LeadForm.tsx:496-503` — Button `bg-accent hover:bg-accent-dark`

  **Acceptance Criteria**:
  - [ ] `grep "primary\|secondary\|accent" src/components/forms/LeadForm.tsx` returns empty
  - [ ] `grep "success\|error" src/components/forms/LeadForm.tsx` returns same count as before
  - [ ] TypeScript compiles without errors

  **QA Scenarios**:

  ```
  Scenario: LeadForm.tsx normalization
    Tool: Bash
    Steps:
      1. Apply color replacements
      2. Verify no old colors
      3. Verify semantic colors preserved
      4. Run npx tsc --noEmit
    Expected Result: No old colors, semantic preserved, no type errors
    Evidence: .sisyphus/evidence/task-08-leadform.txt
  ```

- [ ] 9. **Normalize ContactForm.tsx**

  **What to do**:
  - Replace `bg-primary` → `bg-gray-900`
  - Replace `bg-primary-dark` → `bg-black`
  - Replace `text-accent` → `text-white`
  - Replace any `border-primary` → `border-gray-900`

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`frontend-ui-ux`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3
  - **Blocks**: Tasks 10-15
  - **Blocked By**: Task 5

  **Acceptance Criteria**:
  - [ ] `grep "primary\|secondary\|accent" src/components/forms/ContactForm.tsx` returns empty
  - [ ] TypeScript compiles without errors

  **QA Scenarios**:

  ```
  Scenario: ContactForm.tsx normalization
    Tool: Bash
    Steps:
      1. Apply color replacements
      2. Verify no old colors
      3. Run npx tsc --noEmit
    Expected Result: No old colors, no type errors
    Evidence: .sisyphus/evidence/task-09-contactform.txt
  ```

### Wave 4 — MEDIUM Priority (6 parallel)

- [ ] 10. **Normalize cobertura/index.astro**

  **What to do**:
  - Replace `from-secondary via-secondary to-gray-900` → `from-gray-900 via-gray-800 to-gray-900`
  - Replace `text-accent` → `text-white`
  - Replace `bg-primary` → `bg-gray-900`
  - Replace `hover:bg-primary` → `hover:bg-gray-900`
  - Replace `hover:text-primary` → `hover:text-gray-900`
  - Replace `text-primary` → `text-gray-900`
  - Replace `group-hover:text-primary` → `group-hover:text-gray-900`

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`frontend-ui-ux`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with Tasks 11-15)
  - **Blocks**: Tasks 16-20
  - **Blocked By**: Tasks 6-9

  **Acceptance Criteria**:
  - [ ] `grep "primary\|secondary\|accent" src/pages/cobertura/index.astro` returns empty

  **QA Scenarios**:

  ```
  Scenario: cobertura/index.astro normalization
    Tool: Bash
    Steps:
      1. Apply color replacements
      2. Verify no old colors with grep
      3. Run npm run build
    Expected Result: No old colors, build succeeds
    Evidence: .sisyphus/evidence/task-10-cobertura-index.txt
  ```

- [ ] 11. **Normalize cobertura/[region]/index.astro**

  **What to do**:
  - Same patterns as Task 10
  - Replace all primary/secondary/accent with gray equivalents

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`frontend-ui-ux`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4
  - **Blocks**: Tasks 16-20
  - **Blocked By**: Tasks 6-9

  **Acceptance Criteria**:
  - [ ] `grep "primary\|secondary\|accent" src/pages/cobertura/[region]/index.astro` returns empty

  **QA Scenarios**:

  ```
  Scenario: cobertura/[region]/index.astro normalization
    Tool: Bash
    Steps:
      1. Apply color replacements
      2. Verify no old colors with grep
    Expected Result: No old colors
    Evidence: .sisyphus/evidence/task-11-cobertura-region.txt
  ```

- [ ] 12. **Normalize cobertura/[region]/[ciudad].astro**

  **What to do**:
  - Same patterns as Task 10
  - Replace all primary/secondary/accent with gray equivalents

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`frontend-ui-ux`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4
  - **Blocks**: Tasks 16-20
  - **Blocked By**: Tasks 6-9

  **Acceptance Criteria**:
  - [ ] `grep "primary\|secondary\|accent" src/pages/cobertura/[region]/[ciudad].astro` returns empty

  **QA Scenarios**:

  ```
  Scenario: cobertura/[region]/[ciudad].astro normalization
    Tool: Bash
    Steps:
      1. Apply color replacements
      2. Verify no old colors with grep
    Expected Result: No old colors
    Evidence: .sisyphus/evidence/task-12-cobertura-ciudad.txt
  ```

- [ ] 13. **Normalize servicios/[slug].astro**

  **What to do**:
  - Replace gradient `from-primary to-primary-dark` → `from-gray-900 to-black`
  - Replace `bg-accent/20` → `bg-white/20`
  - Replace `text-accent` → `text-white`
  - Replace `bg-primary/10` → `bg-gray-900/10`
  - Replace `text-primary` → `text-gray-900`
  - Replace `group-hover:text-primary` → `group-hover:text-gray-600`
  - Replace `bg-primary` → `bg-gray-900`
  - Replace `hover:bg-primary` → `hover:bg-gray-900`

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`frontend-ui-ux`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4
  - **Blocks**: Tasks 16-20
  - **Blocked By**: Tasks 6-9

  **References**:
  - `src/pages/servicios/[slug].astro:27` — Hero gradient
  - `src/pages/servicios/[slug].astro:41-42` — `bg-accent/20`, `text-accent`
  - `src/pages/servicios/[slug].astro:70-71` — `text-secondary`
  - `src/pages/servicios/[slug].astro:76` — `bg-gray-50` (already correct)
  - `src/pages/servicios/[slug].astro:106-108` — `bg-primary/10`, `text-primary`
  - `src/pages/servicios/[slug].astro:130` — `bg-primary`

  **Acceptance Criteria**:
  - [ ] `grep "primary\|secondary\|accent" src/pages/servicios/[slug].astro` returns empty

  **QA Scenarios**:

  ```
  Scenario: servicios/[slug].astro normalization
    Tool: Bash
    Steps:
      1. Apply color replacements
      2. Verify no old colors with grep
      3. Run npm run build
    Expected Result: No old colors, build succeeds
    Evidence: .sisyphus/evidence/task-13-servicios.txt
  ```

- [ ] 14. **Normalize industrias/[slug].astro**

  **What to do**:
  - Same patterns as servicios/[slug].astro
  - Replace all primary/secondary/accent with gray equivalents

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`frontend-ui-ux`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4
  - **Blocks**: Tasks 16-20
  - **Blocked By**: Tasks 6-9

  **Acceptance Criteria**:
  - [ ] `grep "primary\|secondary\|accent" src/pages/industrias/[slug].astro` returns empty

  **QA Scenarios**:

  ```
  Scenario: industrias/[slug].astro normalization
    Tool: Bash
    Steps:
      1. Apply color replacements
      2. Verify no old colors with grep
    Expected Result: No old colors
    Evidence: .sisyphus/evidence/task-14-industrias.txt
  ```

- [ ] 15. **Normalize blog/[slug].astro**

  **What to do**:
  - Replace `text-primary` → `text-gray-900`
  - Replace `group-hover:text-primary` → `group-hover:text-gray-600`
  - Replace any `bg-primary` → `bg-gray-900`

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`frontend-ui-ux`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4
  - **Blocks**: Tasks 16-20
  - **Blocked By**: Tasks 6-9

  **Acceptance Criteria**:
  - [ ] `grep "primary\|secondary\|accent" src/pages/blog/[slug].astro` returns empty

  **QA Scenarios**:

  ```
  Scenario: blog/[slug].astro normalization
    Tool: Bash
    Steps:
      1. Apply color replacements
      2. Verify no old colors with grep
    Expected Result: No old colors
    Evidence: .sisyphus/evidence/task-15-blog.txt
  ```

### Wave 5 — LOW Priority + Admin (5 parallel)

- [ ] 16. **Normalize Card.astro**

  **What to do**:
  - Replace `bg-primary` → `bg-gray-900`
  - Replace `text-primary` → `text-gray-900`
  - Replace `border-primary` → `border-gray-900`

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 5 (with Tasks 17-20)
  - **Blocks**: Tasks 21-23
  - **Blocked By**: Tasks 10-15

  **Acceptance Criteria**:
  - [ ] `grep "primary\|secondary\|accent" src/components/ui/Card.astro` returns empty

  **QA Scenarios**:

  ```
  Scenario: Card.astro normalization
    Tool: Bash
    Steps:
      1. Apply color replacements
      2. Verify no old colors with grep
    Expected Result: No old colors
    Evidence: .sisyphus/evidence/task-16-card.txt
  ```

- [ ] 17. **Normalize Section.astro**

  **What to do**:
  - Replace `bg-primary text-white` → `bg-gray-900 text-white`
  - Check for any other primary/secondary/accent references

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 5
  - **Blocks**: Tasks 21-23
  - **Blocked By**: Tasks 10-15

  **References**:
  - `src/components/ui/Section.astro` — Check for background prop handling

  **Acceptance Criteria**:
  - [ ] `grep "primary\|secondary\|accent" src/components/ui/Section.astro` returns empty

  **QA Scenarios**:

  ```
  Scenario: Section.astro normalization
    Tool: Bash
    Steps:
      1. Apply color replacements
      2. Verify no old colors with grep
    Expected Result: No old colors
    Evidence: .sisyphus/evidence/task-17-section.txt
  ```

- [ ] 18. **Normalize Footer.astro**

  **What to do**:
  - Replace `hover:text-accent` → `hover:text-white`
  - Check for any other accent references

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 5
  - **Blocks**: Tasks 21-23
  - **Blocked By**: Tasks 10-15

  **Acceptance Criteria**:
  - [ ] `grep "primary\|secondary\|accent" src/components/layout/Footer.astro` returns empty

  **QA Scenarios**:

  ```
  Scenario: Footer.astro normalization
    Tool: Bash
    Steps:
      1. Apply color replacements
      2. Verify no old colors with grep
    Expected Result: No old colors
    Evidence: .sisyphus/evidence/task-18-footer.txt
  ```

- [ ] 19. **Normalize MobileMenu.tsx**

  **What to do**:
  - Replace `bg-secondary` → `bg-gray-900`
  - Replace `text-accent` → `text-white`
  - Replace `hover:text-accent` → `hover:text-white`
  - Replace `bg-accent` → `bg-white`
  - Replace `text-accent-dark` → `text-gray-900`

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 5
  - **Blocks**: Tasks 21-23
  - **Blocked By**: Tasks 10-15

  **Acceptance Criteria**:
  - [ ] `grep "primary\|secondary\|accent" src/components/layout/MobileMenu.tsx` returns empty
  - [ ] TypeScript compiles without errors

  **QA Scenarios**:

  ```
  Scenario: MobileMenu.tsx normalization
    Tool: Bash
    Steps:
      1. Apply color replacements
      2. Verify no old colors with grep
      3. Run npx tsc --noEmit
    Expected Result: No old colors, no type errors
    Evidence: .sisyphus/evidence/task-19-mobilemenu.txt
  ```

- [ ] 20. **Normalize admin pages**

  **What to do**:
  - In `src/pages/admin/login.astro`:
    - Replace `bg-blue-600` → `bg-gray-900`
    - Replace `hover:bg-blue-700` → `hover:bg-gray-800`
    - Replace `focus:ring-blue-500` → `focus:ring-gray-500`
    - Replace `focus:ring-blue-500` → `focus:ring-gray-500`
    - Replace `focus:ring-offset-blue-800` → `focus:ring-offset-gray-900`
  - In `src/pages/admin/index.astro` and `src/pages/admin/leads.astro`:
    - Replace any blue-\* accents with gray equivalents

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 5
  - **Blocks**: Tasks 21-23
  - **Blocked By**: Task 2

  **References**:
  - `src/pages/admin/login.astro:56` — Button `bg-blue-600 hover:bg-blue-700`
  - `src/pages/admin/login.astro:48` — Input focus `focus:ring-blue-500`

  **Acceptance Criteria**:
  - [ ] `grep -r "blue-600\|blue-500\|blue-700\|blue-400" src/pages/admin/` returns empty
  - [ ] Admin pages still functional (build succeeds)

  **QA Scenarios**:

  ```
  Scenario: Admin pages normalization
    Tool: Bash
    Steps:
      1. Apply color replacements to all admin files
      2. Verify no blue colors remain: grep -r "blue-600\|blue-500\|blue-700" src/pages/admin/
      3. Run npm run build
    Expected Result: No blue colors, build succeeds
    Evidence: .sisyphus/evidence/task-20-admin.txt
  ```

### Wave 6 — Verification (3 parallel)

- [ ] 21. **Build verification**

  **What to do**:
  - Run `npm run build`
  - Assert exit code is 0
  - Capture any warnings

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 6 (with Tasks 22, 23)
  - **Blocks**: None
  - **Blocked By**: Tasks 16-20

  **Acceptance Criteria**:
  - [ ] Build completes with exit code 0
  - [ ] No build errors

  **QA Scenarios**:

  ```
  Scenario: Build verification
    Tool: Bash
    Steps:
      1. cd /project/root
      2. npm run build
      3. Check exit code
    Expected Result: Exit code 0, no errors
    Evidence: .sisyphus/evidence/task-21-build.txt
  ```

- [ ] 22. **Grep verification (no old colors)**

  **What to do**:
  - Search for any remaining old color references
  - Assert all searches return empty

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 6
  - **Blocks**: None
  - **Blocked By**: Tasks 16-20

  **Acceptance Criteria**:
  - [ ] `grep -r "bg-primary\|text-primary\|border-primary\|ring-primary" src/` returns empty
  - [ ] `grep -r "bg-secondary\|text-secondary" src/` returns empty (except tailwind default secondary)
  - [ ] `grep -r "bg-accent\|text-accent\|border-accent" src/` returns empty
  - [ ] `grep -r "blue-600\|blue-500\|blue-700" src/pages/admin/` returns empty

  **QA Scenarios**:

  ```
  Scenario: Color reference verification
    Tool: Bash
    Steps:
      1. grep -r "bg-primary\|text-primary\|border-primary" src/ --include="*.astro" --include="*.tsx" --include="*.css"
      2. grep -r "bg-secondary\|text-secondary" src/ --include="*.astro" --include="*.tsx"
      3. grep -r "bg-accent\|text-accent" src/ --include="*.astro" --include="*.tsx"
      4. grep -r "blue-600\|blue-500\|blue-700" src/pages/admin/
    Expected Result: All grep commands return empty
    Evidence: .sisyphus/evidence/task-22-grep.txt
  ```

- [ ] 23. **TypeScript check**

  **What to do**:
  - Run TypeScript type check
  - Assert no type errors

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 6
  - **Blocks**: None
  - **Blocked By**: Tasks 16-20

  **Acceptance Criteria**:
  - [ ] `npx tsc --noEmit` completes without errors

  **QA Scenarios**:

  ```
  Scenario: TypeScript verification
    Tool: Bash
    Steps:
      1. npx tsc --noEmit
      2. Check exit code
    Expected Result: Exit code 0, no type errors
    Evidence: .sisyphus/evidence/task-23-typescript.txt
  ```

---

## Final Verification Wave (MANDATORY)

- [ ] F1. **Plan Compliance Audit** — `quick`
      For each "Must Have": verify build succeeds. For each "Must NOT Have": grep for forbidden patterns (success/error/warning colors changed, WhatsApp changed). Check all evidence files exist.
      Output: `Must Have [N/N] | Must NOT Have [N/N] | Tasks [23/23] | VERDICT: APPROVE/REJECT`

- [ ] F2. **Visual Consistency Review** — `unspecified-high`
      Run dev server. Navigate to key pages: /, /contacto, /cotizar, /cobertura, /servicios/vigilancia-privada, /admin/login. Verify visual consistency with home page design.
      Output: `Pages [N/N] | Consistency [ALIGNED/ISSUES] | VERDICT`

- [ ] F3. **Scope Fidelity Check** — `quick`
      For each task: verify only color changes were made, no structural changes, no logic changes. Check git diff for unexpected modifications.
      Output: `Tasks [N/N compliant] | Unaccounted [CLEAN/N files] | VERDICT`

---

## Commit Strategy

| After Wave | Message                                           | Files              |
| ---------- | ------------------------------------------------- | ------------------ |
| Wave 5     | `style: normalize design to monochromatic system` | All modified files |

---

## Success Criteria

### Verification Commands

```bash
# Build must succeed
npm run build
# Expected: Exit code 0

# No old color references
grep -r "bg-primary\|text-primary\|border-primary" src/ --include="*.astro" --include="*.tsx"
# Expected: Empty output

# Semantic colors preserved
grep -r "#22C55E\|#EF4444\|#F59E0B" src/
# Expected: Same count as before

# WhatsApp color preserved
grep -r "#25D366" src/
# Expected: Same count as before

# TypeScript passes
npx tsc --noEmit
# Expected: Exit code 0
```

### Final Checklist

- [ ] All "Must Have" present (build succeeds, colors consistent)
- [ ] All "Must NOT Have" absent (semantic colors unchanged, WhatsApp unchanged)
- [ ] All tests pass (build, grep, typescript)
- [ ] Visual review confirms consistency with home page
