# Plan: Completar Todas las Páginas del Sitio Guardman

## TL;DR

> **Quick Summary**: Corregir todos los links rotos del header/footer y crear todas las páginas faltantes para que cada link del sitio lleve a una página operativa y funcional.
>
> **Deliverables**:
>
> - Header y Footer actualizados con slugs correctos
> - 3 nuevas industrias agregadas a los datos
> - 6 nuevas páginas: `/servicios`, `/industrias`, `/nosotros`, `/carreras`, `/privacidad`, `/terminos`
> - 5 artículos de blog de ejemplo
> - Errores de TypeScript corregidos
>
> **Estimated Effort**: Medium (3-4 horas de trabajo efectivo)
> **Parallel Execution**: YES - 4 waves
> **Critical Path**: T1 → T5 → T10 → T12 → T14 → T15 → T16

---

## Context

### Original Request

"qué paginas no estan terminadas en el proyecto? necesito que todas esten operativas y todos los links lleven a paginas que esten funcionando"

### Interview Summary

**Key Discussions**:

- **Alcance**: Completo - corregir links + crear todas las páginas + blog
- **Servicios**: Mantener los 6 servicios actuales de services.ts
- **Industrias**: Agregar 3 nuevas (Inmobiliaria, Eventos, Corporativo) a las 5 existentes
- **Nosotros**: Página con historia, valores, y perfiles de equipo con fotos
- **Carreras**: Lista de vacantes + formulario de contacto
- **Blog**: 5 artículos de ejemplo sobre seguridad

**Research Findings**:

- Header y Footer usan slugs que no coinciden con los datos
- Existe error de TypeScript en ServiceSchema (espera `name` pero datos usan `title`)
- Coverage pages tienen errores de tipos implícitos 'any'
- Blog tiene colección configurada pero sin contenido

### Metis Review

**Identified Gaps** (addressed):

- **TypeScript Error**: ServiceSchema espera propiedad `name` pero Service tiene `title` - Se agregará tarea para mapear correctamente
- **Slug Strategy**: Confirmado cambiar navegación para coincidir con datos (más seguro)
- **Guardrails**: No cambiar slugs existentes, no duplicar contenido, no agregar funcionalidades extra

---

## Work Objectives

### Core Objective

Hacer que todos los links del sitio (header, footer, y páginas internas) lleven a páginas operativas y funcionales.

### Concrete Deliverables

1. `src/components/layout/Header.astro` - Links actualizados con slugs correctos
2. `src/components/layout/Footer.astro` - Links actualizados con slugs correctos
3. `src/data/industries.ts` - 3 nuevas industrias agregadas
4. `src/pages/servicios/index.astro` - Nueva página índice de servicios
5. `src/pages/industrias/index.astro` - Nueva página índice de industrias
6. `src/pages/nosotros.astro` - Nueva página "Sobre Nosotros"
7. `src/pages/carreras.astro` - Nueva página de carreras
8. `src/pages/privacidad.astro` - Nueva página legal
9. `src/pages/terminos.astro` - Nueva página legal
10. `src/content/blog/*.md` - 5 artículos de blog
11. `src/components/seo/ServiceSchema.astro` - Fix TypeScript error
12. Errores de tipos en coverage pages corregidos

### Definition of Done

- [ ] Todos los links del header funcionan sin 404
- [ ] Todos los links del footer funcionan sin 404
- [ ] Todas las páginas nuevas renderizan correctamente
- [ ] Blog muestra 5 artículos
- [ ] `npm run typecheck` pasa sin errores
- [ ] `npm run build` completa sin errores

### Must Have

- Todos los links internos funcionando
- Páginas con contenido real (no placeholders)
- Diseño consistente con el sitio existente
- SEO básico (meta tags, schemas) en páginas nuevas

### Must NOT Have (Guardrails)

- NO cambiar slugs existentes en services.ts ni industries.ts
- NO eliminar páginas dinámicas existentes
- NO agregar integraciones externas nuevas
- NO duplicar código existente
- NO crear funcionalidades extra en formularios

---

## Verification Strategy (MANDATORY)

### Test Decision

- **Infrastructure exists**: NO (no hay tests configurados)
- **Automated tests**: None
- **Framework**: N/A

