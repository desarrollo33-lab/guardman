# Auditoría y propuesta de copy — GuardMan Chile

**Preparado para:** experto SEO de GuardMan
**Fecha:** 2026-10-03
**Alcance:** copy público completo de guardman.cl + benchmarking contra federalseguridad.cl, sicseguridad.cl y gard.cl
**Corpus descargado:** 1.081 páginas de competencia (Federal 400, SIC 400, GARD 281) en `research/copy-2026-10-03/`

> ⚠️ **Federal y SIC quedaron truncados.** El crawler tiene un tope de 400 páginas y ambos lo alcanzaron; sus sitios son más grandes. GARD terminó en 281, bajo el tope, y ese sí está completo. Los conteos de Federal y SIC son "al menos 400". Esto no afecta las conclusiones — el análisis se hizo sobre páginas representativas de cada sitio, incluyendo el home y páginas de servicio y de comuna — pero las cifras absolutas de "cuántas páginas tiene el competidor" no son definitivas. Para un conteo exacto hay que subir `MAX_PAGES` y volver a correr.

---

## Cómo leer este documento

Está dividido en cuatro bloques conessiveuga un objetivo distinto:

| Bloque | Qué contiene | Acción que requiere |
|---|---|---|
| **1. Errores** | Texto roto, cifras falsas, contradicciones. Verificado contra producción. | Corrección inmediata, sin debate |
| **2. Diagnóstico** | Por qué el copy suena "robótico". El patrón, no la lista. | Lectura |
| **3. Competencia** | Qué hacen mejor y qué NO copiar | Lectura |
| **4. Propuesta** | Copy reescrito, listo para implementar | Decisión comercial + aprobación |

El bloque 1 es separable: se puede aplicar entero sin tocar el tono. El bloque 4 requiere decisiones que son del cliente, no del redactor.

---

# BLOQUE 1 — Errores

Todo lo de esta sección está **verificado contra el sitio en producción**, no solo leído en el código. Cada punto indica si está publicado o pendiente.

## 1.1 Texto corrupto publicado

Estas no son preferencias de estilo. Son errores que un lector —o un asistente de IA que cite la página— va a ver.

| Ubicación | Texto publicado | Corrección |
|---|---|---|
| `src/lib/authority.ts:317` | `['Retener o hereafter?????????????? a una persona', 'Corresponde a Carabineros o a la justicia, no a seguridad privada']` | `Retener o detener a una persona` |
| `src/lib/authority.ts:318` | `['Purseguir a un sospechoso', ...]` | `Perseguir a un sospechoso` |
| `src/lib/authority.ts:65` | `a cargo de la Authority_ fiscalizadora` | `a cargo de la autoridad fiscalizadora` |
| `src/lib/authority.ts:65` | `una personaNatural cumple` | `una persona natural cumple` |
| `src/lib/authority.ts:128` | `El guardia de seguridad performs funciones` | `El guardia de seguridad performs funciones` → `realiza funciones` |
| `src/lib/authority.ts:247` | `para performar tareas de limpieza` | `para realizar tareas de limpieza` |
| `src/lib/authority.ts:136` | `Solicitando a la empresaIDOsu registro` | `Solicitando a la empresa IDO su registro` |
| `src/lib/soluciones.ts:65` | `estacionamientos y Dependencies náuticas de servicio` | **PUBLICADO en vivo.** Verificado en `/soluciones/condominio-seguridad-y-aseo` |
| `src/lib/soluciones.ts:128` | `son Decentralized compras por separado` | `son compras separadas por proveedor` |
| `src/lib/soluciones.ts:180` | `Un pasillo Blocked, un acceso con visibilidad reducida` | `Un pasillo bloqueado` |
| `src/lib/soluciones.ts:184` | `Las cámaras y los sensores están en ceilings` | `en plafones` |
| `src/lib/soluciones.ts:204` | `cocinas comunes, bathrooms y zonas de servicio` | `baños` |
| `src/lib/soluciones.ts:240` | `accesos peatonales, Including áreas de stationary de carga` | `incluidas áreas de tránsito de carga` |
| `src/lib/soluciones.ts:517` | `técnicos, Untributors IRTido y vehículos` | `proveedores, contratistas y vehículos` |
| `src/lib/soluciones.ts:537` | `zonas de itrANSITO` | `zonas de tránsito` |
| `src/lib/guias.ts:136` | `se traduce en Either un gasto de más` | `en un gasto de más` |
| `src/lib/guias.ts:158` | `Muchos sitios answered "cuántos guardias necesito"` | `Muchos sitios responden "cuántos guardias necesito"` |
| `src/lib/guias.ts:468` | `las empresas pcs autorizadas` | `las empresas autorizadas` |
| `src/lib/guias.ts:469` | `estáFuera del sistema legal` | `está fuera del sistema legal` |
| `src/lib/guias.ts:477` | `Una empresa con Processes ordenado` | `Una empresa con procesos ordenados` |
| `src/lib/guias.ts:484` | `El punto donde más se differentiates a las empresas` | `se diferencia` |
| `src/lib/guias.ts:484` | `uno que intermediates` | `uno que intermedia` |
| `src/lib/guias.ts:101` | `tanto para la BSDBs sostenida del guardia` | `tanto para la carga sostenida del guardia` |
| `src/lib/content.ts:65` | `Sistema de backup con personal de reserva` | `Sistema de relevo con personal de reserva` |
| `src/lib/soluciones.ts:15` (comentario) | `pérdida` con caracteres corruptos | Sin impacto en producción |

**Nota sobre `authority.ts`:** la corrupción **no llega al `llms.txt` público** (verificado). Pero sí se renderiza en las páginas `/seguridad-privada/*`, que son exactamente las que el sitio ofrece como fuente citable. Un asistente que lea el HTML, o un humano que abra esa ficha, la ve.

### Por qué el guard de anglicismos no las atrapa

