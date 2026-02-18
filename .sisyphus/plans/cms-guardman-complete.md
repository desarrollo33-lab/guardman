# CMS Completo para Guardman (100% Convex)

## TL;DR

> **Quick Summary**: Implementar un CMS completo donde TODO el contenido del sitio se gestione desde Convex. Incluye CRUD para servicios/soluciones, heroes con soporte YouTube/imagen, PSEO para 52 comunas, y panel administrativo con autenticación.
>
> **Deliverables**:
>
> - Schema Convex expandido con 8 tablas nuevas + mejoras a existentes
> - Mutations CRUD para todas las entidades de contenido
> - Panel admin con 12 módulos de gestión
> - Migración de blog de Astro Content Collection a Convex
> - Setup de testing con Vitest
> - Autenticación con Convex Auth
>
> **Estimated Effort**: XL (Large Project)
> **Parallel Execution**: YES - 6 waves
> **Critical Path**: Auth → Schema → Core CRUD → Admin UI → Testing → Migration

---

## Context

### Original Request

> "Realiza un plan para el mapeo completo de todos los elementos del front end para construir el CMS de guardman. Es importante que el 100% del contenido sea basado en convex. Asegurate de que tenga todas las tablas, todos los campos y todas las relaciones necesarias. Los hero pueden usar url de youtube (como el home actualmente) o imagen. Los servicios y productos deben poder agregarse, editarse y eliminarse. FOCO EN PSEO"

### Interview Summary

**Key Discussions**:

- **Frontend Mapping**: 17 páginas identificadas, ~50% contenido hardcoded necesita migración
- **Current State**: 11 tablas Convex existen pero SIN mutations para CMS (solo lectura)
- **Blog Migration**: Actualmente Astro Content Collection → migrar a Convex
- **Heroes**: Soportar YouTube URL O imagen de fondo, con fallback a imagen en móvil
- **PSEO**: 52 comunas usando template (mismo contenido, nombres diferentes)

**Technical Decisions**:

- **Authentication**: Convex Auth (single admin)
- **Editor**: Markdown + Preview
- **Image Storage**: Convex File Storage
- **Blog**: Migrar a Convex (100% Convex goal)
- **Testing**: Vitest setup, tests after implementation
- **i18n**: Solo español
- **Workflow**: Publish direct (no draft workflow)
- **Mobile Heroes**: Fallback a imagen estática

### Metis Review

**Identified Gaps** (addressed):

- **Auth Model**: Single admin confirmed - simpler auth setup
- **PSEO Strategy**: Template injection confirmed - no unique content per commune
- **Mobile Hero Fallback**: Image fallback for mobile devices confirmed
- **Guardrails Set**: No versioning, no workflow, no i18n, no over-engineering

---

## Work Objectives

### Core Objective

Crear un sistema de gestión de contenido (CMS) donde **100% del contenido** del sitio Guardman se almacene y gestione desde Convex, con panel administrativo para CRUD de todas las entidades.

### Concrete Deliverables

- **8 nuevas tablas** Convex: `heroes`, `team_members`, `company_values`, `process_steps`, `stats`, `industries`, `ctas`, `authors`
- **4 tablas mejoradas**: `services`, `solutions`, `communes`, `blog_posts` (tipado + campos nuevos)
- **Mutations CRUD** completas para 12 entidades de contenido
- **12 módulos admin**: Services, Solutions, Heroes, Communes, Blog, FAQs, Partners, Testimonials, Team, Site Config, Stats, CTAs
- **Autenticación Convex Auth** para panel admin
- **Migración de blog** (Astro Content → Convex)
- **Testing setup** con Vitest

### Definition of Done

- [ ] `npx convex schema:check` pasa sin errores
- [ ] Todas las tablas tienen validators tipados (no `v.any()`)
- [ ] CRUD mutations funcionan para todas las entidades
- [ ] Admin panel accesible solo con autenticación
- [ ] Heroes renderizan con YouTube OR imagen
- [ ] 52 páginas PSEO de comunas funcionan
- [ ] Blog posts migrados y accesibles desde Convex
- [ ] `bun test` pasa para todos los módulos

### Must Have

- ✅ 100% contenido en Convex (incluido blog)
- ✅ Heroes soportan YouTube URL OR imagen
- ✅ CRUD completo para servicios y soluciones
- ✅ PSEO para 52 comunas (template-based)
- ✅ Admin panel con autenticación Convex Auth
- ✅ File upload para imágenes (Convex Storage)

### Must NOT Have (Guardrails from Metis)

- ❌ Content versioning/audit history
- ❌ Approval workflows (draft → review → publish)
- ❌ Multi-tenant or multi-language support
- ❌ Rich text editor (Markdown + preview is scope)
- ❌ Image CDN/transformations beyond basic upload
- ❌ Content scheduling
- ❌ Comments on blog posts
- ❌ Analytics integration
- ❌ Generic "reusable CMS" - build for Guardman specifically
- ❌ Over-abstraction (no "reusable components" unless pattern exists 3+ times)
- ❌ Auto-save or revisions

---

## Verification Strategy (MANDATORY)

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed. No exceptions.

### Test Decision

- **Infrastructure exists**: NO
- **Automated tests**: YES (Tests after)
- **Framework**: Vitest
- **Setup included in plan**: YES (Wave 1)

### QA Policy

Every task MUST include agent-executed QA scenarios.
Evidence saved to `.sisyphus/evidence/task-{N}-{scenario-slug}.{ext}`.

- **Frontend/UI**: Use Playwright (playwright skill) — Navigate, interact, assert DOM, screenshot
- **API/Backend**: Use Bash (curl) — Send requests, assert status + response fields
- **Convex Functions**: Use Bash (bun test) — Run unit tests, verify results

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Foundation — can start immediately):
├── Task 1: Vitest setup + test config [quick]
├── Task 2: Convex Auth setup [quick]
├── Task 3: Schema design - new tables [deep]
├── Task 4: Schema fixes - existing tables [quick]
├── Task 5: File storage mutations [quick]
└── Task 6: Admin layout + auth guard [visual-engineering]

