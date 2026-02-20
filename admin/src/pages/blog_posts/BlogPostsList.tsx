/**
 * Blog Posts List Page
 */
import { GenericList } from "@/components/GenericList";

const columns = [
  { key: "title", label: "Título" },
  { key: "slug", label: "Slug" },
  { key: "author", label: "Autor" },
  { 
    key: "is_published", 
    label: "Publicado",
    render: (row: any) => row.is_published ? "Sí" : "No"
  },
];

export function BlogPostsList() {
  return <GenericList resource="blog_posts" columns={columns} title="Blog Posts" />;
}
