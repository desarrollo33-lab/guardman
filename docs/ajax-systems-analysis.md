# Análisis Completo de Ajax Systems

## Diseño Web, UX/UI y Estrategia Digital para Guardman Chile

**Fecha:** 18 de Febrero, 2026  
**Autor:** Análisis automatizado con Atlas Orchestrator  
**URL Analizada:** https://ajax.systems

---

# PARTE 1: RESULTADOS DE LA INVESTIGACIÓN

## 1. ANÁLISIS DE COLORES Y BACKGROUNDS

### 1.1 Paleta de Colores Principal

| Color          | Código RGB           | Código HEX | Uso Principal                                 |
| -------------- | -------------------- | ---------- | --------------------------------------------- |
| Negro Profundo | `rgb(24, 24, 24)`    | `#181818`  | Secciones hero, headers, CTAs principales     |
| Blanco Puro    | `rgb(255, 255, 255)` | `#FFFFFF`  | Fondo base, tarjetas, contenido principal     |
| Gris Claro     | `rgb(237, 237, 237)` | `#EDEDED`  | Secciones alternas, separadores, hover states |
| Blanco Humo    | `rgb(247, 247, 247)` | `#F7F7F7`  | Texto sobre fondos oscuros                    |

### 1.2 Patrón de Alternancia de Secciones

**Regla de Oro:** Alternancia sistemática entre secciones claras y oscuras.

```
┌─────────────────────────────────────────────┐
│ HERO SECTION (Negro #181818)                │ ← Impacto visual máximo
├─────────────────────────────────────────────┤
│ Categorías de Productos (Blanco #FFFFFF)    │ ← Legibilidad óptima
├─────────────────────────────────────────────┤
│ "Explore Us" Tabs (Negro #181818)           │ ← Enfoque en contenido visual
├─────────────────────────────────────────────┤
│ Solution Overview (Blanco #FFFFFF)          │ ← Facilita escaneo
├─────────────────────────────────────────────┤
│ CTA Dual Section (Gris #EDEDED)             │ ← Transición suave
└─────────────────────────────────────────────┘
```

### 1.3 Psicología del Color Aplicada

| Tipo de Sección           | Fondo                  | Razón                                                        |
| ------------------------- | ---------------------- | ------------------------------------------------------------ |
| **Hero / Headlines**      | Negro                  | Autoridad, sofisticación, enfoque absoluto en el mensaje     |
| **Productos / Catálogos** | Blanco                 | Claridad, espacio mental, permite que las imágenes destaquen |
| **CTAs / Acciones**       | Negro con texto blanco | Urgencia, contraste máximo, llamado a la acción              |
| **Transiciones**          | Gris claro             | Respiración visual, preparación para cambio de contexto      |

### 1.4 Gradientes y Efectos

- **Sin gradientes:** Uso de colores sólidos puros
- **Sombras:** Mínimas, solo para elevación sutil de cards
- **Overlays:** Solo en imágenes hero con gradiente lineal negro-transparente

---

## 2. ANÁLISIS DE IMÁGENES

### 2.1 Tipos de Imágenes Identificadas

| Tipo                           | Uso                          | Formato                   | Cantidad Típica  |
| ------------------------------ | ---------------------------- | ------------------------- | ---------------- |
| **Producto Aislado**           | Cards de producto, catálogos | PNG/WebP con fondo blanco | 1 por producto   |
| **Lifestyle**                  | Hero sections, testimonios   | JPEG/WebP                 | 1-2 por sección  |
| **Iconografía**                | Features, beneficios         | SVG                       | 3-8 por sección  |
| **Fotografías de Instalación** | Customer stories             | JPEG                      | 1 por caso       |
| **Premios/Certificaciones**    | Sección de confianza         | PNG/SVG                   | 5-20 en carousel |

### 2.2 Distribución de Imágenes por Tipo de Sección

#### Homepage - Sección por Sección

| Sección                 | Imágenes           | Videos | Propósito         |
| ----------------------- | ------------------ | ------ | ----------------- |
| Hero                    | 1 (background)     | 0      | Impacto inicial   |
| Categorías de Productos | 4 grandes          | 0      | Navegación visual |
| "Explore Us" Tabs       | 4 por tab          | 0      | Engagement        |
| Solution Overview       | 4 cards            | 0      | Conversión        |
| Footer                  | 15+ (logos, icons) | 0      | Navegación        |

#### Página de Categoría de Producto

| Sección               | Imágenes              | Propósito       |
| --------------------- | --------------------- | --------------- |
| Hero de Categoría     | 1 grande              | Contexto visual |
| Product Lines         | 2 (Superior/Baseline) | Diferenciación  |
| Accreditations Banner | 1 ilustración         | Confianza       |

#### Página de Producto Individual

