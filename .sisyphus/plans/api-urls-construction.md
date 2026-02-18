# Plan: URLs y Backend para Frontend 100% Operativo

## TL;DR

> **Quick Summary**: Conectar todas las pantallas del frontend a Convex para que funcionen con datos reales. Reemplazar formulario roto del homepage, conectar admin panel a datos reales, y crear vista detalle de leads con edición de estado.
>
> **Deliverables**:
>
> - Homepage con formulario funcional (ConvexLeadForm)
> - Admin Dashboard con métricas reales
> - Admin Leads conectado a Convex
> - Nueva página de detalle de lead
> - Captura de UTM params
>
> **Estimated Effort**: Medium
> **Parallel Execution**: YES - 3 waves
> **Critical Path**: Task 1 → Task 3 → Task 5

---

## Context

### Original Request

"analiza todo el proyecto, identifica las url que hay que construir para que todas las pantallas del fronted esten 100% operativas"

### Interview Summary

**Key Discussions**:

- **Enfoque técnico**: Convex Directo (no API REST) - ya configurado y funcionando en /cotizar y /contacto
- **Homepage**: Formulario roto - POST a `/api/leads` que no existe. Solución: ConvexLeadForm
- **Admin Panel**: Usa mock data, necesita conectarse a Convex
- **UTM params**: Schema ya tiene campos, solo falta implementar captura

**Research Findings**:

- Convex ya tiene 6 funciones: createLead, getLeads, getLeadsByStatus, getLeadById, getLeadsCount, updateLeadStatus
- Schema tiene campos UTM: utm_source, utm_medium, utm_campaign
- Admin usa cookie simple para auth (PUBLIC_ADMIN_PASSWORD)
- Mock data en admin/leads.astro tiene estructura compatible con Convex

### Metis Review

**Identified Gaps** (addressed):

- ✅ Schema verification: Convex YA tiene campos UTM
- ✅ Mock data structure = Convex structure (compatible)
- ✅ Status values: new, contacted, qualified, converted, lost (todos en schema)
- ⚠️ Edge cases: empty state, error handling, invalid lead ID (added to tasks)

---

## Work Objectives

### Core Objective

Conectar TODAS las pantallas del frontend a datos reales de Convex, eliminando mock data y formularios rotos.

### Concrete Deliverables

- `src/pages/index.astro` - Formulario funcional con ConvexLeadForm
- `src/pages/admin/index.astro` - Dashboard con métricas reales
- `src/pages/admin/leads.astro` - Lista conectada a Convex
- `src/pages/admin/leads/[id].astro` - NUEVA: Detalle de lead
- `src/components/forms/LeadForm.tsx` - Captura de UTMs

### Definition of Done

- [ ] Homepage: Formulario envía leads a Convex (verificar con `npx convex run leads:getLeads`)
- [ ] Admin Dashboard: Muestra conteos reales (no "--")
- [ ] Admin Leads: Lista muestra datos de Convex, paginación funciona
- [ ] Admin Lead Detail: Página nueva accesible, muestra todos los campos
- [ ] Status Update: Cambio de estado persiste en Convex
- [ ] UTMs: Leads capturan utm_source, utm_medium, utm_campaign de URL params

### Must Have

- Todos los formularios deben enviar a Convex
- Admin debe mostrar datos reales (no mock)
- Estados de loading y error visuales
- UTM params capturados en leads

### Must NOT Have (Guardrails)

- NO crear endpoints REST (/api/leads, /api/admin/leads)
- NO modificar schema de Convex
- NO modificar formularios /cotizar y /contacto (ya funcionan)
- NO agregar sistema de autenticación
- NO agregar export CSV, email notifications, etc.

---

## Verification Strategy (MANDATORY)

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed. No exceptions.

### Test Decision

- **Infrastructure exists**: NO (no hay tests automatizados)
- **Automated tests**: None
- **Framework**: none
- **Agent-Executed QA**: ALWAYS (mandatory for all tasks)

### QA Policy

Every task MUST include agent-executed QA scenarios.
Evidence saved to `.sisyphus/evidence/task-{N}-{scenario-slug}.{ext}`.

