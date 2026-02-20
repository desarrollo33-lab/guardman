/**
 * Communes List Page
 */
import { GenericList } from "@/components/GenericList";

const columns = [
  { key: "name", label: "Nombre" },
  { key: "slug", label: "Slug" },
  { key: "zone", label: "Zona" },
  { 
    key: "is_active", 
    label: "Activo",
    render: (row: any) => row.is_active ? "Sí" : "No"
  },
];

export function CommunesList() {
  return <GenericList resource="communes" columns={columns} title="Comunas" />;
}
