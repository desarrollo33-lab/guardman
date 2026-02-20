# Task 0.2: Basic Data Provider Spike

## Status: COMPLETED

## Created Files

- `admin/src/providers/convexDataProvider.ts` - Convex DataProvider implementation for Refine

## Implementation Details

### DataProvider Interface Implementation

The spike implements the following Refine DataProvider methods:

1. **`getList({ resource, pagination })`** - Returns paginated list of resources
   - Maps resource name to Convex query path (e.g., `services` → `services:getAllServices`)
   - Supports client-side pagination (offset/limit pattern)
   - Returns `{ data: unknown[], total: number }`

2. **`getOne({ resource, id })`** - Returns single resource by ID
   - Requires a `getById` query in each Convex module
   - Maps to query path (e.g., `services:getServiceById`)
   - Returns `{ data: unknown }`

3. **`getApiUrl()`** - Returns Convex deployment URL

4. **Stub methods** (throw errors for spike):
   - `create` - Not implemented
   - `update` - Not implemented  
   - `deleteOne` - Not implemented

5. **Optional `getMany`** - Fetches multiple records by ID

### Resource Mapping

```typescript
const RESOURCE_MAP = {
  services: { listQuery: 'services:getAllServices', getQuery: 'services:getServiceById' },
  leads: { listQuery: 'leads:getAll', getQuery: 'leads:getById' },
  faqs: { listQuery: 'faqs:getAll', getQuery: 'faqs:getById' },
  solutions: { listQuery: 'solutions:getAll', getQuery: 'solutions:getById' },
  communes: { listQuery: 'communes:getAll', getQuery: 'communes:getById' },
};
```

### Usage Pattern

```tsx
import { ConvexReactClient } from 'convex/react';
import { createConvexDataProvider } from './providers/convexDataProvider';

const convexClient = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);
const dataProvider = createConvexDataProvider(convexClient);

// Pass to Refine
<Refine dataProvider={dataProvider} resources={[...]} />
```

## Challenges Identified

### 1. Convex ID Pattern
- Convex uses auto-generated `_id` fields (e.g., `k57f8...`)
- Refine expects string/number IDs
- **Solution**: Pass Convex IDs directly as strings

### 2. Missing getById Queries
- Convex modules don't have standard `getById` queries
- `services.ts` only has `getBySlug`, not `getById`
- **Required**: Add `getById` queries to each Convex module

### 3. Type Safety
- Using dynamic query paths (`@ts-expect-error`) for spike
- **Production**: Import from `convex/_generated/api` for type safety

### 4. Pagination Differences
- Refine uses offset/limit pagination
- Convex uses cursor-based pagination
- **Current**: Client-side pagination for spike
- **Production**: Implement server-side cursor pagination

## Required Follow-up

Before production use, the following Convex queries need to be added:

```typescript
// In convex/services.ts
export const getServiceById = query({
  args: { id: v.id("services") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Similar for leads, faqs, solutions, communes, etc.
```

## Verification

- [x] File created: `admin/src/providers/convexDataProvider.ts`
- [x] `getList({ resource: "services" })` pattern defined
- [x] `getOne({ resource: "services", id })` pattern defined
- [x] TypeScript compiles without errors (`npx tsc --noEmit --skipLibCheck`)
- [x] Evidence saved to `.sisyphus/evidence/task-0.2-dataprovider.md`

## Notes

- Refine (`@refinedev/core`) is NOT yet installed - this is expected for spike
- Data provider will work once Refine is installed and getById queries are added
- Factory pattern allows sharing a single ConvexReactClient instance