Wave 2 (Core CRUD — after Wave 1):
├── Task 7: Services CRUD mutations [quick]
├── Task 8: Solutions CRUD mutations [quick]
├── Task 9: Heroes CRUD mutations [quick]
├── Task 10: Communes CRUD mutations (PSEO) [quick]
├── Task 11: FAQs CRUD mutations [quick]
└── Task 12: Partners CRUD mutations [quick]

Wave 3 (Extended CRUD — after Wave 2):
├── Task 13: Testimonials CRUD mutations [quick]
├── Task 14: Team members CRUD mutations [quick]
├── Task 15: Company values CRUD mutations [quick]
├── Task 16: Stats CRUD mutations [quick]
├── Task 17: Industries CRUD mutations [quick]
├── Task 18: CTAs CRUD mutations [quick]
├── Task 19: Authors CRUD mutations [quick]
└── Task 20: Blog posts CRUD mutations [quick]

Wave 4 (Admin UI — after Wave 3):
├── Task 21: Admin dashboard expansion [visual-engineering]
├── Task 22: Services admin page [visual-engineering]
├── Task 23: Solutions admin page [visual-engineering]
├── Task 24: Heroes admin page [visual-engineering]
├── Task 25: Communes admin page (PSEO) [visual-engineering]
├── Task 26: Blog admin page [visual-engineering]
└── Task 27: Site config admin page [visual-engineering]

Wave 5 (Admin UI Extended + Markdown Editor — after Wave 4):
├── Task 28: FAQs admin page [visual-engineering]
├── Task 29: Partners admin page [visual-engineering]
├── Task 30: Testimonials admin page [visual-engineering]
├── Task 31: Team admin page [visual-engineering]
├── Task 32: Markdown editor component [visual-engineering]
└── Task 33: Image upload component [visual-engineering]

Wave 6 (Frontend Migration — after Wave 5):
├── Task 34: Migrate home page heroes to Convex [quick]
├── Task 35: Migrate servicios page to Convex [quick]
├── Task 36: Migrate nosotros page to Convex [quick]
├── Task 37: Migrate contacto page to Convex [quick]
├── Task 38: Migrate blog from Astro Content [deep]
├── Task 39: Update Hero component for YouTube/image [visual-engineering]
└── Task 40: Mobile hero fallback implementation [quick]

Wave 7 (Testing + Verification — after Wave 6):
├── Task 41: Unit tests for services [quick]
├── Task 42: Unit tests for solutions [quick]
├── Task 43: Unit tests for heroes [quick]
├── Task 44: Unit tests for blog [quick]
├── Task 45: E2E tests for admin panel [deep]
├── Task 46: E2E tests for PSEO pages [deep]
└── Task 47: Integration tests for auth [quick]

Wave FINAL (After ALL tasks — verification):
├── Task F1: Plan compliance audit (oracle)
├── Task F2: Code quality review (unspecified-high)
├── Task F3: Real manual QA (unspecified-high)
└── Task F4: Scope fidelity check (deep)