| Deliverable Type | Verification Tool             | Method                           |
| ---------------- | ----------------------------- | -------------------------------- |
| Frontend/UI      | Playwright (playwright skill) | Navigate, fill forms, assert DOM |
| React Components | Bash + visual inspection      | Start dev server, screenshot     |

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately — foundation + homepage):
├── Task 1: Fix Homepage Form - Replace with ConvexLeadForm [visual-engineering]
├── Task 2: Add UTM Capture to LeadForm [quick]
└── Task 3: Connect Admin Dashboard to Convex [quick]

Wave 2 (After Wave 1 — admin functionality):
├── Task 4: Connect Admin Leads List to Convex [quick]
├── Task 5: Create Admin Lead Detail Page [visual-engineering]
└── Task 6: Implement Status Update Functionality [quick]

Wave 3 (After Wave 2 — polish + edge cases):
├── Task 7: Add Empty State to Admin Leads [quick]
├── Task 8: Add Error Handling to Forms [quick]
└── Task 9: Add 404 for Invalid Lead ID [quick]

Wave FINAL (After ALL tasks — verification):
├── Task F1: Plan compliance audit (oracle)
├── Task F2: Code quality review (unspecified-high)
└── Task F3: Manual QA - Full flow test (unspecified-high)

Critical Path: Task 1 → Task 4 → Task 5
Parallel Speedup: ~50% faster than sequential
Max Concurrent: 3 (Wave 1)
```

### Dependency Matrix

| Task  | Depends On | Blocks | Wave  |
| ----- | ---------- | ------ | ----- |
| 1     | —          | 4      | 1     |
| 2     | —          | —      | 1     |
| 3     | —          | —      | 1     |
| 4     | 1          | 5, 6   | 2     |
| 5     | 4          | —      | 2     |
| 6     | 4          | —      | 2     |
| 7     | 4          | —      | 3     |
| 8     | 1, 4       | —      | 3     |
| 9     | 5          | —      | 3     |
| F1-F3 | ALL        | —      | FINAL |

### Agent Dispatch Summary

| Wave  | # Parallel | Tasks → Agent Category                                          |
| ----- | ---------- | --------------------------------------------------------------- |
| 1     | **3**      | T1 → `visual-engineering`, T2 → `quick`, T3 → `quick`           |
| 2     | **3**      | T4 → `quick`, T5 → `visual-engineering`, T6 → `quick`           |
| 3     | **3**      | T7 → `quick`, T8 → `quick`, T9 → `quick`                        |
| FINAL | **3**      | F1 → `oracle`, F2 → `unspecified-high`, F3 → `unspecified-high` |

---

## TODOs

- [ ] 1. **Fix Homepage Form - Replace with ConvexLeadForm**

  **What to do**:
  - En `src/pages/index.astro`, reemplazar el formulario HTML (líneas 251-332) por `<ConvexLeadForm client:load source="homepage" />`
  - Importar el componente: `import ConvexLeadForm from '@/components/forms/ConvexLeadForm';`
  - Eliminar el formulario HTML manual
  - Asegurar que el formulario funciona igual que en /cotizar

  **Must NOT do**:
  - NO modificar el styling del section (mantener bg-gray-800, etc.)
  - NO crear endpoint /api/leads
  - NO modificar ConvexLeadForm component

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: UI modification requiring React integration in Astro
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Pattern matching from /cotizar to /, React+Astro integration

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 2, 3)
  - **Blocks**: Task 4 (Admin needs homepage working)
  - **Blocked By**: None (can start immediately)

  **References**:

  **Pattern References** (existing code to follow):
  - `src/pages/cotizar.astro:128` - ConvexLeadForm usage pattern: `<ConvexLeadForm client:load source="cotizar" />`
  - `src/pages/contacto.astro:70` - ConvexContactForm usage pattern (alternative reference)

  **Component References**:
  - `src/components/forms/ConvexLeadForm.tsx` - The wrapper component to use
  - `src/components/forms/LeadForm.tsx` - The underlying form with validation

  **WHY Each Reference Matters**:
  - `/cotizar.astro:128` shows the EXACT syntax for ConvexLeadForm integration
  - `/contacto.astro:70` shows alternative pattern in different layout context
  - `ConvexLeadForm.tsx` is the component that provides Convex context
  - `LeadForm.tsx` shows what fields the form includes (nombre, telefono, email, servicio, ciudad, mensaje)

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Homepage form submits successfully
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running at localhost:4321, Convex configured
    Steps:
      1. Navigate to http://localhost:4321/
      2. Scroll to CTA section (id="cta-final")
      3. Fill field "#nombre" with "Test Usuario"
      4. Fill field "#telefono" with "+56 9 1234 5678"
      5. Fill field "#email" with "test@example.com"
      6. Select "#servicio" option "Guardias de Seguridad"
      7. Click button text "Enviar solicitud"
    Expected Result: Success message appears "¡Mensaje enviado!"
    Failure Indicators: 404 error, form doesn't submit, validation errors
    Evidence: .sisyphus/evidence/task-1-homepage-submit.png

  Scenario: Form validation works
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running
    Steps:
      1. Navigate to http://localhost:4321/
      2. Scroll to form section
      3. Click submit button without filling fields
    Expected Result: Validation errors appear for required fields
    Failure Indicators: Form submits with empty fields, no error messages
    Evidence: .sisyphus/evidence/task-1-validation.png
  ```

  **Commit**: YES
  - Message: `fix(homepage): replace broken form with ConvexLeadForm`
  - Files: `src/pages/index.astro`

