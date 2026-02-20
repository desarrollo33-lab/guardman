/**
 * Services List Page
 * 
 * Displays a list of all services with CRUD actions.
 */

import { useList, useDelete, useNavigation } from "@refinedev/core";

interface Service {
  _id: string;
  slug: string;
  title: string;
  description: string;
  is_active?: boolean;
  order?: number;
}

export function ServicesList() {
  const { result } = useList<Service>({
    resource: "services",
  });

  const isLoading = false; // Simplified for now
  const { edit, show, create } = useNavigation();
  const { mutate: deleteMutate } = useDelete();

  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de eliminar este servicio?")) {
      deleteMutate({
        resource: "services",
        id,
      });
    }
  };

  const services = result?.data || [];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Servicios</h1>
        <button
          onClick={() => create("services")}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
        >
          <span>+</span> Crear Servicio
        </button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">Título</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Slug</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Orden</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Activo</th>
              <th className="px-4 py-3 text-right text-sm font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                    <span className="ml-2">Cargando...</span>
                  </div>
                </td>
              </tr>
            ) : services.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  No hay servicios
                </td>
              </tr>
            ) : (
              services.map((service: Service) => (
                <tr key={service._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{service.title}</td>
                  <td className="px-4 py-3 text-gray-500">{service.slug}</td>
                  <td className="px-4 py-3">{service.order || "-"}</td>
                  <td className="px-4 py-3">
                    <span className={service.is_active ? "text-green-600" : "text-gray-400"}>
                      {service.is_active ? "Sí" : "No"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => show("services", service._id)}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="Ver"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => edit("services", service._id)}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="Editar"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(service._id)}
                        className="p-1 hover:bg-gray-100 rounded text-red-500"
                        title="Eliminar"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
