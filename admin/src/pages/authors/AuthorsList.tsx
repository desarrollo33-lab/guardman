/**
 * Authors List Page
 */
import { GenericList } from "@/components/GenericList";

const columns = [
  { key: "name", label: "Nombre" },
  { key: "slug", label: "Slug" },
  { key: "role", label: "Rol" },
  { 
    key: "is_active", 
    label: "Activo",
    render: (row: any) => row.is_active ? "Sí" : "No"
  },
];

export function AuthorsList() {
  return <GenericList resource="authors" columns={columns} title="Autores" />;
}
