# 🧹 Guardman — Cleanup Audit v3 (Final "Really Clean")

> **Contexto**: Tercera y última ronda de auditoría profunda.
> Objetivo: eliminar redundancias, archivos fuera de lugar y scripts rotos.
>
> **Fecha**: 19 de febrero de 2026 | **Loops**: 3 adicionales

---

## 1. 🚨 CRÍTICO — Script de Build Roto

**Archivo**: `web/package.json`

```json
"build": "astro build && node copy-admin.js",
```

**Problema**: El script `copy-admin.js` fue eliminado en la Ronda 1.
**Impacto**: El comando `npm run build` en `web` **FALLARÁ** siempre.
**Acción**: Eliminar `&& node copy-admin.js`.

---

## 2. 🗑️ Archivos Root Redundantes

El monorepo tiene su estructura de assets estáticos en `web/public/`. Los archivos en el root del proyecto son remanentes de la estructura antigua.

| Archivo/Dir | Acción | Razón |
|-------------|--------|-------|
| `public/` (Directorio) | **Eliminar** | Duplicado de `web/public/`. Astro/Vercel usan el de `web`. |
| `apple-touch-icon.png` | **Eliminar** | Duplicado. |
| `favicon.svg` | **Eliminar** | Duplicado. |
| `og-default.jpg` | **Eliminar** | Duplicado. |
| `robots.txt` | **Eliminar** | Duplicado. |

---

## 3. 🔍 Seed Data vs Frontend Reality

**Archivo**: `convex/seed.ts`

**Hallazgo**: El seed inserta bloques de contenido con tipos como:
- `hero_ajax`
- `services_grid_ajax`
- `cta_dual`

**Realidad**: El frontend (`index.astro`) **ignora** estos bloques. Renderiza componentes hardcoded (`<ServicesGrid />`, `<Hero />`) alimentados por queries directas a tablas maestras (`api.services`, `api.heroes`), no por `content_blocks`.

**Acción**:
- **Ahora**: No tocar (no rompe nada, solo es "data sucia" en DB local).
- **Phase 2**: Refactorizar `seed.ts` para que coincida con la arquitectura real o implementar el renderizado dinámico de bloques en el frontend.

---

## Plan de Ejecución Inmediata

```bash
# 1. Arreglar script de build
# Editar web/package.json

# 2. Eliminar basura del root
Remove-Item -Recurse -Force public
Remove-Item apple-touch-icon.png, favicon.svg, og-default.jpg, robots.txt
```

---

> **Documento generado**: 19 de febrero de 2026 | Auditoría Final
