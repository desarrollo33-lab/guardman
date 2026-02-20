/**
 * Testimonials List Page
 */
import { GenericList } from "@/components/GenericList";

const columns = [
  { key: "author", label: "Autor" },
  { key: "company", label: "Empresa" },
  { 
    key: "rating", 
    label: "Rating",
    render: (row: any) => "⭐".repeat(row.rating || 0)
  },
  { 
    key: "verified", 
    label: "Verificado",
    render: (row: any) => row.verified ? "Sí" : "No"
  },
];

export function TestimonialsList() {
  return <GenericList resource="testimonials" columns={columns} title="Testimonios" />;
}
