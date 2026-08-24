# Changelog - GuardMan Chile

Todas las versiones relevantes del proyecto. Formato basado en [Keep a Changelog](https://keepachangelog.com/).

## [0.1.0] - 2026-08-24

### Reset a master baseline
Estado de código al cierre de la sesión 2026-08-24 congelado como baseline oficial. Repo en estado "recién creado pero con código maduro":

- **PWA eliminada** (manifest + iOS install hints) — sin Service Worker, sin manifest, alineado con regla cross-project de no usar SW/PWA en landings agencia.
- **Cuestionario Guardpod arreglado** — bug crítico de closure stale de React: `saveOne` capturaba `drafts` del render anterior, perdiendo 1 char por save. Fix: `draftsRef` (useRef) como source-of-truth síncrono. Regression test e2e Playwright incluido.
- **Copy corregido** — eliminadas 17 referencias a "cámaras PTZ" (las cámaras de Guardpod no son PTZ). Reemplazo por "cámaras 360°" en 6 archivos.
- **Histórico purged** — trashed a `.backups/reset-2026-08-24/`: `AUDITORIA_*`, `AUDITORA_FORENSE`, `PLAN_DE_TRABAJO`, `PROMPT_CA`, `STATUS` (versión vieja), `docs/auditoria/*`, `docs/compose/*`, `docs/*.tar.gz`, `.superdesign/`. `CHANGELOG` compactado a esta única entry.
- **Versión**: `5.5.7` → `0.1.0` (reset semver para marcar baseline).

Ver [STATUS.md](./STATUS.md) para el snapshot completo del estado.