### QA Policy

Every task MUST include agent-executed QA scenarios.

| Deliverable Type | Verification Tool             | Method                                       |
| ---------------- | ----------------------------- | -------------------------------------------- |
| Frontend/UI      | Playwright (playwright skill) | Navigate, verify content exists, check links |
| API/Backend      | Bash (curl)                   | Send requests, verify responses              |
| Build            | Bash                          | Run npm commands, check exit codes           |

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately — data + fixes):
├── Task 1: Agregar 3 industrias nuevas a industries.ts [quick]
├── Task 2: Fix ServiceSchema TypeScript error [quick]
├── Task 3: Fix coverage pages TypeScript errors [quick]
└── Task 4: Actualizar Header.astro con slugs correctos [quick]

Wave 2 (After Wave 1 — navigation + index pages):
├── Task 5: Actualizar Footer.astro con slugs correctos [quick]
├── Task 6: Crear /servicios/index.astro [visual-engineering]
├── Task 7: Crear /industrias/index.astro [visual-engineering]
└── Task 8: Crear /privacidad.astro [quick]

Wave 3 (After Wave 2 — content pages):
├── Task 9: Crear /terminos.astro [quick]
├── Task 10: Crear /nosotros.astro con equipo [visual-engineering]
├── Task 11: Crear /carreras.astro [visual-engineering]
└── Task 12: Crear 5 artículos de blog [writing]

Wave 4 (After Wave 3 — verification):
├── Task 13: Build verification [quick]
├── Task 14: Playwright QA - verificar links [unspecified-high]
├── Task 15: TypeCheck verification [quick]
└── Task 16: Final cleanup + commit [git]

