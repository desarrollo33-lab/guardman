# Route every card widget through four declared density tiers

Status: draft
Audited surface: GuardMan public marketing site (`src/styles/components.css`, `public/styles/site.css`, `src/styles/design-tokens.css`)
Commit at audit: d8e49b1

## Change

Cards stop carrying hand-written padding and radius values. Four named tiers — compact,
standard, feature and panel — are declared in the token file, every existing card widget is
assigned to exactly one of them, and the dead card definitions in `site.css` are deleted. The
tier a card belongs to does not change: nothing is promoted or demoted, and no card changes
its role. What changes is that padding and radius stop being decided per widget.

**This makes cards marginally larger, not smaller.** Six values below 16px and four values
between 20px and 28px snap upward onto the token scale. If the goal is to make cards feel
smaller on desktop, this plan is the wrong instrument — see the section-padding finding in
the audit that produced it, which is where the vertical space actually goes.

## Why this is correct

- **Contract** — `src/styles/design-tokens.css:64-74` defines `--gm-space-*` as 4, 8, 16, 24,
  32, 48, 64, 80, 96; `:53-61` defines `--gm-radius-*` as 4, 8, 12, 16, 24, full.
  `src/styles/components.css:2-3` states the public component layer "Uses CSS custom
  properties everywhere", and `:1620-1624` states the v5.2 section "Token-driven, reusable
  across every page". Padding and radius are therefore token-owned properties of this file.
- **Runtime** — 42 card-classed rules across `src/styles/components.css` and
  `public/styles/site.css` declare a padding. 22 of them use values that exist nowhere in the
  scale: 10, 12, 14, 18, 20, 28, 40, 60. Six more declare a radius off the scale: 6px
  (`.legal-section-num`), 10px (`.trust-item`, `.cert-icon`, `.cluster-card-icon`,
  `.derecho-card-icon`), 14px (`.step-icon`, `.compromiso-icon`) and 20px (`.lead-cta-card`).
  One class carries two different paddings on two routes: `.zone-card` resolves to
  `padding: 20px` on `/ubicaciones/` via `.zones-grid .zone-card` in the Astro bundle, and to
  `padding: 14px 16px` on `/` via `public/styles/site.css:272`, because the two rules exist
  to serve two different themes and the density difference was inherited rather than chosen.
- **Consequence** — after this change, `grep` for a `padding:` value in a card rule returns
  only `--gm-space-*` references, and a `border-radius:` returns only `--gm-radius-*`. A card
  added later picks a tier by name instead of by guessing a number.

## Files

| File | Change |
| --- | --- |
| `src/styles/design-tokens.css` | After the `--gm-glass-surface-raised` declaration at the end of the first `:root` block, add a `/* Card density tiers */` sub-section declaring `--gm-card-pad-compact: var(--gm-space-md)` (16px), `--gm-card-pad-standard: var(--gm-space-lg)` (24px), `--gm-card-pad-feature: var(--gm-space-xl)` (32px), `--gm-card-pad-panel: var(--gm-space-3xl)` (64px), and matching `--gm-card-radius-compact: var(--gm-radius-md)`, `--gm-card-radius-standard: var(--gm-radius-lg)`, `--gm-card-radius-feature: var(--gm-radius-xl)`, `--gm-card-radius-panel: var(--gm-radius-2xl)`. Add a comment naming each tier and listing its members. Change nothing else. |
| `src/styles/components.css` | Replace the `padding` and `border-radius` declarations of every card rule listed under Assignment with the tier tokens for that card. Change no other declaration in those rules. |
| `public/styles/site.css:272` | In `.zone-card`, replace `padding:14px 16px` with `var(--gm-card-pad-compact)`. Leave the `background`, `border`, `border-radius` and `color` declarations untouched — those exist to serve the dark coverage island and are correct for it. |
| `public/styles/site.css` | Delete the four card definitions that never render: `.dif-card`, `.valor-card`, `.value-card`, `.diff-card` (plus `.diff-card-icon`). Confirmed zero occurrences in any `.astro` file. Leave `.staff-block` alone — see Out of scope. |
| `public/styles/site.css` | Replace `border-radius:999px` with `var(--gm-radius-full)` in the seven pill rules listed under Assignment. |

## Reuse