| Sección                | Imágenes           | Propósito                |
| ---------------------- | ------------------ | ------------------------ |
| Galería Principal      | 3-6 imágenes       | Exploración del producto |
| Features Icons         | 5-10 SVG           | Beneficios rápidos       |
| Especificaciones       | Diagramas técnicos | Información detallada    |
| Productos Relacionados | 3-4 cards          | Cross-selling            |

### 2.3 Tratamiento Visual de Imágenes

```
┌────────────────────────────────────────────────────────────┐
│ CARACTERÍSTICAS DE IMÁGENES AJAX                           │
├────────────────────────────────────────────────────────────┤
│ • Alta resolución (2x para retina)                         │
│ • Fondo blanco o transparente para productos               │
│ • Iluminación profesional tipo estudio                     │
│ • Ángulos múltiples (frontal, lateral, detalle)            │
│ • Sin bordes ni marcos                                     │
│ • Tamaño consistente dentro de cada sección                │
└────────────────────────────────────────────────────────────┘
```

### 2.4 Uso de Color en Imágenes

**Principio Clave:** En un sitio monocromático, las imágenes son la ÚNICA fuente de color.

| Elemento       | Estrategia de Color                                          |
| -------------- | ------------------------------------------------------------ |
| Productos      | Colores naturales del dispositivo (blanco, negro, metálicos) |
| Lifestyle      | Tonos cálidos para interiores, neutros para exteriores       |
| UI Screenshots | Colores de la app (naranja/rojo como acento de marca)        |
| People         | Diversidad étnica, vestimenta profesional                    |

---

## 3. ANÁLISIS DE VIDEOS

### 3.1 Presencia de Video en el Sitio

**Hallazgo Principal:** El sitio de Ajax Systems NO usa videos de forma prominente en las páginas principales analizadas.

**Videos Identificados:**
| Ubicación | Tipo | Autoplay | Propósito |
|-----------|------|----------|-----------|
| Blog/YouTube embeds | Externos | No | Tutoriales, demos |
| Eventos especiales | YouTube | No | Lanzamientos de producto |

### 3.2 Estrategia de Video Alternativa

En lugar de video embebido, Ajax usa:

1. **Carruseles de imágenes** con transiciones suaves
2. **GIFs animados** para demostraciones cortas
3. **Screenshots de app** que muestran funcionalidad
4. **Links a YouTube** para contenido extenso

### 3.3 Recomendación de Video para Guardman

| Tipo de Contenido       | Formato Recomendado | Ubicación           |
| ----------------------- | ------------------- | ------------------- |
| Demo de GuardPod        | Video corto (30s)   | Hero, producto      |
| Testimonios de clientes | Video (1-2 min)     | Sección testimonios |
| Proceso de contratación | Animación           | FAQ, cotizar        |
| Cobertura geográfica    | Mapa animado        | Cobertura           |

---

## 4. ESTRUCTURA DE PRODUCTOS Y SERVICIOS

### 4.1 Arquitectura de Información

```
PRODUCTOS (Jerarquía 3 niveles)
├── Intrusion Protection
│   ├── Superior Line
│   │   └── [Productos individuales]
│   └── Baseline Line
│       └── [Productos individuales]
├── Video Surveillance
│   ├── Superior Line
│   └── Baseline Line
├── Fire and Life Safety
│   ├── EN54 Line (comercial)
│   └── Residence Line (residencial)
└── Comfort and Automation
    └── [Productos individuales]

SERVICIOS
├── Software
│   ├── Ajax Security System (app móvil)
│   ├── Ajax PRO (profesionales)
│   ├── Ajax Desktop
│   └── Ajax Cloud Signaling
├── Monitoring
│   ├── Intrusion alarm monitoring
│   ├── Video monitoring
│   └── Audio alarm verification
└── Tools
    ├── Calculators (battery, range, storage)
    ├── Configurators
    └── Compatibility checkers
```

### 4.2 Estructura de Cards de Producto

```html
<!-- Card de Producto Típica -->
<article class="product-card">
  <figure>
    <img src="product.jpg" alt="Product Name" />
  </figure>
  <div class="content">
    <h3>Product Name</h3>
    <p>Short description (1-2 líneas)</p>
    <a href="/products/xxx">
      Learn more
      <svg><!-- Arrow icon --></svg>
    </a>
  </div>
</article>
```

### 4.3 Información Mostrada en Cards

| Elemento              | Presencia | Nota                    |
| --------------------- | --------- | ----------------------- |
| Imagen principal      | ✓         | 100% de cards           |
| Nombre del producto   | ✓         | H2/H3 heading           |
| Descripción corta     | ✓         | 10-20 palabras          |
| Precio                | ✗         | No visible en cards     |
| Rating/Reviews        | ✗         | No en cards principales |
| Badge (Nuevo/Popular) | ✓         | En productos destacados |
| CTA                   | ✓         | "Learn more" con flecha |

