# Unify the public content rail to a single token-backed width

Status: applied  (2026-10-02, sobre commit bdac5fe)
Audited surface: GuardMan public marketing site (`BaseLayout.astro` + public components + public CSS stack)
Commit at audit: bdac5fe

## Change

Every horizontal band on every public page — the header, the breadcrumb, and all page
sections — sits on one content rail of `1200px` with `24px` side padding, sourced from a
single CSS custom property. At viewports of 1280px and wider, the logo, the breadcrumb text
and the hero headline currently begin at three different horizontal positions; after this
change they begin at the same position. Below 1280px the header and breadcrumb currently
start 8px to the left of page content; after this change they align with it.

## Why this is correct

- **Contract** — `src/styles/design-tokens.css:121` declares `--gm-container: 1200px` inside
  the file that names itself "Single source of truth" (`src/styles/design-tokens.css:2`).
  `src/styles/components.css:1664` then adds `.container--wide { max-width: 1360px; }`, an
  explicit wide escape hatch. An escape hatch is only meaningful if 1200px is the one
  default rail; the repository therefore already declares its intent, and two selectors
  contradict it.
- **Runtime** — `src/layouts/BaseLayout.astro` loads the public CSS in this order: the inline
  `CRITICAL_CSS` `<style>` (2,800 bytes, `src/layouts/BaseLayout.astro:147-171`), then
  `<link href="/styles/site.css">` (`src/layouts/BaseLayout.astro:327`), then the Astro CSS
  bundle as a trailing `<style>` (66,243 bytes) carrying `global.css`, `design-tokens.css`,
  `components.css` and `thanks.css` (`src/layouts/BaseLayout.astro:6-9`). Verified against
  the served HTML of `https://guardman.cl/servicios/`: the 66 KB `<style>` is the last
  element in `<head>`. At equal specificity the last declaration wins, so:
  - `.container` resolves to `src/styles/components.css:1661` →
    `max-width: var(--gm-container)` (1200px), `padding: 0 24px`. The 1280px/16px values at
    `src/layouts/BaseLayout.astro:150` and `public/styles/site.css:38` never apply.
  - `.header-inner` is declared only at `public/styles/site.css:49` as
    `max-width: 1280px; padding: 0 16px`. Confirmed absent from the Astro bundle.
  - `.breadcrumb-inner` resolves to `src/styles/components.css:125-127` as
    `max-width: 1280px; padding: 0 16px`.
- **Consequence** — at any viewport of 1280px or wider, header content starts at
  `(100vw − 1280)/2 + 16` while page content starts at `(100vw − 1200)/2 + 24`; the
  difference is a constant 48px, so the logo, the breadcrumb and the hero headline all begin
  48px left of the rest of the page. Below 1280px both rails are fluid and only the padding
  differs, producing an 8px step. A reviewer can confirm the fix by comparing the left edge
  of the header logo, the breadcrumb and a hero heading at 1440px.

## Files

| File | Change |
| --- | --- |
| `public/styles/site.css:49` | In `.header-inner`, replace `max-width:1280px` with `max-width:var(--gm-container)` and `padding:0 16px` with `padding:0 24px`. Leave every other declaration in the rule untouched. |
| `src/styles/components.css:126-127` | In `.breadcrumb-inner`, replace `max-width: 1280px` with `max-width: var(--gm-container)` and `padding: 0 16px` with `padding: 0 24px`. Leave every other declaration in the rule untouched. |
| `src/layouts/BaseLayout.astro:150` | In the inline `CRITICAL_CSS` string, change the `.container` rule from `max-width:1280px` to `max-width:1200px` and `padding:0 16px` to `padding:0 24px`. |
| `src/layouts/BaseLayout.astro:152` | In the inline `CRITICAL_CSS` string, change the `.header-inner` rule from `max-width:1280px` to `max-width:1200px` and `padding:0 16px` to `padding:0 24px`. |
| `src/layouts/BaseLayout.astro:154-156` | The critical-CSS `.container`, `.header-inner` and `.logo-img` rules become consistent with the token-driven rules they pre-paint. No value change beyond the rail; leave the rest of the string byte-identical. |
| `public/styles/site.css:38` | Delete the `.container{max-width:1280px;margin:0 auto;padding:0 16px}` rule. It is overridden by `src/styles/components.css:1661` and exists only to contradict it. |
| `public/styles/site.css:70` | Delete only the `max-width:1280px` and the `margin-left:0;margin-right:auto` declarations from `.breadcrumb-inner`. The remaining declarations in that rule are already superseded by `src/styles/components.css:125-134`; verify each against that rule before removing it and keep any declaration that rule does not set. |

