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
