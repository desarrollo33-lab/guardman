/**
 * CTAs List Page
 */
import { GenericList } from "@/components/GenericList";

const columns = [
  { key: "page_slug", label: "Página" },
  { key: "headline", label: "Título" },
  { 
    key: "is_active", 
    label: "Activo",
    render: (row: any) => row.is_active ? "Sí" : "No"
  },
];

export function CTAsList() {
  return <GenericList resource="ctas" columns={columns} title="CTAs" />;
}