---

- [ ] 2. **Add UTM Capture to LeadForm**

  **What to do**:
  - En `src/components/forms/LeadForm.tsx`, implementar el useEffect vacío (líneas 67-72)
  - Capturar URL params: utm_source, utm_medium, utm_campaign
  - Pasarlos al createLead mutation
  - Agregar campos UTM al estado del formulario

  **Must NOT do**:
  - NO modificar schema de Convex
  - NO agregar validación de UTMs (son opcionales)
  - NO modificar otros formularios

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Simple addition of URL param parsing
  - **Skills**: []
    - No special skills needed - straightforward React code

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 3)
  - **Blocks**: None
  - **Blocked By**: None (can start immediately)

  **References**:

  **Pattern References**:
  - `src/components/forms/LeadForm.tsx:67-72` - Empty useEffect where UTM capture should go
  - `src/components/forms/LeadForm.tsx:181-189` - createLead call where UTMs should be passed

  **Schema References**:
  - `convex/schema.ts` - Shows utm_source, utm_medium, utm_campaign are already in schema
  - `convex/leads.ts:43-55` - createLead mutation already accepts UTM params

  **WHY Each Reference Matters**:
  - Lines 67-72 is WHERE to add the UTM capture logic
  - Lines 181-189 is WHERE to pass UTMs to the mutation
  - Schema confirms UTMs are supported - no schema changes needed

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: UTM params captured on form submit
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running
    Steps:
      1. Navigate to http://localhost:4321/cotizar?utm_source=google&utm_medium=cpc&utm_campaign=summer2024
      2. Fill all required form fields
      3. Submit form
      4. Check Convex for the new lead
    Expected Result: Lead in Convex has utm_source="google", utm_medium="cpc", utm_campaign="summer2024"
    Failure Indicators: UTM fields are null/undefined in Convex
    Evidence: .sisyphus/evidence/task-2-utm-capture.json

  Scenario: Form works without UTM params
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running
    Steps:
      1. Navigate to http://localhost:4321/cotizar (no UTMs)
      2. Fill and submit form
    Expected Result: Form submits successfully, UTM fields are null/undefined (not errors)
    Failure Indicators: Form fails when no UTMs present
    Evidence: .sisyphus/evidence/task-2-no-utm.png
  ```

  **Commit**: YES
  - Message: `feat(forms): add UTM parameter capture`
  - Files: `src/components/forms/LeadForm.tsx`

---

- [ ] 3. **Connect Admin Dashboard to Convex**

  **What to do**:
  - En `src/pages/admin/index.astro`, convertir a página cliente para usar Convex hooks
  - Reemplazar los "--" por datos reales usando `useQuery(api.leads.getLeadsCount)`
  - Crear componente React AdminDashboard si es necesario para usar hooks

  **Must NOT do**:
  - NO agregar gráficos o visualizaciones
  - NO modificar layout del admin
  - NO crear nuevos endpoints

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Simple data binding from Convex to existing UI
  - **Skills**: []
    - No special skills needed

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 2)
  - **Blocks**: None
  - **Blocked By**: None (can start immediately)

  **References**:

  **Pattern References**:
  - `src/pages/admin/leads.astro` - Shows mock data structure to replace
  - `src/components/forms/ConvexLeadForm.tsx:19-21` - Shows ConvexProvider pattern

  **Convex References**:
  - `convex/leads.ts:142-164` - getLeadsCount function that returns { total, new, contacted, qualified, converted, lost }
  - `src/lib/convex.ts` - Convex client setup

  **WHY Each Reference Matters**:
  - admin/leads.astro shows the current mock data structure we're replacing
  - ConvexProvider pattern shows how to wrap components for Convex access
  - getLeadsCount is the exact function to call for dashboard stats

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Dashboard shows real lead counts
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running, logged into admin, Convex has leads
    Steps:
      1. Navigate to http://localhost:4321/admin
      2. Check the leads count card
    Expected Result: Shows actual number (not "--"), matches `npx convex run leads:getLeadsCount`
    Failure Indicators: Still shows "--" or "undefined"
    Evidence: .sisyphus/evidence/task-3-dashboard.png

  Scenario: Dashboard handles empty leads
    Tool: Playwright (playwright skill)
    Preconditions: Convex has 0 leads
    Steps:
      1. Navigate to http://localhost:4321/admin
    Expected Result: Shows "0" in cards (not "--" or error)
    Failure Indicators: Error, undefined, or crash
    Evidence: .sisyphus/evidence/task-3-empty.png
  ```

  **Commit**: YES
  - Message: `feat(admin): connect dashboard to Convex`
  - Files: `src/pages/admin/index.astro`, optionally `src/components/admin/Dashboard.tsx`

