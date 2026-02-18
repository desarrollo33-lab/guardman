# CMS Guardman Complete - Learnings

## [2026-02-18] Initial Codebase Analysis

### Existing Structure

- **Framework**: Astro 5.1.0 with React 18.3.1
- **Backend**: Convex 1.12.0
- **Styling**: Tailwind CSS 3.4.17
- **Package Manager**: npm/bun (check for bun.lockb)

### Current Convex Tables (11 tables)

1. `leads` - typed, has CRUD in leads.ts
2. `services` - uses `v.any()`, needs fixing, has seed data
3. `communes` - typed, has PSEO fields (meta_title, meta_description)
4. `solutions` - typed with proper validators
5. `faqs` - typed with proper validators
6. `site_config` - typed but footer_config uses v.any()
7. `pages` - typed
8. `content_blocks` - typed but data uses v.any()
9. `testimonials` - typed
10. `partners` - typed
11. `blog_posts` - typed with content array

### Services Data Structure (from services.ts seed)

```typescript
{
  id: string,
  slug: string,
  title: string,
  description: string,
  tagline: string,
  icon: string,
  features: string[],
  benefits: string[],
  cta: string,
  solutions: string[],
  image: string,
  meta_title: string,
  meta_description: string,
}
```

### Admin Structure

- AdminLayout.astro exists (basic HTML, no auth)
- Admin pages: index.astro, leads.astro, login.astro
- Login uses form POST to /api/admin/auth

### Key Patterns

- Convex queries use `.withIndex()` for indexed lookups
- Mutations follow `{ args, handler }` pattern
- Schema uses `defineTable()` with `v.*` validators

### Missing Components (to be built)

- Vitest test setup
- Convex Auth
- File storage mutations
- Auth guard for admin
- 8 new tables: heroes, team_members, company_values, process_steps, stats, industries, ctas, authors

## [2026-02-18] Task 04: Schema Fixes Completed

### Schema Updates Made

- **services**: Replaced v.any() with full typed validators matching seed data
- **solutions**: Added image, challenges, relatedServices, order fields
- **communes**: Added PSEO fields (hero_title, hero_subtitle, intro_content)
- **blog_posts**: Added is_published and author_id fields

### Pattern: Safe Field Addition

Always add new fields as optional first to avoid migration issues.

### Pre-existing Issues (Not Fixed - Outside Scope)

- convex/auth.ts: Import error with @convex-dev/auth/providers/Password
- src/lib/auth.ts: Multiple auth-related type errors
- convex/seed.ts: industries field reference (may need cleanup)

## [2026-02-18] File Storage Implementation

### Convex Storage API

- `ctx.storage.generateUploadUrl()` - returns short-lived upload URL
- `ctx.storage.getUrl(storageId)` - returns public URL for file, or null
- `ctx.storage.delete(storageId)` - deletes file from storage
- Storage IDs are typed as `Id<"_storage">`

### Files Table Pattern

```typescript
files: defineTable({
  storageId: v.id('_storage'),
  fileName: v.string(),
  fileType: v.string(),
  fileSize: v.number(),
  uploadedBy: v.optional(v.string()),
  createdAt: v.number(),
}).index('by_storageId', ['storageId']);
```

### Client Upload Flow

1. Call `generateUploadUrl` mutation to get upload URL
2. POST file to the URL, receive `Id<"_storage">`
3. Call `saveFileMetadata` mutation with storageId and metadata
4. Use `getFileUrl` query to get public URL when needed

### Additional Utility Functions

- `getFileMetadata` - get metadata by storage ID
- `listFiles` - list all files ordered by most recent

## [2026-02-18] Task 01: Vitest Setup Completed

### Test Infrastructure Created

- **vitest.config.ts** - Configuration with TypeScript, coverage, and passWithNoTests
- **convex/\_test/utils.ts** - Mock context helpers for Convex function testing

### NPM Scripts Added

```json
{
  "test": "vitest run",
  "test:watch": "vitest",
  "test:coverage": "vitest run --coverage"
}
```

### Vitest Configuration Highlights

```typescript
{
  include: ['**/*.test.ts', '**/*.spec.ts'],
  exclude: ['node_modules', 'dist', '.astro', 'convex/_generated'],
  globals: true,
  environment: 'node',
  passWithNoTests: true,  // Important for initial setup
}
```

### Mock Context Pattern for Convex

