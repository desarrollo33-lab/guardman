/**
 * Leads List Page
 */
import { GenericList } from "@/components/GenericList";

const columns = [
  { key: "nombre", label: "Nombre" },
  { key: "telefono", label: "Teléfono" },
  { key: "email", label: "Email" },
  { key: "servicio", label: "Servicio" },
  { 
    key: "createdAt", 
    label: "Fecha",
    render: (row: any) => row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "-"
  },
];

export function LeadsList() {
  return <GenericList resource="leads" columns={columns} title="Leads" />;
}
