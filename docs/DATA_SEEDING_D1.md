# Data Seeding - Cloudflare D1 Database

**Fecha:** 20 de Febrero, 2026  
**Base de datos:** guardman-db  
**Database ID:** d01daba0-dd6f-4cbd-9c88-f7af8703b37c  
**Región:** ENAM (Eastern North America)

---

## 1. Resumen

Se creó y pobló la base de datos D1 `guardman-db` en Cloudflare con el esquema completo para SEO programático basado en el documento `INVESTIGACION_Y_ESQUEMA_DB_V2.md`.

### Resultado Final

| Métrica | Valor |
|---------|-------|
| Tablas creadas | 38 |
| Comunas insertadas | 35 |
| Servicios | 5 |
| Soluciones | 5 |
| Industrias | 5 |
| Relaciones servicio-comuna | 9 |
| Relaciones servicio-solución | 20 |
| FAQs | 5 |
| Testimonios | 3 |
| Partners | 2 |
| Tamaño DB | 0.46 MB |

---

## 2. Proceso Ejecutado

### Paso 1: Creación de la Base de Datos

```bash
wrangler d1 create guardman-db
```

**Resultado:** ✅ Exitoso

```
✅ Successfully created DB 'guardman-db' in region ENAM
database_id = d01daba0-dd6f-4cbd-9c88-f7af8703b37c
```

---

### Paso 2: Creación del Esquema SQL

Se creó el archivo `schema-d1.sql` con adaptaciones para SQLite (D1 usa SQLite).

**Adaptaciones realizadas:**

| MySQL Original | SQLite/D1 Adaptado |
|----------------|-------------------|
| `AUTO_INCREMENT` | `AUTOINCREMENT` |
| `VARCHAR(n)` | `TEXT` |
| `INT` | `INTEGER` |
| `DECIMAL(m,n)` | `REAL` |
| `BOOLEAN` | `INTEGER` (0/1) |
| `TIMESTAMP` | `INTEGER` (Unix timestamp) |
| `ENUM('a','b')` | `TEXT` |
| `JSON` | `TEXT` |
| `ON UPDATE CURRENT_TIMESTAMP` | Eliminado (no soportado) |

**Ejecución:**

```bash
wrangler d1 execute guardman-db --remote --file=schema-d1.sql
```

**Resultado:** ✅ Exitoso

```
🚣 Executed 82 queries in 11.33ms
Rows written: 317
Database size: 0.46 MB
```

---

### Paso 3: Intento de Seed Data Inicial

Se creó `seed-d1.sql` con datos completos incluyendo servicios, soluciones, industrias, relaciones, FAQs, testimonios, etc.

```bash
wrangler d1 execute guardman-db --remote --file=seed-d1.sql
```

**Resultado:** ❌ Error

```
X ERROR: FOREIGN KEY constraint failed: SQLITE_CONSTRAINT
```

---

## 3. Problemas Encontrados y Soluciones

### Problema 1: Error de Foreign Key Constraint

**Error:**
```
FOREIGN KEY constraint failed: SQLITE_CONSTRAINT
```

**Causa:**
El archivo `seed-d1.sql` intentaba insertar registros en tablas con foreign keys (como `service_solutions`, `service_locations`) ANTES de que existieran los registros referenciados en las tablas padre (`services`, `solutions`, `communes`).

**Orden problemático en el archivo original:**
```sql
-- 1. INSERT INTO services...
-- 2. INSERT INTO solutions...
-- 3. INSERT INTO industries...
-- 4. INSERT INTO service_solutions...  ← Fallaba porque usaba IDs hardcodeados
-- 5. INSERT INTO service_locations...  ← Fallaba por la misma razón
```

**Solución aplicada:**

1. **Dividir el seed en múltiples archivos** para ejecutar en orden correcto:
   - `seed2-d1.sql` - Solo tablas padre (services, solutions, industries)
   - `seed3-d1.sql` - Relaciones y datos adicionales

