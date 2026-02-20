/**
 * Industries List Page
 */
import { GenericList } from "@/components/GenericList";

const columns = [
  { key: "name", label: "Nombre" },
  { key: "slug", label: "Slug" },
  { key: "order", label: "Orden" },
  { 
    key: "is_active", 
    label: "Activo",
    render: (row: any) => row.is_active ? "Sí" : "No"
  },
];

export function IndustriesList() {
  return <GenericList resource="industries" columns={columns} title="Industrias" />;
}
