# 🧹 Guardman — Cleanup Audit v2 (Post-Limpieza)

> **Contexto**: Esta auditoría se ejecutó DESPUÉS de la primera limpieza que eliminó ~30 archivos.
> El objetivo es encontrar todo lo que quedó: referencias rotas, archivos desactualizados,
> directorios vacíos, y documentación obsoleta.
>
> **Fecha**: 19 de febrero de 2026 | **Loops**: 3

---

## Resumen Ejecutivo

| Categoría | Items | Prioridad |
|-----------|-------|-----------|
| 🔴 Referencia rota (admin → `api.communes`) | 3 archivos | **CRÍTICA** — rompe el admin |
| 📄 Documentación obsoleta | 2 archivos (README, AGENTS.md) | Alta |
| ⚙️ Configs vacíos/innecesarios | 2 archivos | Media |
| 📁 Directorios vacíos | 3 directorios | Baja |
| 🌿 Variables de entorno muertas | 3 archivos | Media |
| 📋 Archivos en ubicación incorrecta | 1 archivo | Media |
| 🌱 Seed data — patrones obsoletos | 1 archivo | Baja (para Phase 2) |
| **TOTAL** | **~15 items** | |

---

## 1. 🔴 CRÍTICO — Referencias Rotas a `api.communes`

Al eliminar `convex/communes.ts`, el admin quedó con imports rotos. La función equivalente existe en `convex/locations.ts`.

### Archivos que necesitan fix:

| Archivo | Línea | Código roto | Fix |
|---------|-------|-------------|-----|
| `admin/src/pages/Dashboard.tsx` | 15 | `api.communes.getAll` | → `api.locations.getAllCommunes` |
| `admin/src/App.tsx` | 16 + 52 | `import CommunesIndex` + route `/communes` | Mantener ruta pero redirigir a `locations` |
| `admin/src/components/layout/Sidebar.tsx` | 43 | `href: '/communes'` | Sin cambio (es ruta interna admin) |

### Corrección para `Dashboard.tsx`:

```diff
- const communes = useQuery(api.communes.getAll);
+ const communes = useQuery(api.locations.getAllCommunes);
```

**Acción**: `🔧 Fix inmediato` — cambiar 1 línea en Dashboard.tsx.

### Regenerar tipos Convex

Después del fix, ejecutar:
```bash
npx convex dev --once
```
Esto regenerará `convex/_generated/api.d.ts` eliminando las referencias a `communes` y `debug_pages`.

---

## 2. 📄 Documentación Obsoleta

### 2.1 `README.md` (127 líneas)

**Problema**: La mitad del README (líneas 17-105) documenta la **integración con Google Sheets** que fue eliminada. También referencia scripts que ya no existen.

Secciones a eliminar:
- "Google Sheets Integration" (líneas 17-87)
- "Estructura de datos" (líneas 89-104 — la tabla ahora está en Convex)

Secciones a actualizar:
- "Scripts disponibles" — remover `preview`, agregar `convex:dev`, `convex:deploy`
- "Stack tecnológico" — ya correcto

**Acción**: `🔄 Reescribir` — reducir a ~40 líneas con info actual del monorepo.

### 2.2 `AGENTS.md` (512 líneas)

**Problema**: Este es un guía genérica de Convex con notas de proyecto desactualizadas. La sección "Project-Specific Notes" (líneas 496-511) lista `communes` como tabla separada de `locations` (incorrecto tras la limpieza). También, mucho del contenido genérico duplica la documentación oficial de Convex.

**Acción**: `🔄 Actualizar` sección "Project-Specific Notes" con la lista correcta de tablas. Se puede simplificar el resto, pero no es urgente.

---

## 3. ⚙️ Configs Vacíos/Innecesarios

### 3.1 `vercel.json` (3 bytes — `{}`)

**Contenido**: Un objeto JSON vacío `{}`. No agrega ninguna configuración.

**Acción**: `🗑️ Eliminar`. Vercel funciona con `astro.config.mjs` + el adapter `@astrojs/vercel`.

### 3.2 `vitest.config.ts` (47 líneas)

**Contenido**: Configuración completa de Vitest con coverage, pero **no hay tests en el proyecto**. El directorio `convex/_test/` fue eliminado, y no hay archivos `*.test.ts` o `*.spec.ts` en ningún lado.

**Acción**: `🗑️ Eliminar`. Cuando se agreguen tests en Phase 7, se recreará con la configuración adecuada. Mantenerlo solo genera confusión.

---

## 4. 📁 Directorios Vacíos