2. **Verificar IDs antes de insertar relaciones:**

```bash
# Obtener IDs de servicios
wrangler d1 execute guardman-db --remote --command="SELECT id, slug FROM services;"

# Resultado:
# id=1, slug=alarmas
# id=2, slug=guardias
# id=3, slug=cctv
# id=4, slug=patrullaje
# id=5, slug=monitoreo
```

3. **Usar IDs correctos en las relaciones:**

```sql
-- En lugar de asumir IDs, usar los valores reales obtenidos
INSERT INTO service_solutions (service_id, solution_id) VALUES 
(1, 1),  -- alarmas → hogar
(1, 2),  -- alarmas → empresa
...
```

---

### Problema 2: Sintaxis SQL Incompatible

**Error:**
Algunas sentencias con caracteres especiales (ñ, tildes) causaban problemas de encoding.

**Solución:**
Simplificar el contenido eliminando acentos y caracteres especiales en los archivos SQL:
- `Ñuñoa` → `Nunoa`
- `Instalación` → `Instalacion`
- `Monitoreo` → `Monitoreo` (sin cambio)

---

## 4. Archivos Creados

| Archivo | Propósito | Estado |
|---------|-----------|--------|
| `schema-d1.sql` | Esquema completo de la BD | ✅ Ejecutado |
| `seed-d1.sql` | Seed inicial (falló) | ❌ Reemplazado |
| `seed2-d1.sql` | Tablas padre | ✅ Ejecutado |
| `seed3-d1.sql` | Relaciones y datos extra | ✅ Ejecutado |

---

## 5. Datos Insertados

### Servicios (5)

| ID | Slug | Título |
|----|------|--------|
| 1 | alarmas | Sistemas de Alarmas |
| 2 | guardias | Guardias de Seguridad |
| 3 | cctv | Camaras de Seguridad |
| 4 | patrullaje | Patrullaje |
| 5 | monitoreo | Monitoreo 24/7 |

### Soluciones (5)

| ID | Slug | Título |
|----|------|--------|
| 1 | hogar | Seguridad para Hogar |
| 2 | empresa | Seguridad Empresarial |
| 3 | industria | Seguridad Industrial |
| 4 | retail | Seguridad para Retail |
| 5 | condominio | Seguridad para Condominios |

### Industrias (5)

| ID | Slug | Nombre |
|----|------|--------|
| 1 | retail | Retail y Comercio |
| 2 | mineria | Mineria |
| 3 | logistica | Logistica |
| 4 | salud | Salud |
| 5 | educacion | Educacion |

### Comunas (35)

Todas las comunas del Gran Santiago, organizadas por zona:
- **Centro:** Santiago, Estación Central, Independencia, Recoleta, Conchalí, Huechuraba
- **Norte:** Quilicura, Colina, Lampa, Tiltil
- **Norponiente:** Vitacura, Las Condes, Providencia, Ñuñoa, San Joaquín, La Reina
- **Nororiente:** Lo Barnechea, La Dehesa
- **Sur:** San Miguel, La Cisterna, El Bosque, San Ramón, La Granja, Cerro Navia, Lo Prado, Maipú, Padre Hurtado, San Bernardo, Buin, Paine
- **Suroriente:** La Florida, Macul, Puente Alto, San José de Maipo, Pirque

### Relaciones Service-Locations (9)

| Servicio | Comuna | Precio |
|----------|--------|--------|
| Alarmas | Las Condes | $89.990 |
| Alarmas | Providencia | $89.990 |
| Alarmas | Maipú | $79.990 |
| Alarmas | La Florida | $79.990 |
| Alarmas | Santiago | $89.990 |
| Guardias | Las Condes | - |
| Guardias | Maipú | - |
| CCTV | Las Condes | $149.990 |
| CCTV | Providencia | $149.990 |

### Relaciones Service-Solutions (20)

