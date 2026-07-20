# Style DNA — Imágenes para Servicios

**Proyecto:** guardman-astro
**Fecha:** 2026-07-19
**Scope:** 9 servicios (Guardpod excluido por decisión de marca — usamos otro estilo)
**Estado:** Borrador para revisión. No implementar hasta aprobación.

---

## Servicios cubiertos

| Slug | Label | Origen del prompt |
|---|---|---|
| `guardias-de-seguridad` | Guardias de Seguridad | [LEGACY] adaptado |
| `cctv-videovigilancia` | CCTV Videovigilancia | [LEGACY] adaptado |
| `control-de-accesos` | Control de Accesos | [LEGACY] adaptado |
| `escoltas-privados` | PPI (Protección de Personas Importantes) | [NUEVO] |
| `monitoreo-24-7` | Monitoreo 24/7 | [NUEVO] |
| `seguridad-eventos` | Seguridad Eventos | [NUEVO] |
| `seguridad-industrial` | Seguridad Industrial | [NUEVO] |
| `auditoria-seguridad` | Auditoría de Seguridad | [NUEVO] |
| `aseo` | Aseo | [NUEVO] |
| `seguridad-deportiva` | Seguridad Deportiva | [PROVEÍDA] imagen real entregada por Kammler 2026-07-19 |

**Convención de archivo:** `public/images/service-{slug}.webp` (alineado con la convención actual del sitio).

---

## 1. Style Guide (Capa 1 — system prompt fijo)

Se inyecta siempre, en cada generación:

```
STYLE GUIDE — Follow these rules exactly:

CAMERA: Canon EOS R5 full-frame mirrorless, RF 24-70mm f/2.8L lens.
LIGHTING: Natural golden hour light, soft directional shadows, warm tone (5600-6000K). No harsh midday sun. No artificial flash.
COLOR PALETTE: Navy blue #1A2744, white #FFFFFF, steel blue #5F7A96, warm gray #6C757D. Colors must be natural, not oversaturated.
LOCATION: Santiago de Chile. Corporate buildings, residential condominiums, urban streets. Andes mountains on horizon when natural.
MOOD: Professional, trustworthy, authentic. Photorealistic portfolio quality. Not stock photo, not overly perfect.
COMPOSITION: Rule of thirds, leading lines, eye-level (1.6m), negative space. No extreme angles.
AVOID: Recognizable faces, weapons, AI artifacts, third-party logos, tropical vegetation, neon colors, military postures, messy cables, text overlays, watermarks.
OUTPUT: Photorealistic, high resolution, WebP format, no text, no watermarks.
```

---

## 2. Composición del prompt (Capa 1 + 2 + 3)

```typescript
interface ServiceImagePrompt {
  id: string;              // 'servicio-{slug}'
  label: string;           // legible humano
  service_slug: string;    // match con SERVICE_SLUGS en lib/constants.ts
  category: 'servicios';
  resolution: '1K' | '2K';
  aspect_ratio: '4:3' | '16:9';
  prompt: string;          // Capa 2 — la escena específica
  negative: string;        // exclusiones puntuales
}

function composePrompt(t: ServiceImagePrompt, userInput?: string) {
  const sys = GUARDMAN_SYSTEM_PROMPT; // Capa 1
  let prompt = `${sys}\n\nSCENE: ${t.prompt}`;
  if (userInput?.trim()) prompt += `\n\nADDITIONAL DETAILS: ${userInput.trim()}`;
  return { prompt, negative: t.negative };
}
```

**Output final** (ejemplo):
```
STYLE GUIDE — Follow these rules exactly: [...Capa 1...]

SCENE: Professional security guard in navy blue GuardMan uniform [...]

ADDITIONAL DETAILS: <lo que el usuario agregue en Capa 3>
```

---

## 3. Prompts por servicio (Capa 2)

### 3.1 `servicio-guardias-de-seguridad` · [LEGACY] adaptado
- **Resolución:** 1K
- **Aspecto:** 4:3
- **Slug canónico:** `guardias-de-seguridad`
- **Prompt base:**
  > Professional security guard in navy blue GuardMan uniform standing at the entrance lobby of a corporate office building in Santiago Chile. OS-10 certification badge visible on chest. Guard from 45-degree angle, looking toward entrance. Clean modern lobby, glass doors, corporate atmosphere. Natural diffuse daylight.
- **Negative:**
  > visible face details, weapons, military posture, dark, empty lobby

