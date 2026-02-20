# Audit Remediation Plan - Guardman Chile

## TL;DR

> **Quick Summary**: Fix all critical blockers from the audit report to bring the application from ~25% to ~70% completion. Focus on data provider fixes, missing Convex functions, package version alignment, and schema completion.
> 
> **Deliverables**:
> - Fixed data provider with correct API references
> - All missing Convex functions added
> - Schema tables and fields completed
> - Package versions aligned
> - Functional admin CMS
> - Frontend foundation with layouts
> 
> **Estimated Effort**: XL (50+ tasks across 5 waves)
> **Parallel Execution**: YES - 5 waves
> **Critical Path**: Fix Data Provider → Add Missing Functions → Upgrade Packages → Schema Completion → Frontend Foundation

---

## Context

### Original Request
Fix all issues identified in the audit report for Guardman Chile project:
- Data provider broken (string paths vs API references)
- Missing Convex functions (getById queries)
- Package version mismatches
- Schema gaps (missing tables and fields)
- Frontend scaffold incomplete
- Admin CMS non-functional

### Interview Summary
**Key Discussions**:
- Audit confirmed ~25-30% completion
- Critical bug found: leads.ts expects `leadId` but data provider sends `id`
- Data provider uses string paths which don't work with ConvexReactClient at runtime
- Solutions has only getSolutionBySlug, not getSolutionById
- pages and content_blocks have no CRUD mutations

**Research Findings**:
- Root convex: ^1.32.0 vs web/admin: ^1.12.0 (version mismatch)
- Schema has v.any() in content_blocks.data (type safety issue)
- Missing tables: redirects, seo_metadata
- Missing fields on communes: order, is_published, latitude, longitude, population, unique_content

### Metis Review
**Identified Gaps** (addressed):
- Leads argument mismatch: data provider sends `id`, convex expects `leadId` → ADDED to plan
- Inconsistent argument naming across functions → ADDED validation task
- Web app uses wrong function name (services:getAll vs getAllServices) → ADDED to plan
- Pages/content_blocks CRUD missing → ADDED to plan

---

## Work Objectives

### Core Objective
Transform the application from ~25% to ~70% completion by fixing all critical blockers identified in the audit report.

### Concrete Deliverables
- Working data provider that correctly calls Convex API
- All missing getById queries added to Convex
- CRUD mutations for pages and content_blocks
- Schema enhanced with missing tables and fields
- Package versions aligned across monorepo
- Functional admin CMS with real data
- Frontend layouts and SEO component
- 312 service_location pages seeded

### Definition of Done
- [ ] npm run build exits 0 for web and admin
- [ ] npm run typecheck passes for all packages
- [ ] Admin CMS Services list loads data from Convex
- [ ] All 17+ admin resources have working CRUD
- [ ] Frontend pages render at /servicios/[slug], /soluciones/[slug], /blog/[slug]

### Must Have
- Data provider fixes (CRITICAL - blocks everything)
- Missing Convex functions
- Package version alignment
- Schema completion

### Must NOT Have (Guardrails)
- No string-based query paths in data provider
- No v.any() types in schema
- No version mismatches between packages
- No untested CRUD operations

---

## Verification Strategy

### Test Decision
- **Infrastructure exists**: YES
- **Automated tests**: Tests-after (no TDD for this fix-up work)
- **Framework**: vitest (web), none (admin/convex)
- **Agent-Executed QA**: EVERY task includes QA scenarios

### QA Policy
Every task MUST include agent-executed QA scenarios. Evidence saved to `.sisyphus/evidence/task-{N}-{scenario-slug}.{ext}`.

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately — Critical Blockers):
├── Task 1: Fix leads.ts argument mismatch (leadId → id)
├── Task 2: Add solutions:getSolutionById query
├── Task 3: Add pages CRUD mutations (create, update, delete)
├── Task 4: Add content_blocks CRUD mutations
├── Task 5: Fix data provider to use correct argument names
├── Task 6: Fix web/src function name (services:getAll → getAllServices)
└── Task 7: Upgrade convex packages to ^1.32.0 (web + admin)