- **Token** — `--gm-space-md` / `--gm-space-lg` / `--gm-space-xl` / `--gm-space-3xl`, defined
  at `src/styles/design-tokens.css:67,68,69,71`
- **Token** — `--gm-radius-md` / `--gm-radius-lg` / `--gm-radius-xl` / `--gm-radius-2xl`,
  defined at `src/styles/design-tokens.css:56,58,59,60`; `--gm-radius-full` at `:60`
- **Exemplar** — the `:root` token sub-section pattern already used at
  `src/styles/design-tokens.css:14-15` (`/* Accent / Interactive */`) and `:41`
  (`/* Dark page surfaces */`), which the new tier block should match

## Assignment

Padding first, then radius, only where the card declares one.

**compact — `var(--gm-card-pad-compact)` (16px) / `var(--gm-card-radius-compact)` (8px)**

| Selector | File:line | padding today |
| --- | --- | --- |
| `.trust-item` | `components.css:194` | `12px 14px` |
| `.detail-feature-item` | `components.css:1380` | `12px 16px` |
| `.detail-issue-card` | `components.css:1386` | `14px 16px` |
| `.service-link-block` | `components.css:1403` | `12px 14px` |
| `.cluster-card` | `components.css:597-608` | `18px 20px` |
| `.derecho-card` | `components.css:1142` | `18px` |
| `.contacto-card` | `components.css:1175` | `18px` |
| `.issue-card` | `site.css:133` | `14px 16px` |
| `.zone-card` | `site.css:272` | `14px 16px` |
| `.cert-item` | `components.css:299` | `16px` (already) |
| `.feature-item` | `site.css:127` | `16px` (already) |
| `.trust-item` radius | `components.css:194` | `10px` → 8px |
| `.cert-icon` radius | `components.css:308` | `10px` → 8px |
| `.cluster-card-icon` radius | `components.css:619` | `10px` → 8px |
| `.derecho-card-icon` radius | `components.css:1150` | `10px` → 8px |

**standard — `var(--gm-card-pad-standard)` (24px) / `var(--gm-card-radius-standard)` (12px)**

| Selector | File:line | padding today |
| --- | --- | --- |
| `.problem-card` | `components.css:874` | `20px` |
| `.location-card-hub` | `components.css:1313` | `20px 24px` |
| `.zones-grid .zone-card` | `components.css:1322` | `20px` |
| `.why-card-hub` | `components.css:1337` | `28px 24px` |
| `.card-body` | `site.css` | `20px` |
| `.feature-tile` | `site.css:255` | `20px` |
| `.why-card` | `components.css:837` | `24px` (already) |
| `.feature-card` | `components.css:868` | `24px` (already) |
| `.related-card-block` | `components.css:1438` | `24px` (already) |
| `.sector-feature` | `components.css:1331` | `24px` (already) |

**feature — `var(--gm-card-pad-feature)` (32px) / `var(--gm-card-radius-feature)` (16px)**

| Selector | File:line | padding today |
| --- | --- | --- |
| `.testimonial-card` | `components.css:336-342` | `28px` |
| `.compromiso-card` | `components.css:1466-1471` | `28px` |
| `.step-card` | `components.css:468-475` | `32px 24px` |
| `.how-step` | `components.css:1494-1500` | `32px 24px` |
| `.step-icon` radius | `components.css:498-506` | `14px` → 16px |
| `.compromiso-icon` radius | `components.css:1476-1480` | `14px` → 16px |
| `.legal-section-num` radius | `components.css:1045-1053` | `6px` → 8px |
| `.block` | `components.css:1373` | `32px` (already) |
| `.estado-card` | `components.css:1552-1558` | `32px` (already) |
| `.legal-section` | `components.css:1030-1036` | `32px` (already) |
| `.legal-faq` | `components.css:1220-1225` | `32px` (already) |

**panel — `var(--gm-card-pad-panel)` (64px) / `var(--gm-card-radius-panel)` (24px)**

| Selector | File:line | padding today |
| --- | --- | --- |
| `.lead-cta-card` | `components.css:168-180` | `40px` |
| `.lead-cta-card` radius | `components.css:170` | `20px` → 24px |
| `.form-card` | `site.css` | `40px` |
| `.not-found-card` | `components.css:895` | `60px 40px` |

**pill radius — `var(--gm-radius-full)`**