### 3.2 `servicio-cctv-videovigilancia` · [LEGACY] adaptado
- **Resolución:** 1K
- **Aspecto:** 4:3
- **Slug canónico:** `cctv-videovigilancia`
- **Prompt base:**
  > Modern dome CCTV camera professionally installed on the ceiling of a corporate hallway in Santiago. Clean cable management, blue indicator light glowing softly. Clean white ceiling, modern office corridor.
- **Negative:**
  > messy cables, dirty ceiling, outdated camera, people, dark

### 3.3 `servicio-control-de-accesos` · [LEGACY] adaptado
- **Resolución:** 1K
- **Aspecto:** 4:3
- **Slug canónico:** `control-de-accesos`
- **Prompt base:**
  > Modern access control turnstile gate at the entrance of a Santiago office building. Card reader with blue LED, sleek stainless steel finish. Clean lobby background. Natural daylight through glass entrance. Security-focused but welcoming.
- **Negative:**
  > people visible faces, dirty glass, old equipment, dark

### 3.4 `servicio-escoltas-privados` · [NUEVO]
- **Resolución:** 2K
- **Aspecto:** 16:9
- **Slug canónico:** `escoltas-privados`
- **Prompt base:**
  > Wide shot of a black armored SUV parked at the entrance of a corporate building in Santiago Chile. Two PPI bodyguards in dark navy suits with earpieces flanking the vehicle, seen from behind. The principal being escorted is mid-stride toward the car, blurred and without distinguishable face. Modern glass facade, golden hour side light casting long shadows on the pavement. Discreet, professional, executive atmosphere.
- **Negative:**
  > visible face details, weapons in hand, military gear, aggressive stance, neon, armored plates, SWAT aesthetics

### 3.5 `servicio-monitoreo-24-7` · [NUEVO]
- **Resolución:** 2K
- **Aspecto:** 16:9
- **Slug canónico:** `monitoreo-24-7`
- **Prompt base:**
  > Interior medium shot of a 24/7 monitoring control room in Santiago. Three large video wall panels on the back wall showing different CCTV feeds of buildings and streets. One operator in a navy GuardMan polo sitting at a curved console, seen from the back, focus on the screens. Subtle blue LED accent lighting from screens onto the operator. Dim ambient light, clean modern industrial ceiling, multiple monitors on the desk. Professional NOC atmosphere.
- **Negative:**
  > visible operator face, alarm red lighting, cluttered desk, cables visible, dystopian, military command center, stock photo office

### 3.6 `servicio-seguridad-eventos` · [NUEVO]
- **Resolución:** 1K
- **Aspecto:** 4:3
- **Slug canónico:** `seguridad-eventos`
- **Prompt base:**
  > A corporate gala event in a Santiago event hall, viewed from the entrance. Security guard in navy uniform checking credentials at a registration desk with a tablet. Soft warm interior lighting, branded backdrop partially visible without readable text. Elegant atmosphere with chandeliers, guests in the background out of focus. Professional and welcoming.
- **Negative:**
  > visible faces, weapons, concert crowd, rave, alcohol bottles prominent, bouncer pose, aggressive stance, dark alley

### 3.7 `servicio-seguridad-industrial` · [NUEVO]
- **Resolución:** 1K
- **Aspecto:** 4:3
- **Slug canónico:** `seguridad-industrial`
- **Prompt base:**
  > Industrial plant exterior in Santiago outskirts, late afternoon. Security guard in navy GuardMan uniform with white hard hat and high-visibility vest doing a perimeter check at a gated entrance. Shipping containers and industrial structures in the background, soft golden light from the west. Operational atmosphere, clean and orderly, no workers visible up close.
- **Negative:**
  > visible face details, hard hat worn incorrectly, cluttered yard, broken equipment, abandoned look, dark, mining aesthetic

### 3.8 `servicio-auditoria-seguridad` · [NUEVO]
- **Resolución:** 1K
- **Aspecto:** 4:3
- **Slug canónico:** `auditoria-seguridad`
- **Prompt base:**
  > Medium shot of a security consultant in business casual (navy blazer, no tie) holding a tablet while walking through a corporate lobby in Santiago. The consultant is reviewing a checklist on the tablet, pen in hand, posture attentive. Modern glass and steel architecture, soft natural light from tall windows. The scene communicates evaluation, assessment, professional inspection.
- **Negative:**
  > visible face details, badge, clipboard with logos, audit failure mood, dark, cluttered, military

### 3.9 `servicio-aseo` · [NUEVO]
- **Resolución:** 1K
- **Aspecto:** 4:3
- **Slug canónico:** `aseo`
- **Prompt base:**
  > Two cleaning staff in navy GuardMan branded uniforms polishing a marble floor in a modern Santiago corporate lobby. One kneeling with microfiber cloth, one standing with a professional floor polisher. Reflective floor, glass walls, soft morning natural light. Clean, organized, premium building maintenance atmosphere. Equipment neatly arranged.
