## Task 0.4 - Fix Industry relatedServices Property

- Fixed by adding relatedServices?: string[] as optional property to Industry interface
- Pattern: When Astro template uses optional chaining (?.) on a property, make it optional in interface

## Task 0.1 - SSR Configuration (2026-02-16)

- Changed `output: 'static'` to `output: 'server'` in astro.config.mjs
- Vercel adapter already configured - no additional setup needed
- SSR mode shows warnings about getStaticPaths() being ignored in dynamic routes
- Pre-existing issue: Convex not initialized (`convex/_generated/api` missing)

## Task 0.3: FAQ Category Property (2026-02-16)

- Category values in FAQ interface: "general", "guardias", "alarmas", "guardpod", "contratos", "precios"
- Each FAQ object requires explicit category matching its content topic
- TypeScript strict mode catches missing required properties in array objects

## Task 0.2 - ConvexProvider Wrapper (2026-02-16)

### Problem

- Convex React hooks (useMutation, useQuery) require ConvexProvider context
- In Astro + React, `client:*` directives hydrate React components client-side
- Using `<ConvexProvider>` directly in .astro files doesn't work because:
  - Astro interprets it as an Astro component, not React
  - Only the component with `client:load` is hydrated, not its parent in .astro

### Solution Pattern

Create a React wrapper component that includes ConvexProvider:

```tsx
// ConvexLeadForm.tsx
export default function ConvexLeadForm(props) {
  return (
    <ConvexProvider client={convex}>
      <LeadForm {...props} />
    </ConvexProvider>
  );
}
```

Then use in .astro files:

```astro
<ConvexLeadForm client:load source="cotizar" />
```

### Files Created

- `src/components/forms/ConvexLeadForm.tsx` - wraps LeadForm with Convex context
- `src/components/forms/ConvexContactForm.tsx` - wraps ContactForm with Convex context

### Files Updated

- `src/pages/cotizar.astro` - uses ConvexLeadForm instead of nested ConvexProvider
- `src/pages/contacto.astro` - uses ConvexContactForm instead of nested ConvexProvider

## Task 1.4 - tsconfig.json Paths Verification (2026-02-16)

### Finding

- `@/*` alias was already correctly configured in tsconfig.json
- Configuration: `"@/*": ["src/*"]` under `compilerOptions.paths`
- Additional aliases also present: `@components/*`, `@layouts/*`, `@pages/*`, `@data/*`, `@utils/*`, `@styles/*`, `@content/*`
- `baseUrl: "."` is required for paths to work

### Verification

- `npx tsc --noEmit` shows error about missing `convex/_generated/api` (Convex not initialized)
- This error is unrelated to path aliases - paths configuration is correct

## Task 1.1 - Prettier Config (2026-02-16)

- Created .prettierrc with: semi, singleQuote, tabWidth: 2, trailingComma: 'es5', plugins: ['prettier-plugin-astro']
- Prettier 3.4.2 and prettier-plugin-astro 0.14.1 pre-installed in devDependencies
- Pre-existing syntax errors in Header.astro and index.astro prevent prettier parsing

## Task 1.3 - npm Scripts (2026-02-16)

### Scripts Added

```json
"lint": "eslint src/ convex/",
"lint:fix": "eslint src/ convex/ --fix",
"format": "prettier --write \"src/**/*.{ts,tsx,astro,css}\"",
"format:check": "prettier --check \"src/**/*.{ts,tsx,astro,css}\"",
"typecheck": "tsc --noEmit",
"check": "npm run typecheck && npm run lint && npm run format:check"
```

### Notes

- All existing scripts preserved (dev, start, build, preview, astro)
- ESLint not installed yet - lint script will work after task 1.1 completes
- TypeScript and Prettier already in devDependencies - those scripts work immediately
- Evidence saved to `.sisyphus/evidence/task-1.3-scripts.txt`

## Task 1.2 - ESLint Config (2026-02-16)

### Files Created

- `eslint.config.mjs` - ESLint flat config format

### Configuration Details

- Basic rules: no-console, no-debugger, no-unused-vars, prefer-const, no-var, object-shorthand, prefer-template
- TypeScript and Astro files currently ignored (require special parsers)
- Uses inline globals definition instead of 'globals' package

### Limitation

- Project has no plain .js files in src/ - all files are TypeScript (.ts, .tsx) or Astro (.astro)
- ESLint default parser (Espree) cannot parse TypeScript syntax (interface, type, etc.)
- Without @typescript-eslint/parser, TypeScript files cannot be linted
- Without eslint-plugin-astro, Astro files cannot be linted

### For Full Support

Install these packages:

```bash
npm install -D @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-astro
```

Then update eslint.config.mjs to use TypeScript and Astro parsers.

### Evidence

Saved to `.sisyphus/evidence/task-1.2-eslint-run.txt`

## Task 1.5 - Build Verification (2026-02-16)

