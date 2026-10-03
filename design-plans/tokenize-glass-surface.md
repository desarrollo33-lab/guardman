# Give the frosted header and dropdown one token-owned glass surface

Status: applied  (2026-10-02, sobre commit bdac5fe)
Audited surface: GuardMan public marketing site (`public/styles/site.css`, `public/styles/dark.css`, `src/styles/design-tokens.css`)
Commit at audit: bdac5fe

## Change

The frosted-glass treatment on the site header and the header dropdown — the only real blur
anywhere on the public site — is defined once in the design token file instead of being
hand-written in two legacy stylesheets with two different fill colours. The rendered values
stay exactly as they are: the header keeps a 92%-opaque `#0A1019` fill and the dropdown keeps a
96%-opaque `#0F1729` fill, both behind a 16px blur. What changes is that the blur radius and
both fills each have exactly one owner, so the two files can no longer drift apart.

## Why this is correct

- **Contract** — `src/styles/design-tokens.css:2` declares itself the "Single source of truth"
  for design values, and `src/styles/components.css:3` requires the public layer to use
  custom properties everywhere. No token currently expresses a blur or a glass fill:
  `--gm-border-light` at `src/styles/design-tokens.css:39` is the sole translucent token and it
  is a hairline, not a surface.
- **Runtime** — `backdrop-filter` appears in exactly four rules in the entire public site.
  Three of them are the glass treatment, split across two files that never see each other:
  - `public/styles/site.css:63` — `.header-dark`, `background: rgba(10,16,25,.92)` plus
    `backdrop-filter: blur(16px)`, marked `!important`.
  - `public/styles/dark.css:9` — `[data-od-id="header"]`, the same `rgba(10,16,25,.92)` fill
    and the same 16px blur, plus the `-webkit-` prefixed form.
  - `public/styles/dark.css:13` — `[data-od-id="header"] .dropdown-menu`, a *different* fill,
    `rgba(15,23,41,.96)`, also with a 16px blur.
  The fourth, `public/styles/site.css:377`, is not part of the treatment; see Acceptance.
  `.header-dark` is applied by `src/components/Header.astro:13` on dark pages; `dark.css` is
  linked only by `src/layouts/BaseLayout.astro:333`.
- **Consequence** — no pixel changes on any page. The observable result is that a reviewer can
  change one variable and see the header, the dropdown and any future glass surface respond
  together, and that the 92%/96% fill split is documented in one place instead of being
  implicit in two files.

## Files

| File | Change |
| --- | --- |
| `src/styles/design-tokens.css` | Add three declarations to the existing `:root` block that starts at line 7, directly after `--gm-border-light` at line 39: `--gm-glass-blur: 16px;`, `--gm-glass-surface: rgba(10, 16, 25, 0.92);` and `--gm-glass-surface-raised: rgba(15, 23, 41, 0.96);`. Add a comment recording that `--gm-glass-surface` is `--gm-dark-bg` (`src/styles/design-tokens.css:42`) at 92% and `--gm-glass-surface-raised` is `--gm-dark-surface-3` (`src/styles/design-tokens.css:46`) at 96%. Change nothing else in the file. |
| `public/styles/site.css:63` | `.header-dark`: replace `background:rgba(10,16,25,.92)` with `background:var(--gm-glass-surface)` and `backdrop-filter:blur(16px)` with `backdrop-filter:blur(var(--gm-glass-blur))`. Leave the `!important` markers and the `box-shadow` and `border-bottom` declarations untouched. |
| `public/styles/dark.css:9` | `[data-od-id="header"]`: replace `background:rgba(10,16,25,.92)` with `background:var(--gm-glass-surface)` and both `blur(16px)` occurrences — the `-webkit-` prefixed one and the standard one — with `blur(var(--gm-glass-blur))`. Leave the `!important` markers and the `border-bottom` and `box-shadow` declarations untouched. |
| `public/styles/dark.css:13` | `[data-od-id="header"] .dropdown-menu`: replace `background:rgba(15,23,41,.96)` with `background:var(--gm-glass-surface-raised)` and both `blur(16px)` occurrences with `blur(var(--gm-glass-blur))`. Leave the `!important` markers and the `border` declaration untouched. |

## Reuse

- **Token** — `--gm-dark-bg`, defined at `src/styles/design-tokens.css:42` (value `#0A1019`,
  i.e. `rgb(10,16,25)`); also declared as `--bg-dark` at `public/styles/dark.css:5`. This is
  the colour the header glass fill is built on.
- **Token** — `--gm-dark-surface-3`, defined at `src/styles/design-tokens.css:46` (value
  `#0f1729`, i.e. `rgb(15,23,41)`); currently has no consumer anywhere in the project. This
  is the colour the dropdown glass fill is built on.