### 4.4 Estructura de Página de Producto Individual

```
┌─────────────────────────────────────────────────────────────┐
│ PRODUCTO DETALLE                                            │
├─────────────────────────────────────────────────────────────┤
│ SECCIÓN 1: Hero del Producto                                │
│   - Galería de imágenes (carrusel)                          │
│   - Nombre del producto (H1)                                │
│   - Descripción principal                                   │
│   - CTA principal: "Where to buy" / "Contact sales"         │
├─────────────────────────────────────────────────────────────┤
│ SECCIÓN 2: Características Principales                      │
│   - Grid de features con iconos                             │
│   - 3-6 características destacadas                          │
│   - Fondo: Blanco                                           │
├─────────────────────────────────────────────────────────────┤
│ SECCIÓN 3: Especificaciones Técnicas                        │
│   - Tabla de especificaciones                               │
│   - Acordeón para detalles                                  │
│   - Fondo: Negro                                            │
├─────────────────────────────────────────────────────────────┤
│ SECCIÓN 4: Documentación y Recursos                         │
│   - Manuales de usuario                                     │
│   - Certificados                                            │
│   - Ficha técnica descargable                               │
├─────────────────────────────────────────────────────────────┤
│ SECCIÓN 5: Productos Relacionados                           │
│   - Carrusel de 4-6 productos                               │
│   - Cards pequeñas                                          │
└─────────────────────────────────────────────────────────────┘
```

### 4.5 Diferenciación de Líneas de Producto

| Aspecto         | Superior Line           | Baseline Line     |
| --------------- | ----------------------- | ----------------- |
| Audiencia       | Profesionales, empresas | Residencial, PYME |
| Acceso          | Partners acreditados    | Público general   |
| Certificaciones | EN54, Grade 3           | Estándar          |
| Precio          | Premium                 | Accesible         |
| Visual          | Badge dorado            | Sin badge         |

---

## 5. ESTRUCTURA SEO

### 5.1 Meta Tags Analizados

```html
<!-- Meta tags típicos de Ajax Systems -->
<title>About Ajax Systems | About us</title>
<meta name="title" content="About Ajax Systems | About us" />
<meta
  name="description"
  content="Ajax Systems is a tech company. We create solutions that stand on the cutting edge of technology and science — then we put those innovations into our devices"
/>
<meta name="theme-color" content="#000000" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:site" content="@ajax_systems" />
<meta name="twitter:creator" content="@ajax_systems" />
<meta name="p:domain_verify" content="c93d58963140c39764ea0ee7460ab87f" />
```

### 5.2 Estructura de Headings

```
Homepage:
├── H1: "Rule your space" (1 solo H1)
│   ├── H2: "Explore us"
│   ├── H2: "Solution overview"
│   ├── H2: "Purchase Ajax devices"
│   └── H2: "Start a new story"
│       ├── H3: [Cards de solución]
│       └── H3: [Cards de producto]

Página About:
├── H1: "We stand against evil" (1 solo H1)
│   ├── H2: "About Ajax Systems"
│   ├── H2: "Awards list"
│   ├── H2: "Company origins"
│   ├── H2: "Pushing standards"
│   ├── H2: "Driven performers"
│   ├── H2: "Values"
│   │   └── H5: [Valores individuales]
│   └── H2: "Ajax product categories"

Página Why Ajax:
├── H1: "Forget about the security systems of the past"
│   ├── H2: "Functionality"
│   │   └── H3: [Preguntas individuales]
│   ├── H2: "Notifications"
│   ├── H2: "Preventing sabotage"
│   ├── H2: "Confidentiality"
│   ├── H2: "Ecology and Health"
│   └── H2: "Services"
```

### 5.3 Estrategia de Internal Linking

| Tipo de Link         | Cantidad (Homepage) | Propósito                   |
| -------------------- | ------------------- | --------------------------- |
| Navegación principal | 7                   | Estructura del sitio        |
| Footer links         | 50+                 | SEO + navegación secundaria |
| Cards de producto    | 4-6                 | Conversión                  |
| Cards de solución    | 4-6                 | Engagement                  |
| Links en texto       | 3-5 por página      | Profundización              |

### 5.4 Schema Markup Utilizado

```json
// Organization Schema
{
  "@type": "Organization",
  "name": "Ajax Systems",
  "url": "https://ajax.systems",
  "logo": "https://ajax.systems/logo.png"
}

// Article Schema (para blog)
{
  "@type": "Article",
  "headline": "...",
  "author": "Ajax Systems"
}
```

### 5.5 URL Structure

