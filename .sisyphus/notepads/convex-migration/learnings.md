# Convex Migration Learnings

## 2026-02-17: Services Migration

### Schema Patterns

- Use `defineTable()` with `v.string()`, `v.array(v.string())` for field definitions
- Add indexes with `.index("by_field", ["field"])` for frequently queried fields
- Slug-based indexes are essential for SEO-friendly queries

### Convex File Structure

- `convex/schema.ts` - table definitions with indexes
- `convex/services.ts` - queries and mutations for services table
- Import from `./_generated/server` for query/mutation functions
- Import `v` from `convex/values` for validators

### Idempotent Seed Pattern

```typescript
export const seedServices = mutation({
  handler: async (ctx) => {
    for (const data of SEED_DATA) {
      const existing = await ctx.db
        .query('table')
        .withIndex('by_slug', (q) => q.eq('slug', data.slug))
        .first();

      if (!existing) {
        await ctx.db.insert('table', data);
      }
    }
  },
});
```

### Query Patterns

- `getAllServices`: Simple `ctx.db.query("services").collect()`
- `getBySlug`: Use index with `withIndex("by_slug", (q) => q.eq("slug", args.slug)).first()`
- `getByArrayContains`: No direct array index - filter in-memory after collect()

### Service Data Structure

```typescript
interface Service {
  id: string;
  slug: string;
  title: string;
  description: string;
  tagline: string;
  icon: string;
  features: string[];
  benefits: string[];
  cta: string;
  industries: string[];
}
```

## 2026-02-17: API Routes with Convex Node.js Client

### Server-Side Convex Client

For Astro API routes (or any Node.js server-side code), use `ConvexHttpClient` from `convex/browser`:

```typescript
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../convex/_generated/api';

const convexUrl = import.meta.env.PUBLIC_CONVEX_URL;
const convexClient = convexUrl ? new ConvexHttpClient(convexUrl) : null;

// Execute mutation
const leadId = await convexClient.mutation(api.leads.createLead, {
  nombre: body.nombre,
  telefono: body.telefono,
  // ...
});
```

### Key Differences from React Client

- `ConvexHttpClient` is for server-side/non-reactive use cases
- No real-time subscriptions - just one-off queries/mutations/actions
- Methods: `client.query()`, `client.mutation()`, `client.action()`
- Same API function references (`api.leads.createLead`)

### Environment Variables

- Use `PUBLIC_CONVEX_URL` for Convex URL (Astro convention)
- Initialize client outside the request handler for connection reuse

### Error Handling Pattern

```typescript
if (!convexClient) {
  return new Response(
    JSON.stringify({
      success: false,
      error: 'Error de configuración del servidor',
    }),
    { status: 500 }
  );
}
```

### TypeScript Note

The `convex/_generated/api` file is a placeholder until `npx convex dev` is run. TypeScript errors about missing module are expected before Convex generates the real types.

```

```
