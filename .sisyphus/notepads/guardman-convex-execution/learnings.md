# Learnings - Guardman Convex Execution

## 2025-02-19: Task 0.2 - Data Provider Spike

### Convex + Refine Integration Patterns

1. **ConvexReactClient.query() for imperative queries**
   - Convex uses React hooks (`useQuery`) for reactive data
   - Refine's DataProvider requires Promise-based methods
   - Solution: Use `client.query(functionPath, args)` for imperative queries
   - This bypasses reactivity but works for CRUD operations

2. **Resource Mapping Pattern**
   - Refine uses resource names like "services", "leads"
   - Convex uses function paths like "services:getAllServices"
   - Created `RESOURCE_MAP` to translate between the two
   - Pattern: `{ listQuery: "module:function", getQuery: "module:function" }`

3. **Convex ID Handling**
   - Convex IDs are auto-generated strings (e.g., `k57f8abc123`)
   - Stored in `_id` field on documents
   - Can be passed as strings to Refine
   - Need `v.id("tableName")` validator in Convex queries

4. **Missing getById Queries**
   - Convex modules typically have `getBySlug` or `getAll`
   - Refine's `getOne` needs ID-based lookup
   - Required pattern for each table:
     ```typescript
     export const getById = query({
       args: { id: v.id("tableName") },
       handler: async (ctx, args) => ctx.db.get(args.id),
     });
     ```

5. **Pagination Differences**
   - Refine: offset/limit (`{ current: 1, pageSize: 10 }`)
   - Convex: cursor-based with `.paginate()`
   - Spike uses client-side pagination
   - Production needs cursor-to-offset translation

6. **Type Safety Trade-offs**
   - Generated `api` object provides type-safe function access
   - For spike, used dynamic string paths with `@ts-expect-error`
   - Production should import from `convex/_generated/api`

### Convex Client Setup Pattern

```typescript
// Shared singleton client
const convexClient = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);

// Factory function for data provider
const dataProvider = createConvexDataProvider(convexClient);
```

### Refine DataProvider Minimal Interface

```typescript
interface DataProvider {
  getList: (params) => Promise<{ data: any[], total: number }>;
  getOne: (params) => Promise<{ data: any }>;
  create: (params) => Promise<{ data: any }>;
  update: (params) => Promise<{ data: any }>;
  deleteOne: (params) => Promise<{ data: any }>;
  getApiUrl: () => string;
}
```

---

## 2026-02-19: Task 0.1 - Refine + Convex Auth Compatibility Test

### Bridge Pattern for Auth Integration

When integrating two auth systems with different paradigms (React hooks vs async methods), a bridge module with shared state works well.

**Key Implementation Details**:
1. Use `registerAuthActions()` to let React components provide hooks to non-React code
2. Use `updateAuthState()` to sync state changes
3. AuthProvider methods can then call the registered actions

### Convex Auth API Details

- `ConvexAuthProvider` requires `client` prop with `ConvexReactClient`
- `useAuthActions()` returns `{ signIn, signOut }` - no `fetchAccessToken` method
- Use `Authenticated`, `Unauthenticated`, `AuthLoading` components from `convex/react` for UI state
- Server-side: Create `currentUser` query using `getAuthUserId(ctx)` from `@convex-dev/auth/server`

```typescript
// convex/users.ts
import { getAuthUserId } from "@convex-dev/auth/server";

export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return null;
    return await ctx.db.get(userId);
  },
});
```

### Refine Auth API Details

- `useLogin()` returns `{ mutate }` - use callbacks (`onSuccess`, `onError`) for error handling
- `useGetIdentity<T>()` returns typed identity
- `useIsAuthenticated()` returns `{ data: { authenticated: boolean } }`
- AuthProvider interface requires: `login`, `logout`, `check`, `getIdentity`, `onError`

### Type Import Paths

```typescript
// Convex generated types
import type { Id } from "../../../convex/_generated/dataModel";

// Convex API functions
import { api } from "../../../convex/_generated/api";
```

### Test Files Created

- `admin/src/test-auth/authProvider.ts` - Bridge module between Convex Auth and Refine
- `admin/src/test-auth/App.tsx` - Test app with full integration
- `admin/src/test-auth/LoginPage.tsx` - Login form using `useLogin`
- `admin/src/test-auth/TestPage.tsx` - Protected page verifying `useGetIdentity`
- `admin/src/test-auth/main.tsx` - Entry point for test app

### Dependencies Added

```bash
npm install @refinedev/core @refinedev/react-router
```