| Tipo         | Patrón                        | Ejemplo                                   |
| ------------ | ----------------------------- | ----------------------------------------- |
| Homepage     | `/`                           | ajax.systems                              |
| Productos    | `/products/{slug}/`           | /products/hub/                            |
| Categorías   | `/product-categories/{slug}/` | /product-categories/intrusion-protection/ |
| Catálogos    | `/catalogue/{slug}/`          | /catalogue/superior-intrusion-protection/ |
| Soluciones   | `/solutions/{slug}/`          | /solutions/wireless-grade-3/              |
| Blog         | `/blog/{slug}/`               | /blog/ajax-tv/                            |
| Herramientas | `/tools/{slug}/`              | /tools/battery-life-calculator/           |

---

## 6. ANÁLISIS DE COPYWRITING

### 6.1 Tono de Voz

| Característica   | Valor                  | Ejemplo                                     |
| ---------------- | ---------------------- | ------------------------------------------- |
| **Formalidad**   | Semi-formal            | "We stand against evil"                     |
| **Técnica**      | Accesible pero precisa | Explica tecnología sin jerga                |
| **Personalidad** | Confiado, innovador    | "Forget about security systems of the past" |
| **Orientación**  | Usuario-centrista      | Preguntas frecuentes como H3                |

### 6.2 Estructura de Copy por Sección

#### Hero Section

```
H1: [Propuesta de valor principal, 3-5 palabras]
P: [Explicación de lo que ofrece, 1-2 oraciones]
CTA: [Acción clara, 2-3 palabras]
```

**Ejemplo Ajax:**

- H1: "Rule your space"
- P: "We cover intrusion protection, comfort and automation, fire and life safety, and video surveillance. All integrated into one system."
- CTA: "Where to buy"

#### Secciones de Features

```
H2: [Categoría de features]
H3: [Pregunta del usuario]
P: [Respuesta directa, 2-3 oraciones]
[Imagen de soporte]
```

**Ejemplo Ajax (Why Ajax):**

- H2: "Functionality"
- H3: "What can I make my Ajax system do?"
- P: "Ajax can be easily expanded with entry, fire and flood detectors..."

#### Cards de Producto

```
H3: [Nombre del producto]
P: [Descripción de 10-15 palabras]
CTA: "Learn more →"
```

### 6.3 Longitud de Textos

| Elemento            | Longitud Óptima | Ajax                    |
| ------------------- | --------------- | ----------------------- |
| Título H1           | 3-6 palabras    | ✓ "Rule your space" (3) |
| Subtítulo hero      | 15-30 palabras  | ✓ ~25 palabras          |
| Descripción de card | 10-20 palabras  | ✓ ~15 palabras          |
| Párrafo de sección  | 30-60 palabras  | ✓ ~50 palabras          |
| CTA button          | 2-4 palabras    | ✓ "Where to buy" (3)    |

### 6.4 Técnicas de Persuasión Identificadas

| Técnica           | Implementación                                        |
| ----------------- | ----------------------------------------------------- |
| **Social Proof**  | "4,000,000 people worldwide under Ajax protection"    |
| **Authority**     | Badges de premios, certificaciones EN54               |
| **Scarcity**      | "Only accredited partners can sell Superior products" |
| **Storytelling**  | "Company origins" section con historia real           |
| **FAQ como copy** | Preguntas de usuarios como H3, respuestas en body     |
| **Contraste**     | "Forget about security systems of the past"           |

### 6.5 Journey del Usuario (User Flow)

