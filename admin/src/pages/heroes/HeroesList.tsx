/**
 * Heroes List Page
 */
import { GenericList } from "@/components/GenericList";

const columns = [
  { key: "page_slug", label: "Página" },
  { key: "title", label: "Título" },
  { 
    key: "background_type", 
    label: "Tipo",
  },
  { 
    key: "is_active", 
    label: "Activo",
    render: (row: any) => row.is_active ? "Sí" : "No"
  },
];

export function HeroesList() {
  return <GenericList resource="heroes" columns={columns} title="Heroes" />;
}