### Result: BUILD FAILED

Build command `npm run build` fails with:

```
Could not resolve "../../../convex/_generated/api" from "src/components/forms/LeadForm.tsx"
```

### Root Cause

- Pre-existing issue: Convex backend not initialized
- Missing: `convex/_generated/api` and `convex/_generated/server`
- Files affected: `src/components/forms/LeadForm.tsx`, `convex/leads.ts`

### dist/ Directory Status

- EXISTS but EMPTY (no files generated due to build failure)

### Fix Required

Run `npx convex dev` or `npx convex deploy` to initialize Convex and generate the missing API files.

### Warnings Observed (non-blocking)

1. Content collections auto-generated (deprecated) - should define in `src/content.config.ts`
2. No files found in `content/blog` and `content/locations` directories
3. Multiple `getStaticPaths()` ignored warnings - need `export const prerender = true`

### Evidence

Saved to `.sisyphus/evidence/task-1.5-build.txt`

## Task 2.2 - Webhook Endpoint /api/webhooks/sheets (2026-02-16)

### Files Created

- `src/pages/api/webhooks/sheets.ts` - Astro API endpoint for Google Sheets webhook

### Implementation Details

- GET handler: Returns health check with `status: 'ok'` and configuration status
- POST handler: Forwards lead data to Google Apps Script URL
- Uses `import.meta.env.GOOGLE_SCRIPT_URL` environment variable
- Error handling: Returns 200 with error info to avoid blocking caller
- Timestamp: Adds ISO timestamp to all forwarded lead data

### Pattern

```typescript
import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => { ... };
export const POST: APIRoute = async ({ request }) => { ... };
```

### Environment Variable Required

- `GOOGLE_SCRIPT_URL` - URL of the Google Apps Script web app

## Task 2.3 - createLead Webhook Trigger (2026-02-16)

### Files Modified

- `convex/leads.ts` - Added `triggerWebhook` action and modified `createLead` mutation

### Implementation Pattern

Convex mutations CANNOT make HTTP requests directly. The pattern is:

1. Create an `action` that uses `fetch` for HTTP requests
2. Use `ctx.scheduler.runAfter(0, internal.module.actionName, args)` to call the action from a mutation
3. The action runs asynchronously and doesn't block the mutation response

### Code Structure

```typescript
import { mutation, query, action } from "./_generated/server";
import { internal } from "./_generated/api";

// Action for HTTP requests
export const triggerWebhook = action({
  args: { leadData: v.object({...}) },
  handler: async (ctx, args) => {
    try {
      await fetch(webhookUrl, { method: "POST", ... });
    } catch (error) {
      console.error("Webhook trigger failed:", error);
    }
  },
});

// Mutation calls action via scheduler
export const createLead = mutation({
  handler: async (ctx, args) => {
    const leadId = await ctx.db.insert("leads", {...});
    await ctx.scheduler.runAfter(0, internal.leads.triggerWebhook, { leadData: args });
    return leadId;
  },
});
```

### Key Points

- `runAfter(0, ...)` executes immediately but asynchronously
- Errors in action don't affect the mutation (fire-and-forget pattern)
- Environment variable `WEBHOOK_URL` can override the default webhook endpoint

### Pre-existing Issue

Convex not initialized (`convex/_generated/api` missing) - run `npx convex dev` to generate

## Task 3.1 - Blog Content Collections (2026-02-16)

### Files Created

- `src/content/config.ts` - Astro content collections configuration

### Schema Definition

```typescript
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    author: z.string(),
    image: z.string().optional(),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { blog };
```

### Key Points

- `z.coerce.date()` allows dates as strings in frontmatter, auto-converts to Date objects
- `type: "content"` is for markdown/MDX files (vs `type: "data"` for JSON/YAML)
- `z.array(z.string()).default([])` ensures tags is always an array
- `image` is optional for posts without featured images

### Directory Structure

```
src/content/
├── blog/         # Blog posts (markdown/MDX files)
├── locations/    # Location data
└── config.ts     # Content collections schema
```

### Pre-existing Issue

Convex not initialized (`convex/_generated/api` missing) - unrelated to this task.

## Task 3.2 - Blog Index Page /blog/index.astro (2026-02-16)

### Files Created

- `src/pages/blog/index.astro` - Blog listing page

### Implementation Details

- Uses `getCollection('blog')` from `astro:content` to fetch all posts
- Sorts posts by `pubDate` descending (newest first)
- Displays each post with: title, description, formatted date (es-CL locale), image, author
- Links to `/blog/[slug]` for each post (uses existing `[slug].astro`)
- Uses BaseLayout, Container, and Section components for consistent structure
- Handles empty state with "Próximamente" message when no posts exist
- Uses Tailwind utility classes matching existing page patterns

### Date Formatting Pattern

```typescript
function formatDate(date: Date): string {
  return date.toLocaleDateString('es-CL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
```