Critical Path: Task 2 → Task 3 → Task 7-12 → Task 21-27 → Task 34-40 → Task 41-47 → F1-F4
Parallel Speedup: ~60% faster than sequential
Max Concurrent: 8 (Wave 3)
```

### Dependency Matrix (abbreviated)

| Task  | Depends On | Blocks |
| ----- | ---------- | ------ |
| 1-6   | —          | 7-20   |
| 7-12  | 3, 4, 5    | 21-27  |
| 13-20 | 3, 4, 5    | 21-27  |
| 21-27 | 7-20       | 28-33  |
| 28-33 | 21-27      | 34-40  |
| 34-40 | 28-33      | 41-47  |
| 41-47 | 34-40      | F1-F4  |
| F1-F4 | 41-47      | —      |

### Agent Dispatch Summary

- **Wave 1**: **6** tasks — T1-T4 → `quick`, T5 → `quick`, T6 → `visual-engineering`
- **Wave 2**: **6** tasks — All → `quick` (CRUD mutations)
- **Wave 3**: **8** tasks — All → `quick` (CRUD mutations)
- **Wave 4**: **7** tasks — All → `visual-engineering` (Admin UI)
- **Wave 5**: **6** tasks — All → `visual-engineering` (Admin UI + components)
- **Wave 6**: **7** tasks — T34-T38 → `quick`, T39-T40 → `visual-engineering`
- **Wave 7**: **7** tasks — T41-T44,T47 → `quick`, T45-T46 → `deep`
- **FINAL**: **4** tasks — F1 → `oracle`, F2-F3 → `unspecified-high`, F4 → `deep`

---

## TODOs

> Implementation + Test = ONE Task. Never separate.
> EVERY task MUST have: Recommended Agent Profile + Parallelization info + QA Scenarios.

### WAVE 1: Foundation

- [x] 1. Vitest Setup + Test Configuration

  **What to do**:
  - Install Vitest and testing dependencies
  - Create `vitest.config.ts` with proper config for Astro/Convex
  - Add test scripts to `package.json`
  - Create test utilities file for Convex testing

  **Must NOT do**:
  - Don't add Playwright yet (separate task)
  - Don't create actual tests (just setup)

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Simple configuration task
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 2-6)
  - **Blocks**: Tasks 41-47 (testing tasks)
  - **Blocked By**: None

  **References**:
  - `package.json:scripts` - Add test scripts pattern
  - `convex/README.md` - Convex testing patterns

  **Acceptance Criteria**:
  - [ ] `vitest.config.ts` exists and is valid
  - [ ] `bun test` command runs without errors
  - [ ] `package.json` has `"test"` and `"test:watch"` scripts

  **QA Scenarios**:

  ```
  Scenario: Vitest runs successfully
    Tool: Bash
    Steps:
      1. Run `bun test`
    Expected Result: "No tests found" or similar success message
    Failure Indicators: Command fails, module not found errors
    Evidence: .sisyphus/evidence/task-01-vitest-setup.txt

  Scenario: Test config valid
    Tool: Bash
    Steps:
      1. Run `bunx vitest --version`
    Expected Result: Version number output
    Evidence: .sisyphus/evidence/task-01-vitest-version.txt
  ```

- [x] 2. Convex Auth Setup

  **What to do**:
  - Install `@convex-dev/auth` package
  - Configure Convex Auth in `convex/auth.config.ts`
  - Create auth mutations (login, logout, getSession)
  - Add auth provider wrapper for admin components

  **Must NOT do**:
  - Don't implement role-based access (single admin only)
  - Don't add social login providers (just password)
  - Don't modify frontend auth flow yet

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Standard auth setup with Convex
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 3-6)
  - **Blocks**: Task 6, all admin UI tasks
  - **Blocked By**: None

  **References**:
  - `convex/schema.ts` - Existing schema structure
  - Convex Auth docs: https://auth.convex.dev/

  **Acceptance Criteria**:
  - [ ] `@convex-dev/auth` installed
  - [ ] `convex/auth.config.ts` exists with password provider
  - [ ] Auth mutations callable from client
  - [ ] Session query returns user when logged in

  **QA Scenarios**:

  ```
  Scenario: Auth package installed
    Tool: Bash
    Steps:
      1. Run `grep "@convex-dev/auth" package.json`
    Expected Result: Package found in dependencies
    Evidence: .sisyphus/evidence/task-02-auth-package.txt

  Scenario: Auth config exists
    Tool: Bash
    Steps:
      1. Check file exists: `test -f convex/auth.config.ts && echo "exists"`
    Expected Result: "exists"
    Evidence: .sisyphus/evidence/task-02-auth-config.txt
  ```

- [x] 3. Schema Design - New Tables

  **What to do**:
  - Add 8 new tables to `convex/schema.ts`:
    - `heroes` - page_slug, title, subtitle, background (youtube/image), ctas, badges
    - `team_members` - name, role, avatar_url, bio, order
    - `company_values` - title, icon, description, order
    - `process_steps` - page_slug, number, title, description, order
    - `stats` - page_slug, value, label, icon, order
    - `industries` - name, icon, description, order
    - `ctas` - page_slug, headline, buttons, badges, background
    - `authors` - name, avatar_url, bio, role
  - All tables with proper `v.*` validators (no `v.any()`)
  - Add appropriate indexes

  **Must NOT do**:
  - Don't modify existing tables yet (separate task)
  - Don't add seed data (separate task)
  - Don't use `v.any()` anywhere

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: Complex schema design with relationships
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1-2, 4-6)
  - **Blocks**: Tasks 7-20 (CRUD mutations)
  - **Blocked By**: None

  **References**:
  - `convex/schema.ts` - Existing patterns
  - `AGENTS.md:Schema Design` - Best practices
  - Existing tables like `solutions` for field patterns

  **Acceptance Criteria**:
  - [ ] All 8 new tables defined with typed validators
  - [ ] No `v.any()` usage
  - [ ] `npx convex schema:check` passes
  - [ ] Indexes defined for all foreign keys

  **QA Scenarios**:

  ```
  Scenario: Schema validates
    Tool: Bash
    Steps:
      1. Run `npx convex schema:check`
    Expected Result: "Schema is valid" or success message
    Failure Indicators: Validation errors, type errors
    Evidence: .sisyphus/evidence/task-03-schema-valid.txt

  Scenario: No v.any() in schema
    Tool: Bash
    Steps:
      1. Run `grep -c "v.any()" convex/schema.ts` (expect 0 or only in services)
    Expected Result: Count matches only legacy usage
    Evidence: .sisyphus/evidence/task-03-no-vany.txt
  ```

- [x] 4. Schema Fixes - Existing Tables

  **What to do**:
  - Fix `services` table: Replace `v.any()` with proper typed fields
  - Add `is_active` and `order` fields to `services`
  - Add `is_active` and `order` fields to `solutions` if missing
  - Add PSEO fields to `communes`: `hero_title`, `hero_subtitle`, `intro_content`
  - Add `is_published` and proper fields to `blog_posts`
  - Add missing indexes

  **Must NOT do**:
  - Don't delete existing data
  - Don't change existing field names (breaking change)
  - Don't add fields as required (use optional first)

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Schema modifications following patterns
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1-3, 5-6)
  - **Blocks**: Tasks 7-20 (CRUD mutations)
  - **Blocked By**: Task 3 (can be parallel but logical dependency)

  **References**:
  - `convex/schema.ts:services` - Current untyped definition
  - `convex/services.ts` - Actual fields used in seed data
  - `AGENTS.md:Migration Guide` - Safe field addition

  **Acceptance Criteria**:
  - [ ] `services` has typed validators, no `v.any()`
  - [ ] All new fields are optional (migration safe)
  - [ ] `npx convex schema:check` passes
  - [ ] Existing data still accessible

  **QA Scenarios**:

  ```
  Scenario: Services schema typed
    Tool: Bash
    Steps:
      1. Run `grep -A 20 "services:" convex/schema.ts | grep -v "v.any()"`
    Expected Result: No v.any() in services definition
    Evidence: .sisyphus/evidence/task-04-services-typed.txt

  Scenario: Schema still valid
    Tool: Bash
    Steps:
      1. Run `npx convex schema:check`
    Expected Result: Success
    Evidence: .sisyphus/evidence/task-04-schema-check.txt
  ```

- [x] 5. File Storage Mutations

  **What to do**:
  - Create `convex/storage.ts` with file upload mutations
  - `generateUploadUrl` - Get upload URL for client
  - `saveFileMetadata` - Store file info after upload
  - `getFileUrl` - Retrieve file URL
  - `deleteFile` - Remove file from storage
  - Add image validation (size, format)

  **Must NOT do**:
  - Don't create CDN or transformation logic
  - Don't add image cropping features
  - Don't implement galleries

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Standard Convex file storage pattern
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1-4, 6)
  - **Blocks**: Task 33 (image upload component)
  - **Blocked By**: None

  **References**:
  - Convex File Storage docs
  - `convex/schema.ts` - For file metadata structure

  **Acceptance Criteria**:
  - [ ] `convex/storage.ts` exists
  - [ ] Upload URL generation works
  - [ ] File metadata can be saved and retrieved
  - [ ] File deletion works

  **QA Scenarios**:

  ```
  Scenario: Storage file exists
    Tool: Bash
    Steps:
      1. Run `test -f convex/storage.ts && echo "exists"`
    Expected Result: "exists"
    Evidence: .sisyphus/evidence/task-05-storage-exists.txt

  Scenario: Upload mutation callable
    Tool: Bash
    Steps:
      1. Check exports in file: `grep "generateUploadUrl" convex/storage.ts`
    Expected Result: Function found
    Evidence: .sisyphus/evidence/task-05-upload-mutation.txt
  ```

- [x] 6. Admin Layout + Auth Guard

  **What to do**:
  - Update `AdminLayout.astro` with Convex Auth integration
  - Create `AuthGuard` React component for protected routes
  - Create login page at `/admin/login`
  - Add logout functionality
  - Style consistent with existing admin design

  **Must NOT do**:
  - Don't add role-based UI variations
  - Don't create dashboard widgets (separate task)
  - Don't change existing admin pages structure

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: UI component with auth integration
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1-5)
  - **Blocks**: Tasks 21-33 (admin UI pages)
  - **Blocked By**: Task 2 (auth setup)

  **References**:
  - `src/layouts/AdminLayout.astro` - Current layout
  - `src/pages/admin/login.astro` - Existing login page
  - `src/components/admin/ConvexDashboard.tsx` - Auth wrapper pattern

  **Acceptance Criteria**:
  - [ ] `/admin/login` renders login form
  - [ ] Unauthenticated users redirected to login
  - [ ] Authenticated users see admin content
  - [ ] Logout button works

  **QA Scenarios**:

  ```
  Scenario: Login page accessible
    Tool: Playwright
    Steps:
      1. Navigate to `/admin/login`
      2. Verify login form elements exist
    Expected Result: Login form visible with email/password fields
    Evidence: .sisyphus/evidence/task-06-login-page.png

  Scenario: Admin protected without auth
    Tool: Playwright
    Steps:
      1. Navigate to `/admin` (not logged in)
      2. Verify redirect to login
    Expected Result: Redirected to /admin/login
    Evidence: .sisyphus/evidence/task-06-auth-redirect.png
  ```

---

### WAVE 2: Core CRUD Mutations

- [x] 7. Services CRUD Mutations

  **What to do**:
  - Create `convex/services.ts` mutations:
    - `createService` - Insert new service
    - `updateService` - Update by ID
    - `deleteService` - Soft delete (set is_active=false)
    - `reorderServices` - Update order field
  - Add proper argument validators
  - Follow existing query patterns

  **Must NOT do**:
  - Don't add versioning
  - Don't cascade delete related items
  - Don't add workflow states

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Standard CRUD pattern
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 8-12)
  - **Blocks**: Task 22 (services admin page)
  - **Blocked By**: Tasks 3, 4 (schema)

  **References**:
  - `convex/services.ts` - Existing queries
  - `convex/leads.ts` - CRUD mutation patterns
  - `AGENTS.md` - Convex best practices

  **Acceptance Criteria**:
  - [ ] All 4 CRUD mutations exist
  - [ ] `createService` validates all required fields
  - [ ] `updateService` only updates provided fields
  - [ ] `deleteService` sets is_active=false

  **QA Scenarios**:

  ```
  Scenario: Create service mutation works
    Tool: Bash (convex run)
    Steps:
      1. Run `npx convex run services:createService '{"title":"Test","slug":"test","description":"Test desc"}'`
    Expected Result: Returns new service ID
    Evidence: .sisyphus/evidence/task-07-create-service.txt

  Scenario: List services includes new
    Tool: Bash (convex run)
    Steps:
      1. Run `npx convex run services:getAllServices`
    Expected Result: Returns array with test service
    Evidence: .sisyphus/evidence/task-07-list-services.txt
  ```

- [x] 8. Solutions CRUD Mutations

  **What to do**:
  - Create mutations in `convex/solutions.ts`:
    - `createSolution`, `updateSolution`, `deleteSolution`, `reorderSolutions`
  - Handle `relatedServices` array field
  - Follow services pattern exactly

  **Must NOT do**:
  - Don't auto-link services (manual linking only)
  - Don't add features beyond CRUD

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 7, 9-12)
  - **Blocks**: Task 23 (solutions admin page)
  - **Blocked By**: Tasks 3, 4

  **References**:
  - `convex/solutions.ts` - Existing queries
  - Task 7 pattern

  **Acceptance Criteria**:
  - [ ] All CRUD mutations exist and work
  - [ ] `relatedServices` array handled correctly

  **QA Scenarios**:

  ```
  Scenario: Create solution mutation works
    Tool: Bash (convex run)
    Steps:
      1. Create solution with `npx convex run solutions:createSolution`
    Expected Result: Returns new ID
    Evidence: .sisyphus/evidence/task-08-create-solution.txt
  ```

- [x] 9. Heroes CRUD Mutations

  **What to do**:
  - Create `convex/heroes.ts`:
    - `createHero`, `updateHero`, `deleteHero`, `getHeroByPage`, `getAllHeroes`
  - Handle both YouTube and image background types
  - Support CTAs and trust badges arrays
  - Add validation for background_type enum

  **Must NOT do**:
  - Don't validate YouTube URLs (just store)
  - Don't add multiple heroes per page (one per page)

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 7-8, 10-12)
  - **Blocks**: Task 24 (heroes admin page), Task 39 (hero component)
  - **Blocked By**: Task 3

  **References**:
  - `convex/content_blocks.ts` - Similar pattern
  - `src/components/sections/Hero.astro` - Field structure needed

  **Acceptance Criteria**:
  - [ ] CRUD mutations for heroes exist
  - [ ] YouTube OR image background supported
  - [ ] CTAs and badges arrays stored correctly
  - [ ] `getHeroByPage` returns hero for page slug

  **QA Scenarios**:

  ```
  Scenario: Create hero with YouTube
    Tool: Bash (convex run)
    Steps:
      1. Create hero with background_type="youtube", youtube_id="abc123"
    Expected Result: Hero created with YouTube fields
    Evidence: .sisyphus/evidence/task-09-hero-youtube.txt

  Scenario: Create hero with image
    Tool: Bash (convex run)
    Steps:
      1. Create hero with background_type="image", image_url="..."
    Expected Result: Hero created with image field
    Evidence: .sisyphus/evidence/task-09-hero-image.txt
  ```

- [x] 10. Communes CRUD Mutations (PSEO)

  **What to do**:
  - Create mutations in `convex/communes.ts` or new `convex/pseo.ts`:
    - `createCommune`, `updateCommune`, `deleteCommune`, `reorderCommunes`
    - `updateCommuneSEO` - Update meta fields
  - Add PSEO-specific fields handling

  **Must NOT do**:
  - Don't auto-generate content (template-based in frontend)
  - Don't add unique content fields per commune

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 7-9, 11-12)
  - **Blocks**: Task 25 (communes admin page)
  - **Blocked By**: Task 4

  **References**:
  - `convex/locations.ts` - Existing commune queries
  - `convex/communes.ts` - Existing patterns

  **Acceptance Criteria**:
  - [ ] CRUD mutations for communes exist
  - [ ] SEO fields updatable separately
  - [ ] Zone assignment works

  **QA Scenarios**:

  ```
  Scenario: Update commune SEO
    Tool: Bash (convex run)
    Steps:
      1. Update meta_title and meta_description for a commune
    Expected Result: Fields updated successfully
    Evidence: .sisyphus/evidence/task-10-commune-seo.txt
  ```

- [x] 11. FAQs CRUD Mutations

  **What to do**:
  - Create mutations in `convex/faqs.ts`:
    - `createFaq`, `updateFaq`, `deleteFaq`, `reorderFaqs`
  - Handle category field
  - Order management

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2
  - **Blocks**: Task 28 (FAQs admin page)
  - **Blocked By**: Task 4

  **References**:
  - `convex/faqs.ts` - Existing queries

- [x] 12. Partners CRUD Mutations

  **What to do**:
  - Create mutations in `convex/partners.ts`:
    - `createPartner`, `updatePartner`, `deletePartner`, `reorderPartners`
  - Handle type field (certification, client, tech_partner)

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2
  - **Blocks**: Task 29 (partners admin page)
  - **Blocked By**: Task 4

---

### WAVE 3: Extended CRUD Mutations

- [x] 13. Testimonials CRUD Mutations
  - Create mutations in new `convex/testimonials.ts`
  - `createTestimonial`, `updateTestimonial`, `deleteTestimonial`, `reorderTestimonials`
  - Handle rating validation (1-5), verified flag
  - **Category**: `quick` | **Blocked By**: Task 3 | **Blocks**: Task 30

- [x] 14. Team Members CRUD Mutations
  - Create mutations in new `convex/team_members.ts`
  - CRUD + reorder, handle avatar_url
  - **Category**: `quick` | **Blocked By**: Task 3 | **Blocks**: Task 31

- [x] 15. Company Values CRUD Mutations
  - Create mutations in new `convex/company_values.ts`
  - CRUD + reorder, handle icon field
  - **Category**: `quick` | **Blocked By**: Task 3 | **Blocks**: Task 36 (nosotros page)

- [x] 16. Stats CRUD Mutations
  - Create mutations in new `convex/stats.ts`
  - CRUD by page_slug, reorder
  - **Category**: `quick` | **Blocked By**: Task 3 | **Blocks**: Task 36

- [x] 17. Industries CRUD Mutations
  - Create mutations in new `convex/industries.ts`
  - CRUD + reorder, handle icon
  - **Category**: `quick` | **Blocked By**: Task 3 | **Blocks**: Task 35 (servicios page)

- [x] 18. CTAs CRUD Mutations
  - Create mutations in new `convex/ctas.ts`
  - CRUD by page_slug, handle button objects
  - **Category**: `quick` | **Blocked By**: Task 3 | **Blocks**: Frontend migration tasks

- [x] 19. Authors CRUD Mutations
  - Create mutations in new `convex/authors.ts`
  - CRUD for blog authors
  - **Category**: `quick` | **Blocked By**: Task 3 | **Blocks**: Task 20, Task 26

- [x] 20. Blog Posts CRUD Mutations
  - Create mutations in `convex/blog_posts.ts`:
    - `createPost`, `updatePost`, `deletePost`, `publishPost`, `unpublishPost`
    - `getPosts`, `getPostBySlug`, `getFeaturedPosts`
  - Handle content array (sections)
  - Link to authors via author_id
  - **Category**: `quick` | **Blocked By**: Tasks 3, 19 | **Blocks**: Task 26, Task 38

---

### WAVE 4: Admin UI Pages

- [x] 21. Admin Dashboard Expansion

  **What to do**:
  - Expand `src/components/admin/Dashboard.tsx`
  - Add content management quick links
  - Add content stats (services count, posts count, etc.)
  - Add recent activity section

  **Must NOT do**:
  - Don't add analytics/charts
  - Don't create complex widgets

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with Tasks 22-27)
  - **Blocked By**: Tasks 7-20 (need CRUD mutations)
  - **Blocks**: None (dashboard is standalone)

  **References**:
  - `src/components/admin/Dashboard.tsx` - Current dashboard
  - `src/components/admin/ConvexDashboard.tsx` - Wrapper pattern

  **Acceptance Criteria**:
  - [ ] Dashboard shows content counts
  - [ ] Quick links to all admin sections
  - [ ] Clean, responsive layout

  **QA Scenarios**:

  ```
  Scenario: Dashboard loads with stats
    Tool: Playwright
    Steps:
      1. Login to admin
      2. Navigate to /admin
      3. Verify content stats displayed
    Expected Result: Dashboard shows counts for services, solutions, blog posts
    Evidence: .sisyphus/evidence/task-21-dashboard.png
  ```

- [x] 22. Services Admin Page
  - Create `/admin/services` page with services list
  - Add/Edit/Delete service forms
  - Features/benefits array editor
  - Icon selector, image upload
  - Slug auto-generation from title
  - **Category**: `visual-engineering` | **Blocked By**: Tasks 7, 6 | **Parallel Group**: Wave 4

- [x] 23. Solutions Admin Page
  - Create `/admin/solutions` page
  - CRUD UI with related services multi-select
  - **Category**: `visual-engineering` | **Blocked By**: Tasks 8, 6 | **Parallel Group**: Wave 4

- [x] 24. Heroes Admin Page
  - Create `/admin/heroes` page
  - YouTube ID input OR image upload toggle
  - CTAs editor, trust badges editor
  - Page selector for hero assignment
  - **Category**: `visual-engineering` | **Blocked By**: Tasks 9, 5, 6 | **Parallel Group**: Wave 4

- [x] 25. Communes Admin Page (PSEO)
  - Create `/admin/communes` page
  - List by zone, SEO fields editor
  - Bulk status toggle
  - **Category**: `visual-engineering` | **Blocked By**: Tasks 10, 6 | **Parallel Group**: Wave 4

- [x] 26. Blog Admin Page
  - Create `/admin/blog` page
  - Posts list with status, featured toggle
  - Post editor with author selector, tags
  - Publish/unpublish actions
  - **Category**: `visual-engineering` | **Blocked By**: Tasks 20, 19, 6 | **Parallel Group**: Wave 4

- [x] 27. Site Config Admin Page
  - Create `/admin/config` page
  - Edit global settings (brand, phones, social links)
  - Navbar items editor
  - **Category**: `visual-engineering` | **Blocked By**: Task 6 | **Parallel Group**: Wave 4

---

### WAVE 5: Admin UI Extended + Components

- [ ] 28. FAQs Admin Page
  - Create `/admin/faqs` page
  - Drag-drop reorder, category filter
  - **Category**: `visual-engineering` | **Blocked By**: Tasks 11, 6 | **Parallel Group**: Wave 5

- [ ] 29. Partners Admin Page
  - Create `/admin/partners` page
  - Type filter, logo upload
  - **Category**: `visual-engineering` | **Blocked By**: Tasks 12, 5, 6 | **Parallel Group**: Wave 5

- [ ] 30. Testimonials Admin Page
  - Create `/admin/testimonials` page
  - Rating input, verified toggle
  - **Category**: `visual-engineering` | **Blocked By**: Tasks 13, 6 | **Parallel Group**: Wave 5

- [ ] 31. Team Admin Page
  - Create `/admin/team` page
  - Avatar upload, role input
  - Drag-drop reorder
  - **Category**: `visual-engineering` | **Blocked By**: Tasks 14, 5, 6 | **Parallel Group**: Wave 5

- [ ] 32. Markdown Editor Component

  **What to do**:
  - Create reusable `MarkdownEditor.tsx` component
  - Textarea with live preview
  - Basic toolbar (bold, italic, link, list)
  - Use for blog content, descriptions, etc.

  **Must NOT do**:
  - Don't add WYSIWYG (visual editor)
  - Don't add image embedding in markdown
  - Don't add code highlighting

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 5
  - **Blocked By**: None (standalone component)
  - **Blocks**: Tasks using markdown fields

  **References**:
  - React markdown libraries (marked, markdown-it)

  **Acceptance Criteria**:
  - [ ] Editor renders with textarea and preview pane
  - [ ] Toolbar buttons insert markdown syntax
  - [ ] Preview updates in real-time

  **QA Scenarios**:

  ```
  Scenario: Markdown preview works
    Tool: Playwright
    Steps:
      1. Navigate to blog editor
      2. Type "**bold text**" in textarea
      3. Verify preview shows bold text
    Expected Result: Preview renders bold text
    Evidence: .sisyphus/evidence/task-32-markdown-preview.png
  ```

- [ ] 33. Image Upload Component

  **What to do**:
  - Create reusable `ImageUploader.tsx` component
  - Drag-drop or click to upload
  - Preview uploaded image
  - Progress indicator
  - Integration with Convex storage mutations

  **Must NOT do**:
  - Don't add cropping UI
  - Don't add image transformation
  - Don't add gallery features

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 5
  - **Blocked By**: Task 5 (storage mutations)
  - **Blocks**: Admin pages needing image upload

  **Acceptance Criteria**:
  - [ ] Drag-drop upload works
  - [ ] Click to browse works
  - [ ] Progress shown during upload
  - [ ] Preview displayed after upload
  - [ ] File size/format validation

  **QA Scenarios**:

  ```
  Scenario: Image upload works
    Tool: Playwright
    Steps:
      1. Navigate to service editor
      2. Drop test image file
      3. Wait for upload complete
    Expected Result: Image preview shows, no errors
    Evidence: .sisyphus/evidence/task-33-image-upload.png
  ```

---

### WAVE 6: Frontend Migration

- [ ] 34. Migrate Home Page Heroes to Convex

  **What to do**:
  - Update `src/pages/index.astro` to use heroes table
  - Replace content_blocks query with heroes query
  - Ensure hero data structure matches component props

  **Must NOT do**:
  - Don't change hero component yet (Task 39)
  - Don't delete content_blocks yet

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 6
  - **Blocked By**: Tasks 9, 24
  - **Blocks**: None

  **References**:
  - `src/pages/index.astro` - Current hero implementation
  - `convex/content_blocks.ts` - Current data source

  **Acceptance Criteria**:
  - [ ] Home page hero loads from heroes table
  - [ ] All hero fields render correctly
  - [ ] YouTube video plays

  **QA Scenarios**:

  ```
  Scenario: Home hero renders from Convex
    Tool: Playwright
    Steps:
      1. Navigate to /
      2. Verify hero section displays
      3. Verify video plays or image shows
    Expected Result: Hero visible with correct content
    Evidence: .sisyphus/evidence/task-34-home-hero.png
  ```

- [ ] 35. Migrate Servicios Page to Convex
  - Update `src/pages/servicios/index.astro`
  - Replace hardcoded process steps, industries
  - Use process_steps, industries tables
  - **Category**: `quick` | **Blocked By**: Tasks 17, 18 | **Parallel Group**: Wave 6

- [ ] 36. Migrate Nosotros Page to Convex
  - Update `src/pages/nosotros.astro`
  - Replace hardcoded team, values, stats
  - Use team_members, company_values, stats tables
  - **Category**: `quick` | **Blocked By**: Tasks 14, 15, 16 | **Parallel Group**: Wave 6

- [ ] 37. Migrate Contacto Page to Convex
  - Update `src/pages/contacto.astro`
  - Replace hardcoded content
  - Use heroes, ctas tables for sections
  - **Category**: `quick` | **Blocked By**: Tasks 9, 18 | **Parallel Group**: Wave 6

- [ ] 38. Migrate Blog from Astro Content Collection

  **What to do**:
  - Create migration script to move posts from Astro Content to Convex
  - Update `src/pages/blog/index.astro` to use Convex queries
  - Update `src/pages/blog/[slug].astro` to use Convex
  - Remove Astro Content Collection config
  - Seed existing posts to Convex

  **Must NOT do**:
  - Don't delete content collection until migration verified
  - Don't change URL structure

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: Complex migration with data transformation
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 6
  - **Blocked By**: Task 20 (blog CRUD)
  - **Blocks**: None

  **References**:
  - `src/content/config.ts` - Astro content config
  - `src/content/blog/` - Existing blog posts
  - `convex/blog_posts.ts` - New Convex functions

  **Acceptance Criteria**:
  - [ ] All existing posts migrated to Convex
  - [ ] Blog index page works with Convex data
  - [ ] Blog post pages work with Convex data
  - [ ] No Astro Content Collection references remain

  **QA Scenarios**:

  ```
  Scenario: Blog posts migrated
    Tool: Bash (convex run)
    Steps:
      1. Run `npx convex run blog_posts:getPosts`
    Expected Result: Returns all migrated posts
    Evidence: .sisyphus/evidence/task-38-blog-migrated.txt

  Scenario: Blog index renders
    Tool: Playwright
    Steps:
      1. Navigate to /blog
      2. Verify post list shows
    Expected Result: All posts visible
    Evidence: .sisyphus/evidence/task-38-blog-index.png
  ```

- [ ] 39. Update Hero Component for YouTube/Image

  **What to do**:
  - Update `src/components/sections/Hero.astro`
  - Add image background support (in addition to YouTube)
  - Add `background_type` prop handling
  - Add mobile detection for video fallback
  - Ensure backward compatibility with existing data

  **Must NOT do**:
  - Don't break existing YouTube hero functionality
  - Don't add multiple heroes per page
  - Don't add hero variants beyond background type

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 6
  - **Blocked By**: Task 9 (heroes CRUD)
  - **Blocks**: Task 40

  **References**:
  - `src/components/sections/Hero.astro` - Current implementation
  - `src/components/sections/HeroAjax.astro` - Reference for image variant

  **Acceptance Criteria**:
  - [ ] Component accepts both `youtube_id` and `image_url`
  - [ ] Only one renders based on `background_type`
  - [ ] Existing YouTube heroes still work

  **QA Scenarios**:

  ```
  Scenario: Image hero renders
    Tool: Playwright
    Steps:
      1. Create hero with background_type="image"
      2. Navigate to page
      3. Verify image shows as background
    Expected Result: Image visible as hero background
    Evidence: .sisyphus/evidence/task-39-hero-image.png

  Scenario: YouTube hero still works
    Tool: Playwright
    Steps:
      1. Navigate to / (home with YouTube hero)
      2. Verify video plays
    Expected Result: YouTube video visible and playing
    Evidence: .sisyphus/evidence/task-39-hero-youtube.png
  ```

- [ ] 40. Mobile Hero Fallback Implementation

  **What to do**:
  - Add mobile detection to Hero component
  - On mobile devices: show static image instead of YouTube
  - Use `poster` image from hero data or fallback image
  - Test on mobile viewport sizes

  **Must NOT do**:
  - Don't use browser sniffing (use viewport/feature detection)
  - Don't affect desktop experience

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 6
  - **Blocked By**: Task 39
  - **Blocks**: None

  **References**:
  - `src/components/sections/Hero.astro` - Component to modify

  **Acceptance Criteria**:
  - [ ] Mobile view shows image, not video
  - [ ] Desktop view shows video (if YouTube type)
  - [ ] Fallback image defined in hero data

  **QA Scenarios**:

  ```
  Scenario: Mobile shows image fallback
    Tool: Playwright
    Steps:
      1. Set viewport to mobile (375px)
      2. Navigate to home page
      3. Verify no iframe, image shows instead
    Expected Result: Static image visible, no video
    Evidence: .sisyphus/evidence/task-40-mobile-fallback.png
  ```

---

### WAVE 7: Testing + Verification

- [ ] 41. Unit Tests for Services
  - Create `convex/services.test.ts`
  - Test CRUD mutations, validation
  - Test slug uniqueness, ordering
  - **Category**: `quick` | **Blocked By**: Tasks 1, 7 | **Parallel Group**: Wave 7

- [ ] 42. Unit Tests for Solutions
  - Create `convex/solutions.test.ts`
  - Test CRUD, related services handling
  - **Category**: `quick` | **Blocked By**: Tasks 1, 8 | **Parallel Group**: Wave 7

- [ ] 43. Unit Tests for Heroes
  - Create `convex/heroes.test.ts`
  - Test CRUD, background type validation
  - Test page slug association
  - **Category**: `quick` | **Blocked By**: Tasks 1, 9 | **Parallel Group**: Wave 7

- [ ] 44. Unit Tests for Blog
  - Create `convex/blog_posts.test.ts`
  - Test CRUD, publishing workflow
  - Test author relationship, slug uniqueness
  - **Category**: `quick` | **Blocked By**: Tasks 1, 20 | **Parallel Group**: Wave 7

- [ ] 45. E2E Tests for Admin Panel
  - Create Playwright tests for admin flows
  - Test login/logout
  - Test CRUD for services, solutions
  - Test image upload
  - **Category**: `deep` | **Blocked By**: Tasks 1, 21-33 | **Parallel Group**: Wave 7

- [ ] 46. E2E Tests for PSEO Pages
  - Create Playwright tests for commune pages
  - Test all 52 pages render
  - Test meta tags present
  - Test services list shows
  - **Category**: `deep` | **Blocked By**: Task 10 | **Parallel Group**: Wave 7

- [ ] 47. Integration Tests for Auth
  - Test protected routes redirect
  - Test session persistence
  - Test logout clears session
  - **Category**: `quick` | **Blocked By**: Tasks 1, 2, 6 | **Parallel Group**: Wave 7

---

## Final Verification Wave (MANDATORY)

> 4 review agents run in PARALLEL. ALL must APPROVE. Rejection → fix → re-run.

- [ ] F1. **Plan Compliance Audit** — `oracle`
      Read the plan end-to-end. For each "Must Have": verify implementation exists. For each "Must NOT Have": search codebase for forbidden patterns. Check evidence files exist in .sisyphus/evidence/.
      Output: `Must Have [N/N] | Must NOT Have [N/N] | Tasks [N/N] | VERDICT: APPROVE/REJECT`

- [ ] F2. **Code Quality Review** — `unspecified-high`
      Run `tsc --noEmit` + linter + `bun test`. Review all changed files for: `as any`/`@ts-ignore`, empty catches, console.log in prod, unused imports.
      Output: `Build [PASS/FAIL] | Lint [PASS/FAIL] | Tests [N pass/N fail] | VERDICT`

- [ ] F3. **Real Manual QA** — `unspecified-high` (+ `playwright` skill)
      Start from clean state. Execute EVERY QA scenario from EVERY task. Test cross-task integration.
      Output: `Scenarios [N/N pass] | Integration [N/N] | VERDICT`

- [ ] F4. **Scope Fidelity Check** — `deep`
      For each task: read "What to do", read actual diff. Verify 1:1 — everything in spec was built (no missing), nothing beyond spec was built (no creep). Check "Must NOT do" compliance.
      Output: `Tasks [N/N compliant] | Scope Creep [CLEAN/N issues] | VERDICT`

---

## Commit Strategy

Commits grouped by wave completion:

1. **Wave 1 Complete**: `feat(cms): add foundation - vitest, auth, schema, storage`
2. **Wave 2-3 Complete**: `feat(cms): add CRUD mutations for all content entities`
3. **Wave 4-5 Complete**: `feat(cms): add admin UI pages and components`
4. **Wave 6 Complete**: `feat(cms): migrate frontend to Convex, blog migration`
5. **Wave 7 Complete**: `test(cms): add unit and e2e tests`
6. **Final**: `feat(cms): complete CMS implementation - 100% Convex`

---

## Success Criteria

### Verification Commands

```bash
# Schema validation
npx convex schema:check  # Expected: No errors

# All tests pass
bun test  # Expected: All tests pass

# Admin panel accessible
curl -I http://localhost:4321/admin  # Expected: 200 or redirect to login

# Services API works
curl http://localhost:4321/api/services | jq '. | length'  # Expected: 6+

# Blog posts from Convex
curl http://localhost:4321/api/blog | jq '. | length'  # Expected: existing posts count

# PSEO pages work
curl http://localhost:4321/cobertura/las-condes  # Expected: 200, contains "Las Condes"
```

### Final Checklist

- [ ] All "Must Have" present
- [ ] All "Must NOT Have" absent
- [ ] All tests pass
- [ ] 100% content from Convex (no hardcoded content remaining)
- [ ] Admin panel functional with auth
- [ ] Blog migrated from Astro Content Collection
- [ ] 52 PSEO commune pages working
- [ ] Heroes support YouTube OR image with mobile fallback
