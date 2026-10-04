# Auditoría de duplicación — páginas servicio × comuna

**Fecha:** 2026-10-03
**Alcance:** 187 páginas en `dist/client/servicios/` (11 servicios × 17 rutas)
**Método:** comparación del texto visible renderizado, no del código. Cada página se compara contra el conjunto de sus hermanas del mismo servicio, con shingles de 5 palabras (Jaccard), que es más estable que comparar palabras sueltas.

Datos crudos: `AUDIT-DUPLICACION.json`. Scripts: `audit-duplicacion.mjs`, `audit-bloques.mjs`.

---

## 1. El número

| Servicio | Págs | Palabras | Similitud | Repetidas vs hermana |
|---|---|---|---|---|
| guardias-de-seguridad | 17 | 1.572 | 25% | 874 |
| monitoreo-24-7 | 17 | 1.377 | 23% | 745 |
| cctv-videovigilancia | 17 | 1.387 | 24% | 712 |
| auditoria-seguridad | 17 | 1.340 | 24% | 710 |
| seguridad-eventos | 17 | 1.325 | 24% | 704 |
| guard-pod | 17 | 1.312 | 23% | 701 |
| seguridad-industrial | 17 | 1.295 | 23% | 675 |
| seguridad-deportiva | 17 | 1.364 | 23% | 674 |
| escoltas-privados | 17 | 1.304 | 24% | 670 |
| control-de-accesos | 17 | 1.301 | 23% | 652 |
| aseo | 17 | 1.227 | 21% | 639 |

**Total: 251.668 palabras visibles, 131.852 repetidas — 52,4%.**

O sea: de cada dos palabras que un visitante lee en estas páginas, una ya la leyó en la página anterior.

---

## 2. Qué se repite exactamente

En `guardias-de-seguridad` aparecen **60 frases idénticas en las 16 páginas**. Desglose por origen:

### 2.1 El bloque de features (8 ítems) — andamiaje, no duplicación culpable

Los 8 features reescritos hoy aparecen íntegros en las 16 communes. Eso es correcto por diseño: describen el servicio, no el lugar. Un.feature de "guardias OS-10" es el mismo en Las Condes y en Quilicura.

**Esto no es un defecto.** Es contenido único de servicio reutilizado.

### 2.2 La FAQ completa (7 preguntas) — 100% replicada

Incluye "¿Cuánto cuesta contratar un guardia?", "¿Qué diferencia a GuardMan de otras empresas?", "¿En qué comunas de Santiago ofrecen servicios?". Las mismas 7 respuestas, palabra por palabra, en las 16.

Aquí sí hay problema: la FAQ se supone que responde lo que la persona le pregunta **a esa página**. "¿En quéUDAD de Santiago?" en la página de Quilicura y en la de Las Condes deserve la misma respuesta genérica.

### 2.3 `StaffSection` — 5 frases en las ~200 páginas del sitio

> "Personal que marca la diferencia" / "Nuestros guardias son la base de la confianza que los clientes depositan en nosotros" / "rigurosamente seleccionados y entrenados para proteger su patrimonio con profesionalismo"

No afirman nada comprobable. Un asistente no puede citarlas. Y se repiten 16 veces dentro del mismo servicio.

### 2.4 FAQ legal OS-10 (3 preguntas) — replicada

La FAQ de OS-10 que corregí hoy aparece en las 16. Es correcta, pero una página de "guardias en Quilicura" no es el lugar donde un buyer va a leer la definición legal de la certificación.

### 2.5 Bloques de navegación y cierre

"Antes de contratar este servicio", los 3 guías relacionadas, "También disponible en otras communes", "Cotizar para mi propiedad". Andamiaje de navegación: correcto que se repita.

---

## 3. Lo que SÍ es único por comuna

Cada página tiene entre 4 y 6 frases propias:

- El `intro` de la comuna (Vía `LOCATIONS[slug].intro`)
- Los `coveragePoints` derivados de `loc.features` (4 bullets)
- 1 FAQ de `loc.faqs`
- El nombre de la comuna en H1, title y breadcrumbs

