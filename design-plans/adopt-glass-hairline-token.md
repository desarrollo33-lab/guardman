# Route every translucent-white hairline border to `--gm-border-light`

Status: applied  (2026-10-02, sobre commit bdac5fe)
Audited surface: GuardMan public marketing site (`public/styles/site.css`, `public/styles/dark.css`)
Commit at audit: bdac5fe

## Change

Twelve hairline borders on dark surfaces across the public site — the header, the header
dropdown, the breadcrumb, the footer, the feature and problem cards, the FAQ and the CTA band
— stop carrying a hand-copied `rgba(255, 255, 255, 0.06)` and read the value from the design
token that already declares it. Nothing about how the site renders changes; what changes is
that the translucent hairline has exactly one owner, so a future edit to that value reaches
all twelve borders at once.

## Why this is correct

- **Contract** — `src/styles/design-tokens.css:39` declares `--gm-border-light: rgba(255, 255, 255, 0.06)`,
  the only translucent surface token in the file that names itself "Single source of truth"
  (`src/styles/design-tokens.css:2`). The variable sits in the first `:root` block
  (`src/styles/design-tokens.css:7-50`) and is deliberately not overridden by the
  `[data-theme="dark"]` block (`src/styles/design-tokens.css:186-205`), so it holds the same
  value on every page. `src/styles/components.css:3` states that the public component layer
  "Uses CSS custom properties everywhere".
- **Runtime** — `--gm-border-light` currently has zero consumers across
  `public/styles/site.css`, `public/styles/dark.css` and `src/styles/components.css`. In its
  place, the literal `rgba(255,255,255,.06)` is hand-written 16 times: 12 in
  `public/styles/dark.css` and 4 in `public/styles/site.css`. `dark.css` is linked by
  `src/layouts/BaseLayout.astro:333` only when a page passes `loadDarkCss` — `/guard-pod/`,
  `/ajax-systems/` and `/nosotros/`. `site.css` is linked by every public page
  (`src/layouts/BaseLayout.astro:327`).
- **Consequence** — because the token value and every literal are the same
  `rgba(255, 255, 255, 0.06)`, this change produces no pixel difference on any page. The
  observable result is structural: `grep -c 'rgba(255, *255, *255, *\.06)'` in the public CSS
  drops to zero for border declarations, and `--gm-border-light` gains twelve consumers.

## Files

| File | Change |
| --- | --- |
| `public/styles/dark.css:9` | `.header-dark` border-bottom: replace the literal with `var(--gm-border-light)`. Touch only the `border-bottom` declaration. |
| `public/styles/dark.css:13` | `[data-od-id="header"] .dropdown-menu` `border`: replace the literal with `var(--gm-border-light)`. |
| `public/styles/dark.css:23` | `[data-od-id="breadcrumb"]` `border-bottom`: replace the literal with `var(--gm-border-light)`. |
| `public/styles/dark.css:38` | `.feature-card` `border`: replace the literal with `var(--gm-border-light)`. |
| `public/styles/dark.css:44` | `.problem-card` `border`: replace the literal with `var(--gm-border-light)`. |
| `public/styles/dark.css:47` | `.faq details` `border`: replace the literal with `var(--gm-border-light)`. See the dead-declaration note in Acceptance. |
| `public/styles/dark.css:51` | `.split-image` `border`: replace the literal with `var(--gm-border-light)`. See the dead-declaration note in Acceptance. |
| `public/styles/dark.css:98` | `.cta-band` `border-top` and `border-bottom`: replace both literals with `var(--gm-border-light)`. |
| `public/styles/dark.css:101` | `[data-od-id="footer"]` `border-top`: replace the literal with `var(--gm-border-light)`. |
| `public/styles/dark.css:103` | `.footer-bottom` `border-top-color`: replace the literal with `var(--gm-border-light)`. |
| `public/styles/site.css:63` | `.header-dark` `border-bottom`: replace the literal with `var(--gm-border-light)`. |

## Reuse