---

## 2026-02-19: Task 0.3 - Backup Strategy Documentation

### Convex Backup Methods

1. **Dashboard Method (Recommended)**
   - URL: `https://dashboard.convex.dev/d/{deployment}/settings/backups`
   - No CLI setup required
   - "Backup Now" for immediate backup
   - "Backup automatically" for scheduled backups (Pro plan)
   - Downloads as ZIP file
   - Can restore to any deployment on same team

2. **CLI Method**
   - Requires `convex` in package.json dependencies
   - Requires authentication via `npx convex login`
   - Command: `npx convex export --path backup.zip`
   - Production: `npx convex export --prod --path backup.zip`

### Monorepo CLI Limitation

For monorepo projects:
- CLI checks for `convex` in local package.json
- Workspaces (web/, admin/) don't satisfy this requirement
- Solution: Run from subdirectory with convex installed, or add to root

### MCP Access Levels

- Dev deployment: Full read/write access
- Prod deployment: Read-only for PII protection
- `runOneoffQuery` blocked on prod without special flags
- Use dashboard for production data inspection

### Convex Backup Retention

| Type | Retention |
|------|-----------|
| Manual backup | 7 days |
| Daily scheduled | 7 days |
| Weekly scheduled | 14 days |

### Backup Contents

**Included:**
- All table data
- Document metadata (`_id`, `_creationTime`)
- Optional: File storage (`--include-file-storage`)

**NOT Included:**
- Environment variables
- Function code (in git)
- Deployment configuration

### Restore Behavior

- `--replace-all`: Destructive, replaces all data
- `--table <name> --replace`: Replace single table
- `--append`: Add data without deleting
- Convex IDs are preserved during restore

---

## 2026-02-19: Task 1.1 - Slug Field Analysis

### Schema Slug Convention (Already Consistent)

All URL-addressable entities use `slug` as the field name:

| Table        | Usage                                  |
|--------------|----------------------------------------|
| services     | `/servicios/{slug}`                    |
| solutions    | `/soluciones/{slug}`                   |
| communes     | SEO landing pages `/zonas/{slug}`      |
| industries   | `/industrias/{slug}`                   |
| blog_posts   | `/blog/{slug}`                         |
| pages        | `/{slug}` (e.g., "/", "/contacto")     |
| authors      | `/autores/{slug}`                      |

### Foreign Key Pattern: `page_slug`

Tables referencing pages use `page_slug` field:
- content_blocks, heroes, process_steps, stats, ctas

### Index Naming Convention

All slug indexes follow `by_slug` pattern:
```typescript
.defineTable({ slug: v.string() })
.index('by_slug', ['slug'])
```

Query pattern:
```typescript
.withIndex('by_slug', (q) => q.eq('slug', args.slug))
```

### Tables Without Slugs (Correct Design)

These don't need slugs because:
- **users**: email as identifier
- **leads**: transient data, no public URLs
- **faqs**: accessed by category, not individually
- **site_config**: singleton
- **testimonials/partners/team_members**: displayed in groups

### Seed Data Idempotency Pattern

FAQs use `id` field for seeding only:
```typescript
// Seed data has id for idempotency check
const existing = await ctx.db.query('faqs')
  .filter((q) => q.eq(q.field('id'), data.id))
  .first();
```

This is NOT a slug field - just seeding metadata.

---

## 2026-02-19: Task 1.4 - Soft Delete Pattern Analysis

### Current State

Only 6 of 19 tables have `is_active` soft delete field:
- services, solutions, heroes, team_members, industries, site_config

13 tables lack soft delete entirely.

### Inconsistencies Found

1. **Field vs Implementation Gap**
   - heroes, industries, team_members: Have `is_active` field but use HARD delete
   - This means the field exists but is never set to false

2. **No Filtering in Queries**
   - services, solutions: Have is_active but `getAll*` queries don't filter
   - Frontend receives "deleted" items alongside active ones

3. **Missing Default Values**
   - team_members: Has is_active but no `?? true` default on create
   - Results in `undefined` instead of `true` for new records

### Standard Pattern for Soft Delete

```typescript
// Schema
is_active: v.optional(v.boolean()),

// Create mutation
return await ctx.db.insert('table', {
  ...args,
  is_active: args.is_active ?? true,
});

// Delete mutation (soft)
await ctx.db.patch(args.id, { is_active: false });

// Query for active items
return all.filter((item) => item.is_active !== false);
```

### `is_active` vs `is_published`

