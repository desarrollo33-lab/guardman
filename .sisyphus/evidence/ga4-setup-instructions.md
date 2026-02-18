# Configuración de Google Analytics 4 (GA4) - Guardman.cl

## Resumen

Este documento detalla cómo configurar Google Analytics 4 para el sitio guardman.cl, incluyendo la creación de la propiedad, obtención del Measurement ID, implementación del código y verificación.

> **Nota:** El sitio ya tiene **Vercel Web Analytics** habilitado (ver `astro.config.mjs` línea 12). GA4 se configura como analytics adicional/complementario.

---

## Paso 1: Crear Propiedad GA4

1. Ve a [Google Analytics](https://analytics.google.com/)
2. Inicia sesión con tu cuenta de Google
3. Click en **Admin** (icono de engranaje, esquina inferior izquierda)
4. En la columna **Cuentas**, click en **Crear cuenta** (si no tienes una) o selecciona una existente
5. En la columna **Propiedades**, click en **Crear propiedad**
6. Completa los datos:
   - **Nombre de propiedad:** `Guardman Chile`
   - **Zona horaria:** `Chile (GMT-4)`
   - **Moneda:** `Peso chileno (CLP)`
7. Click en **Siguiente**
8. Selecciona la categoría del negocio: `Servicios empresariales`
9. Click en **Crear**

---

## Paso 2: Configurar Flujo de Datos Web

1. En la pantalla de configuración, selecciona **Web**
2. Completa:
   - **URL del sitio web:** `https://guardman.cl`
   - **Nombre del flujo:** `guardman.cl - Web`
   - **Medición mejorada:** Activa (recomendado para pageviews automáticos)
3. Click en **Crear flujo**

---

## Paso 3: Obtener el Measurement ID

1. En la pantalla del flujo de datos creado, encontrarás:
   - **ID de medición (Measurement ID):** Formato `G-XXXXXXXXXX`
2. Copia este ID (lo necesitarás en el siguiente paso)

> **Ejemplo:** `G-ABC123DEF4`

---

## Paso 4: Agregar Código GA4 al Sitio

### Ubicación del archivo

```
src/layouts/BaseLayout.astro
```

### Código a agregar

Agrega el siguiente código dentro del `<head>` (después de la línea 88, antes de `</head>`):

```astro
<!-- Google Analytics 4 -->
<script is:inline src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
></script>
<script is:inline>
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

> **IMPORTANTE:** Reemplaza `G-XXXXXXXXXX` con tu Measurement ID real.

### Código completo del head con GA4

```astro
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{fullTitle}</title>
  <meta name="description" content={description} />

  {noindex && <meta name="robots" content="noindex, nofollow" />}

  <!-- Canonical -->
  <link rel="canonical" href={canonical} />

  <!-- Hreflang -->
  <link rel="alternate" hreflang="es-CL" href={canonical} />
  <link rel="alternate" hreflang="x-default" href={canonical} />

  <!-- Favicon -->
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

  <!-- Open Graph -->
  <meta property="og:type" content="website" />
  <meta property="og:title" content={fullTitle} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={new URL(ogImage, Astro.site).href} />
  <meta property="og:url" content={canonical} />
  <meta property="og:site_name" content={siteName} />
  <meta property="og:locale" content="es_CL" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={fullTitle} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={new URL(ogImage, Astro.site).href} />
  <meta name="twitter:site" content="@GuardmanChile" />

  <!-- Google Fonts: Inter -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
    rel="stylesheet"
  />

  <!-- Google Analytics 4 -->
  <script
    is:inline
    src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
  <script is:inline>
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      dataLayer.push(arguments);
    }
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX');
  </script>

  <!-- Schema.org JSON-LD -->
  <script type="application/ld+json" set:html={JSON.stringify(websiteSchema)} />
  {
    schema && (
      <script type="application/ld+json" set:html={JSON.stringify(schema)} />
    )
  }
</head>
```

### Nota sobre `is:inline`

El atributo `is:inline` es importante en Astro porque:

- Evita que Astro procese/bundlee el script
- Mantiene el script en el HTML tal como está escrito
- Necesario para scripts externos como gtag.js

---

## Paso 5: Verificar la Implementación

### Método 1: Google Tag Assistant

1. Instala [Google Tag Assistant](https://tagassistant.google.com/)
2. Abre el sitio: `https://guardman.cl`
3. Tag Assistant mostrará si el tag GA4 está detectando correctamente

### Método 2: Real-Time Report (Recomendado)

1. Ve a [Google Analytics](https://analytics.google.com/)
2. Selecciona la propiedad `Guardman Chile`
3. En el menú izquierdo: **Informes > Tiempo real**
4. Abre el sitio en otra pestaña: `https://guardman.cl`
5. Deberías ver **1 usuario en tiempo real** dentro de 30 segundos

### Método 3: DevTools (Network)

1. Abre `https://guardman.cl` en Chrome
2. Abre DevTools (F12)
3. Ve a la pestaña **Network**
4. Filtra por: `google`
5. Deberías ver requests a:
   - `gtag/js` (carga del script)
   - `g/collect` (envío de pageview)

---

## Opción Alternativa: Variable de Entorno

Para mayor seguridad y flexibilidad, puedes usar una variable de entorno:

### 1. Crear variable de entorno

En `.env`:

```env
PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 2. Modificar BaseLayout.astro

```astro
---
const gaMeasurementId = import.meta.env.PUBLIC_GA_MEASUREMENT_ID;
---

<!-- ... resto del head ... -->{
  gaMeasurementId && (
    <>
      <script
        is:inline
        src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
      />
      <script
        is:inline
        set:html={`
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${gaMeasurementId}');
    `}
      />
    </>
  )
}
```

### 3. Configurar en Vercel

En el dashboard de Vercel:

1. Ve a tu proyecto
2. **Settings > Environment Variables**
3. Agrega: `PUBLIC_GA_MEASUREMENT_ID` = `G-XXXXXXXXXX`

---

## Checklist de Verificación

- [ ] Propiedad GA4 creada en Google Analytics
- [ ] Flujo de datos web configurado con URL `https://guardman.cl`
- [ ] Measurement ID copiado (formato `G-XXXXXXXXXX`)
- [ ] Código gtag agregado a `src/layouts/BaseLayout.astro`
- [ ] Measurement ID reemplazado en el código
- [ ] Cambios desplegados en producción
- [ ] Real-Time Report muestra actividad al visitar el sitio

---

## Comparativa: Vercel Analytics vs GA4

| Característica       | Vercel Analytics | GA4             |
| -------------------- | ---------------- | --------------- |
| Configuración        | Ya habilitado    | Requiere código |
| Pageviews            | Automático       | Automático      |
| Tiempo real          | Sí               | Sí              |
| Audiencia/Demografía | No               | Sí              |
| Funnel de conversión | No               | Sí              |
| Exportar datos       | No               | Sí (BigQuery)   |
| Costo                | Gratis (Vercel)  | Gratis          |

**Recomendación:** Mantener ambos. Vercel Analytics para métricas básicas de rendimiento, GA4 para análisis profundo de audiencia.

---

## Soporte

- [Documentación oficial GA4](https://support.google.com/analytics/answer/10089681)
- [Guía de gtag.js](https://developers.google.com/analytics/devguides/collection/gtagjs)
- [Astro - Client-side Scripts](https://docs.astro.build/en/guides/client-side-scripts/)

---

_Creado: 2026-02-18_
_Sitio: guardman.cl_
