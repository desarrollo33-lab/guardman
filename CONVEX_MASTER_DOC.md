# Documentación Maestra de Convex - Guardman

Este documento contiene toda la configuración, esquemas, funciones y detalles técnicos de la integración con **Convex** en el proyecto Guardman.

## 1. Configuración de Entorno (Claves y URLs)

Las variables de entorno se gestionan principalmente en `.env.local` y se exponen al frontend vía Astro.

| Variable | Valor / Descripción |
| :--- | :--- |
| `CONVEX_DEPLOYMENT` | `dev:opulent-cod-610` (Deployment ID) |
| `CONVEX_URL` | `https://opulent-cod-610.convex.cloud` |
| `PUBLIC_CONVEX_URL` | `https://opulent-cod-610.convex.cloud` (Disponible en frontend) |
| `CONVEX_SITE_URL` | `https://opulent-cod-610.convex.site` (Para HTTP actions/webhooks) |

---

## 2. Esquema de Base de Datos (`convex/schema.ts`)

Convex utiliza un esquema tipado que define las tablas, campos e índices.

### Tabla: `leads`
Captura de contactos y clientes potenciales.
- **Campos**: `nombre`, `telefono`, `email` (opc), `servicio`, `ciudad` (opc), `mensaje` (opc), `source` (opc), `utm_source` (opc), `utm_medium` (opc), `utm_campaign` (opc), `status` (opc), `createdAt` (number).
- **Índices**: `by_status` ([`status`]), `by_createdAt` ([`createdAt`]).

### Tabla: `services`
Contingencia y detalles de los servicios ofrecidos.
- **Campos**: `id`, `slug`, `title`, `description`, `tagline`, `icon`, `features` (array), `benefits` (array), `cta`, `industries` (opc), `meta_title`, `meta_description`, `og_image`, `solutions` (opc).
- **Índices**: `by_slug` ([`slug`]), `by_solutions` ([`solutions`]).

### Tabla: `communes`
Ubicaciones y SEO local.
- **Campos**: `name`, `slug`, `zone` (opc), `isOtherCity` (opc), `meta_title`, `meta_description`.
- **Índices**: `by_slug` ([`slug`]), `by_zone` ([`zone`]), `by_isOtherCity` ([`isOtherCity`]).

### Tabla: `solutions`
Segmentos industriales o casos de uso.
- **Campos**: `id`, `slug`, `name`, `description`, `icon`, `meta_title`, `meta_description`, `challenges` (array), `solutions` (array opc), `relatedServices` (array opc).
- **Índices**: `by_slug` ([`slug`]).

### Tabla: `faqs`
Preguntas frecuentes.
- **Campos**: `id`, `question`, `answer`, `category`, `order`.
- **Índices**: `by_category` ([`category`]), `by_order` ([`order`]).

---

## 3. Funciones del Backend (`convex/`)

### Leads (`leads.ts`)
- **`createLead` (Mutation)**: Inserta un lead y activa un webhook de notificación.
- **`triggerWebhook` (Action)**: Envía los datos del lead a un endpoint externo (ej. Zapier/Make).
- **`getLeads`**, **`getLeadsByStatus`**, **`getLeadById`** (Queries).
- **`getLeadsCount`** (Query): Estadísticas por estado.
- **`updateLeadStatus`** (Mutation): Cambia el estado del lead (`new`, `contacted`, etc).

### Servicios (`services.ts`)
- **`getAllServices`**, **`getServiceBySlug`**, **`getServicesBySolution`** (Queries).
- **`seedServices` (Mutation)**: Poblado inicial de datos de servicios.

### Soluciones (`solutions.ts`)
- **`getAllSolutions`**, **`getSolutionBySlug`** (Queries).
- **`seedSolutions` (Mutation)**: Poblado inicial de datos de soluciones.

### Ubicaciones (`locations.ts`)
- **`getAllCommunes`**, **`getCommuneBySlug`**, **`getCommunesByZone`**, **`getOtherCities`**, **`getAllLocations`** (Queries).
- **`seedCommunes` (Mutation)**: Poblado de las 52 comunas de la RM y principales ciudades.

### FAQs (`faqs.ts`)
- **`getAllFaqs`**, **`getFaqsByCategory`** (Queries).
- **`seedFaqs` (Mutation)**: Poblado de datos de preguntas frecuentes.

---

## 4. Integración Frontend (`src/lib/convex.ts`)

El proyecto utiliza dos clientes dependiendo del contexto de ejecución:

### Cliente Servidor (Astro SSR)
Utiliza `ConvexHttpClient` para consultas rápidas vía HTTP sin necesidad de WebSockets.
```typescript
import { convexServer } from '@/lib/convex';
const services = await convexServer.query(api.services.getAllServices);
```

### Cliente React (Componentes Interactivos)
Utiliza `ConvexReactClient` con `ConvexProvider` para formularios y dashboards en tiempo real.
```typescript
import { convex } from '@/lib/convex';
// Usado dentro de ConvexProvider en componentes React
```

---

## 5. Relaciones de Datos

- **Servicios <-> Soluciones**: Los servicios tienen una propiedad `solutions` (array de slugs) que los vincula con industrias específicas.
- **Soluciones <-> Servicios**: Las soluciones tienen `relatedServices` (array de slugs) para recomendar servicios específicos.
- **Leads <-> Servicios/Ubicaciones**: Los leads guardan strings descriptivos de `servicio` y `ciudad` para trazabilidad inmediata.

---

## 6. Rutas y Endpoints
- **Dashboard Admin**: `src/components/admin/` utiliza Convex para gestionar leads.
- **Formularios**: `src/components/forms/` utiliza `api.leads.createLead` para captación.
- **Páginas Dinámicas**: Astro utiliza los slugs de `services`, `solutions` y `communes` para generar rutas estáticas y dinámicas.