`tests/anglicismos.test.ts` existe y funciona. Es una lista de ~20 términos: `security`, `staff`, `stakeholders`, `click here`, `learn more`. Ninguna de las palabras corrompidas está ahí. `Bathrooms`, `Blocked`, `ceiling`, `stationary`, `Either`, `answered` pasan el test.

No es que el guard falle: es que **una lista de palabras no detecta texto de máquina mal traducido**. La diferencia real entre "anglicismo discutible" y "cadena corrupta" es que la primera se puede buscar por palabra y la segunda no. Un corrector ortográfico de español la encontraría; el guard actual no la busca.

**Propuesta:** agregar un test de patrón de palabra pegada (`[a-zá-ú]{2,}[A-Z][a-z]{2,}`) y una lista corta de residuos en inglés dentro de frase. Es un guard distinto al de anglicismos, con otro objetivo. Ver §4.6.

## 1.2 Contradicción legal sobre quién otorga la OS-10

El sitio dice cuatro cosas distintas, en cuatro archivos, sobre el mismo hecho.

**La fuente correcta** (`authority.ts:93`, con link a la norma en `authority.ts:141`):

> "Hasta 2025, la acreditación se gestionaba directamente ante Carabineros. La Ley 21.659 trasladó la autorización a la Subsecretaría de Prevención del Delito, aunque se mantuvo la fiscalización a cargo de Carabineros."

**Lo que dicen las páginas comerciales:**

| Ubicación | Texto |
|---|---|
| `content.ts:74` (FAQ, va a JSON-LD) | "la autorización que **otorga Carabineros de Chile**" |
| `content.ts:167` | "autorización de la **Autoridad Administrativa Laboral**" ← tercer organismo, mismo archivo |
| `constants.ts:540` | "emitida por la **Prefectura de Seguridad Privada de Carabineros**" |
| `servicios/index.astro:65` | "emitida por la **Prefectura de Seguridad Privada de Carabineros de Chile**" |
| `TrustSignals.astro:8` | "Vigente, **autorizada por Carabineros** de Chile" |

**Verificado contra fuente oficial** (Oficio de la Cámara de Seguridad Privada, sept. 2025, y Decreto 209 de 2025): la Ley 21.659 estableció la **Subsecretaría de Prevención del Delito** como órgano rector, con la atribución de **otorgar** autorizaciones y certificaciones. Carabineros de Chile queda como **autoridad fiscalizadora**, con dependencia técnica en la Prefectura de Seguridad Privada OS-10.

La distinción importa por dos razones:

1. **Legalmente es incorrecto.** Decir que Carabineros otorga la autorización, cuando desde el 28-11-2025 la autoriza la Subsecretaría, es un error en una página de venta.
2. **Es la FAQ que más se cita.** `content.ts:74` va al JSON-LD. Es la definición de OS-10 que un asistente va a citar cuando alguien pregunte qué es OS-10. Si cita a Carabineros, el error se propaga.

**Texto propuesto** (unifica los cinco lugares):

> "La Ley 21.659, vigente desde el 28 de noviembre de 2025, trasladó la autorización de la acreditación OS-10 a la Subsecretaría de Prevención del Delito, del Ministerio de Seguridad Pública. Carabineros de Chile conserva la fiscalización, a través de la Prefectura de Seguridad Privada OS-10."

## 1.3 Cifras que no cuadran entre sí

### La comuna que el home niega

`index.astro:416` publica esta lista:

> "Atendemos en Las Condes, Vitacura, Lo Barnechea, La Reina, Santiago Centro, Huechuraba, Quilicura, Conchalí, Pudahuel, Renca, Lampa y La Pintana, además de Los Andes y San Felipe."

Son 12 de la RM. Faltan **Providencia** y **Ñuñoa**, que están en `LOCATIONS` (`constants.ts:151-152`), tienen página propia (`/ubicaciones/providencia`, `/ubicaciones/nunoa`) y aparecen en la navegación del sitio.

Dos párrafos más arriba, el mismo home dice "cobertura en 16 comunas: 14 en la RM y 2 en Valparaíso". Y `/nosotros:46` dice 16. El home se contradice consigo mismo a 300 caracteres de distancia.

El comentario de `content.ts:9-19` documenta que este bug ya se corrigió una vez ("le decía a un lead de Providencia que no lo cubrimos, cuando Providencia nos trae leads"). Quedó vivo en el home.

**Causa raíz:** la lista de `index.astro:416` está escrita a mano, y la lista `ZONAS` (`content.ts:1107`) está desactualizada: le faltan Providencia y Ñuñoa. Como `index.astro:90` hace `ZONAS.find(...) ?? 'Centro'`, **ambas communes se pintan como Zona Centro en el mapa del home**. Falso por construcción y silencioso.

**Corrección:** derivar de `LOCATIONS`, eliminar `ZONAS`.

### Cifras sin respaldo

| Cifra | Dónde | Problema |
|---|---|---|
| `200+ guardias` | 12 lugares, incluido el hero | La línea de tiempo (`content.ts:1102`) dice "2023 — Expansión a 200+ guardias". La cifra no se movió en 3 años. Competidores publican 250 vs 1.000 en la misma página y se contradicen; nosotros publicamos 200+ congelado en 2023. |
| "cientos de empresas" | `nosotros.astro:71,256`, `contacto.astro:121` | No hay número, ni logo de cliente, ni testimonial que lo respalde. |
| `4.5M` vs `1.5M+` usuarios de Ajax | `ajax-systems.astro:23` y `:73` | Dos bloques de cifras en la misma página, con números distintos. Ninguno con fuente. |
| `95% menos falsas activaciones`, `0.3 s` | `ajax-systems.astro:7,10` | Specs del fabricante presentadas como propias, sin atribución. |
| `$3.000.000` / `minPrice: 350000` | `guard-pod.astro:128`, `seo.ts:260` | Contradice la regla escrita en `authority.ts:12-14`: "Prohibido publicar ratios de dotación, **tarifas** ni operativas sensibles". Además el precio del JSON-LD no está visible en la página, lo que viola la guía de datos estructurados de Google. |
| `14` en `HERO_STATS` | `content.ts:1094` | La constante `STATS` ya se eliminó en 2026-10-03 **precisamente porque** ese `COMUNAS: '14'` era falso. El mismo número sobrevive en un array que nadie renderiza. Bomba latente. |

