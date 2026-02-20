# 🧹 Guardman — Cleanup Audit v4 (The "Really Clean" Edition)

> **Contexto**: Ronda 4 (Final-Final). El usuario indicó que "todavía hay carpetas completas irrelevantes".
> **Enfoque**: Agresivo. Si no se usa HOY, se va.

---

## 1. 🗑️ Carpetas Root Irrelevantes

| Objeto | Estado | Acción | Razón |
|--------|--------|--------|-------|
| `dist/` | **Basura** | **Eliminar** | La compilación genera `web/dist` y `admin/dist`. Esta carpeta en el root es un error o remanente. |
| `e2e/` | **Obsoleto** | **Eliminar** | Contiene tests (`admin.spec.ts`, `pseo.spec.ts`) para una versión anterior o no funcional. El plan indica reintroducir tests en **Phase 7**. Por ahora, ensucian. |

---

## 2. 💀 Código Muerto en Frontend (`web`)

| Archivo/Dir | Estado | Acción | Razón |
|-------------|--------|--------|-------|
| `src/components/og/` | **Muerto** | **Eliminar** | Contiene `Template.tsx`. La generación de OG Images (`pages/og`) fue eliminada. Nadie usa esto. |
| `package.json` | **Sucio** | **Limpiar** | Dependencia `satori` (usada solo para OG images) es innecesaria. |
| `src/env.d.ts` | **Sucio** | **Limpiar** | Tipos para `GOOGLE_SHEETS_WEBHOOK`, `EMAIL_WEBHOOK`, `SLACK_WEBHOOK` (ya eliminados del `.env`). |

---

## 3. 🧹 Admin Cleanliness

| Archivo | Estado | Acción | Razón |
|---------|--------|--------|-------|
| `src/pages/communes/` | **Stub** | **Mantener** | Aunque es un placeholder, está linkeado desde el Dashboard y Sidebar. Borrarlo rompería la navegación (Error 404 al clicar). Se queda como deuda técnica conocida. |

---

## Plan de Ejecución

### Paso 1: Sistema de Archivos
```powershell
Remove-Item -Recurse -Force dist
Remove-Item -Recurse -Force e2e
Remove-Item -Recurse -Force web/src/components/og
```

### Paso 2: Limpieza de Dependencias (Web)
- Editar `web/package.json`: Eliminar `satori`.

### Paso 3: Limpieza de Tipos
- Editar `web/src/env.d.ts`: Eliminar definiciones de webhooks.

---

> **Nota**: Tras esto, la estructura será estricta: `admin`, `web`, `convex`, y configs del root. Nada más.