`.footer-cert .cert-badge` (`components.css:48`), `.step-cta` (`:521`), `.cluster-see-all`
(`:669`), `.optional-tag` (`:722`), `.radio-pill` (`:749`), `.how-step-sla` (`:1511`),
`.estado-pill` (`:1564`). All currently `999px`; the token is `9999px`. Visually identical,
because both exceed the widest corner.

## Affected surfaces

Every route that renders a card. The tiers reach `src/components/LeadCTA.astro`,
`TrustSignals.astro`, `HowItWorks.astro`, `RelatedLinks.astro`, and the card blocks inside
`/`, `/servicios/**`, `/ubicaciones/**`, `/sectores/**`, `/soluciones/**`, `/guias/**`,
`/seguridad-privada/**`, `/contacto/`, `/canal-de-denuncias/**`, `/privacidad/`, `/terminos/`
and the 404.

Breakpoints: the compact and standard tiers change the only mobile-specific override —
`.lead-cta-card` at `components.css:262` drops to `padding: 28px 20px` under
`max-width: 768px`; update it to the panel token or to
`var(--gm-card-pad-feature) var(--gm-card-pad-compact)` so it stays on the scale.

Theme variants: light and dark. The `body.dark-page` card rules at
`components.css:868` and `:874` are in the assignment table and must not be dropped when
replacing only the light declarations.

## Acceptance

- [ ] No card rule in `src/styles/components.css` or `public/styles/site.css` declares a
      literal `padding:` or `border-radius:` for padding/radius; every one resolves to a
      `--gm-card-*` or `--gm-space-*` / `--gm-radius-*` token.
- [ ] `var(--gm-card-pad-compact)` and the other seven tier tokens are declared exactly once
      in `src/styles/design-tokens.css` and each has at least one consumer.
- [ ] `.zone-card` declares one padding. On `/` and on `/ubicaciones/` it renders at
      `var(--gm-card-pad-compact)` — 16px, not 14px 16px on one route and 20px on the other.
- [ ] `.dif-card`, `.valor-card`, `.value-card`, `.diff-card` and `.diff-card-icon` no longer
      exist in `public/styles/site.css`, and no page loses a rendered element: the classes had
      zero occurrences in any `.astro` file.
- [ ] `border-radius: 999px` no longer appears in `src/styles/components.css`; the seven pill
      rules resolve to `var(--gm-radius-full)`.
- [ ] `public/styles/site.css:272` keeps its `background`, `border`, `border-radius` and
      `color` declarations. Only the `padding` value changes.
- [ ] At 1440px, no page shows a card whose content is clipped or whose grid reflows to a
      different column count than before, caused by the +4px padding on the standard and
      feature tiers. The `.services-grid` and `.cluster-grid` `minmax()` values are not changed
      by this plan; if a grid does reflow, that is the signal that the padding increase is too
      large for that grid and the affected card should drop to the compact tier.

## Out of scope

- `public/styles/site.css:163` `.sidebar-sticky` still carries a background, radius and
  padding of its own, wrapping two already-tiled cards. The nested-surface problem is real but
  its correction is a layout change, not a density normalisation.
- `.staff-block` (`site.css`) has zero occurrences in any `.astro` file and looks dead, but
  `StaffSection.astro` exists and may reference it through a different class name. Verify
  before deleting; it is not listed in the Files table for that reason.
- `.related-card` in `public/styles/site.css` renders zero elements — every occurrence of the
  string in production HTML is `related-card-block`. It is dead and is a candidate for
  deletion, but it was not verified in a build, so it is not in the Files table.
- Grid `minmax()` floor values (`300px` in `.services-grid`, `260px` in `.cluster-grid`,
  `220px` in `.why-grid`). These determine how many cards sit per row and are a bigger lever
  on perceived density than padding. Changing them alters column counts, which is a layout
  decision, not a token conformance one.
- Section vertical padding. Six section rules sit at 80px against the system's own documented
  default of 64px, and that is where the desktop scroll actually comes from. It is a separate
  change and is not touched here.
- The 11 translucent-white surface fills below 0.2 alpha. Dark surface elevation, not density.

## Documentation

None. If a `DESIGN.md` is ever created, the four tier names and their member lists belong in
it; until then the comment added to `src/styles/design-tokens.css` is the only place this
mapping is described.