| Servicio | Soluciones |
|----------|-----------|
| Alarmas | Hogar, Empresa, Industria, Retail, Condominio |
| Guardias | Empresa, Industria, Condominio |
| CCTV | Hogar, Empresa, Industria, Retail, Condominio |
| Patrullaje | Empresa, Condominio |
| Monitoreo | Hogar, Empresa, Industria, Retail, Condominio |

---

## 6. Comandos de Referencia

### Consultas Útiles

```bash
# Listar todas las tablas
wrangler d1 execute guardman-db --remote --command="SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;"

# Ver estructura de una tabla
wrangler d1 execute guardman-db --remote --command="PRAGMA table_info(services);"

# Ver relaciones servicio-comuna
wrangler d1 execute guardman-db --remote --command="SELECT s.title as servicio, c.name as comuna, sl.meta_title, sl.starting_price FROM service_locations sl JOIN services s ON sl.service_id = s.id JOIN communes c ON sl.commune_id = c.id ORDER BY s.title, c.name;"

# Ver relaciones servicio-solución
wrangler d1 execute guardman-db --remote --command="SELECT s.title as servicio, sol.title as solucion FROM service_solutions ss JOIN services s ON ss.service_id = s.id JOIN solutions sol ON ss.solution_id = sol.id ORDER BY s.title, sol.title;"

# Contar registros por tabla
wrangler d1 execute guardman-db --remote --command="SELECT 'services' as tabla, COUNT(*) as total FROM services UNION ALL SELECT 'communes', COUNT(*) FROM communes UNION ALL SELECT 'service_locations', COUNT(*) FROM service_locations;"
```

### Gestión de Base de Datos

```bash
# Info de la base de datos
wrangler d1 info guardman-db

# Crear backup (export)
wrangler d1 export guardman-db --remote --output=backup.sql

# Ejecutar archivo SQL
wrangler d1 execute guardman-db --remote --file=archivo.sql

# Ejecutar comando individual
wrangler d1 execute guardman-db --remote --command="SELECT * FROM services;"
```

---

## 7. Configuración para Workers

Para usar la base de datos en un Worker, agregar al `wrangler.toml`:

```toml
[[d1_databases]]
binding = "guardman_db"
database_name = "guardman-db"
database_id = "d01daba0-dd6f-4cbd-9c88-f7af8703b37c"
```

### Ejemplo de uso en Worker:

```javascript
export default {
  async fetch(request, env) {
    const { results } = await env.guardman_db.prepare(
      "SELECT * FROM services WHERE is_active = 1"
    ).all();
    
    return Response.json(results);
  }
};
```

---

## 8. Próximos Pasos

1. **Generar páginas SEO automáticamente:**
   ```sql
   INSERT INTO generated_pages (page_type, service_id, commune_id, slug, full_url, title, h1, meta_title)
   SELECT 
       'service_location',
       s.id,
       c.id,
       s.slug || '/' || c.slug,
       '/' || s.slug || '/' || c.slug,
       s.title || ' en ' || c.name,
       s.title || ' en ' || c.name,
       s.title || ' en ' || c.name || ' | Guardman Chile'
   FROM services s
   CROSS JOIN communes c
   WHERE s.is_active = 1 AND c.is_active = 1;
   ```

2. **Crear Worker API** para exponer los datos al frontend

3. **Implementar generación automática de contenido** basada en templates

---

## 9. Lecciones Aprendidas

1. **Siempre verificar IDs antes de insertar relaciones** - No asumir que los IDs serán 1, 2, 3...
2. **Dividir seeds grandes en archivos pequeños** - Más fácil de debuggear
3. **SQLite no soporta todas las features de MySQL** - Adaptar tipos de datos y sintaxis
4. **Usar --remote flag** - Para operaciones en la base de datos de producción
5. **Los timestamps en SQLite son Unix epoch** - Usar `strftime('%s', 'now')`

---

**Documento creado por:** OpenCode AI Assistant  
**Última actualización:** 20 de Febrero, 2026
