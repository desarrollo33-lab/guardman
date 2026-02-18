# Learnings - Servicios Detalle Redesign

## Wave 1: Stitch Designs Generated

### Task 1: Analysis of Existing Screens

- **Service Card Default** (187cb2e3): Monochromatic card with icon, title, description, hover state
- **Benefits Section v2** (bcba5b3f): 2-column layout, premium feel

### Task 2: FeaturesSection

- **v1** (89fe4b9c): 3-column grid, 1.5px bullet dots, uppercase tracking-widest text-xs
- **v2** (3e6e38f0): Similar with different header treatment

### Task 3: ChallengesSection

- **v1** (bfc35654): 3-column grid cards, w-10 h-10 icon container bg-gray-50, border transition hover
- **v2** (5350368a): Light mode variant with rounded-xl corners

### Task 4: SolutionsListSection

- **v1** (afd417e3): 3-column cards with "ESTRATEGIA" badge (bg-gray-900, text-white)
- **v2** (a4fffd5e): Centered header, shadow-xl on hover
- **v3** (ce9736a0): High-contrast variant

### Task 5: RelatedServicesSection

- **v1** (ca19785c): 3-column service cards, shield-check icon, arrow CTA
- **v2** (59e42e8e): Refined variation with better typography

### Task 6: CTASection

- DECISION: Use existing CTASection.astro component (already has dark background, headline with accent, buttons)

## Design Patterns from Stitch

- Border color: `border-gray-100`, hover to `border-black`
- Icon containers: `w-10 h-10 rounded-lg bg-gray-50`
- Text styles: `text-xs uppercase tracking-widest font-bold text-gray-400`
- Transitions: `transition-all duration-300`
- Cards: `rounded-xl`, subtle borders

## Wave 2: Component Implementation

### SolutionsListSection.astro

- Props: title?, subtitle?, solutions: string[], columns?: 2|3, background?: 'white'|'gray'
- Default title: 'Nuestra Respuesta'
- Badge style: bg-gray-900 text-white text-[10px] uppercase tracking-widest font-bold
- Card hover: hover:shadow-xl transition-shadow
- Uses Section.astro and Container.astro wrappers

## Wave 2: Component Implementation

### ChallengesSection.astro

- Location: `src/components/sections/ChallengesSection.astro`
- Props: `title`, `subtitle`, `challenges: string[]`, `columns: 2 | 3`, `background`, `class`
- Default title: "Desafíos operacionales"
- Card structure: group + hover border-black transition
- Icon container: w-10 h-10 rounded-lg bg-gray-50 with group-hover:bg-black
- Dependencies: Icon.astro, Section.astro, Container.astro

### RelatedServicesSection.astro

- Location: `src/components/sections/RelatedServicesSection.astro`
- Props: `title?`, `services: RelatedService[]`, `columns?: 2 | 3`, `background?: 'white' | 'gray'`, `class?`
- RelatedService type: `{ title: string, description?: string, slug: string }`
- Default title: "Servicios Relacionados"
- Card pattern: `<a>` link with `group` class, `p-8 rounded-xl border border-gray-100 hover:border-black`
- Icon container: `w-10 h-10 rounded-lg bg-gray-50`, `group-hover:bg-black group-hover:text-white`
- Title style: `text-xs font-bold text-gray-400 uppercase tracking-widest`, `group-hover:text-black`
- CTA: "Ver servicio" with arrow-right icon
- Dependencies: Icon.astro, Section.astro, Container.astro

### FeaturesSection.astro

- Location: `src/components/sections/FeaturesSection.astro`
- Props: `features: string[]` (required), `title?`, `subtitle?`, `columns?: 2|3`, `background?: 'white'|'gray'`
- Grid: `grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-100 border border-gray-100 rounded-xl overflow-hidden`
- Cell: `flex items-start gap-4 p-8 bg-white hover:bg-gray-50 transition-colors group`
- Bullet dot: `w-1.5 h-1.5 rounded-full bg-black mt-1.5 shrink-0`
- Text: `text-xs font-bold text-gray-400 uppercase tracking-widest leading-relaxed group-hover:text-black transition-colors`
- Dependencies: Section.astro, Container.astro

## [slug].astro Refactor

### Component Replacements Made

1. **FeaturesSection** - Direct replacement, accepts `features: string[]`
2. **BenefitsSection** - Required adapter from `string[]` to `{icon?: string, title: string, description: string}[]`
   - Adapter pattern: `benefits={(safeService.benefits || []).map(benefit => ({ icon: 'check', title: benefit, description: '' }))}`
3. **CTASection** - Uses `headlineAccent` prop to apply italic styling to the last word of service title
   - `headlineAccent={safeService.title.split(' ').slice(-1)[0]}`

### Unused Imports to Clean Up

After refactor, these imports are now unused in [slug].astro:

- `Container` (now used in Hero section)
- `Section` (now unused)
- `Button` (still used in Hero section)
- `Icon` (now unused)

Note: Kept imports during refactor per "DO NOT remove unused imports until after verification" requirement.

### Pre-existing Issue

LSP error on line 46: `Property 'image' does not exist on type...`

- This is a Convex schema issue, not caused by the refactor
- Service type doesn't include `image` property but the code uses it with fallback

## soluciones/[slug].astro Refactor (Task 11)

### Component Replacements Made

1. **ChallengesSection** - Direct replacement, accepts `challenges: string[]`
   - Props used: `subtitle`, `challenges`
   - Removed: inline Section/Container/grid with Icon components

2. **SolutionsListSection** - Direct replacement, accepts `solutions: string[]`
   - Props used: `subtitle`, `solutions`, `background="gray"`
   - Removed: inline Section/Container/grid with badge styling

3. **RelatedServicesSection** - Required mapping from service objects
   - Props used: `title`, `services` (mapped to `{title, description, slug}[]`)
   - Preserved conditional rendering: `{relatedServices.length > 0 && ...}`
   - Removed: Card component usage (now uses internal card structure)

4. **CTASection** - Direct replacement
   - Props used: `headline`, `headlineAccent`, `subtitle`, `primaryButton`, `secondaryButton`
   - `headlineAccent="industrial"` to apply italic styling to "industrial" word
   - Secondary button uses `variant: 'outline'` for proper styling

### Imports After Refactor

Still used:

- `BaseLayout`, `Container` (Hero), `Button` (Hero), `Card` (may be used elsewhere)
- `Icon` (Hero? No, but kept per instructions)
- `Breadcrumbs` (Hero)
- All new section components

Pre-existing LSP errors (not caused by refactor):

- `og_image` property doesn't exist on solution type
- `allServices` implicit any[] type

### File Size Reduction

Original: 177 lines → Refactored: 123 lines (54 lines removed, ~30% reduction)
