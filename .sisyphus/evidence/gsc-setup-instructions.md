# Guía de Configuración Google Search Console - guardman.cl

**Dominio:** guardman.cl  
**Sitemap:** https://guardman.cl/sitemap-index.xml  
**Hosting:** Vercel  
**Fecha de referencia:** 18 de febrero, 2026

---

## 1. Crear Propiedad en Google Search Console

### Paso 1.1: Acceder a Google Search Console

1. Ve a [Google Search Console](https://search.google.com/search-console)
2. Inicia sesión con tu cuenta de Google (preferiblemente la misma asociada al dominio)

### Paso 1.2: Agregar propiedad

1. Haz clic en el dropdown del selector de propiedades (esquina superior izquierda)
2. Selecciona **"+ Agregar propiedad"**

### Paso 1.3: Elegir tipo de propiedad

Tienes dos opciones:

| Tipo                                     | Ventajas                                       | Recomendado |
| ---------------------------------------- | ---------------------------------------------- | ----------- |
| **Dominio** (guardman.cl)                | Verifica todos los subdominios automáticamente | ✅ Sí       |
| **Prefijo de URL** (https://guardman.cl) | Solo verifica esa URL específica               | No          |

**Recomendación:** Selecciona **"Dominio"** para incluir www y no-www.

---

## 2. Verificación DNS (Método Recomendado)

### Paso 2.1: Copiar el registro TXT

Google te mostrará un registro TXT similar a:

```
google-site-verification=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

> 📸 **Screenshot placeholder:** Panel de verificación DNS de GSC

### Paso 2.2: Agregar registro TXT en Vercel

1. Ve al [Dashboard de Vercel](https://vercel.com/dashboard)
2. Selecciona tu proyecto **guardman**
3. Navega a **Settings** → **Domains**
4. Busca el dominio `guardman.cl`
5. Haz clic en **"Edit"** o busca la sección de DNS records
6. Agrega un nuevo registro:

| Campo     | Valor                                                               |
| --------- | ------------------------------------------------------------------- |
| **Type**  | `TXT`                                                               |
| **Name**  | `@` (o dejar vacío)                                                 |
| **Value** | `google-site-verification=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX` |
| **TTL**   | 3600 (o default)                                                    |

### Paso 2.3: Alternativa via Vercel CLI

```bash
# Si tienes acceso CLI, puedes verificar con:
vercel domains inspect guardman.cl
```

### Paso 2.4: Esperar propagación DNS

- Tiempo típico: **5 minutos a 48 horas**
- Puedes verificar propagación con:

```bash
nslookup -type=TXT guardman.cl
```

### Paso 2.5: Completar verificación en GSC

1. Regresa a Google Search Console
2. Haz clic en **"Verificar"**
3. Si es exitoso, verás: ✅ "Propiedad verificada"

---

## 3. Agregar Sitemap

### Paso 3.1: Navegar a Sitemaps

1. En GSC, selecciona tu propiedad `guardman.cl`
2. En el menú izquierdo, ve a **"Sitemaps"** (bajo "Indexación")

### Paso 3.2: Agregar el sitemap

1. En el campo **"Agregar un nuevo sitemap"**, ingresa:

   ```
   sitemap-index.xml
   ```

   > ⚠️ **NO** incluir el dominio completo. Solo la ruta relativa al sitemap.

2. Haz clic en **"Enviar"**

### Paso 3.3: Verificar estado

Después de enviar:

- **Estado inicial:** "Pendiente" o "No se pudo obtener"
- **Después de unos minutos:** Google intentará procesarlo
- **Estado exitoso:** "Éxito" con el número de URLs descubiertas

> 📸 **Screenshot placeholder:** Panel de sitemaps mostrando estado exitoso

### Confirmar que robots.txt está correcto

Tu robots.txt ya debería incluir:

```
Sitemap: https://guardman.cl/sitemap-index.xml
```

Verificar en: https://guardman.cl/robots.txt

---

## 4. Configurar Dominio Preferido

### Paso 4.1: Acceder a configuración

1. En GSC, ve a **Configuración** (icono de engranaje ⚙️)
2. Busca la sección **"Dominio preferido"**

### Paso 4.2: Seleccionar preferencia

Elige una de las opciones:

- `https://guardman.cl` (sin www) ← **Recomendado**
- `https://www.guardman.cl` (con www)

> 💡 **Nota:** Si creaste la propiedad como "Dominio", esta opción puede no estar disponible ya que GSC ya considera ambas variantes.

---

## 5. Checklist Post-Configuración (24-48 horas)

### Verificar en Google Search Console:

| Item                    | Dónde verificar            | Estado |
| ----------------------- | -------------------------- | ------ |
| ✅ Propiedad verificada | Banner superior de GSC     |        |
| ✅ Sitemap procesado    | Sitemaps → Estado: "Éxito" |        |
| ✅ URLs indexadas       | Índice de Google → Páginas |        |
| ✅ Sin errores críticos | Cobertura → Errores        |        |
| ✅ Core Web Vitals      | Experiencia de página      |        |
| ✅ Dispositivo móvil    | Usabilidad móvil           |        |

### Verificar indexación manual:

```bash
# Buscar en Google:
site:guardman.cl
```

### URLs a verificar en "Inspección de URLs":

1. `https://guardman.cl/` (homepage)
2. `https://guardman.cl/servicios`
3. Otras páginas importantes

Para cada URL:

1. Inspeccionar URL → Verificar que esté indexada
2. Si no está indexada → "Solicitar indexación"

---

## 6. Monitoreo Continuo

### Revisar semanalmente:

- **Rendimiento:** Clics, impresiones, CTR, posición media
- **Cobertura:** Nuevas páginas indexadas, errores
- **Mejoras:** Sugerencias de Core Web Vitals
- **Security Issues:** Problemas de seguridad o malware

### Alertas recomendadas:

- Configurar alertas por email en GSC
- Revisar mensajes de Google regularmente

---

## 7. Troubleshooting Común

### "No se pudo verificar"

- Esperar más tiempo (propagación DNS)
- Verificar que el registro TXT esté correcto
- Intentar con método alternativo (archivo HTML)

### "Sitemap no procesado"

- Verificar que la URL del sitemap sea accesible
- Confirmar formato XML válido
- Revisar robots.txt no bloquee el sitemap

### "URLs no indexadas"

- Verificar que las páginas sean accesibles (200 OK)
- Revisar meta robots no tengan `noindex`
- Confirmar que no estén bloqueadas en robots.txt

---

## Referencias

- [Google Search Console Help](https://support.google.com/webmasters/)
- [Verificar propiedad del sitio](https://support.google.com/webmasters/answer/9008080)
- [Sitemaps - Best Practices](https://developers.google.com/search/docs/advanced/sitemaps/overview)

---

_Documento generado para guardman.cl - Configuración SEO_
