# Guardman Chile

Sitio web corporativo para Guardman, empresa de seguridad privada en Chile.

## Arquitectura

```
guardman/
├── web/          # Astro SSR (frontend público)
├── admin/        # Vite + React (panel de administración)
├── convex/       # Backend Convex (schema, queries, mutations)
├── e2e/          # Tests end-to-end
└── package.json  # Monorepo root (npm workspaces + Turbo)
```

## Desarrollo

```bash
# Instalar dependencias
npm install

# Iniciar dev server (web + admin + convex)
npm run dev

# Solo web
npm run dev:web

# Solo admin
npm run dev:admin

# Convex dev
npm run convex:dev

# Build de producción
npm run build
```

## Stack Tecnológico

- [Astro](https://astro.build) — Framework SSR
- [React](https://react.dev) — Componentes interactivos
- [Convex](https://convex.dev) — Backend reactivo y base de datos
- [Tailwind CSS](https://tailwindcss.com) — Estilos
- [Turbo](https://turbo.build) — Monorepo build system
- [Vercel](https://vercel.com) — Hosting y deployment