Two distinct patterns exist:
- `is_active`: Soft delete status (should filter deleted items)
- `is_published`: Content workflow (draft vs published)

Both are valid but serve different purposes. blog_posts uses `is_published`
correctly for its editorial workflow.

### Priority Tables for Soft Delete

HIGH: faqs, testimonials, partners, team_members (admin-managed content)
MEDIUM: heroes, industries, content_blocks, company_values (CMS content)
LOW: leads, communes, stats, ctas, authors, files, process_steps (config/meta)

---

## 2026-02-19: Task 1.2 - Slug Index Verification

### Finding: All Slug Indexes Already Present

No changes required - schema already has 100% coverage of `by_slug` indexes.

### Tables with `by_slug` Indexes

| Table       | Index Line | Slug Field Line |
|-------------|------------|-----------------|
| services    | 48         | 33              |
| communes    | 61         | 52              |
| solutions   | 86         | 67              |
| pages       | 142        | 135             |
| blog_posts  | 199        | 178             |
| industries  | 289        | 276             |
| authors     | 316        | 312             |

### Query Pattern Verified

All slug-based lookups use indexed queries:
```typescript
.withIndex('by_slug', (q) => q.eq('slug', args.slug))
```

This provides O(log n) lookup instead of O(n) full table scan.

### Foreign Key Indexes (page_slug)

Tables with `page_slug` foreign keys have appropriate indexes:
- `content_blocks`: `by_page_order` (compound index for ordering)
- `heroes`, `process_steps`, `stats`, `ctas`: `by_page_slug`

### Evidence File

Created: `.sisyphus/evidence/task-1.2-indexes.txt`

---

## 2026-02-19: Task 1.3 - Unused Schema Fields Analysis

### Legacy Field Pattern

Schema fields marked with comment "Legacy field" are safe to remove:
- These are always `v.optional()` 
- They represent migration remnants from refactoring
- No mutations or queries reference them

### Identified Legacy Fields

**Safe to Remove (explicitly marked legacy):**
- `solutions.name` - replaced by `title`
- `site_config.navbar_items[].path` - replaced by `href`
- `industries.id`, `challenges`, `relatedServices`, `solutions`, `meta_title`, `meta_description`

**Requires Evaluation (used in seed only):**
- `services.id`, `solutions.id`, `faqs.id` - used for seed idempotency checks

### Field Removal Verification Method

1. Grep in `convex/*.ts` for field usage
2. Grep in `web/src/**/*` for frontend usage
3. Grep in `admin/src/**/*` for admin usage
4. Check mutation/query arguments for field inclusion

### Unused Field vs Empty Table

Empty tables (authors, company_values, etc.) don't necessarily have unused fields.
Each field must be verified against actual code usage, not table population.

### Convex Optional Field Safety

Removing `v.optional()` fields from schema is non-breaking:
- Existing documents retain the data
- No validation errors on read
- Future documents won't have the field
- Safe cleanup without migration

### Evidence File

Created: `.sisyphus/evidence/task-1.3-unused-fields.txt`

---

## 2026-02-19: Task 0.1 - Refine + Convex Auth Compatibility Test (Detailed)

### Test Results Summary

**Status**: Partial success - auth bridge works but session persistence has issues

### What Was Tested

1. ✅ Login form using Refine's `useLogin()` hook
2. ✅ Error handling for invalid credentials
3. ✅ AuthProvider bridge pattern connecting Convex Auth to Refine
4. ✅ `currentUser` query deployment to Convex
5. ⚠️ Session persistence after login (timing issue)
6. ❌ Automatic redirect after successful login (blocked by session issue)

### Critical Issue: Session Token Not Recognized

**Error Message**: "No auth provider found matching the given token (no providers configured)"

**Root Cause**: After `signIn` completes, the Convex client attempts to authenticate with the session token, but the server doesn't recognize it. This causes `currentUser` query to return `null` even after successful login.

**Impact**: 
- `isAuthenticated` stays `false` 
- Redirect to protected routes fails
- User remains on login page despite valid session

### Test Files Location

```
admin/src/test-auth/
├── App.tsx           # Main test app with AuthBridge component
├── authProvider.ts   # Refine authProvider bridge implementation
├── LoginPage.tsx     # Login form using useLogin hook
├── TestPage.tsx      # Test page showing useGetIdentity results
└── main.tsx          # Entry point
```

### Schema Fix Required for Deployment