Wave 2 (After Wave 1 — Schema Completion):
├── Task 8: Add redirects table to schema
├── Task 9: Add seo_metadata table to schema
├── Task 10: Add communes fields (order, is_published, lat, lng, population)
├── Task 11: Add blog_posts seo_title/seo_description fields
├── Task 12: Replace v.any() in content_blocks.data with typed schema
└── Task 13: Run schema migration in Convex

Wave 3 (After Wave 2 — Admin CMS Infrastructure):
├── Task 14: Install missing admin packages (antd, @dnd-kit, slugify)
├── Task 15: Create SlugField component for admin
├── Task 16: Create ImageUpload component for admin
├── Task 17: Create MarkdownField component for admin
├── Task 18: Create SeoPreview component for admin
├── Task 19: Implement all resource list pages in admin
├── Task 20: Implement all resource create/edit pages in admin
└── Task 21: Test all admin CRUD operations end-to-end

Wave 4 (After Wave 3 — Frontend Foundation):
├── Task 22: Create BaseLayout.astro
├── Task 23: Create Header.astro component
├── Task 24: Create Footer.astro component
├── Task 25: Create SEO.astro component
├── Task 26: Implement design system (colors, typography, spacing)
├── Task 27: Create servicios/[slug].astro detail page
├── Task 28: Create soluciones/[slug].astro detail page
├── Task 29: Create blog/[slug].astro detail page
├── Task 30: Create cobertura/[slug].astro commune page
├── Task 31: Replace static sitemap with dynamic sitemap.xml.ts
└── Task 32: Test all frontend pages render correctly

