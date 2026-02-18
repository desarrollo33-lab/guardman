import { defineMiddleware } from 'astro:middleware';

// Rutas que no requieren autenticación
const PUBLIC_ADMIN_ROUTES = ['/admin/login', '/api/admin/auth'];

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  // Solo procesar rutas /admin/*
  if (!pathname.startsWith('/admin')) {
    return next();
  }

  // Permitir rutas públicas de admin
  if (
    PUBLIC_ADMIN_ROUTES.some(
      (route) => pathname === route || pathname.startsWith(route + '/')
    )
  ) {
    return next();
  }

  // Verificar cookie de autenticación
  const authToken = context.cookies.get('admin_auth')?.value;

  if (!authToken || authToken !== 'authenticated') {
    // Redirigir a login si no está autenticado
    return context.redirect('/admin/login');
  }

  return next();
});
