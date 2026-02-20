/**
 * Partners List Page
 */
import { GenericList } from "@/components/GenericList";

const columns = [
  { key: "name", label: "Nombre" },
  { key: "type", label: "Tipo" },
  { key: "order", label: "Orden" },
  { 
    key: "is_active", 
    label: "Activo",
    render: (row: any) => row.is_active ? "Sí" : "No"
  },
];

export function PartnersList() {
  return <GenericList resource="partners" columns={columns} title="Partners" />;
}