---

- [ ] 4. **Connect Admin Leads List to Convex**

  **What to do**:
  - En `src/pages/admin/leads.astro`, eliminar mockLeads (líneas 5-31)
  - Agregar ConvexProvider y useQuery para obtener datos reales
  - Mantener funcionalidad de filtros (status, fecha) - filtrar en cliente
  - Mantener paginación (ya implementada en JavaScript)

  **Must NOT do**:
  - NO modificar estructura de tabla
  - NO cambiar estilos
  - NO eliminar funcionalidad de export CSV

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Replace mock data with Convex query, keep existing UI
  - **Skills**: []
    - No special skills needed

  **Parallelization**:
  - **Can Run In Parallel**: NO - depends on Task 1
  - **Parallel Group**: Wave 2 (with Tasks 5, 6 after Task 1 completes)
  - **Blocks**: Task 5, 6
  - **Blocked By**: Task 1 (homepage form - validates Convex integration pattern)

  **References**:

  **Pattern References**:
  - `src/components/forms/ConvexLeadForm.tsx` - Shows ConvexProvider wrapper pattern
  - `src/pages/admin/leads.astro:262-605` - Existing JavaScript for filtering/pagination to preserve

  **Convex References**:
  - `convex/leads.ts:74-92` - getLeads query with pagination support
  - `convex/leads.ts:95-115` - getLeadsByStatus for status filtering

  **WHY Each Reference Matters**:
  - ConvexProvider pattern shows how to enable Convex in Astro pages
  - Existing JS needs to work with real data instead of mockLeads
  - getLeads returns paginated results we can use

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Admin leads shows real data
    Tool: Playwright (playwright skill)
    Preconditions: Logged into admin, Convex has leads
    Steps:
      1. Navigate to http://localhost:4321/admin/leads
      2. Verify table has rows with real data
    Expected Result: Table shows leads from Convex, "mock" notice is gone
    Failure Indicators: Still shows "Modo de desarrollo" warning, table is empty with leads in Convex
    Evidence: .sisyphus/evidence/task-4-leads-list.png

  Scenario: Status filter works with real data
    Tool: Playwright (playwright skill)
    Preconditions: Leads with different statuses in Convex
    Steps:
      1. Navigate to /admin/leads
      2. Select status filter "Nuevo"
    Expected Result: Table shows only leads with status="new"
    Failure Indicators: Shows all leads, filter doesn't work
    Evidence: .sisyphus/evidence/task-4-filter.png

  Scenario: Pagination works
    Tool: Playwright (playwright skill)
    Preconditions: More than 10 leads in Convex
    Steps:
      1. Navigate to /admin/leads
      2. Click "Siguiente" pagination button
    Expected Result: Shows next page of leads, page indicator updates
    Failure Indicators: No change, or error
    Evidence: .sisyphus/evidence/task-4-pagination.png
  ```

  **Commit**: YES
  - Message: `feat(admin): connect leads list to Convex`
  - Files: `src/pages/admin/leads.astro`

---

- [ ] 5. **Create Admin Lead Detail Page**

  **What to do**:
  - Crear `src/pages/admin/leads/[id].astro` - nueva página
  - Usar `useQuery(api.leads.getLeadById)` para obtener lead
  - Mostrar todos los campos: nombre, telefono, email, servicio, ciudad, mensaje, UTMs, status, fecha
  - Agregar dropdown para cambiar status con `useMutation(api.leads.updateLeadStatus)`
  - Link desde tabla de leads (agregar columna de acciones o hacer row clickeable)

  **Must NOT do**:
  - NO permitir edición de campos (solo status)
  - NO agregar funcionalidad de eliminar
  - NO crear formulario de edición

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: New page creation with React integration
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: New page design matching existing admin style

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 4, 6)
  - **Blocks**: Task 9 (404 handling)
  - **Blocked By**: Task 4 (need leads list to link to detail)

  **References**:

  **Pattern References**:
  - `src/pages/admin/leads.astro` - Use same layout and styling
  - `src/layouts/AdminLayout.astro` - Layout to use
  - `src/pages/servicios/[slug].astro` - Pattern for dynamic Astro pages

  **Convex References**:
  - `convex/leads.ts:132-139` - getLeadById query
  - `convex/leads.ts:118-129` - updateLeadStatus mutation
  - `convex/leads.ts:38-43` - StatusConfig with labels and colors

  **WHY Each Reference Matters**:
  - admin/leads.astro shows styling to match
  - AdminLayout is the layout wrapper
  - Dynamic page pattern from servicios/[slug] shows getStaticPaths alternative (but we'll use client-side with id param)
  - getLeadById and updateLeadStatus are the Convex functions to use

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Lead detail page displays correctly
    Tool: Playwright (playwright skill)
    Preconditions: Logged into admin, lead exists in Convex
    Steps:
      1. Navigate to /admin/leads/[valid-lead-id]
      2. Check all fields are displayed
    Expected Result: Shows nombre, telefono, email, servicio, ciudad, mensaje, UTMs, status, fecha
    Failure Indicators: Missing fields, error, blank page
    Evidence: .sisyphus/evidence/task-5-detail.png

  Scenario: Status update works
    Tool: Playwright (playwright skill)
    Preconditions: Lead with status="new"
    Steps:
      1. Navigate to /admin/leads/[lead-id]
      2. Select status "Contactado" from dropdown
      3. Verify change persisted
    Expected Result: Status changes to "contacted", badge color updates
    Failure Indicators: Status doesn't change, error on mutation
    Evidence: .sisyphus/evidence/task-5-status-update.png

  Scenario: Can navigate from leads list
    Tool: Playwright (playwright skill)
    Preconditions: Leads in list
    Steps:
      1. Navigate to /admin/leads
      2. Click on a lead name or action button
    Expected Result: Navigates to /admin/leads/[id] for that lead
    Failure Indicators: No navigation, wrong ID
    Evidence: .sisyphus/evidence/task-5-navigation.png
  ```

  **Commit**: YES
  - Message: `feat(admin): add lead detail page with status update`
  - Files: `src/pages/admin/leads/[id].astro`, `src/pages/admin/leads.astro` (for link)

