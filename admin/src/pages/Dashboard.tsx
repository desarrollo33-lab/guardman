/**
 * Dashboard Page for Guardman Admin
 * 
 * Simple dashboard showing user is logged in.
 */

import { useGetIdentity } from "@refinedev/core";

export function Dashboard() {
  const { data: identity } = useGetIdentity();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-2">Bienvenido{identity?.name ? `, ${identity.name}` : ''}</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Has iniciado sesión como: <strong>{identity?.email}</strong>
        </p>
        {identity?.role && (
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Rol: <span className="capitalize">{identity.role}</span>
          </p>
        )}
      </div>
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Servicios</h3>
          <p className="text-2xl font-bold mt-2">-</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Leads</h3>
          <p className="text-2xl font-bold mt-2">-</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Blog Posts</h3>
          <p className="text-2xl font-bold mt-2">-</p>
        </div>
      </div>
    </div>
  );
}
