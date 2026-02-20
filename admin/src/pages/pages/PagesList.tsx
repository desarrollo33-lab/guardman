/**
 * Pages List Page
 */
import { GenericList } from "@/components/GenericList";

const columns = [
  { key: "title", label: "Título" },
  { key: "slug", label: "Slug" },
  { 
    key: "is_published", 
    label: "Publicado",
    render: (row: any) => row.is_published ? "Sí" : "No"
  },
];

export function PagesList() {
  return <GenericList resource="pages" columns={columns} title="Páginas" />;
}
