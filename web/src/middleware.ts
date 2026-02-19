import { defineMiddleware } from 'astro:middleware';

// Rutas que no requieren autenticación
const PUBLIC_ADMIN_ROUTES = ['/admin/login', '/api/admin/auth'];

export const onRequest = defineMiddleware(async (context, next) => {
  return next();
});
