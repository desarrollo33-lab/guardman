# Learnings - rm-restriction

## [2026-02-17] Task 1-3: locations.ts Rewrite

### Zone Classification

- Used 5 zones: norte, sur, oriente, poniente, centro
- Distribution: centro (9), norte (7), sur (16), oriente (6), poniente (14) = 52 total

### Slug Convention

- Lowercase
- Spaces → hyphens
- ñ → n (e.g., Ñuñoa → nunoa)
- Accents stripped (e.g., Peñalolén → penalolen)

### Official RM Communes

All 52 communes included with proper zone assignments based on geographic location.

### Files That Import locations.ts (Need Update in Wave 2)

1. `src/pages/cobertura/index.astro`
2. `src/pages/cobertura/[region]/[ciudad].astro`
3. `src/pages/cobertura/[region]/index.astro`

These files import old `regions` array and need updating to use new `communes` structure.

## [2026-02-17] Task 4: [comuna].astro Template Created

### New File Structure

- Created `src/pages/cobertura/[comuna].astro`
- Uses simplified 3-level breadcrumb: Inicio > Cobertura > [Comuna]
- Removed "Otras Regiones" section entirely (RM-only now)
- Coverage section shows communes in same zone (using `getCommunesByZone()`)

### SEO Implementation

- Title format: "Seguridad Privada en [Comuna] | Guardman" (inline, not using utils/seo)
- LocalBusinessSchema uses `city` prop for commune name, `region` as "Región Metropolitana"
- BreadcrumbSchema with 3 levels

### Key Design Decisions

1. Zone display names translated to Spanish: norte→"Zona Norte", orient→"Zona Oriente", etc.
2. `getCommuneBySlug()` imported but not used directly (getStaticPaths maps directly from `communes` array)
3. Kept all visual sections: Hero, Intro, Services Grid, Benefits, Coverage Area, CTA

### LocalBusinessSchema Props

- Passed `city={commune.name}` and `region="Región Metropolitana"`
- Passed `citySlug={commune.slug}` for URL generation
- Component generates URL as `/cobertura/${regionSlug}/${citySlug}` which may need updating to `/cobertura/${citySlug}` in future task

## [2026-02-17] Task 5: Área de Servicio Page Redesign

### Design Approach
- Sophisticated editorial design with dark hero section
- Custom SVG map of RM with 5 zone markers and glow effects
- Emerald/teal gradient accents for brand cohesion
- Grid pattern background with gradient overlays

### Zone Configuration
- Norte: Blue (#3B82F6)
- Centro: Dark gray (#374151)
- Oriente: Amber (#F59E0B)
- Poniente: Purple (#8B5CF6)
- Sur: Emerald (#10B981)

### Key Features
1. Hero with "Cobertura Exclusiva RM" badge
2. Interactive SVG map with zone markers and commune count badges
3. Compass indicator on map
4. Zone legend with color coding
5. Communes listed by zone in 5 sections
6. CTA section with trust indicators

### Imports Used
- `communes`, `getCommunesByZone`, `Zone` type from `@/data/locations`
- All existing UI components preserved

### Build Status
- TypeScript check passes
- Build fails due to Task 6 incomplete (old [region]/ pages still importing `regions`)
- Build will pass once Task 6 deletes old region pages