## 1.4 Errores de escritura y de concordancia

| Ubicación | Error | Corrección |
|---|---|---|
| `Footer.astro:44` | **"Ver las 16 communes →"** | `comunas`. Francés, en el footer de las ~242 páginas |
| `nosotros.astro:120` | "y **un central** de monitoreo" | `una central de monitoreo` |
| `canal-de-denuncias.astro:60` (meta) | "denuncias **anónimo**" | `anónimas`. En la meta de la página de cumplimiento legal |
| `nosotros.astro:120` | "un central de monitoreo que no terceriza" | Además: `tercerizar` está en la lista de anglicismos pero pasó el guard |
| `LeadForm.astro:372` | "**Usa** formato" (tú) vs `:370` "**Ingrese** su nombre" (usted) | Unificar |
| `gracias.astro:19` | "**Recibirás** una propuesta" (tú) vs `:43` "**la** revisará y **lo** contactará" | Unificar; además son dos referentes para la misma persona |
| `canal-de-denuncias.astro:190` | "**Declaro** que... **actúo** de buena fe" (tú) en una declaración legal | `Declaro`/`Actúo` es correcto en formato declarativo, pero rompe el tratamiento |
| `nosotros.astro:36,43` | "Ley 21.659 **vigente desde 2024**" | `authority.ts:155` dice 28-11-2025. 2024 es la publicación, no la vigencia |

## 1.5 Bugs técnicos que afectan al copy

| Ubicación | Bug | Impacto |
|---|---|---|
| `[service]/[location].astro:275,386,249,261` | `svc.name.toLowerCase()` | **PUBLICADO.** Verificado: `/servicios/guard-pod/las-condes` renderiza **"Por qué elegir guardpod en Las Condes"**. Con `ppi` también. 176 páginas afectadas |
| `nosotros.astro:74` | `<a href="#historia">` | El id no existe. Enlace muerto en la página institucional |
| `index.astro:354` | `</section>` huérfano | HTML inválido |
| `BaseLayout.astro:294-295` | `Tiempo de lectura: 3 min` hardcodeado | Se emite en las 242 páginas, incluyendo fichas de comuna de 1.000+ palabras |
| `nosotros.astro:74` | "Conocer nuestra historia" → `#historia` | Sin destino |

---

# BLOQUE 2 — Diagnóstico

## 2.1 Lo que el cliente percibe como "robótico" no es el tono: es la estructura

El copy no suena a robot por tener palabras raras. Suena a robot por una razón medible: **el 70% del texto visible son enumeraciones de sustantivos sin verbo**.

Ejemplo real, el FAQ que más se cita (`content.ts:77`):

> "Nos diferenciamos por nuestro central de monitoreo propio 24/7, verificación rigurosa de antecedentes, academia interna de capacitación, vehículos de reacción rápida y el Guardpod, nuestro sistema autónomo de vigilancia. Más de 10 años y 200+ guardias certificados nos respaldan."

Cinco sustantivos, cero verbos, remate de dos líneas. Compárese con lo que dice el competidor:

> "Guardias certificados OS10, central de monitoreo 24/7 y tecnología propia OPAI para proteger operaciones en 10 ciudades de Chile."

Mismo número de elementos. En un caso hay un verbo y una consecuencia; en el otro, una lista.

**El patrón, medido en el sitio:**

1. **Listas de 5-8 elementos con la misma construcción.** El bloque `features` de cada servicio tiene 6-8 ítems, todos con la forma `[sustantivo] + [participio] + [complemento]`. En `/servicios/guardias-de-seguridad`: "Verificación exhaustiva de antecedentes", "Supervisión nocturna preventiva", "Protocolos adaptados por sector", "Academia de capacitación continua", "Vehículos de reacción rápida", "Comunicación radial permanente", "Reportes digitales diarios", "Guardias de reemplazo garantizados". Ocho títulos, ocho sustantivos, cero verbos. Es la mayor superficie de sensación mecánica del sitio.

2. **Adjetivación que no califica nada.** "Rigurosa", "exhaustiva", "eficiente", "continua", "permanente", "estratégicamente", "óptima". La mayoría califica el sustantivo, no la promesa.

3. **Remates que el cliente ya pidió eliminar.** "Lo que más le importa" aparece **5 veces** (`nosotros.astro:70`, `LeadCTA.astro:33`, `HowItWorks.astro:32`, `Footer.astro:19`, `index.astro:408`). Es la frase hecha del rubro, y está en el H1 de la página institucional.

4. **Interjecciones mecánicas.** "Por supuesto." abre 8 FAQs distintas. "Exactamente." abre 4. La misma palabra con punto, 12 veces.

5. **Backlog de cobertura cruda en el texto.** `COVERAGE_PHRASE_LONG` inyecta "16 comunas: 14 en la Región Metropolitana y 2 en Valparaíso" en el hero, en descripciones y en párrafos. Es bookkeeping, no beneficio. Está bien como dato estructurado; está mal como frase.

## 2.2 El H1 del home

> "Seguridad Privada Profesional en Santiago de Chile"

No es un remate. Es un placeholder. "Profesional" no distingue a nadie — es la categoría, no la ventaja. Compite contra cualquier empresa del rubro con el mismo titular. Dice dónde, no qué ni por qué.

