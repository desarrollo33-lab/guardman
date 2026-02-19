# Plan de Migración: Admin Astro → Vite + React Router

## ✅ ESTADO: MIGRACIÓN COMPLETADA

La estructura del monorepo ha sido creada exitosamente. Ver instrucciones de post-migración abajo.

---

## Resumen

Migrar el panel de administración de Astro (islands) a una aplicación Vite independiente con React Router, manteniendo Astro para el sitio público y Convex como backend compartido.

---

## FASE 1: Setup del Monorepo

### 1.1 Crear configuración de workspace

**Archivos a crear:**

#### `pnpm-workspace.yaml`

```yaml
packages:
  - 'web'
  - 'admin'
```

#### `turbo.json`

```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "!.next/cache/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^lint"]
    },
    "typecheck": {
      "dependsOn": ["^typecheck"]
    }
  }
}
```

#### `package.json` (root - actualizar)

```json
{
  "name": "guardman-monorepo",
  "private": true,
  "scripts": {
    "dev": "turbo run dev",
    "dev:web": "turbo run dev --filter=web",
    "dev:admin": "turbo run dev --filter=admin",
    "build": "turbo run build",
    "build:web": "turbo run build --filter=web",
    "build:admin": "turbo run build --filter=admin",
    "lint": "turbo run lint",
    "typecheck": "turbo run typecheck"
  },
  "devDependencies": {
    "turbo": "^2.0.0"
  }
}
```

### 1.2 Mover archivos a estructura de monorepo

**Comandos a ejecutar (en orden):**

```bash
# 1. Instalar turbo globalmente si no está
npm install -g turbo

# 2. Crear directorios
mkdir -p web admin

# 3. Mover archivos del sitio web (Astro)
# NOTA: Excluir src/components/admin y src/pages/admin
mv src web/
mv public web/
mv astro.config.mjs web/
mv tailwind.config.mjs web/
mv tsconfig.json web/
mv .astro web/ 2>/dev/null || true

# 4. Copiar archivos de configuración compartidos al root
cp web/package.json ./package.json.backup
cp convex.json ./convex.json.backup

# 5. Crear convex symlink en admin (el convex folder queda en root)
# No mover - convex/ se queda en la raíz
```

### 1.3 Crear package.json de web/

**`web/package.json`:**

```json
{
  "name": "web",
  "type": "module",
  "version": "1.0.1",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "lint": "eslint src/",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@astrojs/react": "^4.1.0",
    "@astrojs/sitemap": "^3.2.0",
    "@astrojs/tailwind": "^6.0.0",
    "@astrojs/vercel": "^8.0.0",
    "astro": "^5.1.0",
    "convex": "^1.12.0",
    "marked": "^17.0.3",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "tailwindcss": "^3.4.17"
  },
  "devDependencies": {
    "@astrojs/check": "^0.9.6",
    "@types/react": "^18.3.18",
    "@types/react-dom": "^18.3.5",
    "prettier": "^3.4.2",
    "prettier-plugin-astro": "^0.14.1",
    "typescript": "^5.9.3"
  }
}
```

### 1.4 Limpiar web/ de componentes admin

**Archivos a eliminar de `web/src/components/admin/`:**

- Todos los `Convex*Wrapper.tsx` (22 archivos)
- `SharedAuthContext.tsx`
- `ConvexLoginForm.tsx`
- `AuthGuard.tsx`
- `LoginForm.tsx`
- `LogoutButton.tsx`

**Archivos a MANTENER en `web/src/components/admin/` (se copiarán a admin/):**

- Dashboard.tsx
- Sidebar.tsx
- ImageUploader.tsx
- MarkdownEditor.tsx
- 15 formularios (\*Form.tsx)
- 18 listas (\*List.tsx)

**Páginas admin a eliminar de `web/src/pages/admin/`:**

- Todo el directorio `admin/` (19 archivos .astro + subdirectorios)

---

## FASE 2: Crear Admin App (Vite)

### 2.1 Inicializar proyecto Vite

**Comandos:**

```bash
cd admin

# Crear proyecto Vite con React + TypeScript
npm create vite@latest . -- --template react-ts

# Instalar dependencias
npm install react-router-dom@6
npm install convex @convex-dev/auth
npm install @tanstack/react-query
npm install tailwindcss postcss autoprefixer
npm install lucide-react  # Para iconos (mejor que SVG inline)

# Dependencias de desarrollo
npm install -D @types/react @types/react-dom
npm install -D eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser
npm install -D prettier
```

