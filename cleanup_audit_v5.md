# 🧹 Guardman — Cleanup Audit V5: "Tabula Rasa"

> **Contexto**: Instrucción explícita de "Construir todo desde cero usando `convex_plan.md`".
> **Objetivo**: Eliminar **toda** la implementación antigua (Legacy) en `web` y `admin`.
> **Excepción**: `convex/` (Base de Datos) se mantiene intacta.

---

## 1. 💀 Admin: "Legacy React" -> 🗑️ Delete

El plan (Phase 4) especifica usar **Refine + Ant Design**.
El admin actual es un SPA React básico + Tailwind. **Es 100% incompatible.**

**Acción**: Vaciar `admin/src`.
- ❌ `admin/src/components/` (Muerto)
- ❌ `admin/src/pages/` (Muerto)
- ❌ `admin/src/lib/` (Muerto)
- ❌ `admin/src/hooks/` (Muerto)
- ⚠️ **Mantener solo Scaffolding**: `App.tsx` (vacío), `main.tsx`, `index.css`, `index.html`, `vite.config.ts`.

## 2. 💀 Web: "Legacy Astro" -> 🗑️ Delete

El plan (Phase 2 & 3) especifica una arquitectura basada en `i18n` y Rutas Dinámicas desde cero.
El web actual tiene componentes hardcoded, data estática en `data/site.ts` y falta de i18n.

**Acción**: Vaciar `web/src`.
- ❌ `web/src/components/` (Muerto - se rehará el Registry)
- ❌ `web/src/data/` (Muerto - se migra a DB)
- ❌ `web/src/layouts/` (Muerto - incompatible con nueva estructura)
- ❌ `web/src/pages/` (Muerto - se rehará lógica SSR)
- ❌ `web/src/utils/` (Muerto)
- ⚠️ **Mantener solo Scaffolding**: `env.d.ts` (limpio), `astro.config.mjs`, `tailwind.config.mjs`.

## 3. 🛡️ Convex (Intocable)

**Estado**: MANTENER.
- Se respeta la carpeta `convex/` completa como "La Base de Datos".
- Cualquier refactor de `schema.ts` o `seed.ts` ocurrirá durante la ejecución del Plan (Phase 1), no como limpieza.

---

## Resumen de la Operación "Reset"

Esta acción dejará el proyecto en estado **"Esqueleto Monorepo"** (Phase 0), listo para empezar la Phase 1 del Plan sin deuda técnica.

### Comandos Propuestos

```powershell
# Admin Clean Slate
Remove-Item -Recurse -Force admin/src/components
Remove-Item -Recurse -Force admin/src/pages
Remove-Item -Recurse -Force admin/src/lib
# (Dejar solo main.tsx y App.tsx mínimos o borrarlos y recrearlos en Phase 0)

# Web Clean Slate
Remove-Item -Recurse -Force web/src/components
Remove-Item -Recurse -Force web/src/data
Remove-Item -Recurse -Force web/src/layouts
Remove-Item -Recurse -Force web/src/pages
Remove-Item -Recurse -Force web/src/utils
# (Dejar solo un pages/index.astro vacío o borrar todo)
```

> **¿Confirmar borrado total de `src` en ambos proyectos?**