```
┌─────────────────────────────────────────────────────────────┐
│ CUSTOMER JOURNEY - AJAX SYSTEMS                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. AWARENESS                                               │
│     Hero → "Rule your space"                                │
│     ├── Impacto visual                                      │
│     └── Propuesta de valor clara                            │
│                                                             │
│  2. INTEREST                                                │
│     Product Categories → Exploración visual                 │
│     ├── Cards con imágenes                                  │
│     └── Categorías claras                                   │
│                                                             │
│  3. CONSIDERATION                                           │
│     "Explore Us" → Novedades                                │
│     ├── New releases                                        │
│     └── Solutions by facility                               │
│                                                             │
│  4. INTENT                                                  │
│     Solution Overview → Herramientas                        │
│     ├── "Assemble your system" (configurador)               │
│     ├── "Customer stories" (casos de éxito)                 │
│     └── "Solutions by facility type"                        │
│                                                             │
│  5. EVALUATION                                              │
│     Página de producto → Detalles completos                 │
│     ├── Especificaciones                                    │
│     ├── FAQs                                                │
│     └── Documentación                                       │
│                                                             │
│  6. PURCHASE                                                │
│     CTAs → "Where to buy" / "Become a partner"              │
│     ├── Directorio de distribuidores                        │
│     └── Formulario de contacto                              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 7. COMPONENTES UI IDENTIFICADOS

### 7.1 Componentes Atómicos

| Componente | Variantes                                         | Uso              |
| ---------- | ------------------------------------------------- | ---------------- |
| **Button** | Primary (black), Secondary (outline), Text (link) | CTAs, navegación |
| **Input**  | Text, Select, Checkbox                            | Formularios      |
| **Badge**  | Nuevo, Popular, Accredited                        | Productos        |
| **Icon**   | Navigation, Feature, Social                       | Todo el sitio    |
| **Tag**    | Categoría, Filtro                                 | Catálogos        |

### 7.2 Componentes Moleculares

| Componente           | Elementos                         | Uso          |
| -------------------- | --------------------------------- | ------------ |
| **Product Card**     | Image + Title + Description + CTA | Catálogos    |
| **Solution Card**    | Image + Title + CTA               | Overview     |
| **Feature Card**     | Icon + Title + Description        | Features     |
| **Testimonial Card** | Quote + Author + Company          | Social proof |
| **Stat Card**        | Number + Label                    | About page   |

### 7.3 Componentes Organismos

| Componente        | Secciones                            | Complejidad |
| ----------------- | ------------------------------------ | ----------- |
| **Header/Nav**    | Logo + Menu + CTA + Country selector | Alta        |
| **Hero Section**  | Title + Subtitle + CTA + Background  | Alta        |
| **Product Grid**  | 3-6 Product Cards                    | Media       |
| **FAQ Accordion** | 5-10 Question/Answer pairs           | Media       |
| **Footer**        | 4-6 Column links + Social + Legal    | Alta        |

### 7.4 Patrones de Layout

```
GRID PATTERNS:

Hero Full Width:
┌──────────────────────────────────────┐
│                                      │
│         [Content Centered]           │
│                                      │
└──────────────────────────────────────┘

2-Column (Image + Content):
┌────────────────┬─────────────────────┐
│                │                     │
│    [Image]     │    [Content]        │
│                │                     │
└────────────────┴─────────────────────┘

3-Column Cards:
┌──────────┬──────────┬──────────┐
│  Card 1  │  Card 2  │  Card 3  │
└──────────┴──────────┴──────────┘

4-Column Grid (Productos):
┌───────┬───────┬───────┬───────┐
│ P1    │ P2    │ P3    │ P4    │
└───────┴───────┴───────┴───────┘

Carousel/Slider:
┌──<────[1][2][3][4]────>──┐
│                          │
└──────────────────────────┘
```

---

## 8. MÉTRICAS Y CANTIDADES

### 8.1 Imágenes por Tipo de Página

| Página           | Imágenes Hero | Imágenes Producto | Iconos | Logos         | Total |
| ---------------- | ------------- | ----------------- | ------ | ------------- | ----- |
| Homepage         | 1             | 12+               | 20+    | 10+           | 40+   |
| Categoría        | 1             | 10+               | 10+    | 5+            | 25+   |
| Producto         | 6+            | 4+                | 15+    | 5+            | 30+   |
| About            | 3+            | 0                 | 10+    | 20+ (premios) | 35+   |
| Customer Stories | 1             | 15+               | 5+     | 5+            | 25+   |

### 8.2 Longitud de Copy por Página

| Página   | H1  | H2s | H3s | Palabras Body |
| -------- | --- | --- | --- | ------------- |
| Homepage | 1   | 4   | 8+  | ~200          |
| About    | 1   | 8   | 6   | ~500          |
| Why Ajax | 1   | 6   | 18  | ~1200         |
| Producto | 1   | 5   | 10+ | ~800          |

### 8.3 Links por Página

| Página   | Links Internos | Links Externos | Total |
| -------- | -------------- | -------------- | ----- |
| Homepage | 80+            | 15+            | 95+   |
| About    | 60+            | 10+            | 70+   |
| Producto | 40+            | 10+            | 50+   |

---

# PARTE 2: RECOMENDACIONES PARA GUARDMAN

## 9. APLICACIÓN DE PATRONES A GUARDMAN

### 9.1 Sistema de Colores Propuesto

```css
/* PALETA GUARDMAN - Basada en Ajax Systems */
:root {
  /* Fondos */
  --bg-dark: #181818; /* Hero, CTAs principales */
  --bg-light: #ffffff; /* Contenido principal */
  --bg-muted: #ededed; /* Transiciones, cards alternativas */
  --bg-accent: #f7f7f7; /* Hover states */

  /* Texto */
  --text-dark: #181818; /* Sobre fondos claros */
  --text-light: #f7f7f7; /* Sobre fondos oscuros */
  --text-muted: #6b7280; /* Texto secundario */

  /* Acento de Marca (mantener azul Guardman) */
  --accent-primary: #1e40af; /* Azul Guardman */
  --accent-secondary: #dc2626; /* Rojo emergencia */

  /* Bordes */
  --border-light: #e5e7eb;
  --border-dark: #374151;
}
```

### 9.2 Alternancia de Secciones Recomendada

```
HOMEPAGE GUARDMAN (Propuesta):