```typescript
import { createMockContext, createTestLead } from './utils';

test('example', () => {
  const ctx = createMockContext({
    db: {
      get: async (id) => ({ _id: id, name: 'Test' }),
    },
  });
  // Use ctx in function tests
});
```

### Dependencies Installed

- vitest@^4.0.18
- @vitest/coverage-v8@^4.0.18

## [2026-02-18] Task 02: Convex Auth Setup

### Package Installed

- `@convex-dev/auth`: v0.0.90

### Files Created

1. **convex/auth.ts** - Server-side auth configuration
   - Password provider configured
   - Exports: auth, signIn, signOut, store, isAuthenticated

2. **src/lib/auth.tsx** - Client-side auth wrapper (NOTE: .tsx for JSX)
   - AuthProvider component wrapping ConvexAuthProvider
   - Re-exports: useAuthActions, useAuthToken

### Schema Updated

- Added `import { authTables } from '@convex-dev/auth/server'`
- Spread `...authTables` at top of schema
- Adds 5 auth tables: authAccounts, authKeys, authRefreshTokens, authSessions, authVerifications

### Key Pattern: Convex Auth Setup

```typescript
// Server-side (convex/auth.ts)
import { Password } from '@convex-dev/auth/providers/Password';
import { convexAuth } from '@convex-dev/auth/server';

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Password],
});

// Client-side (src/lib/auth.tsx)
import { ConvexAuthProvider, useAuthActions, useAuthToken } from '@convex-dev/auth/react';

export function AuthProvider({ children }: { children: ReactNode }) {
  return <ConvexAuthProvider client={convex}>{children}</ConvexAuthProvider>;
}
```

### Available Hooks from @convex-dev/auth/react

- `useAuthActions()` - Returns `{ signIn, signOut }`
- `useAuthToken()` - Returns JWT token for HTTP auth
- `ConvexAuthProvider` - Provider component

### Important: v0.0.90 API Changes

The current version does NOT export:

- `useConvexAuth` (removed)
- `Authenticated` component (removed)
- `Unauthenticated` component (removed)
- `AuthLoading` component (removed)

Use `useAuthActions()` and `useAuthToken()` instead.

### Existing AuthGuard.tsx Issue

The file `src/components/admin/AuthGuard.tsx` imports removed components:

- useConvexAuth, Authenticated, Unauthenticated, AuthLoading

This needs to be updated in Task 6 (Admin Layout + Auth Guard).

### Note on bun

bun command not available in this environment. Use npm instead.

## [2026-02-18] Task 06: Admin Layout + Auth Guard

### Files Created

1. **src/components/admin/AuthGuard.tsx** - Protected route component
   - Uses `useConvexAuth()` from `convex/react` (NOT from @convex-dev/auth/react)
   - Shows loading spinner while checking auth
   - Redirects to login if not authenticated

2. **src/components/admin/LoginForm.tsx** - Login form component
   - Uses `useAuthActions()` from `@convex-dev/auth/react`
   - Handles email/password authentication
   - Redirects to /admin on success

3. **src/components/admin/LogoutButton.tsx** - Logout button component
   - Uses `useAuthActions()` from `@convex-dev/auth/react`
   - Redirects to /admin/login after logout

### Files Modified

1. **src/pages/admin/login.astro** - Updated to use Convex Auth
2. **src/layouts/AdminLayout.astro** - Added AuthProvider and LogoutButton
3. **src/components/admin/ConvexDashboard.tsx** - Added AuthGuard wrapper
4. **src/components/admin/ConvexLeadsList.tsx** - Added AuthGuard wrapper
5. **src/components/admin/ConvexLeadDetail.tsx** - Added AuthGuard wrapper

### Critical Import Pattern

```typescript
// Correct - useConvexAuth comes from convex/react
import {
  useConvexAuth,
  Authenticated,
  Unauthenticated,
  AuthLoading,
} from 'convex/react';

// Correct - Auth actions come from @convex-dev/auth/react
import { ConvexAuthProvider, useAuthActions } from '@convex-dev/auth/react';
```

### Auth Guard Pattern

```typescript
import { useConvexAuth } from 'convex/react';

export default function AuthGuard({ children, redirectTo = '/admin/login' }) {
  const { isLoading, isAuthenticated } = useConvexAuth();

  if (isLoading) return <LoadingSpinner />;
  if (!isAuthenticated) return <RedirectToLogin to={redirectTo} />;
  return <>{children}</>;
}
```

### Login Flow with Convex Auth

