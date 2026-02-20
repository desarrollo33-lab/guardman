/**
 * FAQs List Page
 */
import { GenericList } from "@/components/GenericList";

const columns = [
  { key: "question", label: "Pregunta" },
  { key: "category", label: "Categoría" },
  { key: "order", label: "Orden" },
  { 
    key: "is_active", 
    label: "Activo",
    render: (row: any) => row.is_active ? "Sí" : "No"
  },
];

export function FAQsList() {
  return <GenericList resource="faqs" columns={columns} title="FAQs" />;
}