- **Token** — `--gm-border-light`, defined at `src/styles/design-tokens.css:39` (value `rgba(255, 255, 255, 0.06)`)

## Affected surfaces

`public/styles/dark.css` — loaded only by `src/layouts/BaseLayout.astro:333` when
`loadDarkCss` is true, i.e. `/guard-pod/` (`src/pages/guard-pod.astro:77`),
`/ajax-systems/` (`src/pages/ajax-systems.astro:45`) and `/nosotros/`
(`src/pages/nosotros.astro:55`). Selectors touched: `[data-od-id="header"]`, header
`.dropdown-menu`, `[data-od-id="breadcrumb"]`, `.feature-card`, `.problem-card`, `.faq
details`, `.split-image`, `.cta-band`, `[data-od-id="footer"]`, `.footer-bottom`.

`public/styles/site.css:63` — `.header-dark`, loaded on every public page, applied by
`src/components/Header.astro:13` whenever the page theme is `dark`.

Breakpoints: none of the touched declarations sit inside a media query.

Theme variants: dark only. No light-theme rule uses `rgba(255,255,255,.06)` as a border.

## Acceptance

- [ ] `--gm-border-light` has at least twelve consumers across `public/styles/` and
      `src/styles/`.
- [ ] No border, `border-top`, `border-bottom` or `border-top-color` declaration in
      `public/styles/site.css` or `public/styles/dark.css` still contains the literal
      `rgba(255,255,255,.06)`.
- [ ] Screenshot-diff the header, breadcrumb, footer, feature card and CTA band on
      `/nosotros/` at 1440px before and after: no pixel difference.
- [ ] Confirmed dead declarations, changed deliberately: `public/styles/dark.css:47` and
      `public/styles/dark.css:51` are shadowed by later `!important` duplicates at
      `public/styles/dark.css:91` (`.faq details` border `rgba(255,255,255,.1)`) and
      `public/styles/dark.css:77` (`.split-image` border `rgba(255,255,255,.1)`). Replacing
      the literal in the earlier rule therefore produces no visible change. Confirm this is
      still true after the edit rather than assuming it.
- [ ] The four `background` declarations that use the same literal are untouched: verify
      `public/styles/dark.css:19`, `public/styles/site.css:100`, `public/styles/site.css:255`
      and `public/styles/site.css:272` still read `rgba(255, 255, 255, 0.06)` and not
      `var(--gm-border-light)`.

## Out of scope

- The four `background` declarations at `public/styles/dark.css:19`,
  `public/styles/site.css:100`, `public/styles/site.css:255` and `public/styles/site.css:272`
  use the same value as a translucent surface fill, not a hairline. No token expresses that
  role: `--gm-accent-soft` at `src/styles/design-tokens.css:17` is accent-tinted, and
  `--gm-dark-surface-0` through `--gm-dark-surface-3`
  (`src/styles/design-tokens.css:43-46`) are opaque and would change the rendering. Naming a
  fill token requires deciding which of the eleven translucent-white alphas in use is
  canonical. Deliberately excluded.
- `public/styles/dark.css` declares 24 selectors that `src/styles/components.css` also owns,
  using 275 `!important`. Consolidating that overlap is a separate change.
- `public/styles/dark.css` contradicts itself on five selector pairs — `.faq details` (line
  47 vs 91), `.split-image` (line 51 vs 77), `.hero-product` (line 33 vs 87), `.split-text p`
  (line 50 vs 76) and `.why-card p` (line 55 vs 110) — where the later declaration silently
  wins. Removing the dead earlier declarations would change what renders if the later values
  are ever deleted. Deliberately excluded.
- The eleven translucent-white alphas below 0.2 (`.015 .02 .025 .03 .04 .05 .06 .08 .1 .15
  .18`) that form the dark surface elevation band. Tokenizing them means choosing canonical
  values, which is a design decision, not a normalization.
- `backdrop-filter` rules and the dark glass fills. Those are the subject of a separate plan
  and share lines with two entries in the Files table above; only the border declarations
  listed here may be edited by this change.

## Documentation

None. No design-documentation change was accepted for this finding.
