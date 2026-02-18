# Plan: Restricción Geográfica a Región Metropolitana

## TL;DR

> **Quick Summary**: Restrict Guardman to operate exclusively in Región Metropolitana (52 communes). Restructure URLs from `/cobertura/[region]/[ciudad]` to `/cobertura/[comuna]`, create new "Área de Servicio" page with visual map, and update all "Cobertura Nacional" messaging to reflect RM-only focus.
>
> **Deliverables**:
>
> - 52 new commune pages (`/cobertura/[comuna]`)
> - 1 redesigned "Área de Servicio" hub page with zone map
> - Updated LeadForm with RM communes dropdown
> - All "Cobertura Nacional" references replaced
> - Old region pages deleted
>
> **Estimated Effort**: Medium
> **Parallel Execution**: YES - 5 waves
> **Critical Path**: Data Structure → Pages → Content → Forms → Verification

---

## Context

### Original Request

> "vamos a realizar un cambio fundamental en la app: guardman solo trabaja en la region metropolitana y todas sus comunas, no trabaja en todo chile ni en otras ciudades de chile ademas de santiago. esto debe ser totalmente relacionado y coherente con nuestra estrategia de seo, la estructura de las paginas y todo el proyecto."

### Interview Summary

**Key Discussions**:

- **Comunas**: Include all 52 communes of RM (official list)
- **URLs**: Simplify to `/cobertura/[comuna]` (flat structure)
- **Coverage page**: Convert to "Área de Servicio" with map + zones (norte, sur, oriente, poniente, centro)
- **Redirects**: NO - remove old URLs without redirects
- **Leads**: Keep non-RM cities as "Otras ciudades" section in dropdown
- **Testing**: Verify all 52 pages generate correctly with proper SEO

**Research Findings**:

- Current: 5 regions with ~23 cities → New: 1 region with 52 communes
- LeadForm.tsx has separate hardcoded `ciudadesChile` array (must sync with locations.ts)
- LocalBusinessSchema uses old URL pattern `/cobertura/${regionSlug}/${citySlug}`
- FAQ explicitly mentions "Metropolitana, Valparaíso, Antofagasta, Biobío y Araucanía"

### Metis Review

**Identified Gaps** (addressed):

- **Zone mapping**: Use official RM zone classification (norte, sur, oriente, poniente, centro)
- **Slug convention**: Continue existing pattern (ñ → n, accents stripped)
- **LeadForm sync**: Remove hardcoded array, import from locations.ts
- **Sitemap**: Will auto-update on rebuild (Astro sitemap plugin)

---

## Work Objectives

### Core Objective

Transform Guardman from nationwide coverage (5 regions) to RM-exclusive (52 communes), with improved SEO structure and coherent local focus.

### Concrete Deliverables

- `src/data/locations.ts` - Completely rewritten with 52 RM communes + zones
- `src/pages/cobertura/index.astro` - Redesigned "Área de Servicio" hub
- `src/pages/cobertura/[comuna].astro` - New dynamic commune page (52 pages)
- `src/components/forms/LeadForm.tsx` - Updated dropdown with RM communes
- `src/data/site.ts` - Updated site description
- `src/pages/index.astro` - Updated homepage pillar
- `src/data/faqs.ts` - Updated FAQ answers
- `src/utils/seo.ts` - Updated title/description generators
- `src/components/seo/LocalBusinessSchema.astro` - Updated URL pattern
- Deleted: `src/pages/cobertura/[region]/` directory

### Definition of Done

- [ ] All 52 commune pages accessible at `/cobertura/[comuna-slug]`
- [ ] No references to Valparaíso, Antofagasta, Biobío, Araucanía in content
- [ ] "Cobertura Nacional" text replaced throughout
- [ ] LeadForm dropdown shows 52 RM communes + "Otras ciudades"
- [ ] Build completes successfully with 52 static pages
- [ ] Sitemap contains only `/cobertura/[comuna]` URLs (no old region paths)
- [ ] Visual map with zones renders on coverage page

### Must Have

