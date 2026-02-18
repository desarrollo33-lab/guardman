# Issues - API URLs Construction Plan

## [2026-02-17] Known Issues

### Current State

1. **Homepage form broken**: POST to /api/leads which doesn't exist
2. **Admin uses mock data**: Needs to connect to Convex
3. **UTM capture not implemented**: useEffect empty in LeadForm.tsx
4. **No lead detail page**: Need to create /admin/leads/[id].astro

### Guardrails (Must NOT Do)

- NO REST endpoints (/api/leads, /api/admin/leads)
- NO schema modifications
- NO changes to /cotizar and /contacto (already working)
- NO new auth system
- NO CSV export, email notifications, etc.
