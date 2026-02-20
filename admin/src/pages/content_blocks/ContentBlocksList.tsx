/**
 * Content Blocks List Page
 */
import { GenericList } from "@/components/GenericList";

const columns = [
  { key: "page_slug", label: "Página" },
  { key: "type", label: "Tipo" },
  { key: "title", label: "Título" },
  { key: "order", label: "Orden" },
];

export function ContentBlocksList() {
  return <GenericList resource="content_blocks" columns={columns} title="Bloques de Contenido" />;
}
