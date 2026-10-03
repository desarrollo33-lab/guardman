Cambio ajeno recuperado de un dangling blob (2026-10-03, sesión de copy).

Este cambio NO es parte del commit de auditoría de copy. Venía en el working
tree desde antes y se perdió al reescribir el archivo durante el staging
selectivo. Recuperado de `git cat-file -p e1c0945c9` y guardado acá para
reaplicarlo con el resto del trabajo de la sesión anterior.

Archivo afectado: `src/pages/ubicaciones/[slug].astro`
Contexto: bloque de props de `<BaseLayout>`, entre `location={locSchema}` y
`showCluster={true}`.

El diff es:

    location={locSchema}
+   localBusinessAt={locSchema ?? undefined}
    showCluster={true}
    clusterType="ubicacion"

Aparentemente reemplaza la prop `location` por `localBusinessAt`, que debe ser
el nombre real que espera `BaseLayout`. Verificar contra `src/layouts/BaseLayout.astro`
antes de aplicar: si `BaseLayout` ya acepta `localBusinessAt`, este cambio es
correcto y se aplica junto con el resto del trabajo pendiente de esa sesión.
Si no, es un cambio a medio hacer y hay que revisar de dónde salió.
