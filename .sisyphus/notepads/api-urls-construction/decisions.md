# Decisions - API URLs Construction Plan

## [2026-02-17] Initial Decisions

### Architecture Decisions

1. **Convex Direct (not REST)**: Use Convex functions directly, no /api/ endpoints
2. **Reuse ConvexLeadForm**: The existing component pattern from /cotizar and /contacto
3. **Keep Admin UI**: Preserve existing layout, just swap mock data for real Convex data
4. **UTMs in Schema**: Already supported, just need to capture from URL params

### Scope Decisions

1. **No new auth system**: Keep simple cookie-based admin auth
2. **No CSV export changes**: Keep existing functionality
3. **No schema changes**: Schema already supports all required fields