## Reuse

- **Token** — `--gm-container`, defined at `src/styles/design-tokens.css:121` (value `1200px`)
- **Exemplar** — `.container` at `src/styles/components.css:1661`, the existing token-driven rail declaration to copy
- **Exemplar** — `--gm-container-narrow` at `src/styles/design-tokens.css:122` and `.container--narrow` at `src/styles/components.css:1663`, the existing narrow-rail pairing

## Affected surfaces

Header (`src/components/Header.astro:21` renders `.header-inner`; reached by every public
route through `src/layouts/BaseLayout.astro:355`).

Breadcrumb (`src/layouts/BaseLayout.astro:357-365` renders `.breadcrumb-inner` only when a
page passes the `breadcrumb` prop): `/` (`src/pages/index.astro`), `/servicios/`,
`/servicios/[service]/`, `/servicios/[service]/[location]/`, `/ubicaciones/`,
`/ubicaciones/[slug]/`, `/sectores/`, `/sectores/[slug]/`, `/soluciones/`,
`/soluciones/[slug]/`, `/guias/`, `/guias/[slug]/`, `/seguridad-privada/`,
`/seguridad-privada/[slug]/`, `/contacto/`, `/cotizacion/`, `/nosotros/`,
`/canal-de-denuncias/`, `/guard-pod/`, `/ajax-systems/`, `/privacidad/`, `/terminos/`.

`.container` consumers — all 25 non-admin `.astro` pages under `src/pages`. Spot-verified in
production at `/` (11 instances), `/cotizacion/` (8), `/servicios/guardias-de-seguridad/`
(6), `/contacto/` (4), `/privacidad/` (3).

Breakpoints: all. The rail applies from 320px to the maximum width.

Theme variants: light and dark. Dark pages (`/guard-pod/`, `/ajax-systems/`, `/nosotros/`)
render the same header markup with `.header-dark` added at `src/components/Header.astro:13`,
which does not touch width or padding.

## Acceptance

- [ ] At a 1440px viewport, the left edge of the header logo, the first breadcrumb link and a
      hero heading are at the same horizontal position, with no step between them.
- [ ] At a 1440px viewport, `getComputedStyle` on `.container`, `.header-inner` and
      `.breadcrumb-inner` reports `max-width: 1200px` and `padding-left/right: 24px` for all
      three.
- [ ] At a 375px viewport, the header logo and the hero heading have the same left offset.
- [ ] With the network throttled so that `/styles/site.css` has not yet loaded, the first
      paint of the header and hero already uses the 1200px rail — i.e. the inline critical CSS
      at `src/layouts/BaseLayout.astro:150,152` no longer paints 1280px. No horizontal shift
      is recorded between first paint and full stylesheet application.
- [ ] At a 1280px viewport the header navigation does not wrap and the "Cotizar" button is
      fully visible with no horizontal scrollbar. The header content box loses 96px of width
      (from 1248px to 1152px) under this change, so this is the tightest case.
- [ ] No rule anywhere in `public/styles/` or `src/styles/` declares `max-width:1280px`.

## Out of scope

- `public/styles/main.css:12` declares a third `.container` at `1200px`/`20px` padding. That
  file is not linked by any layout — verified across `src/layouts/BaseLayout.astro` and
  `src/layouts/AdminLayout.astro` — so it is dead. Deleting it is a separate cleanup.
- `src/styles/components.css:1664` `.container--wide { max-width: 1360px; }` keeps its literal
  width. It is a deliberate wide variant and is not part of the default-rail conflict.
- `src/styles/components.css:894` `.container-narrow { max-width: 760px }` duplicates the
  `--gm-container-narrow` token value but is a separate class used by the 404 page. It does
  not conflict with the default rail.
- `src/styles/components.css:465` `.steps-grid { max-width: 1100px }` and
  `src/styles/components.css:1652` `.gm-section-header { max-width: 760px }` are deliberate
  measure limits, not rails.
- Padding tokens do not exist. `--gm-space-xl` is `32px` at
  `src/styles/design-tokens.css:70`; there is no `24px` spacing token. The `24px` gutter stays
  a literal, matching `src/styles/components.css:1661`. Introducing a gutter token is a
  separate decision and is not required for this change.
- `src/styles/design-tokens.css:18-20` notes that `--gm-accent-text` is reserved for
  section-label, card-link and step-cta. Nothing in this change touches it.

## Documentation

None. No design-documentation change was accepted for this finding.
