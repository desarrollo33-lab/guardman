# Documentación del Repositorio GitHub - Guardman

Este documento centraliza toda la información relacionada con el repositorio oficial del proyecto Guardman.

## 1. Detalles del Repositorio

| Parámetro | Valor |
| :--- | :--- |
| **Nombre** | `guardman` |
| **Propietario** | `desarrollo33-lab` |
| **Visibilidad** | `PUBLIC` |
| **Rama Principal** | `master` |
| **URL Web** | [https://github.com/desarrollo33-lab/guardman](https://github.com/desarrollo33-lab/guardman) |
| **URL Clonar (HTTPS)** | `https://github.com/desarrollo33-lab/guardman.git` |
| **URL Clonar (SSH)** | `git@github.com:desarrollo33-lab/guardman.git` |

---

## 2. Configuración de Git Local

### Remotos
El origen remoto está configurado como `origin`:
- **Fetch**: `https://github.com/desarrollo33-lab/guardman.git`
- **Push**: `https://github.com/desarrollo33-lab/guardman.git`

### Archivos Ignorados (.gitignore)
Se ha configurado un archivo `.gitignore` robusto para evitar subir archivos innecesarios o sensibles. Se ignoran:
- Variables de entorno (`.env`, `.env.local`).
- Directorios de construcción (`dist/`, `.vercel/`, `.astro/`).
- Dependencias (`node_modules/`).
- Archivos del sistema operativo (`.DS_Store`, `Thumbs.db`).
- Logs de npm/yarn.

---

## 3. Comandos Útiles

### Actualizar cambios
```bash
git add .
git commit -m "Descripción de los cambios"
git push origin master
```

### Clonar en otro equipo
```bash
git clone https://github.com/desarrollo33-lab/guardman.git
cd guardman
npm install
```

---

## 4. Notas de Versión Inicial
- Se subió la estructura base del proyecto Astro.
- Se incluyó la integración completa con Convex.
- Se corrigieron problemas de indexación en Windows (eliminación de archivo `nul`).