```typescript
const { signIn } = useAuthActions();

// In form submit handler
const formData = new FormData(event.currentTarget);
await signIn('password', formData); // formData must include: email, password, flow
```

### Astro Integration Pattern

Admin pages use wrapper components that provide:

1. ConvexProvider (for Convex hooks)
2. AuthGuard (for auth protection)
3. Actual content component

```typescript
// Example: ConvexDashboard.tsx
export default function ConvexDashboard() {
  return (
    <ConvexProvider client={convex}>
      <AuthGuard>
        <Dashboard />
      </AuthGuard>
    </ConvexProvider>
  );
}
```

### Single Admin User Model

- No roles or permissions
- Single admin user can access all admin features
- Password-based authentication only

## [2026-02-18] Task 03: Schema Design - New Tables Added

### 8 New Tables Added to convex/schema.ts

1. **heroes** - Page hero sections with youtube/image backgrounds
   - Index: `by_page_slug`
   - Supports CTAs and badges arrays
2. **team_members** - Team member profiles
   - Index: `by_order`
   - Avatar, role, bio fields
3. **company_values** - Company values with icons
   - Index: `by_order`
4. **process_steps** - Multi-step processes by page
   - Index: `by_page_slug`
5. **stats** - Statistics counters by page
   - Index: `by_page_slug`
   - Value/label pattern (e.g., "500+", "Clientes")
6. **industries** - Industry verticals
   - Indexes: `by_slug`, `by_order`
7. **ctas** - Call-to-action blocks by page
   - Index: `by_page_slug`
   - Supports image/gradient backgrounds
8. **authors** - Blog/content authors
   - Index: `by_slug`

### Table Count After Changes

- Total defineTable calls: 21 (including authTables spread)
- Original tables: 12 + authTables
- New tables: 8

### Pattern: Nested Object Validators

For array of objects, use nested v.object():

```typescript
ctas: v.optional(
  v.array(
    v.object({
      text: v.string(),
      href: v.string(),
      variant: v.optional(v.string()),
    })
  )
),
```

### Pre-existing Issue Not Fixed (Outside Scope)

- convex/seed.ts line 86 references `industries` field on services table that doesn't exist

## [2026-02-18] Task 09: Heroes CRUD Mutations

### File Created: convex/heroes.ts

### Functions:

**Queries:**

- `getAllHeroes` - Returns all hero records
- `getHeroByPage` - Returns active hero by page_slug using index
- `getActiveHeroes` - Returns only active heroes

**Mutations:**

- `createHero` - Creates hero with validation for background type
- `updateHero` - Updates hero, filters undefined values
- `deleteHero` - Deletes hero by ID

### Pattern: Conditional Validation

```typescript
// Validate: youtube_id required if youtube type
if (args.background_type === 'youtube' && !args.youtube_id) {
  throw new Error('youtube_id is required for youtube background type');
}
// Validate: image_url required if image type
if (args.background_type === 'image' && !args.image_url) {
  throw new Error('image_url is required for image background type');
}
```

### Pattern: Clean Update Object

Filter out undefined values before patching:

```typescript
const cleanUpdates = Object.fromEntries(
  Object.entries(updates).filter(([_, v]) => v !== undefined)
);
await ctx.db.patch(id, cleanUpdates);
```

### Index Used: `by_page_slug`

The heroes table has an index on `page_slug` for efficient lookups by page

## [2026-02-18] Task 07: Services CRUD Mutations

### File Modified: convex/services.ts

### Functions Added:

**Mutations:**

- `createService` - Insert new service with slug uniqueness check
- `updateService` - Update by ID, filters undefined values before patching
- `deleteService` - Soft delete (sets is_active=false)
- `reorderServices` - Batch update order field for multiple services

### Pattern: Soft Delete

```typescript
export const deleteService = mutation({
  args: { id: v.id('services') },
  handler: async (ctx, args) => {
    // Soft delete - set is_active to false
    await ctx.db.patch(args.id, { is_active: false });
  },
});
```

### Pattern: Slug Uniqueness Check

```typescript
const existing = await ctx.db
  .query('services')
  .withIndex('by_slug', (q) => q.eq('slug', args.slug))
  .first();
if (existing) throw new Error('Service with this slug already exists');
```

### Pattern: Batch Reorder

```typescript
export const reorderServices = mutation({
  args: {
    orders: v.array(
      v.object({
        id: v.id('services'),
        order: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    for (const item of args.orders) {
      await ctx.db.patch(item.id, { order: item.order });
    }
  },
});
```

