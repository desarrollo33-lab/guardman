# 📋 Audit Remediation - Pendiente / Todo

## Progreso: 36/51 tareas completadas (71%)

---

## ✅ Completado

### Wave 1: Critical Blockers (7/7)
- [x] Fix leads.ts argument mismatch (leadId → id)
- [x] Add solutions:getSolutionById query
- [x] Add pages CRUD mutations
- [x] Add content_blocks CRUD mutations
- [x] Fix data provider to use correct argument names
- [x] Fix web/src function name (services:getAll → getAllServices)
- [x] Upgrade convex packages to ^1.32.0

### Wave 2: Schema Completion (6/6)
- [x] Add redirects table to schema
- [x] Add seo_metadata table to schema
- [x] Add communes fields (order, is_published, lat, lng, population)
- [x] Add blog_posts seo_title/seo_description fields
- [x] Replace v.any() in content_blocks.data with typed schema
- [x] Run schema migration in Convex

### Wave 3: Admin CMS (8/8)
- [x] Install missing admin packages (antd, @dnd-kit, slugify)
- [x] Create SlugField component for admin
- [x] Create ImageUpload component for admin
- [x] Create MarkdownField component for admin
- [x] Create SeoPreview component for admin
- [x] Implement all resource list pages in admin
- [x] Implement all resource create/edit pages in admin
- [x] Test all admin CRUD operations end-to-end

### Wave 4: Frontend Foundation (11/11)
- [x] Create BaseLayout.astro component
- [x] Create Header.astro component
- [x] Create Footer.astro component
- [x] Create SEO.astro component
- [x] Create servicios/[slug].astro dynamic page
- [x] Create soluciones/[slug].astro detail page
- [x] Create blog/[slug].astro detail page
- [x] Create cobertura/[slug].astro commune page
- [x] Replace static sitemap with dynamic sitemap.xml.ts
- [x] Test all frontend pages render correctly

### Wave 5: SEO & Advanced (5/5)
- [x] Implement LocalBusinessSchema.astro
- [x] Implement BreadcrumbSchema.astro
- [x] Create cookie consent banner (Ley 21.719)
- [x] Add image sitemap
- [x] Final integration testing

---

## ⏳ Pendiente / Remaining Tasks

### 1. Task 26: Implementar Design System
- [ ] Colors, typography, spacing
- [ ] Componentes UI consistentes

### 2. Task 36: Fix service_locations seed (312 pages)
- [ ] Seed de service_locations para 312 paginas SEO
- [ ] Relacion servicio-comuna para cada combinacion

### 3. Acceptance Criteria (many already done, need checkbox updates)
- [ ] npm run build exits 0 for web and admin
- [ ] npm run typecheck passes for all packages
- [ ] Admin CMS Services list loads data from Convex
- [ ] All 17+ admin resources have working CRUD
- [ ] Frontend pages render at /servicios/[slug], /soluciones/[slug], /blog/[slug]

---

## 🔧 Notas Tecnicas

### Build Status
- Web build: ✅ PASS (21.81s)
- Admin build: ✅ PASS (11.46s)

### Issues Conocidos / Known Issues
1. **Frontend SSR**: Paginas dinamicas pueden fallar con Convex imports en dev mode - necesario verificar en produccion
2. **Service Locations**: No hay seed data para las 312 paginas de servicio-comuna

---

## 🚀 Siguientes Pasos

1. **Deploy**: Push hecho a `feature/admin-vite-migration`
2. **Verificar**: Que Vercel haga deploy correctamente
3. **Service Locations**: Crear seed para 312 paginas
4. **Testing**: Verificar CRUD completo en admin

---

*Documento creado: 2026-02-20*
*Session: ses_3879752f2ffepHQYbDoubPAhgO*