- **Negative:**
  > visible face details, dirty surfaces, mop and bucket aesthetic, industrial cleaning chemicals visible, stock photo smiling, oversaturated, neon uniform

### 3.10 `servicio-seguridad-deportiva` · [PROVEÍDA]
- **Resolución:** 1280×720 (2K class, original del cliente)
- **Aspecto:** 16:9
- **Slug canónico:** `seguridad-deportiva`
- **Origen:** imagen real entregada por Kammler el 2026-07-19 — escena de seguridad perimetral pre-partido en estadio de fútbol chileno (referencia San Carlos de Apoquindo, sin logos reconocibles).
- **Procesamiento:** PNG → WebP @ q85 → 69KB. Path canónico `public/images/service-seguridad-deportiva.webp`.
- **Decisión:** se aceptó la provista sin regenerar; cumple el AVOID del Style Guide (sin club crests, sin sponsor logos, sin caras reconocibles, sin arquitectura específica identificable). Canon visual coherente con el resto del set.
- **No aplica** prompt de IA ni negativo — la imagen ya estaba validada por Kammler.

---

## 4. Parámetros de generación

| Parámetro | Default | Rango | Notas |
|---|---|---|---|
| `strength` (img2img) | 0.45 | 0.0-1.0 | Solo si la fuente es una foto staff. Para generación pura de cero, no aplica. |
| `guidance_scale` | 3.5 | 1.0-10.0 | |
| `num_inference_steps` | 28 | 20-50 | |
| `modelo` | `fal-ai/nano-banana-2` | nano-banana-2 / flux-pro / schnell | Gemini 3.1 Flash Image por default. |
| `resolución` | ver tabla §3 | 1K / 2K | 2K solo para heroes/escoltas/monitoreo. 1K para el resto. |
| `aspect_ratio` | ver tabla §3 | 16:9 / 4:3 | 16:9 para hero shots cinematográficos. 4:3 para cards estándar. |

---

## 5. Convenciones del proyecto

- **Carpeta pública:** `public/images/`
- **Naming canónico:** `service-{slug}.webp` (alineado con el patrón que ya usa el sitio en `index.astro:162` y `servicios/index.astro:41`)
- **Variantes WebP (Fase 3 del plan legacy, aún no implementado en guardman-astro):** desktop 1920/q85, tablet 1024/q65, mobile 640/q45 — ver `guardman-admin/docs/PLAN_IMAGENES_GUARDMAN_COMPLETO.md` §3 y §4 si se decide portar.
- **Negative prompt por servicio:** complementa los `AVOID` globales del Style DNA, no los reemplaza. Combinar ambos.

---

## 6. Lo que NO está en este documento (decisiones pendientes)

- **Variantes WebP responsive** (desktop/tablet/mobile) — el plan legacy las define, pero guardman-astro aún no las genera. Pregunta abierta: ¿se portan?
- **Workflow de asignación** (`media_entities`) — el plan legacy lo implementó contra D1; aquí no aplica todavía.
- **Endpoints de upload/img2img** (`/api/media/staff-upload`, `/api/media/fal/generate`) — propios del CMS legacy. Si se decide generar imágenes desde el admin de guardman-astro, hay que portar el flujo. Hoy el sitio solo consume imágenes estáticas desde `public/images/`.
- **Regeneración de imágenes existentes** — los 9 archivos `service-*.webp` ya están en disco. Este Style DNA es para regenerarlos con un canon consistente, o para crear los que falten. Decisión pendiente.
- **Prompts nuevos [NUEVO]** — los 6 prompts marcados como nuevos siguen el canon pero son propuesta inicial. Kammler debe validar tono, ángulos y nivel de detalle antes de portar a código.

---

## 7. Próximos pasos sugeridos (NO ejecutar todavía)

1. Kammler revisa los 6 prompts [NUEVO] y aprueba/edita cada uno.
2. Confirmar convención: ¿se mantiene `id: servicio-{slug}` o se renombra a `service-{slug}` para alinear con el patrón de archivos?
3. Confirmar si el Style DNA vive en `src/lib/image-prompts.ts` (uso programático) o solo como referencia markdown (documentación).
4. Decidir si se regeneran las 9 imágenes actuales con este canon o si solo se usa para huecos futuros.

---

*Documento creado 2026-07-19. Sin código modificado. Sin assets regenerados.*