---

- [ ] 6. **Implement Status Update Functionality**

  **What to do**:
  - En la página de detalle (Task 5), ya debería estar el dropdown de status
  - Agregar feedback visual cuando se actualiza (toast o badge animation)
  - Agregar optimistic update para UX más fluida
  - Verificar que status persiste en Convex

  **Must NOT do**:
  - NO agregar más campos editables
  - NO crear historial de cambios
  - NO agregar notificaciones

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Enhancing existing status dropdown with better UX
  - **Skills**: []
    - No special skills needed

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 4, 5)
  - **Blocks**: None
  - **Blocked By**: Task 4 (leads list connection)

  **References**:

  **Convex References**:
  - `convex/leads.ts:118-129` - updateLeadStatus mutation signature
  - `convex/leads.ts:38-43` - Status configuration for UI

  **Pattern References**:
  - React optimistic updates pattern with Convex

  **WHY Each Reference Matters**:
  - updateLeadStatus is the mutation to call
  - Status config shows valid status values and their display

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Status change shows feedback
    Tool: Playwright (playwright skill)
    Preconditions: On lead detail page
    Steps:
      1. Change status from dropdown
    Expected Result: Visual feedback (toast, spinner, or badge animation) confirms change
    Failure Indicators: No feedback, user unsure if change happened
    Evidence: .sisyphus/evidence/task-6-feedback.png

  Scenario: Status persists after page refresh
    Tool: Playwright (playwright skill)
    Preconditions: Status changed to "Contactado"
    Steps:
      1. Refresh the page
    Expected Result: Status still shows "Contactado"
    Failure Indicators: Status reverted to previous value
    Evidence: .sisyphus/evidence/task-6-persist.png
  ```

  **Commit**: YES
  - Message: `feat(admin): add status update with visual feedback`
  - Files: `src/pages/admin/leads/[id].astro`

---

- [ ] 7. **Add Empty State to Admin Leads**

  **What to do**:
  - Cuando no hay leads, mostrar mensaje amigable en lugar de tabla vacía
  - Usar el empty state que ya existe en leads.astro (líneas 226-244)
  - Asegurar que se muestre correctamente cuando Convex retorna []

  **Must NOT do**:
  - NO crear nuevo empty state (usar existente)
  - NO agregar ilustraciones complejas

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Minor UX improvement
  - **Skills**: []
    - No special skills needed

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 8, 9)
  - **Blocks**: None
  - **Blocked By**: Task 4 (leads list connection)

  **References**:

  **Pattern References**:
  - `src/pages/admin/leads.astro:226-244` - Existing empty state HTML

  **WHY Each Reference Matters**:
  - Empty state already exists, just needs to work with real Convex data

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Empty state shows when no leads
    Tool: Playwright (playwright skill)
    Preconditions: Convex has 0 leads
    Steps:
      1. Navigate to /admin/leads
    Expected Result: Shows "No hay leads que coincidan" message, no empty table
    Failure Indicators: Empty table, error, or broken layout
    Evidence: .sisyphus/evidence/task-7-empty-state.png
  ```

  **Commit**: YES
  - Message: `fix(admin): ensure empty state displays correctly`
  - Files: `src/pages/admin/leads.astro`

