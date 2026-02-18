# Guardman Chile

Sitio web corporativo para Guardman, empresa de seguridad privada en Chile.

## Desarrollo

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Build de producción
npm run build
```

## Google Sheets Integration

La integración con Google Sheets permite recibir notificaciones de nuevos leads automáticamente en una hoja de cálculo.

### Requisitos

- Cuenta de Google
- Acceso a Google Sheets y Google Apps Script

### Configuración

#### 1. Crear Google Sheet

1. Ve a [Google Sheets](https://sheets.google.com)
2. Crea una nueva hoja de cálculo
3. Nómbrala "Guardman Leads" (o el nombre que prefieras)

#### 2. Configurar Apps Script

1. En tu Google Sheet, ve a **Extensiones > Apps Script**
2. Borra el código por defecto
3. Copia el contenido de `scripts/google-apps-script.js` y pégalo en el editor
4. Guarda el proyecto (Ctrl+S)

#### 3. Configurar encabezados

Ejecuta la función `setupHeaders` desde el editor de Apps Script:

- Selecciona `setupHeaders` en el dropdown de funciones
- Click en "Ejecutar"
- Esto creará los encabezados automáticamente

#### 4. Desplegar como Web App

1. Click en **Implementar > Nueva implementación**
2. Click en el ícono de llave > **Aplicación web**
3. Configura:
   - Descripción: "Webhook Leads"
   - Ejecutar como: "Yo"
   - Quién tiene acceso: "Cualquier persona"
4. Click en **Implementar**
5. Copia la URL generada (formato: `https://script.google.com/macros/s/XXX/exec`)

#### 5. Configurar variable de entorno

Agrega la URL a tu archivo `.env`:

```env
GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/TU_ID/exec
```

### Probar la integración

Con el servidor de desarrollo corriendo:

```bash
# Verificar que el endpoint está configurado
curl http://localhost:4321/api/webhooks/sheets

# Enviar un lead de prueba
curl -X POST http://localhost:4321/api/webhooks/sheets \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Test Usuario",
    "telefono": "+56912345678",
    "servicio": "Guardias de Seguridad"
  }'
```

Revisa tu Google Sheet para verificar que el lead aparece.

### Estructura de datos

Los leads contienen los siguientes campos:

| Campo        | Requerido | Descripcion         |
| ------------ | --------- | ------------------- |
| nombre       | Si        | Nombre del contacto |
| telefono     | Si        | Numero de telefono  |
| email        | No        | Correo electronico  |
| servicio     | Si        | Servicio solicitado |
| ciudad       | No        | Ciudad de origen    |
| mensaje      | No        | Mensaje adicional   |
| source       | No        | Origen del lead     |
| utm_source   | No        | Parametro UTM       |
| utm_medium   | No        | Parametro UTM       |
| utm_campaign | No        | Parametro UTM       |

## Scripts disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run preview      # Preview del build
npm run lint         # Ejecutar ESLint
npm run lint:fix     # Corregir errores de ESLint
npm run format       # Formatear código con Prettier
npm run format:check # Verificar formato
npm run typecheck    # Verificar tipos de TypeScript
npm run check        # Ejecutar todos los checks
```

## Stack tecnológico

- [Astro](https://astro.build) - Framework SSR
- [React](https://react.dev) - Componentes interactivos
- [Convex](https://convex.dev) - Backend y base de datos
- [Tailwind CSS](https://tailwindcss.com) - Estilos
- [Vercel](https://vercel.com) - Hosting