- 52 commune pages with proper SEO (title, description, LocalBusinessSchema)
- Single source of truth for communes in `locations.ts`
- Zone-based organization on coverage page
- LeadForm synced with locations data

### Must NOT Have (Guardrails)

- NO redirects for old URLs (explicitly declined)
- NO lead editing functionality in admin (scope creep)
- NO zone-based filtering/search on coverage page (scope creep)
- NO external mapping libraries (use simple SVG)
- NO changes to Convex schema

---

## Verification Strategy (MANDATORY)

### Test Decision

- **Infrastructure exists**: NO (Astro static site)
- **Automated tests**: None (TDD not applicable for static content)
- **Verification**: Build-time + manual QA scenarios

### QA Policy

Every task MUST include agent-executed QA scenarios.
Evidence saved to `.sisyphus/evidence/task-{N}-{scenario-slug}.{ext}`.

| Deliverable Type | Verification Tool    | Method                        |
| ---------------- | -------------------- | ----------------------------- |
| Static Pages     | Bash (npm run build) | Build success + page count    |
| Page Content     | Playwright           | Navigate, assert DOM elements |
| SEO/Schema       | Bash (curl + grep)   | Fetch page, verify meta tags  |
| Internal Links   | Bash (grep)          | Search for broken patterns    |

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Foundation - Data + Types):
├── Task 1: Create new locations.ts data structure with 52 RM communes [quick]
├── Task 2: Update TypeScript interfaces for new commune structure [quick]
└── Task 3: Create communes data file with zone assignments [quick]

Wave 2 (Page Structure):
├── Task 4: Create new [comuna].astro page template [unspecified-high]
├── Task 5: Redesign cobertura/index.astro as "Área de Servicio" [visual-engineering]
├── Task 6: Delete old [region]/ directory and files [quick]
└── Task 7: Update LocalBusinessSchema for new URL pattern [quick]

Wave 3 (Content Updates):
├── Task 8: Update site.ts description [quick]
├── Task 9: Update index.astro "Cobertura Nacional" pillar [quick]
├── Task 10: Update faqs.ts references [quick]
├── Task 11: Update seo.ts generators [quick]
└── Task 12: Search and replace "Cobertura Nacional" in all files [quick]

Wave 4 (Forms + Integration):
├── Task 13: Update LeadForm.tsx dropdown with RM communes [quick]
├── Task 14: Update ContactForm.tsx if it has city field [quick]
└── Task 15: Verify ConvexLeadForm and ConvexContactForm sync [quick]

Wave 5 (Verification):
├── Task 16: Build verification - 52 pages generated [quick]
├── Task 17: Sitemap verification [quick]
├── Task 18: Internal links audit [quick]
├── Task 19: SEO meta verification [quick]
└── Task 20: Manual Playwright QA - key pages [unspecified-high]