---

- [ ] 8. **Add Error Handling to Forms**

  **What to do**:
  - Agregar try/catch en formularios con mensajes de error claros
  - Agregar error boundary o fallback cuando Convex no está disponible
  - En LeadForm, el estado "error" ya existe (líneas 475-488) - verificar que funciona

  **Must NOT do**:
  - NO crear sistema de logging
  - NO agregar error tracking service
  - NO modificar flujo existente

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Adding error handling to existing code
  - **Skills**: []
    - No special skills needed

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 7, 9)
  - **Blocks**: None
  - **Blocked By**: Task 1, 4 (forms must exist first)

  **References**:

  **Pattern References**:
  - `src/components/forms/LeadForm.tsx:475-488` - Existing error UI
  - `src/components/forms/LeadForm.tsx:195-198` - Error catch block

  **WHY Each Reference Matters**:
  - Error UI already exists, verify it displays properly
  - Catch block shows where errors are handled

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Form shows error on Convex failure
    Tool: Playwright (playwright skill)
    Preconditions: Simulate Convex unavailable (network offline)
    Steps:
      1. Navigate to /cotizar
      2. Fill and submit form while offline
    Expected Result: Error message appears "Hubo un error al enviar tu mensaje"
    Failure Indicators: Page crashes, no error message, infinite loading
    Evidence: .sisyphus/evidence/task-8-error.png
  ```

  **Commit**: YES
  - Message: `fix(forms): improve error handling`
  - Files: `src/components/forms/LeadForm.tsx`

---

- [ ] 9. **Add 404 for Invalid Lead ID**

  **What to do**:
  - En `/admin/leads/[id].astro`, cuando getLeadById retorna null, mostrar 404
  - Redirigir a /admin/leads con mensaje "Lead no encontrado"
  - O mostrar página 404 con link de vuelta

  **Must NOT do**:
  - NO crear sistema de logging
  - NO agregar analytics

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Simple edge case handling
  - **Skills**: []
    - No special skills needed

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 7, 8)
  - **Blocks**: None
  - **Blocked By**: Task 5 (detail page must exist)

  **References**:

  **Pattern References**:
  - Astro 404 handling patterns

  **WHY Each Reference Matters**:
  - Standard Astro pattern for handling missing dynamic routes

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Invalid lead ID shows error
    Tool: Playwright (playwright skill)
    Steps:
      1. Navigate to /admin/leads/nonexistent-id-12345
    Expected Result: Shows "Lead no encontrado" message or redirects to /admin/leads
    Failure Indicators: Blank page, crash, or shows empty form
    Evidence: .sisyphus/evidence/task-9-404.png
  ```

  **Commit**: YES
  - Message: `fix(admin): handle invalid lead ID`
  - Files: `src/pages/admin/leads/[id].astro`