Y la página tiene dos activos que el H1 no menciona: un producto propio ([[Guardpod]]) y una categoría que casi nadie tiene ([[PPI]]). El titular descarta lo único que sí diferencia.

## 2.3 El sub del home: 60 palabras, 6 claims

> "Proteja su empresa, condominio o evento con guardias certificados OS-10, monitoreo propio 24/7 y el sistema autónomo Guardpod, una tecnología exclusiva en el mercado chileno. Más de 10 años de experiencia, 200+ guardias certificados y cobertura en 16 comunas: 14 en la Región Metropolitana y 2 en Valparaíso."

Imperativo publicitario de apertura, tres servicios, un superlativo sin respaldo ("exclusiva en el mercado chileno"), y tres cifras apiladas al final, la última de ellas aritmética de cobertura. Nadie lee 60 palabras de una vez. Y el superlativo se contradice 200 palabras más abajo (`index.astro:157`: "tecnología propia que ninguna otra empresa de seguridad ofrece en el país") — repetido, no confirmado.

## 2.4 La sensación de que el copy "no habla de seguridad"

Auditando el vocabulario, el sitio usa términos de operación: OS-10, rondas, control de accesos, bitácora, CCTV, NVR, biométrico, escolta.

Lo que **no** usa, y es el lenguaje del mandante técnico: dotación, plantel, puestos, esquema de turnos, reposición, entrega de turno, faena, cobertura efectiva. El competidor GARD usa 11 de esos términos en una sola página de servicio.

Para un jefe de mantenimiento o un administrador de condominio —que es quien decide— "dotación de 2 puestos con cobertura 12x6 y reposición garantizada" significa algo. "Sistema de backup con personal de reserva" también, pero suena a traducción. El sitio tiene el contenido correcto y el vocabulario equivocado.

## 2.5 Duplicación: qué sirve a ninguna audiencia

| Bloque | Páginas | Problema |
|---|---|---|
| `services/[service]/[location].astro:124,130` | 176 páginas | `features.slice(0,8)` y `faqs.slice(0,5)` **sin variación por comuna**. Por cada comuna solo cambia el párrafo introductorio, 4 bullets y 1 FAQ. El `replace(/Las Condes\|la comuna/g, loc.name)` de la línea 131 es código muerto: no encuentra nada |
| `ubicaciones/[slug].astro:75,92,221` | 16 páginas | Párrafo idéntico en las 16 |
| `StaffSection.astro:13-17` | ~200 páginas | "rigurosamente seleccionados y entrenados", "respaldados por una historia de confianza y resultados". No afirman nada comprobable: un asistente no puede citarlos |
| `index.astro:407-408` | home | "Protección profesional para su tranquilidad" / "atención personalizada de un equipo que conoce su comuna". Repetido del hero |
| `content.ts:397-403` | aseo | 4 `trustPoints` escritos y **nunca renderizados**. `grep` confirma que ningún componente los lee |
| `nosotros.astro:180,200` | 1 | "Estos cuatro principios..." / "Estos son los cinco pilares que sostienen nuestra propuesta de valor." Anuncian el número de la lista siguiente. Nadie cuenta. "Propuesta de valor" es jerga de deck |

El comentario de `content.ts:3` dice *"Contenido único por página, sin duplicaciones"*. No es cierto desde al menos octubre.

## 2.6 CTAs

60 CTAs en el sitio. Tres variantes para la misma acción:

| Variante | Veces | Veredicto |
|---|---|---|
| "Cotizar" | header, todas las páginas | **Débil.** El CTA más visible del sitio es una palabra sin objeto |
| "Solicitar cotización" | 11× | Ambiguo. ¿Cotizar qué? |
| "Cotizar ahora" | 10× | Débil. "Ahora" es el adverbio vacío del e-commerce |
| "Hablar con un experto" | 9× | Débil. ¿Experto en qué? |
| "Contactar a un experto" | 1× | Tercera variante del mismo CTA |
| "Cotizar ahora" (con A mayúscula) | 1× | Inconsistencia de producción |

Los que sí funcionan, y son el modelo a replicar:

- **"Denunciar ahora"** (`canal-de-denuncias.astro:79`) — intención obvia, sin fricción comercial
- **"Solicitar evaluación"** (`guias/*`) — dice qué recibes, y es distinto de cotizar
- **"Cotizar solución integrada"** (`soluciones/*`) — nombra el objeto, único por página

## 2.7 Titles y metas

| Title actual | Problema |
|---|---|
| `Ajax Systems en Chile sin Contrato y con App GuardMan Chile` | **Truncado a media frase.** El corte deja "...con App GuardMan Chile", que no significa nada |
| `Canal de Denuncias Ley 20.393 21.595 21.643 GuardMan Chile` | Tres números de ley y nada más. Patrón explícito de keyword stuffing |
| `Nosotros GuardMan Chile Seguridad Privada desde 2014` | Bolsa de keywords: cuatro campos sueltos, marca en el medio |
| `Cotización de Seguridad Privada en 24 Horas` | El title dice "24 Horas"; la página dice "24 **horas hábiles**". En un title no hay dónde matizar |
| `Guardpod Sistema Autónomo de Vigilancia 24/7 GuardMan Chile` | Sin "Chile", para un producto que se vende por exclusividad nacional |
| `Contacto 24/7 GuardMan Chile Seguridad Privada` | Desperdicia 14 caracteres y repite lo que ya está en el dominio |
| `Seguridad Privada OS-10 Santiago GuardMan Chile` | El único que no está roto. Y desperdicia 14 caracteres que podrían llevar los servicios |

---

# BLOQUE 3 — Competencia

## 3.1 Federal Seguridad (federalseguridad.cl) — 400+ páginas (truncado)

Cadena nacional, Shopify. **No compite por precio**: cero montos en las 400 páginas descargadas. Compite por certificación + tecnología + alcance.

**Lo que hace bien:**

