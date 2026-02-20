/**
 * Solutions List Page
 */
import { GenericList } from "@/components/GenericList";

const columns = [
  { key: "title", label: "Título" },
  { key: "slug", label: "Slug" },
  { 
    key: "is_active", 
    label: "Activo",
    render: (row: any) => row.is_active ? "Sí" : "No"
  },
];

export function SolutionsList() {
  return <GenericList resource="solutions" columns={columns} title="Soluciones" />;
}
