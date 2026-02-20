/**
 * Site Config Page
 */
import { useList } from "@refinedev/core";

export function SiteConfigList() {
  const { result } = useList({ resource: "site_config" });
  const config = result?.data?.[0];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Configuración del Sitio</h1>
      {config ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Nombre de la Marca</label>
            <p className="text-lg">{config.brand_name}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Teléfono Principal</label>
            <p className="text-lg">{config.phone_primary}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">WhatsApp</label>
            <p className="text-lg">{config.whatsapp_number}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Email</label>
            <p className="text-lg">{config.email_contact}</p>
          </div>
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md">
            Editar Configuración
          </button>
        </div>
      ) : (
        <p className="text-gray-500">No hay configuración</p>
      )}
    </div>
  );
}
