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

> **Document Version**: Draft 3 (Final) — February 19, 2026
> **Total Sections**: 19 chapters + 5 appendices
> **Total Tables Audited**: 22 (+ 4 proposed new)
> **Total Pages Projected**: ~395 (from current ~83)
> **Key Recommendations**: Programmatic SEO (312 service×commune pages), AggregateRating schema, data source unification, CRUD completion for pages/content_blocks
