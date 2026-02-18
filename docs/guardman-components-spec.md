# Componentes Reutilizables Guardman

## Basados en el Análisis de Ajax Systems

**Fecha:** 18 de Febrero, 2026  
**Dependencias:** Tailwind CSS, Astro

---

## 1. SISTEMA DE DISEÑO

### 1.1 Tokens de Diseño

```typescript
// src/config/design-tokens.ts

export const colors = {
  // Backgrounds
  bg: {
    dark: '#181818', // Hero, CTAs principales
    light: '#FFFFFF', // Contenido principal
    muted: '#EDEDED', // Transiciones
    accent: '#F7F7F7', // Hover states
  },

  // Text
  text: {
    dark: '#181818',
    light: '#F7F7F7',
    muted: '#6B7280',
    accent: '#9CA3AF',
  },

  // Brand
  brand: {
    primary: '#1E40AF', // Azul Guardman
    secondary: '#DC2626', // Rojo emergencia
    tertiary: '#059669', // Verde éxito
  },

  // Borders
  border: {
    light: '#E5E7EB',
    dark: '#374151',
    accent: '#1E40AF',
  },
} as const;

export const spacing = {
  section: {
    sm: 'py-8 md:py-12',
    md: 'py-12 md:py-16',
    lg: 'py-16 md:py-24',
    xl: 'py-24 md:py-32',
  },
} as const;

export const typography = {
  heading: {
    h1: 'text-4xl md:text-5xl lg:text-6xl font-bold',
    h2: 'text-3xl md:text-4xl font-bold',
    h3: 'text-xl md:text-2xl font-semibold',
    h4: 'text-lg md:text-xl font-semibold',
    h5: 'text-base font-semibold',
  },
  body: {
    large: 'text-lg md:text-xl',
    base: 'text-base md:text-lg',
    small: 'text-sm md:text-base',
  },
} as const;
```

### 1.2 Tailwind Config Extend

```javascript
// tailwind.config.mjs - Extensiones

export default {
  theme: {
    extend: {
      colors: {
        // Sistema Ajax-inspired
        'ajax-dark': '#181818',
        'ajax-light': '#FFFFFF',
        'ajax-muted': '#EDEDED',
        'ajax-accent': '#F7F7F7',

        // Brand Guardman
        'guardman-blue': '#1E40AF',
        'guardman-red': '#DC2626',
        'guardman-green': '#059669',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
        30: '7.5rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
};
```

---

## 2. COMPONENTES ATÓMICOS

### 2.1 Button Mejorado

```astro
// src/components/ui/Button.astro

/** * Button Component - Ajax Systems inspired * Variants: primary, secondary, outline,
ghost, link * Sizes: sm, md, lg, xl */ interface Props { variant?: 'primary' | 'secondary'
| 'outline' | 'ghost' | 'link'; size?: 'sm' | 'md' | 'lg' | 'xl'; href?: string; type?:
'button' | 'submit' | 'reset'; disabled?: boolean; loading?: boolean; icon?: string;
iconPosition?: 'left' | 'right'; class?: string; } const { variant = 'primary', size
= 'md', href, type = 'button', disabled = false, loading = false, icon, iconPosition
= 'right', class: className = '', } = Astro.props; const Tag = href ? 'a' : 'button';
const baseClasses = 'inline-flex items-center justify-center font-semibold transition-all
duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50
disabled:cursor-not-allowed'; const variantClasses = { primary: 'bg-ajax-dark text-white
hover:bg-gray-800 focus:ring-ajax-dark', secondary: 'bg-guardman-blue text-white hover:bg-blue-700
focus:ring-guardman-blue', outline: 'border-2 border-ajax-dark text-ajax-dark hover:bg-ajax-dark
hover:text-white focus:ring-ajax-dark', ghost: 'text-ajax-dark hover:bg-gray-100 focus:ring-gray-300',
link: 'text-guardman-blue hover:text-blue-700 underline-offset-4 hover:underline',
}; const sizeClasses = { sm: 'px-4 py-2 text-sm gap-1.5 rounded-md', md: 'px-6 py-3
text-base gap-2 rounded-lg', lg: 'px-8 py-4 text-lg gap-2.5 rounded-lg', xl: 'px-10
py-5 text-xl gap-3 rounded-xl', }; const classes = [ baseClasses, variantClasses[variant],
sizeClasses[size], className, ].join(' ');

<Tag
  href={href}
  type={!href ? type : undefined}
  disabled={disabled || loading}
  class={classes}
>
  {
    loading && (
      <svg class="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        />
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>
    )
  }

  {
    icon && iconPosition === 'left' && !loading && (
      <svg class="w-5 h-5" dangerouslySetInnerHTML={{ __html: icon }} />
    )
  }

  <slot />

  {
    icon && iconPosition === 'right' && !loading && (
      <svg class="w-5 h-5" dangerouslySetInnerHTML={{ __html: icon }} />
    )
  }
</Tag>
```