┌─────────────────────────────────────────────────────────────┐
│ 1. HERO (Negro #181818)                                     │
│    "Protegemos lo que más importa"                          │
│    CTA: "Cotizar ahora" | "Ver servicios"                   │
├─────────────────────────────────────────────────────────────┤
│ 2. SERVICE FINDER (Blanco #FFFFFF) - FLOTANTE               │
│    "¿Qué necesitas proteger?"                               │
├─────────────────────────────────────────────────────────────┤
│ 3. SERVICIOS GRID (Blanco #FFFFFF)                          │
│    6 tarjetas de servicios principales                      │
├─────────────────────────────────────────────────────────────┤
│ 4. GUARDPOD FEATURED (Negro #181818)                        │
│    Destacado de producto estrella                           │
│    Imagen + Especificaciones                                │
├─────────────────────────────────────────────────────────────┤
│ 5. SOLUCIONES POR SECTOR (Gris #EDEDED)                     │
│    Grid de 6 sectores: Retail, Industrial, Residencial...   │
├─────────────────────────────────────────────────────────────┤
│ 6. TESTIMONIOS / CLIENTES (Blanco #FFFFFF)                  │
│    Logos + Testimonios                                      │
├─────────────────────────────────────────────────────────────┤
│ 7. FAQ (Gris #EDEDED)                                       │
│    6 preguntas más frecuentes                               │
├─────────────────────────────────────────────────────────────┤
│ 8. CTA DUAL (Negro #181818)                                 │
│    "Cotizar servicio" | "Trabaja con nosotros"              │
├─────────────────────────────────────────────────────────────┤
│ 9. FOOTER (Negro #181818)                                   │
│    Navegación completa + Contacto                           │
└─────────────────────────────────────────────────────────────┘
```

### 9.3 Componentes Reutilizables Propuestos

#### 9.3.1 Section Wrapper

```astro
---
interface Props {
  background?: 'dark' | 'light' | 'muted';
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const { background = 'light', padding = 'lg', className = '' } = Astro.props;

const bgClasses = {
  dark: 'bg-[#181818] text-[#F7F7F7]',
  light: 'bg-white text-[#181818]',
  muted: 'bg-[#EDEDED] text-[#181818]',
};

const paddingClasses = {
  sm: 'py-8 md:py-12',
  md: 'py-12 md:py-16',
  lg: 'py-16 md:py-24',
  xl: 'py-24 md:py-32',
};
---

<!-- src/components/ui/Section.astro -->
<section
  class={`${bgClasses[background]} ${paddingClasses[padding]} ${className}`}
>
  <Container>
    <slot />
  </Container>
</section>
```

#### 9.3.2 Product Card (para Servicios)

```astro
---
interface Props {
  title: string;
  description: string;
  image: string;
  href: string;
  badge?: string;
}

const { title, description, image, href, badge } = Astro.props;
---

<!-- src/components/ui/ServiceCard.astro -->
<article
  class="group relative bg-white rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
>
  {/* Imagen */}
  <figure class="aspect-[4/3] overflow-hidden bg-gray-100">
    <img
      src={image}
      alt={title}
      class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      loading="lazy"
    />
  </figure>

  {/* Badge */}
  {
    badge && (
      <span class="absolute top-4 left-4 px-3 py-1 bg-[#1E40AF] text-white text-xs font-semibold rounded-full">
        {badge}
      </span>
    )
  }

  {/* Content */}
  <div class="p-6">
    <h3
      class="text-lg font-semibold text-[#181818] mb-2 group-hover:text-[#1E40AF] transition-colors"
    >
      {title}
    </h3>
    <p class="text-gray-600 text-sm mb-4 line-clamp-2">
      {description}
    </p>
    <a
      href={href}
      class="inline-flex items-center gap-2 text-[#1E40AF] font-medium text-sm hover:gap-3 transition-all"
    >
      Conocer más
      <svg
        class="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 5l7 7-7 7"></path>
      </svg>
    </a>
  </div>
</article>
```

#### 9.3.3 Hero Section

```astro
---
interface Props {
  title: string;
  subtitle: string;
  primaryCta?: { text: string; href: string };
  secondaryCta?: { text: string; href: string };
  backgroundImage?: string;
}

const { title, subtitle, primaryCta, secondaryCta, backgroundImage } =
  Astro.props;
---

<!-- src/components/sections/HeroAjax.astro -->
<section
  class="relative min-h-[80vh] flex items-center bg-[#181818] overflow-hidden"
>
  {/* Background Image with Overlay */}
  {
    backgroundImage && (
      <div class="absolute inset-0">
        <img
          src={backgroundImage}
          alt=""
          class="w-full h-full object-cover opacity-30"
        />
        <div class="absolute inset-0 bg-gradient-to-r from-[#181818] via-[#181818]/80 to-transparent" />
      </div>
    )
  }

  {/* Content */}
  <Container class="relative z-10">
    <div class="max-w-3xl">
      <h1
        class="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
      >
        {title}
      </h1>
      <p class="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl">
        {subtitle}
      </p>

      {/* CTAs */}
      <div class="flex flex-wrap gap-4">
        {
          primaryCta && (
            <Button href={primaryCta.href} variant="primary" size="lg">
              {primaryCta.text}
            </Button>
          )
        }
        {
          secondaryCta && (
            <Button
              href={secondaryCta.href}
              variant="outline"
              size="lg"
              class="border-white text-white hover:bg-white hover:text-[#181818]"
            >
              {secondaryCta.text}
            </Button>
          )
        }
      </div>
    </div>
  </Container>
</section>
```

#### 9.3.4 FAQ Accordion (Estilo Ajax)

```astro
---
interface FAQ {
  question: string;
  answer: string;
}

interface Props {
  title?: string;
  subtitle?: string;
  faqs: FAQ[];
  background?: 'dark' | 'light' | 'muted';
}

const {
  title = 'Preguntas Frecuentes',
  subtitle,
  faqs,
  background = 'muted',
} = Astro.props;
---

<!-- src/components/sections/FAQAjax.astro -->
<Section background={background}>
  <div class="max-w-3xl mx-auto">
    {/* Header */}
    <div class="text-center mb-12">
      <h2 class="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
      {subtitle && <p class="text-gray-600">{subtitle}</p>}
    </div>

    {/* Accordion */}
    <div class="space-y-4">
      {
        faqs.map((faq, index) => (
          <details
            class="group bg-white rounded-lg shadow-sm overflow-hidden"
            id={`faq-${index}`}
          >
            <summary class="flex items-center justify-between p-6 cursor-pointer list-none hover:bg-gray-50 transition-colors">
              <h3 class="text-lg font-semibold text-[#181818] pr-4">
                {faq.question}
              </h3>
              <svg
                class="w-5 h-5 text-gray-500 transition-transform group-open:rotate-180"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </summary>
            <div class="px-6 pb-6 text-gray-600">
              <p>{faq.answer}</p>
            </div>
          </details>
        ))
      }
    </div>
  </div>
</Section>
```

#### 9.3.5 Stats Section

```astro
---
interface Stat {
  value: string;
  label: string;
}

interface Props {
  stats: Stat[];
  background?: 'dark' | 'light' | 'muted';
}

const { stats, background = 'light' } = Astro.props;
---

<!-- src/components/sections/StatsSection.astro -->
<Section background={background} padding="md">
  <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
    {
      stats.map((stat) => (
        <div class="text-center">
          <p class="text-4xl md:text-5xl font-bold text-[#1E40AF] mb-2">
            {stat.value}
          </p>
          <p class="text-gray-600 text-sm md:text-base">{stat.label}</p>
        </div>
      ))
    }
  </div>
</Section>
```

#### 9.3.6 CTA Dual Section

```astro
---
interface Props {
  leftCta: {
    title: string;
    description: string;
    buttonText: string;
    buttonHref: string;
  };
  rightCta: {
    title: string;
    description: string;
    buttonText: string;
    buttonHref: string;
  };
}

const { leftCta, rightCta } = Astro.props;
---

<!-- src/components/sections/CTADual.astro -->
<Section background="muted" padding="lg">
  <div class="grid md:grid-cols-2 gap-8">
    {/* Left CTA */}
    <div class="bg-white rounded-2xl p-8 md:p-10 shadow-sm">
      <h2 class="text-2xl md:text-3xl font-bold text-[#181818] mb-4">
        {leftCta.title}
      </h2>
      <p class="text-gray-600 mb-6">
        {leftCta.description}
      </p>
      <Button href={leftCta.buttonHref} variant="primary">
        {leftCta.buttonText}
      </Button>
    </div>

    {/* Right CTA */}
    <div class="bg-[#181818] rounded-2xl p-8 md:p-10">
      <h2 class="text-2xl md:text-3xl font-bold text-white mb-4">
        {rightCta.title}
      </h2>
      <p class="text-gray-300 mb-6">
        {rightCta.description}
      </p>
      <Button
        href={rightCta.buttonHref}
        variant="outline"
        class="border-white text-white hover:bg-white hover:text-[#181818]"
      >
        {rightCta.buttonText}
      </Button>
    </div>
  </div>
</Section>
```

### 9.4 Estructura SEO Recomendada

```astro
---
interface Props {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  article?: {
    publishedTime: string;
    author: string;
    tags: string[];
  };
}

const {
  title,
  description,
  canonical,
  ogImage = '/og-default.jpg',
  article,
} = Astro.props;

const siteUrl = 'https://guardman.cl';
const fullTitle = `${title} | Guardman Chile`;
---

<!-- src/components/seo/CompleteSEO.astro --><!-- Basic Meta -->
<title>{fullTitle}</title>
<meta name="description" content={description} />
<meta name="theme-color" content="#181818" />
{canonical && <link rel="canonical" href={canonical} />}

<!-- Open Graph -->
<meta property="og:type" content={article ? 'article' : 'website'} />
<meta property="og:title" content={fullTitle} />
<meta property="og:description" content={description} />
<meta property="og:image" content={`${siteUrl}${ogImage}`} />
<meta property="og:locale" content="es_CL" />
<meta property="og:site_name" content="Guardman Chile" />

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content={fullTitle} />
<meta name="twitter:description" content={description} />
<meta name="twitter:image" content={`${siteUrl}${ogImage}`} />

<!-- Article specific -->
{
  article && (
    <>
      <meta property="article:published_time" content={article.publishedTime} />
      <meta property="article:author" content={article.author} />
      {article.tags.map((tag) => (
        <meta property="article:tag" content={tag} />
      ))}
    </>
  )
}
```

### 9.5 Copywriting Guidelines para Guardman

#### 9.5.1 Fórmula de Headlines

```
TIPO 1: Beneficio + Autoridad
"Protegemos tu negocio con tecnología de vanguardia"

TIPO 2: Pregunta + Solución
"¿Necesitas seguridad certificada? Guardias OS10 disponibles"

TIPO 3: Contraste
"Seguridad profesional, sin contratos forzosos"

TIPO 4: Storytelling
"Más de 20 años protegiendo lo que importa"
```

#### 9.5.2 Estructura de Párrafos

```
PÁRRAFO ESTÁNDAR:
1. Hook (primera frase impactante)
2. Desarrollo (2-3 frases explicativas)
3. Cierre (llamado a acción implícito)

EJEMPLO:
"La seguridad de tu negocio no puede esperar. Nuestros guardias
certificados OS10 brindan protección 24/7 con tecnología de
monitoreo en tiempo real. Solicita tu cotización hoy."
```

#### 9.5.3 CTAs Recomendados

| Contexto  | CTA Primario         | CTA Secundario         |
| --------- | -------------------- | ---------------------- |
| Hero      | "Cotizar ahora"      | "Ver servicios"        |
| Servicios | "Solicitar servicio" | "Más información"      |
| Producto  | "Cotizar GuardPod"   | "Ver especificaciones" |
| FAQ       | "Contactar experto"  | "Ver más preguntas"    |
| Footer    | "Llamar ahora"       | "Enviar mensaje"       |

### 9.6 Plan de Implementación

#### Fase 1: Componentes Base (1-2 días)

- [ ] Actualizar `Section.astro` con sistema de colores
- [ ] Crear `ServiceCard.astro` mejorado
- [ ] Actualizar `Button.astro` con variantes

#### Fase 2: Secciones Principales (2-3 días)

- [ ] Refactorizar `Hero.astro` con estilo Ajax
- [ ] Mejorar `ServicesGrid.astro`
- [ ] Crear `StatsSection.astro`
- [ ] Mejorar `FAQ.astro` con accordion

#### Fase 3: Páginas (3-4 días)

- [ ] Actualizar Homepage
- [ ] Mejorar páginas de Servicios
- [ ] Crear página de Detalle de Servicio
- [ ] Mejorar página Nosotros

#### Fase 4: SEO y Performance (1-2 días)

- [ ] Implementar schema markup
- [ ] Optimizar meta tags
- [ ] Mejorar internal linking
- [ ] Optimizar imágenes

---

## 10. RESUMEN EJECUTIVO

### Lo que Ajax Systems hace mejor:

1. **Sistema de colores monocromático** con alternancia estratégica
2. **Imágenes como única fuente de color** en un diseño minimalista
3. **Copywriting directo** con FAQs como estructura de contenido
4. **Jerarquía visual clara** con un solo H1 por página
5. **Navegación extensa en footer** para SEO
6. **Cards consistentes** en todo el sitio
7. **CTAs claros y consistentes** en cada sección

### Aplicaciones Clave para Guardman:

1. Adoptar el sistema de alternancia de secciones claro/oscuro
2. Usar imágenes de calidad profesional como elemento visual principal
3. Implementar FAQs extensos con estructura de pregunta-respuesta
4. Crear componentes de cards consistentes
5. Mejorar el footer con navegación completa
6. Implementar CTAs duales para conversión

---

**Documento generado:** 18 de Febrero, 2026  
**Versión:** 1.0  
**Estado:** Completado