- **Traduce laOTS a aritmética.** "¿Cuántos puntos de guardias necesitas? 1 punto de guardias contempla 4 guardias." Quita la barrera de no saber qué comprar.
- **Un compromiso operativo medible.** "Te contactamos en menos de 60 segundos ante cualquier alerta." Una sola cifra, verificable, exigible. Es lo que nosotros no tenemos.
- **Ancla en la ley, no en adjetivos.** "Contar con seguridad certificada OS10 fortalece tu posición ante auditorías, licitaciones y pólizas de seguro." Traduce la certificación a un beneficio que le importa al comprador: no quedar abajo en una licitación.
- **Cede una capa gratis del producto.** "Federal Access Lite / Registra ingresos y salidas en tiempo real / SIN COSTO", repetido 5 veces por página.

**Lo que no hay que copiar:**

- **Cifras que se contradicen.** "19 años" en unos lados, "Más de una década" en el hero, "5.000 clientes" con una oficina y 600 guardias.
- **Tres ceros en el home.** Las métricas están animadas desde `data-target`; el HTML estático muestra `0`, `0`, `0`. Con JS bloqueado, o para un crawler, la landing promete "más de una década" con tres ceros.
- **Encabezados vacíos.** "NUESTROS CLIENTES" es un `<h2>` con el div de logos vacío. Federal no tiene prueba social de cliente, solo la afirma.
- **Cero vocabulario de terreno.** PPI, escolta, RIE, asomo, ffpp, reposición: 0 coincidencias en las 400 páginas descargadas. Federal habla el idioma de la compra y deja vacío el del oficio.
- **Errores de plantilla visibles.** "nuestros guardias controlorán y reportarán todo acceso de visitasy colaboradores", "prevención de accedicentes", "Imagen CTA Responsive" (el nombre interno de un asset, escrito en la página).

## 3.2 GARD Security (gard.cl) — 281 páginas

**Lo que hace bien:**

- **Hero con cuatro sustantivos, cero adjetivos.** "Guardias certificados OS10, central de monitoreo 24/7 y tecnología propia OPAI para proteger operaciones en 10 ciudades de Chile." Cada palabra se puede verificar o rechazar.
- **Microcopy de SLA pegado al CTA.** "Respuesta en menos de 12 horas hábiles" bajo el botón. Responde la única objeción real del formulario B2B antes de que se formule.
- **Cada cifra con su condición de medición.** "30 min / Tiempo de respuesta promedio / **Zona urbana Santiago, medido sobre contratos activos**". El subtítulo es el activo; el número solo.
- **Enseña al cliente a auditar a su proveedor actual, antes de vender.** La página OS-10 da 5 pasos, incluido "Consulta el RUT de cada guardia en el sistema de Carabineros". Entrega el control al mandante y después presenta su propia auditoría como respuesta natural. Es la táctica más defendible del sitio.
- **Declara a quién no atiende.** "No operamos seguridad residencial ni condominios", "No somos una filial extranjera ni un marketplace de vigilantes". Decir a quién no atienden es más eficiente que cualquier adjetivo de superioridad.
- **Honestidad como argumento.** "El promedio de la industria en RM oscila entre 30 y 45 minutos según informes del sector, por lo que nuestro desempeño está en el rango bajo del mercado **sin inflar la cifra**". Es lo opuesto a la escritura publicitaria inflada.
**Lo que no hay que copiar:**

- **Cifras que se contradicen dentro de la misma página.** "250 guardias activos" y 17 líneas más abajo "Más de 1.000 guardias".
- **Historia que no cuadra.** "fundada en 2022" contra una línea de tiempo que arranca en 2018.
- **Tres registros en el mismo funnel:** tú en el home, usted en `/contacto`, voseo rioplatense en un pillar ("Solicitá la cotización... recibís"). Voseo + tú en la misma oración, en copy chileno.
- **OS-10 sobreinflada hasta ser relleno.** Aparece en eyebrow, hero, barra flotante, formulario, footer, los 8 títulos de ciudad y además tiene página propia. Cuando el 90% del mensaje es "somos OS10", deja de ser diferenciador.
- **Dos direcciones distintas.** Una en `/contacto`, otra en el footer de las 281 páginas.

## 3.3 SIC Seguridad (sicseguridad.cl) — 400+ páginas (truncado)

**Nota de método:** el crawler se detuvo en el tope de 400 páginas, y el sitio es más grande. Lo que sí es sólido: el home completo, las páginas de servicio y el patrón del programa local SEO. SIC es un **programa local×vertical**: familias de servicio × communes, incluyendo regiones fuera de Santiago (Antofagasta, Talcahuano, San Felipe) y verticales mineras. El home tiene 987 palabras; el resto promedia 352, y las páginas de comuna rondan 250-300. Es el competidor más comparable a GuardMan en tamaño y ciclo de venta, y también el que más se le parece en estructura: programa local SEO, sin presupuesto de contenido.

**Lo que hace bien:**

- **H1 = keyword exacta + comuna, sin adjetivo.** "Empresa de Seguridad Privada en Las Condes". Compite literal en la búsqueda que la persona ya escribió.
- **Cierre con entregables, no con urgencia falsa.** "Recibirás una propuesta personalizada con **dotación OS10, plan de rondas, monitoreo CCTV y protocolos ajustados**". Cuatro objetos, en el idioma del mandante.
- **KPI nombrados uno por uno.** "Reportes de desempeño con indicadores KPI: rondas realizadas, tiempos de respuesta, incidentes verificados y cumplimiento de protocolos". Convierte "supervisión" en algo auditable — el argumento que un cliente de alto ticket compra.
- **Operación verificable como diferencial.** "Cada patrulla cuenta con comunicación directa con la central, registro digital y GPS", "bitácoras digitales y auditorías internas". Detalle de proceso, no adjetivo.
- **Nombre de producto para el CCTV.** El menú ofrece `Seguridad Privada Empresas` y `Sala de Monitoreo CCTV` como dos líneas separadas. Convierte una característica en un motivo de comparación.
- **La FAQ responde la objeción legal, no la decorativa.** Una sola pregunta por página: "¿El personal cuenta con acreditación OS10?", y responde el proceso. Nadie más en el set lo hace.