Wave FINAL (Parallel Review - 4 agents):
├── Task F1: Plan compliance audit [oracle]
├── Task F2: Code quality review [unspecified-high]
├── Task F3: Real manual QA [unspecified-high]
└── Task F4: Scope fidelity check [deep]
```

### Dependency Matrix

| Task  | Depends On | Blocks      | Wave |
| ----- | ---------- | ----------- | ---- |
| 1     | -          | 2, 4, 5, 13 | 1    |
| 2     | 1          | 4           | 1    |
| 3     | 1          | 5, 13       | 1    |
| 4     | 1, 2       | 16, 20      | 2    |
| 5     | 3          | 20          | 2    |
| 6     | 4          | 16, 17      | 2    |
| 7     | 1          | 16          | 2    |
| 8-12  | -          | -           | 3    |
| 13    | 1          | 15          | 4    |
| 14    | -          | 15          | 4    |
| 15    | 13, 14     | -           | 4    |
| 16-20 | 4, 5, 6, 7 | F1-F4       | 5    |

### Agent Dispatch Summary

| Wave  | # Parallel | Tasks → Agent Category                                              |
| ----- | ---------- | ------------------------------------------------------------------- |
| 1     | **3**      | T1-T3 → `quick`                                                     |
| 2     | **4**      | T4 → `unspecified-high`, T5 → `visual-engineering`, T6-T7 → `quick` |
| 3     | **5**      | T8-T12 → `quick`                                                    |
| 4     | **3**      | T13-T15 → `quick`                                                   |
| 5     | **5**      | T16-T19 → `quick`, T20 → `unspecified-high`                         |
| FINAL | **4**      | F1 → `oracle`, F2-F4 → `unspecified-high`, `deep`                   |

---

## TODOs

- [ ] 1. **Create New RM Communes Data Structure**

  **What to do**:
  - Replace entire `regions` array in `src/data/locations.ts` with new `communes` structure
  - Include all 52 official RM communes with slug, zone assignment
  - Export helper functions: `getCommuneBySlug()`, `getCommunesByZone()`, `getAllCommunes()`
  - Zones: norte, sur, oriente, poniente, centro (use official classification)

  **Must NOT do**:
  - Don't keep old `regions` array structure
  - Don't add extra fields not needed
  - Don't create separate files - keep it in one locations.ts

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: None required

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 2, 3)
  - **Parallel Group**: Wave 1
  - **Blocks**: Tasks 2, 4, 5, 13
  - **Blocked By**: None

  **References**:
  - `src/data/locations.ts:1-116` - Current structure to replace
  - Official RM commune list (external research needed)

  **Acceptance Criteria**:
  - [ ] File contains `communes` array with 52 objects
  - [ ] Each commune has: name, slug, zone
  - [ ] Helper functions exported and typed
  - [ ] No references to old `regions` array

  **QA Scenarios**:

  ```
  Scenario: Data structure is valid
    Tool: Bash
    Steps:
      1. cat src/data/locations.ts | grep -c "name:"
      2. Assert count >= 52 (commune entries)
    Expected Result: 52+ commune objects exist
    Evidence: .sisyphus/evidence/task-01-data-structure.txt
  ```

  **Commit**: YES
  - Message: `feat(data): replace regions with 52 RM communes`
  - Files: `src/data/locations.ts`

---

- [ ] 2. **Update TypeScript Interfaces**

  **What to do**:
  - Replace `Region` and `City` interfaces with new `Commune` interface
  - Update interface to include zone field
  - Update all function return types

  **Must NOT do**:
  - Don't keep old interfaces as unused code

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: None required

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 1, 3)
  - **Parallel Group**: Wave 1
  - **Blocks**: Task 4
  - **Blocked By**: Task 1 (needs to know final structure)

  **References**:
  - `src/data/locations.ts:1-12` - Current interfaces to replace

  **Acceptance Criteria**:
  - [ ] `Commune` interface defined with name, slug, zone
  - [ ] Old `Region` and `City` interfaces removed
  - [ ] TypeScript compiles without errors

  **QA Scenarios**:

  ```
  Scenario: TypeScript compiles
    Tool: Bash
    Steps:
      1. npx tsc --noEmit
    Expected Result: Exit code 0
    Evidence: .sisyphus/evidence/task-02-typescript.txt
  ```

  **Commit**: NO (groups with Task 1)

---

- [ ] 3. **Create Zone Assignment Data**

  **What to do**:
  - Define which communes belong to each zone (norte, sur, oriente, poniente, centro)
  - Use official geographic classification
  - Zones:
    - **Norte**: Colina, Tiltil, Lampa, etc.
    - **Sur**: San Bernardo, Puente Alto, Pirque, etc.
    - **Oriente**: Las Condes, Vitacura, Lo Barnechea, etc.
    - **Poniente**: Maipú, Pudahuel, Cerro Navia, etc.
    - **Centro**: Santiago, Providencia, Ñuñoa, etc.

  **Must NOT do**:
  - Don't create arbitrary zone assignments
  - Don't add more than 5 zones

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: None required (external research)

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 1, 2)
  - **Parallel Group**: Wave 1
  - **Blocks**: Task 5 (needs zone data for map)
  - **Blocked By**: Task 1

  **References**:
  - Official RM geographic zone classification

  **Acceptance Criteria**:
  - [ ] All 52 communes assigned to exactly one zone
  - [ ] No duplicate assignments
  - [ ] Zone names match: norte, sur, oriente, poniente, centro

  **Commit**: NO (groups with Task 1)

---

- [ ] 4. **Create New [comuna].astro Page Template**

  **What to do**:
  - Create new file at `src/pages/cobertura/[comuna].astro`
  - Use similar structure to current `[ciudad].astro` but simplified
  - Update getStaticPaths() to use new `communes` array
  - Update breadcrumbs (no region level)
  - Update SEO titles and descriptions
  - Remove "Otras Regiones" section entirely
  - Keep "Zona de Cobertura" section but show other communes in same zone

  **Must NOT do**:
  - Don't include references to other regions
  - Don't add new features not in original

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: None required

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 5, 6, 7)
  - **Parallel Group**: Wave 2
  - **Blocks**: Tasks 16, 20
  - **Blocked By**: Tasks 1, 2

  **References**:
  - `src/pages/cobertura/[region]/[ciudad].astro:1-376` - Template to base new page on
  - `src/utils/seo.ts` - SEO helper functions

  **Acceptance Criteria**:
  - [ ] Page generates 52 static routes
  - [ ] Each page has proper title: "Seguridad Privada en [Comuna] | Guardman"
  - [ ] LocalBusinessSchema included
  - [ ] Breadcrumb: Inicio > Cobertura > [Comuna]
  - [ ] No "Otras Regiones" section

  **QA Scenarios**:

  ```
  Scenario: Page renders correctly
    Tool: Bash
    Steps:
      1. npm run build 2>&1 | grep "cobertura"
      2. ls dist/client/cobertura/ | wc -l
    Expected Result: 52 directories/files
    Evidence: .sisyphus/evidence/task-04-pages.txt

  Scenario: Sample page has correct content
    Tool: Playwright
    Steps:
      1. Navigate to http://localhost:4321/cobertura/las-condes
      2. Assert <h1> contains "Seguridad en Las Condes"
      3. Assert breadcrumb shows: Inicio > Cobertura > Las Condes
    Expected Result: Page renders with correct content
    Evidence: .sisyphus/evidence/task-04-las-condes.png
  ```

  **Commit**: YES
  - Message: `feat(pages): add [comuna] dynamic page for 52 RM communes`
  - Files: `src/pages/cobertura/[comuna].astro`

---

- [ ] 5. **Redesign Cobertura Index as "Área de Servicio"**

  **What to do**:
  - Redesign `src/pages/cobertura/index.astro` as "Área de Servicio" hub page
  - Create visual SVG map of RM with zone markers
  - Show communes grouped by zone (norte, sur, oriente, poniente, centro)
  - Update stats: "52 Comunas" instead of "5 Regiones"
  - Remove Chile map entirely
  - Remove "Presencia en Todo Chile" text
  - Change title to "Área de Servicio | Región Metropolitana"

  **Must NOT do**:
  - Don't use external mapping library (Google Maps, Mapbox)
  - Don't add zone filtering/search functionality

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: `frontend-ui-ux`
  - `frontend-ui-ux`: Visual design for map and zone organization

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 4, 6, 7)
  - **Parallel Group**: Wave 2
  - **Blocks**: Task 20
  - **Blocked By**: Task 3 (needs zone data)

  **References**:
  - `src/pages/cobertura/index.astro:1-310` - Current page to redesign
  - Zone data from Task 3

  **Acceptance Criteria**:
  - [ ] Page title: "Área de Servicio | Región Metropolitana"
  - [ ] Visual map shows RM outline with zone markers
  - [ ] Communes listed by zone (5 sections)
  - [ ] Stats updated: "1 Región", "52 Comunas"
  - [ ] No references to other regions or "nacional"

  **QA Scenarios**:

  ```
  Scenario: Coverage page shows RM only
    Tool: Playwright
    Steps:
      1. Navigate to http://localhost:4321/cobertura/
      2. Assert page title contains "Área de Servicio"
      3. Assert no text "Chile" or "nacional" in visible content
      4. Assert 5 zone sections visible
    Expected Result: Page shows RM-only content
    Evidence: .sisyphus/evidence/task-05-area-servicio.png
  ```

  **Commit**: YES
  - Message: `feat(pages): redesign coverage as Área de Servicio with zones`
  - Files: `src/pages/cobertura/index.astro`

---

- [ ] 6. **Delete Old Region Pages**

  **What to do**:
  - Delete entire `src/pages/cobertura/[region]/` directory
  - This removes both `[region]/index.astro` and `[region]/[ciudad].astro`

  **Must NOT do**:
  - Don't create redirects
  - Don't keep any files from this directory

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: None required

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 4, 5, 7)
  - **Parallel Group**: Wave 2
  - **Blocks**: Tasks 16, 17 (build verification)
  - **Blocked By**: Task 4 (new page must exist first)

  **References**:
  - `src/pages/cobertura/[region]/` - Directory to delete

  **Acceptance Criteria**:
  - [ ] Directory and all contents deleted
  - [ ] No build errors after deletion
  - [ ] No imports from deleted files

  **Commit**: YES
  - Message: `refactor(pages): remove old region-based coverage pages`
  - Files: `src/pages/cobertura/[region]/` (deleted)

---

- [ ] 7. **Update LocalBusinessSchema URL Pattern**

  **What to do**:
  - Update `src/components/seo/LocalBusinessSchema.astro` line 31
  - Change from `/cobertura/${regionSlug}/${citySlug}` to `/cobertura/${comunaSlug}`
  - Update Props interface to accept commune instead of region+city

  **Must NOT do**:
  - Don't add new fields to schema

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: None required

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 4, 5, 6)
  - **Parallel Group**: Wave 2
  - **Blocks**: Task 16
  - **Blocked By**: None

  **References**:
  - `src/components/seo/LocalBusinessSchema.astro:31` - URL pattern to update

  **Acceptance Criteria**:
  - [ ] URL pattern uses `/cobertura/${comunaSlug}`
  - [ ] Props simplified to just `comuna` and `comunaSlug`
  - [ ] Schema validates correctly

  **Commit**: YES
  - Message: `fix(seo): update LocalBusinessSchema URL pattern for flat structure`
  - Files: `src/components/seo/LocalBusinessSchema.astro`

---

- [ ] 8. **Update site.ts Description**

  **What to do**:
  - Update `src/data/site.ts` line 49
  - Change "Cobertura nacional" to "Cobertura en toda la Región Metropolitana"
  - Update any other "Chile" references in site config

  **Must NOT do**:
  - Don't change phone, email, address fields

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: None required

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 9-12)
  - **Parallel Group**: Wave 3
  - **Blocks**: None
  - **Blocked By**: None

  **References**:
  - `src/data/site.ts:49` - Description to update

  **Commit**: YES
  - Message: `chore(config): update site description to RM focus`
  - Files: `src/data/site.ts`

---

- [ ] 9. **Update Homepage "Cobertura Nacional" Pillar**

  **What to do**:
  - Update `src/pages/index.astro` lines 40-44
  - Change pillar from "Cobertura Nacional" to "Cobertura RM"
  - Update description to reflect RM-only focus

  **Must NOT do**:
  - Don't add new pillars or sections

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: None required

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 8, 10-12)
  - **Parallel Group**: Wave 3
  - **Blocks**: None
  - **Blocked By**: None

  **References**:
  - `src/pages/index.astro:40-44` - Pillar to update

  **Commit**: YES
  - Message: `feat(homepage): update coverage pillar to RM focus`
  - Files: `src/pages/index.astro`

---

- [ ] 10. **Update FAQs with Region References**

  **What to do**:
  - Search `src/data/faqs.ts` for region references
  - Line 33 mentions "Metropolitana, Valparaíso, Antofagasta, Biobío y Araucanía"
  - Update to only mention RM or remove region-specific content

  **Must NOT do**:
  - Don't add new FAQs

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: None required

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 8-9, 11-12)
  - **Parallel Group**: Wave 3
  - **Blocks**: None
  - **Blocked By**: None

  **References**:
  - `src/data/faqs.ts:33` - Region list to update

  **Commit**: YES
  - Message: `chore(faqs): remove non-RM region references`
  - Files: `src/data/faqs.ts`

---

- [ ] 11. **Update SEO Utilities**

  **What to do**:
  - Update `src/utils/seo.ts`
  - Update `generateCityTitle()` to `generateCommuneTitle()`
  - Update `generateCityDescription()` to `generateCommuneDescription()`
  - Remove region parameter from functions

  **Must NOT do**:
  - Don't add new SEO functions

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: None required

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 8-10, 12)
  - **Parallel Group**: Wave 3
  - **Blocks**: Task 4 (if not updated first)
  - **Blocked By**: None

  **References**:
  - `src/utils/seo.ts:11-20` - Functions to update

  **Commit**: YES
  - Message: `refactor(seo): update utilities for commune-based SEO`
  - Files: `src/utils/seo.ts`

---

- [ ] 12. **Search and Replace "Cobertura Nacional"**

  **What to do**:
  - Search entire `src/` directory for "Cobertura Nacional" or "cobertura nacional"
  - Replace with "Región Metropolitana" or "Área Metropolitana" as appropriate
  - Search for specific region names: "Valparaíso", "Antofagasta", "Biobío", "Araucanía"
  - Remove or update any remaining references

  **Must NOT do**:
  - Don't change content in blog posts (keep historical accuracy)
  - Don't modify node_modules

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: None required

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 8-11)
  - **Parallel Group**: Wave 3
  - **Blocks**: None
  - **Blocked By**: None

  **References**:
  - Use `grep -r "Cobertura Nacional" src/` to find all instances

  **Commit**: YES
  - Message: `chore(content): replace national coverage with RM focus`
  - Files: Multiple

---

- [ ] 13. **Update LeadForm Dropdown**

  **What to do**:
  - Update `src/components/forms/LeadForm.tsx`
  - Remove hardcoded `ciudadesChile` array (lines 34-57)
  - Import communes from `src/data/locations.ts`
  - Show 52 RM communes in alphabetical order
  - Add "Otras ciudades (fuera de RM)" as last option with sub-list

  **Must NOT do**:
  - Don't remove the ciudad field entirely
  - Don't add validation for RM-only submissions

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: None required

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 14, 15)
  - **Parallel Group**: Wave 4
  - **Blocks**: Task 15
  - **Blocked By**: Task 1 (needs communes data)

  **References**:
  - `src/components/forms/LeadForm.tsx:34-57` - Hardcoded array to replace
  - `src/data/locations.ts` - Source of truth for communes

  **Acceptance Criteria**:
  - [ ] Dropdown shows 52 RM communes alphabetically
  - [ ] "Otras ciudades" section at bottom with major non-RM cities
  - [ ] No hardcoded city array in component
  - [ ] Imports from locations.ts

  **Commit**: YES
  - Message: `feat(forms): update LeadForm dropdown with RM communes`
  - Files: `src/components/forms/LeadForm.tsx`

---

- [ ] 14. **Update ContactForm if Applicable**

  **What to do**:
  - Check `src/components/forms/ContactForm.tsx` for city field
  - Update if exists using same pattern as LeadForm
  - If no city field, mark as complete

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: None required

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 13, 15)
  - **Parallel Group**: Wave 4
  - **Blocks**: Task 15
  - **Blocked By**: None

  **Commit**: YES (if changes needed)

---

- [ ] 15. **Verify Convex Forms Sync**

  **What to do**:
  - Check `ConvexLeadForm.tsx` and `ConvexContactForm.tsx`
  - Ensure they use same city data as LeadForm
  - Verify no hardcoded city arrays

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: None required

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 13, 14)
  - **Parallel Group**: Wave 4
  - **Blocks**: None
  - **Blocked By**: Tasks 13, 14

  **Commit**: YES (if changes needed)

---

- [ ] 16. **Build Verification - 52 Pages Generated**

  **What to do**:
  - Run `npm run build`
  - Verify build completes successfully
  - Count generated pages in `/cobertura/`

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: None required

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 17-20)
  - **Parallel Group**: Wave 5
  - **Blocks**: F1-F4
  - **Blocked By**: Tasks 4, 5, 6, 7

  **QA Scenarios**:

  ```
  Scenario: Build succeeds with 52 commune pages
    Tool: Bash
    Steps:
      1. npm run build
      2. ls dist/client/cobertura/*.html 2>/dev/null | wc -l || echo "0"
    Expected Result: Build exit code 0, 52 HTML files
    Evidence: .sisyphus/evidence/task-16-build.txt
  ```

---

- [ ] 17. **Sitemap Verification**

  **What to do**:
  - Check generated sitemap contains only RM commune URLs
  - Verify no old region-based URLs remain
  - Verify sitemap count matches 52

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: None required

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 16, 18-20)
  - **Parallel Group**: Wave 5
  - **Blocks**: None
  - **Blocked By**: Task 6 (old pages deleted)

  **QA Scenarios**:

  ```
  Scenario: Sitemap contains only commune URLs
    Tool: Bash
    Steps:
      1. cat dist/client/sitemap-0.xml | grep -c "/cobertura/"
      2. cat dist/client/sitemap-0.xml | grep "/cobertura/valparaiso" || echo "OK"
    Expected Result: Count = 52, no old region paths
    Evidence: .sisyphus/evidence/task-17-sitemap.txt
  ```

---

- [ ] 18. **Internal Links Audit**

  **What to do**:
  - Search for broken internal links pointing to old URLs
  - Check for any `/cobertura/[region]/` patterns
  - Update any remaining links to new structure

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: None required

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 16-17, 19-20)
  - **Parallel Group**: Wave 5
  - **Blocks**: None
  - **Blocked By**: None

  **QA Scenarios**:

  ```
  Scenario: No broken internal links
    Tool: Bash
    Steps:
      1. grep -r "/cobertura/valparaiso" src/ || echo "OK"
      2. grep -r "/cobertura/antofagasta" src/ || echo "OK"
      3. grep -r "/cobertura/biobio" src/ || echo "OK"
    Expected Result: All return "OK" (no matches)
    Evidence: .sisyphus/evidence/task-18-links.txt
  ```

---

- [ ] 19. **SEO Meta Verification**

  **What to do**:
  - Sample check of 3-5 commune pages
  - Verify title format: "Seguridad Privada en [Comuna] | Guardman"
  - Verify description contains commune name
  - Verify LocalBusinessSchema present

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: None required

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 16-18, 20)
  - **Parallel Group**: Wave 5
  - **Blocks**: None
  - **Blocked By**: Task 4

  **QA Scenarios**:

  ```
  Scenario: Sample pages have correct SEO
    Tool: Bash (curl + grep)
    Steps:
      1. curl -s http://localhost:4321/cobertura/las-condes | grep -o "<title>.*</title>"
      2. curl -s http://localhost:4321/cobertura/providencia | grep "Seguridad en Providencia"
    Expected Result: Correct titles and descriptions
    Evidence: .sisyphus/evidence/task-19-seo.txt
  ```

---

- [ ] 20. **Manual Playwright QA - Key Pages**

  **What to do**:
  - Use Playwright to visually verify key pages
  - Test homepage, coverage page, 3 sample commune pages
  - Take screenshots as evidence
  - Verify mobile responsiveness

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: `playwright`
  - `playwright`: Browser automation for visual QA

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 16-19)
  - **Parallel Group**: Wave 5
  - **Blocks**: F3
  - **Blocked By**: Tasks 4, 5

  **QA Scenarios**:

  ```
  Scenario: Homepage loads correctly
    Tool: Playwright
    Steps:
      1. Navigate to http://localhost:4321/
      2. Assert no "Cobertura Nacional" text
      3. Screenshot
    Evidence: .sisyphus/evidence/task-20-homepage.png

  Scenario: Coverage page shows zones
    Tool: Playwright
    Steps:
      1. Navigate to http://localhost:4321/cobertura/
      2. Assert "Área de Servicio" in h1
      3. Assert 5 zone sections visible
      4. Screenshot
    Evidence: .sisyphus/evidence/task-20-coverage.png

  Scenario: Commune page renders
    Tool: Playwright
    Steps:
      1. Navigate to http://localhost:4321/cobertura/las-condes
      2. Assert "Seguridad en Las Condes" in h1
      3. Screenshot
    Evidence: .sisyphus/evidence/task-20-las-condes.png
  ```

---

## Final Verification Wave (MANDATORY)

- [ ] F1. **Plan Compliance Audit** — `oracle`
      Read the plan end-to-end. For each "Must Have": verify implementation exists. For each "Must NOT Have": search codebase for forbidden patterns. Check evidence files exist in .sisyphus/evidence/.
      Output: `Must Have [N/N] | Must NOT Have [N/N] | Tasks [N/N] | VERDICT: APPROVE/REJECT`

- [ ] F2. **Code Quality Review** — `unspecified-high`
      Run `npx tsc --noEmit` + `npm run lint`. Review all changed files for: `as any`/`@ts-ignore`, unused imports. Check for remaining references to old regions.
      Output: `Build [PASS/FAIL] | Lint [PASS/FAIL] | Files [N clean/N issues] | VERDICT`

- [ ] F3. **Real Manual QA** — `unspecified-high` (+ `playwright` skill)
      Start dev server. Navigate through: Homepage → Coverage page → Sample commune page. Test LeadForm dropdown shows correct options. Verify no broken links. Take screenshots.
      Output: `Pages [N/N working] | Form [PASS/FAIL] | Links [N/N valid] | VERDICT`

- [ ] F4. **Scope Fidelity Check** — `deep`
      For each task: read "What to do", read actual changes. Verify nothing beyond scope was built. Check no new features added (lead editing, zone filtering, etc.).
      Output: `Tasks [N/N compliant] | Scope Creep [CLEAN/N items] | VERDICT`

---

## Commit Strategy

| After Task | Message                                                         | Files                                          |
| ---------- | --------------------------------------------------------------- | ---------------------------------------------- |
| 1, 2, 3    | `feat(data): replace regions with 52 RM communes`               | `src/data/locations.ts`                        |
| 4          | `feat(pages): add [comuna] dynamic page for 52 RM communes`     | `src/pages/cobertura/[comuna].astro`           |
| 5          | `feat(pages): redesign coverage as Área de Servicio with zones` | `src/pages/cobertura/index.astro`              |
| 6          | `refactor(pages): remove old region-based coverage pages`       | `src/pages/cobertura/[region]/`                |
| 7          | `fix(seo): update LocalBusinessSchema URL pattern`              | `src/components/seo/LocalBusinessSchema.astro` |
| 8          | `chore(config): update site description to RM focus`            | `src/data/site.ts`                             |
| 9          | `feat(homepage): update coverage pillar to RM focus`            | `src/pages/index.astro`                        |
| 10         | `chore(faqs): remove non-RM region references`                  | `src/data/faqs.ts`                             |
| 11         | `refactor(seo): update utilities for commune-based SEO`         | `src/utils/seo.ts`                             |
| 12         | `chore(content): replace national coverage with RM focus`       | Multiple                                       |
| 13         | `feat(forms): update LeadForm dropdown with RM communes`        | `src/components/forms/LeadForm.tsx`            |

---

## Success Criteria

### Verification Commands

```bash
# Build succeeds
npm run build
# Expected: Exit code 0

# Page count
ls dist/client/cobertura/*.html | wc -l
# Expected: 52

# No old region references
grep -r "Valparaíso\|Antofagasta\|Biobío\|Araucanía" src/
# Expected: No matches (except blog/comments)

# TypeScript compiles
npx tsc --noEmit
# Expected: Exit code 0
```

### Final Checklist

- [ ] All 52 commune pages accessible
- [ ] Coverage page shows "Área de Servicio" with zones
- [ ] No "Cobertura Nacional" text remains
- [ ] No old region page references
- [ ] LeadForm dropdown shows RM communes
- [ ] Build completes successfully
- [ ] Sitemap contains 52 commune URLs only
