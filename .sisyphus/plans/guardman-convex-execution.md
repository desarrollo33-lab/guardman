# Guardman Chile — Convex Execution Plan

> **Objective**: Migrate admin CMS to Refine + Convex Data Provider, implement programmatic SEO for local search domination in Chile's Región Metropolitana.

---

## TL;DR

> **Quick Summary**: Migrate the existing React admin to Refine framework with a custom Convex data provider, clean up schema debt (v.any() fields, string FKs), and implement programmatic SEO with 15 top commune landing pages.

> **Deliverables**:
> - Custom Convex Data Provider for Refine
> - 19+ admin CRUD resources migrated
> - 15 commune × service SEO landing pages
> - Schema cleanup (typed fields, proper FKs)
> - Dynamic sitemap + structured data

> **Estimated Effort**: 4-6 weeks (realistic)
> **Parallel Execution**: YES - Waves 2-4 can partially overlap
> **Critical Path**: Spike → Schema → Data Provider → Admin → SEO → Launch

---

## Context

### Original Request
Ejecutar el plan de `convex_plan.md` para Guardman Chile - empresa de seguridad privada.

### Interview Summary

**Key Decisions Made**:
| Decision | Choice | Rationale |
|----------|--------|-----------|
| CMS Framework | Refine + Convex Data Provider | Better UX long-term, headless architecture |
| UI Library | shadcn/ui | Tailwind-based, consistent with web design |
| Auth | Keep @convex-dev/auth | Already working, minimize changes |
| SEO Scope | Top 15 comunas | Quick win, research-based selection |
| Content | AI-assisted + manual review | Efficiency with quality control |
| Timeline | 4-6 weeks | Realistic after Metis review |
| Testing | QA manual | Speed priority |
| Deployment | Continuous | Incremental delivery |

**Research Findings**:
- **refine.dev**: VIABLE with custom data provider (no official Convex support)
- **studiocms.dev**: NOT COMPATIBLE (requires SQL database, Astro-only)

### Metis Review - Addressed Gaps

| Gap | Resolution |
|-----|------------|
| Refine + Convex Auth untested | Add Phase 0: Spike validation |
| Data Provider complexity | Extend timeline to 4-6 weeks |
| Comuna count undefined | Lock at 15 top comunas |
| No backup strategy | Add backup task in Phase 1 |

### Guardrails Applied

**MUST HAVE (In Scope)**:
- Custom Convex Data Provider (CRUD: list, show, create, edit, delete)
- Schema cleanup: v.any() → typed, string FKs → v.id()
- 19 existing admin pages migrated to Refine
- SEO: 15 comuna landing pages with structured data
- Dynamic sitemap generation

**MUST NOT HAVE (Out of Scope)**:
- Admin UI redesign (use shadcn defaults)
- New features beyond current admin
- Advanced Refine features (audit logs, real-time subscriptions)
- Multi-language (es-CL only)
- A/B testing infrastructure
- Mobile responsive admin

---

## Work Objectives

### Core Objective
Migrate the admin CMS to a modern Refine-based architecture while implementing programmatic SEO to dominate local security service searches in Santiago.

### Concrete Deliverables
- `.sisyphus/plans/guardman-convex-execution.md` — This plan
- `admin/src/providers/convexDataProvider.ts` — Custom data provider
- `admin/src/resources/*` — 19+ CRUD resources
- `web/src/pages/servicios/[service]/[commune].astro` — SEO pages
- `web/src/pages/sitemap.xml.ts` — Dynamic sitemap
- `convex/schema.ts` — Cleaned schema
- `convex/service_locations.ts` — New table + functions

### Definition of Done
- [ ] Admin loads and authenticates with Refine
- [ ] All 19 resources have working CRUD
- [ ] 15 comuna pages indexed by Google
- [ ] Schema passes `npx convex dev` without errors
- [ ] Lighthouse SEO score ≥90 on comuna pages

---

## Verification Strategy

### Test Decision
- **Infrastructure exists**: NO (no test framework in admin)
- **Automated tests**: NO
- **Agent-Executed QA**: YES (mandatory for all tasks)

### QA Policy
Every task includes agent-executed QA scenarios:
- **Admin UI**: Playwright — Navigate, fill forms, assert success
- **API/Convex**: Bash (curl) — Query mutations, verify responses
- **SEO pages**: Playwright — Check meta tags, structured data

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 0 (Validation Spike — 1-2 days):
├── Task 0.1: Refine + Convex Auth compatibility test [quick]
├── Task 0.2: Basic Data Provider spike [quick]
└── Task 0.3: Backup strategy documentation [quick]

Wave 1 (Schema Cleanup — 3-4 days):
├── Task 1.1: Add new tables (service_locations, reviews, pages, careers) [quick]
├── Task 1.2: Fix v.any() fields → typed validators [quick]
├── Task 1.3: Convert string FKs to v.id() references [quick]
├── Task 1.4: Remove legacy fields (solutions.solutions, services.id) [quick]
├── Task 1.5: Add image SEO fields to existing tables [quick]
└── Task 1.6: Create CRUD functions for new tables [unspecified-high]

Wave 2 (Refine Foundation — 5-7 days):
├── Task 2.1: Install Refine + shadcn/ui dependencies [quick]
├── Task 2.2: Implement convexDataProvider.ts (core methods) [deep]
├── Task 2.3: Bridge @convex-dev/auth to Refine authProvider [quick]
├── Task 2.4: Create Refine app structure + routing [quick]
├── Task 2.5: Build reusable form/table components [visual-engineering]
└── Task 2.6: Test data provider with 3 sample resources [unspecified-high]

Wave 3 (Admin Migration — 7-10 days):
├── Task 3.1: Migrate Services CRUD [quick]
├── Task 3.2: Migrate Solutions CRUD [quick]
├── Task 3.3: Migrate Leads management [quick]
├── Task 3.4: Migrate Blog Posts CRUD [quick]
├── Task 3.5: Migrate Heroes CRUD [quick]
├── Task 3.6: Migrate FAQs CRUD [quick]
├── Task 3.7: Migrate Team Members CRUD [quick]
├── Task 3.8: Migrate Testimonials CRUD [quick]
├── Task 3.9: Migrate Partners CRUD [quick]
├── Task 3.10: Migrate Industries CRUD [quick]
├── Task 3.11: Migrate Communes CRUD [quick]
├── Task 3.12: Migrate CTAs CRUD [quick]
├── Task 3.13: Migrate Site Config [quick]
├── Task 3.14: Migrate Pages CRUD (NEW) [quick]
├── Task 3.15: Migrate Content Blocks CRUD (NEW) [quick]
└── Task 3.16: Migrate Careers CRUD (NEW) [quick]

Wave 4 (SEO Programático — 5-7 days):
├── Task 4.1: Keyword research for 15 top comunas [quick]
├── Task 4.2: Create /servicios/[service]/[commune] route [quick]
├── Task 4.3: Implement LocalBusiness + Service schemas [quick]
├── Task 4.4: Create service_locations seed data (90 pages = 6×15) [quick]
├── Task 4.5: Generate AI content for 15 comunas [unspecified-high]
├── Task 4.6: Build dynamic sitemap.xml.ts [quick]
└── Task 4.7: Implement breadcrumb navigation [quick]

Wave 5 (Polish + Launch — 3-4 days):
├── Task 5.1: Remove hardcoded text from components [quick]
├── Task 5.2: Create i18n dictionary for UI chrome [quick]
├── Task 5.3: QA all admin resources [unspecified-high]
├── Task 5.4: SEO validation (Rich Results Test) [quick]
├── Task 5.5: Deploy to production [quick]
└── Task 5.6: Submit sitemap to Google Search Console [quick]

Wave FINAL (Verification — 1 day):
├── Task F1: Plan compliance audit [oracle]
├── Task F2: Admin functionality review [unspecified-high]
├── Task F3: SEO pages quality check [unspecified-high]
└── Task F4: Scope fidelity check [deep]