### 2.2 Configurar Tailwind

**`admin/tailwind.config.js`:**

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // Copiar configuración de colores del proyecto original
      colors: {
        primary: {
          DEFAULT: '#000000',
          dark: '#000000',
          light: '#1a1a1a',
        },
        // ... resto de colores de tailwind.config.mjs
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
};
```

**`admin/postcss.config.js`:**

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

**`admin/src/index.css`:**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Estilos base del admin */
body {
  @apply antialiased;
}
```

### 2.3 Configurar Vite

**`admin/vite.config.ts`:**

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@convex': path.resolve(__dirname, '../convex/_generated'),
    },
  },
  define: {
    // Variables de entorno que usa Convex
    'import.meta.env.VITE_CONVEX_URL': JSON.stringify(
      process.env.VITE_CONVEX_URL || ''
    ),
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  server: {
    port: 3001,
    proxy: {
      // Proxy para desarrollo local si es necesario
    },
  },
});
```

### 2.4 Configurar Convex Auth

**`admin/src/lib/convex.ts`:**

```typescript
import { ConvexReactClient } from 'convex/react';

const convexUrl = import.meta.env.VITE_CONVEX_URL;

if (!convexUrl) {
  throw new Error('VITE_CONVEX_URL is not set');
}

export const convexClient = new ConvexReactClient(convexUrl);
```

**`admin/src/lib/auth.tsx`:**

```typescript
import { ConvexAuthProvider } from '@convex-dev/auth/react';
import { convexClient } from './convex';
import type { ReactNode } from 'react';

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <ConvexAuthProvider client={convexClient}>
      {children}
    </ConvexAuthProvider>
  );
}
```

**`admin/src/env.d.ts`:**

```typescript
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CONVEX_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

---

## FASE 3: Migrar Componentes

### 3.1 Estructura de directorios admin/src/

```
admin/src/
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── Layout.tsx
│   │   └── Header.tsx
│   ├── forms/
│   │   ├── ServiceForm.tsx
│   │   ├── SolutionForm.tsx
│   │   ├── BlogPostForm.tsx
│   │   ├── CommuneForm.tsx
│   │   ├── FAQForm.tsx
│   │   ├── HeroForm.tsx
│   │   ├── PartnerForm.tsx
│   │   ├── TeamMemberForm.tsx
│   │   ├── TestimonialForm.tsx
│   │   ├── AuthorForm.tsx
│   │   ├── CompanyValueForm.tsx
│   │   ├── ProcessStepForm.tsx
│   │   ├── StatForm.tsx
│   │   ├── CtaForm.tsx
│   │   ├── IndustryForm.tsx
│   │   └── SiteConfigForm.tsx
│   ├── lists/
│   │   ├── ServicesList.tsx
│   │   ├── SolutionsList.tsx
│   │   ├── BlogPostsList.tsx
│   │   ├── CommunesList.tsx
│   │   ├── FAQsList.tsx
│   │   ├── HeroesList.tsx
│   │   ├── PartnersList.tsx
│   │   ├── TeamList.tsx
│   │   ├── TestimonialsList.tsx
│   │   ├── AuthorsList.tsx
│   │   ├── CompanyValuesList.tsx
│   │   ├── ProcessStepsList.tsx
│   │   ├── StatsList.tsx
│   │   ├── CtasList.tsx
│   │   ├── IndustriesList.tsx
│   │   ├── LeadsList.tsx
│   │   └── LeadDetail.tsx
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Modal.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Toggle.tsx
│   │   └── Card.tsx
│   └── shared/
│       ├── ImageUploader.tsx
│       ├── MarkdownEditor.tsx
│       └── Dashboard.tsx
├── pages/
│   ├── Dashboard.tsx
│   ├── Login.tsx
│   ├── leads/
│   │   ├── index.tsx
│   │   └── [id].tsx
│   ├── services/
│   │   └── index.tsx
│   ├── solutions/
│   │   └── index.tsx
│   ├── blog/
│   │   └── index.tsx
│   ├── heroes/
│   │   └── index.tsx
│   ├── faqs/
│   │   └── index.tsx
│   ├── team/
│   │   └── index.tsx
│   ├── testimonials/
│   │   └── index.tsx
│   ├── communes/
│   │   └── index.tsx
│   ├── partners/
│   │   └── index.tsx
│   ├── industries/
│   │   └── index.tsx
│   ├── authors/
│   │   └── index.tsx
│   ├── company-values/
│   │   └── index.tsx
│   ├── process-steps/
│   │   └── index.tsx
│   ├── stats/
│   │   └── index.tsx
│   ├── ctas/
│   │   └── index.tsx
│   └── config/
│       └── index.tsx
├── hooks/
│   ├── useAuth.ts
│   └── useConvex.ts
├── lib/
│   ├── convex.ts
│   └── auth.tsx
├── types/
│   └── index.ts
├── App.tsx
├── main.tsx
└── index.css
```