### 2.2 Badge Component

```astro
// src/components/ui/Badge.astro

/** * Badge - Para destacar productos, servicios, estados */ interface Props { variant?:
'primary' | 'success' | 'warning' | 'error' | 'neutral'; size?: 'sm' | 'md' | 'lg';
class?: string; } const { variant = 'primary', size = 'md', class: className = '',
} = Astro.props; const variantClasses = { primary: 'bg-guardman-blue text-white',
success: 'bg-guardman-green text-white', warning: 'bg-yellow-500 text-white', error:
'bg-guardman-red text-white', neutral: 'bg-gray-200 text-gray-800', }; const sizeClasses
= { sm: 'px-2 py-0.5 text-xs', md: 'px-3 py-1 text-sm', lg: 'px-4 py-1.5 text-base',
};

<span
  class={`inline-flex items-center font-semibold rounded-full ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
>
  <slot />
</span>
```

### 2.3 Icon Component

```astro
// src/components/ui/Icon.astro

/** * Icon - Sistema de iconos SVG */ interface Props { name: string; size?: 'xs'
| 'sm' | 'md' | 'lg' | 'xl'; class?: string; } const { name, size = 'md', class: className
= '' } = Astro.props; const sizeClasses = { xs: 'w-3 h-3', sm: 'w-4 h-4', md: 'w-5
h-5', lg: 'w-6 h-6', xl: 'w-8 h-8', }; // Icon paths const icons: Record<string, string>
= { arrow: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
d="M9 5l7 7-7 7" />', chevronDown: '<path stroke-linecap="round" stroke-linejoin="round"
stroke-width="2" d="M19 9l-7 7-7-7" />', check: '<path stroke-linecap="round" stroke-linejoin="round"
stroke-width="2" d="M5 13l4 4L19 7" />', phone: '<path stroke-linecap="round" stroke-linejoin="round"
stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502
1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493
1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />', mail: '<path
stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2
2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
/>', location: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314
0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15
11a3 3 0 11-6 0 3 3 0 016 0z" />', shield: '<path stroke-linecap="round" stroke-linejoin="round"
stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955
0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03
9-11.622 0-1.042-.133-2.052-.382-3.016z" />', clock: '<path stroke-linecap="round"
stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118
0z" />', star: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969
0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538
1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1
1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
/>', }; const iconPath = icons[name] || '';

<svg
  class={`${sizeClasses[size]} ${className}`}
  fill="none"
  viewBox="0 0 24 24"
  stroke="currentColor"
  dangerouslySetInnerHTML={{ __html: iconPath }}></svg>
```

---

## 3. COMPONENTES MOLECULARES

### 3.1 ServiceCard (Producto)

```astro
// src/components/ui/ServiceCard.astro

/** * ServiceCard - Tarjeta de servicio/producto estilo Ajax */ interface Props {
title: string; description: string; image: string; href: string; badge?: string; features?:
string[]; variant?: 'default' | 'featured' | 'compact'; } const { title, description,
image, href, badge, features = [], variant = 'default' } = Astro.props; const cardVariants
= { default: 'bg-white', featured: 'bg-ajax-dark text-white', compact: 'bg-gray-50',
};

<article
  class={`group relative rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl ${cardVariants[variant]}`}
>
  {/* Image */}
  <figure
    class={`relative overflow-hidden ${variant === 'compact' ? 'aspect-[16/9]' : 'aspect-[4/3]'}`}
  >
    <img
      src={image}
      alt={title}
      class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      loading="lazy"
    />

    {/* Gradient Overlay for featured */}
    {
      variant === 'featured' && (
        <div class="absolute inset-0 bg-gradient-to-t from-ajax-dark/80 to-transparent" />
      )
    }

    {/* Badge */}
    {
      badge && (
        <span class="absolute top-4 left-4 px-3 py-1 bg-guardman-blue text-white text-xs font-semibold rounded-full uppercase tracking-wide">
          {badge}
        </span>
      )
    }
  </figure>

  {/* Content */}
  <div
    class={`p-6 ${variant === 'featured' ? 'absolute bottom-0 left-0 right-0' : ''}`}
  >
    <h3
      class={`text-lg font-semibold mb-2 group-hover:text-guardman-blue transition-colors ${variant === 'featured' ? 'text-white' : 'text-ajax-dark'}`}
    >
      <a href={href} class="hover:underline">
        {title}
      </a>
    </h3>

    <p
      class={`text-sm mb-4 line-clamp-2 ${variant === 'featured' ? 'text-gray-300' : 'text-gray-600'}`}
    >
      {description}
    </p>

    {/* Features List */}
    {
      features.length > 0 && (
        <ul class="space-y-1 mb-4">
          {features.slice(0, 3).map((feature) => (
            <li class="flex items-center gap-2 text-sm text-gray-600">
              <Icon name="check" size="sm" class="text-guardman-green" />
              {feature}
            </li>
          ))}
        </ul>
      )
    }

    {/* CTA */}
    <a
      href={href}
      class={`inline-flex items-center gap-2 font-medium text-sm transition-all hover:gap-3 ${variant === 'featured' ? 'text-white' : 'text-guardman-blue'}`}
    >
      Conocer más
      <Icon name="arrow" size="sm" />
    </a>
  </div>
</article>
```

### 3.2 FeatureCard

```astro
// src/components/ui/FeatureCard.astro

/** * FeatureCard - Para mostrar características/beneficios */ interface Props { icon:
string; title: string; description: string; variant?: 'light' | 'dark'; } const {
icon, title, description, variant = 'light' } = Astro.props;

<div
  class={`p-6 rounded-xl transition-all duration-300 hover:shadow-lg ${variant === 'dark' ? 'bg-ajax-dark' : 'bg-white'}`}
>
  <div
    class={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${variant === 'dark' ? 'bg-white/10' : 'bg-guardman-blue/10'}`}
  >
    <Icon
      name={icon}
      size="lg"
      class={variant === 'dark' ? 'text-white' : 'text-guardman-blue'}
    />
  </div>

  <h4
    class={`text-lg font-semibold mb-2 ${variant === 'dark' ? 'text-white' : 'text-ajax-dark'}`}
  >
    {title}
  </h4>

  <p
    class={`text-sm ${variant === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
  >
    {description}
  </p>
</div>
```

### 3.3 StatCard

```astro
// src/components/ui/StatCard.astro

/** * StatCard - Para mostrar estadísticas/números */ interface Props { value: string;
label: string; prefix?: string; suffix?: string; } const { value, label, prefix =
'', suffix = '' } = Astro.props;

<div class="text-center p-6">
  <p class="text-4xl md:text-5xl font-bold text-guardman-blue mb-2">
    {prefix}{value}{suffix}
  </p>
  <p class="text-gray-600 text-sm md:text-base">
    {label}
  </p>
</div>
```

### 3.4 TestimonialCard

```astro
// src/components/ui/TestimonialCard.astro

/** * TestimonialCard - Para testimonios de clientes */ interface Props { quote: string;
author: string; role: string; company: string; image?: string; rating?: number; }
const { quote, author, role, company, image, rating = 5 } = Astro.props;

<blockquote
  class="bg-white rounded-xl p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow"
>
  {/* Rating */}
  {
    rating > 0 && (
      <div class="flex gap-1 mb-4">
        {Array.from({ length: rating }).map(() => (
          <Icon name="star" size="sm" class="text-yellow-500" />
        ))}
      </div>
    )
  }

  {/* Quote */}
  <p class="text-gray-700 mb-6 italic">
    "{quote}"
  </p>

  {/* Author */}
  <footer class="flex items-center gap-4">
    {
      image && (
        <img
          src={image}
          alt={author}
          class="w-12 h-12 rounded-full object-cover"
          loading="lazy"
        />
      )
    }
    <div>
      <cite class="not-italic font-semibold text-ajax-dark">
        {author}
      </cite>
      <p class="text-sm text-gray-600">
        {role}, {company}
      </p>
    </div>
  </footer>
</blockquote>
```

---

## 4. COMPONENTES ORGANISMOS

### 4.1 Section (Wrapper)

```astro
// src/components/ui/Section.astro

/** * Section - Wrapper para todas las secciones * Sistema de colores estilo Ajax
Systems */ interface Props { background?: 'dark' | 'light' | 'muted' | 'accent'; padding?:
'none' | 'sm' | 'md' | 'lg' | 'xl'; fullHeight?: boolean; id?: string; class?: string;
} const { background = 'light', padding = 'lg', fullHeight = false, id, class: className
= '', } = Astro.props; const bgClasses = { dark: 'bg-ajax-dark text-white', light:
'bg-white text-ajax-dark', muted: 'bg-ajax-muted text-ajax-dark', accent: 'bg-ajax-accent
text-ajax-dark', }; const paddingClasses = { none: '', sm: 'py-8 md:py-12', md: 'py-12
md:py-16', lg: 'py-16 md:py-24', xl: 'py-24 md:py-32', };

<section
  id={id}
  class={`
    ${bgClasses[background]}
    ${paddingClasses[padding]}
    ${fullHeight ? 'min-h-screen flex items-center' : ''}
    ${className}
  `}
>
  <Container>
    <slot />
  </Container>
</section>
```

### 4.2 HeroAjax

```astro
// src/components/sections/HeroAjax.astro

/** * HeroAjax - Hero section estilo Ajax Systems */ interface Props { title: string;
subtitle: string; primaryCta?: { text: string; href: string }; secondaryCta?: { text:
string; href: string }; backgroundImage?: string; backgroundVideo?: string; align?:
'left' | 'center' | 'right'; size?: 'sm' | 'md' | 'lg' | 'full'; } const { title,
subtitle, primaryCta, secondaryCta, backgroundImage, backgroundVideo, align = 'left',
size = 'lg', } = Astro.props; const alignClasses = { left: 'text-left', center: 'text-center
mx-auto', right: 'text-right ml-auto', }; const sizeClasses = { sm: 'min-h-[50vh]',
md: 'min-h-[70vh]', lg: 'min-h-[85vh]', full: 'min-h-screen', };

<section
  class={`relative ${sizeClasses[size]} flex items-center bg-ajax-dark overflow-hidden`}
>
  {/* Background */}
  {
    backgroundImage && (
      <div class="absolute inset-0">
        <img
          src={backgroundImage}
          alt=""
          class="w-full h-full object-cover opacity-30"
          loading="eager"
        />
        <div class="absolute inset-0 bg-gradient-to-r from-ajax-dark via-ajax-dark/80 to-transparent" />
      </div>
    )
  }

  {/* Content */}
  <Container class="relative z-10">
    <div class={`max-w-3xl ${alignClasses[align]}`}>
      <h1
        class="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight animate-fade-in"
      >
        {title}
      </h1>
      <p
        class="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl animate-slide-up"
      >
        {subtitle}
      </p>

      {/* CTAs */}
      {
        (primaryCta || secondaryCta) && (
          <div
            class="flex flex-wrap gap-4 animate-slide-up"
            style="animation-delay: 0.2s"
          >
            {primaryCta && (
              <Button href={primaryCta.href} variant="secondary" size="lg">
                {primaryCta.text}
              </Button>
            )}
            {secondaryCta && (
              <Button
                href={secondaryCta.href}
                variant="outline"
                size="lg"
                class="border-white text-white hover:bg-white hover:text-ajax-dark"
              >
                {secondaryCta.text}
              </Button>
            )}
          </div>
        )
      }
    </div>
  </Container>

  {/* Scroll Indicator */}
  {
    size === 'full' && (
      <div class="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <Icon name="chevronDown" size="lg" class="text-white/50" />
      </div>
    )
  }
</section>
```

### 4.3 ServicesGridAjax

```astro
// src/components/sections/ServicesGridAjax.astro

/** * ServicesGridAjax - Grid de servicios estilo Ajax */ interface Service { title:
string; description: string; image: string; href: string; badge?: string; features?:
string[]; } interface Props { title?: string; subtitle?: string; services: Service[];
columns?: 2 | 3 | 4; showAllLink?: boolean; background?: 'dark' | 'light' | 'muted';
} const { title = 'Nuestros Servicios', subtitle, services, columns = 3, showAllLink
= false, background = 'light', } = Astro.props; const gridClasses = { 2: 'md:grid-cols-2',
3: 'md:grid-cols-2 lg:grid-cols-3', 4: 'md:grid-cols-2 lg:grid-cols-4', };

<Section background={background}>
  {/* Header */}
  <div class="text-center mb-12">
    <h2 class="text-3xl md:text-4xl font-bold mb-4">
      {title}
    </h2>
    {subtitle && <p class="text-gray-600 max-w-2xl mx-auto">{subtitle}</p>}
  </div>

  {/* Grid */}
  <div class={`grid gap-6 md:gap-8 ${gridClasses[columns]}`}>
    {services.map((service) => <ServiceCard {...service} />)}
  </div>

  {/* Show All Link */}
  {
    showAllLink && (
      <div class="text-center mt-12">
        <Button href="/servicios" variant="outline">
          Ver todos los servicios
          <Icon name="arrow" size="sm" slot="icon-right" />
        </Button>
      </div>
    )
  }
</Section>
```

### 4.4 FAQAjax

```astro
// src/components/sections/FAQAjax.astro

/** * FAQAjax - Sección de preguntas frecuentes estilo Ajax */ interface FAQ { question:
string; answer: string; } interface Props { title?: string; subtitle?: string; faqs:
FAQ[]; background?: 'dark' | 'light' | 'muted'; columns?: 1 | 2; } const { title =
'Preguntas Frecuentes', subtitle, faqs, background = 'muted', columns = 1, } = Astro.props;

<Section background={background}>
  <div class={columns === 2 ? 'max-w-6xl' : 'max-w-3xl'} class:m-x-auto>
    {/* Header */}
    <div class="text-center mb-12">
      <h2 class="text-3xl md:text-4xl font-bold mb-4">
        {title}
      </h2>
      {subtitle && <p class="text-gray-600">{subtitle}</p>}
    </div>

    {/* Accordion Grid */}
    <div class={columns === 2 ? 'grid md:grid-cols-2 gap-4' : 'space-y-4'}>
      {
        faqs.map((faq, index) => (
          <details class="group bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <summary class="flex items-center justify-between p-6 cursor-pointer list-none hover:bg-gray-50 transition-colors">
              <h3 class="text-base md:text-lg font-semibold text-ajax-dark pr-4">
                {faq.question}
              </h3>
              <Icon
                name="chevronDown"
                class="w-5 h-5 text-gray-500 transition-transform group-open:rotate-180"
              />
            </summary>
            <div class="px-6 pb-6 text-gray-600 border-t border-gray-100">
              <p class="pt-4">{faq.answer}</p>
            </div>
          </details>
        ))
      }
    </div>

    {/* CTA */}
    <div class="text-center mt-12">
      <p class="text-gray-600 mb-4">¿Tienes más preguntas?</p>
      <Button href="/contacto" variant="primary"> Contactar un experto </Button>
    </div>
  </div>
</Section>
```

### 4.5 StatsSection

```astro
// src/components/sections/StatsSection.astro

/** * StatsSection - Sección de estadísticas */ interface Stat { value: string; label:
string; prefix?: string; suffix?: string; } interface Props { stats: Stat[]; title?:
string; background?: 'dark' | 'light' | 'muted'; } const { stats, title, background
= 'dark' } = Astro.props;

<Section background={background} padding="md">
  {
    title && (
      <h2 class="text-2xl md:text-3xl font-bold text-center mb-8">{title}</h2>
    )
  }

  <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
    {stats.map((stat) => <StatCard {...stat} />)}
  </div>
</Section>
```

### 4.6 CTADual

```astro
// src/components/sections/CTADual.astro

/** * CTADual - Dos CTAs lado a lado estilo Ajax */ interface CTA { title: string;
description: string; buttonText: string; buttonHref: string; icon?: string; } interface
Props { leftCta: CTA; rightCta: CTA; } const { leftCta, rightCta } = Astro.props;

<Section background="muted">
  <div class="grid md:grid-cols-2 gap-8">
    {/* Left CTA - Light */}
    <div
      class="bg-white rounded-2xl p-8 md:p-10 shadow-sm hover:shadow-lg transition-shadow"
    >
      {
        leftCta.icon && (
          <div class="w-12 h-12 rounded-lg bg-guardman-blue/10 flex items-center justify-center mb-6">
            <Icon name={leftCta.icon} size="lg" class="text-guardman-blue" />
          </div>
        )
      }
      <h2 class="text-2xl md:text-3xl font-bold text-ajax-dark mb-4">
        {leftCta.title}
      </h2>
      <p class="text-gray-600 mb-6">
        {leftCta.description}
      </p>
      <Button href={leftCta.buttonHref} variant="secondary">
        {leftCta.buttonText}
      </Button>
    </div>

    {/* Right CTA - Dark */}
    <div
      class="bg-ajax-dark rounded-2xl p-8 md:p-10 hover:shadow-lg transition-shadow"
    >
      {
        rightCta.icon && (
          <div class="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center mb-6">
            <Icon name={rightCta.icon} size="lg" class="text-white" />
          </div>
        )
      }
      <h2 class="text-2xl md:text-3xl font-bold text-white mb-4">
        {rightCta.title}
      </h2>
      <p class="text-gray-400 mb-6">
        {rightCta.description}
      </p>
      <Button
        href={rightCta.buttonHref}
        variant="outline"
        class="border-white text-white hover:bg-white hover:text-ajax-dark"
      >
        {rightCta.buttonText}
      </Button>
    </div>
  </div>
</Section>
```

---

## 5. PÁGINA COMPLETA EJEMPLO

### 5.1 Homepage Refactorizada

```astro
// src/pages/index-refactor.astro

import BaseLayout from '@/layouts/BaseLayout.astro'; import HeroAjax from '@/components/sections/HeroAjax.astro';
import ServicesGridAjax from '@/components/sections/ServicesGridAjax.astro'; import
StatsSection from '@/components/sections/StatsSection.astro'; import FAQAjax from
'@/components/sections/FAQAjax.astro'; import CTADual from '@/components/sections/CTADual.astro';
import { convexServer } from '@/lib/convex'; import { api } from '@convex/_generated/api';
const services = await convexServer.query(api.services.getAllServices); const faqs
= await convexServer.query(api.faqs.getAllFaqs); const stats = [ { value: '20+', label:
'Años de experiencia' }, { value: '500+', label: 'Clientes activos' }, { value: '24/7',
label: 'Monitoreo continuo' }, { value: '100%', label: 'Guardias OS10 certificados'
}, ];

<BaseLayout
  title="Guardman Chile - Seguridad Privada"
  description="Empresa líder en seguridad privada. Guardias OS10, alarmas, patrullaje y módulos GuardPod."
>
  {/* 1. HERO - Negro */}
  <HeroAjax
    title="Protegemos lo que más importa"
    subtitle="Más de 20 años brindando seguridad privada en Chile. Guardias certificados OS10, tecnología de vanguardia y cobertura en toda la Región Metropolitana."
    primaryCta={{ text: 'Cotizar ahora', href: '/cotizar' }}
    secondaryCta={{ text: 'Ver servicios', href: '#servicios' }}
    backgroundImage="/images/hero-security.jpg"
  />

  {/* 2. STATS - Negro */}
  <StatsSection stats={stats} background="dark" />

  {/* 3. SERVICIOS - Blanco */}
  <ServicesGridAjax
    id="servicios"
    title="Nuestros Servicios"
    subtitle="Soluciones integrales de seguridad adaptadas a cada necesidad"
    services={services}
    showAllLink={true}
    background="light"
  />

  {/* 4. FAQ - Gris */}
  <FAQAjax title="Preguntas Frecuentes" faqs={faqs} background="muted" />

  {/* 5. CTA DUAL - Gris */}
  <CTADual
    leftCta={{
      title: '¿Necesitas seguridad?',
      description:
        'Cotiza el servicio ideal para tu hogar o empresa. Sin compromiso.',
      buttonText: 'Solicitar cotización',
      buttonHref: '/cotizar',
      icon: 'shield',
    }}
    rightCta={{
      title: 'Únete al equipo',
      description: 'Buscamos guardias OS10 y profesionales de seguridad.',
      buttonText: 'Ver vacantes',
      buttonHref: '/carreras',
      icon: 'clock',
    }}
  />
</BaseLayout>
```

---

## 6. UTILIDADES

### 6.1 Container Mejorado

```astro
// src/components/ui/Container.astro

interface Props { size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'; class?: string; } const
{ size = 'lg', class: className = '' } = Astro.props; const sizeClasses = { sm: 'max-w-3xl',
md: 'max-w-5xl', lg: 'max-w-7xl', xl: 'max-w-[1400px]', full: 'max-w-none', };

<div class={`mx-auto px-4 sm:px-6 lg:px-8 ${sizeClasses[size]} ${className}`}>
  <slot />
</div>
```

### 6.2 Section Header

```astro
// src/components/ui/SectionHeader.astro

interface Props { title: string; subtitle?: string; align?: 'left' | 'center' | 'right';
size?: 'sm' | 'md' | 'lg'; } const { title, subtitle, align = 'center', size = 'md'
} = Astro.props; const alignClasses = { left: 'text-left', center: 'text-center mx-auto',
right: 'text-right ml-auto', }; const sizeClasses = { sm: 'mb-8', md: 'mb-12', lg:
'mb-16', };

<header class={`${alignClasses[align]} ${sizeClasses[size]} max-w-3xl`}>
  <h2 class="text-3xl md:text-4xl font-bold mb-4">
    {title}
  </h2>
  {subtitle && <p class="text-gray-600 text-lg">{subtitle}</p>}
</header>
```

---

## CHECKLIST DE IMPLEMENTACIÓN

### Fase 1: Setup (1 día)

- [ ] Crear archivo `design-tokens.ts`
- [ ] Actualizar `tailwind.config.mjs`
- [ ] Actualizar `Container.astro`
- [ ] Crear `Icon.astro`

### Fase 2: Atómicos (1 día)

- [ ] Actualizar `Button.astro`
- [ ] Crear `Badge.astro`
- [ ] Actualizar `Section.astro`
- [ ] Crear `SectionHeader.astro`

### Fase 3: Moleculares (1 día)

- [ ] Crear `ServiceCard.astro`
- [ ] Crear `FeatureCard.astro`
- [ ] Crear `StatCard.astro`
- [ ] Crear `TestimonialCard.astro`

### Fase 4: Organismos (2 días)

- [ ] Crear `HeroAjax.astro`
- [ ] Crear `ServicesGridAjax.astro`
- [ ] Crear `FAQAjax.astro`
- [ ] Crear `StatsSection.astro`
- [ ] Crear `CTADual.astro`

### Fase 5: Páginas (2 días)

- [ ] Refactorizar Homepage
- [ ] Refactorizar Servicios
- [ ] Refactorizar Nosotros
- [ ] Refactorizar Contacto

---

**Total estimado:** 7 días de trabajo

**Beneficios:**

- Consistencia visual en todo el sitio
- Componentes reutilizables
- Sistema de colores profesional
- Mejor UX siguiendo patrones de Ajax Systems
- Código mantenible y escalable
