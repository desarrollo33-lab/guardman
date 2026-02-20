/**
 * Generic CRUD List Component
 * 
 * Reusable list component for any resource.
 */

import { useList, useNavigation, useDelete } from "@refinedev/core";
import { useState } from "react";

interface Column {
  key: string;
  label: string;
  render?: (row: any) => any;
}

interface GenericListProps {
  resource: string;
  columns: Column[];
  title: string;
}

export function GenericList({ resource, columns, title }: GenericListProps) {
  const { result } = useList({ resource });
  const { create, edit, show } = useNavigation();
  const { mutate: deleteMutate } = useDelete();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const data = result?.data || [];

  const handleDelete = (id: string) => {
    if (confirm("¿Eliminar este registro?")) {
      setDeletingId(id);
      deleteMutate({ resource, id }, {
        onSettled: () => setDeletingId(null),
      });
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{title}</h1>
        <button
          onClick={() => create(resource)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
        >
          + Crear
        </button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-3 text-left text-sm font-semibold">
                  {col.label}
                </th>
              ))}
              <th className="px-4 py-3 text-right text-sm font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-4 py-8 text-center text-gray-500">
                  No hay registros
                </td>
              </tr>
            ) : (
              data.map((row: any) => (
                <tr key={row._id} className="hover:bg-gray-50">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3">
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => show(resource, row._id)} className="p-1 hover:bg-gray-100 rounded" title="Ver">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                      </button>
                      <button onClick={() => edit(resource, row._id)} className="p-1 hover:bg-gray-100 rounded" title="Editar">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                      </button>
                      <button 
                        onClick={() => handleDelete(row._id)} 
                        className="p-1 hover:bg-gray-100 rounded text-red-500" 
                        title="Eliminar"
                        disabled={deletingId === row._id}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
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
