# Audit Remediation - Learnings

## Wave 1 (Critical Blockers)
- Task 1: Fix leads.ts argument mismatch (leadId → id)
- Task 2: Add solutions:getSolutionById query
- Task 3: Add pages CRUD mutations
- Task 4: Add content_blocks CRUD mutations
- Task 5: Fix data provider (depends on 1-4)
- Task 6: Fix web function names
- Task 7: Upgrade convex packages

## Conventions
- All Convex functions should accept `id` parameter, not resource-specific names
- Package versions must match: convex@^1.32.0
- Data provider must use proper API references, not string paths

## Issues Found
- Data provider sends `id` but leads.ts expects `leadId`
- Solutions has getSolutionBySlug but no getSolutionById
- Pages and content_blocks missing CRUD mutations
- web/src uses wrong function names
- Package mismatch: web/admin use ^1.12.0, root uses ^1.32.0