Critical Path: T1 → T5 → T10 → T12 → T14 → T15 → T16
Parallel Speedup: ~60% faster than sequential
Max Concurrent: 4 (Waves 1 & 2)
```

### Dependency Matrix

| Task | Depends On                       | Blocks | Wave |
| ---- | -------------------------------- | ------ | ---- |
| 1    | —                                | 5, 7   | 1    |
| 2    | —                                | 13, 15 | 1    |
| 3    | —                                | 13, 15 | 1    |
| 4    | —                                | 14     | 1    |
| 5    | 1                                | 14     | 2    |
| 6    | —                                | 14     | 2    |
| 7    | 1                                | 14     | 2    |
| 8    | —                                | 14     | 2    |
| 9    | —                                | 14     | 3    |
| 10   | —                                | 14     | 3    |
| 11   | —                                | 14     | 3    |
| 12   | —                                | 14     | 3    |
| 13   | 2, 3                             | 14     | 4    |
| 14   | 4, 5, 6, 7, 8, 9, 10, 11, 12, 13 | 16     | 4    |
| 15   | 2, 3                             | 16     | 4    |
| 16   | 14, 15                           | —      | 4    |

### Agent Dispatch Summary

| Wave | # Parallel | Tasks → Agent Category                                                                |
| ---- | ---------- | ------------------------------------------------------------------------------------- |
| 1    | **4**      | T1 → `quick`, T2 → `quick`, T3 → `quick`, T4 → `quick`                                |
| 2    | **4**      | T5 → `quick`, T6 → `visual-engineering`, T7 → `visual-engineering`, T8 → `quick`      |
| 3    | **4**      | T9 → `quick`, T10 → `visual-engineering`, T11 → `visual-engineering`, T12 → `writing` |
| 4    | **4**      | T13 → `quick`, T14 → `unspecified-high`, T15 → `quick`, T16 → `git`                   |

---

## TODOs

- [x] 1. Agregar 3 industrias nuevas a industries.ts

  **What to do**:
  - Agregar las siguientes industrias al array en `src/data/industries.ts`:
    - `inmobiliaria` - Inmobiliaria y Propiedades
    - `eventos` - Eventos y Espectáculos
    - `corporativo` - Corporativo y Oficinas
  - Cada industria debe tener: id, slug, name, description, icon, challenges[], solutions[], relatedServices[]
  - Actualizar `getIndustryServices()` para incluir las nuevas industrias

  **Must NOT do**:
  - NO modificar las 5 industrias existentes
  - NO cambiar la interfaz Industry

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Cambios simples de datos, sin lógica compleja
  - **Skills**: []
    - No requiere skills especiales

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 2, 3, 4)
  - **Blocks**: Task 5, Task 7
  - **Blocked By**: None (can start immediately)

  **References**:
  **Pattern References**:
  - `src/data/industries.ts:13-123` - Estructura de industrias existentes para copiar patrón

  **WHY Each Reference Matters**:
  - La estructura de industrias existentes define el formato exacto que deben seguir las nuevas

  **Acceptance Criteria**:
  - [ ] 3 nuevas industrias agregadas con todos los campos requeridos
  - [ ] Función `getIndustryServices()` actualizada con mapeo para nuevas industrias
  - [ ] `npm run typecheck` pasa sin errores en este archivo

  **QA Scenarios**:

  ```
  Scenario: Verificar industrias nuevas en datos
    Tool: Bash
    Preconditions: Archivo industries.ts modificado
    Steps:
      1. Run: grep -c "slug:" src/data/industries.ts
      2. Verify output contains "8" (5 originales + 3 nuevos)
    Expected Result: Count equals 8
    Evidence: .sisyphus/evidence/task-01-industries-count.txt
  ```

  **Commit**: YES
  - Message: `feat(industries): add Inmobiliaria, Eventos, Corporativo industries`
  - Files: `src/data/industries.ts`

---

- [x] 2. Fix ServiceSchema TypeScript error

  **What to do**:
  - El componente `ServiceSchema.astro` espera una propiedad `name` pero recibe objetos con `title`
  - Modificar `src/pages/servicios/[slug].astro` para mapear `service.title` → `name` al pasar props
  - Alternativamente, modificar `ServiceSchema.astro` para aceptar `title` como alias de `name`

  **Must NOT do**:
  - NO cambiar la interfaz Service en services.ts
  - NO romper el schema SEO

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Fix simple de mapeo de tipos
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 3, 4)
  - **Blocks**: Task 13, Task 15
  - **Blocked By**: None

  **References**:
  **Pattern References**:
  - `src/pages/servicios/[slug].astro:22-23` - Donde se pasa service a ServiceSchema
  - `src/components/seo/ServiceSchema.astro` - Componente que espera propiedad `name`

  **Acceptance Criteria**:
  - [ ] TypeScript error resuelto en [slug].astro:23
  - [ ] Schema SEO sigue funcionando correctamente
  - [ ] `npm run typecheck` no reporta errores en este archivo

  **QA Scenarios**:

  ```
  Scenario: TypeScript pasa sin errores
    Tool: Bash
    Steps:
      1. Run: npx tsc --noEmit 2>&1 | grep -i "servicios" || echo "No errors"
    Expected Result: Output contains "No errors"
    Evidence: .sisyphus/evidence/task-02-typescript-fix.txt
  ```

  **Commit**: YES
  - Message: `fix(seo): map service.title to name for ServiceSchema`
  - Files: `src/pages/servicios/[slug].astro`

---

- [x] 3. Fix coverage pages TypeScript errors

  **What to do**:
  - `src/pages/cobertura/index.astro` tiene errores de import (Zone, getCommunesByZone, communes)
  - `src/pages/cobertura/[comuna].astro` tiene tipos implícitos 'any'
  - Verificar que los exports en `src/data/locations.ts` coincidan con los imports
  - Agregar tipos explícitos donde sea necesario

  **Must NOT do**:
  - NO cambiar la funcionalidad de las páginas de cobertura
  - NO modificar la estructura de datos de locations

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Corrección de tipos, sin cambios de lógica
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 2, 4)
  - **Blocks**: Task 13, Task 15
  - **Blocked By**: None

  **References**:
  **Pattern References**:
  - `src/data/locations.ts` - Verificar exports disponibles
  - `src/pages/cobertura/index.astro:12` - Imports problemáticos
  - `src/pages/cobertura/[comuna].astro:15` - Imports problemáticos

  **Acceptance Criteria**:
  - [ ] Imports corregidos para usar exports existentes
  - [ ] Tipos 'any' reemplazados con tipos explícitos
  - [ ] `npm run typecheck` no reporta errores en coverage pages

  **QA Scenarios**:

  ```
  Scenario: TypeScript pasa sin errores en coverage
    Tool: Bash
    Steps:
      1. Run: npx tsc --noEmit 2>&1 | grep -i "cobertura" || echo "No errors"
    Expected Result: Output contains "No errors"
    Evidence: .sisyphus/evidence/task-03-coverage-types.txt
  ```

  **Commit**: YES
  - Message: `fix(types): resolve TypeScript errors in coverage pages`
  - Files: `src/pages/cobertura/index.astro`, `src/pages/cobertura/[comuna].astro`

---

- [x] 4. Actualizar Header.astro con slugs correctos

  **What to do**:
  - Actualizar el array `navLinks` en `src/components/layout/Header.astro`
  - Cambiar los slugs de servicios para coincidir con `services.ts`:
    - `vigilancia-privada` → `guardias-seguridad`
    - `rondas-seguridad` → `patrullaje-condominios`
    - `monitoreo-cctv` → `alarmas-ajax`
    - `escolta-vip` → ELIMINAR (no existe)
    - Agregar: `guardpod`, `drones-seguridad`
  - Actualizar labels de industrias para coincidir con datos + nuevas

  **Must NOT do**:
  - NO agregar nuevos items de menú que no tengan página
  - NO cambiar la estructura del menú

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Cambios simples de texto en configuración
  - **Skills**: [`frontend-ui-ux`]
    - Para asegurar consistencia visual del menú

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 2, 3)
  - **Blocks**: Task 14
  - **Blocked By**: None

  **References**:
  **Pattern References**:
  - `src/data/services.ts:14-171` - Slugs correctos de servicios
  - `src/data/industries.ts` - Slugs correctos de industrias (después de Task 1)

  **Acceptance Criteria**:
  - [ ] Dropdown de Servicios muestra los 6 servicios con slugs correctos
  - [ ] Todos los links del header llevan a páginas existentes
  - [ ] Labels coinciden con títulos de servicios en datos

  **QA Scenarios**:

  ```
  Scenario: Links de header funcionan
    Tool: Playwright
    Preconditions: Dev server running
    Steps:
      1. Navigate to http://localhost:4321
      2. Click "Servicios" dropdown
      3. Click each service link
      4. Verify each page loads without 404
    Expected Result: All 6 service pages load successfully
    Evidence: .sisyphus/evidence/task-04-header-links.png
  ```

  **Commit**: YES
  - Message: `fix(nav): update header service links to match data slugs`
  - Files: `src/components/layout/Header.astro`

---

- [x] 5. Actualizar Footer.astro con slugs correctos

  **What to do**:
  - Actualizar arrays de servicios e industrias en `src/components/layout/Footer.astro`
  - Servicios: usar slugs de services.ts (igual que Header)
  - Industrias: actualizar para incluir las 8 industrias (5 originales + 3 nuevas)
  - Actualizar links de "Empresa": /nosotros, /cobertura, /blog, /carreras

  **Must NOT do**:
  - NO cambiar estructura del footer
  - NO agregar links a páginas que no existirán

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Cambios de datos en componente existente
  - **Skills**: [`frontend-ui-ux`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 6, 7, 8)
  - **Blocks**: Task 14
  - **Blocked By**: Task 1 (necesita industrias nuevas)

  **References**:
  **Pattern References**:
  - `src/components/layout/Header.astro` - Usar mismos slugs que header
  - `src/data/services.ts` - Servicios correctos
  - `src/data/industries.ts` - Industrias correctas (después de Task 1)

  **Acceptance Criteria**:
  - [ ] Links de servicios apuntan a páginas existentes
  - [ ] Links de industrias apuntan a páginas existentes
  - [ ] Links de empresa apuntan a páginas que existirán (nosotros, carreras)

  **QA Scenarios**:

  ```
  Scenario: Links de footer funcionan
    Tool: Playwright
    Preconditions: Dev server running, all new pages created
    Steps:
      1. Navigate to http://localhost:4321
      2. Scroll to footer
      3. Click each service link, verify loads
      4. Click each industry link, verify loads
      5. Click each company link, verify loads
    Expected Result: All footer links work
    Evidence: .sisyphus/evidence/task-05-footer-links.png
  ```

  **Commit**: YES
  - Message: `fix(nav): update footer links to match data slugs`
  - Files: `src/components/layout/Footer.astro`

---

- [x] 6. Crear /servicios/index.astro

  **What to do**:
  - Crear página índice que liste todos los servicios
  - Usar diseño de grid similar a otras páginas del sitio
  - Importar servicios desde `src/data/services.ts`
  - Cada tarjeta de servicio debe linkar a `/servicios/[slug]`
  - Incluir hero section, grid de servicios, y CTA

  **Must NOT do**:
  - NO duplicar contenido de páginas individuales de servicio
  - NO crear nueva estructura de datos

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Nueva página con diseño visual, necesita coincidir con estilo existente
  - **Skills**: [`frontend-ui-ux`]
    - Para diseño consistente con el sitio

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 5, 7, 8)
  - **Blocks**: Task 14
  - **Blocked By**: None

  **References**:
  **Pattern References**:
  - `src/pages/cobertura/index.astro` - Diseño de página índice de referencia
  - `src/components/sections/ServicesGrid.astro` - Componente de grid de servicios existente
  - `src/data/services.ts` - Datos de servicios

  **Acceptance Criteria**:
  - [ ] Página renderiza sin errores
  - [ ] Muestra los 6 servicios con título, descripción, y link
  - [ ] Diseño consistente con el resto del sitio
  - [ ] SEO básico (title, description, schema)

  **QA Scenarios**:

  ```
  Scenario: Página de servicios funciona
    Tool: Playwright
    Steps:
      1. Navigate to http://localhost:4321/servicios
      2. Verify page title contains "Servicios"
      3. Verify 6 service cards are visible
      4. Click first service card
      5. Verify navigation to service detail page
    Expected Result: Services index page works correctly
    Evidence: .sisyphus/evidence/task-06-servicios-index.png
  ```

  **Commit**: YES
  - Message: `feat(pages): add /servicios index page`
  - Files: `src/pages/servicios/index.astro`

---

- [x] 7. Crear /industrias/index.astro

  **What to do**:
  - Crear página índice que liste todas las industrias (8 total)
  - Grid de tarjetas con icono, nombre, descripción
  - Cada tarjeta linka a `/industrias/[slug]`
  - Hero section + grid + CTA

  **Must NOT do**:
  - NO hardcodear industrias (usar datos de industries.ts)
  - NO duplicar contenido

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Nueva página con diseño visual
  - **Skills**: [`frontend-ui-ux`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 5, 6, 8)
  - **Blocks**: Task 14
  - **Blocked By**: Task 1 (necesita industrias nuevas en datos)

  **References**:
  **Pattern References**:
  - `src/pages/servicios/index.astro` (Task 6) - Diseño similar
  - `src/data/industries.ts` - Datos de industrias

  **Acceptance Criteria**:
  - [ ] Página renderiza 8 industrias
  - [ ] Cada industria tiene link a su página detalle
  - [ ] Diseño consistente

  **QA Scenarios**:

  ```
  Scenario: Página de industrias funciona
    Tool: Playwright
    Steps:
      1. Navigate to http://localhost:4321/industrias
      2. Verify 8 industry cards visible
      3. Click one industry
      4. Verify detail page loads
    Expected Result: Industries index works
    Evidence: .sisyphus/evidence/task-07-industrias-index.png
  ```

  **Commit**: YES
  - Message: `feat(pages): add /industrias index page`
  - Files: `src/pages/industrias/index.astro`

---

- [x] 8. Crear /privacidad.astro

  **What to do**:
  - Crear página de Política de Privacidad
  - Usar texto legal genérico adaptable para empresas chilenas
  - Secciones: Información que recopilamos, Uso de información, Cookies, Contacto
  - Diseño limpio con Container y prosa

  **Must NOT do**:
  - NO incluir cláusulas específicas de servicios no ofrecidos
  - NO crear texto legal profesional (es placeholder)

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Página simple de contenido estático
  - **Skills**: [`writing`]
    - Para texto legal

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 5, 6, 7)
  - **Blocks**: Task 14
  - **Blocked By**: None

  **References**:
  **Pattern References**:
  - `src/pages/contacto.astro` - Layout base para páginas de contenido
  - `src/layouts/BaseLayout.astro` - Layout principal

  **Acceptance Criteria**:
  - [ ] Página renderiza con título y contenido
  - [ ] Link desde footer funciona
  - [ ] Contenido legal básico presente

  **QA Scenarios**:

  ```
  Scenario: Página de privacidad funciona
    Tool: Playwright
    Steps:
      1. Navigate to http://localhost:4321/privacidad
      2. Verify page title contains "Privacidad"
      3. Verify content sections visible
    Expected Result: Privacy page works
    Evidence: .sisyphus/evidence/task-08-privacidad.png
  ```

  **Commit**: YES
  - Message: `feat(pages): add privacy policy page`
  - Files: `src/pages/privacidad.astro`

---

- [x] 9. Crear /terminos.astro

  **What to do**:
  - Crear página de Términos de Servicio
  - Texto legal genérico para servicios de seguridad
  - Secciones: Aceptación, Servicios, Responsabilidades, Modificaciones
  - Diseño consistente con privacidad

  **Must NOT do**:
  - NO crear texto legal profesional
  - NO duplicar contenido de privacidad

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: [`writing`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 10, 11, 12)
  - **Blocks**: Task 14
  - **Blocked By**: None

  **References**:
  - `src/pages/privacidad.astro` (Task 8) - Estilo consistente

  **Acceptance Criteria**:
  - [ ] Página renderiza
  - [ ] Link desde footer funciona
  - [ ] Contenido legal básico presente

  **QA Scenarios**:

  ```
  Scenario: Términos funciona
    Tool: Playwright
    Steps:
      1. Navigate to http://localhost:4321/terminos
      2. Verify content visible
    Expected Result: Terms page works
    Evidence: .sisyphus/evidence/task-09-terminos.png
  ```

  **Commit**: YES
  - Message: `feat(pages): add terms of service page`
  - Files: `src/pages/terminos.astro`

---

- [x] 10. Crear /nosotros.astro con equipo

  **What to do**:
  - Crear página "Sobre Nosotros" completa
  - Secciones:
    - Hero con tagline de empresa
    - Historia (10+ años protegiendo Chile)
    - Misión, Visión, Valores (cards con iconos)
    - Equipo directivo (3-4 perfiles con fotos placeholder)
    - Cifras clave (500+ clientes, 52 comunas, 24/7, etc.)
    - CTA para contacto
  - Usar imágenes de placeholder para equipo

  **Must NOT do**:
  - NO inventar nombres reales de empleados
  - NO usar fotos de personas reales sin permiso

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Página compleja con múltiples secciones y diseño visual
  - **Skills**: [`frontend-ui-ux`, `writing`]
    - UI/UX para diseño atractivo
    - Writing para contenido de marca

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 9, 11, 12)
  - **Blocks**: Task 14
  - **Blocked By**: None

  **References**:
  **Pattern References**:
  - `src/pages/index.astro:96-185` - Sección "Por qué Guardman" como referencia de estilo
  - `src/data/site.ts` - Información de empresa existente

  **Acceptance Criteria**:
  - [ ] Hero section con título atractivo
  - [ ] Sección de historia (2-3 párrafos)
  - [ ] Cards de misión/visión/valores
  - [ ] Grid de equipo (3-4 personas con placeholder)
  - [ ] Cifras clave animadas o destacadas
  - [ ] CTA final

  **QA Scenarios**:

  ```
  Scenario: Página nosotros completa
    Tool: Playwright
    Steps:
      1. Navigate to http://localhost:4321/nosotros
      2. Verify hero section visible
      3. Scroll to team section
      4. Verify 3+ team member cards visible
      5. Verify stats/cifras section visible
    Expected Result: About page renders all sections
    Evidence: .sisyphus/evidence/task-10-nosotros.png
  ```

  **Commit**: YES
  - Message: `feat(pages): add /nosotros about page with team`
  - Files: `src/pages/nosotros.astro`

---

- [x] 11. Crear /carreras.astro

  **What to do**:
  - Crear página de carreras/trabajo
  - Secciones:
    - Hero: "Únete al equipo Guardman"
    - Beneficios de trabajar (4-5 items con iconos)
    - Vacantes disponibles (3-4 puestos genéricos de seguridad)
    - Formulario de contacto/postulación (usar ConvexContactForm o similar)
    - CTA a WhatsApp

  **Must NOT do**:
  - NO crear sistema de aplicación real (solo formulario de contacto)
  - NO prometer salarios específicos

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Página con formulario y lista de items
  - **Skills**: [`frontend-ui-ux`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 9, 10, 12)
  - **Blocks**: Task 14
  - **Blocked By**: None

  **References**:
  **Pattern References**:
  - `src/pages/contacto.astro` - Uso de ConvexContactForm
  - `src/components/forms/ConvexContactForm.tsx` - Componente de formulario

  **Acceptance Criteria**:
  - [ ] Hero section
  - [ ] Lista de beneficios
  - [ ] 3-4 vacantes con descripción
  - [ ] Formulario de contacto funcional
  - [ ] Link a WhatsApp

  **QA Scenarios**:

  ```
  Scenario: Página carreras completa
    Tool: Playwright
    Steps:
      1. Navigate to http://localhost:4321/carreras
      2. Verify benefits section visible
      3. Verify 3+ job listings visible
      4. Verify contact form visible
      5. Fill form with test data
      6. Submit form
    Expected Result: Careers page with working form
    Evidence: .sisyphus/evidence/task-11-carreras.png
  ```

  **Commit**: YES
  - Message: `feat(pages): add /carreras careers page with job listings`
  - Files: `src/pages/carreras.astro`

---

- [x] 12. Crear 5 artículos de blog

  **What to do**:
  - Crear 5 archivos .md en `src/content/blog/`
  - Temas sugeridos:
    1. "5 Consejos de Seguridad para Condominios"
    2. "Por qué elegir guardias OS10 certificados"
    3. "Tecnología Ajax: Alarmas del futuro"
    4. "Seguridad en eventos masivos: mejores prácticas"
    5. "Cómo elegir una empresa de seguridad en Chile"
  - Cada artículo: 300-500 palabras, tags, author, pubDate, image placeholder

  **Must NOT do**:
  - NO crear contenido muy largo
  - NO usar contenido copyrighted

  **Recommended Agent Profile**:
  - **Category**: `writing`
    - Reason: Creación de contenido textual
  - **Skills**: [`writing`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 9, 10, 11)
  - **Blocks**: Task 14
  - **Blocked By**: None

  **References**:
  **Pattern References**:
  - `src/content/config.ts` - Schema de blog collection
  - `src/pages/blog/index.astro` - Cómo se renderizan los posts

  **Acceptance Criteria**:
  - [ ] 5 archivos .md creados en src/content/blog/
  - [ ] Cada archivo tiene frontmatter válido (title, description, pubDate, author, tags)
  - [ ] Blog index muestra los 5 artículos
  - [ ] Cada artículo es accesible via /blog/[slug]

  **QA Scenarios**:

  ```
  Scenario: Blog con 5 artículos
    Tool: Playwright
    Steps:
      1. Navigate to http://localhost:4321/blog
      2. Verify 5 article cards visible
      3. Click first article
      4. Verify article content renders
    Expected Result: Blog shows 5 articles
    Evidence: .sisyphus/evidence/task-12-blog.png
  ```

  **Commit**: YES
  - Message: `feat(blog): add 5 sample blog articles`
  - Files: `src/content/blog/*.md`

---

- [x] 13. Build verification

  **What to do**:
  - Ejecutar `npm run build` completo
  - Verificar que no hay errores de build
  - Verificar que todas las rutas se generan correctamente

  **Must NOT do**:
  - NO modificar código para pasar build si rompe funcionalidad

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with Tasks 14, 15, 16)
  - **Blocks**: Task 16
  - **Blocked By**: Task 2, Task 3 (TypeScript fixes)

  **Acceptance Criteria**:
  - [ ] `npm run build` completa sin errores
  - [ ] Dist folder contiene todas las páginas esperadas

  **QA Scenarios**:

  ```
  Scenario: Build exitoso
    Tool: Bash
    Steps:
      1. Run: npm run build
      2. Check exit code = 0
    Expected Result: Build succeeds
    Evidence: .sisyphus/evidence/task-13-build.txt
  ```

  **Commit**: NO

---

- [x] 14. Playwright QA - verificar todos los links

  **What to do**:
  - Usar Playwright para navegar todo el sitio
  - Verificar que todos los links del header funcionan
  - Verificar que todos los links del footer funcionan
  - Verificar que todas las páginas nuevas renderizan
  - Capturar screenshots de evidencia

  **Must NOT do**:
  - NO modificar código

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: QA exhaustivo del sitio completo
  - **Skills**: [`playwright`]
    - Para automatización de browser

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with Tasks 13, 15, 16)
  - **Blocks**: Task 16
  - **Blocked By**: All previous tasks (Tasks 4, 5, 6, 7, 8, 9, 10, 11, 12, 13)

  **Acceptance Criteria**:
  - [ ] Todos los links de header funcionan (sin 404)
  - [ ] Todos los links de footer funcionan (sin 404)
  - [ ] Todas las páginas nuevas cargan correctamente
  - [ ] Screenshots guardados en .sisyphus/evidence/

  **QA Scenarios**:

  ```
  Scenario: QA completo del sitio
    Tool: Playwright
    Steps:
      1. Start from homepage
      2. Test all header navigation links
      3. Test all footer links
      4. Visit each new page (/servicios, /industrias, /nosotros, /carreras, /privacidad, /terminos)
      5. Visit blog and test article links
    Expected Result: All links work, no 404s
    Evidence: .sisyphus/evidence/task-14-full-qa.png
  ```

  **Commit**: NO

---

- [x] 15. TypeCheck verification

  **What to do**:
  - Ejecutar `npm run typecheck`
  - Verificar 0 errores de TypeScript
  - Si hay errores, reportar para fix

  **Must NOT do**:
  - NO usar @ts-ignore para ocultar errores

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with Tasks 13, 14, 16)
  - **Blocks**: Task 16
  - **Blocked By**: Task 2, Task 3

  **Acceptance Criteria**:
  - [ ] `npm run typecheck` pasa sin errores

  **QA Scenarios**:

  ```
  Scenario: TypeScript sin errores
    Tool: Bash
    Steps:
      1. Run: npm run typecheck
      2. Verify exit code = 0
    Expected Result: TypeCheck passes
    Evidence: .sisyphus/evidence/task-15-typecheck.txt
  ```

  **Commit**: NO

---

- [x] 16. Final cleanup + commit

  **What to do**:
  - Review final de todos los cambios
  - Commit consolidado o commits individuales por feature
  - Push si es necesario

  **Must NOT do**:
  - NO hacer force push
  - NO incluir archivos sensibles (.env)

  **Recommended Agent Profile**:
  - **Category**: `git`
  - **Skills**: [`git-master`]

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 4 (sequential after 13, 14, 15)
  - **Blocks**: None (final task)
  - **Blocked By**: Task 14, Task 15

  **Acceptance Criteria**:
  - [ ] Todos los cambios commiteados
  - [ ] Mensajes de commit descriptivos
  - [ ] Branch limpia

  **QA Scenarios**:

  ```
  Scenario: Git status limpio
    Tool: Bash
    Steps:
      1. Run: git status
      2. Verify "nothing to commit, working tree clean"
    Expected Result: Clean working tree
    Evidence: .sisyphus/evidence/task-16-git-status.txt
  ```

  **Commit**: YES
  - Message: `chore: final cleanup after completing all pages`
  - Files: All modified files

---

## Success Criteria

### Verification Commands

```bash
npm run typecheck   # Expected: exit code 0
npm run build       # Expected: exit code 0
npm run dev         # Expected: server starts on :4321
```

### Final Checklist

- [ ] Todos los links del header funcionan sin 404
- [ ] Todos los links del footer funcionan sin 404
- [ ] Página /servicios renderiza con 6 servicios
- [ ] Página /industrias renderiza con 8 industrias
- [ ] Página /nosotros completa con equipo
- [ ] Página /carreras con vacantes y formulario
- [ ] Páginas /privacidad y /terminos funcionan
- [ ] Blog muestra 5 artículos
- [ ] TypeScript pasa sin errores
- [ ] Build completa sin errores