### 3.2 Componentes a Adaptar

**Adaptaciones necesarias en cada componente:**

1. **Cambiar imports de API:**

   ```typescript
   // Antes
   import { api } from '@convex/_generated/api';

   // Después
   import { api } from '../../../convex/_generated/api';
   ```

2. **Eliminar ConvexAuthProvider interno** (ahora está en el root)

3. **Sidebar.tsx - Simplificar:**

   ```typescript
   // Antes: Tenía su propio provider
   export default function SidebarWrapper({ currentPath }: SidebarProps) {
     const client = getConvexClient();
     return (
       <ConvexAuthProvider client={client}>
         <SidebarContent currentPath={currentPath} />
       </ConvexAuthProvider>
     );
   }

   // Después: Usar NavLink de React Router
   export default function Sidebar() {
     return <nav>...</nav>;
   }
   ```

### 3.3 Archivos a ELIMINAR (no migrar)

```
src/components/admin/
├── Convex*Wrapper.tsx (22 archivos) ❌
├── SharedAuthContext.tsx ❌
├── ConvexLoginForm.tsx ❌
└── LogoutButton.tsx ❌ (integrar en Sidebar)
```

---

## FASE 4: Migrar Páginas (React Router)

### 4.1 Configurar React Router

**`admin/src/App.tsx`:**

```typescript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConvexProvider } from 'convex/react';
import { AuthProvider } from './lib/auth';
import { convexClient } from './lib/convex';
import Layout from './components/layout/Layout';
import AuthGuard from './components/shared/AuthGuard';

// Pages
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import LeadsIndex from './pages/leads/index';
import LeadDetail from './pages/leads/[id]';
import ServicesIndex from './pages/services/index';
import SolutionsIndex from './pages/solutions/index';
import BlogIndex from './pages/blog/index';
import HeroesIndex from './pages/heroes/index';
import FAQsIndex from './pages/faqs/index';
import TeamIndex from './pages/team/index';
import TestimonialsIndex from './pages/testimonials/index';
import CommunesIndex from './pages/communes/index';
import PartnersIndex from './pages/partners/index';
import IndustriesIndex from './pages/industries/index';
import AuthorsIndex from './pages/authors/index';
import CompanyValuesIndex from './pages/company-values/index';
import ProcessStepsIndex from './pages/process-steps/index';
import StatsIndex from './pages/stats/index';
import CtAsIndex from './pages/ctas/index';
import ConfigIndex from './pages/config/index';

export default function App() {
  return (
    <ConvexProvider client={convexClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public route */}
            <Route path="/login" element={<Login />} />

            {/* Protected routes */}
            <Route
              path="/"
              element={
                <AuthGuard>
                  <Layout />
                </AuthGuard>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="leads" element={<LeadsIndex />} />
              <Route path="leads/:id" element={<LeadDetail />} />
              <Route path="services" element={<ServicesIndex />} />
              <Route path="solutions" element={<SolutionsIndex />} />
              <Route path="blog" element={<BlogIndex />} />
              <Route path="heroes" element={<HeroesIndex />} />
              <Route path="faqs" element={<FAQsIndex />} />
              <Route path="team" element={<TeamIndex />} />
              <Route path="testimonials" element={<TestimonialsIndex />} />
              <Route path="communes" element={<CommunesIndex />} />
              <Route path="partners" element={<PartnersIndex />} />
              <Route path="industries" element={<IndustriesIndex />} />
              <Route path="authors" element={<AuthorsIndex />} />
              <Route path="company-values" element={<CompanyValuesIndex />} />
              <Route path="process-steps" element={<ProcessStepsIndex />} />
              <Route path="stats" element={<StatsIndex />} />
              <Route path="ctas" element={<CtAsIndex />} />
              <Route path="config" element={<ConfigIndex />} />
            </Route>

            {/* Redirect unknown routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ConvexProvider>
  );
}
```

### 4.2 Mapeo de Rutas