| Directorio | Estado |
|------------|--------|
| `admin/src/hooks/` | Vacío — 0 archivos |
| `admin/src/types/` | Vacío — 0 archivos |
| `web/src/pages/og/` | Vacío (los templates están en `web/src/components/og/`) |

**Acción**: `🗑️ Eliminar los 3 directorios vacíos`.

---

## 5. 🌿 Variables de Entorno Muertas

### 5.1 `.env` (6 líneas)

```ini
# Actual:
WEBHOOK_URL=       # ← muerto, no referenciado en ningún archivo
```

**Acción**: `🗑️ Eliminar` la línea `WEBHOOK_URL=` y su comentario `# Webhooks (optional)`.

### 5.2 `.env.example` (11 líneas)

```ini
# Líneas muertas:
GOOGLE_SHEETS_WEBHOOK=    # ← eliminamos sheets webhook
EMAIL_WEBHOOK=            # ← no existe implementación
SLACK_WEBHOOK=            # ← no existe implementación
```

**Acción**: `🔄 Reescribir` con solo las variables activas:
```ini
# Convex Backend
PUBLIC_CONVEX_URL=your_convex_url_here
CONVEX_DEPLOYMENT=dev:your-deployment-id
```

### 5.3 `.env.local` (8 líneas)

Este archivo contiene las credentials reales de Convex. **Está correcto y activo**. NO eliminar.

Pero verificar que `CONVEX_SITE_URL` se usa en algún lugar:

```bash
grep -r "CONVEX_SITE_URL" web/ admin/ convex/ → 0 resultados
```

**Acción**: Evaluar si `CONVEX_SITE_URL` es necesario. Si no se usa, eliminar la línea.

---

## 6. 📋 Archivo en Ubicación Incorrecta

### `web/src/config/leadStatus.ts` (46 líneas)

**Contenido**: Configuración de estados de leads con labels y clases CSS de Tailwind.

**Problema**: Este archivo está en `web/src/config/` pero solo es relevante para el **admin** (el frontend web no muestra estados de leads). Sus clases CSS (`bg-blue-100`, `text-blue-800`) son de Tailwind y son patterns del admin.

**Acción**: `🔄 Mover a admin/src/config/leadStatus.ts` en Phase 2, o `🗑️ Eliminar` si Refine (Phase 4) lo reemplaza completamente.

**Para ahora**: Dejar en su ubicación actual — no causa daño funcional.

---

## 7. 🌱 Seed Data — Patrones Obsoletos

### `convex/seed.ts` (908 líneas)

**Problema**: El archivo de seed contiene datos iniciales para content blocks que referencian tipos de componentes eliminados:

```typescript
// Línea 385: tipo 'services_grid_ajax' — componente eliminado
// Línea 445: tipo 'hero_ajax' — componente eliminado
// Línea 491: tipo 'services_grid_ajax' — reutilizado para solutions
```

Estos tipos (`hero_ajax`, `services_grid_ajax`) corresponden a los componentes Ajax que fueron eliminados en la primera limpieza. Si se ejecuta el seed, creará content blocks con tipos que ningún componente puede renderizar.

**Acción**: `🔄 Actualizar en Phase 2` — cambiar los tipos a los componentes activos (`hero`, `services_grid`). **No es urgente** porque el seed solo se ejecuta una vez y los datos ya están en Convex.

---

## 8. `convex/README.md` — Boilerplate

**Contenido**: 91 líneas de documentación genérica de Convex copiada del template inicial.

**Acción**: `🗑️ Eliminar`. Esta documentación existe en docs.convex.dev. El archivo no aporta nada específico al proyecto.

---

## Orden de Ejecución

### Paso inmediato (ahora):

```bash
# 1. Fix referencia rota en Dashboard
# (editar admin/src/pages/Dashboard.tsx línea 15)

# 2. Eliminar configs vacíos
rm vercel.json
rm vitest.config.ts
rm convex/README.md

# 3. Eliminar directorios vacíos
rmdir admin/src/hooks
rmdir admin/src/types
rmdir web/src/pages/og

# 4. Limpiar .env
# (editar .env — remover WEBHOOK_URL)

# 5. Limpiar .env.example
# (reescribir con solo vars activas)

# 6. Regenerar tipos Convex
npx convex dev --once

# 7. Rebuild admin
cd admin && npm run build

# 8. Rebuild web
cd web && npx astro build
```

### Paso diferido (Phase 2+):

- Reescribir `README.md`
- Actualizar `AGENTS.md` sección Project-Specific Notes
- Mover `web/src/config/leadStatus.ts` → `admin/src/config/`
- Actualizar `convex/seed.ts` tipos obsoletos

---

> **Documento generado**: 19 de febrero de 2026 | Loops: 3 | Post-limpieza round 2