- **Token** — `--gm-border-light`, defined at `src/styles/design-tokens.css:39`, already
  applied to the `border-bottom` of these same rules by a separate normalisation change.
- **Exemplar** — the `:root` token block at `src/styles/design-tokens.css:7-50`, and the
  theme-override pattern at `src/styles/design-tokens.css:186-205`, which shows that tokens
  which must not change per theme are declared once in `:root` and left out of the override.

## Affected surfaces

Header — `/guard-pod/`, `/ajax-systems/` and `/nosotros/` via `.header-dark`
(`src/components/Header.astro:13`), plus `[data-od-id="header"]` and its `.dropdown-menu`
(`src/components/Header.astro:33,46,53`) on the same three pages.

Light pages are unaffected: `.header-dark` only renders when `theme === 'dark'`, and
`dark.css` is not linked on light routes.

Breakpoints: none. No touched declaration sits inside a media query.

Theme variants: dark only.

## Acceptance

- [ ] `--gm-glass-blur`, `--gm-glass-surface` and `--gm-glass-surface-raised` are declared
      once in `src/styles/design-tokens.css` and referenced by all three glass rules.
- [ ] No `blur(16px)` literal remains in `public/styles/site.css` or `public/styles/dark.css`
      outside `public/styles/site.css:377`.
- [ ] `public/styles/site.css:377` is byte-identical to its current state:
      `header.site-header:has(nav#nav-links.open){-webkit-backdrop-filter:none!important;backdrop-filter:none!important}`.
      The comment above it at `public/styles/site.css:370-376` records that the header blur
      creates a containing block that collapses the fixed-position `nav.open` panel to zero
      height, which breaks the mobile menu on dark pages. That workaround is a live fix, not
      debt. Do not remove it, do not remove the blur, and do not treat the blur as the bug.
- [ ] Screenshot-diff the header, both dropdowns and the mobile menu on `/guard-pod/` at
      1440px and at 375px before and after: no pixel difference.
- [ ] Open the mobile menu on `/nosotros/` at 375px and confirm the menu panel occupies the
      full viewport height, matching current behaviour.
- [ ] `public/styles/dark.css:9` and `:13` retain their `-webkit-backdrop-filter` prefixed
      declarations. Note that `public/styles/site.css:63` never had the prefix; this change
      does not add or remove it anywhere, it only swaps the radius inside the existing
      declarations.

## Execution note (2026-10-02)

Applied as written, with one deviation. The three glass tokens were appended at the end of
the first `:root` block (after `--gm-dark-fg-dim`) rather than immediately after
`--gm-border-light`. The new comment cites `--gm-dark-bg` and `--gm-dark-surface-3`, which
are declared further down that same block; placing the tokens above them would have made the
comment reference values not yet defined. The net effect is identical to the plan: all three
tokens are declared once, inside the first `:root`, and none is redefined in the
`[data-theme="dark"]` block. The line numbers cited in the Files table shifted accordingly —
`src/styles/design-tokens.css` is now 211 lines, and `public/styles/site.css:63` is now
`public/styles/site.css:62` because plan 1 deleted the dead `.container` rule above it.

## Out of scope

- The containing-block behaviour of `backdrop-filter` that forces the `site.css:377`
  workaround. The real fix is to stop nesting the fixed-position `#nav-links` panel inside the
  blurred `<header>` — that is a markup change to `src/components/Header.astro` with mobile
  navigation implications, not a tokenisation. Deliberately excluded.
- The `-webkit-backdrop-filter` prefix asymmetry between `public/styles/site.css:63` and
  `public/styles/dark.css:9,13`. Normalising it changes what Safari renders and is not
  required by this change.
- The eleven translucent-white alphas below 0.2 used as dark surface fills throughout
  `public/styles/dark.css` and `src/styles/components.css`. These have no blur at all — they
  are flat translucent white, not glass. Tokenizing them is a separate change and requires
  deciding canonical values.
- `public/styles/dark.css` declaring 24 selectors that `src/styles/components.css` also owns
  with 275 `!important`, and contradicting itself on `.faq details`, `.split-image`,
  `.hero-product`, `.split-text p` and `.why-card p`. Separate change.
- Adding glass to any surface that does not have it today. This change tokenizes the two
  surfaces that exist; it does not introduce new ones.
- The `border` / `border-bottom` declarations on the same three rules. Those are owned by the
  separate `--gm-border-light` normalisation. Only the `background` and `backdrop-filter`
  declarations may be edited here.

## Documentation

None. No design-documentation change was accepted for this finding. The token file has no
design documentation of its own, so the inline comment added in
`src/styles/design-tokens.css` is the only place these values are described; if the user
later wants a `DESIGN.md`, this change is one of the ones it should describe.
