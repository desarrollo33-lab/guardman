/**
 * Guardman Admin - Refine Application
 * 
 * Main application entry point with Refine, Convex data provider, and auth.
 */

import { Refine, Authenticated } from "@refinedev/core";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ConvexReactClient } from "convex/react";

import { createConvexDataProvider } from "./providers/convexDataProvider";
import { authProvider } from "./providers/authProvider";
import { ConvexAuthProviderWrapper } from "./providers/ConvexAuthProvider";

import { LoginPage } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { AdminLayout } from "./layouts/AdminLayout";

// Convex client configuration - use environment variable or fallback to local dev
const CONVEX_URL = import.meta.env.VITE_CONVEX_URL || 'https://opulent-cod-610.convex.cloud';
const convexClient = new ConvexReactClient(CONVEX_URL);

// Create data provider
const dataProvider = createConvexDataProvider(convexClient);

// Resource definitions for Refine
const resources = [
  { name: "services", label: "Servicios" },
  { name: "solutions", label: "Soluciones" },
  { name: "leads", label: "Leads" },
  { name: "communes", label: "Comunas" },
  { name: "blog_posts", label: "Blog" },
  { name: "heroes", label: "Heroes" },
  { name: "faqs", label: "FAQs" },
  { name: "testimonials", label: "Testimonios" },
  { name: "partners", label: "Partners" },
  { name: "industries", label: "Industrias" },
  { name: "ctas", label: "CTAs" },
  { name: "stats", label: "Estadísticas" },
  { name: "process_steps", label: "Procesos" },
  { name: "team_members", label: "Equipo" },
  { name: "company_values", label: "Valores" },
  { name: "authors", label: "Autores" },
  { name: "pages", label: "Páginas" },
  { name: "content_blocks", label: "Bloques" },
  { name: "site_config", label: "Configuración" },
];

/**
 * App content with Refine configuration
 */
function AppContent() {
  return (
    <Refine
      dataProvider={dataProvider}
      authProvider={authProvider}
      resources={resources}
    >
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route 
          path="/test" 
          element={
            <Authenticated key="admin" fallback={<Navigate to="/login" />}>
              <AdminLayout>
                <Dashboard />
              </AdminLayout>
            </Authenticated>
          }
        >
          {resources.map((resource) => (
            <Route
              key={resource.name}
              path={resource.name}
              element={
                <div className="p-6">
                  <h1 className="text-2xl font-bold mb-4">{resource.label}</h1>
                  <p className="text-gray-600">
                    CRUD para {resource.label} - En construcción
                  </p>
                </div>
              }
            />
          ))}
        </Route>
        <Route path="*" element={<Navigate to="/test" replace />} />
      </Routes>
    </Refine>
  );
}

/**
 * Main App component with Convex Auth Provider wrapper
 */
export default function App() {
  return (
    <BrowserRouter>
      <ConvexAuthProviderWrapper>
        <AppContent />
      </ConvexAuthProviderWrapper>
    </BrowserRouter>
  );
}