### Post Card Structure

- Image container with aspect-video ratio
- Placeholder gradient when no image available
- Line clamping: `line-clamp-2` for titles, `line-clamp-3` for descriptions
- Hover effects: `hover:-translate-y-1`, `hover:shadow-elevated`
- Author display with icon

### Key Points

- No pagination required (only 5 articles planned)
- No filters or search required
- `[slug].astro` already existed - no modification needed
- Build fails due to pre-existing Convex issue, not this task

## Task 3.3 - Blog [slug].astro Template (2026-02-16)

### Files Created

- `src/pages/blog/[slug].astro` - Dynamic blog post template

### Implementation Details

- Uses `getCollection('blog')` from `astro:content` to fetch all posts
- `post.slug` automatically provides the URL-friendly slug from content collections
- `post.render()` returns `{ Content }` component for rendering markdown
- Schema.org Article JSON-LD passed via `schema` prop to BaseLayout
- Date formatting uses `toLocaleDateString('es-CL')` for Spanish locale

### Schema.org Article Structure

```typescript
const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: post.data.title,
  description: post.data.description,
  author: { '@type': 'Person', name: post.data.author },
  publisher: { '@type': 'Organization', name: site.name, logo: {...} },
  datePublished: publishedDate,
  mainEntityOfPage: { '@type': 'WebPage', '@id': Astro.url.href },
  ...(post.data.image && { image: new URL(post.data.image, site.url).href }),
};
```

### Key Pattern

- BaseLayout accepts `schema` prop for JSON-LD structured data
- Content collections auto-generate slugs from file paths
- Tailwind typography plugin (`prose` classes) styles markdown content

### No Blog Posts Yet

The `src/content/blog/` directory is empty - template will work when posts are added.

## Task 4.5: Coverage Index Page (2026-02-16)

**Status**: Completed (fix only)

**Findings**:

- File already existed at `src/pages/cobertura/index.astro`
- Had broken import: `import { locations } from '@/data/locations'` but `locations.ts` exports `regions`
- Fixed by changing to `import { regions } from '@/data/locations'` and replacing `locations.regions` with `regions`

**Content includes**:

- Hero section with stats (5 regions, 25+ cities, 24/7, 15min response)
- Regions grid with cards showing city previews
- Simplified Chile map with region markers (placeholder)
- Complete city list by region with links
- CTA section for cities not in coverage

**Note**: Build fails on unrelated convex/LeadForm.tsx import issue - outside scope of this task.

## 4.3 Ciudad Dinámica - Learnings

- Import from locations.ts is `regions`, not `locations`
- Need `export const prerender = true` for hybrid SSR output
- LocalBusinessSchema component accepts city/region props
- getStaticPaths generates all region/city combinations

## Task 6.4 - Sitemap Verification (2026-02-16)

### Configuration Status

**CORRECTLY CONFIGURED** in `astro.config.mjs`:

```javascript
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://guardman.cl',
  integrations: [react(), tailwind(), sitemap()],
});
```

### Expected Sitemap Output

After successful build, `@astrojs/sitemap` will generate:

- `sitemap-index.xml` - Main sitemap index
- Individual sitemap files for pages

### Pages That Should Be Included

| Route                          | Type    | Status                     |
| ------------------------------ | ------- | -------------------------- |
| `/`                            | Static  | ✅ Main page               |
| `/cotizar`                     | Static  | ✅ Quote form              |
| `/contacto`                    | Static  | ✅ Contact page            |
| `/blog`                        | Static  | ✅ Blog index              |
| `/blog/[slug]`                 | Dynamic | ⚠️ Needs `prerender: true` |
| `/cobertura`                   | Static  | ✅ Coverage index          |
| `/cobertura/[region]`          | Dynamic | ⚠️ Needs `prerender: true` |
| `/cobertura/[region]/[ciudad]` | Dynamic | ⚠️ Needs `prerender: true` |
| `/servicios/[slug]`            | Dynamic | ⚠️ Needs `prerender: true` |
| `/industrias/[slug]`           | Dynamic | ⚠️ Needs `prerender: true` |
| `/admin/*`                     | SSR     | ❌ Excluded (admin pages)  |

### Build Status

**BUILD FAILS** - Pre-existing Convex issue:

```
Could not resolve "../../../convex/_generated/api" from "src/components/forms/LeadForm.tsx"
```

The sitemap cannot be generated until the build succeeds.

### Fix Required

1. Run `npx convex dev` to initialize Convex backend
2. This generates missing `convex/_generated/api` files
3. Re-run `npm run build`
4. Sitemap will be generated in `dist/sitemap-index.xml`

### Additional Recommendations

- Add `robots.txt` to `public/` directory with sitemap reference
- Consider adding `changefreq` and `priority` configuration to sitemap
- Admin pages (`/admin/*`) should be excluded from sitemap
