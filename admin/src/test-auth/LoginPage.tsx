/**
 * Login Page Component
 * 
 * Tests the login flow with Convex Auth password provider.
 */

import { useState } from "react";
import { useLogin, useIsAuthenticated } from "@refinedev/core";
import { Navigate } from "react-router-dom";

export function LoginPage() {
  const { mutate: login } = useLogin();
  const { data: authData } = useIsAuthenticated();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // If already authenticated, redirect to test page
  if (authData?.authenticated) {
    return <Navigate to="/test" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    login(
      { email, password },
      {
        onSuccess: (data) => {
          setIsLoading(false);
          if (!data.success) {
            setError(data.error?.message || "Login failed");
          }
        },
        onError: (err) => {
          setIsLoading(false);
          setError(err.message || "Login failed");
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">
          Guardman Admin Login
        </h1>
        <p className="text-gray-400 text-sm mb-6 text-center">
          Auth Test: Refine + Convex Auth
        </p>

        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-6 p-4 bg-gray-700/50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-300 mb-2">Test Instructions:</h3>
          <ul className="text-xs text-gray-400 space-y-1">
            <li>• Enter your Convex Auth credentials</li>
            <li>• On success, you'll be redirected to /test</li>
            <li>• useGetIdentity() should return user info</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