### Index Used: `by_slug`

The services table has an index on `slug` for uniqueness validation.

## [2026-02-18] Task 12: Partners CRUD Mutations

### Mutations Added to convex/partners.ts

1. **createPartner** - Insert new partner with all fields
2. **updatePartner** - Partial update with undefined filtering
3. **deletePartner** - Remove partner by ID
4. **reorderPartners** - Batch update order for drag-and-drop

### Pattern: Update Mutation with Undefined Filtering

```typescript
export const updatePartner = mutation({
  args: {
    id: v.id('partners'),
    name: v.optional(v.string()),
    // ...other optional fields
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined)
    );
    await ctx.db.patch(id, cleanUpdates);
    return await ctx.db.get(id);
  },
});
```

### Pattern: Batch Reorder Mutation

```typescript
export const reorderPartners = mutation({
  args: {
    orders: v.array(
      v.object({
        id: v.id('partners'),
        order: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    for (const item of args.orders) {
      await ctx.db.patch(item.id, { order: item.order });
    }
  },
});
```

### Partners Table Fields

- name (required)
- logo_url (required)
- type (required - string, flexible for "certification", "client", "tech_partner")
- order (required)
- url, quote, industry, icon (optional)

## [2026-02-18] Task 11: FAQs CRUD Mutations

### File Modified: convex/faqs.ts

### Added CRUD Mutations:

- `createFaq` - Create new FAQ with question, answer, category, order
- `updateFaq` - Update FAQ by ID with optional fields
- `deleteFaq` - Delete FAQ by ID
- `reorderFaqs` - Batch update order for multiple FAQs

### Pattern: Batch Reorder Mutation

```typescript
export const reorderFaqs = mutation({
  args: {
    orders: v.array(
      v.object({
        id: v.id('faqs'),
        order: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    for (const item of args.orders) {
      await ctx.db.patch(item.id, { order: item.order });
    }
  },
});
```

## [2026-02-18] Task 08: Solutions CRUD Mutations

### File Modified: convex/solutions.ts

### Mutations Added:

1. **createSolution** - Creates solution with slug uniqueness check
2. **updateSolution** - Updates solution, filters undefined values
3. **deleteSolution** - Soft delete (sets is_active to false)
4. **reorderSolutions** - Batch update order field

### Pattern: Soft Delete

```typescript
export const deleteSolution = mutation({
  args: { id: v.id('solutions') },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { is_active: false });
  },
});
```

### Pattern: Batch Reorder

```typescript
export const reorderSolutions = mutation({
  args: {
    orders: v.array(
      v.object({
        id: v.id('solutions'),
        order: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    for (const item of args.orders) {
      await ctx.db.patch(item.id, { order: item.order });
    }
  },
});
```

### Field: relatedServices

The `relatedServices` field is an array of service slugs (strings), enabling manual linking from solutions to services without auto-linking logic.

### Index Used: `by_slug`

Solutions table uses the `by_slug` index for uniqueness validation and lookups.

## [2026-02-18] Task 10: Communes CRUD Mutations

### Mutations Added to convex/communes.ts

1. **createCommune** - Create new commune with slug uniqueness validation
2. **updateCommune** - Update any commune field by ID
3. **updateCommuneSEO** - Dedicated mutation for PSEO fields only
4. **deleteCommune** - Delete commune by ID
5. **reorderCommunes** - Placeholder for future ordering (no order field yet)

### PSEO Field Handling

Communes table supports PSEO-specific fields:

- `hero_title` - Hero section title
- `hero_subtitle` - Hero section subtitle
- `intro_content` - Introduction content

These are separate from standard SEO fields:

- `meta_title` - Page title tag
- `meta_description` - Meta description

### Pattern: Dedicated SEO Mutation

```typescript
export const updateCommuneSEO = mutation({
  args: {
    id: v.id('communes'),
    meta_title: v.optional(v.string()),
    meta_description: v.optional(v.string()),
    hero_title: v.optional(v.string()),
    hero_subtitle: v.optional(v.string()),
    intro_content: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...seoFields } = args;
    const cleanUpdates = Object.fromEntries(
      Object.entries(seoFields).filter(([_, v]) => v !== undefined)
    );
    await ctx.db.patch(id, cleanUpdates);
    return await ctx.db.get(id);
  },
});
```

### PSEO Content Strategy

- 52 Chilean communes in database
- Template-based content generation (frontend responsibility)
- Same structure, different names/slugs
- SEO fields for per-commune customization
