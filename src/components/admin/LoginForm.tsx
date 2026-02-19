import { useState } from 'react';
import { useAuthActions } from '@convex-dev/auth/react';
import { useConvexAuth } from 'convex/react';

type AuthFlow = 'signIn' | 'signUp';

/**
 * Login form component using Convex Auth.
 * Handles sign in and sign up with email/password.
 */
export default function LoginForm() {
  const { signIn } = useAuthActions();
  const { isLoading, isAuthenticated } = useConvexAuth();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [flow, setFlow] = useState<AuthFlow>('signIn');

  // Redirect if already authenticated
  if (!isLoading && isAuthenticated) {
    window.location.href = '/admin';
    return null;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    formData.set('flow', flow);

    try {
      await signIn('password', formData);
      // On success, redirect to admin
      window.location.href = '/admin';
    } catch (err) {
      console.error('Auth error:', err);
      setError(
        flow === 'signIn'
          ? 'Credenciales incorrectas. Intenta nuevamente.'
          : 'Error al registrar. Si ya tienes cuenta, intenta iniciar sesión.'
      );
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md w-full mx-4">
      <div className="bg-gray-800 rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white">Guardman Admin</h1>
          <p className="text-gray-400 mt-2">
            Ingresa tus credenciales para continuar
          </p>
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              autoComplete="email"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="admin@guardman.cl"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              autoComplete="current-password"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Ingresa la contraseña"
            />
          </div>

          {/* Hidden flow field for sign in/sign up */}
          <input type="hidden" name="flow" value={flow} />

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            {isSubmitting
              ? flow === 'signIn'
                ? 'Ingresando...'
                : 'Registrando...'
              : flow === 'signIn'
                ? 'Ingresar'
                : 'Registrarse'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => {
              setFlow(flow === 'signIn' ? 'signUp' : 'signIn');
              setError(null);
            }}
            className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
          >
            {flow === 'signIn'
              ? '¿No tienes cuenta? Regístrate'
              : '¿Ya tienes cuenta? Inicia sesión'}
          </button>
        </div>

        <div className="mt-4 text-center">
          <a
            href="/"
            className="text-gray-400 hover:text-gray-300 text-sm transition-colors"
          >
            &larr; Volver al sitio
          </a>
        </div>
      </div>
    </div>
  );
}
