# Documentación de Vercel - Guardman

Este documento contiene los detalles de la implementación y despliegue del proyecto Guardman en Vercel.

## 1. Detalles del Despliegue

| Parámetro | Valor |
| :--- | :--- |
| **Nombre del Proyecto** | `guardman` |
| **URL de Producción** | [https://guardman.vercel.app](https://guardman.vercel.app) |
| **Framework** | Astro / Vite |
| **Plataforma** | Vercel (Cloud) |
| **Integración GitHub** | [desarrollo33-lab/guardman](https://github.com/desarrollo33-lab/guardman) |

---

## 2. Configuración de Entorno (Producción)

Las siguientes variables se configuraron para el despliegue de producción:

| Variable | Valor |
| :--- | :--- |
| `PUBLIC_CONVEX_URL` | `https://opulent-cod-610.convex.cloud` |
| `SITE` | `https://guardman.cl` |

---

## 3. Comandos de Despliegue

Para realizar un despliegue manual a producción desde la terminal:

```bash
npx vercel --prod
```

Para previsualizar cambios antes de producción:

```bash
npx vercel
```

---

## 4. Notas Técnicas
- El proyecto utiliza `@astrojs/vercel` para la adaptación al servidor.
- Los despliegues se disparan automáticamente al realizar un `push` a la rama `master` en GitHub.
- El build detecta automáticamente Astro y genera el output optimizado.