The `industries` table schema was updated to include missing fields:
```typescript
industries: defineTable({
  name: v.string(),
  slug: v.string(),
  // ... existing fields ...
  // Added for migration compatibility:
  challenges: v.optional(v.array(v.string())),
  relatedServices: v.optional(v.array(v.string())),
  solutions: v.optional(v.array(v.string())),
  meta_title: v.optional(v.string()),
  meta_description: v.optional(v.string()),
})
```

### Evidence

Screenshot: `.sisyphus/evidence/task-0.1-auth-test.png`

### Next Steps for Auth Integration

1. Investigate @convex-dev/auth server-side configuration
2. Check if additional auth provider setup is needed in convex/auth.ts
3. Consider using Convex's built-in `Authenticated` component for UI state
4. Test with fresh Convex deployment to isolate environment issues

### Useful Commands

```bash
# Deploy to production
npx convex deploy -y --typecheck=disable

# Create test user via auth:store
npx convex run auth:store '{"args": {"type": "createAccountFromCredentials", "provider": "password", "account": {"id": "test@example.com", "secret": "password123"}, "profile": {"email": "test@example.com", "name": "Test User"}}}' --prod

# Promote user to admin
npx convex run admin_utils:promoteToAdminByEmail '{"email": "test@example.com"}' --prod

# Check deployed functions
npx convex function-spec
```

---

## 2026-02-19: Task 1.5 - Wave 1 Schema Migration

### Chicken-and-Egg Migration Pattern

When removing fields that exist in production data:

1. **Problem**: Convex validates schema against existing documents
2. **Block**: Schema with removed fields fails validation
3. **Block**: Migration can't deploy because schema is invalid
4. **Solution**: 
   - Temporarily keep legacy fields in schema
   - Deploy functions with migration
   - Run migration to clean up data
   - Remove legacy fields from schema
   - Redeploy

### Migration File Pattern

Created `convex/migrations.ts` with this structure:

```typescript
import { internalMutation } from './_generated/server';

export const removeLegacyFields = internalMutation({
  handler: async (ctx) => {
    const items = await ctx.db.query('table').collect();
    for (const item of items) {
      const doc = item as Record<string, unknown>;
      const updates: Record<string, undefined> = {};
      
      if ('legacyField' in doc && doc.legacyField !== undefined) {
        updates.legacyField = undefined;
      }
      
      if (Object.keys(updates).length > 0) {
        await ctx.db.patch(item._id, updates);
      }
    }
  },
});
```

### Type Assertion Workaround

When patching with legacy fields not in generated types:

```typescript
// Cast to Record<string, unknown> for existence checks
const doc = item as Record<string, unknown>;

// Use Record<string, undefined> for patch values
const updates: Record<string, undefined> = { legacyField: undefined };
await ctx.db.patch(item._id, updates);  // TypeScript accepts this
```

### Soft Delete Field Addition

Adding `is_active: v.optional(v.boolean())` is safe:
- No data migration needed (field is optional)
- Existing documents have `undefined` which is valid
- Queries should check `is_active !== false` to include undefined

### Evidence File

Created: `.sisyphus/evidence/task-1.5-migration.txt`


---

## 2026-02-19: Task 2.1 - Refine + shadcn/ui Dependencies

### Refine Packages (Wave 0 Already Installed)

- `@refinedev/core`: ^5.0.9
- `@refinedev/react-router`: ^2.0.3
- Only `@refinedev/inferencer` needed to be added

### shadcn/ui Installation

Non-interactive init command:
```bash
npx shadcn@latest init -d -y
```

This creates:
- `components.json` - shadcn configuration
- `src/lib/utils.ts` - `cn()` helper for className merging
- Updates `tailwind.config.js` with CSS variable colors
- Adds CSS variables to `src/index.css` (light + dark themes)

### shadcn Dependencies Added

- `@radix-ui/react-slot` - for `asChild` prop pattern
- `class-variance-authority` - variant-based styling
- `clsx` + `tailwind-merge` - combined via `cn()` helper
- `tailwindcss-animate` - animation plugin for tailwind

### Tailwind Configuration Changes

shadcn adds:
- `darkMode: ['class']`
- HSL color variables: `--background`, `--foreground`, `--card`, etc.
- Border radius variables: `--radius`, `lg`, `md`, `sm`
- Plugin: `tailwindcss-animate`

### Button Component Location

```
admin/src/components/ui/button.tsx
```

Exports:
- `Button` - component
- `buttonVariants` - for custom styling
- `ButtonProps` - TypeScript interface

### Evidence File

Created: `.sisyphus/evidence/task-2.1-deps-install.txt`

