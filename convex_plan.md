# Guardman Chile — Convex Database Audit & Local SEO Domination Plan

> **Objective**: Complete blueprint to rebuild the Guardman web platform from scratch using Convex as the sole backend, with a laser focus on dominating local SEO for security services in Chile's Región Metropolitana (52+ communes).

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Current Database Audit](#2-current-database-audit)
3. [Table Relationships Map](#3-table-relationships-map)
4. [Frontend Data Usage Map](#4-frontend-data-usage-map)
5. [Admin CMS Data Usage Map](#5-admin-cms-data-usage-map)
6. [Identified Problems & Debt](#6-identified-problems--debt)
7. [Local SEO Strategy](#7-local-seo-strategy)
8. [Proposed Schema Changes](#8-proposed-schema-changes)
9. [New Tables Required](#9-new-tables-required)
10. [Page Architecture & URL Strategy](#10-page-architecture--url-strategy)
11. [Structured Data (Schema.org) Blueprint](#11-structured-data-schemaorg-blueprint)
12. [Internal Linking Strategy](#12-internal-linking-strategy)
13. [Content Strategy for SEO](#13-content-strategy-for-seo)
14. [Technical SEO Checklist](#14-technical-seo-checklist)
15. [Implementation Roadmap](#15-implementation-roadmap)
16. [Competitive Landscape](#16-competitive-landscape-chile-security-market)
17. [Convex Performance Optimization](#17-convex-performance-optimization)
18. [Advanced Schema.org Implementation](#18-advanced-schemaorg-implementation)
19. [Data Unification Strategy](#19-data-unification-strategy)
20. [Execution Plan — Schema Cleanup (Phase 1)](#20-execution-plan--schema-cleanup-phase-1)
21. [Execution Plan — Frontend (Phase 2)](#21-execution-plan--frontend-phase-2)
22. [Refine CMS Evaluation](#22-refine-cms-evaluation)
23. [Thin Content Avoidance Strategy](#23-thin-content-avoidance-strategy)
24. [Google Local Pack Domination Checklist (2025)](#24-google-local-pack-domination-checklist-2025)
25. [Design System — Visual DNA](#25-design-system--visual-dna)
26. [Component Registry — Data Mapping](#26-component-registry--data-mapping)
27. [Page-by-Page Blueprint](#27-page-by-page-blueprint)
28. [Zero Hardcoded Text — Complete Content Externalization](#28-zero-hardcoded-text--complete-content-externalization)
29. [Refine CMS Integration — Admin UX & Data Flow](#29-refine-cms-integration--admin-ux--data-flow)
30. [Photography & Image SEO Treatment](#30-photography--image-seo-treatment)
31. [Advanced Local SEO — Chile Market Domination](#31-advanced-local-seo--chile-market-domination)
32. [File Tree Architecture Blueprint](#32-file-tree-architecture-blueprint)

---

## 1. Architecture Overview

### Current Stack
| Layer | Technology | Notes |
|-------|-----------|-------|
| **Frontend** | Astro 5 (SSR) | `web/` directory, server-rendered via `convexServer` |
| **Admin CMS** | React + Vite | `admin/` directory, SPA at `/admin` |
| **Backend/DB** | Convex | Real-time, serverless, TypeScript-native |
| **Auth** | `@convex-dev/auth` (Password) | Email+password, role-based (`admin`/`user`) |
| **Hosting** | Vercel | SSR functions + static assets |
| **Styling** | Tailwind CSS | Shared config between web and admin |

### Data Flow
```
┌─────────────┐     SSR (Node)      ┌───────────┐
│   Astro     │ ──convexServer───▶  │  Convex   │
│  Frontend   │     queries         │  Backend  │
└─────────────┘                     └───────────┘
                                         ▲
┌─────────────┐  React useQuery/     ┌───┘
│  Admin CMS  │  useMutation         │
│  (React)    │ ─────────────────────┘
└─────────────┘
```

---

## 2. Current Database Audit

### 2.1 Complete Table Inventory

The schema defines **22 tables** (including auth system tables). Below is every table with its fields, types, indexes, and current status.

---

#### `users` (Auth)
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `name` | `string` | ❌ | Display name |
| `image` | `string` | ❌ | Avatar URL |
| `email` | `string` | ❌ | Login email |
| `role` | `string` | ❌ | `"admin"` or `"user"` |

**Indexes**: `by_email` → `[email]`
**Auth Tables**: `...authTables` adds `authSessions`, `authAccounts`, `authRefreshTokens`, `authVerificationCodes`, `authRateLimits`, `authVerifiers`

---

#### `leads`
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `nombre` | `string` | ✅ | Contact name |
| `telefono` | `string` | ✅ | Phone |
| `email` | `string` | ❌ | Email |
| `servicio` | `string` | ✅ | Service requested |
| `ciudad` | `string` | ❌ | City/commune |
| `mensaje` | `string` | ❌ | Message body |
| `source` | `string` | ❌ | Lead source page |
| `utm_source` | `string` | ❌ | UTM tracking |
| `utm_medium` | `string` | ❌ | UTM tracking |
| `utm_campaign` | `string` | ❌ | UTM tracking |
| `status` | `string` | ❌ | `new`, `contacted`, `qualified`, `converted`, `lost` |
| `createdAt` | `number` | ✅ | Unix timestamp |

**Indexes**: `by_status`, `by_createdAt`
**Functions**: `createLead` (mutation + webhook), `getLeads` (paginated), `getLeadsByStatus`, `updateLeadStatus`, `getLeadById`, `getLeadsCount`

---

#### `services`
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | `string` | ❌ | Legacy string ID |
| `slug` | `string` | ✅ | URL slug |
| `title` | `string` | ✅ | Service name |
| `description` | `string` | ✅ | Description |
| `tagline` | `string` | ❌ | Short tagline |
| `icon` | `string` | ❌ | Icon identifier |
| `features` | `string[]` | ❌ | Feature list |
| `benefits` | `string[]` | ❌ | Benefits list |
| `cta` | `string` | ❌ | CTA button text |
| `solutions` | `string[]` | ❌ | Related solution slugs |
| `industries` | `string[]` | ❌ | Related industry slugs |
| `image` | `string` | ❌ | Cover image URL |
| `meta_title` | `string` | ❌ | SEO title |
| `meta_description` | `string` | ❌ | SEO description |
| `is_active` | `boolean` | ❌ | Visibility flag |
| `order` | `number` | ❌ | Sort order |

**Indexes**: `by_slug`
**Seed Data**: 6 services (guardias, patrullaje, alarmas-ajax, guardpod, drones, control-acceso)
**Functions**: `getAllServices`, `getServiceBySlug`, `getServicesBySolution`, `createService`, `updateService`, `deleteService` (soft), `reorderServices`, `seedServices`

---

#### `solutions`
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | `string` | ❌ | Legacy |
| `slug` | `string` | ✅ | URL slug |
| `title` | `string` | ❌ | ⚠️ Should be required |
| `name` | `string` | ❌ | Legacy field |
| `description` | `string` | ✅ | |
| `icon` | `string` | ❌ | |
| `features` | `string[]` | ❌ | |
| `benefits` | `string[]` | ❌ | |
| `cta` | `string` | ❌ | |
| `industries` | `string[]` | ❌ | Industry slugs |
| `meta_title` | `string` | ❌ | |
| `meta_description` | `string` | ❌ | |
| `og_image` | `string` | ❌ | |
| `solutions` | `string[]` | ❌ | ⚠️ Self-referencing, confusing name |
| `image` | `string` | ❌ | |
| `challenges` | `string[]` | ❌ | Industry challenges |
| `relatedServices` | `string[]` | ❌ | Service slug references |
| `is_active` | `boolean` | ❌ | |
| `order` | `number` | ❌ | |

**Indexes**: `by_slug`, `by_solutions`
**Seed Data**: 8 solutions (condominios, minería, retail, construcción, hotelería, inmobiliaria, eventos, corporativo)
**Functions**: Full CRUD + seed + reorder

---

#### `communes`
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `name` | `string` | ✅ | Commune name |
| `slug` | `string` | ✅ | URL slug |
| `zone` | `string` | ❌ | `centro`, `norte`, `sur`, `oriente`, `poniente` |
| `isOtherCity` | `boolean` | ❌ | Non-RM cities |
| `meta_title` | `string` | ❌ | SEO |
| `meta_description` | `string` | ❌ | SEO |
| `hero_title` | `string` | ❌ | Custom hero |
| `hero_subtitle` | `string` | ❌ | Custom hero |
| `intro_content` | `string` | ❌ | Custom intro text |

**Indexes**: `by_slug`, `by_zone`, `by_isOtherCity`
**Seed Data**: 52 RM communes + 5 other cities
**Functions**: CRUD via `communes.ts`, queries via `locations.ts` (`getAllCommunes`, `getCommuneBySlug`, `getCommunesByZone`, `getOtherCities`, `getAllLocations`, `seedCommunes`)

---

#### `faqs`
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | `string` | ❌ | Legacy |
| `question` | `string` | ✅ | |
| `answer` | `string` | ✅ | |
| `category` | `string` | ✅ | e.g. `guardias`, `alarmas`, `precios` |
| `order` | `number` | ✅ | |

**Indexes**: `by_category`, `by_order`
**Seed Data**: 10 FAQs
**Functions**: Full CRUD + seed + reorder

---

#### `site_config` (Singleton)
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `is_active` | `boolean` | ✅ | Singleton marker |
| `brand_name` | `string` | ✅ | |
| `phone_primary` | `string` | ✅ | |
| `phone_secondary` | `string` | ❌ | |
| `whatsapp_number` | `string` | ✅ | |
| `email_contact` | `string` | ✅ | |
| `address_main` | `string` | ❌ | |
| `social_links` | `object` | ✅ | `{instagram, linkedin, facebook, youtube}` |
| `navbar_items` | `array` | ✅ | Navigation structure with children |
| `footer_config` | `any` | ❌ | Untyped JSON |

**Indexes**: `by_active`
**Functions**: `get`, `update` (upsert pattern)

---

#### `pages`
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `slug` | `string` | ✅ | e.g. `/`, `/servicios` |
| `title` | `string` | ✅ | Internal name |
| `seo_title` | `string` | ✅ | |
| `seo_description` | `string` | ✅ | |
| `seo_keywords` | `string[]` | ❌ | |
| `og_image` | `string` | ❌ | |
| `is_published` | `boolean` | ✅ | |

**Indexes**: `by_slug`
**Functions**: `getBySlug`, `getAll` (⚠️ NO CRUD mutations)

---

#### `content_blocks`
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `page_slug` | `string` | ✅ | FK to `pages.slug` |
| `type` | `string` | ✅ | Component type |
| `order` | `number` | ✅ | Render order |
| `title` | `string` | ❌ | |
| `subtitle` | `string` | ❌ | |
| `content` | `string` | ❌ | Markdown/HTML |
| `data` | `any` | ✅ | ⚠️ Untyped flexible JSON |
| `is_visible` | `boolean` | ✅ | |

**Indexes**: `by_page_order` → `[page_slug, order]`
**Functions**: `getByPage` (⚠️ NO CRUD mutations)

---

#### `testimonials`
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `author` | `string` | ✅ | |
| `role` | `string` | ❌ | |
| `company` | `string` | ❌ | |
| `quote` | `string` | ✅ | |
| `rating` | `number` | ✅ | 1-5 |
| `image_url` | `string` | ❌ | |
| `verified` | `boolean` | ✅ | |
| `order` | `number` | ❌ | |

**Indexes**: `by_order`
**Functions**: Full CRUD + reorder (with rating validation 1-5)

---

#### `partners`
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `name` | `string` | ✅ | |
| `logo_url` | `string` | ✅ | |
| `type` | `string` | ✅ | `certification`, `client`, `tech_partner` |
| `url` | `string` | ❌ | Website URL |
| `order` | `number` | ✅ | |
| `quote` | `string` | ❌ | Testimonial quote |
| `industry` | `string` | ❌ | |
| `icon` | `string` | ❌ | |

**Indexes**: `by_type`
**Functions**: Full CRUD + reorder

---

#### `blog_posts`
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `slug` | `string` | ✅ | |
| `title` | `string` | ✅ | |
| `excerpt` | `string` | ✅ | |
| `cover_image` | `string` | ✅ | |
| `author` | `string` | ✅ | Author name (string, not FK) |
| `author_id` | `string` | ❌ | ⚠️ String, not `Id<"authors">` |
| `published_at` | `number` | ✅ | Unix timestamp |
| `read_time` | `number` | ✅ | Minutes |
| `tags` | `string[]` | ✅ | |
| `is_featured` | `boolean` | ✅ | |
| `is_published` | `boolean` | ❌ | |
| `content` | `array<{type, content, alt?, caption?, items?}>` | ✅ | Structured sections |

**Indexes**: `by_slug`
**Functions**: Full CRUD + `publishPost`, `unpublishPost`, `getPublishedPosts`, `getFeaturedPosts`

---

#### `heroes`
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `page_slug` | `string` | ✅ | Page identifier |
| `title` | `string` | ✅ | |
| `subtitle` | `string` | ❌ | |
| `background_type` | `union('youtube','image')` | ✅ | |
| `youtube_id` | `string` | ❌ | |
| `image_url` | `string` | ❌ | |
| `mobile_image_url` | `string` | ❌ | |
| `ctas` | `array<{text, href, variant?}>` | ❌ | |
| `badges` | `array<{text, icon?}>` | ❌ | |
| `is_active` | `boolean` | ❌ | |

**Indexes**: `by_page_slug`
**Functions**: Full CRUD + `getHeroByPage`, `getActiveHeroes`

---

#### `team_members`
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `name` | `string` | ✅ | |
| `role` | `string` | ✅ | |
| `avatar_url` | `string` | ❌ | |
| `bio` | `string` | ❌ | |
| `order` | `number` | ✅ | |
| `is_active` | `boolean` | ❌ | |

**Indexes**: `by_order`
**Functions**: Full CRUD + reorder

---

#### `company_values`
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `title` | `string` | ✅ | |
| `icon` | `string` | ❌ | |
| `description` | `string` | ✅ | |
| `order` | `number` | ✅ | |

**Indexes**: `by_order`
**Functions**: Full CRUD + reorder

---

#### `process_steps`
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `page_slug` | `string` | ✅ | |
| `number` | `number` | ✅ | Step number |
| `title` | `string` | ✅ | |
| `description` | `string` | ✅ | |
| `order` | `number` | ✅ | |

**Indexes**: `by_page_slug`
**Functions**: Full CRUD + `getByPage`

---

#### `stats`
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `page_slug` | `string` | ✅ | |
| `value` | `string` | ✅ | Display value e.g. `"500+"` |
| `label` | `string` | ✅ | e.g. `"Clientes"` |
| `icon` | `string` | ❌ | |
| `order` | `number` | ✅ | |

**Indexes**: `by_page_slug`
**Functions**: Full CRUD + reorder

---

#### `industries`
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `name` | `string` | ✅ | |
| `slug` | `string` | ✅ | |
| `icon` | `string` | ❌ | |
| `description` | `string` | ❌ | |
| `order` | `number` | ❌ | |
| `is_active` | `boolean` | ❌ | |
| `id` | `string` | ❌ | Legacy |
| `challenges` | `any` | ❌ | Legacy, untyped |
| `meta_title` | `string` | ❌ | |
| `meta_description` | `string` | ❌ | |
| `relatedServices` | `any` | ❌ | Legacy, untyped |
| `solutions` | `any` | ❌ | Legacy, untyped |

**Indexes**: `by_slug`, `by_order`
**Functions**: Full CRUD + reorder + `getActiveIndustries`

---

#### `ctas`
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `page_slug` | `string` | ✅ | |
| `headline` | `string` | ✅ | |
| `subheadline` | `string` | ❌ | |
| `buttons` | `array<{text, href, variant?}>` | ✅ | |
| `badges` | `string[]` | ❌ | |
| `background_type` | `union('image','gradient')` | ❌ | |
| `background_value` | `string` | ❌ | |

**Indexes**: `by_page_slug`
**Functions**: Full CRUD

---

#### `authors`
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `name` | `string` | ✅ | |
| `slug` | `string` | ✅ | |
| `avatar_url` | `string` | ❌ | |
| `bio` | `string` | ❌ | |
| `role` | `string` | ❌ | |

**Indexes**: `by_slug`
**Functions**: Full CRUD

---

#### `files` (Storage)
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `storageId` | `Id<"_storage">` | ✅ | Convex storage reference |
| `fileName` | `string` | ✅ | |
| `fileType` | `string` | ✅ | MIME type |
| `fileSize` | `number` | ✅ | Bytes |
| `uploadedBy` | `string` | ❌ | User ID |
| `createdAt` | `number` | ✅ | |

**Indexes**: `by_storageId`
**Functions**: `generateUploadUrl`, `saveFileMetadata`, `getFileUrl`, `deleteFile`, `getFileMetadata`, `listFiles`

---

## 3. Table Relationships Map

### Relationship Diagram

```
┌──────────────┐     slug ref      ┌──────────────┐
│   services   │◄─────────────────│   solutions  │
│              │  relatedServices  │              │
└──────┬───────┘                   └──────┬───────┘
       │ solutions[] (slug)                │ industries[] (slug)
       ▼                                   ▼
┌──────────────┐                   ┌──────────────┐
│  solutions   │                   │  industries  │
└──────────────┘                   └──────────────┘

┌──────────────┐     page_slug     ┌──────────────┐
│    pages     │◄─────────────────│content_blocks│
└──────────────┘                   └──────────────┘
       ▲ page_slug                         
       ├──────────────────────────│   heroes     │
       ├──────────────────────────│   ctas       │
       ├──────────────────────────│process_steps │
       └──────────────────────────│   stats      │

┌──────────────┐     author (name) ┌──────────────┐
│  blog_posts  │───────────────── │   authors    │
└──────────────┘  author_id (str)  └──────────────┘

┌──────────────┐     type filter   ┌──────────────┐
│   partners   │  ("client",       │              │
│              │   "certification") │              │
└──────────────┘                   └──────────────┘

┌──────────────┐     servicio      ┌──────────────┐
│    leads     │───────────────── │   services   │
│              │  (string match)   └──────────────┘
│              │     ciudad        ┌──────────────┐
│              │───────────────── │   communes   │
└──────────────┘  (string match)   └──────────────┘
```

### Key Relationship Issues

| Issue | Description | Impact |
|-------|-------------|--------|
| **String-based FKs** | All relationships use string slugs, not `Id<"table">` references | No referential integrity |
| **Duplicate naming** | `solutions.solutions` field is confusing (self-referencing array) | Maintenance confusion |
| **Legacy fields** | `solutions.name`, `services.id`, `industries.id` are legacy | Schema debt |
| **Untyped `v.any()`** | `content_blocks.data`, `site_config.footer_config`, `industries.challenges/relatedServices/solutions` | No validation |
| **No author FK** | `blog_posts.author_id` is `string`, not `Id<"authors">` | Broken relationship |

---

## 4. Frontend Data Usage Map

### Pages and Their Convex Data Sources

| Page | URL | Data Fetched | Convex Queries |
|------|-----|-------------|----------------|
| **Home** | `/` | services, solutions, faqs, site_config, hero(home), content_blocks(/), partners(clients) | `services.getAllServices`, `solutions.getAllSolutions`, `faqs.getAllFaqs`, `site_config.get`, `heroes.getHeroByPage`, `content_blocks.getByPage`, `partners.getAll` |
| **Servicios Index** | `/servicios` | services | `services.getAllServices` |
| **Servicio Detail** | `/servicios/[slug]` | service by slug | `services.getServiceBySlug` |
| **Soluciones Index** | `/soluciones` | solutions | `solutions.getAllSolutions` |
| **Solución Detail** | `/soluciones/[slug]` | solution by slug, related services | `solutions.getSolutionBySlug` |
| **Cobertura Index** | `/cobertura` | all communes | `locations.getAllCommunes` |
| **Comuna Detail** | `/cobertura/[comuna]` | commune, all communes, services | `locations.getCommuneBySlug`, `locations.getAllCommunes`, `services.getAllServices` |
| **Blog Index** | `/blog` | published posts | `blog_posts.getPublishedPosts` |
| **Blog Post** | `/blog/[slug]` | post by slug | `blog_posts.getPostBySlug` |
| **Contacto** | `/contacto` | site_config, services | `site_config.get`, `services.getAllServices` |
| **Cotizar** | `/cotizar` | services, site_config | `services.getAllServices`, `site_config.get` |
| **Nosotros** | `/nosotros` | team_members, company_values, stats, partners | Multiple queries |
| **Carreras** | `/carreras` | (Static content) | None |
| **Privacidad** | `/privacidad` | (Static content) | None |

### SEO Components Used

| Component | Schema Type | Where Used |
|-----------|------------|------------|
| `OrganizationSchema` | `Organization` | Home page |
| `FAQSchema` | `FAQPage` | Home page, service pages |
| `LocalBusinessSchema` | `LocalBusiness` | Cobertura/[comuna] pages |
| `ServiceSchema` | `Service` | Servicios/[slug] pages |
| `BaseLayout` | `<head>` meta tags | All pages |

### Static Data (`data/site.ts`)

Site config is **duplicated** between:
1. `web/src/data/site.ts` — hardcoded TypeScript object
2. `site_config` table — editable via CMS

> ⚠️ **Problem**: Frontend uses both sources inconsistently. `site.ts` is used for phone, address, social links in templates, while CMS `site_config` feeds navbar and brand name.

---

## 5. Admin CMS Data Usage Map

### Admin Routes and CRUD Operations

| Admin Route | Table | Operations |
|------------|-------|------------|
| `/admin/` | leads | Dashboard with lead counts |
| `/admin/leads` | `leads` | List, view, update status |
| `/admin/services` | `services` | CRUD, reorder |
| `/admin/solutions` | `solutions` | CRUD, reorder |
| `/admin/blog` | `blog_posts` | CRUD, publish/unpublish |
| `/admin/heroes` | `heroes` | CRUD per page |
| `/admin/faqs` | `faqs` | CRUD, reorder |
| `/admin/team` | `team_members` | CRUD, reorder |
| `/admin/testimonials` | `testimonials` | CRUD, reorder |
| `/admin/communes` | `communes` | CRUD, SEO fields |
| `/admin/partners` | `partners` | CRUD, reorder |
| `/admin/industries` | `industries` | CRUD, reorder |
| `/admin/authors` | `authors` | CRUD |
| `/admin/company-values` | `company_values` | CRUD, reorder |
| `/admin/process-steps` | `process_steps` | CRUD |
| `/admin/stats` | `stats` | CRUD, reorder |
| `/admin/ctas` | `ctas` | CRUD |
| `/admin/config` | `site_config` | Edit singleton |

### Missing CMS Functionality

| Table | Issue |
|-------|-------|
| `pages` | ❌ **No CRUD mutations** — only read queries exist |
| `content_blocks` | ❌ **No CRUD mutations** — only `getByPage` query |
| `files` | ❌ **No admin UI** — storage management missing |

---

## 6. Identified Problems & Debt

### 6.1 Schema Issues

| # | Problem | Severity | Fix |
|---|---------|----------|-----|
| 1 | `solutions.solutions` field is confusing self-reference | 🟡 Medium | Rename to `solution_items` or remove |
| 2 | `solutions.name` vs `solutions.title` dual fields | 🟡 Medium | Remove `name`, make `title` required |
| 3 | `services.id` and `solutions.id` legacy string IDs | 🟢 Low | Remove, use `_id` |
| 4 | `blog_posts.author_id` is `string`, not `Id<"authors">` | 🔴 High | Change to proper FK reference |
| 5 | `content_blocks.data` uses `v.any()` | 🟡 Medium | Define typed union |
| 6 | `site_config.footer_config` uses `v.any()` | 🟡 Medium | Define typed structure |
| 7 | `industries` has 3 fields typed as `v.any()` | 🟡 Medium | Define proper types or remove |
| 8 | No `order` field on `communes` | 🟢 Low | Add for CMS reordering |
| 9 | No `createdAt`/`updatedAt` on most tables | 🟡 Medium | Add timestamps |
| 10 | No `is_published` on commune pages | 🟡 Medium | Add for SEO control |

### 6.2 Missing CRUD

| # | Problem | Severity |
|---|---------|----------|
| 1 | `pages` table has no create/update/delete mutations | 🔴 High |
| 2 | `content_blocks` table has no CRUD mutations | 🔴 High |
| 3 | No file management admin page | 🟡 Medium |

### 6.3 SEO Deficiencies

| # | Problem | Impact |
|---|---------|--------|
| 1 | No `Service × Commune` cross-reference pages | Missing 300+ potential landing pages |
| 2 | No `AggregateRating` schema in structured data | No star ratings in search results |
| 3 | No `BreadcrumbList` schema on most pages | Poor search result navigation |
| 4 | No sitemap.xml generation | Google can't discover all pages efficiently |
| 5 | `communes` pages lack unique content per service | Thin content risk |
| 6 | No `review` or `rating` system for public display | Missing social proof signals |
| 7 | No `GeoCoordinates` on commune LocalBusiness schema | Missing geo signals |
| 8 | Static `data/site.ts` duplicates CMS `site_config` | Inconsistent NAP |
| 9 | No `canonical` URL management | Potential duplicate content |
| 10 | No `hreflang` tags | Not needed (single language), but no canonical enforcement |
| 11 | Blog content stored as structured blocks, not renderable HTML | Limited rich snippet potential |
| 12 | No `openGraph` image generation per page | Missing visual search presence |

---

## 7. Local SEO Strategy

### 7.1 The Local SEO Domination Formula

For a security company in Chile's RM targeting 52+ communes × 6 services, the winning strategy is **Programmatic SEO** combined with **Local Business Schema** at scale.

### 7.2 Core Pillars

#### Pillar 1: Programmatic Service × Location Pages
Create dedicated landing pages for every combination of **service + commune**:

```
/servicios/guardias-seguridad/las-condes
/servicios/alarmas-ajax/maipu
/servicios/patrullaje-condominios/providencia
...
```

**Total potential pages**: 6 services × 52 communes = **312 unique landing pages** + current 52 commune pages + 6 service pages = **370+ indexed pages**

#### Pillar 2: Local Business Schema per Commune
Each commune page must have `LocalBusiness` JSON-LD with:
- Exact commune name and zone
- GeoCoordinates (lat/lng)
- Service catalog
- AggregateRating
- Opening hours
- NAP consistency

#### Pillar 3: Content Depth
Each page must have **unique, valuable content** — not just template replacements:
- Commune-specific security statistics
- Local challenges and solutions
- Testimonials from that commune
- Nearby commune interlinking
- Service-specific details for that area

#### Pillar 4: Internal Linking Web
```
Home ──▶ Services Index ──▶ Service Detail ──▶ Service+Commune
  │                                                    ▲
  ├──▶ Solutions Index ──▶ Solution Detail ────────────┘
  │                                                    ▲
  └──▶ Cobertura Index ──▶ Commune Detail ─────────────┘
                               │
                               └──▶ Same Zone Communes
```

#### Pillar 5: Google Business Profile Optimization
- Consistent NAP across all pages
- Regular Google Posts
- Photo/video content
- Review collection strategy
- Q&A section management

---

## 8. Proposed Schema Changes

### 8.1 Modify Existing Tables

#### `communes` — ADD fields
```typescript
communes: defineTable({
  // ... existing fields ...
  order: v.optional(v.number()),             // NEW: sort order
  is_published: v.optional(v.boolean()),     // NEW: visibility control
  latitude: v.optional(v.string()),          // NEW: geo coordinates
  longitude: v.optional(v.string()),         // NEW: geo coordinates
  population: v.optional(v.string()),        // NEW: "520.000+"
  security_stats: v.optional(v.object({      // NEW: local crime data
    crime_index: v.optional(v.string()),
    most_common_issue: v.optional(v.string()),
    guardman_clients: v.optional(v.number()),
  })),
  unique_content: v.optional(v.string()),    // NEW: unique paragraph per commune
  related_testimonials: v.optional(v.array(v.string())), // NEW: testimonial IDs
})
```

#### `services` — CLEAN UP
```typescript
services: defineTable({
  // REMOVE: id (legacy)
  slug: v.string(),
  title: v.string(),
  description: v.string(),
  tagline: v.optional(v.string()),
  icon: v.optional(v.string()),
  features: v.optional(v.array(v.string())),
  benefits: v.optional(v.array(v.string())),
  cta: v.optional(v.string()),
  solutions: v.optional(v.array(v.string())),
  industries: v.optional(v.array(v.string())),
  image: v.optional(v.string()),
  meta_title: v.optional(v.string()),
  meta_description: v.optional(v.string()),
  is_active: v.optional(v.boolean()),
  order: v.optional(v.number()),
  // NEW fields for SEO:
  long_description: v.optional(v.string()),  // Extended content for detail pages
  pricing_hint: v.optional(v.string()),      // e.g. "Desde $X/mes"
  faqs: v.optional(v.array(v.object({        // Service-specific FAQs
    question: v.string(),
    answer: v.string(),
  }))),
  schema_type: v.optional(v.string()),       // Schema.org service type
})
```

#### `solutions` — CLEAN UP
```typescript
solutions: defineTable({
  // REMOVE: id, name, solutions (confusing self-ref)
  slug: v.string(),
  title: v.string(),                         // Make REQUIRED
  description: v.string(),
  // ... keep rest ...
  // NEW:
  long_description: v.optional(v.string()),
  faqs: v.optional(v.array(v.object({
    question: v.string(),
    answer: v.string(),
  }))),
})
```

#### `blog_posts` — FIX author reference
```typescript
blog_posts: defineTable({
  // ...existing...
  author_id: v.optional(v.id('authors')),    // CHANGE from string to proper FK
  // NEW:
  seo_title: v.optional(v.string()),
  seo_description: v.optional(v.string()),
  canonical_url: v.optional(v.string()),
})
```

#### `industries` — CLEAN UP legacy
```typescript
industries: defineTable({
  name: v.string(),
  slug: v.string(),
  icon: v.optional(v.string()),
  description: v.optional(v.string()),
  order: v.optional(v.number()),
  is_active: v.optional(v.boolean()),
  // REMOVE: id, challenges (any), relatedServices (any), solutions (any)
  // REPLACE with typed:
  challenges: v.optional(v.array(v.string())),
  related_services: v.optional(v.array(v.string())),  // service slugs
  related_solutions: v.optional(v.array(v.string())), // solution slugs
  meta_title: v.optional(v.string()),
  meta_description: v.optional(v.string()),
})
```

#### `site_config` — TYPE the footer
```typescript
site_config: defineTable({
  // ...existing typed fields...
  footer_config: v.optional(v.object({       // REPLACE v.any()
    columns: v.array(v.object({
      title: v.string(),
      links: v.array(v.object({
        label: v.string(),
        href: v.string(),
      })),
    })),
    bottom_text: v.optional(v.string()),
  })),
  // NEW:
  gtm_id: v.optional(v.string()),           // Google Tag Manager
  ga_id: v.optional(v.string()),            // Google Analytics
  schema_logo: v.optional(v.string()),       // Logo URL for Schema.org
  default_og_image: v.optional(v.string()),  // Default OG image
})
```

---

## 9. New Tables Required

### 9.1 `service_locations` — Programmatic SEO Cross-Reference

```typescript
service_locations: defineTable({
  service_slug: v.string(),                  // FK to services.slug
  commune_slug: v.string(),                  // FK to communes.slug
  // Unique content per combination
  meta_title: v.optional(v.string()),        // e.g. "Guardias de Seguridad en Las Condes"
  meta_description: v.optional(v.string()),
  hero_title: v.optional(v.string()),
  intro_content: v.optional(v.string()),     // Unique paragraph
  local_benefits: v.optional(v.array(v.string())),
  local_stats: v.optional(v.object({
    clients_in_area: v.optional(v.number()),
    response_time: v.optional(v.string()),
  })),
  is_published: v.optional(v.boolean()),
  // Auto-generated fields
  auto_content: v.optional(v.string()),      // AI-generated unique content
})
  .index('by_service', ['service_slug'])
  .index('by_commune', ['commune_slug'])
  .index('by_service_commune', ['service_slug', 'commune_slug'])
```

**Purpose**: Powers `/servicios/[servicio]/[comuna]` pages. Each row = 1 landing page.

### 9.2 `reviews` — Public Review System for AggregateRating

```typescript
reviews: defineTable({
  author_name: v.string(),
  commune_slug: v.optional(v.string()),      // Where the review came from
  service_slug: v.optional(v.string()),      // What service was reviewed
  rating: v.number(),                        // 1-5
  text: v.string(),
  source: v.optional(v.string()),            // "google", "website", "whatsapp"
  is_verified: v.boolean(),
  is_published: v.boolean(),
  created_at: v.number(),
  response: v.optional(v.string()),          // Business response
  response_at: v.optional(v.number()),
})
  .index('by_commune', ['commune_slug'])
  .index('by_service', ['service_slug'])
  .index('by_rating', ['rating'])
  .index('by_published', ['is_published'])
```

**Purpose**: Powers `AggregateRating` schema markup, testimonial sections, and Google review display.

### 9.3 `redirects` — SEO Redirect Management

```typescript
redirects: defineTable({
  from_path: v.string(),
  to_path: v.string(),
  status_code: v.number(),                  // 301 or 302
  is_active: v.boolean(),
  created_at: v.number(),
})
  .index('by_from', ['from_path'])
```

### 9.4 `seo_metadata` — Global SEO Override

```typescript
seo_metadata: defineTable({
  page_path: v.string(),                     // URL path
  title: v.optional(v.string()),
  description: v.optional(v.string()),
  canonical_url: v.optional(v.string()),
  og_image: v.optional(v.string()),
  no_index: v.optional(v.boolean()),
  priority: v.optional(v.number()),          // Sitemap priority 0.0-1.0
  change_frequency: v.optional(v.string()),  // "daily", "weekly", "monthly"
})
  .index('by_path', ['page_path'])
```

---

## 10. Page Architecture & URL Strategy

### 10.1 Complete URL Map

```
/                                    → Home (priority: 1.0)
├── /servicios                       → Services index (0.9)
│   ├── /servicios/guardias-seguridad
│   │   ├── /servicios/guardias-seguridad/las-condes    ← NEW (pSEO)
│   │   ├── /servicios/guardias-seguridad/maipu         ← NEW (pSEO)
│   │   └── ... (52 communes per service)
│   ├── /servicios/alarmas-ajax
│   ├── /servicios/patrullaje-condominios
│   ├── /servicios/guardpod
│   ├── /servicios/drones-seguridad
│   └── /servicios/control-acceso
├── /soluciones                      → Solutions index (0.8)
│   ├── /soluciones/condominios
│   ├── /soluciones/mineria
│   └── ... (8 solutions)
├── /cobertura                       → Coverage index (0.9)
│   ├── /cobertura/las-condes
│   ├── /cobertura/maipu
│   └── ... (52+ communes)
├── /blog                            → Blog index (0.7)
│   └── /blog/[slug]
├── /nosotros                        → About (0.5)
├── /contacto                        → Contact (0.8)
├── /cotizar                         → Quote form (0.9)
├── /carreras                        → Careers (0.3)
├── /privacidad                      → Privacy (0.1)
└── /sitemap.xml                     → Dynamic sitemap ← NEW
```

### 10.2 Page Count Projection

| Category | Pages | Status |
|----------|-------|--------|
| Static pages | 7 | ✅ Existing |
| Service detail | 6 | ✅ Existing |
| Solution detail | 8 | ✅ Existing |
| Commune coverage | 52 | ✅ Existing |
| **Service × Commune** | **312** | 🆕 NEW |
| Blog posts | ~10+ | ✅ Existing |
| **Total** | **~395** | vs current ~83 |

### 10.3 Title Tag Templates

| Page Type | Template |
|-----------|----------|
| Service × Commune | `{Service} en {Commune} \| Guardman Chile` |
| Commune | `Seguridad Privada en {Commune} \| Guardman` |
| Service | `{Service} \| Guardman Chile` |
| Solution | `Seguridad para {Solution} \| Guardman Chile` |
| Blog | `{Title} \| Blog Guardman` |
| Home | `Guardman Chile \| Seguridad Privada en Santiago` |

### 10.4 Meta Description Templates

| Page Type | Template |
|-----------|----------|
| Service × Commune | `Servicio de {service} en {commune}. {tagline}. Cotiza sin compromiso. Guardman Chile.` |
| Commune | `Empresa de seguridad privada en {commune}, RM. Guardias OS10, alarmas Ajax y más. Cotiza hoy.` |
| Service | `{meta_description from DB}` |

---

## 11. Structured Data (Schema.org) Blueprint

### 11.1 Schema Types per Page

| Page | Schema Types | Status |
|------|-------------|--------|
| Home | `Organization`, `FAQPage`, `WebSite`, `WebPage` | ⚠️ Needs `WebSite` + `AggregateRating` |
| Service | `Service`, `FAQPage`, `BreadcrumbList` | ⚠️ Needs `BreadcrumbList` + `AggregateRating` |
| Service×Commune | `LocalBusiness`, `Service`, `FAQPage`, `BreadcrumbList`, `AggregateRating` | 🆕 NEW |
| Commune | `LocalBusiness`, `BreadcrumbList`, `AggregateRating` | ⚠️ Needs `AggregateRating` |
| Solution | `Service`, `BreadcrumbList` | ⚠️ Needs `BreadcrumbList` |
| Blog Post | `Article`, `BreadcrumbList`, `Person` (author) | 🆕 NEW |
| About | `Organization`, `Person[]` (team) | 🆕 NEW |

### 11.2 AggregateRating Implementation

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Guardman Chile - Las Condes",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "127",
    "bestRating": "5",
    "worstRating": "1"
  }
}
```

**Data source**: New `reviews` table → aggregate query per commune/service.

### 11.3 Enhanced LocalBusiness Schema

```json
{
  "@context": "https://schema.org",
  "@type": "SecurityService",
  "@id": "https://guardman.cl/cobertura/las-condes",
  "name": "Guardman Chile - Seguridad en Las Condes",
  "url": "https://guardman.cl/cobertura/las-condes",
  "telephone": "+56930000010",
  "email": "info@guardman.cl",
  "priceRange": "$$",
  "openingHours": "Mo-Su 00:00-23:59",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Las Condes",
    "addressRegion": "Región Metropolitana",
    "addressCountry": "CL"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "-33.4067",
    "longitude": "-70.5673"
  },
  "areaServed": {
    "@type": "City",
    "name": "Las Condes"
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Servicios de Seguridad en Las Condes",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Guardias de Seguridad OS10"
        }
      }
    ]
  },
  "aggregateRating": { "..." : "..." }
}
```

> **Note**: Use `SecurityService` (schema.org subtype of `LocalBusiness`) for richer categorization.

---

## 12. Internal Linking Strategy

### 12.1 Link Architecture

Every page should connect to related pages, creating a dense crawl web:

| From → To | Link Type | Example |
|-----------|-----------|---------|
| Home → Service | Service grid cards | "Guardias de Seguridad" → `/servicios/guardias-seguridad` |
| Home → Solution | Solution grid cards | "Condominios" → `/soluciones/condominios` |
| Service → Service×Commune | "Disponible en..." section | `/servicios/guardias-seguridad` → `/servicios/guardias-seguridad/las-condes` |
| Commune → Service×Commune | Service cards on commune page | `/cobertura/las-condes` → `/servicios/guardias-seguridad/las-condes` |
| Service×Commune → Commune | Breadcrumb + "Ver toda la cobertura en..." | Back to commune page |
| Service×Commune → Service | Breadcrumb + "Más sobre..." | Back to service page |
| Commune → Same-Zone Communes | "Otras comunas en zona..." | Zone-based links |
| Blog → Service | Contextual in-content links | Related service mentions |
| Blog → Commune | Location mentions | "En Las Condes, recomendamos..." |
| Service → Solution | "Ideal para..." | Cross-references |

### 12.2 Breadcrumb Pattern

```
Home > Servicios > Guardias de Seguridad > Las Condes
Home > Cobertura > Las Condes
Home > Soluciones > Condominios
Home > Blog > [Post Title]
```

---

## 13. Content Strategy for SEO

### 13.1 Unique Content Requirements per Page Type

#### Service × Commune Pages (312 pages)
Each page needs **minimum 300 words of unique content**: 
1. **Intro paragraph**: Mention commune name, service, and local context (2-3 sentences)
2. **Local challenges**: What security issues are common in that commune
3. **How Guardman solves them**: Service features applied locally
4. **Local stats**: If available (clients in area, response time)
5. **Testimonial**: Related review from that commune
6. **FAQ**: 2-3 FAQs combining service and location

> 💡 **AI content generation**: Use a seed mutation to auto-generate initial content from templates, then allow CMS editing for refinement.

#### Commune Pages (52 pages)
Enhance with:
1. Local security statistics
2. Zone-specific challenges
3. All services available with links
4. Google Maps embed
5. Local testimonials
6. Contact form pre-filled with commune

#### Blog Posts
Target keywords like:
- "seguridad privada {commune}" 
- "alarmas para condominios {zone}"
- "como elegir empresa de seguridad en Chile"
- "certificación OS10 que es"

### 13.2 Keyword Strategy

| Cluster | Primary Keywords | Pages |
|---------|-----------------|-------|
| **Brand** | "guardman chile", "guardman seguridad" | Home |
| **Service + Location** | "guardias seguridad las condes", "alarmas ajax maipu" | Service×Commune |
| **Service Generic** | "guardias de seguridad privada chile", "alarmas ajax chile" | Service detail |
| **Solution** | "seguridad para condominios", "seguridad para minería" | Solution detail |
| **Coverage** | "empresa seguridad {commune}", "seguridad privada {commune}" | Commune pages |
| **Informational** | "certificación os10", "como elegir empresa seguridad" | Blog posts |

---

## 14. Technical SEO Checklist

### 14.1 Must-Have Technical Items

- [ ] **Dynamic sitemap.xml** — Generated from Convex, including all service×commune pages
- [ ] **robots.txt** — Properly configured, sitemap reference
- [ ] **Canonical URLs** — On every page, managed via CMS
- [ ] **404 handling** — Custom 404 page with search and links
- [ ] **301 redirects** — Managed via `redirects` table
- [ ] **Mobile responsive** — All pages, especially service×commune
- [ ] **Core Web Vitals** — LCP < 2.5s, FID < 100ms, CLS < 0.1
- [ ] **Image optimization** — WebP/AVIF, lazy loading, proper `alt` text
- [ ] **Structured data validation** — All schemas pass Google Rich Results Test
- [ ] **NAP consistency** — Same phone, address, email everywhere
- [ ] **SSL certificate** — HTTPS on all pages
- [ ] **Google Search Console** — Verified, sitemap submitted
- [ ] **Google Analytics 4** — Tracking configured
- [ ] **Google Tag Manager** — Event tracking for leads
- [ ] **Open Graph images** — Auto-generated per page type
- [ ] **Twitter cards** — Summary with large image

### 14.2 Performance Targets

| Metric | Target | Tool |
|--------|--------|------|
| Lighthouse Performance | > 90 | Chrome DevTools |
| Lighthouse SEO | 100 | Chrome DevTools |
| LCP | < 2.5s | Web Vitals |
| FID/INP | < 200ms | Web Vitals |
| CLS | < 0.1 | Web Vitals |
| TTFB | < 800ms | WebPageTest |

---

## 15. Implementation Roadmap

### Phase 1: Schema Cleanup (Week 1)
1. Remove legacy fields: `services.id`, `solutions.id`, `solutions.name`
2. Clean `solutions.solutions` → rename or remove
3. Type `v.any()` fields properly
4. Add CRUD mutations for `pages` and `content_blocks`
5. Fix `blog_posts.author_id` to `Id<"authors">`
6. Add `createdAt`/`updatedAt` to key tables
7. Clean `industries` legacy fields

### Phase 2: New Tables (Week 1-2)
1. Create `service_locations` table + functions
2. Create `reviews` table + functions
3. Create `redirects` table + functions
4. Create `seo_metadata` table + functions
5. Add new fields to `communes` (geo, stats, unique_content)
6. Add new fields to `services` (long_description, faqs, pricing_hint)

### Phase 3: SEO Infrastructure (Week 2-3)
1. Build `sitemap.xml` endpoint (Astro SSR)
2. Build `BreadcrumbList` component
3. Build `AggregateRating` component
4. Enhance `LocalBusinessSchema` with geo + rating
5. Build `ArticleSchema` for blog posts
6. Build `WebSiteSchema` + `SearchAction`
7. Implement canonical URL system
8. Add OG image generation

### Phase 4: Programmatic Pages (Week 3-4)
1. Build `/servicios/[service]/[commune]` page template
2. Seed `service_locations` with initial 312 records
3. Auto-generate meta titles and descriptions
4. AI-generate unique intro content per page
5. Implement internal linking components
6. Add breadcrumb navigation to all pages

### Phase 5: Admin CMS Enhancement (Week 4-5)
1. Build pages CRUD in admin
2. Build content_blocks editor in admin
3. Build service_locations manager
4. Build reviews manager
5. Build redirects manager
6. Build SEO metadata editor
7. Add sitemap preview tool

### Phase 6: Content & Launch (Week 5-6)
1. Review and polish all auto-generated content
2. Add testimonials/reviews per commune
3. Add GeoCoordinates per commune
4. Add security stats per commune
5. Submit sitemap to Google Search Console
6. Set up Google Business Profile
7. Begin review collection campaign

---

## Appendix A: Seed Data Summary

| Table | Records | Source |
|-------|---------|--------|
| `services` | 6 | Hardcoded in `services.ts` |
| `solutions` | 8 | Hardcoded in `solutions.ts` |
| `faqs` | 10 | Hardcoded in `faqs.ts` |
| `communes` | 52 RM + 5 cities | Hardcoded in `locations.ts` |
| `service_locations` | 312 (projected) | Auto-generated |

## Appendix B: File Map

```
convex/
├── _generated/          # Auto-generated types
├── _test/               # Test utilities
├── schema.ts            # Schema definition (22 tables)
├── auth.ts              # Password auth config
├── admin_utils.ts       # Admin utilities
├── services.ts          # 6 seed + CRUD
├── solutions.ts         # 8 seed + CRUD
├── leads.ts             # CRUD + webhook
├── communes.ts          # CRUD
├── locations.ts         # Query aliases + 52 seed
├── faqs.ts              # 10 seed + CRUD
├── site_config.ts       # Singleton get/update
├── pages.ts             # Read-only queries ⚠️
├── content_blocks.ts    # Read-only query ⚠️
├── blog_posts.ts        # CRUD + publish
├── heroes.ts            # CRUD
├── testimonials.ts      # CRUD + reorder
├── partners.ts          # CRUD + reorder
├── industries.ts        # CRUD + reorder
├── team_members.ts      # CRUD + reorder
├── company_values.ts    # CRUD + reorder
├── process_steps.ts     # CRUD
├── stats.ts             # CRUD + reorder
├── ctas.ts              # CRUD
├── authors.ts           # CRUD
├── storage.ts           # File upload/download
├── debug_pages.ts       # Debug query
└── seed.ts              # Seed orchestration
```

---

## 16. Competitive Landscape (Chile Security Market)

### 16.1 Key Competitors

| Company | Focus | SEO Strength | Key Differentiator |
|---------|-------|-------------|-------------------|
| **Prosegur Chile** | B2B + B2C, full spectrum | 🔴 Strong — national brand, massive content | International backing, brand recognition |
| **Brinks Chile** | Cash-in-transit, B2B | 🟡 Medium — brand searches dominate | Niche in transport security |
| **G4S Chile** | Corporate + industrial | 🟡 Medium — corporate focus | Global partner network |
| **Gard Security** | B2B mining, logistics | 🟢 Weak — limited web presence | OS10 cert rates, sector specialization |
| **AKA Seguridad** | Risk management, OS10 | 🟢 Weak — basic website | Central Santiago location, dual security |
| **VSM Seguridad** | General | 🟢 Weak | Local focus |
| **CAPESEG** | 30yr experience | 🟢 Weak — legacy site | Regulatory compliance expertise |

### 16.2 Competitive SEO Gaps (Opportunity)

> **Most Chilean security companies have weak to non-existent local SEO.** None of the mid-tier competitors have:
> - Programmatic service × location pages  
> - Structured data (JSON-LD) beyond basic Organization  
> - AggregateRating schema  
> - Dynamic sitemaps  
> - Service area pages per commune

**Implication**: Guardman can dominate 300+ long-tail keywords with minimal competition by implementing the programmatic SEO strategy outlined in this plan. The big players (Prosegur, Brinks) compete on brand terms but NOT on hyper-local terms like "guardias de seguridad en Peñalolén" or "alarmas ajax Maipú."

### 16.3 Target Keyword Difficulty

| Keyword Type | Est. Difficulty | Competition | Guardman Strategy |
|-------------|-----------------|-------------|-------------------|
| "seguridad privada chile" | 🔴 High | Prosegur, Brinks, G4S | Blog content, long-tail |
| "empresa seguridad santiago" | 🟡 Medium | Multiple local | Home page + service pages |
| "guardias seguridad {commune}" | 🟢 Low | Almost none | **Programmatic pages** ← FOCUS |
| "alarmas ajax {commune}" | 🟢 Very Low | None | **Service×Commune pages** |
| "seguridad condominios {commune}" | 🟢 Very Low | None | **Solution×Commune content** |

---

## 17. Convex Performance Optimization

### 17.1 Index Strategy for Scale

With 312+ `service_locations` records and growing, proper indexing is critical.

#### Current Index Audit

| Table | Index | Used By | Status |
|-------|-------|---------|--------|
| `communes` | `by_slug` | `getCommuneBySlug` | ✅ Good |
| `communes` | `by_zone` | `getCommunesByZone` | ✅ Good |
| `communes` | `by_isOtherCity` | `getOtherCities` | ✅ Good |
| `services` | `by_slug` | `getServiceBySlug` | ✅ Good |
| `leads` | `by_status` | `getLeadsByStatus` | ✅ Good |
| `leads` | `by_createdAt` | `getLeads` (paginated) | ✅ Good |
| `blog_posts` | `by_slug` | `getPostBySlug` | ✅ Good |
| `heroes` | `by_page_slug` | `getHeroByPage` | ✅ Good |

#### Recommended New Indexes

```typescript
// service_locations — compound index for page lookup
service_locations
  .index('by_service_commune', ['service_slug', 'commune_slug'])  // Primary lookup
  .index('by_service', ['service_slug'])                          // List by service
  .index('by_commune', ['commune_slug'])                          // List by commune

// reviews — aggregate queries need these
reviews
  .index('by_commune', ['commune_slug'])
  .index('by_service', ['service_slug'])
  .index('by_published', ['is_published'])
  .index('by_rating', ['rating'])

// For sitemap generation — need to enumerate all published content
communes.index('by_published', ['is_published'])  // If we add is_published
```

### 17.2 Query Best Practices

| Pattern | ❌ Avoid | ✅ Prefer |
|---------|---------|----------|
| **Lookup by slug** | `.filter(q => q.eq(q.field('slug'), slug))` | `.withIndex('by_slug', q => q.eq('slug', slug))` |
| **Large result sets** | `.collect()` on 100+ docs | `.paginate()` or `.take(limit)` |
| **Cross-table joins** | N+1 queries in a loop | Batch queries, or denormalize data |
| **Aggregate counts** | Counting in query handler | Use Convex counter component or cache |

### 17.3 SSR Query Batching

For Astro SSR pages that need multiple queries (e.g., commune page needs commune + services + reviews), use `Promise.all` for parallel execution:

```typescript
// ✅ Good — parallel queries
const [commune, services, reviews] = await Promise.all([
  convexServer.query(api.locations.getCommuneBySlug, { slug }),
  convexServer.query(api.services.getAllServices),
  convexServer.query(api.reviews.getByCommune, { commune_slug: slug }),
]);

// ❌ Bad — sequential queries
const commune = await convexServer.query(api.locations.getCommuneBySlug, { slug });
const services = await convexServer.query(api.services.getAllServices);
const reviews = await convexServer.query(api.reviews.getByCommune, { commune_slug: slug });
```

### 17.4 Caching Strategy

| Content Type | Cache TTL | Strategy |
|-------------|-----------|----------|
| Static pages (carreras, privacidad) | Long (1hr+) | Astro `static` mode |
| Service pages | Medium (5min) | SSR with Vercel edge cache |
| Commune pages | Medium (5min) | SSR with cache headers |
| Service×Commune pages | Medium (5min) | SSR, pre-render popular pages |
| Blog posts | Long (30min) | SSR with ISR-like behavior |
| Admin CMS | None | Real-time Convex reactivity |

---

## 18. Advanced Schema.org Implementation

### 18.1 Use `SecurityService` instead of `LocalBusiness`

Schema.org has no official `SecurityService` type, but the recommended approach is:

```json
{
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "ProfessionalService"],
  "additionalType": "https://schema.org/SecurityService",
  "name": "Guardman Chile - Las Condes"
}
```

> **Why**: Using both `LocalBusiness` and `ProfessionalService` gives Google maximum context about the business type while maintaining eligibility for local pack results.

### 18.2 Multi-Location Parent Organization Pattern

On the home page, establish the parent organization:

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://guardman.cl/#organization",
  "name": "Guardman Chile",
  "url": "https://guardman.cl",
  "logo": "https://guardman.cl/logo.png",
  "sameAs": [
    "https://instagram.com/grupo_guardman",
    "https://linkedin.com/company/guardman-chile"
  ],
  "areaServed": {
    "@type": "AdministrativeArea",
    "name": "Región Metropolitana de Santiago"
  },
  "department": [
    {
      "@type": "LocalBusiness",
      "@id": "https://guardman.cl/cobertura/las-condes",
      "name": "Guardman Chile - Las Condes"
    },
    {
      "@type": "LocalBusiness",
      "@id": "https://guardman.cl/cobertura/providencia",
      "name": "Guardman Chile - Providencia"  
    }
  ]
}
```

> **Key**: Use `department` property to link each commune-specific `LocalBusiness` back to the parent `Organization`. Each commune page's `LocalBusiness` should reference the parent with `"parentOrganization": {"@id": "https://guardman.cl/#organization"}`.

### 18.3 Service Catalog Schema

Each service detail page should include an `OfferCatalog`:

```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Guardias de Seguridad OS10",
  "provider": { "@id": "https://guardman.cl/#organization" },
  "areaServed": [
    { "@type": "City", "name": "Santiago" },
    { "@type": "City", "name": "Las Condes" },
    { "@type": "City", "name": "Providencia" }
  ],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Planes de Guardias",
    "itemListElement": [
      {
        "@type": "Offer",
        "name": "Guardia 24/7",
        "description": "Servicio de guardia permanente"
      }
    ]
  }
}
```

### 18.4 Blog Article Schema

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "{{title}}",
  "datePublished": "{{published_at ISO}}",
  "dateModified": "{{updated_at ISO}}",
  "author": {
    "@type": "Person",
    "name": "{{author_name}}",
    "url": "https://guardman.cl/blog/autor/{{author_slug}}"
  },
  "publisher": { "@id": "https://guardman.cl/#organization" },
  "image": "{{cover_image}}",
  "mainEntityOfPage": "https://guardman.cl/blog/{{slug}}"
}
```

---

## 19. Data Unification Strategy

### 19.1 Resolve `site.ts` vs `site_config` Duplication

**Current State**: Two sources of truth for business info.

| Data Point | `data/site.ts` | `site_config` table |
|-----------|---------------|---------------------|
| Phone | ✅ `+56 9 3000 0010` | ✅ `phone_primary` |
| WhatsApp | ✅ `+56930000010` | ✅ `whatsapp_number` |
| Email | ✅ `info@guardman.cl` | ✅ `email_contact` |
| Address | ✅ Full structured | ❌ Only `address_main` (string) |
| Social links | ✅ Full structured | ✅ `social_links` |
| Brand name | ✅ `Guardman Chile` | ✅ `brand_name` |
| Navbar | ❌ | ✅ `navbar_items` |
| Footer | ❌ | ✅ `footer_config` |
| Colors | ✅ | ❌ |
| Hours | ✅ | ❌ |

**Proposed Fix**: Migrate ALL data to `site_config` and DELETE `data/site.ts`:

```typescript
// Add to site_config schema:
address: v.optional(v.object({
  street: v.string(),
  city: v.string(),
  region: v.string(),
  country: v.string(),
  postalCode: v.string(),
})),
business_hours: v.optional(v.object({
  days: v.string(),
  open: v.string(),
  close: v.string(),
})),
colors: v.optional(v.object({
  primary: v.string(),
  accent: v.string(),
  secondary: v.string(),
  dark: v.string(),
  light: v.string(),
})),
founded_year: v.optional(v.number()),
total_clients: v.optional(v.number()),
total_guards: v.optional(v.number()),
```

> This ensures **single source of truth** for NAP data — critical for local SEO consistency.

---

## Appendix C: Astro Dynamic Sitemap Generation

> **Important**: The `@astrojs/sitemap` package does NOT work with SSR dynamic routes. A custom endpoint is required.

### `web/src/pages/sitemap.xml.ts`

```typescript
import type { APIRoute } from 'astro';
import { convexServer } from '../lib/convex-server';
import { api } from '../../convex/_generated/api';

const SITE_URL = 'https://guardman.cl';

export const GET: APIRoute = async () => {
  // Fetch all dynamic content from Convex
  const [services, solutions, communes, blogPosts, serviceLocations] = await Promise.all([
    convexServer.query(api.services.getAllServices),
    convexServer.query(api.solutions.getAllSolutions),
    convexServer.query(api.locations.getAllCommunes),
    convexServer.query(api.blog_posts.getPublishedPosts),
    convexServer.query(api.service_locations.getAll),  // NEW table
  ]);

  const urls: { loc: string; priority: string; changefreq: string }[] = [];

  // Static pages
  urls.push({ loc: '/', priority: '1.0', changefreq: 'weekly' });
  urls.push({ loc: '/servicios', priority: '0.9', changefreq: 'weekly' });
  urls.push({ loc: '/soluciones', priority: '0.8', changefreq: 'weekly' });
  urls.push({ loc: '/cobertura', priority: '0.9', changefreq: 'weekly' });
  urls.push({ loc: '/contacto', priority: '0.8', changefreq: 'monthly' });
  urls.push({ loc: '/cotizar', priority: '0.9', changefreq: 'monthly' });
  urls.push({ loc: '/nosotros', priority: '0.5', changefreq: 'monthly' });
  urls.push({ loc: '/blog', priority: '0.7', changefreq: 'daily' });

  // Service pages
  for (const s of services) {
    if (s.is_active !== false) {
      urls.push({ loc: `/servicios/${s.slug}`, priority: '0.8', changefreq: 'weekly' });
    }
  }

  // Solution pages
  for (const s of solutions) {
    if (s.is_active !== false) {
      urls.push({ loc: `/soluciones/${s.slug}`, priority: '0.7', changefreq: 'weekly' });
    }
  }

  // Commune pages
  for (const c of communes) {
    urls.push({ loc: `/cobertura/${c.slug}`, priority: '0.7', changefreq: 'weekly' });
  }

  // Service × Commune pages (programmatic SEO)
  for (const sl of serviceLocations) {
    if (sl.is_published !== false) {
      urls.push({
        loc: `/servicios/${sl.service_slug}/${sl.commune_slug}`,
        priority: '0.6',
        changefreq: 'monthly',
      });
    }
  }

  // Blog posts
  for (const p of blogPosts) {
    urls.push({ loc: `/blog/${p.slug}`, priority: '0.5', changefreq: 'monthly' });
  }

  // Generate XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${SITE_URL}${u.loc}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
};
```

### `web/public/robots.txt`

```
User-agent: *
Allow: /

Sitemap: https://guardman.cl/sitemap.xml
```

---

## Appendix D: Seed Script for `service_locations`

```typescript
// convex/service_locations.ts — seed mutation
export const seedServiceLocations = mutation({
  handler: async (ctx) => {
    const services = await ctx.db.query('services').collect();
    const communes = await ctx.db
      .query('communes')
      .filter(q => q.neq(q.field('isOtherCity'), true))
      .collect();

    let inserted = 0;
    for (const service of services) {
      for (const commune of communes) {
        // Check if already exists
        const existing = await ctx.db
          .query('service_locations')
          .withIndex('by_service_commune', q => 
            q.eq('service_slug', service.slug).eq('commune_slug', commune.slug)
          )
          .first();

        if (!existing) {
          await ctx.db.insert('service_locations', {
            service_slug: service.slug,
            commune_slug: commune.slug,
            meta_title: `${service.title} en ${commune.name} | Guardman Chile`,
            meta_description: `Servicio de ${service.title.toLowerCase()} en ${commune.name}. ${service.tagline || service.description.substring(0, 100)}. Cotiza sin compromiso.`,
            hero_title: `${service.title} en ${commune.name}`,
            is_published: true,
          });
          inserted++;
        }
      }
    }
    return { inserted, total: services.length * communes.length };
  },
});
```

---

## Appendix E: Quick Reference — All Convex Functions

| File | Queries | Mutations | Actions |
|------|---------|-----------|---------|
| `services.ts` | `getAllServices`, `getServiceBySlug`, `getServicesBySolution` | `createService`, `updateService`, `deleteService`, `reorderServices`, `seedServices` | — |
| `solutions.ts` | `getAllSolutions`, `getSolutionBySlug` | `createSolution`, `updateSolution`, `deleteSolution`, `reorderSolutions`, `seedSolutions` | — |
| `locations.ts` | `getAllCommunes`, `getCommuneBySlug`, `getCommunesByZone`, `getOtherCities`, `getAllLocations` | `seedCommunes`, `clearCommunes` | — |
| `communes.ts` | `getAll`, `getBySlug` | `create`, `update`, `updateSEO`, `delete` | — |
| `leads.ts` | `getLeads`, `getLeadsByStatus`, `getLeadById`, `getLeadsCount` | `createLead`, `updateLeadStatus` | `triggerWebhook` |
| `faqs.ts` | `getAllFaqs`, `getFaqsByCategory` | CRUD + `seedFaqs`, `reorderFaqs` | — |
| `blog_posts.ts` | `getAllPosts`, `getPublishedPosts`, `getFeaturedPosts`, `getPostBySlug` | CRUD + `publishPost`, `unpublishPost`, `reorderPosts` | — |
| `heroes.ts` | `getAllHeroes`, `getHeroByPage`, `getActiveHeroes` | CRUD | — |
| `testimonials.ts` | `getAll` | CRUD + `reorder` | — |
| `partners.ts` | `getAll`, `getByType` | CRUD + `reorder` | — |
| `industries.ts` | `getAll`, `getActiveIndustries`, `getBySlug` | CRUD + `reorder` | — |
| `team_members.ts` | `getAll` | CRUD + `reorder` | — |
| `company_values.ts` | `getAll` | CRUD + `reorder` | — |
| `process_steps.ts` | `getByPage`, `getAll` | CRUD | — |
| `stats.ts` | `getAll`, `getByPage` | CRUD + `reorder` | — |
| `ctas.ts` | `getAll`, `getByPage` | CRUD | — |
| `authors.ts` | `getAll`, `getBySlug` | CRUD | — |
| `pages.ts` | `getBySlug`, `getAll` | ❌ None | — |
| `content_blocks.ts` | `getByPage` | ❌ None | — |
| `site_config.ts` | `get` | `update` | — |
| `storage.ts` | `getFileUrl`, `getFileMetadata`, `listFiles` | `generateUploadUrl`, `saveFileMetadata`, `deleteFile` | — |
| `auth.ts` | — | — | Auth config |

---

## 20. Execution Plan — Schema Cleanup (Phase 1)

> **Critical**: This is the foundation. No SEO work will succeed if the schema is broken.

### 20.1 The Expand-Migrate-Contract Pattern

Convex doesn't have SQL ALTER TABLE. All schema changes follow this 3-step process:

```
Step 1: EXPAND   → Add new optional fields, keep old ones
Step 2: MIGRATE  → Backfill data from old to new fields  
Step 3: CONTRACT → Remove old fields after migration
```

### 20.2 Cleanup Execution Order

Execute these in order. Each step is a separate `npx convex deploy`.

#### Step 1: Make Legacy Fields Optional (EXPAND)
```typescript
// schema.ts changes — mark for removal but don't break existing data
solutions: defineTable({
  id: v.optional(v.string()),           // was required → now optional
  name: v.optional(v.string()),         // was required → now optional  
  solutions: v.optional(v.array(v.string())), // confusing self-ref → will rename
  title: v.string(),                    // NOW REQUIRED (was optional)
  // ... rest unchanged
})

services: defineTable({
  id: v.optional(v.string()),           // was required → now optional
  // ... rest unchanged
})

industries: defineTable({
  id: v.optional(v.string()),           // was required → now optional
  challenges: v.optional(v.array(v.string())),      // was v.any() → now typed
  relatedServices: v.optional(v.array(v.string())), // was v.any() → now typed
  solutions: v.optional(v.array(v.string())),       // was v.any() → now typed
  // ... rest unchanged
})
```

#### Step 2: Backfill Data (MIGRATE)
```typescript
// convex/migrations/cleanup_legacy.ts
import { internalMutation } from './_generated/server';

export const backfillSolutions = internalMutation({
  handler: async (ctx) => {
    const solutions = await ctx.db.query('solutions').collect();
    for (const sol of solutions) {
      // Copy name → title if title is missing
      if (!sol.title && sol.name) {
        await ctx.db.patch(sol._id, { title: sol.name });
      }
      // Remove legacy id field
      if (sol.id !== undefined) {
        await ctx.db.patch(sol._id, { id: undefined });
      }
      // Remove confusing solutions[] field  
      if (sol.solutions !== undefined) {
        await ctx.db.patch(sol._id, { solutions: undefined });
      }
    }
    return { migrated: solutions.length };
  },
});

export const backfillServices = internalMutation({
  handler: async (ctx) => {
    const services = await ctx.db.query('services').collect();
    for (const svc of services) {
      if (svc.id !== undefined) {
        await ctx.db.patch(svc._id, { id: undefined });
      }
    }
    return { migrated: services.length };
  },
});

export const backfillIndustries = internalMutation({
  handler: async (ctx) => {
    const industries = await ctx.db.query('industries').collect();
    for (const ind of industries) {
      const updates: Record<string, unknown> = {};
      if (ind.id !== undefined) updates.id = undefined;
      // Ensure typed arrays
      if (ind.challenges && !Array.isArray(ind.challenges)) {
        updates.challenges = [];
      }
      if (ind.relatedServices && !Array.isArray(ind.relatedServices)) {
        updates.relatedServices = [];
      }
      if (Object.keys(updates).length > 0) {
        await ctx.db.patch(ind._id, updates);
      }
    }
    return { migrated: industries.length };
  },
});
```

#### Step 3: Remove Legacy Fields (CONTRACT)
```typescript
// After confirming all data is migrated, remove fields from schema.ts:
// DELETE: solutions.id, solutions.name, solutions.solutions
// DELETE: services.id
// DELETE: industries.id
// CHANGE: industries.challenges from v.any() → v.array(v.string())
// CHANGE: industries.relatedServices from v.any() → v.array(v.string())
```

### 20.3 Add New Fields to Existing Tables

After cleanup, add the SEO-critical fields:

```typescript
// communes — add geo and content fields
communes: defineTable({
  // ...existing...
  order: v.optional(v.number()),
  is_published: v.optional(v.boolean()),
  latitude: v.optional(v.string()),
  longitude: v.optional(v.string()),
  population: v.optional(v.string()),
  unique_content: v.optional(v.string()),
}).index('by_slug', ['slug'])
  .index('by_zone', ['zone'])
  .index('by_isOtherCity', ['isOtherCity'])
  .index('by_published', ['is_published']),  // NEW INDEX

// blog_posts — fix author FK
blog_posts: defineTable({
  // ...existing, but CHANGE:
  author_id: v.optional(v.id('authors')),   // Was string → now proper FK
  seo_title: v.optional(v.string()),         // NEW
  seo_description: v.optional(v.string()),   // NEW
}).index('by_slug', ['slug']),
```

---

## 21. Execution Plan — Frontend (Phase 2)

### 21.1 Enhanced `<SEO>` Component

The existing `BaseLayout.astro` already handles core SEO (title, meta, OG, canonical). Enhance it with a dedicated `<SEO>` component for reuse:

#### `web/src/components/seo/SEO.astro`

```astro
---
interface Props {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'place';
  noindex?: boolean;
  schemas?: object[];
  breadcrumbs?: { name: string; url: string }[];
  publishedAt?: string;
  modifiedAt?: string;
  author?: string;
}

const {
  title,
  description,
  canonical = Astro.url.href,
  ogImage = '/og-default.jpg',
  ogType = 'website',
  noindex = false,
  schemas = [],
  breadcrumbs = [],
  publishedAt,
  modifiedAt,
  author,
} = Astro.props;

const SITE_URL = 'https://guardman.cl';
const siteName = 'Guardman Chile';
const fullTitle = title === siteName ? title : `${title} | ${siteName}`;
const fullOgImage = ogImage.startsWith('http') ? ogImage : `${SITE_URL}${ogImage}`;

// Auto-generate BreadcrumbList schema
const breadcrumbSchema = breadcrumbs.length > 0 ? {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  'itemListElement': breadcrumbs.map((b, i) => ({
    '@type': 'ListItem',
    'position': i + 1,
    'name': b.name,
    'item': b.url.startsWith('http') ? b.url : `${SITE_URL}${b.url}`,
  })),
} : null;

const allSchemas = [...schemas, breadcrumbSchema].filter(Boolean);
---

<!-- Primary Meta -->
<title>{fullTitle}</title>
<meta name="description" content={description} />
{noindex && <meta name="robots" content="noindex, nofollow" />}

<!-- Canonical -->
<link rel="canonical" href={canonical} />
<link rel="alternate" hreflang="es-CL" href={canonical} />
<link rel="alternate" hreflang="x-default" href={canonical} />

<!-- Open Graph -->
<meta property="og:type" content={ogType} />
<meta property="og:title" content={fullTitle} />
<meta property="og:description" content={description} />
<meta property="og:image" content={fullOgImage} />
<meta property="og:url" content={canonical} />
<meta property="og:site_name" content={siteName} />
<meta property="og:locale" content="es_CL" />

<!-- Article dates (for blog posts) -->
{publishedAt && <meta property="article:published_time" content={publishedAt} />}
{modifiedAt && <meta property="article:modified_time" content={modifiedAt} />}
{author && <meta property="article:author" content={author} />}

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content={fullTitle} />
<meta name="twitter:description" content={description} />
<meta name="twitter:image" content={fullOgImage} />

<!-- Schema.org JSON-LD -->
{allSchemas.map(schema => (
  <script type="application/ld+json" set:html={JSON.stringify(schema)} />
))}
```

#### Integration with `BaseLayout.astro`

```astro
---
// Replace the manual <head> tags in BaseLayout with:
import SEO from '../components/seo/SEO.astro';
---
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <SEO {...Astro.props} />
  <!-- fonts, favicon stay here -->
</head>
```

### 21.2 Dynamic Sitemap (`sitemap.xml.ts`)

> **Critical**: `@astrojs/sitemap` does NOT work with SSR dynamic routes. A custom endpoint is required.

Create `web/src/pages/sitemap.xml.ts` — the complete code is in **Appendix C** of this document. Key notes:

- Fetches ALL tables with published content from Convex in parallel
- Generates entries for static pages, services, solutions, communes, service×commune pages, and blog posts
- Returns `Content-Type: application/xml`
- Must be paired with `web/public/robots.txt` pointing to `Sitemap: https://guardman.cl/sitemap.xml`

### 21.3 Programmatic Route: `/servicios/[service]/[commune]`

#### File Structure
```
web/src/pages/servicios/
├── index.astro              # /servicios (existing)
├── [slug].astro             # /servicios/guardias (existing)
└── [service]/
    └── [commune].astro      # /servicios/guardias/las-condes (NEW)
```

#### `web/src/pages/servicios/[service]/[commune].astro`

```astro
---
import BaseLayout from '@/layouts/BaseLayout.astro';
import { convexServer } from '@/lib/convex';
import { api } from '@convex/_generated/api';

const { service: serviceSlug, commune: communeSlug } = Astro.params;

// Parallel data fetching — CRITICAL for SSR performance
const [serviceLocation, service, commune, allServices, reviews] = await Promise.all([
  convexServer.query(api.service_locations.getByServiceCommune, {
    service_slug: serviceSlug!,
    commune_slug: communeSlug!,
  }),
  convexServer.query(api.services.getServiceBySlug, { slug: serviceSlug! }),
  convexServer.query(api.locations.getCommuneBySlug, { slug: communeSlug! }),
  convexServer.query(api.services.getAllServices),
  convexServer.query(api.reviews.getByCommune, { commune_slug: communeSlug! }),
]);

if (!service || !commune) return Astro.redirect('/404');

// SEO data — prefer service_location overrides, fallback to generated
const metaTitle = serviceLocation?.meta_title
  || `${service.title} en ${commune.name} | Guardman Chile`;
const metaDescription = serviceLocation?.meta_description
  || `Servicio de ${service.title.toLowerCase()} en ${commune.name}, Región Metropolitana. Cotiza sin compromiso.`;

// Structured data
const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': ['LocalBusiness', 'ProfessionalService'],
  'name': `Guardman Chile - ${commune.name}`,
  'parentOrganization': { '@id': 'https://guardman.cl/#organization' },
  'areaServed': { '@type': 'City', 'name': commune.name },
  'telephone': '+56930000010',
  'url': `https://guardman.cl/servicios/${serviceSlug}/${communeSlug}`,
};

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  'name': service.title,
  'provider': localBusinessSchema,
  'areaServed': { '@type': 'City', 'name': commune.name },
};

const breadcrumbs = [
  { name: 'Inicio', url: '/' },
  { name: 'Servicios', url: '/servicios' },
  { name: service.title, url: `/servicios/${serviceSlug}` },
  { name: commune.name, url: `/servicios/${serviceSlug}/${communeSlug}` },
];
---

<BaseLayout
  title={metaTitle}
  description={metaDescription}
  schemas={[localBusinessSchema, serviceSchema]}
  breadcrumbs={breadcrumbs}
>
  <!-- Hero section specific to service+commune -->
  <section class="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-20">
    <div class="container mx-auto px-6">
      <nav class="text-sm text-blue-200 mb-4">
        <!-- Breadcrumb visual rendering -->
      </nav>
      <h1 class="text-4xl font-bold mb-4">
        {serviceLocation?.hero_title || `${service.title} en ${commune.name}`}
      </h1>
      <p class="text-xl text-blue-100 max-w-3xl">
        {metaDescription}
      </p>
    </div>
  </section>

  <!-- Unique content section (CRITICAL for avoiding thin content) -->
  <section class="py-16">
    <div class="container mx-auto px-6">
      {serviceLocation?.intro_content && (
        <div class="prose max-w-3xl" set:html={serviceLocation.intro_content} />
      )}
      {commune.unique_content && (
        <div class="prose max-w-3xl mt-8" set:html={commune.unique_content} />
      )}
    </div>
  </section>

  <!-- Service features -->
  <!-- Testimonials filtered by commune -->
  <!-- Other services in this commune -->
  <!-- CTA -->
</BaseLayout>
```

---

## 22. Refine CMS Evaluation

### 22.1 What is Refine?

[Refine](https://refine.dev) is an open-source React framework for building admin panels, internal tools, and B2B dashboards. It's "headless" — separating business logic from UI.

### 22.2 Refine vs Current Custom CMS

| Feature | Current Admin (React+Vite) | Refine |
|---------|--------------------------|--------|
| **CRUD Generation** | Manual per table (~19 pages hand-written) | Auto-generated from data provider |
| **Data Provider** | Direct Convex `useQuery`/`useMutation` | Custom data provider wrapping Convex |
| **Auth** | Custom `AuthGuard` + Convex auth | Built-in `AuthProvider` |
| **Routing** | Manual `react-router-dom` | Auto-generated from resource config |
| **Form Handling** | Manual state management | Built-in `useForm` with validation |
| **Table/List** | Manual table components | Built-in `useTable` with sorting, filtering |
| **Reordering** | Custom drag-and-drop per table | Requires custom component |
| **UI Library** | Custom components | Ant Design, Material UI, Chakra, or headless |
| **Setup Effort** | Already done (~19 pages) | Requires custom Convex data provider |
| **Learning Curve** | Familiar React | New framework + Refine concepts |
| **Monorepo Fit** | Already in `admin/` dir | Can replace `admin/` dir |

### 22.3 Custom Convex Data Provider for Refine

No official Refine + Convex integration exists. A custom data provider would need to map Refine's methods to Convex:

```typescript
// admin/src/lib/refine-convex-provider.ts
import { DataProvider } from "@refinedev/core";
import { ConvexClient } from "convex/browser";
import { api } from "../../convex/_generated/api";

const convex = new ConvexClient(import.meta.env.VITE_CONVEX_URL);

// Mapping of Refine resources to Convex table functions
const resourceMap = {
  services: {
    getList: api.services.getAllServices,
    getOne: api.services.getServiceBySlug,
    create: api.services.createService,
    update: api.services.updateService,
    delete: api.services.deleteService,
  },
  // ... 19 more mappings
};

export const convexDataProvider: DataProvider = {
  getList: async ({ resource }) => {
    const query = resourceMap[resource]?.getList;
    const data = await convex.query(query);
    return { data, total: data.length };
  },
  getOne: async ({ resource, id }) => {
    const data = await convex.query(resourceMap[resource].getOne, { id });
    return { data };
  },
  create: async ({ resource, variables }) => {
    const data = await convex.mutation(resourceMap[resource].create, variables);
    return { data };
  },
  update: async ({ resource, id, variables }) => {
    await convex.mutation(resourceMap[resource].update, { id, ...variables });
    return { data: variables };
  },
  deleteOne: async ({ resource, id }) => {
    await convex.mutation(resourceMap[resource].delete, { id });
    return { data: {} };
  },
  getApiUrl: () => import.meta.env.VITE_CONVEX_URL,
};
```

### 22.4 Recommendation

> **🟡 HOLD on Refine adoption.** The migration cost outweighs the benefit right now.

**Reasons to HOLD:**
1. The current CMS already works with ~19 admin pages
2. No native Convex data provider — must build custom adapter
3. Convex's query/mutation pattern doesn't fit Refine's REST-centric model cleanly
4. Refine's pagination expects `total` counts — Convex doesn't return totals by default
5. Migration effort: rewrite 19 admin pages + build data provider + test

**When to RECONSIDER:**
- If building a **second project** with Convex → invest in reusable data provider
- If CMS needs grow significantly (50+ tables, role-based access, workflow approvals)
- If Refine releases an official Convex adapter

**Alternative**: Keep current CMS, but add the **missing CRUD** for `pages` and `content_blocks` tables.

---

## 23. Thin Content Avoidance Strategy

> **Google's John Mueller**: "Programmatic SEO is often a fancy banner for spam" — unless every page provides unique value.

### 23.1 The 70/30 Rule for Programmatic Pages

| Content Type | % of Page | Source | Unique Per Page? |
|-------------|-----------|--------|-----------------|
| **Template chrome** | ~30% | Layout, header, footer, CTA | ❌ Shared |
| **Service info** | ~20% | `services` table | ❌ Same per service |
| **Commune-specific data** | ~25% | `communes` + `service_locations` | ✅ **UNIQUE** |
| **Social proof** | ~15% | `testimonials`, `reviews` filtered by commune | ✅ **UNIQUE** |
| **Local context** | ~10% | Unique paragraph, stats, safety data | ✅ **UNIQUE** |

> **Goal**: At least **50% of page content** must be unique per {service}×{commune} combination.

### 23.2 Content Differentiation Strategies

#### Strategy 1: `intro_content` per Service×Commune
Store a unique paragraph (200-400 words) in `service_locations.intro_content`. Example:

> "En Las Condes, uno de los sectores corporativos más importantes de Santiago, la seguridad privada es esencial para las oficinas y edificios empresariales que concentran esta comuna. Guardman Chile ofrece guardias de seguridad OS10 especializados en vigilancia corporativa, control de acceso y protocolo ejecutivo..."

#### Strategy 2: Local Statistics
```
"En {commune.name}, los delitos contra la propiedad aumentaron un {stats.crime_percent}% 
en el último año. Por eso, {stats.guardman_clients}+ empresas confían en Guardman Chile."
```

#### Strategy 3: Testimonials Filtered by Commune
Show different testimonials based on commune. If none exist for that specific commune, show zone-level testimonials (same zone).

#### Strategy 4: Related Services in That Commune
Internal linking sections: "Otros servicios en {commune.name}" — list other service×commune pages.

#### Strategy 5: AI-Assisted Content Generation
Use batch content generation to create unique `intro_content` for each of the 312 combinations. Store in `service_locations` table so the CMS can edit later.

### 23.3 Content Audit Checklist per Page

Before publishing any service×commune page, verify:

- [ ] `meta_title` is unique (not template-only)
- [ ] `meta_description` is unique (not template-only)
- [ ] `intro_content` exists (200+ words)
- [ ] At least 1 testimonial or review shows
- [ ] Internal links to ≥3 other pages
- [ ] Breadcrumb is accurate
- [ ] Structured data is valid (test at schema.org/validator)

---

## 24. Google Local Pack Domination Checklist (2025)

### 24.1 The 3 Pillars

| Pillar | Factor | Guardman Status | Action |
|--------|--------|----------------|--------|
| **Relevance** | GBP categories | ❓ Unknown | Set primary: "Security Guard Service" + secondary categories |
| **Relevance** | Keyword-rich GBP description | ❓ Unknown | Write 750-char description with service+location keywords |
| **Relevance** | Website content matches GBP | 🟡 Partial | Unify `site.ts` → `site_config` for NAP consistency |
| **Distance** | Service area definition | ❓ Unknown | Define all 52 communes as service areas in GBP |
| **Distance** | Embedded Google Maps | ❌ Missing | Add map embed to commune pages |
| **Prominence** | Reviews (count + quality + recency) | ❌ Missing | Implement `reviews` table + collection strategy |
| **Prominence** | Review responses | ❌ Missing | Respond to all GBP reviews |
| **Prominence** | Citations/NAP consistency | 🟡 Partial | Audit Chilean directories for NAP |
| **Prominence** | Backlinks from local sources | ❌ Missing | Outreach to Chilean business directories |
| **Prominence** | Structured data | 🟡 Partial | Enhance with SecurityService type + AggregateRating |

### 24.2 GBP Optimization Checklist

- [ ] Complete all GBP fields (hours, description, categories, photos)
- [ ] Add all 52 communes as service areas
- [ ] Post weekly Google Posts (offers, updates, tips)
- [ ] Upload 50+ high-quality photos (team, equipment, locations)
- [ ] Enable messaging and Q&A
- [ ] Create FAQ section on GBP
- [ ] Implement review collection strategy (QR code, email follow-up)

### 24.3 NAP Consistency Audit

> **NAP** = Name, Address, Phone. Must be IDENTICAL across all platforms.

| Platform | Status | NAP Correct? |
|----------|--------|-------------|
| Website (guardman.cl) | ✅ Live | ❓ Audit needed vs GBP |
| Google Business Profile | ❓ Unknown | ❓ — |
| Instagram | ✅ Active | ❓ Audit needed |
| LinkedIn | ❓ Unknown | ❓ — |
| Chilean Yellow Pages | ❓ Unknown | ❓ — |
| Mercado Securidad Chile | ❓ Unknown | ❓ — |

---

## 25. Design System — Visual DNA

> This section documents the exact design tokens used across all components, so the app can be rebuilt consistently from scratch.

### 25.1 Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `gray-900` | `#111827` | Primary text, headers, buttons (bg), dark sections |
| `gray-800` | `#1F2937` | Footer backgrounds, secondary dark |
| `gray-700` | `#374151` | Hover states on dark backgrounds |
| `gray-600` | `#4B5563` | Secondary text on light |
| `gray-500` | `#6B7280` | Subtitle text, descriptions |
| `gray-400` | `#9CA3AF` | Muted labels, micro-labels (uppercase tracking) |
| `gray-300` | `#D1D5DB` | Dividers on light backgrounds |
| `gray-200` | `#E5E7EB` | Card borders, input borders |
| `gray-100` | `#F3F4F6` | Section backgrounds ("gray"), input fills, hover states |
| `gray-50` | `#F9FAFB` | Form backgrounds, icon background containers |
| `white` | `#FFFFFF` | Primary cards, page backgrounds |
| `black` | `#000000` | Hero sections, dark CTA sections |
| `white/70` | `rgba(255,255,255,0.7)` | Subtitle text in dark hero sections |
| `white/50` | `rgba(255,255,255,0.5)` | Secondary text in dark sections |
| `white/40` | `rgba(255,255,255,0.4)` | Accent italic text in hero headings |
| `white/30` | `rgba(255,255,255,0.3)` | Trust badge text in dark CTA |
| `white/10` | `rgba(255,255,255,0.1)` | Borders in dark sections, stat dividers |
| `white/5` | `rgba(255,255,255,0.05)` | Badge backgrounds in hero |

> **Design principle**: Monochromatic grayscale. Inspired by Porsche.com and Ajax Systems. Zero brand colors in the UI. Accent = white on black.

### 25.2 Typography

| Element | Classes | Properties |
|---------|---------|------------|
| **H1 (Hero)** | `text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-semibold text-white tracking-tight leading-[1.1]` | Semibold, tight tracking, 1.1 line-height |
| **H1 (Subpage Hero)** | `text-4xl md:text-6xl lg:text-7xl font-semibold text-white tracking-tight leading-[1.1]` | With accent word in `text-white/40 italic` |
| **H2 (Section)** | `text-3xl md:text-4xl font-semibold text-gray-900 tracking-tight` | Alternately `md:text-5xl` for emphasis |
| **H2 (Dark CTA)** | `text-3xl md:text-6xl font-semibold text-white tracking-tight` | With accent word in `italic text-white/40` |
| **H3 (Card)** | `text-lg font-semibold text-gray-900` | Card titles |
| **H3 (ServiceCard)** | `text-sm font-bold text-gray-900 uppercase tracking-[0.2em]` | Military-style all-caps |
| **Body** | `text-lg text-gray-500 leading-relaxed` | Section subtitles/descriptions |
| **Small body** | `text-sm text-gray-500 leading-relaxed` | Card descriptions |
| **Micro-label** | `text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em-0.4em]` | Stats labels, trust badges, metadata |
| **Hero badge** | `text-xs text-white/70 uppercase tracking-widest font-medium` | Hero section badge text |
| **CTA button** | `text-xs font-bold uppercase tracking-widest` | Premium CTA buttons |

### 25.3 Spacing & Layout

| Element | Classes |
|---------|---------|
| **Container** | `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` |
| **Section padding** | `py-16 md:py-20` (standard), `py-20 md:py-28` (hero), `py-24` (CTA) |
| **Section-to-header gap** | `mb-12 md:mb-16` |
| **Card grid gap** | `gap-6 md:gap-8` |
| **Card padding** | `p-6` (FeatureCard), `p-8` (ServiceCard), `p-5` (ClientsGrid) |

### 25.4 Component Shapes & Interactions

| Element | Radius | Interaction |
|---------|--------|------------|
| **Cards** | `rounded-2xl` (FeatureCard) / `rounded-xl` (ServiceCard, Clients, FAQ) | `hover:border-gray-300` + `hover:shadow-lg` or `hover:border-black` |
| **Buttons** | `rounded-xl` (primary) / `rounded-lg` (CTA in dark sections) | `hover:bg-gray-100` (accent), `hover:bg-white hover:text-black` (outline) |
| **Select inputs** | `rounded-xl` | `hover:bg-gray-100 focus:ring-2 focus:ring-gray-300` |
| **Icon containers** | `rounded-lg` (12px) / `rounded-xl` (ServiceCard) / `rounded-full` (ProcessSection) | `group-hover:bg-black group-hover:text-white` |
| **Images** | `rounded-2xl` (GuardPod video) / none in FeatureCard header | `group-hover:scale-105 transition-transform duration-500` |
| **Hero badge** | `rounded-full` | `bg-white/5 border border-white/10 backdrop-blur-sm` |

### 25.5 Static Data Source: `data/site.ts`

The following fields are consumed from the static `data/site.ts` file and should be migrated to Convex `site_config` for unification:

| Field | Value | Used By |
|-------|-------|---------|
| `site.name` | `'Guardman Chile'` | Header, Footer, Schema.org |
| `site.legalName` | `'Grupo Guardman SpA'` | Nosotros page, Schema.org |
| `site.url` | `'https://guardman.cl'` | Schema.org, canonical URLs |
| `site.phone` | `'+56 9 3000 0010'` | Header CTA, Footer, CTASection, contacto |
| `site.whatsapp` | `'+56930000010'` | WhatsApp links across all pages |
| `site.email` | `'info@guardman.cl'` | Footer, contacto page |
| `site.address.*` | Street, city, region, postal, country | Footer, Schema.org, contacto |
| `site.social.*` | Instagram, YouTube, LinkedIn URLs | Footer social links |
| `site.founded` | `2015` | Nosotros hero badge, Footer experience calc |
| `site.clients` | `500` | Various stats |
| `site.guards` | `850` | Various stats |
| `site.colors.*` | primary, accent, secondary, dark, light | Not currently used in templates |

---

## 26. Component Registry — Data Mapping

> Master registry: every reusable component, its props interface, and the exact Convex table fields it consumes.

### 26.1 Layout Components

#### `Header.astro`
| Prop | Type | Convex Source |
|------|------|---------------|
| `navItems` | `NavItem[]` | **Hardcoded** (fallback array with Services/Solutions dropdown children) |
| `siteConfig` | `any` | `site_config.get` (optional, not yet wired) |

**Data consumed**: Static nav links. Logo from `/images/guardman_logo.png`.

#### `Footer.astro`
| Prop | Type | Convex Source |
|------|------|---------------|
| `siteConfig` | `any` | `site_config.get` → `phone_primary`, `email_contact`, `address_main`, `social_links`, `footer_config.columns` |

**Fallback**: Uses `data/site.ts` when `siteConfig` is null.  
**Embeds**: `ConvexLeadForm` (client:only="react", source="footer", theme="dark").  
**Links**: Hardcoded services/solutions/company columns with fallback to `siteConfig.footer_config`.

#### `MobileMenu.tsx` (React)
| Prop | Type | Convex Source |
|------|------|---------------|
| `links` | `NavItem[]` | Passed from Header, same hardcoded data |

---

### 26.2 Section Components

#### `Hero.astro`
| Prop | Type | Convex Source |
|------|------|---------------|
| `title` | `string` | `heroes.getHeroByPage({ page_slug })` → `title` |
| `subtitle` | `string` | `heroes` → `subtitle` |
| `data.background_type` | `'youtube' \| 'image'` | `heroes` → `background_type` |
| `data.youtube_id` | `string` | `heroes` → `youtube_id` |
| `data.image_url` | `string` | `heroes` → `image_url` |
| `data.mobile_image_url` | `string` | `heroes` → `mobile_image_url` |
| `data.primary_cta` | `{text, href}` | `heroes` → `ctas[0]` |
| `data.secondary_ctas` | `Array<{text, href, variant}>` | `heroes` → `ctas[1:]` |
| `data.trust_badges` | `Array<{text, icon}>` | `heroes` → `badges[]` |

**Style notes**: Full-viewport black bg, YouTube iframe background on desktop, static image on mobile. Dark overlay `bg-black/70`. Bounce scroll indicator at bottom.

#### `ServiceFinder.astro`
| Prop | Type | Convex Source |
|------|------|---------------|
| `services` | `Service[]` | `services.getAllServices` → `title`, `slug` |
| `solutions` | `Solution[]` | `solutions.getAllSolutions` → `title`, `slug` |

**Cities**: **Hardcoded** array of 10 RM communes. Should be migrated to `locations.getAllCommunes`.

#### `ServicesGrid.astro`
| Prop | Type | Convex Source |
|------|------|---------------|
| `services` | `Service[]` | `services.getAllServices` → `slug`, `title`, `description`, `icon`, `image` |
| `title` | `string` | Static default: "Nuestros Servicios" |
| `subtitle` | `string` | Static default |
| `columns` | `2 \| 3` | Static default: 3 |
| `showAllLink` | `boolean` | From page prop |
| `background` | `'white' \| 'gray' \| 'primary' \| 'dark'` | From page prop |

**Sub-component**: Uses `FeatureCard`. Has **hardcoded Unsplash image mapping** by slug. Service `image` field from Convex overrides the hardcoded fallback.

#### `SolutionsGrid.astro`
| Prop | Type | Convex Source |
|------|------|---------------|
| `solutions` | `Solution[]` | `solutions.getAllSolutions` → `slug`, `title`, `description`, `icon`, `image` |
| `title` / `subtitle` | `string` | Static defaults |
| `showAllLink` / `background` | varies | From page prop |

**Sub-component**: Uses `FeatureCard`. **Hardcoded Unsplash image fallbacks** by slug.

#### `GuardPodSection.astro`
| Prop | Type | Convex Source |
|------|------|---------------|
| `title` | `string` | `content_blocks.getByPage({ page_slug: '/' })` filtered by `type='guardpod_feature'` → `title` |
| `subtitle` | `string` | Same content_block → `subtitle` |
| `description` | `string` | Same content_block → `content` |
| `data.video_id` | `string` | Same content_block → `data.video_id` |
| `data.features` | `Array<{icon, title, description}>` | Same content_block → `data.features` |
| `data.stats` | `Array<{value, label}>` | Same content_block → `data.stats` |
| `data.ctas` | `Array<{text, href, variant}>` | Same content_block → `data.ctas` |

**Style notes**: Full-width black section, 2-col grid (video left, content right), YouTube embed, stats row with `border-y border-white/10`.

#### `ClientsGrid.astro`
| Prop | Type | Convex Source |
|------|------|---------------|
| `clients` | `Partner[]` | `partners.getAll` filtered by `type='client'` sorted by `order` → `name`, `industry`, `icon`, `quote`, `logo_url` |

**Adapter**: Maps `logo_url` → `image` with fallback, `industry` defaults to `'Empresa'`.

#### `FAQ.astro`
| Prop | Type | Convex Source |
|------|------|---------------|
| `faqs` | `FAQItem[]` | `faqs.getAllFaqs` → `id`, `question`, `answer`, `category` |
| `maxItems` | `number` | Static: 6 (on homepage) |

**Features**: Category tab filtering (6 hardcoded tabs), accordion with JS toggle, auto-generates FAQSchema JSON-LD. Contact CTA → WhatsApp link.

#### `ProcessSection.astro`
| Prop | Type | Convex Source |
|------|------|---------------|
| `steps` | `ProcessStep[]` | `process_steps.getByPage({ page_slug })` → `number`, `title`, `description` |
| `title` / `subtitle` | `string` | Page static text |

**Style notes**: Horizontal timeline, numbered circles with `:hover → bg-gray-900 text-white`, connecting line on desktop.

#### `IndustryGrid.astro`
| Prop | Type | Convex Source |
|------|------|---------------|
| `industries` | `Industry[]` | `industries.getActiveIndustries` → `name`, `icon`, `href` |
| `columns` | `2\|3\|4\|6` | Page static: 6 |

**Sub-component**: Uses `IndustryCard`.

#### `FeaturesSection.astro`
| Prop | Type | Convex Source |
|------|------|---------------|
| `features` | `string[]` | `services.getServiceBySlug` → `features[]` (array of plain strings) |

**Style notes**: 3-column pill grid with black bullet dots, uppercase tracking-widest text, `gap-px bg-gray-100` border technique.

#### `BenefitsSection.astro`
| Prop | Type | Convex Source |
|------|------|---------------|
| `benefits` | `Benefit[]` | `services.getServiceBySlug` → `benefits[]` (mapped to `{icon: 'check', title, description: ''}`) |
| — | — | Or hardcoded on soluciones page |

**Style notes**: 2-column layout (title left, list right), check icons in black circles.

#### `CTASection.astro`
| Prop | Type | Convex Source |
|------|------|---------------|
| `headline` | `string` | Static from page |
| `headlineAccent` | `string` | Word rendered as `italic text-white/40` |
| `subtitle` | `string` | Static from page |
| `primaryButton` | `{text, href}` | Static from page |
| `secondaryButton` | `{text, href, variant}` | Static from page (often `site.phone`) |
| `trustBadges` | `string[]` | Static from page |

**Not data-driven from Convex** — all content is page-static.

#### `CTADual.astro`
Same as CTASection but with dual-button layout. **Not used on any current page**.

#### `StatsSection.astro`
Standalone stats display. **Not used on any current page**.

---

### 26.3 UI Primitive Components

#### `FeatureCard.astro`
| Prop | Type | Convex Source |
|------|------|---------------|
| `title` | `string` | From parent (ServicesGrid/SolutionsGrid) |
| `description` | `string` | From parent |
| `image` | `string` | Service/solution `image` or hardcoded Unsplash |
| `imageAlt` | `string` | Same as title or custom |
| `icon` | `string` | Service/solution `icon` |
| `href` | `string` | Constructed: `/servicios/${slug}` or `/soluciones/${slug}` |
| `badge` | `string` | `'Exclusivo'` for guardpod service |
| `linkText` | `string` | `'Conocer servicio'` or `'Ver soluciones'` |

**Style**: `rounded-2xl`, image header (h-48) with gradient overlay, icon in white rounded-xl corner, hover shadow-lg + scale-105 on image.

#### `ServiceCard.astro`
| Prop | Type | Convex Source |
|------|------|---------------|
| `title` | `string` | From parent |
| `description` | `string` | From parent |
| `icon` | `string` | From parent |
| `href` | `string` | From parent |

**Style**: No image. White card with icon in `rounded-lg bg-gray-50` container, `hover:border-black`, uppercase military typography (`tracking-[0.2em]`), CTA: "Explorar Configuración".

#### `Card.astro`
Generic card component. **Not used directly by any section** — replaced by FeatureCard/ServiceCard.

#### `Badge.astro`
| Prop | Type |
|------|------|
| `text` | `string` |
| `variant` | `'default' \| 'success' \| 'warning'` |

#### `Button.astro`
| Prop | Type |
|------|------|
| `href` | `string` |
| `variant` | `'primary' \| 'secondary' \| 'outline' \| 'accent'` |
| `size` | `'sm' \| 'md' \| 'lg'` |
| `class` | `string` (override) |

#### `Breadcrumbs.astro`
| Prop | Type |
|------|------|
| `items` | `Array<{name, url?}>` |

#### `Icon.astro`
| Prop | Type |
|------|------|
| `name` | `string` (Heroicons-mapped) |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg'` |
| `color` | `'white' \| 'gray' \| 'dark'` |

**Contains**: 20+ inline SVG paths for shield-check, car, bell, building, airplane, key, home, mountain, shopping-bag, hard-hat, bed, map-pin, users, clock, signal, check, chevron-down, arrow-right, chat-bubble-left, magnifying, badge-check, bell-alert.

#### `Container.astro`
Wrapper with `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`. Optional `size` prop.

#### `Section.astro`
Wrapper with section padding and background color system: `white`, `gray` (`bg-gray-50`), `primary`, `dark` (`bg-gray-900`).

---

### 26.4 Form Components

#### `ConvexContactForm.tsx` → wraps `ContactForm.tsx`
| Prop | Type | Convex Source |
|------|------|---------------|
| `servicio` | `string?` | URL param or manual |

**Writes to**: `contacts` table (via Convex mutation).

#### `ConvexLeadForm.tsx` → wraps `LeadForm.tsx`
| Prop | Type | Convex Source |
|------|------|---------------|
| `servicio` | `string?` | URL param |
| `source` | `string` | Page identifier: `'footer'`, `'cotizar'` |
| `theme` | `'light' \| 'dark'` | Styling variant |
| `compact` | `boolean` | Reduced fields mode |

**Writes to**: `leads` table (via Convex mutation).

---

### 26.5 SEO Components

#### `OrganizationSchema.astro`
Generates Schema.org `Organization` JSON-LD. Props: name, url, description, email, telephone, address.

#### `FAQSchema.astro`
Generates Schema.org `FAQPage` JSON-LD. Props: `faqs: Array<{question, answer}>`.

#### `ServiceSchema.astro`
Generates Schema.org `Service` JSON-LD. Props: `service: {name, description}`.

---

## 27. Page-by-Page Blueprint

> For each page: exact section order, component used, and the Convex query that feeds it.

### 27.1 Homepage (`/`)

| # | Section | Component | Convex Query | Fields Used |
|---|---------|-----------|-------------|-------------|
| 0 | Schema.org | `OrganizationSchema` | — | Static from `data/site.ts` |
| 0 | Schema.org | `FAQSchema` | `faqs.getAllFaqs` | `question`, `answer` |
| 1 | **Hero** | `Hero.astro` | `heroes.getHeroByPage({ page_slug: 'home' })` | `title`, `subtitle`, `background_type`, `youtube_id`, `image_url`, `mobile_image_url`, `ctas[]`, `badges[]` |
| 2 | **Service Finder** | `ServiceFinder.astro` | `services.getAllServices` + `solutions.getAllSolutions` | `title`, `slug` (+ hardcoded cities) |
| 3 | **Services Grid** | `ServicesGrid.astro` → `FeatureCard` | `services.getAllServices` | `slug`, `title`, `description`, `icon`, `image` |
| 4 | **GuardPod** | `GuardPodSection.astro` | `content_blocks.getByPage({ page_slug: '/' })` | `title`, `subtitle`, `content`, `data.{video_id, features, stats, ctas}` |
| 5 | **Solutions Grid** | `SolutionsGrid.astro` → `FeatureCard` | `solutions.getAllSolutions` | `slug`, `title`, `description`, `icon`, `image` |
| 6 | **Clients** | `ClientsGrid.astro` | `partners.getAll` | `name`, `industry`, `icon`, `quote`, `logo_url`, `order` (filtered: `type='client'`) |
| 7 | **FAQ** | `FAQ.astro` | `faqs.getAllFaqs` | `id`, `question`, `answer`, `category` (max 6) |

**Total Convex queries on homepage**: 7 (via `Promise.all`).

---

### 27.2 Services Hub (`/servicios`)

| # | Section | Component | Convex Query | Fields Used |
|---|---------|-----------|-------------|-------------|
| 1 | **Hero** | Inline (hardcoded bg image, stats) | — | All static |
| 2 | **Services Grid** | `ServiceCard` ×N | `services.getAllServices` | `title`, `description`, `icon`, `slug` |
| 3 | **Process** | `ProcessSection.astro` | `process_steps.getByPage({ page_slug: 'servicios' })` | `number`, `title`, `description` |
| 4 | **Industries** | `IndustryGrid.astro` → `IndustryCard` | `industries.getActiveIndustries` | `name`, `icon`, `href` |
| 5 | **CTA** | `CTASection.astro` | — | All static (headline, buttons, trust badges) |

---

### 27.3 Service Detail (`/servicios/[slug]`)

| # | Section | Component | Convex Query | Fields Used |
|---|---------|-----------|-------------|-------------|
| 0 | Schema.org | `ServiceSchema` | — | `service.title`, `service.description` |
| 1 | **Hero** | Inline (slug-driven bg) | `services.getServiceBySlug({ slug })` | `title`, `description`, `tagline`, `image`, `meta_title`, `meta_description`, `og_image`, `cta` |
| 2 | **Features** | `FeaturesSection.astro` | Same service | `features[]` (string array) |
| 3 | **Benefits** | `BenefitsSection.astro` | Same service | `benefits[]` (string array → mapped to objects) |
| 4 | **CTA** | `CTASection.astro` | — | Static text + `service.title` interpolation |

---

### 27.4 Solutions Hub (`/soluciones`)

| # | Section | Component | Convex Query | Fields Used |
|---|---------|-----------|-------------|-------------|
| 1 | **Hero** | Inline (hardcoded bg, dynamic stats) | — | Count from `solutions.length` |
| 2 | **Solutions Grid** | `ServiceCard` ×N | `solutions.getAllSolutions` | `name`, `description`, `icon`, `slug` |
| 3 | **Benefits** | `BenefitsSection.astro` | — | Hardcoded 3 benefits |
| 4 | **CTA** | `CTASection.astro` | — | Static |

> ⚠️ **Bug**: Solutions grid reads `solution.name` but service card expects `title`. The `solutions` table uses `name` not `title`.

---

### 27.5 Coverage Hub (`/cobertura`)

| # | Section | Component | Convex Query | Fields Used |
|---|---------|-----------|-------------|-------------|
| 1 | **Hero** | Inline (stats, breadcrumbs) | — | `communes.length` for stat |
| 2 | **Zones Grid** | Inline (nested loops) | `locations.getAllCommunes` | `name`, `slug`, `zone` (grouped by zone: norte/centro/oriente/poniente/sur) |
| 3 | **CTA** | Inline dark section | — | Static + `site.phone` |

**Links**: Each commune → `/cobertura/${commune.slug}`.

---

### 27.6 Blog Index (`/blog`)

| # | Section | Component | Convex Query | Fields Used |
|---|---------|-----------|-------------|-------------|
| 1 | **Header** | Inline | — | Static page metadata |
| 2 | **Posts Grid** | Inline cards ×N | `blog_posts.getPublishedPosts` | `slug`, `title`, `excerpt`, `cover_image`, `published_at`, `author` |

**Empty state**: "Próximamente" message with icon when no posts.

---

### 27.7 About Us (`/nosotros`)

| # | Section | Component | Convex Query | Fields Used |
|---|---------|-----------|-------------|-------------|
| 1 | **Hero** | Inline (stats from Convex) | `stats.getStatsByPage({ page_slug: 'nosotros' })` | `value`, `label` |
| 2 | **History** | Inline prose | — | Static text + `site.legalName` |
| 3 | **Values** | Inline grid | `company_values.getAllCompanyValues` | `title`, `icon`, `description` |
| 4 | **Team** | Inline grid | `team_members.getAllTeamMembers` | `name`, `role`, `avatar_url` |
| 5 | **Stats Banner** | Inline dark section | Same stats query | `value`, `label` |
| 6 | **CTA** | Inline | — | Static + `getWhatsAppUrl()` |

---

### 27.8 Contact (`/contacto`)

| # | Section | Component | Convex Query | Fields Used |
|---|---------|-----------|-------------|-------------|
| 0 | Schema.org | Inline ContactPage | — | Static from `data/site.ts` |
| 1 | **Hero** | Inline | `heroes.getHeroByPage({ page_slug: 'contacto' })` | `title`, `subtitle`, `image_url`, `badges[]` |
| 2 | **Form** | `ConvexContactForm` (React island) | **Writes** `contacts` | `name`, `email`, `phone`, `service`, `message` |
| 2 | **Info** | Inline | — | Static from `data/site.ts` (phone, email, address, hours) |
| 3 | **CTA** | Inline dark section | `ctas.getCtaByPage({ page_slug: 'contacto' })` | `headline`, `subheadline`, `buttons[]`, `background_type`, `background_value` |

---

### 27.9 Quote Page (`/cotizar`)

| # | Section | Component | Convex Query | Fields Used |
|---|---------|-----------|-------------|-------------|
| 0 | Schema.org | Inline Service | — | Static |
| 1 | **Hero** | Inline | — | All static (no Convex data) |
| 2 | **Form** | `ConvexLeadForm` (React island) | **Writes** `leads` | `name`, `email`, `phone`, `service`, `commune`, `message`, `source='cotizar'` |

---

### 27.10 Complete Convex Query Map

Summary of every Convex API endpoint consumed by the frontend:

| API Endpoint | Used By Pages | Table | Read/Write |
|-------------|---------------|-------|------------|
| `services.getAllServices` | Home, /servicios | `services` | Read |
| `services.getServiceBySlug` | /servicios/[slug] | `services` | Read |
| `solutions.getAllSolutions` | Home, /soluciones | `solutions` | Read |
| `faqs.getAllFaqs` | Home | `faqs` | Read |
| `site_config.get` | Home (→Footer) | `site_config` | Read |
| `heroes.getHeroByPage` | Home, /contacto | `heroes` | Read |
| `content_blocks.getByPage` | Home (GuardPod) | `content_blocks` | Read |
| `partners.getAll` | Home (clients) | `partners` | Read |
| `blog_posts.getPublishedPosts` | /blog | `blog_posts` | Read |
| `locations.getAllCommunes` | /cobertura | `communes` | Read |
| `team_members.getAllTeamMembers` | /nosotros | `team_members` | Read |
| `company_values.getAllCompanyValues` | /nosotros | `company_values` | Read |
| `stats.getStatsByPage` | /nosotros | `stats` | Read |
| `process_steps.getByPage` | /servicios | `process_steps` | Read |
| `industries.getActiveIndustries` | /servicios | `industries` | Read |
| `ctas.getCtaByPage` | /contacto | `ctas` | Read |
| `contacts.create` (mutation) | /contacto | `contacts` | Write |
| `leads.create` (mutation) | /cotizar, Footer | `leads` | Write |

---

### 27.11 Identified Issues & Gaps

| # | Issue | Impact | Fix |
|---|-------|--------|-----|
| 1 | **ServiceFinder cities are hardcoded** | Cannot update coverage without deploy | Migrate to `locations.getAllCommunes` |
| 2 | **Service/Solution images are hardcoded Unsplash** | Cannot manage from CMS | Add `image` field to services/solutions in Convex |
| 3 | **Header nav is hardcoded** | Cannot add/remove services without deploy | Wire to `site_config.nav_items` or generate from `services`/`solutions` |
| 4 | **Footer links are hardcoded** | Same as above | Wire to `site_config.footer_config` (already partially supported) |
| 5 | **CTASection content is all static** | Cannot A/B test CTAs | Connect to `ctas` table (pattern exists in contacto page) |
| 6 | **FAQ categories are hardcoded** | Cannot add new categories | Derive from `faqs` data or store in `faq_categories` table |
| 7 | **`solutions` table uses `name`** not `title` | Inconsistency with `services` table | Rename via schema migration |
| 8 | **Dual data source** | `data/site.ts` ≠ `site_config` in Convex | Migrate all static data to Convex |
| 9 | **No `/cobertura/[slug]` page** | Commune detail pages return 404 | Create dynamic route |
| 10 | **No `/soluciones/[slug]` page** | Solution detail pages return 404 | Create dynamic route |
| 11 | **No `/blog/[slug]` page** | Blog post pages return 404 | Create dynamic route |

---

## 28. Zero Hardcoded Text — Complete Content Externalization

> **Goal**: No visible text in the frontend should be hardcoded in `.astro`/`.tsx` files. Every string must originate from either Convex DB (for dynamic content) or a centralized i18n dictionary (for UI chrome).

### 28.1. Audit Results — Every Hardcoded String

| File | Category | Hardcoded Strings Found | Proposed Source |
|------|----------|------------------------|-----------------|
| `Header.astro` | Navigation | 8 nav labels, 6 service dropdown items, 5 solution dropdown items, "Cotizar Ahora" CTA | `site_config.nav_items[]` from Convex |
| `Footer.astro` | Navigation + Contact | 6 service links, 8 solution links, 4 company links, "Servicios"/"Soluciones"/"Empresa"/"Contacto" column titles, "¿Listo para proteger lo que importa?", "Solicitar cotización", "Política de Privacidad", "Términos de Servicio", copyright text | `site_config.footer_config` from Convex |
| `MobileMenu.tsx` | Navigation | Same as Header (receives links prop) | Same as Header |
| `index.astro` | Page metadata | Title, description, OG tags | `heroes.getByPage('home')` |
| `carreras.astro` | **100% static** | 5 benefits (title+description), 4 jobs (title+type+location+description+requirements[]), hero badge "Oportunidades de Despliegue", hero title "Evolucione con Nosotros", hero subtitle, section titles "Estándar Operativo", "Células Disponibles", CTA "¿No encuentra la posición ideal?", button labels "Ver Vacantes", "WhatsApp Operaciones", "Aplicar Despliegue", "Enviar CV", "Consulta WhatsApp" | NEW `careers` table + `ctas` table |
| `contacto.astro` | Mixed | Hero text, "Horario de Operaciones", "Lun-Vie: 08:00 - 18:00", "Emergencias: 24/7", trust indicators, Schema.org properties | `heroes`, `site_config`, `ctas` |
| `cotizar.astro` | Mixed | Hero badge "Cotización Express", hero title, subtitle, trust indicators "Respuesta <24h", "Sin Compromiso", "Asesor Dedicado" | `heroes`, `site_config` |
| `nosotros.astro` | Mixed | Hero text, "Nuestra Historia" title, history paragraphs (200+ words), mission/vision/values labels, stat labels | NEW `pages` table or `content_blocks` |
| `cobertura/index.astro` | Mixed | Hero title "Cobertura Operativa", subtitle, zone headers, stat labels, CTA text | `heroes`, `site_config`, `ctas` |
| `cobertura/[comuna].astro` | Templated | `zoneDisplayNames` object (5 entries), `getLocalBenefits()` (4 benefits), `serviceIconMap` (6 entries), 3 intro prose paragraphs (100+ words), section titles "Protocolos disponibles", "Presencia local estratégica", CTA text | `content_blocks` (commune template), `site_config` |
| `privacidad.astro` | **100% static legal** | 8 sections of legal prose (~1200 words), CTA, contact info | NEW `pages` table (type: 'legal') |
| `terminos.astro` | **100% static legal** | 8 sections of legal prose (~1400 words), CTA, contact info | NEW `pages` table (type: 'legal') |
| `blog/index.astro` | Page chrome | "Blog" title, section header, empty state message | `site_config` or i18n dictionary |
| `blog/[slug].astro` | Minimal | `site.name` reference for title construction | `site_config` |
| `servicios/index.astro` | Mixed | Section headers, CTA text | `heroes`, `ctas` |
| `servicios/[slug].astro` | Mostly dynamic | CTA text | `ctas` |
| `soluciones/index.astro` | Mixed | Hero stats labels, section titles | `heroes`, `ctas` |
| `CTASection.astro` | **100% static** | headline, subtitle, button labels (passed as props but always hardcoded from parent) | `ctas` table |
| `FAQ.astro` | Category labels | "Todas", "General", "Servicios", etc. (category tabs hardcoded) | `faqs` table (derive from distinct categories) |
| `ServiceFinder.astro` | City data | List of cities hardcoded as `<option>` elements | `locations.getAllCommunes()` |

### 28.2. Content Externalization Strategy

#### Tier 1 — Dynamic CMS Content (from Convex via Refine CMS)
Content that changes frequently or is managed by non-technical editors.

| Content Type | Convex Table | CMS Resource |
|-------------|-------------|--------------|
| Hero sections (title, subtitle, CTA, badge, bg) | `heroes` | Heroes |
| Services (title, tagline, description, features, image) | `services` | Services |
| Solutions (title, description, features, image) | `solutions` | Solutions |
| FAQs (question, answer, category) | `faqs` | FAQs |
| Blog posts (title, content, author, tags) | `blog_posts` | Blog Posts |
| Team members (name, role, bio, image) | `team_members` | Team Members |
| Company values (title, description, icon) | `company_values` | Company Values |
| Statistics (label, value, icon) | `stats` | Statistics |
| Process steps (title, description, order) | `process_steps` | Process Steps |
| Industries (name, description, icon) | `industries` | Industries |
| Locations / Communes (name, zone, slug, meta) | `locations` | Locations |
| Partners / Clients (name, logo, industry, quote) | `partners` | Partners |
| CTAs (headline, subtitle, cta_primary, cta_secondary) | `ctas` | Call-to-Actions |
| Content blocks (for composite sections like GuardPod) | `content_blocks` | Content Blocks |
| Job listings (title, type, location, description, reqs) | NEW `careers` | Careers |
| Legal pages (title, slug, body_md, last_updated) | NEW `pages` | Pages |
| Navigation config (nav_items, footer_config) | `site_config` | Site Config |
| Site globals (name, phone, email, address, social) | `site_config` | Site Config |

#### Tier 2 — UI Chrome (from i18n Dictionary)
Static labels that don't change but should be centralized for consistency and future i18n support.

```typescript
// src/i18n/es.ts — Centralized UI strings
export const ui = {
  nav: {
    home: 'Inicio',
    services: 'Servicios',
    solutions: 'Soluciones',
    coverage: 'Cobertura',
    contact: 'Contacto',
    quote: 'Cotizar Ahora',
  },
  footer: {
    copyright: '© {year} Guardman Chile. Todos los derechos reservados.',
    privacy: 'Política de Privacidad',
    terms: 'Términos de Servicio',
    phone_label: 'Teléfono',
    email_label: 'Email',
    location_label: 'Ubicación',
  },
  forms: {
    name: 'Nombre Completo',
    email: 'Correo Electrónico',
    phone: 'Teléfono',
    company: 'Empresa',
    message: 'Mensaje',
    service: 'Servicio',
    city: 'Ciudad',
    submit: 'Enviar',
    submitting: 'Enviando...',
    success: '¡Mensaje enviado correctamente!',
    error: 'Error al enviar. Intente nuevamente.',
  },
  sections: {
    read_more: 'Ver más',
    view_all: 'Ver todos',
    back: 'Volver',
    loading: 'Cargando...',
  },
  breadcrumbs: {
    home: 'Inicio',
  },
} as const;
```

#### Tier 3 — Template Strings (Convex + Interpolation)
Strings that combine CMS data with templates (e.g., commune pages).

```typescript
// src/i18n/templates.ts
export const templates = {
  commune: {
    hero_title: (name: string) => `Seguridad en\n${name}`,
    hero_subtitle: (name: string) =>
      `Operación táctica y protección integral para empresas y condominios en ${name}. Personal certificado OS10 con presencia local permanente.`,
    intro_p1: (name: string) =>
      `Guardman ofrece soluciones integrales de seguridad privada en ${name} y toda la Región Metropolitana.`,
    cta_title: (name: string) => `Asegure su propiedad en ${name}`,
    zone_coverage: (commune: string, zone: string) =>
      `Además de ${commune}, operamos en otras comunas de la ${zone}.`,
  },
  careers: {
    positions_count: (count: number) =>
      `${count} posiciones abiertas para despliegue inmediato en la corporación.`,
  },
} as const;
```

### 28.3. New Tables Required

#### `careers` Table
```typescript
careers: defineTable({
  title: v.string(),           // "Guardia de Seguridad OS10"
  slug: v.string(),
  type: v.string(),            // "Tiempo Completo", "Part-time"
  location: v.string(),        // "Santiago, RM"
  description: v.string(),
  requirements: v.array(v.string()),
  benefits_ids: v.optional(v.array(v.id("career_benefits"))),
  is_active: v.boolean(),
  sort_order: v.number(),
})

career_benefits: defineTable({
  title: v.string(),
  description: v.string(),
  icon: v.string(),
  sort_order: v.number(),
})
```

#### `pages` Table (Legal / Static Content)
```typescript
pages: defineTable({
  title: v.string(),           // "Política de Privacidad"
  slug: v.string(),            // "privacidad"
  type: v.union(v.literal("legal"), v.literal("info"), v.literal("landing")),
  body_md: v.string(),         // Full markdown content
  meta_title: v.optional(v.string()),
  meta_description: v.optional(v.string()),
  last_updated: v.string(),    // "17 de Febrero, 2026"
  is_published: v.boolean(),
})
```

### 28.4. Implementation Priority

| Priority | Action | Impact |
|----------|--------|--------|
| **P0** | Wire Header/Footer nav from `site_config` | Eliminates 30+ hardcoded nav strings |
| **P0** | Create `careers` table + wire `carreras.astro` | Eliminates 100% hardcoded page |
| **P0** | Create `pages` table + wire `privacidad`/`terminos` | Eliminates 2 fully hardcoded pages |
| **P1** | Wire all CTAs from `ctas` table | Eliminates 20+ scattered CTA strings |
| **P1** | Create `i18n/es.ts` dictionary | Centralizes 60+ UI chrome strings |
| **P1** | Wire `ServiceFinder` cities from `locations` | Removes hardcoded city dropdown |
| **P2** | Create `i18n/templates.ts` | Centralizes template strings for communes |
| **P2** | Wire FAQ category tabs from distinct categories | Removes hardcoded category labels |

---

## 29. Refine CMS Integration — Admin UX & Data Flow

> **Goal**: Map every Convex table to a Refine CMS resource and design the admin experience for non-technical content editors.

### 29.1. Architecture Overview

```
┌──────────────────────────────────────────────────┐
│  REFINE CMS (React SPA)                          │
│  @refinedev/core + @refinedev/antd               │
│                                                   │
│  ┌─────────────────────────────────────────────┐ │
│  │  CUSTOM CONVEX DATA PROVIDER                │ │
│  │  Implements: getList, getOne, create,       │ │
│  │  update, deleteOne, getMany                 │ │
│  │                                              │ │
│  │  Maps Refine CRUD ops → Convex queries/     │ │
│  │  mutations via ConvexHttpClient             │ │
│  └──────────────┬──────────────────────────────┘ │
│                 │                                 │
│  ┌──────────────▼──────────────────────────────┐ │
│  │  CONVEX BACKEND                             │ │
│  │  15 existing tables + 2 new tables          │ │
│  │  Queries: getAll, getById, getBySlug        │ │
│  │  Mutations: create, update, delete          │ │
│  └─────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────┘
```

### 29.2. Convex Data Provider for Refine

```typescript
// admin/src/providers/convexDataProvider.ts
import { DataProvider } from "@refinedev/core";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@convex/_generated/api";

const convex = new ConvexHttpClient(import.meta.env.VITE_CONVEX_URL);

export const convexDataProvider: DataProvider = {
  getList: async ({ resource, pagination, sorters, filters }) => {
    // Map resource name → Convex query
    const queryMap: Record<string, any> = {
      services: api.services.getAllServices,
      solutions: api.solutions.getAllSolutions,
      heroes: api.heroes.getAll,
      faqs: api.faqs.getAllFAQs,
      blog_posts: api.blog_posts.getAllPosts,
      site_config: api.site_config.getAll,
      locations: api.locations.getAllCommunes,
      team_members: api.team_members.getAll,
      company_values: api.company_values.getAll,
      stats: api.stats.getAll,
      process_steps: api.process_steps.getAll,
      industries: api.industries.getAll,
      partners: api.partners.getAll,
      ctas: api.ctas.getAll,
      content_blocks: api.content_blocks.getAll,
      careers: api.careers.getAll,        // NEW
      pages: api.pages.getAll,            // NEW
    };
    const data = await convex.query(queryMap[resource]);
    // Apply client-side pagination, sorting, filtering
    return { data, total: data.length };
  },

  getOne: async ({ resource, id }) => {
    const data = await convex.query(api[resource].getById, { id });
    return { data };
  },

  create: async ({ resource, variables }) => {
    const data = await convex.mutation(api[resource].create, variables);
    return { data };
  },

  update: async ({ resource, id, variables }) => {
    const data = await convex.mutation(api[resource].update, { id, ...variables });
    return { data };
  },

  deleteOne: async ({ resource, id }) => {
    await convex.mutation(api[resource].remove, { id });
    return { data: { id } as any };
  },

  getApiUrl: () => import.meta.env.VITE_CONVEX_URL,
};
```

### 29.3. CMS Resource Registry

| Resource | Convex Table | List Fields | Form Fields | Special UX |
|----------|-------------|-------------|-------------|------------|
| **Heroes** | `heroes` | page, title, badge | title, subtitle, badge, cta_primary_text/href, cta_secondary_text/href, background_type, background_url, trust_badges[] | YouTube URL preview, image upload |
| **Services** | `services` | title, slug, is_active | title, slug, tagline, description, features[], benefits[], icon, image, is_active, sort_order | Slug auto-gen from title, features as tag input |
| **Solutions** | `solutions` | name, slug, is_active | name→title (rename), slug, description, features[], icon, image, is_active, sort_order | Same as Services |
| **FAQs** | `faqs` | question, category | question, answer (rich text), category (select), sort_order | Category grouping, markdown editor for answer |
| **Blog Posts** | `blog_posts` | title, author, status | title, slug, excerpt, content[] (markdown blocks), author, cover_image, tags[], status, published_at | Markdown editor, tag input, cover image upload, draft/publish toggle |
| **Team Members** | `team_members` | name, role | name, role, bio, image, social_links{}, sort_order | Image upload, social links as key-value pairs |
| **Company Values** | `company_values` | title, icon | title, description, icon (select), sort_order | Icon selector component |
| **Statistics** | `stats` | label, value | label, value, suffix, icon, sort_order | Numeric input with suffix preview |
| **Process Steps** | `process_steps` | title, order | title, description, step_number, icon | Drag-and-drop reorder |
| **Industries** | `industries` | name, icon | name, slug, description, icon, image, is_active, sort_order | Icon selector |
| **Locations** | `locations` | name, zone | name, slug, zone (select), population, meta_title, meta_description, og_image | Zone dropdown, SEO fields preview |
| **Partners** | `partners` | name, industry | name, industry, logo, quote, is_featured, sort_order | Logo upload |
| **CTAs** | `ctas` | identifier, headline | identifier (slug), headline, subtitle, cta_primary_text, cta_primary_href, cta_secondary_text, cta_secondary_href, background | Identifier for referencing from pages |
| **Content Blocks** | `content_blocks` | identifier, type | identifier, type, title, subtitle, body_md, features[], stats[], media_url | Flexible block editor |
| **Site Config** | `site_config` | key | key, value (JSON editor) | Key-value config with JSON validation |
| **Careers** | `careers` | title, type, is_active | title, slug, type, location, description, requirements[], is_active, sort_order | Requirements as tag list |
| **Pages** | `pages` | title, type, is_published | title, slug, type, body_md, meta_title, meta_description, last_updated, is_published | Full markdown editor, SEO preview |

### 29.4. Admin Navigation Structure

```
📦 Guardman CMS
├── 📊 Dashboard                  ← Stats overview (leads, contacts, page views)
├── 📝 Content
│   ├── Heroes                    ← Section-level hero content
│   ├── CTAs                      ← Reusable call-to-action blocks
│   ├── Content Blocks            ← Flexible sections (GuardPod, etc.)
│   ├── Pages                     ← Legal / static pages (privacidad, terminos)
│   └── Blog Posts                ← Article management with drafts
├── 🏢 Business
│   ├── Services                  ← Service pages and details
│   ├── Solutions                 ← Industry solution pages
│   ├── Industries                ← Industry categories
│   └── Careers                   ← Job listings
├── 🌍 SEO & Coverage
│   ├── Locations / Communes      ← 52+ commune pages
│   ├── FAQs                      ← Grouped by category
│   └── Statistics                ← Trust numbers (clients, guards, etc.)
├── 👥 About
│   ├── Team Members              ← Staff profiles
│   ├── Company Values            ← Mission/vision/values
│   ├── Partners                  ← Client logos and quotes
│   └── Process Steps             ← How-we-work timeline
└── ⚙️ Settings
    └── Site Config               ← Global settings, nav, footer, social links
```

### 29.5. Key UX Features for Non-Technical Editors

| Feature | Implementation | Benefit |
|---------|---------------|---------|
| **Live Preview** | Iframe showing site with draft changes via Convex real-time subscriptions | Editors see changes before publishing |
| **Slug Auto-Generation** | `useWatch` hook on title field → `slugify(title)` | Prevents broken URLs |
| **Image Upload** | Convex file storage + upload component in forms | No external image hosting needed |
| **Rich Text / Markdown** | `@uiw/react-md-editor` integrated in form fields | Editors write in visual WYSIWYG |
| **Drag-and-Drop Reorder** | `@dnd-kit/sortable` on list views for `sort_order` tables | Intuitive content ordering |
| **SEO Preview** | Google SERP preview component showing title (60ch max) + description (155ch max) | Editors optimize for search |
| **Publish/Draft Toggle** | `is_published`/`is_active` boolean switch in forms | Content staging before going live |
| **Audit Log** | `_creationTime` from Convex + custom `updated_by` field | Track who changed what |
| **Bulk Actions** | Refine's built-in list selection + bulk delete/publish | Efficient content management |

### 29.6. Media Management

```
┌─────────────────────────────────┐
│  MEDIA FLOW                     │
│                                  │
│  Refine Upload Widget           │
│       ↓                          │
│  Convex File Storage             │
│  (convex.storage.store())       │
│       ↓                          │
│  Returns: storageId             │
│       ↓                          │
│  convex.storage.getUrl(id)      │
│  → https://xxx.convex.cloud/... │
│       ↓                          │
│  Astro <Image> component        │
│  → Auto WebP/AVIF conversion   │
│  → Responsive srcset            │
└─────────────────────────────────┘
```

---

## 30. Photography & Image SEO Treatment

> **Goal**: Every image in the system must be optimized for performance (WebP/AVIF), accessibility (alt text), and SEO (structured data, sitemaps).

### 30.1. Current State — Image Audit

| Component | Image Source | Issues |
|-----------|------------|--------|
| `Hero.astro` | YouTube embed OR `background_url` from Convex | No `<Image>` optimization, no alt text on bg |
| `ServicesGrid.astro` | Hardcoded Unsplash URLs in `serviceImages{}` map | 6 external URLs, no responsive variants, no alt from Convex |
| `SolutionsGrid.astro` | Hardcoded Unsplash URLs in `solutionImages{}` map | 5 external URLs, same problems |
| `ClientsGrid.astro` | `partner.logo` from Convex | No `<Image>` processing, raw URL |
| `FeatureCard.astro` | `image` prop from parent | Uses raw `<img>`, no optimization |
| `ServiceCard.astro` | `icon` prop only (no photo) | OK — icon-based |
| `IndustryCard.astro` | `image` prop | Uses raw `<img>` |
| Blog cover images | `post.cover_image` from Convex | Raw URL, no srcset |
| Team member photos | `member.image` from Convex | Raw URL, no optimization |
| `cobertura/[comuna].astro` | Hardcoded Unsplash in hero bg | External URL, not managed |
| `carreras.astro` | Hardcoded Unsplash in hero bg | External URL, not managed |
| Logo (`Header`/`Footer`) | `/images/guardman_logo.png` in `public/` | Static, no optimization |

### 30.2. Astro Image Optimization Pipeline

#### Using `<Image />` Component
```astro
---
import { Image } from 'astro:assets';
---

<!-- Astro automatically: -->
<!-- 1. Converts to WebP (default) -->
<!-- 2. Generates width/height for CLS prevention -->
<!-- 3. Adds loading="lazy" for below-fold -->
<!-- 4. Infers dimensions from local files -->

<Image
  src={service.image}
  alt={service.title + ' - Guardman Chile'}
  width={800}
  height={600}
  format="webp"
  quality={80}
  loading="lazy"
  decoding="async"
  class="rounded-xl object-cover"
/>
```

#### Using `<Picture />` for Multi-Format Fallback
```astro
---
import { Picture } from 'astro:assets';
---

<!-- Generates <picture> with AVIF → WebP → JPEG fallback -->
<Picture
  src={hero.background_url}
  alt={hero.title}
  formats={['avif', 'webp']}
  widths={[400, 800, 1200, 1920]}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1920px"
  loading="eager"  <!-- Hero images must NOT be lazy -->
  class="w-full h-full object-cover"
/>
```

### 30.3. Image SEO Checklist

| Requirement | Implementation | Impact |
|------------|---------------|--------|
| **Descriptive alt text** | Every `<Image>` must have alt from CMS: `{service.title} - Guardman Chile` | Accessibility + Google Image Search |
| **Filename optimization** | Convex storage → rename on upload: `guardias-seguridad-santiago.webp` | Google indexes filenames |
| **Width & Height attributes** | Always set via `<Image>` component to prevent CLS | Core Web Vitals |
| **Lazy loading** | `loading="lazy"` for all below-fold images | LCP optimization |
| **Eager loading for hero** | `loading="eager"` + `fetchpriority="high"` for above-fold LCP images | LCP score improvement |
| **Preload critical images** | `<link rel="preload" as="image">` in `<head>` for hero background | LCP < 2.5s |
| **AVIF + WebP** | `<Picture formats={['avif', 'webp']}>` | 50-80% smaller than JPEG |
| **Responsive srcset** | `widths={[400, 800, 1200]}` + `sizes` attribute | Serve correct size per device |
| **Image sitemap** | Auto-generate at `/sitemap-images.xml` | Google discovers all images |
| **Open Graph images** | 1200×630 OG images per page, from Convex or auto-generated | Social sharing previews |
| **Schema.org ImageObject** | Add `image` property to LocalBusiness, Service, Article schemas | Rich snippets in SERPs |

### 30.4. Image Storage Architecture

```
┌──────────────────────┐
│  CMS Upload (Refine) │
│  Accepts: JPG, PNG,  │
│  WebP, AVIF, SVG     │
└─────────┬────────────┘
          ↓
┌──────────────────────┐
│  Convex File Storage │
│  Returns: storageId  │
│  URL: convex.cloud/  │
└─────────┬────────────┘
          ↓
┌──────────────────────┐
│  Astro Build Time    │
│  <Image> / <Picture> │
│  → WebP/AVIF convert │
│  → srcset generation │
│  → width/height calc │
│  → lazy/eager attrs  │
└─────────┬────────────┘
          ↓
┌──────────────────────┐
│  CDN (Vercel Edge)   │
│  Cached, compressed  │
│  Brotli/gzip         │
└──────────────────────┘
```

### 30.5. Alt Text Generation Strategy

| Image Type | Alt Text Pattern | Example |
|-----------|-----------------|---------|
| Service hero | `{service.title} en {commune OR Santiago}` | "Guardias de Seguridad en Las Condes" |
| Solution card | `{solution.title} - seguridad privada` | "Seguridad para Condominios - seguridad privada" |
| Team member | `{member.name}, {member.role} en Guardman` | "Carlos Soto, Jefe de Operaciones en Guardman" |
| Client logo | `Logo de {partner.name}` | "Logo de Falabella" |
| Blog cover | `{post.title}` | "5 Claves para la Seguridad en Condominios" |
| Hero background | `Servicios de seguridad Guardman Chile` | Decorative but still indexed |
| Commune hero | `Seguridad privada en {commune.name}` | "Seguridad privada en Providencia" |

### 30.6. Convex Schema for Image Fields

Every table that stores images should use this pattern:

```typescript
// Standard image field pattern
image: v.optional(v.string()),           // Convex storage URL
image_alt: v.optional(v.string()),       // SEO alt text
image_storage_id: v.optional(v.string()), // Convex storageId for deletion
```

Tables needing `image` + `image_alt` fields added: `services`, `solutions`, `industries`, `careers`, `pages`.

---

## 31. Advanced Local SEO — Chile Market Domination

> **Goal**: Implement cutting-edge local SEO techniques specifically for dominating "seguridad privada" searches in Chile's Región Metropolitana, covering Google Business Profile, Schema.org, programmatic SEO, and Chile-specific legal compliance signals.

### 31.1. Google Business Profile (GBP) Optimization

#### Service Area Business Configuration
Since Guardman covers the entire Región Metropolitana without a public storefront, configure as a **Service Area Business (SAB)**:

| Setting | Value |
|---------|-------|
| Business Name | Guardman Chile - Seguridad Privada |
| Primary Category | Security Guard Service |
| Secondary Categories | Security Alarm System Supplier, Security System Installer, Business Security System |
| Service Areas | All 52 communes of Región Metropolitana (individual entries) |
| Address | Hidden (SAB mode) |
| Phone | +56 9 3000 0010 |
| Website | https://guardman.cl |
| Hours | Mon-Fri 08:00-18:00, Emergency: 24/7 |

#### GBP Content Calendar (Monthly)

| Week | Action | Content Type |
|------|--------|-------------|
| 1 | Google Post: service highlight | "Servicio del Mes: Patrullaje Preventivo para Condominios" |
| 2 | Photo upload (5-10 images) | Team photos, equipment, vehicles, client sites (with consent) |
| 3 | Google Post: local coverage | "Ahora con cobertura ampliada en Maipú y Pudahuel" |
| 4 | Q&A proactive seeding | Pre-populate "Ask" section with top 5 FAQs |

#### Review Acquisition Strategy

| Technique | Implementation |
|-----------|---------------|
| Post-service email | Automated email 24h after service delivery with GBP review link |
| WhatsApp follow-up | Manual message with direct review URL |
| QR code on guard reports | Physical QR linking to GBP review page |
| Response protocol | Reply to ALL reviews within 24h, mention service + commune in response |
| Target | 5+ reviews/month with ≥4.5 average rating |

### 31.2. Schema.org — Advanced Implementation

#### 31.2.1. LocalBusiness per Commune
Each `/cobertura/[comuna]` page should have its own `LocalBusiness` schema:

```json
{
  "@context": "https://schema.org",
  "@type": "SecurityCompany",
  "name": "Guardman Chile - Seguridad en Las Condes",
  "description": "Servicios de seguridad privada en Las Condes...",
  "url": "https://guardman.cl/cobertura/las-condes",
  "telephone": "+56930000010",
  "areaServed": {
    "@type": "City",
    "name": "Las Condes",
    "containedInPlace": {
      "@type": "AdministrativeArea",
      "name": "Región Metropolitana de Santiago"
    }
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Servicios de Seguridad",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Guardias de Seguridad OS10",
          "url": "https://guardman.cl/servicios/guardias-seguridad"
        }
      }
    ]
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "127"
  }
}
```

#### 31.2.2. Service Schema per Service Page
```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "Guardias de Seguridad Privada",
  "provider": { "@type": "SecurityCompany", "name": "Guardman Chile" },
  "areaServed": "Región Metropolitana de Santiago, Chile",
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "itemListElement": []
  },
  "termsOfService": "https://guardman.cl/terminos",
  "review": []
}
```

#### 31.2.3. BreadcrumbList on ALL Pages
Already partially implemented; ensure consistency:

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://guardman.cl/" },
    { "@type": "ListItem", "position": 2, "name": "Cobertura", "item": "https://guardman.cl/cobertura" },
    { "@type": "ListItem", "position": 3, "name": "Las Condes" }
  ]
}
```

### 31.3. Programmatic SEO — Commune × Service Matrix

Generate pages at the intersection of **services × communes** for maximum long-tail coverage:

| URL Pattern | Target Query | Page Count |
|-------------|-------------|-----------|
| `/cobertura/{comuna}` | "seguridad privada {comuna}" | 52 pages |
| `/servicios/{service}` | "guardias de seguridad Chile" | 6 pages |
| `/servicios/{service}/{comuna}` | "guardias seguridad Las Condes" | 312 pages |
| **Total programmatic pages** | | **370 pages** |

#### Content Uniqueness Strategy (Avoid Thin Content)
Each service×commune page must have **≥300 words of unique content**:

1. **Dynamic intro paragraph** — generated template with commune-specific data (population, zone, known landmarks)
2. **Local benefits** — 4 benefits with commune-interpolated descriptions
3. **Service feature list** — from `services` table features[]
4. **Zone coverage section** — links to neighboring communes in same zone
5. **LocalBusiness + Service Schema** — unique structured data per page
6. **Unique meta title/description** — from template: `"{service} en {commune} | Guardman"`

### 31.4. Chile-Specific Legal Compliance Signals

#### Ley N° 21.659 (New Private Security Law, Nov 2025)
Signal compliance prominently in content and schema to build E-E-A-T:

| Signal | Where | Content |
|--------|-------|---------|
| OS10 Certification | Service pages, About page | "Personal certificado bajo normativa OS10 del Ministerio del Interior" |
| Company authorization | Footer, About page | "Empresa autorizada por la Subsecretaría de Prevención del Delito" |
| Insurance and bonding | Terms page, Service pages | "Cobertura de responsabilidad civil conforme a Ley 21.659" |
| Schema.org `knowsAbout` | Organization schema | `["Ley 21.659", "OS10", "Seguridad Privada Chile"]` |

#### Ley N° 21.719 (Data Protection, 2024)
| Signal | Where |
|--------|-------|
| Privacy policy page | `/privacidad` — already exists |
| Cookie consent banner | Global — needed |
| Data processing notice | Contact/quote forms |
| DPO contact | Footer or privacy page |

### 31.5. Link Building — Chile Local Strategies

| Strategy | Target | Action |
|----------|--------|--------|
| **Industry Directories** | ACHS (Asociación Chilena de Seguridad), Cámara de Comercio | Register and maintain profiles |
| **Local Directories** | PaginasAmarillas.cl, EmolNegocios, CyLex Chile | NAP-consistent listings |
| **Content Partnerships** | Chilean security/business blogs | Guest posts on security trends |
| **Sponsorships** | Local events, industry conferences (EXPO Seguridad) | Event sponsorship with backlinks |
| **Municipality pages** | Commune official websites | Partner for community safety programs |
| **HARO / Connectively** | Security journalists | Expert quotes on security topics |

### 31.6. Core Web Vitals Optimization

| Metric | Target | Astro Technique |
|--------|--------|----------------|
| **LCP** < 2.5s | Hero image | `<Image loading="eager" fetchpriority="high">`, `<link rel="preload">` |
| **FID/INP** < 200ms | Interactive forms | `client:visible` for forms (defer hydration) |
| **CLS** < 0.1 | All images | `width` + `height` on every `<img>`, fixed-size containers |
| **TTFB** < 800ms | SSR | Vercel Edge Functions, Convex edge caching |
| **TBT** < 200ms | All pages | Astro ships 0 JS by default; only hydrate islands |

### 31.7. Semantic HTML & Heading Hierarchy

Every page must follow this heading structure:

```
<h1> — Unique per page, contains primary keyword (1 per page only)
  <h2> — Section headers (services, benefits, coverage, CTA)
    <h3> — Sub-section items (individual service, benefit, commune)
```

Example for `/cobertura/las-condes`:
```
<h1>Seguridad Privada en Las Condes</h1>
  <h2>Empresa de Seguridad en Las Condes</h2>
  <h2>Protocolos disponibles</h2>
    <h3>Guardias de Seguridad</h3>
    <h3>Alarmas Ajax</h3>
  <h2>Presencia local estratégica</h2>
  <h2>Zona de Cobertura - Zona Oriente</h2>
  <h2>Asegure su propiedad en Las Condes</h2>
```

---

## 32. File Tree Architecture Blueprint

> **Goal**: Define a clean, scalable, simple, and functional file system structure that supports the entire application including the public site, admin CMS, Convex backend, and SEO infrastructure.

### 32.1. Current State — File Tree Audit

```
web/src/
├── components/        ← 43 files, FLAT subdirectories
│   ├── forms/         ← 4 form components
│   ├── layout/        ← Header, Footer, MobileMenu
│   ├── og/            ← OG image template
│   ├── sections/      ← 18 section components (LARGEST folder)
│   ├── seo/           ← 4 SEO schema components
│   └── ui/            ← 10 UI primitives
├── config/            ← 1 file (navigation?)
├── content/           ← 10 files (Astro content collections)
├── data/              ← 1 file (site.ts — NEEDS REMOVAL)
├── layouts/           ← 1 file (BaseLayout.astro)
├── lib/               ← 1 file (convex.ts client)
├── pages/             ← 20 files across 6 subdirectories
├── styles/            ← 1 file (global.css)
└── utils/             ← 1 file (seo.ts)
```

**Problems identified:**
- `data/site.ts` is a static data source that should be eliminated (move to Convex `site_config`)
- `config/` has only 1 file — could be merged with `lib/`
- No `i18n/` directory for content externalization
- No `types/` directory for shared TypeScript types
- `sections/` has 18+ files and growing — could benefit from feature grouping
- No `hooks/` directory for shared React hooks
- Missing `assets/` directory for local images that need Astro optimization

### 32.2. Proposed File Tree — Clean Architecture

```
guardman/
├── convex/                          # ← CONVEX BACKEND (unchanged)
│   ├── _generated/                  #    Auto-generated types
│   ├── schema.ts                    #    Database schema
│   ├── services.ts                  #    Service queries/mutations
│   ├── solutions.ts                 #    Solution queries/mutations
│   ├── heroes.ts                    #    Hero queries/mutations
│   ├── faqs.ts                      #    FAQ queries/mutations
│   ├── blog_posts.ts                #    Blog queries/mutations
│   ├── site_config.ts               #    Site config queries/mutations
│   ├── locations.ts                 #    Location queries/mutations
│   ├── team_members.ts              #    Team member queries/mutations
│   ├── company_values.ts            #    Company values queries/mutations
│   ├── stats.ts                     #    Stats queries/mutations
│   ├── process_steps.ts             #    Process steps queries/mutations
│   ├── industries.ts                #    Industry queries/mutations
│   ├── partners.ts                  #    Partner queries/mutations
│   ├── ctas.ts                      #    CTA queries/mutations
│   ├── content_blocks.ts            #    Content block queries/mutations
│   ├── contacts.ts                  #    Contact form mutations
│   ├── leads.ts                     #    Lead form mutations
│   ├── careers.ts                   #    NEW: Career queries/mutations
│   ├── pages.ts                     #    NEW: Static page queries/mutations
│   └── auth.ts                      #    Admin authentication
│
├── web/                             # ← ASTRO FRONTEND
│   ├── public/                      #    Static assets (no processing)
│   │   ├── fonts/                   #    Custom fonts (Inter, etc.)
│   │   ├── images/                  #    Static images (logo, favicon)
│   │   │   └── guardman_logo.png
│   │   ├── robots.txt
│   │   ├── sitemap.xml
│   │   └── favicon.svg
│   │
│   └── src/
│       ├── assets/                  #    NEW: Images processed by Astro
│       │   ├── heroes/              #    Hero background images
│       │   ├── services/            #    Service card images
│       │   ├── solutions/           #    Solution card images
│       │   └── team/                #    Team member photos
│       │
│       ├── components/              #    UI Components (organized by concern)
│       │   ├── layout/              #    Page scaffold
│       │   │   ├── Header.astro
│       │   │   ├── Footer.astro
│       │   │   └── MobileMenu.tsx
│       │   │
│       │   ├── sections/            #    Page sections (composites)
│       │   │   ├── Hero.astro
│       │   │   ├── ServicesGrid.astro
│       │   │   ├── SolutionsGrid.astro
│       │   │   ├── ClientsGrid.astro
│       │   │   ├── GuardPodSection.astro
│       │   │   ├── FAQ.astro
│       │   │   ├── CTASection.astro
│       │   │   ├── ServiceFinder.astro
│       │   │   ├── ProcessSection.astro
│       │   │   ├── BenefitsSection.astro
│       │   │   ├── FeaturesSection.astro
│       │   │   ├── IndustryGrid.astro
│       │   │   ├── StatsSection.astro
│       │   │   └── ChallengesSection.astro
│       │   │
│       │   ├── ui/                  #    Atomic UI primitives
│       │   │   ├── Badge.astro
│       │   │   ├── Breadcrumbs.astro
│       │   │   ├── Button.astro
│       │   │   ├── Card.astro
│       │   │   ├── Container.astro
│       │   │   ├── FeatureCard.astro
│       │   │   ├── Icon.astro
│       │   │   ├── IndustryCard.astro
│       │   │   ├── Section.astro
│       │   │   ├── ServiceCard.astro
│       │   │   └── index.ts          #    NEW: barrel exports
│       │   │
│       │   ├── forms/               #    Form components (React islands)
│       │   │   ├── ConvexContactForm.tsx
│       │   │   ├── ConvexLeadForm.tsx
│       │   │   └── index.ts
│       │   │
│       │   └── seo/                 #    SEO schema components
│       │       ├── FAQSchema.astro
│       │       ├── LocalBusinessSchema.astro
│       │       ├── OrganizationSchema.astro
│       │       ├── ServiceSchema.astro
│       │       └── BreadcrumbSchema.astro  # NEW
│       │
│       ├── i18n/                    #    NEW: Content externalization
│       │   ├── es.ts                #    Spanish UI strings
│       │   └── templates.ts         #    Template functions
│       │
│       ├── layouts/                 #    Page layouts
│       │   └── BaseLayout.astro
│       │
│       ├── lib/                     #    Shared utilities & clients
│       │   ├── convex.ts            #    ConvexHttpClient init
│       │   ├── seo.ts              #    SEO utility functions (moved from utils/)
│       │   └── image.ts            #    NEW: Image helper functions
│       │
│       ├── pages/                   #    File-based routing
│       │   ├── index.astro          #    Homepage
│       │   ├── nosotros.astro       #    About page
│       │   ├── contacto.astro       #    Contact page
│       │   ├── cotizar.astro        #    Quote page
│       │   ├── carreras.astro       #    Careers page
│       │   ├── privacidad.astro     #    Privacy policy (from `pages` table)
│       │   ├── terminos.astro       #    Terms of service (from `pages` table)
│       │   ├── servicios/
│       │   │   ├── index.astro      #    Services hub
│       │   │   └── [slug].astro     #    Service detail
│       │   ├── soluciones/
│       │   │   ├── index.astro      #    Solutions hub
│       │   │   └── [slug].astro     #    Solution detail
│       │   ├── cobertura/
│       │   │   ├── index.astro      #    Coverage hub
│       │   │   └── [comuna].astro   #    Commune detail (52 pages)
│       │   ├── blog/
│       │   │   ├── index.astro      #    Blog index
│       │   │   └── [slug].astro     #    Blog post detail
│       │   ├── api/                 #    API routes
│       │   │   ├── admin/           #    Admin auth endpoints
│       │   │   └── webhooks/        #    External webhooks
│       │   ├── og/                  #    OG image generation
│       │   └── sitemap-images.xml.ts  # NEW: Image sitemap
│       │
│       ├── styles/                  #    Global styles
│       │   └── global.css
│       │
│       └── types/                   #    NEW: Shared TypeScript types
│           ├── convex.ts            #    Convex response types
│           ├── components.ts        #    Component prop types
│           └── seo.ts              #    SEO/Schema types
│
├── admin/                           # ← REFINE CMS (separate build)
│   ├── src/
│   │   ├── App.tsx                  #    Refine app root
│   │   ├── providers/
│   │   │   ├── convexDataProvider.ts  # Custom Convex data provider
│   │   │   └── authProvider.ts        # Auth provider
│   │   ├── resources/               #    CMS resource pages
│   │   │   ├── heroes/
│   │   │   │   ├── list.tsx
│   │   │   │   ├── create.tsx
│   │   │   │   └── edit.tsx
│   │   │   ├── services/
│   │   │   ├── solutions/
│   │   │   ├── faqs/
│   │   │   ├── blog-posts/
│   │   │   ├── locations/
│   │   │   ├── careers/
│   │   │   ├── pages/
│   │   │   ├── site-config/
│   │   │   └── ... (other resources)
│   │   ├── components/              #    Shared CMS components
│   │   │   ├── ImageUpload.tsx
│   │   │   ├── MarkdownEditor.tsx
│   │   │   ├── SeoPreview.tsx
│   │   │   ├── SlugField.tsx
│   │   │   └── IconSelector.tsx
│   │   └── layouts/
│   │       └── AdminLayout.tsx
│   └── package.json
│
├── convex_plan.md                   # ← This document
├── package.json
└── astro.config.mjs
```

### 32.3. Naming Conventions

| Item | Convention | Example |
|------|-----------|---------|
| **Components** | PascalCase | `ServicesGrid.astro`, `FeatureCard.astro` |
| **Pages** | kebab-case | `index.astro`, `nosotros.astro` |
| **Dynamic routes** | `[param].astro` | `[slug].astro`, `[comuna].astro` |
| **Utilities** | camelCase | `convex.ts`, `seo.ts` |
| **Types** | camelCase files, PascalCase exports | `types/convex.ts` → `ServiceDoc` |
| **i18n keys** | snake_case nested | `ui.nav.home`, `ui.forms.submit` |
| **CSS classes** | Tailwind utilities | `text-gray-900 tracking-tight` |
| **Convex tables** | snake_case | `blog_posts`, `site_config` |
| **Convex functions** | camelCase | `getAllServices`, `getBySlug` |
| **Image files** | kebab-case descriptive | `guardias-seguridad-santiago.webp` |

### 32.4. Import Aliases

```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@ui/*": ["src/components/ui/*"],
      "@sections/*": ["src/components/sections/*"],
      "@layouts/*": ["src/layouts/*"],
      "@lib/*": ["src/lib/*"],
      "@i18n/*": ["src/i18n/*"],
      "@types/*": ["src/types/*"],
      "@assets/*": ["src/assets/*"],
      "@convex/*": ["../convex/*"]
    }
  }
}
```

### 32.5. Barrel Exports for Clean Imports

```typescript
// src/components/ui/index.ts
export { default as Badge } from './Badge.astro';
export { default as Button } from './Button.astro';
export { default as Card } from './Card.astro';
export { default as Container } from './Container.astro';
export { default as Icon } from './Icon.astro';
export { default as Section } from './Section.astro';

// Usage in pages:
// import { Container, Section, Button } from '@ui';
```

### 32.6. Files to Delete

| File | Reason |
|------|--------|
| `src/data/site.ts` | All data migrated to Convex `site_config` |
| `src/config/` directory | Merge into `src/lib/` |
| `src/utils/seo.ts` | Move to `src/lib/seo.ts` |
| `src/pages/index.static.astro` | Legacy backup, no longer needed |
| `src/pages/sitemap.xml.ts.bak` | Backup file, restore or delete |
| `src/components/sections/*Ajax.astro` | 3 Ajax variants — merge into main components |
| `src/components/DynamicSection.astro` | Standalone file outside subdirectory |

### 32.7. Architecture Principles

| Principle | Rule | Reasoning |
|-----------|------|-----------|
| **Single source of truth** | All content from Convex, all UI chrome from `i18n/` | Zero hardcoded text |
| **Colocation** | Keep related files together (e.g., `resources/heroes/{list,create,edit}.tsx`) | Easier navigation |
| **Flat when possible** | Don't nest beyond 3 levels deep in `src/` | Simple mental model |
| **Barrel exports** | Every component subdirectory has `index.ts` | Clean import paths |
| **Alias everything** | Use `@components/`, `@lib/`, `@i18n/` prefixes | No relative path madness |
| **Separate builds** | `web/` (Astro SSR) and `admin/` (React SPA) are independent | Independent deployment |
| **Type safety** | Shared types in `src/types/`, Convex types auto-generated | Catch errors at compile time |
| **Progressive enhancement** | Astro ships 0 JS; only hydrate forms via `client:visible` | Maximum performance |

---

> **Document Version**: Draft 6 — February 19, 2026
> **Total Sections**: 32 chapters + 5 appendices
> **Total Tables Audited**: 22 existing + 4 proposed new (`careers`, `career_benefits`, `pages`, image fields on 5 tables)
> **Total Pages Projected**: ~370+ programmatic pages
> **New in Draft 6**: Zero Hardcoded Text audit with 200+ strings mapped (§28), Refine CMS Integration with full resource registry and data provider design (§29), Image SEO Treatment pipeline with WebP/AVIF/srcset blueprint (§30), Advanced Local SEO for Chile with GBP, Schema.org, Ley 21.659 compliance, and link building strategies (§31), File Tree Architecture Blueprint with naming conventions and import aliases (§32)