| Astro (antes)           | React Router (después) |
| ----------------------- | ---------------------- |
| `/admin` o `/admin/`    | `/`                    |
| `/admin/login`          | `/login`               |
| `/admin/leads`          | `/leads`               |
| `/admin/leads/[id]`     | `/leads/:id`           |
| `/admin/services`       | `/services`            |
| `/admin/solutions`      | `/solutions`           |
| `/admin/blog`           | `/blog`                |
| `/admin/heroes`         | `/heroes`              |
| `/admin/faqs`           | `/faqs`                |
| `/admin/team`           | `/team`                |
| `/admin/testimonials`   | `/testimonials`        |
| `/admin/communes`       | `/communes`            |
| `/admin/partners`       | `/partners`            |
| `/admin/industries`     | `/industries`          |
| `/admin/authors`        | `/authors`             |
| `/admin/company-values` | `/company-values`      |
| `/admin/process-steps`  | `/process-steps`       |
| `/admin/stats`          | `/stats`               |
| `/admin/ctas`           | `/ctas`                |
| `/admin/config`         | `/config`              |

### 4.3 Layout Component

**`admin/src/components/layout/Layout.tsx`:**

```typescript
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-gray-100 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
```

### 4.4 AuthGuard Component

**`admin/src/components/shared/AuthGuard.tsx`:**

```typescript
import { Navigate, useLocation } from 'react-router-dom';
import { useConvexAuth } from 'convex/react';
import type { ReactNode } from 'react';

interface AuthGuardProps {
  children: ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
```

### 4.5 Login Page

**`admin/src/pages/Login.tsx`:**

```typescript
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthActions } from '@convex-dev/auth/react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { signIn } = useAuthActions();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await signIn('password', { email, password, flow: 'signIn' });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">🛡️ Guardman</h1>
          <p className="text-gray-400 mt-2">Panel de Administración</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg p-6 space-y-4">
          {error && (
            <div className="bg-red-900/30 text-red-400 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-medium rounded-lg transition-colors"
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  );
}
```

---

## FASE 5: Configurar Vercel

### 5.1 Estructura para Vercel

Opción A: **Vercel Microfrontends** (recomendado para mantener /admin/\* en otra app)

**`vercel.json` (root):**

```json
{
  "headers": [
    {
      "source": "/images/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        },
        { "key": "X-Content-Type-Options", "value": "nosniff" }
      ]
    }
  ],
  "rewrites": [
    {
      "source": "/admin/:path*",
      "destination": "/admin/index.html"
    }
  ]
}
```

**`vercel.json` (admin/):**

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" }
      ]
    }
  ]
}
```

### 5.2 Build Commands

**`vercel.json` o dashboard settings:**

```bash
# Build Command
turbo run build

# Output Directory
# Para Astro: web/dist
# El admin se sirve como microfrontend en /admin

# Root Directory: ./
```

### 5.3 Variables de Entorno en Vercel

Configurar en Vercel Dashboard:

- `CONVEX_URL` o `PUBLIC_CONVEX_URL` (para Astro)
- `VITE_CONVEX_URL` (para Vite admin)

---

## FASE 6: Testing y Deploy

### 6.1 Testing Local

**Comandos:**

```bash
# Instalar dependencias del root
pnpm install

# Iniciar Convex (en otra terminal)
npx convex dev

# Iniciar ambas apps
pnpm dev

