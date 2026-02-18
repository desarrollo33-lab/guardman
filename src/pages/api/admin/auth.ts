import type { APIRoute } from 'astro';

// Contraseña por defecto para MVP (usar variable de entorno en producción)
const ADMIN_PASSWORD = import.meta.env.PUBLIC_ADMIN_PASSWORD || 'guardman2024';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const formData = await request.formData();
  const action = formData.get('action');

  // Logout
  if (action === 'logout') {
    cookies.delete('admin_auth', {
      path: '/',
    });
    return redirect('/admin/login');
  }

  // Login
  if (action === 'login') {
    const password = formData.get('password');

    if (password === ADMIN_PASSWORD) {
      // Set cookie de autenticación (válido por 24 horas)
      cookies.set('admin_auth', 'authenticated', {
        path: '/',
        maxAge: 60 * 60 * 24, // 24 horas
        httpOnly: true,
        secure: import.meta.env.PROD,
        sameSite: 'lax',
      });

      return redirect('/admin');
    }

    // Contraseña incorrecta
    return redirect('/admin/login?error=1');
  }

  // Acción no válida
  return redirect('/admin/login');
};