**Eso son ~150-200 palabras únicas sobre 1.500.** La página dice en el H1 "Guardias de Seguridad en Las Condes" y 800 palabras más abajo vuelve a decir lo mismo que la de Vitacura.

---

## 4. El comentario que miente

`content.ts:3` dice:

> `// Contenido único por página, sin duplicaciones. Si una página de servicio y una de comuna repiten el mismo párrafo, se detecta aquí.`

Eso es falso. La página de servicio y la de comuna no se comparan, y la de servicio con la de otra comuna tampoco. No hay tal detección. El comentario hace creer que el problema está vigilado.

---

## 5. Defectos colaterales encontrados durante la medición

### 5.1 La FAQ de cobertura responde menos de lo que pregunta

Pregunta: **"¿En qué comunas de Santiago ofrecen servicios de guardias?"**
Respuesta: **"Tenemos presencia en 14 comunas de la Región Metropolitana."**

Los números son correctos (14 RM + 2 Valparaíso = 16). Pero:
- La pregunta dice "de Santiago" y hay 2 communes de Valparaíso que no aparecen.
- Si alguien pregunta "en qué comunas", la respuesta que da 14 de 16 es peor que no dar número: parece un error.

Está en `content.ts:76` y se replica en las 187 páginas.

### 5.2 Los nombres propios en minúscula dentro del copy

En la lista de enlaces a guías, dentro de una página de servicio:
> "el alcance legal de la figura que **vas** a contratar"

Tuteo en un sitio que en todos lados usa "usted". Aparece en las 187 páginas. Es el mismo bloque `SERVICE_BRIDGE`, compartido por los 11 servicios.

---

## 6. Qué NO recomiendo

**No recomiendo `noindex` en las 176 páginas.** Razones:

1. No hay evidencia de que estén perdiendo posiciones. Duplicación interna con títulos y H1 distintos es un caso normal de sitio de servicios local; Google routinely indexa muchas páginas que comparten bloques.
2. Sacarlas de índice tira a la basura 176 páginas que sí responden a búsquedas long-tail reales ("guardia de seguridad Las Condes", "cctv Quilicura").
3. Es una decisión con costo de recuperación alto y beneficio incierto.

**Lo que sí recomiendo, en orden:**

1. **Arreglar la FAQ de cobertura** (§5.1). Es un error real, está en 187 páginas, y se arregla en una línea.
2. **Quitar `StaffSection` de las páginas combo** o cambiarlo por un bloque con 2 datos concretos. Son 5 frases no verificables × 187 páginas.
3. **Sacar la FAQ legal OS-10 de las páginas de servicio** y dejarla solo donde responde ("¿qué es OS-10?", `/seguridad-privada/*`). En una página de "guardias en Quilicura" ocupa espacio y no responde la pregunta de esa URL.
4. **Medir antes de escribir 176 variantes.** El `LOCATIONS[slug]` de `content.ts` ya tiene `features`, `problems` y `faqs` por comuna, y el template ya los usa para `coveragePoints` y 1 FAQ. Ampliar a 3-4 features y 2 FAQs por comuna es viable con lo que ya existe en el repo, sin escribir 176 textos desde cero. Pero es un trabajo de horas, y primero hay que saber si esas páginas hoy captarían tráfico.

---

## 7. Lo que el experto SEO necesita decidir

Esto ya no es redacción ni medición; es estrategia, y necesita datos de indexación que no tengo:

- ¿Cuántas de las 187 páginas están realmente indexadas hoy?
- ¿Alguna_position de "servicio + comuna" convierte, o el tráfico entra por las páginas de servicio a secas?
- Si entran: vale la pena el trabajo de diferenciar. Si no: el problema no es la duplicación, es que no hay demanda local.

La medición de este documento responde **cuánto** se repite. No responde **si importa**. Eso necesita Search Console.