**Lo que no hay que copiar:**

- **Contradicción numérica autoinfligida, en la misma pantalla.** El párrafo dice "más de 7 años de experiencia"; el contador inmediatamente anterior dice `+8 Años`. Y el contador dice `+100 Guardias`; la FAQ dice "más de 90 guardias activos". Rompe la credibilidad en el bloque exacto que debería convencer.
- **Superlativo en la meta.** "El mejor servicio de seguridad privada para empresas" es lo primero que ve un buscador, y nada en el sitio lo respalda.
- **Prueba social sin prueba.** "Han confiado en nosotros" sobre 7 imágenes con `alt="logos2"`, sin un solo nombre de cliente. Y "¿Por qué Escogernos?" son 5 adjetivos: "Puntualidad y responsabilidad", "Soporte tecnológico y operativo", "Personal capacitado y experimentado".
- **Relleno de comuna.** "Esta distinguida comuna", "en esta exclusiva zona de Santiago", "esta comuna de prestigio", "el bullicioso Santiago". Es el mismo párrafo con la palabra reemplazada.
- **Error de fabricación visible en el 43% del sitio.** "SIC Seguridad , agradece" — espacio antes de la coma, en 223 ocurrencias en 118 archivos, por un resaltado roto. Se lee como documento automatizado sin revisar.
- **180 de 212 páginas sin FAQ, sin cifras y sin cierre contextual.** Las páginas que capturan tráfico real no responden "¿tienen OS-10?", "¿cuántas personas?", "¿en qué plazo?".

**El hallazgo más útil para GuardMan:** SIC usa OS-10 **15 veces en 212 páginas**, concentrated en el home y una página de Santiago. Las páginas de comuna —las que capturan tráfico— no lo mencionan. GARD hace lo contrario: OS-10 en cada título de ciudad. Federal lo sobreinfla hasta volverlo relleno. **Nadie de los tres ha resuelto cómo dosificar la certificación según la página.** Ese es un espacio libre.

## 3.4 Tabla comparativa

| Dimensión | GuardMan | Federal | GARD | SIC |
|---|---|---|---|---|
| Cifras verificables por terceros | ❌ ninguna | ❌ (y se contradicen) | ✅ 4.9★ / 57 reseñas | ❌ (se contradicen) |
| Prueba social de cliente | ❌ ninguna | ❌ encabezado vacío | ✅ 12 logos con categoría | ❌ 7 PNG sin nombre |
| Compromiso operativo medible | ❌ | ✅ "60 segundos" | ✅ "30 min, medido sobre contratos activos" | ✅ KPI nombrados |
| Vocabulario de terreno | ⚠️ parcial | ❌ cero | ✅ 11 términos | ❌ cero |
| Cifra con condición de medición | ❌ | ❌ | ✅ sí | ❌ |
| Enseña a auditar al competidor | ❌ | ❌ | ✅ RUT en Carabineros | ❌ |
| Dice a quién no atiende | ❌ | ❌ | ✅ explícito | ⚠️ "para empresas" |
| Dosiﬁca OS-10 por página | ⚠️ en todas | ❌ en todo | ❌ en todo | ❌ solo home |
| Se contradice a sí mismo | ⚠️ cobertura y OS-10 | ⚠️ cifras | ⚠️ cifras y fundación | ⚠️ cifras en home |
| Contenido de fondo | ✅ **el mejor** | ⚠️ medio | ⚠️ medio | ❌ bajo |

**La conclusión del benchmarking es incómoda:** GuardMan tiene el mejor contenido escrito de los tres (guías legales de 500+ palabras, marco normativo, FAQ técnicas) y la peor ejecución de superficie. Federal y GARD tienen menos contenido y más señal.

Nuestra ventaja de contenido existe. El problema es que está enterrado bajo 176 páginas de enumeración mecánica.

---

# BLOQUE 4 — Propuesta

## 4.0 Principio rector

Tres reglas, derivadas de la restricción del cliente (copy sin remate) y del skill de copywriting:

1. **Titular declarativo, palabras mínimas, que distinga dos cosas en vez de impresionar.**
2. **Un sustantivo, un verbo, una consecuencia.** Si un bloque de 5 elementos no tiene un verbo, es un catálogo, no un argumento.
3. **Si una cifra no se puede defender, se borra.** No se suaviza.

## 4.1 Hero del home

### H1 — actual
> Seguridad Privada Profesional en Santiago de Chile

### Opciones

**Opción A** — nombra el activo propio
```
Guardia OS-10 y vigilancia autónoma en 16 comunas
```
*Rationale:* "Guardia OS-10" es la categoría que se busca. "Vigilancia autónoma" es lo que la competencia no tiene. Es la única combinación en el sitio donde el titular dice algo que los otros tres no pueden decir.

**Opción B** — la propuesta de valor en una línea
```
Guardias OS-10, central propia y una unidad que trabaja sola
```
*Rationale:* tres elementos, un verbo, una consecuencia. "Trabaja sola" es concreto y verificable contra cualquier competidor con guardias. Sin superlativo.

**Opción C** — por vertical
```
Seguridad privada para empresas y condominios en Santiago
```
*Rationale:* el más sobrio. No destaca, pero es el más honesto si el H1 tiene que servir a Google por encima de la conversión. Es el que menos gana y el que menos pierde.

**Recomendación:** A. Es la que más se diferencia y la que mejor coincide con lo que el sitio ya tiene construido (producto propio + certificación).