Wave 5 (After Wave 4 — SEO & Advanced):
├── Task 33: Implement LocalBusinessSchema.astro
├── Task 34: Implement BreadcrumbSchema.astro
├── Task 35: Create cookie consent banner (Ley 21.719)
├── Task 36: Fix service_locations seed (312 pages)
├── Task 37: Add image sitemap
└── Task 38: Final integration testing
```

### Dependency Matrix
- **1-7**: — — 8-13 (Wave 2)
- **8-13**: 1-7 — 14-21 (Wave 3)
- **14-21**: 8-13 — 22-32 (Wave 4)
- **22-32**: 14-21 — 33-38 (Wave 5)

---

## TODOs

- [x] 1. Fix leads.ts argument mismatch (leadId → id)

  **What to do**:
  - Read `convex/leads.ts` to find the getLeadById function
  - Change argument from `leadId` to `id` to match data provider expectation
  - Verify the change doesn't break other callers

  **Must NOT do**:
  - Change data provider - fix the Convex function to accept `id`

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: None required

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 2-7)
  - **Blocks**: Task 5, Task 21
  - **Blocked By**: None (can start immediately)

  **References**:
  - `convex/leads.ts` - Find getLeadById function definition
  - `admin/src/providers/convexDataProvider.ts:72` - Shows data provider sends `{ id: convexId }`

  **Acceptance Criteria**:
  - [ ] getLeadById accepts `id` parameter instead of `leadId`

  **QA Scenarios**:
  ```
  Scenario: Verify leads query accepts id parameter
    Tool: Bash
    Preconditions: Convex dev server running
    Steps:
      1. Run: npx convex run leads:getLeadById --id "existing-lead-id"
    Expected Result: Query returns lead data without error
    Evidence: .sisyphus/evidence/task-1-leads-fix.{ext}
  ```

- [x] 2. Add solutions:getSolutionById query

  **What to do**:
  - Read `convex/solutions.ts` to find existing structure
  - Add getSolutionById query that accepts `id: v.id('solutions')`
  - Return the solution document by ID

  **Must NOT do**:
  - Delete or modify getSolutionBySlug - keep both

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: None required

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 3-7)
  - **Blocks**: Task 5
  - **Blocked By**: None

  **References**:
  - `convex/solutions.ts` - Query patterns to follow
  - `convex/services.ts:getServiceById` - Example implementation

  **Acceptance Criteria**:
  - [ ] getSolutionById query exists and returns solution by ID

  **QA Scenarios**:
  ```
  Scenario: Verify getSolutionById works
    Tool: Bash
    Preconditions: Convex dev server, existing solution in DB
    Steps:
      1. Run: npx convex run solutions:getSolutionById --id "existing-solution-id"
    Expected Result: Returns solution JSON
    Evidence: .sisyphus/evidence/task-2-solutions-query.{ext}
  ```

- [x] 3. Add pages CRUD mutations

  **What to do**:
  - Read `convex/pages.ts` - currently only has queries
  - Add createPage mutation
  - Add updatePage mutation  
  - Add deletePage mutation

  **Must NOT do**:
  - Change existing queries

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: None required

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1-2, 4-7)
  - **Blocks**: Task 19, Task 20
  - **Blocked By**: None

  **References**:
  - `convex/services.ts:createService` - Mutation pattern to follow
  - `convex/schema.ts:134-143` - pages table schema

  **Acceptance Criteria**:
  - [ ] createPage mutation exists
  - [ ] updatePage mutation exists
  - [ ] deletePage mutation exists

  **QA Scenarios**:
  ```
  Scenario: Create new page via mutation
    Tool: Bash
    Preconditions: Convex dev server
    Steps:
      1. Run: npx convex run pages:createPage --slug "/test" --title "Test" --seo-title "Test SEO" --seo-description "Test desc" --is_published true
    Expected Result: Returns new page ID
    Evidence: .sisyphus/evidence/task-3-pages-create.{ext}

  Scenario: Delete page via mutation
    Tool: Bash
    Preconditions: Page created in previous test
    Steps:
      1. Run: npx convex run pages:deletePage --id "created-page-id"
    Expected Result: Page deleted successfully
    Evidence: .sisyphus/evidence/task-3-pages-delete.{ext}
  ```

- [x] 4. Add content_blocks CRUD mutations

  **What to do**:
  - Read `convex/content_blocks.ts` - currently only has queries
  - Add createContentBlock mutation
  - Add updateContentBlock mutation
  - Add deleteContentBlock mutation

  **Must NOT do**:
  - Change existing queries

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: None required

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1-3, 5-7)
  - **Blocks**: Task 19, Task 20
  - **Blocked By**: None

  **References**:
  - `convex/services.ts:createService` - Mutation pattern
  - `convex/schema.ts:145-155` - content_blocks schema

  **Acceptance Criteria**:
  - [ ] createContentBlock mutation exists
  - [ ] updateContentBlock mutation exists
  - [ ] deleteContentBlock mutation exists

  **QA Scenarios**:
  ```
  Scenario: CRUD content blocks
    Tool: Bash
    Preconditions: Convex dev server
    Steps:
      1. Create: npx convex run content_blocks:createContentBlock --page_slug "home" --type "hero" --order 1 --is_visible true
      2. Update: npx convex run content_blocks:updateContentBlock --id "block-id" --title "New Title"
      3. Delete: npx convex run content_blocks:deleteContentBlock --id "block-id"
    Expected Result: All operations succeed
    Evidence: .sisyphus/evidence/task-4-contentblocks-crud.{ext}
  ```

- [x] 5. Fix data provider to use correct argument names

  **What to do**:
  - Read `admin/src/providers/convexDataProvider.ts`
  - Fix the leads resource: change `getQuery: 'leads:getLeadById'` to use argument mapping
  - Ensure all resources pass correct argument names to Convex
  - Remove @ts-expect-error comments by using proper typing

  **Must NOT do**:
  - Use string paths - use proper API references

  **Recommended Agent Profile**:
  - **Category**: `deep`
  - **Skills**: None required

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1-4, 6-7)
  - **Blocks**: Task 19, Task 20, Task 21
  - **Blocked By**: Tasks 1, 2, 3, 4

  **References**:
  - `admin/src/providers/convexDataProvider.ts` - Full file to fix
  - `convex/leads.ts` - Check expected argument names

  **Acceptance Criteria**:
  - [ ] Data provider passes correct arguments to all functions
  - [ ] No @ts-expect-error comments
  - [ ] Admin Services list loads data

  **QA Scenarios**:
  ```
  Scenario: Admin loads services list
    Tool: Playwright (dev-browser skill)
    Preconditions: Admin dev server running
    Steps:
      1. Navigate to http://localhost:3001/resources/services
      2. Wait for data to load
      3. Verify services are displayed
    Expected Result: Services list shows data from Convex
    Evidence: .sisyphus/evidence/task-5-services-list.{ext}

  Scenario: Admin loads leads
    Tool: Playwright
    Preconditions: Admin dev server running
    Steps:
      1. Navigate to http://localhost:3001/resources/leads
      2. Verify leads load without error
    Expected Result: Leads display correctly (no argument error)
    Evidence: .sisyphus/evidence/task-5-leads-list.{ext}
  ```

- [x] 6. Fix web/src function name (services:getAll → getAllServices)

  **What to do**:
  - Search web/src for incorrect function references
  - Fix any calls to non-existent functions
  - Ensure web uses correct Convex query names

  **Must NOT do**:
  - Break existing working queries

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: None required

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1-5, 7)
  - **Blocks**: Task 27
  - **Blocked By**: None

  **References**:
  - `convex/services.ts` - List all exported queries
  - `web/src` - Search for function calls

  **Acceptance Criteria**:
  - [ ] All Convex function calls in web use correct names

  **QA Scenarios**:
  ```
  Scenario: Build web without errors
    Tool: Bash
    Preconditions: None
    Steps:
      1. Run: cd web && npm run build
    Expected Result: Build exits 0
    Evidence: .sisyphus/evidence/task-6-web-build.{ext}
  ```

- [x] 7. Upgrade convex packages to ^1.32.0

  **What to do**:
  - Update web/package.json convex version from ^1.12.0 to ^1.32.0
  - Update admin/package.json convex version from ^1.12.0 to ^1.32.0
  - Run npm install to update lockfiles

  **Must NOT do**:
  - Change other package versions

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: None required

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1-6)
  - **Blocks**: Task 14, Task 21, Task 32
  - **Blocked By**: None

  **References**:
  - `package.json` (root) - Version to match: ^1.32.0
  - `web/package.json` - Current: ^1.12.0
  - `admin/package.json` - Current: ^1.12.0

  **Acceptance Criteria**:
  - [ ] web/package.json convex: ^1.32.0
  - [ ] admin/package.json convex: ^1.32.0
  - [ ] npm install succeeds

  **QA Scenarios**:
  ```
  Scenario: Install and build
    Tool: Bash
    Preconditions: Versions updated
    Steps:
      1. npm install
      2. npm run build
    Expected Result: Build succeeds
    Evidence: .sisyphus/evidence/task-7-build.{ext}
  ```

- [x] 8. Add redirects table to schema

- [x] 9. Add seo_metadata table to schema

- [x] 10. Add communes fields (order, is_published, lat, lng, population)

- [x] 11. Add blog_posts seo_title/seo_description fields

- [x] 12. Replace v.any() in content_blocks.data with typed schema

- [x] 13. Run schema migration in Convex

  **What to do**:
  - Run npx convex deploy to apply schema changes
  - Verify all new tables and fields are created
  - Test basic queries on new tables

  **Must NOT do**:
  - Break existing data

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: None required

  **Parallelization**:
  - **Can Run In Parallel**: NO (after all schema changes)
  - **Parallel Group**: Wave 2 (final)
  - **Blocks**: Tasks 14-38
  - **Blocked By**: Tasks 8-12

  **References**:
  - `npx convex deploy` - Apply schema

  **Acceptance Criteria**:
  - [ ] Schema deploys without errors
  - [ ] New tables accessible

  **QA Scenarios**:
  ```
  Scenario: Deploy schema
    Tool: Bash
    Preconditions: All schema tasks complete
    Steps:
      1. Run: npx convex deploy
    Expected Result: Deploy succeeds
    Evidence: .sisyphus/evidence/task-13-deploy.{ext}
  ```

- [x] 14. Install missing admin packages (antd, @dnd-kit, slugify)

- [x] 15. Create SlugField component for admin

- [x] 16. Create ImageUpload component for admin

- [x] 17. Create MarkdownField component for admin

- [x] 18. Create SeoPreview component for admin

  **What to do**:
  - Create admin/src/components/common/SeoPreview.tsx
  - Show Google SERP preview
  - Show social media (OG) preview
  - Real-time update as user types

  **Must NOT do**:
  - Hardcode any values

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: None required

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 14-17, 19-21)
  - **Blocks**: None
  - **Blocked By**: Task 14

  **Acceptance Criteria**:
  - [ ] SeoPreview component exists
  - [ ] Shows SERP preview

  **QA Scenarios**:
  ```
  Scenario: SEO preview updates
    Tool: Playwright
    Preconditions: Admin running
    Steps:
      1. Navigate to service editor
      2. Enter SEO title
      3. Verify preview updates
    Expected Result: Preview reflects input
    Evidence: .sisyphus/evidence/task-18-seopreview.{ext}
  ```

- [x] 19. Implement all resource list pages in admin

  **What to do**:
  - Create list components for all resources:
    - SolutionsList, LeadsList, BlogPostsList, HeroesList, FaqsList, TestimonialsList, PartnersList, IndustriesList, CtasList, StatsList, ProcessStepsList, TeamMembersList, CompanyValuesList, PagesList, ContentBlocksList, AuthorsList, SiteConfigList, ServiceLocationsList, ReviewsList, CareersList, CareerBenefitsList
  - Use Refine list hooks
  - Connect to data provider

  **Must NOT do**:
  - Create duplicate list pages

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: None required

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 14-18, 20-21)
  - **Blocks**: None
  - **Blocked By**: Tasks 5, 14

  **Acceptance Criteria**:
  - [ ] All 20+ resources have list pages
  - [ ] Data loads from Convex

  **QA Scenarios**:
  ```
  Scenario: View solutions list
    Tool: Playwright
    Preconditions: Admin running
    Steps:
      1. Navigate to /resources/solutions
      2. Verify solutions load
    Expected Result: List displays data
    Evidence: .sisyphus/evidence/task-19-solutions-list.{ext}
  ```

- [x] 20. Implement all resource create/edit pages in admin

  **What to do**:
  - Create create/edit components for all resources
  - Use Refine form hooks
  - Integrate SlugField, ImageUpload, MarkdownField, SeoPreview

  **Must NOT do**:
  - Break existing forms

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: None required

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 14-19, 21)
  - **Blocks**: None
  - **Blocked By**: Tasks 5, 14, 15, 16, 17, 18

  **Acceptance Criteria**:
  - [ ] All resources have create page
  - [ ] All resources have edit page
  - [ ] Forms submit to Convex

  **QA Scenarios**:
  ```
  Scenario: Create new solution
    Tool: Playwright
    Preconditions: Admin running
    Steps:
      1. Navigate to /resources/solutions/create
      2. Fill form with test data
      3. Submit
    Expected Result: Solution created in Convex
    Evidence: .sisyphus/evidence/task-20-create-solution.{ext}
  ```

- [x] 21. Test all admin CRUD operations end-to-end

- [x] 22. Create BaseLayout.astro

  **What to do**:
  - Create web/src/layouts/BaseLayout.astro
  - Include Header, Footer, SEO
  - Wrap all pages with consistent structure
  - Add lang="es" attribute

  **Must NOT do**:
  - Duplicate header/footer code

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: None required

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with Tasks 23-32)
  - **Blocks**: Tasks 27-30
  - **Blocked By**: Task 21

  **References**:
  - web/src/pages/index.astro - Existing page structure

  **Acceptance Criteria**:
  - [ ] BaseLayout wraps all pages
  - [ ] SEO component included

  **QA Scenarios**:
  ```
  Scenario: BaseLayout renders
    Tool: Bash
    Preconditions: None
    Steps:
      1. Run: cd web && npm run build
    Expected Result: Build succeeds
    Evidence: .sisyphus/evidence/task-22-baselayout.{ext}
  ```

- [x] 23. Create Header.astro component

- [x] 24. Create Footer.astro component

- [x] 25. Create SEO.astro component

  **What to do**:
  - Create web/src/components/SEO.astro
  - Accept title, description, image, canonical, ogType
  - Include meta tags, Open Graph, Twitter Cards
  - Default values from site_config

  **Must NOT do**:
  - Duplicate SEO tags

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: None required

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with Tasks 22-24, 26-32)
  - **Blocks**: Task 22
  - **Blocked By**: Task 21

  **Acceptance Criteria**:
  - [ ] SEO component works
  - [ ] All meta tags present

  **QA Scenarios**:
  ```
  Scenario: SEO tags present
    Tool: Playwright
    Preconditions: Web running
    Steps:
      1. Navigate to homepage
      2. View page source
      3. Verify og:title, og:description present
    Expected Result: All SEO tags present
    Evidence: .sisyphus/evidence/task-25-seo.{ext}
  ```

- [ ] 26. Implement design system (colors, typography, spacing)

  **What to do**:
  - Configure tailwind.config.mjs with design tokens
  - Define color palette (primary, secondary, accent)
  - Define typography (font families, sizes)
  - Define spacing scale

  **Must NOT do**:
  - Break existing styles

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: None required

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with Tasks 22-25, 27-32)
  - **Blocks**: None
  - **Blocked By**: Task 21

  **Acceptance Criteria**:
  - [ ] Design tokens configured
  - [ ] Consistent styling across pages

  **QA Scenarios**:
  ```
  Scenario: Design system applied
    Tool: Playwright
    Preconditions: None
    Steps:
      1. Navigate to homepage
      2. Inspect computed styles
    Expected Result: Design tokens applied
    Evidence: .sisyphus/evidence/task-26-design.{ext}
  ```

- [x] 27. Create servicios/[slug].astro detail page

  **What to do**:
  - Create web/src/pages/servicios/[slug].astro
  - Fetch service by slug from Convex
  - Render service details, features, CTA
  - Include JSON-LD schema

  **Must NOT do**:
  - Hardcode service data

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: None required

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with Tasks 22-26, 28-32)
  - **Blocks**: Task 32
  - **Blocked By**: Tasks 22, 25

  **Acceptance Criteria**:
  - [ ] /servicios/guardia-seguridad renders
  - [ ] Data from Convex

  **QA Scenarios**:
  ```
  Scenario: Service detail page
    Tool: Playwright
    Preconditions: Web running
    Steps:
      1. Navigate to /servicios/guardia-seguridad
      2. Verify service details display
    Expected Result: Page renders with data
    Evidence: .sisyphus/evidence/task-27-service.{ext}
  ```

- [x] 28. Create soluciones/[slug].astro detail page

  **What to do**:
  - Create web/src/pages/soluciones/[slug].astro
  - Fetch solution by slug from Convex
  - Render solution details, challenges, benefits

  **Must NOT do**:
  - Hardcode solution data

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: None required

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with Tasks 22-27, 29-32)
  - **Blocks**: Task 32
  - **Blocked By**: Tasks 22, 25

  **Acceptance Criteria**:
  - [ ] /soluciones/condominios renders
  - [ ] Data from Convex

  **QA Scenarios**:
  ```
  Scenario: Solution detail page
    Tool: Playwright
    Preconditions: Web running
    Steps:
      1. Navigate to /soluciones/condominios
      2. Verify solution details display
    Expected Result: Page renders with data
    Evidence: .sisyphus/evidence/task-28-solution.{ext}
  ```

- [x] 29. Create blog/[slug].astro detail page

  **What to do**:
  - Create web/src/pages/blog/[slug].astro
  - Fetch post by slug from Convex
  - Render markdown content
  - Include author, date, reading time

  **Must NOT do**:
  - Hardcode blog content

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: None required

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with Tasks 22-28, 30-32)
  - **Blocks**: Task 32
  - **Blocked By**: Tasks 22, 25

  **Acceptance Criteria**:
  - [ ] /blog/first-post renders
  - [ ] Markdown renders correctly

  **QA Scenarios**:
  ```
  Scenario: Blog detail page
    Tool: Playwright
    Preconditions: Web running
    Steps:
      1. Navigate to /blog/first-post
      2. Verify content renders
    Expected Result: Blog post displays
    Evidence: .sisyphus/evidence/task-29-blog.{ext}
  ```

- [x] 30. Create cobertura/[slug].astro commune page

  **What to do**:
  - Create web/src/pages/cobertura/[slug].astro
  - Fetch commune by slug
  - Show available services in commune

  **Must NOT do**:
  - Hardcode commune data

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: None required

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with Tasks 22-29, 31-32)
  - **Blocks**: Task 32
  - **Blocked By**: Tasks 22, 25

  **Acceptance Criteria**:
  - [ ] /cobertura/santiago renders
  - [ ] Services listed for commune

  **QA Scenarios**:
  ```
  Scenario: Commune page
    Tool: Playwright
    Preconditions: Web running
    Steps:
      1. Navigate to /cobertura/santiago
      2. Verify commune services display
    Expected Result: Page renders with data
    Evidence: .sisyphus/evidence/task-30-commune.{ext}
  ```

- [x] 31. Replace static sitemap with dynamic sitemap.xml.ts

  **What to do**:
  - Replace web/src/pages/sitemap.xml.astro
  - Create web/src/pages/sitemap.xml.ts
  - Fetch all pages from Convex
  - Generate dynamic sitemap

  **Must NOT do**:
  - Break existing sitemap

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: None required

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with Tasks 22-30, 32)
  - **Blocks**: Task 32
  - **Blocked By**: Tasks 22, 25

  **Acceptance Criteria**:
  - [ ] /sitemap.xml dynamic
  - [ ] All pages included

  **QA Scenarios**:
  ```
  Scenario: Dynamic sitemap
    Tool: Bash
    Preconditions: Web running
    Steps:
      1. Fetch: curl https://[deployment]/sitemap.xml
    Expected Result: XML with all routes
    Evidence: .sisyphus/evidence/task-31-sitemap.{ext}
  ```

- [x] 32. Test all frontend pages render correctly

  **What to do**:
  - Test homepage renders
  - Test all service detail pages render
  - Test all solution detail pages render
  - Test all blog posts render
  - Test all commune pages render

  **Must NOT do**:
  - Skip any page type

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: None required

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 4 (final)
  - **Blocks**: None
  - **Blocked By**: Tasks 22-31

  **Acceptance Criteria**:
  - [ ] All page types render

  **QA Scenarios**:
  ```
  Scenario: Frontend pages
    Tool: Playwright
    Preconditions: Web running
    Steps:
      1. Visit homepage
      2. Visit /servicios/guardia-seguridad
      3. Visit /soluciones/condominios
      4. Visit /blog/first-post
      5. Visit /cobertura/santiago
    Expected Result: All pages render
    Evidence: .sisyphus/evidence/task-32-frontend.{ext}
  ```

- [x] 33. Implement LocalBusinessSchema.astro

  **What to do**:
  - Create web/src/components/LocalBusinessSchema.astro
  - Include LocalBusiness JSON-LD
  - Fetch from site_config (address, phone, hours)

  **Must NOT do**:
  - Hardcode business data

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: None required

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 5 (with Tasks 34-38)
  - **Blocks**: Task 38
  - **Blocked By**: Task 32

  **Acceptance Criteria**:
  - [ ] LocalBusiness schema valid

  **QA Scenarios**:
  ```
  Scenario: LocalBusiness schema
    Tool: Playwright
    Preconditions: Web running
    Steps:
      1. Visit homepage
      2. Check page for application/ld+json
    Expected Result: Valid schema present
    Evidence: .sisyphus/evidence/task-33-localbusiness.{ext}
  ```

- [x] 34. Implement BreadcrumbSchema.astro

  **What to do**:
  - Create web/src/components/BreadcrumbSchema.astro
  - Generate breadcrumb JSON-LD from current path

  **Must NOT do**:
  - Hardcode breadcrumb paths

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: None required

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 5 (with Tasks 33, 35-38)
  - **Blocks**: Task 38
  - **Blocked By**: Task 32

  **Acceptance Criteria**:
  - [ ] Breadcrumb schema on all pages

  **QA Scenarios**:
  ```
  Scenario: Breadcrumb schema
    Tool: Playwright
    Preconditions: Web running
    Steps:
      1. Visit /servicios/guardia-seguridad
      2. Check for BreadcrumbList schema
    Expected Result: Valid breadcrumb present
    Evidence: .sisyphus/evidence/task-34-breadcrumb.{ext}
  ```

- [x] 35. Create cookie consent banner (Ley 21.719)

  **What to do**:
  - Create cookie consent component
  - Comply with Chilean law 21.719
  - Store consent in localStorage
  - Show only first visit

  **Must NOT do**:
  - Block content without consent

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: None required

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 5 (with Tasks 33-34, 36-38)
  - **Blocks**: Task 38
  - **Blocked By**: Task 32

  **Acceptance Criteria**:
  - [ ] Cookie banner appears
  - [ ] Complies with law

  **QA Scenarios**:
  ```
  Scenario: Cookie consent
    Tool: Playwright
    Preconditions: Clean browser
    Steps:
      1. Visit homepage
      2. Verify cookie banner shows
      3. Accept cookies
      4. Refresh - banner should not show
    Expected Result: Banner works correctly
    Evidence: .sisyphus/evidence/task-35-cookies.{ext}
  ```

- [ ] 36. Fix service_locations seed (312 pages)

  **What to do**:
  - Read convex/seed.ts
  - Fix logic to include all 52 communes (not filtering isOtherCity)
  - Generate 6 services × 52 communes = 312 pages

  **Must NOT do**:
  - Remove existing data

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: None required

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 5 (with Tasks 33-35, 37-38)
  - **Blocks**: Task 38
  - **Blocked By**: Task 32

  **References**:
  - convex/seed.ts - Current seed logic

  **Acceptance Criteria**:
  - [ ] 312 service_locations exist

  **QA Scenarios**:
  ```
  Scenario: Seed generates 312 pages
    Tool: Bash
    Preconditions: None
    Steps:
      1. Run: npx convex query service_locations:getAll
      2. Count results
    Expected Result: 312 locations
    Evidence: .sisyphus/evidence/task-36-seed.{ext}
  ```

- [x] 37. Add image sitemap

  **What to do**:
  - Create web/src/pages/sitemap-images.xml.ts
  - Include all images from services, solutions, blog posts

  **Must NOT do**:
  - Duplicate sitemap

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: None required

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 5 (with Tasks 33-36, 38)
  - **Blocks**: Task 38
  - **Blocked By**: Task 32

  **Acceptance Criteria**:
  - [ ] /sitemap-images.xml exists

  **QA Scenarios**:
  ```
  Scenario: Image sitemap
    Tool: Bash
    Preconditions: Web running
    Steps:
      1. Fetch: curl https://[deployment]/sitemap-images.xml
    Expected Result: XML with images
    Evidence: .sisyphus/evidence/task-37-imagesitemap.{ext}
  ```

- [x] 38. Final integration testing

  **What to do**:
  - Run full test suite
  - Verify all components work together
  - Check for regressions

  **Must NOT do**:
  - Skip testing

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: None required

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 5 (final)
  - **Blocks**: None
  - **Blocked By**: Tasks 33-37

  **Acceptance Criteria**:
  - [ ] All tests pass

  **QA Scenarios**:
  ```
  Scenario: Full integration
    Tool: Bash + Playwright
    Preconditions: All tasks complete
    Steps:
      1. npm run build
      2. npm run typecheck
      3. Run e2e tests
    Expected Result: Everything passes
    Evidence: .sisyphus/evidence/task-38-integration.{ext}
  ```

---

## Final Verification Wave

> 4 review agents run in PARALLEL. ALL must APPROVE.

- [ ] F1. **Plan Compliance Audit** — Read the plan end-to-end. Verify all Must Have are implemented, all Must NOT Have are absent.
- [ ] F2. **Code Quality Review** — Run tsc --noEmit + linter. Check for @ts-ignore, console.log, unused imports.
- [ ] F3. **Real Manual QA** — Execute EVERY QA scenario from EVERY task. Save to .sisyphus/evidence/final-qa/.
- [ ] F4. **Scope Fidelity Check** — For each task: verify everything in spec was built, nothing beyond spec was built.

---

## Commit Strategy

- **Wave 1**: `fix(data-provider): resolve leads arg mismatch, add missing queries, upgrade convex`
- **Wave 2**: `feat(schema): add redirects, seo_metadata, communes fields, type content_blocks`
- **Wave 3**: `feat(admin): install packages, create shared components, implement CRUD`
- **Wave 4**: `feat(frontend): create layouts, SEO component, detail pages, dynamic sitemap`
- **Wave 5**: `feat(seo): add JSON-LD schemas, cookie banner, fix seed, final testing`

---

## Success Criteria

### Verification Commands
```bash
npm run build  # Must exit 0
npm run typecheck  # Must pass
npm run dev:admin  # Admin loads data
npm run dev:web   # Pages render
```

### Final Checklist
- [ ] All "Must Have" present
- [ ] All "Must NOT Have" absent
- [ ] All builds pass
- [ ] All pages render
