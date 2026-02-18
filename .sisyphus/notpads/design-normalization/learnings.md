# Design Normalization Learnings

## 2026-02-17 - LeadForm.tsx Normalization

### Color mappings applied:

- `text-secondary` → `text-gray-900`
- `text-primary` → `text-gray-900`
- `focus:border-primary focus:ring-primary/20` → `focus:border-gray-900 focus:ring-gray-900/20`
- `focus:border-primary focus:ring-4 focus:ring-primary/20` → `focus:border-gray-900 focus:ring-4 focus:ring-gray-900/20` (textarea variant)
- `bg-accent hover:bg-accent-dark` → `bg-gray-900 hover:bg-gray-800`
- `focus:ring-accent/40` → `focus:ring-gray-500`

### Semantic colors preserved (DO NOT CHANGE):

- `bg-success/10`, `text-success`
- `bg-error/5`, `border-error`, `text-error`, `bg-error/10`, `border-error/20`, `focus:ring-error/20`

### Pattern notes:

- Same color classes can appear in different order (e.g., textarea has `focus:ring-4` in middle)
- Use `replaceAll` for bulk replacements, but verify each pattern variant exists
- Always count semantic colors before/after to ensure preservation