### Sub — actual
> "Proteja su empresa, condominio o evento con guardias certificados OS-10, monitoreo propio 24/7 y el sistema autónomo Guardpod, una tecnología exclusiva en el mercado chileno. Más de 10 años de experiencia, 200+ guardias certificados y cobertura en 16 comunas: 14 en la Región Metropolitana y 2 en Valparaíso."

60 palabras, 6 claims, superlativo sin respaldo, aritmética de cobertura al final.

### Opciones

**Opción A** — un claim por frase
```
Guardias con certificación OS-10, una central de monitoreo propia
y el Guardpod, que vigila sin guardia en Memoria. La misma empresa
responde por las tres.
```
*Rationale:* elimina el superlativo, hace verificable "propia" y "sin guardia en terreno", y cierra con la consecuencia real (un solo número, una sola responsabilidad). 3 frases, 47 palabras.

**Opción B** — desde el problema del cliente
```
Si el guardia falta, la respuesta no puede ser esperar a que
llegue otro. Tenemos central propia, relevo y unidad autónoma
para los turnos que no se pueden cubrir.
```
*Rationale:* abre en la objeción real del mandante (cobertura de turnos), no en la lista de productos. Más largo pero attacks the actual reason people don't switch.

**Opción C** — mínimo
```
Guardias OS-10, central de monitoreo propia y Guardpod.
Todo bajo la misma responsabilidad.
```
*Rationale:* 16 palabras. Para la auditoría deperformance, es el que mejor sobrevive.

**Recomendación:** A para el home, C para páginas de servicio.

### CTA

**Actual:** "Solicitar Cotización" (aparece 4 veces en el home, dos en la misma pantalla).

**Propuesta:**
- Primario: `Cotizar para mi propiedad`
- Secundario: `Llamar ahora` (el número va en `SITE.PHONE`, no hardcodeado — hoy `index.astro:144` lo escribe a mano mientras `:411` usa la constante)

Elimina la repetición del mismo CTA 4 veces. Cada bloque de la página que hoy repite "Solicitar Cotización" debería tener un objeto distinto.

## 4.2 El bloque de features (el problema mecánico principal)

**Actual** (`content.ts:57-66`, `/servicios/guardias-de-seguridad`), 8 ítems:

> Verificación exhaustiva de antecedentes / Supervisión nocturna preventiva / Protocolos adaptados por sector / Academia de capacitación continua / Vehículos de reacción rápida / Comunicación radial permanente / Reportes digitales diarios / Guardias de reemplazo garantizados

**Propuesta** — reducir a 5 y poner verbo en cada uno:

```
1. Revisamos los antecedentes de cada guardia antes de asignarlo
2. El turno de noche se supervisa desde nuestra central, no por teléfono
3. El protocolo se escribe para su propiedad antes de empezar
4. Si falta un guardia, entra uno de reserva y usted se entera quién
5. Al final de cada turno queda un registro que puede revisar
```

*Rationale:* cada línea responde una pregunta que el mandante ya se hace. La 4 es la que más vende: la cobertura efectiva es la obsesión real del sector. "Guardias de reemplazo garantizados" promete lo mismo que "si falta un guardia, entra uno de reserva", pero en el idioma del cliente y con la consecuencia (que se entere quién).

**Aplicar a los 11 servicios.** El cambio es de forma, no de contenido: los 8 ítems actuales ya dicen lo que deben decir.

## 4.3 FAQ que más se cita (`content.ts:77`)

**Actual:**
> "Nos diferenciamos por nuestro central de monitoreo propio 24/7, verificación rigurosa de antecedentes, academia interna de capacitación, vehículos de reacción rápida y el Guardpod, nuestro sistema autónomo de vigilancia. Más de 10 años y 200+ guardias certificados nos respaldan."

**Propuesta:**
> "Tenemos central de monitoreo propia y más de 10 años. La diferencia no es el listado: es que cuando salta una alarma, contesta nuestro operador y sale nuestro guardia. En la mayoría de las empresas esas dos cosas las hacen proveedores distintos."

*Rationale:* elimina la enumeración, elimina el "nos respaldan", y convierte la ventaja abstracta ("somos integrados") en una escena concreta que el lector puede visualizar. La última frase es una comparación que no necesita difamación: describe la estructura típica del rubro.

## 4.4 FAQ de OS-10 (`content.ts:74`)

**Actual:**
> "La certificación OS-10 es la autorización que otorga Carabineros de Chile a las personas que desean trabajar como guardias de seguridad privada. Es un requisito legal indispensable. En GuardMan Chile, todos nuestros guardias mantienen esta certificación vigente, lo que garantiza formación en uso de la fuerza, primeros auxilios, control de accesos y normativa legal."

**Propuesta** (corrige §1.2 y añade el beneficio que Federal sí usa):
> "OS-10 es la acreditación que exige la ley para trabajar como guardia de seguridad privada. Desde la Ley 21.659, que entró en vigor el 28 de noviembre de 2025, la autoriza la Subsecretaría de Prevención del Delito y la fiscaliza Carabineros de Chile. Todos nuestros guardias la mantienen vigente, y se la podemos entregar con fechas para que la verifique usted mismo."

*Rationale:* corrige el organismo, agrega el beneficio verificable (el cliente puede comprobarlo), y sigue el patrón de Federal de traducir la certificación a una consecuencia concreta.

## 4.5 Sistema de CTAs

| Contexto | Actual | Propuesto |
|---|---|---|
| Header | "Cotizar" | "Cotizar para mi propiedad" |
| Home, bloque 1 | "Solicitar Cotización" | "Cotizar para mi propiedad" |
| Home, bloque cobertura | "Solicitar cotización" | "Cotizar cobertura en {comuna}" |
| Página de servicio | "Cotizar ahora" | "Cotizar {servicio} en {comuna}" |
| Guías | "Solicitar evaluación" | *mantener* — ya funciona |
| Soluciones | "Cotizar solución integrada" | *mantener* — ya funciona |
| Canal denuncias | "Denunciar ahora" | *mantener* — ya funciona |