# O por separado
pnpm dev:web   # Puerto 4321
pnpm dev:admin # Puerto 3001
```

### 6.2 Checklist de Verificación

**Funcionalidad Admin:**

- [ ] Login funciona correctamente
- [ ] Sesión persiste entre navegaciones
- [ ] Logout funciona
- [ ] Todas las páginas cargan datos de Convex
- [ ] CRUD completo en cada entidad:
  - [ ] Services
  - [ ] Solutions
  - [ ] Blog posts
  - [ ] Heroes
  - [ ] FAQs
  - [ ] Team
  - [ ] Testimonials
  - [ ] Communes
  - [ ] Partners
  - [ ] Industries
  - [ ] Authors
  - [ ] Company Values
  - [ ] Process Steps
  - [ ] Stats
  - [ ] CTAs
  - [ ] Site Config
  - [ ] Leads (lectura + cambio de estado)

**Sitio Público:**

- [ ] Todas las páginas cargan correctamente
- [ ] No hay referencias rotas a componentes admin eliminados
- [ ] SEO funciona (sitemap, meta tags)

### 6.3 Deploy a Producción

1. **Commit y push:**

   ```bash
   git add .
   git commit -m "feat: migrate admin to Vite + React Router monorepo"
   git push origin main
   ```

2. **Vercel detectará automáticamente el monorepo** y ejecutará el build.

3. **Verificar deployment:**
   - https://guardman.cl (sitio público)
   - https://guardman.cl/admin (panel admin)

---

## ORDEN DE EJECUCIÓN RECOMENDADO

1. **Preparación (rama nueva)**

   ```bash
   git checkout -b feature/admin-vite-migration
   ```

2. **Fase 1** - Setup monorepo (no rompe nada todavía)

3. **Fase 2** - Crear admin app básica (scaffolding)

4. **Fase 3** - Migrar componentes uno por uno, empezando por:
   - `lib/convex.ts`
   - `lib/auth.tsx`
   - `components/shared/AuthGuard.tsx`
   - `components/layout/Sidebar.tsx`
   - `components/layout/Layout.tsx`
   - `pages/Login.tsx`
   - `pages/Dashboard.tsx`
5. **Fase 4** - Configurar routing y verificar que funciona

6. **Fase 5** - Migrar resto de páginas

7. **Fase 6** - Limpiar web/ de componentes admin

8. **Fase 7** - Configurar Vercel y deploy

---

## NOTAS IMPORTANTES

1. **Convex se queda en la raíz** - Ambas apps usan el mismo backend
2. **No eliminar archivos hasta verificar** que el admin funciona
3. **Las rutas del admin cambian** - de `/admin/services` a `/services` dentro de la app admin
4. **Variables de entorno** - Vite usa `VITE_*` prefix, Astro usa `PUBLIC_*`
5. **CSS** - El admin usa el mismo Tailwind config (copiar configuración)

---

## ESTIMACIÓN DE TIEMPO

- Fase 1: 1-2 horas
- Fase 2: 1-2 horas
- Fase 3: 4-6 horas (migración de componentes)
- Fase 4: 2-3 horas
- Fase 5: 1 hora
- Fase 6: 2-3 horas (testing y fixes)

**Total: 11-17 horas**

---

## 🚀 INSTRUCCIONES POST-MIGRACIÓN

### Pasos Inmediatos

1. **Instalar dependencias:**

   ```bash
   # En el root del proyecto
   npm install

   # Instalar dependencias de cada workspace
   cd web && npm install
   cd ../admin && npm install
   cd ..
   ```

2. **Configurar variables de entorno:**

   **admin/.env:**

   ```
   VITE_CONVEX_URL=tu_convex_url_aqui
   ```

   Copia el valor de `PUBLIC_CONVEX_URL` del archivo `.env` del root.

3. **Probar localmente:**

   ```bash
   # Terminal 1: Convex
   npx convex dev

   # Terminal 2: Web (Astro)
   cd web && npm run dev

   # Terminal 3: Admin (Vite)
   cd admin && npm run dev
   ```

4. **Verificar que funciona:**
   - Web: http://localhost:4321
   - Admin: http://localhost:3001

### Próximos Pasos

1. **Migrar formularios y listas completas:**
   - Copiar los componentes de `src/components/admin/` originales a `admin/src/components/`
   - Adaptar los imports para usar `../../../convex/_generated/api`
   - Actualizar las páginas placeholder con los componentes reales

2. **Limpiar archivos duplicados:**
   - Eliminar el directorio `src/` original del root (ya está en `web/src/`)
   - Eliminar el directorio `public/` original del root (ya está en `web/public/`)

3. **Configurar Vercel:**
   - Añadir `VITE_CONVEX_URL` a las variables de entorno en Vercel
   - Configurar el build command: `turbo run build`
   - Configurar output directory: `web/dist` para el sitio principal

### Estructura Final del Proyecto

```
guardman/
├── convex/              # Backend compartido
├── web/                 # Astro - Sitio público
│   ├── src/
│   ├── public/
│   ├── astro.config.mjs
│   └── package.json
├── admin/               # Vite - CMS Admin
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── lib/
│   │   └── App.tsx
│   ├── vite.config.ts
│   └── package.json
├── package.json         # Root workspace
├── pnpm-workspace.yaml
├── turbo.json
└── vercel.json
```

### Comandos Útiles

```bash
# Desarrollo
npm run dev              # Inicia ambas apps
npm run dev:web          # Solo web
npm run dev:admin        # Solo admin

# Build
npm run build            # Build de ambas apps
npm run build:web        # Solo web
npm run build:admin      # Solo admin

# Linting
npm run lint             # Lint de todo

# Convex
npx convex dev           # Desarrollo
npx convex deploy        # Deploy a producción
```