---

## Final Verification Wave (MANDATORY — after ALL implementation tasks)

- [ ] F1. **Plan Compliance Audit** — `oracle`
      Read the plan end-to-end. For each "Must Have": verify implementation exists (read file, curl endpoint, run command). For each "Must NOT Have": search codebase for forbidden patterns. Check evidence files exist in .sisyphus/evidence/.
      Output: `Must Have [N/N] | Must NOT Have [N/N] | Tasks [N/N] | VERDICT: APPROVE/REJECT`

- [ ] F2. **Code Quality Review** — `unspecified-high`
      Run `npm run check` (typecheck + lint). Review all changed files for: `as any`/`@ts-ignore`, empty catches, console.log in prod, unused imports. Check for AI slop patterns.
      Output: `Build [PASS/FAIL] | Lint [PASS/FAIL] | Files [N clean/N issues] | VERDICT`

- [ ] F3. **Manual QA - Full Flow Test** — `unspecified-high` (+ `playwright` skill)
      Execute full user journey: Homepage form submit → Verify in Convex → Admin view leads → View detail → Change status → Verify persistence. Test with UTM params. Test error scenarios.
      Output: `Flow [PASS/FAIL] | UTMs [PASS/FAIL] | Errors [PASS/FAIL] | VERDICT`

---

## Commit Strategy

| After Task | Message                                                  | Files                             |
| ---------- | -------------------------------------------------------- | --------------------------------- |
| 1          | `fix(homepage): replace broken form with ConvexLeadForm` | src/pages/index.astro             |
| 2          | `feat(forms): add UTM parameter capture`                 | src/components/forms/LeadForm.tsx |
| 3          | `feat(admin): connect dashboard to Convex`               | src/pages/admin/index.astro       |
| 4          | `feat(admin): connect leads list to Convex`              | src/pages/admin/leads.astro       |
| 5          | `feat(admin): add lead detail page with status update`   | src/pages/admin/leads/[id].astro  |
| 6          | `feat(admin): add status update with visual feedback`    | src/pages/admin/leads/[id].astro  |
| 7          | `fix(admin): ensure empty state displays correctly`      | src/pages/admin/leads.astro       |
| 8          | `fix(forms): improve error handling`                     | src/components/forms/LeadForm.tsx |
| 9          | `fix(admin): handle invalid lead ID`                     | src/pages/admin/leads/[id].astro  |

---

## Success Criteria

### Verification Commands

```bash
# Verify Convex has leads
npx convex run leads:getLeadsCount

# Verify homepage form submits
curl -X POST http://localhost:4321/ 2>/dev/null | grep -c "ConvexLeadForm"

# Type check
npm run typecheck

# Lint
npm run lint
```

### Final Checklist

- [ ] Homepage form submits to Convex
- [ ] UTMs captured from URL params
- [ ] Admin dashboard shows real counts
- [ ] Admin leads list shows real data
- [ ] Lead detail page accessible
- [ ] Status update works and persists
- [ ] Empty states display correctly
- [ ] Error handling works
- [ ] Invalid IDs handled gracefully
- [ ] All type checks pass
- [ ] All lint checks pass