**Regla:** un CTA por pantalla, con objeto. Donde dos bloques de la misma página repiten CTA, el segundo cambia de objeto o desaparece.

## 4.6 Guard de copy corrupto

El guard de anglicismos actual es una lista de palabras. Para la corrupción que encontramos hace falta otro test, con otro criterio:

**Detección de residuo de traducción automática:**
- Patrón de palabra pegada: `[a-zá-ú]{2,}[A-Z][a-z]{2,}` (detecta `laBSDBs`, `empresapcs`, `conProcesses`, `estáFuera`)
- Lista corta de verbos y sustantivos en inglés que aparecen en el corpus pero no en español válido: `processes`, `differentiates`, `intermediates`, `answered`, `performs`, `performar`, `hereafter`, `either`, `blocked`, `ceilings`, `bathrooms`, `stationary`, `including`, `designing`, `decentralized`
- Run de `?{3,}` (el `authority.ts:317`)

**Regla de escape:** el mismo criterio de `CODIGO` que ya existe en `anglicismos.test.ts`, para no comer SQL ni identificadores.

Este guard es complementario, no reemplaza al actual. Kammler ya decidió que "app", "partner" y "email" están bien: ese archivo no se toca.

## 4.7 Qué NO se propone cambiar

- **El tono formal de "usted".** Es el correcto para un canal B2B con canal de denuncias. Los cuatro casos de tuteo (`LeadForm`, `gracias`, `canal-de-denuncias`) se unifican a "usted", no al revés.
- **El `lead` de las guías legales.** Son el mejor contenido del sitio: específicas, con fuentes, escritas desde la objeción real del comprador. GARD y Federal no tienen nada comparable. No se tocan.
- **La estructura de `/seguridad-privada/*`.** Es la familia que justifica el posicionamiento AEO. Solo se corrigen los errores de §1.1.
- **`ai-train=no, search=yes, ai-input=yes`.** Coherente con lo que el cliente declaró. No se toca.

---

# BLOQUE 5 — Orden de ejecución

## 5.1 Ahora, sin debate (corrección de errores)

Sin decisión comercial, sin cambio de tono. Todo el §1.

1. Texto corrupto: 26 ubicaciones en 4 archivos (§1.1)
2. `Footer.astro:44` — "communes" → "comunas"
3. `nosotros.astro:120` — "un central" → "una central"
4. `canal-de-denuncias.astro:60` — "denuncias anónimo" → "anónimas"
5. `index.astro:416` + `ZONAS` — derivar cobertura de `LOCATIONS` (§1.3)
6. `toLowerCase()` en 4 lugares → quitar (§1.5)
7. `#historia` roto, `</section>` huérfano
8. Mezcla tú/usted en 4 puntos

**Criterio de cierre:** ninguna de estas palabras debe aparecer en producción. Verificable con `grep` sobre el HTML servido, con cache-bust.

## 5.2 Requiere decisión del cliente

Antes de escribir, hace falta un sí/no:

| Cifra | Pregunta |
|---|---|
| `200+ guardias` | ¿Es defendible? Si sí, actualizar con la cifra real de 2026. Si no, borrar. **Hoy está congelada en 2023 y la competencia se contradice con cifras peores** |
| "cientos de clientes" | ¿Cuántos son? Si no hay número, se borra |
| `minPrice`/`maxPrice` en `seo.ts` | La regla del `authority.ts` prohíbe publicar tarifas. ¿Se saca el JSON-LD? |
| `$3.000.000` (guard-pod) | Contradice la misma regla |
| Specs de Ajax (95%, 0.3s, 4.5M) | ¿Se atribuyen al fabricante? |
| Texto OS-10 §1.2 | Requiere visto bueno del cliente. El texto propuesto sigue la norma oficial |

## 5.3 Después, con aprobación

1. Hero: H1, sub, CTA (§4.1)
2. Bloque `features` de los 11 servicios (§4.2)
3. FAQ de diferenciación y FAQ de OS-10 (§4.3, §4.4)
4. Sistema de CTAs (§4.5)
5. Titles y metas rotas (§2.7)
6. `StaffSection` — reescribir o eliminar (~200 páginas)
7. Eliminar el bloque `features`/`faqs` sin variación en las 176 páginas combo, o marcar esas páginas para revisión de indexación

## 5.4 Métrica de control

Después de aplicar, dos números para verificar:

- **Ocurrencias de "lo que más le importa", "nunca fue tan fácil", "la combinación perfecta", "soluciones integrales"** → debe quedar en 0.
- **Bloques de texto visible sin verbo en frases de más de 8 palabras** → debería bajar de ~70% a menos de 30%.

---

## Anexo — Corpus de investigación

```
research/copy-2026-10-03/
├── crawl.mjs              crawler (sitemap multinivel, politeness, HTML + texto + manifest)
├── scan-copy.mjs          detector de inglés y palabras pegadas
├── federalseguridad/      400 páginas (truncado en el tope) — html/ + text/ + manifest.json
├── sicseguridad/          400 páginas (truncado en el tope) — html/ + text/ + manifest.json
└── gard/                  281 páginas (completo) — html/ + text/ + manifest.json
```

Dos cosas que el crawler tuvo que resolver y que conviene saber si se repite el análisis:

1. **Sitemaps de índice.** Federal (Shopify) y SIC (WordPress/Yoast) no publican un sitemap de URLs, sino un índice que apunta a sub-sitemaps. Sin una segunda pasada, el crawl se queda con 1 página por sitio.
2. **Filtro por host.** Muchos sitemaps declaran `www.` mientras el sitio redirige al naked domain. Descartar las URLs que no coinciden con el host de entrada deja el crawl en 1 página.

`MAX_PAGES = 400` en `crawl.mjs:38` es el tope que truncó Federal y SIC. Subirlo y volver a correr da el conteo real.
