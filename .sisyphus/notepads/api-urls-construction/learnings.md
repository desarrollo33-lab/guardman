# Learnings - API URLs Construction Plan

## [2026-02-17] Session Started

### Project Context

- Tech Stack: Astro + React + Convex + Tailwind CSS
- Convex Direct: No REST API, use Convex functions directly
- Convex already has 6 functions for leads:
  - createLead, getLeads, getLeadsByStatus, getLeadById, getLeadsCount, updateLeadStatus
- Schema has UTM fields: utm_source, utm_medium, utm_campaign
- Admin uses simple cookie auth (PUBLIC_ADMIN_PASSWORD)

### Key Patterns

- ConvexLeadForm wrapper provides Convex context: `<ConvexLeadForm client:load source="pagename" />`
- Already working at /cotizar and /contacto
- Homepage form is broken - POST to /api/leads which doesn't exist

### Conventions

- Use `client:load` directive for React hydration
- Follow existing styling (Tailwind classes)
- Keep existing pagination/filtering JS in admin

## [2026-02-17] Task 4: Admin Leads List Connected to Convex

### Pattern: ConvexProvider Wrapper for Admin Components

When connecting React components to Convex in Astro pages:

1. Create main component (e.g., `LeadsList.tsx`) with Convex hooks
2. Create wrapper component (e.g., `ConvexLeadsList.tsx`) that provides ConvexProvider
3. Import in Astro without file extension: `import ConvexLeadsList from '../../components/admin/ConvexLeadsList'`
4. Use `client:load` directive for hydration

### Convex Query Pattern

```typescript
const leadsResult = useQuery(api.leads.getLeads, { limit: 1000 });
const allLeads = leadsResult?.page ?? [];

// Loading state check
if (leadsResult === undefined) {
  return <LoadingUI />;
}
```

### Client-side Filtering

For admin lists with filtering, fetch all data and filter in client:

- Use `useMemo` for filtered results
- Keep all existing functionality (pagination, filters, export)
- Row clicks can navigate to detail pages

## [2026-02-17] Task 5&6: Admin Lead Detail Page with Status Update

### Dynamic Route Pattern in Astro

For dynamic routes like `/admin/leads/[id]`:

```astro
---
const { id } = Astro.params;
---

<ConvexLeadDetail client:load leadId={id} />
```

### Type-Only Imports for Convex Generated Types

The `_generated/dataModel` only has `.d.ts` (no runtime JS). Use `import type`:

```typescript
import type { Id } from '../../../convex/_generated/dataModel';
```

This prevents Vite from looking for a JS file that doesn't exist.

### Status Update Pattern with Optimistic Feedback

```typescript
const updateStatus = useMutation(api.leads.updateLeadStatus);
const [isUpdating, setIsUpdating] = useState(false);
const [updateSuccess, setUpdateSuccess] = useState(false);

const handleStatusChange = async (newStatus: string) => {
  setIsUpdating(true);
  try {
    await updateStatus({ leadId, status: newStatus });
    setUpdateSuccess(true);
    setTimeout(() => setUpdateSuccess(false), 2000);
  } finally {
    setIsUpdating(false);
  }
};
```

### Lead Detail UI Structure

- Back link at top
- Header card with nombre + status dropdown (inline editing)
- Two-column grid for contact info and service info
- Mensaje section (if present)
- UTM tags section (if any UTMs present)
- Quick action buttons (Call, Email, WhatsApp)