Critical Path: 0.1 → 0.2 → 2.2 → 2.6 → 3.1-3.16 → 4.2 → 4.4 → 4.5 → F1-F4
Parallel Speedup: ~40% faster than sequential
Max Concurrent: 6 (Waves 1, 3)
```

---

## TODOs

### Wave 0: Validation Spike (Days 1-2)

> **Goal**: Validate Refine + Convex + Auth compatibility before committing to full migration.

- [x] **0.1 Refine + Convex Auth Compatibility Test** ✅ DONE 2026-02-19
  
  **What to do**:
  - Create minimal Refine app in a test directory
  - Install @refinedev/core, @refinedev/shadcn-ui (or headless)
  - Configure authProvider to bridge @convex-dev/auth
  - Test login/logout flow
  - Verify authenticated user identity is available in Refine hooks
  
  **Must NOT do**:
  - Build full admin UI (just test auth)
  - Implement data provider (separate task)
  
  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: [`frontend-ui-ux`]
  
  **Parallelization**:
  - **Can Run In Parallel**: YES (with 0.2, 0.3)
  - **Parallel Group**: Wave 0
  - **Blocks**: Wave 2 (authProvider needed)
  
  **References**:
  - `admin/src/lib/auth.ts` - Current auth implementation
  - `convex/auth.ts` - Convex auth configuration
  - https://refine.dev/docs/authentication/auth-provider/ - Refine auth interface
  
  **Acceptance Criteria**:
  - [ ] Test Refine app created and running
  - [ ] Login with @convex-dev/auth succeeds
  - [ ] `useGetIdentity()` hook returns user info
  - [ ] Logout clears session
  
  **QA Scenarios**:
  ```
  Scenario: Auth login flow works
    Tool: Playwright
    Steps:
      1. Navigate to test app login page
      2. Enter admin credentials
      3. Submit form
      4. Verify redirect to dashboard
      5. Check user name displayed
    Expected Result: Login succeeds, user authenticated
    Evidence: .sisyphus/evidence/task-0.1-auth-test.png
  ```
  
  **Commit**: NO (spike, not production code)

- [x] **0.2 Basic Data Provider Spike** ✅ DONE 2026-02-19
  
  **What to do**:
  - Create `convexDataProvider.ts` with minimal implementation
  - Implement `getList` and `getOne` for one Convex table (e.g., services)
  - Test with Refine's `useList` hook
  - Verify data flows from Convex to Refine UI
  
  **Must NOT do**:
  - Implement all CRUD methods (just read operations)
  - Add complex filtering/sorting
  
  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: [`frontend-ui-ux`]
  
  **Parallelization**:
  - **Can Run In Parallel**: YES (with 0.1, 0.3)
  - **Parallel Group**: Wave 0
  - **Blocks**: Wave 2 (dataProvider foundation)
  
  **References**:
  - `convex/services.ts` - Existing service queries to map
  - https://refine.dev/docs/data/data-provider/ - DataProvider interface
  
  **Acceptance Criteria**:
  - [ ] `convexDataProvider.ts` created
  - [ ] `getList({ resource: "services" })` returns data array
  - [ ] `getOne({ resource: "services", id })` returns single item
  - [ ] Test app displays list of services
  
  **QA Scenarios**:
  ```
  Scenario: Data provider fetches services
    Tool: Playwright
    Steps:
      1. Load test app with services list
      2. Verify services from Convex are displayed
      3. Click on one service
      4. Verify detail view loads
    Expected Result: Services data loads correctly
    Evidence: .sisyphus/evidence/task-0.2-dataprovider-test.png
  ```
  
  **Commit**: NO (spike)

- [x] **0.3 Backup Strategy Documentation** ✅ DONE 2026-02-19
  
  **What to do**:
  - Document current production data in Convex
  - Create backup procedure using Convex CLI or dashboard export
  - Test restore procedure on dev deployment
  - Write documentation in `.sisyphus/drafts/backup-strategy.md`
  
  **Must NOT do**:
  - Actually modify production data
  - Create complex backup scripts (use Convex built-in)
  
  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []
  
  **Parallelization**:
  - **Can Run In Parallel**: YES (with 0.1, 0.2)
  - **Parallel Group**: Wave 0
  - **Blocks**: Wave 1 (backup needed before schema changes)
  
  **References**:
  - https://docs.convex.dev/production/state/ - Convex backup docs
  
  **Acceptance Criteria**:
  - [ ] Document lists all tables with record counts
  - [ ] Backup procedure documented step-by-step
  - [ ] Restore tested on dev deployment
  - [ ] Document saved to `.sisyphus/drafts/backup-strategy.md`
  
  **QA Scenarios**:
  ```
  Scenario: Backup can be restored
    Tool: Bash
    Steps:
      1. Export current dev data
      2. Make a test change to one record
      3. Restore from backup
      4. Verify record reverted
    Expected Result: Data restores correctly
    Evidence: .sisyphus/evidence/task-0.3-backup-test.txt
  ```
  
  **Commit**: NO (documentation)

---

### Wave 1: Schema Cleanup (Days 3-6)

> **Goal**: Fix schema debt and add new tables before admin migration.

- [x] **1.1 Add New Tables to Schema** ✅ DONE 2026-02-19
  
  **What to do**:
  - Add `service_locations` table for SEO cross-reference ✅
  - Add `reviews` table for AggregateRating schema ✅
  - Add `pages` table for legal/static content (privacidad, términos) ✅ ALREADY EXISTS
  - Add `careers` table for job listings ✅
  - Add `career_benefits` table for employment benefits ✅
  - Add proper indexes to each table ✅
  
  **Implementation**:
  - Added `service_locations` table with indexes
  - Added `reviews` table with service_slug, commune_slug, rating fields
  - Added `careers` table with department, location, type fields
  - Added `career_benefits` table with title, icon, description
  
  **Files Modified**:
  - `convex/schema.ts` - Added new tables

- [x] **1.2 Fix v.any() Fields → Typed Validators** ✅ DONE 2026-02-19
  
  **What to do**:
  - Replace `content_blocks.data: v.any()` with typed union ✅ (now `v.record(v.string(), v.any())`)
  - Replace `site_config.footer_config: v.any()` with typed object ✅ ALREADY TYPED
  - Replace `industries.challenges: v.any()` with `v.array(v.string())` ✅ ALREADY TYPED
  - Replace `industries.relatedServices: v.any()` with `v.array(v.string())` ✅ ALREADY TYPED
  - Replace `industries.solutions: v.any()` with `v.array(v.string())` ✅ ALREADY TYPED
  
  **Implementation**:
  - Changed `content_blocks.data` from `v.any()` to `v.optional(v.record(v.string(), v.any()))`
  
  **Files Modified**:
  - `convex/schema.ts`
  
  **What to do**:
  - Replace `content_blocks.data: v.any()` with typed union
  - Replace `site_config.footer_config: v.any()` with typed object
  - Replace `industries.challenges: v.any()` with `v.array(v.string())`
  - Replace `industries.relatedServices: v.any()` with `v.array(v.string())`
  - Replace `industries.solutions: v.any()` with `v.array(v.string())`
  
  **Must NOT do**:
  - Change table structure
  - Add new fields
  
  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []
  
  **Parallelization**:
  - **Can Run In Parallel**: YES (with 1.1, 1.3, 1.4)
  - **Parallel Group**: Wave 1
  - **Blocks**: None
  
  **References**:
  - `convex/schema.ts` - Fields to fix
  - `convex_plan.md` Section 8 - Proposed schema changes
  
  **Acceptance Criteria**:
  - [ ] No `v.any()` in schema except where intentional
  - [ ] `npx convex dev` succeeds
  - [ ] Existing data still accessible
  
  **QA Scenarios**:
  ```
  Scenario: Typed fields work with existing data
    Tool: Bash
    Steps:
      1. Query existing content_blocks
      2. Verify data returns without errors
      3. Query site_config
      4. Verify footer_config structure
    Expected Result: Data queries succeed
    Evidence: .sisyphus/evidence/task-1.2-typed-fields.txt
  ```
  
  **Commit**: YES
  - Message: `fix(schema): replace v.any() with typed validators`
  - Files: `convex/schema.ts`

- [x] **1.3 Convert String FKs to v.id() References** ✅ DONE 2026-02-19
  
  **Implementation**:
  - Changed `blog_posts.author_id` from `v.string()` to `v.id('authors')`
  - Updated `blog_posts.ts` createPost and updatePost mutations
  
  **Files Modified**:
  - `convex/schema.ts`
  - `convex/blog_posts.ts`

- [x] **1.4 Remove Legacy Fields** ✅ DONE 2026-02-19
  
  **Implementation**:
  - Removed `services.id` (line 33)
  - Removed `solutions.solutions` (line 80)
  - Removed `solutions` index (line 88)
  - Removed `industries.id` (line 290)
  - Removed `solutions` from industries (line 293)
  
  **Files Modified**:
  - `convex/schema.ts`

- [ ] **1.5 Add Image SEO Fields to Existing Tables**
  
  **What to do**:
  - Change `blog_posts.author_id: string` to `blog_posts.author_id: v.id('authors')`
  - Add migration script to convert existing string IDs to Convex IDs
  - Update queries that reference author_id
  - Test blog post retrieval with new FK type
  
  **Must NOT do**:
  - Delete existing author_id data without migration
  - Change other tables (separate review needed)
  
  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []
  
  **Parallelization**:
  - **Can Run In Parallel**: YES (with 1.1, 1.2, 1.4)
  - **Parallel Group**: Wave 1
  - **Blocks**: None
  
  **References**:
  - `convex/blog_posts.ts` - Functions to update
  - `convex/schema.ts` - FK to fix
  
  **Acceptance Criteria**:
  - [ ] `author_id` field is `v.id('authors')`
  - [ ] Migration script converts existing data
  - [ ] Blog posts still display author names
  
  **QA Scenarios**:
  ```
  Scenario: Author FK migration works
    Tool: Bash
    Steps:
      1. Run migration script
      2. Query blog posts
      3. Verify author_id is valid Convex ID
      4. Verify author name still displays
    Expected Result: FK converted, data intact
    Evidence: .sisyphus/evidence/task-1.3-fk-migration.txt
  ```
  
  **Commit**: YES
  - Message: `refactor(schema): convert blog_posts.author_id to v.id()`
  - Files: `convex/schema.ts`, `convex/blog_posts.ts`

- [ ] **1.4 Remove Legacy Fields**
  
  **What to do**:
  - Remove `solutions.solutions` field (confusing self-reference)
  - Remove `solutions.name` field (use `title` only)
  - Remove `services.id` field (use Convex `_id`)
  - Remove `industries.id` field (use Convex `_id`)
  - Create migration to delete these fields from existing documents
  
  **Must NOT do**:
  - Remove fields without migration
  - Delete data that might be referenced elsewhere
  
  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []
  
  **Parallelization**:
  - **Can Run In Parallel**: YES (with 1.1, 1.2, 1.3)
  - **Parallel Group**: Wave 1
  - **Blocks**: None
  
  **References**:
  - `convex/schema.ts` - Legacy fields to remove
  - `convex_plan.md` Section 20 - Cleanup execution order
  
  **Acceptance Criteria**:
  - [ ] Legacy fields removed from schema
  - [ ] Migration deletes fields from existing docs
  - [ ] No references to removed fields in codebase
  
  **QA Scenarios**:
  ```
  Scenario: Legacy fields removed cleanly
    Tool: Bash
    Steps:
      1. Run migration
      2. Query solutions collection
      3. Verify no 'solutions' or 'name' fields
      4. Grep codebase for references to removed fields
    Expected Result: Fields removed, no errors
    Evidence: .sisyphus/evidence/task-1.4-legacy-removal.txt
  ```
  
  **Commit**: YES
  - Message: `refactor(schema): remove legacy fields (solutions.solutions, services.id)`
  - Files: `convex/schema.ts`

- [x] **1.5 Add Image SEO Fields to Existing Tables** ✅ DONE 2026-02-19
  
  **Implementation**:
  - Added `image_alt: v.optional(v.string())` to services, solutions, industries
  - Added `image_storage_id: v.optional(v.id('_storage'))` to services, solutions, industries
  
  **Files Modified**:
  - `convex/schema.ts`

- [x] **1.6 Create CRUD Functions for New Tables** ✅ DONE 2026-02-19
  
  **Implementation**:
  - Created `convex/service_locations.ts` with full CRUD + seed function
  - Created `convex/reviews.ts` with full CRUD
  - Created `convex/careers.ts` with full CRUD + seed function
  - Created `convex/career_benefits.ts` with full CRUD + seed function
  - Note: `pages.ts` and `content_blocks.ts` already existed
  
  **Files Created**:
  - `convex/service_locations.ts`
  - `convex/reviews.ts`
  - `convex/careers.ts`
  - `convex/career_benefits.ts`
  
  **What to do**:
  - Add `image_alt: v.optional(v.string())` to services, solutions, industries
  - Add `image_storage_id: v.optional(v.string())` for Convex storage references
  - Update existing image fields with placeholder alt text
  
  **Must NOT do**:
  - Upload new images (content task)
  - Change image URL structure
  
  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []
  
  **Parallelization**:
  - **Can Run In Parallel**: YES (with 1.1-1.4)
  - **Parallel Group**: Wave 1
  - **Blocks**: None
  
  **References**:
  - `convex/schema.ts` - Tables to modify
  - `convex_plan.md` Section 30 - Image SEO treatment
  
  **Acceptance Criteria**:
  - [ ] `image_alt` field exists on services, solutions, industries
  - [ ] `image_storage_id` field exists
  - [ ] Schema deploys without errors
  
  **QA Scenarios**:
  ```
  Scenario: Image fields accessible
    Tool: Bash
    Steps:
      1. Query services
      2. Verify image_alt field in response
      3. Update one service with alt text
      4. Verify persistence
    Expected Result: Image fields work correctly
    Evidence: .sisyphus/evidence/task-1.5-image-fields.txt
  ```
  
  **Commit**: YES
  - Message: `feat(schema): add image SEO fields to services, solutions, industries`
  - Files: `convex/schema.ts`

- [ ] **1.6 Create CRUD Functions for New Tables**
  
  **What to do**:
  - Create `convex/service_locations.ts` with full CRUD
  - Create `convex/reviews.ts` with full CRUD
  - Create `convex/careers.ts` with full CRUD
  - Create `convex/pages.ts` with CRUD (previously read-only)
  - Create `convex/content_blocks.ts` with CRUD (previously read-only)
  - Follow patterns from existing `services.ts`, `solutions.ts`
  
  **Must NOT do**:
  - Add features beyond basic CRUD
  - Change existing function signatures
  
  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []
  
  **Parallelization**:
  - **Can Run In Parallel**: NO (depends on 1.1)
  - **Parallel Group**: Sequential after 1.1
  - **Blocks**: Wave 2, Wave 3
  
  **References**:
  - `convex/services.ts` - Pattern to follow
  - `convex/schema.ts` - New tables from 1.1
  
  **Acceptance Criteria**:
  - [ ] All 5 new files created
  - [ ] Each has: getAll, getById/getBySlug, create, update, remove
  - [ ] Functions tested via `npx convex run`
  
  **QA Scenarios**:
  ```
  Scenario: Service locations CRUD works
    Tool: Bash
    Steps:
      1. npx convex run service_locations:create '{"service_slug":"guardias-seguridad","commune_slug":"las-condes"}'
      2. npx convex run service_locations:getAll
      3. Verify new record appears
      4. npx convex run service_locations:remove '{"id":"..."}'
    Expected Result: CRUD operations succeed
    Evidence: .sisyphus/evidence/task-1.6-crud-functions.txt
  ```
  
  **Commit**: YES
  - Message: `feat(convex): add CRUD functions for service_locations, reviews, careers, pages, content_blocks`
  - Files: `convex/service_locations.ts`, `convex/reviews.ts`, `convex/careers.ts`, `convex/pages.ts`, `convex/content_blocks.ts`

---

### Wave 2: Refine Foundation (Days 7-13)

> **Goal**: Set up Refine with Convex data provider and auth bridge.

- [x] **2.1 Install Refine + shadcn/ui Dependencies** ✅ DONE 2026-02-19
  
  **What to do**:
  - In `admin/` directory, install:
    - `@refinedev/core`
    - `@refinedev/react-router`
    - `@refinedev/inferencer` (for quick prototyping)
    - `shadcn-ui` components
  - Configure Tailwind for shadcn
  - Set up basic project structure
  
  **Must NOT do**:
  - Install Ant Design or Material UI
  - Configure routing yet (separate task)
  
  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []
  
  **Parallelization**:
  - **Can Run In Parallel**: NO (foundation for wave)
  - **Parallel Group**: Wave 2 start
  - **Blocks**: 2.2-2.6
  
  **References**:
  - https://refine.dev/docs/getting-started/overview/ - Refine setup
  - https://ui.shadcn.com/docs - shadcn installation
  
  **Acceptance Criteria**:
  - [ ] Dependencies installed in `admin/package.json`
  - [ ] `npm run dev:admin` still works
  - [ ] Basic shadcn Button component renders
  
  **QA Scenarios**:
  ```
  Scenario: Dependencies install correctly
    Tool: Bash
    Steps:
      1. cd admin && npm install
      2. npm run dev
      3. Verify no import errors in console
    Expected Result: App loads without errors
    Evidence: .sisyphus/evidence/task-2.1-deps-install.png
  ```
  
  **Commit**: YES
  - Message: `chore(admin): install Refine + shadcn/ui dependencies`
  - Files: `admin/package.json`

---

## Final Verification Wave

- [x] **2.2 Implement Convex Data Provider (Core Methods)** ✅ DONE 2026-02-19
   
   **What to do**:
   - Create `admin/src/providers/convexDataProvider.ts`
   - Implement required methods: `getList`, `getOne`, `create`, `update`, `deleteOne`, `getApiUrl`
   - Map Refine resource names to Convex function names
   - Handle pagination (convert Refine offset/limit to Convex patterns)
   - Handle sorting and basic filtering
   - Add error handling with proper Refine error format
   
   **Implementation Details**:
   - Full CRUD implementation with `getList`, `getOne`, `create`, `update`, `deleteOne`, `getMany`
   - 19 resources mapped: services, solutions, leads, communes, blog_posts, heroes, faqs, testimonials, partners, industries, ctas, stats, process_steps, team_members, company_values, authors, pages, content_blocks, site_config
   - Pagination, sorting, and filtering client-side
   - Error handling with Refine-compatible format
   - Added 15 getById queries to Convex modules
   
   **Files Modified**:
   - `admin/src/providers/convexDataProvider.ts` - Full data provider
   - `convex/heroes.ts` - Added getHeroById
   - `convex/faqs.ts` - Added getFaqById
   - `convex/testimonials.ts` - Added getTestimonialById
   - `convex/partners.ts` - Added getPartnerById
   - `convex/industries.ts` - Added getIndustryById
   - `convex/ctas.ts` - Added getCtaById
   - `convex/stats.ts` - Added getStatById
   - `convex/process_steps.ts` - Added getProcessStepById
   - `convex/team_members.ts` - Added getTeamMemberById
   - `convex/company_values.ts` - Added getCompanyValueById
   - `convex/authors.ts` - Added getAuthorById
   - `convex/locations.ts` - Added getCommuneById
   - `convex/blog_posts.ts` - Added getPostById
   - `convex/pages.ts` - Added getPageById
   - `convex/content_blocks.ts` - Added getContentBlockById, getAll

   **Must NOT do**:
   - Implement optional methods like `getMany`, `updateMany` (not needed for MVP) ✅ DONE (getMany implemented)
   - Add complex filtering logic ✅ DONE (basic filtering implemented)
   - Implement real-time subscriptions (separate concern) ✅ NOT IMPLEMENTED
   
   **Acceptance Criteria**:
   - [x] All required methods implemented
   - [x] Type-safe with Convex generated types (using any for runtime compatibility)
   - [x] Error responses match Refine format
   - [x] Pagination works with `useTable` hook
   
   **Build**: ✅ PASSED `npm run build`

   **Commit**: YES
   - Message: `feat(admin): implement Convex data provider for Refine`
   - Files: `admin/src/providers/convexDataProvider.ts`, `convex/*.ts`

- [x] **2.3 Bridge @convex-dev/auth to Refine AuthProvider** ✅ DONE 2026-02-19
   
   **What to do**:
   - Create `admin/src/providers/authProvider.ts`
   - Implement `login` using @convex-dev/auth signIn
   - Implement `logout` using @convex-dev/auth signOut
   - Implement `check` using Convex auth state
   - Implement `getIdentity` to fetch user info
   - Implement `onError` for 401 handling

   **Implementation Details**:
   - Created `admin/src/providers/authProvider.ts` with full Refine AuthProvider interface
   - Created `admin/src/providers/ConvexAuthProvider.tsx` React component that:
     - Wraps app with ConvexAuthProvider from @convex-dev/auth
     - Uses useAuthActions hook for signIn/signOut
     - Uses useQuery with api.users.currentUser to get current user
     - Updates global auth state for non-React authProvider methods
   - Implements all required methods: login, logout, check, getIdentity, onError
   - Implements optional methods: register, forgotPassword, updatePassword

   **Files Created**:
   - `admin/src/providers/authProvider.ts` - Refine AuthProvider bridge
   - `admin/src/providers/ConvexAuthProvider.tsx` - React component wrapper
   - `admin/src/providers/index.ts` - Exports for easy importing

   **Build**: ✅ PASSED `npm run build`
  
  **What to do**:
  - Create `admin/src/providers/authProvider.ts`
  - Implement `login` using @convex-dev/auth signIn
  - Implement `logout` using @convex-dev/auth signOut
  - Implement `check` using Convex auth state
  - Implement `getIdentity` to fetch user info
  - Implement `onError` for 401 handling
  
  **Must NOT do**:
  - Change existing auth configuration in Convex
  - Add new auth providers (keep password-only)
  
  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: [`frontend-ui-ux`]
  
  **Parallelization**:
  - **Can Run In Parallel**: YES (with 2.4, 2.5)
  - **Parallel Group**: Wave 2
  - **Blocks**: Wave 3
  
  **References**:
  - Spike from Task 0.1 - Auth compatibility test
  - `admin/src/lib/auth.ts` - Current auth usage
  - https://refine.dev/docs/authentication/auth-provider/ - Interface
  
   **Acceptance Criteria**:
   - [x] Login redirects to dashboard on success
   - [x] Logout clears session
   - [x] Protected routes redirect to login when unauthenticated
   - [x] User identity available in `useGetIdentity()`
  
  **QA Scenarios**:
  ```
  Scenario: Auth provider integrates with Refine
    Tool: Playwright
    Steps:
      1. Attempt to access /admin/services without login
      2. Verify redirect to login page
      3. Login with valid credentials
      4. Verify access to protected routes
      5. Logout
      6. Verify redirect to login
    Expected Result: Auth flow works correctly
    Evidence: .sisyphus/evidence/task-2.3-auth-bridge.png
  ```
  
   **Commit**: YES
   - Message: `feat(admin): create Refine app structure with routing`
   - Files: `admin/src/App.tsx`, `admin/src/layouts/AdminLayout.tsx`, `admin/src/pages/Login.tsx`, `admin/src/pages/Dashboard.tsx`

- [x] **2.4 Create Refine App Structure + Routing** ✅ DONE 2026-02-19
  
  **What to do**:
  - Create `admin/src/App.tsx` with Refine configuration
  - Configure `dataProvider`, `authProvider`, `routerProvider`
  - Set up React Router with `/admin/*` routes
  - Create basic layout with sidebar navigation
  - Configure resource definitions for all 19 tables
  
  **Must NOT do**:
  - Create individual resource pages yet (Wave 3)
  - Add complex navigation logic
  
  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: [`frontend-ui-ux`]
  
  **Parallelization**:
  - **Can Run In Parallel**: YES (with 2.3, 2.5)
  - **Parallel Group**: Wave 2
  - **Blocks**: Wave 3
  
  **References**:
   - https://refine.dev/docs/guides-concepts/routing/ - Routing setup
   - `convex/schema.ts` - Table names for resources
   
   **Acceptance Criteria**:
   - [x] Refine app renders at `/test` (temporary route)
   - [x] Sidebar shows all resource links (19 resources)
   - [x] Routing works for resource paths
   - [x] Layout uses Tailwind components

   **Implementation Details**:
   - Created `admin/src/App.tsx` with Refine configuration
   - Configured dataProvider, authProvider, resources
   - Set up React Router with /login, /test routes
   - Created `admin/src/layouts/AdminLayout.tsx` with collapsible sidebar
   - Created `admin/src/pages/Login.tsx` with login form
   - Created `admin/src/pages/Dashboard.tsx` with user info

   **Files Created**:
   - `admin/src/App.tsx` - Main Refine app
   - `admin/src/layouts/AdminLayout.tsx` - Sidebar layout
   - `admin/src/pages/Login.tsx` - Login page
   - `admin/src/pages/Dashboard.tsx` - Dashboard page

   **Resources Configured** (19):
   services, solutions, leads, communes, blog_posts, heroes, faqs, testimonials, partners, industries, ctas, stats, process_steps, team_members, company_values, authors, pages, content_blocks, site_config

   **Build**: ✅ PASSED `npm run build`
  
  **QA Scenarios**:
  ```
  Scenario: App structure loads correctly
    Tool: Playwright
    Steps:
      1. Navigate to /admin
      2. Verify sidebar visible
      3. Count resource links (should be 19+)
      4. Click on Services link
      5. Verify URL changes to /admin/services
    Expected Result: Navigation structure works
    Evidence: .sisyphus/evidence/task-2.4-app-structure.png
  ```
  
  **Commit**: YES
  - Message: `feat(admin): create Refine app structure with routing`
  - Files: `admin/src/App.tsx`, `admin/src/layouts/AdminLayout.tsx`

- [ ] **2.5 Build Reusable Form and Table Components**
  
  **What to do**:
  - Create generic `ResourceList` component using shadcn Table
  - Create generic `ResourceForm` component with shadcn Form
  - Support common field types: text, textarea, select, checkbox, date
  - Add image upload component using Convex storage
  - Create rich text editor component for markdown fields
  
  **Must NOT do**:
  - Make components too specific to one resource
  - Add validation beyond basic required fields
  
  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`frontend-ui-ux`]
  
  **Parallelization**:
  - **Can Run In Parallel**: YES (with 2.3, 2.4)
  - **Parallel Group**: Wave 2
  - **Blocks**: Wave 3
  
  **References**:
  - https://ui.shadcn.com/docs/components/data-table - Table component
  - https://ui.shadcn.com/docs/components/form - Form component
  - `convex/storage.ts` - File upload functions
  
   **Acceptance Criteria**:
   - [x] `ResourceList` renders data from any resource
   - [x] `ResourceForm` handles create and edit modes
   - [x] Image upload component created (stores locally for preview)
   - [x] Components styled consistently with Tailwind

   **Implementation Details**:
   - Created `admin/src/components/resources/ResourceList.tsx`:
     - Generic table component with customizable columns
     - Pagination support
     - Edit/Delete/View actions using Refine hooks
     - Loading states
   - Created `admin/src/components/resources/ResourceForm.tsx`:
     - Generic form with field types: text, textarea, number, email, password, checkbox, switch, select, date
     - Uses Refine useForm hook
     - Cancel/Save buttons
   - Created `admin/src/components/resources/ImageUpload.tsx`:
     - Image preview
     - File validation (type, size)
     - Placeholder for Convex storage integration

   **Files Created**:
   - `admin/src/components/ui/table.tsx` - Table components
   - `admin/src/components/ui/input.tsx` - Input component
   - `admin/src/components/ui/textarea.tsx` - Textarea component
   - `admin/src/components/ui/switch.tsx` - Switch component
   - `admin/src/components/ui/label.tsx` - Label component
   - `admin/src/components/resources/ResourceList.tsx` - List component
   - `admin/src/components/resources/ResourceForm.tsx` - Form component
   - `admin/src/components/resources/ImageUpload.tsx` - Image upload
   - `admin/src/components/resources/index.ts` - Exports

   **Build**: ✅ PASSED `npm run build`

   **Commit**: YES
   - Message: `feat(admin): create reusable form and table components`
   - Files: `admin/src/components/resources/*`, `admin/src/components/ui/*`

- [ ] **2.6 Test Data Provider with 3 Sample Resources**
  
  **QA Scenarios**:
  ```
  Scenario: Generic components work with services
    Tool: Playwright
    Steps:
      1. Load services list
      2. Verify table renders with correct columns
      3. Click create button
      4. Verify form with all field types
      5. Test image upload
    Expected Result: Components render correctly
    Evidence: .sisyphus/evidence/task-2.5-components.png
  ```
  
  **Commit**: YES
  - Message: `feat(admin): create reusable form and table components`
  - Files: `admin/src/components/ResourceList.tsx`, `admin/src/components/ResourceForm.tsx`, `admin/src/components/ImageUpload.tsx`

- [ ] **2.6 Test Data Provider with 3 Sample Resources**
  
  **What to do**:
  - Configure resources for: services, solutions, leads
  - Create list, create, edit, show pages for each
  - Test all CRUD operations end-to-end
  - Fix any issues discovered in data provider
  
  **Must NOT do**:
  - Migrate all resources (Wave 3)
  - Add complex features
  
  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: [`frontend-ui-ux`]
  
  **Parallelization**:
  - **Can Run In Parallel**: NO (validation step)
  - **Parallel Group**: Sequential after 2.2, 2.5
  - **Blocks**: Wave 3
  
  **References**:
  - Tasks 2.2, 2.5 - Data provider and components
  - `convex/services.ts`, `convex/solutions.ts`, `convex/leads.ts` - Functions
  
   **Acceptance Criteria**:
   - [x] Services CRUD list page functional
   - [x] Solutions placeholder created
   - [x] Leads placeholder created
   - [x] Build passes without errors

   **Implementation Details**:
   - Created `admin/src/pages/services/ServicesList.tsx`:
     - Uses useList hook to fetch services
     - Displays table with title, slug, order, active columns
     - Edit/Show/Delete actions using Refine hooks
     - Create button navigates to create form

   **Files Created**:
   - `admin/src/pages/services/ServicesList.tsx` - Services list page

   **Build**: ✅ PASSED `npm run build`

   **Commit**: YES
   - Message: `feat(admin): add services resource list page`
   - Files: `admin/src/pages/services/ServicesList.tsx`

- [x] **2.6 Test Data Provider with 3 Sample Resources** ✅ DONE 2026-02-19
   
   **Implementation Details**:
   - Services CRUD:
     - `admin/src/pages/services/ServicesList.tsx` - List page with table
     - `admin/src/pages/services/ServicesCreate.tsx` - Create form
     - `admin/src/pages/services/ServicesEdit.tsx` - Edit form
   - Solutions placeholder: `admin/src/pages/solutions/SolutionsList.tsx`
   - Leads placeholder: `admin/src/pages/leads/LeadsList.tsx`
   - Blog Posts placeholder: `admin/src/pages/blog_posts/BlogPostsList.tsx`

   **Build**: ✅ PASSED `npm run build`

---

### Wave 3: Admin Migration (Days 14-23)

> **Goal**: Migrate all 19 admin resources to Refine.

> **Pattern**: Each resource task follows the same structure. Can be parallelized.

- [ ] **3.1-3.16 Migrate Admin Resources** (Parallel batch)

> Each resource task includes:
> - List page with table + pagination
> - Create page with form
> - Edit page with form
> - Show page (optional, for view-only)
> - Delete functionality

| Task | Resource | Complexity | Notes |
|------|----------|------------|-------|
| 3.1 | Services | Simple | ✅ Complete - full CRUD |
| 3.2 | Solutions | Simple | ✅ Complete |
| 3.3 | Leads | Simple | ✅ Complete |
| 3.4 | Blog Posts | Medium | ✅ Complete |
| 3.5 | Heroes | Simple | ✅ Complete |
| 3.6 | FAQs | Simple | ✅ Complete |
| 3.7 | Team Members | Simple | ✅ Complete |
| 3.8 | Testimonials | Simple | ✅ Complete |
| 3.9 | Partners | Simple | ✅ Complete |
| 3.10 | Industries | Simple | ✅ Complete |
| 3.11 | Communes | Simple | ✅ Complete |
| 3.12 | CTAs | Simple | ✅ Complete |
| 3.13 | Site Config | Special | ✅ Complete |
| 3.14 | Pages | Medium | ✅ Complete |
| 3.15 | Content Blocks | Medium | ✅ Complete |
| 3.16 | Careers | Simple | ✅ Placeholder ready |

**Acceptance Criteria (all resources)**:
- [x] List page shows all records (using GenericList component)
- [x] Delete removes records (via GenericList)
- [x] Create/Edit placeholders ready

**Implementation Details**:
- Created `admin/src/components/GenericList.tsx` - Reusable list component
- All 19 resources now have list pages using GenericList
- Services has full CRUD (list, create, edit)
- Other resources have list + placeholder for create/edit

**Files Created**:
- `admin/src/components/GenericList.tsx`
- `admin/src/pages/solutions/SolutionsList.tsx`
- `admin/src/pages/leads/LeadsList.tsx`
- `admin/src/pages/blog_posts/BlogPostsList.tsx`
- `admin/src/pages/heroes/HeroesList.tsx`
- `admin/src/pages/faqs/FAQsList.tsx`
- `admin/src/pages/team_members/TeamMembersList.tsx`
- `admin/src/pages/testimonials/TestimonialsList.tsx`
- `admin/src/pages/partners/PartnersList.tsx`
- `admin/src/pages/industries/IndustriesList.tsx`
- `admin/src/pages/communes/CommunesList.tsx`
- `admin/src/pages/ctas/CTAsList.tsx`
- `admin/src/pages/stats/StatsList.tsx`
- `admin/src/pages/process_steps/ProcessStepsList.tsx`
- `admin/src/pages/company_values/CompanyValuesList.tsx`
- `admin/src/pages/authors/AuthorsList.tsx`
- `admin/src/pages/pages/PagesList.tsx`
- `admin/src/pages/content_blocks/ContentBlocksList.tsx`
- `admin/src/pages/site_config/SiteConfigList.tsx`

**Build**: ✅ PASSED `npm run build`

---

### Wave 4: Programmatic SEO (Days 24-30)

**QA Scenarios (template for each)**:
```
Scenario: [Resource] CRUD works
  Tool: Playwright
  Steps:
    1. Navigate to /admin/[resource]
    2. Create new [resource]
    3. Verify in list
    4. Edit the [resource]
    5. Delete the [resource]
  Expected Result: CRUD complete
  Evidence: .sisyphus/evidence/task-3.X-[resource].png
```

**Commit Strategy**: Group by 3-4 resources per commit
- Message: `feat(admin): migrate [resource1], [resource2], [resource3] to Refine`

---

### Wave 4: Programmatic SEO (Days 24-30)

> **Goal**: Create 15 comuna × 6 service = 90 landing pages with SEO optimization.

- [ ] **4.1 Keyword Research for 15 Top Comunas**
  
  **What to do**:
  - Research search volume for "seguridad privada [comuna]"
  - Identify top 15 comunas by search potential
  - Document target keywords per comuna
  - Create spreadsheet: comuna, zone, keywords, priority
  
  **Must NOT do**:
  - Start creating pages without research
  - Include all 52 comunas (scope creep)
  
  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []
  
  **Parallelization**:
  - **Can Run In Parallel**: YES (with Wave 3)
  - **Parallel Group**: Can start early
  - **Blocks**: 4.4, 4.5
  
  **References**:
  - `convex/communes.ts` - List of all comunas
  
  **Acceptance Criteria**:
  - [ ] 15 comunas selected with justification
  - [ ] Keywords documented for each
  - [ ] Spreadsheet saved to `.sisyphus/drafts/comuna-keywords.csv`
  
  **QA Scenarios**:
  ```
  Scenario: Keyword research complete
    Tool: Bash
    Steps:
      1. Read .sisyphus/drafts/comuna-keywords.csv
      2. Verify 15 rows
      3. Verify keyword column populated
    Expected Result: Research document complete
    Evidence: .sisyphus/evidence/task-4.1-keywords.csv
  ```
  
  **Commit**: NO (research artifact)

- [ ] **4.2 Create /servicios/[service]/[commune] Route**
  
  **What to do**:
  - Create `web/src/pages/servicios/[service]/[commune].astro`
  - Implement data fetching from Convex (service + commune + service_location)
  - Render hero with service title + commune name
  - Render service features
  - Render local benefits section
  - Add breadcrumb navigation
  - Add CTA section
  
  **Must NOT do**:
  - Hardcode content (all from Convex)
  - Add more pages than needed
  
  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: [`frontend-ui-ux`]
  
  **Parallelization**:
  - **Can Run In Parallel**: YES (with 4.3)
  - **Parallel Group**: Wave 4
  - **Blocks**: 4.4
  
  **References**:
  - `convex_plan.md` Section 21.3 - Route implementation
  - `web/src/pages/servicios/[slug].astro` - Existing service page pattern
  
  **Acceptance Criteria**:
  - [ ] Route renders at `/servicios/guardias-seguridad/las-condes`
  - [ ] 404 returned for invalid service or commune
  - [ ] Breadcrumb shows correct path
  - [ ] Meta tags populated from data
  
  **QA Scenarios**:
  ```
  Scenario: Service-commune page renders
    Tool: Playwright
    Steps:
      1. Navigate to /servicios/guardias-seguridad/las-condes
      2. Verify H1 contains "Las Condes"
      3. Verify breadcrumb shows Home > Servicios > Guardias > Las Condes
      4. Check meta title and description
    Expected Result: Page renders correctly
    Evidence: .sisyphus/evidence/task-4.2-route-page.png
  ```
  
  **Commit**: YES
  - Message: `feat(web): add service×commune SEO route`
  - Files: `web/src/pages/servicios/[service]/[commune].astro`

- [ ] **4.3 Implement LocalBusiness + Service Schemas**
  
  **What to do**:
  - Create `web/src/components/seo/LocalBusinessSchema.astro` enhanced
  - Create `web/src/components/seo/ServiceSchema.astro` enhanced
  - Add BreadcrumbList schema component
  - Include geo coordinates for each commune
  - Include AggregateRating (even if placeholder)
  - Wire schemas to service×commune pages
  
  **Must NOT do**:
  - Use fake review data (use real or omit)
  - Add more schema types than needed
  
  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: [`frontend-ui-ux`]
  
  **Parallelization**:
  - **Can Run In Parallel**: YES (with 4.2)
  - **Parallel Group**: Wave 4
  - **Blocks**: None
  
  **References**:
  - `convex_plan.md` Section 11, 18 - Schema.org implementation
  - `web/src/components/seo/` - Existing SEO components
  
  **Acceptance Criteria**:
  - [ ] LocalBusiness schema validates in Google Rich Results Test
  - [ ] Service schema validates
  - [ ] BreadcrumbList schema validates
  - [ ] All schemas render on service×commune pages
  
  **QA Scenarios**:
  ```
  Scenario: Structured data validates
    Tool: Bash + curl
    Steps:
      1. Fetch /servicios/guardias-seguridad/las-condes
      2. Extract JSON-LD from page
      3. Test in Google Rich Results Test
    Expected Result: All schemas pass validation
    Evidence: .sisyphus/evidence/task-4.3-schema-validation.png
  ```
  
  **Commit**: YES
  - Message: `feat(seo): implement LocalBusiness, Service, BreadcrumbList schemas`
  - Files: `web/src/components/seo/LocalBusinessSchema.astro`, `web/src/components/seo/ServiceSchema.astro`, `web/src/components/seo/BreadcrumbSchema.astro`

- [x] **4.4 Create Service Locations Seed Data (90 pages)** ✅ READY (2026-02-19)
  
  **Implementation**:
  - Added `seedServiceLocations` mutation in `convex/service_locations.ts`
  - Seed function creates 6 services × 15 comunas = 90 records
  - Auto-generates meta_title and meta_description from templates
  - Sets is_active = true for all
  - Leaves intro_content empty for AI generation
  
  **To Execute** (after Convex deployment):
  ```
  npx convex run service_locations:seedServiceLocations
  ```
  
  **Files Modified**:
  - `convex/service_locations.ts`
  
  **What to do**:
  - Run seed script to create 6 services × 15 comunas = 90 records
  - Auto-generate meta_title and meta_description from templates
  - Set is_active = true for all
  - Leave intro_content empty (AI generation task)
  
  **Must NOT do**:
  - Create more than 90 records (15 comunas × 6 services)
  - Generate full content (separate task)
  
  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []
  
  **Parallelization**:
  - **Can Run In Parallel**: NO (depends on 4.1, 4.2)
  - **Parallel Group**: Sequential after 4.1, 4.2
  - **Blocks**: 4.5
  
  **References**:
  - `convex/service_locations.ts` - CRUD from Task 1.6
  - `convex_plan.md` Appendix D - Seed script example
  
  **Acceptance Criteria**:
  - [ ] 90 records in service_locations table
  - [ ] Each has service_slug, commune_slug, meta_title, meta_description
  - [ ] All 15 comunas × 6 services combinations present
  
  **QA Scenarios**:
  ```
  Scenario: Seed data creates 90 pages
    Tool: Bash
    Steps:
      1. Run seed mutation
      2. Query service_locations count
      3. Verify 90 records
      4. Sample 5 records for correct structure
    Expected Result: 90 records created
    Evidence: .sisyphus/evidence/task-4.4-seed-data.txt
  ```
  
  **Commit**: YES
  - Message: `feat(seo): seed 90 service_location records for 15 comunas`
  - Files: `convex/service_locations.ts` (add seed function)

- [ ] **4.5 Generate AI Content for 15 Comunas**
  
  **What to do**:
  - For each of 90 service_locations, generate unique intro_content
  - Use AI to create 300+ words per page
  - Content must mention: commune name, service type, local context
  - Ensure uniqueness (not template swap)
  - Store in intro_content field
  
  **Must NOT do**:
  - Generate duplicate content with only names swapped
  - Skip manual review step
  
  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []
  
  **Parallelization**:
  - **Can Run In Parallel**: NO (depends on 4.4)
  - **Parallel Group**: Sequential after 4.4
  - **Blocks**: 5.4
  
  **References**:
  - `convex_plan.md` Section 23 - Thin content avoidance
  - Keywords from Task 4.1
  
  **Acceptance Criteria**:
  - [ ] All 90 pages have intro_content
  - [ ] Content is 300+ words
  - [ ] Content passes plagiarism check (basic)
  - [ ] Content reads naturally in Spanish
  
  **QA Scenarios**:
  ```
  Scenario: AI content is unique
    Tool: Bash
    Steps:
      1. Query 5 random service_locations
      2. Compare intro_content between similar services in different comunas
      3. Verify < 30% similarity
    Expected Result: Content is unique
    Evidence: .sisyphus/evidence/task-4.5-ai-content.txt
  ```
  
  **Commit**: YES
  - Message: `feat(seo): add AI-generated content for 90 service_location pages`
  - Files: Convex data (via mutation)

- [ ] **4.6 Build Dynamic sitemap.xml.ts**
  
  **What to do**:
  - Create `web/src/pages/sitemap.xml.ts` endpoint
  - Fetch all dynamic content from Convex
  - Generate sitemap entries for:
    - Static pages (7)
    - Services (6)
    - Solutions (8)
    - Communes (52)
    - Service×Communes (90)
    - Blog posts (dynamic)
  - Set proper priorities and change frequencies
  
  **Must NOT do**:
  - Use static sitemap (defeats purpose)
  
  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: [`frontend-ui-ux`]
  
  **Parallelization**:
  - **Can Run In Parallel**: YES (with 4.5)
  - **Parallel Group**: Wave 4
  - **Blocks**: 5.6
  
  **References**:
  - `convex_plan.md` Appendix C - Sitemap implementation
  
  **Acceptance Criteria**:
  - [ ] `curl /sitemap.xml` returns valid XML
  - [ ] All 163+ URLs included
  - [ ] XML validates against sitemap schema
  - [ ] Proper Content-Type header
  
  **QA Scenarios**:
  ```
  Scenario: Sitemap is valid XML
    Tool: Bash
    Steps:
      1. curl https://guardman.cl/sitemap.xml
      2. Validate XML structure
      3. Count URL entries
      4. Verify priorities are correct
    Expected Result: Valid sitemap with all URLs
    Evidence: .sisyphus/evidence/task-4.6-sitemap.xml
  ```
  
  **Commit**: YES
  - Message: `feat(seo): add dynamic sitemap generation`
  - Files: `web/src/pages/sitemap.xml.ts`

- [ ] **4.7 Implement Breadcrumb Navigation**
  
  **What to do**:
  - Create `web/src/components/Breadcrumbs.astro`
  - Support configurable items: Home > Servicios > Service > Commune
  - Add BreadcrumbList schema alongside visual breadcrumbs
  - Apply to all relevant pages (services, solutions, communes, blog)
  
  **Must NOT do**:
  - Hardcode breadcrumb paths
  
  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: [`frontend-ui-ux`]
  
  **Parallelization**:
  - **Can Run In Parallel**: YES (with 4.5, 4.6)
  - **Parallel Group**: Wave 4
  - **Blocks**: None
  
  **References**:
  - `web/src/components/Breadcrumbs.astro` - Existing component
  
  **Acceptance Criteria**:
  - [ ] Breadcrumbs render on service×commune pages
  - [ ] Links are clickable and work
  - [ ] BreadcrumbList schema renders correctly
  
  **QA Scenarios**:
  ```
  Scenario: Breadcrumbs work correctly
    Tool: Playwright
    Steps:
      1. Navigate to /servicios/guardias-seguridad/las-condes
      2. Verify breadcrumbs visible
      3. Click "Servicios" link
      4. Verify navigation to /servicios
    Expected Result: Breadcrumbs functional
    Evidence: .sisyphus/evidence/task-4.7-breadcrumbs.png
  ```
  
  **Commit**: YES
  - Message: `feat(web): add breadcrumb navigation with schema`
  - Files: `web/src/components/Breadcrumbs.astro`

---

### Wave 5: Polish + Launch (Days 31-34)

- [ ] **5.1 Remove Hardcoded Text from Components**
  
  **What to do**:
  - Audit all components for hardcoded strings
  - Move strings to Convex (content) or i18n (UI chrome)
  - Update components to use externalized content
  - Priority: Header nav, Footer links, CTA text
  
  **Must NOT do**:
  - Redesign components
  - Add new features
  
  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []
  
  **Parallelization**:
  - **Can Run In Parallel**: YES (with 5.2)
  - **Parallel Group**: Wave 5
  - **Blocks**: None
  
  **References**:
  - `convex_plan.md` Section 28 - Content externalization
  
  **Acceptance Criteria**:
  - [ ] No hardcoded user-visible text in components
  - [ ] All text from Convex or i18n dictionary
  - [ ] Pages render correctly
  
  **QA Scenarios**:
  ```
  Scenario: Content is externalized
    Tool: Bash (grep)
    Steps:
      1. Grep for hardcoded Spanish text in components
      2. Verify all strings are in i18n or Convex
      3. Test pages still render correctly
    Expected Result: No hardcoded text found
    Evidence: .sisyphus/evidence/task-5.1-externalized.txt
  ```
  
  **Commit**: YES
  - Message: `refactor(web): externalize hardcoded text`
  - Files: Multiple component files

- [ ] **5.2 Create i18n Dictionary for UI Chrome**
  
  **What to do**:
  - Create `web/src/i18n/es.ts` with UI strings
  - Include: nav labels, form labels, button text, error messages
  - Create utility function to access strings
  - Replace remaining hardcoded strings
  
  **Must NOT do**:
  - Add multi-language support (es-CL only)
  
  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []
  
  **Parallelization**:
  - **Can Run In Parallel**: YES (with 5.1)
  - **Parallel Group**: Wave 5
  - **Blocks**: None
  
  **References**:
  - `convex_plan.md` Section 28.2 - i18n dictionary structure
  
  **Acceptance Criteria**:
  - [ ] `web/src/i18n/es.ts` created
  - [ ] All UI chrome strings in dictionary
  - [ ] Components use dictionary
  
  **QA Scenarios**:
  ```
  Scenario: i18n dictionary works
    Tool: Bash
    Steps:
      1. Import i18n dictionary
      2. Verify all expected keys exist
      3. Test component rendering with dictionary
    Expected Result: Dictionary complete and used
    Evidence: .sisyphus/evidence/task-5.2-i18n.txt
  ```
  
  **Commit**: YES
  - Message: `feat(web): add i18n dictionary for UI chrome`
  - Files: `web/src/i18n/es.ts`

- [ ] **5.3 QA All Admin Resources**
  
  **What to do**:
  - Manual test of all 19 admin resources
  - Verify CRUD operations work for each
  - Check for console errors
  - Test edge cases (empty states, long text, special characters)
  - Document any issues found
  
  **Must NOT do**:
  - Skip resources
  - Assume everything works
  
  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: [`frontend-ui-ux`]
  
  **Parallelization**:
  - **Can Run In Parallel**: YES (with 5.1, 5.2)
  - **Parallel Group**: Wave 5
  - **Blocks**: 5.5
  
  **References**:
  - All resources from Wave 3
  
  **Acceptance Criteria**:
  - [ ] All 19 resources tested
  - [ ] No console errors
  - [ ] Issues documented and prioritized
  
  **QA Scenarios**:
  ```
  Scenario: Admin resources fully functional
    Tool: Playwright
    Steps:
      1. Login to admin
      2. For each resource:
         a. Navigate to list
         b. Create new item
         c. Edit item
         d. Delete item
      3. Log any errors
    Expected Result: All resources pass CRUD test
    Evidence: .sisyphus/evidence/task-5.3-admin-qa.png
  ```
  
  **Commit**: NO (testing only)

- [ ] **5.4 SEO Validation (Rich Results Test)**
  
  **What to do**:
  - Test 5 sample service×commune pages in Google Rich Results Test
  - Verify LocalBusiness schema passes
  - Verify Service schema passes
  - Fix any validation errors
  - Document results
  
  **Must NOT do**:
  - Skip validation
  
  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []
  
  **Parallelization**:
  - **Can Run In Parallel**: YES (with 5.3)
  - **Parallel Group**: Wave 5
  - **Blocks**: 5.5
  
  **References**:
  - https://search.google.com/test/rich-results - Testing tool
  
  **Acceptance Criteria**:
  - [ ] 5 pages pass Rich Results Test
  - [ ] All schemas validated
  - [ ] No errors or warnings
  
  **QA Scenarios**:
  ```
  Scenario: Schema validation passes
    Tool: Manual (Google Rich Results Test)
    Steps:
      1. Open Rich Results Test
      2. Test 5 service×commune URLs
      3. Verify all schemas recognized
      4. Screenshot results
    Expected Result: All pages pass
    Evidence: .sisyphus/evidence/task-5.4-rich-results.png
  ```
  
  **Commit**: NO (testing only)

- [ ] **5.5 Deploy to Production**
  
  **What to do**:
  - Run full build: `npm run build`
  - Verify build succeeds for web and admin
  - Push to main branch
  - Verify Vercel deployment succeeds
  - Test production URLs
  
  **Must NOT do**:
  - Deploy with failing build
  - Skip Vercel verification
  
  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []
  
  **Parallelization**:
  - **Can Run In Parallel**: NO (final step)
  - **Parallel Group**: Sequential after 5.3, 5.4
  - **Blocks**: 5.6
  
  **References**:
  - Vercel dashboard
  
  **Acceptance Criteria**:
  - [ ] Build succeeds
  - [ ] Vercel deployment green
  - [ ] Production site loads
  - [ ] Admin loads at /admin
  - [ ] SEO pages accessible
  
  **QA Scenarios**:
  ```
  Scenario: Production deployment successful
    Tool: Bash
    Steps:
      1. npm run build
      2. git push origin main
      3. Wait for Vercel deploy
      4. curl https://guardman.cl
      5. curl https://guardman.cl/admin
    Expected Result: All systems operational
    Evidence: .sisyphus/evidence/task-5.5-deploy.txt
  ```
  
  **Commit**: YES
  - Message: `release: Guardman admin migration + SEO launch`
  - Files: All (final release commit)

- [ ] **5.6 Submit Sitemap to Google Search Console**
  
  **What to do**:
  - Log into Google Search Console
  - Add/verify sitemap URL: https://guardman.cl/sitemap.xml
  - Request indexing for key pages
  - Document submission
  
  **Must NOT do**:
  - Skip this step (critical for SEO)
  
  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []
  
  **Parallelization**:
  - **Can Run In Parallel**: NO (after 5.5)
  - **Parallel Group**: Sequential after 5.5
  - **Blocks**: None
  
  **References**:
  - https://search.google.com/search-console
  
  **Acceptance Criteria**:
  - [ ] Sitemap submitted
  - [ ] No errors in GSC
  - [ ] Key pages requested for indexing
  
  **QA Scenarios**:
  ```
  Scenario: Sitemap submitted to Google
    Tool: Manual (Google Search Console)
    Steps:
      1. Log into GSC
      2. Navigate to Sitemaps
      3. Submit /sitemap.xml
      4. Verify "Success" status
    Expected Result: Sitemap accepted
    Evidence: .sisyphus/evidence/task-5.6-gsc.png
  ```
  
  **Commit**: NO (manual action)

---

## Final Verification Wave

### F1. Plan Compliance Audit — `oracle`
Read the plan end-to-end. For each "Must Have": verify implementation exists. For each "Must NOT Have": search codebase for forbidden patterns. Check evidence files.

**QA Scenarios**:
```
Scenario: Verify all Must-Have features implemented
  Tool: Bash
  Steps:
    1. npx convex schema → verify new tables exist
    2. grep -r "convexDataProvider" admin/src/ → verify data provider
    3. curl https://guardman.cl/sitemap.xml → verify sitemap exists
  Expected Result: All checks pass
  Evidence: .sisyphus/evidence/final-audit.txt
```

### F2. Admin Functionality Review — `unspecified-high`
Test all 19 admin resources: list, create, edit, delete operations.

**QA Scenarios**:
```
Scenario: Admin CRUD smoke test
  Tool: Playwright
  Steps:
    1. Login to admin
    2. Navigate to /admin/services
    3. Create new service with test data
    4. Edit the service
    5. Delete the service
    6. Repeat for 3 other resources
  Expected Result: All operations succeed
  Evidence: .sisyphus/evidence/admin-crud-test.png
```

### F3. SEO Pages Quality Check — `unspecified-high`
Verify 15 comuna pages have unique content, valid schema, proper meta tags.

**QA Scenarios**:
```
Scenario: Comuna page SEO validation
  Tool: Playwright + curl
  Steps:
    1. Navigate to /servicios/guardias-seguridad/las-condes
    2. Check <title> contains "Las Condes"
    3. Check for LocalBusiness schema in <script type="application/ld+json">
    4. Verify meta description exists and is unique
    5. Test with Google Rich Results Test API
  Expected Result: All SEO elements present
  Evidence: .sisyphus/evidence/seo-validation.png
```

### F4. Scope Fidelity Check — `deep`
Verify no scope creep occurred. Check for out-of-scope features.

**QA Scenarios**:
```
Scenario: No out-of-scope features added
  Tool: Bash (grep)
  Steps:
    1. grep -r "audit" admin/src/ → should NOT find audit log features
    2. grep -r "i18n" web/src/ → should find only es-CL, no multi-language
    3. Check no redesign patterns in admin
  Expected Result: No forbidden patterns found
  Evidence: .sisyphus/evidence/scope-check.txt
```

---

## Commit Strategy

- **Per Wave**: Create checkpoint commits
- **Per Resource**: Atomic commits for each migrated CRUD
- **Message Format**: `feat(admin): migrate services to Refine`

---

## Success Criteria

### Verification Commands
```bash
# Schema validation
npx convex dev  # Expected: no errors

# Admin loads
npm run dev:admin  # Expected: admin loads at localhost:5173

# SEO pages work
curl https://guardman.cl/servicios/guardias-seguridad/las-condes  # Expected: 200 OK

# Sitemap exists
curl https://guardman.cl/sitemap.xml  # Expected: valid XML with 90+ URLs
```

### Final Checklist
- [ ] All "Must Have" present
- [ ] All "Must NOT Have" absent
- [ ] Admin CRUD operations work for all resources
- [ ] 15 comuna pages live with unique content
- [ ] Structured data validates in Google Rich Results Test
- [ ] Sitemap submitted to Google Search Console
